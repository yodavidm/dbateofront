import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Notificacion } from '../interfaces/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private baseUrl = 'https://dbateorepo-production.up.railway.app';

  constructor(private http: HttpClient,private authService:AuthService) { }

  verNotificaciones(id:number):Observable<Notificacion[]>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);

    return this.http.get<Notificacion[]>(`${this.baseUrl}/notificaciones/usuario/${id}`,{headers});
  }

  eliminarNotis(idUsuario: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);

    return this.http.delete<void>(`${this.baseUrl}/notificaciones/usuario/${idUsuario}/eliminar`,{headers});
  }
  

}

