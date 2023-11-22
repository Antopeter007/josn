import { TradeCommonService } from './../../../../common/service/trade-common.service';
import { CodeDataService } from './../../../../../../common/services/code-data.service';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { FormControlService } from '../../services/form-control.service';
import { PrevNextService } from '../../services/prev-next.service';
import { UtilityService } from '../../services/utility.service';
import { CommonService } from './../../../../../../../app/common/services/common.service';
import { SessionValidateService } from './../../../../../../../app/common/services/session-validate-service';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../../common/services/form-model.service';
import { LcTemplateService } from './../../../../../../common/services/lc-template.service';
import { LcConstant } from './../../../common/model/constant';
import { ImportLetterOfCreditResponse } from './../../model/importLetterOfCreditResponse';
import { LcReturnService } from './../../services/lc-return.service';
import { LcProductComponent } from './../lc-product/lc-product.component';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { LcProductService } from '../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
@Component({
  selector: 'fcc-trade-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: PaymentDetailsComponent }]
})
export class PaymentDetailsComponent extends LcProductComponent implements OnInit, OnDestroy {
  form: FCCFormGroup;
  module = `${this.translateService.instant('paymentDetailsModule')}`;
  paymentDetailsModule;
  formSubmitted = false;
  list: any;
  swiftXChar: string;
  subheader = '';
  contextPath: any;
  paymentDetailsNameRegex;
  paymentDetailsAddressRegex;
  paymentDetailsNameLength;
  mode: any;
  transmissionmode : any;
  bankList: any;
  creditAvailableWith = 'paymentDetailscreditAvailWith';
  creditAvailBy = 'paymentDetailscreditAvailBy';
  paymentDraftAt = 'paymentDetailspaymentDraftAt';
  draweeDetails = 'paymentDetailsdrawDetails';
  progressivebar: number;
  draweeList = [];
  bankName: any;
  renderedFields: any[];
  nonRenderedFields: any[];
  blankFields: any[];
  unCheckedFields: any[];
  advBnk = this.translateService.instant('advisingBank');
  isueBnk = this.translateService.instant('issuingBank');
  anyBnk = this.translateService.instant('anyBank');
  othBnk = this.translateService.instant('otherBank');
  adviceThrough = this.translateService.instant('adviceThrough');

  pdBankName: any = 'paymentDetailsBankName';
  pdApplicantFirstAddress: any = FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR;
  pdApplicantSecondAddress: any = 'paymentDetailsBankSecondAddress';
  pdApplicantThirdAddress: any = 'paymentDetailsBankThirdAddress';
  pdApplicantFourthAddress: any = 'paymentDetailsBankFourthAddress';
  inputTextAreaMixPayment: any = 'inputTextAreaMixPayment';
  confirm = true;
  prev = 'prev';
  next = 'next';
  selectList: any;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  checkIcons = this.lcConstant.tickIcon;
  icon: any = 'icon';
  layoutFixClass: any = 'p-col-6 p-md-6 p-lg-6 p-sm-12';
  FA_FA_CHECK_CIRCLE = 'fa fa-check-circle fa-2x';
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
  inputDays = [];
  inputDraweeDetails: any;
  rendered = this.lcConstant.rendered;
  tnxTypeCode: any;
  warning = 'warning';
  advisingBankEntered: any;
  paymentAmendwarningmessage = 'paymentAmendwarningmessage';
  lcResponseForm = new ImportLetterOfCreditResponse();
  isMasterRequired: any;
  masterInputTextAreaMixPayment: any;
  option;
  operation: any;
  modeValue: any;
  requestType: any;
  paymentDetailsBankAddrFields = [FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR ,
    FccTradeFieldConstants.PAYMENT_BANK_SECOND_ADDR , FccTradeFieldConstants.PAYMENT_BANK_THIRD_ADDR];
  isPreview: boolean;
  codeID: any;
  productCode: any;
  subProductCode: any;
  eventDataArray: any;
  draweeDataArray = [];
  optionList = [];
  bnkName: string;
  bankValue: string;
  nameOrAbbvName: any;
  enquiryRegex;
  advisingBankResponse: any;
  previewScreen: boolean;
  enteredCharCount = 'enteredCharCount';
  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router, protected leftSectionService: LeftSectionService,
              protected lcReturnService: LcReturnService, protected stateService: ProductStateService,
              protected utilityService: UtilityService, protected prevNextService: PrevNextService,
              protected phrasesService: PhrasesService, protected multiBankService: MultiBankService,
              protected lcTemplateService: LcTemplateService, protected searchLayoutService: SearchLayoutService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected emitterService: EventEmitterService, protected amendCommonService: AmendCommonService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService, protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected lcProductService: LcProductService,
              protected codeDataService: CodeDataService, protected tradeCommonService: TradeCommonService) {
    super(emitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameOrAbbvName = response.TradeIssuingBankNameOrAbbvName;
      }
    });
    this.isMasterRequired = this.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.mode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.modeValue = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.isPreview = this.modeValue === FccGlobalConstant.INITIATE || this.modeValue === FccGlobalConstant.DRAFT_OPTION ||
    this.modeValue === FccGlobalConstant.EXISTING;
    this.requestType = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get(FccGlobalConstant.REQUEST_OPTION_LC).value;
    window.scroll(0, 0);
    this.initializeVariables();
    this.initializeFormGroup();

    this.configureRegExForPaymentDetails();
    this.getAdvisingBnkDetails();
    this.getPaymentContextReadonly();
    this.patchLayoutForReadOnlyMode();
    this.onClickCreditAvailableOptions();
    this.onClickInputSelect();
    this.onClickInputDraweeDetail();
    this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'paymentDetailsBankEntity', false);
    if (this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS) &&
      this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('requestOptionsLC') &&
      this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('requestOptionsLC').value === '04') {
      this.setValueToNull(['creditAvailableOptions', 'paymentDraftOptions']);
      this.clearRequiredFlag();
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameOrAbbvName = response.TradeIssuingBankNameOrAbbvName;
        this.swiftXChar = response.swiftXCharacterSet;
        this.form.get('paymentDetailsBankName').clearValidators();
        this.form.get('paymentDetailsBankFirstAddress').clearValidators();
        this.form.get('paymentDetailsBankSecondAddress').clearValidators();
        this.form.get('paymentDetailsBankThirdAddress').clearValidators();
        if (this.mode === FccBusinessConstantsService.SWIFT ||
          (this.mode[0] && this.mode[0].value === FccBusinessConstantsService.SWIFT)) {
          this.form.addFCCValidators('paymentDetailsBankName', Validators.pattern(this.swiftXChar), 0);
          this.form.addFCCValidators('paymentDetailsBankFirstAddress', Validators.pattern(this.swiftXChar), 0);
          this.form.addFCCValidators('paymentDetailsBankSecondAddress', Validators.pattern(this.swiftXChar), 0);
          this.form.addFCCValidators('paymentDetailsBankThirdAddress', Validators.pattern(this.swiftXChar), 0);
          this.form.get('paymentDetailsBankName').updateValueAndValidity();
          this.form.get('paymentDetailsBankFirstAddress').updateValueAndValidity();
          this.form.get('paymentDetailsBankSecondAddress').updateValueAndValidity();
          this.form.get('paymentDetailsBankThirdAddress').updateValueAndValidity();
        }
        }
    });
    this.form.get('inputTextAreaMixPayment').clearValidators();
    this.form.get('inputTextAreaMixPayment').updateValueAndValidity();

    if (this.modeValue === FccGlobalConstant.DRAFT_OPTION ) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }

    this.updateNarrativeCount();
    if(this.form.get('paymentDetailsBankEntity').value === '99'){
      this.patchFieldParameters(this.form.get('paymentDetailsBankFullAddress'), { previewScreen: true });
      this.patchFieldParameters(this.form.get('paymentDetailsBankFirstAddress'), { previewScreen: true });
      this.patchFieldParameters(this.form.get('paymentDetailsBankSecondAddress'), { previewScreen: true });
      this.patchFieldParameters(this.form.get('paymentDetailsBankThirdAddress'), { previewScreen: true });
      this.patchFieldParameters(this.form.get('paymentDetailsBankFourthAddress'), { previewScreen: true });
    }
  }
  clearRequiredFlag() {
    if (this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)) {
      this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).clearValidators();
      this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).markAsTouched();
      this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).updateValueAndValidity();
    }
  }
  updateNarrativeCount() {
    if (this.form.get('inputTextAreaMixPayment').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('inputTextAreaMixPayment').value);
      this.form.get('inputTextAreaMixPayment')[this.params][this.enteredCharCount] = count;
    }
  }
  initializeVariables() {
    this.inputDays = [
        { value: { label:  'Days', shortName : this.translateService.instant('days') },
        label: this.translateService.instant('days') , code : 'D' },
        { value: { label:  'Weeks', shortName : this.translateService.instant('weeks') } ,
        label: this.translateService.instant('weeks'), code : 'W' },
        { value: { label:  'Months', shortName : this.translateService.instant('months') },
        label: this.translateService.instant('months'), code : 'M' },
        { value: 'Years', label: this.translateService.instant('years'), code : 'Y' },
      ];
    this.optionList = [];
  }
  getPaymentDraftWidgetData() {
    if (this.form.get('paymentDraftOptions').value === '01') {
      this.renderedFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'fixedMaturityPaymentDate'];
      this.toggleControls(this.form, this.renderedFields, false);
     } else if (this.form.get('paymentDraftOptions').value === '02') {
      this.toggleControl(this.form, 'fixedMaturityPaymentDate', true);
      this.renderedFields = ['draweeDetails', 'inputDraweeDetail'];
      this.toggleControls(this.form, this.renderedFields, true);
      this.nonRenderedFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
      this.toggleControls(this.form, this.nonRenderedFields, false);
      this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
      // this.form.get('inputDraweeDetail').setValue(this.form.get('paymentDetailsBankEntity').value);
    } else if (this.form.get('paymentDraftOptions').value === '03') {
      this.renderedFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'draweeDetails', 'inputDraweeDetail'];
      this.toggleControls(this.form, this.renderedFields, true);
      this.toggleControl(this.form, 'fixedMaturityPaymentDate', false);
      this.form.addFCCValidators('inputValNum', Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_3),
         Validators.pattern('^[0-9]+$')]), 0);
      this.mandatoryFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect'];
      this.setMandatoryFields(this.form, this.mandatoryFields, true);
      // this.form.get('inputDraweeDetail').setValue(this.form.get('paymentDetailsBankEntity').value);
      } else if (this.form.get('creditAvailableOptions').value === FccBusinessConstantsService.CREDIT_AVL_MIXED) {
        this.renderedFields = ['inputTextAreaMixPayment'];
        this.toggleControls(this.form, this.renderedFields, true);
        this.nonRenderedFields = ['paymentDraftOptions', 'paymentDraftAt'];
        this.toggleControls(this.form, this.nonRenderedFields, false);
        this.setMandatoryField(this.form, 'inputTextAreaMixPayment', true);
      }
    this.removeMandatory(['fixedMaturityPaymentDate', 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputTextAreaMixPayment']);
  }

  patchLayoutForReadOnlyMode() {
    if (this.form !== undefined && this.form.getFormMode() === 'view') {

      const controls = Object.keys(this.form.controls);
      let index: any;
      for (index = 0; index < controls.length; index++) {
        this.viewModeChange(this.form, controls[index]);
      }
    }
  }

  updateAmendValues() {
    const paymentDetailsBankEntity = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'paymentDetailsBankEntity', false);
    const fixedMaturityPaymentDate = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'fixedMaturityPaymentDate', false);
    const inputValNum = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'inputValNum', false);
    const inputDays = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'inputDays', false);
    const inputFrom = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'inputFrom', false);
    const inputSelect = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'inputSelect', false);
    const inputTextAreaMixPayment = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'inputTextAreaMixPayment', false);
    let paymentDraftWidget;
    let paymentDraftWidgetData;
    if (inputValNum !== '' || inputDays !== '' || inputFrom !== '' || inputSelect !== '') {
      paymentDraftWidget = this.translateService.instant('paymentDraftOptions_03');
      paymentDraftWidgetData = '3';
    } else if (fixedMaturityPaymentDate !== '') {
      paymentDraftWidget = this.translateService.instant('paymentDraftOptions_02');
      paymentDraftWidgetData = '2';
    } else if (inputTextAreaMixPayment !== '' &&
      this.translateService.instant(inputTextAreaMixPayment.toUpperCase()) !== this.translateService.instant('paymentDraftOptions_01')) {
      paymentDraftWidget = '';
      paymentDraftWidgetData = '';
      this.form.get('paymentDraftOptions').setValue('');
      this.form.get('creditAvailableOptions').setValue(FccBusinessConstantsService.CREDIT_AVL_MIXED);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      paymentDraftWidget = this.translateService.instant('paymentDraftOptions_01');
      paymentDraftWidgetData = '1';
    }
    if (paymentDraftWidgetData === '1') {
      this.patchFieldValueAndParameters(this.form.get('paymentDraftOptions'), FccBusinessConstantsService.PYMT_DRAFT_SIGHT,
      { options: this.getPaymentDraftArray(1) });
    } else if (paymentDraftWidgetData === '2') {
      this.patchFieldValueAndParameters(this.form.get('paymentDraftOptions'), FccBusinessConstantsService.PYMT_DRAFT_MATURITYDATE,
      { options: this.getPaymentDraftArray(FccGlobalConstant.LENGTH_2) });
    } else if (paymentDraftWidgetData === '3') {
      this.patchFieldValueAndParameters(this.form.get('paymentDraftOptions'), FccBusinessConstantsService.PYMT_DRAFT_CALC_MATURITY_DATE,
      { options: this.getPaymentDraftArray(FccGlobalConstant.LENGTH_3) });
    }
    this.getPaymentDraftWidgetData();
    const exist = this.optionList.filter(
      task => task.value === paymentDetailsBankEntity);
    if (exist.length > 0) {
      this.form.get('paymentDetailsBankEntity').setValue(paymentDetailsBankEntity);
    }
    const exists = this.inputDays.filter(
      task => task.code === inputDays);
    if (exists.length > 0) {
      this.form.get('inputDays').setValue(this.inputDays.filter(
        task => task.code === inputDays)[0].value);
    }
    if (this.operation !== FccGlobalConstant.PREVIEW) {
      const draweeDetails = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS,
        FccGlobalConstant.INPUT_DRAWEE_DETAIL, true);
      if (this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL).value) &&
      this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL).value !== FccGlobalConstant.EMPTY_STRING &&
      (draweeDetails === null || draweeDetails === undefined || draweeDetails === FccGlobalConstant.EMPTY_STRING)) {
        this.stateService.setValue(FccGlobalConstant.PAYMENT_DETAILS, FccGlobalConstant.INPUT_DRAWEE_DETAIL,
          this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).value, true);
      }
    }
  }

  readOnlyMode() {
    this.lcReturnService.allLcRecords.subscribe(data => {
      this.lcResponseForm = data;

      // Credit Available With

      const exist = this.optionList.filter(
        task => task.value.label === this.lcResponseForm.paymentDetails.creditAvailableWith);
      if (exist.length > 0) {
        this.form.get('paymentDetailsBankEntity').setValue(this.optionList.filter(
          task => task.value.label === this.lcResponseForm.paymentDetails.creditAvailableWith)[0].value);
      }
      this.patchFieldParameters(this.form.get('paymentDetailsBankEntity'), { readonly: true });


      this.form.get('paymentDetailsBankName').patchValue(this.lcResponseForm.paymentDetails.bankName);
      this.patchFieldParameters(this.form.get('paymentDetailsBankName'), { readonly: true });
      this.form.get(FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR).patchValue(this.lcResponseForm.paymentDetails.address.line1);
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR), { readonly: true });
      this.form.get('paymentDetailsBankSecondAddress').patchValue(this.lcResponseForm.paymentDetails.address.line2);
      this.patchFieldParameters(this.form.get('paymentDetailsBankSecondAddress'), { readonly: true });
      this.form.get('paymentDetailsBankThirdAddress').patchValue(this.lcResponseForm.paymentDetails.address.line3);
      this.patchFieldParameters(this.form.get('paymentDetailsBankThirdAddress'), { readonly: true });
      this.patchFieldParameters(this.form.get('paymentDetailsBankFourthAddress'), { rendered: false });
      if ((this.mode[0].value !== null && this.mode[0].value !== undefined) && this.mode[0].value !== FccBusinessConstantsService.SWIFT) {
        this.form.get('paymentDetailsBankFourthAddress').patchValue(this.lcResponseForm.paymentDetails.address.line4);
        this.patchFieldParameters(this.form.get('paymentDetailsBankFourthAddress'), { rendered: true, readonly: true });
      }

      // Credit Available By

      this.form.get('creditAvailableOptions').patchValue(this.lcResponseForm.paymentDetails.creditAvailableBy);
      this.patchFieldParameters(this.form.get('creditAvailableOptions'), { readonly: true });
      // Payment/Draft At
      this.form.get('paymentDraftOptions').patchValue(this.lcResponseForm.paymentDetails.creditAvailableBy);
      this.patchFieldParameters(this.form.get('paymentDraftOptions'), { readonly : true });
      // Fixed maturity Date
      this.form
        .get("fixedMaturityPaymentDate")
        .setValue(
          this.utilityService.transformStringtoDate(
            this.lcResponseForm.paymentDetails.tenor.maturityDate
          )
        );

      this.patchFieldParameters(this.form.get('fixedMaturityPaymentDate'), { readonly : true });

      if (this.lcResponseForm.paymentDetails.draftsDrawnOn !== undefined) {
        if (this.lcResponseForm.paymentDetails.draftsDrawnOn === 'ISSUING-BANK') {
          this.inputDraweeDetails = this.translateService.instant('issuingBank');
        } else if (this.lcResponseForm.paymentDetails.draftsDrawnOn === 'OTHER') {
          this.inputDraweeDetails = this.translateService.instant('otherBank');
        } else if (this.lcResponseForm.paymentDetails.draftsDrawnOn === 'APPLICANT') {
          this.inputDraweeDetails = this.translateService.instant('applicant');
        } else if (this.lcResponseForm.paymentDetails.draftsDrawnOn === FccGlobalConstant.ADVISINGBANK ) {
          this.inputDraweeDetails = this.translateService.instant('advisingBank');
        } else if (this.lcResponseForm.paymentDetails.draftsDrawnOn === 'NEGOTIATING-BANK' ) {
          this.inputDraweeDetails = this.translateService.instant('negotiatingBank');
        } else if (this.lcResponseForm.paymentDetails.draftsDrawnOn === 'CONFIRMING-BANK' ) {
          this.inputDraweeDetails = this.translateService.instant('confirmingBank');
        } else if (this.lcResponseForm.paymentDetails.draftsDrawnOn === 'REIMBURSING-BANK' ) {
          this.inputDraweeDetails = this.translateService.instant('reimbursingBank');
        }
      }
      this.form.get('inputDraweeDetail').patchValue(this.inputDraweeDetails);
      this.patchFieldParameters(this.form.get('inputDraweeDetail'), { readonly: true });

      // Calculated Maturity Date
      this.form.get('inputValNum').patchValue(this.lcResponseForm.paymentDetails.tenor.period);
      this.patchFieldParameters(this.form.get('inputValNum'), { readonly: true });

      const exists = this.inputDays.filter(
        task => task.code === this.lcResponseForm.paymentDetails.tenor.frequency);
      if (exists.length > 0) {
        this.form.get('inputDays').setValue(this.inputDays.filter(
          task => task.code === this.lcResponseForm.paymentDetails.tenor.frequency)[0].value);
      }

      if (this.lcResponseForm.paymentDetails.tenor.fromAfter === 'FROM') {
        this.form.get('inputFrom').setValue({ label : 'FROM', shortName : this.translateService.instant('from') });
      } else {
        this.form.get('inputFrom').setValue({ label : 'AFTER', shortName : this.translateService.instant('after') });
      }

      this.form.get('inputTextAreaMixPayment').patchValue(this.lcResponseForm.paymentDetails.mixedPayDetail);
      this.patchFieldParameters(this.form.get('inputTextAreaMixPayment'), { readonly: true });
    });
    this.form.setFormMode('view');
  }

  ngOnDestroy() {
    if (this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL) &&
    this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL).value) &&
    this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL).value !== '' &&
    this.form.get(FccGlobalConstant.CREDIT_AVAILABLE_OPTIONS) &&
    this.form.get(FccGlobalConstant.CREDIT_AVAILABLE_OPTIONS).value !== FccBusinessConstantsService.CREDIT_AVL_ACCEPTANCE &&
    this.form.get(FccGlobalConstant.CREDIT_AVAILABLE_OPTIONS).value !== FccBusinessConstantsService.CREDIT_AVL_NEGOTIATION) {
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL), '', '');
      this.form.updateValueAndValidity();
    }
    this.stateService.setStateSection(FccGlobalConstant.PAYMENT_DETAILS, this.form, this.isMasterRequired);
    this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = [];
    this.optionList = [];
  }

  amendFormFields() {
  this.patchFieldParameters(this.form.get('paymentDetailsBankcountry'), { rendered: false });
  this.updateAmendValues();
  const sectionName = 'paymentDetails';
   if ((this.mode !== FccGlobalConstant.VIEW_MODE && this.operation !== FccGlobalConstant.PREVIEW) ||
   (this.mode === FccGlobalConstant.VIEW_MODE && this.operation === FccGlobalConstant.LIST_INQUIRY)) {
  this.amendCommonService.setValueFromMasterToPrevious(sectionName);
   }
  }

  initializeFormGroup() {
    const pdApplicantName: any = 'paymentDetailsBankName';
    const sectionName = 'paymentDetails';
    this.form = this.stateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    this.patchFieldParameters(this.form.get('paymentDetailsBankEntity'), { options: this.getList() });
    this.toggleControls(this.form, this.paymentDetailsBankAddrFields, false);
    this.mode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    this.patchFieldParameters(this.form.get('paymentDetailsBankFullAddress'), { rendered: false });
    if ( (this.mode !== null && this.mode !== undefined) && this.mode === FccBusinessConstantsService.SWIFT) {
      this.patchFieldParameters(this.form.get('paymentDetailsBankFourthAddress'), { rendered: false });
    }
    // this.patchFieldParameters(this.form.get('paymentDraftOptions'), { options: this.getPaymentDraftArray(1) });
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
    if (!this.form.get(this.pdBankName)[this.params][this.rendered]) {
      this.resettingValidators(this.pdBankName);
    }
    if (!this.form.get(this.pdApplicantFirstAddress)[this.params][this.rendered]) {
      this.resettingValidators(this.pdApplicantFirstAddress);
    }
    if (!this.form.get(this.pdApplicantSecondAddress)[this.params][this.rendered]) {
      this.resettingValidators(this.pdApplicantSecondAddress);
    }
    if (!this.form.get(this.pdApplicantThirdAddress)[this.params][this.rendered]) {
      this.resettingValidators(this.pdApplicantThirdAddress);
    }
    if (!this.form.get(this.inputTextAreaMixPayment)[this.params][this.rendered]) {
      this.resettingValidators(this.inputTextAreaMixPayment);
    }
    // this.disableAddress();
    if (this.form.get('paymentDetailsBankEntity').value !== '99') {
      this.form.controls[pdApplicantName].disable();
    }
    if (this.form.get('paymentDetailsBankEntity') && this.form.get('paymentDetailsBankEntity').value === '99') {
        this.toggleControls(this.form, this.paymentDetailsBankAddrFields, true);
        if ((this.commonService.isNonEmptyValue(this.mode[0].value)) && this.mode[0].value !== FccBusinessConstantsService.SWIFT) {
          this.toggleControls(this.form, ['paymentDetailsBankFourthAddress'], true);
        }
      } else {
        this.toggleControls(this.form, this.paymentDetailsBankAddrFields, false);
        // if ((this.commonService.isNonEmptyValue(this.mode[0].value)) && this.mode[0].value !== FccBusinessConstantsService.SWIFT) {
        this.toggleControls(this.form, ['paymentDetailsBankFourthAddress'], false);
        // }
      }
    if (this.option !== FccGlobalConstant.TEMPLATE) {
    if (this.commonService.isnonEMptyString(this.requestType)) {
        if (this.tnxTypeCode === FccGlobalConstant.N002_NEW && this.requestType === '02') {
          this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
          this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).clearValidators();
          this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).updateValueAndValidity();
        } else {
          this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
          this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).updateValueAndValidity();
        }
    }
    } else {
      this.removeMandatory([FccTradeFieldConstants.PAYMENT_DETAILS_BANK_ENTITY]);
      this.form.get(FccTradeFieldConstants.PAYMENT_DETAILS_BANK_ENTITY).clearValidators();
      this.form.get(FccTradeFieldConstants.PAYMENT_DETAILS_BANK_ENTITY).updateValueAndValidity();
    }
    /**
     * Populate the Drawee Bank drop down
     */
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE), { options: this.getDraweeList() });
    /**
     * Set to Issuing bank by default if value is not already selected.
     */
    this.mode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    if (this.form.get(FccGlobalConstant.CREDIT_AVAILABLE_OPTIONS) &&
      (this.form.get(FccGlobalConstant.CREDIT_AVAILABLE_OPTIONS).value === FccBusinessConstantsService.CREDIT_AVL_ACCEPTANCE ||
      this.form.get(FccGlobalConstant.CREDIT_AVAILABLE_OPTIONS).value === FccBusinessConstantsService.CREDIT_AVL_NEGOTIATION) &&
      this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE) &&
      this.commonService.isnonEMptyString(this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE).value)
      ) {
        // this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE).setValue(FccGlobalConstant.ISSUING_BANK_CODE);
      }

      if (this.form.get('paymentDetailsBankName').value === '03') {
        this.form.get('paymentDetailsBankEntity').setValue('03');
        this.form.get('paymentDetailsBankName').setValue(this.anyBnk);
      }else if (this.form.get('paymentDetailsBankName').value === '02') {
        this.form.get('paymentDetailsBankEntity').setValue('02');
        this.form.get('paymentDetailsBankName').setValue(this.advBnk);
      }else if (this.form.get('paymentDetailsBankName').value === '01') {
        this.form.get('paymentDetailsBankEntity').setValue('01');
        this.form.get('paymentDetailsBankName').setValue(this.isueBnk);
      }else if (this.form.get('paymentDetailsBankName').value === '08') {
        this.form.get('paymentDetailsBankEntity').setValue('08');
        this.form.get('paymentDetailsBankName').setValue(this.adviceThrough);
      }
  }
  onClickCreditAvailableOptions() {
    const creditAvailBy = this.form.get('creditAvailableOptions');
    const paymentDraftAt = this.form.get('paymentDraftOptions');
    const transamissionMode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    if (creditAvailBy && (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_PAYMENT)) {
      const displayFields = ['paymentDraftOptions', 'paymentDraftAt'];
      const hideFields = ['draweeDetails', 'inputDraweeDetail', 'inputTextAreaMixPayment', 'fixedMaturityPaymentDate',
      'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther', FccTradeFieldConstants.DRAWEE_BANK_NAME];
      this.renderCreditAvailableDependentFields(paymentDraftAt, FccBusinessConstantsService.PYMT_DRAFT_SIGHT,
                                                displayFields, hideFields, FccGlobalConstant.LENGTH_1);
      this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL).setValue('');
      this.removeMandatory([FccGlobalConstant.INPUT_DRAWEE_DETAIL]);
      this.form.get(FccTradeFieldConstants.DRAWEE_BANK_NAME).setValue('');
      this.addAmendLabelIcon(this.form.get('paymentDraftOptions'), this.form.controls);
      this.removeAmendIcon(this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL), this.form.controls);
    } else if (creditAvailBy && (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_ACCEPTANCE)) {
      this.renderCreditAvlAcceptanceFields(paymentDraftAt);
      this.addAmendLabelIcon(this.form.get('paymentDraftOptions'), this.form.controls);
    } else if (creditAvailBy && (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_NEGOTIATION)) {
      const fixedMaturityFields = ['fixedMaturityPaymentDate'];
      const calculatedMatFields = [ 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect'];
      const paymentDraftValue = paymentDraftAt.value !== FccGlobalConstant.EMPTY_STRING ?
                                 paymentDraftAt.value : FccBusinessConstantsService.PYMT_DRAFT_SIGHT;
      const commonFields = ['draweeDetails', 'inputDraweeDetail'];
      this.toggleControls(this.form, commonFields, true);
      this.resettingValidators(FccGlobalConstant.INPUT_DRAWEE_DETAIL);
      this.setMandatoryField(this.form, FccGlobalConstant.INPUT_DRAWEE_DETAIL, true);
      paymentDraftAt[this.params][this.rendered] = true;
      this.form.get('inputTextAreaMixPayment')[this.params][this.rendered] = false;
      if (paymentDraftValue === FccBusinessConstantsService.PYMT_DRAFT_MATURITYDATE) {
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftValue,
          fixedMaturityFields.concat(['paymentDraftAt']), calculatedMatFields, FccGlobalConstant.LENGTH_3);
          this.fieldValidations(this.form,fixedMaturityFields);
      } else if (paymentDraftValue === FccBusinessConstantsService.PYMT_DRAFT_CALC_MATURITY_DATE) {
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftValue,
          calculatedMatFields.concat(['paymentDraftAt']), fixedMaturityFields, FccGlobalConstant.LENGTH_3);
          this.fieldValidations(this.form,calculatedMatFields);
      } else if (paymentDraftValue === FccBusinessConstantsService.PYMT_DRAFT_SIGHT) {
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftValue,
          ['paymentDraftAt'], fixedMaturityFields.concat(calculatedMatFields), FccGlobalConstant.LENGTH_3);
      }
      this.setDefaulValueDraweeDetails();
      this.setValueToNull(['inputTextAreaMixPayment']);
      // this.resettingValidators('inputTextAreaMixPayment');
      this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
      this.addAmendLabelIcon(this.form.get('paymentDraftOptions'), this.form.controls);
    } else if (creditAvailBy && (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_DEFERRED)) {
      const fixedMaturityFields = ['fixedMaturityPaymentDate'];
      const calculatedMatFields = [ 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect'];
      const paymentDraftValue = (paymentDraftAt.value === FccBusinessConstantsService.PYMT_DRAFT_SIGHT ||
                                  paymentDraftAt.value === FccGlobalConstant.EMPTY_STRING) ?
                                 FccBusinessConstantsService.PYMT_DRAFT_MATURITYDATE : paymentDraftAt.value;
      const commonFields = ['draweeDetails', 'inputDraweeDetail'];
      this.resettingValidators(FccGlobalConstant.INPUT_DRAWEE_DETAIL);
      this.toggleControls(this.form, commonFields, false);
      paymentDraftAt[this.params][this.rendered] = true;
      this.form.get('inputTextAreaMixPayment')[this.params][this.rendered] = false;
      if (paymentDraftValue === FccBusinessConstantsService.PYMT_DRAFT_MATURITYDATE) {
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftValue,
          fixedMaturityFields.concat(['paymentDraftAt']), calculatedMatFields, FccGlobalConstant.LENGTH_2);
          this.fieldValidations(this.form,fixedMaturityFields);
      } else if (paymentDraftValue === FccBusinessConstantsService.PYMT_DRAFT_CALC_MATURITY_DATE) {
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftValue,
          calculatedMatFields.concat(['paymentDraftAt']), fixedMaturityFields, FccGlobalConstant.LENGTH_2);
          this.fieldValidations(this.form,calculatedMatFields);
      } else if (paymentDraftValue === FccBusinessConstantsService.PYMT_DRAFT_SIGHT) {
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftValue,
          ['paymentDraftAt'], fixedMaturityFields.concat(calculatedMatFields), FccGlobalConstant.LENGTH_2);
      }
      this.setValueToNull(['inputTextAreaMixPayment', FccTradeFieldConstants.DRAWEE_BANK_TYPE, FccTradeFieldConstants.DRAWEE_BANK_NAME]);
      this.resettingValidators('inputTextAreaMixPayment');
      this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
      this.addAmendLabelIcon(this.form.get('paymentDraftOptions'), this.form.controls);
      this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL).setValue('');
      this.removeAmendIcon(this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL), this.form.controls);
    } else if (creditAvailBy && (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_MIXED)) {
      const displayFields = ['inputTextAreaMixPayment'];
      const hideFields = ['draweeDetails', 'inputDraweeDetail', 'paymentDraftOptions', 'paymentDraftAt', 'fixedMaturityPaymentDate',
      'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther', FccTradeFieldConstants.DRAWEE_BANK_NAME];
      this.renderCreditAvailableDependentFields(paymentDraftAt, FccGlobalConstant.EMPTY_STRING,
                                                displayFields, hideFields, FccGlobalConstant.LENGTH_0);
      this.form.addFCCValidators('inputTextAreaMixPayment', Validators.compose([Validators.required]), 1);
      if (transamissionMode === FccBusinessConstantsService.SWIFT ||
         (transamissionMode[0] && transamissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
        this.form.addFCCValidators('inputTextAreaMixPayment', Validators.pattern(this.swiftXChar), 0);
        this.form.get('inputTextAreaMixPayment').updateValueAndValidity();
        }
      this.setMandatoryFields(this.form, displayFields, true);
      this.setValueToNull(['inputDraweeDetail', 'draweeBankName']);
      this.resettingValidators('inputDraweeDetail');
      this.renderSpaceForDraftOption(this.form.get('paymentDraftOptions'));
      this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL).setValue('');
      this.removeAmendIcon(this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL), this.form.controls);
    }
    this.removeMandatory(['fixedMaturityPaymentDate', 'inputTextAreaMixPayment']);
    this.warningMessageDisplay(this.form.get('creditAvailableOptions'));
    this.checkAmendForSelections(['fixedMaturityPaymentDate']);
  }

  protected renderCreditAvlAcceptanceFields(paymentDraftAt) {
    const fixedMaturityFields = ['fixedMaturityPaymentDate'];
    const calculatedMatFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect'];
    const paymentDraftValue = (paymentDraftAt.value === FccBusinessConstantsService.PYMT_DRAFT_SIGHT ||
                               paymentDraftAt.value === FccGlobalConstant.EMPTY_STRING) ?
      FccBusinessConstantsService.PYMT_DRAFT_MATURITYDATE : paymentDraftAt.value;
    const commonFields = ['draweeDetails', 'inputDraweeDetail'];
    this.toggleControls(this.form, commonFields, true);
    paymentDraftAt[this.params][this.rendered] = true;
    this.form.get('inputTextAreaMixPayment')[this.params][this.rendered] = false;
    if (paymentDraftValue === FccBusinessConstantsService.PYMT_DRAFT_MATURITYDATE) {
      this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftValue,
        fixedMaturityFields.concat(['paymentDraftAt']), calculatedMatFields, FccGlobalConstant.LENGTH_2);
        this.fieldValidations(this.form, fixedMaturityFields);
    } else if (paymentDraftValue === FccBusinessConstantsService.PYMT_DRAFT_CALC_MATURITY_DATE) {
      this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftValue,
        calculatedMatFields.concat(['paymentDraftAt']), fixedMaturityFields, FccGlobalConstant.LENGTH_2);
        this.fieldValidations(this.form,calculatedMatFields);
    } else if (paymentDraftValue === FccBusinessConstantsService.PYMT_DRAFT_SIGHT) {
      this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftValue,
        ['paymentDraftAt'], fixedMaturityFields.concat(calculatedMatFields), FccGlobalConstant.LENGTH_2);
    }
    this.setValueToNull(['inputTextAreaMixPayment']);
    this.resettingValidators('inputDraweeDetail');
    this.setMandatoryField(this.form, 'inputDraweeDetail', true);
    this.resettingValidators('inputTextAreaMixPayment');
    this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
    this.removeMandatory(['fixedMaturityPaymentDate']);
    this.setDefaulValueDraweeDetails();
  }

  setDefaulValueDraweeDetails() {
    if (this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE) && this.mode !== 'view' &&
    this.tnxTypeCode !== FccGlobalConstant.N002_AMEND &&
    !(this.commonService.isnonEMptyString(this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE).value))) {
      this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE).setValue(FccGlobalConstant.ISSUING_BANK_CODE);
      this.onClickInputDraweeDetail();
    }
    // this.addAmendLabelIcon(this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE), this.form.controls);
  }

  onClickPaymentDraftOptions() {
    const creditAvailBy = this.form.get('creditAvailableOptions');
    const paymentDraftAt = this.form.get('paymentDraftOptions');
    if (paymentDraftAt.value === FccBusinessConstantsService.PYMT_DRAFT_SIGHT) {
      if (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_PAYMENT) {
        const displayFields = ['paymentDraftOptions', 'paymentDraftAt'];
        const hideFields = ['draweeDetails', 'inputDraweeDetail', 'inputTextAreaMixPayment', 'fixedMaturityPaymentDate',
        'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftAt.value,
          displayFields, hideFields, FccGlobalConstant.LENGTH_1);
      } else if (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_NEGOTIATION) {
        const displayFields = ['paymentDraftOptions', 'paymentDraftAt', 'draweeDetails', 'inputDraweeDetail'];
        const hideFields = ['inputTextAreaMixPayment', 'fixedMaturityPaymentDate',
        'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
        paymentDraftAt[this.params][this.rendered] = true;
        this.form.get('inputTextAreaMixPayment')[this.params][this.rendered] = false;
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftAt.value,
          displayFields, hideFields, FccGlobalConstant.LENGTH_3);
        this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
        this.removeMandatory(['fixedMaturityPaymentDate']);
      }
    } else if (paymentDraftAt.value === FccBusinessConstantsService.PYMT_DRAFT_MATURITYDATE) {
      if (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_ACCEPTANCE) {
        const fixedMaturityFields = ['fixedMaturityPaymentDate'];
        const calculatedMatFields = [ 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
        const commonFields = ['draweeDetails', 'inputDraweeDetail'];
        this.setValueToNull(['fixedMaturityPaymentDate']);
        this.toggleControls(this.form, commonFields, true);
        paymentDraftAt[this.params][this.rendered] = true;
        this.form.get('inputTextAreaMixPayment')[this.params][this.rendered] = false;
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftAt.value,
          fixedMaturityFields, calculatedMatFields, FccGlobalConstant.LENGTH_2);
        this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
      } else if (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_NEGOTIATION) {
        const fixedMaturityFields = ['fixedMaturityPaymentDate'];
        const calculatedMatFields = [ 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
        const commonFields = ['draweeDetails', 'inputDraweeDetail'];
        this.setValueToNull(['fixedMaturityPaymentDate']);
        this.toggleControls(this.form, commonFields, true);
        paymentDraftAt[this.params][this.rendered] = true;
        this.form.get('inputTextAreaMixPayment')[this.params][this.rendered] = false;
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftAt.value,
              fixedMaturityFields, calculatedMatFields, FccGlobalConstant.LENGTH_3);
        this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
      } else if (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_DEFERRED) {
        const fixedMaturityFields = ['fixedMaturityPaymentDate'];
        const calculatedMatFields = [ 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
        const commonFields = ['draweeDetails', 'inputDraweeDetail'];
        this.setValueToNull(['fixedMaturityPaymentDate', 'inputDraweeDetail', 'draweeBankName']);
        this.toggleControls(this.form, commonFields, false);
        paymentDraftAt[this.params][this.rendered] = true;
        this.form.get('inputTextAreaMixPayment')[this.params][this.rendered] = false;
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftAt.value,
              fixedMaturityFields, calculatedMatFields, FccGlobalConstant.LENGTH_2);
        this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
        this.resettingValidators('inputDraweeDetail');

      }
    } else if (paymentDraftAt.value === FccBusinessConstantsService.PYMT_DRAFT_CALC_MATURITY_DATE) {
      if (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_ACCEPTANCE) {
        const fixedMaturityFields = ['fixedMaturityPaymentDate'];
        const calculatedMatFields = [ 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect'];
        const commonFields = ['draweeDetails', 'inputDraweeDetail'];
        this.setValueToNull(calculatedMatFields);
        this.toggleControls(this.form, commonFields, true);
        paymentDraftAt[this.params][this.rendered] = true;
        this.form.get('inputTextAreaMixPayment')[this.params][this.rendered] = false;
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftAt.value,
          calculatedMatFields, fixedMaturityFields, FccGlobalConstant.LENGTH_2);
        this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
        this.resettingValidators('inputDraweeDetail');
      } else if (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_NEGOTIATION) {
        const fixedMaturityFields = ['fixedMaturityPaymentDate'];
        const calculatedMatFields = [ 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect'];
        const commonFields = ['draweeDetails', 'inputDraweeDetail'];
        this.setValueToNull(['fixedMaturityPaymentDate']);
        this.toggleControls(this.form, commonFields, true);
        paymentDraftAt[this.params][this.rendered] = true;
        this.form.get('inputTextAreaMixPayment')[this.params][this.rendered] = false;
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftAt.value,
          calculatedMatFields, fixedMaturityFields, FccGlobalConstant.LENGTH_3);
          this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
          this.resettingValidators('inputDraweeDetail');

      } else if (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_DEFERRED) {
        const fixedMaturityFields = ['fixedMaturityPaymentDate'];
        const calculatedMatFields = [ 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect'];
        const commonFields = ['draweeDetails', 'inputDraweeDetail'];
        this.setValueToNull(['fixedMaturityPaymentDate', 'inputDraweeDetail', 'draweeBankName']);
        this.toggleControls(this.form, commonFields, false);
        paymentDraftAt[this.params][this.rendered] = true;
        this.form.get('inputTextAreaMixPayment')[this.params][this.rendered] = false;
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftAt.value,
          calculatedMatFields, fixedMaturityFields, FccGlobalConstant.LENGTH_2);
        this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
        this.resettingValidators('inputDraweeDetail');
      }
      this.form.addFCCValidators('inputValNum', Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_3),
        Validators.pattern('^[0-9]+$')]), 0);
      this.form.get('inputValNum').updateValueAndValidity();
    }
    this.removeMandatory(['fixedMaturityPaymentDate']);
  }
  protected renderCreditAvailableDependentFields(field: any, paymentDraftValue: string, displayFields: any,
                                                 hideFields: any, paymentDraftOptions: number) {
    this.toggleControls(this.form, displayFields, true);
    this.toggleControls(this.form, hideFields, false);
    this.setValueToNull(hideFields);
    hideFields.forEach(element => {
      this.resettingValidators(element);
    });
    this.setMandatoryFields(this.form, displayFields, true);
    this.patchFieldValueAndParameters(field, paymentDraftValue,
      { options: this.getPaymentDraftArray(paymentDraftOptions) });
    this.removeMandatory(displayFields);

  }

  // onFocusCreditAvailableOptions(event) {
  //   this.eventOnRadioButton();
  // }

  // eventOnRadioButton() {
  //   if (this.form.get('creditAvailableOptions').value === FccBusinessConstantsService.CREDIT_AVL_PAYMENT) {
  //     this.renderedFields = ['paymentDraftAt', 'paymentDraftOptions'];
  //     this.nonRenderedFields = ['draweeDetails', 'inputDraweeDetail', 'inputTextAreaMixPayment', 'fixedMaturityPaymentDate',
  //       'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
  //     this.toggleControls(this.form, this.renderedFields, true);
  //     this.toggleControls(this.form, this.nonRenderedFields, false);
  //     this.form.get('inputDraweeDetail').setValue(this.form.get('paymentDetailsBankEntity').value.shortName);
  //     this.patchFieldValueAndParameters(this.form.get('paymentDraftOptions'), '01',
  //     { options: this.getPaymentDraftArray(1) });
  //     this.resettingValidators('inputTextAreaMixPayment');
  //     this.resettingValidators('inputValNum');
  //     this.resettingValidators('inputDays');
  //     this.resettingValidators('inputFrom');
  //     this.resettingValidators('inputSelect');
  //     this.resettingValidators('inputSelectOther');
  //     this.resettingValidators('inputDraweeDetail');
  //     this.resettingValidators('fixedMaturityPaymentDate');
  //   }
  //   if (this.form.get('creditAvailableOptions').value === FccBusinessConstantsService.CREDIT_AVL_ACCEPTANCE) {
  //     this.nonRenderedFields = ['inputTextAreaMixPayment', 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect',
  //       'inputSelectOther'];
  //     this.renderedFields = ['draweeDetails', 'inputDraweeDetail', 'paymentDraftAt', 'fixedMaturityPaymentDate', 'paymentDraftOptions'];
  //     this.blankFields = ['fixedMaturityPaymentDate', 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
  //     this.toggleControls(this.form, this.renderedFields, true);
  //     this.toggleControls(this.form, this.nonRenderedFields, false);
  //     this.setValueToNull(this.blankFields);
  //     this.patchFieldValueAndParameters(this.form.get('paymentDraftOptions'), '02',
  //     { options: this.getPaymentDraftArray(FccGlobalConstant.LENGTH_2) });
  //     this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
  //     this.resettingValidators('inputTextAreaMixPayment');
  //     this.resettingValidators('inputValNum');
  //     this.resettingValidators('inputDays');
  //     this.resettingValidators('inputFrom');
  //     this.resettingValidators('inputSelect');
  //     this.resettingValidators('inputSelectOther');
  //     this.form.get('inputDraweeDetail').setValue(this.form.get('paymentDetailsBankEntity').value.shortName);
  //     this.renderSpaceForDraftOption(this.form.get('paymentDraftOptions'));
  //   }
  //   if (this.form.get('creditAvailableOptions').value === FccBusinessConstantsService.CREDIT_AVL_NEGOTIATION) {
  //     this.nonRenderedFields = ['inputTextAreaMixPayment', 'inputValNum', 'inputDays',
  //     'inputFrom', 'inputSelect', 'fixedMaturityPaymentDate',
  //       'inputSelectOther', 'draweeDetails', 'inputDraweeDetail'];
  //     this.renderedFields = ['paymentDraftAt', 'paymentDraftOptions'];
  //     this.blankFields = ['fixedMaturityPaymentDate', 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
  //     this.toggleControls(this.form, this.renderedFields, true);
  //     this.toggleControls(this.form, this.nonRenderedFields, false);
  //     this.setValueToNull(this.blankFields);
  //     this.patchFieldValueAndParameters(this.form.get('paymentDraftOptions'), '01',
  //    { options: this.getPaymentDraftArray(FccGlobalConstant.LENGTH_3) });
  //     this.form.get('inputDraweeDetail').setValue(this.form.get('paymentDetailsBankEntity').value.shortName);
  //     this.resettingValidators('inputTextAreaMixPayment');
  //     this.resettingValidators('inputValNum');
  //     this.resettingValidators('inputDays');
  //     this.resettingValidators('inputFrom');
  //     this.resettingValidators('inputSelect');
  //     this.resettingValidators('fixedMaturityPaymentDate');
  //     this.resettingValidators('inputSelectOther');
  //     }
  //   if (this.form.get('creditAvailableOptions').value === FccBusinessConstantsService.CREDIT_AVL_DEFERRED) {
  //     this.nonRenderedFields = ['inputTextAreaMixPayment',
  //       'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther', 'draweeDetails', 'inputDraweeDetail'];
  //     this.renderedFields = ['paymentDraftAt', 'fixedMaturityPaymentDate', 'paymentDraftOptions'];
  //     this.blankFields = ['fixedMaturityPaymentDate', 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
  //     this.toggleControls(this.form, this.renderedFields, true);
  //     this.toggleControls(this.form, this.nonRenderedFields, false);
  //     this.setValueToNull(this.blankFields);
  //     this.patchFieldValueAndParameters(this.form.get('paymentDraftOptions'), '02',
  //     { options: this.getPaymentDraftArray(FccGlobalConstant.LENGTH_2) });
  //     this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
  //     this.resettingValidators('inputTextAreaMixPayment');
  //     this.resettingValidators('inputValNum');
  //     this.resettingValidators('inputDays');
  //     this.resettingValidators('inputFrom');
  //     this.resettingValidators('inputSelect');
  //     this.resettingValidators('inputSelectOther');
  //     this.resettingValidators('inputDraweeDetail');
  //     this.form.get('inputDraweeDetail').setValue(this.form.get('paymentDetailsBankEntity').value.shortName);
  //     this.renderSpaceForDraftOption(this.form.get('paymentDraftOptions'));
  //   }
  //   if (this.form.get('creditAvailableOptions').value === FccBusinessConstantsService.CREDIT_AVL_MIXED) {
  //     this.renderedFields = ['inputTextAreaMixPayment'];
  //     this.nonRenderedFields = ['paymentDraftOptions', 'draweeDetails', 'inputDraweeDetail',
  //       'paymentDraftAt', 'fixedMaturityPaymentDate', 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect',
  //       'inputSelectOther'];
  //     this.toggleControls(this.form, this.renderedFields, true);
  //     this.toggleControls(this.form, this.nonRenderedFields, false);
  //     this.blankFields = ['inputTextAreaMixPayment'];
  //     this.setValueToNull(this.blankFields);
  //     this.form.addFCCValidators('inputTextAreaMixPayment', Validators.compose([Validators.required]), 1);
  //     this.setMandatoryField(this.form, 'inputTextAreaMixPayment', true);
  //     this.resettingValidators('inputValNum');
  //     this.resettingValidators('inputDays');
  //     this.resettingValidators('inputFrom');
  //     this.resettingValidators('inputSelect');
  //     this.resettingValidators('inputSelectOther');
  //     this.resettingValidators('inputDraweeDetail');
  //     this.resettingValidators('fixedMaturityPaymentDate');
  //     this.renderSpaceForDraftOption(this.form.get('paymentDraftOptions'));
  //   }
  //   this.removeMandatory(['fixedMaturityPaymentDate', 'inputTextAreaMixPayment']);
  //   this.warningMessageDisplay(this.form.get('creditAvailableOptions'));
  //   this.checkAmendForSelections(['fixedMaturityPaymentDate']);
  //   }
  fieldValidations(sectionForm, fieldNames: string[]) {
    this.addRequiredValidator(sectionForm,fieldNames);
    if(this.option === FccGlobalConstant.TEMPLATE){
      this.removeValidators(sectionForm,fieldNames);
    }

  }
 setCalulatedMaturityDetails() {
    this.nonRenderedFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
    this.toggleControls(this.form, this.nonRenderedFields, false);
  }
  setValueToNull(fieldName: any[]) {
    let index: any;
    for (index = 0; index < fieldName.length; index++) {
      if (this.form.controls[fieldName[index]]) {
        this.form.controls[fieldName[index]].setValue('');
      }
    }
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
      this.eventDataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
      this.eventDataArray.forEach((value) => {
      if (value.value === FccGlobalConstant.ISSUING_BANK_CODE || value.value === FccGlobalConstant.ANY_BANK_CODE
        || value.value === FccGlobalConstant.OTHER_BANK_CODE) {
        this.optionList.push(value);
      }
     });
    }
    return this.optionList;
  }

  resettingValidators(fieldvalue) {
    this.setMandatoryField(this.form, fieldvalue, false);
    this.form.get(fieldvalue).clearValidators();
    this.form.get(fieldvalue).updateValueAndValidity();
  }

  onClickPaymentDetailsBankEntity() {
    const bankDetails = this.stateService.getSectionData(FccGlobalConstant.BANK_DETAILS);
    this.mode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    const advisingBank = 'advisingBank';
    const adviseThrough = 'adviceThrough';
    const transamissionMode = this.mode;
    const pdApplicantName: any = 'paymentDetailsBankName';
    const bnkVal = this.stateService.getSectionData(FccGlobalConstant.BANK_DETAILS);
    if (this.form.get('paymentDetailsBankEntity').value === '02') {
      this.form.get('paymentDetailsBankName').setValue(this.advisingBankKeyed);
      this.form
  .get(FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR)
  .setValue(
    bankDetails.controls[advisingBank].get("advisingBankFirstAddress").value
  );

                   this.form
                   .get("paymentDetailsBankSecondAddress")
                   .setValue(
                     bankDetails.controls[advisingBank].get("advisingBankSecondAddress").value
                   );

                   this.form
                   .get("paymentDetailsBankThirdAddress")
                   .setValue(
                     bankDetails.controls[advisingBank].get("advisingBankThirdAddress").value
                   );

                      this.form
                      .get("paymentDetailsBankFourthAddress")
                      .setValue(
                        bankDetails.controls[advisingBank].get("advisingBankFourthAddress").value
                      );

      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.toggleControls(this.form, this.paymentDetailsBankAddrFields, false);
      if ( (this.mode[0].value !== null && this.mode[0].value !== undefined) && this.mode[0].value !== FccBusinessConstantsService.SWIFT) {
        this.toggleControls(this.form, ['paymentDetailsBankFourthAddress'], false);
      }
      this.form.controls[pdApplicantName].disable();
    }
    if (this.form.get('paymentDetailsBankEntity').value === '08') {
      this.form.get('paymentDetailsBankName').setValue(this.adviseThroughBankKeyed);
      this.form
      .get(FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR)
      .setValue(
        bankDetails.controls[adviseThrough].get("adviceThroughFirstAddress").value
      );

                   this.form
                   .get("paymentDetailsBankSecondAddress")
                   .setValue(
                     bankDetails.controls[adviseThrough].get("adviceThroughSecondAddress").value
                   );

                   this.form
                   .get("paymentDetailsBankThirdAddress")
                   .setValue(
                     bankDetails.controls[adviseThrough].get("adviceThroughThirdAddress").value
                   );

                      this.form
                      .get("paymentDetailsBankFourthAddress")
                      .setValue(
                        bankDetails.controls[adviseThrough].get("adviceThroughFourthAddress").value
                      );


      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.toggleControls(this.form, this.paymentDetailsBankAddrFields, false);
      if ( (this.mode[0].value !== null && this.mode[0].value !== undefined) && this.mode[0].value !== FccBusinessConstantsService.SWIFT) {
        this.toggleControls(this.form, ['paymentDetailsBankFourthAddress'], false);
      }
      this.form.controls[pdApplicantName].disable();
    }
    if (this.form.get('paymentDetailsBankEntity').value === '01') {
    const options = 'options';
    const bankDetail = bnkVal.get('issuingBank').get('bankNameList').value;
    const bnklist = bnkVal.get('issuingBank').get('bankNameList')[options];
    if (bnkVal !== undefined) {
        let bankNameVal = bnkVal.get('issuingBank').get('bankNameList').value;
        if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
          for(const i of this.multiBankService.getBankList()){
            if(i.value == bankDetail){
              bankNameVal= i.label;
            }
          }
        }
         else {
          if (bankDetail !== null) {
            if (this.nameOrAbbvName === 'abbv_name') {
              const exist = bnklist.filter(
                task => task.value === bankDetail);
              if (exist && exist !== undefined && exist.length > 0)
             { bankNameVal = exist[0].value; }
            } else{
              const exist = bnklist.filter(
                task => task.value === bankDetail);
              if (exist && exist !== undefined && exist.length > 0)
              {bankNameVal = exist[0].label; }
            }
          } else {
            bankNameVal = this.isueBnk;
          }
        }
        this.form.get('paymentDetailsBankName').setValue(bankNameVal);
        } else {
        this.form.get('paymentDetailsBankName').setValue('');
      }
    this.bankName = this.form.get('paymentDetailsBankName').value;
    this.nonRenderedFields = [FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR , 'paymentDetailsBankSecondAddress' ,
    'paymentDetailsBankThirdAddress', 'paymentDetailsBankFourthAddress'];
    this.toggleControls(this.form, this.nonRenderedFields, false);
    this.resettingValidators(FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR);
    this.resettingValidators('paymentDetailsBankSecondAddress');
    this.resettingValidators('paymentDetailsBankThirdAddress');
    this.resettingValidators('paymentDetailsBankFourthAddress');
    this.form.controls[pdApplicantName].disable();
    }
    if (this.form.get('paymentDetailsBankEntity').value === '03') {
      this.form.get('paymentDetailsBankName').setValue(this.anyBnk);
      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.nonRenderedFields = [FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR , 'paymentDetailsBankSecondAddress' ,
       'paymentDetailsBankThirdAddress', 'paymentDetailsBankFourthAddress'];
      this.toggleControls(this.form, this.nonRenderedFields, false);
      this.resettingValidators(FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR);
      this.resettingValidators('paymentDetailsBankSecondAddress');
      this.resettingValidators('paymentDetailsBankThirdAddress');
      this.resettingValidators('paymentDetailsBankFourthAddress');
      this.form.controls[pdApplicantName].disable();
    }
    if (this.form.get('paymentDetailsBankEntity').value === '99') {
      this.form.get('paymentDetailsBankName').setValue('');
      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.blankFields = [FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR, 'paymentDetailsBankSecondAddress',
      'paymentDetailsBankThirdAddress', 'paymentDetailsBankFourthAddress'];
      this.toggleControls(this.form, this.paymentDetailsBankAddrFields, true);
      if ( (this.mode[0].value !== null && this.mode[0].value !== undefined) && this.mode[0].value !== FccBusinessConstantsService.SWIFT) {
        this.toggleControls(this.form, ['paymentDetailsBankFourthAddress'], true);
      }
      this.setValueToNull(this.blankFields);
      this.form.controls[pdApplicantName].enable();
      this.form.controls[this.pdApplicantFirstAddress].enable();
      this.form.controls[this.pdApplicantSecondAddress].enable();
      this.form.controls[this.pdApplicantThirdAddress].enable();
      if ( (this.mode[0].value !== null && this.mode[0].value !== undefined) && this.mode[0].value !== FccBusinessConstantsService.SWIFT) {
        this.form.controls[this.pdApplicantFourthAddress].enable();
      }
      this.setMandatoryField(this.form, this.pdApplicantFirstAddress, true);
      this.form.get(this.pdBankName).clearValidators();
      this.form.get(this.pdApplicantFirstAddress).clearValidators();
      this.form.get(this.pdApplicantSecondAddress).clearValidators();
      this.form.get(this.pdApplicantThirdAddress).clearValidators();
      this.form.get(this.inputTextAreaMixPayment).clearValidators();
      if (transamissionMode === FccBusinessConstantsService.SWIFT ||
        (transamissionMode[0] && transamissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
        this.form.addFCCValidators(this.pdBankName, Validators.pattern(this.swiftXChar), 0);
        this.form.addFCCValidators(this.pdApplicantFirstAddress, Validators.pattern(this.swiftXChar), 0);
        this.form.addFCCValidators(this.pdApplicantSecondAddress, Validators.pattern(this.swiftXChar), 0);
        this.form.addFCCValidators(this.pdApplicantThirdAddress, Validators.pattern(this.swiftXChar), 0);
        this.form.addFCCValidators(this.inputTextAreaMixPayment, Validators.pattern(this.swiftXChar), 0);
        this.form.get('paymentDetailsBankName').updateValueAndValidity();
        this.form.get('paymentDetailsBankFirstAddress').updateValueAndValidity();
        this.form.get('paymentDetailsBankSecondAddress').updateValueAndValidity();
        this.form.get('paymentDetailsBankThirdAddress').updateValueAndValidity();
        this.form.get('inputTextAreaMixPayment').updateValueAndValidity();
      }
      this.form.addFCCValidators(this.pdApplicantFirstAddress,
        Validators.compose([Validators.required, Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      this.form.addFCCValidators(this.pdApplicantThirdAddress, Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      this.removeMandatory([this.pdApplicantFirstAddress]);
     }
    if (this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).value !== FccGlobalConstant.OTHER_BANK_CODE) {
      this.form.controls[pdApplicantName].disable();
     }
  }

  disableAddress() {
    this.form.controls[this.pdApplicantFirstAddress].disable();
    this.form.controls[this.pdApplicantSecondAddress].disable();
    this.form.controls[this.pdApplicantThirdAddress].disable();
    if (this.form.controls[this.pdApplicantFourthAddress]
      && (this.mode[0].value !== null && this.mode[0].value !== undefined) && this.mode[0].value !== FccBusinessConstantsService.SWIFT ) {
      this.form.controls[this.pdApplicantFourthAddress].disable();
      this.resettingValidators(this.pdApplicantFourthAddress);
    }
    this.resettingValidators(this.pdApplicantFirstAddress);
    this.resettingValidators(this.pdApplicantSecondAddress);
    this.resettingValidators(this.pdApplicantThirdAddress);
  }

  getDraweeList() {
    const elementId = FccTradeFieldConstants.DRAWEE_BANK_TYPE;
    this.productCode = FccGlobalConstant.PRODUCT_DEFAULT;
    this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    const draweeOptions = this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
        this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
        this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
      this.codeID = this.form.get(FccTradeFieldConstants.DRAWEE_BANK_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    }
    if (draweeOptions !== undefined && draweeOptions.length === 0) {
      this.draweeDataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
      this.draweeDataArray.forEach((value) => {
        if (value.value !== FccGlobalConstant.ADV_THRU_BANK_CODE && value.value !== FccGlobalConstant.ANY_BANK_CODE) {
            this.draweeList.push(value);
        }
     });
    } else if (draweeOptions !== undefined && draweeOptions.length !== 0) {
      this.draweeList = draweeOptions;
    }
    return this.draweeList;
  }

  onClickInputDraweeDetail() {
      const bankName = this.draweeList.filter(bankId =>
        bankId.value === this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL).value);
      if (bankName.length !== 0) {
        this.form.get(FccTradeFieldConstants.DRAWEE_BANK_NAME).setValue(bankName[0].label);
      }
      this.form.updateValueAndValidity();
  }
  getInputSelectList() {
    this.selectList = [
      { value: { label : 'AIR-WAYBILL' , shortName : this.translateService.instant('airwaybill') } ,
      label: this.translateService.instant('airwaybill') },
      { value: { label : 'ARRIVAL-OF-GOODS' , shortName : this.translateService.instant('arrivalOfgoods') } ,
      label: this.translateService.instant('arrivalOfgoods') },
      { value: { label : 'BILL-OF-EXCHANGE' , shortName : this.translateService.instant('billOfexchange') } ,
      label: this.translateService.instant('billOfexchange') },
      { value: { label : 'BILL-OF-LADING' , shortName : this.translateService.instant('billOflading') } ,
      label: this.translateService.instant('billOflading') },
      { value: { label : 'INVOICE' , shortName : this.translateService.instant('invoice') } ,
      label: this.translateService.instant('invoice') },
      { value: { label : 'SHIPMENT-DATE' , shortName : this.translateService.instant('shipmentdate') } ,
      label: this.translateService.instant('shipmentdate') },
      { value:  { label : 'SIGHT' , shortName : this.translateService.instant('paymentDraftOptions_01') } ,
       label: this.translateService.instant('paymentDraftOptions_01') },
      { value: { label : 'ARRIVAL-AND-INSPECTION-OF-GOODS' , shortName : this.translateService.instant('arrivalandinspectionofgoods') } ,
       label: this.translateService.instant('arrivalandinspectionofgoods') },
      { value:  { label : 'OTHER ' , shortName : this.translateService.instant('otherBank') } ,
      label: this.translateService.instant('otherBank') },
    ];
    return this.selectList;
  }
  getInputDays() {
    return this.inputDays;
  }
  getInputFrom() {
    return [
      { value: { label : 'FROM' , shortName : this.translateService.instant('from') }, label: this.translateService.instant('from') },
      { value: { label : 'AFTER' , shortName : this.translateService.instant('after') }, label: this.translateService.instant('after') },
    ];
  }
  onClickInputSelect() {
    const previewScreenToggleControls = [FccTradeFieldConstants.PAYMENT_INPUT_SELECT];
    if (this.form.get(FccTradeFieldConstants.PAYMENT_INPUT_SELECT).value === '99') {
      this.toggleControl(this.form, FccTradeFieldConstants.PAYMENT_INPUT_SELECT_OTHER, true);
      this.setMandatoryField(this.form, FccTradeFieldConstants.PAYMENT_INPUT_SELECT_OTHER, false);
      if (this.isPreview) {
        this.togglePreviewScreen(this.form, previewScreenToggleControls, false);
      }
    } else {
      this.toggleControl(this.form, FccTradeFieldConstants.PAYMENT_INPUT_SELECT_OTHER, false);
      this.resettingValidators(FccTradeFieldConstants.PAYMENT_INPUT_SELECT_OTHER);
      this.togglePreviewScreen(this.form, previewScreenToggleControls, true);
    }
    this.tenorOther();
    this.form.updateValueAndValidity();
    this.removeMandatory([FccTradeFieldConstants.PAYMENT_INPUT_SELECT_OTHER]);
    this.checkAmendForSelections([FccTradeFieldConstants.PAYMENT_INPUT_SELECT_OTHER]);
  }
  setFieldUnchecked(fieldName: any[]) {
    let index: number;
    for (index = 0; index < fieldName.length; index++) {
      this.form.get(fieldName[index])[this.params][this.icon] = '';
    }
  }
  saveFormObject() {
    this.stateService.setStateSection(FccGlobalConstant.PAYMENT_DETAILS, this.form);
  }
  getPaymentDraftArray(data): any {
    const layoutClass: any = 'layoutClass';
    const styleClass: any = 'styleClass';
    if (data === FccGlobalConstant.LENGTH_3) {
      const paymentArr = [
        { label: `${this.translateService.instant('paymentDraftOptions_01')}`, value: FccBusinessConstantsService.PYMT_DRAFT_SIGHT,
          icon: this.FA_FA_CHECK_CIRCLE },
        { label: `${this.translateService.instant('paymentDraftOptions_02')}`,
          value: FccBusinessConstantsService.PYMT_DRAFT_MATURITYDATE,
          icon : this.FA_FA_CHECK_CIRCLE },
        {
          label: `${this.translateService.instant('paymentDraftOptions_03')}`,
          value: FccBusinessConstantsService.PYMT_DRAFT_CALC_MATURITY_DATE,
          icon : 'fa fa-check-circle fa-2x'
        },
      ];
      this.form.get('paymentDraftOptions')[this.params][layoutClass] = 'p-grid p-col-11';
      this.form.get('paymentDraftOptions')[this.params][styleClass] = 'transmission';
      this.checkPreviousValuAmend(this.form.get('paymentDraftOptions') , paymentArr);
      return paymentArr;
    }
    if (data === FccGlobalConstant.LENGTH_2) {
      const paymentArr = [
        { label: `${this.translateService.instant('paymentDraftOptions_02')}`,
          value: FccBusinessConstantsService.PYMT_DRAFT_MATURITYDATE,
          icon: this.FA_FA_CHECK_CIRCLE },
        {
          label: `${this.translateService.instant('paymentDraftOptions_03')}`,
          value: FccBusinessConstantsService.PYMT_DRAFT_CALC_MATURITY_DATE,
          icon: 'fa fa-check-circle fa-2x'
        },
      ];
      this.form.get('paymentDraftOptions')[this.params][layoutClass] = 'p-grid p-col-7';
      this.form.get('paymentDraftOptions')[this.params][styleClass] = 'transmission-2';
      this.checkPreviousValuAmend(this.form.get('paymentDraftOptions') , paymentArr);
      return paymentArr;
    }
    if (data === 1) {
      const paymentArr = [
        { label: `${this.translateService.instant('paymentDraftOptions_01')}`, value: FccBusinessConstantsService.PYMT_DRAFT_SIGHT,
        icon: this.FA_FA_CHECK_CIRCLE }
      ];
      if (this.form !== undefined) {
        this.form.get('paymentDraftOptions')[this.params][layoutClass] = 'p-grid p-col-3';
        this.form.get('paymentDraftOptions')[this.params][styleClass] = 'transmission';
      }
      this.checkPreviousValuAmend(this.form.get('paymentDraftOptions') , paymentArr);
      return paymentArr;
    }
  }
  // onClickPaymentDraftOptions() {
  //    if (this.form.get('paymentDraftOptions').value === FccBusinessConstantsService.PYMT_DRAFT_SIGHT) {
  //     this.renderedFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'fixedMaturityPaymentDate',
  //   'draweeDetails', 'inputDraweeDetail'];
  //     this.toggleControls(this.form, this.renderedFields, false);
  //     this.resettingValidators('inputValNum');
  //     this.resettingValidators('inputDays');
  //     this.resettingValidators('inputFrom');
  //     this.resettingValidators('inputSelect');
  //     this.resettingValidators('inputSelectOther');
  //     this.resettingValidators('inputDraweeDetail');
  //    } else if (this.form.get('paymentDraftOptions').value === FccBusinessConstantsService.PYMT_DRAFT_MATURITYDATE) {
  //     this.renderedFields = ['fixedMaturityPaymentDate'];
  //     this.toggleControl(this.form, this.renderedFields, true);
  //     this.setCalulatedMaturityDetails();
  //     this.blankFields = ['fixedMaturityPaymentDate'];
  //     this.setValueToNull(this.blankFields);
  //     this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
  //     this.resettingValidators('inputValNum');
  //     this.resettingValidators('inputDays');
  //     this.resettingValidators('inputFrom');
  //     this.resettingValidators('inputSelect');
  //     this.resettingValidators('inputSelectOther');
  //     if (this.form.get('creditAvailableOptions').value === FccBusinessConstantsService.CREDIT_AVL_NEGOTIATION ||
  //     this.form.get('creditAvailableOptions').value === FccBusinessConstantsService.CREDIT_AVL_ACCEPTANCE) {
  //       this.toggleControl(this.form, 'draweeDetails', true);
  //       this.toggleControl(this.form, 'inputDraweeDetail', true);
  //     } else {
  //       this.toggleControl(this.form, 'draweeDetails', false);
  //       this.toggleControl(this.form, 'inputDraweeDetail', false);
  //     }
  //     this.form.get('inputDraweeDetail').setValue(this.form.get('paymentDetailsBankEntity').value.shortName);
  //     this.checkAmendForSelections(this.renderedFields);
  //     this.renderSpaceForDraftOption(this.form.get('paymentDraftOptions'));
  //   } else if (this.form.get('paymentDraftOptions').value === FccBusinessConstantsService.PYMT_DRAFT_CALC_MATURITY_DATE) {
  //     this.renderedFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect'];
  //     this.toggleControls(this.form, this.renderedFields, true);
  //     this.toggleControl(this.form, 'fixedMaturityPaymentDate', false);
  //     this.blankFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
  //     this.setValueToNull(this.blankFields);
  //     this.form.addFCCValidators('inputValNum', Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_3),
  //        Validators.pattern('^[0-9]+$')]), 0);
  //     this.mandatoryFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect'];
  //     this.setMandatoryFields(this.form, this.mandatoryFields, true);
  //     this.resettingValidators('fixedMaturityPaymentDate');
  //     if (this.form.get('creditAvailableOptions').value === FccBusinessConstantsService.CREDIT_AVL_NEGOTIATION ||
  //       this.form.get('creditAvailableOptions').value === FccBusinessConstantsService.CREDIT_AVL_ACCEPTANCE) {
  //       this.toggleControl(this.form, 'draweeDetails', true);
  //       this.toggleControl(this.form, 'inputDraweeDetail', true);
  //     } else {
  //       this.toggleControl(this.form, 'draweeDetails', false);
  //       this.toggleControl(this.form, 'inputDraweeDetail', false);
  //     }
  //     this.form.get('inputDraweeDetail').setValue(this.form.get('paymentDetailsBankEntity').value.shortName);
  //     this.checkAmendForSelections(this.renderedFields);
  //     this.renderSpaceForDraftOption(this.form.get('paymentDraftOptions'));
  //     }
  //    this.removeMandatory(['fixedMaturityPaymentDate', 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect']);
  // }
  onFocusPdApplicantSecondAddress() {
    const checkFirstLength = this.form.get(FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR).value
      .length;
    if (checkFirstLength === 0) {
      this.form.get(FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR).setValue('');
      this.form.controls.pdApplicantFirstAddress.markAsDirty();
    }
  }

  onFocusPdApplicantThirdAddress() {
    this.setMandatoryField(this.form, 'paymentDetailsBankSecondAddress', true);
    const checkFirstLength = this.form.get(FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR).value
      .length;
    const checkSecondLength = this.form.get('paymentDetailsBankSecondAddress').value
      .length;
    if (checkFirstLength === 0) {
      this.form.get(FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR).setValue('');
      this.form.controls.pdApplicantFirstAddress.markAsDirty();
    }
    if (checkSecondLength === 0) {
      this.form.get('paymentDetailsBankSecondAddress').setValue('');
      this.form.controls.pdApplicantSecondAddress.markAsDirty();
      this.form.get(this.pdApplicantSecondAddress).clearValidators();
      if (this.mode === FccBusinessConstantsService.SWIFT){
        this.form.addFCCValidators(this.pdApplicantSecondAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
      }
      this.form.addFCCValidators(this.pdApplicantSecondAddress, Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
    }
    if (checkFirstLength === 0 && checkSecondLength === 0) {
      this.form.get(FccTradeFieldConstants.PAYMENT_BANK_FIRST_ADDR).setValue('');
      this.form.controls.pdApplicantFirstAddress.markAsDirty();
      this.form.get('paymentDetailsBankSecondAddress').setValue('');
      this.form.controls.pdApplicantSecondAddress.markAsDirty();
    }
    this.removeMandatory(['paymentDetailsBankSecondAddress']);
  }

  onBlurPdApplicantThirdAddress() {
    const checkThirdLength = this.form.get('paymentDetailsBankThirdAddress').value
    .length;
    if (checkThirdLength === 0) {
      this.setMandatoryField(this.form, 'paymentDetailsBankSecondAddress', false);
    }
  }
  configureRegExForPaymentDetails() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.paymentDetailsNameRegex = response.PaymentDetailsNameRegex;
        this.paymentDetailsAddressRegex = response.BeneficiaryAddressRegex;
        this.paymentDetailsNameLength = response.PaymentDetailsNameLength;
        this.enquiryRegex = response.swiftXCharacterSet;
      }
    });
  }
  getAdvisingBnkDetails() {
      // Advising bank details change
      const bankDetails = this.stateService.getSectionData(FccGlobalConstant.BANK_DETAILS);
      const advisingBank = 'advisingBank';
      const adviseThrough = 'adviceThrough';
      this.advisingBankKeyed = bankDetails.controls[advisingBank]?.get('advisingBankName').value;
      this.advisingBankSwiftKeyed = bankDetails.controls[advisingBank]?.get('advisingswiftCode').value;
      this.adviseThroughBankKeyed = bankDetails.controls[adviseThrough]?.get('adviceThroughName').value;
      this.adviseThroughBankSwiftKeyed = bankDetails.controls[adviseThrough]?.get('advThroughswiftCode').value;
      this.advisingBankEntered = this.form.get(FccGlobalConstant.PAYMENT_DETAILS_BANK_NAME)?.value;
      let indexPositon = 1;
      if ((this.advisingBankSwiftKeyed !== '' && this.advisingBankSwiftKeyed !== null) ||
               (this.advisingBankKeyed !== '' && this.advisingBankKeyed !== null) ||
               (this.advisingBankEntered !== null && this.advisingBankEntered !== '' &&
               this.advisingBankEntered === FccGlobalConstant.ADVISING_BANK)) {
      this.optionList.splice(indexPositon, FccGlobalConstant.LENGTH_0,
        { label: this.advBnk , value: '02', id: 'paymentDeatilsBankEntity_02' });
      indexPositon++;
      // this.list = [
      //       { value: {label: this.isueBnk , shortName: this.isueBnk} , label: this.isueBnk},
      //       { value: {label: this.advBnk, shortName: this.advBnk }, label: this.advBnk },
      //       { value: {label: this.anyBnk , shortName: this.anyBnk }, label: this.anyBnk}
      //   ];
    }
      if ((this.adviseThroughBankSwiftKeyed !== '' && this.adviseThroughBankSwiftKeyed !== null) ||
                 (this.adviseThroughBankKeyed !== '' && this.adviseThroughBankKeyed !== null)) {
    // this.list = [
    //       { value: {label: this.isueBnk , shortName: this.isueBnk} , label: this.isueBnk},
    //       { value: {label: this.advBnk, shortName: this.advBnk }, label: this.advBnk },
    //       { value: {label: this.adviceThrough , shortName: this.adviceThrough }, label: FccGlobalConstant.ADVISETHRU},
    //       { value: {label: this.anyBnk , shortName: this.anyBnk }, label: this.anyBnk}
    //   ];
      this.optionList.splice(indexPositon, FccGlobalConstant.LENGTH_0,
        { label: this.adviceThrough , value: '08' , id: 'paymentDeatilsBankEntity_08' });
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
      // this.list.sort((a, b) => a.value.label < b.value.label ? -1 : a.value > b.value ? 1 : 0);
      this.patchFieldParameters(this.form.get('paymentDetailsBankEntity'), { options: this.optionList });
  }
  getPaymentContextReadonly() {
    if (this.context === 'readonly') {
      this.readOnlyMode();
    } else {
        const bankValue = this.form.get('paymentDetailsBankEntity').value;
        const bankNameValue = this.setBankName(bankValue);
        if (bankNameValue !== undefined && bankNameValue !== null) {
          const exist = this.optionList.filter(task => task.label === bankNameValue);
          if (exist.length > 0) {
           if ((task => task.label === bankNameValue)){ // eslint-disable-line no-constant-condition
            this.form.get('paymentDetailsBankEntity').setValue(this.form.get('paymentDetailsBankEntity').value);
            if(bankValue === '02'){
            this.form.get('paymentDetailsBankName').setValue(this.advisingBankKeyed);
            }else if(bankValue === '08'){
              this.form.get('paymentDetailsBankName').setValue(this.adviseThroughBankKeyed);
            }
          }
          }
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

  removeMandatory(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  warningMessageDisplay(control) {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && (control.value !== control.params.previousValue)) {
      this.form.get('creditAvailableOptions')[this.params][this.warning] =
      `${this.translateService.instant(this.paymentAmendwarningmessage)}`;
    } else {
      this.form.get('creditAvailableOptions')[this.params][this.warning] = '';
    }
  }
  checkPreviousValuAmend(control, data) {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      data.forEach(element => {
        if ((element.value === control.params.previousValue) || (element.value === control.params.previousCompareValue)) {
          this.patchFieldParameters(control, { infoIcon: false });
        }
      });
    }
  }
  checkAmendForSelections(selectedArr) {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      selectedArr.forEach(element => {
        const control = this.form.get(element);
        if ((control.value !== undefined && control.value !== '') &&
        this.form.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIOUSVALUE] &&
          control.value !== this.form.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIOUSVALUE]) {
            if (Object.prototype.toString.call(control.value) === FccGlobalConstant.OBJECT_DATE) {
              this.checkForDateField(control, element);
            } else {
              this.patchFieldParameters(control, { infoIcon: true });
            }
        } else {
          this.patchFieldParameters(control, { infoIcon: false });
        }
      });
    }
  }

  checkForDateField(control, element) {
    if (this.amendCommonService.convertToDateString(control.value) !==
      this.form.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIOUSVALUE]) {
      this.patchFieldParameters(control, { infoIcon: true });
    }
    else {
      this.patchFieldParameters(control, { infoIcon: false });
    }
  }

  renderSpaceForDraftOption(draftOption) {
    if (draftOption.value === FccBusinessConstantsService.PYMT_DRAFT_MATURITYDATE &&
      (this.form.get('creditAvailableOptions').value === 'negotiation' ||
      this.form.get('creditAvailableOptions').value === 'acceptance')) {
      this.toggleControl(this.form, 'fourSpace01', false);
      this.toggleControl(this.form, 'sixSpace01', false);
    } else {
      this.toggleControl(this.form, 'fourSpace01', true);
      this.toggleControl(this.form, 'sixSpace01', true);
    }
  }

  onKeyupInputTextAreaMixPayment(event: any) {
    const params = 'params';
    const maxRowCount = 'maxRowCount';
    const fieldSize = 'fieldSize';
    const control = this.form.get('inputTextAreaMixPayment');
    const maxrows = control[params][maxRowCount];
    const numberofcharRow = control[params][fieldSize];
    if (event.key === 'Enter' && (control.hasError('rowCountMoreThanAllowed') || (control.hasError('rowCountExceeded')))) {
       control.setErrors({ rowCountMoreThanAllowed: { maxRows: maxrows, charPerRow: numberofcharRow } });
    }
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LC, key);
  }

  onClickInputValNum()
  {
	const inpValNum = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'inputValNum', false);
    if (this.form.get(FccTradeFieldConstants.PAYMENT_INPUT_SELECT).value == '99' && inpValNum != null && inpValNum != ''){
      this.tenorOther();
    }
  }

  onClickInputDays()
  {
	const inpDays = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'inputDays', false);
    if (this.form.get(FccTradeFieldConstants.PAYMENT_INPUT_SELECT).value == '99' && inpDays != null && inpDays != ''){
      this.tenorOther();
    }
  }

  onClickInputFrom()
  {
	const inpFrom = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'inputFrom', false);
    if (this.form.get(FccTradeFieldConstants.PAYMENT_INPUT_SELECT).value == '99' && inpFrom != null && inpFrom != '' ){
      this.tenorOther();
    }
  }

  tenorOther()
  {
    this.transmissionmode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    if (this.form.get(FccTradeFieldConstants.PAYMENT_INPUT_SELECT).value == '99'
        && this.transmissionmode === FccBusinessConstantsService.SWIFT
        || (this.tnxTypeCode === FccGlobalConstant.N002_AMEND
        && this.transmissionmode && this.transmissionmode[0] && this.transmissionmode[0].value === FccBusinessConstantsService.SWIFT)) {
    const str1 = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'inputValNum', false).length;
    const str2 = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'inputDays', false).length;
    const str3 = this.stateService.getValue(FccGlobalConstant.PAYMENT_DETAILS, 'inputFrom', false).length;
    const str = str1 + str2 + str3 + 3;
    const maxLengthOther = FccGlobalConstant.SWIFT_CHAR_LENGTH - str;
    this.form.get('inputSelectOther').clearValidators();
    this.form.addFCCValidators('inputSelectOther', Validators.compose([Validators.maxLength(maxLengthOther)]), 0);
    this.patchFieldParameters(this.form.get('inputSelectOther'), { maxlength:maxLengthOther });
    this.form.updateValueAndValidity();
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

