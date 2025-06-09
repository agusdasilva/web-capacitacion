import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Examen } from '../../../core/models';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamenesService {
  private apiUrl = `${environment.apiUrl}/examenes`;

  constructor(private http: HttpClient) {}

  // Lista exámenes disponibles para el usuario
  listarDisponibles(): Observable<Examen[]> {
    return this.http.get<Examen[]>(this.apiUrl);
  }

  // Para el admin: listar todos
  listarAdmin(): Observable<Examen[]> {
    return this.http.get<Examen[]>(`${this.apiUrl}/admin`);
  }

  // Crear, editar y ocultar (soft delete) para admin
  crear(examen: Partial<Examen>): Observable<any> {
    return this.http.post(this.apiUrl, examen);
  }
  actualizar(id: number, examen: Partial<Examen>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, examen);
  }
  ocultar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
