import { Component, OnInit,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';
import PatternLock from 'patternlock';


@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss']
})
export class PatternComponent implements OnInit {
  token = localStorage.getItem('Key');
  validatepattern:any;lock:any;checkPattern1:any=false;msgPattern:any=2;msgErr:any=2;
  validatepattern1:any;match:any=false;
  validatepattern2:any;

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService, private notifier: NotifierService) { 
    if (!this.conn.isAuthenticated()) {
      this.notifier.notify('error', "Please login to continue");
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    //pattern1
    this.validatepattern = new PatternLock('#patternLock',{
      onDraw: (pattern) => {
        this.onPatternDraw(pattern);
      }
    });
    //pattern2
    let unlockPattern:any;
    this.validatepattern1 = new PatternLock('#patternLock1',{
      onDraw:(pattern)=>{
        // this.validatepattern1.setPattern();
        unlockPattern=this.validatepattern1.getPattern()
      }
    });
    //pattern2
    this.validatepattern2 = new PatternLock('#patternLock2',{
      onDraw:(pattern)=>{
        let siginpattern:any;
        siginpattern=this.validatepattern2.getPattern();
        if(unlockPattern === siginpattern){
          this.msgErr=1;
          this.match=true;
        }else{
          this.msgErr=0;
          this.match=false;
        }
      }
    });
  }

  onPatternDraw(pattern:any){
    var obj={pattern:pattern}
    this.dataService.postRequest('admin/patternOld', obj, this.token).subscribe((resData: any) => {
      if(resData.status==1){
        this.checkPattern1=true;
        this.msgPattern=1;
        this.notifier.notify('success', resData.msg)
      }else{
        this.checkPattern1=true;
        this.msgPattern=0;
        this.notifier.notify('error', resData.msg);
      }
    })
  }

  submitFunc(){
    var pattern =this.validatepattern.getPattern();
    var pattern1 =this.validatepattern1.getPattern();
    var pattern2 =this.validatepattern2.getPattern();
    var data:any = {};
    data.pattern=pattern;
    data.confirmPattern=pattern2;

    if(pattern1 === pattern2){
      if(this.match==true){
        this.dataService.postRequest('admin/changepattern', data, this.token).subscribe((resData: any) => {
          if(resData.status==1){
            this.notifier.notify('success', resData.msg);
            this.validatepattern.reset();
            this.validatepattern1.reset();
            this.validatepattern2.reset();
          }else{
            this.notifier.notify('error', resData.msg);
          }
        })
      }else{
        this.notifier.notify('error','confirm pattern is not match')
      }
    }else{
      this.notifier.notify('error','confirm pattern is not match')
    }
  }

}

