import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl; // asegurate de tener esto en environment.ts

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}
 
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        this.tokenService.setToken(res.token);
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/auth/login']);
  }

  getUsuario(): any {
    const token = this.tokenService.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      return null;
    }
  }

  isAdmin(): boolean {
    const usuario = this.getUsuario();
    return usuario?.rol === 'admin';
  }

  isLoggedIn(): boolean {
    return this.tokenService.isLogged();
  }
}
