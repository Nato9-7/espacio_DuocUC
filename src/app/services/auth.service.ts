import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }


  login(email: string, password: string) {
    // Esto sería reemplazado por una llamada a la API real
    if (email === 'admin@example.com' && password === 'admin1234') {
      // Si el usuario es admin, se guarda el rol como 'admin'
      this.currentUserSubject.next({ email: 'admin@example.com', role: 'admin' });
    } else if (email === 'user@example.com' && password === 'user1234') {
      // Si el usuario es normal, se guarda el rol como 'user'
      this.currentUserSubject.next({ email: 'user@example.com', role: 'user' });
    } else {
      // Si las credenciales son incorrectas, el usuario es null
      this.currentUserSubject.next(null);
    }
  }

  getUserRole() {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.role : null;
  }

  // Método para obtener el estado de autenticación del usuario
  isAuthenticated() {
    return this.currentUserSubject.value !== null;
  }

  // Método para cerrar sesión
  logout() {
    this.currentUserSubject.next(null);
  }
}
