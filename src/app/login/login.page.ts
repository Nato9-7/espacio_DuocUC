import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private navCtrl: NavController
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]], // Cambia "email" a "correo"
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    
    
  }

  onLogin() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
  
      const dataToSend = {
        correo: loginData.correo,
        password: loginData.password,
      };
  
      this.http.post('http://localhost:3000/login', dataToSend).subscribe(
        (response: any) => {
          if (response.message === 'Login exitoso') {
            this.navCtrl.navigateRoot('/home');
          } else {
            alert('Correo o contraseña incorrectos');
          }
        },
        (error) => {
          console.error('Error en la respuesta:', error);
          alert('Error en el servidor');
        }
      );
    }
  }
  
}
