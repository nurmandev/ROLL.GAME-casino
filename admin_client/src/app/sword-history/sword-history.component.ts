import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sword-history',
  templateUrl: './sword-history.component.html',
  styleUrls: ['./sword-history.component.scss']
})
export class SwordHistoryComponent implements OnInit {
  token = localStorage.getItem('Key');id:any;
  //det
  Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;respin:any="";
  Det_series:any=1;Det_result:any=[{bet_result: "head"}];Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;
  Result:any=[]; CatResult:any=[];
  constructor(private conn: ConnectionService, private alert: ToastrService, private route: Router, private actRoute: ActivatedRoute) { 
    if (actRoute.snapshot.url[1].path =='sword') {
      this.id=actRoute.snapshot.url[2].path;
    }
  }

  ngOnInit(): void {
    this.details();
  }

  details(){
    var obj={'_id':this.id,game:'sword'}
    this.conn.postRequest('history/swordDetails',obj,this.token).subscribe((resData:any) => {
     if(resData.success==1){
        this.Det_id=resData.history.bet_id;
        this.Det_name=resData.history.username;
        this.Det_created_at=resData.history.created_at;
        this.Det_betamount=resData.history.bet_amount;
        this.Det_payout=resData.history.payout;
        this.Det_pro_amt=resData.history.pro_amt;
        this.Det_serverSeed=resData.history.serverSeed;
        this.Det_clientSeed=resData.history.clientSeed;
        this.Det_nounce=resData.history.nounce;
        this.Det_status=resData.history.status;
        this.respin=resData.history.spin_result;
        this.Result = resData.history.result;
        this.CatResult = resData.history.cat_result;
        if(this.Det_status == undefined){this.Det_status = 'loser'};
        if(this.Result == undefined || this.Result.length == 0){this.Result = "None"};
        if(this.CatResult == undefined || this.CatResult.length == 0){this.CatResult = 'None'};
      }else{
        this.alert.error(resData.msg,'');
      }
    })
  }
}