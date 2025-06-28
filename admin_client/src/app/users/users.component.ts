import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  token = localStorage.getItem('Key');
  users: any; p:any = 0;limit:any = 10;totalCount:any=0;page:any = 0;
  isLoading = false; connectionType:any;kycLoader=false;

  constructor(private dataService: ConnectionService, private toastr: ToastrService, private router: Router, private conn: AdminauthService, private notifier: NotifierService, private actRoute: ActivatedRoute) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
    if (actRoute.snapshot.url[0].path =='kyc') {
      this.kycLoader=true;
    }
  }

  ngOnInit() {
    this.getUsers();
  }

  public getUsers() {
      if(this.kycLoader==true){
        var paramsdata = {
          sortOrder: 'desc',
          sortActive: '_id',
          pageIndex: this.p,
          pageSize: this.limit,
        }
        this.dataService.loadData('users/pendingKyc', paramsdata).subscribe(resData => {
          if(resData) {
            this.users = resData.data;
            this.totalCount = resData.userCount;
            this.page = Math.floor(this.totalCount / this.limit);
            this.isLoading = true;
          }
        });
        return ;
      }else{
        var paramsdata = {
          sortOrder: 'desc',
          sortActive: '_id',
          pageIndex: this.p,
          pageSize: this.limit,
        }
        this.dataService.loadData('users/userlist', paramsdata).subscribe(resData => {
          if(resData) {
            this.users = resData.data;
            this.totalCount = resData.userCount;
            this.page = Math.floor(this.totalCount / this.limit);
            this.isLoading = true;
          }
        });
      }
    }

  changeItemCount(event:any): void{
    this.limit = event.target.value;
    this.getUsers();
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

  tfaDisable(Id:any){
    var obj = {userId: Id};
    this.dataService.postRequest('admin/Tfadisable', obj, this.token).subscribe((resData:any) => {
      if(resData.success == 1){
        this.toastr.success(resData.msg);
        this.getUsers();
      }else{
        this.toastr.error(resData.msg);
      }
    });
  }
  userAction(Id:any, type:any){
    var obj = {userId: Id, type: type};
    this.dataService.postRequest('admin/UsersAct', obj, this.token).subscribe((resData:any) => {
      if(resData.success == 1){
        this.toastr.success(resData.msg);
        this.getUsers();
      }else{
        this.toastr.error(resData.msg);
      }
    });
  }
}