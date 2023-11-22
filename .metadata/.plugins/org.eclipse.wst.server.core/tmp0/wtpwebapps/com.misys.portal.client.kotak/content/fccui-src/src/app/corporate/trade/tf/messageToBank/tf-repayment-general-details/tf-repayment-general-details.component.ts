import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { AccountDetailsList } from '../../../../../common/model/accountDetailsList';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { CorporateCommonService } from '../../../../../corporate/common/services/common.service';
import { LeftSectionService } from '../../../../../corporate/common/services/leftSection.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { TfProductComponent } from '../../initiation/tf-product/tf-product/tf-product.component';
import { PhrasesService } from './../../../../../common/services/phrases.service';
import { CurrencyConverterPipe } from './../../../lc/initiation/pipes/currency-converter.pipe';
import { TfProductService } from '../../services/tf-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { TransactionDetailService } from './../../../../../common/services/transactionDetail.service';
import { ProductMappingService } from './../../../../../common/services/productMapping.service';
import { LcConstant } from '../../../lc/common/model/constant';
@Component({
  selector: 'app-tf-repayment-general-details',
  templateUrl: './tf-repayment-general-details.component.html',
  styleUrls: ['./tf-repayment-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TfRepaymentGeneralDetailsComponent }]
})
export class TfRepaymentGeneralDetailsComponent extends TfProductComponent implements OnInit, OnDestroy, AfterViewInit {

  form: FCCFormGroup;
  module = `${this.translateService.instant('tfRepay')}`;
  contextPath: any;
  refId: any;
  option: any;
  subTnxTypeCode: any;
  params = FccGlobalConstant.PARAMS;
  rendered = FccGlobalConstant.RENDERED;
  readonly = FccGlobalConstant.READONLY;
  settlementAccountList = [];
  accounts = [];
  entityName: any;
  entityNameRendered: any;
  accountDetailsList: AccountDetailsList;
  entitiesList: any;
  val: any;
  repayAmount: any;
  tnxIdRepay: any;
  isStaticAccountEnabled: boolean;
  mode: any;
  lcConstant = new LcConstant();
  options = this.lcConstant.options;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService,
              protected prevNextService: PrevNextService, protected utilityService: UtilityService,
              protected saveDraftService: SaveDraftService, protected searchLayoutService: SearchLayoutService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected stateService: ProductStateService, protected route: ActivatedRoute,
              protected eventEmitterService: EventEmitterService, public fccGlobalConstantService: FccGlobalConstantService,
              public uploadFile: FilelistService, protected corporateCommonService: CorporateCommonService,
              protected phrasesService: PhrasesService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected resolverService: ResolverService,
              protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
              protected tfProductService: TfProductService, protected transactionDetailService: TransactionDetailService,
              protected productMappingService: ProductMappingService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, uploadFile, dialogRef, currencyConverterPipe,
      tfProductService);
}


ngOnInit(): void {
  super.ngOnInit();
  this.contextPath = this.fccGlobalConstantService.contextPath;
  this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
  this.option = this.commonService.getQueryParametersFromKey('option');
  this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
  this.tnxIdRepay = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_ID);
  this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
  if (this.commonService.referenceId === undefined) {
    sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
  }
  this.initializeFormGroup();
  this.entityName = this.form.get("applicantEntity") ? this.form.get("applicantEntity").value : "";
  this.getAccounts();
}

initializeFormGroup() {
  const sectionName = 'tfRepay';
  this.form = this.stateService.getSectionData(sectionName);
  this.commonService.formatForm(this.form);
  this.form.get('parentTnxId').setValue(this.tnxIdRepay);
  const subTnx = this.form.get('subTnxTypeCode').value;
  if (subTnx === undefined || subTnx === '' || subTnx === null) {
      this.form.get('subTnxTypeCode').setValue(this.subTnxTypeCode);
  }
  this.subTnxTypeCode = this.form.get('subTnxTypeCode').value;
  if (this.subTnxTypeCode === undefined || this.subTnxTypeCode === '' || this.subTnxTypeCode === null
    || this.subTnxTypeCode === FccGlobalConstant.REPAY_OPTION) {
    this.form.get(FccGlobalConstant.TF_REQUEST_OPTIONS).setValue('fullFinalPayment');
    this.form.get('repayMode')[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.TF_PAYMENT_OPTIONS)[this.params][this.rendered] = false;
    if (this.mode !== 'DRAFT' && this.subTnxTypeCode === FccGlobalConstant.REPAY_OPTION) {
    this.form.get('repayAmt').setValue(this.form.get(FccGlobalConstant.TF_OUTSTANDING_AMT).value);
    }
    this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.TF_INTRST_AMT), null, { readonly: true });
  } else {
    this.form.get(FccGlobalConstant.TF_REQUEST_OPTIONS).setValue(FccGlobalConstant.TF_PARTIAL_PAYMENT_TYPE);
    this.form.get('repayMode')[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.TF_PAYMENT_OPTIONS)[this.params][this.rendered] = true;
    this.onClickPartialPayOptions();
    this.form.get('repayAmt')[this.params][this.readonly] = false;
  }
  if (this.mode === 'DRAFT') {
    const repayFinAmt = this.form.get('repayFinAmount').value;
    this.form.get(FccGlobalConstant.TF_OUTSTANDING_AMT).setValue(repayFinAmt);
  }
  this.repayAmount = this.form.get('repayAmt').value;
  if (parseFloat(this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.TF_OUTSTANDING_AMT).value)) ===
        parseFloat(this.commonService.replaceCurrency(this.repayAmount))) {
    this.form.get('standingAmount').setValue('0');
  }
  this.form.get(FccGlobalConstant.TF_OUTSTND_CUR_CODE).setValue(this.form.get(FccGlobalConstant.CURRENCY).value);
  this.form.get(FccGlobalConstant.TF_REPAYMENT_CUR_CODE).setValue(this.form.get(FccGlobalConstant.CURRENCY).value);
  this.form.get(FccGlobalConstant.TF_INTEREST_CUR_CODE).setValue(this.form.get(FccGlobalConstant.CURRENCY).value);

  if (this.commonService.isNonEmptyField(FccGlobalConstant.SETTLEMENT_MODE, this.form) &&
   this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.SETTLEMENT_MODE).value &&
   this.form.get(FccGlobalConstant.SETTLEMENT_MODE).value !== FccGlobalConstant.EMPTY_STRING)) {
    this.setSettlementModeValue();
  }
  this.onBlurRepayAmt();
}

  initializeFormToDetailsResponse(response: any) {
    this.form.get(FccGlobalConstant.PARENT_REF).patchValue(response);
    this.form.get('requestOptionsTF')[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.PARENT_REF)[this.params][this.rendered] = false;
    this.form.updateValueAndValidity();
  }

onClickRequestTypeOptions() {
  if (this.form.get(FccGlobalConstant.TF_REQUEST_OPTIONS).value === 'fullFinalPayment') {
    this.form.get('repayMode')[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.TF_PAYMENT_OPTIONS)[this.params][this.rendered] = false;
    this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.TF_INTRST_AMT), null, { readonly: true });
    this.form.get('standingAmount').setValue('0');
    this.form.get(FccGlobalConstant.TF_OUTSTND_CUR_CODE).setValue(this.form.get('currency').value);
    this.form.get('repayAmt').setValue(this.form.get(FccGlobalConstant.TF_OUTSTANDING_AMT).value);
    this.form.get('repayAmt')[this.params][this.readonly] = true;
    this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.REPAY_OPTION);
  } else {
    this.form.get('repayMode')[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.TF_PAYMENT_OPTIONS)[this.params][this.rendered] = true;
    this.onClickPartialPayOptions();
    this.form.get('repayAmt')[this.params][this.readonly] = false;
    this.form.get('subTnxTypeCode').setValue(FccGlobalConstant.REPAY_OPTION_PARTIAL_PAYMENT);
  }
  this.form.updateValueAndValidity();
}

onClickPartialPayOptions() {
  const partialPayOptions = this.form.get(FccGlobalConstant.TF_PAYMENT_OPTIONS).value;
  if (partialPayOptions === FccGlobalConstant.CODE_01) {
    this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.TF_INTRST_AMT), null, { readonly: true });
  } else {
    const intAmt = this.form.get(FccGlobalConstant.TF_INTRST_AMT).value;
    if (intAmt !== undefined && intAmt !== null && intAmt !== '') {
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.TF_INTRST_AMT),
       parseFloat(this.form.get(FccGlobalConstant.TF_INTRST_AMT).value), { readonly: false });
    } else {
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.TF_INTRST_AMT), null, { readonly: false });
    }
  }
}


saveFormOject() {
  this.stateService.setStateSection('tfRepay', this.form);
}
onClickNext() {
  this.saveFormOject();
  if (!CommonService.isTemplateCreation) {
    this.leftSectionService.addSummarySection();
    this.saveDraftService.changeSaveStatus('tfRepay',
      this.stateService.getSectionData('tfRepay'));
  }
  if (this.form.valid && !CommonService.isTemplateCreation) {
    this.leftSectionService.addSummarySection();
  }
  if (this.form.invalid) {
    this.leftSectionService.removeSummarySection();
  }

}

getAccounts() {
  const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
  this.isStaticAccountEnabled = this.commonService.getIsStaticAccountEnabled();
  if (this.isStaticAccountEnabled) {
    this.corporateCommonService.getStaticAccounts(this.fccGlobalConstantService.getStaticDataLimit(), productCode)
      .subscribe(response => {
          this.updateAccounts(response.body);
      });
  } else {
    this.commonService.getUserProfileAccount(productCode, this.entityName).subscribe(
      accountsResponse => {
        this.updateAccounts(accountsResponse);
      });
  }
}

updateAccounts(body: any) {
  this.accountDetailsList = body;
  let emptyCheck = true;
  this.accountDetailsList.items.forEach(value => {
    if (emptyCheck) {
      const empty = this.commonService.getEmptyAccount();
      this.accounts.push(empty);
      emptyCheck = false;
    }
    const account = this.commonService.getUpdatedAccount(value);
    this.accounts.push(account);
  });
  this.patchFieldParameters(this.form.get('principalAct'), { options: this.getUpdatedAccounts() });
  let feeAccountsOptions = this.getUpdatedAccounts();
  if(feeAccountsOptions)
  {
    feeAccountsOptions = feeAccountsOptions.filter((item) => item.label !== "");
  }
  this.patchFieldParameters(this.form.get('feeAct'), { options: feeAccountsOptions });
  this.updateBankValue();
  
  if (this.form.get('principalAct')[this.params].required){
    let principalActoptnion = this.getUpdatedAccounts();
  if(principalActoptnion){
    principalActoptnion = principalActoptnion.filter((item) =>item.label !== "");
    this.patchFieldParameters(this.form.get('principalAct'), { options: principalActoptnion });
   }
  }  
  }

  updateBankValue() {
      const principalAct = this.stateService.getValue('tfRepay', 'principalAct', false);
      const feeAct = this.stateService.getValue('tfRepay', 'feeAct', false);
      let exists = this.accounts.filter(
            task => task.label === principalAct);
      if (this.commonService.isnonEMptyString(principalAct) && exists.length > 0) {
          this.form.get('principalAct').setValue(this.accounts.filter(
              task => task.label === principalAct)[0].value);
            }
      exists = this.accounts.filter(
            task => task.label === feeAct);
      if (this.commonService.isnonEMptyString(feeAct) && exists.length > 0) {
          this.form.get('feeAct').setValue(this.accounts.filter(
           task => task.label === feeAct)[0].value);
          }
      this.form.updateValueAndValidity();
  }

getUpdatedAccounts(): any[] {
  return this.accounts;
}
onClickPhraseIcon(event: any, key: any) {
  this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_TF, key);
}
onBlurInterestAmnt() {
  const amt = this.form.get(FccGlobalConstant.TF_INTRST_AMT);
  const currcode = this.form.get('currency').value.currencyCode;
  this.val = amt.value;
  if (currcode !== '') {
    let valueupdated = this.commonService.replaceCurrency(this.val);
    valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), currcode);
    this.form.get(FccGlobalConstant.TF_INTRST_AMT).setValue(valueupdated);
    this.form.get(FccGlobalConstant.TF_INTRST_AMT).updateValueAndValidity();
  }
}

onBlurRepayAmt() {
  const amt = this.form.get('repayAmt');
  const currcode = this.form.get('currency').value;
  this.val = amt.value;
  if (currcode !== '') {
    let valueupdated = this.commonService.replaceCurrency(this.val);
    valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), currcode);
    this.form.get('repayAmt').setValue(valueupdated);
    this.form.get('repayAmt').updateValueAndValidity();
    let OutstandingAmount = 0;
    const outStdAmt = this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.TF_OUTSTANDING_AMT).value);
    const repayAmtValue = this.commonService.replaceCurrency(this.val);
    if (parseFloat(outStdAmt) !== parseFloat(repayAmtValue)) {
      OutstandingAmount = parseFloat(outStdAmt) - parseFloat(repayAmtValue);
      this.form.get('standingAmount').setValue(OutstandingAmount);
    } else {
      this.form.get('standingAmount').setValue('0');
    }
    this.form.get(FccGlobalConstant.TF_OUTSTND_CUR_CODE).setValue(currcode);
  }
  this.validateRepayAmount();
}

validateRepayAmount() {
  let repayAmount = this.form.get('repayAmt').value;
  let OutstandingAmount = this.form.get(FccGlobalConstant.TF_OUTSTANDING_AMT).value;
  repayAmount = parseFloat(this.commonService.replaceCurrency(repayAmount));
  OutstandingAmount = parseFloat(this.commonService.replaceCurrency(OutstandingAmount));
  if (repayAmount <= parseFloat(FccGlobalConstant.REPAYMENT_ZERO)) {
    this.form.get('repayAmt').setErrors({ repayAmtcannotBeZero: true });
    return;
  }
  if (repayAmount > OutstandingAmount) {
    this.form.get('repayAmt').setErrors({ repayAmtexceedsMax: true });
  }

}

setSettlementModeValue() {
  const settlementModeOptions = this.form.get(FccGlobalConstant.SETTLEMENT_MODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
  const settlementModeValue = this.form.get(FccGlobalConstant.SETTLEMENT_MODE).value;
  const exists = settlementModeOptions.filter(task => task.value === settlementModeValue);
  if (exists.length > 0) {
    this.form.get(FccGlobalConstant.SETTLEMENT_MODE).setValue(settlementModeOptions.filter(
      task => task.value === settlementModeValue)[0].value);
  }
}

ngAfterViewInit(): void {
    this.form.get(FccGlobalConstant.TF_INTRST_AMT)[this.params][this.rendered] = true;
    this.form
  .get(FccGlobalConstant.TF_OUTSTANDING_CURCODE_AMT)
  .setValue(
    `${this.form.get(FccGlobalConstant.TF_OUTSTND_CUR_CODE).value} ${
      this.form.get(FccGlobalConstant.TF_OUTSTANDING_AMT).value
    }`
  );
}

ngOnDestroy() {
    if ((this.form.get(FccGlobalConstant.TF_REQUEST_OPTIONS) &&
    this.form.get(FccGlobalConstant.TF_REQUEST_OPTIONS).value !== FccGlobalConstant.TF_PARTIAL_PAYMENT_TYPE)
    || (this.form.get(FccGlobalConstant.TF_PAYMENT_OPTIONS) &&
    this.form.get(FccGlobalConstant.TF_PAYMENT_OPTIONS).value !== FccGlobalConstant.CODE_02 )) {
        this.form.get(FccGlobalConstant.TF_INTRST_AMT)[this.params][this.rendered] = false;
    }
}



}
