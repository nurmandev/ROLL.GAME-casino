import { Component, OnInit, Input, NgModule, ViewChild, ElementRef } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
declare var jQuery: any;
import { ModalServiceService } from '../modal.service.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  head:any=true; token = localStorage.getItem('gAmE-t0KEN');
  acttab:any='balance'; balData:any=[]; walletData:any=[];
  min_withdraw:any=0;max_withdraw:any=0; type:any=0;withdraw_fee:any=0;network:any='';
  WithCurr:any="BNB"; withBal:any='0.000000'; with_amount:any=0;
  fee:any=0;totalwith:any=0;withaddress:any; withToken:any;withVerify:any;
  Qrcode:any;addfirst:any;addmidd:any;addlast:any;address:any;
  tradePair:any=[];serchData:any=[]; grp_cht:any=true; cntry :any=[]; checkBtn=false;
  searchVal:any=''; depositHistory:any = [];
  withdrawHistory:any = []; r : any = 1; q:any=1;
  historyName:any='deposit';
  lockedData:any={};
  bonusVal:any=[]; userwages:any=0;

  p:any = 0;limit:any = 4;totalCount:any;page:any = 0;

  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute,private modalService: ModalServiceService) { 
    if(!this.httpService.loggedIn()){
      this.route.navigate(['/']);
      this.head=false;
    }
    this.actRoute.params.subscribe((params: any) => {
      var activeTab = this.actRoute.snapshot.queryParamMap.get('type');
      if(activeTab != null && activeTab != undefined && activeTab != ""){
        this.acttab = activeTab;
      }
    });
  }

  openModal() {
    this.modalService.openModal();
  }

  convertToNumber(value: string): number {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }

  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this.getBalance();
    this.userwallet();
    this.DepositData();
    this.WithdrawData();
    this.getwager();
  }
  conPass(data:any){
    this.head = data;
  }
  getBalance(){
    this.httpService.getRequest('basic/getBal', this.token).subscribe((resData:any) => {
      if(resData.success == 1){
        this.balData = resData.BalData;
        this.serchData = resData.BalData;
      }else{
        this.alert.error(resData.msg);
      }
    })
  }
  userwallet(){
    this.httpService.getRequest('basic/getvaluBal', this.token).subscribe((resData:any) => {
      if(resData){
        this.walletData = resData.walData;
        this.WithCurr = resData.walData[0].currency;
        this.withBal = resData.walData[0].amount;
        this.currselect(resData.walData[0].currency)
      }else{
        this.alert.error(resData.msg, '', {timeOut: 2000});
      }
    })
  }

  currselect(curr:any){
    this.httpService.postRequest('basic/getCurrencyInfo', {currency:curr}, this.token).subscribe((resData:any) => {
      if(resData.success == 1){
        this.min_withdraw= resData.currData.min_withdraw;
        this.max_withdraw = resData.currData.max_withdraw;
        this.type = resData.currData.type;
        this.withdraw_fee = resData.currData.withdraw_fee;
        this.network = resData.currData.network;
        this.depositData(curr);
      }else{
        this.alert.error("somthing wents wrong !", '', {timeOut: 2000});
      }
    })
  }
  selectwithcurr(c){
    this.currselect(c.currency);
    this.WithCurr = c.currency;
    this.withBal = c.amount;
    if(this.with_amount !== 0){
     this.fee = (parseFloat(this.with_amount)*((this.withdraw_fee)/100));
      if(this.fee !== NaN ){
         this.totalwith = parseFloat(this.with_amount)-this.fee;
      }else{
        this.fee = 0;
        this.totalwith = 0;
      }
    }else{
      this.fee = 0;
      this.totalwith = 0;
    }
  }

  depositData(curr:any){
    if(curr != "APE") {
        this.httpService.postRequest('withdraw/getAddress', {currency:curr}, this.token).subscribe((resData:any) => {
          if(resData.success == 1){
            this.Qrcode = resData.Qrcode;
            this.address = resData.Address;
            this.addfirst = resData.Address.slice(0, 4);
            this.addlast = resData.Address.slice(-4);
            this.addmidd = resData.Address.slice(4,-4);
          }else{
            this.alert.error(resData.msg, '', {timeOut: 2000});
          }
        })
    }
  }

  onselectcurr(curr :any){
    var setcurr = this.walletData.filter(val => val.currency == curr);
    this.WithCurr = setcurr[0].currency;
    this.withBal = setcurr[0].amount;
  }
  copyInputMessage(data:any){
     navigator.clipboard.writeText(data)
    .then(() => this.alert.success('Address copied to clipboard'))
  }

  withdrawAmt(amt:any){
    if(amt !== ''){
     this.fee = (parseFloat(amt)*((this.withdraw_fee)/100));
      if(this.fee !== NaN ){
         this.totalwith = parseFloat(amt)-this.fee;
      }else{
        this.fee = 0;
        this.totalwith = 0;
      }
    }else{
      this.fee = 0;
      this.totalwith = 0;
    }
  }

  withinit(amtType:any){
    if(amtType == 'max'){
      this.with_amount = this.withBal;
    }else if(amtType == '25'){
      this.with_amount = (this.withBal*0.25);
    }else if(amtType == '50'){
      this.with_amount = (this.withBal*0.5);
    }
    this.fee = (parseFloat(this.with_amount)*((this.withdraw_fee)/100));
    if(this.fee !== NaN ){
       this.totalwith = parseFloat(this.with_amount)-this.fee;
    }else{
    this.fee = 0;
    this.totalwith = 0;
    }
  }

  executeAction(form:NgForm, type:any){
    if(this.checkBtn==true){
      var data = form.value;
      if(type == 'withdraw'){
        if(data.address == undefined || data.withdrawAmt == 0 ){
          this.alert.error("please fill the details !", '', {timeOut: 2000});
        }else{
          var obj = {network: this.network, amount: this.with_amount,transfer_amount: this.totalwith,
            currency: this.WithCurr,currency_type: this.type,address_info: this.withaddress,fee_amt: this.fee,
          }
          this.WithProcess(obj);
        }
      }
    }else{
      jQuery("#exampleModalCenter").modal("hide");
      this.route.navigate(['/security']);
      this.alert.error("enable Tfa",'')
    }
  }

  WithProcess(data:any){
    this.httpService.postRequest('withdraw/withdrawprocess',data,this.token).subscribe((resData:any) => {
      if(resData.success == 1){
        this.alert.success(resData.msg, '', {timeOut: 2000});
      }else if(resData.success == 2){
        this.route.navigate(['/security']);
        this.alert.error(resData.msg, '', {timeOut: 2000});
      }else{
        this.alert.error(resData.msg, '', {timeOut: 2000});
      }
    })
  }

  SearchPair(search: any){
    if(search != "") {
      if(search.target){
       search = search.target.value;
      }else{
        search = search;
      }
    }else{
      this.balData=this.serchData;
    }
    this.searchVal = search;
    var list2:any = this.serchData;
    if (search != '') {
      search = search.toUpperCase();
      var result = list2.filter(o => o.currency.includes(search));
      const unique2 = result.filter((obj, index) => {
        return index === result.findIndex(o => obj.currency == o.currency);
      });
      this.balData = unique2;
    } else {
      this.balData = list2;
    }
  }

  HideZero(val:any){
    if(val.checked == true){
      var result = this.serchData.filter(o => parseFloat(o.amount));
      this.balData=result;
    }else{
      this.balData=this.serchData;
    }
  }

  cngDep(dep:any){
    this.WithCurr = dep;
    this.onselectcurr(dep);
    jQuery("#deposit-data-tab").trigger("click");
    this.acttab = 'deposit-data';
  }

  cngWith(wid:any){
    this.WithCurr = wid;
    this.onselectcurr(wid);
    jQuery("#withdraw-data-tab").trigger("click");
  }

  historyData(data:any){
    this.historyName=data.value;
  }
  
  DepositData(){
    this.httpService.getRequest('basic/DepositeHistory', this.token).subscribe((res: any) => {
      if(res.success == 1){
        this.depositHistory = res.deposite;
      }else{
        this.alert.error(res.msg);
      }
    });
  }

  WithdrawData(){
    this.httpService.getRequest('basic/withdrawHistory', this.token).subscribe((res: any) => {
      if(res.success == 1){
        this.withdrawHistory = res.withdraw;
      }else{
        this.alert.error(res.msg);
      }
    });
  }

  copyText(val: string) {
    let selBox = document.createElement('input');
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    window.scrollTo(0, 0);
    this.alert.success('Address Copied to the clipboard', '', {timeOut: 2000});
  }

  getlocked(curr:any){
    var data = {curr: curr};
    this.httpService.postRequest('basic/getlockedamt', data, this.token).subscribe((resDate: any) => {
      if(resDate.success == 1){
        this.lockedData = resDate.locked;
      }else{
        this.alert.error(resDate.msg);
      }
    });
  }

  unlockbal(curr:any){
    var data = {curr: curr, wages: this.userwages};
    this.httpService.postRequest('basic/unlockamt', data, this.token).subscribe((resDate: any) => {
      if(resDate.success == 1){
        this.alert.success(resDate.msg);
        this.getBalance();
        this.getlocked(curr);
      }else{
        this.alert.error(resDate.msg);
      }
    });
  }

  bonusData(){
    var paramsdata = {
      pageIndex: this.p,
      pageSize: this.limit,
    }
    this.httpService.postRequest('basic/bonus', paramsdata, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.totalCount = resData.BonusCount;
        this.page = Math.floor(this.totalCount / this.limit);
        this.bonusVal = resData.BonusData;
      }else{
        this.alert.error("somthing wents wrong !");
      }
    });
  }

  paginate(param:any){
    switch(param){
      case "prev":
      this.p = this.p - 1;
      break;
      case "next":
      this.p = this.p + 1;
      break;
      default:
      this.p = this.p + 1;
      break;
    }
    this.bonusData();
  }

  getwager(){
    this.httpService.getRequest('basic/getUsrinfo', this.token).subscribe((resData:any)=>{
      if(resData.success == 1){
        this.userwages = resData.wages;
      }else{
        this.alert.error(resData.msg);
      }
    })
  }
}