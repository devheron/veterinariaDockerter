import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak: Keycloak | undefined;

  async init(): Promise<boolean> {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8180',
      realm: 'veterinaria',
      clientId: 'veterinaria-frontend'
    });

    try {
      console.log('🔐 Iniciando Keycloak...');
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false
      });

    
      console.log('✅ Keycloak authenticated:', authenticated);
      if (authenticated) {
        console.log('👤 Username:', this.keycloak.tokenParsed?.['preferred_username']);
        console.log('🔑 Roles:', this.keycloak.tokenParsed?.['realm_access']?.['roles']);
        console.log('Token:', this.keycloak.token);
        console.log('Token Parsed:', this.keycloak.tokenParsed);
      }
    if (authenticated) {
  setInterval(() => {
    this.updateToken(60); // renova se faltar menos de 60s
  }, 60000); // a cada 1 minuto
}
      return authenticated;
    } catch (error) {
      console.error('💥 Keycloak init error:', error);
      return false;
    }

    
  }

  login(): Promise<void> {
    return this.keycloak?.login() || Promise.resolve();
  }

  async loginWithPassword(username: string, password: string): Promise<boolean> {
    try {
      // Faz requisição ao Keycloak através do proxy Nginx (evita CORS)
      const tokenUrl = window.location.origin + '/auth/realms/veterinaria/protocol/openid-connect/token';
      console.log('🔐 Autenticando via:', tokenUrl);
      
      
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: 'veterinaria-frontend',
          grant_type: 'password',
          username: username,
          password: password,
          scope: 'openid profile email'
        })
      });

      console.log('📡 Response status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Response data:', data);
        
        // Inicializa o Keycloak se ainda não foi inicializado
        if (!this.keycloak) {
          console.log('⚠️ Keycloak não estava inicializado, inicializando agora...');
          this.keycloak = new Keycloak({
            url: 'http://localhost:8180',
            realm: 'veterinaria',
            clientId: 'veterinaria-frontend'
          });
        }
        
        // Armazena os tokens
        this.keycloak.token = data.access_token;
        this.keycloak.refreshToken = data.refresh_token;
        this.keycloak.idToken = data.id_token;
        
        // Parse do token para obter informações do usuário
        const tokenParts = data.access_token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          (this.keycloak as any).tokenParsed = payload;
          (this.keycloak as any).authenticated = true;
          
          console.log('✅ Login bem-sucedido!');
          console.log('👤 Username:', payload.preferred_username);
          console.log('🔑 Roles:', payload.realm_access?.roles);
          console.log('🎯 Retornando true para navegação');
        }
        
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ error: 'unknown' }));
        console.error('❌ Login falhou!', errorData);
      }
      
      return false;
    } catch (error) {
      console.error('💥 Erro no login:', error);
      return false;
    }
  }

 logout(): void {
  if (this.keycloak) {
    this.keycloak.logout({ redirectUri: window.location.origin + '/login' });
  } else {
    console.error('Keycloak não está inicializado');
  }
}

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  isLoggedIn(): boolean {
    return this.keycloak?.authenticated || false;
  }

  getUsername(): string | undefined {
    return this.keycloak?.tokenParsed?.['preferred_username'];
  }

  getUserRoles(): string[] {
    return this.keycloak?.tokenParsed?.['realm_access']?.['roles'] || [];
  }

  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }

  //updateToken(minValidity: number = 30): Promise<boolean> {
  //  return this.keycloak?.updateToken(minValidity) || Promise.resolve(false);
 // }

/*updateToken(minValidity: number = 60): Promise<boolean> {
  if (!this.keycloak) return Promise.resolve(false);

  return this.keycloak.updateToken(minValidity)
    .then(refreshed => {
      if (refreshed) {
        console.log('🔄 Token renovado');
      } else {
        console.log('ℹ️ Token ainda válido');
      }
      return true;
    })
    .catch(err => {
      console.error('❌ Erro ao renovar token:', err);
      this.logout(); // força logout se falhar
      return false;
    });
}

startTokenRefreshLoop(): void {
  if (!this.keycloak) return;

  setInterval(() => {
    this.updateToken(60); // tenta renovar se faltar menos de 60s
  }, 60000); // a cada 1 minuto
}*/
updateToken(minValidity: number = 60): Promise<boolean> {
  if (!this.keycloak?.tokenParsed) return Promise.resolve(false);

  const now = Math.floor(Date.now() / 1000);
  const exp = this.keycloak.tokenParsed['exp'];
  const secondsLeft = exp - now;

  if (secondsLeft > minValidity) {
    return Promise.resolve(true);
  }

  // Tenta via keycloak-js; se falhar, cai para refresh manual
  return this.keycloak.updateToken(minValidity)
    .then(() => true)
    .catch(async () => {
      const ok = await this.refreshToken();
      if (!ok) this.logout();
      return ok;
    });
}

private async refreshToken(): Promise<boolean> {
  if (!this.keycloak?.refreshToken) return false;

  try {
    const tokenUrl = window.location.origin + '/auth/realms/veterinaria/protocol/openid-connect/token';
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: 'veterinaria-frontend',
        grant_type: 'refresh_token',
        refresh_token: this.keycloak.refreshToken!,
      })
    });

    if (!response.ok) {
      console.error('❌ Refresh token falhou:', response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    // Atualiza tokens
    this.keycloak.token = data.access_token;
    this.keycloak.refreshToken = data.refresh_token;
    this.keycloak.idToken = data.id_token;

    // Atualiza tokenParsed
    const parts = data.access_token.split('.');
    if (parts.length === 3) {
      (this.keycloak as any).tokenParsed = JSON.parse(atob(parts[1]));
      (this.keycloak as any).authenticated = true;
    }

    console.log('🔄 Refresh OK');
    return true;
  } catch (e) {
    console.error('💥 Erro no refresh:', e);
    return false;
  }
}
  
}
