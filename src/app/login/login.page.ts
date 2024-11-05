import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  users = this.database.getUser();
  newUserName = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private navCtrl: NavController,
    private database : DatabaseService
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  // onLogin() {
  //   if (this.loginForm.valid) {
  //     const loginData = this.loginForm.value;

  //     const dataToSend = {
  //       correo: loginData.correo,
  //       password: loginData.password,
  //     };

  //     this.http.post('http://localhost:3000/login', dataToSend).subscribe(
  //       (response: any) => {
  //         if (response.message === 'Login exitoso') {
  //           localStorage.setItem('userId', response.userId);
  //           console.log("este es el usuario", localStorage.getItem('userId'));
            
  //           if (response.Admin) {
  //             this.navCtrl.navigateRoot('/administrar');
  //           } else {
  //             this.navCtrl.navigateRoot('/inicio');
  //           }
            
  //         } else {
  //           alert('Correo o contraseña incorrectos');
  //         }
  //       },
  //       (error) => {
  //         console.error('Error en la respuesta:', error);
  //         alert('Error en el servidor');
  //       }
  //     );
  //   }
  // }

  async onLogin() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
  
      // Utilizamos el nuevo método validateUser para validar las credenciales
      const user = await this.database.validateUser(loginData.correo, loginData.password);
  
      if (user) {
        localStorage.setItem('userId', user.id.toString());
        console.log("Usuario autenticado:", user);
        
        this.navCtrl.navigateRoot('/inicio');
      } else {
        alert('Correo o contraseña incorrectos');
      }
    }
  }
  
  async createUser() {
    await this.database.addUser(this.newUserName, 'newuser@example.com', 'newpassword');
    this.newUserName = '';
  }
}
