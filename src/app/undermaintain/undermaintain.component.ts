import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-undermaintain',
  templateUrl: './undermaintain.component.html',
  styleUrls: ['./undermaintain.component.css']
})
export class UndermaintainComponent implements OnInit {
Loader:any=false;
  constructor(private httpService:ConnectionService,private toastr: ToastrService,private route: Router) {
    this.httpService.getUrl('basic/siteInfo').subscribe((resdata: any) => {
      if(resdata.success==1){
        this.route.navigate(['/']);
      }else{
        this.Loader=true;
      }
    })
  }

  ngOnInit(): void {
  }

}
