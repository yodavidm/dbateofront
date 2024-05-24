import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginDTO } from 'src/app/interfaces/login-dto';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  constructor(private loginService: LoginService, private router: Router,private authService:AuthService,private toastr:ToastrService) { }

  loginDto: LoginDTO = {
    email: "",
    password: ""
  }


  login(): void {
    this.loginService.login(this.loginDto).subscribe({
      next: (response: any) => {
        // Extraer token
        const token = response.jwt;
        console.log("Inicio de sesión exitoso");
        this.toastr.info('Bienvenido', '', {
          timeOut: 1000
        });

        // Guardar token
        localStorage.setItem('token', token);

        const userId = this.getUserId();

        // Agregar delay de 0.5 segundos antes de redirigir y recargar la página
        setTimeout(() => {
          // Redirigir a main
          this.router.navigate(['/main']).then(() => {
            // Recargar la página para ver cambios
            location.reload();
          });
        }, 500); // 0.5 segundo
      },
      error: error => {
        this.toastr.error('Credenciales incorrectas', '', {
          timeOut: 1000
        });
        console.error('Error al iniciar sesión:', error);
      }
    });
  }




  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserId(): string | null {
    return  this.authService.getUserId();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  //mostrar contraseña
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  mostrarPassword(): void {
    const passwordInput = this.passwordInput.nativeElement as HTMLInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }




}
