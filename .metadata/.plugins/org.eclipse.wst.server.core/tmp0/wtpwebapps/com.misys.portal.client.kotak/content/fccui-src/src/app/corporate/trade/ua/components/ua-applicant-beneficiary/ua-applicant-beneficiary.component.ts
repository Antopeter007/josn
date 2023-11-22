import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { UaProductService } from '../../services/ua-product.service';
import { UaProductComponent } from '../ua-product/ua-product.component';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { CorporateCommonService } from './../../../../../corporate/common/services/common.service';

@Component({
  selector: 'app-ua-applicant-beneficiary',
  templateUrl: './ua-applicant-beneficiary.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UaApplicantBeneficiaryComponent }]
})
export class UaApplicantBeneficiaryComponent extends UaProductComponent implements OnInit {
  module = ``;
  form: FCCFormGroup;
  isMasterRequired: any;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected corporateCommonService: CorporateCommonService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uaProductService: UaProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uaProductService);
}

ngOnInit(): void {
  this.isMasterRequired = this.isMasterRequired;
  this.initializeFormGroup();
  this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);

}

initializeFormGroup() {
  const sectionName = FccGlobalConstant.UA_APPLICANTBENEFICIARY_DETAIL;
  this.form = this.productStateService.getSectionData(sectionName, FccGlobalConstant.PRODUCT_BR, this.isMasterRequired);
}


}
