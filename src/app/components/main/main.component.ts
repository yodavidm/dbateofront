import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publicacion } from 'src/app/interfaces/publicacion';
import { SeguidorDTO } from 'src/app/interfaces/seguidor';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private publicacionService: PublicacionService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private authService: AuthService, 
    private usuarioService: UsuarioService
  ) { }

  publicaciones!: Publicacion[];
  public page!: number;
  usuario!: Usuario;
  esAdmin!: boolean;
  idUsuario!: number;
  hayPublicacionesCategoria!: boolean;
  seguidor: SeguidorDTO = { idSeguidor: 0, idSeguido: 0 };

  ngOnInit(): void {
    this.getUserId();
    this.cargarUsuarioYVerificarSeguimientos();
    this.isAdmin();

    this.route.params.subscribe(params => {
      const idCategoria = +params['categoria']; // Convertir a número
      if (!isNaN(idCategoria)) {
        this.obtenerPublicacionesPorCategoria(idCategoria);
      } else {
        this.obtenerPublicaciones();
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  obtenerPublicacionesPorCategoria(idCategoria: number): void {
    this.publicacionService.obtenerPublicacionesPorCategoria(idCategoria).subscribe(
      publicaciones => {
        this.publicaciones = publicaciones.sort((a, b) => {
          return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
        });
        this.verificarSeguimientosEnPublicaciones();
      },
      error => {
        console.error('Error obteniendo publicaciones por categoría:', error);
      }
    );
  }

  obtenerPublicaciones(): void {
    this.publicacionService.obtenerPublicaciones()
      .subscribe(
        publicaciones => {
          this.publicaciones = publicaciones.sort((a, b) => {
            return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
          });
          this.verificarSeguimientosEnPublicaciones();
        },
        error => {
          console.error('Error al obtener las publicaciones:', error);
        }
      );
  }

  cambiarPagina(nuevaPagina: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: nuevaPagina },
      queryParamsHandling: 'merge', // Mantener otros parámetros de la URL
    });
  }

  verUltimasPublicaciones() {
    this.page = 1;
  }

  async eliminarPublicacion(id: number): Promise<void> {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará la publicación y no se podrá deshacer más tarde.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.publicacionService.eliminarPublicacion(id)
        .subscribe(
          () => {
            console.log(`Publicación con ID ${id} eliminada correctamente`);
            window.location.reload();
          },
          error => {
            console.error('Error al eliminar la publicación:', error);
          }
        );
    } else {
      console.log('La acción ha sido cancelada');
    }
  }

  verComentarios(idPublicacion: number): void {
    this.router.navigate(['/publicacion', idPublicacion, 'comentarios']);
  }

  crearComentario(idPublicacion: number): void {
    this.router.navigate(['publicacion', idPublicacion, 'comentar']);
  }

  esMiPublicacionPropia(publicacion: Publicacion): boolean {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      const idUsuario = parseInt(userId);
      return publicacion.usuario.id === idUsuario;
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
          this.esAdmin = usuario.rol.nombreRol === 'ADMIN_ROLE';
        },
        error: (error) => {
          console.error('Error al obtener el usuario', error);
        }
      });
    }
  }

  seguir(seguidor: SeguidorDTO, publicacion: Publicacion) {
    const userId = this.authService.getUserId();
    const seguidoId = publicacion.usuario.id;
    if (userId != null) {
      const seguidorId = parseInt(userId);
      seguidor.idSeguidor = seguidorId;
      seguidor.idSeguido = seguidoId;

      this.usuarioService.seguirUsuario(seguidor).subscribe({
        next: (data) => {
          location.reload();
          console.log("Usuario seguido correctamente");
        },
        error: (error) => {
          console.log("Hubo un error al seguir ids: " + seguidor.idSeguido + " " + seguidor.idSeguidor);
        }
      });
    }
  }



  verificarSeguimiento(publicacion: Publicacion): void {
    if (!this.usuario) return;
    this.usuarioService.verificarSeguimientoExistente(this.usuario.id, publicacion.usuario.id)
      .subscribe(
        resultado => {
          publicacion.estaSiguiendo = resultado;
        },
        error => {
          console.error('Error al verificar seguimiento:', error);
        }
      );
  }

  verificarSeguimientosEnPublicaciones(): void {
    if (!this.usuario) return;
    this.publicaciones.forEach(publicacion => {
      this.verificarSeguimiento(publicacion);
    });
  }

  getUserId(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.idUsuario = parseInt(userId, 10);
    } else {
      console.error('Usuario no iniciado');
    }
  }

  cargarUsuarioYVerificarSeguimientos(): void {
    if (this.idUsuario) {
      this.authService.getUserById(this.idUsuario).subscribe(
        (data: Usuario) => {
          this.usuario = data;
          this.verificarSeguimientosEnPublicaciones();
          console.log(this.usuario.nickname);
        },
        (error: any) => {
          console.error("Error al obtener los datos de usuario", error);
        }
      );
    }
  }


}
