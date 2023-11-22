import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const fccCashRoutes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(fccCashRoutes)],
  exports: [RouterModule]
})
export class FccCashRoutes { }
