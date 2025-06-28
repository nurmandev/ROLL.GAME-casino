import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-notify-info',
  templateUrl: './notify-info.component.html',
  styleUrls: ['./notify-info.component.scss']
})
export class NotifyInfoComponent implements OnInit {
  token = localStorage.getItem('Key');
  id: any;
  formVal: any;
  cmsForm: FormGroup;
  isLoading:any = false;
  postRequest:any = false;
  submitted:any = false;
  notifyInfo:any;
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
    toolbarHiddenButtons: [
      ['bold']
      ],
    uploadWithCredentials: false,
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private actRoute: ActivatedRoute, private notifier: NotifierService, private formBuilder: FormBuilder) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
    this.actRoute.params.subscribe((params) => {
      this.id = params['id'];
      let obj = { "nofityId": this.id };
      this.dataService.postRequest('admin/getnotifyInfo', obj, this.token).subscribe((resData: any) => {
        if(resData.success == 1){
          this.notifyInfo = resData.data;
        }else{
          this.notifier.notify('error', resData.msg);
          this.router.navigateByUrl('/notify');
        }
      });
    });
  }

  ngOnInit() {};

  submitData(form:NgForm){
    var data = form.value;
    data.Id = this.id;
    this.dataService.postRequest('admin/ManageNotify', data, this.token).subscribe((resData: any) => {
      if(resData.success == 1){
        this.notifier.notify('success', 'Updated Successfully');
        this.router.navigateByUrl('/notify');
      }else{
        this.notifier.notify('error', resData.msg);
      }
      this.isLoading = true;
    });
  }
}
