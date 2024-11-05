import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {

  nombreUsuario: string | null = null; // Para almacenar el nombre del usuario encontrado
  penalizaciones: any[] = []; // Arreglo para almacenar las penalizaciones
  userId!: number; // ID del usuario a buscar
  
  constructor(private http: HttpClient) { }

  ngOnInit() { }

  buscarUsuario(userId: number) {
    if (!userId) {
      alert('Por favor, ingresa un ID de usuario.');
      return;
    }

    // Llama a la API para buscar el usuario
    this.http.get(`http://localhost:3000/usuario/${userId}`).subscribe(
      (response: any) => {
        console.log('Usuario encontrado:', response);
        this.nombreUsuario = response.nombre; // Asigna el nombre del usuario encontrado
        this.obtenerPenalizaciones(userId); // Llama a obtener penalizaciones para el usuario
      },
      (error) => {
        console.error('Error al buscar usuario:', error);
        alert('Usuario no encontrado.'); // Mensaje si no se encuentra el usuario
        this.nombreUsuario = null; // Resetea el nombre de usuario
        this.penalizaciones = []; // Limpia las penalizaciones
      }
    );
  }

  obtenerPenalizaciones(userId: number) {
    // Obtiene las penalizaciones del usuario
    this.http.get(`http://localhost:3000/penalizacion/${userId}`).subscribe(
      (response: any) => {
        console.log('Penalizaciones del usuario:', response);
        
        // Si no hay penalizaciones, se limpia el arreglo
        if (response.length === 0) {
          this.penalizaciones = []; // Se asigna un arreglo vacío
        } else {
          this.penalizaciones = response; // Asigna todas las penalizaciones
        }
      },
      (error) => {
        console.error('Error al obtener penalizaciones:', error);
        if (error.status === 404) {
          console.log("No existen penalizaciones");
          this.penalizaciones = []; // Asegúrate de que esté vacío
        } else {
          alert('Error en el servidor.');
        }
      }
    );
  }

  eliminarPenalizacion(idPenalizacion: number) {
    // Elimina una penalización por ID
    this.http.delete(`http://localhost:3000/penalizacion/${idPenalizacion}`).subscribe(
      () => {
        console.log(`Penalización con ID ${idPenalizacion} eliminada`);
        // Filtra la penalización eliminada del arreglo
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
}
