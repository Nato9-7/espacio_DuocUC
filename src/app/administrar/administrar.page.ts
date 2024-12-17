import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'; // Importa NavController
import { DatabaseService } from '../services/database.service';
@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {

  nombreUsuario: string | null = null;
  penalizaciones: any[] = [];
  userRut!: string;
  alertController: any;
  reservas: any[] = [];

  constructor(
    private http: HttpClient, 
    private navCtrl: NavController, 
    private router: Router, 
    private database: DatabaseService) { }

  ngOnInit() { }

  async obtenerUser() {
    if (this.userRut !== null) { // Verifica si userRut no es nulo
      const usuario = await this.database.getUserByRut(this.userRut); // Llama a la base de datos con userRut
  
      if (usuario) {
        alert('Usuario encontrado');
        console.log('Usuario encontrado:', usuario.rut);
        this.nombreUsuario = usuario.name;
        this.obtenerReservas(usuario.id);
        this.obtenerPenalizaciones(usuario.id);
      } else {
        alert('Usuario no encontrado');
      }
    } else {
      console.log('Rut del usuario no válido.');
    }
  }
  
  
  
  async obtenerReservas(usuario: number) {
    
    console.log('UsuarioObtenido', usuario);
  
    if (!isNaN(usuario)) {
      try {
        const reservas = await this.database.getReservasByUserId(usuario);
        this.reservas = reservas.filter((reserva: any) => reserva.estado === 3);
        console.log('Reservas del usuario:', JSON.stringify(this.reservas));
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      }
    } else {
      console.log("No hay un usuario autenticado.");
    }
  }

  async obtenerPenalizaciones(userId: number) {
    try {
      const penalizaciones = await this.database.getPenalizacionesByUserId(userId);
      this.penalizaciones = penalizaciones;
      console.log('Penalizaciones del usuario:', this.penalizaciones);
    } catch (error) {
      console.error('Error al obtener penalizaciones:', error);
    }
  }
  

  irAgregarPenalizacion() {
    if (!this.userRut) {
      alert('Por favor, busca un usuario primero.');
      return;
    }
    this.router.navigate([`/agregar-penalizacion`, this.userRut]);
  }
}
