import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const fccLendingRoutes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(fccLendingRoutes)],
  exports: [RouterModule]
})
export class FccLendingRoutes { }
