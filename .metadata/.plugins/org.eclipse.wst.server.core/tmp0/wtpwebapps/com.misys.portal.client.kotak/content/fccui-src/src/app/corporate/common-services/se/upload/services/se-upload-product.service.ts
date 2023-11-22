import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../../common/services/common.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { ProductStateService } from '../../../../trade/lc/common/services/product-state.service';
import { ProductValidator } from '../../../../common/validator/productValidator';
import { FilelistService } from '../../../../../corporate/trade/lc/initiation/services/filelist.service';

@Injectable({
  providedIn: 'root'
})
export class SeUploadProductService implements ProductValidator {

  constructor(protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService,
              protected commonService: CommonService,
              protected translateService: TranslateService,
              public uploadFile: FilelistService) { }

  beforeSaveValidation(obj?): boolean {
    if (obj && obj.get(FccGlobalConstant.ATTACHMENTS) && this.uploadFile.fileMap &&
        this.uploadFile.fileMap.length === FccGlobalConstant.ZERO) {
        return false;
    }
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
    const sectionForm = this.productStateService.getSectionData(FccGlobalConstant.SE_UPLOAD_GENERAL_DETAILS, FccGlobalConstant.PRODUCT_SE);
    // Do Business Validation
    if (sectionForm) {
      isValid = true;
    }
    return isValid;
    }

}
