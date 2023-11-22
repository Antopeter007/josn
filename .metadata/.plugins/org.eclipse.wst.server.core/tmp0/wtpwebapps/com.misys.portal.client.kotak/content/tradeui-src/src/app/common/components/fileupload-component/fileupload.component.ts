import { ValidationService } from './../../validators/validation.service';
import { DropdownOptions } from './../../../trade/iu/common/model/DropdownOptions.model';
import { Constants } from '../../../common/constants';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DialogService } from 'primeng';

import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { CommonService } from '../../services/common.service';
import { DownloadAttachmentService } from '../../services/downloadAttachment.service';
import { FilelistService } from '../../services/filelist.service';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';
import { IUService } from '../../../trade/iu/common/service/iu.service';
import { CommonDataService } from '../../services/common-data.service';
import { validateSwiftCharSet } from '../../validators/common-validator';
import { StaticDataService } from '../../services/staticData.service';



@Component({
  selector: 'fcc-common-fileupload-component',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  fileUploadSection: UntypedFormGroup;
  confirmMsg: string;
  resultOfConfirmation: string;
  maxNoOfFiles: number;
  maxSizeOfFile: number;
  imagePath: string;
  hideUploadButton: boolean;
  hideSendAttachment = false;
  headerMessage: string;
  public sendAttachmentsObj: any[] = [];
  viewMode: boolean;
  hasCustomerAttach = false;
  hasBankAttach = false;
  isMaster: boolean;
  isExistingDraftMenu;

  constructor(protected fb: UntypedFormBuilder, public dialogService: DialogService, public iuService: IUService,
              public uploadFile: FilelistService, public commonDataService: IUCommonDataService,  public commonData: CommonDataService,
              protected translate: TranslateService, public commonService: CommonService,
              public confirmationService: ConfirmationService,
              public downloadAttachmentService: DownloadAttachmentService, public staticDataService: StaticDataService,
              public validationService: ValidationService) { }

  ngOnInit() {
    this.fileUploadSection = this.fb.group({
    bgSendAttachmentsBy: [{value: '', disabled: true}, [Validators.required]],
    bgSendAttachmentsByOther: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(Constants.LENGTH_65),
                                      validateSwiftCharSet(Constants.X_CHAR)]]
    });
    this.imagePath = this.commonService.getImagePath();
    this.maxNoOfFiles = this.commonService.getFileuploadMaxLimit();
    this.maxSizeOfFile = parseInt(this.commonService.getMaxUploadSize(), 10) / Constants.LENGTH_1048576;

    this.isExistingDraftMenu = (this.bgRecord.tnxTypeCode === Constants.TYPE_REPORTING
      && this.commonData.getMode() === Constants.MODE_DRAFT);
    this.staticDataService.fetchBusinessCodes(Constants.SEND_ATTACH_CODE).subscribe(data => {
      this.sendAttachmentsObj = data.dropdownOptions as DropdownOptions[];
      if (this.bgRecord.bgSendAttachmentsBy !== '' && (Constants.MODE_DRAFT === this.commonDataService.getMode())) {
        this.fileUploadSection.get('bgSendAttachmentsBy').setValue(this.bgRecord.bgSendAttachmentsBy);
        }
   });

    if ((this.commonDataService.getDisplayMode() === 'view' || this.commonData.getDisplayMode() === 'view') ||
          this.commonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
          this.hideUploadButton = true;
          this.hideSendAttachment = true;
      }
    this.setSendAttachmentDetails();

    let attids = null;
    if (this.bgRecord.attachments && this.bgRecord.attachments !== '') {
        for (const value of this.bgRecord.attachments.attachment) {
          const fileName = value.fileName;
          const title = value.title;
          const type = value.type;
          const refId = value.refId;
          const tnxId = value.tnxId;
          const brchCode = value.brchCode;
          const attachmentId = value.attachmentId;
          const uploadDate = value.uploadDate;
          const companyId = value.companyId;

          if (attids === null) {
            attids = attachmentId;
           } else {
             attids = `${attids} | ${attachmentId}`;
           }

          if ((type === '01' && !this.commonData.getIsBankUser()) || (this.commonData.getIsBankUser())) {
            this.uploadFile.pushFiles(null, fileName, title, type, attachmentId, refId, tnxId, brchCode,
              companyId, status, uploadDate);
          }
        }
      }
    this.commonDataService.setAttIds(attids);
    this.commonData.setAttIds(attids);
    // Emit the form group to the parent
    this.formReady.emit(this.fileUploadSection);
    this.imagePath = this.commonService.getImagePath();
    if (this.commonDataService.getmasterorTnx() === 'master') {
      this.isMaster = true;
    } else {
      this.isMaster = false;
    }
    this.setAttachments();
    this.setViewMode();
  }

  setAttachments() {
    if (this.bgRecord.attachments && this.bgRecord.attachments.attachment !== '') {
      this.hasCustomerAttach = this.bgRecord.attachments.attachment.some(item => item.type === '01');
      this.hasBankAttach = this.bgRecord.attachments.attachment.some(item => item.type === '02');
    }
  }

  parseSizeToMb(fileSize) {
    return parseInt(fileSize, 10) / Constants.LENGTH_1048576;
  }
  setViewMode() {
    if (this.commonData.getDisplayMode() === 'view') {
      this.viewMode = true;
    } else {
      this.viewMode = false;
    }
  }

  setSendAttachmentDetails() {
    if (this.bgRecord.bgSendAttachmentsBy !== '' && ((Constants.MODE_DRAFT === this.commonDataService.getMode())
      || (this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_REJECTED))) {
      this.fileUploadSection.get('bgSendAttachmentsBy').enable();
      this.fileUploadSection.get('bgSendAttachmentsBy').setValue(this.bgRecord.bgSendAttachmentsBy);
      if (this.bgRecord.bgSendAttachmentsBy === 'OTHR') {
        this.fileUploadSection.get('bgSendAttachmentsByOther').enable();
        this.fileUploadSection.get('bgSendAttachmentsByOther').setValue(this.bgRecord.bgSendAttachmentsByOther);
      }
   } else if (this.bgRecord.attachments && this.bgRecord.attachments !== '' &&
              this.bgRecord.bgSendAttachmentsBy === '' && (Constants.MODE_DRAFT === this.commonDataService.getMode())
              && this.commonService.getTnxType() !== '13') {
    this.fileUploadSection.get('bgSendAttachmentsBy').markAsUntouched({ onlySelf: true });
    this.fileUploadSection.get('bgSendAttachmentsBy').markAsPristine({ onlySelf: true });
    this.fileUploadSection.get('bgSendAttachmentsBy').enable();
    this.fileUploadSection.get('bgSendAttachmentsBy').updateValueAndValidity();
   } else if (this.bgRecord.attachments && this.bgRecord.attachments !== '' && this.isExistingDraftMenu) {
    this.fileUploadSection.get('bgSendAttachmentsBy').enable();
    this.fileUploadSection.get('bgSendAttachmentsBy').setValue(this.bgRecord.bgSendAttachmentsBy);
    if (this.bgRecord.bgSendAttachmentsBy === 'OTHR') {
      this.fileUploadSection.get('bgSendAttachmentsByOther').enable();
      this.fileUploadSection.get('bgSendAttachmentsByOther').setValue(this.bgRecord.bgSendAttachmentsByOther);
    }
   }
  }

  get filelist() {
    return this.uploadFile.getlist();
  }

  showFileUploadSection(): void {
    let dialogHeader = '';
    this.translate.get('KEY_HEADER_FILE_DETAILS').subscribe((res: string) => {
      dialogHeader =  res;
    });
    if (this.filelist.length !== this.commonService.getFileuploadMaxLimit()) {
      const dialogRef = this.dialogService.open(UploadDialogComponent, {
        header: dialogHeader,
        width: '60vw',
        height: '25vh',
        contentStyle: {}
      });

      dialogRef.onClose.subscribe((result: any) => {
        if (result != null && result.file && !this.hideSendAttachment && this.commonService.getTnxType() !== '13') {
          this.fileUploadSection.get('bgSendAttachmentsBy').markAsUntouched({ onlySelf: true });
          this.fileUploadSection.get('bgSendAttachmentsBy').markAsPristine({ onlySelf: true });
          this.fileUploadSection.get('bgSendAttachmentsBy').enable();
          this.fileUploadSection.get('bgSendAttachmentsBy').updateValueAndValidity();
        }
      });
    } else {
      let message = '';
      this.translate.get('ATTACHMENT_FILE_LIMIT_EXCEEDED').subscribe((value: string) => {
          message =  value;
         });
      this.confirmationService.confirm({
        message,
        header: 'Error',
        icon: 'pi pi-exclamation-triangle',
        key: 'maxFilesError',
        rejectVisible: false,
        acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
        accept: () => {
        }
    });
    }
  }

  deleteRow(deleteId: string): void {
    let message = '';
    let dialogHeader = '';
    this.translate.get('DELETE_CONFIRMATION_MSG').subscribe((value: string) => {
            message =  value;
           });

    this.translate.get('DAILOG_CONFIRMATION').subscribe((res: string) => {
        dialogHeader =  res;
      });
    this.confirmationService.confirm({
      message,
      header: dialogHeader,
      icon: 'pi pi-exclamation-triangle',
      key: 'deleteConfirmDialog',
      accept: () => {
        let attids = null;
        let removeIndex = null;
        const tempFileMap = this.uploadFile.fileMap.slice(0);
        for (let i = 0; i < this.uploadFile.fileMap.length; ++i) {
            if (this.uploadFile.fileMap[i].attachmentId !== deleteId) {
                if (attids === null) {
                    attids = this.uploadFile.fileMap[i].attachmentId;
                } else {
                  attids = `${attids} | ${this.uploadFile.fileMap[i].attachmentId}`;
                }
              } else {
                removeIndex = i;
                tempFileMap.splice(removeIndex, 1);
                this.commonService.deleteFileAttachments(deleteId).subscribe(data => {});
              }
            }
        this.uploadFile.fileMap = tempFileMap;
        this.commonDataService.setAttIds(attids);
        this.commonData.setAttIds(attids);
        if (this.filelist.length === 0) {
          this.fileUploadSection.get('bgSendAttachmentsBy').setValue('');
          this.fileUploadSection.get('bgSendAttachmentsBy').disable();
          this.fileUploadSection.get('bgSendAttachmentsByOther').setValue('');
          this.fileUploadSection.get('bgSendAttachmentsByOther').disable();
        }
        },
      reject: () => {
      }
  });
}

  getFileExt(fileName: string) {
    return fileName.split('.').pop();
  }

  changeSendAttachmentsBy() {
    if (this.fileUploadSection.get('bgSendAttachmentsBy').value === 'OTHR') {
      this.fileUploadSection.get('bgSendAttachmentsByOther').markAsUntouched({ onlySelf: true });
      this.fileUploadSection.get('bgSendAttachmentsByOther').markAsPristine({ onlySelf: true });
      this.fileUploadSection.get('bgSendAttachmentsByOther').updateValueAndValidity();
      this.fileUploadSection.get('bgSendAttachmentsByOther').enable();
  } else {
    this.fileUploadSection.get('bgSendAttachmentsByOther').setValue('');
    this.fileUploadSection.get('bgSendAttachmentsByOther').disable();
  }
  }
  hideAddbutton(): boolean {
   if (this.filelist.length === this.commonService.getFileuploadMaxLimit()) {
    return true;
   } else {
        return false;
      }
  }
  getNoOfFileMessage(): string {
    let message = '';
    this.translate.get('FILES_ATTACH', {length: this.filelist.length}).subscribe((res: string) => {
      message =  res;
    });
    return message;
  }
}
