import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendUrl } from '../backendurl';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  //host = "http://localhost:13578";
  host = "https://api.rollgame.io";
  socket:any;

  constructor(private mysocket: Socket, private http: HttpClient, private route: Router) { }

  connectApi(): any {
    if(this.socket != undefined) {
      this.socket.close();
    }
    //this.socket = io("http://localhost:13578", { transports: ['websocket', 'polling'] });
    this.socket = io("https://api.rollgame.io", { transports: ['websocket', 'polling'] });
    return new Observable(observer => {
      observer.next(true);
    });
  }

  disconnectApi(): any {
    if(this.socket != undefined) {
      this.socket.close();
    }
  }

  getMobSkt(api): Observable<any> {
    return new Observable(observer => {
      if (this.socket != undefined) {
        this.socket.on(api, (res) => {
          observer.next(res);
        });
      }
    });
  }
}