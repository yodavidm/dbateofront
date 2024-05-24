import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDTO } from '../interfaces/login-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = 'http://localhost:8080'; // URL base del backend

  constructor(private http:HttpClient) {}

  login(loginDto:LoginDTO):Observable<LoginDTO>{
    return this.http.post<LoginDTO>(`${this.baseUrl}/auth/login`,loginDto)
  }

  

}
