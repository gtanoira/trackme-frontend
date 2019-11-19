/*
  Esta rutina intercepta todos los HTTP REQUESTS, realizando lo siguiente:
  1) agrega un "Authorization Bearer ...." con el id de sesión enviada por el backend
*/
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

// Services

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // All API calls
    if (req.url.includes('/api')) {
        const token = sessionStorage.getItem('jwtToken');

      if (token) {
        const newReq = req.clone({
          headers: req.headers.set(
            'Authorization', `jwt ${token}`
          )
        });
        return next.handle(newReq);
      }
    }
    return next.handle(req);
  }
}

