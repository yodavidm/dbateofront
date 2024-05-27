import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private logoutTimer: any;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {
    this.usuario = {} as Usuario; // Inicialización del usuario
  }

  idUsuario!: number;
  usuario: Usuario;
  showUsername: boolean = false;

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.getUserId();
      if (this.idUsuario) {
        this.cargarUsuario();
      }
      this.startLogoutTimer();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.toastr.info('Sesión cerrada con éxito', '', {
      timeOut: 1000
    });
    // Agregar delay de 0.5 segundos antes de redirigir y recargar la página
    setTimeout(() => {
      // Redirigir a main
      this.router.navigate(['/main']).then(() => {
        // Recargar la página para ver cambios
        location.reload();
      });
    }, 500); // 0.5 segundo  
  }

  getUserId(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.idUsuario = parseInt(userId);
    }
  }

  cargarUsuario(): void {
    this.authService.getUserById(this.idUsuario).subscribe(
      (data: Usuario) => {
        this.usuario = data;
      },
      (error: any) => {
        console.error("Error al obtener los datos de usuario", error);
      }
    );
  }

  private startLogoutTimer(): void {
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, 5000); // 5 segundos en milisegundos
  }

  @HostListener('document:click') resetLogoutTimer(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.startLogoutTimer();
  }
}
