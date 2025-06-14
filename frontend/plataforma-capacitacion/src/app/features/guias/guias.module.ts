import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuiasRoutingModule } from './guias-routing.module';
import { ListadoGuiasComponent } from './pages/listado-guias/listado-guias.component';
import { HistorialGuiasComponent } from './pages/historial-guias/historial-guias.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ListadoGuiasComponent, HistorialGuiasComponent],
  imports: [
    CommonModule,
    SharedModule,
    GuiasRoutingModule
  ]
})
export class GuiasModule {}
