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
import { TransactionDetailService } from './../../../../../app/common/services/transactionDetail.service';
import { AccountDetailsList } from './../../../../common/model/accountDetailsList';
import { CorporateCommonService } from './../../../../corporate/common/services/common.service';
import { IcProductComponent } from './../ic-product/ic-product.component';
import { CurrencyConverterPipe } from './../../lc/initiation/pipes/currency-converter.pipe';
import { PhrasesService } from './../../../../common/services/phrases.service';
import { IcProductService } from '../services/ic-product.service';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FileHandlingService } from './../../../../common/services/file-handling.service';
import { amountCanNotBeZero, settlementAmtLessThanOutstandingAmt } from '../../lc/initiation/validator/ValidateAmt';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-ic-general-details',
  templateUrl: './ic-general-details.component.html',
  styleUrls: ['./ic-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: IcGeneralDetailsComponent }]
})
export class IcGeneralDetailsComponent extends IcProductComponent implements OnInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  @ViewChild('fccCommonTextArea') public fccCommonTextAreaId: ElementRef;
  module = `${this.translateService.instant('icGeneralDetails')}`;
  option: any;
  tableColumns = [];
  refId: any;
  tnxId: any;
  productCode: any;
  docId: any;
  data: any;
  bankFileModel: BankFileMap;
  contextPath: any;
  fileName: any;
  params = FccGlobalConstant.PARAMS;
  rendered = FccGlobalConstant.RENDERED;
  mode: any;
  subTnxTypeCode: any;
  actionReqCode: any;
  enteredCharCount = 'enteredCharCount';
  entityName: any;
  entityNameRendered: any;
  accounts = [];
  accountDetailsList: AccountDetailsList;
  customerInstructionText = 'customerInstructionText';
  settlementAmountWithCurrency = 'settlementAmountWithCurrency';
  isStaticAccountEnabled: boolean;
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
              protected eventEmitterService: EventEmitterService, public fccGlobalConstantService: FccGlobalConstantService,
              protected uploadFile: FilelistService, protected transactionDetailService: TransactionDetailService,
              protected corporateCommonService: CorporateCommonService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected resolverService: ResolverService,
              protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
              public phrasesService: PhrasesService, protected icProductService: IcProductService,
              protected fileHandlingService: FileHandlingService) {
              super(eventEmitterService, stateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, uploadFile,
                dialogRef, currencyConverterPipe, icProductService);
}

  ngOnInit(): void {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.option = this.commonService.getQueryParametersFromKey('option');
    this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    if (this.mode === 'DRAFT') {
      this.actionReqCode = this.commonService.getQueryParametersFromKey('actionReqCode');
    }
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.initializeFormGroup();
    this.iterateFields(FccGlobalConstant.IC_GENERAL_DETAILS, this.form.controls);
    this.updateNarrativeCount();
    if (this.form.get(this.settlementAmountWithCurrency)) {
      this.form.get(this.settlementAmountWithCurrency)[this.params][this.rendered] = false;
    }
    if (this.mode === 'DRAFT') {
      this.onBlurAmount();
    }
  }
  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_IC, key);
  }
  updateNarrativeCount() {
    if (this.form.get(this.customerInstructionText) && this.form.get(this.customerInstructionText).value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get(this.customerInstructionText).value);
      this.form.get(this.customerInstructionText)[this.params][this.enteredCharCount] = count;
    }
  }

    initializeFormGroup() {
      const sectionName = 'icGeneralDetails';
      this.form = this.stateService.getSectionData(sectionName);
      this.commonService.formatForm(this.form);
      this.form.get('consentResponse')[this.params][this.rendered] = false;
      this.form.get('consentResponsevalue')[this.params][this.rendered] = false;
      this.form.get('currencyCode')[this.params][this.rendered] = false;
      this.form.get('collectionAmount')[this.params][this.rendered] = false;
      this.form.get('outstandingAmount')[this.params][this.rendered] = false;
      this.form.get('outStandingCurrencyCode')[this.params][this.rendered] = false;
      if ((this.subTnxTypeCode !== null && this.subTnxTypeCode !== '' && this.subTnxTypeCode !== FccGlobalConstant.N003_SETTLEMENT_REQUEST)
      || this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
        this.form.get('settlementAmount')[this.params][this.rendered] = false;
        this.form.get('currency')[this.params][this.rendered] = false;
        this.form.get('amount')[this.params][this.rendered] = false;
        this.form.get('forwardContract')[this.params][this.rendered] = false;
        this.form.get('principalAct')[this.params][this.rendered] = false;
        this.form.get('feeAct')[this.params][this.rendered] = false;
        this.form.updateValueAndValidity();
        this.form.get('amount').clearValidators();
        this.setMandatoryField(this.form, 'amount', false);
      }
      if (this.option !== FccGlobalConstant.ACTION_REQUIRED) {
      if (this.subTnxTypeCode === undefined || this.subTnxTypeCode === null || this.subTnxTypeCode === '') {
        this.subTnxTypeCode = FccGlobalConstant.N003_CORRESPONDENCE;
      }
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE), this.subTnxTypeCode, {});
      } else if (this.option === FccGlobalConstant.ACTION_REQUIRED) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE), this.subTnxTypeCode, {});
      }
      this.form.get(FccGlobalConstant.BANK_ATTACHMENT)[this.params][this.rendered] = false;
      this.form.get('bankComments')[this.params][this.rendered] = false;
      this.mode = this.commonService.getQueryParametersFromKey('mode');
      if (this.option === FccGlobalConstant.ACTION_REQUIRED || this.actionReqCode) {
        const fileTnxId = ((this.commonService.isNonEmptyField(FccGlobalConstant.PARENT_TNX_ID, this.form) &&
        this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.PARENT_TNX_ID).value) &&
        this.form.get(FccGlobalConstant.PARENT_TNX_ID).value !== '') ? this.form.get(FccGlobalConstant.PARENT_TNX_ID).value : this.tnxId);
        this.fileHandlingService.getTnxFileDetails(fileTnxId ).subscribe(
        response1 => {
  if (response1) {
            this.uploadFile.resetBankList();
            for (const values of response1.body && response1.body.items) {
          if ( values.type === 'BANK') {
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
}
      );
        if (this.form.get('bankComments').value && this.form.get('bankComments').value !== ' ') {
        this.form.get('bankComments')[this.params][this.rendered] = true;
        }
        this.renderedDraftFields();
    }
      this.commonService.checkSettlementCurAndBaseCur(this.form);

      const modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.IC_GENERAL_DETAILS)
                              .get('transmissionMode');
        this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_IC,
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
    this.stateService.setStateSection('icGeneralDetails', this.form);
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

  onBlurAmount() {
    const iso = this.form.get(FccGlobalConstant.CURRENCY).value;
    const settlementamt = parseFloat(this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.AMOUNT_FIELD).value));
    parseFloat(this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.COLLECTION_AMOUNT).value));
    const outstandingAmt = parseFloat(this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.IC_OUTSTANDING_AMOUNT).value));
    if (this.form.get(FccGlobalConstant.AMOUNT_FIELD) && this.form.get(FccGlobalConstant.AMOUNT_FIELD).value) {
      let valueupdated = this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.AMOUNT_FIELD).value);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), iso);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValue(valueupdated);
      if (this.form.get('settlementAmountWithCurrency')) {
        this.form.get(this.settlementAmountWithCurrency).setValue(iso.concat(' ').concat(valueupdated));
      }
    }
    if (settlementamt !== null && settlementamt !== undefined && !(isNaN(settlementamt)) && (settlementamt <= FccGlobalConstant.ZERO)) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
      this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD,
        Validators.compose([Validators.required, amountCanNotBeZero]), 0);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ amountCanNotBeZero: true });
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).markAsDirty();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).markAsTouched();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
    } else if (settlementamt !== null && settlementamt !== undefined && !(isNaN(settlementamt)) &&
    (outstandingAmt !== null && outstandingAmt !== undefined && !(isNaN(outstandingAmt)) &&
    (settlementamt > outstandingAmt))) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
      this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD,
        Validators.compose([Validators.required, settlementAmtLessThanOutstandingAmt]), 0);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ settlementAmtLessThanOutstandingAmt: true });
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).markAsDirty();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).markAsTouched();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
    } else {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();

      if (this.subTnxTypeCode !== FccGlobalConstant.N003_CORRESPONDENCE) {
        this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD,
          Validators.compose([Validators.required]), 0);
      }
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).markAsDirty();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).markAsTouched();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
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
          if (myvalue[key].key === FccGlobalConstant.DRAWER_MESSAGE_ENTITY) {
               this.entityName = myvalue[key].value;
               this.entityNameRendered = myvalue[key].params.rendered;
          }
    });
    this.getAccounts();
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

  getUpdatedAccounts(): any[] {
    return this.accounts;
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

  onClickNext() {
    this.saveFormOject();
    if (!CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
      this.saveDraftService.changeSaveStatus('icGeneralDetails',
        this.stateService.getSectionData('icGeneralDetails'));
    }
    if (this.form.valid && !CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
    }
    if (this.form.invalid) {
      this.leftSectionService.removeSummarySection();
    }
}

 ngOnDestroy() {
  if (this.form !== undefined && this.form.get(FccGlobalConstant.AMOUNT_FIELD) &&
     this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.AMOUNT_FIELD).value)) {
    const amt = this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.AMOUNT_FIELD).value);
    if (amt <= FccGlobalConstant.ZERO) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValue(null);
    }
  }
  if (this.form.get(this.settlementAmountWithCurrency) &&
  (this.form.get(this.settlementAmountWithCurrency).value !== '' && this.form.get(this.settlementAmountWithCurrency).value !== null)) {
    this.form.get(this.settlementAmountWithCurrency)[this.params][this.rendered] = true;
  }
  if (this.form.get('collectionAmount') &&
  (this.form.get('collectionAmount').value !== '' && this.form.get('collectionAmount').value !== null)) {
    this.form.get('currencyCode')[this.params][this.rendered] = true;
    this.form.get('collectionAmount')[this.params][this.rendered] = true;
  }
  if (this.form.get('outstandingAmount') &&
  (this.form.get('outstandingAmount').value !== '' && this.form.get('outstandingAmount').value !== null)) {
    this.form.get('outstandingAmount')[this.params][this.rendered] = true;
    this.form.get('outStandingCurrencyCode')[this.params][this.rendered] = true;
  }

}
}
