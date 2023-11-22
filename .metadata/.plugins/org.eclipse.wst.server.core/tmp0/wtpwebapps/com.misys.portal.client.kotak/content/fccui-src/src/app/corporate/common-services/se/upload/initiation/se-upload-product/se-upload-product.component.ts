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
import { CustomCommasInCurrenciesPipe } from '../../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../../trade/lc/initiation/services/utility.service';
import { CurrencyConverterPipe } from '../../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { SeUploadProductService } from '../../services/se-upload-product.service';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';

@Component({
  selector: 'app-se-upload-product',
  templateUrl: './se-upload-product.component.html',
  styleUrls: ['./se-upload-product.component.scss']
})
export class SeUploadProductComponent extends TransactionComponent implements OnInit {
  
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
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected seUploadProductService: SeUploadProductService) {
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
    return this.seUploadProductService.beforeSaveValidation(this.form);
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
      sectionForm = this.productStateService.getSectionData(FccGlobalConstant.SE_UPLOAD_GENERAL_DETAILS, FccGlobalConstant.PRODUCT_SE);
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

