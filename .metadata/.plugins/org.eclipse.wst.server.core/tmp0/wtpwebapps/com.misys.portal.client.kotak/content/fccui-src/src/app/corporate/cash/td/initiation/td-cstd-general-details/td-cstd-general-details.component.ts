import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, SelectItem } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { iif, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FCCFormGroup, FCCMVFormControl } from '../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CodeData } from '../../../../../common/model/codeData';
import { CurrencyRequest } from '../../../../../common/model/currency-request';
import { Entities } from '../../../../../common/model/entities';
import { UserData } from '../../../../../common/model/user-data';
import { ExchangeRateRequest } from '../../../../../common/model/xch-rate-request';
import { CodeDataService } from '../../../../../common/services/code-data.service';
import { CommonService } from '../../../../../common/services/common.service';
import { DashboardService } from '../../../../../common/services/dashboard.service';
import { DropDownAPIService } from '../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { MultiBankService } from '../../../../../common/services/multi-bank.service';
import { PhrasesService } from '../../../../../common/services/phrases.service';
import { ProductMappingService } from '../../../../../common/services/productMapping.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../common/services/session-validate-service';
import { TransactionDetailService } from '../../../../../common/services/transactionDetail.service';
import { emptyCurrency } from '../../../../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { compareNewAmountToOld } from '../../../../../corporate/trade/lc/initiation/validator/ValidateLastShipDate';
import { HOST_COMPONENT } from '../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LeftSectionService } from '../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../../trade/lc/common/services/product-state.service';
import { SaveDraftService } from '../../../../trade/lc/common/services/save-draft.service';
import { CurrencyConverterPipe } from '../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../trade/lc/initiation/services/filelist.service';
import { FormControlService } from '../../../../trade/lc/initiation/services/form-control.service';
import { PrevNextService } from '../../../../trade/lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../../trade/lc/initiation/services/utility.service';
import { CashCommonDataService } from '../../../services/cash-common-data.service';
import { TdCstdProductService } from '../../services/td-cstd-product.service';
import { TdCstdProductComponent } from '../td-cstd-request-product/td-cstd-product.component';
import { FccConstants } from './../../../../../common/core/fcc-constants';
import { compareValueDateToCurrentDate } from '../../../../../corporate/trade/lc/initiation/validator/ValidateDates';
import moment from 'moment';
//convert below statement to import
//const moment = require('moment');

@Component({
  selector: 'app-td-cstd-general-details',
  templateUrl: './td-cstd-general-details.component.html',
  styleUrls: ['./td-cstd-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TdCstdGeneralDetailsComponent }]
})
export class TdCstdGeneralDetailsComponent extends TdCstdProductComponent implements OnInit, AfterViewInit {

  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  module = `${this.translateService.instant(FccConstants.TD_CSTD_GENERAL_DETAILS)}`;
  contextPath: any;
  progressivebar: number;
  barLength: any;
  mode: any;
  tnxTypeCode: any;
  option: any;
  entity: Entities;
  entities = [];
  accounts: SelectItem[] = [];
  placementAccounts: SelectItem[] = [];
  flag = false;
  entityId: string;
  fetching = true;
  entityDataArray = [];
  codeID: any;
  productCode: any;
  subProductCode: any;
  codeData = new CodeData();
  dataArray: any;
  list: any[];
  bankName: any;
  paramList653: any;
  paramList654: any;
  depositTypeList: any;
  maturityInstList: any;
  tenorPeriodList: any;
  currencyList: any;
  selectedDT: any;
  xchRequest: ExchangeRateRequest = new ExchangeRateRequest();
  curRequest: CurrencyRequest = new CurrencyRequest();
  cur = [];
  sameAccountFlag = false;
  tdPlacementaccountEnabled = 'td.placementaccount.enabled';
  paramListValue: any;
  yearVal = 0;
  monthVal = 0;
  daysVal = 0;
  isCustomTenorApplicable: any;
  customTenorYearVal: any;
  customTenorMonthVal: any;
  customTenoreMinDays: any;
  customTenoreMaxDays: any;
  customTenorMaxYears: any;
  err: any;
  maxMonths: any;
  maxDays: any;
  additionalDays = 0;
  country: any;
  isMasterRequired: boolean;
  placementAccountEnable: boolean;
  iso;
  val;
  isoamt = '';
  flagDecimalPlaces;
  enteredCurMethod = false;
  tenorPeriodEditArray = [];
  typeArray = [];
  errMsg: any;
  isYearValid = true;
  startDate: moment.Moment;
  currentDate: moment.Moment;
  endDate: moment.Moment;
  finalDate: moment.Moment;
  totalDays = 0;
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService,
              protected translationService: TranslateService,
              protected prevNextService: PrevNextService,
              protected utilityService: UtilityService, protected saveDraftService: SaveDraftService,
              protected searchLayoutService: SearchLayoutService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected stateService: ProductStateService, protected route: ActivatedRoute,
              protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
              protected dialogService: DialogService, public fccGlobalConstantService: FccGlobalConstantService,
              protected productMappingService: ProductMappingService, protected fileList: FilelistService,
              protected dialogRef: DynamicDialogRef, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected resolverService: ResolverService,
              protected fileListSvc: FilelistService, protected currencyConverterPipe: CurrencyConverterPipe,
              protected tdCstdProductService: TdCstdProductService, protected multiBankService: MultiBankService,
              protected dropdownAPIService: DropDownAPIService, protected taskService: FccTaskService,
              protected dashboardService: DashboardService, protected codeDataService: CodeDataService,
              public phrasesService: PhrasesService,
              protected cashCommonDataService: CashCommonDataService, protected sessionValidation: SessionValidateService,
              protected cdr: ChangeDetectorRef) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, tdCstdProductService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.placementAccountEnable = response.placementAccountEnabled;
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
      }
    });
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.checkConfigurations();
  }

  checkConfigurations() {
    this.commonService.getParameterConfiguredValues(this.tdPlacementaccountEnabled,
      FccGlobalConstant.PARAMETER_P705).subscribe(responseData => {
        if (responseData && responseData.paramDataList) {
          this.paramListValue = responseData.paramDataList;
          this.initializeFormGroup();
          this.initiationofdata();
          this.updateUserAccounts();
          this.getEntityId();
          this.getParamDataFields();
          this.getCurrencyList();
          this.setCustomTenorInEditMode();
          this.checkConfigForCustomTenor();
          this.checkCheckBoxAttr();
          this.barLength = this.leftSectionService.progressBarPerIncrease(FccConstants.TD_CSTD_GENERAL_DETAILS);
          this.leftSectionService.progressBarData.subscribe(
            data => {
              this.progressivebar = data;
            }
          );
        }
      });
  }


  checkConfigForCustomTenor() {
    this.commonService.getBankDetails().subscribe(
      bankRes => {
        this.bankName = bankRes.shortName;
        this.commonService.getParameterConfiguredValues(this.bankName,
          FccGlobalConstant.PARAMETER_P708).subscribe(responseData => {
            if (responseData && responseData.paramDataList && responseData.paramDataList.length) {
              this.isCustomTenorApplicable = responseData.paramDataList[0].data_1;
              this.customTenorMonthVal = responseData.paramDataList[0].data_2;
              this.customTenorYearVal = responseData.paramDataList[0].data_3;
              this.customTenoreMinDays = responseData.paramDataList[0].data_4;
              this.customTenoreMaxDays = responseData.paramDataList[0].data_5;
              this.customTenorMaxYears = responseData.paramDataList[0].data_6;
              this.maxMonths = this.customTenorMaxYears * 12;
              this.maxDays = responseData.paramDataList[0].data_5;
              this.setCustomTenorValues();
              this.validateCustomTenor();
              if (this.isCustomTenorApplicable === FccGlobalConstant.CODE_Y) {
                this.form.get(FccConstants.CUSTOM_TENOR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
                this.form.get(FccGlobalConstant.NUM_OF_DAYS)[FccGlobalConstant.PARAMS].warning =
                  `${this.translationService.instant('minSizeForCustomTenor')}` +
                  this.customTenoreMinDays + `${this.translationService.instant('days')}`;
              } else {
                this.form.get(FccConstants.CUSTOM_TENOR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
              }
            }
          });
      });
  }

  getAccounts(accountType: any) {
    const account = this.stateService.
      getValue(FccConstants.TD_CSTD_GENERAL_DETAILS, accountType, this.isMasterRequired);
    const accountLabel = this.accounts.filter(task => task.value.label === account);
    const accountName = this.accounts.filter(task => task.value.name === account);
    if (accountLabel !== undefined && accountLabel !== null && accountLabel.length > 0) {
      this.form.get(accountType).setValue(accountLabel[0].value);
      this.form.get(FccConstants.CREDIT_ACCOUNT_ID).setValue(accountLabel[0].value.id);
    } else if (accountName !== undefined && accountName !== null && accountName.length > 0) {
      this.form.get(accountType).setValue(accountName[0].value);
    }
  }


  onClickCustomTenor() {

    this.validateCustomTenor();
  }

  validateCustomTenor() {
    const togglevalue = this.form.get(FccConstants.CUSTOM_TENOR).value;
    if (togglevalue === FccBusinessConstantsService.NO) {
      this.form.get(FccGlobalConstant.TENOR_PERIOD)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.form.get(FccGlobalConstant.NUM_OF_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.NUM_OF_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccGlobalConstant.TENOR_YEARS).setValue(null);
      this.form.get(FccGlobalConstant.TENOR_MONTHS).setValue(null);
      this.form.get(FccGlobalConstant.TENOR_DAYS).setValue(null);
      this.form.get(FccGlobalConstant.NUM_OF_DAYS).setValue('');
      this.form.get(FccGlobalConstant.TENOR_YEARS).clearValidators();
      this.form.get(FccGlobalConstant.TENOR_MONTHS).clearValidators();
      this.form.get(FccGlobalConstant.TENOR_DAYS).clearValidators();
      this.form.get(FccGlobalConstant.NUM_OF_DAYS).clearValidators();
      this.form.get(FccConstants.CUSTOM_TENOR_VALUE).setValue('');
      this.form.get(FccConstants.CUSTOM_TENOR_VALUE)[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = false;
      this.patchFieldParameters(this.form.get(FccGlobalConstant.NUM_OF_DAYS), { rendered: false, disabled: false, readonly : false });
      this.yearVal = 0;
      this.monthVal = 0;
      this.daysVal = 0;
    } else {
      this.form.get(FccGlobalConstant.TENOR_PERIOD)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.TENOR_PERIOD).clearValidators();
      this.form.get(FccGlobalConstant.TENOR_PERIOD).setValue('');
      if (this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS] &&
        (this.form.get(FccGlobalConstant.TENOR_YEARS).value === 0 || this.form.get(FccGlobalConstant.TENOR_YEARS).value === null)) {
        this.form.get(FccGlobalConstant.TENOR_YEARS).setValue(
          this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS].defaultValue);
      } else if (this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS]) {
        this.form.get(FccGlobalConstant.TENOR_YEARS).setValue(this.form.get(FccGlobalConstant.TENOR_YEARS).value);
      }
      if (this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS] &&
        (this.form.get(FccGlobalConstant.TENOR_MONTHS).value === 0 || this.form.get(FccGlobalConstant.TENOR_MONTHS).value === null)) {
        this.form.get(FccGlobalConstant.TENOR_MONTHS).setValue(
          this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS].defaultValue);
      } else if (this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS]) {
        this.form.get(FccGlobalConstant.TENOR_MONTHS).setValue(this.form.get(FccGlobalConstant.TENOR_MONTHS).value);
      }
      if (this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS] &&
        (this.form.get(FccGlobalConstant.TENOR_DAYS).value === 0 || this.form.get(FccGlobalConstant.TENOR_DAYS).value === null)) {
        this.form.get(FccGlobalConstant.TENOR_DAYS).setValue(
          this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS].defaultValue);
      } else if (this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS]) {
        this.form.get(FccGlobalConstant.TENOR_DAYS).setValue(this.form.get(FccGlobalConstant.TENOR_DAYS).value);
      }
      this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.NUM_OF_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.addFCCValidators(FccGlobalConstant.NUM_OF_DAYS, Validators.pattern('^[0-9]+$'), 0);
      const tenorYears = this.form.get(FccGlobalConstant.TENOR_YEARS).value + FccConstants.YEARS;
      const tenorMonths = this.form.get(FccGlobalConstant.TENOR_MONTHS).value + FccConstants.MONTHS;
      const tenorDays = this.form.get(FccGlobalConstant.TENOR_DAYS).value + FccConstants.DAYS;
      const tenor = tenorYears + ' ' + tenorMonths + ' ' + tenorDays;
      if (this.form.get(FccGlobalConstant.TENOR_YEARS).value === 0) {
        this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS].warning = '';
      }
      if (this.form.get(FccGlobalConstant.TENOR_MONTHS).value === 0) {
        this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS].warning = '';
      }
      if (this.form.get(FccGlobalConstant.TENOR_DAYS).value === 0) {
        this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS].warning = '';
      }

      if (this.form.get('valueDate').value === ''){
        this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
        this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
        this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
        this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
        this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
        this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
        }else {
          this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
          this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
          this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
        }

      if (this.operation !== FccGlobalConstant.PREVIEW) {
        this.form.get(FccConstants.CUSTOM_TENOR_VALUE).setValue(tenor);
        this.form.get(FccConstants.CUSTOM_TENOR_VALUE)[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = true;
      }
      if (this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.CURRENCY).value) && this.cur &&
      this.cur.length > FccGlobalConstant.ZERO) {
        this.patchFieldParameters(this.form.get(FccGlobalConstant.CURRENCY), { options: this.cur });
        const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.cur, FccGlobalConstant.CURRENCY, this.form);
        if (valObj) {
          this.form.get(FccGlobalConstant.CURRENCY).patchValue(valObj[`value`]);
          this.form.get(FccGlobalConstant.CURRENCY).setValue(valObj[`value`]);
        }
      }
      this.form.updateValueAndValidity();
    }
  }

  setCustomTenorValues() {
    if (this.form.get(FccConstants.CUSTOM_TENOR).value === FccBusinessConstantsService.YES &&
    this.commonService.isNonEmptyField(FccConstants.CUSTOM_TENOR_VALUE, this.form) &&
    this.commonService.isnonEMptyString(this.form.get(FccConstants.CUSTOM_TENOR_VALUE).value)) {
      const tenorValue = this.form.get(FccConstants.CUSTOM_TENOR_VALUE).value.split(FccGlobalConstant.BLANK_SPACE_STRING);
      if (tenorValue.length === FccGlobalConstant.LENGTH_3) {
        const tenorYears = tenorValue[0].replaceAll(FccConstants.YEARS, FccGlobalConstant.EMPTY_STRING);
        this.form.get(FccGlobalConstant.TENOR_YEARS).setValue(tenorYears);
        this.yearVal = Number(tenorYears) * this.customTenorYearVal;
        const tenorMonths = tenorValue[1].replaceAll(FccConstants.MONTHS, FccGlobalConstant.EMPTY_STRING);
        this.form.get(FccGlobalConstant.TENOR_MONTHS).setValue(tenorMonths);
        this.monthVal = Number(tenorMonths) * this.customTenorMonthVal;
        const tenorDays = tenorValue[2].replaceAll(FccConstants.DAYS, FccGlobalConstant.EMPTY_STRING);
        this.form.get(FccGlobalConstant.TENOR_DAYS).setValue(tenorDays);
        this.daysVal = Number(tenorDays) * Number(FccGlobalConstant.CUSTOM_TENOR_DAYS_VAL);
        this.calculateTenorDays();
        if (this.totalDays) {
          this.form.get(FccGlobalConstant.NUM_OF_DAYS).setValue(this.totalDays);
        } else if (Number.isInteger(this.yearVal) && Number.isInteger(this.monthVal) && Number.isInteger(this.daysVal) &&
        (this.yearVal + this.monthVal + this.daysVal) !== FccGlobalConstant.ZERO) {
          this.form.get(FccGlobalConstant.NUM_OF_DAYS).setValue(this.yearVal + this.monthVal + this.daysVal);
        }
      }
      this.form.updateValueAndValidity();
    }
  }

  getCurrencyList() {
    this.xchRequest.userData = new UserData();
    this.xchRequest.userData.userSelectedLanguage = FccGlobalConstant.LANGUAGE_EN;
    this.curRequest.userData = this.xchRequest.userData;
    this.commonService.userCurrencies(this.curRequest).subscribe(
      response => {
        if (response.errorMessage && response.errorMessage === FccGlobalConstant.SESSION_INVALID) {
          this.sessionValidation.IsSessionValid();
        } else {
          this.cur = [];
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
              this.cur.push(ccy);
            });
          if (this.mode !== FccGlobalConstant.DRAFT_OPTION) {
            this.patchFieldParameters(this.form.get('currency'), { options: this.cur });
          } else {
            const tenorTypeValue = this.stateService.getValue(FccConstants.TD_CSTD_GENERAL_DETAILS,
              FccGlobalConstant.TENOR_PERIOD, false);
            if (this.commonService.isnonEMptyString(tenorTypeValue)) {
              this.currencyList = this.cashCommonDataService.getCurrencyList(this.paramList653, tenorTypeValue, this.selectedDT);

              const curList = [];
              if (this.currencyList.length > 0) {
                for (let i = 0; i < this.currencyList.length; i++) {
                  this.cur.filter(currValue => {
                    if (currValue.label === this.currencyList[i]) {
                      curList.push(currValue);
                    }
                  });
                }
                this.patchFieldParameters(this.form.get(FccGlobalConstant.CURRENCY), { options: curList });
                if (this.form.get(FccGlobalConstant.CURRENCY).value !== FccGlobalConstant.EMPTY_STRING) {
                  const currencyValue = this.form.get(FccGlobalConstant.CURRENCY).value;
                  const exist = curList.filter(task => task.value.label === currencyValue.value);
                  if (exist.length > 0) {
                    this.form.get(FccGlobalConstant.CURRENCY).setValue(curList.filter(
                      task => task.value.label === currencyValue.value)[0].value);
                  }
                }
              }
            } else {
              this.patchFieldParameters(this.form.get('currency'), { options: this.cur });
            }
          }
        }
        if (this.form.get('currency').value !== FccGlobalConstant.EMPTY_STRING) {
          const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.cur, 'currency', this.form);
          if (valObj) {
            this.form.get('currency').patchValue(valObj[`value`]);
          }
        }
      });
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  getParamDataFields() {
    this.commonService.getBankDetails().subscribe(
      bankRes => {
        this.bankName = bankRes.shortName;
        this.commonService.getParameterConfiguredValues(this.bankName,
          FccGlobalConstant.PARAMETER_P653).subscribe(responseData => {
            if (responseData && responseData.paramDataList) {
              this.paramList653 = responseData.paramDataList;
              this.depositTypeList = this.cashCommonDataService.getDepositTypeList(responseData.paramDataList);
              if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
                const key = FccGlobalConstant.EMPTY_STRING;
                const depositType = this.form.get(FccGlobalConstant.DEPOSIT_TYPE);
                this.onClickDepositType(key);
                this.updateTenorDetails(depositType);
                this.onClickMaturityInstructions();
              }
            }
          });
      });
    this.commonService.getBankDetails().subscribe(
      bankRes => {
        this.bankName = bankRes.shortName;
        this.commonService.getParameterConfiguredValues(this.bankName,
          FccGlobalConstant.PARAMETER_P654).subscribe(response => {
            if (response && response.paramDataList) {
              this.paramList654 = response.paramDataList;
            }
          });
      });
  }

  ngOnDestroy() {
    if (this.form) {
      if (this.form.get(FccConstants.CUSTOM_TENOR_VALUE) &&
        this.form.get(FccConstants.CUSTOM_TENOR_VALUE)[FccGlobalConstant.PARAMS] &&
        this.form.get(FccConstants.CUSTOM_TENOR_VALUE).value !== null) {
        this.form.get(FccConstants.CUSTOM_TENOR_VALUE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
      if (this.form.get(FccConstants.CUSTOM_TENOR_VALUE) &&
        this.form.get(FccConstants.CUSTOM_TENOR_VALUE)[FccGlobalConstant.PARAMS] &&
        this.form.get(FccConstants.CUSTOM_TENOR_VALUE).value === null) {
        this.form.get(FccConstants.CUSTOM_TENOR_VALUE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.form.get(FccConstants.SAME_AS_DEBIT_CHECKBOX) &&
        this.form.get(FccConstants.SAME_AS_DEBIT_CHECKBOX).value === FccGlobalConstant.CODE_Y) {
        this.form.get(FccConstants.SAME_AS_DEBIT_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if(this.nonNumericCurrencyValidator && 
        this.commonService.isNonEmptyValue(this.form.get('amount')?.value)){
        this.form?.get(FccGlobalConstant.AMOUNT_FIELD)?.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, 
          this.form.get('amount').value, 
          this.iso, 
          this.currencyDecimalplacesZero, 
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      this.form.updateValueAndValidity();
      this.stateService.setStateSection(FccGlobalConstant.tdCstdGeneralDetails, this.form, false);
    }
  }

onClickPhraseIcon(event: any, key: any) {
  this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_TD, key);
}
  convertDaysCode(data: any): any {
    const tp = data.substr(0, data.length - 1);
    const tpCode = data.substr(data.length - 1);
    return tp.concat(' ').concat(this.translateService.instant((tp === FccGlobalConstant.SINGLE_TIME_UNIT ?
      FccGlobalConstant.PARAMETER_653_UNDERSCORE_SINGLE : FccGlobalConstant.PARAMETER_653_UNDERSCORE).concat(tpCode)));
  }
  onKeyupDepositType(event: any){
    this.onClickDepositType(event);
  }

  updateDepositDetails() {
    const depositTypeValue = this.stateService.getValue(FccConstants.TD_CSTD_GENERAL_DETAILS, FccGlobalConstant.DEPOSIT_TYPE, false);
    const exist = this.typeArray.filter(task => task.value.value === depositTypeValue);
    if (exist.length > 0) {
      this.form.get(FccGlobalConstant.DEPOSIT_TYPE).setValue(this.typeArray.filter(
        task => task.value.value === depositTypeValue)[0].value);
    }
  }

  updateTenorDetails(depositType) {
    const tenorTypeValue = this.stateService.getValue(FccConstants.TD_CSTD_GENERAL_DETAILS, FccGlobalConstant.TENOR_PERIOD, false);
    if (this.commonService.isNonEmptyValue(depositType.value)) {
      this.selectedDT = depositType.value.value;
      this.tenorPeriodList = this.cashCommonDataService.getTenorPeriodList(this.paramList653, depositType.value.value);
      if (this.tenorPeriodList.length > 0) {
        this.tenorPeriodEditArray = [];
        this.tenorPeriodList.forEach(
          tp => {
            const tpDetails: { label: string, value: any } = {
              label: this.convertDaysCode(tp),
              value: tp
            };
            this.tenorPeriodEditArray.push(tpDetails);
          });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TENOR_PERIOD), { options: this.tenorPeriodEditArray });
        const exist = this.tenorPeriodEditArray.filter(task => task.label === tenorTypeValue);
        if (exist.length > 0) {
          this.form.get(FccGlobalConstant.TENOR_PERIOD).setValue(this.tenorPeriodEditArray.filter(
            task => task.label === tenorTypeValue)[0].value);
          this.setCurrAndAmtForTenorPeriod(exist[0]);
        }
      }
    }
  }

  onClickDepositType(event: any) {
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    this.codeID = this.form.get(FccGlobalConstant.DEPOSIT_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    if (this.commonService.isNonEmptyValue(event.value) && this.mode !== FccGlobalConstant.DRAFT_OPTION) {
      this.selectedDT = event.value.value;
      this.tenorPeriodList = this.cashCommonDataService.getTenorPeriodList(this.paramList653, event.value.value);
      const tenorPeriodArray = [];
      if (this.tenorPeriodList.length > 0) {
        this.tenorPeriodList.forEach(
          tp => {
            const tpDetails: { label: string, value: any } = {
              label: this.convertDaysCode(tp),
              value: tp
            };
            tenorPeriodArray.push(tpDetails);
          });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TENOR_PERIOD), { options: tenorPeriodArray });
      }
    } else {
      if (this.depositTypeList.length > 0) {
        this.typeArray = [];
        this.depositTypeList.forEach(
          type => {
            const key = this.commonService.getCodeKey(FccGlobalConstant.N414_DT, type, this.productCode, this.subProductCode);

            const typeDetails: { label: string, value: any } = {
              label: this.translateService.instant(key),
              value: {
                label: this.translateService.instant(key),
                value: type,
                smallName: type
              }
            };
            this.typeArray.push(typeDetails);
          });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.DEPOSIT_TYPE), { options: this.typeArray });
        this.updateDepositDetails();
      }
    }
  }


  setCurrAndAmtForTenorPeriod(event: any) {
    if (this.commonService.isNonEmptyValue(event.value)) {
    this.form.get(FccConstants.VALUE_DATE_TERM_CODE).setValue(event.value.substring(event.value.length - 1));
    this.form.get(FccConstants.VALUE_DATE_TERM_NUMBER).setValue(event.value.slice(0, -1));
    this.currencyList = this.cashCommonDataService.getCurrencyList(this.paramList653, event.value, this.selectedDT);
    this.currencyList.sort();
    const curList = [];
    if (this.currencyList.length > 0) {
      for (let i = 0; i < this.currencyList.length; i++) {
        this.cur.filter(currValue => {
          if (currValue.label === this.currencyList[i]) {
            curList.push(currValue);
          }
        });
      }
      this.patchFieldParameters(this.form.get(FccGlobalConstant.CURRENCY), { options: curList });
      if (this.form.get(FccGlobalConstant.CURRENCY).value !== FccGlobalConstant.EMPTY_STRING) {
        const currencyValue = this.form.get(FccGlobalConstant.CURRENCY).value;
        const exist = curList.filter(task => task.value.label === currencyValue.value);
        if (exist.length > 0) {
          this.form.get(FccGlobalConstant.CURRENCY).setValue(curList.filter(
            task => task.value.label === currencyValue.value)[0].value);
        }
      }
     }
    }
  }

  onKeyupTenorPeriod(event: any){
    this.onClickTenorPeriod(event);
  }

  onClickTenorPeriod(event: any) {
    if (this.commonService.isNonEmptyValue(event.value)) {
      this.form.get(FccGlobalConstant.CURRENCY).setValue(null);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValue(null);
      this.setCurrAndAmtForTenorPeriod(event);
    }
  }

  onKeyupMaturityInstructions(){
    this.onClickMaturityInstructions();
  }

  onClickMaturityInstructions() {
    const miArray = [];
    this.maturityInstList = this.cashCommonDataService.getMaturityInstList(this.paramList654, this.selectedDT);
    if (this.maturityInstList.length > 0) {
      this.maturityInstList.forEach(
        mi => {
          const typeDetails: { label: string, value: any } = {
            label: this.translateService.instant(mi),
            value: mi
          };
          miArray.push(typeDetails);
        });
      this.patchFieldParameters(this.form.get(FccGlobalConstant.MATURITY_INSTRUCTIONS), { options: miArray });
      if (this.form.get(FccGlobalConstant.MATURITY_INSTRUCTIONS).value !== FccGlobalConstant.EMPTY_STRING) {
        const valObj = this.dropdownAPIService.getDropDownFilterValueObj(miArray, FccGlobalConstant.MATURITY_INSTRUCTIONS, this.form);
        if (valObj) {
          this.form.get(FccGlobalConstant.MATURITY_INSTRUCTIONS).patchValue(valObj[`value`]);
        }
      }
      const maurityInstVal = this.form.get(FccGlobalConstant.MATURITY_INSTRUCTIONS).value;
      if (this.commonService.isnonEMptyString(this.form.get(FccConstants.DEBIT_ACCOUNT).value)) {
        const maturityCreditEnable = this.cashCommonDataService.getMaturityCreditEnable(this.paramList654, this.selectedDT, maurityInstVal);
        if (maturityCreditEnable[0] === FccGlobalConstant.CODE_Y) {
          this.form.get(FccConstants.CREDIT_ACCOUNT).setValue(this.form.get(FccConstants.DEBIT_ACCOUNT).value);
        } else if (maturityCreditEnable[0] === FccGlobalConstant.CODE_N && this.mode !== FccGlobalConstant.DRAFT_OPTION) {
          this.form.get(FccConstants.CREDIT_ACCOUNT).setValue('');
        }
      }
      if (maurityInstVal === FccGlobalConstant.AUTO_RENEWAL_PRINCIPAL_AND_INTEREST){
      this.form.get(FccConstants.CREDIT_ACCOUNT)[this.params][FccGlobalConstant.REQUIRED] = false;
      } else {
      this.form.get(FccConstants.CREDIT_ACCOUNT)[this.params][FccGlobalConstant.REQUIRED] = true;
     }
    }
  }

  setCustomTenorInEditMode(){
    if (this.mode === FccGlobalConstant.DRAFT_OPTION){
      if (this.form.get(FccGlobalConstant.TENOR_YEARS).value !== FccGlobalConstant.ZERO ||
      this.form.get(FccGlobalConstant.TENOR_MONTHS).value !== FccGlobalConstant.ZERO
      || this.form.get(FccGlobalConstant.TENOR_DAYS).value !== FccGlobalConstant.ZERO ){
      this.patchFieldParameters(this.form.get(FccGlobalConstant.NUM_OF_DAYS), { rendered: true, disabled: false, readonly : true });
      this.cdr.detectChanges();
      this.patchFieldParameters(this.form.get(FccGlobalConstant.NUM_OF_DAYS), { rendered: true, disabled: true, readonly : true });
      this.form.updateValueAndValidity();
    }
  }
  }

  initializeFormGroup() {
    const sectionName = FccConstants.TD_CSTD_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    if (this.paramListValue[0].data_1 === 'Y' && this.placementAccountEnable) {
      this.form.get(FccConstants.PLACEMENT_ACCOUNT)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.PLACEMENT_ACCOUNT)[this.params][FccGlobalConstant.REQUIRED] = true;
    } else {
      this.form.get(FccConstants.PLACEMENT_ACCOUNT)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.PLACEMENT_ACCOUNT)[this.params][FccGlobalConstant.REQUIRED] = false;
    }
    if (this.form.get(FccGlobalConstant.MATURITY_INSTRUCTIONS).value === FccGlobalConstant.AUTO_RENEWAL_PRINCIPAL_AND_INTEREST) {
      this.form.get(FccConstants.CREDIT_ACCOUNT)[this.params][FccGlobalConstant.REQUIRED] = false;
    } else {
      this.form.get(FccConstants.CREDIT_ACCOUNT)[this.params][FccGlobalConstant.REQUIRED] = true;
    }
    this.form.get(FccConstants.DEBIT_ACCOUNT)[this.params][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccGlobalConstant.TENOR_PERIOD)[this.params][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccGlobalConstant.MATURITY_INSTRUCTIONS)[this.params][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccConstants.CUSTOM_TENOR_VALUE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.SAME_AS_DEBIT_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    if (this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.CURRENCY).value) && this.cur &&
    this.cur.length > FccGlobalConstant.ZERO) {
      this.patchFieldParameters(this.form.get(FccGlobalConstant.CURRENCY), { options: this.cur });
      const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.cur, FccGlobalConstant.CURRENCY, this.form);
      if (valObj) {
        this.form.get(FccGlobalConstant.CURRENCY).patchValue(valObj[`value`]);
        this.form.get(FccGlobalConstant.CURRENCY).setValue(valObj[`value`]);
      }
    }
    this.form.updateValueAndValidity();
  }


  saveFormOject() {
    this.stateService.setStateSection(FccConstants.TD_CSTD_GENERAL_DETAILS, this.form);
  }

  onClickEntity(event) {
    if (event.value) {
      this.multiBankService.setCurrentEntity(event.value.name);
      this.taskService.setTaskEntity(event.value);
      this.entityDataArray.forEach(value => {
        if (event.value.shortName === value.label) {
          this.entityId = value.value;
          this.flag = true;
          if (this.commonService.isnonEMptyString(this.entityId)) {
            this.updateUserAccounts();
            this.updatePlacementAccounts();
          }
        }
      });
      this.patchFieldParameters(this.form.get(FccConstants.DEBIT_ACCOUNT), { options: this.updateUserAccounts() });
      this.patchFieldParameters(this.form.get(FccConstants.CREDIT_ACCOUNT), { options: this.updateUserAccounts() });
      if (this.accounts.length === 1) {
        this.patchFieldParameters(this.form.get(FccConstants.DEBIT_ACCOUNT), { readonly: true });
        this.patchFieldParameters(this.form.get(FccConstants.CREDIT_ACCOUNT), { readonly: true });
        this.onClickDebitAccount(this.accounts[0]);
        this.onClickCreditAccount(this.accounts[0]);
      } else {
        this.patchFieldParameters(this.form.get(FccConstants.DEBIT_ACCOUNT), { readonly: false });
        this.patchFieldParameters(this.form.get(FccConstants.DEBIT_ACCOUNT), { autoDisplayFirst: false });
        this.patchFieldParameters(this.form.get(FccConstants.CREDIT_ACCOUNT), { readonly: false });
        this.patchFieldParameters(this.form.get(FccConstants.CREDIT_ACCOUNT), { autoDisplayFirst: false });
      }
    }

  }

  getUserEntities() {
    this.updateUserEntities();
  }

  async updateUserEntities() {
    if (!this.multiBankService.getEntityList().length) {
      await this.multiBankService.multiBankAPI(
        FccGlobalConstant.PRODUCT_TD,
        FccGlobalConstant.SUB_PRODUCT_CODE_CSTD
      );
    }
    this.multiBankService.getEntityList().forEach(entity => {
      this.entities.push(entity);
    });
    const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, FccGlobalConstant.ENTITY_TEXT, this.form);
    if (valObj && !this.taskService.getTaskEntity()) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT).patchValue(valObj[FccGlobalConstant.VALUE]);
      this.multiBankService.setCurrentEntity(valObj[FccGlobalConstant.VALUE].name);
    } else if (this.taskService.getTaskEntity()) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT).patchValue(this.taskService.getTaskEntity());
    }
    if (this.entities.length === 0) {
      if (this.form.get(FccGlobalConstant.ENTITY_TEXT)) {
        this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.RENDERED] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.ENTITY_TEXT, false);
        this.form.get(FccGlobalConstant.ENTITY_TEXT).clearValidators();
        this.form.get(FccGlobalConstant.ENTITY_TEXT).updateValueAndValidity();
      }
    } else if (this.entities.length === 1) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.ENTITY_TEXT).setValue({
        label: this.entities[0].value.label, name: this.entities[0].value.name,
        shortName: this.entities[0].value.shortName
      });
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.READONLY] = true;
      this.multiBankService.setCurrentEntity(this.entities[0].value.name);
    } else if (this.entities.length > 1) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.RENDERED] = true;
    }
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ENTITY_TEXT), { options: this.entities });
  }

  onClickDebitAccount(event) {
    if (event.value) {
      this.form.get(FccConstants.DEBIT_ACCOUNT).setValue(event.value);
      this.form.get(FccConstants.DEBIT_ACCOUNT_ID).setValue(event.value.id);
      if (this.sameAccountFlag || this.form.get(FccConstants.SAME_AS_DEBIT_CHECKBOX).value) {
        this.form.get(FccConstants.SAME_AS_DEBIT_CHECKBOX).setValue(FccGlobalConstant.CODE_N);
        this.sameAccountFlag = false;
        this.patchFieldValueAndParameters(this.form.get(FccConstants.CREDIT_ACCOUNT)
        , null, { disabled: false });
      }
      if (this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.MATURITY_INSTRUCTIONS).value)) {
        const maurityInstVal = this.form.get(FccGlobalConstant.MATURITY_INSTRUCTIONS).value;
        const maturityCreditEnable =
          this.cashCommonDataService.getMaturityCreditEnable(this.paramList654, this.selectedDT, maurityInstVal);
        if (maturityCreditEnable[0] === FccGlobalConstant.CODE_Y) {
          this.form.get(FccConstants.CREDIT_ACCOUNT).setValue(event.value);
        } else {
          this.form.get(FccConstants.CREDIT_ACCOUNT).setValue('');
        }
      }
    }
  }

  onClickCreditAccount(event) {
    if (event.value) {
      this.form.get(FccConstants.CREDIT_ACCOUNT).setValue(event.value);
      this.form.get(FccConstants.CREDIT_ACCOUNT_ID).setValue(event.value.id);
    }
  }

  updateUserAccounts() {
    iif(() => this.commonService.isnonEMptyString(this.entityId),
      this.getUserAccountsByEntityId(),
      this.allUserAccounts()
    ).subscribe(
      response => {
        this.accounts = [];
        if (response.items.length > 0) {
          response.items.forEach(
            value => {
              // filtering out fixed deposit accounts(type=05) under TermDeposit. Currently handled at client-side
              if(value.type !== 'TERM-DEPOSIT') {
                const account: { label: string, value: any } = {
                  label: value.number,
                  value: {
                    accountNo: value.number,
                    id: value.id,
                    currency: value.currency,
                    type: value.type,
                    accountContext: value.accountContext ? value.accountContext : '',
                    label: value.number
                  }
                };
                this.accounts.push(account);
              }
            });
          this.patchFieldParameters(this.form.get(FccConstants.DEBIT_ACCOUNT), { options: this.accounts });
          this.patchFieldParameters(this.form.get(FccConstants.CREDIT_ACCOUNT), { options: this.accounts });
          this.getAccounts(FccConstants.DEBIT_ACCOUNT);
          this.getAccounts(FccConstants.CREDIT_ACCOUNT);
        }
      });
  }

  allUserAccounts(): Observable<any> {
    return this.dashboardService.getUserAccount();
  }

  getUserAccountsByEntityId(accountParameters?: any): Observable<any> {
    return this.dashboardService.getUserAccountsByEntityId(this.entityId, accountParameters);
  }

  getEntityId() {
    this.commonService.getFormValues(FccGlobalConstant.STATIC_DATA_LIMIT, this.fccGlobalConstantService.userEntities)
      .pipe(
        tap(() => this.fetching = true)
      )
      .subscribe(res => {
        this.fetching = false;
        res.body.items.forEach(value => {
          const entity: { label: string; value: any } = {
            label: value.shortName,
            value: value.id
          };
          this.entityDataArray.push(entity);
        });
        this.getUserEntities();
        this.updateUserAccounts();
        this.updatePlacementAccounts();
      });
  }

  onClickCheckboxAttr(event) {
    if (event.checked) {
      this.sameAccountFlag = true;
      this.patchFieldValueAndParameters(this.form.get(FccConstants.CREDIT_ACCOUNT)
      , this.form.get(FccConstants.DEBIT_ACCOUNT).value, { disabled: true });
      this.patchFieldValueAndParameters(this.form.get(FccConstants.CREDIT_ACCOUNT_ID)
      , this.form.get(FccConstants.DEBIT_ACCOUNT_ID).value, { disabled: true });
    } else {
      this.sameAccountFlag = false;
      this.patchFieldValueAndParameters(this.form.get(FccConstants.CREDIT_ACCOUNT)
      , null, { disabled: false });
      this.patchFieldValueAndParameters(this.form.get(FccConstants.CREDIT_ACCOUNT_ID)
      , null, { disabled: false });
    }
  }

  checkCheckBoxAttr() {
    if (this.commonService.isNonEmptyField(FccConstants.SAME_AS_DEBIT_CHECKBOX, this.form) &&
    this.form.get(FccConstants.SAME_AS_DEBIT_CHECKBOX).value === FccGlobalConstant.CODE_Y) {
      this.patchFieldValueAndParameters(this.form.get(FccConstants.CREDIT_ACCOUNT),
      this.form.get(FccConstants.DEBIT_ACCOUNT).value, { disabled: true });
      this.patchFieldValueAndParameters(this.form.get(FccConstants.CREDIT_ACCOUNT_ID),
      this.form.get(FccConstants.DEBIT_ACCOUNT_ID).value, { disabled: true });
    }
  }

  updatePlacementAccounts() {
    const filterValues = {};
    const productTypes = 'product-types';
    const parameter = 'parameter';
    const drCr = 'dr-cr';
    const option = 'option';
    filterValues[productTypes] = 'TD:CSTD';
    filterValues[parameter] = 'FIXED_DEPOSIT';
    filterValues[drCr] = 'placement';
    filterValues[option] = 'useraccount';
    const accountParameters = JSON.stringify(filterValues);
    iif(() => this.commonService.isnonEMptyString(this.entityId),
      this.getUserAccountsByEntityId(accountParameters),
      this.allUserAccounts()
    ).subscribe(
      response => {
        this.placementAccounts = [];
        if (response.items.length > 0) {
          response.items.forEach(
            value => {
              const account: { label: string, value: any } = {
                label: value.number,
                value: {
                  accountNo: value.number,
                  id: value.id,
                  currency: value.currency,
                  type: value.type,
                  accountContext: value.accountContext ? value.accountContext : ''
                }
              };
              this.placementAccounts.push(account);
            });
          this.patchFieldParameters(this.form.get(FccConstants.PLACEMENT_ACCOUNT), { options: this.placementAccounts });
        }
      });
  }

  calculateTenorDays() {
     this.startDate = moment(this.form.get('valueDate').value);
     this.yearVal = this.form.get('tenorYears').value ? this.form.get('tenorYears').value : 0;
     this.endDate = moment(this.form.get('valueDate').value).add(this.yearVal, 'years');
     this.monthVal = this.form.get('tenorMonths').value ? this.form.get('tenorMonths').value : 0;
     this.endDate = moment(this.endDate).add(this.monthVal, 'months');
     this.daysVal = this.form.get('tenorDays').value ? this.form.get('tenorDays').value : 0;
     this.endDate = moment(this.endDate).add(this.daysVal, 'days');
     this.totalDays = this.endDate.diff(moment(this.startDate), 'days');
  }


  calculateCustomeTenorDays(control: FCCMVFormControl){
      switch (control.key){
      case 'tenorYears':
        this.errMsg = `${this.translationService.instant('maxTenorYear')}` +
        this.customTenorMaxYears + `${this.translationService.instant('tenoryear')}`;
        this.err = 'invalidTenorYear';
        this.applyLimitValidation(control.key, control.value, this.customTenorMaxYears, this.errMsg);
        this.form.get('tenorYears').setValue(control.value);
        break;
      case 'tenorMonths':
        this.errMsg = `${this.translationService.instant('maxTenorMonth')}` +
        this.maxMonths + `${this.translationService.instant('tenormonth')}`;
        this.err = 'invalidTenorMonth';
        this.applyLimitValidation(control.key, control.value, this.maxMonths, this.errMsg);
        this.form.get('tenorMonths').setValue(control.value);
        break;
      case 'tenorDays':
        this.errMsg = `${this.translationService.instant('maxTenorDay')}` +
        this.maxDays + `${this.translationService.instant('tenorday')}`;
        this.err = 'invalidTenorDay';
        this.applyLimitValidation(control.key, control.value, this.maxDays, this.errMsg);
        this.form.get('tenorDays').setValue(control.value);
        break;
   }
      this.calculateTenorDays();
      if (this.totalDays !== 0){
        this.form.get(FccGlobalConstant.NUM_OF_DAYS).setValue(this.totalDays);
      }
      this.form.get(FccGlobalConstant.NUM_OF_DAYS).markAsDirty();
      this.form.get(FccGlobalConstant.NUM_OF_DAYS).markAsTouched();
      this.setErrorForNumDays();
      if (this.yearVal === 0 && this.monthVal === 0 && this.daysVal === 0){
        this.form.get(FccGlobalConstant.NUM_OF_DAYS).setValue('');
        if (this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS]) {
          this.form.get(FccGlobalConstant.TENOR_YEARS).setValue(
          this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS].defaultValue);
        }
        if (this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS]) {
        this.form.get(FccGlobalConstant.TENOR_MONTHS).setValue(
          this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS].defaultValue);
        }
        if (this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS]) {
        this.form.get(FccGlobalConstant.TENOR_DAYS).setValue(
          this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS].defaultValue);
        }
        this.patchFieldParameters(this.form.get(FccGlobalConstant.NUM_OF_DAYS), { rendered: true, disabled: false, readonly : false });
    }else {
      this.patchFieldParameters(this.form.get(FccGlobalConstant.NUM_OF_DAYS), { rendered: true, disabled: true, readonly : true });
    }
      this.validateCustomTenor();
      this.form.updateValueAndValidity();
   }

  applyLimitValidation(name, ctrlValue, ctrlLimit, errMsg) {
    const controlName = name;
    const controlValue = ctrlValue;
    const ctrlsLimit = ctrlLimit;
    if (ctrlValue < 0) {
      this.form.get(controlName).setValue(0);
    }else {
      if (controlValue > ctrlsLimit) {
        this.form.get(controlName)[FccGlobalConstant.PARAMS].warning = errMsg;
        this.form.get(controlName).markAsDirty();
        this.form.get(controlName).setErrors({ err: true });
        }else{
          this.form.get(controlName)[FccGlobalConstant.PARAMS].warning = '';
        }
    }
  }

  onBlurNumOfDays(){
    const noOfDays = Number(this.form.get(FccGlobalConstant.NUM_OF_DAYS).value);
    const valDate = this.form.get('valueDate').value;
    if ( noOfDays !== 0){
      if (this.yearVal === 0 && this.monthVal === 0 && this.daysVal === 0){
      this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      this.form.get(FccConstants.CUSTOM_TENOR_VALUE).setValue('');
      this.togglePreviewScreen(this.form, [FccConstants.CUSTOM_TENOR_VALUE], false);
      this.form.get(FccGlobalConstant.NUM_OF_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
      this.setErrorForNumDays();
    }else {
      if (valDate !== '') {
      this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      }
      this.getCustomTenorValue();
      this.togglePreviewScreen(this.form, [FccConstants.CUSTOM_TENOR_VALUE], true);
    }
    this.form.updateValueAndValidity();
 }

 getCustomTenorValue(){
  const tenorYears = this.form.get(FccGlobalConstant.TENOR_YEARS).value + FccConstants.YEARS;
  const tenorMonths = this.form.get(FccGlobalConstant.TENOR_MONTHS).value + FccConstants.MONTHS;
  const tenorDays = this.form.get(FccGlobalConstant.TENOR_DAYS).value + FccConstants.DAYS;
  const tenor = tenorYears + ' ' + tenorMonths + ' ' + tenorDays;
  this.form.get(FccConstants.CUSTOM_TENOR_VALUE).setValue(tenor);
}

 setErrorForNumDays() {
  const noOfDays = Number(this.form.get(FccGlobalConstant.NUM_OF_DAYS).value);
  this.form.get(FccGlobalConstant.NUM_OF_DAYS)[FccGlobalConstant.PARAMS].warning =
    `${this.translationService.instant('minSizeForCustomTenor')}` +
     this.customTenoreMinDays + `${this.translationService.instant('days')}`;
  if (noOfDays < this.customTenoreMinDays){
    this.form.get(FccGlobalConstant.NUM_OF_DAYS)[FccGlobalConstant.PARAMS].warning = '';
    this.form.get(FccGlobalConstant.NUM_OF_DAYS).setErrors({ customTenorMinDays : this.customTenoreMinDays });
    }else if (noOfDays > this.customTenoreMaxDays){
    this.form.get(FccGlobalConstant.NUM_OF_DAYS)[FccGlobalConstant.PARAMS].warning = '';
    this.form.get(FccGlobalConstant.NUM_OF_DAYS).setErrors({ customTenorMaxDays : this.customTenoreMaxDays });
    }
 }

onBlurAmount() {
  if (!this.form.get(FccGlobalConstant.AMOUNT_FIELD).value) {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ required: true });
  }
  if (this.form.get(FccGlobalConstant.AMOUNT_FIELD).value &&
        (this.form.get(FccGlobalConstant.AMOUNT_FIELD).value <= FccGlobalConstant.ZERO)) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ amountCanNotBeZero: true });
  }
  const amt = this.form.get('amount');
  this.iso = this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value) &&
  this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode) ?
  this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode : null;
  if(this.nonNumericCurrencyValidator){
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso, 
      this.currencyDecimalplacesZero, 
      this.currencyDecimalplacesThree)){
      return;
    }
  }
  if (this.commonService.getAmountForBackToBack() && parseInt(this.commonService.replaceCurrency(amt.value), 10) >
      parseInt(this.commonService.replaceCurrency(this.commonService.getAmountForBackToBack()), 10)) {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([compareNewAmountToOld]);
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
  } else if (this.commonService.getAmountForBackToBack()) {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
  }
  this.val = amt.value;
  if (this.val === null || this.val === undefined || this.val === '') {
    this.form.get('amount').setErrors({ amountNotNull: true });
    return;
  }
  if (this.val <= 0) {
    this.form.get('amount').setErrors({ amountCanNotBeZero: true });
    return;
  }
  if (this.val !== '' && this.val !== null) {
    if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
      this.form.get('amount').setValidators(emptyCurrency);
    }
    if (this.iso !== '' && this.commonService.isNonEmptyValue(this.iso)) {
      let valueupdated = this.commonService.replaceCurrency(this.val);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
      this.form.get('amount').setValue(valueupdated);
    }
  }
  this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD);
  this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
}

onFocusAmount() {
  this.OnClickAmountFieldHandler('amount');
}

onKeyupAmount() {
  const amt = this.form.get('amount');
  this.iso = this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value) &&
  this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode) ?
  this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode : null;
  if(this.nonNumericCurrencyValidator){
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso, 
      this.currencyDecimalplacesZero, 
      this.currencyDecimalplacesThree)){
      return;
    }
  }
  this.cheackForAmountValidation();
}

cheackForAmountValidation() {
  const enteredAmt = this.form.get(FccGlobalConstant.AMOUNT_FIELD).value;
  this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValue(enteredAmt);
  if (isNaN(Number(enteredAmt))) {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    return;
  }
  if (!(/^((\d)+(\.\d{1,17}))$/.test(enteredAmt)) && enteredAmt.length && enteredAmt.includes('.')) {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ amountCanNotBeZero : true });
    return;
  }
  if (enteredAmt && enteredAmt.length > FccGlobalConstant.LENGTH_15) {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ amountLengthGreaterThanMaxLength : true });
    return;
  }
  if (enteredAmt) {
    const amountVal = Number(enteredAmt);
    if (amountVal <= FccGlobalConstant.ZERO) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ amountCanNotBeZero : true });
    } else {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
    }
  } else {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ required: true });
  }
  this.form.updateValueAndValidity();
}

initiationofdata() {
  this.flagDecimalPlaces = -1;
  this.iso = '';
  if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    this.iso = this.commonService.masterDataMap.get('currency');
  }
}

onBlurValueDate() {
  this.validateValueDate();
}

validateValueDate() {
  const valueDate = this.form.get(FccGlobalConstant.VALUE_DATE).value;
  const currentDate = new Date();
  if (valueDate !== '' && this.commonService.isNonEmptyValue(valueDate)) {
      if (valueDate < currentDate){
        this.form.get(FccGlobalConstant.VALUE_DATE).clearValidators();
        this.form.get(FccGlobalConstant.VALUE_DATE).setValidators([compareValueDateToCurrentDate]);
        this.form.get(FccGlobalConstant.VALUE_DATE).updateValueAndValidity();
      }
    }
}
onClickValueDate(event) {
  let valueDate = this.form.get(FccGlobalConstant.VALUE_DATE).value;
  const currentDate = new Date();
  this.form.addFCCValidators(FccGlobalConstant.VALUE_DATE, Validators.pattern(FccGlobalConstant.datePattern), 0);
  if (valueDate !== '' && this.commonService.isNonEmptyValue(valueDate)) {
    valueDate = `${valueDate.getDate()}/${(valueDate.getMonth() + 1)}/${valueDate.getFullYear()}`;
    valueDate = (valueDate !== '' && valueDate !== null) ?
                                this.commonService.convertToDateFormat(valueDate) : '';
    this.form.get(FccGlobalConstant.VALUE_DATE).clearValidators();
    if (valueDate !== '' && (valueDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) ) {
    this.form.get(FccGlobalConstant.VALUE_DATE).clearValidators();
    this.form.get(FccGlobalConstant.VALUE_DATE).setValidators([compareValueDateToCurrentDate]);
    this.form.get(FccGlobalConstant.VALUE_DATE).updateValueAndValidity();
  }
}
  if (event.value !== null && event.value !== '') {
  this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
  this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
  this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
  this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
  this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
  this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
  this.form.get(FccGlobalConstant.NUM_OF_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
  this.form.get(FccGlobalConstant.NUM_OF_DAYS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
  this.form.get(FccGlobalConstant.TENOR_YEARS).setValue(0);
  this.form.get(FccGlobalConstant.TENOR_MONTHS).setValue(0);
  this.form.get(FccGlobalConstant.TENOR_DAYS).setValue(0);
  this.form.get(FccGlobalConstant.NUM_OF_DAYS).setValue(0);
  this.form.get(FccGlobalConstant.TENOR_YEARS)[FccGlobalConstant.PARAMS].warning = '';
  this.form.get(FccGlobalConstant.TENOR_MONTHS)[FccGlobalConstant.PARAMS].warning = '';
  this.form.get(FccGlobalConstant.TENOR_DAYS)[FccGlobalConstant.PARAMS].warning = '';
  this.form.get(FccGlobalConstant.TENOR_YEARS).setErrors(null);
  this.form.get(FccGlobalConstant.TENOR_MONTHS).setErrors(null);
  this.form.get(FccGlobalConstant.TENOR_DAYS).setErrors(null);
  this.form.get(FccGlobalConstant.NUM_OF_DAYS).setErrors(null);
  this.form.get(FccGlobalConstant.TENOR_YEARS).clearValidators();
  this.form.get(FccGlobalConstant.TENOR_MONTHS).clearValidators();
  this.form.get(FccGlobalConstant.TENOR_DAYS).clearValidators();
  this.form.get(FccGlobalConstant.NUM_OF_DAYS).clearValidators();
}
  this.form.updateValueAndValidity();
}

onClickCurrency(event) {
  if(this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value)) {
    this.getCurrencyList();
  }
  this.val = this.form.get('amount').value;
  if (event.value !== undefined) { 
    this.enteredCurMethod = true;
    this.iso = event.value.currencyCode;
    this.isoamt = this.iso; 
    this.flagDecimalPlaces = 0;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, this.val, this.iso, 
        this.currencyDecimalplacesZero, 
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    this.form.get('amount').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    this.setMandatoryField(this.form, 'amount', true);
    
    if (this.val !== '' && this.val !== null) {
        if (this.val <= 0) {
          this.form.get('amount').setErrors({ amountCanNotBeZero: true });
          return;
        } else {
          let valueupdated = this.commonService.replaceCurrency(this.val);
          valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
          this.form.get('amount').setValue(valueupdated);
        }
      } else {
        this.form.get('amount').setValue(null);
        this.form.get('amount').setErrors({ required: true });
      }
    this.form.get('amount').updateValueAndValidity();
  }
  this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD);
 this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
  if(this.form.get('amount').value == 0 || this.commonService.isEmptyValue(this.form.get('amount').value)){
    this.form.get('amount').setValue(null);
    this.form.get('amount').setErrors({ required: true });
  }
}

onBlurTotalAmountToUtilise() {
  const val = this.form.get('totalAmountToUtilise').value;
  this.iso = this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value) &&
  this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode) ?
  this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode : null;
  let valueupdated = this.commonService.replaceCurrency(val);
    valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
    this.form.get('totalAmountToUtilise').setValue(valueupdated);
  this.form.get('totalAmountToUtilise').updateValueAndValidity();
  }

  onBlurAmountToUtilise1() {
  const val = this.form.get('amountToUtilise1').value;
  let valueupdated = this.commonService.replaceCurrency(val);
  this.iso = this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value) &&
  this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode) ?
  this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode : null;
    valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
    this.form.get('amountToUtilise1').setValue(valueupdated);
  this.form.get('amountToUtilise1').updateValueAndValidity();
  }

  ngAfterViewInit() {
    if (this.form !== undefined){
    const togglevalue = this.form.get(FccConstants.CUSTOM_TENOR).value;
    if (togglevalue === FccBusinessConstantsService.YES) {
      this.setErrorForNumDays();
    }
    }
  }

  onChangeAmountToUtilise(){
    this.commonService.amountValidation(this.form, this.currency);
  }
  }
