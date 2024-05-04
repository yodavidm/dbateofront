import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comentario } from 'src/app/interfaces/comentario';
import { ComentarioService } from 'src/app/services/comentario.service';

@Component({
  selector: 'app-obtener-comentarios',
  templateUrl: './obtener-comentarios.component.html',
  styleUrls: ['./obtener-comentarios.component.css']
})
export class ObtenerComentariosComponent implements OnInit {
  
  comentarios!: Comentario[];
  titulo: string = '';
  contenido: string = '';
  fecha_creacion!: Date;
  nickname: string = '';
  categoria: string = '';

  public page!: number;

  constructor(private comentarioService: ComentarioService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idPublicacion = +params['idPublicacion'];
      this.obtenerComentariosPorPublicacion(idPublicacion);
    });
  }

  obtenerComentariosPorPublicacion(idPublicacion: number): void {
    this.comentarioService.obtenerComentariosPorPublicacion(idPublicacion).subscribe({
      next: comentarios => {
        // Ordenar comentarios del más reciente al más antiguo
        this.comentarios = comentarios.sort((a, b) => {
          return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
        });
        console.log(this.comentarios);
        // Tomar el primer comentario (el más reciente)
        const comentarioReciente = this.comentarios[0];
        if (comentarioReciente) {
          this.titulo = comentarioReciente.publicacion.titulo;
          this.nickname = comentarioReciente.publicacion.usuario.nickname;
          this.contenido = comentarioReciente.publicacion.contenido;
          this.fecha_creacion = comentarioReciente.publicacion.fecha_creacion;
          this.categoria = comentarioReciente.publicacion.categoria.nombre;
        }
      },
      error: errorResp => {
        console.error('Error al obtener los comentarios:', errorResp);
      }
    });
  }
}
