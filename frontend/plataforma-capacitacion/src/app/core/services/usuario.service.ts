import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  // Para que el usuario vea/modifique su propio perfil
  getMiPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`);
  }

  updateMiPerfil(data: Partial<Usuario> & { password?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/mi-perfil`, data);
  }

  // Métodos de admin
  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crearUsuario(u: Partial<Usuario> & { password: string }): Observable<any> {
    return this.http.post(this.apiUrl, u);
  }

  actualizarUsuario(id: number, u: Partial<Usuario> & { password?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, u);
  }

  desactivarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener un usuario específico por ID (para editar)
  obtenerUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

}
