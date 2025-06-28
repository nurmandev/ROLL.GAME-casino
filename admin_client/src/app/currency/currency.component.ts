import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {
  token = localStorage.getItem('Key');
  currencies: any; p:any = 0;limit:any = 10;totalCount:any;page:any = 0;
  isLoading = false; UserType:any;

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private actRoute: ActivatedRoute, private notifier: NotifierService) {
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.getUsers();
  }

  public getUsers() {
    let paramsdata = {
      sortOrder: 'desc',
      sortActive: '_id',
      pageIndex: this.p,
      pageSize: this.limit,
    }
    this.dataService.loadData('users/get_currency', paramsdata).subscribe(resData => {
      if(resData) {
        this.currencies = resData.data;
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

}
