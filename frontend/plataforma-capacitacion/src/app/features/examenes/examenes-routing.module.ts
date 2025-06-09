import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaExamenesComponent } from './pages/listado-examenes/listado-examenes.component';
import { ResponderExamenComponent } from './responder/pages/responder-examen/responder-examen.component';

const routes: Routes = [
  { path: '', component: ListaExamenesComponent },           // /examenes
  { path: ':id/preguntas', loadChildren: () =>
      import('../preguntas/preguntas.module').then(m => m.PreguntasModule)
  },
  { path: 'responder/:id', component: ResponderExamenComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamenesRoutingModule {}
