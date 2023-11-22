/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { BehaviorSubject } from 'rxjs';
import { FccGlobalConfiguration } from '../../../../../../app/common/core/fcc-global-configuration';

import { ResolverService } from '../../../../../common/services/resolver.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { EcProductComponent } from './../ec-product/ec-product.component';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { EcProductService } from '../../services/ec-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LcConstant } from '../../../lc/common/model/constant';

@Component({
  selector: 'app-ec-collecting-bank',
  templateUrl: './ec-collecting-bank.component.html',
  styleUrls: ['./ec-collecting-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EcCollectingBankComponent }]
})
export class EcCollectingBankComponent extends EcProductComponent implements OnInit {

  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  form: FCCFormGroup;
  module = '';
  swifCodeRegex: any;
  appBenAddressRegex: any;
  appBenNameLength: any;
  appBenNameRegex: any;
  collectingBankResponse;
  presentingResponse;
  configuredKeysList = 'MOBILE_FORMAT_MINLENGTH,MOBILE_FORMAT_REGEX,MOBILE_FORMAT_MAXLENGTH';
  keysNotFoundList: any[] = [];
  swiftXcharRegex: any;
  contactPerson;
  PersonNumberEnable;
  mobileRegEx: any;
  mobileNoMaxLength: any;
  mobileNoMinLength: any;
  lcConstant = new LcConstant();

  constructor(protected commonService: CommonService, protected searchLayoutService: SearchLayoutService,
              protected stateService: ProductStateService, protected translateService: TranslateService,
              protected eventEmitterService: EventEmitterService, protected resolverService: ResolverService,
              protected fccGlobalConfiguration: FccGlobalConfiguration,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected utilityService: UtilityService, protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected ecProductService: EcProductService
              ) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, ecProductService);
  }

  ngOnInit(): void {
    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
      this.form = obj as FCCFormGroup;
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swifCodeRegex = response.bigSwiftCode;
        this.swiftXcharRegex = response.swiftXCharacterSet;
        this.appBenNameRegex = response.BeneficiaryNameRegex;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.BeneficiaryNameLength;
        this.PersonNumberEnable = response.ContactPersonPhoneNumber;
        this.form.addFCCValidators('collectingBankContactPerson',
        Validators.compose([Validators.pattern(FccGlobalConstant.SPACE_REGEX)]), 0);
        this.form.addFCCValidators('collectingSwiftCode', Validators.pattern(this.swifCodeRegex), 0);
        this.form.addFCCValidators('collectingBankName', Validators.compose([Validators.maxLength(this.appBenNameLength)]), 1);
        this.form.addFCCValidators('collectingBankFirstAddress', Validators.compose([Validators.maxLength(this.appBenNameLength)]), 1);
        this.form.addFCCValidators('collectingBankSecondAddress', Validators.compose([Validators.maxLength(this.appBenNameLength)]), 1);
        this.form.addFCCValidators('collectingBankThirdAddress', Validators.compose([Validators.maxLength(this.appBenNameLength)]), 1);
        this.form.addFCCValidators('collectingBankFourthAddress',
        Validators.compose([Validators.maxLength(this.appBenNameLength)]), 1);
        this.form.addFCCValidators('collectingBankFullAddress',
        Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_1024)]), 1);
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
    this.form.get('collectingBankContactPerson')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] =
      this.PersonNumberEnable === 'true' ? true : false;
    this.form.get('collectingBankPhoneNumber')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] =
      this.PersonNumberEnable === 'true' ? true : false;
    this.form.updateValueAndValidity();
    this.form.get('collectingBankFullAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('collectingBankFirstAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('collectingBankSecondAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('collectingBankThirdAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('collectingBankFourthAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('collectingBankFullAddress').reset();
  }

  updateValues() {
    this.mobileRegEx = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.MOBILE_FORMAT_REGEX);
    this.mobileNoMaxLength = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.MOBILE_FORMAT_MAXLENGTH);
    this.mobileNoMinLength = FccGlobalConfiguration.configurationValues.get(FccGlobalConstant.MOBILE_FORMAT_MINLENGTH);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.COLLECTING_BANK_PHONE_NUMBER), { maxlength: this.mobileNoMaxLength });
    this.patchFieldParameters(this.form.get(FccGlobalConstant.COLLECTING_BANK_PHONE_NUMBER), { minlength: this.mobileNoMinLength });
    this.form.addFCCValidators(FccGlobalConstant.COLLECTING_BANK_PHONE_NUMBER,
      Validators.compose([Validators.maxLength(this.mobileNoMaxLength),
      Validators.minLength(this.mobileNoMinLength), Validators.pattern(this.mobileRegEx)]), 0);
  }

  onKeyupCollectingBankIcons(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      this.onClickCollectingBankIcons();
    }
  }

  onClickCollectingBankIcons() {
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
    this.collectingBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((collectingResponse) => {
      if (collectingResponse && collectingResponse !== null && collectingResponse.responseData && collectingResponse.responseData !== null){
        collectingResponse.responseData.ISO_CODE ?
          this.form.get('collectingSwiftCode').patchValue(collectingResponse.responseData.ISO_CODE) :
        this.form.get('collectingSwiftCode').patchValue(collectingResponse.responseData[4]);
        collectingResponse.responseData.NAME ? this.form.get('collectingBankName').patchValue(collectingResponse.responseData.NAME) :
        this.form.get('collectingBankName').patchValue(collectingResponse.responseData[0]);
        collectingResponse.responseData.ADDRESS_LINE_1 ? this.form.get('collectingBankFirstAddress')
        .patchValue(collectingResponse.responseData.ADDRESS_LINE_1) :
        this.form.get('collectingBankFirstAddress').patchValue(collectingResponse.responseData[1]);
        collectingResponse.responseData.ADDRESS_LINE_2 ? this.form.get('collectingBankSecondAddress')
        .patchValue(collectingResponse.responseData.ADDRESS_LINE_2) :
        this.form.get('collectingBankSecondAddress').patchValue(collectingResponse.responseData[2]);
        collectingResponse.responseData.DOM ? this.form.get('collectingBankThirdAddress').patchValue(collectingResponse.responseData.DOM) :
        this.form.get('collectingBankThirdAddress').patchValue(collectingResponse.responseData[3]);
        this.form.get('collectingBankFourthAddress').patchValue(collectingResponse.responseData.ADDRESS_LINE_4);
        this.form.get('collectingBankContactPerson').patchValue(collectingResponse.responseData.CONTACT_NAME);
        this.form.get('collectingBankPhoneNumber').patchValue(collectingResponse.responseData.PHONE);
        const val: string = this.form.get('collectingSwiftCode').value;
        const regex = new RegExp(this.swifCodeRegex);
        if(!regex.test(val)) {
          this.form.get('collectingSwiftCode').setErrors({ invalidBICError: true });
          this.form.get('collectingSwiftCode').markAsDirty();
          this.form.get('collectingSwiftCode').markAsTouched();
        }
        this.form.updateValueAndValidity();
        if (FccGlobalConstant.N002_AMEND === tnxType) {
          if ( this.form.get('collectingBankName').value == null || this.form.get('collectingBankName').value === '') {
            this.addAmendLabelIcon(this.form.get('collectingSwiftCode'), this.form.controls);
          } else {
            this.addAmendLabelIcon(this.form.get('collectingSwiftCode'), this.form.controls);
            this.addAmendLabelIconDataFromPopup(this.form.get('collectingSwiftCode'), this.form.controls);
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
    if (this.collectingBankResponse !== undefined) {
      this.collectingBankResponse.unsubscribe();
      this.collectingBankResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
  }

}
