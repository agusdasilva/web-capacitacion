import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponderRoutingModule } from './responder-routing.module';
import { ResponderExamenComponent } from './pages/responder-examen/responder-examen.component';

@NgModule({
  declarations: [ResponderExamenComponent],
  imports: [CommonModule, ResponderRoutingModule]
})
export class ResponderModule {}
