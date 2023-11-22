import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { TransactionDetailService } from '../../../../../common/services/transactionDetail.service';
import { FormControlService } from '../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import {
  ConfirmationDialogComponent,
} from '../../../lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import {
  emptyCurrency,
  zeroAmount,
} from '../../../lc/initiation/validator/ValidateAmt';
import { checkNonZeroTenorValue } from '../../validator/EcValidations';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CurrencyRequest } from './../../../../../common/model/currency-request';
import { UserData } from './../../../../../common/model/user-data';
import { ExchangeRateRequest } from './../../../../../common/model/xch-rate-request';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { SessionValidateService } from './../../../../../common/services/session-validate-service';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import { EcProductComponent } from './../ec-product/ec-product.component';
import { CurrencyConverterPipe } from './../../../lc/initiation/pipes/currency-converter.pipe';
import { AmendCommonService } from '../../../../../corporate/common/services/amend-common.service';
import { FccTradeFieldConstants } from '../../../common/fcc-trade-field-constants';
import { LcConstant } from '../../../lc/common/model/constant';
import { EcProductService } from '../../services/ec-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { PhrasesService } from './../../../../../common/services/phrases.service';


@Component({
  selector: 'app-ec-payment-details',
  templateUrl: './ec-payment-details.component.html',
  styleUrls: ['./ec-payment-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EcPaymentDetailsComponent }]
})
export class EcPaymentDetailsComponent extends EcProductComponent implements OnInit, AfterViewInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  module = `${this.translateService.instant('ecpaymentAmountDetails')}`;
  contextPath: any;
  tnxTypeCode: any;
  collectionTypeOptions: any;
  isoamt = '';
  enteredCurMethod = false;
  iso;
  length2 = FccGlobalConstant.LENGTH_2;
  val;
  flagDecimalPlaces;
  allowedDecimals = -1;
  threeDecimal = 3;
  currency: SelectItem[] = [];
  curRequest: CurrencyRequest = new CurrencyRequest();
  xchRequest: ExchangeRateRequest = new ExchangeRateRequest();
  mode: any;
  licenseData: any;
  sessionCols: any;
  licenseValue: any;
  option: any;
  render = 'rendered';
  required = 'required';
  isPreview: boolean;
  isMasterRequired: any;
  lcConstant = new LcConstant();
  isTenorDescTextAreaEnabled: boolean;
  configuredKeysList = 'show.DA.tenor.description.text.area';
  keysNotFoundList: any[] = [];
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;
  previewScreen = 'previewScreen';


  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
    protected router: Router, protected translateService: TranslateService,
    protected prevNextService: PrevNextService, protected sessionValidation: SessionValidateService,
    protected utilityService: UtilityService, protected saveDraftService: SaveDraftService,
    protected searchLayoutService: SearchLayoutService, protected confirmationService: ConfirmationService,
    protected formModelService: FormModelService, protected formControlService: FormControlService,
    protected stateService: ProductStateService, protected route: ActivatedRoute,
    protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    public fccGlobalConstantService: FccGlobalConstantService, protected dialogService: DialogService,
    protected fileList: FilelistService, protected resolverService: ResolverService,protected phrasesService: PhrasesService,
    protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
    protected amendCommonService: AmendCommonService, protected ecProductService: EcProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, ecProductService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    window.scroll(0, 0);

    this.isMasterRequired = this.isMasterRequired;
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.collectionTypeOptions = this.stateService.getSectionData(FccGlobalConstant.EC_GENERAL_DETAILS).get('collectionTypeOptions').value;
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
      }
    });
    this.initializeFormGroup();
    if (this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].data !== null &&
      this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].data !== '' &&
      this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].data !== undefined) {
      this.licenseData = this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].data;
    }
    if (this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].sessionCols !== null &&
      this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].sessionCols !== '' &&
      this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].sessionCols !== undefined) {
      this.sessionCols = this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].sessionCols;
    }
    if (this.stateService.getSectionData('ecLicenseDetails').get('linkedLicenses').value !== null &&
      this.stateService.getSectionData('ecLicenseDetails').get('linkedLicenses').value !== '' &&
      this.stateService.getSectionData('ecLicenseDetails').get('linkedLicenses').value !== undefined) {
      this.licenseValue = this.stateService.getSectionData('ecLicenseDetails').get('linkedLicenses').value;
    }
    this.isTenorDescTextAreaEnabled = ((this.stateService.getSectionData(FccGlobalConstant.EC_GENERAL_DETAILS)
    .controls.enableDescTextArea.value === 'true') || (this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA) &&
    this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).value &&
      this.form.controls[FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA].value !== '' && this.mode==='view')) ? true : false;
    if (this.isTenorDescTextAreaEnabled) {
      this.form.controls.ecTermCode['options'] = this.form.controls.ecTermCode['options'].filter(element=> element.value !== '04');
      this.form.controls.ecTenorType['options'] = this.form.controls.ecTenorType['options'].filter(element=> element.value !== '03');
      this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC)[this.params][FccGlobalConstant.RENDERED] = false;
    } else if (this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)){
      this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)[this.params][FccGlobalConstant.RENDERED] = false;
    }
    this.initiationofdata();
    this.xchRequest.userData = new UserData();
    this.xchRequest.userData.userSelectedLanguage = 'en';
    this.curRequest.userData = this.xchRequest.userData;
    this.onClickEcTermCode();
    this.onClickInputSelect();
    if (this.form.get('ecTermCode') && (this.form.get('ecTermCode').value === FccGlobalConstant.EC_TERM_CODE_OTHER)) {
      this.onClickEcTenorType();
    }
    this.amountCurrencyValidation();
    this.isPreview = this.mode === FccGlobalConstant.INITIATE || this.mode === FccGlobalConstant.DRAFT_OPTION ||
      this.mode === FccGlobalConstant.EXISTING;
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.removeControl('ecAvailableAmt');
      this.form.removeControl('outstandingAmount');
    }
    if (this.isTenorDescTextAreaEnabled && this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA) &&
      this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).value) {
      this.setTenorDescription();
    }
    this.setBaseDateRangeAsPerTenorStart();

  }
  /**
   * Initialise the form from state servic
   */
  initializeFormGroup() {
    const sectionName = FccGlobalConstant.EC_PAYMENT_DETAILS;
    this.form = this.stateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.getCurrencyDetail();
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW && this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)) {
      this.form.get( FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)[this.params][FccGlobalConstant.PHRASE_ENABLED] = true;
    } else if (this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)){
      this.form.get( FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)[this.params][FccGlobalConstant.PHRASE_ENABLED] = false;
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const fieldValue = this.commonService.handleComputedProductAmtFieldForAmendDraft(this.form, FccTradeFieldConstants.NEW_EC_AMT);
      if (fieldValue && fieldValue !== '') {
        this.patchFieldValueAndParameters(this.form.get(FccTradeFieldConstants.NEW_EC_AMT), fieldValue, {});
      }
    }
    this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
    if ((this.form.get('inputValNum') || this.form.get('inputDays') || this.form.get('inputFrom')
      || this.form.get('inputSelect') || this.form.get('ecBaseDate'))
      && (this.form.get('inputValNum').value || this.form.get('inputDays').value || this.form.get('inputFrom').value
        || this.form.get('inputSelect').value || this.form.get('ecBaseDate').value)) {
      this.form.get('ecPaymentDraftOptions').setValue('02');
      if(this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))
      {
        this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
        .get(FccGlobalConstant.EC_PAYMENT_DRAFT_OPTIONS).setValue('02');
       }
    } else if (this.commonService.isNonEmptyField(FccGlobalConstant.EC_MATURITY_DATE, this.form) &&
      this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.EC_MATURITY_DATE).value) &&
      this.form.get(FccGlobalConstant.EC_MATURITY_DATE).value !== FccGlobalConstant.EMPTY_STRING) {
      this.form.get(FccGlobalConstant.EC_PAYMENT_DRAFT_OPTIONS).setValue(FccGlobalConstant.FIXED_MATURITY_DATE_VALUE);
      if(this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))
      {
        this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
        .get(FccGlobalConstant.EC_PAYMENT_DRAFT_OPTIONS).setValue(FccGlobalConstant.FIXED_MATURITY_DATE_VALUE);
       }
    }
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const inputValueNumControl = this.form.get('inputValNum');
    if (inputValueNumControl && inputValueNumControl.value !== null && inputValueNumControl.value !== undefined &&
      this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.form.addFCCValidators('inputValNum', Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
      this.form.addFCCValidators('inputValNum', Validators.compose([checkNonZeroTenorValue]), 0);
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
      this.checkTnxAmt();
      this.onBlurEcMaturityDate();
    }
    this.commonService.formatForm(this.form);
    this.clearamountField();
    this.removeAmendFlagFromField();
    this.addAmountLengthValidator();
    this.form.updateValueAndValidity();
  }

  clearamountField() {
    if (this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value) {
      if (this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value <= 0) {
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).enable();
        return;
      }
    }
    if (this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value) {
      if (this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value <= 0) {
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).enable();
        return;
      }
    }
    if (this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value) {
      if (this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value <= 0) {
        this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValue('');
        return;
      }
    }
  }

  removeAmendFlagFromField() {
    if (this.form.get('orgECAmt').value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get('orgECAmt'), { amendPersistenceSave: true });
    }
    if (this.form.get('newECAmt').value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get('newECAmt'), { amendPersistenceSave: true });
    }
    if (this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { amendPersistenceSave: true });
    }
    if (this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { amendPersistenceSave: true });
    }
  }

  amountCurrencyValidation() {
    if (this.option === FccGlobalConstant.EXISTING) {
      this.form.get('currency').setValue(FccGlobalConstant.EMPTY_STRING);
      this.form.get('amount').setValue(null);
      this.form.get('amount').clearValidators();
    }
    if (this.form.get('currency').value === '' ||
      this.form.get('currency').value === null ||
      this.form.get('currency').value === undefined) {
      this.form.get('amount').setValue(null);
      this.form.get('amount').clearValidators();
      this.form.get('amount').setErrors(null);
    }
    this.removeMandatoryForTemplate(['currency', 'amount']);
    this.addAmountLengthValidator();
  }

  addAmountLengthValidator() {
    const controlNames: string[] = ['amount', 'increaseAmount', 'decreaseAmount', 'newECAmt'];
    this.setAmountLengthValidatorList(controlNames);
  }

  initiationofdata() {
    this.flagDecimalPlaces = -1;
    this.iso = '';
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.iso = this.commonService.masterDataMap.get('currency');
    }
  }

  getCurrencyDetail() {
    if (this.form.get('currency')[FccGlobalConstant.OPTIONS].length === 0) {
      this.commonService.userCurrencies(this.curRequest).subscribe(
        response => {
          if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
            this.sessionValidation.IsSessionValid();
          } else {
            response.items.forEach(
              value => {
                const ccy: { label: string, value: any } = {
                  label: value.isoCode,
                  value: {
                    label: value.isoCode,
                    iso: `${value.isoCode} - ${this.toTitleCase(value.name)}`,
                    country: value.principalCountryCode,
                    currencyCode: value.isoCode,
                    shortName: value.isoCode,
                    name: value.name
                  }
                };
                this.currency.push(ccy);
              });
              setTimeout(()=>{
                this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
                this.updateCurrencyValue();
                },FccGlobalConstant.LENGTH_500);

          }
        });
    }
    this.removeMandatoryForTemplate(['currency']);
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  updateCurrencyValue() {
    if (this.commonService.isNonEmptyField(FccGlobalConstant.CURRENCY, this.form) &&
      this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value) &&
      this.currency.length > 0) {
      const currencyValue = this.form.get(FccGlobalConstant.CURRENCY).value;
      if (this.commonService.isNonEmptyValue(currencyValue) && currencyValue !== '') {
        const exists = this.currency.filter(
          task => task.value.shortName === currencyValue.shortName);
        if (this.commonService.isNonEmptyValue(exists) && exists.length > 0) {
          this.form.get(FccGlobalConstant.CURRENCY).setValue(this.currency.filter(
            task => task.value.shortName === currencyValue.shortName)[0].value);
        }
      }
    }
  }

  handleLinkedLicense() {
    if ((this.licenseData && this.licenseData.length > 0)
      || (this.sessionCols && this.sessionCols.length > 0) || this.licenseValue > 0) {
      const headerField = `${this.translateService.instant('deleteLinkedLicense')}`;
      const obj = {};
      const dir = localStorage.getItem('langDir');
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        data: obj,
        header: headerField,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir }
      });
      dialogRef.onClose.subscribe((result: any) => {
        if (result.toLowerCase() === 'yes') {
          this.onFocusYesButton();
        }
      });
    }
  }

  onFocusYesButton() {
    this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].data = null;
    this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].sessionCols = null;
    this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.stateService.getSectionData('ecLicenseDetails').get('linkedLicenses').setValue(null);
    this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
    this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
  }

  onKeyupCurrency(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty || keycodeIs === this.lcConstant.thirteen) {
      this.onclickCurrencyAccessibility(this.form.get(FccGlobalConstant.CURRENCY).value);
    }
  }

  onclickCurrencyAccessibility(value) {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
    if (value) {
      this.postClickRKeyUpOnCurrency(value);
    }
  }

  onClickCurrency(event) {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
    if (event.value !== undefined) {
      this.postClickRKeyUpOnCurrency(event.value);
    }
  }

  postClickRKeyUpOnCurrency(value) {
    if (value) {
      this.enteredCurMethod = true;
      this.iso = value.currencyCode;
      this.isoamt = this.iso;
      const amt = this.form.get(FccGlobalConstant.AMOUNT_FIELD);
      this.val = amt.value;
      this.handleLinkedLicense();
      if(this.option !== FccGlobalConstant.TEMPLATE){
        this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD,
          Validators.compose([Validators.required, Validators.pattern(this.commonService.getRegexBasedOnlanguage())]), 0);
        this.setMandatoryField(this.form, FccGlobalConstant.AMOUNT_FIELD, true);
      }
      if(this.nonNumericCurrencyValidator){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      this.flagDecimalPlaces = 0;
      if(this.nonNumericCurrencyValidator){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }

      if (this.val !== '' && this.commonService.isNonEmptyValue(this.val) && this.val <= 0) {
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ amountCanNotBeZero: true });
        return;
      } else if (this.val !== '' && this.commonService.isNonEmptyValue(this.val)) {
        let valueupdated = this.commonService.replaceCurrency(this.val);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValue(valueupdated);
      } else if(this.option !== FccGlobalConstant.TEMPLATE){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ required: true });
      }
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
      this.removeMandatoryForTemplate([FccGlobalConstant.AMOUNT_FIELD]);
    }
  }

  onClickAmount() {
    this.OnClickAmountFieldHandler('amount');
  }

  onFocusAmount() {
    this.OnClickAmountFieldHandler('amount');
  }

  onKeyupAmount() {
    const amt = this.form.get(FccGlobalConstant.AMOUNT_FIELD);
    if(this.nonNumericCurrencyValidator){
      let currencyCode;
      if (this.form.get('currency').value && this.form.get('currency').value.currencyCode) {
        currencyCode = this.form.get('currency').value.currencyCode;
      } else {
        currencyCode = this.iso;
      }
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value,
        currencyCode,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
  }

  /*validation on change of amount field*/
  onBlurAmount() {
    this.form.get('amount').clearValidators();
    this.setAmountLengthValidator('amount');
    const amt = this.form.get('amount');
    this.val = amt.value;
    if ((this.val === null || this.val === undefined || this.val === '') && this.option !== FccGlobalConstant.TEMPLATE) {
      this.form.get('amount').setErrors({ required: true });
    return;
  }
  if ((this.val <= 0) && this.option !== FccGlobalConstant.TEMPLATE) {
    this.form.get('amount').setErrors({ amountCanNotBeZero: true });
    return;
  }
    this.iso = this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value) &&
    this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode) ?
    this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode : null;
    if(this.nonNumericCurrencyValidator){
      let currencyCode;
      if (this.form.get('currency').value && this.form.get('currency').value.currencyCode) {
        currencyCode = this.form.get('currency').value.currencyCode;
      } else {
        currencyCode = this.iso;
      }
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value,
        currencyCode,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (this.val !== '') {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get('amount').setValidators(emptyCurrency);
      }
      if (this.iso !== '' && this.commonService.isNonEmptyValue(this.iso) && this.option !== FccGlobalConstant.TEMPLATE) {
        this.form.addFCCValidators('amount',
          Validators.compose([Validators.required, Validators.pattern(this.commonService.getRegexBasedOnlanguage())]), 0);
        this.form.get('amount').updateValueAndValidity();
        this.form.get('amount').setErrors({ required: true });
        this.allowedDecimals = FccGlobalConstant.LENGTH_0;
        const amtValue = this.commonService.replaceCurrency(this.val);
        const valueupdated = this.currencyConverterPipe.transform(amtValue.toString(), this.iso);
        this.form.get('amount').setValue(valueupdated);
        this.amountValidation();
      }
      this.form.get('amount').updateValueAndValidity();
    }
  }

  amountValidation() {
    const transferAmt = this.form.get('amount').value;
    if (this.commonService.isnonEMptyString(transferAmt)) {
      const transferAmtFloatValue = parseFloat(transferAmt.toString());
      if (transferAmtFloatValue === 0 && this.option !== FccGlobalConstant.TEMPLATE) {
        this.form.get('amount').clearValidators();
        this.form.addFCCValidators('amount',
          Validators.compose([Validators.required, zeroAmount]), 0);
        this.form.get('amount').setErrors({ zeroAmount: true });
        this.form.get('amount').markAsDirty();
        this.form.get('amount').markAsTouched();
        this.form.get('amount').updateValueAndValidity();
      }
    }
  }

  onClickEcTermCode() {
    const ecTermCode = this.form.get('ecTermCode');
    if (ecTermCode && (ecTermCode.value === FccGlobalConstant.EC_TERM_CODE_SIGHT)) {
      this.ecTermCodeValidation(FccGlobalConstant.EC_TERM_CODE_SIGHT);
      this.ecTermCodeTenorTypeValidation(FccGlobalConstant.EC_TERM_CODE_SIGHT);
      this.form.get('ecPaymentDraftOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('tenorPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      const hideFields = [FccTradeFieldConstants.OTHER_EC_TENOR_DESC, 'ecMaturityDate', 'inputValNum', 'inputDays',
        'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther', 'ecBaseDate'];
      if (this.isTenorDescTextAreaEnabled) {
        hideFields.push(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA);
      }
      this.renderDependentFields([], hideFields, []);
      this.sightOtherPayment();
      hideFields.forEach(element => {
        this.resettingValidators(element);
      });
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.EC_TERM_CODE], true);
    } else if (ecTermCode && (ecTermCode.value === FccGlobalConstant.EC_TERM_CODE_ACCEPTANCE)) {
      this.ecTermCodeValidation(FccGlobalConstant.EC_TERM_CODE_ACCEPTANCE);
      this.ecTermCodeTenorTypeValidation('02');
      this.ecPaymentOptionsTenorCodeValidations();
      this.acceptancePourAvalPayment();
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.EC_TERM_CODE], true);
    } else if (ecTermCode && (ecTermCode.value === FccGlobalConstant.EC_TERM_CODE_POUR_AVAL)) {
      this.ecTermCodeValidation(FccGlobalConstant.EC_TERM_CODE_POUR_AVAL);
      this.ecTermCodeTenorTypeValidation('03');
      this.ecPaymentOptionsTenorCodeValidations();
      this.acceptancePourAvalPayment();
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.EC_TERM_CODE], true);
    } else if (ecTermCode && (ecTermCode.value === FccGlobalConstant.EC_TERM_CODE_OTHER)) {
      this.ecTermCodeValidation(FccGlobalConstant.EC_TERM_CODE_OTHER);
      this.ecTermCodeTenorTypeValidation(FccGlobalConstant.EC_TERM_CODE_SIGHT);
      this.form.get('ecPaymentDraftOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('tenorPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('ecMaturityDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      let displayFields = [];
      let mandatoryFields = [];
      if (this.isTenorDescTextAreaEnabled) {
        displayFields = [FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA];
        mandatoryFields = [FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA];
      } else {
        displayFields = [FccTradeFieldConstants.OTHER_EC_TENOR_DESC];
        mandatoryFields = [FccTradeFieldConstants.OTHER_EC_TENOR_DESC];
      }
      this.renderDependentFields(displayFields, [], mandatoryFields);
      if (this.isPreview) {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.EC_TERM_CODE], false);
      }
      this.sightOtherPayment();
    }
    this.form.get('ecTermCode').updateValueAndValidity();
    this.form.get('ecTenorType').updateValueAndValidity();
    if (this.isTenorDescTextAreaEnabled) {
      this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).updateValueAndValidity();
    } else {
      this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC).updateValueAndValidity();
    }
    this.baseDateValidation();
  }

  onClickNewECAmt() {
    //this.OnClickAmountFieldHandler(FccTradeFieldConstants.NEW_EC_AMT);
  }

  onFocusNewECAmt() {
    this.OnClickAmountFieldHandler(FccTradeFieldConstants.NEW_EC_AMT);
  }

  onKeyupNewECAmt() {
    const amt = this.form.get(FccTradeFieldConstants.NEW_EC_AMT);
    if(this.nonNumericCurrencyValidator){
      let currencyCode;
      if (this.form.get('currency').value && this.form.get('currency').value.currencyCode) {
        currencyCode = this.form.get('currency').value.currencyCode;
      } else {
        currencyCode = this.iso;
      }
      this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.NEW_EC_AMT, amt.value,
        currencyCode,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
  }

  onBlurNewECAmt() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.controls.currency
      && this.form.controls.currency.value) {
      this.iso = this.form.controls.currency.value;
    }

    this.setAmountLengthValidator(FccTradeFieldConstants.NEW_EC_AMT);
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_EC_AMT), { infoIcon: false });
    if (!this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value) {
      this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setErrors({ required: true });
    }
    if (this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value &&
      (this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value <= FccGlobalConstant.ZERO)) {
      this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setErrors({ amountCanNotBeZero: true });
    }
    const amt = this.form.get(FccTradeFieldConstants.NEW_EC_AMT);
    this.val = amt.value;
    if(this.nonNumericCurrencyValidator){
      let currencyCode;
      if (this.form.get('currency').value && this.form.get('currency').value.currencyCode) {
        currencyCode = this.form.get('currency').value.currencyCode;
      } else {
        currencyCode = this.iso;
      }
      this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.NEW_EC_AMT, amt.value,
        currencyCode,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (this.commonService.isnonEMptyString(this.val)) {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValidators(emptyCurrency);
      }
      if (this.val <= 0) {
        this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setErrors({ amountCanNotBeZero: true });
        return;
      }

      const valueupdated = this.currencyConverterPipe.transform(this.val.toString(), this.iso);
      this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValue(valueupdated);
      const newECDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(valueupdated);
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_EC_AMT), { displayedValue: newECDisplayAmt });
      if (this.iso !== '') {
        amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        const amtValue = this.commonService.replaceCurrency(this.val);
        const orgAmt = this.commonService.replaceCurrency(this.stateService.getValue('ecpaymentAmountDetails', 'amount', true));
        if (amtValue !== '') {
          const changeAmt = parseFloat(amtValue);
          const orgFloatAmt = parseFloat(orgAmt);
          if (orgFloatAmt > changeAmt) {
            const decrAmt = orgFloatAmt - changeAmt;
            const updatedDecrAmt = this.currencyConverterPipe.transform(decrAmt.toString(), this.iso);
            this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue(updatedDecrAmt);
            this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).updateValueAndValidity();
            this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
            this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].disable();
            this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].enable();
            const decreaseDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(updatedDecrAmt);
            this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { displayedValue: decreaseDisplayAmt });
            this.form.get('transactionAmount').setValue(updatedDecrAmt);
            this.form.get('transactionAmount').updateValueAndValidity();
            this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_DEC);
            this.newECAmValidation(FccTradeFieldConstants.DECREASE_AMOUNT);
          } else if (orgFloatAmt < changeAmt) {
            const incrAmt = changeAmt - orgFloatAmt;
            const updatedIncrValue = this.currencyConverterPipe.transform(incrAmt.toString(), this.iso);
            this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue(updatedIncrValue);
            this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).updateValueAndValidity();
            this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
            this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].disable();
            this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].enable();
            const increaseDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(updatedIncrValue);
            this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { displayedValue: increaseDisplayAmt });
            this.form.get('transactionAmount').setValue(updatedIncrValue);
            this.form.get('transactionAmount').updateValueAndValidity();
            this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_INC);
            this.newECAmValidation(FccTradeFieldConstants.INCREASE_AMOUNT);
          } else {
            this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
            this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).updateValueAndValidity();
            this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
            this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).updateValueAndValidity();
            this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].enable();
            this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].enable();
            this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_TERMS);
            this.patchFieldParameters(this.form.get('amountheader'), { infoIcon: false });
            this.form.get('transactionAmount').setValue('');
            this.form.get('transactionAmount').updateValueAndValidity();
          }
        }
      }
    } else {
      this.resetAmendAmount();
      this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValidators([Validators.required]);
    }
  }

  ecTermCodeValidation(val: any) {
    const ecTermCode = this.form.get('ecTermCode')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    this.iterateOptions(ecTermCode, val);
    this.form.get('ecTermCode').setValue(val);
  }

  ecTenorTypeChecked(val: any) {
    const ecTenorTypeOptions = this.form.get('ecTenorType')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    this.iterateOptions(ecTenorTypeOptions, val);
  }

  iterateOptions(ecCode: any, val: any) {
    ecCode.forEach((element) => {
      if (element.value === val) {
        element[FccGlobalConstant.CHECKED] = true;
      } else {
        element[FccGlobalConstant.CHECKED] = false;
      }
    });
  }

  ecPaymentOptionsTenorCodeValidations() {
    let displayFields = [];
    let hideFields = [];
    let mandatoryFields = [];
    if (this.form.get('ecPaymentDraftOptions') && (this.form.get('ecPaymentDraftOptions').value === '02')) {
      displayFields = ['ecPaymentDraftOptions', 'inputValNum', 'inputDays',
        'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'ecBaseDate', 'tenorPeriod'];
      hideFields = [FccTradeFieldConstants.OTHER_EC_TENOR_DESC,
        FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA,'ecMaturityDate'];
      mandatoryFields = ['inputValNum', 'inputDays',
        'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'ecBaseDate'];
      if (this.isTenorDescTextAreaEnabled) {
        displayFields.push(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA);
        mandatoryFields.push(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA);
      }
      const hiddenFieldIndex = hideFields.indexOf(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA);
      if (hiddenFieldIndex > -1) {
        hideFields.splice(hiddenFieldIndex, 1);
      }
    } else {
      this.form.get(FccGlobalConstant.EC_PAYMENT_DRAFT_OPTIONS).setValue(FccGlobalConstant.FIXED_MATURITY_DATE_VALUE);
      displayFields = ['ecPaymentDraftOptions', 'ecMaturityDate', 'tenorPeriod'];
      hideFields = [FccTradeFieldConstants.OTHER_EC_TENOR_DESC,
      FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA, 'inputValNum', 'inputDays',
        'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'ecBaseDate'];
      mandatoryFields = ['ecMaturityDate'];
      if (this.isTenorDescTextAreaEnabled) {
        displayFields.push(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA);
        mandatoryFields.push(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA);
      }
      const hiddenFieldIndex = hideFields.indexOf(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA);
      if (hiddenFieldIndex > -1) {
        hideFields.splice(hiddenFieldIndex, 1);
      }
      hideFields.forEach(element => {
        this.resettingValidators(element);
      });
    }
    this.renderDependentFields(displayFields, hideFields, mandatoryFields);
  }

  ecTermCodeTenorTypeValidation(val: any) {
    const ecTenorTypeOptions = this.form.get('ecTenorType')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    ecTenorTypeOptions.forEach((element) => {
      if (element.value === val) {
        element[FccGlobalConstant.READONLY] = false;
        element[FccGlobalConstant.CHECKED] = true;
      } else {
        element[FccGlobalConstant.READONLY] = true;
        element[FccGlobalConstant.CHECKED] = false;
      }
    });
    this.form.get('ecTenorType').setValue(val);
    if (FccGlobalConstant.N002_AMEND === this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE)) {
      this.addAmendLabelIcon(this.form.get('ecTenorType'), this.form.controls);
    }
  }

  onClickEcTenorType() {
    const ecTenorType = this.form.get('ecTenorType');
    if (ecTenorType && (ecTenorType.value === FccGlobalConstant.EC_TERM_CODE_SIGHT)) {
      this.ecTenorTypeChecked(FccGlobalConstant.EC_TERM_CODE_SIGHT);
      this.form.get('ecPaymentDraftOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('tenorPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      const hideFields = ['ecMaturityDate', 'inputValNum', 'inputDays',
        'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther', 'ecBaseDate'];
      this.renderDependentFields([], hideFields, []);
      this.sightOtherPayment();
      hideFields.forEach(element => {
        this.resettingValidators(element);
      });
    } else if (ecTenorType && (ecTenorType.value === '02')) {
      this.ecTenorTypeChecked('02');
      this.ecPaymentDraftOptionsValidations();
      this.acceptancePourAvalPayment();
    } else if (ecTenorType && (ecTenorType.value === '03')) {
      this.ecTenorTypeChecked('03');
      this.ecPaymentDraftOptionsValidations();
      this.acceptancePourAvalPayment();
    }
    if (this.commonService.isNonEmptyField(FccGlobalConstant.EC_TERM_CODE, this.form) &&
      this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.EC_TERM_CODE).value)) {
      this.ecTermCodeValidation(this.form.get(FccGlobalConstant.EC_TERM_CODE).value);
    }
    this.baseDateValidation();
  }

  onClickEcPaymentDraftOptions() {
    const creditAvailBy = this.form.get('ecTermCode');
    const paymentDraftAt = this.form.get('ecPaymentDraftOptions');
    if (paymentDraftAt.value === '01' && (creditAvailBy.value === FccGlobalConstant.EC_TERM_CODE_ACCEPTANCE ||
      creditAvailBy.value === FccGlobalConstant.EC_TERM_CODE_POUR_AVAL || creditAvailBy.value === FccGlobalConstant.EC_TERM_CODE_OTHER)) {
      const fixedMaturityFields = ['ecMaturityDate'];
      const calculatedMatFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'inputSelectOther', 'ecBaseDate'];
      this.setValueToNull(['ecMaturityDate']);
      paymentDraftAt[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.renderCreditAvailableDependentFields(fixedMaturityFields, calculatedMatFields);
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.PAYMENT_INPUT_SELECT], TextTrackCueList);
    } else if (paymentDraftAt.value === '02'
      && (creditAvailBy.value === FccGlobalConstant.EC_TERM_CODE_ACCEPTANCE ||
        creditAvailBy.value === FccGlobalConstant.EC_TERM_CODE_POUR_AVAL || creditAvailBy.value === FccGlobalConstant.EC_TERM_CODE_OTHER)) {
      const fixedMaturityFields = ['ecMaturityDate'];
      const calculatedMatFields = ['inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'ecBaseDate'];
      this.setValueToNull(['ecMaturityDate']);
      paymentDraftAt[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.renderCreditAvailableDependentFields(calculatedMatFields, fixedMaturityFields);
      this.form.addFCCValidators('inputValNum', Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
      this.form.addFCCValidators('inputValNum', Validators.compose([checkNonZeroTenorValue]), 0);
    }
  }

  ecPaymentDraftOptionsValidations() {
    let displayFields = [];
    let hideFields = [];
    let mandatoryFields = [];
    if (this.form.get('ecPaymentDraftOptions') && (this.form.get('ecPaymentDraftOptions').value === '02')) {
      displayFields = ['ecPaymentDraftOptions', 'inputValNum', 'inputDays',
        'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'ecBaseDate', 'tenorPeriod'];
      hideFields = ['ecMaturityDate'];
      mandatoryFields = ['inputValNum', 'inputDays',
        'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'ecBaseDate'];
      this.form.addFCCValidators('inputValNum', Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
    } else {
      this.form.get(FccGlobalConstant.EC_PAYMENT_DRAFT_OPTIONS).setValue(FccGlobalConstant.FIXED_MATURITY_DATE_VALUE);
      displayFields = ['ecPaymentDraftOptions', 'ecMaturityDate', 'tenorPeriod'];
      hideFields = ['inputValNum', 'inputDays',
        'inputValNum', 'inputDays', 'inputFrom', 'inputSelect', 'ecBaseDate'];
      hideFields.forEach(element => {
        this.resettingValidators(element);
      });
      mandatoryFields = ['ecMaturityDate'];
    }
    this.renderDependentFields(displayFields, hideFields, mandatoryFields);
  }

  protected renderCreditAvailableDependentFields(displayFields: any, hideFields: any) {
    this.toggleControls(this.form, displayFields, true);
    this.toggleControls(this.form, hideFields, false);
    this.setValueToNull(displayFields);
    this.setValueToNull(hideFields);
    hideFields.forEach(element => {
      this.resettingValidators(element);
    });
    this.setMandatoryFields(this.form, displayFields, true);
    this.setMandatoryFields(this.form, hideFields, false);
    if (displayFields.length > FccGlobalConstant.LENGTH_0) {
      this.removeMandatoryForTemplate([displayFields]);
    }
  }

  protected renderDependentFields(displayFields: any, hideFields: any, mandatoryFields: any) {
    this.toggleControls(this.form, displayFields, true);
    this.toggleControls(this.form, hideFields, false);
    this.setValueToNull(hideFields);
    hideFields.forEach(element => {
      this.resettingValidators(element);
    });
    this.setMandatoryFields(this.form, mandatoryFields, true);
    if (mandatoryFields.length > FccGlobalConstant.LENGTH_0) {
      this.removeMandatoryForTemplate([mandatoryFields]);
    }
  }

  setValueToNull(fieldName: any[]) {
    let index: any;
    for (index = 0; index < fieldName.length; index++) {
      this.form.controls[fieldName[index]].setValue('');
    }
  }

  resettingValidators(fieldvalue) {
    this.setMandatoryField(this.form, fieldvalue, false);
    this.form.get(fieldvalue).clearValidators();
    this.form.get(fieldvalue).updateValueAndValidity();
  }

  onClickInputSelect() {
    if (this.form && this.form.get('inputSelect').value && this.form.get('inputSelect').value === 'O') {
      this.toggleControl(this.form, 'inputSelectOther', true);
      this.setMandatoryField(this.form, 'inputSelectOther', true);
      if (this.isPreview) {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.PAYMENT_INPUT_SELECT], false);
      }
    } else {
      this.toggleControl(this.form, 'inputSelectOther', false);
      this.resettingValidators('inputSelectOther');
      this.setValueToNull(['inputSelectOther']);
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.PAYMENT_INPUT_SELECT], true);
    }
    this.baseDateValidation();
    this.removeMandatoryForTemplate(['inputSelectOther']);
    this.form.get('inputSelect').updateValueAndValidity();
  }

  sightOtherPayment() {
    let displayFields = [];
    let hideFields = [];
    if ((this.collectionTypeOptions || (this.collectionTypeOptions[0] && this.collectionTypeOptions[0].value))
    && (this.collectionTypeOptions === '01' || this.collectionTypeOptions === '02' || this.collectionTypeOptions[0].value === '01'
    || this.collectionTypeOptions[0].value === '02')) {
      displayFields = ['ecDocMethodHeader', 'coverLetterAtachment'];
      hideFields = ['billOfXchGeneration'];
      this.renderDependentFields(displayFields, hideFields, []);
    } else if ((this.collectionTypeOptions || (this.collectionTypeOptions[0] && this.collectionTypeOptions[0].value)) &&
      (this.collectionTypeOptions === '03' || this.collectionTypeOptions[0].value === '03')) {
      hideFields = ['ecDocMethodHeader', 'coverLetterAtachment', 'billOfXchGeneration'];
      this.renderDependentFields(displayFields, hideFields, []);
    }
  }

  acceptancePourAvalPayment() {
    let displayFields = [];
    let hideFields = [];
    if (this.collectionTypeOptions === '01' || this.collectionTypeOptions[0].value === '01') {
      displayFields = ['ecDocMethodHeader', 'coverLetterAtachment', 'billOfXchGeneration'];
      this.renderDependentFields(displayFields, hideFields, []);
    } else if (this.collectionTypeOptions === '02' || this.collectionTypeOptions[0].value === '02') {
      displayFields = ['ecDocMethodHeader', 'coverLetterAtachment'];
      hideFields = ['billOfXchGeneration'];
      this.renderDependentFields(displayFields, hideFields, []);
    } else if (this.collectionTypeOptions === '03' || this.collectionTypeOptions[0].value === '03') {
      displayFields = ['ecDocMethodHeader', 'billOfXchGeneration'];
      hideFields = ['coverLetterAtachment'];
      this.renderDependentFields(displayFields, hideFields, []);
    }
  }

  holdErrors() {
    const curr = this.form.get('currency') !== null ? this.form.get('currency').value : null;
    if(this.nonNumericCurrencyValidator){
      let currencyCode;
      if (this.form.get('currency').value && this.form.get('currency').value.currencyCode) {
        currencyCode = this.form.get('currency').value.currencyCode;
      } else {
        currencyCode = this.iso;
      }
      const amt = this.form.get(FccGlobalConstant.AMOUNT_FIELD);
      if(this.commonService.isNonEmptyValue(amt)){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value,
          currencyCode,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      const newLCAmt = this.form.get(FccTradeFieldConstants.NEW_EC_AMT);
      if(this.commonService.isNonEmptyValue(newLCAmt)){
        this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.NEW_EC_AMT, newLCAmt.value,
          currencyCode,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      const increaseAmount = this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT);
      if(this.commonService.isNonEmptyValue(increaseAmount)){
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValidators(
          [Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.INCREASE_AMOUNT, increaseAmount.value,
          currencyCode,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      const decreaseAmount = this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT);
      if(this.commonService.isNonEmptyValue(decreaseAmount)){
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValidators(
          [Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.DECREASE_AMOUNT, decreaseAmount.value,
          currencyCode,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
    }
    if (this.commonService.isNonEmptyValue(curr) && curr !== '' && curr !== ' ' && this.option !== FccGlobalConstant.TEMPLATE) {
      this.form.get('amount').setValidators([Validators.required]);
      this.form.get('amount').setErrors({ required: true });
      this.form.get('amount').markAsDirty();
      this.form.get('amount').markAsTouched();
      if (this.option !== FccGlobalConstant.TEMPLATE) {
        this.amountValidation();
      }
      this.form.get('amount').updateValueAndValidity();
    }
    if (!(this.commonService.isNonEmptyValue(curr) && curr !== '' && curr !== ' ') && this.option === FccGlobalConstant.TEMPLATE) {
      this.form.get('currency').setErrors(null);
      this.form.get('currency').clearValidators();
      this.removeMandatoryForTemplate(['currency']);
      this.form.get('currency').updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
    this.addAmountLengthValidator();
    if (this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)) {
      const innerTextLength = this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).value ?
        this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).value.length : 0;
      const allowedCharacrtersCount = this.form.get(
        FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)[this.params][FccGlobalConstant.ALLOWED_CHAR_COUNT];
        if(innerTextLength === 0 && this.form.get(
          FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)[this.params]['rendered']) {
          this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).setValidators([Validators.required]);
          this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).setErrors({ required: true });
          this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).updateValueAndValidity();
        }
      else if (innerTextLength > allowedCharacrtersCount) {
        this.form.controls.otherECTenorDescTextArea
          .setErrors({ maxSizeExceeds: true });
      }
    }
  }

  onBlurOtherECTenorDescTextArea() {
    if (this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)) {
      const allowedCharacrtersCount = this.form.get(
        FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)[this.params][FccGlobalConstant.ALLOWED_CHAR_COUNT];
      const innerTextLength = this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).value ?
        this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).value.length : 0;
        if(innerTextLength === 0) {
          this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).setErrors({ required: true });
          this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).updateValueAndValidity();
        }
        else {
              if (innerTextLength > allowedCharacrtersCount) {
        this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).setErrors({ maxSizeExceeds: true });
        this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).markAsDirty();
        this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).markAsTouched();
        this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).updateValueAndValidity();
      }
      else if (innerTextLength <= allowedCharacrtersCount) {
        // remove these count validation errors, if valid.
        if (this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)) {
          this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).setErrors(null);
        }
      }
      }
      this.form.updateValueAndValidity();
    }
  }

  amendFormFields() {
    this.form.get('amountheader')[this.params][this.render] = true;
    this.form.get('orgECAmt')[this.params][this.render] = true;
    this.form.get('amount')[this.params][this.render] = false;
    this.form.get('ecAvailableAmt')[this.params][this.render] = false;
    this.form.get('outstandingAmount')[this.params][this.render] = true;
    this.form.get('currency')[this.params][this.previewScreen] = false;
    this.form.get('amount').clearValidators();
    this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT)[this.params][this.render] = true;
    this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT)[this.params][this.render] = true;
    this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    this.form.get(FccTradeFieldConstants.NEW_EC_AMT)[this.params][this.render] = true;
    this.form.get(FccTradeFieldConstants.NEW_EC_AMT)[this.params][this.required] = true;
    this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_EC_AMT), { infoIcon: false });
    }
    this.form.get('decrAmountCurrency')[this.params][this.render] = true;
    this.form.get('newECAmtCurrency')[this.params][this.render] = true;
    if (this.form.get('subTnxTypeCode').value === FccGlobalConstant.EC_AMEND_INC) {
      if (this.form.get('transactionAmount')) {
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue(this.form.get('transactionAmount'));
      }
    } else if (this.form.get('subTnxTypeCode').value === FccGlobalConstant.EC_AMEND_DEC) {
      if (this.form.get('transactionAmount')) {
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue(this.form.get('transactionAmount'));
      }
    }
    if (this.mode !== FccGlobalConstant.DRAFT_OPTION) {
      this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_TERMS);
    } else {
      if (this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value) {
        this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_INC);
      } else if (this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value) {
        this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_DEC);
      } else {
        this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_TERMS);
      }
    }
    let amountValue;
    let currencyValue;
    let orgEcAmt;
    if (this.commonService.checkPendingClientBankViewForAmendTnx() &&
      this.mode !== FccGlobalConstant.VIEW_MODE) {
      amountValue = this.stateService.getValue('ecpaymentAmountDetails', 'amount', true);
      currencyValue = this.stateService.getValue('ecpaymentAmountDetails', 'currency', true);
      orgEcAmt = this.stateService.getValue('ecpaymentAmountDetails', 'orgECAmt', true);
    } else {
      amountValue = this.stateService.getValue('ecpaymentAmountDetails', 'amount', false);
      currencyValue = this.stateService.getValue('ecpaymentAmountDetails', 'currency', false);
      orgEcAmt = this.stateService.getValue('ecpaymentAmountDetails', 'orgECAmt', true);
    }
    let orgecAmtValue = (this.commonService.isNonEmptyValue(orgEcAmt) &&
      orgEcAmt !== FccGlobalConstant.EMPTY_STRING) ? orgEcAmt : amountValue;
    if (orgecAmtValue.indexOf(FccGlobalConstant.BLANK_SPACE_STRING) === -1){
      orgecAmtValue = this.currencyConverterPipe.transform(orgecAmtValue.toString(), currencyValue);
      orgecAmtValue = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(orgecAmtValue);
    }
    if (this.operation !== FccGlobalConstant.PREVIEW) {
      const orgAmt = this.stateService.getValue('ecpaymentAmountDetails', 'orgECAmt', true);
      if (orgAmt === null || orgAmt === undefined || orgAmt === FccGlobalConstant.EMPTY_STRING) {
        this.stateService.setValue('ecpaymentAmountDetails', 'orgECAmt', orgecAmtValue, true);
      }
    }
    this.patchFieldValueAndParameters(this.form.get('orgECAmt'), orgecAmtValue, '');
    this.amendCommonService.setValueFromMasterToPrevious('ecpaymentAmountDetails');
    this.stateService.setValue('ecpaymentAmountDetails', 'decrAmountCurrency', currencyValue, false);
    this.stateService.setValue('ecpaymentAmountDetails', 'newECAmtCurrency', currencyValue, false);
    if (this.form.get(FccTradeFieldConstants.NEW_EC_AMT) && this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value === null) {
      this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValue(amountValue);
    }

    let outstandingAmt;
    outstandingAmt= this.form.get('outstandingAmount').value;
    if(this.mode === 'EXISTING' || this.mode === 'DRAFT'){
    if (outstandingAmt && outstandingAmt.indexOf(FccGlobalConstant.BLANK_SPACE_STRING) === -1) {
    outstandingAmt = this.currencyConverterPipe.transform(outstandingAmt.toString(), currencyValue);
    outstandingAmt = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(outstandingAmt);
      this.form.get('outstandingAmount').setValue(outstandingAmt);
    }
  }
  }
  checkTnxAmt() {
    if (this.form.get('transactionAmount') && this.form.get(FccTradeFieldConstants.NEW_EC_AMT) &&
      this.form.get('transactionAmount').value && this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value) {
      const tnxAmtValue = this.form.get('transactionAmount').value;
      const amtVal = this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value.replace(/[^0-9.]/g, '');
      let orgAmt;
      let currencyValue;
      if (this.commonService.checkPendingClientBankViewForAmendTnx() &&
        this.mode !== FccGlobalConstant.VIEW_MODE) {
        orgAmt = this.stateService.getValue('ecpaymentAmountDetails', 'orgECAmt', false).replace(/[^0-9.]/g, '');
        currencyValue = this.stateService.getValue('ecpaymentAmountDetails', 'currency', true);
      } else {
        orgAmt = this.stateService.getValue('ecpaymentAmountDetails', 'orgECAmt', false).replace(/[^0-9.]/g, '');
        currencyValue = this.stateService.getValue('ecpaymentAmountDetails', 'currency', false);
      }
      const amtValue = parseFloat(amtVal);
      const orgFloatAmt = parseFloat(orgAmt);
      let decreaseDisplayAmt;
      let increaseDisplayAmt;
      if (orgFloatAmt > amtValue) {
        this.form.get(FccTradeFieldConstants.NEW_EC_AMT)[this.params][this.render] = true;
        this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValue(this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value);
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT)[this.params][this.render] = true;
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue(tnxAmtValue);
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
        if (this.mode === 'view') {
          this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT)[this.params][this.render] = false;
        }
        this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_DEC);
        decreaseDisplayAmt = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(tnxAmtValue);
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { displayedValue: decreaseDisplayAmt });
        this.patchFieldParameters(this.form.get('amountheader'), { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
      } else if (orgFloatAmt < amtValue) {
        this.form.get(FccTradeFieldConstants.NEW_EC_AMT)[this.params][this.render] = true;
        this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValue(this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value);
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT)[this.params][this.render] = true;
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue(tnxAmtValue);
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
        if (this.mode === 'view') {
          this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT)[this.params][this.render] = false;
        }
        this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_INC);
        increaseDisplayAmt = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(tnxAmtValue);
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { displayedValue: increaseDisplayAmt });
        this.patchFieldParameters(this.form.get('amountheader'), { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
      } else {
        this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_TERMS);
      }
    } else {
      this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_TERMS);
    }
    this.form.updateValueAndValidity();
  }

  onClickIncreaseAmount() {
    this.OnClickAmountFieldHandler(FccTradeFieldConstants.INCREASE_AMOUNT);

  }

  /*validation on change of amount field*/
  onBlurIncreaseAmount() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.controls.currency
      && this.form.controls.currency.value) {
      this.iso = this.form.controls.currency.value;
    }
    this.setAmountLengthValidator(FccTradeFieldConstants.INCREASE_AMOUNT);
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { infoIcon: false });
    const amt = this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT);
    if (this.commonService.isnonEMptyString(amt?.value)) {
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
      this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].disable();
    }
    this.val = amt.value;
    if(this.nonNumericCurrencyValidator){
      let currencyCode;
      if (this.form.get('currency').value && this.form.get('currency').value.currencyCode) {
        currencyCode = this.form.get('currency').value.currencyCode;
      } else {
        currencyCode = this.iso;
      }
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValidators(
        [Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.INCREASE_AMOUNT, amt.value,
        currencyCode,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value===''){
      this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].enable();
      }
    this.val = this.currencyConverterPipe.transform(amt.value,this.iso);
    //this.val = amt.value;
    if (this.commonService.isnonEMptyString(this.val)) {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValidators(emptyCurrency);
      }
      if (this.val <= 0) {
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setErrors({ amountCanNotBeZero: true });
        this.form.get('transactionAmount').setValue('');
        this.form.get('transactionAmount').updateValueAndValidity();
        this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_TERMS);
        this.resetNewECAmount();
        this.form.updateValueAndValidity();
        return;
      }
      if (this.iso !== ''&& this.commonService.isNonEmptyValue(this.iso)) {
        amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        const amtValue = this.commonService.replaceCurrency(this.val);
        const orgAmt = this.commonService.replaceCurrency(this.stateService.getValue('ecpaymentAmountDetails', 'amount', true));
        if (amtValue !== '') {
          const changeAmt = parseFloat(amtValue);
          const orgFloatAmt = parseFloat(orgAmt);
          const valueupdated = this.currencyConverterPipe.transform(amtValue.toString(), this.iso);
          this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue(valueupdated);
          this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).updateValueAndValidity();
          const increaseDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(valueupdated);
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { displayedValue: increaseDisplayAmt });
          this.form.get('transactionAmount').setValue(valueupdated);
          this.form.get('transactionAmount').updateValueAndValidity();
          let totalNewECAmt = orgFloatAmt + changeAmt;
          totalNewECAmt = this.currencyConverterPipe.transform(totalNewECAmt.toString(), this.iso);
          this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValue(totalNewECAmt);
          const newECDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(totalNewECAmt);
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_EC_AMT), { displayedValue: newECDisplayAmt });
          this.newECAmValidation(FccTradeFieldConstants.INCREASE_AMOUNT);
        }
      }
    } else {
      this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].enable();
      this.resetAmendAmount();
      this.resetNewECAmount();
      this.patchFieldParameters(this.form.get('amountheader'), { infoIcon: false });
    }
    if (this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value) {
      this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_INC);
    } else {
      this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_TERMS);
    }
  }

  onClickDecreaseAmount() {
    this.OnClickAmountFieldHandler(FccTradeFieldConstants.DECREASE_AMOUNT);
  }

  onFocusDecreaseAmount() {
    this.OnClickAmountFieldHandler(FccTradeFieldConstants.DECREASE_AMOUNT);
  }

  onKeyupDecreaseAmount() {
    const amt = this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT);
    if(this.nonNumericCurrencyValidator){
      let currencyCode;
      if (this.form.get('currency').value && this.form.get('currency').value.currencyCode) {
        currencyCode = this.form.get('currency').value.currencyCode;
      } else {
        currencyCode = this.iso;
      }
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValidators(
        [Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.DECREASE_AMOUNT, amt.value,
        currencyCode,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
  }

  /*validation on change of amount field*/
  onBlurDecreaseAmount() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.controls.currency
      && this.form.controls.currency.value) {
      this.iso = this.form.controls.currency.value;
    }
    this.setAmountLengthValidator(FccTradeFieldConstants.DECREASE_AMOUNT);
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { infoIcon: false });
    const amt = this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT);
    if (this.commonService.isnonEMptyString(amt?.value)) {
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
      this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].disable();
    }
    this.val = amt.value;
    if(this.nonNumericCurrencyValidator){
      let currencyCode;
      if (this.form.get('currency').value && this.form.get('currency').value.currencyCode) {
        currencyCode = this.form.get('currency').value.currencyCode;
      } else {
        currencyCode = this.iso;
      }
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValidators(
        [Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.DECREASE_AMOUNT, amt.value,
        currencyCode,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value===''){
      this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].enable();
      }
    //this.val = amt.value;
    this.val = this.currencyConverterPipe.transform(amt.value,this.iso);
    if (this.commonService.isnonEMptyString(this.val)) {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValidators(emptyCurrency);
      }
      if (this.val <= 0) {
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setErrors({ amountCanNotBeZero: true });
        this.form.get('transactionAmount').setValue('');
        this.form.get('transactionAmount').updateValueAndValidity();
        this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_TERMS);
        this.resetNewECAmount();
        this.form.updateValueAndValidity();
        return;
      }
      if (this.iso !== '' && this.commonService.isNonEmptyValue(this.iso)) {
        amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        const amtValue = this.commonService.replaceCurrency(this.val);
        const orgAmt = this.commonService.replaceCurrency(this.stateService.getValue('ecpaymentAmountDetails', 'amount', true));
        if (amtValue !== '') {
          const changeAmt = parseFloat(amtValue);
          const orgFloatAmt = parseFloat(orgAmt);
          if (orgFloatAmt > changeAmt) {
            const valueupdated = this.currencyConverterPipe.transform(amtValue.toString(), this.iso);
            this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue(valueupdated);
            this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).updateValueAndValidity();
            const decreaseDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(valueupdated);
            this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { displayedValue: decreaseDisplayAmt });
            this.form.get('transactionAmount').setValue(valueupdated);
            this.form.get('transactionAmount').updateValueAndValidity();
            let totalNewECAmt = orgFloatAmt - changeAmt;
            totalNewECAmt = this.currencyConverterPipe.transform(totalNewECAmt.toString(), this.iso);
            this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValue(totalNewECAmt);
            const newECDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(totalNewECAmt);
            this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_EC_AMT), { displayedValue: newECDisplayAmt });
            this.newECAmValidation(FccTradeFieldConstants.DECREASE_AMOUNT);
          }
          else {
            this.form.get('decreaseAmount').setErrors({ orgLessThanChangeAmt: true });
          }
        }
      }
    } else {
      this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].enable();
      this.resetAmendAmount();
      this.resetNewECAmount();
      this.patchFieldParameters(this.form.get('amountheader'), { infoIcon: false });
    }
    if (this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value) {
      this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_DEC);
    } else {
      this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.EC_AMEND_TERMS);
    }
  }

  resetNewECAmount() {
    const amountValue = this.stateService.getValue('ecpaymentAmountDetails', 'amount', true);
    this.form.get(FccTradeFieldConstants.NEW_EC_AMT).setValue(amountValue);
  }

  resetAmendAmount() {
    this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
    this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].enable();
    this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
    this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].enable();
    this.form.get('transactionAmount').setValue('');
  }

  newECAmValidation(formField) {
    if (this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value !== '' && this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value !== null) {
      this.form.get(FccTradeFieldConstants.NEW_EC_AMT)[this.params][this.render] = true;
      this.patchFieldParameters(this.form.get('amountheader'), { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
      this.patchFieldParameters(this.form.get(`${formField}`), { infoIcon: false });
      this.form.get('amount').setValue(this.form.get(FccTradeFieldConstants.NEW_EC_AMT).value);
      this.form.get('amount').updateValueAndValidity();
    }
  }

  formatAmount(amt: string) {
    amt = amt.replace(/[^0-9,]/g, ',');
    const lastIndex = amt.lastIndexOf(',');
    const amount = amt.substr(0, lastIndex) + FccGlobalConstant.DOT + amt.substr(lastIndex + 1);
    return amount;
  }

  removeMandatoryForTemplate(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  onBlurEcMaturityDate() {
    const dateVal = this.form.get('ecMaturityDate').value;
    const currentDate = this.commonService.getBankDateForComparison();
    const dateDiff = this.dateDifference(currentDate, dateVal);
    if (dateDiff < 0) {
      this.form.get('ecMaturityDate').setValue('');
      this.form.get('ecMaturityDate').markAsTouched();
      this.form.get('ecMaturityDate').updateValueAndValidity();
    }
  }

  checkToDisplayMaturityDate() {
    const previewScreenToggleControls = ['inputValNum'];
    if (this.form.get(FccGlobalConstant.EC_PAYMENT_DRAFT_OPTIONS) &&
      this.form.get(FccGlobalConstant.EC_PAYMENT_DRAFT_OPTIONS).value === FccGlobalConstant.FIXED_MATURITY_DATE_VALUE) {
      this.togglePreviewScreen(this.form, previewScreenToggleControls, false);
    } else {
      this.togglePreviewScreen(this.form, previewScreenToggleControls, true);
    }
  }

  dateDifference(today: any, ecMaturityDate: any) {
    const todayVal = new Date(today);
    const maturityDateVal = new Date(ecMaturityDate);
    const date1 = Date.UTC(todayVal.getFullYear(), todayVal.getMonth(), todayVal.getDate());
    const date2 = Date.UTC(maturityDateVal.getFullYear(), maturityDateVal.getMonth(), maturityDateVal.getDate());
    return Math.floor((date2 - date1) / FccGlobalConstant.ONE_DAY_TOTAL_TIME);
  }

  baseDateValidation() {
    const ecBaseDate = 'ecBaseDate';
    if (this.form && this.form.get('inputSelect') && this.form.get('inputSelect').value === 'G' ||
      this.form.get('inputSelect').value === 'S' || this.form.get('inputSelect').value === 'O') {
      this.setMandatoryField(this.form, ecBaseDate, false);
    } else {
      this.setMandatoryField(this.form, ecBaseDate, true);
    }
  }
  ngAfterViewInit(): void {
    const amountValue = this.form.get('amount').value;
    if (amountValue != undefined && amountValue != null && amountValue != '') {
      this.onBlurAmount();
    }
  }

  setTenorDescription() {
    this.patchFieldValueAndParameters(this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC),
    this.form.controls.otherECTenorDescTextArea.value, {});
    this.onBlurOtherECTenorDescTextArea();
    this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC).markAsTouched();
    this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC).markAsDirty();
    this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA).updateValueAndValidity();
    this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC).updateValueAndValidity();
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_EC, key);
  }
  setBaseDateRangeAsPerTenorStart() {
    this.form.get('inputSelect').valueChanges.subscribe(x => {
      if(this.form.get('ecBaseDate')){
        if(x==='G' || x==='O'){
           this.form.get('ecBaseDate')['params']['disableMinDate'] = true;
           this.form.get('ecBaseDate')['params']['enableMaxDate'] = false;
           this.form.get('ecBaseDate')['params']['minDate'] = null;
           this.form.get('ecBaseDate')['params']['maxDate'] = null;
        }else{
           this.form.get('ecBaseDate')['params']['disableMinDate'] = true;
           this.form.get('ecBaseDate')['params']['enableMaxDate'] = true;
           this.form.get('ecBaseDate')['params']['minDate'] = null;
           this.form.get('ecBaseDate')['params']['maxDate'] = this.commonService.getBankDateForComparison();
        }
        this.form.updateValueAndValidity();
      }
    });
  }

  ngOnDestroy() {
    this.checkToDisplayMaturityDate();
    if (this.isTenorDescTextAreaEnabled) {
      this.setTenorDescription();
    } else if (this.commonService.isnonEMptyString(this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC).value)){
      this.patchFieldValueAndParameters(this.form.controls.otherECTenorDescTextArea,
      this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC).value ,{});
    }
    this.holdErrors();
    const ecTermCode = this.form.get('ecTermCode');
    if (ecTermCode && (ecTermCode.value === FccGlobalConstant.EC_TERM_CODE_OTHER) && this.isPreview) {
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.EC_TERM_CODE], false);
      this.form.updateValueAndValidity();
    }
    this.stateService.setStateSection(FccGlobalConstant.EC_PAYMENT_DETAILS, this.form, this.isMasterRequired);
    if ((this.mode === FccGlobalConstant.EXISTING || this.mode === FccGlobalConstant.DRAFT_OPTION) && this.tnxTypeCode === '03') {
      if (this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value === null ||
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value === '') {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.DECREASE_AMOUNT], false);
      } else {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.DECREASE_AMOUNT], true);
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.NEW_EC_AMT], true);
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_EC_AMT), { amendPersistenceSave: true });
      }
      if (this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value === null ||
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value === '') {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.INCREASE_AMOUNT], false);
      } else {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.INCREASE_AMOUNT], true);
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.NEW_EC_AMT], true);
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_EC_AMT), { amendPersistenceSave: true });
      }
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.form.get('otherECTenorDescTextArea').setErrors(null);
      this.form.get('otherECTenorDescTextArea').clearValidators();
      this.removeMandatoryForTemplate(['otherECTenorDescTextArea']);
      this.form.get('otherECTenorDescTextArea').updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

}
