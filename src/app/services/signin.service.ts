import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterDTO } from '../interfaces/register-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  constructor(private http:HttpClient) { }

  private baseUrl = 'https://dbateorepo-production.up.railway.app';
  
  signin(registerDto:RegisterDTO):Observable<RegisterDTO>{
    return this.http.post<RegisterDTO>(`${this.baseUrl}/auth/register`,registerDto);
  }
}
