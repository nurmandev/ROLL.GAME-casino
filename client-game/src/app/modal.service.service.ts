import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {
  private showModalSource = new Subject<void>();
  showModal$ = this.showModalSource.asObservable();

  private showModalSource1 = new Subject<void>();
  showModal1$ = this.showModalSource1.asObservable();

  private showModalSource2 = new Subject<void>();
  showModal2$ = this.showModalSource2.asObservable();

  private showModalSource3 = new Subject<void>();
  showModal3$ = this.showModalSource3.asObservable();

  private showModalSource4 = new Subject<void>();
  showModal4$ = this.showModalSource4.asObservable();

  constructor() { }

  // withdraw
  openModal() {
    this.showModalSource.next();
  }

  //sigin
  openModal1() {
    this.showModalSource1.next();
  } 

  //signup
  openModal2() {
    this.showModalSource2.next();
  }

  //Referral Data
  openModal3() {
    this.showModalSource3.next();
  }

  //LoginCheck
  loginSet() {
    this.showModalSource4.next();
  }
}