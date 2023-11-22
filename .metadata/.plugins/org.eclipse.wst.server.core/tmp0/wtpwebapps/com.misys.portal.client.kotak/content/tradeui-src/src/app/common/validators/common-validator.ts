import { Constants } from '../constants';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Currency } from '../model/currency.model';
import { Country } from '../model/country.model';

export function validateSwiftCharSet(charSet: string): ValidatorFn {

    const validationCharSet = new RegExp(charSet ===  Constants.X_CHAR ? Constants.REGEX_X_CHARSET : Constants.REGEX_Z_CHARSET);
    return(control: AbstractControl): {[key: string]: any} | null => {
        const allowedChar = validationCharSet.test(control.value);
        return !allowedChar ? { charSet: {value: charSet}} : null;
    };
}

export function validateAmountField(cur: string , decimalNumber?: number): ValidatorFn {
    return(control: AbstractControl): { [key: string]: any } | null => {
      if (control.parent && control.value !== '' && control.value !== null) {
        const userLanguage = window[Constants.USER_LANGUAGE];
        const regex = getRegexForAmountValidation(userLanguage, decimalNumber);
        const validationRegex = new RegExp(regex);
        const amtValue = getAmountWithoutLanguageFormatting(control.value);
        let amtControlVal = control.value;
        if (userLanguage === Constants.LANGUAGE_EN || userLanguage === Constants.LANGUAGE_US) {
          amtControlVal = control.value.indexOf(',') === -1 ? control.value : control.value.replaceAll(',', '');
        }
        const allowedChar = validationRegex.test(amtControlVal);
        if (isNaN(Number(amtValue))) {
          return { alphabetsInAmt: {value: control.value}};
        } else if (!allowedChar) {
          return !allowedChar ? { amtFieldInvalid: {currency: cur, decimalNumbersAllowed: decimalNumber}} : null;
        } else if (amtValue <= 0) {
          return { zeroAmt: {value: control.value}};
        } else {
        return null;
      }
    }
  };
}

export function validateDate(date1: string, date2: string, type1: string, type2: string, check: string): ValidatorFn {
    return(control: AbstractControl): { [key: string]: any } | null => {
      if (control.parent && date1 !== '' && date2 !== '') {
        const d1 = convertToDateFormat(date1).getTime();
        const d2 = convertToDateFormat(date2).getTime();
        if (d1 > d2 && check === 'greaterThan') {
          return {date1GreaterThanDate2: {dateType1 : type1, dateType2: type2,
            fieldCtrlDate1: date1, fieldCtrlDate2 : date2}};
        } else if (d1 < d2 && check === 'lesserThan') {
          return {date1LesserThanDate2: {dateType1 : type1, dateType2: type2,
            fieldCtrlDate1: date1, fieldCtrlDate2 : date2}};
        }
    } else {
    return null;
    }
    };
}

export function validateExpDateWithOtherDate(fieldCtrlExp: AbstractControl, fieldCtrlDate: AbstractControl,
                                             dateType1: string): ValidatorFn {
    return(control: AbstractControl): { [key: string]: any } | null => {
      if (control.parent && fieldCtrlExp.value !== '' && fieldCtrlDate.value !== '') {
        const expDate = convertToDateFormat(fieldCtrlExp.value).getTime();
        const givenDate = convertToDateFormat(fieldCtrlDate.value).getTime();

        return (expDate < givenDate) ?
        { expDateLesserThanGivenDate: {fieldCtrlExp : fieldCtrlExp.value, fieldCtrlDate: fieldCtrlDate.value ,
                                        dateType1}} : null;
       } else {
        return null;
      }
    };
  }

export function convertToDateFormat(dateEntered: string): Date {
    let dateObject = new Date();
    if ( dateEntered !== '' &&  dateEntered != null) {
      const dateParts = dateEntered.split('/');
      const userLanguage = window[Constants.USER_LANGUAGE];
      if (userLanguage === Constants.LANGUAGE_US) {
        dateObject = new Date(+dateParts[Constants.NUMERIC_TWO], +dateParts[0] - 1, +dateParts[1]);
      } else {
        dateObject = new Date(+dateParts[Constants.NUMERIC_TWO], +dateParts[1] - 1, +dateParts[0]);
      }
    }
    return dateObject;
  }

export function validateSettlementAmount(tnxAmtCntrl: AbstractControl, claimAmtCntrl: AbstractControl,
                                         bgAmtCntrl: AbstractControl): ValidatorFn {
    return(control: AbstractControl): { [key: string]: any } | null => {
      if (control.parent) {
        const tnxAmtValue = parseFloat(getAmountWithoutLanguageFormatting(tnxAmtCntrl.value));
        const claimAmtValue = parseFloat(getAmountWithoutLanguageFormatting(claimAmtCntrl.value));
        const bgAmtValue = parseFloat(getAmountWithoutLanguageFormatting(bgAmtCntrl.value));
        if (tnxAmtValue > claimAmtValue) {
          return { settlementAmtGreaterThanClaimAmt: {value: tnxAmtCntrl}};
        } else if (tnxAmtValue <= 0) {
          return { settlementAmtLessThanOrEqualToZero: {value: tnxAmtCntrl}};
        } else if (tnxAmtValue > bgAmtValue) {
          return { settlementAmtGreaterThanOrgTnxAmt: {value: bgAmtCntrl}};
        }
        return (tnxAmtValue > claimAmtValue) ? { settlementAmtGreaterThanTnxAmt: {value: tnxAmtCntrl}} : null;
       } else {
        return null;
      }
    };
  }
// Common method to validate any two dates
// dateType1 and dateType2 specify the which dates are being compared for error message localization
// check specifies whether greater or lesser check to be made.
export function validateDates(fieldCtrlDate1: AbstractControl, fieldCtrlDate2: AbstractControl,
                              dateType1: string, dateType2: string, check): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (control.parent && fieldCtrlDate1.value !== '' && fieldCtrlDate2.value !== '') {
      const date1 = convertToDateFormat(fieldCtrlDate1.value).getTime();
      const date2 = convertToDateFormat(fieldCtrlDate2.value).getTime();
      if (date1 > date2 && check === 'greaterThan') {
        return {date1GreaterThanDate2: {dateType1, dateType2,
          fieldCtrlDate1: fieldCtrlDate1.value, fieldCtrlDate2 : fieldCtrlDate2.value}};
      } else if (date1 < date2 && check === 'lesserThan') {
        return {date1LesserThanDate2: {dateType1, dateType2,
           fieldCtrlDate1: fieldCtrlDate1.value, fieldCtrlDate2 : fieldCtrlDate2.value}};
      } else if (date1 >= date2 && check === 'greaterThanOrEqualTo') {
        return {date1GreaterThanOrEqualToDate2: {dateType1, dateType2,
          fieldCtrlDate1: fieldCtrlDate1.value, fieldCtrlDate2 : fieldCtrlDate2.value}};
      } else if (date1 <= date2 && check === 'lesserThanOrEqualTo') {
        return {date1LesserThanOrEqualToDate2: {dateType1, dateType2,
          fieldCtrlDate1: fieldCtrlDate1.value, fieldCtrlDate2 : fieldCtrlDate2.value}};
      }
     } else {
        return null;
      }
  };
}

// method to check amend release amount should not be greater than bg liab amt
// and also it hould not be less than or equal to zero.
export function validateReleaseAmount(releaseAmtCntrl: AbstractControl, liabAmtCntrl: AbstractControl): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (control.parent) {
      const releaseAmtValue = parseFloat(getAmountWithoutLanguageFormatting(releaseAmtCntrl.value));
      const bgLiabAmtValue = parseFloat(getAmountWithoutLanguageFormatting(liabAmtCntrl.value));
      if (releaseAmtValue > bgLiabAmtValue) {
        return { releaseAmtGreaterThanBgLiabAmt: {value: releaseAmtCntrl}};
      } else if (releaseAmtValue <= 0) {
        return { releaseAmtLessThanOrEqualToZero: {value: releaseAmtCntrl}};
     } else {
      return null;
    }
  }
  };
}

// method to check claim amount should not be greater than bg liab amt
// and also it hould not be less than or equal to zero.
export function validateClaimAmount(claimAmtCntrl: AbstractControl, liabAmtCntrl: AbstractControl): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (control.parent) {
      const claimAmtValue = parseFloat(getAmountWithoutLanguageFormatting(claimAmtCntrl.value));
      const bgLiabAmtValue = parseFloat(getAmountWithoutLanguageFormatting(liabAmtCntrl.value));
      if (claimAmtValue > bgLiabAmtValue) {
        return { claimAmtGreaterThanBgLiabAmt: {value: claimAmtCntrl}};
      } else if (claimAmtValue <= 0) {
        return { claimAmtLessThanOrEqualToZero: {value: claimAmtCntrl}};
     } else {
      return null;
    }
  }
  };
}

export function validateDocumentAmount(tnxAmtCntrl: AbstractControl, liabAmtCntrl: AbstractControl): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (control.parent) {
      const claimAmtValue = parseFloat(getAmountWithoutLanguageFormatting(tnxAmtCntrl.value));
      const bgLiabAmtValue = parseFloat(getAmountWithoutLanguageFormatting(liabAmtCntrl.value));
      if (claimAmtValue > bgLiabAmtValue) {
        return { documentAmtGreaterThanBgLiabAmt: {value: tnxAmtCntrl}};
      } else if (claimAmtValue <= 0) {
        return { documentAmtLessThanOrEqualToZero: {value: tnxAmtCntrl}};
     } else {
      return null;
    }
  }
  };
}

export function validateBookingAmountWithBGAndLimAvlblAmount(bookingAmtCtrl: AbstractControl, AmtCtrl: AbstractControl): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (control.parent) {
      const bookingAmtValue = parseFloat(getAmountWithoutLanguageFormatting(bookingAmtCtrl.value));
      const AmtValue = parseFloat(getAmountWithoutLanguageFormatting(AmtCtrl.value));
      if (bookingAmtValue > AmtValue) {
        return { bookingAmtGreaterThanlimAvlblAmt: {value: bookingAmtCtrl}};
      } else {
      return null;
    }
  }
  };
}

export function validateTnxAndLimAvlblAmount(limitAvlblAmtCtrl: AbstractControl, TnxAmtCtrl: AbstractControl): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (control.parent) {
      const limitAmtValue = parseFloat(getAmountWithoutLanguageFormatting(limitAvlblAmtCtrl.value));
      const TnxAmtValue = parseFloat(getAmountWithoutLanguageFormatting(TnxAmtCtrl.value));
      if (TnxAmtValue > limitAmtValue) {
        return { bgAmtGreaterThanlimAvlblAmt: {value: TnxAmtCtrl}};
      } else {
      return null;
    }
  }
  };
}

// common method to validate the currency code
export function validateCurrCode(currList: Currency[]): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (currList !== undefined && currList !== null && currList.length !== 0) {
      if (control.value === '' || currList.some((e: { isocode: any; }) => e.isocode === control.value)) {
        return null;
      } else {
        return { currencyCodeIsInvalid: {currCode: control.value}};
      }
    }
 };
}

// common method to validate the country code
export function validateCountryCode(countryList: Country[]): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (countryList !== undefined && countryList !== null && countryList.length !== 0) {
      if (control.value === '' || countryList.some((element: {VALUE: any; }) => element.VALUE === control.value)) {
        return null;
      } else {
        return { countryCodeIsInvalid: {countryCode: control.value}};
      }
    }
 };
}

// Method to check decrease amt should be less than or equal to outstanding amount
export function validateDecreaseAmount(liabAmtCntrl: string): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (control.value !== '' && liabAmtCntrl !== '') {
      const decreaseAmtValue = parseFloat(getAmountWithoutLanguageFormatting(control.value));
      const bgLiabAmtValue = parseFloat(getAmountWithoutLanguageFormatting(liabAmtCntrl));
      if ((decreaseAmtValue > bgLiabAmtValue) || (decreaseAmtValue - bgLiabAmtValue === 0) || (bgLiabAmtValue - decreaseAmtValue === 0)) {
        return { decreaseAmtGreaterThanBgLiabAmt: {decAmt: decreaseAmtValue, bgLiabAmt: bgLiabAmtValue}};
      } else {
      return null;
    }
  }
  };
}
export function validateAmount(fieldCtrlAmount1: AbstractControl, fieldCtrlAmount2: AbstractControl,
                               AmountType1: string, AmountType2: string, check): ValidatorFn {
return(control: AbstractControl): { [key: string]: any } | null => {
if (control.parent && fieldCtrlAmount1.value !== null && fieldCtrlAmount2.value !== null &&
  fieldCtrlAmount1.value !== '' && fieldCtrlAmount2.value !== '') {
    const amount1 = parseFloat(getAmountWithoutLanguageFormatting(fieldCtrlAmount1.value));
    const amount2 = parseFloat(getAmountWithoutLanguageFormatting(fieldCtrlAmount2.value));
    if (amount1 <= amount2 && check === 'greaterThan') {
return {Amount1GreaterThanAmount2: {AmountType1, AmountType2,
  fieldCtrlAmount1: fieldCtrlAmount1.value, fieldCtrlAmount2 : fieldCtrlAmount2.value}};
} else if (amount1 > amount2 && check === 'lesserThan') {
return {Amount1LesserThanAmount2: {AmountType1, AmountType2,
  fieldCtrlAmount1: fieldCtrlAmount1.value, fieldCtrlAmount2 : fieldCtrlAmount2.value}};
} else if (amount1 < amount2 && check === 'greaterThanOrEqualTo') {
  return {Amount1GreaterThanOrEqualToAmount2: {AmountType1, AmountType2,
    fieldCtrlAmount1: fieldCtrlAmount1.value, fieldCtrlAmount2 : fieldCtrlAmount2.value}};
  } else if (amount1 > amount2 && check === 'lesserThanOrEqualTo') {
    return {Amount1LesserThanOrEqualToAmount2: {AmountType1, AmountType2,
      fieldCtrlAmount1: fieldCtrlAmount1.value, fieldCtrlAmount2 : fieldCtrlAmount2.value}};
    }
} else {
return null;
}
};
}

export function validateWithCurrentDate(currentDate: string, isValidationReq: boolean): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (control.value !== undefined && control.value !== '') {
    const current = convertToDateFormat(currentDate).getTime();
    const selectedDate = convertToDateFormat(control.value).getTime();
    if (selectedDate < current) {
      return {date1LesserThandate2: {date1: control.value, date2: currentDate}};
      } else {
        return null;
      }
    } else {
      if (isValidationReq) {
        return {required : {value: control}};
      } else {
        return null;
      }
    }
  };
}

export function validateDateGreaterThanCurrentDate(currentDate: string, isValidationReq: boolean): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (control.value !== undefined && control.value !== '') {
    const current = convertToDateFormat(currentDate).getTime();
    const selectedDate = convertToDateFormat(control.value).getTime();
    if (selectedDate > current) {
      return {date1GreaterThanCurrentDate: {date1: control.value, date2: currentDate}};
      } else {
        return null;
      }
    } else {
      if (isValidationReq) {
        return {required : {value: control}};
      } else {
        return null;
      }
    }
  };
}

export function getRegexForAmountValidationEN(decimalNumber: number): string {
  switch (decimalNumber) {
    case Constants.NUMERIC_ZERO: return(Constants.REGEX_AMOUNT_DECIMAL_0);
    case Constants.NUMERIC_ONE: return(Constants.REGEX_AMOUNT_DECIMAL_1);
    case Constants.NUMERIC_TWO: return(Constants.REGEX_AMOUNT_DECIMAL_2);
    case Constants.NUMERIC_THREE: return(Constants.REGEX_AMOUNT_DECIMAL_3);
    case Constants.NUMERIC_FOUR: return(Constants.REGEX_AMOUNT_DECIMAL_4);
    case Constants.NUMERIC_FIVE: return(Constants.REGEX_AMOUNT_DECIMAL_5);
    case Constants.NUMERIC_SIX: return(Constants.REGEX_AMOUNT_DECIMAL_6);
    case Constants.NUMERIC_SEVEN: return(Constants.REGEX_AMOUNT_DECIMAL_7);
    case Constants.NUMERIC_EIGHT: return(Constants.REGEX_AMOUNT_DECIMAL_8);
    case Constants.NUMERIC_NINE: return(Constants.REGEX_AMOUNT_DECIMAL_9);
    case Constants.NUMERIC_TEN: return(Constants.REGEX_AMOUNT_DECIMAL_10);
    case Constants.NUMERIC_ELEVEN: return(Constants.REGEX_AMOUNT_DECIMAL_11);
    case Constants.NUMERIC_TWELVE: return(Constants.REGEX_AMOUNT_DECIMAL_12);
    case Constants.NUMERIC_THIRTEEN: return(Constants.REGEX_AMOUNT_DECIMAL_13);
    case Constants.NUMERIC_FOURTEEN: return(Constants.REGEX_AMOUNT_DECIMAL_14);
    default : return(Constants.REGEX_AMOUNT_DECIMAL_0);

  }
}

export function getRegexForAmountValidationFR(decimalNumber: number): string {
  switch (decimalNumber) {
    case Constants.NUMERIC_ZERO: return(Constants.REGEX_AMOUNT_DECIMAL_0_FR);
    case Constants.NUMERIC_ONE: return(Constants.REGEX_AMOUNT_DECIMAL_1_FR);
    case Constants.NUMERIC_TWO: return(Constants.REGEX_AMOUNT_DECIMAL_2_FR);
    case Constants.NUMERIC_THREE: return(Constants.REGEX_AMOUNT_DECIMAL_3_FR);
    default : return(Constants.REGEX_AMOUNT_DECIMAL_0_FR);
  }
}

export function getRegexForAmountValidationAR(decimalNumber: number): string {
  switch (decimalNumber) {
    case Constants.NUMERIC_ZERO: return(Constants.REGEX_AMOUNT_DECIMAL_0_AR);
    case Constants.NUMERIC_ONE: return(Constants.REGEX_AMOUNT_DECIMAL_1_AR);
    case Constants.NUMERIC_TWO: return(Constants.REGEX_AMOUNT_DECIMAL_2_AR);
    case Constants.NUMERIC_THREE: return(Constants.REGEX_AMOUNT_DECIMAL_3_AR);
    default : return(Constants.REGEX_AMOUNT_DECIMAL_0_AR);
  }
}

export function getRegexForAmountValidation(language: string, decimalNumber?: number): string {
  switch (language) {
    case Constants.LANGUAGE_AR: return getRegexForAmountValidationAR(decimalNumber);
    case Constants.LANGUAGE_FR: return getRegexForAmountValidationFR(decimalNumber);
    default : return getRegexForAmountValidationEN(decimalNumber);
  }
}

export function validateSettlementDateWithApplicationCurrentDate(fieldCtrlSettlementDate: AbstractControl, fieldCtrlApplicationDate: string,
                                                                 fieldCtrlCurrentDate: string):
                                                                 ValidatorFn {
      return(control: AbstractControl): { [key: string]: any } | null => {
        const settleDate = convertToDateFormat(fieldCtrlSettlementDate.value).getTime();
        const applicationDateVal = convertToDateFormat(fieldCtrlApplicationDate).getTime();
        const currentDate = convertToDateFormat(fieldCtrlCurrentDate).getTime();
        if (control.parent && fieldCtrlSettlementDate.value !== '' && fieldCtrlApplicationDate !== '' &&
         fieldCtrlCurrentDate !== '') {
          if ( settleDate  < applicationDateVal ||  settleDate  > currentDate) {
            return  { validateSettlementDateWithApplicationCurrentDateError: {SettlementDateVal : fieldCtrlSettlementDate.value,
              applicationDateVal: fieldCtrlApplicationDate, currentDateVal: fieldCtrlCurrentDate}};
          } else {
          return null;
          }
        }
      };
}

export function validateFirstDateWithApplicationExpiryDate(fieldCtrlFirstDate: AbstractControl, fieldCtrlApplicationDate: AbstractControl,
                                                           fieldCtrlExpiryDate: AbstractControl, finalRenewalExpDate: AbstractControl):
                                                           ValidatorFn {
      return(control: AbstractControl): { [key: string]: any } | null => {
      if (control.parent && (fieldCtrlFirstDate && fieldCtrlFirstDate.value !== '') && (fieldCtrlApplicationDate &&
        fieldCtrlApplicationDate.value !== '') && (fieldCtrlExpiryDate == null || fieldCtrlExpiryDate.value === '')
                                           && finalRenewalExpDate && finalRenewalExpDate.value === '') {
        const firstDate = convertToDateFormat(fieldCtrlFirstDate.value).getTime();
        const applicationDateValue = convertToDateFormat(fieldCtrlApplicationDate.value).getTime();
        if (firstDate < applicationDateValue) {
          return  { variationFirstDateApplicationDateError: {fieldCtrlFirstDate : fieldCtrlFirstDate.value,
            applicationDateVal: fieldCtrlApplicationDate.value}};
        } else {
        return null;
        }
      }
      if (control.parent && (fieldCtrlFirstDate && fieldCtrlFirstDate.value !== '') &&
      (fieldCtrlApplicationDate && fieldCtrlApplicationDate.value !== '') &&
      (fieldCtrlExpiryDate && fieldCtrlExpiryDate.value !== '') && finalRenewalExpDate && finalRenewalExpDate.value === '') {
        const firstDate = convertToDateFormat(fieldCtrlFirstDate.value).getTime();
        const expiryDateValue = convertToDateFormat(fieldCtrlExpiryDate.value).getTime();
        const applicationDateValue = convertToDateFormat(fieldCtrlApplicationDate.value).getTime();
        if (firstDate < applicationDateValue || firstDate > expiryDateValue) {
          return  { variationFirstDateExpiryApplicationDateError: {fieldCtrlFirstDate : fieldCtrlFirstDate.value,
            applicationDateVal: fieldCtrlApplicationDate.value, expiryDateVal: fieldCtrlExpiryDate.value}};
        } else {
        return null;
        }
      }
      if (control.parent && (fieldCtrlFirstDate && fieldCtrlFirstDate.value !== '') &&
      (fieldCtrlApplicationDate && fieldCtrlApplicationDate.value !== '') &&
      finalRenewalExpDate && finalRenewalExpDate.value !== '') {
        const firstDate = convertToDateFormat(fieldCtrlFirstDate.value).getTime();
        const applicationDateValue = convertToDateFormat(fieldCtrlApplicationDate.value).getTime();
        const finalRenewalExpDateVal = convertToDateFormat(finalRenewalExpDate.value).getTime();
        if (firstDate < applicationDateValue || firstDate > finalRenewalExpDateVal) {
          return  { variationFirstDateRenewalExpiryApplicationDateError: {fieldCtrlFirstDate : fieldCtrlFirstDate.value,
            applicationDateVal: fieldCtrlApplicationDate.value, finalRenewalExpDateVal: finalRenewalExpDate.value}};
        } else {
        return null;
        }
      }
      };
}

// method to validate the Bg Tnx and currency field: Throw error if BG Amt and BG currency code is null
export function validateForNullTnxAmtCurrencyField(tnxCurCode: string, tnxAmt: string): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (tnxCurCode !== undefined && tnxAmt !== undefined) {
      if (tnxAmt === '' || tnxCurCode === '') {
        return { tnxAmtCurrencyError: {currCode: control.value}};
      } else if (tnxAmt !== '' || tnxCurCode !== '') {
       return null;
      }
    }
 };
}

// method to validate Increase/Decrease percentage field. Throw error if variation percent is greater than 100
export function validateVariationPercent(variationpercent: string): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (variationpercent !== undefined && variationpercent !== '') {
      if (variationpercent > '100') {
        return { variationPercError: {variationpercent}};
      } else {
       return null;
      }
    }
 };
}

// method to validate the percentage: Throw error if percentage is zero
export function validateZeroPercentage(variationPerc: string): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (variationPerc !== undefined) {
      if (variationPerc === '0') {
        return { zeroPercentageError: {perc: variationPerc}};
      } else {
       return null;
      }
    }
 };
}

// method to validate the Days in month: Throw error if days is more than 31
export function validateVariationDaysInMonth(variationDays: string): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (variationDays !== undefined) {
      if (parseInt(variationDays, 10) > Constants.LENGTH_31) {
        return { variationDaysError: {variatoinDays: variationDays}};
      } else {
       return null;
      }
    }
 };
}

// method to validate Increase/Decrease Amount field. Throw error if Amount is greater than tnx Amt
export function validateVariationAmount(variationAmt: string, tnxAmt: string): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (variationAmt !== undefined && tnxAmt !== undefined && variationAmt !== '' && tnxAmt !== '') {
      const varAmtNumber = parseInt(variationAmt, 10);
      const tnxAmtNumber = parseInt(tnxAmt, 10);
      if (varAmtNumber > tnxAmtNumber) {
        return { variationAmtError: {variationAmt}};
      } else {
       return null;
      }
    }
 };
}

// method to validate the first date of last cycle: Throw error if first date of last cycle is greater than Expiry/Final Exp date
export function validateVariationFrequency(firstDateOfLastCycle: string, finalRenewalExpDate: string, expDateString: string): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (firstDateOfLastCycle !== undefined && firstDateOfLastCycle !== '' && finalRenewalExpDate !== undefined) {
      if (firstDateOfLastCycle > finalRenewalExpDate) {
        return { variationFrequencyError: {expDateString}};
      } else {
       return null;
      }
    }
 };
}

export function validateVariationDaysNumber(currentDate: string, finalFirstDate: string, expDateString: string): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (currentDate > finalFirstDate) {
        return { variationNumberDays: {expDateString}};
      } else {
       return null;
      }
 };
}

export function validateMaxFirstDate(selectedFirstDate: string, maximumDate: string, dateType: string): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (selectedFirstDate !== undefined && selectedFirstDate !== '' && maximumDate !== undefined && maximumDate !== '') {
      if (selectedFirstDate === maximumDate) {
        return { variationMaxDateError: {dateType}};
      } else if (selectedFirstDate > maximumDate) {
        return { variationMaxDateGreaterError: {dateType}};
      } else {
       return null;
      }
    }
  };
}

export function getAmountWithoutLanguageFormatting(amt) {
  const userLanguage = window[Constants.USER_LANGUAGE];
  if (userLanguage === Constants.LANGUAGE_FR) {
    amt = amt.replaceAll(Constants.COMMA, Constants.DOT);
    amt = amt.replaceAll(Constants.FRENCH_THOUSAND_SEPARATOR, '');
  } else if (userLanguage === Constants.LANGUAGE_AR) {
    amt = amt.replaceAll(Constants.ARABIC_DECIMAL_SEPARATOR, Constants.DOT);
    amt = amt.replaceAll(Constants.ARABIC_THOUSAND_SEPARATOR, '');
  } else {
    amt = amt.replaceAll(Constants.COMMA, '');
  }
  return amt;
}
export function validateDateLessWithCurrentDate(dateString: string, currentDate: string, isValidationReq: boolean): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (control.value !== undefined && control.value !== '') {
    const current = convertToDateFormat(currentDate).getTime();
    const selectedDate = convertToDateFormat(control.value).getTime();
    if (selectedDate < current) {
      return {date1LesserThancurrentDate: {dateString, date1: control.value, date2: currentDate}};
      } else {
        return null;
      }
    } else {
      if (isValidationReq) {
        return {required : {value: control}};
      } else {
        return null;
      }
    }
  };
}

export function validateDateWithDateRange(date: string, lowerDate: string, upperDate: string, dateType: string,
                                          lowerType: string, upperType: string): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (control.parent && date !== '' && lowerDate !== '' && upperDate !== '') {
      const d1 = convertToDateFormat(date).getTime();
      const d2 = convertToDateFormat(lowerDate).getTime();
      const d3 = convertToDateFormat(upperDate).getTime();
      if (d1 < d2 || d1 > d3  ) {
        return {dateNotWithinRange: {dateType, lowerType, upperType, date}};
    } else {
   return null;
    }
  }
    };
}

export function validateSettlementDocumentAmount(tnxAmt: string, documentAmt: string): ValidatorFn {
  return(control: AbstractControl): { [key: string]: any } | null => {
    if (tnxAmt !== undefined && tnxAmt !== '' && documentAmt !== '') {
      const docAmt = parseFloat(getAmountWithoutLanguageFormatting(documentAmt));
      const tnxAmtNumber = parseFloat(getAmountWithoutLanguageFormatting(tnxAmt));
      if (tnxAmtNumber > docAmt) {
        return {tnxAmtGreaterThanDocumentAmt: {tnxAmount: tnxAmt, documentAmount: documentAmt}};
      } else {
       return null;
      }
    }
 };
}

