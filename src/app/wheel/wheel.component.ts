import { Component, OnInit, Input, NgModule, ViewChild, ChangeDetectorRef, HostListener, ElementRef, OnDestroy  } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { NgxWheelComponent, TextAlignment, TextOrientation } from 'ngx-wheel';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';

import { Observable, interval, Subscription } from 'rxjs';


import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import * as Highcharts from 'highcharts';

declare var jQuery: any;

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.css']
})
export class WheelComponent implements OnInit {
  token = localStorage.getItem("gAmE-t0KEN");fav = localStorage.getItem("gAmE-fav") ?? "";
  liked = localStorage.getItem("gAmE-like") ?? "";

  value: number = 50;options: Options = {floor: 0,ceil: 100};
  value2: number = 50; options2: Options = {floor:0,ceil: 100};
  value3: number = 10; options3: Options = {floor:10,ceil: 50, step:10};

  @ViewChild(NgxWheelComponent, { static: false }) wheel:any;

  seed = [...Array(10).keys()]
  idToLandOn: any;items: any=[];
  textOrientation: TextOrientation = TextOrientation.HORIZONTAL;
  textAlignment: TextAlignment = TextAlignment.OUTER;

  //table toggle
  showMores: boolean = false;showMoreHis:boolean=false;
  disabledHead:any=false;autodisabled:any=false;
  randonText:any="";
  //
  head:any=true;balance:any = 0;currency:any = 'JB';bet_amount:any = (100).toFixed(6); min_bet = 100;  max_bet = 10000000; colors:any;
  risk_value:any="Low";segment_value:any=10;seed1:any=[];values:any;winAmount:any;
  selectedValue:any="Low";wheelResult:any=[];chance:any;
  checkedout:any=false;autoCheckout:any=false;
  isDisabled = true;allbet:any;allBethistory:any=[];pay_out:any=1.00;

  //det
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;Det_risk:any;
  Det_segment:any; Det_seedstatus:any;withouthashserver:any;withouthashclient:any;

  //like & fav
  like_count:any;fav_count:any;fav_clr:any;like_clr:any;

  //history
  bethistory:any=[];fullHis:any=[];payoutHistory:any=[];
  //seed
  serverSeed:any;clientSeed:any;nounce:any;newserverSeed:any;newclientSeed:any;
  //auto
  auto_bet_amount:any=(100).toFixed(6);numberofbets:any = 0;stop_on_win:any = 0.00000000;stop_on_loss:any = 0.00000000;
  auto_bet:any = true; stop_init:any = 1;isSpinning:any=false;getColor:any; seedset:any=true;
  gameTab:any=false;   
  resautoman:any=true;
  //
  riskLow:any=[{
    "value":[
      {"clr":'#fff',"val":0},
      {"clr":'#6dc1fd',"val":1.2},
      {"clr":'#48c029',"val":1.5}
    ]
  }]
  riskMedium:any=[
    {"segment":10,
        "value":[
            {"val":0.00,"clr":"#fff"},{"val":1.00,"clr":"#6dc1fd"},{"val":1.90,"clr":"#48c029"},{"val":2.00,"clr":"#f7ab14"},{"val":3.00,"clr":"#935adf"}]},
    {"segment":20,
        "value":[
            {"val":0.00,"clr":"#fff"},{"val":1.50,"clr":"#6dc1fd"},{"val":1.90,"clr":"#48c029"},{"val":2.00,"clr":"#f7ab14"},{"val":3.00,"clr":"#935adf"}]},
    {"segment":30,
        "value":[
            {"val":0.00,"clr":"#fff"},{"val":1.50,"clr":"#6dc1fd"},{"val":1.70,"clr":"#48c029"},{"val":2.00,"clr":"#f7ab14"},{"val":3.00,"clr":"#935adf"},{"val":4.00,"clr":"#ff4f4d"}]
    },
    {"segment":40,
        "value":[
            {"val":0.00,"clr":"#fff"},{"val":1.50,"clr":"#6dc1fd"},{"val":1.60,"clr":"#48c029"},{"val":2.00,"clr":"#f7ab14"},{"val":3.00,"clr":"#935adf"}]
    },
    {"segment":50,
        "value":[
            {"val":0.00,"clr":"#fff"},{"val":1.50,"clr":"#6dc1fd"},{"val":2.00,"clr":"#48c029"},{"val":3.00,"clr":"#f7ab14"},{"val":5.00,"clr":"#935adf"}]
    },
  ]  
  riskHigh:any=[
    {"segment":10,"value":[{"val":0.00,"clr":"#fff"},{"val":9.90,"clr":"#6dc1fd"}]},
    {"segment":20,"value":[{"val":0.00,"clr":"#fff"},{"val":19.80,"clr":"#ff4f4d"}]},
    {"segment":30,"value":[{"val":0.00,"clr":"#fff"},{"val":29.70,"clr":"#ff4f4d"}]},
    {"segment":40,"value":[{"val":0.00,"clr":"#fff"},{"val":39.60,"clr":"#ff4f4d"}]},
    {"segment":50,"value":[{"val":0.00,"clr":"#fff"},{"val":49.50,"clr":"#ff4f4d"}]},
  ] 


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

    chart: Highcharts.Chart;
    wagered:any=0;profits:any=0;win_count:any=0;loss_count:any=0;hotKey:any=false;keyName:any;

  constructor(private httpService:ConnectionService,private toastr: ToastrService,private route: Router) {
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
    this.getMinMax(this.currency);
    this.httpService.postRequest('basic/Specificgame',{name:'wheel'},this.token).subscribe((resData:any)=>{
      if(resData.success==1){
        if(resData.msg.status==0){
          this.route.navigate(['/']);
        }
      }
    })
  }

  ngOnInit(): void {
    jQuery(window).keypress(function(e) {
      if (e.which == 32) {e.preventDefault();}
    });
    jQuery(".rangeslider").click(function(){
      jQuery(".showslider").toggleClass("show");
    });
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });

    this.bet_history(this.currency);this.allUser_history();this.favCount();this.likeCount();


    this. colors = ['#6dc1fd','#6dc1fd','#6dc1fd','#6dc1fd','#fff','#6dc1fd','#48c029','#6dc1fd','#6dc1fd','#fff','#6dc1fd']
    this.items = this.seed.map((value) => ({
      fillStyle: this.colors[value % 10 ],
      id: value,
      textFillStyle: 'white',
    }))
    //this.idToLandOn = this.seed[Math.floor(Math.random() * this.seed.length)];
    
    this.segmentChg('Low')
    this.getgraph();this.chart = Highcharts.chart('container', this.chartOptions2);
  }



  getgraph() {
    let data = {game:'wheel'};
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


  enableKey(key:any){
    if(key==false){
      this.hotKey=true;
    }else{
      this.hotKey=false;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.hotKey==true && this.resautoman==true){
      if(event.keyCode==65){
        this.keyName='a';
        this.bettingamount('divide')
      }else if(event.keyCode==83){
        this.keyName='s';
        this.bettingamount('multiply')
      }else if(event.keyCode==32){
        this.keyName='space';
        if(this.autodisabled!=true){
          this.submitBet()
        }
      }else{
        this.keyName='';
      }
    }
  }

  getExacttime(){
    let data = {game:'wheel'};
    this.httpService.postRequest('basic/getExacttime',data,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.getgraph();
      }
    })
  }

  async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
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

  //ngx wheel functions
  reset() { this.wheel.reset() }

  before() {}

  async spin(prize:any) {

    this.idToLandOn = prize
    await new Promise(resolve => setTimeout(resolve, 0));

    // this.wheel.spin()
  }
  after() {
    // console.log('Spin ended');
  } 
  //

  getMinMax(currency:any) {
    this.httpService.postRequest('wheel/getminbetamount',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
            this.min_bet = resData.min_bet; 
            this.max_bet = resData.max_bet; 
            this.bet_amount = (this.min_bet*1).toFixed(6);
        }
    })
  }

  conPass(data:any){
    this.head = data;
    this.token = localStorage.getItem("gAmE-t0KEN");
    this.payoutHistory = [];
    this.bet_history(this.currency);this.allUser_history();this.favCount();this.likeCount();
    this. colors = ['#6dc1fd','#6dc1fd','#6dc1fd','#6dc1fd','#fff','#6dc1fd','#48c029','#6dc1fd','#6dc1fd','#fff','#6dc1fd']
    this.items = this.seed.map((value) => ({fillStyle: this.colors[value % 7 ],id: value,textFillStyle: 'white',}))
    this.segmentChg('Low')
  }

  CurrBal(curr:any){
    this.balance = curr.balance;
    this.currency = curr.currency;
    this.cuurStatus(this.currency)
    this.getMinMax(curr.currency);
  }

  cuurStatus(currency:any){
    var obj={name:currency}
    this.httpService.postRequest('basic/currStatus',obj, this.token).subscribe((resData:any) => {
      if(resData.success==1){
        if(resData.msg.status==0){
          this.toastr.error('Please Choose Another Curency','')
          this.gameTab=true;
        }else{
          this.gameTab=false;
        }
      }
    })
  }

  bettingamount(type:any) {
    var previous:any = (this.bet_amount*1).toFixed(6);
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

    if(this.bet_amount < this.min_bet) { this.bet_amount = (this.min_bet*1).toFixed(6);}

    if(this.bet_amount > this.balance) {
      this.bet_amount = Number(previous*1).toFixed(6);
      this.toastr.error('Insufficient Balance');
    }
    this.bet_amount = (this.bet_amount*1).toFixed(6);
  }

  onSliderChange(value: any, type:any) {
    if(type == "auto") {
      this.auto_bet_amount = ((this.balance * value.value) / 100).toFixed(6);
    } else {
      this.bet_amount = ((this.balance * value.value) / 100).toFixed(6);
    }
      
    // this.value = value.value;
  }

  change(value:any,option:any) {
    if(option=="risk"){
      this.risk_value=value;
      if(value=="Low"){
        this.colors=['#6dc1fd','#6dc1fd','#6dc1fd','#6dc1fd','#fff','#6dc1fd','#48c029','#6dc1fd','#6dc1fd','#fff','#6dc1fd']
        this.values=10;
      }else if(value=="Medium"){
        this.colors=['#fff','#f7ab14','#6dc1fd','#fff','#935adf','#fff','#6dc1fd','#48c029','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff']
        this.values=19;
      }else{
        this.colors=['#fff','#fff','#fff','#fff','#fff','#fff','#6dc1fd','#fff','#fff','#fff']
        this.values=8;
      }
    }else{
      this.segment_value=value;
      // console.log("!")
      if(this.risk_value=="Low"){
        this.colors=['#6dc1fd','#6dc1fd','#6dc1fd','#6dc1fd','#fff','#6dc1fd','#48c029','#6dc1fd','#6dc1fd','#fff','#6dc1fd']
    //  ['#fff','#6dc1fd','#fff','#fff','#48c029','#fff','#fff','#6dc1fd','#fff','#fff','#6dc1fd','#fff']
        this.values=10;
        if(value==10){
          this.seed = [...Array(10).keys()]
        }else if(value==20){
          this.seed = [...Array(20).keys()]
        }else if(value==30){ 
          this.seed = [...Array(30).keys()]
        }else if(value==40){ 
          this.seed = [...Array(40).keys()]
        }else{
          this.seed = [...Array(50).keys()]
        }
      }else{
        if(value==10){ 
          this.seed = [...Array(10).keys()]
        }else if(value==20){
          this.seed = [...Array(20).keys()]
        }else if(value==30){ 
          this.seed = [...Array(30).keys()]
        }else if(value==40){ 
          this.seed = [...Array(40).keys()]
        }else{
          this.seed = [...Array(50).keys()]
        }
      }
    }
    if(this.risk_value=="High" && (this.segment_value==20 || this.segment_value==30 || this.segment_value==40 ||this.segment_value==50) ){
      this.items = this.seed.map((value) => ({
        fillStyle: value === 9 ? '#ff4f4d' : '#fff',
        id: value,
        textFillStyle: 'white',
      }));
      //this.idToLandOn = this.seed[Math.floor(Math.random() * this.seed.length)];
      this.segmentChg(value);
      setTimeout(()=>{
        this.wheel.reset();
      },50);
      return ;
    }

    if(this.risk_value=="Medium" && this.segment_value==30 ){
      this.colors=['#fff','#f7ab14','#6dc1fd','#fff','#935adf','#fff','#6dc1fd','#48c029','#fff','#fff','#fff','#fff','#fff','#fff','#ff4f4d','#fff','#fff','#fff','#fff','#fff']
      this.items = this.seed.map((value) => ({
        fillStyle: this.colors[value % this.values],
        id: value,
        textFillStyle: 'white',
      }));
      
      //this.idToLandOn = this.seed[Math.floor(Math.random() * this.seed.length)];
      this.segmentChg(value);
      setTimeout(()=>{
        this.wheel.reset();
      },50);
      return ;
    }

    this.items = this.seed.map((value) => ({
      fillStyle: this.colors[value % this.values],
      id: value,
      textFillStyle: 'white',
    }));
    //this.idToLandOn = this.seed[Math.floor(Math.random() * this.seed.length)];
    this.segmentChg(value);
    setTimeout(()=>{
      this.wheel.reset();
    },50);
  }

  segmentChg(value:any){
    if(this.risk_value=="Low"){
      var value:any=[]
      for(let res of this.riskLow){
        this.wheelResult=res.value;
      }
    }else if(this.risk_value=="Medium"){
      for(let res of this.riskMedium){
        if(res.segment==this.segment_value){
          this.wheelResult=res.value
        }
      }
    }else{
      for(let res of this.riskHigh){
        if(res.segment==this.segment_value){
          this.wheelResult=res.value
        }
      }
    }
  }

  out(){
    jQuery('#wheels').removeClass('spcial');
  }

  over(data:any,clr:any){
    var color=clr;
    jQuery('#wheels').addClass('spcial');
    var result=this.bet_amount*data;
    this.winAmount=result.toFixed(2);
    const uniqueColors = new Set(this.items.map(item => item.fillStyle));
    const colorCounts:any = [];
    for (const colorObj of uniqueColors) {
      const count = (this.items as {fillStyle: string}[])
        .filter(item => item.fillStyle === colorObj)
        .length;
      colorCounts.push({ value: colorObj, count });
    }

    for(const val of colorCounts){
      if(val.value==color){
        this.chance=val.count
      }else{
      }
    }
  }

  number_of_bets(number:any) {
    if(number == "infinity") {
      this.numberofbets = 100000000000;
    } else {
      this.numberofbets = number;
    }
  }

  auto_bettingamount(type:any) {
    var previous:any = (this.auto_bet_amount*1).toFixed(6);

    if(type=='1000'){
      this.auto_bet_amount = 1000;
    }else if(type=='10000'){
      this.auto_bet_amount = 10000;
    }else if(type=='100000'){
      this.auto_bet_amount = 100000;
    }else if(type=='1000000'){
      this.auto_bet_amount = 1000000;
    }
    
    if(type == "multiply") {
        this.auto_bet_amount = (this.auto_bet_amount * 2).toFixed(6);
    } else if(type == "divide") {
        this.auto_bet_amount = (this.auto_bet_amount / 2).toFixed(6);
    }

    if(this.auto_bet_amount < this.min_bet) {
      this.auto_bet_amount = (this.min_bet).toFixed(6);
    }

    if(this.auto_bet_amount > this.balance) {
      this.auto_bet_amount = Number(previous*1).toFixed(6);
      this.toastr.error('Insufficient Balance');
    }
    this.auto_bet_amount = (this.auto_bet_amount*1).toFixed(6);
  }

  submitBet(){
    if(this.head==false){
      this.toastr.error('please login to continue')
    }else{
      this.autodisabled=true;
      if(this.bet_amount <= this.balance) {
        var data  = {bet_amount:this.bet_amount, currency:this.currency,segment:this.segment_value};
        this.bettingInitiates(data);
      } else {
        this.toastr.error('Insufficient Balance');
      }
    }
  }

  //for manual bet
  async bettingInitiates(data:any){
    try{
      this.randonText="";
     this.checkedout = true;
      var results: any = await this.httpService.postRequestUpdated('wheel/getGameResult', data, this.token);
      if(results.success==1){
        var integerPart = Math.floor(results.result);
        this.idToLandOn = integerPart;
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        this.wheel.spin()
        this.payoutResult(integerPart)
        await new Promise(resolve => setTimeout(resolve, 6000)); 
        this.wheel.reset();
        this.checkedout = false;
        var datas = {bet_amount:this.bet_amount,currency:this.currency,risk:this.risk_value,segment:this.segment_value,clientSeed:results.clientSeed,serverSeed:results.serverSeed,nonce:results.nonce, result:results.result,pay_out:this.pay_out};

        var resData1:any = await this.httpService.postRequestUpdated('wheel/saveBetHistory',datas,this.token);
        this.randonText=((resData1.payOut*1).toFixed(2)) + " X";
        var hist = resData1.history;
        this.bethistory = hist;
        if(resData1.status=="loser"){this.toastr.error('Loss the game')
        }else{ this.toastr.success('Won the Game')}
        this.payoutHistory = hist.slice(0 , 12);
        this.allUser_history();
        this.getBalance(this.currency);
        this.getgraph();
      }else{
        this.toastr.error(results.msg,'')
      }
      this.autodisabled=false;
    }catch(error){
      console.error('An error occurred:', error);
    }
  }

  payoutResult(result:any){
    for(var get of this.items){
      if(get.id==result){
        this.getColor=get.fillStyle
      }
    }
    const obj = this.wheelResult.find(item => item.clr === this.getColor);
    if (obj) { var data=obj.val; this.pay_out=data;}
  }

  async sumbit_auto_bet(){
    try{
      if(this.head==false){
        this.toastr.error('please login to continue')
      }else{
        this.disabledHead=true;
        var win_balance  = this.balance * 10000;
        var loss_balance = 0;
        this.auto_bet = false;
        this.stop_init = 1;
        if(this.numberofbets == 0) {
          this.numberofbets = 1000000000;
        }
        if(this.stop_on_win > 0) {
          win_balance = parseFloat(this.balance) + parseFloat(this.stop_on_win);
        } 
        if(this.stop_on_loss > 0 && (this.balance >= this.stop_on_loss)) {
          loss_balance = this.balance - this.stop_on_loss
        }
        
        var data = {bet_amount:this.bet_amount, currency:this.currency,segment:this.segment_value};
        if (!this.isSpinning && this.auto_bet!=true) {
          this.isSpinning = true;
          var results: any = await this.httpService.postRequestUpdated('wheel/getGameResult',data,this.token);
          if(results.success==1){
            var integerPart = Math.floor(results.result);
            this.idToLandOn = integerPart;
            for (var j = 0; j <= this.numberofbets; j++) { 
              if(this.stop_init==0){ 
                break ;
              }
              if(this.balance >= win_balance || this.balance <= loss_balance || j == this.numberofbets || this.stop_init == 0) {
                this.auto_bet = true;
                break ;
              }else{
                await new Promise(resolve => setTimeout(resolve, j * 10)); 
                this.wheel.spin();
                this.payoutResult(integerPart)
                await new Promise(resolve => setTimeout(resolve, 5000)); 
                this.wheel.reset();
                results =await this.httpService.postRequestUpdated('wheel/getGameResult',data,this.token);
                integerPart = Math.floor(results.result);
                this.idToLandOn = integerPart;
                var datas = {bet_amount:this.auto_bet_amount,currency:this.currency,risk:this.risk_value,segment:this.segment_value,clientSeed:results.clientSeed,serverSeed:results.serverSeed,nonce:results.nonce, result:results.result,pay_out:this.pay_out};
                var resData1:any = await this.httpService.postRequestUpdated('wheel/saveBetHistory',datas,this.token);
                this.randonText=((resData1.payOut*1).toFixed(2)) + " X";
                this.balance=resData1.balance;
                var hist = resData1.history;
                this.bethistory = hist;
                this.payoutHistory = hist.slice(0 , 12);
                this.getBalance(this.currency);
              }
            }
            this.isSpinning = false;
            await new Promise(resolve => setTimeout(resolve, 400));
            this.wheel.reset();
            this.allUser_history()
            this.getgraph();
          }else{
            this.toastr.error(results.msg,'');
          }
          this.disabledHead=false;
        }
      }
    }catch(e){
      console.error('An error occurred:', e);
    }   
  }

  async stop_auto_bet() {
    this.stop_init = 0;
    // await new Promise(resolve => setTimeout(resolve, 1000)); 
    // this.wheel.reset();
    this.auto_bet = true;
  }

  //userhistory
  bet_history(currency:any){
    this.httpService.postRequest('wheel/getBetHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
          var hist = resData.history;
          this.bethistory = hist;
          this.fullHis=hist;
          this.payoutHistory = hist.slice(0, 12);
        } else {
          this.bethistory = [];
        }
    })  
  }

  //full history
  allUser_history(){
    this.httpService.postRequest('wheel/getAllBetHistory',{},this.token).subscribe((resData:any)=> {
      if(resData.success == 1) {
        this.allbet=resData.msg;
        this.allBethistory = resData.msg;  
      } else {
        this.allBethistory = {};
      }
    }) 
  }

  //toogle all user
  toggleShowMore() {
    this.showMores = !this.showMores;
    if (this.showMores) {
      this.allBethistory = this.allbet;
    } else {
      this.allBethistory = this.allbet.slice(0, 12);
    }
  }

  //user
  toggleShowMoreHis() {
    this.showMoreHis = !this.showMoreHis;
    if (this.showMoreHis) {
      this.bethistory = this.fullHis;
    } else {
      this.bethistory = this.bethistory.slice(0, 12);
    }
  }
  
  //details
  getDetails(id:any){
    var obj={'_id':id,game:'wheel'};
    this.httpService.postRequest('wheel/getDetails',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.Det_id=resData.msg.bet_id;
        this.Det_name=resData.msg.username;
        this.Det_created_at=resData.msg.created_at;
        this.Det_betamount=resData.msg.bet_amount;
        this.Det_payout=resData.msg.payout;
        this.Det_pro_amt=resData.msg.pro_amt;
        this.Det_result=resData.msg.result;
        this.Det_serverSeed=resData.msg.serverSeed;
        this.Det_clientSeed=resData.msg.clientSeed;
        this.Det_nounce=resData.msg.nounce;
        this.Det_status=resData.msg.status;
        this.Det_risk=resData.msg.risk;
        this.Det_segment=resData.msg.segment;
        this.Det_seedstatus=resData.msg.seedstatus;
        this.withouthashserver=resData.msg.server;
        this.withouthashclient=resData.msg.client;
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }

  //textcopy
  copyInputMessage(data:any){
    navigator.clipboard.writeText(data)
    .then(() => this.toastr.error('Text copied to clipboard'))
  }

  //seed
  Seedsetting(){
    this.httpService.postRequest('wheel/getHash',{},this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.serverSeed=resData.serverSeed;
        this.clientSeed=resData.clientSeed;
        this.newserverSeed=resData.newSer;
        this.newclientSeed=resData.newCli;
        this.nounce=resData.nounce; 
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }

  //generate seed
  generateSeed(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0}
    this.httpService.postRequest('wheel/generateHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.newclientSeed=resData.msg
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }

  //update hash
  updateHash(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0,oldserverSeed:this.serverSeed}
    this.httpService.postRequest('wheel/changeHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.toastr.success(resData.msg,'');
        jQuery("#exampleCenter").modal("hide"); 
      }else{
        this.toastr.error(resData.msg,'');
        jQuery("#exampleCenter").modal("hide"); 
      }
    })
  }

  getfavNlike(){
    var game ="wheel";
    const favt = localStorage.getItem("gAmE-fav")?? "";
    const liked = localStorage.getItem("gAmE-like")?? "";

    if (favt.includes(game)) {this.fav_clr=1;}else{this.fav_clr=0;}
    if (liked.includes(game)) { this.like_clr=1;}else{this.like_clr=0;}
  }


  //user favourite
  userFav(name:any){
   var obj={'name':name};
    this.httpService.postRequest('wheel/userFav',obj,this.token).subscribe((resData:any) => {
      var fav= localStorage.getItem("gAmE-fav") ?? "";
      let myArray:any = fav.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!fav.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-fav', updatedString);
        }
      }else{
        let index = myArray.indexOf('wheel');
        if (index !== -1) {
          myArray.splice(index, 1);
        }
        localStorage.setItem("gAmE-fav", myArray.join(','));
      }
      this.favCount();this.getfavNlike();
    })
  }

  //user Like
  userLike(name:any){
   var obj={'name':name};
    this.httpService.postRequest('wheel/userLiked',obj,this.token).subscribe((resData:any) => {
      var like= localStorage.getItem("gAmE-like") ?? "";
      let myArray:any = like.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!like.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-like', updatedString);
        }
      }else{
        let index = myArray.indexOf('wheel');
        if (index !== -1) {
          myArray.splice(index, 1);
        }
        localStorage.setItem("gAmE-like", myArray.join(','));
      }
        this.likeCount();this.getfavNlike();
    })
  }

  //fav count
  favCount(){
    var obj={'name':'wheel'}
    this.httpService.postRequest('basic/getFavCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.fav_count=resData.msg
      }
    })
  }

  // like count
  likeCount(){
    var obj={'name':'wheel'}
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

  ngOnDestroy(): void {
    var conval = <HTMLCanvasElement> document.getElementById('canvas');
    if(conval !== undefined){
      document.getElementById("canvas").setAttribute("id", "newcanvas");
    }
    this.chart.destroy();
  }
}
