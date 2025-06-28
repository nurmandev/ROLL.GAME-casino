import { Component, OnInit,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { NgForm } from '@angular/forms';
import PatternLock from 'patternlock';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  token = localStorage.getItem('Key');
  p:any = 0;limit:any = 10;totalCount:any;page:any = 0;
  isLoading = false; view:any = "All"; tradeData : any = {};
  lower:any; upper:any; len:any; num:any; spec:any; oldpassmatch:any; confirmPass:any = ""; newpwd:any = ""; errconpass:any; newpassmatch:any;

  // validatepattern:any;lock:any;checkPattern1:any=false;msgPattern:any=2;msgErr:any=2;
  // validatepattern1:any;match:any=false;
  // validatepattern2:any;

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private notifier: NotifierService) {
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    //pattern1
    // this.validatepattern = new PatternLock('#patternLock',{
    //   onDraw: (pattern) => {
    //     this.onPatternDraw(pattern);
    //   }
    // });
    // //pattern2
    // let unlockPattern:any;
    // this.validatepattern1 = new PatternLock('#patternLock1',{
    //   onDraw:(pattern)=>{
    //     // this.validatepattern1.setPattern();
    //     unlockPattern=this.validatepattern1.getPattern()
    //   }
    // });
    // //pattern2
    // this.validatepattern2 = new PatternLock('#patternLock2',{
    //   onDraw:(pattern)=>{
    //     let siginpattern:any;
    //     siginpattern=this.validatepattern2.getPattern();
    //     if(unlockPattern === siginpattern){
    //       this.msgErr=1;
    //       this.match=true;
    //     }else{
    //       this.msgErr=0;
    //       this.match=false;
    //     }
    //   }
    // });
  }

  typePwd(pwd) {
    this.newpwd = pwd;
    if (pwd != null && pwd != undefined && pwd != "") {
      this.lower = true; this.upper = true; this.len = true; this.num = true; this.spec = true;
      let lowerChars = /[a-z]/g;
      let upperChars = /[A-Z]/g;
      let numbers = /[0-9]/g;
      let specials = /\W|_/g;
      if (pwd.length < 8) { this.len = false; return; }
      if (pwd.match(lowerChars) == null) { this.lower = false; return; }
      if (pwd.match(upperChars) == null) { this.upper = false; return; }
      if (pwd.match(numbers) == null) { this.num = false; return; }
      if (pwd.match(specials) == null) { this.spec = false; return; }
      var data = {"pass" : pwd};
      this.dataService.postRequest('admin/oldpassCheck', data, this.token).subscribe((resData: any) => {
        if(resData){
          if(resData.status == 0){
            this.newpassmatch = false;
          }else{
            this.newpassmatch = true;
          }
        }
        this.isLoading = true;
      });
    }
    if(this.confirmPass == pwd){
      this.errconpass = true;
    }else{
      this.errconpass = false;
    }
  }

  // onPatternDraw(pattern:any){
  //   var obj={pattern:pattern}
  //   this.dataService.postRequest('admin/patternOld', obj, this.token).subscribe((resData: any) => {
  //     if(resData.status==1){
  //       this.checkPattern1=true;
  //       this.msgPattern=1;
  //       this.notifier.notify('success', resData.msg)
  //     }else{
  //       this.checkPattern1=true;
  //       this.msgPattern=0;
  //       this.notifier.notify('error', resData.msg);
  //     }
  //   })
  // }

  submitFunc(send: NgForm){
    var data = send.value;
    if(data.confirmPassword !== undefined && data.newPassword !== undefined && data.oldPassword !== undefined && data.confirmPassword !== null && data.newPassword !== null && data.oldPassword !== null){
      if(data.confirmPassword.toString().length > 0 && data.newPassword.toString().length > 0 && data.oldPassword.toString().length > 0){
        this.dataService.postRequest('admin/changePassword', data, this.token).subscribe((resData: any) => {
          if(resData.status){
            this.notifier.notify('success', resData.msg);
            send.resetForm();
          }else{
            this.notifier.notify('error', resData.msg);
          }
          this.isLoading = true;
        });
      }else{
        this.notifier.notify('error', "change-password is invalid !");
      }
    }else{
      this.notifier.notify('error', "change-password is invalid !");
    }
  }

  oldPass(oldpass : any){
    var data = {"pass" : oldpass};
    this.dataService.postRequest('admin/oldpassCheck', data, this.token).subscribe((resData: any) => {
      if(resData){
        if(resData.status == 0){
          this.oldpassmatch = false;
        }else{
          this.oldpassmatch = true;
        }
      }
      this.isLoading = true;
    });
  }

  ConfirmPass(conpass: any){
    this.confirmPass = conpass;
    if(this.newpwd == conpass){
      this.errconpass = true;
    }else{
      this.errconpass = false;
    }
  }

}
