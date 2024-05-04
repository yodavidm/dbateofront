import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { ObtenerComentariosComponent } from './components/obtener-comentarios/obtener-comentarios.component';
import { CrearComentarioComponent } from './components/crear-comentario/crear-comentario.component';

const routes: Routes = [
  { path: '', redirectTo: "/main", pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'crear-publicacion', component: CrearPublicacionComponent },
  { path: 'main/:categoria', component: MainComponent },
  { path: 'publicacion/:idPublicacion/comentarios', component: ObtenerComentariosComponent },
  { path: 'publicacion/:idPublicacion/comentar', component: CrearComentarioComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
