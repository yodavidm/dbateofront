import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Publicacion } from '../interfaces/publicacion';
import { Observable, catchError, throwError } from 'rxjs';
import { PublicacionDTO } from '../interfaces/publicacion-dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  private baseUrl = 'https://dbateorepo-production.up.railway.app';
      
  constructor(private http: HttpClient,private authService:AuthService) { }

  crearPublicacion(publicacionDTO: PublicacionDTO): Observable<PublicacionDTO> {
    // Obtener el token del servicio AuthService
    const token = this.authService.getToken();
    // Crear encabezados con el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Enviar solicitud POST con encabezados
    return this.http.post<PublicacionDTO>(`${this.baseUrl}/publicaciones/crear`, publicacionDTO, { headers });
  }

  obtenerPublicaciones():Observable<Publicacion[]>{
    return this.http.get<Publicacion[]>(`${this.baseUrl}/publicaciones`);
  }

  eliminarPublicacion(id:number):Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/publicaciones/${id}`);
  }

  //método para filtrar por categorias
  obtenerPublicacionesPorCategoria(idCategoria: number): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.baseUrl}/publicaciones/categoria/${idCategoria}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener publicaciones por categoría:', error);
          return throwError('Error al obtener publicaciones por categoría. Por favor, inténtelo de nuevo más tarde.');
        })
      );
  }
}