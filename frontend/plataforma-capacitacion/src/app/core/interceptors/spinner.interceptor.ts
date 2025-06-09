import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  private requestCount = 0;

  constructor(private spinner: SpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si es la primera petición activa, mostramos el spinner
    if (this.requestCount === 0) {
      this.spinner.show();
    }
    this.requestCount++;

    return next.handle(req).pipe(
      finalize(() => {
        this.requestCount--;
        // Cuando no queden peticiones, ocultamos el spinner
        if (this.requestCount === 0) {
          this.spinner.hide();
        }
      })
    );
  }
}
