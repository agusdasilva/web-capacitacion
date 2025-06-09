import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'examenes',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/examenes/examenes.module').then(m => m.ExamenesModule)
  },
  {
    path: 'preguntas',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./features/preguntas/preguntas.module').then(m => m.PreguntasModule)
  },
  {
    path: 'resultados',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/resultados/resultados.module').then(m => m.ResultadosModule)
  },
  {
    path: 'usuarios',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./features/usuarios/usuarios.module').then(m => m.UsuariosModule)
  },
  {
    path: 'guias',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/guias/guias.module').then(m => m.GuiasModule)
  },
  {
    path: 'videos',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/videos/videos.module').then(m => m.VideosModule)
  },
  {
    path: 'foro',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/foro/foro.module').then(m => m.ForoModule)
  },
  {
    path: 'notificaciones',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/notificaciones/notificaciones.module').then(m => m.NotificacionesModule)
  },
  {
    path: 'estadisticas',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./features/estadisticas/estadisticas.module').then(m => m.EstadisticasModule)
  },

  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
