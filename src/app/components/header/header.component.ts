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
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.removeToken();
    this.toastr.info('Sesión cerrada con éxito', '', {
      timeOut: 1000
    });
    setTimeout(() => {
      this.router.navigate(['/main']).then(() => {
        location.reload();
      });
    }, 500); // 0.5 segundo  
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: Event): void {
    this.removeToken();
  }

  private removeToken(): void {
    localStorage.removeItem('token');
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
}
