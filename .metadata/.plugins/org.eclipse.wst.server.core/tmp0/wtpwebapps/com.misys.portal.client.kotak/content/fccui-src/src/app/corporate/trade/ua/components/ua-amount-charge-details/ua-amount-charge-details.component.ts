import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CurrencyRequest } from '../../../../../common/model/currency-request';
import { DropDownAPIService } from '../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../common/services/session-validate-service';
import { LcConstant } from '../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from '../../../../../corporate/trade/lc/common/services/product-state.service';
import {
  CustomCommasInCurrenciesPipe,
} from '../../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { AmendCommonService } from '../../../../common/services/amend-common.service';
import { CommonUtilsService } from '../../../../common/services/common-utils.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { UaProductService } from '../../services/ua-product.service';
import { UaProductComponent } from '../ua-product/ua-product.component';
import { CommonService } from './../../../../../common/services/common.service';

@Component({
  selector: 'app-ua-amount-charge-details',
  templateUrl: './ua-amount-charge-details.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UaAmountChargeDetailsComponent }]
})
export class UaAmountChargeDetailsComponent extends UaProductComponent implements OnInit {

  module = ``;
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  currencies = [];
  currency: SelectItem[] = [];
  curRequest: CurrencyRequest = new CurrencyRequest();
  BG_CURRENCY = 'bgCurCode';
  modeOfTransmission;
  Constant = new LcConstant();
  params = this.Constant.params;
  rendered = this.Constant.rendered;
  allowedCharCount = this.Constant.allowedCharCount;
  maxlength = this.Constant.maximumlength;
  maxRowCount = this.Constant.maxRowCount;
  cols = this.Constant.cols;
  enteredCharCount = 'enteredCharCount';
  formOfUndertaking;
  confirmationInst;
  bgCurrency;
  enteredCurMethod;
  OMR = 'OMR';
  BHD = 'BHD';
  TND = 'TND';
  JPY = 'JPY';
  iso;
  flagDecimalPlaces;
  validatorPattern = FccGlobalConstant.AMOUNT_VALIDATION;
  val;
  swiftZChar;

  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected commonUtilsService: CommonUtilsService, protected sessionValidatorService: SessionValidateService,
              protected dropdownAPIService: DropDownAPIService,
              protected amendCommonService: AmendCommonService, protected confirmationService: ConfirmationService,
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
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.uaProductService.swift2023Changes();
  }


ngOnDestroy() {
  this.parentForm.controls[this.controlName] = this.form;
}

}
