import { Direction } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, pipe, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LendingCommonDataService } from '../../../common/service/lending-common-data-service';
import { FacilityDetailsService } from '../../../ln/initiation/services/facility-details.service';
import { CreateNewLoanDialogComponent } from '../create-new-loan-dialog/create-new-loan-dialog.component';
import { InterestDetailsPopupComponent } from '../interest-details-popup/interest-details-popup.component';
import { LnrpnProductComponent } from '../lnrpn-product/lnrpn-product.component';
import { FCCFormGroup } from './../../../../../../app/base/model/fcc-control.model';
import { FccGlobalConstantService } from './../../../../../../app/common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../../app/common/core/fcc-global-constants';
import { CurrencyRequest } from './../../../../../../app/common/model/currency-request';
import { CommonService } from './../../../../../../app/common/services/common.service';
import { FileHandlingService } from './../../../../../../app/common/services/file-handling.service';
import { HideShowDeleteWidgetsService } from './../../../../../../app/common/services/hide-show-delete-widgets.service';
import { SessionValidateService } from './../../../../../../app/common/services/session-validate-service';
import { FccGlobalConfiguration } from './../../../../../common/core/fcc-global-configuration';
import { CodeData } from './../../../../../common/model/codeData';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../common/services/form-model.service';
import { ResolverService } from './../../../../../common/services/resolver.service';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { TransactionDetailService } from './../../../../../common/services/transactionDetail.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import { ProductStateService } from './../../../../trade/lc/common/services/product-state.service';
import {
  ConfirmationDialogComponent
} from './../../../../trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { CurrencyConverterPipe } from './../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from './../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from './../../../../trade/lc/initiation/services/filelist.service';
import { FormControlService } from './../../../../trade/lc/initiation/services/form-control.service';
import { UtilityService } from './../../../../trade/lc/initiation/services/utility.service';

@Component({
  selector: 'app-lnrpn-general-details',
  templateUrl: './lnrpn-general-details.component.html',
  styleUrls: ['./lnrpn-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LnrpnGeneralDetailsComponent }]
})
export class LnrpnGeneralDetailsComponent extends LnrpnProductComponent implements OnInit {
  contextPath: string;
  tnxTypeCode: any;
  option: any;
  mode: any;
  form: FCCFormGroup;
  module = `${this.translateService.instant('lnrpnGeneralDetails')}`;
  bulkLoanListOptions = [];
  itemArray = [];
  innerControlArray = [];
  bulkLoanData: any = [];
  codeData = new CodeData();
  pricingOptionLongDesc: any;
  totalAmtRepriced = 0;
  updatedBulkLoanData: any = [];
  referenceList: any = [];
  facilityID: any;
  facilityName: any;
  pricingOption: any;
  bkCurCode: any;
  referenceId: any = [];
  oldLoansAlias: string;
  responseObject: any = [];
  tableColumns: any[];
  configuredKeysList = // eslint-disable-next-line max-len
  'LOAN_INTEREST_PAYMENT_ALLOWED_REPRICING,RESTRICT_NET_CASH_FLOW,VALIDATE_AMOUNT_WITH_REPRICING_DATE,REMITTANCE_INSTRUCTION_SECTION_REQUIRED_FOR_REPRICING';
  keysNotFoundList: any[] = [];
  facilityDetails: any;
  remittanceFlag: any;
  remittanceInstructions: any = [];
  transactionSubscription: Subscription[] = [];
  createLoanDialogRef: any;
  loanToEdit: any;
  curObject: any;
  newLoansData: any[];
  btndisable = 'btndisable';
  borrowerFacDetails: any;
  frequencyCodeData: any;
  showSpinner: boolean;
  facilityFcn: any;
  isCalledAgain: boolean;
  refId: string;
  tnxId: string;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router, protected leftSectionService: LeftSectionService,
              public dialogService: DialogService, public uploadFile: FilelistService, public deleteFile: CommonService,
              public downloadFile: CommonService, protected transactionDetailService: TransactionDetailService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              public autoUploadFile: CommonService, protected fileListSvc: FilelistService,
              protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected eventEmitterService: EventEmitterService, protected stateService: ProductStateService,
              protected fileHandlingService: FileHandlingService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
              protected lendingService: LendingCommonDataService,
              protected facilityDetailsService: FacilityDetailsService,
              public overlay: Overlay, protected dialog: MatDialog,
              protected fccGlobalConfiguration: FccGlobalConfiguration) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileListSvc, dialogRef,
      currencyConverterPipe);
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.showSpinner = true;
    this.isCalledAgain = false;
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_ID);
    if (this.commonService.referenceId === undefined && !this.refId) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    if (this.mode === FccGlobalConstant.INITIATE) {
      if (this.commonService.selectedRows && this.commonService.selectedRows.length > 0) {
        this.initializeFormGroup();
      }
    } else {
      this.initializeFormGroup();
    }
    this.hidePopUpData();
    this.setAmtValues();
  }

  setAmtValues() {
    if (this.mode === FccGlobalConstant.VIEW_MODE) {
      const sectionForm: FCCFormGroup = this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS);
      if (sectionForm.get('totalNewLoanAmount') && sectionForm.get('totalNewLoanAmount').value) {
        sectionForm.get('totalNewLoanAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        sectionForm.get('totalNewLoanAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (sectionForm.get('principalPayment') && sectionForm.get('principalPayment').value) {
        sectionForm.get('principalPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        sectionForm.get('principalPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (sectionForm.get('increaseAmount') && sectionForm.get('increaseAmount').value) {
        sectionForm.get('increaseAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        sectionForm.get('increaseAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.stateService.setStateSection(FccGlobalConstant.LNRPN_GENERAL_DETAILS, sectionForm);
    }
  }

  getCodeDataDetails() {
    this.codeData.codeId =
      FccGlobalConstant.CODEDATA_REPRICING_FREQUENCY_CODES_C031;
    this.codeData.language =
      localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null
        ? localStorage.getItem(FccGlobalConstant.LANGUAGE)
        : '';
    this.transactionSubscription.push(this.commonService
      .getCodeDataDetails(this.codeData)
      .subscribe((response) => {
        if (response && response.body && response.body.items){
          this.frequencyCodeData = response.body.items;
          this.patchFieldValueAndParameters(this.form.get('repricingFrequency'), response.body.items, {});
          this.facilityDetailsService.setRepricingFrequency(response.body.items);
        }
      }));
  }

  hidePopUpData(){
    if (this.form){
      if (this.form.get('totalNewLoanAmount')) {
        this.form.get('totalNewLoanAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.form.get('principalPayment')) {
        this.form.get('principalPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.form.get('increaseAmount')) {
        this.form.get('increaseAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.form.get('remittanceInst')){
        this.form.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('remittanceInst').setValidators([]);
        this.form.get('remittanceInst').setErrors(null);
      }
    }
  }

  patchExtraValues() {
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.transactionSubscription.push(this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(resp => {
        if (resp.response && resp.response === 'REST_API_SUCCESS') {
          this.fccGlobalConfiguration.addConfigurationValues(resp, this.keysNotFoundList);
          this.patchFieldValueAndParameters(this.form.get('interestPaymentLoanFlag'),
              FccGlobalConfiguration.configurationValues.get('LOAN_INTEREST_PAYMENT_ALLOWED_REPRICING'), {});
              this.patchFieldValueAndParameters(
                this.form.get('netCashFlow'),
                FccGlobalConfiguration.configurationValues.get('RESTRICT_NET_CASH_FLOW'),
                {}
              );
          this.facilityDetailsService.setRepricingdateValidation(
            FccGlobalConfiguration.configurationValues.get(
              'VALIDATE_AMOUNT_WITH_REPRICING_DATE'
            )
          );
          this.patchFieldValueAndParameters(this.form.get('remittanceFlag'),
              FccGlobalConfiguration.configurationValues.get('REMITTANCE_INSTRUCTION_SECTION_REQUIRED_FOR_REPRICING'), {});
          this.facilityDetailsService.setRemittanceFlagRepricing(
            FccGlobalConfiguration.configurationValues.get(
              'REMITTANCE_INSTRUCTION_SECTION_REQUIRED_FOR_REPRICING'
            )
          );
        }
      }));
    }
    this.patchFieldValueAndParameters(this.form.get('interestPaymentLoanFlag'),
              FccGlobalConfiguration.configurationValues.get('LOAN_INTEREST_PAYMENT_ALLOWED_REPRICING'), {});
    this.patchFieldValueAndParameters(this.form.get('netCashFlow'),
              FccGlobalConfiguration.configurationValues.get('RESTRICT_NET_CASH_FLOW'), {});
              this.facilityDetailsService.setRepricingdateValidation(
                FccGlobalConfiguration.configurationValues.get(
                  'VALIDATE_AMOUNT_WITH_REPRICING_DATE'
                )
              );
    this.patchFieldValueAndParameters(this.form.get('remittanceFlag'),
              FccGlobalConfiguration.configurationValues.get('REMITTANCE_INSTRUCTION_SECTION_REQUIRED_FOR_REPRICING'), {});
              this.facilityDetailsService.setRemittanceFlagRepricing(
                FccGlobalConfiguration.configurationValues.get(
                  'REMITTANCE_INSTRUCTION_SECTION_REQUIRED_FOR_REPRICING'
                )
              );
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.LNRPN_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.patchFieldValueAndParameters(this.form.get('childProductCode'), FccGlobalConstant.PRODUCT_LN, {});
    this.patchFieldValueAndParameters(this.form.get('childSubProductCode'), FccGlobalConstant.CHILD_SUB_PRODUCT_CODE_BKLN, {});
    this.patchFieldValueAndParameters(this.form.get('bkType'), FccGlobalConstant.BK_TYPE, {});
    this.patchFieldValueAndParameters(this.form.get('TnxTypeCode'), FccGlobalConstant.N002_NEW, {});
    this.patchFieldValueAndParameters(this.form.get('subTnxTypeCode'), FccGlobalConstant.N003_REQUEST_FOR_REPRICING, {});
    this.form.get('createLNButton')[FccGlobalConstant.PARAMS][this.btndisable] = true;
    this.form.updateValueAndValidity();
    this.setOldLoansData();
  }

  getFacilityDetails(borrowerRef, facilityId) {
    this.transactionSubscription.push(this.lendingService
          .getFacilityDetails(facilityId, [borrowerRef])
        .subscribe((resp) => {
          if (resp && resp.body) {
            if (resp.body){
              this.form.get('createLNButton')[FccGlobalConstant.PARAMS][this.btndisable] = false;
              this.form.updateValueAndValidity();
            }
            this.showSpinner = false;
            this.facilityDetails = resp.body;
            this.facilityFcn = this.facilityDetails.fcn;
            this.patchFieldValueAndParameters(this.form.get('facilityDetails'), this.facilityDetails, {});
            this.patchFieldValueAndParameters(this.form.get('facilityType'), resp.body.type, {});
            this.facilityDetailsService.setFacilityDetailsObj(resp.body);
            this.patchFieldValueAndParameters(
              this.form.get('interestPaymentLoanFlag'),
              FccGlobalConfiguration.configurationValues.get(
                'LOAN_INTEREST_PAYMENT_ALLOWED_REPRICING'
              ),
              {}
            );
            this.patchFieldValueAndParameters(
              this.form.get('netCashFlow'),
              FccGlobalConfiguration.configurationValues.get(
                'RESTRICT_NET_CASH_FLOW'
              ),
              {}
            );
            this.facilityDetailsService.setRepricingdateValidation(
              FccGlobalConfiguration.configurationValues.get(
                'VALIDATE_AMOUNT_WITH_REPRICING_DATE'
              )
            );
            this.facilityDetailsService.setRemittanceFlagRepricing(
              FccGlobalConfiguration.configurationValues.get(
                'REMITTANCE_INSTRUCTION_SECTION_REQUIRED_FOR_REPRICING'
              )
            );
            if (
              this.facilityDetailsService.loansAdded &&
              this.facilityDetailsService.loansAdded.ln_tnx_record &&
              this.facilityDetailsService.loansAdded.ln_tnx_record.length > 0
            ) {
              const amountToRollover = this.getAmtToRollover();
              const totalNewLoanAmount = this.getTotalNewLoanAmount();
              if (amountToRollover < totalNewLoanAmount) {
                this.populateRemittanceData();
              }
            }
            const paramId = 'P768';
            const key1 = this.form.get('issuingBankAbbvName').value;
            const key2 = resp.body.type;
            const key3 = 'REPRICING';
            this.transactionSubscription.push(
              this.commonService
                .getParameterConfiguredValues(key1, paramId, key2, key3)
                .subscribe((response) => {
                  if (response && response.paramDataList) {
                    response.paramDataList.forEach((element) => {
                      const translatedLegalTextVal = `${this.translateService.instant(
                        element.data_1
                      )}`;
                      this.patchFieldValueAndParameters(
                        this.form.get('legalTextValue'),
                        translatedLegalTextVal,
                        {}
                      );
                      this.patchFieldValueAndParameters(
                        this.form.get('acceptLegalText'),
                        'Y',
                        {}
                      );
                    });
                  }
                })
            );
        }
      }));
  }

  setOldLoansData() {
    if (this.mode === FccGlobalConstant.INITIATE) {
      this.referenceList = this.commonService.selectedRows;
    } else {
      if (this.form.get('childRefIDs') && this.form.get('childRefIDs').value ) {
        const refObj = JSON.parse(this.form.get('childRefIDs').value);
        this.referenceList = [];
        this.borrowerFacDetails = [];
        if (Array.isArray(refObj.cross_reference)) {
          if (refObj.cross_reference.length > 0) {
            refObj.cross_reference.forEach((refList) => {
              const selectedData = ['child_ref_id'];
              const obj = {};
              Object.keys(refList).forEach((element) => {
                selectedData.forEach((key) => {
                  if (element === key) {
                    obj[FccGlobalConstant.CHANNELREF] = refList[element];
                  }
                });
              });
              this.referenceList.push(obj);
            });
          }
        } else if (typeof refObj.cross_reference === 'object') {
          const selectedData = ['child_ref_id'];
          const obj = {};
          selectedData.forEach((key) => {
            obj[FccGlobalConstant.CHANNELREF] = refObj.cross_reference[key];
          });
          this.referenceList.push(obj);
        }
      }
    }
    if (this.mode === FccGlobalConstant.INITIATE) {
      this.borrowerFacDetails = this.commonService.selectedRows;
    } else {
      if (this.form.get('repricingOldLoansReq') &&
        this.form.get('repricingOldLoansReq').value
      ) {
        const repriceLoanObj = JSON.parse(
          this.form.get('repricingOldLoansReq').value
        );
        if (Array.isArray(repriceLoanObj)) {
          if (repriceLoanObj.length > 0 && this.borrowerFacDetails) {
            const selectedData = [
              'borrower_reference',
              'pricing_option',
              'bo_facility_id',
            ];
            const obj = {};
            selectedData.forEach((key) => {
              obj[key] = repriceLoanObj[0][key];
            });
            this.borrowerFacDetails.push(obj);
          }
        } else if (typeof repriceLoanObj === 'object' && this.borrowerFacDetails) {
          const selectedData = [
            'borrower_reference',
            'pricing_option',
            'bo_facility_id',
          ];
          const obj = {};
          selectedData.forEach((key) => {
            obj[key] = repriceLoanObj[key];
          });
          this.borrowerFacDetails.push(obj);
        }
      }
    }
    if (this.borrowerFacDetails && this.borrowerFacDetails.length > 0) {
      this.pricingOptionLongDesc = this.borrowerFacDetails[0].pricing_option;
      this.getCodeData(this.borrowerFacDetails[0].pricing_option);
      this.patchExtraValues();
      if (this.form.get('facilityDetails') && this.form.get('facilityDetails').value) {
        this.facilityDetails = this.facilityDetailsService.getFacilityDetailsObj();
        this.facilityFcn = this.facilityDetails.fcn;
        this.form.get('createLNButton')[FccGlobalConstant.PARAMS][this.btndisable] = false;
        this.form.updateValueAndValidity();
        this.showSpinner = false;
      }else {
        this.getFacilityDetails(
          this.borrowerFacDetails[0].borrower_reference,
          this.borrowerFacDetails[0].bo_facility_id
        );
      }
      if (
        this.form.get('selectedCcy') &&
        this.form.get('selectedCcy').value &&
        this.facilityDetailsService.getSelectedCurrency() &&
        this.facilityDetailsService.getSelectedCurrency() !== ''
      ) {
        this.curObject = this.facilityDetailsService.getSelectedCurrency();
      }
      if (
        this.form.get('repricingFrequency') &&
        this.form.get('repricingFrequency').value &&
        this.facilityDetailsService.getRepricingFrequency() &&
        this.facilityDetailsService.getRepricingFrequency() !== ''
      ) {
        this.frequencyCodeData = this.facilityDetailsService.getRepricingFrequency();
      }
    }
    this.transactionSubscription.push(forkJoin(
      this.referenceList.map(refId =>
        this.transactionDetailService.fetchTransactionDetails(refId.ref_id).pipe(
          map(result => {
            const bulkArray = [];
            bulkArray.push(result.body);
            this.responseObject.push(result.body);
            return bulkArray;
          })
        )
      )
    ).subscribe((p) => {
      if(p){
        const updatedProviders = [].concat(...p);
        this.bulkLoanListOptions = [];
        this.itemArray = [];
        this.oldLoansAlias = '';
        updatedProviders.forEach(refDetails => {
          this.referenceId.push(refDetails.ref_id);
          this.patchFieldValueAndParameters(this.form.get('borrowerReference'), refDetails.borrower_reference, {});
          this.patchFieldValueAndParameters(this.form.get('dealName'), refDetails.bo_deal_name, {});
          this.patchFieldValueAndParameters(this.form.get('boDealName'), refDetails.bo_deal_name, {});
          this.patchFieldValueAndParameters(this.form.get('dealID'), refDetails.bo_deal_id, {});
          this.patchFieldValueAndParameters(this.form.get('facilityName'), refDetails.bo_facility_name, {});
          this.patchFieldValueAndParameters(this.form.get('entity'), refDetails.entity, {});
          this.patchFieldValueAndParameters(this.form.get('issuingBankAbbvName'), refDetails.issuing_bank[FccGlobalConstant.ABBV_NAME], {});
          this.patchFieldValueAndParameters(this.form.get('issuingBankName'), refDetails.issuing_bank[FccGlobalConstant.NAME], {});
          this.patchFieldValueAndParameters(this.form.get('applicantName'), refDetails.borrower_name, {});
          this.patchFieldValueAndParameters(this.form.get('facCurCode'), refDetails.fac_cur_code, {});
          this.patchFieldValueAndParameters(this.form.get('bkCurCode'), refDetails.ln_cur_code, {});
          this.facilityID = refDetails.bo_facility_id;
          this.facilityName = refDetails.bo_facility_name;
          this.pricingOption = refDetails.pricing_option;
          const selectedData = ['bo_ref_id', 'ln_cur_code', 'ln_liab_amt', 'repricing_date',
                'ref_id', 'effective_date', 'repricing_frequency', 'fx_conversion_rate', 'lnInterest'];
          const obj = {};
          selectedData.forEach(key => {
            Object.keys(refDetails).forEach(ele => {
              if (ele === key) {
                obj[ele] = refDetails[ele];
              } else if (key === 'lnInterest') {
                obj[key] = '';
              }
            });
          });
          this.updatedBulkLoanData.push(obj);
          this.setBulkLoanListOptions(obj);
          const obj1 = {};
          const loanRefId = 'loan_ref_id';
          obj1[loanRefId] = this.referenceId;
          this.patchFieldValueAndParameters(this.form.get('linkedLoans'), JSON.stringify(obj1), {});
          this.parseInterestDueAmtsData();
        });
        const headerLabel = `${this.translateService.instant('selectedLoans')} | ${this.facilityName}`;
        this.bulkLoanListOptions = [{
          header: headerLabel,
          data: this.itemArray
        }];
        if (this.bulkLoanListOptions[0].data.length < 2) {
          this.patchFieldParameters(this.form.get('bulkLoansList'), { nestedHeaderIcon: '' });
        } else {
          this.patchFieldParameters(this.form.get('bulkLoansList'), { nestedHeaderIcon: 'delete_outline' });
        }
        if (
          this.facilityDetailsService.loansAdded &&
          this.facilityDetailsService.loansAdded.ln_tnx_record &&
          this.facilityDetailsService.loansAdded.ln_tnx_record.length > 0
        ) {
          const amountToRollover = this.getAmtToRollover();
          const totalNewLoanAmount = this.getTotalNewLoanAmount();
          if (amountToRollover < totalNewLoanAmount) {
            this.populateRemittanceData();
          }
        }
        this.patchFieldParameters(this.form.get('bulkLoansList'), { options: this.bulkLoanListOptions });
        this.form.get('bulkLoansList').updateValueAndValidity();
        if (this.form.get('remittanceInstructions')) {
          const remittanceInst = JSON.parse(this.form.get('remittanceInstructions').value);
          if (remittanceInst){
            this.form.get('remInstDescription') .setValue(remittanceInst.description);
            this.form.get('remInstAccountNo') .setValue(remittanceInst.account_no);
            this.form.get('remInstServicingGroupAlias') .setValue(remittanceInst.servicing_group_alias);
            const event = {
              description: remittanceInst.description,
              accountNumber: remittanceInst.account_no
            };
            this.form.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] = event;
          }
        }
      }
    }));
  }

  getTotalNewLoanAmount(): any {
    let totalNewLoanAmount: any = 0;
    const tableRecord = this.facilityDetailsService.loansAdded.ln_tnx_record;
    if (tableRecord && tableRecord.length > 0){
      tableRecord.forEach(loan => {
        if (loan && loan.ref_id){
          if (this.findIdInList(loan.ref_id)){
            totalNewLoanAmount = totalNewLoanAmount + Number(this.commonService.replaceCurrency(loan.ln_amt));
          }
        }
      });
    }
    return totalNewLoanAmount;
  }

  getAmtToRollover(): any {
    let amtToRollover: any = 0;
    const tableRecord = this.facilityDetailsService.loansAdded.ln_tnx_record;
    if (tableRecord && tableRecord.length > 0){
      tableRecord.forEach(loan => {
        if (loan && loan.ref_id){
          if (!this.findIdInList(loan.ref_id)){
            amtToRollover = amtToRollover + Number(this.commonService.replaceCurrency(loan.ln_liab_amt));
          }
        }
      });
    }
    return amtToRollover;
  }

  onClickCreateLNButton(isFromEdit: boolean) {
    this.stateService.setStateSection(FccGlobalConstant.LNRPN_GENERAL_DETAILS, this.form);
    const dir: Direction = localStorage.getItem('langDir') as Direction;
    this.createLoanDialogRef = this.dialog.open(CreateNewLoanDialogComponent, {
      width: '55vw',
      height: '60vh',
      id: 'uiCreateLoanDialog',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: false,
      direction: dir,
      data: {
        bulkLoanDataToPopup: this.updatedBulkLoanData,
        bkCurCode: this.bkCurCode,
        responseObject: this.responseObject,
        isFromEdit,
        editLoan: this.loanToEdit,
        curObject: this.curObject,
        frequencyCodeData: this.frequencyCodeData
      }
    });

    this.createLoanDialogRef.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined && result.data !== '' && result.data !== undefined) {
        this.facilityDetailsService.loansAdded = result.data;
        this.setDataToGeneralSection();
        this.loanToEdit = null;
        if (this.facilityDetailsService.loansAdded){
          const tableRecord = this.facilityDetailsService.loansAdded.ln_tnx_record;
          let newArray;
          if (tableRecord){
            if (tableRecord.length > 0) {
              newArray = tableRecord;
              this.form.get('repricingNewLoans').setValidators([]);
              this.form.get('repricingNewLoans').setErrors(null);
              this.form.get('createLNButton').setValidators([]);
              this.form.get('createLNButton').setErrors(null);
            }else {
              newArray = [tableRecord];
            }
          }
          this.buildAmountResponse();
          this.buildTable(newArray);
        }
      }
    }, pipe(
      finalize(() => this.createLoanDialogRef = undefined)));
  }
  onClickPencilIcon(event, key, index, rowData) {
    this.loanToEdit = rowData;
    this.onClickCreateLNButton(true);
  }
  onClickTrashIcon(event, key, index) {
    if (this.newLoansData && this.newLoansData.length > 1){
      const dir = localStorage.getItem('langDir');
      const locaKeyValue = this.translateService.instant('deleteConfirmationMsg');
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        header: `${this.translateService.instant('deleteFile')}`,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir },
        data: { locaKey: locaKeyValue }
      });
      dialogRef.onClose.subscribe((result: any) => {
        if (result.toLowerCase() === 'yes') {
          this.removeSelectedRow(index);
          this.setDataToGeneralSection();
        }
      });
    }
    else {
      const dir = localStorage.getItem('langDir');
      const locaKeyValue = this.translateService.instant('cannotDelinkLoanAsItIsLastLoan');
      const deleteAllRec = this.dialogService.open(ConfirmationDialogComponent, {
        header: `${this.translateService.instant('message')}`,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir },
        data: { locaKey: locaKeyValue,
          showOkButton: true,
          showCancelButton: true,
          showNoButton: false,
          showYesButton: false
        }
      });
      deleteAllRec.onClose.subscribe(() => {
        //eslint : no-empty-function
      });
    }
  }

  removeSelectedRow(index) {
    if (
      this.facilityDetailsService.loansAdded &&
      this.facilityDetailsService.loansAdded.ln_tnx_record &&
      this.facilityDetailsService.loansAdded.ln_tnx_record.length > 0
    ) {
      this.facilityDetailsService.loansAdded.ln_tnx_record.splice(index, 1);
      this.patchFieldValueAndParameters(
        this.form.get('repricingOldLoansInitiate'),
        JSON.stringify(this.facilityDetailsService.loansAdded.ln_tnx_record),
        {}
      );
      this.form.get('repricingOldLoansReq').markAsTouched();
      this.form.get('repricingOldLoansReq').markAsDirty();
      this.form.get('repricingOldLoansReq').updateValueAndValidity();
      this.patchFieldValueAndParameters(
        this.form.get('repricingOldLoansReq'),
        JSON.stringify(this.facilityDetailsService.loansAdded.ln_tnx_record),
        {}
      );
      this.form.get('repricingOldLoansReq').markAsTouched();
      this.form.get('repricingOldLoansReq').markAsDirty();
      this.form.get('repricingOldLoansReq').updateValueAndValidity();
      this.buildTable(this.facilityDetailsService.loansAdded.ln_tnx_record);
      this.buildAmountResponse();
      this.setDataToGeneralSection();
    }
  }

  setDataToGeneralSection() {
    const data = this.patchNewLoanData(true);
    this.patchFieldValueAndParameters(this.form.get('repricingNewLoans'), JSON.stringify(data), {});
    this.form.get('repricingNewLoans').markAsTouched();
    this.form.get('repricingNewLoans').markAsDirty();
    this.form.get('repricingNewLoans').updateValueAndValidity();
  }

  buildAmountResponse(){
    const amountToRollover = this.getAmtToRollover();
    const totalNewLoanAmount = this.getTotalNewLoanAmount();
    if (totalNewLoanAmount > 0){
      const convertedAmount = `${this.currencyConverterPipe.transform(totalNewLoanAmount.toString(), this.bkCurCode)}`;
      const totalNewAmt = `${this.bkCurCode} ${this.currencyConverterPipe.transform(totalNewLoanAmount.toString(), this.bkCurCode)}`;
      this.form.get('totalNewLoanAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.patchFieldValueAndParameters(this.form.get('totalNewLoanAmount'), totalNewAmt, {});
      this.patchFieldValueAndParameters(this.form.get('bkTotalAmt'), convertedAmount, {});
      this.patchFieldValueAndParameters(this.form.get('bkHighestAmt'), convertedAmount, {});
      this.patchFieldValueAndParameters(this.form.get('tnxAmt'), convertedAmount, {});
      this.form.get('totalNewLoanAmount').markAsDirty();
      this.form.get('totalNewLoanAmount').markAsTouched();
      this.form.get('totalNewLoanAmount').updateValueAndValidity();
      if (amountToRollover > totalNewLoanAmount){
        const pricipalPayment = `${
          this.bkCurCode
        } ${this.currencyConverterPipe.transform(
          (amountToRollover - totalNewLoanAmount).toString(),
          this.bkCurCode
        )}`;
        this.form.get('principalPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('increaseAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.patchFieldValueAndParameters(this.form.get('principalPayment'), pricipalPayment, {});
        this.patchFieldValueAndParameters(this.form.get('totalPrincipalPayment'), (amountToRollover - totalNewLoanAmount), {});
        this.patchFieldValueAndParameters(this.form.get('increaseAmount'), '', {});
        this.patchFieldValueAndParameters(this.form.get('adjustPaymentOptions'), 'Y', {});
        this.form.get('principalPayment').markAsDirty();
        this.form.get('principalPayment').markAsTouched();
        this.form.get('principalPayment').updateValueAndValidity();
        this.form.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('remittanceInst').setValidators([]);
        this.form.get('remittanceInst').setErrors(null);
      }else if (amountToRollover < totalNewLoanAmount){
        const increaseAmount = `${
          this.bkCurCode
        } ${this.currencyConverterPipe.transform(
          (totalNewLoanAmount - amountToRollover).toString(),
          this.bkCurCode
        )}`;
        this.form.get('increaseAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('principalPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.patchFieldValueAndParameters(this.form.get('adjustPaymentOptions'), 'N', {});
        this.patchFieldValueAndParameters(this.form.get('increaseAmount'), increaseAmount, {});
        this.patchFieldValueAndParameters(this.form.get('principalPayment'), '', {});
        this.patchFieldValueAndParameters(this.form.get('totalPrincipalPayment'), '', {});
        this.form.get('increaseAmount').markAsDirty();
        this.form.get('increaseAmount').markAsTouched();
        this.form.get('increaseAmount').updateValueAndValidity();
        this.populateRemittanceData();
      } else if (amountToRollover === totalNewLoanAmount) {
        this.form.get('increaseAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('principalPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.patchFieldValueAndParameters(this.form.get('adjustPaymentOptions'), 'N', {});
        this.patchFieldValueAndParameters(this.form.get('increaseAmount'), '', {});
        this.patchFieldValueAndParameters(this.form.get('principalPayment'), '', {});
        this.patchFieldValueAndParameters(this.form.get('totalPrincipalPayment'), '', {});
        this.form.get('increaseAmount').markAsDirty();
        this.form.get('increaseAmount').markAsTouched();
        this.form.get('increaseAmount').updateValueAndValidity();
        this.form.get('principalPayment').markAsDirty();
        this.form.get('principalPayment').markAsTouched();
        this.form.get('principalPayment').updateValueAndValidity();
        this.form.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('remittanceInst').setValidators([]);
        this.form.get('remittanceInst').setErrors(null);
      }
    }else{
      this.hidePopUpData();
    }
  }

  populateRemittanceData() {
    this.remittanceFlag = this.facilityDetailsService.getRemittanceFlagRepricing();
    if (this.remittanceFlag === 'mandatory' || this.remittanceFlag === 'true') {
      this.form.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.setupRemittanceInstructions();
      if (this.bkCurCode) {
        this.setupRemittanceInstructionsBasedOnCurrency();
      }
    } else {
      this.form.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('remittanceInst').setValidators([]);
      this.form.get('remittanceInst').setErrors(null);
    }
  }

  setupRemittanceInstructions() {
    const remittanceInstData = [];
    if (this.facilityDetails && this.facilityDetails.remittanceInstructions &&
      this.facilityDetails.remittanceInstructions.length > 0 ){
      for (const remiInst of this.facilityDetails.remittanceInstructions) {
        const accountNumber = this.commonService.decodeHtml(remiInst.accountNo);
        const currency = this.commonService.decodeHtml(remiInst.currency);
        const description = this.commonService.decodeHtml(remiInst.description);
        const remittanceCurrObj: {
          'accountNumber': string,
          'currency': string,
          'description': string
        } = {
          accountNumber,
          currency,
          description
        };
        remittanceInstData.push(remittanceCurrObj);
      }
    }
    const filteredRecords = remittanceInstData.filter(
      (value, index, array) =>
        array.findIndex((data) => data.description === value.description) === index);
    this.patchFieldParameters(this.form.get('remittanceInst'), { columns: this.getRemittanceColumns() });
    this.patchFieldParameters(this.form.get('remittanceInst'), { data: filteredRecords });
    this.patchFieldParameters(this.form.get('remittanceInst'), { datakey: 'description' });
   }

  setupRemittanceInstructionsBasedOnCurrency() {
    const remittanceInstData = [];
    if (this.facilityDetails && this.facilityDetails.remittanceInstructions &&
      this.facilityDetails.remittanceInstructions.length > 0 ){
      for (const remiInst of this.facilityDetails.remittanceInstructions) {
        if (remiInst.currency === this.bkCurCode) {
          const accountNumber = this.commonService.decodeHtml(remiInst.accountNo);
          const currency = this.commonService.decodeHtml(remiInst.currency);
          const description = this.commonService.decodeHtml(remiInst.description);

          const remittanceInstObj: {
            'accountNumber': string,
            'currency': string,
            'description': string
          } = {
            accountNumber,
            currency,
            description
          };
          remittanceInstData.push(remittanceInstObj);
        }
      }
    }
    const filteredRecords = remittanceInstData.filter(
      (value, index, array) =>
        array.findIndex((data) => data.description === value.description) === index);
    this.patchFieldParameters(this.form.get('remittanceInst'), { columns: this.getRemittanceColumns() });
    this.patchFieldParameters(this.form.get('remittanceInst'), { data: filteredRecords });
    this.patchFieldParameters(this.form.get('remittanceInst'), { datakey: 'description' });
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
      this.setDataToGeneralSection();
    }
  }

  onPanelTableRowUnSelect(event: any) {
    if (event && event.data) {
      this.patchFieldValueAndParameters(this.form.get('remInstDescription'), '', {});
      this.patchFieldValueAndParameters(this.form.get('remInstLocationCode'), '', {});
      this.patchFieldValueAndParameters(this.form.get('remInstServicingGroupAlias'), '', {});
      this.patchFieldValueAndParameters(this.form.get('remInstAccountNo'), '', {});
      if ((this.remittanceFlag === 'mandatory' )
        && this.form.get('remInstDescription') && !this.form.get('remInstDescription').value) {
        this.form.get('remittanceInst').setValidators([Validators.required]);
        this.form.get('remittanceInst').setErrors({ selectRemittanceInstructionError: true });
        this.form.get('remittanceInst').markAsDirty();
      } else {
        this.form.get('remittanceInst').setValidators([]);
        this.form.get('remittanceInst').setErrors(null);
      }
      this.form.get('remittanceInst').updateValueAndValidity();
      this.setDataToGeneralSection();
    }
  }


  patchNewLoanData(isFromCancel: boolean){
    let obj1;
    let newLoan;
    if (!isFromCancel && this.responseObject.length > 0){
      newLoan = {
        new_loan_ref_id: '',
        new_loan_tnx_id: '',
        new_loan_entity: this.responseObject[0].entity,
        new_loan_our_ref: this.form.get('customerReference').value,
        new_loan_deal_name:  this.responseObject[0].bo_deal_name,
        new_loan_deal_id:  this.responseObject[0].bo_deal_id,
        new_loan_facility_name:  this.responseObject[0].bo_facility_name,
        new_loan_facility_id:  this.responseObject[0].bo_facility_id,
        new_loan_pricing_option: this.form.get('pricingOptions').value,
        new_loan_ccy: this.bkCurCode,
        new_loan_outstanding_amt: this.form.get('amount').value,
        new_loan_effective_date: this.form.get('loanEffectiveDate').value,
        new_loan_maturity_date: this.form.get('loanMaturityDate').value,
        new_loan_borrower_reference:  this.responseObject[0].borrower_reference,
        new_loan_repricing_frequency: this.form.get('rollOverFrequency').value,
        new_loan_repricing_date: this.form.get('rollOverDate').value,
        new_loan_repricing_riskType: this.form.get('riskType').value,
        new_loan_fcn: this.facilityDetails ? this.facilityDetails.fcn : this.responseObject[0].fcn,
        new_loan_matchFunding:  this.responseObject[0].match_funding,
        new_fx_conversion_rate:  this.responseObject[0].fx_conversion_rate,
        new_fac_cur_code: this.bkCurCode,
        rem_inst_description: this.form.get('remInstDescription').value,
        rem_inst_location_code: this.form.get('remInstLocationCode').value,
        rem_inst_servicing_group_alias: this.form.get('remInstServicingGroupAlias').value,
        rem_inst_account_no: this.form.get('remInstAccountNo').value
      };
    }
    if (this.facilityDetailsService.loansAdded && this.facilityDetailsService.loansAdded.ln_tnx_record
      && this.facilityDetailsService.loansAdded.ln_tnx_record.length > 0){
      // obj1 = this.facilityDetailsService.loansAdded;
      obj1 = {};
      const lnTnxRecord = 'ln_tnx_record';
      obj1[lnTnxRecord] = [];
      this.facilityDetailsService.loansAdded.ln_tnx_record.forEach(oldLoan => {
        if (this.findIdInList(oldLoan.ref_id)){
          const formattedOldLoan = {
            new_loan_ref_id: oldLoan.ref_id,
            new_loan_tnx_id:  oldLoan.tnx_id,
            new_loan_entity: oldLoan.entity,
            new_loan_our_ref: oldLoan.cust_ref_id,
            new_loan_deal_name: oldLoan.bo_deal_name,
            new_loan_deal_id: oldLoan.bo_deal_id,
            new_loan_facility_name: oldLoan.bo_facility_name,
            new_loan_facility_id: oldLoan.bo_facility_id,
            new_loan_pricing_option: oldLoan.pricing_option,
            new_loan_ccy: this.bkCurCode,
            new_loan_outstanding_amt: oldLoan.ln_amt,
            new_loan_effective_date: oldLoan.effective_date,
            new_loan_maturity_date: oldLoan.maturity_date,
            new_loan_borrower_reference: oldLoan.borrower_reference,
            new_loan_repricing_frequency: oldLoan.repricing_frequency,
            new_loan_repricing_date:  oldLoan.repricing_date,
            new_loan_repricing_riskType: oldLoan.risk_type,
            new_loan_fcn: this.facilityDetails ? this.facilityDetails.fcn : oldLoan.fcn,
            new_loan_matchFunding: oldLoan.match_funding,
            new_fx_conversion_rate: oldLoan.fx_conversion_rate,
            new_fac_cur_code: this.bkCurCode,
            rem_inst_description: this.form.get('remInstDescription').value,
            rem_inst_location_code: this.form.get('remInstLocationCode').value,
            rem_inst_servicing_group_alias: this.form.get('remInstServicingGroupAlias').value,
            rem_inst_account_no: this.form.get('remInstAccountNo').value
          };
          obj1.ln_tnx_record.push(formattedOldLoan);
        }
      });
      if (!isFromCancel){
        obj1.ln_tnx_record.push(newLoan);
      }
    } else {
      obj1 = {};
      const lnTnxRecord = 'ln_tnx_record';
      if (newLoan){
        obj1[lnTnxRecord] = [newLoan];
      }else {
        obj1[lnTnxRecord] = [];
      }
    }
    return obj1;
  }

 getCurrencies(){
    const curRequest: CurrencyRequest = new CurrencyRequest();
    this.transactionSubscription.push(this.commonService.userCurrencies(curRequest).subscribe((response) => {
      if (
        response.errorMessage &&
        response.errorMessage === 'SESSION_INVALID'
      ) {
        this.sessionValidation.IsSessionValid();
      } else {
        const defaultCurrency = response.items.filter(
          (userCurrencyValue) =>
            this.bkCurCode === userCurrencyValue.isoCode
        );
        if (defaultCurrency && defaultCurrency.length > 0) {
          const ccy: [{ label: string; value: any }] = [{
            label: defaultCurrency[0].isoCode,
            value: {
              label: defaultCurrency[0].isoCode,
              iso: `${defaultCurrency[0].isoCode} - ${this.toTitleCase(defaultCurrency[0].name)}`,
              country: defaultCurrency[0].principalCountryCode,
              currencyCode: defaultCurrency[0].isoCode,
              shortName: defaultCurrency[0].isoCode,
              name: defaultCurrency[0].name,
            },
          }];
          if (ccy && ccy.length > 0){
            this.curObject = ccy;
            this.patchFieldValueAndParameters(this.form.get('selectedCcy'), this.curObject, {});
            this.facilityDetailsService.setSelectedCurrency(this.curObject);
          }
        }
      }
    }));
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  buildTable(newArray){
    const arrLength = newArray ? newArray.length : 0;
    this.newLoansData = [];
    if (newArray && arrLength > 1){
      newArray.forEach((loan) => {
        const attachmentResultObj = {
          bankReference: loan.ref_id,
          loanType: loan.pricing_option,
          ccy: loan.ln_cur_code,
          newAmount: loan.ln_amt,
          rollOverDate: loan.repricing_date
        };
        if (loan && loan.ref_id && this.findIdInList(loan.ref_id)){
          this.newLoansData.push(attachmentResultObj);
        }
      });
      if(this.newLoansData.length > 0) {
        this.form.get('newLoansTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.patchFieldParameters(this.form.get('newLoansTable'), {
          columns: this.getColumns(),
        });
        this.patchFieldParameters(this.form.get('newLoansTable'), {
          data: this.newLoansData,
        });
        this.patchFieldParameters(this.form.get('newLoansTable'), {
          hasData: true,
        });
      } else {
        this.form.get('newLoansTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('newLoansTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.patchFieldParameters(this.form.get('newLoansTable'), {
          columns: []
        });
        this.patchFieldParameters(this.form.get('newLoansTable'), { hasData: false });
      }
    }else {
      this.form.get('newLoansTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.patchFieldParameters(this.form.get('newLoansTable'), {
        columns: []
      });
      this.patchFieldParameters(this.form.get('newLoansTable'), { hasData: false });
    }
  }

  findIdInList(refId): boolean{
    const index = this.referenceList.findIndex(refObj => (refObj.ref_id === refId.toString()));
    if (index > -1 ){
      return false;
    }else {
      return true;
    }
  }

  getRemittanceColumns() {
    return [
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
  }

  getColumns() {
    this.tableColumns = [];
    this.tableColumns = [
      {
        field: 'bankReference',
        header: `${this.translateService.instant('channelReference')}`,
        width: '25%',
      },
      {
        field: 'loanType',
        header: `${this.translateService.instant('pricingOptions')}`,
        width: '15%',
      },
      {
        field: 'ccy',
        header: `${this.translateService.instant('ccy')}`,
        width: '15%',
      },
      {
        field: 'newAmount',
        header: `${this.translateService.instant('newAmount')}`,
        width: '20%',
        direction: 'right',
      },
      {
        field: 'rollOverDate',
        header: `${this.translateService.instant('rollOverDate')}`,
        width: '15%',
      }
    ];
    return this.tableColumns;
  }

  getCodeData(pricingOption: string){
    this.codeData.codeId = FccGlobalConstant.CODEDATA_PRICING_OPTION_CODES_C030;
    this.codeData.productCode = FccGlobalConstant.PRODUCT_LN;
    this.codeData.subProductCode = '';
    this.codeData.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
      localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
    this.transactionSubscription.push(
      this.commonService
        .getCodeDataDetails(this.codeData)
        .subscribe((response) => {
          response.body.items.forEach((responseValue) => {
            if (responseValue.value === pricingOption) {
              this.pricingOptionLongDesc = responseValue.longDesc;
            }
          });
        })
    );
  }

  setBulkLoanListOptions(outstandingAliasInfo: any) {
      this.itemArray.push({
        options: this.getNestedAccordion(this.pricingOptionLongDesc, outstandingAliasInfo),
        nestedAccordion: true,
        labelStyle: ['label-header']
      });
      const totalAmtRepricedWithCur = `${this.bkCurCode} ${this.currencyConverterPipe.transform(
        String(this.totalAmtRepriced), this.bkCurCode)}`;
      this.patchFieldValueAndParameters(this.form.get('totalRepricedAmt'), totalAmtRepricedWithCur, {});
      if (!this.facilityDetailsService.loansAdded) {
        const lnTnxRecord = 'ln_tnx_record';
        if (this.form.get('repricingOldLoansReq') && this.form.get('repricingOldLoansReq').value){
          this.facilityDetailsService.loansAdded = {};
          this.facilityDetailsService.loansAdded[lnTnxRecord] = JSON.parse( this.form.get('repricingOldLoansReq').value);
        }else if (this.form.get('repricingOldLoansInitiate') && this.form.get('repricingOldLoansInitiate').value){
          this.facilityDetailsService.loansAdded = {};
          this.facilityDetailsService.loansAdded[lnTnxRecord] = JSON.parse( this.form.get('repricingOldLoansInitiate').value);
        }
      }
      if (
        this.facilityDetailsService.loansAdded &&
        this.facilityDetailsService.loansAdded.ln_tnx_record &&
        this.facilityDetailsService.loansAdded.ln_tnx_record.length > 0
      ) {
        const filteredRecords = this.facilityDetailsService.loansAdded.ln_tnx_record.filter(
                (value, index, array) => array.findIndex((data) => data.ref_id === value.ref_id) === index);
        this.facilityDetailsService.loansAdded.ln_tnx_record = [];
        this.facilityDetailsService.loansAdded.ln_tnx_record = filteredRecords;
        this.buildTable(this.facilityDetailsService.loansAdded.ln_tnx_record);
        this.buildAmountResponse();
      }
      if (!this.isCalledAgain) {
        this.isCalledAgain = true;
        this.setCommonData();
      }
      this.form.updateValueAndValidity();
  }

  public setCommonData() {
    this.setDataToGeneralSection();
    if (
      this.form.get('selectedCcy') &&
      this.form.get('selectedCcy').value &&
      this.facilityDetailsService.getSelectedCurrency() &&
      this.facilityDetailsService.getSelectedCurrency() !== ''
    ) {
      this.curObject = this.facilityDetailsService.getSelectedCurrency();
    } else {
      this.getCurrencies();
    }
    if (
      this.form.get('repricingFrequency') &&
      this.form.get('repricingFrequency').value &&
      this.facilityDetailsService.getRepricingFrequency() &&
      this.facilityDetailsService.getRepricingFrequency() !== ''
    ) {
      this.frequencyCodeData = this.facilityDetailsService.getRepricingFrequency();
    } else {
      this.getCodeDataDetails();
    }
  }

  protected getNestedAccordion(pricingOption: string, outstandingAliasInfo: any) {
    this.innerControlArray = [];
    const subHeaderLabel = `${pricingOption} | ${outstandingAliasInfo.bo_ref_id}`;
    if (this.oldLoansAlias) {
      this.oldLoansAlias = this.oldLoansAlias.concat(FccGlobalConstant.COMMA);
    }
    this.oldLoansAlias = this.oldLoansAlias.concat(outstandingAliasInfo.bo_ref_id);
    this.patchFieldValueAndParameters(this.form.get('repricingOldLoanAliases'), this.oldLoansAlias, {});
    const amt = this.commonService.replaceCurrency(outstandingAliasInfo.ln_liab_amt);
    const valueupdated = this.currencyConverterPipe.transform(amt, outstandingAliasInfo.ln_cur_code);
    this.bkCurCode = outstandingAliasInfo.ln_cur_code;
    const subDescLabel = `${outstandingAliasInfo.ln_cur_code} ${outstandingAliasInfo.ln_liab_amt}`;
    this.totalAmtRepriced += Number(this.commonService.replaceCurrency(valueupdated));
    if(this.form){
      let amt = this.commonService.replaceCurrency('0');
      amt = this.currencyConverterPipe.transform(amt.toString(), this.bkCurCode);
      this.patchFieldValueAndParameters(this.form.get('bkTotalAmt'), amt, {});
      this.patchFieldValueAndParameters(this.form.get('bkHighestAmt'), amt, {});
      this.patchFieldValueAndParameters(this.form.get('tnxAmt'), amt, {});
    }
    for (const [key, loanValue] of Object.entries(outstandingAliasInfo)) {
      if (key !== 'bo_ref_id' && key !== 'ln_cur_code' && key !== 'ln_liab_amt' && key !== 'lnInterest'
          && key !== 'repricing_frequency') {
        this.innerControlArray.push({
          label: `${this.translateService.instant(key)}`,
          value: loanValue,
          valueStyle: ['fieldvalue']
        });
      }
      if (key === 'repricing_frequency') {
        this.innerControlArray.push({
          label: `${this.translateService.instant(key)}`,
          value: this.translateService.instant('repricingFrequency_' + loanValue),
          valueStyle: ['fieldvalue']
        });
      }
      if (key === 'lnInterest') {
        this.innerControlArray.push({
          label: `${this.translateService.instant(key)}`,
          value: loanValue,
          valueStyle: ['fieldvalue'],
          fieldIcon: 'remove_red_eye',
          fieldIconTitle: 'viewInterestDetails',
          fieldIconStyle: 'eyeIconStyle',
          params: {
            boRefId: outstandingAliasInfo.bo_ref_id,
            loanCCY: outstandingAliasInfo.ln_cur_code,
            channelReference: outstandingAliasInfo.ref_id
          }
        });
      }
    }
    return [{ header: subHeaderLabel, data: this.innerControlArray, description: subDescLabel }];
  }

  fieldIconClick(event, sectionName, params?: {
    channelReference: string,
    boRefId: string,
    loanCCY: string,
  }) {
    const header = this.translateService.instant('interestDetails') + ' | ' + params.boRefId;

    const data = {
      boRefId: params.boRefId,
      loanCCY: params.loanCCY
    };

    const dir = localStorage.getItem('langDir');
    this.dialogService.open(InterestDetailsPopupComponent, {
      header,
      data,
      width: '75vw',
      contentStyle: {
        height: '65vh',
        overflow: 'auto',
        backgroundColor: '#fff'
      },
      styleClass: 'interestDetailsPopup',
      showHeader: true,
      baseZIndex: 9999,
      autoZIndex: true,
      dismissableMask: false,
      closeOnEscape: true,
      style: { direction: dir }
    });
  }

  nestedHeaderIconClick(event: any, controlName: any, rowData: { value: number; }[]) {
    this.totalAmtRepriced = 0;
    this.bulkLoanListOptions = [];
    this.itemArray = [];
    this.oldLoansAlias = '';
    this.removeElementFromObjectArray(rowData[1].value);
    if (this.updatedBulkLoanData.length > 0) {
      this.updatedBulkLoanData.forEach(obj => this.setBulkLoanListOptions(obj));
    }
    const headerLabel = `${this.translateService.instant('selectedLoans')} | ${this.facilityName}`;
    this.bulkLoanListOptions = [{
      header: headerLabel,
      data: this.itemArray
    }];
    if (this.bulkLoanListOptions[0].data.length < 2) {
      this.patchFieldParameters(this.form.get('bulkLoansList'), { nestedHeaderIcon: '' });
    } else {
      this.patchFieldParameters(this.form.get('bulkLoansList'), { nestedHeaderIcon: 'delete_outline' });
    }
    this.patchFieldParameters(this.form.get('bulkLoansList'), { options: this.bulkLoanListOptions });
    this.form.get('bulkLoansList').updateValueAndValidity();
    const obj1 = {};
    const loanRefId = 'loan_ref_id';
    obj1[loanRefId] = this.referenceId;
    this.patchFieldValueAndParameters(this.form.get('linkedLoans'), JSON.stringify(obj1), {});
    this.form.updateValueAndValidity();
  }

  removeElementFromObjectArray(key: number) {
    this.updatedBulkLoanData.forEach((value, index) => {
      if (value.ref_id === key) {
        this.updatedBulkLoanData.splice(index, 1);
      }
    });
    if (this.commonService.selectedRows && this.commonService.selectedRows.length > 0) {
      this.commonService.selectedRows.forEach((ele, index) => {
        if (ele.ref_id === key) {
          this.commonService.selectedRows.splice(index, 1);
        }
      });
    }
    Object.keys(this.referenceId).forEach(index => {
      if (this.referenceId[index] === key) {
        this.referenceId.splice(index, 1);
      }
    });
    if (this.facilityDetailsService.loansAdded &&
        this.facilityDetailsService.loansAdded.ln_tnx_record &&
        this.facilityDetailsService.loansAdded.ln_tnx_record.length > 0) {
          this.facilityDetailsService.loansAdded.ln_tnx_record.forEach((element, index) => {
        if (element.ref_id === key) {
          this.facilityDetailsService.loansAdded.ln_tnx_record.splice(index, 1);
        }
      });
    }
    if (this.form.get('childRefIDs') && this.form.get('childRefIDs').value ) {
      const refObj = JSON.parse(this.form.get('childRefIDs').value);
      if (refObj && refObj.cross_reference && refObj.cross_reference.length > 0) {
        refObj.cross_reference.forEach((ele, index) => {
          if (ele.child_ref_id === key) {
            refObj.cross_reference.splice(index, 1);
          }
        });
        this.patchFieldValueAndParameters(this.form.get('childRefIDs'), JSON.stringify(refObj.cross_reference), {});
      }
    }
    if (this.form.get('repricingOldLoansReq') && this.form.get('repricingOldLoansReq').value ) {
      const refObj = JSON.parse(this.form.get('repricingOldLoansReq').value);
      if (refObj && refObj.length > 0) {
        refObj.forEach((ele, index) => {
          if (ele.child_ref_id === key) {
            refObj.cross_reference.splice(index, 1);
          }
        });
        this.patchFieldValueAndParameters(this.form.get('repricingOldLoansReq'), JSON.stringify(refObj), {});
      }
    }
  }

  holdErrors() {
    if (this.form && this.form.get('repricingNewLoans') && this.form.get('createLNButton')) {
      if (this.form.get('repricingNewLoans').value && JSON.parse(this.form.get('repricingNewLoans').value).ln_tnx_record
          && JSON.parse(this.form.get('repricingNewLoans').value).ln_tnx_record.length > 0) {
        this.form.get('repricingNewLoans').setValidators([]);
        this.form.get('repricingNewLoans').setErrors(null);
        this.form.get('createLNButton').setValidators([]);
        this.form.get('createLNButton').setErrors(null);
      } else {
        this.form.get('repricingNewLoans').setValidators([Validators.required]);
        this.form.get('repricingNewLoans').setErrors({ required: true });
        this.form.get('repricingNewLoans').markAsDirty();
        this.form.get('createLNButton').setValidators([Validators.required]);
        this.form.get('createLNButton').setErrors({ createLNButton: true });
        this.form.get('createLNButton').markAsDirty();
      }
    }
  }

  parseInterestDueAmtsData() {
    let interestPaymentArray: any = [];
    if (this.stateService.getSectionData(FccGlobalConstant.LNRPN_INTEREST_PAYMENT)
    .get('getInterestDueAmts') && this.stateService.getSectionData(FccGlobalConstant.LNRPN_INTEREST_PAYMENT)
    .get('getInterestDueAmts').value) {
      const getInterestDueAmts = JSON.parse(this.stateService.getSectionData(FccGlobalConstant.LNRPN_INTEREST_PAYMENT)
      .get('getInterestDueAmts').value);
      const getCycleStartDates = JSON.parse(this.stateService.getSectionData(FccGlobalConstant.LNRPN_INTEREST_PAYMENT)
      .get('getCycleStartDates').value);
      if (Array.isArray(getInterestDueAmts)) {
        const interestDueAmts = getInterestDueAmts.map(item => ({
            loan_alias: item.loan_alias,
            amt: parseFloat(item.value).toFixed(FccGlobalConstant.LENGTH_2)
          }));
        const cycleStartDates = getCycleStartDates.map(item => ({
            loan_alias: item.loan_alias,
            date: item.value
          }));
        const interestArray1 = this.mergeArray(interestDueAmts, cycleStartDates, 'loan_alias');
        interestPaymentArray = interestArray1.map((item) => ({
              alias: item.loan_alias,
              currency: this.bkCurCode,
              disable: false,
              current_cycle_start_date: item.date,
              totalProjectedEOCamt: item.amt,
            }));
      } else {
        if (getInterestDueAmts && getInterestDueAmts.loan_alias !== undefined) {
          interestPaymentArray = [
            {
              alias: getInterestDueAmts.loan_alias,
              currency: this.bkCurCode,
              disable: false,
              current_cycle_start_date: getCycleStartDates.value,
              totalProjectedEOCamt: getInterestDueAmts.value
            }
          ];
        }
      }
      this.patchInterestDataForPayload(interestPaymentArray);
    }
  }

  patchInterestDataForPayload(arr) {
    if (arr && arr.length > 0) {

      arr = arr.map(item => ({
          alias: item.alias,
          currency: item.currency,
          disable: false,
          current_cycle_start_date: item.current_cycle_start_date,
          totalProjectedEOCamt: parseFloat(this.commonService.replaceCurrency(item.totalProjectedEOCamt.toString()))
        }));

      const newArray = this.interestPaymentArrayMap(arr);

      const arrayObj = arr.map(item => ({
          loanAlias: item.alias,
          interesteDueAmt: item.totalProjectedEOCamt,
          cycleStartDate: item.current_cycle_start_date // need to change start date
        }));
      const obj1 = {};
      const interestPayment = 'interestPayment';
      obj1[interestPayment] = arrayObj;
      this.patchFieldValueAndParameters(this.stateService.getSectionData(FccGlobalConstant.LNRPN_INTEREST_PAYMENT)
      .get('interestPaymentData'), JSON.stringify(obj1), {});
      this.stateService.getSectionData(FccGlobalConstant.LNRPN_INTEREST_PAYMENT)
      .get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] = newArray;
    } else if (arr && arr.length <= 0) {
      const obj1 = {};
      this.patchFieldValueAndParameters(this.stateService.getSectionData(FccGlobalConstant.LNRPN_INTEREST_PAYMENT)
      .get('interestPaymentData'), JSON.stringify(obj1), {});
      this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] = [];
    }
  }

  interestPaymentArrayMap(arr: any) {
    return arr.map(item => ({
        alias: item.alias,
        currency: item.currency,
        disable: false,
        current_cycle_start_date: item.current_cycle_start_date,
        totalProjectedEOCamt: this.currencyConverterPipe.transform(item.totalProjectedEOCamt.toString(), item.currency)
      }));
  }


  mergeArray(a1, a2, key) {
    return a1.map(itm => ({
          ...a2.find((item) => (item[key] === itm[key]) && item),
          ...itm
      }));
  }

  ngOnDestroy() {
    this.facilityDetailsService.loansAdded = undefined;
    this.facilityDetails = undefined;
    this.curObject = undefined;
    this.frequencyCodeData = undefined;
    if (this.transactionSubscription && this.transactionSubscription.length > 0){
      this.transactionSubscription.forEach(sub => {
        sub.unsubscribe();
      });
    }
    this.holdErrors();
    this.stateService.setStateSection(FccGlobalConstant.LNRPN_GENERAL_DETAILS, this.form);
  }
}
