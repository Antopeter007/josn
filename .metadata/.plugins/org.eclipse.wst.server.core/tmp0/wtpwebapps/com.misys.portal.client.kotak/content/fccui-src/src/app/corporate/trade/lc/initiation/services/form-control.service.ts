import { Injectable } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { FCCFormGroup } from '../../../../../../app/base/model/fcc-control.model';
import {
  AccordionControl,
  AmendNarrativeTextareaControl,
  ButtonControl,
  CalenderDateControl,
  CheckboxFormControl,
  DivControl,
  DropdownFilterFormControl,
  DropdownFormControl,
  EditTableControl,
  CarouselViewControl,
  ExpansionPanelControl,
  ExpansionPanelEditTableControl,
  ExpansionPanelEditFormTableControl,
  CardSummaryControl,

  ExpansionPanelTableControl,
  FileUploadControl,
  FileUploadDragDropControl,
  InputDateControl,
  InputIconControl,
  InputSwitchControl,
  InputTextareaControl,
  InputTextControl,
  MatAutoCompControl,
  MatCheckboxFormControl,
  NarrativeTextareaControl,
  RadioCheckFormControl,
  RadioGroupFormControl,
  RoundedButtonControl,
  SelectButtonControl,
  SpacerControl,
  SummaryTextControl,
  TabControl,
  TableControl,
  TextComparisonControl,
  TextControl,
  TextValueControl,
  ViewModeControl,
  HighlightTextEditorControl,
  FCCFileViewerControl,
  MultiSelectFormControl,
  InputDateRangeControl,
  ThreeDotsButtonControl,
  ExchangeRateControl,
  FCCListBoxControl,
  ProgressBarControl
} from '../../../../../../app/base/model/form-controls.model';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { TransactionDetailsMap } from '../../common/services/transaction-map.service';
import {
  CardControl,
  EditorControl,
  FccCurrencyControl,
  FormAccordionControl,
  FormTableControl,
  InputBackDateControl,
  InputPasswordControl,
  JSONObjControl,
  MatCardControl,
  SelectViewModeControl,
  TimerControl,
} from './../../../../../base/model/form-controls.model';
import { LocaleService } from './../../../../../base/services/locale.service';
import {
  childReferencesHeader,
  documentsHeader,
  feesAndChargesHeader,
  variationsHeader,
} from './../../../../../common/model/review.model';
import { CommonService } from './../../../../../common/services/common.service';
import { PrevNextService } from './prev-next.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})

export class FormControlService {
  obj = {};
  spacer = 'spacer';
  fieldTnxTypeCode: any;
  dateParts: any;
  dateObject: any;
  fieldTnxMode: any;
  fieldTnxOption: any;
  fieldSubTnxTypeCode: any;
  fieldTnxStatCode: any;
  combination: any;
  fieldProdStatCode: any;
  feildActionReqCode: any;
  feildIgnoreActionReqCode: any;
  fieldProductCode: any;
  feildIsMaster: any;
  fieldValueTypeKey = 'fieldValueType';
  fieldNameKey = 'fieldName';
  layoutClassKey = 'layoutClass';
  styleClassKey = 'styleClass';
  labelStyleClassKey = 'labelStyleClass';
  valueStyleClassKey = 'valueStyleClass';
  showFieldLabelKey = 'showFieldLabel';
  fieldValueKey = 'fieldValue';
  formKey = 'form';
  subFieldNameKey = 'subFieldName';
  parentStyleClassKey = 'parentStyleClass';
  showViewModeLabelKey = 'showViewModeLabel';
  layoutClassCol6 = 'p-col-6 p-md-6 p-lg-6 p-sm-12';
  LAYOUT_VALUE = 'p-col-12 p-md-12 p-lg-12 p-sm-12 padding_zero';
  readonly rendered = 'rendered';
  index: number;
  stateId: any;
  attachmentTableColumns: any;
  // language = localStorage.getItem('language');
  isStepperDisabled: boolean;
  fieldOperation: string;

  constructor(protected translateService: TranslateService,
              protected prevNextService: PrevNextService,
              protected commonService: CommonService,
              protected utilityService: UtilityService,
              protected formModelService: FormModelService,
              protected transactionDetailsMap: TransactionDetailsMap,
              protected localeService: LocaleService) { }
/**
 * Passing the JSON object as input to build form controls.
 */
  getFormControls(formModel: any, stateId?: any): FCCFormGroup {
    this.stateId = stateId;
    const fields = formModel ? Object.keys(formModel) : [];
    const form = new FCCFormGroup({});
    fields.forEach(fieldName => {
      const fieldObj = formModel[fieldName];
      if (typeof fieldObj === 'object') {
      // To build the subsections like Applicant Details, Beneficiary details etc which has same set of fields.
        if (formModel[fieldName].sectionType) {
          this.buildSection(form, formModel[fieldName]);
        } else if (formModel[fieldName].applicableScreens) {
          this.buildControlsForScreenType(form, formModel[fieldName], formModel[fieldName].name, formModel[fieldName].type);
        } else if (fieldName === 'pdfStyles') {
          form.pdfParams = fieldObj;
        } else if (fieldName === FccGlobalConstant.TABBED_PANEL || fieldName === FccGlobalConstant.FORM_ACCORDION_PANEL) {
          this.getNestedFormControls(form , formModel, fieldName);
        } else if (fieldName === FccGlobalConstant.NESTED_TABBED) {
          this.getNestedOfNestedFormControls(form, formModel);
        } else if (fieldName === 'applicableSections') {
          form.applicableSections = fieldObj;
        } else if (formModel[fieldName].hidden) {
          formModel[fieldName].rendered = false;
          form.addControl(formModel[fieldName].name, this.getControl(formModel[fieldName]));
        } else if (fieldName === FccGlobalConstant.DYNAMIC_CRITERIA) {
          form.dynamicRenderCriteria = fieldObj;
        } else {
          form.addControl(formModel[fieldName].name, this.getControl(formModel[fieldName]));
        }
      }
    });
    return form;
  }

  addNewFormControls(additionalFieldsJSON: any, form: any, headerGroup?: string ): FCCFormGroup {
    const fields = Object.keys(additionalFieldsJSON);
    fields.forEach(fieldName => {
      const fieldObj = additionalFieldsJSON[fieldName];
      if (typeof fieldObj === 'object') {
        if(headerGroup){
          form.addControlUnderGroup(additionalFieldsJSON[fieldName].name,
            this.getControl(additionalFieldsJSON[fieldName]),headerGroup);
        } else {
          form.addControl(additionalFieldsJSON[fieldName].name, this.getControl(additionalFieldsJSON[fieldName]));
        }
      }
    });
    return form;
  }

  addNewFormControlsInSequence(additionalFields: any[], additionalFieldsJSON: any, form: any): FCCFormGroup {
    additionalFields.forEach(fieldName => {
      const fieldObj = additionalFieldsJSON[fieldName];
      if (typeof fieldObj === 'object') {
        if (fieldObj.type === FccGlobalConstant.inputDate) {
          fieldObj['disableMinDate'] = true;
          form.addControlUnderGroup(additionalFieldsJSON[fieldName].code,
            this.getControl(fieldObj, true),
            additionalFieldsJSON[fieldName].grouphead);
        } else {
          form.addControlUnderGroup(additionalFieldsJSON[fieldName].code,
            this.getControl(additionalFieldsJSON[fieldName], true),
            additionalFieldsJSON[fieldName].grouphead);
        }
      }
    });
    return form;
  }

  removeFormControls(additionalFieldsJSON: any, form: any): FCCFormGroup {
    const fields = Object.keys(additionalFieldsJSON);
    fields.forEach(fieldName => {
      form.removeControl(fieldName);
    });
    return form;
  }

  getNestedOfNestedFormControls(form: FCCFormGroup, formModel): FCCFormGroup {
    const fields = Object.keys(formModel);
    fields.forEach(fieldName => {
      const fieldObj = formModel[fieldName];
      if (typeof fieldObj === FccGlobalConstant.OBJECT) {
        form.addControl(formModel[fieldName].name, this.getControl(formModel[fieldName]));
        const arrObj = formModel.nestedTabPanel.tabs;
        for (let i = 0; i < arrObj.length; i++) {
          const SecondForm = new FCCFormGroup({});
          const controlName = arrObj[i].name;
          const getObj = arrObj[i][controlName];
          form.addControl(controlName, this.getNestedFormControls(SecondForm, getObj, FccGlobalConstant.TABBED_PANEL));
        }
      }
    });
    return form;
  }

  getNestedFormControls(form: FCCFormGroup, formModel: any, parentType): FCCFormGroup {
    const fields = Object.keys(formModel);
    let array = [];
    if (parentType === FccGlobalConstant.TABBED_PANEL) {
      array = formModel.tabbedPanel.tabs;
    } else if (parentType === FccGlobalConstant.FORM_ACCORDION_PANEL) {
      array = formModel.formAccordionPanel.formAccordions;
    }
    fields.forEach(fieldName => {
      const fieldObj = formModel[fieldName];
      if (typeof fieldObj === FccGlobalConstant.OBJECT && fieldName !== FccGlobalConstant.DYNAMIC_CRITERIA) {
        form.addControl(formModel[fieldName].name, this.getControl(formModel[fieldName]));
      }
    });
    this.getNestedFormGroup(form, array);
    form[this.rendered] = true;
    return form;
  }

  getNestedFormGroup(form, tabarr): FCCFormGroup {
    tabarr.forEach(element => {
      form.addControl(element.controlName, this.getFormControls(element[element.controlName]));
      form.controls[element.controlName][this.rendered] = element[this.rendered] !== undefined ? element[this.rendered] : true;
    });
    return form;
  }

  /**
   * Control creation for Screen types like Amend Based on Mode
   */
  buildControlsForScreenType(form: FCCFormGroup, field: any, subFieldName: any, fieldtype: any) {
    this.index = 0;
    for (const value of field.applicableScreens) {
      const operation = this.commonService.getQueryParametersFromKey('operation');
      const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
      const subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
      if (operation !== FccGlobalConstant.LIST_INQUIRY && tnxTypeCode === FccGlobalConstant.N002_AMEND ||
          subTnxTypeCode === FccGlobalConstant.N003_PAYMENT) {
        this.fieldTnxTypeCode = value.tnxTypeCode ? value.tnxTypeCode : this.fieldTnxTypeCode;
      } else {
        this.fieldTnxTypeCode = value.tnxTypeCode;
      }
      this.fieldTnxMode = value.tnxMode;
      this.fieldTnxOption = value.tnxOption;
      this.fieldSubTnxTypeCode = value.subTnxTypeCode;
      this.index++;
      this.feildActionReqCode = value.actionRequiredCode;
      this.fieldProductCode = value.productCode;
      this.feildIsMaster = value.isMaster;
      this.feildIgnoreActionReqCode = value.ignoreActionReqCode;
      this.fieldTnxStatCode = value.tnxStatCode;
      this.combination = value.combination;
      this.fieldProdStatCode = value.productStatCode;
      this.fieldOperation = value.operation;
      if (form.MODE_VIEW === value.mode && value.screen && value.screen === 'reviewScreen') {
        form.addControl(field.name, this.getControl(field));
      } else if (form.MODE_VIEW === value.mode && value.screen && value.screen === 'eventEnquiry') {
        form.addControl(field.name, this.getControl(field));
      } else if (form.MODE_VIEW === value.mode && this.isScreenTypeControl() && field.prefix) {
        this.setViewSubSectionFieldControl(form, field, subFieldName, fieldtype);
      } else if (form.MODE_VIEW === value.mode && this.isScreenTypeControl()) {
        this.setFieldControl(form, field, subFieldName, fieldtype);
      } else if (form.MODE_EDIT === value.mode && this.isScreenTypeControl() && !field.prefix) {
        this.setEditModeValueControl(form, field, subFieldName);
      } else if (form.MODE_EDIT === value.mode && this.isScreenTypeControl() && field.prefix) {
        form.addControl(subFieldName.name, this.getControl(subFieldName));
      } else if (operation !== undefined && (operation === 'LIST_INQUIRY' || operation === 'PREVIEW') && value.screen === 'eventEnquiry') {
        if (this.isEventControlApplicable()) {
          const fieldName = field.prefix ? subFieldName : field.name;
          form.addControl(fieldName, this.getControl(field));
        }

      } else if (operation !== undefined && (operation === 'LIST_INQUIRY' || operation === 'PREVIEW')
      && value.operation && (value.operation === 'LIST_INQUIRY' || value.operation === 'PREVIEW')
      && value.rendered && value.rendered === true && value.onlyPreviewField && value.onlyPreviewField === true && this.fieldTnxStatCode) {
        if(this.isEventControlApplicable()){
          this.setFieldControl(form, field, subFieldName, fieldtype);
        }
      }else if (operation !== undefined && (operation === 'LIST_INQUIRY' || operation === 'PREVIEW')
      && value.operation && operation === value.operation && value.rendered && value.rendered === true
       && value.onlyPreviewField && value.onlyPreviewField === true) {
          this.setFieldControl(form, field, subFieldName, fieldtype);
      } else if (value.option === form.TEMPLATE) {
        if (!this.isAmendOrTemplate()) {
          this.setRequiredParam(form, field, subFieldName);
        }
      } else if (form.MODE_DRAFT === value.mode &&
        this.commonService.isnonEMptyString(value.multipleApplicableScreens) && value.multipleApplicableScreens) {
        this.setFieldControl(form, field, subFieldName, fieldtype);
      } else {
          const fieldName = field.prefix ? subFieldName : field.name;
          const control = this.getControl(field);
          if (control && !(this.commonService.isnonEMptyString(value.multipleApplicableScreens) && value.multipleApplicableScreens)) {
            form.addControl(fieldName, control);
          }
      }
    }
  }

  isAmendOrTemplate() {
    if (this.fieldTnxTypeCode === FccGlobalConstant.N002_AMEND && this.index > 1) {
      return true;
    }
    return false;
  }

    /**
     * Check if the control of Event Inquery is of Screentype
     */
  isEventControlApplicable(): boolean {
    const transactionDetail = this.transactionDetailsMap.getSingleTransaction(this.stateId);
    let returnValue = false;
    let subTnxType;
    let tnxTypeCode;
    let actionReqCode;
    let tnxStateCode;
    const productCode = this.commonService.getQueryParametersFromKey('productCode');
    let isMaster;
    let eventTab;
    let transactionTab;
    let prodStatCode;

    if (transactionDetail !== undefined) {
      subTnxType = transactionDetail.subTnxType;
      tnxTypeCode = transactionDetail.tnxTypeCode;
      actionReqCode = transactionDetail.actionReqCode;
      tnxStateCode = transactionDetail.tnxStatCode;
      isMaster = transactionDetail.isMaster;
      eventTab = transactionDetail.eventTab;
      transactionTab = transactionDetail.transactionTab;
      prodStatCode = transactionDetail.prodStatCode;

      if (this.fieldProductCode === productCode) {

      if (!isMaster) {

      if (tnxTypeCode && this.fieldTnxTypeCode && this.fieldTnxTypeCode.indexOf(tnxTypeCode) !== -1 ) {
        returnValue = true;
      } else if (subTnxType && this.fieldSubTnxTypeCode && this.fieldSubTnxTypeCode.indexOf(subTnxType) !== -1) {
        returnValue = true;
      } else if (actionReqCode && this.feildActionReqCode && this.feildActionReqCode.indexOf(actionReqCode) !== -1) {
        returnValue = true;
    } else if (tnxStateCode && this.fieldTnxStatCode && this.fieldTnxStatCode.indexOf(tnxStateCode) !== -1 ) {
        returnValue = true;
    } else if (prodStatCode && this.fieldProdStatCode && this.fieldProdStatCode.indexOf(prodStatCode) !== -1 ) {
        returnValue = true;
    } else if ((actionReqCode === undefined || actionReqCode === '' ) &&       // eslint-disable-line no-dupe-else-if
              (tnxTypeCode && tnxTypeCode === FccGlobalConstant.N002_REPORTING &&
                this.fieldTnxTypeCode && this.fieldTnxTypeCode.indexOf(tnxTypeCode) !== -1 )) {
        returnValue = true;
      }
    }

      if (isMaster) {
      if ((isMaster === this.feildIsMaster) && transactionTab ) {
        returnValue = true;
      }
    }



      if (tnxTypeCode && tnxTypeCode === FccGlobalConstant.N002_REPORTING ) {

        // eslint-disable-next-line max-len
        if ((actionReqCode && this.feildIgnoreActionReqCode && this.feildIgnoreActionReqCode.indexOf(actionReqCode) !== -1 && eventTab) ||
         // eslint-disable-next-line max-len
         (actionReqCode && this.feildIgnoreActionReqCode && this.feildIgnoreActionReqCode.indexOf(actionReqCode) !== -1 && transactionTab) ) {
          returnValue = false;
         }
     }


      if (!returnValue && this.combination) {
      for (const value of this.combination) {
        const subType = value[`subTnxTypeCode`];
        const tnxStat = value[`tnxStatCode`];
        const type = value[`combinationType`];
        let subTypeValue = false;
        let tnxStatValue = false;
        if (subTnxType && subType && (subTnxType === subType) && eventTab) {
          subTypeValue = true;
         }
        if (tnxStateCode && tnxStat && (tnxStateCode === tnxStat) && eventTab) {
        tnxStatValue = true;
       }
        if (subTypeValue && tnxStatValue && type === 'SubTnxTypeTnxStat' ) {
          returnValue = true;
          }
      }
     }
    }else if((this.fieldTnxStatCode && productCode === FccGlobalConstant.PRODUCT_TF) &&
      (this.commonService.isEventModelSection === false)){
      if (!isMaster) {
        if(tnxStateCode && this.fieldTnxStatCode.indexOf(tnxStateCode) !== -1){
            returnValue = true;
        }else if(tnxTypeCode && tnxTypeCode !== FccGlobalConstant.N002_NEW){
          returnValue = true;
        }
      }else if(isMaster && transactionTab){
        returnValue = true;
      }
    }
    }
    return returnValue;
  }

  /**
   * Check if the control is of Screentype
   */
  isScreenTypeControl(): boolean {
    let subTnxTypeCodeHandling = false;
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const mode = this.commonService.isViewPopup ? FccGlobalConstant.VIEW_MODE : this.commonService.getQueryParametersFromKey('mode');
    const option = this.commonService.getQueryParametersFromKey('option');
    const screenMode = mode !== undefined ? mode === this.fieldTnxMode : option === this.fieldTnxOption;
    const subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    const operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    if (subTnxTypeCode) {
      if (subTnxTypeCode === this.fieldSubTnxTypeCode) {
        subTnxTypeCodeHandling = true;
        if (mode === FccGlobalConstant.DRAFT_OPTION) {
          return (tnxTypeCode === this.fieldTnxTypeCode && subTnxTypeCodeHandling);
        } else {
          return (tnxTypeCode === this.fieldTnxTypeCode && subTnxTypeCodeHandling && screenMode);
        }
      } else if ( this.fieldSubTnxTypeCode && subTnxTypeCode !== this.fieldSubTnxTypeCode) {
        return false;
      }
    }
    if ((option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC
        || option === FccGlobalConstant.PAYMENTS) && operation) {
      return operation === this.fieldOperation || screenMode;
    }
    return (tnxTypeCode) ? (tnxTypeCode === this.fieldTnxTypeCode || screenMode) : false;
  }

  /**
   * JSON Object for Screen type control
   */
  jsonObject(name: string, type: string, layoutClass?: string, styleClass?: any, showLabel = false, fieldName?: any,
             labelStyleClass?: any, valueStyleClass?: any): any {
    const nameStr = 'name';
    const typeStr = 'type';
    const layoutClassStr = 'layoutClass';
    const styleClassStr = 'styleClass';
    const labelStyleClassStr = 'labelStyleClass';
    const valueStyleClassStr = 'valueStyleClass';
    const showLabelStr = 'showLabel';
    const rendered = 'rendered';
    const previewScreen = 'previewScreen';
    const fullWidthView = 'fullWidthView';
    const dynamicCriteriaStr = 'dynamicCriteria';
    const groupChildrenStr = 'groupChildren';
    const groupheadStr = 'grouphead';
    const clubbedListStr = 'clubbedList';
    const clubbedDelimiterStr = 'clubbedDelimiter';
    const clubbedHeaderTextStr = 'clubbedHeaderText';
    this.obj = {};
    this.obj[nameStr] = name;
    this.obj[typeStr] = type;
    this.obj[layoutClassStr] = layoutClass;
    this.obj[styleClassStr] = styleClass;
    this.obj[labelStyleClassStr] = labelStyleClass;
    this.obj[valueStyleClassStr] = valueStyleClass;
    this.obj[showLabelStr] = showLabel;
    this.obj[rendered] = fieldName.rendered;
    this.obj[dynamicCriteriaStr] = fieldName.dynamicCriteria;
    this.obj[groupChildrenStr] = fieldName.groupChildren;
    this.obj[groupheadStr] = fieldName.grouphead;
    this.obj[clubbedHeaderTextStr] = fieldName.prefix ? fieldName.clubbedHeaderText : fieldName.clubbedHeaderText;
    this.obj[clubbedListStr] = fieldName.prefix ? fieldName.clubbedList : fieldName.clubbedList;
    this.obj[clubbedDelimiterStr] = fieldName.prefix ? fieldName.clubbedDelimiter : fieldName.clubbedDelimiter;
    this.obj[previewScreen] = fieldName.previewScreen === false ? false : true,
    this.obj[fullWidthView] = fieldName.fullWidthView;
    return this.obj;
  }

  subSectionJsonObject(
    name: string, type: string, layoutClass?: string, styleClass?: any, showLabel = false, fieldName?: any, subFieldName?: any
  ): any {
    const nameStr = 'name';
    const typeStr = 'type';
    const layoutClassStr = 'layoutClass';
    const styleClassStr = 'styleClass';
    const showLabelStr = 'showLabel';
    const rendered = 'rendered';
    const groupChildrenStr = 'groupChildren';
    const groupheadStr = 'grouphead';
    this.obj = {};
    this.obj[nameStr] = name;
    this.obj[typeStr] = type;
    this.obj[layoutClassStr] = layoutClass;
    this.obj[styleClassStr] = styleClass;
    this.obj[showLabelStr] = showLabel;
    this.obj[rendered] = fieldName.rendered;
    this.obj[groupChildrenStr] = subFieldName.groupChildren;
    this.obj[groupheadStr] = subFieldName.grouphead;
    return this.obj;
  }

  viewModeJsonObject(name: string, type: string, layoutClass?: string, styleClass?: any, parentStyleClass?: string,
                     showLabel = false, fieldName?: any, fieldValue?: string, subFieldName?: any, labelStyleClass?: any,
                     valueStyleClass?: any): any {
    let obj1 = {};
    const fieldValueStr = 'value';
    const parentStyleClassStr = 'parentStyleClass';
    const fieldOptions = 'options';
    const clubbedHeaderTextStr = 'clubbedHeaderText';
    const clubbedListStr = 'clubbedList';
    const previewScreenStr = 'previewScreen';
    const dynamicCriteriaStr = 'dynamicCriteria';
    const groupChildrenStr = 'groupChildren';
    const groupheadStr = 'grouphead';
    const tabSectionStr = 'tabSection';
    const groupSubHeaderStr = 'groupSubHeaderText';
    const previewSingleRowStr = 'previewSingleRow';
    const amendNarrativeClubStr = 'amendNarrativeClub';
    const amendNarrativeGroupStr = 'amendNarrativeGroup';
    const amendPreviewStyleStr = 'amendPreviewStyle';
    const hideGrpHeaderInView = 'hideGrpHeaderInView';
    const sourceStr = 'source';
    const modeStr = 'mode';
    const previousReadOnly = 'previousReadOnly';
    const clubbedDelimiterStr = 'clubbedDelimiter';
    obj1 = this.jsonObject(name, type, layoutClass, styleClass, showLabel, fieldName, labelStyleClass, valueStyleClass);
    obj1[fieldValueStr] = fieldValue;
    obj1[parentStyleClassStr] = parentStyleClass;
    obj1[fieldOptions] = fieldName.options;
    obj1[clubbedHeaderTextStr] = fieldName.prefix ? subFieldName.clubbedHeaderText : fieldName.clubbedHeaderText;
    obj1[clubbedListStr] = fieldName.prefix ? subFieldName.clubbedList : fieldName.clubbedList;
    obj1[clubbedDelimiterStr] = fieldName.prefix ? subFieldName.clubbedDelimiter : fieldName.clubbedDelimiter;
    obj1[previewScreenStr] = fieldName.previewScreen;
    obj1[dynamicCriteriaStr] = fieldName.dynamicCriteria;
    obj1[groupChildrenStr] = fieldName.prefix ? subFieldName.groupChildren : fieldName.groupChildren;
    obj1[groupheadStr] = fieldName.prefix ? subFieldName.grouphead : fieldName.grouphead;
    obj1[groupSubHeaderStr] = fieldName.prefix ? subFieldName.groupSubHeaderText : fieldName.groupSubHeaderText;
    obj1[previewSingleRowStr] = fieldName.prefix ? subFieldName.previewSingleRow : fieldName.previewSingleRow;
    obj1[sourceStr] = fieldName.source;
    obj1[modeStr] = fieldName.mode;
    obj1[tabSectionStr] = fieldName.tabSection;
    obj1[hideGrpHeaderInView] = fieldName.hideGrpHeaderInView ? fieldName.hideGrpHeaderInView : false;
    obj1[previousReadOnly] = fieldName.prefix ? subFieldName.previousReadOnly : fieldName.previousReadOnly;
    obj1[amendNarrativeClubStr] = fieldName.prefix ? subFieldName.amendNarrativeClub : fieldName.amendNarrativeClub;
    obj1[amendNarrativeGroupStr] = fieldName.prefix ? subFieldName.amendNarrativeGroup : fieldName.amendNarrativeGroup;
    obj1[amendPreviewStyleStr] = fieldName.prefix ? subFieldName.amendPreviewStyle : fieldName.amendPreviewStyle;
    return obj1;
  }

  setShowLabel(type: string) {
    switch (type) {
      case FccGlobalConstant.inputRadio:
      case FccGlobalConstant.inputRadioCheck:
      case FccGlobalConstant.selectButton:
      case FccGlobalConstant.inputDropdown:
        return false;
        break;
      default:
        return true;
        break;
    }
    return true;
  }

  setFieldControl(form: FCCFormGroup, fieldName: any, subFieldName: any, fieldtype: any) {
    let layoutClass;
    let styleClass;
    let showFieldLabel;
    let fieldValueType;
    let labelStyleClass;
    let valueStyleClass;
    let hideGrpHeaderInViewModes;
    const fieldHeader = fieldName.prefix ? subFieldName : fieldName;
    const mode = this.commonService.getQueryParametersFromKey('mode');
    const operation = this.commonService.getQueryParametersFromKey('operation');
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    for (const value of fieldName.applicableScreens) {
      if (value.option !== FccGlobalConstant.TEMPLATE) {
        labelStyleClass = value.labelStyleClass ? value.labelStyleClass : fieldHeader.labelStyleClass;
        valueStyleClass = value.valueStyleClass ? value.valueStyleClass : fieldHeader.valueStyleClass;
        layoutClass = value.layout ? value.layout : fieldHeader.layoutClass;
        styleClass = value.style ? value.style : fieldHeader.styleClass;
        showFieldLabel = value.showLabel;
        if (value.hideGrpHeaderInViewModes) {
          hideGrpHeaderInViewModes = value.hideGrpHeaderInViewModes;
          for (const applicableMode of hideGrpHeaderInViewModes) {
            if (mode && mode === applicableMode) {
              if ((operation && operation === FccGlobalConstant.PREVIEW) || (mode === FccGlobalConstant.EXISTING) ||
              (mode === FccGlobalConstant.DRAFT_OPTION && tnxTypeCode === '03')) {
                fieldName.hideGrpHeaderInView = true;
              }
            }
          }
        }
        fieldValueType = value.fieldValueType;
        if (value.rendered !== undefined) {
          fieldName.rendered = value.rendered;
        }
      }
    }
    const showLabelVal = showFieldLabel !== undefined ? showFieldLabel : this.setShowLabel(fieldtype);
    const sourceStr = 'source';
    const fieldObj = this.jsonObject(fieldHeader.name, fieldValueType, layoutClass, styleClass, showLabelVal, fieldName,
      labelStyleClass, valueStyleClass);
    fieldObj[sourceStr] = fieldName.source;
    const hideGrpHeader = 'hideGrpHeaderInView';
    fieldObj[hideGrpHeader] = fieldName.hideGrpHeaderInView;
    if (showLabelVal) {
      form.addControl(fieldHeader.name, this.getControl(fieldObj));
    }
    this.setValueControl(form, fieldName, subFieldName);
  }

  setViewSubSectionFieldControl(form: FCCFormGroup, fieldName: any, subFieldName: any, fieldtype: any) {
    let layoutClass;
    let styleClass;
    let showFieldLabel;
    const fieldHeader = fieldName.prefix ? subFieldName : fieldName;
    const headerName = `${fieldName.prefix}Header`;
    for (const value of fieldName.applicableScreens) {
      if (value.option !== FccGlobalConstant.TEMPLATE) {
        layoutClass = value.layout ? value.layout : fieldHeader.layoutClass;
        styleClass = value.style ? value.style : fieldHeader.styleClass;
        showFieldLabel = value.showLabel;
      }
    }
    let showLabelVal = showFieldLabel !== undefined ? showFieldLabel : this.setShowLabel(fieldtype);

    if (subFieldName.name === headerName) {
      showLabelVal = true;
      layoutClass = this.LAYOUT_VALUE;
      styleClass = 'viewModeSubHeader';
      const fieldObj = this.subSectionJsonObject(
        fieldHeader.name, fieldtype, layoutClass, styleClass, showLabelVal, fieldName, subFieldName);
      form.addControl(fieldHeader.name, this.getControl(fieldObj));
    } else {
      this.setValueControl(form, fieldName, subFieldName);
    }
  }

  setValueControl(form: FCCFormGroup, fieldName: any, subFieldName: any) {
    let fieldValue: any;
    let layoutClass: any;
    let styleClass: any;
    let labelStyleClass: any;
    let valueStyleClass: any;
    let showFieldLabel: any;
    let fieldValueType: any;
    let parentStyleClass: any;
    let showViewModeLabel: any;
    if (!fieldName.prefix) {
      fieldValue = this.commonService.getMasterData(subFieldName);
      fieldValue = (fieldValue === null || fieldValue === undefined) ? ' ' : fieldValue;
      for (const value of fieldName.applicableScreens) {
        if (value.option !== FccGlobalConstant.TEMPLATE) {
          layoutClass = value.layout ? value.layout : this.layoutClassCol6;
          styleClass = value.style ? value.style : 'fieldvalue';
          labelStyleClass = value.labelStyleClass;
          valueStyleClass = value.valueStyleClass;
          showFieldLabel = value.showLabel;
          fieldValueType = value.fieldValueType;
          parentStyleClass = value.parentStyleClass;
          showViewModeLabel = value.showViewModeLabel !== undefined ? value.showViewModeLabel : true;
          this.setFieldRendered(value, fieldName);
        }
      }
    } else {
      fieldValue = this.commonService.getMasterData(subFieldName.name);
      fieldValue = (fieldValue === null || fieldValue === undefined) ? ' ' : fieldValue;
      layoutClass = fieldName.applicableScreens[0].layout ? `${subFieldName.layoutClass} ${fieldName.applicableScreens[0].layout}` :
                    subFieldName.layoutClass;
      styleClass = 'fieldvalue';
      fieldValueType = fieldName.applicableScreens[0].fieldValueType;
      showViewModeLabel = fieldName.applicableScreens[0].showViewModeLabel !== undefined ?
        fieldName.applicableScreens[0].showViewModeLabel : true;
    }
    if (fieldValue) {
      const jsonObj = {};
      jsonObj[this.fieldValueTypeKey] = fieldValueType;
      jsonObj[this.fieldNameKey] = fieldName;
      jsonObj[this.layoutClassKey] = layoutClass;
      jsonObj[this.styleClassKey] = styleClass;
      jsonObj[this.labelStyleClassKey] = labelStyleClass;
      jsonObj[this.valueStyleClassKey] = valueStyleClass;
      jsonObj[this.showFieldLabelKey] = showFieldLabel;
      jsonObj[this.fieldValueKey] = fieldValue;
      jsonObj[this.formKey] = form;
      jsonObj[this.subFieldNameKey] = subFieldName;
      jsonObj[this.parentStyleClassKey] = parentStyleClass;
      jsonObj[this.showViewModeLabelKey] = showViewModeLabel;
      this.addControlBasedOnFieldControl(jsonObj);
    }
  }

  private setFieldRendered(value: any, fieldName: any) {
    if (value.rendered !== undefined) {
      fieldName.rendered = value.rendered;
    }
  }

  private addControlBasedOnFieldControl(jsonObj: any) {
    let valObj: any;
    const fieldValueType = jsonObj[this.fieldValueTypeKey];
    const fieldName = jsonObj[this.fieldNameKey];
    const layoutClass = jsonObj[this.layoutClassKey];
    const styleClass = jsonObj[this.styleClassKey];
    const labelStyleClass = jsonObj[this.labelStyleClassKey];
    const valueStyleClass = jsonObj[this.valueStyleClassKey];
    const showFieldLabel = jsonObj[this.showFieldLabelKey];
    const fieldValue = jsonObj[this.fieldValueKey];
    const form = jsonObj[this.formKey];
    const subFieldName = jsonObj[this.subFieldNameKey];
    const parentStyleClass = jsonObj[this.parentStyleClassKey];
    const showViewModeLabel = jsonObj[this.showViewModeLabelKey];
    if (fieldValueType === FccGlobalConstant.inputTextArea) {
      valObj = this.viewModeJsonObject(fieldName.name, fieldValueType,
        layoutClass, [styleClass], '', showFieldLabel, fieldName, fieldValue);
      form.addControl(fieldName.name, this.getControl(valObj));
    } else if (fieldValueType === 'view-mode') {
      const fieldHeader = fieldName.prefix ? subFieldName.name : fieldName.name;
      valObj = this.viewModeJsonObject(fieldHeader, fieldValueType,
        layoutClass, [styleClass], parentStyleClass, showViewModeLabel, fieldName, fieldValue, subFieldName,
        labelStyleClass, valueStyleClass);
      form.addControl(fieldHeader, this.getControl(valObj));
    } else if (fieldValueType === FccGlobalConstant.viewModeSelect) {
      const fieldHeader = fieldName.prefix ? subFieldName.name : fieldName.name;
      valObj = this.viewModeJsonObject(fieldHeader, fieldValueType,
        layoutClass, [styleClass], parentStyleClass, showViewModeLabel, fieldName, fieldValue);
      form.addControl(fieldHeader, this.getControl(valObj));
    }
  }

  setEditModeValueControl(form: FCCFormGroup, fieldName: any, subFieldName: any) {
    for (const value of fieldName.applicableScreens) {
      if (fieldName.layoutClass && value.layout) {
        fieldName.layoutClass = value.layout;
      }
      if (fieldName.styleClass && value.style) {
        fieldName.styleClass = value.style;
      }
      if (value.rendered !== undefined) {
        fieldName.rendered = value.rendered;
      }
      if (value.required !== undefined) {
        fieldName.required = value.required;
      }
    }
    const fieldHeader = fieldName.prefix ? subFieldName.name : fieldName.name;
    form.addControl(fieldHeader, this.getControl(fieldName));
  }

  setRequiredParam(form: FCCFormGroup, fieldName: any, subFieldName: any) {
    const option = this.commonService.getQueryParametersFromKey('option');
    for (const value of fieldName.applicableScreens) {
      if ( value.option === option && value.required !== undefined) {
        fieldName.required = value.required;
      }
    }
    const fieldHeader = fieldName.prefix ? subFieldName.name : fieldName.name;
    if (fieldHeader && fieldName) {
      const control = this.getControl(fieldName);
      if (control){
        form.addControl(fieldHeader, control);
      }
    }
  }
  /**
   * Used to build subsections.
   */
  buildSection(form: FCCFormGroup, field: any) {
   const subsectionModel = JSON.parse(JSON.stringify(this.formModelService.getSubSectionModel()));
    // const subsectionModel = new SubsectionModel();
    // console.log(JSON.stringify(new SubsectionModel()));
   if (field.sectionType === 'prevNextModel') {
      this.getPrevNextControls(field, form);
    } else if (field.sectionType === 'spacerModel') {
      this.getSpacerSectionControls(field, subsectionModel[field.sectionType], form);
    } else {
      this.getSubSectionControls(field, subsectionModel[field.sectionType], form);
    }
  }

  getPrevNextControls(field, form) {
    field.buttons.forEach(buttonType => {
    const obj = this.prevNextService.buildPrevNextSection(form, buttonType);
    form.addControl(buttonType, this.getControl(obj));
    });
  }
  /**
   * Controls for specific fields are built based on the type of the field.
   */
  getControl(field: any, enrichFlag = false) {
    this.isStepperDisabled = this.commonService.isStepperDisabled === true ? true : false;
    let control: AbstractControl;
    switch (field.type) {
      case 'highlight-texteditor':
        control = this.getHighlightTextEditorControl(field);
        break;
      case 'select-button':
        control = this.getSelectButtonControl(field);
        break;
      case 'input-date':
        control = this.getDateControl(field,enrichFlag);
        break;
      case 'input-backdate':
        control = this.getBackDateControl(field);
        break;
      case 'input-cb':
        control = this.getCheckBoxControl(field);
        break;
      case 'checkbox':
        control = this.getMatCheckBoxControl(field,enrichFlag);
        break;
      case 'input-dropdown':
      control = this.getDropDownControl(field);
      break;
      case 'input-radio':
      control = this.getRadioButtonControl(field, enrichFlag);
      break;
      case 'input-radio-check':
      control = this.getRadioCheckButtonControl(field);
      break;
      case 'input-text':
      control = this.getInputTextControl(field,enrichFlag);
      break;
      case 'fcc-currency':
        control = this.getFccCurrencyControl(field);
        break;
      case 'input-password':
      control = this.getInputPasswordControl(field);
      break;
      case 'button-div':
      control = this.getDivControl(field);
      break;
      case 'input-dropdown-filter':
      control = this.getDropDownFilterControl(field);
      break;
      case 'input-switch':
      control = this.getSwitchControl(field);
      break;
      case 'spacer':
      control = new SpacerControl(this.translateService, { layoutClass: field.layoutClass,
        rendered: field.rendered !== undefined ? field.rendered : true });
      break;
      case 'text':
      control = this.getTextControl(field);
      break;
      case 'summary-text':
      control = this.getSummaryTextControl(field);
      break;
      case 'view-mode':
      control = this.getViewModeControl(field);
      break;
      case 'text-value':
      control = this.getTextValueControl(field);
      break;
      case FccGlobalConstant.viewModeSelect:
      control = this.getSelectViewModeControl(field);
      break;
      case 'narrative-textarea':
      control = this.getNarrativeTextAreaControl(field);
      break;
      case 'editor':
      control = this.getEditorControl(field);
      break;
      case 'amend-narrative-textarea':
      control = this.getAmendNarrativeTextAreaControl(field);
      break;
      case 'input-textarea':
      control = this.getInputTextareaControl(field);
      break;
      case 'input-table':
      control = this.getTableControl(field);
      break;
      case 'edit-table':
        control = this.getEditTableControl(field);
        break;
      case 'exchange-rate':
        control = this.getExchangeRateControl(field);
        break;
      case 'carousel-view':
         control = this.getCarouselViewControl(field);
         break;
      case 'threeDots-button':
        control = this.getThreeDotsButtonControl(field);
        break;
      case 'fees-and-charges':
        control = this.getFeeAndChargeTableControl(field);
        break;
      case 'rounded-button':
        control = this.getRoundedButtonControl(field);
        break;
      case 'fileUpload-dragdrop':
        control = this.getDragDropControl(field);
        break;
      case 'fileUpload':
        control = this.getFileUploadControl(field);
        break;
      case 'tabbedPanel':
        control = new TabControl(field.name, this.translateService, { tabs: this.getTabsValue(field), dir: localStorage.getItem('langDir'),
        valueStyleClass: 'dynamicCompStyle', rendered: ( field.rendered !== undefined ? field.rendered : true) });
        break;
      case 'icon':
        control = this.getInputIconControl(field);
        break;
      case 'expansion-panel':
        control = this.getExpansionPanelControl(field);
        break;
      case 'button':
        control = this.getButtonControl(field);
        break;
      case 'accordion':
        control = this.getAccordionControl(field);
        break;
      case 'timer':
        control = this.getTimerControl(field);
        break;
      case FccGlobalConstant.MAT_CARD:
        control = this.getMatCardControl(field);
        break;
      case 'json-obj':
        control = this.getJSONObjControl(field);
        break;
      case FccGlobalConstant.FORM_TABLE:
        control = this.getFormTableControl(field);
        break;
      case 'form-accordion-panel':
        control = this.getFormAccordionPanelControl(field);
        break;
      case 'expansion-panel-table':
        control = this.getExpansionPanelTableControl(field);
        break;
      case 'input-auto-comp':
        control = this.getMatAutoCompControl(field);
        break;
      case 'card-view':
        control = this.getCardViewControl(field);
        break;
      case 'text-comparison':
        control = this.getTextComparisonControl(field);
        break;
      case 'input-counter':
        control = this.getCalendarDateCOntrol(field);
        break;
      case 'expansion-panel-edit-table':
        control = this.getExpansionPanelEditTableControl(field);
        break;
      case 'expansion-panel-edit-form-table':
        control = this.getExpansionPanelEditFormTableControl(field);
        break;
      case 'card-summary':
        control = this.getCardSummaryControl(field);
        break;
      case 'fcc-file-viewer':
        control = this.getFCCFileViewerControl(field);
        break;
      case 'input-multiselect':
        control = this.getMultiSelectControl(field);
        break;
      case 'input-date-range':
        control = this.getDateRangeControl(field);
        break;
      case 'fcc-list-box':
        control = this.getFCCListBoxControl(field);
        break;
      case 'progress-bar':
        control = this.getProgressBar(field);
        break;
      default:
        break;
    }
    return control;
  }
  getPermissionValidation(permission: any){
    let val: boolean;
    let permissionFlag = true;
    Object.keys(permission).forEach(index => {
      val = this.commonService.getUserPermissionFlag(permission[index]);
      if (!val){
        permissionFlag = false;
      }
    });
    return permissionFlag;
  }
  getTabsValue(field) {
    const tabArray = [];
    for (let i = 0; i < field.tabs.length ; i++) {
      const objKey = Object.keys(field.tabs[i]);
      const keyOf = objKey[FccGlobalConstant.LENGTH_0];
      const componentKey = keyOf;
      const controlValueKey = objKey[FccGlobalConstant.LENGTH_2];
      const controlNameValue = field.tabs[i][controlValueKey];
      const objOfObj = field.tabs[i][keyOf];
      const passObj: TabObject = { templateHeader : `${this.translateService.instant(componentKey)}` , templateName: componentKey,
      templateData: objOfObj, controlName: controlNameValue };
      tabArray.push(passObj);
    }
    return tabArray;
  }

  protected getFileUploadControl(field) {
    const control: AbstractControl = new FileUploadControl('filebrowseButton',
      this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      layoutClass: field.layoutClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      previewScreen: field.previewScreen,
      uploadLabel: `${this.translateService.instant(field.uploadLabel)}`,
      chooseLabel: `${this.translateService.instant(field.chooseLabel)}`,
      cancelLabel: `${this.translateService.instant(field.cancelLabel)}`
    });
    return control;
  }

  protected getMultiSelectControl(element) {
    const control = new MultiSelectFormControl(element.name, element.value, this.translateService, {
      placeholder: `${this.translateService.instant(element.localizationkey)}`,
      options: element.options,
      layoutClass: element.layoutClass,
      styleClass: 'triggerIcon',
      rendered: true,
      maxSelectLabels: 1,
      srcElementId: element.name,
      productCode: element.productCode
    });
    return control;
  }

  protected getDateRangeControl(field) {
    const today = new Date();
    const thresholdDate = new Date();
    const maxDate = thresholdDate.setDate(today.getDate() - parseInt(sessionStorage.getItem('thresholdSearchPeriod')));
    const control: AbstractControl = new InputDateRangeControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      disableMinDate: field.disableMinDate,
      enableMaxDate : field.enableMaxDate,
      minDate: (field.disableMinDate !== undefined && field.disableMinDate) ? new Date(maxDate) : new Date(),
      maxDate: (field.enableMaxDate !== undefined && field.enableMaxDate) ? new Date() : null,
      layoutClass: this.getLayoutClass(field.layoutClass),
      styleClass: field.styleClass,
      readonly: field.readonly,
      displayInfoIcon: field.displayInfoIcon,
      rendered: field.rendered !== undefined ? field.rendered : true,
      required: field.required !== undefined ? field.required : false,
      holidayList: field.holidayList !== undefined ? field.holidayList : '',
      source: field.source,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      maxlength: this.utilityService.getDisplayDateFormat().length,
      displayPreview: field.displayPreview !== undefined ? field.displayPreview : false,
      dynamicCriteria: field.dynamicCriteria,
      placeholder: this.utilityService.getDisplayDateFormat(),
      langLocale: this.localeService.getCalendarLocaleJson(localStorage.getItem('language')),
      dateFormat: this.localeService.getDateLocaleJson(localStorage.getItem('language')).dateFormat,
      groupHeaderForLabel: field.groupHeaderForLabel !== undefined ? field.groupHeaderForLabel : undefined,
      fullWidthView: field.fullWidthView !== undefined ? field.fullWidthView : undefined
    }, field.pdfStyles);
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getDragDropControl(field) {
    const control: AbstractControl = new FileUploadDragDropControl(field.name,
      this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      layoutClass: field.layoutClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      previewScreen: field.previewScreen,
      key: field.name
    });
    return control;
  }
  protected getProgressBar(field) {
    const control: AbstractControl = new ProgressBarControl(field.name,
      field.value,
      this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      layoutClass: field.layoutClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      previewScreen: field.previewScreen,
      key: field.name
    }
    );
    return control;
  }
  protected getRoundedButtonControl(field) {
    const control: AbstractControl = new RoundedButtonControl(field.name, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      layoutClass: this.getLayoutClass(field.layoutClass),
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      btndisable: field.btndisable,
      nudgeKey: field.nudgeKey,
      previewScreen: field.previewScreen === false ? false : true,
    });
    return control;
  }

  protected getTableControl(field) {
    const control: AbstractControl = new TableControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      layoutClass: field.layoutClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      columns: field.columns,
      data: field.data,
      previewScreen: field.previewScreen === false ? false : true,
      bankAttachmentPreview : field.bankAttachmentPreview,
      showLabelView: field.showLabelView === true ? true : false,
      noDelete: field.noDelete,
      noDownload: field.noDownload ? field.noDownload : false,
      previewTableStyle: field.previewTableStyle,
      emptyMessaage: field.emptyMessaage,
      noPreviewActions: field.noPreviewActions,
      edit: field.edit ? field.edit : false,
      retrieveIndividualCrossRefs: field.retrieveIndividualCrossRefs ? field.retrieveIndividualCrossRefs : false,
      pdfFieldType: field.pdfFieldType
    });
    return control;
  }

  protected getFeeAndChargeTableControl(field) {
    const control: AbstractControl = new TableControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      layoutClass: field.layoutClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      columns: field.columns,
      data: field.data,
      previewScreen: field.previewScreen,
      showLabelView: field.showLabelView === true ? true : false,
      isResponseArray: field.isResponseArray
    });
    return control;
  }

  protected getEditTableControl(field) {
    const control: AbstractControl = new EditTableControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      layoutClass: field.layoutClass,
      key: field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      columns: field.columns,
      data: field.data,
      sessionCols: field.sessionCols,
      subControlsDetails: field.subControlsDetails,
      OverDrawStatus: field.OverDrawStatus,
      tnsAmountStatus: field.tnsAmountStatus,
      options:  field.options,
      message1: field.message1,
      message2: field.message2,
      actions: field.actions,
      columnsHeaderData: field.columnsHeaderData,
      previewScreen: field.previewScreen,
      showLabelView: field.showLabelView === true ? true : false,
      bankAttachmentPreview : field.bankAttachmentPreview,
      maxDate: (field.enableMaxDate !== undefined && field.enableMaxDate) ? new Date() : null,
      showDatePicker: true,
      tableHeader: field.tableHeader,
      applyColumnStyle: field.applyColumnStyle !== undefined ? field.applyColumnStyle : true,
      previewScreenViewAction : field.previewScreenViewAction,
      loadListDef : this.isLoadListDef(field)
    });
    return control;
  }

  protected getExchangeRateControl(field) {
    const control: AbstractControl = new ExchangeRateControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      layoutClass: field.layoutClass,
      key: field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      data: field.data,
      subControlsDetails: field.subControlsDetails,
      options:  field.options,
      message1: field.message1,
      message2: field.message2,
      previewScreen: field.previewScreen,
      showLabelView: field.showLabelView === true ? true : false,
      maxDate: (field.enableMaxDate !== undefined && field.enableMaxDate) ? new Date() : null,
      previewScreenViewAction : field.previewScreenViewAction
    });
    return control;
  }

  protected getCarouselViewControl(field) {
    const control: AbstractControl = new CarouselViewControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      listdefName: field.listdefName,
      layoutClass: field.layoutClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      data: field.data,
      previewScreen: field.previewScreen === false ? false : true
    });
    return control;
  }

  protected getThreeDotsButtonControl(field) {
    const control: AbstractControl = new ThreeDotsButtonControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      listdefName: field.listdefName,
      layoutClass: field.layoutClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      data: field.data,
      previewScreen: field.previewScreen === false ? false : true
    });
    return control;
  }

  isLoadListDef(field){
    if(!this.commonService.isEmptyValue(field.applicableScreens)) {
      for (const value of field.applicableScreens){
        if(this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION) === value.operation){
          return value.loadListDef;
        }
      }
    } else if(!this.commonService.isEmptyValue(field.loadListDef)) {
      return field.loadListDef;
    }
  }

  protected getInputTextareaControl(field) {
    const control: AbstractControl = new InputTextareaControl(field.name, '', this.translateService, {
    label: `${this.translateService.instant(field.name)}`,
    key: field.name,
    grouphead: field.grouphead,
    directive: field.directive !== undefined ? field.directive : true,
    allowedCharCount: field.allowedCharCount,
    rows: field.rows,
    cols: field.cols,
    fieldSize: field.fieldSize,
    maxlength: field.maxlength,
    styleClass: field.styleClass,
    layoutClass: this.getLayoutClass(field.layoutClass),
    validators: field.validators,
    rendered: field.rendered !== undefined ? field.rendered : true,
    required: field.required !== undefined ? field.required : false,
    clubbedHeaderText: field.clubbedHeaderText,
    clubbedList: field.clubbedList,
    previewScreen: field.previewScreen === false ? false : true,
    clubbedDelimiter: field.clubbedDelimiter,
  });
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getNarrativeTextAreaControl(field) {
    const control: AbstractControl = new NarrativeTextareaControl(field.name, field.value, this.translateService, {
    label: field.showLabel === false ? '' : `${this.translateService.instant(field.name)}`,
    key: field.name,
    grouphead: field.grouphead,
    rendered: field.rendered !== undefined ? field.rendered : true,
    swift: field.swift,
    fieldSize: field.fieldSize,
    maxRowCount: field.maxRowCount,
    enteredCharCount: field.enteredCharCount,
    disableNextLineCharCount: field.disableNextLineCharCount,
    rowCount: field.rowCount,
    rows: field.rows,
    cols: field.cols,
    start: field.start,
    textAreaClass: field.textAreaClass,
    startClass: field.startClass,
    clearIconClass: field.clearIconClass,
    allowedCharCount: field.allowedCharCount,
    maxlength: field.maxlength,
    styleClass: field.styleClass,
    layoutClass: this.getLayoutClass(field.layoutClass),
    readonly: field.readonly !== undefined ? field.readonly : false,
    required: field.required !== undefined ? field.required : false,
    showLabel: field.showLabel !== undefined ? field.showLabel : true,
    hintTextControl: field.hintTextControl !== undefined ? field.hintTextControl : false,
    hintText: field.hintText !== undefined ? `${this.translateService.instant(field.hintText)}` : '',
    clubbedHeaderText: field.clubbedHeaderText,
    clubbedList: field.clubbedList,
    showValidationMessage: field.showValidationMessage === undefined ? true : field.showValidationMessage,
    previewScreen: field.previewScreen === false ? false : true,
    displayPreview: field.displayPreview !== undefined ? field.displayPreview : false,
    mode: field.mode,
    previousReadOnly: field.previousReadOnly !== undefined ? field.previousReadOnly : false,
    phraseEnabled: field.phraseEnabled !== undefined ? field.phraseEnabled : false,
    phraseIconStyle: field.phraseIconStyle,
    groupSubHeaderText: field.groupSubHeaderText,
    previewSingleRow: field.previewSingleRow !== undefined ? field.previewSingleRow : false,
    amendNarrativeClub: field.amendNarrativeClub !== undefined ? field.amendNarrativeClub : false,
    inquiryMap: field.inquiryMap !== undefined ? field.inquiryMap : false,
    narrativePDF: field.narrativePDF !== undefined ? field.narrativePDF : false,
    narrativePDFRender: field.narrativePDFRender !== undefined ? field.narrativePDFRender : false,
    amendNarrativeGroup: field.amendNarrativeGroup !== undefined ? field.amendNarrativeGroup : false,
    amendSpecificField: field.amendSpecificField !== undefined ? field.amendSpecificField : false,
    amendPreviewStyle: field.amendPreviewStyle,
    noValueOnEventLoad: field.noValueOnEventLoad !== undefined ? field.noValueOnEventLoad : false,
    groupHeaderForLabel: field.groupHeaderForLabel !== undefined ? field.groupHeaderForLabel : undefined,
    hideGrpHeaderInView: field.hideGrpHeaderInView !== undefined ? field.hideGrpHeaderInView : false,
    isNotRequiredForComparison: field.isNotRequiredForComparison !== undefined ? field.isNotRequiredForComparison : false,
    dynamicCriteria: field.dynamicCriteria,
    tabSection: field.tabSection,
    applicableValidation: field.applicableValidation,
    fullWidthView: field.fullWidthView,
    resize: field.resize === false ? false : true
  });
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getEditorControl(field) {
    const control: AbstractControl = new EditorControl(field.name, field.value, this.translateService, {
    label: field.showLabel === false ? '' : `${this.translateService.instant(field.name)}`,
    key: field.name,
    grouphead: field.grouphead,
    rendered: field.rendered !== undefined ? field.rendered : true,
    swift: field.swift,
    fieldSize: field.fieldSize,
    maxRowCount: field.maxRowCount,
    enteredCharCount: field.enteredCharCount,
    disableNextLineCharCount: field.disableNextLineCharCount,
    rowCount: field.rowCount,
    rows: field.rows,
    cols: field.cols,
    start: field.start,
    textAreaClass: field.textAreaClass,
    startClass: field.startClass,
    clearIconClass: field.clearIconClass,
    allowedCharCount: field.allowedCharCount,
    maxlength: field.maxlength,
    styleClass: field.styleClass,
    layoutClass: field.layoutClass,
    readonly: field.readonly !== undefined ? field.readonly : false,
    required: field.required !== undefined ? field.required : false,
    showLabel: field.showLabel !== undefined ? field.showLabel : true,
    hintTextControl: field.hintTextControl !== undefined ? field.hintTextControl : false,
    hintText: field.hintText !== undefined ? `${this.translateService.instant(field.hintText)}` : '',
    clubbedHeaderText: field.clubbedHeaderText,
    clubbedList: field.clubbedList,
    showValidationMessage: field.showValidationMessage === undefined ? true : field.showValidationMessage,
    previewScreen: field.previewScreen === false ? false : true,
    displayPreview: field.displayPreview !== undefined ? field.displayPreview : false,
    mode: field.mode,
    previousReadOnly: field.previousReadOnly !== undefined ? field.previousReadOnly : false,
    phraseEnabled: field.phraseEnabled !== undefined ? field.phraseEnabled : false,
    phraseIconStyle: field.phraseIconStyle,
    groupSubHeaderText: field.groupSubHeaderText,
    previewSingleRow: field.previewSingleRow !== undefined ? field.previewSingleRow : false,
    amendNarrativeClub: field.amendNarrativeClub !== undefined ? field.amendNarrativeClub : false,
    inquiryMap: field.inquiryMap !== undefined ? field.inquiryMap : false,
    narrativePDF: field.narrativePDF !== undefined ? field.narrativePDF : false,
    narrativePDFRender: field.narrativePDFRender !== undefined ? field.narrativePDFRender : false,
    amendNarrativeGroup: field.amendNarrativeGroup !== undefined ? field.amendNarrativeGroup : false,
    amendSpecificField: field.amendSpecificField !== undefined ? field.amendSpecificField : false,
    amendPreviewStyle: field.amendPreviewStyle,
    noValueOnEventLoad: field.noValueOnEventLoad !== undefined ? field.noValueOnEventLoad : false,
    dynamicCriteria: field.dynamicCriteria,
    tabSection: field.tabSection,
    fullWidthView: field.fullWidthView,
    config: field.config,
    htmlContent: field.htmlContent
  });
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getAmendNarrativeTextAreaControl(field) {
    const control: AbstractControl = new AmendNarrativeTextareaControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      grouphead: field.grouphead,
      rendered: field.rendered !== undefined ? field.rendered : true,
      swift: field.swift,
      fieldSize: field.fieldSize,
      maxRowCount: field.maxRowCount,
      enteredCharCount: field.enteredCharCount,
      rowCount: field.rowCount,
      rows: field.rows,
      cols: field.cols,
      start: field.start,
      textAreaClass: field.textAreaClass,
      startClass: field.startClass,
      clearIconClass: field.clearIconClass,
      allowedCharCount: field.allowedCharCount,
      maxlength: field.maxlength,
      styleClass: field.styleClass,
      layoutClass: field.layoutClass,
      previewScreen: field.previewScreen === false ? false : true,
      mode: field.mode,
      groupSubHeaderText: field.groupSubHeaderText,
      previewSingleRow: field.previewSingleRow !== undefined ? field.previewSingleRow : false,
      amendNarrativeClub: field.amendNarrativeClub !== undefined ? field.amendNarrativeClub : false,
      inquiryMap: field.inquiryMap !== undefined ? field.inquiryMap : false,
      narrativePDF: field.narrativePDF !== undefined ? field.narrativePDF : false,
      narrativePDFRender: field.narrativePDFRender !== undefined ? field.narrativePDFRender : false,
      amendPreviewStyle: field.amendPreviewStyle,
      amendTabbedPanel: field.amendTabbedPanel !== undefined ? field.amendTabbedPanel : false,
      fullWidthView: field.fullWidthView,
      inputType: field.inputType === false ? false : true,
      typeOfRegex: field.typeOfRegex
    });
    return control;
  }

  protected getExpansionPanelControl(field) {
    const control: AbstractControl = new ExpansionPanelControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      layoutClass: field.layoutClass,
      styleClass: field.styleClass,
      buttonDivClass: field.buttonDivClass,
      openAll: field.openAll,
      openAllClass: field.openAllClass,
      openAllIcon: field.openAllIcon,
      openAllSvg: field.openAllSvg,
      openAllAltText: field.openAllAltText,
      expandLabel: field.expandLabel,
      closeAll: field.closeAll,
      closeAllClass: field.closeAllClass,
      closeAllIcon: field.closeAllIcon,
      closeAllSvg: field.closeAllSvg,
      closeAllAltText: field.closeAllAltText,
      collapseLabel: field.collapseLabel,
      imgID: field.imgID,
      accordionClass: field.accordionClass,
      multi: field.multi,
      disabled: field.disabled,
      headerDesc: field.headerDesc,
      options: field.options,
      noPanelMsg: field.noPanelMsg,
      previewScreen: field.previewScreen,
      previewSingleRow: field.previewSingleRow !== undefined ? field.previewSingleRow : false,
      amendNarrativeClub: field.amendNarrativeClub !== undefined ? field.amendNarrativeClub : false,
      inquiryMap: field.inquiryMap !== undefined ? field.inquiryMap : false,
      narrativePDF: field.narrativePDF !== undefined ? field.narrativePDF : false,
      narrativePDFRender: field.narrativePDFRender !== undefined ? field.narrativePDFRender : false,
      amendPreviewStyle: field.amendPreviewStyle,
      amendTabbedPanel: field.amendTabbedPanel !== undefined ? field.amendTabbedPanel : false
    });
    return control;
  }

  protected getTextControl(field) {
    const control: AbstractControl = new TextControl(field.name, this.translateService, this.setTextControlFields(field) , field.pdfStyles);
    return control;
  }

  protected setTextControlFields(field): any {
    return {
      label: field.showLabel === false ? '' : field.nolocalization ? field.name : `${this.translateService.instant(field.name)}`,
     rendered: field.rendered !== undefined ? field.rendered : true,
      key: field.name,
      layoutClass: field.layoutClass,
      hideControl: field.hideControl,
      styleClass: field.styleClass,
      enteredCharCount: field.enteredCharCount,
      allowedCharCount: field.allowedCharCount,
      required: field.required !== undefined ? field.required : false,
      swift: field.swift,
      fieldSize: field.fieldSize,
      itemId: field.itemId,
      parentStyleClass: field.parentStyleClass,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      clubbedDelimiter: field.clubbedDelimiter,
      tabSection: field.tabSection,
      dynamicCriteria: field.dynamicCriteria,
      hideGrpHeaderInView: field.hideGrpHeaderInView,
      fullWidthView: field.fullWidthView,
      tabIndex: field.tabIndex,
      matIcon: field.matIcon,
      applicableValidation: field.applicableValidation,
      labelOnly: field.labelOnly === true ? true : false,
      dynamicHeaderLabel: field.dynamicHeaderLabel,
      translate: field.translate,
      translateValue: field.translateValue,
      isHyperLink: field.isHyperLink !== undefined ? field.isHyperLink : false
    };
  }

  protected getSummaryTextControl(field) {
    const control: AbstractControl = new SummaryTextControl(
      field.name,
      this.translateService,
      this.setTextControlFields(field),
      field.pdfStyles
    );
    return control;
  }

  protected getTextComparisonControl(field) {
    const control: AbstractControl = new TextComparisonControl(field.name, field.value, this.translateService, {
      label: field.showLabel === false ? '' : field.nolocalization ? field.name : `${this.translateService.instant(field.name)}`,
      rendered: field.rendered !== undefined ? field.rendered : true,
      key: field.name,
      layoutClass: field.layoutClass,
      hideControl: field.hideControl,
      styleClass: field.styleClass,
      enteredCharCount: field.enteredCharCount,
      allowedCharCount: field.allowedCharCount,
      swift: field.swift,
      fieldSize: field.fieldSize,
      itemId: field.itemId,
      parentStyleClass: field.parentStyleClass,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      clubbedDelimiter: field.clubbedDelimiter,
      tabSection: field.tabSection,
      dynamicCriteria: field.dynamicCriteria,
      hideGrpHeaderInView: field.hideGrpHeaderInView,
      fullWidthView: field.fullWidthView,
      labelOnly: field.labelOnly === true ? true : false
    }, field.pdfStyles);
    return control;
  }

  protected getViewModeControl(field) {
    const control: AbstractControl = new ViewModeControl(field.name, field.value, this.translateService, {
      label: field.showLabel === false ? '' : `${this.translateService.instant(field.name, field.interpolateParams)}`,
      rendered: field.rendered !== undefined ? field.rendered : true,
      key: field.name,
      layoutClass: this.getLayoutClass(field.layoutClass, field.name),
      styleClass: field.styleClass,
      showLabel: field.showLabel,
      labelStyleClass: field.labelStyleClass,
      valueStyleClass: field.valueStyleClass,
      parentStyleClass: field.parentStyleClass,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      notRequiredForCompariosnIfEmpty: field.notRequiredForCompariosnIfEmpty !== undefined ? field.notRequiredForCompariosnIfEmpty : false,
      tabSection: field.tabSection === true ? true : false,
      clubbedDelimiter: field.clubbedDelimiter,
      fullWidthView: field.fullWidthView,
      dynamicCriteria: field.dynamicCriteria,
      previousReadOnly: field.previousReadOnly !== undefined ? field.previousReadOnly : false,
      stateServiceData: field.stateServiceData === true ? true : false,
      fieldIcon: field.fieldIcon,
      fieldIconTitle: field.fieldIconTitle,
      fieldIconStyle: field.fieldIconStyle,
      source: field.source,
      dynamicField: field.dynamicField !== undefined ? field.dynamicField : false,
      positionEnd: field.positionEnd !== undefined ? field.positionEnd : false,
      parentField: field.parentField,
      isNotRequiredForComparison: field.isNotRequiredForComparison !== undefined ? field.isNotRequiredForComparison : false
    }, field.pdfStyles);
    return control;
  }

  protected getTextValueControl(field) {
    const control: AbstractControl = new TextValueControl(field.name, field.value, this.translateService, {
      label: field.showLabel === false ? '' : `${this.translateService.instant(field.name)}`,
      rendered: field.rendered !== undefined ? field.rendered : true,
      key: field.name,
      layoutClass: this.getLayoutClass(field.layoutClass),
      styleClass: field.styleClass,
      showLabel: field.showLabel,
      labelStyleClass: field.labelStyleClass,
      valueStyleClass: field.valueStyleClass,
      parentStyleClass: field.parentStyleClass,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      tabSection: field.tabSection === true ? true : false,
      clubbedDelimiter: field.clubbedDelimiter,
      fullWidthView: field.fullWidthView,
      dynamicCriteria: field.dynamicCriteria,
      previousReadOnly: field.previousReadOnly !== undefined ? field.previousReadOnly : false
    });
    return control;
  }

  protected getSelectViewModeControl(field) {
    const control: AbstractControl = new SelectViewModeControl(field.name, '', this.translateService, {
      label: field.showLabel === false ? '' : `${this.translateService.instant(field.name)}`,
      key: field.name,
      options: this.getOptions(field.options, field.name),
      styleClass: field.styleClass,
      showLabel: field.showLabel,
      rendered: field.rendered !== undefined ? field.rendered : true,
      layoutClass: field.layoutClass,
      filter: true,
      filterBy: 'label,value.name',
      required: field.required !== undefined ? field.required : false,
      source: field.source,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      labelStyleClass: field.labelStyleClass,
      valueStyleClass: field.valueStyleClass,
      dynamicCriteria: field.dynamicCriteria,
      parentStyleClass: field.parentStyleClass,
      clubbedDelimiter: field.clubbedDelimiter,
      previousReadOnly: field.previousReadOnly !== undefined ? field.previousReadOnly : false
    });
    return control;
  }

  protected getSwitchControl(field: any) {
    const control: AbstractControl = new InputSwitchControl(field.name, field.defaultValue, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      layoutClass: this.getLayoutClass(field.layoutClass),
      styleClass: field.styleClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      source: field.source,
      previewScreen: field.previewScreen === false ? false : true,
      dynamicCriteria: field.dynamicCriteria,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      clubbedDelimiter: field.clubbedDelimiter,
      defaultValue: field.defaultValue,
      translate: field.translate,
      translateValue: field.translateValue,
      fullWidthView: field.fullWidthView,
      groupHeaderForLabel: field.groupHeaderForLabel !== undefined ? field.groupHeaderForLabel : undefined,
      valueOnly: field.valueOnly === true ? true : false,
      mapBooleanValue: field.mapBooleanValue === true ? true : false,
      provisionalRendered: field.provisionalRendered === true ? true : false,
      isAnyProvBankAvl: field.isAnyProvBankAvl === false ? false : true,
    });
    return control;
  }

  protected getDropDownFilterControl(field: any) {
    const defaultValue = this.commonService.isnonEMptyString(field.defaultValue) ? field.defaultValue : '';
    const isStaticAccountEnabled = this.commonService.getIsStaticAccountEnabled();
    const control: AbstractControl = new DropdownFilterFormControl(field.name, defaultValue, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      options: this.getOptions(field.options, field.name),
      styleClass: field.styleClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      layoutClass: this.getLayoutClass(field.layoutClass),
      filter: true,
      filterBy: field.filterBy !== undefined ? field.filterBy : 'label,value.name',
      required: field.required !== undefined ? field.required : false,
      source: field.source,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      codeID : field.codeID,
      isRequiredForAmendComparison: field.isRequiredForAmendComparison !== undefined ? field.isRequiredForAmendComparison : false,
      clubbedDelimiter: field.clubbedDelimiter,
      previewValueAttr: field.previewValueAttr,
      previewValConcatinated: field.previewValConcatinated,
      readonly: field.readonly,
      dynamicCriteria: field.dynamicCriteria,
      viewDisplay: field.viewDisplay,
      disabled: field.disabled !== undefined ? field.disabled : false,
      dropdownFilterClass: field.dropdownFilterClass,
      infoClass: field.infoClass !== undefined ? field.infoClass : 'p-col-3',
      labelClass: field.labelClass !== undefined ? field.labelClass : 'p-col-3',
      valueClass: field.valueClass !== undefined ? field.valueClass : 'p-col-9',
      defaultValue: defaultValue,
      noMarginBottom: field.noMarginBottom !== undefined ? field.noMarginBottom : true,
      isPackageRequired: field.isPackageRequired !== undefined ? field.isPackageRequired : false,
      type:field.type,
      dropdownAriaLabel: field.dropdownAriaLabel ?? '',
      shortDescription: field.shortDescription !== undefined ? field.shortDescription : '',
      changeEventFlag: field.changeEventFlag === true ? true : false,
      isStaticAccountEnabled: isStaticAccountEnabled === true ? true : false,
      accountLookup: field.accountLookup === true ? true : false,
      srcElementId: field.srcElementId
    });
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getDivControl(field: any) {
    const control: AbstractControl = new DivControl(field.name, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      rendered: field.rendered !== undefined ? field.rendered : true,
      [field.displayKey]: field.displayValue,
      layoutClass: this.getLayoutClass(field.layoutClass),
      styleClass : field.styleClass,
      parentStyleClass: field.parentStyleClass,
      key: field.name,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      btndisable: field.btndisable
    });
    return control;
  }

  protected getInputTextControl(field: any, enrichFlag = false) {
    const control: AbstractControl = new InputTextControl(enrichFlag ? field.code : field.name, field.defautValue, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      parentStyleClass: field.parentStyleClass,
      source: field.source,
      disabled: field.disabled !== undefined ? field.disabled : false,
      styleClass: field.styleClass,
      layoutClass: this.getLayoutClass(field.layoutClass),
      rendered: field.rendered !== undefined ? field.rendered : true,
      required: field.required !== undefined ? field.required : false,
      addHyperlinkWithInput: field.addHyperlinkWithInput !== undefined ? field.addHyperlinkWithInput : false,
      switchHyperlinkAndImg: field.switchHyperlinkAndImg !== undefined ? field.switchHyperlinkAndImg : false,
      switchImgPath: field.switchImgPath !== undefined ? field.switchImgPath : false,
      maxlength: field.maxlength,
      minlength: field.minlength,
      readonly: field.readonly !== undefined ? field.readonly : false,
      appearance: field.appearance !== undefined ? field.appearance : 'fill',
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      clubbed: field.clubbed,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      amendNarrativeClub: field.amendNarrativeClub !== undefined ? field.amendNarrativeClub : false,
      amendSpecificField: field.amendSpecificField !== undefined ? field.amendSpecificField : false,
      inquiryMap: field.inquiryMap !== undefined ? field.inquiryMap : false,
      narrativePDF: field.narrativePDF !== undefined ? field.narrativePDF : false,
      narrativePDFRender: field.narrativePDFRender !== undefined ? field.narrativePDFRender : false,
      clubbedDelimiter: field.clubbedDelimiter,
      previewDisplayedValue: field.previewDisplayedValue,
      pdfDisplayValueHidden: field.pdfDisplayValueHidden,
      displayedValue: field.displayedValue,
      previousReadOnly: field.previousReadOnly !== undefined ? field.previousReadOnly : false,
      translate: field.translate,
      translateValue: field.translateValue,
      feildType: field.feildType,
      infoIcon: field.infoIcon !== undefined ? field.infoIcon : false,
      infolabel: field.infolabel,
      enableMask: field.enableMask !== undefined ? field.enableMask : false,
      disableAutocomplete: field.disableAutocomplete !== undefined ? field.disableAutocomplete : false,
      allowedCharCount: field.allowedCharCount,
      dynamicCriteria: field.dynamicCriteria,
      previewCriteria: field.previewCriteria,
      viewDisplay: field.viewDisplay,
      tabSection: field.tabSection,
      amendTabbedPanel: field.amendTabbedPanel !== undefined ? field.amendTabbedPanel : false,
      fullWidthView: field.fullWidthView,
      halfWidthView: field.halfWidthView,
      valueOnly: field.valueOnly === true ? true : false,
      groupHeaderForLabel: field.groupHeaderForLabel !== undefined ? field.groupHeaderForLabel : undefined,
      isBankSection: field.isBankSection !== undefined ? field.isBankSection : false,
      isBankCounterPartyTab: field.isBankCounterPartyTab !== undefined ? field.isBankCounterPartyTab : false,
      hideLabel: field.hideLabel !== undefined ? field.hideLabel : false,
      maxValue: field.maxValue,
      applicableValidation: field.applicableValidation,
      staticInfoMsg: field.staticInfoMsg,
      successImgPath: field.successImgPath,
      failureImgPath: field.failureImgPath,
      disableStaticInfoLabel: field.disableStaticInfoLabel !== undefined ? field.disableStaticInfoLabel : false,
      minValue: field.minValue,
      blockCopyPaste: field.blockCopyPaste,
      multiValueLimit:field.multiValueLimit !== undefined ? field.multiValueLimit : 0,
      dynamicField: field.dynamicField !== undefined ? field.dynamicField : false,
      parentField: field.parentField,
      mapBooleanValue: field.mapBooleanValue === true ? true : false,
      shortDescription: field.shortDescription
    }, field.pdfStyles);
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getFccCurrencyControl(field: any) {
    const control: AbstractControl = new FccCurrencyControl(field.name, field.defautValue, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      parentStyleClass: field.parentStyleClass,
      source: field.source,
      disabled: field.disabled !== undefined ? field.disabled : false,
      styleClass: field.styleClass,
      layoutClass: this.getLayoutClass(field.layoutClass),
      rendered: field.rendered !== undefined ? field.rendered : true,
      required: field.required !== undefined ? field.required : false,
      maxlength: field.maxlength,
      readonly: field.readonly !== undefined ? field.readonly : false,
      appearance: field.appearance !== undefined ? field.appearance : 'fill',
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      amendNarrativeClub: field.amendNarrativeClub !== undefined ? field.amendNarrativeClub : false,
      inquiryMap: field.inquiryMap !== undefined ? field.inquiryMap : false,
      narrativePDF: field.narrativePDF !== undefined ? field.narrativePDF : false,
      narrativePDFRender: field.narrativePDFRender !== undefined ? field.narrativePDFRender : false,
      clubbedDelimiter: field.clubbedDelimiter,
      previewDisplayedValue: field.previewDisplayedValue,
      pdfDisplayValueHidden: field.pdfDisplayValueHidden,
      displayedValue: field.displayedValue,
      previousReadOnly: field.previousReadOnly !== undefined ? field.previousReadOnly : false,
      translate: field.translate,
      translateValue: field.translateValue,
      feildType: field.feildType,
      allowedCharCount: field.allowedCharCount,
      dynamicCriteria: field.dynamicCriteria,
      previewCriteria: field.previewCriteria,
      viewDisplay: field.viewDisplay,
      tabSection: field.tabSection,
      isRequiredForAmendComparison: field.isRequiredForAmendComparison !== undefined ? field.isRequiredForAmendComparison : false,
      isNotRequiredForComparison: field.isNotRequiredForComparison !== undefined ? field.isNotRequiredForComparison : false,
      amendTabbedPanel: field.amendTabbedPanel !== undefined ? field.amendTabbedPanel : false,
      amendSpecificField: field.amendSpecificField !== undefined ? field.amendSpecificField : false,
      notRequiredForCompariosnIfEmpty: field.notRequiredForCompariosnIfEmpty !== undefined ? field.notRequiredForCompariosnIfEmpty : false,
      fullWidthView: field.fullWidthView,
      valueOnly: field.valueOnly === true ? true : false,
      groupHeaderForLabel: field.groupHeaderForLabel !== undefined ? field.groupHeaderForLabel : undefined,
      isBankSection: field.isBankSection !== undefined ? field.isBankSection : false,
      isBankCounterPartyTab: field.isBankCounterPartyTab !== undefined ? field.isBankCounterPartyTab : false,
      originalValue: field.originalValue ? field.originalValue : ''
    }, field.pdfStyles);
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getInputPasswordControl(field: any) {
    const control: AbstractControl = new InputPasswordControl(field.name, field.defautValue, this.translateService,
      {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      parentStyleClass: field.parentStyleClass,
      styleClass: field.styleClass,
      layoutClass: this.getLayoutClass(field.layoutClass),
      rendered: field.rendered !== undefined ? field.rendered : true,
      required: field.required !== undefined ? field.required : false,
      maxlength: field.maxlength,
      readonly: field.readonly !== undefined ? field.readonly : false,
      appearance: field.appearance !== undefined ? field.appearance : 'fill',
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      clubbedDelimiter: field.clubbedDelimiter,
      previewDisplayedValue: field.previewDisplayedValue,
      displayedValue: field.displayedValue,
      previousReadOnly: field.previousReadOnly !== undefined ? field.previousReadOnly : false,
      translate: field.translate,
      translateValue: field.translateValue,
      feildType: field.feildType,
      dynamicCriteria: field.dynamicCriteria
    });
    this.addRequiredValidator(field, control);
    return control;
  }

  protected addRequiredValidator(field: any, control: AbstractControl) {
    if (field.required) {
      control.setValidators(Validators.required);
    }
  }

  protected getRadioButtonControl(field: any, enrichFlag = false) {
    const showFieldLabel = this.getApplicableShowLabel(field.applicableScreens);
    const control: AbstractControl = new RadioGroupFormControl(enrichFlag ? field.code : field.name, 
      field.defautValue, this.translateService, {
      key: enrichFlag ? field.code : field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      label: `${this.translateService.instant(field.name)}`,
      name: field.name,
      styleClass: field.styleClass,
      codeID : field.codeID,
      layoutClass: this.getLayoutClass(field.layoutClass),
      options: this.getOptions(field.options, field.name, enrichFlag),
      isDisabled: false,
      defaultValue: field.defaultValue,
      showLabel: showFieldLabel !== undefined ? showFieldLabel : false,
      source: field.source,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      groupHeaderForLabel: field.groupHeaderForLabel !== undefined ? field.groupHeaderForLabel : undefined,
      dynamicCriteria: field.dynamicCriteria,
      fullWidthView: field.fullWidthView,
      mapBooleanValue: field.mapBooleanValue === true ? true : false,
      sortDisabled: field.sortDisabled === true ? true : false,
      enrichment: field.enrichment === true ? true : false,
      readonly: field.readonly !== undefined ? field.readonly : false
    });
    return control;
  }

  protected getRadioCheckButtonControl(field: any) {
    const showFieldLabel = this.getApplicableShowLabel(field.applicableScreens);
    const control: AbstractControl = new RadioCheckFormControl(field.name, field.defautValue, this.translateService, {
      key: field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      label: `${this.translateService.instant(field.name)}`,
      name: field.name,
      styleClass: field.styleClass,
      layoutClass: this.getLayoutClass(field.layoutClass),
      options: this.getOptions(field.options, field.name),
      isDisabled: false,
      showLabel: showFieldLabel !== undefined ? showFieldLabel : false,
      source: field.source,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      dynamicCriteria: field.dynamicCriteria,
      mapBooleanValue: field.mapBooleanValue === true ? true : false
    });
    return control;
  }

  protected getDropDownControl(field: any) {
    const dropDownOptions = this.getOptions(field.options, field.name);
    const showFieldLabel = this.getApplicableShowLabel(field.applicableScreens);
    const control: AbstractControl = new DropdownFormControl(field.name, field.defaultValue, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      options: dropDownOptions,
      placeholder: field.defaultValue,
      defaultValue: field.defaultValue,
      layoutClass: this.getLayoutClass(field.layoutClass),
      codeID : field.codeID,
      disabled: field.disabled,
      styleClass: field.styleClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      required: field.required !== undefined ? field.required : false,
      readonly: field.readonly !== undefined ? field.readonly : false,
      filter: false,
      autoDisplayFirst : field.defaultValue,
      showLabel: showFieldLabel !== undefined ? showFieldLabel : false,
      source: field.source,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      showValue: field.showValue === true ? true : false,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      hideGrpHeaderInView: field.hideGrpHeaderInView,
      clubbedDelimiter: field.clubbedDelimiter,
      dynamicCriteria: field.dynamicCriteria,
      previewCriteria: field.previewCriteria,
      tabSection: field.tabSection,
      translate: field.translate,
      translateValue: field.translateValue,
      dropdownFilterClass: field.dropdownFilterClass,
      groupHeaderForLabel: field.groupHeaderForLabel !== undefined ? field.groupHeaderForLabel : undefined,
      isBankSection: field.isBankSection !== undefined ? field.isBankSection : false,
      isBankCounterPartyTab: field.isBankCounterPartyTab !== undefined ? field.isBankCounterPartyTab : false,
      hyperlinkData : field.hyperlinkData !== undefined ? field.hyperlinkData : undefined,
      checkboxAttr: field.checkboxAttr !== undefined ? field.checkboxAttr : undefined,
      sectionToValidate: field.sectionToValidate,
      type:field.type
    });
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getCheckBoxControl(field: any) {
    const showFieldLabel = this.getApplicableShowLabel(field.applicableScreens);
    const control: AbstractControl = new CheckboxFormControl(field.name, field.defaultValue, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      options: this.getOptions(field.options, field.name),
      layoutClass: this.getLayoutClass(field.layoutClass),
      styleClass: field.styleClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      required: field.required !== undefined ? field.required : false,
      showLabel: showFieldLabel !== undefined ? showFieldLabel : false,
      source: field.source,
      isStyleEnabled: field.isStyleEnabled !== undefined ? field.isStyleEnabled : false,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      clubbedDelimiter: field.clubbedDelimiter,
      dynamicCriteria: field.dynamicCriteria,
      defaultValue: field.defaultValue,
      mapBooleanValue: field.mapBooleanValue === true ? true : false
    });
    return control;
  }

  protected getMatCheckBoxControl(field: any, enrichFlag = false) {
    const showFieldLabel = this.getApplicableShowLabel(field.applicableScreens);
    const control: AbstractControl = new MatCheckboxFormControl(enrichFlag ? field.code : field.name,
      field.defaultValue, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: enrichFlag ? field.code : field.name,
      layoutClass: this.getLayoutClass(field.layoutClass),
      styleClass: field.styleClass,
      parentClass: field.parentClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      required: field.required !== undefined ? field.required : false,
      disabled: field.disabled !== undefined ? field.disabled : false,
      showLabel: showFieldLabel !== undefined ? showFieldLabel : false,
      source: field.source,
      isStyleEnabled: field.isStyleEnabled !== undefined ? field.isStyleEnabled : false,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      clubbedDelimiter: field.clubbedDelimiter,
      dynamicCriteria: field.dynamicCriteria,
      defaultValue: field.defaultValue,
      translate: field.translate,
      translateValue: field.translateValue,
      pdfDisplayCheckbox: field.pdfDisplayCheckbox !== undefined ? field.pdfDisplayCheckbox : false,
      mapBooleanValue: field.mapBooleanValue === true ? true : false
    });
    return control;
  }

  protected getDateControl(field: any, enrichFlag = false) {
    const control: AbstractControl = new InputDateControl(enrichFlag ? field.code : field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: enrichFlag ? field.code : field.name,
      minDate: (field.disableMinDate !== undefined && field.disableMinDate) ? null :
      this.commonService.getBankDateForComparison(),
      maxDate: (field.enableMaxDate !== undefined && field.enableMaxDate) ?
        this.commonService.getBankDateForComparison() : null,
      layoutClass: this.getLayoutClass(field.layoutClass),
      styleClass: field.styleClass,
      readonly: field.readonly,
      rendered: field.rendered !== undefined ? field.rendered : true,
      required: field.required !== undefined ? field.required : false,
      holidayList: field.holidayList !== undefined ? field.holidayList : '',
      source: field.source,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      autoForward: field.autoForward !== undefined ? field.autoForward : false,
      maxlength: this.utilityService.getDisplayDateFormat().length,
      displayPreview: field.displayPreview !== undefined ? field.displayPreview : false,
      dynamicCriteria: field.dynamicCriteria,
      enrichment: field.enrichment === true ? true : false,
      maxValueDate: this.commonService.isEmptyValue(field.maxValueDate) ? '' : field.maxValueDate,
      minValueDate: this.commonService.isEmptyValue(field.minValueDate) ? '' : field.minValueDate,
      placeholder: this.utilityService.getDisplayDateFormat(),
      langLocale: this.localeService.getCalendarLocaleJson(localStorage.getItem('language')),
      dateFormat: this.localeService.getDateLocaleJson(localStorage.getItem('language')).dateFormat,
      groupHeaderForLabel: field.groupHeaderForLabel !== undefined ? field.groupHeaderForLabel : undefined,
      fullWidthView: field.fullWidthView !== undefined ? field.fullWidthView : undefined,
      dateTitle: field.dateTitle !== undefined ? field.dateTitle : false
    }, field.pdfStyles);
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getBackDateControl(field: any) {
    const control: AbstractControl = new InputBackDateControl(field.name, '', this.translateService,
      {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      maxDate: this.commonService.getBankDateForComparison(),
      layoutClass: this.getLayoutClass(field.layoutClass),
      styleClass: field.styleClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      required: field.required !== undefined ? field.required : false,
      source: field.source,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      dynamicCriteria: field.dynamicCriteria,
      maxlength: this.utilityService.getDisplayDateFormat().length,
      placeholder: this.utilityService.getDisplayDateFormat(),
      langLocale: this.localeService.getCalendarLocaleJson(localStorage.getItem('language')),
      dateFormat: this.localeService.getDateLocaleJson(localStorage.getItem('language')).dateFormat
    }, field.pdfStyles);
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getSelectButtonControl(field: any) {
    const showFieldLabel = this.getApplicableShowLabel(field.applicableScreens);
    const control: AbstractControl = new SelectButtonControl(field.name, field.defaultValue, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      options: this.getOptions(field.options, field.name),
      styleClass: field.styleClass,
      layoutClass: this.getLayoutClass(field.layoutClass),
      rendered: field.rendered !== undefined ? field.rendered : true,
      matIcon: field.options.matIcon,
      crossIcon: field.options.crossIcon,
      showLabel: showFieldLabel !== undefined ? showFieldLabel : false,
      source: field.source,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      clubbedDelimiter: field.clubbedDelimiter,
      notAmended: field.notAmended !== undefined ? field.notAmended : false,
      amendDefaultReset: field.amendDefaultReset !== undefined ? field.amendDefaultReset : false,
      disabled: field.disabled !== undefined ? field.disabled : false,
      groupHeaderForLabel: field.groupHeaderForLabel !== undefined ? field.groupHeaderForLabel : undefined,
      dynamicCriteria: field.dynamicCriteria,
      previewMultiple: field?.previewMultiple ? true : false,
      defaultValue: field.defaultValue
    }, field.pdfStyles);
    return control;
  }
  protected getCardViewControl(field: any): AbstractControl {
    const control: AbstractControl = new CardControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      layoutClass: field.layoutClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      data: field.data,
      previewScreen: field.previewScreen === false ? false : true
    });
    return control;
  }
  protected getMatAutoCompControl(field: any): AbstractControl {
    const control: AbstractControl = new MatAutoCompControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      options: this.getOptions(field.options, field.name),
      styleClass: field.styleClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      maxlength: field.maxlength,
      layoutClass: this.getLayoutClass(field.layoutClass),
      filter: true,
      filterBy: 'label,value.name',
      required: field.required !== undefined ? field.required : false,
      source: field.source,
      clubbedHeaderText: field.clubbedHeaderText,
      clubbedList: field.clubbedList,
      previewScreen: field.previewScreen,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      clubbedDelimiter: field.clubbedDelimiter,
      previewValueAttr: field.previewValueAttr,
      previewValConcatinated: field.previewValConcatinated,
      readonly: field.readonly,
      dropdownFilterClass: field.dropdownFilterClass,
      dynamicCriteria: field.dynamicCriteria,
      viewDisplay: field.viewDisplay,
      applicableValidation: field.applicableValidation,
      allowAllOptions: field.allowAllOptions !== undefined ? field.allowAllOptions : false,
      lazyLoadingDisabled: field.lazyLoadingDisabled ? true : false
    });
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getOptions(options, fieldName, enrichFlag = false) {
    const objArray = [];
    if (options && Array.isArray(options)) {
      options.forEach(elementValue => {
        const permission = elementValue.permission !== undefined ? this.getPermissionValidation(elementValue.permission) : true;
        if (permission){
          let key = '';
          let labelKey = '';
          if (enrichFlag) {
            key = elementValue.value;
            labelKey = elementValue.value;
          } else {
            key = fieldName.concat('_').concat(elementValue.value);
            labelKey = fieldName.concat('_label_').concat(elementValue.value);
          }
        objArray.push({
          label: `${this.translateService.instant(key)}`,
          id: key,
          value: elementValue.value,
          layout_Class: elementValue.layout_class,
          title: elementValue.title,
          valueStyleClass: elementValue.valueStyleClass,
          readonly : elementValue.readonly !== undefined ? elementValue.readonly : false,
          checked: elementValue.checked !== undefined ? elementValue.checked : false,
          ariaLabelValue: elementValue.displayAriaLabel !== undefined && elementValue.displayAriaLabel ?
          `${this.translateService.instant(labelKey)}`
          : ''
          });
        }
      });
    } else if (Object.keys(options).length !== 0 && typeof options === 'object') {
      options.value.forEach(elementValue => {
        const key = fieldName.concat('_').concat(elementValue);
        objArray.push({
        label: `${this.translateService.instant(key)}`,
        value: elementValue,
        icon: options.icon,
        disabled: options.disabled !== undefined ? options.disabled : false
        });
      });
    }
    return objArray;
  }

  getLayoutClass(fieldLayout: any, fieldName?: any) {
    if (this.isStepperDisabled === true && fieldName !== 'accountSummary' && fieldLayout && !fieldLayout.includes('p-xl')) {
      fieldLayout = `p-xl-4 ` + fieldLayout;
    }
    return fieldLayout;
  }

  protected getApplicableShowLabel(applicableScreens) {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (applicableScreens !== undefined) {
      for (const value of applicableScreens) {
        if (value.tnxTypeCode === tnxTypeCode) {
          return value.showLabel;
        }
      }
    } else {
      return '';
    }
  }

  protected getSubSectionControls(field: any, subsectionModel: any, form: FCCFormGroup) {
    const fields = Object.keys(subsectionModel);
    fields.forEach(fieldName => {
      const isFieldApplicable = !field.fieldsNotApplicable || (field.fieldsNotApplicable &&
        !(field.fieldsNotApplicable.indexOf(fieldName) > -1));
      if (subsectionModel[fieldName].sectionType) {
        this.buildSection(form, subsectionModel[fieldName]);
      } else {
      const tempName = field.prefix && field.prefix.concat(subsectionModel[fieldName].name);
      subsectionModel[fieldName].name = tempName;
      // method to handle grouping and clubbing
      this.setSubsectionGroupingAndClubbingParams(field.prefix, subsectionModel[fieldName]);
      // hide sections
      subsectionModel[fieldName].rendered = field.rendered !== undefined ? field.rendered : true;
      // To add subsection control for amend form
      this.subSectionControls(field, subsectionModel, form, isFieldApplicable, fieldName);
  }
    });
  }

  protected setSubsectionGroupingAndClubbingParams(prefix: string, fieldObj: any) {
    const groupChildren = 'groupChildren';
    const grouphead = 'grouphead';
    const clubbedHeaderText = 'clubbedHeaderText';
    const clubbedList = 'clubbedList';

    // Grouping
    let children: string[] = [];
    if (fieldObj[groupChildren]) {
      const grooupChildrenList = fieldObj[groupChildren];
      Object.keys(grooupChildrenList).forEach(childfieldName => {
        children.push(prefix && prefix.concat(grooupChildrenList[childfieldName].toString()));
      });
      fieldObj[groupChildren] = children;
    }
    if (fieldObj[grouphead]) {
      fieldObj[grouphead] = prefix && prefix.concat(fieldObj[grouphead].toString());
    }
    // Clubbing
    children = [];
    if (fieldObj[clubbedList]) {
      const clubbedListArray = fieldObj[clubbedList];
      Object.keys(clubbedListArray).forEach(clubbedFieldName => {
        children.push(prefix && prefix.concat(clubbedListArray[clubbedFieldName].toString()));
      });
      fieldObj[clubbedList] = children;
    }
    if (fieldObj[clubbedHeaderText]) {
      fieldObj[clubbedHeaderText] = prefix && prefix.concat(fieldObj[clubbedHeaderText].toString());
    }
  }

  subSectionControls(field: any, subsectionModel: any, form: FCCFormGroup, isFieldApplicable: any, fieldName: any) {
  // To checked if field has applicableScreens condition
  const option = this.commonService.getQueryParametersFromKey('option');
  const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
  const subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
  const operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
  if (field.applicableScreens && isFieldApplicable && (tnxTypeCode === FccGlobalConstant.N002_AMEND ||
    subTnxTypeCode === FccGlobalConstant.N003_PAYMENT)) {
    this.buildControlsForScreenType(form, field, subsectionModel[fieldName], subsectionModel[fieldName].type);
  } else if (field.applicableScreens && isFieldApplicable && option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC
    && (operation === FccGlobalConstant.ADD_FEATURES || operation === FccGlobalConstant.UPDATE_FEATURES)) {
    this.buildControlsForScreenType(form, field, subsectionModel[fieldName], subsectionModel[fieldName].type);
  } else {
  // hide fields if any
  if (field.hideFields && field.hideFields.indexOf(fieldName) > -1) {
    subsectionModel[fieldName].rendered = false;
  }
  if (field.hideGrpHeaderInView !== undefined && field.hideGrpHeaderInView) {
    subsectionModel[fieldName].hideGrpHeaderInView = true;
  } else {
    subsectionModel[fieldName].hideGrpHeaderInView = false;
  }
  if (field.isBankSection !== undefined && field.isBankSection) {
    subsectionModel[fieldName].isBankSection = true;
  }
  if (field.isBankCounterPartyTab !== undefined && field.isBankCounterPartyTab) {
    subsectionModel[fieldName].isBankCounterPartyTab = true;
  }
  if (field.isBankSection !== undefined && field.isBankSection) {
    subsectionModel[fieldName].isBankSection = true;
  }
  if (field.isBankCounterPartyTab !== undefined && field.isBankCounterPartyTab) {
    subsectionModel[fieldName].isBankCounterPartyTab = true;
  }
  // fields to be marked as mandatory
  if (option === FccGlobalConstant.TEMPLATE) {
    if (field.applicableScreens) {
      for (const value of field.applicableScreens) {
        if (option === value.option) {
          value.requiredFields.forEach(element => {
            if (fieldName === element) {
              subsectionModel[fieldName].required = true;
            }
          });
        }
      }
    }
  } else {
  if (field.requiredFields) {
    field.requiredFields.forEach(element => {
      if (fieldName === element) {
        subsectionModel[fieldName].required = true;
      }
    });
  }
}
  // Exclude the fields that are not applicable to the subsection
  // Add controls only for the related fields.
  if (isFieldApplicable) {
    form.addControl(subsectionModel[fieldName].name, this.getControl(subsectionModel[fieldName]));
  }
}
  }

  getSpacerSectionControls(field: any, subsectionModel: any, form: FCCFormGroup) {
    const fields = Object.keys(subsectionModel);
    const num = field.noofspacers;
    fields.forEach(fieldName => {
      const tempName = field.prefix.concat(subsectionModel[fieldName].name);
      subsectionModel[fieldName].name = tempName;
      subsectionModel[fieldName].layoutClass = field.layoutClass;
      // To skip spacer if not required
      if (field.applicableScreens) {
        for (const value of field.applicableScreens) {
          if ( value.rendered !== false) {
        this.buildControlsForScreenType(form, field, subsectionModel[fieldName], subsectionModel[fieldName].type);
        }
      }
      } else {
      for (let i = 0; i < num; i++) {
      form.addControl(subsectionModel[fieldName].name + i + 1, this.getControl(subsectionModel[fieldName]));
      }
    }
    });
  }
  protected getInputIconControl(field) {
    const control: AbstractControl = new InputIconControl(field.name, this.translateService, {
      key: field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      layoutClass: field.layoutClass,
      styleClass: field.styleClass,
      iconName: field.iconName,
      parentStyleClass: field.parentStyleClass,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
    });
    return control;
  }

  protected getButtonControl(field) {
    const control: AbstractControl = new ButtonControl(field.name, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      layoutClass: this.getLayoutClass(field.layoutClass),
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      btndisable: field.btndisable
    });
    return control;
  }
  protected getAccordionControl(field) {
    const control: AbstractControl = new AccordionControl(field.name, this.translateService, {
      key: field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      parentStyleClass: field.parentStyleClass,
      layoutClass: field.layoutClass,
      labelStyle: field.labelStyle,
      valueStyle: field.valueStyle,
      rowStyle: field.rowStyle,
      gridStyle: field.gridStyle,
      options: field.options,
      previewScreen: field.previewScreen === false ? false : true,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      panelHeadStyle: field.panelHeadStyle,
      previewTableStyle: field.previewTableStyle,
      noPreviewActions: field.noPreviewActions,
      parentAccordionPanelStyle: field.parentAccordionPanelStyle,
      parentAccordionTitleStyle: field.parentAccordionTitleStyle,
      nestedAccordionTitleStyle: field.nestedAccordionTitleStyle,
      descriptionStyle: field.descriptionStyle,
      nestedHeaderIcon: field.nestedHeaderIcon,
      nestedHeaderIconTitle: field.nestedHeaderIconTitle,
      nestedHeaderIconStyle: field.nestedHeaderIconStyle,
      previewFieldType: field.previewFieldType,
      emptyMessaage: field.emptyMessaage,
      retrieveOldData: field.retrieveOldData,
      isStyleEnabled: field.isStyleEnabled !== undefined ? field.isStyleEnabled : false,
      childAccordionExpanded: field.childAccordionExpanded !== undefined ? field.childAccordionExpanded : true,
      parentAccordionExpanded: field.parentAccordionExpanded !== undefined ? field.parentAccordionExpanded : true,
      showLabelView: field.showLabelView === true ? true : false,
      pdfFieldType: field.pdfFieldType
    });
    return control;
  }

  protected getTimerControl(field) {
    const control: AbstractControl = new TimerControl(field.name, null, this.translateService, {
      key: field.name,
      rendered: true,
      layoutClass: field.layoutClass,
      styleClass: field.styleClass,
      previewScreen: field.previewScreen,
    });
    return control;
  }

  protected getMatCardControl(field) {
    const control: AbstractControl = new MatCardControl(field.name, this.translateService, {
      key: field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      parentStyleClass: field.parentStyleClass,
      layoutClass: field.layoutClass,
      labelStyle: field.labelStyle,
      valueStyle: field.valueStyle,
      rowStyle: field.rowStyle,
      gridStyle: field.gridStyle,
      options: field.options,
      previewScreen: field.previewScreen,
      groupChildren: field.groupChildren,
      grouphead: field.grouphead,
      fields: field.fields,
      isNotRequiredForComparison: field.isNotRequiredForComparison !== undefined ? field.isNotRequiredForComparison : false,
      clubbedFieldsList: field.clubbedFieldsList,
      currencyCodeList: field.currencyCodeList,
      showViewLink: field.showViewLink !== undefined ? field.showViewLink : false,
      showChildViewLink: field.showChildViewLink !== undefined ? field.showChildViewLink : false,
      showViewDetails: field.showViewDetails !== undefined ? field.showViewDetails : false,
      showChannelRef: field.showChannelRef !== undefined ? field.showChannelRef : false,
      showStatusImg: field.showStatusImg !== undefined ? field.showStatusImg : false,
      sectionHeader: field.sectionHeader !== undefined ? field.sectionHeader : null,
      showRemoveLink: field.showRemoveLink !== undefined ? field.showRemoveLink : false,
    });
    return control;
  }

  protected getJSONObjControl(field: any) {
    const control: AbstractControl = new JSONObjControl(field.name, field.defautValue, this.translateService, {
      rendered: field.rendered !== undefined ? field.rendered : true,
      required: field.required !== undefined ? field.required : false,
      previewScreen: field.previewScreen,
      feildType: field.feildType,
    });
    return control;
  }

  protected getFormTableControl(field: any) {
    const control: AbstractControl = new FormTableControl(field.name, '', this.translateService, {
      key: field.name,
      label: `${this.translateService.instant(field.name)}`,
      layoutClass: field.layoutClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      columns: field.columns,
      data: field.data,
      actions: field.actions,
      hasActions: field.hasActions,
      checkBoxRequired: field.checkBoxRequired,
      previewScreen: field.previewScreen === false ? false : true,
      showLabelView: field.showLabelView === true ? true : false,
      dynamicCriteria: field.dynamicCriteria,
      previewTableStyle: field.previewTableStyle,
      pdfFieldType: field.pdfFieldType,
      retrieveOldData: field.retrieveOldData
    });
    return control;
  }


  protected getFormAccordionPanelControl(field: any) {
    const control: AbstractControl = new FormAccordionControl(field.name, this.translateService,
      { formAccordionPanels: this.getFormAccordionPanelValue(field), dir: localStorage.getItem('langDir'),
      valueStyleClass: 'dynamicCompStyle', accrodionClass: field.accrodionClass,
      rendered: true, showAccordionIcon: field.showAccordionIcon === false ? false : true, layoutClass: field.accordianLayoutClass,
      expanded: field.expanded === false ? false : true, changePanelheader: field.changePanelheader === true ? true : false }
    );
    return control;
  }

  getFormAccordionPanelValue(field) {
    const accordionArray = [];
    for (let i = 0; i < field.formAccordions.length ; i++) {
      const accordion = field.formAccordions[i];
      const objKey = Object.keys(accordion);
      const keyOf = objKey[FccGlobalConstant.LENGTH_0];
      const controlNameValue = accordion.controlName;
      //Added this to inject controls in formAccordionPanel.Need to add to form accordionObj.
      const panelControl = Object.keys(accordion[keyOf]);
      const panelControlArray = {};
      if (panelControl.length) {
        Object.keys(accordion[keyOf]).forEach((item) => {
          panelControlArray[item] = this.getControl(accordion[keyOf][item]);
      });
      }
      const accordionData = accordion[keyOf];
      accordionData.index =accordion.index;
      const accordionObj = {
        panelHeader : `${this.translateService.instant(controlNameValue)}` ,
        panelType: controlNameValue,
        panelData: accordionData,
        controlName: controlNameValue,
        panelControlArray: { ...panelControlArray },
        rendered: accordion.rendered !== undefined ? accordion.rendered : true,
        index: accordion.index };
      accordionArray.push(accordionObj);
    }
    return accordionArray;
  }

  protected getExpansionPanelTableControl(field) {
    const control: AbstractControl = new ExpansionPanelTableControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      layoutClass: field.layoutClass,
      styleClass: field.styleClass,
      tableCardStyle: field.tableCardStyle,
      radioButtonColStyle: field.radioButtonColStyle,
      selection: field.selection,
      datakey: field.datakey,
      columns: field.columns,
      data: field.data,
      disabled: field.disabled !== undefined ? field.disabled : false,
      accordionClass: field.accordionClass,
      headerDesc: field.headerDesc,
      previewScreen: field.previewScreen,
      selectedRow: field.selectedRow
    });
    return control;
  }

  protected getCalendarDateCOntrol(field: any) {
    const showFieldLabel = this.getApplicableShowLabel(field.applicableScreens);
    const control: AbstractControl = new CalenderDateControl(field.name, field.defaultValue, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      placeholder: field.defaultValue,
      defaultValue: field.defaultValue ? field.defaultValue : 0,
      layoutClass: this.getLayoutClass(field.layoutClass),
      disabled: field.disabled,
      styleClass: field.styleClass,
      parentStyleClass: field.parentStyleClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      required: field.required !== undefined ? field.required : false,
      readonly: field.readonly !== undefined ? field.readonly : false,
      autoDisplayFirst : field.defaultValue,
      showLabel: showFieldLabel !== undefined ? showFieldLabel : false,
      showValue: field.showValue === true ? true : false,
      previewScreen: field.previewScreen === false ? false : true,
      appearance: field.appearance !== undefined ? field.appearance : 'fill',
      hyperlinkData : field.hyperlinkData !== undefined ? field.hyperlinkData : undefined
    });
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getExpansionPanelEditTableControl(field) {
    const control: AbstractControl = new ExpansionPanelEditTableControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      layoutClass: field.layoutClass,
      key: field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      options:  field.options,
      selectedRow: field.selectedRow,
      previewScreen: field.previewScreen,
      footerMsg: field.footerMsg,
      showLabelView: field.showLabelView,
      retrieveOldData: field.retrieveOldData,
      subControlsDetails: field.subControlsDetails,
      noPreviewActions: field.noPreviewActions,
      pdfFieldType: field.pdfFieldType,
      pdfTableSize: field.pdfTableSize,
      previewFieldType: field.previewFieldType,
      emptyMessaage: field.emptyMessaage
    });
    return control;
  }

  protected getExpansionPanelEditFormTableControl(field) {
    const control: AbstractControl = new ExpansionPanelEditFormTableControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      layoutClass: field.layoutClass,
      key: field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      columns: field.columns,
      data: field.data,
      sessionCols: field.sessionCols,
      subControlsDetails: field.subControlsDetails,
      OverDrawStatus: field.OverDrawStatus,
      tnsAmountStatus: field.tnsAmountStatus,
      options:  field.options,
      message1: field.message1,
      message2: field.message2,
      actions: field.actions,
      columnsHeaderData: field.columnsHeaderData,
      previewScreen: field.previewScreen,
      showLabelView: field.showLabelView === true ? true : false,
      bankAttachmentPreview : field.bankAttachmentPreview,
      maxDate: (field.enableMaxDate !== undefined && field.enableMaxDate) ? new Date() : null,
      showDatePicker: true,
      tableHeader: field.tableHeader,
      previewScreenViewAction : field.previewScreenViewAction,
      loadListDef : this.isLoadListDef(field)
    });
    return control;
  }

  protected getCardSummaryControl(field) {
    const control: AbstractControl = new CardSummaryControl(field.name, '', this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      layoutClass: field.layoutClass,
      key: field.name,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      columns: field.columns,
      data: field.data,
      sessionCols: field.sessionCols,
      subControlsDetails: field.subControlsDetails,
      controlDetails: field.controlDetails,
      OverDrawStatus: field.OverDrawStatus,
      tnsAmountStatus: field.tnsAmountStatus,
      options:  field.options,
      message1: field.message1,
      message2: field.message2,
      actions: field.actions,
      columnsHeaderData: field.columnsHeaderData,
      previewScreen: field.previewScreen,
      showLabelView: field.showLabelView === true ? true : false,
      bankAttachmentPreview : field.bankAttachmentPreview,
      maxDate: (field.enableMaxDate !== undefined && field.enableMaxDate) ? new Date() : null,
      showDatePicker: true,
      tableHeader: field.tableHeader,
      previewScreenViewAction : field.previewScreenViewAction,
      loadListDef : this.isLoadListDef(field)
    });
    return control;
  }

  protected getHighlightTextEditorControl(field) {
    const control: AbstractControl = new HighlightTextEditorControl(field.name, field.value, this.translateService, {
    label: field.showLabel === false ? '' : `${this.translateService.instant(field.name)}`,
    key: field.name,
    grouphead: field.grouphead,
    rendered: field.rendered !== undefined ? field.rendered : true,
    swift: field.swift,
    fieldSize: field.fieldSize,
    maxRowCount: field.maxRowCount,
    enteredCharCount: field.enteredCharCount,
    disableNextLineCharCount: field.disableNextLineCharCount,
    rowCount: field.rowCount,
    rows: field.rows,
    cols: field.cols,
    start: field.start,
    textAreaClass: field.textAreaClass,
    startClass: field.startClass,
    clearIconClass: field.clearIconClass,
    allowedCharCount: field.allowedCharCount,
    maxlength: field.maxlength,
    styleClass: field.styleClass,
    layoutClass: field.layoutClass,
    readonly: field.readonly !== undefined ? field.readonly : false,
    required: field.required !== undefined ? field.required : false,
    showLabel: field.showLabel !== undefined ? field.showLabel : true,
    hintTextControl: field.hintTextControl !== undefined ? field.hintTextControl : false,
    hintText: field.hintText !== undefined ? `${this.translateService.instant(field.hintText)}` : '',
    clubbedHeaderText: field.clubbedHeaderText,
    clubbedList: field.clubbedList,
    showValidationMessage: field.showValidationMessage === undefined ? true : field.showValidationMessage,
    previewScreen: field.previewScreen === false ? false : true,
    displayPreview: field.displayPreview !== undefined ? field.displayPreview : false,
    mode: field.mode,
    previousReadOnly: field.previousReadOnly !== undefined ? field.previousReadOnly : false,
    phraseEnabled: field.phraseEnabled !== undefined ? field.phraseEnabled : false,
    phraseIconStyle: field.phraseIconStyle,
    groupSubHeaderText: field.groupSubHeaderText,
    previewSingleRow: field.previewSingleRow !== undefined ? field.previewSingleRow : false,
    amendNarrativeClub: field.amendNarrativeClub !== undefined ? field.amendNarrativeClub : false,
    inquiryMap: field.inquiryMap !== undefined ? field.inquiryMap : false,
    narrativePDF: field.narrativePDF !== undefined ? field.narrativePDF : false,
    narrativePDFRender: field.narrativePDFRender !== undefined ? field.narrativePDFRender : false,
    amendNarrativeGroup: field.amendNarrativeGroup !== undefined ? field.amendNarrativeGroup : false,
    amendSpecificField: field.amendSpecificField !== undefined ? field.amendSpecificField : false,
    amendPreviewStyle: field.amendPreviewStyle,
    noValueOnEventLoad: field.noValueOnEventLoad !== undefined ? field.noValueOnEventLoad : false,
    groupHeaderForLabel: field.groupHeaderForLabel !== undefined ? field.groupHeaderForLabel : undefined,
    isNotRequiredForComparison: field.isNotRequiredForComparison !== undefined ? field.isNotRequiredForComparison : false,
    dynamicCriteria: field.dynamicCriteria,
    tabSection: field.tabSection,
    fullWidthView: field.fullWidthView,
    resize: field.resize === false ? false : true,
    config: field.config,
    htmlContent: field.htmlContent,
    inputType: field.inputType === false ? false : true,
    typeOfRegex: field.typeOfRegex,
    setContentWidth: field.setContentWidth ? field.setContentWidth : false,
    applicableValidation: field.applicableValidation
  });
    this.addRequiredValidator(field, control);
    return control;
  }

  protected getFCCFileViewerControl(field: any): AbstractControl {
    const control: AbstractControl = new FCCFileViewerControl(field.name, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      layoutClass: field.layoutClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      previewScreen: field.previewScreen === false ? false : true
    });
    return control;
  }

  protected getFCCListBoxControl(field) {
    const control: AbstractControl = new FCCListBoxControl(field.name, this.translateService, {
      label: `${this.translateService.instant(field.name)}`,
      key: field.name,
      layoutClass: field.layoutClass,
      rendered: field.rendered !== undefined ? field.rendered : true,
      styleClass: field.styleClass,
      columns: field.columns,
      data: field.data,
      showLabelView: field.showLabelView === true ? true : false,
      });
    return control;
  }

  getAttachmentTableHeader(): any {

    this.attachmentTableColumns = [
      {
        field: 'typePath',
        header: `${this.translateService.instant('fileType')}`,
        width: '10%'
      },
      {
        field: 'title',
        header: `${this.translateService.instant('title')}`,
        width: '40%'
      },
      {
        field: 'fileName',
        header: `${this.translateService.instant('fileName')}`,
        width: '40%'
      }
];
    return this.attachmentTableColumns;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setValueByType(control: any, fieldValue: any, master = false, autoSaveFlag = false) {
    const type = control.type;
    switch (type) {
      case 'text':
      case FccGlobalConstant.inputText:
        if (fieldValue) {
        control.value = fieldValue;
        }
        break;
      case FccGlobalConstant.inputRadio:
        if (fieldValue) {
        control.value = fieldValue;
        }
        break;
      case FccGlobalConstant.inputRadioCheck:
      case FccGlobalConstant.selectButton:
        if (fieldValue) {
        control.value = fieldValue;
        }
        break;
      case 'input-table':
        if (fieldValue) {
          if (control.key === FccGlobalConstant.FEECHARGES) {
            control.params.columns = feesAndChargesHeader;
          } else if (control.key === FccGlobalConstant.DOCUMENTS) {
            control.params.columns = documentsHeader;
          } else if (control.key === 'elMT700fileUploadTable'
          || control.key === FccGlobalConstant.FILE_UPLOAD_TABLE ||
            control.key === FccGlobalConstant.PREVIOUS_BANK_ATTACHMENT_TABLE ||
            control.key === FccGlobalConstant.BANK_ATTACHMENT_TABLE) {
            control.params.columns = this.getAttachmentTableHeader();
          } else if (control.key === FccGlobalConstant.CHILD_REFERENCE) {
            control.params.columns = childReferencesHeader;
          } else if (control.params[FccGlobalConstant.RETRIEVE_INDIVIDUAL_CROSS_REFS]) {
            control.params.columns = [
              { header: control.key }
            ];
          }
          control.params.data = fieldValue;
        }
        break;
      case 'fees-and-charges':
        if (fieldValue) {
          if (control.key === FccGlobalConstant.FEECHARGES) {
            control.params.columns = feesAndChargesHeader;
          } else if (control.key === FccGlobalConstant.DOCUMENTS) {
            control.params.columns = documentsHeader;
          }
          control.params.data = fieldValue;
          }
        break;
      case 'checkbox':
      case 'input-cb':
        if (fieldValue || control.params[FccGlobalConstant.AMEND_DEFAULT_RESET]) {
          control.value = fieldValue;
        }
        break;
      case 'fees-and-charges':
        if (fieldValue) {
            control.params.columns = feesAndChargesHeader;
            control.params.data = fieldValue;
          }
        break;
      case FccGlobalConstant.inputDropdown:
        this.setDefaultControlValue(fieldValue, control);
        break;
      case 'input-dropdown-filter':
        if (fieldValue && !autoSaveFlag) {
          control.value = {};
          const fieldLabel = (control.key) + '_' + fieldValue;
          const translatedFieldLabel = `${this.translateService.instant(fieldLabel)}`;
          control.value[FccGlobalConstant.LABEL] = translatedFieldLabel !== fieldLabel ? translatedFieldLabel : fieldValue;
          control.value[FccGlobalConstant.SHORT_NAME] = fieldValue;
          control.value[FccGlobalConstant.VALUE] = fieldValue;
          control.value[FccGlobalConstant.NAME] = fieldValue;
        } else if (fieldValue && autoSaveFlag) {
          control.value = fieldValue;
        }
        break;
      case 'input-auto-comp':
        if (fieldValue) {
          if (!autoSaveFlag) {
            control.value = {};
            control.value[FccGlobalConstant.LABEL] = fieldValue;
            control.value[FccGlobalConstant.SHORT_NAME] = fieldValue;
            control.value[FccGlobalConstant.NAME] = fieldValue;
            control.value[FccGlobalConstant.VALUE] = fieldValue;
          } else if (autoSaveFlag) {
            control.value = fieldValue;
          }
        }
        break;
      case FccGlobalConstant.viewModeSelect:
        if (fieldValue) {
          control.value = [];
          const fieldLabel = (control.key) + '_' + fieldValue;
          const selectedField: { label: any; shortName: any, value: any } = {
            label: `${this.translateService.instant(fieldLabel)}`,
            shortName: fieldValue,
            value: fieldValue,
          };
          (control.value).push(selectedField);
        }
        break;
      case FccGlobalConstant.inputDate:
      case FccGlobalConstant.inputBackDate:
        if (fieldValue) {
            control.value = this.utilityService.getDateFromAnyFormat(fieldValue);
        }
        break;
      case FccGlobalConstant.expansionPanel:
        if (fieldValue) {
          this.setExpansionPanelOptions(control, fieldValue);
        }
        break;
        case FccGlobalConstant.FORM_TABLE:
        if (fieldValue) {
            control.params.columns = variationsHeader;
            control.params.data = fieldValue;
        }
        break;
      case FccGlobalConstant.MAT_CARD:
        if (fieldValue) {
            control.params.options = fieldValue;
        }
        break;
      case FccGlobalConstant.EDIT_TABLE:
        if (fieldValue && autoSaveFlag) {
          control.params.columns = fieldValue.columns;
          control.params.data = fieldValue.data;
        } else {
          this.setDefaultControlValue(fieldValue, control);
        }
        break;
      default:
        this.setDefaultControlValue(fieldValue, control);
    }
  }

  protected setDefaultControlValue(fieldValue: any, control: any) {
    if (fieldValue) {
      control.value = fieldValue;
    }
  }

  protected setExpansionPanelOptions(control: any, fieldValue: any) {
    control.params.options = [];
    control.value = [];
    if (Array.isArray(fieldValue)) {
      for (let i = fieldValue.length - 1; i >= 0 ; i--) {
        if (fieldValue[i].sequence && fieldValue[i].data && fieldValue[i].data.datum) {
          const selectedField = this.setOptionsArray(fieldValue[i].sequence, fieldValue[i].data.datum);
          (control.params.options).push(selectedField);
          const selectedValue = this.setValueArray(fieldValue[i].sequence, fieldValue[i].data.datum);
          (control.value).push(selectedValue);
        }
      }
    } else {
      if (fieldValue.sequence && fieldValue.data && fieldValue.data.datum) {
        const selectedField = this.setOptionsArray(fieldValue.sequence, fieldValue.data.datum);
        (control.params.options).push(selectedField);
        const selectedValue = this.setValueArray(fieldValue.sequence, fieldValue.data.datum);
        (control.value).push(selectedValue);
      }
    }
  }

  setOptionsArray(sequence, datum) {
    const fieldValSet = [];
    if (Array.isArray(datum)) {
      datum.forEach(ele => {
        const fieldLabel = this.setExpansionPanelKeyValuePair(ele.verb, ele.text);
        (fieldValSet).push(fieldLabel);
      });
    } else {
      const fieldLabel = this.setExpansionPanelKeyValuePair(datum.verb, datum.text);
      (fieldValSet).push(fieldLabel);
    }
    const fullFieldValSet = fieldValSet.toString().replace('<br>,', '<br>');
    return { label: `${this.translateService.instant('SearchAmendment')} ${sequence}`, value: fullFieldValSet };
  }

  setValueArray(sequence, datum) {
    const fieldValSet = [];
    if (Array.isArray(datum)) {
      datum.forEach(ele => {
        const fieldLabel = this.setExpansionPanelValue(ele.verb, ele.text);
        (fieldValSet).push(fieldLabel);
      });
    } else {
      const fieldLabel = this.setExpansionPanelValue(datum.verb, datum.text);
      (fieldValSet).push(fieldLabel);
    }
    const fullFieldValSet = fieldValSet.toString().replace('\n,', '\n');
    return { label: `${this.translateService.instant('SearchAmendment')} ${sequence}`, value: fullFieldValSet };
  }

  setExpansionPanelKeyValuePair(verb: any, text: any) {
    let fieldLabel;
    if (verb === 'ADD') {
      fieldLabel = `<div><span class="addAmendStyle">/Add/</span>
        ${text} </div><br>`;
    } else if (verb === 'DELETE') {
      fieldLabel = `<div><span class="deleteAmendStyle">/Delete/</span>
        ${text} </div><br>`;
    } else {
      fieldLabel = `<div><span class="repallAmendStyle">/Repall/</span>
        ${text} </div><br>`;
    }
    return fieldLabel;
  }

  setExpansionPanelValue(verb: any, text: any) {
    let fieldLabel;
    if (verb === 'ADD') {
      fieldLabel = `/Add/ ${text} <br>\n`;
    } else if (verb === 'DELETE') {
      fieldLabel = `/Delete/ ${text} <br>\n `;
    } else if (verb === 'ISSUANCE'){
        fieldLabel = `${text}`;
    } else {
      fieldLabel = `/Repall/ ${text} <br>\n`;
    }
    return fieldLabel;
  }

  isFieldControlViewType(control){
    return (control && control.type && FccGlobalConstant.VIEW_CONTROL_TYPES.indexOf(control.type) > -1);
  }

  getFieldControlValue(control) {
    if (this.isFieldControlViewType(control)){
      return (control.value && control.value[0] && control.value[0].value) ? control.value[0].value : null;
    } else {
     return (control && this.commonService.isNonEmptyValue(control.value)) ?
      control.value : null;
    }

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jsonObjectWithKey(key,name: string, type: string, layoutClass?: string, styleClass?: any, showLabel = false, fieldName?: any,
    labelStyleClass?: any, valueStyleClass?: any): any {
    const nameStr = 'name';
    const typeStr = 'type';
    const layoutClassStr = 'layoutClass';
    const styleClassStr = 'styleClass';
    const labelStyleClassStr = 'labelStyleClass';
    const valueStyleClassStr = 'valueStyleClass';
    const showLabelStr = 'showLabel';
    const rendered = 'rendered';
    const previewScreen = 'previewScreen';
    const fullWidthView = 'fullWidthView';
    const dynamicCriteriaStr = 'dynamicCriteria';
    const groupChildrenStr = 'groupChildren';
    const groupheadStr = 'grouphead';
    const clubbedListStr = 'clubbedList';
    const clubbedDelimiterStr = 'clubbedDelimiter';
    const clubbedHeaderTextStr = 'clubbedHeaderText';
    const clubbedStr = 'clubbed';
    this.obj = {};
    this.obj[nameStr] = name;
    this.obj['key'] = key;
    this.obj[typeStr] = type;
    this.obj[layoutClassStr] = layoutClass;
    this.obj[styleClassStr] = styleClass;
    this.obj[labelStyleClassStr] = labelStyleClass;
    this.obj[valueStyleClassStr] = valueStyleClass;
    this.obj[showLabelStr] = fieldName.showLabel;
    this.obj[rendered] = fieldName.rendered;
    this.obj[dynamicCriteriaStr] = fieldName.dynamicCriteria;
    this.obj[groupChildrenStr] = fieldName.groupChildren;
    this.obj[groupheadStr] = fieldName.grouphead;
    this.obj[clubbedHeaderTextStr] = fieldName.clubbedHeaderText;
    this.obj[clubbedListStr] = fieldName.clubbedList;
    this.obj[clubbedDelimiterStr] = fieldName.clubbedDelimiter;
    this.obj[clubbedStr] = fieldName.clubbed,
    this.obj[previewScreen] = fieldName.previewScreen === false ? false : true,
    this.obj[fullWidthView] = fieldName.fullWidthView;
    this.obj['feildType'] = fieldName.feildType;
    return this.obj;
  }
}

interface TabObject {
  templateHeader: any;
  templateName: any;
  templateData: any;
  controlName: any;
  // display: any;
}
