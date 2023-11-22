import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { CommonService } from './../../../../../common/services/common.service';
import { Injectable } from '@angular/core';
import { Validators, AbstractControl } from '@angular/forms';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { effectiveExpiryDateError, firstDateApplicationDateError, firstDateApplicationExtensionExpiryError, firstDateExpiryApplicationDateError, shipmentExpiryDateError, validateVariationAmount, validateVariationPercentForDecrease, variationNumberDaysExpiryDateError, variationNumberDaysFinalExpiryDateError, earliestShipmentDateError, earliestShipmentDateExpiryError, lastShipmentDateError } from '../validators/ui-validators';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { IrregularIncreaseDecrease } from '../model/irregular-increase-decrease.model';
import { ProductStateService } from '../../../lc/common/services/product-state.service';



@Injectable({ providedIn: 'root' })
export class UiService {

  finalExpiryDate: Date;
  // extensionDetailsForm: FCCFormGroup = this.productStateService.getSectionData(FccGlobalConstant.UI_EXTENSION_DETAILS);
  option: string;
  oldPurposeVal: string;
  public isMasterRequired = false;

  getOption(): string {
    return this.option;
  }

  setOption(option: string) {
    this.option = option;
  }

  public setOldPurposeVal(purposeVal) {
    this.oldPurposeVal = purposeVal;
  }

  public getOldPurposeVal(): any {
    return this.oldPurposeVal ;
  }

  constructor(protected commonService: CommonService, protected datePipe: DatePipe, protected translateService: TranslateService,
              protected productStateService: ProductStateService) { }


  setBgFirstDateValidator(firstDate, expiryDate, extsnExiryDate, bgVariationFirstDateField: AbstractControl) {
    const currentDate = new Date();

    expiryDate = (expiryDate !== '' && expiryDate !== null && expiryDate !== undefined) ?
    `${expiryDate.getDate()}/${(expiryDate.getMonth() + 1)}/${expiryDate.getFullYear()}` : '';
    expiryDate = (expiryDate !== '') ? this.commonService.convertToDateFormat(expiryDate) : '';

    extsnExiryDate = (extsnExiryDate !== '' && extsnExiryDate !== null && extsnExiryDate !== undefined) ?
     `${extsnExiryDate.getDate()}/${(extsnExiryDate.getMonth() + 1)}/${extsnExiryDate.getFullYear()}` : '';
    extsnExiryDate = (extsnExiryDate !== '') ? this.commonService.convertToDateFormat(extsnExiryDate) : '';

    if ((expiryDate && (expiryDate === null || expiryDate.value === '' || expiryDate === undefined))
    && (extsnExiryDate && (extsnExiryDate === null || extsnExiryDate.value === ''
    || extsnExiryDate === undefined))) {
        if ((firstDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0) )) {
          bgVariationFirstDateField.setValidators([firstDateApplicationDateError]);
          bgVariationFirstDateField.updateValueAndValidity();
        } else {
          bgVariationFirstDateField.clearValidators();
          bgVariationFirstDateField.updateValueAndValidity();
        }
    } else if (extsnExiryDate !== '' && firstDate !== '') {
      if ((firstDate < currentDate.setHours(0, 0, 0, 0) || firstDate > extsnExiryDate)) {
        bgVariationFirstDateField.setValidators([firstDateApplicationExtensionExpiryError]);
        bgVariationFirstDateField.updateValueAndValidity();
      } else {
        bgVariationFirstDateField.clearValidators();
        bgVariationFirstDateField.updateValueAndValidity();
      }
    } else if (expiryDate !== '' && firstDate !== '') {
      if ((firstDate < currentDate.setHours(0, 0, 0, 0) || firstDate > expiryDate)) {
        bgVariationFirstDateField.setValidators([firstDateExpiryApplicationDateError]);
        bgVariationFirstDateField.updateValueAndValidity();
      } else {
        bgVariationFirstDateField.clearValidators();
        bgVariationFirstDateField.updateValueAndValidity();
      }
    }
  }

  validateBgVariationDaysNotice(bgAdviseDaysPriorNbField: AbstractControl, bgVariationFirstDateField: AbstractControl ,
                                expiryDate, extsnExiryDate) {
    let dateAfterAdd;
    const daysNumber = bgAdviseDaysPriorNbField.value;
    let firstDate = bgVariationFirstDateField.value;
    const days = parseInt(daysNumber, 0);
    dateAfterAdd = this.datePipe.transform(new Date().setDate(new Date().getDate() + days),
    FccGlobalConstant.DATE_FORMAT_1);
    firstDate = `${firstDate.getDate()}/${(firstDate.getMonth() + 1)}/${firstDate.getFullYear()}`;
    firstDate = (firstDate !== '' && firstDate !== null) ? this.commonService.convertToDateFormat(firstDate) : '';
    dateAfterAdd = (dateAfterAdd !== '' && dateAfterAdd !== null) ? this.commonService.convertToDateFormat(dateAfterAdd) : '';

    expiryDate = (expiryDate !== '' && expiryDate !== null && expiryDate !== undefined) ?
    `${expiryDate.getDate()}/${(expiryDate.getMonth() + 1)}/${expiryDate.getFullYear()}` : '';
    expiryDate = (expiryDate !== '') ? this.commonService.convertToDateFormat(expiryDate) : '';

    extsnExiryDate = (extsnExiryDate !== '' && extsnExiryDate !== null && extsnExiryDate !== undefined) ?
     `${extsnExiryDate.getDate()}/${(extsnExiryDate.getMonth() + 1)}/${extsnExiryDate.getFullYear()}` : '';
    extsnExiryDate = (extsnExiryDate !== '') ? this.commonService.convertToDateFormat(extsnExiryDate) : '';


    if (firstDate !== '' && dateAfterAdd.setHours(0, 0, 0, 0) > firstDate.setHours(0, 0, 0, 0)) {
      if (expiryDate !== '') {
      bgAdviseDaysPriorNbField.setValidators([variationNumberDaysExpiryDateError]);
      } else if (extsnExiryDate !== '') {
      bgAdviseDaysPriorNbField.setValidators([variationNumberDaysFinalExpiryDateError]);
      }
      bgAdviseDaysPriorNbField.updateValueAndValidity();
    } else {
      bgAdviseDaysPriorNbField.clearValidators();
      bgAdviseDaysPriorNbField.updateValueAndValidity();
    }
  }

  calculateVariationPercentage(amt: string, variationAmount: string): string {
    const amtNumber = parseFloat(this.commonService.getNumberWithoutLanguageFormatting(amt));
    const variationAmountNumber = parseFloat(variationAmount);
    const variationPercent = Math.round((Number(variationAmountNumber) * FccGlobalConstant.LENGTH_100) / amtNumber);
    return variationPercent.toString();
  }

  calculateVariationAmt(amt: string , variationPercent: string): string {
    const amtNumber = parseFloat(this.commonService.getNumberWithoutLanguageFormatting(amt));
    const variationPercentNumber = parseFloat(variationPercent);
    const variationAmount = Math.round(variationPercentNumber / FccGlobalConstant.LENGTH_100 * amtNumber);
    return variationAmount.toString();
  }

  buildRegex(pattern): any {
    let regexStr = '';
    if (pattern.charAt(0) !== '^') {
      regexStr += '^';
      regexStr += pattern;
    }
    if (pattern.charAt(pattern.length - 1) !== '$') {
      regexStr += '$';
    }
    const patternRegex = new RegExp(regexStr);
    return patternRegex;
  }
  // method to validate Increase/Decrease Amount field. Throw error if Amount is greater than tnx Amt
  // For decrease operation, the decrease amount should be less than the undertaking amount.
  // If greater or equal, then the bg amt will become negative value.
  validateVariationAmount(operationType: string, variationAmtField: AbstractControl, amt: string) {
    const variationAmt = variationAmtField.value;
    if (variationAmt !== undefined && amt !== undefined && variationAmt !== '' && amt !== '') {
      variationAmtField.clearValidators();
      variationAmtField.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if (!variationAmtField.invalid && operationType === FccGlobalConstant.VAR_DECREASE_OPERATION) {
        const varAmtNumber = parseFloat(variationAmt);
        const tnxAmtNumber = parseFloat(this.commonService.getNumberWithoutLanguageFormatting(amt));
        if (varAmtNumber > tnxAmtNumber) {
          variationAmtField.setValidators([validateVariationAmount]);
        } else {
          variationAmtField.clearValidators();
          variationAmtField.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        }
      }
      variationAmtField.updateValueAndValidity();
    }
  }

// method to validate Increase/Decrease percentage field. Throw error if variation percent is greater than 100
  validateVariationPercent(operationType: string, variationPctField: AbstractControl) {
    const variationPct = variationPctField.value;
    const variationPctNumber = parseFloat(variationPct);
    if (variationPct !== undefined && variationPct !== '') {
        variationPctField.clearValidators();
        variationPctField.setValidators([Validators.pattern(FccGlobalConstant.numberPattern)]);
        if (!variationPctField.invalid && operationType === FccGlobalConstant.VAR_DECREASE_OPERATION) {
        const pctPatternRegex = this.buildRegex(FccGlobalConstant.percentagePattern);
        if (pctPatternRegex.test(variationPctNumber)) {
          variationPctField.clearValidators();
          variationPctField.setValidators([Validators.pattern(FccGlobalConstant.numberPattern)]);
        } else {
          variationPctField.setValidators([validateVariationPercentForDecrease]);
        }
      }
        variationPctField.updateValueAndValidity();

    }
  }

  calculateAndValidateTotalVariation(irregularVariationList: IrregularIncreaseDecrease [], amt: string,
                                     variationErrorField: AbstractControl) {

    let totalVarPct = 0;
    let totalVarAmt = 0;
    let operationType;
    for (let i = 0; i < irregularVariationList.length; i++) {
      const irregularVariationDetails = irregularVariationList[i];
      operationType = irregularVariationDetails.operationType;
      const percent = irregularVariationDetails.variationPct;
      const amount = irregularVariationDetails.variationAmt;
      if (operationType === FccGlobalConstant.VAR_DECREASE_OPERATION) {
        totalVarPct += parseFloat(percent);
        totalVarAmt += parseFloat(amount);
      }
    }
    const amtNumber = parseFloat(this.commonService.getNumberWithoutLanguageFormatting(amt));
    if (totalVarPct > FccGlobalConstant.NUMBER_HUNDRED || totalVarAmt > amtNumber) {
      const errorMsg = `${this.translateService.instant('invalidVariationError')}`;
      variationErrorField[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = errorMsg;
      variationErrorField[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    } else {
      variationErrorField[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    }

  calculateFinalExpiryDate() {
    const flag = false;
    if (this.getBgRenewalType() !== '' && this.getBgRenewalType() !== null
    && this.getBgRenewOnCode() !== '' && this.getBgRenewOnCode() !== null
    && this.getBgRenewForNb() !== '' && this.getBgRenewForNb() !== null
    && this.getBgRenewForPeriod() !== '' && this.getBgRenewForPeriod() !== null
    && this.getBgNumOfRenewals() !== '' && this.getBgNumOfRenewals() !== null) {
      if (this.getBgRenewalType() === '01') {
        const expDate = this.getBgExpDate();
        const renewalCalendarDate = this.getBgRenewalCalendarDate();
        const extensionOnCode = this.getBgRenewOnCode();
        const numOfRenewals = this.getBgNumOfRenewals();
        const renewalInterval = this.getBgRenewForNb();
        const renewalIntervalUnit = this.getBgRenewForPeriod();
        this.calculateRegularExtFinalExpiryDate(expDate, renewalCalendarDate, extensionOnCode, numOfRenewals,
          renewalInterval, renewalIntervalUnit, flag);
      }
    }
  }

  calculateRegularExtFinalExpiryDate(expDate, renewalCalendarDate, extensionOnCode, numOfRenewals, renewalInterval,
                                     renewalIntervalUnit, flag) {
    let renewCalendardateObject;
    let extensionFinalDate;
    let finalExpiryRenewalDate;
    const weekDay = 7;
    const totalRenewalInterval = numOfRenewals * renewalInterval;
    if (extensionOnCode === '02' && renewalCalendarDate !== '' && renewalCalendarDate != null) {
        renewCalendardateObject = renewalCalendarDate;
        extensionFinalDate = new Date(renewCalendardateObject);
    } else if (extensionOnCode === '01' && expDate !== '' && expDate != null) {
        renewCalendardateObject = expDate;
        extensionFinalDate = new Date(renewCalendardateObject);
    }

    if (numOfRenewals && numOfRenewals != null && renewalInterval && renewalInterval != null
          && renewalIntervalUnit && renewalIntervalUnit !== '' && renewalIntervalUnit != null && extensionFinalDate !== undefined) {

        switch (renewalIntervalUnit) {
          case 'D':
            finalExpiryRenewalDate = new Date(
              extensionFinalDate.setDate(
                renewCalendardateObject.getDate() + totalRenewalInterval
              )
            );
            break;
          case 'W':
            finalExpiryRenewalDate = new Date(
              extensionFinalDate.setDate(
                renewCalendardateObject.getDate() + weekDay * totalRenewalInterval
              )
            );
            break;
          case 'M':
            finalExpiryRenewalDate = new Date(
              extensionFinalDate.setMonth(
                renewCalendardateObject.getMonth() + totalRenewalInterval
              )
            );
            break;
          case 'Y':
            finalExpiryRenewalDate = new Date(
              extensionFinalDate.setFullYear(
                renewCalendardateObject.getFullYear() + totalRenewalInterval
              )
            );
            break;
          default:
            break;
        }
        if (this.getBgRenewalType() === '01' && flag === false) {
          this.setFormatFinalExpiryDate(finalExpiryRenewalDate, renewalIntervalUnit,
          this.getBgFinalExpiryDateField());
        }
        if (this.getCuRenewalType() === '01' && flag === true) {
          this.setCuFormatFinalExpiryDate(finalExpiryRenewalDate, renewalIntervalUnit,
          this.getCuFinalExpiryDateField());
        }
      }
  }

  setFormatFinalExpiryDate(finalExpiryRenewalDate, renewalIntervalUnit, bgFinalExpiryDate: AbstractControl) {
    this.finalExpiryDate = finalExpiryRenewalDate;
    // this.checkForMonthEnd(finalExpiryRenewalDate, renewalIntervalUnit);
    bgFinalExpiryDate.patchValue(this.finalExpiryDate);
    bgFinalExpiryDate[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    bgFinalExpiryDate.updateValueAndValidity();
  }

  setCuFormatFinalExpiryDate(finalExpiryRenewalDate, renewalIntervalUnit, cuFinalExpiryDate: AbstractControl) {
    this.finalExpiryDate = finalExpiryRenewalDate;
    // this.checkForMonthEnd(finalExpiryRenewalDate, renewalIntervalUnit);
    cuFinalExpiryDate.patchValue(this.finalExpiryDate);
    cuFinalExpiryDate[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    cuFinalExpiryDate.updateValueAndValidity();
  }

  checkForMonthEnd(finalExpiryRenewalDate, renewalIntervalUnit) {
    let expDate;
    if (renewalIntervalUnit === 'M') {
      const datePartsForFinalExpDate = finalExpiryRenewalDate.split('/');
      const finalExpDate = new Date(+datePartsForFinalExpDate[2],
        +datePartsForFinalExpDate[1] - 1, +datePartsForFinalExpDate[0]);
      if (this.getBgRenewalType() === '01') {
        expDate = this.getBgExpDate();
      }
      if (this.getCuRenewalType() === '01') {
        expDate = this.getCuExpDate();
      }
      const datePartsForExpDate = expDate.split('/');
      const strExpDate = new Date(+datePartsForExpDate[2], +datePartsForExpDate[1] - 1, +datePartsForExpDate[0]);
      // Get the difference between the calculated date and expiry date and check if it has crossed the expected date
      if (this.getBgRenewalType() === '01' && this.getDifferenceInMonths(strExpDate, finalExpDate) >=
      (+this.getBgRenewForNb() + 1 )) {
      const finalExpDateYear = finalExpDate.getFullYear();
      const finalExpDateMonth = finalExpDate.getMonth();
      this.finalExpiryDate = new Date(finalExpDateYear, finalExpDateMonth, 0);
      }
      if (this.getCuRenewalType() === '01' && this.getDifferenceInMonths(strExpDate, finalExpDate) >=
      (+this.getCuRenewForNb() + 1 )) {
      const finalExpDateYear = finalExpDate.getFullYear();
      const finalExpDateMonth = finalExpDate.getMonth();
      this.finalExpiryDate = new Date(finalExpDateYear, finalExpDateMonth, 0);
      }
  }
  }

  getDifferenceInMonths(d1, d2) {
    const d1Y = d1.getFullYear();
    const d2Y = d2.getFullYear();
    const d1M = d1.getMonth();
    const d2M = d2.getMonth();
    return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
  }

  getBgCurCode(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      return sectionForm.controls.uiAmountChargeDetails.get(FccGlobalConstant.BG_CUR_CODE).value;
    } else if (sectionForm.controls.uiAmountChargeDetails.get(FccGlobalConstant.BG_CUR_CODE) &&
    this.commonService.isNonEmptyValue(sectionForm.controls.uiAmountChargeDetails.get(FccGlobalConstant.BG_CUR_CODE).value) &&
    this.commonService.isNonEmptyValue(sectionForm.controls.uiAmountChargeDetails.get(FccGlobalConstant.BG_CUR_CODE).value.value) &&
    sectionForm.controls.uiAmountChargeDetails.get(FccGlobalConstant.BG_CUR_CODE).value.value !== '') {
      return sectionForm.controls.uiAmountChargeDetails.get(FccGlobalConstant.BG_CUR_CODE).value.value;
    } else if (sectionForm.controls.uiAmountChargeDetails.get(FccGlobalConstant.BG_CUR_CODE) &&
    this.commonService.isNonEmptyValue(sectionForm.controls.uiAmountChargeDetails.get(FccGlobalConstant.BG_CUR_CODE).value) &&
    this.commonService.isNonEmptyValue(sectionForm.controls.uiAmountChargeDetails.get(FccGlobalConstant.BG_CUR_CODE).value.currencyCode) &&
    sectionForm.controls.uiAmountChargeDetails.get(FccGlobalConstant.BG_CUR_CODE).value.currencyCode !== '') {
      return sectionForm.controls.uiAmountChargeDetails.get(FccGlobalConstant.BG_CUR_CODE).value.currencyCode;
    }
  }

  getBgAmt(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiAmountChargeDetails.get('bgAmt').value;
  }

  getBgExpDate(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiTypeAndExpiry.get('bgExpDate').value;
  }

  getBgRenewalType(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiExtensionDetails.get('bgRenewalType').value;
  }

  getBgRenewalCalendarDate(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiExtensionDetails.get('bgRenewalCalendarDate').value;
  }

  getBgRenewOnCode(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiExtensionDetails.get('bgRenewOnCode').value;
  }

  getBgNumOfRenewals(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiExtensionDetails.get('bgRollingRenewalNb').value;
  }

  getBgRenewForNb(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiExtensionDetails.get('bgRenewForNb').value;
  }

  getBgRenewForPeriod(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiExtensionDetails.get('bgRenewForPeriod').value;
  }

  getBgFinalExpiryDate(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiExtensionDetails.get('bgFinalExpiryDate').value;
  }

  getBgFinalExpiryDateField(): AbstractControl {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiExtensionDetails.get('bgFinalExpiryDate');
  }

  getBgRollingRenewForNb(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiExtensionDetails.get('bgRollingRenewForNb').value;
  }

  getBgRollingRenewForPeriod(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiExtensionDetails.get('bgRollingRenewForPeriod').value;
  }

  getCuExpDate(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuGeneralDetails.get('cuExpDate').value;
  }

  getCuSubProdCode(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuGeneralDetails.get('cuSubProductCode').value;
  }

  getConfirmationOptions(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    if (sectionForm.controls.uiCuGeneralDetails.get('confirmationOptions')) {
      return sectionForm.controls.uiCuGeneralDetails.get('confirmationOptions').value;
    } else {
      return null;
    }
  }

  getCuRenewalType(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    if (sectionForm.controls.uiCuExtensionDetails.get('cuRenewalType') &&
    this.commonService.isNonEmptyValue(sectionForm.controls.uiCuExtensionDetails.get('cuRenewalType').value))
    {
      return sectionForm.controls.uiCuExtensionDetails.get('cuRenewalType').value;
    }
  }

  getCuRenewalCalendarDate(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuExtensionDetails.get('cuRenewalCalendarDate').value;
  }

  getCuRenewOnCode(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuExtensionDetails.get('cuRenewOnCode').value;
  }

  getCuNumOfRenewals(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuExtensionDetails.get('cuRollingRenewalNb').value;
  }

  getCuRenewForNb(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuExtensionDetails.get('cuRenewForNb').value;
  }

  getCuRenewForPeriod(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuExtensionDetails.get('cuRenewForPeriod').value;
  }

  getCuFinalExpiryDate(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuExtensionDetails.get('cuFinalExpiryDate').value;
  }

  getCuFinalExpiryDateField(): AbstractControl {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuExtensionDetails.get('cuFinalExpiryDate');
  }

  getCuRollingRenewForNb(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuExtensionDetails.get('cuRollingRenewForNb').value;
  }

  getCuRollingRenewForPeriod(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuExtensionDetails.get('cuRollingRenewForPeriod').value;
  }

  getCuCurCode(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      return sectionForm.controls.uiCuAmountChargeDetails.get('cuCurCode').value;
    } else {
      return sectionForm.controls.uiCuAmountChargeDetails.get('cuCurCode').value.currencyCode;
    }
  }

  getCuAmt(): string {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    return sectionForm.controls.uiCuAmountChargeDetails.get('cuAmt').value;
  }

  checkRollingExtFinalExpiryDate() {
    const flag = false;
    if (this.getBgRenewalType() !== '' && this.getBgRenewalType() !== null
    && this.getBgRenewOnCode() !== '' && this.getBgRenewOnCode() !== null
    && this.getBgRenewForNb() !== '' && this.getBgRenewForNb() !== null
    && this.getBgRenewForPeriod() !== '' && this.getBgRenewForPeriod() !== null
    && this.getBgNumOfRenewals() !== '' && this.getBgNumOfRenewals() !== null) {
      if (this.getBgRenewalType() === '02') {
        const expDate = this.getBgExpDate();
        const renewalCalendarDate = this.getBgRenewalCalendarDate();
        const extensionOnCode = this.getBgRenewOnCode();
        const numOfRenewals = this.getBgNumOfRenewals();
        const renewalInterval = this.getBgRenewForNb();
        const renewalIntervalUnit = this.getBgRenewForPeriod();
        const rollingRenewalInterval = this.getBgRollingRenewForNb();
        const rollingRenewalIntervalUnit = this.getBgRollingRenewForPeriod();
        this.calculateRollingExtFinalExpiryDate(expDate, renewalCalendarDate, extensionOnCode, numOfRenewals,
          renewalInterval, renewalIntervalUnit, rollingRenewalInterval, rollingRenewalIntervalUnit, flag);
      }
    }
  }
  cuRollingExtFinalExpiryDate() {
    const flag = true;
    if (this.getCuRenewalType() !== '' && this.getCuRenewalType() !== null
    && this.getCuRenewOnCode() !== '' && this.getCuRenewOnCode() !== null
    && this.getCuRenewForNb() !== '' && this.getCuRenewForNb() !== null
    && this.getCuRenewForPeriod() !== '' && this.getCuRenewForPeriod() !== null
    && this.getCuNumOfRenewals() !== '' && this.getCuNumOfRenewals() !== null) {
      if (this.getCuRenewalType() === '02') {
        const expDate = this.getCuExpDate();
        const renewalCalendarDate = this.getCuRenewalCalendarDate();
        const constextensionOnCode = this.getCuRenewOnCode();
        const numOfRenewals = this.getCuNumOfRenewals();
        const renewalInterval = this.getCuRenewForNb();
        const renewalIntervalUnit = this.getCuRenewForPeriod();
        const rollingRenewalInterval = this.getCuRollingRenewForNb();
        const rollingRenewalIntervalUnit = this.getCuRollingRenewForPeriod();

        this.calculateRollingExtFinalExpiryDate(expDate, renewalCalendarDate, constextensionOnCode, numOfRenewals,
          renewalInterval, renewalIntervalUnit, rollingRenewalInterval, rollingRenewalIntervalUnit, flag );

      }
    }
  }

  calculateRollingExtFinalExpiryDate(expDate, renewalCalendarDate, extensionOnCode, numOfRenewals, renewalInterval,
                                     renewalIntervalUnit, rollingRenewalInterval, rollingRenewalIntervalUnit, flag) {
    let renewCalendardateObject;
    let rollingCalendarDate;
    let finalExpiryRenewalDate;
    let extensionFinalDate;
    const totalRollingRenewalInterval = rollingRenewalInterval * numOfRenewals;
    renewalInterval = renewalInterval * 1;
    if (extensionOnCode === '02' && renewalCalendarDate !== '' && renewalCalendarDate != null) {
          renewCalendardateObject = renewalCalendarDate;
          extensionFinalDate = new Date(renewCalendardateObject);
    } else if (extensionOnCode === '01' && expDate !== '' && expDate != null) {
          renewCalendardateObject = expDate;
          extensionFinalDate = new Date(renewCalendardateObject);
    }

    if (renewalInterval && renewalInterval != null
          && renewalIntervalUnit && renewalIntervalUnit !== '' && renewalIntervalUnit != null && extensionFinalDate !== undefined) {
          rollingCalendarDate = this.calculateRollingCalendarDate(renewalIntervalUnit, extensionFinalDate, renewalInterval);
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
          if (this.getBgRenewalType() === '02' && flag === false) {
              this.setFormatFinalExpiryDate(finalExpiryRenewalDate, renewalIntervalUnit, this.getBgFinalExpiryDateField());
          }
          if (this.getCuRenewalType() === '02' && flag === true) {
              this.setCuFormatFinalExpiryDate(finalExpiryRenewalDate, renewalIntervalUnit, this.getCuFinalExpiryDateField());
          }
    }
  }

  calculateRollingCalendarDate(renewalIntervalUnit, extensionFinalDate, renewalInterval) {
    let rollingCalendarDate;
    const weekDay = 7;
    switch (renewalIntervalUnit) {
      case 'D':
        rollingCalendarDate = new Date(extensionFinalDate.setDate(extensionFinalDate.getDate() + renewalInterval));
        break;
      case 'W':
        rollingCalendarDate = new Date(
          extensionFinalDate.setDate(
            extensionFinalDate.getDate() + weekDay * renewalInterval
          )
        );
        break;
      case 'M':
        rollingCalendarDate = new Date(extensionFinalDate.
          setMonth(extensionFinalDate.getMonth() + renewalInterval));
        break;
      case 'Y':
        rollingCalendarDate = new Date(
          extensionFinalDate.setFullYear(
            extensionFinalDate.getFullYear() + renewalInterval
          )
        );
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
        finalExpiryRenewalDate = new Date(rollingCalDate.
          setDate(rollingCalDate.getDate() + (totalRollingRenewalInterval)));
        break;
      case 'W':
        finalExpiryRenewalDate = new Date(rollingCalDate.
          setDate(rollingCalDate.getDate() + (weekDay * totalRollingRenewalInterval)));
        break;
      case 'M':
        finalExpiryRenewalDate = new Date(rollingCalDate.
          setMonth(rollingCalDate.getMonth() + (totalRollingRenewalInterval)));
        break;
      case 'Y':
        finalExpiryRenewalDate = new Date(rollingCalDate.
          setFullYear(rollingCalDate.getFullYear() + (totalRollingRenewalInterval)));
        break;
      default:
        break;
    }
    return finalExpiryRenewalDate;
  }

  calculateCuFinalExpiryDate() {
    const flag = true;
    if (this.getCuRenewalType() !== '' && this.getCuRenewalType() !== null
    && this.getCuRenewOnCode() !== '' && this.getCuRenewOnCode() !== null
    && this.getCuRenewForNb() !== '' && this.getCuRenewForNb() !== null
    && this.getCuRenewForPeriod() !== '' && this.getCuRenewForPeriod() !== null
    && this.getCuNumOfRenewals() !== '' && this.getCuNumOfRenewals() !== null) {
      if (this.getCuRenewalType() === '01') {
        const expDate = this.getCuExpDate();
        const renewalCalendarDate = this.getCuRenewalCalendarDate();
        const constextensionOnCode = this.getCuRenewOnCode();
        const numOfRenewals = this.getCuNumOfRenewals();
        const renewalInterval = this.getCuRenewForNb();
        const renewalIntervalUnit = this.getCuRenewForPeriod();
        this.calculateRegularExtFinalExpiryDate(expDate, renewalCalendarDate, constextensionOnCode, numOfRenewals,
          renewalInterval, renewalIntervalUnit, flag );

      }
    }
  }

  setCuFirstDateValidator(firstDate, expiryDate, extsnExiryDate, cuVariationFirstDateField: AbstractControl) {
    const currentDate = new Date();

    expiryDate = (expiryDate !== '' && expiryDate !== null && expiryDate !== undefined) ?
    `${expiryDate.getDate()}/${(expiryDate.getMonth() + 1)}/${expiryDate.getFullYear()}` : '';
    expiryDate = (expiryDate !== '') ? this.commonService.convertToDateFormat(expiryDate) : '';

    extsnExiryDate = (extsnExiryDate !== '' && extsnExiryDate !== null && extsnExiryDate !== undefined) ?
     `${extsnExiryDate.getDate()}/${(extsnExiryDate.getMonth() + 1)}/${extsnExiryDate.getFullYear()}` : '';
    extsnExiryDate = (extsnExiryDate !== '') ? this.commonService.convertToDateFormat(extsnExiryDate) : '';

    if ((expiryDate && (expiryDate === null || expiryDate.value === '' || expiryDate === undefined))
    && (extsnExiryDate && (extsnExiryDate === null || extsnExiryDate.value === ''
    || extsnExiryDate === undefined))) {
        if ((firstDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0) )) {
          cuVariationFirstDateField.setValidators([firstDateApplicationDateError]);
          cuVariationFirstDateField.updateValueAndValidity();
        } else {
          cuVariationFirstDateField.clearValidators();
          cuVariationFirstDateField.updateValueAndValidity();
        }
    } else if (extsnExiryDate !== '' && firstDate !== '') {
      if ((firstDate < currentDate.setHours(0, 0, 0, 0) || firstDate > extsnExiryDate)) {
        cuVariationFirstDateField.setValidators([firstDateApplicationExtensionExpiryError]);
        cuVariationFirstDateField.updateValueAndValidity();
      } else {
        cuVariationFirstDateField.clearValidators();
        cuVariationFirstDateField.updateValueAndValidity();
      }
    } else if (expiryDate !== '' && firstDate !== '') {
      if ((firstDate < currentDate.setHours(0, 0, 0, 0) || firstDate > expiryDate)) {
        cuVariationFirstDateField.setValidators([firstDateExpiryApplicationDateError]);
        cuVariationFirstDateField.updateValueAndValidity();
      } else {
        cuVariationFirstDateField.clearValidators();
        cuVariationFirstDateField.updateValueAndValidity();
      }
    }
  }

  validateCuVariationDaysNotice(cuAdviseDaysPriorNbField: AbstractControl, cuVariationFirstDateField: AbstractControl ,
                                expiryDate, extsnExiryDate) {
    let dateAfterAdd;
    const daysNumber = cuAdviseDaysPriorNbField.value;
    let firstDate = cuVariationFirstDateField.value;
    const days = parseInt(daysNumber, 0);
    dateAfterAdd = this.datePipe.transform(new Date().setDate(new Date().getDate() + days),
    FccGlobalConstant.DATE_FORMAT_1);
    firstDate = `${firstDate.getDate()}/${(firstDate.getMonth() + 1)}/${firstDate.getFullYear()}`;
    firstDate = (firstDate !== '' && firstDate !== null) ? this.commonService.convertToDateFormat(firstDate) : '';
    dateAfterAdd = (dateAfterAdd !== '' && dateAfterAdd !== null) ? this.commonService.convertToDateFormat(dateAfterAdd) : '';

    expiryDate = (expiryDate !== '' && expiryDate !== null && expiryDate !== undefined) ?
    `${expiryDate.getDate()}/${(expiryDate.getMonth() + 1)}/${expiryDate.getFullYear()}` : '';
    expiryDate = (expiryDate !== '') ? this.commonService.convertToDateFormat(expiryDate) : '';

    extsnExiryDate = (extsnExiryDate !== '' && extsnExiryDate !== null && extsnExiryDate !== undefined) ?
    `${extsnExiryDate.getDate()}/${(extsnExiryDate.getMonth() + 1)}/${extsnExiryDate.getFullYear()}` : '';
    extsnExiryDate = (extsnExiryDate !== '') ? this.commonService.convertToDateFormat(extsnExiryDate) : '';


    if (firstDate !== '' && dateAfterAdd.setHours(0, 0, 0, 0) > firstDate.setHours(0, 0, 0, 0)) {
      if (expiryDate !== '') {
        cuAdviseDaysPriorNbField.setValidators([variationNumberDaysExpiryDateError]);
      } else if (extsnExiryDate !== '') {
        cuAdviseDaysPriorNbField.setValidators([variationNumberDaysFinalExpiryDateError]);
      }
      cuAdviseDaysPriorNbField.updateValueAndValidity();
    } else {
      cuAdviseDaysPriorNbField.clearValidators();
      cuAdviseDaysPriorNbField.updateValueAndValidity();
    }
  }

  calculateExpiryDate(effectiveDate, expDate, bgExpDate: AbstractControl){
    if ( this.commonService.isNonEmptyValue(expDate) && expDate.value !== ''
      && this.commonService.isNonEmptyValue(effectiveDate ) && effectiveDate.value !== '' &&
          (expDate < effectiveDate)) {
        bgExpDate.setValidators([effectiveExpiryDateError]);
        bgExpDate.updateValueAndValidity();
      } else {
        bgExpDate.clearValidators();
        bgExpDate.updateValueAndValidity();
     }
  }

 calculateCuExpiryDate(effectiveDate, expDate, cuExpDate: AbstractControl){
  if ( this.commonService.isNonEmptyValue(expDate) && expDate.value !== ''
  && this.commonService.isNonEmptyValue(effectiveDate ) && effectiveDate.value !== '' && (expDate < effectiveDate)) {
      cuExpDate.setValidators([effectiveExpiryDateError]);
      cuExpDate.updateValueAndValidity();
    } else {
      cuExpDate.clearValidators();
      cuExpDate.updateValueAndValidity();
   }
}

 calculateShipmentDate(lastShipmentDate, expDate, shipmentDate: AbstractControl, shipmentEarliestDate){      
    if (((expDate && (expDate !== null || expDate.value !== '' || expDate !== undefined))
    && (lastShipmentDate && (lastShipmentDate !== null || lastShipmentDate.value !== '' || lastShipmentDate !== undefined)))
    && (lastShipmentDate > expDate)) {
      shipmentDate.setValidators([shipmentExpiryDateError]);
      shipmentDate.updateValueAndValidity();
    } 
    else if(((lastShipmentDate && (lastShipmentDate !== null || lastShipmentDate.value !== '' || lastShipmentDate !== undefined))
    && (shipmentEarliestDate && (shipmentEarliestDate !== null || shipmentEarliestDate.value !== '' || shipmentEarliestDate !== undefined)))
    && (lastShipmentDate <= shipmentEarliestDate)){
      shipmentDate.setValidators([lastShipmentDateError]);
      shipmentDate.updateValueAndValidity();
    }
    else {
      this.productStateService.getSectionData('uiUndertakingDetails').get('uiShipmentDetails')
      .get('shipmentEarliestDate').clearValidators();
      this.productStateService.getSectionData('uiUndertakingDetails').get('uiShipmentDetails')
      .get('shipmentEarliestDate').updateValueAndValidity();
      this.productStateService.getSectionData('uiUndertakingDetails').get('uiTypeAndExpiry').get('bgExpDate').clearValidators(); 
      this.productStateService.getSectionData('uiUndertakingDetails').get('uiTypeAndExpiry').get('bgExpDate').updateValueAndValidity(); 
      shipmentDate.clearValidators();
      shipmentDate.updateValueAndValidity();
   }
 }

 calculateShipmentEarliestDate(shipmentEarliestDate, lastShipmentDate, shipmentDate: AbstractControl, expDate){   
    if (((lastShipmentDate && (lastShipmentDate !== null || lastShipmentDate.value !== '' || lastShipmentDate !== undefined))
    && (shipmentEarliestDate && (shipmentEarliestDate !== null || shipmentEarliestDate.value !== '' || shipmentEarliestDate !== undefined)))
    && (shipmentEarliestDate >= lastShipmentDate)) {
      shipmentDate.setValidators([earliestShipmentDateError]);
      shipmentDate.updateValueAndValidity();
    } 
    else if (((expDate && (expDate !== null || expDate.value !== '' || expDate !== undefined))
    && (shipmentEarliestDate && (shipmentEarliestDate !== null || shipmentEarliestDate.value !== '' || shipmentEarliestDate !== undefined)))
    && (shipmentEarliestDate > expDate)){
      shipmentDate.setValidators([earliestShipmentDateExpiryError]);
      shipmentDate.updateValueAndValidity();
    }
    else {
     this.productStateService.getSectionData('uiUndertakingDetails').get('uiShipmentDetails').get('shipmentLastDate').clearValidators();
     this.productStateService.getSectionData('uiUndertakingDetails').get('uiShipmentDetails')
     .get('shipmentLastDate').updateValueAndValidity();
     this.productStateService.getSectionData('uiUndertakingDetails').get('uiTypeAndExpiry').get('bgExpDate').clearValidators(); 
     this.productStateService.getSectionData('uiUndertakingDetails').get('uiTypeAndExpiry').get('bgExpDate').updateValueAndValidity(); 
     shipmentDate.clearValidators();
     shipmentDate.updateValueAndValidity();
   }
 }
}


