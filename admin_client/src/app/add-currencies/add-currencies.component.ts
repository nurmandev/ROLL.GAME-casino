import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-currencies',
  templateUrl: './add-currencies.component.html',
  styleUrls: ['./add-currencies.component.scss']
})
export class AddCurrenciesComponent implements OnInit {
  token = localStorage.getItem('Key');
  TRN: any; pageSize: any; pageIndex: any; sortActive :any; sortOrder :any;
  isLoading = false;
  currencymatch: any = false;
  OptionsdataData : any = {network: "BNB",type: "token"};
  Network:any;
  supportData:any = {status:1};

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private notifier: NotifierService) {
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
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
    // this.alert.success('Address Copied to the clipboard', '', {timeOut: 2000});
  }

  submitFunc(form: NgForm){
    var data = form.value;
    if(data.currency !== undefined && data.max_bet !== undefined && data.max_deposit !== undefined && data.max_withdraw !== undefined && data.min_bet !== undefined && data.min_deposit !== undefined && data.min_withdraw !== undefined && data.withdraw_fee !== undefined){
      if(data.currency !== '' && data.max_bet !== '' && data.max_deposit !== '' && data.max_withdraw !== '' && data.min_bet !== '' && data.min_deposit !== '' && data.min_withdraw !== '' && data.withdraw_fee !== ''){
        this.dataService.postRequest('admin/AddNewCurr', data, this.token).subscribe((resData: any) => {
          if(resData.status == 1){
            this.notifier.notify('success', resData.msg);
            this.router.navigateByUrl('/currency');
          }else{
            this.notifier.notify('error', resData.msg);
          }
        });
      }else{
        this.notifier.notify('error', "Currency and details is must be valid !");
      }
    }else{
      this.notifier.notify('error', "Currency and details is must be valid !");
    }
  }

  CurrMatch(curr){
    var data = {"currency" : curr};
    this.dataService.postRequest('admin/CurrMatchCheck', data, this.token).subscribe((resData: any) => {
      if(resData){
        if(resData.status == 0){
          this.currencymatch = true;
        }else{
          this.currencymatch = false;
        }
      }
      this.isLoading = true;
    });
  }
}