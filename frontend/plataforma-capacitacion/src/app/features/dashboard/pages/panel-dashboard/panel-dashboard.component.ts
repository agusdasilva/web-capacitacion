import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';


@Component({
  selector: 'app-panel-dashboard',
  templateUrl: './panel-dashboard.component.html',
  styleUrls: ['./panel-dashboard.component.css'],
  standalone: false
})
export class PanelDashboardComponent {
  constructor(public auth: AuthService, private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }
}