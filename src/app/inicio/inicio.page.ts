import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';

import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  reservas: any[] = [];
  esAdmin: boolean = false;
  reservaIdParaConfirmar!: number ; 

  constructor(private http: HttpClient, private database : DatabaseService) {}

  ngOnInit() {
    this.obtenerReservas();
    this.checkCameraPermissions(); // Verificar permisos al iniciar
  }

  // obtenerReservas() {
  //   const userId = localStorage.getItem('userId');

  //   this.http.get(`http://localhost:3000/reserva/${userId}`).subscribe(
  //     (response: any) => {
  //       console.log('Reservas del usuario:', response);
  //       this.reservas = response.filter((reserva: any) => reserva.estado_reserva === 1);
  //     },
  //     (error) => {
  //       console.error('Error al obtener reservas:', error);
  //       if (error.status === 404) {
  //         console.log("no existen reservas");
  //       } else {
  //         alert('Error en el servidor.');
  //       }
  //     }
  //   );
  // }

  // async checkCameraPermissions() {
  //   const { camera } = await BarcodeScanner.checkPermissions();
  //   if (camera !== 'granted') {
  //     await BarcodeScanner.requestPermissions();
  //   }
  // }

  // async startScan(reservaId: number) {
  //   this.reservaIdParaConfirmar = reservaId; // Almacena el ID de reserva a confirmar
  //   const listener = await BarcodeScanner.addListener('barcodeScanned', (result) => {
  //     console.log('Barcode scanned:', result.barcode);

  //     const reservaIdString = result.barcode.rawValue; // Ajusta según tu estructura
  //     const reservaId = Number(reservaIdString);

  //     if (!isNaN(reservaId)) {
  //       this.stopScan(); // Detener el escáner después de escanear
  //       this.confirmarReserva(this.reservaIdParaConfirmar); // Confirma la reserva almacenada
  //     } else {
  //       alert('El ID de la reserva escaneado no es un número válido.');
  //     }
  //   });

  //   await BarcodeScanner.startScan();
  // }
  
  

  // async stopScan() {
  //   await BarcodeScanner.stopScan();
  //   await BarcodeScanner.removeAllListeners(); // Remover listeners
  // }

  // cancelarReserva(reservaId: number) {
  //   if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
  //     this.http.put(`http://localhost:3000/reserva/${reservaId}`, { estado_reserva: 3 }).subscribe(
  //       (response: any) => {
  //         console.log('Reserva cancelada:', response);
  //       },
  //       (error) => {
  //         console.error('Error al cancelar la reserva:', error);
  //         alert('Error al cancelar la reserva');
  //       }
  //     );
  //   }
  // }

  // confirmarReserva(reservaId: number) {
  //   this.http.put(`http://localhost:3000/reserva/confirmar/${reservaId}`, {}).subscribe(
  //     (response: any) => {
  //       console.log('Reserva confirmada:', response);
  //       this.obtenerReservas(); // Actualiza la lista de reservas
  //       alert('Reserva confirmada exitosamente');
  //     },
  //     (error) => {
  //       console.error('Error al confirmar la reserva:', error);
  //       alert('Error al confirmar la reserva');
  //     }
  //   );
  // }

  async obtenerReservas() {
    const userId = Number(localStorage.getItem('userId')); // Asegúrate de que userId es un número

    if (!isNaN(userId)) {
      const reservas = await this.database.getReservasByUserId(userId); // Método que debes implementar en DatabaseService
      this.reservas = reservas.filter((reserva: any) => reserva.estado === 1); // Filtrar reservas activas
      console.log('Reservas del usuario:', this.reservas);
    } else {
      console.log("No hay un usuario autenticado.");
    }
  }

  async checkCameraPermissions() {
    const { camera } = await BarcodeScanner.checkPermissions();
    if (camera !== 'granted') {
      await BarcodeScanner.requestPermissions();
    }
  }

  async startScan(reservaId: number) {
    this.reservaIdParaConfirmar = reservaId; // Almacena el ID de reserva a confirmar
    const listener = await BarcodeScanner.addListener('barcodeScanned', (result) => {
      console.log('Barcode scanned:', result.barcode);

      const reservaIdString = result.barcode.rawValue; // Ajusta según tu estructura
      const reservaId = Number(reservaIdString);

      if (!isNaN(reservaId)) {
        this.stopScan(); // Detener el escáner después de escanear
        this.confirmarReserva(this.reservaIdParaConfirmar); // Confirma la reserva almacenada
      } else {
        alert('El ID de la reserva escaneado no es un número válido.');
      }
    });

    await BarcodeScanner.startScan();
  }

  async stopScan() {
    await BarcodeScanner.stopScan();
    await BarcodeScanner.removeAllListeners(); // Remover listeners
  }

  cancelarReserva(reservaId: number) {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.database.cancelarReserva(reservaId) // Método que debes implementar en DatabaseService
        .then(response => {
          console.log('Reserva cancelada:', response);
          this.obtenerReservas(); // Actualiza la lista de reservas
        })
        .catch(error => {
          console.error('Error al cancelar la reserva:', error);
          alert('Error al cancelar la reserva');
        });
    }
  }

  confirmarReserva(reservaId: number) {
    this.database.confirmarReserva(reservaId) // Método que debes implementar en DatabaseService
      .then(response => {
        console.log('Reserva confirmada:', response);
        this.obtenerReservas(); // Actualiza la lista de reservas
        alert('Reserva confirmada exitosamente');
      })
      .catch(error => {
        console.error('Error al confirmar la reserva:', error);
        alert('Error al confirmar la reserva');
      });
  }
}
