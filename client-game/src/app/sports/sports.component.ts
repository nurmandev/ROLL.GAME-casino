import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare var jQuery: any;

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css']
})
export class SportsComponent implements OnInit {
  token = localStorage.getItem("gAmE-t0KEN");head:any=true;
  balance:any = 0;currency:any = 'JB';
  
  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute) { 
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
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
}
