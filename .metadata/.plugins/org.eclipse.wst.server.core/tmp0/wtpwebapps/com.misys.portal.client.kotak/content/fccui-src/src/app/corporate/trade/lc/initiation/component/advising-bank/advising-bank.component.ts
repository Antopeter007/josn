import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { Dialog } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';

import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
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
import { BankDetails } from './../../../../../../common/model/bankDetails';
import { CommonService } from './../../../../../../common/services/common.service';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { LcProductService } from '../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-advising-bank',
  templateUrl: './advising-bank.component.html',
  styleUrls: ['./advising-bank.component.scss'],
  providers: [DialogService, { provide: HOST_COMPONENT, useExisting: AdvisingBankComponent }]
})
export class AdvisingBankComponent extends LcProductComponent implements OnInit, OnDestroy {

  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  @ViewChild(Dialog) public dialog;
  form: FCCFormGroup;
  module = '';
  mode;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  maxlength = this.lcConstant.maximumlength;
  swifCodeRegex: any;
  appBenAddressRegex: any;
  appBenNameLength: any;
  fullAddressLength1024 = this.lcConstant.fullAddressLength1024;
  advisingBankResponse;
  bankDetails: BankDetails;
  corporateBanks = [];
  swiftXcharRegex: any;
  fieldNames = [];
  regexType: string;
  swiftZchar;
  productCode: any;
  tnxTypeCode;
  confirmationPartyValue;

  screenMode;

  constructor(protected stateService: ProductStateService, protected emitterService: EventEmitterService,
              protected formControlService: FormControlService, protected commonService: CommonService,
              protected translateService: TranslateService, protected searchLayoutService: SearchLayoutService,
              protected corporateCommonService: CorporateCommonService, protected fccGlobalConstantService: FccGlobalConstantService,
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
    this.confirmationPartyValue = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('confirmationOptions').value;
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.stateService.
      getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value[0] ) {
      this.mode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value[0].value;
    }
    this.productCode = this.commonService.getQueryParametersFromKey (FccGlobalConstant.PRODUCT);
    this.screenMode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
      this.form = obj as FCCFormGroup;
    }
    this.fieldNames = ['advisingBankName', 'advisingBankFirstAddress',
    'advisingBankSecondAddress', 'advisingBankThirdAddress', 'advisingBankFourthAddress', 'advisingBankFullAddress'];
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swifCodeRegex = response.bigSwiftCode;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.BeneficiaryNameLength;
        this.swiftXcharRegex = response.swiftXCharacterSet;
        this.swiftZchar = response.swiftZChar;
        this.clearingFormValidators(['advisingswiftCode', 'advisingBankName', 'advisingBankFirstAddress',
          'advisingBankSecondAddress', 'advisingBankThirdAddress', 'advisingBankFourthAddress', 'advisingBankFullAddress']);
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
          if (this.form.get('advisingswiftCode').value !== null && this.form.get('advisingswiftCode').value !== undefined ) {
              this.form.addFCCValidators('advisingswiftCode', Validators.pattern(this.swifCodeRegex), 0);
          }
        }
        if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
          this.form.addFCCValidators('advisingswiftCode', Validators.pattern(this.swifCodeRegex), 0);
        }
        this.form.get('advisingBankName')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('advisingBankFirstAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('advisingBankSecondAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('advisingBankThirdAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('advisingBankFourthAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('advisingBankFullAddress')[this.params][this.maxlength] = FccGlobalConstant.LENGTH_1024;
      }
    });

    this.form.get('advisingBankFullAddress')[this.params][this.rendered] = false;
    this.form.get('advisingBankFirstAddress')[this.params][this.rendered] = true;
    this.form.get('advisingBankSecondAddress')[this.params][this.rendered] = true;
    this.form.get('advisingBankThirdAddress')[this.params][this.rendered] = true;

    if (this.mode !== FccBusinessConstantsService.SWIFT) {
        this.form.get('advisingBankFourthAddress')[this.params][this.rendered] = true;
      } else {
        this.form.get('advisingBankFourthAddress')[this.params][this.rendered] = false;
    }
    this.form.get('advisingBankFullAddress').reset();

    if (this.screenMode === FccGlobalConstant.DRAFT_OPTION){
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }

  onClickAdvisingBankIcons() {
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
    this.advisingBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((advResponse) => {

      if (advResponse && advResponse !== null && advResponse.responseData && advResponse.responseData !== null) {
        advResponse.responseData.ISO_CODE ? this.form.get('advisingswiftCode').patchValue(advResponse.responseData.ISO_CODE) :
        this.form.get('advisingswiftCode').patchValue(advResponse.responseData[4]);
        advResponse.responseData.NAME ? this.form.get('advisingBankName').patchValue(advResponse.responseData.NAME) :
        this.form.get('advisingBankName').patchValue(advResponse.responseData[0]);
        advResponse.responseData.ADDRESS_LINE_1 ? this.form.get('advisingBankFirstAddress')
        .patchValue(advResponse.responseData.ADDRESS_LINE_1) :
        this.form.get('advisingBankFirstAddress').patchValue(advResponse.responseData[1]);
        advResponse.responseData.ADDRESS_LINE_2 ? this.form.get('advisingBankSecondAddress')
        .patchValue(advResponse.responseData.ADDRESS_LINE_2) :
        this.form.get('advisingBankSecondAddress').patchValue(advResponse.responseData[2]);
        advResponse.responseData.DOM ? this.form.get('advisingBankThirdAddress').patchValue(advResponse.responseData.DOM) :
        this.form.get('advisingBankThirdAddress').patchValue(advResponse.responseData[3]);
        if (this.mode !== FccBusinessConstantsService.SWIFT && advResponse.responseData.ADDRESS_LINE_4 != null) {
          this.form.get('advisingBankFourthdAddress').patchValue(advResponse.responseData.ADDRESS_LINE_4);
        }
        const val: string = this.form.get('advisingswiftCode').value;
        const regex = new RegExp(this.swifCodeRegex);
        if(!regex.test(val)) {
          this.form.get('advisingswiftCode').setErrors({ invalidBICError: true });
          this.form.get('advisingswiftCode').markAsDirty();
          this.form.get('advisingswiftCode').markAsTouched();
        }
        this.form.updateValueAndValidity();
        if (FccGlobalConstant.N002_AMEND === tnxType) {
          if ( this.form.get('advisingBankName').value == null || this.form.get('advisingBankName').value === '') {
            this.addAmendLabelIcon(this.form.get('advisingswiftCode'), this.form.controls);
          } else {
            this.addAmendLabelIcon(this.form.get('advisingswiftCode'), this.form.controls);
            this.addAmendLabelIconDataFromPopup(this.form.get('advisingswiftCode'), this.form.controls);
          }
        }
      }
    });
  }

  ngOnDestroy() {

    this.parentForm.controls[this.controlName] = this.form;
    if (this.advisingBankResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.advisingBankResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
  }

  clearingFormValidators(fields: any){
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
    }
  }

  onFocusAdvisingBankSecondAddress() {
    const checknull = this.form.get('advisingBankFirstAddress').value;
    if (checknull === null || (checknull !== null && checknull.length === 0 ) ) {
     this.updatingValidity('advisingBankFirstAddress');
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

  onBlurAdvisingBankFirstAddress() {
    const checkvalue = this.form.get('advisingBankSecondAddress').value;
    const checkFirstnull = this.form.get('advisingBankFirstAddress').value;
    const checkThird = this.form.get('advisingBankThirdAddress').value;
    const checkFourth = this.form.get('advisingBankFourthAddress').value;
    if ((checkvalue === null && checkFirstnull === null && checkThird === null && checkFourth === null ) ||
    (checkvalue !== null && checkvalue.length === 0 && checkFirstnull === null &&
      checkThird !== null && checkThird.length === 0 && checkFourth !== null && checkFourth.length === 0 ) ) {
           this.updatingValidity('advisingBankFirstAddress');
    } else if ((checkFirstnull === null || (checkFirstnull !== null && checkFirstnull.length === 0 ))
    && ((checkThird !== null && checkThird.length !== 0) ||
    (checkFourth !== null && checkFourth.length !== 0 ) || (checkvalue !== null && checkvalue.length !== 0)) ) {
      this.updatingValidity('advisingBankFirstAddress');
    }

    if ((checkvalue === null && checkThird === null && checkFourth === null ) ||
    (checkvalue !== null && checkvalue.length === 0 &&
      checkThird !== null && checkThird.length === 0 && checkFourth !== null && checkFourth.length === 0 ) ) {
        this.updatingRegex('advisingBankFirstAddress');
      }
  }

  onBlurAdvisingBankSecondAddress() {
    const checkFirstnull = this.form.get('advisingBankFirstAddress').value;
    const checkvalue = this.form.get('advisingBankSecondAddress').value;
    const checkThird = this.form.get('advisingBankThirdAddress').value;
    const checkFourth = this.form.get('advisingBankFourthAddress').value;
    if ( (checkFirstnull === null && checkvalue === null && checkThird === null && checkFourth === null )
    || (checkvalue !== null && checkvalue.length === 0 &&
      checkFirstnull !== null && checkFirstnull.length === 0 &&
      checkThird !== null && checkThird.length === 0 &&
      checkFourth !== null && checkFourth.length === 0 ) ) {
           this.updatingRegex('advisingBankFirstAddress');
    } else if ((checkvalue === null || (checkvalue !== null && checkvalue.length === 0 ))
    && ((checkThird !== null && checkThird.length !== 0) ||
      (checkFourth !== null && checkFourth.length !== 0 )) ) {
        this.updatingValidity('advisingBankSecondAddress');
      }
  }

  onFocusAdvisingBankThirdAddress() {
    const checkFirstnull = this.form.get('advisingBankFirstAddress').value;
    const checkSecondnull = this.form.get('advisingBankSecondAddress').value;
    if (checkFirstnull === null || (checkFirstnull !== null && checkFirstnull.length === 0 )) {
      this.updatingValidity('advisingBankFirstAddress');
    }
    if (checkSecondnull === null || (checkSecondnull !== null && checkSecondnull.length === 0 )) {
      this.updatingValidity('advisingBankSecondAddress');
    }
  }

  onBlurAdvisingBankThirdAddress() {
    this.handleThirdAddressField();
  }

  handleThirdAddressField() {
    const checknull = this.form.get('advisingBankThirdAddress').value;
    const checkFirst = this.form.get('advisingBankFirstAddress').value;
    const checkSecond = this.form.get('advisingBankSecondAddress').value;
    const checkFourth = this.form.get('advisingBankFourthAddress').value;
    if ((checknull === null && checkFirst === null && checkSecond === null ) ||
    (checknull !== null && checknull.length === 0 &&
      checkFirst !== null && checkFirst.length === 0 &&
      checkSecond !== null && checkSecond.length === 0 &&
      checkFourth !== null && checkFourth.length === 0)) {
      this.updatingRegex('advisingBankFirstAddress');
      this.updatingRegex('advisingBankSecondAddress');
    } else if ((checknull === null || (checknull !== null && checknull.length === 0 ))
    && ((checkFirst !== null && checkFirst.length > 0) ||
      (checkSecond !== null && checkSecond.length > 0 ) || (checkFourth !== null && checkFourth.length > 0 )) ) {
        this.updatingValidity('advisingBankThirdAddress');
      }

    if ((checkSecond === null || (checkSecond !== null && checkSecond.length === 0 ) ) &&
      ( (checknull === null || (checknull !== null && checknull.length === 0))) && (checkFourth !== null && checkFourth.length === 0 ) ) {
        this.updatingRegex('advisingBankSecondAddress');
        this.updatingRegex('advisingBankThirdAddress');
    }
  }

  onFocusAdvisingBankFourthAddress() {
    const checkFirstnull = this.form.get('advisingBankFirstAddress').value;
    const checkSecondnull = this.form.get('advisingBankSecondAddress').value;
    const checkThirdnull = this.form.get('advisingBankThirdAddress').value;
    if (checkFirstnull === null || (checkFirstnull !== null && checkFirstnull.length === 0 )) {
      this.updatingValidity('advisingBankFirstAddress');
   }
    if (checkSecondnull === null || (checkSecondnull !== null && checkSecondnull.length === 0 )) {
      this.updatingValidity('advisingBankSecondAddress');
    }
    if (checkThirdnull === null || (checkThirdnull !== null && checkThirdnull.length === 0 )) {
      this.updatingValidity('advisingBankThirdAddress');
    }
  }

  onBlurAdvisingBankFourthAddress() {
    this.handleForthAddressField();
  }

  handleForthAddressField() {
    const checknull = this.form.get('advisingBankFourthAddress').value;
    const checkFirst = this.form.get('advisingBankFirstAddress').value;
    const checkSecond = this.form.get('advisingBankSecondAddress').value;
    const checkThird = this.form.get('advisingBankThirdAddress').value;
    if ((checknull === null && checkFirst === null && checkSecond === null && checkThird === null )
    || (checknull !== null && checknull.length === 0 &&
      checkFirst !== null && checkFirst.length === 0 && checkSecond !== null && checkSecond.length === 0 &&
      checkThird !== null && checkThird.length === 0 )) {
      this.updatingRegex('advisingBankFirstAddress');
      this.updatingRegex('advisingBankSecondAddress');
      this.updatingRegex('advisingBankThirdAddress');
    }

    if ((checkThird === null || (checkThird !== null && checkThird.length === 0 ) ) &&
    ( (checknull === null || (checknull !== null && checknull.length === 0)))) {
    this.updatingRegex('advisingBankFourthAddress');
    this.updatingRegex('advisingBankThirdAddress');
  }
    if ((checkSecond === null || (checkSecond !== null && checkSecond.length === 0 ) ) &&
  ( (checknull === null || (checknull !== null && checknull.length === 0)))) {
  this.updatingRegex('advisingBankSecondAddress');
}
  }

  onKeyupAdvisingBankIcons(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      this.onClickAdvisingBankIcons();
    }
  }
  onBlurAdvisingswiftCode() {
    const val: string = this.form.get('advisingswiftCode').value;
    const regex = new RegExp(this.swifCodeRegex);
    if(this.commonService.isnonEMptyString(val) && !regex.test(val)) {
      this.form.get('advisingswiftCode').setErrors({ invalidBICError: true });
    }
  }

  onKeyupAdvisingswiftCode() {
    this.form.get('advisingswiftCode').clearValidators();
  }

}
