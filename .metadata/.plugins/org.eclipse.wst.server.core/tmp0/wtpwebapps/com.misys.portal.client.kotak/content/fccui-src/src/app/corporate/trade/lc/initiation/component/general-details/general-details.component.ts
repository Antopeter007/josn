/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { compareNewAmountToOld } from '../../validator/ValidateLastShipDate';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FccGlobalConstant } from '../../../../../../../app/common/core/fcc-global-constants';
import {
  ConfirmationDialogComponent
} from '../../../../../../../app/corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { ProductMappingService } from '../../../../../../common/services/productMapping.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { TabPanelService } from '../../../../../../common/services/tab-panel.service';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../common/services/product-state.service';

import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { LcReturnService } from '../../services/lc-return.service';
import { UtilityService } from '../../services/utility.service';
import { compareExpiryDateToCurrentDate, expiryDateLessThanCurrentDate } from '../../validator/ValidateDates';
import {
  compareExpDateWithLastShipmentDate, compareNewExpiryDateToOld
} from '../../validator/ValidateLastShipDate';
import { FCCFormControl, FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { CommonService } from './../../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { LcTemplateService } from './../../../../../../common/services/lc-template.service';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { LcConstant } from './../../../common/model/constant';
import { ImportLetterOfCreditResponse } from './../../model/importLetterOfCreditResponse';
import { NarrativeService } from './../../services/narrative.service';
import { PrevNextService } from './../../services/prev-next.service';
import { LcProductComponent } from './../lc-product/lc-product.component';
import { FormatAmdNoService } from '../../../../../../common/services/format-amd-no.service';
import { CodeData } from '../../../../../../common/model/codeData';
import { CodeDataService } from '../../../../../../common/services/code-data.service';
import { LcProductService } from '../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { PhrasesService } from './../../../../../../../app/common/services/phrases.service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { CorporateCommonService } from './../../../../../../../app/corporate/common/services/common.service';
import { FccGlobalConstantService } from './../../../../../../../app/common/core/fcc-global-constant.service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { emptyCurrency } from '../../validator/ValidateAmt';
import { CurrencyRequest } from '../../../../../../common/model/currency-request';
import { SessionValidateService } from '../../../../../../common/services/session-validate-service';
@Component({
  selector: 'app-general-details',
  templateUrl: './general-details.component.html',
  styleUrls: ['./general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: GeneralDetailsComponent }]
})
export class GeneralDetailsComponent extends LcProductComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Output() messageToEmit = new EventEmitter<string>();
  lcConstant = new LcConstant();
  form: FCCFormGroup;
  applicantForm: FCCFormGroup;
  bankForm: FCCFormGroup;
  curRequest: CurrencyRequest = new CurrencyRequest();
  form1: FCCFormGroup;
  module = `${this.translateService.instant('generalDetails')}`;
  contextPath: any;
  checked = true;
  progressivebar: number;
  amd: string;
  btndisable;
  lcResponse;
  templateResponse;
  backToBackResponse;
  params = this.lcConstant.params;
  options = this.lcConstant.options;
  disabled = this.lcConstant.disabled;
  styleClass = this.lcConstant.styleClass;
  parentStyleClass = this.lcConstant.parentStyleClass;
  defaultValue = this.lcConstant.defaultValue;
  readonly = this.lcConstant.readonly;
  tnxTypeCode: any;
  tnxStatCode: any;
  checker = true;
  checkIcons = this.lcConstant.tickIcon;
  selectedRefId: string;
  key = FccGlobalConstant.KEY;
  sectionHeader = FccGlobalConstant.SECTION_HEADER;
  // getLcmode;
  blankCheckIcons = this.lcConstant.blankCheckIcons;
  rendered = this.lcConstant.rendered;
  custRefRegex;
  custRefLength;
  length16 = FccGlobalConstant.LENGTH_16;
  length35 = FccGlobalConstant.LENGTH_35;
  MARGIN_STYLE = 'margin-side';
  allLcRecords = new ImportLetterOfCreditResponse();
  formMode;
  applicableRules = [];
  enquiryRegex;
  optionChecked = 'checked';
  expiryDateBackToBack: any;
  option;
  sectionName = 'generalDetails';
  previewScreen = 'previewScreen';
  currency = [];
  mode;
  templteId;
  refId;
  language = localStorage.getItem('language');
  transmissionMode: any;
  isMasterRequired: any;
  expiryDateField = 'expiryDate';
  warning = 'warning';
  confirmationPartymessage = 'confirmationPartymessage';
  enteredCharCount = 'enteredCharCount';
  templateKey: string;
  backtobackKey: string;
  currentDate = new Date();
  isPreview: boolean;
  productCode: any;
  subProductCode: any;
  codeData = new CodeData();
  eventDataArray: any;
  codeID: any;
  parentRefId: string;
  prevCreateFrom;
  lcLcstdUploadFlag;
  currentCreateForm;
  chipResponse: Subscription;
  purchaseOrderEnable: any;
  amdNoVal: any;
  swiftXCharSet: any;
  templateIDSubProdCode: any;
  isApplicableRulesMandatory: boolean;
  excludedFieldsNdSections: any;
  copyFromProductCode = '';
  excludingJsonFileKey = '';
  fieldsArray = [];
  sectionsArray = [];
  fieldNames = [];
  provisionalLCToggleValue: string;
  taskSubscription : Subscription;

  corporateBanks: any[];
  corporateReferences: any[];
  nameOrAbbvName: string;
  syBeneAdd: boolean;
  iso: any;
  val: any;
  enteredCurMethod: boolean;
  flagDecimalPlaces: number;
  amountDetailsForm: FCCFormGroup;
  isoamt: any;
  actualSteps: any[];
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;
  RenderProvisional: boolean;
  sitype: Set<string> = new Set<string>();
  provisionalBankList: Set<string> = new Set<string>();
  provisionalBankArr = [];
  provisionalBankMap: Map<string, any> = new Map();
  singleBank: boolean;
  swiftZCharSet: any;
  isAnyProvBankAvl: boolean;
  provRender: boolean;
  templPrevValue: any;
  uploadswiftRegexFields = ['applicantName', 'applicantFirstAddress', 'applicantSecondAddress', 'applicantThirdAddress'];
  regexType: string;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService,
              protected multiBankService: MultiBankService,
              protected dropDownAPIservice: DropDownAPIService,
              protected sessionValidation: SessionValidateService,
              protected taskService: FccTaskService,
              protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected lcReturnService: LcReturnService, protected prevNextService: PrevNextService,
              protected utilityService: UtilityService, protected searchLayoutService: SearchLayoutService,
              protected lcTemplateService: LcTemplateService, protected formModelService: FormModelService,
              protected stateService: ProductStateService, protected route: ActivatedRoute,
              protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
              protected tabservice: TabPanelService, protected fccTaskService: FccTaskService,
              protected datePipe: DatePipe, protected dialogService: DialogService,
              protected phrasesService: PhrasesService,
              protected narrativeService: NarrativeService, protected productMappingService: ProductMappingService,
              protected amendCommonService: AmendCommonService, protected resolverService: ResolverService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected formatAmdNoService: FormatAmdNoService,
              protected codeDataService: CodeDataService, protected lcProductService: LcProductService
              ) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
  }
  ngOnInit() {
    super.ngOnInit();
    window.scroll(0, 0);
    this.isMasterRequired = this.isMasterRequired;
    // this.intializeRules();
    // place holder to pass amendment design. This has to remove once integrated
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.tnxStatCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.eventTnxStatCode);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.templteId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TEMPLATE_ID);
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.operation = this.commonService.getQueryParametersFromKey (FccGlobalConstant.OPERATION);
    this.productCode = this.commonService.getQueryParametersFromKey (FccGlobalConstant.PRODUCT);
    this.lcLcstdUploadFlag = this.commonService.getUserPermissionFlag(FccGlobalConstant.LC_LCSTD_UPLOAD);
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftXCharSet = response.swiftXCharacterSet;
        this.isApplicableRulesMandatory = response.isApplicableRulesMandatory;
      }
    });
    this.initializeFormGroup();
    if ((this.mode === FccGlobalConstant.DRAFT_OPTION || this.mode === FccGlobalConstant.INITIATE)
     && this.tnxTypeCode === FccGlobalConstant.N002_NEW
     && (this.form.get('requestOptionsLC').value === FccGlobalConstant.CODE_02
     || this.form.get('requestOptionsLC').value === FccGlobalConstant.CODE_04)) {
        this.form.get('createFromOptions').setValue('upload');
        this.form.get('createFromOptions').updateValueAndValidity();
        this.prevCreateFrom = 'upload';
    }
    if (this.mode === FccGlobalConstant.INITIATE && this.commonService.referenceId) {
      if(this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)){
        this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.disabled] = true;
      }
      if (this.form.get('createFromOptions') && this.form.get('createFromOptions')[FccGlobalConstant.OPTIONS]
        && this.form.get('createFromOptions')[FccGlobalConstant.OPTIONS].length > 0) {
        this.form.get('createFromOptions')[FccGlobalConstant.OPTIONS].forEach(opt => {
          opt.disabled = true;
          opt.crossIcon = false;
        });
        this.form.get('createFromOptions')[this.params].crossIcon = '';
      }
    }
    if (this.commonService.isnonEMptyString(this.form.get('transmissionMode').value)){
      this.transmissionMode = this.form.get('transmissionMode').value;
    } else {
      this.form.get('transmissionMode').setValue(FccBusinessConstantsService.SWIFT);
      this.transmissionMode = this.form.get('transmissionMode').value;
    }
    this.commonService.isTransmissionModeChanged(this.form.get('transmissionMode').value);
    this.isPreview = this.mode === FccGlobalConstant.INITIATE || this.mode === FccGlobalConstant.DRAFT_OPTION ||
    this.mode === FccGlobalConstant.EXISTING;
    this.commonService.loadDefaultConfiguration().subscribe(response => {

      if (response) {
        this.custRefRegex = response.customerReferenceTradeRegex;
        this.custRefLength = response.customerReferenceTradeLength;
        this.purchaseOrderEnable = response.purchaseOrderReference;
        this.enquiryRegex = response.swiftXCharacterSet;
        this.swiftZCharSet = response.swiftZChar;
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
        this.form.get('placeOfExpiry').clearValidators();
        this.form.get('otherApplicableRules').clearValidators();
        this.form.get('customerReference').clearValidators();
        this.form.get('beneficiaryReference').clearValidators();
        this.form.get('purchaseOrderReference').clearValidators();
        this.transmissionMode = this.form.get('transmissionMode').value;
        if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
          this.transmissionMode[0] && this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators('placeOfExpiry', Validators.pattern(this.enquiryRegex), 0);
          this.form.addFCCValidators('otherApplicableRules', Validators.pattern(this.enquiryRegex), 0);
          this.form.addFCCValidators('placeOfExpiry', Validators.pattern(this.enquiryRegex), 0);
          this.form.addFCCValidators('purchaseOrderReference',Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_2000), 
            Validators.pattern(this.swiftZCharSet)]), 0);
          this.form.get('placeOfExpiry').updateValueAndValidity();
          this.form.get('otherApplicableRules').updateValueAndValidity();
          this.form.get('purchaseOrderReference').updateValueAndValidity();
        }
        this.form.addFCCValidators('customerReference', Validators.maxLength(this.custRefLength), 0);
        this.form.addFCCValidators('beneficiaryReference', Validators.maxLength(this.custRefLength), 0);
        this.form.addFCCValidators('purchaseOrderReference',
          Validators.maxLength(FccGlobalConstant.LENGTH_2000), 0);
        this.form.addFCCValidators('otherApplicableRules', Validators.maxLength(FccGlobalConstant.LENGTH_35), 0);
        this.purchaseOrderFieldRender();
      }
    });
    if (!this.lcLcstdUploadFlag) {
      const requestList = this.form.get('createFromOptions')[this.params][this.options];
      requestList.splice(2, requestList.length);
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION &&
      (this.form.get('requestOptionsLC').value === '02' || this.form.get('requestOptionsLC').value === FccGlobalConstant.CODE_04)) {
      this.amountDetailsForm = this.stateService.getSectionData(FccGlobalConstant.AMOUNT_CHARGE_DETAILS);
      this.amountDetailsForm.get('editFreeFormatFlag')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      if (this.form.get('requestOptionsLC').value === FccGlobalConstant.CODE_02) {
        this.onSelectingFreeFormat();
      } else {
        this.onClickUploadAction();
      }
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params].layoutClass = 'p-col-12 p-md-12 p-lg-12 p-sm-12 ';
      this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params].layoutClass = 'p-col-12 p-md-12 p-lg-12 p-sm-12 ';
      this.form.get('revolving_flag')[this.params].layoutClass = 'p-col-6';
      this.form.get('irv_flag')[this.params].layoutClass = 'p-col-6';
      this.form.get('ntrf_flag')[this.params].layoutClass = 'p-col-6';
    }
    this.patchLayoutForReadOnlyMode();
    this.templateChanges();
    this.onClickApplicableRulesOptions();
    this.editModeDataPopulate();
    this.updateValues();
    this.templPrevValue = this.commonService.isEmptyValue(localStorage.getItem('templPrevValue')) ? this.form.get('templateName').value :
    localStorage.getItem('templPrevValue');
    if (this.commonService.isNonEmptyValue(this.operation) && this.operation !== FccGlobalConstant.LIST_INQUIRY && 
    this.operation !== FccGlobalConstant.PREVIEW){
    this.onClickExpiryDate();
    }
    this.onClickProvisionalLCToggle();
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      this.amendCommonService.compareTransactionAndMasterForAmend(productCode);
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      if (this.transmissionMode && this.transmissionMode[0] && this.transmissionMode[0].value === FccBusinessConstantsService.OTHER_99) {
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT], true);
      this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_MODE], false);
      }
    }

    const perms = [FccGlobalConstant.LC_LCSTD_BACKTOBACK_PERMISSION];
    perms.forEach(perKey => {
      const flag = this.commonService.getUserPermissionFlag(perKey);
      if (!flag) {
        this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.rendered] = false;
      }
    });

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
    this.subscribeChipResponse();
    this.getExcludedFieldsNdSections();
    if (this.mode === FccGlobalConstant.INITIATE && this.form && this.form.get('requestOptionsLC') &&
      (this.form.get('requestOptionsLC').value === '02')) {
        this.hideRenderedColumns();
      }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION ) {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();
      }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, 'advSendModeText', false);
      this.form.setErrors(null);
      this.form.clearValidators();
      this.form.updateValueAndValidity();
    }
  }

  onClickEditFreeFormatFlag() {
    if (this.form.get('editFreeFormatFlag') && this.form.get('editFreeFormatFlag').value === 'Y') {
      this.confirmSwitchForm();
    }
  }

  resetAllValues() {
    if (this.form && this.form.get('requestOptionsLC') && this.form.get('requestOptionsLC').value &&
    this.form.get('requestOptionsLC').value === '04') {
      const hideFields = ['featureofLC', 'irv_flag', 'ntrf_flag', 'backToBackLCToggle',
        'revolving_flag', 'ApplicableRules', 'applicableRulesOptions', 'confirmationInstruction', 'confirmationOptions',
        'beneficiaryReference', 'otherApplicableRules', 'purchaseOrderReference', 'childRef'
      ];
      const shipmentForm = this.stateService.getSectionData(FccGlobalConstant.SHIPMENT_DETAILS);
      const paymentForm = this.stateService.getSectionData(FccGlobalConstant.PAYMENT_DETAILS);
      hideFields.forEach(field => {
        if (field && this.form.get(field)) {
          this.form.get(field).setValue('');
        }
      });
      paymentForm.get('creditAvailableOptions').setValue('');
      paymentForm.get('paymentDraftOptions').setValue('');
      this.stateService.setStateSection(FccGlobalConstant.PAYMENT_DETAILS, paymentForm);
      shipmentForm.get('partialshipmentvalue').setValue('');
      shipmentForm.get('transhipmentvalue').setValue('');
      this.stateService.setStateSection(FccGlobalConstant.SHIPMENT_DETAILS, shipmentForm);
    }
  }

  onSelectingFreeFormat() {
    if (this.form.get('editFreeFormatFlag') && this.form.get('editFreeFormatFlag').value === 'Y') {
      this.form.get('requestOptionsLC').setValue(FccGlobalConstant.CODE_02);
      this.leftSectionService.addDynamicSection([{ sectionName: FccGlobalConstant.APPLICANT_BENEFICIARY },
      { sectionName: FccGlobalConstant.BANK_DETAILS }, { sectionName: FccGlobalConstant.AMOUNT_CHARGE_DETAILS },
      { sectionName: FccGlobalConstant.PAYMENT_DETAILS }, { sectionName: FccGlobalConstant.SHIPMENT_DETAILS },
      { sectionName: FccGlobalConstant.NARRATIVE_DETAILS }, { sectionName: FccGlobalConstant.LICENSE_DETAILS },
      { sectionName: FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY }]);
      this.hideRenderedColumns();
    }
    this.taskSubscription = this.fccTaskService.notifyTaskAfterSaveTnx$.subscribe(data => {
      if(data) {
      if (this.form && this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
      }
      if (this.form && this.commonService.isNonEmptyField('removeLabel', this.form)) {
          this.form.get('removeLabel')[this.params][this.rendered] = false;
          }
      }
      });
  }

  swiftValidationCheck() {
    if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
          this.uploadswiftRegexFields.forEach(ele => {
            this.form.get(ele).clearValidators();
            if(this.form.get(ele)[FccGlobalConstant.PARAMS] && this.form.get(ele)[FccGlobalConstant.PARAMS]['applicableValidation']
            && this.form.get(ele)[FccGlobalConstant.PARAMS]['applicableValidation'][0] &&
            this.form.get(ele)[FccGlobalConstant.PARAMS]['applicableValidation'][0]['characterValidation']) {
              this.regexType = this.form.get(ele)[FccGlobalConstant.PARAMS]['applicableValidation'][0]['characterValidation'];
            if (this.regexType === FccGlobalConstant.SWIFT_X) {
              this.regexType = this.swiftXCharSet;
            } else if (this.regexType === FccGlobalConstant.SWIFT_Z) {
              this.regexType = this.swiftZCharSet;
            }
            if (this.commonService.validateProduct(this.form, ele, 
              this.commonService.getQueryParametersFromKey (FccGlobalConstant.PRODUCT))) {
              this.form.addFCCValidators(ele, Validators.pattern(this.regexType), 0);
              }
            }
          });

        }
        this.form.updateValueAndValidity();
  }

  setAmendmentNumbers(){
    const amdReqNo = this.stateService.getSectionData(FccGlobalConstant.eventDetails).get('amendmentReqNo');
    const amendmentNo = this.stateService.getSectionData(FccGlobalConstant.eventDetails).get('amendmentNo');
    if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
      ( this.commonService?.currentStateTnxResponse !== undefined
      && this.commonService?.currentStateTnxResponse?.prod_stat_code === FccGlobalConstant.N005_AMENDED)
      && amendmentNo !== null)) {
      const amdReqNoValue = (amdReqNo && amdReqNo.value) ? amdReqNo.value: '';
      const amdNoAvl = (amendmentNo && amendmentNo.value) ? true :false;
      if (amdNoAvl) {
        amendmentNo[this.params][this.rendered] = true;
        this.amdNoVal = amendmentNo.value;
      }
      if ((this.tnxStatCode === FccGlobalConstant.N004_UNCONTROLLED || this.tnxStatCode === FccGlobalConstant.N004_INCOMPLETE ||
        ( this.commonService?.currentStateTnxResponse !== undefined
        && this.commonService?.currentStateTnxResponse?.tnx_stat_code === FccGlobalConstant.N004_UNCONTROLLED))
        && (amdReqNoValue === null || amdReqNoValue === undefined || amdReqNoValue === '')){
          amdReqNo.setValue(FccGlobalConstant.AMD_REQ_NOT_GENERATED);
          amendmentNo[this.params][this.rendered] = false;
          amdReqNo[this.params][this.rendered] = true;
      } else if((this.commonService?.currentStateTnxResponse !== undefined
          && this.commonService?.currentStateTnxResponse?.prod_stat_code === FccGlobalConstant.N005_REJECTED)
          || (amdReqNoValue && !amdNoAvl)){
        amdReqNo.setValue(this.formatAmdNoService.formatAmdNo(amdReqNoValue));
        amendmentNo[this.params][this.rendered] = false;
        amdReqNo[this.params][this.rendered] = true;
      } else {
        if(amdNoAvl && ( this.commonService?.currentStateTnxResponse !== undefined
          && this.commonService?.currentStateTnxResponse?.tnx_stat_code === FccGlobalConstant.N004_ACKNOWLEDGED)){
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
    const productCode = FccGlobalConstant.PRODUCT_LC;
    const subProductCode = FccGlobalConstant.LCSTD;
    this.transactionDetailService.getExcludedFieldsNdSections(productCode, subProductCode).subscribe(
      (response) => {
          this.excludedFieldsNdSections = response.body;
        }, (error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      );
    }

  displayFieldsOnUpload() {
    const displayFields = [FccGlobalConstant.APPLICANT_ADDRESS_1,
    FccGlobalConstant.APPLICANT_ENTITY, FccGlobalConstant.APPLICANT_NAME,
    FccGlobalConstant.APPLICANT_ADDRESS_2, FccGlobalConstant.APPLICANT_ADDRESS_3,
    FccGlobalConstant.BENEFICIARY_ENTITY, FccGlobalConstant.BANK_NAME_LIST, FccGlobalConstant.ISSUER_REF_LIST,
    FccGlobalConstant.CURRENCY, FccGlobalConstant.AMOUNT_FIELD,
      'issuerReferenceHeader', 'bankNameHeader', 'lcheader', 'applicantHeader', 'editFreeFormatFlag'];
    displayFields.forEach(field => {
      if (this.form.get(field)) {
        this.form.get(field)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(field).clearValidators();
        this.form.get(field).markAsTouched();
        this.form.get(field).updateValueAndValidity();
      }
    });
    this.swiftValidationCheck();
  }

  handleResponse(data) {
    if (data.action === 'cancelled') {
      this.form.get(data.controlName).setValue(data.previousValue);
      this.form.get(data.controlName).updateValueAndValidity();
      if (data.previousValue === 'upload') {
        this.onClickUploadAction();
        this.displayFieldsOnUpload();
      }
    } else if (data.action === 'deselect') {
      this.unSelectButton(true, 'createFromOptions', data.presentValue, this.prevCreateFrom);
      if (data.presentValue === 'upload') {
        this.leftSectionService.addDynamicSection([{ sectionName: FccGlobalConstant.APPLICANT_BENEFICIARY },
        { sectionName: FccGlobalConstant.BANK_DETAILS }, { sectionName: FccGlobalConstant.AMOUNT_CHARGE_DETAILS },
        { sectionName: FccGlobalConstant.PAYMENT_DETAILS }, { sectionName: FccGlobalConstant.SHIPMENT_DETAILS },
        { sectionName: FccGlobalConstant.NARRATIVE_DETAILS }, { sectionName: FccGlobalConstant.LICENSE_DETAILS },
        { sectionName: FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY }]);
        this.hideRenderedColumns();
      }
    }
    this.updateRequestLCType();
    this.prevCreateFrom = this.form.get(data.controlName).value;
  }
  updateValues() {
    this.onClickConfirmationOptions();
  }

  onClickConfirmationOptions() {
    this.toggleValue(this.form.get('confirmationOptions').value, 'confirmationOptions');
  }

  toggleValue(value, feildValue) {
    if (value === FccGlobalConstant.CONFIRMATION_OPTION_CONFIRM || value === FccGlobalConstant.CONFIRMATION_OPTION_MAY_ADD) {
      this.form.get(feildValue)[this.params][this.warning] = `${this.translateService.instant(this.confirmationPartymessage)}`;
    } else {
      this.form.get(feildValue)[this.params][this.warning] = FccGlobalConstant.EMPTY_STRING;
    }
  }

  editModeDataPopulate() {
    const parentRefID = this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).value;
    const subTnxTypeCode = this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE).value;
    const templateName = this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_NAME, this.form) ?
      this.form.get(FccGlobalConstant.TEMPLATE_NAME).value : undefined;
    if (this.mode === 'DRAFT' && this.commonService.isNonEmptyValue(parentRefID)) {
      if (subTnxTypeCode === '06') {
        const mode = 'EDIT';
        this.initializeFormToLCDetailsResponse(parentRefID, mode);
      }
      else if (subTnxTypeCode !== '06' && this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
        this.form.get('createFrom')[this.params][this.rendered] = false;
        this.form.get('createFromOptions')[this.params][this.rendered] = false;
        this.form.get('referenceSelected')[this.params][this.rendered] = false;
        this.form.get('fetchedRefValue')[this.params][this.rendered] = false;
        this.form.get('removeLabel')[this.params][this.rendered] = false;
        this.form.get('fetchedRefValue').patchValue(parentRefID);
        this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).patchValue(parentRefID);
        this.patchFieldParameters(this.form.get('fetchedRefValue'), { readonly: true });
        this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.disabled] = true;
        this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.previewScreen] = false;
        this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.rendered] = false;
        this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.previewScreen] = false;
        const val = this.form.get('createFromOptions')[this.params][this.options];
        const val1 = this.form.get('requestOptionsLC')[this.params][this.options];
      } else if ((this.mode === 'DRAFT' && this.option !== FccGlobalConstant.TEMPLATE) && this.commonService.isNonEmptyValue(templateName)
        && this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_TEMPLATE, this.form)) {
        this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(templateName);
        this.handleTemplateFields(templateName);
        if (this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)) {
          this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
        }
      }
    }
  }

handleTemplateFields(templateID) {
  this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.EXISTING_TEMPLATE);
  this.form.get('requestOptionsLC')[this.params][this.rendered] = false;
  this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
  this.form.get(FccGlobalConstant.CREATE_FROM)[this.params][this.rendered] = false;
  this.form.get('templateSelection')[this.params][this.rendered] = true;
  this.form.get('fetchedTemplate')[this.params][this.rendered] = true;
  this.form.get('removeLabelTemplate')[this.params][this.rendered] = true;
  const element = document.createElement('div');
  element.innerHTML = templateID;
  templateID = element.textContent;
  this.form.get('fetchedTemplate').patchValue(templateID);
  this.onClickProvisionalLCToggle();
  this.patchFieldParameters(this.form.get('fetchedTemplate'), { readonly: true });
}
  ngAfterViewChecked() {
    this.resetCreatForm();
    // if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    //   this.refreshFormElements();
    // }
    if (this.mode === FccGlobalConstant.INITIATE && this.form && this.form.get('requestOptionsLC') &&
      (this.form.get('requestOptionsLC').value === '02')) {
        this.hideRenderedColumns();
      }

      if(this.form.get(this.expiryDateField)['params']?.required){
        this.validateExpiryDate();
      }
  }

  ngAfterViewInit() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
     this.refreshFormElements();
   }
 }

  getCurrencyDetail() {
    if (this.form.get('currency')[FccGlobalConstant.OPTIONS] && this.form.get('currency')[FccGlobalConstant.OPTIONS].length === 0) {
      this.commonService.userCurrencies(this.curRequest).subscribe(
        response => {
          if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
            this.sessionValidation.IsSessionValid();
          } else {
            response.items.forEach(
              value => {
                const ccy: { label: string, value: any } = {
                  label: value.isoCode,
                  value: {
                    label: value.isoCode,
                    iso: `${value.isoCode} - ${this.commonService.toTitleCase(value.name)}`,
                    country: value.principalCountryCode,
                    currencyCode: value.isoCode,
                    shortName: value.isoCode,
                    name: value.name
                  }
                };
                this.currency.push(ccy);
              });
            this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
          }
          if (this.form.get('currency').value !== FccGlobalConstant.EMPTY_STRING) {
            const valObj = this.dropDownAPIservice.getDropDownFilterValueObj(this.currency, 'currency', this.form);
            if (valObj) {
              this.form.get('currency').patchValue(valObj[`value`]);
            }
          }
        });
    }
  }

  onKeyupAmount() {
    const amt = this.form.get(FccGlobalConstant.AMOUNT_FIELD);
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
  }

  onBlurAmount() {
    this.removeValidators(this.form, [FccGlobalConstant.AMOUNT_FIELD]);
    this.setAmountLengthValidator('amount');
    const amt = this.form.get('amount');
    this.iso = this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value) &&
      this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode) ?
      this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode : null;
      if(this.nonNumericCurrencyValidator){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
    if (this.commonService.getAmountForBackToBack() && parseInt(this.commonService.replaceCurrency(amt.value), 10) >
      parseInt(this.commonService.replaceCurrency(this.commonService.getAmountForBackToBack()), 10)) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([compareNewAmountToOld]);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
    } else if (this.commonService.getAmountForBackToBack()) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
    }
    this.val = amt.value;
    if (this.val === null || this.val === undefined || this.val === '') {
      this.form.get('amount').setErrors({ amountNotNull: true });
      return;
    }
    if (this.val <= 0) {
      this.form.get('amount').setErrors({ amountCanNotBeZero: true });
      return;
    }
    if (this.val !== '') {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get('amount').setValidators(emptyCurrency);
      }
      if (this.iso !== '' && this.commonService.isNonEmptyValue(this.iso)) {
        let valueupdated = this.commonService.replaceCurrency(this.val);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
        this.form.get('amount').setValue(valueupdated);
      }
    }
    this.form.get('amount').updateValueAndValidity();
  }

  templateChanges() {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.form.get('templateName')[this.params][this.rendered] = true;
      this.form.get('templateName')[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.addFCCValidators(FccGlobalConstant.TEMPLATE_NAME,
        Validators.compose([Validators.pattern(FccGlobalConstant.TEMPLATE_NAME_VALIDATION)]), 0);
      this.form.get('provisionalLCToggle')[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.rendered] = false;
      this.form.get('templateDescription')[this.params][this.rendered] = true;
      this.form.get('requestTypeLC')[this.params][this.rendered] = false;
      this.form.get('requestOptionsLC')[this.params][this.rendered] = false;
      this.form.get('createFrom')[this.params][this.rendered] = false;
      this.form.get('createFromOptions')[this.params][this.rendered] = false;
      this.patchFieldParameters(this.form.get('applicableRulesOptions'), { autoDisplayFirst : false });
      if (this.mode !== FccGlobalConstant.DRAFT_OPTION && !this.form.get('templateName').value) {
        this.commonService.generateTemplateName(FccGlobalConstant.PRODUCT_LC).subscribe( res => {
          const jsonContent = res.body as string[];
          const templateName = jsonContent[`templateName`];
          this.form.get('templateName').setValue(templateName.trim());
          this.commonService.putQueryParameters('templateName', this.form.get('templateName').value);
        });
      }
      this.commonService.putQueryParameters('templateName', this.form.get('templateName').value);
      this.setMandatoryField(this.form, 'applicableRulesOptions', false);
      this.setMandatoryField(this.form, 'placeOfExpiry', false);
      if ( this.templteId !== undefined && this.templteId !== null && this.mode === FccGlobalConstant.DRAFT_OPTION) {
          this.form.get('templateName')[this.params][this.readonly] = false;
      }
    }
  }

  patchLayoutForReadOnlyMode() {
    if (this.form.getFormMode() === 'view') {

      const controls = Object.keys(this.form.controls);
      let index: any;
      for (index = 0; index < controls.length; index++) {
        this.viewModeChange(this.form, controls[index]);
      }
    }
  }

  ngOnDestroy() {
    if (this.form !== undefined) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
      if ((this.mode === FccGlobalConstant.INITIATE && this.commonService.referenceId) && 
      this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)) {
      this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.disabled] = true;
      }
      this.form.get('removeLabelTemplate')[this.params][this.rendered] = false;
    }
    localStorage.setItem('templPrevValue', this.templPrevValue);
    if (this.form && this.form.get('requestOptionsLC') && this.form.get('requestOptionsLC').value &&
      this.form.get('requestOptionsLC').value === '04') {
      this.resetAllValues();
    }
    this.stateService.setStateSection(FccGlobalConstant.GENERAL_DETAILS, this.form, this.isMasterRequired);
    this.stateService.setStateSection(FccGlobalConstant.NARRATIVE_DETAILS, this.form1);
    if (this.applicantForm && (this.form.get('requestOptionsLC').value &&
      (this.form.get('requestOptionsLC').value === '02' || this.form.get('requestOptionsLC').value === '04'))) {
      this.applicantForm.get('applicantEntity').setValue(this.form.get('applicantEntity').value);
      this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_1)
        .setValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).value);
      this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_2)
        .setValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).value);
      this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_3)
        .setValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).value);
      this.applicantForm.get('applicantName').setValue(this.form.get('applicantName').value);
      this.applicantForm.get('applicantName')[this.params][this.rendered] = true;
      this.stateService.setStateSection(FccGlobalConstant.APPLICANT_BENEFICIARY, this.applicantForm);
      this.bankForm.controls.issuingBank.get(FccGlobalConstant.ISSUER_REF_LIST)
        .setValue(this.form.get(FccGlobalConstant.ISSUER_REF_LIST).value);
      this.bankForm.controls.issuingBank.get(FccGlobalConstant.BANK_NAME_LIST)
        .setValue(this.form.get(FccGlobalConstant.BANK_NAME_LIST).value);
      this.stateService.setStateSection(FccGlobalConstant.BANK_DETAILS, this.bankForm);
      this.amountDetailsForm.get('amount')[this.params][this.rendered] = true;
      this.amountDetailsForm.get('currency')[this.params][this.rendered] = true;
      this.amountDetailsForm.get('editFreeFormatFlag')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.bankForm.controls.issuingBank.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.rendered] = true;
      this.bankForm.controls.issuingBank.get(FccGlobalConstant.BANK_NAME_LIST)[this.params][this.rendered] = true;
      this.bankForm.controls.issuingBank.get('bankNameHeader')[this.params][this.rendered] = true;
      this.bankForm.controls.issuingBank.get('issuerReferenceHeader')[this.params][this.rendered] = true;
      this.amountDetailsForm.get('amount').setValue(this.form.get('amount').value);
      this.amountDetailsForm.get('currency').setValue(this.form.get('currency').value);
      this.amountDetailsForm.get(FccGlobalConstant.AMOUNT_FIELD)[FccGlobalConstant.PARAMS].layoutClass =
      'p-col-5 p-md-5 p-lg-5 p-sm-12 leftwrapper';
      this.amountDetailsForm.get(FccGlobalConstant.CURRENCY)[FccGlobalConstant.PARAMS].layoutClass =
      'p-col-5 p-md-5 p-lg-5 p-sm-12 leftwrapper chargeAmt';
      if (this.form.get('requestOptionsLC').value === '04') {
        this.amountDetailsForm.get('issuingBankCharges').setValue('');
        this.amountDetailsForm.get('outStdCurrency').setValue('');
      }
      this.stateService.setStateSection(FccGlobalConstant.AMOUNT_CHARGE_DETAILS, this.amountDetailsForm);
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
    if (this.chipResponse !== undefined && this.chipResponse !== null) {
      this.chipResponse.unsubscribe();
      this.chipResponse = null;
    }
    this.commonService.actionsDisable = false;
    this.commonService.buttonsDisable = false;
    this.commonService.backTobackExpDateFilter = false;
    if(this.taskSubscription != null && this.taskSubscription != undefined){
      this.taskSubscription.unsubscribe();
     }
  }

  confirmChange()
  {
    const dir = localStorage.getItem('langDir');
    const headerField = `${this.translateService.instant('confirmation')}`;
    const obj = {};
    const locaKey = 'locaKey';
    obj[locaKey] = FccGlobalConstant.CHANGE_UPLOAD;
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      data: obj,
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.prevCreateFrom = this.currentCreateForm;
        this.onFocusYesButton(this.currentCreateForm);
        this.form.get(FccTradeFieldConstants.CREATE_FROM_OPTIONS).setValue(this.currentCreateForm);
      }
      if (result.toLowerCase() === 'no') {
        this.onFocusNoButton();
      }
      this.updateRequestLCType();
    });
    dialogRef.onDestroy.subscribe((result: any) => {
      if (!result) {
        this.onFocusNoButton();
        this.updateRequestLCType();
      }
    });

  }

  confirmSwitchForm()
  {
    const dir = localStorage.getItem('langDir');
    const headerField = `${this.translateService.instant('confirmation')}`;
    const obj = {};
    const locaKey = 'locaKey';
    obj[locaKey] = 'changetoFreeFormat';
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      data: obj,
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.onSelectingFreeFormat();
      }
      if (result.toLowerCase() === 'no') {
        this.form.get('editFreeFormatFlag').setValue('N');
      }
    });
    dialogRef.onDestroy.subscribe((result: any) => {
      if (!result) {
        this.form.get('editFreeFormatFlag').setValue('N');
      }
    });

  }

  onClickCreateFromOptions(data: any) {
    this.subscribeChipResponse();
    // this.subscribeChipResponse();
    let sectionForm: FCCFormGroup;
    let sectionForm2: FCCFormGroup;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
    sectionForm = this.stateService.getSectionData(FccGlobalConstant.PAYMENT_DETAILS);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
    sectionForm2 = this.stateService.getSectionData(FccGlobalConstant.FILE_UPLOAD);
    if (data.value === 'existinglc') {
      if (this.prevCreateFrom === 'upload') {
        this.currentCreateForm = data.value;
        this.confirmChange();
      } else {
        this.onClickExistingLc();
      }
    } else if (data.value === 'template') {
      if (this.prevCreateFrom === 'upload') {
        this.currentCreateForm = data.value;
        this.confirmChange();
      } else {
        this.onClickExistingTemplate();
      }
    } else if (data.value === 'backtoback') {
      this.onClickBackToBackLC();
    } else if (data.value === 'upload') {
      if (this.prevCreateFrom === 'upload') {
        this.chipSelection(data, FccGlobalConstant.DESELECT_UPLOAD);
      }else {
        this.onClickUploadAction();
        this.displayFieldsOnUpload();
      }
      this.updateRequestLCType();
      this.leftSectionService.reEvaluateProgressBar.next(true);
    }
  }
  onClickUploadAction() {
    if (this.leftSectionService && this.leftSectionService.steps && this.leftSectionService.steps.length > 3) {
      // this.actualSteps =  JSON.parse(JSON.stringify(this.leftSectionService.steps));
      // this.leftSectionService.steps.splice(1, 8);
      this.leftSectionService.removeSectionAndShowPreview([{ sectionName: FccGlobalConstant.APPLICANT_BENEFICIARY },
      { sectionName: FccGlobalConstant.BANK_DETAILS }, { sectionName: FccGlobalConstant.AMOUNT_CHARGE_DETAILS },
      { sectionName: FccGlobalConstant.PAYMENT_DETAILS }, { sectionName: FccGlobalConstant.SHIPMENT_DETAILS },
      { sectionName: FccGlobalConstant.NARRATIVE_DETAILS }, { sectionName: FccGlobalConstant.LICENSE_DETAILS },
      { sectionName: FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY }]);
      // this.leftSectionService.steps.splice(1, 8);
    }
    const hiddenFields = ['featureofLC', 'irv_flag', 'ntrf_flag', 'backToBackLCToggle',
      'revolving_flag', 'ApplicableRules', 'applicableRulesOptions', 'confirmationInstruction',
      'confirmationOptions', 'beneficiaryReference', 'otherApplicableRules', 'purchaseOrderReference', 'childRef'];
    hiddenFields.forEach(field => {
      if (this.form.get(field)) {
        this.form.get(field)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(field).clearValidators();
        this.form.get(field).markAsTouched();
        this.form.get(field).updateValueAndValidity();
      }
    });
    if (this.form && this.form.get('requestOptionsLC') && this.form.get('requestOptionsLC').value &&
      this.form.get('requestOptionsLC').value === '04') {
      this.resetAllValues();
    }
    this.applicantForm = this.stateService.getSectionData(FccGlobalConstant.APPLICANT_BENEFICIARY);
    this.bankForm = this.stateService.getSectionData(FccGlobalConstant.BANK_DETAILS, undefined, this.isMasterRequired);
    const bankSectionForm = this.bankForm.controls.issuingBank;
    this.amountDetailsForm = this.stateService.getSectionData(FccGlobalConstant.AMOUNT_CHARGE_DETAILS);
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_1).clearValidators();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_1).markAsTouched();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_1).updateValueAndValidity();
    this.form.addControl('applicantHeader', this.applicantForm.get('applicantHeader'));

    this.applicantForm.get(FccGlobalConstant.APPLICANT_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ENTITY).clearValidators();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ENTITY).markAsTouched();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ENTITY).updateValueAndValidity();
    this.form.addControl(FccGlobalConstant.APPLICANT_ENTITY, this.applicantForm.get(FccGlobalConstant.APPLICANT_ENTITY));

    this.applicantForm.get(FccGlobalConstant.APPLICANT_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.applicantForm.get(FccGlobalConstant.APPLICANT_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.applicantForm.get(FccGlobalConstant.APPLICANT_NAME).clearValidators();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_NAME).markAsTouched();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_NAME).updateValueAndValidity();
    this.form.addControl(FccGlobalConstant.APPLICANT_NAME, this.applicantForm.get(FccGlobalConstant.APPLICANT_NAME));

    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_1).clearValidators();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_1).markAsTouched();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_1).updateValueAndValidity();
    this.form.addControl(FccGlobalConstant.APPLICANT_ADDRESS_1, this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_1));

    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_2).clearValidators();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_2).markAsTouched();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_2).updateValueAndValidity();
    this.form.addControl(FccGlobalConstant.APPLICANT_ADDRESS_2, this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_2));

    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_3).clearValidators();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_3).markAsTouched();
    this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_3).updateValueAndValidity();
    this.form.addControl(FccGlobalConstant.APPLICANT_ADDRESS_3, this.applicantForm.get(FccGlobalConstant.APPLICANT_ADDRESS_3));

    this.applicantForm.get(FccGlobalConstant.BENEFICIARY_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.applicantForm.get(FccGlobalConstant.BENEFICIARY_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.applicantForm.get(FccGlobalConstant.BENEFICIARY_ENTITY).clearValidators();
    this.applicantForm.get(FccGlobalConstant.BENEFICIARY_ENTITY).markAsTouched();
    this.applicantForm.get(FccGlobalConstant.BENEFICIARY_ENTITY).updateValueAndValidity();
    // this.form.addControl(FccGlobalConstant.BENEFICIARY_ENTITY,this.applicantForm.get(FccGlobalConstant.BENEFICIARY_ENTITY));
    this.applicantForm.get(FccGlobalConstant.BENEFICIARY_COUNTRY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.applicantForm.get(FccGlobalConstant.BENEFICIARY_COUNTRY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.applicantForm.get(FccGlobalConstant.BENEFICIARY_COUNTRY).clearValidators();
    this.applicantForm.get(FccGlobalConstant.BENEFICIARY_COUNTRY).markAsTouched();
    this.applicantForm.get(FccGlobalConstant.BENEFICIARY_COUNTRY).updateValueAndValidity();
    /* start bank Name header*/
    this.form.addControl('bankNameHeader', bankSectionForm.get('bankNameHeader'));
    /* ends */

    /* start bank Name list*/
    bankSectionForm.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    bankSectionForm.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    bankSectionForm.get(FccGlobalConstant.BANK_NAME_LIST).clearValidators();
    bankSectionForm.get(FccGlobalConstant.BANK_NAME_LIST).markAsTouched();
    bankSectionForm.get(FccGlobalConstant.BANK_NAME_LIST).updateValueAndValidity();
    this.form.addControl(FccGlobalConstant.BANK_NAME_LIST, bankSectionForm.get(FccGlobalConstant.BANK_NAME_LIST));
    /* ends */

    /* start issue reference header */
    this.form.addControl('issuerReferenceHeader', bankSectionForm.get('issuerReferenceHeader'));
    /* ends */

    /* start issue reference list */
    bankSectionForm.get(FccGlobalConstant.ISSUER_REF_LIST)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    bankSectionForm.get(FccGlobalConstant.ISSUER_REF_LIST)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    bankSectionForm.get(FccGlobalConstant.ISSUER_REF_LIST).clearValidators();
    bankSectionForm.get(FccGlobalConstant.ISSUER_REF_LIST).markAsTouched();
    bankSectionForm.get(FccGlobalConstant.ISSUER_REF_LIST).updateValueAndValidity();
    this.form.addControl(FccGlobalConstant.ISSUER_REF_LIST, bankSectionForm.get(FccGlobalConstant.ISSUER_REF_LIST));
    /* ends */

    this.form.addControl('lcheader', this.amountDetailsForm.get('lcheader'));
    this.form.get('lcheader')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_VALUE_SUB_SECTION_MODEL;

    /* start curreny list */
    this.amountDetailsForm.get(FccGlobalConstant.CURRENCY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.amountDetailsForm.get(FccGlobalConstant.CURRENCY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.amountDetailsForm.get(FccGlobalConstant.CURRENCY).clearValidators();
    this.amountDetailsForm.get(FccGlobalConstant.CURRENCY).markAsTouched();
    this.amountDetailsForm.get(FccGlobalConstant.CURRENCY).updateValueAndValidity();
    this.form.addControl(FccGlobalConstant.CURRENCY, this.amountDetailsForm.get(FccGlobalConstant.CURRENCY));
    this.amountDetailsForm.get(FccGlobalConstant.CURRENCY)[FccGlobalConstant.PARAMS].layoutClass =
    'p-col-6 p-md-6 p-lg-6 p-sm-12 leftwrapper chargeAmt';
    this.getCurrencyDetail();
    //  this.getCorporateBanks();
    //  this.getCorporateReferences();
    /* ends */

    /* start amount list */
    this.amountDetailsForm.get(FccGlobalConstant.AMOUNT_FIELD)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.amountDetailsForm.get(FccGlobalConstant.AMOUNT_FIELD)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.amountDetailsForm.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
    this.amountDetailsForm.get(FccGlobalConstant.AMOUNT_FIELD).markAsTouched();
    this.amountDetailsForm.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
    this.form.addControl(FccGlobalConstant.AMOUNT_FIELD, this.amountDetailsForm.get(FccGlobalConstant.AMOUNT_FIELD));

    if (this.mode !== FccGlobalConstant.DRAFT_OPTION && this.commonService.getUserPermissionFlag(FccGlobalConstant.LC_FREE_FORMAT)) {
      this.amountDetailsForm.get('editFreeFormatFlag')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.amountDetailsForm.get('editFreeFormatFlag').clearValidators();
      this.amountDetailsForm.get('editFreeFormatFlag').markAsTouched();
      this.amountDetailsForm.get('editFreeFormatFlag').updateValueAndValidity();
      this.form.addControl('editFreeFormatFlag', this.amountDetailsForm.get('editFreeFormatFlag'));
    }
    this.amountDetailsForm.get(FccGlobalConstant.AMOUNT_FIELD)[FccGlobalConstant.PARAMS].layoutClass =
    'p-col-6 p-md-6 p-lg-6 p-sm-12 leftwrapper';
    /* ends */

    // this.getBeneficiaries();
    this.commonService.entities = [];
    this.commonService.updateUserEntities(this.form, this.stateService, this.multiBankService,
      this.taskService, this.dropDownAPIservice, this.corporateCommonService);
    this.patchFieldParameters(this.form.get('applicantEntity'), { options: this.commonService.entities });
    this.leftSectionService.reEvaluateProgressBar.next(true);
  }


  onClickApplicantEntity(event, key) {
    if (event.value) {
      const entity = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value;
      this.multiBankService.setCurrentEntity(entity.shortName);
      this.getCorporateBanks();
      this.getCorporateReferences();
      this.multiBankService.clearIssueRef();
      // sync with task entity TODO: revisit
      // this.taskService.setTaskEntity(event.value);
      this.patchFieldValueAndParameters(this.form.get('applicantName'), entity.shortName, {});
      this.commonService.entities.forEach(value => {
        if (event.value.shortName === value.value.shortName) {
          const address = this.multiBankService.getAddress(value.value.shortName);
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
            address[this.commonService.address][this.commonService.addressLine1], {});
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
            address[this.commonService.address][this.commonService.addressLine2], {});
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
            address[this.commonService.address][this.commonService.addressLine3], {});
          // this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4),
          //   address['Address']['line4'], {});
        }
      });
      this.form.updateValueAndValidity();
    }
  }

  getCorporateBanks() {
    this.setBankNameList();
    const val = this.dropDownAPIservice.getInputDropdownValue(this.corporateBanks, 'bankNameList', this.form);
    this.patchFieldParameters(this.form.get('bankNameList'), { options: this.corporateBanks });
    this.form.get('bankNameList').setValue(val);
    if (this.corporateBanks.length === 1) {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = false;
    }
    this.multiBankService.setCurrentBank(val);
    this.taskService.setTaskBank(this.corporateBanks[0]);
    if (this.taskService.getTaskBank()){
      this.form.get('bankNameList').setValue(this.taskService.getTaskBank().value);
      this.multiBankService.setCurrentBank(this.taskService.getTaskBank().value);
    }
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && this.form.get('bankNameList').value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get('bankNameList'), { amendPersistenceSave: true });
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropDownAPIservice.getDropDownFilterValueObj(this.corporateBanks, 'bankNameList', this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj) {
        this.form.get('bankNameList').setValue(valObj.label);
      }
    }
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

    this.commonService.getParamData(FccGlobalConstant.PRODUCT_LC, 'P306').subscribe(response => {

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
    if (this.RenderProvisional && provisionalVariable && this.provRender && 
      this.option !== 'TEMPLATE' && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND)
    {
      this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.ISANYPROVBANKAVL] = true;
      this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
     } else {
       this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
     }
    this.form.updateValueAndValidity();
    }


  onClickBankNameList(event) {
    if (event && event.value)
    {
      if (!this.form.get('bankNameList')[this.params][this.disabled]) {
        this.multiBankService.setCurrentBank(event.value);
        const taskBank = this.corporateBanks.filter((item) => item.value === event.value);
        this.taskService.setTaskBank(taskBank[0]);
        this.setIssuerReferenceList();
    }
  }
  }

  getCorporateReferences() {
    this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: [] });
    if (this.form.get('applicantEntity').value.shortName === '') {
      this.form.get('issuerReferenceList')[this.params][this.disabled] = true;
    } else {
      this.form.get('issuerReferenceList')[this.params][this.disabled] = false;
    }
    this.setIssuerReferenceList();
  }

  setIssuerReferenceList() {
    this.corporateReferences = [];
    const referenceList = this.multiBankService.getReferenceList();
    referenceList.forEach(reference => {
      this.corporateReferences.push(reference);
    });
    const isDefaultFirst = this.corporateReferences.length === FccGlobalConstant.LENGTH_1;
    let val = this.dropDownAPIservice.getInputDropdownValue(this.corporateReferences, 'issuerReferenceList', this.form, isDefaultFirst);
    this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: this.corporateReferences });
    val = this.multiBankService.updateRefonEntityChange && !isDefaultFirst && !val ? '' : val;
    this.form.get('issuerReferenceList').setValue(val);
    if (this.corporateReferences.length === 1) {
      this.form.get('issuerReferenceList')[this.params][this.disabled] = true;
    } else {
      this.form.get('issuerReferenceList')[this.params][this.disabled] = false;
    }
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && this.form.get('issuerReferenceList').value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get('issuerReferenceList'), { amendPersistenceSave: true });
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropDownAPIservice.getDropDownFilterValueObj(this.corporateReferences, 'issuerReferenceList', this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj) {
        this.form.get('issuerReferenceList').setValue(valObj.label);
      }
    }
  }

  onclickCurrencyAccessibility(value) {
    if (value) {
      this.postClickRKeyUpOnCurrency(value);
    }
  }

  /*validation on change of currency field*/
  onClickCurrency(event, key) {
    if (event.value !== undefined) {
      this.postClickRKeyUpOnCurrency(event.value);
    }
  }

  postClickRKeyUpOnCurrency(value) {
    if (value) {
      // this.handleLinkedLicense();
      this.enteredCurMethod = true;
      this.iso = value.currencyCode;
      this.isoamt = this.iso;
      const amt = this.form.get('amount');
      this.val = amt.value;
      amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(this.nonNumericCurrencyValidator){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso, 
          this.currencyDecimalplacesZero, 
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      this.setMandatoryField(this.form, 'amount', true);
      this.flagDecimalPlaces = 0;
      if(this.nonNumericCurrencyValidator){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      if (this.val !== '' && this.val !== null) {
          if (this.val <= 0) {
            this.form.get('amount').setErrors({ amountCanNotBeZero: true });
            return;
          } else {
            let valueupdated = this.commonService.replaceCurrency(this.val);
            valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
            this.form.get('amount').setValue(valueupdated);
          }
        } else {
          this.form.get('amount').setErrors({ required: true });
        }
      this.setAmountLengthValidator('amount');
      this.form.get('amount').updateValueAndValidity();
      this.form1 = this.stateService.getSectionData(FccGlobalConstant.NARRATIVE_DETAILS, undefined, this.isMasterRequired);
      const goodsDocsSectionForm = this.form1.controls.goodsandDoc.get('descOfGoods');
      goodsDocsSectionForm.get('currency').setValue(value.currencyCode);
      // this.removeMandatory(['amount']);
    }
  }

  onClickAmount() {
    this.OnClickAmountFieldHandler('amount');
  }


  updateRequestLCType() {
    const sectionForm : FCCFormGroup = this.stateService.getSectionData(FccGlobalConstant.PAYMENT_DETAILS);
    const sectionForm2 : FCCFormGroup = this.stateService.getSectionData(FccGlobalConstant.FILE_UPLOAD);
    if (this.form.get('createFromOptions') && this.form.get('createFromOptions').value === 'upload') {
      this.form.get('requestOptionsLC').setValue(FccGlobalConstant.CODE_04);
      this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[this.params][FccGlobalConstant.REQUIRED] = false;
      sectionForm.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      sectionForm.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).clearValidators();
      sectionForm.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).markAsTouched();
      sectionForm.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).updateValueAndValidity();
      sectionForm2.get(FccGlobalConstant.ATTACHMENTS)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get('requestOptionsLC').updateValueAndValidity();
      this.prevCreateFrom = 'upload';
    } else {
      // give error msg popup
      this.form.get('requestOptionsLC').setValue(FccGlobalConstant.CODE_01);
      this.handleApplicableRules();
      sectionForm.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      sectionForm.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).setValidators([Validators.required]);
      sectionForm.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).setErrors({ required: true });
      sectionForm.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).markAsDirty();
      sectionForm.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).markAsTouched();
      sectionForm.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).updateValueAndValidity();
      sectionForm2.get(FccGlobalConstant.ATTACHMENTS)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    }
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

  onFocusYesButton(createFrom) {
    setTimeout(() => {
      if (createFrom === 'existinglc') {
        this.onClickExistingLc();
      } else if (createFrom === 'template') {
        this.onClickExistingTemplate();
      }
    }, 400);
  }

  onFocusNoButton() {
    setTimeout(() => {
      this.form.get('createFromOptions').setValue(this.prevCreateFrom);
    }, 400);
  }

  chipSelection(data , message) {
    const presentValue = data[FccGlobalConstant.SOURCE][FccGlobalConstant.VALUE];
    const data1 = {
        controlName: 'createFromOptions',
        previousValue: this.prevCreateFrom,
        presentValue,
        event: true,
        locaKey: message
      };
    if (this.isChipEvent(data, this.prevCreateFrom)) {
      this.commonService.openChipConfirmationDialog$.next(data1);
    } else {
      this.prevCreateFrom = this.form.get('createFromOptions').value;
    }
  }

  onChangeTemplateName() {
    this.commonService.putQueryParameters('templateName', this.form.get('templateName').value);
    if (this.form.get('templateName').value.length === 0) {
      this.form.get('next')[this.params][this.rendered] = false;
    } else {
      this.form.get('next')[this.params][this.rendered] = true;
    }
  }

  onClickApplicableRulesOptions() {
    if (this.option !== FccGlobalConstant.TEMPLATE) {
      if (this.commonService.isnonEMptyString(this.form.get('requestOptionsLC').value) &&
        (this.form.get('requestOptionsLC').value === FccGlobalConstant.CODE_02 ||
          this.form.get('requestOptionsLC').value === FccGlobalConstant.CODE_04)
        && this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
        this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[this.params][FccGlobalConstant.REQUIRED] = false;
      } else if (this.commonService.isnonEMptyString(this.form.get('requestOptionsLC').value) &&
        this.form.get('requestOptionsLC').value === FccGlobalConstant.CODE_01 && this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
        this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[this.params][FccGlobalConstant.REQUIRED] = true;
      }
      this.handleApplicableRules();
    }
    this.handleLCApplicableRulesOptions();
    const applicableRule = this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS).value;
    if (applicableRule && applicableRule.toString() === FccBusinessConstantsService.OTHER_99) {
      this.form.get(FccTradeFieldConstants.OTHER_APPLICABLE_RULES)[this.params][this.rendered] = true;
      if (this.isPreview) {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.APPLICABLE_RULES_OPTIONS], false);
      }
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('otherApplicableRules', Validators.pattern(this.enquiryRegex), 0);
      }
      this.form.addFCCValidators('otherApplicableRules', Validators.maxLength(FccGlobalConstant.LENGTH_35), 0);
      this.setMandatoryField(this.form, FccTradeFieldConstants.OTHER_APPLICABLE_RULES, true);
    } else {
      this.form.get(FccTradeFieldConstants.OTHER_APPLICABLE_RULES)[this.params][this.rendered] = false;
      this.setMandatoryField(this.form, FccTradeFieldConstants.OTHER_APPLICABLE_RULES, false);
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.APPLICABLE_RULES_OPTIONS], true);
    }
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

  setFieldsArrayNdSectionsData(isTemplate: boolean, productCode: string) {
    this.revertCopyFromDetails();
    // excludingJsonFileKey is used to fetch key from the JSON file from backend
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
    if (this.templateKey) {
      obj[locaKey] = this.templateKey;
    } else if (this.backtobackKey) {
      obj[locaKey] = this.backtobackKey ;
    } else {
      obj[locaKey] = FccGlobalConstant.COPYFROM_KEY;
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
        if (this.templateKey) {
          this.resetRemoveLabelTemplate();
        } else if (this.backtobackKey) {
          this.resetRemoveLabelSR();
        } else {
          this.resetFieldsForCopyFromTemplate();
        }
      }
      this.templateKey = null;
      this.backtobackKey = null;
    });
  }

  hideRenderedColumns() {
    const displayFields = ['featureofLC', 'irv_flag', 'ntrf_flag', 'backToBackLCToggle',
      'revolving_flag', 'ApplicableRules', 'applicableRulesOptions', 'confirmationInstruction',
      'confirmationOptions', 'beneficiaryReference', 'otherApplicableRules', 'purchaseOrderReference'];
    displayFields.forEach(field => {
      this.form.get(field)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(field).clearValidators();
      this.form.get(field).markAsTouched();
      this.form.get(field).updateValueAndValidity();
    });
    this.leftSectionService.reEvaluateProgressBar.next(true);
    const hiddenFields = [FccGlobalConstant.APPLICANT_ADDRESS_1,
    FccGlobalConstant.APPLICANT_ENTITY, FccGlobalConstant.APPLICANT_NAME,
    FccGlobalConstant.APPLICANT_ADDRESS_2, FccGlobalConstant.APPLICANT_ADDRESS_3,
    FccGlobalConstant.BENEFICIARY_ENTITY, FccGlobalConstant.BANK_NAME_LIST, FccGlobalConstant.ISSUER_REF_LIST,
    FccGlobalConstant.CURRENCY, FccGlobalConstant.AMOUNT_FIELD,
      'issuerReferenceHeader', 'bankNameHeader', 'lcheader', 'applicantHeader', 'editFreeFormatFlag'];
    hiddenFields.forEach(field => {
      if (this.form.get(field)) {
        this.form.get(field)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(field).clearValidators();
        this.form.get(field).markAsTouched();
        this.form.get(field).updateValueAndValidity();
      }
    });
  }

  /**
   *  Reset fields for Copy From on click on confirmation from dialog box
   */
  resetFieldsForCopyFromTemplate(): void {
    this.lcResponse.unsubscribe();
    this.productStateService.clearState();
    this.formModelService.getFormModel(FccGlobalConstant.PRODUCT_LC).subscribe(modelJson => {
      this.productStateService.initializeProductModel(modelJson);
      this.productStateService.initializeState(FccGlobalConstant.PRODUCT_LC);
      this.productStateService.populateAllEmptySectionsInState();
      this.form = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS);
      this.form.get('createFromOptions')[this.params][this.rendered] = true;
      this.form.get('referenceSelected')[this.params][this.rendered] = false;
      this.form.get('fetchedRefValue')[this.params][this.rendered] = false;
      this.form.get('removeLabel')[this.params][this.rendered] = false;
      this.form.get('fetchedRefValue').setValue('');
      this.form.get('customerReference').setValue('');
      const val = this.form.get('createFromOptions')[this.params][this.options];
      const val1 = this.form.get('requestOptionsLC')[this.params][this.options];
      this.toggleCreateFormButtons(val, val1, false);
      this.form.get('createFromOptions').setValue('');
      this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.disabled] = false;
      this.onClickApplicableRulesOptions();
    });
    this.initializeFormGroup();
  }
  onClickRemoveLabelTemplate() {
    this.templateKey = FccGlobalConstant.TEMPLATEFROM_KEY;
    this.onClickRemoveLabel();
  }
  resetRemoveLabelTemplate() {
    this.form.get('createFromOptions')[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.disabled] = false;
    this.form.get('templateSelection')[this.params][this.rendered] = false;
    this.form.get('fetchedTemplate')[this.params][this.rendered] = false;
    this.form.get('removeLabelTemplate')[this.params][this.rendered] = false;
    this.form.get('fetchedTemplate').setValue('');
    const val = this.form.get('createFromOptions')[this.params][this.options];
    const val1 = this.form.get('requestOptionsLC')[this.params][this.options];
    this.toggleCreateFormButtons(val, val1, false);
    this.form.get('createFromOptions').setValue('');
    this.templateResponse.unsubscribe();
    this.productStateService.clearState();
    this.formModelService.getFormModel(FccGlobalConstant.PRODUCT_LC).subscribe(modelJson => {
      this.productStateService.initializeProductModel(modelJson);
      this.productStateService.initializeState(FccGlobalConstant.PRODUCT_LC);
      this.productStateService.populateAllEmptySectionsInState();
    });
    this.initializeFormGroup();
  }
  onClickRemoveLcCardDetails() {
    this.backtobackKey = FccGlobalConstant.BACK_TO_BACK_LC;
    this.onClickRemoveLabel();
  }
  resetRemoveLabelSR() {
    this.renderFormFieldsOnToggle(false);
    this.commonService.announceMission('yes');
    this.form.get('selectLCMessage')[this.params][this.rendered] = true;
    this.form.get('infoIcons')[this.params][this.rendered] = true;
    this.form.get('backToBackLC')[this.params][this.rendered] = true;
    this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.rendered] = false;
    this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.options] = [];
    this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.previewScreen] = false;
    this.form.get('tipAfterBackToBackSelect')[this.params][this.rendered] = false;
    // this.form.get(FccTradeFieldConstants.IS_BACK_TO_BACK_LC)[this.params][this.previewScreen] = false;
    this.removeFormValues();
    this.form.get('requestOptionsLC').setValue('01');
    const val = this.form.get('requestOptionsLC')[this.params][this.options];
    const val1 = this.form.get('createFromOptions')[this.params][this.options];
    this.toggleRequestButtons(val, val1, false);
    this.backToBackResponse.unsubscribe();
  }

  resetCreatForm() {
    if (this.form.get('fetchedTemplate') && this.form.get('fetchedTemplate').value) {
      this.form.get('createFromOptions').setValue('template');
    }
    if (this.form.get('fetchedRefValue') && this.form.get('fetchedRefValue').value) {
      this.form.get('createFromOptions').setValue('existinglc');
    }
    if ( (!(this.form.get('fetchedTemplate') && this.form.get('fetchedTemplate').value)) &&
     (!(this.form.get('fetchedRefValue') && this.form.get('fetchedRefValue').value))
     && (this.form.get('requestOptionsLC')?.value !== '02' || this.form.get('requestOptionsLC')?.value !== '04')) {
      this.form.get('createFromOptions').setValue('');
    }
    if ( (!(this.form.get('fetchedTemplate') && this.form.get('fetchedTemplate').value)) &&
     (!(this.form.get('fetchedRefValue') && this.form.get('fetchedRefValue').value))
     && (this.form.get('requestOptionsLC').value === '02' || this.form.get('requestOptionsLC').value === '04')) {
      this.form.get('createFromOptions').setValue('upload');
    }
    // this.refreshFormElements();
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

  onClickTransmissionMode(data: any) {
    if (data.value === FccBusinessConstantsService.OTHER_99) {
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT_OTHER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
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
    if (data.value !== FccBusinessConstantsService.SWIFT) {
      this.form.get('placeOfExpiry').setValue(`${this.translateService.instant('defaultExpiryPlace')}`);
      this.form.get('placeOfExpiry').setValidators([]);

      this.uploadswiftRegexFields.forEach((ele) => {
        if(ele) {
          this.form.get(ele).setValue('');
          this.form.get(ele).setValue('');
        }
      });
      this.form.get('customerReference').setValidators([]);
      this.form.get('beneficiaryReference').setValidators([]);
      this.form.get('otherApplicableRules').setValidators([]);
      this.form.get('purchaseOrderReference').setValidators([]);
      this.form.get('placeOfExpiry').updateValueAndValidity();
      this.form.get('customerReference').updateValueAndValidity();
      this.form.get('beneficiaryReference').updateValueAndValidity();
      this.form.get('otherApplicableRules').updateValueAndValidity();
      this.form.get('purchaseOrderReference').updateValueAndValidity();
      this.form.addFCCValidators('customerReference', Validators.maxLength(this.custRefLength), 0);
      if(this.form.get('applicantName')) {
        this.form.get('applicantName').setErrors({ required: true });
      }
      if(this.form.get('applicantFirstAddress')) {
        this.form.get('applicantFirstAddress').setErrors({ required: true });
      }
      this.form.addFCCValidators('beneficiaryReference', Validators.maxLength(this.custRefLength), 0);
      this.form.addFCCValidators('purchaseOrderReference',
        Validators.maxLength(FccGlobalConstant.LENGTH_2000), 0);
      this.form.addFCCValidators('otherApplicableRules', Validators.maxLength(FccGlobalConstant.LENGTH_35), 0);
    } else {
      this.form.get('placeOfExpiry').setValue(`${this.translateService.instant('defaultExpiryPlace')}`);
      this.form.addFCCValidators('placeOfExpiry', Validators.pattern(this.enquiryRegex), 0);
      this.form.addFCCValidators('otherApplicableRules', Validators.pattern(this.enquiryRegex), 0);
      this.form.addFCCValidators('purchaseOrderReference',[Validators.maxLength(FccGlobalConstant.LENGTH_2000), 
        Validators.pattern(this.swiftZCharSet)], 0);
      this.form.get('placeOfExpiry').updateValueAndValidity();
      this.form.get('otherApplicableRules').updateValueAndValidity();
    }
    this.commonService.isTransmissionModeChanged(this.form.get('transmissionMode').value);
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, 'advSendModeText', false);
      this.form.setErrors(null);
      this.form.clearValidators();
      this.form.updateValueAndValidity();
    }
  }

  onClickExistingLc() {
    this.setFieldsArrayNdSectionsData(false, FccGlobalConstant.PRODUCT_LC);
    const header = `${this.translateService.instant('existingLcList')}`;
    const productCode = 'productCode';
    const subProductCode = 'subProductCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_LC;
    obj[option] = 'Existing';
    obj[subProductCode] = FccGlobalConstant.LCSTD;
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fieldsArray = ['expiryDate', 'customerReference', 'amount', 'lcAvailableAmt', 'issueDateView'];
    this.resolverService.getSearchData(header, obj);
    this.lcResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (this.backToBackResponse !== undefined) {
        this.backToBackResponse.unsubscribe();
      }
      if (this.templateResponse !== undefined) {
        this.templateResponse.unsubscribe();
      }
      if (response !== null) {
        // const provisionalTogglevalue = this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE).value;
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        const prodCode = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
          && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
          FccGlobalConstant.PRODUCT_LC : undefined;
        const eventIdToPass = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
          && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
          response.responseData.TNX_ID : response.responseData.REF_ID;
        this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_LC);
        this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_LC).subscribe(apiMappingModel => {
        this.transactionDetailService.fetchTransactionDetails(eventIdToPass, prodCode, false).subscribe(responseData => {
        const responseObj = responseData.body;
        const setStateForProduct = {
          responseObject: responseObj,
          apiModel: apiMappingModel,
          isMaster: false,
          fieldsList: this.fieldsArray,
          sectionsList: this.sectionsArray
        };
        this.commonService.productState.next(setStateForProduct);
        this.form = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS);
        this.form.get('createFromOptions')[this.params][this.rendered] = false;
        this.form.get('referenceSelected')[this.params][this.rendered] = true;
        this.form.get('fetchedRefValue')[this.params][this.rendered] = true;
        this.form.get('removeLabel')[this.params][this.rendered] = true;
        this.form.get('fetchedRefValue').patchValue(response.responseData.REF_ID);
        this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).patchValue(response.responseData.REF_ID);
        if ( !this.fieldsArray || this.fieldsArray.length === 0) {
          this.form.get(FccGlobalConstant.CUSTOMER_REF).setValue(FccGlobalConstant.EMPTY_STRING);
          this.form.get(FccGlobalConstant.BENEFICIARY_REFERNCE).setValue(FccGlobalConstant.EMPTY_STRING);
          if (this.purchaseOrderEnable && this.commonService.getUserPermissionFlag(FccGlobalConstant.LC_DISPLAY_PO_REF)) {
            this.form.get(FccGlobalConstant.PO_REF)[this.params][this.rendered] = true;
            this.form.get(FccGlobalConstant.PO_REF).setValue(FccGlobalConstant.EMPTY_STRING);
          }
          this.form.get(FccTradeFieldConstants.BANK_REFERENCE_VIEW).setValue(FccGlobalConstant.EMPTY_STRING);
          this.stateService.getSectionData(FccGlobalConstant.BANK_DETAILS).get('issuingBank').get('issuerReferenceList').
          setValue(FccGlobalConstant.EMPTY_STRING);
        }
        this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE).setValue(this.provisionalLCToggleValue);
        this.patchFieldParameters(this.form.get('fetchedRefValue'), { readonly: true });
        this.form.get('customerReference').setValue(FccGlobalConstant.EMPTY_STRING);
        if (this.form.get('issueDateView')) {
          this.form.get('issueDateView').setValue(FccGlobalConstant.EMPTY_STRING);
        }
        this.form.get(FccTradeFieldConstants.BANK_REFERENCE_VIEW).setValue(FccGlobalConstant.EMPTY_STRING);
        this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.disabled] = true;
        this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.previewScreen] = false;
        this.form.get('backToBackLCToggle').setValue(FccGlobalConstant.EMPTY_STRING);
        this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.rendered] = false;
        this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.previewScreen] = false;
        const val = this.form.get('createFromOptions')[this.params][this.options];
        const val1 = this.form.get('requestOptionsLC')[this.params][this.options];
        this.toggleCreateFormButtons(val, val1, true);
        this.onClickApplicableRulesOptions();
        this.removeUnwantedFieldsForExistingLC();
        this.leftSectionService.reEvaluateProgressBar.next(true);
      });
    });
      }
    });
  }

  removeUnwantedFieldsForExistingLC(){
    if (this.stateService.getSectionData(FccGlobalConstant.AMOUNT_CHARGE_DETAILS)
      && this.stateService.getSectionData(FccGlobalConstant.AMOUNT_CHARGE_DETAILS).get(FccGlobalConstant.AMOUNT_FIELD)){
        this.stateService.getSectionData(FccGlobalConstant.AMOUNT_CHARGE_DETAILS).get(FccGlobalConstant.AMOUNT_FIELD)
          .setValue(FccGlobalConstant.EMPTY_STRING);
        this.stateService.getSectionData(FccGlobalConstant.AMOUNT_CHARGE_DETAILS).get(FccGlobalConstant.CURRENCY)
          .setValue(FccGlobalConstant.EMPTY_STRING);
    }
    if (this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD)) {
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).patchValue(FccGlobalConstant.EMPTY_STRING);
    }
    if (this.stateService.getSectionData(FccGlobalConstant.SHIPMENT_DETAILS)
      && this.stateService.getSectionData(FccGlobalConstant.SHIPMENT_DETAILS).get(FccGlobalConstant.SHIPMENT_DATE_FIELD)){
      this.stateService.getSectionData(FccGlobalConstant.SHIPMENT_DETAILS).get(FccGlobalConstant.SHIPMENT_DATE_FIELD).setValue(null);
    }
    if (this.stateService.getSectionData(FccGlobalConstant.PAYMENT_DETAILS)
      && this.stateService.getSectionData(FccGlobalConstant.PAYMENT_DETAILS).get(FccGlobalConstant.FIXED_MATURITY_PAYMENT_DATE)) {
        this.stateService.getSectionData(FccGlobalConstant.PAYMENT_DETAILS).get(FccGlobalConstant.FIXED_MATURITY_PAYMENT_DATE)
          .setValue(FccGlobalConstant.EMPTY_STRING);
    }
  }

  toggleCreateFormButtons(val, val1, enable) {
    val.forEach( (element) => {
      element[this.disabled] = enable;
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

  onClickExistingTemplate() {
    this.setFieldsArrayNdSectionsData(true, '');
    //const header = `${this.translateService.instant('templateListing')}`;
    const header = `${this.translateService.instant('templateListingForLC')}`;
    const productCode = 'productCode';
    const subProductCode = 'subProductCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_LC;
    obj[option] = FccGlobalConstant.CREATE_FROM_TEMPLATE;
    obj[subProductCode] = FccGlobalConstant.LCSTD;
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
      if (this.lcResponse !== undefined) {
        this.lcResponse.unsubscribe();
      }
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        this.templateIDSubProdCode = response.responseData.SUB_PRODUCT_CODE;
        this.getTemplateById(response.responseData.TEMPLATE_ID);
      }
      if (this.commonService.isnonEMptyString(this.form.get('requestOptionsLC').value) &&
        (this.form.get('requestOptionsLC').value === FccGlobalConstant.CODE_02
          || this.form.get('requestOptionsLC').value === FccGlobalConstant.CODE_04)
        && this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
        this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[this.params][FccGlobalConstant.REQUIRED] = false;
      } else if (this.commonService.isnonEMptyString(this.form.get('requestOptionsLC').value) &&
        this.form.get('requestOptionsLC').value === FccGlobalConstant.CODE_01 && this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
        this.handleApplicableRules();
      }
    });

  }

  removeUnwantedFieldsForTemplate() {
    if (!this.excludedFieldsNdSections || this.excludedFieldsNdSections.length === 0) {
      this.form.get('customerReference').setValue('');
      this.form.get('expiryDate').setValue('');
    }
    this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.disabled] = true;
    this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.previewScreen] = false;
    this.form.get('createFromOptions')[this.params][this.rendered] = false;
  }

  getTemplateById(templateID) {
    this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_LC);
    this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_LC).subscribe(apiMappingModel => {
    this.transactionDetailService.
    fetchTransactionDetails(templateID, FccGlobalConstant.PRODUCT_LC, true, this.templateIDSubProdCode).subscribe(responseData => {
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
      this.form.get('requestOptionsLC')[this.params][this.rendered] = false;
      this.form.get('templateSelection')[this.params][this.rendered] = true;
      this.form.get('fetchedTemplate')[this.params][this.rendered] = true;
      this.form.get('removeLabelTemplate')[this.params][this.rendered] = true;
      const element = document.createElement('div');
      element.innerHTML = templateID;
      templateID = element.textContent;
      this.form.get('fetchedTemplate').patchValue(templateID);
      this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE).setValue(this.provisionalLCToggleValue);
      // this.onClickProvisionalLCToggle();
      this.patchFieldParameters(this.form.get('fetchedTemplate'), { readonly: true });
      const val = this.form.get('createFromOptions')[this.params][this.options];
      const val1 = this.form.get('requestOptionsLC')[this.params][this.options];
      this.toggleCreateFormButtons(val, val1, true);
      this.onClickApplicableRulesOptions();
      this.removeUnwantedFieldsForTemplate();
      this.form.addFCCValidators('customerReference', Validators.maxLength(this.custRefLength), 0);
      this.form.addFCCValidators('beneficiaryReference', Validators.maxLength(this.custRefLength), 0);
      this.form.get('customerReference').updateValueAndValidity();
      this.form.get('beneficiaryReference').updateValueAndValidity();
    });
  });
  }

  updateProvisionalLCToggle(val){
    this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE).setValue(val);
    this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE).updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  onClickBackToBackLC() {
    this.setFieldsArrayNdSectionsData(false, FccTradeFieldConstants.BACK_TO_BACK_LC_OPTION);
    const header = `${this.translateService.instant('existingLetterOfCredits')}`;
    const productCode = 'productCode';
    const subProductCode = 'subProductCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    const obj = {};
    this.commonService.backTobackExpDateFilter = true;
    obj[productCode] = FccGlobalConstant.PRODUCT_LC;
    obj[option] = 'BackToBack';
    obj[subProductCode] = FccGlobalConstant.LCSTD;
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
        this.form.get('selectLCMessage')[this.params][this.rendered] = false;
        this.form.get('infoIcons')[this.params][this.rendered] = false;
        this.form.get('backToBackLC')[this.params][this.rendered] = false;
        this.renderFormFieldsOnToggle(true);
        this.onClickApplicableRulesOptions();
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        this.commonService.announceMission('no');
        this.commonService.setClearBackToBackLCfields('no');
        const val = this.form.get('requestOptionsLC')[this.params][this.options];
        const val1 = this.form.get('createFromOptions')[this.params][this.options];
        this.toggleRequestButtons(val, val1, true);
        this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_LC);
        const mode = 'INIT';
        this.initializeFormToLCDetailsResponse(response.responseData.REF_ID, mode);
      }
    });
  }

  initializeFormToLCDetailsResponse(response: any, mode?: any) {
    this.transactionDetailService.fetchTransactionDetails(response).subscribe(responseData => {
      const responseObj = responseData.body;
      this.commonService.setParentTnxInformation(responseObj);
      this.parentRefId = responseObj.ref_id;
      this.commonService.setShipmentExpiryDateForBackToBack(responseObj.last_ship_date);
      this.commonService.setAmountForBackToBack(responseObj.lc_amt);
      let dateParts;
      this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_LC, undefined, undefined, undefined,
                                              FccGlobalConstant.LC_BACK_TO_BACK).subscribe(apiMappingModel => {
      const setStateForProduct = {
        responseObject: responseObj,
        apiModel: apiMappingModel,
        isMaster: false,
        subTnxType: FccGlobalConstant.LC_BACK_TO_BACK,
        fieldsList: this.fieldsArray,
        sectionsList: this.sectionsArray,
        templateBacktoBack: true
      };
      if (mode !== 'EDIT') {
        this.commonService.productState.next(setStateForProduct);
      }
      this.form = this.stateService.getSectionData(this.sectionName);
      if (responseObj.exp_date) {
        dateParts = responseObj.exp_date.toString().split('/');
        this.expiryDateBackToBack = new Date(dateParts[FccGlobalConstant.LENGTH_2],
          dateParts[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1, dateParts[FccGlobalConstant.LENGTH_0]);
        if (mode !== 'EDIT'){
          this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).patchValue(this.expiryDateBackToBack);
            }
      }
      this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE).setValue(FccBusinessConstantsService.YES);
      this.form.get('tipAfterBackToBackSelect')[this.params][this.rendered] = true;
      this.onClickProvisionalLCToggle();
      this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).patchValue(response);
      this.form.get(FccTradeFieldConstants.PARENT_REFERENCE)[this.params][this.previewScreen] = false;
      // this.form.get(FccTradeFieldConstants.IS_BACK_TO_BACK_LC)[this.params][this.previewScreen] = true;
      // this.form.get(FccTradeFieldConstants.IS_BACK_TO_BACK_LC)[this.params][this.rendered] = true;
      if (responseObj.bo_ref_id && (responseObj.bo_ref_id !== '' || responseObj.bo_ref_id !== null)) {
        this.form.get('parentBoRefId').setValue(responseObj.bo_ref_id);
      }
      const lcCardControl = this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS) as FCCFormControl;
      const cardData = this.productMappingService.getDetailsOfCardData(responseObj, lcCardControl);
      this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.options] = cardData;
      this.selectedRefId = responseObj.ref_id;
      const refIdHeader = this.translateService.instant(FccTradeFieldConstants.LC_CARD_DETAILS) + " | " + this.selectedRefId;
      this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.sectionHeader] = refIdHeader;
      this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.rendered] = true;
      this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params]['showRemoveLink'] = true;
      this.form.get('requestOptionsLC')[this.params][this.rendered] = false;
      this.form.get('createFrom')[this.params][this.rendered] = false;
      this.form.get('createFromOptions')[this.params][this.rendered] = false;
      this.form.get('parentReference')[this.params][this.rendered] = false;
      this.form.get('removeLabel')[this.params][this.rendered] = false;
      this.form.get('subTnxTypeCode').patchValue(FccGlobalConstant.LC_BACK_TO_BACK);
      this.onClickApplicableRulesOptions();
      this.leftSectionService.reEvaluateProgressBar.next(true);
    });
  });
  }
  onBlurExpiryDate() {
    this.onClickExpiryDate();
    this.validateExpiryDate();
  }

  onClickExpiryDate() {
    let expiryDate = this.form.get(this.expiryDateField).value;
    const currentDate = this.commonService.getBankDateForComparison();
    this.form.addFCCValidators(this.expiryDateField, Validators.pattern(FccGlobalConstant.datePattern), 0);
    if ((expiryDate !== null && expiryDate !== '')) {
    expiryDate = `${expiryDate.getDate()}/${(expiryDate.getMonth() + 1)}/${expiryDate.getFullYear()}`;
    expiryDate = (expiryDate !== '' && expiryDate !== null) ?
                                this.commonService.convertToDateFormat(expiryDate) : '';
    this.form.get(this.expiryDateField).clearValidators();
    if (expiryDate !== '' && (expiryDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) ) {
      if (this.mode === FccGlobalConstant.EXISTING && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
        this.form.get(this.expiryDateField).markAsTouched();
        this.form.get(this.expiryDateField).setValidators([expiryDateLessThanCurrentDate]);
      }
      if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
        this.form.get(this.expiryDateField).markAsTouched();
        this.form.get(this.expiryDateField).setValidators([Validators.required]);
      }
    } else {
      this.form.get(this.expiryDateField).clearValidators();
    }
    } else {
      this.form.get(this.expiryDateField).clearValidators();
      if (this.commonService.isNonEmptyValue(this.option) && this.option !== FccGlobalConstant.TEMPLATE) {
        this.form.get(this.expiryDateField).setValidators([Validators.required]);
      }
    }
    this.validateExpiryDate();
    this.form.get(this.expiryDateField).updateValueAndValidity();
  }

  /**
   * Validate expiry Date
   */
  validateExpiryDate(): void {
    const expDate = this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).value;
    if (expDate !== '' && this.commonService.isNonEmptyValue(expDate)) {
      const lastShipmentDate =
      this.stateService.getSectionData(FccGlobalConstant.SHIPMENT_DETAILS).get(FccGlobalConstant.SHIPMENT_DATE_FIELD).value;
      if (lastShipmentDate && expDate && (expDate < lastShipmentDate)) {
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValidators([compareExpDateWithLastShipmentDate]);
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
      } else if (this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).value && this.expiryDateBackToBack &&
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).value > this.expiryDateBackToBack) {
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValidators([compareNewExpiryDateToOld]);
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
      } else if (this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).value) {
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValidators([compareExpiryDateToCurrentDate]);
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
      } else {
        this.commonService.clearValidatorsAndUpdateValidity(FccGlobalConstant.EXPIRY_DATE_FIELD, this.form);
      }
    } else if(this.form.get(this.expiryDateField)['params']?.required && this.commonService.isNonEmptyValue(expDate) 
    && this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).status && 
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).status != 'INVALID'){
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValidators([Validators.required]);
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
      }
  }

  onClickBackToBackLCToggle() {
    const togglevalue = this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE).value;
    const previewScreenToggleControls = [FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE];
    if (togglevalue === FccBusinessConstantsService.NO) {
      this.renderFormFieldsOnToggle(true);
      this.onClickApplicableRulesOptions();
      this.commonService.announceMission('no');
      this.form.get('tipAfterBackToBackSelect')[this.params][this.rendered] = false;
      this.form.get('selectLCMessage')[this.params][this.rendered] = false;
      this.form.get('infoIcons')[this.params][this.rendered] = false;
      this.form.get('backToBackLC')[this.params][this.rendered] = false;
      this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.rendered] = false;
      this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.options] = [];
      this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.previewScreen] = false;
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
      this.removeFormValues();
     // this.form.get('requestOptionsLC')[this.params][this.rendered] = true;
      this.form.get('createFrom')[this.params][this.rendered] = true;
      this.form.get('createFromOptions')[this.params][this.rendered] = true;
      if (this.form.get(FccTradeFieldConstants.TRANS_MODE).value === '99') {
        this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT_OTHER)[this.params][this.rendered] = true;
        this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[this.params][this.rendered] = true;
        this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      }
      this.togglePreviewScreen(this.form, previewScreenToggleControls, false);
    } else {
      this.renderFormFieldsOnToggle(false);
      this.commonService.announceMission('yes');
      this.form.get('selectLCMessage')[this.params][this.rendered] = true;
      this.form.get('infoIcons')[this.params][this.rendered] = true;
      this.form.get('backToBackLC')[this.params][this.rendered] = true;
      this.form.get('requestOptionsLC')[this.params][this.rendered] = false;
      this.form.get('createFrom')[this.params][this.rendered] = false;
      this.form.get('createFromOptions')[this.params][this.rendered] = false;
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT_OTHER)[this.params][this.rendered] = false;
      this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[this.params][this.rendered] = false;
      this.togglePreviewScreen(this.form, previewScreenToggleControls, true);
    }
    this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE).updateValueAndValidity();
    this.form.updateValueAndValidity();
  }
  renderFormFieldsOnToggle(val) {
    const fields = ['modeofTransmission', 'transmissionMode', 'expiryDate', 'placeOfExpiry', 'featureofLC', 'irv_flag', 'ntrf_flag',
    'revolving_flag', 'ApplicableRules', 'applicableRulesOptions', 'confirmationInstruction', 'confirmationOptions', 'references',
    'customerReference', 'beneficiaryReference', 'otherApplicableRules'];
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

  removeFormValues() {
    this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).setValue('');
    this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).updateValueAndValidity();
    this.form.get('subTnxTypeCode').setValue('');
    this.form.get('subTnxTypeCode').updateValueAndValidity();
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValue('');
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
    this.commonService.setAmountForBackToBack('');
    this.commonService.setShipmentExpiryDateForBackToBack('');
    this.commonService.setClearBackToBackLCfields('yes');
    const fields = ['applicantName', 'applicantFirstAddress', 'applicantSecondAddress',
    'applicantThirdAddress', 'applicantFullAddress', 'altApplicantName', 'altApplicantFirstAddress', 'altApplicantSecondAddress',
    'altApplicantThirdAddress', 'altApplicantFullAddress', 'beneficiaryFirstAddress', 'beneficiarySecondAddress',
    'beneficiaryThirdAddress', 'beneficiaryFullAddress', 'beneAbbvName'];

    fields.forEach(ele => {
      this.stateService.getSectionData(FccGlobalConstant.APPLICANT_BENEFICIARY).get(ele).setValue('');
      this.stateService.getSectionData(FccGlobalConstant.APPLICANT_BENEFICIARY).get(ele).updateValueAndValidity();
    });

    this.stateService.getSectionData(FccGlobalConstant.BANK_DETAILS).reset();
    this.stateService.getSectionData(FccGlobalConstant.AMOUNT_CHARGE_DETAILS).reset();
    this.stateService.getSectionData(FccGlobalConstant.PAYMENT_DETAILS).reset();
    this.stateService.getSectionData(FccGlobalConstant.SHIPMENT_DETAILS).reset();
    this.stateService.getSectionData(FccGlobalConstant.NARRATIVE_DETAILS).reset();
  }

  amendFormFields() {
    this.form.get('requestTypeLC')[this.params][this.rendered] = false;
    this.form.get('modeofTransmission')[this.params][this.rendered] = false;
    this.form.get('amendNarrativeText')[this.params][this.rendered] = true;
    this.form.get('amendmentNarrative')[this.params][this.rendered] = true;
    this.form.addFCCValidators('amendmentNarrative', Validators.pattern(this.swiftXCharSet), 0);
    this.form.get('createFrom')[this.params][this.rendered] = false;
    this.form.get('createFromOptions')[this.params][this.rendered] = false;
    this.form.get('provisionalLCToggle')[this.params][this.rendered] = false;
    if (this.form.get('purchaseOrderReferenceView')) {
      this.form.get('purchaseOrderReferenceView')[this.params][this.rendered] = false;
    }
    this.form.get('otherApplicableRules')[this.params][this.parentStyleClass] = 'otherApplicableRulesStyle';
    this.form.get('references')[this.params][this.styleClass] = 'viewModeSubHeader';
    if ((this.mode !== FccGlobalConstant.VIEW_MODE && this.operation !== FccGlobalConstant.PREVIEW) ||
      (this.mode === FccGlobalConstant.VIEW_MODE && this.operation === FccGlobalConstant.LIST_INQUIRY)) {
    this.amendCommonService.setValueFromMasterToPrevious(this.sectionName);
    }
    this.form1 = this.stateService.getSectionData(FccGlobalConstant.NARRATIVE_DETAILS);
    this.expansionPanelSplitValue();
    this.updateNarrativeCount();
  }

  updateNarrativeCount() {
    if (this.form.get('amendmentNarrative').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('amendmentNarrative').value);
      this.form.get('amendmentNarrative')[this.params][this.enteredCharCount] = count;
    }
  }

  initializeFormGroup() {
    this.form = this.stateService.getSectionData(this.sectionName, undefined, this.isMasterRequired);
    this.provisional();
    this.form.get('requestOptionsLC')[this.params][this.rendered] = false;
    this.form.get('requestOptionsLC').updateValueAndValidity();
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
      if (this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS) &&
       this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.options] !== undefined)
      {
        this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.rendered] = true;
      }
    }
    this.commonService.formatForm(this.form);
    this.form.updateValueAndValidity();
    if (this.form.get('placeOfExpiry').value === null) {
      this.form.get('placeOfExpiry').setValue(`${this.translateService.instant('defaultExpiryPlace')}`);
    }
    if (this.provisionalLCToggleValue === 'Y') {
      this.form.get(FccGlobalConstant.PROVISIONAL_TOGGLE).setValue(this.provisionalLCToggleValue);
      this.togglePreviewScreen(this.form, [FccGlobalConstant.PROVISIONAL_TOGGLE], true);
      this.form.get(FccGlobalConstant.REQUEST_OPTION_LC)[this.params][this.rendered] = false;
      this.togglePreviewScreen(this.form, [FccGlobalConstant.REQUEST_OPTION_LC], false);
    }
    if (this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS) &&
    this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.rendered]) {
      this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params]['showRemoveLink'] = false;
    }
    const applicableRule = this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS).value;
    this.handleApplicableRules();

    if (!this.lcLcstdUploadFlag) {
      const requestList = this.form.get('createFromOptions')[this.params][this.options];
      requestList.splice(2, requestList.length);
      this.form.updateValueAndValidity();
    }
  }

  expansionPanelSplitValue() {
    const goodsandDoc = 'goodsandDoc';
    const descOfGoods = 'descOfGoods';
    const docRequired = 'docRequired';
    const additionallnstruction = 'additionallnstruction';
    const otherDetails = 'otherDetails';
    const specialPaymentNarrativeBene = 'specialPaymentNarrativeBene';
    this.narrativeService.descOfGoodsLoad(this.form1, goodsandDoc, descOfGoods);
    this.narrativeService.docRequiredLoad(this.form1, goodsandDoc, docRequired);
    this.narrativeService.additionallnstructionLoad(this.form1, goodsandDoc, additionallnstruction);
    this.narrativeService.specialPaymentNarrativeBeneLoad(this.form1, otherDetails, specialPaymentNarrativeBene);
  }

  onBlurTemplateName() {
    if (!this.form.get('templateName')[this.params][this.readonly]) {
      const templateName = this.form.get('templateName').value;
      this.form.get('templateName').setValue(templateName.trim());
      this.lcTemplateService.isTemplateNameExists(templateName, FccGlobalConstant.PRODUCT_LC).subscribe( res => {
        const jsonContent = res.body as string[];
        const isTemplateIdExists = jsonContent[`isTemplateIdExists`];
        if (isTemplateIdExists && this.templPrevValue !== this.form.get('templateName').value) {
          this.form.get('templateName').setErrors({ duplicateTemplateName: { templateName } });
          this.hideNavigation();
        } else {
          if (this.commonService.isEmptyValue(this.form.get('templateName')?.errors)) {
            this.form.get('templateName').setErrors(null);
          }
          this.commonService.announceMission('no');
        }
      });
    }
  }

  hideNavigation() {
    setTimeout(() => {
      const ele = document.getElementById('next');
      if (ele) {
        this.commonService.announceMission('yes');
      } else {
        this.hideNavigation();
      }
    }, FccGlobalConstant.LENGTH_500);
  }

  onClickPhraseIcon(event: any, key: any) {
    if (key === FccGlobalConstant.AMENDMENT_NARRATIVE) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LC, key, '13');
    } else {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LC, key, '10');
    }
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

  subscribeChipResponse() {
    if (this.chipResponse === undefined || this.chipResponse === null) {
      this.chipResponse = this.commonService.responseChipConfirmationDialog$.subscribe(data => {
        if (data && data.action && data.controlName === 'createFromOptions') {
          this.handleResponse(data);
          this.commonService.responseChipConfirmationDialog$.next(null);
        }
      });
    }
  }
  purchaseOrderFieldRender(){
    if (this.purchaseOrderEnable && this.commonService.getUserPermissionFlag('lc_display_po_reference')
    && (this.form.get('requestOptionsLC') && this.form.get('requestOptionsLC').value !== FccGlobalConstant.CODE_04)) {
      this.form.get('purchaseOrderReference')[this.params][this.rendered] = true;
    }
  }

  onBlurPurchaseOrderReference() {
   const purchaseOrderReference = this.form.get('purchaseOrderReference').value;
   if(purchaseOrderReference !== '' && purchaseOrderReference !== null) {
    if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
      (this.transmissionMode[0] && this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
      this.form.addFCCValidators('purchaseOrderReference',Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_2000), 
        Validators.pattern(this.swiftZCharSet)]), 0);
   }
  }
  this.form.get('purchaseOrderReference').updateValueAndValidity();
  this.form.updateValueAndValidity();
  }
}
