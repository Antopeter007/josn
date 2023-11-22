import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'customCommasInCurrencies'
})
export class CustomCommasInCurrenciesPipe implements PipeTransform {
  splitValue;

  constructor(protected currencyPipe: CurrencyPipe) {
  }

  transform(value: any, iso: any): any {
    if(value) {
      let language = localStorage.getItem('language');
      if (language === 'fr') {
         let currency = this.currencyPipe.transform(parseFloat(value.replace(',', '.').replace(/[^0-9.]+/g, '')), iso, '', '', language);
         currency = currency.replace(/\s/g, '');
         return currency;
      } else {
  
       if (language === 'us') {
           language = 'en';
        }
  
       return this.currencyPipe.transform(parseFloat(value.replace(/[^0-9.]+/g, '')), iso, '', '', language);
      }
    }
  }

  longCurrencyFormatDE(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

