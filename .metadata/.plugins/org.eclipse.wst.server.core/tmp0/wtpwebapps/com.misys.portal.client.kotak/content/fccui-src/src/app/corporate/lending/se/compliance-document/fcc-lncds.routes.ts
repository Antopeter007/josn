import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const lncdsRoutes: Routes = [

];

@NgModule({
  imports: [RouterModule.forRoot(lncdsRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class FccLncdsRoute { }
