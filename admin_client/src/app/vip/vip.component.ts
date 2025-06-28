import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vip',
  templateUrl: './vip.component.html',
  styleUrls: ['./vip.component.scss']
})
export class VipComponent implements OnInit {

token = localStorage.getItem('Key');
isLoading = false;table:any=[];p:any = 0;limit:any = 10;totalCount:any;page:any = 0;

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService,private toastr: ToastrService,) {
    if (!this.conn.isAuthenticated()) {
      this.toastr.error("Please login to continue");
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.list();
  }

  list(){
     let params = {
      sortOrder: 'desc',
      sortActive: '_id',
      pageIndex: this.p,
      pageSize: this.limit,
    }
    this.dataService.loadData('admin/vipList',params).subscribe((resData:any)=>{
      if(resData.status == true) {
        this.table=resData.data;
        this.totalCount = resData.userCount;
        this.page = Math.floor(this.totalCount / this.limit);
      } else {
        this.table = [];
      }
    })
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
    this.list();
  }
}
