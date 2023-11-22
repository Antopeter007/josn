/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { BehaviorSubject } from 'rxjs';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccGlobalConfiguration } from '../../../../../../app/common/core/fcc-global-configuration';

import { ResolverService } from '../../../../../common/services/resolver.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { EcProductService } from '../../services/ec-product.service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { EcProductComponent } from './../ec-product/ec-product.component';

@Component({
  selector: 'app-ec-presenting-bank',
  templateUrl: './ec-presenting-bank.component.html',
  styleUrls: ['./ec-presenting-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EcPresentingBankComponent }]
})
export class EcPresentingBankComponent extends EcProductComponent implements OnInit {

  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  lcConstant = new LcConstant();
  form: FCCFormGroup;
  module = '';
  collectionTypeOptions: any;
  swifCodeRegex: any;
  appBenAddressRegex: any;
  appBenNameLength: any;
  appBenNameRegex: any;
  presentingBankResponse;
  collectingResponse;
  configuredKeysList = 'MOBILE_FORMAT_MINLENGTH,MOBILE_FORMAT_REGEX,MOBILE_FORMAT_MAXLENGTH';
  keysNotFoundList: any[] = [];
  mobileRegEx: any;
  mobileNoMaxLength: any;
  mobileNoMinLength: any;
  elementName = 'presentingBankName';
  elemntadd = 'presentingBankFirstAddress';
  swiftXcharRegex: any;
  PersonNumberEnable;

  constructor(protected commonService: CommonService, protected searchLayoutService: SearchLayoutService,
              protected stateService: ProductStateService, protected translateService: TranslateService,
              protected eventEmitterService: EventEmitterService, protected resolverService: ResolverService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected utilityService: UtilityService, protected fccGlobalConfiguration: FccGlobalConfiguration,
              protected currencyConverterPipe: CurrencyConverterPipe, protected ecProductService: EcProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, ecProductService);
  }

  ngOnInit(): void {
    this.collectionTypeOptions = this.stateService.getSectionData(FccGlobalConstant.EC_GENERAL_DETAILS).get('collectionTypeOptions').value;
    const obj = this.parentForm.controls[this.controlName];
    const option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    if (obj !== null) {
      this.form = obj as FCCFormGroup;
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swifCodeRegex = response.bigSwiftCode;
        this.appBenNameRegex = response.BeneficiaryNameRegex;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.swiftXcharRegex = response.swiftXCharacterSet;
        this.appBenNameLength = response.BeneficiaryNameLength;
        this.PersonNumberEnable = response.ContactPersonPhoneNumber;
        this.form.addFCCValidators('presentingBankContactPerson',
        Validators.compose([Validators.pattern(FccGlobalConstant.SPACE_REGEX)]), 0);
        this.form.addFCCValidators('presentingSwiftCode', Validators.pattern(this.swifCodeRegex), 0);
        this.form.addFCCValidators('presentingBankName', Validators.compose([Validators.maxLength(this.appBenNameLength)]), 1);
        this.form.addFCCValidators('presentingBankFirstAddress', Validators.compose([Validators.maxLength(this.appBenNameLength)]), 1);
        this.form.addFCCValidators('presentingBankSecondAddress', Validators.compose([Validators.maxLength(this.appBenNameLength)]), 1);
        this.form.addFCCValidators('presentingBankThirdAddress', Validators.compose([Validators.maxLength(this.appBenNameLength)]), 1);
        this.form.addFCCValidators('presentingBankFourthAddress',
        Validators.compose([Validators.maxLength(this.appBenNameLength)]), 1);
        this.form.addFCCValidators('presentingBankFullAddress',
        Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_1024)]), 1);
        if (this.collectionTypeOptions === '02' && option !== FccGlobalConstant.TEMPLATE)
        {
          this.form.get('presentingBankName')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
          this.form.get('presentingBankFirstAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
          this.setMandatoryField(this.form, this.elementName, true);
          this.form.addFCCValidators(this.elementName, Validators.required, 1);
          this.form.get(this.elementName).updateValueAndValidity();
          this.setMandatoryField(this.form, this.elemntadd, true);
          this.form.addFCCValidators(this.elemntadd, Validators.required, 1);
          this.form.get(this.elemntadd).updateValueAndValidity();
        }
      }
    });

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
    this.form.get('presentingBankContactPerson')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] =
      this.PersonNumberEnable === 'true' ? true : false;
    this.form.get('presentingBankPhoneNumber')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] =
      this.PersonNumberEnable === 'true' ? true : false;
    this.form.get('presentingBankFullAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('presentingBankFirstAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('presentingBankSecondAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('presentingBankThirdAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('presentingBankFourthAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('presentingBankFullAddress').reset();
  }

  updateValues() {
    this.mobileRegEx = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.MOBILE_FORMAT_REGEX);
    this.mobileNoMaxLength = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.MOBILE_FORMAT_MAXLENGTH);
    this.mobileNoMinLength = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.MOBILE_FORMAT_MINLENGTH);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.PRESENTING_BANK_PHONE_NUMBER), { maxlength: this.mobileNoMaxLength });
    this.patchFieldParameters(this.form.get(FccGlobalConstant.PRESENTING_BANK_PHONE_NUMBER), { minlength: this.mobileNoMinLength });
    this.form.addFCCValidators(FccGlobalConstant.PRESENTING_BANK_PHONE_NUMBER,
      Validators.compose([Validators.maxLength(this.mobileNoMaxLength),
      Validators.minLength(this.mobileNoMinLength), Validators.pattern(this.mobileRegEx)]), 0);
  }

  onKeyupPresentingBankIcons(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      this.onClickPresentingBankIcons();
    }
  }

  onClickPresentingBankIcons() {
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
    const tnxType = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (urlOption === FccGlobalConstant.TEMPLATE) {
      const templateCreation = 'templateCreation';
      obj[templateCreation] = true;
    }
    this.resolverService.getSearchData(header, obj);
    this.presentingBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((presentingResponse) => {
      if (presentingResponse && presentingResponse !== null && presentingResponse.responseData && presentingResponse.responseData !== null){
        presentingResponse.responseData.ISO_CODE ?
          this.form.get('presentingSwiftCode').patchValue(presentingResponse.responseData.ISO_CODE) :
        this.form.get('presentingSwiftCode').patchValue(presentingResponse.responseData[4]);
        presentingResponse.responseData.NAME ? this.form.get('presentingBankName').patchValue(presentingResponse.responseData.NAME) :
        this.form.get('presentingBankName').patchValue(presentingResponse.responseData[0]);
        presentingResponse.responseData.ADDRESS_LINE_1 ? this.form.get('presentingBankFirstAddress')
        .patchValue(presentingResponse.responseData.ADDRESS_LINE_1) :
        this.form.get('presentingBankFirstAddress').patchValue(presentingResponse.responseData[1]);
        presentingResponse.responseData.ADDRESS_LINE_2 ? this.form.get('presentingBankSecondAddress')
        .patchValue(presentingResponse.responseData.ADDRESS_LINE_2) :
        this.form.get('presentingBankSecondAddress').patchValue(presentingResponse.responseData[2]);
        presentingResponse.responseData.DOM ? this.form.get('presentingBankThirdAddress').patchValue(presentingResponse.responseData.DOM) :
        this.form.get('presentingBankThirdAddress').patchValue(presentingResponse.responseData[3]);
        this.form.get('presentingBankFourthAddress').patchValue(presentingResponse.responseData.ADDRESS_LINE_4);
        this.form.get('presentingBankContactPerson').patchValue(presentingResponse.responseData.CONTACT_NAME);
        this.form.get('presentingBankPhoneNumber').patchValue(presentingResponse.responseData.PHONE);
        const val: string = this.form.get('presentingSwiftCode').value;
        const regex = new RegExp(this.swifCodeRegex);
        if(!regex.test(val)) {
          this.form.get('presentingSwiftCode').setErrors({ invalidBICError: true });
          this.form.get('presentingSwiftCode').markAsDirty();
          this.form.get('presentingSwiftCode').markAsTouched();
        }
        this.form.updateValueAndValidity();
        if (FccGlobalConstant.N002_AMEND === tnxType) {
          if (this.form.get('presentingBankName').value == null || this.form.get('presentingBankName').value === '') {
            this.addAmendLabelIcon(this.form.get('presentingSwiftCode'), this.form.controls);
          } else {
            this.addAmendLabelIcon(this.form.get('presentingSwiftCode'), this.form.controls);
            this.addAmendLabelIconDataFromPopup(this.form.get('presentingSwiftCode'), this.form.controls);
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
    if (this.presentingBankResponse !== undefined) {
      this.presentingBankResponse.unsubscribe();
      this.presentingBankResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
  }

}
