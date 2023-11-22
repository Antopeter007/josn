import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FccLcRoutes } from '../corporate/trade/lc/fcc-lc.routes';
import { ProductComponent } from './components/product-component/product.component';
import { FccElRoutes } from '../corporate/trade/el/fcc-el.routes';
import { AuthGuard } from './guards/auth.guard';
import { ConfirmationGuard } from '../guards/confirmation/confirmation.guard';

const routes: Routes = [
  {
    path: 'productScreen', component: ProductComponent,
    canActivate: [AuthGuard],
    canDeactivate: [ConfirmationGuard]
  }
];

@NgModule({
  imports: [ FccLcRoutes, FccElRoutes, RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class TradeProductsRoutes { }


