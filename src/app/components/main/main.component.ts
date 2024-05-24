import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
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

  constructor(private publicacionService: PublicacionService, private route: ActivatedRoute, private router: Router, private authService: AuthService, private usuarioService: UsuarioService) { }

  publicaciones!: Publicacion[];
  public page!: number;
  usuario!: Usuario
  esAdmin!: boolean;
  idUsuario!: number;

  ngOnInit(): void {


    this.getUserId();
    this.cargarUsuario();

    this.isAdmin();

    this.route.params.subscribe(params => {
      const idCategoria = +params['categoria']; // Convertir a número

      if (!isNaN(idCategoria)) {
        // Si hay un id de categoría en la url, filtrar por esa categoría
        this.obtenerPublicacionesPorCategoria(idCategoria);
      } else {
        // Si no hay id de categoría en la url, obtener todas las publicaciones
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
        // Ordenar las publicaciones por fecha_creacion de más reciente a más antigua
        this.publicaciones = publicaciones.sort((a, b) => {
          return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
        });
      },
      error => {
        console.error('Error obteniendo publicaciones por categoría:', error);
      }
    );
  }


  hayPublicacionesCategoria!: boolean;


  obtenerPublicaciones(): void {
    this.publicacionService.obtenerPublicaciones()
      .subscribe(
        publicaciones => {
          // Ordenar las publicaciones por fecha de creación de forma descendente
          this.publicaciones = publicaciones.sort((a, b) => {
            return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
          });
  
          // Verificar seguimiento para cada publicación
          this.publicaciones.forEach(publicacion => {
            this.verificarSeguimiento(publicacion);
          });
  
          console.log('Publicaciones obtenidas:', this.publicaciones);
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
    // Mostrar un cuadro de diálogo de confirmación con SweetAlert
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

    // Verificar la opción seleccionada por el usuario
    if (result.isConfirmed) {
      // Llamar al servicio para eliminar la publicación
      this.publicacionService.eliminarPublicacion(id)
        .subscribe(
          () => {
            console.log(`Publicación con ID ${id} eliminada correctamente`);

            // Recargar la página después de eliminar la publicación
            window.location.reload();
          },
          error => {
            console.error('Error al eliminar la publicación:', error);
          }
        );
    } else {
      // El usuario ha cancelado la acción
      console.log('La acción ha sido cancelada');
    }
  }

  //mandar id de publicacion al pulsar en comentarios
  verComentarios(idPublicacion: number): void {
    this.router.navigate(['/publicacion', idPublicacion, 'comentarios']);
  }

  crearComentario(idPublicacion: number): void {
    this.router.navigate(['publicacion', idPublicacion, 'comentar']);
  }


  //comprobar que es la publicacion del usuario logueado
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

  //logica para seguir a otro usuario

  seguidor: SeguidorDTO = {
    idSeguidor: 0,
    idSeguido: 0
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
      })
    }
  }
  
  dejarDeSeguir(publicacion: Publicacion): void {
    this.usuarioService.dejarDeSeguir(this.usuario.id, publicacion.usuario.id).subscribe(
      () => {
        console.log(`Has dejado de seguir al usuario con ID: ${publicacion.usuario.id}`);
        publicacion.estaSiguiendo = false; // Actualizar el estado de seguimiento
      },
      error => {
        console.error('Error al dejar de seguir:', error);
      }
    );
  }
  
  
  

  verificarSeguimiento(publicacion: Publicacion): void {
    this.usuarioService.verificarSeguimientoExistente(this.usuario.id, publicacion.usuario.id)
      .subscribe(
        resultado => {
          if (resultado) {
            publicacion.estaSiguiendo = true;
          } else {
            publicacion.estaSiguiendo = false;
          }
        },
        error => {
          console.error('Error al verificar seguimiento:', error);
        }
      );
  }
  


  //cargar usuario actual
  getUserId(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.idUsuario = parseInt(userId, 10);
    } else {
      console.error('Usuario no iniciado');
    }
  }

  cargarUsuario(): void {
    if (this.idUsuario) {
      this.authService.getUserById(this.idUsuario).subscribe(
        (data: Usuario) => {
          this.usuario = data;
          console.log(this.usuario.nickname);
          
        },
        (error: any) => {
          console.error("Error al obtener los datos de usuario", error);
        }
      );
    }
  }


}
