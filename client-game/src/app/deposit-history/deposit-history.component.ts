import { Component, OnInit, Input, NgModule, ViewChild, ElementRef } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
declare var jQuery: any;
import { ModalServiceService } from '../modal.service.service';;

@Component({
  selector: 'app-deposit-history',
  templateUrl: './deposit-history.component.html',
  styleUrls: ['./deposit-history.component.css']
})
export class DepositHistoryComponent implements OnInit {
  depositHistory:any = [];
  token = localStorage.getItem("gAmE-t0KEN");
  p : any = 1;
  head:any=true;

  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute,private modalService: ModalServiceService) { 
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
  }

  ngOnInit(): void {
    this.httpService.getRequest('basic/DepositeHistory', this.token).subscribe((res: any) => {
      if(res.success == 1){
        this.depositHistory = res.deposite;
      }else{
        this.alert.error(res.msg);
      }
    });
  }

  conPass(data:any){
    this.head = data;
  }


  copyText(val: string) {
    let selBox = document.createElement('input');
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    window.scrollTo(0, 0);
    this.alert.success('Address Copied to the clipboard', '', {timeOut: 2000});
  }

}
