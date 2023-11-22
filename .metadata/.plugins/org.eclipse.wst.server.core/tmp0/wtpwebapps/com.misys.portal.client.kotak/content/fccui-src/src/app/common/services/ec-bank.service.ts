import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FCCBase } from '../../base/model/fcc-base';
import { AmendCommonService } from '../../corporate/common/services/amend-common.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class EcBankService extends FCCBase {

  rendered = 'rendered';

  constructor(public amendCommonService: AmendCommonService, public translateService: TranslateService) {
    super();
  }

  afterViewMethod(option, collectionTypeOptions, event, tnxTypeCode) {
    if (option !== FccGlobalConstant.TEMPLATE) {
      if (event.has('bankDetailsTab') && event.get('bankDetailsTab').has('querySelectorAllValue')) {
        event.get('bankDetailsTab').get('querySelectorAllValue')[0].innerText = '* ' +
      this.translateService.instant('remittingBank');
      }
      if (collectionTypeOptions === '02') {
        if (event.has('bankDetailsTab') && event.get('bankDetailsTab').has('querySelectorAllValue')) {
          event.get('bankDetailsTab').get('querySelectorAllValue')[1].innerText = '* ' +
        this.translateService.instant('presentingBank');
        }
      }
    }
    if (tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }

  amendFormFields() {
    this.amendCommonService.setValueFromMasterToPrevious('ecbankDetails');
  }
}
