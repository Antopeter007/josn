import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../common/services/common.service';
import { EventEmitterService } from '../../../../common/services/event-emitter-service';
import { ProductValidator } from '../../../common/validator/productValidator';
import { ProductStateService } from '../../lc/common/services/product-state.service';

@Injectable({
  providedIn: 'root'
})
export class IrProductService implements ProductValidator{

  constructor(protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService,
              protected commonService: CommonService,
              protected translateService: TranslateService) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeSaveValidation(form?: any): boolean {
    return true;
  }
  beforeSubmitValidation(): boolean {
    const isValid = this.validate();
    this.eventEmitterService.subFlag.next(isValid);
    return true;
  }
  validate() {
    let isValid = false;
    const sectionForm = this.productStateService.getSectionData('irGeneralDetails', FccGlobalConstant.PRODUCT_IR);
    // Do Business Validation
    if (sectionForm) {
      isValid = true;
    }
    return isValid;
  }

}
