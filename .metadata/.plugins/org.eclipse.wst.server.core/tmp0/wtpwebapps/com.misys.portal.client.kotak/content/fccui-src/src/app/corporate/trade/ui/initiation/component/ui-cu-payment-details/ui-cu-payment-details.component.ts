import { CodeDataService } from './../../../../../../common/services/code-data.service';
import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';

import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';

import { LcConstant } from '../../../../../../corporate/trade/lc/common/model/constant';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ui-cu-payment-details',
  templateUrl: './ui-cu-payment-details.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiCuPaymentDetailsComponent }]
})
export class UiCuPaymentDetailsComponent extends UiProductComponent implements OnInit {

  form: FCCFormGroup;
  option;
  isueBnk = this.translateService.instant('issuingBank');
  anyBnk = this.translateService.instant('anyBank');
  list: any;
  advBnk = this.translateService.instant('advisingBank');
  othBnk = this.translateService.instant('otherBank');
  cuCrAvlByCode = [];
  renderedFields: any[];
  module = ``;
  paymentDetailsAddressRegex;
  bankName: any;
  adviceThrough = this.translateService.instant('adviceThrough');
  pdApplicantName: any = 'cuPaymentDetailsBankName';
  pdApplicantFirstAddress: any = 'cuPaymentDetailsBankFirstAddress';
  pdApplicantSecondAddress: any = 'cuPaymentDetailsBankSecondAddress';
  pdApplicantThirdAddress: any = 'cuPaymentDetailsBankThirdAddress';
  pdApplicantFourthAddress: any = 'cuPaymentDetailsBankFourthAddress';
  pdBankEntity: any = 'cuPaymentDetailsBankEntity';
  payment = this.translateService.instant('payment');
  advisingBankKeyed: any;
  advisingBankSwiftKeyed: any;
  adviseThroughBankKeyed: any;
  adviseThroughBankSwiftKeyed: any;
  advisingBankEntered: any;
  nonRenderedFields: any[];
  @Input() parentForm: FCCFormGroup;
  @Input() controlName;
  mode: any;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  modeOfTransmission: any;
  productCode: any;
  subProductCode: any;
  eventDataArray: any;
  optionCUList = [];
  bnkName: string;
  bankValue: string;
  codeID: any;

  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected stateService: ProductStateService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService,
              protected codeDataService: CodeDataService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray, dialogRef,
                currencyConverterPipe, uiProductService);
}
  ngOnInit(): void {
    this.mode =
    this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    window.scroll(0, 0);
    this.initializeFormGroup();
    this.initializeVariables();
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW && this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.updateDropdownValues();
    }
    this.configureRegExForPaymentDetails();
    this.getAdvisingBnkDetails();
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW && this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.populateDataFromCopyFrom();
      this.onClickCuPaymentDetailsBankEntity();
    }
  }

  initializeVariables() {
    this.cuCrAvlByCode = [
        { value: { label:  'On Demand', shortName : this.translateService.instant('LABEL_ON_DEMAND') },
        label: this.translateService.instant('LABEL_ON_DEMAND') , code : '06' },
        { value: { label:  'Payment', shortName : this.translateService.instant('LABEL_PAYMENT') } ,
        label: this.translateService.instant('LABEL_PAYMENT'), code : '01' },
      ];
    this.optionCUList = this.getList();

  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.renderedFields = ['cuPaymentDetailsBankName', 'cuPaymentDetailsBankFirstAddress', 'cuPaymentDetailsBankSecondAddress',
    'cuPaymentDetailsBankThirdAddress', 'cuPaymentDetailsBankFourthAddress'];
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW && this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.resetFieldValidations();
      this.onClickCuPaymentDetailsBankEntity();
    }
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      if (this.form && this.form.get('cuPaymentDetailsBankFullAddress')) {
        this.form.get('cuPaymentDetailsBankFullAddress')[this.params][this.rendered] = false;
      }
      if (this.form && this.form.get('cuPaymentDetailsBankcountry')) {
        this.form.get('cuPaymentDetailsBankcountry')[this.params][this.rendered] = false;
      }
    }
   }

  getAdvisingBnkDetails() {
    // Advising bank details change
    const advisingBank = 'uiAdvisingBank';
    const bankDetails = this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired);
    this.advisingBankKeyed = bankDetails.controls[advisingBank].get('advisingBankName').value;
    this.advisingBankSwiftKeyed = bankDetails.controls[advisingBank].get('advisingswiftCode').value;
    if (this.form.get(FccGlobalConstant.CU_PAYMENT_DETAILS_BANK_NAME)) {
      this.advisingBankEntered = this.form.get(FccGlobalConstant.CU_PAYMENT_DETAILS_BANK_NAME).value;
    }
    let indexPositon = 1;
    if ((this.advisingBankSwiftKeyed !== '' && this.advisingBankSwiftKeyed !== null) ||
             (this.advisingBankKeyed !== '' && this.advisingBankKeyed !== null) ||
             (this.advisingBankEntered && this.advisingBankEntered !== null && this.advisingBankEntered !== '' &&
             this.advisingBankEntered === FccGlobalConstant.ADVISING_BANK)) {
    this.optionCUList.splice(indexPositon, FccGlobalConstant.LENGTH_0,
      { label: this.advBnk , value: '02', id: 'paymentDeatilsBankEntity_02' });
    indexPositon++;
  }
    if (this.advisingBankSwiftKeyed === null || this.advisingBankKeyed === null ||
        this.advisingBankSwiftKeyed === '' || this.advisingBankKeyed === '') {
        const index = this.optionCUList.findIndex(x => x.value.label === FccGlobalConstant.ADVISINGBANK);
        if (index > -1) {
            this.optionCUList.splice(index, 1);
        }
    }
    this.patchFieldParameters(this.form.get('cuPaymentDetailsBankEntity'), { options: this.optionCUList });
}

getList() {
  const elementId = FccGlobalConstant.CU_PAYMENT_BANK_DETAILS_ENTITY;
  let elementValue: any;
  this.productCode = FccGlobalConstant.PRODUCT_DEFAULT;
  this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
  if (this.form.get(FccGlobalConstant.CU_PAYMENT_BANK_DETAILS_ENTITY)) {
    elementValue = this.form.get(FccGlobalConstant.CU_PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
  }
  this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);

  if (this.form.get(FccGlobalConstant.CU_PAYMENT_BANK_DETAILS_ENTITY) &&
  this.form.get(FccGlobalConstant.CU_PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
      this.form.get(FccGlobalConstant.CU_PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
      this.form.get(FccGlobalConstant.CU_PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
    this.codeID = this.form.get(FccGlobalConstant.CU_PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
  }
  if (elementValue !== undefined && elementValue.length === 0) {
    this.eventDataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
    this.eventDataArray.forEach((value) => {
    if (value.value === FccGlobalConstant.ISSUING_BANK_CODE || value.value === FccGlobalConstant.ANY_BANK_CODE
      || value.value === FccGlobalConstant.OTHER_BANK_CODE) {
      this.optionCUList.push(value);
    }
   });
  }
  return this.optionCUList;
  }

  configureRegExForPaymentDetails() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.paymentDetailsAddressRegex = response.BeneficiaryAddressRegex;
      }
    });
  }

  updateDropdownValues() {
    if (this.productStateService
      .getSectionData(
        FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS,
        undefined,
        this.isMasterRequired
      )
      .get("uiCuPaymentDetails")
      .get('cuPaymentDetailsBankEntity').value !== '') {
      const paymentSection =
      this.productStateService
  .getSectionData(
    FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS,
    undefined,
    this.isMasterRequired
  )
  .get("uiCuPaymentDetails");

      const entity = paymentSection.get('cuPaymentDetailsBankEntity').value;
      const bankNameValue = this.setBankName(entity);
      const exists = this.optionCUList.filter(
        task => task.label === bankNameValue);
      if (exists.length > 0) {
        this.form.get('cuPaymentDetailsBankEntity').setValue(paymentSection.get('cuPaymentDetailsBankEntity').value);
      }
    }
  }

  setBankName(value: string): string {
    switch (value) {
      case '01':
        return this.bnkName = this.isueBnk;
      case '02':
        return this.bnkName = this.advBnk;
      case '03':
        return this.bnkName = this.anyBnk;
      case '08':
        return this.bnkName = this.adviceThrough;
      case '99':
        return this.bnkName = this.othBnk;
    }
  }

  onClickCuPaymentDetailsBankEntity() {
    const bnkVal = this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired);
    const bankDetail = bnkVal.get('uiBankNameList').value;
    if (this.form.get('cuPaymentDetailsBankEntity').value === '02') {
      this.form.get('cuPaymentDetailsBankName').setValue(this.advisingBankKeyed);
      // this.form.get('inputDraweeDetail').setValue(this.form.get('paymentDetailsBankEntity').value.shortName);
      this.bankName = this.form.get('cuPaymentDetailsBankName').value;
      this.renderedFields = [
        "cuPaymentDetailsBankName",
        "cuPaymentDetailsBankFirstAddress",
        "cuPaymentDetailsBankSecondAddress",
        "cuPaymentDetailsBankThirdAddress",
        "cuPaymentDetailsBankFourthAddress",
      ];

      this.toggleControls(this.form, this.renderedFields, false);
      this.resettingValidators('cuPaymentDetailsBankFirstAddress');
      this.resettingValidators('cuPaymentDetailsBankSecondAddress');
      this.resettingValidators('cuPaymentDetailsBankThirdAddress');
      this.resettingValidators('cuPaymentDetailsBankFourthAddress');
      if ( (this.mode[0].value !== null && this.mode[0].value !== undefined) && this.mode[0].value !== FccBusinessConstantsService.SWIFT) {
        this.toggleControls(this.form, ['cuPaymentDetailsBankFourthAddress'], true);
      }
    //  this.disableAddress();
    }
    if (this.form.get('cuPaymentDetailsBankEntity').value === FccGlobalConstant.ISSUING_BANK_CODE) {
     if (bnkVal !== undefined) {
        let bankNameVal;
        if (bankDetail !== null) {
          bankNameVal = bnkVal.get('uiBankNameList').value;
        } else {
          bankNameVal = this.isueBnk;
        }
        this.form.get('cuPaymentDetailsBankName').setValue(bankNameVal);
        } else {
        this.form.get('cuPaymentDetailsBankName').setValue('');
        }
     this.form.get('cuPaymentDetailsBankName').updateValueAndValidity();
     this.form.updateValueAndValidity();
     this.bankName = this.form.get('cuPaymentDetailsBankName').value;
     this.nonRenderedFields = ['cuPaymentDetailsBankName', 'cuPaymentDetailsBankFirstAddress', 'cuPaymentDetailsBankSecondAddress',
       'cuPaymentDetailsBankThirdAddress', 'cuPaymentDetailsBankFourthAddress'];
     this.toggleControls(this.form, this.nonRenderedFields, false);
     this.resettingValidators('cuPaymentDetailsBankFirstAddress');
     this.resettingValidators('cuPaymentDetailsBankSecondAddress');
     this.resettingValidators('cuPaymentDetailsBankThirdAddress');
     this.resettingValidators('cuPaymentDetailsBankFourthAddress');
    // this.form.controls[pdApplicantName].disable();
    }
    if (this.form.get('cuPaymentDetailsBankEntity').value === FccGlobalConstant.ANY_BANK_CODE) {
      this.form.get('cuPaymentDetailsBankName').setValue(this.anyBnk);
     // this.form.get('inputDraweeDetail').setValue(this.anyBnk);
      this.bankName = this.form.get('cuPaymentDetailsBankName').value;
      this.nonRenderedFields = ['cuPaymentDetailsBankName', 'cuPaymentDetailsBankFirstAddress' , 'cuPaymentDetailsBankSecondAddress' ,
      'cuPaymentDetailsBankThirdAddress', 'cuPaymentDetailsBankFourthAddress'];
      this.toggleControls(this.form, this.nonRenderedFields, false);
      this.resettingValidators('cuPaymentDetailsBankFirstAddress');
      this.resettingValidators('cuPaymentDetailsBankSecondAddress');
      this.resettingValidators('cuPaymentDetailsBankThirdAddress');
      this.resettingValidators('cuPaymentDetailsBankFourthAddress');
    }
    if (this.form.get('cuPaymentDetailsBankEntity').value === FccGlobalConstant.OTHER_BANK_CODE) {
     // this.form.get('cuPaymentDetailsBankName').setValue(this.othBnk);
      this.bankName = this.form.get('cuPaymentDetailsBankName').value;
      if (this.form.get('cuPaymentDetailsBankName').value === this.advisingBankKeyed ||
       this.form.get('cuPaymentDetailsBankName').value === bankDetail ||
       this.form.get('cuPaymentDetailsBankName').value === this.anyBnk ||
       this.form.get('cuPaymentDetailsBankName').value === this.isueBnk) {
         this.form.get('cuPaymentDetailsBankName').setValue('');
         this.form.get('cuPaymentDetailsBankFirstAddress').setValue('');
         this.form.get('cuPaymentDetailsBankSecondAddress').setValue('');
         this.form.get('cuPaymentDetailsBankThirdAddress').setValue('');
         this.form.get('cuPaymentDetailsBankFourthAddress').setValue('');
         this.form.updateValueAndValidity();
       }
      this.renderedFields = ['cuPaymentDetailsBankName', 'cuPaymentDetailsBankFirstAddress', 'cuPaymentDetailsBankSecondAddress',
        'cuPaymentDetailsBankThirdAddress'];
      this.toggleControls(this.form, this.renderedFields, true);

      this.modeOfTransmission =
      this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).
      get('advSendMode').value;
      if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
        this.toggleControl(this.form, this.pdApplicantFourthAddress, false);
      } else {
        this.toggleControl(this.form, this.pdApplicantFourthAddress, true);
        this.form.addFCCValidators(
          this.pdApplicantFourthAddress,
          Validators.compose([
            Validators.maxLength(FccGlobalConstant.LENGTH_35),
          ]),
          0
        );
        this.setMandatoryField(this.form, this.pdApplicantFourthAddress, true);
      }
      this.form.updateValueAndValidity();

      this.setMandatoryField(this.form, this.pdApplicantFirstAddress, true);
      this.setMandatoryField(this.form, this.pdApplicantSecondAddress, true);
      this.setMandatoryField(this.form, this.pdApplicantThirdAddress, true);
      this.setMandatoryField(this.form, this.pdApplicantName, true);

      if (this.mode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(this.pdApplicantFirstAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
        this.form.addFCCValidators(this.pdApplicantSecondAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
        this.form.addFCCValidators(this.pdApplicantThirdAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
      }
      this.form.addFCCValidators(this.pdApplicantFirstAddress,
        Validators.compose([Validators.required, Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      this.form.addFCCValidators(this.pdApplicantSecondAddress,
        Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      this.form.addFCCValidators(this.pdApplicantThirdAddress,
        Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
    } else {
      this.setValueToNull(this.renderedFields);
      this.toggleControls(this.form, this.renderedFields, false);

      this.resettingValidators(this.pdApplicantName);
      this.resettingValidators(this.pdApplicantFirstAddress);
      this.resettingValidators(this.pdApplicantSecondAddress);
      this.resettingValidators(this.pdApplicantThirdAddress);
      this.resettingValidators(this.pdApplicantFourthAddress);
      this.resettingValidators(this.pdBankEntity);
    }
  }
  resettingValidators(fieldvalue) {
    this.setMandatoryField(this.form, fieldvalue, false);
    this.form.get(fieldvalue).clearValidators();
    this.form.get(fieldvalue).updateValueAndValidity();
  }

  setValueToNull(fieldName: any[]) {
    let index: any;
    for (index = 0; index < fieldName.length; index++) {
      this.form.controls[fieldName[index]].setValue('');
    }
  }

  resetFieldValidations() {
    this.resettingValidators(this.pdBankEntity);
    this.toggleControls(this.form, this.renderedFields, false);
    if (this.form.controls[this.pdApplicantFourthAddress]
      && (this.mode[0].value !== null && this.mode[0].value !== undefined) && this.mode[0].value !== FccBusinessConstantsService.SWIFT ) {
      this.resettingValidators(this.pdApplicantFourthAddress);
    }
    this.resettingValidators(this.pdApplicantName);
    this.resettingValidators(this.pdApplicantFirstAddress);
    this.resettingValidators(this.pdApplicantSecondAddress);
    this.resettingValidators(this.pdApplicantThirdAddress);
  }

  ngOnDestroy() {
    if (this.form.get(FccGlobalConstant.CU_PAYMENT_BANK_DETAILS_ENTITY)) {
      this.form.get(FccGlobalConstant.CU_PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = [];
    }
    this.optionCUList = [];
    this.parentForm.controls[this.controlName] = this.form;
  }

  populateDataFromCopyFrom() {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    // const option = this.uiService.getOption();
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (tnxTypeCode === FccGlobalConstant.N002_NEW && mode === FccGlobalConstant.DRAFT_OPTION) {
      this.updateDropdownValues();
      if (this.form.get('cuPaymentDetailsBankEntity').value === FccGlobalConstant.OTHER_BANK_CODE) {
        this.toggleControls(this.form, this.renderedFields, true);
        if ( (this.mode[0].value !== null && this.mode[0].value !== undefined)
        && this.mode[0].value !== FccBusinessConstantsService.SWIFT) {
          this.form.controls[this.pdApplicantFourthAddress].enable();
        }
        }
      this.form.updateValueAndValidity();
      }
  }
}
