import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';
import Swal from 'sweetalert2';

/**
 * Guard para proteger rotas baseado em roles do Keycloak
 * 
 * Uso:
 * { path: 'rota', component: Componente, canActivate: [roleGuard], data: { roles: ['ADMIN', 'USER_SISTEMA1'] } }
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  console.log('🛡️ Role Guard ativado para:', state.url);

  // Verifica se está autenticado
  if (!keycloakService.isLoggedIn()) {
    console.log('❌ Usuário não autenticado, redirecionando para login');
    Swal.fire('Acesso Negado', 'Você precisa fazer login primeiro', 'warning');
    router.navigate(['/login']);
    return false;
  }

  // Pega as roles requeridas pela rota (definidas em app.routes.ts)
  const requiredRoles = route.data['roles'] as Array<string> || [];
  
  // Se não há roles requeridas, permite acesso
  if (requiredRoles.length === 0) {
    console.log('✅ Nenhuma role requerida, acesso permitido');
    return true;
  }

  // Pega as roles do usuário do token JWT
  const userRoles = keycloakService.getUserRoles() || [];
  console.log('👤 Roles do usuário:', userRoles);
  console.log('🔑 Roles requeridas:', requiredRoles);

  // Verifica se o usuário tem pelo menos uma das roles requeridas
  const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

  if (hasRequiredRole) {
    console.log('✅ Usuário autorizado!');
    return true;
  }

  // Acesso negado
  console.log('❌ Acesso negado! Usuário não possui as roles necessárias');
  Swal.fire({
    icon: 'error',
    title: 'Acesso Negado',
    text: `Você não tem permissão para acessar esta área. Roles necessárias: ${requiredRoles.join(', ')}`,
    confirmButtonText: 'Voltar'
  });
  
  router.navigate(['/admin/dashboard']);
  return false;
};
