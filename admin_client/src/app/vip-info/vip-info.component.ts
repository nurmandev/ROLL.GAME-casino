import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-vip-info',
  templateUrl: './vip-info.component.html',
  styleUrls: ['./vip-info.component.scss']
})
export class VipInfoComponent implements OnInit {
  token = localStorage.getItem('Key');
  TRN: any; pageSize: any; pageIndex: any; sortActive :any; sortOrder :any;
  id: any;
  isLoading = false;
  CurrData:any={};
  currencymatch: any = false;
  
  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private actRoute: ActivatedRoute, private notifier: NotifierService) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
    this.actRoute.params.subscribe((params) => {
      this.id = params['id'];
      let obj = { "id": this.id };
      this.isLoading = true;
      this.dataService.postRequest('admin/getVipInfo', obj, this.token).subscribe((resData: any) => {
        if(resData.success == 1){
            this.CurrData = resData.data;
            this.isLoading = true;
        }else{
          this.notifier.notify('error', resData.msg);
        }
      });
    });
  }

  ngOnInit(): void {
  }

  submitFunc(send: NgForm){
    var data = send.value;
    if(data.XP== 0 || data.XP== ''){ return this.notifier.notify('error', "Please Enter valid XP") }
    if(data.Bonus== 0 || data.Bonus== ''){ return this.notifier.notify('error', "Please Enter valid Bonus") }
    data.Id = this.id;
    this.dataService.postRequest('admin/ManageVip', data, this.token).subscribe((resData: any) => {
      if(resData.success == 1){
        this.notifier.notify('success', 'Updated Successfully');
        this.router.navigateByUrl('/viplist');
      }else{
        this.notifier.notify('error', resData.msg);
      }
      this.isLoading = true;
    });
  }
}