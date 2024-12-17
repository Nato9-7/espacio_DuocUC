import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-agregar-penalizacion',
  templateUrl: './agregar-penalizacion.page.html',
  styleUrls: ['./agregar-penalizacion.page.scss'],
})
export class AgregarPenalizacionPage implements OnInit {
  userId!: number;
  fecha!: string;
  descripcion: string = '';
  minFecha: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private database: DatabaseService
  ) {}

  ngOnInit() {
    this.userId = +this.route.snapshot.paramMap.get('userId')!; // Obtiene el ID del usuario de la ruta
    this.setMinFecha();
  }

  setMinFecha() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
    const day = today.getDate().toString().padStart(2, '0'); // Día en formato DD
    this.minFecha = `${year}-${month}-${day}`; // Formato final YYYY-MM-DD
  }

  async crearPenalizacion() {
    if (this.userId !== null && this.descripcion !== null && this.fecha !== null) {
      this.database.addPenalizacion(this.fecha,this.descripcion,this.userId);
      alert('Penalizacion agregada correctamente');
    } else {
      console.log("Rut del usuario no válido.");
      alert('Error al crear penalizacion');
    }
    this.router.navigate([`/administrar`]);
  }
}
