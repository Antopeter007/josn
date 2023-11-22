import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { BehaviorSubject } from 'rxjs';

import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LcConstant } from '../../../common/model/constant';
import { ProductStateService } from '../../../common/services/product-state.service';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { FormControlService } from '../../services/form-control.service';
import { UtilityService } from '../../services/utility.service';
import { LcProductComponent } from '../lc-product/lc-product.component';
import { CommonService } from './../../../../../../common/services/common.service';
import { LcProductService } from '../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
@Component({
  selector: 'app-confirmation-party',
  templateUrl: './confirmation-party.component.html',
  styleUrls: ['./confirmation-party.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ConfirmationPartyComponent }]
})
export class ConfirmationPartyComponent extends LcProductComponent implements OnInit {

  module = '';
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  form: FCCFormGroup;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  options = this.lcConstant.options;
  selectarr: any[] = [];
  valueArray = [];
  mode;
  swifCodeRegex: any;
  appBenAddressRegex: any;
  appBenNameLength: any;
  fullAddressLength1024 = this.lcConstant.fullAddressLength1024;
  confirmationBankOtherResponse: any;
  advisingBankValue;
  adviceThroughValue;
  issuingBankalue;
  issuingBank = 'issuingBank';
  advisingBank = 'advisingBank';
  adviceThrough = 'adviceThrough';
  controls = 'controls';
  confirmationOption: any;
  tnxType;
  maxlength = this.lcConstant.maximumlength;
  swiftXcharRegex: any;
  fieldNames = [];
  regexType: string;
  swiftZchar;
  productCode: any;
  tnxTypeCode;

  constructor(protected stateService: ProductStateService, protected emitterService: EventEmitterService,
              protected formControlService: FormControlService, protected translateService: TranslateService,
              protected commonService: CommonService, protected searchLayoutService: SearchLayoutService,
              protected resolverService: ResolverService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected utilityService: UtilityService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected lcProductService: LcProductService
    ) {
    super(emitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
  }

  ngOnInit(): void {
    this.mode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.stateService.
      getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value[0]) {
      this.mode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value[0].value;
    }
    this.productCode = this.commonService.getQueryParametersFromKey (FccGlobalConstant.PRODUCT);
    this.confirmationOption = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('confirmationOptions').value;
    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
      this.form = obj as FCCFormGroup;
    }
    this.tnxType = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.confirmationOption !== FccBusinessConstantsService.WITHOUT_03) {
      this.setMandatoryFields(this.form, ['counterPartyList'], true);
    }
    this.setCnfirmtionDropDownData();
    this.onClickCounterPartyList();
    this.fieldNames = ['confirmationBankName', 'confirmationFirstAddress',
    'confirmationSecondAddress', 'confirmationThirdAddress', 'confirmationFourthAddress', 'confirmationFullAddress'];
  }

  clearingFormValidators(fields: any){
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
    }
  }

  setCnfirmtionDropDownData() {
    this.form.get('counterPartyList')[this.params][this.options] = this.addConfirmationPartArray('Other');
    const obj = this.parentForm;

    if (obj.contains('advisingBank')) {
      this.advisingBankValue = obj.controls[this.advisingBank][this.controls].advisingswiftCode.value;
      if (this.advisingBankValue !== null && this.advisingBankValue !== '') {
        this.form.get('counterPartyList')[this.params][this.options] = this.addConfirmationPartArray(FccGlobalConstant.ADVISING_BANK);
      }
    }
    if (obj.contains('adviceThrough')) {
      this.adviceThroughValue = obj.controls[this.adviceThrough][this.controls].advThroughswiftCode.value;
      if (this.adviceThroughValue !== null && this.adviceThroughValue !== '') {
        this.form.get('counterPartyList')[this.params][this.options] = this.addConfirmationPartArray(FccGlobalConstant.ADVISING_THROUGH);
      }
    }
  }

  addConfirmationPartArray(dropDownType): any[] {
    if (dropDownType === 'Other') {
      if (this.selectarr.length === 0) {
        this.selectarr.push({ label: `${this.translateService.instant('otherBank')}`, value: 'Other' });
      } else {
        for (let i = 0; i < this.selectarr.length; i++) {
          this.valueArray.push(this.selectarr[i].value);
          if (this.valueArray.indexOf(dropDownType) === -1) {
            this.selectarr.push({ label: `${this.translateService.instant('otherBank')}`, value: 'Other' });
          }
        }
      }
    }

    if (dropDownType === FccGlobalConstant.ADVISING_BANK) {
      this.valueArrayPush();
      if (this.valueArray.indexOf(dropDownType) === -1) {
        this.selectarr.push({ label: `${this.translateService.instant('advisingBank')}`, value: FccGlobalConstant.ADVISING_BANK });
      }
    }

    if (dropDownType === FccGlobalConstant.ADVISING_THROUGH) {
      this.valueArrayPush();
      if (this.valueArray.indexOf(dropDownType) === -1) {
        this.selectarr.push({ label: `${this.translateService.instant('adviceThrough')}`, value: FccGlobalConstant.ADVISING_THROUGH });
      }
    }

    if (dropDownType === FccGlobalConstant.ISSUING_BANK) {
      this.valueArrayPush();
      if (this.valueArray.indexOf(dropDownType) === -1) {
        this.selectarr.push({ label: `${this.translateService.instant('issuingBank')}`, value: FccGlobalConstant.ISSUING_BANK });
      }
    }
    return this.selectarr;
  }

  valueArrayPush() {
    for (let i = 0; i < this.selectarr.length; i++) {
      this.valueArray.push(this.selectarr[i].value);
    }
  }

  onClickCounterPartyList() {
    const getValue = this.form.get('counterPartyList').value;
    const confirmationBankAddrFields = ['confirmationFirstAddress', 'confirmationSecondAddress', 'confirmationThirdAddress'];
    if (getValue !== undefined && getValue === 'Other') {
      this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response) {
          this.swifCodeRegex = response.bigSwiftCode;
          this.appBenAddressRegex = response.BeneficiaryAddressRegex;
          this.appBenNameLength = response.BeneficiaryNameLength;
          this.swiftXcharRegex = response.swiftXCharacterSet;
          this.swiftZchar = response.swiftZChar;
          this.clearingFormValidators(['confirmationPartySwiftCode', 'confirmationBankName', 'confirmationFirstAddress',
          'confirmationSecondAddress', 'confirmationThirdAddress', 'confirmationFourthAddress', 'confirmationFullAddress']);
          if (this.mode === FccBusinessConstantsService.SWIFT) {
            if (this.form.get('confirmationPartySwiftCode').value !== null && this.form.
            get('confirmationPartySwiftCode').value !== undefined ) {
            this.form.addFCCValidators('confirmationPartySwiftCode', Validators.pattern(this.swifCodeRegex), 0);
            }
            this.fieldNames.forEach(ele => {
              this.form.get(ele).clearValidators();
              this.regexType = this.form.get(ele)[FccGlobalConstant.PARAMS]['applicableValidation'][0]['characterValidation'];
              if (this.regexType === FccGlobalConstant.SWIFT_X) {
                this.regexType = this.swiftXcharRegex;
              } else if (this.regexType === FccGlobalConstant.SWIFT_Z) {
                this.regexType = this.swiftZchar;
              }
              if (this.commonService.validateProduct(this.form, ele, this.productCode)) {
                this.form.addFCCValidators(ele, Validators.pattern(this.regexType), 0);
                }
            });
          }
          this.form.addFCCValidators('confirmationPartySwiftCode', Validators.pattern(this.swifCodeRegex), 0);
          this.form.get('confirmationBankName')[this.params][this.maxlength] = this.appBenNameLength;
          this.form.get('confirmationFirstAddress')[this.params][this.maxlength] = this.appBenNameLength;
          this.form.get('confirmationSecondAddress')[this.params][this.maxlength] = this.appBenNameLength;
          this.form.get('confirmationThirdAddress')[this.params][this.maxlength] = this.appBenNameLength;
          this.form.get('confirmationFourthAddress')[this.params][this.maxlength] = this.appBenNameLength;
          this.form.get('confirmationFullAddress')[this.params][this.maxlength] = FccGlobalConstant.LENGTH_1024;
        }
      });
      this.form.get('otherBankDetailsHeader')[this.params][this.rendered] = true;
      this.form.get('confirmationPartySwiftCode')[this.params][this.rendered] = true;
      this.form.get('confirmationBankName')[this.params][this.rendered] = true;
      this.form.get('confirmationFirstAddress')[this.params][this.rendered] = true;
      this.form.get('confirmationSecondAddress')[this.params][this.rendered] = true;
      this.form.get('confirmationThirdAddress')[this.params][this.rendered] = true;
      this.togglePreviewScreen(this.form, confirmationBankAddrFields, true);
      this.setMandatoryField(this.form, FccGlobalConstant.CONFIRMATION_BANK_NAME, true);
      this.setMandatoryField(this.form, FccGlobalConstant.CONFIRMATION_BANK_FIRST_ADDRESS, true);

      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        this.form.get('confirmationFourthAddress')[this.params][this.rendered] = true;
        this.togglePreviewScreen(this.form, ['confirmationFourthAddress'], true);
      } else {
        this.form.get('confirmationFourthAddress')[this.params][this.rendered] = false;
        this.togglePreviewScreen(this.form, ['confirmationFourthAddress'], false);
        this.form.get('confirmationFourthAddress').reset();
      }
      this.form.get('confirmationFullAddress')[this.params][this.rendered] = false;
      this.form.get('confirmationBankIcons')[this.params][this.rendered] = true;
      this.form.get('confirmationFullAddress').reset();
      if (FccGlobalConstant.N002_AMEND === this.tnxType) {
      this.addAmendLabelIcon(this.form.get('confirmationPartySwiftCode'), this.form.controls);
      this.addAmendLabelIcon(this.form.get('confirmationBankName'), this.form.controls);
      this.addAmendLabelIcon(this.form.get('confirmationFirstAddress'), this.form.controls);
      this.addAmendLabelIcon(this.form.get('confirmationSecondAddress'), this.form.controls);
      this.addAmendLabelIcon(this.form.get('confirmationThirdAddress'), this.form.controls);
      this.addAmendLabelIcon(this.form.get('confirmationFourthAddress'), this.form.controls);
      }
    }else {
      this.form.get('otherBankDetailsHeader')[this.params][this.rendered] = false;
      this.form.get('confirmationPartySwiftCode')[this.params][this.rendered] = false;
      this.form.get('confirmationBankName')[this.params][this.rendered] = false;
      this.form.get('confirmationFirstAddress')[this.params][this.rendered] = false;
      this.form.get('confirmationSecondAddress')[this.params][this.rendered] = false;
      this.form.get('confirmationThirdAddress')[this.params][this.rendered] = false;
      this.form.get('confirmationFourthAddress')[this.params][this.rendered] = false;
      this.form.get('confirmationFullAddress')[this.params][this.rendered] = false;
      this.togglePreviewScreen(this.form, confirmationBankAddrFields, false);
      this.togglePreviewScreen(this.form, ['confirmationFourthAddress'], false);
      this.form.get('confirmationFirstAddress').reset();
      this.form.get('confirmationSecondAddress').reset();
      this.form.get('confirmationThirdAddress').reset();
      this.form.get('confirmationFourthAddress').reset();
      this.form.get('confirmationBankName').reset();
      this.form.get('confirmationPartySwiftCode').reset();

      // For Icon Display
      this.form.get('confirmationBankIcons')[this.params][this.rendered] = false;
      this.removeAmendIcon(this.form.get('confirmationPartySwiftCode'), this.form.controls);
      this.removeAmendIcon(this.form.get('confirmationBankName'), this.form.controls);

      this.form.get(FccGlobalConstant.CONFIRMATION_BANK_NAME).clearValidators();
      this.form.get(FccGlobalConstant.CONFIRMATION_BANK_FIRST_ADDRESS).clearValidators();
      this.form.get(FccGlobalConstant.CONFIRMATION_BANK_NAME).updateValueAndValidity();
      this.form.get(FccGlobalConstant.CONFIRMATION_BANK_FIRST_ADDRESS).updateValueAndValidity();
    }

  }

  onClickConfirmationBankIcons() {
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
    this.confirmationBankOtherResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((confResponse) => {
      if (confResponse && confResponse !== null && confResponse.responseData && confResponse.responseData !== null) {
        confResponse.responseData.ISO_CODE ? this.form.get('confirmationPartySwiftCode').patchValue(confResponse.responseData.ISO_CODE) :
        this.form.get('confirmationPartySwiftCode').patchValue(confResponse.responseData[4]);
        confResponse.responseData.NAME ? this.form.get('confirmationBankName').patchValue(confResponse.responseData.NAME) :
        this.form.get('confirmationBankName').patchValue(confResponse.responseData[0]);
        confResponse.responseData.ADDRESS_LINE_1 ? this.form.get('confirmationFirstAddress')
        .patchValue(confResponse.responseData.ADDRESS_LINE_1) :
        this.form.get('confirmationFirstAddress').patchValue(confResponse.responseData[1]);
        confResponse.responseData.ADDRESS_LINE_2 ? this.form.get('confirmationSecondAddress')
        .patchValue(confResponse.responseData.ADDRESS_LINE_2) :
        this.form.get('confirmationSecondAddress').patchValue(confResponse.responseData[2]);
        confResponse.responseData.DOM ? this.form.get('confirmationThirdAddress').patchValue(confResponse.responseData.DOM) :
        this.form.get('confirmationThirdAddress').patchValue(confResponse.responseData[3]);
        if (this.mode !== FccBusinessConstantsService.SWIFT) {
          this.form.get('confirmationFourthAddress').patchValue(confResponse.responseData.ADDRESS_LINE_4);
        }
        const val: string = this.form.get('confirmationPartySwiftCode').value;
        const regex = new RegExp(this.swifCodeRegex);
        if(!regex.test(val)) {
          this.form.get('confirmationPartySwiftCode').setErrors({ invalidBICError: true });
          this.form.get('confirmationPartySwiftCode').markAsDirty();
          this.form.get('confirmationPartySwiftCode').markAsTouched();
        }
        this.form.updateValueAndValidity();
        if (FccGlobalConstant.N002_AMEND === this.tnxType) {
          if ( this.form.get('confirmationBankName').value == null || this.form.get('confirmationBankName').value === '') {
            this.addAmendLabelIcon(this.form.get('confirmationPartySwiftCode'), this.form.controls);
          } else {
            this.addAmendLabelIcon(this.form.get('confirmationPartySwiftCode'), this.form.controls);
            this.addAmendLabelIcon(this.form.get('confirmationBankName'), this.form.controls);
            this.addAmendLabelIconDataFromPopup(this.form.get('confirmationPartySwiftCode'), this.form.controls);
          }
        }
        this.addAmendLabelIcon(this.form.get('confirmationPartySwiftCode'), this.form.controls);
        this.addAmendLabelIcon(this.form.get('confirmationBankName'), this.form.controls);
      }
    });
  }

  ngOnDestroy() {

    this.parentForm.controls[this.controlName] = this.form;
    if (this.confirmationBankOtherResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.confirmationBankOtherResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
  }

  onKeyupConfirmationBankIcons(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      this.onClickConfirmationBankIcons();
    }
  }
  onBlurConfirmationPartySwiftCode() {
    const val: string = this.form.get('confirmationPartySwiftCode').value;
    const regex = new RegExp(this.swifCodeRegex);
    if(!regex.test(val)) {
      this.form.get('confirmationPartySwiftCode').setErrors({ invalidBICError: true });
    }
  }

  onKeyupConfirmationPartySwiftCode() {
    this.form.get('confirmationPartySwiftCode').clearValidators();
  }
}
