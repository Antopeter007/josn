import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from './../../../../../../common/core/fcc-global-constant.service';
import { AccountDetailsList } from './../../../../../../common/model/accountDetailsList';
import { CodeData } from './../../../../../../common/model/codeData';
import { CodeDataService } from './../../../../../../common/services/code-data.service';
import { FormModelService } from './../../../../../../common/services/form-model.service';
import { LcTemplateService } from './../../../../../../common/services/lc-template.service';
import { PhrasesService } from './../../../../../../common/services/phrases.service';
import { SearchLayoutService } from './../../../../../../common/services/search-layout.service';
import { AmendCommonService } from './../../../../../../corporate/common/services/amend-common.service';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { LeftSectionService } from './../../../../../../corporate/common/services/leftSection.service';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import {
  ImportLetterOfCreditResponse
} from './../../../../../../corporate/trade/lc/initiation/model/importLetterOfCreditResponse';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { LcReturnService } from './../../../../../../corporate/trade/lc/initiation/services/lc-return.service';
import { PrevNextService } from './../../../../../../corporate/trade/lc/initiation/services/prev-next.service';
import { UtilityService } from './../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { TradeCommonDataService } from '../../../../../../corporate/trade/common/service/trade-common-data.service';
import { FccTradeFieldConstants } from './../../../../../trade/common/fcc-trade-field-constants';
import { DashboardService } from './../../../../../../common/services/dashboard.service';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';

@Component({
  selector: 'app-si-instructions-to-bank-details',
  templateUrl: './si-instructions-to-bank-details.component.html',
  styleUrls: ['./si-instructions-to-bank-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiInstructionsToBankDetailsComponent }]
})
export class SiInstructionsToBankDetailsComponent extends SiProductComponent implements OnInit, OnDestroy {
  form: FCCFormGroup;
  module = `${this.translateService.instant(FccGlobalConstant.SI_INSTRUCTIONS_TO_BANK)}`;
  lcConstant = new LcConstant();
  enteredCharCount = this.lcConstant.enteredCharCounts;
  barLength: any;
  subheader = '';
  tnxTypeCode: any;
  subTnxTypeCode: any;
  phrasesResponseForInstToBank: any;
  rendered = this.lcConstant.rendered;
  params = this.lcConstant.params;
  lcResponseForm = new ImportLetterOfCreditResponse();
  displayValue: string;
  accounts = [];
  // summaryDetails: any;
  entityName: any;
  entityNameRendered: any;
  accountDetailsList: AccountDetailsList;
  entitiesList: any;
  finalTextValue = '';
  entityNameForPhrases: any;
  responseData: string;
  productCode: any;
  subProductCode: any;
  codeID: any;
  codeData = new CodeData();
  eventDataArray: any;
  dataArray: any;
  option;
  filterParams;
  sectionName = FccGlobalConstant.SI_INSTRUCTIONS_TO_BANK;
  mode;
  swiftXCharRegex: string;
  list: any [];
  isMasterRequired: any;
  partyNameAddressLength;
  maxLength = this.lcConstant.maximumlength;
  isStaticAccountEnabled: boolean;
  swiftZCharRegex: string;
  transmissionMode;
  modeValue;
  allowedCharCount = this.lcConstant.allowedCharCount;
  cols = this.lcConstant.cols;
  rows = this.lcConstant.rows;
  fieldSize = this.lcConstant.fieldSize;
  maxRowCount = this.lcConstant.maxRowCount;
  constructor(protected translateService: TranslateService,
              protected router: Router,
              protected lcReturnService: LcReturnService,
              protected leftSectionService: LeftSectionService,
              protected utilityService: UtilityService,
              protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected prevNextService: PrevNextService,
              protected lcTemplateService: LcTemplateService,
              protected formModelService: FormModelService,
              protected formControlService: FormControlService,
              protected commonService: CommonService,
              protected emitterService: EventEmitterService,
              protected stateService: ProductStateService,
              protected searchLayoutService: SearchLayoutService,
              protected phrasesService: PhrasesService,
              protected amendCommonService: AmendCommonService,
              protected codeDataService: CodeDataService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService,
              protected fileArray: FilelistService,
              protected tradeCommonDataService: TradeCommonDataService,
              protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected siProductService: SiProductService,
              protected dashboardService: DashboardService) {
      super(emitterService, stateService, commonService, translateService, confirmationService,
        customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
        dialogRef, currencyConverterPipe, siProductService);
    }


  ngOnInit(): void {
    super.ngOnInit();
    window.scroll(0, 0);
    this.isMasterRequired = this.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.modeValue = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.transmissionMode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode')?
    this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value: undefined;
    this.initializeFormGroup();
    if (this.subTnxTypeCode && this.subTnxTypeCode === FccGlobalConstant.N003_AMEND_RELEASE){
      this.iterateFields(FccGlobalConstant.SI_AMEND_RELEASE_GENERAL_DETAILS, this.form.controls);
     // this.stateService.getSectionData(FccGlobalConstant.SI_AMEND_RELEASE_GENERAL_DETAILS);
    }else{
      this.iterateControls(FccGlobalConstant.SI_APPLICANT_BENEFICIARY,
      this.stateService.getSectionData(FccGlobalConstant.SI_APPLICANT_BENEFICIARY));
    }

    if (this.context === 'readonly') {
      this.readOnlyMode();
    }
    this.patchLayoutForReadOnlyMode();
    this.getDeliveryTo();
    this.updateNarrativeCount();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZCharRegex = response.swiftZChar;
        this.swiftXCharRegex = response.swiftXChar;
        this.form.get('deliveryToOtherInst').clearValidators();
        if (this.subTnxTypeCode !== FccGlobalConstant.N003_AMEND_RELEASE) {
         if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
          (this.transmissionMode[0] && this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
            this.commonService.getSwiftVersionValue();
            if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023){
              this.form.addFCCValidators('deliveryToOtherInst', Validators.pattern(this.swiftZCharRegex), 0);
              this.form.addFCCValidators('deliveryToOtherInst', Validators.maxLength(FccGlobalConstant.LENGTH_780), 0);
              this.form.get('deliveryToOtherInst').updateValueAndValidity();
            }
            else{
            this.form.addFCCValidators('deliveryToOtherInst', Validators.pattern(this.swiftXCharRegex), 0);
            this.form.get('deliveryToOtherInst').updateValueAndValidity();
            }
        }
      }
    }
    });
    if (this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE).value !== null &&
        this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE).value !== ''
        && this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE).value !== undefined
        && this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE).value === '06') {
          this.form.get('deliverModeOtherInst')[this.params][this.rendered] = true;
      }
    // added back to back check as initiate form is failing. Expecting a conditional check
    if (this.commonService.getClearBackToBackLCfields() === 'yes') {
      this.form.get('otherInst').setValue('');
      this.form.get('otherInst').updateValueAndValidity();
    }
    if (this.commonService.isNonEmptyField(FccGlobalConstant.DELIVERY_TO_TYPE, this.form) &&
        this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.DELIVERY_TO_TYPE).value)) {
       this.onClickDeliveryToType(this.form.get(FccGlobalConstant.DELIVERY_TO_TYPE));
    }
    if (this.commonService.isNonEmptyField(FccGlobalConstant.DELIVERY_MODE_TYPE, this.form) &&
    this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE).value)) {
      this.onClickDeliveryModeType(this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE));
    }

    if (this.modeValue === FccGlobalConstant.DRAFT_OPTION ) {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();
    }
  }

  updateNarrativeCount() {
    if (this.form.get('otherInst').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('otherInst').value);
      this.form.get('otherInst')[this.params][this.enteredCharCount] = count;
    }
  }

  updateBankValue() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    const principalAct = this.stateService.getValue(FccGlobalConstant.SI_BANK_INSTRUCTIONS, 'principalAct', false);
    const feeAct = this.stateService.getValue(FccGlobalConstant.SI_BANK_INSTRUCTIONS, 'feeAct', false);
    let exists = this.accounts.filter(
          task => task.label === principalAct);
    if (exists.length > 0) {
        this.form.get('principalAct').setValue(this.accounts.filter(
            task => task.label === principalAct)[0].value);
          }
    exists = this.accounts.filter(
          task => task.label === feeAct);
    if (exists.length > 0) {
        this.form.get('feeAct').setValue(this.accounts.filter(
          task => task.label === feeAct)[0].value);
        }
    }
  }

  patchLayoutForReadOnlyMode() {
    if ( this.form.getFormMode() === 'view') {

      const controls = Object.keys(this.form.controls);
      let index: any;
      for (index = 0; index < controls.length; index++) {
        this.viewModeChange(this.form, controls[index]);
      }
    }
  }

    readOnlyMode() {
      this.lcReturnService.allLcRecords.subscribe(data => {
        this.lcResponseForm = data;
        this.patchFieldValueAndParameters(this.form.get('otherInst'), this.lcResponseForm.narrative.otherInformation,
        { readonly: true });

        this.updateValue();
      });
      this.form.get('previous')[this.params][this.rendered] = false;
      this.form.get('next')[this.params][this.rendered] = false;
      this.form.setFormMode('view');
    }

  amendFormFields() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.subTnxTypeCode !== FccGlobalConstant.N003_AMEND_RELEASE) {
      this.amendCommonService.setValueFromMasterToPrevious(this.sectionName);
    }
  }

  initializeFormGroup() {
    this.form = this.stateService.getSectionData(this.sectionName, undefined, this.isMasterRequired);
    const transamission = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode')?
    this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value: undefined;
    if (transamission === FccBusinessConstantsService.SWIFT){
      this.form.get('otherInst').setValidators([Validators.pattern(this.swiftZCharRegex)]);
      this.form.get('otherInst').updateValueAndValidity();
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get('otherInst')[this.params][FccGlobalConstant.PHRASE_ENABLED] = true;
      this.form.get('deliveryToOtherInst')[this.params][FccGlobalConstant.PHRASE_ENABLED] = true;
    } else {
      this.form.get('otherInst')[this.params][FccGlobalConstant.PHRASE_ENABLED] = false;
      this.form.get('deliveryToOtherInst')[this.params][FccGlobalConstant.PHRASE_ENABLED] = false;
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
    this.prepareDeliveryModeTypes();
    this.swiftRenderedFields();
    if (this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== null
      && this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== ''
      && this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== undefined) {
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      if (this.form.get(FccGlobalConstant.DELIVERY_MODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== null
        && this.form.get(FccGlobalConstant.DELIVERY_MODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== ''
        && this.form.get(FccGlobalConstant.DELIVERY_MODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== undefined) {
        this.form.get(FccGlobalConstant.DELIVERY_MODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.form.get(FccGlobalConstant.DELIVERY_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== null
        && this.form.get(FccGlobalConstant.DELIVERY_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== ''
        && this.form.get(FccGlobalConstant.DELIVERY_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== undefined) {
        this.form.get(FccGlobalConstant.DELIVERY_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
    }
    this.form.get('otherInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    if (this.commonService.isNonEmptyField(FccGlobalConstant.DELIVERY_TO_OTHER_INST, this.form)
          && this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, FccGlobalConstant.DELIVERY_TO_OTHER_INST, false);
      this.form.get(FccGlobalConstant.DELIVERY_TO_OTHER_INST).clearValidators();
    }
    this.form.updateValueAndValidity();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.swiftXCharRegex = response.swiftXCharacterSet;
    });

    this.commonService.getSwiftVersionValue();
    if(this.commonService.swiftVersion === FccGlobalConstant.SWIFT_2023){
    this.partyNameAddressLength = FccGlobalConstant.LENGTH_12 * FccGlobalConstant.LENGTH_65;
    this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][this.allowedCharCount] = this.partyNameAddressLength;
    this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][this.maxLength]
    = (this.partyNameAddressLength + FccGlobalConstant.LENGTH_11);
    this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][this.cols] = FccGlobalConstant.LENGTH_65;
    this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][this.maxRowCount] =FccGlobalConstant.LENGTH_12;
    this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][this.rows] =FccGlobalConstant.LENGTH_12;
    this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][this.fieldSize] =FccGlobalConstant.LENGTH_100;
    this.form.addFCCValidators(FccGlobalConstant.DELV_TO_OTHER_INST, Validators.pattern(this.swiftZCharRegex), 0);
    this.form.addFCCValidators('deliveryToOtherInst', Validators.maxLength(FccGlobalConstant.LENGTH_780), 0);
    this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).updateValueAndValidity();
    this.siProductService.swift2023Changes(this.form);
   }
    else{
    this.partyNameAddressLength = FccGlobalConstant.LENGTH_6 * FccGlobalConstant.LENGTH_35;
    this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][this.maxLength] =
                  (this.partyNameAddressLength + FccGlobalConstant.LENGTH_5);
    }
  }

  onClickDeliveryModeType(event) {
    if (event.value && event.value === FccGlobalConstant.DELV_MODE_INST_VALUE_02) {
        this.handleDelvModeNarrative(FccGlobalConstant.DELV_MODE_INST_COURIER, true);
        this.handleDelvModeNarrative(FccGlobalConstant.DELV_MODE_OTHER_INST, false);
    } else if (event.value && event.value === FccGlobalConstant.DELV_MODE_INST_VALUE_99) {
      this.handleDelvModeNarrative(FccGlobalConstant.DELV_MODE_OTHER_INST, true);
      this.handleDelvModeNarrative(FccGlobalConstant.DELV_MODE_INST_COURIER, false);
    } else {
      this.handleDelvModeNarrative(FccGlobalConstant.DELV_MODE_OTHER_INST, false);
      this.handleDelvModeNarrative(FccGlobalConstant.DELV_MODE_INST_COURIER, false);
    }
    this.form.updateValueAndValidity();
}

handleDelvModeNarrative(field: string, isApplicable: boolean) {
  if (isApplicable) {
    this.form.get(field)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(field)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
  } else {
  this.form.get(field)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = isApplicable;
  const resetFields = [field];
  this.resetValues(this.form, resetFields);
  this.form.get(field).setErrors(null);
  this.removeValidators(this.form, [field]);
}
  this.form.get(field).updateValueAndValidity();
}

prepareDeliveryModeTypes() {
  const elementId = FccGlobalConstant.DELIVERY_MODE_TYPE;
  this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
  this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
  const elementValue = this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
  if (this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
      this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
      this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
      this.codeID = this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    }
  if (elementValue.length === 0) {
      this.dataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
      this.patchFieldParameters(this.form.get(elementId), { options: this.dataArray });
    }
  this.form.get(elementId).updateValueAndValidity();
}

prepareDeliveryToTypes() {
  const elementId = FccGlobalConstant.DELIVERY_TO_TYPE;
  this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
  this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
  const elementValue = this.form.get(FccGlobalConstant.DELIVERY_TO_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
  if (this.form.get(FccGlobalConstant.DELIVERY_TO_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
      this.form.get(FccGlobalConstant.DELIVERY_TO_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
      this.form.get(FccGlobalConstant.DELIVERY_TO_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
      this.codeID = this.form.get(FccGlobalConstant.DELIVERY_TO_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    }
  if (elementValue.length === 0) {
      this.dataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
      this.patchFieldParameters(this.form.get(elementId), { options: this.dataArray });
    }
  this.form.get(elementId).updateValueAndValidity();
}

getDeliveryTo() {
  let sectionForm: FCCFormGroup;
  let sectionForm2: FCCFormGroup;
  let bankName;
  if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.subTnxTypeCode
    && this.subTnxTypeCode === FccGlobalConstant.N003_AMEND_RELEASE && 
    this.form.get(FccTradeFieldConstants.ISSUING_BANK_NAME)) {
    bankName = this.form.get(FccTradeFieldConstants.ISSUING_BANK_NAME).value;
  } else {
    sectionForm = this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS);
    sectionForm2 = sectionForm.get(FccGlobalConstant.SI_ISSUING_BANK) as FCCFormGroup;
    if (sectionForm2.get('bankNameList') && sectionForm2.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] &&
    sectionForm2.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS].length !== FccGlobalConstant.LENGTH_0) {
     bankName = sectionForm2.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] ?
              sectionForm2.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS][0].value :
              sectionForm2.get('bankNameList').value;
  }
}
  const language = localStorage.getItem('language');
  this.commonService.getParamData(FccGlobalConstant.PRODUCT_SI, FccTradeFieldConstants.PARAMETER_P806).subscribe(response => {
      if (response) {
        this.list = this.tradeCommonDataService.getDeliveryToParamData(response, bankName, language,
          FccTradeFieldConstants.DELIVERY_TO_TYPE, FccGlobalConstant.PRODUCT_SI);
      }
  });
  if (this.list != null && this.list !== undefined && this.list.length > 0) {
    this.list.sort((a, b) => (a.value > b.value) ? 1 : -1);
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE), { options: this.list });
    if (this.list[0] !== undefined && (this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE).value === '' ||
    this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE).value === null)) {
      this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE)[FccGlobalConstant.PARAMS].defaultValue = this.list[0].value;
      this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE).setValue(this.list[0].value);
    }
  }
  this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE).updateValueAndValidity();

}


  onClickDeliveryToType(event) {
    if (event.value && event.value === FccGlobalConstant.DELV_TO_INST_VALUE_03 || event.value === FccGlobalConstant.DELV_TO_INST_VALUE_01) {
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][FccGlobalConstant.PHRASE_ENABLED] = false;
      const resetFields = [FccGlobalConstant.DELV_TO_OTHER_INST];
      this.resetValues(this.form, resetFields);
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).setErrors(null);
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).clearValidators();
    } else {
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][FccGlobalConstant.PHRASE_ENABLED] = true;
      if (this.subTnxTypeCode !== '05') {
        const transmissionMode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode')?
        this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value: undefined;
        if (transmissionMode === FccBusinessConstantsService.SWIFT ||
          (transmissionMode[0] && transmissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
            if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023){
              this.form.addFCCValidators('deliveryToOtherInst', Validators.pattern(this.swiftZCharRegex), 0);
              this.form.addFCCValidators('deliveryToOtherInst', Validators.maxLength(FccGlobalConstant.LENGTH_780), 0);
              this.form.get('deliveryToOtherInst').updateValueAndValidity();
            }
            else{
            this.form.addFCCValidators('deliveryToOtherInst', Validators.pattern(this.swiftXCharRegex), 0);
            this.form.get('deliveryToOtherInst').updateValueAndValidity();
            }
      }
      }
    }
    if (this.commonService.isNonEmptyField(FccGlobalConstant.DELIVERY_TO_OTHER_INST, this.form)
          && this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, FccGlobalConstant.DELIVERY_TO_OTHER_INST, false);
      this.form.get(FccGlobalConstant.DELIVERY_TO_OTHER_INST).clearValidators();
    }
    this.form.updateValueAndValidity();
  }

  ngOnDestroy() {
    this.stateService.setStateSection(
      FccGlobalConstant.SI_BANK_INSTRUCTIONS,
      this.form, this.isMasterRequired
    );
    if (this.form !== undefined) {
      if (this.form.get('otherInst') && !this.form.get('otherInst').value) {
          this.form.get('otherInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.form.get('deliveryToOtherInst') && !this.form.get('deliveryToOtherInst').value) {
          this.form.get('deliveryToOtherInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if ( this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === true) {
        if (this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE).value === FccGlobalConstant.DELV_MODE_INST_VALUE_99) {
          this.form.get(FccGlobalConstant.DELV_MODE_INST_TEXT).setValue(this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST).value);
        } else if (this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE).value === FccGlobalConstant.DELV_MODE_INST_VALUE_02) {
          this.form.get(FccGlobalConstant.DELV_MODE_INST_TEXT).setValue(this.form.get(FccGlobalConstant.DELV_MODE_INST_COURIER).value);
        } else {
          this.form.get(FccGlobalConstant.DELV_MODE_INST_TEXT).setValue('');
      }
    }
    }
  }

  getAccounts() {
    const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.isStaticAccountEnabled = this.commonService.getIsStaticAccountEnabled();
    if (this.isStaticAccountEnabled) {
      this.corporateCommonService.getStaticAccounts(this.fccGlobalConstantService.getStaticDataLimit(), productCode)
        .subscribe(response => {
            this.updateAccounts(response.body);
        });
    } else {
      this.commonService.getUserProfileAccount(productCode, this.entityName).subscribe(
        accountsResponse => {
          this.updateAccounts(accountsResponse);
        });
    }
    }

  updateAccounts(body: any) {
    this.accountDetailsList = body;
    let emptyCheck = true;
    if (this.entityName !== undefined && this.entityName !== '') {
     this.accountDetailsList.items.forEach(value => {
      if ((this.isStaticAccountEnabled && (this.entityName === value.entityShortName || value.entityShortName === '*')) ||
      (!this.isStaticAccountEnabled)) {
          if (emptyCheck) {
            const empty = this.commonService.getEmptyAccount();
            this.accounts.push(empty);
            emptyCheck = false;
          }
          const account = this.commonService.getUpdatedAccount(value);
          this.accounts.push(account);
      }
      });
     this.patchFieldParameters(this.form.get('principalAct'), { options: this.getUpdatedAccounts() });
     this.patchFieldParameters(this.form.get('feeAct'), { options: this.getUpdatedAccounts() });

    } else if (this.entityNameRendered !== undefined) {
      this.patchUpdatedAccounts(emptyCheck);
  } else {
      this.patchUpdatedAccounts(emptyCheck);
  }
    if (this.entityName === undefined && this.entitiesList > 1) {
      this.patchFieldParameters(this.form.get('principalAct'), { options: [] });
      this.patchFieldParameters(this.form.get('feeAct'), { options: [] });
   }
    this.updateValue();
    this.updateBankValue();

    if(this.form.get('feeAct')[this.params].required ){
      let feeActOptions = this.getUpdatedAccounts();
      if(feeActOptions){
        feeActOptions = feeActOptions.filter((item) =>item.label !== "");
         this.patchFieldParameters(this.form.get('feeAct'), { options: feeActOptions });
      }
    }
      if (this.form.get('principalAct')[this.params].required){
        let principalActoptnion = this.getUpdatedAccounts();
      if(principalActoptnion){
        principalActoptnion = principalActoptnion.filter((item) =>item.label !== "");
        this.patchFieldParameters(this.form.get('principalAct'), { options: principalActoptnion });
       }
      }  
  }

  iterateControls(title, mapValue) {
    let value;
    if (mapValue !== undefined) {
    Object.keys(mapValue).forEach((key, index) => {
      if (index === 0) {
        value = mapValue.controls;
        this.iterateFields(title, value);
      }
    });
} else {
  this.getAccounts();
}
  }

  iterateFields(title, myvalue) {
    Object.keys(myvalue).forEach((key) => {
        if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
         if (this.subTnxTypeCode && this.subTnxTypeCode === FccGlobalConstant.N003_AMEND_RELEASE) {
              if (myvalue[key].key === FccGlobalConstant.APPLICANT_MESSAGE_ENTITY) {
                  this.entityName = myvalue[key].value;
                  this.entityNameRendered = myvalue[key].params.rendered;
              }
         }else{
          if ( myvalue[key].key === 'applicantEntity') {
            this.entityName = myvalue[key].value;
            this.entityNameRendered = myvalue[key].params.rendered;
          }
        }
        }else {
          if (myvalue[key].type === 'input-dropdown-filter' && myvalue[key].key === 'applicantEntity') {
               this.entityName = myvalue[key].value.shortName;
               this.entityNameRendered = myvalue[key].params.rendered;
               this.entitiesList = myvalue[key].options.length;
          }
        }
    });
    this.getAccounts();
  }

  updateValue() {
    if (this.lcResponseForm.bankInstructions !== undefined && this.context === 'readonly') {
      let exists = this.accounts.filter(
        task => task.label === this.lcResponseForm.bankInstructions.principalAccount.number);
      if (exists.length > 0) {
      this.form.get('principalAct').setValue(this.accounts.filter(
          task => task.label === this.lcResponseForm.bankInstructions.principalAccount.number)[0].value);
        }
      this.patchFieldParameters(this.form.get('principalAct'), { readonly: true });
      exists = this.accounts.filter(
        task => task.label === this.lcResponseForm.bankInstructions.feeAccount.number);
      if (exists.length > 0) {
      this.form.get('feeAct').setValue(this.accounts.filter(
       task => task.label === this.lcResponseForm.bankInstructions.feeAccount.number)[0].value);
      }
      this.patchFieldParameters(this.form.get('feeAct'), { readonly: true });
     }
      const exist1 = this.accounts.filter(task => task.label === this.form.get('feeAct').value.label);
      if(this.form.get('feeAct').value && exist1 !== null && exist1.length > 0){
      this.patchFieldValueAndParameters(this.form.get('feeAct'),this.accounts.filter(
        task => task.label === this.form.get('feeAct').value.label)[0].value, {});
      }
      const exist2 = this.accounts.filter(task => task.label === this.form.get('principalAct').value.label);
      if(this.form.get('principalAct').value && exist2 !== null && exist2.length > 0){
      this.patchFieldValueAndParameters(this.form.get('principalAct'),this.accounts.filter(
        task => task.label === this.form.get('principalAct').value.label)[0].value, {});
      }
  }

  updateAmendBankValue() {
    const principalAct = this.stateService.getValue(FccGlobalConstant.SI_BANK_INSTRUCTIONS, 'principalAct', true);
    const feeAct = this.stateService.getValue(FccGlobalConstant.SI_BANK_INSTRUCTIONS, 'feeAct', true);
    let exists = this.accounts.filter(
          task => task.label === principalAct);
    if (exists.length > 0) {
        this.form.get('principalAct').setValue(this.accounts.filter(
            task => task.label === principalAct)[0].value);
          }
    exists = this.accounts.filter(
          task => task.label === feeAct);
    if (exists.length > 0) {
        this.form.get('feeAct').setValue(this.accounts.filter(
         task => task.label === feeAct)[0].value);
        }
  }

  getUpdatedAccounts(): any[] {
    this.updateValue();
    return this.accounts;
  }


  onClickPhraseIcon(event, key) {
    this.entityNameForPhrases = this.stateService.getSectionData(FccGlobalConstant.SI_APPLICANT_BENEFICIARY)
    .get('applicantEntity').value.shortName;
    if (this.entityNameForPhrases !== '' && this.entityNameForPhrases !== undefined) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '12', true, this.entityName);
    } else {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '12', true);
    }
  }

  swiftRenderedFields() {
    const dependentFields = ['deliveryModeType', FccGlobalConstant.DELV_MODE_OTHER_INST, 'deliveryToType',
                             'deliveryToOtherInst', 'deliveryMode', 'deliveryTo', FccGlobalConstant.DELV_MODE_INST_COURIER];
    this.commonService.getSwiftVersionValue();
    if (this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2021) {
      this.setRenderOnlyFields(this.form, dependentFields, true);
      this.form.updateValueAndValidity();
    } else {
      this.setRenderOnlyFields(this.form, dependentFields, false);
      this.resetValues(this.form, dependentFields);
      if (this.commonService.isNonEmptyField(FccGlobalConstant.DELIVERY_TO_OTHER_INST, this.form)) {
        this.form.get(FccGlobalConstant.DELIVERY_TO_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
        this.form.get(FccGlobalConstant.DELIVERY_TO_OTHER_INST).clearValidators();
      }
      this.form.updateValueAndValidity();
    }
  }

  setRenderOnly(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { rendered: flag });
  }

  setRenderOnlyFields(form, ids: string[], flag) {
    ids.forEach(id => this.setRenderOnly(form, id, flag));
  }

  onKeyupDeliveryToOtherInst(){
    const data = this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).value;
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace( /[\r\n]+/gm, '' ) : '';
    this.commonService.getSwiftNarrativeFilterValues();
    if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
      (this.transmissionMode[0] && this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
        this.commonService.getSwiftVersionValue();
        if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023){
          this.form.addFCCValidators('deliveryToOtherInst', Validators.pattern(this.swiftZCharRegex), 0);
          this.form.addFCCValidators('deliveryToOtherInst', Validators.maxLength(FccGlobalConstant.LENGTH_780), 0);
          this.form.get('deliveryToOtherInst').updateValueAndValidity();
        }
        else{
        this.form.addFCCValidators('deliveryToOtherInst', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.get('deliveryToOtherInst').updateValueAndValidity();
        }
      }
    if (checkForValue === '') {
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).setValue(null);
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).setErrors({ invalid: true });
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).updateValueAndValidity();
    } else {
        const exp = new RegExp(this.commonService.swiftNarrativeFilterValue,"g");
        const fieldValue = this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).value.replaceAll(exp,' ');
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).setValue(fieldValue);
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).setErrors({ invalid: false });
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).setErrors({ invalidSwiftRegex: true });
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).updateValueAndValidity();
    }
 }

  patchUpdatedAccounts(emptyCheck) {
    this.accountDetailsList.items.forEach(value => {
      if (emptyCheck) {
        const empty = this.commonService.getEmptyAccount();
        this.accounts.push(empty);
        emptyCheck = false;
      }
      const account = this.commonService.getUpdatedAccount(value);
      if (this.accountDetailsList.items && this.accountDetailsList.items.length !== this.accounts.length - 1) {
        this.accounts.push(account);
      }
    });
    this.patchFieldParameters(this.form.get(FccGlobalConstant.PRINCIPAL_ACT), { options: this.getUpdatedAccounts() });
    this.patchFieldParameters(this.form.get(FccGlobalConstant.FEE_ACT), { options: this.getUpdatedAccounts() });
  }

}

