import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Publicacion } from '../interfaces/publicacion';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  private baseUrl = 'https://dbateofront.vercel.app/'; // URL base de tu backend

  constructor(private http: HttpClient) { }

  crearPublicacion(publicacion: Publicacion): Observable<Publicacion> {
    return this.http.post<Publicacion>(`${this.baseUrl}/publicaciones/crear`, publicacion);
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