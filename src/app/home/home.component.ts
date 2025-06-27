import { Component, OnInit, Input, NgModule, ViewChild, ChangeDetectorRef, HostListener, ElementRef, OnDestroy ,EventEmitter ,Output} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
declare var jQuery: any;
import { ModalServiceService } from '../modal.service.service';
import { Socket } from 'ngx-socket-io';
import { BackendUrl } from '../../backendurl';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
head:any=true; username:any='';
token = localStorage.getItem("gAmE-t0KEN");
socket:any;backUrl:any = BackendUrl;
loginToken:any = "";lower = true; upper = true; len = true; num = true; spec = true;
  usrmail = false; cntry :any=[]; supportData:any={country:"India"};
  refId = ""; signLoader = false; cntries: any;
  loader:any = false; pwd : any;
  isConnected:any = false;  
  currency1:any = 'JB';LogConn:any = false;
  @Output() ConnEvent = new EventEmitter();
customOptions1: OwlOptions = {loop: true,mouseDrag: true,touchDrag: true,pullDrag: false,autoplay:true,dots: true,
  autoplayTimeout:5000,
  autoplayHoverPause:true,

  margin: 10,
  navSpeed: 1000,

  navText: ['', ''],
  responsive: {0: {items: 2},600: {items: 3},740: {items: 3},940: {items: 3}},
  nav: false}

  customOptions3: OwlOptions = {loop: true,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: false,
  autoplay:true,
  dots: false,
  autoplayTimeout:5000,
  autoplayHoverPause:true,
  margin: 10,
  navSpeed: 1000,
  navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
  responsive: {0: {items: 2},600: {items: 2},740: {items: 5},940: {items: 7}},
  nav: true
}

  adm_mail:any;adm_facebook:any;adm_insta:any;adm_twitter:any;adm_skype:any;adm_telegram:any;
  BigWinUser:any=[]; GetGameRes:any=[]; seedset:any=true

    //det
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;Det_risk:any;
  Det_segment:any; Det_seedstatus:any;withouthashserver:any;withouthashclient:any; Det_img:any='';
  Det_url:any='';
  //coinflip
  Det_series:any=1; Det_coin_result:any=[{bet_result: "head"}];
  //keno
  kenobetsdig:any = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
  //mines
  tiles:any = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
  //fortune
  Det_initialbet:any; Det_gameResult:any;
  //roulette
  resultcoins:any={};

  triggerSocket(key:any) {
    return this.websocket.fromEvent<any>(key).pipe(map(data => data));
  } 

  constructor(private httpService: ConnectionService, private toastr: ToastrService, private actRoute: ActivatedRoute, private route: Router,private modalService: ModalServiceService, private websocket: Socket) {
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
    this.siteSetting();
    this.RecentWin();
  }
  RecentWin(){
    this.httpService.getUrl('basic/getBigWin').subscribe((resdata: any) => {
      this.BigWinUser = resdata.BigWin;
    })
  }

  siteSetting(){
    this.httpService.getUrl('basic/getsiteInfo').subscribe((resdata: any) => {
      if(resdata.success==1){
        this.adm_mail=resdata.msg.contact_mail;
        this.adm_insta=resdata.msg.instagram;
        this.adm_twitter=resdata.msg.telegram;
        this.adm_skype=resdata.msg.skype;
        this.adm_facebook=resdata.msg.facebook;
        this.adm_telegram=resdata.msg.telegram;
      }
    })
  }

  CurrBal(name:any){
    this.username = name;
  }

  openModal() {
    if(!this.head){
      this.modalService.openModal1();
    }else{
      this.modalService.openModal();
    }
  }

  openModal1() {
    this.modalService.openModal1();  
  }


  openModal2() {
    this.modalService.openModal2();  
  }

  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    jQuery(".infoicon").click(function(){
      jQuery('.infoicon').parent().toggleClass('sub-show');
    });
    this.triggerSocket('getgameData').subscribe((res: any) => {
      this.GetGameRes.unshift(res[0]);
    });
  }

  conPass(data:any){
    this.head = data;
  }

  connectionPass(){
    this.ConnEvent.emit(this.isConnected);
  }

  typePwd(pwd:any) {
    if (pwd != null && pwd != undefined && pwd != "") {
      this.pwd = pwd; this.lower = true; this.upper = true; this.len = true; this.num = true; this.spec = true;
      if (pwd.length < 8) { this.len = false; return; }
      if (pwd.match(/[a-z]/g) == null) { this.lower = false; return; }
      if (pwd.match(/[A-Z]/g) == null) { this.upper = false; return; }
      if (pwd.match(/[0-9]/g) == null) { this.num = false; return; }
      if (pwd.match(/\W|_/g) == null) { this.spec = false; return; }
    }
  }

  executeAction(type:any, form:NgForm){
    if(type == "login"){
      var data = form.value;
      if(data.email !== undefined && data.email !== null && data.email !== ""){
        if(data.password !== undefined && data.password !== null && data.password !== ""){
          this.loginProcess(form);
        }else{
          this.toastr.error('Invalid Password', '', {timeOut: 2000});
        }
      }else{
        this.toastr.error('Invalid Email ', '', {timeOut: 2000});
      }
    }else if(type == "signup"){
      if (!this.usrmail) {
        this.toastr.error("Email already exists", '', {timeOut: 2000}); return;
      }
      if(this.lower && this.upper && this.len && this.num && this.spec){}else{
        this.toastr.error("password not valid", '', {timeOut: 2000}); return;
      }
      this.registerForm(form);
    }
  }

  loginProcess(form:NgForm){
    var data = form.value;
    this.httpService.postUrl('basic/login', data).subscribe((res: any) => {
      if(res.success == 1){
        localStorage.setItem('gAmE-t0KEN', res.token);
        localStorage.setItem('TToken', res.ttoken);

        localStorage.setItem("gAmE-fav",res.favourite);
        localStorage.setItem("gAmE-like",res.liked); 

        this.isConnected = true;
        this.connectionPass();
        this.toastr.success('Login Success!', '', {timeOut: 2000});
      }else if(res.success == 2){
        localStorage.setItem('Tfa', res.ttoken);
        this.toastr.success('Please login with Authentication code', '', {timeOut: 2000});
      }else{
        this.toastr.success(res.msg, '', {timeOut: 2000});
      }
      form.resetForm();
    });
  }

  registerForm(form:NgForm){
    var data = form.value;
    data.refer =this.refId;
    this.httpService.postUrl('basic/signup', data).subscribe((res: any) => {
      if(res.success == 1){
        this.toastr.success(res.msg, '', {timeOut: 2000});
        form.resetForm();
      }else{
        this.toastr.error(res.msg, '', {timeOut: 2000});
      }
    })
  }

  recentDetails(gameName:any,gameId:any){
    jQuery('.resultcoin').removeClass('chipresultselect');
    jQuery('.resultcoin').removeClass('resultActiveClass');
    var data = { name : gameName , gameid :gameId }
    this.httpService.postUrl('basic/bigwinDetail', data).subscribe((res: any) => {
      if(res.success==1){
        this.Det_id=res.data._id;
        this.Det_name=gameName;
        this.Det_created_at=res.data.created_at;
        this.Det_betamount=res.data.bet_amount;
        this.Det_payout=res.data.payout;
        this.Det_pro_amt=res.data.win_lose_amt;
        this.Det_serverSeed=res.data.server_seed;
        this.Det_clientSeed=res.data.client_seed;
        this.Det_nounce=res.data.nonce;
        this.Det_status=res.data.status;
        this.Det_risk=res.data.risk;
        this.Det_segment=res.data.segment;
        this.Det_seedstatus=res.data.seed_status;
        // this.Det_result=res.data.result;
        if(gameName == 'limbo'){
          this.Det_img = '/assets/images/limbo-g.png'
          this.Det_url='/limbo';
          this.Det_result=res.data.bet_result;
        }else if(gameName == 'dice'){
          this.Det_img = '/assets/images/dice-g.png';
          this.Det_url='/dice';
          this.Det_result=res.data.bet_result;;
        }else if(gameName == 'coinflip'){
          this.Det_img = '/assets/images/coinflip.png';
          this.Det_url='/coinflip';
          this.Det_series=res.data.bet_result.length; 
          this.Det_coin_result=res.data.bet_result;
        }else if(gameName == 'keno'){
          this.Det_img = '/assets/images/keno-g.png';
          this.Det_url='/keno';
          setTimeout(() => {
            jQuery('.kenohis').removeClass('selected');
            jQuery('.kenohis').removeClass('kenoselect selected');
            jQuery('.kenohis').removeClass('unselected');
            var userbet = res.data.bet_user;
            for (let i = 0; i < userbet.length; i++) {
              jQuery('#'+userbet[i]+"res").addClass('selected');
              var winbet = res.data.bet_matched; 
              for (let j = 0; j < winbet.length; j++) {
                jQuery('#'+winbet[j]+"res").addClass('kenoselect selected');
                var lossbet = res.data.bet_notmatch; 
                for (let k = 0; k < lossbet.length; k++) {
                  jQuery('#'+lossbet[k]+"res").addClass('unselected');
                }
              }
            }
          },3);
        }else if(gameName == 'mines'){
          this.Det_img = '/assets/images/mines-g.png';
          this.Det_url='/mines';
          setTimeout(() => {
            var userbet = res.data.bet_result;
            jQuery('.diamondmini').removeClass('selected');
            jQuery('.diamondmini').removeClass('selected mines');
            for (let i = 0; i < userbet.length; i++) {
              if(userbet[i].bet_result=="diamond"){
                jQuery('#'+userbet[i].userchoice+"res").addClass('selected');
              }else if(userbet[i].bet_result=="mines"){
                jQuery('#'+userbet[i].userchoice+"res").addClass('selected mines');
              }
            }
          },3);
        }else if(gameName == 'wheel'){
          this.Det_img = '/assets/images/wheel-g.png';
          this.Det_url='/wheel';
        }else if(gameName == 'wheel-of-fortune'){
          this.Det_img = '/assets/images/fortune.png';
          this.Det_url='/ringoffortune';
          this.Det_initialbet=res.data.initial_bet;
          this.Det_gameResult=res.data.game_result;
        }else if(gameName == 'roulette'){
          this.Det_img = '/assets/images/roulette.png';
          this.Det_url='/roulette';
          setTimeout(() => {
            this.Det_result=res.data.bet_result;
            var betnotmat = res.data.userBet;
            jQuery('#res'+res.data.bet_result).addClass('resultActiveClass');
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
          },3);
        }else if(gameName == 'sword'){
          this.Det_img = '/assets/images/sword-g.png';
          this.Det_url='/sword';
        }else if(gameName == 'caveofplunder'){
          this.Det_img = '/assets/images/caveofplunder.png';
          this.Det_url='/caveofplunder';
          this.Det_result=res.data.bet_result;
        }else if(gameName == 'plinko'){
          this.Det_img = '/assets/images/plinko.png';
          this.Det_url='/plinko';
          this.Det_result=res.data.bet_result;
        }
      }else{
        this.toastr.error('Connection Error ','Error')
      }
    })
    
  }
  //textcopy
  copyInputMessage(data:any){
    navigator.clipboard.writeText(data)
    .then(() => this.toastr.error('Text copied to clipboard'))
  }
}
