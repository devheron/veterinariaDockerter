import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vacina } from '../models/vacina';

@Injectable({ providedIn: 'root' })
export class VacinaService {
  private API = '/api/vacina';
  constructor(private http: HttpClient) {}

  findAll(): Observable<Vacina[]> {
    return this.http.get<Vacina[]>(this.API);
  }
  findById(id: number): Observable<Vacina> {
    return this.http.get<Vacina>(`${this.API}/${id}`);
  }
  findByNome(nome: string): Observable<Vacina[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Vacina[]>(`${this.API}/search`, { params });
  }
  create(vacina: Vacina): Observable<string> {
    return this.http.post<string>(this.API, vacina, { responseType: 'text' as 'json' });
  }
  update(vacinaOrId: any, maybeVacina?: any): Observable<string> {
    let id: number;
    let vacina: Vacina;
    if (typeof vacinaOrId === 'number') { id = vacinaOrId as number; vacina = maybeVacina as Vacina; }
    else { vacina = vacinaOrId as Vacina; id = maybeVacina as number; }
    return this.http.put<string>(`${this.API}/${id}`, vacina, { responseType: 'text' as 'json' });
  }
  // compatibility
  save(vacina: Vacina): Observable<string> { return this.create(vacina); }
  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API}/${id}`, { responseType: 'text' as 'json' });
  }
}
