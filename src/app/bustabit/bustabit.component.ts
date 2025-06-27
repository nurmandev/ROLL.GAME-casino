import { Component, OnInit, Input, NgModule, ViewChild, ChangeDetectorRef, HostListener, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
// import { CdkDrag, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';

import { Observable, interval, Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';
// import {io} from 'socket.io-client';
import { BackendUrl } from '../../backendurl';
import * as Highcharts from 'highcharts';
declare var jQuery: any;

@Component({
  selector: 'app-bustabit',
  templateUrl: './bustabit.component.html',
  styleUrls: ['./bustabit.component.css']
})
export class BustabitComponent implements OnInit {
  fav = localStorage.getItem("gAmE-fav") ?? "";
  liked = localStorage.getItem("gAmE-like") ?? "";


  balance:any = 100;
  socket:any;backUrl:any = BackendUrl;
  currency:any = 'JB';
  min_bet = 100;
  max_bet = 10000000;
  winning_result = 1.00;

  // chart: Highcharts.Chart;
  bet_amount:any = (100).toFixed(6);  // default
  betamount:any = 100;
  chance_win_percent = 50.0;
  
  pay_out:any = (5).toFixed(2);
  payout  = 1.01;

  bethistory:any = ''; head:any=true;
  payoutHistory:any = '';

  className:any = 'largef';
  token = localStorage.getItem("gAmE-t0KEN");
  plunderSecond = "Bet\n(Next round)";

  xValues:any=[];
  yValues:any=[];

  result:any = '0.01';
  type:any = 'X';
  prefix_text:any = '';

  BetActive:any=false; bettingList:any=[]; allBethistory:any=[]; payoutAllHistory:any=[];
  showMoreHis:any=false; seedset:any=true; showMore:any=false;
  ActiveBetId:any; BetLimit:any= false; betResultsDetails:any={betList:[],};Bethistory:any=[];
  fullHis:any=[]; allbet:any=[];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {text: 'Bustabit'},
    xAxis: {
      gridLineWidth: 0,
      gridLineColor: 'transparent',
      accessibility: {rangeDescription: 'Range: 0 to 100'}
    },
    yAxis: {
      gridLineWidth: 0 // remove y-axis grid lines
    },
    series: [{type: 'line',data: [0]}],

    plotOptions: {
      line: {
        lineWidth: 2,
        linecap: 'round',
        enableMouseTracking: false,
        states: {
          hover: {
            lineWidth: 2
          }
        },
        marker: {
          enabled: false
        }
      }
    },
  };

  ff:any = 0;
  // chart: Highcharts.Chart;
  Det:any=[];
  /*emitSocket(name, content) {
    this.socket.emit(name, content);
  }*/

  fav_clr:any;like_clr:any;like_count:any;fav_count:any; chashouton:any=false;

  xAxis:any;yAxis:any;wagered:any=0;profits:any=0;win_count:any=0;loss_count:any=0;
  shouldAddClass: boolean = false;getExacttimes:any;

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

  chart: Highcharts.Chart;
  hotKey:any=false;keyName:any='';
  constructor(private httpService: ConnectionService, private toastr: ToastrService, private elementRef: ElementRef, private renderer: Renderer2, private websocket: Socket, private route: Router) { 
      if(!this.httpService.loggedIn()){
        this.head=false;
      }
      this.httpService.postRequest('basic/Specificgame',{name:'bustabit'},this.token).subscribe((resData:any)=>{
        if(resData.success==1){
          if(resData.msg.status==0){
            this.route.navigate(['/']);
          }
        }
      })
      this.getMinMax(this.currency);
      // this.chart = Highcharts.chart(this.chartOptions2);
      //this.getgraph()

    /*HC_exporting(Highcharts);
    HC_exportData(Highcharts);*/
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
        this.submitBet()
      }else{
        this.keyName='';
      }
    }
  }

  ngOnInit(): void {
    jQuery(window).keypress(function(e) {
      if (e.which == 32) {e.preventDefault();}
    });
    this.getfavNlike();this.favCount();this.likeCount();

      jQuery(".rangeslider").click(function(){
        jQuery(".showslider").toggleClass("show");
      });
      jQuery(".navicon").click(function(){
        jQuery("body").toggleClass("renav");
      });
      this.showAllHis();this.showuserBet();
      this.getBalance(this.currency);this.getgraph();
    this.chart = Highcharts.chart('container', this.chartOptions2)
      //this.chart = Highcharts.chart('container', this.chartOptions);
      //this.bet_history(this.currency);

      this.websocket.fromEvent('receiveCrash').subscribe((data: any) => {    
          this.result = data.globalVar;
          this.type = (data.status == "on") ? "x" : "s";
          /*for(var i = 0; i<)
          {

          }*/
          if(data.status == "on") {
              this.BetActive = true;
              localStorage.removeItem("tokenId");
              var s = this.chartOptions.series[0]['data'];
              if(s.length == 0){s = [0]};
              if(s.length == 1){
                s = [0];
                var currData = (data.globalVar*100).toFixed(0);
                var curvar = parseFloat(data.globalVar)/parseFloat(currData);
                var oddNum = 0;
                var i = 0;
                while (i < parseFloat(currData)) {
                  oddNum = oddNum+curvar;
                  s.push(oddNum);
                  i++;
                }
              };
              s.push(data.globalVar);
              this.chartOptions = {
                title: {text: 'Bustabit'},
                series: [{type: 'line',data: s}],
              };
              this.type = "x";
              this.prefix_text = "";

              if(this.pay_out >=  data.globalVar && this.BetLimit == true) {
                // this.BetLimit = false;
              }
              /*if(this.pay_out >=  data.globalVar && this.BetLimit == true) {
                  var obj = {pay_out:this.pay_out, currency:this.currency, bet_amount:this.bet_amount, bet_id:this.ActiveBetId, token:this.token};
                  var resData1:any = this.httpService.postRequestUpdated('bustabit/updateBetInfo', obj, this.token);
                  // this.BetLimit = false;
              }*/

          } else if(data.status == "busted" || data.status == "waiting") {
              if(data.status == "busted") {
                  this.BetLimit = false;
                  this.chashouton = false;
                  this.prefix_text = "Busted @ ";
                  this.type  = "x";
              } else {
                  if(this.result == 6){this.bettingList = []; this.showAllHis();this.showuserBet();this.getBalance(this.currency);};
                  this.BetActive = false;
                  this.prefix_text = "Starts In ";
                  this.type = "s";
                  if(data.betId !== undefined){
                    this.ActiveBetId = data.betId;
                  }
              }
              localStorage.setItem("tokenId", data.token);
              var s = this.chartOptions.series[0]['data'];
              s = [];
              this.chartOptions = {
                title: {text: 'Bustabit'},
                series: [{type: 'line',data: s}],
              };
          }
      });

      this.websocket.fromEvent('receiveUserInfo').subscribe((userData: any) => {
        if(userData.status == 1){
          this.bettingList = [];
          this.bettingList = userData.userList;
        }
      })
  }

  getMinMax(currency:any) {
    this.httpService.postRequest('bustabit/getminbetamount',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
            this.min_bet = resData.min_bet; 
            this.max_bet = resData.max_bet; 
            this.bet_amount = (this.min_bet).toFixed(6);
        }
    })
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

  conPass(data:any){
    this.head = data;this.getgraph();
    this.chart = Highcharts.chart('container', this.chartOptions2)
  }

  CurrBal(curr:any){
    this.balance = curr.balance;
    this.currency = curr.currency;
    this.getMinMax(this.currency);
  }

  bettingamount(type:any) {
      var previous:any = (this.bet_amount*1).toFixed(6);
      if(type=='10'){
        this.bet_amount = 10;
      }else if(type=='100'){
        this.bet_amount = 100;
      }else if(type=='1000'){
        this.bet_amount = 1000;
      }else if(type=='10000'){
        this.bet_amount = 10000;
      }

      if(type == "multiply") {
          this.bet_amount = (this.bet_amount * 2).toFixed(6);
      } else if(type == "divide") {
          this.bet_amount = (this.bet_amount / 2).toFixed(6);
      }

      if(this.bet_amount < this.min_bet) {
        this.bet_amount = (this.min_bet*1).toFixed(6);
      }

      if(this.bet_amount > this.balance) {
          this.bet_amount = Number(previous*1).toFixed(6);
          this.toastr.error('Insufficient Balance');
      }
      this.bet_amount = (this.bet_amount*1).toFixed(6)
  }

  calculatePercentage(number: any) {
      if(number == "" || number <= 1.01) {
        this.pay_out = (1.01).toFixed(2);
        number = 1.01; 
      } 
      const initial = 0.99;
      const target = 100;
      var factor = number / initial;
      var percentage = target / factor;
      this.chance_win_percent = percentage;
      this.pay_out = (this.pay_out*1).toFixed(2);
  }

  bettingpayout(payout:any){
    if(payout == "add") {
      this.pay_out = (parseFloat(this.pay_out)+1).toFixed(2);
    } else if(payout == "sub") {
      this.pay_out = (parseFloat(this.pay_out)-1).toFixed(2);
    }
    if(this.pay_out < this.payout) {
      this.pay_out = Number(this.payout).toFixed(2);
    }
    this.calculatePercentage(this.pay_out);
  }

  async submitBet(){
    var auth = this.httpService.loggedIn();
    if(auth == true){
      if(this.bet_amount <= this.balance) {
        if(this.ActiveBetId !== undefined && this.ActiveBetId !== "" && this.bet_amount !== null && this.bet_amount !== 0 && this.pay_out !== null && this.pay_out !== 0){
          var data = {bet_amount:this.bet_amount, currency:this.currency, betId:this.ActiveBetId, auto_cashout:this.pay_out};
          this.bettingInitiate1(data);
        }else{
          this.toastr.error('Enter Valid Details');
        }
      } else {
        this.toastr.error('Insufficient Balance');
        return;
      }
      /*var resData:any =await this.httpService.postRequestUpdated('bustabit/getGameResult',data,this.token);
      if(resData.success == 1) {
      }*/

      // bet_amount, currency, betId, auto_cashout

        /*var s = this.chartOptions.series[0]['data'];

        this.ff = this.ff + 0.10;
        s.push(this.ff);
        //this.chartOptions.series[0]['data'].push(this.ff);

        this.chartOptions = {
          title: {text: 'Bustabit'},
          series: [{type: 'line',data: s}],
        };*/
        

        // console.log(this.chartOptions);
        //this.chartOptions.update();
        //console.log(this.Highcharts.Chart);
        /*if(this.bet_amount <= this.balance) {
          var data    = {bet_amount:this.bet_amount, currency:this.currency};
          this.bettingInitiate(data);
        } else {
            this.toastr.error('Insufficient Balance');
            return;
        }*/
    }else{
        this.toastr.error('please login to continue !');
    }
  }

  async bettingInitiate1(data:any){
    var auth = this.httpService.loggedIn();
    if(auth == true){
      var resData:any =await this.httpService.postRequestUpdated('bustabit/getBetInfo', data, this.token);
      if(resData.success == 1) {
        this.BetLimit = true;
        this.getBalance(this.currency);
      }else{
        this.toastr.error(resData.msg);
      }
    }else{
      this.head=false;
      this.toastr.error('please login to continue !');
    }
  }

  async bettingInitiate(data:any) {
    var resData:any =await this.httpService.postRequestUpdated('bustabit/getGameResult',data,this.token);
    if(resData.success == 1) {
      this.winning_result = resData.result;
      //this.resultCounter(resData.result);
      if(this.payout < this.winning_result) {
          this.className = 'largew';
      } else {
          this.className = 'largef';
      }

      var data1 = {bet_amount:this.bet_amount, currency:this.currency, pay_out:this.pay_out,clientSeed:resData.clientSeed,serverSeed:resData.serverSeed,nonce:resData.nonce, result:this.winning_result};

      var resData1:any = await this.httpService.postRequestUpdated('bustabit/saveBetHistory', data1, this.token);
      var hist = resData1.history;
      this.bethistory = hist;
      this.fullHis = hist;
      this.payoutHistory = hist.slice(0, 9);
      //this.showLessBet();this.Hashsetting();

    } else {
      this.toastr.error('Insufficient Balance');
      return;
    }
  }

  async cashout(payout:any, betId:any){
      if(this.socket == undefined) {
        // this.socket = io.connect(this.backUrl);
      }
      var obj = {pay_out:payout, currency:this.currency, bet_amount:this.bet_amount, bet_id:betId, token:this.token};

      var resData1:any = await this.httpService.postRequestUpdated('bustabit/updateBetInfo', obj, this.token);
      this.BetLimit = false;
      this.chashouton = true;
      //this.websocket.emit('cashOutReq', obj);
      //this.emitSocket('cashOutReq', obj);
  }

  showAllHis(){
    this.httpService.postRequest('bustabit/getAllBetHistory',{}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.allBethistory = resData.msg;
        this.allbet = resData.msg;
        this.payoutAllHistory = this.allBethistory.slice(0, 9);
      } else {
        this.allBethistory = [];
      }
    }) 
  }

  showuserBet(){
    this.httpService.getRequest('bustabit/getUserBetHistory', this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.Bethistory = resData.msg;
        this.fullHis = resData.msg;
      } else {
        this.Bethistory = [];
      }
    }) 
  }
  Details(id:any){
    var obj={'_id':id};
    this.httpService.postRequest('bustabit/getDetails',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.betResultsDetails = resData.msg;
      }else{
        this.betResultsDetails={betList:[]}
        this.toastr.error(resData.msg,'');
      }
    })
  }

  toggleShowMoreHis() {
    this.showMoreHis = !this.showMoreHis;
    if (this.showMoreHis) {
      this.bethistory = this.fullHis;
    } else {
      this.bethistory = this.bethistory.slice(0, 10);
    }
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
    if (this.showMore) {
      this.allBethistory = this.allbet;
    } else {
      this.allBethistory = this.allBethistory.slice(0, 10);
    }
  }

  betUserDetails(data:any){
    var obj = {
      bet_amount  : data.bet_amount,
      payout      : data.payout,
      id          : data._id,
      name        : data.name,
      created_at  : this.betResultsDetails.created_at,
      result      : this.betResultsDetails.bet_result,
      serverSeed  : this.betResultsDetails.serverSeed,
      // seedstatus  : this.betResultsDetails.seedstatus,
      seedstatus  : 1,
      clientSeed  : this.betResultsDetails.clientSeed,
      withouthashserver : this.betResultsDetails.server,
      withouthashclient : this.betResultsDetails.client,
      nounce : this.betResultsDetails.nounce,
      status: this.betResultsDetails.betList[0].status,
      pro_amt: this.betResultsDetails.betList[0].win_lose_amt,
    }
    this.Det = obj;
  }

  copyInputMessage(data:any){
    navigator.clipboard.writeText(data)
    .then(() => this.toastr.info('Text copied to clipboard'))
  }

  confirmedData(){

  }
  Seedsetting(){

  }


  userFav(name:any){
   var obj={'name':name}
    this.httpService.postRequest('bustabit/userFav',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        let myArray:any = this.fav.split(',');
        if(resData.success==1 && resData.game!=""){
          if (!this.fav.includes(resData.game)) {
            myArray.push(resData.game);
            let updatedString = myArray.join(',');
            localStorage.setItem('gAmE-fav', updatedString);
          }
        }else{
          let index = myArray.indexOf('bustabit');
          if (index !== -1) {
            myArray.splice(index, 1);
          }
          localStorage.setItem("gAmE-fav", myArray.join(','));
        }
      this.favCount();this.getfavNlike();
      }
    })
  }


  userLike(name:any){
   var obj={'name':name}
    this.httpService.postRequest('bustabit/userLiked',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        let myArray:any = this.liked.split(',');
        if(resData.success==1 && resData.game!=""){
          if (!this.liked.includes(resData.game)) {
            myArray.push(resData.game);
            let updatedString = myArray.join(',');
            localStorage.setItem('gAmE-like', updatedString);
          }
        }else{
          let index = myArray.indexOf('bustabit');
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
    var obj={'name':'bustabit'}
    this.httpService.postRequest('basic/getFavCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.fav_count=resData.msg
      }
    })
  }

  likeCount(){
    var obj={'name':'bustabit'}
    this.httpService.postRequest('basic/getLikeCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.like_count=resData.msg
      }
    })
  }

  getfavNlike(){
    var game ="bustabit";
    const favt = localStorage.getItem("gAmE-fav")?? "";
    const liked = localStorage.getItem("gAmE-like")?? "";

    // console.log(favt)

    if (favt.includes(game)) {this.fav_clr=1;}else{this.fav_clr=0;}
    if (liked.includes(game)) { this.like_clr=1;}else{this.like_clr=0;}
  }

  getgraph() {
    let data = {game:'limbo'};
    this.httpService.postRequest('bustabit/getgraphed',data, this.token).subscribe((resData:any) => {
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
    let data = {game:'limbo'};
    this.httpService.postRequest('bustabit/getExacttime',data,this.token).subscribe((resData:any) => {
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

};

/*!BetLimit*/