import { FccTptRoutes } from '../corporate/cash/fund transfer/ft/tpt/fcc-tpt.routes';
import { FcmPaymentBatchRoutes } from './../corporate/cash/payments/single/batch/fcm-payment-batch.routes';
import { FccSeCocqsRoutes } from './../corporate/cash/se/cheque services/stop cheque request/fcc-se-cocqs.routes';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationGuard } from '../guards/confirmation/confirmation.guard';
import { ProductComponent } from './components/product-component/product.component';
import { AuthGuard } from './guards/auth.guard';
import { FccTdCstdRoutes } from '../corporate/cash/td/initiation/fcc-td-cstd.routes';
import { FccSeCqbkrRoutes } from '../corporate/cash/se/cheque services/cheque book request/fcc-se-cqbkr.routes';
import { FccFtCashRoutes } from '../corporate/cash/ft/cash-fund-transfer/fcc-ft-cash.routes';
import { CommonProductComponent } from './components/common-product/common-product.component';
import { FcmPaymentInstrumentRoutes } from '../corporate/cash/payments/single/instrument/fcm-payment-instrument.routes';
import { AutosaveGuard } from '../guards/confirmation/autosave.guard';
import { FccBkRoutes } from '../corporate/cash/bk/bulkServices/fcc-bk.routes';


const routes: Routes = [
  {
    path: 'productScreen', component: ProductComponent,
    canActivate: [AuthGuard],
    canDeactivate:  [ConfirmationGuard]
  },
  {
    path: 'commonProductScreen', component: CommonProductComponent,
    canActivate: [AuthGuard],
    canDeactivate: [ConfirmationGuard, AutosaveGuard]
  }
];

@NgModule({
  imports: [FccSeCocqsRoutes, FccTdCstdRoutes, FccSeCqbkrRoutes, FccFtCashRoutes, FcmPaymentInstrumentRoutes,
    FcmPaymentBatchRoutes, FccTptRoutes, FccBkRoutes,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class CashProductsRoutes { }
