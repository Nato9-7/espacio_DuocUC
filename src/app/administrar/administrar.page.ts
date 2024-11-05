import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'; // Importa NavController

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {

  nombreUsuario: string | null = null;
  penalizaciones: any[] = [];
  userId!: number;
  
  constructor(private http: HttpClient, private navCtrl: NavController, private router: Router) { }

  ngOnInit() { }

  buscarUsuario(userId: number) {
    if (!userId) {
      alert('Por favor, ingresa un ID de usuario.');
      return;
    }

    this.http.get(`http://localhost:3000/usuario/${userId}`).subscribe(
      (response: any) => {
        console.log('Usuario encontrado:', response);
        this.nombreUsuario = response.Nombre;
        console.log(response.Nombre);
        this.obtenerPenalizaciones(userId);
      },
      (error) => {
        console.error('Error al buscar usuario:', error);
        alert('Usuario no encontrado.');
        this.nombreUsuario = null;
        this.penalizaciones = [];
      }
    );
  }

  obtenerPenalizaciones(userId: number) {
    this.http.get(`http://localhost:3000/penalizacion/${userId}`).subscribe(
      (response: any) => {
        console.log('Penalizaciones del usuario:', response);
        this.penalizaciones = response;
        
        if (this.penalizaciones.length === 0) {
          this.penalizaciones = [{ mensaje: 'El usuario no tiene penalizaciones.' }];
        }
      },
      (error) => {
        console.error('Error al obtener penalizaciones:', error);
        if (error.status === 404) {
          this.penalizaciones = [{ mensaje: 'El usuario no tiene penalizaciones.' }];
        } else {
          alert('Error en el servidor.');
        }
      }
    );
  }

  eliminarPenalizacion(idPenalizacion: number) {
    this.http.delete(`http://localhost:3000/penalizacion/${idPenalizacion}`).subscribe(
      () => {
        console.log(`Penalización con ID ${idPenalizacion} eliminada`);
        this.penalizaciones = this.penalizaciones.filter(
          penalizacion => penalizacion.id_penalizacion !== idPenalizacion
        );
      },
      (error) => {
        console.error('Error al eliminar penalización:', error);
        alert('Error al eliminar la penalización.');
      }
    );
  }

  irAgregarPenalizacion() {
    if (!this.userId) {
      alert('Por favor, busca un usuario primero.');
      return;
    }
    this.router.navigate([`/agregar-penalizacion`, this.userId]);
  }
}
