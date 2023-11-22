
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const fccCorporateRoutes: Routes = [
    // Below piece of code should not be removed. This is kept for future reference when lazy loading is implemented .
    // { path: 'trade',
    // loadChildren: () => import('../corporate/trade/fcc-trade.module').then(m => m.FccTradeModule)
    // },
];

@NgModule({
    imports: [RouterModule.forChild(fccCorporateRoutes)],
    exports: [RouterModule]
  })
export class FccCorporateRoutes { }
