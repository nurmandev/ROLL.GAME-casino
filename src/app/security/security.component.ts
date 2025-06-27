import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
declare var jQuery: any;


@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  token = localStorage.getItem('gAmE-t0KEN');
  TfaData:any= {with_status:1}; TfaUrl:any; tfa_code:any; typeBtn:any = "Enable";
  oldpassmatch :any = false; checkpwd :any = false; users :any = {};
  pwd:any= false; check :any; passmatch :any = false; 
  lower:any = false; upper:any = false; len:any = false; num:any = false; spec:any = false;
  showPassword: boolean = false;

  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute) {
    if(!this.httpService.loggedIn()){
      this.route.navigate(['/']);
    }
  }

  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this.httpService.getRequest('basic/TFAData', this.token).subscribe((resData: any) => {
      if(resData.success == 1){
        this.TfaData = resData.tfaData;
        this.TfaUrl = resData.tfaData.tfa_url;
        this.tfa_code = resData.tfaData.tfa_code;
        this.typeBtn = (resData.tfaData.tfa_status == 1) ? "Disable" : "Enable";
      }else{
        this.alert.error("somthing wents wrong !");
      }
    })
  }

  conPass(data:any){
    if(data == false){
      this.route.navigate(['/']);
    }
  }
  
  onDigitInput(event:any){
   let element;
   var isNumber = /^[0-9]$/i.test(event.key)
   if (event.code !== 'Backspace'){
    if(isNumber){
      element = event.srcElement.nextElementSibling;
    }else{
      return;
    }
   }
    if (event.code === 'Backspace'){
      element = event.srcElement.previousElementSibling;
    }
    if(element == null){
      return 
    }
    else {
      element.focus();
    }
  }

  passVisible(){
    console.log(this.showPassword)
    this.showPassword = !this.showPassword;
  }

  oldPass(oldpass:any){
    var data = {pass : oldpass};
    this.httpService.postRequest('basic/check_oldPass', data, this.token).subscribe((res: any) => {
      if(res.success == 0){
        this.oldpassmatch = true;
      }else{
        this.oldpassmatch = false;
      }
    })
  }

  typePwd(pwd:any){
    if (pwd != null && pwd != undefined && pwd != "") {
      this.passmatch = false; this.pwd = pwd; this.lower = true; this.upper = true; this.len = true; this.num = true; this.spec = true;
      if (pwd.length < 8) { this.len = false; return; }
      if (pwd.match(/[a-z]/g) == null) { this.lower = false; return; }
      if (pwd.match(/[A-Z]/g) == null) { this.upper = false; return; }
      if (pwd.match(/[0-9]/g) == null) { this.num = false; return; }
      if (pwd.match(/\W|_/g) == null) { this.spec = false; return; }
      if(this.check == pwd){this.checkpwd = true;}else {this.checkpwd = false ;}
      var data = {pass : pwd};
      this.httpService.postRequest('basic/check_newPass', data, this.token).subscribe((res: any) => {
        if(res.success == 0){
          this.passmatch = true;
        }else{
          this.passmatch = false;
        }
      })
    }
  }

  checkpassword(checkpwd){
    if (checkpwd != null && checkpwd != undefined && checkpwd != "") {
      this.check = checkpwd;
      if(this.pwd == checkpwd){
        this.checkpwd = true;
      }else {
        this.checkpwd = false ;
      }
    }
  }

  executeAction(form:NgForm, type:any){
    if(type == "tfa"){
      var data = form.value;
      var digit = data.digit1.concat(data.digit2, data.digit3, data.digit4, data.digit5, data.digit6);
      if (/^(0|[1-9][0-9]*)$/.test(digit) && digit.length == 6) {
        if(data.password != undefined && data.password != ""){
          digit = parseFloat(digit);
          this.tfaStatus(digit, form);
        }else{
          this.alert.error("Invalid Password !");
        }
      }else{
        this.alert.error("Invalid Authentication code !");
      }

    }else if(type == "chgepwd"){
      if(this.oldpassmatch ){
        this.alert.error("Old password Invalid !", '', {timeOut: 2000}); return;
      }
      if(this.passmatch ){
        this.alert.error("Password should not match with last five passwords !", '', {timeOut: 2000}); return;
      }
      if(!this.lower || !this.upper || !this.len || !this.num || !this.spec){
        this.alert.error("password not valid", '', {timeOut: 2000}); return;
      }
      if(!this.checkpwd){this.alert.error("Password does not match !", '', {timeOut: 2000}); return;}
      this.chnagePwd(form);
    }
  }

  tfaStatus(tfaData: any, tfa: NgForm) {
    var data = {tfa_code : tfaData, pwd:tfa.value.password};
    this.httpService.postRequest('basic/updateTfa', data, this.token).subscribe((res: any) => {
      if (res.success == 1) {
        var response = res.result;
        this.typeBtn = (response.tfa_status == 1) ? "Disable" : "Enable";
        this.TfaData = response;
        this.tfa_code = response.tfa_code;
        this.TfaUrl = response.tfa_url;
        (response.tfa_status == 1) ? this.alert.success('TFA enabled successfully') : this.alert.success('TFA disabled successfully');
        tfa.resetForm();
      } else {
        this.alert.error(res.msg,'Error');
        tfa.resetForm();
      }
    })
  }

  chnagePwd(form:NgForm){
    var data = form.value;
    this.httpService.postRequest('basic/updatepwd', data, this.token).subscribe((res: any) => {
      if(res.success == 1){
        this.alert.success(res.msg);
        form.resetForm();
      }else{
        this.alert.error(res.msg);
      }
    })
  }

  copytext(data: any){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = data;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.alert.success("Secret Key Copied to the clipboard ", '', {timeOut: 2000});
  }
}
