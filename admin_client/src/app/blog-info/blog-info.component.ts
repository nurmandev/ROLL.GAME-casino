import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-blog-info',
  templateUrl: './blog-info.component.html',
  styleUrls: ['./blog-info.component.scss']
})
export class BlogInfoComponent implements OnInit {
  token = localStorage.getItem('Key');
  blogImg:any=[];currencyName:any="";
  currency1MBErr:any=false; currencyTypeErr:any=true;

  id: any;
  formVal: any;
  cmsForm: FormGroup;
  isLoading:any = false;
  postRequest:any = false;
  submitted:any = false;
  blogInfo:any;
  public Editor:any = ClassicEditor; 

  htmlContent:any = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '15rem',
    minHeight: '5rem',
    maxHeight: 'auto',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarPosition: 'top',
    sanitize: false,
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
    toolbarHiddenButtons: [['bold']],
    uploadWithCredentials: false,
    customClasses: [
      {name: "quote",class: "quote",},
      {name: 'redText',class: 'redText'},
      {name: "titleText",class: "titleText",tag: "h1",},
    ]
  };

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private actRoute: ActivatedRoute, private notifier: NotifierService, private formBuilder: FormBuilder) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
    this.actRoute.params.subscribe((params) => {
      this.id = params['id'];
      let obj = { "blogId": this.id };
      this.dataService.postRequest('admin/getBlogInfo', obj, this.token).subscribe((resData: any) => {
        if(resData.success == 1){
          this.blogInfo = resData.data;
          console.log(this.blogInfo.image);
        }else{
          this.notifier.notify('error', resData.msg);
          this.router.navigateByUrl('/blog');
        }
      });
    });
  }
  ngOnInit() {};
  onFileSteptwo(file:any){
    const reader = new FileReader();
    if(file.files.length > 0){
      reader.readAsDataURL(file.files[0]);
      reader.onload = (_event) => {
        this.blogInfo.image = reader.result;
      }
      this.blogImg = file.files;
      this.currencyName = file.files[0].name;
      let file_size = parseFloat(file.files[0].size) / 1024 / 1024;
      if(file_size >= 2){this.currency1MBErr = true;}
      else{this.currency1MBErr = false;}
      if(['image/png', 'image/jpeg', 'image/svg+xml', 'image/jpg'].includes(file.files[0].type)){
        this.currencyTypeErr = true;
      }else{this.currencyTypeErr = false;}
    }
  }

  submitData(form:NgForm){
    var data = form.value;
    data.Id = this.id;
    const formData: any = new FormData();
    var files: Array<File> = this.blogImg;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        var fileName = files[i]['name'];
        var filenames = fileName.split('.');
        var lastValue = filenames.length - 1;
        var FileName = 'blog_pic.' + filenames[lastValue];
        formData.append("blog_pic", files[i], FileName);
      }
    }
    data.image = this.blogInfo.image;
    Object.keys(data).forEach(function(key) {
      formData.append(key, data[key]);
    });
    this.dataService.filePostRequest('admin/updateblog', formData, this.token).subscribe((res: any) => {
      if(res.success == 1){
        this.router.navigate(['/blog']);
        this.notifier.notify('success', res.msg);
      }else{
        this.notifier.notify('error', res.msg);
      }
    })
  }
}
