import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonInfiniteScroll } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-historial-reservas',
  templateUrl: './historial-reservas.page.html',
  styleUrls: ['./historial-reservas.page.scss'],
})
export class HistorialReservasPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  reservas: any[] = [];
  page: number = 1;
  limit: number = 10;

  constructor(private http: HttpClient, private database : DatabaseService) { }

  ngOnInit() {
    this.obtenerReservas();
  }

  // obtenerReservas(event?: any) {
  //   const userId = localStorage.getItem('userId');

  //   this.http.get(`http://localhost:3000/reserva/${userId}?page=${this.page}&limit=${this.limit}`).subscribe(
  //     (response: any) => {
  //       console.log('Reservas del usuario:', response);
  //       const nuevasReservas = response.filter((reserva: any) => reserva.estado_reserva === 2 || reserva.estado_reserva === 3);
  //       this.reservas = [...this.reservas, ...nuevasReservas];
        
  //       if (event) {
  //         event.target.complete();
  //       }
        
  //       // Si no hay más reservas, deshabilitamos el infinite scroll
  //       if (nuevasReservas.length < this.limit) {
  //         this.infiniteScroll.disabled = true;
  //       }
  //     },
  //     (error) => {
  //       console.error('Error al obtener reservas:', error);
  //       if (error.status === 404) {
  //         console.log("no existen reservas");
  //       } else {
  //         alert('Error en el servidor.');
  //       }
  //       if (event) {
  //         event.target.complete();
  //       }
  //     }
  //   );
  // }

  async obtenerReservas() {
    const userId = Number(localStorage.getItem('userId')); // Asegúrate de que userId es un número

    if (!isNaN(userId)) {
      const reservas = await this.database.getReservasByUserId(userId); // Método que debes implementar en DatabaseService
      this.reservas = reservas.filter((reserva: any) => reserva.estado === 2 && reserva.estado === 3 ); // Filtrar reservas activas
      console.log('Reservas del usuario:', this.reservas);
    } else {
      console.log("No hay un usuario autenticado.");
    }
  }

  loadData(event: any) {
    this.page++;
    this.obtenerReservas();
  }
}