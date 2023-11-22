import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FCCBase } from '../../../../base/model/fcc-base';
import { AmendCommonService } from '../../../common/services/amend-common.service';
import { FccBusinessConstantsService } from '../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class LcBankService extends FCCBase {

  rendered = 'rendered';
  operation: any;
  mode1: any;

  constructor(public amendCommonService: AmendCommonService, public translateService: TranslateService) {
    super();
  }

  afterViewMethod(form, confirmationPartyValue, elementRef, tnxTypeCode, mode1, operation) {
    this.mode1 = mode1;
    this.operation = operation;
    if (confirmationPartyValue === FccBusinessConstantsService.WITHOUT_03) {
      if (elementRef.nativeElement.querySelectorAll(
        ".mat-tab-label.mat-focus-indicator.mat-ripple"
      )[FccGlobalConstant.LENGTH_3]) {
        elementRef.nativeElement.querySelectorAll(
          ".mat-tab-label.mat-focus-indicator.mat-ripple"
        )[FccGlobalConstant.LENGTH_3].style.display = "none";
      }
      this.setMandatoryFields(form.get('confirmationParty'), ['counterPartyList'], false);
      form.get('confirmationParty').get('counterPartyList').clearValidators();
      form.get('confirmationParty').reset();
      form.updateValueAndValidity();
      form.get('confirmationParty')[this.rendered] = false;
    } else {
      if (form.get('confirmationParty')) {
        form.get('confirmationParty')[this.rendered] = true;
      }
    }
    if (tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }

  amendFormFields() {
    if ((this.mode1 !== FccGlobalConstant.VIEW_MODE && this.operation !== FccGlobalConstant.PREVIEW) ||
    (this.mode1 === FccGlobalConstant.VIEW_MODE && this.operation === FccGlobalConstant.LIST_INQUIRY)) {
      this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.BANK_DETAILS);
      }
  }
}
