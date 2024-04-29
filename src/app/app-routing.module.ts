import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';

const routes: Routes = [
  { path: '',redirectTo:"/main", pathMatch:'full'},
  { path: 'main', component: MainComponent },
  { path: 'crear-publicacion', component: CrearPublicacionComponent },
  { path: 'main/:categoria', component: MainComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
