import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-plinko-history',
  templateUrl: './plinko-history.component.html',
  styleUrls: ['./plinko-history.component.scss']
})

export class PlinkoHistoryComponent implements OnInit {
  token = localStorage.getItem('Key');id:any;

  //det
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
  Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;

  constructor(private conn: ConnectionService, private alert: ToastrService, private route: Router, private actRoute: ActivatedRoute) { 
    if (actRoute.snapshot.url[1].path =='plinko') {
      this.id=actRoute.snapshot.url[2].path; 
    }
  }

  ngOnInit(): void {
    this.details()
  }

  details(){
    var obj={'_id':this.id,game:'plinko'}
    this.conn.postRequest('history/plinkoDetails',obj,this.token).subscribe((resData:any) => {
     if(resData.success==1){
        this.Det_id=resData.history.bet_id;
        this.Det_name=resData.history.username;

        this.Det_created_at=resData.history.created_at;
        this.Det_betamount=resData.history.bet_amount;
        this.Det_payout=resData.history.payout;
        this.Det_pro_amt=resData.history.pro_amt;
        this.Det_result=resData.history.result;
        this.Det_status=resData.history.status;
      }else{
        this.alert.error(resData.history,'');
      }
    })
  }

}
