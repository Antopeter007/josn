import { FccGlobalParameterFactoryService } from '../core/fcc-global-parameter-factory-service';
import { Injectable } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { CommonService } from './common.service';
import { ButtonControl, InputDateControl, InputTextControl, MultiSelectFormControl, SpacerControl } from './../../base/model/form-controls.model';
import { UtilityService } from './../../corporate/trade/lc/initiation/services/utility.service';
import { LocaleService } from './../../base/services/locale.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  config: any[] = [];
  numberOfDisplayableParameters: any = 0;
  eventsFilterParamsCount = 1;
  language = localStorage.getItem('language');
  constructor(protected paramService: FccGlobalParameterFactoryService,
              protected translate: TranslateService, protected commonService: CommonService,
              protected utilityService: UtilityService, protected localeService: LocaleService,) {}

  getFields(inputJson: any, productCode: string) {
    this.config = [];
    if (inputJson) {
    this.prepareFormJson(inputJson, productCode);
    }
    return this.config;
  }

  getNoOfDisplayableParams() {
    return this.numberOfDisplayableParameters;
  }
  getOptions(options: any) {
    options = options.substring(1, options.length - 1);
    const arrayOfKeyValues = options.split(',');
    const obj = [];
    for (let i = 0; i < arrayOfKeyValues.length; i++) {
        const arrayValues = arrayOfKeyValues[i].split(':');
        if (arrayValues[FccGlobalConstant.LENGTH_1] === FccGlobalConstant.DEFAULT_TIMEFRAME) {
          obj.push({
            label : this.translate.instant('repricingFrequency_'+(arrayValues[FccGlobalConstant.LENGTH_2].trim())),
            value : (arrayValues[FccGlobalConstant.LENGTH_1]),
            displayedValue: this.translate.instant('repricingFrequency_'+(arrayValues[FccGlobalConstant.LENGTH_2].trim()))
          });
        } else {
          if(arrayValues[FccGlobalConstant.LENGTH_0] && arrayValues[FccGlobalConstant.LENGTH_1]) {
        obj.push({
          label : this.translate.instant('repricingFrequency_'+(arrayValues[FccGlobalConstant.LENGTH_0].trim()) +
                                                                      (arrayValues[FccGlobalConstant.LENGTH_1].trim())),
          value : (arrayValues[FccGlobalConstant.LENGTH_0]) + (arrayValues[FccGlobalConstant.LENGTH_1]),
          displayedValue: this.translate.instant('repricingFrequency_'+(arrayValues[FccGlobalConstant.LENGTH_0].trim()) +
                                                                              (arrayValues[FccGlobalConstant.LENGTH_1].trim()))
            });
          }
      }
    }
    return obj;
  }

  prepareFormJson(inputJson: any, pdtCode: string) {
    if ( null !== inputJson && inputJson !== undefined ) {
      inputJson.Search.forEach(element => {
        if (!element.hidden) {
          if (element.type === '' && !element.isCodeField) {
            this.config.push({
              name : element.name,
              type: this.paramService.getParameterType(element.type),
              localizationkey: (element.localizationkey !== null) ? this.translate.instant(element.localizationkey) : '',
              readonly: element.readonly,
              value: element.value,
              validation: [Validators.maxLength(element.maxLength)],
              maxlength: element.maxLength || '',
              size: element?.size
            });
            this.numberOfDisplayableParameters++;
          } else if (element.type === 'export') {
            this.config.push({
              name : element.name,
              type: element.type,
              fileName: element.fileName
            });
          } else if (element.type === 'RetentionPeriod') {
            this.config.push({
              name : element.name,
              type: 'number',
              localizationkey: (element.localizationkey !== null) ? this.translate.instant(element.localizationkey) : '',
              readonly: element.readonly,
              maxLength: element.maxLength,
              minValue: "0",
              maxValue: "9999",
              validation: [ Validators.pattern(/^\d{4}$/)],
            });
            this.numberOfDisplayableParameters++;
          } else if (element.type === 'AvailableTimeFrames') {
            const optionValues = this.getOptions(element.allowedDependentValuesString);
            if(optionValues && optionValues.length > 0) {
            this.config.push({
              name : 'timeframe',
              type : FccGlobalConstant.selectButton,
              options : optionValues,
              selected : optionValues[0].value,
            });
          }
          } else {
            this.config.push({
              name : element.name,
              type: this.paramService.getParameterType(element.type, element.isCodeField),
              localizationkey: this.translate.instant(element.localizationkey),
              readonly: element.readonly,
              options: this.prepareDropDownValues(element),
              layoutClass : element.layoutClass,
              styleClass: element.styleClass,
              rendered: element.rendered,
              defautValue: element.defaultRadioValue,
              key: element.name,
              productCode: pdtCode
            });
            this.numberOfDisplayableParameters++;
          }
      }
    });
  }
}

  prepareDropDownValues(element) {
    const dropdownValues: any[] = [];
    if (element.allowedValuesString) {
        const values = element.allowedValuesString.substring(1, element.allowedValuesString.length - 1).split(',');
        let labelValue = values;
        if (element.allowedValuesLabelsString) {
        labelValue = element.allowedValuesLabelsString.substring(1, element.allowedValuesLabelsString.length - 1).split(',');
        }
        let i = 0;
        for (const itemValue of values) {
          dropdownValues.push({
            label: labelValue[i].trim(),
            value: itemValue.trim()
          });
          i++;
        }
      }
    return dropdownValues;
  }

  prepareColumns(metadata) {
    const columns: any[] = [];
    metadata.Column.forEach(element => {
        if (!element.hidden) {
          columns.push(element.name);
        }
    });
    return columns;
  }

  transformFilterParams(inputParamsList, formValuesBinding, filterDataParam, refId) {
    this.eventsFilterParamsCount = 1;
    let bindingValues;
    if (filterDataParam) {
      bindingValues = filterDataParam;
    } else {
      if (inputParamsList && (inputParamsList.length > 1 || this.commonService.multipleablesInaPage)) {
        bindingValues = this.commonService.bindingValue;
      } else {
        bindingValues = formValuesBinding ? formValuesBinding : undefined;
      }
    }
    const bindingFormValues = {} as JSON;
    const params = 'params';
    const tnxTypeCodeParam = 'tnx_type_code_parameter';
    const subTnxTypeCodeParam = 'sub_tnx_type_code_parameter';
    bindingFormValues[FccGlobalConstant.CHANNELREF] = refId;
    if (bindingValues && bindingValues.value) {
      const fields = Object.keys(bindingValues.value);
      fields.forEach(element => {
        const controlElement = bindingValues.controls[element];
        let stringValue = '';
        let tnxTypeCode = '';
        let subTnxTypeCode = '';
        let keyName = bindingValues.controls[element][params].srcElementId;
        //let keyName = bindingValues.controls[element].key;
        // This is added to remove "events_" from the key name.
        if (this.commonService.isnonEMptyString(keyName)) {
          const index = keyName.indexOf("_");
          keyName = keyName.substring(index+1);
        }
        if (controlElement instanceof MultiSelectFormControl && controlElement.value instanceof Array) {
            controlElement.value .forEach(value => {
              const trimmedValue: string = value;
              stringValue = stringValue + trimmedValue.trim() + '|';

              if (keyName === 'tnx_type_code_dropdown') {
                const tnxTypeCodeArray = trimmedValue.split(':');
                tnxTypeCode = tnxTypeCode + tnxTypeCodeArray[0].trim() + '|';
                if (tnxTypeCodeArray.length === 2) {
                  subTnxTypeCode = subTnxTypeCode + tnxTypeCodeArray[1] + '|';
                }
              }
            });

            stringValue = stringValue.substring(0, stringValue.length - 1);
            if (this.commonService.isnonEMptyString(stringValue)) {
              bindingFormValues[keyName] = stringValue;
              this.eventsFilterParamsCount++;
            }

            if (keyName === 'tnx_type_code_dropdown') {
              tnxTypeCode = tnxTypeCode.substring(0, tnxTypeCode.length - 1);
              subTnxTypeCode = subTnxTypeCode.substring(0, subTnxTypeCode.length - 1);
              bindingFormValues[tnxTypeCodeParam] = tnxTypeCode;
              bindingFormValues[subTnxTypeCodeParam] = subTnxTypeCode;
            }

        } else if (controlElement instanceof InputDateControl && controlElement.value instanceof Array) {
            for (let i = 1; i <= controlElement.value.length; i++) {
              if (i === 1) {
                bindingFormValues[keyName] = this.utilityService.transformDateFormat(controlElement.value[i - 1]);
              } else if (controlElement.value[i - 1] !== null && controlElement.value[i - 1] !== '' &&
                 controlElement.value[i - 1] !== undefined) {
                  bindingFormValues[keyName + i] = this.utilityService.transformDateFormat(controlElement.value[i - 1]);
                 }
            }
            this.eventsFilterParamsCount++;
        } else if (keyName === FccGlobalConstant.PARAMETER1 && controlElement.value === '') {
          bindingFormValues[keyName] = FccGlobalConstant.PRODUCT_DEFAULT;
        } else if (keyName === FccGlobalConstant.BO_RELEASE_DTTM && controlElement.value
          && controlElement.value !== '') {
          bindingFormValues[keyName] = controlElement.value.slice(0, 4);
          this.eventsFilterParamsCount++;
        }
        else if (!(controlElement instanceof SpacerControl) && !(controlElement instanceof ButtonControl)
          && this.commonService.isnonEMptyString(controlElement.value)
          && keyName !== undefined){
          bindingFormValues[keyName] = controlElement.value;
          this.eventsFilterParamsCount++;
        }
      });
      return JSON.stringify(bindingFormValues);
    } else if (bindingFormValues) {
      return JSON.stringify(bindingFormValues);
    } else {
      return '';
    }
  }

  underscoreToCamelcase(name: string) {
    return name.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }

  getControlForFilterSection(element: any) {
      let control: AbstractControl;
      switch (element.type) {
      case 'input-multiselect':
        control = new MultiSelectFormControl(this.underscoreToCamelcase(element.name), element.value, this.translate, {
          placeholder: `${this.translate.instant(element.localizationkey)}`,
          options: element.options,
          layoutClass: 'p-col-12',
          styleClass: 'triggerIcon',
          rendered: true,
          maxSelectLabels: 1,
          srcElementId: element.name,
          productCode: element.productCode
        });
        break;
      case 'input-text' :
        control = new InputTextControl(this.underscoreToCamelcase(element.name), element.value, this.translate, {
          label: `${this.translate.instant(element.localizationkey)}`,
          styleClass: ['textFieldStyle'],
          layoutClass: element.layoutClass,
          rendered: true,
          srcElementId: element.name,
          type: element.type ? element.type : 'text',
          minValue: element.minValue ? element.minValue : null,
          maxValue: element.maxValue ? element.maxValue : null
        });
      break;
      case 'input-date' :
        control = new InputDateControl(this.underscoreToCamelcase(element.name), element.value, this.translate, {
          label: `${this.translate.instant(element.localizationkey)}`,
          layoutClass: 'p-col-12 p-lg-12 p-md-12 p-sm-12 calendarStyle', styleClass: ['dateStyle'],
          srcElementId: element.name,
          selectionMode: 'range',
          rendered: true,
          appendTo: element.appendTo,
          langLocale: this.localeService.getCalendarLocaleJson(this.language),
          dateFormat: this.utilityService.getDateFormatForRangeSelectionCalendar()
        });
        break;
    }
    return control;
  }

  populateMultiSelectOptions(key: string) {
    if (key.indexOf('_') > -1) {
      key = this.underscoreToCamelcase(key);
    }
    const functionSuffixName = `${key.substr(0, 1).toUpperCase()}${key.substr(1)}`;
    const fnName = `onClick${functionSuffixName}`;
    if (this[fnName] && (typeof this[fnName] === 'function')) {
      this[fnName]();
    }
  }
}

