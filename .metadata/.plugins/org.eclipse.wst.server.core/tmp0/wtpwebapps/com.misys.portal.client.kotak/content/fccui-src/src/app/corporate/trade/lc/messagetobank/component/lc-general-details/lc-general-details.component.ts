import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { Component, EventEmitter,ElementRef, OnInit, Output, OnDestroy,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Validators } from '@angular/forms';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FCCFormControl, FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LeftSectionService } from '../../../../../../corporate/common/services/leftSection.service';
import { LcConstant } from '../../../common/model/constant';
import { ProductStateService } from '../../../common/services/product-state.service';
import { SaveDraftService } from '../../../common/services/save-draft.service';
import { CurrencyConverterPipe } from '../../../initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../initiation/pipes/custom-commas-in-currencies.pipe';
import { BankFileMap } from '../../../initiation/services/bankmfile';
import { FilelistService } from '../../../initiation/services/filelist.service';
import { FormControlService } from '../../../initiation/services/form-control.service';
import { PrevNextService } from '../../../initiation/services/prev-next.service';
import { UtilityService } from '../../../initiation/services/utility.service';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { AccountDetailsList } from './../../../../../../common/model/accountDetailsList';
import { CommonService } from './../../../../../../common/services/common.service';
import { TransactionDetailService } from './../../../../../../common/services/transactionDetail.service';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { LcProductComponent } from './../../../initiation/component/lc-product/lc-product.component';
import { PhrasesService } from './../../../../../../common/services/phrases.service';
import { LcProductService } from '../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { ProductMappingService } from './../../../../../../common/services/productMapping.service';
import { FileHandlingService } from '../../../../../../common/services/file-handling.service';
@Component({
  selector: 'app-lc-general-details',
  templateUrl: './lc-general-details.component.html',
  styleUrls: ['./lc-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LcGeneralDetailsComponent }]
})
export class LcGeneralDetailsComponent extends LcProductComponent implements OnInit, OnDestroy {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  @ViewChild('fccCommonTextArea') public fccCommonTextAreaId: ElementRef;
  option: any;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  module = `${this.translateService.instant('lcgeneralDetails')}`;
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
  settlementAmountWithCurrency = 'settlementAmountWithCurrency';
  iso: any;
  options = this.lcConstant.options;
  isStaticAccountEnabled: boolean;
  paramDataList: any[] = [];
  customerInstnsLen : any;
  element = 'customerInstructionText';
  allowedCharCount = this.lcConstant.allowedCharCount;
  maxRowCount = this.lcConstant.maxRowCount;
  customerInstnsRowCount : number;
  maxLength = this.lcConstant.maximumlength;
  cols = this.lcConstant.cols;
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;


  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService,
              protected prevNextService: PrevNextService, protected utilityService: UtilityService,
              protected elementRef: ElementRef,
              protected saveDraftService: SaveDraftService, protected searchLayoutService: SearchLayoutService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected stateService: ProductStateService, protected route: ActivatedRoute,
              public fccGlobalConstantService: FccGlobalConstantService, public uploadFile: FilelistService,
              protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
              protected corporateCommonService: CorporateCommonService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected resolverService: ResolverService,
              protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
              public phrasesService: PhrasesService, protected lcProductService: LcProductService,
              protected productMappingService: ProductMappingService,
              protected fileHandlingService: FileHandlingService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, uploadFile, dialogRef, currencyConverterPipe, lcProductService);
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
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.actionReqCode = this.commonService.getQueryParametersFromKey('actionReqCode');
    }
    this.initializeFormGroup();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
      }
    });
    this.iterateFields(FccGlobalConstant.LC_MESSAGE_GENERAL_DETAILS, this.form.controls);
    this.updateNarrativeCount();
    this.iso = this.stateService.getValue(FccGlobalConstant.LC_MESSAGE_GENERAL_DETAILS, 'currency', false);
    if (this.form.get(this.settlementAmountWithCurrency)) {
    this.form.get(this.settlementAmountWithCurrency)[this.params][this.rendered] = false;
    }
    if (this.subTnxTypeCode === FccGlobalConstant.N003_SETTLEMENT_REQUEST) {
      this.onBlurAmt();
    }
  }

  updateNarrativeCount() {
    if (this.form.get(this.customerInstructionText) && this.form.get(this.customerInstructionText).value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get(this.customerInstructionText).value);
      this.form.get(this.customerInstructionText)[this.params][this.enteredCharCounts] = count;
    }
  }

  initializeFormGroup() {
    const sectionName = 'lcgeneralDetails';
    this.form = this.stateService.getSectionData(sectionName);
    this.commonService.formatForm(this.form);
    this.form.get('disposalInstructions')[this.params][this.rendered] = false;
    this.form.get('disposalInstructionsvalue')[this.params][this.rendered] = false;
    this.form.get('consentResponse')[this.params][this.rendered] = false;
    this.form.get('consentResponsevalue')[this.params][this.rendered] = false;
    if (this.form.get(FccTradeFieldConstants.CLAIM_REFERENCE)){
      this.form.get(FccTradeFieldConstants.CLAIM_REFERENCE)[this.params][this.rendered] = false;
    }
    if (this.form.get(FccTradeFieldConstants.CLAIM_PRESENT_DATE)){
      this.form.get(FccTradeFieldConstants.CLAIM_PRESENT_DATE)[this.params][this.rendered] = false;
    }
    if (this.form.get(FccTradeFieldConstants.CLAIM_AMT_VAL)){
      this.form.get(FccTradeFieldConstants.CLAIM_AMT_VAL)[this.params][this.rendered] = false;
    }
    if ((this.subTnxTypeCode !== null && this.subTnxTypeCode !== '' && this.subTnxTypeCode !== FccGlobalConstant.N003_SETTLEMENT_REQUEST)
      || this.option === FccGlobalConstant.ACTION_REQUIRED) {
      this.form.get('settlementAmount')[this.params][this.rendered] = false;
      this.form.get('currency')[this.params][this.rendered] = false;
      this.form.get('amt')[this.params][this.rendered] = false;
      this.form.get('forwardContract')[this.params][this.rendered] = false;
      this.form.get('principalAct')[this.params][this.rendered] = false;
      this.form.get('feeAct')[this.params][this.rendered] = false;
      this.form.updateValueAndValidity();
      this.form.get('amt').clearValidators();
      this.setMandatoryField(this.form, 'amt', false);
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
        this.fileHandlingService.getTnxFileDetails(fileTnxId ).subscribe(
          response1 => {
            if (response1 && response1.body && response1.body.items) {
              this.uploadFile.resetBankList();
              for (const values of response1.body.items) {
                if ( values.type === 'BANK') {
                  this.docId = values.docId;
                  this.bankFileModel = new BankFileMap(null, values.fileName, values.title, values.type,
                    this.getFileExtPath(values.fileName), null, this.docId, null, null, null, null,
                    this.commonService.decodeHtml(values.mimeType));
                  this.uploadFile.pushBankFile(this.bankFileModel);
                  this.patchFieldParameters(this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE), { columns: this.getColumns() });
                  this.patchFieldParameters(this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE), { data: this.fileList() });
                  this.patchFieldParameters(this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE), { hasData: true });
                  this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE)[this.params][this.rendered] = true;
                  this.form.get('bankAttachmentType').setValue(values.type);
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
        const modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.LC_MESSAGE_GENERAL_DETAILS)
                                   .get('transmissionMode').value;
        this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_LC,
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
              this.form.get(this.element)[this.params][this.maxLength] = this.customerInstnsLen;
              this.form.get(this.element)[this.params][this.allowedCharCount] = this.customerInstnsLen;
              // this.form.get(this.element)[this.params][this.maxRowCount] = this.customerInstnsRowCount;
              this.form.get(this.element).updateValueAndValidity();
            }
          }
          });

    this.editModeDataPopulate();
    this.commonService.checkSettlementCurAndBaseCur(this.form);
  }

  editModeDataPopulate() {
    let parentReference;
    this.commonService.getParentReferenceAsObservable().subscribe(
      (parentRef: string) => {
        parentReference = parentRef;
      }
    );
    const parentRefID = parentReference;
    if (this.commonService.isNonEmptyValue(parentRefID)) {
      this.initializeFormToDetailsResponse(parentRefID);
    }
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
    this.form.get(this.element)[this.params][this.maxLength] = FccGlobalConstant.LENGTH_35 * FccGlobalConstant.LENGTH_50;
    this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_50;
  }

  handlecontrolComponentsData(controlData: any){
    if (controlData.has('customerInstructionText')) {
      const event = new KeyboardEvent('keyup');
      controlData.get('customerInstructionText').get('fccCommonTextAreaId').nativeElement.dispatchEvent(event);
    }
  }

  initializeFormToDetailsResponse(response: any) {
    response && this.transactionDetailService.fetchTransactionDetails(response).subscribe(responseData => {
      const responseObj = responseData.body;
      const liCardControl = this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS) as FCCFormControl;
      const cardData = this.productMappingService.getDetailsOfCardData(responseObj, liCardControl);
      this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.options] = cardData;
      this.form.get(FccGlobalConstant.PARENT_REF).patchValue(response);
      this.form.get(FccTradeFieldConstants.LC_CARD_DETAILS)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.BACK_TO_BACK_LC_TOGGLE)[this.params][this.rendered] = false;
      this.form.updateValueAndValidity();
    });
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
    this.form.get('disposalInstructionsvalue')[this.params][this.rendered] = true;
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.patchFieldValueAndParameters(this.form.get('disposalInstructionsvalue'),
      this.subTnxTypeCode, {});
    }
    this.onClickDisposalInstructionsvalue();
    const reportingStatusField = this.form.get(FccTradeFieldConstants.REPORTING_STATUS);
    if (reportingStatusField && reportingStatusField.value && (reportingStatusField.value === FccGlobalConstant.PROD_STAT_CODE_CLAIM
      || this.mode === FccGlobalConstant.DISCREPANT)) {
      const claimRefField = this.form.get(FccTradeFieldConstants.CLAIM_REFERENCE);
      if (claimRefField && this.commonService.isnonEMptyString(claimRefField.value)) {
        claimRefField[this.params][this.rendered] = true;
      }
      const claimPresentDateField = this.form.get(FccTradeFieldConstants.CLAIM_PRESENT_DATE);
      if (claimPresentDateField && this.commonService.isnonEMptyString(claimPresentDateField.value)) {
        claimPresentDateField[this.params][this.rendered] = true;
      } else {
        this.getBoReleaseDateValue();
      }
      const claimAmtField = this.form.get('claimAmount');
      const claimCurCodeField = this.form.get('claimCurrencyCode');
      if (claimAmtField && this.commonService.isnonEMptyString(claimAmtField.value) &&
      claimCurCodeField && this.commonService.isnonEMptyString(claimCurCodeField.value)) {
        this.form.get(FccTradeFieldConstants.CLAIM_AMT_VAL)[this.params][this.rendered] = true;
        this.form.get('docAmountValue')[this.params][this.rendered] = false;
        const claimAmtValue = claimCurCodeField.value.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(claimAmtField.value);
        this.form.get(FccTradeFieldConstants.CLAIM_AMT_VAL).setValue(claimAmtValue);
      } else {
        this.setCurrencyAndAmountField('docAmount', 'docCurCode', 'docAmountValue');
      }
    }


  }
  }

  renderedFields() {
    if (this.form.get('bankComments').value && this.form.get('bankComments').value !== FccGlobalConstant.BLANK_SPACE_STRING) {
      this.form.get('bankComments')[this.params][this.rendered] = true;
    }else if (this.form.get('parentBankComment') && this.form.get('parentBankComment').value
    && this.form.get('parentBankComment').value !== FccGlobalConstant.BLANK_SPACE_STRING) {
      this.form.get('bankComments').patchValue(this.form.get('parentBankComment').value);
    }
  }

  onClickConsentResponseValue() {
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
      const constentResponseValue = this.form.get('consentResponsevalue').value;
      if (constentResponseValue && constentResponseValue === FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
      FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK, {});
      } else {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.N003_AMENDMENT_ADVICE_NACK, {});
      }
      if (this.commonService.currentStateTnxResponse.prod_stat_code === FccGlobalConstant.N005_WORDING_UNDER_REVIEW ||
      this.commonService.currentStateTnxResponse.prod_stat_code === FccGlobalConstant.N005_FINAL_WORDING) {
        if (constentResponseValue && constentResponseValue === FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK) {
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.N003_WORDING_ACK, {});
        } else {
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
          FccGlobalConstant.N003_WORDING_NACK, {});
        }
      }
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

  onClickDisposalInstructionsvalue() {
    if (this.form.get('disposalInstructionsvalue').value === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_08) {
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
    FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_08, {});
    } else if (this.form.get('disposalInstructionsvalue').value === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_09) {
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
    FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_09, {});
    }
  }

  setActionRequiredFields() {
    const eventId = this.commonService.eventId ? this.commonService.eventId : this.tnxId;
    eventId && this.transactionDetailService.fetchTransactionDetails(
      eventId, this.productCode).subscribe(response => {
        const responseObj = response.body;
        if (responseObj) {
          const actionReqCode = this.commonService.getQueryParametersFromKey('actionReqCode');
          if (responseObj.bo_comment && !this.commonService.isEmptyValue(responseObj.bo_comment.text)) {
            this.form.get('bankComments').setValue(responseObj.bo_comment.text);
          }
          if (this.option === FccGlobalConstant.ACTION_REQUIRED || (actionReqCode !== undefined && actionReqCode !== null)) {
            const actionRequiredCode = responseObj.action_req_code;
            if (actionRequiredCode === FccGlobalConstant.ACTION_REQUIRED_05 || actionRequiredCode === FccGlobalConstant.ACTION_REQUIRED_99
            || actionRequiredCode === FccGlobalConstant.ACTION_REQUIRED_07 || actionRequiredCode === FccGlobalConstant.ACTION_REQUIRED_15){
              this.form.get('consentResponse')[this.params][this.rendered] = true;
              this.form.get('consentResponsevalue')[this.params][this.rendered] = true;
            } else {
              this.form.get('consentResponse')[this.params][this.rendered] = false;
              this.form.get('consentResponsevalue')[this.params][this.rendered] = false;
            }
            if (actionRequiredCode === FccGlobalConstant.N002_AMEND || (actionRequiredCode === FccGlobalConstant.ACTION_REQUIRED_99 && 
              this.form.get('reportingStatus').value === FccGlobalConstant.N005_PART_SIGHT_PAID)) {
              this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE), '', {});
            }
          }else if (responseObj.tnx_amt &&
            !(this.option === FccGlobalConstant.EXISTING_OPTION && this.subTnxTypeCode === FccGlobalConstant.N003_SETTLEMENT_REQUEST)) {
           this.claimAmt = responseObj.tnx_amt;
           this.form.get('amt').setValue(this.claimAmt);
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
  const rarFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.RAR_IMG_PATH).concat(endTag);
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
    case 'rar':
      return rarFilePath;
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

onBlurAmt() {
  if(this.nonNumericCurrencyValidator){
    this.form.get('amt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    if(!this.commonService.isValidAmountValue(this.form, 'amt',
      this.form.get('amt').value, this.iso,
      this.currencyDecimalplacesZero,
      this.currencyDecimalplacesThree)){
      return;
    }
  }
  const amtform = this.commonService.replaceCurrency(this.form.get('amt').value);
  const amount = parseFloat(amtform);
  const tnxAmt = parseFloat(this.commonService.replaceCurrency(this.form.get('amount').value));
  if ((amount && tnxAmt) && (amount > tnxAmt) ) {
    const validationError = { settlementAmtLessThanTnxAmt:true };
    this.form.get('amt').clearValidators();
    this.form.addFCCValidators('amt', Validators.compose([() =>validationError]), 0);
    this.form.get('amt').updateValueAndValidity();
   //this.form.get('amt').setErrors({ settlementAmtLessThanLCAmt: true });
  } else{
    if(this.commonService.isNonEmptyValue(amtform) && amtform !== '' && this.iso !== ''){
      this.form.get('amt').setValue(this.currencyConverterPipe.transform(amtform.toString(), this.iso));
    }
    const settlementAmt = this.currencyConverterPipe.transform(amtform, this.iso);
    if (this.form.get('settlementAmountWithCurrency')) {
      this.form.get(this.settlementAmountWithCurrency).setValue(this.iso.concat(' ').concat(settlementAmt));
    }
    this.form.get('amt').clearValidators();
    this.form.get('amt').updateValueAndValidity();
  }
  if (isNaN(amount)) {
    this.form.get('tnxAmt').setValue("");
  } else {
    this.form.get('tnxAmt').setValue(this.currencyConverterPipe.transform(amtform.toString(), this.iso));
  }

}

saveFormOject() {
  this.stateService.setStateSection('lcgeneralDetails', this.form);
}

onClickNext() {
  this.saveFormOject();
  if (!CommonService.isTemplateCreation) {

    this.leftSectionService.addSummarySection();
    this.saveDraftService.changeSaveStatus('lcgeneralDetails',
      this.stateService.getSectionData('lcgeneralDetails'));
  }
  if (this.form.valid && !CommonService.isTemplateCreation) {
    this.leftSectionService.addSummarySection();
  }

  if (this.form.invalid) {
    this.leftSectionService.removeSummarySection();
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
  this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LC, key);
}

ngOnDestroy() {
  if(this.nonNumericCurrencyValidator &&
    this.commonService.isNonEmptyValue(this.form.get('amt').value)){
    this.form.get('amt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    if(!this.commonService.isValidAmountValue(this.form, 'amt',
      this.form.get('amt').value, this.iso,
      this.currencyDecimalplacesZero,
      this.currencyDecimalplacesThree)){
      return;
    }
  }
  if (this.form.get(this.settlementAmountWithCurrency) &&
  (this.form.get(this.settlementAmountWithCurrency).value !== '' && this.form.get(this.settlementAmountWithCurrency).value !== null)) {
    this.form.get(this.settlementAmountWithCurrency)[this.params][this.rendered] = true;
  }
  this.stateService.setStateSection('lcgeneralDetails', this.form);
}

}
