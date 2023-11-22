import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { IUService } from './../../../trade/iu/common/service/iu.service';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from '../../constants';
import { Component, ViewChild,  OnInit} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { CommonService } from '../../services/common.service';
import { Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FileMap } from '../../services/ifile';
import { FilelistService } from '../../services/filelist.service';
import { CommonDataService } from '../../services/common-data.service';
import { ValidationService } from '../../validators/validation.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng';

@Component({
  selector: 'fcc-common-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {

  @ViewChild('fileUpload', { static: true }) fileupload: any;
  fileTitle: string;
  fileModel: FileMap;
  showProgressBar = false;
  isValidSize = false;
  isValidFile = false;
  uploadForm: UntypedFormGroup;
  uploadLabel = '';
  cancelLabel = '';
  browseLabel = '';


  constructor(public fb: UntypedFormBuilder, public dialogRef: DynamicDialogRef,  public config: DynamicDialogConfig,
              public iuService: IUService, public fileList: FilelistService, public iuCommonService: IUCommonDataService,
              public commonData: CommonDataService, public validationService: ValidationService,
              public commonService: CommonService, public translate: TranslateService, public confirmationService: ConfirmationService) {}

    ngOnInit() {
      this.uploadForm = this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(Constants.LENGTH_35)]]
      });
      this.translate.get('KEY_UPLOAD_BUTTON_NAME').subscribe((res: string) => {
        this.uploadLabel =  res;
      });
      this.translate.get('KEY_CANCEL_BUTTON_NAME').subscribe((res: string) => {
        this.cancelLabel =  res;
      });
      this.translate.get('KEY_BROWSE_BUTTON_NAME').subscribe((res: string) => {
        this.browseLabel =  res;
      });
    }

    onFilesAdded(event) {
      this.checkFileSize(event);
      this.validateFileExtension(this.getFileExt(event.files[0].name));
      if (this.isValidFile && this.isValidSize) {
         this.fileModel = new FileMap(event.files[0], event.files[0].name, this.uploadForm.controls.title.value,
          this.getFileExt(event.files[0].name), null, null, null, null, null, null, null);
      } else {
        this.fileupload.clear();
      }
    }

    onAddClick() {
        if (this.uploadForm.valid && this.isValidFile && this.isValidSize) {
          if (this.fileModel.title === '' ) {
            this.fileModel.title = this.uploadForm.controls.title.value;
          }
          this.iuService.uploadAttachments(this.fileModel.file,  this.uploadForm.controls.title.value).subscribe(
            (response) => this.setAttIds(response),
            (error) => console.error(error)
          );
        } else {
          this.uploadForm.get('title').markAsTouched();
        }
      }

    setAttIds(response) {
      if (response.status === Constants.SUCCESS) {
        let attids = this.iuCommonService.attIds;
        if (this.iuCommonService.attIds == null) {
          this.iuCommonService.setAttIds(response.id);
          this.commonData.setAttIds(response.id);
        } else {
          attids = `${attids}|${response.id}`;
          this.iuCommonService.setAttIds(attids);
          this.commonData.setAttIds(attids);
        }
        this.fileModel.attachmentId = response.id;
        this.process();
      } else if (response.errorMessage.indexOf(Constants.MALICIOUS) > -1) {
        let message = '';
        this.translate.get('ERROR_UPLOAD_MALICIOUS_FILE_MSG').subscribe((value: string) => {
                message =  value;
        });
        this.confirmationService.confirm({
            message,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            key: 'attachmentError',
            rejectVisible: false,
            acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
            accept: () => {
            }
        });
      }
    }

    process() {
      this.dialogRef.close(this.fileModel);
      this.fileList.pushFile(this.fileModel);
    }

    getFileExt(fileName: string) {
      return fileName.split('.').pop();
    }

    validateFileExtension(filename) {
      const extensions = this.commonService.getAllowedExtensionsForUpload();
      if (!extensions.includes(filename.toLowerCase()) && this.isValidSize) {
        this.isValidFile = false;
        let confirmationMessage = '';
        this.translate.get('ATTACHMENTS_ERROR_MESSAGE', {allowedExtensions: extensions}).subscribe((value: string) => {
            confirmationMessage =  value;
           });
        this.confirmationService.confirm({
            message: confirmationMessage,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            key: 'attachmentError',
            rejectVisible: false,
            acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
            accept: () => {
            }
        });
      } else {
        this.isValidFile = true;
      }

    }

    checkFileSize(event) {
      const maxFileSize =  this.commonService.getMaxUploadSize();
      const sizeInMb = parseInt(maxFileSize, 10) / Constants.LENGTH_1048576;
      if (event.files[0].size > maxFileSize) {
          this.isValidSize = false;
          let confirmationMessage = '';
          this.translate.get('ATTACHMENT_FILE_SIZE_EXCEEDED', {maxSize: sizeInMb}).subscribe((value: string) => {
            confirmationMessage =  value;
           });
          this.confirmationService.confirm({
            message: confirmationMessage,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            key: 'attachmentError',
            rejectVisible: false,
            acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
            accept: () => {
            }
        });
      } else {
        this.isValidSize = true;
      }
    }

}
