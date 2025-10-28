import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Animal } from '../models/animal';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  http = inject(HttpClient);
  API = '/api/animal';

  constructor() { }

  // ✅ Lista todos
  findAll(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.API);
  }

  // ✅ Busca por ID
  findById(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.API}/${id}`);
  }

  // ✅ Busca por nome
  findByNome(nome: string): Observable<Animal[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Animal[]>(`${this.API}/search`, { params });
  }

  // ✅ Deletar por ID
  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API}/${id}`, { responseType: 'text' as 'json' });
  }

  // ✅ Salvar novo animal
  save(animal: Animal): Observable<string> {
    return this.http.post<string>(this.API, animal, { responseType: 'text' as 'json' });
  }

  // ✅ Atualizar animal
  update(animal: Animal, id: number): Observable<string> {
    return this.http.put<string>(`${this.API}/${id}`, animal, { responseType: 'text' as 'json' });
  }

  // animal.service.ts
teste(): Observable<string> {
  return this.http.get(`${this.API}/teste`, { responseType: 'text' });
}
}
