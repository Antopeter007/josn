import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { BehaviorSubject } from 'rxjs';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';

import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-si-advise-through-bank',
  templateUrl: './si-advise-through-bank.component.html',
  styleUrls: ['./si-advise-through-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiAdviseThroughBankComponent }]
})
export class SiAdviseThroughBankComponent extends SiProductComponent implements OnInit {

  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  form: FCCFormGroup;
  module = '';
  mode;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  swifCodeRegex: any;
  appBenAddressRegex: any;
  appBenNameLength: any;
  fullAddressLength1024 = this.lcConstant.fullAddressLength1024;
  adviseThroughBankResponse: any;
  swiftXcharRegex: any;
  maxlength = this.lcConstant.maximumlength;
  screenMode;
  confirmationPartyValue;
  tnxTypeCode;

  constructor(protected stateService: ProductStateService, protected emitterService: EventEmitterService,
              protected formControlService: FormControlService, protected commonService: CommonService,
              protected searchLayoutService: SearchLayoutService, protected translateService: TranslateService,
              protected resolverService: ResolverService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected utilityService: UtilityService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected siProductService: SiProductService
  ) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, siProductService);
  }

  ngOnInit(): void {
    this.confirmationPartyValue = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('confirmationOptions').value;
    this.mode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    this.screenMode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
      this.form = obj as FCCFormGroup;
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swifCodeRegex = response.bigSwiftCode;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.BeneficiaryNameLength;
        this.swiftXcharRegex = response.swiftXCharacterSet;
        this.clearingFormValidators(['advThroughswiftCode', 'adviceThroughName', 'adviceThroughFirstAddress',
          'adviceThroughSecondAddress', 'adviceThroughThirdAddress', 'adviceThroughFourthAddress', 'adviceThroughFullAddress']);
        if ((this.mode === FccBusinessConstantsService.SWIFT ||
            (this.mode[0] && this.mode[0].value === FccBusinessConstantsService.SWIFT))
            && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND){
          this.form.addFCCValidators('advisingswiftCode', Validators.pattern(this.swifCodeRegex), 0);
          this.form.addFCCValidators('adviceThroughName', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('adviceThroughFirstAddress', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('adviceThroughSecondAddress', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('adviceThroughThirdAddress', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('adviceThroughFourthAddress', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('adviceThroughFullAddress', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.get('advThroughswiftCode').updateValueAndValidity();
          this.form.get('adviceThroughName').updateValueAndValidity();
          this.form.get('adviceThroughFirstAddress').updateValueAndValidity();
          this.form.get('adviceThroughSecondAddress').updateValueAndValidity();
          this.form.get('adviceThroughThirdAddress').updateValueAndValidity();
          this.form.get('adviceThroughFourthAddress').updateValueAndValidity();
          this.form.get('adviceThroughFullAddress').updateValueAndValidity();
        }
        if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
          this.form.addFCCValidators('advThroughswiftCode', Validators.pattern(this.swifCodeRegex), 0);
        }
        this.form.get('adviceThroughName')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('adviceThroughFirstAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('adviceThroughSecondAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('adviceThroughThirdAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('adviceThroughFourthAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('adviceThroughFullAddress')[this.params][this.maxlength] = FccGlobalConstant.LENGTH_1024;
      }
    });

    this.form.get('adviceThroughFullAddress')[this.params][this.rendered] = false;
    this.form.get('adviceThroughFirstAddress')[this.params][this.rendered] = true;
    this.form.get('adviceThroughSecondAddress')[this.params][this.rendered] = true;
    this.form.get('adviceThroughThirdAddress')[this.params][this.rendered] = true;

    if (this.mode !== FccBusinessConstantsService.SWIFT) {
      this.form.get('adviceThroughFourthAddress')[this.params][this.rendered] = true;
    } else {
        this.form.get('adviceThroughFourthAddress')[this.params][this.rendered] = false;
        this.form.get('adviceThroughFourthAddress').reset();
    }
    this.form.get('adviceThroughFullAddress').reset();
    if (this.screenMode === FccGlobalConstant.DRAFT_OPTION){
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }

  initializeFormGroup() {
    this.form = this.formControlService.getFormControls(this.data);
  }

  clearingFormValidators(fields: any){
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
    }
  }

  onClickAdvThroughBankIcons() {
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
    this.adviseThroughBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((responseAdvThru) => {

      if (responseAdvThru && responseAdvThru !== null && responseAdvThru.responseData && responseAdvThru.responseData !== null) {
        responseAdvThru.responseData.ISO_CODE ? this.form.get('advThroughswiftCode').patchValue(responseAdvThru.responseData.ISO_CODE) :
        this.form.get('advThroughswiftCode').patchValue(responseAdvThru.responseData[4]);
        responseAdvThru.responseData.NAME ? this.form.get('adviceThroughName').patchValue(responseAdvThru.responseData.NAME) :
        this.form.get('adviceThroughName').patchValue(responseAdvThru.responseData[0]);
        responseAdvThru.responseData.ADDRESS_LINE_1 ? this.form.get('adviceThroughFirstAddress')
        .patchValue(responseAdvThru.responseData.ADDRESS_LINE_1) :
        this.form.get('adviceThroughFirstAddress').patchValue(responseAdvThru.responseData[1]);
        responseAdvThru.responseData.ADDRESS_LINE_2 ? this.form.get('adviceThroughSecondAddress')
        .patchValue(responseAdvThru.responseData.ADDRESS_LINE_2) :
        this.form.get('adviceThroughSecondAddress').patchValue(responseAdvThru.responseData[2]);
        responseAdvThru.responseData.DOM ? this.form.get('adviceThroughThirdAddress').patchValue(responseAdvThru.responseData.DOM) :
        this.form.get('adviceThroughThirdAddress').patchValue(responseAdvThru.responseData[3]);
        if (this.mode !== FccBusinessConstantsService.SWIFT && responseAdvThru.responseData.ADDRESS_LINE_4 != null) {
          this.form.get('adviceThroughFourthAddress').patchValue(responseAdvThru.responseData.ADDRESS_LINE_4);
        }
        const val: string = this.form.get('advThroughswiftCode').value;
        const regex = new RegExp(this.swifCodeRegex);
        if(!regex.test(val)) {
          this.form.get('advThroughswiftCode').setErrors({ invalidBICError: true });
          this.form.get('advThroughswiftCode').markAsDirty();
          this.form.get('advThroughswiftCode').markAsTouched();
        }
        this.form.updateValueAndValidity();
        if (FccGlobalConstant.N002_AMEND === tnxType) {
          if ( this.form.get('adviceThroughName').value == null || this.form.get('adviceThroughName').value === '') {
            this.addAmendLabelIcon(this.form.get('advThroughswiftCode'), this.form.controls);
          } else {
            this.addAmendLabelIcon(this.form.get('advThroughswiftCode'), this.form.controls);
            this.addAmendLabelIconDataFromPopup(this.form.get('advThroughswiftCode'), this.form.controls);
          }
        }
      }
    });
  }

  ngOnDestroy() {

    this.parentForm.controls[this.controlName] = this.form;
    if (this.adviseThroughBankResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.adviseThroughBankResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
  }
  onFocusAdviceThroughSecondAddress() {
    const checknull = this.form.get('adviceThroughFirstAddress').value;
    const checkvalue = this.form.get('adviceThroughSecondAddress').value;
    if ((checknull === null && checkvalue === null) || (checknull !== null && checknull.length === 0 ) ) {
     this.updatingValidity('adviceThroughFirstAddress');
    }
  }

  updatingValidity(controlName) {

    this.form.controls[controlName].markAsDirty();
    if (this.confirmationPartyValue === '01') {
    this.form.addFCCValidators(controlName, Validators.required, 1);
    this.updatingRegex(controlName);
    this.form.get(controlName).updateValueAndValidity();
   }
  }
  updatingRegex(controlName) {
    this.form.get(controlName).clearValidators();
    if (this.mode === FccBusinessConstantsService.SWIFT ||
      (this.mode[0] && this.mode[0].value === FccBusinessConstantsService.SWIFT)){
      this.form.addFCCValidators(controlName, Validators.pattern(this.swiftXcharRegex), 0);
    }
    this.form.addFCCValidators(controlName, Validators.compose([Validators.maxLength(this.appBenNameLength)]), 1);
    this.form.get(controlName).updateValueAndValidity();
  }

  onBlurAdviceThroughFirstAddress() {
    const checkvalue = this.form.get('adviceThroughSecondAddress').value;
    const checkFirstnull = this.form.get('adviceThroughFirstAddress').value;
    const checkThird = this.form.get('adviceThroughThirdAddress').value;
    const checkFourth = this.form.get('adviceThroughFourthAddress').value;
    if ((checkvalue === null && checkFirstnull === null && checkThird === null && checkFourth === null ) ||
    (checkvalue !== null && checkvalue.length === 0 && checkFirstnull === null &&
      checkThird !== null && checkThird.length === 0 && checkFourth !== null && checkFourth.length === 0 ) ) {
           this.updatingValidity('adviceThroughFirstAddress');
    } else if ((checkFirstnull === null || (checkFirstnull !== null && checkFirstnull.length === 0 ))
    && ((checkThird !== null && checkThird.length !== 0) ||
    (checkFourth !== null && checkFourth.length !== 0 ) || (checkvalue !== null && checkvalue.length !== 0)) ) {
      this.updatingValidity('adviceThroughFirstAddress');
    }

    // if ((checkvalue === null &&  checkThird === null &&  checkFourth === null ) ||
    // (checkvalue !== null && checkvalue.length === 0 &&
    //   checkThird !== null && checkThird.length === 0 && checkFourth !== null && checkFourth.length === 0   ) ) {
    //     this.updatingRegex('adviceThroughFirstAddress');
    //   }
  }

  onBlurAdviceThroughSecondAddress() {
    const checkFirstnull = this.form.get('adviceThroughFirstAddress').value;
    const checkvalue = this.form.get('adviceThroughSecondAddress').value;
    const checkThird = this.form.get('adviceThroughThirdAddress').value;
    const checkFourth = this.form.get('adviceThroughFourthAddress').value;
    if ( (checkFirstnull === null && checkvalue === null && checkThird === null && checkFourth === null )
    || (checkvalue !== null && checkvalue.length === 0 &&
      checkFirstnull !== null && checkFirstnull.length === 0 &&
      checkThird !== null && checkThird.length === 0 &&
      checkFourth !== null && checkFourth.length === 0 ) ) {
           this.updatingRegex('adviceThroughFirstAddress');
    } else if ((checkvalue === null || (checkvalue !== null && checkvalue.length === 0 ))
    && ((checkThird !== null && checkThird.length !== 0) ||
      (checkFourth !== null && checkFourth.length !== 0 )) ) {
        this.updatingValidity('adviceThroughSecondAddress');
      }
  }

  onFocusAdviceThroughThirdAddress() {
    const checkFirstnull = this.form.get('adviceThroughFirstAddress').value;
    const checkSecondnull = this.form.get('adviceThroughSecondAddress').value;
    if (checkFirstnull === null || (checkFirstnull !== null && checkFirstnull.length === 0 )) {
      this.updatingValidity('adviceThroughFirstAddress');

    }
    if (checkSecondnull === null || (checkSecondnull !== null && checkSecondnull.length === 0 )) {
      this.updatingValidity('adviceThroughSecondAddress');
    }
  }

  onBlurAdviceThroughThirdAddress() {
    this.handleThirdAddressField();
  }

  handleThirdAddressField() {
    const checknull = this.form.get('adviceThroughThirdAddress').value;
    const checkFirst = this.form.get('adviceThroughFirstAddress').value;
    const checkSecond = this.form.get('adviceThroughSecondAddress').value;
    const checkFourth = this.form.get('adviceThroughFourthAddress').value;
    if ((checknull === null && checkFirst === null && checkSecond === null ) ||
    (checknull !== null && checknull.length === 0 &&
      checkFirst !== null && checkFirst.length === 0 &&
      checkSecond !== null && checkSecond.length === 0 &&
      checkFourth !== null && checkFourth.length === 0 )) {
      this.updatingRegex('adviceThroughFirstAddress');
      this.updatingRegex('adviceThroughSecondAddress');
    } else if ((checknull === null || (checknull !== null && checknull.length === 0 ))
    && ((checkFirst !== null && checkFirst.length > 0) ||
      (checkSecond !== null && checkSecond.length > 0 ) || (checkFourth !== null && checkFourth.length > 0 )) ) {
        this.updatingValidity('adviceThroughThirdAddress');
      }

    if ((checkSecond === null || (checkSecond !== null && checkSecond.length === 0 ) ) &&
      ( (checknull === null || (checknull !== null && checknull.length === 0)) && (checkFourth !== null && checkFourth.length === 0 ) )) {
        this.updatingRegex('adviceThroughSecondAddress');
        this.updatingRegex('adviceThroughThirdAddress');
    }
  }

  onFocusAdviceThroughFourthAddress() {
    const checkFirstnull = this.form.get('adviceThroughFirstAddress').value;
    const checkSecondnull = this.form.get('adviceThroughSecondAddress').value;
    const checkThirdnull = this.form.get('adviceThroughThirdAddress').value;
    if (checkFirstnull === null || (checkFirstnull !== null && checkFirstnull.length === 0 )) {
      this.updatingValidity('adviceThroughFirstAddress');
   }
    if (checkSecondnull === null || (checkSecondnull !== null && checkSecondnull.length === 0 )) {
      this.updatingValidity('adviceThroughSecondAddress');
    }
    if (checkThirdnull === null || (checkThirdnull !== null && checkThirdnull.length === 0 )) {
      this.updatingValidity('adviceThroughThirdAddress');
    }
  }

  onBlurAdviceThroughFourthAddress() {
    this.handleForthAddressField();
  }

  handleForthAddressField() {
    const checknull = this.form.get('adviceThroughFourthAddress').value;
    const checkFirst = this.form.get('adviceThroughFirstAddress').value;
    const checkSecond = this.form.get('adviceThroughSecondAddress').value;
    const checkThird = this.form.get('adviceThroughThirdAddress').value;
    if ((checknull === null && checkFirst === null && checkSecond === null && checkThird === null )
    || (checknull !== null && checknull.length === 0 &&
      checkFirst !== null && checkFirst.length === 0 && checkSecond !== null && checkSecond.length === 0 &&
      checkThird !== null && checkThird.length === 0 )) {
      this.updatingRegex('adviceThroughFirstAddress');
      this.updatingRegex('adviceThroughSecondAddress');
      this.updatingRegex('adviceThroughThirdAddress');
    }

    if ((checkThird === null || (checkThird !== null && checkThird.length === 0 ) ) &&
    (checknull === null || (checknull !== null && checknull.length === 0))) {
    this.updatingRegex('adviceThroughFourthAddress');
    this.updatingRegex('adviceThroughThirdAddress');
  }
    if ((checkSecond === null || (checkSecond !== null && checkSecond.length === 0 ) ) &&
  ( checknull === null || (checknull !== null && checknull.length === 0))) {
  this.updatingRegex('adviceThroughSecondAddress');
}
    if ((checkFirst === null || (checkFirst !== null && checkFirst.length === 0 ) ) &&
( checknull === null || (checknull !== null && checknull.length === 0))) {
this.updatingRegex('adviceThroughSecondAddress');
}
  }

  onKeyupAdvThroughBankIcons(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      this.onClickAdvThroughBankIcons();
    }
  }
}

