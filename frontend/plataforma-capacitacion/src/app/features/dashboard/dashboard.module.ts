// src/app/features/dashboard/dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PanelDashboardComponent } from './pages/panel-dashboard/panel-dashboard.component';


@NgModule({
  declarations: [PanelDashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule     // para usar <app-navbar>, pipes, etc.
  ]
})
export class DashboardModule {}
