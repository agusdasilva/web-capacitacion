import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.css'],
  standalone: false
})
export class FormularioUsuarioComponent implements OnInit {
  formulario!: FormGroup;
  modoEditar = false;
  usuarioId!: number;
  usuarioOriginal: any = {};

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: [''],
      email: ['',  [Validators.email]],
      rol: [''],
      password: [''],
      repetirPassword: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEditar = true;
      this.usuarioId = +idParam;

      this.usuarioService.obtenerUsuario(this.usuarioId).subscribe(usuario => {
        this.usuarioOriginal = usuario;
        this.formulario.patchValue({
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        });
      });
    }
  }

  guardar(): void {
    const datos = this.formulario.value;

    // Validar que las contraseñas coincidan
    if (datos.password && datos.password !== datos.repetirPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const campos = ['nombre', 'email', 'rol', 'password'];
    const payload: any = {};

    for (const campo of campos) {
      const nuevo = datos[campo];
      const original = this.usuarioOriginal[campo];

      if (
        campo === 'password'
          ? nuevo && nuevo.trim() !== ''
          : nuevo !== undefined && nuevo !== original
      ) {
        payload[campo] = nuevo;
      }
    }

    if (Object.keys(payload).length === 0) {
      alert('Debés modificar al menos un campo para actualizar.');
      return;
    }

    if (this.modoEditar) {
      this.usuarioService.actualizarUsuario(this.usuarioId, payload).subscribe(() => {
        this.router.navigate(['/usuarios']);
      });
    } else {
      if (!payload.password) {
        alert('La contraseña es obligatoria para crear un nuevo usuario.');
        return;
      }

      this.usuarioService.crearUsuario(payload).subscribe(() => {
        this.router.navigate(['/usuarios']);
      });
    }
  }
  emailValido(): boolean {
    const emailCtrl = this.formulario.get('email');
    return !!emailCtrl?.valid && emailCtrl?.touched;
  }
  
  emailInvalido(): boolean {
    const emailCtrl = this.formulario.get('email');
    return !!emailCtrl?.invalid && emailCtrl?.touched;
  }
  
  contrasenasIguales(): boolean {
    const p1 = this.formulario.get('password')?.value;
    const p2 = this.formulario.get('repetirPassword')?.value;
    return p1 && p2 && p1 === p2;
  }
  
  contrasenasDistintas(): boolean {
    const p1 = this.formulario.get('password')?.value;
    const p2 = this.formulario.get('repetirPassword')?.value;
    return p1 && p2 && p1 !== p2;
  }
  
}
