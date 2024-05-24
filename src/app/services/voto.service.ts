import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VotoDTO } from '../interfaces/voto-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VotoService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:8080';

  votarPositivo(voto: VotoDTO): Observable<VotoDTO> {
    return this.http.post<VotoDTO>(`${this.baseUrl}/votos/votar`, voto); // Enviar el voto positivo al backend
  }



}