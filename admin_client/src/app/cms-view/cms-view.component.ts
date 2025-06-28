import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-cms-view',
  templateUrl: './cms-view.component.html',
  styleUrls: ['./cms-view.component.scss']
})
export class CmsViewComponent implements OnInit {
  token = localStorage.getItem('Key');
  cmsId: any;
  formVal: any;
  cmsForm: FormGroup;
  isLoading = false;
  postRequest = false;
  submitted = false;
  cmsInfo = { 'pagetype': "", 'pagetitle': "",  'pagecontent': ""}
  public Editor = ClassicEditor; 

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private actRoute: ActivatedRoute, private notifier: NotifierService, private formBuilder: FormBuilder) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
    this.actRoute.params.subscribe((params) => {
      this.cmsId = params['id'];
      let obj = { "cmsId": this.cmsId };
      this.dataService.postRequest('cms/getcmsInfo', obj, this.token).subscribe((resData: any) => {
        if(resData) {
          this.cmsInfo = resData.data;
          this.isLoading = true;

          this.cmsForm.patchValue({
            pagetype: this.cmsInfo.pagetype, 
            pagetitle: this.cmsInfo.pagetitle, 
            pagecontent: this.cmsInfo.pagecontent, 
          });          
        } else {
          this.notifier.notify('error', resData.msg);
        }
      });
    });
  }

  ngOnInit() {
    this.cmsForm = this.formBuilder.group({
      pagetype: ['', [Validators.required]],
      pagetitle: ['', [Validators.required]],
      pagecontent: ['', [Validators.required]],
    });
  }

  get f() { return this.cmsForm.controls; }

  htmlContent = '';
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
    // uploadUrl: 'v1/image',
    // upload: (file: File) => { ... },
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

  onSubmit() {
    this.submitted = true;
    if (this.cmsForm.invalid) {
      this.notifier.notify('error', "Please fill all fields");
      return;
    }
    this.formVal = this.cmsForm.value;
    var obj: any;
    obj = { "cmsId": this.cmsId, "pagetype": this.formVal.pagetype, "pagetitle": this.formVal.pagetitle, "pagecontent": this.formVal.pagecontent };
    this.postRequest = true;
    this.dataService.postRequest('cms/cmsUpdate', obj, this.token).subscribe((resData: any) => {
      if (resData.status == true) {
        this.cmsInfo = resData.data;
        this.notifier.notify('success', "Updated Successfully");
      } else {
        this.postRequest = false;
        this.notifier.notify('error', resData.error);
        if (resData.status == 401) {
          this.router.navigate(['error-pages/404']);
        }
      }
    });
  }
}
