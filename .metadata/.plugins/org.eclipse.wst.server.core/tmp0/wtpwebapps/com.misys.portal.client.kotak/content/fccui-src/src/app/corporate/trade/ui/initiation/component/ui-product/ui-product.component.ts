import { TransactionComponent } from './../../../../common/component/transaction/transaction.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { CurrencyConverterPipe } from '../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';

@Component({
  selector: 'app-ui-product',
  templateUrl: './ui-product.component.html',
  styleUrls: ['./ui-product.component.scss']
})
export class UiProductComponent extends TransactionComponent implements OnInit, OnDestroy {
  tnxTypeCode: any;
  enableCounterSection: boolean;
  enableSettlementAmount: boolean;
  isMasterRequired = false;
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
              protected uiProductService: UiProductService) {
              super(translateService, confirmationService, customCommasInCurrenciesPipe, searchLayoutService,
                commonService, utilityService, resolverService, productStateService, fileArray, dialogRef, currencyConverterPipe);
  }

  ngOnInit(): void {
    this.isMasterRequired = this.commonService.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.enableCounterSection = response.enableCounterSection;
        this.enableSettlementAmount = response.enableSettlementAmount;
      }
    });
    if (this.eventEmitterService.subsVar === undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        getSubmitEvent().subscribe(() => {
          this.beforeSubmitValidation();
        });
    }
  }

  beforeSaveValidation(): boolean {
    return this.uiProductService.beforeSaveValidation(this.form);
  }

  beforeSubmitValidation(): boolean {
    return this.uiProductService.beforeSubmitValidation();
  }

  ngOnDestroy() {
    this.commonService.isnewEventSaved = false;
  }


}
