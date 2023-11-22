import { AbstractControl } from '@angular/forms';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';


export function transferExpiryDateLessThenOriginalexpiryDate(control: AbstractControl) {
    return { transferExpiryDateLessThenOriginalexpiryDate: {
      parsedDomain: control.value
    }
  };
  }

export function transferExpiryDateLessThanCurrentDate(control: AbstractControl) {
  return { transferExpiryDateLessThanCurrentDate: {
    parsedDomain: control.value
  }
};
}

export function transferDateLessThanCurrentDate(control: AbstractControl) {
  return { transferDateLessThanCurrentDate: {
    parsedDomain: control.value
  }
};
}
export function startDateLessThanMinDate(control: AbstractControl) {
  return { startDateLessThanMinDate: {
    parsedDomain: control.value
  }
};
}
export function startDateGreaterThanMaxDate(control: AbstractControl) {
  return { startDateGreaterThanMaxDate: {
    parsedDomain: control.value
  }
};
}
export function transferShipmentDateGreaterThanELShipmentDate(control: AbstractControl) {
  return { transferShipmentDateGreaterThanELShipmentDate: {
    parsedDomain: control.value
  }
};
}

export function transferShipmentDateLessThanCurrentDate(control: AbstractControl) {
  return { transferShipmentDateLessThanCurrentDate: {
    parsedDomain: control.value
  }
};
}

export function transferShipmentDateGreaterThanELExpiryDate(control: AbstractControl) {
  return { transferShipmentDateGreaterThanELExpiryDate: {
    parsedDomain: control.value
  }
};
}

export function expiryDateLessThanCurrentDate(control: AbstractControl) {
      return { expiryDateLessThanCurrentDate: {
        parsedDomain: control.value
      }
    };
    }

export function transferDateIsHoliday(control: AbstractControl) {
      return { transferDateIsHoliday: {
        parsedDomain:control.value
      }
    };
    }

    export function transferDateIsExceedingFutureDate(control: AbstractControl) {
    
      return { transferDateIsExceedingFutureDate: {
        parsedDomain: control['params']['displayMaxDate']
      }
    };
    }


    
export function invalidDate(control: AbstractControl) {
  return { invalidDate: {
    parsedDomain: control.value
  }
};
}

export function compareExpiryDateToCurrentDate(control: AbstractControl) {
  let expiryDate = control.value;
  const currentDate = control['params'].minDate;
  if ((expiryDate !== null && expiryDate !== '')) {
      expiryDate = `${expiryDate.getDate()}/${(expiryDate.getMonth() + 1)}/${expiryDate.getFullYear()}`;
      const dateParts = expiryDate.split('/');
      const userLanguage = window[FccGlobalConstant.USER_LANGUAGE];
      if (userLanguage === FccGlobalConstant.LANGUAGE_US) {
        expiryDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[0] - 1, +dateParts[1]);
      } else {
        expiryDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[1] - 1, +dateParts[0]);
      }

      if ((expiryDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) ) {
      return { expiryDateLessThanCurrentDate: {
        parsedDomain: control.value
      }
    };
    }
  } else {
    return null;
  }
}

export function compareValueDateToCurrentDate(control: AbstractControl) {
  let expiryDate = control.value;
  const currentDate = new Date();
  if ((expiryDate !== null && expiryDate !== '')) {
      expiryDate = `${expiryDate.getDate()}/${(expiryDate.getMonth() + 1)}/${expiryDate.getFullYear()}`;
      const dateParts = expiryDate.split('/');
      const userLanguage = window[FccGlobalConstant.USER_LANGUAGE];
      if (userLanguage === FccGlobalConstant.LANGUAGE_US) {
        expiryDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[0] - 1, +dateParts[1]);
      } else {
        expiryDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[1] - 1, +dateParts[0]);
      }

      if ((expiryDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) ) {
      return { valueDateLessThanCurrentDate: {
        parsedDomain: control.value
      }
    };
    }
  } else {
    return null;
  }
}

export function compareExpiryDateEqualToCurrentDate(control: AbstractControl) {
  let expiryDate = control.value;
  const currentDate = control['params'].minDate;
  if ((expiryDate !== null && expiryDate !== '')) {
      expiryDate = `${expiryDate.getDate()}/${(expiryDate.getMonth() + 1)}/${expiryDate.getFullYear()}`;
      const dateParts = expiryDate.split('/');
      const userLanguage = window[FccGlobalConstant.USER_LANGUAGE];
      if (userLanguage === FccGlobalConstant.LANGUAGE_US) {
        expiryDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[0] - 1, +dateParts[1]);
      } else {
        expiryDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[1] - 1, +dateParts[0]);
      }

      if ((expiryDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) ) {
      return { expiryDateLessEqualThanCurrentDate: {
        parsedDomain: control.value
      }
    };
    }
  } else {
    return null;
  }
}

export function compareTransportDocDateEqualToCurrentDate(control: AbstractControl) {
  let expiryDate = control.value;
  const currentDate = control['params'].maxDate;
  if ((expiryDate !== null && expiryDate !== '')) {
      expiryDate = `${expiryDate.getDate()}/${(expiryDate.getMonth() + 1)}/${expiryDate.getFullYear()}`;
      const dateParts = expiryDate.split('/');
      const userLanguage = window[FccGlobalConstant.USER_LANGUAGE];
      if (userLanguage === FccGlobalConstant.LANGUAGE_US) {
        expiryDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[0] - 1, +dateParts[1]);
      } else {
        expiryDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[1] - 1, +dateParts[0]);
      }

      if ((expiryDate.setHours(0, 0, 0, 0) > currentDate.setHours(0, 0, 0, 0)) ) {
      return { transportDocDateLessEqualThanCurrentDate: {
        parsedDomain: control.value
      }
    };
    }
  } else {
    return null;
  }
}

export function compareExecutionDateToCurrentDate(control: AbstractControl) {
  let executionDate = control.value;
  const currentDate = control['params'].minDate;
  if ((executionDate !== null && executionDate !== '')) {
    executionDate = `${executionDate.getDate()}/${(executionDate.getMonth() + 1)}/${executionDate.getFullYear()}`;
    const dateParts = executionDate.split('/');
    const userLanguage = window[FccGlobalConstant.USER_LANGUAGE];
    if (userLanguage === FccGlobalConstant.LANGUAGE_US) {
        executionDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[0] - 1, +dateParts[1]);
      } else {
        executionDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[1] - 1, +dateParts[0]);
      }

    if ((executionDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) ) {
      return { executionDateLessThanCurrentDate: {
        parsedDomain: control.value
      }
    };
    }
  } else {
    return null;
  }
}
export function compareRequestDateToCurrentDate(control: AbstractControl) {
  let executionDate = control.value;
  const currentDate = new Date();
  if ((executionDate !== null && executionDate !== '')) {
    executionDate = `${executionDate.getDate()}/${(executionDate.getMonth() + 1)}/${executionDate.getFullYear()}`;
    const dateParts = executionDate.split('/');
    const userLanguage = window[FccGlobalConstant.USER_LANGUAGE];
    if (userLanguage === FccGlobalConstant.LANGUAGE_US) {
        executionDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[0] - 1, +dateParts[1]);
      } else {
        executionDate = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[1] - 1, +dateParts[0]);
      }

    if ((executionDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) ) {
      return { requestDateLessThanCurrentDate: {
        parsedDomain: control.value
      }
    };
    }
  } else {
    return null;
  }
}
export function expiryDateGreaterThanSelectedExpiryDate(control: AbstractControl) {
  return { compareNewExpiryDateToOldExpiry: {
    parsedDomain: control.value
  }
};
}

export function contractDateGreaterThanExpiryDate(control: AbstractControl) {
  return { contractDateGreaterThanExpiryDate: {
    parsedDomain: control.value
  }
};
}

export function expiryDateGreaterThanContractDate(control: AbstractControl) {
  return { expiryDateGreaterThanContractDate: {
    parsedDomain: control.value
  }
};
}

export function compareRenewalDateWithExpDate(control: AbstractControl) {
  return { compareRenewalDateWithExpDate: {
    parsedDomain: control.value
  }
};
}

export function compareRenewalFinalDateWithExpDate(control: AbstractControl) {
  return { compareRenewalFinalDateWithExpDate: {
    parsedDomain: control.value
  }
};
}

export function isEmptyExpDate(control: AbstractControl) {
  return { isEmptyExpDate: {
    parsedDomain: control.value
  }
};
}



