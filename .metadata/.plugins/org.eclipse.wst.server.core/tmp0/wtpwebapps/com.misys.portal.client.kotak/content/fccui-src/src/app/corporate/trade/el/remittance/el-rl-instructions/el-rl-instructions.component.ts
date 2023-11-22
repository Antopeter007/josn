import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElProductComponent } from '../../el-product/el-product.component';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { ElProductService } from '../../services/el-product.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { CommonService } from '../../../../../common/services/common.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { LeftSectionService } from '../../../../common/services/leftSection.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-rl-instructions',
  templateUrl: './../../../../../base/model/form.render.html',
  styleUrls: ['./el-rl-instructions.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ElRlInstructionsComponent }]
})
export class ElRlInstructionsComponent extends ElProductComponent implements OnInit, OnDestroy {

  form: FCCFormGroup;
  module = `${this.translateService.instant(FccGlobalConstant.RL_INSTRUCTIONS)}`;
  mode;
  productCode;

  constructor(protected eventEmitterService: EventEmitterService, protected productStateService: ProductStateService,
              protected commonService: CommonService, protected translateService: TranslateService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService, protected utilityService: UtilityService,
              protected resolverService: ResolverService, protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected elProductService: ElProductService,
              protected leftSectionService: LeftSectionService) {
    super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, elProductService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.initializeFormGroup();
    if (this.mode !== FccGlobalConstant.DRAFT_OPTION && this.operation !== FccGlobalConstant.PREVIEW &&
       this.operation !== FccGlobalConstant.LIST_INQUIRY && !this.form.get('paymentInstruction').touched){
      this.form.get('paymentInstruction').patchValue('');
    }
  }
  initializeFormGroup() {
    const sectionName = FccGlobalConstant.RL_INSTRUCTIONS;
    this.form = this.stateService.getSectionData(sectionName);
    }
    ngOnDestroy() {
      this.stateService.setStateSection(FccGlobalConstant.RL_INSTRUCTIONS, this.form);
    }
}
