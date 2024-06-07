import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { ObtenerComentariosComponent } from './components/obtener-comentarios/obtener-comentarios.component';
import { CrearComentarioComponent } from './components/crear-comentario/crear-comentario.component';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { RegistradoComponent } from './components/registrado/registrado.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { VerUsuariosComponent } from './components/ver-usuarios/ver-usuarios.component';
import { SeguidoresComponent } from './components/seguidores/seguidores.component';
import { SeguidosComponent } from './components/seguidos/seguidos.component';
import { UserPublicacionesComponent } from './components/user-publicaciones/user-publicaciones.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';
import { AuthGuard } from './auth-guard';


const routes: Routes = [
  { path: '', redirectTo: "/main", pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'crear-publicacion', component: CrearPublicacionComponent },
  { path: 'main/:categoria', component: MainComponent },
  { path: 'publicacion/:idPublicacion/comentarios', component: ObtenerComentariosComponent },
  { path: 'publicacion/:idPublicacion/comentar', component: CrearComentarioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signIn', component: SigninComponent },
  {
    path: 'registrado', component: RegistradoComponent,
    canMatch: [AuthGuard]
  },
  {
    path: 'perfil/:nickname',
    component: PerfilComponent,
    canMatch: [AuthGuard]
  },
  {
    path: 'perfil/admin/verUsuarios',
    component: VerUsuariosComponent,
    canMatch: [AuthGuard]
  },
  {
    path: 'perfil/:nickname/seguidores',
    component: SeguidoresComponent,
    canMatch: [AuthGuard]
  },
  {
    path: 'perfil/:nickname/seguidos',
    component: SeguidosComponent,
    canMatch: [AuthGuard]
  },
  {
    path: 'perfil/:nickname/publicaciones',
    component: UserPublicacionesComponent,
    canMatch: [AuthGuard]
  },
  {
    path: 'notificaciones/:nickname',
    component: NotificacionComponent,
    canMatch: [AuthGuard]
  },
  { path: '**', redirectTo: "/main" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
