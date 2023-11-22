import { AbstractControl, ValidatorFn } from '@angular/forms';

export function firstDateApplicationDateError(control: AbstractControl) {
  return { firstDateApplicationDateError: {
    parsedDomain: control.value
  }
};
}

export function effectiveExpiryDateError(control: AbstractControl) {
  return { effectiveExpiryDateError: {
    parsedDomain: control.value
  }
};
}

export function shipmentExpiryDateError(control: AbstractControl) {
  return { shipmentExpiryDateError: {
    parsedDomain: control.value
  }
};
}

export function lastShipmentDateError(control: AbstractControl) {
  return { lastShipmentDateError: {
    parsedDomain: control.value
  }
};
}

export function earliestShipmentDateError(control: AbstractControl) {
  return { earliestShipmentDateError: {
    parsedDomain: control.value
  }
};
}

export function earliestShipmentDateExpiryError(control: AbstractControl) {
  return { earliestShipmentDateExpiryError: {
    parsedDomain: control.value
  }
};
}

export function compareExpDateWithEarliestShipmentDate(control: AbstractControl) {
  return { compareExpDateWithEarliestShipmentDate: {
    parsedDomain: control.value
  }
};
}

export function firstDateApplicationExtensionExpiryError(control: AbstractControl) {
  return { firstDateApplicationExtensionExpiryError: {
    parsedDomain: control.value
  }
};
}

export function firstDateExpiryApplicationDateError(control: AbstractControl) {
  return { firstDateExpiryApplicationDateError: {
    parsedDomain: control.value
  }
};
}


export function variationNumberDaysExpiryDateError(control: AbstractControl) {
  return { variationNumberDaysExpiryDateError: {
    parsedDomain: control.value
  }
};
}

export function variationNumberDaysFinalExpiryDateError(control: AbstractControl) {
  return { variationNumberDaysFinalExpiryDateError: {
    parsedDomain: control.value
  }
};
}

// method to validate Increase/Decrease Amount field. Throw error if Amount is greater than tnx Amt
// For decrease operation, the decrease amount should be less than the undertaking amount.
// If greater or equal, then the bg amt will become negative value.
export function validateVariationAmount(control: AbstractControl) {
        return { variationAmtGreaterThanBgAmt: {
          parsedDomain: control.value
        } };
}


// method to validate Increase/Decrease percentage field. Throw error if variation percent is greater than 100
export function validateVariationPercentForDecrease(control: AbstractControl) {
  return { variationPctDecreasePatternError: {
    parsedDomain: control.value
  } };

}

// method to validate the first date of last cycle: Throw error if first date of last cycle is greater than Expiry/Final Exp date
export function validateVariationFrequency(firstDateOfLastCycle: string, finalRenewalExpDate: string, expDateString: string): ValidatorFn {
  return(): { [key: string]: any } | null => {
    if (firstDateOfLastCycle !== undefined && firstDateOfLastCycle !== '' && finalRenewalExpDate !== undefined) {
      if (firstDateOfLastCycle > finalRenewalExpDate) {
        return { variationFrequencyError: { expDateString } };
      } else {
       return null;
      }
    }
 };
}

export function validateVariationDaysNumber(currentDate: string, finalFirstDate: string, expDateString: string): ValidatorFn {
  return(): { [key: string]: any } | null => {
    if (currentDate > finalFirstDate) {
        return { variationNumberDays: { expDateString } };
      } else {
       return null;
      }
 };
}

export function validateMaxFirstDate(selectedFirstDate: string, maximumDate: string, dateType: string): ValidatorFn {
  return(): { [key: string]: any } | null => {
    if (selectedFirstDate !== undefined && selectedFirstDate !== '' && maximumDate !== undefined && maximumDate !== '') {
      if (selectedFirstDate === maximumDate) {
        return { variationMaxDateError: { dateType } };
      } else if (selectedFirstDate > maximumDate) {
        return { variationMaxDateGreaterError: { dateType } };
      } else {
       return null;
      }
    }
  };
}

export function validateSettlementAmount(tnxAmtValue, claimAmtValue): ValidatorFn {
      return(control: AbstractControl): { [key: string]: any } | null => {
          if (tnxAmtValue > claimAmtValue) {
            return { settlementAmtLessThanLCAmt: { parsedDomain: control.value
            } };
          } else if (tnxAmtValue <= 0) {
            return { settlementAmtLessThanOrEqualToZero: { parsedDomain: control.value
            } };
          }
          return null;
      };
}

export function validateAmountLength(originValue, maxLength): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (originValue.length > maxLength) {
      return { amountLengthGreaterThanMaxLength: { parsedDomain: control.value } };
    }
    return null;
  };
}
