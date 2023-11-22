import { FcmPaymentBatchModule } from './payments/single/batch/fcm-payment-batch.module';
import { FcmPaymentInstrumentModule } from './payments/single/instrument/fcm-payment-instrument.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { FccCommonModule } from '../../common/fcc-common.module';
import { FormResolverModule } from '../../shared/FCCform/form/form-resolver/form-resolver.module';
import { FccCashRoutes } from './fcc-cash.routes';
import { FccSeCqbkrModule } from './se/cheque services/cheque book request/fcc-se-cqbkr.module';
import { FccSeCocqsModule } from './se/cheque services/stop cheque request/fcc-se-cocqs.module';
import { FccTdCstdModule } from './td/initiation/fcc-td-cstd.module';
import { PaymentsBulkMaintenanceModule } from './payments/bulk/payments-bulk-maintenance.module';
import { FccTptModule } from './fund transfer/ft/tpt/fcc-tpt.module';
import { FccBkModule } from './bk/bulkServices/fcc-bk.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FccCashRoutes,
    ProgressSpinnerModule,
    MatSidenavModule,
    MatIconModule,
    FccCommonModule,
    CardModule,
    TabViewModule,
    TooltipModule,
    MatExpansionModule,
    FormResolverModule,
    MatTabsModule,
    AngularEditorModule,
    FccSeCocqsModule,
    FccSeCqbkrModule,
    FccTdCstdModule,
    FcmPaymentInstrumentModule,
    FcmPaymentBatchModule,
    PaymentsBulkMaintenanceModule,
    FccTptModule,
    FccBkModule
  ]
})
export class FccCashModule { }
