import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pregunta } from '../../../../core/models';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarPorExamen(examenId: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.apiUrl}/examenes/${examenId}/preguntas`);
  }

  agregarPregunta(examenId: number, datos: {
    texto: string;
    opciones: string[];
    respuesta_correcta: string;
    tiempo_maximo?: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/examenes/${examenId}/preguntas`, datos);
  }
}
