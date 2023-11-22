import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { TableService } from './../../../../../base/services/table.service';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import {
  ConfirmationDialogComponent
} from '../../../lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { ELMT700FileMap } from '../../../lc/initiation/services/elMT700mfile';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FileMap } from '../../../lc/initiation/services/mfile';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { ElFileUploadDailogComponent } from '../../assign/el-file-upload-dailog/el-file-upload-dailog.component';
import { ElProductComponent } from '../../el-product/el-product.component';
import { ElProductService } from '../../services/el-product.service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { DialogWindowControl } from './../../../../../base/model/form-controls.model';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { FileHandlingService } from './../../../../../common/services/file-handling.service';
import { HideShowDeleteWidgetsService } from './../../../../../common/services/hide-show-delete-widgets.service';
import { LcTemplateService } from './../../../../../common/services/lc-template.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-el-mt700-upload-details',
  templateUrl: './el-mt700-upload-details.component.html',
  styleUrls: ['./el-mt700-upload-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ElMT700UploadDetailsComponent }]
})
export class ElMT700UploadDetailsComponent extends ElProductComponent implements OnInit, OnDestroy {

  module: string;
  numberOfFilesRegex = 0;
  sizeOfFileRegex;
  form: FCCFormGroup;
  public data: FileMap[] = [];
  noOfFiles: number;
  blob: Blob;
  validFileExtensions: any = [];
  params = 'params';
  btndisable = 'btndisable';
  rendered = 'rendered';
  label = 'label';
  elMT700FileModel: ELMT700FileMap;
  allFileExtensions: any;
  processingFiles: any = [];
  messageSet: Set<number> = new Set<number>();
  contextPath: any;
  index: any;
  tableColumns = [];
  tnxTypeCode: any;
  docId: any;
  attachmentId = 'attachmentId';
  numberOfFile: any;
  isFileSizeValid = false;
  isFileExtValid = false;
  operation: string;
  dataParam = 'data';
  noOfAttachments: any;
  errorDispaly: any;
  responseObj: any;
  blurBrowseButton = false;
  clickedValidateButton = false;
  errorHeader = `${this.translateService.instant('errorTitle')}`;

  constructor(protected eventEmitterService: EventEmitterService, protected commonService: CommonService,
              protected translateService: TranslateService, protected router: Router,
              public dialogService: DialogService, public uploadFile: FilelistService,
              protected utilityService: UtilityService, protected saveDraftService: SaveDraftService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService, protected fileListSvc: FilelistService,
              protected lcTemplateService: LcTemplateService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected stateService: ProductStateService, protected fileHandlingService: FileHandlingService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService, protected resolverService: ResolverService,
              protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
              protected elProductService: ElProductService, protected taskService: FccTaskService, protected tableService: TableService) {
              super(eventEmitterService, stateService, commonService, translateService, confirmationService,
                  customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileListSvc,
                  dialogRef, currencyConverterPipe, elProductService);
              this.module = this.translateService.instant('elUploadMT700');
  }

  @ViewChild(ElFileUploadDailogComponent) public fileDialogReference;

  ngOnInit() {
    super.ngOnInit();
    this.initializeFormGroup();
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.contextPath = this.fccGlobalConstantService.contextPath;
    window.scroll(0, 0);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.sizeOfFileRegex = response.FileUploadMaxSize;
        this.fileUploadMaxSize = response.FileUploadMaxSize;
        const MT700FileUploadLimit = response.MT700FileUploadMaxLimit;
        const MT701FileUploadLimit = response.MT701FileUploadMaxLimit;
        this.numberOfFilesRegex = parseInt(MT700FileUploadLimit, 10) + parseInt(MT701FileUploadLimit, 10);
        this.form.get('fileMaxLimits')[this.params][this.label] =
        `${this.translateService.instant('Maximum_')}` + MT700FileUploadLimit
        + `${this.translateService.instant('MT700_AND_')}` + MT701FileUploadLimit + `${this.translateService.instant('MT701_')}`
        + `${this.translateService.instant('_files_and_')}` + this.sizeOfFileRegex + `${this.translateService.instant('_MB_each')}`;
        this.allFileExtensions = response.MT700AllowedFileExtensions.split(',');
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
    this.addEventsForDragDropArea();
    if (this.form.get("attachmentsMT").value.docId !== undefined &&
    this.form.get("successMessageMT700")[this.params][this.rendered] === true) {
      this.form.get('view')[this.params][this.btndisable] = false;
      this.form.get('successMessageMT700')[this.params][this.rendered] = true;
      this.form.get('validateMT700Button')[this.params][this.btndisable] = true;
      this.form.get('view')[this.params][FccGlobalConstant.layoutClass] = FccGlobalConstant.viewBtnClassWithMessage;
      this.errorDispaly = false;
      this.hideNavigation(FccGlobalConstant.NO.toLowerCase());
    } else if (this.form.get("attachmentsMT").value.docId !== undefined &&
    this.form.get("failedMessageMT700")[this.params][this.rendered] === true) {
      this.form.get('view')[this.params][this.btndisable] = true;
      this.form.get('failedMessageMT700')[this.params][this.rendered] = true;
      this.form.get('validateMT700Button')[this.params][this.btndisable] = false;
      this.form.get('view')[this.params][FccGlobalConstant.layoutClass] = FccGlobalConstant.viewBtnClassWithMessage;
      this.hideNavigation(FccGlobalConstant.YES.toLowerCase());
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && !this.commonService.isEmptyValue(this.form.get('tnxAmt').value)){
        this.form.get('view')[this.params][this.btndisable] = false;
        this.form.get('successMessageMT700')[this.params][this.rendered] = true;
        this.form.get('validateMT700Button')[this.params][this.btndisable] = true;
        this.form.get('view')[this.params][FccGlobalConstant.layoutClass] = FccGlobalConstant.viewBtnClassWithMessage;
        this.errorDispaly = false;
        this.hideNavigation(FccGlobalConstant.NO.toLowerCase());
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
      const sectionName = FccGlobalConstant.EL_MT700_UPLOAD;
      this.form = this.stateService.getSectionData(sectionName);
      const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
      if (mode === FccGlobalConstant.DRAFT_OPTION && this.fileList() && this.fileList().length > 0) {
        this.setAttachmentId(this.fileList(), this.form);
      }
      this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { columns: this.getColumns() });
      this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { data: this.fileList() });
      const operation = this.commonService.getQueryParametersFromKey('operation');
      const eventTab = this.commonService.getQueryParametersFromKey('eventTab');
      const transactionTab = this.commonService.getQueryParametersFromKey('transactionTab');
      const eventTnxId = this.commonService.getQueryParametersFromKey('eventTnxId');
      const reviewTnxId = this.commonService.getQueryParametersFromKey('reviewTnxId');
      const refID = this.commonService.getQueryParametersFromKey('referenceid');
      this.hideNavigation(FccGlobalConstant.YES.toLowerCase());
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
        const tnxid = this.commonService.eventId ? this.commonService.eventId :
          this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_ID);
        const fileTnxId = ((this.commonService.isNonEmptyField(FccGlobalConstant.PARENT_TNX_ID, this.form) &&
        this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.PARENT_TNX_ID).value) &&
        this.form.get(FccGlobalConstant.PARENT_TNX_ID).value !== '') ? this.form.get(FccGlobalConstant.PARENT_TNX_ID).value : tnxid);
        this.fileHandlingService.getTnxFileDetails(fileTnxId ).subscribe(
          response1 => {
            if (response1) {
              this.uploadFile.resetELMT700List();
              for (const values of response1.body.items) {
                if ( values.type === 'SWIFT') {
                  this.docId = values.docId;
                  this.elMT700FileModel = new ELMT700FileMap(null, values.fileName, values.title, values.type,
                    this.getFileExtPath(values.fileName), this.getFileSize(values.size), this.docId, null, null, null, null);
                  this.uploadFile.pushELMT700File(this.elMT700FileModel);
                  this.form.updateValueAndValidity();
                }
              }
            }
          }
        );
      }
  }

  setAttachmentId(fileList, form) {
    const docIds = [];
    const files = fileList;
    for (const index in files) {
      if (files[index]) {
        docIds.push(files[index][FccGlobalConstant.ATTACHMENT_ID]);
      }
    }
    const attachments = { docId: docIds };
    form.get('attachmentsMT').setValue(attachments);
    form.get('attachmentsMT').updateValueAndValidity();
    if (this.PRODUCT_CODE === undefined || this.PRODUCT_CODE === null || this.PRODUCT_CODE === ''){
      this.PRODUCT_CODE = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    }
    this.fileArray.setAttachmentValidations(fileList, form, this.PRODUCT_CODE);
    form.updateValueAndValidity();
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
      return this.uploadFile.getELMT700List();
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
    this.form.get('failedMessageMT700')[this.params][this.rendered] = false;
    this.errorDispaly = false;
    this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { hasError: false });
    if (this.uploadFile.elMT700numberOfFiles >= this.numberOfFilesRegex) {
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
      if (this.uploadFile.elMT700numberOfFiles < this.numberOfFilesRegex) {
        this.isFileSizeValid = this.checkValidFile(filesArray[i]);
        this.isFileExtValid = this.checkFileExt(filesArray[i]);
        this.elMT700FileModel = new ELMT700FileMap(filesArray[i], filesArray[i].name, filesArray[i].name,
           this.getFileExt(filesArray[i].name), this.getFileExtPath(filesArray[i].name), this.getFileSize(filesArray[i].size),
           null, null, null, null, null);
        if (this.isFileSizeValid && this.isFileExtValid) {
          await this.commonService.uploadAttachments(this.elMT700FileModel.file,
              this.elMT700FileModel.title, lcNumber, eventId, 'OTHER').toPromise().
          then(
            response => {
              this.elMT700FileModel.attachmentId = response.docId;
              this.fileListSvc.pushELMT700File(this.elMT700FileModel);
            });
          } else if (!this.isFileSizeValid) {
            this.messageSet.add(1);
        } else if (!this.isFileExtValid) {
          this.messageSet.add(FccGlobalConstant.LENGTH_2);
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
    } else {
      return true; // this.checkValidFileExt(this.getFileExt(file.name));
    }
  }

  checkFileExt(file: any) {
    return this.checkValidFileExtensionfn(this.getFileExt(file.name));
  }

  checkValidFileExtensionfn(fileExt): boolean {
    for (let i = 0; i < this.validFileExtensions.length; i++) {
      const ext: string = this.validFileExtensions[i].toLowerCase();
      if (ext.trim() === fileExt.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

    onClickBrowseButton() {
    this.messageSet.clear();
    this.form.get('failedMessageMT700')[this.params][this.rendered] = false;
    this.errorDispaly = false;
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    let lcNumber = this.commonService.referenceId;
    let eventId = this.commonService.eventId;
    localStorage.setItem('mt700Upload', 'OTHER');
    this.commonService.setIsMT700Upload('OTHER');
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
    this.blurBrowseButton = this.form.get('successMessageMT700')[this.params][this.rendered];
    if (this.blurBrowseButton) {
        this.messageSet.add(FccGlobalConstant.LENGTH_4);
        this.showMessage();
        return;
    }
    this.numberOfFile = this.uploadFile.elMT700numberOfFiles;
    if (this.numberOfFile >= this.numberOfFilesRegex) {
      this.messageSet.add(FccGlobalConstant.LENGTH_0);
      this.showMessage();
      return;
    } else {
    this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { hasError: false });
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ElFileUploadDailogComponent, {
      header: `${this.translateService.instant('fileDetails')}`,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir }
    });
    dialogRef.onClose.subscribe(() => {
      this.hideShowDeleteWidgetsService.customiseSubject.next(false);
      this.commonService.setIsMT700Upload(null);
      this.showUploadedFiles();
    });
  }
}
  showUploadedFiles() {
      if (this.noOfFiles !== this.uploadFile.elMT700numberOfFiles) {
        this.hideNavigation(FccGlobalConstant.YES.toLowerCase());
      }
      this.noOfFiles = this.uploadFile.elMT700numberOfFiles;
      this.renderBrowseButton(this.noOfFiles);
      if (this.noOfFiles !== 0) {
        this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { columns: this.getColumns() });
        this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { data: this.fileList() });
        this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { hasData: true });
        this.form.get('validateMT700Button')[this.params][this.rendered] = true;
        this.form.get('validateMT700Button')[this.params][this.btndisable] = false;
        this.form.get('view')[this.params][this.rendered] = true;
        this.form.get('view')[this.params][this.btndisable] = true;
        this.form.updateValueAndValidity();
        this.form.get('elMT700fileUploadTable').updateValueAndValidity();
        this.setAttachmentId(this.fileList(), this.form);
      } else {
        this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { hasData: false });
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
        this.commonService.deleteAttachments(a).subscribe();
        this.removeSelectedRow(a);
        this.noOfAttachments = this.form.get('noOfAttachments').value;
        this.form.get('noOfAttachments').setValue(--this.noOfAttachments);
        this.form.get('noOfAttachments').updateValueAndValidity();
        this.form.get('view')[this.params][this.btndisable] = true;
        this.form.get('successMessageMT700')[this.params][this.rendered] = false;
        this.form.get('failedMessageMT700')[this.params][this.rendered] = false;
        this.form.get('validateMT700Button')[this.params][this.btndisable] = false;
        this.form.get('view')[this.params][FccGlobalConstant.layoutClass] = FccGlobalConstant.viewBtnClassWithoutMessage;
        this.errorDispaly = false;
        const numberOfFiles = this.uploadFile.elMT700numberOfFiles;
        if (numberOfFiles <= FccGlobalConstant.LENGTH_0) {
          this.form.get('view')[this.params][this.rendered] = false;
          this.form.get('successMessageMT700')[this.params][this.rendered] = false;
          this.form.get('failedMessageMT700')[this.params][this.rendered] = false;
          this.form.get('validateMT700Button')[this.params][this.rendered] = false;
          this.errorDispaly = false;
          this.clickedValidateButton = false;
          this.form.get('attachmentsMT').setValue('');
          this.form.get('view')[this.params][FccGlobalConstant.layoutClass] = FccGlobalConstant.viewBtnClassWithoutMessage;
          this.form.updateValueAndValidity();
        }
        if (numberOfFiles < this.numberOfFilesRegex ) {
          this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { hasError: false });
          this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { message: '' });
          this.form.updateValueAndValidity();
        }
      }
    });
  }

  onClickView(){
    this.tableService.onClickView(null, this.taskService.getTnxResponseObj());
  }

  removeSelectedRow(deleteID: string) {
    let attids = null;
    let removeIndex = null;
    for (let i = 0; i < this.uploadFile.elMT700FileMap.length; ++i) {
      if (this.uploadFile.elMT700FileMap[i].attachmentId !== deleteID) {
          if (attids === null) {
              attids = this.uploadFile.elMT700FileMap[i].attachmentId;
          } else {
            attids = `${attids} | ${this.uploadFile.elMT700FileMap[i].attachmentId}`;
          }
        } else {
          removeIndex = i;
        }
      }
    if (removeIndex !== null) {
      this.uploadFile.elMT700FileMap.splice(removeIndex, 1);
    }
    if (this.uploadFile.elMT700FileMap.length === 0) {
      this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { hasData: false });
    }
    this.renderBrowseButton(this.uploadFile.elMT700numberOfFiles);
    this.showUploadedFiles();
  }

  getFileExtPath(fileName: string) {
    return this.commonService.getFileExtPath(fileName);
  }

  getFileSize(fileSize: any) {
    const a = fileSize / FccGlobalConstant.LENGTH_1000;
    return a + 'KB';
  }

  showMessage() {
    if (this.messageSet.has(0)) {
      this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { message: `${this.translateService.instant('MaxFileReached')}` });
      this.form.updateValueAndValidity();
    } else if (this.messageSet.has(1)) {
      this.patchFieldParameters(this.form.get("elMT700fileUploadTable"), {
        message:
          `${this.translateService.instant("fileAttachmentFailed")}` +
          this.sizeOfFileRegex +
          ` MB.`,
      });
    } else if (this.messageSet.has(FccGlobalConstant.LENGTH_2)) {
      const errorMsg = `${this.translateService.instant('fileValidExtnError')} `
                                                                + this.validFileExtensions + `${this.translateService.instant('.')}`;
      this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { message: errorMsg });
      this.form.updateValueAndValidity();
    } else if (this.messageSet.has(FccGlobalConstant.LENGTH_3)) {
      this.patchFieldParameters(this.form.get('elMT700fileUploadTable'),
      { message: `${this.translateService.instant('entityNotSelected')}` });
    } else if (this.messageSet.has(FccGlobalConstant.LENGTH_4)) {
      this.patchFieldParameters(this.form.get('elMT700fileUploadTable'),
      { message: `${this.translateService.instant('errorOnValidate')}` });
    }
    if (this.messageSet.size !== 0) {
      this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { hasError: true });
      setTimeout(() => {
        this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { hasError: false });
        this.patchFieldParameters(this.form.get('elMT700fileUploadTable'), { message: '' });
      }, FccGlobalConstant.LENGTH_5000);
      this.form.updateValueAndValidity();
    }
  }

  saveFormObject() {
    this.stateService.setStateSection(
      FccGlobalConstant.EL_MT700_UPLOAD,
      this.form
    );
  }

  ngOnDestroy() {
    this.stateService.setStateSection(FccGlobalConstant.EL_MT700_UPLOAD, this.form, false);
    localStorage.removeItem(FccGlobalConstant.MT700_UPLOAD);
  }

  onClickNext() {
    this.saveFormObject();
    this.saveDraftService.changeSaveStatus(FccGlobalConstant.EL_MT700_UPLOAD,
    this.stateService.getSectionData(FccGlobalConstant.EL_MT700_UPLOAD));
  }

  async onFocusValidateMT700Button() {
    this.responseObj = await this.elProductService.updateTransaction();
    if (this.responseObj === 'true') {
      this.clickedValidateButton = true;
      this.errorDispaly = false;
      this.form.get('view')[this.params][this.btndisable] = false;
      this.form.get('successMessageMT700')[this.params][this.rendered] = true;
      this.form.get('failedMessageMT700')[this.params][this.rendered] = false;
      this.form.get('validateMT700Button')[this.params][this.btndisable] = true;
      this.hideNavigation(FccGlobalConstant.NO.toLowerCase());
    } else {
      this.form.get('view')[this.params][this.btndisable] = true;
      this.form.get('failedMessageMT700')[this.params][this.rendered] = true;
      this.form.get('successMessageMT700')[this.params][this.rendered] = false;
      this.form.get('validateMT700Button')[this.params][this.btndisable] = false;
      this.errorDispaly = true;
      if(this.responseObj.includes('MAX_ATTACHMENT_LIMIT')) {
        this.responseObj = `${this.translateService.instant(this.responseObj.split('-')[0])} ${this.responseObj.split('-')[1]}`;
      }
      else{
        this.responseObj = `${this.translateService.instant(this.responseObj)}`;
      }
    }
    this.form.get('view')[this.params][FccGlobalConstant.layoutClass] = FccGlobalConstant.viewBtnClassWithMessage;
  }

  onClickPrevious() {
    this.saveFormObject();
    if (!CommonService.isTemplateCreation) {
    this.saveDraftService.changeSaveStatus(FccGlobalConstant.EL_MT700_UPLOAD,
      this.stateService.getSectionData(FccGlobalConstant.EL_MT700_UPLOAD));
    }
  }


  onClickCancel() {
  this.lcTemplateService.getConfirmaton();
  }

  hideNavigation(mission: string) {
    setTimeout(() => {
      const ele = document.getElementById('next');
      if (ele) {
        this.commonService.announceMission(mission);
      } else {
        this.hideNavigation(mission);
      }
    }, FccGlobalConstant.LENGTH_100);
  }


}
