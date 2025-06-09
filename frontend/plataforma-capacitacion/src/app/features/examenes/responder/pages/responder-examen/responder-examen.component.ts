import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PreguntasService } from '../../../preguntas/services/preguntas.service';


@Component({
  selector: 'app-responder-examen',
  templateUrl: './responder-examen.component.html',
  styleUrls: ['./responder-examen.component.css']
})
export class ResponderExamenComponent implements OnInit {
  examenId!: number;
  preguntas: any[] = [];
  actual = 0;
  respuestaSeleccionada: string = '';
  respuestasUsuario: { preguntaId: number; respuesta: string }[] = [];
  tiempoRestante: number = 0;
  intervalo: any;

  constructor(private route: ActivatedRoute, private preguntasService: PreguntasService) {}

  ngOnInit(): void {
    this.examenId = Number(this.route.snapshot.paramMap.get('id'));

    this.preguntasService.listarPorExamen(this.examenId).subscribe({
      next: (preguntas) => {
        this.preguntas = preguntas;
        this.iniciarTemporizador();
      }
    });
  }

  iniciarTemporizador(): void {
    this.tiempoRestante = this.preguntas[this.actual]?.tiempo_maximo || 30;

    this.intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante === 0) {
        this.guardarRespuesta();
      }
    }, 1000);
  }

  guardarRespuesta(): void {
    clearInterval(this.intervalo);

    this.respuestasUsuario.push({
      preguntaId: this.preguntas[this.actual].id,
      respuesta: this.respuestaSeleccionada || 'Sin responder'
    });

    this.respuestaSeleccionada = '';
    this.actual++;

    if (this.actual < this.preguntas.length) {
      this.iniciarTemporizador();
    } else {
      console.log('Respuestas:', this.respuestasUsuario);
      // acá podrías redirigir o enviar al backend
    }
  }
}
