import { Component } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { AuthService } from './services/auth.service'; 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor( private database : DatabaseService, public authService: AuthService) {
    this.initApp();
  }

  async initApp(){
    await this.database.initializePlugin();
    SplashScreen.hide();
  }

  logout() {
    this.authService.logout();  // Llama al servicio de logout
  }
}
