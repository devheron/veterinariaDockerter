import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tutor } from '../models/tutor';

@Injectable({ providedIn: 'root' })
export class TutorService {
  private API = '/api/tutor';
  constructor(private http: HttpClient) {}

  findAll(): Observable<Tutor[]> {
    return this.http.get<Tutor[]>(this.API);
  }
  findById(id: number): Observable<Tutor> {
    return this.http.get<Tutor>(`${this.API}/${id}`);
  }
  findByNome(nome: string): Observable<Tutor[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Tutor[]>(`${this.API}/search`, { params });
  }
  create(tutor: Tutor): Observable<string> {
    return this.http.post<string>(this.API, tutor, { responseType: 'text' as 'json' });
  }
  update(tutorOrId: any, maybeTutor?: any): Observable<string> {
    let id: number;
    let tutor: Tutor;
    if (typeof tutorOrId === 'number') { id = tutorOrId as number; tutor = maybeTutor as Tutor; }
    else { tutor = tutorOrId as Tutor; id = maybeTutor as number; }
    return this.http.put<string>(`${this.API}/${id}`, tutor, { responseType: 'text' as 'json' });
  }
  // compatibility
  save(tutor: Tutor): Observable<string> { return this.create(tutor); }
  deleteById(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API}/${id}`, { responseType: 'text' as 'json' });
  }
}
