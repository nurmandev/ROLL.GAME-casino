import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profit',
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.scss']
})
export class ProfitComponent implements OnInit {

  token = localStorage.getItem('Key');
  Profit: any;
  isLoading = false;
  ProfitData:any={}; currData:any=[];gameData:any= []; dayData:any=[];
  AdminProfit:any="0.00"; userBets:any="0.00"; userBetCount:any="0";

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private notifier: NotifierService) {
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.getProfit();
    this.getfirstData();
  }

  public getProfit() {
    this.dataService.loadData('admin/profitdata', {}).subscribe((resData:any) => {
      if(resData) {
        this.Profit = resData.Profitdata;
        this.isLoading = true;
      }else{
        this.Profit = [];
      }
    });
  }

  public getfirstData(){
    this.dataService.getRequest('admin/profitlist', this.token).subscribe((resData:any) => {
      if(resData.success == 1){
        this.currData = resData.curr;
        this.gameData = resData.game;
        this.dayData = resData.day;
      }
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
  }

  SearchProfit(form:NgForm){
    var data = form.value;
    if(data.curr !== undefined && data.curr !== ""){
      if(data.game !== undefined && data.game !== ""){
        if(data.day !== undefined && data.day !== ""){
          this.dataService.postRequest('admin/profitDataDetails',data, this.token).subscribe((resData:any) => {
            if(resData.success == 1){
              this.AdminProfit = resData.shearchData.Profit;
              this.userBets = resData.shearchData.userBet;
              this.userBetCount = resData.shearchData.usercunt;
            }
          });
        }else{
          this.notifier.notify('error', 'please Select day');
        }
      }else{
        this.notifier.notify('error', 'please Select Game');
      }
    }else{
      this.notifier.notify('error', "please select currency");
    }
  }
}