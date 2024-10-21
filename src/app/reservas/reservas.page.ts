import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {

  reservas : any[] = [];

  constructor(private http: HttpClient,) { }

  ngOnInit() {
    this.obtenerReservas();
  }

  obtenerReservas(){
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
}
