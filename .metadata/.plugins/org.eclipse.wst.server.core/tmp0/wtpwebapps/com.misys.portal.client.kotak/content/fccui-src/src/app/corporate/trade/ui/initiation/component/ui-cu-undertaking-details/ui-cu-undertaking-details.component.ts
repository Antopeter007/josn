import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { CountryList } from '../../../../../../common/model/countryList';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';

@Component({
  selector: 'app-ui-cu-undertaking-details',
  templateUrl: './ui-cu-undertaking-details.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiCuUndertakingDetailsComponent }]
})
export class UiCuUndertakingDetailsComponent extends UiProductComponent implements OnInit {

  form: FCCFormGroup;
  country = [];
  countryList: CountryList;
  swiftXChar;
  @Input() parentForm: FCCFormGroup;
  @Input() controlName;
  module = ``;
  transmissionMode: any;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,protected amendCommonService: AmendCommonService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.initializeFormGroup();
    this.populateDataFromCopyFrom();
    this.uiProductService.swift2023Changes();
    this.commonService.getSwiftVersionValue();
    this.transmissionMode =
    this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired)
    .get('advSendMode').value;
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.swiftXChar = response.swiftXCharacterSet;
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(FccTradeFieldConstants.CU_GOVERN_TEXT, Validators.pattern(this.swiftXChar), 0);
        if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023) {
          this.form.addFCCValidators(FccTradeFieldConstants.CU_COUNTRY_SUB_DIV, Validators.pattern(this.swiftXChar), 0);
        }
      } else {
        if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023) {
          this.removeValidators(this.form, [FccTradeFieldConstants.CU_GOVERN_TEXT, FccTradeFieldConstants.CU_COUNTRY_SUB_DIV]);
        } else {
          this.form.get(FccTradeFieldConstants.CU_GOVERN_TEXT).clearValidators();
          this.form.get(FccTradeFieldConstants.CU_GOVERN_TEXT).updateValueAndValidity();
        }
      }
    });
    this.patchFieldParameters(this.form.get('cuGovernCountry'), { options: this.country });
    if (this.mode === FccGlobalConstant.DRAFT_OPTION)
      {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();
      }  
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.form.get(FccTradeFieldConstants.CU_LANGUAGE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      if (this.form.get(FccTradeFieldConstants.CU_RULE) && this.form.get(FccTradeFieldConstants.CU_RULE).value[0] &&
      this.form.get(FccTradeFieldConstants.CU_RULE).value[0].value === FccBusinessConstantsService.OTHER_99) {
        this.form.get(FccTradeFieldConstants.CU_RULE_OTHER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccTradeFieldConstants.CU_RULE_APPLICABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_RULE_OTHER], true);
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_RULE], false);
      }
      if (this.form.get(FccTradeFieldConstants.CU_TEXT_LANGUAGE) && this.form.get(FccTradeFieldConstants.CU_TEXT_LANGUAGE).value[0] &&
      this.form.get(FccTradeFieldConstants.CU_TEXT_LANGUAGE).value[0].value === '*') {
        this.form.get(FccTradeFieldConstants.CU_TEXT_LANGUAGE_OTHER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccTradeFieldConstants.CU_LANGUAGE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_TEXT_LANGUAGE_OTHER], true);
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_TEXT_LANGUAGE], false);
      }
    }
    this.getCountryDetail();
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendCommonService.setValueFromMasterToPrevious('uiCuCounterDetails');
    }
  }

  onClickCuRule(data: any) {
    if (data.value === '99') {
      this.toggleFormFields(true, this.form, ['cuRuleOther']);
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_RULE], false);
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('cuRuleOther', Validators.pattern(this.swiftXChar), 0);
      }
    } else {
      this.toggleFormFields(false, this.form, ['cuRuleOther']);
      this.form.get('cuRuleOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.clearValidators();
    }
  }
  onClickCuTextTypeCode(data: any) {
    if(this.commonService.isnonEMptyString(data) && data.value === "01" || data.value === "04")
    {
      this.form.get('cuTextLanguage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
    else
    {
      this.form.get('cuTextLanguage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('cuTextLanguage').setValue('');
    }
    if (data.value === '04') {
      this.toggleFormFields(true, this.form, ['cuTextTypeDetails']);
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('cuTextTypeDetails', Validators.pattern(this.swiftXChar), 0);
      }
    } else {
      this.toggleFormFields(false, this.form, ['cuTextTypeDetails']);
      this.form.get('cuTextTypeDetails')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.clearValidators();
    }
  }
  onClickCuTextLanguage(data: any) {
    if (data.value === '*') {
      this.toggleFormFields(true, this.form, ['cuTextLanguageOther']);
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_TEXT_LANGUAGE], false);
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('cuTextLanguageOther', Validators.pattern(this.swiftXChar), 0);
      }
    } else {
      this.toggleFormFields(false, this.form, ['cuTextLanguageOther']);
      this.form.get('cuTextLanguageOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.clearValidators();
    }
  }

  getCountryDetail() {
    this.commonService.getCountries().subscribe(data => {
       this.updateCountries(data);
    });
  }

  updateCountries(body: any) {
    this.countryList = body;
    this.countryList.countries.forEach(value => {
      const country: { label: string; value: any } = {
        label: value.alpha2code + '-' + value.name,
        value: {
          label: value.alpha2code,
          shortName: value.alpha2code,
          name: value.name
        }
      };
      this.country.push(country);
    });
    this.updateCountry();
  }

  updateCountry() {
    if (this.form.get('cuGovernCountry') && this.form.get('cuGovernCountry').value) {
        const cuGovernCountry =
        this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired).
        get('uiCuUndertakingDetails').get('cuGovernCountry').value.shortName;
        const cuGovernCountryLabel = this.country.filter( task => task.value.label === cuGovernCountry);
        const cuGovernCountryName = this.country.filter( task => task.value.shortName === cuGovernCountry);
        if (cuGovernCountryLabel !== undefined && cuGovernCountryLabel !== null
        && cuGovernCountryLabel.length > 0) {
          this.form.get('cuGovernCountry').setValue(cuGovernCountryLabel[0].value);
        } else if (cuGovernCountryName !== undefined && cuGovernCountryName !== null
          && cuGovernCountryName.length > 0) {
          this.form.get('cuGovernCountry').setValue(cuGovernCountryName[0].value.label);
        }
    }
  }
  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
  }

  populateDataFromCopyFrom() {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
   // const option = this.uiService.getOption();
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (tnxTypeCode === FccGlobalConstant.N002_NEW && mode === FccGlobalConstant.DRAFT_OPTION) {
      this.updateCountry();
      if (this.form.get('cuTextLanguage').value && this.form.get('cuTextLanguage').value === '*') {
        this.toggleFormFields(true, this.form, ['cuTextLanguageOther']);
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_TEXT_LANGUAGE], false);
      } else {
        this.toggleFormFields(false, this.form, ['cuTextLanguageOther']);
      }
      if (this.form.get('cuTextTypeCode').value && this.form.get('cuTextTypeCode').value === '04') {
        this.toggleFormFields(true, this.form, ['cuTextTypeDetails']);
      } else {
        this.toggleFormFields(false, this.form, ['cuTextTypeDetails']);
      }
      if (this.form.get('cuRule').value && this.form.get('cuRule').value === '99') {
        this.toggleFormFields(true, this.form, ['cuRuleOther']);
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_RULE], false);
      } else {
        this.toggleFormFields(false, this.form, ['cuRuleOther']);
      }
      }
  }

}
