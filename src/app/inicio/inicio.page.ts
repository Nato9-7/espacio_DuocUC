import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  reservas : any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerReservas();
  }
  
  obtenerReservas(){
    const userId = localStorage.getItem('userId');
    
    this.http.get(`http://localhost:3000/reserva/${userId}`).subscribe(
      (response: any) => {
        console.log('Reservas del usuario:', response);
        this.reservas = response.filter((reserva: any) => reserva.estado_reserva === 'PENDIENTE');
        
      },
      (error) => {
        console.error(error);
        alert('Error al obtener las reservas');
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

  confirmarReserva(reservaId: number) {
    this.http.put(`http://localhost:3000/reserva/confirmar/${reservaId}`, {}).subscribe(
      (response: any) => {
        console.log('Reserva confirmada:', response);
        this.obtenerReservas();  // Actualiza la lista de reservas
        alert('Reserva confirmada exitosamente');
      },
      (error) => {
        console.error('Error al confirmar la reserva:', error);
        alert('Error al confirmar la reserva');
      }
    );
  }

}
