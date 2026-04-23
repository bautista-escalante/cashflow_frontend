import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  set(key: string, value: any) {
    if (typeof value === 'string') {
      sessionStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

  get(key: string) {
    const data = sessionStorage.getItem(key);
    console.log(data)
    if (!data) return null;

    try {
      return JSON.parse(data);

    } catch {

      return data;
    }
  }
  remove(key: string) {
    sessionStorage.removeItem(key);
  }

  clear() {
    sessionStorage.clear();
  }
}