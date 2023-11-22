import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { FccGlobalConstant } from '../../common/core/fcc-global-constants';
import { FccTradeFieldConstants } from '../../corporate/trade/common/fcc-trade-field-constants';
import { LcConstant } from '../../corporate/trade/lc/common/model/constant';
import { CommonService } from './../../common/services/common.service';

export abstract class FCCFormControl extends UntypedFormControl {
  key: string;
  type: string;
  params: any;
  viewParams: any;
  pdfParams: any;
  LcConstant = new LcConstant();
  translate: TranslateService;
  regex;

  constructor(fieldType: string , id: string, value: any, translate: TranslateService, params: any = {},
              viewParams?: any, pdfParams?: any) {
      super(value, params[FccGlobalConstant.VALIDATORS]);
      this.key = id;
      this.type = fieldType;
      this.params = params;
      this.viewParams = viewParams;
      this.pdfParams = pdfParams;
      this.translate = translate;
  }


  updateParams(mode: string) {
    if ( mode === 'view') {
      this.viewParams = this.params;
    } else if ( mode === 'pdf') {
    this.pdfParams = this.params;
    }
  }

  getStyle(): string {
    if (this.params[FccGlobalConstant.STYLECLASS] === undefined || this.params[FccGlobalConstant.STYLECLASS].length <= 0) {
       return '';
    }
    return this.params[FccGlobalConstant.STYLECLASS].join(' ');
  }
  fetchMessage(messages: string[]): string[] {
    const displayMsg = this.params['applicableValidation'][0]['messageKey'];
    this.regex = (this.errors.pattern.requiredPattern !== '' || this.errors.pattern.requiredPattern !== null) ?
                                 this.errors.pattern.requiredPattern : '';
                    if (this.regex !== '') {
                      this.regex = this.regex.slice(2); // Remove first 2 characters in Regex i.e ^[
                      this.regex = this.regex.slice(0, this.regex.length - 3); // Remove last 2 characters in Regex i.e ]*$
                      this.regex = this.regex.split('\\n').join('').split('\\r').join('').split('\\s').join('');
                    }
                    const swiftRegex = (this.regex !== '') ?
                                  this.regex : 'a-z A-Z 0-9 . , - ( ) / = \' + : ? ! " % & * < > ; { @ # _';
    messages.push(`${this.translate.instant(displayMsg, { validSwiftRegex: swiftRegex })}`);
    return messages;
  }

  getValidationMessages() {
      let messages: string[] = [];
      if (this.errors) {
          // eslint-disable-next-line guard-for-in
          for (const errorName in this.errors) {
              switch (errorName) {
                  case 'required':
                    if (this.params.hasOwnProperty(FccGlobalConstant.SHOWVALIDATIONMSG)
                        && !this.params[FccGlobalConstant.SHOWVALIDATIONMSG]) {
                      break;
                    }
                  if (this.params.type) {
                    if (this.params.type === FccGlobalConstant.inputDropdown) {
                      messages.push(`${this.translate.instant('requiredDropDown', { field: this.params[FccGlobalConstant.LABEL] })}`);
                    } else if (this.params.type === FccGlobalConstant.inputDropdownFilter) {
                      messages.push(`${this.translate.instant('requiredDropDownFilter', { field: this.params[FccGlobalConstant.LABEL] })}`);
                    }

                  } else {
                    messages.push(`${this.translate.instant('required', { field: this.params[FccGlobalConstant.LABEL] })}`);
                  }
                    break;
                  case 'minlength':
                    messages.push(`${this.translate.instant('minLength', { field: this.params[FccGlobalConstant.LABEL],
                            minLength: this.errors[FccGlobalConstant.MINLENGTH].requiredLength })}`);
                    break;
                  case 'maxlength':
                    messages.push(`${this.translate.instant('maxLength', { field: this.params[FccGlobalConstant.LABEL],
                            maxLength: this.errors[FccGlobalConstant.MAXLENGTH].requiredLength })}`);
                    break;
                    case 'amountMaxLength':
                      messages.push(`${this.translate.instant('amountMaxLength',
                              { field: this.errors.amountMaxLength.field,
                                maxLength: this.errors.amountMaxLength.maxLength})}`);
                      break;
                  case 'pattern':
                  // Added the check for displaying the regex value related to swiftZ charset
                  if (this.params.applicableValidation) {
                    messages = this.fetchMessage(messages);
                  }
                  else if (this.type === FccGlobalConstant.highlightEditor ||
                     (this.type === FccGlobalConstant.inputTextArea || this.type === FccGlobalConstant.amendNarrativeTextArea ||
                     (this.type === FccGlobalConstant.inputText && (this.key === FccGlobalConstant.BENEFICIARY_REFERNCE || this.key === FccGlobalConstant.CUSTOMER_REF
                     || this.key === FccGlobalConstant.ADDITIONAL_CUSTOMER_REFERENCE)))) {
                    this.regex = (this.errors.pattern.requiredPattern !== '' || this.errors.pattern.requiredPattern !== null) ?
                                 this.errors.pattern.requiredPattern : '';
                    if (this.regex !== '') {
                      this.regex = this.regex.slice(2); // Remove first 2 characters in Regex i.e ^[
                      this.regex = this.regex.slice(0, this.regex.length - 3); // Remove last 2 characters in Regex i.e ]*$
                      this.regex = this.regex.split('\\n').join('').split('\\r').join('').split('\\s').join('');
                    }
                    const swiftRegex = (this.regex !== '') ?
                                  this.regex : 'a-z A-Z 0-9 . , - ( ) / = \' + : ? ! " % & * < > ; { @ # _';
                    messages.push(`${this.translate.instant('invalidSwiftRegex', { validSwiftRegex: swiftRegex })}`);
                  } else if ((this.key === FccGlobalConstant.FT_MOBILE_NO)) {
                    messages.push(`${this.translate.instant('invalidPhone')}`);
                  } else if ((this.key === FccTradeFieldConstants.CONTACT_NUMBER) || (this.key === FccTradeFieldConstants.FAX) || (this.key === FccTradeFieldConstants.TELEX)) {
                    messages.push(`${this.translate.instant('invalidContactDetails', { field: this.params[FccGlobalConstant.LABEL] })}`);
                  } else if ((this.key === FccGlobalConstant.FT_EMAIL_ID) || (this.key === FccGlobalConstant.EMAIL_ID)) {
                    messages.push(`${this.translate.instant('invalidEmail')}`);
                  } else if (this.key === FccGlobalConstant.FT_NEW_USER_ID_VAL) {
                    messages.push(`${this.translate.instant('invalidLoginID')}`);
                  } else if (this.type === FccGlobalConstant.FT_USER_PWD_TYPE) {
                    messages.push(`${this.translate.instant('invalidPasswordEntered')}`);
                  } else if ((this.key === FccGlobalConstant.ADVISING_SWIFT_CODE) ||
                             (this.key === FccGlobalConstant.ISSUING_SWIFT_CODE) ||
                             (this.key === FccGlobalConstant.BEI_CODE) ||
                             (this.key === FccGlobalConstant.CU_BEI_CODE) ||
                             (this.key === FccGlobalConstant.ADVISE_SWIFT_CODE) ||
                             (this.key === FccGlobalConstant.CONF_PARTY_SWIFT_CODE) ||
                             (this.key === FccGlobalConstant.BIC_CODE) ||
                             (this.key === FccGlobalConstant.ISSUING_BANK_SWIFT_CODE)
                             || (this.key === FccGlobalConstant.PRESENTING_SWIFT_CODE) ||
                             (this.key === FccGlobalConstant.COLLECTING_SWIFT_CODE)) {
                    messages.push(`${this.translate.instant('swiftCodeValidation')}`);
                  } else if (this.key === FccGlobalConstant.BG_VAR_DAY_IN_MONTH || this.key === FccGlobalConstant.BG_ROLLING_DAY_IN_MONTH) {
                    messages.push(`${this.translate.instant('variationDayInMonthError')}`);
                  } else if (this.key === FccGlobalConstant.BG_VAR_PCT) {
                    messages.push(`${this.translate.instant('variationPercentNumberFormatError')}`);
                  } else if (this.key === FccGlobalConstant.BG_VAR_AMT) {
                    messages.push(`${this.translate.instant('variationAmtNumberFormatError')}`);
                  } else if (this.key === FccGlobalConstant.CU_VAR_DAY_IN_MONTH || this.key === FccGlobalConstant.CU_ROLLING_DAY_IN_MONTH) {
                    messages.push(`${this.translate.instant('variationDayInMonthError')}`);
                  } else if (this.key === FccGlobalConstant.CU_VAR_PCT) {
                    messages.push(`${this.translate.instant('variationPercentNumberFormatError')}`);
                  } else if (this.key === FccGlobalConstant.CU_VAR_AMT) {
                    messages.push(`${this.translate.instant('variationAmtNumberFormatError')}`);
                  } else if (this.key === FccGlobalConstant.PERIOD_OF_PRESENTATION_TEXT) {
                    messages.push(`${this.translate.instant('noSplCharsInPeriodPresentation')}`);
                  } else if (this.key === FccGlobalConstant.PERIOD_OF_PRESENTATION_NO_DAYS) {
                    messages.push(`${this.translate.instant('nbDaysToBeNumberAndCantBeZero')}`);
                  } else {
                    messages.push(`${this.translate.instant('pattern', { field: this.params[FccGlobalConstant.LABEL] })}`);
                  } 
                  break;
                  case 'maxDate':
                    messages.push(`${this.translate.instant('maxDateError', { maxDate: this.errors.maxDate.maxDate})}`);
                    break;
                  case 'minDate':
                    messages.push(`${this.translate.instant('minDateError', { minDate: this.errors.minDate.minDate})}`);
                    break;
                  case 'InvalidOtpCheck':
                      break;
                  case 'matDatepickerParse':
                      break;
                  case 'matDatepickerMin':
                    if (this.key === FccGlobalConstant.TRANSFER_DATE)
                    {
                      messages.push(`${this.translate.instant('transferDateLessThanCurrentDate')}`);
                    } else{
                      messages.push(`${this.translate.instant('backDatederror')}`);
                    }
                      break;
                  case 'expiryDateLessThanCurrentDate':
                    if (Object.keys(this.errors).length === 1) {
                      messages.push(`${this.translate.instant('backDatederror')}`);
                    }
                    break;
                  case 'decimalvalidator':
                      messages.push(`${this.translate.instant('decimalvalidator', { field: this.params[FccGlobalConstant.LABEL]})}`);
                      break;
                  case 'emptycurrency':
                      messages.push(`${this.translate.instant('emptycurrency')}`);
                      break;
                  case 'zeroamount':
                    messages.push(`${this.translate.instant('zeroamount')}`);
                    break;
                  case 'amountToBeNumericAndGreaterThanZero':
                      messages.push(`${this.translate.instant('amountToBeNumericAndGreaterThanZero')}`);
                      break;
                  case 'maxSizeExceeds':
                    messages.push(`${this.translate.instant('maxSizeExceeds', { maxSize: this.params[FccGlobalConstant.LABEL]})}`);
                    break;
                  case 'maxSizeExceedsIndividual':
                      messages.push(`${this.translate.instant('maxSizeExceedsIndividual', { maxSize: this.params[FccGlobalConstant.MAXLENGTH]})}`);
                      break;
                  case 'rowCountMoreThanAllowed':
                    messages.push(`${this.translate.instant('rowCountMoreThanAllowed',
                    { maxRows: this.errors.rowCountMoreThanAllowed.maxRows,
                      charPerRow: this.errors.rowCountMoreThanAllowed.charPerRow})}`);
                    break;
                    case 'amountLimitPerProdType':
                    messages.push(`${this.translate.instant('amountLimitPerProdType',
                    { currency: this.errors.amountLimitPerProdType.currency,
                      productMinLimit: this.errors.amountLimitPerProdType.productMinLimit,
                      productMaxLimit: this.errors.amountLimitPerProdType.productMaxLimit,
                      productName: this.errors.amountLimitPerProdType.productName})}`);
                    break;
                  case 'leiAlertMessage':
                    messages.push(`${this.translate.instant('leiAlertMessage',
                    { legalEntityAmt: this.errors.leiAlertMessage.legalEntityAmt
                    })}`);
                    break;
                  case 'balanceAmtLessThanInstrumentAmount':
                      messages.push(`${this.translate.instant('balanceAmtLessThanInstrumentAmount',
                      { balanceTransactionAmount: this.errors.balanceAmtLessThanInstrumentAmount.balanceTransactionAmount,})}`);
                      break;
                  case 'balanceAmtError':
                      messages.push(`${this.translate.instant('balanceAmtError',
                      { balanceTransactionAmount: this.errors.balanceAmtError.balanceTransactionAmount,})}`);
                      break;
                  case 'beneAmtLimitExceeds':
                    messages.push(`${this.translate.instant('beneAmtLimitExceeds')}`);
                    break;
                  case 'beneTnxLimitExceeds':
                    messages.push(`${this.translate.instant('beneTnxLimitExceeds')}`);
                    break;
                  case 'maxSizeExceedsAmend':
                    messages.push(`${this.translate.instant('maxSizeExceedsAmend', { maxSize: this.errors.maxSizeExceedsAmend.maxSize})}`);
                    break;
                  case 'comparelastshipmentdate':
                    messages.push(`${this.translate.instant('comparelastshipmentdate')}`);
                    break;
                  case 'selectCurrency':
                    messages.push(`${this.translate.instant('selectCurrency')}`);
                    break;
                  case 'businessCutOffError':
                    messages.push(`${this.translate.instant('businessCutOffError')}`);
                    break;
                  case 'comparelastshipmentdatewithapplicationdate':
                    messages.push(`${this.translate.instant('comparelastshipmentdatewithapplicationdate')}`);
                    break;
                  case 'compareExpDateWithLastShipmentDate':
                    messages.push(`${this.translate.instant('compareExpDateWithLastShipmentDate')}`);
                    break;
                  case 'compareNewExpiryDateToOld':
                    messages.push(`${this.translate.instant('compareNewExpiryDateToOld')}`);
                    break;
                  case 'compareNewExpiryDateToIssueDate':
                      messages.push(`${this.translate.instant('compareNewExpiryDateToIssueDate')}`);
                      break;
                  case 'compareNewAmountToOld':
                    messages.push(`${this.translate.instant('compareNewAmountToOld')}`);
                    break;
                  case 'newConfrmpasswordMismatch':
                    messages.push(`${this.translate.instant('newConfrmpasswordMismatch')}`);
                    break;
                  case 'oldnewPwdSame':
                    messages.push(`${this.translate.instant('oldnewPwdSame')}`);
                    break;
                  case 'userIdExist':
                    messages.push(`${this.translate.instant('userIdExist')}`);
                    break;
                  case 'customTenorMinDays':
                    messages.push(`${this.translate.instant('customTenorMinDays', { field: this.params[FccGlobalConstant.LABEL],
                      minLength: this.errors[FccGlobalConstant.CUSTOMTENORMINDAYS]})}`);
                    break;
                  case 'transferDateIsHoliday':
                    messages.push(`${this.translate.instant('transferDateIsHoliday', {element: this.translate.instant(this.key)})}`);
                    break;
                  case 'transferDateIsExceedingFutureDate':
                      messages.push(`${this.translate.instant('transferDateIsExceedingFutureDate', { element: this.translate.instant(this.key),maxDate: this['params']['displayMaxDate']})}`);
                     
                      break;
                  case 'startDateLessThanMinDate':
                        messages.push(`${this.translate.instant('startDateLessThanMinDate', { minStartDate: this['params']['displayMinStartDate']})}`);
                       
                        break;
                  case 'startDateGreaterThanMaxDate':
                  messages.push(`${this.translate.instant('startDateGreaterThanMaxDate', { maxStartDate: this['params']['displayMaxStartDate']})}`);
                  
                  break;
                  case 'transferDateLessThanCurrentDate':
                        messages.push(`${this.translate.instant('transferDateLessThanCurrentDate', {element: this.translate.instant(this.key)})}`);
                        break;
                        
                case 'customTenorMaxDays':
                    messages.push(`${this.translate.instant('customTenorMaxDays', { field: this.params[FccGlobalConstant.LABEL],
                      maxLength: this.errors[FccGlobalConstant.CUSTOMTENORMAXDAYS]})}`);
                    break;
                  case 'emailIdExist':
                    messages.push(`${this.translate.instant('emailIdExist')}`);
                    break;
                    case 'NumberVal':
                      messages.push(`${this.translate.instant('NumberVal')}`);
                      break;
                    case 'validEmail':
                      messages.push(`${this.translate.instant('validEmail')}`);
                    break;
                    case 'consumedAmtgretaer':
                      messages.push(`${this.translate.instant('consumedAmtgretaer')}`);
                    break;
                    case 'accountNumberMismatch':
                      messages.push(`${this.translate.instant('accountNumberMismatch')}`);
                      break;
                    case 'invalidBeneCode':
                      messages.push(`${this.translate.instant('invalidBeneCode')}`);
                      break;
                    case 'accountNumberInvalid':
                      messages.push(`${this.translate.instant('accountNumberInvalid')}`);
                      break;
                    case 'beneficiaryCodeExist':
                        messages.push(`${this.translate.instant('beneficiaryCodeExist')}`);
                        break;
                    case 'accountNumberExist':
                        messages.push(`${this.translate.instant('accountNumberExist')}`);
                        break;
                    case 'requiredField':
                      messages.push(`${this.translate.instant('requiredField')}`);
                      break;
                  case 'wrongOtp':
                    messages.push(`${this.translate.instant('wrongOtp')}`);
                    break;
                    case 'maxAcclimit':
                      messages.push(`${this.translate.instant('maxAcclimit')}`);
                      break;
                  case 'invalidBICError':
                    messages.push(`${this.translate.instant('invalidBICError')}`);
                    break;
                  case 'BeneficiaryNameExists':
                      messages.push(`${this.translate.instant('BeneficiaryNameExists')}`);
                      break;
                  case 'DuplicateAccountNumber':
                      messages.push(`${this.translate.instant('DuplicateAccountNumber')}`);
                      break;
                  case 'invalidIBANAccNoError':
                        messages.push(`${this.translate.instant('invalidIBANAccNoError')}`);
                        break;
                  case 'createLNButton':
                    messages.push(`errorCreateLNButton`);
                    break;
                  case 'expiredOtp':
                    messages.push(`${this.translate.instant('expiredOtp')}`);
                    break;
                  case 'orgLessThanChangeAmt':
                    messages.push(`${this.translate.instant('orgLessThanChangeAmt')}`);
                    break;
                  case 'transferExpiryDateLessThenOriginalexpiryDate':
                      messages.push(`${this.translate.instant('transferExpiryDateLessThenOriginalexpiryDate')}`);
                      break;
                  case 'assignmentAmtGreaterThanAvailableAmt':
                    messages.push(`${this.translate.instant('assignmentAmtGreaterThanAvailableAmt')}`);
                    break;
                  case 'guaranteeAmtGreaterThanLCAmt':
                    messages.push(`${this.translate.instant('guaranteeAmtGreaterThanLCAmt')}`);
                    break;
                  case 'guaranteeAmtGreaterThanLCAvailableAmt':
                    messages.push(`${this.translate.instant('guaranteeAmtGreaterThanLCAvailableAmt',
                      {maxAmt: this.errors.guaranteeAmtGreaterThanLCAvailableAmt.maxAmt})}`);
                    break;
                  case 'transferAmtGreaterThanAvailableAmt':
                    messages.push(`${this.translate.instant('transferAmtGreaterThanAvailableAmt')}`);
                    break;
                  case 'releaseAmtGreaterThanAvailableAmt':
                      messages.push(`${this.translate.instant('releaseAmtGreaterThanAvailableAmt')}`);
                      break;
                  case 'documentAmtGreaterThanAvailableAmt':
                      messages.push(`${this.translate.instant('documentAmtGreaterThanAvailableAmt')}`);
                      break;
                  case 'settlementAmtLessThanLCAmt':
                      messages.push(`${this.translate.instant('settlementAmtLessThanLCAmt')}`);
                      break;
                  case 'settlementAmtLessThanTnxAmt':
                      messages.push(`${this.translate.instant('settlementAmtLessThanTnxAmt')}`);
                      break;
                  case 'settlementAmtLessThanOutstandingAmt':
                      messages.push(`${this.translate.instant('settlementAmtLessThanOutstandingAmt')}`);
                      break;
                  case 'amountLengthGreaterThanMaxLength':
                    messages.push(`${this.translate.instant('amountLengthGreaterThanMaxLength')}`);
                    break;
                  case 'amountRangeError':
                    messages.push(`${this.translate.instant('amountRangeError', { min: this.errors.amountRangeError.min,
                      max: this.errors.amountRangeError.max })}`);
                    break;
                  case 'amountMaxRangeReached':
                    messages.push(`${this.translate.instant('amountMaxRangeReached', { range: this.LcConstant.amountMaximumRange })}`);
                    break;
                  case 'invalidAmount':
                    messages.push(`${this.translate.instant('invalidAmount')}`);
                    break;
                  case 'amountMaxLengthRangeReached':
                    messages.push(`${this.translate.instant('amountMaxLengthRangeReached', { currency: this.errors.amountMaxLengthRangeReached.currency, })}`);
                    break;
                  case 'decimalLengthRangeReached':
                    if(this.errors.decimalLengthRangeReached.decimalPoint === 0){
                      messages.push(`${this.translate.instant('zeroDecimalLengthRangeReached', { currency: this.errors.decimalLengthRangeReached.currency})}`);
                    }
                    else{
                      messages.push(`${this.translate.instant('decimalLengthRangeReached', { currency: this.errors.decimalLengthRangeReached.currency, allowedDecimalPoint: this.errors.decimalLengthRangeReached.allowedDecimalPoint})}`);
                    }
                    break;
                  case 'deductionsRangeReached':
                    messages.push(`${this.translate.instant('deductionsRangeReached')}`);
                    break;
                  case 'transferExpiryDateLessThanCurrentDate':
                    messages.push(`${this.translate.instant('transferExpiryDateLessThanCurrentDate')}`);
                    break;
                  case 'transferShipmentDateGreaterThanELShipmentDate':
                    messages.push(`${this.translate.instant('transferShipmentDateGreaterThanELShipmentDate')}`);
                    break;
                  case 'transferShipmentDateLessThanCurrentDate':
                    messages.push(`${this.translate.instant('transferShipmentDateLessThanCurrentDate')}`);
                    break;
                  case 'transferShipmentDateGreaterThanELExpiryDate':
                    messages.push(`${this.translate.instant('transferShipmentDateGreaterThanELExpiryDate')}`);
                    break;
                  case 'earlierDateGreaterThanExpiryDate':
                    messages.push(`${this.translate.instant('earlierDateGreaterThanExpiryDate')}`);
                    break;
                  case 'earlierDateGreaterThanLastDate':
                    messages.push(`${this.translate.instant('earlierDateGreaterThanLastDate')}`);
                    break;
                    case 'lastDateLesserThanEarlierDate':
                    messages.push(`${this.translate.instant('lastDateLesserThanEarlierDate')}`);
                    break;
                  case 'valueDateLessThanCurrentDate':
                    messages.push(`${this.translate.instant('valueDateLessThanCurrentDate')}`);
                    break;
                  case 'invalidDate':
                    messages.push(`${this.translate.instant('invalidDate')}`);
                    break;
                  case 'invalidAmt':
                    messages.push(`${this.translate.instant('invalidAmt', { amountField: this.params[FccGlobalConstant.LABEL] })}`);
                    break;
                  case 'startDaterangeError':
                    messages.push(this.errors.startDaterangeError);
                    break;
                  case 'rangeError':
                    messages.push(this.errors.rangeError);
                    break;
                  case 'dateFormatError':
                    messages.push(this.errors.dateFormatError);
                    break;
                  case 'endDaterangeError':
                    messages.push(this.errors.endDaterangeError);
                    break;
                  case 'requestedAmtExceeded':
                    messages.push('requestedAmtExceeded');
                    break;
                  case 'percentageExceeded':
                    messages.push('percentageExceeded');
                    break;
                  case 'amountCanNotBeZero':
                  messages.push(`${this.translate.instant('amountCanNotBeZero')}`);
                  break;
                  case 'settlementAmtLessThanOutstandingAmt':
                  messages.push(`${this.translate.instant('settlementAmtLessThanOutstandingAmt')}`);
                  break;
                  case 'productCutOffTime':
                  messages.push(`${this.translate.instant('productCutOffTime')}`);
                  break;
                  case 'effectiveDateSelection':
                  messages.push(`${this.translate.instant('effectiveDateSelection')}`);
                  break;
                  case 'backDatederror':
                  messages.push(`${this.translate.instant('backDatederror')}`);
                  break;
                  case 'futureDateerror':
                  messages.push(`${this.translate.instant('futureDateerror')}`);
                  break;
                  case 'maxAmtLimit':
                    messages.push(`${this.translate.instant('maxAmtLimit', { maxAmtLimit: this.errors.maxAmtLimit})}`);
                    break;
                  case 'percentCanNotBeZero':
                  messages.push('percentCanNotBeZero');
                  break;
                  case 'tfIssueDateExpiry':
                    messages.push('tfIssueDateExpiry');
                    break;
                  case 'percentNotNull':
                    messages.push('percentNotNull');
                    break;
                  case 'amountNotNull':
                  messages.push('amountNotNull');
                  break;
                  case 'wrongOldPassword':
                    messages.push('wrongOldPassword');
                  break;
                  case 'wrongNewPassword':
                    messages.push('wrongNewPassword');
                  break;
                  case 'samePreviousPassword':
                    messages.push('samePreviousPassword');
                  break;
                  case 'emailNotUnique':
                    messages.push('emailNotUnique');
                  break;
                  case 'nonZeroTenorValue':
                  messages.push(`${this.translate.instant('nonZeroTenorValue')}`);
                  break;
                  case 'duplicateTemplateName':
                  messages.push(`${this.translate.instant('duplicateTemplateName',
                                                 {templateName: this.errors.duplicateTemplateName.templateName})}`);
                  break;
                  case 'contractDateGreaterThanExpiryDate':
                    messages.push(`${this.translate.instant('contractDateGreaterThanExpiryDate')}`);
                    break;
                  case 'expiryDateGreaterThanContractDate':
                    messages.push(`${this.translate.instant('expiryDateGreaterThanContractDate')}`);
                    break;
                  case 'firstDateExpiryApplicationDateError':
                    messages.push(`${this.translate.instant('firstDateExpiryApplicationDateError')}`);
                    break;
                  case 'firstDateApplicationDateError':
                    messages.push(`${this.translate.instant('firstDateApplicationDateError')}`);
                    break;
                  case 'effectiveExpiryDateError':
                    messages.push(`${this.translate.instant('effectiveExpiryDateError')}`);
                    break;
                  case 'shipmentExpiryDateError':
                    messages.push(`${this.translate.instant('shipmentExpiryDateError')}`);
                    break;
                  case 'earliestShipmentDateError':
                    messages.push(`${this.translate.instant('earliestShipmentDateError')}`);
                    break;
                  case 'earliestShipmentDateExpiryError':
                    messages.push(`${this.translate.instant('earliestShipmentDateExpiryError')}`);
                    break;
                  case 'lastShipmentDateError':
                    messages.push(`${this.translate.instant('lastShipmentDateError')}`);
                    break;
                  case 'compareExpDateWithEarliestShipmentDate':
                    messages.push(`${this.translate.instant('compareExpDateWithEarliestShipmentDate')}`);
                    break;
                  case 'firstDateApplicationExtensionExpiryError':
                    messages.push(`${this.translate.instant('firstDateApplicationExtensionExpiryError')}`);
                    break;
                  case 'variationNumberDaysExpiryDateError':
                    messages.push(`${this.translate.instant('variationNumberDaysExpiryDateError')}`);
                    break;
                  case 'variationNumberDaysFinalExpiryDateError':
                    messages.push(`${this.translate.instant('variationNumberDaysFinalExpiryDateError')}`);
                    break;
                  case 'orderingAndTransfereeAccountNotBeSame':
                    messages.push(`${this.translate.instant('orderingAndTransfereeAccountNotBeSame')}`);
                    break;
                  case 'variationAmtGreaterThanBgAmt':
                    messages.push(`${this.translate.instant('variationAmtGreaterThanBgAmt')}`);
                    break;
                  case 'variationPctDecreasePatternError':
                    messages.push(`${this.translate.instant('variationPctDecreasePatternError')}`);
                    break;
                  case 'settlementAmtLessThanOrEqualToZero':
                    messages.push(`${this.translate.instant('settlementAmtLessThanOrEqualToZero')}`);
                    break;
                  case 'fieldCanNotBeZero':
                    messages.push(`${this.translate.instant('fieldCanNotBeZero')}`);
                    break;
                  case 'nonZeroFieldValue':
                    messages.push(`${this.translate.instant('nonZeroFieldValue', { field: this.params[FccGlobalConstant.LABEL]})}`);
                    break;
                  case 'startZeroFieldValue':
                    messages.push(`${this.translate.instant('startZeroFieldValue', { field: this.params[FccGlobalConstant.LABEL]})}`);
                    break;
                  case 'allowedNumberValues':
                    messages.push(`${this.translate.instant('allowedNumberValues', {
                      minValue: this.errors.allowedNumberValues.minValue,
                      maxValue: this.errors.allowedNumberValues.maxValue
                    })}`);
                    break;
                  case 'compareRenewalDateWithExpDate':
                    messages.push(`${this.translate.instant('compareRenewalDateWithExpDate')}`);
                    break;
                  case 'compareRenewalFinalDateWithExpDate':
                    messages.push(`${this.translate.instant('compareRenewalFinalDateWithExpDate')}`);
                    break;
                  case 'isEmptyExpDate':
                    messages.push(`${this.translate.instant('isEmptyExpDate')}`);
                    break;
                  case FccGlobalConstant.noAmountForBorrowerLimitError:
                    messages.push(`${this.translate.instant('noAmountForBorrowerLimitError')}`);
                    break;
                  case FccGlobalConstant.loanAmountTooBigThanBorrowerLimitAmtError:
                    messages.push(`${this.translate.instant('loanAmountTooBigThanBorrowerLimitAmtError',
                      {
                        cur: this.errors.loanAmountTooBigThanBorrowerLimitAmtError.cur,
                        amt: this.errors.loanAmountTooBigThanBorrowerLimitAmtError.amt
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.noAmountForRiskLimitError:
                    messages.push(`${this.translate.instant('noAmountForRiskLimitError')}`);
                    break;
                  case FccGlobalConstant.noAmountForSwingRiskLimitError:
                    messages.push(`${this.translate.instant('noAmountForSwingRiskLimitError')}`);
                    break;
                  case FccGlobalConstant.noAmountForSwinglineLimitError:
                    messages.push(`${this.translate.instant('noAmountForSwinglineLimitError')}`);
                    break;
                  case FccGlobalConstant.noAmountForSublimitRiskLimitError:
                    messages.push(`${this.translate.instant('noAmountForSublimitRiskLimitError')}`);
                    break;
                  case FccGlobalConstant.loanAmountTooBigThanBorrowerRiskTypeLimitAmtError:
                    messages.push(`${this.translate.instant('loanAmountTooBigThanBorrowerRiskTypeLimitAmtError',
                      {
                        cur: this.errors.loanAmountTooBigThanBorrowerRiskTypeLimitAmtError.cur,
                        amt: this.errors.loanAmountTooBigThanBorrowerRiskTypeLimitAmtError.amt
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.noAmountForLoanSublimitLimitError:
                    messages.push(`${this.translate.instant('noAmountForLoanSublimitLimitError')}`);
                    break;
                  case FccGlobalConstant.loanAmountTooBigLoanSublimitAmtError:
                    messages.push(`${this.translate.instant('loanAmountTooBigLoanSublimitAmtError',
                      {
                        cur: this.errors.loanAmountTooBigLoanSublimitAmtError.cur,
                        amt: this.errors.loanAmountTooBigLoanSublimitAmtError.amt
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanAmountTooBigThanSwinglineLimitAmtError:
                    messages.push(`${this.translate.instant('loanAmountTooBigThanSwinglineLimitAmtError',
                      {
                        cur: this.errors.loanAmountTooBigThanSwinglineLimitAmtError.cur,
                        amt: this.errors.loanAmountTooBigThanSwinglineLimitAmtError.amt
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanAmountTooBigThanSublimitRiskAmtError:
                    messages.push(`${this.translate.instant('loanAmountTooBigThanSublimitRiskAmtError',
                      {
                        cur: this.errors.loanAmountTooBigThanSublimitRiskAmtError.cur,
                        amt: this.errors.loanAmountTooBigThanSublimitRiskAmtError.amt
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.noAmountForCurrencyLimitError:
                    messages.push(`${this.translate.instant('noAmountForCurrencyLimitError',
                      {
                        cur: this.errors.noAmountForCurrencyLimitError.cur
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanAmountTooBigThanBorrowerCcyLimitAmtError:
                    messages.push(`${this.translate.instant('loanAmountTooBigThanBorrowerCcyLimitAmtError',
                      {
                        cur: this.errors.loanAmountTooBigThanBorrowerCcyLimitAmtError.cur,
                        amt: this.errors.loanAmountTooBigThanBorrowerCcyLimitAmtError.amt
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.facilityFullyDrawnError:
                    messages.push(`${this.translate.instant('facilityFullyDrawnError')}`);
                    break;
                  case FccGlobalConstant.loanAmountTooBigError:
                    messages.push(`${this.translate.instant('loanAmountTooBigError',
                      {
                        cur: this.errors.loanAmountTooBigError.cur,
                        amt: this.errors.loanAmountTooBigError.amt
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.swinglineLoanAmountTooBigError:
                    messages.push(`${this.translate.instant('swinglineLoanAmountTooBigError',
                      {
                        cur: this.errors.swinglineLoanAmountTooBigError.cur,
                        amt: this.errors.swinglineLoanAmountTooBigError.amt
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.facilityFullyDrawnErrorWithPend:
                    messages.push(`${this.translate.instant('facilityFullyDrawnErrorWithPend')}`);
                    break;
                  case FccGlobalConstant.loanAmountTooBigWithPendError:
                    messages.push(`${this.translate.instant('loanAmountTooBigWithPendError',
                      {
                        cur: this.errors.loanAmountTooBigWithPendError.cur,
                        amt: this.errors.loanAmountTooBigWithPendError.amt
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.commitmentScheduleFullyDrawnError:
                    messages.push(`${this.translate.instant('commitmentScheduleFullyDrawnError')}`);
                    break;
                  case FccGlobalConstant.commitmentScheduleAmountErrorForDrawdown:
                    messages.push(`${this.translate.instant('commitmentScheduleAmountErrorForDrawdown',
                      {
                        cur: this.errors.commitmentScheduleAmountErrorForDrawdown.cur,
                        amt: this.errors.commitmentScheduleAmountErrorForDrawdown.amt
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.defaultEffectiveDateErrorMsg:
                    messages.push(`${this.translate.instant('defaultEffectiveDateErrorMsg',
                      {
                        date: this.errors.defaultEffectiveDateErrorMsg.date
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.effectiveDateBusinessDayValidationErrorMsg:
                    messages.push(`${this.translate.instant('effectiveDateBusinessDayValidationErrorMsg',
                      {
                        date: this.errors.effectiveDateBusinessDayValidationErrorMsg.date
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.effectiveDateGreaterThanSystemDate:
                    messages.push(`${this.translate.instant('effectiveDateGreaterThanSystemDate',
                      {
                        date: this.errors.effectiveDateGreaterThanSystemDate.date
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanEffDateGreaterThanFacEffDateError:
                    messages.push(`${this.translate.instant('loanEffDateGreaterThanFacEffDateError',
                      {
                        date: this.errors.loanEffDateGreaterThanFacEffDateError.date,
                        faclityDate: this.errors.loanEffDateGreaterThanFacEffDateError.faclityDate
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanEffDateLessThanFacExpDateError:
                    messages.push(`${this.translate.instant('loanEffDateLessThanFacExpDateError',
                      {
                        date: this.errors.loanEffDateLessThanFacExpDateError.date,
                        expiryDate: this.errors.loanEffDateLessThanFacExpDateError.expiryDate
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanEffDateLessThanFacMatDateError:
                    messages.push(`${this.translate.instant('loanEffDateLessThanFacMatDateError',
                      {
                        date: this.errors.loanEffDateLessThanFacMatDateError.date,
                        maturityDate: this.errors.loanEffDateLessThanFacMatDateError.maturityDate
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanEffDateLessThanLoanMatDateError:
                    messages.push(`${this.translate.instant('loanEffDateLessThanLoanMatDateError',
                      {
                        date: this.errors.loanEffDateLessThanLoanMatDateError.date,
                        lnMaturityDate: this.errors.loanEffDateLessThanLoanMatDateError.lnMaturityDate
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanMatDateGreaterThanFacMatDateError:
                    messages.push(`${this.translate.instant('loanMatDateGreaterThanFacMatDateError',
                      {
                        date: this.errors.loanMatDateGreaterThanFacMatDateError.date,
                        facMatDate: this.errors.loanMatDateGreaterThanFacMatDateError.facMatDate
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanMatDateLessThanLoanEffDateError:
                    messages.push(`${this.translate.instant('loanMatDateLessThanLoanEffDateError',
                      {
                        date: this.errors.loanMatDateLessThanLoanEffDateError.date,
                        loanEffDate: this.errors.loanMatDateLessThanLoanEffDateError.loanEffDate
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanMatDateGreaterThanLoanRepDateError:
                    messages.push(`${this.translate.instant('loanMatDateGreaterThanLoanRepDateError',
                      {
                        date: this.errors.loanMatDateGreaterThanLoanRepDateError.date,
                        repricingDate: this.errors.loanMatDateGreaterThanLoanRepDateError.repricingDate
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanRepricingDateGreaterThanLoanEffDateError:
                    messages.push(`${this.translate.instant('loanRepricingDateGreaterThanLoanEffDateError',
                      {
                        date: this.errors.loanRepricingDateGreaterThanLoanEffDateError.date,
                        loanEffDate: this.errors.loanRepricingDateGreaterThanLoanEffDateError.loanEffDate
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanRepricingDateLessThanLoanMatDateError:
                    messages.push(`${this.translate.instant('loanRepricingDateLessThanLoanMatDateError',
                      {
                        date: this.errors.loanRepricingDateLessThanLoanMatDateError.date,
                        lnMatDate: this.errors.loanRepricingDateLessThanLoanMatDateError.lnMatDate
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.loanRepricingDateLessThanFacMatDateError:
                    messages.push(`${this.translate.instant('loanRepricingDateLessThanFacMatDateError',
                      {
                        date: this.errors.loanRepricingDateLessThanFacMatDateError.date,
                        facMatDate: this.errors.loanRepricingDateLessThanFacMatDateError.facMatDate
                      }
                    )}`);
                    break;
                  case FccGlobalConstant.selectRemittanceInstructionError:
                    messages.push(`${this.translate.instant('selectRemittanceInstructionError')}`);
                    break;
                  case 'repayAmtcannotBeZero':
                      messages.push(`${this.translate.instant('repayAmtcannotBeZero')}`);
                      break;
                  case 'repayAmtexceedsMax':
                        messages.push(`${this.translate.instant('repayAmtexceedsMax')}`);
                        break;
                  case 'duplicateCounterpartyAbbvName':
                        messages.push(`${this.translate.instant('duplicateCounterpartyAbbvName',
                        {abbvName: this.errors.duplicateCounterpartyAbbvName.abbvName})}`);
                        break;
                  case 'expiryDateLessEqualThanCurrentDate':
                        messages.push(`${this.translate.instant('expiryDateLessEqualThanCurrentDate')}`);
                        break;
                  case 'compareNewExpiryDateToOldExpiry':
                        messages.push(`${this.translate.instant('compareNewExpiryDateToOldExpiry')}`);
                        break;
                  case 'transportDocDateLessEqualThanCurrentDate':
                        messages.push(`${this.translate.instant('transportDocDateLessEqualThanCurrentDate')}`);
                        break;
                  case 'executionDateLessThanCurrentDate' :
                        messages.push(`${this.translate.instant('executionDateLessThanCurrentDate')}`);
                        break;
                  case 'requestDateLessThanCurrentDate' :
                        messages.push(`${this.translate.instant('requestDateLessThanCurrentDate')}`);
                        break;
                  case 'sumPercentageExceeded':
                        messages.push(`${this.translate.instant('PercentageSumGreater')}`);
                        break;
                  case 'feeCycleTableError':
                    messages.push(`${this.translate.instant('feeCycleTableError')}`);
                        break;
                  case 'rowCountExceeded':
                    messages.push(`${this.translate.instant('rowCountExceeded',
                    { maxRows: this.errors.rowCountExceeded.maxRows,
                      enteredRow: this.errors.rowCountExceeded.enteredRow})}`);
                    break;
                  case 'duplicatePhraseAbbvName':
                        messages.push(`${this.translate.instant('duplicatePhraseAbbvName')}`);
                        break;
                  case 'loanIncreaseAmountExceededlimit':
                        messages.push(`${this.translate.instant('loanIncreaseAmountExceededlimit',
                          {
                            cur: this.errors.loanIncreaseAmountExceededlimit.cur,
                            amt: this.errors.loanIncreaseAmountExceededlimit.amt
                          }
                        )}`);
                        break;
                    case 'loanIncreaseEffectiveDateValidation':
                          messages.push(`${this.translate.instant('loanIncreaseEffectiveDateValidation',
                            {
                              effectiveDate: this.errors.loanIncreaseEffectiveDateValidation.effectiveDate
                            }
                          )}`);
                          break;
                    case 'loanPaymentamountvalidation':
                           messages.push(`${this.translate.instant('loanPaymentamountvalidation')}`);
                           break;
                    case 'batchCustRefNumber':
                            messages.push(`${this.translate.instant('batchCustRefNumber')}`);
                            break;
                    case 'batchLEIRefNumber':
                            messages.push(`${this.translate.instant('batchLEIRefNumber')}`);
                            break;
                    case 'batchAmt':
                            messages.push(`${this.translate.instant('batchAmt')}`);
                            break;
                    case 'amountCanNotBeGreaterThanInterestDue':
                           messages.push(`${this.translate.instant('amountCanNotBeGreaterThanInterestDue')}`);
                           break;
                    case 'loanEffectiviedateWithMaturityDate':
                          messages.push(`${this.translate.instant('loanEffectiviedateWithMaturityDate',
                            {
                              effectiveDate: this.errors.loanEffectiviedateWithMaturityDate.effectiveDate,
                              maturityDate: this.errors.loanEffectiviedateWithMaturityDate.maturityDate
                            }
                          )}`);
                          break;
                    case 'loanEffectiviedateWithRepricingDate':
                          messages.push(`${this.translate.instant('loanEffectiviedateWithRepricingDate',
                          {
                            effectiveDate: this.errors.loanEffectiviedateWithRepricingDate.effectiveDate,
                            repricingDate: this.errors.loanEffectiviedateWithRepricingDate.repricingDate
                          }
                          )}`);
                          break;
                    case 'savBeneMessage':
                            messages.push(this.errors.savBeneMessage);
                            break;
                    case FccGlobalConstant.requestAmountExceeded:
                          messages.push(`${this.translate.instant('requestAmountExceeded',
                          {
                            cur: this.errors.requestAmountExceeded.cur,
                            amt: this.errors.requestAmountExceeded.amt
                          }
                          )}`);
                          break;
                    case 'noOfChequeBookMinErrMsg':
                          messages.push(this.errors.noOfChequeBookMinErrMsg);
                          break;
                    case 'noOfChequeBookMaxErrMsg':
                          messages.push(this.errors.noOfChequeBookMaxErrMsg);
                          break;
                    case 'invalidChequeNumber':
                          messages.push(`${this.translate.instant('invalidChequeNumber', { maxSize: this.errors.invalidChequeNumber.maxSize})}`);
                          break;
                   case 'invalidChequeCount':
                          messages.push(this.errors.invalidChequeCount);
                          break;
                   case 'duplicateChequeNum':
                          messages.push(this.errors.duplicateChequeNum);
                          break;
                  case 'chequeNumberFromErr':
                          messages.push(this.errors.chequeNumberFromErr);
                          break;
                  case 'invalidTenorYear':
                          messages.push(this.errors.invalidTenorYear);
                          break;
                  case 'invalidTenorMonth':
                          messages.push(this.errors.invalidTenorMonth);
                          break;
                  case 'invalidTenorDay':
                          messages.push(this.errors.invalidTenorDay);
                          break;
                  case FccGlobalConstant.loanAmountBiggerThanBorrowerLimit:
                          messages.push(`${this.translate.instant('loanAmountBiggerThanBorrowerLimit',
                          {
                            cur: this.errors.loanAmountBiggerThanBorrowerLimit.cur,
                            amt: this.errors.loanAmountBiggerThanBorrowerLimit.amt
                          }
                        )}`);
                          break;
                  case 'validEmailIDs':
                    messages.push(`${this.translate.instant('invalidEmailId')}`);
                    break;
                  case 'maxEmailIDs':
                    messages.push(`${this.translate.instant('maxEmailError')}`);
                    break;
                    case 'DailyLimit':
                      messages.push(`${this.translate.instant('DailyLimit', { Limit: this.errors.DailyLimit.Limit})}`);
                      break;  
                  case 'leiCodeError':
                    messages.push(`${this.translate.instant('leiCodeError')}`);
                    break;
                  case 'invalidDates':
                    messages.push(`${this.translate.instant('invalidDates')}`);
                    break;
                  case 'invalidThreshold':
                    messages.push(`${this.translate.instant('invalidThreshold', {
                      days: sessionStorage.getItem('thresholdSearchPeriod')
                    })}`);
                    break;
                  case 'exchangeRateNotAvailable':
                    messages.push(`${this.translate.instant('exchangeRateNotAvailable')}`);
                    break;
                  case FccGlobalConstant.requestAmountExceeded:
                    messages.push(`${this.translate.instant('requestAmountExceeded',
                      {
                        cur: this.errors.requestAmountExceeded.cur,
                        amt: this.errors.requestAmountExceeded.amt
                      }
                    )}`);
                    break;
                    case 'totalAmountMaxLimit':
                      messages.push(`${this.translate.instant('totalAmountMaxLimit',
                        {
                          field: this.errors.totalAmountMaxLimit.field,
                          maxAmount: this.errors.totalAmountMaxLimit.maxAmount
                        }
                      )}`);
                    break;
                    case 'bulkBankError':
                    messages.push(this.errors.bulkBankError);
                    break;
                    case 'pabMaxAmountValidation':
                      messages.push(`${this.translate.instant('pabMaxAmountValidation',
                        {
                          currency: this.errors.pabMaxAmountValidation.currency,
                          maxAmount: this.errors.pabMaxAmountValidation.maxAmount
                        }
                      )}`);
                    break;
                    case 'exchangeRateNotFound':
                      messages.push(`${this.translate.instant('exchangeRateNotFound',
                        {
                          currency: this.errors.exchangeRateNotFound.currency
                        }
                      )}`);
                    break;
                  case 'adhocBeneNotAllowed':
                    messages.push(`${this.translate.instant('adhocBeneNotAllowed')}`);
                  break;
                  case 'invalidFXamount':
                    messages.push(`${this.translate.instant('invalidFXamount')}`);
                  break;
                  case 'invalidBeneNameField':
                    messages.push(`${this.translate.instant('invalidBeneNameField')}`);
                  break;
                  case 'mobileMinError':
                    messages.push(`${this.translate.instant('mobileMinError', { min: this.errors.mobileMinError.min})}`);
                    break;
                  case 'IFSCfourChar':
                    messages.push(`${this.translate.instant('IFSCfourChar')}`);
                    break;
                  default:
                    if (Object.keys(this.errors).length === 1) {
                      messages.push(`${this.translate.instant('invalidField', { field: this.params[FccGlobalConstant.LABEL],
                                      error: errorName })}`);
                    }
              }
          }
      }
      return messages;
  }
}

export abstract class FCCMVFormControl extends FCCFormControl {
  options: { value: string, label: string, id?: string, readonly?: boolean,
            checked?: boolean, layout_Class?: string, valueStyleClass?: string }[] = [];
  sectionHeader: string;

  constructor(fieldType: string , id: string, translate: TranslateService, value: any,  params: {} = {}, pdfParams?: {}) {
      super(fieldType, id, translate, value,  params, pdfParams);
      this.options = params[FccGlobalConstant.OPTIONS];
      this.sectionHeader = params[FccGlobalConstant.SECTION_HEADER];
  }

  updateOptions() {
    this.options = this.params[FccGlobalConstant.OPTIONS];
  }
}

export abstract class FCCLayoutControl extends FCCFormControl {
    constructor(fieldType: string , id: string, translate: TranslateService, params: {} = {}) {
      super(fieldType, id, translate, null,  params);
  }
}

export abstract class FCCButtonControl extends FCCFormControl {
  constructor(fieldType: string , id: string, translate: TranslateService, params: {} = {}) {
    super(fieldType, id, translate, null, params);
}
}

export class FCCFormGroup extends UntypedFormGroup {
  private formMode;
  pdfParams;
  applicableSections;
  dynamicRenderCriteria; // Used to dynamically render the form in view mode.
  public MODE_VIEW = 'view';
  public MODE_EDIT = 'edit';
  public MODE_DRAFT = 'draft';
  public MODE_AMENDMENT = 'amend';
  public TEMPLATE = 'TEMPLATE';
  constructor(control: {[key: string]: AbstractControl}, pdfParams?: {}, applicableSections?: {},  dynamicRenderCriteria?: {}) {
      super(control);
      this.formMode = this.MODE_EDIT;
      this.pdfParams = pdfParams;
      this.applicableSections = applicableSections;
      this.dynamicRenderCriteria = dynamicRenderCriteria;
  }

  get productControls(): FCCFormControl[] {
    return Object.keys(this.controls)
      .map(k => {
        if (this.controls[k] instanceof FCCFormControl) {
          return this.controls[k] as FCCFormControl;
        }
        if (this.controls[k] instanceof FCCFormGroup) {

        }
      });
  }

  setFormMode(mode: string) {
    this.formMode = mode;
    Object.keys(this.controls).forEach(ele => {
      (this.controls[ele] as FCCFormControl).updateParams(mode);
    });
  }
  updateParams(mode: string) {
    Object.keys(this.controls).forEach(ele => {
      if ( mode === 'view') {
        (this.controls[ele] as FCCFormControl).viewParams = Object.assign( (this.controls[ele] as FCCFormControl).viewParams ,
         (this.controls[ele] as FCCFormControl).params );
      }
      // else if( mode === 'pdf'){
      //   this.pdfParams= Object.assign(this.pdfParams, this.params);
      // }
    });



  }
  getFormMode(): string {
    return this.formMode;
  }

  addFCCValidators(key: string , validators: any , mode: number ): void {
    const field = (this.get(key) as UntypedFormControl);
    try {
      if (mode === 0) {
        field.setValidators(Validators.compose([field.validator, validators]));
      } else if (mode === 1) {
        field.setValidators(validators);
      }
    } catch (error) {
      // do nothing
    }
  }

  replaceControl(key: string , newControl: FCCFormControl): void {
    let prevKey = '';
    const keyArray = Object.keys(this.controls);
    for (const value of keyArray) {
      const ele = value;
      if (ele === key) {
        break;
      }
      prevKey = ele;
    }
    this.removeControl(key);
    this.addControlAtPos(key, newControl, prevKey);
  }

  addControlAtPos(key: string , control: FCCFormControl, insertId: string): void {
    // const formArr = <FormArray>this.controls.;
    // this.insert(index, control1);
    // this.controls.

    /*

    let newControls = {};

    let keys=Object.keys(this.controls);

    for(i=0;i<Object.keys(this.controls).s;i++)
    this.controls.forEach(c => c.getValidationMessages()
    .forEach(m => messages.push(m)));

    controls: {
      [key: string]: AbstractControl;
  };*/

  const fg = new UntypedFormGroup({});
  Object.keys(this.controls).forEach(ele => {
    fg.addControl(ele, this.controls[ele]);
    if (ele === insertId) {
      fg.addControl(key, control);
    }
  });
  this.controls = fg.controls;

  }
  addControlUnderGroup(key: string , control: any, insertId: string): void {
  const fg = new UntypedFormGroup({});
  Object.keys(this.controls).forEach(ele => {
    fg.addControl(ele, this.controls[ele]);
    if (ele === insertId) {
      fg.addControl(key, control);
    }
  });
  this.controls = fg.controls;

  }
  getFormValidationMessages(form: any): string[] {
      const messages: string[] = [];
      this.productControls.forEach(c => c.getValidationMessages()
          .forEach(m => messages.push(m)));
      return messages;
  }

  updateLabel(key: string, newLabel: string): void {
   const control = (this.get(key) as FCCFormControl);
   control.params[FccGlobalConstant.LABEL] = newLabel;
  }

  udpateStyle(key: string, newStyle: string[], mode: number): void {
    const control = (this.get(key) as FCCFormControl);
    if ( mode === 0) {
      if (control.params[FccGlobalConstant.STYLECLASS]  === undefined || control.params[FccGlobalConstant.STYLECLASS] .length <= 0 ) {
        control.params[FccGlobalConstant.STYLECLASS]  = newStyle;
      } else {
        control.params[FccGlobalConstant.STYLECLASS]  = control.params[FccGlobalConstant.STYLECLASS] .concat(newStyle);
      }
    } else if (mode === 1) {
      control.params[FccGlobalConstant.STYLECLASS]  = newStyle;
    }
   }

  isChecked(value: string): string {
      if (value.toLowerCase() === 'true' || value === 'T' || value === 'Y'  ) {
        return 'true';
      } else {
        return '';
      }
  }
}


