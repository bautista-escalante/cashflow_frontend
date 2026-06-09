import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule  } from '@angular/common';
import { Chart, registerables } from 'chart.js';

import {ApiService} from '../services/api.service'
import {StorageService} from '../services/storage.service'

Chart.register(...registerables);
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule ],
})
export class HomePage implements OnInit, AfterViewInit {
  movements:any
  expenses:any
  chartData:any
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  year = new Date().getFullYear();
  mount = new Date().getMonth();
  platforms :any = []

  constructor(private router: NavController, private storageService: StorageService, private apiService: ApiService) {}

  ngAfterViewInit() {
    this.apiService.getEvolucion().subscribe(data => {
    this.chartData = data;
    this.crearGrafico();
  });
  }

  ngOnInit(){
    return this.apiService.get("/plataformas/").subscribe({
      next:((res)=>{
        console.log(res)
        this.platforms=res
        
      }), error:((err)=>{
        console.log(err)
      })
    })
  }

  OnLogout(){
    this.storageService.clear()    
    this.router.navigateForward(["/login"])
  }
  
  addPlataform(){
    this.router.navigateForward(["/plataforma"])
  }
  
  addMoviments(){
    this.router.navigateForward(["/movimientos"])
  }
  
  changePassword(){
    this.router.navigateForward(["/change-password"])
  }

  crearGrafico() {

    if (!this.barCanvas) return;

    // destruir si ya existe
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.chartData.map((d:any) => d.label);
    const data = this.chartData.map((d:any) => d.value);

    this.chart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Saldo',
            data: data,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  cargarGastos(){
    
  }
}