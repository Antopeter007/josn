import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { TransactionComponent } from '../../../../common/component/transaction/transaction.component';
import { LcProductService } from '../../../services/lc-product.service';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { UtilityService } from '../../services/utility.service';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';

@Component({
  selector: 'app-lc-product',
  templateUrl: './lc-product.component.html',
  styleUrls: ['./lc-product.component.scss']
})

export class LcProductComponent extends TransactionComponent implements OnInit {
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
              protected currencyConverterPipe: CurrencyConverterPipe, protected lcProductService: LcProductService) {
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

  beforeSaveValidation(): boolean {
    return this.lcProductService.beforeSaveValidation(this.form);
  }

  beforeSubmitValidation(): boolean {
    return this.lcProductService.beforeSubmitValidation();
  }

}
