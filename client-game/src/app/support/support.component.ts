import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm,FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
declare var jQuery: any;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
token = localStorage.getItem('gAmE-t0KEN');selectedImage: any;
files:any; head:any=true;
//
Option:any;selectedOption:any ;
  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute) {
    if(!this.httpService.loggedIn()){
      this.head=false;
    }
  }

  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this.supportCat()
  }

  conPass(data:any){
    this.head = data;
    if(data == false){
      this.route.navigate(['/']);
    }
  }

  supportCat(){
    this.httpService.getUrl('support/supportCat').subscribe((resData:any) => {
      if(resData.success==1){
        this.Option=resData.userData;
      }
    })
  }

  onOptionSelected() {
  console.log('Selected option:', this.selectedOption);
}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.files=event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  executeAction(action: string, signup: NgForm): void {
    console.log(signup.value)
    if(signup.status=="INVALID"){
      this.alert.error("message","please fill the fields");
    }else{
      this.selectedOption = (this.selectedOption==undefined) ? "General" : this.selectedOption;
      // var obj={"option":this.selectedOption,"message":signup.value.Message,"img":this.selectedImage}
      const formData: FormData = new FormData();
      formData.append('username', signup.value.Username);
      formData.append('email', signup.value.email);
      formData.append('option', this.selectedOption);
      formData.append('message', signup.value.Message);
      formData.append('image', this.files);
      this.httpService.filePostRequests('support/upload',formData).subscribe((res: any)=>{
        if(res.success==1){
          this.alert.success(res.msg,'');
        }else{
          this.alert.error(res.msg,'');
        }
      })
      
      
    }
  }

}
