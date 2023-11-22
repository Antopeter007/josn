
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { LcReturnService } from '../services/lc-return.service';

@Pipe({
  name: 'currencyConverter'
})
export class CurrencyConverterPipe implements PipeTransform {
  formattedValue: any;
  currenciesWithThreeDecimals: any;
  currenciesWithZeroDecimals: any;

  constructor(protected currencyPipe: CurrencyPipe, protected lcReturn: LcReturnService) { }

  transform(value: any, iso: any) {
  let amountConfig = '';
  this.lcReturn.loadDefaultConfiguration().subscribe(response => {
    if (response) {
      this.currenciesWithThreeDecimals = response.currencyDecimalplacesThree;
      this.currenciesWithZeroDecimals = response.currencyDecimalplacesZero;
    }
  });
    let data = this.lcReturn.amountConfigMap.getValue();
    if (data.length === 0) {
      data = JSON.parse(sessionStorage.getItem('amountConfig'));
    }
    if (this.lcReturn.isNonEmptyValue(data) && (data || data[iso])) {
      if (this.lcReturn.isNonEmptyValue(data[iso])) {
        amountConfig = data[iso];
      } else {
        amountConfig = data[FccGlobalConstant.ENTITY_DEFAULT];
      }
    }
    const isAmountConfigured = amountConfig === '2' ? true : false;
    let decimalFraction;
    if (this.currenciesWithThreeDecimals && this.currenciesWithThreeDecimals.indexOf(iso) > -1) {
      decimalFraction = FccGlobalConstant.LENGTH_3;
    } else if (this.currenciesWithZeroDecimals && this.currenciesWithZeroDecimals.indexOf(iso) > -1) {
      decimalFraction = FccGlobalConstant.LENGTH_0;
    } else {
      decimalFraction = FccGlobalConstant.LENGTH_2;
    }
    let language = localStorage.getItem('language');
    if (language === 'ar') {
      if (isAmountConfigured) {
        this.formattedValue = Intl.NumberFormat(FccGlobalConstant.INDIAN_LOCALE, {
          minimumFractionDigits: decimalFraction,
          maximumFractionDigits: decimalFraction,
        }).format((value.replace('٫', '.').replace(/,/g, '').replace(/٬/g,'')));
        return this.formattedValue.replace('.', '٫');
      } else {
        this.formattedValue = Intl.NumberFormat(FccGlobalConstant.DEFAULT_LOCALE, {
          minimumFractionDigits: decimalFraction,
          maximumFractionDigits: decimalFraction,
        }).format((value.replace('٫', '.').replace(/,/g, '').replace(/٬/g,'')));
        return this.formattedValue.replace('.', '٫');
      }
    } else if (language === 'fr') {
      if (isAmountConfigured) {
        this.formattedValue = Intl.NumberFormat(FccGlobalConstant.INDIAN_LOCALE, {
          minimumFractionDigits: decimalFraction,
          maximumFractionDigits: decimalFraction,
        }).format((value.replace(/\s/g, '').replace(/,/g, '.')));
        return this.formattedValue.replaceAll(/,/g, ' ').replace(/\./g, ',');
      } else {
        this.formattedValue = Intl.NumberFormat(FccGlobalConstant.DEFAULT_LOCALE, {
          minimumFractionDigits: decimalFraction,
          maximumFractionDigits: decimalFraction,
        }).format((value.replace(/\s/g, '').replace(/,/g, '.')));
        return this.formattedValue.replaceAll(/,/g, ' ').replace(/\./g, ',');
      }
    } else {
      if (language === 'us') {
        language = 'en';
      }
      if (value === '' || value === undefined || value === null) {
        return '';
      }
      if (isAmountConfigured) {
        this.formattedValue = Intl.NumberFormat(FccGlobalConstant.INDIAN_LOCALE, {
          minimumFractionDigits: decimalFraction,
          maximumFractionDigits: decimalFraction,
        }).format((value.replace(/,/g, '')));
        return this.formattedValue;
      } else {
        this.formattedValue = Intl.NumberFormat(FccGlobalConstant.DEFAULT_LOCALE, {
          minimumFractionDigits: decimalFraction,
          maximumFractionDigits: decimalFraction,
        }).format((value.replace(/,/g, '')));
        return this.formattedValue;
      }
    }
  }

  transformation(value: any, iso: any) {
    let amountConfig = '';
    const amount = parseFloat(value.toString());
    if (value === "." || amount === 0) {
      value = '' ;
    }
      let data = this.lcReturn.amountConfigMap.getValue();
      if (data.length === 0) {
        data = JSON.parse(sessionStorage.getItem('amountConfig'));
      }
      if (data || data[iso]){
        if (this.lcReturn.isNonEmptyValue(data[iso])) {
          amountConfig = data[iso];
        } else {
          amountConfig = data[FccGlobalConstant.ENTITY_DEFAULT];
        }
      }
      const isAmountConfigured = amountConfig === '2' ? true : false;
      let decimalFraction;
      if (value != "" && (iso === FccGlobalConstant.OMR || iso === FccGlobalConstant.BHD || iso === FccGlobalConstant.TND)) {
        decimalFraction = FccGlobalConstant.LENGTH_3;
      } else if (value != "" && (iso === FccGlobalConstant.JPY || iso === FccGlobalConstant.ADP)) {
        decimalFraction = FccGlobalConstant.LENGTH_0;
      } else if(value != "") {
        decimalFraction = FccGlobalConstant.LENGTH_2;
      }
      let language = localStorage.getItem('language');
      if (language === 'ar') {
        if (isAmountConfigured && decimalFraction) {
          this.formattedValue = Intl.NumberFormat(FccGlobalConstant.INDIAN_LOCALE, {
            minimumFractionDigits: decimalFraction,
            maximumFractionDigits: decimalFraction,
          }).format((value.replace('٫', '.').replace(/,/g, '').replace(/٬/g,'')));
          return this.formattedValue.replace('.', '٫');
        } else if(decimalFraction) {
          this.formattedValue = Intl.NumberFormat(FccGlobalConstant.DEFAULT_LOCALE, {
            minimumFractionDigits: decimalFraction,
            maximumFractionDigits: decimalFraction,
          }).format((value.replace('٫', '.').replace(/,/g, '').replace(/٬/g,'')));
          return this.formattedValue.replace('.', '٫');
        }
      } else if (language === 'fr') {
        if (isAmountConfigured && decimalFraction) {
          this.formattedValue = Intl.NumberFormat(FccGlobalConstant.INDIAN_LOCALE, {
            minimumFractionDigits: decimalFraction,
            maximumFractionDigits: decimalFraction,
          }).format((value.replace(/\s/g, '').replace(/,/g, '.')));
          return this.formattedValue.replaceAll(/,/g, ' ').replace(/\./g, ',');
        } else if(decimalFraction) {
          this.formattedValue = Intl.NumberFormat(FccGlobalConstant.DEFAULT_LOCALE, {
            minimumFractionDigits: decimalFraction,
            maximumFractionDigits: decimalFraction,
          }).format((value.replace(/\s/g, '').replace(/,/g, '.')));
          return this.formattedValue.replaceAll(/,/g, ' ').replace(/\./g, ',');
        }
      } else if (language === 'us') {
          language = 'en';
        }
        if (isAmountConfigured && decimalFraction) {
          this.formattedValue = Intl.NumberFormat(FccGlobalConstant.INDIAN_LOCALE, {
            minimumFractionDigits: decimalFraction,
            maximumFractionDigits: decimalFraction,
          }).format((value.replace(/,/g, '')));
          return this.formattedValue;
        } else if(decimalFraction) {
          this.formattedValue = Intl.NumberFormat(FccGlobalConstant.DEFAULT_LOCALE, {
            minimumFractionDigits: decimalFraction,
            maximumFractionDigits: decimalFraction,
          }).format((value.replace(/,/g, '')));
          return this.formattedValue;
        }
        return value;
      }
    }


