import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConnectionService } from './connection.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'game';
  Loader:any=false;

   constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute){
    this.httpService.getUrl('basic/siteInfo').subscribe((resdata: any) => {
      if(resdata.success==0){
        this.route.navigate(['/maintanence']);
      }
    })
   }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

  scrollEvent = (event: any): void => {
    if(event.srcElement.scrollingElement !== undefined){
      const n = event.srcElement.scrollingElement.scrollTop;
      if(n == 0){
        jQuery('#scroll-top').removeClass('active');
      }else{
        jQuery("#scroll-top").addClass('active');
      }
    }
  }
   
  scrollTop(){
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
}
