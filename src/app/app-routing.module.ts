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


const routes: Routes = [
  { path: '', redirectTo: "/main", pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'crear-publicacion', component: CrearPublicacionComponent },
  { path: 'main/:categoria', component: MainComponent },
  { path: 'publicacion/:idPublicacion/comentarios', component: ObtenerComentariosComponent },
  { path: 'publicacion/:idPublicacion/comentar', component: CrearComentarioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signIn', component:SigninComponent},
  { path: 'registrado', component:RegistradoComponent},
  { path: 'perfil/:nickname', component:PerfilComponent},
  { path: 'perfil/admin/verUsuarios', component:VerUsuariosComponent},
  { path: 'perfil/:nickname/seguidores', component: SeguidoresComponent },
  { path: 'perfil/:nickname/seguidos', component: SeguidosComponent },
  { path: 'perfil/:nickname/publicaciones', component: UserPublicacionesComponent },
  { path: '**', redirectTo: "/main" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
