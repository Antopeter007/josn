import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';

import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { FilelistService } from '../../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../trade/lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CodeData } from './../../../../../common/model/codeData';
import { CurrencyRequest } from './../../../../../common/model/currency-request';
import { CodeDataService } from './../../../../../common/services/code-data.service';
import { CommonService } from './../../../../../common/services/common.service';
import { DropDownAPIService } from './../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { MultiBankService } from './../../../../../common/services/multi-bank.service';
import { SessionValidateService } from './../../../../../common/services/session-validate-service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LcConstant } from './../../../../trade/lc/common/model/constant';
import { ProductStateService } from './../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from './../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { emptyCurrency } from './../../../../trade/lc/initiation/validator/ValidateAmt';
import { LnProductComponent } from './../ln-product/ln-product.component';
import { FacilityDetailsService } from './../services/facility-details.service';
import { CorporateCommonService } from '../../../../../corporate/common/services/common.service';
import { LendingCommonDataService } from '../../../common/service/lending-common-data-service';


@Component({
  selector: 'app-loan-remittance-instructions',
  templateUrl: './loan-remittance-instructions.component.html',
  styleUrls: ['./loan-remittance-instructions.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LoanRemittanceInstructionsComponent }]
})
export class LoanRemittanceInstructionsComponent extends LnProductComponent implements OnInit, AfterViewInit {

  form: FCCFormGroup;
  module = `${this.translateService.instant('loanRemittanceInstructions')}`;
  contextPath: any;
  tnxTypeCode: any;
  mode: any;
  productCode: any;
  option: any;
  applDate: any;
  currency: SelectItem[] = [];
  lnCurrencyList: SelectItem[] = [];
  currencyData = [];
  curRequest: CurrencyRequest = new CurrencyRequest();
  lcConstant = new LcConstant();
  codeData = new CodeData();
  OMR = 'OMR';
  BHD = 'BHD';
  TND = 'TND';
  JPY = 'JPY';
  isoamt = '';
  loanEffectiveDate: any = 'loanEffectiveDate';
  riskType: any = 'riskType';
  amount: any = 'amount';
  enteredCurMethod = false;
  iso;
  val;
  amtVal;
  flagDecimalPlaces;
  twoDecimal = 2;
  threeDecimal = 3;
  length2 = FccGlobalConstant.LENGTH_2;
  validatorPattern = FccGlobalConstant.AMOUNT_VALIDATION;
  facilityID: any;
  facilityEffectiveDate: any;
  facilityMaturityDate: any;
  facilityExpiryDate: any;
  facilityDetails: any = {};
  corporateReferenceValueList: any;
  pricingOptions = [];
  riskTypes = [];
  repricingFrequency = [];
  dateRequestParams: any = {};
  isEffectiveDateFlag = false;
  isRepricingDateFlag = false;
  repricingdateValidation: any;
  remittanceFlag: any;
  repricingDatesValidationInprocess: any;
  tableColumns = [];
  lnRefID: any;
  validAmt = false;
  loanRequestTypeOptions: any;
  loanDetailsReference: any;
  pricingOptionsCodeID: any;
  pricingOptionsDataArray: any;
  riskTypeCodeID: any;
  riskTypeDataArray: any;
  amountErrors: any;
  loanEffectiveDateErrors: any;
  loanMaturityDateErrors: any;
  repricingFreqCodeData: any;
  validateAmountWithrepricingDate: Subject<any> = new Subject<any>();
  commitmentDataWithrepricingDate: Subject<any> = new Subject<any>();
  selectedRiskType: any;
  allCurrencies: any;
  bankServerDate: any;
  bankServerDateObj: Date;
  facilityData: any;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
    protected stateService: ProductStateService, protected translateService: TranslateService,
    protected eventEmitterService: EventEmitterService, protected dropdownAPIService: DropDownAPIService,
    public fccGlobalConstantService: FccGlobalConstantService, protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService, protected resolverService: ResolverService,
    protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
    public datePipe: DatePipe, protected multiBankService: MultiBankService,
    protected facilityDetailsService: FacilityDetailsService, protected currencyConverterPipe: CurrencyConverterPipe,
    protected codeDataService: CodeDataService,
    protected corporateCommonService: CorporateCommonService,
    protected lendingService: LendingCommonDataService
  ) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe);
  }

  ngAfterViewInit() {
    if (this.form && this.form.get('currency') && this.form.get('amount')) {
      this.onBlurAmount();
      if (this.amountErrors) {
        this.form.get('amount').setErrors(this.amountErrors);
        this.form.get('amount').markAsDirty();
        this.form.get('amount').markAsTouched();
      }
    }
  }

  ngOnInit(): void {
    super.ngOnInit();
    window.scroll(0, 0);
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.applDate = this.commonService.getQueryParametersFromKey(FccGlobalConstant.applDate);
    const generaDetailsSection = this.stateService.getSectionData(FccGlobalConstant.LN_GENERAL_DETAILS);
    this.facilityID = this.stateService.getSectionData(
      FccGlobalConstant.LN_GENERAL_DETAILS).get('facilityID').value;
    this.facilityEffectiveDate = this.stateService.getSectionData(
      FccGlobalConstant.LN_GENERAL_DETAILS).get('effectiveDate');
    this.facilityMaturityDate = this.stateService.getSectionData(
      FccGlobalConstant.LN_GENERAL_DETAILS).get('maturityDate');
    this.facilityExpiryDate = this.stateService.getSectionData(
      FccGlobalConstant.LN_GENERAL_DETAILS).get('expiryDate');
    this.loanRequestTypeOptions = this.stateService.getSectionData(
      FccGlobalConstant.LN_GENERAL_DETAILS).get('loanRequestTypeOptions').value;
    this.facilityData = this.stateService.getSectionData(
      FccGlobalConstant.LN_GENERAL_DETAILS).get('facilityData').value;
    if (this.facilityData && this.facilityData !== "") {
      this.facilityDetails = this.facilityData;
    }


    if (generaDetailsSection.get('loanDetailsReference') !== null) {
      this.corporateReferenceValueList = generaDetailsSection.get('loanDetailsReference').value;
      this.loanDetailsReference = generaDetailsSection.get('loanDetailsReference').value;
    }

    this.commonService.applDateService.subscribe(res => {
      this.applDate = res;
      this.initializeFormGroup();
      this.commonService.formatForm(this.form);
      if (this.form && this.form.get('currency') && this.form.get('amount')) {
        this.onBlurAmount();
        if (this.amountErrors) {
          this.form.get('amount').setErrors(this.amountErrors);
          this.form.get('amount').markAsDirty();
          this.form.get('amount').markAsTouched();
        }
      }
    });
    this.setBankServerDate();
  }

  setBankServerDate() {
    if (this.commonService.isEmptyValue(this.form.get('loanEffectiveDate').value)) {
      this.commonService.globalBankDate$.subscribe(
        date => {
          this.bankServerDateObj = date;
          this.bankServerDate = date.toLocaleDateString('en-In');
          this.form.get('loanEffectiveDate')[this.params][FccGlobalConstant.MIN_DATE] = this.bankServerDateObj;
          this.form.get('loanMaturityDate')[this.params][FccGlobalConstant.MIN_DATE] = this.bankServerDateObj;
          this.form.get('repricingDate')[this.params][FccGlobalConstant.MIN_DATE] = this.bankServerDateObj;
          this.populateBusinessDateForEffectiveDateField(this.bankServerDate);
          this.setDefaultEffectiveDateOnLoad();
        }
      );
    } else {
      this.bankServerDateObj = this.form.get('loanEffectiveDate').value;
    }
  }

  /**
   * Initialise the form from state service
   */
  initializeFormGroup() {
    const sectionName = FccGlobalConstant.LN_REMITTANCE_INSTRUCTIONS;
    this.form = this.stateService.getSectionData(sectionName);
    // const isMultiRisk = (this.facilityDetailsService.getRiskTypes()
    // && this.facilityDetailsService.getRiskTypes().length > 0) ? true : false;
    this.disableFormIfNoBorrowerSelected();
    // this.disableFormIfNoBorrowerSelected(isMultiRisk);
    if (this.loanDetailsReference !== null) {
      this.applDate = this.form.get('loanApplDate').value ? this.form.get('loanApplDate').value : this.applDate;
      this.patchFieldValueAndParameters(this.form.get('loanApplDate'), this.applDate, {});
      if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
        this.form.get('balanceheader')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.getFacilityDetails();
      if (this.form.get('currency')[FccGlobalConstant.OPTIONS].length === 0) {
        this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
      }
      this.form.updateValueAndValidity();
    }
  }

  getCodeDataDetails() {
    this.codeData.codeId = FccGlobalConstant.CODEDATA_REPRICING_FREQUENCY_CODES_C031;
    this.codeData.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
      localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
    this.commonService.getCodeDataDetails(this.codeData).subscribe(response => {
      this.repricingFreqCodeData = response.body.items;
    });
  }

  disableFormIfNoBorrowerSelected(isMultiRiskType?: boolean) {
    if (this.loanDetailsReference === null || (isMultiRiskType && !this.selectedRiskType)) {
      this.form.get('warningMsg')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('currency')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.get('currency')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = 'currency-disable';
      this.form.get('currency')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get('currency').disable();
      this.form.get('currency').updateValueAndValidity();
      this.form.get('balanceheader')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('amount').disable();
      this.form.get('amount').updateValueAndValidity();
      this.form.get('pricingOptions').disable();
      this.form.get('pricingOptions').updateValueAndValidity();
      if (this.loanDetailsReference === null) {
        this.form.get('riskType').disable();
        this.form.get('riskType').updateValueAndValidity();
      }
      this.form.get('loanEffectiveDate').disable();
      this.form.get('loanEffectiveDate').updateValueAndValidity();
      this.form.get('loanMaturityDate').disable();
      this.form.get('loanMaturityDate').updateValueAndValidity();
      this.form.get('repricingDate').disable();
      this.form.get('repricingDate').updateValueAndValidity();
      this.form.get('repricingFrequency').disable();
      this.form.get('repricingFrequency').updateValueAndValidity();
      this.form.updateValueAndValidity();
    } else {
      this.form.get('warningMsg')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('currency')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form.get('currency')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = 'no-margin-multiselect';
      this.form.get('currency')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get('currency').enable();
      this.form.get('currency').updateValueAndValidity();
      this.form.get('amount').enable();
      this.form.get('amount').updateValueAndValidity();
      if (this.amountErrors) {
        this.form.get('amount').setErrors(this.amountErrors);
        this.form.get('amount').markAsDirty();
        this.form.get('amount').markAsTouched();
      }
      this.form.get('pricingOptions').enable();
      this.form.get('pricingOptions').updateValueAndValidity();
      this.form.get('riskType').enable();
      this.form.get('riskType').updateValueAndValidity();
      if (!this.form.get('currency').value && !this.form.get('pricingOptions').value) {
        this.form.get('loanEffectiveDate').disable();
      } else {
        this.form.get('loanEffectiveDate').enable();
      }
      this.form.get('loanEffectiveDate').updateValueAndValidity();
      this.form.get('loanMaturityDate').enable();
      this.form.get('loanMaturityDate').updateValueAndValidity();
      this.form.get('repricingDate').enable();
      this.form.get('repricingDate').updateValueAndValidity();
      this.form.get('repricingFrequency').enable();
      this.form.get('repricingFrequency').updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

  handleValuesOnLoad() {
    if (this.form.get('balanceCurrency') && this.form.get('currency') && this.form.get('balanceCurrency').value) {
      this.patchFieldValueAndParameters(this.form.get('currency'), this.form.get('balanceCurrency').value, {});
    }
    if (this.form.get('balanceCurrency') && this.form.get('currency') && this.form.get('currency').value) {
      this.patchFieldValueAndParameters(this.form.get('balanceCurrency'), this.form.get('currency').value, {});
    }
    if (this.form.get('defaultLoanEffectiveDate') && this.form.get('defaultLoanEffectiveDate').value === '') {
      this.setDefaultEffectiveDateOnLoad();
    }
    const subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    const pricingOptionsElementValue = this.form.get('pricingOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    if (this.form.get('pricingOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
      this.form.get('pricingOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
      this.form.get('pricingOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
      this.pricingOptionsCodeID = this.form.get('pricingOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    }
    if (pricingOptionsElementValue !== undefined && pricingOptionsElementValue.length === 0) {
      this.pricingOptionsDataArray = this.codeDataService.getCodeData(
        this.pricingOptionsCodeID, this.productCode, subProductCode, this.form, 'pricingOptions');
      this.patchFieldParameters(this.form.get('pricingOptions'), { options: this.pricingOptionsDataArray });
    }
    if (pricingOptionsElementValue !== undefined && pricingOptionsElementValue.length !== 0) {
      pricingOptionsElementValue.forEach((value, index) => {
        if (value.value === '*') {
          pricingOptionsElementValue.splice(index, 1);
        }
      });
      this.patchFieldParameters(this.form.get('pricingOptions'), { options: pricingOptionsElementValue });
      if (this.form.get('pricingOptions') && (!this.form.get('pricingOptions').value || this.form.get('pricingOptions').value === '')) {
        this.patchFieldValueAndParameters(this.form.get('pricingOptions'), pricingOptionsElementValue[1], {});
      }

    }
    this.updatePricingOptionDependentFields(pricingOptionsElementValue);
  }

  getFacilityDetails() {
    const internalReferenceList = this.multiBankService.getBorrowerReferenceInternalList();
    internalReferenceList.forEach(reference => {
      if (this.corporateReferenceValueList === reference.value) {
        this.lnRefID = reference.id;
      }
    });
    this.getRiskTypes();
    this.setSwinglineDrawdownCodes();
    const subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    const riskTypeElementValue = this.form.get('riskType')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    if (this.form.get('riskType')[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
      this.form.get('riskType')[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
      this.form.get('riskType')[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
      this.riskTypeCodeID = this.form.get('riskType')[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    }
    if (riskTypeElementValue !== undefined && riskTypeElementValue !== null && riskTypeElementValue.length === 0) {
      this.riskTypeDataArray = this.codeDataService.getCodeData(
        this.riskTypeCodeID, this.productCode, subProductCode, this.form, 'riskType');
      this.patchFieldParameters(this.form.get('riskType'), { options: this.riskTypeDataArray });
    }
    if (riskTypeElementValue !== undefined && riskTypeElementValue !== null && riskTypeElementValue.length !== 0) {
      riskTypeElementValue.forEach((value, index) => {
        if (value.value === '*') {
          riskTypeElementValue.splice(index, 1);
        }
      });
      this.patchFieldParameters(this.form.get('riskType'), { options: riskTypeElementValue });
    }
    this.form.updateValueAndValidity();
    if (this.facilityDetailsService.getRiskTypes() && this.facilityDetailsService.getRiskTypes().length === 1) {
      this.selectedRiskType = this.facilityDetailsService.getRiskTypes()[0];
      this.setFieldsInLoan();
    } else if (this.facilityDetailsService.getRiskTypes() && this.facilityDetailsService.getRiskTypes().length > 1) {
      if (this.riskTypes && this.riskTypes.length > 0 && this.form.get('riskType')
        && ((!this.form.get('riskType').value) || this.form.get('riskType').value === '')) {
        this.onClickRiskType(this.riskTypes[0]);
      } else if (this.form.get('riskType') && this.form.get('riskType').value && this.riskTypes && this.riskTypes.length > 0) {
        const borrower = this.facilityDetails.borrowers.filter(refDetails => refDetails.borrowerId === this.lnRefID);
        if (this.loanRequestTypeOptions === FccGlobalConstant.LN_REQUEST_TYPE_SWNG && borrower[0].isSwinglineAllowed) {
          const riskTypes = 'riskTypes';
          const riskTypesObj = this.facilityDetailsService.getFacilityDetailsObj()[riskTypes];
          this.facilityDetailsService.getFacilityDetailsObj()[riskTypes].forEach((element, index) => {
            if (element.id === FccGlobalConstant.RISK_TYPE_LOANS) {
              riskTypesObj.splice(index, 1);
            }
          });
          const filteredRec = riskTypesObj.filter(risk => risk.value === this.form.get('riskType').value)[0];
          this.onClickRiskType(filteredRec);
        } else {
          const filteredRec = this.riskTypes.filter(risk => risk.value === this.form.get('riskType').value)[0];
          this.onClickRiskType(filteredRec);
        }
      }
    }
  }

  setFieldsInLoan() {
    this.repricingdateValidation = this.facilityDetailsService.getRepricingdateValidation();
    this.remittanceFlag = this.facilityDetailsService.getRemittanceFlag();
    this.patchFieldValueAndParameters(this.form.get('repricingdateValidation'), this.repricingdateValidation, {});
    this.patchFieldValueAndParameters(this.form.get('remittanceFlag'), this.remittanceFlag, {});
    this.setSwinglineDrawdownCodes();
    if (!this.facilityDetails && this.facilityDetailsService.getFacilityDetailsObj() && !this.facilityData) {
      this.facilityDetails = this.facilityDetailsService.getFacilityDetailsObj();
    }
    if (this.facilityDetails && this.facilityDetails.borrowers && this.facilityDetails.borrowers.length > 0) {
      const borrower = this.facilityDetails.borrowers.filter(refDetails => refDetails.borrowerId === this.lnRefID);
      if (borrower && borrower[0] && borrower[0].borrowerId === this.lnRefID) {
        this.lnCurrencyList = [];
        this.currencyData = [];
        borrower[0].currencies.forEach(currencyDetails => {
          this.lnCurrencyList.push(currencyDetails.id);
          const selectedRisk = currencyDetails.riskType.filter(risk => risk === this.selectedRiskType.id)[0];
          let selectedRiskLimit;
          if (selectedRisk) {
            selectedRiskLimit = currencyDetails.riskTypeLimit[selectedRisk];
          }
          const ccy = {
            id: currencyDetails.id,
            limit: currencyDetails.limit,
            borrowerlimit: currencyDetails.borrowerLimit,
            borrowerCcylimit: currencyDetails.borrowerCurrencyLimit,
            limitWithPend: currencyDetails.limitWithPending,
            limitFXRate: currencyDetails.limitFXRate,
            riskType: selectedRisk,
            riskTypeLimit: selectedRiskLimit,
            swinglineLimit: currencyDetails.swinglineLimit,
            sublimitRisklimit: currencyDetails.sublimitRisklimit
          };
          const index = this.currencyData.findIndex(curr => (curr.id === ccy.id && curr.riskType === ccy.riskType));
          if (index < 0 && selectedRisk) {
            this.currencyData.push(ccy);
          }
        });
        this.handleValuesOnLoad();
        this.onBlurAmount();
        this.patchFieldValueAndParameters(this.form.get('lnAccessType'), this.facilityDetails.accessType, {});
        this.patchFieldValueAndParameters(this.form.get('borrowerLimitCurCode'), this.facilityDetails.mainCurrency, {});
        if (this.loanRequestTypeOptions === FccGlobalConstant.LN_REQUEST_TYPE_SWNG && borrower[0].isSwinglineAllowed) {
          this.patchFieldValueAndParameters(this.form.get('subLimitName'), borrower[0].subLimitName, {});
        } else {
          this.patchFieldValueAndParameters(this.form.get('subLimitName'), '', {});
        }
        this.getCurrencyDetail();
        this.getPricingOptions(this.facilityDetailsService.getPricingOptions());
        this.setSwinglineDrawdownCodes();
        if (this.remittanceFlag === 'mandatory' || this.remittanceFlag === 'true') {
          this.form.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          this.setupRemittanceInstructions();
          if (this.form.get('currency') && this.form.get('currency').value !== '') {
            this.setupRemittanceInstructionsBasedOnCurrency();
          }
        } else {
          this.form.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('remittanceInst').setValidators([]);
          this.form.get('remittanceInst').setErrors(null);
        }
        if (!this.form.get('repricingFrequency').value) {
          this.form.get('repricingDate').disable();
          this.setMandatoryField(this.form, 'repricingDate', false);
        }

        if (!this.form.get('currency').value && !this.form.get('pricingOptions').value) {
          this.form.get('loanEffectiveDate').disable();
        }

      }
      const paramId = 'P768';
      const key1 = this.stateService.getSectionData(
        FccGlobalConstant.LN_GENERAL_DETAILS).get('issuingBankAbbvName').value;
      const key2 = this.facilityDetails.type;
      let key3;
      if (this.stateService.getSectionData(
        FccGlobalConstant.LN_GENERAL_DETAILS).get('subProductCode').value === FccGlobalConstant.N047_LOAN_SWINGLINE) {
        key3 = 'SWINGLINE';
      } else {
        key3 = 'DRAWDOWN';
      }
      this.commonService.getParameterConfiguredValues(key1, paramId, key2, key3).subscribe(resp => {
        if (resp && resp.paramDataList) {
          resp.paramDataList.forEach(element => {
            const translatedLegalTextVal = `${this.translateService.instant(element.data_1)}`;
            this.patchFieldValueAndParameters(this.form.get('legalTextValue'), translatedLegalTextVal, {});
            this.patchFieldValueAndParameters(this.form.get('acceptLegalText'), 'Y', {});
          });
        }
      });
      this.checAmountAgainstCurreny();
      if (this.form.get('remittanceInst')) {
        const event = {
          description: (this.form.get('remInstDescription') && this.form.get('remInstDescription').value) ?
            this.form.get('remInstDescription').value : null,
          currency: (this.form.get('currency') && this.form.get('currency').value) ?
            this.form.get('currency').value.value : null,
          accountNumber: (this.form.get('remInstAccountNo') && this.form.get('remInstAccountNo').value) ?
            this.form.get('remInstAccountNo').value : ""
        };
        this.form.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] = event;
      }
    }
  }

  setSwinglineDrawdownCodes() {
    if (this.loanRequestTypeOptions === 'swingline') {
      this.facilityDetailsService.setSwinglineData('Y');
    } else {
      this.facilityDetailsService.setSwinglineData('N');
    }
  }

  /*This method make the ajax call on load of screen  and sets the default effective date.*/
  setDefaultEffectiveDateOnLoad() {
    if (this.form.get('currency') && this.form.get('currency').value === '') {
      this.form.controls[this.loanEffectiveDate].disable();
    }

    let convertedEffectiveDate = this.form.get('loanEffectiveDate').value;
    if (convertedEffectiveDate !== '' && convertedEffectiveDate !== null && convertedEffectiveDate !== undefined) {
      convertedEffectiveDate = this.utilityService.transformDateFormat(
        convertedEffectiveDate);
    }

    const effectiveDate = convertedEffectiveDate ? convertedEffectiveDate : this.applDate;
    const currentDateToValidate = this.utilityService.transformDateFormat(this.bankServerDateObj);
    if (this.form.get('pricingOptions').value !== '' && effectiveDate !== '' && this.form.get('currency').value !== '') {
      this.dateRequestParams = {};
      this.dateRequestParams.dateToValidate = currentDateToValidate;
      this.dateRequestParams.isRepricingDate = 'N';
      this.dateRequestParams.boFacilityId = this.facilityID;
      this.dateRequestParams.currency = this.form.get('currency').value.shortName;
      this.dateRequestParams.pricingOptionName = this.form.get('pricingOptions').value;
      this.dateRequestParams.dealId = this.stateService.getSectionData(
        FccGlobalConstant.LN_GENERAL_DETAILS).get('dealID').value;
      this.dateRequestParams.operation = '';
      this.dateRequestParams.borrowerId = this.lnRefID;
      this.commonService.getValidateBusinessDate(this.dateRequestParams).subscribe((res) => {
        this.populateDefaultEffectiveDate(res);
      });
    }
  }

  /*This method gets the effective date and set the value in default effective date hidden field.*/
  populateDefaultEffectiveDate(response) {
    if (response) {
      const dateValue = response.adjustedLocalizedDate;
      this.patchFieldValueAndParameters(this.form.get('defaultLoanEffectiveDate'),
        this.utilityService.transformddMMyyyytoDate(dateValue), {});
    }
  }

  /*this method makes the ajax call to get the business date from loan iq*/
  setEffectiveDateAsPerTheBusinessDayRule() {
    let convertedEffectiveDate = this.form.get('loanEffectiveDate').value;
    if (convertedEffectiveDate !== '' && convertedEffectiveDate !== null && convertedEffectiveDate !== undefined) {
      convertedEffectiveDate = this.utilityService.transformDateFormat(
        convertedEffectiveDate);
    }
    const effectiveDate = convertedEffectiveDate ? convertedEffectiveDate : this.applDate;
    if (this.form.get('pricingOptions').value !== '' && effectiveDate !== '' && this.form.get('currency').value
      && this.form.get('currency').value !== '') {
      this.dateRequestParams = {};
      this.dateRequestParams.dateToValidate = effectiveDate;
      this.dateRequestParams.isRepricingDate = 'N';
      this.dateRequestParams.boFacilityId = this.facilityID;
      this.dateRequestParams.currency = this.form.get('currency').value.shortName;
      this.dateRequestParams.pricingOptionName = this.form.get('pricingOptions').value;
      this.dateRequestParams.dealId = this.stateService.getSectionData(
        FccGlobalConstant.LN_GENERAL_DETAILS).get('dealID').value;
      this.dateRequestParams.operation = '';
      this.dateRequestParams.borrowerId = this.lnRefID;
      this.commonService.getValidateBusinessDate(this.dateRequestParams).subscribe((res) => {
        if (res && res.adjustedLocalizedDate) {
          let formattedDate = this.form.get('loanEffectiveDate').value;
          formattedDate = this.utilityService.transformDateFormat(formattedDate);
          if (formattedDate.toString() === res.adjustedLocalizedDate.toString()) {
            this.isEffectiveDateFlag = true;
            this.form.get('loanEffectiveDate').enable();
          } else {
            this.isEffectiveDateFlag = false;
            this.populateBusinessDateForEffectiveDateField(res.adjustedDate);
          }
          this.validateLoanEffectiveDate();
          this.validateLoanMaturityDate();
          this.calculateRepricingDate();
          this.validateLoanRepricingDate();
          if (this.form.get('defaultLoanEffectiveDate') && this.form.get('defaultLoanEffectiveDate').value === '') {
            this.setDefaultEffectiveDate();
          }
        }
      });
    }
  }

  /**
   * This method render the loan iq business date for effective date
   */
  populateBusinessDateForEffectiveDateField(response) {
    if (response) {
      const dateParts = response.toString().split('/');
      const dateObject = new Date(dateParts[FccGlobalConstant.LENGTH_2],
        dateParts[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1, dateParts[FccGlobalConstant.LENGTH_0]);

      const defaultEffectiveDate = this.form.get('defaultLoanEffectiveDate').value;
      const appDateField = this.form.get('loanApplDate').value ? this.form.get('loanApplDate').value : this.applDate;
      const effectiveDateField = this.form.get('loanEffectiveDate').value;
      if (appDateField && effectiveDateField && defaultEffectiveDate && !this.isEffectiveDateFlag) {
        if (this.utilityService.compareDateFields(
          effectiveDateField, this.utilityService.transformddMMyyyytoDate(appDateField))
          && this.utilityService.compareDateFields(defaultEffectiveDate, effectiveDateField)) {
          this.form.get('loanEffectiveDate').setErrors(
            { defaultEffectiveDateErrorMsg: { date: defaultEffectiveDate } }
          );
          let formattedDefaultDate = defaultEffectiveDate;
          formattedDefaultDate = this.utilityService.transformDateFormat(formattedDefaultDate);
          this.form.get('loanEffectiveDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] =
            `${this.translateService.instant('defaultEffectiveDateErrorMsg', {
              date: formattedDefaultDate
            })}`;
        } else {
          let formattedDate = effectiveDateField;
          formattedDate = this.utilityService.transformDateFormat(formattedDate);
          this.form.get('loanEffectiveDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING]
            = `${this.translateService.instant('effectiveDateBusinessDayValidationErrorMsg', {
              date: formattedDate
            })}`;
          this.form.get('loanEffectiveDate').setErrors(
            { effectiveDateBusinessDayValidationErrorMsg: { date: effectiveDateField } }
          );
        }
      }
      if (!this.form.get('currency').value && !this.form.get('pricingOptions').value) {
        this.form.controls[this.loanEffectiveDate].disable();
      } else {
        this.form.controls[this.loanEffectiveDate].enable();
      }
      this.patchFieldValueAndParameters(this.form.get('loanEffectiveDate'), dateObject, {});
      if (this.form.get('loanEffectiveDate').value) {
        this.isEffectiveDateFlag = true;
      }
    }
  }

  getCurrencyDetail() {
    if (this.form.get('currency')[FccGlobalConstant.OPTIONS].length === 0) {
      this.commonService.userCurrencies(this.curRequest).subscribe(
        response => {
          this.allCurrencies = response;
          this.getCurrencyOptions(response);
        }
      );
    } else if (this.allCurrencies && this.allCurrencies.items) {
      this.getCurrencyOptions(this.allCurrencies);
    }
  }

  getCurrencyOptions(response) {
    this.currency = [];
    if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
      this.sessionValidation.IsSessionValid();
    } else {
      if (this.loanRequestTypeOptions === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
        this.currencyData.forEach(currencyValue => {
          if (currencyValue.riskType === 'SWNG') {
            response.items.forEach(userCurrencyValue => {
              if (currencyValue.id === userCurrencyValue.isoCode) {
                const ccy: { label: string, value: any } = {
                  label: userCurrencyValue.isoCode,
                  value: {
                    label: userCurrencyValue.isoCode,
                    iso: `${userCurrencyValue.isoCode} - ${this.toTitleCase(userCurrencyValue.name)}`,
                    country: userCurrencyValue.principalCountryCode,
                    currencyCode: userCurrencyValue.isoCode,
                    shortName: userCurrencyValue.isoCode,
                    name: userCurrencyValue.name
                  }
                };
                this.currency.push(ccy);
              }
            });
          }
        });
      } else {
        this.currencyData.forEach(currencyValue => {
          if (currencyValue.riskType === this.form.get('riskType').value) {
            response.items.forEach(userCurrencyValue => {
              if (currencyValue.id === userCurrencyValue.isoCode) {
                const ccy: { label: string, value: any } = {
                  label: userCurrencyValue.isoCode,
                  value: {
                    label: userCurrencyValue.isoCode,
                    iso: `${userCurrencyValue.isoCode} - ${this.toTitleCase(userCurrencyValue.name)}`,
                    country: userCurrencyValue.principalCountryCode,
                    currencyCode: userCurrencyValue.isoCode,
                    shortName: userCurrencyValue.isoCode,
                    name: userCurrencyValue.name
                  }
                };
                this.currency.push(ccy);
              }
            });
          }
        });
      }
      this.setEffectiveDateAsPerTheBusinessDayRule();
      this.populateFXDetails();
      this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
    }
    if (this.currency.length === 1) {
      this.patchFieldParameters(this.form.get('currency'), { readonly: true });
    } else {
      this.patchFieldParameters(this.form.get('currency'), { readonly: false });
    }
    if (this.form.get('currency') && (!this.form.get('currency').value || this.form.get('currency').value === '')) {
      this.patchFieldValueAndParameters(this.form.get('currency'), this.currency[0].value, {});
      this.onClickCurrency(this.currency[0]);
    }
    if (this.form.get('currency').value !== FccGlobalConstant.EMPTY_STRING) {
      const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency, 'currency', this.form);
      if (valObj) {
        this.form.get('currency').patchValue(valObj[`value`]);
      }
    }
    this.form.get('currency').updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  getPricingOptions(options) {
    this.pricingOptions = [];
    let pricingFlag = false;
    this.codeData.codeId = FccGlobalConstant.CODEDATA_PRICING_OPTION_CODES_C030;
    this.codeData.productCode = this.productCode;
    this.codeData.subProductCode = '';
    this.codeData.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
      localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
    this.commonService.getCodeDataDetails(this.codeData).subscribe(response => {
      response.body.items.forEach(responseValue => {
        options.forEach(ele => {
          if (responseValue.value === ele.id && responseValue.language === this.codeData.language) {
            Object.keys(this.pricingOptions).forEach(keys => {
              if (this.pricingOptions[keys][FccGlobalConstant.VALUE] === responseValue.value) {
                pricingFlag = true;
              }
            });
            if (!pricingFlag) {
              this.pricingOptions.push(
                {
                  label: responseValue.longDesc,
                  value: responseValue.value
                }
              );
            }
          }
        });
      });
      this.patchFieldParameters(this.form.get('pricingOptions'), { options: this.pricingOptions });
      /**
       * If there is only one pricing option associated with the selected facility set
       * this as default selected in the select box
       */
      if (this.pricingOptions.length === 1) {
        this.form.get('pricingOptions').setValue(this.pricingOptions[0].value);
        this.form.get('pricingOptions').updateValueAndValidity();
        this.updatePricingOptionDependentFields(options[0]);
      } else {
        this.form.get('pricingOptions').updateValueAndValidity();
      }
      this.form.updateValueAndValidity();
    });
  }

  onClickPricingOptions(event) {
    if (event.value !== undefined) {
      this.form.get('loanEffectiveDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
      this.form.get('repricingDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
      this.form.get('loanMaturityDate').disable();
      if (this.facilityDetails === '' || Object.keys(this.facilityDetails).length === 0) {
        if (this.facilityData !== '') {
          this.facilityDetails = this.facilityData;
          this.processPricingOption();
        } else {
          this.form.get('pricingOptions').disable();
          this.form.get('repricingFrequency').disable();
          this.lendingService.getFacilityDetails(this.facilityID, []).subscribe(resp => {
            this.facilityDetails = resp.body;
            this.form.get('pricingOptions').enable();
            this.form.get('repricingFrequency').enable();
            this.processPricingOption();
          });
        }
      } else {
        this.processPricingOption();
      }

    }
  }

  processPricingOption() {
    this.facilityDetails.pricingOptions.forEach(element => {
      if (this.form.get('pricingOptions').value === element.id) {
        this.updatePricingOptionDependentFields(element);
      }
    });
    if (this.form.get('pricingOptions').value !== '' && this.form.get('currency').value !== '') {
      this.patchFieldValueAndParameters(this.form.get('loanEffectiveDate'), this.bankServerDateObj, {});
    }
    this.setEffectiveDateAsPerTheBusinessDayRule();
  }

  /**
   * Update all the pricing option dependent fields
   */
  updatePricingOptionDependentFields(element) {
    // Pricing option based Loan Maturity Date
    if (element && this.form.get('loanMaturityDate') && !this.form.get('loanMaturityDate').value) {
      this.form.get('loanMaturityDate').disable();
    }
    if (element.maturityDateMandatory === 'Y') {
      this.form.get('loanMaturityDate').enable();
      this.setMandatoryField(this.form, 'loanMaturityDate', true);
      if (!this.form.get('loanMaturityDate').value && this.facilityMaturityDate) {
        const facilityMaturityDate = this.utilityService.transformddMMyyyytoDate(this.facilityMaturityDate.value);
        this.patchFieldValueAndParameters(this.form.get('loanMaturityDate'), facilityMaturityDate, {});
      }
    } else if (element.maturityDateMandatory === 'N') {
      this.form.get('loanMaturityDate').disable();
      this.form.get('loanMaturityDate').setValue('');
      this.setMandatoryField(this.form, 'loanMaturityDate', false);
    }
    this.validateLoanMaturityDate();

    // Pricing Option based Match Funding
    if (this.form.get('matchFunding')) {
      if (element.matchFundedIndicator && element.matchFundedIndicator === 'Y') {
        this.patchFieldValueAndParameters(this.form.get('matchFunding'), 'Y', {});
      } else {
        this.patchFieldValueAndParameters(this.form.get('matchFunding'), 'N', {});
      }
    }
    if (this.form.get('loanMaturityDate') && this.form.get('loanMaturityDate').errors) {
      this.form.get('loanMaturityDate').markAsDirty();
      this.form.get('loanMaturityDate').markAsTouched();
      this.loanMaturityDateErrors = this.form.get('loanMaturityDate').errors;
    }
    this.populateRepricingFrequency();
  }

  getRiskTypes() {
    this.riskTypes = this.stateService.getSectionData(
      FccGlobalConstant.LN_GENERAL_DETAILS).get('riskTypesList').value;
    this.patchFieldParameters(this.form.get('riskType'), { options: this.riskTypes });
    // If there is only one risk type associated set
    // this as default selected in the select box
    if (this.riskTypes && this.riskTypes.length === 1) {
      this.form.get('riskType').setValue(this.riskTypes[0].value);
      this.form.controls[this.riskType].disable();
      this.form.get('riskType').updateValueAndValidity();
      this.form.updateValueAndValidity();
    } else {
      this.form.get('riskType').updateValueAndValidity();
    }
    // });
  }

  /**
   * Populates the Repricing Frequency Drop Down based on the Pricing Options
   * if the repricing frequency size is 0 or 1
   */
  populateRepricingFrequency() {
    if (this.facilityDetails && this.facilityDetails.pricingOptions) {
      // if(this.form.get('pricingOptions').value === ''){
      //   this.patchFieldValueAndParameters(this.form.get('pricingOptions'), this.facilityDetails.pricingOptions [0].id, {});
      // }
      const selectedPricingOption = this.facilityDetails.pricingOptions.filter(
        element => element.id === this.form.get('pricingOptions').value);
      if (selectedPricingOption && selectedPricingOption[0]) {
        const element = selectedPricingOption[0];
        if (this.form.get('pricingOptions').value === element.id) {
          // if Store is empty (pricing option has no repricing frequency)
          // remove required attribute
          this.repricingFrequency = [];
          if (element.repricingFrequencies.length === 0) {
            const mandatoryFields = ['repricingFrequency', 'repricingDate'];
            this.setMandatoryFields(this.form, mandatoryFields, false);
            this.patchFieldValueAndParameters(this.form.get('repricingDate'), null, {});
            this.patchFieldValueAndParameters(this.form.get('repricingFrequency'), null, {});
            this.patchFieldParameters(this.form.get('repricingFrequency'), { options: [] });
            this.form.get('repricingDate').disable();
            this.form.get('repricingFrequency').disable();
          } else {

            if (this.repricingFreqCodeData !== undefined || this.repricingFreqCodeData !== '') {
              this.codeData.codeId = FccGlobalConstant.CODEDATA_REPRICING_FREQUENCY_CODES_C031;
              this.codeData.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
                localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
              this.commonService.getCodeDataDetails(this.codeData).subscribe(response => {
                this.repricingFreqCodeData = response.body.items;
                this.codeDataProcessor(element);
              });
            } else {
              this.codeDataProcessor(element);
            }

          }
        }
      }
    }
  }

  codeDataProcessor(element) {
    const dataFor = this.repricingFreqCodeData;
    if (element && element.repricingFrequencies && dataFor) {
      element.repricingFrequencies.forEach(ele => {
        dataFor.forEach(responseValue => {
          if (responseValue.shortDesc === ele.name && responseValue.language === this.codeData.language) {
            this.repricingFrequency.push(
              {
                label: ele.desc,
                value: ele.id
              }
            );
          }
        });
      });
    }
    this.patchFieldParameters(this.form.get('repricingFrequency'), { options: this.repricingFrequency });
    // if there is only one repricing frequency associated with
    // pricing option set this as default selected in the select box
    if (element.repricingFrequencies.length === 1) {
      this.form.get('repricingFrequency').setValue(element.repricingFrequencies[0].value);
      this.form.get('repricingFrequency').disable();
      // this.form.get('repricingFrequency').updateValueAndValidity();
      this.form.updateValueAndValidity();
    } else {
      this.form.get('repricingFrequency').enable();
      this.calculateRepricingDate();
      this.validateLoanRepricingDate();
      this.form.get('repricingFrequency').updateValueAndValidity();
      this.form.updateValueAndValidity();
    }


  }

  getColumns() {
    this.tableColumns = [];
    this.tableColumns = [
      {
        field: 'accountNumber',
        header: `${this.translateService.instant('accountNumber')}`,
        width: '30%'
      },
      {
        field: 'currency',
        header: `${this.translateService.instant('currency')}`,
        width: '30%'
      },
      {
        field: 'description',
        header: `${this.translateService.instant('description')}`,
        width: '30%'
      }];
    return this.tableColumns;
  }

  setupRemittanceInstructions() {
    const remittanceInstData = [];
    for (const remittanceInstructions of this.facilityDetails.remittanceInstructions) {
      const accountNumber = this.commonService.decodeHtml(remittanceInstructions.accountNo);
      const currency = this.commonService.decodeHtml(remittanceInstructions.currency);
      const description = this.commonService.decodeHtml(remittanceInstructions.description);
      const attachmentResultObj: {
        'accountNumber': string,
        'currency': string,
        'description': string
      } = {
        accountNumber,
        currency,
        description
      };
      remittanceInstData.push(attachmentResultObj);
    }
    const filteredRecords = remittanceInstData.filter(
      (value, index, array) =>
        array.findIndex((data) => data.description === value.description) === index);
    this.patchFieldParameters(this.form.get('remittanceInst'), { columns: this.getColumns() });
    this.patchFieldParameters(this.form.get('remittanceInst'), { data: filteredRecords });
    this.patchFieldParameters(this.form.get('remittanceInst'), { datakey: 'description' });
  }

  setupRemittanceInstructionsBasedOnCurrency() {
    const remittanceInstData = [];
    for (const remittanceInstructions of this.facilityDetails.remittanceInstructions) {
      if (this.form.get('currency').value &&
        (remittanceInstructions.currency === this.form.get('currency').value.shortName)) {
        const accountNumber = this.commonService.decodeHtml(remittanceInstructions.accountNo);
        const currency = this.commonService.decodeHtml(remittanceInstructions.currency);
        const description = this.commonService.decodeHtml(remittanceInstructions.description);

        const attachmentResultObj: {
          'accountNumber': string,
          'currency': string,
          'description': string
        } = {
          accountNumber,
          currency,
          description
        };
        remittanceInstData.push(attachmentResultObj);
      }
    }
    const filteredRecords = remittanceInstData.filter(
      (value, index, array) =>
        array.findIndex((data) => data.description === value.description) === index);
    this.patchFieldParameters(this.form.get('remittanceInst'), { columns: this.getColumns() });
    this.patchFieldParameters(this.form.get('remittanceInst'), { data: filteredRecords });
    this.patchFieldParameters(this.form.get('remittanceInst'), { datakey: 'description' });
  }

  /**
   * Method to populate the fx details.
   */
  populateFXDetails() {
    const facilityCurrency = this.form.get('borrowerLimitCurCode');
    const lnCurCode = this.form.get('currency');
    this.currencyData.forEach(curData => {
      if (lnCurCode.value && curData.id === lnCurCode.value.currencyCode) {
        this.patchFieldValueAndParameters(this.form.get('fxConversionRate'), curData.limitFXRate, {});
      }
    });
    const fxConversionRateVal = this.form.get('fxConversionRate').value;
    if (facilityCurrency && lnCurCode.value && lnCurCode.value.currencyCode !== ''
      && (lnCurCode.value.shortName !== facilityCurrency.value)) {
      const indicativeFXRateDisplay = `1 ${facilityCurrency.value} = ${fxConversionRateVal} ${lnCurCode.value.currencyCode}`;
      this.patchFieldValueAndParameters(this.form.get('indicativeFXRate'), indicativeFXRateDisplay, {});
      this.form.get('indicativeFXRate').disable();
      this.form.get('indicativeFXRate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('indicativeFXRateNote')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    } else {
      this.form.get('indicativeFXRate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('indicativeFXRateNote')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
  }

  /*validation on change of amount field*/
  onBlurAmount() {
    this.validateAmountWithrepricingDate.next();
    this.commitmentDataWithrepricingDate.next();
    this.amtVal = this.form.get('amount').value;
    const currencyVal = this.form.get('currency').value;
    if (currencyVal && currencyVal !== '') {
      if (this.amtVal === null || this.amtVal === undefined || this.amtVal === '') {
        this.form.get('amount').setErrors({ amountNotNull: true });
        this.amountErrors = this.form.get('amount').errors;
        return;
      }
      if (this.amtVal <= 0) {
        this.form.get('amount').setErrors({ amountCanNotBeZero: true });
        this.amountErrors = this.form.get('amount').errors;
        return;
      }
      this.validateLoanAmount();
      if (this.validAmt && this.iso !== '') {
        const amt = this.commonService.replaceCurrency(this.form.get('amount').value);
        const valueupdated = this.currencyConverterPipe.transform(amt, this.iso);
        this.form.get('amount').setValue(valueupdated);
        this.form.get('amount').updateValueAndValidity();
      }
      this.amountErrors = this.form.get('amount').errors;
    }
  }

  /**
   * Validates the data entered as the Loan Amount.
   */
  validateLoanAmount() {
    if (this.form.get('amount')) {
      this.validAmt = true;
      this.form.get('amount').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      const loanAmountWidget = this.form.get('amount');

      const currency = this.form.get('currency');
      const riskType = this.form.get('riskType');
      if (currency.value === null || currency.value === undefined || currency.value === '') {
        this.form.get('amount').setValidators(emptyCurrency);
      }
      if (currency && currency.value) {
        // Below variables are arrays
        let limit = 0;
        let borrowerCcylimitAmt = 0;
        let borrowerLevelLimitAmt = 0;
        let riskTypeLimitAmt = 0;
        let limitWithPendingLoans = 0;
        let swinglineLimit = 0;
        let sublimitRisklimit = 0;

        let selectedRiskType = FccGlobalConstant.RISK_TYPE_LOANS;

        let limitAmountToDisplay = 0;
        if (this.loanRequestTypeOptions === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
          selectedRiskType = FccGlobalConstant.RISK_TYPE_SWNG;
        }

        this.currencyData.forEach(item => {
          if (currency.value.shortName === item.id && item.riskType === selectedRiskType) {
            limit = Number(item.limit);
            borrowerCcylimitAmt = Number(item.borrowerCcylimit);
            borrowerLevelLimitAmt = Number(item.borrowerlimit);
            swinglineLimit = Number(item.swinglineLimit);
            limitWithPendingLoans = Number(item.limitWithPend);
            riskTypeLimitAmt = Number(item.riskTypeLimit);
            sublimitRisklimit = Number(item.sublimitRisklimit);
          }
        });
        // Set the max limit initially.
        limitAmountToDisplay = limit;
        if (currency.value.shortName && this.amtVal) {
          const amt = this.commonService.replaceCurrency(this.amtVal);
          const valueupdated = this.customCommasInCurrenciesPipe.transform(amt, currency.value.shortName);
          this.form.get('amount').setValue(valueupdated);
        }

        if (loanAmountWidget && loanAmountWidget.value) {
          const amountValue = this.commonService.replaceCurrency(loanAmountWidget.value);
          if (amountValue > borrowerLevelLimitAmt) {
            // validate borrower level limit
            if (borrowerLevelLimitAmt < limitAmountToDisplay) {
              limitAmountToDisplay = borrowerLevelLimitAmt;

              let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
              limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                limitAmountToDisplayUpdated.toString(), currency.value.currencyCode);

              if (borrowerLevelLimitAmt <= 0) {
                this.form.get('amount').setErrors({ noAmountForBorrowerLimitError: true });
                this.validAmt = false;
              } else {
                this.form.get('amount').setErrors(
                  { loanAmountTooBigThanBorrowerLimitAmtError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                );
                this.validAmt = false;
              }
            }
          }
          if (riskType && riskType.value) {
            if (amountValue > riskTypeLimitAmt) {
              // validate risk type limit
              if (riskTypeLimitAmt < limitAmountToDisplay) {
                limitAmountToDisplay = riskTypeLimitAmt;
                let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
                limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                  limitAmountToDisplayUpdated.toString(), currency.value.shortName);
                if (riskTypeLimitAmt <= 0) {
                  if (this.loanRequestTypeOptions === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
                    this.form.get('amount').setErrors({ noAmountForSwingRiskLimitError: true });
                  } else {
                    this.form.get('amount').setErrors({ noAmountForRiskLimitError: true });
                  }
                  this.validAmt = false;
                } else {
                  this.form.get('amount').setErrors(
                    {
                      loanAmountTooBigThanBorrowerRiskTypeLimitAmtError: {
                        cur: currency.value.shortName,
                        amt: limitAmountToDisplayUpdated
                      }
                    }
                  );
                  this.validAmt = false;
                }
              }
            }
          }
          if (swinglineLimit && (amountValue > swinglineLimit)) {
            // validate Swingline global limit
            if (swinglineLimit < limitAmountToDisplay) {
              limitAmountToDisplay = swinglineLimit;
              let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
              limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                limitAmountToDisplayUpdated.toString(), currency.value.shortName);
              if (swinglineLimit <= 0) {
                if (this.loanRequestTypeOptions === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
                  this.form.get('amount').setErrors({ noAmountForSwinglineLimitError: true });
                } else {
                  this.form.get('amount').setErrors({ noAmountForLoanSublimitLimitError: true });
                }
                this.validAmt = false;
              } else {
                if (this.loanRequestTypeOptions === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
                  this.form.get('amount').setErrors(
                    { loanAmountTooBigThanSwinglineLimitAmtError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                  );
                } else {
                  this.form.get('amount').setErrors(
                    { loanAmountTooBigLoanSublimitAmtError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                  );
                }
                this.validAmt = false;
              }
            }
          }
          if (this.loanRequestTypeOptions === FccGlobalConstant.LN_REQUEST_TYPE_SWNG && sublimitRisklimit &&
            (amountValue > sublimitRisklimit)) {
            // validate Swingline risk limit
            if (sublimitRisklimit < limitAmountToDisplay) {
              limitAmountToDisplay = sublimitRisklimit;
              let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
              limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                limitAmountToDisplayUpdated.toString(), currency.value.shortName);
              if (swinglineLimit <= 0) {
                this.form.get('amount').setErrors({ noAmountForSublimitRiskLimitError: true });
                this.validAmt = false;
              } else {
                this.form.get('amount').setErrors(
                  { loanAmountTooBigThanSublimitRiskAmtError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                );
                this.validAmt = false;
              }
            }
          }

          if (borrowerCcylimitAmt && (amountValue > borrowerCcylimitAmt)) {
            // validate currency limit
            if (borrowerCcylimitAmt < limitAmountToDisplay) {
              limitAmountToDisplay = borrowerCcylimitAmt;
              let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
              limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                limitAmountToDisplayUpdated.toString(), currency.value.shortName);
              if (borrowerCcylimitAmt <= 0) {
                this.form.get('amount').setErrors({ noAmountForCurrencyLimitError: { cur: currency.value.shortName } });
                this.validAmt = false;
              }
              else {
                this.form.get('amount').setErrors(
                  { loanAmountTooBigThanBorrowerCcyLimitAmtError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                );
                this.validAmt = false;
              }
            }
          }
          if (limit && (amountValue > limit)) {
            // validate global limit
            if (limit <= limitAmountToDisplay) {
              limitAmountToDisplay = limit;
              let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
              limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                limitAmountToDisplayUpdated.toString(), currency.value.shortName);
              if (limitAmountToDisplay === 0) {
                this.form.get('amount').setErrors({ facilityFullyDrawnError: true });
                this.validAmt = false;
              } else {
                if (this.loanRequestTypeOptions === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
                  this.form.get('amount').setErrors(
                    { swinglineLoanAmountTooBigError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                  );
                } else {
                  this.form.get('amount').setErrors(
                    { loanAmountTooBigError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                  );
                }
                this.validAmt = false;
              }
            }
          }

          if (limitWithPendingLoans && (amountValue > limitWithPendingLoans)) {
            // validate facility available limit with pending loans.
            if (limitWithPendingLoans <= limitAmountToDisplay) {
              limitAmountToDisplay = limitWithPendingLoans;
              let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
              limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                limitAmountToDisplayUpdated.toString(), currency.value.shortName);
              if (limitAmountToDisplay <= 0) {
                this.form.get('amount').setErrors({ facilityFullyDrawnErrorWithPend: true });
                this.validAmt = false;
              } else {
                this.form.get('amount').setErrors(
                  { loanAmountTooBigWithPendError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                );
                this.validAmt = false;
              }
            }
          }
        }
        if (this.loanRequestTypeOptions !== FccGlobalConstant.LN_REQUEST_TYPE_SWNG
          && this.form.get('repricingdateValidation').value === 'true') {
          this.isLoanAmountGreaterThanCommitmentAmount();
          this.commitmentDataWithrepricingDate.subscribe(commitmentData => {
            if (commitmentData && commitmentData.get('limitViolated')) {
              const commitmentAmount = commitmentData.get('limitAmount');
              if (parseFloat(commitmentAmount) <= limitAmountToDisplay) {
                limitAmountToDisplay = parseFloat(commitmentAmount);
                let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
                limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                  limitAmountToDisplayUpdated.toString(), currency.value.shortName);
                if (limitAmountToDisplay <= 0) {
                  this.form.get('amount').setErrors({ commitmentScheduleFullyDrawnError: true });
                  this.validAmt = false;
                } else {
                  this.form.get('amount').setErrors(
                    { commitmentScheduleAmountErrorForDrawdown: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                  );
                  this.validAmt = false;
                }
              }
            }
          });
        }
      }
      return true;
    }
    return true;
  }

  isLoanAmountGreaterThanCommitmentAmount() {
    const repricingDate = this.form.get('repricingDate').value;
    const loanAmount = this.form.get('amount').value;
    const returnData = new Map();
    returnData.set('limitViolated', false);
    if (repricingDate !== '' && loanAmount) {
      this.getCommitmentScheduleAmount();
      this.validateAmountWithrepricingDate.subscribe(commitmentData => {
        if (commitmentData) {
          const commitmentAmount = commitmentData.commitmentSchAmount;
          const commitmentScheduled = commitmentData.commitmentScheduled;

          if (commitmentScheduled && commitmentScheduled === 'true'
            && (parseFloat(this.form.get('amount').value.replace(/,/g, '')) > parseFloat(commitmentAmount))) {
            returnData.set('limitViolated', true);
            returnData.set('limitAmount', commitmentAmount);
            this.commitmentDataWithrepricingDate.next(returnData);
          } else {
            this.commitmentDataWithrepricingDate.next();
          }
        }
      });
    }
  }

  getCommitmentScheduleAmount() {
    let repricingDateValue = this.form.get('repricingDate').value;
    if (this.dir === 'rtl') {
      repricingDateValue = this.datePipe.transform(repricingDateValue, this.utilityService.getRawDateFormat(), '', 'ar');
    } else {
      repricingDateValue = this.datePipe.transform(repricingDateValue, this.utilityService.getRawDateFormat());
    }
    if (this.form.get('currency') && this.form.get('currency').value && this.facilityID
      && repricingDateValue && this.form.get('amount') && this.form.get('amount').value && this.facilityDetails) {
      const requestParams = {
        facilityId: this.facilityID,
        rolloverDate: repricingDateValue,
        facilityCurrency: this.facilityDetails.mainCurrency,
        loanCurrency: this.form.get('currency').value.shortName,
        loanAmount: parseFloat(this.form.get('amount').value.replace(/,/g, ''))
      };
      this.commonService.getCommitmentScheduledValues(requestParams).subscribe((res) => {
        if (res) {
          this.validateAmountWithrepricingDate.next(res.body);
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

  /*validation on change of currency field*/
  onKeyupCurrency(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty) {
      this.onClickCurrency(this.form.get('currency'));
    }
  }

  /*validation on change of currency field*/
  onClickCurrency(event) {
    if (event.value !== undefined) {
      this.enteredCurMethod = true;
      this.iso = event.value.shortName;
      this.isoamt = this.iso;
      const amt = this.form.get('amount');
      this.val = amt.value;
      this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD,
        Validators.compose([Validators.required, Validators.pattern(this.commonService.getRegexBasedOnlanguage())]), 0);
      amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      this.setMandatoryField(this.form, FccGlobalConstant.AMOUNT_FIELD, true);
      this.flagDecimalPlaces = 0;
      if (this.val !== '' && this.val !== null) {
        if (this.val <= 0) {
          this.form.get('amount').setErrors({ amountCanNotBeZero: true });
          return;
        } else {
          const amtValue = this.commonService.replaceCurrency(this.val);
          const valueupdated = this.customCommasInCurrenciesPipe.transform(amtValue, this.iso);
          this.form.get('amount').setValue(valueupdated);
        }
      } else {
        this.form.get('amount').setErrors({ required: true });
      }
      if (this.form.get('pricingOptions').value !== '' && this.form.get('currency').value !== '') {
        this.patchFieldValueAndParameters(this.form.get('loanEffectiveDate'), this.bankServerDateObj, {});
      }
      this.onBlurAmount();
      this.setEffectiveDateAsPerTheBusinessDayRule();
      this.populateFXDetails();
      if (this.remittanceFlag === 'mandatory' || this.remittanceFlag === 'true') {
        this.form.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.setupRemittanceInstructionsBasedOnCurrency();
      } else {
        this.form.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('remittanceInst').setValidators([]);
        this.form.get('remittanceInst').setErrors(null);
      }
    }
    if (this.form.get('currency') && this.form.get('currency').value === '') {
      this.form.get('loanEffectiveDate').disable();
      this.setMandatoryField(this.form, 'loanEffectiveDate', false);
    }
    this.patchFieldValueAndParameters(this.form.get('balanceCurrency'), this.form.get('currency').value, {});
    this.form.updateValueAndValidity();
  }

  /*
   * This method sets the value of effective date in hidden field on change of currency.
   */
  setDefaultEffectiveDate() {
    const effectiveDateField = this.form.get('loanEffectiveDate');
    if (effectiveDateField && effectiveDateField.value !== '') {
      this.patchFieldValueAndParameters(this.form.get('defaultLoanEffectiveDate'), effectiveDateField.value, {});
    }
  }

  onClickLoanEffectiveDate(event) {
    if (event.value) {
      this.patchFieldValueAndParameters(this.form.get('loanEffectiveDate'), event.value, {});
      this.form.get('loanEffectiveDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
      this.form.get('repricingDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
      if (this.isEffectiveDateFlag && this.checkPastDateOfCalenderForEffectiveDate()) {
        this.setEffectiveDateAsPerTheBusinessDayRule();
      } else {
        this.isEffectiveDateFlag = true;
        this.calculateRepricingDate();
      }
      this.validateLoanEffectiveDate();
      this.validateLoanMaturityDate();
      this.validateLoanRepricingDate();
    }
  }

  /**
   * Validates the data entered as the Effective Date.
   */
  validateLoanEffectiveDate() {
    if (!this.form.get('loanEffectiveDate').value) {
      return true;
    }

    // Test that the loan effective date is greater than or equal to the
    // current date
    const currentDate = new Date();
    // set the hours to 0 to compare the date values
    currentDate.setHours(0, 0, 0, 0);
    this.bankServerDateObj.setHours(0, 0, 0, 0);

    // compare the values of the current date and transfer date
    const isValid = this.utilityService.compare(this.form.get('loanEffectiveDate').value, this.bankServerDateObj) < 0 ? false : true;
    if (!isValid) {
      this.form.get('loanEffectiveDate').setErrors(
        {
          effectiveDateGreaterThanSystemDate: {
            date: this.utilityService.transformDateFormat(
              this.form.get('loanEffectiveDate').value)
          }
        }
      );
    }

    // Test that the loan effective date is greater than or equal to the
    // facility effective date
    const facilityEffectiveDate = this.utilityService.transformddMMyyyytoDate(this.facilityEffectiveDate.value);
    if (!this.utilityService.compareDateFields(this.form.get('loanEffectiveDate').value, facilityEffectiveDate)) {
      this.form.get('loanEffectiveDate').setErrors(
        {
          loanEffDateGreaterThanFacEffDateError: {
            date: this.utilityService.transformDateFormat(
              this.form.get('loanEffectiveDate').value),
            faclityDate: this.facilityEffectiveDate.value
          }
        }
      );
    }

    // Test that the loan effective date is less than or equal to the
    // facility expiry date
    const facExpDate = this.utilityService.transformddMMyyyytoDate(this.facilityExpiryDate.value);
    if (!this.utilityService.compareDateFields(facExpDate, this.form.get('loanEffectiveDate').value)) {
      this.form.get('loanEffectiveDate').setErrors(
        {
          loanEffDateLessThanFacExpDateError: {
            date: this.utilityService.transformDateFormat(
              this.form.get('loanEffectiveDate').value),
            expiryDate: this.facilityExpiryDate.value
          }
        }
      );
    }

    // Test that the loan effective date is less than or equal to the
    // facility maturity date
    const facMaturityDate = this.utilityService.transformddMMyyyytoDate(this.facilityMaturityDate.value);
    if (!this.utilityService.compareDateFields(facMaturityDate, this.form.get('loanEffectiveDate').value)) {
      this.form.get('loanEffectiveDate').setErrors(
        {
          loanEffDateLessThanFacMatDateError: {
            date: this.utilityService.transformDateFormat(
              this.form.get('loanEffectiveDate').value),
            maturityDate: this.facilityMaturityDate.value
          }
        }
      );
    }

    // Test that the loan effective date is less than loan maturity date
    const loanMaturityDate = this.form.get('loanMaturityDate');
    if (this.form.get('loanEffectiveDate') && loanMaturityDate
      && this.form.get('loanEffectiveDate').value && loanMaturityDate.value) {
      if (!this.utilityService.compareDateFields(loanMaturityDate.value, this.form.get('loanEffectiveDate').value)) {
        this.form.get('loanEffectiveDate').setErrors(
          {
            loanEffDateLessThanLoanMatDateError: {
              date: this.utilityService.transformDateFormat(
                this.form.get('loanEffectiveDate').value),
              lnMaturityDate: this.utilityService.transformDateFormat(
                loanMaturityDate.value)
            }
          }
        );
      }
    }
    this.pastDateValidationForEffectiveDate();
    if (this.form.get('loanEffectiveDate') && this.form.get('loanEffectiveDate').errors) {
      this.form.get('loanEffectiveDate').markAsDirty();
      this.form.get('loanEffectiveDate').markAsTouched();
      this.loanEffectiveDateErrors = this.form.get('loanEffectiveDate').errors;
    }
  }

  /*
   * This method validates the past dates for effective date field.
   */
  pastDateValidationForEffectiveDate() {
    const currentServerDate = new Date();
    currentServerDate.setHours(0, 0, 0, 0);
    const selectedEffectiveDate = this.form.get('loanEffectiveDate').value;

    if (!this.form.get('effectiveDateHiddenField').value) {
      this.patchFieldValueAndParameters(this.form.get('effectiveDateHiddenField'), this.bankServerDateObj, {});
    }

    this.repricingDatesValidationInprocess = false;

    if (!this.repricingDatesValidationInprocess) {
      // checks the calculated effecitbe dtae is smaller or equals to entered date.
      if (selectedEffectiveDate < this.form.get('effectiveDateHiddenField').value) {
        this.repricingDatesValidationInprocess = true;
        return false;
      }
    }
    this.repricingDatesValidationInprocess = false;
    return true;
  }

  /**
   * Validates the data entered as the Maturity Date.
   */
  validateLoanMaturityDate() {
    if (!this.form.get('loanMaturityDate').value) {
      return true;
    }
    this.form.get('loanMaturityDate').setErrors(null);

    const thisObject = this.form.get('loanMaturityDate');

    // Test that the loan maturity date is less than or equal to the
    // facility maturity date
    const facMatDate = this.utilityService.transformddMMyyyytoDate(this.facilityMaturityDate.value);
    if (!this.utilityService.compareDateFields(facMatDate, thisObject.value)) {
      this.form.get('loanMaturityDate').setErrors(
        {
          loanMatDateGreaterThanFacMatDateError: {
            date: this.utilityService.transformDateFormat(
              thisObject.value),
            facMatDate: this.facilityMaturityDate.value
          }
        }
      );
    }

    // Test that the loan maturity date is greater than or equal to the loan
    // effective date
    const loanEffDate = this.form.get('loanEffectiveDate');
    if (thisObject && loanEffDate && thisObject.value && loanEffDate.value) {
      if (this.utilityService.compare(thisObject.value, loanEffDate.value) <= 0) {
        this.form.get('loanMaturityDate').setErrors(
          {
            loanMatDateLessThanLoanEffDateError: {
              date: this.utilityService.transformDateFormat(
                thisObject.value),
              loanEffDate: this.utilityService.transformDateFormat(
                loanEffDate.value)
            }
          }
        );
      }
    }
    // Test that the loan maturity date is greater than  or equal to the repricing date
    const repricingDate = this.form.get('repricingDate');
    if (thisObject && repricingDate && thisObject.value && repricingDate.value) {
      if (this.utilityService.compareDateFields(repricingDate.value, thisObject.value)) {
        this.form.get('loanMaturityDate').setErrors(
          {
            loanMatDateGreaterThanLoanRepDateError: {
              date: this.utilityService.transformDateFormat(
                thisObject.value),
              repricingDate: this.utilityService.transformDateFormat(
                repricingDate.value)
            }
          }
        );
      }
    }
    if (this.form.get('loanMaturityDate') && this.form.get('loanMaturityDate').errors) {
      this.form.get('loanMaturityDate').markAsDirty();
      this.form.get('loanMaturityDate').markAsTouched();
      this.loanMaturityDateErrors = this.form.get('loanMaturityDate').errors;
    }
  }

  onClickLoanMaturityDate(event) {
    if (event.value) {
      this.patchFieldValueAndParameters(this.form.get('loanMaturityDate'), event.value, {});
      this.calculateRepricingDate();
      this.validateLoanMaturityDate();
      this.validateLoanRepricingDate();
    }
  }

  onClickRiskType(event) {
    if (event && event.value) {
      this.selectedRiskType = this.facilityDetailsService.getRiskTypes().filter(risk => risk.id === event.value)[0];
      this.patchFieldValueAndParameters(this.form.get('riskType'), this.selectedRiskType.id, {});
      this.form.get('riskType').updateValueAndValidity();
      this.setFieldsInLoan();
    }
  }

  onClickRepricingFrequency(event) {
    if (event.value) {
      this.form.get('repricingDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
      this.calculateRepricingDate();
      this.onClickRepricingDate();
      this.validateLoanRepricingDate();
      this.onBlurAmount();
    }
  }

  onClickRepricingDate() {
    if (this.form.get('repricingDate') && this.form.get('repricingDate').value) {
      if (this.isRepricingDateFlag && this.checkPastDateOfCalenderForRepricingDate()) {
        this.setRepricingDateAsPerTheBusinessDayRule();
      } else {
        this.isRepricingDateFlag = true;
      }
      if (this.form.get('repricingdateValidation').value === 'true') {
        if (this.validAmt) {
          this.form.get('amount').setErrors(null);
        }
      }
    }
  }

  /**
   * Validate the data entered as the Repricing Date.
   */
  validateLoanRepricingDate() {
    if (!this.form.get('repricingDate').value) {
      return true;
    }
    const repricingDate = this.form.get('repricingDate');
    if (repricingDate && repricingDate.value) {
      // Test that the loan Repricing date is greater than or equal to the loan effective date
      const loanEffDate = this.form.get('loanEffectiveDate');
      if (loanEffDate && loanEffDate.value !== '' && this.utilityService.compareDateFields(loanEffDate.value, repricingDate.value)) {
        this.form.get('repricingDate').setErrors(
          {
            loanRepricingDateGreaterThanLoanEffDateError: {
              date: this.utilityService.transformDateFormat(
                repricingDate.value),
              loanEffDate: this.utilityService.transformDateFormat(
                loanEffDate.value)
            }
          }
        );
      }

      // Test that the loan Repricing date is less than or equal to the loan maturity date
      const lnMatDate = this.form.get('loanMaturityDate');
      if (lnMatDate && lnMatDate.value !== '' && this.utilityService.compareDateFields(repricingDate.value, lnMatDate.value)) {
        this.form.get('repricingDate').setErrors(
          {
            loanRepricingDateLessThanLoanMatDateError: {
              date: this.utilityService.transformDateFormat(
                repricingDate.value),
              lnMatDate: this.utilityService.transformDateFormat(
                lnMatDate.value)
            }
          }
        );
      }

      const facMatDate = this.utilityService.transformddMMyyyytoDate(this.facilityMaturityDate.value);
      if (this.utilityService.compareDateFields(repricingDate.value, facMatDate)) {
        this.form.get('repricingDate').setErrors(
          {
            loanRepricingDateLessThanFacMatDateError: {
              date: this.utilityService.transformDateFormat(
                repricingDate.value),
              facMatDate: this.facilityMaturityDate.value
            }
          }
        );
      }
      if (this.form.get('repricingDate') && this.form.get('repricingDate').value && this.form.get('repricingDate').errors) {
        this.form.get('repricingDate').markAsDirty();
        this.form.get('repricingDate').markAsTouched();
      }
    }
  }

  /*
   * This method validates the past dates for effective date field wr.t applcation date.
   */
  checkPastDateOfCalenderForEffectiveDate() {
    const selectedEffectiveDate = this.form.get('loanEffectiveDate').value;
    const appDateField = this.form.get('loanApplDate').value ? this.form.get('loanApplDate').value : this.applDate;

    if (selectedEffectiveDate >= this.utilityService.transformddMMyyyytoDate(appDateField)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Calculate the Repricing Date
   */
  calculateRepricingDate() {
    const effDate = this.form.get('loanEffectiveDate');
    if (this.form.get('loanEffectiveDate').value) {
      if (this.form.get('repricingFrequency')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS].length !== 0) {
        this.form.get('repricingFrequency').enable();
        this.setMandatoryField(this.form, 'repricingFrequency', true);
        if (this.form.get('repricingFrequency').value) {
          this.form.get('repricingDate').disable();
          this.setMandatoryField(this.form, 'repricingDate', true);
          this.patchFieldValueAndParameters(this.form.get('repricingDate'), this.addDates(effDate), {});
          this.setRepricingDateAsPerTheBusinessDayRule();
          this.form.get('repricingDate').updateValueAndValidity();
        }
      }
    }
  }

  /**
   * Date addition utility
   */
  addDates(date) {
    if (date.value && this.form.get('repricingFrequency').value) {
      const frequency = this.form.get('repricingFrequency').value;
      let frequencyNo;
      let frequencyMultiplier;
      let frequencyMultiplierFullForm;

      if (this.form.get('repricingFrequency').value.length > 0) {
        frequencyNo = frequency.substring(0, frequency.length - 1);
        frequencyMultiplier = frequency.substring(frequency.length - 1, frequency.length);
      }

      if (frequencyMultiplier === 'W') {
        frequencyMultiplierFullForm = 'week';
      } else if (frequencyMultiplier === 'M') {
        frequencyMultiplierFullForm = 'month';
      } else if (frequencyMultiplier === 'Y') {
        frequencyMultiplierFullForm = 'year';
      } else if (frequencyMultiplier === 'D') {
        frequencyMultiplierFullForm = 'day';
      }
      return this.utilityService.addToDate(date.value, frequencyMultiplierFullForm, parseInt(frequencyNo, 10));
    }
  }

  /**
   * this method makes the ajax call to get the business date from loan iq
   */
  setRepricingDateAsPerTheBusinessDayRule() {
    let convertedRepricingDate = this.form.get('repricingDate').value;
    if (convertedRepricingDate !== '' && convertedRepricingDate !== null && convertedRepricingDate !== undefined) {
      convertedRepricingDate = this.utilityService.transformDateFormat(
        convertedRepricingDate);
    }
    if (this.form.get('pricingOptions').value !== '' && convertedRepricingDate !== '' && this.form.get('currency').value &&
      this.form.get('currency').value !== '') {
      this.dateRequestParams = {};
      this.dateRequestParams.dateToValidate = convertedRepricingDate;
      this.dateRequestParams.isRepricingDate = 'Y';
      this.dateRequestParams.boFacilityId = this.facilityID;
      this.dateRequestParams.currency = this.form.get('currency').value.shortName;
      this.dateRequestParams.pricingOptionName = this.form.get('pricingOptions').value;
      this.dateRequestParams.dealId = this.stateService.getSectionData(
        FccGlobalConstant.LN_GENERAL_DETAILS).get('dealID').value;
      this.dateRequestParams.operation = '';
      this.dateRequestParams.borrowerId = this.lnRefID;
      this.commonService.getValidateBusinessDate(this.dateRequestParams).subscribe((res) => {
        if (res && res.adjustedLocalizedDate) {
          let formattedDate = this.form.get('repricingDate').value;
          formattedDate = this.utilityService.transformDateFormat(formattedDate);
          if (formattedDate.toString() === res.adjustedLocalizedDate.toString()) {
            this.isRepricingDateFlag = true;
          } else if (formattedDate) {
            this.isRepricingDateFlag = false;
            this.form.get('repricingDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] =
              `${this.translateService.instant('repricingDateBusinessDayValidationErrorMsg', {
                date: convertedRepricingDate
              })}`;
          }
          this.populateBusinessDateForRepricing(res);
        }
      });
    }
  }

  /**
   * This method render the loan iq business date for repricing
   */
  populateBusinessDateForRepricing(response) {
    if (response) {
      const repricingDate = this.utilityService.transformddMMyyyytoDate(response.adjustedLocalizedDate);
      this.patchFieldValueAndParameters(this.form.get('repricingDate'), repricingDate, {});
    }
  }

  checkPastDateOfCalenderForRepricingDate() {
    const selectedDate = this.form.get('repricingDate').value;
    const selectedEffectiveDate = this.form.get('loanEffectiveDate').value;
    if (selectedDate > selectedEffectiveDate) {
      return true;
    } else {
      return false;
    }
  }

  checAmountAgainstCurreny() {
    if (this.form.get('currency').value !== null && this.form.get('currency').value !== undefined
      && this.form.get('currency').value !== '') {
      if (this.form.get('amount').value <= 0) {
        this.form.get('amount').setValue('');
        return;
      }
    }
  }

  holdErrors() {
    if (this.form.get('repricingDate') && this.form.get('repricingDate').value && this.form.get('repricingDate').errors) {
      this.form.get('repricingDate').markAsDirty();
      this.form.get('repricingDate').markAsTouched();
    }
    this.form.get('loanEffectiveDate').setErrors(this.loanEffectiveDateErrors);
    this.form.get('loanMaturityDate').setErrors(this.loanMaturityDateErrors);
    const curr = this.form.get('currency') !== null ? this.form.get('currency').value : null;
    if (this.commonService.isNonEmptyValue(curr) && curr
      && this.facilityDetails.remittanceInstructions
      && this.facilityDetails.remittanceInstructions.length > 0) {
      this.form.get('amount').setValidators([Validators.required]);
      this.form.get('amount').setErrors(this.amountErrors);
      this.form.get('amount').markAsDirty();
      this.form.get('amount').markAsTouched();
      const currencyselected = this.facilityDetails.remittanceInstructions.filter(remittance => remittance.currency === curr.shortName);
      if ((this.remittanceFlag === 'mandatory') &&
        (this.form.get('remInstDescription').value === null ||
          this.form.get('remInstDescription').value === undefined ||
          this.form.get('remInstDescription').value === '')
        && currencyselected && currencyselected[0]) {
        this.form.get('remittanceInst').setValidators([Validators.required]);
        this.form.get('remittanceInst').setErrors({ selectRemittanceInstructionError: true });
        this.form.get('remittanceInst').markAsDirty();
      } else {
        this.form.get('remittanceInst').setValidators([]);
        this.form.get('remittanceInst').setErrors(null);
      }
      this.form.get('remittanceInst').updateValueAndValidity();
    }
    this.validateDrawdownLoanLimitAmt();
  }

  /**
   * This method check and validate the different type of limits
   * "/screen/AjaxScreen/action/ValidateDrawdownLoanLimitAmount"
   */
  validateDrawdownLoanLimitAmt() {
    return true;
  }

  onPanelTableRowSelect(event: any) {
    if (event && event.data) {
      this.patchFieldValueAndParameters(this.form.get('remInstDescription'), event.data.description, {});
      this.patchFieldValueAndParameters(this.form.get('remInstAccountNo'), event.data.accountNumber, {});
      this.facilityDetails.remittanceInstructions.forEach(element => {
        if (element.description === event.data.description && element.accountNo === event.data.accountNumber) {
          this.patchFieldValueAndParameters(this.form.get('remInstLocationCode'), element.locationCode, {});
          this.patchFieldValueAndParameters(this.form.get('remInstServicingGroupAlias'), element.servicingGroupAlias, {});
        }
      });
      this.form.get('remittanceInst').setValidators([]);
      this.form.get('remittanceInst').setErrors(null);
      this.form.get('remittanceInst').updateValueAndValidity();
    }
  }

  onPanelTableRowUnSelect(event: any) {
    if (event && event.data) {
      this.patchFieldValueAndParameters(this.form.get('remInstDescription'), '', {});
      this.patchFieldValueAndParameters(this.form.get('remInstLocationCode'), '', {});
      this.patchFieldValueAndParameters(this.form.get('remInstServicingGroupAlias'), '', {});
      this.patchFieldValueAndParameters(this.form.get('remInstAccountNo'), '', {});
      if ((this.remittanceFlag === 'mandatory')
        && this.form.get('remInstDescription') && !this.form.get('remInstDescription').value) {
        this.form.get('remittanceInst').setValidators([Validators.required]);
        this.form.get('remittanceInst').setErrors({ selectRemittanceInstructionError: true });
        this.form.get('remittanceInst').markAsDirty();
      } else {
        this.form.get('remittanceInst').setValidators([]);
        this.form.get('remittanceInst').setErrors(null);
      }
      this.form.get('remittanceInst').updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.holdErrors();
    this.form.get('repricingDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
    this.form.get('loanEffectiveDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
    if (this.form.get('repricingDate') && this.form.get('repricingDate').value && this.form.get('repricingDate').errors) {
      this.form.setErrors({ invalid: true });
    }
    if (!this.form.get('currency').value && !this.form.get('pricingOptions').value) {
      this.form.get('loanEffectiveDate').disable();
    } else {
      this.form.get('loanEffectiveDate').enable();
    }
    this.stateService.setStateSection(FccGlobalConstant.LN_REMITTANCE_INSTRUCTIONS, this.form);
  }

}
