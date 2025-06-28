import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  token = localStorage.getItem('Key');
  activity: any; p:any = 0;limit:any = 10;totalCount:any;page:any = 0;
  isLoading = false;

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService) { 

  }

  ngOnInit(): void {
    this.getHistory();
  }

  public getHistory() {
    let params = {
      sortOrder: 'desc',
      sortActive: '_id',
      pageIndex: this.p,
      pageSize: this.limit,
    }

    this.dataService.loadData('admin/loghistory', params).subscribe(resData => {
      this.activity = resData.data;
      this.totalCount = resData.logCount;
      this.page = Math.floor(this.totalCount / this.limit);
      this.isLoading = true;
    });
  }

  changeItemCount(event:any): void{
    this.limit = event.target.value;
    this.getHistory();
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
    this.getHistory();
  }
}
