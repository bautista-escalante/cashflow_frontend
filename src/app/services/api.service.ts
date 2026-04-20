import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  baseUrl = "https://cashflow-backend-bhya.onrender.com";
  constructor(private http: HttpClient) {}

  login(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/auth`, body);
  }

}
