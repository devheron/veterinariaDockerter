import { Component, inject } from '@angular/core';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { Router, RouterModule } from '@angular/router';
import { KeycloakService } from '../../../services/keycloak.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MdbCollapseModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  router = inject(Router);
  keycloakService = inject(KeycloakService);

  logout() {
    this.keycloakService.logout();
  }
}