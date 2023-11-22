import { Injectable } from '@angular/core';
import { CurrencyConverterPipe } from '../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { FccGlobalConstant } from '../core/fcc-global-constants';

/**
 * This file handles all license details related events.
 */
@Injectable({
  providedIn: 'root'
})
export class LicenseDetailsHandlerService {

  constructor(protected currencyConverterPipe: CurrencyConverterPipe) { }

  /**
   * Validate multiple licenses.
   * @param form The form.
   * @param currency The currency.
   * @param tnxAmount The transaction amount.
   */
  ValidateMultipleLicense(form, currency, tnxAmount) {
    const data = 'data';
    const tnsAmountStatus = 'tnsAmountStatus';
    let licenseArr;
    if (form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== '' &&
      form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== null &&
      form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== undefined) {
      licenseArr = form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data];
    }
    form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][tnsAmountStatus] = false;
    let sum = 0;
    if (licenseArr !== null && licenseArr !== undefined && licenseArr !== '') {
      for (let i = 0; i < licenseArr.length; i++) {
        if (licenseArr[i].amount !== '' && licenseArr[i].amount !== null && licenseArr[i].amount !== undefined) {
          let amount = licenseArr[i].amount;
          amount = this.replaceCurrency(amount);
          amount = parseFloat(amount);
          sum = sum + amount;
          licenseArr[i].amount = this.currencyConverterPipe.transform(amount.toString(), currency);
        }
      }
    }
    if (sum !== tnxAmount && licenseArr !== null && licenseArr !== undefined && (licenseArr.length > 0)) {
      form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][tnsAmountStatus] = true;
      form.get(FccGlobalConstant.LICENSE).setErrors({ invalid: true });
    } else {
      form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][tnsAmountStatus] = false;
      form.get(FccGlobalConstant.LICENSE).setErrors(null);
    }
    form.updateValueAndValidity();
  }

  replaceCurrency(amount: any) {
    const lang = localStorage.getItem('language');
    if (lang === 'fr') {
          let updateAmount = amount.replace(/,/g, '.');
          updateAmount = updateAmount.replace(/ /g, '');
          if ((updateAmount.match(/[^a-zA-Z0-9. ]/g)) !== null) {
            updateAmount = updateAmount.replace(/[^a-zA-Z0-9. ]/g, '');
          }
          return updateAmount;
    } else if (lang === FccGlobalConstant.LANGUAGE_AR) {
        const updateAmount = amount.replace(/٫/g, '.');
        amount = updateAmount.replace(/٬/g, ',');
        return amount.replace(/,/g, '');
    } else {
        return amount.replace(/[^0-9.]/g, '');
    }
  }

  /**
   * Get the value.
   * @param val The value.
   */
  getValue(val: any) {
    return val ? val : '';
  }

  /**
   * Get the type of form model.
   * @param key The key.
   * @param typeVal The value type.
   * @param formModelArray The form model array.
   */
  getType(key, typeVal, formModelArray) {
    let retuntype;
    for (let i = 0; i < formModelArray.length; i++) {
      try {
        if (key.toString() === formModelArray[i][key][FccGlobalConstant.NAME].toString()) {
          retuntype = formModelArray[i][key][FccGlobalConstant.TYPE];
        }
      } catch (e) {
      }
    }
    return retuntype;
  }

  /**
   * Gets the edit status.
   * @param key The key.
   * @param status The status.
   * @param formModelArray The form model array.
   */
  getEditStatus(key, status, formModelArray) {
    let retuntype;
    for (let i = 0; i < formModelArray.length; i++) {
      try {
        if (key.toString() === formModelArray[i][key][FccGlobalConstant.NAME].toString()) {
          retuntype = formModelArray[i][key][FccGlobalConstant.EDIT_STATUS];
        }
      } catch (e) {
      }
    }
    return retuntype;
  }

  /**
   * Perform action on license field on blur event.
   * @param event The event.
   * @param key The key.
   * @param form The form.
   * @param currency The currency.
   */
  onBlurLicense(event: any, key: any, form, currency) {
    const data = 'data';
    const licenseArr1 = form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data];
    licenseArr1.forEach(element => {
      if (element.amount) {
        const amountValue = this.replaceCurrency(element.amount);
        element.amount = this.currencyConverterPipe.transform(amountValue.toString(), currency);
      }
    });
    form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] = licenseArr1;
    const OverDrawStatus = 'OverDrawStatus';
    form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][OverDrawStatus] = false;
  }

  /**
   * Updates the data array.
   * @param form The form.
   * @param operation The operation.
   * @param currency The currency.
   */
  updateDataArray(form, operation, currency) {
    const data = 'data';
    const finalArr = [];
    const lsRefId = 'ls_ref_id';
    const lsAllocatedAmt = 'ls_allocated_amt';
    const licenseArr = form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data];
    if (form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== '' &&
      form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== null &&
      form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== undefined) {
      for (let i = 0; i < licenseArr.length; i++) {
        const obj = {};
        obj[lsRefId] = licenseArr[i].REF_ID;
        obj[lsAllocatedAmt] = this.replaceCurrency(licenseArr[i].amount);
        if (operation !== 'LIST_INQUIRY') {
          licenseArr[i].currency = currency;
        }
        finalArr.push(obj);
      }
    }
    let obj2 = {};
    obj2[FccGlobalConstant.LICENSE] = finalArr;
    obj2 = JSON.stringify(obj2);
    form.get(FccGlobalConstant.LINKEDLICENSES).setValue(obj2);
  }

}
