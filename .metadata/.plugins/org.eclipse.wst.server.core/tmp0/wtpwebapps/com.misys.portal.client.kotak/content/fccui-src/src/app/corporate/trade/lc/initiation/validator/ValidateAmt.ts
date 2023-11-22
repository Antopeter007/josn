import { AbstractControl } from '@angular/forms';

/* This Method is to test whether there are 2 digits after decimal for specific currencies*/
export function validateAmtTwoDecimal(control: AbstractControl) {
  if (control.value && control.value.match(/^\d{0,1}(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})\.?\d{0,2}$/g)) {
    return null;
  } else {
    return { decimalvalidator: {
      parsedDomain: control.value
    }
  };
}
}

/* This Method is to test whether there are 3 digits after decimal for specific currencies*/
export function validateAmtThreeDecimal(control: AbstractControl) {
  if (control.value.match(/^\d{0,3}(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})\.?\d{0,3}$/g)) {
    return null;
  } else {
    return { decimalvalidator: {
      parsedDomain: control.value
    }
  };
}
}

/* This Method is to test whether there are 0 digits after decimal for specific currencies*/
export function validateAmtZeroDecimal(control: AbstractControl) {
  if (control.value.match(/^\d{0,1}(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})?$/)) {
    return null;
  } else {
    return { decimalvalidator: {
      parsedDomain: control.value
    }
  };
}
}

export function emptyCurrency(control: AbstractControl) {
    return { emptycurrency: {
      parsedDomain: control.value
    }
  };
}

export function amountCanNotBeZero(control: AbstractControl) {
  return { amountCanNotBeZero: {
    parsedDomain: control.value
    }
  };
}

export function amountToBeNumericAndGreaterThanZero(control: AbstractControl) {
  return { amountToBeNumericAndGreaterThanZero: {
    parsedDomain: control.value
    }
  };
}

export function invalidAmount(control: AbstractControl) {
  return { invalidAmount: {
    parsedDomain: control.value
    }
  };
}


export function settlementAmtLessThanOutstandingAmt(control: AbstractControl) {
  return { settlementAmtLessThanOutstandingAmt: {
    parsedDomain: control.value
    }
  };
}

export function zeroAmount(control: AbstractControl) {
  return { zeroamount: {
    parsedDomain: control.value
  }
};
}

export function amountMaxRangeReached(control: AbstractControl) {
  return { amountMaxRangeReached: {
    parsedDomain: control.value
  }
};
}

export function amountMaxLengthRangeReached(control: AbstractControl) {
  return { amountMaxLengthRangeReached: {
    parsedDomain: control.value
  }
};
}

export function deductionsRangeReached(control: AbstractControl) {
  return { deductionsRangeReached: {
    parsedDomain: control.value
  }
};
}

export function transferAmtGreaterThanAvailableAmt(control: AbstractControl) {
  return { transferAmtGreaterThanAvailableAmt: {
    parsedDomain: control.value
  }
};
}

export function assignmentAmtGreaterThanAvailableAmt(control: AbstractControl) {
  return { assignmentAmtGreaterThanAvailableAmt: {
    parsedDomain: control.value
  }
};
}

export function releaseAmtGreaterThanAvailableAmt(control: AbstractControl) {
  return { releaseAmtGreaterThanAvailableAmt: {
    parsedDomain: control.value
  }
};
}

export function orderingAndTransfereeAccountNotBeSame(control: AbstractControl) {
  return { orderingAndTransfereeAccountNotBeSame: {
    parsedDomain: control.value
  }
};
}

export function guaranteeAmtGreaterThanLCAmt(control: AbstractControl) {
  return { guaranteeAmtGreaterThanLCAmt: {
    parsedDomain: control.value
  }
};
}

export function guaranteeAmtGreaterThanLCAvailableAmt(control: AbstractControl) {
  return { guaranteeAmtGreaterThanLCAvailableAmt: {
    parsedDomain: control.value,
    maxAmt: control.errors.guaranteeAmtGreaterThanLCAvailableAmt.maxAmt
  }
};
}

export function invalidTwoDecimalTransferAmt(control: AbstractControl) {
  if (control.value){
  if (control.value.match(/^\d{0,3}(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})\.?\d{0,2}$/g)) {
    return null;
  } else {
    return { invalidAmt : true };
}
  }
}

export function invalidThreeDecimalTransferAmt(control: AbstractControl) {
  if (control.value){
  if (control.value.match(/^\d{0,2}(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})\.?\d{0,3}$/g)) {
    return null;
  } else {
    return { invalidAmt : true };
}
}
}

export function invalidZeroDecimalTransferAmt(control: AbstractControl) {
  if (control.value){
  if (control.value.match(/^\d{0,2}(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})?$/)) {
    return null;
  } else {
    return { invalidAmt : true };
  }
}
}

export function invalidTwoDecimalReleaseAmt(control: AbstractControl) {
  if (control.value){
  if (control.value.match(/^\d{0,3}(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})\.?\d{0,2}$/g)) {
    return null;
  } else {
    return { invalidAmt : true };
}
  }
}

export function invalidThreeDecimalReleaseAmt(control: AbstractControl) {
  if (control.value){
  if (control.value.match(/^\d{0,2}(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})\.?\d{0,3}$/g)) {
    return null;
  } else {
    return { invalidAmt : true };
}
}
}

export function invalidZeroDecimalReleaseAmt(control: AbstractControl) {
  if (control.value){
  if (control.value.match(/^\d{0,2}(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})?$/)) {
    return null;
  } else {
    return { invalidAmt : true };
  }
}
}

export function validateAmtZeroDecimalEC(control: AbstractControl) {
  if (control.value.match(/^\d{0,3}(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})(,{0,1}\d{0,3})?$/g)) {
    return null;
  } else {
    return { invalidAmt : true };
  }
}
