import { LnrpnProductComponent } from './../lnrpn-product/lnrpn-product.component';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { ResolverService } from './../../../../../common/services/resolver.service';
import { UtilityService } from './../../../../trade/lc/initiation/services/utility.service';
import { CustomCommasInCurrenciesPipe } from './../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FileHandlingService } from './../../../../../common/services/file-handling.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { ProductStateService } from './../../../../trade/lc/common/services/product-state.service';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FormControlService } from './../../../../trade/lc/initiation/services/form-control.service';
import { FormModelService } from './../../../../../common/services/form-model.service';
import { HideShowDeleteWidgetsService } from './../../../../../common/services/hide-show-delete-widgets.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ConfirmationService, DynamicDialogRef, DialogService } from 'primeng';

import { FilelistService } from './../../../../trade/lc/initiation/services/filelist.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import { SessionValidateService } from './../../../../../common/services/session-validate-service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { FileMap } from './../../../../trade/lc/initiation/services/mfile';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { CommonService } from './../../../../../../app/common/services/common.service';
import { CurrencyConverterPipe } from '../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'fcc-lnrpn-file-upload-dialog',
  templateUrl: './lnrpn-file-upload-dialog.component.html',
  styleUrls: ['./lnrpn-file-upload-dialog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LnrpnFileUploadDialogComponent }]
})
export class LnrpnFileUploadDialogComponent extends LnrpnProductComponent implements OnInit {

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
              protected currencyConverterPipe: CurrencyConverterPipe, protected dialogRef: DynamicDialogRef) {
        super(eventEmitterService, stateService, commonService, translateService, confirmationService,
          customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileListSvc, dialogRef,
          currencyConverterPipe);
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
