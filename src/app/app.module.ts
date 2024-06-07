import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainComponent } from './components/main/main.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { ObtenerComentariosComponent } from './components/obtener-comentarios/obtener-comentarios.component';
import { CrearComentarioComponent } from './components/crear-comentario/crear-comentario.component';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { RegistradoComponent } from './components/registrado/registrado.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { VerUsuariosComponent } from './components/ver-usuarios/ver-usuarios.component';
import { SeguidoresComponent } from './components/seguidores/seguidores.component';
import { SeguidosComponent } from './components/seguidos/seguidos.component';
import { UserPublicacionesComponent } from './components/user-publicaciones/user-publicaciones.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MainComponent,
    CrearPublicacionComponent,
    ObtenerComentariosComponent,
    CrearComentarioComponent,
    LoginComponent,
    SigninComponent,
    RegistradoComponent,
    PerfilComponent,
    VerUsuariosComponent,
    SeguidoresComponent,
    SeguidosComponent,
    UserPublicacionesComponent,
    NotificacionComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
