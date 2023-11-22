import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { FCCFormControl, FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CountryList } from '../../../../../../common/model/countryList';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { UiService } from './../../../common/services/ui-service';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ui-terms',
  templateUrl: './ui-terms.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiTermsComponent }]
})

export class UiTermsComponent extends UiProductComponent implements OnInit {

  module = ``;
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  country = [];
  swiftXChar;
   countryList: CountryList;
   option: any;
  transmissionMode: any;
  swiftZChar;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef, protected uiService: UiService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.initializeFormGroup();
    this.populateDataFromCopyFrom();
    this.uiProductService.swift2023Changes();
    this.transmissionMode =
    this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.form.get(FccGlobalConstant.BG_RULE_OTHER).clearValidators();
    this.commonService.getSwiftVersionValue();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.swiftXChar = response.swiftXCharacterSet;
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
        (this.transmissionMode[0] && this.transmissionMode[0].value &&
          this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
        this.form.addFCCValidators('bgGovernText', Validators.pattern(this.swiftXChar), 0);
        this.form.addFCCValidators('bgRuleOther', Validators.pattern(this.swiftXChar), 0);
        if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023) {
          this.form.addFCCValidators('bgGovernCountrySubdiv', Validators.pattern(this.swiftXChar), 0);
        }
      } else {
        this.removeValidators(this.form, ['bgGovernText', 'bgRuleOther', 'bgGovernCountrySubdiv']);
      }
    });
    this.patchFieldParameters(this.form.get('bgGovernCountry'), { options: this.country });
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.form.get(FccTradeFieldConstants.BG_LANGUAGE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.getCountryDetail();
  }

  onClickBgRule(data: any) {

    if (data.value === '99') {
      this.toggleFormFields(true, this.form, ['bgRuleOther']);
      this.form.get('bgRuleOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.ISSUE_RULE_OTHER], false);
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryField(this.form, 'bgRuleOther', false);
      }
    } else {
      this.toggleFormFields(false, this.form, ['bgRuleOther']);
      this.form.get('bgRuleOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccGlobalConstant.BG_RULE_OTHER).clearValidators();
      this.form.get(FccGlobalConstant.BG_RULE_OTHER).updateValueAndValidity();
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.ISSUE_RULE_OTHER], true);
    }
    this.form.updateValueAndValidity();
  }

  onClickBgTextTypeCode(data: any) {
    if(this.commonService.isnonEMptyString(data) && data.value === "01" || data.value === "04")
    {
      this.form.get('bgTextLanguage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
    else
    {
      this.form.get('bgTextLanguage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('bgTextLanguage').setValue('');
    }

    if (data.value === '04') {
      this.toggleFormFields(true, this.form, ['bgTextTypeDetails']);
      this.form.get('bgTextTypeDetails')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryField(this.form, 'bgTextTypeDetails', false);
      }
    } else {
      this.toggleFormFields(false, this.form, ['bgTextTypeDetails']);
      this.form.get('bgTextTypeDetails')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    }
    this.form.updateValueAndValidity();
    this.setValidationForTextUndertaking(data);
  }

  setValidationForTextUndertaking(data: any) {

    // The below changes are done "Text Standard" is selected as "bank standard" then
    // "text of undertaking" need to be set as non-mandatory

    const narrativeSectionForm: FCCFormControl = this.productStateService.getControl(FccGlobalConstant.UI_UNDERTAKING_DETAILS,
      'uiNarrativeDetails', this.isMasterRequired, undefined);

    if (data.value === FccGlobalConstant.BANK_STANDARD) {
      this.setMandatoryField(narrativeSectionForm, 'bgNarrativeTextUndertaking', false);
      narrativeSectionForm.get('bgNarrativeTextUndertaking')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      narrativeSectionForm.get('bgNarrativeTextUndertaking').clearValidators();
    } else {
      this.setMandatoryField(narrativeSectionForm, 'bgNarrativeTextUndertaking', true);
      narrativeSectionForm.get('bgNarrativeTextUndertaking')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      narrativeSectionForm.get('bgNarrativeTextUndertaking').setValidators(Validators.compose([Validators.required,
      Validators.pattern(this.swiftZChar)]));
      narrativeSectionForm.get('bgNarrativeTextUndertaking').setErrors({ required: true });
    }
    narrativeSectionForm.updateValueAndValidity();

  }
  onClickBgTextLanguage(data: any) {

    if (data.value === '*') {
      this.toggleFormFields(true, this.form, ['bgTextLanguageOther']);
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.BG_TEXT_LANGUAGE], false);
      this.form.get('bgTextLanguageOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryField(this.form, 'bgTextLanguageOther', false);
      }
    } else {
      this.toggleFormFields(false, this.form, ['bgTextLanguageOther']);
      this.form.get('bgTextLanguageOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
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
          name: value.name,
          concatinatedName: value.alpha2code + '-' + value.name
        }
      };
      this.country.push(country);
    });
    this.updateCountry();
  }

  updateCountry() {
    if (this.form.get('bgGovernCountry') && this.form.get('bgGovernCountry').value) {
      const bgGovernCountry =
      this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired).
      get('uiTerms').get('bgGovernCountry').value.shortName;
      const bgGovernCountryLabel = this.country.filter( task => task.value.label === bgGovernCountry);
      const bgGovernCountryName = this.country.filter( task => task.value.shortName === bgGovernCountry);
      if (bgGovernCountryLabel !== undefined && bgGovernCountryLabel !== null
      && bgGovernCountryLabel.length > 0) {
        this.form.get('bgGovernCountry').setValue(bgGovernCountryLabel[0].value);
      } else if (bgGovernCountryName !== undefined && bgGovernCountryName !== null
        && bgGovernCountryName.length > 0) {
        this.form.get('bgGovernCountry').setValue(bgGovernCountryName[0].value);
      }
  }
  }

  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
  }

  populateDataFromCopyFrom() {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const option = this.uiService.getOption();
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (tnxTypeCode === FccGlobalConstant.N002_NEW &&
      (option === FccGlobalConstant.EXISTING_OPTION || option === FccGlobalConstant.TEMPLATE
        || mode === FccGlobalConstant.DRAFT_OPTION)) {
      this.updateCountry();
      if (this.form.get('bgTextLanguage').value && this.form.get('bgTextLanguage').value === '*') {
        this.toggleFormFields(true, this.form, ['bgTextLanguageOther']);
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.BG_TEXT_LANGUAGE], false);
      } else {
        this.toggleFormFields(false, this.form, ['bgTextLanguageOther']);
      }
      if (this.form.get('bgTextTypeCode').value && this.form.get('bgTextTypeCode').value === '04') {
        this.toggleFormFields(true, this.form, ['bgTextTypeDetails']);
      } else {
        this.toggleFormFields(false, this.form, ['bgTextTypeDetails']);
      }
      if (this.form.get('bgRule').value && this.form.get('bgRule').value === '99') {
        this.toggleFormFields(true, this.form, ['bgRuleOther']);
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.ISSUE_RULE_OTHER], false);
      } else {
        this.toggleFormFields(false, this.form, ['bgRuleOther']);
      }
      }
  }

}

