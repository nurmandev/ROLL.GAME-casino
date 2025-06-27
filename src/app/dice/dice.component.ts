import { Component, OnInit, Input, NgModule, ViewChild, ChangeDetectorRef, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

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
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.css']
})
export class DiceComponent implements OnInit {
  public counterSubscription: Subscription | null = null;

  value3: number = 0;
  options3: Options = {floor: 0, ceil: 100, showSelectionBar:true};
  value2: number = 0;
  options2: Options = { floor: 0,ceil: 100, showSelectionBar:true};
  value1: number = 50;
  options1: Options = {floor:2,ceil: 98,ticksArray: [0, 25, 50, 75, 100], showSelectionBar:true,showTicksValues:true};

  balance:any = 0;
  currency:any = 'JB';
  min_bet = 100;
  max_bet = 10000000;
  winning_result = 1.00;
  win_amount:any = (198*1).toFixed(6);

  bet_amount:any = (100).toFixed(6);  // default
  betamount:any = 100;
  chance_win_percent = 50.0;
  
  pay_out:any = (1.98).toFixed(2);
  payout  = 1.98;

  bethistory:any = []; head:any=true;
  payoutHistory:any = '';

  className:any = 'largef';
  token = localStorage.getItem("gAmE-t0KEN");  
  fav = localStorage.getItem("gAmE-fav") ?? "";
  liked = localStorage.getItem("gAmE-like") ?? "";

  roll_value:any = 50.00;
  bet_type_text:any = "Roll Under";
  bet_type:any = "roll_under";

  reslen:any;seedset:any=true;

  counter:any = 1.00;allBethistory:any=[];allbet:any;getAllHis:any=[];
  showMore: boolean = false;showMoreHis=false;His_per:any;serverSeed:any;clientSeed:any;nounce:any;newserverSeed:any;newclientSeed:any;fav_count:any;result:any;
  //det
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;
  Det_seedstatus:any;
  like_count:any;
  clr_chg:any;fav_clr:any;like_clr:any;withouthashserver:any;withouthashclient:any;
  //end
  gameTab:any=false;resautoman:any=true;


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

  constructor(private httpService: ConnectionService,private route: Router,private toastr: ToastrService) {
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
    this.httpService.postRequest('basic/Specificgame',{name:'dice'},this.token).subscribe((resData:any)=>{
      if(resData.success==1){
        if(resData.msg.status==0){
          this.route.navigate(['/']);
        }
      }
    })
    this.getMinMax(this.currency);
  }

  conPass(data:any){
    this.head = data;
    this.token = localStorage.getItem("gAmE-t0KEN");
    this.payoutHistory = [];
    this.getBalance(this.currency);this.full_history();this.favCount();this.getfavNlike();
    this.bet_history(this.currency);this.showLessBet();this.likeCount(); this.getgraph();
    this.chart = Highcharts.chart('container', this.chartOptions2)
  }

  CurrBal(curr:any){
    this.balance = curr.balance;
    this.currency = curr.currency;
    this.getMinMax(curr.currency);
    this.cuurStatus(this.currency);
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
        this.value1=this.value1-10
        this.calculatePayout(this.value1)
      }else if(event.keyCode==69){
        this.keyName='e';
         this.value1=this.value1+10
        this.calculatePayout(this.value1)
      }else if(event.keyCode==81){
        this.keyName='q';
        this.changeBet_type();
      }else{
        this.keyName='';
      }
    }
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

  onSliderChange(value: any, type:any) {
    if(type == "auto") {
        this.auto_bet_amount = ((this.balance * value.value) / 100).toFixed(6);
    } else {
        this.bet_amount = ((this.balance * value.value) / 100).toFixed(6);
    }
      
    //this.value3 = value.value;
  }

  onSliderChangeBet(value: any) {
      this.roll_value = value.value;
      this.calculatePayout(value.value);
  }

  changeBet_type() {
      if(this.bet_type == "roll_under") {
          this.bet_type_text = "Roll Over";
          this.bet_type = "roll_over";
          //this.value1 = 40;
          //var new_roll_value = 
          this.roll_value = this.value1 = 100 - this.roll_value;
          

      } else {
          this.bet_type_text = "Roll Under";
          this.bet_type = "roll_under";
          //this.value1 = 60;
          //this.value1 = 100 - this.roll_value;
          this.roll_value = this.value1 = 100 - this.roll_value;
      }
      this.win_amount = (this.bet_amount * this.pay_out).toFixed(5);
  }

  changeRollValue(value:any)
  {
      this.roll_value = this.value1 = value;
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

    this.getBalance(this.currency);this.full_history();this.favCount();this.getfavNlike();
    this.bet_history(this.currency);this.showLessBet();this.likeCount(); this.getgraph();
    this.chart = Highcharts.chart('container', this.chartOptions2);
  }

  getMinMax(currency:any) {
    this.httpService.postRequest('dice/getminbetamount',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
            this.min_bet = resData.min_bet; 
            this.max_bet = resData.max_bet; 
            this.bet_amount = (this.min_bet).toFixed(6);
        }
    })
  }

  getfavNlike(){
    var game ="dice";
    const favt = localStorage.getItem("gAmE-fav")?? "";
    const liked = localStorage.getItem("gAmE-like")?? "";

    if (favt.includes(game)) {this.fav_clr=1;}else{this.fav_clr=0;}
    if (liked.includes(game)) { this.like_clr=1;}else{this.like_clr=0;}
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

  bet_history(currency:any){
    this.httpService.postRequest('dice/getBetHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
          var hist = resData.history;
          this.His_per=resData.history;
          this.bethistory =hist;
          this.payoutHistory = hist.slice(0, 12);
        } else {
            this.bethistory = [];
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

      if(this.bet_amount < this.min_bet) {
        this.bet_amount = (this.min_bet).toFixed(6);
      }

      if(this.bet_amount > this.balance) {
        this.bet_amount = Number(previous*1).toFixed(6);
        this.toastr.error('Insufficient Balance');
      }

      this.win_amount = (this.bet_amount * this.pay_out).toFixed(6);
      this.bet_amount = (this.bet_amount*1).toFixed(6);
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

    if(this.bet_type == "roll_under") {
      this.roll_value = this.value1 = this.chance_win_percent;
    } else {
      this.roll_value = this.value1 = 100 - this.chance_win_percent;
    }
    this.win_amount = (this.bet_amount * this.pay_out).toFixed(6);
    this.pay_out = (this.pay_out*1).toFixed(2);
  }

  calculatePayout(number:any){
    if(this.bet_type == "roll_over") {
      number = 100 - number;
    }
    var factor = 0.99 / number;
    var payout = 100 * factor;
    this.pay_out = (payout*1).toFixed(2);
    this.chance_win_percent = number;
    this.win_amount = (this.bet_amount * this.pay_out).toFixed(6);
  }

  submitBet(){
    var auth = this.httpService.loggedIn();
    if(auth == true){
      if(this.bet_amount <= this.balance) {
        var data    = {bet_amount:this.bet_amount, currency:this.currency};
        this.bettingInitiate(data);
      } else {
        this.toastr.error('Insufficient Balance');
        return;
      }
    }else{
        this.toastr.error('please login to continue !');
    }
  }

  async bettingInitiate(data:any) {
    var auth = this.httpService.loggedIn();
    if(auth == true){
      var resData:any = await this.httpService.postRequestUpdated('dice/getGameResult', data, this.token);
      if(resData.success == 1) {
        this.result=resData.result;
        this.winning_result = resData.result;
        this.resultCounter(resData.result);
        if(this.payout < this.winning_result) {
          this.className = 'largew';
        } else {
          this.className = 'largef';
        }

        // var data1 = {roll_value:this.roll_value,bet_amount:this.bet_amount, bet_type:this.bet_type, currency:this.currency, pay_out:this.pay_out,clientSeed:resData.clientSeed,serverSeed:resData.serverSeed,nonce:resData.nonce, result:resData.result};
        data.roll_value = this.roll_value;
        data.bet_type = this.bet_type;
        data.pay_out = this.pay_out;
        data.clientSeed = resData.clientSeed;
        data.serverSeed = resData.serverSeed;
        data.nonce = resData.nonce;
        data.result = resData.result;
        
        var resData1:any =await this.httpService.postRequestUpdated('dice/saveBetHistory',data, this.token);
        var hist = resData1.history;
        this.bethistory = hist.slice(0, 12);
        this.payoutHistory = hist.slice(0, 12);
        if(resData1.status=="loser"){this.toastr.error('Loss the game')
        }else{ this.toastr.success('Won the Game')}
        this.showLessBet(); this.getBalance(this.currency);this.getgraph();
        this.clr_chg=resData1.status;
      } else {
        this.toastr.error('Insufficient Balance');
        return;
      }
    }else{
      this.head=false;
      this.toastr.error('please login to continue !');
    }
  }
  
  resultCounter(value:any){
    this.counter=0;
    this.counterSubscription = interval(1).subscribe(() => {
      this.counter +=1.1;
        if(this.counter >= value) {
          this.counter = value;
          this.stopCounter();
        }else{
          this.winning_result= Math.floor(this.counter).toString().length;
        } 
    })
  }

  stopCounter(): void {
    if (this.counterSubscription) {
      this.counterSubscription.unsubscribe();
      this.counterSubscription = null;
    }
  }

  ngOnDestroy(): void {
    if (this.counterSubscription) {
      this.counterSubscription.unsubscribe();
    }
    var conval = <HTMLCanvasElement> document.getElementById('container');
    if(conval !== undefined){
      document.getElementById("container").setAttribute("id", "newcontainer");
    }
    this.chart.destroy();
  }

  //common
  // showMore() {
  //   this.httpService.postRequest('dice/getBetFullHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
  //     console.log(resData)
  //       if(resData.success == 1) {
  //         this.reslen=resData.history.length;
  //         this.bethistory = resData.history;  
  //       } else {
  //           this.bethistory = {};
  //       }
  //   }) 
  // }

  // showLess() {
  //   this.httpService.postRequest('dice/getBetHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
  //       if(resData.success == 1) {
  //         this.reslen=resData.history.length;
  //         this.bethistory = resData.history;  
  //       } else {
  //           this.bethistory = {};
  //       }
  //   })  
  // }

  full_history(){
    this.httpService.postRequest('dice/getAllBetHistory',{}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.getAllHis=resData.msg;
        var getof=resData.msg;
        getof=getof.slice(0, 12);
        this.allbet=resData.msg.length;
        this.allBethistory =getof;  
      } else {
        this.allBethistory = {};
      }
    }) 
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
    if (this.showMore) {
      this.allBethistory = this.getAllHis;
    } else {
      this.allBethistory = this.getAllHis.slice(0, 12);
    }
  }

  toggleShowMoreHis() {
    this.showMoreHis = !this.showMoreHis;
    if (this.showMoreHis) {
      this.bethistory = this.His_per;
    } else {
      this.bethistory = this.His_per.slice(0, 12);
    }
  }

  Seedsetting(){
    this.httpService.postRequest('dice/getHash',{},this.token).subscribe((resData:any) => {
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

  showMoreBet(){
    this.httpService.postRequest('dice/getAllBetHis',{}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.allBethistory = resData.msg;  
      } else {
        this.allBethistory = {};
      }
    }) 
  }

  showLessBet(){
    this.httpService.postRequest('dice/getAllBetHistory',{}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.allbet=resData.msg.length;
        this.allBethistory = resData.msg;  
      } else {
        this.allBethistory = {};
      }
    }) 
  }

  updateHash(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0,oldserverSeed:this.serverSeed}
    this.httpService.postRequest('dice/changeHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.toastr.success(resData.msg,'');
        jQuery("#exampleCenter").modal("hide"); 
      }else{
        this.toastr.error(resData.msg,'');
        jQuery("#exampleCenter").modal("hide"); 
      }
    })
  }

  generateSeed(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0}
    this.httpService.postRequest('dice/generateHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.newclientSeed=resData.msg
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }

  Details(id:any){
    var obj={'_id':id,game:'dice'}
    this.httpService.postRequest('dice/getDetails',obj,this.token).subscribe((resData:any) => {
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
        this.Det_seedstatus=resData.msg.seedstatus;
        this.withouthashserver=resData.msg.server;
        this.withouthashclient=resData.msg.client;
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }

  copyInputMessage(data:any){
     navigator.clipboard.writeText(data)
    .then(() => this.toastr.info('Text copied to clipboard'))
  }

  userFav(name:any){
   var obj={'name':name}
    this.httpService.postRequest('dice/userFav',obj,this.token).subscribe((resData:any) => {
      var fav= localStorage.getItem("gAmE-fav") ?? "";
      let myArray:any = fav.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!fav.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-fav', updatedString);
        }
      }else{
        let index = myArray.indexOf('dice');
        if (index !== -1) {
          myArray.splice(index, 1);
        }
        localStorage.setItem("gAmE-fav", myArray.join(','));
      }
      this.favCount();this.getfavNlike();
    })
  }

  userLike(name:any){
   var obj={'name':name}
    this.httpService.postRequest('dice/userLiked',obj,this.token).subscribe((resData:any) => {
      var like= localStorage.getItem("gAmE-like") ?? "";
      let myArray:any = like.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!like.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-like', updatedString);
        }
      }else{
        console.log("@")
        let index = myArray.indexOf('dice');
        if (index !== -1) {
          myArray.splice(index, 1);
        }
        localStorage.setItem("gAmE-like", myArray.join(','));
      }
        this.likeCount();this.getfavNlike();
    })
  }

  favCount(){
    var obj={'name':'dice'}
    this.httpService.postRequest('basic/getFavCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.fav_count=resData.msg
      }
    })
  }

  likeCount(){
    var obj={'name':'dice'}
    this.httpService.postRequest('basic/getLikeCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.like_count=resData.msg
      }
    })
  }

  //auto process
  auto_chance_win_percent = 50.0;
  auto_payout = 1.98;
  auto_pay_out = (1.98).toFixed(2);

  auto_bet_amount:any = (100).toFixed(6);
  numberofbets:any = 0;

  stop_on_win:any = 0.00000000;
  stop_on_loss:any = 0.00000000;
  stop_init:any = 1;
  auto_bet:any = true;
  /*win_balance:any = this.balance * 1000;
  loss_balance:any = 0;*/

  number_of_bets(number:any) {
      if(number == "infinity") {
          this.numberofbets = 100000000000;
      } else {
          this.numberofbets = number;
      }
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
          this.auto_bet_amount = Number(previous*1).toFixed(6);
          this.toastr.error('Insufficient Balance');
      }
      this.auto_bet_amount = (this.auto_bet_amount*1).toFixed(6)
  }

  auto_calculatePercentage(number: any) {
      if(number == "" || number <= 1.01) {
        this.auto_pay_out = (1.01).toFixed(2);
        number = 1.01; 
      } 
      const initial = 0.99;
      const target = 100;
      var factor = number / initial;
      var percentage = target / factor;
      this.auto_chance_win_percent = percentage;
  }

  async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async sumbit_auto_bet()
  {
      var win_balance  = this.balance * 10000;
      var loss_balance = 0;
      this.stop_init = 1;
      this.auto_bet = false;
      if(this.numberofbets == 0) {
          this.numberofbets = 1000000000;
      }
      
      if(this.stop_on_win > 0) {
          win_balance = parseFloat(this.balance) + parseFloat(this.stop_on_win);
      } 

      if(this.stop_on_loss > 0 && (this.balance >= this.stop_on_loss)) {
          loss_balance = this.balance - this.stop_on_loss
      }
      
      for(var i = 0; i <= this.numberofbets; i++) {
        await this.sleep(2000);
        if(this.auto_bet_amount <= this.balance) {
          var data    = {bet_amount:this.auto_bet_amount, currency:this.currency};
          if(this.balance >= win_balance || this.balance <= loss_balance || i == this.numberofbets || this.stop_init == 0) {
            this.auto_bet     = true;
            return;
          }else{
            this.bettingInitiate(data);
            this.getBalance(this.currency);
            this.getgraph();
          }
        }else {
          this.toastr.error('Insufficient Balance');
          return;
        }  
      }
  }

  stop_auto_bet() {
    this.stop_init = 0;
    this.auto_bet = true;
  }

  async confirmedData(){
    await this.sleep(600);
    jQuery('#body').addClass('modal-open');
    jQuery('#body').attr('style','padding-right: 15px');
  }

  class(){
    if(this.shouldAddClass==false){
      this.shouldAddClass=true;
    }else{
      this.shouldAddClass=false;
    }
  }
  getExacttime(){
    let data = {game:'dice'};
    this.httpService.postRequest('basic/getExacttime',data,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.getgraph();
      }
    })
  }

  getgraph() {
    let data = {game:'dice'};
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

}
