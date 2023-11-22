import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FCCBase } from '../../../../base/model/fcc-base';
import { AmendCommonService } from '../../../common/services/amend-common.service';
import { FccBusinessConstantsService } from '../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class SiBankService extends FCCBase {

  rendered = 'rendered';
 constructor(public amendCommonService: AmendCommonService, public translateService: TranslateService) {
    super();
  }

  afterViewMethod(form, confirmationPartyValue, elementRef, tnxTypeCode) {
    if (confirmationPartyValue === FccBusinessConstantsService.WITHOUT_03) {
      if (elementRef.nativeElement.querySelectorAll('.mat-tab-label.mat-focus-indicator.mat-ripple')) {
        elementRef.nativeElement.querySelectorAll(
          ".mat-tab-label.mat-focus-indicator.mat-ripple"
        )[FccGlobalConstant.LENGTH_3].style.display = "none";
      }
      this.setMandatoryFields(form.get('siConfirmationParty'), ['counterPartyList'], false);
      form.get('siConfirmationParty').get('counterPartyList').clearValidators();
      form.get('siConfirmationParty').reset();
      form.updateValueAndValidity();
      form.get('siConfirmationParty')[this.rendered] = false;
    } else {
      if (form.get('siConfirmationParty')) {
        form.get('siConfirmationParty')[this.rendered] = true;
      }
    }
    if (tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }

  amendFormFields() {
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.SI_BANK_DETAILS);
  }
}
