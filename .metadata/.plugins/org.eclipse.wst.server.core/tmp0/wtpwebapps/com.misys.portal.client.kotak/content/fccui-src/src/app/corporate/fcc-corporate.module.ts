

import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { FccCorporateRoutes } from './fcc-corporate.routes';
import { FccTradeModule } from './trade/fcc-trade.module';
import { FccLendingModule } from './lending/fcc-lending.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormResolverModule } from '../shared/FCCform/form/form-resolver/form-resolver.module';
import { MatTabsModule } from '@angular/material/tabs';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FccCashModule } from './cash/fcc-cash.module';
import { FccSystemFeatureModule } from './system-features/fcc-system-feature.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FccTradeModule,
    FccLendingModule,
    FccCashModule,
    FccCorporateRoutes,
    RecaptchaModule, RecaptchaFormsModule,
    FormResolverModule,
    MatTabsModule,
    AngularEditorModule,
    FccSystemFeatureModule
  ],
  exports: []
})
export class FccCorporateModule { }
