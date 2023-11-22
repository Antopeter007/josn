/* eslint-disable @typescript-eslint/no-unused-vars */
import { TptProductComponent } from '../tpt-product/tpt-product.component';
import { FccConstants } from '../../../../../../common/core/fcc-constants';
import { Component, EventEmitter, OnInit, Output, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, SelectItem } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import moment from 'moment';
import { CommonService } from '../../../../../../common/services/common.service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../../../trade/lc/common/services/product-state.service';
import { SaveDraftService } from '../../../../../trade/lc/common/services/save-draft.service';
import { FormControlService } from '../../../../../trade/lc/initiation/services/form-control.service';
import { PrevNextService } from '../../../../../trade/lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../../../trade/lc/initiation/services/utility.service';
import { HOST_COMPONENT } from '../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FilelistService } from '../../../../../trade/lc/initiation/services/filelist.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { CurrencyConverterPipe } from '../../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import { ProductMappingService } from '../../../../../../common/services/productMapping.service';
import { CustomCommasInCurrenciesPipe } from '../../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { DashboardService } from '../../../../../../common/services/dashboard.service';
import { FtTptProductService } from '../../services/ft-tpt-product.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CashCommonDataService } from './../../../../services/cash-common-data.service';
import { ExchangeRateRequest } from '../../../../../../common/model/xch-rate-request';
import { CurrencyRequest } from '../../../../../../common/model/currency-request';
import { UserData } from '../../../../../../common/model/user-data';
import { SessionValidateService } from '../../../../../../common/services/session-validate-service';
import { DatePipe } from '@angular/common';
import { HolidayCalendarService } from '../../../../../../common/services/holiday-calendar.service';
import { Validators } from '@angular/forms';
import {
  emptyCurrency,
  orderingAndTransfereeAccountNotBeSame,
  zeroAmount,
} from './../../../../../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { CorporateCommonService } from '../../../../../../corporate/common/services/common.service';
import { transferDateIsExceedingFutureDate, transferDateIsHoliday, transferDateLessThanCurrentDate } from './../../../../../../corporate/trade/lc/initiation/validator/ValidateDates';
import { RecurringTransferService } from '../../services/recurring-transfer.service';
import { FtCashProductService } from '../../../../../cash/ft/cash-fund-transfer/services/ft-cash-product.service';

@Component({
  selector: 'app-tpt-general-details',
  templateUrl: './tpt-general-details.component.html',
  styleUrls: ['./tpt-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TptGeneralDetailsComponent }]
})
export class TptGeneralDetailsComponent extends TptProductComponent implements OnInit, OnDestroy , AfterViewInit {
  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  module = `${this.translateService.instant('tptGeneralDetails')}`;
  contextPath: any;
  progressivebar: number;
  barLength: any;
  mode: any;
  tnxTypeCode: any;
  option: any;
  xchRequest: ExchangeRateRequest = new ExchangeRateRequest();
  curRequest: CurrencyRequest = new CurrencyRequest();
  currency: SelectItem[] = [];
  updatedEmail: boolean;
  productCode: any;
  subProductCode: any;
  enteredCurMethod = false;
  beneIdValidationRegex: any;
  iso: any;
  isoamt: any;
  val: any;
  flagDecimalPlaces: number;
  allowedDecimals = -1;
  beneregex: any;
  maxDate: string;
  dateFormat: string;
  amountValidationConfig : any;
  bankDetails: any;
  dateError: any;
  refId: string;
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
    protected holidayCalendarService: HolidayCalendarService,
    protected router: Router, protected translateService: TranslateService,
    protected prevNextService: PrevNextService,
    protected utilityService: UtilityService, protected saveDraftService: SaveDraftService,
    protected searchLayoutService: SearchLayoutService,
    protected formModelService: FormModelService, protected formControlService: FormControlService,
    protected stateService: ProductStateService, protected route: ActivatedRoute,
    protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
    protected dialogService: DialogService,
    public fccGlobalConstantService: FccGlobalConstantService, protected productMappingService: ProductMappingService,
    protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
    protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected resolverService: ResolverService, protected fileListSvc: FilelistService,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected ftTptProductService: FtTptProductService,
    protected multiBankService: MultiBankService,
    protected corporateCommonService: CorporateCommonService,
    protected dropdownAPIService: DropDownAPIService,
    protected taskService: FccTaskService, protected sessionValidation: SessionValidateService,
    protected dashboardService: DashboardService, protected cashCommonDataService: CashCommonDataService,
    protected recurringService: RecurringTransferService,
    public datepipe: DatePipe, protected cashFtService: FtCashProductService) {
super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, ftTptProductService);
}
  ngAfterViewInit(): void {
    if (this.dateError !== null && this.dateError !== undefined) {
      this.form.get(FccGlobalConstant.FT_TRANSFER_DATE).setErrors(this.dateError);
      this.form.get(FccGlobalConstant.FT_TRANSFER_DATE).markAsTouched();
    }
    if(this.form.get(FccGlobalConstant.FT_AMOUNT_FIELD).errors !== null &&
      this.form.get(FccGlobalConstant.FT_AMOUNT_FIELD).errors.maxlength !== undefined) {
        this.form.get(FccGlobalConstant.FT_AMOUNT_FIELD).setErrors(null);
    }
 }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.queryParams.subscribe((data) => {
      if(data && data.refId) {
        this.refId = data.refId;
      }
    });

    this.corporateCommonService.getValues(this.fccGlobalConstantService.corporateBanks).subscribe(response => {
      if(response.status === 200) {
        this.bankDetails = response.body;
        if(this.refId) {
          if(this.form && this.form.value && this.form.value.ftAmt && this.form.value.ftCurCode &&
          this.form.value.Bank) {
            let amount;
            if(this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.FT_AMOUNT_FIELD).value)){
              amount = this.form.get(FccGlobalConstant.FT_AMOUNT_FIELD).value;
              amount = amount.replace(/,/g,'');
              amount = parseInt(amount).toString();
            }
            this.getCutoffTime(this.form.value.ftCurCode.shortName,amount, this.form.value.Bank.shortName);
          }
        }
      }
    });

    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
    this.initializeFormGroup();
    this.recurringService.initialize(this.form,this.productCode,this.subProductCode,"ftRecurringTransferToggle");
    this.form = this.recurringService.recurringftFrequency(this.form);
    this.form.updateValueAndValidity();
    this.barLength = this.leftSectionService.progressBarPerIncrease(FccConstants.FT_TPT_GENERAL_DETAILS);
    this.recurringService.ValidateNoOfTransactions(this.form);
    this.recurringService.getstartDateForRecurring(this.form,this.productCode,this.subProductCode);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.beneregex = response.beneValidationAccNoRegex;
        this.beneIdValidationRegex = response.beneNameValidationRegex;
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
      }
    });
    this.leftSectionService.progressBarData.subscribe(
    data => {
    this.progressivebar = data;
    }
    );
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (mode === FccGlobalConstant.INITIATE) {
      this.dateError = this.form.get(FccGlobalConstant.FT_TRANSFER_DATE).errors;
    }
   this.onClickFtRecurringTransferToggle('');

    this.holidayCalendarService.holidaysList.subscribe(
      data => {
        if(data) {
          this.setHolidayList(FccGlobalConstant.FT_START_DATE);
          if (!(this.form.get(FccGlobalConstant.FT_TRANSFER_DATE).status === FccConstants.STATUS_INVALID)) {
            this.holidayCalendarService.validateDate(this.form,FccGlobalConstant.FT_TRANSFER_DATE);
          }
          this.holidayCalendarService.validateDate(this.form,FccGlobalConstant.FT_START_DATE);
          this.recurringService.validateStartDate(this.form ,FccGlobalConstant.FT_START_DATE);
          this.holidayCalendarService.holidaysList.next(false);
        }
      }
    );
    this.form.addFCCValidators(
      'ftBeneficiaryName',
      Validators.pattern(this.beneIdValidationRegex),
          0
      );
    if(mode === 'view'){
      this.onClickFtRecurringTransferToggle('');
      this.onClickRecurringftFrequency('');
    } else if (mode === FccGlobalConstant.DRAFT_OPTION) {
      this.dateError = this.form.get(FccGlobalConstant.FT_TRANSFER_DATE).errors;
    }
  }

  addFccValidation(validationError, validationField:string){
    if(this.commonService.isNonEmptyValue(validationError)){
      this.form.get(validationField).clearValidators();
      this.form.addFCCValidators(validationField, Validators.compose([() => validationError]), 0);
      this.form.get(validationField).updateValueAndValidity();
      this.form.get(validationField).markAsTouched();
      this.form.get(validationField).markAsDirty();
    }
  }

  initializeFormGroup() {
    const sectionName = FccConstants.FT_TPT_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    if(this.form.get('ftBeneActPab').value === 'Y') {
      this.form.get(FccGlobalConstant.FT_BENE_NAME)['params']['shortDescription']
      = `${this.translateService.instant(FccGlobalConstant.FT_PAB_MESSAGE)}`;
      this.form.get(FccGlobalConstant.FT_BENE_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = 'readonly-input';
      this.form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = 'readonly-input';
      this.form.get(FccGlobalConstant.FT_BENE_NAME)[FccGlobalConstant.PARAMS].readonly = true;
      this.form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS].readonly = true;
      this.form.get(FccGlobalConstant.FT_BENE_CUR_CODE)[FccGlobalConstant.PARAMS].readonly = true;
    } else {
      this.form.get(FccGlobalConstant.FT_BENE_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = '';
      this.form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = '';
      this.form.get(FccGlobalConstant.FT_BENE_NAME)[FccGlobalConstant.PARAMS].readonly = false;
      this.form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS].readonly = false;
      this.form.get(FccGlobalConstant.FT_BENE_CUR_CODE)[FccGlobalConstant.PARAMS].readonly = false;
    }
    this.xchRequest.userData = new UserData();
    this.xchRequest.userData.userSelectedLanguage = FccGlobalConstant.LANGUAGE_EN;
    this.curRequest.userData = this.xchRequest.userData;
    this.getCurrencyDetail();
    if(this.commonService.isnonBlankString(this.form.get('ftEmailAddressText').value) ||
    this.form.get('ftEmailAddressChips')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS].length > 0) {
      this.form.get('ftEmailAddressText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]= true;
    }
    this.form = this.cashCommonDataService.loadEntity(this.form, FccGlobalConstant.FT_ENTITY, FccGlobalConstant.FT_BANK);
    this.form = this.cashCommonDataService.loadBankList(this.form, FccGlobalConstant.FT_BANK, FccGlobalConstant.FT_ENTITY);
    this.form.get('productType').setValue(this.subProductCode);
    this.form.get('applicantActPAB').setValue(this.form.get('ftBeneActPab').value);
    this.form.get('baseCurCode').setValue(this.commonService.getBaseCurrency());
    this.form.get('ftType').setValue(FccGlobalConstant.FT_TYPE_CODE);
    this.form.updateValueAndValidity();
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  getCurrencyDetail() {
    if (this.form.get('ftCurCode')[FccGlobalConstant.OPTIONS] && this.form.get('ftCurCode')[FccGlobalConstant.OPTIONS].length === 0) {
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
            this.patchFieldParameters(this.form.get('ftCurCode'), { options: this.currency });
            this.patchFieldParameters(this.form.get('ftBeneficiaryCurCode'), { options: this.currency });
          }
          if (this.form.get('ftCurCode').value !== FccGlobalConstant.EMPTY_STRING) {
            const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency, 'ftCurCode', this.form);
            if (valObj) {
              this.form.get('ftCurCode').patchValue(valObj[`value`]);
            }
          }
          if (this.form.get('ftBeneficiaryCurCode').value !== FccGlobalConstant.EMPTY_STRING) {
            const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency, 'ftBeneficiaryCurCode', this.form);
            if (valObj) {
              this.form.get('ftBeneficiaryCurCode').patchValue(valObj[`value`]);
            }
          }
        });
    }
  }

  onClickFtEntity(event: any) {
    if (event?.value) {
      this.form.get(FccGlobalConstant.FT_BANK).setValue(null);
      this.resetFields();
      this.form.get(FccGlobalConstant.FT_ENTITY).setValue(event.value);
      this.form.get(FccGlobalConstant.FT_ENTITY_NAME).setValue(event?.value?.name);
      this.form.get(FccGlobalConstant.FT_BANK)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form = this.cashCommonDataService.loadBankList(this.form, FccGlobalConstant.FT_BANK, FccGlobalConstant.FT_ENTITY, false);
      this.form.updateValueAndValidity();
      this.fetchBankHolidays();
    }
  }

  onClickBank(event: any) {
    if (event?.value) {
      this.resetFields();
      this.form.get(FccGlobalConstant.FT_BANK).setValue(event.value);
    }
    this.form.get(FccGlobalConstant.FT_BANK).updateValueAndValidity();
    this.recurringService.initialize(this.form,this.productCode,this.subProductCode,"ftRecurringTransferToggle");
    this.fetchBankHolidays();
  }

  onClickFtRecurringTransferToggle(event: any) {
   this.recurringService.recurringServiceFtRecurringTransferToggle(this.form,event);
   if(event.checked || this.form.get('ftRecurringTransferToggle').value === 'Y') {
    this.recurringService.validateStartDate(this.form ,FccGlobalConstant.FT_START_DATE);
    this.recurringService.showEndDate(this.form);

   }
   this.fetchBankHolidays();
   if (!(this.form.get(FccGlobalConstant.FT_TRANSFER_DATE).status === FccConstants.STATUS_INVALID)) {
    this.holidayCalendarService.validateDate(this.form,FccGlobalConstant.FT_TRANSFER_DATE);
   }
   this.holidayCalendarService.validateDate(this.form,FccGlobalConstant.FT_START_DATE);

  }

  onClickRecurringftFrequency(event: any){
    this.recurringService.onclickfrequencyDropdown(event,this.form);
    this.recurringService.ValidateNoOfTransactions(this.form);
  }

  onClickRecurringftStartDate(){
    this.recurringService.validateStartDate(this.form,FccGlobalConstant.FT_START_DATE);
    this.form.get(FccGlobalConstant.FT_TRANSFER_DATE).setValue(
      this.form.get(FccGlobalConstant.FT_START_DATE).value);
    this.form.get(FccGlobalConstant.FT_TRANSFER_DATE).updateValueAndValidity();
  }

  onBlurRecurringftNoOfTransactions(){
    this.recurringService.ValidateNoOfTransactions(this.form);

  }

  onClickRecurringftNoOfTransactions(){
    this.recurringService.ValidateNoOfTransactions(this.form);
  }

  onClickFtNotifyBeneficiaryToggle(event: any) {
    const children = [
      'ftNotifyBeneficiaryEmailOptions',
      'ftEmailAddressText',
      'ftEmailAddressAddButton',
      'ftEmailAddressChips'
    ];
    if(event?.checked) {
      if (this.form.get('ftNotifyBeneficiaryEmailOptions').value === 'default_email') {
        children.slice(0,2).forEach((key) => {
          this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]= true;
          this.form.get(key).updateValueAndValidity();
        });
        if(this.commonService.isnonEMptyString(this.commonService.beneDefaultEmailId)){
          this.form.get('ftEmailAddressText').setValue(this.commonService.beneDefaultEmailId);
        }
      } else {
        this.form.get('ftEmailAddressText').setValue(null);
        children.forEach((key) => {
          this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]= true;
          this.form.get(key).updateValueAndValidity();
        });
      }
    } else {
      this.form.get('ftEmailAddressText').setValue(null);
      children.forEach((key) => {
        this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]= false;
        this.form.get(key).updateValueAndValidity();
      });
    }
  }

  onClickFtNotifyBeneficiaryEmailOptions(event: any) {
    const keys = ['ftEmailAddressAddButton', 'ftEmailAddressChips'];
    this.patchFieldParameters(this.form.get('ftEmailAddressChips'), { options: [] });
    if(event?.value) {
      if (event?.value === 'default_email') {
        keys.forEach((key) => {
          this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]= false;
          if (key === keys[1]) {
            this.patchFieldParameters(this.form.get(key), { options: [] });
          }
          this.form.get(key).updateValueAndValidity();
        });
        if(this.commonService.isnonEMptyString(this.commonService.beneDefaultEmailId)){
          this.form.get('ftEmailAddressText').setValue(this.commonService.beneDefaultEmailId);
        }
        this.form.get('ftEmailAddressTextDummy').setValue(this.form.get('ftEmailAddressText').value);
        this.form.get('ftEmailAddressText')[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = true;
      } else {
        keys.forEach((key) => {
          this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]= true;
          this.form.get(key).updateValueAndValidity();
        });
        if(this.commonService.isnonEMptyString(this.commonService.beneDefaultEmailId)){
          this.form.get('ftEmailAddressText').setValue(null);
        }
        this.form.get('ftEmailAddressText')[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = false;
        this.form.get('ftEmailAddressTextDummy').setValue(this.form.get('ftEmailAddressText').value);
      }
    }
    this.form.updateValueAndValidity();
  }

  onBlurFtEmailAddressText(_event: any) {
    if (this.commonService.isnonBlankString(this.form.get('ftEmailAddressText').value) &&
    this.form.get('ftNotifyBeneficiaryEmailOptions').value === 'default_email') {
      this.form.get('ftEmailAddressTextDummy').setValue(this.form.get('ftEmailAddressText').value);
    }
  }

  onKeyupFtEmailAddressAddButton(event: any) {
    if (event.keyCode === FccGlobalConstant.LENGTH_13){
      this.onClickFtEmailAddressAddButton(event);
    }
  }

  onClickFtEmailAddressAddButton(_event: any) {
    if (this.commonService.isnonEMptyString(this.form.get('ftEmailAddressText').value)) {
      const opts = this.form.get('ftEmailAddressChips')[FccGlobalConstant.PARAMS]['options'];
      if (opts?.length) {
        opts.push({
          label: this.form.get('ftEmailAddressText').value,
          value: this.form.get('ftEmailAddressText').value,
          disabled: false,
          icon: undefined
        });
        this.patchFieldParameters(this.form.get('ftEmailAddressChips'), { options: opts });
        this.setEmailAddress(opts);
        this.form.get('ftEmailAddressText').reset();
        this.form.updateValueAndValidity();
      } else {
        this.patchFieldParameters(this.form.get('ftEmailAddressChips'), { options: [] });
        opts.push({
          label: this.form.get('ftEmailAddressText').value,
          value: this.form.get('ftEmailAddressText').value,
          disabled: false,
          icon: undefined
        });
        this.patchFieldParameters(this.form.get('ftEmailAddressChips'), { options: opts });
        this.form.get('ftEmailAddressText').reset();
        this.form.updateValueAndValidity();
      }
    }
  }

  setEmailAddress(opts: any[]) {
    let emailAddress = '';
    opts.forEach((opt, i) => {
      if (i === 0) {
        emailAddress = emailAddress.concat(opt.label);
      } else {
        emailAddress = emailAddress.concat(';').concat(opt.label);
      }
    });
    this.form.get('ftEmailAddressTextDummy').setValue(emailAddress);
  }

  onKeypressCancelIcon(event: any, value: any) {
    if (event.keyCode === FccGlobalConstant.LENGTH_13){
      this.onClickCancelIcon(event, value);
    }
  }

  onClickCancelIcon(_event: any, value: any) {
    let opts = this.form.get('ftEmailAddressChips')[FccGlobalConstant.PARAMS]['options'];
    opts = opts.filter((obj) => opts.findIndex(() => obj.label === value));
    this.setEmailAddress(opts);
    this.patchFieldParameters(this.form.get('ftEmailAddressChips'), { options: [...opts] });
    this.form.get('ftEmailAddressText').reset();
    this.form.updateValueAndValidity();
  }

  onClickFtTransferFromIcons(_event: any) {
    this.cashCommonDataService.getTransferFromLookup(this.form);
  }

  onBlurRecurringftStartDate(){
    this.fetchBankHolidays();
    this.holidayCalendarService.validateDate(this.form,FccGlobalConstant.FT_START_DATE);
    this.recurringService.validateStartDate(this.form ,FccGlobalConstant.FT_START_DATE);
  }

   onClickFtTransferDate() {
    this.holidayCalendarService.validateDate(this.form,FccGlobalConstant.FT_TRANSFER_DATE);
   }

  onClickFtBeneficiaryLookUpIcon(_event: any) {
    if (this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.FT_TRANSFER_FROM).value)) {
      this.form.get(FccGlobalConstant.FT_BENE_NAME).clearValidators();
      this.form.get(FccGlobalConstant.FT_BENE_NAME).setErrors({ invalidBeneNameField: true });
      this.form.get(FccGlobalConstant.FT_BENE_NAME).markAsDirty();
      this.form.get(FccGlobalConstant.FT_BENE_NAME).markAsTouched();
    } else {
      this.form.get(FccGlobalConstant.FT_BENE_NAME).setErrors(null);
      this.form.get(FccGlobalConstant.FT_BENE_NAME).updateValueAndValidity();
      this.cashCommonDataService.getTranserToLookup(this.form);
      if (this.form.get('ftBeneActPab').value === 'Y') {
        this.form.get(FccGlobalConstant.FT_BENE_NAME)['params']['shortDescription']
          = `${this.translateService.instant(FccGlobalConstant.FT_PAB_MESSAGE)}`;
      }
      this.form.get('applicantActPAB').setValue(this.form.get('ftBeneActPab').value);
    }
  }

  onKeyupFtTransferFromIcons(event: any) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === FccGlobalConstant.LENGTH_13) {
      this.cashCommonDataService.getTransferFromLookup(this.form);
    }
  }

  onKeyupFtBeneficiaryLookUpIcon(event: any) {
    if (this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.FT_TRANSFER_FROM).value)) {
      this.form.get(FccGlobalConstant.FT_BENE_NAME).clearValidators();
      this.form.get(FccGlobalConstant.FT_BENE_NAME).setErrors({ invalidBeneNameField: true });
      this.form.get(FccGlobalConstant.FT_BENE_NAME).markAsDirty();
      this.form.get(FccGlobalConstant.FT_BENE_NAME).markAsTouched();
    } else {
      this.form.get(FccGlobalConstant.FT_BENE_NAME).setErrors(null);
      this.form.get(FccGlobalConstant.FT_BENE_NAME).updateValueAndValidity();
      const keycodeIs = event.which || event.keyCode;
      if (keycodeIs === FccGlobalConstant.LENGTH_13) {
        this.cashCommonDataService.getTranserToLookup(this.form);
      }
    }
  }

  onClickFtCurCode(event){
    this.fetchBankHolidays();
    this.onClickCurrency(event);
    this.holidayCalendarService.validateDate(this.form,FccGlobalConstant.FT_TRANSFER_DATE);
    this.holidayCalendarService.validateDate(this.form,FccGlobalConstant.FT_START_DATE);
    this.recurringService.validateStartDate(this.form ,FccGlobalConstant.FT_START_DATE);

  }

  onOpenFtTransferDate(){
    this.fetchBankHolidays();
    this.holidayCalendarService.validateDate(this.form,FccGlobalConstant.FT_TRANSFER_DATE);
  }
  onOpenrecurringftStartDate(){
    this.fetchBankHolidays();
    this.form.get(FccGlobalConstant.FT_START_DATE).updateValueAndValidity();
    this.holidayCalendarService.validateDate(this.form,FccGlobalConstant.FT_START_DATE);
    this.recurringService.validateStartDate(this.form ,FccGlobalConstant.FT_START_DATE);

  }

  fetchBankHolidays(){
    let currCode = null, bankAbbvName = null;

    if(this.form.get(FccGlobalConstant.FT_CURRCODE) &&
    this.form.get(FccGlobalConstant.FT_CURRCODE).value &&
    this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.FT_CURRCODE).value.label)){
      currCode = this.form.get(FccGlobalConstant.FT_CURRCODE).value.label;
    }

    if(this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.FT_ENTITY).value.label)){
      bankAbbvName = this.form.get(FccGlobalConstant.FT_BANK).value?.label;
    }
    this.holidayCalendarService.prepareHolidayList(this.productCode, this.subProductCode,currCode,null,bankAbbvName);
    this.setHolidayList(FccGlobalConstant.FT_TRANSFER_DATE);
    this.setHolidayList(FccGlobalConstant.FT_START_DATE);
    this.form.get(FccGlobalConstant.FT_START_DATE).updateValueAndValidity();
  }

  setHolidayList(element: string) {
    const today = new Date();
    if(this.form.get(element)) {
      this.form.get(element)[FccGlobalConstant.PARAMS]['holidayList']
      = this.holidayCalendarService.holidayList;
      this.form.get(element)[FccGlobalConstant.PARAMS]['holidayTitleList']
      = this.holidayCalendarService.dateTooltipList;
      if(this.commonService.isNonEmptyValue(this.holidayCalendarService.timeperiod)) {
      this.form.get(element)[FccGlobalConstant.PARAMS]['maxDate']
      = new Date(new Date().setDate(today.getDate() + Number(this.holidayCalendarService.timeperiod)));
      }
    }
  }

  onBlurFtTransferDate() {
    this.validateExpiryDate();
      }

  validateExpiryDate() {
    if (this.form.get(FccGlobalConstant.TRANSFER_DATE).value) {
      this.form.get(FccGlobalConstant.TRANSFER_DATE).updateValueAndValidity();
    }
  }

  onClickCurrency(event) {
    this.cashFtService.onClickCurrency(this.form,FccGlobalConstant.FT_AMOUNT_FIELD ,event);
     this.setAmountLengthValidator(FccGlobalConstant.FT_AMOUNT_FIELD);
     if(event.value?.currencyCode){
       this.checkAmountValidation(event.value?.currencyCode, this.form.get('ftBeneActId').value);
     }
     this.fetchBankHolidays();
      this.form.get('ftAmt').updateValueAndValidity();
    }

    checkAmountValidation(currency, accountId){
      if(this.form.get(FccGlobalConstant.FT_BANK)){
        this.cashCommonDataService.checkAmountValidation(this.form.get(FccGlobalConstant.FT_BANK).value?.label,
          currency, accountId).subscribe(res =>{
            if(res){
              this.amountValidationConfig = res;
              if(this.amountValidationConfig?.error){
                const validationError = { exchangeRateNotFound: { currency : this.amountValidationConfig.currency } };
                this.form.addFCCValidators(FccGlobalConstant.FT_CURRCODE, Validators.compose([() => validationError]), 0);
                this.form.get(FccGlobalConstant.FT_CURRCODE).updateValueAndValidity();
              } else {
                this.form.get(FccGlobalConstant.FT_CURRCODE).clearValidators();
                this.form.get(FccGlobalConstant.FT_CURRCODE).updateValueAndValidity();
                this.validateMaxAmount();
              }
            }
        });
      }
    }

  onClickFtAmt() {
    this.OnClickAmountFieldHandler(FccGlobalConstant.FT_AMOUNT_FIELD);
  }

  onFocusFtAmt() {
    this.OnClickAmountFieldHandler(FccGlobalConstant.FT_AMOUNT_FIELD);
  }

  onKeyupFtAmt(){
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.FT_AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.FT_AMOUNT_FIELD,
        this.form.get(FccGlobalConstant.FT_AMOUNT_FIELD).value, this.iso, this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
  }

  onBlurFtAmt() {
    let currCode = null;
    let bankAbbvName = null;
    let amount = null;
    if(this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.FT_CURRCODE).value.label)){
      currCode = this.form.get(FccGlobalConstant.FT_CURRCODE).value.label;
    }
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.FT_CURRCODE).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.FT_CURRCODE,
        this.form.get(FccGlobalConstant.FT_CURRCODE).value, this.iso, this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if(this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.FT_ENTITY).value.label)){
      bankAbbvName = this.form.get(FccGlobalConstant.FT_BANK).value?.label;
    }

    if(this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.FT_AMOUNT_FIELD).value)){
      amount = this.form.get(FccGlobalConstant.FT_AMOUNT_FIELD).value;
      amount = amount.replace(/,/g,'');
      amount = parseInt(amount).toString();
    }
    if(amount && currCode) {
      this.getCutoffTime(currCode,amount, bankAbbvName);
    }

    this.cashFtService.onBlurAmt(this.form,FccGlobalConstant.FT_AMOUNT_FIELD);
    this.setAmountLengthValidator(FccGlobalConstant.FT_AMOUNT_FIELD);
    this.validateMaxAmount();
  }

  getCutoffTime(currCode, amount, bankAbbvName) {
    this.cashCommonDataService.getHolidayCutoff(currCode,amount, this.subProductCode,bankAbbvName,
      this.bankDetails.timezone).subscribe((response)=>{
      let cutOffTime;
      if (response && response.time) {
        cutOffTime = response.time.split(':')
        .map((item) => item.length == 1 ? FccGlobalConstant.ZERO_STRING+item : item).join(':');
        this.form.get(FccGlobalConstant.FT_NOTE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.FT_NOTE).setValue(`${this.translateService.instant(FccGlobalConstant.FT_NOTE,
        { cutOffTime:`${moment().tz(this.bankDetails.timezone).
          format(FccGlobalConstant.DATE_FORMAT_1.toUpperCase())} ${cutOffTime}
          ${ moment().tz(this.bankDetails.timezone).format('z') }` })}`);
      } else {
        this.form.get(FccGlobalConstant.FT_NOTE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.FT_NOTE).setValue(null);
      }
      this.form.updateValueAndValidity();
    });
  }

  validateMaxAmount(){
    const amt = this.form.get(FccGlobalConstant.FT_AMOUNT_FIELD);
    if(this.amountValidationConfig?.maxAmount && amt.value &&
      this.commonService.removeAmountFormatting(amt.value) > this.amountValidationConfig?.maxAmount){
      const validationError = { pabMaxAmountValidation: { currency : this.amountValidationConfig.currency,
        maxAmount: this.currencyConverterPipe.transform(this.amountValidationConfig.maxAmount.toString(),
        this.amountValidationConfig.currency) } };
      this.form.addFCCValidators(FccGlobalConstant.FT_AMOUNT_FIELD, Validators.compose([() => validationError]), 0);
      this.form.get(FccGlobalConstant.FT_AMOUNT_FIELD).updateValueAndValidity();
    }
  }

  onBlurFtBeneficiaryAccount() {
    this.form.addFCCValidators(
      'ftBeneficiaryAccount',
      Validators.pattern(this.beneregex),
      0
    );
  }

  onKeyupFtBeneficiaryName(){
    if (this.form.get(FccGlobalConstant.FT_BENE_ACC).value){
      this.form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED]= false;
      this.form.get(FccGlobalConstant.FT_BENE_CUR_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED]= false;
      this.form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS].readonly = false;
      this.form.get(FccGlobalConstant.FT_BENE_CUR_CODE)[FccGlobalConstant.PARAMS].readonly = false;
      this.form.get(FccGlobalConstant.FT_BENE_ACC).setValue(null);
      this.form.get(FccGlobalConstant.FT_BENE_CUR_CODE).setValue(null);
    }
  }

  onClickFtBeneficiaryCurCode(){
    if (this.form.get(FccGlobalConstant.FT_BENE_CUR_CODE).value){
      this.form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED]= false;
      this.form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS].readonly = false;
      this.form.get(FccGlobalConstant.FT_BENE_ACC).setValue(null);
    }
  }

  resetFields() {
    this.form.get(FccGlobalConstant.FT_TRANSFER_FROM).setValue(null);
    this.form.get(FccGlobalConstant.FT_BENE_NAME).setValue(null);
    this.form.get(FccGlobalConstant.FT_BENE_NAME)['params']['shortDescription'] = "";
    this.form.get(FccGlobalConstant.FT_BENE_ACC).setValue(null);
    this.form.get(FccGlobalConstant.FT_BENE_CUR_CODE).setValue(null);
    this.form.get(FccGlobalConstant.FT_BENE_NAME)[FccGlobalConstant.PARAMS].readonly = false;
    this.form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS].readonly = false;
    this.form.get(FccGlobalConstant.FT_BENE_CUR_CODE)[FccGlobalConstant.PARAMS].readonly = false;
    this.form.get(FccGlobalConstant.FT_BENE_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = '';
    this.form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = '';
  }

  ngOnDestroy(): void {
    if(this.nonNumericCurrencyValidator &&
      this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.FT_CURRCODE).value)){
      this.form.get(FccGlobalConstant.FT_CURRCODE).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.FT_CURRCODE,
        this.form.get(FccGlobalConstant.FT_CURRCODE).value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    this.recurringService.ValidateNoOfTransactions(this.form);
    this.stateService.setStateSection(FccConstants.FT_TPT_GENERAL_DETAILS, this.form);
    if (this.form && this.form.get('ftNotifyBeneficiaryEmailOptions').value === 'alternative_email') {
      this.form.get('ftEmailAddressText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]= false;
    }
  }

  onChangeAmountToUtilise(){
    this.commonService.amountValidation(this.form, this.currency);
  }

  onClickFtBeneficiaryName(){
    this.validateBeneficiaryNameField();
  }

  onChangeFtBeneficiaryName(){
    this.validateBeneficiaryNameField();
  }

  validateBeneficiaryNameField(){
    if (this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.FT_TRANSFER_FROM).value)) {
      this.form.get(FccGlobalConstant.FT_BENE_NAME).clearValidators();
      this.form.get(FccGlobalConstant.FT_BENE_NAME).setErrors({ invalidBeneNameField: true });
      this.form.get(FccGlobalConstant.FT_BENE_NAME).markAsDirty();
      this.form.get(FccGlobalConstant.FT_BENE_NAME).markAsTouched();
    } else {
      this.form.get(FccGlobalConstant.FT_BENE_NAME).setErrors(null);
      this.form.get(FccGlobalConstant.FT_BENE_NAME).updateValueAndValidity();
    }
  }
}
