import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consulta } from '../models/consulta';

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private API = '/api/consulta';
  constructor(private http: HttpClient) {}

  findAll(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(this.API);
  }
  findById(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.API}/${id}`);
  }
  // Filtros opcionais
  search(paramsObj: { animalId?: number; medicoId?: number; data?: string }): Observable<Consulta[]> {
    let params = new HttpParams();
    if (paramsObj.animalId != null) params = params.set('animalId', paramsObj.animalId);
    if (paramsObj.medicoId != null) params = params.set('medicoId', paramsObj.medicoId);
    if (paramsObj.data) params = params.set('data', paramsObj.data); // 'YYYY-MM-DD'
    return this.http.get<Consulta[]>(`${this.API}/search`, { params });
  }
  create(consulta: Consulta): Observable<string> {
    return this.http.post<string>(this.API, consulta, { responseType: 'text' as 'json' });
  }
  update(consultaOrId: any, maybeConsulta?: any): Observable<string> {
    let id: number;
    let consulta: Consulta;
    if (typeof consultaOrId === 'number') {
      id = consultaOrId as number;
      consulta = maybeConsulta as Consulta;
    } else {
      consulta = consultaOrId as Consulta;
      id = maybeConsulta as number;
    }
    return this.http.put<string>(`${this.API}/${id}`, consulta, { responseType: 'text' as 'json' });
  }
  // backwards-compatible API
  save(consulta: Consulta): Observable<string> {
    return this.create(consulta);
  }
  // legacy name used by some components
  findByDescricao(descricao: string): Observable<Consulta[]> {
    let params = new HttpParams().set('descricao', descricao);
    return this.http.get<Consulta[]>(`${this.API}/search`, { params });
  }
  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API}/${id}`, { responseType: 'text' as 'json' });
  }
}
