import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Guia } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class GuiasService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Guia[]> {
    return this.http.get<Guia[]>(`${this.apiUrl}/guias`);
  }

  historial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/guias/vistas`);
  }

  registrarVista(guiaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/guias/vista`, { guia_id: guiaId });
  }
}
