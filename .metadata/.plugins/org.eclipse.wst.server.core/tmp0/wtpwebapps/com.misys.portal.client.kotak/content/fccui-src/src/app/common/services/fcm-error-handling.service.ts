import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FccConstants } from '../core/fcc-constants';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class FcmErrorHandlingService {

  readonly httpStatusCodeArr = [FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST, FccGlobalConstant.STATUS_401,
    FccGlobalConstant.STATUS_404,FccGlobalConstant.ERROR_CODE_500, FccGlobalConstant.ERROR_CODE_501];
  executionProcessed = true;

    constructor(protected router: Router,
                protected translate: TranslateService){

    }

  handleFcmError(error, productCode, submitPayload){
    if (this.httpStatusCodeArr.includes(error.status) && productCode === FccConstants.PRODUCT_PB &&
    error.status !== FccGlobalConstant.API_ERROR_CODE_401) {
        const response = {
          reauthDataAction : submitPayload.action,
          product_code: productCode,
          category: FccConstants.FCM,
          userLangaugeMessage: error.error?.userLangaugeMessage
        };
        const responseObj = {
          error: JSON.stringify(error.error),
          transactionMeta: JSON.stringify(response)
        };
        this.executionProcessed = true;
        this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(responseObj) } });
        }
        else if(error.status === FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST && error.error?.causes?.length){
          const response = {
            reauthDataAction : submitPayload.action,
            product_code: submitPayload.request?.productCode? submitPayload.request.productCode : productCode,
            category: FccConstants.FCM,
            userLangaugeMessage: `${this.translate.instant('FCM_ERROR_TECH_0001')}`
          };
          this.executionProcessed = true;
          const responseObj = {
                error: `${this.translate.instant('FCM_ERROR_TECH_0001')}`,
                transactionMeta: JSON.stringify(response),
                status: FccGlobalConstant.API_ERROR_CODE_500
              };
          this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(responseObj) } });
        }
    else if ((error.status === FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST
          || (error.error?.errors && error.error.errors.length !== FccGlobalConstant.ZERO))) {
      // redirect to submit error page for technical error
      // TODO: handle 401 unauthorized errors

      const response = {
        reauthDataAction : submitPayload.action,
        product_code: submitPayload.request?.productCode? submitPayload.request.productCode : productCode,
        category: FccConstants.FCM,
        userLangaugeMessage: error.error?.errors ? error.error.errors[0].description ?
        error.error.errors[0].description : error.error.errors[0].Description :
        `${this.translate.instant('FCM_ERROR_TECH_0001')}`
      };
      this.executionProcessed = true;
      const responseObj = {
            error: JSON.stringify(error.error),
            transactionMeta: JSON.stringify(response),
            status: error.status
          };
      this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(responseObj) } });
    }
    else if (error.status === FccGlobalConstant.API_ERROR_CODE_500 || error.status === FccGlobalConstant.STATUS_404
      || error.status === FccGlobalConstant.API_ERROR_CODE_401 || error.status === FccGlobalConstant.API_ERROR_CODE_501) {
      // redirect to submit error page for Internal Server error
      const response = {
        reauthDataAction : submitPayload.action,
        product_code: submitPayload.request?.productCode? submitPayload.request.productCode
        :productCode,
        category: FccConstants.FCM,
        userLangaugeMessage: `${this.translate.instant('FCM_ERROR_TECH_0001')}`
      };
      this.executionProcessed = true;
      const responseObj = {
            error: `${this.translate.instant('FCM_ERROR_TECH_0001')}`,
            transactionMeta: JSON.stringify(response),
            status: error.status
          };
      this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(responseObj) } });
    }
    else {
      this.executionProcessed = false;
    }
    return this.executionProcessed;
  }

  getFcmProductCode(option){
    if (option === 'BENEFICIARY_MASTER_MAINTENANCE_MC'){
      return FccGlobalConstant.PRODUCT_BM;
    } else if (option === 'PAYMENTS') {
      return FccGlobalConstant.PRODUCT_IN;
    } else {
      return '';
    }
  }
}
