import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from '../connection.service';
import { ToastrService } from 'ngx-toastr';
declare var jQuery: any;

@Component({
  selector: 'app-myprivacy',
  templateUrl: './myprivacy.component.html',
  styleUrls: ['./myprivacy.component.css']
})
export class MyprivacyComponent implements OnInit {

  constructor(private httpService: ConnectionService, private toastr: ToastrService, private route: Router) { 
    if(!this.httpService.loggedIn()){
      this.route.navigate(['/']);
    }
  }

  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
  }

  conPass(data:any){
    if(data == false){
      this.route.navigate(['/']);
    }
  }
}
