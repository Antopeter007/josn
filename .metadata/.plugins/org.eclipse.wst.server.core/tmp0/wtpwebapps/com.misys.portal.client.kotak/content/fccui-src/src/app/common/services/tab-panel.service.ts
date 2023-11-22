import { Injectable } from '@angular/core';
import { FCCFormGroup, FCCFormControl } from '../../../app/base/model/fcc-control.model';
import { TabControl } from '../../../app/base/model/form-controls.model';
import { FormModelService } from './form-model.service';
import { ProductStateService } from '../../corporate/trade/lc/common/services/product-state.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class TabPanelService {

  constructor(protected formModelService: FormModelService, protected stateService: ProductStateService) { }

  readonly tabbedPanel = 'tabbedPanel';
  readonly tabComponentList = 'tabComponentList';
  readonly controlName = 'controlName';
  readonly tabs = 'tabs';
  readonly key = 'key';
  readonly nestedTabPanel = 'nestedTabPanel';
  readonly controls = 'controls';
  readonly previewScreen: 'previewScreen';
  readonly params = 'params';
  readonly rendered = 'rendered';

  private formModel: any;
  // private productItems: Map<string, string[]>; // Map<SectionName, [FieldNames]>
  private sectionControls: Map<string, any[]>; // Map<SectionName, ControlObject>
  private tabSectionList: string[];
  private tabSectionControlMap: Map<string, Map<string, FCCFormControl>>; // Map<sectionName, Map<FieldName, FCCFormControl>>;

  initializeMaps(sectionName: string, sectionForm: FCCFormGroup) {
    if (this.tabSectionControlMap === undefined) {
      this.tabSectionControlMap = new Map();
    }
    if (this.tabSectionControlMap.has(sectionName)) {
      this.tabSectionControlMap.delete(sectionName);
    }
    this.iterateForm(sectionName, sectionForm);
  }

  iterateForm(sectionName: string, form) {
    if (form !== undefined && form !== null) {
      Object.keys(form.controls).forEach(control => {
        // Companring FccFormGroup Type
        if (Object.getPrototypeOf(form) === Object.getPrototypeOf(form.controls[control])) {
          this.getFormControls(sectionName, form.controls[control] as FCCFormGroup);
        } else if (Object.getPrototypeOf(form) === Object.getPrototypeOf(TabControl)) {
          this.iterateForm(sectionName, control);
        } else if (form.controls[control] && form.controls[control][FccGlobalConstant.PARAMS] &&
          form.controls[control][FccGlobalConstant.PARAMS][FccGlobalConstant.TAB_SECTION] &&
          form.controls[control][FccGlobalConstant.PARAMS][FccGlobalConstant.TAB_SECTION] !== null) {
          this.filterControl(sectionName, form.controls[control] as FCCFormControl);
        }
      });
    }
  }

  getFormControls(sectionName: string, form: FCCFormGroup) {
    Object.keys(form.controls).forEach(controls => {
      if (form[this.rendered] && form[this.controls][controls] &&
         Object.getPrototypeOf(form[this.controls][controls]) === Object.getPrototypeOf(form)) {
        this.getFormControls(sectionName, form[this.controls][controls] as FCCFormGroup);
      }
      if (form[this.rendered] && Object.getPrototypeOf(form[this.controls][controls]) !== Object.getPrototypeOf(form)) {
        this.filterControl(sectionName, form.controls[controls] as FCCFormControl);
      }
    });
  }

  filterControl(sectionName: string, control: FCCFormControl) {
    if (control && control[this.key] && control.type !== FccGlobalConstant.TAB) {
      this.populateControlMap(sectionName, control);
    }
  }

  populateControlMap(sectionName: string, control: FCCFormControl) {
    const fieldname = control[this.key];
    if (!this.tabSectionControlMap.has(sectionName)) {
      this.tabSectionControlMap.set(sectionName, new Map());
    }
    this.tabSectionControlMap.get(sectionName).set(fieldname, control);
  }

  getTabSectionControlMap(): Map<string, Map<string, FCCFormControl>> {
    return this.tabSectionControlMap;
  }

  getShallowTabSectionControlMap(): Map<string, Map<string, FCCFormControl>>
  {
    const tabSectionControlMapCopy = this.tabSectionControlMap;
    const ShallowTabSectionControlMap = new Map<string, Map<string, FCCFormControl>>();
    for (const [sectionname, mapControl] of tabSectionControlMapCopy)
    {
      ShallowTabSectionControlMap.set(sectionname, mapControl);
    }
    return ShallowTabSectionControlMap;
  }

  initializeTabPanelService(modelJson: any) {
    this.tabSectionList = [];
    if (this.sectionControls === undefined) {
      this.sectionControls = new Map();
    }
    // this.initializeProductModel(modelJson);
    const sectionNamesList = Object.keys(modelJson);
    sectionNamesList.forEach(sectionName => {
      const fieldsObj = modelJson[sectionName];
      if (this.isTabPanel(fieldsObj)) {
        this.addTabSectionList(sectionName);
        Object.keys(fieldsObj).forEach(fieldObj => {
          this.populateProductItemMap(sectionName, fieldsObj[fieldObj]);
        });
      }
    });
  }

  isTabPanel(fieldObj: any): boolean {
    return fieldObj[this.tabbedPanel] || fieldObj[this.nestedTabPanel];
  }

  private addTabSectionList(sectionName: string) {
    if (this.tabSectionList === undefined) {
      this.tabSectionList = [];
    }
    if (this.tabComponentList.indexOf(sectionName) === -1) {
      this.tabSectionList.push(sectionName);
    }
  }

  getTabSectionList(): string[] {
    return this.tabSectionList;
  }

  private populateProductItemMap(sectionName: string, tabObj) {
    if (!this.sectionControls.has(sectionName)) {
      const fieldControlObjs: any[] = [];
      this.sectionControls.set(sectionName, fieldControlObjs);
    }
    if (this.setTabControlList(tabObj).length > 0) {
      const tabs = tabObj.tabs;
      Object.keys(tabs).forEach(tab => {
        const name = tabs[tab][this.controlName];
        Object.keys(tabs[tab][name]).forEach(controlObj => {
          if (tabs[tab][name][controlObj][this.tabComponentList]) {
            this.populateProductItemMap(sectionName, tabs[tab][name][controlObj]);
          }
          this.sectionControls.get(sectionName).push(tabs[tab][name][controlObj]);
        });
      });
    }
  }

  private setTabControlList(tabObj: any): string[] {
    const componentList: string[] = [];
    const tabComponentListArray = tabObj[this.tabComponentList];
    if (tabComponentListArray) {
      Object.keys(tabComponentListArray).forEach(component => {
        componentList.push(tabComponentListArray[component].toString());
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
