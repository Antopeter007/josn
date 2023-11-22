import { Directive, ElementRef, Input, Optional, ViewChild } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { UtilityService } from '../../corporate/trade/lc/initiation/services/utility.service';
import { FccConstants } from './../../common/core/fcc-constants';
import { FccGlobalConstant } from './../../common/core/fcc-global-constants';
import { FCCFormGroup } from './fcc-control.model';
import moment from 'moment';
//const moment = require('moment');

@Directive()
export class FCCBase {
  @Input() hostComponentData: any | null;
  @Input() mode: string;

  imagePath = localStorage.getItem(FccGlobalConstant.IMAGE_PATH);
  context = localStorage.getItem(FccGlobalConstant.CONTEXT_PATH);
  dir = localStorage.getItem('langDir') !== null && localStorage.getItem('langDir') !== '' ? localStorage.getItem('langDir') : 'ltr';
  @ViewChild(MatAccordion) public accordion: MatAccordion;
  step = 0;
  arrowIconSubject = new BehaviorSubject('arrow_drop_down');
  filteredWrapperOptions: Observable<any[]>;
  inputValue: any;
  // bene Save Toggle
  toggleVisibilityChange = new Subject<boolean>();
  htmlContent = '';
  onlyamendToggleValue = false;

  constructor(@Optional() protected utilityService?: UtilityService){

}
  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onthreeDotsButtonEventRaised(event, key, form) {
    const oEvent = event;
    const type = event.type;
    const name = 'threeDots';
    if (name !== undefined && name !== null) {
      const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
      this.hostComponentData[fnName](oEvent, key,form);
    }
  }

  onEventRaised(event, key, control = '') {
    const oEvent = event;

    if (event.type === undefined) {
      event = event.originalEvent;
    }
    const type = event.type;
    let name = event.srcElement.id;
    if (control === FccConstants.NEWS_CONTROL_HEADER) {
      name = control;
    } else if (control === 'cancelIcon') {
      name = `cancel${key.substr(0, 1).toUpperCase()}${key.substr(1)}`;
    } else if (name === undefined || name === '') {
      name = key;
    } else if(control === 'dynamicField'){
      name = key.substr(0,key.length-1);
    }

    if (name !== undefined && name !== null && name !== '' ) {
      const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
      const fn = this.hostComponentData[fnName];
      if (fn && (typeof fn === 'function') && control === FccConstants.NEWS_CONTROL_HEADER) {
        this.hostComponentData[fnName](oEvent, key);
      } else  if (key = FccConstants.DOWNLOAD && (
        control !== undefined && control !== null && control !== FccGlobalConstant.EMPTY_STRING)){
        this.hostComponentData[fnName](oEvent, key, control);
      } else if (fn && (typeof fn === 'function')) {
        this.hostComponentData[fnName](oEvent);
      }
    }
  }

  onCancelEventRaised(event, key, control) {
    const oEvent = event;
    if (event.type === undefined) {
      event = event.originalEvent;
    }
    const type = event.type;
    let name = event.srcElement.id;
    if (key === 'cancelIcon') {
      name = key;
    }
    if (name !== undefined && name !== null && name !== '' ) {
      const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
      const fn = this.hostComponentData[fnName];
      if (fn && (typeof fn === 'function')) {
        this.hostComponentData[fnName](oEvent, event.target.parentElement.innerText.toString().split('\n')[0]);
      }
    }
  }

  customEventRaised(event, key, control = '') {
    const oEvent = event;
    if (event.type === undefined) {
      event = event.originalEvent;
    }
    const type = event.type;
    let name = event.srcElement.id;
    if (control === FccConstants.NEWS_CONTROL_HEADER) {
      name = control;
    } else if (name === undefined || name === '') {
      name = key;
    }
    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`
    .replace(/\d+$/, "");
    const fn = this.hostComponentData[fnName];
    this.hostComponentData[fnName](oEvent, key);
  }

  onOptionSelectEventRaised(event, key, options, control) {
    this.checkValuePresent(event, options, control);
    this.arrowIconSubject.next('arrow_drop_down');
    const oEvent = event;
    const name = key;
    const fnName = `onClick${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](options.find(compOption =>
        compOption.value.name.toLowerCase() === event?.option?.value?.name?.toLowerCase()));
    }
    const form = this.hostComponentData[FccGlobalConstant.FORM];
    this.addAmendLabelIcon(control, form.controls);
  }

  dofilterAutoComp(event, key, control) {
    const form = this.hostComponentData[FccGlobalConstant.FORM];
    if (control?.params?.lazyLoadingDisabled) {
      this.filteredWrapperOptions = control.valueChanges
    .pipe(
      startWith(''),
      // eslint-disable-next-line no-shadow
      map(value => value ? this.hostComponentData.onKeyupBeneficiaryBankIfscCode(event, value) : control.params.options)
      );
    } else {
      this.filteredWrapperOptions = control.valueChanges
    .pipe(
      startWith(''),
      // eslint-disable-next-line no-shadow
      map(value => value ? this._filter(value, control.params.options) : control.params.options)
      );
    }
  }

  // eslint-disable-next-line no-shadow
  _filter(value: any, autoFilterOptions: any[]): any[] {
    if (typeof value !== 'object') {
    const filterValue = value.toLowerCase();
    return autoFilterOptions.filter(
      option => option.value.label.toLowerCase().indexOf(filterValue) !== -1 ||
      option.value.name.toLowerCase().indexOf(filterValue) !== -1);
    } else {
      const filter = value?.label?.toLowerCase();
      return autoFilterOptions.filter(
        option => option.value.label.toLowerCase().indexOf(filter) !== -1 ||
        option.value.name.toLowerCase().indexOf(filter) !== -1);
    }
  }

  // compare if the entered value exists in dropdown option and display toggle if not present
  checkValuePresent(evt: Event, autoFilterOptions: any[], control?: any): void {
    this.arrowIconSubject.next('arrow_drop_down');
    //in case user is adding a new beneficiary
    if ( control?.params?.lazyLoadingDisabled ) {
      this.setIfscSaveToggle(true);
    } else if (this.inputValue && this.inputValue.length >= 1 && this.inputValue.name === undefined && !this.checkInputHavingOnlyWhiteSpace(this.inputValue) &&
      !autoFilterOptions?.find(compOption =>
        compOption.value.name.toLowerCase() === this.inputValue.toLowerCase())) {
          this.setBeneSaveToggle(true);
    } // in case user has already added a new benef while creating a new tnx but its not saved in DB,
      //the save toggle should come
    else if (this.inputValue && this.inputValue.name !== undefined &&
    !autoFilterOptions.find(compOption =>
      compOption.value.name.toLowerCase() === this.inputValue.name.toLowerCase())) {
        this.setBeneSaveToggle(true);
      } else {
          this.setBeneSaveToggle(false);
      }
    }

  checkInputHavingOnlyWhiteSpace(value: string){
    if (!value.replace(/\s/g, '').length) {
      this.inputValue = '';
      return true;
    }
    return false;
  }

  setBeneSaveToggle(istoggleVisible: boolean): void {
    this.toggleVisibilityChange.next(istoggleVisible);
    const fnName = 'checkBeneSaveAllowed';
    this.hostComponentData[fnName](istoggleVisible);
  }

  setIfscSaveToggle(istoggleVisible: boolean): void {
    this.toggleVisibilityChange.next(istoggleVisible);
    const fnName = 'checkIfscSaveAllowed';
    this.hostComponentData[fnName](istoggleVisible);
  }

  displayFn(value: any | string) {
    return !value
     ? ''
     : typeof value === 'string'
       ? value
       : value.name;
 }

  onClickCaptcha(captchaResponse: string) {
    this.onClickCaptcha(captchaResponse);
  }

  onCustomEventRaised(event, key, control) {
    if(control?.params?.dynamicField){
      this.onEventRaised(event, key, 'dynamicField');
    } else {
      this.onEventRaised(event, key);
    }
    const form = this.hostComponentData[FccGlobalConstant.FORM];
    this.addAmendLabelIcon(control, form.controls);
  }

  convert(str) {
    const date = new Date(str);
    const mnth = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('/');
  }

  isArrayOrObjectField(control, value, previousValue, form) {
    if (value instanceof Array) {
      if (JSON.stringify(value) !== JSON.stringify(previousValue)) {
        let differArray = value?.filter(x => previousValue?.indexOf(x) === -1);
        if (value.length === 1) {
          differArray = value;
        }
        this.patchFieldParameters(control, {infoIcon: true, infolabel: FccGlobalConstant.AMENDED, resultArray: differArray});
      } else {
        this.patchFieldParameters(control, { infoIcon: false });
        return true;
      }
    }
    const previousCompareValue = control.params.previousCompareValue === undefined || control.params.previousCompareValue === null
      ? '' : control.params.previousCompareValue;
    const currentValue = value === undefined || value === null
    ? '' : value;
    if (value instanceof Object && control.params.previousCompareValue !== undefined) {
      const fields = Object.keys(form);
      if (control.params.grouphead) {
        fields.forEach(fieldName => {
          const fieldObj = form[fieldName];
          if (typeof fieldObj === FccGlobalConstant.OBJECT && fieldObj.key && fieldObj.key === control.params.grouphead) {
            if (control.type === FccGlobalConstant.INPUT_AUTOCOMPLETE){
              this.groupAmendLabel(control, value.name, form, fieldObj);
            } else if (control.type === FccGlobalConstant.inputDate) {
              const actualDate = this.convert(control.value);
              if (actualDate === previousValue) {
                this.patchFieldParameters(fieldObj, {infoIcon: false, isAmendedLabel: false});
                this.patchFieldParameters(control, {infoIcon: false});
                if (control.params.groupHeaderForLabel !== undefined && control.params.groupHeaderForLabel) {
                  this.patchFieldParameters(form[control.params.groupHeaderForLabel], {infoIcon: false, isAmendedLabel: false});
                }
              } else {
                this.patchFieldParameters(fieldObj, {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
                this.patchFieldParameters(control, {infoIcon: true, groupLabel: true, infolabel: FccGlobalConstant.AMENDED});
                if (control.params.groupHeaderForLabel !== undefined && control.params.groupHeaderForLabel) {
                  this.patchFieldParameters(form[control.params.groupHeaderForLabel],
                    {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
                }
              }
            } else{
            this.groupAmendLabel(control, value.shortName, form, fieldObj);
            }
          }
        });
      } else {
        if (control.type === 'input-date') {
          const actualDate = this.convert(value);
          if (actualDate === previousValue) {
            this.patchFieldParameters(control, {infoIcon: false});
          } else {
            this.patchFieldParameters(control, {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
          }
        } else {
          if (control.params.previousCompareValue !== undefined && value.shortName !== control.params.previousCompareValue) {
            this.patchFieldParameters(control, {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
          } else {
            this.patchFieldParameters(control, {infoIcon: false});
          }
         }
      }
      return true;
    } else if (control.type === 'input-date' && previousCompareValue === currentValue) {
      this.patchFieldParameters(control, {infoIcon: false});
      return true;
    }
    return false;
  }

  onCounterEventRaised(event, key) {
    const oEvent = event;
    let name2;
    let name;
    let numberKey = true;
    const numberKeyCheck = key.match(/\d+/g);
    if (numberKeyCheck != null) {
      numberKey = false;
    }

    if (event.type === undefined) {
      event = event.originalEvent;
    }
    const type = event.type;
    name2 = event.srcElement.id;
    name = name2.replace(/[0-9]/g, '');


    if (name === undefined || name === '') {
      name = key.replace(/[0-9]/g, '');
    }
    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function') && numberKey) {
      this.hostComponentData[fnName](oEvent);
    } else {
      this.hostComponentData[fnName](oEvent, key);
    }
  }

  onMatTabChange(event, tabs: ElementRef) {
    const oEvent = event;
    const fnName = 'onMatSectionChange';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, tabs);
    }
  }

  dateValidation(value: string, control: any) {
    if (!this.isValidDate(value)) {
      control.setErrors({ invalidDate: true});
      control.updateValueAndValidity();
      return;
    }
    if (control.params.maxValueDate !== '' && control.value !== '') {
      const maxValueDate = new Date(control.params.maxValueDate);
      if (new Date(control.value) > maxValueDate) {
        control.setErrors({ maxDate: { maxDate: this.formDate(control.params.maxValueDate) } });
      }
    }
    if (control.params.minValueDate !== '' && control.value !== '') {
      const minValueDate = new Date(control.params.minValueDate);
      if (new Date(control.value) < minValueDate) {
        control.setErrors({ minDate: { minDate: this.formDate(control.params.minValueDate) } });
      }
    }
  }

  formDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [day, month, year].join('/');
}

  onCountEventRaised(event, key) {
    const oEvent = event;
    let name;
    let numberKey = true;
    const numberKeyCheck = key.match(/\d+/g);
    if (numberKeyCheck != null) {
      numberKey = false;
    }

    if (event.type === undefined) {
      event = event.originalEvent;
    }
    const type = event.type;
    name = key.replace(/[0-9]/g, '');

    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function') && numberKey) {
      this.hostComponentData[fnName](oEvent);
    } else {
      this.hostComponentData[fnName](oEvent, key);
    }
  }

  onChangeEventRaised(event, key) {
    if (this.hostComponentData && this.hostComponentData.useOnChange) {
      const oEvent = event;
      const fnName = 'onChange' + key;
      const fn = this.hostComponentData[fnName];
      if (fn && (typeof fn === 'function')) {
        this.hostComponentData[fnName](oEvent, key);
      }
    } else {
      this.onEventRaised(event, key);
    }
  }

  onChangeCustomEventRaised(event, key) {
    const oEvent = event;
    const fnName = 'onChange' + key;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, key);
    }
  }

  OnDateRangeChange(event, type, key) {
    const oEvent = event;
    const fnName = 'onChange' + type;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, key);
    }
  }

  OnBlurDateRange(event, type, key) {
    const oEvent = event;
    const fnName = 'onBlur' + type;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, key);
    }
  }

  addAmendLabelIconDataFromPopup(control, form) {
    const fields = Object.keys(form);
    if (control.params.grouphead) {
      fields.forEach(fieldName => {
        const fieldObj = form[fieldName];
        if (typeof fieldObj === FccGlobalConstant.OBJECT && fieldObj.key && fieldObj.key === control.params.grouphead) {
          this.groupAmendLabelFormFields(control, form, fieldObj);
        }
      });
    }
  }

  addAmendLabelIcon(control, form) {
    const arrayField = this.isArrayOrObjectField(control, control.value, control.params.previousCompareValue, form);
    if (!arrayField) {
      const fields = Object.keys(form);
      if (control.params.grouphead) {
        fields.forEach(fieldName => {
          const fieldObj = form[fieldName];
          if (typeof fieldObj === FccGlobalConstant.OBJECT && fieldObj.key && fieldObj.key === control.params.grouphead) {
            this.groupAmendLabel(control, control.value, form, fieldObj);
          }
        });
      } else {
        if (control.params.isEmptyField !== undefined && control.params.isEmptyField &&
          control.value !== control.params.previousCompareValue && (control.params[FccGlobalConstant.AMEND_SPCIFIC_FIELD] !== true)) {
              this.patchFieldParameters(control, {isAmendedLabel: true});
              if (control.params.groupHeaderForLabel !== undefined && control.params.groupHeaderForLabel) {
                this.patchFieldParameters(form[control.params.groupHeaderForLabel], {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
              }
        } else {
          this.patchFieldParameters(control, {isAmendedLabel: false});
          if (control.params.groupHeaderForLabel !== undefined && control.params.groupHeaderForLabel) {
            this.patchFieldParameters(form[control.params.groupHeaderForLabel], {infoIcon: false, isAmendedLabel: false});
          }
        }
        if ((control.params.isAmendedLabel !== undefined && control.params.isAmendedLabel) ||
            ((control.params[FccGlobalConstant.AMEND_SPCIFIC_FIELD] !== true)
            && control.params.previousCompareValue !== undefined && control.value !== control.params.previousCompareValue)) {
          this.patchFieldParameters(control, {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
          if (control.params.groupHeaderForLabel !== undefined && control.params.groupHeaderForLabel) {
            this.patchFieldParameters(form[control.params.groupHeaderForLabel], {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
          }
        } else if (control.params.disableStaticInfoLabel) {
          this.patchFieldParameters(control, {infoIcon: true});
        } else {
          this.patchFieldParameters(control, {infoIcon: false});
          if (control.params.groupHeaderForLabel !== undefined && control.params.groupHeaderForLabel) {
            this.patchFieldParameters(form[control.params.groupHeaderForLabel], {infoIcon: false, isAmendedLabel: false});
          }
        }
      }
    }
  }
  removeAmendIcon(control, form) {
    const arrayField = this.isArrayOrObjectField(control, control.value, control.params.previousCompareValue, form);
    if (!arrayField) {
      const fields = Object.keys(form);
      if (control.params.grouphead) {
        fields.forEach(fieldName => {
          const fieldObj = form[fieldName];
          if (typeof fieldObj === FccGlobalConstant.OBJECT && fieldObj.key && fieldObj.key === control.params.grouphead) {
            this.removeGroupAmendLabel(control, control.value, form, fieldObj);
          }
        });
      } else {
        this.patchFieldParameters(control, {isAmendedLabel: false});
        this.patchFieldParameters(control, {infoIcon: false});
      }
    }
  }

  removeGroupAmendLabel(control, value, form, fieldObj) {
    this.patchFieldParameters(control, {isAmendedLabel: false});
    {
      fieldObj.params.groupChildren.forEach(element => {
            this.patchFieldParameters(form[element], {isAmendedLabel: false});
            this.patchFieldParameters(form[element], {infoIcon: false});
      });
      this.noAmendIcon(fieldObj, control);
    }
  }
  groupAmendLabel(control, value, form, fieldObj) {
      if (control.params.isEmptyField !== undefined && control.params.isEmptyField
            && value !== control.params.previousCompareValue) {
              this.patchFieldParameters(control, {isAmendedLabel: true});
              if (control.params.isBankSection !== undefined && control.params.isBankSection) {
                this.patchFieldParameters(control, {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
              }
        } else {
          this.patchFieldParameters(control, {isAmendedLabel: false, infoIcon: false});
        }
      if (control.params.isBankSection !== undefined && control.params.isBankSection &&
        value === control.params.previousCompareValue) {
          this.patchFieldParameters(control, {infoIcon: false});
        }
      if (control.params.previousCompareValue && value !== control.params.previousCompareValue) {
        if (control.params.isBankSection !== undefined && control.params.isBankSection) {
          this.patchFieldParameters(control, {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
        } else{
          this.patchFieldParameters(fieldObj, {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
          if (control.params.groupHeaderForLabel !== undefined && control.params.groupHeaderForLabel) {
            this.patchFieldParameters(form[control.params.groupHeaderForLabel], {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
          }
          // For radio buttons, it will always have a default value. Assigning infolabel in some cases
          if (control.type === FccGlobalConstant.inputRadio) {
           this.patchFieldParameters(control, {infoIcon: true, groupLabel: true, infolabel: FccGlobalConstant.AMENDED});
          } else {
            this.patchFieldParameters(control, {infoIcon: true, groupLabel: true});
          }
        }
      } else {
        this.groupAmendLabelFormFields(control, form, fieldObj);
      }
  }

  groupAmendLabelFormFields(control, form, fieldObj) {
    let isAmended = false;
    let isEmptyLabel = false;
    let isBankSection = false;

    fieldObj?.params?.groupChildren?.forEach(element => {
      if (form[element] && form[element].value instanceof Object) {
        if (form[element].type === FccGlobalConstant.INPUT_AUTOCOMPLETE){
          if (form[element].params.previousCompareValue && form[element].value.name !== form[element].params.previousCompareValue) {
            isAmended = true;
          }
        } else if (form[element].type === FccGlobalConstant.inputDate) {
          const actualDate = this.convert(form[element].value);
          if (form[element].params.previousCompareValue && actualDate !== form[element].params.previousCompareValue) {
            isAmended = true;
          }
        } else{
          if (form[element].params.previousCompareValue && form[element].value.shortName !== form[element].params.previousCompareValue) {
            isAmended = true;
          }
        }
        const checkPreviewValue = form[element].params.previewValueAttr;
        if (form[element].params.isEmptyField !== undefined && form[element].params.isEmptyField
          && checkPreviewValue === 'name' && form[element].value.name !== form[element].params.previousCompareValue) {
          isAmended = true;
        } else if (form[element].params.isEmptyField !== undefined && form[element].params.isEmptyField
          && (checkPreviewValue === undefined || checkPreviewValue === 'shortName') &&
            form[element].value.shortName !== form[element].params.previousCompareValue) {
            isAmended = true;
        }
      } else {
        if (form[element] && form[element].params.isBankSection !== undefined && form[element].params.isBankSection ) {
          if (form[element].value !== undefined && form[element].value !== '' && form[element].value !== null
          && form[element].params.previousCompareValue !== undefined && form[element].value !== form[element].params.previousCompareValue) {
            isBankSection = true;
            this.patchFieldParameters(form[element], {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
          } else if (form[element].value === form[element].params.previousCompareValue) {
            this.patchFieldParameters(form[element], {infoIcon: false});
          }
        } else {
        if (form[element] && form[element].params.isEmptyField !== undefined && form[element].params.isEmptyField &&
          form[element].value !== undefined && form[element].value !== '' && form[element].value !== null
          && form[element].value !== form[element].params.previousCompareValue) {
          isEmptyLabel = true;
          if (element === control.key)
          {
           this.patchFieldParameters(control, {infoIcon: true, groupLabel: true});
          }
          this.patchFieldParameters(fieldObj, {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
          const customHeaderForAmend = form[element].params.groupHeaderForLabel;
          if (customHeaderForAmend && customHeaderForAmend !== undefined) {
            this.patchFieldParameters(form[customHeaderForAmend], {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
            if (element === control.key)
            {
             this.patchFieldParameters(control, {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
            }
          }
        }
        if (form[element] && form[element].params.previousCompareValue
          && form[element].value && form[element].value !== form[element].params.previousCompareValue) {
          isAmended = true;
        }
      }
      }
    });
    if (isAmended && !isEmptyLabel) {
      this.patchFieldParameters(fieldObj, {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
      const customHeaderForAmend = control.params.groupHeaderForLabel;
      if (control.params.groupHeaderForLabel !== undefined && control.params.groupHeaderForLabel) {
        this.patchFieldParameters(form[customHeaderForAmend], {infoIcon: true, infolabel: FccGlobalConstant.AMENDED});
      }
      this.patchFieldParameters(control, {infoIcon: false});
    } else if (!isEmptyLabel && !isBankSection) {
      if (control.params.groupHeaderForLabel !== undefined && control.params.groupHeaderForLabel) {
        fieldObj = form[control.params.groupHeaderForLabel];
      }
      this.noAmendIcon(fieldObj, control);
    }
  }

  noAmendIcon(fieldName, control) {
    this.patchFieldParameters(control, {isAmendedLabel: false});
    this.patchFieldParameters(fieldName, {infoIcon: false});
    this.patchFieldParameters(control, {infoIcon: false});
  }

  // No custom code here, could be used as generic mat handler
  onMatEventRaised(event, key) {
    const oEvent = event;

    if (event.type === undefined) {
      event = event.source;
    }
    let type = event.type;
    const name = type !== undefined ? event.srcElement.id : key;
    type = type === undefined ? 'click' : type;

    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
    }
  }

  // Raise on Select button value change
  onMatSelectionEventRaised(event, key, control) {
    this.onMatEventRaised(event, key);
    const form = this.hostComponentData[FccGlobalConstant.FORM];
    this.addAmendLabelIcon(control, form.controls);
    this.addInfoIconForTimeframe(control);
  }

  addInfoIconForTimeframe(control) {
    if (control.params.srcElementId == "timeframe") {
      control.params.infoIcon = true;
    }
  }
  // Raise on date value change
  /**
   * Date picker date validation
   * If date is not valid setting error in control of invalid date
   * Once the date is valid then event will be raised for the particular control
   */
  onMatDateEventRaised(event, key, control, pickerInput) {
    let flag = false;
    if (control?.params?.enrichment && pickerInput !== '' &&  pickerInput !== null && pickerInput !== undefined) {
      this.dateValidation(pickerInput, control);
      flag = true;
    }
    if (!flag) {
      if (pickerInput && !this.isValidDate(pickerInput)) {
        if (FccGlobalConstant.INVALID_DATE  !==  control.errors){
          const invalidDate = FccGlobalConstant.INVALID_DATE;
          control.setErrors({ invalidDate: {invalidDate}});
         if(!control.params.required && (pickerInput === null || pickerInput === '')) {
           control.setErrors(null);
         }
          //control.updateValueAndValidity();
        }
      } else if (!pickerInput && control.errors && control.errors[FccGlobalConstant.INVALID_DATE]){
        delete control.errors[FccGlobalConstant.INVALID_DATE];
        control.updateValueAndValidity();
      } else {
        if (control.errors && control.errors[FccGlobalConstant.INVALID_DATE]) {
          delete control.errors[FccGlobalConstant.INVALID_DATE];
          control.updateValueAndValidity();
        }
        const oEvent = event;
        let type = event.type;
        const name = type !== undefined ? event.srcElement.id : key;
        type = type === undefined ? 'click' : type;
        const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
        const fn = this.hostComponentData[fnName];
        if (fn && (typeof fn === 'function')) {
          this.hostComponentData[fnName](oEvent);
        }
      }
    }
    const form = this.hostComponentData[FccGlobalConstant.FORM];
    this.addAmendLabelIcon(control, form.controls);
  }

  // Raised on dropdown value change
  onMatSelectEventRaised(event, key, control) {
    const oEvent = event;

    if (event.type === undefined) {
      event = event.source;
    }
    let type = event.type;
    const name = type !== undefined ? event.srcElement.id : key;
    type = type === undefined ? 'click' : type;

    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
    }
    const form = this.hostComponentData[FccGlobalConstant.FORM];
    this.addAmendLabelIcon(control, form.controls);
  }

  // Raised on radio value change
  onMatRadioEventRaised(event, key, control) {
    const oEvent = event;
    const form = this.hostComponentData[FccGlobalConstant.FORM];
    form.get(key).setValue(oEvent.value);
    if (event.type === undefined) {
      event = event.source;
    }
    let type = event.type;
    const name = type !== undefined ? event.srcElement.id : key;
    type = type === undefined ? 'click' : type;

    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
     if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
     }
     this.addAmendLabelIcon(control, form.controls);
  }

  getValidStatus(product){
    const fnName = 'getValidStatus';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      return this.hostComponentData[fnName](product);
    }

  }

  // Raised on checkbox value change
  onMatCheckEventRaised(event, key, control) {
    const oEvent = event;

    if (event.type === undefined) {
      event = event.source;
    }
    let type = event.type;
    const name = type !== undefined ? event.srcElement.id : key;
    type = type === undefined ? 'click' : type;

    const form = this.hostComponentData[FccGlobalConstant.FORM];
    form.get(key).setValue(oEvent.checked ? 'Y' : 'N');

    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
    }
    if (control.params.showCheckBoxIcon !== false) {
    this.addAmendLabelIcon(control, form.controls);
    }
  }

  onClickDownload(event, key, index) {
    const oEvent = event;
    const fnName = 'onClickDownloadIcon';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, key, index);
    }
  }

  onClickTrash(event, key, index, field = '') {
    const oEvent = event;
    let fnName = '';
    if (key === 'license'){
      fnName = 'onClickTrash';
    } else if (field === 'enrichmentListTable') {
      fnName = 'onClickDeleteEnrichment';
    } else {
      fnName = 'onClickTrashIcon';
    }
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, key, index);
    }
  }

  onClickDelete(event, key, index, purchaseOrder){
    const oEvent = event;
    const fnName = 'onClickDelete';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, key, index, purchaseOrder);
    }
  }

  onClickAdd(event, purchaseOrder){
    const oEvent = event;
    const fnName = 'onClickAdd';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, purchaseOrder);
    }
  }

  onClickAddMore(event, purchaseOrder){
    const oEvent = event;
    const fnName = 'onClickAddMore';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, purchaseOrder);
    }
  }

  onClickSavePurchaseOrderButton(event, purchaseOrder){
    const oEvent = event;
    const fnName = 'onClickSavePurchaseOrderButton';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, purchaseOrder);
    }
  }

  onClickSaveAddNewPurchaseOrderButton(event, purchaseOrder){
    const oEvent = event;
    const fnName = 'onClickSaveAddNewPurchaseOrderButton';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, purchaseOrder);
    }
  }

  onClickCancelPurchaseOrderButton(event, purchaseOrder){
    const oEvent = event;
    const fnName = 'onClickCancelPurchaseOrderButton';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, purchaseOrder);
    }
  }

  onClickDeleteSelectedRecord(event, purchaseOrder){
    const oEvent = event;
    const fnName = 'onClickDeleteSelectedRecord';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, purchaseOrder);
    }
  }

  onClickDeleteSelectedLineItem(event, purchaseOrder){
    const oEvent = event;
    const fnName = 'onClickDeleteSelectedLineItem';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, purchaseOrder);
    }
  }



  onClickDeletePurchaseOrder(event, purchaseOrder){
    const oEvent = event;
    const fnName = 'onClickDeletePurchaseOrder';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, purchaseOrder);
    }
  }

  onClickPencil(event, res, index, rowData) {
    const oEvent = event;
    const fnName = res.key !== 'enrichmentListTable' ? 'onClickPencilIcon' : 'onClickEditEnrichment';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, res, index, rowData);
    }
  }

  setToDefault(event, index) {
    const oEvent = event;
    const fnName = 'onSetDefaultAccount';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](event, index);
    }
  }

  onClickEdit(type, name, rowData) {

    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](rowData);
    }
  }

  onClickDiscard(type, name, rowIndex) {
    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](rowIndex);
    }
  }

  navigateAway(event, sectionName, fieldName, clubbedFieldName) {
    const oEvent = event;
    const fnName = 'navigateAway';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, sectionName, fieldName, clubbedFieldName);
    }
  }

  nestedHeaderIconClick(event, controlName, rowData) {
    const oEvent = event;
    const fnName = 'nestedHeaderIconClick';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, controlName, rowData);
    }
  }

  fieldIconClick(event, sectionName, params?: {}) {
    const oEvent = event;
    const fnName = 'fieldIconClick';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, sectionName, params);
    }
  }

  onuploadHandler(event, key) {
    const oEvent = event;
    const fnName = 'onUploadHandler';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
    }
  }

  onTableRowSelect(event, key) {
    const oEvent = event;
    const fnName = 'onPanelTableRowSelect';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
    }
  }

  onTableRowUnSelect(event, key) {
    const oEvent = event;
    const fnName = 'onPanelTableRowUnSelect';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
    }
  }

  onFormTableRowSelect(event, key) {
    const oEvent = event;
    const fnName = 'onFormTableRowSelect';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, key);
    }
  }

  onFormTableRowUnSelect(event, key) {
    const oEvent = event;
    const fnName = 'onFormTableRowUnSelect';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, key);
    }
  }

  onFormTableHeaderCheckboxToggle(event, key) {
    const oEvent = event;
    const fnName = 'onFormTableHeaderCheckboxToggle';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, key);
    }
  }

  onAutoUploadHandler(event, fileUpload) {
    const oEvent = event;
    const fnName = 'onAutoUploadHandler';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, fileUpload);
    }
  }

  onClearHandler(event) {
    const oEvent = event;
    const fnName = 'onClearHandler';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
    }
  }

  getParams(control: any) {
    return JSON.stringify(control.params);
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

  getFilter(enabled) {
    if (enabled == null || enabled === '') {
      return true;
    } else {
      return enabled;
    }
  }

  getRegex(regex) {
    if (regex != null && regex !== '') {
      return RegExp(regex);
    }
  }

  getSectionFormData(typeName) {

  }

  // getFormData(form) {
  //   const jsonData = {};

  //   const controls: FCCFormControl[] = form.productControls;
  //   controls.forEach((control) => {
  //     if (!(control instanceof FCCLayoutControl)) {
  //       jsonData[control.key] = control.value;
  //     }
  //   });
  //   return jsonData;
  // }

  // getPageData(sections) {
  //   const jsonData = {};
  //   sections.forEach(section => {
  //     if (!(section instanceof FCCLayoutControl)) {
  //       jsonData[section.type] = this.getFormData(section.componentRef.instance.form);
  //     }
  //   });
  //   return jsonData;
  // }
  toggleControl(form, id, flag) {
    form.controls[id].params.rendered = flag;
  }

  toggleControls(form, ids: string[], flag) {
    ids.forEach(id => this.toggleControl(form, id, flag));
  }

  togglePreviewScreen(form, ids: string[], flag) {
    ids.forEach(id => form.controls[id].params.previewScreen = flag);
  }
  rafAsync() {
    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    });
  }
  checkElement(id) {
    const ele = document.getElementById(id);
    if (ele === null) {
      return this.rafAsync().then(() => this.checkElement(id));
    } else {
      return Promise.resolve(ele);
    }
  }

  focus(id) {
    this.checkElement(id).then((element) => {
      element.focus();
    });
  }

  patchFieldParameters(control: any, params: {}) {
    if (control == null || control === undefined) {
      return;
    }
    control.params = Object.assign(control.params, params);
    Object.keys(params).forEach(element => {
      if ('updateOptions' in control  && element === 'options') {
        control.updateOptions();
      }
    });
  }

  patchFieldValueAndParameters(control: any, value: any, params: {}) {
    control.patchValue(value);
    control.updateValueAndValidity();
    this.patchFieldParameters(control, params);
  }

  setMandatoryField(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { required: flag });
  }
  setMandatoryFields(form, ids: string[], flag) {
    ids.forEach(id => this.setMandatoryField(form, id, flag));
  }

  viewModeChange(form, feild) {
    if (feild.indexOf('spacer') === -1) {
      form.get(feild)[FccGlobalConstant.PARAMS].layout_Class = 'p-col-6';
    }
  }

  removeValidators(sectionForm, fieldNames: string[]) {
    fieldNames.forEach(fieldName => {
      if (sectionForm.get(fieldName)) {
        sectionForm.get(fieldName).clearValidators();
        sectionForm.get(fieldName).updateValueAndValidity();
      }
    });
  }

  addRequiredValidator(sectionForm, fieldNames: string[]) {
    fieldNames.forEach(fieldName => {
      sectionForm.get(fieldName).setValidators(Validators.required);
      sectionForm.get(fieldName).updateValueAndValidity();
    });
  }

  resetValue(sectionForm, fieldName, value) {
    if (sectionForm.get(fieldName)) {
      sectionForm.get(fieldName).setValue(value);
      sectionForm.get(fieldName).updateValueAndValidity();
    }
  }

  resetValues(sectionForm, fieldNames: string[]) {
    fieldNames.forEach(fieldName => {
      this.resetValue(sectionForm, fieldName, null);
    });
  }

  resetDefaultValues(sectionForm, fieldNames: string[]) {
    fieldNames.forEach(fieldName => {
      if (sectionForm.get(fieldName)[FccGlobalConstant.PARAMS][FccGlobalConstant.DEFAULT_VALUE]) {
        this.resetValue(sectionForm, fieldName, sectionForm.get(fieldName)[FccGlobalConstant.PARAMS][FccGlobalConstant.DEFAULT_VALUE]);
      } else {
        this.resetValue(sectionForm, fieldName, null);
      }
    });
  }

  setAmendedField(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { infoIcon: flag });
  }
  setAmendedFields(form, ids: string[], flag) {
    ids.forEach(id => this.setAmendedField(form, id, flag));
  }

  checkMatPhraseIconClick(event, key) {
    if (event.keyCode === FccGlobalConstant.LENGTH_13) {
      this.onClickMatPhraseIcon(event, key);
    }
  }

  onClickMatPhraseIcon(event, key) {
    const oEvent = event;
    const fnName = 'onClickPhraseIcon';
    if (this.hostComponentData[fnName] && (typeof this.hostComponentData[fnName] === 'function')) {
      this.hostComponentData[fnName](oEvent, key);
    }
  }

  onkeyUpTextField(event, key, product) {
    const oEvent = event;
    const fnName = 'onkeyUpTextField';
    if (this.hostComponentData[fnName] && (typeof this.hostComponentData[fnName] === 'function')) {
      this.hostComponentData[fnName](oEvent, key , product);
    }
  }

  onClickSaveRow(event, key, product,purchaseOrder) {
    const oEvent = event;
    const fnName = 'onClickSaveRow';
    if (this.hostComponentData[fnName] && (typeof this.hostComponentData[fnName] === 'function')) {
      this.hostComponentData[fnName](oEvent, key , product,purchaseOrder);
    }
  }

  onClickCancelRow(event, key, product) {
    const oEvent = event;
    const fnName = 'onClickCancelRow';
    if (this.hostComponentData[fnName] && (typeof this.hostComponentData[fnName] === 'function')) {
      this.hostComponentData[fnName](oEvent, key , product);
    }
  }


  onBlurDateField(event: any, key: any, editTableRow: any) {
    const oEvent = event;
    const fnName = 'onBlurDateField';
    if (this.hostComponentData[fnName] && (typeof this.hostComponentData[fnName] === 'function')) {
      this.hostComponentData[fnName](oEvent, key , editTableRow);
    }
  }

  onChangeDropdownField(event: any, key: any, editTableRow: any) {
    const oEvent = event;
    const fnName = 'onChangeDropdownField';
    if (this.hostComponentData[fnName] && (typeof this.hostComponentData[fnName] === 'function')) {
      this.hostComponentData[fnName](oEvent, key , editTableRow);
    }
  }

  onFocusDropdownField(event: any, key: any, editTableRow: any) {
    const oEvent = event;
    const fnName = 'onFocusDropdownField';
    if (this[fnName] && (typeof this[fnName] === 'function')) {
      this[fnName](oEvent, key , editTableRow);
    }
  }

  onFormAccordionSelection(index: number) {
    this.step = index;
    const fnName = 'onFormAccordionSectionChange';
    const fn = this[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName]();
    }
  }

  onFormAccordionOpen(index: number, name: string) {
    this.step = index;
    const fnName = `onPanelOpen${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName]();
    }
  }

  onFormAccordionClose(index: number, name: string) {
    this.step = index;
    const fnName = `onPanelClose${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName]();
    }
  }

  toggelFormAccordionPanel(form: FCCFormGroup, formAccordionPanels: any[], controls: string[], rendered: boolean) {
    for (let i = 0; i < formAccordionPanels.length ; i++) {
      const accordion = formAccordionPanels[i];
      const controlName = accordion.controlName;
      if (controls.indexOf(controlName) > -1) {
        accordion.rendered = rendered;
        const subsectionForm = form.controls[controlName] as FCCFormGroup;
        subsectionForm[FccGlobalConstant.RENDERED] = rendered;
        form.controls[controlName] = subsectionForm;
        form.updateValueAndValidity();
      }
    }
  }

  fieldHasValue(field: AbstractControl): boolean {
    if (field.value === '' || field.value === null || field.value === undefined) {
      return false;
    } else {
      return true;
    }
  }

  onClickCardDetails(event, key) {
    const oEvent = event;
    if (event.type === undefined) {
      event = event.originalEvent;
    }
    const type = event.type;
    let name = event.srcElement.id;
    if (name === undefined || name === '') {
      name = key;
    }
    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
    }
  }


  onClickRemoveMatCard(event, key) {
    const oEvent = event;
    if (event.type === undefined) {
      event = event.originalEvent;
    }
    const type = event.keyCode === FccGlobalConstant.LENGTH_13 ? 'click' : event.type;
    let name;
    if (name === undefined || name === '') {
      name = key;
    }
    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}Remove${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
    }
  }

  onClickMatCard(event, key,product) {
    const oEvent = event;
    const fnName = 'onClickMatCard';
    if (this.hostComponentData[fnName] && (typeof this.hostComponentData[fnName] === 'function')) {
      this.hostComponentData[fnName](oEvent, key , product);
    }
  }
  onClickViewSpecimenHyperLink(event, key) {
    const oEvent = event;
    if (event.type === undefined) {
      event = event.originalEvent;
    }
    const type = event.type;
    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${key.substr(0, 1).toUpperCase()}${key.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
    }
  }

  onClickBulkReference(event, key, childRefId) {
    const oEvent = event;

    if (event.type === undefined) {
      event = event.originalEvent;
    }
    const type = event.type;
    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${key.substr(0, 1).toUpperCase()}${key.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, childRefId);
    }
  }

  onClickChildRefDetails(event, key, childRefId) {
    const oEvent = event;

    if (event.type === undefined) {
      event = event.originalEvent;
    }
    const type = event.type;
    let name = event.currentTarget.id;
    if (name === undefined || name === '') {
      name = key;
    }
    const fnName = `on${type.substr(0, 1).toUpperCase()}${type.substr(1)}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, childRefId);
    }
  }

toggleFormFields(showField, form, fieldsToToggle) {
    if (showField) {
      fieldsToToggle.forEach(ele => {
        form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      });
    } else {
      fieldsToToggle.forEach(ele => {
        form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      });
    }
  }

  toggleRequired(setRequired, form, fieldsToToggle) {
    if (setRequired) {
      fieldsToToggle.forEach(ele => {
        form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      });
    } else {
      fieldsToToggle.forEach(ele => {
        form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      });
    }
  }

  updateFccBaseComponent( hostComponentData: any, mode: string) {
    this.mode = mode;
    this.hostComponentData = hostComponentData;
  }

/**
 * @param pickerInput - Input from date picker field
 * @returns - Whether the input typed date is valid or not
 */
  isValidDate(pickerInput: any) {
    return moment(pickerInput, this.hostComponentData.utilityService.getDateFormat(), true).isValid();
  }

  onOpenClosedMatDateCalender(ref, key){
    if (ref.opened || ref.closed) {
      const fnName = `onOpen${key.substr(0, 1).toUpperCase()}${key.substr(1)}`;
      const fn = this.hostComponentData[fnName];
      if (fn && (typeof fn === 'function')) {
        this.hostComponentData[fnName]();
      }
    }
  }

  onClickEye(event, key, index, rowData) {
    const oEvent = event;
    const fnName = 'onClickEyeIcon';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, key, index, rowData);
    }
  }
  onKeyUpInnerTextFields(event,product){
    const oEvent = event;
    const fnName = 'onKeyUpInnerTextFields';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent, product);
    }

  }
  purchaseOrderDateChange(event){
    const oEvent = event;
    const fnName = 'purchaseOrderDateChange';
    const fn = this.hostComponentData[fnName];
    if (fn && (typeof fn === 'function')) {
      this.hostComponentData[fnName](oEvent);
    }

  }

}
