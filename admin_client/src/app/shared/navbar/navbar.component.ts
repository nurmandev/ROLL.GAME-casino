import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ConnectionService } from '../../connection.service';
import { AdminauthService } from '../../services/adminauth.service';
import { NotifierService } from 'angular-notifier';
import { ToastrService } from 'ngx-toastr';

import Web3 from 'web3';
declare let window:any;
declare var jQuery: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {
  public iconOnlyToggled = false;
  public sidebarToggled = false;
  
  isConnected = false;
  isLogin = false;
  adminAddr: any;
  address: any;
  userLogin: any;

  constructor(config: NgbDropdownConfig, private notifier: NotifierService, private toastr: ToastrService) {
    config.placement = 'bottom-right';
  }

  ngOnInit() {
    this.address = localStorage.getItem("adminAddr");
    this.userLogin = localStorage.getItem("Key");
    if(this.address != null) {
      this.isConnected = true;
      var first = this.address.substr(0, 4);
      var second = this.address.slice(-6);
      this.adminAddr = first+'..'+second;
    }
    if(this.userLogin) {
      this.isLogin = true;
    }
  }

  // toggle sidebar in small devices
  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  // toggle sidebar
  toggleSidebar() {
    let body = document.querySelector('body');
    if((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if(this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if(this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  // onConnectMetamask(){
  //   let provider = window.ethereum;
  //   if(typeof provider !== 'undefined') {
  //     provider.request({ method: 'eth_requestAccounts' }).then((accounts: any[]) => {
  //       let selectedAccount = accounts[0];
  //       this.isConnected = true;
  //       localStorage.setItem("adminAddr", selectedAccount);
  //       this.address = selectedAccount;
  //       var first = selectedAccount.substr(0, 4);
  //       var second = selectedAccount.slice(-6);
  //       this.adminAddr = first+'..'+second;
  //       const form = { address:selectedAccount,connecttype:'Metamask'}
  //       this.notifier.notify('success', "Wallet connected");
  //     }).catch((err: any) => {
  //       this.notifier.notify('error', err.message);
  //       return;
  //     });

  //     window.ethereum.on('accountsChanged', function (accounts: any[]) {
  //       let selectedAccount = accounts[0];
  //     });
  //   } else {
  //     this.notifier.notify('error', 'Install metamask extension on your browser');
  //   }
  // }

  // disconnectMetamask() {
  //   this.isConnected = false;
  //   localStorage.removeItem("adminAddr"); 
  //   this.notifier.notify('success', 'Wallet disconnected');
  // }

  // toggle right sidebar
  // toggleRightSidebar() {
  //   document.querySelector('#right-sidebar').classList.toggle('open');
  // }

}
