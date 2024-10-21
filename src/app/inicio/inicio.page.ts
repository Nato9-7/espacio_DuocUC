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
        this.reservas = response.filter((reserva: any) => reserva.estado_reserva === 'pendiente');
        
      },
      (error) => {
        console.error(error);
        alert('Error al obtener las reservas');
      }
    );
  }
}
