import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComentarioDTO } from 'src/app/interfaces/comentario-dto';
import { AuthService } from 'src/app/services/auth.service';
import { ComentarioService } from 'src/app/services/comentario.service';

@Component({
  selector: 'app-crear-comentario',
  templateUrl: './crear-comentario.component.html',
  styleUrls: ['./crear-comentario.component.css']
})
export class CrearComentarioComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private comentarioService: ComentarioService,
    private router: Router,
    private authService: AuthService
  ) { }

  idPublicacion!: number;

  comentarioDTO: ComentarioDTO = {
    comentario: '',
    fecha_creacion: new Date(),
    id_usuario: 0,
    id_publicacion: 0
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['idPublicacion']) {
        this.idPublicacion = +params['idPublicacion']; // Convertir a número
        this.comentarioDTO.id_publicacion = this.idPublicacion;

        // Obtener el ID de usuario autenticado y asignarlo al comentarioDTO
        const idUsuario = this.getUserId();
        
        if (idUsuario !== null) {
          this.comentarioDTO.id_usuario = parseInt(idUsuario); // Convertir a número
        } else {
          console.error('ID de usuario no válido');
        }
      } else {
        console.error('idPublicacion no está presente en los parámetros de la ruta');
      }
    }, error => {
      console.error('Error al obtener los parámetros de la ruta:', error);
    });
  }

  getUserId(): string | null {
    return this.authService.getUserId();
  }

  submitComentario() {
    if (this.comentarioDTO.id_publicacion && this.comentarioDTO.id_usuario) {
      this.comentarioService.crearComentario(this.comentarioDTO).subscribe(
        () => {
          console.log('Comentario creado exitosamente');
          this.router.navigate(['publicacion/' + this.idPublicacion + '/comentarios']);
        },
        error => {
          console.error('Error al crear el comentario:', error);
        }
      );
    } else {
      console.error('id_publicacion o id_usuario no están asignados correctamente');
    }
  }
}
