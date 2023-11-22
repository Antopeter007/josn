import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FtCashProductComponent } from './components/ft-cash-product/ft-cash-product.component';
import { FtCashGeneralDetailsComponent } from './components/ft-cash-general-details/ft-cash-general-details.component';
import { FormResolverModule } from '../../../../shared/FCCform/form/form-resolver/form-resolver.module';

@NgModule({
  declarations: [FtCashGeneralDetailsComponent, FtCashProductComponent],
  imports: [
    CommonModule,
    FormResolverModule
  ]
})
export class FccFtCashModule { }
