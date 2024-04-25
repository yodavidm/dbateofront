import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Publicacion } from '../interfaces/publicacion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  private baseUrl = 'http://localhost:8080'; // URL base de tu backend

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
}