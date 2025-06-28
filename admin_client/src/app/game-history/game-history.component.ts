import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { AdminauthService } from '../services/adminauth.service';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss']
})

export class GameHistoryComponent implements OnInit {
token = localStorage.getItem('Key');
isLoading = false;
history: any;

  constructor(private dataService: ConnectionService, private router: Router, private conn: AdminauthService) { 
    if (this.conn.isAuthenticated()) {
      this.dataService.getRequest('history/historyDashboard', this.token).subscribe(res => {
        if(res) {
          this.history = res;
          this.isLoading = true;
        }
      })
    } else {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
  }

}
