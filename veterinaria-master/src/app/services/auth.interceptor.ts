import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { KeycloakService } from './keycloak.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private keycloakService = inject(KeycloakService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Se não estiver logado ou não for uma requisição para /api, segue sem token
    if (!this.keycloakService.isLoggedIn() || !req.url.includes('/api')) {
      return next.handle(req);
    }

    // Atualiza o token se necessário e anexa nas requisições
    return from(this.keycloakService.updateToken()).pipe(
      switchMap(() => {
        const token = this.keycloakService.getToken();
        if (token) {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(authReq);
        }
        return next.handle(req);
      })
    );
  }
}
