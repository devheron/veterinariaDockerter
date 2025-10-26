import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medico } from '../models/medico';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private API = '/api/medico';
  constructor(private http: HttpClient) {}

  findAll(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.API);
  }
  findById(id: number): Observable<Medico> {
    return this.http.get<Medico>(`${this.API}/${id}`);
  }
  findByNome(nome: string): Observable<Medico[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Medico[]>(`${this.API}/search`, { params });
  }
  findByCrm(crm: string): Observable<Medico[]> {
    const params = new HttpParams().set('crm', crm);
    return this.http.get<Medico[]>(`${this.API}/search`, { params });
  }
  create(medico: Medico): Observable<string> {
    return this.http.post<string>(this.API, medico, { responseType: 'text' as 'json' });
  }
  update(medicoOrId: any, maybeMedico?: any): Observable<string> {
    let id: number;
    let medico: Medico;
    if (typeof medicoOrId === 'number') { id = medicoOrId as number; medico = maybeMedico as Medico; }
    else { medico = medicoOrId as Medico; id = maybeMedico as number; }
    return this.http.put<string>(`${this.API}/${id}`, medico, { responseType: 'text' as 'json' });
  }
  // compatibility
  save(medico: Medico): Observable<string> { return this.create(medico); }
  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API}/${id}`, { responseType: 'text' as 'json' });
  }
}
