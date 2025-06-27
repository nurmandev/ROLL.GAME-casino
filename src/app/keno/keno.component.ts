import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
import { Observable, interval, Subscription } from 'rxjs';
declare var jQuery: any;

import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-keno',
  templateUrl: './keno.component.html',
  styleUrls: ['./keno.component.css']
})
export class KenoComponent implements OnInit {
  token = localStorage.getItem("gAmE-t0KEN");
  value: number = 0;options: Options = {floor: 0,ceil: 100};
  value2: number = 0;options2: Options = {floor: 0,ceil: 100};
  kenoNum:any = []; showpayout:any; showwinAmt:any; showpaypercent:any;
  risks:any="classic"; head:any=true; balance:any = 0;bethistory:any=[];payoutHistory:any=[];
  fav_clr:any;like_clr:any;allbet:any=[];allBethistory:any=[]; fav_count:any;like_count:any; payOut:any=0;
  rick:any=[]; rickType:any=[];rick0:any=[];rickType0:any=[];
  bet_amount:any = (100).toFixed(6); currency:any = 'JB'; min_bet = 100;  max_bet = 10000000; checkedout:any=false; returnAmt:any=0;
  winning_result:any=1.00;className:any = 'largef';
  auto_bet_amount:any=(100).toFixed(6); numberofbets:any = 0; stop_on_win:any = 0.00000000; stop_on_loss:any = 0.00000000;
  auto_bet:any = true; stop_init:any = 1; reslen:any;
  showMoreHis:boolean=false;showMores:any=false;fullHis:any=[]; gennum:any=[];
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;
  Det_seedstatus:any;withouthashserver:any;withouthashclient:any;
  serverSeed:any;clientSeed:any;nounce:any;newserverSeed:any;newclientSeed:any; activebet:any= false;
  actdisable:any=false; autoactdisable:any=false; seedset:any=true; userData:any={};gameTab:any=false;
  kenobetsdig:any = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
  rick1:any=[{hits: 0, percent: 75},{hits: 1, percent: 25}]
  rick2:any=[{hits: 0, percent: 55.76923},{hits: 1, percent: 38.46154},{hits: 2, percent: 5.769231}]
  rick3:any=[{hits: 0, percent: 41.093117},{hits: 1, percent: 44.02834},{hits: 2, percent: 13.663967},
    {hits: 3, percent: 1.2145749}]
  rick4:any=[{hits: 0, percent: 29.98687},{hits: 1, percent: 44.42499},{hits: 2, percent: 21.419193},
    {hits: 3, percent: 3.9391618},{hits: 4, percent: 0.22978444}]
  rick5:any=[{hits: 0, percent: 21.657185},{hits: 1, percent: 41.64843},{hits: 2, percent: 27.76562},
    {hits: 3, percent: 7.933034},{hits: 4, percent: 0.9574352},{hits: 5, percent: 0.03829741}]
  rick6:any=[{hits: 0, percent: 15.469417},{hits: 1, percent: 37.126602},{hits: 2, percent: 32.12879},
    {hits: 3, percent: 12.692855},{hits: 4, percent: 2.3799102},{hits: 5, percent: 0.1969581},
    {hits: 6, percent: 0.00547106}]
  rick7:any=[{hits: 0, percent: 10.919588},{hits: 1, percent: 31.8488},{hits: 2, percent: 34.3967},
    {hits: 3, percent: 17.639334},{hits: 4, percent: 4.5731606},{hits: 5, percent: 0.5879778},
    {hits: 6, percent: 0.03379183},{hits: 7, percent: 0.00064365}]
  rick8:any=[{hits: 0, percent: 7.610622},{hits: 1, percent: 26.471727},{hits: 2, percent: 34.744144},
    {hits: 3, percent: 22.236254},{hits: 4, percent: 7.483354},{hits: 5, percent: 1.3303741},
    {hits: 6, percent: 0.1187834},{hits: 7, percent: 0.00468112},{hits: 8, percent: 0.00005851}]
  rick9:any=[{hits: 0, percent: 5.2323027},{hits: 1, percent: 21.404875},{hits: 2, percent: 33.50328},
    {hits: 3, percent: 26.058107},{hits: 4, percent: 10.944406},{hits: 5, percent: 2.5256321},
    {hits: 6, percent: 0.31180644},{hits: 7, percent: 0.01909019},{hits: 8, percent: 0.00049371}, 
    {hits: 9, percent: 0.00000366}]
  rick10:any=[{hits: 0, percent: 3.5444632},{hits: 1, percent: 16.878397},{hits: 2, percent: 31.07159},
    {hits: 3, percent: 28.820028},{hits: 4, percent: 14.710222},{hits: 5, percent: 4.236544},
    {hits: 6, percent: 0.6789334},{hits: 7, percent: 0.05747584},{hits: 8, percent: 0.0023093}, 
    {hits: 9, percent: 0.00003539},{hits: 10, percent: 1.2e-9}]
  rickType1:any={ low:[ 0.7,1.85],classic:[0,3.96],medium:[0.4,2.75],high:[0,3.96]};
  rickType2:any={ low:[ 0,2,3.8],classic:[0,1.9,4.5],medium:[0,1.8,5.1],high:[0,0,17.10]};
  rickType3:any={ low:[ 0,1.1,1.38,26],classic:[0,1,3.1,10.4],medium:[0,0,2.8,50],high:[0,0,0,81.5]};
  rickType4:any={ low:[ 0,0,2.2,7.9,90],classic:[0,0.8,1.8,5,22.5],medium:[0,0,1.7,10,100],high:[0,0,0,10,259]};
  rickType5:any={ low:[ 0,0,1.5,4.2,13,300],classic:[0,0.25,1.4,4.1,16.5,36],medium:[0,0,1.4,4,14,390],high:[0,0,0,4.5,48,450]};
  rickType6:any={ low:[ 0,0,1.1,2,6.2,100,700],classic:[0,0,1,3.68,7,16.5,40],medium:[0,0,0,3,9,180,710],
    high:[0,0,0,0,11,350,710]};
  rickType7:any={ low:[ 0,0,1.1,1.6,3.5,15,225,700],classic:[0,0,0.47,3,4.5,14,31,60],
    medium:[0,0,0,2,7,30,400,800],high:[0,0,0,0,7,90,400,800]
  }
  rickType8:any={ low:[ 0,0,1.1,1.5,2,5.5,39,100,800],classic:[0,0,0,2.2,4,13,22,55,70],
    medium:[0,0,0,2,4,11,67,40,900],high:[0,0,0,0,5,20,270,600,900]
  }
  rickType9:any={ low:[ 0,0,1.1,1.3,1.7,2.5,7.5,50,250,1000],classic:[0,0,0,1.55,3,8,15,44,60,85],
    medium:[0,0,0,2,2.5,5,15,100,500,1000],high:[0,0,0,0,4,11,56,500,800,1000]
  }
  rickType10:any={ low:[ 0,0,1.1,1.2,1.3,1.8,3.5,13,50,250,1000],classic:[0,0,0,1.4,2.25,4.5,8,17,50,80,100],
    medium:[0,0,0,1.6,2,4,7,26,100,500,1000],high:[0,0,0,0,3.5,8,13,63,500,800,1000]
  }
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

  chart: Highcharts.Chart;
  hotKey:any=false;keyName:any;

  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute) {
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
    this.getMinMax(this.currency);

    this.httpService.postRequest('basic/Specificgame',{name:'keno'},this.token).subscribe((resData:any)=>{
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
    this.getBalance(this.currency);
    jQuery(".rangeslider").click(function(){
      jQuery(".showslider").toggleClass("show");
    });
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this.bet_history_new(this.currency);this.getfavNlike();
    this.showAllHis();this.favCount();this.likeCount();
    this.gather();this.getgraph();
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
        this.autoPick();
      }else if(event.keyCode==69){
        this.keyName='e';
        this.clearTable();
      }else{
        this.keyName='';
      }
    }
  }

  conPass(data:any){
    this.head = data;
    this.token = localStorage.getItem("gAmE-t0KEN");
    this.payoutHistory = [];
    this.bet_history_new(this.currency);this.getfavNlike();
    this.showAllHis();this.favCount();this.likeCount();
    this.gather();this.getgraph();
    this.chart = Highcharts.chart('container', this.chartOptions2)
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

  getMinMax(currency:any) {
    this.httpService.postRequest('keno/getminbetamount',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
            this.min_bet = resData.min_bet; 
            this.max_bet = resData.max_bet; 
            this.bet_amount = (this.min_bet*1).toFixed(6);
        }
    })
  }
  gather(){
    const dynamicDataEl:any = document.getElementById("dynamic-data");

    for (let i = 0; i < this.gennum.length; i++) {
      const newEl = document.createElement("div");
      newEl.textContent = this.gennum[i];
      dynamicDataEl.appendChild(newEl);
    }
  }
  number_of_bets(number:any) {
    if(number == "infinity") {
      this.numberofbets = 100000000000;
    } else {
      this.numberofbets = number;
    }
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
    if(this.bet_amount < this.min_bet) {
      this.bet_amount = (this.min_bet*1).toFixed(6);
    }
    if(this.bet_amount > this.balance) {
      this.bet_amount = (previous*1).toFixed(6);
      this.alert.error('Insufficient Balance');
    }
    this.bet_amount = Number(this.bet_amount).toFixed(6)
  }

  onSliderChange(value: any, type:any) {
    if(type == "auto") {
      this.auto_bet_amount = ((this.balance * value.value) / 100).toFixed(6);
    } else {
      this.bet_amount = ((this.balance * value.value) / 100).toFixed(6);
    }
    this.value = value.value;
  }

  bet_history_new(currency:any){
    this.httpService.postRequest('keno/getBetHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
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

  getfavNlike(){
    var game ="keno";
    const favt = localStorage.getItem("gAmE-fav")?? "";
    const liked = localStorage.getItem("gAmE-like")?? "";

    if (favt.includes(game)) {this.fav_clr=1;}else{this.fav_clr=0;}
    if (liked.includes(game)) { this.like_clr=1;}else{this.like_clr=0;}
  }

  showAllHis(){
    this.httpService.postRequest('keno/getAllBetHistory',{}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.allbet=resData.msg;
        this.allBethistory = resData.msg;  
      } else {
        this.allBethistory = [];
      }
    }) 
  }

  favCount(){
    var obj={'name':'keno'}
    this.httpService.postRequest('basic/getFavCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.fav_count=resData.msg
      }
    })
  }

  likeCount(){
    var obj={'name':'keno'}
    this.httpService.postRequest('basic/getLikeCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.like_count=resData.msg
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
          this.alert.error('Please Choose Another Curency','')
          this.gameTab=true;
        }else{
          this.gameTab=false;
        }
      }
    })
  }

  loadpayout(levl:any){this.risks = levl;}

  over(data:any){
    jQuery('#kenowhl').addClass('spcial');
    this.showpayout = parseFloat(this.rickType[this.risks][data.hits]).toFixed(2);
    this.showwinAmt = (parseFloat(this.rickType[this.risks][data.hits])*100).toFixed(9);
    this.showpaypercent = data.percent;
  }
  out(){
    jQuery('#kenowhl').removeClass('spcial');
  }

  clearTable(){
    this.kenoNum = []; this.rick = []; this.rickType = [];this.checkedout=false;this.activebet = false;
    jQuery(".comrisk").removeClass('active');
    jQuery('.keno').removeClass('selected');
    jQuery('.keno').removeClass('kenoselect selected');
    jQuery('.keno').removeClass('unselected');
    jQuery('.gridbox').removeClass('selectfinish');
  }
  async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async autoPick(){
    this.checkedout=false;
    this.kenoNum = []; this.rick = []; this.rickType = [];
    jQuery(".comrisk").removeClass('active');
    jQuery('.keno').removeClass('selected');
    jQuery('.keno').removeClass('kenoselect selected');
    jQuery('.keno').removeClass('unselected');
    jQuery('.gridbox').removeClass('selectfinish');
    this.getRandomNumbersFromArray(10, this.kenobetsdig).then((data)=>{
    this.kenoNum = data;
    this.rick = this.rick10;
    this.rickType = this.rickType10;
    this.activebet = true;
    jQuery('.gridbox').addClass('selectfinish');
    });
  }
  async getRandomNumbersFromArray(numCount, arr) {
    var result:any = [];
    var tempArr = arr.slice();
    for(var i = 1; i <= numCount; i++) {
      var randomIndex = Math.floor(Math.random() * tempArr.length);
      var randomNumber = tempArr[randomIndex];
      await this.sleep(100);
      jQuery('#'+randomNumber).addClass('selected');
      var riskLen:any = (result.length+1);
      this.rick = this['rick'+riskLen];
      this.rickType = this['rickType'+riskLen];
      result.push(randomNumber);
      tempArr.splice(randomIndex, 1);
    }
    return result;
  }

  auto_bettingamount(type:any) {
    var previous:any = (this.auto_bet_amount*1).toFixed(6);
    if(type == "multiply") {
        this.auto_bet_amount = (this.auto_bet_amount * 2).toFixed(6);
    } else if(type == "divide") {
        this.auto_bet_amount = (this.auto_bet_amount / 2).toFixed(6);
    }

    if(this.auto_bet_amount < this.min_bet) {
      this.auto_bet_amount = (this.min_bet*1).toFixed(6);
    }

    if(this.auto_bet_amount > this.balance) {
      this.auto_bet_amount = (previous*1).toFixed(6);
      this.alert.error('Insufficient Balance');
    }
    this.auto_bet_amount = Number(this.auto_bet_amount).toFixed(6);
  }

  kenobetNum(num:any){
    this.checkedout=false; this.activebet = true;
    jQuery(".comrisk").removeClass('active');
    jQuery('.keno').removeClass('kenoselect');
    jQuery('.keno').removeClass('unselected');
    var obj = this.kenoNum.find(o => o == num);
    if(obj == undefined){
      if(this.kenoNum.length == 9){
        var riskLen = this.kenoNum.length+1;
        this.rick = this['rick'+riskLen];
        this.rickType = this['rickType'+riskLen];
        this.kenoNum.push(num);
        this.activebet = true;
        jQuery('#'+num).addClass('selected');
        jQuery('.gridbox').addClass('selectfinish');
      }else if(this.kenoNum.length < 10){
        var riskLen = this.kenoNum.length+1;
        this.rick = this['rick'+riskLen];
        this.rickType = this['rickType'+riskLen];
        this.kenoNum.push(num);
        this.activebet = true;
        jQuery('#'+num).addClass('selected');
      }
    }else{
      var exct = this.kenoNum.filter(number => number !== num);
      var riskLen:any = (this.kenoNum.length-1);
      this.rick = this['rick'+riskLen];
      this.rickType = this['rickType'+riskLen];
      this.kenoNum = exct;
      if(this.kenoNum.length == 0){this.activebet = false;}
      jQuery('.gridbox').removeClass('selectfinish');
      jQuery('#'+num).removeClass('selected');
    }
  }
  submitBet(){
    this.actdisable=true;
    this.checkedout=false;
    jQuery('.keno').removeClass('kenoselect');
    jQuery('.keno').removeClass('unselected');
    jQuery(".comrisk").removeClass('active');
    var data = {bet_amount:this.bet_amount, currency:this.currency, type:this.risks, betNum: this.kenoNum, risklvl:this.rick, riskpayout:this.rickType[this.risks]};
    this.bettingInitiate(data);
  }
  async bettingInitiate(data:any) {
    var auth = this.httpService.loggedIn();
    if(auth == true){
      var results:any = await this.httpService.postRequestUpdated('keno/getGameResult', data, this.token);
      if(results.success == 1) {
        this.balance = results.balance;
        this.payOut = results.payOut;
        this.returnAmt = parseFloat(this.bet_amount)*parseFloat(this.payOut);
        if(results.status=="loser"){this.alert.error('Loss the game')
        }else{ this.alert.success('Won the Game')}

        var betnotmat = results.bet_not_matched;
        var betmat = results.bet_matched;
        for (let j = 0; j < betnotmat.length; j++) {
          jQuery('#'+betnotmat[j]).addClass('unselected');
          jQuery('#'+betmat.length+"hits").addClass('active');
          jQuery('#'+betmat.length+"pro").addClass('active');
          await this.sleep(100);
          for (let i = 0; i < betmat.length; i++) {
            jQuery('#'+betmat[i]).addClass('kenoselect selected');
          }
        }
        var hist = results.history;
        this.bethistory = hist;
        this.payoutHistory = hist.slice(0, 12);
        this.getBalance(this.currency);
        this.actdisable=false;
        if(results.status == "winner"){this.checkedout=true};
        this.showAllHis();this.getgraph();
      }else{
        this.alert.error('Insufficient Balance');
        return;
      }
    }else{
      this.head=false;
      this.alert.error('please login to continue !');
    }
  }
  async sumbit_auto_bet(){
    this.autoactdisable=true; 
    var win_balance:any  = this.balance * 10000;
    var loss_balance:any = 0;
    this.stop_init = 1;
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
      await this.sleep(3000);
      if(this.auto_bet_amount <= this.balance) {
        this.checkedout=false;
        jQuery('.keno').removeClass('kenoselect');
        jQuery('.keno').removeClass('unselected');
        jQuery(".comrisk").removeClass('active');
        var data = {bet_amount:this.auto_bet_amount, currency:this.currency, type:this.risks, betNum: this.kenoNum, risklvl:this.rick, riskpayout:this.rickType[this.risks]};
        if(this.balance >= win_balance || this.balance <= parseFloat(loss_balance) || i == this.numberofbets || this.stop_init == 0) {
          this.auto_bet     = true;
          this.autoactdisable=false;
          return;
        }else{
          this.bettingInitiate(data);
          this.getBalance(this.currency);
          this.showAllHis();this.getgraph();
        }
      } else {
        this.alert.error('Insufficient Balance');
        this.autoactdisable=false;
        return;
      }
    }
  }
  stop_auto_bet() {
    this.stop_init = 0;
    this.auto_bet = true;
  }
  toggleShowMore() {
    this.showMores = !this.showMores;
    if (this.showMores) {
      this.allBethistory = this.allbet;
    } else {
      this.allBethistory = this.allBethistory.slice(0, 12);
    }
  }
  toggleShowMoreHis() {
    this.showMoreHis = !this.showMoreHis;
    if (this.showMoreHis) {
      this.bethistory = this.fullHis;
    } else {
      this.bethistory = this.bethistory.slice(0, 12);
    }
  }

  copyInputMessage(data:any){
     navigator.clipboard.writeText(data)
    .then(() => this.alert.info('Text copied to clipboard'))
  }
 Details(id:any){
    var obj={'_id':id,game:'keno'}
    this.httpService.postRequest('keno/getDetails',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.Det_id=resData.msg.bet_id;
        this.Det_name=resData.msg.username;
        this.Det_created_at=resData.msg.created_at;
        this.Det_betamount=resData.msg.bet_amount;
        this.Det_payout=resData.msg.payout;
        this.Det_pro_amt=resData.msg.pro_amt;
        this.Det_serverSeed=resData.msg.serverSeed;
        this.Det_clientSeed=resData.msg.clientSeed;
        this.Det_nounce=resData.msg.nounce;
        this.Det_status=resData.msg.status;
        this.Det_seedstatus=resData.msg.seedstatus;
        this.withouthashserver=resData.msg.server;
        this.withouthashclient=resData.msg.client;
        jQuery('.kenohis').removeClass('selected');
        jQuery('.kenohis').removeClass('kenoselect selected');
        jQuery('.kenohis').removeClass('unselected');
        var userbet = resData.msg.userbet; 
        for (let i = 0; i < userbet.length; i++) {
          jQuery('#'+userbet[i]+"res").addClass('selected');
          var winbet = resData.msg.win; 
          for (let j = 0; j < winbet.length; j++) {
            jQuery('#'+winbet[j]+"res").addClass('kenoselect selected');
            var lossbet = resData.msg.loss; 
            for (let k = 0; k < lossbet.length; k++) {
              jQuery('#'+lossbet[k]+"res").addClass('unselected');
            }
          }
        }
      }else{
        this.alert.error(resData.msg,'');
      }
    })
  }
  userFav(name:any){
   var obj={'name':name};
    this.httpService.postRequest('keno/userFav',obj,this.token).subscribe((resData:any) => {
      var fav= localStorage.getItem("gAmE-fav") ?? "";
      let myArray:any = fav.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!fav.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-fav', updatedString);
        }
      }else{
        let index = myArray.indexOf('keno');
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
    this.httpService.postRequest('keno/userLiked',obj,this.token).subscribe((resData:any) => {
      var like= localStorage.getItem("gAmE-like") ?? "";
      let myArray:any = like.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!like.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-like', updatedString);
        }
      }else{
        let index = myArray.indexOf('keno');
        if (index !== -1) {
          myArray.splice(index, 1);
        }
        localStorage.setItem("gAmE-like", myArray.join(','));
      }
        this.likeCount();this.getfavNlike();
    })
  }
  Seedsetting(){
    this.httpService.postRequest('keno/getHash',{},this.token).subscribe((resData:any) => {
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
  generateSeed(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0}
    this.httpService.postRequest('keno/generateHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.newclientSeed=resData.msg
      }else{
        this.alert.error(resData.msg,'');
      }
    })
  }
  updateHash(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0,oldserverSeed:this.serverSeed}
    this.httpService.postRequest('keno/changeHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.alert.success(resData.msg,'');
        jQuery("#exampleCenter").modal("hide"); 
      }else{
        this.alert.error(resData.msg,'');
        jQuery("#exampleCenter").modal("hide"); 
      }
    })
  }

  async confirmedData(){
    await this.sleep(600);
    jQuery('#body').addClass('modal-open');
    jQuery('#body').attr('style','padding-right: 15px');
  }

  getgraph() {
    let data = {game:'keno'};
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
    let data = {game:'keno'};
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