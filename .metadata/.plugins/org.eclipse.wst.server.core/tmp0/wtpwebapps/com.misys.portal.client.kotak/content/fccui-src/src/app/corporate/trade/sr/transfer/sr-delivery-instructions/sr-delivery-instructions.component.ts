import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { Validators } from '@angular/forms';

import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { AccountDetailsList } from '../../../../../common/model/accountDetailsList';
import { CodeData } from '../../../../../common/model/codeData';
import { CodeDataService } from '../../../../../common/services/code-data.service';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { LcTemplateService } from '../../../../../common/services/lc-template.service';
import { PhrasesService } from '../../../../../common/services/phrases.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { AmendCommonService } from '../../../../../corporate/common/services/amend-common.service';
import { CorporateCommonService } from '../../../../../corporate/common/services/common.service';
import { LeftSectionService } from '../../../../../corporate/common/services/leftSection.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { ImportLetterOfCreditResponse } from '../../../lc/initiation/model/importLetterOfCreditResponse';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { LcReturnService } from '../../../lc/initiation/services/lc-return.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { SrProductComponent } from '../../sr-product/sr-product.component';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { SrProductService } from '../../services/sr-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { TradeCommonDataService } from '../../../common/service/trade-common-data.service';
import { FccTradeFieldConstants } from '../../../common/fcc-trade-field-constants';


@Component({
  selector: 'app-sr-delivery-instructions',
  templateUrl: './sr-delivery-instructions.component.html',
  styleUrls: ['./sr-delivery-instructions.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SrDeliveryInstructionsComponent }]
})
export class SrDeliveryInstructionsComponent extends SrProductComponent implements OnInit {

  form: FCCFormGroup;
  module = `${this.translateService.instant(FccGlobalConstant.SR_DELIVERY_INSTRUCTIONS)}`;
  lcConstant = new LcConstant();
  enteredCharCount = this.lcConstant.enteredCharCounts;
  barLength: any;
  subheader = '';
  tnxTypeCode: any;
  phrasesResponseForInstToBank: any;
  rendered = this.lcConstant.rendered;
  params = this.lcConstant.params;
  lcResponseForm = new ImportLetterOfCreditResponse();
  displayValue: string;
  accounts = [];
  partyNameAddressLength;
  maxLength = this.lcConstant.maximumlength;
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
  filterParams;
  swiftXChar;
  list: any [];
  sectionName = FccGlobalConstant.SR_DELIVERY_INSTRUCTIONS;
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
              protected tradeCommonDataService: TradeCommonDataService,
              protected codeDataService: CodeDataService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService,
              protected fileList: FilelistService,
              protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected srProductService: SrProductService) {
      super(emitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
        searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, srProductService);
    }


  ngOnInit(): void {
    super.ngOnInit();
    window.scroll(0, 0);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.initializeFormGroup();
    this.partyNameAddressLength = FccGlobalConstant.LENGTH_6 * FccGlobalConstant.LENGTH_35;
    this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][this.maxLength] =
                  (this.partyNameAddressLength + FccGlobalConstant.LENGTH_5);
    this.updateNarrativeCount();
  }

  updateNarrativeCount() {
    if (this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST).value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST).value);
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[this.params][this.enteredCharCount] = count;
    }
    if (this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).value) {
      const count1 = this.commonService.counterOfPopulatedData(this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).value);
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][this.enteredCharCount] = count1;
    }
  }

    readOnlyMode() {
      this.lcReturnService.allLcRecords.subscribe(data => {
        this.lcResponseForm = data;
        this.patchFieldValueAndParameters(this.form.get('deliverModeOtherInst'), this.lcResponseForm.narrative.otherInformation,
        { readonly: true });
      });
      this.form.get('previous')[this.params][this.rendered] = false;
      this.form.get('next')[this.params][this.rendered] = false;
      this.form.setFormMode('view');
    }

  initializeFormGroup() {
    this.form = this.stateService.getSectionData(this.sectionName);
    this.prepareDeliveryModeTypes();
    this.getDeliveryTo();
    this.handleDeliveryOtherInstruction();
    if (this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE)) {
    this.setDeliveryToOther(this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE).value);
    }
    this.form.updateValueAndValidity();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.swiftXChar = response.swiftXCharacterSet;
    });
  }

  handleDeliveryOtherInstruction() {
    if (this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE) &&
    this.form.get(FccGlobalConstant.DELIVERY_MODE_TYPE).value === FccGlobalConstant.DELV_MODE_INST_VALUE_99) {
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    } else {
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      const resetFields = [FccGlobalConstant.DELV_MODE_OTHER_INST];
      this.resetValues(this.form, resetFields);
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST).setErrors(null);
      this.form.updateValueAndValidity();
    }
    this.form.updateValueAndValidity();
  }

  onClickDeliveryModeType(event) {
    if (event.value && event.value === FccGlobalConstant.DELV_MODE_INST_VALUE_99) {
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    } else {
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      const resetFields = [FccGlobalConstant.DELV_MODE_OTHER_INST];
      this.resetValues(this.form, resetFields);
      this.form.get(FccGlobalConstant.DELV_MODE_OTHER_INST).setErrors(null);
      this.form.updateValueAndValidity();
    }
    event.preventDefault();
    this.form.updateValueAndValidity();
}

getDeliveryTo() {
  const bankName = this.form.get('bankNameSRList').value;
  const language = localStorage.getItem('language');
  this.commonService.getParamData(FccGlobalConstant.PRODUCT_SR, FccTradeFieldConstants.PARAMETER_P806).subscribe(response => {
      if (response) {
        this.list = this.tradeCommonDataService.getDeliveryToParamData(response, bankName, language,
          FccTradeFieldConstants.DELIVERY_TO_TYPE, FccGlobalConstant.PRODUCT_SR);
      }
  });
  this.list.sort((a, b) => (a.value > b.value) ? 1 : -1);
  this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE), { options: this.list });
  if (this.list[0] !== undefined && (this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE).value === '' ||
    this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE).value === null)) {
      this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE)[FccGlobalConstant.PARAMS].defaultValue = this.list[0].value;
      this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE).setValue(this.list[0].value);
    }
  this.form.get(FccTradeFieldConstants.DELIVERY_TO_TYPE).updateValueAndValidity();
}

onClickDeliveryToType(event) {
 this.setDeliveryToOther(event.value);
}

setDeliveryToOther(value) {
    if (value && (value === FccGlobalConstant.DELV_TO_INST_VALUE_04 || value === FccGlobalConstant.DELV_TO_INST_VALUE_05 ||
        value === FccGlobalConstant.DELV_TO_INST_VALUE_02)) {
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][FccGlobalConstant.PHRASE_ENABLED] = true;
        this.form.addFCCValidators(FccGlobalConstant.DELV_TO_OTHER_INST, Validators.pattern(this.swiftXChar), 0);
      } else {
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[this.params][FccGlobalConstant.PHRASE_ENABLED] = false;
        const resetFields = [FccGlobalConstant.DELV_TO_OTHER_INST];
        this.resetValues(this.form, resetFields);
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).setErrors(null);
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
        this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).clearValidators();
      }
    this.form.updateValueAndValidity();
    }

onKeyupDeliveryToOtherInst(){
  const data = this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).value;
  const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace( /[\r\n]+/gm, '' ) : '';
  if (checkForValue === '') {
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).setValue(null);
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).setErrors({ invalid: true });
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).updateValueAndValidity();
  } else {
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).setErrors({ invalid: false });
      this.form.get(FccGlobalConstant.DELV_TO_OTHER_INST).updateValueAndValidity();
      this.commonService.limitCharacterCountPerLine(FccGlobalConstant.DELV_TO_OTHER_INST, this.form);
  }
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
  if (elementValue.length === 0 && this.commonService.isNonEmptyValue(this.codeID)) {
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

  onClickPhraseIcon(event, key) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SR, key, '', true);
  }

  ngOnDestroy() {
    this.handleDeliveryOtherInstruction();
    this.form.updateValueAndValidity();
    this.stateService.setStateSection(FccGlobalConstant.SR_DELIVERY_INSTRUCTIONS, this.form);
  }

}
