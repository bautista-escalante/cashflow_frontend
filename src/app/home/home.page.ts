import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { IonicModule, NavController, IonContent } from '@ionic/angular';
import { CommonModule  } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { concatMap, filter, take, toArray } from 'rxjs/operators';
import { from } from 'rxjs';

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
  categorySummary: { categoria: string; total: number }[] = [];
  chartData:any
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild(IonContent) content!: IonContent;
  chart!: Chart;
  pieChart!: Chart;
  year = new Date().getFullYear();
  mount = new Date().getMonth();
  platforms :any = []
  categories :any = []

  private palette = ['#5260ff', '#eb445a', '#ffc409', '#3dc2ff', '#2dd36f'];

  constructor(private router: NavController, private storageService: StorageService, private apiService: ApiService, 
    private http: HttpClient
  ) {}



  ngOnInit() {
    this.loadData();
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

  categoryColor(i: number): string {
    return this.palette[i % this.palette.length];
  }

  makeBarChart() {

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

  makePieChart() {
    if (!this.pieCanvas || !this.categorySummary?.length) return;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const labels = this.categorySummary.map((c) => c.categoria);
    const data = this.categorySummary.map((c) => c.total);
    const colors = this.categorySummary.map((_, i) => this.categoryColor(i));

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }, // ya tenés tu propia leyenda en HTML
      },
    });
  }

  searchPlatform(id: number): string {
    return this.platforms.find((p: any) => p.id === id)?.nombre ?? 'Sin plataforma';
  }

  private loadData() {
    this.apiService.get('/movimientos/').subscribe({
      next: (res:any) => {
        this.movements = res.reverse();
      },
      error: (err) => console.log(err),
    });

    this.apiService.get('/plataformas/').subscribe({
      next: (res) => {
        this.platforms = res;
      },
      error: (err) => console.log(err),
    });

    this.http.get<string[]>('assets/categories.json').subscribe(data => {
      this.categories = data;
      from(this.categories).pipe(
        concatMap((category: any) =>
          this.apiService.get(`/movimientos/gastos?mes=${this.mount + 1}&anio=${this.year}&categoria=${category["nombre"]}`)
        ),
        filter((res: any) => res && res.length > 0),
        take(5),
        toArray()
      ).subscribe({
        next: (resultados: any[]) => {
          this.expenses = resultados;

          // cada elemento de 'resultados' es un array de movimientos de UNA
          // categoría (así responde /movimientos/gastos) — hay que sumar
          // 'monto' dentro de cada grupo para armar el resumen por categoría
          this.categorySummary = resultados.map((group: any[]) => ({
            categoria: group[0]?.categoria ?? 'Otros',
            total: group.reduce((sum, m) => sum + m.monto, 0),
          }));

          this.makePieChart();
        },
        error: (err) => console.log(err),
      });
    });
  }

  private loadChart() {
    this.apiService.getEvolucion(this.mount + 1, this.year).subscribe((data) => {
      this.chartData = data;
      this.makeBarChart();
    });
    this.loadData()
  }

  ionViewWillEnter() {
  console.log('ionViewWillEnter disparado', new Date().toISOString());
  this.content?.scrollToTop(0);
  this.loadData();
  this.loadChart();
  }

  async ngAfterViewInit() {
    this.loadChart();

    const scrollEl = await this.content.getScrollElement();
    console.log('scrollTop inicial:', scrollEl.scrollTop);

    scrollEl.addEventListener('scroll', () => {
      console.log('scrollTop cambió a:', scrollEl.scrollTop, new Date().toISOString());
    });

    // por si el salto es por resize de algo (chart, imagen, lo que sea)
    new ResizeObserver(() => {
      console.log('algo cambió de tamaño en el contenido, scrollTop ahora:', scrollEl.scrollTop);
    }).observe(scrollEl);
  }

  onIonInfinite(){

  }

}