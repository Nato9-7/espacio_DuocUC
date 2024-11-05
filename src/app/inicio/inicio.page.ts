import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../services/database.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage  {
  reservas: any[] = [];
  esAdmin: boolean = false;
  reservaIdParaConfirmar!: number ; 

  isSupported = false;
  barcodes: Barcode[] = [];
  constructor(private http: HttpClient, private database : DatabaseService, private alertController: AlertController) {}

  ionViewWillEnter() {
    this.obtenerReservas();
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
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
    const userId = Number(localStorage.getItem('userId'));
    console.log('este es el id usuario de inicio', localStorage.getItem('userId'));
  
    if (!isNaN(userId)) {
      try {
        const reservas = await this.database.getReservasByUserId(userId);
        this.reservas = reservas.filter((reserva: any) => reserva.estado === 1);
        console.log('Reservas del usuario:', JSON.stringify(this.reservas));
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      }
    } else {
      console.log("No hay un usuario autenticado.");
    }
  }

  async scan(reservaId: number): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);


    // Verifica si el primer código escaneado contiene el mensaje "confirmado"
    if (barcodes.length > 0) {
      const scannedValue = barcodes[0].rawValue; // Obtiene el valor escaneado
      if (scannedValue === 'Confirmación de reserva') {
        this.confirmarReserva(reservaId); // Llama a la función para confirmar la reserva
      } else {
        // Opcional: maneja el caso donde el valor escaneado no es "confirmado"
        console.log('El código escaneado no es válido:', scannedValue);
      }
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  cancelarReserva(reservaId: number) {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.database.cancelarReserva(reservaId) 
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

  eliminarTodo(){
    this.database.eliminarTodasLasReservas();
  }


}
