import { Component, OnInit, Input, NgModule, ViewChild, ChangeDetectorRef, HostListener, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
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
  selector: 'app-mines',
  templateUrl: './mines.component.html',
  styleUrls: ['./mines.component.css']
})

export class MinesComponent implements OnInit {

  balance:any = 0;
  currency:any = 'JB';
  min_bet = 100;
  max_bet = 10000000;
  winning_result = 1.00;

  bet_amount:any = (100).toFixed(6);  // default
  betamount:any = 100;
  chance_win_percent = 50.0;
  
  pay_out = 1.98;
  payout  = 1.98;

  bethistory:any = []; head:any=true;
  payoutHistory:any=[];

  className:any = 'largef';
  token = localStorage.getItem("gAmE-t0KEN");
  fav = localStorage.getItem("gAmE-fav") ?? "";
  liked = localStorage.getItem("gAmE-like") ?? "";


  gems:number = 24;
  mines:number = 4;

  value: number = 0;
  options: Options = {floor: 0,ceil: 100};
  value2: number = 0
  options2: Options = {floor: 0,ceil: 100};
  value3: number = 4;
  options3: Options = {floor: 1,ceil: 24};
  value4: number = 4;
  options4: Options = {floor: 1,ceil: 24};

  afterBet:any = false;
  betId:any = "";
  userChoice:any = [];
  betdisable:any = true;
  cashoutButton:any = false;
  tiles:any = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

  
  payoutList:any = [1.03,1.08,1.13,1.18,1.24,1.30,1.38];

  tilesDisabled:any = true;
  

  winner_div:any = false;
  win_amount:any = 0.00;
  win_payout:any = 1.00;

  manual:any = true;

  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;
  Det_seedstatus:any;withouthashserver:any;withouthashclient:any;
  serverSeed:any;clientSeed:any;nounce:any;newserverSeed:any;newclientSeed:any; activebet:any= false;
  allBethistory:any=[]; showMoreHis:boolean=false;showMores:any=false; fullHis:any=[]; allbet:any=[];
  seedset:any=true;
  userId :any = "";gameTab:any=false;
  // 
  fav_count:any;like_count:any;fav_clr:any;like_clr:any;checkedout:any=false;
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

  hotKey:any=false;keyName:any;
  chart: Highcharts.Chart;

  constructor(private httpService:ConnectionService,private toastr: ToastrService,private route: Router, private renderer: Renderer2, private elementRef: ElementRef) {
    if(!this.httpService.loggedIn()){
      this.head=false;
      this.checkedout=true;
    }
    this.getMinMax(this.currency);

    this.httpService.postRequest('basic/Specificgame',{name:'mines'},this.token).subscribe((resData:any)=>{
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
    this.getBalance(this.currency);
    this.bet_history(this.currency);

    this.gameId();this.showAllHis();this.likeCount();this.favCount();this.getgraph();
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
        this.value3=this.value3+1;
        this.setmine(this.value3, 'manual')
      }else if(event.keyCode==69){
        this.keyName='e';
        this.value3=this.value3-1;
        this.setmine(this.value3, 'manual')
      }else{
        this.keyName='';
      }
    }
  }


  conPass(data:any){
    this.head = data;
    this.token = localStorage.getItem("gAmE-t0KEN");
    this.payoutHistory = [];
    this.getBalance(this.currency);
    this.bet_history(this.currency);

    this.gameId();this.showAllHis();this.likeCount();this.favCount();this.getgraph();
    this.chart = Highcharts.chart('container', this.chartOptions2)
  }

  getMinMax(currency:any) {
    this.httpService.postRequest('mines/getminbetamount',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
            this.min_bet = resData.min_bet; 
            this.max_bet = resData.max_bet; 
            this.bet_amount = (this.min_bet).toFixed(6);
        }
    })
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
          this.toastr.error('Please Choose Another Curency','')
          this.gameTab=true;
        }else{
          this.gameTab=false;
        }
      }
    })
  }


  gameId(){
    var checkdata = localStorage.getItem("gAmE-mines");
    if(checkdata !== null && checkdata !== undefined && checkdata !== "" ){
      this.betId = checkdata;
      this.httpService.postRequest('mines/getcurt',{_id:this.betId}, this.token).subscribe((resData:any) => {
        if(resData){
          this.refreshTiles();
          this.betdisable = false;
          this.cashoutButton = true;
          this.afterBet = true;
          this.gems = 25 - parseFloat(resData.currData.no_of_mines);
          if(parseFloat(resData.next_payout) !== -1){
            this.next_payout = (parseFloat(resData.next_payout)).toFixed(2);
          }
          this.profit_next = (this.next_payout * parseFloat(resData.currData.bet_amount)*1).toFixed(6);
          this.curr_payout = (parseFloat(resData.currData.payout)*1).toFixed(2);
          this.profit = (this.curr_payout * parseFloat(resData.currData.bet_amount)*1).toFixed(6);
          this.tilesDisabled = false;
          var userbet = resData.currData.bet_result; 
          for (let i = 0; i < userbet.length; i++) {
            let element = this.elementRef.nativeElement.querySelector('#tile'+userbet[i].userchoice);
            this.renderer.addClass(element, 'selected');
          }
        }
      })
    }else{
      this.betId = "";
    }
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
    this.httpService.postRequest('mines/getBetHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
            var hist = resData.history;
            this.bethistory = hist;
            this.fullHis = hist;
            //this.fullHis=hist;
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
      this.bet_amount = (this.bet_amount*1).toFixed(6);
  }

  setmine(mine:any, type:any){
    if(type == 'manual'){
      this.mines = mine;
    }else if(type == 'auto'){
      this.auto_mines = mine;
    }
  }

  onSliderChange(value: any, type:any) {
    if(type == "auto") {
        this.auto_bet_amount = ((this.balance * value.value) / 100).toFixed(6);
    } else {
        this.bet_amount = ((this.balance * value.value) / 100).toFixed(6);
    }
    this.value = value.value;
  }

  fullResultAppend(result:any) {
      for(var i = 1; i <= 25; i++) {
          let element = this.elementRef.nativeElement.querySelector('#tile'+i);
          if(element.classList.contains('selected') || element.classList.contains('mines')) {
              this.renderer.removeClass(element, 'selected');
              this.renderer.removeClass(element, 'mines');
          }

          if(result.includes(i)) {
              this.renderer.addClass(element, 'unselected');
              this.renderer.addClass(element, 'mines');
          } else {
              this.renderer.addClass(element, 'unselected');
          }
      }

      this.betdisable = true;
      this.cashoutButton = false;
      this.afterBet = false;
      this.tilesDisabled = true;
      this.userChoice = [];
      localStorage.removeItem('gAmE-mines');
  }

  async checkresult(choosenumber:any)
  {
      if(this.userChoice.indexOf(choosenumber) !== -1) { return; }
      this.gems = this.gems - 1;
      var data1 = {betId: this.betId, choosenumber:choosenumber};
      var resData:any = await this.httpService.postRequestUpdated('mines/checkresult',data1, this.token);
      if(resData.success == 1) {
          if(resData.result == "mines") {
              let element = this.elementRef.nativeElement.querySelector('#tile'+choosenumber);
              this.renderer.addClass(element, 'selected');
              this.renderer.addClass(element, 'mines');
              this.fullResultAppend(resData.mines_result);
              localStorage.removeItem('gAmE-mines');

              var hist = resData.history;
              this.bethistory = hist;
              this.fullHis = hist;
              this.payoutHistory = hist.slice(0, 12);

          } else if(resData.result == "diamond" || resData.result == "winner") {

            let element = this.elementRef.nativeElement.querySelector('#tile'+choosenumber);
            this.renderer.addClass(element, 'selected');
            if(resData.result == "diamond") {
                this.curr_payout = (resData.payout*1).toFixed(2); 
                this.next_payout = (resData.next_payout*1).toFixed(2);
                this.profit_next = (this.next_payout * this.bet_amount).toFixed(6);
                this.profit = (this.curr_payout * this.bet_amount*1).toFixed(6);
                this.userChoice.push(choosenumber);
            }
            
            if(resData.result == "winner") {
                this.fullResultAppend(resData.mines_result);
                this.winner_div = true;
                this.win_amount = resData.win_amount.toFixed(4);
                this.win_payout = resData.payout;

                var hist = resData.history;
                this.bethistory = hist;
                this.fullHis = hist;
                this.payoutHistory = hist.slice(0, 12);
            }
        }
      this.showAllHis();
      if(resData.status=='loser'){
        this.toastr.error('Loss the Game');
      }else if(resData.status=='winner'){
        this.toastr.success('Won the Game');
      }
      } else if(resData.success == 2) {
          this.toastr.error(resData.result);
      }
  }

  refreshTiles() {
      let elements = this.elementRef.nativeElement.querySelectorAll('.diamond');
      elements.forEach((el) => {
          this.renderer.removeClass(el, 'selected');
          this.renderer.removeClass(el, 'unselected');
          this.renderer.removeClass(el, 'mines');
      }); 

      this.winner_div = false;
      this.win_amount = 0.00;
      this.win_payout = 1.00;
  }

  submitBet(){
    var auth = this.httpService.loggedIn();
    if(auth == true){
      this.refreshTiles();
      this.betdisable = false;
      this.cashoutButton = true;
      this.gems = 25 - this.mines;
      /*this.next_payout = (this.payoutList[this.mines - 1]).toFixed(2); 
      this.profit_next = (this.payoutList[this.mines - 1] * this.bet_amount).toFixed(6);*/
      this.tilesDisabled = false;
      if(this.bet_amount <= this.balance) {
        var data    = {bet_amount:this.bet_amount, currency:this.currency};
        this.bettingInitiate(data);
      } else {
          this.toastr.error('Insufficient Balance');
          return;
      }
    }else{
      this.head=false;
      this.toastr.error('please login to continue !');
    }
  }

  showAllHis(){
    this.httpService.postRequest('mines/getAllBetHistory',{}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.allbet = resData.msg;
        this.allBethistory = resData.msg;
      } else {
        this.allBethistory = [];
        this.allbet = [];
      }
    }) 
  }
  async submitCashout(){
    if(parseFloat(this.profit) > 0){
      var data = {betId: this.betId};
      var resData:any = await this.httpService.postRequestUpdated('mines/cashout',data,this.token);
      if(resData.success == 1) {
        if(resData.status=='winner'){
          this.toastr.success('Cash out successfully');
        }else if(resData.status=='loser'){
          this.toastr.error('Loss the Game');
        }
        this.winner_div = true;
        this.win_amount = resData.win_amount.toFixed(4);
        this.win_payout = resData.payout;
        var hist = resData.history;
        this.bethistory = hist;
        this.payoutHistory = hist.slice(0, 12);
        this.getBalance(this.currency);

        this.fullResultAppend(resData.mines_result);
        this.bet_history(this.currency);this.showAllHis();
      } else {
          this.toastr.error('Please try again');
      }
    }else{
        this.toastr.error('please select bet !');  
    }
  }

  async bettingInitiate(data:any) {
    var auth = this.httpService.loggedIn();
    if(auth == true){
      var data1 = {bet_amount:this.bet_amount, currency:this.currency, mines: this.mines};
      var resData:any = await this.httpService.postRequestUpdated('mines/saveBetHistory',data1,this.token);
      if(resData.success == 1) {
          this.afterBet = true;
          if(resData.status == "pending") {
              localStorage.setItem('gAmE-mines', resData.betId);
              this.betId = resData.betId;
              this.gameId(); this.getBalance(this.currency);
              this.bet_history(this.currency);this.showAllHis();
          } else {
              localStorage.removeItem('gAmE-mines');
          }
          this.gameId(); this.getBalance(this.currency);
      } else {
          this.toastr.error(resData.msg);
      }
    }else{
      this.head=false;
      this.toastr.error('please login to continue !');
    }
  }

  next_payout:any = (1.03).toFixed(2);
  curr_payout:any = (1.00).toFixed(2);
  profit_next:any = (103*1).toFixed(6);
  profit:any = (100).toFixed(6);

  auto_bet_amount:any = (100).toFixed(6);
  numberofbets:any = 0;

  stop_on_win:any = 0.00000000;
  stop_on_loss:any = 0.00000000;
  stop_init:any = 1;
  auto_bet:any = true;
  userChoiceTiles:any = [];
  auto_mines:any = 1;

  selectTiles(tile:any)
  {
      /*if(this.userChoiceTiles.includes(tile))
      {

      }*/
      var index = this.userChoiceTiles.findIndex(element => element == tile);
      if(index != -1) {
          this.userChoiceTiles.splice(index, 1);
          let element = this.elementRef.nativeElement.querySelector('#autotile'+tile);
          this.renderer.removeClass(element, 'bgs');
      } else {
          this.userChoiceTiles.push(tile);
          let element = this.elementRef.nativeElement.querySelector('#autotile'+tile);
          this.renderer.addClass(element, 'bgs');
      }
      /*console.log("AAAAA");
      console.log(this.userChoiceTiles); 
      console.log("BBBBB");*/
  }

  changeTiles(type:any) {
      this.winner_div = false;
      if(type == "manual") {
          this.manual = true;
      } else {
          this.manual = false;
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

  fullResultAppendAuto(result:any) {
      for(var i = 1; i <= 25; i++) {
          let element = this.elementRef.nativeElement.querySelector('#autotile'+i);
          if(result.includes(i)) {
              this.renderer.addClass(element, 'unselected');
              this.renderer.addClass(element, 'mines');
          } else {
              this.renderer.addClass(element, 'unselected');
          }
      }
  }

  refreshTilesAuto() {
      let elements = this.elementRef.nativeElement.querySelectorAll('.diamond');
      elements.forEach((el) => {
          this.renderer.removeClass(el, 'selected');
          this.renderer.removeClass(el, 'unselected');
          this.renderer.removeClass(el, 'mines');
      }); 

      this.winner_div = false;
      this.win_amount = 0.00;
      this.win_payout = 1.00;
  }

  async autoBettingInitiate(data:any)
  {
      this.refreshTilesAuto();
      var resData:any = await this.httpService.postRequestUpdated('mines/saveAutoBet',data,this.token);
      if(resData.success == 1) {
          this.fullResultAppendAuto(resData.mines_result);
          if(resData.result == "winner") {
              this.winner_div = true;
              this.win_amount = resData.win_amount.toFixed(4);
              this.win_payout = resData.payout.toFixed(2);
              this.getBalance(this.currency);
              this.bet_history(this.currency);

              this.gameId();this.showAllHis();
          } else {
              this.winner_div = false;
          }
      } else {
          this.toastr.error(resData.msg);
          this.stop_init = 0;
      }
  }

  async sumbit_auto_bet()
  {
      /*var data    = {bet_amount:this.auto_bet_amount, currency:this.currency, user_choice:this.userChoiceTiles,mines:this.auto_mines};
      this.autoBettingInitiate(data);
      return;*/
      this.stop_init = 1;
      var win_balance  = this.balance * 10000;
      var loss_balance = 0;

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
        if(this.auto_bet_amount <= this.balance) {
          var data    = {bet_amount:this.auto_bet_amount, currency:this.currency, user_choice:this.userChoiceTiles,mines:this.auto_mines};
          if(this.balance >= win_balance || this.balance <= loss_balance || i == this.numberofbets || this.stop_init == 0) {
            this.auto_bet = true;
            return;
          }else{
            this.autoBettingInitiate(data);
            this.getBalance(this.currency);
            await this.sleep(2000);
          }
        } else {
          this.toastr.error('Insufficient Balance');
          return;
        }  
      }
  }

  async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  stop_auto_bet() {
      this.stop_init = 0;
      this.auto_bet = true;
  }

  Details(id:any){
    var obj={'_id':id,game:'mines'}
    this.httpService.postRequest('mines/getDetails',obj,this.token).subscribe((resData:any) => {
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

        var userbet = resData.msg.result;
        jQuery('.diamondmini').removeClass('selected');
        jQuery('.diamondmini').removeClass('selected mines');
        for (let i = 0; i < userbet.length; i++) {
          if(userbet[i].bet_result=="diamond"){
            jQuery('#'+userbet[i].userchoice+"res").addClass('selected');
          }else if(userbet[i].bet_result=="mines"){
            jQuery('#'+userbet[i].userchoice+"res").addClass('selected mines');
          }
        }
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }

  toggleShowMore() {
    this.showMores = !this.showMores;
    if (this.showMores) {
      this.allBethistory = this.allbet;
    } else {
      this.allBethistory = this.allBethistory.slice(0, 10);
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
  generateSeed(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0}
    this.httpService.postRequest('mines/generateHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.newclientSeed=resData.msg
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }
  updateHash(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0,oldserverSeed:this.serverSeed}
    this.httpService.postRequest('mines/changeHash',obj,this.token).subscribe((resData:any) => {
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
    .then(() => this.toastr.success('Text copied to clipboard'))
  }
  async confirmedData(){
    await this.sleep(600);
    jQuery('#body').addClass('modal-open');
    jQuery('#body').attr('style','padding-right: 15px');
  }
  Seedsetting(){
    this.httpService.postRequest('mines/getHash',{},this.token).subscribe((resData:any) => {
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

// fav and like
  getfavNlike(){
    var game ="mines";
    const favt = localStorage.getItem("gAmE-fav")?? "";
    const liked = localStorage.getItem("gAmE-like")?? "";

    if (favt.includes(game)) {this.fav_clr=1;}else{this.fav_clr=0;}
    if (liked.includes(game)) { this.like_clr=1;}else{this.like_clr=0;}
  }

  //user favourite
  userFav(name:any){
   var obj={'name':name};
    this.httpService.postRequest('mines/userFav',obj,this.token).subscribe((resData:any) => {
      var fav= localStorage.getItem("gAmE-fav") ?? "";
      let myArray:any = fav.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!fav.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-fav', updatedString);
        }
      }else{
        let index = myArray.indexOf('mines');
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
    this.httpService.postRequest('mines/userLiked',obj,this.token).subscribe((resData:any) => {
      var like= localStorage.getItem("gAmE-like") ?? "";
      let myArray:any = like.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!like.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-like', updatedString);
        }
      }else{
        let index = myArray.indexOf('mines');
        if (index !== -1) {
          myArray.splice(index, 1);
        }
        localStorage.setItem("gAmE-like", myArray.join(','));
      }
        this.likeCount();this.getfavNlike();
    })
  }


  favCount(){
    var obj={'name':'mines'}
    this.httpService.postRequest('basic/getFavCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.fav_count=resData.msg
      }
    })
  }

  likeCount(){
    var obj={'name':'mines'}
    this.httpService.postRequest('basic/getLikeCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.like_count=resData.msg
      }
    })
  }

  //

  getgraph() {
    let data = {game:'mines'};
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
    let data = {game:'mines'};
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
