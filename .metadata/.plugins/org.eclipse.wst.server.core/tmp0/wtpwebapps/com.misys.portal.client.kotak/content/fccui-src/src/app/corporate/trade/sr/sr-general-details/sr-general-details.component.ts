import { Component, EventEmitter, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { FCCFormGroup } from '../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../common/services/common.service';
import { EventEmitterService } from '../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../common/services/form-model.service';
import { PhrasesService } from '../../../../common/services/phrases.service';
import { ResolverService } from '../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../common/services/search-layout.service';
import { TransactionDetailService } from '../../../../common/services/transactionDetail.service';
import { LeftSectionService } from '../../../../corporate/common/services/leftSection.service';
import { ProductStateService } from '../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../lc/common/services/save-draft.service';
import { CurrencyConverterPipe } from '../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { BankFileMap } from '../../lc/initiation/services/bankmfile';
import { FilelistService } from '../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../lc/initiation/services/form-control.service';
import { PrevNextService } from '../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../lc/initiation/services/utility.service';
import { SrProductService } from '../services/sr-product.service';
import { SrProductComponent } from '../sr-product/sr-product.component';
import { CodeDataService } from './../../../../common/services/code-data.service';
import { FileHandlingService } from './../../../../common/services/file-handling.service';

@Component({
  selector: 'app-sr-general-details',
  templateUrl: './sr-general-details.component.html',
  styleUrls: ['./sr-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SrGeneralDetailsComponent }]
})
export class SrGeneralDetailsComponent extends SrProductComponent implements OnInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  @ViewChild('fccCommonTextArea') public fccCommonTextAreaId: ElementRef;
  module = `${this.translateService.instant('srGeneralDetails')}`;
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
  subProductCode: any;
  codeID: any;
  dataArray: any;
  customerInstructionText = 'customerInstructionText';
  expiryTypeValue: any;
  paramDataList: any[] = [];
  customerInstnsLen : any;
  element = 'customerInstructionText';
  allowedCharCount = FccGlobalConstant.ALLOWED_CHAR_COUNT;
  maxRowCount = FccGlobalConstant.MAX_ROW_COUNT;
  customerInstnsRowCount : number;
  maxLength = FccGlobalConstant.MAXLENGTH;
  cols = FccGlobalConstant.MAX_COL_COUNT;

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
              protected dialogRef: DynamicDialogRef, protected codeDataService: CodeDataService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected srProductService: SrProductService,
              protected fileHandlingService: FileHandlingService) {
              super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
                searchLayoutService, utilityService, resolverService, uploadFile, dialogRef, currencyConverterPipe, srProductService);
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
  }

  updateNarrativeCount() {
    if (this.form.get(this.customerInstructionText) && this.form.get(this.customerInstructionText).value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get(this.customerInstructionText).value);
      this.form.get(this.customerInstructionText)[this.params][this.enteredCharCount] = count;
    }
  }

    initializeFormGroup() {
      const sectionName = 'srGeneralDetails';
      this.form = this.stateService.getSectionData(sectionName);
      if (this.form.get(FccGlobalConstant.EXPIRY_TYPE_SI)) {
        this.expiryTypeValue = this.form.get(FccGlobalConstant.EXPIRY_TYPE_SI).value;
        this.checkExpiryType(this.expiryTypeValue);
      }
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
        && this.subTnxTypeCode !== FccGlobalConstant.N003_ASSIGNEE && this.subTnxTypeCode !== FccGlobalConstant.N003_TRANSFER &&
         this.option !== FccGlobalConstant.ACTION_REQUIRED && !this.actionReqCode) {
      this.form.get(FccGlobalConstant.BANK_ATTACHMENT)[this.params][this.rendered] = false;
      this.form.get('bankComments')[this.params][this.rendered] = false;
      this.form.get('consentResponse')[this.params][this.rendered] = false;
      this.form.get('consentResponsevalue')[this.params][this.rendered] = false;
      }
      this.commonService.formatForm(this.form);
      if (this.form.get(FccGlobalConstant.EXPIRY_TYPE)) {
        this.prepareExpiryTypes();
      }
      this.swiftRenderedFields();
      if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
        const fileTnxId = ((this.commonService.isNonEmptyField(FccGlobalConstant.PARENT_TNX_ID, this.form) &&
        this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.PARENT_TNX_ID).value) &&
        this.form.get(FccGlobalConstant.PARENT_TNX_ID).value !== '') ? this.form.get(FccGlobalConstant.PARENT_TNX_ID).value : this.tnxId);
        this.fileHandlingService.getTnxFileDetails(fileTnxId ).subscribe(
        response1 => {
          if (response1) {
            this.uploadFile.resetBankList();
            for (const values of response1.body.items) {
              if ( values.type === 'BANK') {
                this.docId = values.docId;
                this.bankFileModel = new BankFileMap(null, values.fileName, values.title, values.type,
                this.commonService.getFileExtPath(values.fileName), null, this.docId, null, null, null, null, 
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
        this.renderActionRequiredFields();
    }
          
    const modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.SR_GENERAL_DETAILS)
      .get('transmissionMode');
    this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_SR,
      FccGlobalConstant.PARAMETER_P940,).subscribe(responseData => {
        if (responseData) {
          this.paramDataList = responseData.paramDataList;
            if (this.commonService.isNonEmptyValue(modeOfTransmission) && 
            this.commonService.isNonEmptyValue(modeOfTransmission.value) && 
            this.form.get(this.element) && modeOfTransmission.value === '01') {
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
      if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.tnxTypeCode === FccGlobalConstant.N002_INQUIRE) {
        this.getBoReleaseDateValue();
        this.setCurrencyAndAmountField('docAmount', 'docCurCode', 'docAmountValue');
      }
    }
    getBoReleaseDateValue(){

      
      if(this.form.get('boReleaseDate') && this.commonService.isnonEMptyString(this.form.get('boReleaseDate').value)) {
        this.form.get('boReleaseDateValue')[this.params][FccGlobalConstant.RENDERED] = true;
       this.form.get('boReleaseDateValue').setValue(this.form.get('boReleaseDate').value.split(" ")[0]);
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
        this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_65;
      }
    }
  }  
  swiftModeTransmission() {
    if (this.subTnxTypeCode === FccGlobalConstant.N003_CORRESPONDENCE) {
    this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_35;
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

  checkExpiryType(expiryTypeValue: any) {
    if (expiryTypeValue && this.form.get(FccGlobalConstant.EXPIRY_EVENT) &&
    (expiryTypeValue === FccGlobalConstant.EXP_TYPE_VALUE_SPECIFIC || expiryTypeValue === FccGlobalConstant.EXP_TYPE_VALUE_UNLIMITED)) {
      this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.EXPIRY_EVENT).clearValidators();
    } else if (expiryTypeValue && expiryTypeValue === FccGlobalConstant.EXP_TYPE_VALUE_CONDITIONAL) {
      this.form.get(FccGlobalConstant.EXPIRY_EVENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
    this.form.updateValueAndValidity();
  }

  renderedDraftFields() {
    if (this.mode === 'DRAFT') {
    this.patchFieldValueAndParameters(this.form.get('consentResponsevalue'), this.subTnxTypeCode, {});
    this.form.updateValueAndValidity();
  }
  }

  onFocusConsentResponsevalue_66() {
    this.patchFieldValueAndParameters(this.form.get('consentResponsevalue'), FccGlobalConstant.N003_ACK, {});
    this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
    FccGlobalConstant.N003_ACK, {});
  }

  onFocusConsentResponsevalue_67() {
    this.patchFieldValueAndParameters(this.form.get('consentResponsevalue'), FccGlobalConstant.N003_NACK, {});
    this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
    FccGlobalConstant.N003_NACK, {});
  }

  onClickConsentResponsevalue() {
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
      const constentResponseValue = this.form.get('consentResponsevalue').value;
      if (constentResponseValue && constentResponseValue === FccGlobalConstant.N003_NACK) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
      FccGlobalConstant.N003_NACK, {});
      } else {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
        FccGlobalConstant.N003_ACK, {});
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

  saveFormOject() {
    this.stateService.setStateSection('srGeneralDetails', this.form);
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
      this.saveDraftService.changeSaveStatus('srGeneralDetails',
        this.stateService.getSectionData('srGeneralDetails'));
    }
    if (this.form.valid && !CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
    }
    if (this.form.invalid) {
      this.leftSectionService.removeSummarySection();
    }
  }

  onClickPhraseIcon(event, key) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SR, key, '', true);
  }

  prepareExpiryTypes() {
    const elementId = FccGlobalConstant.EXPIRY_TYPE;
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    const elementValue = this.form.get(FccGlobalConstant.EXPIRY_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    if (this.form.get(FccGlobalConstant.EXPIRY_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
        this.form.get(FccGlobalConstant.EXPIRY_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
        this.form.get(FccGlobalConstant.EXPIRY_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
        this.codeID = this.form.get(FccGlobalConstant.EXPIRY_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
      }
    if (elementValue.length === 0 && this.commonService.isNonEmptyValue(this.codeID)) {
        this.dataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
        this.patchFieldParameters(this.form.get(elementId), { options: this.dataArray });
      }
    this.form.get(elementId).updateValueAndValidity();
  }

  swiftRenderedFields() {
    this.commonService.getSwiftVersionValue();
    if (this.commonService.swiftVersion === FccGlobalConstant.SWIFT_2021) {
      if (this.form.get(FccGlobalConstant.EXPIRY_TYPE).value &&
          this.form.get(FccGlobalConstant.EXPIRY_TYPE).value !== FccGlobalConstant.BLANK_SPACE_STRING) {
            this.form.get(FccGlobalConstant.EXPIRY_TYPE)[this.params][this.rendered] = true;
      } else {
        this.form.get(FccGlobalConstant.EXPIRY_TYPES)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.EXPIRY_TYPE)[this.params][this.rendered] = false;
      }
    } else {
      this.form.get(FccGlobalConstant.EXPIRY_TYPES)[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.EXPIRY_TYPE)[this.params][this.rendered] = false;
    }
  }

  renderActionRequiredFields() {
    if (this.commonService.isNonEmptyField(FccGlobalConstant.BANK_COMMENT, this.form)
          && this.form.get(FccGlobalConstant.BANK_COMMENT).value !== null
          && this.form.get(FccGlobalConstant.BANK_COMMENT).value !== FccGlobalConstant.BLANK_SPACE_STRING) {
        this.form.get(FccGlobalConstant.BANK_COMMENT)[this.params][this.rendered] = true;
    } else if (this.form.get(FccGlobalConstant.PARENT_BANK_COMMENT).value
        && this.form.get(FccGlobalConstant.PARENT_BANK_COMMENT).value !== FccGlobalConstant.BLANK_SPACE_STRING) {
      this.form.get(FccGlobalConstant.BANK_COMMENT).patchValue(this.form.get(FccGlobalConstant.PARENT_BANK_COMMENT).value);
    }
    if (this.commonService.isNonEmptyField('consentResponsevalue', this.form) &&
          (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode)) {
      this.form.get('consentResponse')[this.params][this.rendered] = true;
      this.form.get('consentResponsevalue')[this.params][this.rendered] = true;
      if (this.form.get('consentResponsevalue').value === FccGlobalConstant.N003_ACK) {
        this.onFocusConsentResponsevalue_66();
      } else if (this.form.get('consentResponsevalue').value === FccGlobalConstant.N003_NACK) {
        this.onFocusConsentResponsevalue_67();
      } else {
        this.onFocusConsentResponsevalue_66();
      }
      this.renderedDraftFields();
    }
  }
}
