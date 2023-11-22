import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HOST_COMPONENT } from '../../../../../app/shared/FCCform/form/form-resolver/form-resolver.directive';
import { FormControlService } from '../../../../../app/corporate/trade/lc/initiation/services/form-control.service';
import { ProductStateService } from '../../../../../app/corporate/trade/lc/common/services/product-state.service';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from '../../../../../app/common/core/fcc-global-constant.service';
import { HideShowDeleteWidgetsService } from '../../../../../app/common/services/hide-show-delete-widgets.service';
import { CommonService } from '../../../../../app/common/services/common.service';
import { FormModelService } from '../../../../../app/common/services/form-model.service';
import { FCCFormGroup } from '../../../../../app/base/model/fcc-control.model';
import { FileMap } from '../../../../../app/corporate/trade/lc/initiation/services/mfile';
import { Table } from 'primeng/table';
import { FccGlobalConstant } from '../../../../../app/common/core/fcc-global-constants';
import { ConfirmationService } from 'primeng';
import { EventEmitterService } from '../../../../../app/common/services/event-emitter-service';
import { CustomCommasInCurrenciesPipe } from '../../../../../app/corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { SearchLayoutService } from '../../../../../app/common/services/search-layout.service';
import { UtilityService } from '../../../../../app/corporate/trade/lc/initiation/services/utility.service';
import { ResolverService } from '../../../../../app/common/services/resolver.service';
import { FilelistService } from '../../../../../app/corporate/trade/lc/initiation/services/filelist.service';
import { CurrencyConverterPipe } from '../../../../../app/corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { BeneficiaryProductService } from '../services/beneficiary-product.service';
import { BeneficiaryProductComponent } from '../beneficiary-product/beneficiary-product.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bene-file-upload-dialog',
  templateUrl: './bene-file-upload-dialog.component.html',
  styleUrls: ['./bene-file-upload-dialog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: BeneFileUploadDialogComponent }]
})
export class BeneFileUploadDialogComponent extends BeneficiaryProductComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  form: FCCFormGroup;
  isValidSize = false;
  isValidFile = false;
  fileModel: FileMap;
  title: string;
  module: string;
  @Input() table: Table;
  @Input() newRow: number;
  mode: string;
  allFileExtensions: string[];
  validFileExtensions: string[];
  errorMsgFileExtensions = [];
  sizeOfFileRegex: number;
  params = FccGlobalConstant.PARAMS;
  label = FccGlobalConstant.LABEL;
  contextPath: string;
  erroreMsgMaxFile: string;
  fileNameMaxLength: any;
  productCode = 'BB';

  constructor(
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected stateService: ProductStateService,
    protected translateService: TranslateService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected commonService: CommonService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    public dialogService: DialogService,
    protected eventEmitterService: EventEmitterService, protected productStateService: ProductStateService,
    protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService, protected fileArray: FilelistService,
    protected dialogRef: DynamicDialogRef, protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected currencyConverterPipe: CurrencyConverterPipe, protected beneficiaryProductService: BeneficiaryProductService ) {
    super(eventEmitterService, stateService, commonService, translateService,
      confirmationService, customCommasInCurrenciesPipe, searchLayoutService, utilityService,
      resolverService, fileArray, dialogRef, currencyConverterPipe, beneficiaryProductService,
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  ngOnInit(): void {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    window.scroll(0, 0);
    this.subscriptions.push(
      this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response) {
          this.allFileExtensions = response.validFileExtensions.split(',');
          this.sizeOfFileRegex = response.FileUploadMaxSize;
          this.validFileExtensions = [];
          this.allFileExtensions.forEach(element => {
            this.validFileExtensions.push(element.replace(/[\]"]/g, '').replace(/ /g, ''));
            this.errorMsgFileExtensions.push(element.replace(/[\]"]/g, '').toUpperCase());
          });
        }
      }),
      this.commonService.getParameterConfiguredValues(null,FccGlobalConstant.PARAMETER_P810,this.productCode)
      .subscribe(resp => {
        if (resp.paramDataList && resp.paramDataList.length > FccGlobalConstant.LENGTH_0) {
          const paramData = resp.paramDataList[FccGlobalConstant.ZERO];
          this.fileUploadMaxSize = paramData.data_2;
          this.fileNameMaxLength = paramData.data_4;
          this.validFileExtensions = [];
          this.errorMsgFileExtensions = [];
          paramData.data_1?.split(',').forEach(element => {
            if (this.validFileExtensions.indexOf(element.replace(/\s|\[|\]/g, '')) === -1) {
              this.validFileExtensions.push(element.replace(/\s|\[|\]/g, ''));
              this.errorMsgFileExtensions.push(element.replace(/\s|\[|\]/g, ' ').toUpperCase());
            }
          });
        }
      })
      );
    this.initializeFormGroup();
  }

  initializeFormGroup(): void {
    const dialogmodel = JSON.parse(JSON.stringify(this.formModelService.getSubSectionModel()[FccGlobalConstant.FILE_DIALOG_MODEL]));
    this.form = this.formControlService.getFormControls(dialogmodel);
    let accept = '';
    this.validFileExtensions?.forEach(element => {
      accept = `${accept}.${element}${this.validFileExtensions?.indexOf(element) < this.validFileExtensions?.length - 1 ? ',' : ''}`;
    });
   this.form.get('filebrowseButton')[this.params].accept = accept;
   this.form.get('fileUploadProgressBar')[this.params]['mode'] = 'indeterminate';
  }

  onUploadHandler(event: any): void {
    this.showProgressBar(true);
    this.checkValidFileName(event, this.fileNameMaxLength);
    this.checkFileSize(event, this.fileUploadMaxSize);
    if (this.isFileNameValid && this.isValidSize && this.checkTitle() && this.checkValidFileExtension(event)) {
      this.fileModel.title = this.form.get('fileUploadTitle').value;
      this.subscriptions.push(
        this.commonService.uploadAttachmentsForBeneAndPayments(this.fileModel.file, this.fileModel.title,
          '', FccGlobalConstant.BENE_BULK_FCM_ATTACHMENT, this.productCode).subscribe(
          response => {
            this.showProgressBar(false);
            this.setDocId(response);
            this.process();
            let noOfAttachments: number;
            if (this.commonService.isnonEMptyString(this.stateService.isStateSectionSet('fileUploadDetails', false))) {
              noOfAttachments = Number(this.stateService.getValue('fileUploadDetails', 'noOfAttachments'));
              if (noOfAttachments === null || isNaN(noOfAttachments)) {
                noOfAttachments = 0;
              }
              this.stateService.setValue('fileUploadDetails', 'noOfAttachments', ++noOfAttachments);
            }
          },
          (error: HttpErrorResponse) => {
            this.showProgressBar(false);
            if (error.status === FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST) {
              if (error.error && error.error.detail) {
                if (error.error.detail.indexOf(FccGlobalConstant.MALICIOUS) > -1) {
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
            }
          }, () => this.dialogRef.close(this.fileModel)));
    } else if (!this.isValidSize) {
      this.showProgressBar(false);
      this.erroreMsgMaxFile = event.files[0].size === 0 ?
      `${this.translateService.instant('fileEmptyError')}`
      :`${this.translateService.instant('fileMaxLengthError')} ${this.fileUploadMaxSize} ${this.translateService.instant('MB')}`;
      this.form.get('fileUploadError')[this.params][this.label] = this.erroreMsgMaxFile;
      this.form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
    } else if(!this.isFileNameValid){
      this.showProgressBar(false);
      this.erroreMsgMaxFile =
        `${this.translateService.instant('fileTitleLengthError', { maxLen: this.fileNameMaxLength })}`;
      this.form.get('fileUploadError')[this.params][this.label] = this.erroreMsgMaxFile;
      this.form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
    } else {
      this.showProgressBar(false);
      this.form.get('fileUploadTitle').markAsTouched();
    }
  }
  showProgressBar(flag) {
    this.form.get('fileUploadProgressBar')[this.params]['rendered'] = flag;
    this.form.get('fileUploadProgressBar').updateValueAndValidity();
  }
}
