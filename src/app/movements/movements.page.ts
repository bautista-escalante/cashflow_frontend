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

  plataforms: any = [];
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

    this.error = "";

    // 1. Tipo de operación
    if (!this.selectedOperation) {
      this.error = "Seleccioná un tipo de operación";
      return;
    }

    // 2. Monto
    if (this.amount == null || this.amount === "" || this.amount <= 0) {
      this.error = "Ingresá un monto válido mayor a 0";
      return;
    }

    // 3. GASTO
    if (this.selectedOperation === "gasto") {
      if (!this.selectedCategories) {
        this.error = "Seleccioná una categoría";
        return;
      }
    }

    // 4. INGRESO o GASTO
    if (this.selectedOperation !== "permutacion") {

      if (!this.description || this.description.trim().length < 3) {
        this.error = "La descripción debe tener al menos 3 caracteres";
        return;
      }

      if (!this.selectedPlataform) {
        this.error = "Seleccioná una plataforma";
        return;
      }
    }

    // 5. PERMUTACIÓN
    if (this.selectedOperation === "permutacion") {

      if (!this.selectedOrigin) {
        this.error = "Seleccioná la plataforma de origen";
        return;
      }

      if (!this.selectedDestination) {
        this.error = "Seleccioná la plataforma de destino";
        return;
      }

      if (this.selectedOrigin === this.selectedDestination) {
        this.error = "El origen y destino no pueden ser iguales";
        return;
      }
    }

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
          },
          error:(err)=>{
            this.error = err.error?.detail || "errro al agrergar el movimiento"
          }
        })
        
    }else{

      let uri = "" 
      if(this.selectedDestination.nombre == "dólares" || this.selectedOrigin.nombre == "dólares"){
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
          this.error = ""
          this.selectedCategories = ""
          this.selectedDestination=""
          this.selectedOperation=""
          this.amount=null
          this.description = ""
          this.selectedPlataform=""
        },
        error:(err)=>{
          this.error =  err.error?.detail || "error al agrergar el movimiento"
        },
      })
    }
  }
}
