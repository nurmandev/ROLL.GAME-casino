import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { BackendUrl } from '../backendurl';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  redirectUrl = BackendUrl;
  private urlSource = new BehaviorSubject({});
  actUrl = this.urlSource.asObservable();
  private tabSource = new BehaviorSubject({});
  actTab = this.tabSource.asObservable();
  private proup = new BehaviorSubject({});
  data = this.proup.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private socket: Socket) { }

  activeUrl(uri:any) {
    this.urlSource.next(uri);
  }

  activeTab(uri:any) {
    this.tabSource.next(uri);
  }

  profilechange(pro:any) {
    this.proup.next(pro);
  }

  postUrl(uri:any, data:any) {
    return this.http.post(this.redirectUrl + uri, data);
  }

  getUrl(uri:any) {
    return this.http.get(this.redirectUrl + uri);
  }

  getgastracker(uri:any) {
    return this.http.get(uri);
  }

  postRequest(uri:any, data:any, token:any) {
    const headers = new HttpHeaders()
      .set('cache-control', 'no-cache')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token);
    return this.http.post(this.redirectUrl + uri, data, { headers: headers })
  }

  async postRequestUpdated(uri:any, data:any, token:any) {
    const headers = new HttpHeaders()
      .set('cache-control', 'no-cache')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token);
    return await this.http.post(this.redirectUrl + uri, data, { headers: headers }).toPromise();
  }

  checkMaintain(): Observable<any> {
    const headers = new HttpHeaders()
      .set('cache-control', 'no-cache');
    return this.http.get(this.redirectUrl + 'admin/check_maintain', { headers: headers });
  }

  filePostRequest(uri:any, data:any, token:any) {
    const headers = new HttpHeaders()
      .set('cache-control', 'no-cache')
      .set('Authorization', 'Bearer ' + token);
    return this.http.post(this.redirectUrl + uri, data, { headers: headers })
  }

  filePostRequests(uri:any, data:any) {
    return this.http.post(this.redirectUrl + uri, data)
  }

  getRequest(uri:any, token:any) {
    const headers = new HttpHeaders()
      .set('cache-control', 'no-cache')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token);
    return this.http.get(this.redirectUrl + uri, { headers: headers })
  }

  loggedIn(): boolean {
    //localStorage.setItem('ZeDXioN-TokeN','testuser'); 
    const token:any = localStorage.getItem('gAmE-t0KEN');
    if(!this.jwtHelper.isTokenExpired(token) == false) {
        localStorage.removeItem('gAmE-t0KEN');
        localStorage.removeItem('Token');
    }
    return !this.jwtHelper.isTokenExpired(token);
    return true;
    // return !!localStorage.getItem('TrOkE-VaLTokEN');
  }

  idleLogout() {
    var t:any;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;
    window.ontouchstart = resetTimer;
    window.onclick = resetTimer;
    window.onkeypress = resetTimer;
    window.addEventListener('scroll', resetTimer, true);
    function yourFunction() {
      if (localStorage.getItem('gAmE-t0KEN') != "") {
        localStorage.removeItem('gAmE-t0KEN');
        window.location.href = '/';
      }
    }
    function resetTimer() {
      clearTimeout(t);
      t = setTimeout(yourFunction, 1800000);  // time is in milliseconds
    }
  }
  /*exports.getUrl = function(){
    if(process.env.NODE_ENV == 'development'){
      var url = 'http://localhost:1201/';
    }else if(process.env.NODE_ENV == 'production'){
      var url = 'https://game.hivelancetech.com/';
    }
    return url;
  }*/



  // sendsocket(data:any) {
  //   this.socket.emit('security', data);
  // }

  // public getsocket = () => {
  //   return Observable.create((observer) => {
  //     this.socket.on('security', (message) => {
  //       observer.next(message);
  //     });
  //   });
  // }

  // public deactiveuser = () => {
  //   return Observable.create((observer) => {
  //     this.socket.on('deactive', (message:any) => {
  //       observer.next(message);
  //     });
  //   });
  // }

  // public blockip = () => {
  //   return Observable.create((observer) => {
  //     this.socket.on('check_block', (message:any) => {
  //       observer.next(message);
  //     });
  //   });
  // }

}