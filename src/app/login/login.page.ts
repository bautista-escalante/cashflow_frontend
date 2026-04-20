import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';

import {ApiService} from '../services/api.service'
import {StorageService} from '../services/storage.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  password= "";
  email = "";
  error = "";

  constructor(private router: Router, private apiService: ApiService, private storageService: StorageService) { }

  ngOnInit() {
  }

  onLogin(){
    // validar que no sean campos vacios
    if( this.email == "" || this.password == "" ){
      this.error = "los campos email y clave son necesarios"
      return
    }

    // consumir api
    this.apiService.login({
    email: this.email,
    clave: this.password
    }).subscribe({
      next: (res) => {
        // guardar token
        this.storageService.set("token", res.access_token);

        this.router.navigate(["/home"]);
      },
      error: (err) => {
        this.error = err.error?.detail || "Error al iniciar sesión";
      }
    });
    
  }

  onRegister(){
    // usando router navegamos hacia sign in
  }

}
