import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private http = inject(HttpClient);
  apiStatus: string = 'Sistema operacional ✔️';

  cards = [
    { title: 'Total de Tutores', value: 0, icon: 'fa-users' },
    { title: 'Total de Animais', value: 0, icon: 'fa-paw' },
    { title: 'Consultas Hoje', value: 0, icon: 'fa-calendar-check' },
    { title: 'Médicos Ativos', value: 0, icon: 'fa-user-md' },
    { title: 'Vacinas Pendentes', value: 0, icon: 'fa-syringe' },
    { title: 'Próximas Consultas', value: 0, icon: 'fa-clock' }
  ];

  ngOnInit() {
    // Health check removido - endpoint não existe no backend
    // Se necessário, pode ser implementado no backend futuramente
  }
}
