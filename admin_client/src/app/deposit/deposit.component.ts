import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {
  token = localStorage.getItem('Key');
  deposits: any; p:any = 0;limit:any = 10;totalCount:any;page:any = 0;
  isLoading = false; pagination : any = []; 
  // con_status:any = true;

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
    this.dataService.loadData('users/depositdata', params).subscribe(resData => {
      if(resData) {
        this.deposits = resData.data;
        this.totalCount = resData.userCount;
        this.page = Math.floor(this.totalCount / this.limit);
        this.isLoading = true;
      }

      // if(this.con_status){
      //   if (this.page +1 > 0) {
      //     for(let i = 1 ; i <= this.page +1 ; i++) {  
      //       this.pagination.push(i);
      //     }
      //     this.con_status = false;
      //   }
      // }
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

  // pagethreemove(val:any){
  //   this.p = val-1;
  //   this.getUsers();
  // } 

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
