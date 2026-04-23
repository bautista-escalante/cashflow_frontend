import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController  } from '@ionic/angular';
import { Router } from '@angular/router';

import {ApiService} from '../services/api.service'
@Component({
  selector: 'app-plataforma',
  templateUrl: './plataforma.page.html',
  styleUrls: ['./plataforma.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PlataformaPage implements OnInit {
  error = ""
  selectedPlataform= null
  amount = null
  plataforms: string[] = [];

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.http.get<string[]>('assets/plataforms.json')
      .subscribe(data => {
        this.plataforms = data;
      });
  }
  
  addPlataform(){
    // validar
    if(!this.amount || !this.selectedPlataform){
      this.error = "los campos no pueden estar vacios";
    }

    // consumir api
    
    this.apiService.post({
      "nombre": this.selectedPlataform,
      "saldo": this.amount
    }, "/plataformas/").subscribe({
      next: async(res) => {
        const toast = await this.toastCtrl.create({
          message: '✅ Nueva plataforma agregada!',
          duration: 2000,
          color: 'success',
          position: 'bottom'
          });
    
          await toast.present();
          this.goBack();
      },
      error: (err) => {
        console.log(err)
        this.error = err.error?.detail || "Error al agregar la plataforma";
      }
    });
  }

  goBack(){
    this.error = ""
    this.selectedPlataform = null
    this.amount = null
    this.router.navigate(["/home"])
  }
}
