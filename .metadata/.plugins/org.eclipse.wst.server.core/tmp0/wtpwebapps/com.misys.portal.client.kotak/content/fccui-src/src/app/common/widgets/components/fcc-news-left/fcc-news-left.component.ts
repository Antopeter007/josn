import { FCCBase } from './../../../../base/model/fcc-base';
import { TextControl, ImgControl } from './../../../../base/model/form-controls.model';
import { FCCFormGroup } from './../../../../base/model/fcc-control.model';
import { OPEN_CLOSE_ANIMATION } from '../../../model/animation';
import { Component, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { CommonService } from './../../../../../app/common/services/common.service';
import { AbstractControl } from '@angular/forms';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';


@Component({
  selector: 'fcc-news-left',
  templateUrl: './fcc-news-left.component.html',
  styleUrls: ['./fcc-news-left.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: FccNewsLeftComponent }],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class FccNewsLeftComponent extends FCCBase implements OnChanges, OnInit, AfterViewInit {

  @Input() newsObject;
  form: FCCFormGroup;
  module = '';

  constructor(protected translateService: TranslateService, public downloadFile: CommonService) {
    super();
  }

  ngOnInit() {

    this.initializeGroup();
    if (this.newsObject.titleLink) {
      this.patchFieldParameters(this.form.get('download'), { rendered: false });
      this.patchFieldParameters(this.form.get('link'), { rendered: true });
    } else {
      this.patchFieldParameters(this.form.get('download'), { rendered: true });
      this.patchFieldParameters(this.form.get('link'), { rendered: false });
    }
    (this.newsObject.attachment[0].attachmentId && this.newsObject.attachment[0].attachmentId !== null
      && this.newsObject.attachment[0].attachmentId !== '') ? this.patchFieldParameters(this.form.get('download'), { rendered: true })
    : this.patchFieldParameters(this.form.get('download'), { rendered: false });
    this.form.updateValueAndValidity();
  }

  ngAfterViewInit() {
    //eslint : no-empty-function
  }

  ngOnChanges() {
    this.initializeGroup();
    if (this.newsObject.titleLink) {
      this.patchFieldParameters(this.form.get('download'), { rendered: false });
      this.patchFieldParameters(this.form.get('link'), { rendered: true });
    } else {
      this.patchFieldParameters(this.form.get('download'), { rendered: true });
      this.patchFieldParameters(this.form.get('link'), { rendered: false });
    }
  }


  initializeGroup() {
    this.form = new FCCFormGroup({
      title: new TextControl('lcheader', this.translateService, {
        label: this.newsObject.title,
        key: 'lcheader',
        rendered: true,
        layoutClass: 'p-col-10',
        styleClass: ['title lefttitle']
      }),
      image: new ImgControl('lcheader', this.translateService, {
        label: this.newsObject.image,
        key: 'lcheader',
        rendered: true,
        layoutClass: 'p-col-12 newsbannerimage',
        styleClass: ['image']
      }),
      desc: new TextControl('lcheader', this.translateService, {
        label: this.newsObject.completeDesc,
        key: 'lcheader',
        rendered: true,
        layoutClass: '',
        styleClass: ['completeDesc']
      })

    });

    if(this.newsObject.attachment !== undefined && this.newsObject.attachment[0] !== null &&
      this.newsObject.attachment[0].attachmentId !== null && this.newsObject.attachment[0].attachmentId !== '') {
    this.newsObject.attachment.forEach(element => {
        this.form.addControl(element.attachmentId + 'download', this.getDescControl(element));
        this.form.addControl('link', this.getHrControl());
    });
  }
    this.form.setFormMode('edit');
  }

  getDescControl(element: any) {
    const control: AbstractControl = new ImgControl('downloadAttachment', this.translateService, {
      label: 'Download',
      rendered: true,
      fontawesome: 'fa-download',
      styleClass: ['p-col-5'],
      key: 'itemId',
      itemId: 'download',
      title: 'Download',
      layoutClass: 'p-col-5 download',
      attachmentId: element.attachmentId,
      value: element.attachmentId,
      titleVal: element.attachmentTitle,
      imgType: this.getFileExtPath(element.fileName),
    });
    return control;
  }

  getFileExtPath(fileName: any) {
    const fileNameVal = fileName.toLowerCase();
    const mimeTypeVal = fileName.mime_type;
    const path = `${this.downloadFile.getContextPath()}`;
    let fileExtn = fileNameVal.split('.').pop().toLowerCase();
    if(fileNameVal === fileExtn && mimeTypeVal !== undefined){
      fileExtn = "";
      fileExtn = mimeTypeVal.split('/').pop().toLowerCase();
      const arrayExtn = fileExtn.split('.');
      const size = arrayExtn.length;
      fileExtn = arrayExtn[size - 1];
    }
    const pdfFilePath = path.concat(FccGlobalConstant.PDF_IMG_PATH);
    const docFilePath = path.concat(FccGlobalConstant.DOC_IMG_PATH);
    const xlsFilePath = path.concat(FccGlobalConstant.XLS_IMG_PATH);
    const xlsxFilePath = path.concat(FccGlobalConstant.XLSX_IMG_PATH);
    const pngFilePath = path.concat(FccGlobalConstant.PNG_IMG_PATH);
    const jpgFilePath = path.concat(FccGlobalConstant.JPG_IMG_PATH);
    const txtFilePath = path.concat(FccGlobalConstant.TXT_IMG_PATH);
    const zipFilePath = path.concat(FccGlobalConstant.ZIP_IMG_PATH);
    const rtgFilePath = path.concat(FccGlobalConstant.RTF_IMG_PATH);
    const csvFilePath = path.concat(FccGlobalConstant.CSV_IMG_PATH);
    const rarFilePath = path.concat(FccGlobalConstant.RAR_IMG_PATH);
    switch (fileExtn) {
      case 'pdf':
        return pdfFilePath;
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


  getHrControl() {
    const control: AbstractControl = new ImgControl('link', this.translateService, {
      label: '',
      rendered: true,
      title: 'External link',
      pimengicon: 'pi-external-link',
      layoutClass: 'p-col-2 externallink',
      styleClass: ['p-col-2'],
      key: 'itemId',
      itemId: 'link',
    });
    return control;
  }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickDownload(event, key, index) {
    let fileName;
    const id = index;
    for (const element of this.newsObject.attachment) {
      if(element.attachmentId === index) {
        fileName = element.fileName;
        break;
      }
    }
    this.downloadFile.downloadNewsAttachments(id, 'news').subscribe(
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

  onClickLink() {
    window.open(this.newsObject.titleLink, '_blank');
  }



}
