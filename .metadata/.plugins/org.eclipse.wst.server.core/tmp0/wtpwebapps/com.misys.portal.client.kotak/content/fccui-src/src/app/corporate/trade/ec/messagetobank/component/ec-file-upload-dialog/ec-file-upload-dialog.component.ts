import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';

import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../../common/services/session-validate-service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { LeftSectionService } from './../../../../../../corporate/common/services/leftSection.service';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { SaveDraftService } from './../../../../../../corporate/trade/lc/common/services/save-draft.service';
import { FilelistService } from './../../../../../../corporate/trade/lc/initiation/services/filelist.service';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { FileMap } from './../../../../../../corporate/trade/lc/initiation/services/mfile';
import { EcProductComponent } from './../../../initiation/ec-product/ec-product.component';
import { CurrencyConverterPipe } from '../../../../lc/initiation/pipes/currency-converter.pipe';
import { EcProductService } from '../../../services/ec-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ec-file-upload-dialog',
  templateUrl: './ec-file-upload-dialog.component.html',
  styleUrls: ['./ec-file-upload-dialog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EcFileUploadDialogComponent }]
})
export class EcFileUploadDialogComponent extends EcProductComponent implements OnInit {

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
              protected utilityService: UtilityService, protected currencyConverterPipe: CurrencyConverterPipe,
              protected ecProductService: EcProductService) {
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
}
