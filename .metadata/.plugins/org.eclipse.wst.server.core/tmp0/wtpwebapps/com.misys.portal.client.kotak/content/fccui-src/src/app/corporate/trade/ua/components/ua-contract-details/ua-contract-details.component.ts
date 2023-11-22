import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { TradeCommonDataService } from '../../../common/service/trade-common-data.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { UaProductService } from '../../services/ua-product.service';
import { UaProductComponent } from '../ua-product/ua-product.component';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CurrencyRequest } from './../../../../../common/model/currency-request';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { SessionValidateService } from './../../../../../common/services/session-validate-service';

@Component({
  selector: 'app-ua-contract-details',
  templateUrl: './ua-contract-details.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UaContractDetailsComponent }]
})
export class UaContractDetailsComponent extends UaProductComponent implements OnInit {

  module = ``;
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  contractTypeOptions = [];
  enteredCurMethod;
  contractCurrency;
  OMR = 'OMR';
  BHD = 'BHD';
  TND = 'TND';
  JPY = 'JPY';
  flagDecimalPlaces;
  swiftXChar;
  curRequest: CurrencyRequest = new CurrencyRequest();
  currency = [];
  conReference = [];
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected sessionValidation: SessionValidateService,
              protected tradeCommonDataService: TradeCommonDataService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uaProductService: UaProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uaProductService);
}

  ngOnInit(): void {
    this.initializeFormGroup();
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.populateTenderExpiry();
  }

  populateTenderExpiry() {
    if (this.form.get('contractReference') &&
    (this.form.get('contractReference').value !== '' && this.form.get('contractReference').value !== null &&
    this.form.get('contractReference').value === 'TEND')) {
  this.toggleControls(this.form, ['tenderExpiryDate'], true);
    } else {
      this.toggleControls(this.form, ['tenderExpiryDate'], false);
    }
  }
  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
  }

ngOnDestroy() {
  this.parentForm.controls[this.controlName] = this.form;
}

}
