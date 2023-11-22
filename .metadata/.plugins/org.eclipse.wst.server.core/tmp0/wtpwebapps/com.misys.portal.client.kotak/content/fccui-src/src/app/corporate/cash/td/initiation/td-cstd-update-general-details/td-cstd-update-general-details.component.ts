import { FccConstants } from './../../../../../common/core/fcc-constants';
import { TdCstdProductService } from '../../services/td-cstd-product.service';
import { TdCstdProductComponent } from '../td-cstd-request-product/td-cstd-product.component';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, SelectItem } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonService } from '../../../../../common/services/common.service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { LeftSectionService } from '../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../../trade/lc/common/services/product-state.service';
import { SaveDraftService } from '../../../../trade/lc/common/services/save-draft.service';
import { FormControlService } from '../../../../trade/lc/initiation/services/form-control.service';
import { PrevNextService } from '../../../../trade/lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../../trade/lc/initiation/services/utility.service';
import { HOST_COMPONENT } from '../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FilelistService } from '../../../../trade/lc/initiation/services/filelist.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { CurrencyConverterPipe } from '../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { TransactionDetailService } from '../../../../../common/services/transactionDetail.service';
import { ProductMappingService } from '../../../../../common/services/productMapping.service';
import { CustomCommasInCurrenciesPipe } from '../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { Entities } from '../../../../../common/model/entities';
import { MultiBankService } from '../../../../../common/services/multi-bank.service';
import { DropDownAPIService } from '../../../../../common/services/dropdownAPI.service';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';
import { DashboardService } from '../../../../../common/services/dashboard.service';
import { CodeData } from '../../../../../common/model/codeData';
import { CodeDataService } from '../../../../../common/services/code-data.service';
import { CashCommonDataService } from '../../../services/cash-common-data.service';
import { ExchangeRateRequest } from '../../../../../common/model/xch-rate-request';
import { CurrencyRequest } from '../../../../../common/model/currency-request';
import { SessionValidateService } from '../../../../../common/services/session-validate-service';
import { Observable } from 'rxjs/internal/Observable';
import { iif } from 'rxjs/internal/observable/iif';
import { tap } from 'rxjs/operators';
import { FccBusinessConstantsService } from '../../../../../common/core/fcc-business-constants.service';
import { PhrasesService } from '../../../../../common/services/phrases.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-td-cstd-update-general-details',
  templateUrl: './td-cstd-update-general-details.component.html',
  styleUrls: ['./td-cstd-update-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TdCstdUpdateGeneralDetailsComponent }]
})
export class TdCstdUpdateGeneralDetailsComponent extends TdCstdProductComponent implements OnInit {

  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  module = `${this.translateService.instant(FccConstants.TD_CSTD_UPDATE_GENERAL_DETAILS)}`;
  contextPath: any;
  progressivebar: number;
  barLength: any;
  mode: any;
  tnxTypeCode: any;
  option: any;
  entity: Entities;
  entities = [];
  accounts: SelectItem[] = [];
  isMasterRequired: boolean;
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
  paramListValue: any;
  accountId: any;
  entityAbbvName: any;
  debitAccVal: any;
  tdPlacementaccountEnabled = 'td.placementaccount.enabled';
  curCode: any;
  principleAmt: any;
  language = localStorage.getItem('language');
  withDrawalAmountExists = true;
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService,
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
              protected cashCommonDataService: CashCommonDataService, protected sessionValidation: SessionValidateService,
              protected phrasesService: PhrasesService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, tdCstdProductService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (localStorage.getItem('formDestroy') === null) {
      localStorage.removeItem('form-dirty');
    }
     localStorage.removeItem('formDestroy');
    this.commonService.loadDefaultConfiguration().subscribe(response => {
    if (response) {
      this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
      this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
      this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;}
    });
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.accountId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.ACCOUNTID);
    this.entityAbbvName = this.commonService.getQueryParametersFromKey(FccGlobalConstant.ENTITY_ABBV_NAME);
    this.operation = this.commonService.getQueryParametersFromKey('operation');
    this.initializeFormGroup();
    this.handleDraftFields();
    this.updateUserAccounts();
    this.getEntityId();
    this.getParamDataFields();
    this.barLength = this.leftSectionService.progressBarPerIncrease(FccConstants.TD_CSTD_GENERAL_DETAILS);
    this.leftSectionService.progressBarData.subscribe(
      data => {
        this.progressivebar = data;
      }
    );
  }

  handleDraftFields() {
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      let renderFields = [];
      if (this.tnxTypeCode === FccGlobalConstant.N002_INQUIRE) {
        renderFields = ['bankDetail', 'maturityDateAcct',
          'maturityAmountUp', 'debitAccName', 'currencyTDUP'];
      } else {
        renderFields = ['bankDetail', 'maturityDateAcct',
          'maturityAmountUp', 'currency', 'debitAccName', 'currencyTDUP'];
      }
      this.setRenderOnlyFields(this.form, renderFields, false);
    }
  }

  setRenderOnly(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { rendered: flag });
  }

  setRenderOnlyFields(form, ids: string[], flag) {
    ids.forEach(id => this.setRenderOnly(form, id, flag));
  }

  onKeyupPaymentInstructions(){
    this.onClickPaymentInstructions();
  }

  onClickPaymentInstructions() {
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
      this.patchFieldParameters(this.form.get(FccGlobalConstant.PAYMENT_INSTRUCTIONS), { options: miArray });
      if (this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.PAYMENT_INSTRUCTIONS))){
        const maurityInstVal = this.form.get(FccGlobalConstant.PAYMENT_INSTRUCTIONS).value;
        if (maurityInstVal === FccGlobalConstant.AUTO_RENEWAL_PRINCIPAL_AND_INTEREST){
            this.form.get(FccConstants.CREDIT_ACCOUNT)[this.params][FccGlobalConstant.REQUIRED] = false;
            this.form.get(FccConstants.CREDIT_ACCOUNT).clearValidators();
        }else {
            this.form.get(FccConstants.CREDIT_ACCOUNT)[this.params][FccGlobalConstant.REQUIRED] = true;
        }
        this.form.updateValueAndValidity();
      }
    }
  }

  initializeFormGroup() {
    const debitAccName = 'debitAccName';
    const sectionName = FccConstants.TD_CSTD_UPDATE_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.TNX_TYPE_CODE), this.tnxTypeCode, {});
    this.form.get(FccGlobalConstant.PARTIAL_WITHDRAWAL)[this.params][FccGlobalConstant.RENDERED] = false;
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      const applicantAccID = this.form.get(FccConstants.APPLICANT_ACC_ID).value;
      this.form.get(FccConstants.DEBIT_ACCOUNT_ID).setValue(applicantAccID);
    } else {
      this.form.get(FccConstants.DEBIT_ACCOUNT_ID).setValue(this.accountId);
    }
    if (this.form.controls[debitAccName] && this.form.controls[debitAccName].value !== ' ' &&
    this.commonService.isNonEmptyValue(this.form.controls[debitAccName].value)) {
      this.commonService.formatForm(this.form);
    }
    if (this.form.get(FccConstants.ENTITY_NAME) &&
      (this.commonService.isEmptyValue(this.entityAbbvName) || this.entityAbbvName === FccGlobalConstant.BLANK_SPACE_STRING)) {
      this.patchFieldValueAndParameters(this.form.get(FccConstants.ENTITY_NAME), '', { rendered: false });
      if (this.mode !== FccGlobalConstant.DRAFT_OPTION &&
        this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.ENTITY_NAME_TD).value)) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.ENTITY_NAME_TD), '', { rendered: false });
      }
    } else if (this.form.get(FccGlobalConstant.ENTITY_NAME_TD) &&
      this.commonService.isnonEMptyString(this.entityAbbvName) && this.entityAbbvName !== FccGlobalConstant.BLANK_SPACE_STRING) {
      this.form.get(FccGlobalConstant.ENTITY_NAME_TD).setValue(this.entityAbbvName);
    }
    if (this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.ENTITY_NAME_TD).value)) {
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.ENTITY_NAME_TD), '', { rendered: false });
    }
    this.curCode = this.form.get(FccGlobalConstant.CURRENCY_TD) ? this.form.get(FccGlobalConstant.CURRENCY_TD).value : '';
    if (this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT).value)) {
      const principleAmount = this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT).value;
      this.form.get(FccGlobalConstant.TD_UP_AMOUNT).setValue(principleAmount);
      this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.TNX_AMT).value) ?
            this.form.get(FccGlobalConstant.TNX_AMT).setValue(this.form.get(FccGlobalConstant.TNX_AMT).value) :
            this.form.get(FccGlobalConstant.TNX_AMT).setValue(principleAmount);
      this.form.get(FccGlobalConstant.TNX_CUR_CODE).setValue(this.curCode);
    }
    this.form.get(FccGlobalConstant.CURRENCY).setValue(this.curCode);
    let maturityAmt = this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.MATURITY_AMOUNT).value);
    const maturityAmtDisplay = this.form.get(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY) ?
    this.form.get(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY).value : '';
    if (!this.commonService.isEmptyValue(maturityAmt)) {
      maturityAmt = this.currencyConverterPipe.transform(maturityAmt, this.curCode);
    }
    if (this.commonService.isEmptyValue(maturityAmtDisplay) && maturityAmtDisplay !== FccGlobalConstant.BLANK_SPACE_STRING &&
    this.form.get(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY)) {
      this.form.get(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY).setValue(this.curCode.concat(' ').concat(maturityAmt));
    }
    const tdMaturityAmount = this.form.get(FccGlobalConstant.MATURITY_AMOUNTUP).value;
    const tdCurCode = this.form.get(FccGlobalConstant.CURRENCY_TDUP)?.value;
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.commonService.isNonEmptyValue(tdMaturityAmount) &&
    this.commonService.isNonEmptyValue(tdCurCode)) {
      const maturityAmountFormatted = this.currencyConverterPipe.transform(tdMaturityAmount, tdCurCode);
      this.form.get(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY).setValue(tdCurCode.concat(' ').concat(maturityAmountFormatted));
      this.form.get(FccGlobalConstant.MATURITY_AMOUNT).setValue(tdMaturityAmount);
    }

    this.convertSpaceToEmpty(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY);
    if (this.form.get(FccGlobalConstant.MATURITY_DATE_ACCT) &&
    this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.MATURITY_DATE_ACCT).value) &&
    this.form.get(FccGlobalConstant.MATURITY_DATE_ACCT).value !== FccGlobalConstant.BLANK_SPACE_STRING &&
    this.mode !== FccGlobalConstant.DRAFT_OPTION) {
      const date = this.formatDateddmmyyyy(this.form.get(FccGlobalConstant.MATURITY_DATE_ACCT).value);
      this.form.get(FccGlobalConstant.MATURITY_DATE_ACCT).setValue(date);
    }
    this.checkDraftFormForMaturityDate();
    if (this.tnxTypeCode === FccGlobalConstant.N002_INQUIRE ||
      (this.form.get(FccGlobalConstant.TNX_TYPE_CODE).value === FccGlobalConstant.N002_INQUIRE)) {
      this.form.get(FccGlobalConstant.PARTIAL_WITHDRAWAL)[this.params][FccGlobalConstant.RENDERED] = true;
      this.principleAmt = this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT).value);
      if (!this.commonService.isEmptyValue(this.principleAmt)) {
        this.principleAmt = this.currencyConverterPipe.transform(this.principleAmt, this.curCode);
      }
      let principleAmtDisplay = this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT_DISPLAY).value;
      if (this.commonService.isEmptyValue(principleAmtDisplay) && principleAmtDisplay !== FccGlobalConstant.BLANK_SPACE_STRING) {
        this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT_DISPLAY).setValue(this.curCode.concat(' ').concat(this.principleAmt));
      } else if (this.commonService.isnonEMptyString(principleAmtDisplay) && !(isNaN(parseInt(principleAmtDisplay, 10)))) {
        principleAmtDisplay = this.currencyConverterPipe.transform(principleAmtDisplay ? principleAmtDisplay : '', tdCurCode);
        this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT_DISPLAY).setValue(tdCurCode.concat(' ').concat(principleAmtDisplay));
        if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_INQUIRE) {
          const availableAmountDraft = this.commonService.replaceCurrency(principleAmtDisplay);
          this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT).setValue(availableAmountDraft);
        }
      }
      this.form.get(FccGlobalConstant.NOTE_MSG)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.NOTE_WITHDRAWAL_MSG)[this.params][FccGlobalConstant.RENDERED] = true;
      this.convertSpaceToEmpty(FccGlobalConstant.AVAILABLE_AMOUNT_DISPLAY);
      if (this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT) &&
      (this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).value) ||
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).value == 0.00)) {
        this.withDrawalAmountExists = false;
      } else {
        this.withDrawalAmountExists = true;
      }
      this.onClickPartialWithdrawal();
      this.form.get(FccConstants.PAYMENT_INSTRUCTIONS_HEADER)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.PAYMENT_INSTRUCTIONS)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.PAYMENT_INSTRUCTIONS).clearValidators();
      this.patchFieldValueAndParameters(this.form.get(FccConstants.CREDIT_ACCOUNT)
      , null, { disabled: false });
      this.form.get(FccConstants.CREDIT_ACCOUNT)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.CREDIT_ACCOUNT).clearValidators();
      if (this.form.get(FccGlobalConstant.SAME_ACCOUNT)) {
        this.form.get(FccGlobalConstant.SAME_ACCOUNT)[this.params][FccGlobalConstant.RENDERED] = false;
      }

      if (localStorage.getItem('form-dirty') === null) {
        this.form.get(FccConstants.CREDIT_ACCOUNT_WD).markAsUntouched();
        this.form.get(FccConstants.CREDIT_ACCOUNT_WD).markAsPristine();
      }

      if (this.operation === FccGlobalConstant.LIST_INQUIRY || this.operation === FccGlobalConstant.PREVIEW) {
        let matAmtValue = this.form.get(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY).value;
        if (!isNaN(parseInt(matAmtValue, 10))) {
          matAmtValue = this.currencyConverterPipe.transform(matAmtValue ? matAmtValue : '', tdCurCode);
          this.form.get(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY).setValue(tdCurCode.concat(' ').concat(matAmtValue));
        }
        let withdrawAmtValue = this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).value;
        if (!isNaN(parseInt(withdrawAmtValue, 10))) {
          withdrawAmtValue = this.commonService.removeAmountFormatting(withdrawAmtValue);
          withdrawAmtValue = this.currencyConverterPipe.transform(withdrawAmtValue ? withdrawAmtValue : '', tdCurCode);
          this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValue(tdCurCode.concat(' ').concat(withdrawAmtValue));
        }
      }
    } else if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.form.get(FccGlobalConstant.CURRENCY_TD)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.CURRENCY_TD).clearValidators();
      this.form.get(FccGlobalConstant.TRANSACTION_DETAILS)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.CREDIT_ACCOUNT)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.PAYMENT_INSTRUCTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.NOTE_WITHDRAWAL_MSG)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.NOTE_MSG)[this.params][FccGlobalConstant.RENDERED] = true;
      if (this.form.get(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY).value === '' && this.mode === 'view'){
          this.form.get(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
      }
      if (this.operation === FccGlobalConstant.LIST_INQUIRY || this.operation === FccGlobalConstant.PREVIEW) {
        let matAmtValue = this.form.get(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY).value;
        if (!isNaN(parseInt(matAmtValue, 10))) {
          matAmtValue = this.currencyConverterPipe.transform(matAmtValue ? matAmtValue : '', tdCurCode);
          this.form.get(FccGlobalConstant.MATURITY_AMOUNT_DISPLAY).setValue(tdCurCode.concat(' ').concat(matAmtValue));
        }
      }
    }
    if (this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.PAYMENT_INSTRUCTIONS))) {
      const maurityInstVal = this.form.get(FccGlobalConstant.PAYMENT_INSTRUCTIONS).value;
      if (maurityInstVal === FccGlobalConstant.AUTO_RENEWAL_PRINCIPAL_AND_INTEREST) {
        this.form.get(FccConstants.CREDIT_ACCOUNT)[this.params][FccGlobalConstant.REQUIRED] = false;
        this.form.get(FccConstants.CREDIT_ACCOUNT).clearValidators();
      }
    }
    this.form.updateValueAndValidity();
  }

  checkDraftFormForMaturityDate() {
    if (this.mode === FccGlobalConstant.DRAFT_OPTION &&
      this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.MATURITY_DATE).value) &&
      this.form.get(FccGlobalConstant.MATURITY_DATE).value !== FccGlobalConstant.BLANK_SPACE_STRING) {
        const date = this.form.get(FccGlobalConstant.MATURITY_DATE).value;
        this.form.get(FccGlobalConstant.MATURITY_DATE_ACCT).setValue(date);
    }
  }

  convertSpaceToEmpty(field: any) {
    const formField = this.form.get(field);
    if (formField && this.commonService.isnonEMptyString(formField.value) && formField.value === FccGlobalConstant.BLANK_SPACE_STRING) {
      formField.setValue('');
    }
  }

  onClickCreditAccount(event) {
    if (event.value) {
      this.form.get(FccConstants.CREDIT_ACCOUNT).setValue(event.value);
      this.form.get(FccConstants.CREDIT_ACCOUNT_ID).setValue(event.value.id);
    }
  }

  onClickCreditAccountWd(event) {
    if (event.value) {
      this.form.get(FccConstants.CREDIT_ACCOUNT_WD).setValue(event.value);
      this.form.get(FccConstants.CREDIT_ACCOUNT_ID).setValue(event.value.id);
    }
  }

  onClickPartialWithdrawal() {
    const togglevalue = this.form.get(FccGlobalConstant.PARTIAL_WITHDRAWAL).value;
    if (!this.withDrawalAmountExists) {
      this.handleToggle(togglevalue);
    } else if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.commonService.formLoadDraft) {
      this.commonService.formLoadDraft = false;
      if (togglevalue === FccBusinessConstantsService.YES) {
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).clearValidators();
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.CURRENCY_TD),
        this.form.get(FccGlobalConstant.CURRENCY_TDUP)?.value, {});
        this.form.get(FccGlobalConstant.CURRENCY_TD)[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.CURRENCY_TD)[this.params][FccGlobalConstant.READONLY] = true;
        this.form.get(FccGlobalConstant.CURRENCY_TD).clearValidators();
        let withdrawalAmt = this.form.controls[FccGlobalConstant.WITHDRAWAL_AMOUNT].value;
        if(this.commonService.isnonEMptyString(withdrawalAmt)){
          withdrawalAmt = this.commonService.replaceCurrency(withdrawalAmt);
          withdrawalAmt = this.currencyConverterPipe.transform(withdrawalAmt.toString(), this.curCode);
          this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValue(withdrawalAmt);
        }
        this.form.controls[FccGlobalConstant.WITHDRAWAL_AMOUNT].disable();
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setErrors(null);
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT)[this.params][FccGlobalConstant.ORIGINAL_VALUE] =
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).value;
      } else {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.CURRENCY_TD),
        this.form.get(FccGlobalConstant.CURRENCY_TDUP)?.value, {});
        this.form.get(FccGlobalConstant.CURRENCY_TD)[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT)[this.params][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT)[this.params][FccGlobalConstant.READONLY] = false;
        this.form.controls[FccGlobalConstant.WITHDRAWAL_AMOUNT].enable();
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT)[this.params][FccGlobalConstant.ORIGINAL_VALUE] =
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).value;
        this.form.get(FccGlobalConstant.CURRENCY_TD)[this.params][FccGlobalConstant.READONLY] = false;
      }
    }
    this.withDrawalAmountExists = false;
    this.form.updateValueAndValidity();
  }

  protected handleToggle(togglevalue: any) {
    this.curCode = this.form.get(FccGlobalConstant.CURRENCY_TD) ? this.form.get(FccGlobalConstant.CURRENCY_TD).value : '';
    if (togglevalue === FccBusinessConstantsService.YES) {
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT),
        this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT).value, { rendered: true });
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).clearValidators();
      this.form.get(FccGlobalConstant.CURRENCY_TD)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.CURRENCY_TD)[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT)[this.params][FccGlobalConstant.ORIGINAL_VALUE] =
        this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT).value;
      let valueupdated = this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT).value ?
        this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT).value : '';
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.curCode);
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValue(valueupdated);
      this.form.get(FccGlobalConstant.CURRENCY_TD).clearValidators();
      this.form.controls[FccGlobalConstant.WITHDRAWAL_AMOUNT].disable();
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setErrors(null);
    } else {
      this.form.get(FccGlobalConstant.CURRENCY_TD)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT),
        '', { rendered: true, readonly: false, originalValue: '' });
      this.form.controls[FccGlobalConstant.WITHDRAWAL_AMOUNT].enable();
      if (this.operation === FccGlobalConstant.LIST_INQUIRY || this.operation === FccGlobalConstant.PREVIEW) {
        let valueupdated = this.getAmountOriginalValue(FccGlobalConstant.WITHDRAWAL_AMOUNT);
        valueupdated = this.currencyConverterPipe.transform(valueupdated, this.curCode);
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValue(valueupdated);
      } else {
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValue('');
      }
    }
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
      });
  }

  getParamDataFields() {
    this.commonService.getBankDetails().subscribe(
      bankRes => {
        this.bankName = bankRes.shortName;
        this.commonService.getParameterConfiguredValues(this.bankName,
          FccGlobalConstant.PARAMETER_P654).subscribe(response => {
            if (response && response.paramDataList) {
              this.paramList654 = response.paramDataList;
              if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
                this.onClickPaymentInstructions();
              }
            }
          });
      });
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
          if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
            this.patchFieldParameters(this.form.get(FccConstants.CREDIT_ACCOUNT), { options: this.accounts });
            this.getAccounts(FccConstants.CREDIT_ACCOUNT);
          } else {
            this.patchFieldParameters(this.form.get(FccConstants.CREDIT_ACCOUNT_WD), { options: this.accounts });
            if (this.form.get(FccConstants.CREDIT_ACCOUNT_WD).value) {
              this.getAccounts(FccConstants.CREDIT_ACCOUNT_WD);
            }
          }
          this.form.updateValueAndValidity();
        }
      });
  }

  getAccounts(accountType: any) {
    const account = this.stateService.
      getValue(FccConstants.TD_CSTD_UPDATE_GENERAL_DETAILS, accountType, this.isMasterRequired);
    const accountLabel = this.accounts.filter(task => task.value.label === account);
    const accountName = this.accounts.filter(task => task.value.name === account);
    if (accountLabel !== undefined && accountLabel !== null && accountLabel.length > 0) {
      this.form.get(accountType).setValue(accountLabel[0].value);
    } else if (accountName !== undefined && accountName !== null && accountName.length > 0) {
      this.form.get(accountType).setValue(accountName[0].value);
    }
  }

  allUserAccounts(): Observable<any> {
    return this.dashboardService.getUserAccount();
  }

  getUserAccountsByEntityId(accountParameters?: any): Observable<any> {
    return this.dashboardService.getUserAccountsByEntityId(this.entityId, accountParameters);
  }

  formatDateddmmyyyy(inputDate: any) {
    if (this.commonService.isnonEMptyString(inputDate) && inputDate !== FccGlobalConstant.BLANK_SPACE_STRING &&
    inputDate.indexOf('/') === -1) {
      const date = new Date(inputDate);
      if (!isNaN(date.getTime())) {
        // Months use 0 index.
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return day + '/' + month + '/' + date.getFullYear();
      }
    }
    return inputDate;
}

  cheackForValidation(event, formatValidation) {
    const enteredAmt = event.target.value;
    const avlAmt = Number(this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT).value);
    this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValue(enteredAmt);
    if (isNaN(Number(enteredAmt)) && formatValidation) {
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      return;
    }
    if (!(/^((\d)+(\.\d{1,17}))$/.test(enteredAmt)) && enteredAmt.length && enteredAmt.includes('.') && formatValidation) {
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setErrors({ amountCanNotBeZero : true });
      return;
    }
    if (enteredAmt && enteredAmt.length > FccGlobalConstant.LENGTH_18) {
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setErrors({ amountLengthGreaterThanMaxLength : true });
      return;
    }
    if (enteredAmt) {
      const amountVal = Number(enteredAmt);
      if (amountVal <= FccGlobalConstant.ZERO) {
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setErrors({ amountCanNotBeZero : true });
      } else if (amountVal > avlAmt) {
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setErrors({ maxAmtLimit : avlAmt });
      } else {
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).clearValidators();
      }
    } else {
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setErrors({ required: true });
    }
    this.form.updateValueAndValidity();
  }

  onFocusWithdrawalAmount() {
    this.OnClickAmountFieldHandler(FccGlobalConstant.WITHDRAWAL_AMOUNT);
  }

  onKeyupWithdrawalAmount(event: any) {
    this.curCode = this.form.get(FccGlobalConstant.CURRENCY_TD) ? this.form.get(FccGlobalConstant.CURRENCY_TD).value : '';
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.WITHDRAWAL_AMOUNT, event.target.value, this.curCode, 
        this.currencyDecimalplacesZero, 
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    this.cheackForValidation(event, true);
  }

  onBlurWithdrawalAmount($event) {
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.WITHDRAWAL_AMOUNT, $event.target.value, this.curCode, 
        this.currencyDecimalplacesZero, 
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    this.curCode = this.form.get(FccGlobalConstant.CURRENCY_TD) ? this.form.get(FccGlobalConstant.CURRENCY_TD).value : '';
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.WITHDRAWAL_AMOUNT, $event.target.value, this.curCode, 
        this.currencyDecimalplacesZero, 
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    let valueupdated = this.commonService.replaceCurrency($event.target.value);
    this.setAmountLengthValidator(FccGlobalConstant.WITHDRAWAL_AMOUNT);
    const avlAmt = Number(this.form.get(FccGlobalConstant.AVAILABLE_AMOUNT).value);
    if (valueupdated > avlAmt) {
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.curCode);
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValue(valueupdated);
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setErrors({ maxAmtLimit : avlAmt });
      return;
    }
    valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.curCode);
    this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValue(valueupdated);
    this.form.get(FccGlobalConstant.TNX_AMT).setValue(valueupdated);
    this.cheackForValidation($event, false);
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_TD, key);
  }

  ngOnDestroy() {
    if(this.nonNumericCurrencyValidator && this.form &&
      this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).value)){
      this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.WITHDRAWAL_AMOUNT, 
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).value, 
        this.curCode, 
        this.currencyDecimalplacesZero, 
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (this.form) {
      if(!this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).valid ||
      this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT)?.value)
       && this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT)[this.params][FccGlobalConstant.RENDERED]){
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).setErrors({ required: true });
        this.form.get(FccGlobalConstant.WITHDRAWAL_AMOUNT).markAsTouched();
      }
      this.form.get(FccConstants.CREDIT_ACCOUNT_WD)[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = true;
    }
    localStorage.setItem('form-dirty' , 'yes');
    localStorage.setItem('formDestroy' , 'true');
    this.stateService.setStateSection(FccConstants.TD_CSTD_UPDATE_GENERAL_DETAILS, this.form);
  }

}
