import { Component } from '@angular/core';
import { SpinnerService } from '../../../core/services/spinner.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  standalone: false
})
export class LoadingComponent {
  constructor(public spinner: SpinnerService) {}
}
