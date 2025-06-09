import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    const token = this.tokenService.getToken();

    if (token) {
      // Extraer payload del token (asumiendo formato JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const esAdmin = payload.rol === 'admin';

      if (esAdmin) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }

    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
