import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PreguntasService } from '../../../examenes/preguntas/services/preguntas.service';

@Component({
  selector: 'app-agregar-pregunta',
  templateUrl: './agregar-pregunta.component.html',
  standalone: false
})
export class AgregarPreguntaComponent implements OnInit {
  formulario!: FormGroup;
  examenId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private preguntasService: PreguntasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examenId = Number(this.route.snapshot.paramMap.get('id'));
    this.formulario = this.fb.group({
      texto: ['', Validators.required],
      opciones: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      respuesta_correcta: ['', Validators.required],
      tiempo_maximo: ['']
    });
  }

  get opciones(): FormArray {
    return this.formulario.get('opciones') as FormArray;
  }

  agregarOpcion(): void {
    this.opciones.push(this.fb.control('', Validators.required));
  }

  crearPregunta(): void {
    const form = this.formulario.value;
    const payload = {
      texto: form.texto,
      opciones: form.opciones,
      respuesta_correcta: form.respuesta_correcta,
      tiempo_maximo: form.tiempo_maximo
    };

    this.preguntasService.agregarPregunta(this.examenId, payload).subscribe({
      next: () => {
        alert('Pregunta agregada correctamente');
        this.router.navigate(['/examenes']); // o donde quieras redirigir
      },
      error: err => console.error('Error al crear pregunta', err)
    });
  }
}
