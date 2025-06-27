import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from '../connection.service';
import { Countries } from '../country.js';
declare var jQuery: any;
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  token = localStorage.getItem('gAmE-t0KEN')
  cntry:any=[]; userData:any={country:"India", gender:"Male"};
  minDate: any; maxDate: any;
  filesData:any = []; proof:any = {}; proof1:any = ""; proof2:any = ""; proof3:any = ""; proof4:any = ""; proof5:any = "";
  proofErr:any = {proof1MBErr :false,proof2MBErr : false ,proof3MBErr : false, proof4MBErr : false, proof5MBErr : false,
  proof1TypeErr : true, proof2TypeErr : true, proof3TypeErr : true, proof4TypeErr : true, proof5TypeErr : true, 
  }; proofName:any={proof1:"",proof2:"",proof3:"",proof4:"",proof5:""};
  idFrtImg:any ="assets/images/id-front.svg"; idBackImg:any ="assets/images/id-back.svg";
  PassportImg :any = "assets/images/id-back.svg"; ResidenceImg :any = "assets/images/id-back.svg"; 
  ReferencesImg :any = "assets/images/id-back.svg";

  activeTab: string = "step1";
  tabdisable1:any=false;tabdisable2:any=false;tabdisable3:any=false;tabdisable4:any=false;

  constructor(private httpService: ConnectionService, private route: Router, private alert: ToastrService, private actRoute: ActivatedRoute) {
    if(!this.httpService.loggedIn()){
      this.route.navigate(['/']);
    }
  }

  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
    this.kycDetaile();
  }

  conPass(data:any){
    if(data == false){
      this.route.navigate(['/']);
    }
  }
  changeTab(tab: string) {
    if(tab=="step1"){
      this.activeTab = tab;
    }else if(tab=="step2"){
      if( this.userData.profile_status==1){
        this.activeTab = tab;
      }else{
        this.tabdisable2=true;
      }
    }else if(tab=="step3"){
      if( this.userData.id_status==1 || this.userData.passport_status==1){
        this.activeTab = tab;
      }else{
        this.tabdisable3=true;
      }
    }else{
      if( this.userData.residence_status==1){
        this.activeTab = tab;
      }else{
        this.tabdisable4=true;
      }
    }
  }

  goToNextTab(tab:any) {
    if(tab=="step2"){
      if( this.userData.profile_status==1){
        this.activeTab = tab;
      }else{
        this.tabdisable2=true;
      }
    }else if(tab=="step3"){
      if( this.userData.id_status==1 || this.userData.passport_status==1){
        this.activeTab = tab;
      }else{
        this.tabdisable3=true;
      }
    }else{
      if( this.userData.residence_status==1){
        this.activeTab = tab;
      }else{
        this.tabdisable4=true;
      }
    }
  }

  kycDetaile(){
    this.cntry = Countries;
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 109);
    this.httpService.getRequest('basic/GetProfile', this.token).subscribe((resData: any) => {
      if(resData.success == 1){
        this.userData = resData.userData;
        if(this.userData.id_proof !== "" && this.userData.id_proof1 !== ""){
          this.idFrtImg = this.userData.id_proof;this.idBackImg = this.userData.id_proof1;
        }
        if(this.userData.passport_proof !== ""){
          this.PassportImg = this.userData.passport_proof;
        }
        if(this.userData.residence_proof !== ""){
          this.ResidenceImg = this.userData.residence_proof;
        }
        if(this.userData.selfie_proof !== ""){
          this.ReferencesImg = this.userData.selfie_proof;
        }
      }else{
        this.alert.error("somthing wents wrong !");
      }
    })
  }

  executeAction(form:NgForm, type: any){
    if(form.status=="INVALID"){
      this.alert.error('Please Fill The Field') 
    }else{
      var data = form.value;
      data.zip_code = data.zip_code.toString();
      if(type == "profile"){
        this.httpService.postRequest('basic/profileupdate', data, this.token).subscribe((resData: any) => {
          if(resData.success == 1){
            this.userData = resData.userData;
            // this.goToNextTab()
            this.kycDetaile();
          }else{
            this.alert.error("failed to update user data !");
          }
        })
      }
    }
  }

  onFileSteptwo(file:any, type:any){
    const reader = new FileReader();
    if(file.files.length > 0){
      if(type == "id_card_front"){
        reader.readAsDataURL(file.files[0]);
        reader.onload = (_event) => {
          this.idFrtImg = reader.result;
        }
        this.proof1 = file.files;
        this.proofName.proof1 = file.files[0].name;
        let file_size = parseFloat(file.files[0].size) / 1024 / 1024;
        if(file_size >= 2){this.proofErr.proof1MBErr = true;}
        else{this.proofErr.proof1MBErr = false;}
        if(['image/png', 'image/jpeg', 'image/svg+xml', 'image/jpg'].includes(file.files[0].type)){
          this.proofErr.proof1TypeErr = true;
        }else{this.proofErr.proof1TypeErr = false;}
      }
      if(type == "id_card_back"){
        reader.readAsDataURL(file.files[0]);
        reader.onload = (_event) => {
          this.idBackImg = reader.result;
        }
        this.proof2 = file.files;
        this.proofName.proof2 = file.files[0].name;
        let file_size = parseFloat(file.files[0].size) / 1024 / 1024;
        if(file_size >= 2){this.proofErr.proof2MBErr = true;}else{this.proofErr.proof2MBErr = false;}
        if(['image/png', 'image/jpeg', 'image/svg+xml', 'image/jpg'].includes(file.files[0].type)){
          this.proofErr.proof2TypeErr = true;
        }else{this.proofErr.proof2TypeErr = false;}
      }
      if(type == "passport"){
        reader.readAsDataURL(file.files[0]);
        reader.onload = (_event) => {
          this.PassportImg = reader.result;
        }
        this.proof3 = file.files;
        this.proofName.proof3 = file.files[0].name;
        let file_size = parseFloat(file.files[0].size) / 1024 / 1024;
        if(file_size >= 2){this.proofErr.proof3MBErr = true;}else{this.proofErr.proof3MBErr = false;}
        if(['image/png', 'image/jpeg', 'image/svg+xml', 'image/jpg'].includes(file.files[0].type)){
          this.proofErr.proof3TypeErr = true;
        }else{this.proofErr.proof3TypeErr = false;}
      }
      if(type == "residence"){
        reader.readAsDataURL(file.files[0]);
        reader.onload = (_event) => {
          this.ResidenceImg = reader.result;
        }
        this.proof4 = file.files;
        this.proofName.proof4 = file.files[0].name;
        let file_size = parseFloat(file.files[0].size) / 1024 / 1024;
        if(file_size >= 2){this.proofErr.proof4MBErr = true;}
        else{this.proofErr.proof4MBErr = false;}
        if(['image/png', 'image/jpeg', 'image/svg+xml', 'image/jpg'].includes(file.files[0].type)){
          this.proofErr.proof4TypeErr = true;
        }else{this.proofErr.proof4TypeErr = false;}
      }
      if(type == "references"){
        reader.readAsDataURL(file.files[0]);
        reader.onload = (_event) => {
          this.ReferencesImg = reader.result;
        }
        this.proof5 = file.files;
        this.proofName.proof5 = file.files[0].name;
        let file_size = parseFloat(file.files[0].size) / 1024 / 1024;
        if(file_size >= 2){this.proofErr.proof5MBErr = true;}
        else{this.proofErr.proof5MBErr = false;}
        if(['image/png', 'image/jpeg', 'image/svg+xml', 'image/jpg'].includes(file.files[0].type)){
          this.proofErr.proof5TypeErr = true;
        }else{this.proofErr.proof5TypeErr = false;}
      }
    }
  }

  verifyStep2(type:any){
    const formData: any = new FormData();
    if(type == "IdCard"){
      var files: Array<File> = this.proof1;
      for (let i = 0; i < files.length; i++) {
        var fileName = files[i]['name'];
        var filenames = fileName.split('.');
        var lastValue = filenames.length - 1;
        var FileName = 'id_prooffrnt.' + filenames[lastValue];
        formData.append("kycProof[]", files[i], FileName);
      }
      var files2: Array<File> = this.proof2;
      for (let i = 0; i < files2.length; i++) {
        var fileName = files2[i]['name'];
        var filenames = fileName.split('.');
        var lastValue = filenames.length - 1;
        var FileName = 'id_proof1bak.' + filenames[lastValue];
        formData.append("kycProof[]", files2[i], FileName);
      }
    }else if(type == "Passport"){
      var files2: Array<File> = this.proof3;
      for (let i = 0; i < files2.length; i++) {
        var fileName = files2[i]['name'];
        var filenames = fileName.split('.');
        var lastValue = filenames.length - 1;
        var FileName = 'passport_proof.' + filenames[lastValue];
        formData.append("kycProof[]", files2[i], FileName);
      }
    }else if(type == "residence"){
      var files2: Array<File> = this.proof4;
      for (let i = 0; i < files2.length; i++) {
        var fileName = files2[i]['name'];
        var filenames = fileName.split('.');
        var lastValue = filenames.length - 1;
        var FileName = 'residence_proof.' + filenames[lastValue];
        formData.append("kycProof[]", files2[i], FileName);
      }
    }else if(type == "references"){
      var files2: Array<File> = this.proof5;
      for (let i = 0; i < files2.length; i++) {
        var fileName = files2[i]['name'];
        var filenames = fileName.split('.');
        var lastValue = filenames.length - 1;
        var FileName = 'selfie_proof.' + filenames[lastValue];
        formData.append("kycProof[]", files2[i], FileName);
      }
    }
    // console.log(formData.getAll('kycProof[]'));
    this.httpService.filePostRequest('basic/kycUpdate', formData, this.token).subscribe((res: any) => {
      if(res.success == 1){
        this.alert.success(res.msg, '', {timeOut: 2000});
        this.kycDetaile();
      }else{
        this.alert.error(res.msg, '', {timeOut: 2000});
      }
    })
  }
  
  executeAction1(type:any){
    if(type == "IdCard"){
      if((this.proofErr.proof1MBErr == false) && (this.proofErr.proof1TypeErr == true)){
        if((this.proofErr.proof2MBErr == false) && (this.proofErr.proof2TypeErr == true)){
          this.verifyStep2(type);
        }else{
          this.alert.error("Enter Valid Id proof1 within 2MB ", '', {timeOut: 2000});
        }
      }else{
        this.alert.error("Enter Valid Id proof1 within 2MB ", '', {timeOut: 2000});
      }
    }else if(type == "Passport"){
      if((this.proofErr.proof3MBErr == false) && (this.proofErr.proof3TypeErr == true)){
        this.verifyStep2(type);
      }else{
        this.alert.error("Enter Valid Id proof1 within 2MB ", '', {timeOut: 2000});
      }
    }else if(type == "residence"){
      if((this.proofErr.proof4MBErr == false) && (this.proofErr.proof4TypeErr == true)){
        this.verifyStep2(type);
      }else{
        this.alert.error("Enter Valid Id proof1 within 2MB ", '', {timeOut: 2000});
      }
    }else if(type == "references"){
      if((this.proofErr.proof5MBErr == false) && (this.proofErr.proof5TypeErr == true)){
        this.verifyStep2(type);
      }else{
        this.alert.error("Enter Valid Id proof1 within 2MB ", '', {timeOut: 2000});
      }
    }
  }
}

