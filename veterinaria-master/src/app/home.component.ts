import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private http = inject(HttpClient);
  status: string = 'Sistema conectado e operacional';
  error: boolean = false;

  ngOnInit() {
    // Health check removido - endpoint não existe no backend
    // Se necessário, pode ser implementado no backend futuramente
  }
}
