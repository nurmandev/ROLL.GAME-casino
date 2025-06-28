import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {
  token = localStorage.getItem('Key');
  cms: any; p:any = 0;limit:any = 10;totalCount:any;page:any = 0;
  isLoading = false;

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private notifier: NotifierService) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit() {
    this.getCms();
  }

  public getCms() {
    let params = {
      sortOrder: 'desc',
      sortActive: '_id',
      pageIndex: this.p,
      pageSize: this.limit,
    }
    this.dataService.loadData('cms/get_cms', params).subscribe(resData => {
      if(resData) {
        this.cms = resData.data;
        this.totalCount = resData.cmsCount;
        this.page = Math.floor(this.totalCount / this.limit);
        this.isLoading = true;
      }
    });
  }

  changeItemCount(event:any): void{
    this.limit = event.target.value;
    this.getCms();
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
    this.getCms();
  }
}
