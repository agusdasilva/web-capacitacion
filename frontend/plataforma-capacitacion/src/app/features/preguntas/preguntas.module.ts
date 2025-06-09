import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntasRoutingModule } from './preguntas-routing.module';
import { ListaPreguntasComponent } from '../examenes/preguntas/pages/lista-preguntas/lista-preguntas.component';
import { SharedModule } from '../../shared/shared.module';
import { AgregarPreguntaComponent } from './pages/agregar-pregunta/agregar-pregunta.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListaPreguntasComponent, AgregarPreguntaComponent],
  imports: [
    CommonModule,
    SharedModule,
    PreguntasRoutingModule,
    ReactiveFormsModule
  ]
})
export class PreguntasModule {}
