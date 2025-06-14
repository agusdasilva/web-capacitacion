import { Component, OnInit } from '@angular/core';
import { GuiasService } from '../../services/guias.service';
import { Guia } from '../../../../core/models';

@Component({
  selector: 'app-listado-guias',
  templateUrl: './listado-guias.component.html',
  styleUrl: './listado-guias.component.css',
  standalone: false
})
export class ListadoGuiasComponent implements OnInit {
  guias: Guia[] = [];
  cargando = true;

  constructor(private guiasSvc: GuiasService) {}

  ngOnInit(): void {
    this.guiasSvc.listar().subscribe({
      next: data => {
        this.guias = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  abrir(guia: Guia) {
    this.guiasSvc.registrarVista(guia.id).subscribe();
    window.open(guia.archivo, '_blank');
  }
}
