import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';

import { FccGlobalConstantService } from '../../../../../../../app/common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../../app/common/core/fcc-global-constants';
import { FileHandlingService } from '../../../../../../../app/common/services/file-handling.service';
import { HideShowDeleteWidgetsService } from '../../../../../../../app/common/services/hide-show-delete-widgets.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { SiFileUploadDialogComponent } from '../si-file-upload-dialog/si-file-upload-dialog.component';
import { CommonService } from './../../../../../../../app/common/services/common.service';
import { SessionValidateService } from './../../../../../../../app/common/services/session-validate-service';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { DialogWindowControl } from './../../../../../../base/model/form-controls.model';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../../common/services/form-model.service';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import {
  ConfirmationDialogComponent,
} from './../../../../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { FilelistService } from './../../../../../../corporate/trade/lc/initiation/services/filelist.service';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { FileMap } from './../../../../../../corporate/trade/lc/initiation/services/mfile';
import { SiProductComponent } from './../si-product/si-product.component';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-si-file-upload-details',
  templateUrl: './si-file-upload-details.component.html',
  styleUrls: ['./si-file-upload-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiFileUploadDetailsComponent }]
})
export class SiFileUploadDetailsComponent extends SiProductComponent implements OnInit, OnDestroy {

  confirmMsg: string;
  resultOfConfirmation: string;
  maxNoOfFiles: number;
  maxSizeOfFile: number;
  imagePath: string;
  hideUploadButton: boolean;
  headerMessage: string;
  module: string;
  numberOfFilesRegex = 0;
  sizeOfFileRegex;
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
  rendered = 'rendered';
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
  productCodeValue = FccGlobalConstant.PRODUCT_LC;
  index: any;
  tableColumns = [];
  tnxTypeCode: any;
  numberOfFile: any;
  docId = [];
  dataParam = 'data';
  attachmentId = 'attachmentId';
  option: string;
  isFileNameValid = false;
  fileUploadRegex: any;
  isFileNameCharValid: boolean;
  isFileNameLengthValid = false;
  attachmentFileTitleRegex: any;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router, protected leftSectionService: LeftSectionService,
              public dialogService: DialogService, public uploadFile: FilelistService, public deleteFile: CommonService,
              public downloadFile: CommonService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              public autoUploadFile: CommonService, protected fileListSvc: FilelistService,
              protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected eventEmitterService: EventEmitterService, protected stateService: ProductStateService,
              protected fileHandlingService: FileHandlingService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
              protected siProductService: SiProductService, protected route: ActivatedRoute) {
                super(eventEmitterService, stateService, commonService, translateService, confirmationService,
                  customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileListSvc,
                  dialogRef, currencyConverterPipe, siProductService);
                this.module = this.translateService.instant('fileUploadDetails');
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeFormGroup();
    this.route.queryParamMap.subscribe((params: Params) => {
      this.option = params.get(`${FccGlobalConstant.OPTION}`);
    });
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.contextPath = this.fccGlobalConstantService.contextPath;
    // this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
    //   this.headerEnableOrDisable = data;
    // });
    window.scroll(0, 0);
    if (this.operation !== FccGlobalConstant.LIST_INQUIRY && this.operation !== FccGlobalConstant.PREVIEW) {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.numberOfFilesRegex = response.FileUploadMaxLimit;
        this.sizeOfFileRegex = response.FileUploadMaxSize;
        this.fileUploadMaxSize = response.FileUploadMaxSize;
	this.attachmentFileTitleRegex = response.attachmentFileTitleRegex;
        this.fileUploadRegex = this.commonService.decodeHtml(response.FileUploadRegex);
        this.form.get('fileMaxLimits')[this.params][this.label] = `${this.translateService.instant('Maximum_')}` + this.numberOfFilesRegex
                                                          + `${this.translateService.instant('_files_and_')}` + this.sizeOfFileRegex
                                                          + `${this.translateService.instant('_MB_each')}`;
        this.allFileExtensions = response.validFileExtensions.split(',');
        this.validFileExtensions = [];
        this.allFileExtensions.forEach(element => {
          //eslint-disable-next-line no-useless-escape
          if (this.validFileExtensions.indexOf(element.replace(/[\[\]"]/g, '').toUpperCase()) === -1) {
            //eslint-disable-next-line no-useless-escape
            this.validFileExtensions.push(element.replace(/[\[\]"]/g, '').toUpperCase());
          }
        });
        this.patchFieldParameters(this.form.get('fileExtnText'), { label: `${this.translateService.instant('fileUploadExtn')}` +
          `${this.validFileExtensions}` + `.` });
        this.showUploadedFiles();
      }
    });
  }
    const numberOfFiles = this.uploadFile.numberOfFiles;
    if (this.form.get('attachments').value[FccGlobalConstant.DOC_ID]) {
      this.renderBrowseButton(this.form.get('attachments').value[FccGlobalConstant.DOC_ID].length);
    }
    if (numberOfFiles <= this.numberOfFilesRegex ) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { hasError: false });
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: '' });
      this.form.updateValueAndValidity();
    }
    this.addEventsForDragDropArea();
    // if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
    //   this.form.get('save')[this.params][this.rendered] = false;
    // }
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
      const sectionName = 'siFileUploadDetails';
      let bankType;
      this.form = this.stateService.getSectionData(sectionName);
      const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
      if (mode === FccGlobalConstant.DRAFT_OPTION && this.fileList() && this.fileList().length > 0) {
        this.setAttachmentIds(this.fileList(), this.form);
      }
      if (this.tnxTypeCode === FccGlobalConstant.N002_INQUIRE) {
        bankType = this.stateService.getValue(FccGlobalConstant.SI_MESSAGE_GENERAL_DETAILS,
          FccGlobalConstant.BANK_ATTACHMENT_TYPE, false);
      }
      const flag = bankType === FccGlobalConstant.BANK ? false : true;
      this.operation = this.commonService.getQueryParametersFromKey('operation');
      if (flag && this.operation !== FccGlobalConstant.LIST_INQUIRY && this.operation !== FccGlobalConstant.PREVIEW) {
        this.patchFieldParameters(this.form.get(FccGlobalConstant.FILE_UPLOAD_TABLE), { columns: this.getColumns() });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.FILE_UPLOAD_TABLE), { data: this.fileList() });
      }
      if (this.operation !== FccGlobalConstant.LIST_INQUIRY && this.operation !== FccGlobalConstant.PREVIEW) {
        let tnxid = this.commonService.eventId ? this.commonService.eventId : this.commonService.getQueryParametersFromKey('tnxid');
        tnxid = this.commonService.isNonEmptyValue(tnxid) ? tnxid :
        this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_ID);
        this.fileHandlingService.getFileAttachment(tnxid, this.form);
      }
    }

    getSpinnerStyle() {
      const langDir = localStorage.getItem('langDir');
      if (langDir === 'rtl') {
        return 'spinnerRightStyle';
      } else {
        return 'spinnerLeftStyle';
      }
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
          this.commonService.getFileExtPath(filesArray[i].name), this.getFileSize(filesArray[i].size), null, null, null, null, null);
            if (this.isFileSizeValid && this.isFileExtValid && this.checkValidFileNameRegex(event)) {
              if(!this.isFileNameLengthValid && this.fileModel.title !== null && this.fileModel.title !== " " ) {
                this.fileModel.title = this.fileModel.title.substring(0,35);
              }
              this.fileModel.file = new File([this.fileModel.file], encodeURIComponent(this.fileModel.fileName),
              { type: this.fileModel.file.type, lastModified: this.fileModel.file.lastModified });
          await this.autoUploadFile.uploadAttachments(this.fileModel.file, this.fileModel.title, lcNumber, eventId).toPromise().then(
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

  checkFileExt(file: any) {
    return this.commonService.checkValidFileExtension(this.getFileExt(file.name), this.validFileExtensions);
  }

    onClickBrowseButton() {
    this.messageSet.clear();
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    let lcNumber = this.commonService.referenceId;
    let eventId = this.commonService.eventId;
    if (this.commonService.isnonEMptyString(this.stateService.isStateSectionSet('applicantBeneficiaryDetails', false))) {
    const entityDetails = this.stateService.getControl('siApplicantBeneficiaryDetails', 'applicantEntity');
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
    const dialogRef = this.dialogService.open(SiFileUploadDialogComponent, {
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
  }

  renderBrowseButton(numberOfFiles) {
    if (numberOfFiles < this.numberOfFilesRegex) {
      this.form.get('browseButton')[this.params][this.btndisable] = false;
    }
  }

  onClickDownloadIcon(event, key, index) {
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

  onClickTrashIcon(event, key, index) {
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: `${this.translateService.instant('deleteFile')}`,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: FccGlobalConstant.DELETE_ATTACHMENT_CONFIRMATION_MSG }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        const a = this.fileList()[index].attachmentId;
        this.deleteFile.deleteAttachments(a).subscribe();
        this.removeSelectedRow(a);
        this.form.controls.attachments.value.docId.splice(0);
        const numberOfFiles = this.uploadFile.numberOfFiles;
        if (numberOfFiles < this.numberOfFilesRegex ) {
          this.patchFieldParameters(this.form.get('fileUploadTable'), { hasError: false });
          this.patchFieldParameters(this.form.get('fileUploadTable'), { message: '' });
          this.form.updateValueAndValidity();
        }
      }
    });
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

  showMessage() {
    if (this.messageSet.has(0)) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: `${this.translateService.instant('MaxFileReached')}` });
    } else if (this.messageSet.has(1)) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: `${this.translateService.instant('fileAttachmentFailed')}` +
          this.sizeOfFileRegex + ` MB.` });
    } else if (this.messageSet.has(FccGlobalConstant.LENGTH_2)) {
      const errorMsg = `${this.translateService.instant('fileValidExtnError')} `
                                                            + this.validFileExtensions + `${this.translateService.instant('.')}`;
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: errorMsg });
      this.form.updateValueAndValidity();
    } else if (this.messageSet.has(FccGlobalConstant.LENGTH_3)) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: `${this.translateService.instant('entityNotSelected')}` });
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
      FccGlobalConstant.FILE_UPLOAD,
      this.form
    );
  }

  ngOnDestroy() {
    // if (this.form.get('fileUploadTable') && this.form.get('attachments')) {
    //   this.docId = [];
    //   const files = this.form.get('fileUploadTable')[this.params][this.dataParam];
    //   for (const index in files) {
    //     if (files[index]) {
    //       this.docId.push(files[index][this.attachmentId]);
    //     }
    //   }
    //   const attachments = { docId : this.docId};
    //   this.form.get('attachments').setValue(attachments);
    //   }
    this.stateService.setStateSection(FccGlobalConstant.SI_FILE_UPLOAD, this.form);
  }

  checkValidFileNameRegex(event): boolean {
    const fileName = event.files[0].name;
    if (!fileName.match(this.fileUploadRegex)) {
      return false;
    }
    return true;
}

}

