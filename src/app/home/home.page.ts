import { Router } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import {IonContent, IonButton } from '@ionic/angular/standalone';

import {ApiService} from '../services/api.service'
import {StorageService} from '../services/storage.service'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonContent],
})
export class HomePage implements OnInit{
  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit(){
  }

  OnLogout(){
    this.storageService.clear()    
    this.router.navigate(["/login"])
  }
  
  addPlataform(){
    this.router.navigate(["/plataforma"])
  }
  
  addMoviments(){
    this.router.navigate(["/movimientos"])
  }
}