import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { BehaviorSubject } from 'rxjs';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';

import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LcConstant } from '../../../../../../corporate/trade/lc/common/model/constant';
import { CorporateCommonService } from '../../../../../common/services/common.service';
import { ProductStateService } from '../../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { FormControlService } from '../../../../lc/initiation/services/form-control.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'app-ui-confirming-bank',
  templateUrl: './ui-confirming-bank.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiConfirmingBankComponent }]
})
export class UiConfirmingBankComponent extends UiProductComponent implements OnInit, OnDestroy {

  form: FCCFormGroup;
  module = '';
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
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
  confirmingBankResponse: any;
  advisingBankValue;
  adviceThroughValue;
  issuingBankalue;
  issuingBank = 'issuingBank';
  advisingBank = 'advisingBank';
  adviceThrough = 'adviceThrough';
  uiAdviceThrough = 'uiAdviceThrough';
  uiAdvisingBank = 'uiAdvisingBank';
  confirmingSwiftCode = 'confirmingSwiftCode';
  confirmingBankName = 'confirmingBankName';
  confirmingBankFirstAddress = 'confirmingBankFirstAddress';
  confirmingBankSecondAddress = 'confirmingBankSecondAddress';
  confirmingBankThirdAddress = 'confirmingBankThirdAddress';
  confirmingBankFourthAddress = 'confirmingBankFourthAddress';
  advBankConfReq = 'advBankConfReq';
  adviseThruBankConfReq = 'adviseThruBankConfReq';
  controls = 'controls';
  confirmationOption: any;
  advConf;
  advThruConf;
  maxlength = this.lcConstant.maximumlength;
  swiftXcharRegex: any;
  localAdvThroughConf: any;

  constructor(protected translateService: TranslateService,
              protected stateService: ProductStateService,
              protected emitterService: EventEmitterService,
              protected formControlService: FormControlService,
              protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected utilityService: UtilityService,
              protected commonService: CommonService,
              protected multiBankService: MultiBankService,
              protected resolverService: ResolverService,
              protected dropDownAPIservice: DropDownAPIService,
              protected searchLayoutService: SearchLayoutService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
              super(emitterService, stateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

ngOnInit(): void {
  this.mode =
  this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
  this.confirmationOption = this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined,
    this.isMasterRequired).get('bgConfInstructions').value;
  this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
  const obj = this.parentForm.controls[this.controlName];
  if (obj !== null) {
    this.form = obj as FCCFormGroup;
  }
  this.handleSwiftFields();
  const confirmingBankFields = ['confirmingBankIcons', 'confirmingSwiftCode', 'confirmingBankName',
  'confirmingBankFirstAddress', 'confirmingBankSecondAddress', 'confirmingBankThirdAddress'];
  this.renderDependentFields(confirmingBankFields);
  this.form.get(FccTradeFieldConstants.CONFIRMING_HEADER)[this.params][FccGlobalConstant.RENDERED] = true;
  this.commonService.loadDefaultConfiguration().subscribe(response => {
    if (response) {
      this.swifCodeRegex = response.bigSwiftCode;
      this.appBenAddressRegex = response.BeneficiaryAddressRegex;
      this.appBenNameLength = response.nameTradeLength;
      this.swiftXcharRegex = response.swiftXCharacterSet;
      this.clearingFormValidators(['confirmingSwiftCode', 'confirmingBankName', 'confirmingBankFirstAddress',
          'confirmingBankSecondAddress', 'confirmingBankThirdAddress', 'confirmingBankFourthAddress', 'confirmingBankFullAddress']);
      if (this.mode === FccBusinessConstantsService.SWIFT && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        this.form.addFCCValidators('confirmingSwiftCode', Validators.pattern(this.swifCodeRegex), 0);
        this.form.addFCCValidators('confirmingBankName', Validators.pattern(this.swiftXcharRegex), 0);
        this.form.addFCCValidators('confirmingBankFirstAddress', Validators.pattern(this.swiftXcharRegex), 0);
        this.form.addFCCValidators('confirmingBankSecondAddress', Validators.pattern(this.swiftXcharRegex), 0);
        this.form.addFCCValidators('confirmingBankThirdAddress', Validators.pattern(this.swiftXcharRegex), 0);
        this.form.addFCCValidators('confirmingBankFourthAddress', Validators.pattern(this.swiftXcharRegex), 0);
        this.form.addFCCValidators('confirmingBankFullAddress', Validators.pattern(this.swiftXcharRegex), 0);
      }
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        this.form.addFCCValidators('confirmingSwiftCode', Validators.pattern(this.swifCodeRegex), 0);
      }
      this.form.get('confirmingBankName')[this.params][this.maxlength] = this.appBenNameLength;
      this.form.get('confirmingBankFirstAddress')[this.params][this.maxlength] = this.appBenNameLength;
      this.form.get('confirmingBankSecondAddress')[this.params][this.maxlength] = this.appBenNameLength;
      this.form.get('confirmingBankThirdAddress')[this.params][this.maxlength] = this.appBenNameLength;
      this.form.get('confirmingBankFourthAddress')[this.params][this.maxlength] = this.appBenNameLength;
      if (this.form.get('confirmingBankFullAddress')) {
        this.form.get('confirmingBankFullAddress')[this.params][this.maxlength] = FccGlobalConstant.LENGTH_1024;
      }
    }
  });

  this.advConf =
  this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired).get('uiAdvisingBank').value;
  this.advThruConf = this.stateService
  .getSectionData(
    FccGlobalConstant.UI_BANK_DETAILS,
    undefined,
    this.isMasterRequired
  )
  .get("uiAdviceThrough").value;

  this.localAdvThroughConf = this.stateService
  .getSectionData(
    FccGlobalConstant.UI_BANK_DETAILS,
    undefined,
    this.isMasterRequired
  )
  .get("uiLocalAdviseThrough").value;

  if (this.advConf.advBankConfReq === 'Y' ) {
    this.form.get('confirmingSwiftCode').patchValue( this.advConf.advisingswiftCode);
    this.form.get('confirmingBankName').patchValue(this.advConf.advisingBankName);
    this.form.get('confirmingBankFirstAddress').patchValue(this.advConf.advisingBankFirstAddress);
    this.form.get('confirmingBankSecondAddress').patchValue(this.advConf.advisingBankSecondAddress);
    this.form.get('confirmingBankThirdAddress').patchValue(this.advConf.advisingBankThirdAddress);
    if (this.mode !== FccBusinessConstantsService.SWIFT) {
      this.form.get('confirmingBankFourthAddress').patchValue(this.advConf.advisingBankFourthdAddress);
    }
  } else if (this.advThruConf.adviseThruBankConfReq === 'Y') {

    this.form.get('confirmingSwiftCode').patchValue( this.advThruConf.advThroughswiftCode);
    this.form.get('confirmingBankName').patchValue(this.advThruConf.adviceThroughName);
    this.form.get('confirmingBankFirstAddress').patchValue(this.advThruConf.adviceThroughFirstAddress);
    this.form.get('confirmingBankSecondAddress').patchValue(this.advThruConf.adviceThroughSecondAddress);
    this.form.get('confirmingBankThirdAddress').patchValue(this.advThruConf.adviceThroughThirdAddress);
    if (this.mode !== FccBusinessConstantsService.SWIFT) {
      this.form.get('confirmingBankFourthAddress').patchValue(this.advThruConf.adviceThroughFourthdAddress);
    }
}
else if (this.localAdvThroughConf.localAdviseThroughBankConfReq === 'Y') {

  this.form.get('confirmingSwiftCode').patchValue( this.localAdvThroughConf.localAdviseThroughSwiftCode);
  this.form.get('confirmingBankName').patchValue(this.localAdvThroughConf.localAdviseThroughName);
  this.form.get('confirmingBankFirstAddress').patchValue(this.localAdvThroughConf.localAdviseThroughFirstAddress);
  this.form.get('confirmingBankSecondAddress').patchValue(this.localAdvThroughConf.localAdviseThroughSecondAddress);
  this.form.get('confirmingBankThirdAddress').patchValue(this.localAdvThroughConf.localAdviseThroughThirdAddress);
  if (this.mode !== FccBusinessConstantsService.SWIFT) {
    this.form.get('confirmingBankFourthAddress').patchValue(this.localAdvThroughConf.localAdviseThroughFourthAddress);
  }
}

}

clearingFormValidators(fields: any){
  for (let i = 0; i < fields.length; i++) {
    if (this.form.get(fields[i])) {
      this.form.get(fields[i]).clearValidators();
    }
  }
}

private renderDependentFields(displayFields?: any,
                              hideFields?: any) {
if (displayFields) {
this.toggleControls(this.form, displayFields, true);

}
if (hideFields) {
this.toggleControls(this.form, hideFields, false);

}

}
  onChangeConfirmingSwiftCode() {
    this.onChangeConfirmingBankValue();
  }

  onChangeConfirmingBankName() {
    this.onChangeConfirmingBankValue();
  }

  onChangeConfirmingBankFirstAddress() {
    this.onChangeConfirmingBankValue();
  }

  onChangeConfirmingBankSecondAddress() {
    this.onChangeConfirmingBankValue();
  }

  onChangeConfirmingBankThirdAddress() {
    this.onChangeConfirmingBankValue();
  }

  onChangeConfirmingBankFourthAddress() {
    this.onChangeConfirmingBankValue();
  }

  onChangeConfirmingBankValue() {
    const advBank =
      this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired).get(this.uiAdvisingBank);
    const advThruBank =
      this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired).get(this.uiAdviceThrough);

    if (this.isAdvBankConfirmationClicked()) {
      this.clearAdvBankConfirmationCheck(advBank);
    }
    else if (this.isAdvThruConfirmationClicked()) {
      this.clearAdvThruConfirmationCheck(advThruBank);
    }
  }

  clearAdvBankConfirmationCheck(advBank: AbstractControl) {
    if (this.commonService.isNonEmptyField(this.confirmingSwiftCode, this.form) &&
      this.form.get(this.confirmingSwiftCode).value !== this.advConf.advisingswiftCode) {
      advBank.get(this.advBankConfReq).patchValue('N');
    }
    else if (this.commonService.isNonEmptyField(this.confirmingSwiftCode, this.form) &&
      (!(this.commonService.isNonEmptyValue(this.form.get(this.confirmingSwiftCode).value)) ||
      this.form.get(this.confirmingSwiftCode).value === '') &&
      !this.isMatchingAddressLines(this.advisingBank)) {
      advBank.get(this.advBankConfReq).patchValue('N');
    }
  }

  clearAdvThruConfirmationCheck(advThruBank: AbstractControl) {
    if (this.commonService.isNonEmptyField(this.confirmingSwiftCode, this.form) &&
      this.form.get(this.confirmingSwiftCode).value !== this.advThruConf.advThroughswiftCode) {
      advThruBank.get(this.adviseThruBankConfReq).patchValue('N');
    }
    else if (this.commonService.isNonEmptyField(this.confirmingSwiftCode, this.form) &&
      (!(this.commonService.isNonEmptyValue(this.form.get(this.confirmingSwiftCode).value)) ||
      this.form.get(this.confirmingSwiftCode).value === '') &&
      !this.isMatchingAddressLines(this.adviceThrough)) {
      advThruBank.get(this.adviseThruBankConfReq).patchValue('N');
    }
  }

  isMatchingAddressLines(advOrAdvThruBank: string): boolean {
    let isMatchingAddress = false;
    const confBankName = this.form.get(this.confirmingBankName).value;
    const confBankFirstAdr = this.form.get(this.confirmingBankFirstAddress).value;
    const confBankSecondAdr = this.form.get(this.confirmingBankSecondAddress).value;
    const confBankThirdAdr = this.form.get(this.confirmingBankThirdAddress).value;
    let confbankFourthAddr;
    if (this.mode !== FccBusinessConstantsService.SWIFT) {
      confbankFourthAddr = this.form.get(this.confirmingBankFourthAddress).value;
    }

    let compareBankName;
    let compareBankFirstAddr;
    let compareBankSecondAddr;
    let compareBankThirdAddr;
    let compareBankFourthAddr;
    if (advOrAdvThruBank === this.adviceThrough) {
      compareBankName = this.advThruConf.adviceThroughName;
      compareBankFirstAddr = this.advThruConf.adviceThroughFirstAddress;
      compareBankSecondAddr = this.advThruConf.adviceThroughSecondAddress;
      compareBankThirdAddr = this.advThruConf.adviceThroughThirdAddress;
      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        compareBankFourthAddr = this.advThruConf.adviceThroughFourthdAddress;
      }
    }
    else if (advOrAdvThruBank === this.advisingBank) {
      compareBankName = this.advConf.advisingBankName;
      compareBankFirstAddr = this.advConf.advisingBankFirstAddress;
      compareBankSecondAddr = this.advConf.advisingBankSecondAddress;
      compareBankThirdAddr = this.advConf.advisingBankThirdAddress;
      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        compareBankFourthAddr = this.advConf.advisingBankFourthdAddress;
      }
    }

    if ((confBankName === compareBankName) &&
      (confBankFirstAdr === compareBankFirstAddr) &&
      (confBankSecondAdr === compareBankSecondAddr) &&
      (confBankThirdAdr === compareBankThirdAddr) &&
      (confbankFourthAddr === compareBankFourthAddr)) {
      isMatchingAddress = true;
    }
    return isMatchingAddress;
  }

  isAdvBankConfirmationClicked(): boolean {
    let isConfChecked = false;
    this.advConf =
      this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired).get('uiAdvisingBank').value;
    if (this.advConf.advBankConfReq === 'Y') {
      isConfChecked = true;
    }
    return isConfChecked;
  }


  isAdvThruConfirmationClicked(): boolean {
    let isConfChecked = false;
    this.advThruConf = this.stateService
    .getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    )
    .get("uiAdviceThrough").value;

    if (this.advThruConf.adviseThruBankConfReq === 'Y') {
      isConfChecked = true;
    }
    return isConfChecked;
  }

onClickConfirmingBankIcons() {
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
  this.confirmingBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((advResponse) => {

    if (advResponse && advResponse !== null && advResponse.responseData && advResponse.responseData !== null) {
      advResponse.responseData.ISO_CODE ? this.form.get('confirmingSwiftCode').patchValue(advResponse.responseData.ISO_CODE) :
      this.form.get('confirmingSwiftCode').patchValue(advResponse.responseData[4]);
      advResponse.responseData.NAME ? this.form.get('confirmingBankName').patchValue(advResponse.responseData.NAME) :
      this.form.get('confirmingBankName').patchValue(advResponse.responseData[0]);
      advResponse.responseData.ADDRESS_LINE_1 ? this.form.get('confirmingBankFirstAddress')
      .patchValue(advResponse.responseData.ADDRESS_LINE_1) :
      this.form.get('confirmingBankFirstAddress').patchValue(advResponse.responseData[1]);
      advResponse.responseData.ADDRESS_LINE_2 ? this.form.get('confirmingBankSecondAddress')
      .patchValue(advResponse.responseData.ADDRESS_LINE_2) :
      this.form.get('confirmingBankSecondAddress').patchValue(advResponse.responseData[2]);
      advResponse.responseData.DOM ? this.form.get('confirmingBankThirdAddress').patchValue(advResponse.responseData.DOM) :
      this.form.get('confirmingBankThirdAddress').patchValue(advResponse.responseData[3]);
      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        this.form.get('confirmingBankFourthAddress').patchValue(advResponse.responseData.ADDRESS_LINE_4);
      }
      const val: string = this.form.get('confirmingSwiftCode').value;
      const regex = new RegExp(this.swifCodeRegex);
      if(!regex.test(val)) {
        this.form.get('confirmingSwiftCode').setErrors({ invalidBICError: true });
        this.form.get('confirmingSwiftCode').markAsDirty();
        this.form.get('confirmingSwiftCode').markAsTouched();
      }
      this.form.updateValueAndValidity();
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

  if (this.mode === FccBusinessConstantsService.SWIFT || (this.mode instanceof Array && this.mode.length > 0 &&
    this.mode[0].value === FccBusinessConstantsService.SWIFT)) {
    this.form.get('confirmingBankFourthAddress')[this.params][FccGlobalConstant.RENDERED] = false;
  } else if (this.form.get('confirmingBankFourthAddress')) {
    this.form.get('confirmingBankFourthAddress')[this.params][FccGlobalConstant.RENDERED] = true;
  }
  this.form.updateValueAndValidity();
}

ngOnDestroy() {

  this.parentForm.controls[this.controlName] = this.form;
  if (this.confirmingBankResponse !== undefined) {
    this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
    this.confirmingBankResponse = null;
    this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
  }
}

}
