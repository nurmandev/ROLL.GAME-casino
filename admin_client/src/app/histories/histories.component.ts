import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-histories',
  templateUrl: './histories.component.html',
  styleUrls: ['./histories.component.scss']
})
export class HistoriesComponent implements OnInit {
  token = localStorage.getItem('Key');
  //limbo
  game1:any=false;limbo_table:any=[];p:any = 0;limit:any = 10;totalCount:any;page:any = 0;

  //dice
  game2:any=false;dice_table:any=[];p1:any = 0;limit1:any = 10;totalCount1:any;page1:any = 0;

  //coinflip
  game3:any=false;flip_table:any=[];p2:any = 0;limit2:any = 10;totalCount2:any;page2:any = 0;

  //wheel
  game4:any=false;wheel_table:any=[];p3:any = 0;limit3:any = 10;totalCount3:any;page3:any = 0;

  //fortune
  game5:any=false;fortune_table:any=[];p4:any = 0;limit4:any = 10;totalCount4:any;page4:any = 0;

  //plunder
  game6:any=false;plunder_table:any=[];p5:any = 0;limit5:any = 10;totalCount5:any;page5:any = 0;

  //keno
  game7:any=false;keno_table:any=[];p6:any = 0;limit6:any = 10;totalCount6:any;page6:any = 0;

  //roulette
  game8:any=false;roulette_table:any=[];p7:any = 0;limit7:any = 10;totalCount7:any;page7:any = 0;

  //mines
  game9:any=false;mines_table:any=[];p8:any = 0;limit8:any = 10;totalCount8:any;page8:any = 0;

  //sword
  game10:any=false;sword_table:any=[];p9:any = 0;limit9:any = 10;totalCount9:any;page9:any = 0;

  //crash
  game11:any=false;crash_table:any=[];p10:any = 0;limit10:any = 10;totalCount10:any;page10:any = 0;

  //plinko
  game12:any=false;plinko_table:any=[];p11:any = 0;limit11:any = 10;totalCount11:any;page11:any = 0;
  
  constructor(private conn: ConnectionService, private alert: ToastrService, private route: Router, private actRoute: ActivatedRoute) { 
    if (actRoute.snapshot.url[0].path =='limbo') {
      this.game1=true;
    }else if(actRoute.snapshot.url[0].path =='dice'){
      this.game2=true;
    }else if(actRoute.snapshot.url[0].path =='coinflip'){
      this.game3=true;
    }else if(actRoute.snapshot.url[0].path =='wheel'){
      this.game4=true;
    }else if(actRoute.snapshot.url[0].path =='fortune'){
      this.game5=true;
    }else if(actRoute.snapshot.url[0].path =='caveofplunder'){
      this.game6=true;
    }else if(actRoute.snapshot.url[0].path =='keno'){
      this.game7=true;
    }else if(actRoute.snapshot.url[0].path =='roulette'){
      this.game8=true;
    }else if(actRoute.snapshot.url[0].path =='mines'){
      this.game9=true;
    }else if(actRoute.snapshot.url[0].path =='sword'){
      this.game10=true;
    }else if(actRoute.snapshot.url[0].path =='crash'){
      this.game11=true;
    }else if(actRoute.snapshot.url[0].path =='plinko'){
      this.game12=true;

    }
  }

  ngOnInit(): void {
    this.limbo_history();
    this.dice_history();
    this.flip_history();
    this.wheel_history();
    this.fortune_history();
    this.cave_history();
    this.keno_history();
    this.roulette_history();
    this.mines_history();
    this.sword_history();
    this.plinko_history();
    this.crash_history();
  }

  paginate(param:any): void{
    switch(param){
      case "prev":
      this.p = this.p - 1;
      break;
      case "next":
      this.p = this.p + 1;
      break;
      case "first":
      this.p = 0;
      break;
      case "last":
      this.p = Math.floor(this.totalCount / this.limit);
      break
      default:
      this.p = this.p + 1;
      break;
    }
    this.limbo_history();
  }


  limbo_history(){
    if(this.game1==true){
      let params = {
        sortOrder: 'desc',
        sortActive: '_id',
        pageIndex: this.p,
        pageSize: this.limit,
      }
      this.conn.loadData('history/getLimbohistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.limbo_table=resData.data;
          this.totalCount = resData.userCount;
          this.page = Math.floor(this.totalCount / this.limit);
        } else {
          this.limbo_table = [];
        }
      })  
    }
  }

  paginate1(param:any): void{
    switch(param){
      case "prev":
      this.p1 = this.p1 - 1;
      break;
      case "next":
      this.p1 = this.p1 + 1;
      break;
      case "first":
      this.p1 = 0;
      break;
      case "last":
      this.p1 = Math.floor(this.totalCount1 / this.limit1);
      break
      default:
      this.p1 = this.p1 + 1;
      break;
    }
    this.dice_history();
  }


  dice_history(){
    if(this.game2==true){
      let params = { sortOrder: 'desc',sortActive: '_id',pageIndex: this.p1,pageSize: this.limit1 }
      this.conn.loadData('history/getDicehistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.dice_table=resData.data;
          this.totalCount1 = resData.userCount;
          this.page1 = Math.floor(this.totalCount1 / this.limit1);
        } else {
          this.dice_table = [];
        } 
      })  
    }
  }

  paginate2(param:any): void{
    switch(param){
      case "prev":
      this.p2 = this.p2 - 1;
      break;
      case "next":
      this.p2 = this.p2 + 1;
      break;
      case "first":
      this.p2 = 0;
      break;
      case "last":
      this.p2 = Math.floor(this.totalCount2 / this.limit2);
      break
      default:
      this.p2 = this.p2 + 1;
      break;
    }
    this.flip_history();
  }

  flip_history(){
    if(this.game3==true){
      let params = { sortOrder: 'desc',sortActive: '_id',pageIndex: this.p2,pageSize: this.limit2 }
      this.conn.loadData('history/getfliphistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.flip_table=resData.data;
          this.totalCount2 = resData.userCount;
          this.page2 = Math.floor(this.totalCount2 / this.limit2);
        } else {
          this.flip_table = [];
        }
      })  
    }
  }

  paginate3(param:any): void{
    switch(param){
      case "prev":
      this.p3 = this.p3 - 1;
      break;
      case "next":
      this.p3 = this.p3 + 1;
      break;
      case "first":
      this.p3 = 0;
      break;
      case "last":
      this.p3 = Math.floor(this.totalCount3 / this.limit3);
      break
      default:
      this.p3 = this.p3 + 1;
      break;
    }
    this.wheel_history();
  }

  wheel_history(){
    if(this.game4==true){
      let params = { sortOrder: 'desc',sortActive: '_id',pageIndex: this.p3,pageSize: this.limit3 }
      this.conn.loadData('history/getwheelhistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.wheel_table = resData.data;
          this.totalCount3 = resData.userCount;
          this.page3 = Math.floor(this.totalCount3 / this.limit3);
        } else {
          this.wheel_table = [];
        }
      })  
    }
  }

  paginate4(param:any): void{
    switch(param){
      case "prev":
      this.p4 = this.p4 - 1;
      break;
      case "next":
      this.p4 = this.p4 + 1;
      break;
      case "first":
      this.p4 = 0;
      break;
      case "last":
      this.p4 = Math.floor(this.totalCount4 / this.limit4);
      break
      default:
      this.p4 = this.p4 + 1;
      break;
    }
    this.fortune_history();
  }

  fortune_history(){
    if(this.game5==true){
      let params = { sortOrder: 'desc',sortActive: '_id',pageIndex: this.p4,pageSize: this.limit4 } 
      this.conn.loadData('history/getfortunehistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.fortune_table = resData.data;
          this.totalCount4 = resData.userCount;
          this.page4 = Math.floor(this.totalCount4 / this.limit4);
        } else {
          this.fortune_table = [];
        }
      })  
    }
  }

  paginate5(param:any): void{
    switch(param){
      case "prev":
      this.p5 = this.p5 - 1;
      break;
      case "next":
      this.p5 = this.p5 + 1;
      break;
      case "first":
      this.p5 = 0;
      break;
      case "last":
      this.p5 = Math.floor(this.totalCount5 / this.limit5);
      break
      default:
      this.p5 = this.p5 + 1;
      break;
    }
    this.cave_history();
  }

  cave_history(){
    if(this.game6==true){
      let params = { sortOrder: 'desc',sortActive: '_id',pageIndex: this.p5,pageSize: this.limit5 } 
      this.conn.loadData('history/getcavehistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.plunder_table= resData.data;
          this.totalCount5= resData.userCount;
          this.page4 = Math.floor(this.totalCount5 / this.limit5);
        } else {
          this.plunder_table = [];
        }
      })  
    }
  }

  paginate6(param:any): void{
    switch(param){
      case "prev":
      this.p6 = this.p6 - 1;
      break;
      case "next":
      this.p6 = this.p6 + 1;
      break;
      case "first":
      this.p6 = 0;
      break;
      case "last":
      this.p6 = Math.floor(this.totalCount6 / this.limit6);
      break
      default:
      this.p6 = this.p6 + 1;
      break;
    }
    this.keno_history();
  }

  keno_history(){
    if(this.game7==true){
      let params = { sortOrder: 'desc',sortActive: '_id',pageIndex: this.p6,pageSize: this.limit6 } 
      this.conn.loadData('history/getkenohistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.keno_table = resData.data;
          this.totalCount6= resData.userCount;
          this.page6= Math.floor(this.totalCount6 / this.limit6);
        } else {
          this.keno_table = [];
        }
      })  
    }
  }


  roulette_history(){
    if(this.game8==true){
    let params = {sortOrder: 'desc',sortActive: '_id',pageIndex: this.p7,pageSize: this.limit7,}
      this.conn.loadData('history/getroulettehistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.roulette_table = resData.data;
          this.totalCount7 = resData.userCount;
          this.page7 = Math.floor(this.totalCount7 / this.limit7);
        } else {
          this.roulette_table = [];
        }
      })  
    }
  }

  paginate7(param:any): void{
    switch(param){
      case "prev":
      this.p7 = this.p7 - 1;
      break;
      case "next":
      this.p7 = this.p7 + 1;
      break;
      case "first":
      this.p7 = 0;
      break;
      case "last":
      this.p7 = Math.floor(this.totalCount7 / this.limit7);
      break
      default:
      this.p7 = this.p7 + 1;
      break;
    }
    this.roulette_history();
  }

  mines_history(){
    if(this.game9==true){
      let params = {sortOrder: 'desc',sortActive: '_id',pageIndex: this.p8,pageSize: this.limit8}
      this.conn.loadData('history/getminehistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.mines_table = resData.data;
          this.totalCount8 = resData.userCount;
          this.page8 = Math.floor(this.totalCount8 / this.limit8);
        } else {
          this.mines_table = [];
        }
      })  
    }
  }

  paginate8(param:any): void{
    switch(param){
      case "prev":
      this.p8 = this.p8 - 1;
      break;
      case "next":
      this.p8 = this.p8 + 1;
      break;
      case "first":
      this.p8 = 0;
      break;
      case "last":
      this.p8 = Math.floor(this.totalCount8 / this.limit8);
      break
      default:
      this.p8 = this.p8 + 1;
      break;
    }
    this.mines_history();
  }
  
  sword_history(){
    if(this.game10==true){
      let params = {sortOrder: 'desc',sortActive: '_id',pageIndex: this.p9,pageSize: this.limit9}
      this.conn.loadData('history/getswordhistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.sword_table = resData.data;
          this.totalCount9 = resData.userCount;
          this.page9 = Math.floor(this.totalCount9 / this.limit9);
        } else {
          this.sword_table = [];
        }
      })  
    }
  }

  paginate9(param:any): void{
    switch(param){
      case "prev":
      this.p9 = this.p9 - 1;
      break;
      case "next":
      this.p9 = this.p9 + 1;
      break;
      case "first":
      this.p9 = 0;
      break;
      case "last":
      this.p9 = Math.floor(this.totalCount9 / this.limit9);
      break
      default:
      this.p9 = this.p9 + 1;
      break;
    }
    this.sword_history();
  }

  crash_history(){
    if(this.game11==true){
      let params = {sortOrder: 'desc',sortActive: '_id',pageIndex: this.p9,pageSize: this.limit9}
      this.conn.loadData('history/getcrashhistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.crash_table = resData.data;
          this.totalCount9 = resData.userCount;
          this.page9 = Math.floor(this.totalCount9 / this.limit9);
        } else {
          this.crash_table= [];
        }
      })  
    }
  }

  paginate10(param:any): void{
    switch(param){
      case "prev":
      this.p10 = this.p10 - 1;
      break;
      case "next":
      this.p10 = this.p10 + 1;
      break;
      case "first":
      this.p10 = 0;
      break;
      case "last":
      this.p10 = Math.floor(this.totalCount10 / this.limit10);
      break
      default:
      this.p10 = this.p10 + 1;
      break;
    }
    this.crash_history();
  }

  plinko_history(){
    if(this.game12==true){
      let params = {sortOrder: 'desc',sortActive: '_id',pageIndex: this.p11,pageSize: this.limit11}
      this.conn.loadData('history/getplinkohistory',params).subscribe((resData:any)=>{
        if(resData.success == 1) {
          this.plinko_table = resData.data;
          this.totalCount11 = resData.userCount;
          this.page11 = Math.floor(this.totalCount11 / this.limit11);
        } else {
          this.plinko_table= [];
        }
      })  
    }
  }

  paginate11(param:any): void{
    switch(param){
      case "prev":
      this.p11 = this.p11 - 1;
      break;
      case "next":
      this.p11 = this.p11 + 1;
      break;
      case "first":
      this.p11 = 0;
      break;
      case "last":
      this.p11 = Math.floor(this.totalCount11 / this.limit11);
      break
      default:
      this.p11 = this.p11 + 1;
      break;
    }
    this.plinko_history();
  }

}
