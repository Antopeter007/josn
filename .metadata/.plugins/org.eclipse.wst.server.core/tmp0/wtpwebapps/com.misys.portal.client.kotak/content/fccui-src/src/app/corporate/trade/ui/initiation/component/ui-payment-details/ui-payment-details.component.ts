import { CodeData } from './../../../../../../common/model/codeData';
import { CodeDataService } from './../../../../../../common/services/code-data.service';
import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
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
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { UiService } from './../../../common/services/ui-service';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';

@Component({
  selector: 'app-ui-payment-details',
  templateUrl: './ui-payment-details.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiPaymentDetailsComponent }]
})
export class UiPaymentDetailsComponent extends UiProductComponent implements OnInit {

  module = ``;
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  mode: any;
  option;
  isueBnk = this.translateService.instant('issuingBank');
  anyBnk = this.translateService.instant('anyBank');
  list: any;
  inputDays = [];
  bgCrAvlByCode = [];
  formSubmitted = false;
  subheader = '';
  contextPath: any;
  paymentDetailsNameRegex;
  paymentDetailsAddressRegex;
  paymentDetailsNameLength;
  bankList: any;
  creditAvailableWith = 'paymentDetailscreditAvailWith';
  creditAvailBy = 'paymentDetailscreditAvailBy';
  paymentDraftAt = 'paymentDetailspaymentDraftAt';
  draweeDetails = 'paymentDetailsdrawDetails';
  progressivebar: number;
  draweeList: any;
  bankName: any;
  renderedFields: any[];
  nonRenderedFields: any[];
  blankFields: any[];
  unCheckedFields: any[];
  advBnk = this.translateService.instant('advisingBank');
  othBnk = this.translateService.instant('otherBank');
  adviceThrough = this.translateService.instant('adviceThrough');
  confBnk = this.translateService.instant('confirmingBank');
  pdApplicantName: any = 'paymentDetailsBankName';
  pdApplicantFirstAddress: any = 'paymentDetailsBankFirstAddress';
  pdApplicantSecondAddress: any = 'paymentDetailsBankSecondAddress';
  pdApplicantThirdAddress: any = 'paymentDetailsBankThirdAddress';
  pdApplicantFourthAddress: any = 'paymentDetailsBankFourthAddress';
  pdBankEntity: any = 'paymentDetailsBankEntity';
  confirm = true;
  prev = 'prev';
  next = 'next';
  selectList: any;
  params;
  checkIcons = 'fa fa-check-circle fa-2x';
  icon: any = 'icon';
  layoutFixClass: any = 'p-col-6 p-md-6 p-lg-6 p-sm-12';
  inputDraweeDetail: any;
  mandatoryFields: any[];
  payment = this.translateService.instant('payment');
  acceptance = this.translateService.instant('acceptance');
  negotiation = this.translateService.instant('negotiation');
  defPayment = this.translateService.instant('deferredPayment');
  mixPayment = this.translateService.instant('mixedPayment');
  advisingBankKeyed: any;
  advisingBankSwiftKeyed: any;
  adviseThroughBankKeyed: any;
  adviseThroughBankSwiftKeyed: any;
  confirmingBankSwiftKeyed: any;
  confirmingBankKeyed: any;
  inputDraweeDetails: any;
  rendered;
  tnxTypeCode: any;
  warning = 'warning';
  advisingBankEntered: any;
  paymentAmendwarningmessage = 'paymentAmendwarningmessage';
  modeOfTransmission: any;
  masterInputTextAreaMixPayment: any;
  productCode: any;
  subProductCode: any;
  eventDataArray: any;
  optionList = [];
  bnkName: string;
  bankValue: string;
  codeID: any;
  swiftXChar: any;
  lcConstant = new LcConstant();
  advisingBankResponse: any;
  previewScreen: boolean;

  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected stateService: ProductStateService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected uiService: UiService, protected currencyConverterPipe: CurrencyConverterPipe,
              protected uiProductService: UiProductService, protected codeDataService: CodeDataService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired)
                  .get('advSendMode').value;
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    window.scroll(0, 0);
    this.initializeVariables();
    this.initializeFormGroup();
    if (this.form && this.form[FccGlobalConstant.RENDERED]) {
    this.renderedFields = ['paymentDetailsBankFirstAddress', 'paymentDetailsBankSecondAddress',
    'paymentDetailsBankThirdAddress', 'paymentDetailsBankFourthAddress'];
    this.resetFieldValidations();
    this.updateDropdownValues();
    this.configureRegExForPaymentDetails();
    this.populateDataFromCopyFrom();
    this.onClickPaymentDetailsBankEntity();
    this.hidePaymentFullAddressForAmend();
  }
}

  initializeVariables() {
    this.bgCrAvlByCode = [
        { value: { label:  'On Demand', shortName : this.translateService.instant('LABEL_ON_DEMAND') },
        label: this.translateService.instant('LABEL_ON_DEMAND') , code : '06' },
        { value: { label:  'Payment', shortName : this.translateService.instant('LABEL_PAYMENT') } ,
        label: this.translateService.instant('LABEL_PAYMENT'), code : '01' },
      ];
    this.optionList = [];
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.getList();
    this.form.updateValueAndValidity();
  }

  configureRegExForPaymentDetails() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.paymentDetailsNameRegex = response.PaymentDetailsNameRegex;
        this.paymentDetailsAddressRegex = response.BeneficiaryAddressRegex;
        this.paymentDetailsNameLength = response.PaymentDetailsNameLength;
        this.swiftXChar = response.swiftXCharacterSet;
      }
    });
  }
  getAdvisingBnkDetails() {
  // Advising bank details change
  const bankDetails = this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired);
  const advisingBank = 'uiAdvisingBank';
  const adviseThrough = 'uiAdviceThrough';
  const confirmingBank = 'uiConfirmingBank';
  this.confirmingBankKeyed = bankDetails.controls[confirmingBank].get('confirmingBankName').value;
  this.confirmingBankSwiftKeyed = bankDetails.controls[confirmingBank].get('confirmingSwiftCode').value;
  this.advisingBankKeyed = bankDetails.controls[advisingBank].get('advisingBankName').value;
  this.advisingBankSwiftKeyed = bankDetails.controls[advisingBank].get('advisingswiftCode').value;
  this.adviseThroughBankKeyed = bankDetails.controls[adviseThrough].get('adviceThroughName').value;
  this.adviseThroughBankSwiftKeyed = bankDetails.controls[adviseThrough].get('advThroughswiftCode').value;
  this.advisingBankEntered = this.form.get(FccGlobalConstant.PAYMENT_DETAILS_BANK_NAME).value;
  let indexPositon = 1;
  if ((this.advisingBankSwiftKeyed !== '' && this.advisingBankSwiftKeyed !== null) ||
           (this.advisingBankKeyed !== '' && this.advisingBankKeyed !== null) ||
           (this.advisingBankEntered !== null && this.advisingBankEntered !== '' &&
           this.advisingBankEntered === FccGlobalConstant.ADVISING_BANK)) {
  this.optionList.splice(indexPositon, FccGlobalConstant.LENGTH_0,
    { label: this.advBnk , value: '02', id: 'paymentDeatilsBankEntity_02' });
  indexPositon++;
}
  if ((this.adviseThroughBankSwiftKeyed !== '' && this.adviseThroughBankSwiftKeyed !== null) ||
             (this.adviseThroughBankKeyed !== '' && this.adviseThroughBankKeyed !== null)) {
  this.optionList.splice(indexPositon, FccGlobalConstant.LENGTH_0,
    { label: this.adviceThrough , value: '08' , id: 'paymentDeatilsBankEntity_08' });
}

  if ((this.confirmingBankSwiftKeyed !== '' && this.confirmingBankSwiftKeyed !== null) ||
      (this.confirmingBankKeyed !== '' && this.confirmingBankKeyed !== null)) {
this.optionList.splice(indexPositon, FccGlobalConstant.LENGTH_0,
    { label: this.confBnk , value: '04' , id: 'paymentDeatilsBankEntity_04' });
}

  if (this.advisingBankSwiftKeyed === null || this.advisingBankKeyed === null ||
      this.advisingBankSwiftKeyed === '' || this.advisingBankKeyed === '') {
      const index = this.optionList.findIndex(x => x.value.label === FccGlobalConstant.ADVISINGBANK);
      if (index > -1) {
          this.optionList.splice(index, 1);
      }
}
  if (this.adviseThroughBankSwiftKeyed === null || this.adviseThroughBankKeyed === null ||
      this.adviseThroughBankSwiftKeyed === '' || this.adviseThroughBankKeyed === '') {
const index = this.optionList.findIndex(x => x.value.label === FccGlobalConstant.ADVISETHRU);
if (index > -1) {
    this.optionList.splice(index, 1);
}
}
  if (this.confirmingBankSwiftKeyed === null || this.confirmingBankKeyed === null ||
  this.confirmingBankSwiftKeyed === '' || this.confirmingBankKeyed === '') {
    const index = this.optionList.findIndex(x => x.value.label === FccGlobalConstant.CONFIRMINGBANK);
    if (index > -1) {
        this.optionList.splice(index, 1);
}
  }
  // this.list.sort((a, b) => a.value.label < b.value.label ? -1 : a.value > b.value ? 1 : 0);
  this.patchFieldParameters(this.form.get('paymentDetailsBankEntity'), { options: this.optionList });
}

  getList() {
    const elementId = FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY;
    this.productCode = FccGlobalConstant.PRODUCT_DEFAULT;
    this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    const elementValue = this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
        this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
        this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
      this.codeID = this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    }
    if (elementValue !== undefined && elementValue.length === 0) {
    //   this.eventDataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
    //   this.eventDataArray.forEach((value, index) => {
    //   if (value.value === FccGlobalConstant.ISSUING_BANK_CODE || value.value === FccGlobalConstant.ANY_BANK_CODE
    //     || value.value === FccGlobalConstant.OTHER_BANK_CODE) {
    //     this.optionList.push(value);
    //   }
    //  });
    //   this.patchFieldParameters(this.form.get('paymentDetailsBankEntity'), { options: this.optionList });
      const codeDataRequest = new CodeData();
      codeDataRequest.codeId = 'C098';
      codeDataRequest.productCode = FccGlobalConstant.PRODUCT_BG;
      codeDataRequest.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
      codeDataRequest.language = localStorage.getItem('language') !== null ? localStorage.getItem('language') : '';
      if (this.form.get('paymentDetailsBankEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS].length === 0 ) {
        this.commonService.getCodeDataDetails(codeDataRequest).subscribe(response => {
        response.body.items.forEach(responseValue => {
            const eventData: { label: string; value: any; id: any } = {
              label: responseValue.longDesc,
              value: responseValue.value,
              id: elementId.concat('_').concat(responseValue.value)
            };
            if (eventData.value === FccGlobalConstant.ISSUING_BANK_CODE || eventData.value === FccGlobalConstant.ANY_BANK_CODE
              || eventData.value === FccGlobalConstant.OTHER_BANK_CODE) {
              this.optionList.push(eventData);
            }
          });
        this.form.get('paymentDetailsBankEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = this.optionList;
        this.getAdvisingBnkDetails();
        });
      } else {
        const formOptions = this.form.get('paymentDetailsBankEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
        formOptions.forEach(formOption => {
          const eventData: { label: string; value: any; id: any } = {
            label: formOption.label,
            value: formOption.value,
            id: formOption.id
          };
          this.optionList.push(eventData);
          this.getAdvisingBnkDetails();
        });
        this.form.get('paymentDetailsBankEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = this.optionList;
      }
    }
  }

  updateDropdownValues() {
    if (this.productStateService
      .getSectionData(
        FccGlobalConstant.UI_UNDERTAKING_DETAILS,
        undefined,
        this.isMasterRequired
      )
      .get("uiPaymentDetails")
      .get("paymentDetailsBankEntity").value !== ""
    ) {
      const paymentSection = this.productStateService
      .getSectionData(
        FccGlobalConstant.UI_UNDERTAKING_DETAILS,
        undefined,
        this.isMasterRequired
      )
      .get("uiPaymentDetails");
      const entity = paymentSection.get('paymentDetailsBankEntity').value;
      const bankNameValue = this.setBankName(entity);
      const exists = this.optionList.filter(
        task => task.label === bankNameValue);
      if (exists.length > 0) {
        this.form.get('paymentDetailsBankEntity').setValue(paymentSection.get('paymentDetailsBankEntity').value);
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
      case '04':
        return this.bnkName = this.confBnk;
      case '08':
        return this.bnkName = this.adviceThrough;
      case '99':
        return this.bnkName = this.othBnk;
    }
  }

  onClickPaymentDetailsBankEntity() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const bankDetails = this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired);
    const pdApplicantName: any = 'paymentDetailsBankName';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const advisingBank = 'uiAdvisingBank';
    const adviseThrough = 'uiAdviceThrough';
    const bnkVal = this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired);
    const bankDetail = bnkVal.get('uiBankNameList').value;
    if (this.form.get('paymentDetailsBankEntity').value === '02') {
      this.advisingBankKeyed = bankDetails.controls[advisingBank].get('advisingBankName').value;
      this.form.get('paymentDetailsBankName').setValue(this.advisingBankKeyed);
      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.renderedFields = ['paymentDetailsBankFirstAddress' , 'paymentDetailsBankSecondAddress' ,
        'paymentDetailsBankThirdAddress', 'paymentDetailsBankFourthAddress'];
      this.toggleControls(this.form, this.renderedFields, false);
      this.resettingValidators('paymentDetailsBankFirstAddress');
      this.resettingValidators('paymentDetailsBankSecondAddress');
      this.resettingValidators('paymentDetailsBankThirdAddress');
      this.resettingValidators('paymentDetailsBankFourthAddress');
    //  this.disableAddress();
      this.form.controls[pdApplicantName].disable();
    }
    if (this.form.get('paymentDetailsBankEntity').value === '04') {
      this.form.get('paymentDetailsBankName').setValue(this.confirmingBankKeyed);
      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.renderedFields = ['paymentDetailsBankFirstAddress' , 'paymentDetailsBankSecondAddress' ,
        'paymentDetailsBankThirdAddress', 'paymentDetailsBankFourthAddress'];
      this.toggleControls(this.form, this.renderedFields, false);
      this.resettingValidators('paymentDetailsBankFirstAddress');
      this.resettingValidators('paymentDetailsBankSecondAddress');
      this.resettingValidators('paymentDetailsBankThirdAddress');
      this.resettingValidators('paymentDetailsBankFourthAddress');
    }
    if (this.form.get('paymentDetailsBankEntity').value === '08') {
      this.adviseThroughBankKeyed = bankDetails.controls[adviseThrough].get('adviceThroughName').value;
      this.form.get('paymentDetailsBankName').setValue(this.adviseThroughBankKeyed);
      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.renderedFields = ['paymentDetailsBankFirstAddress' , 'paymentDetailsBankSecondAddress' ,
        'paymentDetailsBankThirdAddress', 'paymentDetailsBankFourthAddress'];
      this.toggleControls(this.form, this.renderedFields, false);
      this.resettingValidators('paymentDetailsBankFirstAddress');
      this.resettingValidators('paymentDetailsBankSecondAddress');
      this.resettingValidators('paymentDetailsBankThirdAddress');
      this.resettingValidators('paymentDetailsBankFourthAddress');
    }
    if (this.form.get('paymentDetailsBankEntity').value === FccGlobalConstant.ISSUING_BANK_CODE) {
     if (bnkVal !== undefined) {
        let bankNameVal;
        if (bankDetail !== null) {
          bankNameVal = bnkVal.get('uiBankNameList').value;
        } else {
          bankNameVal = this.isueBnk;
        }
        this.form.get('paymentDetailsBankName').setValue(bankNameVal);
        } else {
        this.form.get('paymentDetailsBankName').setValue('');
        }
     this.form.get('paymentDetailsBankName').updateValueAndValidity();
     this.form.updateValueAndValidity();
    // this.form.get('inputDraweeDetail').setValue(this.form.get('paymentDetailsBankEntity').value.shortName);
     this.bankName = this.form.get('paymentDetailsBankName').value;
     this.nonRenderedFields = ['paymentDetailsBankFirstAddress' , 'paymentDetailsBankSecondAddress' ,
      'paymentDetailsBankThirdAddress', 'paymentDetailsBankFourthAddress'];
     this.toggleControls(this.form, this.nonRenderedFields, false);
     this.resettingValidators('paymentDetailsBankFirstAddress');
     this.resettingValidators('paymentDetailsBankSecondAddress');
     this.resettingValidators('paymentDetailsBankThirdAddress');
     this.resettingValidators('paymentDetailsBankFourthAddress');
     this.form.controls[pdApplicantName].disable();
    }
    if (this.form.get('paymentDetailsBankEntity').value === FccGlobalConstant.ANY_BANK_CODE) {
      this.form.get('paymentDetailsBankName').setValue(this.anyBnk);
     // this.form.get('inputDraweeDetail').setValue(this.anyBnk);
      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.nonRenderedFields = ['paymentDetailsBankFirstAddress' , 'paymentDetailsBankSecondAddress' ,
       'paymentDetailsBankThirdAddress', 'paymentDetailsBankFourthAddress'];
      this.toggleControls(this.form, this.nonRenderedFields, false);
      this.resettingValidators('paymentDetailsBankFirstAddress');
      this.resettingValidators('paymentDetailsBankSecondAddress');
      this.resettingValidators('paymentDetailsBankThirdAddress');
      this.resettingValidators('paymentDetailsBankFourthAddress');
    }
    if (this.form.get('paymentDetailsBankEntity').value === FccGlobalConstant.OTHER_BANK_CODE) {
      if (!this.commonService.isNonEmptyValue(this.form.get('paymentDetailsBankFirstAddress').value)) {
        this.form.get(FccGlobalConstant.PAYMENT_DETAILS_BANK_NAME).setValue(this.othBnk);
        this.form.controls[pdApplicantName].enable();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const option = this.uiService.getOption();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
      if (this.form.get('paymentDetailsBankName').value === this.advisingBankKeyed ||
        this.form.get('paymentDetailsBankName').value === bankDetail ||
        this.form.get('paymentDetailsBankName').value === this.anyBnk ||
        this.form.get('paymentDetailsBankName').value === this.isueBnk) {
            this.form.get('paymentDetailsBankName').setValue('');
            this.form.get('paymentDetailsBankFirstAddress').setValue('');
            this.form.get('paymentDetailsBankSecondAddress').setValue('');
            this.form.get('paymentDetailsBankThirdAddress').setValue('');
            this.form.get('paymentDetailsBankFourthAddress').setValue('');
            this.form.updateValueAndValidity();
          }
      this.renderedFields = ['paymentDetailsBankFirstAddress', 'paymentDetailsBankSecondAddress',
      'paymentDetailsBankThirdAddress'];
      this.toggleControls(this.form, this.renderedFields, true);
      this.patchFieldParameters(this.form.get('paymentDetailsBankFullAddress'), { previewScreen: true });
      this.patchFieldParameters(this.form.get('paymentDetailsBankFirstAddress'), { previewScreen: true });
      this.patchFieldParameters(this.form.get('paymentDetailsBankSecondAddress'), { previewScreen: true });   
      this.patchFieldParameters(this.form.get('paymentDetailsBankThirdAddress'), { previewScreen: true });
      this.patchFieldParameters(this.form.get('paymentDetailsBankFourthAddress'), { previewScreen: true }); 
      this.modeOfTransmission =
      this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL,
      undefined, this.isMasterRequired).get('advSendMode').value;
      if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(this.pdApplicantName, Validators.pattern(this.swiftXChar), 0);
        this.form.addFCCValidators(this.pdApplicantFirstAddress, Validators.pattern(this.swiftXChar), 0);
        this.form.addFCCValidators(this.pdApplicantSecondAddress, Validators.pattern(this.swiftXChar), 0);
        this.form.addFCCValidators(this.pdApplicantThirdAddress, Validators.pattern(this.swiftXChar), 0);
        this.toggleControl(this.form, this.pdApplicantFourthAddress, false);
      } else {
        this.toggleControl(this.form, this.pdApplicantFourthAddress, true);
        this.form.addFCCValidators(this.pdApplicantFourthAddress,
          Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
        this.setMandatoryField(this.form, this.pdApplicantFourthAddress, true);
      }
      this.form.updateValueAndValidity();

      this.setMandatoryField(this.form, this.pdApplicantFirstAddress, true);
      this.setMandatoryField(this.form, this.pdApplicantSecondAddress, true);
      this.setMandatoryField(this.form, this.pdApplicantThirdAddress, true);
      this.setMandatoryField(this.form, this.pdApplicantName, true);
      if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(this.pdApplicantFirstAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
        this.form.addFCCValidators(this.pdApplicantSecondAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
        this.form.addFCCValidators(this.paymentDetailsAddressRegex, Validators.pattern(this.paymentDetailsAddressRegex), 0);
      }
      this.form.addFCCValidators(this.pdApplicantFirstAddress,
        Validators.compose([Validators.required, Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      this.form.addFCCValidators(this.pdApplicantSecondAddress,
          Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      this.form.addFCCValidators(this.pdApplicantThirdAddress,
          Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      if (this.option === FccGlobalConstant.TEMPLATE) {
          this.setMandatoryFields(this.form, ['paymentDetailsBankName', 'paymentDetailsBankFirstAddress',
          'paymentDetailsBankSecondAddress', 'paymentDetailsBankThirdAddress', 'paymentDetailsBankFourthAddress'], false);
          this.form.get('paymentDetailsBankFirstAddress').clearValidators();
          if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
            this.form.addFCCValidators(this.pdApplicantFirstAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
          }
          this.form.addFCCValidators(this.pdApplicantFirstAddress,
            Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
          this.form.updateValueAndValidity();
        }
    }
    if (this.form.get('paymentDetailsBankEntity').value !== FccGlobalConstant.OTHER_BANK_CODE) {
      this.form.controls[pdApplicantName].disable();
    } else {
      this.toggleControl(this.form, this.pdApplicantFourthAddress, true);
      this.form.addFCCValidators(this.pdApplicantFourthAddress, Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      this.setMandatoryField(this.form, this.pdApplicantFourthAddress, true);
      this.form.controls[pdApplicantName].enable();
    }
    this.form.updateValueAndValidity();

    this.setMandatoryField(this.form, this.pdApplicantFirstAddress, true);
    this.setMandatoryField(this.form, this.pdApplicantSecondAddress, true);
    this.setMandatoryField(this.form, this.pdApplicantThirdAddress, true);
    this.setMandatoryField(this.form, this.pdApplicantName, true);
    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators(this.pdApplicantFirstAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
      this.form.addFCCValidators(this.pdApplicantSecondAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
      this.form.addFCCValidators(this.paymentDetailsAddressRegex, Validators.pattern(this.paymentDetailsAddressRegex), 0);
    }
    if (this.form.get('paymentDetailsBankEntity').value === FccGlobalConstant.OTHER_BANK_CODE) {
      this.form.addFCCValidators(this.pdApplicantFirstAddress,
        Validators.compose([Validators.required, Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      this.form.addFCCValidators(this.pdApplicantSecondAddress,
        Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      this.form.addFCCValidators(this.pdApplicantThirdAddress,
        Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryFields(this.form,
          [
            "paymentDetailsBankName",
            "paymentDetailsBankFirstAddress",
            "paymentDetailsBankSecondAddress",
            "paymentDetailsBankThirdAddress",
            "paymentDetailsBankFourthAddress",
          ],
          false
        );
        this.form.get('paymentDetailsBankFirstAddress').clearValidators();
        if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators(this.pdApplicantFirstAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
        }
        this.form.addFCCValidators(this.pdApplicantFirstAddress,
          Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
        this.form.updateValueAndValidity();
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
      && this.modeOfTransmission[0] && (this.modeOfTransmission[0].value !== null &&
          this.modeOfTransmission[0].value!== undefined)
        && this.modeOfTransmission[0].value !== FccBusinessConstantsService.SWIFT ) {
      this.resettingValidators(this.pdApplicantFourthAddress);
    }
    this.resettingValidators(this.pdApplicantName);
    this.resettingValidators(this.pdApplicantFirstAddress);
    this.resettingValidators(this.pdApplicantSecondAddress);
    this.resettingValidators(this.pdApplicantThirdAddress);
  }

  ngOnDestroy() {
    this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = [];
    this.optionList = [];
    this.parentForm.controls[this.controlName] = this.form;
  }

  populateDataFromCopyFrom() {
    const option = this.uiService.getOption();
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW &&
      (option === FccGlobalConstant.EXISTING_OPTION || option === FccGlobalConstant.TEMPLATE
        || mode === FccGlobalConstant.DRAFT_OPTION)) {
      this.updateDropdownValues();
      this.onClickPaymentDetailsBankEntity();
      if (this.form.get('paymentDetailsBankEntity').value === FccGlobalConstant.OTHER_BANK_CODE) {
        this.toggleControls(this.form, this.renderedFields, true);
        if ( (this.modeOfTransmission[0].value !== null && this.modeOfTransmission[0].value !== undefined)
        && this.modeOfTransmission[0].value !== FccBusinessConstantsService.SWIFT) {
          this.form.controls[this.pdApplicantFourthAddress].enable();
        }
        }
      this.form.updateValueAndValidity();
      }
  }

  hidePaymentFullAddressForAmend() {
    const hideFields = ['paymentDetailsBankFullAddress', 'paymentDetailsBankcountry'];
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('paymentDetailsBankFullAddress')
         && this.form.get('paymentDetailsBankcountry')) {
          this.toggleControls(this.form, hideFields, false);
    }
  }

  // [Accessibility]: When the user select the entity using keyboard
  onKeyupAdvisingBankIcons(event, key) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      this.onClickAdvisingBankIcons(event, key);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickAdvisingBankIcons(event, key) {
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
    if (this.form.get('paymentDetailsBankEntity') &&
    this.form.get('paymentDetailsBankEntity').value === FccGlobalConstant.OTHER_BANK_CODE) {
      this.resolverService.getSearchData(header, obj);
      this.advisingBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((advResponse) => {
        if (advResponse && advResponse !== null && advResponse.responseData && advResponse.responseData !== null) {
          advResponse.responseData.NAME ? this.form.get('paymentDetailsBankName').patchValue(advResponse.responseData.NAME) :
          this.form.get('paymentDetailsBankName').patchValue(advResponse.responseData[0]);
          advResponse.responseData.ADDRESS_LINE_1 ? this.form.get('paymentDetailsBankFirstAddress')
          .patchValue(advResponse.responseData.ADDRESS_LINE_1) :
          this.form.get('paymentDetailsBankFirstAddress').patchValue(advResponse.responseData[1]);
          advResponse.responseData.ADDRESS_LINE_2 ? this.form.get('paymentDetailsBankSecondAddress')
          .patchValue(advResponse.responseData.ADDRESS_LINE_2) :
          this.form.get('paymentDetailsBankSecondAddress').patchValue(advResponse.responseData[2]);
          advResponse.responseData.DOM ? this.form.get('paymentDetailsBankThirdAddress').patchValue(advResponse.responseData.DOM) :
          this.form.get('paymentDetailsBankThirdAddress').patchValue(advResponse.responseData[3]);
          if (this.mode !== FccBusinessConstantsService.SWIFT && advResponse.responseData.ADDRESS_LINE_4 != null) {
            this.form.get('paymentDetailsBankFourthAddress').patchValue(advResponse.responseData.ADDRESS_LINE_4);
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
  }

}
