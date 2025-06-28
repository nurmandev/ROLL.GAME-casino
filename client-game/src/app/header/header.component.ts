import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Countries } from '../country.js';
declare var jQuery: any;
import { ModalServiceService } from '../modal.service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  @Input() balance = 0;
  @Output() passedEvent = new EventEmitter();
  @Output() ConnEvent = new EventEmitter();
  
  isConnected:any = false;  
  currency1:any = 'JB';LogConn:any = false;
  token = localStorage.getItem("gAmE-t0KEN");
  tkn = localStorage.getItem('Tfa');
  lower = true; upper = true; len = true; num = true; spec = true;
  lower1 = true; upper1 = true; len1 = true; num1 = true; spec1 = true;
  usrmail = false; cntry :any=[]; supportData:any={country:"India"};
  signLoader = false; cntries: any;
  loader:any = false; pwd : any; pwd1 : any; 
  loginToken:any = ""; resetToken:any =""; resetVerify:any="";

  displayStyle = "none";
  displayStyle1 = "none";
  tfaCode:any;
  check:any; checkpwd:any= true; refId = "";
  usrname:any=false;
  
  /*getBalance(currency:any) {
    this.httpService.postUrl('basic/getBalance',{currency:this.currency1}).subscribe((resData:any) => {
        if(resData.success == 1) {
            this.balance = resData.balance;
        } else {
            this.balance = 0;
        }
    })
  }*/
  
  PassEvent(){
    this.passedEvent.emit(this.balance);
  }

  connectionPass(){
    this.ConnEvent.emit(this.isConnected);
  }

adm_mail:any;adm_facebook:any;adm_insta:any;adm_twitter:any;adm_skype:any;adm_telegram:any;

  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute,private modalService: ModalServiceService) {
    if(actRoute.snapshot.url[0] !== undefined){
      var pathway = actRoute.snapshot.url[0].path;
      if(pathway == 'activate_account'){
        this.actRoute.params.subscribe((params) => {
          this.loginToken = this.actRoute.snapshot.queryParamMap.get('token');
          if (this.loginToken == null || this.loginToken == undefined || this.loginToken == "undefined") {
          } else {
            this.httpService.postUrl('basic/activateEmail', { 'token': this.loginToken }).subscribe((res: any) => {
              if (res.success == 1) {
                this.alert.success(res.msg, '', {timeOut: 2000});
                this.route.navigate(['/']);
              } else if (res.success == 3) {
                this.alert.error(res.msg, '', {timeOut: 2000});
              } else {
                this.alert.error(res.msg, '', {timeOut: 2000});
              }
            });
          }
        });
      }else if(pathway == 'reset_password'){
        this.actRoute.params.subscribe((params) => {
          this.resetToken = this.actRoute.snapshot.queryParamMap.get('token');
          this.resetVerify = this.actRoute.snapshot.queryParamMap.get('verify');
          if (this.resetToken == null || this.resetToken == undefined || this.resetToken == "undefined" || this.resetToken == " " || this.resetVerify == null || this.resetVerify == undefined || this.resetVerify == "undefined" || this.resetVerify == "") {
            this.alert.error("Invalid request", '', {timeOut: 2000});
            this.route.navigate(['/']);
          }else{
            jQuery("body").addClass("topshow");
            jQuery(document).ready(function(){
              jQuery("#resetpass").modal('show');
            });
          }
        });
      }else if(pathway == 'referrals'){
        var refer = this.actRoute.snapshot.queryParamMap.get('referral');
        if (refer != null && refer != "" && refer != undefined) {
          this.refId = refer;
        }
      }
    }
    this.siteSetting();
  }

  siteSetting(){
    this.httpService.getUrl('basic/getsiteInfo').subscribe((resdata: any) => {
      if(resdata.success==1){
        this.adm_mail=resdata.msg.contact_mail;
        this.adm_insta=resdata.msg.instagram;
        this.adm_twitter=resdata.msg.telegram;
        this.adm_skype=resdata.msg.skype;
        this.adm_facebook=resdata.msg.facebook;
        this.adm_telegram=resdata.msg.telegram;
      }
    })
  }


  ngOnInit(): void {
    this.cntry = Countries;
    // this.getBalance(this.currency1);
    jQuery(".toplink").click(function(){
    jQuery("body").addClass("topshow");
    jQuery("body").removeClass("sideshow");
    });
    jQuery(".sidelink").click(function(){
    jQuery("body").addClass("sideshow");
    jQuery("body").removeClass("topshow");
    });
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });

    this.modalService.showModal1$.subscribe(() => {
      this.openModal1();
    });

    this.modalService.showModal2$.subscribe(() => {
      this.openModal2();
    });
  }

  openModal1() {
    jQuery("body").addClass("topshow");
    jQuery("#signin").modal("show");    
  }

  openModal2() {
    jQuery("body").addClass("topshow");
    jQuery("#signup").modal("show");    
  }

  checkname(user:any){
    if(user.length >= 6){
      if (/^[a-zA-Z0-9_]+$/.test(user)) {
        let data = {username : user};
        this.httpService.postUrl('basic/findUsername', data).subscribe((res: any) => {
          if(res.success == 0){
            this.usrname = false;
            this.alert.error(res.msg, '', {timeOut: 2000});
          }else{
            this.usrname = true;
          }
        });
      }
    }
  }

  checkemail(mail: any){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      var data = { "email": mail }
      this.httpService.postUrl('basic/findEmail', data).subscribe((res: any) => {
        if(res.success == 0){
          this.usrmail = false;
          this.alert.error(res.msg, '', {timeOut: 2000});
        }else{
          this.usrmail = true;
        }
      });
    }
  }
   
  typePwd(pwd:any) {
    if (pwd != null && pwd != undefined && pwd != "") {
      this.pwd = pwd; this.lower = true; this.upper = true; this.len = true; this.num = true; this.spec = true;
      if (pwd.length < 8) { this.len = false; return; }
      if (pwd.match(/[a-z]/g) == null) { this.lower = false; return; }
      if (pwd.match(/[A-Z]/g) == null) { this.upper = false; return; }
      if (pwd.match(/[0-9]/g) == null) { this.num = false; return; }
      if (pwd.match(/\W|_/g) == null) { this.spec = false; return; }
    }
  }

  executeAction(type:any, form:NgForm){
    if(type == "login"){
      var data = form.value;
      if(data.email !== undefined && data.email !== null && data.email !== ""){
        if(data.password !== undefined && data.password !== null && data.password !== ""){
          this.loginProcess(form);
        }else{
          this.alert.error('Invalid Password', '', {timeOut: 2000});
        }
      }else{
        this.alert.error('Invalid Email ', '', {timeOut: 2000});
      }
    }else if(type == "signup"){
      if (!this.usrmail) {
        this.alert.error("Email already exists", '', {timeOut: 2000}); return;
      }
      if(this.lower && this.upper && this.len && this.num && this.spec){}else{
        this.alert.error("password not valid", '', {timeOut: 2000}); return;
      }
      this.registerForm(form);
    }else if(type == "resetpass"){
      var mail = form.value.resetemail;
      if(mail !== undefined && mail !== null && mail !== ""){
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
          this.forgotPass(form);
        }else{
          this.alert.error("Invalid Email", '', {timeOut: 2000});
        }
      }else{
        this.alert.error("Invalid Email", '', {timeOut: 2000});
      }
    }else if(type == "confirmpass"){
      if(!this.lower1 || !this.upper1 || !this.len1 || !this.num1 || !this.spec1){
        this.alert.error("password not valid", '', {timeOut: 2000}); return;
      }
      if(!this.checkpwd){this.alert.error("Password does not match !", '', {timeOut: 2000}); return;}
      this.resetPassword(form);
    }
  }

  loginProcess(form:NgForm){
    var data = form.value;
    this.httpService.postUrl('basic/login', data).subscribe((res: any) => {
      if(res.success == 1){
        localStorage.setItem('gAmE-t0KEN', res.token);
        localStorage.setItem('TToken', res.ttoken);
        localStorage.setItem("gAmE-fav",res.favourite);
        localStorage.setItem("gAmE-like",res.liked); 
        this.isConnected = true;
        this.connectionPass();
        this.alert.success('Login Success!', '', {timeOut: 2000});
        this.modalService.loginSet();
      }else if(res.success == 2){
        localStorage.setItem('Tfa', res.ttoken);
        this.alert.success('Please login with Authentication code', '', {timeOut: 2000});
        this.openPopup();
      }else{
        this.alert.error(res.msg, '', {timeOut: 2000});
      }
      form.resetForm();
    });
  }

  registerForm(form:NgForm){
    var data = form.value;
    this.httpService.postUrl('basic/signup', data).subscribe((res: any) => {
      if(res.success == 1){
        this.alert.success(res.msg, '', {timeOut: 2000});
        this.route.navigate(['/']);
        form.resetForm();
      }else{
        this.alert.error(res.msg, '', {timeOut: 2000});
      }
    })
  }

  forgotPass(form:NgForm){
    var data = form.value;
    this.httpService.postUrl('basic/forgotPassword', data).subscribe((res: any) => {
      if(res.success == 1){
        this.alert.success('Reset-password link sent to your email', '', {timeOut: 2000});
        form.resetForm();
      }else{
        this.alert.error(res.msg, '', {timeOut: 2000});
      }
    })
  }

  resetPassword(form:NgForm){
    var data = form.value;
    data.token = this.resetToken; 
    data.verify = this.resetVerify;
    this.httpService.postUrl('basic/reset_password', data).subscribe((res: any) => {
      if(res.success == 1){
        this.alert.success(res.msg, '', {timeOut: 2000});
        this.route.navigate(['/']);
      }else{
        this.alert.error(res.msg, '', {timeOut: 2000});
      }
      form.resetForm();
    })
  }

  openPopup() {
    this.displayStyle1 = "block";
  }

  closePopup() {
    this.displayStyle1 = "none";
  }

  logined(data:NgForm){
    if(this.tkn==undefined || this.tkn==null){
      this.route.navigate(['']);
    }
    if(data.status=="INVALID"){

    }else{
      var tkns = localStorage.getItem('Tfa');
      var obj={"auth_key":data.value.tfaCode,"ttoken":tkns};
      this.httpService.postUrl('basic/tfaLogin', obj).subscribe((res: any) => {
        if (res.success == 1) {
          localStorage.removeItem('Tfa');
          localStorage.setItem('gAmE-t0KEN', res.token);
          localStorage.setItem('TToken', res.ttoken);
          this.displayStyle1 = "none";
          this.route.navigate(['']);
          // var msg = { "authkey": res.token, "token": res.key };
          // this.httpService.sendsocket(msg);
          this.modalService.loginSet();
          this.alert.success('Login Success!');
          this.isConnected = true;
          this.connectionPass();
        } else if (res.success == 2) {
          this.alert.error(res.msg);
          this.route.navigate(['']);
        } else {
          this.alert.error(res.msg);
        }
        data.resetForm();
      })
    }
  }
  checkpassword(checkpwd:any){
    if (checkpwd != null && checkpwd != undefined && checkpwd != "") {
      this.check = checkpwd;
      if(this.pwd1 == checkpwd){
        this.checkpwd = true;
      }else {
        this.checkpwd = false ;
      }
    }
  }

  typePwd1(pwd:any){
    if (pwd != null && pwd != undefined && pwd != "") {
      this.pwd1 = pwd; this.lower1 = true; this.upper1 = true; this.len1 = true; this.num1 = true; this.spec1 = true;
      if (pwd.length < 8) { this.len1 = false; return; }
      if (pwd.match(/[a-z]/g) == null) { this.lower1 = false; return; }
      if (pwd.match(/[A-Z]/g) == null) { this.upper1 = false; return; }
      if (pwd.match(/[0-9]/g) == null) { this.num1 = false; return; }
      if (pwd.match(/\W|_/g) == null) { this.spec1 = false; return; }
      if(this.check == pwd){this.checkpwd = true;}else {this.checkpwd = false ;}
    }
  }

  async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async confirmedData(){
    await this.sleep(600);
    jQuery('#body').addClass('modal-open');
    jQuery('#body').attr('style','padding-right: 15px');
  }
}