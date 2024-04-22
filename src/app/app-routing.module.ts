import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';

const routes: Routes = [
  { path: 'crear-publicacion', component: CrearPublicacionComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
