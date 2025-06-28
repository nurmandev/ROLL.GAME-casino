import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
declare var jQuery: any;


@Component({
  selector: 'app-keno-history',
  templateUrl: './keno-history.component.html',
  styleUrls: ['./keno-history.component.scss']
})

export class KenoHistoryComponent implements OnInit {
token = localStorage.getItem('Key');id:any;
//details
Det_id:any;Det_name:any;Det_created_at:any;Det_betamount:any;Det_payout:any;Det_pro_amt:any;
Det_result:any;Det_serverSeed:any;Det_clientSeed:any;Det_nounce:any;Det_status:any;


kenobetsdig:any = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]


  constructor(private conn: ConnectionService, private alert: ToastrService, private route: Router, private actRoute: ActivatedRoute) { 
    if (actRoute.snapshot.url[1].path =='keno') {
      this.id=actRoute.snapshot.url[2].path;  
    }
  }

  ngOnInit(): void {
    this.details();
  }

  details(){
    var obj={'_id':this.id,game:'keno'}
    this.conn.postRequest('history/kenoDetails',obj,this.token).subscribe((resData:any) => {
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
        var userbet = resData.history.userbet; 
        for (let i = 0; i < userbet.length; i++) {
          jQuery('#'+userbet[i]+"res").addClass('selected');
          var winbet = resData.history.win; 
          for (let j = 0; j < winbet.length; j++) {
            jQuery('#'+winbet[j]+"res").addClass('kenoselect selected');
            var lossbet = resData.history.loss; 
            for (let k = 0; k < lossbet.length; k++) {
              jQuery('#'+lossbet[k]+"res").addClass('unselected');
            }
          }
        }
      }else{
        this.alert.error(resData.history,'')
      }
    })
  }

}
