import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from '../interfaces/comentario';
import { ComentarioDTO } from '../interfaces/comentario-dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  constructor(private http: HttpClient, private authService: AuthService) { }
  
  private baseUrl = 'https://dbateorepo-production.up.railway.app';

  obtenerComentariosPorPublicacion(idPublicacion: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.baseUrl}/comentarios/publicacion/${idPublicacion}`)
  }

  crearComentario(comentarioDTO: ComentarioDTO): Observable<Comentario> {

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);

    return this.http.post<Comentario>(`${this.baseUrl}/comentarios/comentar`, comentarioDTO,{headers});
  }

  eliminarComentario(id:number):Observable<void>{
    const token = this.authService.getToken();
    // Crear encabezados con el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/comentarios/${id}`,{headers});
  }

}
