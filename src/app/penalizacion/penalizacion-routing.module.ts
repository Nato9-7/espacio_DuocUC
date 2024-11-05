import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PenalizacionPage } from './penalizacion.page';

const routes: Routes = [
  {
    path: '',
    component: PenalizacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenalizacionPageRoutingModule {}
