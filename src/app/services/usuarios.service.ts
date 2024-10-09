import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:3000/usuario';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      tap(data => console.log('Datos recibidos:', data)),  // Añade este log para depuración
      catchError(error => {
        console.error('Error al obtener los usuarios:', error);
        return throwError(error);
      })
    );
  }
  
}
