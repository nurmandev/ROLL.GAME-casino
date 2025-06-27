import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
declare var jQuery: any;
import { ModalServiceService } from '../modal.service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Countries } from '../country.js';


@Component({
  selector: 'app-innerheader',
  templateUrl: './innerheader.component.html',
  styleUrls: ['./innerheader.component.css']
})
export class InnerheaderComponent implements OnInit {

  @Input() balance = 0;
  @Input() currency:any = 'JB';
  @Input() Nameupd:any = '';
  @Output() currBal = new EventEmitter();
  @Output() ConnEvent = new EventEmitter();
  @Output() UserEvent = new EventEmitter();

  // token = "AAAAAAAAAAAAAA";
  isConnected:any = true;
  token = localStorage.getItem("gAmE-t0KEN"); ReferralId:any=""; referalLink:any=""
  userData:any={};amt:any;currData:any=[];isClassVisible = false;isActive = false;
  selectedIndex: number = 0; searchVal:any=""; walletData:any=[]; supportData:any=[];
  WithCurr:any="BNB"; withBal:any='0.000000'; with_amount:any=0;
  min_withdraw:any=0;max_withdraw:any=0; type:any=0;withdraw_fee:any=0;network:any='';
  fee:any=0;totalwith:any=0;withaddress:any; withToken:any;withVerify:any;
  Qrcode:any;addfirst:any;addmidd:any;addlast:any;address:any;
  tradePair:any=[];serchData:any=[]; grp_cht:any=true; cntry :any=[];
  NotifyData:any=[];

  displayStyle1 = "none";
  userName:any;userId:any;favTable:any;joined:any;tot_game:any;tot_win:any;wages:any;
  checkBtn=false;largeImageUrl:any;
  // update username
  // Nameupd:any;
  proImg:any;

  // @ViewChild('imageModal') imageModal: any;
  modalRef: BsModalRef;

  gameList:any=[];gameSelect:any="Global";gameTable:any=[];gamelog:any={};

  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute,private modalService: ModalServiceService,private modalService1: BsModalService) {
    if(actRoute.snapshot.url[0] !== undefined){
      if (actRoute.snapshot.url[0].path == 'activate_withdraw') {
        this.actRoute.params.subscribe((params) => {
          this.withToken = this.actRoute.snapshot.queryParamMap.get('token');
          this.withVerify = this.actRoute.snapshot.queryParamMap.get('verify');

          if (this.withToken == null || this.withToken == undefined || this.withToken == "undefined" || this.withToken == "" || this.withVerify == null || this.withVerify == undefined || this.withVerify == "undefined" || this.withVerify == "") {
            this.alert.error("Invalid request", '', {timeOut: 2000});
            this.route.navigate(['withdraw']);
          } else {
            var data = {token: this.withToken, verify: this.withVerify};
            this.httpService.postUrl('withdraw/activatewithdraw', data).subscribe((res: any) => {
              if (res.success == 1) {
                this.alert.success(res.msg, '', {timeOut: 2000});
              } else if (res.success == 0) {
                this.alert.error(res.msg, '', {timeOut: 2000});
              } else {
                this.alert.error(res.msg, '', {timeOut: 2000});
              }
              this.route.navigate(['/']);
            });
          }
        });
      }
    }
  }

  ngOnInit(): void {
    this.cntry = Countries;
    this.getBalance(this.currency);
    this.getUserData();
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
    jQuery(".chaticon").click(function(){
      jQuery("body").removeClass('notifyadd');
      jQuery("body").toggleClass("chatadd");
    });
    jQuery(".ballIcon").click(function(){
      jQuery("body").removeClass('chatadd');
      jQuery("body").toggleClass("notifyadd");
    });
    this.modalService.showModal$.subscribe(() => {
      this.openModal();
    });

    this.modalService.showModal3$.subscribe(() => {
      this.openModal3();
    });

    
    this.shoeCurr();this.userwallet();this.kycDet();
  }

  openImageModal(template: any) {
    jQuery("body").addClass("topshow");
    jQuery("#pro").modal("show");
    // this.modalRef = this.modalService1.show(template);
  }

  closeImageModal() {
    jQuery("body").addClass("topshow");
    jQuery("#pro").modal("hide");
  }

  kycDet(){
    this.httpService.getRequest('basic/Getstatus', this.token).subscribe((resData: any) => {
      if(resData.success==1){
        if(resData.userData.tfa_status==1 || resData.userData.kyc_status==3 ){
          this.checkBtn=true;
        }else{
          this.checkBtn=false
        }
      }
    })
  }

  openModal() {
    jQuery("body").addClass("topshow");
    jQuery("#exampleModalCenter").modal("show");
    /*const modal = document.getElementById('exampleModalCenter');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }*/
  }

  openModal3() {
    jQuery("body").addClass("topshow");
    jQuery("#exampleReferral").modal("show");
  }

  balNavclk(){
    this.shoeCurr();
  }

   convertToNumber(value: string): number {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
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

  getBalance(currency:any) {
    this.httpService.postRequest('basic/getBalance', {currency:this.currency}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.balance = resData.balance;
      } else {
        this.balance = 0;
      }
      this.balanceCurrPass();
    })
  }

  selectcurrbal(curr:any){
    this.currency = curr.currency;
    this.balance = curr.amount;
    this.balanceCurrPass();
  }

  getUserData(){
    this.httpService.getRequest('basic/getUserdetals', this.token).subscribe((resData:any) => {
      if(resData.success == 1){
        this.userData = resData.user;
        this.Nameupd = resData.user.username;
        this.proImg=resData.user.profileImg;
        this.ReferralId = resData.user.referr_id;
        var host = window.location.origin;
        this.referalLink = host+'/referrals?referral='+resData.user.referr_id;
        var iframe:any = document.getElementById("myFrame");
        if(iframe !== null){iframe.src = iframe.src + "?username="+resData.user.username;};
        this.userNamePass();
      }else{
        this.alert.error("somthing wents wrong !", '', {timeOut: 2000});
      }
    })
  }

  shoeCurr(){
    this.httpService.postRequest('basic/getWalletAmt',{},this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.currData=resData.msg
        this.serchData=resData.msg
      }else{
        this.alert.error("somthing wents wrong !", '', {timeOut: 2000});
      }
    })
  }

  changeCurrency(currency:any, balance:any) {
    this.currData.forEach(data => {
      data.isActive = data.currency === currency;
    });
    //   this.isActive = !this.isActive;
    //   var obj={"currency":currency}
    //   this.httpService.postRequest('basic/getWalletAmt',obj,this.token).subscribe((resData:any) => {
    //     console.log(resData)
    //     if(resData.success==1){
    //       this.amt=resData.balance[0].amount;
    //     }
    //   })
  }

  balanceCurrPass(){
    var curr = {balance: this.balance, currency : this.currency}
    this.currBal.emit(curr);
  }
  connectionPass(){
    this.ConnEvent.emit(this.isConnected);
  }

  userNamePass(){
    this.UserEvent.emit(this.Nameupd);
  }

  logout(){
      localStorage.removeItem('gAmE-t0KEN');
      localStorage.removeItem('TToken');
      localStorage.removeItem('gAmE-fav');
      localStorage.removeItem('gAmE-like');
      this.isConnected = false;
      this.connectionPass();
      this.modalService.loginSet();
      this.alert.success("logout sucessfully !", '', {timeOut: 2000});
    if(this.actRoute.snapshot.url[0].path == 'affiliate'){
      this.route.navigate(['/']);
    }
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

  onselectcurr(curr :any){
    var setcurr = this.walletData.filter(val => val.currency == curr);
    this.WithCurr = setcurr[0].currency;
    this.withBal = setcurr[0].amount;
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

  copyInputMessage(data:any){
     navigator.clipboard.writeText(data)
    .then(() => this.alert.success('Address copied to clipboard'))
  }

  SearchPair(search: any){
    if(search != "") {
      if(search.target){
       search = search.target.value;
      }else{
        search = search;
      }
    }else{
      this.currData=this.serchData;
    }
    this.searchVal = search;
    var list2:any = this.serchData;
    if (search != '') {
      search = search.toUpperCase();
      var result = list2.filter(o => o.currency.includes(search));
      const unique2 = result.filter((obj, index) => {
        return index === result.findIndex(o => obj.currency == o.currency);
      });
      this.currData = unique2;
    } else {
      this.currData = list2;
    }
  }
  
  // 
  openPopup() {
    jQuery("body").addClass("topshow");
    jQuery("#userInfo").modal('show');
    this.httpService.getRequest('basic/getUsrinfo', this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.userId=resData.msg[0]._id;
        this.userName=resData.msg[0].name;
        this.favTable=resData.msg[0].gamecount.slice(0, 3);
        this.joined=resData.msg[0].joined;
        this.tot_game=resData.msg[0].played;
        this.tot_win=resData.msg[0].wins;
        this.wages=resData.wages;
        for (let j = 0; j < this.favTable.length; j++) {
          if(this.favTable[j].wages == undefined){
            this.favTable[j].wages = 0;
          }
        }
      }else{
        this.alert.error(resData.msg,'');
      }
    })
  }


  closePopup() {
    this.displayStyle1 = "none";
  }

  editProfile(id:any){
    jQuery("body").addClass("topshow");
    jQuery("#editPro").modal("show");
  }

  updateUsername(){
    var obj={username:this.Nameupd}
    this.httpService.postRequest('basic/updateUsername',obj,this.token).subscribe((resData:any)=>{
      if(resData.success == 1){
        this.userName = resData.userName;
        this.alert.success(resData.msg,'')
      }else{
        this.alert.error(resData.msg, '', {timeOut: 2000});
      }
    })
  }

  getProimg(){
    jQuery("body").addClass("topshow");
    jQuery("#editsimg").modal("show");
  }

  onKeyPress(event: KeyboardEvent) {
    const inputChar = event.key;
    if (inputChar === ' ') {
      event.preventDefault();
    }
  }

  chooseImg(id:any){
    var obj={img:id}
    this.httpService.postRequest('basic/profileImg',obj,this.token).subscribe((resData:any)=>{
      if(resData.success == 1){
        this.proImg=resData.data;
        this.alert.success(resData.msg,'')
      }else{
        this.alert.error(resData.msg, '', {timeOut: 2000});
      }
    })
  }


  copyText(data:any, msg:any){
     navigator.clipboard.writeText(data)
    .then(() => this.alert.success(msg+' copied to clipboard'))
  }

  openModel(){
    this.modalService.openModal3();
  }


  statDet(id:any){
    jQuery("body").addClass("topshow");
    jQuery("#Statistics").modal("show");
    this.httpService.getRequest('basic/getgameInfo', this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.gameList=resData.msg
      }else{
        this.gameList=[];
      }
      this.gameNameinfo()
    })
  }

  gameNameinfo(){
    // if(this.gameSelect=="Global"){
    //   this.gameSelect="Global";
    //    this.gameTable=[];
    // }else{
    jQuery("body").addClass("topshow");
    jQuery("#userInfo").modal("hide");

      this.httpService.postRequest('basic/gameDetails',{gameName:this.gameSelect},this.token).subscribe((resData:any) => {
        if(resData.success==1){
          this.gameTable=resData.msg;
          this.gamelog.totalSum=resData.totalSum;
          this.gamelog.total_win=resData.total_win;
          this.gamelog.totalbet=resData.totalbet;
        }else{
          this.gameTable=[];
        }
      })
    // }
  }

  close_btn(removecls:any){
    jQuery("body").removeClass(removecls);
  }

  notifydata(){
    this.httpService.getRequest('basic/getNotifyData',this.token).subscribe((resData:any) => {
      if(resData.success == 1){
        this.NotifyData = resData.NotifyData;
      }else{
        this.alert.error(resData.msg);
      }
      /*if(resData.success==1){
        this.gameTable=resData.msg;
        this.gamelog.totalSum=resData.totalSum;
        this.gamelog.total_win=resData.total_win;
        this.gamelog.totalbet=resData.totalbet;
      }else{
        this.gameTable=[];
      }*/
    })
  }

  back(value:any){
    if(value=='detail'){
      jQuery("body").addClass("topshow");
      jQuery("#userInfo").modal("show");
      jQuery("#Statistics").modal("hide");
    }
  }
}