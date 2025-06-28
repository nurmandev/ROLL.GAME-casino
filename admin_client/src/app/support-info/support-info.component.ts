import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-support-info',
  templateUrl: './support-info.component.html',
  styleUrls: ['./support-info.component.scss']
})
export class SupportInfoComponent implements OnInit {
  token = localStorage.getItem('Key');
  Id: any;
  isLoading = false;
  supportData:any = {};
  
  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private actRoute: ActivatedRoute, private notifier: NotifierService) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }

    this.actRoute.params.subscribe((params) => {
      this.Id = params['id'];
      let obj = { "Id": this.Id };
      this.dataService.postRequest('users/getsupportInfo', obj, this.token).subscribe((resData: any) => {
        if(resData) {
          if(resData.status == 1){
              this.supportData = resData.contactInfo;
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

  ngOnInit(): void {
  }

  onBlurMethod(data:any){
   this.supportData.admin_reply = data.trim();
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

  submitFunc(form: NgForm){
    var data = form.value;
    data.Id = this.Id;
    console.log(data)
    if(data.admin_reply !== undefined && data.admin_reply !== null && data.admin_reply.toString().length > 0 ){
      this.dataService.postRequest('admin/SendSupportReply', data, this.token).subscribe((resData: any) => {
        if(resData.status == 1){
          this.notifier.notify('success', resData.msg);
          this.router.navigateByUrl('/support');
        }else{
          this.notifier.notify('error', resData.msg);
        }
        this.isLoading = true;
      });
    }else{
      this.notifier.notify('error', "Admin reply is Invalid !");
    }
  }
}
