import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-sitesettings',
  templateUrl: './sitesettings.component.html',
  styleUrls: ['./sitesettings.component.scss']
})
export class SitesettingsComponent implements OnInit {
  token = localStorage.getItem('Key'); 
  postRequest = false;
  settingsForm: FormGroup;
  submitted = false;
  returnUrl: string;
  ipblock = true;
  referral: any;
  siteData = { 'site_name': "", 'contact_mail': "",  'contactnumber': "", 'site_mode': "",  'copyright': "", 'facebook': "",  'twitter': "", 'linkedin': "", 'telegram': "",  'referral': "", 'royality': "" , 'instagram':"", 'skype':""}

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: ConnectionService, private auth: AdminauthService, private notifier: NotifierService) {
    this.dataService.getData('admin/blockip').subscribe(reqData => {
      if (reqData.status == false) {
        this.ipblock = true;
        this.router.navigate(['error-pages/404']);
      } else {
        this.ipblock = false;
      }
    });

    this.returnUrl = '/dashboard';
    if (this.dataService.getSession('id')) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  ngOnInit() {
    this.settingsForm = this.formBuilder.group({
      site_name: ['', [Validators.required]],
      contact_mail: ['', [Validators.required]],
      contactnumber: ['', [Validators.required]],
      site_mode: ['', [Validators.required]],
      copyright: ['', [Validators.required]],
      facebook: ['', [Validators.required]],
      twitter: ['', [Validators.required]],
      linkedin: ['', [Validators.required]],
      telegram: ['', [Validators.required]],
      instagram: ['', [Validators.required]],
      skype: ['', [Validators.required]],
    });

    this.dataService.getData('admin/settings').subscribe(reqData => {
      if(reqData) {
        this.siteData = reqData.data;
        this.settingsForm.patchValue({
          site_name: this.siteData.site_name, 
          contact_mail: this.siteData.contact_mail, 
          contactnumber: this.siteData.contactnumber, 
          site_mode: this.siteData.site_mode, 
          copyright: this.siteData.copyright, 
          facebook: this.siteData.facebook, 
          twitter: this.siteData.twitter, 
          linkedin: this.siteData.linkedin, 
          telegram: this.siteData.telegram,
          instagram: this.siteData.instagram,
          skype: this.siteData.skype,

        });
      }
    });
  }

  get f() { return this.settingsForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.settingsForm.invalid) {
      this.notifier.notify('error', "Please fill all fields");
      return;
    }
    var obj: any;
    obj = this.settingsForm.value;
    this.postRequest = true;
    this.dataService.postRequest('admin/site_settings', obj, this.token).subscribe((resData: any) => {
      if (resData.status == true) {
        this.siteData = resData.data;
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
