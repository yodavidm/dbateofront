import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterDTO } from 'src/app/interfaces/register-dto';
import { AuthService } from 'src/app/services/auth.service';
import { SigninService } from 'src/app/services/signin.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  constructor(private signInService: SigninService, private router: Router, private toastr: ToastrService, private http: HttpClient) { }

  registerDto: RegisterDTO = {
    nickname: "",
    email: "",
    password: ""
  }

  signIn() {
    if (this.registerDto.nickname === null || this.registerDto.email === null || this.registerDto.password === null) {
      this.toastr.error('No debes dejar ningún campo vacío.');
    } else {
      const nicknameValid = this.registerDto.nickname.length > 4;
      const emailValid = this.validateEmail(this.registerDto.email);
      const passwordValid = this.validatePassword(this.registerDto.password);

      if (!nicknameValid) {
        this.toastr.error('El nickname debe tener más de 4 letras.','',{
          timeOut:1000
        });
      } else if (!emailValid) {
        this.toastr.error('El email no es válido.','',{
          timeOut:1000
        });
      } else if (!passwordValid) {
        this.toastr.error('La contraseña debe tener entre 8 y 16 caracteres, al menos un número, una minúscula y una mayúscula.','',{
          timeOut:1000
        });
      } else {
        // Realizar una solicitud HTTP al backend para verificar si el nickname y el email ya existen en la base de datos
        this.http.post<any>('https://dbateorepo-production.up.railway.app/validar', { nickname: this.registerDto.nickname, email: this.registerDto.email }).subscribe({
          next: (response: any) => {
            if (response.nicknameExists) {
              this.toastr.error('El nickname ya está en uso. Por favor, elige otro.','',{
                timeOut:1000
              });
            } else if (response.emailExists) {
              this.toastr.error('El email ya está en uso. Por favor, ingresa otro email.','',{
                timeOut:1000
              });
            } else {
              // Si el nickname y el email no existen, procede con el registro del usuario
              this.signInService.signin(this.registerDto).subscribe({
                next: (response: any) => {
                  console.log("Usuario creado con éxito");
                  this.router.navigate(['/registrado']);
                },
                error: error => {
                  console.error("Error al crear usuario ", error);
                }
              });
            }
          },
          error: error => {
            console.error("Error al validar usuario ", error);
          }
        });
      }
    }
  }

  // Métodos para validar email y contraseña
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
    return passwordRegex.test(password);
  }


  //mostrar contraseña
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  mostrarPassword(): void {
    const passwordInput = this.passwordInput.nativeElement as HTMLInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }
}