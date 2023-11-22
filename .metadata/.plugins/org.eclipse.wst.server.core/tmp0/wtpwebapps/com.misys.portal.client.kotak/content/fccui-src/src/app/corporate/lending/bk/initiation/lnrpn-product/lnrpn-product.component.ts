import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { TransactionComponent } from '../../../../trade/common/component/transaction/transaction.component';
import { CustomCommasInCurrenciesPipe } from '../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../trade/lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../../../app/base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../app/common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { ProductStateService } from './../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../trade/lc/initiation/pipes/currency-converter.pipe';



@Component({
  selector: 'app-lnrpn-product',
  templateUrl: './lnrpn-product.component.html',
  styleUrls: ['./lnrpn-product.component.scss']
})
export class LnrpnProductComponent extends TransactionComponent implements OnInit {

  tnxTypeCode: any;

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
              protected currencyConverterPipe: CurrencyConverterPipe) {
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
    return true;
  }

  /**
   * Invoked before submit
   */
  beforeSubmitValidation(): boolean {
    const isValid = this.validate();
    this.eventEmitterService.subFlag.next(isValid);
    return true;
  }

  validate() {
    let isValid = false;
    let sectionForm: FCCFormGroup;
    if (this.tnxTypeCode !== FccGlobalConstant.N002_INQUIRE) {
      sectionForm = this.productStateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS, FccGlobalConstant.PRODUCT_BK);
      // Do Business Validation
      if (sectionForm) {
        isValid = true;
      }
    } else {
      isValid = true;
    }
    return isValid;
  }
}
