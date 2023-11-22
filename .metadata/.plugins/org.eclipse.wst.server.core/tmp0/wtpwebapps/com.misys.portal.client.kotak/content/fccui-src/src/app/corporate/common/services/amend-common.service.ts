import { FCCFormControl, FCCFormGroup } from './../../../base/model/fcc-control.model';
import { Injectable } from '@angular/core';
import { FccGlobalConstant } from '../../../common/core/fcc-global-constants';
import { CommonService } from '../../../common/services/common.service';
import { TabPanelService } from '../../../common/services/tab-panel.service';
import { ProductStateService } from '../../trade/lc/common/services/product-state.service';
import { TranslateService } from '@ngx-translate/core';
import { FormAccordionPanelService } from '../../../common/services/form-accordion-panel.service';

@Injectable({
  providedIn: 'root'
})
export class AmendCommonService {

  constructor(protected commonServices: CommonService,
              protected tabPanelService: TabPanelService,
              protected stateService: ProductStateService,
              protected formAccordionPanelService: FormAccordionPanelService,
              protected translateService: TranslateService) { }

  setValueFromMasterToPrevious(sectionName?: any, productCode?: any) {
    if (this.commonServices.checkPendingClientBankViewForAmendTnx()) {
      if (sectionName) {
        this.updateFieldControlPreviousValue(sectionName, productCode);
      } else {
        this.stateService.getSectionNames(true).forEach(section => {
          this.updateFieldControlPreviousValue(section, productCode);
        });
      }
    }
  }

  protected updateFieldControlPreviousValue(sectionName: any, productCode: any) {
    const masterSectionForm = this.stateService.getSectionData(sectionName, productCode, true);
    this.tabPanelService.initializeMaps(sectionName, this.stateService.getSectionData(sectionName, undefined, true));
    const tabSectionMasterControlMap = this.tabPanelService.getTabSectionControlMap();
    const tabSectionMasterControlMap1 = tabSectionMasterControlMap.get(sectionName);
    this.tabPanelService.initializeMaps(sectionName, this.stateService.getSectionData(sectionName, undefined, false));
    const tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
    const accordionSubSectionsListMap = this.formAccordionPanelService.getAccordionSubSectionListMap();
    if (accordionSubSectionsListMap.has(sectionName)) {
      const sectionData = this.stateService.getSectionData(sectionName, productCode, false);
      if (accordionSubSectionsListMap.has(sectionName))
      {
      const accordionSubSectionsList = accordionSubSectionsListMap.get(sectionName);
      accordionSubSectionsList.forEach(subSection => {
        const subSectionForm = sectionData.controls[subSection] as FCCFormGroup;
        Object.keys(subSectionForm.controls).forEach(field => {
      const masterFieldControl = this.stateService.getSubControl(sectionName, subSection, field, true);
      const transactionFieldControl = this.stateService.getSubControl(sectionName, subSection, field, false);
      const value = this.stateService.getSubControlValue(sectionName, subSection, field, true);
      let comparisonValue = this.stateService.getNonLocalizedTabValue(masterFieldControl, true);
      if (comparisonValue === undefined || comparisonValue === null || comparisonValue === '') {
        comparisonValue = '';
        transactionFieldControl.params = Object.assign(transactionFieldControl.params, { previousValue: value,
          previousCompareValue: comparisonValue, isEmptyField: true });
        transactionFieldControl.updateValueAndValidity();
      } else if (value && transactionFieldControl && this.commonServices.isnonEMptyString(comparisonValue) &&
        (!transactionFieldControl.params[FccGlobalConstant.NOT_AMENDED] ||
          transactionFieldControl.params[FccGlobalConstant.NOT_AMENDED] === undefined)) {
            transactionFieldControl.params = Object.assign(transactionFieldControl.params,
           { previousValue: value, previousCompareValue: comparisonValue });
            transactionFieldControl.updateValueAndValidity();
      }
      });
    });
  }
    } else if (tabSectionControlMap.has(sectionName)) {
      for (const [fieldName, control] of tabSectionControlMap.get(sectionName)) {
          let masterControl;
        if (tabSectionMasterControlMap1)
        {
           masterControl = tabSectionMasterControlMap1.get(fieldName);
        }
        let value = this.stateService.getTabValue(masterControl);
        if (control.value && value === '') {
          if (masterControl?.type === FccGlobalConstant.VIEW_MODE_TYPE) {
            value = control.value;
          } else if (masterControl?.type === FccGlobalConstant.VIEW_MODE_SELECT) {
            value = control.value[0].label;
          }
        }
        let comparisonValue;
        if (control.params[FccGlobalConstant.IS_BANK_COUNTERPARTY_TAB]) {
           comparisonValue = this.stateService.getBankNonLocalizedTabValue(sectionName, fieldName, true);
         } else {
           if (masterControl)
           {
            comparisonValue = this.stateService.getNonLocalizedTabValue(masterControl, true);
           }
         }
        if (comparisonValue === undefined || comparisonValue === null || comparisonValue === '') {
          comparisonValue = '';
          control.params = Object.assign(control.params, { previousValue: value, previousCompareValue: comparisonValue,
            isEmptyField: true });
          control.updateValueAndValidity();
        }
        if (value && (!control.params[FccGlobalConstant.NOT_AMENDED] || control.params[FccGlobalConstant.NOT_AMENDED] === undefined)) {
          control.params = Object.assign(control.params, { previousValue: value, previousCompareValue: comparisonValue });
          control.updateValueAndValidity();
        }
    }
    } else if (masterSectionForm) {
        Object.keys(masterSectionForm.controls).forEach(field => {
          const fieldControl = this.stateService.getControl(sectionName, field, false);
          let value;
          if (fieldControl !== undefined && (fieldControl.type === 'checkbox' || fieldControl.type === FccGlobalConstant.inputSwitch)) {
              if (fieldControl.value && fieldControl.value !== null && fieldControl.value !== undefined && fieldControl.value !== '')
              {
                const val = this.stateService.getValue(sectionName, field, true);
                value = (val.toLowerCase() === 'y' || val.toLowerCase() === 'yes') ? `${this.translateService.instant('yes')}`
                : `${this.translateService.instant('no')}`;
              }
              else {
                value = `${this.translateService.instant('no')}`;
              }
            } else if (fieldControl !== undefined && fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.TRANSLATE] &&
            this.commonServices.isNonEmptyValue(fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.TRANSLATE_VALUE])) {
              const translateVal = fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.TRANSLATE_VALUE];
              const val = this.stateService.getValue(sectionName, field, true);
              value = this.translateService.instant( translateVal + val);
          } else {
            value = this.stateService.getValue(sectionName, field, true);
          }
          let comparisonValue = this.stateService.getNonLocalizedValue(sectionName, field, true);
          if (fieldControl !== undefined) {
            if (comparisonValue === undefined || comparisonValue === null || comparisonValue === '') {
              fieldControl.params = Object.assign(fieldControl.params, { previousValue: value, previousCompareValue: comparisonValue,
                isEmptyField: true });
              fieldControl.updateValueAndValidity();
            } else if (fieldControl.type === 'checkbox' || fieldControl.type === FccGlobalConstant.inputSwitch) {
                const val = this.stateService.getNonLocalizedValue(sectionName, field, true);
                comparisonValue = (val.toLowerCase() === 'y' || val.toLowerCase() === 'yes') ? `${this.translateService.instant('yes')}`
                : `${this.translateService.instant('no')}`;
            }
            if (value || fieldControl.params[FccGlobalConstant.AMEND_DEFAULT_RESET]) {
              fieldControl.params = Object.assign(fieldControl.params, { previousValue: value, previousCompareValue: comparisonValue });
              fieldControl.updateValueAndValidity();
            }
          }
        });
      }
  }
  /**
   * Compares Master and Transaction Values returns true if there is any difference in control values
   */
  public compareMasterAndTransaction(masterControl: any, transactionControl: any, masterComparisonValue: any ,
                                     transactionForm: FCCFormGroup, masterUpdate = false): void {

    const isComplexField = this.isComplexField(transactionControl.value);
    if (isComplexField && this.commonServices.isNonEmptyValue(masterComparisonValue)) {
        this.compareComplexField(transactionControl, transactionControl.value, masterComparisonValue, transactionForm,
          masterControl, masterUpdate);
    } else if (!isComplexField) {
      const fields = Object.keys(transactionForm.controls);
      if (transactionControl.params.grouphead) {
        fields.forEach(fieldName => {
          const fieldObj = transactionForm.controls[fieldName];
          if (this.commonServices.isNonEmptyValue(fieldObj) && (typeof fieldObj === FccGlobalConstant.OBJECT ||
            typeof fieldObj === FccGlobalConstant.TEXT) && fieldObj[FccGlobalConstant.KEY] &&
            fieldObj[FccGlobalConstant.KEY] === transactionControl.params.grouphead) {
            this.groupAmendLabel(transactionControl, transactionControl.value, fieldObj, masterComparisonValue,
              transactionForm.controls, masterControl, masterUpdate);
          }
        });
      } else {
        if ( this.isValueSame(transactionControl.value, masterComparisonValue)
             && (transactionControl.params[FccGlobalConstant.AMEND_SPCIFIC_FIELD] !== true)) {
          this.assignAmendInfoLabel(transactionControl, masterControl, masterUpdate);
        } else {
          this.removeAmendInfoLabel(transactionControl, masterControl, masterUpdate);
        }
      }
      return ;
  }
}

compareMasterAndTransactionForTabSection(masterControl: any, transactionControl: any, masterComparisonValue: any,
                                         transactionForm: Map<string, FCCFormControl>, masterUpdate = false)
{
  const isComplexField = this.isComplexField(transactionControl.value);
  const fields = Array.from( transactionForm.keys() );
  if (isComplexField && this.commonServices.isNonEmptyValue(masterComparisonValue)) {
    this.compareComplexFieldForTabsection(transactionControl, transactionControl.value, masterComparisonValue, transactionForm,
      masterControl, masterUpdate);
}
else if (!isComplexField)
{
  if (transactionControl.params.grouphead) {
    fields.forEach(fieldName => {
      const fieldObj = transactionForm.get(fieldName);
      if (this.commonServices.isNonEmptyValue(fieldObj) && (typeof fieldObj === FccGlobalConstant.OBJECT ||
        typeof fieldObj === FccGlobalConstant.TEXT) && fieldObj[FccGlobalConstant.KEY] &&
        fieldObj[FccGlobalConstant.KEY] === transactionControl.params.grouphead) {
        this.groupAmendLabel(transactionControl, transactionControl.value, fieldObj, masterComparisonValue,
          transactionForm, masterControl, masterUpdate);
      }
    });
  }
  else
  {
    if ( this.isValueSame(transactionControl.value, masterComparisonValue)
  && (transactionControl.params[FccGlobalConstant.AMEND_SPCIFIC_FIELD] !== true)) {
      this.assignAmendInfoLabel(transactionControl, masterControl, masterUpdate);
  } else {
      this.removeAmendInfoLabel(transactionControl, masterControl, masterUpdate);
    }
  }
  return;
}
}

  /**
   * Checks if the control is of type object or Array
   */
  public isComplexField(transactionValue: any): boolean {
    return (transactionValue instanceof Array || transactionValue instanceof Object);
  }
     /**
      * Checks if the control is of type object or Array
      */
  compareComplexField(transactionControl: any, transactionValue: any, masterComparisonValue: any, transactionForm: FCCFormGroup,
                      masterControl?: any, masterUpdate = false) {
    if (transactionValue instanceof Array) {
      if (JSON.stringify(transactionValue) !== JSON.stringify(masterComparisonValue)) {
        let differArray = transactionValue.filter(x => masterComparisonValue.indexOf(x) === -1);
        if (transactionValue.length === 1) {
          differArray = transactionValue;
        }
        if (masterUpdate) {
          this.patchFieldParameters(masterControl, { infoIcon: true, infolabel: FccGlobalConstant.AMENDED, resultArray: differArray });
          masterControl.updateValueAndValidity();
        }
        this.patchFieldParameters(transactionControl, { infoIcon: true, infolabel: FccGlobalConstant.AMENDED, resultArray: differArray });
        transactionControl.updateValueAndValidity();
      } else {
        this.removeAmendInfoLabel(transactionControl, masterControl, masterUpdate);
      }

    } else if (transactionValue instanceof Object) {
      const transactionFields = Object.keys(transactionForm.controls);
      let transactionvalueshortName = transactionValue.shortName;
      if (transactionControl.type === FccGlobalConstant.inputDropdownFilter ||
          transactionControl.type === FccGlobalConstant.INPUT_AUTOCOMPLETE)
          {
            if (transactionControl.params[FccGlobalConstant.PREVIEW_VALUE_ATTR])
              {
                const previewValueAttr = transactionControl.params[FccGlobalConstant.PREVIEW_VALUE_ATTR];
                transactionvalueshortName = transactionControl.value[previewValueAttr];
              }
              else if (transactionValue.name)
              {
                transactionvalueshortName = transactionValue.name;
              }
          }
      if (transactionControl.params.grouphead) {
        transactionFields.forEach(fieldName => {
         const fieldObj = transactionForm.controls[fieldName];
         if (typeof fieldObj === FccGlobalConstant.OBJECT && fieldObj[FccGlobalConstant.KEY] &&
              fieldObj[FccGlobalConstant.KEY] === transactionControl.params.grouphead) {
            this.groupAmendLabel(transactionControl, transactionvalueshortName, fieldObj, masterComparisonValue,
              transactionForm.controls, masterControl, masterUpdate);
         }
      });
   } else {
    if (transactionControl.type === FccGlobalConstant.inputDate) {
      const actualDate = this.convert(transactionValue);
      if (actualDate === masterComparisonValue) {
        this.removeAmendInfoLabel(transactionControl, masterControl, masterUpdate);
      } else {
        this.assignAmendInfoLabel(transactionControl, masterControl, masterUpdate);
      }
    } else {
      if (this.isValueSame(transactionvalueshortName, masterComparisonValue)) {
        this.assignAmendInfoLabel(transactionControl, masterControl, masterUpdate);
      } else {
        this.removeAmendInfoLabel(transactionControl, masterControl, masterUpdate);
      }
     }
  }
 }
}

compareComplexFieldForTabsection(transactionControl: any, transactionValue: any, masterComparisonValue: any,
                                 transactionForm: Map<string, FCCFormControl>, masterControl?: any, masterUpdate = false)
  {
    if (transactionValue instanceof Array) {
      if (JSON.stringify(transactionValue) !== JSON.stringify(masterComparisonValue)) {
        let differArray = transactionValue.filter(x => masterComparisonValue.indexOf(x) === -1);
        if (transactionValue.length === 1) {
          differArray = transactionValue;
        }
        if (masterUpdate) {
          this.patchFieldParameters(masterControl, { infoIcon: true, infolabel: FccGlobalConstant.AMENDED, resultArray: differArray });
          masterControl.updateValueAndValidity();
        }
        this.patchFieldParameters(transactionControl, { infoIcon: true, infolabel: FccGlobalConstant.AMENDED, resultArray: differArray });
        transactionControl.updateValueAndValidity();
      } else {
        this.removeAmendInfoLabel(transactionControl, masterControl, masterUpdate);
      }

    } else if (transactionValue instanceof Object) {
      const transactionFields = Array.from( transactionForm.keys() );
      let transactionvalueshortName = transactionValue.shortName;
      if (transactionControl.type === FccGlobalConstant.inputDropdownFilter)
          {
            if (transactionControl.params[FccGlobalConstant.PREVIEW_VALUE_ATTR])
              {
                const previewValueAttr = transactionControl.params[FccGlobalConstant.PREVIEW_VALUE_ATTR];
                transactionvalueshortName = transactionControl.value[previewValueAttr];
              }
              else if (transactionValue.name)
              {
                transactionvalueshortName = transactionValue.name;
              }
          }
      if (transactionControl.params.grouphead) {
        transactionFields.forEach(fieldName => {
         const fieldObj = transactionForm.get(fieldName);
         if (typeof fieldObj === FccGlobalConstant.OBJECT && fieldObj[FccGlobalConstant.KEY] &&
              fieldObj[FccGlobalConstant.KEY] === transactionControl.params.grouphead) {
            this.groupAmendLabel(transactionControl, transactionvalueshortName, fieldObj, masterComparisonValue,
              transactionForm, masterControl, masterUpdate);
         }
      });
   } else {
    if (transactionControl.type === FccGlobalConstant.inputDate) {
      const actualDate = this.convert(transactionValue);
      if (actualDate === masterComparisonValue) {
        this.removeAmendInfoLabel(transactionControl, masterControl, masterUpdate);
      } else {
        this.assignAmendInfoLabel(transactionControl, masterControl, masterUpdate);
      }
    } else {
      if (this.isValueSame(transactionvalueshortName, masterComparisonValue)) {
        this.assignAmendInfoLabel(transactionControl, masterControl, masterUpdate);
      } else {
        this.removeAmendInfoLabel(transactionControl, masterControl, masterUpdate);
      }
     }
  }
 }
  }

/**
 * Label handling for grouping based elements
 */
groupAmendLabel(control: any, value: any, fieldObj: any, masterComparisonValue: any,
                transactionForm?: any, masterControl?: any, masterUpdate = false) {
  if (this.isValueSame(value, masterComparisonValue)) {
    this.patchFieldParameters(fieldObj, FccGlobalConstant.AMENDED_INFO_LABEL);
    if (masterUpdate) {
      this.patchFieldParameters(masterControl, FccGlobalConstant.GROUP_AMEDED_LABEL);
    }
    if (control.params.isBankSection)
    {
      this.patchFieldParameters(control, FccGlobalConstant.AMENDED_INFO_LABEL);
    }
    else
    {
      this.patchFieldParameters(control, FccGlobalConstant.GROUP_AMEDED_LABEL);
    }
  } else {
    let isAmended = false;
    if (fieldObj.params && fieldObj.params.groupChildren) {
      fieldObj.params.groupChildren.forEach(element => {
        if (transactionForm[element] && transactionForm[element].value instanceof Object) {
          if (transactionForm[element].params.previousCompareValue && (element === masterControl.key)
            && transactionForm[element].value.shortName !== masterComparisonValue) {
            isAmended = true;
          }
        } else {
          if (transactionForm[element] && masterComparisonValue && transactionForm[element].value !== null
            && (element === masterControl.key)
            && transactionForm[element].value !== masterComparisonValue) {
            isAmended = true;
          }
        }
      });
    }
    if (isAmended) {
      this.patchFieldParameters(fieldObj, FccGlobalConstant.AMENDED_INFO_LABEL);
      this.patchFieldParameters(control, FccGlobalConstant.NOAMEND_INFO_ICON);
      if (masterUpdate) {
        this.patchFieldParameters(masterControl, FccGlobalConstant.NOAMEND_INFO_ICON);
      }
    } else {
      if (masterUpdate) {
        this.noAmendIcon(control, fieldObj, masterControl);
      }
    }
  }
  if (masterUpdate) {
    masterControl.updateValueAndValidity();
  }
  fieldObj.updateValueAndValidity();
  control.updateValueAndValidity();
}

noAmendIcon(control, fieldObj, amendFieldControl) {
  this.patchFieldParameters(fieldObj, FccGlobalConstant.NOAMEND_INFO_ICON);
  this.patchFieldParameters(amendFieldControl, FccGlobalConstant.NOAMEND_INFO_ICON);
  this.patchFieldParameters(control, FccGlobalConstant.NOAMEND_INFO_ICON);
  amendFieldControl.updateValueAndValidity();
  fieldObj.updateValueAndValidity();
  control.updateValueAndValidity();

}

/**
 * Assign Amend info label
 */
assignAmendInfoLabel(transactionControl?: any, masterControl?: any, masterUpdate = false): void {
  if (this.commonServices.isNonEmptyValue(transactionControl)) {
   this.patchFieldParameters(transactionControl, FccGlobalConstant.AMENDED_INFO_LABEL);
   transactionControl.updateValueAndValidity();
  }
  if (masterUpdate && this.commonServices.isNonEmptyValue(masterControl)) {
    this.patchFieldParameters(masterControl, FccGlobalConstant.AMENDED_INFO_LABEL);
    masterControl.updateValueAndValidity();
  }
}

/**
 * remove info label
 */
removeAmendInfoLabel(transactionControl?: any, masterControl?: any, masterUpdate = false): void {
  if (this.commonServices.isNonEmptyValue(transactionControl)) {
    this.patchFieldParameters(transactionControl, FccGlobalConstant.NOAMEND_INFO_ICON);
    transactionControl.updateValueAndValidity();
    if (transactionControl.params[FccGlobalConstant.NOT_REQUIRED_FOR_COMPARISON_IF_EMPTY])
    {
      this.patchFieldParameters(transactionControl, { infolabel: '' });
    }
  }
  if (masterUpdate && this.commonServices.isNonEmptyValue(masterControl)) {
    this.patchFieldParameters(masterControl, FccGlobalConstant.NOAMEND_INFO_ICON);
    masterControl.updateValueAndValidity();
    if (transactionControl.params[FccGlobalConstant.NOT_REQUIRED_FOR_COMPARISON_IF_EMPTY])
    {
      this.patchFieldParameters(masterControl, { infolabel: '' });
    }
  }
}

convert(str: any) {
  const date = new Date(str);
  return this.convertToDateString(date);
}

convertToDateString(date) {
  const mnth = ('0' + (date.getMonth() + 1)).slice(-FccGlobalConstant.NUMERIC_TWO);
  const day = ('0' + date.getDate()).slice(-FccGlobalConstant.NUMERIC_TWO);
  return [day, mnth, date.getFullYear()].join('/');
}

patchFieldParameters(control: any, params: any) {
  if (this.commonServices.isNonEmptyValue(control)) {
    control.params = Object.assign(control.params, params);
    Object.keys(params).forEach(element => {
    if ('updateOptions' in control && element === 'options') {
      control.updateOptions();
    }
  });
  }

}

  /**
   * Compares Master and Trasacntion state forms and updates the Amend state with the details
   * Uses Amendcommonservice for
   */
  compareTransactionAndMasterForAmend(productCode: any) {
    this.stateService.populateAllEmptySectionsInState(productCode, false);
    this.stateService.getSectionNames(true).forEach(section => {
      this.tabPanelService.initializeMaps(section, this.stateService.getSectionData(section, undefined, true));
      const tabSectionMasterControlMap = this.tabPanelService.getTabSectionControlMap();
      const tabSectionMasterControlMap1 = tabSectionMasterControlMap.get(section);
      this.tabPanelService.initializeMaps(section, this.stateService.getSectionData(section, undefined, false));
      const accordionSubSectionsListMap = this.formAccordionPanelService.getAccordionSubSectionListMap();
      const tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
      if (accordionSubSectionsListMap.has(section)) {
        const sectionData = this.stateService.getSectionData(section, productCode, false);
        if (accordionSubSectionsListMap.has(section))
        {
        const accordionSubSectionsList = accordionSubSectionsListMap.get(section);
        accordionSubSectionsList.forEach(subSection => {
          const subSectionForm = sectionData.controls[subSection] as FCCFormGroup;
          Object.keys(subSectionForm.controls).forEach(field => {
        const masterFieldControl = this.stateService.getSubControl(section, subSection, field, true);
        const transactionFieldControl = this.stateService.getSubControl(section, subSection, field, false);
        const transactionForm: FCCFormGroup = this.stateService.getSectionData(section, undefined, false);
        const comparisonValue = this.stateService.getNonLocalizedTabValue(masterFieldControl, true);
        if (!(masterFieldControl.type === 'view-mode' ||
           transactionFieldControl.type === 'view-mode')) {
        this.compareMasterAndTransaction(masterFieldControl, transactionFieldControl, comparisonValue,
                                transactionForm);
        }
        });
      });
    }
      } else if (tabSectionControlMap.has(section)) {
        for (const [fieldName, control] of tabSectionControlMap.get(section)) {
          let masterControl;
          if (tabSectionMasterControlMap1)
          {
            masterControl = tabSectionMasterControlMap1.get(fieldName);
          }
          const value = this.stateService.getTabValue(masterControl);
          let comparisonValue;
          if (masterControl)
          {
            comparisonValue = this.stateService.getNonLocalizedTabValue(masterControl, true);
          }
          if (value && (!control.params[FccGlobalConstant.NOT_AMENDED] || control.params[FccGlobalConstant.NOT_AMENDED] === undefined)) {
            control.params = Object.assign(control.params, { previousValue: value, previousCompareValue: comparisonValue });
            control.updateValueAndValidity();
          }
          this.compareMasterAndTransactionForTabSection(masterControl, control, comparisonValue, tabSectionControlMap.get(section));

        }
      } else {
        Object.keys(this.stateService.getSectionData(section, undefined, true).controls).forEach(field => {
          const masterFieldControl = this.stateService.getControl(section, field, true);
          const transactionFieldControl = this.stateService.getControl(section, field, false);
          const transactionForm: FCCFormGroup = this.stateService.getSectionData(section, undefined, false);
          const comparisonValue = this.stateService.getNonLocalizedValue(section, field, true);
          if (!(masterFieldControl.type === 'view-mode' ||
             transactionFieldControl.type === 'view-mode')) {
          this.compareMasterAndTransaction(masterFieldControl, transactionFieldControl, comparisonValue,
                                  transactionForm);
          }
        });
      }
    });
  }

  isValueSame(tnxData, masterData): boolean {
    return this.commonServices.isNonEmptyValue(tnxData) && this.commonServices.isNonEmptyValue(masterData)
      && tnxData !== masterData;
  }

}
