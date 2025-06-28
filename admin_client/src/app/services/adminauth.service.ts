import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { BackendUrl } from '../../backendurl';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AdminauthService {
  isAuth = false;
  redirectUrl = BackendUrl;

  constructor(private http: HttpClient, private dataService: ConnectionService, private jwtHelper: JwtHelperService) { }


  setSession(Key) {
    // console.log('setSession', Key);
    localStorage.setItem('Key', Key);
  }

  deleteToken() {
    localStorage.removeItem("Key");
  }

  public getToken(): string {
    return localStorage.getItem('Key');
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('Key');
    return !this.jwtHelper.isTokenExpired(token);
  }

  loggedIn() {
    return !!localStorage.getItem('Key');
  }

  checkWhite(): Observable<any> {
    const headers = new HttpHeaders().set('cache-control', 'no-cache')
    return this.http.get(this.redirectUrl + 'home/checkWhiteIp', { headers: headers })
  }
}
