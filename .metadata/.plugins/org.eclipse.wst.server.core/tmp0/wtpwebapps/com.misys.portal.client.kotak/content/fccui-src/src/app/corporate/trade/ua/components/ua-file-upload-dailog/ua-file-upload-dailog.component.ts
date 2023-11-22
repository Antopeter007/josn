import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { Table } from 'primeng/table';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { FccGlobalConstantService } from '../../../../../../app/common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../app/common/core/fcc-global-constants';
import { CommonService } from '../../../../../../app/common/services/common.service';
import { SessionValidateService } from '../../../../../../app/common/services/session-validate-service';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { LeftSectionService } from '../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { FileMap } from '../../../lc/initiation/services/mfile';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { UaProductService } from '../../services/ua-product.service';
import { UaProductComponent } from '../ua-product/ua-product.component';

@Component({
  selector: 'app-ua-file-upload-dailog',
  templateUrl: './ua-file-upload-dailog.component.html',
  styleUrls: ['./ua-file-upload-dailog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UaFileUploadDailogComponent }]
})
export class UaFileUploadDailogComponent extends UaProductComponent implements OnInit {

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
              protected dialogRef: DynamicDialogRef, public confirmationService: ConfirmationService, protected fileList: FilelistService,
              public uploadFile: CommonService, public lcDetails: SaveDraftService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uaProductService: UaProductService
              ) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileList, dialogRef,
      currencyConverterPipe, uaProductService);
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
}
