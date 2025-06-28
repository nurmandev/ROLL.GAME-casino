import { Component, OnInit, Input, NgModule, ViewChild, ElementRef } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
declare var jQuery: any;
import { ModalServiceService } from '../modal.service.service';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
  token = localStorage.getItem("gAmE-t0KEN");
  head:any=true;
  BlogData:any=[];
  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute,private modalService: ModalServiceService) { 
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
  }

  openModal() {
    this.modalService.openModal();  
  }

  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this.httpService.getUrl('basic/getBlog').subscribe((resData:any)=>{
      if(resData.success==1){
        this.BlogData=resData.BlogData; 
      }else{
        if(resData.msg.status==0){
          this.route.navigate(['/']);
        }
      }
    })  
  }
  conPass(data:any){
    this.head = data;
  }

}
