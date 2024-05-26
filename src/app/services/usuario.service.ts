import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { AuthService } from './auth.service';
import { ComentarioService } from './comentario.service';
import { SeguidorDTO } from '../interfaces/seguidor';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private authService: AuthService,private comentarioService:ComentarioService) { }

  private baseUrl = 'https://dbateorepo-production.up.railway.app';
      
  obtenerTodosLosUsuarios(): Observable<Usuario[]> {
    // Obtener el token del servicio AuthService
    const token = this.authService.getToken();
    // Crear encabezados con el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Usuario[]>(`${this.baseUrl}/user/find-all`,{headers});
  }

  eliminarUsuario(id:number):Observable<void>{


    const token = this.authService.getToken();
    // Crear encabezados con el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/user/eliminar/${id}`,{headers});
  }

  seguirUsuario(seguidor:SeguidorDTO):Observable<SeguidorDTO>{
    const token = this.authService.getToken();
    // Crear encabezados con el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<SeguidorDTO>(`${this.baseUrl}/seguidores/seguir`,seguidor,{headers})
  }
  
  obtenerSeguidosPorUsuario(idUsuario: number): Observable<SeguidorDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<SeguidorDTO[]>(`${this.baseUrl}/seguidores/${idUsuario}/seguidos`, { headers });
  }

  obtenerSeguidoresPorUsuario(idUsuario: number): Observable<SeguidorDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<SeguidorDTO[]>(`${this.baseUrl}/seguidores/${idUsuario}/seguidores`, { headers });
  }

  verificarSeguimientoExistente(idSeguidor: number, idSeguido: number): Observable<boolean> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<boolean>(`${this.baseUrl}/seguidores/verificar/${idSeguidor}/${idSeguido}`, { headers });
  }

  
  
}
