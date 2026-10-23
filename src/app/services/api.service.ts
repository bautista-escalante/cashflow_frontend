import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  baseUrl = "https://cashflow-backend-bhya.onrender.com";
  constructor(private http: HttpClient, private storageService: StorageService) {}

  post(body: any, endpoint: string): Observable<any> {
    return this.http.post(`${this.baseUrl}${endpoint}`, body);
  }

  get(endpoint: string){
    return this.http.get(`${this.baseUrl}${endpoint}`);
  }
  
  getWithParams(endpoint: string, param?: any){
    return this.http.get(`${this.baseUrl}${endpoint}`,{ params: param });
  }

  getEvolucion(mes: number, anio: number, incluir_dolares:boolean ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/movimientos/evolucion`,
      {
        params: {
          mes: mes.toString(),
          anio: anio.toString(),
          incluir_dolares: incluir_dolares
        }
      }
    ).pipe(
      map(data => data.map(d => ({
        label: `${new Date(d.fecha).getDate()}/${new Date(d.fecha).getMonth() + 1}`,
        value: d.saldo
      })))
    );
  }

  changePassword(newPassword: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/usuarios/`,
      { clave: newPassword }
      );
  }

  deleteMovement(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/movimientos/`, { params: { movimiento_id: id.toString() } });
  }

  getMovementById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movimientos/${id}`);
  }

  modifyMovement(id: number, descripcion: string): Observable<any> {
    console.log(`Modifying movement with ID: ${id}, new description: ${descripcion}`); 
    return this.http.put(`${this.baseUrl}/movimientos/`, null, {
      params: { movimiento_id: id, descripcion },
    });
  }
}
