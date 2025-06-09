import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pregunta } from '../../../../../core/models';
import { PreguntasService } from '../../services/preguntas.service';

@Component({
  selector: 'app-lista-preguntas',
  templateUrl: './lista-preguntas.component.html',
  styleUrls: ['./lista-preguntas.component.css'],
  standalone: false
})
export class ListaPreguntasComponent implements OnInit {
  examenId!: number;
  preguntas: Pregunta[] = [];
  cargando = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private preguntasSvc: PreguntasService
  ) {}

  ngOnInit(): void {
    // Leemos el ID de examen de la URL
    this.examenId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.examenId)) {
      this.error = 'ID de examen inválido';
      this.cargando = false;
      return;
    }

    // Llamamos al servicio
    this.preguntasSvc.listarPorExamen(this.examenId).subscribe({
      next: data => {
        this.preguntas = data;
        this.cargando = false;
      },
      error: err => {
        this.error = err.error?.mensaje || 'Error al cargar preguntas';
        this.cargando = false;
      }
    });
  }
}
