import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-game-list-info',
  templateUrl: './game-list-info.component.html',
  styleUrls: ['./game-list-info.component.scss']
})
export class GameListInfoComponent implements OnInit {
  token = localStorage.getItem('Key');
  TRN: any; pageSize: any; pageIndex: any; sortActive :any; sortOrder :any;
  game: any;
  isLoading = false;
  CurrData:any={}; currency:any =[];
  currencymatch: any = false;
  supportData:any = {
  };
  
  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private actRoute: ActivatedRoute, private notifier: NotifierService) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
    this.actRoute.params.subscribe((params) => {
      this.isLoading = true;
      this.game = params['id'];
      this.dataService.getRequest('history/getCurr', this.token).subscribe((resData: any) => {
        if(resData.success == 1){
          this.CurrData.curr=resData.currency[0];
          this.currency=resData.currency;
          this.isLoading = true;
          this.getCurrData(this.CurrData.curr);
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
    data.game = this.game;
    this.dataService.postRequest('admin/ManageGame', data, this.token).subscribe((resData: any) => {
      if(resData.success == 1){
        this.notifier.notify('success', resData.msg);
        this.router.navigateByUrl('/gameList');
      }else{
        this.notifier.notify('error', resData.msg);
      }
      this.isLoading = true;
    });
  }

  onsecondCurr(curr:any){
    this.getCurrData(curr.value);
  }

  getCurrData(curr:any){
    let obj = { "game": this.game, curr: curr};
    this.dataService.postRequest('history/getgameInfo', obj, this.token).subscribe((resData: any) => {
      if(resData.success == 1){
          this.CurrData = resData;
          this.isLoading = true;
      }else{
        this.notifier.notify('error', resData.msg);
      }
    });
  }
}