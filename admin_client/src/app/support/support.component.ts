import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  token = localStorage.getItem('Key');
  supportdata: any; p :any = 0;limit:any = 10;totalCount:any; page:any = 0;
  isLoading = false; comOrd:any;

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private notifier: NotifierService) {
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.getUsers();
  }

  public getUsers() {
    let params = {
      sortOrder: 'desc',
      sortActive: '_id',
      pageIndex: this.p,
      pageSize: this.limit,
    }
    this.dataService.loadData('users/contactUsData', params).subscribe(resData => {
      if(resData) {
        this.supportdata = resData.supportData;
        this.totalCount = resData.supportCount;
        this.page = Math.floor(this.totalCount / this.limit);
        this.isLoading = true;
      }
    });
  }

  paginate(param:any): void{
    switch(param){
      case "prev":
      this.p = this.p - 1;
      break;
      case "next":
      this.p = this.p + 1;
      break;
      case "first":
      this.p = 0;
      break;
      case "last":
      this.p = Math.floor(this.totalCount / this.limit);
      break
      default:
      this.p = this.p + 1;
      break;
    }
    this.getUsers();
  }

}
