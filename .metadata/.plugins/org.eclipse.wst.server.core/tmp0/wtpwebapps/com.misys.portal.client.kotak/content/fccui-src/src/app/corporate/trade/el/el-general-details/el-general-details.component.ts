import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { FccGlobalConstantService } from '../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { FormModelService } from '../../../../common/services/form-model.service';
import { ResolverService } from '../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../common/services/search-layout.service';
import { FormControlService } from '../../../../corporate/trade/lc/initiation/services/form-control.service';
import { ProductStateService } from '../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../lc/common/services/save-draft.service';
import { CurrencyConverterPipe } from '../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { BankFileMap } from '../../lc/initiation/services/bankmfile';
import { FilelistService } from '../../lc/initiation/services/filelist.service';
import { PrevNextService } from '../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../lc/initiation/services/utility.service';
import { ElProductComponent } from '../el-product/el-product.component';
import { ElProductService } from '../services/el-product.service';
import { TransactionDetailService } from './../../../../../app/common/services/transactionDetail.service';
import { FCCFormGroup } from './../../../../base/model/fcc-control.model';
import { CommonService } from './../../../../common/services/common.service';
import { EventEmitterService } from './../../../../common/services/event-emitter-service';
import { PhrasesService } from './../../../../common/services/phrases.service';
import { LeftSectionService } from './../../../common/services/leftSection.service';
import { FileHandlingService } from './../../../../common/services/file-handling.service';

@Component({
  selector: 'app-el-general-details',
  templateUrl: './el-general-details.component.html',
  styleUrls: ['./el-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ElGeneralDetailsComponent }]
})
export class ElGeneralDetailsComponent extends ElProductComponent implements OnInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  @ViewChild('fccCommonTextArea') public fccCommonTextAreaId: ElementRef;
  module = `${this.translateService.instant('elgeneralDetails')}`;
  option: any;
  docId: any;
  data: any;
  refId: any;
  tnxId: any;
  productCode: any;
  bankFileModel: BankFileMap;
  contextPath: any;
  fileName: any;
  tableColumns = [];
  params = FccGlobalConstant.PARAMS;
  rendered = FccGlobalConstant.RENDERED;
  enteredCharCount = 'enteredCharCount';
  mode: any;
  subTnxTypeCode: any;
  tnxTypeCode: any;
  actionReqCode: any;
  customerInstructionText = 'customerInstructionText';
  paramDataList: any[] = [];
  customerInstnsLen : any;
  element = 'customerInstructionText';
  customerInstnsRowCount : number;
  maxLength = FccGlobalConstant.MAXLENGTH;
  cols = FccGlobalConstant.MAX_COL_COUNT;
  allowedCharCount = FccGlobalConstant.ALLOWED_CHAR_COUNT;
  maxRowCount = FccGlobalConstant.MAX_ROW_COUNT;


  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService,
              protected elementRef: ElementRef,
              protected prevNextService: PrevNextService, protected utilityService: UtilityService,
              protected saveDraftService: SaveDraftService, protected searchLayoutService: SearchLayoutService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected stateService: ProductStateService, protected route: ActivatedRoute,
              protected eventEmitterService: EventEmitterService, public uploadFile: FilelistService,
              public fccGlobalConstantService: FccGlobalConstantService, protected transactionDetailService: TransactionDetailService,
              protected phrasesService: PhrasesService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected resolverService: ResolverService,
              protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
              protected elProductService: ElProductService, protected fileHandlingService: FileHandlingService) {
              super(eventEmitterService, stateService, commonService, translateService, confirmationService,
                    customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, uploadFile,
                    dialogRef, currencyConverterPipe, elProductService);
}

  ngOnInit(): void {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    if (this.mode === 'DRAFT') {
      this.actionReqCode = this.commonService.getQueryParametersFromKey('actionReqCode');
    }
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    if (this.option === FccGlobalConstant.OPTION_ASSIGNEE) {
      this.commonService.putQueryParameters(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE, FccGlobalConstant.N003_ASSIGNEE);
    } else if (this.option === FccGlobalConstant.OPTION_TRANSFER) {
      this.commonService.putQueryParameters(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE, FccGlobalConstant.N003_TRANSFER);
    }
    this.initializeFormGroup();
    this.updateNarrativeCount();
    if (this.mode === FccGlobalConstant.DRAFT_OPTION)
    {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
    if (this.commonService.currentStateTnxResponse.action_req_code === FccGlobalConstant.N042_AMENDMENT_RESPONSE) {
      this.form.get("claimAmountValue")[this.params][this.rendered] = false;
    }
    if(this.commonService.isnonEMptyString(this.option) && this.option === FccGlobalConstant.EXISTING
    && this.subTnxTypeCode == FccGlobalConstant.N003_CORRESPONDENCE){
      this.hideFormFiledsCorrespondency();
    }
  }

  hideFormFiledsCorrespondency(){
    if(this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.DOCUMENT_AMT))){
      this.form.get(FccGlobalConstant.DOCUMENT_AMT)[this.params]['previewScreen'] = false;
    }
    if(this.commonService.isnonEMptyString(this.form.get('claimAmount'))){
      this.form.get('claimAmount')[this.params]['previewScreen'] = false;
    }
    if(this.commonService.isnonEMptyString(this.form.get('transmissionMode'))){
      this.form.get('transmissionMode')[this.params]['previewScreen'] = false;
    }
    this.form.updateValueAndValidity();
  }

  setActionRequiredFields() {
    const eventId = this.commonService.eventId ? this.commonService.eventId : this.tnxId;
    this.transactionDetailService.fetchTransactionDetails(eventId, this.productCode).subscribe(response => {
        const responseObj = response.body;
        if (responseObj) {
          if (responseObj.bo_comment && !this.commonService.isEmptyValue(responseObj.bo_comment.text)) {
            this.form.get('bankComments').setValue(responseObj.bo_comment.text);
          }
        }
      });
  }

  updateNarrativeCount() {
    if (this.form.get(this.customerInstructionText) && this.form.get(this.customerInstructionText).value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get(this.customerInstructionText).value);
      this.form.get(this.customerInstructionText)[this.params][this.enteredCharCount] = count;
    }
  }

    initializeFormGroup() {
      const sectionName = 'elgeneralDetails';
      this.form = this.stateService.getSectionData(sectionName);
      if (this.option === FccGlobalConstant.OPTION_ASSIGNEE || this.option === FccGlobalConstant.OPTION_TRANSFER) {
        const subTnxType = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
        if (this.commonService.isNonEmptyValue(subTnxType) && subTnxType !== '') {
          this.form.get('subTnxTypeCode').setValue(subTnxType);
        }
      } else if (this.option !== FccGlobalConstant.ACTION_REQUIRED) {
        if (this.subTnxTypeCode === undefined || this.subTnxTypeCode === null || this.subTnxTypeCode === '') {
          this.subTnxTypeCode = FccGlobalConstant.N003_CORRESPONDENCE;
        }
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE), this.subTnxTypeCode, {});
      }
      if (this.option !== FccGlobalConstant.OPTION_ASSIGNEE && this.option !== FccGlobalConstant.OPTION_TRANSFER
        && this.subTnxTypeCode !== FccGlobalConstant.N003_ASSIGNEE && this.subTnxTypeCode !== FccGlobalConstant.N003_TRANSFER) {
      this.form.get(FccGlobalConstant.BANK_ATTACHMENT)[this.params][this.rendered] = false;
      this.form.get('bankComments')[this.params][this.rendered] = false;
      this.form.get('consentResponse')[this.params][this.rendered] = false;
      this.form.get('consentResponsevalue')[this.params][this.rendered] = false;
      }
      this.commonService.formatForm(this.form);
      if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
        const fileTnxId = ((this.commonService.isNonEmptyField(FccGlobalConstant.PARENT_TNX_ID, this.form) &&
        this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.PARENT_TNX_ID).value) &&
        this.form.get(FccGlobalConstant.PARENT_TNX_ID).value !== '') ? this.form.get(FccGlobalConstant.PARENT_TNX_ID).value : this.tnxId);
        this.fileHandlingService.getTnxFileDetails(fileTnxId ).subscribe(
          response1 => {
            if (response1) {
                this.uploadFile.resetBankList();
                if (response1.body && response1.body?.items) {
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
                      this.form.get('bankAttachmentType').setValue(values.type);
                      this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE).updateValueAndValidity();
                      this.form.updateValueAndValidity();
                    }
                  }
                }
            }
          }
       );
       this.setActionRequiredFields();
        if (this.form.get('bankComments').value && this.form.get('bankComments').value !== ' ') {
          this.form.get('bankComments')[this.params][this.rendered] = true;
        }
        this.form.get('consentResponse')[this.params][this.rendered] = true;
        this.form.get('consentResponsevalue')[this.params][this.rendered] = true;
        const constentResponseValue = this.form.get('consentResponsevalue').value;
        if (constentResponseValue && constentResponseValue === FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK) {
          this.onFocusConsentResponsevalue_46();
        } else {
          this.onFocusConsentResponsevalue_47();
        }
        this.renderedDraftFields();
        this.renderActionRequiredFields();
        this.renderedFields();
    }
    let modeOfTransmission='';
    if (this.option == FccGlobalConstant.OPTION_TRANSFER){
     modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.TRANSFER_DETAILS)
                              .get('transmissionMode').value;
    }
    else if(this.stateService.getSectionData(FccGlobalConstant.EL_MESSAGE_GENERAL_DETAILS).get('transmissionMode'))
    {
     modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.EL_MESSAGE_GENERAL_DETAILS)
                              .get('transmissionMode').value;
    }
        this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_EL,
          FccGlobalConstant.PARAMETER_P940,).subscribe(responseData => {
            if (responseData) {
              this.paramDataList = responseData.paramDataList;
              if (this.form.get(this.element) && modeOfTransmission === '01') {
              this.swiftModeTransmission();
              this.form.get(this.element).updateValueAndValidity();
              }
              else {
              this.parameterList();
              if(this.form.get(this.element))
              {
                this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_65;
                this.form.get(this.element)[this.params][this.maxLength] = this.customerInstnsLen;
                this.form.get(this.element)[this.params][this.allowedCharCount] = this.customerInstnsLen;
                // this.form.get(this.element)[this.params][this.maxRowCount] = this.customerInstnsRowCount;
                this.form.get(this.element).updateValueAndValidity();
              }
            }
          }
          });
          if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.tnxTypeCode === FccGlobalConstant.N002_INQUIRE) {
            this.getActualReleaseDate();
            // this.getBoReleaseDateValue();
            if (this.form.get('claimAmount') && this.form.get('claimCurrencyCode') &&
             this.commonService.isnonEMptyString(this.form.get('claimAmount').value) &&
            this.commonService.isnonEMptyString(this.form.get('claimCurrencyCode').value)) {
              this.form.get('docAmountValue')[this.params][this.rendered] = false;
              this.setCurrencyAndAmountField('claimAmount','claimCurrencyCode','claimAmountValue');
            } else {
              this.setCurrencyAndAmountField('docAmount', 'docCurCode', 'docAmountValue');
            }

          }
  }

  getActualReleaseDate() {
    if(this.form.get('actualReleaseDate') && this.commonService.isnonEMptyString(this.form.get('actualReleaseDate').value)) {
      this.form.get('boReleaseDateValue')[this.params][FccGlobalConstant.RENDERED] = true;
      const formattedDate = this.utilityService.formatDate(
        this.form.get("actualReleaseDate").value,
        this.utilityService.getRawDateFormat()
      );
      this.form.get('boReleaseDateValue').setValue(formattedDate);
    }
  }

    parameterList() {
      if (this.paramDataList !== null) {
        this.paramDataList.forEach(element => {
          if (element.data_2 === FccGlobalConstant.CUSTOMER_INSTNS ) {
            this.customerInstnsRowCount = Number(element.data_1);
            this.customerInstnsLen = this.customerInstnsRowCount * FccGlobalConstant.LENGTH_65;
          }
        });
        if (this.customerInstnsRowCount === undefined || this.customerInstnsRowCount === null) {
          this.customerInstnsRowCount = FccGlobalConstant.LENGTH_149;
          this.customerInstnsLen = (this.customerInstnsRowCount * FccGlobalConstant.LENGTH_65) + this.customerInstnsRowCount;
          if(this.form.get(this.element))
          {
            this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_65;
          }
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
      if (this.subTnxTypeCode === FccGlobalConstant.N003_CORRESPONDENCE ||
        this.subTnxTypeCode === FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK
        || !this.commonService.isnonEMptyString(this.subTnxTypeCode)) {
      // this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_35;
      this.form.get(this.element)[this.params][this.allowedCharCount] = FccGlobalConstant.LENGTH_35 * FccGlobalConstant.LENGTH_50;
      this.form.get(this.element)[this.params][this.maxLength] = FccGlobalConstant.LENGTH_35 * FccGlobalConstant.LENGTH_50;
      this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_50;
    }
  }
    handlecontrolComponentsData(controlData: any){
      if (controlData.has('customerInstructionText')) {
        const event = new KeyboardEvent('keyup');
        controlData.get('customerInstructionText').get('fccCommonTextAreaId').nativeElement.dispatchEvent(event);
      }
    }

    // onKeyupCustomerInstructionText(event: any) {
    //   const params = 'params';
    //   const maxRowCount = 'maxRowCount';
    //   const control = this.form.get('customerInstructionText');
    //   const maxrows = control[params][maxRowCount];
    //   const numberofcharRow = control[params]['cols'];
    //   const enteredCharCount = control[params]['allowedCharCount'];
    //   if (control[params]['enteredCharCount'] > enteredCharCount) {
    //     control.setErrors({ rowCountMoreThanAllowed: { maxRows: maxrows, charPerRow: numberofcharRow } });
    //   }else{
    //     control.setErrors(null);
    //   }
    // }

  renderedDraftFields() {
    if (this.mode === 'DRAFT') {
    this.patchFieldValueAndParameters(this.form.get('consentResponsevalue'), this.subTnxTypeCode, {});
    this.form.updateValueAndValidity();
  }
  }
  renderedFields() {
    if (this.form.get('bankComments').value && this.form.get('bankComments').value !== FccGlobalConstant.BLANK_SPACE_STRING) {
      this.form.get('bankComments')[this.params][this.rendered] = true;
    }else if (this.form.get('parentBankComment') && this.form.get('parentBankComment').value
    && this.form.get('parentBankComment').value !== FccGlobalConstant.BLANK_SPACE_STRING) {
      this.form.get('bankComments').patchValue(this.form.get('parentBankComment').value);
    }
    this.form.get(FccGlobalConstant.PARENT_BANK_COMMENT).updateValueAndValidity();
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
          this.commonService.isnonBlankString(this.form.get('bankComments').value)) {
        this.form.get('bankComments')[this.params][this.rendered] = true;
    }
    if (this.commonService.isNonEmptyField('fileAttachmentTable', this.form) &&
          (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode)) {
        this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE)[this.params][this.rendered] = true;
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

  onClickConsentResponsevalue() {
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
      const constentResponseValue = this.form.get('consentResponsevalue').value;
      if (constentResponseValue && constentResponseValue === FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
      FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK, {});
      } else {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.N003_AMENDMENT_ADVICE_NACK, {});
      }
    }
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

  saveFormOject() {
    this.stateService.setStateSection('elgeneralDetails', this.form);
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


  onClickNext() {
    this.saveFormOject();
    if (!CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
      this.saveDraftService.changeSaveStatus('elgeneralDetails',
        this.stateService.getSectionData('elgeneralDetails'));
    }
    if (this.form.valid && !CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
    }
    if (this.form.invalid) {
      this.leftSectionService.removeSummarySection();
    }
}

onClickPhraseIcon(event, key) {
  this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_EL, key, '', true);
}

}
