import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController} from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MovementsPage implements OnInit {

  plataforms: any;
  selectedPlataform="";
  selectedOperation = ""
  error = ""
  amount = null;
  selectedDestination: any
  selectedOrigin:any
  selectedCategories = ""
  categories:any
  description=""

  constructor(private apiService: ApiService, private http: HttpClient, 
    private toastCrl: ToastController, private router: Router) {}
  
  async showToast() {
    let toast = await this.toastCrl.create({
      "message": "movimiento agregado exitosamente",
      "color": "tertiary",
      "duration": 1500,
      "position": "bottom"
    });
    toast.present()
  }

  ngOnInit() {
    this.apiService.get("/plataformas/").subscribe({
      next: (res)=>{
        this.plataforms = res
      },
      error:(err)=>{
        this.error = err.error?.detail || "Error al cargar las plataformas";
      }
    });

     this.http.get<string[]>('assets/categories.json')
      .subscribe(data => {
        this.categories = data;
      });
  }

  onAdd(){

    // validar ANTES
    // los campos no esten vacios
    // siempre i cuando lo requieran

    if(this.selectedOperation !== "permutacion"){
        this.apiService.post({
          "tipo": this.selectedOperation,
          "monto": this.amount,
          "plataforma_id": this.selectedPlataform,
          "categoria": this.selectedCategories,
          "descripcion": this.description
        }, "/movimientos/").subscribe({
          next:async(res)=>{
            await this.showToast()
            this.router.navigate(["/home"])
            // redirijir a home y borrar todo 
          },
          error:(err)=>{
            this.error = err.error?.detail || "errro al agrergar el movimiento"
          }
        })
        
    }else{

      let uri = "" 
      if(this.selectedOrigin.id == this.selectedDestination.id){
        this.error = "las plataformas no pueden ser la misma"
      }
      if(this.selectedDestination.nombre == "Dólares" || this.selectedOrigin.nombre == "Dólares"){
        uri = "/movimientos/permutacion_dolar/"
      
      }else{
        uri = "/movimientos/permutacion/"
      }

      this.apiService.post({
        "tipo": this.selectedOperation,
        "monto": this.amount,
        "plataforma_origen_id": this.selectedOrigin.id,
        "plataforma_destino_id": this.selectedDestination.id
      }, uri).subscribe({
        next: async(res)=>{
          await this.showToast()
          this.router.navigate(["/home"])
        },
        error:(err)=>{
          this.error =  err.error?.detail || "errro al agrergar el movimiento"
        },
      })
    }
  }
}
