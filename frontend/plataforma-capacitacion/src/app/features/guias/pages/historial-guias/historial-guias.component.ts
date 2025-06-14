import { Component, OnInit } from '@angular/core';
import { GuiasService } from '../../services/guias.service';

@Component({
  selector: 'app-historial-guias',
  templateUrl: './historial-guias.component.html',
  styleUrl: './historial-guias.component.css',
  standalone: false
})
export class HistorialGuiasComponent implements OnInit {
  vistas: any[] = [];
  cargando = true;

  constructor(private guiasSvc: GuiasService) {}

  ngOnInit(): void {
    this.guiasSvc.historial().subscribe({
      next: data => {
        this.vistas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}
