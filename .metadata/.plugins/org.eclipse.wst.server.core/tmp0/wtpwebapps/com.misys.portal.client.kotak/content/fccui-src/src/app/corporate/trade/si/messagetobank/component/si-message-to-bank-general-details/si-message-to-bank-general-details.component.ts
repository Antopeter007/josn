import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';

import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CodeData } from '../../../../../../common/model/codeData';
import { CurrencyRequest } from '../../../../../../common/model/currency-request';
import { CodeDataService } from '../../../../../../common/services/code-data.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import {
  CustomCommasInCurrenciesPipe,
} from '../../../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { FCCFormControl, FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { AccountDetailsList } from './../../../../../../common/model/accountDetailsList';
import { CommonService } from './../../../../../../common/services/common.service';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { LeftSectionService } from './../../../../../../corporate/common/services/leftSection.service';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { BankFileMap } from './../../../../../../corporate/trade/lc/initiation/services/bankmfile';
import { FilelistService } from './../../../../../../corporate/trade/lc/initiation/services/filelist.service';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import {
  emptyCurrency,
  zeroAmount,
} from './../../../../../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { SiProductComponent } from './../../../initiation/component/si-product/si-product.component';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { ProductMappingService } from './../../../../../../common/services/productMapping.service';
import { FccTradeFieldConstants } from './../../../../../trade/common/fcc-trade-field-constants';
import { FileHandlingService } from './../../../../../../common/services/file-handling.service';

@Component({
  selector: 'app-si-message-to-bank-general-details',
  templateUrl: './si-message-to-bank-general-details.component.html',
  styleUrls: ['./si-message-to-bank-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiMessageToBankGeneralDetailsComponent }]
})
export class SiMessageToBankGeneralDetailsComponent extends SiProductComponent implements OnInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  @ViewChild('fccCommonTextArea') public fccCommonTextAreaId: ElementRef;
  option: any;
  module = `${this.translateService.instant('siMessageToBankGeneralDetails')}`;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  tableColumns = [];
  refId: any;
  docId: any;
  data: any;
  bankFileModel: BankFileMap;
  contextPath: any;
  fileName: any;
  mode: any;
  tnxId: any;
  productCode: any;
  subTnxTypeCode: any;
  claimAmt: any;
  actionReqCode: any;
  accounts = [];
  accountDetailsList: AccountDetailsList;
  entitiesList: any;
  entityName: any;
  entityNameRendered: any;
  enteredCharCounts = this.lcConstant.enteredCharCounts;
  customerInstructionText = 'customerInstructionText';
  subProductCode: any;
  codeData = new CodeData();
  eventDataArray: any;
  dataArray: any;
  codeID: any;
  curRequest: CurrencyRequest = new CurrencyRequest();
  currency: SelectItem[] = [];
  isoamt = '';
  enteredCurMethod = false;
  iso;
  val;
  flagDecimalPlaces;
  twoDecimal = 2;
  threeDecimal = 3;
  length2 = FccGlobalConstant.LENGTH_2;
  length3 = FccGlobalConstant.LENGTH_3;
  length4 = FccGlobalConstant.LENGTH_4;
  allowedDecimals = -1;
  options = this.lcConstant.options;
  isStaticAccountEnabled: boolean;
  paramDataList: any[] = [];
  customerInstnsLen : any;
  element = 'customerInstructionText';
  customerInstnsRowCount : number;
  allowedCharCount = this.lcConstant.allowedCharCount;
  maxlength = this.lcConstant.maximumlength;
  maxRowCount = this.lcConstant.maxRowCount;
  cols = this.lcConstant.cols;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
    protected router: Router, protected translateService: TranslateService,
    protected formModelService: FormModelService, protected formControlService: FormControlService,
    protected stateService: ProductStateService, protected route: ActivatedRoute,
    public fccGlobalConstantService: FccGlobalConstantService, protected uploadFile: FilelistService,
    protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
    protected corporateCommonService: CorporateCommonService, public phrasesService: PhrasesService,
    protected codeDataService: CodeDataService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected confirmationService: ConfirmationService, protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService, protected resolverService: ResolverService,
    protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
    protected siProductService: SiProductService, protected productMappingService: ProductMappingService,
    protected fileHandlingService: FileHandlingService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, uploadFile,
      dialogRef, currencyConverterPipe, siProductService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.option = this.commonService.getQueryParametersFromKey('option');
    this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.actionReqCode = this.commonService.getQueryParametersFromKey('actionReqCode');
    }
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.initializeFormGroup();
    this.commonService.formatForm(this.form);
    this.iterateFields(FccGlobalConstant.SI_MESSAGE_GENERAL_DETAILS, this.form.controls);
    this.updateNarrativeCount();
    this.renderCurrencyForActionRequired();
  }

  updateNarrativeCount() {
    if (this.form.get(this.customerInstructionText) && this.form.get(this.customerInstructionText).value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get(this.customerInstructionText).value);
      this.form.get(this.customerInstructionText)[this.params][this.enteredCharCounts] = count;
    }
  }

  initializeFormGroup() {
    const sectionName = 'siMessageToBankGeneralDetails';
    this.form = this.stateService.getSectionData(sectionName);
    this.commonService.formatForm(this.form);
    this.prepareExpiryTypes();
    this.form.get('disposalInstructions')[this.params][this.rendered] = false;
    this.form.get('disposalInstructionsvalueSi')[this.params][this.rendered] = false;
    this.form.get('consentResponse')[this.params][this.rendered] = false;
    this.form.get('consentResponsevalue')[this.params][this.rendered] = false;
    if ((this.subTnxTypeCode !== null && this.subTnxTypeCode !== '' && this.subTnxTypeCode !== FccGlobalConstant.N003_SETTLEMENT_REQUEST)
      || this.option === FccGlobalConstant.ACTION_REQUIRED) {
      this.form.get('settlementAmount')[this.params][this.rendered] = false;
      this.form.get('currency')[this.params][this.rendered] = false;
      this.form.get('amt')[this.params][this.rendered] = false;
      this.form.get('forwardContract')[this.params][this.rendered] = false;
      this.form.get('principalAct')[this.params][this.rendered] = false;
      this.form.get('feeAct')[this.params][this.rendered] = false;
      this.form.get('createFromOptions')[this.params][this.rendered] = false;
      this.form.get('amt').clearValidators();
      this.setMandatoryField(this.form, 'amt', false);
      this.form.updateValueAndValidity();
    }
    if (this.option !== FccGlobalConstant.ACTION_REQUIRED && this.mode !== FccGlobalConstant.DISCREPANT && !this.actionReqCode) {
      if (this.subTnxTypeCode === undefined || this.subTnxTypeCode === null || this.subTnxTypeCode === '') {
        this.subTnxTypeCode = FccGlobalConstant.N003_CORRESPONDENCE;
      }
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE), this.subTnxTypeCode, {});
    }
    this.renderedDiscrepantFields();
    this.form.get(FccGlobalConstant.BANK_ATTACHMENT)[this.params][this.rendered] = false;
    this.form.get('bankComments')[this.params][this.rendered] = false;
    this.setActionRequiredFields();
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || (this.mode === FccGlobalConstant.DISCREPANT &&
      this.option === FccGlobalConstant.EXISTING_OPTION) || this.actionReqCode || this.isDiscrepantDraft()) {
      const fileTnxId = ((this.commonService.isNonEmptyField(FccGlobalConstant.PARENT_TNX_ID, this.form) &&
        this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.PARENT_TNX_ID).value) &&
        this.form.get(FccGlobalConstant.PARENT_TNX_ID).value !== '') ? this.form.get(FccGlobalConstant.PARENT_TNX_ID).value : this.tnxId);
      this.fileHandlingService.getTnxFileDetails(fileTnxId).subscribe(
        response1 => {
          if (response1) {
            this.uploadFile.resetBankList();
            for (const values of response1.body.items) {
              if (values.type === 'BANK') {
                this.docId = values.docId;
                this.bankFileModel = new BankFileMap(null, values.fileName, values.title, values.type,
                  this.getFileExtPath(values.fileName), null, this.docId, null, null, null, null,
                  this.commonService.decodeHtml(values.mimeType));
                this.uploadFile.pushBankFile(this.bankFileModel);
                this.patchFieldParameters(this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE), { columns: this.getColumns() });
                this.patchFieldParameters(this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE), { data: this.fileList() });
                this.patchFieldParameters(this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE), { hasData: true });
                this.form.get('bankAttachmentType').setValue(values.type);
                this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE)[this.params][this.rendered] = true;
                this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE).updateValueAndValidity();
                this.form.updateValueAndValidity();
              }
            }
          }
        }
      );
      this.renderedFields();
      this.renderActionRequiredFields();
    }
    this.swiftRenderedFields();
    if (this.form.get(FccGlobalConstant.SI_AMT)) {
      this.form.get(FccGlobalConstant.SI_AMT).setErrors(null);
      this.form.get(FccGlobalConstant.SI_AMT).clearValidators();
      this.form.updateValueAndValidity();
    }
    if (this.form.get(FccGlobalConstant.CURRENCY) && this.form.get(FccGlobalConstant.CURRENCY).value) {
      this.onClickCurrency(this.form.get(FccGlobalConstant.CURRENCY));
    }
    this.commonService.checkSettlementCurAndBaseCur(this.form);
    this.editModeDataPopulate();

    const modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.SI_MESSAGE_GENERAL_DETAILS)
                              .get('transmissionMode').value;
        this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_SI,
          FccGlobalConstant.PARAMETER_P940,).subscribe(responseData => {
            if (responseData) {
              this.paramDataList = responseData.paramDataList;
              if (this.form.get(this.element) && modeOfTransmission === '01') {
              this.swiftModeTransmission();
              this.form.get(this.element).updateValueAndValidity();
              }
              else {
              this.parameterList();
              this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_65;
              this.form.get(this.element)[this.params][this.maxlength] = this.customerInstnsLen;
              this.form.get(this.element)[this.params][this.allowedCharCount] = this.customerInstnsLen;
              // this.form.get(this.element)[this.params][this.maxRowCount] = this.customerInstnsRowCount;
              this.form.get(this.element).updateValueAndValidity();
            }
          }
          });
  }

  parameterList() {
    if (this.paramDataList !== null) {
      this.paramDataList.forEach(element => {
        if (element.data_2 === this.lcConstant.customerInstn ) {
          this.customerInstnsRowCount = Number(element.data_1);
          this.customerInstnsLen = this.customerInstnsRowCount * FccGlobalConstant.LENGTH_65;
        }
      });
      if (this.customerInstnsRowCount === undefined || this.customerInstnsRowCount === null) {
        this.customerInstnsRowCount = FccGlobalConstant.LENGTH_149;
        this.customerInstnsLen = (this.customerInstnsRowCount * FccGlobalConstant.LENGTH_65) + this.customerInstnsRowCount;
        this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_65;
      }
    }
  }

  onBlurCustomerInstructionText() {
    this.updateNarrativeCount();
    this.commonService.validateCustomerInstructionTextAreaCount(this.form);
  }

  onKeyupCustomerInstructionText() {
    this.onBlurCustomerInstructionText();
  }

  onFocusCustomerInstructionText() {
    this.onBlurCustomerInstructionText();
  }

  swiftModeTransmission() {
    // this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_35;
    this.form.get(this.element)[this.params][this.allowedCharCount] = FccGlobalConstant.LENGTH_35 * FccGlobalConstant.LENGTH_50;
    this.form.get(this.element)[this.params][this.maxlength] = FccGlobalConstant.LENGTH_35 * FccGlobalConstant.LENGTH_50;
    this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_50;
  }

  handlecontrolComponentsData(controlData: any){
    if (controlData.has('customerInstructionText')) {
      const event = new KeyboardEvent('keyup');
      controlData.get('customerInstructionText').get('fccCommonTextAreaId').nativeElement.dispatchEvent(event);
    }
  }

  editModeDataPopulate() {
    let parentReference;
    this.commonService.getParentReferenceAsObservable().subscribe(
      (parentRef: string) => {
        parentReference = parentRef;
      }
    );
    const parentRefID = parentReference;
    if (this.commonService.isNonEmptyValue(parentRefID) &&
      this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form) &&
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value !== FccGlobalConstant.EXISTING_SI &&
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value !== FccGlobalConstant.EXISTING_TEMPLATE &&
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value !== FccGlobalConstant.BANK_TEMPLATE) {
      this.initializeFormToDetailsResponse(parentRefID);
    }
  }

  initializeFormToDetailsResponse(response: any) {
    this.transactionDetailService.fetchTransactionDetails(response).subscribe(responseData => {
      const responseObj = responseData.body;
      const siCardControl = this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS) as FCCFormControl;
      const cardData = this.productMappingService.getDetailsOfCardData(responseObj, siCardControl);
      this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.options] = cardData;
      this.form.get(FccGlobalConstant.PARENT_REF).patchValue(response);
      this.form.get(FccTradeFieldConstants.SI_CARD_DETAILS)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
      this.form.get('createFromOptions')[this.params][this.rendered] = false;
      this.form.updateValueAndValidity();
    });
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

  swiftRenderedFields() {
    this.commonService.getSwiftVersionValue();
    if (this.commonService.swiftVersion === FccGlobalConstant.SWIFT_2021) {
      if (this.form.get('expiryType').value &&
        this.form.get('expiryType').value !== FccGlobalConstant.BLANK_SPACE_STRING) {
        this.form.get('expiryType')[this.params][this.rendered] = true;
      } else {
        this.form.get(FccGlobalConstant.EXPIRY_TYPES)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.EXPIRY_TYPE)[this.params][this.rendered] = false;
      }
    } else {
      this.form.get(FccGlobalConstant.EXPIRY_TYPES)[this.params][this.rendered] = false;
      this.form.get('expiryType')[this.params][this.rendered] = false;
    }
  }

  isDiscrepantDraft(): boolean {
    return (this.mode === FccGlobalConstant.DRAFT_OPTION && (this.subTnxTypeCode === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_08 ||
      this.subTnxTypeCode === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_09));
  }

  renderedDiscrepantFields() {
    if ((this.mode && this.mode === FccGlobalConstant.DISCREPANT) || (this.subTnxTypeCode &&
      this.subTnxTypeCode === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_08 ||
      this.subTnxTypeCode === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_09)) {
      this.form.get('disposalInstructions')[this.params][this.rendered] = true;
      this.form.get('disposalInstructionsvalueSi')[this.params][this.rendered] = true;
      if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
        this.patchFieldValueAndParameters(this.form.get('disposalInstructionsvalueSi'),
          this.subTnxTypeCode, {});
      }
      this.onClickDisposalInstructionsvalueSi();
      if (this.commonService.isnonEMptyString(this.form.get('claimPresentationDate').value)) {
        this.form.get('claimPresentationDate')[this.params][this.rendered] = true;
      } else {
        this.getBoReleaseDateValue();
      }
      if (this.commonService.isnonEMptyString(this.form.get('claimAmount').value) &&
      this.commonService.isnonEMptyString(this.form.get('claimCurrencyCode').value)) {
        this.form.get('docAmountValue')[this.params][this.rendered] = false;
        this.setCurrencyAndAmountField('claimAmount','claimCurrencyCode','claimAmountValue');
      } else {
        this.setCurrencyAndAmountField('docAmount', 'docCurCode', 'docAmountValue');
      }
    }
  }

  renderedFields() {
    if (this.form.get('bankComments').value && this.form.get('bankComments').value !== FccGlobalConstant.BLANK_SPACE_STRING) {
      this.form.get('bankComments')[this.params][this.rendered] = true;
    }
  }

  renderedDraftFields() {
    if (this.mode === 'DRAFT') {
      this.patchFieldValueAndParameters(this.form.get('consentResponsevalue'), this.subTnxTypeCode, {});
      this.form.updateValueAndValidity();
    }
  }

  onFocusConsentResponsevalue_46() {
    this.patchFieldValueAndParameters(this.form.get('consentResponsevalue'), FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK, {});
    this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
      FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK, {});
    const constentResponseValue = this.form.get('consentResponsevalue').value;
    if (this.commonService.currentStateTnxResponse.prod_stat_code === FccGlobalConstant.N005_WORDING_UNDER_REVIEW ||
      this.commonService.currentStateTnxResponse.prod_stat_code === FccGlobalConstant.N005_FINAL_WORDING) {
      if (constentResponseValue && constentResponseValue === FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
          FccGlobalConstant.N003_WORDING_ACK, {});
      }
    }
  }

  onFocusConsentResponsevalue_47() {
    this.patchFieldValueAndParameters(this.form.get('consentResponsevalue'), FccGlobalConstant.N003_AMENDMENT_ADVICE_NACK, {});
    this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
      FccGlobalConstant.N003_AMENDMENT_ADVICE_NACK, {});
    const constentResponseValue = this.form.get('consentResponsevalue').value;
    if (this.commonService.currentStateTnxResponse.prod_stat_code === FccGlobalConstant.N005_WORDING_UNDER_REVIEW ||
      this.commonService.currentStateTnxResponse.prod_stat_code === FccGlobalConstant.N005_FINAL_WORDING) {
      if (constentResponseValue && constentResponseValue === FccGlobalConstant.N003_AMENDMENT_ADVICE_NACK) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
          FccGlobalConstant.N003_WORDING_NACK, {});
      }
    }
  }

  onClickDisposalInstructionsvalueSi() {
    if (this.form.get('disposalInstructionsvalueSi').value === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_08) {
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_08, {});
    } else if (this.form.get('disposalInstructionsvalueSi').value === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_09) {
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_09, {});
    }
  }

  setActionRequiredFields() {
    this.transactionDetailService.fetchTransactionDetails(
      this.commonService.eventId ? this.commonService.eventId : this.tnxId, this.productCode).subscribe(response => {
        const responseObj = response.body;
        if (responseObj) {
          const actionReqCode = this.commonService.getQueryParametersFromKey('actionReqCode');
          if (this.option === FccGlobalConstant.ACTION_REQUIRED || (actionReqCode !== undefined && actionReqCode !== null)) {
            const actionRequiredCode = responseObj.action_req_code;
            if (actionRequiredCode === FccGlobalConstant.ACTION_REQUIRED_05
              || actionRequiredCode === FccGlobalConstant.ACTION_REQUIRED_99
              || actionRequiredCode === FccGlobalConstant.ACTION_REQUIRED_07
              || actionRequiredCode === FccGlobalConstant.ACTION_REQUIRED_15) {
              this.form.get('consentResponse')[this.params][this.rendered] = true;
              this.form.get('consentResponsevalue')[this.params][this.rendered] = true;
            } else {
              this.form.get('consentResponse')[this.params][this.rendered] = false;
              this.form.get('consentResponsevalue')[this.params][this.rendered] = false;
            }
          } else if (responseObj.tnx_amt &&
            !(this.option === FccGlobalConstant.EXISTING_OPTION && this.subTnxTypeCode === FccGlobalConstant.N003_SETTLEMENT_REQUEST)) {
            this.claimAmt = responseObj.tnx_amt;
            this.form.get(FccGlobalConstant.SI_AMT).setValue(this.claimAmt);
          }
        }
      });
  }

  onClickDownloadIcon(event, key, index) {
    const id = this.fileList()[index].attachmentId;
    const fileName = this.fileList()[index].fileName;
    this.commonService.downloadAttachments(id).subscribe(
      response => {
        let fileType;
        if (response.type) {
          fileType = response.type;
        } else {
          fileType = 'application/octet-stream';
        }
        const newBlob = new Blob([response.body], { type: fileType });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob, fileName);
          return;
        }

        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = fileName;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        window.URL.revokeObjectURL(data);
        link.remove();
      });
  }

  getFileExtPath(fileName: string) {
    const fileExtn = fileName.split('.').pop().toLowerCase();
    const path = `${this.contextPath}`;
    const imgSrcStartTag = '<img src="';
    const endTag = '"/>';
    const pdfFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.PDF_IMG_PATH).concat(endTag);
    const docFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.DOC_IMG_PATH).concat(endTag);
    const xlsFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.XLS_IMG_PATH).concat(endTag);
    const xlsxFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.XLSX_IMG_PATH).concat(endTag);
    const pngFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.PNG_IMG_PATH).concat(endTag);
    const jpgFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.JPG_IMG_PATH).concat(endTag);
    const txtFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.TXT_IMG_PATH).concat(endTag);
    const zipFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.ZIP_IMG_PATH).concat(endTag);
    const rtgFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.RTF_IMG_PATH).concat(endTag);
    const csvFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.CSV_IMG_PATH).concat(endTag);
    switch (fileExtn) {
      case 'pdf':
        return pdfFilePath;
      case 'docx':
      case 'doc':
        return docFilePath;
      case 'xls':
        return xlsFilePath;
      case 'xlsx':
        return xlsxFilePath;
      case 'png':
        return pngFilePath;
      case 'jpg':
        return jpgFilePath;
      case 'jpeg':
        return jpgFilePath;
      case 'txt':
        return txtFilePath;
      case 'zip':
        return zipFilePath;
      case 'rtf':
        return rtgFilePath;
      case 'csv':
        return csvFilePath;
      default:
        return fileExtn;
    }
  }

  getColumns() {
    this.tableColumns = [
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
      }];
    return this.tableColumns;
  }


  fileList() {
    return this.uploadFile.getBankList();
  }

  /*validation on change of currency field*/
  onClickCurrency(event) {
    this.form.get(FccGlobalConstant.SI_AMT).clearValidators();
    if (event.value !== undefined) {
      this.enteredCurMethod = true;
      this.iso = event.value;
      this.isoamt = this.iso;
      const amt = this.form.get(FccGlobalConstant.SI_AMT);
      this.val = amt.value;
      this.setMandatoryField(this.form, FccGlobalConstant.SI_AMT, true);
      this.flagDecimalPlaces = 0;
      if (this.val !== '' && this.commonService.isNonEmptyValue(this.val)) {
        if (this.val <= 0) {
          this.form.get(FccGlobalConstant.SI_AMT).setErrors({ amountCanNotBeZero: true });
          return;
        } else {
          let valueupdated = this.commonService.replaceCurrency(this.val);
          valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
          this.form.get(FccGlobalConstant.SI_AMT).setValue(valueupdated);
        }
      } else {
        this.form.get(FccGlobalConstant.SI_AMT).setErrors({ required: true });
      }
      this.form.get(FccGlobalConstant.SI_AMT).updateValueAndValidity();
    }
  }

  /*validation on change of amount field*/
  onBlurAmt() {
    this.form.get(FccGlobalConstant.SI_AMT).clearValidators();
    const amt = this.form.get(FccGlobalConstant.SI_AMT);
    this.val = amt.value;
    if (this.val !== '' && this.commonService.isNonEmptyValue(this.val)) {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get(FccGlobalConstant.SI_AMT).setValidators(emptyCurrency);
      }
      this.form.addFCCValidators(FccGlobalConstant.SI_AMT,
        Validators.compose([Validators.required, Validators.pattern(this.commonService.getRegexBasedOnlanguage())]), 0);
      this.allowedDecimals = FccGlobalConstant.LENGTH_0;
      if (this.iso !== '' && this.commonService.isNonEmptyValue(this.iso)) {
        let valueupdated = this.commonService.replaceCurrency(this.val);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
        this.form.get(FccGlobalConstant.SI_AMT).setValue(valueupdated);
        this.amountValidation();
      }
      this.form.get(FccGlobalConstant.SI_AMT).updateValueAndValidity();
      const amount = parseFloat(this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.SI_AMT).value));
      const tnxAmt = parseFloat(this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.AMOUNT_FIELD).value));
      if ((amount && tnxAmt) && (amount > tnxAmt)) {
        this.form.get(FccGlobalConstant.SI_AMT).setErrors({ settlementAmtLessThanLCAmt: true });
      }
      this.form.get('tnxAmt').setValue(amount);
      this.form.updateValueAndValidity();
    }
  }

  amountValidation() {
    const transferAmt = this.form.get(FccGlobalConstant.SI_AMT).value;
    const transferAmtFloatValue = parseFloat(this.commonService.replaceCurrency(transferAmt));
    if (transferAmtFloatValue === 0) {
      this.form.get(FccGlobalConstant.SI_AMT).clearValidators();
      this.form.addFCCValidators('amt',
        Validators.compose([Validators.required, zeroAmount]), 0);
      this.form.get(FccGlobalConstant.SI_AMT).setErrors({ zeroAmount: true });
      this.form.get(FccGlobalConstant.SI_AMT).markAsDirty();
      this.form.get(FccGlobalConstant.SI_AMT).markAsTouched();
      this.form.get(FccGlobalConstant.SI_AMT).updateValueAndValidity();
    }
  }

  updateBankValue() {
    if ((this.form.get('principalAct') && this.form.get('principalAct').value) ||
      (this.form.get('feeAct') && this.form.get('feeAct').value)) {
      const principalAct = this.form.get('principalAct').value;
      const feeAct = this.form.get('feeAct').value;
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

  updateValue() {
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
    this.accounts = [];
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
      this.accountDetailsList.items.forEach(value => {
        if (emptyCheck) {
          const empty = this.commonService.getEmptyAccount();
          this.accounts.push(empty);
          emptyCheck = false;
        }
        if (value.entityShortName === '*') {
          const account = this.commonService.getUpdatedAccount(value);
          this.accounts.push(account);
        }
      });
      this.patchFieldParameters(this.form.get('principalAct'), { options: this.getUpdatedAccounts() });
      this.patchFieldParameters(this.form.get('feeAct'), { options: this.getUpdatedAccounts() });
    } else {
      this.accountDetailsList.items.forEach(value => {
        if (emptyCheck) {
          const empty = this.commonService.getEmptyAccount();
          this.accounts.push(empty);
          emptyCheck = false;
        }
        const account = this.commonService.getUpdatedAccount(value);
        this.accounts.push(account);
      });
      this.patchFieldParameters(this.form.get('principalAct'), { options: this.getUpdatedAccounts() });
      this.patchFieldParameters(this.form.get('feeAct'), { options: this.getUpdatedAccounts() });


    }
    if (this.entityName === undefined) {
      this.patchFieldParameters(this.form.get('principalAct'), { options: [] });
      this.patchFieldParameters(this.form.get('feeAct'), { options: [] });
    }
    this.updateBankValue();
    this.updateValue();

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
      if (myvalue[key].key === FccGlobalConstant.APPLICANT_MESSAGE_ENTITY) {
        this.entityName = myvalue[key].value;
        this.entityNameRendered = myvalue[key].params.rendered;

      }
    });
    this.getAccounts();
  }

  getUpdatedAccounts(): any[] {
    return this.accounts;
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key);
  }

  saveFormOject() {
    this.stateService.setStateSection('siMessageToBankGeneralDetails', this.form);
  }

  renderActionRequiredFields() {
    if (this.commonService.isNonEmptyField('bankComments', this.form) &&
      this.form.get('bankComments').value !== FccGlobalConstant.BLANK_SPACE_STRING) {
      this.form.get('bankComments')[this.params][this.rendered] = true;
    }
    if (this.commonService.isNonEmptyField('consentResponsevalue', this.form) &&
      (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode)) {
      this.form.get('consentResponse')[this.params][this.rendered] = true;
      this.form.get('consentResponsevalue')[this.params][this.rendered] = true;
      if (this.form.get('consentResponsevalue').value === FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK) {
        this.onFocusConsentResponsevalue_46();
      } else if (this.form.get('consentResponsevalue').value === FccGlobalConstant.N003_AMENDMENT_ADVICE_NACK) {
        this.onFocusConsentResponsevalue_47();
      } else {
        this.onFocusConsentResponsevalue_46();
      }
      this.renderedDraftFields();
    }
  }
  renderCurrencyForActionRequired() {
    if ((this.mode === 'DISCREPANT' && this.option === 'EXISTING') || (this.option === 'ACTION_REQUIRED')) {
      this.form.get(FccGlobalConstant.CURRENCY)[this.params][this.rendered] = false;
    }
  }
}
