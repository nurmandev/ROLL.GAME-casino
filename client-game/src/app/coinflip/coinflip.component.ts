import { Component, OnInit, Input, NgModule, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
declare var jQuery: any;

import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-coinflip',
  templateUrl: './coinflip.component.html',
  styleUrls: ['./coinflip.component.css']
})
export class CoinflipComponent implements OnInit {
token = localStorage.getItem("gAmE-t0KEN");
fav = localStorage.getItem("gAmE-fav") ?? "";
liked = localStorage.getItem("gAmE-like") ?? "";
userId :any = "";
activebet:any= true; cashout:any= false;
value: number = 0;options: Options = { floor: 0, ceil: 100};
result:any; spinclass:any; checkedout:any= false;
bet_amount:any = 100; currency:any = 'JB'; min_bet = 100;  max_bet = 10000000; balance:any = 0;
payout:any= 0.00; series:any=0; returnAmt:any=0.000
bet_history:any =[];head:any=true; coinstat:any=false;
serverSeed:any;clientSeed:any;nounce:any;newserverSeed:any;newclientSeed:any;
bethistory:any = []; isDisabled=false;disable_btn=false; seedset:any=true;
payoutHistory:any = '';showMoreHis:any=false;allBethistory:any=[];showMore:any= false;
permit:any=false;

//det
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_series:any=1;Det_result:any=[{bet_result: "head"}];Det_serverSeed:any;Det_clientSeed:any;
  Det_nounce:any;Det_status:any;Det_seedstatus:any;withouthashserver:any;withouthashclient:any;
  like_count:any;fav_count:any; 
//end
fav_clr:any;like_clr:any;gameTab:any=false;
resautoman:any=true;

  xAxis:any;yAxis:any;wagered:any=0;profits:any=0;win_count:any=0;loss_count:any=0;
  shouldAddClass: boolean = false;getExacttimes:any;

  xValues:any=[];yValues:any=[];
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions2: Highcharts.Options = {
    xAxis: { categories: this.xValues.map(String),},
    yAxis: { title: { text: ''}, min:  undefined,},
    legend: { enabled: false },
    title: { text: null },
    exporting: { enabled: false },
    series: [ {
      type: 'areaspline',
      data: this.yValues,
      color: 'rgb(74 164 27)',
      lineWidth: 1,
      marker: {
        enabled: false
      },
    }]
  };

  chart: Highcharts.Chart;hotKey:any=false;keyName:any;

  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute) { 
    if(!this.httpService.loggedIn()){
      this.head=false;
      this.token = localStorage.getItem("gAmE-t0KEN");
    }else{
      this.gameId();
    }
    this.httpService.postRequest('basic/Specificgame',{name:'coinflip'},this.token).subscribe((resData:any)=>{
      if(resData.success==1){
        if(resData.msg.status==0){
          this.route.navigate(['/']);
        }
      }
    })
    this.getMinMax(this.currency);
  }

  ngOnInit(): void {
    jQuery(window).keypress(function(e) {
      if (e.which == 32) {e.preventDefault();}
    });
    this.getBalance(this.currency);
    jQuery(".rangeslider").click(function(){
      jQuery(".showslider").toggleClass("show");
    });
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });

    this.bet_history_new(this.currency);
    this.getfavNlike();this.favCount();this.likeCount();
    this.showAllHis();this.getgraph();
    this.chart = Highcharts.chart('container', this.chartOptions2)
  }

  getMinMax(currency:any) {
    this.httpService.postRequest('coinflip/getminbetamount',{currency:this.currency}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.min_bet = resData.min_bet; 
        this.max_bet = resData.max_bet;
        this.bet_amount = (this.min_bet*1).toFixed(6);
      }
    })
  }


  enableKey(key:any){
    if(key==false){
      this.hotKey=true;
    }else{
      this.hotKey=false;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.hotKey==true){
      if(event.keyCode==65){
        this.keyName='a';
        this.bettingamount('divide')
      }else if(event.keyCode==83){
        this.keyName='s';
        this.bettingamount('multiply')
      }else if(event.keyCode==32){
        this.keyName='space';
        this.clkbet()
      }else if(event.keyCode==87){
        this.keyName='w';
        this.bets('heads')
      }else if(event.keyCode==69){
        this.keyName='e';
        this.bets('tails')
      }else{
        this.keyName='';
      }
    }
  }

  getfavNlike(){
    var game ="coinflip";
    const favt = localStorage.getItem("gAmE-fav")?? "";
    const liked = localStorage.getItem("gAmE-like")?? "";

    if (favt.includes(game)) {this.fav_clr=1;}else{this.fav_clr=0;}
    if (liked.includes(game)) { this.like_clr=1;}else{this.like_clr=0;}
  }

  CurrBal(curr:any){
    this.balance = curr.balance;
    this.currency = curr.currency;
    this.getMinMax(curr.currency);
    this.cuurStatus(this.currency);
  }

  cuurStatus(currency:any){
    var obj={name:currency}
    this.httpService.postRequest('basic/currStatus',obj, this.token).subscribe((resData:any) => {
      if(resData.success==1){
        if(resData.msg.status==0){
          this.alert.error('Please Choose Another Curency','')
          this.gameTab=true;
        }else{
          this.gameTab=false;
        }
      }
    })
  }

  conPass(data:any){
    this.head = data;
    this.payoutHistory = [];
    if(this.head){this.gameId();}
    this.token = localStorage.getItem("gAmE-t0KEN");
    this.bet_history_new(this.currency);this.getfavNlike();
    this.showAllHis();this.favCount();this.likeCount();
    this.getMinMax(this.currency);this.getgraph();
    this.chart = Highcharts.chart('container', this.chartOptions2)
  }
  gameId(){
    var checkdata = localStorage.getItem("gAmE-UsEr");
    if(checkdata !== null && checkdata !== undefined && checkdata !== "" ){
      this.userId = checkdata;
      this.httpService.postRequest('coinflip/getcurt',{_id:this.userId}, this.token).subscribe((resData:any) => {
        if(resData){
          this.bet_history = resData.currData.bet_result;
          this.payout = resData.currData.payout;
          this.bet_amount = (resData.currData.bet_amount).toFixed(6);
          this.series = this.bet_history.length;
          this.activebet = false;
          this.cashout = true;
        }
      })
    }else{
      this.userId = "";
    }
  }
  
  clkbet(){
    var auth = this.httpService.loggedIn();
    if(auth == true){
      if(this.bet_amount <= this.balance) {
        this.isDisabled = !this.isDisabled;
        this.bet_history = [];
        this.payout = 0.00
        this.series = 0;
        this.checkedout = false;
        this.activebet = false;
        this.coinstat = false;
      } else {
        this.alert.error('Insufficient Balance');
        return;
      }
    }else{
      this.head=false;
      this.alert.error('please login to continue !');
    }
  }

  async bets(type:any){
    this.cashout = false;
    this.permit = true;
    var data    = {bet_amount:this.bet_amount, currency:this.currency, userId:""};
    if(this.userId !== ""){data.userId = this.userId;}
    var resData:any = await this.httpService.postRequestUpdated('coinflip/getGameResult',data, this.token);
    var flipResult = Math.random();
    jQuery('#coinwhl').removeClass();
    setTimeout(() => {
      this.disable_btn = !this.disable_btn;
      if(resData.result == "heads"){
        jQuery('#coinwhl').addClass('heads');
        setTimeout(() => {
          jQuery('#coinwhl').addClass('active');
          var obj = {bet_type: type,bet_result: 'heads', status:''}
          if(type == 'heads'){
            this.cashout = true;
            if(this.payout == 0.00){
              this.payout = 1.98;
            }else{
              this.payout = 2*parseFloat(this.payout);
            }
            obj.status = 'winner';
            this.coinstat = true;
            this.bet_history.push(obj);
            this.series = this.bet_history.length;
            var storeData = { bet_amount : this.bet_amount,currency: this.currency, payout: this.payout, bet_result: this.bet_history, status : 'pending', amount: this.returnAmt}
            this.submitBet(storeData);
          }else{
            this.activebet = true;
            this.payout = 0.00
            this.coinstat = false;
            obj.status = 'loser';
            this.bet_history.push(obj);
            var storeData = { bet_amount : this.bet_amount,currency: this.currency, payout: this.payout, bet_result: this.bet_history, status : 'loser', amount: this.returnAmt}
            this.submitBet(storeData);
            this.bet_history= [];
          }
          this.permit = false;
        },3000)
      }else{
        jQuery('#coinwhl').addClass('tails');
        var obj = {bet_type: type,bet_result: 'tails', status:''}
        setTimeout(() => {
          jQuery('#coinwhl').addClass('active');
          if(type == 'tails'){
            this.cashout = true;
            if(this.payout == 0.00){
              this.payout = 1.98;
            }else{
              this.payout = 2*parseFloat(this.payout);
            }
            this.disable_btn = this.disable_btn;
            obj.status = 'winner';
            this.coinstat = true;
            this.bet_history.push(obj);
            this.series = this.bet_history.length;
            var storeData = { bet_amount : this.bet_amount,currency: this.currency, payout: this.payout, bet_result: this.bet_history, status : 'pending', amount: this.returnAmt}
            this.submitBet(storeData);
          }else{
            this.activebet = true;
            this.payout = 0.00;
            this.coinstat = false;
            obj.status = 'loser';
            this.bet_history.push(obj);
            var storeData = { bet_amount : this.bet_amount,currency: this.currency, payout: this.payout, bet_result: this.bet_history, status : 'loser', amount: this.returnAmt}
            this.submitBet(storeData);
            this.bet_history= [];
          }
          this.permit = false;
        },3000)
      }
    },100);
    this.disable_btn = this.disable_btn;
  }

  getBalance(currency:any) {
    this.httpService.postRequest('basic/getBalance',{currency:this.currency}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.balance = resData.balance;  
      } else {
        this.balance = 0;
      }
    })
  }

  bettingamount(type:any) {
    var previous = this.bet_amount;

    if(type=='1000'){
      this.bet_amount = 1000;
    }else if(type=='10000'){
      this.bet_amount = 10000;
    }else if(type=='100000'){
      this.bet_amount = 100000;
    }else if(type=='1000000'){
      this.bet_amount = 1000000;
    }
    
    if(type == "multiply") {
      this.bet_amount = (this.bet_amount * 2).toFixed(6);
    } else if(type == "divide") {
      this.bet_amount = (this.bet_amount / 2).toFixed(6);
    }

    if(this.bet_amount < this.min_bet) {
      this.bet_amount = (this.min_bet).toFixed(6);
    }
    if(this.bet_amount > this.balance) {
      this.bet_amount = Number(previous).toFixed(6);
      this.alert.error('Insufficient Balance');
    }
    this.bet_amount = Number(this.bet_amount).toFixed(6);
  }

  onSliderChange(value: any, type:any) {
    this.bet_amount = ((this.balance * value.value) / 100).toFixed(6);
    this.value = value.value;
  }

  cachout(){
    this.returnAmt = parseFloat(this.bet_amount)*parseFloat(this.payout);
    this.checkedout = true;
    this.activebet = true;
    this.cashout = false;
    var storeData = {bet_amount : this.bet_amount,currency: this.currency, payout: this.payout, bet_result: this.bet_history, status : 'winner', amount: this.returnAmt}
    this.submitBet(storeData);
  }

  submitBet(data:any){
    if(this.userId !== ""){data.userId = this.userId;}
    this.httpService.postRequest('coinflip/saveBetHistory',data ,this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        var hist = resData.history;
        this.bethistory = hist;
        this.payoutHistory = hist.slice(0, 12);
        if(resData.coinData.status == "pending"){localStorage.setItem('gAmE-UsEr', resData.userId);}
        else{localStorage.removeItem('gAmE-UsEr');}
        this.gameId(); this.getBalance(this.currency);this.showAllHis();this.getgraph();
        if(resData.status == 'loser'){
          this.alert.error('Loss the Game');
        }else if(resData.status == 'winner'){
          this.alert.success('Cash out successfully');
        }
      }else{
        this.alert.error(resData.msg);
      }
    })
  }

  bet_history_new(currency:any){
    this.httpService.postRequest('coinflip/getBetHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
          var hist = resData.history;
          this.bethistory = hist;
          this.payoutHistory = hist.slice(0, 12);
        } else {
          this.bethistory = [];
        }
    })  
  }

  toggleShowMoreHis() {
    this.showMoreHis = !this.showMoreHis;
    if (this.showMoreHis) {
      this.bethistory = this.bethistory;
    } else {
      this.bethistory = this.bethistory.slice(0, 12);
    }
  }

  showAllHis(){
    this.httpService.postRequest('coinflip/getAllBetHistory',{}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.allBethistory = resData.msg;  
      } else {
        this.allBethistory = [];
      }
    }) 
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
    if (this.showMore) {
      this.allBethistory = this.allBethistory;
    } else {
      this.allBethistory = this.allBethistory.slice(0, 12);
    }
  }

  Details(id:any){
    var obj={'_id':id,game:'coinflip'}
    this.httpService.postRequest('coinflip/getDetails',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.Det_id=resData.msg.bet_id;
        this.Det_name=resData.msg.username;
        this.Det_created_at=resData.msg.created_at;
        this.Det_betamount=resData.msg.bet_amount;
        this.Det_payout=resData.msg.payout;
        this.Det_pro_amt=resData.msg.pro_amt;
        this.Det_result=resData.msg.result;
        this.Det_series=this.Det_result.length;
        this.Det_serverSeed=resData.msg.serverSeed;
        this.Det_clientSeed=resData.msg.clientSeed;
        this.Det_nounce=resData.msg.nounce;
        this.Det_status=resData.msg.status;
        this.Det_seedstatus=resData.msg.seedstatus;
        this.withouthashserver=resData.msg.server;
        this.withouthashclient=resData.msg.client;
      }else{
        this.alert.error(resData.msg,'');
      }
    })
  }

  copyInputMessage(data:any){
     navigator.clipboard.writeText(data)
    .then(() => this.alert.info('Text copied to clipboard'))
  }

/*for hash settings*/
  updateHash(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0,oldserverSeed:this.serverSeed}
    this.httpService.postRequest('coinflip/changeHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.alert.success(resData.msg,'');
        jQuery("#exampleCenter").modal("hide"); 
      }else{
        this.alert.error(resData.msg,'');
        jQuery("#exampleCenter").modal("hide"); 
      }
    })
  }

  generateSeed(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0}
    this.httpService.postRequest('coinflip/generateHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.newclientSeed=resData.msg
      }else{
        this.alert.error(resData.msg,'');
      }
    })
  }

  Seedsetting(){
    this.httpService.postRequest('coinflip/getHash',{},this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.serverSeed=resData.serverSeed;
        this.clientSeed=resData.clientSeed;
        this.newserverSeed=resData.newSer;
        this.newclientSeed=resData.newCli;
        this.nounce=resData.nounce; 
      }else{
        this.alert.error(resData.msg,'');
      }
    })
  }
/**/

  userFav(name:any){
   var obj={'name':name}
    this.httpService.postRequest('coinflip/userFav',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        let myArray:any = this.fav.split(',');
        if(resData.success==1 && resData.game!=""){
          if (!this.fav.includes(resData.game)) {
            myArray.push(resData.game);
            let updatedString = myArray.join(',');
            localStorage.setItem('gAmE-fav', updatedString);
          }
        }else{
          let index = myArray.indexOf('coinflip');
          if (index !== -1) {
            myArray.splice(index, 1);
          }
          localStorage.setItem("gAmE-fav", myArray.join(','));
        }
      this.favCount();this.getfavNlike();
      }
    })
  }

  async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  userLike(name:any){
   var obj={'name':name}
    this.httpService.postRequest('coinflip/userLiked',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        let myArray:any = this.liked.split(',');
        if(resData.success==1 && resData.game!=""){
          if (!this.liked.includes(resData.game)) {
            myArray.push(resData.game);
            let updatedString = myArray.join(',');
            localStorage.setItem('gAmE-like', updatedString);
          }
        }else{
          let index = myArray.indexOf('coinflip');
          if (index !== -1) {
            myArray.splice(index, 1);
          }
          localStorage.setItem("gAmE-like", myArray.join(','));
        }
        this.likeCount();this.getfavNlike();
      }
    })
  }

  favCount(){
    var obj={'name':'coinflip'}
    this.httpService.postRequest('basic/getFavCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.fav_count=resData.msg
      }
    })
  }

  likeCount(){
    var obj={'name':'coinflip'}
    this.httpService.postRequest('basic/getLikeCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.like_count=resData.msg
      }
    })
  }
  async confirmedData(){
    await this.sleep(600);
    jQuery('#body').addClass('modal-open');
    jQuery('#body').attr('style','padding-right: 15px');
  }
  getgraph() {
    let data = {game:'coinflip'};
    this.httpService.postRequest('basic/getgraphed',data, this.token).subscribe((resData:any) => {
      if(resData.success==1){
        if(resData.msg==0){
          this.chart.series[0].setData([0])
        }else{
          const objects=resData.msg;
          this.xValues = objects.map(item => item.bet_amount);
          this.yValues = objects.map(item => item.profit);
          const updatedData = this.yValues;
          if (this.chart) {
            this.chart.series[0].setData(updatedData);
          }
        }
        if(resData.profit.length>0){
          this.profits=resData.profit[0].pofit;
          this.wagered=resData.profit[0].wagered;
          this.win_count=resData.profit[0].win;
          this.loss_count=resData.profit[0].loss;
        } 
      }
    })
  }

  class(){
    if(this.shouldAddClass==false){
      this.shouldAddClass=true;
    }else{
      this.shouldAddClass=false;
    }
  }
  getExacttime(){
    let data = {game:'coinflip'};
    this.httpService.postRequest('basic/getExacttime',data,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.getgraph();
      }
    })
  }
  ngOnDestroy(): void {
    var conval = <HTMLCanvasElement> document.getElementById('container');
    if(conval !== undefined){
      document.getElementById("container").setAttribute("id", "newcontainer");
    }
    this.chart.destroy();
  }
}

