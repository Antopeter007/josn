import { Constants } from '../constants';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { ValidationErrors, AbstractControl, Validators } from '@angular/forms';
import { validateAmountField, validateSettlementAmount } from './common-validator';
import { CommonDataService } from '../services/common-data.service';


@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(public translate: TranslateService, public commonDataService: CommonDataService) { }

  validateField(fieldCtrl: AbstractControl): string {
    if (fieldCtrl.invalid && (fieldCtrl.touched || fieldCtrl.dirty) && fieldCtrl.enabled) {
      return this.properMessage(fieldCtrl.errors);
    } else {
      return '';
    }
  }

  properMessage(error: ValidationErrors): string {
    let errorMsg = '';

    if (error.required) {
      this.translate.get('FIELD_REQUIRED_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.maxlength && (error.maxlength.actualLength > error.maxlength.requiredLength)) {
      this.translate.get('FIELD_MAXLENGTH_ERROR', {fieldSize: error.maxlength.requiredLength}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.charSet && error.charSet !== '') {
      this.translate.get('FIELD_SWIFTCHAR_ERROR', {charSet: error.charSet.value ===  Constants.X_CHAR ?
                                      Constants.X_CHARSET_ERROR : Constants.Z_CHARSET_ERROR })
        .subscribe((res: string) => {
          errorMsg = res;
      });
    } else if (error.amtFieldInvalid && error.amtFieldInvalid !== '') {
      const decimalNumbersAllowed = error.amtFieldInvalid.decimalNumbersAllowed;
      this.translate.get('AMOUNT_FIELD_ERROR', {currency: error.amtFieldInvalid.currency,
                                                beforeDec: (decimalNumbersAllowed === 0 || decimalNumbersAllowed === 1 ||
                                                  decimalNumbersAllowed === Constants.NUMERIC_TWO) ?
                                                  Constants.NUMERIC_THIRTEEN : Constants.NUMERIC_FIFTEEN - decimalNumbersAllowed,
                                                afterDec: decimalNumbersAllowed})
        .subscribe((res: string) => {
          errorMsg = res;
      });
    } else if (error.pattern && error.pattern.requiredPattern === Constants.REGEX_NUMBER ||
              error.alphabetsInAmt && error.alphabetsInAmt !== '') {
      this.translate.get('KEY_ONLY_NUMBERS_ALLOWED').subscribe((res: string) => {
          errorMsg = res;
      });
    } else if (error.zeroAmt && error.zeroAmt !== '') {
      this.translate.get('AMOUNT_ZERO_NOT_ALLOWED').subscribe((res: string) => {
      errorMsg = res;
      });
    } else if (error.pattern && (error.pattern.requiredPattern === Constants.REGEX_AMOUNT ||
      error.pattern.requiredPattern === Constants.REGEX_PERCENTAGE || Constants.REGEX_BIC_CODE)) {
        this.translate.get('KEY_INVALID_FIELD_VALUE').subscribe((res: string) => {
        errorMsg = res;
        });
    } else if (error.expDateInvalid) {
      this.translate.get('EXPIRY_DATE_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    }  else if (error.settlementAmtGreaterThanClaimAmt) {
      this.translate.get('SETTLEMENT_AMT_GREATER_THAN_CLAIM_AMT_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.settlementAmtLessThanOrEqualToZero) {
      this.translate.get('SETTLEMENT_AMT_ZERO_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    }  else if (error.releaseAmtGreaterThanBgLiabAmt) {
      this.translate.get('RELEASE_AMT_GREATER_THAN_BG_LIAB_AMT_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.releaseAmtLessThanOrEqualToZero) {
      this.translate.get('RELEASE_AMT_ZERO_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    }  else if (error.claimAmtGreaterThanBgLiabAmt) {
      this.translate.get('CLAIM_AMT_GREATER_THAN_BG_LIAB_AMT_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.claimAmtLessThanOrEqualToZero) {
      this.translate.get('CLAIM_AMT_ZERO_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
     } else if (error.documentAmtGreaterThanBgLiabAmt) {
      this.translate.get('DOCUMENT_AMT_GREATER_THAN_BG_LIAB_AMT_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
      } else if (error.tnxAmtGreaterThanDocumentAmt) {
        this.translate.get('TNX_AMT_GREATER_THAN_DOCUMENT_AMT_ERROR',
        {tnxAmount: error.tnxAmtGreaterThanDocumentAmt.tnxAmount,
        documentAmount: error.tnxAmtGreaterThanDocumentAmt.documentAmount}).subscribe((res: string) => {
          errorMsg = res;
        });
      } else if (error.bookingAmtGreaterThanbgAmt) {
        this.translate.get('BOOKING_AMT_GREATER_THAN_BG_AMT_ERROR').subscribe((res: string) => {
          errorMsg = res;
        });
      } else if (error.bookingAmtGreaterThanlimAvlblAmt) {
        this.translate.get('BOOKING_AMT_GREATER_THAN_LIM_AVAILABLE_AMT_ERROR').subscribe((res: string) => {
          errorMsg = res;
        });
      } else if (error.bgAmtGreaterThanlimAvlblAmt) {
        this.translate.get('BG_AMT_GREATER_THAN_LIM_AVAILABLE_AMT_ERROR').subscribe((res: string) => {
          errorMsg = res;
        });
      } else if (error.documentAmtLessThanOrEqualToZero) {
      this.translate.get('DOCUMENT_AMT_ZERO_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
     } else if (error.settlementAmtGreaterThanOrgTnxAmt) {
        this.translate.get('SETTLEMENT_AMT_GREATER_THAN_ORG_TNX_AMT_ERROR',
        {bgAmt: error.settlementAmtGreaterThanOrgTnxAmt.value.value}).subscribe((res: string) => {
          errorMsg = res;
        });
    } else if (error.date1GreaterThanDate2) {
      this.translate.get('DATE1_GREATER_THAN_DATE2_ERROR',
      {dateType1: error.date1GreaterThanDate2.dateType1,
      dateType2: error.date1GreaterThanDate2.dateType2,
      fieldCtrlDate1: error.date1GreaterThanDate2.fieldCtrlDate1,
      fieldCtrlDate2: error.date1GreaterThanDate2.fieldCtrlDate2}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.date1GreaterThanOrEqualToDate2) {
      this.translate.get('DATE1_GREATER_THAN_OR_EQUAL_TO_DATE2_ERROR',
      {dateType1: error.date1GreaterThanOrEqualToDate2.dateType1,
      dateType2: error.date1GreaterThanOrEqualToDate2.dateType2,
      fieldCtrlDate1: error.date1GreaterThanOrEqualToDate2.fieldCtrlDate1,
      fieldCtrlDate2: error.date1GreaterThanOrEqualToDate2.fieldCtrlDate2}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.date1LesserThanDate2) {
      this.translate.get('DATE1_LESSER_THAN_DATE2_ERROR',
      {dateType1: error.date1LesserThanDate2.dateType1,
      dateType2: error.date1LesserThanDate2.dateType2,
      fieldCtrlDate1: error.date1LesserThanDate2.fieldCtrlDate1,
      fieldCtrlDate2: error.date1LesserThanDate2.fieldCtrlDate2}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.date1LesserThanOrEqualToDate2) {
      this.translate.get('DATE1_LESSER_THAN_OR_EQUAL_TO_DATE2_ERROR',
      {dateType1: error.date1LesserThanOrEqualToDate2.dateType1,
      dateType2: error.date1LesserThanOrEqualToDate2.dateType2,
      fieldCtrlDate1: error.date1LesserThanOrEqualToDate2.fieldCtrlDate1,
      fieldCtrlDate2: error.date1LesserThanOrEqualToDate2.fieldCtrlDate2}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.Amount1GreaterThanAmount2) {
        this.translate.get('AMOUNT1_GREATER_THAN_AMOUNT2_ERROR',
        {AmountType1: error.Amount1GreaterThanAmount2.AmountType1,
          AmountType2: error.Amount1GreaterThanAmount2.AmountType2,
          fieldCtrlAmount1: error.Amount1GreaterThanAmount2.fieldCtrlAmount1,
          fieldCtrlAmount2: error.Amount1GreaterThanAmount2.fieldCtrlAmount2}).subscribe((res: string) => {
          errorMsg = res;
        });
      } else if (error.Amount1LesserThanAmount2) {
        this.translate.get('AMOUNT1_LESSER_THAN_AMOUNT2_ERROR',
        {AmountType1: error.Amount1LesserThanAmount2.AmountType1,
          AmountType2: error.Amount1LesserThanAmount2.AmountType2,
          fieldCtrlAmount1: error.Amount1LesserThanAmount2.fieldCtrlAmount1,
          fieldCtrlAmount2: error.Amount1LesserThanAmount2.fieldCtrlAmount2}).subscribe((res: string) => {
          errorMsg = res;
        });
      } else if (error.Amount1GreaterThanOrEqualToAmount2) {
          this.translate.get('AMOUNT1_GREATER_THAN_EQUAL_TO_AMOUNT2_ERROR',
          {AmountType1: error.Amount1GreaterThanOrEqualToAmount2.AmountType1,
            AmountType2: error.Amount1GreaterThanOrEqualToAmount2.AmountType2,
            fieldCtrlAmount1: error.Amount1GreaterThanOrEqualToAmount2.fieldCtrlAmount1,
            fieldCtrlAmount2: error.Amount1GreaterThanOrEqualToAmount2.fieldCtrlAmount2}).subscribe((res: string) => {
            errorMsg = res;
          });
    } else if (error.Amount1LesserThanOrEqualToAmount2) {
      this.translate.get('AMOUNT1_LESSER_THAN_EQUAL_TO_AMOUNT2_ERROR',
      {AmountType1: error.Amount1LesserThanOrEqualToAmount2.AmountType1,
        AmountType2: error.Amount1LesserThanOrEqualToAmount2.AmountType2,
        fieldCtrlAmount1: error.Amount1LesserThanOrEqualToAmount2.fieldCtrlAmount1,
        fieldCtrlAmount2: error.Amount1LesserThanOrEqualToAmount2.fieldCtrlAmount2}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.expDateLesserThanGivenDate) {
      this.translate.get('EXP_DATE_LESSER_THAN_GIVEN_DATE_ERROR',
      {dateType1: error.expDateLesserThanGivenDate.dateType1,
      fieldCtrlExp: error.expDateLesserThanGivenDate.fieldCtrlExp,
      fieldCtrlDate: error.expDateLesserThanGivenDate.fieldCtrlDate}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.currencyCodeIsInvalid) {
      this.translate.get('CURRENCY_CODE_INVALID_ERROR',
      {currCode: error.currencyCodeIsInvalid.currCode}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.countryCodeIsInvalid) {
      this.translate.get('COUNTRY_CODE_INVALID_ERROR',
      {countryCode: error.countryCodeIsInvalid.countryCode}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.decreaseAmtGreaterThanBgLiabAmt) {
      this.translate.get('DEC_AMT_GREATER_THAN_OUTSTANDING_AMT',
      {decAmt: error.decreaseAmtGreaterThanBgLiabAmt.decAmt,
      bgLiabAmt: error.decreaseAmtGreaterThanBgLiabAmt.bgLiabAmt}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.date1LesserThandate2) {
      this.translate.get('DATE_LESS_THAN_CURRENT_DATE', {
        date1: error.date1LesserThandate2.date1,
        date2: error.date1LesserThandate2.date2}).subscribe((res: string) => {
          errorMsg = res;
        });
    } else if (error.rowCountMoreThanAllowed) {
      this.translate.get('ROWCOUNT_EXCEEDED_MAX_ALLOWED', {
        enteredRow: error.rowCountMoreThanAllowed.enteredRow,
        maxRows: error.rowCountMoreThanAllowed.maxRows,
        charPerRow: error.rowCountMoreThanAllowed.charPerRow}).subscribe((res: string) => {
          errorMsg = res;
        });
    } else if (error.date1GreaterThanCurrentDate) {
      this.translate.get('DATE_GREATER_THAN_CURRENT_DATE', {
        date1: error.date1GreaterThanCurrentDate.date1,
        date2: error.date1GreaterThanCurrentDate.date2}).subscribe((res: string) => {
          errorMsg = res;
        });
    } else if (error.variationFirstDateLesserThanGivenDate) {
      this.translate.get('FIRST_DATE_LESSER_THAN_GIVEN_DATE_ERROR',
      {dateType1: error.variationFirstDateLesserThanGivenDate.dateType1,
      fieldCtrlFirstDate: error.variationFirstDateLesserThanGivenDate.fieldCtrlFirstDate,
      fieldCtrlDate: error.variationFirstDateLesserThanGivenDate.fieldCtrlDate}).subscribe((res: string) => {
        errorMsg = res;
      });
    }  else if (error.tnxAmtCurrencyError) {
      this.translate.get('TNX_CURRENCY_AMT_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.variationPercError) {
      this.translate.get('VARIATION_PERC_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.zeroPercentageError) {
      this.translate.get('ZERO_PERC_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.variationDaysError) {
      this.translate.get('VARIATION_DAYS_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.variationAmtError) {
      this.translate.get('VARIATION_AMT_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.variationFirstDateExpiryApplicationDateError) {
      this.translate.get('FIRST_DATE_EXPIRY_APPLICATION_DATE_ERROR',
      {applicationDate: error.variationFirstDateExpiryApplicationDateError.applicationDateVal,
       expiryDate: error.variationFirstDateExpiryApplicationDateError.expiryDateVal,
      fieldCtrlFirstDate: error.variationFirstDateExpiryApplicationDateError.fieldCtrlFirstDate}).subscribe((res: string) => {
        errorMsg = res;
      });
    }  else if (error.variationFirstDateApplicationDateError) {
      this.translate.get('FIRST_DATE_APPLICATION_DATE_ERROR',
      {applicationDate: error.variationFirstDateApplicationDateError.applicationDateVal,
        fieldCtrlFirstDate: error.variationFirstDateApplicationDateError.fieldCtrlFirstDate}).subscribe((res: string) => {
        errorMsg = res;
      });
    }  else if (error.variationFirstDateRenewalExpiryApplicationDateError) {
      this.translate.get('FIRST_DATE_APPLICATION_EXTENSION_EXPIRY_ERROR',
      {applicationDate: error.variationFirstDateRenewalExpiryApplicationDateError.applicationDateVal,
        fieldCtrlFirstDate: error.variationFirstDateRenewalExpiryApplicationDateError.fieldCtrlFirstDate,
        renewalExpiryDate: error.variationFirstDateRenewalExpiryApplicationDateError.finalRenewalExpDateVal}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.validateSettlementDateWithApplicationCurrentDateError) {
      this.translate.get('SETTLEMENT_DATE_APPLICATION_EXTENSION_CURRENT_ERROR',
      {applicationDate: error.validateSettlementDateWithApplicationCurrentDateError.applicationDateVal}).subscribe(
          (res: string) => {
        errorMsg = res;
      });
    } else if (error.variationFrequencyError) {
      this.translate.get('VARIATION_FREQUENCY_ERROR', {expDate: error.variationFrequencyError.expDateString}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.variationNumberDays) {
      this.translate.get('VARIATION_NUMBERDAYS_ERROR', {expDate: error.variationNumberDays.expDateString}).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.variationMaxDateError) {
      this.translate.get('VARIATION_MAX_DATE_ERROR', {type: error.variationMaxDateError.dateType }).subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.variationMaxDateGreaterError) {
      this.translate.get('VARIATION_MAX_DATE_GREATER_ERROR',
      {type: error.variationMaxDateGreaterError.dateType})
      .subscribe((res: string) => {
        errorMsg = res;
      });
    } else if (error.date1LesserThancurrentDate) {
      this.translate.get('DATE_CANNOT_LESS_THAN_CURRENT_DATE', {
        dateString: error.date1LesserThancurrentDate.dateString,
        date1: error.date1LesserThancurrentDate.date1,
        date2: error.date1LesserThancurrentDate.date2}).subscribe((res: string) => {
          errorMsg = res;
        });
      } else if (error.dateNotWithinRange) {
        this.translate.get('DATE_SHOULD_BE_IN_RANGE', {
          date: error.dateNotWithinRange.date,
          dateType: error.dateNotWithinRange.dateType,
          lowerType: error.dateNotWithinRange.lowerType,
          upperType: error.dateNotWithinRange.upperType,
        }).subscribe((res: string) => {
            errorMsg = res;
          });
      }


    return errorMsg;
  }

  isFieldInvalid(fieldCtrl: AbstractControl): boolean {
    if (fieldCtrl != null){
      if (fieldCtrl.invalid && (fieldCtrl.touched || fieldCtrl.dirty) && fieldCtrl.enabled) {
        return true;
      } else {
        return false;
      }
    }
  }

  setAmtCurValidator(amtCntrl: AbstractControl, curCntrl: AbstractControl, cur: string, decimalNumber?: number) {

    if (amtCntrl.value !== '') {
      curCntrl.setValidators(Validators.required);
      if (cur === 'bgCurCode' || cur === 'cuCurCode' || cur === 'claimCurCode' || cur === 'tnxAmtCurCode') {
        amtCntrl.setValidators([validateAmountField(curCntrl.value, decimalNumber), Validators.required]);
      } else {
        amtCntrl.setValidators([validateAmountField(curCntrl.value, decimalNumber)]);
      }
    } else {
      if (cur === 'bgCurCode' || (cur === 'cuCurCode' && this.commonDataService.isBankUser)
       || cur === 'claimCurCode' || cur === 'tnxAmtCurCode') {
        amtCntrl.clearValidators();
        amtCntrl.setValidators(Validators.required);
        curCntrl.setValidators(Validators.required);
      } else {
        amtCntrl.clearValidators();
        curCntrl.clearValidators();
      }
    }
    amtCntrl.updateValueAndValidity();
    curCntrl.updateValueAndValidity();
  }

  validateSettlementAmount(tnxAmtCntrl: AbstractControl, claimAmtCntrl: AbstractControl, bgAmtCntrl: AbstractControl, cur: string) {
    if (tnxAmtCntrl.value !== '') {
        tnxAmtCntrl.setValidators([Validators.required, validateAmountField(cur),
          validateSettlementAmount(tnxAmtCntrl, claimAmtCntrl, bgAmtCntrl)]);
    } else {
      tnxAmtCntrl.clearValidators();
    }
    tnxAmtCntrl.updateValueAndValidity();
  }
}
