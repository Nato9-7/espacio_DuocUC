import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-crear-penalizacion',
  templateUrl: './crear-penalizacion.page.html',
  styleUrls: ['./crear-penalizacion.page.scss'],
})
export class CrearPenalizacionPage {
  descripcion: string = '';
  fechaCaducidad: string = '';

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  async crearPenalizacion() {
    const idUsuario = localStorage.getItem('id_Usuario');
    
    if (!this.descripcion || !this.fechaCaducidad || !idUsuario) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const penalizacionData = {
      Descripcion: this.descripcion,
      FechaPenalizacion: this.fechaCaducidad,
      id_Usuario: parseInt(idUsuario, 10)
    };

    this.http.post('http://localhost:3000/penalizacion/crear', penalizacionData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(
      async (response) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Penalización creada correctamente.',
          buttons: ['OK'],
        });
        await alert.present();

        this.navCtrl.navigateRoot('/administrar');
      },
      async (error) => {
        console.error('Error al crear la penalización:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Error en el servidor al crear la penalización.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
}
