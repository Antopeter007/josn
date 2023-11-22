/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FormControlService } from '../../../../../trade/lc/initiation/services/form-control.service';
import { HOST_COMPONENT } from '../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { CommonService } from '../../../../../../common/services/common.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { map, startWith } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { FCMPaymentsConstants } from '../../model/fcm-payments-constant';
import { FccConstants } from '../../../../../../../app/common/core/fcc-constants';
import { TranslateService } from '@ngx-translate/core';
import { ResolverService } from '../../../../../../../app/common/services/resolver.service';
import { PaymentBatchService } from '../../../../../../../app/common/services/payment.service';
import { ProductMappingService } from '../../../../../../../app/common/services/productMapping.service';
import { CurrencyConverterPipe } from '../../../../../../../app/corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { SessionValidateService } from '../../../../../../../app/common/services/session-validate-service';
import { DropDownAPIService } from '../../../../../../../app/common/services/dropdownAPI.service';
import { SearchLayoutService } from '../../../../../../../app/common/services/search-layout.service';
import { SelectItem } from 'primeng';
import { CurrencyRequest } from '../../../../../../../app/common/model/currency-request';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { UtilityService } from '../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { PreviewService } from '../../../../../../corporate/trade/lc/initiation/services/preview.service';
import { DatePipe } from '@angular/common';
import { FccGlobalConstantService } from '../../../../../../../app/common/core/fcc-global-constant.service';
import { AbstractControl } from '@angular/forms';
import moment from 'moment';
//const moment = require('moment');
@Component({
  selector: 'app-batch-payment-accordion',
  templateUrl: './batch-payment-accordion.component.html',
  styleUrls: ['./batch-payment-accordion.component.scss'],
  providers: [
    { provide: HOST_COMPONENT, useExisting: BatchPaymentAccordionComponent }
  ]
})
export class BatchPaymentAccordionComponent implements OnInit {

  module = ``;
  mode: any;
  form: FCCFormGroup;
  dir: string = localStorage.getItem('langDir');
  isStepperDisabled: boolean;
  inputValue: any;
  beneEditToggleVisible: boolean;
  errorHeader: any;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  step = 0;
  subscriptions: Subscription[] = [];
  curRequest: CurrencyRequest = new CurrencyRequest();
  checked = false;
  filteredWrapperOptions: Observable<any[]>;
  arrowIconSubject = new BehaviorSubject('arrow_drop_down');
  toggleVisibilityChange = new Subject<boolean>();
  productTypeSelected: any;
  iso: any;
  errors: any;
  label: any;
  productCode;
  option;
  category;
  paymentRefNo: string;
  isValid: boolean;
  currency: SelectItem[] = [];
  errMsg: any;
  ifscResponse: Subscription;
  maxDate: Date;
  minDate: Date;
  holidayList: any[];
  apiModel;
  transactionAmt: any;
  disableButtn = true;
  productTypeVal: any;
  payFromval: any;
  beneNameAndCodeVal: any;
  payToVal: any;
  currencyVal: any;
  amountVal: any;
  effctiveDateVal: any;
  accounTypeVal: any;
  accountNumVal: any;
  confimAccountVal: any;
  effectiveDateVal: any;
  mondayFlag: any;
  tuesdayFlag: any;
  wednesdayFlag: any;
  thrusdayFlag: any;
  fridayFlag: any;
  saturdayFlag: any;
  sundayFlag: any;
  maxDays: number;
  benecodeFlag = false;
  contextPath: any;
  benecodeVal: any;
  productCutofferr: any;
  panelForm: FCCFormGroup;
  switchchecked = false;
  checkboxPaymentChecked = false;
  checkboxBeneChecked = false;
  payVal: any;
  resetDisable = false;
  saveDone: boolean;


  constructor(protected formControlService: FormControlService,
    protected commonService: CommonService, protected productMappingService: ProductMappingService,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected resolverService: ResolverService,
    protected sessionValidation: SessionValidateService,
    protected dropdownAPIService: DropDownAPIService,
    protected searchLayoutService: SearchLayoutService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected formservice: FormControlService,
    protected paymentService: PaymentBatchService,
    public datepipe: DatePipe,
    protected previewService: PreviewService,
    protected utilityService: UtilityService,
    protected changedetector: ChangeDetectorRef, protected translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.minDate = new Date();
    let filterParams: any = {};
    this.isStepperDisabled = this.commonService.isStepperDisabled === true ? true : false;
    this.initializeFormGroup();
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.category = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.paymentService.paymentRefNoSubscription$.subscribe((val) => {
      this.paymentRefNo = val;
    });
    filterParams.packageCode = this.parentForm.get(FccConstants.FCM_PAYMENT_PACKAGES).value.label;
    filterParams = JSON.stringify(filterParams);


     if (this.commonService.getType !== FccGlobalConstant.PREVIOUS) {
      this.data = Object.keys(this.data).map(e=>this.data[e]);
      this.constructPanelControlArray();

     } else{
      for (const control of this.data) {
        if (control.name === FccGlobalConstant.ADDITIONAL_INFO || control.name === FccGlobalConstant.CONFIDENTIAL_CHECKBOX ||
         control.name === FccGlobalConstant.ADD_BENE_CHECKBOX) {
           this.checkedSwitchValues(control.name,control.accordionControl.value );
        } else if(control.name === 'beneficiaryNameCode'){
          if( this.commonService.isnonEMptyString(control.accordionControl.value))
            {
              this.setBeneCodeVal(control.accordionControl.value);
            }
        }
      }
     }
    this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_PACKAGE_BASED_OPTIONS, filterParams);
    this.loadConfidentialCheckbox();
    this.getCurrencyDetail();
    this.getApiModel();
    this.createForm();
  }

  getApiModel() {
    this.productMappingService.getApiModel(this.productCode, undefined, undefined, undefined, undefined,
      this.option, this.category).subscribe(apiMappingModel => {
        this.apiModel = apiMappingModel;
      });
  }

  setBeneCodeVal(beneVal){
    for (const control of this.data) {
      if (control.name === FccGlobalConstant.BENENAME){
         control.accordionControl.setValue(beneVal.name);
         this.inputValue = beneVal.name;
      }

   }
  }

  createForm(){
    const controls: {[key:string]:AbstractControl} = {};
    this.data.forEach(element => {
      if(element.name){
        controls[element.name] =
        element?.accordionControl
        ? element.accordionControl
        : '';
      }

    });
    this.panelForm = new FCCFormGroup({});
    for (const [key,value] of Object.entries(controls)) {
      this.panelForm.addControl(key,value);
    }
  }

  constructPanelControlArray() {
    this.data.forEach(element => {
       element.accordionControl = this.formservice.getControl(element);
      });

  }
  loadConfidentialCheckbox(){
      const val = this.parentForm.get('isConfidentialPayment').value;
      if(val === 'Y'){
        this.setRenderOnlyFields(
          this.data,
          FCMPaymentsConstants.BULK_CONFIDENTIAL_CHECKBOX,
          true
        );
      }
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];

    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
  }

  checkedSwitchValues(name, controlval){
    if(controlval){
    switch(name) {
      case 'additionalInformation': {
          this.switchchecked = true;
          break;
      }
      case 'confidentialCheckbox': {
          this.checkboxPaymentChecked = true;
          break;
      }
      case 'addBeneficiaryCheckbox': {
          this.checkboxBeneChecked = true;
          break;
      }
      default:
        break;
    }
  }

  }

  getYearRange(yr) {
    const year = (new Date()).getFullYear();
    const lowerLimit = 50;
    const upperLimit = 50;
    if (yr == null || yr === '') {
      return (year - lowerLimit) + ':' + (year + upperLimit);
    } else {
      return yr;
    }
  }

  holidayDateFilter = (d :Date): boolean => {
    //const moment = require('moment');
    const date:any = moment(d);
    const holidayList = this.holidayList;
    if (holidayList) {
      return !holidayList.find(x => moment(x).isSame(date, 'day'));
    } else{
      return date;
    }
  };

  onFormAccordionOpen(index: number, name: string) {
    this.step = index;
    const fnName = `onPanelOpen${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this[fnName];
    if (fn && (typeof fn === 'function')) {
      this[fnName]();
    }
    let filterParams: any = {};
    filterParams.packageCode = this.parentForm.get(FccConstants.FCM_PAYMENT_PACKAGES).value.label;
    filterParams = JSON.stringify(filterParams);

  }

  onFormAccordionClose(index: number, name: string) {
    this.step = index;
    const fnName = `onPanelClose${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this[fnName];
    if (fn && (typeof fn === 'function')) {
      this[fnName]();
    }
  }

  getLayoutClass(fieldLayout: any, type: string) {
    if (this.isStepperDisabled === true && fieldLayout && !fieldLayout.includes('p-xl') &&
    type !== 'icon') {
      fieldLayout = `p-xl-4 ` + fieldLayout;
    }
    return fieldLayout;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEventRaised(event, key, index) {
    const oEvent = event;
    if (event.type === undefined) {
      event = event.originalEvent;
    }
    const type = event.type;
    const name =key;
    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this[fnName];
    if (fn && (typeof fn === 'function')) {
      this[fnName](oEvent,index,key);
    }
  }

  dofilterAutoComp(event, key, control) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const form = this[FccGlobalConstant.FORM];
    this.filteredWrapperOptions = control.accordionControl.valueChanges
    .pipe(
      startWith(''),
      // eslint-disable-next-line no-shadow
      map(value => value ?
        this._filter(value, control.accordionControl.options) : control.accordionControl.options)
      );
  }

  // eslint-disable-next-line no-shadow
  _filter(value: any, autoFilterOptions: any[]): any[] {
    if (typeof value !== 'object') {
    const filterValue = value.toLowerCase();
    return autoFilterOptions.filter(
      option => option.value.label.toLowerCase().indexOf(filterValue) === 0 || option.value.name.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  // compare if the entered value exists in dropdown option and display toggle if not present
  checkValuePresent(evt: Event, autoFilterOptions: any[],index): void {
    this.arrowIconSubject.next('arrow_drop_down');
    if (evt.target && evt.target['value'] && evt.target['value'].length >= 1 &&
      !autoFilterOptions.find(compOption =>
        compOption.value.name.toLowerCase() === evt.target['value'].toLowerCase())) {
          this.setBeneSaveToggle(true,index,evt);
      }
      else {
          this.setBeneSaveToggle(false,index,evt);
      }
    }

  setBeneSaveToggle(istoggleVisible: boolean, index,evt): void {
    this.toggleVisibilityChange.next(istoggleVisible);
    const fnName = 'checkBeneSaveAllowed';
    this[fnName](istoggleVisible ,index,evt);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onOptionSelectEventRaised(event, key, options, control, index) {
    this.checkValuePresent(event, options, index);
    this.arrowIconSubject.next('arrow_drop_down');
    const name = key;
    const fnName = `onClick${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this[fnName](event,index,key);
    if (fn && (typeof fn === 'function')) {
      this[fnName](options.find(compOption =>
        compOption.value.name.toLowerCase() === event.option['value'].name.toLowerCase()));
    }
  }

  displayFn(value: any | string) {
    return !value
     ? ''
     : typeof value === 'string'
       ? value
       : value.name;
 }

 onMatDateEventRaised(event, key, control, pickerInput) {
  if (pickerInput && !this.isValidDate(pickerInput)) {
    if (FccGlobalConstant.INVALID_DATE !== control.errors){
      const invalidDate = FccGlobalConstant.INVALID_DATE;
      control.setErrors({ invalidDate: { invalidDate } });
    }
  } else if (!pickerInput && control.errors && control.errors[FccGlobalConstant.INVALID_DATE]){
    delete control.errors[FccGlobalConstant.INVALID_DATE];
    control.updateValueAndValidity();
  }
  else{
    if (control.errors && control.errors[FccGlobalConstant.INVALID_DATE]) {
    delete control.errors[FccGlobalConstant.INVALID_DATE];
    control.updateValueAndValidity();
    }
    const oEvent = event;
    let type = event.type;
    const name = type !== undefined ? event.srcElement.id : key;
    type = type === undefined ? 'click' : type;
    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this[fnName];
  if (fn && (typeof fn === 'function')) {
    this[fnName](oEvent,control.index,key);
  }
}
}
/**
* @param pickerInput - Input from date picker field
* @returns - Whether the input typed date is valid or not
*/
isValidDate(pickerInput: any) {
return moment(pickerInput, this.utilityService.getDateFormat(), true).isValid();
}


 onMatCheckEventRaised(event, key, control) {
  const oEvent = event;
  if (event.type === undefined) {
    event = event.source;
  }
  let type = event.type;
  const name = type !== undefined ? event.srcElement.id : key;
  type = type === undefined ? 'click' : type;
  // const form = this.form;
  this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][control.index]?.panelControlArray[key].
  setValue(oEvent.checked ? 'Y' : 'N');

  const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
  const fn = this[fnName];
  if (fn && (typeof fn === 'function')) {
    this[fnName](oEvent,control.index,key);
  }
}

  // No custom code here, could be used as generic mat handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars




  onMatEventRaised(event, key, control,index) {
    event.value = control.accordionControl.value;
    const oEvent = event;
    if (event.type === undefined) {
      event = event.source;
    }
    let type = event.type;
    const name = type !== undefined ? key : event.srcElement.id;
    type = type === undefined ? 'click' : type;

    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this[fnName];
    if (fn && (typeof fn === 'function')) {
      this[fnName](oEvent,index,key);
    }
  }

 // method to check if adhoc beneficiary save can be performed
 checkBeneSaveAllowed(toggleValue, index, evt){
  this.beneEditToggleVisible = toggleValue;
  if (this.beneEditToggleVisible){
    this.setRenderOnlyFields(
      this.data,
      FCMPaymentsConstants.HIDE_ADHOC_BENEFICIARY_FIELDS,
      false
    );
    this.setRenderOnlyFields(
      this.data,
      FCMPaymentsConstants.DISPLAY_ADHOC_BENEFICIARY_FIELDS,
      true
    );
    if (this.commonService.isnonEMptyString(evt.target.value)) {
      this.beneNameAndCodeVal = evt.target.value;
      let filterParams: any = {};
      if (this.commonService.isnonEMptyString(this.parentForm.get(FccConstants.FCM_PAYMENT_PRODUCT_ID).value)) {
        filterParams.paymenttype = this.parentForm.get(FccConstants.FCM_PAYMENT_PRODUCT_ID).value;
        filterParams = JSON.stringify(filterParams);
        this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_ADHOC_BASED_OPTIONS, filterParams);
      }
    }
  }
else{
  if (!this.beneEditToggleVisible){
    this.setRenderOnlyFields(
      this.data,
      FCMPaymentsConstants.HIDE_ADHOC_BENEFICIARY_FIELDS,
      true
    );
    this.setRenderOnlyFields(
      this.data,
      FCMPaymentsConstants.DISPLAY_ADHOC_BENEFICIARY_FIELDS,
      false
    );
   }
  }
}

setRenderOnlyFields(form, ids: string[], flag) {
  ids.forEach((id) => this.setRenderOnly(form, id, flag));
}

setRenderOnly(form, id, flag) {
  for (const control of form) {
    if (control.name === id) {
      control.rendered = flag;
    }
  }
  if (!flag) {
    this.setRequiredOnly(form, id, false);
  }
}

setRequired(form, ids: string[], flag) {
  ids.forEach((id) => this.setRequiredOnly(form, id, flag));
}

setRequiredOnly(form, id, flag) {
  for (const control of form) {
    if (control.name === id) {
      control.required = flag;
    }
  }
}
initializeDropdownValues(dropdownFields?, filterParams? ,index?){
  dropdownFields.forEach((dropdownField) => {
    this.subscriptions.push(this.commonService.getExternalStaticDataList(dropdownField, filterParams)
      .subscribe((response) => {
        if (response) {
            this.updateDropdown(dropdownField,response,index);
        }
      }));
  });
}


updateDropdown(key, dropdownList,index) {
  if (key === FccConstants.FCM_PAYMENT_PAY_FROM){
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dropdownList.forEach(element => {
      for (const control of this.data) {
        if (control.name === key) {
          dropdownList.forEach(element => {
            const payFrom: { label: string, value: any } = {
              label: element.code,
                value : {
                  label: element.code,
                  name: element.description,
                  shortName: element.description,
                  accountType : element.account_type,
                  currency : element.currency,
                  accountName : element.acct_name,
                  accountId : element.code
              }
            };
            control.accordionControl.params.options.push(payFrom);
          });
        }
      }
    });

  } else if (key === FccConstants.FCM_PRODUCT_TYPE){
    for (const control of this.data) {
      if (control.name === key) {
    dropdownList.forEach(element => {
      const productType: { label: string, value: any } = {
        label: element.code,
        value : {
          label: element.code,
          name: `${this.translateService.instant(FccConstants.CUT_OFF_TIME)}`
           + this.commonService.convertNumberToTimePattern(element.cut_off_time),
          shortName: element.description,
          time: this.commonService.convertNumberToTime(element.cut_off_time),
          perProductMinLimit: element.per_txn_min_amnt,
          perProductMaxLimit: element.per_txn_max_amnt
        }
      };
      if(!control.options.includes(productType)){
        control.accordionControl.params.options.push(productType);
      }
    });
      }
    }
  }
  else if (key === FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME){
    for (const control of this.data) {
      if (control.name === key) {
    dropdownList.forEach(element => {
      const benefeciaryNameCode: { label: string, value: any } = {
        label: element.receiver_code,
        value : {
          label: element.receiver_code,
          name: element.benedescription,
          shortName: element.benedescription
        }
      };
      control.accordionControl.options.push(benefeciaryNameCode);
    });
    if(control.accordionControl.options.length > 0){
      this.commonService.setInputAutoComp(true);
      this.onClickBeneficiaryNameCode(event,index,key);
    }
  }

}
  }else if (key === FccConstants.FCM_PAYMENT_PAY_TO){
    for (const control of this.data) {
      if (control.name === key) {
     control.accordionControl.params.options = [];
     dropdownList.forEach(element => {
      const payTo: { label: string, value: any } = {
        label: element.accountno,
        value : {
          label: element.accountno,
          name: element.bene_account_type,
          shortName: element.accountno,
          defaultAcc: element.default_account,
          accountType : element.bene_account_type,
          currency : element.bene_account_ccy
        }
      };
      control.accordionControl.params.options.push(payTo);

    });

  }
}

for (const control of this.data) {
  if(control.name === key){
    control.accordionControl.setValue(
    control.accordionControl.params.options.filter(
      task => task.value.defaultAcc === FccGlobalConstant.CODE_Y)[0]?.value);

      this.payVal = control.accordionControl.params.options.filter(
        task => task.value.defaultAcc === FccGlobalConstant.CODE_Y)[0]?.value;

     break;
  }

      }
  this.onClickPayTo(event,index,key , this.payVal);
}else if (key === FccConstants.BENE_BANK_IFSC_CODE){
  for (const control of this.data) {
    if (control.name === key) {
  dropdownList.forEach(element => {
    control.accordionControl.params.options.push(
      {
        label: element.ifsc,
        value : {
          label: element.ifsc,
          shortName: element.ifsc,
          drawee_bank_code: element.drawee_bank_code,
          drawee_branch_code: element.drawee_branch_code,
          drawee_branch_description: element.drawee_branch_description
        }
      }
    );
  });
}
  }
}else if (key === FccConstants.FCM_PAYMENT_ACCOUNT_TYPE) {
  for (const control of this.data) {
    if (control.name === key) {
  dropdownList.forEach(element => {
    control.accordionControl.params.options.push(
      {
        label : element.preload_value,
        value : {
          label: element.preload_value,
          shortName: element.preload_value
        }
      }
    );
  });
}
  }
}else if (key === FccConstants.FCM_PAYMENT_EFFECTIVE_DATE) {
  dropdownList.forEach(element => {
    this.maxDate = this.commonService.calculateMaxDate(element.allow_max_future_days);
    this.maxDays = element.allow_max_future_days;
  });
  this.setProfileHolidays(index,key);
  }
}

setProfileHolidays(index,key){
  let filterParams: any = {};
  filterParams.productCode = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]
  ?.panelControlArray[FccConstants.FCM_PRODUCT_TYPE].value.label;
  filterParams.productCode = filterParams.productCode + '%';
  filterParams = JSON.stringify(filterParams);
  this.holidayList =[];
  this.subscriptions.push(this.commonService.getExternalStaticDataList(FCMPaymentsConstants.FCM_FETCH_HOLIDAY_LIST, filterParams)
  .subscribe((response) => {
    if (response) {
      this.mondayFlag = response[0]?.monday_flag;
      this.tuesdayFlag = response[0]?.tuesday_flag;
      this.wednesdayFlag = response[0]?.wednesday_flag;
      this.thrusdayFlag = response[0]?.thursday_flag;
      this.fridayFlag = response[0]?.friday_flag;
      this.saturdayFlag = response[0]?.saturday_flag;
      this.sundayFlag = response[0]?.sunday_flag;
      response.forEach(element => {
        const latestDate = this.datepipe.transform(element.holiday_date, 'yyyy-MM-dd');
        this.holidayList.push(latestDate);
      });
      this.calculateWeeklyDays(index,key);
    }
  }));
}



calculateWeeklyDays(index,key){
  const currentDate = new Date();
  const week = Number(this.maxDays/7);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();
  if(this.mondayFlag === 'Y'){
    const offset = 8 - currentDate.getDay(); // days till next Monday
    if(currentDate.getDay() === 1){
      this.holidayList.push( currentDate );
    }
    for(let i = 0 ; i < week ; i++) {
    this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
    }
  }
  if(this.tuesdayFlag === 'Y'){
    const offset = 2 - currentDate.getDay(); // days till next Monday
    if(currentDate.getDay() === 1){
      this.holidayList.push( currentDate );
    }
    for(let i = 0 ; i < week ; i++) {
    this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
    }
  }
  if(this.wednesdayFlag === 'Y'){
    const offset = 3 - currentDate.getDay(); // days till next Monday
    if(currentDate.getDay() === 1){
      this.holidayList.push( currentDate );
    }
    for(let i = 0 ; i < week ; i++) {
    this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
    }
  }
  if(this.thrusdayFlag === 'Y'){
    const offset = 4 - currentDate.getDay(); // days till next Monday
    if(currentDate.getDay() === 1){
      this.holidayList.push( currentDate );
    }
    for(let i = 0 ; i < week ; i++) {
    this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
    }
  }
  if(this.fridayFlag === 'Y'){
    const offset = 5 - currentDate.getDay(); // days till next Monday
    if(currentDate.getDay() === 1){
      this.holidayList.push( currentDate );
    }
    for(let i = 0 ; i < week ; i++) {
    this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
    }
  }
  if(this.saturdayFlag === 'Y'){
    const offset = 6 - currentDate.getDay(); // days till next Monday
    if(currentDate.getDay() === 1){
      this.holidayList.push( currentDate );
    }
    for(let i = 0 ; i < week ; i++) {
    this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
    }
  }
  if(this.sundayFlag === 'Y'){
    this.calculateAllSunday(index,key);
  }
  this.form.get(FccConstants.FCM_PAYMENT_EFFECTIVE_DATE)[FccGlobalConstant.PARAMS]['holidayList'] = this.holidayList;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
calculateAllSunday(index,key) {
  const currentDate = new Date();
  const startDate = this.datepipe.transform(currentDate, 'yyyy-MM-dd');
  const maxDate = this.maxDate;
  const endDate = this.datepipe.transform(maxDate, 'yyyy-MM-dd');
  //const moment = require('moment');
  const start = moment(startDate);
  const end = moment(endDate);
  const day = 0;
  const current = start.clone();
  while (current.day(7 + day).isBefore(end)) {
    this.holidayList.push(current.clone());
  }

}

formatAmount(amt,key,index) {
  const val = amt;
  let valueupdated;
  if (val) {
    valueupdated = this.commonService.replaceCurrency(val);
    valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), FccConstants.FCM_ISO_CODE);
    for (const control of this.data) {
      if (control.name === key) {
        control.accordionControl.clearValidators();
        control.accordionControl.setErrors(null);
        control.accordionControl.setValue(valueupdated);
        FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = true;
        control.accordionControl.updateValueAndValidity();
        this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(valueupdated);

      }
    }
  }
}

onClickPaymentProductType(event,index,key) {
  if(event.value){
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.value );
    this.productTypeVal = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
    let filterParams: any = {};
    this.checkCutOffTimings(index,key);
    filterParams.packageCode = this.parentForm.get(FccConstants.FCM_PAYMENT_PACKAGES).value.label;
    filterParams.productCode = event.value.label;
    this.productTypeSelected = event.value.label;
    filterParams = JSON.stringify(filterParams);
    this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_PRODUCT_CODE_BASED_OPTIONS, filterParams ,index);
  }

}

checkCutOffTimings(index,key) {
  if (this.commonService.isnonEMptyString(
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value)) {
    const time = new Date();
    const getSystemHour = time.getHours();
    const getSystemMin = time.getMinutes();
    const productTime = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value.time;
    const spiltProductTime = productTime.split(':');
    const productTimeHour = parseInt(spiltProductTime[0]);
    const productTimeMin = parseInt(spiltProductTime[1]);
    if (getSystemHour >= productTimeHour && getSystemMin > productTimeMin){
      this.data.forEach((item) => {
        if (item.index === index && item.name === key) {
          item.accordionControl.clearValidators();
          item.accordionControl.markAsDirty();
          item.accordionControl.markAsTouched();
          FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = false;
          item.accordionControl[FccGlobalConstant.PARAMS].warning = '';
          item.accordionControl.setErrors({ productCutOffTime: true });
        }
      });
    }else{
      for (const control of this.data) {
        if (control.name === key) {
          FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = true;
          control.accordionControl.clearValidators();
          control.accordionControl.setErrors(null);
        }
      }

    }
  }
}

onClickPayTo(event,index,key,val? : any){
  if(event){
    if(event.value === undefined){
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
      panelControlArray[key].setValue(val);
    } else{
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
      panelControlArray[key].setValue(event.value);
    }
    this.payToVal = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
    panelControlArray['creditorAccountType'].setValue(this.payToVal.accountType);
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
    panelControlArray['accountNumber'].setValue(this.payToVal.label);
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
    panelControlArray['creditorAccountCurrency'].setValue(this.payToVal.currency);
  }
}


onClickBeneficiaryNameCode(event,index,key) {
  let filterParams: any = {};
  if (this.commonService.isnonEMptyString(event.option.value)) {
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.option.value);
    this.beneNameAndCodeVal = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
    panelControlArray['beneficiaryName'].setValue(event.option.value.name);
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
    panelControlArray['beneficiaryNameCode'].setValue(event.option.value.label);
    filterParams.packageCode = this.parentForm.get(FccConstants.FCM_PAYMENT_PACKAGES).value.label;
    filterParams.productCode = this.productTypeSelected;
    filterParams.receiverCode = event.option.value.label;
    filterParams = JSON.stringify(filterParams);
    this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_BENEFICIARY_CODE_BASED_OPTIONS, filterParams ,index);

  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
onChangeBeneficiaryNameCode(event,index,key) {
  if(event.target.value) {
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
    panelControlArray['beneficiaryName'].setValue(event.target.value);
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
    panelControlArray['beneficiaryNameCode'].setValue(event.target.value);
  }
}

onClickAdditionalInformation(event,index,key) {
  if (event.checked !== undefined) {
    const value = event.checked ? 'Y' : 'N';
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(value);
    const val = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
    const dataUpdate = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelData;
    if (val === FccGlobalConstant.CODE_Y) {
      this.switchchecked = true;
      this.setRenderOnlyFields(
        dataUpdate,
        FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS,
        true
      );
    } else {
      this.switchchecked = false;
      this.setRenderOnlyFields(
        dataUpdate,
        FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS,
        false
      );
    }
  }
}

onClickEffectiveDate(event,index,key){
  if(event.value){
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue( event.value );
    this.effctiveDateVal = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
    const currentDate = new Date();
    const date = currentDate.getDate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const maxdate = this.maxDays;
    const date2 = event.value.getDate();
    if (date === date2) {
      for (const control of this.data) {
        if (control.name === 'paymentProductType') {
          this.productCutofferr = control.accordionControl.getError('productCutOffTime');
          break;
        }
      }
      for (const control of this.data) {
        if (control.name === key) {
          if(this.productCutofferr){
            control.accordionControl.clearValidators();
            control.accordionControl.markAsDirty();
            control.accordionControl.markAsTouched();
            FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = false;
            control.accordionControl[FccGlobalConstant.PARAMS].warning = '';
            control.accordionControl.setErrors({ effectiveDateSelection: true });
          }
          break;
        }
      }
   } else{
    for (const control of this.data) {
      if (control.name === key) {
        FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = true;
        control.accordionControl.clearValidators();
        control.accordionControl.setErrors(null);
      }
    }
   }
  }
}

onBlurAmount(event,index,key){
  if(event.target.value){
    const amt = parseFloat(event.target.value);
    this.parentForm.get('totalAmt').setValue(this.parentForm.get('totalAmt').value + amt);
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.target.value);
    this.amountVal = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
    const updateVal = this.parentForm.get('totalAmt').value;
    this.transactionAmt = this.parentForm.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).value;
    this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.target.value);
    const productMinLimit = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]
                            ?.panelControlArray[FccConstants.FCM_PRODUCT_TYPE].value.perProductMinLimit;
    const productMaxLimit = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]
                            ?.panelControlArray[FccConstants.FCM_PRODUCT_TYPE].value.perProductMaxLimit;
    const productName = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]
                            ?.panelControlArray[FccConstants.FCM_PRODUCT_TYPE].value.label;
    this.isValid = /^[0-9]*$/.test(event.target.value);
    if(!this.isValid){
      this.data.forEach((item) => {
        if (item.index === index && item.name === key) {
          item.accordionControl.clearValidators();
          item.accordionControl.markAsDirty();
          item.accordionControl.markAsTouched();
          FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = false;
          item.accordionControl.setErrors({ batchAmt: true });
        }
      });
    }else if (amt < productMinLimit || amt > productMaxLimit){
      this.data.forEach((item) => {
        if (item.index === index && item.name === key) {
          item.accordionControl.clearValidators();
          item.accordionControl.markAsDirty();
          item.accordionControl.markAsTouched();
          FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = false;
          item.accordionControl.setErrors({ amountLimitPerProdType
                      :{ currency: this.currency, productMinLimit: productMinLimit, productMaxLimit: productMaxLimit ,
                        productName: productName } });
        }
      });
    }else if (this.transactionAmt && (updateVal > this.transactionAmt)){
      this.data.forEach((item) => {
        if (item.index === index && item.name === key) {
          item.accordionControl.clearValidators();
          item.accordionControl.markAsDirty();
          item.accordionControl.markAsTouched();
          FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = false;
          item.accordionControl.setErrors({ consumedAmtgretaer: true });
        }
      });
     } else {
      this.formatAmount(event.target.value,key,index);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
checkStatus(name,index){
  if(this.beneEditToggleVisible && this.benecodeFlag){
    if(this.productTypeVal && this.payFromval && this.beneNameAndCodeVal && this.currencyVal
      && this.amountVal && this.effctiveDateVal && this.accounTypeVal && this.accountNumVal && this.confimAccountVal
      && this.benecodeVal){
        this.disableButtn = false;
        const testarr = [];
        for(const key in FCMPaymentsConstants.FCM_BATCH_STATUS_ADHOC){
          testarr.push(FCMPaymentsConstants.FCM_BATCH_STATUS_ADHOC[key]);
        }
        for(const key in FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS){
          testarr.push(FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key]);
        }
        if(testarr.includes(false)){
          this.disableButtn = true;
          return true;
        }else{
          this.disableButtn = false;
          return false;
        }
    }else{
      this.disableButtn = true;
      return true;
    }

  } else if(this.beneEditToggleVisible && !this.benecodeFlag){
    if(this.productTypeVal && this.payFromval && this.beneNameAndCodeVal && this.currencyVal
      && this.amountVal && this.effctiveDateVal && this.accounTypeVal && this.accountNumVal && this.confimAccountVal
      ){
        this.disableButtn = false;
        const testarr = [];
        for(const key in FCMPaymentsConstants.FCM_BATCH_STATUS_ADHOC){
          testarr.push(FCMPaymentsConstants.FCM_BATCH_STATUS_ADHOC[key]);
        }
        for(const key in FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS){
          testarr.push(FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key]);
        }
        if(testarr.includes(false)){
          this.disableButtn = true;
          return true;
        }else{
          this.disableButtn = false;
          return false;
        }
    }else{
      this.disableButtn = true;
      return true;
    }
  }else{
    if(this.productTypeVal && this.payFromval && this.beneNameAndCodeVal && this.payToVal && this.currencyVal
      && this.amountVal && this.effctiveDateVal){
      this.disableButtn = false;
      const testarr = [];
      for(const key in FCMPaymentsConstants.FCM_BATCH_STATUS_NON_ADHOC){
        testarr.push(FCMPaymentsConstants.FCM_BATCH_STATUS_NON_ADHOC[key]);
      }
      for(const key in FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS){
        testarr.push(FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key]);
      }
      if(testarr.includes(false)){
        this.disableButtn = true;
        return true;
      }else{
        this.disableButtn = false;
        return false;
      }

    } else{
      this.disableButtn = true;
      return true;
    }
  }
}

onFocusAmount(event,index,key) {
  for (const control of this.data) {
    if (control.name === key) {
      control.accordionControl.clearValidators();
    }
  }
}

onBlurBeneficiaryCode(event,index,key) {
 if(event.target.value){
   this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.target.value);
   this.benecodeVal = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;

 } else{
  this.benecodeVal ='';
 }
}

buildSinglePaymentRequestObject(mappingModel, index): any {
  const requestObject = {};
  const objModel = FCMPaymentsConstants.FCM_ADD_BATCH_INSTRUMENT_FIELD;
    const sectionFormValue = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index].panelControlArray;
    if (sectionFormValue !== null && mappingModel !== null) {
      Object.keys(sectionFormValue).forEach(key => {
        const control = sectionFormValue[key];
        const mapping = objModel[key];
        let val = this.previewService.getPersistenceValue(control, false);
        if(key === FCMPaymentsConstants.AMOUNT && typeof val === 'string'){
          val = val.replace(/,/g,"");
        }
        if(mapping != undefined) {
          this.createNested(mapping,requestObject, val);
        } else {
          const mappingKey = this.productMappingService.getRequestFieldNameFromMappingModel(key, mappingModel);
          if (control[FccGlobalConstant.PARAMS][FccConstants.MAP_BOOLEAN_VALUE]) {
            requestObject[mappingKey] = (val === FccGlobalConstant.CODE_Y) ? true : false;
          } else {
            requestObject[mappingKey] = val;
          }
        }
      });
    }
  return requestObject;
}
createNested(mapping, requestObject, value){
  mapping = mapping.reverse();
  const lastIndex = mapping.length - 1;
  let child = {};
  let obj = {};
  mapping.forEach((element,index) => {
    if(index == 0){
      child[element] = value;
      obj = Object.assign({},child);
    } else if(index < mapping.length -2){
      obj = this.createChild(element,child);
      child = Object.assign({},obj);
    }
  });
  const val = mapping.length > 2 ? obj : value;
  if(requestObject[mapping[lastIndex]] !== undefined && requestObject[mapping[lastIndex]] !== null){
    const temp = Object.assign({},requestObject[mapping[lastIndex]][mapping[lastIndex-1]]);
    if(typeof val === 'string') {
      requestObject[mapping[lastIndex]][mapping[lastIndex-1]] = val;
    } else {
      requestObject[mapping[lastIndex]][mapping[lastIndex-1]] = Object.assign(temp,val);
    }
  } else {
    requestObject[mapping[lastIndex]] = this.createChild([mapping[lastIndex-1]],val);
  }
  mapping.reverse();
}

createChild(key,obj){
  return { [key] : obj };
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
onClickSavePayment(oEvent,index,key){
  this.parentForm.get('createPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
  let instrumentObj;
  if (this.apiModel) {
    instrumentObj = this.buildSinglePaymentRequestObject(this.apiModel, index);
  }
  const batchObj = {
    paymentReference: this.parentForm.get('paymentPackages').value.label,
    transactionType: this.parentForm.get('transactionType').value
  };
  let requestObj = { ...batchObj, ...instrumentObj };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  this.paymentService.addInstrumnet(requestObj, this.paymentRefNo).subscribe((data) => {
    requestObj = {};
  });
  this.parentForm.controls.batchpaymentAccordion[FccGlobalConstant.PARAMS].formAccordionPanels[index].status =
  this.translateService.instant('complete');
  this.parentForm.controls.batchpaymentAccordion[FccGlobalConstant.PARAMS].formAccordionPanels[index].amount =
  this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray['amount'].value;
  this.resetDisable = true;
  this.productTypeVal ='';

  }

  onKeyupBeneficiaryBankIfscCodeIcons(event,index,key) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === FccGlobalConstant.LENGTH_13) {
      this.onClickBeneficiaryBankIfscCodeIcons(event,index,key);
    }
  }

  onClickBeneficiaryBankIfscCodeIcons(event,index,key) {
    const obj = {};
    this.preapreLookUpObjectData(obj);
    const header = `${this.translateService.instant('IFSC_Details')}`;
    this.resolverService.getSearchData(header, obj);
    this.ifscResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
          if (response) {
            for (const control of this.data) {
              if (control.name === 'beneficiaryBankIfscCode') {
                control.accordionControl.setValue(response.responseData.IFSC);
              }
            }
            this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].
            setValue(response.responseData.IFSC);
            //this.form.get(FccConstants.BENE_BANK_IFSC_CODE).setValue(response.responseData.IFSC);
            // const options = this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.OPTIONS];
            // const valObj = this.dropdownAPIService.getDropDownFilterValueObj(options, FccConstants.BENE_BANK_IFSC_CODE, this.form);
            // if (valObj) {
            //   this.form.get(FccConstants.BENE_BANK_IFSC_CODE).setValue(valObj[`value`]);
            // }
            // this.form.get(FccConstants.BENEFICIARY_BANK_CODE).setValue(response.responseData.DRAWEE_BANK_CODE);
            // this.form.get(FccConstants.BENEFICIARY_BRANCH_CODE).setValue(response.responseData.DRAWEE_BRANCH_CODE);
            // this.form.get(FccConstants.BENEFICIARY_BANK_BRANCH).setValue(response.responseData.DRAWEE_BRANCH_DESCRIPTION);
            // this.form.updateValueAndValidity();
          }
        }
      );
  }

  preapreLookUpObjectData(obj) {
    let filterParams: any = {};
    filterParams.paymentType = "06";
    filterParams = JSON.stringify(filterParams);
    obj[FccGlobalConstant.FILTER_PARAMS] = filterParams;
    obj[FccGlobalConstant.PRODUCT] = '';
    obj[FccGlobalConstant.DEFAULT_CRITERIA] = true;
    obj[FccConstants.BENE_BANK_CODE_OPTION] = FccConstants.BENE_BANK_IFSC_CODE;
    obj[FccGlobalConstant.SUB_PRODUCT_CODE] = '';
    obj[FccGlobalConstant.BUTTONS] = false;
    obj[FccGlobalConstant.SAVED_LIST] = false;
    obj[FccGlobalConstant.HEADER_DISPLAY] = false;
    obj[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] = false;
    obj[FccGlobalConstant.CATEGORY] = FccConstants.FCM;
  }

  onClickAccountType(event,index,key){
    if(event.value){
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.value);
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
      panelControlArray['creditorAccountType'].setValue(event.value.shortName);
      this.accounTypeVal = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
    }
  }

  onBlurAccountNumber(event,index,key){
    if(event.target.value){
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.target.value);
      this.accountNumVal = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
    }
  }

  onBlurConfirmAccountNumber(event,index,key){
    if(event.target.value){
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.target.value );
      this.confimAccountVal = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
      if(!this.checkAccountNumberMatch(event,index,key)) {
        this.data.forEach((item) => {
          if (item.index === index && item.name === key) {
            item.accordionControl.markAsDirty();
            item.accordionControl.markAsTouched();
            FCMPaymentsConstants.FCM_BATCH_STATUS_ADHOC[key] = false;
            item.accordionControl.setErrors({ accountNumberMismatch: true });
          }
        });
      }else{
        for (const control of this.data) {
          if (control.name === key) {
            FCMPaymentsConstants.FCM_BATCH_STATUS_ADHOC[key] = true;
            control.accordionControl.clearValidators();
            control.accordionControl.setErrors(null);
          }
        }
    }
  }
}

  checkAccountNumberMatch(event,index,key):boolean {
    const accountNo = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]
    ?.panelControlArray['accountNumber'].value;
    const confirmAccountNo = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]
    ?.panelControlArray[key].value;
    if (this.commonService.isNonEmptyValue(accountNo) &&
        this.commonService.isNonEmptyValue(confirmAccountNo)) {
      return(accountNo === confirmAccountNo);
    }
  }

  onClickBeneficiaryBankIfscCode(event,index,key){
    if(event.value){
     this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.value);
     this.effectiveDateVal = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
    }
   }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickPayFrom(event,index,key){
    if(event){
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.value);
      this.payFromval = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
      panelControlArray['debtorAccountId'].setValue( event.value.accountId );
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
      panelControlArray['debitorCurrency'].setValue( event.value.currency );
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
      panelControlArray['debitorType'].setValue( event.value.accountType );
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
      panelControlArray['debitorName'].setValue( event.value.accountName );
    }
  }

  onClickCurrency(event,index,key){
    if(event.value){
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.value);
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.
      panelControlArray['creditorAccountCurrency'].setValue(event.value.shortName);
      this.currencyVal = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
    }
  }

  onClickAddBeneficiaryCheckbox(event,index,key){
    if (event.checked !== undefined) {
      const value = event.checked ? 'Y' : 'N';
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(value);
      const val = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].value;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dataUpdate = this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelData;
      if (val === FccBusinessConstantsService.YES) {
      this.benecodeFlag = true;
      this.checkboxBeneChecked = true;
      this.setRenderOnlyFields(
        this.data,
        FCMPaymentsConstants.DISPLAY_BENE_CODE,
        true
      );

    } else {
      this.benecodeFlag = false;
      this.benecodeVal ='';
      this.checkboxBeneChecked = false;
      this.setRenderOnlyFields(
        this.data,
        FCMPaymentsConstants.DISPLAY_BENE_CODE,
        false
      );
    }
  }
}

  onBlurCustomerReferenceNumber(event,index,key){
   if(event.target.value){
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue(event.target.value );
      this.isValid = /^[a-zA-Z0-9]*$/.test(event.target.value);
      if(!this.isValid){
        this.data.forEach((item) => {
          if (item.index === index && item.name === key) {
            item.accordionControl.clearValidators();
            item.accordionControl.markAsDirty();
            item.accordionControl.markAsTouched();
            FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = false;
            item.accordionControl.setErrors({ batchCustRefNumber: true });
          }
        });
      }else{
        for (const control of this.data) {
          if (control.name === key) {
            FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = true;
            control.accordionControl.clearValidators();
            control.accordionControl.setErrors(null);
          }
        }
      }
    }
  }

  onBlurReceiverType(event,index,key){
    if(event){
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue( event );
    }
  }

  onClickReceiverType(event,index,key) {
    if(event){
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue( event );
    }
  }

  onBlurLeiCode(event,index,key){
    if(event.target.value){
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].setValue( event.target.value);
      this.isValid = /^[a-zA-Z0-9]*$/.test(event.target.value);
      if(!this.isValid){
        this.data.forEach((item) => {
          if (item.index === index && item.name === key) {
          item.accordionControl.clearValidators();
          item.accordionControl.markAsDirty();
          FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = false;
          item.accordionControl.markAsTouched();
          item.accordionControl[FccGlobalConstant.PARAMS].warning = '';
          item.accordionControl.setErrors({ productCutOffTime: true });

          }
        });
      }else{
        for (const control of this.data) {
          if (control.name === key) {
            FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = true;
            control.accordionControl.clearValidators();
            control.accordionControl.setErrors(null);
          }
        }
      }
    }
  }

  onBlurEmailID(event,index,key){
    if(event.target.value){
      this.form[FccGlobalConstant.PARAMS][FccConstants.FCM_FORM_ACCORIONPANEL][index]?.panelControlArray[key].
      setValue( event.target.value );
      const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
      this.isValid = regex.test(event.target.value);
      if(!this.isValid){
        this.data.forEach((item) => {
          if (item.index === index && item.name === key) {
          item.accordionControl.clearValidators();
          item.accordionControl.markAsDirty();
          FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = false;
          item.accordionControl.markAsTouched();
          item.accordionControl[FccGlobalConstant.PARAMS].warning = '';
          item.accordionControl.setErrors({ validEmail: true });

          }
        });
      }else{
        for (const control of this.data) {
          if (control.name === key) {
            FCMPaymentsConstants.FCM_BATCH_COMMON_FIELDS[key] = true;
            control.accordionControl.clearValidators();
            control.accordionControl.setErrors(null);
          }
        }
      }
    }
  }

  getCurrencyDetail() {
    this.subscriptions.push(this.commonService.userCurrencies(this.curRequest).subscribe(
      response => {
        if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else {
          response.items.forEach(
            value => {
              const ccy: { label: string, value } = {
                label: value.isoCode,
                value: {
                  label: value.isoCode,
                  iso: `${value.isoCode} - ${this.toTitleCase(value.name)}`,
                  country: value.principalCountryCode,
                  currencyCode: value.isoCode,
                  shortName: value.isoCode,
                  name: value.name
                }
              };
              for (const control of this.data) {
                if (control.name === 'currency') {
                  if(!control.accordionControl.params.options.includes(ccy)){
                    control.accordionControl.params.options.push(ccy);
                   // control.accordionControl.options.push(ccy);
                  }
                }
              }
            });
         // this.patchFieldParameters(this.form.get(FccGlobalConstant.CURRENCY), { options: this.currency });
        }
        // if (this.form.get(FccGlobalConstant.CURRENCY).value !== FccGlobalConstant.EMPTY_STRING) {
        //   const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency,
        //     FccGlobalConstant.CURRENCY, this.form);
        //   if (valObj) {
        //     this.form.get(FccGlobalConstant.CURRENCY).patchValue(valObj[`value`]);
        //   }
        // }
      })
    );


}
toTitleCase(value) {
  return value.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
onClickResetPayment(event,index,name){
  for (const control of this.data) {
    if( control.name === "additionalInformation"){
      this.switchchecked = false;
      event.checked = false;
      this.onClickAdditionalInformation(event,index,control.name);
    } else if (control.name === "confidentialCheckbox"){
      this.checkboxPaymentChecked = false;

    }else if (control.name === "addBeneficiaryCheckbox"){
      this.checkboxBeneChecked = false;
      event.checked = false;
      this.onClickAddBeneficiaryCheckbox(event,index,control.name);
    }else{
      control.accordionControl.setValue(null);

    }

   }
 }
}

