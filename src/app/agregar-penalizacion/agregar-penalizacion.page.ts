import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agregar-penalizacion',
  templateUrl: './agregar-penalizacion.page.html',
  styleUrls: ['./agregar-penalizacion.page.scss'],
})
export class AgregarPenalizacionPage implements OnInit {
  userId!: number;
  descripcion: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = +this.route.snapshot.paramMap.get('userId')!; // Obtiene el ID del usuario de la ruta
  }

  confirmarPenalizacion() {
    if (!this.descripcion) {
      alert('Por favor, ingresa una descripción.');
      return;
    }

    const penalizacionData = {
      Descripcion: this.descripcion,
      Usuario_Id_usuario: this.userId
    };

    this.http.post('http://localhost:3000/penalizacion/crear', penalizacionData).subscribe(
      () => {
        alert('Penalización agregada exitosamente');
        this.router.navigate(['/administrar']); // Navega de regreso a la página de administración
      },
      (error) => {
        console.error('Error al agregar penalización:', error);
        alert('Error al agregar penalización.');
      }
    );
  }
}
