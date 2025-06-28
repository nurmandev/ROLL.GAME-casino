import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminauthService } from '../services/adminauth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-crash-history',
  templateUrl: './crash-history.component.html',
  styleUrls: ['./crash-history.component.scss']
})
export class CrashHistoryComponent implements OnInit {
  token = localStorage.getItem('Key');id:any;

  //det
  detail:any={};users_det:any=[];

  constructor(private conn: ConnectionService, private alert: ToastrService, private route: Router, private actRoute: ActivatedRoute, private conns: AdminauthService,private notifier: NotifierService) { 
    if (actRoute.snapshot.url[1].path =='crash') {
      this.id=actRoute.snapshot.url[2].path; 
    }
    if (!this.conns.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.route.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.details()
  }

  details(){
    var obj={'_id':this.id,game:'crash'}
    this.conn.postRequest('history/crashDetails',obj,this.token).subscribe((resData:any) => {
     if(resData.success==1){
        this.detail=resData.history
        this.users_det=resData.history.users
      }else{
        this.alert.error(resData.history,'');
      }
    })
  }

}
