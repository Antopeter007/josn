import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FccLnrpnRoutes } from '../corporate/lending/bk/fcc-lnrpn.routes';
import { FccLncdsRoute } from '../corporate/lending/se/compliance-document/fcc-lncds.routes';
import { FccBlfpRoutes } from '../corporate/lending/bk/blfp/fcc-blfp.routes';
import { FccLnRoutes } from './../corporate/lending/ln/fcc-ln.routes';
import { ConfirmationGuard } from './../guards/confirmation/confirmation.guard';
import { ProductComponent } from './components/product-component/product.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'productScreen', component: ProductComponent,
    canActivate: [AuthGuard],
    canDeactivate: [ConfirmationGuard]
  }
];

@NgModule({
  imports: [FccLnRoutes, FccLnrpnRoutes, FccLncdsRoute, FccBlfpRoutes, RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class LendingProductsRoutes { }
