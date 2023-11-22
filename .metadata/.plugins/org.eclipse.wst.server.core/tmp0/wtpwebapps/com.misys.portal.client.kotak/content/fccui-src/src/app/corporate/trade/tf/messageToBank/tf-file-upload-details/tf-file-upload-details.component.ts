import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';

import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { DialogWindowControl } from '../../../../../base/model/form-controls.model';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FileHandlingService } from '../../../../../common/services/file-handling.service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { HideShowDeleteWidgetsService } from '../../../../../common/services/hide-show-delete-widgets.service';
import { LcTemplateService } from '../../../../../common/services/lc-template.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../common/services/session-validate-service';
import { LeftSectionService } from '../../../../common/services/leftSection.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import {
  ConfirmationDialogComponent,
} from '../../../lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { FileMap } from '../../../lc/initiation/services/mfile';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { TfProductComponent } from '../../initiation/tf-product/tf-product/tf-product.component';
import { TfFileUploadDialogComponent } from '../tf-file-upload-dialog/tf-file-upload-dialog.component';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { TfProductService } from '../../services/tf-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tf-file-upload-details',
  templateUrl: './tf-file-upload-details.component.html',
  styleUrls: ['./tf-file-upload-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TfFileUploadDetailsComponent }]
})
export class TfFileUploadDetailsComponent extends TfProductComponent implements OnInit {

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
  fileModel: FileMap;
  allFileExtensions: any;
  processingFiles: any = [];
  messageSet: Set<number> = new Set<number>();
  contextPath: any;
  modeValue: any;
  index: any;
  tableColumns = [];
  tnxTypeCode: any;
  docId = [];
  dataParam = 'data';
  attachmentId = 'attachmentId';
  isFileNameValid = false;
  isFileNameLengthValid = false;
  attachmentFileTitleRegex: any;
  isFileExtValid = false;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router, protected leftSectionService: LeftSectionService,
              public dialogService: DialogService, public uploadFile: FilelistService, public deleteFile: CommonService,
              public downloadFile: CommonService, protected prevNextService: PrevNextService, protected utilityService: UtilityService,
              protected saveDraftService: SaveDraftService, protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              public autoUploadFile: CommonService, protected fileListSvc: FilelistService, public lcDetails: SaveDraftService,
              protected lcTemplateService: LcTemplateService, protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected emitterService: EventEmitterService, protected stateService: ProductStateService,
              protected fileHandlingService: FileHandlingService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected resolverService: ResolverService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected tfProductService: TfProductService) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, uploadFile, dialogRef, currencyConverterPipe,
      tfProductService);
    this.module = this.translateService.instant('tfFileUploadDetails');
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeFormGroup();
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.contextPath = this.fccGlobalConstantService.contextPath;
    // this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
    //   this.headerEnableOrDisable = data;
    // });
    window.scroll(0, 0);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.numberOfFilesRegex = response.FileUploadMaxLimit;
        this.sizeOfFileRegex = response.FileUploadMaxSize;
        this.fileUploadMaxSize = response.FileUploadMaxSize;
        this.attachmentFileTitleRegex = response.attachmentFileTitleRegex;
        this.form.get('fileMaxLimits')[this.params][this.label] = `${this.translateService.instant('Maximum_')}` + this.numberOfFilesRegex
                                                          + `${this.translateService.instant('_files_and_')}` + this.sizeOfFileRegex
                                                          + `${this.translateService.instant('_MB_each')}`;
        this.allFileExtensions = response.validFileExtensions.split(',');
        this.allFileExtensions.forEach(element => {
          //eslint-disable-next-line no-useless-escape
            this.validFileExtensions.push(element.replace(/[\[\]"]/g, '').toUpperCase());
        });
        this.patchFieldParameters(this.form.get('fileExtnText'), { label: `${this.translateService.instant('fileUploadExtn')}` +
          `${this.validFileExtensions}` + `.` });
        this.showUploadedFiles();
      }
    });
    const numberOfFiles = this.uploadFile.numberOfFiles;
    if (this.stateService.getSectionData('tfFileUploadDetails').get('attachments').value[FccGlobalConstant.DOC_ID]) {
      this.renderBrowseButton(this.stateService.getSectionData('tfFileUploadDetails')
      .get('attachments').value[FccGlobalConstant.DOC_ID].length);
    }
    if (numberOfFiles <= this.numberOfFilesRegex ) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { hasError: false });
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: '' });
      this.form.updateValueAndValidity();
    }
    this.addEventsForDragDropArea();
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
      const sectionName = 'tfFileUploadDetails';
      this.form = this.stateService.getSectionData(sectionName);
      this.patchFieldParameters(this.form.get('fileUploadTable'), { columns: this.getColumns() });
      this.patchFieldParameters(this.form.get('fileUploadTable'), { data: this.fileList() });
      // this.fileHandlingService.getFileAttachment(this.commonService.eventId, this.form);
      const operation = this.commonService.getQueryParametersFromKey('operation');
      const eventTab = this.commonService.getQueryParametersFromKey('eventTab');
      const transactionTab = this.commonService.getQueryParametersFromKey('transactionTab');
      const eventTnxId = this.commonService.getQueryParametersFromKey('eventTnxId');
      const reviewTnxId = this.commonService.getQueryParametersFromKey('reviewTnxId');
      const refID = this.commonService.getQueryParametersFromKey('referenceid');
      let tnxId;

      if (operation !== undefined && operation === 'LIST_INQUIRY') {

           if ( reviewTnxId && transactionTab ) {
            tnxId = reviewTnxId;
           } else if (eventTab && eventTnxId ) {
            tnxId = eventTnxId;
           }

           if (tnxId && tnxId !== '') {
          this.fileHandlingService.getFileAttachment(tnxId, this.form);
        } else {
          this.fileHandlingService.getFileAttachmentWithID(refID, this.form);
        }
      } else {
        let tnxid = this.commonService.eventId ? this.commonService.eventId : this.commonService.getQueryParametersFromKey('tnxid');
        tnxid = this.commonService.isNonEmptyValue(tnxid) ? tnxid :
        this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_ID);
        this.fileHandlingService.getFileAttachment(tnxid, this.form);
      }
    }

    ngOnDestroy() {
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
      this.stateService.setStateSection(FccGlobalConstant.FILE_UPLOAD, this.form);
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
    const lcNumber = this.commonService.referenceId;
    const eventId = this.commonService.eventId;
    for (let i = 0; i < filesLength; i++) {
      if (this.uploadFile.numberOfFiles < this.numberOfFilesRegex) {
        this.isValidFile = this.checkValidFile(filesArray[i]);
        this.isFileExtValid = this.checkValidFileExt(filesArray[i]);
        this.isFileNameLengthValid = this.checkValidFileNameLength(filesArray[i]);
        this.isFileNameValid = this.checkValidFileName(filesArray[i], this.attachmentFileTitleRegex);
        this.fileModel = new FileMap(filesArray[i], filesArray[i].name, filesArray[i].name, this.getFileExt(filesArray[i].name),
                         this.getFileExtPath(filesArray[i].name), this.getFileSize(filesArray[i].size), null, null, null, null, null);
        if (this.isValidFile) {
          this.fileModel.file = new File([this.fileModel.file], encodeURIComponent(this.fileModel.fileName),
          { type: this.fileModel.file.type, lastModified: this.fileModel.file.lastModified });
          await this.autoUploadFile.uploadAttachments(this.fileModel.file, this.fileModel.title, lcNumber, eventId).toPromise().then(
            response => {
              this.fileModel.attachmentId = response.docId;
              this.fileListSvc.pushFile(this.fileModel);
            }, (error: HttpErrorResponse) => {
              if (error.status === FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST) {
                if (error.error && error.error.detail) {
                  if (error.error.detail.indexOf(FccGlobalConstant.MALICIOUS) > -1){
                    this.messageSet.add(FccGlobalConstant.LENGTH_2);
                  }
              }
            }
            });
          } else if (!this.isValidFile) {
            this.messageSet.add(FccGlobalConstant.LENGTH_1);
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
    this.patchFieldParameters(this.form.get('fileUploadTable'), { hasError: false });
    // this.hideShowDeleteWidgetsService.customiseSubject.next(true);
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(TfFileUploadDialogComponent, {
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

  showUploadedFiles() {
      this.noOfFiles = this.uploadFile.numberOfFiles;
      this.renderBrowseButton(this.noOfFiles);
      if (this.noOfFiles !== 0) {
        this.patchFieldParameters(this.form.get('fileUploadTable'), { columns: this.getColumns() });
        this.patchFieldParameters(this.form.get('fileUploadTable'), { data: this.fileList() });
        this.patchFieldParameters(this.form.get('fileUploadTable'), { hasData: true });
        this.form.updateValueAndValidity();
        this.form.get('fileUploadTable').updateValueAndValidity();
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

  getFileExtPath(fileName: string) {
    return this.commonService.getFileExtPath(fileName);
  }

  showMessage() {
    if (this.messageSet.has(0)) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: `${this.translateService.instant('MaxFileReached')}` });
    } else if (this.messageSet.has(1)) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: `${this.translateService.instant('fileAttachmentFailed')}` +
          this.sizeOfFileRegex + ` MB.` });
    } else if (this.messageSet.has(FccGlobalConstant.LENGTH_2)) {
      this.patchFieldParameters(this.form.get('fileUploadTable'), { message: `${this.translateService.instant('maliciousContentError')}` });
    } else if (this.messageSet.has(FccGlobalConstant.LENGTH_4)) {
    this.patchFieldParameters(this.form.get('fileUploadTable'), { message: `${this.translateService.instant('fileTitleLengthExceeded')}` });
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

  onClickNext() {
    this.saveFormObject();
    this.saveDraftService.changeSaveStatus(FccGlobalConstant.FILE_UPLOAD,
    this.stateService.getSectionData(FccGlobalConstant.FILE_UPLOAD));
  }

  onClickPrevious() {
    this.saveFormObject();
    if (!CommonService.isTemplateCreation) {
    this.saveDraftService.changeSaveStatus(FccGlobalConstant.FILE_UPLOAD,
      this.stateService.getSectionData(FccGlobalConstant.FILE_UPLOAD));
    }
  }


  onClickCancel() {
  this.lcTemplateService.getConfirmaton();
  }


}
