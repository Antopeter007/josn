import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../../common/services/common.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { ProductStateService } from '../../../../trade/lc/common/services/product-state.service';
import { ProductValidator } from '../../../../common/validator/productValidator';

@Injectable({
  providedIn: 'root'
})
export class SeProductService implements ProductValidator {

  constructor(protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService,
              protected commonService: CommonService,
              protected translateService: TranslateService) { }

  beforeSaveValidation(): boolean {
    return true;
  }

  beforeSubmitValidation(): boolean {
    const isValid = this.validate();
    this.eventEmitterService.subFlag.next(isValid);
    return true;
  }

  /**
   * performs validations.
   * called from beforeSubmitValidation().
   */
  validate() {
    let isValid = false;
    const sectionForm = this.productStateService.getSectionData('seGeneralDetails', FccGlobalConstant.PRODUCT_SE);
    // Do Business Validation
    if (sectionForm) {
      isValid = true;
    }
    return isValid;
    }

}
