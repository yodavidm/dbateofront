import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-seguidos',
  templateUrl: './seguidos.component.html',
  styleUrls: ['./seguidos.component.css']
})
export class SeguidosComponent implements OnInit {
  seguidos: any[] = [];
  page!: number;
  idUsuario!: number;
  isUserProfile: boolean = false;
  usuario!: Usuario;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state && navigation.extras.state['seguidos']) {
      this.seguidos = navigation.extras.state['seguidos'];
    }
  }

  ngOnInit(): void {
    this.getUserId();
  }

  cambiarPagina(nuevaPagina: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: nuevaPagina },
      queryParamsHandling: 'merge', // Mantener otros parámetros de la URL
    });
  }

  unfollow(idSeguido: number): void {
    this.usuarioService.eliminarSeguimiento(idSeguido, this.idUsuario).subscribe(
      () => {
        console.log('Seguimiento eliminado');
        this.router.navigate(['/main']);
      },
      error => {
        console.error('Error al eliminar seguimiento:', error);
      }
    );
  }

  getUserId(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.idUsuario = parseInt(userId, 10);
      this.getUserById(); // Llamar a getUserById después de obtener el ID del usuario
    } else {
      console.error('Usuario no iniciado');
    }
  }

  getUserById(): void {
    this.authService.getUserById(this.idUsuario).subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        this.checkIfUserProfile(); // Llamar a checkIfUserProfile después de obtener el usuario
      },
      error: (error) => {
        console.error('Error al obtener el usuario', error);
      }
    });
  }

  checkIfUserProfile(): void {
    this.route.params.subscribe(params => {
      const nicknameFromRoute = params['nickname']; // Obtener el nickname de la ruta
      this.isUserProfile = (nicknameFromRoute === this.usuario.nickname);
    });
  }
}
