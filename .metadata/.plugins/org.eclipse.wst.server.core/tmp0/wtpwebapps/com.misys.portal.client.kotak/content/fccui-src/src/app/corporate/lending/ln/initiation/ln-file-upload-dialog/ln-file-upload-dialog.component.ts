import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { CurrencyConverterPipe } from './../../../../trade/lc/initiation/pipes/currency-converter.pipe';

import { FccGlobalConstantService } from './../../../../../../app/common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../../app/common/core/fcc-global-constants';
import { CommonService } from './../../../../../../app/common/services/common.service';
import { FileHandlingService } from './../../../../../../app/common/services/file-handling.service';
import { HideShowDeleteWidgetsService } from './../../../../../../app/common/services/hide-show-delete-widgets.service';
import { SessionValidateService } from './../../../../../../app/common/services/session-validate-service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../common/services/form-model.service';
import { ResolverService } from './../../../../../common/services/resolver.service';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import { ProductStateService } from './../../../../trade/lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from './../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from './../../../../trade/lc/initiation/services/filelist.service';
import { FormControlService } from './../../../../trade/lc/initiation/services/form-control.service';
import { FileMap } from './../../../../trade/lc/initiation/services/mfile';
import { UtilityService } from './../../../../trade/lc/initiation/services/utility.service';
import { LnProductComponent } from './../ln-product/ln-product.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ln-file-upload-dialog',
  templateUrl: './ln-file-upload-dialog.component.html',
  styleUrls: ['./ln-file-upload-dialog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LnFileUploadDialogComponent }]

})
export class LnFileUploadDialogComponent extends LnProductComponent implements OnInit, AfterViewChecked {

  form: FCCFormGroup;
  isValidSize = false;
  isValidFile = false;
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
  params = FccGlobalConstant.PARAMS;
  label = FccGlobalConstant.LABEL;
  contextPath: any;
  erroreMsgMaxFile: any;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router, protected leftSectionService: LeftSectionService,
              public dialogService: DialogService, public uploadFile: FilelistService, public deleteFile: CommonService,
              public downloadFile: CommonService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              public autoUploadFile: CommonService, protected fileListSvc: FilelistService,
              protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected eventEmitterService: EventEmitterService, protected stateService: ProductStateService,
              protected fileHandlingService: FileHandlingService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe) {
      super(eventEmitterService, stateService, commonService, translateService, confirmationService,
        customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileListSvc, dialogRef,
        currencyConverterPipe);
  }
  ngAfterViewChecked() {
    setTimeout(() => {
      const anchorElement = document.querySelector('.ui-dialog-titlebar-icon.ui-dialog-titlebar-close.ui-corner-all');
      const dialogTitleElement = document.querySelector('.ui-dialog-title');
      if (anchorElement && anchorElement.getAttribute('tabIndex') && anchorElement.getAttribute('tabIndex') === '0') {
        if (dialogTitleElement) {
          (dialogTitleElement as HTMLElement).focus();
          dialogTitleElement.setAttribute('tabIndex', '1');
        }
        anchorElement.setAttribute('tabIndex', '2');
        (anchorElement as HTMLElement).blur();
      }
    }, FccGlobalConstant.LENGTH_200);
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
    this.commonService.addTitleBarCloseButtonAccessibilityControl();
  }

  initializeFormGroup() {
    const dialogmodel = JSON.parse(JSON.stringify(this.formModelService.getSubSectionModel()[FccGlobalConstant.FILE_DIALOG_MODEL]));
    this.form = this.formControlService.getFormControls(dialogmodel);
  }

  onUploadHandler(event) {
    const referenceId = this.commonService.referenceId;
    const eventId = this.commonService.eventId;
    this.checkFileSize(event, this.fileUploadMaxSize);
    if (this.isValidSize && this.checkTitle() && this.checkValidFileExtension(event)) {
      this.fileModel.title = this.form.get('fileUploadTitle').value;
      this.commonService.uploadAttachments(this.fileModel.file, this.fileModel.title, referenceId, eventId).subscribe(
        response => {
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
      this.erroreMsgMaxFile =
      `${this.translateService.instant('fileMaxLengthError')} ${this.fileUploadMaxSize} ${this.translateService.instant('_MB_each')}`;
      this.form.get('fileUploadError')[this.params][this.label] = this.erroreMsgMaxFile;
      this.form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
    } else {
      this.form.get('fileUploadTitle').markAsTouched();
    }
  }

}
