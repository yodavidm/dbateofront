import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publicacion } from 'src/app/interfaces/publicacion';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PublicacionService } from 'src/app/services/publicacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-publicaciones',
  templateUrl: './user-publicaciones.component.html',
  styleUrls: ['./user-publicaciones.component.css']
})
export class UserPublicacionesComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  page!: number;
  esAdmin!: boolean;
  usuario!:Usuario;
  idUsuario!:number;


  constructor(private router: Router, private route: ActivatedRoute,private publicacionService:PublicacionService,private authService:AuthService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state && navigation.extras.state['publicaciones']) {
      this.publicaciones = navigation.extras.state['publicaciones'];
    }
  }

  ngOnInit(): void {
    this.getUserId();
    this.isAdmin();
  }

  cambiarPagina(nuevaPagina: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: nuevaPagina },
      queryParamsHandling: 'merge', // Mantener otros parámetros de la URL
    });
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
            this.router.navigate(['/main'])
          },
          error => {
            console.error('Error al eliminar la publicación:', error);
          }
        );
    } else {
      console.log('La acción ha sido cancelada');
    }
  }

  esMiPublicacionPropia(publicacion: Publicacion): boolean {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      const idUsuario = parseInt(userId);
      return publicacion.usuario.id === idUsuario;
    }
    return false;
  }

  getUserId(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.idUsuario = parseInt(userId, 10);
    } else {
      console.error('Usuario no iniciado');
    }
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

  
}
