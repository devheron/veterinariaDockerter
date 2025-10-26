import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../../../services/keycloak.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  router = inject(Router);
  keycloakService = inject(KeycloakService);
  
  username: string = '';
  senha: string = '';

  async logar() {
    if (!this.username || !this.senha) {
      Swal.fire('Atenção', 'Por favor, preencha usuário e senha', 'warning');
      return;
    }

    try {
      console.log('🚀 Iniciando login...');
      // Usa o Resource Owner Password Credentials Grant do Keycloak
      const success = await this.keycloakService.loginWithPassword(this.username, this.senha);
      
      console.log('🔍 Resultado do login:', success);
      
      if (success) {
        console.log('✅ Navegando para dashboard...');
        Swal.fire('Sucesso', 'Login realizado com sucesso!', 'success');
        this.router.navigate(['/admin/dashboard']);
      } else {
        console.log('❌ Login falhou, mostrando erro...');
        Swal.fire('Erro', 'Usuário ou senha inválidos', 'error');
      }
    } catch (error) {
      console.error('💥 Erro ao fazer login:', error);
      Swal.fire('Erro', 'Não foi possível conectar ao servidor de autenticação', 'error');
    }
  }
}