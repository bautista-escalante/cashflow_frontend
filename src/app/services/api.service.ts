import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

}
