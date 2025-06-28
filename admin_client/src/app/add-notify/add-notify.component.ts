import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-notify',
  templateUrl: './add-notify.component.html',
  styleUrls: ['./add-notify.component.scss']
})
export class AddNotifyComponent implements OnInit {
  token = localStorage.getItem('Key');
  id: any;
  formVal: any;
  cmsForm: FormGroup;
  isLoading:any = false;
  postRequest:any = false;
  submitted:any = false;
  notifyInfo:any={};
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
  }

  ngOnInit() {};

  submitData(form:NgForm){
    var data = form.value;
    if(data.status == undefined){ return this.notifier.notify('error', "Please select Valid status");}
    if(data.category == undefined || data.category == ''){ return this.notifier.notify('error', "Please Enter Valid Category");}
    if(data.message == undefined || data.message == ''){ return this.notifier.notify('error', "Please Enter Valid Message");}
    data.type = 'system Notice';
    this.dataService.postRequest('admin/addNotify', data, this.token).subscribe((resData: any) => {
      if(resData.success == 1){
        this.notifier.notify('success', 'Updated Added !');
        this.router.navigateByUrl('/notify');
      }else{
        this.notifier.notify('error', resData.msg);
      }
      this.isLoading = true;
    });
  }
}
