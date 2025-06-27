import { Component, OnInit, Input, NgModule, ViewChild, ElementRef } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
declare var jQuery: any;

@Component({
  selector: 'app-promotion-info',
  templateUrl: './promotion-info.component.html',
  styleUrls: ['./promotion-info.component.css']
})
export class PromotionInfoComponent implements OnInit {
  token = localStorage.getItem("gAmE-t0KEN");
  head:any=true; id:any='';
  BlogData:any=[];
  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute) { 
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
    this.actRoute.params.subscribe((params) => {
      this.id = params['id'];
      let obj = { "id": this.id };
      this.httpService.postUrl('basic/getBlogInfo', obj).subscribe((resData: any) => {
        if(resData.success == 1){
            this.BlogData = resData.BlogData;
        }else{
          this.alert.error(resData.msg);
        }
      });
    })
  }

  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
  }
  conPass(data:any){
    this.head = data;
  }
}