import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponderExamenComponent } from './pages/responder-examen/responder-examen.component';

const routes: Routes = [
  { path: '', component: ResponderExamenComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponderRoutingModule {}
