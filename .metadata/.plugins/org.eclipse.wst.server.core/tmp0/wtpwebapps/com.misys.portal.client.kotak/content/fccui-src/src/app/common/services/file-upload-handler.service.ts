import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, FileUpload } from 'primeng';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { Injectable } from '@angular/core';
import { FileMap } from '../../corporate/trade/lc/initiation/services/mfile';
import { FCCFormGroup } from '../../base/model/fcc-control.model';
import { DecimalPipe } from '@angular/common';
import { ELMT700FileMap } from '../../corporate/trade/lc/initiation/services/elMT700mfile';

/**
 * This file handles all file upload related events.
 */

FileUpload.prototype.formatSize = function(bytes) {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1000;
  const dm = 2;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

@Injectable({
  providedIn: 'root'
})
export class FileUploadHandlerService {

  params = FccGlobalConstant.PARAMS;
  label = FccGlobalConstant.LABEL;

  constructor(protected translateService: TranslateService, protected confirmationService: ConfirmationService,
              protected decimalPipe: DecimalPipe) {
   }

  /**
   * This method is used to check the file size.
   * @param event The event occured.
   * @param form The form.
   * @param fileUploadMaxSize The maximum file upload size.
   * @param sizeOfFileRegex The size of file.
   */
  checkFileSize(event, form, fileUploadMaxSize) {
    let isValidSize = null;
    const maxFileSize = FccGlobalConstant.FILEUPLOAD_MB_BYTE * fileUploadMaxSize;
    if (event.files[0].size === 0) {
      isValidSize = false;
      form.get('fileUploadError')[this.params][this.label] = `${this.translateService.instant('fileEmptyError')}`;
      const confirmationMessage = '';
      this.confirmationService.confirm({
        message: confirmationMessage,
        header: 'Error',
        icon: 'pi pi-exclamation-triangle',
        key: 'attachmentError',
        rejectVisible: false,
        acceptLabel: 'OK',
        accept: () => {
          //eslint : no-empty-function
        }
      });
    } else if (event.files[0].size > maxFileSize) {
      isValidSize = false;
      form.get('fileUploadError')[this.params][this.label] = `${this.translateService.instant('fileMaxLengthError')} `
        + fileUploadMaxSize + `${this.translateService.instant(' MB')}`;
      form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
      form.updateValueAndValidity();
      const confirmationMessage = '';
      this.confirmationService.confirm({
        message: confirmationMessage,
        header: 'Error',
        icon: 'pi pi-exclamation-triangle',
        key: 'attachmentError',
        rejectVisible: false,
        acceptLabel: 'OK',
        accept: () => {
          //eslint : no-empty-function
        }
      });
    } else {
      isValidSize = true;
    }
    return isValidSize;
  }

  /**
   * This method is used to check the file name length.
   * @param event The event occured.
   * @param form The form.
   */
  checkValidFileNameLength(event, form) {
    let isValidName = null;
    const fileNameMaxLength = FccGlobalConstant.LENGTH_255;
    const fileTitle = event.files[0].name;
    if (fileTitle.length > fileNameMaxLength) {
      isValidName = false;
      form.get('fileUploadError')[this.params][this.label] = `${this.translateService.instant('fileNameLengthExceeded')} `
      + fileNameMaxLength + `${this.translateService.instant('digits')}`;
      form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
      form.updateValueAndValidity();
      const confirmationMessage = '';
      this.confirmationService.confirm({
        message: confirmationMessage,
        header: 'Error',
        icon: 'pi pi-exclamation-triangle',
        key: 'attachmentError',
        rejectVisible: false,
        acceptLabel: 'OK',
        accept: () => {
          //eslint : no-empty-function
        }
      });
    } else {
      isValidName = true;
    }
    return isValidName;
  }

  checkValidFileName(event, length: any): boolean {
    const filesLength = event.files.length;
    const filesArray = event.files;
    for (let i = 0; i < filesLength; i++) {
      const fileTitle = filesArray[i].name.slice(0,filesArray[i].name.lastIndexOf('.'));
      if (fileTitle.length > length) {
        return false;
      }
    }
    return true;
  }

  checkAllowedCharInFileName(event, form, validFileNameRegex): boolean {
    const fileName = event.files[0].name;
    if (fileName.match(validFileNameRegex)) {
      return true;
    }
    let errorMessage = `${this.translateService.instant('fileNameInvalidCharError')} `;
    errorMessage+= validFileNameRegex + `${this.translateService.instant('.')}`;
    form.get('fileUploadError')[this.params][this.label] = errorMessage;
    form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
    form.updateValueAndValidity();
    return false;
  }

  /**
   * This method is show message if malicous content is present.
   * @param isMaliciousContent The malicous content is present or not.
   * @param form The form.
   */
  antiVirusCheck(isMaliciousContent: boolean, form: FCCFormGroup){
    if (isMaliciousContent){
      form.get('fileUploadError')[this.params][this.label] = `${this.translateService.instant('maliciousContentError')}`;
      form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
      form.updateValueAndValidity();
      const confirmationMessage = this.translateService.instant('maliciousContentError');
      this.confirmationService.confirm({
        message: confirmationMessage,
        header: 'Error',
        icon: 'pi pi-exclamation-triangle',
        key: 'attachmentError',
        rejectVisible: false,
        acceptLabel: 'OK',
        accept: () => {
          //eslint : no-empty-function
        }
      });
    }
  }

  /**
   * Checks the title of form.
   * @param form The form.
   */
  checkTitle(form): boolean {
    if (form.get('fileUploadTitle').value) {
      form.get('fileUploadError')[this.params][this.label] = '';
      return true;
    } else {
      form.get('fileUploadError')[this.params][this.label] = `${this.translateService.instant('fileTitleError')}`;
      return false;
    }
  }

  /**
   * Checks the valid file extensions.
   * @param form The form.
   * @param validFileExtensions The valid file extensions.
   * @param fileModel The file model.
   * @param errorMsgFileExtensions The error message file extensions.
   */
  checkValidFileExtension(form, validFileExtensions, errorMsgFileExtensions, fileExt: string): boolean {
    for (let i = 0; i < validFileExtensions.length; i++) {
      if (fileExt !== null && fileExt !== undefined && validFileExtensions[i].toLowerCase() === fileExt.toLowerCase()) {
        return true;
      }
    }
    form.get('fileUploadError')[this.params][this.label] = `${this.translateService.instant('fileValidExtnError')} `
      + errorMsgFileExtensions + `${this.translateService.instant('.')}`;
    form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
    form.updateValueAndValidity();
    return false;
  }

  /**
   * Gets the file size.
   * @param fileSize The file size.
   */
  getFileSize(fileSize: any) {
    const a = fileSize / FccGlobalConstant.LENGTH_1024;
    let fileSizeString = "";
    if(a)
    {
      fileSizeString = a.toFixed(2);
    }
    return fileSizeString + 'KB';
  }

  /**
   * Gets the file name.
   * @param fileName The file name.
   */
  getFileExt(fileName: string) {
    return fileName.split('.').pop();
  }

  /**
   * @param event event.
   * @param form The form.
   * @param fileModel The file model.
   * @param fileUploadMaxSize The maximum file upload size.
   * @param sizeOfFileRegex The size of file.
   */
  onChangeFilebrowseButton(event, form, fileModel, fileUploadMaxSize, sizeOfFileRegex, mt700Upload, validFileExtensions: [],
    errorMsgFileExtensions: [], fileExt: string, fileUploadRegex) {
    form.get('fileUploadError')[this.params][this.label] = '';
    this.checkFileSize(event, form, fileUploadMaxSize );
    this.checkAllowedCharInFileName(event, form, fileUploadRegex);
    this.checkValidFileNameLength(event, form);
    this.checkValidFileExtension(form, validFileExtensions, errorMsgFileExtensions, fileExt);
    this.checkAllowedCharInFileName(event, form, fileUploadRegex);
    if (mt700Upload === FccGlobalConstant.OTHER){
      fileModel = new ELMT700FileMap(event.files[0], event.files[0].name, form.get('fileUploadTitle').value,
      this.getFileExt(event.files[0].name), this.getFileExtPath(event.files[0].name),
      this.getFileSize(event.files[0].size), null, null, null, null, null);
    } else {
      fileModel = new FileMap(event.files[0], event.files[0].name, form.get('fileUploadTitle').value,
        this.getFileExt(event.files[0].name), this.getFileExtPath(event.files[0].name),
        this.getFileSize(event.files[0].size), null, null, null, null, null);
    }
  }

  getContextPath() {
    return window[FccGlobalConstant.CONTEXT_PATH];
  }

  getFileExtPath(fileName: string) {
    const fileExtn = fileName.split('.').pop().toLowerCase();
    const path = `${this.getContextPath()}`;
    const alt = `" alt = "`;
    const imgSrcStartTag = '<img src="';
    const endTag = '"/>';
    const pdfFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.PDF_IMG_PATH).concat(alt)
    .concat(`${this.translateService.instant(FccGlobalConstant.PDF_ALT)}`).concat(endTag);
    const docFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.DOC_IMG_PATH).concat(alt)
    .concat(`${this.translateService.instant(FccGlobalConstant.DOC_ALT)}`).concat(endTag);
    const xlsFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.XLS_IMG_PATH).concat(alt)
    .concat(`${this.translateService.instant(FccGlobalConstant.XSL_ALT)}`).concat(endTag);
    const xlsxFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.XLSX_IMG_PATH).concat(alt)
    .concat(`${this.translateService.instant(FccGlobalConstant.XSLS_ALT)}`).concat(endTag);
    const pngFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.PNG_IMG_PATH).concat(alt)
    .concat(`${this.translateService.instant(FccGlobalConstant.PNG_ALT)}`).concat(endTag);
    const jpgFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.JPG_IMG_PATH).concat(alt)
    .concat(`${this.translateService.instant(FccGlobalConstant.JPG_ALT)}`).concat(endTag);
    const txtFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.TXT_IMG_PATH).concat(alt)
    .concat(`${this.translateService.instant(FccGlobalConstant.TXT_ALT)}`).concat(endTag);
    const zipFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.ZIP_IMG_PATH).concat(alt)
    .concat(`${this.translateService.instant(FccGlobalConstant.ZIP_ALT)}`).concat(endTag);
    const rtgFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.RTF_IMG_PATH).concat(alt)
    .concat(`${this.translateService.instant(FccGlobalConstant.RTF_ALT)}`).concat(endTag);
    const csvFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.CSV_IMG_PATH).concat(alt)
    .concat(`${this.translateService.instant(FccGlobalConstant.CSV_ALT)}`).concat(endTag);
    const rarFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.RAR_IMG_PATH).concat(alt)
    .concat(`${this.translateService.instant(FccGlobalConstant.RAR_ALT)}`).concat(endTag);
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
}
