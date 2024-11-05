import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PenalizacionPageRoutingModule } from './penalizacion-routing.module';

import { PenalizacionPage } from './penalizacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PenalizacionPageRoutingModule
  ],
  declarations: [PenalizacionPage]
})
export class PenalizacionPageModule {}
