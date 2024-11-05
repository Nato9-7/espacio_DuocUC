import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {

  reservas : any[] = [];
  fecha!: string;
  sala!: number;
  estado: number = 1;
  userId = localStorage.getItem('userId');

  constructor(private http: HttpClient, private database : DatabaseService) { }

  ngOnInit() {
  }

  async onSubmit() {
    if (this.fecha && this.sala && this.estado && this.userId) {
      try {
          // Espera a que se agregue la reserva
          await this.database.addReserva(this.fecha, this.sala, this.estado, Number(this.userId));
          console.log('Reserva enviada con éxito');

          // Opcional: manejar la respuesta o reiniciar el formulario
      } catch (error) {
          console.error('Error al agregar la reserva:', error);
      }
    }
  }
 
}
