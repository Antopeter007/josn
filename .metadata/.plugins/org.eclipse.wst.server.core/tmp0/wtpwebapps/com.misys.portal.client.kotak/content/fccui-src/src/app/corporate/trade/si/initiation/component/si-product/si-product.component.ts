import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { TransactionComponent } from '../../../../common/component/transaction/transaction.component';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { SiProductService } from '../../../services/si-product.service';
import { CommonService } from './../../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
@Component({
  selector: 'app-si-product',
  templateUrl: './si-product.component.html',
  styleUrls: ['./si-product.component.scss']
})
export class SiProductComponent extends TransactionComponent implements OnInit {

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
              protected siProductService: SiProductService) {
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
    return this.siProductService.beforeSaveValidation(this.form);
  }

  beforeSubmitValidation(): boolean {
    return this.siProductService.beforeSubmitValidation();
  }


}
