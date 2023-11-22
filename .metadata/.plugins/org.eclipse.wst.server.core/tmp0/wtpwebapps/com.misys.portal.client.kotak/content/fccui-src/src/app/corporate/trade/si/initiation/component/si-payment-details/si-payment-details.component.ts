import { CodeDataService } from './../../../../../../common/services/code-data.service';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { LcTemplateService } from '../../../../../../common/services/lc-template.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../../common/services/session-validate-service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { AmendCommonService } from './../../../../../../corporate/common/services/amend-common.service';
import { LeftSectionService } from './../../../../../../corporate/common/services/leftSection.service';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { ImportLetterOfCreditResponse } from './../../../../../../corporate/trade/lc/initiation/model/models';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { LcReturnService } from './../../../../../../corporate/trade/lc/initiation/services/lc-return.service';
import { PrevNextService } from './../../../../../../corporate/trade/lc/initiation/services/prev-next.service';
import { UtilityService } from './../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';

@Component({
  selector: 'app-si-payment-details',
  templateUrl: './si-payment-details.component.html',
  styleUrls: ['./si-payment-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiPaymentDetailsComponent }]
})
export class SiPaymentDetailsComponent extends SiProductComponent implements OnInit, OnDestroy {
  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  module = `${this.translateService.instant('paymentDetailsModule')}`;
  paymentDetailsModule;
  formSubmitted = false;
  list: any;
  subheader = '';
  contextPath: any;
  paymentDetailsNameRegex;
  paymentDetailsAddressRegex;
  paymentDetailsNameLength;
  mode: any;
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
  isueBnk = this.translateService.instant('issuingBank');
  anyBnk = this.translateService.instant('anyBank');
  othBnk = this.translateService.instant('otherBank');
  adviceThrough = this.translateService.instant('adviceThrough');

  pdBankName: any = 'paymentDetailsBankName';
  pdApplicantFirstAddress: any = 'paymentDetailsBankFirstAddress';
  pdApplicantSecondAddress: any = 'paymentDetailsBankSecondAddress';
  pdApplicantThirdAddress: any = 'paymentDetailsBankThirdAddress';
  pdApplicantFourthAddress: any = 'paymentDetailsBankFourthAddress';
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
  draweeDetailsOptions = [];
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
  paymentEntity;
  codeID: any;
  productCode: any;
  subProductCode: any;
  eventDataArray: any;
  optionSIList = [];
  bnkName: string;
  bankValue: string;
  nameOrAbbvName: any;
  enteredCharCount = 'enteredCharCount';

  fieldNames = [];
  regexType: string;
  enquiryRegex;
  swiftZchar;
  transmissionMode: any;
  advisingBankResponse: any;
  swiftXChar: any;
  modeValue;
  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router, protected leftSectionService: LeftSectionService,
              protected lcReturnService: LcReturnService, protected stateService: ProductStateService,
              protected prevNextService: PrevNextService, protected lcTemplateService: LcTemplateService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected emitterService: EventEmitterService, protected amendCommonService: AmendCommonService,
              protected confirmationService: ConfirmationService, protected phrasesService: PhrasesService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected siProductService: SiProductService,
              protected codeDataService: CodeDataService, protected multiBankService: MultiBankService) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, siProductService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.transmissionMode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameOrAbbvName = response.TradeIssuingBankNameOrAbbvName;
        this.enquiryRegex = response.swiftZChar;
        this.swiftXChar = response.swiftXCharacterSet;
      }
    });
    this.isMasterRequired = this.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.mode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    this.productCode = this.commonService.getQueryParametersFromKey (FccGlobalConstant.PRODUCT);
    this.modeValue = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (this.mode !== null && this.mode !== undefined && this.mode !== '' && (typeof this.mode === 'object')) {
      this.mode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value[0].value;
    }
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    window.scroll(0, 0);
    this.initializeVariables();
    this.initializeFormGroup();

    this.configureRegExForPaymentDetails();
    this.getAdvisingBnkDetails();
    this.getPaymentContextReadonly();
    this.patchLayoutForReadOnlyMode();
    this.onClickCreditAvailableOptions();
    this.onClickInputSelect();
    this.updateNarrativeCount();

    this.form.get(FccGlobalConstant.PAYMENT_DETAILS_BANK_NAME).clearValidators();
    this.fieldNames = [FccGlobalConstant.PAYMENT_DETAILS_BANK_NAME];

    this.form.get('inputTextAreaMixPayment').clearValidators();
    this.form.get('inputTextAreaMixPayment').updateValueAndValidity();
    if (this.modeValue === FccGlobalConstant.DRAFT_OPTION ) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
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
    this.optionSIList = [];
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
    } else if (this.form.get('paymentDraftOptions').value === '03') {
      this.renderedFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'draweeDetails', 'inputDraweeDetail'];
      this.toggleControls(this.form, this.renderedFields, true);
      this.toggleControl(this.form, 'fixedMaturityPaymentDate', false);
      this.form.addFCCValidators('inputValNum', Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_3),
         Validators.pattern('^[0-9]+$')]), 0);
      this.mandatoryFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect'];
      this.setMandatoryFields(this.form, this.mandatoryFields, true);
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
    const paymentDetailsBankEntity = this.stateService.getValue(FccGlobalConstant.SI_PAYMENT_DETAILS, 'paymentDetailsBankEntity', false);
    const fixedMaturityPaymentDate = this.stateService.getValue(FccGlobalConstant.SI_PAYMENT_DETAILS, 'fixedMaturityPaymentDate', false);
    const inputValNum = this.stateService.getValue(FccGlobalConstant.SI_PAYMENT_DETAILS, 'inputValNum', false);
    const inputDays = this.stateService.getValue(FccGlobalConstant.SI_PAYMENT_DETAILS, 'inputDays', false);
    const inputFrom = this.stateService.getValue(FccGlobalConstant.SI_PAYMENT_DETAILS, 'inputFrom', false);
    const inputSelect = this.stateService.getValue(FccGlobalConstant.SI_PAYMENT_DETAILS, 'inputSelect', false);
    const inputTextAreaMixPayment = this.stateService.getValue(FccGlobalConstant.SI_PAYMENT_DETAILS, 'inputTextAreaMixPayment', false);
    let paymentDraftWidgetData;
    if (inputValNum !== '' || inputDays !== '' || inputFrom !== '' || inputSelect !== '') {
      paymentDraftWidgetData = '3';
    } else if (fixedMaturityPaymentDate !== '') {
      paymentDraftWidgetData = '2';
    } else if (inputTextAreaMixPayment !== '' && inputTextAreaMixPayment !== this.translateService.instant('paymentDraftOptions_01')) {
      paymentDraftWidgetData = '';
      this.form.get('paymentDraftOptions').setValue('');
      this.form.get('creditAvailableOptions').setValue(FccBusinessConstantsService.CREDIT_AVL_MIXED);
    } else {
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
    const exist = this.optionSIList.filter(
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
      const paymentDetailsEntityName = this.stateService.getValue(FccGlobalConstant.SI_PAYMENT_DETAILS,
        FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY, true);
      if (this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).value) &&
      this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).value !== FccGlobalConstant.EMPTY_STRING &&
      (paymentDetailsEntityName === null || paymentDetailsEntityName === undefined ||
        paymentDetailsEntityName === FccGlobalConstant.EMPTY_STRING)) {
        this.stateService.setValue(FccGlobalConstant.SI_PAYMENT_DETAILS, FccGlobalConstant.INPUT_DRAWEE_DETAIL,
          this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).value, true);
      }
    }
    this.form.updateValueAndValidity();
  }

  readOnlyMode() {
    this.lcReturnService.allLcRecords.subscribe(data => {
      this.lcResponseForm = data;

      // Credit Available With

      const exist = this.optionSIList.filter(
        task => task.value.label === this.lcResponseForm.paymentDetails.creditAvailableWith);
      if (exist.length > 0) {
        this.form.get('paymentDetailsBankEntity').setValue(this.optionSIList.filter(
          task => task.value.label === this.lcResponseForm.paymentDetails.creditAvailableWith)[0].value);
      }
      this.patchFieldParameters(this.form.get('paymentDetailsBankEntity'), { readonly: true });


      this.form.get('paymentDetailsBankName').patchValue(this.lcResponseForm.paymentDetails.bankName);
      this.patchFieldParameters(this.form.get('paymentDetailsBankName'), { readonly: true });
      this.form.get('paymentDetailsBankFirstAddress').patchValue(this.lcResponseForm.paymentDetails.address.line1);
      this.patchFieldParameters(this.form.get('paymentDetailsBankFirstAddress'), { readonly: true });
      this.form.get('paymentDetailsBankSecondAddress').patchValue(this.lcResponseForm.paymentDetails.address.line2);
      this.patchFieldParameters(this.form.get('paymentDetailsBankSecondAddress'), { readonly: true });
      this.form.get('paymentDetailsBankThirdAddress').patchValue(this.lcResponseForm.paymentDetails.address.line3);
      this.patchFieldParameters(this.form.get('paymentDetailsBankThirdAddress'), { readonly: true });
      this.patchFieldParameters(this.form.get('paymentDetailsBankFourthAddress'), { rendered: false });
      if (this.commonService.isNonEmptyValue(this.mode) && this.mode !== FccBusinessConstantsService.SWIFT) {
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

      this.form.get('inputDraweeDetail').patchValue(this.inputDraweeDetails);
      this.patchFieldParameters(this.form.get('inputDraweeDetail'), { readonly: false });

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
    this.stateService.setStateSection(FccGlobalConstant.SI_PAYMENT_DETAILS, this.form, this.isMasterRequired);
    this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = [];
    this.optionSIList = [];
    this.draweeDetailsOptions = [];
  }

  amendFormFields() {
  this.patchFieldParameters(this.form.get('paymentDetailsBankcountry'), { rendered: false });
  this.updateAmendValues();
  const sectionName = FccGlobalConstant.SI_PAYMENT_DETAILS;
  this.amendCommonService.setValueFromMasterToPrevious(sectionName);
  }

  initializeFormGroup() {
    const pdApplicantName: any = 'paymentDetailsBankName';
    // this.formModelService.getFormModel('LC').subscribe(formModelJson => {
    const sectionName = FccGlobalConstant.SI_PAYMENT_DETAILS;
    this.form = this.stateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    const paymentDetailsEntity = this.form.get('paymentDetailsBankEntity');
    if (paymentDetailsEntity && paymentDetailsEntity.value === this.adviceThrough) {
      paymentDetailsEntity.setValue('08');
    }else if (paymentDetailsEntity && paymentDetailsEntity.value === this.anyBnk) {
      paymentDetailsEntity.setValue('03');
    }else if (paymentDetailsEntity && paymentDetailsEntity.value === this.advBnk) {
      paymentDetailsEntity.setValue('02');
    }else if (paymentDetailsEntity && paymentDetailsEntity.value === this.isueBnk) {
      paymentDetailsEntity.setValue('01');
    }
    this.patchFieldParameters(this.form.get('paymentDetailsBankEntity'), { options: this.getList() });
    this.patchFieldParameters(this.form.get('paymentDetailsBankFullAddress'), { rendered: false });
    if (this.form.get('paymentDetailsBankEntity') && this.form.get('paymentDetailsBankEntity').value === '99') {
      if ( (this.mode !== null && this.mode !== undefined) && this.mode !== FccBusinessConstantsService.SWIFT) {
      this.patchFieldParameters(this.form.get('paymentDetailsBankFourthAddress'), { rendered: true });
    }
    } else {
      this.toggleControls(this.form, ['paymentDetailsBankFourthAddress'], false);
    }
    this.patchFieldParameters(this.form.get('inputDraweeDetail'), { options: this.getDraweeList() });
    this.disableAddress();
    this.paymentEntity = this.stateService.getValue(FccGlobalConstant.SI_PAYMENT_DETAILS,
                        FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY, false);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
    this.onClickPaymentDetailsBankEntity();
    this.onClickInputDraweeDetail();
    if (this.form.get('paymentDetailsBankEntity') &&
    this.form.get('paymentDetailsBankEntity').value === FccGlobalConstant.OTHER_BANK_CODE) {
      this.form.controls[pdApplicantName].enable();
    } else {
      this.form.controls[pdApplicantName].disable();
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.removeMandatory([FccTradeFieldConstants.PAYMENT_DETAILS_BANK_ENTITY]);
      this.form.get(FccTradeFieldConstants.PAYMENT_DETAILS_BANK_ENTITY).clearValidators();
      this.form.get(FccTradeFieldConstants.PAYMENT_DETAILS_BANK_ENTITY).updateValueAndValidity();
    }
  // });
  }
  onClickCreditAvailableOptions() {
    const creditAvailBy = this.form.get('creditAvailableOptions');
    const paymentDraftAt = this.form.get('paymentDraftOptions');
    const transmissionMode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    if (creditAvailBy && (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_PAYMENT)) {
      const displayFields = ['paymentDraftOptions', 'paymentDraftAt'];
      const hideFields = ['draweeDetails', 'inputDraweeDetail', 'inputTextAreaMixPayment', 'fixedMaturityPaymentDate',
      'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
      this.renderCreditAvailableDependentFields(paymentDraftAt, FccBusinessConstantsService.PYMT_DRAFT_SIGHT,
                                                displayFields, hideFields, FccGlobalConstant.LENGTH_1);
      this.setValueToNull(['inputDraweeDetail', 'inputDraweeDetailName']);
      this.removeMandatory(['inputDraweeDetail']);
      this.addAmendLabelIcon(this.form.get('paymentDraftOptions'), this.form.controls);
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
      this.resettingValidators('inputDraweeDetail');
      this.setMandatoryField(this.form, 'inputDraweeDetail', true);
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
      this.resettingValidators('inputDraweeDetail');
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
      this.setValueToNull(['inputTextAreaMixPayment', 'inputDraweeDetail', 'inputDraweeDetailName']);
      this.resettingValidators('inputTextAreaMixPayment');
      this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
      this.addAmendLabelIcon(this.form.get('paymentDraftOptions'), this.form.controls);
    } else if (creditAvailBy && (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_MIXED)) {
      const displayFields = ['inputTextAreaMixPayment'];
      const hideFields = ['draweeDetails', 'inputDraweeDetail', 'paymentDraftOptions', 'paymentDraftAt', 'fixedMaturityPaymentDate',
      'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
      this.renderCreditAvailableDependentFields(paymentDraftAt, FccGlobalConstant.EMPTY_STRING,
                                                displayFields, hideFields, FccGlobalConstant.LENGTH_0);
      this.form.addFCCValidators('inputTextAreaMixPayment', Validators.compose([Validators.required]), 1);
      if (transmissionMode === FccBusinessConstantsService.SWIFT ||
        (transmissionMode[0] && transmissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
        this.form.addFCCValidators('inputTextAreaMixPayment', Validators.pattern(this.swiftXChar), 0);
        this.form.get('inputTextAreaMixPayment').updateValueAndValidity();
      }
      this.setValueToNull(['inputDraweeDetail', 'inputDraweeDetailName']);
      this.resettingValidators('inputDraweeDetail');
      this.setMandatoryFields(this.form, displayFields, true);
      this.renderSpaceForDraftOption(this.form.get('paymentDraftOptions'));
    } else if (creditAvailBy && (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_DEMAND)) {
      const displayFields = [ ];
      const hideFields = ['draweeDetails', 'inputDraweeDetail', 'paymentDraftOptions', 'paymentDraftAt', 'fixedMaturityPaymentDate',
      'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther', 'inputTextAreaMixPayment'];
      this.renderCreditAvailableDependentFields(FccGlobalConstant.EMPTY_STRING, FccGlobalConstant.EMPTY_STRING,
                                                displayFields, hideFields, FccGlobalConstant.LENGTH_0);
      this.setValueToNull(['inputDraweeDetail', 'inputDraweeDetailName']);
      this.resettingValidators('inputDraweeDetail');
      this.renderSpaceForDraftOption(this.form.get('paymentDraftOptions'));
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
        this.fieldValidations(this.form,fixedMaturityFields);
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
    if (this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL) &&
    !(this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL).value))) {
      this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL).setValue(FccGlobalConstant.ISSUING_BANK_CODE);
      this.onClickInputDraweeDetail();
    }
    this.addAmendLabelIcon(this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL), this.form.controls);
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
        this.resettingValidators('inputDraweeDetail');
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
        this.resettingValidators('inputDraweeDetail');
        this.setMandatoryField(this.form, 'inputDraweeDetail', true);
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
        this.resettingValidators('inputDraweeDetail');
        this.setMandatoryField(this.form, 'inputDraweeDetail', true);
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
        this.resettingValidators('inputDraweeDetail');
        this.setMandatoryField(this.form, 'inputDraweeDetail', true);
      } else if (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_DEFERRED) {
        const fixedMaturityFields = ['fixedMaturityPaymentDate'];
        const calculatedMatFields = [ 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther'];
        const commonFields = ['draweeDetails', 'inputDraweeDetail'];
        this.setValueToNull(['fixedMaturityPaymentDate', 'inputDraweeDetail', 'inputDraweeDetailName']);
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
        this.setValueToNull(['inputDraweeDetail', 'inputDraweeDetailName']);
        this.toggleControls(this.form, commonFields, true);
        paymentDraftAt[this.params][this.rendered] = true;
        this.form.get('inputTextAreaMixPayment')[this.params][this.rendered] = false;
        this.renderCreditAvailableDependentFields(paymentDraftAt, paymentDraftAt.value,
          calculatedMatFields, fixedMaturityFields, FccGlobalConstant.LENGTH_2);
        this.setMandatoryField(this.form, 'fixedMaturityPaymentDate', true);
        this.resettingValidators('inputDraweeDetail');
        this.setMandatoryField(this.form, 'inputDraweeDetail', true);
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
        this.setMandatoryField(this.form, 'inputDraweeDetail', true);
      } else if (creditAvailBy.value === FccBusinessConstantsService.CREDIT_AVL_DEFERRED) {
        const fixedMaturityFields = ['fixedMaturityPaymentDate'];
        const calculatedMatFields = [ 'inputValNum', 'inputDays', 'inputFrom', 'inputSelect'];
        const commonFields = ['draweeDetails', 'inputDraweeDetail'];
        this.setValueToNull(['fixedMaturityPaymentDate', 'inputDraweeDetail', 'inputDraweeDetailName']);
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
    if (displayFields.length > FccGlobalConstant.LENGTH_0) {
      this.toggleControls(this.form, displayFields, true);
      this.setMandatoryFields(this.form, displayFields, true);
      this.removeMandatory(displayFields);
    }
    this.toggleControls(this.form, hideFields, false);
    this.setValueToNull(hideFields);
    hideFields.forEach(element => {
      this.resettingValidators(element);
    });
    if (paymentDraftOptions > FccGlobalConstant.LENGTH_0) {
    this.patchFieldValueAndParameters(field, paymentDraftValue,
      { options: this.getPaymentDraftArray(paymentDraftOptions) });
    }
    this.setDefaulValueDraweeDetails();
  }
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
      this.form.controls[fieldName[index]].setValue('');
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
    if ((elementValue !== undefined && elementValue.length === 0) ||
          (this.optionSIList != null && this.optionSIList.length === 0)) {
      this.eventDataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
      this.eventDataArray.forEach((value) => {
          if ((value.value === FccGlobalConstant.ISSUING_BANK_CODE || value.value === FccGlobalConstant.ANY_BANK_CODE
          || value.value === FccGlobalConstant.OTHER_BANK_CODE)) {
            this.optionSIList.push(value);
        }
     });
    }
    return this.optionSIList;
  }

  getDraweeList() {
    const elementId = FccGlobalConstant.INPUT_DRAWEE_DETAIL;
    let codeIdDataArray: any;
    this.productCode = FccGlobalConstant.PRODUCT_DEFAULT;
    this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    const elementValue = this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);

    if (this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
        this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
        this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
      this.codeID = this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    }
    if ((elementValue != null && elementValue.length === 0) ||
        (this.draweeDetailsOptions != null && this.draweeDetailsOptions.length === 0)) {
      codeIdDataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
      codeIdDataArray.forEach((value) => {
        if ((value.value !== FccGlobalConstant.ADV_THRU_BANK_CODE && value.value !== FccGlobalConstant.ANY_BANK_CODE)) {
          this.draweeDetailsOptions.push(value);
        }
     });
    }
    return this.draweeDetailsOptions;
  }

  resettingValidators(fieldvalue) {
    this.setMandatoryField(this.form, fieldvalue, false);
    this.form.get(fieldvalue).clearValidators();
    this.form.get(fieldvalue).updateValueAndValidity();
  }


  onClickPaymentDetailsBankEntity() {
    const bankDetails = this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS);
    const advisingBank = 'siAdvisingBank';
    const adviseThrough = 'siAdviseThroughBank';
    const pdApplicantName: any = 'paymentDetailsBankName';
    const bnkVal = this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS);
    if (this.form.get('paymentDetailsBankEntity').value === '02') {
      this.form.get('paymentDetailsBankName').setValue(bankDetails.controls[advisingBank].get('advisingBankName').value);
      this.form.get('paymentDetailsBankFirstAddress').setValue(bankDetails.controls[advisingBank].get('advisingBankFirstAddress').value);
      this.form.get('paymentDetailsBankSecondAddress').setValue(bankDetails.controls[advisingBank].get('advisingBankSecondAddress').value);
      this.form.get('paymentDetailsBankThirdAddress').setValue(bankDetails.controls[advisingBank].get('advisingBankThirdAddress').value);
      this.form.get('paymentDetailsBankFourthAddress').setValue(bankDetails.controls[advisingBank].get('advisingBankFourthAddress').value);
      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.renderedFields = ['paymentDetailsBankFirstAddress' , 'paymentDetailsBankSecondAddress' , 'paymentDetailsBankThirdAddress'];
      this.toggleControls(this.form, this.renderedFields, true);
      if ( this.commonService.isNonEmptyValue(this.mode) && this.mode !== FccBusinessConstantsService.SWIFT) {
        this.toggleControls(this.form, ['paymentDetailsBankFourthAddress'], true);
      }
      this.disableAddress();
      this.form.controls[pdApplicantName].disable();
    }
    if (this.form.get('paymentDetailsBankEntity').value === '08') {
      this.form.get('paymentDetailsBankName').setValue(bankDetails.controls[adviseThrough].get('adviceThroughName').value);
      this.form.get('paymentDetailsBankFirstAddress').setValue(bankDetails.controls[adviseThrough].get(
        'adviceThroughFirstAddress').value);
      this.form.get('paymentDetailsBankSecondAddress').setValue(bankDetails.controls[adviseThrough].get(
        'adviceThroughSecondAddress').value);
      this.form.get('paymentDetailsBankThirdAddress').setValue(bankDetails.controls[adviseThrough].get(
        'adviceThroughThirdAddress').value);
      this.form.get('paymentDetailsBankFourthAddress').setValue(bankDetails.controls[adviseThrough].get(
        'adviceThroughFourthAddress').value);
      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.renderedFields = ['paymentDetailsBankFirstAddress' , 'paymentDetailsBankSecondAddress' , 'paymentDetailsBankThirdAddress'];
      this.toggleControls(this.form, this.renderedFields, true);
      if (this.commonService.isNonEmptyValue(this.mode) && this.mode !== FccBusinessConstantsService.SWIFT) {
        this.toggleControls(this.form, ['paymentDetailsBankFourthAddress'], true);
      }
      this.disableAddress();
      this.form.controls[pdApplicantName].disable();
    }
    if (this.form.get('paymentDetailsBankEntity').value === FccGlobalConstant.OTHER_BANK_CODE) {
      if (!this.commonService.isNonEmptyValue(this.form.get('paymentDetailsBankFirstAddress').value)) {
        this.form.get(FccGlobalConstant.PAYMENT_DETAILS_BANK_NAME).setValue(this.othBnk);
      }
      this.form.controls[pdApplicantName].enable();
    }
    this.handleIssuingBankDetails(bnkVal, pdApplicantName);
    this.handleAnyBankDetails(pdApplicantName);
    this.handleOtherBankDetails(pdApplicantName);
    if (this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).value !== FccGlobalConstant.OTHER_BANK_CODE) {
      this.form.controls[pdApplicantName].disable();
    }
  }
  onClickInputDraweeDetail() {
    const bankName = this.draweeDetailsOptions.filter(bankId =>
    bankId.value === this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL).value);
    if (bankName.length !== 0) {
      this.form.get(FccGlobalConstant.INPUT_DRAWEE_DETAIL_NAME).setValue(bankName[0].label);
    }
    this.form.updateValueAndValidity();
  }

  protected handleIssuingBankDetails(bnkVal: FCCFormGroup, pdApplicantName: any) {
    if (this.form.get('paymentDetailsBankEntity').value === FccGlobalConstant.ISSUING_BANK_CODE) {
      const options = 'options' ;
      const bankDetail = bnkVal.get('siIssuingBank').get('bankNameList').value;
      const bnklist = bnkVal.get('siIssuingBank').get('bankNameList')[options];
      if (bnkVal !== undefined) {
        let bankNameVal;
        if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {

          for(const i of this.multiBankService.getBankList()){
            if(i.value == bankDetail){
              bankNameVal= i.label;
            }
          }
        } else {
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
        if (bankNameVal && bankNameVal !== null) {
          this.form.get('paymentDetailsBankName').setValue(bankNameVal);
        }
      } else {
        this.form.get('paymentDetailsBankName').setValue('');
      }
      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.nonRenderedFields = ['paymentDetailsBankFirstAddress', 'paymentDetailsBankSecondAddress', 'paymentDetailsBankThirdAddress',
        'paymentDetailsBankFourthAddress'];
      this.toggleControls(this.form, this.nonRenderedFields, false);
      this.resettingValidators('paymentDetailsBankFirstAddress');
      this.resettingValidators('paymentDetailsBankSecondAddress');
      this.resettingValidators('paymentDetailsBankThirdAddress');
      this.resettingValidators('paymentDetailsBankFourthAddress');
      this.form.controls[pdApplicantName].disable();
    }
  }

  protected handleOtherBankDetails(pdApplicantName: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transmissionMode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    if (this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).value === FccGlobalConstant.OTHER_BANK_CODE) {
      if (this.commonService.isNonEmptyField(FccGlobalConstant.PAYMENT_DETAILS_BANK_NAME, this.form) &&
       !this.form.get(FccGlobalConstant.PAYMENT_DETAILS_BANK_NAME).value) {
        this.form.get(FccGlobalConstant.PAYMENT_DETAILS_BANK_NAME).setValue(this.form.get(
          FccGlobalConstant.PAYMENT_BANK_DETAILS_ENTITY).value);
      }
      this.renderedFields = ['paymentDetailsBankFirstAddress', 'paymentDetailsBankSecondAddress', 'paymentDetailsBankThirdAddress'];
      this.toggleControls(this.form, this.renderedFields, true);
      this.bankName = this.form.get('paymentDetailsBankName').value;
      if (this.form.get('paymentDetailsBankEntity').value === FccGlobalConstant.OTHER_BANK_CODE &&
      !this.commonService.isNonEmptyValue(this.form.get('paymentDetailsBankFirstAddress').value)) {
        this.form.get(FccGlobalConstant.PAYMENT_DETAILS_BANK_NAME).setValue(this.othBnk);
        this.form.controls[pdApplicantName].enable();
      }

      this.blankFields = ['paymentDetailsBankFirstAddress', 'paymentDetailsBankSecondAddress', 'paymentDetailsBankThirdAddress',
        'paymentDetailsBankFourthAddress'];
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND && this.bankName !== this.paymentEntity &&
        !this.form.get(FccGlobalConstant.PAYMENT_BANK_DETAILS_FIRST_ADDRESS).value) {
      this.setValueToNull(this.blankFields);
      }
      this.form.controls[pdApplicantName].enable();
      this.form.controls[this.pdApplicantFirstAddress].enable();
      this.form.controls[this.pdApplicantSecondAddress].enable();
      this.form.controls[this.pdApplicantThirdAddress].enable();
      this.mode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
      if ((this.mode !== null && this.mode !== undefined) && this.mode !== FccBusinessConstantsService.SWIFT) {
        this.patchFieldParameters(this.form.get(this.pdApplicantFourthAddress), { rendered: true });
        this.form.controls[this.pdApplicantFourthAddress].enable();
      }
      this.setMandatoryField(this.form, this.pdApplicantFirstAddress, true);
      this.form.get(this.pdApplicantFirstAddress).clearValidators();
      this.form.get(this.pdApplicantThirdAddress).clearValidators();
      const transmissionMode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
      if (transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(this.pdApplicantFirstAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
        this.form.addFCCValidators(this.pdApplicantSecondAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
        this.form.addFCCValidators(this.pdApplicantThirdAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
        this.fieldNames.forEach(ele => {
          this.form.get(ele).clearValidators();
           this.regexType = this.form.get(ele)[FccGlobalConstant.PARAMS]['applicableValidation'][0]['characterValidation'];
          if (this.regexType === FccGlobalConstant.SWIFT_X) {
            this.regexType = this.swiftXChar;
          } else if (this.regexType === FccGlobalConstant.SWIFT_Z) {
            this.regexType = this.enquiryRegex;
          }
          if (this.commonService.validateProduct(this.form, ele, this.productCode)) {
            this.form.addFCCValidators(ele, Validators.pattern(this.regexType), 0);
            }
        });
      }
      this.form.addFCCValidators(this.pdApplicantFirstAddress,
        Validators.compose([Validators.required, Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      this.form.addFCCValidators(this.pdApplicantThirdAddress, Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
      this.removeMandatory([this.pdApplicantFirstAddress]);
    }
    this.form.updateValueAndValidity();
  }

  protected handleAnyBankDetails(pdApplicantName: any) {
    if (this.form.get('paymentDetailsBankEntity').value === FccGlobalConstant.ANY_BANK_CODE) {
      this.form.get('paymentDetailsBankName').setValue(this.anyBnk);
      this.bankName = this.form.get('paymentDetailsBankName').value;
      this.nonRenderedFields = ['paymentDetailsBankFirstAddress', 'paymentDetailsBankSecondAddress', 'paymentDetailsBankThirdAddress',
        'paymentDetailsBankFourthAddress'];
      this.toggleControls(this.form, this.nonRenderedFields, false);
      this.resettingValidators('paymentDetailsBankFirstAddress');
      this.resettingValidators('paymentDetailsBankSecondAddress');
      this.resettingValidators('paymentDetailsBankThirdAddress');
      this.resettingValidators('paymentDetailsBankFourthAddress');
      this.form.controls[pdApplicantName].disable();
    }
  }

  disableAddress() {
    this.form.controls[this.pdApplicantFirstAddress].disable();
    this.form.controls[this.pdApplicantSecondAddress].disable();
    this.form.controls[this.pdApplicantThirdAddress].disable();
    if (this.form.controls[this.pdApplicantFourthAddress]
      && (this.commonService.isNonEmptyValue(this.mode) && this.mode !== FccBusinessConstantsService.SWIFT )) {
      this.form.controls[this.pdApplicantFourthAddress].disable();
      this.resettingValidators(this.pdApplicantFourthAddress);
    }
    this.resettingValidators(this.pdApplicantFirstAddress);
    this.resettingValidators(this.pdApplicantSecondAddress);
    this.resettingValidators(this.pdApplicantThirdAddress);
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
    if (this.form.get('inputSelect').value === '99') {
      this.toggleControl(this.form, 'inputSelectOther', true);
      this.setMandatoryField(this.form, 'inputSelectOther', false);
    } else {
      this.toggleControl(this.form, 'inputSelectOther', false);
      this.resettingValidators('inputSelectOther');
    }
    this.form.updateValueAndValidity();
    this.removeMandatory(['inputSelectOther']);
    this.checkAmendForSelections(['inputSelectOther']);
  }

  setFieldUnchecked(fieldName: any[]) {
    let index: number;
    for (index = 0; index < fieldName.length; index++) {
      this.form.get(fieldName[index])[this.params][this.icon] = '';
    }
  }

  saveFormObject() {
    this.stateService.setStateSection(FccGlobalConstant.SI_PAYMENT_DETAILS, this.form);
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

  onFocusPdApplicantSecondAddress() {
    const checkFirstLength = this.form.get('paymentDetailsBankFirstAddress').value
      .length;
    if (checkFirstLength === 0) {
      this.form.get('paymentDetailsBankFirstAddress').setValue('');
      this.form.controls.pdApplicantFirstAddress.markAsDirty();
    }
  }

  onFocusPdApplicantThirdAddress() {
    this.setMandatoryField(this.form, 'paymentDetailsBankSecondAddress', true);
    const checkFirstLength = this.form.get('paymentDetailsBankFirstAddress').value
      .length;
    const checkSecondLength = this.form.get('paymentDetailsBankSecondAddress').value
      .length;
    if (checkFirstLength === 0) {
      this.form.get('paymentDetailsBankFirstAddress').setValue('');
      this.form.controls.pdApplicantFirstAddress.markAsDirty();
    }
    if (checkSecondLength === 0) {
      this.form.get('paymentDetailsBankSecondAddress').setValue('');
      this.form.controls.pdApplicantSecondAddress.markAsDirty();
      this.form.get(this.pdApplicantSecondAddress).clearValidators();
      if (this.mode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(this.pdApplicantSecondAddress, Validators.pattern(this.paymentDetailsAddressRegex), 0);
      }
      this.form.addFCCValidators(this.pdApplicantSecondAddress, Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 0);
    }
    if (checkFirstLength === 0 && checkSecondLength === 0) {
      this.form.get('paymentDetailsBankFirstAddress').setValue('');
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
      }
    });
  }

  getAdvisingBnkDetails() {

      // Advising bank details change
      const bankDetails = this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS);
      const advisingBank = 'siAdvisingBank';
      const adviseThrough = 'siAdviseThroughBank';
      this.advisingBankKeyed = bankDetails.controls[advisingBank].get('advisingBankName').value;
      this.advisingBankSwiftKeyed = bankDetails.controls[advisingBank].get('advisingswiftCode').value;
      this.adviseThroughBankKeyed = bankDetails.controls[adviseThrough].get('adviceThroughName').value;
      this.adviseThroughBankSwiftKeyed = bankDetails.controls[adviseThrough].get('advThroughswiftCode').value;
      this.advisingBankEntered = this.form.get(FccGlobalConstant.PAYMENT_DETAILS_BANK_NAME).value;
      let indexPositon = 1;
      if ((this.advisingBankSwiftKeyed != null && this.advisingBankSwiftKeyed !== '') ||
               (this.advisingBankKeyed != null && this.advisingBankKeyed !== '') ||
               (this.advisingBankEntered != null && this.advisingBankEntered !== '' &&
               this.advisingBankEntered === FccGlobalConstant.ADVISING_BANK)) {
        this.optionSIList.splice(indexPositon, FccGlobalConstant.LENGTH_0,
          { label: this.advBnk , value: '02', id: 'paymentDeatilsBankEntity_02' });
        indexPositon++;
      }
      if ((this.adviseThroughBankSwiftKeyed !== null && this.adviseThroughBankSwiftKeyed !== '') ||
          (this.adviseThroughBankKeyed !== null && this.adviseThroughBankKeyed !== '')) {
        this.optionSIList.splice(indexPositon, FccGlobalConstant.LENGTH_0,
        { label: this.adviceThrough , value: '08' , id: 'paymentDeatilsBankEntity_08' });
      }
      if (this.advisingBankSwiftKeyed === null || this.advisingBankKeyed === null ||
        this.advisingBankSwiftKeyed === '' || this.advisingBankKeyed === '') {
        const index = this.optionSIList.findIndex(x => x.value.label === FccGlobalConstant.ADVISINGBANK);
        if (index > -1) {
            this.optionSIList.splice(index, 1);
        }
      }
      if (this.adviseThroughBankSwiftKeyed === null || this.adviseThroughBankKeyed === null ||
        this.adviseThroughBankSwiftKeyed === '' || this.adviseThroughBankKeyed === '') {
        const index = this.optionSIList.findIndex(x => x.value.label === FccGlobalConstant.ADVISETHRU);
        if (index > -1) {
        this.optionSIList.splice(index, 1);
        }
      }
      this.patchFieldParameters(this.form.get('paymentDetailsBankEntity'), { options: this.optionSIList });
  }

  getPaymentContextReadonly() {
    if (this.context === 'readonly') {
      this.readOnlyMode();
    } else {
      const bankValue = this.form.get('paymentDetailsBankEntity').value;
      const bankNameValue = this.setBankName(bankValue);
      if (bankNameValue !== undefined && bankNameValue !== null) {
        const exist = this.optionSIList.filter(task => task.label === bankNameValue);
        if (exist.length > 0) {
         if ((task => task.label === bankNameValue)){ // eslint-disable-line no-constant-condition
          this.form.get('paymentDetailsBankEntity').setValue(this.form.get('paymentDetailsBankEntity').value);
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
        if (element.value === control.params.previousValue) {
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
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key);
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
          if (this.mode !== FccBusinessConstantsService.SWIFT &&
            this.commonService.isNonEmptyValue(advResponse.responseData.ADDRESS_LINE_4)) {
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
