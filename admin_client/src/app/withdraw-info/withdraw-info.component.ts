import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-withdraw-info',
  templateUrl: './withdraw-info.component.html',
  styleUrls: ['./withdraw-info.component.scss']
})
export class WithdrawInfoComponent implements OnInit {
  token = localStorage.getItem('Key');
  TRN: any;
  isLoading = false;
  withdrawData:any = {};
  
  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private actRoute: ActivatedRoute, private notifier: NotifierService) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.actRoute.params.subscribe((params) => {
      this.TRN = params['id'];
      let obj = { "CIdKey": this.TRN };
      this.dataService.postRequest('users/getWithdrawInfo', obj, this.token).subscribe((resData: any) => {
        if(resData) {
          if(resData.status == 1){
              this.withdrawData = resData.withdrawData;
          }else{
            this.notifier.notify('error', resData.msg);
          }
          this.isLoading = true;
        } else {
          this.notifier.notify('error', resData.msg);
        }
      });
    });
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
