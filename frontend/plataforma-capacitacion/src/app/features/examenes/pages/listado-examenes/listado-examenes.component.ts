import { Component, OnInit } from '@angular/core';
import { Examen } from '../../../../core/models';
import { ExamenesService } from '../../services/examenes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-examenes',
  templateUrl: './listado-examenes.component.html',
  styleUrls: ['./listado-examenes.component.css'],
  standalone: false
})
export class ListaExamenesComponent implements OnInit {
  examenes: Examen[] = [];
  cargando = true;

  constructor(
    private examenSvc: ExamenesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examenSvc.listarDisponibles().subscribe({
      next: data => {
        this.examenes = data;
        this.cargando = false;
      },
      error: () => {
        // manejar error
        this.cargando = false;
      }
    });
  }

  iniciar(examen: Examen) {
    this.router.navigate(['/examenes', examen.id, 'preguntas']);
  }
}
