import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  reservas: any[] = [];
  nuevaReserva = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    sala: '',
    userId: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerReservas();
  }

  obtenerReservas() {
    const userId = localStorage.getItem('userId');
    
    this.http.get(`http://localhost:3000/reserva/${userId}`).subscribe(
      (response: any) => {
        console.log('Reservas del usuario:', response);
        this.reservas = response.filter((reserva: any) => reserva.estado_reserva === 'pendiente');
      },
      (error) => {
        console.error(error);
        alert('Error al obtener las reservas');
      }
    );
  }

  crearReserva() {
    const userId = localStorage.getItem('userId') || ''; // Asigna una cadena vacía si es null
    this.nuevaReserva.userId = userId; // Asigna el userId a la nueva reserva
  
    this.http.post('http://localhost:3000/reserva', this.nuevaReserva).subscribe(
      (response) => {
        console.log('Reserva creada:', response);
        this.obtenerReservas(); // Actualiza la lista de reservas
        this.nuevaReserva = { fecha: '', horaInicio: '', horaFin: '', sala: '', userId: '' }; // Reinicia el formulario
      },
      (error) => {
        console.error(error);
        alert('Error al crear la reserva');
      }
    );
  }

  cancelarReserva(reservaId: number){
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.http.delete(`http://localhost:3000/reserva/${reservaId}`).subscribe(
        (response: any) => {
          console.log('Reserva cancelada:', response);
          this.obtenerReservas();  // Refresca la lista de reservas
        },
        (error) => {
          console.error('Error al cancelar la reserva:', error);
          alert('Error al cancelar la reserva');
        }
      );
    }
  }
  
}
