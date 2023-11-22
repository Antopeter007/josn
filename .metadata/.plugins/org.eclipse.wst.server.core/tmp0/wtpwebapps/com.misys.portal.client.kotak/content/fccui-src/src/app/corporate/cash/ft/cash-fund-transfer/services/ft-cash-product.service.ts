/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { ProductValidator } from '../../../../common/validator/productValidator';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { DatePipe } from '@angular/common';
import { CurrencyConverterPipe } from './../../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { emptyCurrency,
  orderingAndTransfereeAccountNotBeSame,
  amountToBeNumericAndGreaterThanZero, } from './../../../../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { FCCBase } from 'public_api';
import { CashCommonDataService } from './../../../services/cash-common-data.service';
import { CommonService } from '../../../../../common/services/common.service';
import { HolidayCalendarService } from '../../../../../common/services/holiday-calendar.service';




@Injectable({
  providedIn: 'root',
})
export class FtCashProductService {

  constructor(protected eventEmitterService: EventEmitterService,
    protected translateService: TranslateService,
    protected commonService: CommonService,
    protected datepipe: DatePipe,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected cashCommonDataService: CashCommonDataService) {
   // super();
  }
  val: any;
  flagDecimalPlaces: number;
  enteredCurMethod = false;
  iso: any;
  isoamt: any;
  allowedDecimals = -1;
  amountValidationConfig : any;


  onClickCurrency(form: FCCFormGroup, amtField: string, event: any) {
    form.get(amtField).clearValidators();
    if (event.value !== undefined) {
      this.enteredCurMethod = true;
      this.iso = event.value.currency ? event.value.currency : event.value.currencyCode;
      this.isoamt = this.iso;
      const amt = form.get(amtField);
      this.val = amt.value;

      form.addFCCValidators(amtField,
        Validators.compose([Validators.required, Validators.pattern(this.commonService.getRegexBasedOnlanguage())]), 0);
     // this.setMandatoryField(form, amtField, true);
      this.flagDecimalPlaces = 0;
      if (this.val !== '' && this.val !== null) {
        let valueupdated = this.commonService.replaceCurrency(this.val);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
        form.get(amtField).setValue(valueupdated);
      }
     form.get(amtField).updateValueAndValidity();
    }
  }




  onBlurAmt(form: FCCFormGroup, element: string) {
    form.get(element).clearValidators();
    const amt = form.get(element);
    this.val = amt.value;
    if (this.val !== '') {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        form.get(element).setValidators(emptyCurrency);
      }
      if (this.iso !== '') {
        this.allowedDecimals = FccGlobalConstant.LENGTH_0;
        let valueupdated = this.commonService.currencyReplace(this.val);
        valueupdated = this.currencyConverterPipe.transformation(valueupdated.toString(), this.iso);
        form.get(element).setValue(valueupdated);
        this.amountValidation(form,element);
      }
      form.get(element).updateValueAndValidity();
    }
    else {
      form.get('ftAmt').setValidators(Validators.required);
    }
  }

  amountValidation(form: FCCFormGroup,amtField) {
    let transferAmt = form.get(amtField).value;
    if(transferAmt.match(/[,٫٬]/g))
    {
      transferAmt = transferAmt.replace(/,/g, '.');
      transferAmt = transferAmt.replace(/٫/g, '.');
      transferAmt = transferAmt.replace(/٬/g, '.');
    }
    const transferAmtFloatValue = parseFloat(transferAmt.toString());
    form.get(amtField).clearValidators();
    if (transferAmtFloatValue === 0 || transferAmt === '') {
      form.get(amtField).setValidators([amountToBeNumericAndGreaterThanZero]);
      form.get(amtField).markAsDirty();
      form.get(amtField).markAsTouched();
    }
    form.get(amtField).updateValueAndValidity();
  }


  beforeSaveValidation(form?: any): boolean {
    return true;
  }

  /**
   * Invoked before submit
   */
  beforeSubmitValidation(): boolean {
    const isValid = this.validate();
    this.eventEmitterService.subFlag.next(isValid);
    return true;
  }

  validate() {
    const isValid = true;
    return isValid;
  }
}
