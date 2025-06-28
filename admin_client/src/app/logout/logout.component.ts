import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { NotifierService } from 'angular-notifier';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {

  returnUrl: string; 
  constructor(private router: Router,private dataService: ConnectionService, private notifier: NotifierService, private toastr: ToastrService) { }

  ngOnInit() {
    this.toastr.error('sucussfully logout!');
    this.dataService.unsetSession();
    localStorage.clear();
    return this.router.navigateByUrl(this.returnUrl); 
  }

}
