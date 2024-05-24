import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comentario } from 'src/app/interfaces/comentario';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ComentarioService } from 'src/app/services/comentario.service';
import Swal from 'sweetalert2';

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
  idPublicacion!: number;
  usuario!: Usuario;
  esAdmin!: boolean;

  constructor(private comentarioService: ComentarioService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.isAdmin();
    this.route.params.subscribe(params => {
      this.idPublicacion = +params['idPublicacion'];
      this.obtenerComentariosPorPublicacion(this.idPublicacion);
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  cambiarPagina(nuevaPagina: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: nuevaPagina },
      queryParamsHandling: 'merge', // Mantener otros parámetros de la URL
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

  irAComentar(): void {
    this.router.navigate(['/publicacion', this.idPublicacion, 'comentar']);
  }


  async eliminarComentario(id: number): Promise<void> {
    // Mostrar un cuadro de diálogo de confirmación con SweetAlert
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará el comentario y no se podrá deshacer más tarde.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    // Verificar la opción seleccionada por el usuario
    if (result.isConfirmed) {
      // Llamar al servicio para eliminar la publicación
      this.comentarioService.eliminarComentario(id)
        .subscribe(
          () => {
            console.log(`Comentario con ID ${id} eliminado correctamente`);
            // Recargar la página después de eliminar la publicación
            window.location.reload();
          },
          error => {
            console.error('Error al eliminar el comentario:', error);
          }
        );
    } else {
      // El usuario ha cancelado la acción
      console.log('La acción ha sido cancelada');
    }
  }


  esMiComentario(comentario: Comentario): boolean {

    const userId = this.authService.getUserId();
    if (userId !== null) {
      const idUsuario = parseInt(userId);
      return comentario.usuario.id === idUsuario;
    }
    return false;

  }

  isAdmin(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      const idUsuario = parseInt(userId);
      this.authService.getUserById(idUsuario).subscribe({
        next: (usuario: Usuario) => {
          this.usuario = usuario;
          if (usuario.rol.nombreRol === 'ADMIN_ROLE') {
            this.esAdmin = true;
          } else {
            this.esAdmin = false;
          }
        },
        error: (error) => {
          console.error('Error al obtener el usuario', error);
        }
      });
    }
  }

}
