import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComentarioDTO } from 'src/app/interfaces/comentario-dto';
import { ComentarioService } from 'src/app/services/comentario.service';

@Component({
  selector: 'app-crear-comentario',
  templateUrl: './crear-comentario.component.html',
  styleUrls: ['./crear-comentario.component.css']
})
export class CrearComentarioComponent {

  constructor(private route: ActivatedRoute,private comentarioService:ComentarioService,private router:Router) { }

  idPublicacion!: number;
  idUsuario!: number; // Agregar el ID del usuario

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idPublicacion = +params['idPublicacion']; // Convertir a número
      // Asignar el ID del usuario de alguna manera
      this.idUsuario = 2; 
      this.comentarioDTO.id_usuario=this.idUsuario;
      this.comentarioDTO.id_publicacion=this.idPublicacion;
    });
  }

  comentarioDTO: ComentarioDTO = {
    comentario:'',
    fecha_creacion:new Date(),
    id_usuario:0,
    id_publicacion:0
  }

  submitComentario() {
    this.comentarioService.crearComentario(this.comentarioDTO).subscribe(
      () => {
        console.log('Comentario creado exitosamente');
        // Manejar la creación exitosa del comentario
        this.router.navigate(['publicacion/' + this.idPublicacion + '/comentarios']);
      },
      error => {
        console.error('Error al crear el comentario:', error);
        // Manejar error
      }
    );
  }

  

}
