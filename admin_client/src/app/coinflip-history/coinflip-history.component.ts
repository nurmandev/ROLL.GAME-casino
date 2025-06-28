import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-coinflip-history',
  templateUrl: './coinflip-history.component.html',
  styleUrls: ['./coinflip-history.component.scss']
})
export class CoinflipHistoryComponent implements OnInit {
  token = localStorage.getItem('Key');id:any;
  //det
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_series:any=1;Det_result:any=[{bet_result: "head"}];Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;

  constructor(private conn: ConnectionService, private alert: ToastrService, private route: Router, private actRoute: ActivatedRoute) { 
    if (actRoute.snapshot.url[1].path =='coinflip') {
      this.id=actRoute.snapshot.url[2].path;
    }
  }

  ngOnInit(): void {
    this.details();
  }

  details(){
    var obj={'_id':this.id,game:'coinflip'}
    this.conn.postRequest('history/flipDetails',obj,this.token).subscribe((resData:any) => {
     if(resData.success==1){
        this.Det_id=resData.msg.bet_id;
        this.Det_name=resData.msg.username;
        this.Det_created_at=resData.msg.created_at;
        this.Det_betamount=resData.msg.bet_amount;
        this.Det_payout=resData.msg.payout;
        this.Det_pro_amt=resData.msg.pro_amt;
        this.Det_result=resData.msg.result;
        this.Det_series=this.Det_result.length;
        this.Det_serverSeed=resData.msg.serverSeed;
        this.Det_clientSeed=resData.msg.clientSeed;
        this.Det_nounce=resData.msg.nounce;
        this.Det_status=resData.msg.status;
      }else{
        this.alert.error(resData.msg,'');
      }
    })
  }


}
