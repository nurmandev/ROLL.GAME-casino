import { Component, OnInit, Input, NgModule, ViewChild, ElementRef, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
import { NgxWheelComponent, TextAlignment, TextOrientation } from 'ngx-wheel';

import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import * as Highcharts from 'highcharts';

declare var jQuery: any;

@Component({
  selector: 'app-caveofplunder',
  templateUrl: './caveofplunder.component.html',
  styleUrls: ['./caveofplunder.component.css']
})
export class CaveofplunderComponent implements OnInit {
  fav = localStorage.getItem("gAmE-fav") ?? "";
  liked = localStorage.getItem("gAmE-like") ?? "";

  @ViewChild(NgxWheelComponent, { static: false }) wheel:any;

  seed = [...Array(5).keys()]
  idToLandOn: any;items: any=[];
  textOrientation: TextOrientation = TextOrientation.HORIZONTAL;
  textAlignment: TextAlignment = TextAlignment.OUTER;
  colors:any;
  balance:any = 0;
  currency:any = 'JB';
  min_bet = 100;
  max_bet = 10000000;

  bet_amount:any = (100).toFixed(6);  // default
  betamount:any = 100;
  win_amount = 198;
  pay_out  = 1.98;

  numberofbets:any = 0;
  betId:any = "";
  checkedout:any=true;
  token = localStorage.getItem("gAmE-t0KEN");
  head:any=true;
  winAmt:any=0;

  cashpot:any = 0.0000;
  total_payout:any = 0.0000;

  //
  book_payout:any = 0;
  cross_payout:any = 0;
  diamond_payout:any = 0;

  book_payout_list:any = [1.6, 5.0, 10.5];
  cross_payout_list:any = [4.0, 13.0, 28.5, 53.0, 88.0, 137.5, 205.0];
  diamond_payout_list:any = [2.5, 8.0, 16.5, 28.5, 45.0];
  //


  images = [
    'assets/images/diamond.png',
    'assets/images/cross.png',
    'assets/images/book.png',
    'assets/images/skull.png',
    'assets/images/none.png'
  ];
  resultImage = 'assets/images/diamond.png';
  isSpinning = false;



  bethistory:any=[];payoutHistory:any=[];showMoreHis:any=false;
  allBethistory:any=[];showMore:any= false;allbet:any=[];

  //details
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;
  Det_seedstatus:any;withouthashserver:any;withouthashclient:any;
  //
  serverSeed:any;clientSeed:any;nounce:any;newserverSeed:any;newclientSeed:any;seedset:any=true;
  fav_count:any;like_count:any;fav_clr:any;like_clr:any;gameTab:any=false;

  diasblebet:any=false; hadamt:any= false;

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
    this.httpService.postRequest('basic/Specificgame',{name:'caveofplunder'},this.token).subscribe((resData:any)=>{
      if(resData.success==1){
        if(resData.msg.status==0){
          this.route.navigate(['/']);
        }
      }
    })
    this.getMinMax(this.currency);
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

  /*spin() {
    if (!this.isSpinning) {
      this.isSpinning = true;
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * this.images.length);
        this.resultImage = this.images[randomIndex];
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        this.isSpinning = false;
        // Set the result as the desired image
        this.resultImage = 'assets/images/cross.png';
      }, 4000);
    }
  }*/

  ngOnInit(): void {
    jQuery(window).keypress(function(e) {
      if (e.which == 32) {e.preventDefault();}
    });
    this.getBalance(this.currency);this.recallData();
    jQuery(".rangeslider").click(function(){
      jQuery(".showslider").toggleClass("show");
    });
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this. colors = ['#354258']
    this.items = this.seed.map((value,index) => ({
      fillStyle: this.colors[value % 1 ],
      id: value,
      text:`${100 + (index * 100) + "X"}`,
      textFillStyle: 'white',
      textFontSize: "12",
      textOrientation:"curved",
      textAligment: "center"

    }))
    //this.idToLandOn = 2;
      // text:`${100 + (index * 100) + "X"}`,

    this.bet_history_new(this.currency);this.allUser_history();
    this.favCount(); this.likeCount();
    this.getgraph();this.chart = Highcharts.chart('containerX', this.chartOptions2);

  }

  getgraph() {
    let data = {game:'caveofplunder'};
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
    let data = {game:'caveofplunder'};
    this.httpService.postRequest('basic/getExacttime',data,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.getgraph();
      }
    })
  }

  recallData(){
    var gameCode = localStorage.getItem("Game-Code");
    if(gameCode !== undefined && gameCode !== null){
      this.httpService.postRequest('cave/recallData',{gameCode: gameCode}, this.token).subscribe((resData:any) => {
        if(resData.success ==1){
          this.book_payout    = resData.data.book_payout;
          this.cross_payout   = resData.data.cross_payout;
          this.diamond_payout = resData.data.diamond_payout;
          this.cashpot = resData.data.winning_amount;
          if(parseFloat(this.cashpot) > 0 ){this.hadamt=true;}else{this.hadamt=false;}
        }
      })
    }
  }

  getMinMax(currency:any) {
    this.httpService.postRequest('cave/getminbetamount',{currency:this.currency}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.min_bet = resData.min_bet; 
        this.max_bet = resData.max_bet; 
        this.bet_amount = (this.min_bet).toFixed(6);
      }
    })
  }

  winBoxMsg(){
    jQuery("#win_box").modal('show');
    setTimeout(()=>{
      jQuery("#win_box").modal('hide');
      this.wheel.reset(); 
    }, 3000);
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

  before() {}
  after() {
    console.log('Spin ended');
  } 

  conPass(data:any){
    this.head = data;
    this.token = localStorage.getItem("gAmE-t0KEN");
    this.ngOnInit();
  }

  CurrBal(curr:any){
    this.balance = curr.balance;
    this.currency = curr.currency;
    this.cuurStatus(this.currency);
    this.getMinMax(this.currency);
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
        this.bet_amount = (this.min_bet).toFixed(6);
      }

      if(this.bet_amount > this.balance) {
        this.bet_amount = Number(previous).toFixed(6);
        this.toastr.error('Insufficient Balance');
      }

      this.win_amount = this.bet_amount * this.pay_out;
      this.bet_amount = (this.bet_amount*1).toFixed(6);
  }

  autobet(bet:any){
    this.numberofbets = bet;
  }

  async submitBet(){

    var auth = this.httpService.loggedIn();
    if(auth == true){
      this.diasblebet = true;
      if(parseFloat(this.cashpot) > 0 ){this.hadamt=true;}else{this.hadamt=false;}
      if(this.bet_amount <= this.balance) {
        var data    = {bet_amount:this.bet_amount, currency:this.currency};
        if(this.numberofbets != "" || this.numberofbets != 0) {
          var j = this.numberofbets;
            for(var i = 0; i < j; i++) {
                await this.bettingInitiate(data);
                await this.sleep(1000);
                this.numberofbets = this.numberofbets - 1;
                if(this.bet_amount > this.balance) {
                  this.toastr.error('Insufficient Balance');
                  this.numberofbets = 0;
                  return;
                }
            }
        } else {
            this.bettingInitiate(data);
        }
      } else {
        this.toastr.error('Insufficient Balance');
        return;
      }
    }else{
        this.toastr.error('please login to continue !');
    }
  }

  async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async bettingInitiate(data:any) {
    if (!this.isSpinning) {
      this.isSpinning = true;
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * this.images.length);
        this.resultImage = this.images[randomIndex];
      }, 100);

      var data1 = {bet_amount:this.bet_amount, currency:this.currency, book_payout:this.book_payout, cross_payout:this.cross_payout, diamond_payout: this.diamond_payout};
      var resData:any = await this.httpService.postRequestUpdated('cave/saveBetHistory',data1,this.token);

      clearInterval(interval);
      await this.sleep(1000);
      this.isSpinning = false;
      if(resData.success == 1) {
         localStorage.setItem('Game-Code', resData.encrpayout);
          this.resultImage = 'assets/images/'+resData.bet_result+'.png';
          //this.afterBet = true;
      
          this.cashpot = resData.winning_amount;
          if(resData.bet_result == "book") {
              if(resData.book_payout_status == "reward")
              {
                  //popup
                  var toalresult = parseFloat(resData.reward_payout)*parseFloat(this.betamount);
                  this.winAmt = toalresult
                  this.winBoxMsg();
              }
              let element = this.elementRef.nativeElement.querySelector('#book_'+(resData.book_payout*100));
              this.renderer.addClass(element, 'wins');
          } else if(resData.bet_result == "cross") {              
              if(resData.cross_payout_status == "spin") {
                  this.idToLandOn = (resData.reward_payout / 100) - 1;
                  await new Promise(resolve => setTimeout(resolve, 1000)); 
                  this.wheel.spin()
                  this.payoutResult(1)
                  await new Promise(resolve => setTimeout(resolve, 6000)); 
                                    let elements = this.elementRef.nativeElement.querySelectorAll('.cross_cls');
                  elements.forEach((el) => {
                      this.renderer.removeClass(el, 'wins');
                  });

                  //popup
                  var toalresult = parseFloat(resData.reward_payout)*parseFloat(this.betamount);
                  this.winAmt = toalresult;
                  this.winBoxMsg();
              }
              let element = this.elementRef.nativeElement.querySelector('#cross_'+(resData.cross_payout*100));
              this.renderer.addClass(element, 'wins');
          } else if(resData.bet_result == "diamond") {
              if(resData.diamond_payout_status == "reward")
              {
                  //popup
                  var toalresult = parseFloat(resData.reward_payout)*parseFloat(this.betamount);
                  this.winAmt = toalresult
                  this.winBoxMsg();
              }
              let element = this.elementRef.nativeElement.querySelector('#diamond_'+(resData.diamond_payout*100));
              this.renderer.addClass(element, 'wins');
          } else if(resData.bet_result == "skull") {
              if(this.book_payout != 0) {
                  let element = this.elementRef.nativeElement.querySelector('#book_'+(this.book_payout*100));
                  this.renderer.removeClass(element, 'wins');    
              }

              if(this.cross_payout != 0) {
                  let element1 = this.elementRef.nativeElement.querySelector('#cross_'+(this.cross_payout*100));
                  this.renderer.removeClass(element1, 'wins');    
              }
              
              if(this.diamond_payout != 0) {
                  let element2 = this.elementRef.nativeElement.querySelector('#diamond_'+(this.diamond_payout*100));
                  this.renderer.removeClass(element2, 'wins');    
              }
          } 
          
          if(parseFloat(this.cashpot) > 0 ){this.hadamt=true;}else{this.hadamt=false;}
          this.book_payout    = resData.book_payout;
          if(resData.cross_payout_status == "spin") {
              this.cross_payout   = 0;
          } else {
              this.cross_payout   = resData.cross_payout;
          } 
          this.diasblebet = false;
          this.diamond_payout = resData.diamond_payout;

          this.getBalance(this.currency);
          //this.gameId(); this.getBalance(this.currency);
          //this.bet_history(this.currency);this.showAllHis();
          
          //this.gameId(); this.getBalance(this.currency);
          this.bet_history_new(this.currency);this.allUser_history();
          this.getgraph();

      } else {
          this.toastr.error(resData.msg);
      } 
    }
  }

  payoutResult(result:any){
    for(var get of this.items){
      console.log(get)
      if(get.id==result){
        console.log(get.text)
      }
  }}

  async collect_amount(type:any) {
      if(this.cashpot != 0) {
          var data1 = {cashpot:this.cashpot, currency:this.currency, book_payout:this.book_payout, cross_payout:this.cross_payout, diamond_payout: this.diamond_payout};
        var resData:any = await this.httpService.postRequestUpdated('cave/collectCashPot',data1, this.token);
        if(resData.success == 1) {
            localStorage.removeItem("Game-Code");
            this.book_payout    = 0;
            this.cross_payout   = 0;
            this.diamond_payout = 0;
            this.cashpot = 0;
            this.balance = resData.balance;
            if(parseFloat(this.cashpot) > 0 ){this.hadamt=true;}else{this.hadamt=false;}
            let elements = this.elementRef.nativeElement.querySelectorAll('.dnd');
            elements.forEach((el) => {
                this.renderer.removeClass(el, 'wins');
            });

            //popup
            this.winAmt = data1.cashpot
            this.winBoxMsg();
            this.toastr.success(data1.cashpot + " "+ this.currency+ " credited your wallet");
        }
      }
  }

  onSliderChange(value: any, type:any) {
    this.bet_amount = ((this.balance * value.value) / 100).toFixed(6);
  }

  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 200
  };
  
  value2: number = 100;
  options2: Options = {
    floor: 0,
    ceil: 200
  };

  bet_history_new(currency:any){
    this.httpService.postRequest('cave/getBetHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
          var hist = resData.history;
          this.bethistory = hist;
          this.payoutHistory = hist.slice(0, 10);
        } else {
          this.bethistory = [];
        }
    })  
  }

  //full history
  allUser_history(){
    this.httpService.postRequest('cave/getAllBetHistory',{},this.token).subscribe((resData:any)=> {
      if(resData.success == 1) {
        this.allbet=resData.msg;
        this.allBethistory = resData.msg;  
      } else {
        this.allBethistory = {};
      }
    }) 
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
    if (this.showMore) {
      this.allBethistory = this.allBethistory;
    } else {
      this.allBethistory = this.allBethistory.slice(0, 10);
    }
  }
  
  // 


  toggleShowMoreHis() {
    this.showMoreHis = !this.showMoreHis;
    if (this.showMoreHis) {
      this.bethistory = this.bethistory;
    } else {
      this.bethistory = this.bethistory.slice(0, 10);
    }
  }


  Details(id:any){
    var obj={'_id':id,game:'caveofplunder'}
    this.httpService.postRequest('cave/getDetails',obj,this.token).subscribe((resData:any) => {
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

  async confirmedData(){
    await this.sleep(600);
    jQuery('#body').addClass('modal-open');
    jQuery('#body').attr('style','padding-right: 15px');
  }

   Seedsetting(){
    this.httpService.postRequest('cave/getHash',{},this.token).subscribe((resData:any) => {
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

  updateHash(){
    var obj={newserverSeed:this.newserverSeed,newclientSeed:this.newclientSeed,nonce:0,oldserverSeed:this.serverSeed}
    this.httpService.postRequest('cave/changeHash',obj,this.token).subscribe((resData:any) => {
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
    this.httpService.postRequest('cave/generateHash',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.newclientSeed=resData.msg
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }

  // like anf fav
  getfavNlike(){
    var game ="caveofplunder";
    const favt = localStorage.getItem("gAmE-fav")?? "";
    const liked = localStorage.getItem("gAmE-like")?? "";

    if (favt.includes(game)) {this.fav_clr=1;}else{this.fav_clr=0;}
    if (liked.includes(game)) { this.like_clr=1;}else{this.like_clr=0;}
  }


  //user favourite
  userFav(name:any){
   var obj={'name':name};
    this.httpService.postRequest('cave/userFav',obj,this.token).subscribe((resData:any) => {
      var fav= localStorage.getItem("gAmE-fav") ?? "";
      let myArray:any = fav.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!fav.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-fav', updatedString);
        }
      }else{
        let index = myArray.indexOf('caveofplunder');
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
    this.httpService.postRequest('cave/userLiked',obj,this.token).subscribe((resData:any) => {
      var like= localStorage.getItem("gAmE-like") ?? "";
      let myArray:any = like.split(',');
      if(resData.success==1 && resData.game!=""){
        if (!like.includes(resData.game)) {
          myArray.push(resData.game);
          let updatedString = myArray.join(',');
          localStorage.setItem('gAmE-like', updatedString);
        }
      }else{
        let index = myArray.indexOf('caveofplunder');
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
    var obj={'name':'caveofplunder'}
    this.httpService.postRequest('basic/getFavCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.fav_count=resData.msg;
      }
    })
  }

  // like count
  likeCount(){
    var obj={'name':'caveofplunder'}
    this.httpService.postRequest('basic/getLikeCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.like_count=resData.msg;
      }
    })

  }
  //

  ngOnDestroy(): void {
    var conval = <HTMLCanvasElement> document.getElementById('canvas');
    if(conval !== undefined){
      document.getElementById("canvas").setAttribute("id", "newcanvas");
    }
  }
}
