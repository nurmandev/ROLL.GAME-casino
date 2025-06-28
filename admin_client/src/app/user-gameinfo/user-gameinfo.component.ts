import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-gameinfo',
  templateUrl: './user-gameinfo.component.html',
  styleUrls: ['./user-gameinfo.component.scss']
})

export class UserGameinfoComponent implements OnInit {
token = localStorage.getItem('Key');
userId:any;gameName:any;gamePro:any=[];

name:any;totGame:any;winGame:any;lossGame:any;profit:any;

  constructor(private conn: ConnectionService, private alert: ToastrService, private route: Router, private actRoute: ActivatedRoute) {
    this.actRoute.params.subscribe((params) => {
      this.userId = params['id'];
      this.gameName = params['gameName'];
      var obj={userId:this.userId,gamename:this.gameName}
      this.conn.postRequest('users/getUser_game', obj, this.token).subscribe((resData: any) => {
        if(resData.status==1){
          this.name=resData.data.name;
          this.totGame=resData.data.total_count;
          this.winGame=resData.data.total_win;
          this.lossGame=resData.data.total_loss;
          this.profit=resData.data.Wages;
          this.gamePro=resData.profit;
        }else{
          this.alert.error(resData.data,'')
        }
      })
    })
   }

  ngOnInit(): void {
  }

}
