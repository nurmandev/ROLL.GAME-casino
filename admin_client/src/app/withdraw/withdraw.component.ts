import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {
  token = localStorage.getItem('Key');
  withdraws: any; p:any = 0;limit:any = 10;totalCount:any;page:any = 0;
  isLoading = false;

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
    this.dataService.loadData('users/withdrawdata', params).subscribe(resData => {
      if(resData) {
        this.withdraws = resData.data;
        this.totalCount = resData.userCount;
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

  copyText(val: string, type:any) {
    let selBox = document.createElement('input');
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    window.scrollTo(0, 0);
    this.notifier.notify('success', type+" "+'copied to the clipboard');
    // this.alert.success('Address Copied to the clipboard', '', {timeOut: 2000});
  }
}
