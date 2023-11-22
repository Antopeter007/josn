import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { BehaviorSubject } from 'rxjs';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LcConstant } from '../../../common/model/constant';
import { ProductStateService } from '../../../common/services/product-state.service';
import { LcProductService } from '../../../services/lc-product.service';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { FormControlService } from '../../services/form-control.service';
import { UtilityService } from '../../services/utility.service';
import { LcProductComponent } from '../lc-product/lc-product.component';
import { CommonService } from './../../../../../../common/services/common.service';

@Component({
  selector: 'app-advise-through-bank',
  templateUrl: './advise-through-bank.component.html',
  styleUrls: ['./advise-through-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: AdviseThroughBankComponent }]
})
export class AdviseThroughBankComponent extends LcProductComponent implements OnInit {

  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  form: FCCFormGroup;
  module = '';
  mode;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  maxlength = this.lcConstant.maximumlength;
  rendered = this.lcConstant.rendered;
  swifCodeRegex: any;
  appBenAddressRegex: any;
  appBenNameLength: any;
  fullAddressLength1024 = this.lcConstant.fullAddressLength1024;
  adviseThroughBankResponse: any;
  swiftXcharRegex: any;
  fieldNames = [];
  regexType: string;
  swiftZchar;
  productCode: any;
  tnxTypeCode;
  screenMode;
  confirmationPartyValue;

  constructor(protected stateService: ProductStateService, protected emitterService: EventEmitterService,
              protected formControlService: FormControlService, protected commonService: CommonService,
              protected searchLayoutService: SearchLayoutService, protected translateService: TranslateService,
              protected resolverService: ResolverService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected utilityService: UtilityService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected lcProductService: LcProductService) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
          customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileList,
          dialogRef, currencyConverterPipe, lcProductService);
  }

  ngOnInit(): void {
    this.mode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.confirmationPartyValue = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('confirmationOptions').value;
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.stateService.
      getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value[0]) {
      this.mode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value[0].value;
    }
    this.productCode = this.commonService.getQueryParametersFromKey (FccGlobalConstant.PRODUCT);
    this.screenMode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
      this.form = obj as FCCFormGroup;
    }
    this.fieldNames = ['adviceThroughName', 'adviceThroughFirstAddress',
    'adviceThroughSecondAddress', 'adviceThroughThirdAddress', 'adviceThroughFourthAddress', 'adviceThroughFullAddress'];
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swifCodeRegex = response.bigSwiftCode;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.BeneficiaryNameLength;
        this.swiftXcharRegex = response.swiftXCharacterSet;
        this.swiftZchar = response.swiftZChar;
        this.clearingFormValidators(['advThroughswiftCode', 'adviceThroughName', 'adviceThroughFirstAddress',
          'adviceThroughSecondAddress', 'adviceThroughThirdAddress', 'adviceThroughFourthAddress', 'adviceThroughFullAddress']);
        if ((this.mode === FccBusinessConstantsService.SWIFT ||
          (this.mode[0] && this.mode[0].value === FccBusinessConstantsService.SWIFT))
          && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
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
          if (this.form.get('advThroughswiftCode').value !== null && this.form.get('advThroughswiftCode').value !== undefined ) {
          this.form.addFCCValidators('advThroughswiftCode', Validators.pattern(this.swifCodeRegex), 0);
          }
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
    if (checknull === null || (checknull !== null && checknull.length === 0 ) ) {
     this.updatingValidity('adviceThroughFirstAddress');
    }
  }

  updatingValidity(controlName) {

    this.form.controls[controlName].markAsDirty();
    if (this.confirmationPartyValue === '01') {
      this.form.addFCCValidators(controlName, Validators.required, 1);
     }
    this.form.get(controlName).updateValueAndValidity();

  }

  updatingRegex(controlName) {
    this.form.get(controlName).clearValidators();
    if (this.mode === FccBusinessConstantsService.SWIFT ||
      (this.mode[0] && this.mode[0].value === FccBusinessConstantsService.SWIFT)){
      this.form.addFCCValidators(controlName, Validators.pattern(this.swiftXcharRegex), 0);
    }
    this.form.get(controlName)[this.params][this.maxlength] = this.appBenNameLength;
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

    if ((checkvalue === null && checkThird === null && checkFourth === null ) ||
    (checkvalue !== null && checkvalue.length === 0 &&
      checkThird !== null && checkThird.length === 0 && checkFourth !== null && checkFourth.length === 0 ) ) {
        this.updatingRegex('adviceThroughFirstAddress');
      }
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
    ( (checknull === null || (checknull !== null && checknull.length === 0)))) {
    this.updatingRegex('adviceThroughFourthAddress');
    this.updatingRegex('adviceThroughThirdAddress');
  }
    if ((checkSecond === null || (checkSecond !== null && checkSecond.length === 0 ) ) &&
  ( (checknull === null || (checknull !== null && checknull.length === 0)))) {
  this.updatingRegex('adviceThroughSecondAddress');
}
    if ((checkFirst === null || (checkFirst !== null && checkFirst.length === 0 ) ) &&
( (checknull === null || (checknull !== null && checknull.length === 0)))) {
this.updatingRegex('adviceThroughSecondAddress');
}
  }

  onKeyupAdvThroughBankIcons(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      this.onClickAdvThroughBankIcons();
    }
  }
  onBlurAdvThroughswiftCode() {
    const val: string = this.form.get('advThroughswiftCode').value;
    const regex = new RegExp(this.swifCodeRegex);
    if(this.commonService.isnonEMptyString(val) && !regex.test(val)) {
      this.form.get('advThroughswiftCode').setErrors({ invalidBICError: true });
    }
  }

  onKeyupAdvThroughswiftCode() {
    this.form.get('advThroughswiftCode').clearValidators();
  }
}
