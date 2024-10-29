import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {

  nombreUsuario: string | null = null;
  penalizaciones: any[] = [];
  userId!: number ;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  obtenerPenalizaciones(userId: number) {
    this.http.get(`http://localhost:3000/penalizacion/${userId}`).subscribe(
      (response: any) => {
        console.log('Penalizaciones del usuario:', response);
        this.penalizaciones = response.filter((penalizacion: any) => penalizacion.estado_penalizacion === 1);
      },
      (error) => {
        console.error('Error al obtener penalizaciones:', error);
        if (error.status === 404) {
          console.log("no existen penalizaciones")
        } else {
          alert('Error en el servidor.');
        }
      }
    );
  
}

  buscarUsuario(userId: number) {
    this.http.get(`http://localhost:3000/usuario/${userId}`).subscribe(
      (response: any) => {
        console.log('Usuario encontrado:', response);
        this.nombreUsuario = response.nombre;
        this.obtenerPenalizaciones(userId)
      },
      (error) => {
        console.error('Error al buscar usuario:', error);
        alert('Usuario no encontrado.');
        this.nombreUsuario = null;
      }
    );
  }

  eliminarPenalizacion(){
    
  }

}
