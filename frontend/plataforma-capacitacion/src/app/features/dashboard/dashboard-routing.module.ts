import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelDashboardComponent } from './pages/panel-dashboard/panel-dashboard.component';

const routes: Routes = [
  { path: '', component: PanelDashboardComponent }  // /dashboard
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
