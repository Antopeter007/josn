import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CorporateDetails } from '../../../../../../common/model/corporateDetails';
import { CounterpartyDetailsList } from '../../../../../../common/model/counterpartyDetailsList';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { CorporateCommonService } from '../../../../../common/services/common.service';
import { LcConstant } from '../../../../lc/common/model/constant';
import { ProductStateService } from '../../../../lc/common/services/product-state.service';
import { ImportLetterOfCreditResponse } from '../../../../lc/initiation/model/models';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { CountryList } from './../../../../../../common/model/countryList';
import { UiService } from '../../../common/services/ui-service';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-ui-cu-beneficiary-details',
  templateUrl: './ui-cu-beneficiary-details.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiCuBeneficiaryDetailsComponent }]
})
export class UiCuBeneficiaryDetailsComponent extends UiProductComponent implements OnInit {

  beneficiaries = [];
  updatedBeneficiaries = [];
  responseStatusCode = 200;
  counterpartyDetailsList: CounterpartyDetailsList;
  corporateDetails: CorporateDetails;
  country = [];
  cuBeneficiaryCountry = [];
  cuBeneficiaryContactcountry = [];
  countryList: CountryList;
  form: FCCFormGroup;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  swifCodeRegex: any;
  advisingBankResponse;
  appBenAddressRegex: any;
  appBenNameLength: any;
  swiftXcharRegex: any;
  maxlength = this.lcConstant.maximumlength;
  mode;
  lcResponseForm = new ImportLetterOfCreditResponse();
  @Input() parentForm: FCCFormGroup;
  @Input() controlName;
  module = ``;
  cuBeneficiaryDetails;
  entityAddressType: any;
  benePreviousValue: any;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected corporateCommonService: CorporateCommonService,
              protected dropdownAPIService: DropDownAPIService, protected multiBankService: MultiBankService,
              protected confirmationService: ConfirmationService, protected uiService: UiService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
    super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray, dialogRef,
      currencyConverterPipe, uiProductService);
}
  ngOnInit(): void {
    this.initializeFormGroup();
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.mode =
    this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
    this.form.get('cuBeneficiaryContactFullAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swifCodeRegex = response.bigSwiftCode;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.BeneficiaryNameLength;
        this.swiftXcharRegex = response.swiftXCharacterSet;
        this.clearingFormValidators(['cuBeiCode', 'cuBeneficiaryName', 'cuBeneficiaryFirstAddress',
            'cuBeneficiarySecondAddress', 'cuBeneficiaryThirdAddress', 'cuBeneficiaryFourthAddress']);
        if (this.mode === FccBusinessConstantsService.SWIFT && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
          this.form.addFCCValidators('cuBeiCode', Validators.pattern(this.swifCodeRegex), 0);
          this.form.addFCCValidators('cuBeneficiaryName', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('cuBeneficiaryFirstAddress', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('cuBeneficiarySecondAddress', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('cuBeneficiaryThirdAddress', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('cuBeneficiaryFourthAddress', Validators.pattern(this.swiftXcharRegex), 0);
          const val: string = this.form.get('cuBeiCode').value;
          const regex = new RegExp(this.swifCodeRegex);

          if(this.form.get('cuBeiCode').value && !regex.test(val)) {
            this.form.get('cuBeiCode').setErrors({ invalidBICError: true });
            this.form.get('cuBeiCode').markAsDirty();
            this.form.get('cuBeiCode').markAsTouched();
          }
        }
        this.form.get('cuBeneficiaryName')[this.params][this.maxlength] = this.appBenNameLength;
        if(this.commonService.isnonEMptyString(this.form.get('cuBeneficiaryFirstAddress'))){
          this.form.get('cuBeneficiaryFirstAddress')[this.params][this.maxlength] = this.appBenNameLength;
        }
        if(this.commonService.isnonEMptyString(this.form.get('cuBeneficiarySecondAddress'))){
          this.form.get('cuBeneficiarySecondAddress')[this.params][this.maxlength] = this.appBenNameLength;
        }
        if(this.commonService.isnonEMptyString(this.form.get('cuBeneficiaryThirdAddress'))){
          this.form.get('cuBeneficiaryThirdAddress')[this.params][this.maxlength] = this.appBenNameLength;
        }
        if(this.commonService.isnonEMptyString(this.form.get('cuBeneficiaryFourthAddress'))){
          this.form.get('cuBeneficiaryFourthAddress')[this.params][this.maxlength] = this.appBenNameLength;
        }
      }
    });
    this.handleSwiftFields();
    this.patchFieldParameters(this.form.get('cuBeneficiarycountry'), { options: this.country });
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.setContactBeneToggle();
      this.onClickCuBeneficiaryContactToggle();
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.form.get('cuBeiCode')[this.params][this.rendered] = false;
      if (this.commonService.isNonEmptyField('cuBeneficiaryFourthAddress', this.form)) {
        this.form.get('cuBeneficiaryFourthAddress')[this.params][this.rendered] = false;
      }
      if (this.commonService.isNonEmptyField('cuBeneficiaryContactFourthAddress', this.form)) {
        this.form.get('cuBeneficiaryContactFourthAddress')[this.params][this.rendered] = false;
      }
      this.form.get('cuBeneficiaryContactToggle')[this.params][this.rendered] = false;
      //this.handleBeneficiaryData();
      this.setContactBeneToggle();
      this.commonService.formatForm(this.form);
    }
    // if (this.form.get('cuBeneficiaryEntity').value !== undefined &&
    // this.form.get('cuBeneficiaryEntity').value !== FccGlobalConstant.EMPTY_STRING) {
    //   this.benePreviousValue = this.form.get('cuBeneficiaryEntity').value;
    // }
  }
  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.getCountryDetail();
    this.patchFieldParameters(this.form.get('cuBeneficiarycountry'), { options: this.country, appendToBody: true });
    this.patchFieldParameters(this.form.get('cuBeneficiaryContactcountry'), { options: this.country, appendToBody: true });
    // this.getBeneficiaries();
  }

  getCountryDetail() {
    this.commonService.getCountries().subscribe(data => {
      this.updateCountries(data);
    });
  }

  clearingFormValidators(fields: any){
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i])?.clearValidators();
    }
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
      const beneCountry: { label: string; value: any } = {
        label: value.alpha2code + '-' + value.name,
        value: {
          label: value.alpha2code,
          shortName: value.alpha2code,
          name: value.name
        }
      };
      this.cuBeneficiaryCountry.push(beneCountry);
      this.cuBeneficiaryContactcountry.push(beneCountry);
    });
    this.updateCountry();
  }

  updateCountry() {
    if (this.form.get('cuBeneficiarycountry') && this.form.get('cuBeneficiarycountry').value) {
      const cuBeneficiaryCountry =
      this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired).
      get('uiCuBeneficiaryDetails').get('cuBeneficiarycountry').value.shortName;
      const cuBeneficiarycountryLabel = this.country.filter( task => task.value.label === cuBeneficiaryCountry);
      const cuBeneficiarycountryName = this.country.filter( task => task.value.shortName === cuBeneficiaryCountry);
      if (cuBeneficiarycountryLabel !== undefined && cuBeneficiarycountryLabel !== null
        && cuBeneficiarycountryLabel.length > 0) {
        this.form.get('cuBeneficiarycountry').setValue(cuBeneficiarycountryLabel[0].value);
      } else if (cuBeneficiarycountryName !== undefined && cuBeneficiarycountryName !== null
        && cuBeneficiarycountryName.length > 0) {
        this.form.get('cuBeneficiarycountry').setValue(cuBeneficiarycountryName[0].value);
      }
    }
    if (this.form.get('cuBeneficiaryContactToggle').value === 'Y'
        &&this.form.get('cuBeneficiaryContactcountry')
        && this.form.get('cuBeneficiaryContactcountry').value) {
      const cuBeneficiaryContactcountry =
      this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired).
      get('uiCuBeneficiaryDetails').get('cuBeneficiaryContactcountry').value.shortName;
      const cuBeneficiaryContactcountryLabel = this.country.filter( task => task.value.label === cuBeneficiaryContactcountry);
      const cuBeneficiaryContactcountryName = this.country.filter( task => task.value.shortName === cuBeneficiaryContactcountry);
      if (cuBeneficiaryContactcountryLabel !== undefined && cuBeneficiaryContactcountryLabel !== null
        && cuBeneficiaryContactcountryLabel.length > 0) {
        this.form.get('cuBeneficiaryContactcountry').setValue(cuBeneficiaryContactcountryLabel[0].value);
      } else if (cuBeneficiaryContactcountryName !== undefined && cuBeneficiaryContactcountryName !== null
        && cuBeneficiaryContactcountryName.length > 0) {
        this.form.get('cuBeneficiaryContactcountry').setValue(cuBeneficiaryContactcountryName[0].value);
      }
    }
  }


  onKeyupCuBeneficiaryIcons(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      this.onClickCuBeneficiaryIcons();
    }
  }

  onClickCuBeneficiaryIcons() {
    const header = `${this.translateService.instant('listOfBanks')}`;
    const productCode = 'productCode';
    const subProductCode = 'subProductCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    const obj = {};
    obj[productCode] = '';
    obj[option] = 'staticBank';
    obj[subProductCode] = '';
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    const urlOption = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    if (urlOption === FccGlobalConstant.TEMPLATE) {
      const templateCreation = 'templateCreation';
      obj[templateCreation] = true;
    }
    this.resolverService.getSearchData(header, obj);
    this.advisingBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((advResponse) => {

      if (advResponse && advResponse !== null && advResponse.responseData && advResponse.responseData !== null) {
        advResponse.responseData.ISO_CODE ? this.form.get('cuBeiCode').patchValue(advResponse.responseData.ISO_CODE) :
        this.form.get('cuBeiCode').patchValue(advResponse.responseData[4]);
        advResponse.responseData.NAME ? this.form.get('cuBeneficiaryName').patchValue(advResponse.responseData.NAME) :
        this.form.get('cuBeneficiaryName').patchValue(advResponse.responseData[0]);
        advResponse.responseData.ADDRESS_LINE_1 ? this.form.get('cuBeneficiaryFirstAddress')
        .patchValue(advResponse.responseData.ADDRESS_LINE_1) :
        this.form.get('cuBeneficiaryFirstAddress').patchValue(advResponse.responseData[1]);
        advResponse.responseData.ADDRESS_LINE_2 ? this.form.get('cuBeneficiarySecondAddress')
        .patchValue(advResponse.responseData.ADDRESS_LINE_2) :
        this.form.get('cuBeneficiarySecondAddress').patchValue(advResponse.responseData[2]);
        advResponse.responseData.DOM ? this.form.get('cuBeneficiaryThirdAddress').patchValue(advResponse.responseData.DOM) :
        this.form.get('cuBeneficiaryThirdAddress').patchValue(advResponse.responseData[3]);
        if(advResponse.responseData[8]) {
          this.form.get('cuBeneficiarycountry').patchValue(
            this.country.filter( task => task.value.label === advResponse.responseData[8])[0]?.value);
        }
        if (this.mode !== FccBusinessConstantsService.SWIFT) {
          this.form.get('cuBeneficiaryFourthAddress').patchValue(advResponse.responseData.ADDRESS_LINE_4);
        }
        const val: string = this.form.get('cuBeiCode').value;
        const regex = new RegExp(this.swifCodeRegex);

        if(this.form.get('cuBeiCode').value && !regex.test(val)) {
          this.form.get('cuBeiCode').setErrors({ invalidBICError: true });
          this.form.get('cuBeiCode').markAsDirty();
          this.form.get('cuBeiCode').markAsTouched();
        }
        this.form.updateValueAndValidity();
      }
    });
  }

  getBeneficiaries() {
    this.corporateCommonService.getCounterparties(
      this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.counterparties)
      .subscribe(response => {
          if (response.status === this.responseStatusCode) {
             this.getBeneficiariesAsList(response.body);
          }
          this.updateUserEntities();
          if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
            this.handleBeneficiaryData();
          }
      });
  }

  handleSwiftFields() {
    this.mode = this.productStateService
    .getSectionData(
      FccGlobalConstant.UI_GENERAL_DETAIL,
      undefined,
      this.isMasterRequired
    )
    .get("advSendMode").value;

    if (this.mode === FccBusinessConstantsService.SWIFT && this.form.get('cuBeneficiaryFourthAddress')) {
      this.form.get('cuBeneficiaryFourthAddress')[this.params][this.rendered] = false;
    } else if (this.form.get('cuBeneficiaryFourthAddress')) {
      this.form.get('cuBeneficiaryFourthAddress')[this.params][this.rendered] = true;
    }
    this.form.updateValueAndValidity();
  }

  setContactBeneToggle(){
    if ((this.form.get('cuBeneficiaryContactName') && this.form.get('cuBeneficiaryContactName').value !== ''
    && this.form.get('cuBeneficiaryContactName').value !== null) ||
    (this.form.get('cuBeneficiaryContactSecondAddress') && this.form.get('cuBeneficiaryContactSecondAddress').value !== '' &&
    this.form.get('cuBeneficiaryContactSecondAddress').value !== null) ||
    (this.form.get('cuBeneficiaryContactThirdAddress') && this.form.get('cuBeneficiaryContactThirdAddress').value !== '' &&
    this.form.get('cuBeneficiaryContactThirdAddress').value !== null) ||
    (this.form.get('cuBeneficiaryContactFirstAddress') && this.form.get('cuBeneficiaryContactFirstAddress').value !== '' &&
    this.form.get('cuBeneficiaryContactFirstAddress').value !== null) ||
    (this.form.get('cuBeneficiaryContactcountry') && this.form.get('cuBeneficiaryContactcountry').value !== '' &&
    this.form.get('cuBeneficiaryContactcountry').value !== null)) {
      this.form.get('cuBeneficiaryContactToggle').setValue('Y');
      this.form.get('cuBeneficiaryContactToggle').updateValueAndValidity();
    }
  }

  updateBeneficiaries(): any[] {
    this.updatedBeneficiaries = [];
    let applicantEntity ;
    const entityDetails =
    this.productStateService.getSectionData(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS, undefined, this.isMasterRequired);
    if (typeof entityDetails.get(FccGlobalConstant.APPLICANT_ENTITY).value === FccGlobalConstant.OBJECT) {
      applicantEntity = entityDetails.get(FccGlobalConstant.APPLICANT_ENTITY).value.shortName;
    } else if (typeof (entityDetails.get(FccGlobalConstant.APPLICANT_ENTITY).value) === FccGlobalConstant.STRING) {
      applicantEntity = entityDetails.get(FccGlobalConstant.APPLICANT_ENTITY).value;
    }
    if (applicantEntity !== undefined && applicantEntity !== '') {
      this.beneficiaries.forEach(value => {
        if (applicantEntity === value.value.entity || value.value.entity === '&#x2a;') {
          const beneficiary: { label: string; value: any } = {
            label: value.label,
            value: value.value
          };
          this.updatedBeneficiaries.push(beneficiary);
        }
      });
    }
    return this.updatedBeneficiaries;
  }


  updateUserEntities() {
    this.patchFieldParameters(this.form.get('cuBeneficiaryName'), { options: this.updateBeneficiaries() });
    this.form.get('cuBeneficiaryName').updateValueAndValidity();
    if (this.updatedBeneficiaries.length === 1) {
      this.patchFieldParameters(this.form.get('cuBeneficiaryName'), { autoDisplayFirst: true });
      this.patchFieldParameters(this.form.get('cuBeneficiaryName'), { readonly: true });
      this.onClickCuBeneficiaryEntity(this.updatedBeneficiaries[0]);
    } else {
      this.patchFieldParameters(this.form.get('cuBeneficiaryName'), { readonly: false });
      this.patchFieldParameters(this.form.get('cuBeneficiaryName'), { autoDisplayFirst: false });
    }
    this.patchFieldParameters(this.form.get('cuBeneficiaryName'), { options: this.updateBeneficiaries() });
    this.form.get('cuBeneficiaryName').updateValueAndValidity();
    this.UpdateEntityBeni();
  }

  UpdateEntityBeni() {
    if (this.form.get('cuBeneficiaryName') && this.form.get('cuBeneficiaryName').value) {
      const beneficiaryEntity =
      this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired).
      get('uiCuBeneficiaryDetails').get('cuBeneficiaryName');
      if (beneficiaryEntity) {
        const beneficiaryNameLabel = this.updatedBeneficiaries.filter(task => task.value.label === beneficiaryEntity);
        const beneficiaryName = this.updatedBeneficiaries.filter(task => task.value.name === beneficiaryEntity);
        if (beneficiaryNameLabel !== undefined && beneficiaryNameLabel !== null && beneficiaryNameLabel.length > 0) {
          this.form.get('cuBeneficiaryName').setValue(beneficiaryNameLabel[0].value);
        } else if (beneficiaryName !== undefined && beneficiaryName !== null && beneficiaryName.length > 0) {
          this.form.get('cuBeneficiaryName').setValue(beneficiaryName[0].value);
        }
        this.form.get('cuBeneficiaryName').updateValueAndValidity();
      }
    }
    else if (this.benePreviousValue !== undefined && this.benePreviousValue !== null) {
      this.form.get('cuBeneficiaryName').setValue(this.benePreviousValue);
    }
  }

  getBeneficiariesAsList(body: any) {
    this.counterpartyDetailsList = body;
    if (this.commonService.addressType && this.commonService.addressType === FccGlobalConstant.POSTAL_ADDRESS_PA) {
      this.entityAddressType = FccGlobalConstant.POSTAL_ADDRESS;
    } else {
      this.entityAddressType = FccGlobalConstant.SWIFT_ADDRESS_LOWERCASE;
    }
    this.counterpartyDetailsList.items.forEach(value => {
      const beneficiary: { label: string; value: any } = {
        label: this.commonService.decodeHtml(value.name),
        value: {
          label: this.commonService.decodeHtml(value.shortName),
          swiftAddressLine1: this.commonService.decodeHtml(value[this.entityAddressType].line1),
          swiftAddressLine2: this.commonService.decodeHtml(value[this.entityAddressType].line2),
          swiftAddressLine3: this.commonService.decodeHtml(value[this.entityAddressType].line3),
          entity: decodeURI(value.entityShortName),
          shortName: this.commonService.decodeHtml(value.shortName),
          name: this.commonService.decodeHtml(value.name)
        }
      };
      this.beneficiaries.push(beneficiary);
      this.updatedBeneficiaries.push(beneficiary);
    });
    if (this.form.get('cuBeneficiaryEntity') &&
    this.form.get('cuBeneficiaryEntity').value !== FccGlobalConstant.EMPTY_STRING) {
      const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.updatedBeneficiaries, 'cuBeneficiaryEntity', this.form);
      if (valObj && valObj[`value`] !== undefined) {
        this.form.get('cuBeneficiaryName').patchValue(valObj[`value`]);
      }
    }
  }

  onClickCuBeneficiaryEntity(event) {
    if (event.value) {
      this.form.get('cuBeneficiaryName').setValue(event.value);
      this.form.get('cuBeneficiaryFirstAddress').setValue(event.value.swiftAddressLine1);
      this.form.get('cuBeneficiarySecondAddress').setValue(event.value.swiftAddressLine2);
      this.form.get('cuBeneficiaryThirdAddress').setValue(event.value.swiftAddressLine3);
      if (this.form.get('cuBeneficiaryFourthAddress')) {
        this.form.get('cuBeneficiaryFourthAddress').setValue(event.value.swiftAddressLine4);
      }
      this.patchFieldValueAndParameters(this.form.get('cuBeneficiarycountry'),
          { label: event.value.country, shortName: event.value.country }, '');
    }
  }

  onClickCuBeneficiaryContactToggle() {
    let togglevalue: any;
    if (this.form.get('cuBeneficiaryContactToggle')) {
      togglevalue = this.form.get('cuBeneficiaryContactToggle').value;
    }
    if (togglevalue === FccBusinessConstantsService.NO) {
      this.form.get('cuBeneficiaryContactName')[this.params][this.rendered] = false;
      this.form.get('cuBeneficiaryContactFirstAddress')[this.params][this.rendered] = false;
      this.form.get('cuBeneficiaryContactSecondAddress')[this.params][this.rendered] = false;
      this.form.get('cuBeneficiaryContactThirdAddress')[this.params][this.rendered] = false;
      this.form.get('cuBeneficiaryContactFourthAddress')[this.params][this.rendered] = false;
      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        this.form.get('cuBeneficiaryContactFourthAddress')[this.params][this.rendered] = false;
        this.form.get('cuBeneficiaryContactFourthAddress').clearValidators();
        this.form.get('cuBeneficiaryContactFourthAddress').updateValueAndValidity();
      }
      this.form.get('cuBeneficiaryContactcountry')[this.params][this.rendered] = false;
      this.setMandatoryFields(
        this.form,
        [
          "cuBeneficiaryContactName",
          "cuBeneficiaryContactFirstAddress",
          "cuBeneficiaryContactSecondAddress",
          "cuBeneficiaryContactThirdAddress",
          "cuBeneficiaryContactFourthAddress",
          "cuBeneficiaryContactcountry",
        ],
        false
      );
      this.form.get('cuBeneficiaryContactName').clearValidators();
      this.form.get('cuBeneficiaryContactFirstAddress').clearValidators();
      this.form.get('cuBeneficiaryContactSecondAddress').clearValidators();
      this.form.get('cuBeneficiaryContactThirdAddress').clearValidators();
      this.form.get('cuBeneficiaryContactcountry').clearValidators();
      this.form.get('cuBeneficiaryContactName').updateValueAndValidity();
      this.form.get('cuBeneficiaryContactFirstAddress').updateValueAndValidity();
      this.form.get('cuBeneficiaryContactSecondAddress').updateValueAndValidity();
      this.form.get('cuBeneficiaryContactThirdAddress').updateValueAndValidity();
      this.form.get('cuBeneficiaryContactcountry').updateValueAndValidity();
    } else {
      if (this.form.get('cuBeneficiaryContactName')) {
        this.form.get('cuBeneficiaryContactName')[this.params][this.rendered] = true;
      }
      if (this.form.get('cuBeneficiaryContactFirstAddress')) {
        this.form.get('cuBeneficiaryContactFirstAddress')[this.params][this.rendered] = true;
      }
      if (this.form.get('cuBeneficiaryContactSecondAddress')) {
        this.form.get('cuBeneficiaryContactSecondAddress')[this.params][this.rendered] = true;
      }
      if (this.form.get('cuBeneficiaryContactThirdAddress')) {
        this.form.get('cuBeneficiaryContactThirdAddress')[this.params][this.rendered] = true;
      }
      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        if (this.form && this.form.get('cuBeneficiaryContactFourthAddress')) {
          this.form.get('cuBeneficiaryContactFourthAddress')[this.params][this.rendered] = true;
        }
      }
      if (this.form.get('cuBeneficiaryContactcountry')) {
        this.form.get('cuBeneficiaryContactcountry')[this.params][this.rendered] = true;
      }
    }
  }

  handleBeneficiaryData() {
    let cuBeneficiaryEntity = this.commonService.isNonEmptyField('cuBeneficiaryName', this.form) ?
    this.form.get('cuBeneficiaryName').value : this.form.get('cuBeneficiaryName');
    if (typeof cuBeneficiaryEntity === 'object') {
      cuBeneficiaryEntity = cuBeneficiaryEntity.label;
    }
    const cuBeneficiaryEntityLabel = this.updatedBeneficiaries.filter( task => task.value.label === cuBeneficiaryEntity);
    if (cuBeneficiaryEntityLabel !== undefined && cuBeneficiaryEntityLabel !== null && cuBeneficiaryEntityLabel.length > 0) {
         this.form.get('cuBeneficiaryName').setValue(cuBeneficiaryEntityLabel[0].value.shortName);
    }
    this.form.get(FccTradeFieldConstants.CU_BENEFICIARY_ENTITY).updateValueAndValidity();
    this.form.updateValueAndValidity();
  }
  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
  }
}
