import { Component, OnInit, Input, NgModule, ViewChild, ElementRef } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
declare var jQuery: any;
import { ModalServiceService } from '../modal.service.service';

@Component({
  selector: 'app-provably-fair',
  templateUrl: './provably-fair.component.html',
  styleUrls: ['./provably-fair.component.css']
})
export class ProvablyFairComponent implements OnInit {
  head:any=true; MinesFirst:any=""; plunderFirst:any="";  plunderSecond:any=""; 
  CrashGame:any=true; LimboGame:any=false; KenoGame:any=false; WheelGame:any=false; MinesGame:any=false; CaveOfPlunderGame:any=false;RouletteGame:any=false; CoinFlipGame:any=false; RingofFortuneGame:any=false; SwordGame:any=false;
  acttab:any='fair';
  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute,private modalService: ModalServiceService) { 
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
    this.actRoute.params.subscribe((params: any) => {
      var activeTab = this.actRoute.snapshot.queryParamMap.get('type');
      if(activeTab != null && activeTab != undefined && activeTab != ""){
          this.acttab = activeTab;
      }
    });
  }

  openModal() {
    this.modalService.openModal();
  }

  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this.MinesFirst = "const crypto = require('crypto');\n\nfunction getResult(hash) {\n const allNums = [7, 2, 19, 25, 1, 13, 5, 24, 14, 6, 15, 9, 22, 16, 3, 17, 18, 20, 8, 21, 4, 12, 10, 23, 11,];\n let seed = hash;\n let finalNums = createNums(allNums, seed);\n seed = crypto.createHash('SHA256').update(seed).digest('hex');\n finalNums = createNums(finalNums, seed);\n return finalNums.map((m) => m.num.num);\n}\n\nfunction createNums(allNums, hash) {\n let nums = [];\n let h = crypto.createHash('SHA256').update(hash).digest('hex');\n allNums.forEach((c) => {\n  nums.push({ num: c, hash: h });\n  h = h.substring(1) + h.charAt(0);\n });\n\n nums.sort(function (o1, o2) {\n  if (o1.hash < o2.hash) {\n  return -1;\n  } else if (o1.hash === o2.hash) {\n  return 0;\n  } else {\n  return 1;\n }\n });\n return nums;\n}\n\nfunction main (serverSeed, clientSeed, nonce) {\n let resultArr = [clientSeed, nonce];\n let hmacSha256Result = crypto.createHmac('sha256', serverSeed).update(resultArr.join(':'')).digest('hex)\n let resultList = getResult(hmacSha256Result);\n console.log(resultList);\n}\n\n// main('server seed', 'client seed', 'nonce');";
    this.plunderFirst = "function get (serverSeed, clientSeed, nonce) {\n  var hash = hmac_sha512(this.client_seed + ':' +this.nonce, this.server_seed);\n  var index = 0;\n  do {\n    var lucky = parseInt (hash.substr (index, 5), 16);\n    index + = 5;\n  } while (lucky> = 1000000);\n  return lucky;\n}"
    this.plunderSecond = "function get (serverSeed, clientSeed, nonce) {\n  var hash = hmac_sha512(this.client_seed + ':' +this.nonce, this.server_seed);\n  var lucky = parseInt (hash.substr (0, 10), 16);\n  return lucky%5;\n}"
  }
  conPass(data:any){
    this.head = data;
  }

  onclick(val:any){
    this.CrashGame=false; this.LimboGame=false;this.KenoGame=false;this.WheelGame=false;this.MinesGame=false;this.CaveOfPlunderGame=false;this.RouletteGame=false;this.CoinFlipGame=false; this.RingofFortuneGame=false; this.SwordGame=false;
    this[val.value+"Game"] = true;
  }

}