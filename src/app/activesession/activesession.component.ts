import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
declare var jQuery: any;


@Component({
  selector: 'app-activesession',
  templateUrl: './activesession.component.html',
  styleUrls: ['./activesession.component.css']
})
export class ActivesessionComponent implements OnInit {
  token = localStorage.getItem("gAmE-t0KEN");
p:any = 0;limit:any = 10;totalCount:any;page:any = 0;SearchQuery:any="";logData:any=[];

  constructor(private httpService: ConnectionService, private toastr: ToastrService, private route: Router) { 
    if(!this.httpService.loggedIn()){
      this.route.navigate(['/']);
    }
  }
  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this.activityLog();
  }

  conPass(data:any){
    if(data == false){
      this.route.navigate(['/']);
    }
  }

   activityLog(){
    var paramsdata = {
      sortOrder: 'desc',
      sortActive: '_id',
      pageIndex: this.p,
      pageSize: this.limit,
    }

    this.httpService.postRequest('basic/activityLog',paramsdata,this.token).subscribe((resData:any) => {
      if(resData.success == 1){
        this.logData = resData.data;
        this.totalCount = resData.logCount;
        this.page = Math.floor(this.totalCount / this.limit);
      }else{
        this.toastr.error(resData.msg,'')
      }
    }) 
  }

  paginate(param:any){
    switch(param){
      case "prev":
      this.p = this.p - 10;
      break;
      case "next":
      this.p = this.p + 10;
      break;
      case "first":
      this.p = 0;
      break;
      case "last":
      this.p = Math.floor(this.totalCount / this.limit);
      break
      default:
      this.p = this.p + 10;
      break;
    }
    this.activityLog();
  }
}