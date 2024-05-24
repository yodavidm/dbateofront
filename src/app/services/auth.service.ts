import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  private baseUrl = 'http://localhost:8080';

    // Método para verificar si el usuario está autenticado
    isLoggedIn(): boolean {
      const token = localStorage.getItem('token');
      return token !== null;
    }
  
    // Método para obtener el ID de usuario desde el token
    getUserId(): string | null {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: any =jwtDecode(token);
        return decodedToken.sub; // Suponiendo que el ID de usuario está en la propiedad 'sub'
      }
      return null;
    }

    getToken(): string | null {
      return localStorage.getItem('token');
    }
  
    // Método para cerrar sesión
    logout(): void {
      localStorage.removeItem('token');
    }

    //obtener usuario para sacar datos
    getUserById(id: number): Observable<Usuario> {
      return this.http.get<Usuario>(`${this.baseUrl}/user/${id}`);
    }

    getUserByNickname(nickname: string): Observable<Usuario> {
      const token = this.getToken();
      // Crear encabezados con el token
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Usuario>(`${this.baseUrl}/user/nickname/${nickname}`,{headers});
    }
    
  }
  

