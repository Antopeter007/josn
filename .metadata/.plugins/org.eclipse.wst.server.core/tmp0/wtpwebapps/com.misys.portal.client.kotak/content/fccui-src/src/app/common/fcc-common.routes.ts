import { TradeProductsRoutes } from './trade-products.routes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonFeaturesRoutes } from './common-features.routes';
import { LendingProductsRoutes } from './lending-products.routes';
import { CashProductsRoutes } from './cash-products.routes';

const routes: Routes = [

];

@NgModule({
  imports: [
    TradeProductsRoutes,
    LendingProductsRoutes,
    CashProductsRoutes,
    CommonFeaturesRoutes,
    RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" }),
  ],
  exports: [RouterModule]
})

export class FccCommonRoutes { }
