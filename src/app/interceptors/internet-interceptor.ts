import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';

export const internetInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        return throwError(() =>
          new HttpErrorResponse({
            error: 'Sin conexión a Internet',
            status: 0,
            statusText: 'Offline'
          })
        );
      }
      return throwError(() => error);
    })
  );
};