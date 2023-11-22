import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FCCFormGroup } from '../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../common/services/common.service';
import { EventEmitterService } from '../../../../common/services/event-emitter-service';
import { ProductValidator } from '../../../common/validator/productValidator';
import { ProductStateService } from '../common/services/product-state.service';
import { FilelistService } from '../initiation/services/filelist.service';

@Injectable({
  providedIn: 'root'
})
export class LcProductService implements ProductValidator {
  constructor(protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService,
              protected commonService: CommonService,
              protected translateService: TranslateService,
              public uploadFile: FilelistService) { }

  beforeSaveValidation(obj?): boolean {
    // eslint-disable-next-line no-console
    console.log('beforeSaveValidation invoked');
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    // For free format check
    if (tnxTypeCode === FccGlobalConstant.N002_NEW && productCode === FccGlobalConstant.PRODUCT_EL &&
    this.productStateService.getSectionData(FccGlobalConstant.EL_MT700_UPLOAD)){
      return true;
    } else if (tnxTypeCode === FccGlobalConstant.N002_NEW && this.productStateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS)) {
    const requestType = this.productStateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).
    get(FccGlobalConstant.REQUEST_OPTION_LC).value;
    if (requestType === FccGlobalConstant.CODE_02) {
       if (obj.get(FccGlobalConstant.ATTACHMENTS) && this.uploadFile.fileMap &&
        this.uploadFile.fileMap.length === FccGlobalConstant.ZERO) {
          return false;
      }
    }
   }
    return true;
  }

  beforeSubmitValidation(): boolean {
    const isValid = this.validate();
    this.eventEmitterService.subFlag.next(isValid);
    // eslint-disable-next-line no-console
    console.log('beforeSubmitValidation invoked');
    return true;
  }

  validate() {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    let isValid = false;
    let sectionForm: FCCFormGroup;
    if (tnxTypeCode !== FccGlobalConstant.N002_INQUIRE) {
      sectionForm = this.productStateService.getSectionData('generalDetails', FccGlobalConstant.PRODUCT_LC);
    } else {
      sectionForm = this.productStateService.getSectionData('lcgeneralDetails', FccGlobalConstant.PRODUCT_LC);
    }
    // Do Business Validation
    if (sectionForm) {
      isValid = true;
    }
    return isValid;
  }

}
