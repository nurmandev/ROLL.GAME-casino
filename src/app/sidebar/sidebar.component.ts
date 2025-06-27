import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { ModalServiceService } from '../modal.service.service';
import { ToastrService } from 'ngx-toastr';
import { NgxWheelComponent, TextAlignment, TextOrientation } from 'ngx-wheel';

declare var jQuery: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  list:any = [
    {curr: 'RGC', amount:0.10000, id:1},{curr: 'BNB', amount:0.00100, id:2},
    {curr: 'BUSD', amount:0.50000, id:3},{curr: 'RGC', amount:0.00100, id:4},
    {curr: 'BUSD', amount:1.00000, id:5},{curr: 'RGC', amount:0.50000, id:6},
    {curr: 'BNB', amount:0.00500, id:7},{curr: 'BUSD', amount:1.50000, id:8},
    
    {curr: 'RGC', amount:0.00100, id:9},{curr: 'BUSD', amount:0.50000, id:10},
    {curr: 'RGC', amount:0.50000, id:11},{curr: 'BNB', amount:0.00100, id:12},
    {curr: 'RGC', amount:1.50000, id:13},{curr: 'BUSD', amount:1.00000, id:14},
    {curr: 'RGC', amount:1.00000, id:15},{curr: 'BNB', amount:0.00500, id:16},
  ]
  WheelStyle:any={};
  stopAngel:any = []; 
  bonusVal:any = [];
  slices:any = this.list.length;
  sliceDeg:any = 360/this.slices;
  deg:any = 260; speed:any = 5;
  slowDownRand:any = 0;
  canvas:any = '';
  ctx :any= ''; width:any = 0; center:any = 0;
  isStopped:any = false; lock:any = false; assignData:any = [];

  colors:any; items: any=[];
  textOrientation: TextOrientation = TextOrientation.HORIZONTAL;
  textAlignment: TextAlignment = TextAlignment.OUTER;
  token = localStorage.getItem('gAmE-t0KEN')
  disabled:any=false;gameDis:any; idToLandOn: any;
  bronzeVIP:any=[]; silverVIP:any=[]; goldVIP:any=[]; platinamIVIP:any=[]; platinamIIVIP:any=[]; DiamondIVIP:any=[]; DiamondIIVIP:any=[]; DiamondIIIVIP:any=[];
  vipData:any={}; type:any="luckSpin"; btnName:any = 'Lucky spin 1'; spinHistory:any = [];
  p:any = 0;limit:any = 4;totalCount:any;page:any = 0; SpinData:any={};
  lockedData:any={}; userwages:any=0;

  constructor(private route: Router,private httpService:ConnectionService,private toastr: ToastrService, private modalService: ModalServiceService) {
    if(!this.httpService.loggedIn()){
      this.disabled=true;
      // this.route.navigate(['']);
    }
  }
  
  ngOnInit(): void {
    jQuery(".sidelink").click(function(){
      jQuery("body").addclass("ss");
      jQuery("body").removeClass("topshow");
    });

    jQuery(".hoverlink").hover(function(){
        jQuery(".hovermenu").addClass("active");  //Add the active class to the area is hovered
    }, function () {
          jQuery(".hovermenu").removeClass("active");
    });

    jQuery(".hoverlink").hover(function(){
      jQuery(".sidemenu").addClass("begin");  //Add the active class to the area is hovered
    }, function () {
      jQuery(".sidemenu").removeClass("begin");
    });
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });

    this.gameStats();

    this.modalService.showModal4$.subscribe(() => {
      this.loginSet();
    });
  }

  navigate(){
    this.route.navigate(['./']); 
  }

  openModel(){
    if(window.innerWidth < 850){
      jQuery("body").removeClass("renav");
    }
    this.modalService.openModal3();
  }

  openModel1(){
    this.token = localStorage.getItem('gAmE-t0KEN');
    this.httpService.getRequest('basic/getVip', this.token).subscribe((resData:any) => {
      if(resData.success == 1){
        this.vipData = resData.data;
        jQuery("#staticBackdrop").modal("show");
      }else{
        this.toastr.error('Invalid request','');
      }
    })
  }

  gameStats(){
    this.httpService.getUrl('basic/gameStatus').subscribe((resData:any) => {
      if(resData.success==1){
        this.gameDis=resData.msg;
      }else{
        this.toastr.error('Invalid request','')
      }
    })
  }

  loginSet(){
    if(this.httpService.loggedIn()){
      this.disabled=false;
    }else{
      this.disabled=true;
    }
  }

  walletModal() {
    if(window.innerWidth < 850){
      jQuery("body").removeClass("renav");
    }
    if(this.disabled){
      this.modalService.openModal1();
    }else{
      this.modalService.openModal();
    }
  }

  sbRest(){
    if(window.innerWidth < 850){
      jQuery("body").removeClass("renav");
    }
  }

  viewVip(){
    this.httpService.getUrl('basic/getvip_lvl').subscribe((resData:any) => {
      if(resData.success==1){
        this.bronzeVIP = resData.bronze;
        this.silverVIP = resData.silver;
        this.goldVIP = resData.gold;
        this.platinamIVIP = resData.platinam1;
        this.platinamIIVIP = resData.platinam2;
        this.DiamondIVIP = resData.diamond1;
        this.DiamondIIVIP = resData.diamond2;
        this.DiamondIIIVIP = resData.diamond3;
      }else{
        this.toastr.error('Invalid request','');
      }
    })
  }

  async sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }
  
  async confirmedData(){
    await this.sleep(600);
    jQuery('#body').addClass('modal-open');
    jQuery('#body').attr('style','padding-right: 15px');
  }

  spinNow() {
    if(!this.httpService.loggedIn()){
      jQuery("#examplespin").modal("hide");
      this.modalService.openModal1();
    }else{
      let obj = {type: this.type};
      this.token = localStorage.getItem('gAmE-t0KEN');
      this.httpService.postRequest('basic/luckwheel', obj, this.token).subscribe((resData:any) => {
        if(resData.success == 1){
          var Lucknum = resData.LuckNum
          var spin = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
          var random = Lucknum;
          if(spin[random] == 1){ var value = (3600);
          }else if(spin[random] == 2){ var value = (3600+337.5);
          }else if(spin[random] == 3){ var value = (3600+315);
          }else if(spin[random] == 4){ var value = (3600+292.5);
          }else if(spin[random] == 5){ var value = (3600+270);
          }else if(spin[random] == 6){ var value = (3600+247.5);
          }else if(spin[random] == 7){ var value = (3600+225);
          }else if(spin[random] == 8){ var value = (3600+202.5);
          }else if(spin[random] == 9){ var value = (3600+180);
          }else if(spin[random] == 10){ var value = (3600+157.5);
          }else if(spin[random] == 11){ var value = (3600+135);
          }else if(spin[random] == 12){ var value = (3600+112.5);
          }else if(spin[random] == 13){ var value = (3600+90);
          }else if(spin[random] == 14){ var value = (3600+67.5);
          }else if(spin[random] == 15){ var value = (3600+45);
          }else if(spin[random] == 16){ var value = (3600+22.5);
          }

          this.WheelStyle = {'animation': 'ballRotate 1s linear infinite'};
          setTimeout(()=>{
            this.WheelStyle = {'animation': 'ballRotate 3s linear'};
          }, 3000);
          setTimeout(()=>{
            this.WheelStyle = {'transform': 'rotate('+value+'deg)'};
            let index = this.list.findIndex((rank:any) => rank.id == Lucknum);
            this.SpinData = this.list[index];
          }, 3000);
          setTimeout(()=>{
            jQuery("#spinresult").modal("show");
            jQuery("#examplespin").modal("hide");
          }, 4000);
        }else{
          this.toastr.error(resData.msg);
        }
      })
      /*let obj = {type: this.type};
      this.token = localStorage.getItem('gAmE-t0KEN');
      this.httpService.postRequest('basic/luckwheel', obj, this.token).subscribe((resData:any) => {
        if(resData.success == 1){
          var Lucknum = resData.LuckNum
          var ele:any = document.getElementById("canvasspin");
          ele.classList.add("spin-wheel");
          setTimeout(()=> {
            ele.classList.remove("spin-wheel");
            var degData = this.assignData.reverse();
            let index = this.list.findIndex((rank:any) => rank.id == Lucknum);
            this.deg= degData[index];
            this.SpinData = this.list[index];
            this.drawImg();
            this.spinData();
            jQuery("#spinresult").modal("show");
            jQuery("#examplespin").modal("hide");
          }, 3000);
        }else{
          this.toastr.error(resData.msg);
        }
      })*/
    }
  }

  spinData(){
    if(!this.httpService.loggedIn()){
      (<HTMLInputElement>document.getElementById("spinvalue")).textContent = 'Lucky spin 1';
    }else{
      this.token = localStorage.getItem('gAmE-t0KEN');
      this.httpService.getRequest('basic/spinData', this.token).subscribe((resData:any) => {
        if(resData.success == 1){
          const d = new Date(resData.spinData);
          d.setDate(d.getDate() + 1);
          var countDownDate = new Date(d).getTime();
          var x = setInterval(function() {
            var now = new Date().getTime();
            var distance = countDownDate - now;
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            (<HTMLInputElement>document.getElementById("spinvalue")).textContent = 'Next lucky spin: '+ hours + "h "+ minutes + "m " + seconds + "s ";
            if (distance < 0) {
              (<HTMLInputElement>document.getElementById("spinvalue")).textContent = 'Lucky spin 1';
              clearInterval(x);
            }
          }, 1000);
        }else{
          this.toastr.error(resData.msg);
          (<HTMLInputElement>document.getElementById("spinvalue")).textContent = 'Lucky spin 1';
        }
      })
    }
  }

  spinHis(){
    this.httpService.getUrl('basic/spinHis').subscribe((resData:any) => {
      if(resData.success == 1){
        this.spinHistory = resData.history;
      }else{
        this.toastr.error(resData.msg);
      }
    })
  }

  bonusData(){
    var paramsdata = {
      pageIndex: this.p,
      pageSize: this.limit,
    }
    this.httpService.postRequest('basic/bonus', paramsdata, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.totalCount = resData.BonusCount;
        this.page = Math.floor(this.totalCount / this.limit);
        this.bonusVal = resData.BonusData;
      }else{
        this.toastr.error("somthing wents wrong !");
      }
    });
  }

  paginate(param:any){
    switch(param){
      case "prev":
      this.p = this.p - 1;
      break;
      case "next":
      this.p = this.p + 1;
      break;
      default:
      this.p = this.p + 1;
      break;
    }
    this.bonusData();
  }

  affilrout(){
    if(this.httpService.loggedIn()){
      this.route.navigate(['/affiliate']);
    }
  }

  getlocked(curr:any){
    var data = {curr: curr};
    this.httpService.postRequest('basic/getlockedamt', data, this.token).subscribe((resDate: any) => {
      if(resDate.success == 1){
        this.lockedData = resDate.locked;
      }else{
        this.toastr.error(resDate.msg);
      }
    });
  }

  unlockbal(curr:any){
    var data = {curr: curr, wages: this.userwages};
    this.httpService.postRequest('basic/unlockamt', data, this.token).subscribe((resDate: any) => {
      if(resDate.success == 1){
        this.toastr.success(resDate.msg);
        this.getlocked(curr);
      }else{
        this.toastr.error(resDate.msg);
      }
    });
  }

  getwager(){
    this.httpService.getRequest('basic/getUsrinfo', this.token).subscribe((resData:any)=>{
      if(resData.success == 1){
        this.userwages = resData.wages;
      }else{
        this.toastr.error(resData.msg);
      }
    })
  }
}