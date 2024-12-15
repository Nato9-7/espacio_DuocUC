import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {

  reservas: any[] = [];
  fecha!: string;
  sala!: number;
  estado: number = 1;
  userId = localStorage.getItem('userId');
  minFecha: string = '';
  horarios: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  selectedSlot!: string;

  constructor(private database: DatabaseService) {}

  ngOnInit() {
    this.setMinFecha();
  }

  selectSlot(slot: string) {
    this.selectedSlot = slot;
  }


  setMinFecha() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
    const day = today.getDate().toString().padStart(2, '0'); // Día en formato DD
    this.minFecha = `${year}-${month}-${day}`; // Formato final YYYY-MM-DD
  }
  // Función para formatear la fecha
  formatFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    const year = fechaObj.getFullYear();
    const month = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
    const day = fechaObj.getDate().toString().padStart(2, '0'); // Día en formato DD

    // Retornar la fecha en formato YYYY-MM-DD (sin la hora)
    return `${year}-${month}-${day}`;
  }

  async onSubmit() {
    if (this.fecha && this.sala && this.estado && this.userId) {
        const fechaFormateada = this.formatFecha(this.fecha);
        const ocupado = await this.database.obtenerSalaOcupada(fechaFormateada, this.sala, this.selectedSlot);
        console.log("ESTE ES OCUPADO", ocupado);
        if (ocupado === true){
          alert("Horario ocupado")
          return
        }else{
          alert("Reserva hecha con éxito")
          await this.database.addReserva(fechaFormateada, this.sala, this.estado, Number(this.userId));
          await this.database.addSalaOcupada(fechaFormateada, this.sala, this.selectedSlot);
          console.log('Reserva enviada con éxito');
        }
     
    }
  }
}
