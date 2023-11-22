import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { TransactionComponent } from '../../../../common/component/transaction/transaction.component';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { CurrencyConverterPipe } from '../../../../lc/initiation/pipes/currency-converter.pipe';
import { TfProductService } from '../../../services/tf-product.service';

@Component({
  selector: 'app-tf-product',
  templateUrl: './tf-product.component.html',
  styleUrls: ['./tf-product.component.scss']
})
export class TfProductComponent extends TransactionComponent implements OnInit {
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
              protected tfProductService: TfProductService) {
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

    beforeSaveValidation(): boolean {
      return this.tfProductService.beforeSaveValidation(this.form);
    }


    beforeSubmitValidation(): boolean {
      return this.tfProductService.beforeSubmitValidation();
    }



}
