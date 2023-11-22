/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { DropdownOptions } from '../../../../../../app/base/model/DropdownOptions';
import { DialogWindowControl } from '../../../../../../app/base/model/form-controls.model';
import { CodeData } from '../../../../../../app/common/model/codeData';
import { FileHandlingService } from '../../../../../../app/common/services/file-handling.service';
import { HideShowDeleteWidgetsService } from '../../../../../../app/common/services/hide-show-delete-widgets.service';
import { LcTemplateService } from '../../../../../../app/common/services/lc-template.service';
import { SessionValidateService } from '../../../../../../app/common/services/session-validate-service';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { FormControlService } from '../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import {
  ConfirmationDialogComponent,
} from '../../../lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { DocumentDetailsMap } from '../../../lc/initiation/services/documentmdetails';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FileMap } from '../../../lc/initiation/services/mfile';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { EcProductService } from '../../services/ec-product.service';
import { EcDocumentDialogComponent } from '../ec-document-dialog/ec-document-dialog.component';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import { EcProductComponent } from './../ec-product/ec-product.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TransactionDetailService } from './../../../../../common/services/transactionDetail.service';
import { AmendCommonService } from './../../../../../corporate/common/services/amend-common.service';

@Component({
  selector: 'app-ec-document-details',
  templateUrl: './ec-document-details.component.html',
  styleUrls: ['./ec-document-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EcDocumentDetailsComponent }]
})
export class EcDocumentDetailsComponent extends EcProductComponent implements OnInit, OnDestroy , AfterViewInit {
  confirmMsg: string;
  resultOfConfirmation: string;
  maxNoOfFiles: number;
  maxSizeOfFile: number;
  imagePath: string;
  hideUploadButton: boolean;
  headerMessage: string;
  module: string;
  numberOfFilesRegex = 0;
  sizeOfFileRegex: any;
  ele: any;
  form: FCCFormGroup;
  public data: FileMap[] = [];
  noOfFiles: number;
  blob: Blob;
  validFileExtensions: any = [];
  lcConstant = new LcConstant();
  totalSections = 11;
  headerEnableOrDisable: any;
  params = 'params';
  btndisable = 'btndisable';
  label = 'label';
  isValidFile = false;
  isFileSizeValid = false;
  isFileExtValid = false;
  fileModel: FileMap;
  allFileExtensions: any;
  processingFiles: any = [];
  messageSet: Set<number> = new Set<number>();
  contextPath: any;
  modeValue: any;
  productCodeValue = FccGlobalConstant.PRODUCT_EC;
  index: any;
  tableColumns = [];
  tnxTypeCode: any;
  numberOfFile: any;
  public documentCodesObj: DropdownOptions[] = [];
  columnsHeader = [];
  columnsHeaderData = [];
  formModelArray = [];
  responseArray = [];
  codeData = new CodeData();
  documentDetails: any;
  mode: any;
  documentTableDetails = 'documentTableDetails';
  name = 'name';
  type = 'type';
  required = 'required';
  maxlength = 'maxlength';
  disabled = 'disabled';
  docId = [];
  dataParam = 'data';
  attachmentId = 'attachmentId';
  documentModel: DocumentDetailsMap;
  documentFormValid = true;
  validationErrorFlag = false;
  dir = localStorage.getItem('langDir');
  btnFlag = false;
  option: string;
  showDatePickerInAddDocuments = true;
  showDatePicker = 'showDatePicker';
  originalCopyRequired: any;
  photoCopyRequired: any;
  isFileNameValid = false;
  isFileNameLengthValid = false;
  attachmentFileTitleRegex: any;
  fileUploadRegex: any;
  isFileNameCharValid: boolean;
  editEle: any;
  errorHeader = `${this.translateService.instant('errorTitle')}`;
  documentTable;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router, protected leftSectionService: LeftSectionService,
              public dialogService: DialogService, public uploadFile: FilelistService, public deleteFile: CommonService,
              public downloadFile: CommonService, protected prevNextService: PrevNextService, protected utilityService: UtilityService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService, protected searchLayoutService: SearchLayoutService,
              public autoUploadFile: CommonService, protected fileListSvc: FilelistService,
              protected lcTemplateService: LcTemplateService, protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected emitterService: EventEmitterService, protected stateService: ProductStateService,
              protected fileHandlingService: FileHandlingService, protected saveDraftService: SaveDraftService,
              protected dialogRef: DynamicDialogRef, protected resolverService: ResolverService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected currencyConverterPipe: CurrencyConverterPipe, protected datepipe: DatePipe,
              protected ecProductService: EcProductService, protected route: ActivatedRoute,
              protected transactionDetailService: TransactionDetailService,protected amendCommonService: AmendCommonService,
            ) {
    super(emitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, uploadFile, dialogRef, currencyConverterPipe, ecProductService);
    this.module = this.translateService.instant('ecDocumentDetails');
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeFormGroup();
    this.route.queryParamMap.subscribe((params: Params) => {
      this.option = params.get(`${FccGlobalConstant.OPTION}`);
    });
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.headerEnableOrDisable = data;
    });
    window.scroll(0, 0);
    const operation = this.commonService.getQueryParametersFromKey('operation');
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.numberOfFilesRegex = response.FileUploadMaxLimit;
        this.sizeOfFileRegex = response.FileUploadMaxSize;
        this.fileUploadMaxSize = response.FileUploadMaxSize;
        this.showDatePickerInAddDocuments = response.showDatePickerInAddDocuments;
        this.attachmentFileTitleRegex = response.attachmentFileTitleRegex;
        this.fileUploadRegex = this.commonService.decodeHtml(response.FileUploadRegex);

        this.form.get('fileMaxLimits')[this.params][this.label] = `${this.translateService.instant('Maximum_')}` + this.numberOfFilesRegex
                                                            + `${this.translateService.instant('_files_and_')}` + this.sizeOfFileRegex
                                                            + `${this.translateService.instant('_MB_each')}`;
        this.form.get(this.documentTableDetails)[this.params][this.showDatePicker] = response.showDatePickerInAddDocuments;
        this.allFileExtensions = response.validFileExtensions.split(',');
        this.validFileExtensions = [];
        this.allFileExtensions.forEach(element => {
          if (this.validFileExtensions.indexOf(element.replace(/[\\[\]"]/g, '').toUpperCase()) === -1) {
            this.validFileExtensions.push(element.replace(/[\\[\]"]/g, '').toUpperCase());
          }
        });
        this.patchFieldParameters(this.form.get('fileExtnText'), { label: `${this.translateService.instant('fileUploadExtn')}` +
            `${this.validFileExtensions}` + `.` });
      }
      if (this.option !== FccGlobalConstant.TEMPLATE) {
        this.originalCopyRequired = response.originalCopyRequired;
        this.photoCopyRequired = response.photoCopyRequired;
      }
    });
    setTimeout(() => {
      this.showUploadedFiles();
    }, FccGlobalConstant.LENGTH_500);
    this.addEventsForDragDropArea();
    const createFromOptions = this.stateService.getSectionData(FccGlobalConstant.EC_GENERAL_DETAILS)
    .get(FccGlobalConstant.CREATE_FROM_OPERATIONS);
    if ((this.mode === FccGlobalConstant.DRAFT_OPTION) ||
    (this.mode === FccGlobalConstant.INITIATE && createFromOptions && createFromOptions.value)) {
      // if (createFromOptions.value === FccGlobalConstant.TEMPLATE_VALUE) {
      //   this.clearDateFieldForTemplate();
      // }
      this.loadDraftFormAndSetErrors();
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.form.get(this.documentTableDetails)
    && this.form.get(this.documentTableDetails) !== null) {
      if (this.form.get(this.documentTableDetails).errors && this.form.get(this.documentTableDetails).errors !== null
      && this.form.get(this.documentTableDetails).errors.invalid) {
        this.isOriginalsNPhotocopiesRequired();
      }
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.setDocumentDetailsTable();
    }
    if(this.tnxTypeCode === FccGlobalConstant.N002_AMEND &&
      operation === FccGlobalConstant.LIST_INQUIRY && this.mode === FccGlobalConstant.VIEW_MODE) {
      this.setDocumentTableFromTransactionDetails();
    }
    if (this.mode === FccGlobalConstant.EXISTING && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      this.amendCommonService.compareTransactionAndMasterForAmend(productCode);
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.form.get('addDocTextNote')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('addDocTextError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('attachNotAllowed')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('docInstBank')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      }
    if (this.form.get(this.documentTableDetails)[this.params][this.dataParam]) {
      this.form.get(this.documentTableDetails)[this.params][this.dataParam] = this.documentList();
      setTimeout(() => {
        this.form.updateValueAndValidity();
      }, FccGlobalConstant.LENGTH_4000);
    }
    }

  clearDateFieldForTemplate() {
    const documentArr = this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
    if (documentArr.length > 0) {
      for (let i = 0; i < documentArr.length; i++) {
        documentArr[i].documentDate = '';
      }
      this.form.updateValueAndValidity();
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.form.get('attachNotAllowed')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
  }

  loadDraftFormAndSetErrors() {
    try {
    this.form.get(this.documentTableDetails)[this.params][this.dataParam] = this.documentList();
    const documentArr = this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
    for (let i = 0; i < documentArr.length; i++) {
      this.onkeyUpTextField('', '', documentArr[i]);
      if (this.validationErrorFlag) {
        break;
      }
    }
    } catch (err) {
      // Do nothing
    }
  }
  amendFormFields() {
    this.amendCommonService.setValueFromMasterToPrevious('ecDocumentDetails');
  }
  setDocumentDetailsTable() {
    if (sessionStorage.getItem('ecDocumentDetails') && sessionStorage.getItem('ecDocumentDetails') !== '' &&
      sessionStorage.getItem('ecDocumentDetails') !== null && sessionStorage.getItem('ecDocumentDetails') !== undefined) {
      this.fileListSvc.resetDocumentList();
      this.mappingData(JSON.parse(sessionStorage.getItem('ecDocumentDetails')));
      sessionStorage.removeItem('ecDocumentDetails');
      this.form.get(this.documentTableDetails)[this.params][this.dataParam] = this.documentList();
      this.form.get(this.documentTableDetails).setValue(this.documentList());
      this.handleDocumentUploadgrid();
      this.form.updateValueAndValidity();
    }
  }
  setDocumentTableFromTransactionDetails() {
    const tnxId = this.commonService.getQueryParametersFromKey('tnxid');
    this.transactionDetailService.fetchTransactionDetails(tnxId, FccGlobalConstant.PRODUCT_EC, false).subscribe(responseData => {
      const responseObj = responseData.body;
      if (typeof responseObj['documents'] !== 'undefined') {
        const documentObjectKeys = Object.keys(responseObj.documents);
        let document = [];
        if (typeof responseObj.documents.document['length'] !== 'undefined') {
          document = responseObj.documents.document;
        }
        else {
          for (let i = 0; i < documentObjectKeys.length; i++) {
            document.push(responseObj.documents[documentObjectKeys[i]]);
          }
        }
        this.documentTable = JSON.stringify(document);
        this.fileListSvc.resetDocumentList();
        this.mappingData(JSON.parse(this.documentTable));
        sessionStorage.removeItem('ecDocumentDetails');
        this.form.get(this.documentTableDetails)[this.params][this.dataParam] = this.documentList();
        this.form.get(this.documentTableDetails).setValue(this.documentList());
        this.handleDocumentUploadgrid();
        this.form.updateValueAndValidity();
      }
    });
  }
  mappingData(documentsJSON) {
    documentsJSON.forEach(element => {
      const selectedJson: {
        fileName: any; attachmentId: any, documentType: any, numOfOriginals: any,
        numOfPhotocopies: any, documentDate: any, documentName: any, total: any, documentNumber: any
      } = {
        fileName: element.mapped_attachment_name,
        attachmentId: element.mapped_attachment_id,
        documentType: element.code,
        numOfOriginals: element.first_mail,
        numOfPhotocopies: element.second_mail,
        documentDate: element.doc_date,
        documentName: element.name,
        total: element.total,
        documentNumber: element.doc_no
      };
      this.documentModel = new DocumentDetailsMap(selectedJson[FccGlobalConstant.FILE_NAME],
        selectedJson[FccGlobalConstant.ATTACHMENT_ID], selectedJson[FccGlobalConstant.DOCUMENT_TYPE],
        selectedJson[FccGlobalConstant.NUM_OF_ORIGINALS], selectedJson[FccGlobalConstant.NUM_OF_PHOTOCOPIES],
        selectedJson[FccGlobalConstant.DOCUMENT_DATE], selectedJson[FccGlobalConstant.DOCUMENT_NAME],
        selectedJson[FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS], selectedJson[FccGlobalConstant.DOCUMENT_NUMBER],
        false, 0);
      this.fileListSvc.pushDocumentDetailsMap(this.documentModel);
    });
  }

  ngAfterViewInit(): void {
    this.ecProductService.stepperSelected = true;
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
                  width: '30%'
                },
                {
                  field: 'fileName',
                  header: `${this.translateService.instant('fileName')}`,
                  width: '30%'
                },
                {
                  field: 'fileSize',
                  header: `${this.translateService.instant('fileSize')}`,
                  width: '10%'
                }];
      return this.tableColumns;
    }

    initializeFormGroup() {
      const sectionName = 'ecDocumentDetails';
      this.form = this.stateService.getSectionData(sectionName);
      this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
      const operation = this.commonService.getQueryParametersFromKey('operation');
      if (operation !== FccGlobalConstant.LIST_INQUIRY && operation !== FccGlobalConstant.PREVIEW) {
        this.patchFieldParameters(this.form.get('fileUploadTable'), { columns: this.getColumns() });
        this.patchFieldParameters(this.form.get('fileUploadTable'), { data: this.fileList() });
        let tnxid = this.commonService.eventId ? this.commonService.eventId : this.commonService.getQueryParametersFromKey('tnxid');
        tnxid = this.commonService.isNonEmptyValue(tnxid) ? tnxid :
        this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_ID);
        this.fileHandlingService.getFileAttachment(tnxid, this.form);
      }
      const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
      if (mode === FccGlobalConstant.DRAFT_OPTION && this.fileList() && this.fileList().length > 0) {
        this.setAttachmentIds(this.fileList(), this.form);
      }
      const createFromOptions = this.stateService.getSectionData(FccGlobalConstant.EC_GENERAL_DETAILS)
      .get(FccGlobalConstant.CREATE_FROM_OPERATIONS);
      if (((this.mode !== FccGlobalConstant.INITIATE) || (this.mode === FccGlobalConstant.INITIATE
        && createFromOptions && createFromOptions.value))
        && !this.commonService.formDocumentGrid && this.fileListSvc.numberOfDocuments === 0) {
          this.setDocuments();
        }
    }

    setDocuments() {
      if (this.fileListSvc.docsUpdated && this.form.get(FccGlobalConstant.DOCUMENTS).value !== null &&
        this.form.get(FccGlobalConstant.DOCUMENTS).value !== '' && this.form.get(FccGlobalConstant.DOCUMENTS).value !== undefined) {
        this.documentDetails = this.form.get(FccGlobalConstant.DOCUMENTS).value;
        this.commonService.formDocumentGrid = true;
        if (this.documentDetails) {
          const documentsJSON = JSON.parse(this.documentDetails);
          if (documentsJSON.document.length > 0) {
            documentsJSON.document.forEach(element => {
              const selectedJson: { fileName: any; attachmentId: any, documentType: any, numOfOriginals: any,
              numOfPhotocopies: any, documentDate: any, documentName: any, total: any, documentNumber: any } = {
                fileName: element.mapped_attachment_name,
                attachmentId: element.mapped_attachment_id,
                documentType: element.code,
                numOfOriginals: element.first_mail,
                numOfPhotocopies: element.second_mail,
                documentDate: element.doc_date,
                documentName: element.name,
                total: element.total,
                documentNumber: element.doc_no
              };
              this.documentModel = new DocumentDetailsMap(selectedJson[FccGlobalConstant.FILE_NAME],
                selectedJson[FccGlobalConstant.ATTACHMENT_ID], selectedJson[FccGlobalConstant.DOCUMENT_TYPE],
                selectedJson[FccGlobalConstant.NUM_OF_ORIGINALS], selectedJson[FccGlobalConstant.NUM_OF_PHOTOCOPIES],
                selectedJson[FccGlobalConstant.DOCUMENT_DATE], selectedJson[FccGlobalConstant.DOCUMENT_NAME],
                selectedJson[FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS], selectedJson[FccGlobalConstant.DOCUMENT_NUMBER],
                false, 0);
              this.fileListSvc.pushDocumentDetailsMap(this.documentModel);
            });
            this.handleDocumentUploadgrid();
            this.form.updateValueAndValidity();
          } else if (Object.keys(documentsJSON[FccGlobalConstant.DOCUMENT]).length > 0 && documentsJSON.constructor === Object) {
            const selectedJson: { fileName: any; attachmentId: any, documentType: any, numOfOriginals: any,
            numOfPhotocopies: any, documentDate: any, documentName: any, total: any, documentNumber: any } = {
            fileName: documentsJSON.document[FccGlobalConstant.MAPPED_ATTACHMENT_NAME],
            attachmentId: documentsJSON.document[FccGlobalConstant.MAPPED_ATTACHMENT_ID],
            documentType: documentsJSON.document[FccGlobalConstant.CODE],
            numOfOriginals: documentsJSON.document[FccGlobalConstant.FIRST_MAIL],
            numOfPhotocopies: documentsJSON.document[FccGlobalConstant.SECOND_MAIL],
            documentDate: documentsJSON.document[FccGlobalConstant.DOC_DATE],
            documentName: documentsJSON.document[FccGlobalConstant.NAME],
            total: documentsJSON.document[FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS],
            documentNumber: documentsJSON.document[FccGlobalConstant.DOC_NO]
          };
            this.documentModel = new DocumentDetailsMap(selectedJson[FccGlobalConstant.FILE_NAME],
              selectedJson[FccGlobalConstant.ATTACHMENT_ID], selectedJson[FccGlobalConstant.DOCUMENT_TYPE],
              selectedJson[FccGlobalConstant.NUM_OF_ORIGINALS], selectedJson[FccGlobalConstant.NUM_OF_PHOTOCOPIES],
              selectedJson[FccGlobalConstant.DOCUMENT_DATE], selectedJson[FccGlobalConstant.DOCUMENT_NAME],
              selectedJson[FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS], selectedJson[FccGlobalConstant.DOCUMENT_NUMBER],
              false, 0);
            this.fileListSvc.pushDocumentDetailsMap(this.documentModel);
            this.handleDocumentUploadgrid();
            this.form.updateValueAndValidity();
          }
        }
        this.fileListSvc.docsUpdated = false;
      }
    }

    handleDocumentUploadgrid() {
      this.codeData.codeId = FccGlobalConstant.CODEDATA_DOCUMENT_CODES_C064;
      this.codeData.productCode = this.productCodeValue;
      this.codeData.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
      this.codeData.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
      localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
      const eventDataArray = [];
      this.commonService.getCodeDataDetails(this.codeData).subscribe(response => {
        response.body.items.forEach(responseValue => {
            const eventData: { label: string; value: any } = {
              label: responseValue.longDesc,
              value: responseValue.value
            };
            eventDataArray.push(eventData);
          });
        });
        this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = eventDataArray;
        this.responseArray = this.documentList();
        this.formModelArray = this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.SUB_CONTROLS_DETAILS];
        this.columnsHeader = [];
        this.columnsHeaderData = [];
        this.formateResult();
        this.patchFieldParameters(this.form.get(this.documentTableDetails), { columns: this.columnsHeader });
        this.patchFieldParameters(this.form.get(this.documentTableDetails), { columnsHeaderData: this.columnsHeaderData });
        this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = this.responseArray;
        this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DOWNLOAD_ACTION] = 'pi-download';
        this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.TRASH_ACTION] = 'pi-trash';
        if (this.uploadFile.numberOfDocuments === 0) {
          this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        this.updateDataArray();
        this.form.updateValueAndValidity();
    }

    setValidations() {
      const documentArr = this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
      const option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
      if (documentArr.length > 0) {
        for (let i = 0; i < documentArr.length; i++) {
          const numOfOriginals = documentArr[i].numOfOriginals;
          const numOfPhotocopies = documentArr[i].numOfPhotocopies;
          const docNum = documentArr[i].documentNumber;
          const docDate = documentArr[i].documentDate;
          const docType = documentArr[i].documentType;
          const docname = documentArr[i].documentName;
          const documentDateRequired = documentArr[i].documentDateRequired;
          const documentNumberRequired = documentArr[i].documentNumberRequired;
          const documentTypeRequired = true;
          const numOfOriginalsRequired = true;
          const numOfPhotocopiesRequired = true;
          const documentnameRequired = true;
          this.checkFormMandatoryFields(docType, documentTypeRequired);
          if (docNum !== null && docNum !== undefined && docNum !== '' && documentDateRequired)
          {
            this.checkFormMandatoryFields(docDate, documentDateRequired);
          }
          if (docType === FccGlobalConstant.OTHER_DOCUMENT_TYPE)
          {
            this.checkFormMandatoryFields(docname, documentnameRequired);
          }
          if (this.originalCopyRequired === true && option !== FccGlobalConstant.TEMPLATE)
          {
            this.checkFormMandatoryFields(numOfOriginals, numOfOriginalsRequired);
            this.validateOriginals(numOfOriginals);
          }
          if (this.photoCopyRequired === true && option !== FccGlobalConstant.TEMPLATE)
          {
            this.checkFormMandatoryFields(numOfPhotocopies, numOfPhotocopiesRequired);
            this.validatephotocopies(numOfPhotocopies);
          }
          if (this.documentFormValid) {
            this.form.get(this.documentTableDetails).setErrors(null);
            this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = false;
          }
        }
      } 
      else if (this.form.get('docInstBank')[this.params][this.required] === true && option !== FccGlobalConstant.TEMPLATE)
      {
        this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
      }
    }

    validateOriginals(Originals: any)
    {
      if (Originals !== '' && this.commonService.isNonEmptyValue(Originals))
      {
        const isOriginalFieldValid =
        (Originals).match(FccGlobalConstant.NUMBER_REGEX_INCLUDING_ZERO);
        const numberOfOriginals = parseFloat(Originals);
        if (!isOriginalFieldValid || (numberOfOriginals <= FccGlobalConstant.ZERO))
        {
          this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
          this.documentFormValid = false;
        }
      }
    }

    validatephotocopies(Photocopies: any)
    {
      if (Photocopies !== '' && this.commonService.isNonEmptyValue(Photocopies))
      {
        const isPhotocopiesFieldValid =
        (Photocopies).match(FccGlobalConstant.NUMBER_REGEX_INCLUDING_ZERO);
        if (!isPhotocopiesFieldValid)
        {
          this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
          this.documentFormValid = true;
        }
      }
      if (Photocopies !== '' && this.commonService.isEmptyValue(Photocopies))
      {
        const isPhotocopiesFieldValid =
        (Photocopies).match(FccGlobalConstant.NUMBER_REGEX_INCLUDING_ZERO);
        if (!isPhotocopiesFieldValid)
        {
          this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
          this.documentFormValid = false;
        }
      }
    }

    checkFormMandatoryFields(fieldValue: any, fieldRequired: any) {
      if (!(fieldValue && fieldValue !== null && fieldValue !== '' &&
          fieldRequired && fieldRequired != null && fieldRequired !== '')) {
            this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
            this.documentFormValid = false;
          }
    }

    formateResult() {
      for (let i = 0; i < this.formModelArray.length; i++) {
        let key: any;
        key = Object.keys(this.formModelArray[i]);
        key = key[0];
        if (key === FccGlobalConstant.DOCUMENT_NAME)
        {
          const documentArr = this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
          if (documentArr.length > 0) {
            let count = 0;
            for (let j = 0; j < documentArr.length; j++) {
              if (documentArr[j].documentType === FccGlobalConstant.OTHER_DOCUMENT_TYPE )
              {
                count++;
              }
            }
            if ( count > 0 )
            {
              this.columnsHeader.push(key);
              const headerdata = this.translateService.instant(key);
              this.columnsHeaderData.push(headerdata);
            }
          }
        }
        else {
          this.columnsHeader.push(key);
          const headerdata = this.translateService.instant(key);
          this.columnsHeaderData.push(headerdata);
        }
      }
      for (let i = 0; i < this.responseArray.length; i++) {
        for (let j = 0; j < this.columnsHeader.length; j++) {
          Object.defineProperty(this.responseArray[i], this.columnsHeader[j],
            { value: this.getValue(this.responseArray[i][this.columnsHeader[j]]), writable: true });
          Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Type',
            { value: this.getType(this.columnsHeader[j], this.responseArray[i]), writable: true });
          Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Options',
            { value: this.getOptions(this.columnsHeader[j], this.responseArray[i]), writable: true });
          Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Status',
            { value: this.getEditStatus(this.columnsHeader[j], this.responseArray[i]), writable: true });
          Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Required',
            { value: this.getRequiredType(this.columnsHeader[j], this.responseArray[i]), writable: true });
          Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Maxlength',
            { value: this.getMaxlength(this.columnsHeader[j], this.responseArray[i]), writable: true });
          if (this.columnsHeader[j] === FccGlobalConstant.DOCUMENT_NAME &&
             this.responseArray[i][FccGlobalConstant.DOCUMENT_TYPE] === FccGlobalConstant.OTHER_DOCUMENT_TYPE)
          {
            Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Disabled',
            { value: false, writable: true });
          }
          else
          {
            Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Disabled',
            { value: this.getDisabledStatus(this.columnsHeader[j], this.responseArray[i]), writable: true });
          }
          if (this.columnsHeader[j].toString() === 'linkTo') {
            Object.defineProperty(this.responseArray[i], this.columnsHeader[j],
            { value: this.setOption(this.columnsHeader[j], this.responseArray[i]), writable: true });
          }
        }
      }
    }

    getValue(val: any) {
      if (val) {
        return val;
      } else {
        return '';
      }
    }

    setOption(key: any, Val: any) {
      const attId = Val.attachmentId;
      const fileName = Val.fileName;
      let linkedValue;
      if (attId === '' || attId === null){
        linkedValue = {
          label: '',
          value: {
            label: '',
            value: attId
          }
        };
      }
      else{
       linkedValue = {
        label: fileName,
        value: {
          label: fileName,
          value: attId
        }
      };
    }
      return linkedValue;
    }

    getOptions(key: any, typeVal: any) {
      let options = [];
      for (let i = 0; i < this.formModelArray.length; i++) {
        try {
          if ('linkTo' === this.formModelArray[i][key][this.name].toString()) {
            options.push({
              label : '',
              value: {
                label: '',
                value: ''
              }
            });
            this.uploadFile.fileMap.forEach(file => {
              const link = {
                label : file.fileName,
                value: {
                  label: file.fileName,
                  value: file.attachmentId
                }
              };
              options.push(link);
            });
          } else if ('documentType' === this.formModelArray[i][key][this.name].toString()) {
            options = this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
          }
        } catch (e) {
        }
      }
      return options;
    }

    getType(key: any, typeVal: any) {
      let returntype;
      for (let i = 0; i < this.formModelArray.length; i++) {
        try {
          if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
            returntype = this.formModelArray[i][key][this.type];
          }
        } catch (e) {
        }
      }
      return returntype;
    }

    getRequiredType(key: any, requiredType: any) {
      let returnRequiredType;
      for (let i = 0; i < this.formModelArray.length; i++) {
        try {
          if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
            returnRequiredType = this.formModelArray[i][key][this.required];
          }
        } catch (e) {
        }
      }
      return returnRequiredType;
    }

    getMaxlength(key: any, maxlength: any) {
      let returnMaxlength;
      for (let i = 0; i < this.formModelArray.length; i++) {
        try {
          if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
            returnMaxlength = this.formModelArray[i][key][this.maxlength];
          }
        } catch (e) {
        }
      }
      return returnMaxlength;
    }

    getDisabledStatus(key: any, writable: any) {
      let returnDisabled;
      for (let i = 0; i < this.formModelArray.length; i++) {
        try {
          if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
            returnDisabled = this.formModelArray[i][key][this.disabled];
          }
        } catch (e) {
        }
      }
      return returnDisabled;
    }

    getEditStatus(key, status) {
      const editStatus = 'editStatus';
      let returntype;
      for (let i = 0; i < this.formModelArray.length; i++) {
        try {
          if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
            returntype = this.formModelArray[i][key][editStatus];
          }
        } catch (e) {
        }
      }
      return returntype;
    }

    getSpinnerStyle() {
      const langDir = localStorage.getItem('langDir');
      if (langDir === 'rtl') {
        return 'spinnerRightStyle';
      } else {
        return 'spinnerLeftStyle';
      }
    }

    documentList() {
      return this.uploadFile.getDocumentList();
    }

    fileList() {
      return this.uploadFile.getList();
    }

  addEventsForDragDropArea() {
    setTimeout(() => {
      const doc = document.getElementsByClassName('ui-fileupload-content')[0] as HTMLElement;
      const innerDoc = document.getElementsByClassName('dragDropInner')[0] as HTMLElement;
      if (doc === undefined || doc === null) {
        return;
      }
      doc.addEventListener('drop', () => {
        doc.style.borderColor = FccGlobalConstant.FILEUPLOAD_DEFAULT_COLOR;
        innerDoc.style.opacity = '1';
      });
      doc.addEventListener('dragover', () => {
        doc.style.borderColor = FccGlobalConstant.FILEUPLOAD_HIGHLIGTED_COLOR;
        innerDoc.style.opacity = FccGlobalConstant.FILEUPLOAD_STYLE_OPACITY;
      });
      doc.addEventListener('dragleave', () => {
        doc.style.borderColor = FccGlobalConstant.FILEUPLOAD_DEFAULT_COLOR;
        innerDoc.style.opacity = '1';
      });
    }, FccGlobalConstant.LENGTH_2000);
  }

  startProcessing() {
    this.form.addControl('dialogWindow',
      new DialogWindowControl('dialogWindow', '', this.translateService, {
        label: `${this.translateService.instant('uploading')}`,
        displayPosition: true,
        rendered: true,
        columns: [
          {
            field: 'fileName',
            header: 'FILE NAME'
          }],
        data: this.getProcessingFiles(),
        showSpinner: true,
        positionLeft: 0,
        positionTop: 0,
        styleClass: 'dialogStyle',
        SpinnerStyle: this.getSpinnerStyle(),
        dialogStyleClass: 'dialogStyleClass'
      }),
    );
    this.form.updateValueAndValidity();
  }
  endProcessing() {
    this.form.removeControl('dialogWindow');
    this.showUploadedFiles();
  }

  getProcessingFiles() {
    return this.processingFiles;
  }

  addFilesToDialog(filesArray) {
    this.processingFiles = [];
    filesArray.forEach(element => {
      const file = { fileName: element.name };
      this.processingFiles.push(file);
    });
  }

  async onAutoUploadHandler(event, uploader: FileUpload) {
    this.messageSet.clear();
    this.patchFieldParameters(this.form.get('fileUploadTable'), { hasError: false });
    if (this.uploadFile.numberOfFiles >= this.numberOfFilesRegex) {
      uploader.clear();
      this.messageSet.add(0);
      this.showMessage();
      return;
    }
    const filesLength = event.files.length;
    const filesArray = event.files;
    this.addFilesToDialog(filesArray);
    uploader.clear();
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    let lcNumber = this.commonService.referenceId;
    let eventId = this.commonService.eventId;
    if (!(this.commonService.isNonEmptyValue(lcNumber) && lcNumber === '')
    && mode === FccGlobalConstant.DRAFT_OPTION) {
      lcNumber = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    }
    if (!(this.commonService.isNonEmptyValue(eventId) && eventId === '')
    && mode === FccGlobalConstant.DRAFT_OPTION) {
      eventId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_ID);
    }
    if (lcNumber === undefined || lcNumber === null || lcNumber === ''
        || eventId === undefined || eventId === null || eventId === '') {
          this.messageSet.add(FccGlobalConstant.LENGTH_3);
          this.showMessage();
          return;
    }
    for (let i = 0; i < filesLength; i++) {
      if (this.uploadFile.numberOfFiles < this.numberOfFilesRegex) {
        this.isFileSizeValid = this.checkValidFile(filesArray[i]);
        this.isFileExtValid = this.checkFileExt(filesArray[i]);
        this.isFileNameLengthValid = this.checkValidFileNameLength(filesArray[i]);
        this.isFileNameValid = this.checkValidFileName(filesArray[i], this.attachmentFileTitleRegex);
        this.isFileNameCharValid = this.checkValidFileNameRegex(event);
        this.fileModel = new FileMap(filesArray[i], filesArray[i].name, filesArray[i].name, this.getFileExt(filesArray[i].name),
                         this.getFileExtPath(filesArray[i].name), this.getFileSize(filesArray[i].size), null, null, null, null, null);
        if (this.isFileSizeValid && this.isFileExtValid && this.isFileNameValid) {
          if(!this.isFileNameLengthValid && this.fileModel.title !== null && this.fileModel.title !== " " ) {
            this.fileModel.title = this.fileModel.title.substring(0,35);
          }
          this.fileModel.file = new File([this.fileModel.file], encodeURIComponent(this.fileModel.fileName),
          { type: this.fileModel.file.type, lastModified: this.fileModel.file.lastModified });
          await this.autoUploadFile.uploadAttachments(this.fileModel.file,this.fileModel.title, lcNumber, eventId).toPromise().then(
            response => {
              this.fileModel.attachmentId = response.docId;
              this.fileListSvc.pushFile(this.fileModel);
            },
            (error: HttpErrorResponse) => {
              if (error.status === FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST) {
                if (error.error && error.error.detail) {
                  if (error.error.detail.indexOf(FccGlobalConstant.MALICIOUS) > -1){
                    return this.commonService.fileUploadHandlerService.antiVirusCheck(true, this.form);
                  } else {
                    const arr = error.error.detail.split(':');
                    let message = '';
                    if (arr.length > 1) {
                      message = arr[1].trim();
                    } else {
                      message = arr[0];
                    }
                    if (!this.isFileNameValid) {
                      this.messageSet.add(FccGlobalConstant.LENGTH_5);
                    }
                    this.erroreMsgMaxFile = message;
                    this.form.get('fileUploadTable')[this.params][this.label] = this.erroreMsgMaxFile;
                    this.form.get('fileUploadTable')[this.params][FccGlobalConstant.RENDERED] = true;
                    this.form.updateValueAndValidity();
                  }
                }
              }
            }
          );
          } else if (!this.isFileSizeValid) {
              this.messageSet.add(1);
          } else if (!this.isFileExtValid) {
            this.messageSet.add(FccGlobalConstant.LENGTH_2);
          } else if (!this.isFileNameLengthValid) {
            this.messageSet.add(FccGlobalConstant.LENGTH_4);
          } else if (!this.isFileNameValid) {
            this.messageSet.add(FccGlobalConstant.LENGTH_5);
          }
      } else {
        this.messageSet.add(0);
        break;
      }
    }
    this.endProcessing();
    this.showMessage();
  }

  getFileExt(fileName: string) {
    return fileName.split('.').pop();
  }

  checkValidFile(file) {
    const maxFileSize = FccGlobalConstant.FILEUPLOAD_MB_BYTE * this.sizeOfFileRegex;
    if (file.size === 0) {
        return false;
    } else if (file.size > maxFileSize) {
        return false;
    }
    return true;
  }

  checkFileExt(file: any) {
    return this.checkValidFileExt(this.getFileExt(file.name));
  }

  checkValidFileExt(fileExt): boolean {
    for (let i = 0; i < this.validFileExtensions.length; i++) {
      const ext: string = this.validFileExtensions[i].toLowerCase();
      if (ext.trim() === fileExt.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  checkValidFileNameLength(file: any) {
    if (file.name.length > 35) {
      return false;
    }
    return true;
  }

  checkValidFileName(file: any, regex: any) {
    if (!file.name.match(regex)) {
      return false;
    }
    return true;
  }

  onClickBrowseButton() {
    this.messageSet.clear();
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    let lcNumber = this.commonService.referenceId;
    let eventId = this.commonService.eventId;
    let entityDetails = null;
    if (this.option === FccGlobalConstant.TEMPLATE) {
      entityDetails = this.stateService.getControl('drawerDraweeDetails', 'draweeEntity');
    }
    // checking if option === 'TEMPLATE' && entity has been selected
    if (!(entityDetails && Object.values(entityDetails).length && this.option === FccGlobalConstant.TEMPLATE))
    {
        if (!(this.commonService.isNonEmptyValue(lcNumber) && lcNumber === '')
      && mode === FccGlobalConstant.DRAFT_OPTION) {
        lcNumber = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
      }
        if (!(this.commonService.isNonEmptyValue(eventId) && eventId === '')
      && mode === FccGlobalConstant.DRAFT_OPTION) {
        eventId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_ID);
      }
        if (lcNumber === undefined || lcNumber === null || lcNumber === ''
          || eventId === undefined || eventId === null || eventId === '') {
          this.messageSet.add(FccGlobalConstant.LENGTH_3);
          this.showMessage();
          return;
      }
  }
    this.numberOfFile = this.uploadFile.numberOfFiles;
    if (this.numberOfFile >= this.numberOfFilesRegex) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { hasError: true });
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: `${this.translateService.instant('MaxFileReached')}` });
      this.form.updateValueAndValidity();
      return;
    } else {
    this.patchFieldParameters(this.form.get('fileUploadTable'), { hasError: false });
    // this.hideShowDeleteWidgetsService.customiseSubject.next(true);
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(EcDocumentDialogComponent, {
      header: `${this.translateService.instant('fileDetails')}`,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir }
    });
    dialogRef.onClose.subscribe(() => {
      this.hideShowDeleteWidgetsService.customiseSubject.next(false);
      this.showUploadedFiles();
    });
  }
  }

  onClickAddDocumentsBtn() {
    let originalNumber = null;
    let photocopyNumber = null;
    if (!this.originalCopyRequired && !this.photoCopyRequired && this.option !== FccGlobalConstant.TEMPLATE){
      originalNumber = '0';
      photocopyNumber = '0';
    }
    this.documentModel = new DocumentDetailsMap('', '',
    this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.SUB_CONTROLS_DETAILS][0][
    FccGlobalConstant.DOCUMENT_TYPE][FccGlobalConstant.DEFAULT_VALUE],
    originalNumber, photocopyNumber , null, null, null, null, false, 0);
    if (this.fileListSvc.numberOfDocuments !== 0) {
      this.fileListSvc.documentDetailsMap.unshift(this.documentModel);
    } else {
      this.fileListSvc.pushDocumentDetailsMap(this.documentModel);
    }
    this.handleDocumentUploadgrid();
    if (this.originalCopyRequired && this.photoCopyRequired){
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
    }
    if (this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].length > 0) {
      this.form.get('addDocTextNote')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('addDocTextError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    setTimeout(() => {
      this.ele = document.querySelector('.documentNumber');
      if (this.ele !== null){
      this.ele.click();
      }
    }, 2500);
  }

  showUploadedFiles() {
      this.noOfFiles = this.uploadFile.numberOfFiles;
      this.renderBrowseButton(this.noOfFiles);
      if (this.noOfFiles !== 0) {
        this.patchFieldParameters(this.form.get('fileUploadTable'), { columns: this.getColumns() });
        this.patchFieldParameters(this.form.get('fileUploadTable'), { data: this.fileList() });
        this.patchFieldParameters(this.form.get('fileUploadTable'), { hasData: true });
        this.form.updateValueAndValidity();
        this.form.get('fileUploadTable').updateValueAndValidity();
        this.setAttachmentIds(this.fileList(), this.form);
      } else {
          this.patchFieldParameters(this.form.get('fileUploadTable'), { hasData: false });
          this.patchFieldParameters(this.form.get('fileUploadTable'), { data: this.fileList() });
          this.form.updateValueAndValidity();
          this.form.get('fileUploadTable').updateValueAndValidity();
          this.setAttachmentIds(this.fileList(), this.form);
      }
      this.handleDocumentUploadgrid();
      this.setValidations();
      const hasError = 'hasError';
      if (this.form.get(this.documentTableDetails)[this.params][hasError] === true) {
        this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = false;
      }
  }

  renderBrowseButton(numberOfFiles) {
    if (numberOfFiles < this.numberOfFilesRegex) {
      this.form.get('browseButton')[this.params][this.btndisable] = false;
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.form.get('browseButton')[this.params][this.btndisable] = true;
    } else {
      if (numberOfFiles >= this.numberOfFilesRegex || this.option === FccGlobalConstant.TEMPLATE) {
        this.form.get('browseButton')[this.params][this.btndisable] = true;
      } else {
        this.form.get('browseButton')[this.params][this.btndisable] = false;
      }
    }
  }

  onClickDownloadIcon(event: any, key: any, index: any) {
    const id = this.fileList()[index].attachmentId;
    const fileName = this.fileList()[index].fileName;
    this.downloadFile.downloadAttachments(id).subscribe(
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

  onClickTrashIcon(event: any, key: any, index: any) {
    if (key === 'documentTableDetails') {
    this.onClickMinusDocument(event, key, index);
   } else {
    const fName = this.fileList()[index].fileName;
    let locaKeyValue = this.translateService.instant('deleteConfirmationMsg');
    this.uploadFile.documentDetailsMap.forEach(doc => {
      if (doc.fileName === fName) {
        locaKeyValue = this.translateService.instant('deleteLinkDocConfirmationMsg');
      }});
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        header: `${this.translateService.instant('deleteFile')}`,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir },
        data: { locaKey: locaKeyValue }
      });
    dialogRef.onClose.subscribe((result: any) => {
        if (result.toLowerCase() === 'yes') {
          const a = this.fileList()[index].attachmentId;
          this.deleteFile.deleteAttachments(a).subscribe();
          this.removeSelectedRow(a);
          this.uploadFile.documentDetailsMap.forEach(doc => {
            if (doc.attachmentId === a) {
              doc.attachmentId = '';
              doc.fileName = '';
            }});
          this.handleDocumentUploadgrid();
          const numberOfFiles = this.uploadFile.numberOfFiles;
          if (numberOfFiles < this.numberOfFilesRegex ) {
            this.patchFieldParameters(this.form.get('fileUploadTable'), { hasError: false });
            this.patchFieldParameters(this.form.get('fileUploadTable'), { message: '' });
            this.form.updateValueAndValidity();
          }
        }
      });
    }
  }

  removeSelectedRow(deleteID: string) {
    let attids = null;
    let removeIndex = null;
    for (let i = 0; i < this.uploadFile.fileMap.length; ++i) {
      if (this.uploadFile.fileMap[i].attachmentId !== deleteID) {
          if (attids === null) {
              attids = this.uploadFile.fileMap[i].attachmentId;
          } else {
            attids = `${attids} | ${this.uploadFile.fileMap[i].attachmentId}`;
          }
        } else {
          removeIndex = i;
        }
      }
    if (removeIndex !== null) {
      this.uploadFile.fileMap.splice(removeIndex, 1);
    }
    if (this.uploadFile.fileMap.length === 0) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { hasData: false });
    }
    this.renderBrowseButton(this.uploadFile.numberOfFiles);
    this.showUploadedFiles();
  }

  removeSelectedDocRow(deleteID: string) {
    let attids = null;
    let removeIndex = null;
    for (let i = 0; i < this.uploadFile.documentDetailsMap.length; ++i) {
      if (this.uploadFile.documentDetailsMap[i].attachmentId !== deleteID) {
          if (attids === null) {
              attids = this.uploadFile.documentDetailsMap[i].attachmentId;
          } else {
            attids = `${attids} | ${this.uploadFile.documentDetailsMap[i].attachmentId}`;
          }
        } else {
          removeIndex = i;
        }
      }
    if (removeIndex !== null) {
      this.uploadFile.documentDetailsMap.splice(removeIndex, 1);
      if (this.uploadFile.numberOfDocuments === 0) {
        this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      } else {
        this.form.get(this.documentTableDetails)[this.params][this.dataParam] = this.documentList();
      }
      this.updateDataArray();
    }
    this.renderBrowseButton(this.uploadFile.numberOfFiles);
    this.showUploadedFiles();
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

  showMessage() {
    if (this.messageSet.has(0)) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: `${this.translateService.instant('MaxFileReached')}` });
    } else if (this.messageSet.has(1)) {
      this.patchFieldParameters(this.form.get('fileUploadTable'),
      { message: `${this.translateService.instant('fileAttachmentFailed')}` +
          this.sizeOfFileRegex + ` MB.` });
    } else if (this.messageSet.has(FccGlobalConstant.LENGTH_2)) {
      const errorMsg = `${this.translateService.instant('fileValidExtnError')} `
                                                            + this.validFileExtensions + `${this.translateService.instant('.')}`;
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: errorMsg });
      this.form.updateValueAndValidity();
    } else if (this.messageSet.has(FccGlobalConstant.LENGTH_3)) {
      this.patchFieldParameters(this.form.get('fileUploadTable'),
      { message: `${this.translateService.instant('entityNotSelected')}` });
    } else if (this.messageSet.has(FccGlobalConstant.LENGTH_4)) {
      this.patchFieldParameters(this.form.get('fileUploadTable'),
      { message: `${this.translateService.instant('fileTitleLengthExceeded')}` });
    } else if (this.messageSet.has(FccGlobalConstant.LENGTH_5)) {
      this.patchFieldParameters(this.form.get("fileUploadTable"), {
        message: `${this.translateService.instant("fileTitleInvalidError")}` + this.fileModel.fileName,
      });
    }
    if (this.messageSet.size !== 0) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { hasError: true });
      setTimeout(() => {
        this.patchFieldParameters(this.form.get('fileUploadTable'), { hasError: false });
        this.patchFieldParameters(this.form.get('fileUploadTable'), { message: '' });
     }, FccGlobalConstant.LENGTH_5000);
    }
  }

  saveFormObject() {
    this.stateService.setStateSection(
      FccGlobalConstant.EC_DOCUMENT_DETAILS,
      this.form
    );
  }
  displayMandatoryDocsNote() {
    if (typeof this.form !== 'undefined') {
      if (this.form.get(this.documentTableDetails) &&
        this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] &&
        this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] !== 'undefined' &&
        this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].length > 0) {
        this.form.get('addDocTextNote')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('addDocTextError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      else if (this.ecProductService.stepperSelected && this.form.get(this.documentTableDetails) &&
        this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].length <= 0) {
        if (this.option === FccGlobalConstant.TEMPLATE) {
          this.form.get('addDocTextNote')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('addDocTextError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        else {
          this.form.get('addDocTextNote')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('addDocTextError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        }
      }
      else {
        this.form.get('addDocTextNote')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('addDocTextError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
    }
  }

  ngOnDestroy() {
    if (this.form) {
      this.displayMandatoryDocsNote();
      if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.mode === 'DRAFT') {
        this.setDocuments();
      }
      this.updateDataArray();
      this.setValidations();
      if (this.form.get('fileUploadTable') && this.form.get('attachments')) {
        this.docId = [];
        const files = this.form.get('fileUploadTable')[this.params][this.dataParam];
        for (const index in files) {
         if (files[index]) {
            this.docId.push(files[index][this.attachmentId]);
          }
        }
        const attachments = { docId : this.docId };
        this.form.get('attachments').setValue(attachments);
      }
      this.stateService.setStateSection('ecDocumentDetails', this.form);
    }
    this.commonService.formDocumentGrid = false;
    this.isOriginalsNPhotocopiesRequired();
    this.form.updateValueAndValidity();
  }


  onClickCancel() {
  this.lcTemplateService.getConfirmaton();
  }

  onKeydownDateField(editTableRow: any) {
    const documentNumber = editTableRow[FccGlobalConstant.DOCUMENT_NUMBER];

    const isDocumentNumberNull = (documentNumber !== undefined && documentNumber !== null && documentNumber !== '');
    const isDocumentDateNull = (editTableRow[FccGlobalConstant.DOCUMENT_DATE] === undefined ||
                                editTableRow[FccGlobalConstant.DOCUMENT_DATE] === null ||
                                editTableRow[FccGlobalConstant.DOCUMENT_DATE] === '');
    if (isDocumentNumberNull && isDocumentDateNull) {
      this.makeDateFiledInvalidForDocDetails(editTableRow, false);
      return;
    } else {
      let docDateVal = editTableRow[FccGlobalConstant.DOCUMENT_DATE];
      docDateVal = docDateVal.replace(/[.-]/g, '/');
      if (!this.validateDate(docDateVal)) {
        this.makeDateFiledInvalidForDocDetails(editTableRow, false);
        return;
      }

      const datePattern = this.utilityService.getDateFormat();
      const isValidDateFormat = this.utilityService.isValidDateForGivenFormat(docDateVal, datePattern);
      if (!isValidDateFormat) {
        this.makeDateFiledInvalidForDocDetails(editTableRow, true);
        return;
      }

      editTableRow[FccGlobalConstant.DOCUMENT_DATE] = docDateVal;
      this.form.get(this.documentTableDetails).clearValidators();
      this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: false });
      this.updateDataArray();
      this.onkeyUpTextField('', '', editTableRow);
    }
  }

  makeDateFiledInvalidForDocDetails(editTableRow: any, setDateToNull: boolean) {
    this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
    this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
    this.patchFieldParameters(this.form.get(this.documentTableDetails),
      { message: `${this.translateService.instant('documentDateInvalid')}` });
    this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
    if (setDateToNull) {
      editTableRow[FccGlobalConstant.DOCUMENT_DATE] = '';
      this.form.updateValueAndValidity();
      this.updateDataArray();
      setTimeout(() => {
        this.onkeyUpTextField('', '', editTableRow);
      }, FccGlobalConstant.LENGTH_2000);
    } else {
      this.form.updateValueAndValidity();
    }
  }

  validateDate(incomingDate: any) {
    const datePatternRegex = FccGlobalConstant.datePattern;
    const regExp = new RegExp(datePatternRegex);
    const isValidDate = regExp.test(incomingDate);
    return isValidDate;
  }

  onBlurDateField(event: any, key: any, editTableRow: any) {
    localStorage.setItem('iseditCell',"false");
    if (!this.showDatePickerInAddDocuments) {
      this.onKeydownDateField(editTableRow);
    } else {
      this.onEnablingDatePicker(event, key, editTableRow);
    }
  }

  onEnablingDatePicker(event: any, key: any, editTableRow: any) {
    if ((editTableRow[FccGlobalConstant.DOCUMENT_NUMBER] !== undefined &&
      editTableRow[FccGlobalConstant.DOCUMENT_NUMBER] !== null && editTableRow[FccGlobalConstant.DOCUMENT_NUMBER] !== '') &&
      (editTableRow[FccGlobalConstant.DOCUMENT_DATE] === undefined ||
      editTableRow[FccGlobalConstant.DOCUMENT_DATE] === null || editTableRow[FccGlobalConstant.DOCUMENT_DATE] === '')) {
    this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
    this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
    this.patchFieldParameters(this.form.get(this.documentTableDetails),
      { message: `${this.translateService.instant('documentDateInvalid')}` });
    this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
    this.form.updateValueAndValidity();
    } else {
    const docDateVal = editTableRow[FccGlobalConstant.DOCUMENT_DATE];
    const docDate = this.utilityService.transformDateFormat(docDateVal);
    const applDate = new Date();
    const docCompareDate = new Date(docDateVal);
    if (docCompareDate > applDate){
      this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(this.documentTableDetails),
      { message: `${this.translateService.instant('documentMaxDateExceeded',
       { documentDate: docDate , applicationDate : this.utilityService.transformDateFormat(applDate) })}` });
      editTableRow[FccGlobalConstant.DOCUMENT_DATE] = null;
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.form.updateValueAndValidity();
      this.updateDataArray();
      setTimeout(() => {
        this.onkeyUpTextField('', '', editTableRow);
      }, FccGlobalConstant.LENGTH_2000);
      return;
    }
    const year = docDateVal.getFullYear();
    if (year.toString().length > 4) {
      this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(this.documentTableDetails),
      { message: `${this.translateService.instant('documentDateInvalid')}` });
      editTableRow[FccGlobalConstant.DOCUMENT_DATE] = null;
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.form.updateValueAndValidity();
      this.updateDataArray();
      setTimeout(() => {
        this.onkeyUpTextField('', '', editTableRow);
      }, FccGlobalConstant.LENGTH_2000);
      return;
    }
    editTableRow[FccGlobalConstant.DOCUMENT_DATE] = docDate;
    this.form.get(this.documentTableDetails).clearValidators();
    this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: false });
    this.updateDataArray();
    this.onkeyUpTextField('', '', editTableRow);
    }
  }

  dateDifference(currentDate: any, newDate: any) {
    const requestedIssueDateVal = new Date(currentDate);
    const maturityDateVal = new Date(newDate);
    const date1 = Date.UTC(requestedIssueDateVal.getFullYear(), requestedIssueDateVal.getMonth(), requestedIssueDateVal.getDate());
    const date2 = Date.UTC(maturityDateVal.getFullYear(), maturityDateVal.getMonth(), maturityDateVal.getDate());
    return Math.floor((date2 - date1) / FccGlobalConstant.ONE_DAY_TOTAL_TIME);
  }

  onkeyUpTextField(event: any, key: any, product: any) {
    localStorage.setItem('iseditCell',"false");
    const documentTypeRequired = product[FccGlobalConstant.DOCUMENT_TYPE_REQUIRED];
    const documentDateRequired = product[FccGlobalConstant.DOCUMENT_DATE_REQUIRED];
    if (product[FccGlobalConstant.DOCUMENT_NUMBER] !== undefined ||
      product[FccGlobalConstant.DOCUMENT_NUMBER] !== null ||
      product[FccGlobalConstant.DOCUMENT_NUMBER] !== '') {
        this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.SUB_CONTROLS_DETAILS][3][
      FccGlobalConstant.DOCUMENT_DATE].required = true;
      }
    if ( (documentTypeRequired === true) && (product[FccGlobalConstant.DOCUMENT_TYPE] === undefined ||
          product[FccGlobalConstant.DOCUMENT_TYPE] === null || product[FccGlobalConstant.DOCUMENT_TYPE] === '')) {
      this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(this.documentTableDetails),
            { message: `${this.translateService.instant('documentTypeRequired')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.validationErrorFlag = true;
    } else if ( (documentTypeRequired === true) &&
                ( product[FccGlobalConstant.DOCUMENT_TYPE] === FccGlobalConstant.OTHER_DOCUMENT_TYPE &&
                ( product[FccGlobalConstant.DOCUMENT_NAME] === undefined ||
                  product[FccGlobalConstant.DOCUMENT_NAME] === null ||
                  product[FccGlobalConstant.DOCUMENT_NAME] === '') ) ) {
                  this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
                  this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
                  this.patchFieldParameters(this.form.get(this.documentTableDetails),
                        { message: `${this.translateService.instant('documentNameRequired')}` });
                  this.form.updateValueAndValidity();
                  this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
                  this.validationErrorFlag = true;
    } else {
      this.validateDocumentNumber(product);
    }
  }

  validateDocumentNumber(product: any) {
    const documentNumberMaxlength = product[FccGlobalConstant.DOCUMENT_NUMBER_MAX_LENGTH];
    if (product[FccGlobalConstant.DOCUMENT_NUMBER] &&
      documentNumberMaxlength &&
      product[FccGlobalConstant.DOCUMENT_NUMBER].length > documentNumberMaxlength) {
      this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(this.documentTableDetails),
          { message: `${this.translateService.instant('documentNumberMaxlength')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.validationErrorFlag = true;
    } else {
      this.validateNumberOfOriginals(product);
    }
  }

  validateNumberOfOriginals(product: any) {
    const numOfOriginalsMaxlength = product[FccGlobalConstant.NUM_OF_ORIGINAL_MAX_LENGTH];
    if (this.originalCopyRequired && (product[FccGlobalConstant.NUM_OF_ORIGINALS] === undefined ||
        product[FccGlobalConstant.NUM_OF_ORIGINALS] === null || product[FccGlobalConstant.NUM_OF_ORIGINALS] === '')) {
      this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(this.documentTableDetails),
        { message: `${this.translateService.instant('numOfOriginalsRequired')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = false;
      this.validationErrorFlag = true;
      this.updateDataArray();
    } else if (product[FccGlobalConstant.NUM_OF_ORIGINALS].length > numOfOriginalsMaxlength) {
      this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(this.documentTableDetails),
          { message: `${this.translateService.instant('numOfOriginalsMaxlength')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.validationErrorFlag = true;
    } else if (product[FccGlobalConstant.NUM_OF_ORIGINALS] !== '' &&
     this.commonService.isNonEmptyValue(product[FccGlobalConstant.NUM_OF_ORIGINALS])) {
      const isOriginalFieldValid =
       (product[FccGlobalConstant.NUM_OF_ORIGINALS]).match(FccGlobalConstant.NUMBER_REGEX_INCLUDING_ZERO);
      const numberOfOriginals = parseFloat(product[FccGlobalConstant.NUM_OF_ORIGINALS]);
      if (this.originalCopyRequired && (!isOriginalFieldValid || (numberOfOriginals <= FccGlobalConstant.ZERO))) {
        this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
        this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
        this.patchFieldParameters(this.form.get(this.documentTableDetails),
          { message: `${this.translateService.instant('numOfOriginalsRegexFailed')}` });
        this.form.updateValueAndValidity();
        this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
        this.validationErrorFlag = true;
      } else {
        this.validateNumberOfPhotocopies(product);
      }
    } else {
      this.validateNumberOfPhotocopies(product);
    }
  }

  validateNumberOfPhotocopies(product: any) {
    const numOfPhotocopiesMaxlength = product[FccGlobalConstant.NUM_OF_PHOTOCOPIES_MAX_LENGTH];
    if (this.photoCopyRequired && (product[FccGlobalConstant.NUM_OF_PHOTOCOPIES] === undefined ||
        product[FccGlobalConstant.NUM_OF_PHOTOCOPIES] === null || product[FccGlobalConstant.NUM_OF_PHOTOCOPIES] === '')) {
      this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(this.documentTableDetails),
        { message: `${this.translateService.instant('numOfPhotocopiesRequired')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = false;
      this.validationErrorFlag = true;
      this.updateDataArray();
    } else if (product[FccGlobalConstant.NUM_OF_PHOTOCOPIES].length > numOfPhotocopiesMaxlength) {
      this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
      this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
      this.patchFieldParameters(this.form.get(this.documentTableDetails),
          { message: `${this.translateService.instant('numOfPhotocopiesMaxlength')}` });
      this.form.updateValueAndValidity();
      this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
      this.validationErrorFlag = true;
    } else if (product[FccGlobalConstant.NUM_OF_PHOTOCOPIES] !== '' && product[FccGlobalConstant.NUM_OF_PHOTOCOPIES] !== null) {
        const isPhotocopiesFieldValid =
         (product[FccGlobalConstant.NUM_OF_PHOTOCOPIES]).match(FccGlobalConstant.NUMBER_REGEX_INCLUDING_ZERO);
        if (this.photoCopyRequired && !isPhotocopiesFieldValid) {
          this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
          this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
          this.patchFieldParameters(this.form.get(this.documentTableDetails),
            { message: `${this.translateService.instant('numOfPhotocopiesRegexFailed')}` });
          this.form.updateValueAndValidity();
          this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = true;
          this.validationErrorFlag = true;
        } else {
          if (this.isAllRowValid()){
            this.invalidateErrorStateForDocumentGrid(); }
       }
      } else {
        if (this.isAllRowValid()){
          this.invalidateErrorStateForDocumentGrid(); }
      }
  }

  invalidateErrorStateForDocumentGrid() {
    this.form.get(this.documentTableDetails).clearValidators();
    this.form.get(this.documentTableDetails).setErrors(null);
    this.patchFieldParameters(this.form.get(this.documentTableDetails), { message: '' });
    this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: false });
    this.form.updateValueAndValidity();
    this.updateDataArray();
    this.checkEachRowValue();
    if (this.btnFlag) {
    this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = false;
    }
    this.validationErrorFlag = false;
    this.documentFormValid = true;
  }
  /**
   * Iterate through each row and if any of the column is empty then the add document button will not be enabled
   */
  checkEachRowValue() {
    const docArr = this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
    this.btnFlag = true;
    for (let i = 0; i < docArr.length; i++) {
      if (!(docArr[i].documentDate || docArr[i].numOfPhotocopies || docArr[i].numOfOriginals || docArr[i].documentNumber)) {
      this.btnFlag = false;
      break;
      }
    }
  }

  isAllRowValid(){
    const docArr = this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
    if (docArr && docArr.length > 0) {
      for (let i = 0; i < docArr.length; i++) {
        if ((this.commonService.isEmptyValue(docArr[i].documentDate) ||
        this.commonService.isEmptyValue(docArr[i].numOfPhotocopies) ||
        this.commonService.isEmptyValue(docArr[i].numOfOriginals)) && this.option !== FccGlobalConstant.TEMPLATE) {
          if ((docArr[i].documentDate === null || docArr[i].documentDate === undefined
            || docArr[i].documentDate === '')){
              this.patchFieldParameters(this.form.get(this.documentTableDetails),
                { message: `${this.translateService.instant('documentDateRequired')}` });
          }
          if ((docArr[i].numOfPhotocopies === null || docArr[i].numOfPhotocopies === undefined
            || docArr[i].numOfPhotocopies === '')) {
              this.patchFieldParameters(this.form.get(this.documentTableDetails),
                { message: `${this.translateService.instant('numOfPhotocopiesRequired')}` });
          }
          if ((docArr[i].numOfOriginals === null || docArr[i].numOfOriginals === undefined
            || docArr[i].numOfOriginals === '')) {
              this.patchFieldParameters(this.form.get(this.documentTableDetails),
                { message: `${this.translateService.instant('numOfOriginalsRequired')}` });
          }
          this.form.get(this.documentTableDetails).setErrors( { invalid: true } );
          this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
          this.form.updateValueAndValidity();
          return false;
      }
    }
  }
    return true;
}

  updateDataArray() {
    const finalArr = [];
    const documentArr = this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
    for (let i = 0; i < documentArr.length; i++) {
      const obj = {};
      obj[FccGlobalConstant.MAPPED_ATTACHMENT_ID] = (documentArr[i].attachmentId !== null) ? documentArr[i].attachmentId : '';
      obj[FccGlobalConstant.MAPPED_ATTACHMENT_NAME] = (documentArr[i].fileName !== null) ? documentArr[i].fileName : '';
      obj[FccGlobalConstant.FIRST_MAIL] = documentArr[i].numOfOriginals;
      obj[FccGlobalConstant.SECOND_MAIL] = documentArr[i].numOfPhotocopies;
      let numOfOriginals = parseInt(documentArr[i].numOfOriginals, 10);
      let numOfPhotocopies = parseInt(documentArr[i].numOfPhotocopies, 10);
      if (isNaN(numOfOriginals) || isNaN(numOfPhotocopies)) {
        if (isNaN(numOfOriginals)) {
          numOfOriginals = 0;
        }
        if (isNaN(numOfPhotocopies)) {
          numOfPhotocopies = 0;
        }
      }
      const total = numOfOriginals + numOfPhotocopies;
      const totalvalue = ( total === 0 ? '' : total);
      this.form.get(FccGlobalConstant.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA][i][
      FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS] = totalvalue;
      obj[FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS] = totalvalue.toString();
      obj[FccGlobalConstant.DOC_NO] = documentArr[i].documentNumber;
      obj[FccGlobalConstant.DOC_DATE] = documentArr[i].documentDate;
      obj[FccGlobalConstant.DOC_CODE] = documentArr[i].documentType;
      obj[FccGlobalConstant.NAME] = (documentArr[i].documentName !== null) ? documentArr[i].documentName : '';
      obj[FccGlobalConstant.DOCUMENT_ID] = documentArr[i].docId;
      finalArr.push(obj);
    }
    let obj2 = {};
    obj2[FccGlobalConstant.DOCUMENT] = finalArr;
    obj2 = JSON.stringify(obj2);
    this.form.get(FccGlobalConstant.DOCUMENTS).setValue(obj2);
    this.form.updateValueAndValidity();
  }

  onClickNext() {
    this.saveFormObject();
    if (!CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
      this.saveDraftService.changeSaveStatus(FccGlobalConstant.EC_DOCUMENT_DETAILS,
        this.stateService.getSectionData(FccGlobalConstant.EC_DOCUMENT_DETAILS));
    }
    if (this.form.valid && !CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
    }
    if (this.form.invalid) {
      this.leftSectionService.removeSummarySection();
    }
  }

  onClickPrevious() {
    this.saveFormObject();
    if (!CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
      this.saveDraftService.changeSaveStatus(FccGlobalConstant.EC_DOCUMENT_DETAILS,
        this.stateService.getSectionData(FccGlobalConstant.EC_DOCUMENT_DETAILS));
    }
    if (this.form.valid && !CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
    }
    if (this.form.invalid) {
      this.leftSectionService.removeSummarySection();
    }
  }

  onChangeDropdownField(event: any, key: any, editTableRow: any) {
    if (key.toString() === 'documentType')
    {
      if (event.srcElement !== undefined)
      {
        if (event && (event.value === FccGlobalConstant.OTHER_DOCUMENT_TYPE ||
          event.srcElement.innerText === this.translateService.instant(FccGlobalConstant.CODEDATA_C064_DEFAULT))) {
        this.handleDocumentUploadgrid();
        setTimeout(() => {
          editTableRow[FccGlobalConstant.DOCUMENT_NAME_DISABLED] = false;
          this.form.updateValueAndValidity();
        }, FccGlobalConstant.LENGTH_2000);
        setTimeout(() => {
          this.editEle = document.querySelector('.ui-editing-cell');
          if (this.editEle !== null){
          this.editEle.nextElementSibling.click();
          }
          }, 2000);
      }
    }
      else if (event && (event.value === FccGlobalConstant.OTHER_DOCUMENT_TYPE ||
          event.originalEvent.srcElement.innerText === this.translateService.instant(FccGlobalConstant.CODEDATA_C064_DEFAULT))) {
        this.handleDocumentUploadgrid();
        setTimeout(() => {
          editTableRow[FccGlobalConstant.DOCUMENT_NAME_DISABLED] = false;
          this.form.updateValueAndValidity();
        }, FccGlobalConstant.LENGTH_2000);
        setTimeout(() => {
          this.editEle = document.querySelector('.ui-editing-cell');
          if (this.editEle !== null){
          this.editEle.nextElementSibling.click();
          }
          }, 2000);
      }
     else {
      this.handleDocumentUploadgrid();
      setTimeout(() => {
      editTableRow[FccGlobalConstant.DOCUMENT_NAME_DISABLED] = true;
      editTableRow[FccGlobalConstant.DOCUMENT_NAME] = '';
    }, FccGlobalConstant.LENGTH_2000);
      setTimeout(() => {
      this.editEle = document.querySelector('.ui-editing-cell');
      if (editTableRow[FccGlobalConstant.DOCUMENT_NAME_DISABLED] && document.querySelector('.documentName')){
        if (this.editEle !== null){
          this.editEle.nextElementSibling.nextElementSibling.click();
          }
      } else{
      if (this.editEle !== null){
      this.editEle.nextElementSibling.click();
      }
    }
      }, 2000);
    }
      this.onkeyUpTextField(event, key , editTableRow);
  }
    if (key.toString() === 'linkTo' && event.value !== null && event.value !== '') {
      const attachmentId = event.value.value;
      let linkedFile;
      this.uploadFile.fileMap.forEach(file => {
        if (file.attachmentId === attachmentId) {
          linkedFile = file;
        }
      });
      editTableRow.attachmentId = attachmentId;
      editTableRow.fileName = linkedFile.fileName;
      this.updateDataArray();
      this.form.updateValueAndValidity();
    }
    this.handleDefaultCodeDataDisplay(event, editTableRow);
  }

  protected handleDefaultCodeDataDisplay(event: any, editTableRow: any) {
    if (event && event.value === undefined) {
      const srcEle = (this.commonService.isNonEmptyValue(event.srcElement)) ? event.srcElement.innerText : '';
      const language = localStorage.getItem(FccGlobalConstant.LANGUAGE);
      let defaultCodeDataValue = FccGlobalConstant.CODEDATA_C064_DEFAULT_EN;
      let defaultCodeValue = FccGlobalConstant.DOCUMENT_DEFAULT_CODE_VALUE_EN;
      if (language === FccGlobalConstant.LANGUAGE_AR || language === FccGlobalConstant.LANGUAGE_FR) {
        defaultCodeDataValue = FccGlobalConstant.CODEDATA_C064_DEFAULT;
        defaultCodeValue = FccGlobalConstant.DOCUMENT_DEFAULT_CODE_VALUE;
      }
      if (srcEle === this.translateService.instant(defaultCodeDataValue)) {
        editTableRow[FccGlobalConstant.DOCUMENT_TYPE] = defaultCodeValue;
        event.value = defaultCodeValue;
      }
    }
}
  onClickMinusDocument(event: any, key: any, index: any){
    const dir = localStorage.getItem('langDir');
    const locaKeyValue = this.translateService.instant('deleteDocsConfirmationMsg');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: `${this.translateService.instant('deletedocs')}`,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: locaKeyValue }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        if (index !== null) {
          this.uploadFile.documentDetailsMap.splice(index, 1);
          if (this.uploadFile.numberOfDocuments === 0) {
            this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            this.form.get(FccGlobalConstant.ADD_DOCUMENT_BUTTON)[FccGlobalConstant.PARAMS][this.btndisable] = false;
            this.invalidateErrorStateForDocumentGrid();
          } else {
            this.form.get(this.documentTableDetails)[this.params][this.dataParam] = this.documentList();
            const documentArr = this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
            let documentFormValidFlag = true;
            for (let i = 0; i < documentArr.length; i++)
            {
              this.onkeyUpTextField(event, key, documentArr[i]);
              if (this.validationErrorFlag === true)
              {
                documentFormValidFlag = false;
                break;
              }
            }
            if (documentFormValidFlag === true )
            {
              this.documentFormValid = true;
            }
          }
          this.handleDocumentUploadgrid();
          this.displayMandatoryDocsNote();
          this.form.updateValueAndValidity();
          this.updateDataArray();
          this.setValidations();
        }
      }
    });
  }
  checkValidFileNameRegex(event): boolean {
    const fileName = event.files[0].name;
    if (!fileName.match(this.fileUploadRegex)) {
      return false;
    }
    return true;
}
  isOriginalsNPhotocopiesRequired() {
    if (this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) {
      const documentArr = this.form.get(this.documentTableDetails)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
      for (let i = 0; i < documentArr.length; i++) {
        if (this.originalCopyRequired || (this.originalCopyRequired && this.photoCopyRequired)) {
          if ( (documentArr[i].numOfOriginals === undefined ||
            documentArr[i].numOfOriginals === null || documentArr[i].numOfOriginals === '')) {
            this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
            this.patchFieldParameters(this.form.get(this.documentTableDetails),
              { message: `${this.translateService.instant('numOfOriginalsRequired')}` });
            this.form.updateValueAndValidity();
            this.validationErrorFlag = true;
          }
          else if ((documentArr[i].numOfPhotocopies === undefined ||
            documentArr[i].numOfPhotocopies === null || documentArr[i].numOfPhotocopies === '')) {
              this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
              this.patchFieldParameters(this.form.get(this.documentTableDetails),
                { message: `${this.translateService.instant('numOfPhotocopiesRequired')}` });
              this.form.updateValueAndValidity();
              this.validationErrorFlag = true;
          }
        }
        else if (this.photoCopyRequired) {
          if ( (documentArr[i].numOfPhotocopies === undefined ||
            documentArr[i].numOfPhotocopies === null || documentArr[i].numOfPhotocopies === '')) {
            this.patchFieldParameters(this.form.get(this.documentTableDetails), { hasError: true });
            this.patchFieldParameters(this.form.get(this.documentTableDetails),
              { message: `${this.translateService.instant('numOfPhotocopiesRequired')}` });
            this.form.updateValueAndValidity();
            this.validationErrorFlag = true;
          }
        }
      }
    }
  }
}
