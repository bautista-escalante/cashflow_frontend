import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';

import {ApiService} from '../services/api.service'
import {StorageService} from '../services/storage.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonContent, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  password= "";
  email = "";
  error = "";
  isLoading = false

  constructor(private router: Router, private apiService: ApiService, private storageService: StorageService) { }

  ngOnInit() {
  }

  onLogin(){
    // validar que no sean campos vacios
    if( this.email == "" || this.password == "" ){
      this.error = "los campos email y clave son necesarios"
      return
    }
    this.isLoading = true

    // consumir api
    this.apiService.post({
    email: this.email,
    clave: this.password
    }, "/usuarios/auth").subscribe({
      next: (res) => {
        // guardar token
        this.storageService.set("token", res.access_token);
        this.isLoading=false
        this.router.navigate(["/home"]);
      },
      error: (err) => {
        this.error = err.error?.detail || "Error al iniciar sesión";
        this.isLoading=false
      }
    });
  }

  onRegister(){
    this.error = ""
    this.email=""
    this.password=""
    this.router.navigate(["/register"]);
  }

}
