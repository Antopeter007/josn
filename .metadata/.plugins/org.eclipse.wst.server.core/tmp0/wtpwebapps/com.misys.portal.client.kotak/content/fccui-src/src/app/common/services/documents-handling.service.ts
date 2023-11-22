import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { FilelistService } from '../../../app/corporate/trade/lc/initiation/services/filelist.service';
import { TranslateService } from '@ngx-translate/core';
import { CodeData } from '../model/codeData';
import { DocumentDetailsMap } from '../../../app/corporate/trade/lc/initiation/services/documentmdetails';


@Injectable({
  providedIn: 'root'
})

export class DocumentsHandlingService {
  contentType = 'Content-Type';
  tableColumns = [];
  contextPath: any;
  formModelArray = [];
  responseArray = [];
  codeData = new CodeData();
  columnsHeader = [];
  columnsHeaderData = [];
  name = 'name';
  required = 'required';
  maxlength = 'maxlength';
  type = 'type';
  columnsParam = 'columns';
  columnsHeaderDataParam = 'columnsHeaderData';

  constructor(protected fileListSvc: FilelistService, protected translateService: TranslateService,
              protected commonService: CommonService) {
  }

  handleDocumentTable(control: any, sectionForm: any) {
    this.handleFormDocument(control, sectionForm);
  }

  formateResult() {
    const responseArrayLength = this.responseArray.length;
    for (let i = 0; i < this.formModelArray.length; i++) {
      let key: any;
      key = Object.keys(this.formModelArray[i]);
      key = key[0];
      if (key === FccGlobalConstant.DOCUMENT_NAME)
      {
        if ( responseArrayLength > 0) {
          let count = 0;
          for (let j = 0; j < responseArrayLength; j++) {
            if (this.responseArray[j].documentType === FccGlobalConstant.OTHER_DOCUMENT_TYPE )
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
    for (let i = 0; i < responseArrayLength; i++) {
      for (let j = 0; j < this.columnsHeader.length; j++) {
        if (this.columnsHeader[j] === FccGlobalConstant.LINK_TO)
        {
          Object.defineProperty(this.responseArray[i], this.columnsHeader[j],
            { value: this.setOption(this.columnsHeader[j], this.responseArray[i]), writable: true });
        }
        else
        {
          Object.defineProperty(this.responseArray[i], this.columnsHeader[j],
            { value: this.getValue(this.responseArray[i][this.columnsHeader[j]]), writable: true });
        }
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Type',
          { value: this.getType(this.columnsHeader[j]), writable: false });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Status',
          { value: this.getEditStatus(this.columnsHeader[j]), writable: false });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Required',
          { value: this.getRequiredType(this.columnsHeader[j]), writable: false });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Maxlength',
          { value: this.getMaxlength(this.columnsHeader[j]), writable: false });
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

  getType(key: any) {
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

  getRequiredType(key: any) {
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

  getMaxlength(key: any) {
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

  getEditStatus(key) {
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

  handleDocumentUploadgrid(fieldControl: any, sectionForm: any) {
      this.responseArray = this.fileListSvc.getDocumentList();
      this.formModelArray = fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.SUB_CONTROLS_DETAILS];
      this.columnsHeader = [];
      this.columnsHeaderData = [];
      this.formateResult();
      fieldControl[FccGlobalConstant.PARAMS][this.columnsParam] = this.columnsHeader;
      fieldControl[FccGlobalConstant.PARAMS][this.columnsHeaderDataParam] = this.columnsHeaderData;
      fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = this.responseArray;
      fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.hasActions] = true;
      fieldControl.updateValueAndValidity();
      fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.DOWNLOAD_ACTION] = 'pi-download';
      fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.TRASH_ACTION] = 'pi-trash';
      if (this.fileListSvc.numberOfDocuments === 0) {
        fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      fieldControl.updateValueAndValidity();
      sectionForm.updateValueAndValidity();
  }

  handleFormDocument(fieldControl: any, sectionForm: any) {
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (mode === 'view') {
      if ( sectionForm.get(FccGlobalConstant.DOCUMENTS).value !== null && sectionForm.get(FccGlobalConstant.DOCUMENTS).value !== '' &&
      sectionForm.get(FccGlobalConstant.DOCUMENTS).value !== undefined && this.fileListSvc.numberOfDocuments === 0) {
          const documentDetails = sectionForm.get(FccGlobalConstant.DOCUMENTS).value;
          if (documentDetails) {
            const documentsJSON = JSON.parse(documentDetails);
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
                const documentModel = new DocumentDetailsMap(selectedJson[FccGlobalConstant.FILE_NAME],
                  selectedJson[FccGlobalConstant.ATTACHMENT_ID], selectedJson[FccGlobalConstant.DOCUMENT_TYPE],
                  selectedJson[FccGlobalConstant.NUM_OF_ORIGINALS], selectedJson[FccGlobalConstant.NUM_OF_PHOTOCOPIES],
                  selectedJson[FccGlobalConstant.DOCUMENT_DATE], selectedJson[FccGlobalConstant.DOCUMENT_NAME],
                  selectedJson[FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS], selectedJson[FccGlobalConstant.DOCUMENT_NUMBER],
                   false, 0);
                this.fileListSvc.pushDocumentDetailsMap(documentModel);
              });
              this.handleDocumentUploadgrid(fieldControl, sectionForm);
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
                const documentModel1 = new DocumentDetailsMap(selectedJson[FccGlobalConstant.FILE_NAME],
                  selectedJson[FccGlobalConstant.ATTACHMENT_ID], selectedJson[FccGlobalConstant.DOCUMENT_TYPE],
                  selectedJson[FccGlobalConstant.NUM_OF_ORIGINALS], selectedJson[FccGlobalConstant.NUM_OF_PHOTOCOPIES],
                  selectedJson[FccGlobalConstant.DOCUMENT_DATE], selectedJson[FccGlobalConstant.DOCUMENT_NAME],
                  selectedJson[FccGlobalConstant.TOTAL_NO_OF_DOCUMENTS], selectedJson[FccGlobalConstant.DOCUMENT_NUMBER],
                   false, 0);
                this.fileListSvc.pushDocumentDetailsMap(documentModel1);
                this.handleDocumentUploadgrid(fieldControl, sectionForm);
            }
          }
        }
    }
  }
}
