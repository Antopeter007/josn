import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const fccSystemFeatureRoutes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(fccSystemFeatureRoutes)],
  exports: [RouterModule]
})
export class FccSystemFeatureRoutes { }
