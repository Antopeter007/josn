import { PaymentInstrumentProductService } from './../../single/services/payment-instrument-product.service';
import { CurrencyConverterPipe } from './../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { FilelistService } from './../../../../trade/lc/initiation/services/filelist.service';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { CustomCommasInCurrenciesPipe } from './../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { ProductStateService } from './../../../../trade/lc/common/services/product-state.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { TransactionComponent } from './../../../../trade/common/component/transaction/transaction.component';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { ResolverService } from './../../../../../../app/common/services/resolver.service';
import { UtilityService } from './../../../../../../app/corporate/trade/lc/initiation/services/utility.service';
import { CommonService } from './../../../../../../app/common/services/common.service';
import { FccGlobalConstant } from '../../../../../../app/common/core/fcc-global-constants';

@Component({
  selector: 'app-payments-product',
  templateUrl: './payments-product.component.html',
  styleUrls: ['./payments-product.component.scss']
})
export class PaymentsProductComponent extends TransactionComponent implements OnInit {

  tnxTypeCode: string;
  form = this[FccGlobalConstant.FORM];

  constructor(protected eventEmitterService: EventEmitterService,
    protected productStateService: ProductStateService,
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected fileArray: FilelistService,
    protected dialogRef: DynamicDialogRef,
    protected currencyConverterPipe: CurrencyConverterPipe, protected paymentProductService: PaymentInstrumentProductService) {
    super(translateService, confirmationService, customCommasInCurrenciesPipe, searchLayoutService,
      commonService, utilityService, resolverService, productStateService, fileArray, dialogRef, currencyConverterPipe);
  }

  ngOnInit(): void {
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.eventEmitterService.subsVar === undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        getSubmitEvent().subscribe(() => {
          this.beforeSubmitValidation();
        });
    }
  }

  /**
   * Invoked before save
   */
  beforeSaveValidation(): boolean {
    return this.paymentProductService.beforeSaveValidation(this.form);
  }

  /**
   * Invoked before submit
   */
  beforeSubmitValidation(): boolean {
    return this.paymentProductService.beforeSubmitValidation();
  }
}
