import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../common/services/common.service';
import { FCCFormGroup } from '../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { EventEmitterService } from '../../../../common/services/event-emitter-service';
import { ProductStateService } from '../../lc/common/services/product-state.service';
import { ProductValidator } from '../../../common/validator/productValidator';

@Injectable({
  providedIn: 'root'
})
export class LiProductService implements ProductValidator {
  sectionForm: FCCFormGroup;
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

  validate() {
    let isValid = false;
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (tnxTypeCode !== FccGlobalConstant.N002_INQUIRE) {
      this.sectionForm = this.productStateService.getSectionData('liGeneralDetails', FccGlobalConstant.PRODUCT_LI);
    } else {
      this.sectionForm = this.productStateService.getSectionData('liMessageToBankGeneralDetails', FccGlobalConstant.PRODUCT_LI);
    }
    // Do Business Validation
    if (this.sectionForm) {
      isValid = true;
    }
    return isValid;
  }
}
