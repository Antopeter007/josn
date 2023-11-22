import { Injectable } from '@angular/core';
import { FCCFormGroup } from '../../base/model/fcc-control.model';

@Injectable({
  providedIn: 'root'
})
export class DropDownAPIService {

  constructor() {
    //eslint : no-empty-function
   }
  private readonly SHORT_NAME = 'shortName';
  private readonly VALUE = 'value';
  private readonly LABEL = 'label';

  getValueObj(value: any, options: any): any {
    let valueObj = {};
    if (value instanceof Object) {
      value = value[this.SHORT_NAME] ? value[this.SHORT_NAME] : value[this.VALUE] ? value[this.VALUE] : value[this.LABEL];
    }
    Object.keys(options).forEach(key => {
      if (this.matchValue(value, options[key], false)) {
        valueObj = options[key];
      }
    });
    return valueObj;
  }

  private matchValue(value: string, elements: any, flag = false): boolean {
    if (elements && Object.getPrototypeOf(elements) === Object.getPrototypeOf({})) {
      Object.keys(elements).forEach(element => {
        if (elements[element] && Object.getPrototypeOf(elements[element]) === Object.getPrototypeOf({})) {
          flag = this.matchValue(value, elements[element], flag);
        } else {
          if (elements[element] && value?.toString().trim().toLowerCase() === elements[element].toString().trim().toLowerCase()) {
            flag = true;
          }
        }
      });
    }
    return flag;
  }

  getInputDropdownValue(options: any[], fieldName: string, form: FCCFormGroup,
     isDefaultFirst = true): string {
    if (!options || options.length === 0) {
      return '';
    }
    let val = form.get(fieldName).value ?
      form.get(fieldName).value : isDefaultFirst ? options[0].value : '';
    let flag = false;
    options.forEach(e => {
      if (e.value === val) {
        flag = true;
      }
    });
    if (!flag && isDefaultFirst) {
      val = options[0].value;
    }

    // if (!flag && !isDefaultFirst && setEmptyIfNoDefaultVal)
    // {
    //   val = '';
    // }
    return val;
  }

  getDropDownFilterValueObj(options: any[], fieldName: string, form: FCCFormGroup): any {
    let valObj;
    if (form.get(fieldName) && form.get(fieldName).value && options.length) {
      valObj = this.getValueObj(form.get(fieldName).value, options);
    }
    return valObj;
  }
}
