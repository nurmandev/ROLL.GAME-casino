import { Component, OnInit, HostListener } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
import { Observable, interval, Subscription } from 'rxjs';
import { animate, animation, AnimationMetadata, AnimationMetadataType, AnimationOptions, AUTO_STYLE, group, keyframes, query, sequence, state, style, transition, trigger, useAnimation, ɵStyleDataMap } from '@angular/animations';
declare var jQuery: any;

import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.component.html',
  styleUrls: ['./roulette.component.css'],
  animations: [
    trigger('flipState', [
      state('reset',style({transform: 'rotate(362deg)',})),
      state('0',style({transform: 'rotate(-362deg)',})),state('1',style({transform: 'rotate(-498.22deg)',})),
      state('2',style({transform: 'rotate(-663.63deg)',})),state('3',style({transform: 'rotate(-381.46deg)',})),
      state('4',style({transform: 'rotate(-683.09deg)',})),state('5',style({transform: 'rotate(-537.14deg)',})),
      state('6',style({transform: 'rotate(-624.71deg)',})),state('7',style({transform: 'rotate(-420.38deg)',})),
      state('8',style({transform: 'rotate(-566.33deg)',})),state('9',style({transform: 'rotate(-459.3deg)',})),
      state('10',style({transform: 'rotate(-546.87deg)',})),state('11',style({transform: 'rotate(-585.79deg)',})),
      state('12',style({transform: 'rotate(-400.92deg)',})),state('13',style({transform: 'rotate(-605.25deg)',})),
      state('14',style({transform: 'rotate(-478.76deg)',})),state('15',style({transform: 'rotate(-702.55deg)',})),
      state('16',style({transform: 'rotate(-517.6800000000001deg)',})),state('17',style({transform: 'rotate(-644.1700000000001deg)',})),
      state('18',style({transform: 'rotate(-439.84000000000003deg)',})),state('19',style({transform: 'rotate(-692.8199999999999deg)',})),
      state('20',style({transform: 'rotate(-488.49deg)',})),state('21',style({transform: 'rotate(-673.36deg)',})),
      state('22',style({transform: 'rotate(-449.57deg)',})),state('23',style({transform: 'rotate(-556.6deg)',})),
      state('24',style({transform: 'rotate(-527.41deg)',})),state('25',style({transform: 'rotate(-653.9000000000001deg)',})),
      state('26',style({transform: 'rotate(-371.73deg)',})),state('27',style({transform: 'rotate(-614.98deg)',})),
      state('28',style({transform: 'rotate(-410.65deg)',})),state('29',style({transform: 'rotate(-430.11deg)',})),
      state('30',style({transform: 'rotate(-576.06deg)',})), state('31',style({transform: 'rotate(-469.03deg)',})),
      state('32',style({transform: 'rotate(-712.28deg)',})),state('33',style({transform: 'rotate(-507.95000000000005deg)',})),
      state('34',style({transform: 'rotate(-634.44deg)',})),state('35',style({transform: 'rotate(-391.19deg)',})),
      state('36',style({transform: 'rotate(-595.52deg)',})),
      transition('*=> reset',animate('100ms')),
      transition('*=>*',animate('3500ms'))
    ]),
  ]
})

export class RouletteComponent implements OnInit {
  flip: string = 'front'; spin:any;token = localStorage.getItem("gAmE-t0KEN");
  value: number = 100; winpop:any=false;
  options: Options = {floor: 0,ceil: 200};options2: Options = {floor: 0,ceil: 200};
  value2: number = 100; betValarr:any=[]; bet_amount:any=0;
  head:any=true; balance:any = 0; currency:any = "JB"; min_bet = 100; max_bet=2000;
  payOut:any=0;returnAmt:any=0; bethistory:any= []; payoutHistory:any=[]
  wheelnumbersAC = [0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];
  evenNum:any=[2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
  oddNum:any=[1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
  redNum:any=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
  balckNum:any=[2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
   wheelStyle:any = {}; BallStyle:any={};
   auto_bet_amount:any=0; numberofbets:any = 0; stop_on_win:any = 0.00000000; stop_on_loss:any = 0.00000000;
  auto_bet:any = true; stop_init:any = 1; coinOne:any=100; coinTwo:any=1000;coin:any=100; cointhree:any=10; coinfour:any=1;

  //seed
  serverSeed:any;clientSeed:any;nounce:any;newserverSeed:any;newclientSeed:any;seedset:any=true;
  //
  fullHis:any=[];allbet:any=[];allBethistory:any=[];showMores: boolean = false;
  showMoreHis:any=false;
  //fav and like
  fav_clr:any;like_clr:any;fav_count:any;like_count:any;
  //det
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;Det_risk:any;
  Det_segment:any;Det_initialbet:any;Det_gameResult:any;Det_seedstatus:any;withouthashserver:any;withouthashclient:any;

  //betcoins
  betcoins:any={}; resultcoins:any={}; betKeyVal:any=true;
  //activebet
  betactive:any=false;autobetactive:any=false; activebet:any=false;
  autoactive:any = false; winnerpop:any= false; tiedpop:any=false;gameTab:any=false;
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

  chart: Highcharts.Chart; hotKey:any=false;keyName:any;

  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute) {
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
    this.httpService.postRequest('basic/Specificgame',{name:'roulette'},this.token).subscribe((resData:any)=>{
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
    this.coin = this.coinOne;
    this.getBalance(this.currency);
    jQuery(".rangeslider").click(function(){
      jQuery(".showslider").toggleClass("show");
    });
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this.allUser_history();this.bet_history(this.currency);
    this.getfavNlike();this.favCount();this.likeCount();this.getgraph();
    this.chart = Highcharts.chart('container', this.chartOptions2)
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
        this.submitBet()
      }else if(event.keyCode==87){
        this.keyName='w';
        this.clearData();
      }else{
        this.keyName='';
      }
    }
  }


  getfavNlike(){
    var game ="roulette";
    const favt = localStorage.getItem("gAmE-fav")?? "";
    const liked = localStorage.getItem("gAmE-like")?? "";

    if (favt.includes(game)) {this.fav_clr=1;}else{this.fav_clr=0;}
    if (liked.includes(game)) { this.like_clr=1;}else{this.like_clr=0;}
  }

  getMinMax(currency:any) {
    this.httpService.postRequest('roulette/getminbetamount',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
            this.min_bet = resData.min_bet;
            this.max_bet = resData.max_bet;
            // this.bet_amount = this.min_bet;
        }
    })
  }

  favCount(){
    var obj={'name':'roulette'}
    this.httpService.postRequest('basic/getFavCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.fav_count=resData.msg
      }
    })
  }
  likeCount(){
    var obj={'name':'roulette'}
    this.httpService.postRequest('basic/getLikeCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.like_count=resData.msg
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
    this.payoutHistory=[];
    this.coin = this.coinOne;
    this.getBalance(this.currency);
    this.allUser_history();this.bet_history(this.currency);
    this.getfavNlike();this.favCount();this.likeCount();this.getgraph();
    this.chart = Highcharts.chart('container', this.chartOptions2)
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
          this.alert.error('Please Choose Another Curency','')
          this.gameTab=true;
        }else{
          this.gameTab=false;
        }
      }
    })
  }

  submitBet(){
    this.activebet=true;
    this.betactive=false;
    this.betKeyVal =false;
    if(parseFloat(this.bet_amount) !== 0){
      if(parseFloat(this.bet_amount) >= this.min_bet){
        var obj = {amount:this.bet_amount, betvalue:this.betValarr, currency:this.currency};
        this.bettingInitiate(obj);
      }else{
        this.activebet=false;
        this.alert.error('please Enter minimum of '+this.min_bet+' amount !');
      }
    }else{
      this.activebet=false;
      this.alert.error('please select bet first');
    }
    this.betKeyVal =true;
  }

  async bettingInitiate(data:any){
    var auth = this.httpService.loggedIn();
    if(auth == true){
      this.winnerpop= false; this.tiedpop=false;
      this.spin = 'reset';
      jQuery('#container').addClass('addbet');
      var results:any = await this.httpService.postRequestUpdated('roulette/getGameResult', data, this.token);
      if(results.success == 1) {
        this.spinWheel(results.result);
        setTimeout(()=>{
          if(results.status=="loser"){this.alert.error('Loss the game')
            }else{ this.alert.success('Won the Game')}
          jQuery('.coinchip').removeClass('winActiveClass');
          this.balance = results.balance;
          this.payOut = results.payOut;
          this.activebet=false;
          this.betactive=true;
          this.allUser_history();this.bet_history(this.currency);this.getgraph();

          jQuery('#Nub'+results.result).addClass('winActiveClass');
          this.returnAmt = parseFloat(results.payOut)*parseFloat(results.bet_amount);
          if(results.status == "winner"){
            this.winnerpop=true;
            jQuery('#container').removeClass('addbet');
          }else if(results.status == "tied"){
            this.tiedpop=true;
            jQuery('#container').removeClass('addbet');
          }else{
            jQuery('#container').removeClass('addbet');
          }
        }, 10000);
      }else{
        this.alert.error(results.msg);
        this.activebet=false;
        this.betactive=true;
        this.autoactive =false;
        jQuery('#container').removeClass('addbet');
        return;
      }
    }else{
      this.head=false;
      jQuery('#container').removeClass('addbet');
      this.alert.error('please login to continue !');
    }
  }

  bettingamount(type:any) {
    var previous = this.bet_amount;
    /*if(type == 'min'){
      this.bet_amount = this.min_bet;
    }else if(type == 'max'){
      this.bet_amount = this.max_bet;
    }*/
    if(type == "multiply") {
      this.bet_amount = (parseFloat(this.bet_amount)*2).toFixed(6);
    } else if(type == "divide") {
      this.bet_amount = (parseFloat(this.bet_amount) / 2).toFixed(6);
    }
    if(this.bet_amount < this.min_bet) {
      this.bet_amount = this.min_bet;
    }else if(this.bet_amount > this.max_bet){
      this.bet_amount = this.max_bet;
    }

    if(this.bet_amount < this.balance){
      var len = this.betValarr.length;
      var betlen:any = parseFloat(this.bet_amount)/parseFloat(len);
      betlen = Math.trunc(betlen);
      let amtcal:any = 0;
      var objtoarr = Object.entries(this.betcoins);
      for (let i = 0; i < len; i++) {
        var idNamechip = objtoarr[i][0];
        amtcal += parseFloat(betlen);
        if((i+1)==len){
          var diff = parseFloat(this.bet_amount)-parseFloat(amtcal);
          betlen+=diff;
          this.betValarr[i].amt = betlen;
          this.betcoins[idNamechip] = betlen;
          amtcal+=diff
        }else{
          this.betValarr[i].amt = betlen;
          this.betcoins[idNamechip] = betlen;
        }
      }
    }
    if(this.bet_amount > this.balance) {
      this.bet_amount = previous;
      this.alert.error('Insufficient Balance');
    }
    this.auto_bet_amount = this.bet_amount;
  }

  number_of_bets(number:any) {
    if(number == "infinity") {
      this.numberofbets = 100000000000;
    } else {
      this.numberofbets = number;
    }
  }

  async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async sumbit_auto_bet(){
    this.autobetactive=false;this.autoactive=true;
    this.betKeyVal =false;this.stop_init = 1;
    if(parseFloat(this.bet_amount) !== 0){
      var win_balance:any  = this.balance * 10000;
      var loss_balance:any = 0;
      this.auto_bet = false;
      if(this.numberofbets == 0) {
        this.numberofbets = 1000000000;
      }
      if(this.stop_on_win > 0) {
        win_balance = parseFloat(this.balance) + parseFloat(this.stop_on_win);
      }
      if(this.stop_on_loss > 0 && (this.balance >= this.stop_on_loss)) {
        loss_balance = this.balance - this.stop_on_loss;
      }
      for(var i = 0; i <= this.numberofbets; i++) {
        if(this.auto_bet_amount <= this.balance) {
          var data = {amount:this.bet_amount, betvalue:this.betValarr, currency:this.currency};
          if(this.balance >= win_balance || this.balance <= parseFloat(loss_balance) || i == this.numberofbets || this.stop_init == 0) {
            this.auto_bet     = true;
            this.autobetactive=true;
            this.autoactive = false;
            this.betKeyVal =true;
            return;
          }else{
            this.bettingInitiate(data);
            this.getBalance(this.currency);this.getgraph();
          }
        } else {
          this.alert.error('Insufficient Balance');
          return;
        }
        await this.sleep(12000);
      }
    }else{
      this.alert.error('please select bet first');
    }
  }

  stop_auto_bet() {
    this.stop_init = 0;
    this.auto_bet = true;
  }

  spinWheel(winningSpin){
    for(let i = 0; i < this.wheelnumbersAC.length; i++){
      if(this.wheelnumbersAC[i] == winningSpin){
        var degree = (i * 9.73) + 362;
      }
    }
    this.wheelStyle = {'animation': 'wheelRotate 5s linear infinite'};
    this.BallStyle = {'animation': 'ballRotate 2s linear infinite'};
    setTimeout(()=>{
      this.BallStyle = {'animation': 'ballRotate 2s linear infinite'};
    }, 2000);
    /*setTimeout(()=>{
      this.spin = winningSpin;
      this.BallStyle = {'animation': 'ballStop 3s linear'};
    }, 6000);*/
    setTimeout(()=>{
      this.BallStyle = {'transform': 'rotate(-'+degree+'deg)'};
    }, 10000);
    setTimeout(()=>{
      this.wheelStyle = {};
    }, 10000);
  }
  betclick(bet:any, type:any){
    if(this.betKeyVal == true){
      this.winnerpop= false; this.tiedpop=false;
      this.bet_amount +=parseFloat(this.coin);
      if(this.bet_amount <= this.balance) {
        if(this.bet_amount <= 2000){
          if( this.bet_amount <= 2000){
            this.auto_bet_amount = this.bet_amount;
            if(type=='half'){var obj = this.betValarr.find(o => o.bet == 'half'+bet);}
            else if(type=='row'){var obj = this.betValarr.find(o => o.bet == 'row'+bet);}
            else if(type=='segment'){var obj = this.betValarr.find(o => o.bet == 'seg'+bet);}
            else {var obj = this.betValarr.find(o => o.bet == bet);}
            if(obj == undefined){
              this.betactive=true;this.autobetactive=true;
              if(type=='half'){
                this.betValarr.push({bet:'half'+bet, amt:parseFloat(this.coin)});
                this.betcoins['half'+bet] = parseFloat(this.coin);
                jQuery('#Nubhalf'+bet).addClass('chipselect');
              }else if(type=='single'){
                this.betValarr.push({bet:bet, amt:parseFloat(this.coin)});
                this.betcoins['num'+bet] = parseFloat(this.coin);
                jQuery('#Nub'+bet).addClass('chipselect');
              }else if(type=='row'){
                this.betValarr.push({bet:'row'+bet, amt:parseFloat(this.coin)});
                this.betcoins['row'+bet] = parseFloat(this.coin);
                jQuery('#Nubrow'+bet).addClass('chipselect');
              }else if(type=='segment'){
                this.betValarr.push({bet:'seg'+bet, amt:parseFloat(this.coin)});
                this.betcoins['seg'+bet] = parseFloat(this.coin);
                jQuery('#Nubseg'+bet).addClass('chipselect');
              }else if(type=='type'){
                jQuery('#Nub'+bet).addClass('chipselect');
                if(bet == 'even'){
                  this.betValarr.push({bet:bet, amt:parseFloat(this.coin)});
                  this.betcoins['even'] = parseFloat(this.coin);
                }else if(bet == 'red'){
                  this.betValarr.push({bet:bet, amt:parseFloat(this.coin)});
                  this.betcoins['red'] = parseFloat(this.coin);
                }else if(bet == 'black'){
                  this.betValarr.push({bet:bet, amt:parseFloat(this.coin)});
                  this.betcoins['black'] = parseFloat(this.coin);
                }else if(bet == 'odd'){
                  this.betValarr.push({bet:bet, amt:parseFloat(this.coin)});
                  this.betcoins['odd'] = parseFloat(this.coin);
                }
              }
            }else{
              obj.amt = parseFloat(obj.amt)+parseFloat(this.coin);
              if(type=='half'){this.betcoins['half'+bet] = parseFloat(obj.amt);
              }else if(type=='single'){this.betcoins['num'+bet] = parseFloat(obj.amt);
              }else if(type=='row'){this.betcoins['row'+bet] = parseFloat(obj.amt);
              }else if(type=='segment'){this.betcoins['seg'+bet] = parseFloat(obj.amt);
              }else if(type=='type'){
                if(bet == 'even'){this.betcoins['even'] = parseFloat(obj.amt);
                }else if(bet == 'red'){this.betcoins['red'] = parseFloat(obj.amt);
                }else if(bet == 'black'){this.betcoins['black'] = parseFloat(obj.amt);
                }else if(bet == 'odd'){this.betcoins['odd'] = parseFloat(obj.amt);
                }
              }
            }
          }else{
            this.bet_amount -=parseFloat(this.coin);
            this.alert.error("maximum reached");
          }
        }else{
          this.bet_amount -=parseFloat(this.coin);
          this.alert.error("maximum reached");
        }
      }else {
        this.bet_amount -=parseFloat(this.coin);
        this.alert.error('Insufficient Balance');
        return;
      }
    }
  }

  clearData(){
    this.auto_bet_amount = 0;
    this.bet_amount = 0;
    this.betValarr = [];
    this.betcoins ={};
    this.betactive=false;
    this.autobetactive=false;
    this.activebet=false;
    this.autoactive=false;
    this.winnerpop= false; this.tiedpop=false;
    jQuery('.coinchip').removeClass('chipselect'); 
  }

  coinswitch(coin:any){
    if(coin == 100){
      jQuery('.chipselect').removeClass('cdChipActive');
      jQuery('.cointok1').addClass('cdChipActive');
      this.coin = this.coinOne;
    }else if(coin == 1000){
      jQuery('.chipselect').removeClass('cdChipActive');
      jQuery('.cointok2').addClass('cdChipActive');
      this.coin = this.coinTwo;
    }else if(coin == 1){
      jQuery('.chipselect').removeClass('cdChipActive');
      jQuery('.cointok3').addClass('cdChipActive');
      this.coin = this.coinfour;
    }else if(coin == 10){
      jQuery('.chipselect').removeClass('cdChipActive');
      jQuery('.cointok4').addClass('cdChipActive');
      this.coin = this.cointhree;
    }
  }

  userFav(name:any){
   var obj={'name':name};
    this.httpService.postRequest('roulette/userFav',obj,this.token).subscribe((resData:any) => {
      var fav= localStorage.getItem("gAmE-fav") ?? "";
      let myArray:any = fav.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!fav.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-fav', updatedString);
        }
      }else{
        let index = myArray.indexOf('roulette');
        if (index !== -1) {
          myArray.splice(index, 1);
        }
        localStorage.setItem("gAmE-fav", myArray.join(','));
      }
      this.favCount();this.getfavNlike();
    })
  }

  userLike(name:any){
   var obj={'name':name};
    this.httpService.postRequest('roulette/userLiked',obj,this.token).subscribe((resData:any) => {
      var like= localStorage.getItem("gAmE-like") ?? "";
      let myArray:any = like.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!like.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-like', updatedString);
        }
      }else{
        let index = myArray.indexOf('roulette');
        if (index !== -1) {
          myArray.splice(index, 1);
        }
        localStorage.setItem("gAmE-like", myArray.join(','));
      }
        this.likeCount();this.getfavNlike();
    })
  }
  //seed
  Seedsetting(){
    this.httpService.postRequest('roulette/getHash',{},this.token).subscribe((resData:any) => {
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

  //generate seed
    generateSeed(){
      var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0}
      this.httpService.postRequest('roulette/generateHash',obj,this.token).subscribe((resData:any) => {
        if(resData.success==1){
          this.newclientSeed=resData.msg
        }else{
          this.alert.error(resData.msg,'');
        }
      })
    }

    //update hash
    updateHash(){
      var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0,oldserverSeed:this.serverSeed}
      this.httpService.postRequest('roulette/changeHash',obj,this.token).subscribe((resData:any) => {
        if(resData.success==1){
          this.alert.success(resData.msg,'');
        }else{
          this.alert.error(resData.msg,'');
        }
      })
    }

    //userhistory
    bet_history(currency:any){
      this.httpService.postRequest('roulette/getBetHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
          if(resData.success == 1) {
            var hist = resData.history;
            this.bethistory = hist;
            this.fullHis=hist;
            this.payoutHistory = hist.slice(0, 17);
          } else {
            this.bethistory = [];
          }
      })  
    }

   //full history
    allUser_history(){
      this.httpService.postRequest('roulette/getAllBetHistory',{},this.token).subscribe((resData:any)=> {
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
        this.allBethistory = this.allbet.slice(0, 17);
      }
    }

    //user
    toggleShowMoreHis() {
      this.showMoreHis = !this.showMoreHis;
      if (this.showMoreHis) {
        this.bethistory = this.fullHis;
      } else {
        this.bethistory = this.bethistory.slice(0, 17);
      }
    }

    //details
    getDetails(id:any){
      jQuery('.resultcoin').removeClass('chipresultselect');
      jQuery('.resultcoin').removeClass('resultActiveClass');
      var obj={'_id':id,game:'roulette'};
      this.httpService.postRequest('roulette/getDetails',obj,this.token).subscribe((resData:any) => {
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
          var betnotmat = resData.msg.userbet;
          this.Det_seedstatus=resData.msg.seedstatus;
          this.withouthashserver=resData.msg.server;
          this.withouthashclient=resData.msg.client;
          jQuery('#res'+resData.msg.bet_result).addClass('resultActiveClass');
          for (let i = 0; i < betnotmat.length; i++) {
            var key = betnotmat[i].bet;
            var value = betnotmat[i].amt;

            jQuery('#res'+key).addClass('chipresultselect');
            if(typeof(key) == 'number'){
              key = 'num'+key;
              this.resultcoins[key]=value;
            }else{
              this.resultcoins[key]=value;
            }
          }
        }else{
          this.alert.error(resData.msg,'');
        }
      })
    }
    copyInputMessage(data:any){
      navigator.clipboard.writeText(data)
      .then(() => this.alert.info('Text copied to clipboard'))
    }

  async confirmedData(){
    await this.sleep(600);
    jQuery('#body').addClass('modal-open');
    jQuery('#body').attr('style','padding-right: 15px');
  }

  getgraph() {
    let data = {game:'roulette'};
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
    let data = {game:'roulette'};
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