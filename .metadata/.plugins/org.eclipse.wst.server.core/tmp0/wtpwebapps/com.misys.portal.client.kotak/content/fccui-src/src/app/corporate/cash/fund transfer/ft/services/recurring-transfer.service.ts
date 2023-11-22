import { Injectable } from '@angular/core';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { UtilityService } from '../../../../trade/lc/initiation/services/utility.service';
import { FormControlService } from '../../../../trade/lc/initiation/services/form-control.service';
import { ConfirmationService, DialogService, DynamicDialogRef } from 'primeng';
import { FCCBase } from '../../../../../base/model/fcc-base';
import { DropDownAPIService } from './../../../../../common/services/dropdownAPI.service';
import { startDateGreaterThanMaxDate, startDateLessThanMinDate, transferDateLessThanCurrentDate } from '../../../../trade/lc/initiation/validator/ValidateDates';
import { DatePipe } from '@angular/common';
import { Validators } from '@angular/forms';

interface IRecurOnModel {
  exactDay: boolean;
  lastDayOfMonth: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RecurringTransferService extends FCCBase{

  children = ['ftTransferDate','recurringftStartDate','recurringftNoOfTransactions'
  ,'recurringftFrequency','recurringrecuron', 'recurringrecuronOptions', 'recurringftEndDate','fiveSpace01' ,'sixSpace01','sevenSpace01'];
  bankName: string;
  private readonly VALUE = 'value';
  frequencyOptions= [];
  recurOnValidationMap = new Map<string, IRecurOnModel>();
  form: FCCFormGroup;
  minOffset: number;
  maxOffset: number;
  subProductCode: string;
  endDate;
  bothFields;

  constructor(
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected utilityService: UtilityService,
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected dialogRef: DynamicDialogRef,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected dropdownAPIService: DropDownAPIService,
    protected datepipe: DatePipe
    ){
      super();
    }


  recurringServiceFtRecurringTransferToggle(form: any,event: any) {
    const checked = form.get('ftRecurringTransferToggle').value;
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if(mode !== 'view' && event !== ''){
      this.resetFieldValues(form);
    }
    if(event?.checked || checked === 'Y') {
      this.children.forEach((key) =>{
        form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]= !(key === 'ftTransferDate');
        form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED]= !(key === 'ftTransferDate');
        if(!(form.get('recurringftFrequency') && form.get('recurringftFrequency').value &&
        (form.get('recurringftFrequency').value.value === FccGlobalConstant.MONTHLY ||
        form.get('recurringftFrequency').value.value === FccGlobalConstant.QUARTERLY))) {
         form.get('recurringrecuron')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
         form.get('recurringrecuronOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
         form.get('sevenSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }

        if (key === this.children[0]) {
          form.get(key).clearValidators();
        }
      });
    }
    else {
      this.children.forEach((key) => {
        form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]= (key === 'ftTransferDate');
        form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED]= (key === 'ftTransferDate');
        if (key !== this.children[0]) {
          form.get(key).clearValidators();
        }
      });
    }
    form.updateValueAndValidity();
  }

  initialize(form: any, productCode: string, subProductCode: string,recurringSwitch) {
    this.isRecurringEnabled(form, productCode, subProductCode,recurringSwitch);
    if(form.get(recurringSwitch).value === 'Y') {
    this.recurringftFrequency(form);

    }

    else {
      this.children.forEach((key) => {
        form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]= (key === 'ftTransferDate');
        form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED]= (key === 'ftTransferDate');
        form.get('recurringrecuron')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          form.get('recurringrecuronOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          form.updateValueAndValidity();
        if (key !== this.children[0]) {
         form.get(key).clearValidators();
        }
      });
      form.updateValueAndValidity();
    }
  }

  isRecurringEnabled(form: any, productCode: string, subProductCode: string,recurringSwitch: string) {
    let isrecur = false;
    if(form.get('Bank') && form.get('Bank').value && form.get('Bank').value.shortName) {
      this.bankName =form.get('Bank').value.shortName;
    }
    this.commonService.getBankDetails().subscribe((bankRes) => {
      if(!this.commonService.isnonEMptyString(this.bankName)) {
        this.bankName = bankRes.shortName;
      }
      this.commonService
        .getParameterConfiguredValues(
          this.bankName, FccGlobalConstant.PARAMETER_P659, productCode, subProductCode
        )
        .subscribe((responseData) => {
          if (responseData && responseData.paramDataList && responseData.paramDataList.length) {
            if (responseData.paramDataList[0][FccGlobalConstant.DATA_1] === 'Y'){
           form.get(recurringSwitch)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
           form.updateValueAndValidity();
           this.recurringftFrequency(form);
           isrecur = true;
           return isrecur;
          }
        }
          else
          {
            form.get(recurringSwitch)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            form.updateValueAndValidity();
          }
  });
});
return isrecur;
}


recurringftFrequency(form: any) {
  if(form.get('Bank') && form.get('Bank').value && form.get('Bank').value.shortName) {
    this.bankName =form.get('Bank').value.shortName;
  }
  this.commonService.getBankDetails().subscribe((bankRes) => {
    if(!this.commonService.isnonEMptyString(this.bankName)) {
      this.bankName = bankRes.shortName;
    }
    this.commonService
      .getParameterConfiguredValues(
        this.bankName,
        FccGlobalConstant.PARAMETER_P660
      )
      .subscribe((responseData) => {
        if ( this.commonService.isNonEmptyValue(responseData) && this.commonService.isNonEmptyValue(responseData.paramDataList) ) {
          if (responseData.paramDataList && responseData.paramDataList.length) {
            this.frequencyOptions = [];
            const frequencyOption = responseData.paramDataList;

            frequencyOption.forEach((element) => {
              const format: { label: string, value: any } = {
                 label: this.translateService.instant(
                  element[FccGlobalConstant.KEY_2]),
                  value: {
                    label: this.translateService.instant(
                      element[FccGlobalConstant.KEY_2]),
                  value : element[FccGlobalConstant.KEY_2],
                  shortName : element[FccGlobalConstant.KEY_2],
                  id: element[FccGlobalConstant.KEY_2].toString().toLowerCase(),
                  DATA_1 : element[FccGlobalConstant.DATA_1],
                  DATA_2: element[FccGlobalConstant.DATA_2],
                  Limit: element[FccGlobalConstant.DATA_3]

                  }
              };
              this.frequencyOptions.push(format);
              this.recurOnValidationMap.set(element[FccGlobalConstant.KEY_2],{
                  exactDay: this.convertYandNtoBoolean(element[FccGlobalConstant.DATA_1]),
                  lastDayOfMonth: this.convertYandNtoBoolean(element[FccGlobalConstant.DATA_2]),
                }
              );
            });
                      this.patchFieldParameters(
                        form.get('recurringftFrequency'),
                        { options: this.frequencyOptions });
                        form.updateValueAndValidity();

                    const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.frequencyOptions,
                      'recurringftFrequency', form);
                    if (valObj && valObj[this.VALUE])
                    {
                       form.get('recurringftFrequency').patchValue(valObj[this.VALUE]);
                    }
                    }
                    return form;

        }
      });
  });
  return form;
}

    onclickfrequencyDropdown(event: any, form: any) {
      let frequencyVal;
      const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
      if(this.commonService.isEmptyValue(event)){
        frequencyVal = form.get('recurringftFrequency').value;
      }
      if (event?.value || this.commonService.isnonEMptyString(frequencyVal)) {
        if(mode !== 'view'){
          form.get('recurringftFrequency').setValue(event.value);
          form.get('recurringftFrequency').updateValueAndValidity();
          if (event.value.value === 'MONTHLY' || event.value.value === 'QUARTERLY'){
            form.get('recurringrecuron')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            form.get('sevenSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            form.get('recurringrecuronOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            form.updateValueAndValidity();
          }
          else
          {
            form.get('recurringrecuron')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            form.get('sevenSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            form.get('recurringrecuronOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            form.updateValueAndValidity();
          }
        } else {
          if ((frequencyVal && frequencyVal.toUpperCase() === 'MONTHLY' || frequencyVal.toUpperCase() === 'QUARTERLY') ||
           (frequencyVal.value &&(
                    frequencyVal.value.toUpperCase() === 'MONTHLY' || frequencyVal.value.toUpperCase === 'QUARTERLY'))){
            form.get('recurringrecuron')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            form.get('sevenSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            form.get('recurringrecuronOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            form.updateValueAndValidity();
          } else {
            form.get('recurringrecuron')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            form.get('sevenSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            form.get('recurringrecuronOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            form.updateValueAndValidity();
          }
        }
      }
      return form;
    }

 resetFieldValues(form: any){
    form.get('ftTransferDate').setValue('');
    form.get('recurringftStartDate').setValue('');
    form.get('recurringftNoOfTransactions').setValue('');
    form.get('recurringftFrequency').setValue('');
    form.get('recurringrecuron').setValue('');
}

    convertYandNtoBoolean(key: string): boolean {
      if (key === 'Y') {
        return true;
      }
      return false;
    }

    getstartDateForRecurring(form: any, productCode: any, subProductCode: any) {
      if(form.get('Bank') && form.get('Bank').value && form.get('Bank').value.shortName) {
        this.bankName =form.get('Bank').value.shortName;
      }
      this.commonService.getBankDetails().subscribe((bankRes) => {
        if(!this.commonService.isnonEMptyString(this.bankName)) {
          this.bankName = bankRes.shortName;
        }


        this.commonService
          .getParameterConfiguredValues(
            this.bankName,
            FccGlobalConstant.PARAMETER_P658,
            FccGlobalConstant.PRODUCT_FT,
            subProductCode
          )
          .subscribe((responseData) => {
            if (
              this.commonService.isNonEmptyValue(responseData) &&
              this.commonService.isNonEmptyValue(responseData.paramDataList && responseData.paramDataList[0])
            ) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const currentDate = new Date();
              this.minOffset = parseInt(
                responseData.paramDataList[0][FccGlobalConstant.DATA_1],
                10
              );
              this.maxOffset = parseInt(
                responseData.paramDataList[0][FccGlobalConstant.DATA_2],
                10
              );
             form.get(FccGlobalConstant.FT_START_DATE)[FccGlobalConstant.PARAMS][
                FccGlobalConstant.MIN_START_DATE
              ] = this.utilityService.formatDate(this.utilityService.getDateWithOffset(this.minOffset),
              FccGlobalConstant.DATE_FORMAT_YYYY_MM_DD);

              form.get(FccGlobalConstant.FT_START_DATE)[FccGlobalConstant.PARAMS][
                FccGlobalConstant.MAX_START_DATE
              ] = this.utilityService.formatDate(this.utilityService.getDateWithOffset(this.maxOffset),
              FccGlobalConstant.DATE_FORMAT_YYYY_MM_DD);
            }
          });
      });
    }

    validateStartDate(form: FCCFormGroup, element:any) {
      if(form.get(element)) {
       const convertedDate = this.datepipe.transform(form.get(element).value,FccGlobalConstant.DATE_FORMAT_YYYY_MM_DD);
       form.get(element)['params']['displayMinStartDate'] =
       this.datepipe.transform(form.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.MIN_START_DATE],
       this.utilityService.dateFormat[localStorage.getItem('language')]);
       form.get(element)['params']['displayMaxStartDate'] =
       this.datepipe.transform(form.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAX_START_DATE],
       this.utilityService.dateFormat[localStorage.getItem('language')]);
       const currentDate = this.datepipe.transform(new Date(),FccGlobalConstant.DATE_FORMAT_YYYY_MM_DD);
       if(convertedDate && convertedDate < currentDate) {
        form.get(element).setValidators([transferDateLessThanCurrentDate]);
        form.get(element).invalid;
        form.get(element).markAsDirty();
        form.get(element).updateValueAndValidity();
       }
      else if(convertedDate < form.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.MIN_START_DATE]) {

           form.get(element).setValidators([startDateLessThanMinDate]);
           form.get(element).invalid;
           form.get(element).markAsDirty();
           form.get(element).updateValueAndValidity();
         }
        else if(convertedDate > form.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAX_START_DATE]) {


             form.get(element).setValidators([startDateGreaterThanMaxDate]);
             form.get(element).invalid;
             form.get(element).markAsDirty();
             form.get(element).updateValueAndValidity();
           }
           else if(!(form.get(element).errors && (form.get(element).errors['transferDateIsHoliday'] ||
           form.get(element).errors['transferDateIsExceedingFutureDate'] ||form.get(element).errors['invalidDate']))) {
             form.get(element).clearValidators();
             if(form.get(element)['params']['rendered'] == true) {
              form.get(element).setValidators(Validators.required);
              }
           }
           form.get(element).updateValueAndValidity();
      }
     }

  showEndDate(form: FCCFormGroup){
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.endDate = response.RecurringPaymentEndDate;
        this.bothFields = response.RecurringPaymentBothFields;
        if (this.endDate){
          form.get('recurringftEndDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          form.get('recurringftEndDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
          form.get('recurringftNoOfTransactions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          form.get('recurringftNoOfTransactions')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;

        }
        else{
          form.get('recurringftEndDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          form.get('recurringftEndDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
          form.get('recurringftNoOfTransactions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          form.get('recurringftNoOfTransactions')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        }

        if (this.endDate && this.bothFields){
          form.get('recurringftEndDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          form.get('recurringftEndDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
          form.get('recurringftNoOfTransactions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          form.get('recurringftNoOfTransactions')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        }
      }
    });
  }


  ValidateNoOfTransactions(form: any)
{
  if (form && form.get('recurringftNoOfTransactions')){
    if (parseInt(form.get('recurringftNoOfTransactions').value) === 0)
     {
       const invalidNumber = FccGlobalConstant.INVALID_NUMBER;
       form.get('recurringftNoOfTransactions').setErrors({ NumberVal: { invalidNumber } });
           form.get('recurringftNoOfTransactions').markAsTouched();
     }
    else if (form.get('recurringftFrequency') && form.get('recurringftFrequency').value &&
    form.get('recurringftFrequency').value.value === FccGlobalConstant.DAILY)
     {

      form.get('recurringftNoOfTransactions').setErrors(null);
      form.get('recurringftNoOfTransactions').updateValueAndValidity();

      if ((parseInt(form.get('recurringftNoOfTransactions').value)) >
      parseInt(form.get('recurringftFrequency').value.Limit))
      {

        form.get('recurringftNoOfTransactions').setErrors(
          ({ DailyLimit: { Limit:
            form.get('recurringftFrequency').value.Limit } }));
        form.get('recurringftNoOfTransactions').markAsTouched();
      }
      else
      {
        form.get('recurringftNoOfTransactions').clearValidators();
      }
     }
     else if (form.get('recurringftFrequency') && form.get('recurringftFrequency').value &&
      form.get('recurringftFrequency').value.value === FccGlobalConstant.MONTHLY)
     {

      form.get('recurringftNoOfTransactions').setErrors(null);
      form.get('recurringftNoOfTransactions').updateValueAndValidity();
      if (parseInt(form.get('recurringftNoOfTransactions').value) >
       parseInt(form.get('recurringftFrequency').value.Limit))
      {

        form.get('recurringftNoOfTransactions').setErrors(
          ({ DailyLimit: { Limit:
            form.get('recurringftFrequency').value.Limit } }));
            form.get('recurringftNoOfTransactions').markAsTouched();
      }
      else{
        form.get('recurringftNoOfTransactions').clearValidators();
      }
     }
     else if (form.get('recurringftFrequency') && form.get('recurringftFrequency').value &&
      form.get('recurringftFrequency').value.value === FccGlobalConstant.WEEKLY)
     {

      form.get('recurringftNoOfTransactions').setErrors(null);
      form.get('recurringftNoOfTransactions').updateValueAndValidity();
      if (parseInt(form.get('recurringftNoOfTransactions').value) >
       parseInt(form.get('recurringftFrequency').value.Limit))
      {

        form.get('recurringftNoOfTransactions').setErrors(
          ({ DailyLimit: { Limit:
            form.get('recurringftFrequency').value.Limit } }));
            form.get('recurringftNoOfTransactions').markAsTouched();
      }
      else{
      form.get('recurringftNoOfTransactions').clearValidators();
      }
     }
     else if (form.get('recurringftFrequency').value
     && form.get('recurringftFrequency').value &&
      form.get('recurringftFrequency').value.value === FccGlobalConstant.QUARTERLY)
     {

      form.get('recurringftNoOfTransactions').setErrors(null);
      form.get('recurringftNoOfTransactions').updateValueAndValidity();
      if (parseInt(form.get('recurringftNoOfTransactions').value) >
       parseInt(form.get('recurringftFrequency').value.Limit))
      {

        form.get('recurringftNoOfTransactions').setErrors(
          ({ DailyLimit: { Limit:
            form.get('recurringftFrequency').value.Limit } }));
            form.get('recurringftNoOfTransactions').markAsTouched();
      }
      else{
        form.get('recurringftNoOfTransactions').clearValidators();
        }
     }
     else if (form.get('recurringftFrequency') && form.get('recurringftFrequency').value &&
      form.get('recurringftFrequency').value.value === FccGlobalConstant.YEARLY)
     {

      form.get('recurringftNoOfTransactions').setErrors(null);
      form.get('recurringftNoOfTransactions').updateValueAndValidity();
      if (parseInt(form.get('recurringftNoOfTransactions').value) >
       parseInt(form.get('recurringftFrequency').value.Limit))
      {

        form.get('recurringftNoOfTransactions').setErrors(
          ({ DailyLimit: { Limit:
            form.get('recurringftFrequency').value.Limit } }));
            form.get('recurringftNoOfTransactions').markAsTouched();
      }
      else{
        form.get('recurringftNoOfTransactions').clearValidators();
        }
     }



     form.addFCCValidators(
      'recurringftNoOfTransactions',
      Validators.pattern(FccGlobalConstant.NUMBER_REGEX),
      0
    );
     }
      return form;
    }

    }





