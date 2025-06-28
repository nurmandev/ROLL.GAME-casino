import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
declare var jQuery: any;

@Component({
  selector: 'app-roulette-history',
  templateUrl: './roulette-history.component.html',
  styleUrls: ['./roulette-history.component.scss']
})

export class RouletteHistoryComponent implements OnInit {
token = localStorage.getItem('Key');id:any;

//det
Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;Det_risk:any;
Det_segment:any;Det_initialbet:any;Det_gameResult:any;resultcoins:any=[];


  constructor(private conn: ConnectionService, private alert: ToastrService, private route: Router, private actRoute: ActivatedRoute) {
      if (actRoute.snapshot.url[1].path =='roulette') {
        this.id=actRoute.snapshot.url[2].path;
      }
  }

  ngOnInit(): void {
    this.details();
  }

  details(){
    jQuery('.resultcoin').removeClass('chipresultselect');
    jQuery('.resultcoin').removeClass('resultActiveClass');
    var obj={'_id':this.id,game:'roulette'};
    this.conn.postRequest('history/rouletteDetails',obj,this.token).subscribe((resData:any) => {
      if(resData.success==1){
        this.Det_id=resData.history.bet_id;
        this.Det_name=resData.history.username;
        this.Det_created_at=resData.history.created_at;
        this.Det_betamount=resData.history.bet_amount;
        this.Det_payout=resData.history.payout.toFixed(2);
        this.Det_pro_amt=resData.history.pro_amt;
        this.Det_result=resData.history.userbet;
        this.Det_serverSeed=resData.history.serverSeed;
        this.Det_clientSeed=resData.history.clientSeed;
        this.Det_nounce=resData.history.nounce;
        this.Det_status=resData.history.status;
        // var betnotmat = resData.history.userbet;
        // console.log(betnotmat)
        var betnotmat = resData.history.userbet;
        jQuery('#res'+resData.history.bet_result).addClass('resultActiveClass');
        for (let i = 0; i < betnotmat.length; i++) {
          var key = betnotmat[i].bet;
          var value = betnotmat[i].amt;

          jQuery('#res'+key).addClass('chipresultselect');
          if(typeof(key) == 'number'){
            key = 'num'+key;
            this.resultcoins[key]=value;
          }else{
            this.resultcoins[key]=value;
          }
        }

      }else{
        this.alert.error(resData.history,'');
      }
    })
  }

}
