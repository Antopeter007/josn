import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { MultiBankService } from './../../../../../../common/services/multi-bank.service';
import { ProductMappingService } from './../../../../../../common/services/productMapping.service';
import { TransactionDetailService } from './../../../../../../common/services/transactionDetail.service';
import { LcConstant } from './../../../../lc/common/model/constant';
import { SearchLayoutService } from './../../../../../../common/services/search-layout.service';
import { ResolverService } from './../../../../../../common/services/resolver.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy, AfterViewChecked, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ConfirmationDialogComponent
} from '../../../../../../../app/corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CodeData } from '../../../../../../common/model/codeData';
import { CountryList } from '../../../../../../common/model/countryList';
import { CodeDataService } from '../../../../../../common/services/code-data.service';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { LcTemplateService } from './../../../../../../common/services/lc-template.service';
import { FCCFormControl, FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { NarrativeService } from './../../../../../../corporate/trade/lc/initiation/services/narrative.service';
import { compareExpiryDateToCurrentDate } from './../../../../../../corporate/trade/lc/initiation/validator/ValidateDates';
import {
  compareExpDateWithLastShipmentDate,
  compareNewExpiryDateToOld
} from './../../../../../../corporate/trade/lc/initiation/validator/ValidateLastShipDate';
import { Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { SiProductService } from '../../../services/si-product.service';
import { Router } from '@angular/router';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { FormatAmdNoService } from '../../../../../../common/services/format-amd-no.service';
import { Subscription } from 'rxjs';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
@Component({
  selector: 'app-si-general-details',
  templateUrl: './si-general-details.component.html',
  styleUrls: ['./si-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiGeneralDetailsComponent }]
})
export class SiGeneralDetailsComponent extends SiProductComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  form1: FCCFormGroup;
  codeID: any;
  productCode: any;
  subProductCode: any;
  codeData = new CodeData();
  eventDataArray: any;
  countryList: CountryList;
  country = [];
  countries = [];
  tnxTypeCode: any;
  dataArray: any;
  entityName: any;
  expiryTypeValue: any;
  custRefRegex: any;
  custRefLength: any;
  enquiryRegex: any;
  purchaseOrderEnable: any;
  templateIDSubProdCode: any;
  options = 'options';
  module = `${this.translateService.instant(FccGlobalConstant.SI_GENERAL_DETAILS)}`;
  lcConstant = new LcConstant();
  backToBackResponse;
  params = this.lcConstant.params;
  templateResponse;
  lcResponse;
  siDetailsResponse: any;
  rendered = this.lcConstant.rendered;
  disabled = this.lcConstant.disabled;
  expiryDateBackToBack: any;
  styleClass = this.lcConstant.styleClass;
  mode;
  refId;
  warning = 'warning';
  confirmationPartymessage = 'confirmationPartymessage';
  transmissionMode: any;
  isMasterRequired: any;
  templteId;
  option;
  sectionName = 'siGeneralDetails';
  enteredCharCount = 'enteredCharCount';
  readonly = this.lcConstant.readonly;
  RenderProvisional: boolean;
  sitype: Set<string> = new Set<string>();
  provisionalBankList: Set<string> = new Set<string>();
  provisionalBankArr = [];
  corporateBanksSet: Set<string> = new Set<string>();
   provisionalBankMap: Map<string, any> = new Map();
  corporateBanks = [];
  singleBank: boolean;
  fromBankResponse;
  siBankTemplateFlag;
  viewSpecimenDownloadParams;
  bankDetailResponseObj;
  bankTemplateName;
  @ViewChildren('selBtn') myDivElementRef: QueryList<any>;
  formDataObj = 'formData';
  editModeDownloadData;
  templateSIKey: string;
  backtobackSIKey: string;
  siFreeFormatUploadFlag;
  currentDate = this.commonService.getBankDateForComparison();
  previewScreen = this.lcConstant.previewScreen;
  nameOrAbbvName: any;
  tnxStatCode: any;
  amdNoVal: any;
  swiftXCharSet: any;
  modeValue: any;
  swiftXCharRegex: string;
  swiftZCharRegex: string;
  isApplicableRulesMandatory: boolean;
  isAnyProvBankAvl: boolean;
  provRender: boolean;

  excludedFieldsNdSections: any;
  copyFromProductCode = '';
  excludingJsonFileKey = '';
  fieldsArray = [];
  sectionsArray = [];
  taskSubscription : Subscription;

  constructor(protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService,
              protected commonService: CommonService,
              protected translateService: TranslateService,
              protected codeDataService: CodeDataService,
              protected formModelService: FormModelService,
              protected phrasesService: PhrasesService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected amendCommonService: AmendCommonService,
              protected narrativeService: NarrativeService,
              protected transactionDetailService: TransactionDetailService,
              protected productMappingService: ProductMappingService,
              protected dialogService: DialogService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService,
              protected resolverService: ResolverService,
              protected fileArray: FilelistService,
              protected dialogRef: DynamicDialogRef,
              protected lcTemplateService: LcTemplateService,
              protected multiBankService: MultiBankService,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected siProductService: SiProductService,
              protected leftSectionService: LeftSectionService,
              protected router: Router,
              protected fccTaskService: FccTaskService,
              protected formatAmdNoService: FormatAmdNoService,
              protected cdRef: ChangeDetectorRef
              ) {
      super(eventEmitterService, stateService, commonService, translateService, confirmationService,
        customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
        dialogRef, currencyConverterPipe, siProductService);
    }

  ngOnInit(): void {
    super.ngOnInit();
    this.modeValue = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameOrAbbvName = response.TradeIssuingBankNameOrAbbvName;
        this.swiftXCharSet = response.swiftXCharacterSet;
        this.enquiryRegex = response.swiftXCharacterSet;
        this.isApplicableRulesMandatory = response.isApplicableRulesMandatory;
      }
    });
    this.isMasterRequired = this.isMasterRequired;
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxStatCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.eventTnxStatCode);
    this.initializeFormGroup();
    this.handleViewForBackToBackToggle();
    // this.populateMultiBank();
    this.setBankNameList();
    this.onClickApplicableRulesOptions();
    this.setBackToBackPreviewScreenValSI();
    this.onClickProvisionalLCToggle();
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    // if (this.mode === FccGlobalConstant.INITIATE) {
    //   this.transmissionMode = this.form.get('transmissionMode').setValue(FccBusinessConstantsService.SWIFT);
    // }
    // else {
    //   this.transmissionMode = this.form.get('transmissionMode').value;
    // }
    if (this.commonService.isnonEMptyString(this.form.get('transmissionMode').value)){
      this.transmissionMode = this.form.get('transmissionMode').value;
    } else {
      this.form.get('transmissionMode').setValue(FccBusinessConstantsService.SWIFT);
      this.transmissionMode = FccBusinessConstantsService.SWIFT;
    }
    this.commonService.isTransmissionModeChanged(this.form.get('transmissionMode').value);
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.templteId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TEMPLATE_ID);
    if (this.form.get(FccGlobalConstant.EXPIRY_TYPE_SI)) {
      this.expiryTypeValue = this.form.get(FccGlobalConstant.EXPIRY_TYPE_SI).value;
      this.checkExpiryType(this.expiryTypeValue);
    }
    this.swiftvalidation();
    this.siFreeFormatUploadFlag = this.commonService.getUserPermissionFlag(FccGlobalConstant.SI_FREE_FORMAT);
    const perms = [FccGlobalConstant.SI_BACKTOBACK_PERMISSION];
    perms.forEach(perKey => {
      const flag = this.commonService.getUserPermissionFlag(perKey);
      if (!flag) {
        this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE)[this.params][this.rendered] = false;
      }
    });
    this.commonService.loadDefaultConfiguration().subscribe(response => {

      if (response) {
        this.custRefRegex = response.customerReferenceTradeRegex;
        this.custRefLength = response.customerReferenceTradeLength;
        this.purchaseOrderEnable = response.purchaseOrderReference;
        this.swiftZCharRegex = response.swiftZChar;
        this.form.get('placeOfExpiry').clearValidators();
        this.form.get('otherApplicableRules').clearValidators();
        this.form.get(FccGlobalConstant.NON_TRANS_INST).clearValidators();
        if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
          (this.form.controls.transmissionMode && this.form.controls.transmissionMode.value[0] &&
            this.form.controls.transmissionMode.value[0].value === FccBusinessConstantsService.SWIFT) ||
            (this.form.controls.transmissionMode && this.form.controls.transmissionMode.value === FccBusinessConstantsService.SWIFT)) {
          this.form.addFCCValidators('otherApplicableRules', Validators.pattern(this.enquiryRegex), 0);
          this.form.addFCCValidators(FccGlobalConstant.NON_TRANS_INST, Validators.pattern(this.swiftZCharRegex), 0);
          this.form.addFCCValidators('placeOfExpiry', Validators.pattern(this.enquiryRegex), 0);
          this.form.addFCCValidators('purchaseOrderReference',Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_2000), 
           Validators.pattern(this.swiftZCharRegex)]), 0);
          this.commonService.getSwiftVersionValue();
          if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023){
            this.form.addFCCValidators('governCountrySubdiv', Validators.pattern(this.swiftZCharRegex), 0);
            this.form.get('governCountrySubdiv').updateValueAndValidity();
          }
          this.form.get('placeOfExpiry').updateValueAndValidity();
          this.form.get('otherApplicableRules').updateValueAndValidity();
        }
        this.form.addFCCValidators('customerReference', Validators.maxLength(this.custRefLength), 0);
        this.form.addFCCValidators('beneficiaryReference', Validators.maxLength(this.custRefLength), 0);
        this.form.addFCCValidators('otherApplicableRules', Validators.maxLength(FccGlobalConstant.LENGTH_35), 0);
        this.purchaseOrderFieldRender();
      }
    });
    if (!this.siFreeFormatUploadFlag) {
      const requestList = this.form.get('requestOptionsLC')[this.params][this.options];
      requestList.splice(1, requestList.length);
    }
    this.resetCreateForm();
    this.editModeDataPopulate();
    this.updateValues();
    this.provisional();
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      this.amendCommonService.compareTransactionAndMasterForAmend(productCode);
    }
    this.siBankTemplateFlag = this.commonService.getUserPermissionFlag(FccGlobalConstant.SI_BANK_TEMPLATE);
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      if (this.transmissionMode && this.transmissionMode[0] && this.transmissionMode[0].value === FccBusinessConstantsService.OTHER_99) {
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT], true);
      this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_MODE], false);
      }
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      if (this.transmissionMode && this.transmissionMode === FccBusinessConstantsService.OTHER_99) {
        this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[this.params][this.rendered] = true;
        this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.TRANS_MODE], false);
      } else {
        this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[this.params][this.rendered] = false;
        this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.TRANS_MODE], true);
        this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT).setValue('');
        this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT).clearValidators();
        this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT).updateValueAndValidity();
      }
    }
    this.setAmendmentNumbers();
    this.populateDataForEditForm();
    this.getExcludedFieldsNdSections();
    if (this.modeValue === FccGlobalConstant.DRAFT_OPTION ) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, 'advSendModeText', false);
      this.form.setErrors(null);
      this.form.clearValidators();
      this.form.updateValueAndValidity();
    }
    this.handleApplicableRules();
  }

  swiftvalidation() {
    if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
          (this.form.controls.transmissionMode && this.form.controls.transmissionMode.value[0] &&
            this.form.controls.transmissionMode.value[0].value === FccBusinessConstantsService.SWIFT) ||
            (this.form.controls.transmissionMode && this.form.controls.transmissionMode.value === FccBusinessConstantsService.SWIFT)) {
          this.form.addFCCValidators('governingLaw', Validators.pattern(this.enquiryRegex), 0);
          this.form.addFCCValidators('expiryEvent', Validators.pattern(this.enquiryRegex), 0);
          this.form.addFCCValidators(FccGlobalConstant.OTHER_APPLICABLE_RULES, Validators.pattern(this.enquiryRegex), 0);
          this.form.addFCCValidators('governCountrySubdiv', Validators.pattern(this.swiftZCharRegex), 0);
          this.form.get('otherApplicableRules').updateValueAndValidity();
          this.form.get('governingLaw').updateValueAndValidity();
          this.form.get('expiryEvent').updateValueAndValidity();
          this.form.get(FccGlobalConstant.NON_TRANS_INST).updateValueAndValidity();
          
        }
    this.taskSubscription = this.fccTaskService.notifyTaskAfterSaveTnx$.subscribe(data => {
      if(data) {
      if (this.form && this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL, this.form)) {
        this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
      }
      if (this.form && this.commonService.isNonEmptyField('removeLabelTemplate', this.form)) {
        this.form.get('removeLabelTemplate')[this.params][this.rendered] = false;
      }
      }
      });
  }

  setAmendmentNumbers(){
    const amdReqNo = this.stateService.getSectionData(FccGlobalConstant.eventDetails).get('amendmentReqNo');
    const amendmentNo = this.stateService.getSectionData(FccGlobalConstant.eventDetails).get('amendmentNo');

    if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
      ( this.commonService?.currentStateTnxResponse !== undefined
        && this.commonService.currentStateTnxResponse?.prod_stat_code === FccGlobalConstant.N005_AMENDED) && amendmentNo !== null)) {
      const amdReqNoValue = (amdReqNo && amdReqNo.value) ? amdReqNo.value: '';
      const amdNoAvl = (amendmentNo && amendmentNo.value) ? true :false;
      if (amdNoAvl) {
        this.amdNoVal = amendmentNo.value;
        amendmentNo[this.params][this.rendered] = false;
      }
      if ((this.tnxStatCode === FccGlobalConstant.N004_UNCONTROLLED || this.tnxStatCode === FccGlobalConstant.N004_INCOMPLETE ||
        ( this.commonService?.currentStateTnxResponse !== undefined
        && this.commonService.currentStateTnxResponse?.tnx_stat_code === FccGlobalConstant.N004_UNCONTROLLED))
        && (amdReqNoValue === null || amdReqNoValue === undefined || amdReqNoValue === '')){
          amdReqNo.setValue(FccGlobalConstant.AMD_REQ_NOT_GENERATED);
          amendmentNo[this.params][this.rendered] = false;
          amdReqNo[this.params][this.rendered] = true;
      } else if(( this.commonService?.currentStateTnxResponse !== undefined
          && this.commonService?.currentStateTnxResponse?.prod_stat_code === FccGlobalConstant.N005_REJECTED)
          || (amdReqNoValue && !amdNoAvl)){
        amdReqNo.setValue(this.formatAmdNoService.formatAmdNo(amdReqNoValue));
        amendmentNo[this.params][this.rendered] = false;
        amdReqNo[this.params][this.rendered] = true;
      } else {
        if(amdNoAvl && (this.commonService?.currentStateTnxResponse !== undefined
          && this.commonService.currentStateTnxResponse?.tnx_stat_code === FccGlobalConstant.N004_ACKNOWLEDGED)){
          amendmentNo.setValue(this.formatAmdNoService.formatAmdNo(this.amdNoVal));
        }
        if (amdReqNo) {
          amdReqNo[this.params][this.rendered] = false;
        }
      }
      if(amdReqNo) {
        amdReqNo.updateValueAndValidity();
      }
      if(amendmentNo){
        amendmentNo.updateValueAndValidity();
      }
      }
  }

  getExcludedFieldsNdSections() {
    const productCode = FccGlobalConstant.PRODUCT_SI;
    const subProductCode = '';
    this.transactionDetailService.getExcludedFieldsNdSections(productCode, subProductCode).subscribe(
      (response) => {
        this.excludedFieldsNdSections = response.body;
      }, (error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    );
  }

  populateMultiBank() {
    const subProductCode = '';
    this.multiBankService.getCustomerBankDetails( FccGlobalConstant.PRODUCT_SI, subProductCode).subscribe(
      res => {
        this.multiBankService.initializeProcess(res);
        this.setBankNameList();
      },
      () => {
        this.multiBankService.clearAllData();
      }
    );
  }

  setBankNameList() {
    if (this.nameOrAbbvName === 'abbv_name') {
      this.corporateBanks = [];
      this.multiBankService.getBankList().forEach(bank => {
        bank.label = bank.value;
        this.corporateBanks.push(bank);
      });
    } else {
      this.corporateBanks = [];
      this.multiBankService.getBankList().forEach(bank => {
        this.corporateBanks.push(bank);
      });
    }
  }

  provisional() {
    this.RenderProvisional = false;

    this.commonService.getParamData(FccGlobalConstant.PRODUCT_SI, 'P306').subscribe(response => {

      for (let i = 0; i < response.largeParamDetails.length; i++) {

        if (response.largeParamDetails[i].largeParamKeyDetails !== null) {
          this.provisionalBankList.add(response.largeParamDetails[i].largeParamKeyDetails.key_1);
          this.RenderProvisional = true;
        }

        if (response.largeParamDetails[i].largeParamDataList !== null) {

          for (let j = 0; j < response.largeParamDetails[i].largeParamDataList.length; j++) {

            if (response.largeParamDetails[i].largeParamDataList[j].data_2 === 'Y') {
              this.sitype.add(response.largeParamDetails[i].largeParamDataList[j].data_1);
              this.provisionalBankMap.set(response.largeParamDetails[i].largeParamKeyDetails.key_1 ,
                response.largeParamDetails[i].largeParamDataList[j].data_1);
            }

          }
        }
      }
      let index = 0;
      for (const currentNumber of this.provisionalBankList) {
        for (let i = 0; i < response.largeParamDetails.length; i++) {
          if (response.largeParamDetails[i].largeParamKeyDetails !== null) {
            if(response.largeParamDetails[i].largeParamKeyDetails.key_1 === currentNumber){
              index =i;
            }
          }
        }
        if (!(currentNumber === '*') && response.largeParamDetails[index].largeParamDataList[0].data_2 === 'N') {
          this.RenderProvisional = false;
        }
      }
      for (let i = 0; i < response.largeParamDetails.length; i++) {
        if (response.largeParamDetails[i].largeParamDataList !== null) {

          for (let j = 0; j < response.largeParamDetails[i].largeParamDataList.length; j++) {

            if (response.largeParamDetails[i].largeParamDataList[j].data_2 === 'Y' 
            && response.largeParamDetails[i].largeParamKeyDetails.key_1 !== '*') {
              this.RenderProvisional = true;
            }
          }
        }
      }
      this.commonService.putQueryParameters( 'provisionalBankList', this.provisionalBankList);
      this.commonService.putQueryParameters( 'provisionalBankMap', this.provisionalBankMap);
      this.singleBank = (this.provisionalBankList.size === 1) ? true : false;
      this.provisionalBankArr = [];
      for (const currentNumber of this.provisionalBankList) {
        this.provisionalBankArr.push(currentNumber);
    }
      this.provisionlRender();
    });

  }
  provisionlRender() {
    let provisionalVariable = false;
    this.multiBankService.getProvisionalBankList().forEach(element => {
      if (this.provisionalBankMap.has(element) || this.provisionalBankMap.has('*')) {
        provisionalVariable = true;
      }
      });
      this.provRender = this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.PROVISIONALRENDERED];
    if (this.RenderProvisional && provisionalVariable && 
      this.provRender && this.option !== 'TEMPLATE' && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND)
    {
      this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.ISANYPROVBANKAVL] = true;
      this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
     } else {
       this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
     }
    this.form.updateValueAndValidity();
    }

    handleViewForBackToBackToggle() {
      const subTnxTypeCode = this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE);
      if (this.commonService.isNonEmptyField(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE, this.form) &&
          this.commonService.isNonEmptyValue(subTnxTypeCode.value)
          && subTnxTypeCode.value === FccGlobalConstant.LC_BACK_TO_BACK) {
            subTnxTypeCode.setValue('Y');
      }
    }

  updateValues() {
    this.onClickConfirmationOptions();
  }

  onClickConfirmationOptions() {
    this.toggleValue(this.form.get('confirmationOptions').value, 'confirmationOptions');
  }

  onClickCustomerReference() {
    this.form.get('customerReference')[this.params][FccGlobalConstant.MAXLENGTH] = this.custRefLength;
    this.form.updateValueAndValidity();
  }

  toggleValue(value, feildValue) {
    if (value === FccGlobalConstant.CONFIRMATION_OPTION_CONFIRM || value === FccGlobalConstant.CONFIRMATION_OPTION_MAY_ADD) {
      this.form.get(feildValue)[this.params][this.warning] = `${this.translateService.instant(this.confirmationPartymessage)}`;
    } else {
      this.form.get(feildValue)[this.params][this.warning] = FccGlobalConstant.EMPTY_STRING;
    }
    this.templateChanges();
  }
  templateChanges() {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.form.addFCCValidators(FccGlobalConstant.TEMPLATE_NAME,
        Validators.compose([Validators.pattern(FccGlobalConstant.TEMPLATE_NAME_VALIDATION)]), 0);
      this.form.get('provisionalLCToggle')[this.params][this.rendered] = false;
      if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_NAME, this.form)){
        this.form.get(FccGlobalConstant.TEMPLATE_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_NAME, this.form)){
        this.form.get(FccGlobalConstant.TEMPLATE_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE, this.form)){
        this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_DESC, this.form)){
        this.form.get(FccGlobalConstant.TEMPLATE_DESC)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM, this.form)){
        this.form.get(FccGlobalConstant.CREATE_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form)){
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.patchFieldParameters(this.form.get('applicableRulesOptions'), { autoDisplayFirst : false });
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_PRODUCT_CODE), FccGlobalConstant.SUBPRODUCT_DEFAULT, {});
      // this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_PRODUCT_CODE), '', {});
      if (this.mode !== FccGlobalConstant.DRAFT_OPTION && !this.form.get('templateName').value) {
        this.commonService.generateTemplateName(FccGlobalConstant.PRODUCT_SI).subscribe( res => {
          const jsonContent = res.body as string[];
          const templateName = jsonContent[`templateName`];
          this.form.get('templateName').setValue(templateName);
          this.commonService.putQueryParameters('templateName', this.form.get('templateName').value);
        });
      }
      this.commonService.putQueryParameters('templateName', this.form.get('templateName').value);
      this.setMandatoryField(this.form, FccGlobalConstant.EXPIRY_DATE_FIELD, false);
      this.setMandatoryField(this.form, FccGlobalConstant.STANDBY_LC_TYPE, false);
      this.form.get( FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
      this.form.get(FccGlobalConstant.STANDBY_LC_TYPE).clearValidators();
      this.form.updateValueAndValidity();
      if ( this.templteId !== undefined && this.templteId !== null && this.mode === FccGlobalConstant.DRAFT_OPTION
          && this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_NAME, this.form)) {
          this.form.get(FccGlobalConstant.TEMPLATE_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      }
    } else if(this.mode === FccGlobalConstant.VIEW){
      this.form.get('templateSelection')[this.params][this.rendered] = true;
      this.form.get('templateSelection')[this.params][this.lcConstant.previewScreen] = true;
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[this.params][this.lcConstant.previewScreen] = true;
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[this.params][this.readonly] = true;
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE).updateValueAndValidity();
    }
  }

  handleStandbyLCOptions() {
    const elementId = FccGlobalConstant.STANDBY_LC_TYPE;
    this.productCode = FccGlobalConstant.PRODUCT_DEFAULT;
    this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    const elementValue = this.form.get(FccGlobalConstant.STANDBY_LC_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (this.form.get(FccGlobalConstant.STANDBY_LC_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
        this.form.get(FccGlobalConstant.STANDBY_LC_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
        this.form.get(FccGlobalConstant.STANDBY_LC_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
      this.codeID = this.form.get(FccGlobalConstant.STANDBY_LC_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    }
    if (elementValue !== undefined && elementValue.length === 0) {
      this.eventDataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
      this.patchFieldParameters(this.form.get(elementId), { options: this.eventDataArray });
    }
    if (elementValue !== undefined && elementValue.length !== 0) {
      elementValue.forEach((value, index) => {
        if (value.value === '*') {
          elementValue.splice(index, 1);
        }
      });
      this.patchFieldParameters(this.form.get(elementId), { options: elementValue });
      this.form.updateValueAndValidity();
    }
  }

  onClickStandbyLCTypeOptions(event) {
    this.handleStandbyLCOptions();
    if (this.form.get(FccGlobalConstant.REQUEST_OPTION_LC) &&
      this.form.get(FccGlobalConstant.REQUEST_OPTION_LC).value === FccGlobalConstant.REQUEST_OPTION_LC_FREE_FORMAT) {
      this.form.get(FccGlobalConstant.STANDBY_LC_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccGlobalConstant.STANDBY_LC_TYPE).setErrors(null);
      this.form.get(FccGlobalConstant.STANDBY_LC_TYPE).clearValidators();
    } else if (event.value === FccGlobalConstant.STANDBY_LC_OTHR_99) {
      this.form.get(FccGlobalConstant.STANDY_OTHR_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    } else {
      this.form.get(FccGlobalConstant.STANDY_OTHR_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      const resetFields = [FccGlobalConstant.STANDY_OTHR_INST];
      this.resetValues(this.form, resetFields);
    }
    this.form.updateValueAndValidity();
}

onClickApplicableRulesOptions() {
  const applicableRule = this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS).value;
  if (applicableRule && applicableRule.toString() === FccBusinessConstantsService.OTHER_99) {
    this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES).clearValidators();
    this.form.addFCCValidators(FccGlobalConstant.OTHER_APPLICABLE_RULES,
      Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)
    ]), 1);
    this.setMandatoryField(this.form, FccGlobalConstant.OTHER_APPLICABLE_RULES, true);
    this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES).updateValueAndValidity();
  } else {
    this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.setMandatoryField(this.form, FccGlobalConstant.OTHER_APPLICABLE_RULES, false);
    this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES).updateValueAndValidity();
  }
  this.handleLCApplicableRulesOptions();
  if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
    (this.form.controls.transmissionMode && this.form.controls.transmissionMode.value[0] &&
      this.form.controls.transmissionMode.value[0].value === FccBusinessConstantsService.SWIFT) ||
      (this.form.controls.transmissionMode && this.form.controls.transmissionMode.value === FccBusinessConstantsService.SWIFT)) {
    this.form.addFCCValidators(FccGlobalConstant.OTHER_APPLICABLE_RULES, Validators.pattern(this.enquiryRegex), 0);
    this.form.get('otherApplicableRules').updateValueAndValidity();
  }
  this.handleApplicableRules();
}
handleLCApplicableRulesOptions() {
  const elementId = FccGlobalConstant.APPLICABLE_RULES_OPTIONS;
  this.productCode = FccGlobalConstant.PRODUCT_DEFAULT;
  this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
  const elementValue = this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
  this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
  if (this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
      this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
      this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
    this.codeID = this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
  }
  if (elementValue !== undefined && elementValue.length === 0) {
    if(this.isApplicableRulesMandatory === true) {
    this.eventDataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
    } else {
      this.eventDataArray = this.codeDataService.getCodeDataWithEmptyVal(this.codeID, this.productCode,
      this.subProductCode, this.form, elementId);
    }
    this.patchFieldParameters(this.form.get(elementId), { options: this.eventDataArray });
  }
  if (elementValue !== undefined && elementValue.length !== 0) {
    elementValue.forEach((value, index) => {
      if (value.value === '*') {
        elementValue.splice(index, 1);
      }
    });
    this.patchFieldParameters(this.form.get(elementId), { options: elementValue });
    this.form.updateValueAndValidity();
  }
}
  initializeFormGroup() {
    const sectionName = FccGlobalConstant.SI_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.commonService.formatForm(this.form);
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.siProductService.disableRequestOptionsOnSave(this.form);
      if (this.form.get(FccGlobalConstant.REQUEST_OPTION_LC)) {
        const requestLCOption = this.form.get(FccGlobalConstant.REQUEST_OPTION_LC).value;
        if (requestLCOption === FccGlobalConstant.REQUEST_OPTION_LC_FREE_FORMAT) {
          this.requiredSettingsOnRequestType(false);
          this.commonService.freeFormatOptionSelected = true;
        } else if (requestLCOption === FccGlobalConstant.REQUEST_OPTION_LC_REGULAR) {
          this.requiredSettingsOnRequestType(true);
          this.commonService.freeFormatOptionSelected = false;
        }
      }
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
      if (this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS) &&
       this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.options] !== undefined)
      {
        this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.rendered] = true;
      }
    }
    this.prepareExpiryTypes();
    this.prepareDemandIndicatorTypes();
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.handleStandbyLCOptions();
    }
    this.swiftRenderedFields();
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      if (this.form.get(FccGlobalConstant.EXPIRY_TYPES_SI)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== null
        && this.form.get(FccGlobalConstant.EXPIRY_TYPES_SI)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== ''
        && this.form.get(FccGlobalConstant.EXPIRY_TYPES_SI)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== undefined) {
        this.form.get(FccGlobalConstant.EXPIRY_TYPES_SI)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.form.get(FccGlobalConstant.DEMAND_INDICATOR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== null
        && this.form.get(FccGlobalConstant.DEMAND_INDICATOR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== ''
        && this.form.get(FccGlobalConstant.DEMAND_INDICATOR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== undefined) {
        this.form.get(FccGlobalConstant.DEMAND_INDICATOR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
    }
    this.getCountryDetail();
    if (this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== null
      && this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== ''
      && this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== undefined) {
      this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    if (this.form.get(FccGlobalConstant.PLACE_OF_EXPIRY).value === null) {
      this.form.get(FccGlobalConstant.PLACE_OF_EXPIRY).setValue(`${this.translateService.instant(FccGlobalConstant.DEFAULT_EXPIRY_PLACE)}`);
    }
    if (this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.STANDBY_LC_TYPE)?.value) &&
        this.form.get(FccGlobalConstant.STANDBY_LC_TYPE).value === FccGlobalConstant.STANDBY_LC_OTHR_99) {
      this.form.get(FccGlobalConstant.STANDY_OTHR_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    } else {
      this.form.get(FccGlobalConstant.STANDY_OTHR_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      const resetFields = [FccGlobalConstant.STANDY_OTHR_INST];
      this.resetValues(this.form, resetFields);
    }
    if (this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.NTRF_FLAG)?.value) &&
        this.form.get(FccGlobalConstant.NTRF_FLAG).value === FccBusinessConstantsService.NO) {
      this.form.get(FccGlobalConstant.NON_TRANS_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.NON_TRANS_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.PHRASE_ENABLED] = true;
    } else {
      this.form.get(FccGlobalConstant.NON_TRANS_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      const resetFields = [FccGlobalConstant.NON_TRANS_INST];
      this.resetValues(this.form, resetFields);
    }
    if (this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS) &&
    this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.rendered]) {
      this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params]['showRemoveLink'] = false;
    }
    this.form.updateValueAndValidity();
  }

  amendFormFields() {
    const sectionName = FccGlobalConstant.SI_GENERAL_DETAILS;
    this.form.get('siRequestType')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('modeofTransmission')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('amendNarrativeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('amendmentNarrative')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.addFCCValidators('amendmentNarrative', Validators.pattern(this.swiftXCharSet), 0);
    this.form.get('createFrom')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('createFromOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('otherApplicableRules')[FccGlobalConstant.PARAMS][FccGlobalConstant.PARENT_STYLE_CLASS] = 'otherApplicableRulesStyle';
    this.form.get('demandIndicatorType')[FccGlobalConstant.PARAMS][FccGlobalConstant.PARENT_STYLE_CLASS] = 'infoIconStyle';
    this.form.get('references')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = 'viewModeSubHeader';
    this.form.get('provisionalLCToggle')[this.params][this.rendered] = false;
    this.amendCommonService.setValueFromMasterToPrevious(sectionName);
    this.form1 = this.stateService.getSectionData(FccGlobalConstant.SI_NARRATIVE_DETAILS);
    this.commonService.getSwiftVersionValue();
    this.expansionPanelSplitValue();
    this.updateNarrativeCount();
  }

  updateNarrativeCount() {
    if (this.form.get('amendmentNarrative').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('amendmentNarrative').value);
      this.form.get('amendmentNarrative')[this.params][this.enteredCharCount] = count;
    }
  }

   expansionPanelSplitValue() {
    const goodsandDoc = 'siGoodsandDoc';
    const descOfGoods = 'siDescOfGoods';
    const docRequired = 'siDocRequired';
    const additionallnstruction = 'siAdditionallnstruction';
    const otherDetails = 'siOtherDetails';
    const specialPaymentNarrativeBene = 'siSpecialPaymentNarrativeBene';
    this.narrativeService.descOfGoodsLoad(this.form1, goodsandDoc, descOfGoods);
    this.narrativeService.docRequiredLoad(this.form1, goodsandDoc, docRequired);
    this.narrativeService.additionallnstructionLoad(this.form1, goodsandDoc, additionallnstruction);
    this.narrativeService.specialPaymentNarrativeBeneLoad(this.form1, otherDetails, specialPaymentNarrativeBene);
   }

getCountryDetail() {
  this.commonService.getCountries().subscribe(data => {
    this.updateCountries(data);
  });
}

updateCountries(body: any) {
  this.countryList = body;
  this.countryList.countries.forEach(value => {
    const country: { label: string; value: any } = {
      label: value.alpha2code + '-' + value.name,
      value: {
        label: value.alpha2code,
        shortName: value.alpha2code,
        name: value.name,
        concatinatedName: value.alpha2code + '-' + value.name
      }
    };
    this.country.push(country);
    const countryList: { label: string; value: any } = {
      label: value.alpha2code + '-' + value.name,
      value: {
        label: value.alpha2code,
        shortName: value.alpha2code,
        name: value.name,
        concatinatedName: value.alpha2code + '-' + value.name
      }
    };
    this.countries.push(countryList);
  });
  this.patchFieldParameters(this.form.get('placeOfJurisdiction'), { options: this.countries });
  this.updateCountryValues();
  this.form.updateValueAndValidity();
}

  updateCountryValues() {
    if (this.form.get('placeOfJurisdiction') && this.form.get('placeOfJurisdiction').value && this.country.length > 0) {
      const placeOfJurisdiction = this.stateService.
      getValue(FccGlobalConstant.SI_GENERAL_DETAILS, 'placeOfJurisdiction', this.isMasterRequired);
      if (placeOfJurisdiction !== undefined && placeOfJurisdiction !== '' ) {
        this.form.get('placeOfJurisdiction').setValue(this.country.filter(
          task => task.value.shortName === placeOfJurisdiction)[0].value);
        this.form.get('placeOfJurisdiction').updateValueAndValidity();
      }
    }
  }

onClickExpiryType(event) {

    if (event.value) {
      const resetFields = [FccGlobalConstant.EXPIRY_DATE_FIELD, FccGlobalConstant.EXPIRY_EVENT];
      this.resetValues(this.form, resetFields);
      this.checkExpiryType(event.value);
    }
}

checkExpiryType(expiryTypeValue: any) {
  if (expiryTypeValue && expiryTypeValue === FccGlobalConstant.EXP_TYPE_VALUE_SPECIFIC) {
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.form.get(FccGlobalConstant.EXPIRY_EVENT).clearValidators();
  } else if (expiryTypeValue && expiryTypeValue === FccGlobalConstant.EXP_TYPE_VALUE_CONDITIONAL) {
    this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
  } else if (expiryTypeValue && expiryTypeValue === FccGlobalConstant.EXP_TYPE_VALUE_UNLIMITED) {
    this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.form.get(FccGlobalConstant.EXPIRY_EVENT).clearValidators();
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
  }
  this.form.updateValueAndValidity();
}

onClickNtrf_flag(event) {
  if ((event.checked !== undefined && !event.checked) || event === 'N') {
    this.form.get(FccGlobalConstant.NON_TRANS_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccGlobalConstant.NON_TRANS_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.PHRASE_ENABLED] = true;
  } else {
    this.form.get(FccGlobalConstant.NON_TRANS_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    const resetFields = [FccGlobalConstant.NON_TRANS_INST];
    this.resetValues(this.form, resetFields);
  }
  this.form.updateValueAndValidity();
}

  swiftRenderedFields() {
    const dependentFields = ['expiryType', 'expiryEvent','placeOfJurisdiction', 'governingLaw',
    'demandIndicatorType', 'expiryTypes', 'demandIndicator'];
    const governFields = ['placeOfJurisdiction', 'governingLaw','governCountrySubdiv'];
    this.commonService.getSwiftVersionValue();
    if(this.commonService.swiftVersion < 2023){
      this.form.get('governCountrySubdiv')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    if (this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2021) {
      this.setRenderOnlyFields(this.form, dependentFields, true);
      this.form.updateValueAndValidity();
      if(this.tnxTypeCode === FccGlobalConstant.AMEND_TERM){
        this.setRenderOnlyFields(this.form, governFields, false);
        this.form.updateValueAndValidity();
      }
    } else {
      this.setRenderOnlyFields(this.form, dependentFields, false);
      this.form.updateValueAndValidity();
    }
  }

  setRenderOnly(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { rendered: flag });
  }

  setRenderOnlyFields(form, ids: string[], flag) {
    ids.forEach(id => this.setRenderOnly(form, id, flag));
  }

  onClickPhraseIcon(event, key) {
    if (key === FccGlobalConstant.AMENDMENT_NARRATIVE) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LC, key, '13');
    } else {
      this.entityName = this.stateService.getSectionData(FccGlobalConstant.SI_APPLICANT_BENEFICIARY).get('applicantEntity').value.shortName;
      if (this.entityName !== '' && this.entityName !== undefined) {
        this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '01', false, this.entityName);
      } else {
        this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '01', false);
      }
    }
  }

  prepareExpiryTypes() {
    const elementId = FccGlobalConstant.EXPIRY_TYPE_SI;
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    const elementValue = this.form.get(FccGlobalConstant.EXPIRY_TYPE_SI)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    if (this.form.get(FccGlobalConstant.EXPIRY_TYPE_SI)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
        this.form.get(FccGlobalConstant.EXPIRY_TYPE_SI)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
        this.form.get(FccGlobalConstant.EXPIRY_TYPE_SI)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
        this.codeID = this.form.get(FccGlobalConstant.EXPIRY_TYPE_SI)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
      }
    if (elementValue.length === 0) {
        this.dataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
        this.patchFieldParameters(this.form.get(elementId), { options: this.dataArray });
      }
    this.form.get(elementId).updateValueAndValidity();
  }

  prepareDemandIndicatorTypes() {
    const elementId = FccGlobalConstant.DEMAND_INDICATOR_TYPE;
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    const elementValue = this.form.get(FccGlobalConstant.DEMAND_INDICATOR_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    if (this.form.get(FccGlobalConstant.DEMAND_INDICATOR_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
        this.form.get(FccGlobalConstant.DEMAND_INDICATOR_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
        this.form.get(FccGlobalConstant.DEMAND_INDICATOR_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
        this.codeID = this.form.get(FccGlobalConstant.DEMAND_INDICATOR_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
      }
    if (elementValue.length === 0) {
        this.dataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
        this.patchFieldParameters(this.form.get(elementId), { options: this.dataArray });
      }
    this.form.get(elementId).updateValueAndValidity();
  }

  onClickTransmissionMode(data: any) {
    if (data.value === FccGlobalConstant.TRANS_MODE_TELEX) {
      this.form.get(FccGlobalConstant.PLACE_OF_EXPIRY).setValidators([]);
      this.form.get('governingLaw').clearValidators();
      this.form.get('expiryEvent').clearValidators();
      this.form.get('otherApplicableRules').clearValidators();
      this.form.get(FccGlobalConstant.NON_TRANS_INST).clearValidators();
      this.form.get('governingLaw').updateValueAndValidity();
      this.form.get('expiryEvent').updateValueAndValidity();
      this.form.get('otherApplicableRules').updateValueAndValidity();
      this.form.get(FccGlobalConstant.NON_TRANS_INST).updateValueAndValidity();
      this.form.get(FccGlobalConstant.PLACE_OF_EXPIRY).setValue(`${this.translateService.instant(FccGlobalConstant.DEFAULT_EXPIRY_PLACE)}`);
      this.form.get(FccGlobalConstant.PLACE_OF_EXPIRY).updateValueAndValidity();
    }
    if (data.value === FccGlobalConstant.TRANS_MODE_COURIER) {
      this.form.get(FccGlobalConstant.PLACE_OF_EXPIRY).setValidators([]);
      this.form.get(FccGlobalConstant.PLACE_OF_EXPIRY).setValidators([]);
      this.form.get('governingLaw').clearValidators();
      this.form.get('expiryEvent').clearValidators();
      this.form.get('otherApplicableRules').clearValidators();
      this.form.get(FccGlobalConstant.NON_TRANS_INST).clearValidators();
      this.form.get('governingLaw').updateValueAndValidity();
      this.form.get('expiryEvent').updateValueAndValidity();
      this.form.get('otherApplicableRules').updateValueAndValidity();
      this.form.get(FccGlobalConstant.NON_TRANS_INST).updateValueAndValidity();
      this.form.get(FccGlobalConstant.PLACE_OF_EXPIRY).setValue(`${this.translateService.instant(FccGlobalConstant.DEFAULT_EXPIRY_PLACE)}`);
      this.form.get(FccGlobalConstant.PLACE_OF_EXPIRY).updateValueAndValidity();
    }
    if (data.value === FccGlobalConstant.TRANS_MODE_SWIFT) {
      this.swiftvalidation();
      this.form.get(FccGlobalConstant.PLACE_OF_EXPIRY).setValue(`${this.translateService.instant(FccGlobalConstant.DEFAULT_EXPIRY_PLACE)}`);
      this.form.addFCCValidators(FccGlobalConstant.PLACE_OF_EXPIRY, Validators.pattern(this.enquiryRegex), 0);
      this.form.addFCCValidators(FccGlobalConstant.OTHER_APPLICABLE_RULES, Validators.pattern(this.enquiryRegex), 0);
      this.form.get(FccGlobalConstant.PLACE_OF_EXPIRY).updateValueAndValidity();
      this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES).updateValueAndValidity();
    }
    if (data.value === FccBusinessConstantsService.OTHER_99) {
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT_OTHER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('governingLaw').clearValidators();
      this.form.get('expiryEvent').clearValidators();
      this.form.get(FccGlobalConstant.NON_TRANS_INST).clearValidators();
      this.form.get('governingLaw').updateValueAndValidity();
      this.form.get('expiryEvent').updateValueAndValidity();
      this.form.get('otherApplicableRules').updateValueAndValidity();
      this.form.get(FccGlobalConstant.NON_TRANS_INST).updateValueAndValidity();
      this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_MODE], false);
    } else {
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT_OTHER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_MODE], true);
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT).setValue('');
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT).clearValidators();
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT).updateValueAndValidity();
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    this.commonService.isTransmissionModeChanged(this.form.get('transmissionMode').value);
  }

  onBlurExpiryDate(event) {
    if (event.value === null || event.value === undefined || event.value === '') {
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setErrors({ required: true });
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
    } else {
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD)[this.params][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setErrors(null);
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
    }
    this.validateExpiryDate();
  }

  onBlurTemplateName() {
    if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_NAME, this.form)
    && (!this.form.get(FccGlobalConstant.TEMPLATE_NAME)[this.params][this.readonly])) {
      const templateName = this.form.get(FccGlobalConstant.TEMPLATE_NAME).value;
      this.lcTemplateService.isTemplateNameExists(templateName, FccGlobalConstant.PRODUCT_LC).subscribe( res => {
        const jsonContent = res.body as string[];
        const isTemplateIdExists = jsonContent[`isTemplateIdExists`];
        if (isTemplateIdExists) {
          this.form.get(FccGlobalConstant.TEMPLATE_NAME).setErrors({ duplicateTemplateName: { templateName } });
        } else {
          this.form.get(FccGlobalConstant.TEMPLATE_NAME).setErrors(null);
        }
      });
    }
  }

  onClickExpiryDate(event) {
    if (event.value === null || event.value === undefined || event.value === '') {
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setErrors({ required: true });
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
    } else {
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setErrors(null);
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
    }
    this.validateExpiryDate();
  }

  validateExpiryDate(): void {
    if (!this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).value) {
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setErrors({ required: true });
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
    }
    const expDate = this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).value;
    if ( expDate !== null && expDate !== '' && expDate !== undefined) {
    const lastShipmentDate =
          this.stateService.getSectionData(FccGlobalConstant.SI_SHIPMENT_DETAILS).get(FccGlobalConstant.SHIPMENT_DATE_FIELD).value;
    if (lastShipmentDate && expDate && (expDate < lastShipmentDate)) {
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValidators([compareExpDateWithLastShipmentDate]);
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
    } else if (this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).value && this.expiryDateBackToBack &&
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).value > this.expiryDateBackToBack) {
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValidators([compareNewExpiryDateToOld]);
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
    } else if (expDate) {
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValidators([compareExpiryDateToCurrentDate]);
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
    } else {
        this.commonService.clearValidatorsAndUpdateValidity(FccGlobalConstant.EXPIRY_DATE_FIELD, this.form);
    }
  }
}


    onClickBackToBackSIToggle() {
      const togglevalue = this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE).value;
      if (togglevalue === FccBusinessConstantsService.NO) {
        this.renderFormFieldsOnToggle(true);
        this.onClickApplicableRulesOptions();
        this.commonService.announceMission('no');
        this.form.get('tipAfterBackToBackSelect')[this.params][this.rendered] = false;
        this.form.get('selectSIMessage')[this.params][this.rendered] = false;
        this.form.get('infoIcons')[this.params][this.rendered] = false;
        this.form.get('backToBackSI')[this.params][this.rendered] = false;
        this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.rendered] = false;
        this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.options] = [];
        this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
        this.removeFormValues();
        this.form.get('requestOptionsLC')[this.params][this.rendered] = true;
        this.form.get('createFrom')[this.params][this.rendered] = true;
        this.form.get('createFromOptions')[this.params][this.rendered] = true;
        if (this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2021) {
          this.form.get('expiryTypes')[this.params][this.rendered] = true;
          this.form.get('expiryType')[this.params][this.rendered] = true;
          this.form.get('expiryEvent')[this.params][this.rendered] = true;
          this.form.get('placeOfJurisdiction')[this.params][this.rendered] = true;
          this.form.get('governingLaw')[this.params][this.rendered] = true;
          this.form.get('demandIndicator')[this.params][this.rendered] = true;
          this.form.get('demandIndicatorType')[this.params][this.rendered] = true;
        }
      } else {
        this.renderFormFieldsOnToggle(false);
        this.commonService.announceMission('yes');
        this.form.get('selectSIMessage')[this.params][this.rendered] = true;
        this.form.get('infoIcons')[this.params][this.rendered] = true;
        this.form.get('backToBackSI')[this.params][this.rendered] = true;
        this.form.get('requestOptionsLC')[this.params][this.rendered] = false;
        this.form.get('createFrom')[this.params][this.rendered] = false;
        this.form.get('createFromOptions')[this.params][this.rendered] = false;
        if (this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2021) {
          this.form.get('expiryTypes')[this.params][this.rendered] = true;
          this.form.get('expiryType')[this.params][this.rendered] = true;
          this.form.get('expiryEvent')[this.params][this.rendered] = true;
          this.form.get('placeOfJurisdiction')[this.params][this.rendered] = true;
          this.form.get('governingLaw')[this.params][this.rendered] = true;
          this.form.get('demandIndicator')[this.params][this.rendered] = true;
          this.form.get('demandIndicatorType')[this.params][this.rendered] = true;
        }
      }
    }

    renderFormFieldsOnToggle(val) {
      const fields = ['modeofTransmission', 'transmissionMode', 'expiryDate', 'placeOfExpiry', 'standbyLCTypeOptions', 'featureofSI',
       'irv_flag', 'ntrf_flag', 'ApplicableRules', 'applicableRulesOptions', 'confirmationInstruction', 'confirmationOptions',
       'references', 'customerReference', 'beneficiaryReference', 'otherApplicableRules'];
      if (val) {
        fields.forEach(ele => {
          this.form.get(ele)[this.params][this.rendered] = true;
        });
      } else {
        fields.forEach(ele => {
          this.form.get(ele)[this.params][this.rendered] = false;
        });
      }
    }

    requiredSettingsOnRequestType(val: any) {
      const fields = ['standbyLCTypeOptions', 'applicableRulesOptions'];
      if (val) {
        fields.forEach(ele => {
          this.form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        });
      } else {
        fields.forEach(ele => {
          this.form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
          this.form.get(ele).setErrors(null);
        });
      }
    }

    onClickRequestOptionsLC(event: any) {
      if (event.value === FccGlobalConstant.REQUEST_OPTION_LC_FREE_FORMAT) {
       this.requiredSettingsOnRequestType(false);
       this.commonService.freeFormatOptionSelected = true;
      } else if (event.value === FccGlobalConstant.REQUEST_OPTION_LC_REGULAR) {
        this.requiredSettingsOnRequestType(true);
        this.commonService.freeFormatOptionSelected = false;
      }
    }

    removeFormValues() {
      this.form.get('parentReference').setValue('');
      this.form.get('parentReference').updateValueAndValidity();
      this.form.get('subTnxTypeCode').setValue('');
      this.form.get('subTnxTypeCode').updateValueAndValidity();
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValue('');
      this.commonService.clearValidatorsAndUpdateValidity(FccGlobalConstant.EXPIRY_DATE_FIELD, this.form);
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
      this.commonService.setAmountForBackToBack('');
      this.commonService.setShipmentExpiryDateForBackToBack('');
      this.commonService.setClearBackToBackLCfields('yes');
    }

    onClickBackToBackSI() {
      const header = `${this.translateService.instant('existingLetterOfCredits')}`;
      const productCode = 'productCode';
      const headerDisplay = 'headerDisplay';
      const buttons = 'buttons';
      const savedList = 'savedList';
      const option = 'option';
      const downloadIconEnabled = 'downloadIconEnabled';
      const obj = {};
      this.commonService.backTobackExpDateFilter = true;
      obj[productCode] = FccGlobalConstant.PRODUCT_SI;
      obj[option] = 'BackToBack';
      obj[buttons] = false;
      obj[savedList] = false;
      obj[headerDisplay] = false;
      obj[downloadIconEnabled] = false;
      obj[FccGlobalConstant.CURRENT_DATE] = this.currentDate;
      this.resolverService.getSearchData(header, obj);
      this.backToBackResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
        if (this.templateResponse !== undefined) {
          this.templateResponse.unsubscribe();
        }
        if (this.lcResponse !== undefined) {
          this.lcResponse.unsubscribe();
        }
        if (response !== null) {
          this.form.get('selectSIMessage')[this.params][this.rendered] = false;
          this.form.get('infoIcons')[this.params][this.rendered] = false;
          this.form.get('backToBackSI')[this.params][this.rendered] = false;
          this.renderFormFieldsOnToggle(true);
          this.onClickApplicableRulesOptions();
          this.searchLayoutService.searchLayoutDataSubject.next(null);
          this.commonService.announceMission('no');
          this.commonService.setClearBackToBackLCfields('no');
          const val = this.form.get('requestOptionsLC')[this.params][this.options];
          const val1 = this.form.get('createFromOptions')[this.params][this.options];
          this.toggleRequestButtons(val, val1, true);
          this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_SI);
          const mode = 'INIT';
          this.initializeFormToSIDetailsResponse(response.responseData.REF_ID, mode);
        }
      });
    }

    toggleRequestButtons(val, val1, enable) {
      val.forEach( (element) => {
        element[this.disabled] = enable;
      });
      val1.forEach( (element) => {
        element[this.disabled] = enable;
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    initializeFormToSIDetailsResponse(response: any, mode?: any) {
      this.transactionDetailService.fetchTransactionDetails(response).subscribe(responseData => {
        const responseObj = responseData.body;
        this.commonService.setParentTnxInformation(responseObj);
        this.commonService.setShipmentExpiryDateForBackToBack(responseObj.last_ship_date);
        this.commonService.setAmountForBackToBack(responseObj.lc_amt);
        let dateParts;
        if (responseObj.exp_date) {
          dateParts = responseObj.exp_date.toString().split('/');
          this.expiryDateBackToBack = new Date(dateParts[FccGlobalConstant.LENGTH_2],
            dateParts[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1, dateParts[FccGlobalConstant.LENGTH_0]);
          this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).patchValue(this.expiryDateBackToBack);
        }
        this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_SI).subscribe(apiMappingModel => {
        const setStateForProduct = {
          responseObject: responseObj,
          apiModel: apiMappingModel,
          isMaster: false,
          fieldsList: this.fieldsArray,
          sectionsList: this.sectionsArray
        };
        this.commonService.productState.next(setStateForProduct);
        this.form = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS);
        this.prepareExpiryTypes();
        this.prepareDemandIndicatorTypes();
        this.getCountryDetail();
        this.form.get('backToBackSIToggle').setValue('Y');
        this.form.get('tipAfterBackToBackSelect')[this.params][this.rendered] = true;
        this.onClickProvisionalLCToggle();
        this.setBackToBackPreviewScreenValSI();
        this.form.get('parentReference').patchValue(response);
        this.form.get('parentReference')[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
        if (responseObj.bo_ref_id && (responseObj.bo_ref_id !== '' || responseObj.bo_ref_id !== null)) {
          this.form.get('parentBoRefId').setValue(responseObj.bo_ref_id);
        }
        this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.rendered] = true;
        this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params]['showRemoveLink'] = true;
        this.form.get('requestOptionsLC')[this.params][this.rendered] = false;
        this.form.get('createFrom')[this.params][this.rendered] = false;
        this.form.get('createFromOptions')[this.params][this.rendered] = false;
        this.form.get('subTnxTypeCode').patchValue(FccGlobalConstant.LC_BACK_TO_BACK);
        this.onClickApplicableRulesOptions();
        this.swiftRenderedFields();
        if (this.commonService.isNonEmptyField(FccGlobalConstant.EXPIRY_TYPE, this.form) &&
        this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.EXPIRY_TYPE)?.value)) {
          this.checkExpiryType(this.form.get(FccGlobalConstant.EXPIRY_TYPE).value);
      }
        const cardControl = this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS) as FCCFormControl;
        const cardData = this.productMappingService.getDetailsOfCardData(responseObj, cardControl);
        this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.options] = cardData;
        this.form.get('customerReference').setValue('');
        this.form.get('expiryDate').setValue('');
        this.form.get('customerReference').updateValueAndValidity();
        this.form.get('expiryDate').updateValueAndValidity();
        this.leftSectionService.reEvaluateProgressBar.next(true);
      });
    });
    }

    onClickRemoveSiCardDetails() {
      this.backtobackSIKey = FccGlobalConstant.BACK_TO_BACK_SI_SR;
      this.onClickRemoveLabel();
    }

    resetRemoveLabelSR() {
      this.renderFormFieldsOnToggle(false);
      this.commonService.announceMission('yes');
      this.form.get('selectSIMessage')[this.params][this.rendered] = true;
      this.form.get('infoIcons')[this.params][this.rendered] = true;
      this.form.get('backToBackSI')[this.params][this.rendered] = true;
      this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.rendered] = false;
      this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.options] = [];
      this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
      this.form.get('expiryType')[this.params][this.rendered] = false;
      this.form.get('expiryEvent')[this.params][this.rendered] = false;
      this.form.get('placeOfJurisdiction')[this.params][this.rendered] = false;
      this.form.get('governingLaw')[this.params][this.rendered] = false;
      this.form.get('demandIndicatorType')[this.params][this.rendered] = false;
      this.form.get('expiryTypes')[this.params][this.rendered] = false;
      this.form.get('demandIndicator')[this.params][this.rendered] = false;
      this.form.get('tipAfterBackToBackSelect')[this.params][this.rendered] = false;
      this.removeFormValues();
      this.form.get('requestOptionsLC').setValue('01');
      const val = this.form.get('requestOptionsLC')[this.params][this.options];
      const val1 = this.form.get('createFromOptions')[this.params][this.options];
      this.toggleRequestButtons(val, val1, false);
      this.backToBackResponse.unsubscribe();
    }

    editModeDataPopulate() {
      const parentRefID = this.form.get('parentReference').value;
      const templateName = this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_NAME, this.form) ?
                          this.form.get(FccGlobalConstant.TEMPLATE_NAME).value : undefined;
      this.bankTemplateName = this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_BANK_TEMPLATE, this.form) ?
                          this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE).value : undefined;
      if(this.mode === 'DRAFT'){
        this.form.get('createFrom')[this.params][this.rendered] = false;
        this.form.get('createFromOptions')[this.params][this.rendered] = false;
      }
      if (this.mode === 'DRAFT' && this.commonService.isNonEmptyValue(parentRefID) &&
      this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form)
      && this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value !== FccGlobalConstant.EXISTING_SI &&
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value !== FccGlobalConstant.EXISTING_TEMPLATE &&
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value !== FccGlobalConstant.BANK_TEMPLATE){
        const mode = 'EDIT';
        this.initializeFormToSIDetailsResponse(parentRefID, mode);
      } else if ( this.mode === 'DRAFT' && this.commonService.isNonEmptyValue(parentRefID) &&
      this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form)
      && this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.EXISTING_SI) {
        this.form.get('referenceSelected').patchValue(parentRefID);
        this.handlecopyFromFields();
      }
      else if ((this.mode === 'DRAFT' && this.option !== FccGlobalConstant.TEMPLATE) && this.commonService.isNonEmptyValue(templateName) &&
      this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form)
      && this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.EXISTING_TEMPLATE) {
        this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(templateName);
        this.handleTemplateFields(templateName);
        if (this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)) {
          this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
        }
      }
      else if ( this.mode === 'DRAFT' && this.commonService.isNonEmptyValue(this.bankTemplateName) &&
      this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form)
      && this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.BANK_TEMPLATE) {
        this.checkBankTemplateOnEdit(this.bankTemplateName);
      }
    }
  checkBankTemplateOnEdit(bankTemplateName: any) {
    this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(bankTemplateName);
    this.form.get('createFrom')[this.params][this.rendered] = true;
    if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_SELECTION, this.form)) {
      this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
    if (this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_BANK_TEMPLATE, this.form)) {
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
    if (this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
    }
    this.form.get('viewSpecimenHyperLink')[this.params][this.rendered] = true;
    this.viewDownloadEditMode();
  }

    viewDownloadEditMode() {
      const tnxid = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_ID);
      this.transactionDetailService.fetchTransactionDetails(tnxid, FccGlobalConstant.PRODUCT_SI).subscribe(response => {
        this.editModeDownloadData = response.body;
        this.siProductService.editModeDownloadData = this.editModeDownloadData;
        const params = {
          COMPANYID: `${this.editModeDownloadData.standby_template_bank_id}`,
          DOC_ID: '',
          FEATUREID: `${this.editModeDownloadData.stand_by_lc_code}`
        };
        this.transactionDetailService.fetchBankTemplateDetails(FccGlobalConstant.PRODUCT_SI, params).subscribe(responseData => {
          this.commonService.siBankDetailResponseObj = responseData.body;
          if (this.commonService.siBankDetailResponseObj.standby_text_type_code === '01' &&
          !isNaN(this.commonService.siBankDetailResponseObj.document_id)) {
            this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
            params.FEATUREID, { label: `${this.translateService.instant('STANDBYSTATIC')}` });
          }
          if (this.commonService.siBankDetailResponseObj.standby_text_type_code === '02' &&
          isNaN(this.commonService.siBankDetailResponseObj.document_id)) {
            this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
            params.FEATUREID, { label: `${this.translateService.instant('STANDBYEDITER')}` });
          }
          if (this.commonService.siBankDetailResponseObj.stylesheetname !== '**') {
            this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
            params.FEATUREID, { label: `${this.translateService.instant('xmlFile')}` });
          }
        });
      });
    }

    ngOnDestroy() {
      if (this.form !== undefined) {
        if (this.form.get(FccGlobalConstant.REQUEST_OPTION_LC) &&
          this.form.get(FccGlobalConstant.REQUEST_OPTION_LC).value === FccGlobalConstant.REQUEST_OPTION_LC_FREE_FORMAT) {
          this.requiredSettingsOnRequestType(false);
        }
        this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE)[this.params][this.disabled] = true;
        this.form.get('removeLabelTemplate')[this.params][this.rendered] = false;
    }
      this.stateService.setStateSection(FccGlobalConstant.SI_GENERAL_DETAILS, this.form, this.isMasterRequired);
      this.stateService.setStateSection(FccGlobalConstant.SI_NARRATIVE_DETAILS, this.form1);
      if (this.commonService.isNonEmptyValue(this.siDetailsResponse)){
        this.siDetailsResponse.unsubscribe();
      }
      this.commonService.actionsDisable = false;
      this.commonService.buttonsDisable = false;
      if (this.form && this.commonService.isNonEmptyField('amendmentNarrative', this.form) &&
       !((this.mode === 'view' && this.form.get(FccGlobalConstant.AMENDMENT_NARRATIVE).value !== null) ||
        (this.mode === 'EXISTING' && this.form.get(FccGlobalConstant.AMENDMENT_NARRATIVE).value !== '') &&
         this.tnxTypeCode === '03')) {
        this.form.get('amendNarrativeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('amendmentNarrative')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.backToBackResponse !== undefined) {
        this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
        this.backToBackResponse = null;
        this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
      }
      if (this.lcResponse !== undefined) {
        this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
        this.lcResponse = null;
        this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
      }
      if (this.templateResponse !== undefined) {
        this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
        this.templateResponse = null;
        this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
      }
      this.commonService.backTobackExpDateFilter = false;
      if(this.taskSubscription != null && this.taskSubscription != undefined){
        this.taskSubscription.unsubscribe();
       }
    }
    onClickCreateFromOptions(data: any) {
      if (data.value === 'existingsi') {
        this.onClickExistingSI();
      } else if (data.value === FccGlobalConstant.EXISTING_TEMPLATE) {
        this.onClickExistingTemplate();
      } else if (data.value === 'bankTemplate') {
        this.onClickBankTemplate();
        this.leftSectionService.reEvaluateProgressBar.next(true);
      }
    }

    onClickBankTemplate() {
      this.setFieldsArrayNdSectionsData(true, '');
      const header = `${this.translateService.instant('bankTemplateListing')}`;
      const productCode = 'productCode';
      const headerDisplay = 'headerDisplay';
      const buttons = 'buttons';
      const savedList = 'savedList';
      const option = 'option';
      const downloadIconEnabled = 'downloadIconEnabled';
      const obj = {};
      obj[productCode] = FccGlobalConstant.PRODUCT_SI;
      obj[option] = 'SBLCFROMBANKTEMPLATE';
      obj[buttons] = false;
      obj[savedList] = false;
      obj[headerDisplay] = false;
      obj[downloadIconEnabled] = false;
      this.resolverService.getSearchData(header, obj);
      this.commonService.actionsDisable = true;
      this.commonService.buttonsDisable = true;
      this.templateResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
        if (this.backToBackResponse !== undefined) {
          this.backToBackResponse.unsubscribe();
        }
        if (response !== null) {
          this.searchLayoutService.searchLayoutDataSubject.next(null);
          this.getBankTemplateById(response.responseData);
        }
      });
    }

    getBankTemplateById(params) {
      this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_SI);
      this.transactionDetailService.fetchBankTemplateDetails(FccGlobalConstant.PRODUCT_SI, params).subscribe(responseData => {
        this.commonService.siBankDetailResponseObj = responseData.body;
        this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_SI).subscribe(apiMappingModel => {
          const setStateForProduct = {
            responseObject: this.commonService.siBankDetailResponseObj,
            apiModel: apiMappingModel,
            isMaster: false,
            fieldsList: this.fieldsArray,
            sectionsList: this.sectionsArray
          };
          this.commonService.productState.next(setStateForProduct);
          this.form = this.stateService.getSectionData(this.sectionName);
          this.form.get('viewSpecimenHyperLink')[this.params][this.rendered] = true;
          this.onClickStandbyLCTypeOptions(this.form.get('standbyLCTypeOptions'));
          this.form.get('standbyLCTypeOptions')[this.params][this.disabled] = true;
          this.prepareExpiryTypes();
          this.prepareDemandIndicatorTypes();
          this.getCountryDetail();
          if (this.commonService.siBankDetailResponseObj.standby_text_type_code === '01' &&
          !isNaN(this.commonService.siBankDetailResponseObj.document_id)) {
            this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
            params.FEATUREID, { label: `${this.translateService.instant('STANDBYSTATIC')}` });
          }
          if (this.commonService.siBankDetailResponseObj.standby_text_type_code === '02' &&
          isNaN(this.commonService.siBankDetailResponseObj.document_id)) {
            this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
            params.FEATUREID, { label: `${this.translateService.instant('STANDBYEDITER')}` });
          }
          if (this.commonService.siBankDetailResponseObj.stylesheetname !== '**') {
            this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
            params.FEATUREID, { label: `${this.translateService.instant('xmlFile')}` });
          }
          if (this.commonService.isNonEmptyField(FccGlobalConstant.REQUEST_OPTION_LC, this.form)) {
            this.form.get(FccGlobalConstant.REQUEST_OPTION_LC)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          }
          if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_SELECTION, this.form)) {
            this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.TEMPLATE_SELECTION),
            '', { label: `${this.translateService.instant('fromBankTemplateText')}` });
          }
          if (this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_BANK_TEMPLATE, this.form)) {
          this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          }
          if (this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)) {
            this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          }
          this.form.get('fetchedBankTemplate').patchValue(params.FEATUREID);
          this.patchFieldParameters(this.form.get('fetchedBankTemplate'), { readonly: true });
          const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
          const val1 = this.form.get(FccGlobalConstant.REQUEST_OPTION_LC)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
          this.toggleCreateFormButtons(val, val1, true);
          this.removeUnwantedFieldsForTemplate();
        });
      });
    }
    onClickViewSpecimenHyperLink() {
      // SPECIFICCUSTOMER && STANDBYSTATIC
      const obj = {
        eventId: '', masterId: '', productCode: '', featureId: '', companyId: '',
        docId: '', mode: '', styleSheet: ''
      };
      if (this.commonService.siBankDetailResponseObj.standby_text_type_code === '01' &&
      !isNaN(this.commonService.siBankDetailResponseObj.document_id)) {
        obj.docId = `${this.commonService.siBankDetailResponseObj.document_id}`;
        obj.companyId = `${this.commonService.siBankDetailResponseObj.standby_template_bank_id}`;
        obj.productCode = FccGlobalConstant.PRODUCT_SI;
      }
      // STANDBYEDITER
      if (this.commonService.siBankDetailResponseObj.standby_text_type_code === '02' &&
      isNaN(this.commonService.siBankDetailResponseObj.document_id)) {
        if (this.mode === FccGlobalConstant.INITIATE) {
          obj.masterId = `${this.commonService.referenceId}`;
          obj.eventId = `${this.commonService.eventId}`;
          obj.featureId = `${this.commonService.siBankDetailResponseObj.stand_by_lc_code}`;
          obj.companyId = `${this.commonService.siBankDetailResponseObj.standby_template_bank_id}`;
          obj.productCode = FccGlobalConstant.PRODUCT_SI;
        }
        if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
          obj.masterId = `${this.commonService.referenceId}`;
          obj.eventId = `${this.commonService.eventId}`;
          obj.featureId = `${this.commonService.siBankDetailResponseObj.stand_by_lc_code}`;
          obj.companyId = `${this.editModeDownloadData.standby_template_bank_id}`;
          obj.productCode = FccGlobalConstant.PRODUCT_SI;
        }
      }
      // xsl
      if (this.commonService.siBankDetailResponseObj.stylesheetname !== '**') {
        obj.styleSheet = `${this.commonService.siBankDetailResponseObj.stylesheetname}`;
        obj.productCode = FccGlobalConstant.PRODUCT_SI;
        obj[this.formDataObj] = JSON.stringify(this.phrasesService.payloadObject.transaction);
      }
      this.downloadFileWithContent(obj);
    }

    async downloadFileWithContent(obj) {
      await this.transactionDetailService.downloadEditor(obj).toPromise().then(response => {
        let fileType;
        if (response.body.type) {
          fileType = response.type;
        } else {
          fileType = 'application/octet-stream';
        }
        const newBlob = new Blob([response.body], { type: fileType });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        //eslint-disable-next-line no-useless-escape
        const filename = response.headers.get('content-disposition').split(';')[1].split('=')[1].replace(/\"/g, '');
        link.download = filename;
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        window.URL.revokeObjectURL(data);
        link.remove();
      });
    }

    onClickExistingSI() {
      this.setFieldsArrayNdSectionsData(false, FccGlobalConstant.PRODUCT_SI);
      const header = `${this.translateService.instant('existingSIList')}`;
      const productCode = FccGlobalConstant.PRODUCT;
      const headerDisplay = FccGlobalConstant.HEADER_DISPLAY;
      const buttons = FccGlobalConstant.BUTTONS;
      const savedList = FccGlobalConstant.SAVED_LIST;
      const option = FccGlobalConstant.OPTION;
      const downloadIconEnabled = FccGlobalConstant.DOWNLOAD_ICON_ENABLED;
      const obj = {};
      obj[productCode] = FccGlobalConstant.PRODUCT_SI;
      obj[option] = 'Existing';
      obj[buttons] = false;
      obj[savedList] = false;
      obj[headerDisplay] = false;
      obj[downloadIconEnabled] = false;
      // const fieldsArray = ['expiryDate', 'customerReference', 'amount', 'lastShipmentDate'];
      this.resolverService.getSearchData(header, obj);
      this.siDetailsResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
        if (this.commonService.isNonEmptyValue(this.backToBackResponse)){
          this.backToBackResponse.unsubscribe();
        }
        if (response !== null) {
          this.searchLayoutService.searchLayoutDataSubject.next(null);
          const prodCode = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
            && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
            FccGlobalConstant.PRODUCT_SI : undefined;
          const eventIdToPass = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
            && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
            response.responseData.TNX_ID : response.responseData.REF_ID;
          this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_SI);
          this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_SI).subscribe(apiMappingModel => {
          this.transactionDetailService.fetchTransactionDetails(eventIdToPass, prodCode, false).subscribe(responseData => {
          const responseObj = responseData.body;
          // responseObj.lc_amt = '';
          // responseObj.lc_cur_code = '';
          const setStateForProduct = {
            responseObject: responseObj,
            apiModel: apiMappingModel,
            isMaster: false,
            fieldsList: this.fieldsArray,
            sectionsList: this.sectionsArray
          };
          this.commonService.productState.next(setStateForProduct);
          this.form = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS);
          if (!this.fieldsArray || this.fieldsArray.length === 0) {
            this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS).get('siIssuingBank').get('issuerReferenceList').
            setValue(FccGlobalConstant.EMPTY_STRING);
          }
          if (responseObj.entity){
            this.stateService.getSectionData(FccGlobalConstant.SI_APPLICANT_BENEFICIARY)
            .get('applicantEntity').setValue(responseObj.entity);
          }
          if (this.form.get('issueDateView')) {
            this.form.get('issueDateView').setValue(FccGlobalConstant.EMPTY_STRING);
          }
          this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE)[this.params][this.disabled] = true;
          this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.rendered] = false;
          this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.previewScreen] = false;
          this.handlecopyFromFields(response);
          this.onClickProvisionalLCToggle();
          this.setBackToBackPreviewScreenValSI();
          this.leftSectionService.reEvaluateProgressBar.next(true);
          this.handleApplicableRules();
        });
      });
        }
      });
    }
    toggleCreateFormButtons(val, val1, enable) {
      val.forEach( (element) => {
        element[this.disabled] = enable;
      });
    }

    /**
     * Handle copy from form fields
     */

     handlecopyFromFields(response?: any) {
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.EXISTING_SI);
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
      this.form.get('referenceSelected')[this.params][this.rendered] = true;
      this.form.get('fetchedRefValue')[this.params][this.rendered] = true;
      this.form.get('removeLabel')[this.params][this.rendered] = true;
      if (this.commonService.isNonEmptyValue(response)){
        this.form.get('fetchedRefValue').patchValue(response.responseData.REF_ID);
        this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).patchValue(response.responseData.REF_ID);
        this.form.get(FccTradeFieldConstants.PARENT_REFERENCE)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = true;
        // this.form.get(FccTradeFieldConstants.PARENT_REFERENCE)[this.params][this.rendered] = true;
        this.form.get('backToBackSIToggle')[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
      } else if (this.commonService.isNonEmptyValue(this.form.get('parentReference').value)){
        this.form.get('fetchedRefValue').patchValue(this.form.get('parentReference').value);
      }
      this.patchFieldParameters(this.form.get('fetchedRefValue'), { readonly: true });
      if (!this.fieldsArray || this.fieldsArray.length === 0) {
        this.form.get('customerReference').setValue(FccGlobalConstant.EMPTY_STRING);
        this.form.get(FccTradeFieldConstants.BANK_REFERENCE_VIEW).setValue(FccGlobalConstant.EMPTY_STRING);
        this.form.get(FccGlobalConstant.BENEFICIARY_REFERNCE).setValue(FccGlobalConstant.EMPTY_STRING);
        if (this.purchaseOrderEnable && this.commonService.getUserPermissionFlag(FccGlobalConstant.SI_DISPLAY_PO_REF)) {
          this.form.get(FccGlobalConstant.PO_REF)[this.params][this.rendered] = true;
          this.form.get(FccGlobalConstant.PO_REF).setValue(FccGlobalConstant.EMPTY_STRING);
        }
      }
      const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
      this.toggleCreateFormButtons(val, null, true);
      this.onClickApplicableRulesOptions();
      this.existingSICalls();
     }

    /**
     * Handle template fields
     */
    handleTemplateFields(templateID: any): void{
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.EXISTING_TEMPLATE);
      if (this.commonService.isNonEmptyField(FccGlobalConstant.REQUEST_OPTION_LC, this.form)){
        this.form.get(FccGlobalConstant.REQUEST_OPTION_LC)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.form.get(FccGlobalConstant.CREATE_FROM)[this.params][this.rendered] = false;
      if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_SELECTION, this.form)){
        this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_TEMPLATE, this.form)){
        this.form.get(FccGlobalConstant.FETCHED_TEMPLATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)){
        this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
      const element = document.createElement('div');
      element.innerHTML = templateID;
      templateID = element.textContent;
      this.form.get('fetchedTemplate').patchValue(templateID);
      this.form.get(FccGlobalConstant.TEMPLATE_NAME).patchValue(templateID);
      this.patchFieldParameters(this.form.get('fetchedTemplate'), { readonly: true });
      const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      const val1 = this.form.get(FccGlobalConstant.REQUEST_OPTION_LC)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      this.toggleCreateFormButtons(val, val1, true);
      this.onClickApplicableRulesOptions();
      this.existingSICalls();
      this.removeUnwantedFieldsForTemplate();
    }

    existingSICalls() {
      if (this.form.get('ntrf_flag') && this.commonService.isNonEmptyValue(this.form.get('ntrf_flag'))) {
        const fieldVal = this.form.get('ntrf_flag').value;
        this.onClickNtrf_flag(fieldVal);
      }
      this.onClickStandbyLCTypeOptions(this.form.get('standbyLCTypeOptions'));
      this.swiftRenderedFields();
      this.prepareExpiryTypes();
      this.prepareDemandIndicatorTypes();
      if (this.commonService.isNonEmptyField(FccGlobalConstant.EXPIRY_TYPE, this.form) &&
       this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.EXPIRY_TYPE)?.value)) {
         this.checkExpiryType(this.form.get(FccGlobalConstant.EXPIRY_TYPE).value);
      }
      this.getCountryDetail();
    }

    setFieldsArrayNdSectionsData(isTemplate: boolean, productCode: string) {
      this.revertCopyFromDetails();
      if (isTemplate) {
        this.excludingJsonFileKey = FccGlobalConstant.TEMPLATE.toLowerCase();
      } else {
        this.excludingJsonFileKey = productCode + FccGlobalConstant.TRANSACTION;
      }
      if (this.excludedFieldsNdSections) {
        this.fieldsArray = this.excludedFieldsNdSections[this.excludingJsonFileKey].fields;
        this.sectionsArray = this.excludedFieldsNdSections[this.excludingJsonFileKey].sections;
      }
    }

    revertCopyFromDetails() {
      this.copyFromProductCode = '';
      this.excludingJsonFileKey = '';
      this.fieldsArray = [];
      this.sectionsArray = [];
    }

    onClickRemoveLabel() {
      this.revertCopyFromDetails();
      this.commonService.setParentReference(null);
      const dir = localStorage.getItem('langDir');
      const headerField = `${this.translateService.instant('removeSelectedTransaction')}`;
      const obj = {};
      const locaKey = 'locaKey';
      if (this.templateSIKey) {
        obj[locaKey] = this.templateSIKey;
      } else if (this.backtobackSIKey) {
        obj[locaKey] = this.backtobackSIKey ;
      } else {
        obj[locaKey] = FccGlobalConstant.COPYFROM_KEY_SI;
      }
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        data: obj,
        header: headerField,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir }
      });
      dialogRef.onClose.subscribe((result: any) => {
        if (result.toLowerCase() === 'yes') {
          if (this.templateSIKey) {
            this.resetRemoveLabelTemplate();
          } else if (this.backtobackSIKey) {
            this.resetRemoveLabelSR();
          } else {
            this.resetFieldsForCopyFromTemplate();
          }
        }
        this.templateSIKey = null;
        this.backtobackSIKey = null;
      });
    }

  /**
   *  Reset fields for Copy From on click on confirmation from dialog box
   */
  resetFieldsForCopyFromTemplate(): void {
    if (this.commonService.isNonEmptyValue(this.siDetailsResponse)){
      this.siDetailsResponse.unsubscribe();
    }
    this.productStateService.clearState();
    this.formModelService.getFormModel(FccGlobalConstant.PRODUCT_SI).subscribe(modelJson => {
      this.productStateService.initializeProductModel(modelJson);
      this.productStateService.initializeState(FccGlobalConstant.PRODUCT_SI);
      this.productStateService.populateAllEmptySectionsInState();
      this.form = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS);
      this.form.get('createFromOptions')[this.params][this.rendered] = true;
      this.form.get('referenceSelected')[this.params][this.rendered] = false;
      this.form.get('fetchedRefValue')[this.params][this.rendered] = false;
      this.form.get('removeLabel')[this.params][this.rendered] = false;
      this.form.get('fetchedRefValue').setValue('');
      this.form.get('customerReference').setValue('');
      this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE)[this.params][this.disabled] = false;
      const val = this.form.get('createFromOptions')[this.params][this.options];
      const val1 = this.form.get('requestOptionsLC')[this.params][this.options];
      this.toggleCreateFormButtons(val, val1, false);
      this.form.get('createFromOptions').setValue('');
      this.onClickApplicableRulesOptions();
      this.existingSICalls();
    });
  }
  ngAfterViewChecked() {
    this.resetCreateForm();
    if (this.form.get('expiryDate')["params"]?.required) {
      this.form.get('expiryDate').clearValidators();
      this.form.get('expiryDate').setValidators([Validators.required]);
      this.form.get('expiryDate').updateValueAndValidity();
      this.cdRef.detectChanges();
    }
  }

  /**
   *
   * @param Refresh form elements
   * Update/refresh form controls if page is rendered but transaction state has been updated due to late observable
   * response
   */
   refreshFormElements(): void {
    Object.keys(this.form.controls).forEach(control => {
      if (this.commonService.isNonEmptyValue(this.form.get(control)) && this.commonService.isNonEmptyValue(this.form.get(control).value)){
        this.form.get(control).setValue(this.form.get(control).value);
        this.form.get(control).updateValueAndValidity();
      }
    });
   }

  resetCreateForm() {
    if (this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_BANK_TEMPLATE, this.form) &&
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE).value) {
      this.form.get('createFromOptions').setValue(FccGlobalConstant.BANK_TEMPLATE);
    } else if (this.form.get('fetchedRefValue').value) {
      this.form.get('createFromOptions').setValue('existingsi');
    } else if (this.form.get('fetchedTemplate').value) {
      this.form.get('createFromOptions').setValue(FccGlobalConstant.EXISTING_TEMPLATE);
    } else if (!this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE).value &&
      !this.form.get('fetchedRefValue').value && !this.form.get('fetchedTemplate').value) {
      this.form.get('createFromOptions').setValue('');
    }
  }

  populateDataForEditForm() {
    const parentRefID = this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).value;
    if (this.mode === 'DRAFT' && parentRefID !== undefined) {
      if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get('createFromOptions')[this.params][this.rendered] = false;
    }
  }
}

   onClickExistingTemplate() {
      this.setFieldsArrayNdSectionsData(true, '');
      const header = `${this.translateService.instant('templateListingForSI')}`;
      const productCode = 'productCode';
      const headerDisplay = 'headerDisplay';
      const buttons = 'buttons';
      const savedList = 'savedList';
      const option = 'option';
      const downloadIconEnabled = 'downloadIconEnabled';
      const obj = {};
      obj[productCode] = FccGlobalConstant.PRODUCT_SI;
      obj[option] = FccGlobalConstant.CREATE_FROM_TEMPLATE;
      obj[buttons] = false;
      obj[savedList] = false;
      obj[headerDisplay] = false;
      obj[downloadIconEnabled] = false;
      this.resolverService.getSearchData(header, obj);
      this.commonService.actionsDisable = true;
      this.commonService.buttonsDisable = true;
      this.templateResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
        if (this.backToBackResponse !== undefined) {
          this.backToBackResponse.unsubscribe();
        }
        if (response !== null) {
          this.searchLayoutService.searchLayoutDataSubject.next(null);
          this.templateIDSubProdCode = response.responseData.SUB_PRODUCT_CODE;
          this.getTemplateById(response.responseData.TEMPLATE_ID);
        }
      });
    }

    getTemplateById(templateID) {
      this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_SI);
      this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_SI).subscribe(apiMappingModel => {
      this.transactionDetailService.fetchTransactionDetails(templateID, FccGlobalConstant.PRODUCT_SI, 
      true, this.templateIDSubProdCode).subscribe(responseData => {
        const responseObj = responseData.body;
        const setStateForProduct = {
          responseObject: responseObj,
          apiModel: apiMappingModel,
          isMaster: false,
          fieldsList: this.fieldsArray,
          sectionsList: this.sectionsArray
        };
        this.commonService.productState.next(setStateForProduct);
        this.form = this.stateService.getSectionData(this.sectionName);
        this.form.get(FccGlobalConstant.SUB_PRODUCT_CODE).setValue('');
        this.form.get(FccGlobalConstant.SUB_PRODUCT_CODE).updateValueAndValidity();
        this.handleTemplateFields(templateID);
        this.onClickProvisionalLCToggle();
        this.setBackToBackPreviewScreenValSI();
        this.handleApplicableRules();
      });
    });
    }

    handleApplicableRules() {
      if(this.isApplicableRulesMandatory === true) {
        this.setMandatoryFields(this.form, [FccGlobalConstant.APPLICABLE_RULES_OPTIONS], true);
      } else {
        this.setMandatoryFields(this.form, [FccGlobalConstant.APPLICABLE_RULES_OPTIONS], false);
        this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS).setErrors(null);
        this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS).clearValidators();
      }
      this.form.updateValueAndValidity();
    }

    removeUnwantedFieldsForTemplate() {
      if (!this.fieldsArray || this.fieldsArray.length === 0) {
        this.form.get('customerReference').setValue('');
        this.form.get('expiryDate').setValue('');
      }
      this.setBackToBackPreviewScreenValSI();
      if (this.commonService.isNonEmptyField(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE, this.form)){
        this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form)){
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
    }

    onClickRemoveLabelTemplate() {
      this.templateSIKey = FccGlobalConstant.TEMPLATEFROM_KEY;
      this.onClickRemoveLabel();
    }

    resetRemoveLabelTemplate() {
      if (this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form)){
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE, this.form)){
        this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_SELECTION, this.form)){
        this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_TEMPLATE, this.form)){
        this.form.get(FccGlobalConstant.FETCHED_TEMPLATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)){
        this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_BANK_TEMPLATE, this.form)){
        this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.form.get('fetchedTemplate').setValue('');
      this.form.get('fetchedBankTemplate').setValue('');
      this.form.get('viewSpecimenHyperLink')[this.params][this.rendered] = false;
      this.commonService.siBankDetailResponseObj = undefined;
      this.form.get(FccGlobalConstant.STANDBY_LC_TYPE).setErrors(null);
      this.form.get(FccGlobalConstant.STANDBY_LC_TYPE).clearValidators();
      this.form.get('standbyLCTypeOptions').setValue('');
      this.form.get('standbyLCTypeOptions')[this.params][this.disabled] = false;
      const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      const val1 = this.form.get(FccGlobalConstant.REQUEST_OPTION_LC)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      this.toggleCreateFormButtons(val, val1, false);
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
      this.templateResponse.unsubscribe();
      this.productStateService.clearState();
      this.formModelService.getFormModel(FccGlobalConstant.PRODUCT_SI).subscribe(modelJson => {
        this.productStateService.initializeProductModel(modelJson);
        this.productStateService.initializeState(FccGlobalConstant.PRODUCT_SI);
        this.productStateService.populateAllEmptySectionsInState();
      });
      this.initializeFormGroup();
    }
    setBackToBackPreviewScreenValSI() {
      const PreviewToggleControls = [FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE];
      if (this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE) &&
      this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE).value === 'Y') {
        this.togglePreviewScreen(this.form, PreviewToggleControls, true);
      } else {
        this.togglePreviewScreen(this.form, PreviewToggleControls, false);
      }
      this.form.get(FccGlobalConstant.BACK_TO_BACK_SI_TOGGLE).updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
    onClickProvisionalLCToggle() {
      const provisionalTogglevalue = this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE).value;
      const provisionalControl = [FccGlobalConstant.PROVISIONAL_TOGGLE];
      if (provisionalTogglevalue === FccBusinessConstantsService.YES) {
        this.togglePreviewScreen(this.form, provisionalControl, true);
      } else {
        this.togglePreviewScreen(this.form, provisionalControl, false);
      }
      this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE).updateValueAndValidity();
      this.form.updateValueAndValidity();
  }

    ngAfterViewInit(){
      if (!this.siBankTemplateFlag && this.commonService.isNonEmptyValue(this.siBankTemplateFlag) &&
       this.myDivElementRef && this.myDivElementRef.length > FccGlobalConstant.ZERO && this.myDivElementRef.toArray()[2]) {
        this.myDivElementRef.toArray()[2].nativeElement.querySelector('#mat-button-toggle-9').style.display = 'none';
      }
      if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
        this.refreshFormElements();
      }
    }

    handleControlComponentsData(event: any) {
      if (!this.siBankTemplateFlag && this.commonService.isNonEmptyValue(this.siBankTemplateFlag) &&
       event.get('createFromOptions').has('myDivElementRef') &&
       event.get('createFromOptions').get('myDivElementRef').toArray().length > FccGlobalConstant.ZERO &&
       event.get('createFromOptions').get('myDivElementRef').toArray()[0]) {
        event.get('createFromOptions').get('myDivElementRef').toArray()[0].nativeElement
        .querySelector('#mat-button-toggle-9').style.display = 'none';
      }
    }

    purchaseOrderFieldRender(){
      if (this.purchaseOrderEnable && this.commonService.getUserPermissionFlag('si_display_po_reference')) {
        this.form.get('purchaseOrderReference')[this.params][this.rendered] = true;
      }
    }
}
