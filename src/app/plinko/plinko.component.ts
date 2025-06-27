import { Component, OnInit, Input, NgModule, ViewChild, ChangeDetectorRef, HostListener, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, interval, Subscription } from 'rxjs';

import { getMultiplierByLines } from '../../multiplier';

declare var jQuery: any;

import { Bodies, Body, Composite, Engine, Events, IEventCollision, Render, Runner, World } from 'matter-js';

import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import * as Highcharts from 'highcharts';

let engine = Engine.create();

const pinsConfig:any = {
    startPins: 3,
    pinSize: 3,
    pinGap: 30
}

const ballConfig:any = {
    ballSize: 8.5
}

const engineConfig:any = {
    engineGravity: 0.8
}

const worldConfig:any = {
    width: 600,
    height: 600
}

const colorsConfig:any = {
    primary: '#213743',
    secondary: '#3d5564',
    text: '#F2F7FF',
    purple: '#C52BFF',
    purpleDark: '#8D27B3'
}


@Component({
  selector: 'app-plinko',
  templateUrl: './plinko.component.html',
  styleUrls: ['./plinko.component.css']
})
export class PlinkoComponent implements OnInit {
  fav = localStorage.getItem("gAmE-fav") ?? "";
  liked = localStorage.getItem("gAmE-like") ?? "";
  
  gamesRunning:any = 0;
  lines: number = 10;
  multipliers = getMultiplierByLines(10);
  lastMultiplierX: number = worldConfig.width / 2 - (pinsConfig.pinGap / 2) * this.lines - pinsConfig.pinGap;

  rows:any = 8;
  token = localStorage.getItem("gAmE-t0KEN");
  balance:any = 0;
  currency:any = 'JB';
  min_bet = 100;
  max_bet = 10000000;
  winning_result = 1.00;

  bet_amount:any = (100).toFixed(6);  // default
  betamount:any = 100;
  chance_win_percent = 50.0;

  bethistory:any = []; 
  payoutHistory:any=[];
  fullHis:any=[];

  head:any=true;
  checkedout:any=false;

  bet_result:any = 0;

  allBethistory:any=[]; allbet:any;
  showMores: boolean = false;showMoreHis:boolean=false;
  disabledHead:any=false;autodisabled:any=false; seedset:any=true;

  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;Det_risk:any;
  Det_segment:any; Det_seedstatus:any;withouthashserver:any;withouthashclient:any;

  ballValue:any = 1;

  fav_clr:any;like_clr:any;like_count:any;fav_count:any;
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
  hotKey:any=false;keyName:any='';
  constructor(private httpService:ConnectionService,private toastr: ToastrService,private route: Router, private renderer: Renderer2, private elementRef: ElementRef) { 
    if(!this.httpService.loggedIn()){
      this.head=false;
      this.checkedout=true;
    }
    this.httpService.postRequest('basic/Specificgame',{name:'plinko'},this.token).subscribe((resData:any)=>{
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

      this.getBalance(this.currency);
      this.bet_history(this.currency);
      this.allUser_history();
      this.gameInit();this.getgraph();
      this.chart = Highcharts.chart('container', this.chartOptions2)
      Events.on(engine, 'collisionActive', this.onBodyCollision)
  }

  conPass(data:any){
    this.head = data;
    this.token = localStorage.getItem("gAmE-t0KEN");
    this.payoutHistory = [];
    this.getBalance(this.currency);
    this.bet_history(this.currency);
    this.allUser_history();this.getgraph();
    this.chart = Highcharts.chart('container', this.chartOptions2)
  }

  chgplingo(chg:any){
    var data = {target:{value:chg}};
    this.lines = chg;
    this.changePlinkoLine(data);
  }

  changePlinkoLine(row:any) {
    // console.log(Bodies);
      this.lines = row.target.value;
      this.multipliers = getMultiplierByLines(row.target.value);
      /*const ballsToRemove: any = [];
      for (const bod of Body) {
          ballsToRemove.push(bod);
      }*/

      //Composite.remove(engine.world);
      World.clear(engine.world, false);
      const divElement = this.elementRef.nativeElement.querySelector('#plinko');
      this.renderer.setProperty(divElement, 'innerHTML', '');
      this.lastMultiplierX = worldConfig.width / 2 - (pinsConfig.pinGap / 2) * this.lines - pinsConfig.pinGap;
      this.gameInit();
  }

  gameInit()
  {
      engine.gravity.y = engineConfig.engineGravity;
      const element = document.getElementById('plinko');
      const render = Render.create({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          element: element!,
          bounds: {
            max: {
              y: worldConfig.height,
              x: worldConfig.width
            },
            min: {
              y: 0,
              x: 0
            }
          },
          options: {
            background: colorsConfig.background,
            hasBounds: true,
            width: worldConfig.width,
            height: worldConfig.height,
            wireframes: false
          },
          engine: engine
      });
      engine.timing.timeScale = 1;
      Engine.run(engine);
      const runner = Runner.create()
      Runner.run(runner, engine)
      Render.run(render)

      const pins: Body[] = [];
      for (let l = 0; l < this.lines; l++) {
        const linePins = pinsConfig.startPins + l
        const lineWidth = linePins * pinsConfig.pinGap
        for (let i = 0; i < linePins; i++) {
          const pinX =
            worldConfig.width / 2 -
            lineWidth / 2 +
            i * pinsConfig.pinGap +
            pinsConfig.pinGap / 2

          const pinY =
            worldConfig.width / this.lines + l * pinsConfig.pinGap + pinsConfig.pinGap;

          const pin = Bodies.circle(pinX, pinY, pinsConfig.pinSize, {
            label: `pin-${i}`,
            render: {
              fillStyle: '#F5DCFF'
            },
            isStatic: true
          })
          pins.push(pin)
        }
      }

      const leftWall = Bodies.rectangle(
        worldConfig.width / 3 - pinsConfig.pinSize * pinsConfig.pinGap - pinsConfig.pinGap,
        worldConfig.width / 2 - pinsConfig.pinSize,
        worldConfig.width * 2,
        40,
        {
          angle: 90,
          render: {
            visible: false
          },
          isStatic: true
        }
      )
      const rightWall = Bodies.rectangle(
        worldConfig.width -
          pinsConfig.pinSize * pinsConfig.pinGap -
          pinsConfig.pinGap -
          pinsConfig.pinGap / 2,
        worldConfig.width / 2 - pinsConfig.pinSize,
        worldConfig.width * 2,
        40,
        {
          angle: -90,
          render: {
            visible: false
          },
          isStatic: true
        }
      )

      const floor = Bodies.rectangle(0, worldConfig.width + 10, worldConfig.width * 10, 40, {
        label: 'block-1',
        render: {
          visible: false
        },
        isStatic: true
      })

      const multipliersBodies: any = []

      this.multipliers.forEach(multiplier => {
        const blockSize = 35 // height and width
        const multiplierBody = Bodies.rectangle(
          this.lastMultiplierX + 30,
          worldConfig.width / this.lines + this.lines * pinsConfig.pinGap + pinsConfig.pinGap,
          blockSize,
          blockSize,
          {
            label: multiplier.label,
            isStatic: true,
            render: {
              sprite: {
                xScale: 1.6,
                yScale: 1.3,
                texture: multiplier.img
              }
            }
          }
        )
        this.lastMultiplierX = multiplierBody.position.x
        multipliersBodies.push(multiplierBody)
      });

      let cmp = Composite.add(engine.world, [
        ...pins,
        ...multipliersBodies,
        leftWall,
        rightWall,
        floor
      ]);
  }

  addInGameBall() {
      if (this.gamesRunning > 15) return;
      this.gamesRunning = this.gamesRunning + 1;
  }

  removeInGameBall() {
    this.gamesRunning = this.gamesRunning - 1;
  }

  
  async addBall() {
      this.ballValue = this.ballValue + 1;
      this.addInGameBall()
      /*const ballSound = new Audio(ballAudio)
      ballSound.volume = 0.2
      ballSound.currentTime = 0
      ballSound.play()*/

      const minBallX =
        worldConfig.width / 2 - pinsConfig.pinSize * 3 + pinsConfig.pinGap
      const maxBallX =
        worldConfig.width / 2 -
        pinsConfig.pinSize * 3 -
        pinsConfig.pinGap +
        pinsConfig.pinGap / 2

      const ballX = this.random(minBallX, maxBallX)
      const ballColor = this.ballValue <= 0 ? colorsConfig.text : colorsConfig.purple
      const ball = Bodies.circle(ballX, 20, ballConfig.ballSize, {
          restitution: 1,
          friction: 0.6,
          label: `ball-${this.ballValue}`,
          id: new Date().getTime(),
          frictionAir: 0.05,
          collisionFilter: {
            group: -1
          },
          render: {
            fillStyle: ballColor
          },
          isStatic: false
      })
      // console.log(ball);
      let cmpp = Composite.add(engine.world, ball);
      //Composite.add(myComposite, ball);
      //World.add(engine.world, myComposite); 
      //World.clear(engine.world, false);
      //const myComposite = Composite.create();
      //Composite.add(myComposite, ball);
      /*Events.on(engine, 'collisionActive', this.onBodyCollision)
      Composite.clear(myComposite, false);*/
  }

  
  async onCollideWithMultiplier(ball: any, multiplier: any) {
    ball.collisionFilter.group = 2
    World.remove(engine.world, ball)
    this.removeInGameBall()
    const ballValue = ball.label.split('-')[1]
    const multiplierValue = +multiplier.label.split('-')[1];

    /*const multiplierSong = new Audio(getMultiplierSound(multiplierValue))
    multiplierSong.currentTime = 0
    multiplierSong.volume = 0.2
    multiplierSong.play()*/
    //setLastMultipliers(prev => [multiplierValue, prev[0], prev[1], prev[2]])

    if (+ballValue <= 0) return

    //const newBalance = +ballValue * multiplierValue
    //await incrementCurrentBalance(newBalance)
  }
  onBodyCollision = (event: IEventCollision<Engine>) => {
    const pairs = event.pairs
    for (const pair of pairs) {
      const { bodyA, bodyB } = pair
      if (bodyB.label.includes('ball') && bodyA.label.includes('block')) {
        bodyB.collisionFilter.group = 2
        World.remove(engine.world, bodyB)
        //this.removeInGameBall()
        const ballValue       = bodyB.label.split('-')[1]
        const multiplierValue = +bodyA.label.split('-')[1];
        this.bet_result       = multiplierValue;
        var data              = {bet_amount:this.bet_amount, currency:this.currency, bet_result:this.bet_result};
        this.bettingInitiate(data)

        
        //alert("Winning spot : "+ multiplierValue);
        //this.onCollideWithMultiplier(bodyB, bodyA);
        /*Composite.clear(myComposite, false);
        World.clear(engine.world, false);
        this.gameInit();*/
      }
    }
  }
  //multipliers = multipliers;

  random(min: number, max: number) {
    const random = Math.random();
    min = Math.round(min);
    max = Math.floor(max);
    return random * (max - min) + min;
  }

  CurrBal(curr:any){
    this.balance = curr.balance;
    this.currency = curr.currency;
    this.getMinMax(curr.currency);
  }

  async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  value: number = 0;
  options: Options = {floor: 0,ceil: 100};

  value1: number = 0;
  options1: Options = {floor: 0, ceil: 100};

  value3: number = 10;
  options3: Options = {floor: 8, ceil: 16};


  onSliderChange(value: any, type:any) {
    if(type == "auto") {
        this.auto_bet_amount = ((this.balance * value.value) / 100).toFixed(6);
    } else {
        this.bet_amount = ((this.balance * value.value) / 100).toFixed(6);
    }
  }

  getMinMax(currency:any) {
    this.httpService.postRequest('plinko/getminbetamount',{currency:this.currency}, this.token).subscribe((resData:any) => {
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

  bet_history(currency:any){
    this.httpService.postRequest('plinko/getBetHistory',{currency:this.currency}, this.token).subscribe((resData:any) => {
        if(resData.success == 1) {
            var hist = resData.history;
            this.bethistory = hist;
            //this.fullHis=hist;
            this.payoutHistory = hist.slice(0, 12);
        } else {
            this.bethistory = [];
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
    this.bet_amount = (this.bet_amount*1).toFixed(6)
  }

  async submitBet(){
    var auth = this.httpService.loggedIn();
    if(auth == true){
      if(this.bet_amount <= this.balance) {
        await this.addBall();
        
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
        var resData:any = await this.httpService.postRequestUpdated('plinko/saveBetHistory',data,this.token);
        if(resData.success == 1) {
            var hist = resData.history;
            this.bethistory = hist;
            if(resData.status=="loser"){this.toastr.error('Loss the game')
            }else{ this.toastr.success('Won the Game')}
            this.payoutHistory = hist.slice(0, 12);
            this.getBalance(this.currency);
            //this.showLess(); this.getgraph();
            this.bet_history(this.currency);
            this.allUser_history();this.getgraph()
        } else {
            this.toastr.error(resData.msg);
        }
    } else {
      this.head=false;
      this.toastr.error('please login to continue !');
    }
  }

  toggleShowMore() {
    this.showMores = !this.showMores;
    if (this.showMores) {
      this.allBethistory = this.allbet;
    } else {
      this.allBethistory = this.allbet.slice(0, 12);
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

  allUser_history(){
    this.httpService.postRequest('plinko/getAllBetHistory',{},this.token).subscribe((resData:any)=> {
      if(resData.success == 1) {
        this.allbet=resData.msg;
        this.allBethistory = resData.msg;  
      } else {
        this.allBethistory = {};
      }
    }) 
  }

  Seedsetting(){
  }

  copyInputMessage(data:any){
    navigator.clipboard.writeText(data)
    .then(() => this.toastr.info('Text copied to clipboard'))
  }

  getDetails(id:any){
    var obj={'_id':id,game:'plinko'};
    this.httpService.postRequest('plinko/getDetails',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.Det_id=resData.msg.bet_id;
        this.Det_name=resData.msg.username;
        this.Det_created_at=resData.msg.created_at;
        this.Det_betamount=resData.msg.bet_amount;
        this.Det_payout=resData.msg.payout;
        this.Det_pro_amt=resData.msg.pro_amt;
        this.Det_result=resData.msg.result;
        this.Det_status=resData.msg.status;
        /*
        this.Det_serverSeed=resData.msg.serverSeed;
        this.Det_clientSeed=resData.msg.clientSeed;
        this.Det_nounce=resData.msg.nounce;
        this.Det_risk=resData.msg.risk;
        this.Det_segment=resData.msg.segment;
        this.Det_seedstatus=resData.msg.seedstatus;
        this.withouthashserver=resData.msg.server;
        this.withouthashclient=resData.msg.client;*/
      }else{
        this.toastr.error(resData.msg,'');
      }
    })
  }
  async confirmedData(){
    await this.sleep(600);
    jQuery('#body').addClass('modal-open');
    jQuery('#body').attr('style','padding-right: 15px');
  }

  numberofbets:any = 0;
  auto_bet_amount:any = (100).toFixed(6);
  stop_init:any = 1;
  auto_bet:any = true;

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
      this.auto_bet_amount = (this.auto_bet_amount*1).toFixed(6);
  }

  async sumbit_auto_bet()
  {
      this.stop_init = 1;
      this.auto_bet = false;
      for(var i = 0; i <= this.numberofbets; i++) {
          
          if(this.auto_bet_amount <= this.balance) {
            this.bet_amount = (this.auto_bet_amount*1).toFixed(6);
            if(i == this.numberofbets || this.stop_init == 0) {
                this.auto_bet = true;
                return;
            }else{
              this.submitBet();
              this.getBalance(this.currency);
              await this.sleep(2000);
            }
          } else {
            this.toastr.error('Insufficient Balance');
            return;
          }  
      }
  }

  stop_auto_bet() {
      this.stop_init = 0;
      this.auto_bet = true;
  }


  userFav(name:any){
   var obj={'name':name}
    this.httpService.postRequest('plinko/userFav',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        let myArray:any = this.fav.split(',');
        if(resData.success==1 && resData.game!=""){
          if (!this.fav.includes(resData.game)) {
            myArray.push(resData.game);
            let updatedString = myArray.join(',');
            localStorage.setItem('gAmE-fav', updatedString);
          }
        }else{
          let index = myArray.indexOf('plinko');
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
    this.httpService.postRequest('plinko/userLiked',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        let myArray:any = this.liked.split(',');
        if(resData.success==1 && resData.game!=""){
          if (!this.liked.includes(resData.game)) {
            myArray.push(resData.game);
            let updatedString = myArray.join(',');
            localStorage.setItem('gAmE-like', updatedString);
          }
        }else{
          let index = myArray.indexOf('plinko');
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
    var obj={'name':'plinko'}
    this.httpService.postRequest('basic/getFavCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.fav_count=resData.msg
      }
    })
  }

  likeCount(){
    var obj={'name':'plinko'}
    this.httpService.postRequest('basic/getLikeCount',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.like_count=resData.msg
      }
    })
  }

  getfavNlike(){
    var game ="plinko";
    const favt = localStorage.getItem("gAmE-fav")?? "";
    const liked = localStorage.getItem("gAmE-like")?? "";
    if (favt.includes(game)) {this.fav_clr=1;}else{this.fav_clr=0;}
    if (liked.includes(game)) { this.like_clr=1;}else{this.like_clr=0;}
  }

  getgraph() {
    let data = {game:'plinko'};
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
    let data = {game:'plinko'};
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
