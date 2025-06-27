import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var jQuery: any;
import { ModalServiceService } from '../modal.service.service';

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.css']
})
export class AffiliateComponent implements OnInit {
  token = localStorage.getItem("gAmE-t0KEN");
  head:any= true; refData:any=[];refId:any;referalLink:any;

  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute,private modalService: ModalServiceService) { 
    if(!this.httpService.loggedIn()){
      this.head=false;
      this.route.navigate([''])
    }
  }

  openModal() {
    this.modalService.openModal();  
  }

  ngOnInit(): void {
    this.refferalData();
  }

  conPass(data:any){
    if(data == false){
      this.head = data;
      this.route.navigate(['/']);
    }
  }

  refferalData(){
    this.httpService.getRequest('basic/referralData', this.token).subscribe((res: any) => {
      if(res.success == 1){
        this.refId = res.referr_id;
        var host = window.location.origin;
        this.referalLink = host+'/referrals?referral='+res.referr_id;
        this.refData = res.referralData;
      }else{
        this.alert.error(res.msg, '', {timeOut: 2000});
      }
    })
  }

  copyText(val: string, msg:any) {
    let selBox = document.createElement('input');
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    window.scrollTo(0, 0);
    this.alert.success(msg+' Copied to the clipboard', '', {timeOut: 2000});
  }
}