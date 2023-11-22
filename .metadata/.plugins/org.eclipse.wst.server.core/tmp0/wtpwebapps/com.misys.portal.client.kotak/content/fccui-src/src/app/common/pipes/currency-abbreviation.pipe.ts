import { Pipe, PipeTransform } from '@angular/core';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { FccConstants } from '../core/fcc-constants';
import { CommonService } from '../../common/services/common.service';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'currencyAbbreviation'
})
export class CurrencyAbbreviationPipe implements PipeTransform {

  constructor(protected commonService: CommonService,
    protected translateService: TranslateService
    ) { }
  // Transforms currency value into trillions, billions and millions
  //  Or lakhs and crores if applicable
  transform(value: any): any {
    const valueAmt = value;
    let formatedAmount;
    this.commonService.getamountConfiguration();
    const data = this.commonService.amountConfigMap.getValue();
    const amountConfig = data[FccGlobalConstant.ENTITY_DEFAULT];
    const isAmountConfigured = amountConfig === '2' ? true : false;
    if (this.commonService.isnonEMptyString(valueAmt)) {
      formatedAmount = parseInt(this.commonService.replaceCurrency(valueAmt.toString()), 10);
      if (isAmountConfigured) {
        return this.convertToIndianCurrencySystem(formatedAmount) === formatedAmount ? value
          : this.commonService.isNonEmptyValue(this.convertToIndianCurrencySystem(formatedAmount)) ?
            this.convertToIndianCurrencySystem(formatedAmount) : value;
      } else {
        return this.convertToInternationalCurrencySystem(formatedAmount) === formatedAmount ? value
          : this.commonService.isNonEmptyValue(this.convertToInternationalCurrencySystem(formatedAmount)) ?
            this.convertToInternationalCurrencySystem(formatedAmount) : value;
      }
    } else {
      return value;
    }
  }

  convertToIndianCurrencySystem(amountValue): any {
    const paramDataList = this.commonService.getAmountFormatAbbvNameList();
    if (amountValue >= 1.0e+7) {     // Seven Zeroes for Crores
      const abbvName = this.getAmmountFormatAbbreviationName(paramDataList, FccConstants.CRORE);
      return parseInt(this.getParameter(amountValue, 1.0e+7), 10) / 100 + abbvName;
    } else if (amountValue >= 1.0e+5) {     // Six Zeroes for Lakhs
      const abbvName = this.getAmmountFormatAbbreviationName(paramDataList, FccConstants.LAKH);
      return parseInt(this.getParameter(amountValue, 1.0e+5), 10) / 100 + abbvName;
    } else {
      return amountValue;     // Return original value
    }
  }

  convertToInternationalCurrencySystem(amountValue): any {
    const paramDataList = this.commonService.getAmountFormatAbbvNameList();
    if (amountValue >= 1.0e+12) {     // Twelve Zeroes for Trillions
      const abbvName = this.getAmmountFormatAbbreviationName(paramDataList, FccConstants.TRILLION);
      return parseInt(this.getParameter(amountValue, 1.0e+12), 10) / 100 + abbvName;
    } else if (amountValue >= 1.0e+9) {     // Nine Zeroes for Billions
      const abbvName = this.getAmmountFormatAbbreviationName(paramDataList, FccConstants.BILLION);
      return parseInt(this.getParameter(amountValue, 1.0e+9), 10) / 100 + abbvName;
    } else if (amountValue >= 1.0e+6) {     // Six Zeroes for Millions
      const abbvName = this.getAmmountFormatAbbreviationName(paramDataList, FccConstants.MILLION);
      return parseInt(this.getParameter(amountValue, 1.0e+6), 10) / 100 + abbvName;
    } else {
      return amountValue;     // Return original value
    }
  }

  getParameter(curr, exponent): string {
    return ((curr / exponent) * 100).toString();
  }

  getAmmountFormatAbbreviationName(paramDataList: any, format: any): any {
    let selectedFormat: any;
    if (this.commonService.isNonEmptyValue(paramDataList) && paramDataList.length > 0) {
      selectedFormat = paramDataList.filter(obj => obj.data_1 === format);
    }
    if (this.commonService.isNonEmptyValue(selectedFormat) && selectedFormat.length > 0 &&
      this.commonService.isnonEMptyString(selectedFormat[0].data_2)) {
      return FccGlobalConstant.BLANK_SPACE_STRING + selectedFormat[0].data_2;
    } else {
      return FccGlobalConstant.BLANK_SPACE_STRING + this.translateService.instant(format);
    }
  }
}
