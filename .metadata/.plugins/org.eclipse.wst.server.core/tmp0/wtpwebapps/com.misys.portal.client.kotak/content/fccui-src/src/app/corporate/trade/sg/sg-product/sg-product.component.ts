import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { FccGlobalConstant } from '../../../../../app/common/core/fcc-global-constants';
import { CommonService } from '../../../../../app/common/services/common.service';
import { EventEmitterService } from '../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../common/services/search-layout.service';
import { TransactionComponent } from '../../common/component/transaction/transaction.component';
import { ProductStateService } from '../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../lc/initiation/services/utility.service';
import { CurrencyConverterPipe } from '../../lc/initiation/pipes/currency-converter.pipe';
import { SgProductService } from '../services/sg-product.service';

@Component({
  selector: 'app-sg-product',
  templateUrl: './sg-product.component.html',
  styleUrls: ['./sg-product.component.scss']
})
export class SgProductComponent extends TransactionComponent implements OnInit {
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
              protected sgProductService: SgProductService) {
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
    return this.sgProductService.beforeSaveValidation();
  }

  beforeSubmitValidation(): boolean {
    return this.sgProductService.beforeSubmitValidation();
  }

}

