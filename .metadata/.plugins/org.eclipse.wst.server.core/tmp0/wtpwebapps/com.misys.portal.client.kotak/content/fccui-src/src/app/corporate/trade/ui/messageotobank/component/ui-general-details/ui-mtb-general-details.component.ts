import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { AccountDetailsList } from '../../../../../../common/model/accountDetailsList';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import { CorporateCommonService } from '../../../../../common/services/common.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { LcConstant } from '../../../../lc/common/model/constant';
import { ProductStateService } from '../../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../../lc/common/services/save-draft.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { BankFileMap } from '../../../../lc/initiation/services/bankmfile';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../../lc/initiation/services/form-control.service';
import { PrevNextService } from '../../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { validateSettlementAmount } from '../../../common/validators/ui-validators';
import { UiProductComponent } from '../../../initiation/component/ui-product/ui-product.component';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import {
  zeroAmount
} from './../../../../../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { CurrencyConverterPipe } from '../../../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FileHandlingService } from '../../../../../../common/services/file-handling.service';

@Component({
  selector: 'app-ui-mtb-general-details',
  templateUrl: './ui-mtb-general-details.component.html',
  styleUrls: ['../../../../lc/messagetobank/component/lc-general-details/lc-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiMTBGeneralDetailsComponent }]
})
export class UiMTBGeneralDetailsComponent extends UiProductComponent implements OnInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  @ViewChild('fccCommonTextArea') public fccCommonTextAreaId: ElementRef;
  option: any;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  module = `${this.translateService.instant('uiTransactionBrief')}`;
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
  prodStatusCode: any;
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
  parentTnxData: any;
  enteredCharCount = 'enteredCharCount';
  allowedCharCount = this.lcConstant.allowedCharCount;
  maxlength = this.lcConstant.maximumlength;
  maxRowCount = this.lcConstant.maxRowCount;
  cols = this.lcConstant.cols;
  swiftXChar;
  isStaticAccountEnabled: boolean;
  paramDataList: any[] = [];
  customerInstnsLen : any;
  element = 'customerInstructionText';
  customerInstnsRowCount : number;


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
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected phrasesService: PhrasesService, protected uiProductService: UiProductService,
              protected fileHandlingService: FileHandlingService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, uiProductService);
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
    if(this.subTnxTypeCode === FccGlobalConstant.N003_SETTLEMENT_REQUEST && this.mode === FccGlobalConstant.DRAFT_OPTION){
      this.displaySettlementAmountFields();
      if(this.form.get('purposeUI').value === '01'){
      this.form.get('bgCurCode')[this.params][this.rendered] = true;
      this.form.get('cuCurCode')[this.params][this.rendered] = false;
      }
   }
    this.iterateFields(FccGlobalConstant.UI_MESSAGE_GENERAL_DETAILS, this.form.controls);
    this.updateNarrativeCount();
    this.setNarrativeLength();
    this.form.get('consentExtendResponsePreview')[this.params][this.rendered] = false;
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_BG, key, '', true);
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

  updateDraftDetails() {
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode)) {
      const consentTnxs = [FccGlobalConstant.SUB_TNX_TYPE_ACCEPT, FccGlobalConstant.SUB_TNX_TYPE_REJECT];
      const extendTxns = [FccGlobalConstant.SUB_TNX_TYPE_EXTEND, FccGlobalConstant.SUB_TNX_TYPE_PAY];
      const amdRespTypes = [FccGlobalConstant.SUB_TNX_TYPE_AMD_BENE_ACCEPT, FccGlobalConstant.SUB_TNX_TYPE_AMD_BENE_REJECT];
      const subtnxtype = this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE).value;
      if (subtnxtype && extendTxns.indexOf(subtnxtype) > -1) {
        this.form.get('consentResponsevalue').setValue(FccGlobalConstant.SUB_TNX_TYPE_ACCEPT);
        this.form.get('extendResponseValue').setValue(subtnxtype);
      } else if (subtnxtype && consentTnxs.indexOf(subtnxtype) > -1
      && this.form.get('consentResponsevalue')[this.params][this.rendered] === true) {
        this.form.get('consentResponsevalue').setValue(subtnxtype);
      } else if (subtnxtype && consentTnxs.indexOf(subtnxtype) > -1
      && this.form.get('paymentResponseValue')[this.params][this.rendered] === true) {
        this.form.get('paymentResponseValue').setValue(subtnxtype);
      } else if (subtnxtype && amdRespTypes.indexOf(subtnxtype) > -1
      && this.form.get('billofAdviceResponseValue')[this.params][this.rendered] === true){
        this.form.get('billofAdviceResponseValue').setValue(subtnxtype);
      } else if (subtnxtype && amdRespTypes.indexOf(subtnxtype) > -1
      && this.form.get('amendmentResponsevalue')[this.params][this.rendered] === true){
        this.form.get('amendmentResponsevalue').setValue(subtnxtype);
      } else if (subtnxtype && amdRespTypes.indexOf(subtnxtype) > -1
      && this.form.get('wordingResponseValue')[this.params][this.rendered] === true){
        this.form.get('wordingResponseValue').setValue(subtnxtype);
      }
    }
    this.onClickAmendmentResponsevalue();
    this.onClickPaymentResponseValue();
    this.handleConsentResponseValue();
    this.onClickWordingResponseValue();
    this.onClickBillofAdviceResponseValue();
  }

  updateNarrativeCount() {
    if (this.form.get(this.customerInstructionText) && this.form.get(this.customerInstructionText).value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get(this.customerInstructionText).value);
      this.form.get(this.customerInstructionText)[this.params][this.enteredCharCounts] = count;
    }
  }

  initializeFormGroup() {
    const sectionName = 'uiTransactionBrief';
    this.form = this.stateService.getSectionData(sectionName);
    this.commonService.formatForm(this.form);
    this.form.get('disposalInstructionsUi')[this.params][this.rendered] = false;
    this.form.get('disposalInstructionsvalueUi')[this.params][this.rendered] = false;
    this.form.get('claimResponse')[this.params][this.rendered] = false;
    this.form.get('consentResponsevalue')[this.params][this.rendered] = false;
    this.form.get('amendmentResponsevalue')[this.params][this.rendered] = false;
    this.form.get('amendmentresponse')[this.params][this.rendered] = false;
    this.form.get('claimPresentationDate')[this.params][this.rendered] = false;
    this.form.get('claimReferenceBG')[this.params][this.rendered] = false;
    this.form.get('claimPresentationDateBG')[this.params][this.rendered] = false;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.swiftXChar = response.swiftXCharacterSet;
    });
    if (this.subTnxTypeCode !== null && this.subTnxTypeCode !== '' &&
      this.subTnxTypeCode === FccGlobalConstant.N003_CORRESPONDENCE) {
      this.form.get('bgCurCode')[this.params][this.rendered] = false;
      this.form.get('cuCurCode')[this.params][this.rendered] = false;
    }
    if ((this.tnxId === undefined || this.tnxId === null || this.tnxId === '') && this.form.get(this.customerInstructionText)) {
      this.form.get(this.customerInstructionText).setValue('');
    }
    if (this.option !== FccGlobalConstant.ACTION_REQUIRED && this.mode !== FccGlobalConstant.DISCREPANT && !this.actionReqCode) {
      if (this.subTnxTypeCode === undefined || this.subTnxTypeCode === null || this.subTnxTypeCode === '') {
        this.subTnxTypeCode = FccGlobalConstant.N003_CORRESPONDENCE;
      }
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE), this.subTnxTypeCode, {});
    }
    if (this.form.get(FccGlobalConstant.BANK_ATTACHMENT)) {
      this.form.get(FccGlobalConstant.BANK_ATTACHMENT)[this.params][this.rendered] = false;
    }
    this.form.get('bankComments')[this.params][this.rendered] = false;
    this.setActionRequiredFields();
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || (this.mode === FccGlobalConstant.DISCREPANT &&
      this.option === FccGlobalConstant.EXISTING_OPTION) || this.actionReqCode || this.isDiscrepantDraft()) {
      this.renderedFields();
  }
  const modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.UI_MESSAGE_GENERAL_DETAILS)
                              .get('transmissionMode').value;
        this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_BG,
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

  isDiscrepantDraft(): boolean {
    return (this.mode === FccGlobalConstant.DRAFT_OPTION && (this.subTnxTypeCode === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_08 ||
    this.subTnxTypeCode === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_09));
  }


  renderedFields() {
    if (this.form.get('bankComments').value && this.form.get('bankComments').value !== FccGlobalConstant.BLANK_SPACE_STRING) {
      this.form.get('bankComments')[this.params][this.rendered] = true;
    }
    else if (this.form.get('parentBankComment') && this.form.get('parentBankComment').value
       && this.form.get('parentBankComment').value !== FccGlobalConstant.BLANK_SPACE_STRING) {
        this.form.get('bankComments').patchValue(this.form.get('parentBankComment').value);
      }
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || (this.mode === FccGlobalConstant.DISCREPANT &&
      this.option === FccGlobalConstant.EXISTING_OPTION) || this.actionReqCode || this.isDiscrepantDraft()) {
        this.form.get('bgCurCode')[this.params][this.rendered] = false;
        if (this.commonService.isnonEMptyString(this.form.get('claimReferenceBG').value)) {
          this.form.get('claimReferenceBG')[this.params][this.rendered] = true;
        }
        if (this.commonService.isnonEMptyString(this.form.get('claimPresentationDateBG').value)) {
          this.form.get('claimPresentationDateBG')[this.params][this.rendered] = true;
        } else {
          this.getBoReleaseDateValue();
        }
        if (this.commonService.isnonEMptyString(this.form.get('claimAmountBG').value) &&
            this.commonService.isnonEMptyString(this.form.get('claimCurrencyCodeBG').value)) {
              this.form.get('docAmountValue')[this.params][this.rendered] = false;
              this.setCurrencyAndAmountField('claimAmountBG','claimCurrencyCodeBG','claimAmountValue');
            } else {
              this.setCurrencyAndAmountField('bgDocumentAmount', 'bgDocumentCurrency', 'docAmountValue');
            }
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
  }
  }

  setClaimProcessingFields() {
    if (this.parentTnxData && (this.parentTnxData.prod_stat_code === FccGlobalConstant.PROD_STAT_CODE_CLAIM
      || ((this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode)
        && this.parentTnxData.prod_stat_code === FccGlobalConstant.PROD_STAT_CODE_EXTEND_PAY))) {
      this.form.get('claimAmountValue')[this.params][this.rendered] = true;
      this.form.get('claimReferenceBG')[this.params][this.rendered] = true;
      this.form.get('claimReferenceBG').setValue(this.parentTnxData.claim_reference);
      this.form.get('claimPresentationDate')[this.params][this.rendered] = true;
      this.form.get('claimPresentationDate').setValue(this.parentTnxData.claim_present_date);
      this.form.get('claimAmountValue').setValue(`${this.parentTnxData.claim_cur_code} ${this.parentTnxData.claim_amt}`);
      if (this.parentTnxData && (this.parentTnxData.prod_stat_code === FccGlobalConstant.PROD_STAT_CODE_CLAIM &&
        this.subTnxTypeCode === FccGlobalConstant.N003_SETTLEMENT_REQUEST)) {
        this.displaySettlementAmountFields();
      }
      this.form.updateValueAndValidity();
  }
  }

  onClickConsentResponsevalue(){
    this.handleConsentResponseValue();
    const constentResponseValue = this.form.get('consentResponsevalue').value;
    if (constentResponseValue && constentResponseValue === FccGlobalConstant.SUB_TNX_TYPE_ACCEPT
      && this.form.get('consentResponsevalue')[this.params][this.rendered] === true) {
        if (this.parentTnxData && this.parentTnxData.claim_amt) {
          this.form.get('uiSettlementAmount').setValue(this.parentTnxData.claim_amt);
        }
        this.onBlurUiSettlementAmount();
      }
  }

  handleConsentResponseValue() {
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
      const constentResponseValue = this.form.get('consentResponsevalue').value;
      if (constentResponseValue && constentResponseValue === FccGlobalConstant.SUB_TNX_TYPE_ACCEPT
          && this.form.get('consentResponsevalue')[this.params][this.rendered] === true) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.SUB_TNX_TYPE_ACCEPT, {});
        this.patchFieldValueAndParameters(this.form.get('consentExtendResponsePreview'),
        FccGlobalConstant.SUB_TNX_TYPE_ACCEPT, {});
        if (this.prodStatusCode === FccGlobalConstant.PROD_STAT_CODE_EXTEND_PAY) {
          this.form.get('extendResponseValue')[this.params][this.rendered] = true;
        }
        this.displaySettlementAmountFields();
        this.onBlurUiSettlementAmount();
      } else if (constentResponseValue && constentResponseValue === FccGlobalConstant.SUB_TNX_TYPE_REJECT &&
        this.form.get('consentResponsevalue')[this.params][this.rendered] === true) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.SUB_TNX_TYPE_REJECT, {});
        this.patchFieldValueAndParameters(this.form.get('consentExtendResponsePreview'),
        FccGlobalConstant.SUB_TNX_TYPE_REJECT, {});
        this.form.get('extendResponseValue')[this.params][this.rendered] = false;
        this.hideSettlementAmountFields();
      }
      this.handleExtendResponseValue();
    }
  }

  onClickAmendmentResponsevalue() {
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
      const amendmentResponseValue = this.form.get('amendmentResponsevalue').value;
      if (amendmentResponseValue && amendmentResponseValue === FccGlobalConstant.SUB_TNX_TYPE_AMD_BENE_ACCEPT
          && this.form.get('amendmentResponsevalue')[this.params][this.rendered] === true) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.SUB_TNX_TYPE_AMD_BENE_ACCEPT, {});
      } else if (amendmentResponseValue && this.form.get('amendmentResponsevalue')[this.params][this.rendered] === true) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.SUB_TNX_TYPE_AMD_BENE_REJECT, {});
      }
    }
  }

  onClickWordingResponseValue() {
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
      const wordingResponseValue = this.form.get('wordingResponseValue').value;
      if (wordingResponseValue && wordingResponseValue === FccGlobalConstant.N003_WORDING_ACK
          && this.form.get('wordingResponseValue')[this.params][this.rendered] === true) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.N003_WORDING_ACK, {});
      } else if (wordingResponseValue &&
         this.form.get('wordingResponseValue')[this.params][this.rendered] === true) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.N003_WORDING_NACK, {});
      }
    }
  }

  onClickBillofAdviceResponseValue() {
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
      const billofAdviceResponseValue = this.form.get('billofAdviceResponseValue').value;
      if (billofAdviceResponseValue && billofAdviceResponseValue === FccGlobalConstant.SUB_TNX_TYPE_AMD_BENE_ACCEPT
          && this.form.get('billofAdviceResponseValue')[this.params][this.rendered] === true) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.SUB_TNX_TYPE_AMD_BENE_ACCEPT, {});
      } else if (billofAdviceResponseValue && this.form.get('billofAdviceResponseValue')[this.params][this.rendered] === true) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.SUB_TNX_TYPE_AMD_BENE_REJECT, {});
      }
    }
  }

  onClickPaymentResponseValue() {
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
      const paymentResponseValue = this.form.get('paymentResponseValue').value;
      if (paymentResponseValue && paymentResponseValue === FccGlobalConstant.SUB_TNX_TYPE_ACCEPT
          && this.form.get('paymentResponseValue')[this.params][this.rendered] === true) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.SUB_TNX_TYPE_ACCEPT, {});
      } else if (paymentResponseValue && this.form.get('paymentResponseValue')[this.params][this.rendered] === true) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.SUB_TNX_TYPE_REJECT, {});
      }
    }
  }
  onClickExtendResponseValue() {
    this.handleExtendResponseValue();
    const extendResponseValue = this.form.get('extendResponseValue').value;
    if (extendResponseValue && extendResponseValue === FccGlobalConstant.SUB_TNX_TYPE_PAY) {
      if (this.parentTnxData && this.parentTnxData.claim_amt) {
        this.form.get('uiSettlementAmount').setValue(this.parentTnxData.claim_amt);
      }
      this.onBlurUiSettlementAmount();
    }
  }

  handleExtendResponseValue() {
    if (this.prodStatusCode === FccGlobalConstant.PROD_STAT_CODE_EXTEND_PAY && (this.option === FccGlobalConstant.ACTION_REQUIRED
      || this.actionReqCode)) {
      const extendResponseValue = this.form.get('extendResponseValue').value;
      const constentResponseValue = this.form.get('consentResponsevalue').value;
      if (constentResponseValue && constentResponseValue === FccGlobalConstant.SUB_TNX_TYPE_REJECT) {
        this.form.get('extendedDate')[this.params][this.rendered] = false;
        this.form.get('extendedDateLocal')[this.params][this.rendered] = false;

        this.hideSettlementAmountFields();
      } else if (extendResponseValue && extendResponseValue === FccGlobalConstant.SUB_TNX_TYPE_EXTEND) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
      FccGlobalConstant.SUB_TNX_TYPE_EXTEND, {});
        this.patchFieldValueAndParameters(this.form.get('consentExtendResponsePreview'), FccGlobalConstant.SUB_TNX_TYPE_EXTEND, {});
        this.form.get('extendedDate')[this.params][this.rendered] = true;
        this.form.get('extendedDateLocal')[this.params][this.rendered] = false;
        this.hideSettlementAmountFields();
      } else if (extendResponseValue && extendResponseValue === FccGlobalConstant.SUB_TNX_TYPE_PAY) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.SUB_TNX_TYPE_PAY, {});
        this.patchFieldValueAndParameters(this.form.get('consentExtendResponsePreview'), FccGlobalConstant.SUB_TNX_TYPE_PAY, {});
        this.form.get('extendedDate')[this.params][this.rendered] = false;
        this.form.get('extendedDateLocal')[this.params][this.rendered] = false;
        this.displaySettlementAmountFields();
        this.onBlurUiSettlementAmount();
      }
    }
  }

  hideSettlementAmountFields() {
    this.form.get('settlementAmount')[this.params][this.rendered] = false;
    this.form.get('bgCurCode')[this.params][this.rendered] = false;
    this.form.get('cuCurCode')[this.params][this.rendered] = false;
    this.form.get('uiSettlementAmount')[this.params][this.rendered] = false;
    this.form.get('bgPrincipalActNo')[this.params][this.rendered] = false;
    this.form.get('bgFeeActNo')[this.params][this.rendered] = false;
    this.form.updateValueAndValidity();
    this.form.get('uiSettlementAmount').reset();
    this.form.get('uiSettlementAmount').clearValidators();
    this.setMandatoryField(this.form, 'uiSettlementAmount', false);
    this.form.get('uiSettlementAmount').setErrors(null);
    this.updateSettlementAmt();
  }

  displaySettlementAmountFields() {
    if (this.parentTnxData && this.parentTnxData.purpose && this.parentTnxData.purpose === '01') {
      this.form.get('bgCurCode')[this.params][this.rendered] = true;
      this.form.get('cuCurCode')[this.params][this.rendered] = false;
    }else{
      this.form.get('cuCurCode')[this.params][this.rendered] = true;
      this.form.get('bgCurCode')[this.params][this.rendered] = false;
    }
    this.form.get('uiSettlementAmount')[this.params][this.rendered] = true;
    this.form.get('bgPrincipalActNo')[this.params][this.rendered] = true;
    this.form.get('bgFeeActNo')[this.params][this.rendered] = true;
    this.form.updateValueAndValidity();
    this.setMandatoryField(this.form, 'uiSettlementAmount', true);
    (this.enableSettlementAmount ? this.form.get('uiSettlementAmount').enable() : this.form.get('uiSettlementAmount').disable());
    if (this.parentTnxData && this.parentTnxData.claim_amt) {
      this.form.get('uiSettlementAmount').setValue(this.parentTnxData.claim_amt);
    }
    if (this.parentTnxData && this.parentTnxData.purpose && (this.mode === FccGlobalConstant.DRAFT_OPTION ||
      (this.parentTnxData.cross_references && this.parentTnxData.cross_references && this.parentTnxData.cross_references.cross_reference &&
      (this.tnxId !== this.parentTnxData.cross_references.cross_reference.tnx_id)))) {
      this.parentTnxData.purpose === FccGlobalConstant.CODE_01 ? this.form.get('uiSettlementAmount').setValue(this.parentTnxData.tnx_amt) :
      this.form.get('uiSettlementAmount').setValue(this.parentTnxData.cu_tnx_amt);
    }
    this.form.updateValueAndValidity();
    this.updateSettlementAmt();
  }

  onClickDisposalInstructionsvalueUi() {
    if (this.form.get('disposalInstructionsvalueUi').value === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_08) {
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
    FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_08, {});
    } else if (this.form.get('disposalInstructionsvalueUi').value === FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_09) {
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
    FccGlobalConstant.N003_DISPOSAL_INSTRUCTIONS_09, {});
    }
  }

  setActionRequiredFields() {
    if (this.tnxId) {
      this.transactionDetailService.fetchTransactionDetails(
        this.getTnxIdForActionRequired(), this.productCode).subscribe(response => {
        const responseObj = response.body;
        if (responseObj) {
          this.parentTnxData = responseObj;
          const actionReqCode = this.commonService.getQueryParametersFromKey('actionReqCode');
          if (this.option === FccGlobalConstant.ACTION_REQUIRED || (actionReqCode !== undefined && actionReqCode !== null)) {
          this.prodStatusCode = responseObj.prod_stat_code;
          const prodStatCodeWithReponse = [FccGlobalConstant.PROD_STAT_CODE_EXTEND_PAY, FccGlobalConstant.PROD_STAT_CODE_CLAIM];
          const paymentProductCode = [FccGlobalConstant.N005_PART_SIGHT_PAID, FccGlobalConstant.N005_FULL_SIGHT_PAID];
          const prodStatCodeWithCorrespondenceOnly = [FccGlobalConstant.N005_REQUEST_FOR_SETTLEMENT, FccGlobalConstant.N005_EXTENDED,
            FccGlobalConstant.N005_AMENDED];
          if ( prodStatCodeWithReponse.indexOf(this.prodStatusCode) > -1) {
            this.form.get('claimResponse')[this.params][this.rendered] = true;
            this.form.get('consentResponsevalue')[this.params][this.rendered] = true;
          } else if (actionReqCode === FccGlobalConstant.ACT_REQ_AMD_RESP ||
            (this.parentTnxData.action_req_code !== undefined && this.parentTnxData.action_req_code !== null
               && this.parentTnxData.action_req_code === FccGlobalConstant.ACT_REQ_AMD_RESP)) {
            this.form.get('amendmentresponse')[this.params][this.rendered] = true;
            this.form.get('amendmentResponsevalue')[this.params][this.rendered] = true;
          } else if ( this.prodStatusCode === FccGlobalConstant.PROD_STAT_CODE_DISCREPANT) {
            this.form.get('disposalInstructionsUi')[this.params][this.rendered] = true;
            this.form.get('disposalInstructionsvalueUi')[this.params][this.rendered] = true;
            const subTnxTypeCode = responseObj.sub_tnx_type_code;
            if (subTnxTypeCode !== undefined && subTnxTypeCode !== null) {
              this.form.get('disposalInstructionsvalueUi').setValue(subTnxTypeCode);
            } else {
            this.onClickDisposalInstructionsvalueUi();
            }
          } else if (paymentProductCode.indexOf(this.prodStatusCode) > -1) {
            this.form.get('consentResponse')[this.params][this.rendered] = true;
            this.form.get('paymentResponseValue')[this.params][this.rendered] = true;
          } else if (prodStatCodeWithCorrespondenceOnly.indexOf(this.prodStatusCode) > -1) {
            this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
            FccGlobalConstant.N003_CORRESPONDENCE, {});
          } else if ( this.prodStatusCode === FccGlobalConstant.N005_BILL_CLEAN) {
            this.form.get('consentResponse')[this.params][this.rendered] = true;
            this.form.get('billofAdviceResponseValue')[this.params][this.rendered] = true;
          } else if ( this.prodStatusCode === FccGlobalConstant.N005_WORDING_UNDER_REVIEW
            || this.prodStatusCode === FccGlobalConstant.N005_FINAL_WORDING
            || this.prodStatusCode === FccGlobalConstant.N005_PROVISIONAL ) {
            this.form.get('consentResponse')[this.params][this.rendered] = true;
            this.form.get('wordingResponseValue')[this.params][this.rendered] = true;
          } else {
            this.form.get('claimResponse')[this.params][this.rendered] = false;
            this.form.get('consentResponsevalue')[this.params][this.rendered] = false;
          }
        }
        const extendedDate = responseObj.extended_date;
        const extendedDateLocal = responseObj.extended_date_local;
        if(this.form.get('extendedDate') && this.commonService.isnonEMptyString(extendedDate)) {
          this.form.get('extendedDate').setValue(extendedDate);
        }
        if(this.form.get('extendedDateLocal') && this.commonService.isnonEMptyString(extendedDateLocal)) {
          this.form.get('extendedDateLocal')[this.params][this.rendered] = true;
          this.form.get('extendedDateLocal').setValue(extendedDateLocal);
        }
          this.setClaimProcessingFields();
          this.updateDraftDetails();
          this.updateCustomerInstructions();
          this.handleConsentResponseValue();
        }
      });
    } else {
      this.transactionDetailService.fetchTransactionDetails(this.refId).subscribe(response => {
        const responseObj = response.body;
        if (responseObj) {
          this.parentTnxData = responseObj;
          this.setClaimProcessingFields();
          if (this.subTnxTypeCode !== null && this.subTnxTypeCode !== '' &&
          this.subTnxTypeCode === FccGlobalConstant.N003_SETTLEMENT_REQUEST) {
          this.displaySettlementAmountFields();
    }
        }
      });
    }
  }

updateCustomerInstructions(){
  if (this.parentTnxData && this.parentTnxData.free_format_text && this.option === FccGlobalConstant.ACTION_REQUIRED) {
    if (this.mode === FccGlobalConstant.DRAFT_OPTION || this.commonService.isnewEventSaved) {
    this.form.get(this.customerInstructionText).setValue(this.parentTnxData.free_format_text);
  } else if (!this.commonService.isnewEventSaved) {
      this.form.get(this.customerInstructionText).setValue('');
    }
  }
}

getTnxIdForActionRequired() {
  let fetchTnxID = this.tnxId;
  if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
    return fetchTnxID;
  }
  if (this.commonService.isnewEventSaved && this.commonService.eventId) {
    fetchTnxID = this.commonService.eventId;
  } else if (!this.commonService.isnewEventSaved) {
    fetchTnxID = this.tnxId;
  }
  return fetchTnxID;
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

onBlurUiSettlementAmount() {
  let amount = parseFloat(this.commonService.replaceCurrency(this.form.get('uiSettlementAmount').value));
  let claimAmt;
  const bgCurrency = this.form.get('bgCurCode').value;
  if (amount) {
  amount = this.commonService.replaceCurrency(this.form.get('uiSettlementAmount').value);
  amount = this.currencyConverterPipe.transform(amount.toString(), bgCurrency);
  this.form.get('uiSettlementAmount').setValue(amount);
  this.form.get('uiSettlementAmount').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
  this.setMandatoryField(this.form, 'uiSettlementAmount', true);
  this.amountValidation();
  this.form.get('uiSettlementAmount').updateValueAndValidity();
  } else if (isNaN(amount)) {
    this.form.get('uiSettlementAmount').setValue("");
  }
  if (this.parentTnxData && this.parentTnxData.claim_amt) {
    claimAmt = parseFloat(this.commonService.replaceCurrency(this.parentTnxData.claim_amt));
    amount = parseFloat(this.commonService.replaceCurrency(this.form.get('uiSettlementAmount').value));
    this.form.addFCCValidators(
      "uiSettlementAmount",
      Validators.compose([
        Validators.required,
        validateSettlementAmount(amount, claimAmt),
      ]),
      0
    );
    this.form.get('uiSettlementAmount').updateValueAndValidity();
    }
  this.updateSettlementAmt();
}

amountValidation() {
  const transferAmt = this.form.get('uiSettlementAmount').value;
  const transferAmtFloatValue = parseFloat(transferAmt.toString());
  if (transferAmtFloatValue === 0) {
    this.form.get('uiSettlementAmount').clearValidators();
    this.form.addFCCValidators('uiSettlementAmount',
      Validators.compose([Validators.required, zeroAmount]), 0);
    this.form.get('uiSettlementAmount').setErrors({ zeroAmount: true });
    this.form.get('uiSettlementAmount').markAsDirty();
    this.form.get('uiSettlementAmount').markAsTouched();
    this.form.get('uiSettlementAmount').updateValueAndValidity();
  }
}

updateSettlementAmt(){
  if (this.parentTnxData && this.parentTnxData.purpose && this.parentTnxData.purpose !== '01') {
    if (this.form.get('uiSettlementAmount')[this.params][this.rendered] === true) {
    this.form.get('cuTnxAmount').setValue(this.form.get('uiSettlementAmount').value);
    }
    } else {
      if (this.form.get('uiSettlementAmount')[this.params][this.rendered] === true) {
      this.form.get('tnxAmount').setValue(this.form.get('uiSettlementAmount').value);
      }
}
  this.form.updateValueAndValidity();
}


saveFormOject() {
  this.stateService.setStateSection('uiTransactionBrief', this.form);
}

onClickNext() {
  this.saveFormOject();
  if (!CommonService.isTemplateCreation) {

    this.leftSectionService.addSummarySection();
    this.saveDraftService.changeSaveStatus('uiTransactionBrief',
      this.stateService.getSectionData('uiTransactionBrief'));
  }
  if (this.form.valid && !CommonService.isTemplateCreation) {
    this.leftSectionService.addSummarySection();
  }

  if (this.form.invalid) {
    this.leftSectionService.removeSummarySection();
  }

}

updateBankValue() {
  if ((this.form.get('bgPrincipalActNo') && this.form.get('bgPrincipalActNo').value) ||
      (this.form.get('bgFeeActNo') && this.form.get('bgFeeActNo').value)) {
    const principalAct = this.form.get('bgPrincipalActNo').value;
    const feeAct = this.form.get('bgFeeActNo').value;
    let exists = this.accounts.filter(
            task => task.label === principalAct);
    if (exists.length > 0) {
          this.form.get('bgPrincipalActNo').setValue(this.accounts.filter(
              task => task.label === principalAct)[0].value);
            }
    exists = this.accounts.filter(
            task => task.label === feeAct);
    if (exists.length > 0) {
          this.form.get('bgFeeActNo').setValue(this.accounts.filter(
            task => task.label === feeAct)[0].value);
      }
  }
}

updateValue() {
  const exist1 = this.accounts.filter(task => task.label === this.form.get('bgFeeActNo').value.label);
  if(this.form.get('bgFeeActNo').value && exist1 !== null && exist1.length > 0){
  this.patchFieldValueAndParameters(this.form.get('bgFeeActNo'),this.accounts.filter(
  task => task.label === this.form.get('bgFeeActNo').value.label)[0].value, {});
   }
  const exist2 = this.accounts.filter(task => task.label === this.form.get('bgPrincipalActNo').value.label);
   if(this.form.get('bgPrincipalActNo').value && exist2 !== null && exist2.length > 0){
    this.patchFieldValueAndParameters(this.form.get('bgPrincipalActNo'),this.accounts.filter(
    task => task.label === this.form.get('bgPrincipalActNo').value.label)[0].value, {});
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
   this.patchFieldParameters(this.form.get('bgPrincipalActNo'), { options: this.getUpdatedAccounts() });
   this.patchFieldParameters(this.form.get('bgFeeActNo'), { options: this.getUpdatedAccounts() });

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
  this.patchFieldParameters(this.form.get('bgPrincipalActNo'), { options: this.getUpdatedAccounts() });
  this.patchFieldParameters(this.form.get('bgFeeActNo'), { options: this.getUpdatedAccounts() });
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
  this.patchFieldParameters(this.form.get('bgPrincipalActNo'), { options: this.getUpdatedAccounts() });
  this.patchFieldParameters(this.form.get('bgFeeActNo'), { options: this.getUpdatedAccounts() });


}
  if (this.entityName === undefined) {
    this.patchFieldParameters(this.form.get('bgPrincipalActNo'), { options: [] });
    this.patchFieldParameters(this.form.get('bgFeeActNo'), { options: [] });
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
       if (myvalue[key].key === FccGlobalConstant.APPLICANT_ENTITY) {
             this.entityName = myvalue[key].value;
             this.entityNameRendered = myvalue[key].params.rendered;

        }
  });
  this.getAccounts();
}

getUpdatedAccounts(): any[] {
  return this.accounts;
}

setNarrativeLength() {
  if (this.option === FccGlobalConstant.CANCEL_OPTION) {
    this.form.get('customerInstructionText').clearValidators();
    this.form.get('customerInstructionText')[this.params][this.allowedCharCount] = '1750';
    this.form.get('customerInstructionText')[this.params][this.maxlength] = '1750';
    // this.form.get('customerInstructionText')[this.params][this.maxRowCount] = '35';
    this.form.get('customerInstructionText')[this.params][this.cols] = '50';
  }
}

ngOnDestroy() {
  this.updateSettlementAmt();
  const prodStatCodeWithReponse = [FccGlobalConstant.PROD_STAT_CODE_EXTEND_PAY, FccGlobalConstant.PROD_STAT_CODE_CLAIM];
  if ((this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) &&
  this.parentTnxData && prodStatCodeWithReponse.indexOf(this.parentTnxData.prod_stat_code) > -1) {
  this.form.get('consentExtendResponsePreview')[this.params][this.rendered] = true;
  }
}
}
