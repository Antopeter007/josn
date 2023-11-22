import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';

import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../common/services/product-state.service';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { FormControlService } from '../../services/form-control.service';
import { FileMap } from '../../services/mfile';
import { UtilityService } from '../../services/utility.service';
import { CommonService } from './../../../../../../../app/common/services/common.service';
import { SessionValidateService } from './../../../../../../../app/common/services/session-validate-service';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../../common/services/form-model.service';
import { LcProductComponent } from './../lc-product/lc-product.component';
import { LcProductService } from '../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'fcc-trade-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: FileUploadDialogComponent }]
})
export class FileUploadDialogComponent extends LcProductComponent implements OnInit {

  form: FCCFormGroup;
  isValidSize = false;
  isValidFile = false;
  isUploadEnable = true;
  fileModel: FileMap;
  title: any;
  module: string;
  @Input() table: Table;
  @Input() newRow: any;
  fileUploadRequest: any;
  response: any;
  allFileExtensions: any;
  validFileExtensions: any = [];
  errorMsgFileExtensions: any = [];
  sizeOfFileRegex: any;
  fileUploadMaxSize: any;
  params = FccGlobalConstant.PARAMS;
  label = FccGlobalConstant.LABEL;
  contextPath: any;
  erroreMsgMaxFile: any;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router, protected leftSectionService: LeftSectionService,
              public dialogRef: DynamicDialogRef, public confirmationService: ConfirmationService, public fileList: FilelistService,
              public uploadFile: CommonService, protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected fccGlobalConstantService: FccGlobalConstantService, protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected lcProductService: LcProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    window.scroll(0, 0);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.allFileExtensions = response.validFileExtensions.split(',');
        this.sizeOfFileRegex = response.FileUploadMaxSize;
        this.fileUploadMaxSize = response.FileUploadMaxSize;
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

  onUploadHandler(event) {
    const referenceId = this.commonService.referenceId;
    const eventId = this.commonService.eventId;
    this.checkFileSize(event, this.fileUploadMaxSize);
    this.checkValidFileNameLength(event);
    if (this.isUploadEnable && this.isValidSize && this.isFileNameValid && this.checkTitle() && this.checkValidFileExtension(event)) {
      this.isUploadEnable = false;
      this.fileModel.title = this.form.get('fileUploadTitle').value;
      this.fileModel.file = new File([this.fileModel.file], encodeURIComponent(this.fileModel.fileName),
      { type: this.fileModel.file.type, lastModified: this.fileModel.file.lastModified });
      this.commonService.uploadAttachments(this.fileModel.file, this.fileModel.title, referenceId, eventId).subscribe(
        response => {
          this.isUploadEnable = true;
          this.setDocId(response);
          this.process();
          let noOfAttachments: any;
          if (this.commonService.isnonEMptyString(this.stateService.isStateSectionSet('fileUploadDetails', false))) {
          noOfAttachments = this.stateService.getValue('fileUploadDetails', 'noOfAttachments');
          if (noOfAttachments === null || noOfAttachments === '') {
            noOfAttachments = 0;
          }
          this.stateService.setValue('fileUploadDetails', 'noOfAttachments', ++noOfAttachments);
        }
        },
        (error: HttpErrorResponse) => {
          this.isUploadEnable = true;
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
                this.erroreMsgMaxFile = message;
                this.form.get('fileUploadError')[this.params][this.label] = this.erroreMsgMaxFile;
                this.form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
                this.form.updateValueAndValidity();
              }
          }
          // else if (error.error && error.error.detail && error.error.detail.indexOf(FccGlobalConstant.MALICIOUS) > -1){
          //   return this.commonService.fileUploadHandlerService.antiVirusCheck(true, this.form);
          // }
        }
        },
        () => this.dialogRef.close(this.fileModel));
    } else if (!this.isValidSize) {
      if (event.files[0].size === 0){
        this.erroreMsgMaxFile = `${this.translateService.instant('fileEmptyError')}`;
      } else if (event.files[0].size > this.fileUploadMaxSize) {
        this.erroreMsgMaxFile =
      `${this.translateService.instant('fileMaxLengthError')} ${this.fileUploadMaxSize} ${this.translateService.instant('_MB_each')}`;
      } 
      this.form.get('fileUploadError')[this.params][this.label] = this.erroreMsgMaxFile;
      this.form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
    } else {
      this.form.get('fileUploadTitle').markAsTouched();
    }
  }
}
