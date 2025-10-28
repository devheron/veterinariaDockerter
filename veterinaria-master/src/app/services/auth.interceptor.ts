import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { KeycloakService } from './keycloak.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private keycloakService = inject(KeycloakService);

 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  if (!req.url.includes('/api')) return next.handle(req);
  if (!this.keycloakService.isLoggedIn()) return next.handle(req);

  return from(this.keycloakService.updateToken(60)).pipe(
    switchMap(() => {
      const token = this.keycloakService.getToken();
      const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      return next.handle(authReq);
    })
  );
}
}
