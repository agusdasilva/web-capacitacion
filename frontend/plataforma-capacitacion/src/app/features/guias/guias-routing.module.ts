import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoGuiasComponent } from './pages/listado-guias/listado-guias.component';
import { HistorialGuiasComponent } from './pages/historial-guias/historial-guias.component';

const routes: Routes = [
  { path: '', component: ListadoGuiasComponent },
  { path: 'historial', component: HistorialGuiasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuiasRoutingModule {}
