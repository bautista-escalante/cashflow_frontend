import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import {ApiService} from '../services/api.service'
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [ IonContent, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {

  passwordConfirm = "";
  password = "";
  email = "";
  error = "";
  name = "";

  constructor(private router: Router, private apiService: ApiService,) { }

  ngOnInit() {
  }

  onRegister(){
    // validar
    if(!this.password || !this.passwordConfirm || !this.name || !this.email){
      this.error = "todos los campos son requeridos";
    }
    
    if(this.password !== this.passwordConfirm){
      this.error = "las claves no coinciden"
    }

    // consumir api 
     this.apiService.post({
    "nombre": this.name,
    "clave": this.password,
    "email": this.email
    }, "/usuarios").subscribe({
      next: (res) => {
        console.log(res)
        this.router.navigate(["login"]);
      },
      error: (err) => {
        this.error = err.error?.detail || "Error al crear la cuenta";
      }
    });
  }

  onLogin(){
    this.router.navigate(["/login"])
  }

}
