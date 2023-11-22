import { Injectable } from '@angular/core';
import { ProductValidator } from '../../../common/validator/productValidator';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../common/services/common.service';
import { FCCFormGroup } from '../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { EventEmitterService } from '../../../../common/services/event-emitter-service';
import { ProductStateService } from '../../lc/common/services/product-state.service';

@Injectable({
  providedIn: 'root'
})
export class TfProductService implements ProductValidator{
  tnxTypeCode: any;

  constructor(protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService,
              protected commonService: CommonService,
              protected translateService: TranslateService) { }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeSaveValidation(form?: any): boolean {
      let sectionForm: FCCFormGroup;
      this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
      if (this.tnxTypeCode !== FccGlobalConstant.N002_INQUIRE) {
      sectionForm = this.productStateService.getSectionData('tfGeneralDetails', FccGlobalConstant.PRODUCT_TF);
      if (sectionForm.get('collectionTypeOptions')) {
        const colTypeVal = sectionForm.get('collectionTypeOptions').value;
        const val = sectionForm.get('collectionTypeOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
        this.toggleCreateFormButtons(val, colTypeVal);
      }
    }
      return true;
  }

  beforeSubmitValidation(): boolean {
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const isValid = this.validate();
    this.eventEmitterService.subFlag.next(isValid);
    return true;
  }

  validate() {
    let isValid = false;
    let sectionForm: FCCFormGroup;
    if (this.tnxTypeCode !== FccGlobalConstant.N002_INQUIRE) {
      sectionForm = this.productStateService.getSectionData('tfGeneralDetails', FccGlobalConstant.PRODUCT_TF);
      // Do Business Validation
      if (sectionForm) {
        isValid = true;
      }
  } else {
    isValid = true;
  }
    return isValid;
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

  enableCreateFormButtons(val) {
    val.forEach( (element) => {
        element[FccGlobalConstant.DISABLED] = false;
    });
  }



}
