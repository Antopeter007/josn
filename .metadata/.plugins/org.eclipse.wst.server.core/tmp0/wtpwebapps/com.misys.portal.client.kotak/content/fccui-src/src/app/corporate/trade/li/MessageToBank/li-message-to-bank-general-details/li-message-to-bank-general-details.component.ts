import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { ProductMappingService } from './../../../../../common/services/productMapping.service';
import { TransactionDetailService } from './../../../../../common/services/transactionDetail.service';

import { ResolverService } from '../../../../../common/services/resolver.service';
import { FccTradeFieldConstants } from '../../../common/fcc-trade-field-constants';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { BankFileMap } from '../../../lc/initiation/services/bankmfile';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { LiProductService } from '../../services/li-product.service';
import { FCCFormControl, FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../common/services/form-model.service';
import { PhrasesService } from './../../../../../common/services/phrases.service';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import { LiProductComponent } from './../../li-product/li-product.component';
import { FileHandlingService } from './../../../../../common/services/file-handling.service';

@Component({
  selector: 'app-li-message-to-bank-general-details',
  templateUrl: './li-message-to-bank-general-details.component.html',
  styleUrls: ['./li-message-to-bank-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LiMessageToBankGeneralDetailsComponent }]
})
export class LiMessageToBankGeneralDetailsComponent extends LiProductComponent implements OnInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  @ViewChild('fccCommonTextArea') public fccCommonTextAreaId: ElementRef;
  module = `${this.translateService.instant('liMessageToBankGeneralDetails')}`;
  option: any;
  tableColumns = [];
  refId: any;
  tnxId: any;
  docId: any;
  data: any;
  bankFileModel: BankFileMap;
  contextPath: any;
  fileName: any;
  params = FccGlobalConstant.PARAMS;
  rendered = FccGlobalConstant.RENDERED;
  mode: any;
  subTnxTypeCode: any;
  actReqCode: any;
  phrasesResponse: any;
  enteredCharCount = 'enteredCharCount';
  customerInstructionText = 'customerInstructionText';
  lcConstant = new LcConstant();
  options = this.lcConstant.options;
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
                protected uploadFile: FilelistService, protected phrasesService: PhrasesService,
                protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
                protected resolverService: ResolverService, protected dialogRef: DynamicDialogRef,
                protected currencyConverterPipe: CurrencyConverterPipe, protected liProductService: LiProductService,
                protected transactionDetailService: TransactionDetailService, protected productMappingService: ProductMappingService,
                protected fileHandlingService: FileHandlingService) {
                super(eventEmitterService, stateService, commonService, translateService, confirmationService,
                  customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, uploadFile,
                  dialogRef, currencyConverterPipe, liProductService);
}

ngOnInit(): void {
  super.ngOnInit();
  this.contextPath = this.fccGlobalConstantService.contextPath;
  this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
  this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
  this.option = this.commonService.getQueryParametersFromKey('option');
  this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
  this.actReqCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.ACTION_REQUIRED_CODE);
  this.initializeFormGroup();
  this.updateNarrativeCount();
}

initializeFormGroup() {
  const sectionName = 'liMessageToBankGeneralDetails';
  this.form = this.stateService.getSectionData(sectionName);
  this.commonService.formatForm(this.form);
  this.editModeDataPopulate();
  if (this.subTnxTypeCode && this.option !== FccGlobalConstant.ACTION_REQUIRED && this.mode !== FccGlobalConstant.DISCREPANT
    && this.mode !== FccGlobalConstant.INITIATE) {
    this.subTnxTypeCode = FccGlobalConstant.N003_CORRESPONDENCE;
    this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE), this.subTnxTypeCode, {});
  }
  if (this.option === FccGlobalConstant.ACTION_REQUIRED) {
    this.form.get('createFromOptions')[this.params][this.rendered] = false;
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
            this.form.get(FccGlobalConstant.FILE_ATTACHMENT_TABLE).updateValueAndValidity();
            this.form.updateValueAndValidity();
          }
        }
      }
     }
    );
  }
  this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_LI,
    FccGlobalConstant.PARAMETER_P940,).subscribe(responseData => {
      if (responseData) {
        this.paramDataList = responseData.paramDataList;
        this.parameterList();
        this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_65;
        this.form.get(this.element)[this.params][this.maxLength] = this.customerInstnsLen;
        this.form.get(this.element)[this.params][this.allowedCharCount] = this.customerInstnsLen;
        // this.form.get(this.element)[this.params][this.maxRowCount] = this.customerInstnsRowCount;
        this.form.get(this.element).updateValueAndValidity();
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
  this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form)) {
   if ( this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.COPYFROM_LI) {
      this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(parentRefID);
      this.togglePreviewScreen(this.form, [FccGlobalConstant.PARENT_REF], false);
      this.initializeFormToDetailsResponse(parentRefID);
    } else if ( this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.LICOPY_FROM_LC) {
      this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(parentRefID);
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.LICOPY_FROM_LC);
      this.initializeFormToDetailsResponse(parentRefID);
    } else if ( this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.LICOPY_FROM_EL) {
      this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(parentRefID);
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.LICOPY_FROM_EL);
      this.initializeFormToDetailsResponse(parentRefID);
    }
  }
}

initializeFormToDetailsResponse(response: any) {
  this.transactionDetailService.fetchTransactionDetails(response).subscribe(responseData => {
    const responseObj = responseData.body;
    const liCardControl = this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS) as FCCFormControl;
    const cardData = this.productMappingService.getDetailsOfCardData(responseObj, liCardControl);
    this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS)[this.params][this.options] = cardData;
    this.form.get(FccGlobalConstant.PARENT_REF).patchValue(response);
    this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS)[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
    this.form.updateValueAndValidity();
  });
}

fileList() {
  return this.uploadFile.getBankList();
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
onClickPhraseIcon(event: any, key: any) {
  this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LI, key);
}
updateNarrativeCount() {
  if (this.form.get(this.customerInstructionText) && this.form.get(this.customerInstructionText).value) {
    const count = this.commonService.counterOfPopulatedData(this.form.get(this.customerInstructionText).value);
    this.form.get(this.customerInstructionText)[this.params][this.enteredCharCount] = count;
  }
}
saveFormOject() {
  this.stateService.setStateSection('liMessageToBankGeneralDetails', this.form);
}
onClickNext() {
  this.saveFormOject();
  if (!CommonService.isTemplateCreation) {
    this.leftSectionService.addSummarySection();
    this.saveDraftService.changeSaveStatus('liMessageToBankGeneralDetails',
      this.stateService.getSectionData('liMessageToBankGeneralDetails'));
  }
  if (this.form.valid && !CommonService.isTemplateCreation) {
    this.leftSectionService.addSummarySection();
  }
  if (this.form.invalid) {
    this.leftSectionService.removeSummarySection();
  }
}

}
