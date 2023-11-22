import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService } from 'primeng/api';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { CurrencyRequest } from '../../../../../../common/model/currency-request';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../../common/services/session-validate-service';
import { TradeCommonDataService } from '../../../../../../corporate/trade/common/service/trade-common-data.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import {
  CustomCommasInCurrenciesPipe
} from '../../../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { CurrencyConverterPipe } from '../../../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { contractDateGreaterThanExpiryDate } from '../../../../../trade/lc/initiation/validator/ValidateDates';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import {
  emptyCurrency,
  zeroAmount
} from './../../../../../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'app-ui-contract-details',
  templateUrl: './ui-contract-details.component.html',
  styleUrls: ['./ui-contract-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiContractDetailsComponent }]
})
export class UiContractDetailsComponent extends UiProductComponent implements OnInit {

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
  transmissionMode: any;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected sessionValidation: SessionValidateService, protected dropdownAPIService: DropDownAPIService,
              protected tradeCommonDataService: TradeCommonDataService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef, protected uiProductService: UiProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.transmissionMode =
    this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.initializeFormGroup();
    this.populateContractTypeOptions();
    this.getCurrencyList();
    this.updateDropdownValues();
  }

  updateDropdownValues() {
    if (this.productStateService
      .getSectionData(
        FccGlobalConstant.UI_UNDERTAKING_DETAILS,
        undefined,
        this.isMasterRequired
      )
      .get("uiContractDetails")
      .get('contractReference').value !== '') {
      const cR = this.productStateService
      .getSectionData(
        FccGlobalConstant.UI_UNDERTAKING_DETAILS,
        undefined,
        this.isMasterRequired
      )
      .get("uiContractDetails");

      const conReference = cR.get('contractReference').value;
      const exists = this.contractTypeOptions.filter(
        task => task.code === conReference);
      if (exists.length > 0) {
        this.form.get('contractReference').setValue(this.contractTypeOptions.filter(
          task => task.code === conReference)[0].value);
      }
    }
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

  resetContractAmtFieldForLengthValidation() {
    this.setAmountLengthValidatorList(['contractAmt']);
  }

  initializeFormGroup() {

    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.form.get(FccGlobalConstant.CONTRACT_LABEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('contractNarrative').clearValidators();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.swiftXChar = response.swiftXCharacterSet;
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
        (this.transmissionMode[0] && this.transmissionMode[0].value &&
          this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
        this.form.addFCCValidators('contractNarrative', Validators.pattern(this.swiftXChar), 0);
        this.form.get('contractNarrative').updateValueAndValidity();
      }
    });

    this.form.addFCCValidators('contractPct', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('contractAmt', Validators.pattern(this.commonService.getRegexBasedOnlanguage()), 0);
    this.resetContractAmtFieldForLengthValidation();
    this.form.updateValueAndValidity();
  }

  populateContractTypeOptions() {
    this.contractTypeOptions = this.tradeCommonDataService.getContractTypeOptions('');
    this.patchFieldParameters(this.form.get('contractReference'), { options: this.contractTypeOptions });
    if (this.form.get('contractReference')) {
      this.form.get('contractReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = this.contractTypeOptions;
    }
  }

  getCurrencyList() {
    if (this.form.get('contractCurCode')[FccGlobalConstant.OPTIONS].length === 0) {
      this.commonService.userCurrencies(this.curRequest).subscribe(
        response => {
        if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else {
          response.items.forEach(
            value => {
            const ccy: { label: string, value: any } = {
              label: value.isoCode,
              value: {
                label: value.isoCode,
                iso: `${value.isoCode} - ${this.toTitleCase(value.name)}`,
                country: value.principalCountryCode,
                currencyCode: value.isoCode,
                shortName: value.isoCode,
                name: value.name
              }
            };
            this.currency.push(ccy);
          });
          this.patchFieldParameters(this.form.get('contractCurCode'), { options: this.currency });
        }
        if (this.form.get('contractCurCode').value !== FccGlobalConstant.EMPTY_STRING) {
          const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency, 'contractCurCode', this.form);
          if (valObj) {
            this.form.get('contractCurCode').patchValue(valObj[`value`]);
          }
        }
      });
    }
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

 onClickContractReference() {
    this.populateTenderExpiry();
}

onClickContractDate() {
  if (this.form.get('contractDate').value !== null && this.form.get('contractDate').value !== '') {
    this.validateContractDate();
  } else {
    this.form.get('contractDate').clearValidators();
  }
}

validateContractDate() {
  const expiryDate = this.stateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS)
    .get('uiTypeAndExpiry').get('bgExpDate').value;
  const contractDate = this.form.get('contractDate').value;
  if ( expiryDate && expiryDate !== '' && contractDate !== '' && (contractDate > expiryDate) ) {
    this.form.get('contractDate').setValidators([contractDateGreaterThanExpiryDate]);
  } else {
    this.form.get('contractDate').clearValidators();
  }
  this.form.get('contractDate').updateValueAndValidity();
}

  /*validation on change of currency field*/
onClickContractCurCode(event) {
  if (event.value !== undefined) {
    this.enteredCurMethod = true;
    this.contractCurrency = event.value.currency ? event.value.currency : event.value.currencyCode;
    const contractAmt = this.form.get('contractAmt').value;
    this.form.get('contractAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    this.setMandatoryField(this.form, 'contractAmt', true);
    this.flagDecimalPlaces = FccGlobalConstant.LENGTH_0;
    if (contractAmt !== '' && contractAmt !== null) {
      let valueupdated = this.commonService.replaceCurrency(contractAmt);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.contractCurrency);
      this.form.get('contractAmt').setValue(valueupdated);
    }
    this.resetContractAmtFieldForLengthValidation();
    this.form.get('contractAmt').updateValueAndValidity();
  }
}

onFocusContractAmt() {
  const contractAmt = this.form.get('contractAmt').value;
  this.form.get('contractAmt').clearValidators();
  if (contractAmt[this.params][this.ORIGINAL_VALUE] !== contractAmt.value
    && this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      contractAmt[this.params][this.ORIGINAL_VALUE] = contractAmt.value;
  }
  if (contractAmt !== '' && contractAmt !== null && contractAmt !== undefined) {
    this.OnClickAmountFieldHandler('contractAmt');
  }
}

/*validation on change of amount field*/
onBlurContractAmt() {
  const contractAmt = this.form.get('contractAmt').value;
  if (contractAmt !== '' && contractAmt !== null) {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && (this.form.get('contractAmt')[this.params][this.ORIGINAL_VALUE] !== '')
      && this.contractCurrency !== '') {
      this.patchFieldParameters(this.form.get('contractAmt'), { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
    }
    if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
      this.form.get('contractAmt').setValidators(emptyCurrency);
    }
    if (this.contractCurrency !== '' && this.contractCurrency !== null && this.contractCurrency !== undefined) {
      let valueupdated = this.commonService.replaceCurrency(contractAmt);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.contractCurrency);
      this.form.get('contractAmt').setValue(valueupdated);
      this.form.get('contractAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      this.setMandatoryField(this.form, 'contractAmt', true);
      this.flagDecimalPlaces = FccGlobalConstant.LENGTH_0;
      this.amountValidation();
    }
    this.resetContractAmtFieldForLengthValidation();
    if (this.contractCurrency === '' || this.contractCurrency === null || this.contractCurrency === undefined
        ) {
    this.patchFieldParameters(this.form.get('contractAmt'), { infoIcon: false });
  }
    this.form.get('contractAmt').updateValueAndValidity();

  } else {
    this.patchFieldParameters(this.form.get('contractAmt'), { infoIcon: false });
  }
}

amountValidation() {
  const contractAmt = this.form.get('contractAmt').value;
  const contractAmtFloatValue = parseFloat(contractAmt.toString());
  if (contractAmtFloatValue === 0) {
    this.form.get('contractAmt').clearValidators();
    this.form.addFCCValidators('contractAmt',
      Validators.compose([Validators.required, zeroAmount]), 0);
    this.form.get('contractAmt').setErrors({ zeroAmount: true });
    this.form.get('contractAmt').markAsDirty();
    this.form.get('contractAmt').markAsTouched();
    this.form.get('contractAmt').updateValueAndValidity();
  }
  this.resetContractAmtFieldForLengthValidation();
}

ngOnDestroy() {
  this.validateContractDate();
  this.form.get(FccGlobalConstant.CONTRACT_LABEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
  this.parentForm.controls[this.controlName] = this.form;
}

}
