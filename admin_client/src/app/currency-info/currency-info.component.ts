import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-currency-info',
  templateUrl: './currency-info.component.html',
  styleUrls: ['./currency-info.component.scss']
})
export class CurrencyInfoComponent implements OnInit {
  token = localStorage.getItem('Key');
  TRN: any; pageSize: any; pageIndex: any; sortActive :any; sortOrder :any;
  id: any;
  isLoading = false;
  CurrData:any;
  currencymatch: any = false;

  supportData:any = {
  };
  
  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private actRoute: ActivatedRoute, private notifier: NotifierService) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
    this.actRoute.params.subscribe((params) => {
      this.id = params['id'];
      let obj = { "id": this.id };
      this.dataService.postRequest('users/getCurrencyInfo', obj, this.token).subscribe((resData: any) => {
        if(resData.status == 1){
            this.CurrData = resData.CurrData;
            this.isLoading = true;
        }else{
          this.notifier.notify('error', resData.msg);
        }
      });
    });
  }

  ngOnInit(): void {
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
  }

  submitFunc(send: NgForm){
    var data = send.value;
    data.Id = this.id;
    data.type = this.CurrData.type;
    this.dataService.postRequest('admin/ManageCurrency', data, this.token).subscribe((resData: any) => {
      if(resData.status == 1){
        this.notifier.notify('success', 'Updated Successfully');
        this.router.navigateByUrl('/currency');
      }else{
        this.notifier.notify('error', resData.msg);
      }
      this.isLoading = true;
    });
  }
}