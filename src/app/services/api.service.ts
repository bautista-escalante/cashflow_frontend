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
    return this.http.get(`${this.baseUrl}${endpoint}`)
  }

  getEvolucion(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/movimientos/evolucion`).pipe(
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

}
