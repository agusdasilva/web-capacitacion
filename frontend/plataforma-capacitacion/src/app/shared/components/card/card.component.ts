import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: false
})
export class CardComponent {
  @Input() titulo: string = '';
  @Output() clickCard = new EventEmitter<void>();

  onClick() {
    this.clickCard.emit();
  }
}
