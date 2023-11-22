import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CodeData } from './../../../../../common/model/codeData';

import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { FilelistService } from '../../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../trade/lc/initiation/services/utility.service';
import { LendingCommonDataService } from '../../../common/service/lending-common-data-service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConfiguration } from './../../../../../common/core/fcc-global-configuration';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CorporateDetails } from './../../../../../common/model/corporateDetails';
import { CommonService } from './../../../../../common/services/common.service';
import { DropDownAPIService } from './../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { MultiBankService } from './../../../../../common/services/multi-bank.service';
import { CorporateCommonService } from './../../../../../corporate/common/services/common.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LcConstant } from './../../../../trade/lc/common/model/constant';
import { ProductStateService } from './../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from './../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { LnProductComponent } from './../ln-product/ln-product.component';
import { FacilityDetailsService } from './../services/facility-details.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ln-general-details',
  templateUrl: './ln-general-details.component.html',
  styleUrls: ['./ln-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LnGeneralDetailsComponent }]
})
export class LnGeneralDetailsComponent extends LnProductComponent implements OnInit {

  contextPath: any;
  option: any;
  mode: any;
  productCode: any;
  form: FCCFormGroup;
  constant = new LcConstant();
  corporateDetails: CorporateDetails;
  module = `${this.translateService.instant('lnGeneralDetails')}`;
  entities = [];
  borrowerReferenceList = [];
  borrowerReferenceInternalList = [];
  corporateBanks = [];
  corporateReferences = [];
  corporateReferenceValueList = [];
  corporateReferenceValues = [];
  appBenNameRegex;
  appBenAddressRegex;
  appBenNameLength;
  appBenFullAddrLength: any;
  facilityID: any;
  facilityDetails: any = {};
  borrowerIds: any = '';
  referenceId: any;
  swinglineAllowed: any;
  drawdownAllowed: any;
  codeData = new CodeData();
  configuredKeysList = 'VALIDATE_AMOUNT_WITH_REPRICING_DATE,REMITTANCE_INSTRUCTION_SECTION_REQUIRED';
  keysNotFoundList: any[] = [];
  selectButtonArr: any[] = [];
  subscriptionArray: Subscription[] = [];
  riskTypes: any[];
  showSpinner: boolean;
  riskTypeCodeData: any[];

  constructor(protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService, protected translateService: TranslateService,
              protected commonService: CommonService, public fccGlobalConstantService: FccGlobalConstantService,
              protected datePipe: DatePipe, protected multiBankService: MultiBankService,
              protected dropdownAPIService: DropDownAPIService, protected corporateCommonService: CorporateCommonService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected lendingService: LendingCommonDataService,
              protected fccGlobalConfiguration: FccGlobalConfiguration, protected facilityDetailsService: FacilityDetailsService) {
                super(eventEmitterService, stateService, commonService, translateService, confirmationService,
                  customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                  dialogRef, currencyConverterPipe);
              }

  ngOnInit(): void {
    super.ngOnInit();
    this.showSpinner = true;
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.facilityID = this.commonService.getQueryParametersFromKey(FccGlobalConstant.FACILITY_ID);
    this.referenceId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.swinglineAllowed = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SWINGLINE_ALLOWED_FLAG);
    this.drawdownAllowed = this.commonService.getQueryParametersFromKey(FccGlobalConstant.DRAWDOWN_ALLOWED_FLAG);

    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    this.initializeFormGroup();
    this.getRiskTypeCodeData();
    this.subscriptionArray.push(this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.appBenNameRegex = response.BeneficiaryNameRegex;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.BeneficiaryNameLength;
        this.appBenFullAddrLength = response.nonSwiftAddrLength;
        this.form.addFCCValidators('loanDetailsName', Validators.pattern(this.appBenAddressRegex), 0 );
        this.form.addFCCValidators('loanDetailsName', Validators.maxLength(this.appBenNameLength), 0 );
        this.form.addFCCValidators('loanDetailsFirstAddress', Validators.pattern(this.appBenAddressRegex), 0 );
        this.form.addFCCValidators('loanDetailsFirstAddress', Validators.maxLength(this.appBenNameLength), 0 );
        this.form.addFCCValidators('loanDetailsSecondAddress', Validators.pattern(this.appBenAddressRegex), 0 );
        this.form.addFCCValidators('loanDetailsSecondAddress', Validators.maxLength(this.appBenNameLength), 0 );
        this.form.addFCCValidators('loanDetailsThirdAddress', Validators.pattern(this.appBenAddressRegex), 0 );
        this.form.addFCCValidators('loanDetailsThirdAddress', Validators.maxLength(this.appBenNameLength), 0 );
        this.form.addFCCValidators('loanDetailsFullAddress', Validators.pattern(this.appBenAddressRegex), 0 );
        this.form.addFCCValidators('loanDetailsFullAddress', Validators.maxLength(this.appBenFullAddrLength), 0 );
      }
    }));
    this.setBalanceOutstandingAmt();
  }
  /**
   * Initialise the form from state servic
   */
  initializeFormGroup() {
    const corporateBanksInit = [];
    const entityList = [];
    const sectionName = FccGlobalConstant.LN_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    if (this.mode !== FccGlobalConstant.VIEW_MODE) {
      this.form.get(FccGlobalConstant.ROLLED_OVER_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.ROLLED_OVER_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.updateUserEntities();
    } else {
      this.handleEntityDetailsFields();
      this.setSubTnxTypeCode();
      this.facilityID = this.facilityID !== undefined ? this.facilityID : this.form.get('facilityID').value;
      if (this.facilityID) {
        this.subscriptionArray.push(this.multiBankService.getCustomerBankDetails('LN', '').subscribe(
          res => {
            this.multiBankService.initializeProcess(res);
            this.multiBankService.getEntityList().forEach(entity => {
              entityList.push(entity);
            });
            if (entityList[0] && entityList[0][FccGlobalConstant.VALUE]) {
              this.multiBankService.setCurrentEntity(entityList[0][FccGlobalConstant.VALUE].name);
            }
            this.multiBankService.getBankList().forEach(bank => {
              corporateBanksInit.push(bank);

            });
            this.patchFieldValueAndParameters(this.form.get('issuingBankAbbvName'), corporateBanksInit[0].value, {});
            this.patchFieldValueAndParameters(this.form.get('issuingBankName'), corporateBanksInit[0].value, {});
          },
          () => {
            this.multiBankService.clearAllData();
          }
        ));
        this.getFacilityDetails();
      }
      this.setBalanceOutstandingAmt();
    }
    this.form.updateValueAndValidity();
  }

  private handleEntityDetailsFields() {
    if (this.mode === FccGlobalConstant.VIEW_MODE) {
      if (this.stateService.getSectionData('eventDetails', this.productCode, false, 'EVENTSTATE')
        && this.stateService.getSectionData('eventDetails', this.productCode, false, 'EVENTSTATE').get('lnTransactionType')
        && (this.stateService.getSectionData(
          'eventDetails', this.productCode, false, 'EVENTSTATE').get('lnTransactionType').value === FccGlobalConstant.N002_AMEND
          || this.stateService.getSectionData(
            'eventDetails', this.productCode, false, 'EVENTSTATE').get('lnTransactionType').value === FccGlobalConstant.N002_INQUIRE)) {
        if (this.form.get('loanDetailsHeader'))
        {
          this.form.get('loanDetailsHeader')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('loanDetailsHeader')[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = false;
        }
        if (this.form.get('loanDetailsReference'))
        {
          this.form.get('loanDetailsReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('loanDetailsReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = false;
        }
        if (this.form.get('loanDetailsEntity'))
        {
          this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = false;

        }
        if (this.form.get('loanDetailsName'))
        {
          this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = false;
        }
        if (this.form.get('loanDetailsFirstAddress'))
        {
          this.form.get('loanDetailsFirstAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('loanDetailsFirstAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = false;
        }
        if (this.form.get('loanDetailsSecondAddress'))
        {
          this.form.get('loanDetailsSecondAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('loanDetailsSecondAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = false;
        }
        if (this.form.get('loanDetailsThirdAddress'))
        {
          this.form.get('loanDetailsThirdAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('loanDetailsThirdAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = false;
        }
      } else {
        const fieldList = ['loanDetailsHeader', 'loanDetailsReference', 'loanDetailsEntity', 'loanDetailsName'];
        this.setRenderedFieldsValue(fieldList);
      }
    }
  }

  setRenderedFieldsValue(ids: string[]) {
    ids.forEach(id => this.setRenderedValue(id));
  }

  setRenderedValue(fieldName: string) {
    if (this.form.get(fieldName)) {
      if (this.form.get(fieldName).value) {
        this.form.get(fieldName)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(fieldName)[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = true;
      } else {
        this.form.get(fieldName)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(fieldName)[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = false;
      }
    }
  }

  private getFacilityDetails() {
    this.facilityDetails = this.facilityDetailsService.getFacilityDetailsObj();
    if (this.facilityDetails && this.facilityDetails.facilityName) {
      this.updateFacilityDetails();
      this.showSpinner = false;
      this.commonService.formatForm(this.form);
    } else {
      if (this.form.get('facilityData') && !this.form.get('facilityData').value) {
        this.subscriptionArray.push(this.lendingService.getFacilityDetails(this.facilityID, []).subscribe(resp => {
          this.facilityDetails = resp.body;
          this.patchFieldValueAndParameters(this.form.get('facilityData'), this.facilityDetails, {});
          this.updateFacilityDetails();
          this.commonService.formatForm(this.form);
          this.showSpinner = false;
        }));
      } else {
        this.facilityDetails = this.form.get('facilityData').value;
        this.updateFacilityDetails();
        this.commonService.formatForm(this.form);
        this.showSpinner = false;
      }
    }
  }

  setBalanceOutstandingAmt() {
    if (this.mode === FccGlobalConstant.VIEW_MODE
        && this.stateService.getSectionData('lnGeneralDetails', this.productCode, false, 'EVENTSTATE')
        && this.stateService.getSectionData('lnGeneralDetails', this.productCode, false, 'EVENTSTATE').get('orgLnAmt')) {
      const orgLnAmt = this.stateService.getSectionData('lnGeneralDetails', this.productCode, false, 'EVENTSTATE').get('orgLnAmt').value;
      const balanceOutstanding = `${this.form.get('lnCurCodeView').value} ${orgLnAmt}`;
      if (orgLnAmt !== null) {
        this.patchFieldValueAndParameters(this.form.get('balanceOutstandingVeiw'), balanceOutstanding, {});
        const sectionForm: FCCFormGroup = this.stateService.getSectionData(FccGlobalConstant.LN_GENERAL_DETAILS, this.productCode);

        if (sectionForm.get('balanceOutstandingVeiw') && sectionForm.get('balanceOutstandingVeiw').value) {
          sectionForm.get('balanceOutstandingVeiw')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        } else {
          sectionForm.get('balanceOutstandingVeiw')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        this.stateService.setStateSection(FccGlobalConstant.LN_GENERAL_DETAILS, sectionForm);
      }
    } else if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.tnxTypeCode === FccGlobalConstant.N002_INQUIRE) {
      this.setDraftBalanceOutstandingAmt();
    }
  }

  setDraftBalanceOutstandingAmt() {
    if (this.stateService.getSectionData('lnGeneralDetails', this.productCode, true, 'MASTERSTATE')
        && this.stateService.getSectionData('lnGeneralDetails', this.productCode, true, 'MASTERSTATE').get('balanceOutstanding')) {
      const lnLiabAmt = this.stateService.getSectionData(
        'lnGeneralDetails', this.productCode, true, 'MASTERSTATE').get('balanceOutstanding').value;
      const balanceOutstanding = `${this.form.get('lnCurCodeView').value} ${lnLiabAmt}`;
      this.patchFieldValueAndParameters(this.form.get('balanceOutstandingVeiw'), balanceOutstanding, {});
    } else {
      if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
        const increaseTnxAmt = parseFloat(this.commonService.replaceCurrency(
          this.stateService.getSectionData(FccGlobalConstant.LN_INCREASE).get('lnIncreaseAmount').value));
        const increaseLiabAmt = parseFloat(this.commonService.replaceCurrency(
          this.stateService.getSectionData(FccGlobalConstant.LN_INCREASE).get('balanceOutstanding').value));
        const balanceIncreaseLaibAmt = `${this.form.get('lnCurCodeView').value} ${this.currencyConverterPipe.transform(
          Number(increaseLiabAmt - increaseTnxAmt).toString(), this.form.get('lnCurCodeView').value)}`;
        this.patchFieldValueAndParameters(this.form.get('balanceOutstandingVeiw'), balanceIncreaseLaibAmt, {});
      } else {
        const paymentTnxAmt = parseFloat(this.commonService.replaceCurrency(
          this.stateService.getSectionData(FccGlobalConstant.LN_REPAYMENT).get('lnPaymentAmount').value));
        const paymentLiabAmt = parseFloat(this.commonService.replaceCurrency(
          this.stateService.getSectionData(FccGlobalConstant.LN_REPAYMENT).get('balanceOutstanding').value));
        const balancePaymentLaibAmt = `${this.form.get('lnCurCodeView').value} ${this.currencyConverterPipe.transform(
          Number(paymentLiabAmt + paymentTnxAmt).toString(), this.form.get('lnCurCodeView').value)}`;
        this.patchFieldValueAndParameters(this.form.get('balanceOutstandingVeiw'), balancePaymentLaibAmt, {});
      }
    }
  }

  setSubTnxTypeCode() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.patchFieldValueAndParameters(this.form.get('subTnxTypeCode'), FccGlobalConstant.N003_INCREASE, {});
    } else if (this.tnxTypeCode === FccGlobalConstant.N002_MESSAGE) {
      this.patchFieldValueAndParameters(this.form.get('subTnxTypeCode'), FccGlobalConstant.N003_PAYMENT, {});
    }
  }

  updateFacilityDetails() {
        this.facilityDetailsService.setFacilityDetailsObj(this.facilityDetails);
        if (this.keysNotFoundList.length !== 0) {
          this.subscriptionArray.push(this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(resp => {
            if (resp.response && resp.response === 'REST_API_SUCCESS') {
              this.fccGlobalConfiguration.addConfigurationValues(resp, this.keysNotFoundList);
              this.facilityDetailsService.setRepricingdateValidation(
                FccGlobalConfiguration.configurationValues.get(
                  "VALIDATE_AMOUNT_WITH_REPRICING_DATE"
                )
              );
               this.facilityDetailsService.setRemittanceFlag(
                FccGlobalConfiguration.configurationValues.get(
                  "REMITTANCE_INSTRUCTION_SECTION_REQUIRED"
                )
              );
            }
          }));
        }
        this.facilityDetailsService.setRepricingdateValidation(
          FccGlobalConfiguration.configurationValues.get(
            "VALIDATE_AMOUNT_WITH_REPRICING_DATE"
          )
        );
        this.facilityDetailsService.setRemittanceFlag(
          FccGlobalConfiguration.configurationValues.get(
            "REMITTANCE_INSTRUCTION_SECTION_REQUIRED"
          )
        );
          if (this.facilityDetails) {
          this.updateLoanRequestTypeData();
          this.updateCodeValues();
          this.getRiskTypes(this.facilityDetailsService.getRiskTypes());
          this.patchFieldValueAndParameters(this.form.get('dealID'), this.facilityDetails.dealId, {});
          this.patchFieldValueAndParameters(this.form.get('dealName'), this.facilityDetails.dealName, {});
          this.patchFieldValueAndParameters(this.form.get('facilityID'), this.facilityDetails.facilityId, {});
          this.patchFieldValueAndParameters(this.form.get('facilityName'), this.facilityDetails.facilityName, {});
          this.patchFieldValueAndParameters(this.form.get('fcnId'), this.facilityDetails.fcn, {});
          this.patchFieldValueAndParameters(this.form.get('facilityType'), this.facilityDetails.type, {});
          this.patchFieldValueAndParameters(
            this.form.get('effectiveDate'), this.utilityService.transformDateFormat(
              this.utilityService.transformddMMyyyytoDate(this.facilityDetails.effectiveDate)), {});
          this.patchFieldValueAndParameters(
            this.form.get('expiryDate'), this.utilityService.transformDateFormat(
              this.utilityService.transformddMMyyyytoDate(this.facilityDetails.expiryDate)), {});
          this.patchFieldValueAndParameters(
            this.form.get('maturityDate'), this.utilityService.transformDateFormat(
              this.utilityService.transformddMMyyyytoDate(this.facilityDetails.maturityDate)), {});
          const sanctionLimitVal = `${this.facilityDetails.mainCurrency} ${this.currencyConverterPipe.transform(
                this.facilityDetails.totalLimit.toString(), this.facilityDetails.mainCurrency)}`;
          this.patchFieldValueAndParameters(this.form.get('sanctionLimit'), sanctionLimitVal, {});
          const availableAmtLimitVal = `${this.facilityDetails.mainCurrency} ${this.currencyConverterPipe.transform(
                this.facilityDetails.availableToDraw.toString(), this.facilityDetails.mainCurrency)}`;
          this.patchFieldValueAndParameters(this.form.get('availableAmtLimit'), availableAmtLimitVal, {});
          this.patchFieldValueAndParameters(this.form.get('bankName'), this.facilityDetails.bankName, {});
        }
  }

  facilityBorrowRef(borrowRefList) {
    const refList = [];
    borrowRefList.forEach((refs) => {
      refList.push(refs.borrowerId);
    });
    return refList;
  }
  populateBorrowerList(event){
    if (event && event.value && event.value === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
      this.facilityDetails.borrowers.forEach(borrower => {
        if (borrower.isSwinglineAllowed){
          this.multiBankService.getBorrowerReferenceList().forEach(reference => {
            if (reference.label === borrower.fccReference){
              this.borrowerReferenceList.push(reference);
            }
          });
        }
      });
    } else {
      this.multiBankService.getBorrowerReferenceList().forEach(reference => {
        this.facilityDetails.borrowers.forEach(borrower => {
          if (borrower.fccReference === reference.label) {
            this.borrowerReferenceList.push(reference);
          }
        });
      });
    }
    this.patchFieldParameters(this.form.get('loanDetailsReference'), { options: this.borrowerReferenceList });
  }

  updateLoanRequestTypeData() {
    let loanTypeOption;
    const loanRequestType = this.stateService.getSectionData(FccGlobalConstant.LN_GENERAL_DETAILS).get('loanRequestTypeOptions');
    if (loanRequestType && loanRequestType.value) {
      this.selectButtonArr = [];
      loanTypeOption = `loanRequestTypeOptions_${loanRequestType.value}`;
      this.patchFieldValueAndParameters(this.form.get('loanRequestTypeOptions'), loanRequestType.value, {});
      this.selectButtonArr = [{
        label: `${this.translateService.instant(loanTypeOption)}`, value: loanRequestType.value, disabled: false
      }];
      this.patchFieldParameters(this.form.get('loanRequestTypeOptions'), { options: this.selectButtonArr });
    } else {
      this.selectButtonArr = [];
      loanTypeOption = `loanRequestTypeOptions_${this.facilityDetails.type}`;
      if (this.drawdownAllowed === 'Y') {
        this.selectButtonArr = [{
          label: `${this.translateService.instant(loanTypeOption)}`, value: this.facilityDetails.type, disabled: false
        }];
      }
      const isSwingLineArray = this.facilityDetails.borrowers.filter(borrower => borrower.isSwinglineAllowed);
      if (isSwingLineArray && isSwingLineArray.length > 0 && this.swinglineAllowed === 'Y') {
        const index = this.selectButtonArr.findIndex(data => data.value === FccGlobalConstant.LN_REQUEST_TYPE_SWNG);
        if (index < 0){
          this.selectButtonArr.push({
            label: `${this.translateService.instant('loanRequestTypeOptions_swingline')}`,
              value: FccGlobalConstant.LN_REQUEST_TYPE_SWNG, disabled: false
          });
        }
      }
      // setting swingline as default if user has only swingline permission and drawdown flag as false and swingline allowed as true
      if (this.drawdownAllowed === 'N' && this.swinglineAllowed === 'Y' && isSwingLineArray && isSwingLineArray.length > 0 ) {
        this.patchFieldParameters(this.form.get('loanRequestTypeOptions'), { defaultValue: FccGlobalConstant.LN_REQUEST_TYPE_SWNG });
        this.patchFieldValueAndParameters(this.form.get('loanRequestTypeOptions'), FccGlobalConstant.LN_REQUEST_TYPE_SWNG, {});
      } else {
        // setting facility detail type as default loan request type if user has both swingline and drawdown flag false
        this.patchFieldParameters(this.form.get('loanRequestTypeOptions'), { defaultValue: this.facilityDetails.type });
        this.patchFieldValueAndParameters(this.form.get('loanRequestTypeOptions'), this.facilityDetails.type, {});
        const index = this.selectButtonArr.findIndex(data => data.value === this.facilityDetails.type);
        if (index < 0){
          this.selectButtonArr.push({
            label: `${this.translateService.instant(loanTypeOption)}`, value: this.facilityDetails.type, disabled: false
          });
        }
      }
    }
    this.patchFieldParameters(this.form.get('loanRequestTypeOptions'), { options: this.selectButtonArr });
    this.form.get('loanRequestTypeOptions').updateValueAndValidity();
  }

  setSwinglineDrawdownCodes(event) {
    if (event && event.value && event.value === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
      this.patchFieldValueAndParameters(this.form.get('subProductCode'), FccGlobalConstant.N047_LOAN_SWINGLINE, {});
      this.patchFieldValueAndParameters(this.form.get('subTnxTypeCode'), FccGlobalConstant.N003_SWINGLINE, {});
      this.facilityDetailsService.setSwinglineData('Y');
    } else {
      this.patchFieldValueAndParameters(this.form.get('subProductCode'), FccGlobalConstant.N047_LOAN_DRAWDOWN, {});
      this.patchFieldValueAndParameters(this.form.get('subTnxTypeCode'), FccGlobalConstant.N003_DRAWDOWN, {});
      this.facilityDetailsService.setSwinglineData('N');
    }
    if (this.referenceId || this.commonService.referenceId) {
      this.setOptionsDisable(event);
    }
  }
  setOptionsDisable(event) {
    if (event && event.value) {
      this.selectButtonArr.forEach(element => {
        if (element.value === event.value) {
          element.disabled = false;
        } else {
          element.disabled = true;
        }
      });
    }
    this.patchFieldParameters(this.form.get('loanRequestTypeOptions'), { options: this.selectButtonArr });
  }

  updateCodeValues() {
    const loanRequestType = this.stateService.getSectionData(FccGlobalConstant.LN_GENERAL_DETAILS).get('loanRequestTypeOptions');
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.setSwinglineDrawdownCodes(loanRequestType);
    }
  }

  getRiskTypeCodeData() {
    this.riskTypes = [];
    this.codeData.codeId = FccGlobalConstant.CODEDATA_RISK_TYPE_CODES_C032;
    this.codeData.productCode = this.productCode;
    this.codeData.subProductCode = '';
    this.codeData.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
    localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
    this.subscriptionArray.push(this.commonService.getCodeDataDetails(this.codeData).subscribe(response => {
      if (response && response.body && response.body.items) {
        this.riskTypeCodeData = response.body.items;
      }
    }));
  }

  getRiskTypes(options) {
    this.riskTypes = [];
    let riskTypeFlag = false;
    if (this.riskTypeCodeData && this.riskTypeCodeData.length > 0) {
      this.riskTypeCodeData.forEach(responseValue => {
        options.forEach(ele => {
          if (responseValue.value === ele.id && responseValue.language === this.codeData.language) {
            Object.keys(this.riskTypes).forEach(keys => {
              if (this.riskTypes[keys][FccGlobalConstant.VALUE] === responseValue.value) {
                riskTypeFlag = true;
              }
            });
            if (!riskTypeFlag) {
              this.riskTypes.push(
                {
                  label: responseValue.longDesc,
                  value: responseValue.value
                }
              );
            }
          }
        });
      });
    }

    const isSwingLineArray = this.facilityDetails.borrowers.filter(borrower => borrower.isSwinglineAllowed);
    const riskTypesUpdate = this.riskTypes;
    if (this.drawdownAllowed === 'N' && this.swinglineAllowed === 'Y' && isSwingLineArray && isSwingLineArray.length > 0 ) {
      this.riskTypes.forEach(e => {
          if(e.lable !== 'SWNG'){
            riskTypesUpdate.pop();
          }
      });

      if(riskTypesUpdate.length === 0){
        riskTypesUpdate.push(
          {
            label: 'SWNG',
            value: 'SWNG'
          });
      }
    }



    this.patchFieldValueAndParameters(this.form.get('riskTypesList'), this.riskTypes, {});
  }

  updateUserEntities() {
    // Getting facility details
    this.facilityID = this.facilityID !== undefined ? this.facilityID : this.form.get('facilityID').value;
    let corporateReferenceValueList = [];
    if (this.borrowerIds && this.borrowerIds.indexOf(',') > -1) {
      this.borrowerIds.split(',').forEach(element => {
        corporateReferenceValueList.push(element);
      });
    } else {
      corporateReferenceValueList = this.borrowerIds;
    }
    if (this.facilityID && this.form.get('facilityData') && !this.form.get('facilityData').value) {
      this.subscriptionArray.push(this.lendingService.getFacilityDetails(this.facilityID, []).subscribe(resp => {
        this.facilityDetails = resp.body;
        this.showSpinner = false;
        this.patchFieldValueAndParameters(this.form.get('facilityData'), this.facilityDetails, {});
        this.getMultiBankData();
      }));
    } else {
      this.facilityDetails = this.form.get('facilityData').value;
      this.getMultiBankData();
      this.showSpinner = false;
    }
  }

  getMultiBankData() {
    this.subscriptionArray.push(
      this.multiBankService.getCustomerBankDetailsAPI(FccGlobalConstant.PRODUCT_LN, '', FccGlobalConstant.REQUEST_INTERNAL).subscribe(
      res => {
        this.borrowerReferenceList = [];
        this.borrowerReferenceInternalList = [];
        this.multiBankService.initializeLendingProcess(res);
        this.multiBankService.getBorrowerReferenceList().forEach(reference => {
          this.facilityDetails.borrowers.forEach(borrower => {
            if (borrower.fccReference === reference.label) {
              this.borrowerReferenceList.push(reference);
            }
          });
        });
        this.multiBankService.getBorrowerReferenceInternalList().forEach(internalRef => {
          this.facilityDetails.borrowers.forEach(borrower => {
            if (borrower.fccReference === internalRef.value) {
              this.borrowerReferenceInternalList.push(internalRef.id);
            }
          });
        });
        this.patchFieldParameters(this.form.get('loanDetailsReference'), { options: this.borrowerReferenceList });
        this.corporateBanks = [];
        if (this.borrowerReferenceList.length === 1) {
          this.form.get('loanDetailsReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
          this.form.get('loanDetailsReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
          const val = this.dropdownAPIService.getInputDropdownValue(this.borrowerReferenceList, 'loanDetailsReference', this.form);
          this.form.get('loanDetailsReference').setValue(val);
          this.multiBankService.setCurrentBorrowerRefBank(this.borrowerReferenceList[0].value);
          this.multiBankService.getBankList().forEach(bank => {
            this.corporateBanks.push(bank);
            this.patchFieldValueAndParameters(this.form.get('issuingBankAbbvName'), this.corporateBanks[0].value, {});
            this.patchFieldValueAndParameters(this.form.get('issuingBankName'), this.corporateBanks[0].value, {});
          });
          this.form.get('loanRefID').setValue(this.borrowerReferenceInternalList[0]);
          this.facilityDetailsService.setCurrentBorrower(this.borrowerReferenceInternalList[0]);
          this.form.get('loanDetailsReference').updateValueAndValidity();
          this.form.updateValueAndValidity();

          this.patchFieldParameters(this.form.get('loanDetailsEntity'), { options: this.updateEntityList() });
          if (this.entities.length === 0) {
            this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
            this.form.get('loanDetailsFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
            this.form.get('loanDetailsSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
            this.form.get('loanDetailsThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
            if (this.form.get('loanDetailsEntity')) {
              this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
              this.setMandatoryField(this.form, 'loanDetailsEntity', false);
              this.form.get('loanDetailsEntity').clearValidators();
              this.form.get('loanDetailsEntity').updateValueAndValidity();
            }
            this.corporateCommonService.getValues(this.fccGlobalConstantService.corporateDetails).subscribe(response => {
              if (response.status === FccGlobalConstant.HTTP_RESPONSE_SUCCESS) {
                this.corporateDetails = response.body;
                this.form.get('loanDetailsName').setValue(this.corporateDetails.name);
                this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
                if (response.body.postalAddress) {
                  const firstAddressValue = this.stateService.getSectionData(
                    FccGlobalConstant.LN_GENERAL_DETAILS).get('loanDetailsFirstAddress').value;
                  firstAddressValue && firstAddressValue !== '' ? this.form.get('loanDetailsFirstAddress').setValue(firstAddressValue) :
                    this.form.get('loanDetailsFirstAddress').setValue(response.body.postalAddress.line1);
                  const secondAddressValue = this.stateService.getSectionData(
                    FccGlobalConstant.LN_GENERAL_DETAILS).get('loanDetailsSecondAddress').value;
                  secondAddressValue && secondAddressValue !== '' ? this.form.get('loanDetailsSecondAddress').setValue(
                    secondAddressValue) : this.form.get('loanDetailsSecondAddress').setValue(response.body.postalAddress.line2);
                  const thirdAddressValue = this.stateService.getSectionData(
                    FccGlobalConstant.LN_GENERAL_DETAILS).get('loanDetailsThirdAddress').value;
                  thirdAddressValue && thirdAddressValue !== '' ? this.form.get('loanDetailsThirdAddress').setValue(thirdAddressValue) :
                    this.form.get('loanDetailsThirdAddress').setValue(response.body.postalAddress.line3);
                }
              }
            });
          } else if (this.entities.length === 1) {
            this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
            this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.form.get('loanDetailsEntity').setValue({ label: this.entities[0].value.label, name: this.entities[0].value.name,
              shortName: this.entities[0].value.shortName });
            this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
            this.form.get('loanDetailsName').setValue(this.entities[0].value.name);
            this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
            this.form.get('loanDetailsFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
            this.form.get('loanDetailsSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
            this.form.get('loanDetailsThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
            const address = this.multiBankService.getAddress(this.entities[0].value.shortName);
            this.patchFieldValueAndParameters(this.form.get('loanDetailsFirstAddress'),
                address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_1], '');
            this.patchFieldValueAndParameters(this.form.get('loanDetailsSecondAddress'),
                address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_2], '');
            this.patchFieldValueAndParameters(this.form.get('loanDetailsThirdAddress'),
                address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_3], '');
          } else if (this.entities.length > 1) {
            this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
            this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
            this.form.get('loanDetailsFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
            this.form.get('loanDetailsSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
            this.form.get('loanDetailsThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
          }
        } else if (this.borrowerReferenceList.length > 1) {
          this.form.get('loanDetailsReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
          this.form.get('loanDetailsReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          this.patchFieldParameters(this.form.get('loanDetailsEntity'), { options: [] });
        }
        this.patchFieldParameters(this.form.get('loanDetailsEntity'), { options: this.updateEntityList() });
        this.updateFacilityDetails();
        this.updateEntity();
      },
      () => {
        this.multiBankService.clearAllData();
      })
    );
  }

  updateEntityList() {
    this.entities = [];
    this.multiBankService.getLendingEntityList().forEach(entity => {
      this.entities.push(entity);
    });
    if (this.entities.length === 0) {
      this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('loanDetailsFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('loanDetailsSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('loanDetailsThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      if (this.form.get('loanDetailsEntity')) {
        this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.setMandatoryField(this.form, 'loanDetailsEntity', false);
        this.form.get('loanDetailsEntity').clearValidators();
        this.form.get('loanDetailsEntity').updateValueAndValidity();
      }
      this.subscriptionArray.push(this.corporateCommonService.getValues(
        this.fccGlobalConstantService.corporateDetails
        ).subscribe(response => {
        if (response.status === FccGlobalConstant.HTTP_RESPONSE_SUCCESS) {
          this.corporateDetails = response.body;
          this.form.get('loanDetailsName').setValue(this.corporateDetails.name);
          this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
          if (response.body.postalAddress) {
            const firstAddressValue = this.stateService.getSectionData(
              FccGlobalConstant.LN_GENERAL_DETAILS).get('loanDetailsFirstAddress').value;
            firstAddressValue && firstAddressValue !== '' ? this.form.get('loanDetailsFirstAddress').setValue(firstAddressValue) :
              this.form.get('loanDetailsFirstAddress').setValue(response.body.postalAddress.line1);
            const secondAddressValue = this.stateService.getSectionData(
              FccGlobalConstant.LN_GENERAL_DETAILS).get('loanDetailsSecondAddress').value;
            secondAddressValue && secondAddressValue !== '' ? this.form.get('loanDetailsSecondAddress').setValue(secondAddressValue) :
              this.form.get('loanDetailsSecondAddress').setValue(response.body.postalAddress.line2);
            const thirdAddressValue = this.stateService.getSectionData(
              FccGlobalConstant.LN_GENERAL_DETAILS).get('loanDetailsThirdAddress').value;
            thirdAddressValue && thirdAddressValue !== '' ? this.form.get('loanDetailsThirdAddress').setValue(thirdAddressValue) :
              this.form.get('loanDetailsThirdAddress').setValue(response.body.postalAddress.line3);
          }
        }
      }));
    } else if (this.entities.length === 1) {
      this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('loanDetailsEntity').setValue({ label: this.entities[0].value.label, name: this.entities[0].value.name,
        shortName: this.entities[0].value.shortName });
      this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      this.form.get('loanDetailsName').setValue(this.entities[0].value.name);
      this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('loanDetailsFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('loanDetailsSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('loanDetailsThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      const address = this.multiBankService.getAddress(this.entities[0].value.shortName);
      this.patchFieldValueAndParameters(this.form.get('loanDetailsFirstAddress'),
          address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_1], '');
      this.patchFieldValueAndParameters(this.form.get('loanDetailsSecondAddress'),
          address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_2], '');
      this.patchFieldValueAndParameters(this.form.get('loanDetailsThirdAddress'),
          address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_3], '');
    } else if (this.entities.length > 1) {
      this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('loanDetailsFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('loanDetailsSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('loanDetailsThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
    }
    return this.entities;
  }

  updateEntity() {
    if (this.form.get('loanDetailsEntity') && this.form.get('loanDetailsEntity').value
        && this.stateService.getSectionData(FccGlobalConstant.LN_GENERAL_DETAILS).get('loanDetailsEntity')) {
      const loanDetailsEntity = this.stateService.getValue(FccGlobalConstant.LN_GENERAL_DETAILS, 'loanDetailsEntity', false);
      if (loanDetailsEntity ) {
        this.form.get('loanDetailsEntity').setValue( this.entities.filter(
          task => task.value.label === loanDetailsEntity)[0].value);
      }
    }
  }

  onClickLoanRequestTypeOptions(event) {
    this.borrowerReferenceList = [];
    this.setSwinglineDrawdownCodes(event);
    this.getRiskTypes(this.facilityDetailsService.getRiskTypes());
    this.populateBorrowerList(event);
  }

  onClickLoanDetailsEntity(event) {
    if (event.value) {
      this.multiBankService.setCurrentEntity(event.value.name);
      this.patchFieldValueAndParameters(this.form.get('loanDetailsName'), event.value.name, '');
      this.entities.forEach(value => {
        if (event.value.shortName === value.value.shortName) {
          const address = this.multiBankService.getAddress(value.value.shortName);
          this.patchFieldValueAndParameters(this.form.get('loanDetailsFirstAddress'),
              address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_1], '');
          this.patchFieldValueAndParameters(this.form.get('loanDetailsSecondAddress'),
              address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_2], '');
          this.patchFieldValueAndParameters(this.form.get('loanDetailsThirdAddress'),
              address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_3], '');
        }
      });
    }
  }

  onClickLoanDetailsReference(event) {
    if (event.value) {
      this.borrowerReferenceList.forEach(ele => {
        if (event.value === ele.value) {
          this.corporateBanks = [];
          this.patchFieldValueAndParameters(this.form.get('loanRefID'), ele.id, {});
          this.facilityDetailsService.setCurrentBorrower(ele.id);
          this.multiBankService.setCurrentBorrowerRefBank(event.value);
          this.multiBankService.getBankList().forEach(bank => {
            this.corporateBanks.push(bank);
            this.patchFieldValueAndParameters(this.form.get('issuingBankAbbvName'), this.corporateBanks[0].value, {});
            this.patchFieldValueAndParameters(this.form.get('issuingBankName'), this.corporateBanks[0].value, {});
          });
        }
      });
      this.entities = [];
      this.multiBankService.getLendingEntityList().forEach(entity => {
        this.entities.push(entity);
      });
      this.patchFieldParameters(this.form.get('loanDetailsEntity'), { options: this.updateEntityList() });
      this.form.get('loanDetailsEntity').setValue('');
      if (this.entities.length === 0) {
        this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        this.form.get('loanDetailsFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        this.form.get('loanDetailsSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        this.form.get('loanDetailsThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        if (this.form.get('loanDetailsEntity')) {
          this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.setMandatoryField(this.form, 'loanDetailsEntity', false);
          this.form.get('loanDetailsEntity').clearValidators();
          this.form.get('loanDetailsEntity').updateValueAndValidity();
        }
        this.subscriptionArray.push(this.corporateCommonService.getValues(
          this.fccGlobalConstantService.corporateDetails
          ).subscribe(response => {
          if (response.status === FccGlobalConstant.HTTP_RESPONSE_SUCCESS) {
            this.corporateDetails = response.body;
            this.form.get('loanDetailsName').setValue(this.corporateDetails.name);
            this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
            if (response.body.postalAddress) {
              const firstAddressValue = this.stateService.getSectionData(
                FccGlobalConstant.LN_GENERAL_DETAILS).get('loanDetailsFirstAddress').value;
              firstAddressValue && firstAddressValue !== '' ? this.form.get('loanDetailsFirstAddress').setValue(firstAddressValue) :
                this.form.get('loanDetailsFirstAddress').setValue(response.body.postalAddress.line1);
              const secondAddressValue = this.stateService.getSectionData(
                FccGlobalConstant.LN_GENERAL_DETAILS).get('loanDetailsSecondAddress').value;
              secondAddressValue && secondAddressValue !== '' ? this.form.get('loanDetailsSecondAddress').setValue(secondAddressValue) :
                this.form.get('loanDetailsSecondAddress').setValue(response.body.postalAddress.line2);
              const thirdAddressValue = this.stateService.getSectionData(
                FccGlobalConstant.LN_GENERAL_DETAILS).get('loanDetailsThirdAddress').value;
              thirdAddressValue && thirdAddressValue !== '' ? this.form.get('loanDetailsThirdAddress').setValue(thirdAddressValue) :
                this.form.get('loanDetailsThirdAddress').setValue(response.body.postalAddress.line3);
            }
          }
        }));
      } else if (this.entities.length === 1) {
        this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('loanDetailsEntity').setValue({ label: this.entities[0].value.label, name: this.entities[0].value.name,
          shortName: this.entities[0].value.shortName });
        this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
        this.form.get('loanDetailsName').setValue(this.entities[0].value.name);
        this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        this.form.get('loanDetailsFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        this.form.get('loanDetailsSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        this.form.get('loanDetailsThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        const address = this.multiBankService.getAddress(this.entities[0].value.shortName);
        this.patchFieldValueAndParameters(this.form.get('loanDetailsFirstAddress'),
            address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_1], '');
        this.patchFieldValueAndParameters(this.form.get('loanDetailsSecondAddress'),
            address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_2], '');
        this.patchFieldValueAndParameters(this.form.get('loanDetailsThirdAddress'),
            address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_3], '');
      } else if (this.entities.length > 1) {
        this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('loanDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
        this.form.get('loanDetailsName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        this.form.get('loanDetailsFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        this.form.get('loanDetailsSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        this.form.get('loanDetailsThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        this.form.get('loanDetailsName').setValue('');
        this.form.get('loanDetailsFirstAddress').setValue('');
        this.form.get('loanDetailsSecondAddress').setValue('');
        this.form.get('loanDetailsThirdAddress').setValue('');
      }
    }
  }

  onKeyupLoanDetailsEntity(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.constant.thirtyEight || keycodeIs === this.constant.forty) {
      this.onClickLoanDetailsEntityForAccessibility(this.form.get('loanDetailsEntity').value);
    }
  }

  onClickLoanDetailsEntityForAccessibility(values) {
    if (values) {
      this.multiBankService.setCurrentEntity(values.name);
      this.patchFieldValueAndParameters(this.form.get('loanDetailsName'), values.name, '');
      this.entities.forEach(value => {
        if (value.value.shortName === values.shortName) {
          const address = this.multiBankService.getAddress(value.value.shortName);
          this.patchFieldValueAndParameters(this.form.get('loanDetailsFirstAddress'),
              address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_1], '');
          this.patchFieldValueAndParameters(this.form.get('loanDetailsSecondAddress'),
              address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_2], '');
          this.patchFieldValueAndParameters(this.form.get('loanDetailsThirdAddress'),
              address[FccGlobalConstant.ADDRESS][FccGlobalConstant.ADDRESS_LINE_3], '');
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscriptionArray && this.subscriptionArray.length > 0){
      this.subscriptionArray.forEach(sub => {
        sub.unsubscribe();
      });
    }
    this.stateService.setStateSection(FccGlobalConstant.LN_GENERAL_DETAILS, this.form);
  }

}
