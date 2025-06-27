import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalServiceService } from '../modal.service.service';
import { ConnectionService } from '../connection.service';

declare var jQuery: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  head:any=true;
  constructor(public route: Router, private modalService: ModalServiceService, private httpService: ConnectionService) {
    if(!this.httpService.loggedIn()){this.head=false;}
  }

  ngOnInit(): void {
  }
  openModel(){
    if(window.innerWidth < 850){
      jQuery("body").removeClass("renav");
    }
    this.modalService.openModal3();
  }

  helpCent(){
    // $("#chat-widget-container").attr("id");
  }
}
