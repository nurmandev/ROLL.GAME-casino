import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';
declare var jQuery: any;

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  token = localStorage.getItem('Key');
  UserId: any;
  isLoading = false;
  rLoading = false;
  info;
  wallet:any;
  withdraw :any;
  deposit :any;
  userDetails:any;
  refers = [];
  levelOne = [];
  levelTwo = [];
  pgWallt : any = 1; pgDepos : any = 1; pgWithdr : any = 1;
  pgKYC : any = 1; pgGame : any = 1;
  userInfo:any={}; KycInfo:any={}; ReferralInfo:any={};gameData:any={};
  userTable:any=true;KYCTable:any=false;WalletTable:any=false;ReferralTable:any=false;gameTable:any=false;
  idrej:any=false; passportrej:any=false; residencerej:any=false; selrej:any=false;
  idFrtImg:any ="assets/images/id-front.svg";
  idBackImg:any ="assets/images/id-back.svg";
  PassPortImg:any ="assets/images/id-front.svg";
  residenceImg:any ="assets/images/id-front.svg";
  selfieImg:any ="assets/images/id-front.svg";

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private actRoute: ActivatedRoute, private notifier: NotifierService) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
    this.actRoute.params.subscribe((params) => {
      this.UserId = params['id'];
      let obj = { "UserIdData": this.UserId };
      this.dataService.postRequest('users/getUser_infos', obj, this.token).subscribe((resData: any) => {
        if(resData) {
          if(resData.status) {
            this.wallet = resData.walletdata;
            this.deposit = resData.userdeposit;
            this.withdraw = resData.userwithdraw;
            this.userDetails = resData.userDetails;
            this.userInfo = resData.userInfo;
            this.ReferralInfo = resData.refferral;
            this.gameData = resData.gameData;
            this.rLoading = true;
            this.KycInfo = resData.kycInfo;
            if(resData.kycInfo.id_proof !== "" && resData.kycInfo.id_proof1 !== ""){
              this.idFrtImg = resData.kycInfo.id_proof;
              this.idBackImg = resData.kycInfo.id_proof;
            }
            if(resData.kycInfo.passport_proof !== ""){this.PassPortImg = resData.kycInfo.passport_proof;}
            if(resData.kycInfo.residence_proof !== ""){this.residenceImg = resData.kycInfo.residence_proof;}
            if(resData.kycInfo.selfie_proof !== ""){this.selfieImg = resData.kycInfo.selfie_proof;}
          }
          this.isLoading = true;
        } else {
          this.notifier.notify('error', resData.msg);
        }
      });
    });
  }
  ngOnInit(): void {
  }

  TabClick(tab:any){
    this.userTable=false;this.KYCTable=false;this.WalletTable=false;this.ReferralTable=false;this.gameTable=false;
    if(tab == "kyc"){
      this.KYCTable=true;
    }else if(tab == "wallet"){
      this.WalletTable=true;
    }else if(tab == "referral"){
      this.ReferralTable=true;
    }else if(tab == "user"){
      this.userTable=true;
    }else if(tab == "game"){
      this.gameTable=true;
    }
  }

  copyText(val: string, type:any) {
    let selBox = document.createElement('input');
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    window.scrollTo(0, 0);
    this.notifier.notify('success', type+" "+'copied to the clipboard');
    // this.alert.success('Address Copied to the clipboard', '', {timeOut: 2000});
  }

  approveKYC(type:any){
    var obj = {type:type, userId:this.UserId};
    this.dataService.postRequest('admin/updateKyc', obj, this.token).subscribe((resData: any) => {
      if(resData.success == 1){
        this.KycInfo = resData.kycInfo;
        this.notifier.notify('success',resData.msg);
      }else{
        this.notifier.notify('error',resData.msg);
      }
    })
  }

  rejectKYC(type:any){
    if(type== 'id_proof'){this.idrej=true;
    }else if(type == "passport_proof"){this.passportrej=true;
    }else if(type == "residence_proof"){this.residencerej=true;
    }else if(type == "selfie_proof"){this.selrej=true;}
  }

  cancelReas(type:any){
    if(type== 'id_proof'){this.idrej=false;
    }else if(type == "passport_proof"){this.passportrej=false;
    }else if(type == "residence_proof"){this.residencerej=false;
    }else if(type == "selfie_proof"){this.selrej=false;}
  }

  ReasonKYC(type:any, form:NgForm){
    var data = form.value;
    var msg;
    if(type== 'id_proof'){
      msg = data.id_proof;
    }
    else if(type == "passport_proof"){
      msg = data.pp_proof;
    }
    else if(type == "residence_proof"){
      msg = data.residence_proof;
    }
    else if(type == "selfie_proof"){
      msg = data.selfie_proof;
    }
    if(msg !== undefined && msg !== '' && msg !== null){
      var obj = {type:type, Reason:msg, userId:this.UserId};
      this.dataService.postRequest('admin/rejectKYC', obj, this.token).subscribe((resData: any) => {
        if(resData.success == 1){
          this.KycInfo = resData.kycInfo;
          this.notifier.notify('success',resData.msg);
          this.idrej=false; this.passportrej=false; this.residencerej=false; this.selrej=false;
        }else{
          this.notifier.notify('error',resData.msg);
        }
      })
    }else{
      this.notifier.notify('error','Please Enter rejection Reason !');
    }
  }
}