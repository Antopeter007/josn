import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { TransactionComponent } from '../../../../trade/common/component/transaction/transaction.component';
import { CustomCommasInCurrenciesPipe } from '../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../trade/lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { ProductStateService } from './../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../trade/lc/initiation/pipes/currency-converter.pipe';

@Component({
  selector: 'app-ln-product',
  templateUrl: './ln-product.component.html',
  styleUrls: ['./ln-product.component.scss']
})
export class LnProductComponent extends TransactionComponent implements OnInit {

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
    if (this.tnxTypeCode !== FccGlobalConstant.N002_INQUIRE) {
      if (this.form && this.form.get('loanRequestTypeOptions')) {
        const loanRequestType = this.form.get('loanRequestTypeOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
        loanRequestType.forEach( (element) => {
          element[FccGlobalConstant.DISABLED] = true;
        });
        this.form.get('loanRequestTypeOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
        const updatedoanRequestTypeOptions = [];
        if (this.form.get('loanRequestTypeOptions').value) {
          loanRequestType.forEach( (ele) => {
            if (ele.value === this.form.get('loanRequestTypeOptions').value) {
              updatedoanRequestTypeOptions.push(ele);
            }
          });
          this.patchFieldParameters(this.form.get('loanRequestTypeOptions'), { options: updatedoanRequestTypeOptions });
        }
        this.form.get('loanRequestTypeOptions').updateValueAndValidity();
      }
    }
    return true;
  }

  toggleCreateFormButtons(val, colTypeVal) {
    val.forEach( (element) => {
      if (colTypeVal !== element.value) {
        element[FccGlobalConstant.DISABLED] = true;
      } else {
        element[FccGlobalConstant.DISABLED] = false;
      }
    });
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
      sectionForm = this.productStateService.getSectionData('lnGeneralDetails', FccGlobalConstant.PRODUCT_LN);
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
