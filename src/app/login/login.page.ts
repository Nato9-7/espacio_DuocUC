import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service';

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
    private database : DatabaseService,
    private authService : AuthService
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

 

  async onLogin() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
  
      // Utilizamos el nuevo método validateUser para validar las credenciales
      const user = await this.database.validateUser(loginData.correo, loginData.password);
      this.authService.login(loginData.correo, loginData.password);
      if (user && this.authService.isAuthenticated()) {
        localStorage.setItem('userId', user.id.toString());
        console.log("Usuario autenticado:", loginData.correo, loginData.password);
        console.log("este es usuario", user?.email, user?.id, user?.password);
        this.navCtrl.navigateRoot('/inicio');
      } else {
        console.log("este es usuario", user?.email, user?.id, user?.password);
        alert('Correo o contraseña incorrectos');
      }
    }
  }

}
