import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {

  reservas: any[] = [];
  nuevaReserva = {
    sala: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
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
        this.reservas = response; // Asigna las reservas del usuario
      },
      (error) => {
        console.error(error);
        alert('Error al obtener las reservas');
      }
    );
  }

  crearReserva() {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('No se ha encontrado el usuario. Por favor, inicia sesión.');
      return;
    }

    // Asigna el userId a la nueva reserva
    this.nuevaReserva.userId = userId; 

    // Enviar la nueva reserva al servidor
    this.http.post('http://localhost:3000/reserva', this.nuevaReserva).subscribe(
      (response) => {
        console.log('Reserva creada:', response);
        this.obtenerReservas(); // Actualiza la lista de reservas
        // Reinicia el formulario
        this.nuevaReserva = { sala: '', fecha: '', horaInicio: '', horaFin: '', userId: '' };
      },
      (error) => {
        console.error(error);
        alert('Error al crear la reserva');
      }
    );
  }
}
