import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { NotifierService } from 'angular-notifier';
import { ToastrService } from 'ngx-toastr';
import PatternLock from 'patternlock';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  postRequest = false;
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  ipblock = true;validatepattern:any;lock:any;


  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: ConnectionService, private auth: AdminauthService, private notifier: NotifierService, private toastr: ToastrService) { 
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
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.validatepattern=new PatternLock('#patternLock',{
      // onDraw(pattern){
      //   this.lock=pattern
      //   console.log(this.lock)
      // }
    })
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    var loginObj: any;
    loginObj = this.loginForm.value;
    var pattern =this.validatepattern.getPattern()
    loginObj.pattern=pattern;
    this.postRequest = true;
    this.dataService.chklogin(loginObj).subscribe((resData: any) => {
      if (resData.status == true) {
        this.toastr.success(resData.success);
        this.auth.setSession(resData.Key);
        setTimeout(() => {
          return this.router.navigateByUrl(this.returnUrl);
        }, 600);

      } else {
        this.postRequest = false;
        if (resData.status == 401) {
          this.router.navigate(['error-pages/404']);
        }
        if (resData.success == 401) {
          this.toastr.error(resData.msg);
        }else{
          this.toastr.error(resData.error);
        }
      }
    });
  }
}
