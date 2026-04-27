import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const token = sessionStorage.getItem('token');

  let clonedReq = req;

  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((error) => {

      if (error.status === 401 || error.error?.detail === "Token expirado") {
        console.log("Token expirado o inválido");

        sessionStorage.removeItem('token');

        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};