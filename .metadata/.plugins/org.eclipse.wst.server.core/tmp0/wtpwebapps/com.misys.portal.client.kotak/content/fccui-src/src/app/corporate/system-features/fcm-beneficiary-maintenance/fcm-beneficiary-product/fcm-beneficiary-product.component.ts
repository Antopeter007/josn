import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { ResolverService } from '../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../common/services/search-layout.service';
import { TransactionComponent } from '../../../trade/common/component/transaction/transaction.component';
import { CustomCommasInCurrenciesPipe } from '../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from '../../../trade/lc/initiation/services/utility.service';
import { FccGlobalConstant } from './../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../common/services/common.service';
import { EventEmitterService } from './../../../../common/services/event-emitter-service';
import { ProductStateService } from './../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { FCMBeneficiaryProductService } from './../services/fcm-beneficiary-product.service';

@Component({
  selector: 'app-fcm-beneficiary-product',
  templateUrl: './fcm-beneficiary-product.component.html',
  styleUrls: ['./fcm-beneficiary-product.component.scss']
})
export class FCMBeneficiaryProductComponent extends TransactionComponent implements OnInit {

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
    protected currencyConverterPipe: CurrencyConverterPipe, protected fcmBeneficiaryProductService: FCMBeneficiaryProductService) {
      super(translateService, confirmationService, customCommasInCurrenciesPipe, searchLayoutService,
        commonService, utilityService, resolverService, productStateService, fileArray, dialogRef, currencyConverterPipe);
    }

  ngOnInit(): void {
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
    return this.fcmBeneficiaryProductService.beforeSaveValidation(this.form);
  }

  /**
   * Invoked before submit
   */
  beforeSubmitValidation(): boolean {
    return this.fcmBeneficiaryProductService.beforeSubmitValidation();
  }

}
