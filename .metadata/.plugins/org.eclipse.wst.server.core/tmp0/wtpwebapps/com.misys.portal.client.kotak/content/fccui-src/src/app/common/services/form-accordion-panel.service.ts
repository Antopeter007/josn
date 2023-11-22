import { FormAccordionControl } from './../../base/model/form-controls.model';
import { FCCFormControl, FCCFormGroup } from './../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../core/fcc-global-constants';
import { Injectable } from '@angular/core';
import { ProductStateService } from './../../corporate/trade/lc/common/services/product-state.service';
import { FormModelService } from './form-model.service';

@Injectable({
  providedIn: 'root'
})
export class FormAccordionPanelService {

  constructor(protected formModelService: FormModelService, protected stateService: ProductStateService) { }

  readonly formAccordionPanelList = 'formAccordionPanelList';
  readonly controlName = 'controlName';
  readonly formAccordions = 'formAccordions';
  readonly key = 'key';
  readonly controls = 'controls';
  readonly previewScreen: 'previewScreen';
  readonly params = 'params';
  readonly rendered = 'rendered';

  private formModel: any;
  // private productItems: Map<string, string[]>; // Map<SectionName, [FieldNames]>
  private sectionControls: Map<string, any[]>; // Map<SectionName, ControlObject>
  private accordionSectionList: string[];
  private accordionSectionControlMap: Map<string, Map<string, FCCFormControl>>; // Map<sectionName, Map<FieldName, FCCFormControl>>;
  /**
   * accordionSubSectionsListMap will contain each accordion section name as a key
   * Value will be the list of sub sections in each accoridion.
   * example for UI product:
   * uiUndertakingDetails -> List (uiTypeAndExpiry,uiAmountChargeDetails)
   * uiCuCounterDetails -> List (uiCuGeneralDetails, uiCuBeneficiaryDetails)
   */
  private accordionSubSectionsListMap: Map<string, string[]> = new Map();
  /**
   * accordionSubSectionAndControlsListMap will contain a map for each accordion section(uiUndertakingDetails)
   * Value will be a map which contains subsections as a key.
   * and list of controls in the respective sub section as the value.
   * example for UI product:
   * uiUndertakingDetails -> uiTypeAndExpiry -> [bgTypeCode, bgTypeDetails]
   *                      -> uiAmountChargeDetails -> [bgAmt, bgCurCode]
   *
   */
  private accordionSubSectionAndControlsListMap: Map<string, Map<string, FCCFormControl[]>> = new Map(); //



  isFormAccordionPanel(fieldObj: any, sectionName: string, sectionForm: FCCFormGroup): boolean {
    if (fieldObj !== undefined) {
      return fieldObj[FccGlobalConstant.FORM_ACCORDION_PANEL];
    } else {
      return sectionForm.get(sectionName) instanceof FormAccordionControl;
    }
  }

  initializeFormAccordionMap(sectionName: string, sectionForm: FCCFormGroup) {
    if (this.accordionSectionControlMap === undefined) {
      this.accordionSectionControlMap = new Map();
    }
    if (this.isFormAccordionPanel(undefined, sectionName, sectionForm)){
      if (this.accordionSectionControlMap.has(sectionName)) {
        this.accordionSectionControlMap.delete(sectionName);
      }
      if (this.accordionSubSectionsListMap.has(sectionName)) {
        this.accordionSubSectionsListMap.delete(sectionName);
      }
      if (this.accordionSubSectionAndControlsListMap.has(sectionName)) {
        this.accordionSubSectionAndControlsListMap.delete(sectionName);
      }
      this.iterateForm(sectionName, sectionForm);
    }
  }

  initializeBatchFormAccordionMap(sectionName: string, sectionForm: FCCFormGroup) {
    if (this.accordionSectionControlMap === undefined) {
      this.accordionSectionControlMap = new Map();
    }
    this.iterateBatchForm(sectionName, sectionForm);
  }

  iterateForm(sectionName: string, form) {
    Object.keys(form.controls).forEach(control => {
      // Companring FccFormGroup Type
      if (Object.getPrototypeOf(form) === Object.getPrototypeOf(form.controls[control])) {
        this.getFormControls(sectionName, form.controls[control] as FCCFormGroup);
        this.setAccordionSubSectionsListMap(sectionName, control);
        this.setAccordionSubSectionAndControlsListMap(sectionName, control, form.controls[control] as FCCFormGroup);
      } else if (Object.getPrototypeOf(form) === Object.getPrototypeOf(FormAccordionControl)) {
        this.iterateForm(sectionName, control);
      }
    });
  }

  iterateBatchForm(sectionName: string, form) {
    for(const control of form) {
      // Companring FccFormGroup Type
        this.getBatchFormControls(sectionName, control.panelControlArray as FCCFormGroup);
        this.setAccordionSubSectionsListMap(sectionName, control.panelHeader);
        this.setBatchAccordionSubSectionAndControlsListMap(sectionName, control.panelHeader, control.panelControlArray as FCCFormGroup);
      }
  }

  getBatchFormControls(sectionName: string, form: FCCFormGroup) {
    Object.keys(form).forEach(controls => {
      if (Object.getPrototypeOf(form[controls]) !== Object.getPrototypeOf(form)) {
        this.filterControl(sectionName, form[controls] as FCCFormControl);
      }
    });
  }

  getFormControls(sectionName: string, form: FCCFormGroup) {
    Object.keys(form.controls).forEach(controls => {
      if (form[this.controls][controls] &&
         Object.getPrototypeOf(form[this.controls][controls]) === Object.getPrototypeOf(form)) {
        this.getFormControls(sectionName, form[this.controls][controls] as FCCFormGroup);
      }
      if (Object.getPrototypeOf(form[this.controls][controls]) !== Object.getPrototypeOf(form)) {
        this.filterControl(sectionName, form.controls[controls] as FCCFormControl);
      }
    });
  }

  filterControl(sectionName: string, control: FCCFormControl) {
    if (control && control[this.key]) {
      this.populateControlMap(sectionName, control);
    }
  }

  populateControlMap(sectionName: string, control: FCCFormControl) {
    const fieldname = control[this.key];
    if (!this.accordionSectionControlMap.has(sectionName)) {
      this.accordionSectionControlMap.set(sectionName, new Map());
    }
    this.accordionSectionControlMap.get(sectionName).set(fieldname, control);
  }


  private setAccordionSubSectionsListMap(sectionName: string, subSection: string) {
    let subSectionList = [];
    if (this.accordionSubSectionsListMap.has(sectionName)) {
      subSectionList = this.accordionSubSectionsListMap.get(sectionName);
    }
    if (subSectionList.indexOf(subSection) === -1) {
      subSectionList.push(subSection);
    }
    this.accordionSubSectionsListMap.set(sectionName, subSectionList);
  }

  getAccordionSubSectionListMap(): Map<string, string[]> {
    return this.accordionSubSectionsListMap;
  }

  private setAccordionSubSectionAndControlsListMap(sectionName: string, subSectionName: string, subSectionForm: FCCFormGroup) {
    let subSectionControlListMap: Map<string, FCCFormControl[]>;
    let controlNamesList = [];
    if (this.accordionSubSectionAndControlsListMap.has(sectionName)) {
      subSectionControlListMap = this.accordionSubSectionAndControlsListMap.get(sectionName);
      if (subSectionControlListMap !== undefined && subSectionControlListMap.has(subSectionName)) {
        controlNamesList = subSectionControlListMap.get(subSectionName);
      }
    } else {
      subSectionControlListMap = new Map();
    }
    Object.keys(subSectionForm.controls).forEach(control => {
      if (controlNamesList.indexOf(control) === -1) {
        controlNamesList.push(subSectionForm.controls[control] as FCCFormControl);
      }
    });
    subSectionControlListMap.set(subSectionName, controlNamesList);
    this.accordionSubSectionAndControlsListMap.set(sectionName, subSectionControlListMap);
  }

  private setBatchAccordionSubSectionAndControlsListMap(sectionName: string, subSectionName: string, subSectionForm: FCCFormGroup) {
    let subSectionControlListMap: Map<string, FCCFormControl[]>;
    let controlNamesList = [];
    if (this.accordionSubSectionAndControlsListMap.has(sectionName)) {
      subSectionControlListMap = this.accordionSubSectionAndControlsListMap.get(sectionName);
      if (subSectionControlListMap !== undefined && subSectionControlListMap.has(subSectionName)) {
        controlNamesList = subSectionControlListMap.get(subSectionName);
      }
    } else {
      subSectionControlListMap = new Map();
    }
    Object.keys(subSectionForm).forEach(control => {
      if (controlNamesList.indexOf(control) === -1) {
        controlNamesList.push(subSectionForm[control] as FCCFormControl);
      }
    });
    subSectionControlListMap.set(subSectionName, controlNamesList);
    this.accordionSubSectionAndControlsListMap.set(sectionName, subSectionControlListMap);
  }

  getAccordionSubSectionAndControlsListMap(): Map<string, Map<string, FCCFormControl[]>> {
    return this.accordionSubSectionAndControlsListMap;
  }

  getAccordionSectionControlMap(): Map<string, Map<string, FCCFormControl>> {
    return this.accordionSectionControlMap;
  }


  getShallowAccordionSectionControlMap(): Map<string, Map<string, FCCFormControl>>
  {
    const accordionSectionControlMapCopy = this.accordionSectionControlMap;
    const ShallowAccordionSectionControlMap = new Map<string, Map<string, FCCFormControl>>();
    for (const [sectionname, mapControl] of accordionSectionControlMapCopy)
    {
      ShallowAccordionSectionControlMap.set(sectionname, mapControl);
    }
    return ShallowAccordionSectionControlMap;
  }

  initializeAccordionPanelService(modelJson: any) {
    this.accordionSectionList = [];
    if (this.sectionControls === undefined) {
      this.sectionControls = new Map();
    }
    // this.initializeProductModel(modelJson);
    const sectionNamesList = Object.keys(modelJson);
    sectionNamesList.forEach(sectionName => {
      const fieldsObj = modelJson[sectionName];
      if (this.isFormAccordionPanel(fieldsObj, undefined, undefined)) {
        this.addAccordionSectionList(sectionName);
        Object.keys(fieldsObj).forEach(fieldObj => {
          this.populateProductItemMap(sectionName, fieldsObj[fieldObj]);
        });
      }
    });
  }

  private addAccordionSectionList(sectionName: string) {
    if (this.accordionSectionList === undefined) {
      this.accordionSectionList = [];
    }
    if (this.formAccordionPanelList.indexOf(sectionName) === -1) {
      this.accordionSectionList.push(sectionName);
    }
  }

  getAccordionSectionList(): string[] {
    return this.accordionSectionList;
  }

  private populateProductItemMap(sectionName: string, accordionObj) {
    if (!this.sectionControls.has(sectionName)) {
      const fieldControlObjs: any[] = [];
      this.sectionControls.set(sectionName, fieldControlObjs);
    }
    if (this.setAccordionControlList(accordionObj).length > 0) {
      const formAccordions = accordionObj.formAccordions;
      Object.keys(formAccordions).forEach(formAccordion => {
        const name = formAccordions[formAccordion][this.controlName];
        Object.keys(formAccordions[formAccordion][name]).forEach(controlObj => {
          if (formAccordions[formAccordion][name][controlObj][this.formAccordionPanelList]) {
            this.populateProductItemMap(sectionName, formAccordions[formAccordion][name][controlObj]);
          }
          this.sectionControls.get(sectionName).push(formAccordions[formAccordion][name][controlObj]);
        });
      });
    }
  }

  private setAccordionControlList(formAccordionObj: any): string[] {
    const componentList: string[] = [];
    const formAccordionListArray = formAccordionObj[this.formAccordionPanelList];
    if (formAccordionListArray) {
      Object.keys(formAccordionListArray).forEach(component => {
        componentList.push(formAccordionListArray[component].toString());
      });
    }
    return componentList;
  }

  getsectionControlsMap(): Map<string, any[]> {
    return this.sectionControls;
  }

  private initializeProductModel() {
    // this.formModelService.getFormModel(productCode).subscribe(modelJson => {
      this.formModel = this.stateService.getProductModel(this.stateService.isMaster);
    // });
  }
}

