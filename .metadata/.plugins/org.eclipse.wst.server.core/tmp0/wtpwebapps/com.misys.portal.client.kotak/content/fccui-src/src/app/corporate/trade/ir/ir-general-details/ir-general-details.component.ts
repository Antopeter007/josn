import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { FCCFormGroup } from '../../../../../app/base/model/fcc-control.model';
import { CommonService } from '../../../../../app/common/services/common.service';
import { EventEmitterService } from '../../../../../app/common/services/event-emitter-service';
import { FormModelService } from '../../../../../app/common/services/form-model.service';
import { SearchLayoutService } from '../../../../../app/common/services/search-layout.service';
import { LeftSectionService } from '../../../../../app/corporate/common/services/leftSection.service';
import { FccGlobalConstantService } from '../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { ResolverService } from '../../../../common/services/resolver.service';
import { ProductStateService } from '../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../lc/common/services/save-draft.service';
import { CustomCommasInCurrenciesPipe } from '../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { BankFileMap } from '../../lc/initiation/services/bankmfile';
import { FilelistService } from '../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../lc/initiation/services/form-control.service';
import { PrevNextService } from '../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../lc/initiation/services/utility.service';
import { IrProductComponent } from '../ir-product/ir-product.component';
import { PhrasesService } from './../../../../common/services/phrases.service';
import { CurrencyConverterPipe } from '../../lc/initiation/pipes/currency-converter.pipe';
import { IrProductService } from '../services/ir-product.service';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ir-general-details',
  templateUrl: './ir-general-details.component.html',
  styleUrls: ['./ir-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: IrGeneralDetailsComponent }]
})
export class IrGeneralDetailsComponent extends IrProductComponent implements OnInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  @ViewChild('fccCommonTextArea') public fccCommonTextAreaId: ElementRef;
  module = `${this.translateService.instant('irGeneralDetails')}`;
  option: any;
  tableColumns = [];
  refId: any;
  docId: any;
  data: any;
  bankFileModel: BankFileMap;
  contextPath: any;
  fileName: any;
  params = FccGlobalConstant.PARAMS;
  rendered = FccGlobalConstant.RENDERED;
  mode: any;
  subTnxTypeCode: any;
  amount: any;
  currency: any;
  actionReqCode: any;
  phrasesResponse: any;
  enteredCharCount = 'enteredCharCount';
  customerInstructionText = 'customerInstructionText';
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
              protected eventEmitterService: EventEmitterService, public fccGlobalConstantService: FccGlobalConstantService,
              protected phrasesService: PhrasesService, protected uploadFile: FilelistService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected irProductService: IrProductService) {
              super(eventEmitterService, stateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, uploadFile,
                dialogRef, currencyConverterPipe, irProductService);
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    if (this.mode === 'DRAFT') {
      this.actionReqCode = this.commonService.getQueryParametersFromKey('actionReqCode');
    }
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.initializeFormGroup();
    this.updateNarrativeCount();
  }
  initializeFormGroup() {
    const sectionName = 'irGeneralDetails';
    this.form = this.stateService.getSectionData(sectionName);
    this.commonService.formatForm(this.form);
    if (this.option !== FccGlobalConstant.ACTION_REQUIRED || !this.actionReqCode) {
      if (this.subTnxTypeCode === undefined || this.subTnxTypeCode === null || this.subTnxTypeCode === '') {
        this.subTnxTypeCode = FccGlobalConstant.N003_CORRESPONDENCE;
      }
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE), this.subTnxTypeCode, {});
      }
    if (this.form.get('bankComments')) {
        this.form.get('bankComments')[this.params][this.rendered] = false;
    }
    if (this.form.get(FccGlobalConstant.BANK_ATTACHMENT)) {
      this.form.get(FccGlobalConstant.BANK_ATTACHMENT)[this.params][this.rendered] = false;
    }
    this.mode = this.commonService.getQueryParametersFromKey('mode');
    if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
      this.commonService.getFileDetails(this.refId).subscribe(
        response1 => {
          for (const values of response1.body.items) {
            if (values.type === 'BANK') {
              this.uploadFile.resetBankList();
              this.form.get(FccGlobalConstant.BANK_ATTACHMENT)[this.params][this.rendered] = true;
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
      );
      if (this.form.get('bankComments').value && this.form.get('bankComments').value !== ' ') {
        this.form.get('bankComments')[this.params][this.rendered] = true;
      }
      this.renderedDraftFields();
    }
            
    const modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.IR_GENERAL_DETAILS)             
                              .get('transmissionMode');
    this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_IR,
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

  updateNarrativeCount() {
    if (this.form.get(this.customerInstructionText) && this.form.get(this.customerInstructionText).value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get(this.customerInstructionText).value);
      this.form.get(this.customerInstructionText)[this.params][this.enteredCharCount] = count;
    }
  }

  renderedDraftFields() {
    if (this.mode === 'DRAFT') {
      this.form.get('consentResponse')[this.params][this.rendered] = false;
      this.form.get('consentResponsevalue')[this.params][this.rendered] = false;
      this.form.updateValueAndValidity();
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
  onFocusConsentResponsevalue_46() {
    this.patchFieldValueAndParameters(this.form.get('consentResponsevalue'), FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK, {});
    this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
      FccGlobalConstant.N003_AMENDMENT_ADVICE_ACK, {});
  }

  onFocusConsentResponsevalue_47() {
    this.patchFieldValueAndParameters(this.form.get('consentResponsevalue'), FccGlobalConstant.N003_AMENDMENT_ADVICE_NACK, {});
    this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE),
      FccGlobalConstant.N003_AMENDMENT_ADVICE_NACK, {});
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
    this.stateService.setStateSection('irGeneralDetails', this.form);
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
      this.saveDraftService.changeSaveStatus('irGeneralDetails',
        this.stateService.getSectionData('irGeneralDetails'));
    }
    if (this.form.valid && !CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
    }
    if (this.form.invalid) {
      this.leftSectionService.removeSummarySection();
    }
  }

  onClickPhraseIcon(event, key) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_IR, key, '01', true);
      }
}
