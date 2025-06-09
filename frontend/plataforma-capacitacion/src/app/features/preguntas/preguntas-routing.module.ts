import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPreguntasComponent } from '../examenes/preguntas/pages/lista-preguntas/lista-preguntas.component';
import { AgregarPreguntaComponent } from './pages/agregar-pregunta/agregar-pregunta.component';

const routes: Routes = [
  { path: '', component: ListaPreguntasComponent },  // /examenes/:id/preguntas
  { path: ':id/agregar', component: AgregarPreguntaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreguntasRoutingModule {}
