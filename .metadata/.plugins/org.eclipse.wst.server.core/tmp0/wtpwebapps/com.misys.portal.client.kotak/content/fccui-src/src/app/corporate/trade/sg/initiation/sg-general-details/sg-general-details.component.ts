import { AfterViewChecked, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { FCCFormControl, FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { PhrasesService } from '../../../../../common/services/phrases.service';
import { ProductMappingService } from '../../../../../common/services/productMapping.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { TransactionDetailService } from '../../../../../common/services/transactionDetail.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { BankFileMap } from '../../../lc/initiation/services/bankmfile';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { expiryDateLessThanCurrentDate } from '../../../lc/initiation/validator/ValidateDates';
import { SgProductService } from '../../services/sg-product.service';
import { SgProductComponent } from '../../sg-product/sg-product.component';
import {
  ConfirmationDialogComponent,
} from './../../../lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { FccTradeFieldConstants } from '../../../common/fcc-trade-field-constants';
import { FileHandlingService } from './../../../../../common/services/file-handling.service';
import { Subscription } from 'rxjs';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';

@Component({
  selector: 'app-sg-general-details',
  templateUrl: './sg-general-details.component.html',
  styleUrls: ['./sg-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SgGeneralDetailsComponent }]
})
export class SgGeneralDetailsComponent extends SgProductComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  @ViewChild('fccCommonTextArea') public fccCommonTextAreaId: ElementRef;
  lcConstant = new LcConstant();
  module = `${this.translateService.instant(FccGlobalConstant.SG_GENERAL_DETAILS)}`;
  expiryDateField = 'expiryDate';
  params = this.lcConstant.params;
  readOnly = this.lcConstant.readonly;
  allowedCharCount = this.lcConstant.allowedCharCount;
  maximumlength = this.lcConstant.maximumlength;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  mode: any;
  tnxId: any;
  productCode: any;
  subTnxTypeCode: any;
  option: any;
  refId: any;
  docId: any;
  bankFileModel: BankFileMap;
  rendered = FccGlobalConstant.RENDERED;
  tableColumns = [];
  contextPath: any;
  tnxTypeCode: any;
  selectedRefId: string;
  descOfGoods = 'sgDescOfGoods';
  customerInstructionText = 'customerInstructionText';
  sgDetailsResponse: any;
  fromExisitingLcResponse;
  styleClass = this.lcConstant.styleClass;
  options = this.lcConstant.options;
  disabled = this.lcConstant.disabled;
  actionReqCode: any;
  entityName;
  copyFrom: any;
  custRefLength;
  previewScreen = this.lcConstant.previewScreen;
  paramDataList: any[] = [];
  customerInstnsLen : any;
  element = 'customerInstructionText';
  customerInstnsRowCount : number;
  maxRowCount = this.lcConstant.maxRowCount;
  cols = this.lcConstant.cols;
  key = FccGlobalConstant.KEY;
  sectionHeader = FccGlobalConstant.SECTION_HEADER;
  excludedFieldsNdSections: any;
  copyFromProductCode = '';
  excludingJsonFileKey = '';
  fieldsArray = [];
  sectionsArray = [];
  taskSubscription : Subscription;

  constructor(protected commonService: CommonService, protected stateService: ProductStateService,
              protected eventEmitterService: EventEmitterService, protected translateService: TranslateService,
              public uploadFile: FilelistService, protected phrasesService: PhrasesService,
              public fccGlobalConstantService: FccGlobalConstantService, protected elementRef: ElementRef,
              protected searchLayoutService: SearchLayoutService, protected transactionDetailService: TransactionDetailService,
              protected formModelService: FormModelService,
              protected dialogService: DialogService, protected productMappingService: ProductMappingService,
              protected resolverService: ResolverService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected utilityService: UtilityService,
              protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
              protected fccTaskService: FccTaskService,
              protected sgProductService: SgProductService, protected fileHandlingService: FileHandlingService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, uploadFile, dialogRef, currencyConverterPipe, sgProductService);
  }
  ngAfterViewChecked(): void {
    this.resetCreateFromOptions();
    if (this.form.get(this.expiryDateField)["params"]?.required) {
      this.form.get(this.expiryDateField).clearValidators();
      this.form.get(this.expiryDateField).setValidators([Validators.required]);
      this.form.get(this.expiryDateField).updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.actionReqCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.ACTION_REQUIRED_CODE);
    }
    this.initializeFormGroup();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.custRefLength = response.customerReferenceTradeLength;
        this.form.addFCCValidators('customerReference', Validators.maxLength(this.custRefLength), 0);
        this.form.addFCCValidators('beneficiaryReference', Validators.maxLength(this.custRefLength), 0);
      }
    });
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response && this.form.get(this.descOfGoods)) {
        this.form.addFCCValidators(this.descOfGoods, Validators.maxLength(response.tradeGoodsDescFieldLength), 0 );
        this.form.get(this.descOfGoods)[this.params][this.allowedCharCount] = response.tradeGoodsDescFieldLength;
        this.form.get(this.descOfGoods)[this.params][this.maximumlength] = response.tradeGoodsDescFieldLength;
        this.form.get(this.descOfGoods).updateValueAndValidity();
      }
    });

    if (this.form.get(this.descOfGoods)) {
      if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
        this.form.get(this.descOfGoods)[FccGlobalConstant.PARAMS][FccGlobalConstant.PHRASE_ENABLED] = true;
      } else {
        this.form.get(this.descOfGoods)[FccGlobalConstant.PARAMS][FccGlobalConstant.PHRASE_ENABLED] = false;
      }
      }
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.updateNarrativeCount();
    this.getExcludedFieldsNdSections();
    this.taskSubscription = this.fccTaskService.notifyTaskAfterSaveTnx$.subscribe(data => {
      if(data) {
      if (this.form && this.commonService.isNonEmptyField('removeLabel', this.form)) {
        this.form.get('removeLabel')[this.params][this.rendered] = false;
      }
      }
      });
  }

  ngOnDestroy() {
    if (this.form !== undefined && this.form.get(FccGlobalConstant.REMOVE_LABEL)) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
    }
    this.stateService.setStateSection(FccGlobalConstant.SG_GENERAL_DETAILS, this.form);
    if(this.taskSubscription != null && this.taskSubscription != undefined){
      this.taskSubscription.unsubscribe();
     }
  }

  getExcludedFieldsNdSections() {
    const productCode = FccGlobalConstant.PRODUCT_SG;
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

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.SG_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    if (this.subTnxTypeCode && this.subTnxTypeCode !== 'undefined' && this.option !== FccGlobalConstant.ACTION_REQUIRED
      && this.mode !== FccGlobalConstant.DISCREPANT
      && this.mode !== FccGlobalConstant.INITIATE) {
      this.subTnxTypeCode = FccGlobalConstant.N003_CORRESPONDENCE;
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE), this.subTnxTypeCode, {});
    }
    this.commonService.formatForm(this.form);
    if (this.option === FccGlobalConstant.ACTION_REQUIRED && this.mode !== FccGlobalConstant.DRAFT_OPTION) {
      this.setActionRequiredFields();
    }
    if (this.form.get(FccGlobalConstant.BANK_ATTACHMENT)) {
      this.form.get(FccGlobalConstant.BANK_ATTACHMENT)[this.params][this.rendered] = false;
    }
    if (this.form.get(FccGlobalConstant.BANK_COMMENT)) {
      this.form.get(FccGlobalConstant.BANK_COMMENT)[this.params][this.rendered] = false;
    }
    if (this.form.get(FccTradeFieldConstants.SG_CARD_DETAILS) &&
    this.form.get(FccTradeFieldConstants.SG_CARD_DETAILS)[this.params][this.rendered]) {
      this.form.get(FccTradeFieldConstants.SG_CARD_DETAILS)[this.params]['showRemoveLink'] = false;
    }
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
    }
    this.editModeDataPopulate();

    const transmissionModeControl = this.stateService.getSectionData(FccGlobalConstant.SG_GENERAL_DETAILS).get('transmissionMode');
    const modeOfTransmission = this.commonService.isNonEmptyValue(transmissionModeControl) ? transmissionModeControl.value : '';
        this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_SG,
          FccGlobalConstant.PARAMETER_P940,).subscribe(responseData => {
            if (responseData) {
              this.paramDataList = responseData.paramDataList;
                if (this.commonService.isNonEmptyValue(transmissionModeControl) &&
                this.commonService.isNonEmptyValue(transmissionModeControl.value) &&
                this.form.get(this.element)
                && modeOfTransmission === '01') {
                this.swiftModeTransmission();
                this.form.get(this.element).updateValueAndValidity();
                }
                else {
                  this.parameterList();
                  if (this.form.get(this.element))
                  {
                    if (this.form.get(this.element)[this.params])
                    {
                      this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_65;
                      this.form.get(this.element)[this.params][this.maximumlength] = this.customerInstnsLen;
                      this.form.get(this.element)[this.params][this.allowedCharCount] = this.customerInstnsLen;
                      // this.form.get(this.element)[this.params][this.maxRowCount] = this.customerInstnsRowCount;
                    }
                    this.form.get(this.element).updateValueAndValidity();
                  }
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
          if (this.form.get(this.element) && this.form.get(this.element)[this.params])
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
      if (this.subTnxTypeCode === FccGlobalConstant.N003_CORRESPONDENCE) {
      if (this.form.get(this.element) && this.form.get(this.element)[this.params])
      {
        // this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_35;
        this.form.get(this.element)[this.params][this.allowedCharCount] = FccGlobalConstant.LENGTH_35 * FccGlobalConstant.LENGTH_50;
        this.form.get(this.element)[this.params][this.maximumlength] = FccGlobalConstant.LENGTH_35 * FccGlobalConstant.LENGTH_50;
        this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_50;
      }
    }
  }
    handlecontrolComponentsData(controlData: any){
      if (controlData.has('customerInstructionText')) {
        const event = new KeyboardEvent('keyup');
        controlData.get('customerInstructionText').get('fccCommonTextAreaId').nativeElement.dispatchEvent(event);
      }
    }

    onClickPhraseIcon(event: any, key: any) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SG, key, '', true);
    }

    renderedFields() {
      if (this.form.get(FccGlobalConstant.BANK_COMMENT).value
        && this.form.get(FccGlobalConstant.BANK_COMMENT).value !== FccGlobalConstant.BLANK_SPACE_STRING) {
        this.form.get(FccGlobalConstant.BANK_COMMENT)[this.params][this.rendered] = true;
      } else if (this.form.get(FccGlobalConstant.PARENT_BANK_COMMENT).value
          && this.form.get(FccGlobalConstant.PARENT_BANK_COMMENT).value !== FccGlobalConstant.BLANK_SPACE_STRING) {
        this.form.get(FccGlobalConstant.BANK_COMMENT).patchValue(this.form.get(FccGlobalConstant.PARENT_BANK_COMMENT).value);
      }
    }

    updateNarrativeCount() {
      if (this.form.get(this.descOfGoods) && this.form.get(this.descOfGoods).value) {
        this.form.get(this.descOfGoods)[this.params][this.enteredCharCount] = this.form.get(this.descOfGoods).value.toString().length;
        this.form.get(this.descOfGoods).updateValueAndValidity();
        this.form.get(this.descOfGoods).markAllAsTouched();
        this.form.get(this.descOfGoods).markAsDirty();
      }
      if (this.form.get(this.customerInstructionText) && this.form.get(this.customerInstructionText).value) {
        const count = this.commonService.counterOfPopulatedData(this.form.get(this.customerInstructionText).value);
        this.form.get(this.customerInstructionText)[this.params][this.enteredCharCount] = count;
      }
    }

    onClickExpiryDate() {
      let expiryDate = this.form.get(this.expiryDateField).value;
      const currentDate = this.commonService.getBankDateForComparison();
      this.form.addFCCValidators(this.expiryDateField, Validators.pattern(FccGlobalConstant.datePattern), 0);
      this.form.get(this.expiryDateField).updateValueAndValidity();
      if ((expiryDate !== null && expiryDate !== '')) {
      expiryDate = `${expiryDate.getDate()}/${(expiryDate.getMonth() + 1)}/${expiryDate.getFullYear()}`;
      expiryDate = (expiryDate !== '' && expiryDate !== null) ?
                                  this.commonService.convertToDateFormat(expiryDate) : '';
      this.form.get(this.expiryDateField).clearValidators();
      if (expiryDate !== '' && (expiryDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) ) {
        this.form.get(this.expiryDateField).setValidators([expiryDateLessThanCurrentDate]);
        this.form.get(this.expiryDateField).updateValueAndValidity();
      } else {
        this.form.get(this.expiryDateField).clearValidators();
        this.form.get(this.expiryDateField).updateValueAndValidity();
      }
      } else {
        this.form.get(this.expiryDateField).clearValidators();
        this.form.get(this.expiryDateField).setValidators([Validators.required]);
        this.form.get(this.expiryDateField).updateValueAndValidity();
      }
      }


  fileList() {
    return this.uploadFile.getBankList();
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

  onClickCreateFromOptions(data: any) {
    if (data.value === 'copyFromSG') {
      this.onClickCopyFromSG();
    } else if (data.value === 'sgFromExistingLC') {
      this.onClickExistingLC();
    }
  }

  resetCreateFromOptions() {
    if (!(this.form.get(FccGlobalConstant.PARENT_REF) && this.form.get(FccGlobalConstant.PARENT_REF).value)) {
      if (this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)) {
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
      }
    }
  }

  onClickCopyFromSG() {
    this.setFieldsArrayNdSectionsData(false, FccGlobalConstant.PRODUCT_SG);
    const header = `${this.translateService.instant('existingSGList')}`;
    const productCode = FccGlobalConstant.PRODUCT;
    const headerDisplay = FccGlobalConstant.HEADER_DISPLAY;
    const buttons = FccGlobalConstant.BUTTONS;
    const savedList = FccGlobalConstant.SAVED_LIST;
    const option = FccGlobalConstant.OPTION;
    const downloadIconEnabled = FccGlobalConstant.DOWNLOAD_ICON_ENABLED;
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_SG;
    obj[option] = FccGlobalConstant.EXISTING_OPTION;
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    // const fieldsArray = ['expiryDate', 'customerReference'];

    this.resolverService.getSearchData(header, obj);
    this.sgDetailsResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (this.fromExisitingLcResponse !== undefined && this.fromExisitingLcResponse !== null) {
        this.fromExisitingLcResponse.unsubscribe();
      }
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        const prodCode = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
          && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
          FccGlobalConstant.PRODUCT_SG : undefined;
        const eventIdToPass = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
          && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
          response.responseData.TNX_ID : response.responseData.REF_ID;
        this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_SG).subscribe(apiMappingModel => {
        this.transactionDetailService.fetchTransactionDetails(eventIdToPass, prodCode, false).subscribe(responseData => {
        const responseObj = responseData.body;
        if ( !this.fieldsArray || this.fieldsArray.length === 0) {
          responseObj.sg_amt = '';
          responseObj.sg_cur_code = '';
        }
        const setStateForProduct = {
          responseObject: responseObj,
          apiModel: apiMappingModel,
          isMaster: false,
          fieldsList: this.fieldsArray,
          sectionsList: this.sectionsArray
        };
        this.commonService.productState.next(setStateForProduct);
        this.form = this.stateService.getSectionData(FccGlobalConstant.SG_GENERAL_DETAILS);
        this.stateService.getSectionData(FccGlobalConstant.SG_APPLICANT_BENEFICIARY)
        .get('transBeneficiaryEntity').setValue(responseObj.beneficiary_name);
        this.stateService.getSectionData(FccGlobalConstant.SG_APPLICANT_BENEFICIARY)
        .get('applicantEntity').setValue(responseObj.entity);
        this.form.get('createFromOptions')[this.params][this.rendered] = false;
        this.form.get('referenceSelected')[this.params][this.rendered] = true;
        this.form.get('fetchedRefValue')[this.params][this.rendered] = true;
        this.form.get('removeLabel')[this.params][this.rendered] = true;
        this.form.get('fetchedRefValue').patchValue(response.responseData.REF_ID);
        if ( !this.fieldsArray || this.fieldsArray.length === 0) {
          this.form.get('customerReference').setValue(FccGlobalConstant.EMPTY_STRING);
          this.form.get(FccTradeFieldConstants.BANK_REFERENCE).setValue(FccGlobalConstant.EMPTY_STRING);
          this.form.get(FccGlobalConstant.BENEFICIARY_REFERNCE).setValue(FccGlobalConstant.EMPTY_STRING);
        }
        this.commonService.loadDefaultConfiguration().subscribe(response => {
          if (response && this.form.get(this.descOfGoods)) {  
            this.form.addFCCValidators(this.descOfGoods, Validators.maxLength(response.tradeGoodsDescFieldLength), 0 );  
            this.form.get(this.descOfGoods)[this.params][this.allowedCharCount] = response.tradeGoodsDescFieldLength;  
            this.form.get(this.descOfGoods)[this.params][this.maximumlength] = response.tradeGoodsDescFieldLength; 
          }
        });
        this.updateNarrativeCount();
        this.patchFieldParameters(this.form.get('fetchedRefValue'), { readonly: true });
        this.form.get(FccGlobalConstant.PARENT_REF).patchValue(response.responseData.REF_ID);
        this.copyFrom = FccGlobalConstant.COPYFROM_SG_KEY;
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue('copyFromSG');
        this.form.get(FccTradeFieldConstants.SG_CARD_DETAILS)[this.params][this.rendered] = false;
        this.form.get(FccTradeFieldConstants.SG_CARD_DETAILS)[this.params][this.previewScreen] = false;
        const val = this.form.get('createFromOptions')[this.params][this.options];
        this.toggleCreateFormButtons(val, null, true);
      });
    });
      }
    });
  }

  onClickExistingLC() {
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
    obj[subProductCode] = 'LCSTD';
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    // const fieldsArray = ['expiryDate', 'customerReference', 'amount'];

    this.resolverService.getSearchData(header, obj);
    this.fromExisitingLcResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (this.sgDetailsResponse !== undefined && this.sgDetailsResponse !== null) {
          this.sgDetailsResponse.unsubscribe();
      }
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        this.transactionDetailService.fetchTransactionDetails(response.responseData.REF_ID, null, false).subscribe(responseData => {
          const responseObj = responseData.body;
          this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_SG).subscribe(apiMappingModel => {
          const setStateForProduct = {
            responseObject: responseObj,
            apiModel: apiMappingModel,
            isMaster: false,
            fieldsList: this.fieldsArray,
            sectionsList: this.sectionsArray
          };
          this.commonService.productState.next(setStateForProduct);
          this.form = this.stateService.getSectionData(FccGlobalConstant.SG_GENERAL_DETAILS);
          this.commonService.setLiCopyFrom('copiedFrom');
          this.initializeFormToDetailsResponse(response.responseData.REF_ID, this.mode);
          this.commonService.loadDefaultConfiguration().subscribe(response => {
            if (response && this.form.get(this.descOfGoods)) {  
              this.form.addFCCValidators(this.descOfGoods, Validators.maxLength(response.tradeGoodsDescFieldLength), 0 );  
              this.form.get(this.descOfGoods)[this.params][this.allowedCharCount] = response.tradeGoodsDescFieldLength;  
              this.form.get(this.descOfGoods)[this.params][this.maximumlength] = response.tradeGoodsDescFieldLength; 
            }
          });
          this.form.get('createFromOptions')[this.params][this.rendered] = false;
          this.form.get('referenceSelected')[this.params][this.rendered] = false;
          this.form.get('fetchedRefValue')[this.params][this.rendered] = false;
          this.form.get('removeLabel')[this.params][this.rendered] = false;
          this.form.get('parentReference').patchValue(response.responseData.REF_ID);
          this.form.get('lcRefId').patchValue(response.responseData.REF_ID);
          this.form.get('crossRefRefId').patchValue(response.responseData.REF_ID);
          this.form.get('crossRefTnxId').patchValue(response.responseData.TNX_ID);
          this.form.get('crossRefProductCode').patchValue(FccGlobalConstant.PRODUCT_LC);
          this.form.get('crossRefChildProductCode').patchValue(FccGlobalConstant.PRODUCT_SG);
          this.form.get('sgOption').patchValue(FccGlobalConstant.EXISTING_OPTION);
          this.form.get('boLcRefId').patchValue(responseObj.bo_ref_id);
          this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.SGCOPY_FROM_LC);
          if (!this.fieldsArray || this.fieldsArray.length === 0) {
            this.form.get(this.descOfGoods).setValue(null);
            this.form.get('customerReference').setValue(FccGlobalConstant.EMPTY_STRING);
            this.form.get(FccTradeFieldConstants.BANK_REFERENCE).setValue(FccGlobalConstant.EMPTY_STRING);
          }
          this.patchFieldParameters(this.form.get('fetchedRefValue'), { readonly: true });
          const val = this.form.get('createFromOptions')[this.params][this.options];
          this.copyFrom = FccGlobalConstant.COPYFROM_LC_KEY;
          this.toggleCreateFormButtons(val, '', true);
          this.form.updateValueAndValidity();
        });
      });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initializeFormToDetailsResponse(response: any, mode?: any) {
    this.transactionDetailService.fetchTransactionDetails(response).subscribe(responseData => {
      const responseObj = responseData.body;
      this.commonService.setLcResponse(responseObj);
      this.commonService.setParentTnxInformation(responseObj);
      this.selectedRefId = responseObj.ref_id;
      const refIdHeader = this.translateService.instant(FccTradeFieldConstants.SG_CARD_DETAILS) + " | " + this.selectedRefId;
      this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_SG).subscribe(apiMappingModel => {
      const setStateForProduct = {
        responseObject: responseObj,
        apiModel: apiMappingModel,
        isMaster: false,
        fieldsList: this.fieldsArray,
        sectionsList: this.sectionsArray
      };
      this.commonService.productState.next(setStateForProduct);
      this.form.get(FccGlobalConstant.PARENT_REF).patchValue(response);
      this.form.get(FccTradeFieldConstants.SG_CARD_DETAILS)[this.params][this.rendered] = true;
      this.form.get(FccTradeFieldConstants.SG_CARD_DETAILS)[this.params]['showRemoveLink'] = true;
      if (this.form.get(FccGlobalConstant.CREATE_FROM)) {
        this.form.get(FccGlobalConstant.CREATE_FROM)[this.params][this.rendered] = false;
      }
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
      if (this.form.get(this.descOfGoods).value === null || this.form.get(this.descOfGoods).value === '') {
        const displayValue = this.commonService.replacePhraseText(responseObj.narrative_description_goods.issuance.data.datum.text);
        const decodedValue = this.commonService.decodeHtml(displayValue);
        this.form.get(this.descOfGoods).setValue(decodedValue);
        this.phrasesService.updateNarrativeCount(this.form, this.descOfGoods);
        this.form.get(this.descOfGoods).updateValueAndValidity();
        this.form.get(this.descOfGoods).markAllAsTouched();
        this.form.get(this.descOfGoods).markAsDirty();

      }
      if (this.form.get(FccGlobalConstant.REFERENCE_SELECTED) && this.form.get(FccGlobalConstant.REFERENCE_SELECTED) != null) {
        this.form.get(FccGlobalConstant.REFERENCE_SELECTED)[this.params][this.rendered] = false;
      }
      this.form.get(FccGlobalConstant.PARENT_REF)[this.params][this.rendered] = false;
      const sgCardControl = this.form.get(FccTradeFieldConstants.SG_CARD_DETAILS) as FCCFormControl;
      const cardData = this.productMappingService.getDetailsOfCardData(responseObj, sgCardControl);
      this.form.get(FccTradeFieldConstants.SG_CARD_DETAILS)[this.params][this.sectionHeader] = refIdHeader;
      this.form.get(FccTradeFieldConstants.SG_CARD_DETAILS)[this.params][this.options] = cardData;
      this.stateService.getSectionData(FccGlobalConstant.SG_APPLICANT_BENEFICIARY)
      .get('transBeneficiaryEntity').setValue(responseObj.beneficiary_name);
      this.stateService.getSectionData(FccGlobalConstant.SG_APPLICANT_BENEFICIARY)
      .get('applicantEntity').setValue(responseObj.entity);
      this.form.updateValueAndValidity();
    });
  });
  }


  onClickRemoveSgCardDetails() {
    this.onClickRemoveLabel();
  }

  toggleCreateFormButtons(val, val1, enable) {
    val.forEach( (element) => {
      element[this.disabled] = enable;
    });
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
    const headerField = `${this.translateService.instant('removeSelectedTransaction')}`;
    const obj = {};
    const locaKey = 'locaKey';
    if ( this.copyFrom === FccGlobalConstant.COPYFROM_SG_KEY) {
      obj[locaKey] = FccGlobalConstant.COPYFROM_SG_KEY;
    } else if ( this.copyFrom === FccGlobalConstant.COPYFROM_LC_KEY) {
      obj[locaKey] = FccGlobalConstant.LICOPY_FROM_LC;
    }
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      data: obj,
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.copyFrom = null;
        this.commonService.setLiCopyFrom(null);
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
        this.commonService.setLcResponse(null);
        this.resetFieldsForCopyFrom();
      }
    });
  }

  /**
   *  Reset fields for Copy From on click on confirmation from dialog box
   */
  resetFieldsForCopyFrom(): void {
    if (this.sgDetailsResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.sgDetailsResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
    if (this.fromExisitingLcResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.fromExisitingLcResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
    this.productStateService.clearState();
    this.formModelService.getFormModel(FccGlobalConstant.PRODUCT_SG).subscribe(modelJson => {
      this.productStateService.initializeProductModel(modelJson);
      this.productStateService.initializeState(FccGlobalConstant.PRODUCT_SG);
      this.productStateService.populateAllEmptySectionsInState();
      this.form.reset();
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.CREATE_FROM)[this.params][this.rendered] = true;
      this.form.get('referenceSelected')[this.params][this.rendered] = false;
      this.form.get('fetchedRefValue')[this.params][this.rendered] = false;
      this.form.get('removeLabel')[this.params][this.rendered] = false;
      this.form.get('fetchedRefValue').setValue('');
      this.form.get('customerReference').setValue('');
      this.form.get('lcRefId').setValue('');
      this.form.get(FccTradeFieldConstants.SG_CARD_DETAILS)[this.params][this.rendered] = false;
      this.form.get('crossRefRefId').setValue('');
      this.form.get('crossRefTnxId').setValue('');
      this.form.get('crossRefProductCode').setValue('');
      this.form.get('crossRefChildProductCode').setValue('');
      this.form.get('crossRefChildRefId').setValue('');
      this.form.get('crossRefChildTnxId').setValue('');
      this.form.get('sgOption').setValue('');
      this.form.get('boLcRefId').setValue('');
      const val = this.form.get('createFromOptions')[this.params][this.options];
      this.toggleCreateFormButtons(val, '', false);
      this.form.get('createFromOptions').setValue('');
      if (this.form.get(this.descOfGoods) && this.form.get(this.descOfGoods).value === null) {
        this.form.get(this.descOfGoods)[this.params][this.enteredCharCount] = 0;
      }
    });
  }

  setActionRequiredFields() {
    this.transactionDetailService.fetchTransactionDetails(
      this.commonService.eventId ? this.commonService.eventId : this.tnxId, this.productCode).subscribe(response => {
      const responseObj = response.body;
      if (responseObj) {
        const actionRequiredCode = responseObj.action_req_code;
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.ACTION_REQUIRED_FIELD), actionRequiredCode, {});
      }
    });
  }

  editModeDataPopulate() {
    let parentRefID = null;
    if (this.form.get(FccGlobalConstant.PARENT_REF)) {
      parentRefID = this.form.get(FccGlobalConstant.PARENT_REF).value;
    }
    if (this.commonService.isNonEmptyValue(parentRefID) &&
    this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form) &&
    this.mode === FccGlobalConstant.DRAFT_OPTION) {
     if ( this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.SGCOPY_FROM_LC) {
        if (this.form.get(FccGlobalConstant.REFERENCE_SELECTED) && this.form.get(FccGlobalConstant.REFERENCE_SELECTED) != null) {
          this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(parentRefID);
        }
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.SGCOPY_FROM_LC);
        this.initializeFormToDetailsResponse(parentRefID, this.mode);
      } else if ( this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === 'copyFromSG') {
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue('copyFromSG');
        this.form.get(FccGlobalConstant.FETCH_REF_VALUE).patchValue(parentRefID);
        this.handlecopyFromFields();
      }
    }
  }

  handlecopyFromFields(response?: any) {
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.REFERENCE_SELECTED)[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.FETCH_REF_VALUE)[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
    if (this.commonService.isNonEmptyValue(response)){
      this.form.get(FccGlobalConstant.FETCH_REF_VALUE).patchValue(response.responseData.REF_ID);
      this.form.get(FccGlobalConstant.PARENT_REF).patchValue(response.responseData.REF_ID);
    } else if (this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.PARENT_REF).value)){
      this.form.get(FccGlobalConstant.FETCH_REF_VALUE).patchValue(this.form.get(FccGlobalConstant.PARENT_REF).value);
    }
    this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCH_REF_VALUE), { readonly: true });
    const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
    this.toggleCreateFormButtons(val, null, true);
   }

}
