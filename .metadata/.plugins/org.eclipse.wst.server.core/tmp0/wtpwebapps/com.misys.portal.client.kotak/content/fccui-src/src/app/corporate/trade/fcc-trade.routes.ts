import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const fccTradeRoutes: Routes = [
    // Below piece of code should not be removed. This is kept for future reference when lazy loading is implemented .
    // { path: 'lc',
    // loadChildren: () => import('../trade/lc/fcc-lc.module').then(m => m.FccLcModule)
    // },
];

@NgModule({
    imports: [RouterModule.forChild(fccTradeRoutes)],
    exports: [RouterModule]
  })
export class FccTradeRoutes { }
