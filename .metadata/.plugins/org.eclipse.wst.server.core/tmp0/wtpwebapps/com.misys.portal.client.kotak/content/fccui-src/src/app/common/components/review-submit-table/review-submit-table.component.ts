import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FCCBase } from './../../../base/model/fcc-base';
import { FCCFormGroup } from './../../../base/model/fcc-control.model';
import { BankFileMap } from './../../../corporate/trade/lc/initiation/services/bankmfile';
import { FilelistService } from './../../../corporate/trade/lc/initiation/services/filelist.service';
import { FormControlService } from './../../../corporate/trade/lc/initiation/services/form-control.service';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'fcc-review-submit-table',
  templateUrl: './review-submit-table.component.html',
  styleUrls: ['./review-submit-table.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ReviewSubmitTableComponent }]
})
export class ReviewSubmitTableComponent extends FCCBase implements OnInit {

  widgets;
  response: any;
  widgetDetails: any;
  refId: any;
  tnxId: any;
  docId: any;
  bankFileModel: BankFileMap;
  tableColumns = [];
  contextPath: any;
  sectionName: any;
  form: FCCFormGroup;
  module = '';
  displayparamCombo1: string;
  displayparamCombo2: string;
  displayparamCombo3: string;
  isFileAttachmentgenerationrequired: boolean;
  productCode: string;
  subProductCode: string;
  tnxTypeCode: string;
  subTnxTypeCode: string;
  tnxStatCode: string;

  constructor(protected commonService: CommonService,
              public uploadFile: FilelistService,
              protected translateService: TranslateService,
              public fccGlobalConstantService: FccGlobalConstantService,
              protected formControlService: FormControlService) {
                super();
              }

  ngOnInit(): void {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.response = this.widgets.response;
    this.productCode = this.response.product_code;
    this.subProductCode = this.response.sub_product_code;
    this.tnxTypeCode = this.response.tnx_type_code;
    this.subTnxTypeCode = this.response.sub_tnx_type_code;
    this.tnxStatCode = this.response.tnx_stat_code;
    this.refId = this.response ? this.response.ref_id : '';
    this.tnxId = this.response ? this.response.tnx_id : '';
    if (this.widgets) {
    this.getCommentSection();
    }
  }

  getCommentSection() {
    if (this.widgets[FccGlobalConstant.WIDGET_DATA] !== undefined) {
      this.sectionName = this.widgets[FccGlobalConstant.WIDGET_DATA];
    }
    this.downloadAttachments();
  }

  initializeFormGroup() {
    this.form = this.formControlService.getFormControls(this.sectionName);
  }

  async downloadAttachments() {
    await this.commonService.getCoverBillDetails(this.refId, this.tnxId, 'Y').then(
      response1 => {
        if (response1) {
          if (response1.items !== null && response1.items !== undefined) {
            for (const values of response1.items) {
              if (values.autoGenDocCode) {
                this.initializeFormGroup();
                this.docId = values.docId;
                this.bankFileModel = new BankFileMap(null, values.fileName, values.title, values.type,
                  this.getFileExtPath(values), null, this.docId, null, null, null, null, 
                  this.commonService.decodeHtml(values.mimeType));
                this.uploadFile.pushBankFile(this.bankFileModel);
                this.patchFieldParameters(this.form.get(FccGlobalConstant.AUTO_GENERATED_DOCUMENT_TABLE), { columns: this.getColumns() });
                this.patchFieldParameters(this.form.get(FccGlobalConstant.AUTO_GENERATED_DOCUMENT_TABLE), { data: this.fileList() });
                this.patchFieldParameters(this.form.get(FccGlobalConstant.AUTO_GENERATED_DOCUMENT_TABLE), { hasData: true });
                this.form.get(FccGlobalConstant.AUTO_GENERATED_DOCUMENT_TABLE).updateValueAndValidity();
                this.form.updateValueAndValidity();
              }
            }
          }
        }
      }
    );
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

  getFileExtPath(attachmentType: any) {
    const fileNameVal = attachmentType.fileName.toLowerCase();
    const mimeTypeVal = attachmentType.mimeType;
    let fileExtn = fileNameVal.split('.').pop().toLowerCase();
      if(fileNameVal === fileExtn && mimeTypeVal !== undefined){
        fileExtn = "";
        fileExtn = mimeTypeVal.split('/').pop().toLowerCase();
        const arrayExtn = fileExtn.split('.');
        const size = arrayExtn.length;
        fileExtn = arrayExtn[size - 1];
      }
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
      case 'document':  
      case 'docx':
      case 'doc':
        return docFilePath;
      case 'xls':
        return xlsFilePath;
      case 'sheet':
      case 'xlsx':
        return xlsxFilePath;
      case 'png':
        return pngFilePath;
      case 'jpg':
        return jpgFilePath;
      case 'jpeg':
        return jpgFilePath;
      case 'plain':
      case 'txt':
        return txtFilePath;
      case 'zip':
        return zipFilePath;
      case 'rtf':
        return rtgFilePath;
      case 'ms-excel':
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
                width: '15%'
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

  ngOnDestroy() {
    this.uploadFile.resetBankList();
    this.uploadFile.emptyBankList();
  }

}
