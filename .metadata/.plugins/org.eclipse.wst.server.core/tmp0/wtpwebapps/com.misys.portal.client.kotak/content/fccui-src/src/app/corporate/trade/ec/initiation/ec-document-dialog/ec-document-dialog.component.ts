import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../common/services/session-validate-service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { DocumentDetailsMap } from '../../../lc/initiation/services/documentmdetails';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { EcProductService } from '../../services/ec-product.service';
import { EcProductComponent } from '../ec-product/ec-product.component';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { LeftSectionService } from './../../../../../corporate/common/services/leftSection.service';
import { ProductStateService } from './../../../../../corporate/trade/lc/common/services/product-state.service';
import { SaveDraftService } from './../../../../../corporate/trade/lc/common/services/save-draft.service';
import { FilelistService } from './../../../../../corporate/trade/lc/initiation/services/filelist.service';
import { FormControlService } from './../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { FileMap } from './../../../../../corporate/trade/lc/initiation/services/mfile';

@Component({
  selector: 'app-ec-document-dailog',
  templateUrl: './ec-document-dialog.component.html',
  styleUrls: ['./ec-document-dialog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EcDocumentDialogComponent }]
})
export class EcDocumentDialogComponent extends EcProductComponent implements OnInit {
  form: FCCFormGroup;
  isValidSize = false;
  isValidFile = false;
  fileModel: FileMap;
  documentModel: DocumentDetailsMap;
  title: any;
  module: string;
  @Input() table: Table;
  @Input() newRow: any;
  fileUploadRequest: any;
  response: any ;
  allFileExtensions: any;
  validFileExtensions: any = [];
  errorMsgFileExtensions: any = [];
  sizeOfFileRegex: any;
  params = FccGlobalConstant.PARAMS;
  label = FccGlobalConstant.LABEL;
  contextPath: any;
  erroreMsgMaxFile: any;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router, protected leftSectionService: LeftSectionService,
              public dialogRef: DynamicDialogRef, public confirmationService: ConfirmationService, public fileList: FilelistService,
              public uploadFile: CommonService, public saveDraftService: SaveDraftService, protected utilityService: UtilityService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService, protected searchLayoutService: SearchLayoutService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected ecProductService: EcProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, ecProductService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    window.scroll(0, 0);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.allFileExtensions = response.validFileExtensions.split(',');
        this.sizeOfFileRegex = response.FileUploadMaxSize;
        this.validFileExtensions = [];
        this.allFileExtensions.forEach(element => {
          //eslint-disable-next-line no-useless-escape
            this.validFileExtensions.push(element.replace(/[\[\]"]/g, '').replace(/ /g, ''));
            //eslint-disable-next-line no-useless-escape
            this.errorMsgFileExtensions.push(element.replace(/[\[\]"]/g, '').toUpperCase());
        });
      }
    });
    this.initializeFormGroup();
  }


  initializeFormGroup() {
    const dialogmodel = JSON.parse(JSON.stringify(this.formModelService.getSubSectionModel()[FccGlobalConstant.FILE_DIALOG_MODEL]));
    this.form = this.formControlService.getFormControls(dialogmodel);
  }
// Commenting as this has been moved to transaction.component.ts

// onChangeFilebrowseButton(event) {
//   super.onChangeFilebrowseButton(event);
//   this.documentModel = new DocumentDetailsMap(event.files[0].name,  null, null, null, null, null, null, null, null, false, 0);
// }


// onUploadHandler() {
//   const icNumber = this.commonService.referenceId;
//   const eventId = this.commonService.eventId;
//   if (this.isValidSize && this.checkTitle() && this.checkValidFileExtension()) {
//   this.fileModel.title = this.form.get('fileUploadTitle').value;
//   this.dialogRef.close(this.fileModel);
//   this.uploadFile.uploadAttachments(this.fileModel.file,  this.fileModel.title, icNumber, eventId).subscribe(
//     response => {
//       this.setDocId(response);
//       this.process();
//     },
//     (error: HttpErrorResponse) => {
//       if (error.status === FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST) {
//         this.erroreMsgMaxFile = error.error.causes[0].title;
//         this.form.get('fileUploadError')[this.params][this.label] = this.erroreMsgMaxFile;
//         this.form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
//         this.form.updateValueAndValidity();
//       }
//   });
//   } else {
//      this.form.get('fileUploadTitle').markAsTouched();
//   }
// }

  process() {
    this.fileList.pushFile(this.fileModel);
    this.dialogRef.close(this.fileModel);
    }
  setDocId(response) {
    this.fileModel.attachmentId = response.docId;
  }

  getData() {
    return this.fileModel;
  }
  getFileExt(fileName: string) {
    return fileName.split('.').pop();
  }

  checkTitle(): boolean {
    if (this.form.get('fileUploadTitle').value) {
      this.form.get('fileUploadError')[this.params][this.label] = '';
      return true;
    } else {
      this.form.get('fileUploadError')[this.params][this.label] = `${this.translateService.instant('fileTitleError')}`;
      return false;
    }
  }

  checkValidFileExtension(): boolean {
    for (let i = 0; i < this.validFileExtensions.length; i++) {
      if (this.validFileExtensions[i].toLowerCase() === this.fileModel.type.toLowerCase()) {
        return true;
      }
    }
    this.form.get('fileUploadError')[this.params][this.label] = `${this.translateService.instant('fileValidExtnError')} `
                                                            + this.errorMsgFileExtensions + `${this.translateService.instant('.')}`;
    this.form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
    this.form.updateValueAndValidity();
    return false;
  }

  onClearHandler() {
     this.patchFieldParameters(this.form.get('fileUploadError'), { label: '' });
     this.patchFieldParameters(this.form.get('fileUploadError'), { rendered: false });
  }

  getFileExtPath(fileName: string) {
    const a = fileName.split('.').pop().toLowerCase();
    let path = `${this.contextPath}`;
    const imageStartTag = `<img src="`;
    const imageEndTag = `"/>`;
    path = (path !== 'undefined') ? path + `/content/FCCUI/assets/images/` : `/content/FCCUI/assets/images/`;
    switch (a) {
      case 'pdf':
        return imageStartTag + path + `file_pdf.gif` + imageEndTag;
      case 'docx':
      case 'doc':
        return imageStartTag + path + `file_docx.gif` + imageEndTag;
      case 'xls':
        return imageStartTag + path + `file_xls.gif` + imageEndTag;
      case 'xlsx':
        return imageStartTag + path + `file_xlsx.gif` + imageEndTag;
      case 'png':
        return imageStartTag + path + `file_png.gif` + imageEndTag;
      case 'jpg':
        return imageStartTag + path + `file_jpeg.gif` + imageEndTag;
      case 'jpeg':
        return imageStartTag + path + `file_jpeg.gif` + imageEndTag;
      case 'txt':
        return imageStartTag + path + `file_txt.gif` + imageEndTag;
      case 'zip':
        return imageStartTag + path + `file_zip.gif` + imageEndTag;
      case 'rtf':
        return imageStartTag + path + `file_rtf.gif` + imageEndTag;
      case 'csv':
        return imageStartTag + path + `file_csv.gif` + imageEndTag;
      default:
        return a;
    }
  }

}
