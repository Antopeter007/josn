import { ElProductComponent } from '../../el-product/el-product.component';
import { Component, OnInit, Input } from '@angular/core';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FileMap } from '../../../lc/initiation/services/mfile';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LeftSectionService } from '../../../../common/services/leftSection.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { FccGlobalConstant } from '../../../../../../app/common/core/fcc-global-constants';
import { CommonService } from '../../../../../../app/common/services/common.service';
import { SessionValidateService } from '../../../../../../app/common/services/session-validate-service';
import { FccGlobalConstantService } from '../../../../../../app/common/core/fcc-global-constant.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { ElProductService } from '../../services/el-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-el-file-upload-dailog',
  templateUrl: './el-file-upload-dailog.component.html',
  styleUrls: ['./el-file-upload-dailog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ElFileUploadDailogComponent }]
})
export class ElFileUploadDailogComponent extends ElProductComponent implements OnInit {

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
  tnxTypeCode: any;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router, protected leftSectionService: LeftSectionService,
              public dialogRef: DynamicDialogRef, public confirmationService: ConfirmationService, public fileList: FilelistService,
              public uploadFile: CommonService, public lcDetails: SaveDraftService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService, protected utilityService: UtilityService,
              protected resolverService: ResolverService, protected currencyConverterPipe: CurrencyConverterPipe,
              protected elProductService: ElProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
          customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileList,
          dialogRef, currencyConverterPipe, elProductService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    window.scroll(0, 0);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        if (this.commonService.getIsMT700Upload() !== null && this.commonService.getIsMT700Upload() !== undefined) {
          this.allFileExtensions = response.MT700AllowedFileExtensions.split(',');
        } else {
          this.allFileExtensions = response.validFileExtensions.split(',');
        }
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
