import { Component, OnInit, Input, NgModule, ViewChild, ElementRef, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
import { NgxWheelComponent, TextAlignment, TextOrientation } from 'ngx-wheel';
import { animate, animation, AnimationMetadata, AnimationMetadataType, AnimationOptions, AUTO_STYLE, group, keyframes, query, sequence, state, style, transition, trigger, useAnimation, ɵStyleDataMap } from '@angular/animations';

import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import * as Highcharts from 'highcharts';

declare var jQuery: any;

@Component({
  selector: 'app-newspin',
  templateUrl: './newspin.component.html',
  styleUrls: ['./newspin.component.css'],
  animations: [
    trigger('flipState', [
      state('reset',style({transform: 'rotate(466.8deg)',})),
      state('1',style({transform: 'rotate(466.8deg)',})),state('2',style({transform: 'rotate(542deg)',})),
      state('3',style({transform: 'rotate(437deg)',})),state('5',style({transform: 'rotate(482deg)',})),
      state('20',style({transform: 'rotate(496.5deg)',})),state('30',style({transform: 'rotate(557deg)',})),
      state('50',style({transform: 'rotate(527deg)',})),state('100',style({transform: 'rotate(572deg)',})),
      transition('*=> reset',animate('3000ms')),
      transition('*=>*',animate('3000ms'))
    ]),
  ]
})
export class NewspinComponent implements OnInit {
  balance:any = 0; currency:any = 'JB'; head:any=true; betAct:any=false;
  min_bet = 100; max_bet = 10000000; bet_amount:any = (100).toFixed(6); 
  token = localStorage.getItem("gAmE-t0KEN");
  counter1: number = 1; spin:any;BallStyle:any;
  images = [
    'assets/images/sword_game/img-1.png',
    'assets/images/sword_game/img-2.png',
    'assets/images/sword_game/img-3.png',
    'assets/images/sword_game/img-4.png',
    'assets/images/sword_game/img-5.png',
    'assets/images/sword_game/img-6.png',
    'assets/images/sword_game/img-7.png',
    'assets/images/sword_game/img-8.png',
    'assets/images/sword_game/img-9.png',
    'assets/images/sword_game/img-10.png',
    'assets/images/sword_game/img-11.png',
    'assets/images/sword_game/img-12.png',
    'assets/images/sword_game/img-13.png',
    'assets/images/sword_game/img-14.png',
    'assets/images/sword_game/img-15.png',
    'assets/images/sword_game/img-16.png',
    'assets/images/sword_game/sword-1.png',
    'assets/images/sword_game/sword-2.png',
    'assets/images/sword_game/sword-3.png',
  ];
  imagesPayout = ['15.0','10.0','8.00','7.00','5.00','2.00','1.00','0.50','0.50','0.30','0.30']
  sideimages = [
    'assets/images/sword_game/img-1.png',
    'assets/images/sword_game/img-2.png',
    'assets/images/sword_game/img-3.png',
    'assets/images/sword_game/img-4.png',
    'assets/images/sword_game/img-5.png',
    'assets/images/sword_game/img-6.png',
    'assets/images/sword_game/img-7.png',
    'assets/images/sword_game/img-8.png',
    'assets/images/sword_game/img-9.png',
    'assets/images/sword_game/img-10.png',
    'assets/images/sword_game/img-11.png',
    'assets/images/sword_game/img-12.png',
    'assets/images/sword_game/img-13.png',
    'assets/images/sword_game/img-14.png',
    'assets/images/sword_game/img-15.png',
  ];
  catspin = [
    'assets/images/sword_game/img-1.png',
    'assets/images/sword_game/img-2.png',
    'assets/images/sword_game/img-3.png',
    'assets/images/sword_game/img-4.png',
    'assets/images/sword_game/img-5.png',
    'assets/images/sword_game/img-6.png',
    'assets/images/sword_game/img-7.png',
    'assets/images/sword_game/img-8.png',
    'assets/images/sword_game/img-9.png',
    'assets/images/sword_game/img-10.png',
    'assets/images/sword_game/img-11.png',
    'assets/images/sword_game/sword-1.png',
    'assets/images/sword_game/sword-2.png',
    'assets/images/sword_game/sword-3.png',
  ];
  payoutperval:any={first:"", second: "", third: "", fourth: "", fivth:""};
  resultImage1 = this.sideimages[2];
  resultImage2 = this.sideimages[3];
  resultImage3 = this.sideimages[4];
  resultImage4 = this.sideimages[5];
  resultImage5 = this.sideimages[6];
  TopImage1 = this.sideimages[1];
  TopImage2 = this.images[2];
  TopImage3 = this.images[3];
  TopImage4 = this.images[4];
  TopImage5 = this.sideimages[5];
  ButtomImage1 = this.sideimages[3];
  ButtomImage2 = this.images[4];
  ButtomImage3 = this.images[5];
  ButtomImage4 = this.images[6];
  ButtomImage5 = this.sideimages[7];

  isSpinning = false;userId:any="";
  value: number = 0; options: Options = { floor: 0, ceil: 200};
  value2: number = 100; options2: Options = { floor: 0,ceil: 200};
  Credits:any = "WIN CRYPOT BONUS OR BONUS RESPIN"
  //history
  bethistory:any=[];fullHis:any=[];payoutHistory:any=[];showMoreHis:boolean=false;allbet:any;
  allBethistory:any=[];showMores: boolean = false; winAmt:any=0;

  //seed
  serverSeed:any;clientSeed:any;nounce:any;newserverSeed:any;newclientSeed:any;seedset:any=true;

  //like & fav
  like_count:any;fav_count:any;fav_clr:any;like_clr:any;win_amount:any=(0).toFixed(2);

  holdTimeout: any;auto:any=false;


  //auto process
  auto_chance_win_percent = 50.0;
  auto_payout = 1.98;
  auto_pay_out = 1.98;

  auto_bet_amount = (100).toFixed(6);
  numberofbets:any = 0;
  stop_init:any = 1;
  auto_bet:any = true;


  //det
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;Det_risk:any;
  Det_segment:any;Det_initialbet:any;Det_gameResult:any;

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

    chart: Highcharts.Chart;

    hotKey:any=false;keyName:any='';

  constructor(private httpService: ConnectionService, private route: Router, private toastr: ToastrService, private actRoute: ActivatedRoute, private renderer: Renderer2, private elementRef: ElementRef) { 
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
    this.httpService.postRequest('basic/Specificgame',{name:'sword'},this.token).subscribe((resData:any)=>{
      if(resData.success==1){
        if(resData.msg.status==0){
          this.route.navigate(['/']);
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
    // this.winBoxMsg();
    jQuery(".rangeslider").click(function(){
      jQuery(".showslider").toggleClass("show");
    });
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this.allUser_history();this.bet_history(this.currency);this.getBalance(this.currency);
    this.getMinMax(this.currency);
    this.favCount();this.likeCount();this.bet_history(this.currency);
    this.getgraph();this.chart = Highcharts.chart('containerX', this.chartOptions2);
  }

  getgraph() {
    let data = {game:'sword'};
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

  getExacttime(){
    let data = {game:'sword'};
    this.httpService.postRequest('basic/getExacttime',data,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.getgraph();
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
    this.head = data;
    this.token = localStorage.getItem("gAmE-t0KEN");
    this.allUser_history();this.bet_history(this.currency);this.getBalance(this.currency);
    this.getMinMax(this.currency);
    this.favCount();this.likeCount();this.bet_history(this.currency);
  }

  CurrBal(curr:any){
    this.balance = curr.balance;
    this.currency = curr.currency;
    this.getMinMax(curr.currency);
  }

  getMinMax(currency:any) {
    this.httpService.postRequest('sword/getminbetamount',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
            this.min_bet = resData.min_bet; 
            this.max_bet = resData.max_bet; 
            this.bet_amount = (this.min_bet).toFixed(6);
        }
    })
  }

  bettingamount(type:any):void {
      var previous:any = (this.bet_amount*1).toFixed(6);
      if(type == "multiply") {
        this.bet_amount = (this.bet_amount * 2).toFixed(6);
      } else if(type == "divide") {
        this.bet_amount = (this.bet_amount / 2).toFixed(6);
      }else if(type == 'max'){
        this.bet_amount=(this.max_bet).toFixed(6);
      }else if(type == 'min'){
        this.bet_amount=(this.min_bet).toFixed(6);
      }
      if(this.bet_amount < this.min_bet) {
        this.bet_amount = (this.min_bet*1).toFixed(6);
      }

      if(this.bet_amount > this.max_bet) {
        this.bet_amount = (this.max_bet*1).toFixed(6);
      }

      if(this.bet_amount > this.balance) {
          this.bet_amount = Number(previous).toFixed(6);
          this.toastr.error('Insufficient Balance');
      }
  }

  onButtonHold() {
    this.holdTimeout = setTimeout(() => {
      this.auto=true;
      this.auto_bets();
    }, 1000); // Adjust the hold duration as needed
    this.auto=false;
  }

  onButtonClick() {
    if (this.holdTimeout && this.auto==false) {
      clearTimeout(this.holdTimeout);
      // Function for clicking the button after holding
      if(this.bet_amount <= this.balance) {
        this.submitBet();
      } else {
        this.toastr.error('Insufficient Balance');
        return;
      }
    }
  }


  /*async auto_bets(){
    this.stop_init = 1;
    this.auto_bet = false;
    if(this.numberofbets == 0) {
      this.numberofbets = 100;
    }
    for(var i = 0; i <= this.numberofbets; i++) {
      if(this.auto_bet_amount <= this.balance) {
        var data = {bet_amount:this.auto_bet_amount, currency:this.currency};
        if(i == this.numberofbets || this.stop_init == 0) {
            this.auto_bet = true;
            return;
        }else{
          await this.sleep(1000);
          // this.submitBet();
        }
      } else {
        this.toastr.error('Insufficient Balance');
        return;
      }
    }
  }*/

  async auto_bets(){
    this.auto_bet = false;
    if(this.auto_bet_amount <= this.balance) {
      await this.sleep(1000);
      this.submitBet();
    } else {
      this.toastr.error('Insufficient Balance');
      return;
    }
  }


  stop_auto_bet() {
    this.stop_init = 0;
    this.auto_bet = true;
  }

  async submitBet(){
    this.betAct= true;
    var auth = this.httpService.loggedIn();
    if(auth == true){
      this.win_amount = (0).toFixed(2);
      this.Credits = "WIN CRYPOT BONUS OR BONUS RESPIN";
      this.payoutperval.first = "";
      this.payoutperval.second = "";
      this.payoutperval.third = "";
      this.payoutperval.fourth = "";
      this.payoutperval.fivth = "";
      jQuery('.winsword').removeClass('sword');
      jQuery('.idcls').removeClass('loss');jQuery('.idcls').removeClass('win');
      jQuery(".cavebox").addClass('running');
      jQuery(".slot").addClass('slotrunning');
      const interval = setInterval(() => {
        //top value
        var randomTop1 = Math.floor(Math.random() * this.sideimages.length);
        var randomTop2 = Math.floor(Math.random() * this.images.length);
        var randomTop3 = Math.floor(Math.random() * this.images.length);
        var randomTop4 = Math.floor(Math.random() * this.images.length);
        var randomTop5 = Math.floor(Math.random() * this.sideimages.length);
        //end value
        var randomBottom1 = Math.floor(Math.random() * this.sideimages.length);
        var randomBottom2 = Math.floor(Math.random() * this.images.length);
        var randomBottom3 = Math.floor(Math.random() * this.images.length);
        var randomBottom4 = Math.floor(Math.random() * this.images.length);
        var randomBottom5 = Math.floor(Math.random() * this.sideimages.length);
        if(randomTop2 == 17 || randomTop2 == 18){randomTop2 = 16;}
        if(randomTop3 == 16 || randomTop3 == 18){randomTop3 = 17;}
        if(randomTop4 == 16 || randomTop4 == 17){randomTop4 = 18;}
        if(randomBottom2 == 17 || randomBottom2 == 18){randomBottom2 = 16;}
        if(randomBottom3 == 16 || randomBottom3 == 18){randomBottom3 = 17;}
        if(randomBottom4 == 16 || randomBottom4 == 17){randomBottom4 = 18;}
        this.TopImage1 = this.sideimages[randomTop1];
        this.TopImage2 = this.images[randomTop2];
        this.TopImage3 = this.images[randomTop3];
        this.TopImage4 = this.images[randomTop4];
        this.TopImage5 = this.sideimages[randomTop5];
        this.ButtomImage1 = this.sideimages[randomBottom1];
        this.ButtomImage2 = this.images[randomBottom2];
        this.ButtomImage3 = this.images[randomBottom3];
        this.ButtomImage4 = this.images[randomBottom4];
        this.ButtomImage5 = this.sideimages[randomBottom5];

        //ans Values:-
        var randomIndex1 = Math.floor(Math.random() * this.sideimages.length);
        var randomIndex2 = Math.floor(Math.random() * this.images.length);
        var randomIndex3 = Math.floor(Math.random() * this.images.length);
        var randomIndex4 = Math.floor(Math.random() * this.images.length);
        var randomIndex5 = Math.floor(Math.random() * this.sideimages.length);
        if(randomIndex2 == 17 || randomIndex2 == 18){randomIndex2 = 16;}
        if(randomIndex3 == 16 || randomIndex3 == 18){randomIndex3 = 17;}
        if(randomIndex4 == 16 || randomIndex4 == 17){randomIndex4 = 18;}
        this.resultImage1 = this.sideimages[randomIndex1];
        this.resultImage2 = this.images[randomIndex2];
        this.resultImage3 = this.images[randomIndex3];
        this.resultImage4 = this.images[randomIndex4];
        this.resultImage5 = this.sideimages[randomIndex5];
      }, 100);
      await this.sleep(2000);
      clearInterval(interval);
      jQuery(".cavebox").removeClass('running');
      jQuery(".slot").removeClass('slotrunning');

      //fixed set spin :-
      var Top1 = Math.floor(Math.random() * this.sideimages.length);
      var Top2 = Math.floor(Math.random() * this.images.length);
      var Top3 = Math.floor(Math.random() * this.images.length);
      var Top4 = Math.floor(Math.random() * this.images.length);
      var Top5 = Math.floor(Math.random() * this.sideimages.length);
      var Buttom1 = Math.floor(Math.random() * this.sideimages.length);
      var Buttom2 = Math.floor(Math.random() * this.images.length);
      var Buttom3 = Math.floor(Math.random() * this.images.length);
      var Buttom4 = Math.floor(Math.random() * this.images.length);
      var Buttom5 = Math.floor(Math.random() * this.sideimages.length);
      if(Top2 == 17 || Top2 == 18){Top2 = 16};
      if(Top3 == 16 || Top3 == 18){Top3 = 17};
      if(Top4 == 16 || Top4 == 17){Top4 = 18};
      if(Buttom2 == 17 || Buttom2 == 18){Buttom2 = 16}
      if(Buttom3 == 16 || Buttom3 == 18){Buttom3 = 17}
      if(Buttom4 == 16 || Buttom4 == 17){Buttom4 = 18}
      this.TopImage1 = this.sideimages[Top1];
      this.TopImage2 = this.images[Top2];
      this.TopImage3 = this.images[Top3];
      this.TopImage4 = this.images[Top4];
      this.TopImage5 = this.sideimages[Top5];
      this.ButtomImage1 = this.sideimages[Buttom1];
      this.ButtomImage2 = this.images[Buttom2];
      this.ButtomImage3 = this.images[Buttom3];
      this.ButtomImage4 = this.images[Buttom4];
      this.ButtomImage5 = this.sideimages[Buttom5];

       //called fro ans
      var data = {bet_amount:this.bet_amount, currency:this.currency,round:this.counter1};
      var Notvalues = [11, 12, 13, 14];
      this.httpService.postRequest('sword/getGameResult',data, this.token).subscribe(async(resData:any) => {
        var totalWin = parseFloat(resData.amt)*parseFloat(resData.payOut);
        if(resData.success==1){
          if(resData.userId !== ""){ this.userId = resData.userId;}
          var gameres = resData.result.swordResult;
          if(gameres[1] == 17 || gameres[1] == 18){gameres[1] = 16;}
          if(gameres[2] == 16 || gameres[2] == 18){gameres[2] = 17;}
          if(gameres[3] == 16 || gameres[3] == 17){gameres[3] = 18;}
          if(gameres[1] == 16){jQuery('#wincol2').addClass('sword');};if(gameres[2] == 17){jQuery('#wincol3').addClass('sword');};if(gameres[3] == 18){jQuery('#wincol4').addClass('sword');};
          this.resultImage1 = this.images[gameres[0]];
          this.resultImage2 = this.images[gameres[1]];
          this.resultImage3 = this.images[gameres[2]];
          this.resultImage4 = this.images[gameres[3]];
          this.resultImage5 = this.images[gameres[4]];
          if(this.imagesPayout[gameres[0]] !== undefined ){
            this.payoutperval.first = this.imagesPayout[gameres[0]]
          }else{this.payoutperval.first = ""};
          if(this.imagesPayout[gameres[1]] !== undefined ){
            this.payoutperval.second = this.imagesPayout[gameres[1]]
          }else{this.payoutperval.second = ""};
          if(this.imagesPayout[gameres[2]] !== undefined ){
            this.payoutperval.third = this.imagesPayout[gameres[2]]
          }else{this.payoutperval.third = ""};
          if(this.imagesPayout[gameres[3]] !== undefined ){
            this.payoutperval.fourth = this.imagesPayout[gameres[3]]
          }else{this.payoutperval.fourth = ""};
          if(this.imagesPayout[gameres[4]] !== undefined ){
            this.payoutperval.fivth = this.imagesPayout[gameres[4]]
          }else{this.payoutperval.fivth = ""};

          if(gameres[0] == 11 || gameres[0] == 12 || gameres[0] == 13 || gameres[0] == 14){
            jQuery('#wincol1').addClass('loss');
          }else{ jQuery('#wincol1').addClass('win');}
          if(gameres[1] == 11 || gameres[1] == 12 || gameres[1] == 13 || gameres[1] == 14){
            jQuery('#wincol2').addClass('loss');
          }else{jQuery('#wincol2').addClass('win');}
          if(gameres[2] == 11 || gameres[2] == 12 || gameres[2] == 13 || gameres[2] == 14){
            jQuery('#wincol3').addClass('loss');
          }else{jQuery('#wincol3').addClass('win');}
          if(gameres[3] == 11 || gameres[3] == 12 || gameres[3] == 13 || gameres[3] == 14){
            jQuery('#wincol4').addClass('loss');
          }else{jQuery('#wincol4').addClass('win');}
          if(gameres[4] == 11 || gameres[4] == 12 || gameres[4] == 13 || gameres[4] == 14){
            jQuery('#wincol5').addClass('loss');
          }else{jQuery('#wincol5').addClass('win');}
          await this.sleep(500);
          var catspinval = resData.result.catspin;
          if(catspinval[0] !== null){this.catspinbet(2, catspinval[0]); jQuery('#catspin1').addClass('catroll');}
          if(catspinval[1] !== null){this.catspinbet(3, catspinval[1]); jQuery('#catspin2').addClass('catroll');}
          if(catspinval[2] !== null){this.catspinbet(4, catspinval[2]); jQuery('#catspin3').addClass('catroll');}
          //sword spin
          if(resData.result.sword!=""){
            if(catspinval[0] !== null || catspinval[1] !== null || catspinval[2] !== null){
              this.Credits = "CAT respin";
              await this.sleep(2200);
            }
            this.Credits = "GUARANTYEES 5 BONUS SYMBOLS AND MULTIPLIER";
            jQuery('.slotwhlwrapper').addClass('wheelspin');
            // jQuery('.slotamt').addClass('wheelspin');
            jQuery(".circlespin").addClass('wheelrotate');
            await this.sleep(2000);
            // this.BallStyle = {'animation': 'circlespin 1s linear infinite'};
            await this.sleep(3000);
            jQuery(".circlespin").removeClass('wheelrotate');
            this.spin = resData.result.sword;
            jQuery(".circlespin").addClass('rotatestop');
            await this.sleep(3000);
            jQuery('.slotwhlwrapper').removeClass('wheelspin');
            // jQuery('.slotamt').removeClass('wheelspin');
            var bonus=[1,2,3,5]
            var searchValue = resData.result.sword;
            var isValuePresent = bonus.includes(searchValue);
            if(isValuePresent){
              await this.sleep(5000);
              var positions=null;
              this.payoutperval.first = "";
              this.payoutperval.second = "";
              this.payoutperval.third = "";
              this.payoutperval.fourth = "";
              this.payoutperval.fivth = "";
              jQuery('.idcls').removeClass('loss');jQuery('.idcls').removeClass('win');
              this.makeHttpPostRequest(this.counter1,positions);
            }else{
              await this.sleep(2000);
              jQuery(".circlespin").removeClass('rotatestop');
              await this.sleep(2000);
              if(parseFloat(resData.payOut) >= 10){
                this.winAmt = resData.profit 
                this.winBoxMsg();
                await this.sleep(3000);
                // console.log("open popup");
              }
              if(totalWin !==0){
                this.Credits = "TOTAL WIN "+totalWin.toFixed(2);
                this.win_amount = (totalWin*1).toFixed(2);
              }
              this.BallStyle = {};
              if(this.auto_bet == false){this.auto_bets()};
              this.betAct= false;
              this.allUser_history();this.bet_history(this.currency);this.getBalance(this.currency);
              this.getgraph();
              if(resData.status=='winner'){
                this.toastr.success('Won the Game');
              }else if(resData.status=='loser'){
                this.toastr.error('Loose the Game');
              }
            }
          }else{
            if(catspinval[0] !== null || catspinval[1] !== null || catspinval[2] !== null){
              this.Credits = "CAT respin";
              await this.sleep(2200);
            }
            if(parseFloat(resData.payOut) >= 10){
                this.winAmt = resData.profit 
              this.winBoxMsg();
              await this.sleep(3000);
              // console.log("open popup");
            }
            if(totalWin !==0){
              this.Credits = "TOTAL WIN "+totalWin.toFixed(2);
              this.win_amount = totalWin.toFixed(2);
            }
            if(this.auto_bet == false){this.auto_bets()};
            this.betAct= false;
            this.allUser_history();this.bet_history(this.currency);this.getBalance(this.currency);
            this.getgraph();
            if(resData.status=='winner'){
              this.toastr.success('Won the Game');
            }else if(resData.status=='loser'){
              this.toastr.error('Loose the Game');
            }
          }
        }
      })
    }else{
      this.head=false;
      this.betAct= false;
      this.toastr.error('please login to continue !');
    }
  }

  async makeHttpPostRequest(counter:any,positions:any) {
    var obj={"round":counter,positions:positions, userpendId: this.userId};
    this.httpService.postRequest('sword/bonusSpin',obj,this.token).subscribe( async(resData:any)=>{
      if(resData.success == 1){
        jQuery('.winsword').removeClass('sword');
        this.respincall(resData.msg[0], 1);
        this.respincall(resData.msg[1], 2);
        this.respincall(resData.msg[2], 3);
        this.respincall(resData.msg[3], 4);
        this.respincall(resData.msg[4], 5);
        await this.sleep(2100);
        if(resData.msg[0] !== null ){
          this.payoutperval.first = this.imagesPayout[resData.msg[0]];
          if(resData.msg[0] !== 11 && resData.msg[0] !== 12 && resData.msg[0] !== 13 && resData.msg[0] !== 14){
            jQuery('#wincol1').addClass('win')
          }
        }
        if(resData.msg[1] !== null ){
          this.payoutperval.second = this.imagesPayout[resData.msg[1]];
          if(resData.msg[1] !== 11 && resData.msg[1] !== 12 && resData.msg[1] !== 13 && resData.msg[1] !== 14){
            jQuery('#wincol2').addClass('win');
          }
        }
        if(resData.msg[2] !== null ){
          this.payoutperval.third = this.imagesPayout[resData.msg[2]];
          if(resData.msg[2] !== 11 && resData.msg[2] !== 12 && resData.msg[2] !== 13 && resData.msg[2] !== 14){
            jQuery('#wincol3').addClass('win');
          }
        }
        if(resData.msg[3] !== null ){
          this.payoutperval.fourth = this.imagesPayout[resData.msg[3]];
          if(resData.msg[3] !== 11 && resData.msg[3] !== 12 && resData.msg[3] !== 13 && resData.msg[3] !== 14){
            jQuery('#wincol4').addClass('win');
          }
        }
        if(resData.msg[4] !== null ){
          this.payoutperval.fivth = this.imagesPayout[resData.msg[4]];
          if(resData.msg[4] !== 11 && resData.msg[4] !== 12 && resData.msg[4] !== 13 && resData.msg[4] !== 14){
            jQuery('#wincol5').addClass('win');
          }
        }
        const positions = resData.msg.reduce((acc: number[], value: number, index: number) => {
          var Notvalues = [11, 12, 13, 14];
          if (Notvalues.includes(value)) {
            acc.push(index);
          }
          return acc;
        }, []);
        if (positions.length > 0) {
          this.counter1++;
          await this.sleep(1000);
          this.makeHttpPostRequest(this.counter1,positions);
        }else{
          if(parseFloat(resData.payOut) >= 10){
              this.winAmt = resData.profit 
              this.winBoxMsg();
              await this.sleep(3000);
              // console.log("open popup")
            }
          var totalWin = parseFloat(resData.amt)*parseFloat(resData.payOut);
          if(totalWin !==0){
            this.Credits = "TOTAL WIN "+totalWin.toFixed(2);
            this.win_amount = totalWin.toFixed(2);
          }
          if(this.auto_bet == false){this.auto_bets()};
          jQuery(".circlespin").removeClass('rotatestop');
          this.betAct= false;
          this.allUser_history();this.bet_history(this.currency);this.getBalance(this.currency);
          // this.spin = 'reset';
        }
      }else{
        this.toastr.error('Somthing wents wrong !');
      }
    });
  }

  async catspinbet(num:any, val:any){
    const interval = setInterval(() => {
      var spinran = Math.floor(Math.random() * this.catspin.length);
      var spinran1 = Math.floor(Math.random() * this.catspin.length);
      var spinran2 = Math.floor(Math.random() * this.catspin.length);
      if((num == 2) && (spinran == 12 || spinran == 13)){spinran=11};
      if((num == 3) && (spinran == 11 || spinran == 13)){spinran=12};
      if((num == 4) && (spinran == 11 || spinran == 12)){spinran=13};
      if((num == 2) && (spinran1 == 12 || spinran1 == 13)){spinran1=11};
      if((num == 3) && (spinran1 == 11 || spinran1 == 13)){spinran1=12};
      if((num == 4) && (spinran1 == 11 || spinran1 == 12)){spinran1=13};
      if((num == 2) && (spinran2 == 12 || spinran2 == 13)){spinran2=11};
      if((num == 3) && (spinran2 == 11 || spinran2 == 13)){spinran2=12};
      if((num == 4) && (spinran2 == 11 || spinran2 == 12)){spinran2=13};
      this['resultImage'+num] = this.catspin[spinran];
      this['TopImage'+num] = this.catspin[spinran1];
      this['ButtomImage'+num] = this.catspin[spinran2];
    }, 100);

    await this.sleep(2000);
    clearInterval(interval);
    jQuery('#catspin1').removeClass('slotrunning');
    jQuery('#catspin2').removeClass('slotrunning');
    jQuery('#catspin3').removeClass('slotrunning');
    var ramspinval1 = Math.floor(Math.random() * this.catspin.length);
    var ramspinval2 = Math.floor(Math.random() * this.catspin.length);
    if((num == 2) && (ramspinval1 == 12 || ramspinval1 == 13)){ramspinval1=11};
    if((num == 3) && (ramspinval1 == 11 || ramspinval1 == 13)){ramspinval1=12};
    if((num == 4) && (ramspinval1 == 11 || ramspinval1 == 12)){ramspinval1=13};
    if((num == 2) && (ramspinval2 == 12 || ramspinval2 == 13)){ramspinval2=11};
    if((num == 3) && (ramspinval2 == 11 || ramspinval2 == 13)){ramspinval2=12};
    if((num == 4) && (ramspinval2 == 11 || ramspinval2 == 12)){ramspinval2=13};
    this['TopImage'+num] = this.catspin[ramspinval1];
    this['ButtomImage'+num] = this.catspin[ramspinval2];
    if(val == null){
      var ramspinval = Math.floor(Math.random() * this.catspin.length);
    }else{
      var ramspinval = parseFloat(val);
    }
    if((num == 2) && (ramspinval == 12 || ramspinval == 13)){ramspinval=11};
    if((num == 3) && (ramspinval == 11 || ramspinval == 13)){ramspinval=12};
    if((num == 4) && (ramspinval == 11 || ramspinval == 12)){ramspinval=13};
    if(num == 2){
      if(this.imagesPayout[ramspinval] !== undefined ){
        this.payoutperval.second = this.imagesPayout[ramspinval]
      }else{this.payoutperval.second = ""};
    }
    if(num == 3){
      if(this.imagesPayout[ramspinval] !== undefined ){
        this.payoutperval.third = this.imagesPayout[ramspinval]
      }else{this.payoutperval.third = ""};
    }
    if(num == 4){
      if(this.imagesPayout[ramspinval] !== undefined ){
        this.payoutperval.fourth = this.imagesPayout[ramspinval]
      }else{this.payoutperval.fourth = ""};
    }
    // if(this.resultImage2 == this.images[11] && this.resultImage3 == this.images[12] && this.resultImage4 == this.images[13]){}
    if(ramspinval == 11){jQuery('#wincol2').addClass('sword');};if(ramspinval == 12){jQuery('#wincol3').addClass('sword');};if(ramspinval == 13){jQuery('#wincol4').addClass('sword');};
    this['resultImage'+num] = this.catspin[ramspinval];
    jQuery('#catspin1').removeClass('catroll');
    jQuery('#catspin2').removeClass('catroll');
    jQuery('#catspin3').removeClass('catroll');
  }

  async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  //full history
  allUser_history(){
    this.httpService.postRequest('sword/getAllBetHistory',{},this.token).subscribe((resData:any)=> {
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
      this.allBethistory = this.allbet.slice(0, 10);
    }
  }

  toggleShowMoreHis() {
    this.showMoreHis = !this.showMoreHis;
    if (this.showMoreHis) {
      this.bethistory = this.fullHis;
    } else {
      this.bethistory = this.bethistory.slice(0, 10);
    }
  }

  //userhistory
  bet_history(currency:any){
    this.httpService.postRequest('sword/getBetHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
          var hist = resData.history;
          this.bethistory = hist;
          this.fullHis=hist;
          this.payoutHistory = hist.slice(0, 9);
        } else {
          this.bethistory = [];
        }
    })  
  }

  getDetails(id:any){
    var obj={'_id':id,game:'sword'};
    this.httpService.postRequest('sword/getDetails',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.Det_id=resData.msg.bet_id;
        this.Det_name=resData.msg.username;
        this.Det_created_at=resData.msg.created_at;
        this.Det_betamount=resData.msg.bet_amount;
        this.Det_payout=resData.msg.payout.toFixed(2);
        this.Det_pro_amt=resData.msg.pro_amt;
        this.Det_serverSeed=resData.msg.serverSeed;
        this.Det_clientSeed=resData.msg.clientSeed;
        this.Det_nounce=resData.msg.nounce;
        this.Det_status=resData.msg.status;
        this.Det_initialbet=resData.msg.initial_bet;
        this.Det_gameResult=resData.msg.game_result;
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }


  async respincall(spinres:any, at:any){
    if(spinres !== null){
      var interval = setInterval(() => {
        var bouspin = Math.floor(Math.random() * this.sideimages.length);
        var bouspinTop = Math.floor(Math.random() * this.sideimages.length);
        var bouspinButt = Math.floor(Math.random() * this.sideimages.length);
        this['resultImage'+at] = this.sideimages[bouspin];
        this['TopImage'+at] = this.sideimages[bouspinTop];
        this['ButtomImage'+at] = this.sideimages[bouspinButt];
      }, 100);
      await this.sleep(2000);
      clearInterval(interval);
      var bouspinsetTop = Math.floor(Math.random() * this.sideimages.length);
      var bouspinsetButt = Math.floor(Math.random() * this.sideimages.length);
      this['TopImage'+at] = this.sideimages[bouspinsetTop];
      this['ButtomImage'+at] = this.sideimages[bouspinsetButt];
      var bouspinset = parseFloat(spinres);
      this['resultImage'+at] = this.sideimages[bouspinset];
    }
  }

  //seed
  Seedsetting(){
    this.httpService.postRequest('sword/getHash',{},this.token).subscribe((resData:any) => {
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
    this.httpService.postRequest('sword/generateHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.newclientSeed=resData.msg
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }

  //update hash
  updateHash(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0}
    this.httpService.postRequest('sword/changeHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.toastr.success(resData.msg,'');
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }

  //user favourite
  userFav(name:any){
   var obj={'name':name};
    this.httpService.postRequest('sword/userFav',obj,this.token).subscribe((resData:any) => {
      var fav= localStorage.getItem("gAmE-fav") ?? "";
      let myArray:any = fav.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!fav.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-fav', updatedString);
        }
      }else{
        let index = myArray.indexOf('sword');
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
    this.httpService.postRequest('sword/userLiked',obj,this.token).subscribe((resData:any) => {
      var like= localStorage.getItem("gAmE-like") ?? "";
      let myArray:any = like.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!like.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-like', updatedString);
        }
      }else{
        let index = myArray.indexOf('sword');
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
    var obj={'name':'sword'}
    this.httpService.postRequest('basic/getFavCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.fav_count=resData.msg
      }
    })
  }

  // like count
  likeCount(){
    var obj={'name':'sword'}
    this.httpService.postRequest('basic/getLikeCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.like_count=resData.msg
      }
    })
  }

  getfavNlike(){
    var game ="sword";
    const favt = localStorage.getItem("gAmE-fav")?? "";
    const liked = localStorage.getItem("gAmE-like")?? "";

    if (favt.includes(game)) {this.fav_clr=1;}else{this.fav_clr=0;}
    if (liked.includes(game)) { this.like_clr=1;}else{this.like_clr=0;}
  }

  async confirmedData(){
    await this.sleep(600);
    jQuery('#body').addClass('modal-open');
    jQuery('#body').attr('style','padding-right: 15px');
  }

  copyInputMessage(data:any){
    navigator.clipboard.writeText(data)
    .then(() => this.toastr.info('Text copied to clipboard'))
  }

  winBoxMsg(){
    jQuery("#win_box").modal('show');
    setTimeout(()=>{
      jQuery("#win_box").modal('hide');
    }, 3000);
  }
}