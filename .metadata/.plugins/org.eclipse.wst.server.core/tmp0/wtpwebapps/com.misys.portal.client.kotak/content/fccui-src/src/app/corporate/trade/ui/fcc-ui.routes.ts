import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const uiroutes: Routes = [
];

@NgModule({
    imports: [RouterModule.forChild(uiroutes)],
    exports: [RouterModule ]
  })
export class FccUiRoutes { }
