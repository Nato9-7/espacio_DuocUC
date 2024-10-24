import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {

  reservas: any[] = [];
  mostrarFormulario = false;

  constructor(private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
    this.obtenerReservas();
  }

  obtenerReservas() {
    const userId = localStorage.getItem('userId');

    this.http.get(`http://localhost:3000/reserva/${userId}`).subscribe(
      (response: any) => {
        console.log('Reservas del usuario:', response);
        this.reservas = response;
      },
      (error) => {
        console.error(error);
        alert('Error al obtener las reservas');
      }
    );
  }

  async crearReserva(nuevaReserva: any) {
    const fechaReserva = new Date(nuevaReserva.fecha);
    const fechaActual = new Date();

    if (fechaReserva < fechaActual) {
      await this.mostrarAlerta('Error', 'No se pueden agendar reservas para fechas anteriores al día de hoy.');
      return;
    }

    const userId = localStorage.getItem('userId');
    const reservaData = { ...nuevaReserva, userId };

    this.http.post(`http://localhost:3000/reserva`, reservaData).subscribe(
      (response: any) => {
        console.log('Reserva creada:', response);
        this.obtenerReservas();
        this.mostrarFormulario = false;
      },
      (error) => {
        console.error('Error al crear la reserva:', error);
        alert('Error al crear la reserva');
      }
    );
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
