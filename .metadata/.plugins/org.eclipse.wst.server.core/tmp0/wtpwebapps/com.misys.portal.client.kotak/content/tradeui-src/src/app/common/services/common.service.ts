import { Constants } from './../constants';
import { ValidationService } from './../validators/validation.service';
import { AbstractControl, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ResponseService } from '../../common/services/response.service';
import { validateForNullTnxAmtCurrencyField, validateZeroPercentage,
  validateAmountField, validateVariationPercent, validateVariationAmount,
  validateFirstDateWithApplicationExpiryDate, validateVariationFrequency, validateMaxFirstDate,
  validateSettlementDateWithApplicationCurrentDate } from './../validators/common-validator';
import { IrregularDetails } from '../model/IrregularDetails.model';
import { URLConstants } from '../urlConstants';
import { DatePipe, formatDate, DecimalPipe } from '@angular/common';
import { Task } from '../model/task.model';
import { Session } from '../model/session.model';
import * as uuid from 'uuid';
import { TaskRequest } from '../model/taskRequest.model';


@Injectable({ providedIn: 'root' })
export class CommonService {

  private loginUserName: string;
  private companyName: string;
  private numberOfEntities: number;
  private allowedExtensionsForUpload: string[];
  private maxUploadSize: string;
  private fileuploadMaxLimit: string;
  private pdfLogo: string;
  private isEditableSettlementAmt: boolean;
  private reauthEnabled: boolean;
  private showLicence: boolean;
  private showFacilitySectionForTrade: boolean;
  private facilitySelectionValidation: boolean;
  private validateTnxAmtWithLimitAmt: boolean;
  private clientSideEncryptionEnabled: boolean;
  private enableUIUX: boolean;
  private yearRange: string;
  private swiftBicCodeRegexValue: string;
  private showEventReference: boolean;
  private showLiabilityAmount: boolean;
  private bgRenewalType: string;
  private cuRenewalType: string;
  private rollingRenewalNb: number;
  private cuRollingRenewalNb: number;
  private renewForPeriod: string;
  private cuRenewForPeriod: string;
  private rollingRenewForPeriod: string;
  private cuRollingRenewForPeriod: string;
  private renewForNb: number;
  private cuRenewForNb: number;
  private rollingRenewForNb: number;
  private cuRollingRenewForNb: number;
  private renewonCode: string;
  private cuRenewonCode: string;
  private renewalCalendarDate: Date;
  private cuRenewalCalendarDate: Date;
  private expiryDate: Date;
  private cuExpiryDate: Date;
  private customerReferenceIdLength: string;
  publicTasks: Task[] = [];
  privateTasks: Task[] = [];
  isAttachmentDataResolved: Promise<boolean>;
  finalExpiryDate: string;
  cuFinalExpiryDate: string;
  tnxType: string;
  maxDate: any;
  cuMaxDate: any;
  issuerRefPresent = false;
  currencyDecimalMap = new Map<string, number>();
  headers = new HttpHeaders({'Content-Type': 'application/json'});
  orgAmt: string;
  orgCurCode: string;
  private minFirstDate: Date;
  private applicationDate: Date;
  private currentDatetype: Date;
  expiryDateType: string;
  cuExpiryDateType: string;
  private undertakingAmt: any;
  private cuUndertakingAmt: any;
  userLanguage: string;
  dateFormat: string;
  sessionData: Session;
  mainBankAbbvName: string;
  mainBankName: string;
  issuerRef: string;
  tnxToDoListId: string;
  boInpDttm: string;
  private readonly LOCATION = 'location';
  private readonly ORIGIN = 'origin';
  servletName = window[Constants.SERVLET_NAME];
  private nameTradeLength: string;
  private address1TradeLength: string;
  private address2TradeLength: string;
  private domTradeLength: string;
  private address4TradeLength: string;
  private shipmentPeriodStandard: string;
  public swiftVersion: number;
  public swiftZChar: string;
  public courierTrackingFeatureEnabled : boolean = false;
  public availableAmountEnabled : boolean = false;

   constructor(public http: HttpClient, public translate: TranslateService,
               public validationService: ValidationService, public decimalPipe: DecimalPipe,
               public responseService: ResponseService, public datePipe: DatePipe) { }

   public setCurrencyDecimalMap(currencyMap: Map<string, number>) {
    this.currencyDecimalMap = currencyMap;
  }

  public getCurrencyDecimalMap(): Map <string, number> {
     return this.currencyDecimalMap;
  }

   getContextPath() {
    return window[Constants.CONTEXT_PATH];

   }

   getBaseServletUrl() {
    return `${this.getContextPath()}${this.servletName}`;
   }

   getImagePath() {
    const originURL = window[this.LOCATION][this.ORIGIN] + this.getContextPath();
    return `${originURL}/content/images/`;
   }

  public setShowLicence(showLicence) {
    this.showLicence = showLicence;
  }

  public isShowLicence() {
    return this.showLicence;
  }

  public getLoginUserName(): string {
    return this.loginUserName;
  }

  public setLoginUserName(loginUserName) {
    this.loginUserName = loginUserName;
  }

  public getCompanyName(): string {
    return this.companyName;
  }

  public setCompanyName(companyName) {
    this.companyName = companyName;
  }

  public getIssuerRef(): string {
    return this.issuerRef;
  }

  public setIssuerRef(issuerRef) {
    this.issuerRef = issuerRef;
  }

  public getNumberOfEntities(): number {
    return this.numberOfEntities;
  }

  public setNumberOfEntities(numberOfEntities) {
    this.numberOfEntities = numberOfEntities;
  }

  public getAllowedExtensionsForUpload() {
    return this.allowedExtensionsForUpload;
  }

  public setAllowedExtensionsForUpload(allowedExtensionsForUpload) {
    this.allowedExtensionsForUpload = [];
    this.allowedExtensionsForUpload = allowedExtensionsForUpload;
  }

  public getMaxUploadSize() {
    return this.maxUploadSize;
  }

  public setMaxUploadSize(size) {
    this.maxUploadSize = size;
  }

  public getFileuploadMaxLimit(): number {
    return parseInt(this.fileuploadMaxLimit, 10);
  }

  public setFileuploadMaxLimit(limit) {
    this.fileuploadMaxLimit = limit;
  }

  public getPdfLogo() {
    return this.pdfLogo;
  }

  public setPdfLogo(path) {
    this.pdfLogo = path;
  }

  public setAttachmentDataResolver() {
    this.isAttachmentDataResolved = Promise.resolve(true);
  }

  public getAttachmentDataResolver(): Promise<boolean> {
    return this.isAttachmentDataResolved;
  }
  public isSettlementAmtEditable() {
    return this.isEditableSettlementAmt;
  }

  public settlementAmtFlag(flag) {
    this.isEditableSettlementAmt = flag;
  }

  public isShowEventReferenceEnabled() {
    return this.showEventReference;
  }

  public setShowEventReference(flag) {
    this.showEventReference = flag;
  }

  public getReauthEnabled(): boolean {
    return this.reauthEnabled;
  }

  public setReauthEnabled(value) {
    this.reauthEnabled = value;
  }

  public getClientSideEncryptionEnabled(): boolean {
    return this.clientSideEncryptionEnabled;
  }

  public setClientSideEncryptionEnabled(value) {
    this.clientSideEncryptionEnabled = value;
  }

  public setEnableUIUX(value) {
    this.enableUIUX = value;
  }

  public getEnableUIUX() {
    return this.enableUIUX;
  }

  public getYearRange(): string {
    return this.yearRange;
  }

  public setYearRange(value) {
    this.yearRange = value;
  }

  public getSwiftBicCodeRegexValue(): string {
    return this.swiftBicCodeRegexValue;
  }

  public setSwiftBicCodeRegexValue(value) {
    this.swiftBicCodeRegexValue = value;
  }

  public getTnxType(): string {
    return this.tnxType;
  }

  public setTnxType(tnxType) {
    this.tnxType = tnxType;
  }

  public getOrgCurCode() {
    return this.orgCurCode;
  }

  public setOrgCurCode(orgCurCode) {
    this.orgCurCode = orgCurCode;
  }

  public getMinFirstDate() {
    return this.minFirstDate;
  }
  public getMinSettlementDate() {
    return this.applicationDate;
  }
  public getcurrentdate() {
    return this.currentDatetype;
  }
  public setcurrentdate(currentDatetype) {
    this.currentDatetype = currentDatetype;
  }

  public setMinSettlementDate(applicationDate) {
    this.applicationDate = applicationDate;
  }
  public setMinFirstDate(minFirstDate) {
    this.minFirstDate = minFirstDate;
  }

  public getUndertakingAmt() {
    return this.undertakingAmt;
  }

  public setUndertakingAmt(undertakingAmt) {
    this.undertakingAmt = undertakingAmt;
  }

  public getCuUndertakingAmt() {
    return this.cuUndertakingAmt;
  }

  public setCuUndertakingAmt(cuUndertakingAmt) {
    this.cuUndertakingAmt = cuUndertakingAmt;
  }

  public getUserLanguage(): string {
    return this.userLanguage;
  }

  public setUserLanguage(userLanguage) {
    this.userLanguage = userLanguage;
  }

  public getDateFormat(): string {
    return this.dateFormat;
  }

  public setDateFormat(dateFormat) {
    this.dateFormat = dateFormat;
  }

  public getCustRefIdLength(): number {
    return parseInt(this.customerReferenceIdLength, 10);
  }

  public setCustRefIdLength(length) {
    this.customerReferenceIdLength = length;
  }

  public getNameTradeLength(): number {
    return parseInt(this.nameTradeLength, 10);
  }

  public setNameTradeLength(length) {
    this.nameTradeLength = length;
  }

  public getAddress1TradeLength(): number {
    return parseInt(this.address1TradeLength, 10);
  }

  public setAddress1TradeLength(length) {
    this.address1TradeLength = length;
  }

  public getAddress2TradeLength(): number {
    return parseInt(this.address2TradeLength, 10);
  }

  public setAddress2TradeLength(length) {
    this.address2TradeLength = length;
  }

  public getDomTradeLength(): number {
    return parseInt(this.domTradeLength, 10);
  }

  public setDomTradeLength(length) {
    this.domTradeLength = length;
  }

  public getAddress4TradeLength(): number {
    return parseInt(this.address4TradeLength, 10);
  }

  public setAddress4TradeLength(length) {
    this.address4TradeLength = length;
  }

  public getShipmentPeriodStandard(): string {
    return this.shipmentPeriodStandard;
  }

  public setShipmentPeriodStandard(value) {
    this.shipmentPeriodStandard = value;
  }

  public isShowLiabilityAmountEnabled() {
    return this.showLiabilityAmount;
  }

  public setShowLiabilityAmount(flag) {
    this.showLiabilityAmount = flag;
  }

  public isShowFacilitySectionForTradeEnabled() {
    return this.showFacilitySectionForTrade;
  }

  public setShowFacilitySectionForTrade(flag) {
    this.showFacilitySectionForTrade = flag;
  }

  public isfacilitySelectionValidation() {
    return this.facilitySelectionValidation;
  }

  public setfacilitySelectionValidation(flag) {
    this.facilitySelectionValidation = flag;
  }

  public isValidateTnxAmtWithLimitAmt() {
    return this.validateTnxAmtWithLimitAmt;
  }

  public setValidateTnxAmtWithLimitAmt(flag) {
    this.validateTnxAmtWithLimitAmt = flag;
  }

  async getBase64ImageFromUrl(imageUrl) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  public loadDefaultConfiguration(): Observable<any> {
    const completePath = this.getContextPath() + URLConstants.PORTAL_CONFIGURATION;
    const requestPayload = {};
    return this.http.post<any>(completePath, requestPayload, {headers : this.headers});
  }

  public getChartData(refId: string, productCode: string): Observable<any> {
    const completePath = `${this.getContextPath()}${URLConstants.CHART_DATA}${refId}/${productCode}`;
    return this.http.get(completePath, { responseType: 'json', observe: 'response' });
  }

  public getPendingTransactionsList(refId: string, productCode: string): Observable<any> {
    const requestPayload = {pendingTransactionRequestData: {refId, productCode }};
    const completePath = this.getContextPath() + URLConstants.INQUIRY_PENDING_TRANSACTIONS;
    return this.http.post<any>(completePath, requestPayload, {headers : this.headers});
  }

  public getCompletedTransactionsList(refId: string, productCode: string, subProductCode: string) {
    const requestPayload = {transactionHistoryRequestData: {refId, productCode, subProductCode }};
    const completePath = this.getContextPath() + URLConstants.HISTORY_LIST;
    return this.http.post<any>(completePath, requestPayload, {headers : this.headers} );
  }

  public getChargeDetails(refId: string, tnxId: string, productCode: string, masterOrTnx: string) {
    const requestPayload = {refId, tnxId, productCode, masterOrTnx};
    const completePath = this.getContextPath() + URLConstants.CHARGE_DETAILS;
    return this.http.post<any>(completePath, requestPayload, {headers : this.headers} );
  }

  public getFileAttachments(refId: string, productCode: string) {
    const requestPayload = {refId, productCode};
    const completePath = this.getContextPath() + URLConstants.FILE_ATTACHMENTS;
    return this.http.post<any>(completePath, requestPayload, {headers : this.headers} );
  }

  public deleteFileAttachments(attachmentId: string) {
    const completePath = `${this.getContextPath()}${URLConstants.DOCUMENT}${attachmentId}`;
    return this.http.delete<any>(completePath);
  }

  public getMasterDetails(refId: string, productCode: string, actionCode: string): Observable<any> {
    const requestPayload = {requestData: {refId, productCode, actionCode}};
    const completePath = this.getContextPath() + URLConstants.MASTER_DETAILS;
    return this.http.post<any>(completePath, requestPayload, {headers : this.headers});
  }

  public getTnxDetails(refId: string, tnxId: string, productCode: string, actionCode: string): Observable<any> {
    const requestPayload = {requestData: {refId, tnxId,
      productCode, actionCode}};
    const completePath = this.getContextPath() + URLConstants.TNX_DETAILS;
    return this.http.post<any>(completePath, requestPayload, {headers : this.headers});
  }

  public getCurrencyDecimals(): Observable<any> {
    const completePath = this.getContextPath() + URLConstants.CURRENCY_DECIMALS;
    return this.http.get<any>(completePath, {headers : this.headers} );
  }

  public getCurrencyRate(fromCurrency: string, toCurrency: string, fromCurrencyAmount: string): Observable<any> {
    const requestPayload = {fromCurrency, toCurrency,
      fromCurrencyAmount};
    const completePath = this.getContextPath() + URLConstants.CURRENCY_RATE;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }

  public getBankDetails(): Observable<any> {
    const completePath = this.getContextPath() + URLConstants.BANK_DETAILS;
    return this.http.get<any>(completePath, {headers : this.headers} );
  }

  public fetchBankDetails(bankAbbvName: string): Observable<any> {
    const requestPayload = { bankAbbvName };
    const completePath = this.getContextPath() + URLConstants.GET_BANK_DETAILS;
    return this.http.post<any>(completePath, requestPayload, {headers : this.headers} );
  }

  getTranslation(key: string) {
    let value = '';
    if (key !== '' && key !== null) {
      this.translate.get(key).subscribe((res: string) => {
        value = res;
      });
    }
    return value;
  }

  transformAmtAndSetValidators(amtControl: AbstractControl, currencyControl: AbstractControl, currencyControlName: string) {
    const decimalNumberOfCurrency = (currencyControl.value !== '' && currencyControl.value !== undefined) ?
      this.currencyDecimalMap.get(currencyControl.value) : 0;
    this.transformNumber(amtControl, currencyControl);
    this.validationService.setAmtCurValidator(amtControl, currencyControl, currencyControlName,
      decimalNumberOfCurrency);
  }

  transformAmt(amt, currency: string): string {
    let userLanguage = this.getUserLanguage();
    let decimalNumberOfCurrency = (currency !== '') ? this.currencyDecimalMap.get(currency) : 0;
    if (amt !== '' && amt !== undefined && amt !== null) {
      decimalNumberOfCurrency = decimalNumberOfCurrency === undefined ? Constants.LENGTH_2 : decimalNumberOfCurrency;
      amt = this.getNumberWithoutLanguageFormatting(amt);
      if (userLanguage === Constants.LANGUAGE_US) {
        userLanguage = Constants.LANGUAGE_EN;
      }
      if (!isNaN(Number(amt))) {
        let amount: any = this.decimalPipe.transform(Number(amt),
                                                `1.${decimalNumberOfCurrency}-${decimalNumberOfCurrency}`, userLanguage);
        amount = this.formatAmountByLanguage(amount);
        return amount;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  transformNumber(fieldControl: AbstractControl, currencyControl?: AbstractControl) {
    if (fieldControl != null && fieldControl.value != null && fieldControl.value !== '') {
      let userLanguage = this.getUserLanguage();
      let value = this.getNumberWithoutLanguageFormatting(fieldControl.value);
      if (isNaN(Number(value.replace(Constants.DOT, '')))) {
        fieldControl.setValue('');
      } else {
        let index = value.indexOf(Constants.DOT);
        index = value.indexOf(Constants.DOT, index + 1);
        if (index > -1) {
          value = value.substring(0, index);
        }
        if (value === Constants.DOT) {
          value = '';
        }
        if (currencyControl) {
          const decimalNumberOfCurrency = (currencyControl.value !== '' && currencyControl.value !== undefined) ?
            this.currencyDecimalMap.get(currencyControl.value) : 0;
          if (userLanguage === Constants.LANGUAGE_US) {
            userLanguage = Constants.LANGUAGE_EN;
          }
          value = this.decimalPipe.transform(Number(value),
            `1.${decimalNumberOfCurrency}-${decimalNumberOfCurrency}`, userLanguage);
          value = this.formatAmountByLanguage(value);
        }
        fieldControl.setValue(value);
      }
    }
  }

  setResponseData(data: any) {
    this.responseService.setResponseMessage(data.message);
    this.responseService.setRefId(data.refId);
    this.responseService.setTnxId(data.tnxId);
    this.responseService.setTnxType(data.tnxTypeCode);
    this.responseService.setOption(data.option);
   }


  disableCurrencyAmtField(form: UntypedFormGroup, undertakingType: string, irregularDetailsForm: UntypedFormGroup) {
    if (irregularDetailsForm !== null) {
      form = irregularDetailsForm;
    }
    form.get(`${undertakingType}VariationAmt`).disable();
    form.get(`${undertakingType}VariationCurCode`).disable();
  }

  disablePercentageField(form: UntypedFormGroup, undertakingType: string, irregularDetailsForm: UntypedFormGroup) {
    if (irregularDetailsForm !== null) {
      form = irregularDetailsForm;
    }
    if (form.get(`${undertakingType}VariationAmt`).value !== '') {
      form.get(`${undertakingType}VariationPct`).disable();
    } else {
      form.get(`${undertakingType}VariationPct`).enable();
    }
  }


  validateForNullTnxAmtCurrencyField(control: AbstractControl, form: UntypedFormGroup, 
    undertakingType: string, irregularDetailsForm: UntypedFormGroup) {
    let tnxCurCode;
    let tnxAmt;
    if (undertakingType === 'bg') {
        if ( this.getTnxType() === '03') {
          tnxCurCode = this.getOrgCurCode();
          tnxAmt = this.getUndertakingAmt();
        } else {
          tnxCurCode = form.parent.get(Constants.SECTION_AMOUNT_DETAILS).get(`${undertakingType}CurCode`).value;
          tnxAmt = form.parent.get(Constants.SECTION_AMOUNT_DETAILS).get(`${undertakingType}Amt`).value;
        }
      } else {
        tnxCurCode = form.parent.get(Constants.SECTION_CU_AMOUNT_DETAILS).get(`${undertakingType}CurCode`).value;
        tnxAmt = form.parent.get(Constants.SECTION_CU_AMOUNT_DETAILS).get(`${undertakingType}Amt`).value;
      }

    tnxAmt = this.getNumberWithoutLanguageFormatting(tnxAmt);
    if (irregularDetailsForm !== null) {
      form = irregularDetailsForm;
    }
    const variationPerc = form.get(`${undertakingType}VariationPct`) ? form.get(`${undertakingType}VariationPct`).value : '';
    if (variationPerc === '0') {
      form.get(`${undertakingType}VariationPct`).setValidators([validateZeroPercentage(variationPerc), Validators.required,
         Validators.maxLength(Constants.LENGTH_12), Validators.pattern(Constants.REGEX_PERCENTAGE)]);
      form.get(`${undertakingType}VariationPct`).updateValueAndValidity();
    }
    const variationAmtControl = form.get(`${undertakingType}VariationAmt`);
    if (variationPerc !== '' && variationPerc != null) {
      control = form.get(`${undertakingType}VariationPct`);
    } else if ( (variationPerc === '' || variationPerc == null) &&  variationAmtControl != null &&
    variationAmtControl.value != null && variationAmtControl.value !== '') {
      control = variationAmtControl;
    }
    if (control != null && this.getTnxType() !== '03' && (tnxCurCode === '' || tnxAmt === '')) {
      control.setValidators([validateForNullTnxAmtCurrencyField(tnxCurCode, tnxAmt), Validators.required]);
      control.updateValueAndValidity();
    } else if (variationPerc !== '0' && form.get(`${undertakingType}VariationPct`) && form.get(`${undertakingType}VariationAmt`)) {
      form.get(`${undertakingType}VariationPct`).setValidators([Validators.required, Validators.maxLength(Constants.LENGTH_12),
        Validators.pattern(Constants.REGEX_PERCENTAGE)]);
      form.get(`${undertakingType}VariationPct`).updateValueAndValidity();
      form.get(`${undertakingType}VariationAmt`).setValidators([Validators.required,
        validateAmountField(form.get(`${undertakingType}VariationCurCode`).value,
        this.currencyDecimalMap.get(form.get(`${undertakingType}VariationCurCode`).value))]);
      form.get(`${undertakingType}VariationAmt`).updateValueAndValidity();

    }
  }

  calculateVariationAmt(form: UntypedFormGroup, undertakingType: string, irregularDetailsForm: UntypedFormGroup) {
    let bgAmt;
    if (undertakingType === 'bg') {
      if (this.getTnxType() === '03') {
        bgAmt = this.getUndertakingAmt();
      } else {
        bgAmt = form.parent.get(Constants.SECTION_AMOUNT_DETAILS).get(`${undertakingType}Amt`).value;
      }
    } else {
      bgAmt = form.parent.get(Constants.SECTION_CU_AMOUNT_DETAILS).get(`${undertakingType}Amt`).value;
    }
    bgAmt = this.getNumberWithoutLanguageFormatting(bgAmt);

    if (irregularDetailsForm !== null) {
      form = irregularDetailsForm;
    }
    const variationpercent = form.get(`${undertakingType}VariationPct`).value;

    if (variationpercent === '') {
      form.get(`${undertakingType}VariationAmt`).setValue('');
      form.get(`${undertakingType}VariationAmt`).enable();
    } else {
    const bgCurCodeControl = form.get(`${undertakingType}VariationCurCode`);
    let variationAmt = (variationpercent / Constants.LENGTH_100 * bgAmt.replaceAll(Constants.COMMA, '')).toString();
    variationAmt = this.transformAmt(variationAmt, bgCurCodeControl.value);
    form.get(`${undertakingType}VariationAmt`).setValue(variationAmt);
    }


    if (form.get(`${undertakingType}OperationType`).value === '02' && variationpercent > Constants.LENGTH_100) {
      form.get(`${undertakingType}VariationPct`).setValidators([validateVariationPercent(variationpercent), Validators.required,
        Validators.maxLength(Constants.LENGTH_12), Validators.pattern(Constants.REGEX_PERCENTAGE)]);
      form.get(`${undertakingType}VariationPct`).updateValueAndValidity();
    }

  }

  calculateVariationPercentage(form: UntypedFormGroup, undertakingType: string, irregularDetailsForm: UntypedFormGroup) {
    let bgAmt;
    if (undertakingType === 'bg') {
      if (this.getTnxType() === '03') {
        bgAmt = this.getUndertakingAmt();
      } else {
        bgAmt = form.parent.get(Constants.SECTION_AMOUNT_DETAILS).get(`${undertakingType}Amt`).value;
      }
    } else {
      bgAmt = form.parent.get(Constants.SECTION_CU_AMOUNT_DETAILS).get(`${undertakingType}Amt`).value;
    }

    if (irregularDetailsForm !== null) {
      form = irregularDetailsForm;
    }

    const variationAmout = this.getNumberWithoutLanguageFormatting(form.get(`${undertakingType}VariationAmt`).value);
    bgAmt = this.getNumberWithoutLanguageFormatting(bgAmt);

    if (variationAmout === '') {
      form.get(`${undertakingType}VariationPct`).setValue('');
      form.get(`${undertakingType}VariationPct`).enable();
    }

    if (bgAmt !== '' && bgAmt != null) {
      let variationPerc = ((Number(variationAmout) * Constants.LENGTH_100) / bgAmt).toString();
      variationPerc = this.decimalPipe.transform(variationPerc, '1.0-2') === '0' ? '' : this.decimalPipe.transform(variationPerc, '1.0-2');
      form.get(`${undertakingType}VariationPct`).setValue(this.getPercentWithoutLanguageFormatting(variationPerc));

      if (form.get(`${undertakingType}OperationType`).value === '02' && variationAmout > bgAmt) {
        form.get(`${undertakingType}VariationAmt`).setValidators([validateVariationAmount(variationAmout, bgAmt)]);
        form.get(`${undertakingType}VariationAmt`).updateValueAndValidity();
    }
    }
  }

  validateVariationPercentage(form: UntypedFormGroup, undertakingType: string, irregularDetailsForm: UntypedFormGroup) {
    if (irregularDetailsForm !== null) {
      form = irregularDetailsForm;
    }
    const varitionPerc = form.get(`${undertakingType}VariationPct`).value;
    if (form.get(`${undertakingType}OperationType`).value === '02' && varitionPerc !== '' && varitionPerc > Constants.LENGTH_100) {
      form.get(`${undertakingType}VariationPct`).setValidators([validateVariationPercent(varitionPerc), Validators.required,
        Validators.maxLength(Constants.LENGTH_12), Validators.pattern(Constants.REGEX_PERCENTAGE)]);
      form.get(`${undertakingType}VariationPct`).updateValueAndValidity();
    } else {
      form.get(`${undertakingType}VariationPct`).clearValidators();
      form.get(`${undertakingType}VariationPct`).setValidators([Validators.required,
        Validators.maxLength(Constants.LENGTH_12), Validators.pattern(Constants.REGEX_PERCENTAGE)]);
      form.get(`${undertakingType}VariationPct`).updateValueAndValidity();
    }
  }

  validateVariationAmt(form: UntypedFormGroup, undertakingType: string, irregularDetailsForm: UntypedFormGroup) {
    let bgAmt;
    let bgCurCodeControl;

    if (undertakingType === 'bg') {
      if (this.getTnxType() === '03') {
        bgAmt = this.getUndertakingAmt();
        bgCurCodeControl = form.get(`${undertakingType}VariationCurCode`);
      } else {
        bgAmt = form.parent.get(Constants.SECTION_AMOUNT_DETAILS).get(`${undertakingType}Amt`).value;
        bgCurCodeControl = form.parent.get(Constants.SECTION_AMOUNT_DETAILS).get(`${undertakingType}CurCode`);
      }
    } else {
      bgAmt = form.parent.get(Constants.SECTION_CU_AMOUNT_DETAILS).get(`${undertakingType}Amt`).value;
      bgCurCodeControl = form.parent.get(Constants.SECTION_CU_AMOUNT_DETAILS).get(`${undertakingType}CurCode`);
    }
    const variationAmtControl = form.get(`${undertakingType}VariationAmt`);
    this.validateForNullTnxAmtCurrencyField(variationAmtControl, form, undertakingType, irregularDetailsForm);
    if (irregularDetailsForm !== null) {
      form = irregularDetailsForm;
      bgCurCodeControl = form.get(`${undertakingType}VariationCurCode`);
    }
    const variationAmt = this.getNumberWithoutLanguageFormatting(form.get(`${undertakingType}VariationAmt`).value);
    bgAmt = this.getNumberWithoutLanguageFormatting(bgAmt);

    if (form.get(`${undertakingType}OperationType`).value === '02' && variationAmt !== '' && variationAmt > bgAmt
    && !form.get(`${undertakingType}VariationAmt`).invalid) {
      form.get(`${undertakingType}VariationAmt`).setValidators([validateVariationAmount(variationAmt, bgAmt)]);
      form.get(`${undertakingType}VariationAmt`).updateValueAndValidity();
    } else if (!form.get(`${undertakingType}VariationAmt`).invalid) {
      form.get(`${undertakingType}VariationAmt`).clearValidators();
      form.get(`${undertakingType}VariationAmt`).setValidators([Validators.required]);
      this.transformAmtAndSetValidators(form.get(`${undertakingType}VariationAmt`), bgCurCodeControl, 'bgVariationCurCode');
      form.get(`${undertakingType}VariationAmt`).updateValueAndValidity();
    }
  }


  setFirstDateValidator(dateField, form: UntypedFormGroup, undertakingType: string, irregularDetailsForm: UntypedFormGroup) {
    let finalRenewalExpDate;
    let expiryDate;
    let applicationDate;
    const renewalDetailSectionControl = form.parent.get(Constants.SECTION_RENEWAL_DETAILS);
    if (this.getTnxType() === '03') {
      finalRenewalExpDate = ( renewalDetailSectionControl ?  renewalDetailSectionControl.get('bgFinalExpiryDate') : null);
      expiryDate = form.parent.get(Constants.AMEND_GENERAL_DETAILS).get('bgExpDate');
      applicationDate = form.parent.get(Constants.AMEND_GENERAL_DETAILS).get('bgAmdDate');
    } else {
      if (undertakingType === 'bg' && (form.parent.get(Constants.SECTION_UNDERTAKING_GENERAL_DETAILS) != null)) {
        finalRenewalExpDate = ( renewalDetailSectionControl ?  renewalDetailSectionControl.get('bgFinalExpiryDate') : null);
        expiryDate = form.parent.get(Constants.SECTION_UNDERTAKING_GENERAL_DETAILS).get('bgExpDate');
      } else if (undertakingType === 'cu') {
        finalRenewalExpDate = form.parent.get(Constants.SECTION_CU_RENEWAL_DETAILS).get('cuFinalExpiryDate');
        expiryDate = form.parent.get(Constants.SECTION_CU_GENERAL_DETAILS).get('cuExpDate');
      }
      if (form.parent.get(Constants.SECTION_UNDERTAKING_GENERAL_DETAILS) != null) {
        applicationDate = form.parent.get(Constants.SECTION_GENERAL_DETAILS).get('applDate');
      }
    }
    if (irregularDetailsForm !== null) {
      form = irregularDetailsForm;
    }
    form.controls[dateField].clearValidators();
    form.controls[dateField].setValidators([validateFirstDateWithApplicationExpiryDate(form.get(dateField), applicationDate,
       expiryDate, finalRenewalExpDate), Validators.required]);
    form.controls[dateField].updateValueAndValidity();
  }

  setSettlementDateValidator(dateField, form: UntypedFormGroup, chargeSection: UntypedFormGroup) {
    let applicationDate;
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    applicationDate = this.getMinSettlementDate();
    applicationDate = this.datePipe.transform(applicationDate , 'dd/MM/yyyy');
    if (chargeSection !== null) {
      form = chargeSection;
    }
    form.controls[dateField].clearValidators();
    form.controls[dateField].setValidators([validateSettlementDateWithApplicationCurrentDate(form.get(dateField), applicationDate,
      currentDate), Validators.required]);
    form.controls[dateField].updateValueAndValidity();
  }

  validateDatewithExpiryDate(form: UntypedFormGroup, undertakingType: string) {
    if (form && form.get(`${undertakingType}VariationType`) && form.get(`${undertakingType}OperationType`) &&
        (form.get(`${undertakingType}VariationType`).value === '01' &&
        form.get(`${undertakingType}OperationType`).value === '02')) {
      let finalRenewalExpDate;
      let expiryDate;
      let expiryDateToCompare;
      let expiryDateString;
      let generaDetailSection;
      const renewalDetailSectionControl = form.parent.get(Constants.SECTION_RENEWAL_DETAILS);
      const ruGeneraldetailsSection = form.parent.get(Constants.SECTION_RU_GENERAL_DETAILS);
      if (this.getTnxType() === '03' && undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        generaDetailSection = Constants.AMEND_GENERAL_DETAILS;
        expiryDate = form.parent.get(generaDetailSection).get('bgExpDate').value;
      } else if (ruGeneraldetailsSection !== null) {
      expiryDate =  ruGeneraldetailsSection.get('expDate').value;
      } else if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        generaDetailSection = Constants.SECTION_UNDERTAKING_GENERAL_DETAILS;
        expiryDate = form.parent.get(generaDetailSection).get('bgExpDate').value;
      }
      finalRenewalExpDate = ( renewalDetailSectionControl ?  renewalDetailSectionControl.get('bgFinalExpiryDate').value : '');
      if (undertakingType === Constants.UNDERTAKING_TYPE_CU) {
        finalRenewalExpDate = form.parent.get(Constants.SECTION_CU_RENEWAL_DETAILS).get('cuFinalExpiryDate').value;
        expiryDate = form.parent.get(Constants.SECTION_CU_GENERAL_DETAILS).get('cuExpDate').value;
      }
      if (finalRenewalExpDate !== '' && finalRenewalExpDate != null) {
        finalRenewalExpDate = this.getDateObject(finalRenewalExpDate);
        finalRenewalExpDate = Date.parse(this.datePipe.transform(finalRenewalExpDate , Constants.DATE_FORMAT));
        expiryDateToCompare = finalRenewalExpDate;
        expiryDateString = Constants.EXTENSION_EXPIRY_TYPE;
      } else if (expiryDate !== '' && expiryDate != null && (finalRenewalExpDate === '' || finalRenewalExpDate == null)) {
        expiryDate = this.getDateObject(expiryDate);
        expiryDate = Date.parse(this.datePipe.transform(expiryDate , Constants.DATE_FORMAT));
        expiryDateToCompare = expiryDate;
        expiryDateString = Constants.EXPIRY_TYPE;
      }

      const maxIncDec = form.get(`${undertakingType}MaximumNbVariation`).value;
      const frequency = form.get(`${undertakingType}VariationFrequency`).value;
      const period = form.get(`${undertakingType}VariationPeriod`).value;
      const firstDate = form.get(`${undertakingType}VariationFirstDate`).value;
      let dateAfterAdd;
      let firstDateOfLastCycle;
      let selectedFirstDate;
      let maximumDate;
      let firstDateObj;

      if (firstDate !== '' && firstDate != null) {
      firstDateObj = this.getDateObject(firstDate);
      selectedFirstDate = Date.parse(this.datePipe.transform(firstDateObj , Constants.DATE_FORMAT));
      dateAfterAdd = this.datePipe.transform(this.setFirstDateObj(period, (maxIncDec - 1) * frequency, firstDateObj),
                      Constants.DATE_FORMAT);
      let date1 = new Date(dateAfterAdd);
      date1 = new Date(this.datePipe.transform(date1.setDate(date1.getDate() + 1), Constants.DATE_FORMAT));
      firstDateOfLastCycle = Date.parse(this.datePipe.transform(date1 , Constants.DATE_FORMAT));
      }

      if (undertakingType === Constants.UNDERTAKING_TYPE_IU && this.maxDate && this.maxDate !== '') {
        maximumDate = Date.parse(this.datePipe.transform(this.maxDate , Constants.DATE_FORMAT));
      } else if (this.cuMaxDate && this.cuMaxDate !== '') {
        maximumDate = Date.parse(this.datePipe.transform(this.cuMaxDate , Constants.DATE_FORMAT));
      } else if (!this.maxDate && this.getTnxType() === '03') {
        maximumDate = expiryDateToCompare;
      }

      form.get(`${undertakingType}MaximumNbVariation`).setValidators([validateVariationFrequency(firstDateOfLastCycle,
                                                       expiryDateToCompare, expiryDateString), Validators.maxLength(Constants.LENGTH_3),
                                                       Validators.pattern(Constants.REGEX_NUMBER), Validators.required]);
      form.get(`${undertakingType}MaximumNbVariation`).updateValueAndValidity();

      this.setMaxFirstDateValidations(selectedFirstDate, maximumDate, form, undertakingType, expiryDateString);
  }
}
setFirstDateObj(period: any, periodToBeAdded: any, firstDateObj: any): any {
  if (period === 'D') {
    return firstDateObj.setDate(firstDateObj.getDate() + periodToBeAdded);
  } else if (period === 'W') {
    periodToBeAdded = periodToBeAdded * Constants.LENGTH_7;
    return firstDateObj.setDate(firstDateObj.getDate() + periodToBeAdded);
  } else if (period === 'M') {
    return firstDateObj.setMonth(firstDateObj.getMonth() + periodToBeAdded);
  } else {
    return firstDateObj.setFullYear(firstDateObj.getFullYear() + periodToBeAdded);
  }
}

sortIrregularList(IrregularItemsList: IrregularDetails[]) {
  return IrregularItemsList.sort((b, a) => {
    let date1;
    let date2;
    date1 = new Date (parseInt(b.variationFirstDate.split('/')[Constants.LENGTH_2], 10),
                              parseInt(b.variationFirstDate.split('/')[1], 10) - 1, parseInt(b.variationFirstDate.split('/')[0], 10));
    date2 = new Date (parseInt(a.variationFirstDate.split('/')[Constants.LENGTH_2], 10),
                              parseInt(a.variationFirstDate.split('/')[1], 10) - 1, parseInt(a.variationFirstDate.split('/')[0], 10));
    return new Date(date1).getTime() as any - new Date(date2).getTime() as any;
  });
}

setMaxFirstDateValidations(selectedFirstDate: string, maxDate: string, form: UntypedFormGroup, undertakingType: string, dateType: string) {
  const control = form.get(`${undertakingType}VariationFirstDate`);
  if (control) {
    control.setValidators([validateMaxFirstDate(selectedFirstDate, maxDate, dateType), Validators.required]);
    control.updateValueAndValidity();
  }
}

compareFirstDatewithAmendDate(firstDate: any) {
  if (this.getTnxType() === '03' && firstDate && firstDate !== '' && firstDate != null) {
    let variationFirstDate;
    variationFirstDate = this.getDateObject(firstDate);
    variationFirstDate = Date.parse(this.datePipe.transform(variationFirstDate , Constants.DATE_FORMAT));
    let amendRequestDate;
    amendRequestDate = Date.parse(this.datePipe.transform(this.getMinFirstDate() , Constants.DATE_FORMAT));
    if (variationFirstDate < amendRequestDate) {
      return false;
    }
  }
  return true;
}

isFieldsValuesExists(arr: string[]): boolean {
  let val = false;
  for (const fieldValue of arr) {
    if (fieldValue && fieldValue !== null && fieldValue !== '') {
      val = true;
      break;
    }
  }
  return val;
}


OnSaveFormValidation(form: UntypedFormGroup): UntypedFormControl {
  let invalidControl = null;
  Object.keys(form.controls).forEach(field => {
    const control = form.get(field);
    if (control instanceof UntypedFormControl && control.touched && control.value !== null && control.value !== '' && control.invalid &&
    this.checkRejectErrorValidation(control)) {
      invalidControl = control;
    } else if (control instanceof UntypedFormGroup && control.touched ) {
      if (invalidControl === null) {
      invalidControl = this.OnSaveFormValidation(control);
      }
    }
  });
  return invalidControl;
}

checkRejectErrorValidation(control: AbstractControl) {
  for (let i = 0, len = Constants.REJECT_VALIDATION_ERROR.length; i < len; i++) {
    if (control.hasError(Constants.REJECT_VALIDATION_ERROR[i])) {
      return true;
    }
  }
  return false;
}

isNonEmptyString(fieldValue: any) {
  return (fieldValue !== undefined && fieldValue !== null && fieldValue !== '' );
}

setPlaceholder(undertakingType) {
  if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
    return ' ';
  } else {
    return Constants.SELECT_MESSAGE;
  }
}
public getBgRenewalType() {
  return this.bgRenewalType;
}
public setRenewalType(value, undertakingType) {
  if (undertakingType === Constants.UNDERTAKING_TYPE_CU) {
    this.cuRenewalType = value;
  } else {
    this.bgRenewalType = value;
  }
}
public getCuRenewalType() {
  return this.cuRenewalType;
}
public getRollingRenewalNb() {
  return this.rollingRenewalNb;
}
public setRollingRenewalNb(value, undertakingType) {
  if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
  this.rollingRenewalNb = value;
  } else {
  this.cuRollingRenewalNb = value;
  }
}
public getCuRollingRenewalNb() {
  return this.cuRollingRenewalNb;
}
public getRenewForNb() {
  return this.renewForNb;
}
public setRenewForNb(value, undertakingType) {
  if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
  this.renewForNb = value;
  } else {
  this.cuRenewForNb = value;
  }
}
public getCuRenewForNb() {
  return this.cuRenewForNb;
}
public getRollingRenewForNb() {
  return this.rollingRenewForNb;
}
public setRollingRenewForNb(value, undertakingType) {
  if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
  this.rollingRenewForNb = value;
  } else {
  this.cuRollingRenewForNb = value;
  }
}
public getCuRollingRenewForNb() {
  return this.cuRollingRenewForNb;
}
public getRenewForPeriod() {
  return this.renewForPeriod;
}
public setRenewForPeriod(value, undertakingType) {
  if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
  this.renewForPeriod = value;
}  else {
  this.cuRenewForPeriod = value;
  }
}
public getCuRenewForPeriod() {
  return this.cuRenewForPeriod;
}

public getRollingRenewForPeriod() {
  return this.rollingRenewForPeriod;
}
public setRollingRenewForPeriod(value, undertakingType) {
  if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
  this.rollingRenewForPeriod = value;
}  else {
  this.cuRollingRenewForPeriod = value;
  }
}
public getCuRollingRenewForPeriod() {
  return this.cuRollingRenewForPeriod;
}

public getRenewOnCode() {
  return this.renewonCode;
}
public setRenewOnCode(value, undertakingType) {
  if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
  this.renewonCode = value;
  } else {
  this.cuRenewonCode = value;
  }
}
public getCuRenewOnCode() {
  return this.cuRenewonCode;
}
public getRenewalCalendarDate() {
  return this.renewalCalendarDate;
}
public setRenewalCalendarDate(value, undertakingType) {
  if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
  this.renewalCalendarDate = value;
  } else {
  this.cuRenewalCalendarDate = value;
  }
}
public getCuRenewalCalendarDate() {
  return this.cuRenewalCalendarDate;
}
public getExpiryDate() {
  return this.expiryDate;
}
public setExpiryDate(value, undertakingType) {
  if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
    this.expiryDate = value;
    } else {
    this.cuExpiryDate = value;
    }
}
public getCuExpiryDate() {
  return this.cuExpiryDate;
}

calculateRegularExtFinalExpiryDate(undertakingType: string) {
  if (this.getBgRenewalType() === '01' || this.getCuRenewalType() === '01') {
    let renewCalendardateObject;
    let finalExpiryRenewalDate;
    const weekDay = 7;
    let numOfRenewals;
    let renewalInterval;
    let renewalIntervalUnit;
    let totalRenewalInterval;

    if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      numOfRenewals = this.getRollingRenewalNb();
      renewalInterval = this.getRenewForNb();
      renewalIntervalUnit = this.getRenewForPeriod();
      totalRenewalInterval = numOfRenewals * renewalInterval;

      if (this.getRenewOnCode() === '02') {
        const renewCalendardate = this.getRenewalCalendarDate();
        renewCalendardateObject = this.getDateObject(renewCalendardate);
      } else if (this.getRenewOnCode() === '01') {
        const expDate = this.getExpiryDate();
        renewCalendardateObject = this.getDateObject(expDate);
      }
    } else if (undertakingType === Constants.UNDERTAKING_TYPE_CU) {
      numOfRenewals = this.getCuRollingRenewalNb();
      renewalInterval = this.getCuRenewForNb();
      renewalIntervalUnit = this.getCuRenewForPeriod();
      totalRenewalInterval = numOfRenewals * renewalInterval;

      if (this.getCuRenewOnCode() === '02') {
        const cuRenewCalendardate = this.getCuRenewalCalendarDate();
        renewCalendardateObject = this.getDateObject(cuRenewCalendardate);
      } else if (this.getCuRenewOnCode() === '01') {
        const cuExpDate = this.getCuExpiryDate();
        renewCalendardateObject = this.getDateObject(cuExpDate);
      }
    }
    if (numOfRenewals && numOfRenewals != null && renewalInterval && renewalInterval != null
      && renewalIntervalUnit && renewalIntervalUnit !== '' && renewalIntervalUnit != null) {

      switch (renewalIntervalUnit) {
        case 'D':
          finalExpiryRenewalDate = new Date(renewCalendardateObject.setDate(renewCalendardateObject.getDate() + (totalRenewalInterval)));
          break;
        case 'W':
          finalExpiryRenewalDate = new Date(renewCalendardateObject.setDate
            (renewCalendardateObject.getDate() + (weekDay * totalRenewalInterval)));
          break;
        case 'M':
          finalExpiryRenewalDate = new Date(renewCalendardateObject.setMonth(renewCalendardateObject.getMonth() + (totalRenewalInterval)));
          break;
        case 'Y':
          finalExpiryRenewalDate = new Date(renewCalendardateObject.setFullYear
            (renewCalendardateObject.getFullYear() + (totalRenewalInterval)));
          break;
        default:
          break;
      }
      this.setFormatFinalExpiryDate(undertakingType, finalExpiryRenewalDate, renewalIntervalUnit);
    }
  }
}

checkForMonthEnd(renewalIntervalUnit, undertakingType) {
  if (renewalIntervalUnit === 'M') {
    const datePartsForFinalExpDate = undertakingType === Constants.UNDERTAKING_TYPE_IU ?
    this.finalExpiryDate.split('/') : this.cuFinalExpiryDate.split('/');
    const finalExpDate = new Date(+datePartsForFinalExpDate[Constants.NUMERIC_TWO],
      +datePartsForFinalExpDate[1] - 1, +datePartsForFinalExpDate[0]);
    const expDate = undertakingType === Constants.UNDERTAKING_TYPE_IU ? this.expiryDate.toString() : this.cuExpiryDate.toString();
    const datePartsForExpDate = expDate.split('/');
    const strExpDate = new Date(+datePartsForExpDate[Constants.NUMERIC_TWO], +datePartsForExpDate[1] - 1, +datePartsForExpDate[0]);
    // Get the difference between the calculated date and expiry date and check if it has crossed the expected date
    if (this.getDifferenceInMonths(strExpDate, finalExpDate) >= (undertakingType === Constants.UNDERTAKING_TYPE_IU ?
      +this.renewForNb + 1 : +this.cuRenewForNb + 1)) {
      const finalExpDateYear = finalExpDate.getFullYear();
      const finalExpDateMonth = finalExpDate.getMonth();
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.finalExpiryDate = formatDate(new Date(finalExpDateYear,
          finalExpDateMonth, 0), Constants.DATE_FORMAT_DMY, Constants.LANGUAGE_EN);
      } else {
        this.cuFinalExpiryDate = formatDate(new Date(finalExpDateYear,
          finalExpDateMonth, 0), Constants.DATE_FORMAT_DMY, Constants.LANGUAGE_EN);
      }
    }
}
}

getDifferenceInMonths(d1, d2) {
  const d1Y = d1.getFullYear();
  const d2Y = d2.getFullYear();
  const d1M = d1.getMonth();
  const d2M = d2.getMonth();
  return (d2M + Constants.NUMERIC_TWELVE * d2Y) - (d1M + Constants.NUMERIC_TWELVE * d1Y);
}

calculateRollingExtFinalExpiryDate(undertakingType) {
  if (this.getBgRenewalType() === '02' || this.getCuRenewalType() === '02') {
    let renewCalendardateObject;
    let rollingCalendarDate;
    let finalExpiryRenewalDate;
    let numOfRenewals;
    let renewalInterval;
    let renewalIntervalUnit;
    let rollingRenewalInterval;
    let rollingRenewalIntervalUnit;
    let totalRollingRenewalInterval;

    if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      numOfRenewals = this.getRollingRenewalNb();
      renewalInterval = this.getRenewForNb();
      renewalIntervalUnit = this.getRenewForPeriod();
      rollingRenewalInterval = this.getRollingRenewForNb();
      rollingRenewalIntervalUnit = this.getRollingRenewForPeriod();
      totalRollingRenewalInterval = rollingRenewalInterval * numOfRenewals;
      renewalInterval = renewalInterval * 1;

      if (this.getRenewOnCode() === '01') {
        const expiryDate = this.getExpiryDate();
        renewCalendardateObject = this.getDateObject(expiryDate);
      } else if (this.getRenewOnCode() === '02') {
        const renewCalendardate = this.getRenewalCalendarDate();
        renewCalendardateObject = this.getDateObject(renewCalendardate);
      }
    } else if (undertakingType === Constants.UNDERTAKING_TYPE_CU) {
      numOfRenewals = this.getCuRollingRenewalNb();
      renewalInterval = this.getCuRenewForNb();
      renewalIntervalUnit = this.getCuRenewForPeriod();
      rollingRenewalInterval = this.getCuRollingRenewForNb();
      rollingRenewalIntervalUnit = this.getCuRollingRenewForPeriod();
      totalRollingRenewalInterval = rollingRenewalInterval * numOfRenewals;
      renewalInterval = renewalInterval * 1;

      if (this.getCuRenewOnCode() === '01') {
        const cuExpiryDate = this.getCuExpiryDate();
        renewCalendardateObject = this.getDateObject(cuExpiryDate);
      } else if (this.getCuRenewOnCode() === '02') {
        const cuRenewCalendardate = this.getCuRenewalCalendarDate();
        renewCalendardateObject = this.getDateObject(cuRenewCalendardate);
      }
    }

    if (renewalInterval && renewalInterval != null
      && renewalIntervalUnit && renewalIntervalUnit !== '' && renewalIntervalUnit != null) {
      rollingCalendarDate = this.calculateRollingCalendarDate(renewalIntervalUnit, renewCalendardateObject, renewalInterval);
    }
    let rollingCalDate;
    if (rollingCalendarDate && rollingCalendarDate !== undefined && rollingCalendarDate !== null && rollingCalendarDate !== '') {
      rollingCalDate = new Date(rollingCalendarDate);
    }

    if (rollingCalDate && rollingCalDate !== undefined && rollingCalDate !== null && rollingCalDate !== ''
      && numOfRenewals && numOfRenewals != null && rollingRenewalInterval && rollingRenewalInterval != null
      && rollingRenewalIntervalUnit && rollingRenewalIntervalUnit !== '' && rollingRenewalIntervalUnit != null) {
      finalExpiryRenewalDate = this.calculateFinalExpiryRenewalDate(rollingRenewalIntervalUnit,
        rollingCalDate, totalRollingRenewalInterval);
      this.setFormatFinalExpiryDate(undertakingType, finalExpiryRenewalDate, renewalIntervalUnit);
    }
  }
}

calculateRollingCalendarDate(renewalIntervalUnit, renewCalendardateObject, renewalInterval) {
  let rollingCalendarDate;
  const weekDay = 7;
  switch (renewalIntervalUnit) {
    case 'D':
      rollingCalendarDate = new Date(renewCalendardateObject.setDate(renewCalendardateObject.getDate() + renewalInterval));
      break;
    case 'W':
      rollingCalendarDate = new Date(renewCalendardateObject.setDate
        (renewCalendardateObject.getDate() + (weekDay * renewalInterval)));
      break;
    case 'M':
      rollingCalendarDate = new Date(renewCalendardateObject.
        setMonth(renewCalendardateObject.getMonth() + renewalInterval));
      break;
    case 'Y':
      rollingCalendarDate = new Date(renewCalendardateObject.setFullYear
        (renewCalendardateObject.getFullYear() + renewalInterval));
      break;
    default:
      break;
  }
  return rollingCalendarDate;
}

calculateFinalExpiryRenewalDate(rollingRenewalIntervalUnit, rollingCalDate, totalRollingRenewalInterval) {
  const weekDay = 7;
  let finalExpiryRenewalDate;
  switch (rollingRenewalIntervalUnit) {
    case 'D':
      finalExpiryRenewalDate = new Date(rollingCalDate.setDate
        (rollingCalDate.getDate() + (totalRollingRenewalInterval)));
      break;
    case 'W':
      finalExpiryRenewalDate = new Date(rollingCalDate.setDate
        (rollingCalDate.getDate() + (weekDay * totalRollingRenewalInterval)));
      break;
    case 'M':
      finalExpiryRenewalDate = new Date(rollingCalDate.
        setMonth(rollingCalDate.getMonth() + (totalRollingRenewalInterval)));
      break;
    case 'Y':
      finalExpiryRenewalDate = new Date(rollingCalDate.setFullYear
        (rollingCalDate.getFullYear() + (totalRollingRenewalInterval)));
      break;
    default:
      break;
  }
  return finalExpiryRenewalDate;
}

  setFormatFinalExpiryDate(undertakingType, finalExpiryRenewalDate, renewalIntervalUnit) {
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      this.finalExpiryDate = this.getFormattedDateForLanguage(finalExpiryRenewalDate);
      this.checkForMonthEnd(renewalIntervalUnit, undertakingType);
    } else if (undertakingType === Constants.UNDERTAKING_TYPE_CU) {
      this.cuFinalExpiryDate = this.getFormattedDateForLanguage(finalExpiryRenewalDate);
      this.checkForMonthEnd(renewalIntervalUnit, undertakingType);
    }
  }

  getNumberWithoutLanguageFormatting(amt) {
    const userLanguage = this.getUserLanguage();
    if (userLanguage === Constants.LANGUAGE_FR) {
      amt = amt.split(Constants.COMMA).join(Constants.DOT);
      amt = amt.split(Constants.FRENCH_THOUSAND_SEPARATOR).join('');
    } else if (userLanguage === Constants.LANGUAGE_AR) {
      amt = amt.split(Constants.ARABIC_DECIMAL_SEPARATOR).join(Constants.DOT);
      amt = amt.split(Constants.ARABIC_THOUSAND_SEPARATOR).join('');
    } else {
      amt = amt.split(Constants.COMMA).join('');
    }
    return amt;
  }

  getPercentWithoutLanguageFormatting(amt) {
    amt = this.getNumberWithoutLanguageFormatting(amt);
    const index = amt.indexOf(Constants.DOT);
    if (index > -1) {
      amt = amt.substring(0, index);
    }
    if (amt === Constants.DOT) {
      amt = '';
    }
    return amt;
  }

  getDateObject(date) {
    if (date && date != null && date !== '') {
      const dateParts = date.split('/');
      let dateObject;
      if (this.userLanguage === Constants.LANGUAGE_US) {
        dateObject = new Date(+dateParts[Constants.NUMERIC_TWO], dateParts[Constants.NUMERIC_ZERO] - 1, +dateParts[Constants.NUMERIC_ONE]);
      } else {
        dateObject = new Date(+dateParts[Constants.NUMERIC_TWO], dateParts[Constants.NUMERIC_ONE] - 1, +dateParts[Constants.NUMERIC_ZERO]);
      }
      return dateObject;
    } else {
      return date;
    }
  }

  getFormattedDateForLanguage(date) {
    let formattedDate;
    const format = this.userLanguage === Constants.LANGUAGE_US ? Constants.DATE_FORMAT : Constants.DATE_FORMAT_DMY;
    formattedDate = formatDate(new Date(date), format, Constants.LANGUAGE_EN);
    return formattedDate;
  }

  formatAmountByLanguage(amount) {
    if (this.userLanguage === Constants.LANGUAGE_AR) {
      amount = amount.replace(Constants.DOT, Constants.ARABIC_DECIMAL_SEPARATOR);
      amount = amount.replaceAll(Constants.COMMA, Constants.ARABIC_THOUSAND_SEPARATOR);
    } else if (this.userLanguage === Constants.LANGUAGE_FR) {
      amount = amount.replaceAll(Constants.NO_BREAK_SPACE, Constants.FRENCH_THOUSAND_SEPARATOR);
    }
    return amount;
  }

  compareExpirydatewithCurrentDate(expiryDate: any) {
    if (expiryDate && expiryDate !== '' && expiryDate != null) {
      let variationExpiryDate;
      variationExpiryDate = this.getDateObject(expiryDate);
      variationExpiryDate = Date.parse(this.datePipe.transform(variationExpiryDate , Constants.DATE_FORMAT));
      let currentDate;
      currentDate = Date.parse(this.datePipe.transform(new Date() , Constants.DATE_FORMAT));
      if (currentDate > variationExpiryDate) {
        return true;
      }
    }
    return false;
  }

  public getTableData(listdefName: string, filterParams: string, paginatorParams: string) {
    const obj = {};
    obj['Content-Type'] = 'application/json';
    const headers = new HttpHeaders(obj);
    const reqUrl = `${listdefName}&FilterValues=${encodeURIComponent(filterParams)}&Start=${encodeURIComponent(paginatorParams)}`;

    return this.http.get<any>(reqUrl, { headers });
  }

   // Below method is used to decode HTML entities
   decodeHtml(input) {
    const contentType = 'text/html';
    const doc = new DOMParser().parseFromString(input, contentType);
    return doc.documentElement.textContent;
  }

  public addPublicTask(task: Task) {
    this.publicTasks.push(task);
  }

  public editPublicTask(task: Task, index: number) {
    this.publicTasks[index] = task;
  }

  public getPublicTasks() {
    return this.publicTasks;
  }

  getCategoryId(catName) {
    if (catName !== 'bgAmdDetails') {
      const categoryMap = new Map();
      categoryMap.set('bgFreeFormatText', '12');
      categoryMap.set('bgAmdDetails', '13');
      categoryMap.set('bgNarrativePresentationInstructions', '50');
      categoryMap.set('cuNarrativeUndertakingTermsAndConditions', '51');
      categoryMap.set('bgNarrativeTextUndertaking', '54');
      categoryMap.set('cuNarrativePresentationInstructions', '58');
      categoryMap.set('*', '99');
      return `${categoryMap.get(catName)}|99`;
    } else {
      return '12|13|50|51|54|58|99';
    }
  }

  public addPrivateTask(task: Task) {
    this.privateTasks.push(task);
  }

  public editPrivateTask(task: Task, index: number) {
    this.privateTasks[index] = task;
  }

  public getPrivateTasks() {
    return this.privateTasks;
  }

  public setSessionData(session: Session) {
    this.sessionData = session;
  }

  public getSessionData() {
    return this.sessionData;
  }

  public setMainBankAbbvName(name: string) {
    this.mainBankAbbvName = name;
  }

  public getMainBankAbbvName() {
    return this.mainBankAbbvName;
  }

  public setMainBankName(name: string) {
    this.mainBankName = name;
  }

  public getMainBankName() {
    return this.mainBankName;
  }

  public setMainBankDetails(abbvName, name) {
    this.mainBankAbbvName = abbvName;
    this.mainBankName = name;
  }

  public getTnxToDoListId() {
    return this.tnxToDoListId;
  }

  public setTnxToDoListId(value) {
    this.tnxToDoListId = value;
  }

  
public getSwiftVersion(): number {
  return this.swiftVersion;
}

public setSwiftVersion(value) {
  this.swiftVersion = value;
}

public getSwiftZChar(): string {
  return this.swiftZChar;
}

public setSwiftZChar(value) {
  this.swiftZChar = value;
}
  public getboInpDttm() {
    return this.boInpDttm;
  }

  public setboInpDttm(value) {
    this.boInpDttm = value;
  }

  generateUIUD() {
    return uuid.v4();
 }

  public saveTask(taskRequest: TaskRequest): Observable<any> {
      const requestPayload = JSON.parse(JSON.stringify(taskRequest));
      const completePath = this.getContextPath() + URLConstants.SAVE_TASK;
      const iKey = this.generateUIUD();
      const obj = {};
      obj[Constants.CONTENT_TYPE] = Constants.APP_JSON;
      obj[Constants.IDEMPOTENCY_KEY] = iKey;
      const headers = new HttpHeaders(obj);
      return this.http.post<any>(completePath, requestPayload, {headers});
    }

  public editTask(taskRequest: TaskRequest, taskId: string): Observable<any> {
      const requestPayload = JSON.parse(JSON.stringify(taskRequest));
      const completePath = `${this.getContextPath()}${URLConstants.EDIT_TASK}${taskId}`;
      const obj = {};
      obj[Constants.CONTENT_TYPE] = Constants.APP_JSON;
      const headers = new HttpHeaders(obj);
      return this.http.put<any>(completePath, requestPayload, {headers});
    }

  public completeTask(isComplete: boolean, taskId: string): Observable<any> {
      const requestPayload = {isComplete};
      const completePath = `${this.getContextPath()}${URLConstants.COMPLETE_TASK}${taskId}/status`;
      const iKey = this.generateUIUD();
      const obj = {};
      obj[Constants.CONTENT_TYPE] = Constants.APP_JSON;
      obj[Constants.IDEMPOTENCY_KEY] = iKey;
      const headers = new HttpHeaders(obj);
      return this.http.post<any>(completePath, requestPayload, {headers});
    }

  public createComment(description: string, inpDttm: string, taskId: string): Observable<any> {
      const requestPayload = {description, inpDttm, taskId};
      const completePath = this.getContextPath() + URLConstants.SAVE_COMMENT + taskId;
      return this.http.post<any>(completePath, requestPayload, {headers : this.headers} );
    }

  public getFormattedDate(dateRequest: string): Observable<any> {
      const requestPayload = {dateRequest};
      const completePath = this.getContextPath() + URLConstants.FORMATTED_DATE;
      return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
    }

  public getCompanyFullName(refId: string, productCode: string): Observable<any> {
    const requestPayload = {refId, productCode};
    const completePath = this.getContextPath() + URLConstants.COMPANY_FULL_NAME;
    return this.http.post<any>(completePath, requestPayload, {headers : this.headers});
  }
}
