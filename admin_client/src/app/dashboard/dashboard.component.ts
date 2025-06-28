import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  token = localStorage.getItem('Key');
  isLoading = false;
  dashboard: any;
  toggleProBanner(event) {
    event.preventDefault();
    document.querySelector('body').classList.toggle('removeProbanner');
  }

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService) { 
    if (this.conn.isAuthenticated()) {
      this.dataService.getRequest('admin/adminDashboard', this.token).subscribe(res => {
        if(res) {
          this.dashboard = res;
          this.isLoading = true;
        }
      })
    } else {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit() {
  }

}
