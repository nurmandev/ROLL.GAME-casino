import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackendUrl } from '../backendurl';
import { ApiUrl } from '../backendurl';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  redirectUrl = BackendUrl;
  apiUrl = ApiUrl;
  private proup = new BehaviorSubject({});
  data = this.proup.asObservable();

  private siteup = new BehaviorSubject({});
  sitesetting = this.siteup.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  profilechange(pro) {
    this.proup.next(pro);
  }
  sitesettings(site) {
    this.siteup.next(site);
  }
  chklogin(params) {
    return this.http.post(this.redirectUrl + 'admin/chklogin', params);
  }

  setSession(setData) {
    // console.log('setData', setData);
    this.cookieService.set('RollGameAdmin_ID', setData.session);
    this.cookieService.set('RollGameAdmin_Role', setData.role);
  }

  getSession(type) {
    if (type == 'role') {
      var getData = this.cookieService.get('RollGameAdmin_Role');
    } else {
      var getData = this.cookieService.get('RollGameAdmin_ID');
    }
    return getData;
  }

  unsetSession() {
    this.cookieService.deleteAll();
    return 'aa';
  }

  loggedIn() {
    return !!localStorage.getItem('Key');
  }

  getData(url): Observable<any> {
    return this.http.get(this.redirectUrl + url);
  }

  loadData(url, params): Observable<any> {
    return this.http.post(this.redirectUrl + url, params);
  }

  importData(url, values): Observable<any> {
    values['authid'] = this.getSession('id');
    return this.http.post(this.redirectUrl + url, values);
  }

  getRequest(uri:any, token:any) {
    const headers = new HttpHeaders()
    .set('cache-control', 'no-cache')
    .set('content-type', 'application/json')
    .set('Authorization', 'Bearer ' + token);
    return this.http.get(this.redirectUrl + uri, { headers: headers })
  }

  postRequest(uri, data, token) {
    const headers = new HttpHeaders()
    .set('cache-control', 'no-cache')
    .set('content-type', 'application/json')
    .set('Authorization', 'Bearer ' + token);
    return this.http.post(this.redirectUrl + uri, data, { headers: headers })
  }

  filePostRequest(uri, data, token) {
    const headers = new HttpHeaders()
    .set('cache-control', 'no-cache')
    .set('Authorization', 'Bearer ' + token);
    return this.http.post(this.redirectUrl + uri, data, { headers: headers })
  }

  idleLogout() {
    var t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;
    window.ontouchstart = resetTimer;
    window.onclick = resetTimer;
    window.onkeypress = resetTimer;
    window.addEventListener('scroll', resetTimer, true);

    function yourFunction() {
      localStorage.clear();
      window.location.href = '/';
    }

    function resetTimer() {
      clearTimeout(t);
      t = setTimeout(yourFunction, 3600000);  // time is in milliseconds
    }
  }
}
