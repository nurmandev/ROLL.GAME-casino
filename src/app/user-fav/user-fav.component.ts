import { Component,ViewChild, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, interval, Subscription } from 'rxjs';


declare var jQuery: any;
@Component({
  selector: 'app-user-fav',
  templateUrl: './user-fav.component.html',
  styleUrls: ['./user-fav.component.css']
})
export class UserFavComponent implements OnInit {
  token = localStorage.getItem("gAmE-t0KEN");head:any=true;
  fav = localStorage.getItem("gAmE-fav") ?? "";
  liked = localStorage.getItem("gAmE-like") ?? "";

  favTable:any=[];

  balance:any = 0;currency:any = 'JB';
  constructor(private httpService:ConnectionService,private toastr: ToastrService,private route: Router) {
    if(!this.httpService.loggedIn()){
      this.route.navigate([''])
    }
   }

  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this.getFav();
  }

  conPass(data:any){
    this.head = data;
  }

  CurrBal(curr:any){
    this.balance = curr.balance;
    this.currency = curr.currency;
  }

  getFav(){
    this.httpService.postRequest('basic/getFav',{}, this.token).subscribe((resData:any) => {
      if(resData.success == 1) {
        this.favTable=resData.msg;
      } else {
        this.toastr.error(resData.msg,'')
      }
    })
  }

  url(name:any){
    console.log(name)
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
