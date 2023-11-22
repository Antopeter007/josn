import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { BankDetails } from '../../../../../common/model/bankDetails';
import { CurrencyRequest } from '../../../../../common/model/currency-request';
import { References } from '../../../../../common/model/references';
import { CommonService } from '../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';
import { MultiBankService } from '../../../../../common/services/multi-bank.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../common/services/session-validate-service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import {
  guaranteeAmtGreaterThanLCAmt,
  invalidThreeDecimalTransferAmt,
  invalidTwoDecimalTransferAmt,
  invalidZeroDecimalTransferAmt,
  zeroAmount
} from '../../../lc/initiation/validator/ValidateAmt';
import { LiProductService } from '../../services/li-product.service';
import { CorporateCommonService } from './../../../../../corporate/common/services/common.service';
import { LiProductComponent } from './../../li-product/li-product.component';
import { Subscription } from 'rxjs';



@Component({
  selector: 'fcc-li-issuing-bank-and-amount',
  templateUrl: './li-issuing-bank-and-amount.component.html',
  styleUrls: ['./li-issuing-bank-and-amount.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LiIssuingBankAndAmountComponent }]
})
export class LiIssuingBankAndAmountComponent extends LiProductComponent implements OnInit, AfterViewInit {

  flagDecimalPlaces;
  OMR = 'OMR';
  BHD = 'BHD';
  TND = 'TND';
  JPY = 'JPY';
  isoamt = '';
  enteredCurMethod = false;
  iso;
  threeDecimal = 3;
  length2 = FccGlobalConstant.LENGTH_2;
  val;
  validatorPattern = FccGlobalConstant.AMOUNT_VALIDATION;
  curRequest: CurrencyRequest = new CurrencyRequest();
  currency: SelectItem[] = [];
  bankDetails: BankDetails;
  corporateBanks = [];
  corporateReferences = [];
  references: References;
  entityName: any;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  readonly = this.lcConstant.readonly;
  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  module = `${this.translateService.instant(FccGlobalConstant.LI_ISSUING_BANK_AMOUNT)}`;
  allowedDecimals = -1;
  disabled = this.lcConstant.disabled;
  selectedEntity;
  tnxTypeCode: any;
  nameOrAbbvName: any;
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;
  entityChange$: Subscription;

  constructor(protected commonService: CommonService, protected stateService: ProductStateService,
    protected eventEmitterService: EventEmitterService, protected translateService: TranslateService,
    protected corporateCommonService: CorporateCommonService, protected fccGlobalConstantService: FccGlobalConstantService,
    protected sessionValidation: SessionValidateService, protected confirmationService: ConfirmationService,
    protected multiBankService: MultiBankService, protected dropDownAPIservice: DropDownAPIService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService, protected resolverService: ResolverService,
    protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef, protected taskService: FccTaskService,
    protected currencyConverterPipe: CurrencyConverterPipe, protected liProductService: LiProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, liProductService);
  }

  ngOnInit(): void {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameOrAbbvName = response.TradeIssuingBankNameOrAbbvName;
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
      }
    });
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.initializeFormGroup();
    this.setSelectedEntity();
    this.getCorporateBanks();
    this.getCorporateReferences();
    if (!this.commonService.isUpdateRefSubScribed)
    {
      this.multiBankService.myUpdateRefonEntityChangeSub = this.multiBankService.updateRefonEntityChangeSub.subscribe(
        data => {
          if (data) {
            this.setSelectedEntity();
            this.commonService.isUpdateRefSubScribed = true;
            this.getCorporateBanks();
            this.getCorporateReferences();
          }
        }
      );
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION ||
      this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND){
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      const event = {
        value : this.form.get('bankNameList').value
      };
      this.onClickBankNameList(event);
    }
    this.getCurrencyDetail();
  }

  ngAfterViewInit() {
    const amountValue = this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).value;
    if (amountValue != undefined && amountValue != null && amountValue != '') {
      this.onFocusGuaranteeAmtLi();
      this.onBlurGuaranteeAmtLi();
    }
  }

  ngOnDestroy() {
    const guaranteeAmt = this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).value;
    if(this.nonNumericCurrencyValidator &&
      this.commonService.isNonEmptyValue(guaranteeAmt)){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD_LI, guaranteeAmt,
        this.form.get('currency').value.currencyCode,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    this.stateService.setStateSection(FccGlobalConstant.LI_ISSUING_BANK_AMOUNT, this.form);
    this.onBlurGuaranteeAmtLi();
    if(this.entityChange$) {
      this.entityChange$.unsubscribe();
    }
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.LI_ISSUING_BANK_AMOUNT;
    this.form = this.stateService.getSectionData(sectionName);
    this.checkAmountAgainstCurreny();
    this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD_LI);
    this.onBlurGuaranteeAmtLi();
  }

  getCorporateBanks() {
    this.multiBankService.setCurrentEntity(this.selectedEntity);
    this.setBankNameList();
    const defaultFirst = (this.corporateBanks && this.corporateBanks.length === 1) ? true : false;
    const val = this.dropDownAPIservice.getInputDropdownValue(this.corporateBanks,
      FccGlobalConstant.BANK_NAME_LIST, this.form, defaultFirst);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.BANK_NAME_LIST), { options: this.corporateBanks });
    if (val && this.commonService.isnonEMptyString(val)) {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(val);
    }
    if (this.corporateBanks.length === 1) {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = false;
    }
    if (val && this.commonService.isnonEMptyString(val)) {
      this.multiBankService.setCurrentBank(val, this.selectedEntity);
    }
    if (this.taskService.getTaskBank()){
      if (this.corporateBanks && this.corporateBanks.length === 1) {
        this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(this.taskService.getTaskBank().value);
        this.multiBankService.setCurrentBank(this.taskService.getTaskBank().value);
      } else if (this.corporateBanks && this.corporateBanks.length > 1
         && val && this.commonService.isnonEMptyString(val)) {
        const filteredBank = this.corporateBanks.filter(rec=>rec.value === val);
        if (filteredBank && filteredBank.length > 0){
          this.taskService.setTaskBank(filteredBank[0]);
          this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(this.taskService.getTaskBank().value);
          this.multiBankService.setCurrentBank(this.taskService.getTaskBank().value);
        }
      }
    }else {
      // this.taskService.setTaskBank(this.corporateBanks[0]);
        // Creating issue in case of multibank customer. So checking multibank and if not setting first as default
        if (val && this.commonService.isnonEMptyString(val)) {
          const filteredBank = this.corporateBanks.filter(rec=>rec.value === val);
          if (filteredBank && filteredBank.length > 0){
            this.taskService.setTaskBank(filteredBank[0]);
          } else if (this.corporateBanks && this.corporateBanks.length === 1){
            this.taskService.setTaskBank(this.corporateBanks[0]);
          }
        } else if (this.corporateBanks && this.corporateBanks.length === 1){
          this.taskService.setTaskBank(this.corporateBanks[0]);
        }
      }
      if (this.commonService.getUserDateTimezone() &&
        this.commonService.getUserDateTimezone().getValue() &&
        this.commonService.getUserDateTimezone().getValue() !== this.taskService.getTaskBank()?.timezone) {
        this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.mode == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
        const valObj = { label: String, value: String };
        const valueDisplayed = this.dropDownAPIservice
        .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.BANK_NAME_LIST, this.form);
        valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
        if (valObj) {this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
        if(this.stateService.getSectionData(FccGlobalConstant.LI_ISSUING_BANK_AMOUNT, undefined, false, FccGlobalConstant.EVENT_STATE))
        {
          this.stateService.getSectionData(FccGlobalConstant.LI_ISSUING_BANK_AMOUNT, undefined, false, FccGlobalConstant.EVENT_STATE)
          .get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
        }
      }
    }
    if (this.mode == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropDownAPIservice
      .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.BANK_NAME_LIST, this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj) {this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
      if(this.stateService.getSectionData(FccGlobalConstant.LI_ISSUING_BANK_AMOUNT, undefined, false, FccGlobalConstant.EVENT_STATE))
      {
        this.stateService.getSectionData(FccGlobalConstant.LI_ISSUING_BANK_AMOUNT, undefined, false, FccGlobalConstant.EVENT_STATE)
        .get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
      }
    }
  }
  }

  setBankNameList() {
    if (this.nameOrAbbvName === 'abbv_name') {
      this.corporateBanks = [];
      this.multiBankService.getBankList().forEach(bank => {
        bank.label = bank.value;
        this.corporateBanks.push(bank);
      });
    } else {
      this.corporateBanks = [];
      this.multiBankService.getBankList().forEach(bank => {
        this.corporateBanks.push(bank);
      });
    }
  }

  onClickBankNameList(event) {
    if (event && event.value && this.form.get('bankNameList') && !this.form.get('bankNameList')[this.params][this.disabled]) {
      this.multiBankService.setCurrentBank(event.value, this.selectedEntity);
      const taskBank = this.corporateBanks.filter((item) => item.value === event.value);
      this.taskService.setTaskBank(taskBank[0]);
      if (this.commonService.getUserDateTimezone() && taskBank && taskBank.length > 0 &&
        this.commonService.getUserDateTimezone().getValue() &&
        this.commonService.getUserDateTimezone().getValue() !== taskBank[0].timezone) {
        this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.corporateBanks && this.corporateBanks.length > 1) {
        this.validateOtherSectionDates(this.form.get('bankNameList')[this.params]['sectionToValidate'],
        taskBank[0].timezone);
      }
      this.setIssuerReferenceList();
    }
  }

  getCorporateReferences() {
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ISSUER_REF_LIST), { options: [] });
    this.entityName =
      this.stateService.getSectionData(FccGlobalConstant.LI_APPLICANT_BENEFICIARY).get(FccGlobalConstant.APPLICANT_ENTITY).value.shortName;
    if (this.entityName === '') {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.disabled] = false;
    }
    this.setIssuerReferenceList();
  }

  setIssuerReferenceList() {
    this.corporateReferences = [];
    const referenceList = this.multiBankService.getReferenceList();
    referenceList.forEach(reference => {
      this.corporateReferences.push(reference);
    });
    const isDefaultFirst = this.corporateReferences.length === FccGlobalConstant.LENGTH_1;
    let val = this.dropDownAPIservice.getInputDropdownValue(this.corporateReferences, FccGlobalConstant.ISSUER_REF_LIST, this.form,
      isDefaultFirst);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ISSUER_REF_LIST), { options: this.corporateReferences });
    val = this.multiBankService.updateRefonEntityChange && !isDefaultFirst && !val ? '' : val;
    this.form.get(FccGlobalConstant.ISSUER_REF_LIST).setValue(val);
    if (this.corporateReferences.length === 1) {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.disabled] = false;
    }
    if (this.mode == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropDownAPIservice
      .getDropDownFilterValueObj(this.corporateReferences, FccGlobalConstant.ISSUER_REFERENCE_LIST, this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj) {this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
      if(this.stateService.getSectionData(FccGlobalConstant.LI_ISSUING_BANK_AMOUNT, undefined, false, FccGlobalConstant.EVENT_STATE))
      {
        this.stateService.getSectionData(FccGlobalConstant.LI_ISSUING_BANK_AMOUNT, undefined, false, FccGlobalConstant.EVENT_STATE)
        .get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
      }
    }
  }
  }

  getCurrencyDetail() {
    const requestVal = this.stateService.getValue(FccGlobalConstant.LI_GENERAL_DETAILS, FccGlobalConstant.CREATE_FROM_OPERATIONS, false);
    const requestValArray = [FccGlobalConstant.LICOPY_FROM_LC, FccGlobalConstant.LICOPY_FROM_EL];
    if (requestVal && !(requestValArray.includes(requestVal))) {
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
              this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
              this.updateCurrncyValue();
            }
          });
      }
    } else {
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
            this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
            this.updateCurrncyValue();
          }
        });
    }
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  onKeyupCurrency(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty || keycodeIs === this.lcConstant.thirteen) {
      this.onclickCurrencyAccessibility(this.form.get(FccGlobalConstant.CURRENCY).value);
    }
  }

  onclickCurrencyAccessibility(value) {
    if (value) {
      this.postClickRKeyUpOnCurrency(value);
    }
  }

  onClickCurrency(event) {
    if (event.value) {
      this.postClickRKeyUpOnCurrency(event.value);
    }
  }

  postClickRKeyUpOnCurrency(value) {
    if (value) {
      let guaranteeAmt = this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).value;
      const currency = this.form.get('currency').value.currencyCode;

      if(this.nonNumericCurrencyValidator){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD_LI, guaranteeAmt, currency,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      if (currency && guaranteeAmt) {
        const valueupdated = this.commonService.replaceCurrency(guaranteeAmt);
        guaranteeAmt = this.currencyConverterPipe.transform(valueupdated.toString(), currency);
      }
      if (guaranteeAmt) {
        this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setValue(guaranteeAmt);
      }
      this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD_LI);
    }
  }

  checkAmountAgainstCurreny() {
    if (this.form.get('currency').value !== null && this.form.get('currency').value !== undefined
      && this.form.get('currency').value !== '') {
      if (this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).value <= 0) {
        this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setValue('');
        return;
      }
    }
  }

  onKeyupGuaranteeAmtLi() {
    const amt = this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI);
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD_LI, amt.value,
        this.form.get('currency').value.currencyCode,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
  }

  /*validation on change of amount field*/
  onBlurGuaranteeAmtLi() {
    let guaranteeAmt = this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).value;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD_LI, guaranteeAmt,
        this.form.get('currency').value.currencyCode,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (guaranteeAmt === null || guaranteeAmt === undefined || guaranteeAmt === '') {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).markAsDirty();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setErrors({ amountNotNull: true });
      return;
    }
    if (guaranteeAmt <= 0) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).markAsDirty();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setErrors({ amountCanNotBeZero: true });
      return;
    }
    if (!guaranteeAmt) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).markAsDirty();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setErrors({ required: true });
      return;
    }
    const guaranteeAmtValue = parseFloat(this.commonService.replaceCurrency(guaranteeAmt));
    if ((guaranteeAmtValue && guaranteeAmtValue <= FccGlobalConstant.ZERO) || !guaranteeAmtValue) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setValue(null);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).markAsDirty();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setErrors({ invalidAmt: true });
      return;
    }
    const currency = this.form.get('currency').value.currencyCode;
    if (currency && guaranteeAmtValue) {
      guaranteeAmt = this.currencyConverterPipe.transform(guaranteeAmtValue.toString(), currency);
    }
    if (guaranteeAmt) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setValue(guaranteeAmt);
    } else {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).markAsDirty();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setErrors({ required: true });
    }
    this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD_LI);
  }
  onFocusGuaranteeAmtLi() {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).clearValidators();
    this.OnClickAmountFieldHandler(FccGlobalConstant.AMOUNT_FIELD_LI);
  }
  updateAmountFieldValidation(currency, guaranteeAmt) {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setValue(guaranteeAmt);
    if (currency === FccGlobalConstant.OMR || currency === FccGlobalConstant.BHD || currency === FccGlobalConstant.TND) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).clearValidators();
      this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD_LI,
        Validators.compose([Validators.required, invalidThreeDecimalTransferAmt,
        Validators.pattern(this.validatorPattern)]), 0);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).updateValueAndValidity();
      this.allowedDecimals = FccGlobalConstant.LENGTH_3;
    } else if (currency === FccGlobalConstant.JPY) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).clearValidators();
      this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD_LI,
        Validators.compose([Validators.required, invalidZeroDecimalTransferAmt, Validators.pattern(this.validatorPattern)]), 0);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).updateValueAndValidity();
      this.allowedDecimals = FccGlobalConstant.LENGTH_0;
    } else {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).clearValidators();
      this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD_LI,
        Validators.compose([Validators.required, invalidTwoDecimalTransferAmt, Validators.pattern(this.validatorPattern)]), 0);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).updateValueAndValidity();
      this.allowedDecimals = FccGlobalConstant.LENGTH_2;
    }
    this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD_LI);
  }

  guaranteeAmountValidation(guaranteeAmt) {
    const lCAmt = this.stateService.getValue(FccGlobalConstant.LI_ISSUING_BANK_AMOUNT, 'lcAmount', false).replace(/[^0-9.]/g, '');
    const availableLCAmt = lCAmt ? parseFloat(lCAmt.toString()) : null;
    const guaranteeAmtFloatValue = parseFloat(this.commonService.replaceCurrency(guaranteeAmt));
    if (guaranteeAmtFloatValue === 0) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).clearValidators();
      this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD_LI,
        Validators.compose([Validators.required, zeroAmount]), 0);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setErrors({ zeroAmount: true });
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).markAsDirty();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).markAsTouched();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).updateValueAndValidity();
    } else if (availableLCAmt && guaranteeAmtFloatValue > availableLCAmt) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).clearValidators();
      this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD_LI,
        Validators.compose([Validators.required, guaranteeAmtGreaterThanLCAmt]), 0);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setErrors({ guaranteeAmtGreaterThanLCAmt: true });
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).markAsDirty();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).markAsTouched();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).updateValueAndValidity();
    } else if (guaranteeAmtFloatValue > 0) {
      if (this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).hasError('invalidAmt')) {
        this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).setErrors({ invalidAmt: true });
      } else {
        this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).clearValidators();
        this.form.get(FccGlobalConstant.AMOUNT_FIELD_LI).updateValueAndValidity();
      }
    }
    this.setAmountLengthValidatorList(['lcAmount', FccGlobalConstant.AMOUNT_FIELD_LI]);
  }

  setSelectedEntity() {
    if (this.stateService.getSectionData('liApplicantBeneficiary').get('applicantEntity') &&
    this.stateService.getSectionData('liApplicantBeneficiary').get('applicantEntity').value &&
    this.stateService.getSectionData('liApplicantBeneficiary').get('applicantEntity').value !==
    FccGlobalConstant.BLANK_SPACE_STRING) {
    this.selectedEntity = this.stateService.getSectionData('liApplicantBeneficiary').get('applicantEntity').value;
  }
  if (typeof this.selectedEntity === 'object'){
    this.selectedEntity = this.selectedEntity.shortName;
  }
  }

  updateCurrncyValue() {
    if (this.form.get('currency').value) {
      const currency = this.stateService.getValue(FccGlobalConstant.LI_ISSUING_BANK_AMOUNT, 'currency', false);
      if (currency) {
        const currencyValue = this.currency.filter(task => task.value.label === currency)[0].value;
        if (currencyValue) {
          this.form.get('currency').setValue(currencyValue);
        } else {
          this.form.get('currency').setValue('');
        }
      }
    }
  }

}
