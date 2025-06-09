import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';             // ← trae NgIf, NgFor…
import { ExamenesRoutingModule } from './examenes-routing.module';
import { ListaExamenesComponent } from './pages/listado-examenes/listado-examenes.component';
import { SharedModule } from '../../shared/shared.module'; // ← si lo usás para app-card, pipes, etc.

@NgModule({
  declarations: [
    ListaExamenesComponent
  ],
  imports: [
    CommonModule,            // ← necesario para *ngIf, *ngFor
    SharedModule,            // ← si quieres usar componentes/pipes globales
    ExamenesRoutingModule
  ]
})
export class ExamenesModule {}

