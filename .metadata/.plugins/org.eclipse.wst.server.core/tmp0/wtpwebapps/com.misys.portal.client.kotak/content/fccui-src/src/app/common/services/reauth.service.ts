import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductStateService } from '../../corporate/trade/lc/common/services/product-state.service';

import { CorporateCommonService } from '../../corporate/common/services/common.service';
import { LeftSectionService } from '../../corporate/common/services/leftSection.service';
import { UtilityService } from '../../corporate/trade/lc/initiation/services/utility.service';
import { FccConstants } from '../core/fcc-constants';
import { FccGlobalConfiguration } from '../core/fcc-global-configuration';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { CustomCommasInCurrenciesPipe } from './../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { CommonService } from './common.service';
import { EncryptionService } from './encrypt.service';
import { EventEmitterService } from './event-emitter-service';
import { PaymentBatchService } from './payment.service';
import { FcmErrorHandlingService } from './fcm-error-handling.service';
@Injectable({
  providedIn: 'root'
})
export class ReauthService {
  protected readonly NAME = 'name';
  protected readonly VALUE = 'value';
  protected readonly TRANSACTION_PAYLOAD = 'transactionPayload';
  protected readonly REAUTHENTICATION_MODE = 'reauthenticationMode';
  protected readonly ADDITIONAL_FIELDS = 'additionalFields';
  protected readonly REAUTHENTICATION_TYPE = 'reauthenticationType';
  protected readonly REFERENCE_KEY = 'referenceKey';
  readonly NO_REAUTH = 'NO_REAUTH';
  readonly PASSWORD = 'PASSWORD';
  readonly OTP = 'OTP';
  protected readonly REAUTH_PASSWORD = 'reauth_password';
  protected readonly REAUTH_ADDITIONAL_FIELDS = 'reauth_additional_fields';
  protected readonly MULTI_TRANSACTION_SUBMISSION_PAYLOAD = 'multiTransactionSubmissionPayload';
  protected readonly REAUTH_SECRET = 'reauthSecret';
  protected readonly errorPage = '/errorPage';
  protected readonly REAUTH = 'reauth';
  protected readonly ID = 'id';
  protected readonly EVENT_ID = 'eventId';
  protected readonly PRODUCT_CODE = 'productCode';
  protected readonly SUBPRODUCT_CODE = 'subProductCode';
  protected readonly COMMENTS = 'comments';
  protected readonly REJECT_COMMENTS = 'rejectComments';
  protected readonly TNX_NUMBER = 'tnxNumber';
  protected readonly REQUEST_PAYLOAD = 'requestPayload';
  protected readonly CONFIRMATION = 'confirmation';
  protected readonly USER_LANG_TITLE = 'userLanguageTitle';
  protected readonly GTP_BUSINESS_EXCEPTION = 'GTPBusinessValidationException';
  protected readonly GTP_EXCEPTION = 'GTPException';
  protected readonly TNX_METADATA = 'transactionMeta';
  protected SUBMIT_PATH = '/submit';
  protected isReauthReq = false;
  isReauthDialogBoxOpen = false;
  reauthenticationModeType: string;
  protected referenceKey;
  submitPayload;
  multiSubmitRequestPayload;
  reauthTime: number;
  logout = false;
  reauthComponent;
  click = true;
  isReauthEnabled: boolean;
  category: string;
  productCode: string;

  protected reauthModes: Map<string, string> = new Map(); // Map<reauthenticationType, referenceKey>

  reauthenticated = false;
  formatedAmount;
  errorMsg: string;
  errorMessages: string[] = [];
  paymentRefNo;

  timeOver = new BehaviorSubject(false);
  restartTimer = new BehaviorSubject(false);
  errorNotifier = new BehaviorSubject(false);
  closeDialogBox$ = new BehaviorSubject(false);
  readonly httpStatusCodeArr = [FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST, FccGlobalConstant.STATUS_401,
                              FccGlobalConstant.STATUS_404,FccGlobalConstant.ERROR_CODE_500, FccGlobalConstant.ERROR_CODE_501];

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
              protected encryptionService: EncryptionService,
              protected messageService: MessageService,
              protected paymentService: PaymentBatchService,
              protected translate: TranslateService,
              protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService,
              protected fcmErrorHandling: FcmErrorHandlingService
              ) {
                this.paymentService.paymentRefNoSubscription$.subscribe((data) => {
                  this.paymentRefNo = data;
                });
              }

  reauthenticate(submitPayload, reauthComponentMappingKey) {
    this.commonService.saveAllowed.next(false);
    this.reauthComponent = reauthComponentMappingKey;
    this.submitPayload = submitPayload;
    const option = this.submitPayload ? this.submitPayload.option : "";
    this.isReauthDialogBoxOpen = false;
    if (this.commonService.isSubmitAllowed ||
         this.commonService.isApproveAllowed ||
         this.commonService.isMultiApproveAllowed) {
         if (this.commonService.isSubmitAllowed) {
             this.commonService.isSubmitAllowed.next(false);
         }
         if (this.commonService.isApproveAllowed) {
          this.commonService.isApproveAllowed.next(false);
        }
         if (this.commonService.isMultiApproveAllowed) {
          this.commonService.isMultiApproveAllowed.next(false);
        }
         this.getConfigurationValue('IS_REAUTH_ENABLED').subscribe(enabled => {
         if ((enabled && enabled.toString().toLowerCase() === 'true') && (option !== 'TEMPLATE')) {
          this.handleGetReuthType();
        } else {
          this.handleTransaction();
        }
      });
  }
}

  openReAuthDialog() {
    this.isReauthDialogBoxOpen = true;
    this.errorNotifier.next(false);
    this.commonService.openReauthDialog$.next(true);
  }

  closeDialogBox() {
    this.closeDialogBox$.next(true);
  }

  reStartTimer() {
    this.restartTimer.next(true);
  }

  isReauthRequired(): boolean {
    return this.isReauthReq;
  }

  handleGetReuthType() {
    switch (this.submitPayload.action) {
      case FccGlobalConstant.SUBMIT:
        this.getReAuthTypeSubmitAPI();
        break;
     case FccGlobalConstant.MODEL_SET_REFERENCE:
        this.getReAuthTypeSetRefSetEtityAPI(this.submitPayload.action);
        break;
      case FccGlobalConstant.MODEL_SET_ENTITY:
        this.getReAuthTypeSetRefSetEtityAPI(this.submitPayload.action);
        break;
      case FccGlobalConstant.APPROVE:
        this.getReAuthTypeApproveRejectAPI();
        break;
      case FccGlobalConstant.RETURN:
        this.getReAuthTypeApproveRejectAPI();
        break;
      case FccGlobalConstant.SEVERAL_SUBMIT:
        this.getReAuthTypeMultiTransactionAPI();
        break;
      case FccConstants.SYSTEM_FEATURE_SUBMIT:
        this.getReAuthTypeSubmitAPI();
        break;
        case FccConstants.SUBMIT_SINGLE_ELE_PAYMENT:
          this.submitSingleElectronicPayment();
          break;
        case FccConstants.SUBMIT_BATCH_PAYMENT:
          this.submitBatchPayment();
          break;
        case FccConstants.FCM_SUBMIT_FEATURES:
          this.submitFCMBeneficiaryCreation();
          break;
        case FccConstants.SUBMIT_BULK_PAYMENT:
          this.submitBulkPayment();
          break;
        case FccConstants.UPDATE_SINGLE_ELE_PAYMENT:
          this.updateSingleElectronicPayment();
          break;
        case FccConstants.SUBMIT_BULK_BENE:
          this.submitBulkBene();
          break;

    }
  }

  protected getReAuthTypeSubmitAPI() {
    let reauthTypeObj;
    if (this.submitPayload.action === FccConstants.SYSTEM_FEATURE_SUBMIT) {
      reauthTypeObj = this.buildReauthTypeRequestObj();
    } else {
      reauthTypeObj = this.getReathTypeReqObj();
    }
    this.corporateCommonService.getReauthenticationType(reauthTypeObj)
      .subscribe(
        data => this.mapReauthTypeData(data),
        error => {
          this.commonService.isSubmitAllowed.next(true);
          this.handleError(error);
        });
  }

  protected getReAuthTypeSetRefSetEtityAPI(action) {
    const reauthTypeObj = this.getReathTypeReqObj();
    this.corporateCommonService.getReauthenticationTypeSetRefSetEtity(reauthTypeObj, action)
      .subscribe(
        data => this.mapReauthTypeData(data),
        error => this.handleError(error)
      );
  }

  protected getReAuthTypeApproveRejectAPI() {
    const reauthTypeObj = this.getApproveRejectReauthTypeReqObj();
    this.corporateCommonService.getMultiTransactionReauthenticationType(reauthTypeObj)
      .subscribe(
        data => this.mapReauthTypeData(data),
        error => this.handleError(error)
      );
  }

  protected getReAuthTypeMultiTransactionAPI() {
    const reauthTypeObj = this.getMultiTransactionReathTypeReqObj();
    this.corporateCommonService.getMultiTransactionReauthenticationType(reauthTypeObj)
      .subscribe(
        data => this.mapReauthTypeData(data),
        error => {
          this.commonService.isMultiApproveAllowed.next(true);
          this.commonService.isCommentSectionBtnEnabled.next(true);
          this.handleError(error);
        });
  }

  protected checkReauthPopupConfigForAction() {
    this.isReauthEnabled = true;
    let actionType;
    if (this.submitPayload.action === FccGlobalConstant.SEVERAL_SUBMIT) {
      actionType = this.submitPayload.subAction === FccGlobalConstant.APPROVE ? FccGlobalConstant.SUBMIT : this.submitPayload.subAction;
    } else {
      actionType = this.submitPayload.action === FccGlobalConstant.APPROVE ? FccGlobalConstant.SUBMIT : this.submitPayload.action;
    }
    actionType = actionType ? actionType.toUpperCase() : actionType;
    const configString = 'IS_REAUTH_ENABLED_FOR_'.concat(actionType);
    return this.getConfigurationValue(configString);
  }

  protected generateReauthenticationCode() {
    const reathCodeObj = this.generateReauthCodeObj();
    return this.corporateCommonService.getReauthenticationCode(reathCodeObj);
  }

  generateReauthenticationCodeAPI() {
    const reathCodeObj = this.generateReauthCodeObj();
    this.corporateCommonService.getReauthenticationCode(reathCodeObj)
      .subscribe(
        () => this.reStartTimer(),
        error => this.handleError(error)
      );
  }

  mapReauthTypeData(apiData) {
    if (apiData.items) {
      Object.keys(apiData.items).forEach(key => {
        switch (apiData.items[key][this.REAUTHENTICATION_TYPE]) {
          case this.OTP:
          case this.PASSWORD:
            this.isReauthReq = true;
            this.reauthModes.set(apiData.items[key][this.REAUTHENTICATION_TYPE], apiData.items[key][this.REFERENCE_KEY]);
            // by default setting
            if (key === '0') {
              this.setReuthModeAndReferenceKey(apiData.items[key][this.REAUTHENTICATION_TYPE], apiData.items[key][this.REFERENCE_KEY]);
            }
            break;
          case this.NO_REAUTH:
            this.isReauthReq = false;
            this.setReuthModeAndReferenceKey(this.NO_REAUTH);
            break;
        }
      });
      this.handleReauthByReauthenticationModeType();
    }
  }

  setReuthModeAndReferenceKey(reauthMode?, referenceKey?) {
    this.reauthenticationModeType = reauthMode;
    this.referenceKey = referenceKey;
  }

  handleReauthByReauthenticationModeType() {
    if (this.isReauthReq) {
      if (this.reauthenticationModeType.toUpperCase() === this.OTP) {
        this.generateReauthenticationCode()
          .subscribe(
            () => this.openReAuthDialog(),
            error => {
              this.handleError(error);
              this.commonService.isCommentSectionBtnEnabled.next(true);
              this.commonService.isApproveAllowed.next(true);
            }
          );
      } else if (this.reauthenticationModeType.toUpperCase() === this.PASSWORD) {
        this.checkReauthPopupConfigForAction().subscribe(enabled => {
          if (enabled && enabled.toString().toLowerCase() === 'false') {
            this.handleSubmitTransaction();
          } else {
            this.openReAuthDialog();
          }
        });
      }
    } else {
      this.handleSubmitTransaction();
    }
  }

  handleSubmitTransaction(reauthKey?: any, additionalFields?: { name: string; value: string; }[]) {
    if (reauthKey) {
      this.submitEncryptedUserInput(reauthKey, additionalFields);
    } else {
      this.handleTransaction(reauthKey, additionalFields);
    }
  }

  protected handleTransaction(reauthKey?: any, additionalFields?: { name: string; value: string; }[]) {
    switch (this.submitPayload.action) {
      case FccGlobalConstant.SUBMIT:
        this.buildSubmitObjForSubmit(reauthKey, additionalFields);
        this.submitTransaction();
        break;
      case 'SET-REFERENCE':
        this.buildSubmitObjForSubmit(reauthKey, additionalFields);
        this.submitSetRefernece();
        break;
      case 'SET-ENTITY':
        this.buildSubmitObjForSubmit(reauthKey, additionalFields);
        this.submitSetEntity();
        break;
      case FccGlobalConstant.APPROVE:
        this.buildSubmitObjForApprovalReject(reauthKey, additionalFields);
        this.approveTransaction();
        break;
      case FccGlobalConstant.RETURN:
        this.buildSubmitObjForApprovalReject(reauthKey, additionalFields);
        this.returnTransaction();
        break;
      case FccGlobalConstant.SEVERAL_SUBMIT:
        this.buildSubmitObjForSeveralSubmit(reauthKey, additionalFields);
        this.severalSubmitTransaction(this.submitPayload);
        break;
      case FccConstants.SYSTEM_FEATURE_SUBMIT:
        this.buildSystemFeatureObjForSubmit(reauthKey);
        this.submitSystemFeatureTransaction();
        break;
      case FccConstants.SUBMIT_SINGLE_ELE_PAYMENT:
        this.submitSingleElectronicPayment();
        break;
      case FccConstants.SUBMIT_BATCH_PAYMENT:
        this.submitBatchPayment();
        break;
      case FccConstants.FCM_SUBMIT_FEATURES:
        this.submitFCMBeneficiaryCreation();
        break;
      case FccConstants.SUBMIT_BULK_PAYMENT:
        this.submitBulkPayment();
        break;
      case FccConstants.UPDATE_SINGLE_ELE_PAYMENT:
        this.updateSingleElectronicPayment();
        break;
      case FccConstants.SUBMIT_BULK_BENE:
        this.submitBulkBene();
        break;
    }
  }

  submitBatchPayment() {
    this.removeFormData();
    this.commonService.submitButtonEnable.next(false);
    this.paymentService.submitBatch(this.submitPayload).subscribe((response) => {
      this.closeDialogBox();
      this.commonService.setBatchFormData([]);
      if(response && response.data){
        this.commonService.getPaymentDetails(response.data).subscribe(resp => {
          if (resp) {
            const submitResponse = resp.data;
            this.deleteAutoSavedRecord(FccGlobalConstant.PRODUCT_BT);
            submitResponse[FccConstants.REAUTH_DATA_ACTION] = this.submitPayload.action;
            submitResponse[FccGlobalConstant.OPTION] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION)?
            this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION) : FccGlobalConstant.PAYMENTS;
            submitResponse[FccGlobalConstant.CATEGORY] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY)?
            this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY) : FccGlobalConstant.FCM.toUpperCase();
            submitResponse[FccGlobalConstant.PRODUCTCODE] = FccGlobalConstant.PRODUCT_BT;
            submitResponse.userLangaugeMessage = response.userLangaugeMessage;
            this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(submitResponse) } });
            this.leftSectionService.resetProgressBarMap();
            this.commonService.submitButtonEnable.next(true);
          }
        });
      }
    },
    error => {
      this.commonService.submitButtonEnable.next(true);
      this.handleTransactionSubmitErrors(error);
      this.commonService.setBatchFormData([]);
    });
  }

  handleError(httpError) {
    this.checkUserActive(httpError);
    this.click = true;
    this.setErrorMsg(httpError);
    if (this.reauthenticationModeType !== this.NO_REAUTH && this.isReauthDialogBoxOpen) {
      this.errorMessages.forEach(error => this.errorMsg = error);
      this.errorNotifier.next(true);
    } else {
      this.errorMessages.forEach(error => {
        const tosterObj = {
          life: 5000,
          key: 'tc',
          severity: 'error',
          detail: error
        };
        this.messageService.add(tosterObj);
      });
    }
  }

  handleConcurrencyVersionMismatch(error) {
            const responseObj = {
              error: JSON.stringify(error.error)
            };
            this.router.navigate([this.SUBMIT_PATH], { skipLocationChange: false, state: { response: JSON.stringify(responseObj) } });
       }

  // to be updated after API response is standarized.
  // first check for causes userlanguagetitle, if not available checks for error detail.
  setErrorMsg(httpError) {
    this.errorMessages = [];
    if (httpError.error.causes && !Object.keys(httpError.error.causes)[0]) {
      Object.keys(httpError.error.causes).forEach(cause => {
        this.errorMessages.push(httpError.error.causes[cause][this.USER_LANG_TITLE]);
      });
    } else if (httpError.error.causes && Object.keys(httpError.error.causes)[0] && Object.keys(httpError.error.causes[0]).length){
      this.errorMessages.push(httpError.error.causes[0][this.USER_LANG_TITLE]);
    }
    else if (httpError.error.detail) {
      this.setPropermessage(httpError.error);
    }
  }

  getErrorMsg(): string {
    return this.errorMsg;
  }

  // error messages are not consistent from API. temp hack until api response is standardized
  setPropermessage(errorObj) {
    const error = errorObj.detail;
    if (errorObj.userLanguageTitle && errorObj.titleKey.indexOf('INVALID_INPUT_PARAMETER') === -1) {
      this.errorMessages.push(errorObj.userLanguageTitle);
    } else if (error.indexOf(this.GTP_BUSINESS_EXCEPTION) > -1) {
      this.errorMessages.push(error.split(this.GTP_BUSINESS_EXCEPTION)[FccGlobalConstant.LENGTH_1].replace(':', ''));
    } else if (error.indexOf(this.GTP_EXCEPTION) > -1) {
      this.errorMessages.push(error.split(this.GTP_EXCEPTION)[FccGlobalConstant.LENGTH_1].replace(':', ''));
    } else if (errorObj.userLanguageTitle) {
      this.errorMessages.push(errorObj.userLanguageTitle);
    } else {
      this.errorMessages.push(errorObj.message);
    }
  }

  checkUserActive(httpError) {
    if (httpError.error.messageKey === 'ERR_UNAUTHORIZED_U03' ||
      httpError.error.titleKey === 'ERR_UNAUTHORIZED_U03' ||
      httpError.error.detail === 'ERR_UNAUTHORIZED_U03'
    ) {
      this.logout = true;
    }
  }

  clearData() {
    this.reauthModes = new Map();
  }

  // Object creation methods
  buildSubmitObjForSubmit(reauthKey?: any, additionalFields?: { name: string; value: string; }[]) {
    if (this.isReauthReq && reauthKey) {
      const reauthPassword = reauthKey;
      this.submitPayload.request.transaction[this.REFERENCE_KEY] = this.referenceKey;
      this.submitPayload.request.transaction[this.REAUTH_PASSWORD] = reauthPassword;
      this.submitPayload.request.transaction[this.REAUTH_ADDITIONAL_FIELDS] = additionalFields;
    }
  }

  buildSystemFeatureObjForSubmit(reauthKey?: any) {
    if (this.isReauthReq && reauthKey) {
      const reauthPassword = reauthKey;
      if (this.referenceKey) {
        this.submitPayload.request[this.REFERENCE_KEY] = this.referenceKey;
      }
      this.submitPayload.request[this.REAUTH_PASSWORD] = reauthPassword;
    }
  }

  buildSubmitObjForApprovalReject(reauthKey?: any, additionalFields?: { name: string; value: string; }[]) {
    const requestObj = {};
    if (this.isReauthReq && reauthKey) {
      const reauthObj = {};
      const reauthPassword = reauthKey;
      reauthObj[this.REAUTH_SECRET] = reauthPassword;
      reauthObj[this.REFERENCE_KEY] = this.referenceKey;
      reauthObj[this.ADDITIONAL_FIELDS] = additionalFields;
      requestObj[this.REAUTH] = reauthObj;
    }
    if (this.submitPayload.action === FccGlobalConstant.RETURN) {
      const comments = {};
      comments[this.REJECT_COMMENTS] = this.submitPayload.rejectComment;
      requestObj[this.COMMENTS] = comments;
    }
    this.submitPayload[this.REQUEST_PAYLOAD] = requestObj;
  }

  buildSubmitObjForSeveralSubmit(reauthKey?: any, additionalFields?: { name: string; value: string; }[]) {
    if (this.isReauthReq && reauthKey) {
      const reauthPassword = reauthKey;
      const reauthObj = {};
      reauthObj[this.REAUTH_SECRET] = reauthPassword;
      reauthObj[this.REFERENCE_KEY] = this.referenceKey;
      reauthObj[this.ADDITIONAL_FIELDS] = additionalFields;
      this.submitPayload.request[this.REAUTH] = reauthObj;
    }
  }

  protected generateReauthCodeObj(): Record<string, unknown> {
    const generateReauthCodeObj = {};
    generateReauthCodeObj[this.REAUTHENTICATION_MODE] = this.reauthenticationModeType;
    generateReauthCodeObj[this.REFERENCE_KEY] = this.referenceKey;
    const additionalFields = [];
    // check for correct impl
    for (const [key, value] of Object.entries(additionalFields)) {
      const obj = {};
      obj[this.NAME] = key;
      obj[this.VALUE] = value;
      additionalFields.push(obj);
    }
    generateReauthCodeObj[this.ADDITIONAL_FIELDS] = additionalFields;
    return generateReauthCodeObj;
  }

  protected getReathTypeReqObj(): Record<string, unknown> {
    const reauthData = this.submitPayload;
    const tnxObj = reauthData.request.transaction;
    const commonObj = reauthData.request.common;
    const requestObj = {};
    const transactionPayload = [];
    this.getKeyValueObj(tnxObj, transactionPayload);
    this.getKeyValueObj(commonObj, transactionPayload);
    requestObj[this.TRANSACTION_PAYLOAD] = transactionPayload;
    return requestObj;
  }


  protected buildReauthTypeRequestObj(): Record<string, unknown> {
      const reauthObj = {};
    if (this.submitPayload.request && this.submitPayload.request.benficiaryDetails) {
      reauthObj[FccGlobalConstant.OPERATION] = this.submitPayload.request.operation;
      reauthObj[FccConstants.BENE_PRODUCT_TYPE] = this.submitPayload.request.productType;
      reauthObj[FccConstants.BENE_PRE_APPROVED] = this.submitPayload.request.benficiaryDetails.preApproved;
      reauthObj[FccGlobalConstant.GROUPID] = this.commonService.beneGroupId;
    }
    const requestObj = {};
    const requestPayload = [];
    this.getKeyValueObj(reauthObj, requestPayload);
    requestObj[this.TRANSACTION_PAYLOAD] = requestPayload;
    return requestObj;
  }

  protected getKeyValueObj(parentObj, array) {
    for (const [key, value] of Object.entries(parentObj)) {
      this.addObjToArray(key, value, array);
    }
  }

  protected addObjToArray(key: string, value, array) {
    const obj = {};
    if (typeof value !== 'object') {
      if (!value) {
        value = '';
      }
      if (key === 'tnxid') {
        obj[this.NAME] = 'tnx_id';
        obj[this.VALUE] = value;
      } else if (key === 'referenceid') {
        obj[this.NAME] = 'ref_id';
        obj[this.VALUE] = value;
      } else {
        obj[this.NAME] = key;
        obj[this.VALUE] = value;
      }
      array.push(obj);
    } else if (key === 'effective_date_hidden_field') {
        obj[this.NAME] = key;
        obj[this.VALUE] = value;
        array.push(obj);
      }
  }

  protected getApproveRejectReauthTypeReqObj(): Record<string, unknown> {
    const requestObj = {};
    const multiTransactionSubmissionPayload = [];
    const obj = {};
    obj[this.ID] = this.submitPayload[this.ID];
    obj[this.EVENT_ID] = this.submitPayload[this.TNX_NUMBER];
    obj[this.PRODUCT_CODE] = this.submitPayload[this.PRODUCT_CODE];
    obj[this.SUBPRODUCT_CODE] = this.submitPayload[this.SUBPRODUCT_CODE];
    multiTransactionSubmissionPayload.push(obj);
    requestObj[this.MULTI_TRANSACTION_SUBMISSION_PAYLOAD] = multiTransactionSubmissionPayload;
    return requestObj;
  }

  protected getMultiTransactionReathTypeReqObj(): Record<string, unknown> {
    const requestObj = {};
    requestObj[this.MULTI_TRANSACTION_SUBMISSION_PAYLOAD] = this.submitPayload.request[this.MULTI_TRANSACTION_SUBMISSION_PAYLOAD];
    return requestObj;
  }

  // get Configuration
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

  // Encryption

  protected submitEncryptedUserInput(reauthKey, additionalFields?: { name: string; value: string; }[]) {
    const configuredKeyClientEncryption = 'ENABLE_CLIENT_SIDE_ENCRYPTION';
    this.getConfigurationValue(configuredKeyClientEncryption).subscribe(config => {
      if (config === 'true') {
        this.encryptionService.generateKeys().subscribe(keyDataResponse => {
          if (keyDataResponse.response === 'success') {
            const keys = keyDataResponse.keys;
            const htmlUsedModulus = keys.htmlUsedModulus;
            const crSeq = keys.cr_seq;
            const encryptedInput = this.encryptionService.encryptText(reauthKey, htmlUsedModulus, crSeq);
            this.handleTransaction(encryptedInput, additionalFields);
          }
        });
      } else {
        this.handleTransaction(reauthKey, additionalFields);
      }
    });
  }

  // protected triggerTransactionWithEncryptedValue(reauthKey: any, clientSideEncryptionEnabled: string) {
  //   if (clientSideEncryptionEnabled === 'true') {
  //     this.encryptionService.generateKeys().subscribe(keyDataResponse => {
  //       if (keyDataResponse.response === 'success') {
  //         const keys = keyDataResponse.keys;
  //         const htmlUsedModulus = keys.htmlUsedModulus;
  //         const crSeq = keys.cr_seq;
  //         const encryptedInput = this.encryptionService.encryptText(reauthKey, htmlUsedModulus, crSeq);
  //         this.handleTransaction(encryptedInput);
  //       }
  //     });
  //   } else {
  //     this.handleTransaction(reauthKey);
  //   }
  // }

  // Submit/ Approve Transactions Calls
  submitTransaction() {
    this.commonService.saveAllowed.next(false);
    this.removeFormData();
    this.corporateCommonService.submitForm(this.submitPayload.request).subscribe(response => {
      this.closeDialogBox();
      if (response) {
        response.reauthDataAction = this.submitPayload.action;
        if (response.product_code === FccGlobalConstant.PRODUCT_SG) {
          response.currency = response.sg_cur_code;
          response.amount = response.sg_amt;
        }
        this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(response) } });
        this.leftSectionService.resetProgressBarMap();
        this.commonService.isSubmitAllowed.next(true);
      }
    },
    error => {
      this.handleTransactionSubmitErrors(error);
    });
  }

  submitSystemFeatureTransaction() {
    this.removeFormData();
    this.commonService.updatePaymentBeneficiaryDetails(this.submitPayload.request,
      this.commonService.beneGroupId).subscribe(response => {
      this.closeDialogBox();
      if (response) {
        response.reauthDataAction = this.submitPayload.action;
        this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(response) } });
        this.leftSectionService.resetProgressBarMap();
      }
    },
    error => {
      this.handleTransactionSubmitErrors(error);
    });
  }

  submitFCMBeneficiaryCreation() {
    this.removeFormData();
    this.commonService.fcmBeneficiaryCreation(this.submitPayload).subscribe(response => {
      this.closeDialogBox();
      if (response && (response.body?.associationId || response.body?.accountDetails?.length)) {
        this.deleteAutoSavedRecord(FccGlobalConstant.PRODUCT_BENE);
        let submitResponse: any;
        if (response.body.associationId) {
          submitResponse = response.body;
        } else if (response.body.accountDetails.length) {
          submitResponse = response.body.accountDetails[0];
          submitResponse.beneficiaryId = this.submitPayload.request.bankAccount[0].beneficiaryId;
          submitResponse.clientId = this.submitPayload.request.bankAccount[0].clientId;
          submitResponse.userLangaugeMessage = response.body.userLangaugeMessage;
        }
        submitResponse[FccConstants.REAUTH_DATA_ACTION] = this.submitPayload.action;
        submitResponse[FccGlobalConstant.OPTION] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
        submitResponse[FccGlobalConstant.CATEGORY] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
        this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(submitResponse) } });
        this.leftSectionService.resetProgressBarMap();
        this.commonService.submitButtonEnable.next(true);
      }
    },
    error => {
      this.commonService.submitButtonEnable.next(true);
      this.handleTransactionSubmitErrors(error);
    });
  }

  handleTransactionSubmitErrors(error) {
    if(!this.commonService.isnonEMptyString(this.category)){
      this.category = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
    }

    this.commonService.isSubmitAllowed.next(true);
    this.commonService.saveAllowed.next(true);
    if (error.error != null && (error.error.titleKey === FccGlobalConstant.TECHNICAL_ERROR
      || error.error.status === FccGlobalConstant.ERROR_CODE_500)) {
      // redirect to submit error page for technical error
      // TODO: handle 401 unauthorized errors
      const response = {
        reauthDataAction : this.submitPayload.action,
        product_code: this.submitPayload.request.transaction.product_code,
        tnx_type_code: this.submitPayload.request.transaction.tnx_type_code,
        sub_product_code: this.submitPayload.request.transaction.sub_product_code,
        sub_tnx_type_code: this.submitPayload.request.transaction.sub_tnx_type_code
      };
      const responseObj = {
        error: JSON.stringify(error.error),
        transactionMeta: JSON.stringify(response)
      };
      this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(responseObj) } });
    }
    else if (error.error != null && error.error.titleKey === FccGlobalConstant.VERSION_MIS_MATCH)
    {
      this.handleConcurrencyVersionMismatch(error);
    }
    else if (this.category === FccConstants.FCM){
      const executionProcessed = this.fcmErrorHandling.handleFcmError(error, this.productCode, this.submitPayload);
      if (!executionProcessed){
        this.handleError(error);
      }
    }
    else {
      this.handleError(error);
    }
  }

  submitSetRefernece() {
    this.removeFormData();
    const refId = this.submitPayload.request.transaction.ref_id;
    const reference = this.submitPayload.request.transaction.customerReference;
    this.commonService.setReference(this.submitPayload.request.transaction, this.submitPayload.request.transaction.ref_id).subscribe(
      () => {
        this.closeDialogBox();
        const tosterObj = {
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary: `${refId}`,
          detail: `${this.translate.instant('setRefToastMsg')}` + `${reference}`
        };
        this.messageService.add(tosterObj);
        this.commonService.setReferenceSuccedded();
      },
      error => this.handleError(error)
      );
  }

  submitSetEntity() {
    this.removeFormData();
    const id = 'id';
    const refId = this.submitPayload.request.transaction.ref_id;
    const entity = this.submitPayload.request.transaction.entityShortName;
    const submitPayload = this.submitPayload.request.transaction;
    submitPayload[id] = this.submitPayload.request.transaction.ref_id;
    this.commonService.setEntity(submitPayload).subscribe(
      () => {
        this.closeDialogBox();
        const tosterObj = {
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary: `${refId}`,
          detail: `${this.translate.instant('setEntityToastMsg')}` + `${entity}`
        };
        this.messageService.add(tosterObj);
        this.commonService.setEntitySuccedded();
      },
      error => this.handleError(error)
      );
  }

  approveTransaction() {
    const reauthData = this.submitPayload;
    this.corporateCommonService.approveImportLetterofCredit(reauthData, this.submitPayload.eTag).subscribe(
      response => {
        this.closeDialogBox();
        this.handleTransactionResponse(response, reauthData);
      },
      error => {
      this.commonService.isApproveAllowed.next(true);
      if (error.error.titleKey === FccGlobalConstant.VERSION_MIS_MATCH)
      {
        this.handleConcurrencyVersionMismatch(error);
      }
      else
      {
        this.handleError(error);
      }
      }
    );

  }

  returnTransaction() {
    const reauthData = this.submitPayload;
    this.corporateCommonService.rejectTransactionProduct(reauthData, this.submitPayload.eTag).subscribe(
      response => {
        this.closeDialogBox();
        this.handleTransactionResponse(response, reauthData);
      },
      error => {
        if (error.error.titleKey === FccGlobalConstant.VERSION_MIS_MATCH)
        {
          this.handleConcurrencyVersionMismatch(error);
        }
        else
        {
          this.handleError(error);
        }
      }
    );

  }

  protected handleTransactionResponse(response: any, reauthData: any) {
    if (response && response.transactionId) {
      const responseData = {
        userLangaugeMessage: response.messageResponse.userLangaugeMessage,
        transactionStatus: response.transactionStatus,
        ref_id: reauthData.id,
        lc_cur_code: reauthData.currency,
        entity: reauthData.entity,
        beneficiary_name: reauthData.beneficiaryName,
        lc_amt: reauthData.amount,
        li_amt: reauthData.amount,
        li_cur_code: reauthData.currency,
        exp_date: reauthData.expiryDate,
        adv_send_mode: reauthData.lcmode,
        adv_send_mode_text: reauthData.lcmodeother,
        tnx_type_code: reauthData.tnxType,
        product_code: reauthData.productCode,
        tnx_id: reauthData.tnxNumber,
        reauthDataAction: reauthData.action,
        tenor_type: reauthData.ecTenorType,
        term_code: reauthData.ecTermCode,
        ec_cur_code: reauthData.currency,
        ec_amt: reauthData.amount,
        drawee_name: reauthData.beneficiaryName,
        applicant_name: reauthData.applicantName,
        sg_cur_code: reauthData.currency,
        sg_amt: reauthData.amount,
        remitter_name: reauthData.remitterName,
        bo_ref_id: reauthData.bankReference,
        ir_cur_code: reauthData.currency,
        ir_amt: reauthData.remittanceAmount,
        remittance_date: reauthData.remittanceDate,
        ir_type_code: reauthData.remittanceType,
        req_amt: reauthData.amount,
        req_cur_code: reauthData.currency,
        ft_amt: reauthData.amount,
        ft_cur_code: reauthData.currency,
        sub_product_code: reauthData.subProductCode,
        ft_type: reauthData.ftType,
        applicant_act_cur_code: reauthData.orderingCurrency,
        applicant_act_no: reauthData.orderingAccount,
        counterparty_act_no: reauthData.transfereeAccount,
        iss_date: reauthData.executionDate,
        assignee_name: reauthData.assigneeName,
        tnx_amt: reauthData.transactionAmount,
        lc_exp_date_type_code: reauthData.expiryType,
        sec_beneficiary_name: reauthData.secondBeneficiaryName,
        sub_tnx_type_code : reauthData.subTnxTypeCode,
        company_name: reauthData.companyName,
        ln_amt: reauthData.amount,
        ln_cur_code: reauthData.currency,
        bk_total_amt: reauthData.amount,
        bk_cur_code: reauthData.currency,
        additionalFields: reauthData.additionalFields,
        td_type: reauthData.depositType,
        credit_act_no: reauthData.creditActNo,
        maturity_instruction: reauthData.maturityInstructions,
        issuingBankApproveName: reauthData.issuingBankName,
        withdrawalAmount: reauthData.withdrawalAmount,
        td_cur_code: reauthData.currency,
        td_amt: reauthData.amount,
        tnx_val_date: reauthData.transferDate,
        recurring_start_date: reauthData.recurringStartDate,
        applicant_act_name: reauthData.transferFrom,
        counterparties: { counterparty: { counterparty_name: reauthData.beneficiaryName, 
          counterparty_act_no: reauthData.beneficiaryAccount } },
        issuing_bank: { abbv_name: reauthData.bank },
        maturity_date: reauthData.maturitydate,
        messageKey: response.messageResponse.messageKey,
        topic: reauthData.topic,
        sub_topic: reauthData.subTopic,
      };
      if (response.approvalStatus === 'rejected') {
        responseData.transactionStatus = 'returned';
      }
      if (response.approvalStatus === 'approved') {
        this.commonService.isApproveAllowed.next(true);
      }
      this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(responseData) } });
    }
  }

  removeFormData() {
    this.leftSectionService.progressBarData.next(0);
  }

  severalSubmitTransaction(reauthData) {
    this.commonService.responseMap.clear();
    this.multiSubmitRequestPayload = reauthData.request;
    switch (reauthData.subAction) {
      case FccGlobalConstant.APPROVE:
        this.severalSubmitApproveTransaction(reauthData);
        break;
      case FccGlobalConstant.RETURN:
        this.severalSubmitRejectTransaction(reauthData);
        break;
    }
  }

  severalSubmitApproveTransaction(reauthData) {
    this.corporateCommonService.severalTransactionApproval(reauthData.request)
      .subscribe(
        response => this.severalSubmitResponse(response),
        error => this.handleError(error)
      );
  }

  severalSubmitRejectTransaction(reauthData) {
    this.corporateCommonService.severalTransactionReject(reauthData.request)
      .subscribe(
        response => this.severalSubmitResponse(response),
        error => this.handleError(error)
      );
  }

  severalSubmitResponse(response) {
    this.closeDialogBox();
    this.click = true;
    if (response) {
      response.body.multiTransactionSubmissionResponse.forEach(item => {
        if (!this.commonService.responseMap.get(item.messageResponse.messageKey)) {
          this.commonService.responseMap.set(item.messageResponse.messageKey, []);
        }
        const responseDetailsArr: {refId: string, eventId: string}[] = this.commonService.responseMap.get(item.messageResponse.messageKey);
        const responseObj: { refId: string, eventId: string } = {
          refId: item.id,
          eventId: item.eventId
        };
        responseDetailsArr.push(responseObj);
        this.commonService.isMultiApproveAllowed.next(true);
      });
    }
    this.commonService.isResponse.next(true);
    this.commonService.isMultiApproveAllowed.next(true);
  }

  submitSingleElectronicPayment() {
    this.removeFormData();
    this.category = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
    this.commonService.submitSinglePayment(this.submitPayload).subscribe(response => {
      this.closeDialogBox();
      if(response && response.body && response.body.data){
        const request = response.body.data;
        this.commonService.getPaymentDetails(request).subscribe(resp => {
          if (resp && resp.data) {
            const submitResponse = resp.data;
            this.deleteAutoSavedRecord(FccConstants.PRODUCT_IN);
            submitResponse[FccConstants.REAUTH_DATA_ACTION] = this.submitPayload.action;
            submitResponse[FccGlobalConstant.OPTION] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
            submitResponse[FccGlobalConstant.CATEGORY] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
            submitResponse[FccGlobalConstant.PRODUCTCODE] = FccConstants.PRODUCT_IN;
            submitResponse.userLangaugeMessage = `${this.translate.instant('singlePaySubmitMsg')}`;
            this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(submitResponse) } });
            this.leftSectionService.resetProgressBarMap();
            this.commonService.submitButtonEnable.next(true);
          }
        });
      }
    },
    error => {
      this.commonService.submitButtonEnable.next(true);
      this.handleTransactionSubmitErrors(error);
    });
  }

  deleteAutoSavedRecord(productCode) {
    if(this.stateService.getAutoSaveConfig()?.isAutoSaveEnabled) {
      const paramKeys = {
        productCode : productCode,
        subProductCode : this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE),
        referenceId : this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID),
        option : this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION),
        tnxType : this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_TYPE_CODE),
        subTnxtype : this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TNX_TYPE)
       };
      this.commonService.deleteAutosave(
        paramKeys
        ).subscribe(resp=>{
          if (resp?.responseDetails?.message) {
            this.stateService.setAutoSaveCreateFlagInState(true);
          }
        });
    }
  }

  submitBulkPayment() {
    this.removeFormData();
    this.category = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
    this.productCode = FccConstants.PRODUCT_PB;
    this.commonService.submitBulkPayment(this.submitPayload.request).subscribe(response => {
      if (response) {
        const submitResponse = response;
        submitResponse[FccConstants.REAUTH_DATA_ACTION] = this.submitPayload.action;
        submitResponse[FccGlobalConstant.OPTION] = FccConstants.OPTION_PAYMENTS;
        submitResponse[FccGlobalConstant.CATEGORY] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
        submitResponse[FccGlobalConstant.PRODUCTCODE] = FccConstants.PRODUCT_PB;
        submitResponse.userLangaugeMessage = response.userLangaugeMessage;
        this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(submitResponse) } });
        this.commonService.submitButtonEnable.next(true);
      }
    },
      error => {
        this.commonService.submitButtonEnable.next(true);
        this.handleTransactionSubmitErrors(error);
      });
  }

  submitBulkBene() {
    this.removeFormData();
    this.category = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
    this.productCode = FccConstants.PRODUCT_BB;
    this.commonService.submitBulkBene(this.submitPayload.request).subscribe(response => {
      if (response) {
        const submitResponse = response;
        submitResponse[FccConstants.REAUTH_DATA_ACTION] = this.submitPayload.action;
        submitResponse[FccGlobalConstant.OPTION] = FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC;
        submitResponse[FccGlobalConstant.CATEGORY] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
        submitResponse[FccGlobalConstant.PRODUCTCODE] = FccConstants.PRODUCT_BB;
        submitResponse.userLangaugeMessage = response.userLangaugeMessage;
        this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(submitResponse) } });
        this.commonService.submitButtonEnable.next(true);
      }
    },
      error => {
        this.commonService.submitButtonEnable.next(true);
        this.handleTransactionSubmitErrors(error);
      });
  }

  updateSingleElectronicPayment() {
    this.removeFormData();
    this.commonService.updateSinglePayment(this.submitPayload).subscribe(response => {
      this.closeDialogBox();
      if(response && response.body && response.body.data){
        const request = response.body.data;
        this.commonService.getPaymentDetails(request).subscribe(resp => {
          if (resp && resp.data) {
            const submitResponse = resp.data;
            submitResponse[FccConstants.REAUTH_DATA_ACTION] = this.submitPayload.action;
            submitResponse[FccGlobalConstant.OPTION] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
            submitResponse[FccGlobalConstant.CATEGORY] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
            submitResponse[FccGlobalConstant.PRODUCTCODE] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
            submitResponse.userLangaugeMessage = `${this.translate.instant('singlePaySubmitMsg')}`;
            this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(submitResponse) } });
            this.leftSectionService.resetProgressBarMap();
          }
        });
      }
    },
    error => {
      this.handleTransactionSubmitErrors(error);
    });
  }

}
