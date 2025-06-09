import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css'],
  standalone: false 
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioService.listarUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  crear(): void {
    this.router.navigate(['/usuarios/crear']);
  }

  editar(id: number): void {
    this.router.navigate(['/usuarios/editar', id]);
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.desactivarUsuario(id).subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
      });
    }
  }
}
