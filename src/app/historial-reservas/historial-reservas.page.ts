import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonInfiniteScroll } from '@ionic/angular';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerReservas();
  }

  obtenerReservas(event?: any) {
    const userId = localStorage.getItem('userId');

    this.http.get(`http://localhost:3000/reserva/${userId}?page=${this.page}&limit=${this.limit}`).subscribe(
      (response: any) => {
        console.log('Reservas del usuario:', response);
        const nuevasReservas = response.filter((reserva: any) => reserva.estado_reserva === 2 || reserva.estado_reserva === 3);
        this.reservas = [...this.reservas, ...nuevasReservas];
        
        if (event) {
          event.target.complete();
        }
        
        // Si no hay más reservas, deshabilitamos el infinite scroll
        if (nuevasReservas.length < this.limit) {
          this.infiniteScroll.disabled = true;
        }
      },
      (error) => {
        console.error('Error al obtener reservas:', error);
        if (error.status === 404) {
          console.log("no existen reservas");
        } else {
          alert('Error en el servidor.');
        }
        if (event) {
          event.target.complete();
        }
      }
    );
  }

  loadData(event: any) {
    this.page++;
    this.obtenerReservas(event);
  }
}