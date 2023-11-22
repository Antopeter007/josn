import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Observable, BehaviorSubject } from 'rxjs';

import { CorporateCommonService } from '../../corporate/common/services/common.service';
import { LeftSectionService } from '../../corporate/common/services/leftSection.service';
import { UtilityService } from '../../corporate/trade/lc/initiation/services/utility.service';
import { FccGlobalConfiguration } from '../core/fcc-global-configuration';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { FccConstants } from '../core/fcc-constants';
import { LendingCommonDataService } from './../../corporate/lending/common/service/lending-common-data-service';
import { CustomCommasInCurrenciesPipe } from './../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { CommonService } from './common.service';
import { EncryptionService } from './encrypt.service';
import { ReauthService } from './reauth.service';
import { AutoForwardService } from '../../corporate/cash/fund transfer/ft/services/auto-forward.service';

@Injectable({
  providedIn: 'root'
})
export class LegalTextService {

  constructor(protected dialogService: DialogService,
              protected translateService: TranslateService,
              protected utilityService: UtilityService,
              protected router: Router,
              protected corporateCommonService: CorporateCommonService,
              protected leftSectionService: LeftSectionService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected http: HttpClient,
              protected fccGlobalConfiguration: FccGlobalConfiguration,
              protected commonService: CommonService,
              protected autoForwardService: AutoForwardService,
              protected encryptionService: EncryptionService,
              protected messageService: MessageService,
              protected lendingCommonDataService: LendingCommonDataService,
              protected reauthService: ReauthService) { }

  public legalTextData: any;
  public requestData: any;

  openLegalTextDiaglog(requestData) {
    this.requestData = requestData;
    this.getConfigurationValue('DISPLAY_LEGAL_TEXT_FOR_LOAN').subscribe(enabled => {
        this.getLegalTextRequest(requestData, enabled);
    });
  }

  getLegalTextRequest(requestData, enabled) {
    const transactionData = requestData.request;
    let tnxId;
    let productCode;
    let facilityType;
    let subproductCode;
    let tnxType;
    let SubtnxType;
    let transactionType;
    const LnProductCode = 'LN';
    const BkProductCode = 'BK';
    const bkSubproductcoe = 'LNRPN';

    if (requestData.action && requestData.action !== undefined && ( requestData.action === FccGlobalConstant.APPROVE
      || requestData.action === FccGlobalConstant.RETURN)){
        tnxId = requestData.tnxNumber;
        productCode = requestData.productCode;
        facilityType = requestData.facilityType;
        subproductCode = requestData.subProductCode;
        tnxType = requestData.tnxType;
        SubtnxType = requestData.subTnxTypeCode;
    } else if (requestData.action === FccConstants.SUBMIT_SINGLE_ELE_PAYMENT ||
        requestData.action === FccConstants.UPDATE_SINGLE_ELE_PAYMENT) {
      productCode = transactionData.productCode;
    }else if (requestData.action === FccConstants.SUBMIT_BULK_PAYMENT) {
      productCode = FccConstants.PRODUCT_PB;
    }else if (requestData.action === FccConstants.SUBMIT_BATCH_PAYMENT) {
      productCode = FccConstants.PRODUCT_BT;
    } else if (requestData.action !== FccConstants.SYSTEM_FEATURE_SUBMIT) {
       tnxId = transactionData?.common?.tnxid;
       productCode = transactionData?.transaction?.product_code;
       facilityType = transactionData?.transaction?.facility_type;
       subproductCode = transactionData?.transaction?.sub_product_code;
       tnxType = transactionData?.common?.tnxtype;
       SubtnxType = transactionData?.transaction?.sub_tnx_type_code;
    }



    if (enabled === 'true' && (productCode === LnProductCode ||
      (productCode === BkProductCode && subproductCode === bkSubproductcoe))) {

      if (tnxType === '01' && SubtnxType === '97' && (productCode === BkProductCode)) {
        transactionType = 'REPRICING';
      } else if (tnxType === '03') {
        transactionType = 'INCREASE';
      } else if (tnxType === '13') {
        transactionType = 'PAYMENT';
      } else if (tnxType === '01' && SubtnxType === FccGlobalConstant.N003_SWINGLINE) {
        transactionType = 'SWINGLINE';
      } else {
        transactionType = 'DRAWDOWN';
      }


      this.lendingCommonDataService.getLegalTextData(tnxId, productCode, facilityType, transactionType).
        subscribe(response => {
        const legalText = 'legalText';
        const isValid = 'isValid';
        this.legalTextData = response.body[legalText];
        const checkValidity = response.body[isValid];
        if (checkValidity) {
          this.legalTextData = this.legalTextData.replaceAll('\n', '<br></br>');
          this.legalTextData = this.legalTextData.replaceAll('\n\n', '<br></br>');
          this.commonService.openLegelTextDialog$.next(true);
        } else {
          this.reauthService.reauthenticate(requestData, FccGlobalConstant.reAuthComponentKey);
        }

      });

    } else{
      // handle autoforward
      if (requestData.action === FccGlobalConstant.SUBMIT && this.commonService.checkCashProduct(
        requestData.request.transaction.product_code, requestData.request.transaction.sub_product_code)) {
        this.autoForwardService.handleAutoForward(requestData, false);
      } else if (this.commonService.isnonEMptyString(requestData.action) && requestData.action === FccGlobalConstant.APPROVE &&
        this.commonService.checkCashProduct(requestData.productCode, requestData.subProductCode)) {
          this.autoForwardService.handleAutoForward(requestData, true);
      } else {
        this.reauthService.reauthenticate(requestData, FccGlobalConstant.reAuthComponentKey);
      }
    }
  }

  getConfigurationValue(configKey): Observable<any> {
    let keyNotFoundList = [];
    return new Observable(subscriber => {
      keyNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(configKey);
      if (keyNotFoundList.length !== 0) {
        this.commonService.getConfiguredValues(keyNotFoundList.toString()).subscribe(
          response => {
            if (response) {
              this.fccGlobalConfiguration.addConfigurationValues(response, keyNotFoundList);
              subscriber.next(response[configKey]);
            }
          }, () => {
            if (FccGlobalConfiguration.configurationValues.get(configKey) !== '' ||
              FccGlobalConfiguration.configurationValues.get(configKey) !== null) {
              subscriber.next(FccGlobalConfiguration.configurationValues.get(configKey));
            }
          });
      } else if (FccGlobalConfiguration.configurationValues.get(configKey) !== '' ||
        FccGlobalConfiguration.configurationValues.get(configKey) !== null) {
        subscriber.next(FccGlobalConfiguration.configurationValues.get(configKey));
      }
    });
  }

}
