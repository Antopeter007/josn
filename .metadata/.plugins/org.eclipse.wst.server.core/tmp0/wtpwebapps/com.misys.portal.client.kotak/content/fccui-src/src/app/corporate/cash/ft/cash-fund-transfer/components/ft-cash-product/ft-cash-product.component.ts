import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { TransactionComponent } from '../../../../../trade/common/component/transaction/transaction.component';
import { ProductStateService } from '../../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../../trade/lc/initiation/services/utility.service';
import { FtCashProductService } from '../../services/ft-cash-product.service';

@Component({
  selector: 'app-ft-cash-product',
  templateUrl: './ft-cash-product.component.html',
  styleUrls: ['./ft-cash-product.component.scss']
})
export class FtCashProductComponent extends TransactionComponent implements OnInit {

  tnxTypeCode: any;
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
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected ftCashProductService: FtCashProductService
) {
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
    return this.ftCashProductService.beforeSaveValidation(this.form);
  }


  /**
   * Invoked before submit
   */
  beforeSubmitValidation(): boolean {
    return this.ftCashProductService.beforeSubmitValidation();
  }

}
