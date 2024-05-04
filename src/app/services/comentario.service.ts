import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from '../interfaces/comentario';
import { ComentarioDTO } from '../interfaces/comentario-dto';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  constructor(private http:HttpClient) { }
  private baseUrl =  'https://dbateorepo-production.up.railway.app'; //url back

  obtenerComentariosPorPublicacion(idPublicacion:number):Observable<Comentario[]>{
    return this.http.get<Comentario[]>(`${this.baseUrl}/comentarios/publicacion/${idPublicacion}`)
  }

  crearComentario(comentarioDTO:ComentarioDTO):Observable<Comentario>{
    return this.http.post<Comentario>(`${this.baseUrl}/comentarios/comentar`, comentarioDTO);
  }

}
