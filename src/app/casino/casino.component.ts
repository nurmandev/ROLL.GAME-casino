import { Component,ViewChild, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, interval, Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
declare var jQuery: any;

@Component({
  selector: 'app-casino',
  templateUrl: './casino.component.html',
  styleUrls: ['./casino.component.css']
})
export class CasinoComponent implements OnInit {
  token = localStorage.getItem("gAmE-t0KEN");head:any=true;favTable:any=[];secfavTable:any=[];thirdFavTable:any=[];
  fav = localStorage.getItem("gAmE-fav") ?? "";
  liked = localStorage.getItem("gAmE-like") ?? "";
  customOptions: OwlOptions = {loop: true,mouseDrag: true,touchDrag: true,pullDrag: false,autoplay:true,dots: false,
  autoplayTimeout:5000,
  autoplayHoverPause:true,
  margin: 10,
  navSpeed: 1000,
  navText: ['', ''],
  responsive: {0: {items: 2},600: {items: 3},740: {items: 3},940: {items: 7}},
  nav: true};

  customOptions1: OwlOptions = {loop: true,mouseDrag: true,touchDrag: true,pullDrag: false,autoplay:true,dots: false,
  autoplayTimeout:5000,
  autoplayHoverPause:true,
  margin: 10,
  navSpeed: 1000,
  navText: ['', ''],
  responsive: {0: {items: 2},600: {items: 3},740: {items: 3},940: {items: 3}},
  nav: true}

  balance:any = 0;currency:any = 'JB';
  constructor(private httpService:ConnectionService,private toastr: ToastrService,private route: Router) {
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
    this.getGamelist();
  }

  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
  }

  conPass(data:any){
    this.head = data;
  }

  CurrBal(curr:any){
    this.balance = curr.balance;
    this.currency = curr.currency;
  }

  getGamelist(){
    this.httpService.getUrl('basic/casinoGames').subscribe((resData:any) => {
      if(resData.success == 1) {
        this.favTable=resData.msg;
        const shuffle = (array: any[]) => {return array.slice().sort(() => Math.random() - 0.5);}
        this.secfavTable = shuffle(resData.msg); 
        this.thirdFavTable = shuffle(resData.msg); 
      } else {
        this.toastr.error(resData.msg,'')
      }
    })
  }

  url(name:any){
    if(name=="limbo"){
      this.route.navigate(['/limbo'])
    }else if(name=="dice"){
      this.route.navigate(['/dice'])
    }else if(name=="coinflip"){
      this.route.navigate(['/coinflip'])
    }else if(name=="wheel"){
      this.route.navigate(['/wheel'])
    }else if(name=="fortune"){
      this.route.navigate(['/ringoffortune'])
    }else if(name=="caveofplunder"){
      this.route.navigate(['/caveofplunder'])
    }else if(name=="keno"){
      this.route.navigate(['/keno'])
    }else if(name=="roulette"){
      this.route.navigate(['/roulette'])
    }else if(name=="mines"){
      this.route.navigate(['/mines'])
    }else if(name=="sword"){
      this.route.navigate(['/sword'])
    }else if(name=="bustabit"){
      this.route.navigate(['/bustabit'])
    }else{
      this.route.navigate(['/plinko'])
    }
  }
}