import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChangePasswordPage implements OnInit {
  newPasswordToCompare = "";
  newPassword = "";
  error = "";
  isLoading = false

  constructor(private apiService: ApiService, private toastCtrl: ToastController, private router: Router) { }

  ngOnInit() {
  }

  ChangePassword(){
    this.error = ""
    if(this.newPassword != this.newPasswordToCompare){
      this.error = "las contraseñas no coiciden"
    }
    this.isLoading = true
    this.apiService.changePassword(this.newPassword).subscribe({
      next: (async(res)=>{
        const toast = await this.toastCtrl.create({
          message: 'contraseña actualizada',
          duration: 2000,
          color: 'tertiary',
          position: 'bottom'
          });
    
          await toast.present();
          this.router.navigate(["/home"])
          this.isLoading = false
        }), error: ((err)=>{
          this.error = err.error.detail
          this.isLoading = false
      })
    })
    
  }
  
  goBack(){
    this.error =""
    this.newPassword=""
    this.newPasswordToCompare=""
    this.router.navigate(["/home"])
  }
}
