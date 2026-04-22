import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  canActivate(): boolean {
    const token = this.storageService.get("token");

    if (!token) {
      this.router.navigate(["/login"]);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;

      if (Date.now() > exp) {
        this.storageService.clear();
        this.router.navigate(["/login"]);
        return false;
      }

      return true;

    } catch {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}