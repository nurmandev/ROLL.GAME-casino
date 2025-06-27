import { Component,ViewChild, OnInit, OnDestroy,HostListener } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, interval, Subscription } from 'rxjs';
import { NgxWheelComponent, TextAlignment, TextOrientation } from 'ngx-wheel';

import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import * as Highcharts from 'highcharts';

declare var jQuery: any;

@Component({
  selector: 'app-ringoffortune',
  templateUrl: './ringoffortune.component.html',
  styleUrls: ['./ringoffortune.component.css']
})
export class RingoffortuneComponent implements OnInit {
  token = localStorage.getItem("gAmE-t0KEN");head:any=true;
  fav = localStorage.getItem("gAmE-fav") ?? "";
  liked = localStorage.getItem("gAmE-like") ?? "";
  balance:any = 0;currency:any = 'JB';disable:any=true;autodisable:any=true;toggleone=false;
  //manual bet
  bet_amount:any;totalbets:any=(0).toFixed(6);payResult:any=0;
  bet_amount1:any=(0).toFixed(6);bet_amount2:any=(0).toFixed(6);bet_amount3:any=(0).toFixed(6);bet_amount4:any=(0).toFixed(6); min_bet = 100;  max_bet = 10000000;
  //auto
  auto_bet_amount:any;auto_bet_amount1:any=(0).toFixed(6);auto_bet_amount2:any=(0).toFixed(6);auto_bet_amount3:any=(0).toFixed(6);
  auto_bet_amount4:any=(0).toFixed(6);numberofbets:any = 0;stop_on_win:any = 0;stop_on_loss:any = 0;
  auto_bet:any = true; stop_init:any = 1;disabledHead:any=false;isSpinning:any=false;
  //like & fav
  like_count:any;fav_count:any;fav_clr:any;like_clr:any;
  //
  checkedout:any=false;autoCheckout:any=false;getColor:any;pay_out:any;
  //seed
  serverSeed:any;clientSeed:any;nounce:any;newserverSeed:any;newclientSeed:any;seedset:any=true;
  //history
  bethistory:any=[];fullHis:any=[];payoutHistory:any=[];showMoreHis:boolean=false;allbet:any;
  allBethistory:any=[];showMores: boolean = false;
  //result
  returnAmt:any=0;payOuts:any=0;shoeRes:any=false;

  //det
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;Det_risk:any;
  Det_segment:any;Det_initialbet:any;Det_gameResult:any;Det_seedstatus:any;withouthashserver:any;withouthashclient:any;


  @ViewChild(NgxWheelComponent, { static: false }) fwheel:any;

  seed = [...Array(31).keys()];
  colors = ['#cfdff7','#cfdff7','#cfdff7','#cfdff7','#ff842e','#cfdff7','#773cfd','#cfdff7','#ff842e','#7bc514','#cfdff7','#cfdff7','#7bc514'];

  idToLandOn: any;items: any=[];
  textOrientation: TextOrientation = TextOrientation.HORIZONTAL;
  textAlignment: TextAlignment = TextAlignment.OUTER;

  wheelResult=[{"clr":'#cfdff7',"val":2},{"clr":'#773cfd',"val":3},{"clr":'#ff842e',"val":6}
  ,{"clr":'#7bc514',"val":99}]
  
 colorCounts = [
  { color: '#cfdff7', count: 1 },
  { color: '#ff842e', count: 1 },
  { color: '#cfdff7', count: 1 },
  { color: '#ff842e', count: 1 },
  { color: '#cfdff7', count: 1 },
  { color: '#773cfd', count: 1 },

  { color: '#cfdff7', count: 1 },
  { color: '#773cfd', count: 1 },
  { color: '#cfdff7', count: 1 },
  { color: '#773cfd', count: 1 },
  { color: '#cfdff7', count: 1 },
  { color: '#773cfd', count: 1 },

  { color: '#cfdff7', count: 1 },
  { color: '#ff842e', count: 1 },
  { color: '#cfdff7', count: 1 },
  { color: '#ff842e', count: 1 },

  { color: '#cfdff7', count: 1 },
  { color: '#773cfd', count: 1 },
  { color: '#cfdff7', count: 1 },
  { color: '#773cfd', count: 1 },
  { color: '#cfdff7', count: 1 },
  { color: '#773cfd', count: 1 },
  { color: '#ff842e', count: 1 },
  { color: '#7bc514', count: 1 },

  { color: '#ff842e', count: 1 },
  { color: '#cfdff7', count: 1 },
  { color: '#773cfd', count: 1 },
  { color: '#cfdff7', count: 1 },
  { color: '#773cfd', count: 1 },
  { color: '#cfdff7', count: 1 },
  { color: '#773cfd', count: 1 },
  { color: '#cfdff7', count: 1 },

];
shouldAddClass: boolean = false;
addclass: boolean = false;
  p1 = 0;gameTab:any=false;

wagered:any=0;profits:any=0;win_count:any=0;loss_count:any=0;

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

  resautoman:any=true;
    chart: Highcharts.Chart;hotKey:any=false;keyName:any;


 constructor(private httpService:ConnectionService,private toastr: ToastrService,private route: Router) { 
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
    this.getBalance(this.currency);
    this.getMinMax(this.currency);

    this.httpService.postRequest('basic/Specificgame',{name:'fortune'},this.token).subscribe((resData:any)=>{
      if(resData.success==1){
        if(resData.msg.status==0){
          this.route.navigate(['/']);
        }
      }
    })
  }

    ngOnInit(): void  {
      jQuery(window).keypress(function(e) {
        if (e.which == 32) {e.preventDefault();}
      });
      jQuery(".navicon").click(function(){
        jQuery("body").toggleClass("renav");
      });
      jQuery(".rangeslider").click(function(){
         jQuery(".showslider").toggleClass("show");
      });
      jQuery(".rangeslider1").click(function(){
         jQuery(".showslider1").toggleClass("show");
      });
      jQuery(".rangeslider2").click(function(){
         jQuery(".showslider2").toggleClass("show");
      });
      jQuery(".rangeslider3").click(function(){
         jQuery(".showslider3").toggleClass("show");
      });
      jQuery(".rangeslider4").click(function(){
         jQuery(".showslider4").toggleClass("show");
      });
      jQuery(".rangeslider5").click(function(){
         jQuery(".showslider5").toggleClass("show");
      });
      jQuery(".rangeslider6").click(function(){
         jQuery(".showslider6").toggleClass("show");
      });
      jQuery(".rangeslider7").click(function(){
         jQuery(".showslider7").toggleClass("show");
      });

      jQuery('.arrow').on('click', function () {
        jQuery("#wheel").addClass("rotatew");

        setTimeout(function() {
          jQuery("#wheel").removeClass("rotatew");
        }, 4000);
      });

      this.favCount();this.likeCount();this.getfavNlike();
      this.getBalance(this.currency);this.bet_history(this.currency);this.allUser_history();
      let currentIndex = 0;
      this.items = this.seed.map((value) => {
        const colorCount = this.colorCounts[currentIndex];
        const item = {
          fillStyle: colorCount.color,
          id: value,
          textFillStyle: 'white'
        };

        colorCount.count--;

        if (colorCount.count === 0) {
          currentIndex++;
        }

        return item;
      });

      this.getgraph();this.chart = Highcharts.chart('containerX', this.chartOptions2);

      // this.idToLandOn = this.seed[Math.floor(Math.random() * this.seed.length)];
    }

   before() { }
   after() {}


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
     if(event.keyCode==32){
        this.keyName='space';
       this. bettingamount('divide',100,'grey')
        if(this.toggleone!=true){
          this.submitBet()
        }
      }else{
        this.keyName='';
      }
    }
  }

  getgraph() {
    let data = {game:'fortune'};
    this.httpService.postRequest('basic/getgraphed',data, this.token).subscribe((resData:any) => {
      if(resData.success==1){
        if(resData.msg==0){
          this.chart.series[0].setData([0])
        }else{
          const objects=resData.msg;
          // this.xAxis = objects.map(obj => obj.bet_amount);
          // this.yAxis = objects.map(obj => obj.profit);
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

  getExacttime(){
    let data = {game:'fortune'};
    this.httpService.postRequest('basic/getExacttime',data,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.getgraph();
      }
    })
  }

  conPass(data:any){
    this.head = data;
    this.token = localStorage.getItem("gAmE-t0KEN");
    this.bethistory = [];
    if(this.head){this.bet_history(this.currency);}
    this.favCount();this.likeCount();this.getfavNlike();
    this.getBalance(this.currency);this.allUser_history();
  }

  getMinMax(currency:any) {
    this.httpService.postRequest('fortune/getminbetamount',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
          this.min_bet = resData.min_bet; 
          this.max_bet = resData.max_bet; 
          this.bet_amount = (this.min_bet*1).toFixed(6);
        }
    })
  }

  CurrBal(curr:any){
    this.balance = curr.balance;
    this.currency = curr.currency;
    this.cuurStatus(this.currency);
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

   value: number = 0;
   options: Options = { floor: 0, ceil: 100};
   value1: number = 0;
   options1: Options = { floor: 0, ceil: 100};
   value2: number = 0;
   options2: Options = { floor: 0, ceil: 100};
   value3: number = 0;
   options3: Options = { floor: 0, ceil: 100};

   values: number = 0;
   option: Options = { floor: 0, ceil: 100};
   values1: number = 0;
   option1: Options = { floor: 0, ceil: 100};
   values2: number = 0;
   option2: Options = { floor: 0, ceil: 100};
   values3: number = 0;
   option3: Options = { floor: 0, ceil: 100};


  onSliderChange(value: any, type:any,seg:any) {
    if(type == "auto") {
      if(seg==1){
        this.auto_bet_amount1 = ((this.balance * value.value) / 100).toFixed(6);
      }else if(seg==2){
        this.auto_bet_amount2 = ((this.balance * value.value) / 100).toFixed(6);
      }else if(seg==3){
        this.auto_bet_amount3 = ((this.balance * value.value) / 100).toFixed(6);
      }else{
        this.auto_bet_amount4 = ((this.balance * value.value) / 100).toFixed(6);
      }
    } else {
      if(seg==1){
        this.bet_amount1 = ((this.balance * value.value) / 100).toFixed(6);
      }else if(seg==2){
        this.bet_amount2 = ((this.balance * value.value) / 100).toFixed(6);
      }else if(seg==3){
        this.bet_amount3 = ((this.balance * value.value) / 100).toFixed(6);
      }else{
        this.bet_amount4 = ((this.balance * value.value) / 100).toFixed(6);
      }
    }
      this.value3 = value.value;
    //this.value3 = value.value;
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

   //userhistory
    bet_history(currency:any){
      this.httpService.postRequest('fortune/getBetHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
          if(resData.success == 1) {
            var hist = resData.history;
            this.bethistory = hist.slice(0 , 10);
            this.fullHis=hist;
            this.payoutHistory = hist.slice(0, 10);
          } else {
            this.bethistory = [];
          }
      })  
    }

   //full history
    allUser_history(){
      this.httpService.postRequest('fortune/getAllBetHistory',{},this.token).subscribe((resData:any)=> {
        if(resData.success == 1) {
          this.allbet=resData.msg;
          this.allBethistory = resData.msg;  
        } else {
          this.allBethistory = {};
        }
      }) 
    }

    bettingamount(type:any,value:any,color:any) {
      this.bet_amount=parseInt(value, 10).toString();
      var previous:any = (this.bet_amount*1).toFixed(6);

      if(type == "multiply") { this.bet_amount = (this.bet_amount * 2).toFixed(6);}
      else if(type == "divide") { this.bet_amount = (this.bet_amount / 2).toFixed(6);}

      if(this.bet_amount==0){
        this.bet_amount = 0;
      }else  if(this.bet_amount < this.min_bet) { this.bet_amount = (this.min_bet*1).toFixed(6); }

      if(this.bet_amount > this.balance) {
        this.bet_amount = Number(previous*1).toFixed(6);
        this.toastr.error('Insufficient Balance');
      }
      if(this.bet_amount=="NaN"){
         this.bet_amount=(this.min_bet*1).toFixed(6);
      }

      if(color=="grey"){
        this.bet_amount1= (this.bet_amount*1).toFixed(6);
        if(this.bet_amount1>=100){ this.disable=false;}
      }else if(color=="purple"){ 
        this.bet_amount2= (this.bet_amount*1).toFixed(6);
        if(this.bet_amount2>=100){ this.disable=false;}
      }else if(color=="orange"){ 
        this.bet_amount3= (this.bet_amount*1).toFixed(6);
        if(this.bet_amount3>=100){ this.disable=false;}
      }else if(color=="green"){
        this.bet_amount4= (this.bet_amount*1).toFixed(6);
        if(this.bet_amount4>=100){ this.disable=false;}
      }
      this.totalbets=Number(this.bet_amount1)+Number(this.bet_amount2)+Number(this.bet_amount3)+Number(this.bet_amount4);

    }

   auto_bettingamount(type:any,value:any,color:any) {
      this.auto_bet_amount=parseInt(value, 10).toString();
      var previous:any = (this.auto_bet_amount*1).toFixed(6);

      if(type == "multiply") { this.auto_bet_amount = (this.auto_bet_amount * 2).toFixed(6);}
      else if(type == "divide") { this.auto_bet_amount = (this.auto_bet_amount / 2).toFixed(6);}

      if(this.auto_bet_amount < this.min_bet) { this.auto_bet_amount = (this.min_bet*1).toFixed(6);}

      if(this.auto_bet_amount > this.balance) {
         this.auto_bet_amount = Number(previous*1).toFixed(6);
         this.toastr.error('Insufficient Balance');
      }

      if(this.auto_bet_amount=="NaN"){
         this.auto_bet_amount=(this.min_bet*1).toFixed(6);
      }

      if(color=="grey"){
        this.auto_bet_amount1 =(this.auto_bet_amount*1).toFixed(6); 
        if(this.auto_bet_amount1>=100){ this.autodisable=false;}
      }else if(color=="purple"){ 
        this.auto_bet_amount2 =(this.auto_bet_amount*1).toFixed(6); 
        if(this.auto_bet_amount2>=100){ this.autodisable=false;}
      }else if(color=="orange"){ 
         this.auto_bet_amount3 =(this.auto_bet_amount*1).toFixed(6); 
        if(this.auto_bet_amount3>=100){ this.autodisable=false;}
      }else if(color=="green"){
        this.auto_bet_amount4 =(this.auto_bet_amount*1).toFixed(6);
        if(this.auto_bet_amount4>=100){ this.autodisable=false;}
      }
      this.totalbets=Number(this.auto_bet_amount1)+Number(this.auto_bet_amount2)+Number(this.auto_bet_amount3)+Number(this.auto_bet_amount4);
   }
 
    reset(data:any){
      if(data=='auto'){
        this.auto_bet_amount1=(0).toFixed(6);this.auto_bet_amount2=(0).toFixed(6);this.auto_bet_amount3=(0).toFixed(6);
        this.auto_bet_amount4=(0).toFixed(6);this.autodisable=true;
      }else{
        this.bet_amount1=(0).toFixed(6);this.bet_amount2=(0).toFixed(6);this.bet_amount3=(0).toFixed(6);this.bet_amount4=(0).toFixed(6);
        this.disable=true;
      }
      this.totalbets=(0).toFixed(6);
    }

    number_of_bets(number:any) {
      if(number == "infinity") {
        this.numberofbets = 100000000000;
      } else {
        this.numberofbets = number;
      }
    }

   submitBet(){
    if(this.head!=false){
      this.toggleone=true;
      var color:any=[];
      if(this.bet_amount1!=0){color.push({"color":"#cfdff7","amount":this.bet_amount1})
      }else{ color.push({"color":"#cfdff7","amount":0})}

      if(this.bet_amount2!=0){color.push({"color":"#773cfd","amount":this.bet_amount2})
      }else{color.push({"color":"#773cfd","amount":0})}

      if(this.bet_amount3!=0){color.push({"color":"#ff842e","amount":this.bet_amount3})
      } else{color.push({"color":"#ff842e","amount":0})}

      if(this.bet_amount4!=0){color.push({"color":"#7bc514","amount":this.bet_amount4})
      }else{color.push({"color":"#7bc514","amount":0})}

      if(this.totalbets <= this.balance) {
        var data ={bet_amount:parseInt(this.bet_amount, 10).toString(),currency:this.currency};
        this.bettingInitiates(data,color);
      } else {
        this.toastr.error('Insufficient Balance');
      }
    }else{
      this.toastr.error('Please Login')
    }
   }

    async bettingInitiates(data:any,value:any){
      try{
        this.checkedout = true;
        var results: any = await this.httpService.postRequestUpdated('fortune/getGameResult', data, this.token);
        var integerPart = Math.floor(results.result);
        if(results.success==1){
          var _wheel:any = document.querySelector("#wheel");
          var _arrow:any = document.querySelector(".arrow");
          var _arrow1:any = document.querySelector(".arrow1");
          var _jackpotDisp:any = document.querySelector("#jackpot");
          var _jackpot:any = 0;
          var _scoreDisp:any = document.querySelector("#score");
          var _score:any = 0;
          var _deg:any = 7.5;
          var _position:any = _deg%360;
          var _jackpotSound:any;
          // _arrow.addEventListener("click", spin);
          let wheelClicked:any = false;
          this.shouldAddClass=true;
          this.addclass=true;

          spin()
          await this.payoutResult({"clr":_score})
          await this.checkresult(this.pay_out,value)
          async function spin(){
            if (!wheelClicked) {
              //remove click event
              _arrow.removeEventListener("click", spin);
             
              //aniamtion arrow
              _arrow1.classList.add("arrowanimation");

              
             
              //new position wheel
              _deg = _deg + 180 + (15 * integerPart);
             
               //give wheel position
              _wheel.style.transform = "rotate(" + _deg + 360 + "deg)";
             
              //chec position
              var _position = _deg%360;
              if(_position == 7.5){
                _score = "#ff842e";
                _jackpot = _jackpot + 800;
              }
              if(_position == 22.5 ){
                _score = "#cfdff7";
                _jackpot = _jackpot + 700;
              }
              if(_position == 37.5){
                _score = "#773cfd";
                _jackpot = _jackpot + 500;
              }
              if(_position == 46.5){
                _score = "#cfdff7";
                _jackpot = _jackpot + 500;
              }
              if(_position == 52.5){
                _score = "#773cfd";
                _jackpot = _jackpot + 200;
              }
              if(_position == 67.5){
                _score = "#cfdff7";
                _jackpot = _jackpot + 100;
              }
              if(_position == 82.5){
                _score = "#773cfd";
                _jackpot = _jackpot + 200;
              }
              if(_position == 97.5){
                _score = "#ff842e";
                _jackpot = _jackpot + 300;
              }
              if(_position == 112.5){
                _score = "#cfdff7";
                _jackpot = _jackpot + 400;
              }
              if(_position == 127.5){
                _score = "#ff842e";
                _jackpot = _jackpot + 100;
              }
              if(_position == 135.5){
                _score = "#cfdff7";
                _jackpot = _jackpot + 400;
              }
              if(_position == 142.5){
                _score = "#773cfd";
                _jackpot = _jackpot + 600;
              }
              if(_position == 157.5){
                _score = "#cfdff7";
                _jackpot = _jackpot + 700;
              }
              if(_position == 172.5){
                _score = "#773cfd";
                _jackpot = _jackpot + 800;
              }
              if(_position == 180){
                _score = "#cfdff7";
                _jackpot = _jackpot + 800;
              }
              if(_position == 187.5){
                _jackpot = _jackpot + _score;
                 _score = "#773cfd";
              }
              if(_position == 202.5){
                _score = "#cfdff7";
                _jackpot = _jackpot + 800;
              }
              if(_position == 217.5){
                _score = "#773cfd";
                _jackpot = _jackpot + 700;
              }
              if(_position == 226.5){
                _score = "#cfdff7";
                _jackpot = _jackpot + 600;
              }
              if(_position == 232.5){
                _score = "#ff842e";
                _jackpot = _jackpot + 600;
              }
              if(_position == 247.5){
                _score ="#cfdff7";
                _jackpot = _jackpot + 500;
              }
              if(_position == 262.5){
                _score = "#ff842e";
                _jackpot = _jackpot + 400;
              }
              if(_position == 272.5){
                _score = "#cfdff7";
                _jackpot = _jackpot + 300;
              }
              if(_position == 277.5){
                _score = "#773cfd";
                _jackpot = _jackpot + 300;
              }
              if(_position == 292.5){
                _score = "#cfdff7";
                _jackpot = _jackpot + 200;
              }
              if(_position == 307.5){
                _score = "#773cfd";
                _jackpot = _jackpot + 100;
              }
              if(_position == 317.5){
                _score = "#cfdff7";
                _jackpot = _jackpot + 100;
              }
              if(_position == 322.5){
                _jackpot = _jackpot + _score;
                 _score = "#773cfd";
              }
              if(_position == 337.5){
                _score = "#cfdff7";
                _jackpot = 0;    
              }
              if(_position == 352.5){
                _jackpot = _jackpot + _score;
                 _score = "#ff842e";
              }
              if(_position == 359.5){
                _jackpot = _jackpot + _score;
                _score = "#7bc514";
              }
             
             //after spin
              setTimeout(function() {
                //make clickebel again
                _arrow.addEventListener("click", spin);
                //remove arrow animation
                _arrow.classList.remove("arrowanimation");
                //update score and jackpot
                // _scoreDisp.innerHTML = "Score = $" + _score;
                // _jackpotDisp.innerHTML = "Jackpot = $" + _jackpot;
                wheelClicked = true;
              }, 2000);
            }
          }
          var datas = {bet_amount:value,currency:this.currency,clientSeed:results.clientSeed,serverSeed:results.serverSeed,nonce:results.nonce,result:integerPart,pay_out:this.pay_out.val,game_result:this.payResult};
          var resData1:any =await this.httpService.postRequestUpdated('fortune/saveBetHistory',datas,this.token);
          this.balance=resData1.balance;
          this.payOuts=resData1.payOut;
          this.returnAmt=resData1.resAmt;
          var hist = resData1.history;
          setTimeout(() => {
            this.toggleone=false;
            this.checkedout=false;
            this.shouldAddClass=false;
            this.addclass=false;
            this.shoeRes=true;
            this.bethistory =  hist.slice(0 , 10);
            this.payoutHistory =  hist.slice(0 , 10); 
            this.allUser_history();
            this.getgraph();
            if(resData1.status=="loser"){this.toastr.error('Loss the game')
            }else{ this.toastr.success('Won the Game')}
          },3800)
        }else{
          this.toastr.error(results.msg,'')
        }
        this.shoeRes=false;
      }catch(error){
        console.error('An error occurred:', error);
      }
    }

    async sleep(ms: number): Promise<void> {
      return new Promise<void>((resolve) => setTimeout(resolve, ms));
    }

   //autobet
    async sumbit_auto_bet(){
      try{
        if(this.head!=false){
          this.disabledHead=true;
          var win_balance  = this.balance * 10000;
          var loss_balance:any = 0;
          this.auto_bet = false;
          this.stop_init = 1;
          var color:any=[];
          if(this.auto_bet_amount1!=0){
            color.push({"color":"#cfdff7","amount":this.auto_bet_amount1})
          }else{color.push({"color":"#cfdff7","amount":0})}

          if(this.auto_bet_amount2!=0){
            color.push({"color":"#773cfd","amount":this.auto_bet_amount1})
          }else{color.push({"color":"#773cfd","amount":0}) }

          if(this.auto_bet_amount3!=0){
            color.push({"color":"#ff842e","amount":this.auto_bet_amount1})
          } else{ color.push({"color":"#ff842e","amount":0})}

          if(this.auto_bet_amount4!=0){
            color.push({"color":"#7bc514","amount":this.auto_bet_amount1})
          }else{ color.push({"color":"#7bc514","amount":0}) }

          this.auto_bet_amount=Number(this.auto_bet_amount1)+Number(this.auto_bet_amount2)+Number(this.auto_bet_amount3)+Number(this.auto_bet_amount4);
          if(this.numberofbets == 0) {
            this.numberofbets = 1000000000;
          }
          if(this.stop_on_win > 0) {
            win_balance = parseFloat(this.balance) + parseFloat(this.stop_on_win);
          } 
          if(this.stop_on_loss > 0 && (this.balance >= this.stop_on_loss)) {
            loss_balance = this.balance - this.stop_on_loss
          }
          if (!this.isSpinning && this.auto_bet!=true) {
            this.isSpinning = true;
            for (var j = 0; j <= this.numberofbets; j++) { 
              // console.log(this.auto_bet_amount)
              // console.log(this.balance)
              // console.log(this.totalbets)
              if(this.totalbets <= this.balance) {
                var data ={bet_amount:parseInt(this.auto_bet_amount, 10).toString(),currency:this.currency};
                if(this.balance >= win_balance || this.balance <= parseFloat(loss_balance) || j == this.numberofbets || this.stop_init == 0) {
                  this.auto_bet = true;
                  this.disabledHead=false;
                  break;
                }else{
                  this.bettingInitiates(data,color);
                  this.getBalance(this.currency);
                }
              }else {
                this.toastr.error('Insufficient Balance');
              }
              await this.sleep(5000);
            }
            this.isSpinning = false;
            this.allUser_history();
            this.getgraph();
          }
        }else{
          this.toastr.error('Please Login')
        }
      }catch(e){
        console.log(e)
      }
    }


    //stop bet
    async stop_auto_bet() {
      this.stop_init = 0;
      this.auto_bet = true;
    }

    checkresult(payout:any,value:any){
      var res:any;
      for(var get of value){
        if(get.color==payout.clr){
          res=get.amount*payout.val;
          this.payResult={"color":payout.clr,"amount":get.amount*payout.val}
        }else{
          this.payResult={"color":payout.clr,"amount":payout.val}
        }
      }
    }

    payoutResult(result:any){
      this.getColor=result.clr 
      const obj = this.wheelResult.find(item => item.clr === this.getColor);
      if (obj) { var data=obj; this.pay_out=data;}
    }

    //toogle all user
    toggleShowMore() {
      this.showMores = !this.showMores;
      if (this.showMores) {
        this.allBethistory = this.allbet;
      } else {
        this.allBethistory = this.allbet.slice(0, 10);
      }
    }

    //user
    toggleShowMoreHis() {
      this.showMoreHis = !this.showMoreHis;
      if (this.showMoreHis) {
        this.bethistory = this.fullHis;
      } else {
        this.bethistory = this.bethistory.slice(0, 10);
      }
    }

    //details
    getDetails(id:any){
      var obj={'_id':id,game:'fortune'};
      this.httpService.postRequest('fortune/getDetails',obj,this.token).subscribe((resData:any) => {
        if(resData.success==1){
          this.Det_id=resData.msg.bet_id;
          this.Det_name=resData.msg.username;
          this.Det_created_at=resData.msg.created_at;
          this.Det_betamount=resData.msg.bet_amount;
          this.Det_payout=resData.msg.payout.toFixed(2);
          this.Det_pro_amt=resData.msg.pro_amt;
          this.Det_result=resData.msg.result;
          this.Det_serverSeed=resData.msg.serverSeed;
          this.Det_clientSeed=resData.msg.clientSeed;
          this.Det_nounce=resData.msg.nounce;
          this.Det_status=resData.msg.status;
          this.Det_initialbet=resData.msg.initial_bet;
          this.Det_gameResult=resData.msg.game_result;
          this.Det_seedstatus=resData.msg.seedstatus;
          this.withouthashserver=resData.msg.server;
          this.withouthashclient=resData.msg.client;
        }else{
          this.toastr.error(resData.msg,'');
        }
      })
    }

    //seed
    Seedsetting(){
      this.httpService.postRequest('fortune/getHash',{},this.token).subscribe((resData:any) => {
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
      this.httpService.postRequest('fortune/generateHash',obj,this.token).subscribe((resData:any) => {
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
      this.httpService.postRequest('fortune/changeHash',obj,this.token).subscribe((resData:any) => {
        if(resData.success==1){
          this.toastr.success(resData.msg,'');
          jQuery("#exampleCenter").modal("hide"); 
        }else{
          this.toastr.error(resData.msg,'');
          jQuery("#exampleCenter").modal("hide"); 
        }
      })
    }

    copyInputMessage(data:any){
      navigator.clipboard.writeText(data)
      .then(() => this.toastr.info('Text copied to clipboard'))
    }

    async confirmedData(){
      await this.sleep(600);
      jQuery('#body').addClass('modal-open');
      jQuery('#body').attr('style','padding-right: 15px');
    }

    //user favourite
    userFav(name:any){
     var obj={'name':name};
      this.httpService.postRequest('fortune/userFav',obj,this.token).subscribe((resData:any) => {
        var fav= localStorage.getItem("gAmE-fav") ?? "";
        let myArray:any = fav.split(',');
        if(resData.success==1 && resData.game!=""){
          if (!fav.includes(resData.game)) {
            myArray.push(resData.game);
            let updatedString = myArray.join(',');
            localStorage.setItem('gAmE-fav', updatedString);
          }
        }else{
          let index = myArray.indexOf('fortune');
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
      this.httpService.postRequest('fortune/userLiked',obj,this.token).subscribe((resData:any) => {
        var like= localStorage.getItem("gAmE-like") ?? "";
        let myArray:any = like.split(',');
        if(resData.success==1 && resData.game!=""){
          if (!like.includes(resData.game)) {
            myArray.push(resData.game);
            let updatedString = myArray.join(',');
            localStorage.setItem('gAmE-like', updatedString);
          }
        }else{
          let index = myArray.indexOf('fortune');
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
      var obj={'name':'fortune'}
      this.httpService.postRequest('basic/getFavCount',obj,this.token).subscribe((resData:any) => {
        if(resData.success==1){
          this.fav_count=resData.msg
        }
      })
    }

    // like count
    likeCount(){
      var obj={'name':'fortune'}
      this.httpService.postRequest('basic/getLikeCount',obj,this.token).subscribe((resData:any) => {
        if(resData.success==1){
          this.like_count=resData.msg
        }
      })
    }

    getfavNlike(){
      var game ="fortune";
      const favt = localStorage.getItem("gAmE-fav")?? "";
      const liked = localStorage.getItem("gAmE-like")?? "";

      if (favt.includes(game)) {this.fav_clr=1;}else{this.fav_clr=0;}
      if (liked.includes(game)) { this.like_clr=1;}else{this.like_clr=0;}
    }

  ngOnDestroy(): void {
    var conval = <HTMLCanvasElement> document.getElementById('containerX');
    if(conval !== undefined){
      document.getElementById("containerX").setAttribute("id", "newcontainer");
    }
    this.chart.destroy();
  }

}
