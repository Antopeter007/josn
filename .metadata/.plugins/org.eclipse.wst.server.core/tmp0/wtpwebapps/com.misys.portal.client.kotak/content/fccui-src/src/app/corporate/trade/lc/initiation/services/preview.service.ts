import { Injectable } from '@angular/core';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';

import { UtilityService } from './utility.service';
import {
  Account,
  TransactionAddress,
  AlternateApplicantDetails,
  Amount,
  ApplicableRule,
  Applicant,
  Attachments,
  Bank,
  BankInstructions,
  Beneficiary,
  Charge,
  Confirmation,
  DraftDetails,
  ImportLetterOfCredit,
  IssuingBank,
  LcDetails,
  LcTypes,
  License,
  Narrative,
  OtherDetails,
  PaymentDetails,
  PresentationPeriod,
  Revolving,
  Shipment,
  Tenor,
  Tolerance,
} from '../model/models';
import { TranslateService } from '@ngx-translate/core';
import { FCCFormControl } from './../../../../../base/model/fcc-control.model';
import { CommonService } from './../../../../../common/services/common.service';
import { NewPhraseComponent } from './../../../../../common/components/new-phrase/new-phrase.component';
import { FormControlService } from './form-control.service';
import { FccTradeFieldConstants } from '../../../common/fcc-trade-field-constants';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {

  constructor(protected utilityService: UtilityService, protected translateService: TranslateService,
              protected formControlService: FormControlService,
              protected commonService: CommonService, protected newPhraseComponent: NewPhraseComponent) { }

  readonly label = 'label';
  readonly previewValueAttr = 'previewValueAttr';
  readonly previewValConcatinated = 'previewValConcatinated';
  readonly SOURCE = 'source';
  customerInstructionProductList = FccGlobalConstant.customerInstructionProductList;

  // submit
  lcRequestForm = new ImportLetterOfCredit();
  lcDetails = new LcDetails();
  lcType = new LcTypes();
  applicant = new Applicant();
  alternateApplicant = new AlternateApplicantDetails();
  beneficiary = new Beneficiary();
  amount = new Amount();
  amountTolerance = new Tolerance();
  confirmation = new Confirmation();
  chargeDetail = new Charge();
  revolving = new Revolving();
  paymentDetails = new PaymentDetails();
  shipment = new Shipment();
  issuingBank = new IssuingBank();
  advisingBank = new Bank();
  adviseThruBank = new Bank();
  requestedConfirmationParty = new Bank();
  license = new License();
  narrative = new Narrative();
  bankInstructions = new BankInstructions();
  attachments = new Attachments();
  draftDetails = new DraftDetails();
  otherDetails = new OtherDetails();
  applicableRules = new ApplicableRule();
  address = new TransactionAddress();
  tenor = new Tenor();
  periodOfPresentation = new PresentationPeriod();
  account = new Account();
  inputDraweeDetails: any;
  accordionData:any = [];
  accordionhostComponentData:any;
  accordionListBoxSelection:boolean = false;
  productCodeList = ['LC', 'IR','EL', 'TF','SI','SR','SG', 'FT', 'BR','BG', 'LI','IC','EC','LN','TD', 'SE'];

  getValue(control, localiseValue): string {
    const type = (null !== control && undefined !== control) ? control.type : null;
    let value: string;
    switch (type) {
      case 'text':
      case FccGlobalConstant.inputText:
      case FccGlobalConstant.inputRadio:
      case FccGlobalConstant.inputRadioCheck:
      case 'input-table':
      case 'input-cb':
        value = this.getGeneralControlValue(control);
        break;
      case 'view-mode':
        value = this.getViewModeControlValue(control);
        break;
      case FccGlobalConstant.inputDropdown:
        value = this.getInputDowpDownValue(control);
        break;
      case FccGlobalConstant.inputBackDate:
      case FccGlobalConstant.inputDate:
        value = this. getInputDateControlVaue(control);
        break;
      case 'input-dropdown-filter':
        value = this.getInputDropDownFilerValue(control);
        break;
      case 'checkbox':
        value = this.getCheckBoxValue(control);
        break;
      case 'view-mode-select':
        value = this.getViewModeSelctValue(control);
        break;
      case FccGlobalConstant.amendNarrativeTextArea:
        value = this.setAmendNarrativeTextArea(control);
        break;
        case FccGlobalConstant.inputTextArea:
          value = this.setNarrativeTextArea(control);
          break;
      case FccGlobalConstant.expansionPanel:
        value = this.setExpansionPanelOptions(control);
        break;
      case 'input-auto-comp':
        value = this.getAutoCompleteValue(control);
        break;
      case FccGlobalConstant.selectButton:
        value = this.getSelectButtonValue(control);
        break;
      default:
        value = this.getGeneralControlValue(control);
    }
    if (value && value.toString().trim() && value.toString().length > 0) {
      return this.localizedValues(value, type, localiseValue, control.params.source, control.key);
    }
    return '';
  }

  getSelectButtonValue(control: any): string {
    let val = '';
    if (control?.params?.previewMultiple && control?.options?.length > 0) {
      control.options.forEach((obj) => {
        val = val.concat(obj.label);
        val = val.concat(';');
      });
      val = val.endsWith(';') ? val.substring(0, val.length - 1) : val;
    } else {
      val = this.getGeneralControlValue(control);
    }
    return val;
  }

  protected setExpansionPanelOptions(control: any) {
    if (control.value && control.value !== '' && control.value !== undefined && control.value !== null) {
      return control.value.value;
    } else {
      return control.value;
    }
  }

  protected setAmendNarrativeTextArea(control: any) {
    const operation = this.commonService.getQueryParametersFromKey ('operation');
    const eventTnxStatCode = this.commonService.getQueryParametersFromKey ('eventTnxStatCode');
    let selectedValue = '';
    if (control.value && control.value.items) {
      if (Array.isArray(control.value.items)) {
        control.value.items.forEach(ele => {
          const selectedField = this.setAmendNarrativeArray(ele.verb, ele.text);
          selectedValue = selectedValue.concat(selectedField);
        });
      } else {
        const selectedField = this.setAmendNarrativeArray(control.value.items.verb, control.value.items.text);
        selectedValue = selectedField;
      }
    }
    this.commonService.pdfDecodeValue = false;
    if ((operation === FccGlobalConstant.LIST_INQUIRY || eventTnxStatCode)
      && (!this.commonService.modePdf)) {
    selectedValue = selectedValue.replace(/\n/g, '<br>');
  }
    return selectedValue;
  }

  setAmendNarrativeArray(verb: any, text: any) {
    let fieldLabel;
    if (verb === 'add' || verb === 'ADD') {
      fieldLabel = `/Add/ ${text} \n`;
    } else if (verb === 'delete' || verb === 'DELETE') {
      fieldLabel = `/Delete/ ${text} \n`;
    } else {
      fieldLabel = `/Repall/ ${text} \n`;
    }
    if (this.commonService.pdfDecodeValue) {
     const fieldValSet = this.commonService.decodeHtml(fieldLabel);
     fieldLabel = fieldValSet.toString().replace('<br>,', '<br>');
    }
    return fieldLabel;
  }

  formCurrentNarrativeValue(control: any){
    if (this.commonService.isnonEMptyString(control.value) && control.value.includes('verb')) {
      let currentNarrativeValue = '';
      const jsonObj = JSON.parse(control.value);
      if (Array.isArray(jsonObj)){
        jsonObj.forEach(ele => {
          const selectedField = this.setAmendNarrativeArray(ele.verb, ele.text);
          currentNarrativeValue = currentNarrativeValue.concat(selectedField);
        });
      }
      else{
        currentNarrativeValue = this.setAmendNarrativeArray(jsonObj.verb, jsonObj.text);
      }
      return currentNarrativeValue;
    }
  }

  formMasterNarrativeValue(masterNarrativeDetailsJSON: any){
    let masterNarrativeValue = '';
    let issuanceData = '';
    if (masterNarrativeDetailsJSON.issuance && masterNarrativeDetailsJSON.issuance.sequence
      && masterNarrativeDetailsJSON.issuance.data && masterNarrativeDetailsJSON.issuance.data.datum
      && masterNarrativeDetailsJSON.issuance.data.datum.text) {
        issuanceData = this.translateService.instant('ISSUANCE').concat(`\n`);
        const selectedField = this.formControlService.setValueArray(masterNarrativeDetailsJSON.issuance.sequence,
          masterNarrativeDetailsJSON.issuance.data.datum);
          issuanceData = issuanceData.concat(selectedField.value);
    }
    let amendNarrative = '';
    let amendDetails = [];
    let isDataRepallOperation = false;
    if (masterNarrativeDetailsJSON.amendments && masterNarrativeDetailsJSON.amendments.amendment) {
      if (Array.isArray(masterNarrativeDetailsJSON.amendments.amendment)) {
        let lastVerb = '';
        let lastJson = null;
        masterNarrativeDetailsJSON.amendments.amendment.forEach(element => {
          const selectedJson: { verb: any; sequence: any, data: any, datum: any } = {
           verb : element.verb,
            sequence: element.sequence,
            data: element.data,
            datum: element.datum
          };
          if(lastVerb === 'REPALL'){
            amendDetails = [];
            amendDetails.push(lastJson);
            amendDetails.push(selectedJson);
            isDataRepallOperation = true;
          }
          else{
            amendDetails.push(selectedJson);
          }
          lastVerb = element.data.datum.verb;
          lastJson = selectedJson;
        });
      } else {
        const selectedJson1: { verb: any; sequence: any, data: any, datum: any } = {
          verb : masterNarrativeDetailsJSON.amendments.amendment.verb,
           sequence: masterNarrativeDetailsJSON.amendments.amendment.sequence,
           data: masterNarrativeDetailsJSON.amendments.amendment.data,
           datum: masterNarrativeDetailsJSON.amendments.amendment.datum
        };
        amendDetails.push(selectedJson1);
      }
      for (let i = 0; i < amendDetails.length; i++) {
        if (amendDetails[i].data && amendDetails[i].data.datum) {
          const selectedField1 = this.formControlService.setValueArray(amendDetails[i].sequence, amendDetails[i].data.datum);
          if(i > 0){
            amendNarrative = amendNarrative.concat(`\n`.concat(FccTradeFieldConstants.NEW_LINE).concat(`\n`));
          }
          if(amendDetails[i].sequence !== undefined){
            amendNarrative = amendNarrative.concat(selectedField1.label).concat(`\n`);
          }
          amendNarrative = amendNarrative.concat(this.commonService.decodeHtml(selectedField1.value.replace('\n ,', '\n')));
        }
      }
      if(this.commonService.isnonEMptyString(issuanceData) && !isDataRepallOperation){
        masterNarrativeValue = issuanceData.concat(`\n`);
        masterNarrativeValue = masterNarrativeValue.concat(`\n`.concat(FccTradeFieldConstants.NEW_LINE).concat(`\n`));
        masterNarrativeValue = masterNarrativeValue.concat(amendNarrative);
      }
      else{
        masterNarrativeValue = masterNarrativeValue.concat(amendNarrative);
      }
    }
    else{
      masterNarrativeValue = issuanceData;
    }
    return masterNarrativeValue;
  }

  getInputDropDownFilerValue(control: FCCFormControl): any {
    let value;
    if (control.params[this.previewValueAttr]) {
      const previewValueAttr = control.params[this.previewValueAttr];
      if (control.value) {
        value = control.value[previewValueAttr];
      }
    }

    if (control.value && (!value)) {
      if (control.value.name) {
        value = control.value.name;
      } else if (control.value.shortName) {
        value = control.value.shortName;
      } else if (control.value.label) {
        value = control.value.label;
      } else {
        if (typeof control.value !== 'object') {
          value = control.value;
        }
      }
    }
    return value;
  }

  getAutoCompleteValue(control: FCCFormControl): any {
    let value;
    if (control.params[this.previewValueAttr]) {
      const previewValueAttr = control.params[this.previewValueAttr];
      if (control.value) {
        value = control.value[previewValueAttr];
      }
    }

    if (control.value && (!value)) {
      if (control.value.name) {
        value = control.value.name;
      } else if (control.value.shortName) {
        value = control.value.shortName;
      } else if (control.value.label) {
        value = control.value.label;
      } else {
        if (typeof control.value !== 'object') {
          value = control.value;
        }
      }
    }
    return value;
  }

  getInputDowpDownValue(control: FCCFormControl): any {
    let value;
    if (control.value) {
      if (control.value.smallName) {
        value = control.value.smallName;
      } else if (control.value.shortName) {
        value = control.value.shortName;
      } else if (control.value.label) {
        value = control.value.label;
      } else {
        if (typeof control.value !== 'object') {
          value = control.value;
        }
      }
    }
    return value;
  }

  getInputDateControlVaue(control: FCCFormControl): any {
    let value;
    if (control.value) {
      value = this.utilityService.transformDateFormat(control.value);
    }
    return value;
  }

  getCheckBoxValue(control: FCCFormControl): any {
    let value;
    if (control.value) {
      value = control.value;
    }
    return value;
  }

  setNarrativeTextArea(control: FCCFormControl): any {
    let value;
    const tnxid = this.commonService.getQueryParametersFromKey('tnxid');
    const operation = this.commonService.getQueryParametersFromKey ('operation');
    const eventTnxStatCode = this.commonService.getQueryParametersFromKey ('eventTnxStatCode');
    const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    if (control && control.value) {
      value = control.value;
      if (((operation === FccGlobalConstant.LIST_INQUIRY && tnxid) || eventTnxStatCode)
      && (!this.commonService.modePdf) && this.commonService.decodeNarrative) {
          value = value.replace(/\n/g, '<br>');
        }
      if (control.key === 'customerInstructionText' && control.value !== '' && this.customerInstructionProductList.includes(productCode)) {
        value = this.newPhraseComponent.xmlEncode(value);
      }
    }
    return value;
  }

  getGeneralControlValue(control: FCCFormControl): any {
    let value;
    if (control && control.value) {
      value = control.value;
    }
    return value;
  }

  getViewModeControlValue(control: FCCFormControl): any {
    let value;
    if (control && control.value && typeof control.value === FccGlobalConstant.OBJECT)
    {
      if (control.value.name) {
        value = control.value.name;
      } else if (control.value.shortName) {
        value = control.value.shortName;
      } else if (control.value.label) {
        value = control.value.label;
      }
    } else {
      value = control.value;
    }
    return value;
  }

  getMasterGeneralControlValue(control: FCCFormControl): any {
    let value;
    if (control.params[FccGlobalConstant.MASTER_VALUE]) {
      value = control.params[FccGlobalConstant.MASTER_VALUE];
    }
    return value;
  }

  getCheckBoxLabelValue(control: FCCFormControl) {
    let value;
    if (control.value && control.params[FccGlobalConstant.TRANSLATE]) {
      value = control.value;
    } else if (control.value && control.value.toString() !== 'N' && control.params) {
      value = control.params[this.label];
    }
    if (value && value.toString().length > 0) {
      return this.localizedValues(value, control.type, true, control.params[this.SOURCE]);
    }
    return '';
  }

  getMasterCheckBoxLabelValue(control: FCCFormControl) {
    let value;
    if (control.params[FccGlobalConstant.MASTER_VALUE] && control.params[FccGlobalConstant.TRANSLATE]) {
      value = control.params[FccGlobalConstant.MASTER_VALUE].toString();
    } else if (control.params[FccGlobalConstant.MASTER_VALUE] &&
          control.params[FccGlobalConstant.MASTER_VALUE].toString() !== this.translateService.instant('N') && control.params) {
      value = control.params[this.label];
    }
    if (value && value.toString().length > 0) {
      return this.localizedValues(value, control.type, true, control.params[this.SOURCE]);
    }
    return '';
  }

  getViewModeSelctValue(control: FCCFormControl) {
    let value;
    if (control.value) {
      if (control.value[0].shortName) {
        value = control.value[0].shortName;
      } else if (control.value[0].label) {
        value = control.value[0].label;
      } else {
        if (typeof control.value !== 'object') {
          value = control.value;
        }
      }
    }
    return value;
  }

  getPersistenceValue(control, localiseValue, forAPIRequestObj = false, autoSaveFlag = false): string {
    const type = control.type;
    let value: string;
    switch (type) {
      case 'text':
      case FccGlobalConstant.inputText:
      case FccGlobalConstant.inputRadio:
      case FccGlobalConstant.inputRadioCheck:
      case FccGlobalConstant.selectButton:
      case 'input-table':
      case 'input-cb':
      case 'checkbox':
        value = this.getDefaultValueFromControl(control, value);
        break;
      case 'input-auto-comp':
        if (autoSaveFlag) {
          value = this.getDefaultValueFromControl(control, value);
        } else {
          value = this.getValueOfAutoCompleteForPersistence(control, value);
        }
        break;
      case FccGlobalConstant.inputDropdown:
        value = this.getValueOfInputDropdownForPersistence(control, value);
        break;
      case FccGlobalConstant.inputBackDate:
      case FccGlobalConstant.inputDate:
        if (control.value) {
          value = this.utilityService.transformDateFormat(control.value);
        }
        break;
      case 'input-dropdown-filter':
        if (autoSaveFlag) {
          value = this.getDefaultValueFromControl(control, value);
        } else {
          value = this.getValueOfInputDropdownFilterForPersistence(control, value);
        }
        break;
      case 'view-mode-select':
        value = this.getValueOfViewModeSelectForPersistence(control, value);
        break;
      case 'view-mode':
        value = this.getValueOfViewModeForPersistence(control, value);
        break;
      case FccGlobalConstant.EDIT_TABLE:
        if (autoSaveFlag) {
          value = this.getDefaultValueFromTableControl(control, value);
        } else {
          value = this.getDefaultValueFromControl(control, value);
        }
        break;
      default:
        value = this.getDefaultValueFromControl(control, value);
    }
    if (type === FccGlobalConstant.inputDropdown || forAPIRequestObj) {
      return value !== undefined ? value : '';
    } else if (value && value.toString().length > 0) {
      return this.localizedValues(value, type, localiseValue, control.params.source, control.key);
    }
    return '';
  }

  getTableDataValue(controls, fieldName, fieldValue, forAPIRequestObj = false) {
    const type = controls[fieldName].type;
    let value: string;
    switch (type) {
      case 'input-dropdown-filter':
        value = fieldValue ? fieldValue.shortName : '';
        break;
      case 'input-auto-comp':
        value = fieldValue ? fieldValue.shortName : '';
        break;
      default:
        value = fieldValue;
    }
    if (forAPIRequestObj) {
      return (value !== undefined && value !== null) ? value : '';
    }
    return value;
  }

  protected getDefaultValueFromControl(control: any, value: string) {
    if (control.value) {
      value = control.value;
    }
    return value;
  }

  protected getDefaultValueFromTableControl(control: any, value: string) {
    let tableValue;
    if (control.params?.columns?.length && control.params?.data?.length) {
      tableValue = {
        columns: control.params.columns,
        data: control.params.data
      };
    } else {
      this.getDefaultValueFromControl(control, value);
    }
    return tableValue;
  }

  protected getValueOfViewModeSelectForPersistence(control: any, value: string) {
    if (control.value) {
      if (control.value[0].shortName) {
        value = control.value[0].shortName;
      } else if (control.value[0].label) {
        value = control.value[0].label;
      } else {
        if (typeof control.value !== 'object') {
          value = control.value;
        }
      }
    }
    return value;
  }

  protected getValueOfViewModeForPersistence(control: any, value: string) {
    if (control.value && control.params[FccGlobalConstant.OPTIONS] &&
        control.params[FccGlobalConstant.OPTIONS].length > 0 && control.params[FccGlobalConstant.AMEND_PERSISTENCE_SAVE]) {
      // value = control.params[FccGlobalConstant.OPTIONS][0].value ? control.params[FccGlobalConstant.OPTIONS][0].value : '';
        control.params[FccGlobalConstant.OPTIONS].forEach(element => {
          if (control.value === element.label) {
            value = element.value;
          }
        });
    } else if (control.value) {
      if (typeof control.value !== 'object' && control.value !== ' ') {
        value = control.value;
      } else if (control.value.shortName) {
        value = control.value.shortName;
      } else if (control.value.label) {
        value = control.value.label;
      }
    }
    return value;
  }

  protected getValueOfInputDropdownFilterForPersistence(control: any, value: string) {
    if (control.params[this.previewValueAttr] &&
      (control.params[this.previewValConcatinated] !== 'Y') ) {
      const previewValueAttr = control.params[this.previewValueAttr];
      if (control.value) {
        value = control.value[previewValueAttr];
      }
    } else {
      if (control.value) {
      if (control.value.shortName) {
        value = control.value.shortName;
      } else if (control.value.label) {
        value = control.value.label;
      } else {
        if (typeof control.value !== 'object') {
          value = control.value;
        }
      }
    }
    }
    return value;
  }

  protected getValueOfInputDropdownForPersistence(control: any, value: string) {
    if (control.value) {
      if (control.value.smallName) {
        value = control.value.smallName;
      } else if (control.value.label) {
        value = control.value.label;
      } else if (control.value.shortName) {
        value = control.value.shortName;
      } else {
        if (typeof control.value !== 'object') {
          value = control.value;
        }
      }
    }
    return value;
  }

  protected getValueOfAutoCompleteForPersistence(control: any, value: string) {
    if (control.value) {
      if (control.value.name) {
        value = control.value.name;
      }else if (control.value.label) {
        value = control.value.label;
      } else if (control.value.shortName) {
        value = control.value.shortName;
      } else {
        if (typeof control.value !== 'object') {
          value = control.value;
        }
      }
    }
    return value;
  }

  localizedValues(value: any, type, localiseValue: boolean, source?: any, name?: string): string {
    value = value.toString();
    if (source) {
      let translatedVal = '';
      if (value.indexOf(',') > -1) {
        value.split(',').forEach(str => {
          if (localiseValue) {
            str = name.concat('_').concat(str);
          }
          if (str) {
            translatedVal += `${this.translateService.instant(str)}`;
            translatedVal += ',';
          }
        });
        translatedVal = translatedVal.slice(0, -1);
      } else {
        if (localiseValue) {
          value = name.concat('_').concat(value);
        }
        translatedVal = `${this.translateService.instant(value)}`;
      }
      return translatedVal;
    } else {
      return value;
    }
  }

  // submitForm(sectionMap) {
  //   for (const [mapKey, mapValue] of sectionMap) {
  //     if (mapKey === FccGlobalConstant.GENERAL_DETAILS && mapValue) {
  //       this.generalDetailsRequest(mapValue);
  //     } else if (mapKey === FccGlobalConstant.APPLICANT_BENEFICIARY && mapValue) {
  //       this.applicantDetailsRequest(mapValue);
  //     } else if (mapKey === FccGlobalConstant.BANK_DETAILS && mapValue) {
  //       this.bankDetailsRequest(mapValue);
  //     } else if (mapKey === FccGlobalConstant.AMOUNT_CHARGE_DETAILS && mapValue) {
  //       this.amountChargeDetailsRequest(mapValue);
  //     } else if (mapKey === FccGlobalConstant.PAYMENT_DETAILS && mapValue) {
  //       this.paymentDetailsRequest(mapValue);
  //     } else if (mapKey === FccGlobalConstant.SHIPMENT_DETAILS && mapValue) {
  //       this.shipmentDetailsRequest(mapValue);
  //     } else if (mapKey === FccGlobalConstant.NARRATIVE_DETAILS && mapValue) {
  //       this.narrativeDetailsRequest(mapValue);
  //     } else if (mapKey === FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY && mapValue) {
  //       this.instructionForBankDetailsRequest(mapValue);
  //     }
  //   }

  //   const reauthData: any = {
  //     action: FccGlobalConstant.SUBMIT,
  //     lcRequestForm: this.lcRequestForm
  //   };
  //   this.reauthService.reauthenticate(reauthData, FccGlobalConstant.reAuthComponentKey);
  // }

  generalDetailsRequest(mapValue) {
    if (mapValue.value.requestType === FccGlobalConstant.PROVISIONAL) {
      this.otherDetails.provisional = true;
    } else {
      this.otherDetails.provisional = false;
    }
    this.otherDetails.transactionType = 'NEW';
    this.lcDetails.issueBy = mapValue.value.transmissionMode.toUpperCase();
    this.lcDetails.expiryDate = this.utilityService.transformDate(mapValue.value.expiryDate);
    this.lcDetails.expiryPlace = mapValue.value.placeOfExpiry;
    if (mapValue.value.confirmationOptions === FccGlobalConstant.MAYADD) {
      this.confirmation.instruction = 'MAY-ADD';
    } else {
      this.confirmation.instruction = mapValue.value.confirmationOptions.toUpperCase();
    }
    this.applicableRules.id = mapValue.value.applicableRulesOptions.shortName;
    if (mapValue.value.applicableRulesOptions === FccGlobalConstant.OTHER) {
      this.applicableRules.narrative = mapValue.value.otherApplicableRules;
    }
    // this .applicableRules.narrative = mapValue.value.otherApplicableRules;
    this.lcDetails.applicableRule = this.applicableRules;
    this.lcType.transferable = false;
    this.lcType.revolving = false;
    this.lcType.standbyLC = false;
    // if (mapValue.value.featureofLCOptions === FccGlobalConstant.IRREVOCABLE) {
    //     this .lcType.transferable = true;
    //   }
    // if (mapValue.value.featureofLCOptions === FccGlobalConstant.REVOLVING) {
    //     this .lcType.revolving = true;
    //   }
    // if (mapValue.value.featureofLCOptions === FccGlobalConstant.NON_TRANSFERABLE) {
    //     this .lcType.standbyLC = true;
    //   }
    for (let i = 0; i < mapValue.value.featureofLCOptions.length; i++) {
      if (mapValue.value.featureofLCOptions[i] === 'irrevocable') {
        this.lcType.transferable = true;
      } else if (mapValue.value.featureofLCOptions[i] === 'revolving') {
        this.lcType.revolving = true;
      } else if (mapValue.value.featureofLCOptions[i] === 'nonTransferable') {
        this.lcType.standbyLC = true;
      }

    }
    this.lcDetails.senderReference = mapValue.value.customerReference;
    this.beneficiary.reference = mapValue.value.benefeciaryReference;

    this.lcRequestForm.lcDetails = this.lcDetails;
    this.lcRequestForm.beneficiary = this.beneficiary;
    this.lcRequestForm.lcType = this.lcType;
    this.lcRequestForm.confirmation = this.confirmation;
    this.lcRequestForm.otherDetails = this.otherDetails;
  }

  applicantDetailsRequest(mapValue) {
    if (mapValue.value.applicantEntity) {
      this.applicant.entityShortName = mapValue.value.applicantEntity.shortName;
    }
    this.applicant.entityName = mapValue.value.applicantName;
    if (this.lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
      this.address.line1 = mapValue.value.applicantFirstAddress;
      this.address.line2 = mapValue.value.applicantSecondAddress;
      this.address.line3 = mapValue.value.applicantThirdAddress;
    } else {
      this.address.line1 = mapValue.value.applicantFullAddress;
    }
    this.applicant.address = this.address;
    this.alternateApplicant.name = mapValue.value.altApplicantName;
    if (this.lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
      this.alternateApplicant.line1 = mapValue.value.altApplicantFirstAddress;
      this.alternateApplicant.line2 = mapValue.value.altApplicantSecondAddress;
      this.alternateApplicant.line3 = mapValue.value.altApplicantThirdAddress;
    } else {
      this.alternateApplicant.line1 = mapValue.value.altApplicantFullAddress;
    }
    this.alternateApplicant.country = mapValue.value.altApplicantcountry.shortName;
    this.beneficiary.name = mapValue.value.beneficiaryEntity.label;
    this.beneficiary.shortName = mapValue.value.beneficiaryEntity.shortName;
    this.address = new TransactionAddress();
    if (this.lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
      this.address.line1 = mapValue.value.beneficiaryFirstAddress;
      this.address.line2 = mapValue.value.beneficiarySecondAddress;
      this.address.line3 = mapValue.value.beneficiaryThirdAddress;
    } else {
      this.address.line1 = mapValue.value.beneficiaryFullAddress;
    }
    this.beneficiary.address = this.address;
    this.beneficiary.country = mapValue.value.beneficiarycountry.shortName;
    this.lcRequestForm.applicant = this.applicant;
    this.lcRequestForm.alternateApplicant = this.alternateApplicant;
    this.lcRequestForm.beneficiary = this.beneficiary;
  }

  bankDetailsRequest(mapValue) {
    this.issuingBank.bankShortName = mapValue.value.bankNameList.smallName;
    this.issuingBank.issuersReference = mapValue.value.issuerReferenceList.shortName;
    this.advisingBank.bicCode = mapValue.value.advisingswiftCode;
    this.advisingBank.name = mapValue.value.advisingBankName;
    this.address = new TransactionAddress();
    if (this.lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
      this.address.line1 = mapValue.value.advisingBankFirstAddress;
      this.address.line2 = mapValue.value.advisingBankSecondAddress;
      this.address.line3 = mapValue.value.advisingBankThirdAddress;
    } else {
      this.address.line1 = mapValue.value.advisingBankFullAddress;
    }
    this.advisingBank.address = this.address;

    this.adviseThruBank.bicCode = mapValue.value.swiftCode;
    this.adviseThruBank.name = mapValue.value.bankName;
    this.address = new TransactionAddress();
    if (this.lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
      this.address.line1 = mapValue.value.adviceThroughFirstAddress;
      this.address.line2 = mapValue.value.adviceThroughSecondAddress;
      this.address.line3 = mapValue.value.adviceThroughThirdAddress;
    } else {
      this.address.line1 = mapValue.value.adviceThroughFullAddress;
    }
    this.adviseThruBank.address = this.address;
    this.address = new TransactionAddress();
    if (this.confirmation.instruction === Confirmation.InstructionEnum.CONFIRM) {
      if (mapValue.value.counterPartyList === 'Advising Bank') {
        this.confirmation.requestedConfirmationPartyRole = Confirmation.RequestedConfirmationPartyRoleEnum.ADVISINGBANK;
      } else if (mapValue.value.counterPartyList === 'Advising Through') {
        this.confirmation.requestedConfirmationPartyRole = Confirmation.RequestedConfirmationPartyRoleEnum.ADVISETHROUGHBANK;
      } else if (mapValue.value.counterPartyList === 'Other') {
        this.confirmation.requestedConfirmationPartyRole = Confirmation.RequestedConfirmationPartyRoleEnum.OTHER;
      }
      this.requestedConfirmationParty.bicCode = mapValue.value.confirmationPartySwiftCode;
      this.requestedConfirmationParty.name = mapValue.value.confirmationBankName;
      if (this.lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
        this.address.line1 = mapValue.value.confirmationAddressFirstAddress;
        this.address.line2 = mapValue.value.confirmationAddressSecondAddress;
        this.address.line3 = mapValue.value.confirmationAddressThirdAddress;
      } else {
        this.address.line1 = mapValue.value.confirmationAddressFullAddress;
      }
    }
    this.requestedConfirmationParty.address = this.address;
    this.confirmation.requestedConfirmationParty = this.requestedConfirmationParty;
    this.lcRequestForm.confirmation = this.confirmation;
    this.lcRequestForm.issuingBank = this.issuingBank;
    this.lcRequestForm.advisingBank = this.advisingBank;
    this.lcRequestForm.adviseThroughBank = this.adviseThruBank;
  }

  amountChargeDetailsRequest(mapValue) {
    this.amount.currency = mapValue.value.currency.currencyCode;
    // Sending amount value with only decimals as per API confirmation
    const amt = mapValue.value.amount;
    this.amount.amount = amt.replace(/[^0-9.]/g, '');
    this.amountTolerance.maxPercentAmountTolerance = mapValue.value.percp;
    this.amountTolerance.minPercentAmountTolerance = mapValue.value.percm;

    if (mapValue.value.issuingBankCharges === 'issuingBankChargesApplicant') {
      this.chargeDetail.issuanceChargesPayableBy = Charge.IssuanceChargesPayableByEnum.APPLICANT;
    } else if (mapValue.value.issuingBankCharges === 'issuingBankChargesBeneficiary') {
      this.chargeDetail.issuanceChargesPayableBy = Charge.IssuanceChargesPayableByEnum.BENEFICIARY;
    } else {
      this.chargeDetail.issuanceChargesPayableBy = Charge.IssuanceChargesPayableByEnum.SHARED;
    }
    if (mapValue.value.outStdCurrency === 'outStdCurrencyApplicant') {
      this.chargeDetail.overseasChargesPayableBy = Charge.OverseasChargesPayableByEnum.APPLICANT;
    } else if (mapValue.value.outStdCurrency === 'outStdCurrencyBeneficiary') {
      this.chargeDetail.overseasChargesPayableBy = Charge.OverseasChargesPayableByEnum.BENEFICIARY;
    } else {
      this.chargeDetail.overseasChargesPayableBy = Charge.OverseasChargesPayableByEnum.SHARED;
    }
    if (this.confirmation.instruction === Confirmation.InstructionEnum.CONFIRM) {

    }
    if (mapValue.value.cumulativeCheckbox) {
      this.revolving.cumulative = true;
    } else {
      this.revolving.cumulative = false;
    }
    if (mapValue.value.revolveFrequency === 'days') {
      this.revolving.frequency = Revolving.FrequencyEnum.D;
    }
    if (mapValue.value.revolveFrequency === 'months') {
      this.revolving.frequency = Revolving.FrequencyEnum.M;
    }

    this.revolving.period = mapValue.value.revolvePeriod;
    this.revolving.revolutions = mapValue.value.numberOfTimesToRevolve;
    this.revolving.noticeDays = mapValue.value.noticeDays;
    this.narrative.additionalAmount = mapValue.value.addamt;

    this.lcRequestForm.narrative = this.narrative;
    this.lcRequestForm.revolving = this.revolving;
    this.lcRequestForm.chargeDetail = this.chargeDetail;
    this.lcRequestForm.amountTolerance = this.amountTolerance;
    this.lcRequestForm.amount = this.amount;
  }

  paymentDetailsRequest(mapValue) {

    if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateService.instant('issuingBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.ISSUINGBANK;
    } else if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateService.instant('otherBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.OTHER;
    } else if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateService.instant('anyBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.ANYBANK;
    } else if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateService.instant('advisingBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.ADVISINGBANK;
    }
    this.paymentDetails.bankName = mapValue.value.paymentDetailsBankName;
    this.address = new TransactionAddress();
    if (this.lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
      this.address.line1 = mapValue.value.paymentDetailsBankFirstAddress;
      this.address.line2 = mapValue.value.paymentDetailsBankSecondAddress;
      this.address.line3 = mapValue.value.paymentDetailsBankThirdAddress;
    } else {
      this.address.line1 = mapValue.value.paymentDetailsBankFirstAddress;
    }
    this.paymentDetails.address = this.address;
    if (mapValue.value.creditAvailableOptions === 'payment') {
      this.paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.SIGHTPAYMENT;
      this.tenor.sight = 'SIGHT';
    } else if (mapValue.value.creditAvailableOptions === 'mixedPayment') {
      this.paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.MIXEDPAYMENT;
      this.paymentDetails.mixedPayDetail = mapValue.value.inputTextAreaMixPayment;
    } else {
      if (mapValue.value.creditAvailableOptions.toUpperCase() === PaymentDetails.CreditAvailableByEnum.ACCEPTANCE) {
        this.paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.ACCEPTANCE;
        this.tenor.sight = null;
        this.paymentDetails.draftsDrawnOn = this.inputDraweeDetails;
      }
      if (mapValue.value.creditAvailableOptions.toUpperCase() === PaymentDetails.CreditAvailableByEnum.NEGOTIATION) {
        this.paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.NEGOTIATION;
        if (mapValue.value.paymentDraftWidget === 'Sight') {
          this.tenor.sight = 'SIGHT';
        } else {
          this.tenor.sight = null;
        }
        this.paymentDetails.draftsDrawnOn = this.inputDraweeDetails;
      }
      if (mapValue.value.creditAvailableOptions === 'deferredPayment') {
        this.tenor.sight = null;
        this.paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.DEFERREDPAYMENT;
      }

      this.paymentOptions(mapValue);
    }
    this.paymentDetails.tenor = this.tenor;

    this.lcRequestForm.paymentDetails = this.paymentDetails;
  }

  shipmentDetailsRequest(mapValue) {
    this.shipment.from = mapValue.value.shipmentForm;
    this.shipment.to = mapValue.value.shipmentTo;
    this.shipment.portOfLoading = mapValue.value.shipmentPlaceOfLoading;
    this.shipment.portOfDischarge = mapValue.value.shipmentPlaceOfDischarge;
    if (mapValue.value.lastShipmentDate !== '') {
      this.shipment.date = this.utilityService.transformDate(mapValue.value.shipmentLastDate);
    } else {
      this.shipment.period = mapValue.value.shipmentPeriodText;
    }

    if (mapValue.value.partialshipmentvalue !== '') {
      if (mapValue.value.partialshipmentvalue === 'allowed') {
        this.shipment.partialShipment = Shipment.PartialShipmentEnum.ALLOWED;
      } else if (mapValue.value.partialshipmentvalue === 'notallowed') {
        this.shipment.partialShipment = Shipment.PartialShipmentEnum.NOTALLOWED;
      } else {
        this.shipment.partialShipment = Shipment.PartialShipmentEnum.CONDITIONAL;
      }
    }
    if (mapValue.value.transhipmentvalue !== '') {
      if (mapValue.value.transhipmentvalue === 'ALLOWEDT') {
        this.shipment.transhipment = Shipment.TranshipmentEnum.ALLOWED;
      } else if (mapValue.value.transhipmentvalue === 'NOT ALLOWEDT') {
        this.shipment.transhipment = Shipment.TranshipmentEnum.NOTALLOWED;
      } else {
        this.shipment.transhipment = Shipment.TranshipmentEnum.CONDITIONAL;
      }
    }
    this.shipment.incoTerms = mapValue.value.purchaseTermsValue.label;
    this.shipment.incoPlace = mapValue.value.namedPlace;
    this.lcRequestForm.shipment = this.shipment;
  }

  narrativeDetailsRequest(mapValue) {
    this.narrative.goodsDescription = mapValue.value.descOfGoodsText;
    this.narrative.documentsRequired = mapValue.value.docRequiredText;
    this.narrative.additionalConditions = mapValue.value.addInstructionText;
    this.narrative.specialPaymentConditionsForBeneficiary = mapValue.value.splPaymentBeneText;
    this.periodOfPresentation.presentationDays = mapValue.value.nbdays;
    this.periodOfPresentation.presentationPeriodNarrative = mapValue.value.periodOfPresentationText;
    this.narrative.presentationPeriod = this.periodOfPresentation;
    this.lcRequestForm.narrative = this.narrative;
  }

  instructionForBankDetailsRequest(mapValue) {
    this.account.number = mapValue.value.principalAct.label;
    this.bankInstructions.principalAccount = this.account;
    this.account.number = mapValue.value.feeAct.label;
    this.bankInstructions.feeAccount = this.account;
    this.narrative.otherInformation = mapValue.value.otherInst;
    this.lcRequestForm.bankInstructions = this.bankInstructions;
    this.lcRequestForm.narrative = this.narrative;
  }

  paymentOptions(mapValue) {
    if (mapValue.value.fixedMaturityPaymentDate !== '') {
      this.tenor.maturityDate = this.utilityService.transformDate(mapValue.value.fixedMaturityPaymentDate);
    } else {
      if (mapValue.value.inputDays.label === 'Days') {
        this.tenor.frequency = Tenor.FrequencyEnum.D;
      } else if (mapValue.value.inputDays.label === 'Weeks') {
        this.tenor.frequency = Tenor.FrequencyEnum.W;
      } else if (mapValue.value.inputDays.label === 'Months') {
        this.tenor.frequency = Tenor.FrequencyEnum.M;
      } else if (mapValue.value.inputDays.label === 'Years') {
        this.tenor.frequency = Tenor.FrequencyEnum.Y;
      }
      this.tenor.fromAfter = mapValue.value.inputFrom.label;
      if (mapValue.value.inputSelect) {
        if (mapValue.value.inputSelect.shortName === this.translateService.instant('airwaybill')) {
          this.tenor.start = Tenor.StartEnum.AIRWAYBILL;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('arrivalOfgoods')) {
          this.tenor.start = Tenor.StartEnum.ARRIVALOFGOODS;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('billOfexchange')) {
          this.tenor.start = Tenor.StartEnum.BILLOFEXCHANGE;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('billOflading')) {
          this.tenor.start = Tenor.StartEnum.BILLOFLADING;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('invoice')) {
          this.tenor.start = Tenor.StartEnum.INVOICE;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('shipmentdate')) {
          this.tenor.start = Tenor.StartEnum.SHIPMENTDATE;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('inputSwitchSight')) {
          this.tenor.start = Tenor.StartEnum.SIGHT;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('otherBank')) {
          this.tenor.start = Tenor.StartEnum.OTHER;
        }
      }
      this.tenor.period = mapValue.value.inputValNum;
    }
  }

  getPreviousValue(control): string {
    const type = control.type;
    let value: string;
    switch (type) {
      case 'text':
      case FccGlobalConstant.inputText:
      case FccGlobalConstant.inputRadio:
      case FccGlobalConstant.inputRadioCheck:
      case FccGlobalConstant.selectButton:
      case FccGlobalConstant.INPUT_TABLE:
      case 'input-cb':
        value = this.getGeneralControlValue(control);
        break;
      case FccGlobalConstant.inputDropdown:
        value = this.getInputDowpDownValue(control);
        break;
      case FccGlobalConstant.inputBackDate:
      case FccGlobalConstant.inputDate:
        value = this. getInputDateControlVaue(control);
        break;
      case FccGlobalConstant.INPUT_DROPDOWN_FILTER:
        value = this.getInputDropDownFilerValue(control);
        break;
      case 'checkbox':
        value = this.getCheckBoxValue(control);
        break;
      case FccGlobalConstant.VIEW_MODE_SELECT:
        value = this.getViewModeSelctValue(control);
        break;
      case 'input-auto-comp':
        value = this.getAutoCompleteValue(control);
        break;
      default:
        value = this.getGeneralControlValue(control);
    }
    if (value && value.toString().length > 0) {
      return value;
    }
    return '';
  }

  getMasterValue(control): string {
    const type = control.type;
    let value: string;
    if (type === FccGlobalConstant.inputText || type === FccGlobalConstant.inputDropdown
      || type === FccGlobalConstant.inputRadioCheck) {
      value = this.getMasterGeneralControlValue(control);
    } else {
      value = this.getValue(control, true);
    }
    if (value && value.toString().length > 0) {
      return value;
    }
    return '';
  }

  isPreview(mode: string): boolean {
    if (mode === FccGlobalConstant.INITIATE || mode === FccGlobalConstant.DRAFT_OPTION ||
        mode === FccGlobalConstant.EXISTING || mode === FccGlobalConstant.MODE_PAYMENT || mode === FccGlobalConstant.VIEW) {
              return true;
    } else {
      return false;
    }
  }
  
  
  setCollapsibleMasterAccordion(control,productCode?:any,productCodeGlobalConst?:any,selectedTab?:any){
    if(this.accordionListBoxSelection){
      control.params.parentAccordionExpanded = true;
      control.params.childAccordionExpanded = true;
      control.params['isaccordionMultiExpandRequired'] = true;
      return;
    }
    productCode = this.commonService.isnonEMptyString(productCode) ? 
    productCode : this.commonService.getQueryParametersFromKey('productCode');
    productCodeGlobalConst = this.commonService.isnonEMptyString(productCodeGlobalConst) ? 
    productCodeGlobalConst : FccGlobalConstant.PRODUCT_LC;
    selectedTab = this.commonService.isnonEMptyString(selectedTab) ? 
    selectedTab : FccGlobalConstant.ITEM_ID_TNX;
    let tnxTypeCode = this.commonService.getQueryParametersFromKey('tnxTypeCode');
    const action = this.commonService.getQueryParametersFromKey('action');  
    const mode = this.commonService.getQueryParametersFromKey('mode');
    if(!this.commonService.isnonEMptyString(tnxTypeCode)){
      tnxTypeCode = this.commonService.currentStateTnxResponse?.tnx_type_code;
    } 
    if(this.productCodeList.indexOf(productCode) >= 0 && tnxTypeCode === FccGlobalConstant.LENGTH_13.toString() 
      && action === FccGlobalConstant.APPROVE && mode == FccGlobalConstant.VIEW_MODE
      && selectedTab === FccGlobalConstant.ITEM_ID_TNX){
      if(this.accordionData.indexOf(control.key) === -1){
        control.params.parentAccordionExpanded = false;
        control.params.childAccordionExpanded = false;
        control.params['isaccordionMultiExpandRequired'] = false;
      }
    }else{
      control.params.parentAccordionExpanded = true;
      control.params.childAccordionExpanded = true;
      control.params['isaccordionMultiExpandRequired'] = true;
    }
  }

  setControlExpandValue(isExpand,hostComponentData){
    let formcontrolsKeys = [];
    if(hostComponentData.form.controls){
       formcontrolsKeys = Object.keys(hostComponentData.form.controls);
    }
    if(formcontrolsKeys.length != 0){
      for (let index = 0; index < formcontrolsKeys.length; index++) {
        const element = formcontrolsKeys[index];
        if(this.accordionData.indexOf(element) === -1){
          if(isExpand){
            hostComponentData.form.controls[element].params.parentAccordionExpanded = true;
            hostComponentData.form.controls[element].params.childAccordionExpanded = true; 
          }else{
            hostComponentData.form.controls[element].params.parentAccordionExpanded = false;
            hostComponentData.form.controls[element].params.childAccordionExpanded = false; 
          }   
        }
      }
    } 
  }

}
