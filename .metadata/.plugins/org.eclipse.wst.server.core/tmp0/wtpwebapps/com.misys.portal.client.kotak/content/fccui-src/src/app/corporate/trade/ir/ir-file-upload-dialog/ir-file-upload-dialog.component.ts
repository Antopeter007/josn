import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';

import { FCCFormGroup } from '../../../../../app/base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../app/common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../app/common/core/fcc-global-constants';
import { CommonService } from '../../../../../app/common/services/common.service';
import { EventEmitterService } from '../../../../../app/common/services/event-emitter-service';
import { FormModelService } from '../../../../../app/common/services/form-model.service';
import { SessionValidateService } from '../../../../../app/common/services/session-validate-service';
import { LeftSectionService } from '../../../../../app/corporate/common/services/leftSection.service';
import { ResolverService } from '../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../common/services/search-layout.service';
import { ProductStateService } from '../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../lc/common/services/save-draft.service';
import { CustomCommasInCurrenciesPipe } from '../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../lc/initiation/services/form-control.service';
import { FileMap } from '../../lc/initiation/services/mfile';
import { UtilityService } from '../../lc/initiation/services/utility.service';
import { IrProductComponent } from '../ir-product/ir-product.component';
import { CurrencyConverterPipe } from '../../lc/initiation/pipes/currency-converter.pipe';
import { IrProductService } from '../services/ir-product.service';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ir-file-upload-dialog',
  templateUrl: './ir-file-upload-dialog.component.html',
  styleUrls: ['./ir-file-upload-dialog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: IrFileUploadDialogComponent }]
})
export class IrFileUploadDialogComponent extends IrProductComponent implements OnInit {
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
              public dialogRef: DynamicDialogRef, public confirmationService: ConfirmationService, public fileList: FilelistService,
              public uploadFile: CommonService, public saveDraftService: SaveDraftService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService, protected resolverService: ResolverService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected irProductService: IrProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe,
      irProductService);
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

  checkFileSize(event) {
    const maxFileSize = FccGlobalConstant.FILEUPLOAD_MB_BYTE * this.fileUploadMaxSize;
    if (event.files[0].size === 0) {
      this.isValidSize = false;
      this.form.get('fileUploadError')[this.params][this.label] = `${this.translateService.instant('fileEmptyError')}`;
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
      this.form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
      return false;
    } else if (event.files[0].size > maxFileSize) {
      this.isValidSize = false;
      this.form.get('fileUploadError')[this.params][this.label] = `${this.translateService.instant('fileMaxLengthError')} `
        + this.sizeOfFileRegex + `${this.translateService.instant(' MB')}`;
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
      this.form.get('fileUploadError')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
      return false;
    } else {
      this.isValidSize = true;
      return true;
    }
  }
}
