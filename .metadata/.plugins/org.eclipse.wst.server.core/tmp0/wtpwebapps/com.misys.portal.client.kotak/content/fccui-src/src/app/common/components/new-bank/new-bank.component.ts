import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FCCBase } from './../../../../app/base/model/fcc-base';
import { FCCFormGroup } from './../../../../app/base/model/fcc-control.model';
import { FccTradeFieldConstants } from './../../../../app/corporate/trade/common/fcc-trade-field-constants';
import { LcConstant } from './../../../../app/corporate/trade/lc/common/model/constant';
import { FormControlService } from './../../../../app/corporate/trade/lc/initiation/services/form-control.service';
import { HOST_COMPONENT } from './../../../../app/shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccGlobalConfiguration } from './../../core/fcc-global-configuration';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../core/fcc-global-constants';
import { CountryList } from './../../model/countryList';
import { ProductParams } from './../../model/params-model';
import { CommonService } from './../../services/common.service';
import { MultiBankService } from './../../services/multi-bank.service';

@Component({
  selector: 'fcc-new-bank',
  templateUrl: '../../../base/model/form.render.html',
  styleUrls: ['./new-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: NewBankComponent }]
})
export class NewBankComponent extends FCCBase implements OnInit {
  form: FCCFormGroup;
  module = '';
  options = 'options';
  entities: any;
  country = [];
  countryList: CountryList;
  bankCountry = [];
  contentRegex: any;
  swiftXCharRegex: any;
  swifCodeRegex: any;
  emailRegex: any;
  bankAbbvNameRegex: any;
  nameLength: any;
  nameMaxLength: any;
  address1MaxLength: any;
  address2MaxLength: any;
  address3MaxLength: any;
  address4MaxLength: any;
  mobileRegEx: any;
  mobileNoMaxLength: any;
  mobileNoMinLength: any;
  configuredKeysList = 'BANK_ABBVNAME_VALIDATION_REGEX,MOBILE_FORMAT_MINLENGTH,MOBILE_FORMAT_REGEX,MOBILE_FORMAT_MAXLENGTH,' +
                       'address1.trade.length,address2.trade.length,dom.trade.length,address4.trade.length,name.trade.length';
  keysNotFoundList: any[] = [];
  formData = new Map();
  params = FccGlobalConstant.PARAMS;
  rendered = FccGlobalConstant.RENDERED;
  required = FccGlobalConstant.REQUIRED;

  @Output()
  bankCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  bankSave: EventEmitter<any> = new EventEmitter<any>();
  lcConstant = new LcConstant();
  constructor(protected translateService: TranslateService, protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected formControlService: FormControlService,
              protected multiBankService: MultiBankService, protected fccGlobalConfiguration: FccGlobalConfiguration) {
    super();
  }

  ngOnInit(): void {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swifCodeRegex = response.bigSwiftCode;
        this.contentRegex = response.swiftZChar;
        this.swiftXCharRegex = response.swiftXCharacterSet;
        this.emailRegex = response.emailRegex;
        this.nameLength = response.BeneficiaryNameLength;
      }
    });
    this.initializeFormGroup();
    this.clearingFormValidators(['bicCode', 'bankFullName', 'bankAbbvName', 'bankEntity', 'country',
      'swiftAddress1', 'swiftAddress2', 'swiftAddress3', 'postalAddress1', 'postalAddress2', 'postalAddress3',
      'postalAddress4', 'contactName', 'contactNumber', 'fax', 'telex', 'email', 'webAddress']);
    this.form.addFCCValidators(FccTradeFieldConstants.BIC_CODE,
      Validators.compose([Validators.maxLength(FccGlobalConstant.MAX_LENGTH_11), Validators.pattern(this.swifCodeRegex)]), 0);
    this.form.addFCCValidators(FccTradeFieldConstants.EMAIL,
      Validators.compose([Validators.required, Validators.pattern(this.emailRegex)]), 0);
    this.form.addFCCValidators(FccTradeFieldConstants.WEB_ADDRESS,
      Validators.compose([Validators.maxLength(FccGlobalConstant.MAX_LENGTH_40), 
      Validators.pattern(FccGlobalConstant.REGEX_WEB_ADDRESS)]), 0);
    this.keysNotFoundList = this.configuredKeysList.split(',');
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response.response && response.response === FccGlobalConstant.REST_API_SUCCESS) {
          this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
          this.updateValues();
        }
      });
    } else {
        this.updateValues();
    }
    const fields = ['swiftAddress2', 'contactName', 'postalAddress3', 'swiftAddress3', 'fax', 'bicCode', 'contactNumber', 'postalAddress4',
    'postalAddress1', 'telex', 'postalAddress2', 'webAddress'];
    fields.forEach(ele => {
      this.form.get(ele).setValue('');
      this.form.get(ele).updateValueAndValidity();
    });
  }

  initializeFormGroup() {
    const refModel = FccTradeFieldConstants.BANK_MODEL;
    const params: ProductParams = {
      type: FccGlobalConstant.MODEL_SUBSECTION
    };
    this.commonService.getProductModel(params).subscribe(
      response => {
        const dialogmodel = JSON.parse(JSON.stringify(response[refModel]));
        this.form = this.formControlService.getFormControls(dialogmodel);
        const language = localStorage.getItem(FccGlobalConstant.LANGUAGE);
        if (language === FccGlobalConstant.LANGUAGE_FR){
          this.form.get(FccTradeFieldConstants.BANK_CANCEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.PARENT_STYLE_CLASS] =
          this.form.get(FccTradeFieldConstants.BANK_CANCEL)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.PARENT_STYLE_CLASS
          ] + ' bankCancelButtonfr';
        }
        if (language === FccGlobalConstant.LANGUAGE_AR){
          this.form.get(FccTradeFieldConstants.BANK_CANCEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.PARENT_STYLE_CLASS] =
          this.form.get(FccTradeFieldConstants.BANK_CANCEL)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.PARENT_STYLE_CLASS
          ] + ' bankCancelButtonAr';
        }
    });
    this.getUserEntities();
    this.getCountryDetail();
    this.form.get('addressDetailsType').setValue('swiftAddress');
    this.patchFieldParameters(this.form.get('addressDetailsType'), { options: this.getSelectButtonArray() });
    this.patchFieldParameters(this.form.get('country'), { options: this.bankCountry });
    this.commonService.formatForm(this.form);
    this.onClickAddressDetailsType(this.form.get('addressDetailsType'));

    this.form.statusChanges.subscribe(
      status => {
        if (status === FccGlobalConstant.VALID) {
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.BANK_SAVE), { btndisable: false });
        }else {
            this.patchFieldParameters(this.form.get(FccTradeFieldConstants.BANK_SAVE), { btndisable: true });
           }
      }
    );
  }

  getSelectButtonArray(): any[] {
    const selectButtonArr = [
      { label: `${this.translateService.instant('swiftAddressLabel')}`, value: 'swiftAddress' },
      { label: `${this.translateService.instant('postalAddress')}`, value: 'postalAddress' }
    ];
    return selectButtonArr;
  }

  clearingFormValidators(fields: any){
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
    }
  }

  updateValues() {
    this.nameMaxLength = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.NAME_MAX_LENGTH);
    this.bankAbbvNameRegex = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.BANK_ABBVNAME_VALIDATION_REGEX);
    this.form.addFCCValidators(FccTradeFieldConstants.BANK_ABBV_NAME,
      Validators.compose([Validators.required, Validators.maxLength(this.nameMaxLength), 
      Validators.pattern(this.bankAbbvNameRegex)]), 0);
    this.form.addFCCValidators(FccTradeFieldConstants.BANK_FULL_NAME,
      Validators.compose([Validators.required,Validators.maxLength(this.nameMaxLength), 
      Validators.pattern(this.swiftXCharRegex)]), 0);
    this.form.addFCCValidators(FccTradeFieldConstants.CONTACT_NAME,
      Validators.compose([Validators.maxLength(this.nameMaxLength), Validators.pattern(this.swiftXCharRegex)]), 0);
    this.address1MaxLength = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.ADDRESS1_MAXLENGTH); 
    this.form.addFCCValidators(FccTradeFieldConstants.SWIFT_ADDRESS1,
      Validators.compose([Validators.required, Validators.maxLength(this.address1MaxLength),
      Validators.pattern(this.swiftXCharRegex)]), 0);
    this.address2MaxLength = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.ADDRESS2_MAXLENGTH);
    this.form.addFCCValidators(FccTradeFieldConstants.SWIFT_ADDRESS2,
      Validators.compose([Validators.maxLength(this.address2MaxLength), Validators.pattern(this.swiftXCharRegex)]), 0);
    this.address3MaxLength = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.ADDRESS3_MAXLENGTH);
    this.form.addFCCValidators(FccTradeFieldConstants.SWIFT_ADDRESS3,
      Validators.compose([Validators.maxLength(this.address3MaxLength), Validators.pattern(this.swiftXCharRegex)]), 0);
    this.form.addFCCValidators(FccTradeFieldConstants.POSTAL_ADDRESS1,
        Validators.compose([Validators.maxLength(this.address1MaxLength), Validators.pattern(this.swiftXCharRegex)]), 0);
    this.form.addFCCValidators(FccTradeFieldConstants.POSTAL_ADDRESS2,
        Validators.compose([Validators.maxLength(this.address2MaxLength), Validators.pattern(this.swiftXCharRegex)]), 0);
    this.form.addFCCValidators(FccTradeFieldConstants.POSTAL_ADDRESS3,
        Validators.compose([Validators.maxLength(this.address3MaxLength), Validators.pattern(this.swiftXCharRegex)]), 0);
    this.address4MaxLength = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.ADDRESS4_MAXLENGTH);
    this.form.addFCCValidators(FccTradeFieldConstants.POSTAL_ADDRESS4,
        Validators.compose([Validators.maxLength(this.address4MaxLength), Validators.pattern(this.swiftXCharRegex)]), 0);
    this.mobileRegEx = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.MOBILE_FORMAT_REGEX);
    this.mobileNoMaxLength = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.MOBILE_FORMAT_MAXLENGTH);
    this.mobileNoMinLength = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.MOBILE_FORMAT_MINLENGTH);
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.CONTACT_NUMBER), { maxlength: this.mobileNoMaxLength });
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.CONTACT_NUMBER), { minlength: this.mobileNoMinLength });
    this.form.addFCCValidators(FccTradeFieldConstants.CONTACT_NUMBER,
      Validators.compose([Validators.maxLength(this.mobileNoMaxLength),
      Validators.minLength(this.mobileNoMinLength), Validators.pattern(this.mobileRegEx)]), 0);
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.FAX), { maxlength: this.mobileNoMaxLength });
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.FAX), { minlength: this.mobileNoMinLength });
    this.form.addFCCValidators(FccTradeFieldConstants.FAX,
      Validators.compose([Validators.maxLength(this.mobileNoMaxLength),
      Validators.minLength(this.mobileNoMinLength), Validators.pattern(this.mobileRegEx)]), 0);
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.TELEX), { maxlength: this.mobileNoMaxLength });
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.TELEX), { minlength: this.mobileNoMinLength });
    this.form.addFCCValidators(FccTradeFieldConstants.TELEX,
      Validators.compose([Validators.maxLength(this.mobileNoMaxLength),
      Validators.minLength(this.mobileNoMinLength), Validators.pattern(this.mobileRegEx)]), 0);
  }

  onClickBankCancel(){
    this.bankCancel.emit();
  }

  onClickSave() {
    if (this.validateAllFields(this.form)) {
      this.setFormData();
      const jsonObject = {};
      this.formData.forEach((value, key) => { jsonObject[key] = value; });
      this.commonService.saveOrSubmitBank(jsonObject).subscribe(response => {
        if (response) {
          this.bankSave.emit();
        }
      });
    }
  }

  setFormData() {
    this.formData.set('abbv_name', this.form.get(FccTradeFieldConstants.BANK_ABBV_NAME).value);
    this.formData.set('address_line_1', this.form.get(FccTradeFieldConstants.SWIFT_ADDRESS1).value);
    this.formData.set('address_line_2', this.form.get(FccTradeFieldConstants.SWIFT_ADDRESS2).value);
    //this.formData.set('bei', '');
    this.formData.set('contact_name', this.form.get(FccTradeFieldConstants.CONTACT_NAME).value);
    this.formData.set('country', this.form.get(FccTradeFieldConstants.BANK_COUNTRY).value.shortName);
    this.formData.set('country_sub_div', this.form.get(FccTradeFieldConstants.POSTAL_ADDRESS3).value);
    this.formData.set('dom', this.form.get(FccTradeFieldConstants.SWIFT_ADDRESS3).value);
    this.formData.set('email', this.form.get(FccTradeFieldConstants.EMAIL).value);
    this.formData.set('entity', this.form.get(FccTradeFieldConstants.BANK_ENTITY).value.value);
    this.formData.set('fax', this.form.get(FccTradeFieldConstants.FAX).value);
    this.formData.set('iso_code', this.form.get(FccTradeFieldConstants.BIC_CODE).value);
    this.formData.set('name', this.form.get(FccTradeFieldConstants.BANK_FULL_NAME).value);
    this.formData.set('phone', this.form.get(FccTradeFieldConstants.CONTACT_NUMBER).value);
    this.formData.set('post_code', this.form.get(FccTradeFieldConstants.POSTAL_ADDRESS4).value);
    this.formData.set('street_name', this.form.get(FccTradeFieldConstants.POSTAL_ADDRESS1).value);
    //this.formData.set('swift_address_line_1', '');
    this.formData.set('telex', this.form.get(FccTradeFieldConstants.TELEX).value);
    this.formData.set('town_name', this.form.get(FccTradeFieldConstants.POSTAL_ADDRESS2).value);
    this.formData.set('web_address', this.form.get(FccTradeFieldConstants.WEB_ADDRESS).value);
  }

  validateAllFields(form: FCCFormGroup): boolean {
    form.markAllAsTouched();
    let isValid = false;
    if (this.form.valid) {
      isValid = true;
    }
    return isValid;
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
      const countryDetail: { label: string; value: any } = {
        label: value.alpha2code + '-' + value.name,
        value: {
          label: value.alpha2code,
          shortName: value.alpha2code,
          name: value.name
        }
      };
      this.bankCountry.push(countryDetail);
    });
    this.updateCountryValues();
  }

  updateCountryValues() {
    if (this.commonService.isNonEmptyField(FccTradeFieldConstants.BANK_COUNTRY, this.form) &&
     this.commonService.isNonEmptyValue(this.form.get(FccTradeFieldConstants.BANK_COUNTRY).value) &&
     this.bankCountry.length > 0) {
      const bankCountry = this.form.get(FccTradeFieldConstants.BANK_COUNTRY).value;
      if (this.commonService.isNonEmptyValue(bankCountry) && bankCountry !== '') {
        const exists = this.bankCountry.filter(
          task => task.value.shortName === bankCountry.shortName);
        if (this.commonService.isNonEmptyValue(exists) && exists.length > 0) {
          this.form.get(FccTradeFieldConstants.BANK_COUNTRY).setValue( this.bankCountry.filter(
            task => task.value.shortName === bankCountry.shortName)[0].value);
        }
      }
    }
  }

  getUserEntities() {
    const elementId = FccTradeFieldConstants.BANK_ENTITY;
    const elementValue = this.form.get(elementId).value;
    const nonEntity = {
      label: FccGlobalConstant.ENTITY_DEFAULT,
      value: {
        label: FccGlobalConstant.ENTITY_DEFAULT,
        value: FccGlobalConstant.ENTITY_DEFAULT,
        name: FccGlobalConstant.ENTITY_DEFAULT
      }
    };
    if (elementValue.length === 0) {
          let entityDataArray = [];
          if (this.form.get(elementId)[this.options].length === 0 ) {
          this.commonService.getFormValues(this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.userEntities)
            .subscribe(result => {
              result.body.items.forEach(value => {
                const entity: { label: string; value: any } = {
                  label: value.shortName,
                  value: {
                    label: value.shortName,
                    value: value.shortName,
                    name: value.name
                  }
                };
                entityDataArray.push(entity);
              });
              entityDataArray = this.changeToAlphabeticalOrder(entityDataArray);
              this.patchFieldParameters(this.form.get(elementId), { options: entityDataArray });
              if (entityDataArray.length === 1) {
                this.form.get(elementId).setValue(entityDataArray[0].value);
                this.form.get(elementId).updateValueAndValidity();
              } else if (entityDataArray.length === 0) {
                this.form.get(elementId).setValue(nonEntity.value);
                this.patchFieldParameters(this.form.get(elementId), { rendered: false });
                this.form.get(elementId).updateValueAndValidity();
              } else {
                this.form.get(elementId).updateValueAndValidity();
              }
            });
          }
        }
  }

  onBlurBankAbbvName() {
    this.spaceValidation(FccTradeFieldConstants.BANK_ABBV_NAME);
    this.form.get(FccTradeFieldConstants.BANK_ABBV_NAME).setValue(this.form.get(FccTradeFieldConstants.BANK_ABBV_NAME).value.trim());
  }

  onBlurBankFullName() {
    this.spaceValidation(FccTradeFieldConstants.BANK_FULL_NAME);
    this.form.get(FccTradeFieldConstants.BANK_FULL_NAME).setValue(this.form.get(FccTradeFieldConstants.BANK_FULL_NAME).value.trim());
  }

  onBlurSwiftAddress1() {
    this.spaceValidation(FccTradeFieldConstants.SWIFT_ADDRESS1);
    this.form.get(FccTradeFieldConstants.SWIFT_ADDRESS1).setValue(this.form.get(FccTradeFieldConstants.SWIFT_ADDRESS1).value.trim());
  }

  onBlurEmail() {
    this.spaceValidation(FccTradeFieldConstants.EMAIL);
    this.form.get(FccTradeFieldConstants.EMAIL).setValue(this.form.get(FccTradeFieldConstants.EMAIL).value.trim());
  }

  spaceValidation(control: any) {
    const abbvValue = this.form.get(control).value;
    if ((abbvValue && abbvValue !== null) && (typeof abbvValue !== FccGlobalConstant.NUMBER)
    && abbvValue.trim().length === FccGlobalConstant.ZERO) {
     this.form.get(control).setErrors({ required: true });
     this.form.get(control).setValue(null);
    }
   }

   protected renderDependentFields(displayFields?: any, hideFields?: any) {
    if (displayFields) {
      this.toggleControls(this.form, displayFields, true);
      // this.setValueToNull(hideFields);
    }
    if (hideFields) {
      this.toggleControls(this.form, hideFields, false);
      this.setValueToNull(hideFields);
    }
    }

  setValueToNull(fieldName: any[]) {
    let index: any;
    for (index = 0; index < fieldName.length; index++) {
      this.form.controls[fieldName[index]].setValue('');
    }
  }

  changeToAlphabeticalOrder(dropdownList: any){
    dropdownList.sort((a, b) => {
      const x = a.label.toLowerCase();
      const y = b.label.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
    return dropdownList;
  }

  onClickAddressDetailsType(data: any) {
    if (data.value === 'swiftAddress') {
        const swiftAddressFields = ['swiftAddress', 'swiftAddress1', 'swiftAddress2', 'swiftAddress3'];
        const postalAddressFields = ['postalAddress', 'postalAddress1', 'postalAddress2', 'postalAddress3', 'postalAddress4'];
        const hideFields = postalAddressFields;
        this.toggleControls(this.form, hideFields, false);
        const displayFields = swiftAddressFields;
        this.renderDependentFields(displayFields);
        this.togglePreviewScreen(this.form, hideFields, true);
        this.form.updateValueAndValidity();
    }
    if (data.value === 'postalAddress') {
      const postalAddressFields = ['postalAddress', 'postalAddress1', 'postalAddress2', 'postalAddress3', 'postalAddress4'];
      const swiftAddressFields = ['swiftAddress', 'swiftAddress1', 'swiftAddress2', 'swiftAddress3'];
      const hideFields = swiftAddressFields;
      this.toggleControls(this.form, hideFields, false);
      const displayFields = postalAddressFields;
      this.renderDependentFields(displayFields);
      this.togglePreviewScreen(this.form, hideFields, true);
      this.form.updateValueAndValidity();
    }
  }

}
