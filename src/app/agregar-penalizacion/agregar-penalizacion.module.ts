import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarPenalizacionPageRoutingModule } from './agregar-penalizacion-routing.module';

import { AgregarPenalizacionPage } from './agregar-penalizacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarPenalizacionPageRoutingModule
  ],
  declarations: [AgregarPenalizacionPage]
})
export class AgregarPenalizacionPageModule {}
