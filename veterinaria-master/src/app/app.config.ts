import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { KeycloakService } from './services/keycloak.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { inject } from '@angular/core';

export function initializeKeycloak(keycloak: KeycloakService) {
  return async () => {
    const authenticated = await keycloak.init();
    
    // Se estiver autenticado e na rota login, redireciona para dashboard
    if (authenticated && window.location.pathname === '/login') {
      const router = inject(Router);
      router.navigate(['/admin/dashboard']);
    }
    
    return true;
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
