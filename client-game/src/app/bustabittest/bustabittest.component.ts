import { Component, OnInit, Input, NgModule, ViewChild, ChangeDetectorRef, HostListener, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';

import { Observable, interval, Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { BackendUrl } from '../../backendurl';
import * as Highcharts from 'highcharts';
declare var jQuery: any;
import { Chart, HIGHCHARTS_MODULES} from 'angular-highcharts';

@Component({
  selector: 'app-bustabittest',
  templateUrl: './bustabittest.component.html',
  styleUrls: ['./bustabittest.component.css']
})

export class BustabittestComponent implements OnInit {
 chart:any = Chart;

  balance:any = 0;
  socket:any;backUrl:any = BackendUrl;
  currency:any = 'JB';
  min_bet = 100;
  max_bet = 10000000;
  winning_result = 1.00;
  bet_amount:any = 100;
  betamount:any = 100;
  chance_win_percent = 50.0;
  
  pay_out = 100;
  payout  = 1.98;

  bethistory:any = ''; head:any=true;
  payoutHistory:any = '';

  className:any = 'largef';
  token = localStorage.getItem("gAmE-t0KEN");

  xValues:any=[];
  yValues:any=[];

  result:any = '0.01';
  type:any = 'X';
  prefix_text:any = '';

  BetActive:any=false; bettingList:any=[];
  ActiveBetId:any; BetLimit:any= false;

  // Highcharts: typeof Highcharts = Highcharts;
  // chartOptions: Highcharts.Options = {
  //   title: {text: 'Bustabit'},
  //   xAxis: {
  //     gridLineWidth: 0,
  //     gridLineColor: 'transparent',

  //     categories : ['1','2','3','4','5','6','7','8','9','10'],
  //     /*labels:{
  //       formatter: function () {
  //            return this.value+ ' km';
  //         }
  //     }*/
  //   },
  //   yAxis: {
  //     gridLineWidth: 0,
  //   },
  //   series: [{type: 'line',data: [0]}],

  //   plotOptions: {
  //     line: {
  //       lineWidth: 1,
  //       linecap: 'round',
  //       enableMouseTracking: false,
  //       states: {
  //         hover: {
  //           lineWidth: 1
  //         }
  //       },
  //       marker: {
  //         enabled: false
  //       },
  //     }
  //   },
  // };

  ff:any = 0;
  // chart: Highcharts.Chart;

pointData:any = [0,0];

  emitSocket(name, content) {
    this.socket.emit(name, content);
  }

  constructor(private httpService: ConnectionService, private toastr: ToastrService, private elementRef: ElementRef, private renderer: Renderer2, private websocket: Socket) { 
      if(!this.httpService.loggedIn()){
        this.head=false;
      }
      this.init();


  }
  ngOnInit(): void {
      jQuery(".rangeslider").click(function(){
        jQuery(".showslider").toggleClass("show");
      });
      

      this.getBalance(this.currency);
      

      // this.websocket.fromEvent('receiveUserInfo').subscribe((userData: any) => {
      //   if(userData.status == 1){
      //     this.bettingList = [];
      //     this.bettingList = userData.userList;
      //     console.log(this.bettingList);
      //   }
      // })
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
    this.head = data;
  }

  CurrBal(curr:any){
    this.balance = curr.balance;
    this.currency = curr.currency;
  }

  bettingamount(type:any) {
      var previous = this.bet_amount;
      if(type == "multiply") {
          this.bet_amount = this.bet_amount * 2;
      } else if(type == "divide") {
          this.bet_amount = this.bet_amount / 2;
      }
      if(this.bet_amount < 100) {
        this.bet_amount = this.min_bet;
      }
      if(this.bet_amount > this.balance) {
          this.bet_amount = previous;
          this.toastr.error('Insufficient Balance');
      }
  }

  calculatePercentage(number: any) {
      if(number == "" || number <= 1.01) {
        this.pay_out = 1.01;
        number = 1.01; 
      } 
      const initial = 0.99;
      const target = 100;
      var factor = number / initial;
      var percentage = target / factor;
      this.chance_win_percent = percentage;
  }

  async submitBet(){
    this.BetLimit = true;
    if(this.bet_amount <= this.balance) {
      if(this.ActiveBetId !== undefined && this.ActiveBetId !== "" && this.bet_amount !== null && this.bet_amount !== 0 && this.pay_out !== null && this.pay_out !== 0){

      }else{
        this.toastr.error('Enter Valid Details');
      }
      var data = {bet_amount:this.bet_amount, currency:this.currency, betId:this.ActiveBetId, auto_cashout:this.pay_out};
      this.bettingInitiate1(data);
    } else {
      this.toastr.error('Insufficient Balance');
      return;
    }
  }

  async bettingInitiate1(data:any){
    var auth = this.httpService.loggedIn();
    if(auth == true){
      var resData:any =await this.httpService.postRequestUpdated('bustabit/getBetInfo', data, this.token);
      if(resData.success == 1) {
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
      if(this.payout < this.winning_result) {
          this.className = 'largew';
      } else {
          this.className = 'largef';
      }

      var data1 = {bet_amount:this.bet_amount, currency:this.currency, pay_out:this.pay_out,clientSeed:resData.clientSeed,serverSeed:resData.serverSeed,nonce:resData.nonce, result:this.winning_result};

      var resData1:any = await this.httpService.postRequestUpdated('bustabit/saveBetHistory', data1, this.token);
      var hist = resData1.history;
      this.bethistory = hist;
      this.payoutHistory = hist.slice(0, 10);
    } else {
      this.toastr.error('Insufficient Balance');
      return;
    }
  }
  cashout(payout:any, betId:any){
    this.BetLimit = false;
    if(this.socket == undefined) {
    }
    var obj = {pay_out:payout,bet_id:betId, token:this.token};
    console.log(obj);
    this.emitSocket('cashOutReq', obj);
  }

  init() {
    var newData:any = 0;

    let chart = new Chart({
      chart: { type: 'spline',animation: true,renderTo: 'chart-container'},
      title: { text: ' Game ' },
      xAxis: { gridLineWidth:0,gridLineColor:'transparent',type: 'linear', },
      yAxis: { gridLineWidth: 0 ,type: 'linear',min:0,max:11,gridLineColor:'transparent',  },
      legend: {  enabled: false},
      tooltip: { enabled: false,},
      plotOptions: {spline: {lineWidth: 2,marker: {enabled: false,states: { hover: {enabled: false,}}},pointInterval: 3600000,}},
      series: [{ type: 'spline', data: [this.pointData],color: 'green',}]
    });
    this.chart = chart;


    this.websocket.fromEvent('receiveCrash').subscribe((data: any) => {   
      newData =parseFloat(data.globalVar);
      newData= (+newData).toFixed(2)
      this.type = (data.status == "on") ? "x" : "s";
      if(data.status == "on") {
        localStorage.removeItem("tokenId");
        console.log(newData)
        var yax = this.calculateY(newData)
        this.pointData = [newData-0]  
        console.log(this.pointData)
        this.chart.ref.series[0].addPoint(this.pointData);
      }else{
        console.log('end',data)
        this.chart.ref.series[0].setData([], true);
        this.chart.ref.series[0].addPoint([0, 0], true, true);
      }
    });
  }


  calculateY(time: number) {
    if(time < 1){
      return 0.10+0.10;
    }else if (time <= 1) {
      return 0.5;
    } else if (time > 1 && time <= 2) {
      return 1.5;
    } else if (time > 2 && time <= 3) {
      return 2.5;
    } else if (time > 3 && time <= 4) {
      return 3.5;
    } else if (time > 4 && time <= 5) {
      return 4.5;
    } else if (time > 5 && time <= 6) {
      return 5.5;
    } else {
      return 6.5 ;
    }
  }

  addPoint() {
    if (this.chart) {
      this.chart.addPoint(Math.floor(Math.random() * 10));
      console.log(Math.floor(Math.random() * 10))
    } else {
      alert('init chart, first!');
    }
  }

  addSerie() {
    this.chart.addSeries({
      name: '', 
      data: [10,20,30,40,50,50],
      marker: { enabled: false,
        states: {hover: {enabled: false}}
      }
    });
  }

  removePoint() {
    this.chart.removePoint(this.chart.ref.series[0].data.length - 1);
  }

  removeSerie() {
    this.chart.removeSeries(this.chart.ref.series.length - 1);
  }
}