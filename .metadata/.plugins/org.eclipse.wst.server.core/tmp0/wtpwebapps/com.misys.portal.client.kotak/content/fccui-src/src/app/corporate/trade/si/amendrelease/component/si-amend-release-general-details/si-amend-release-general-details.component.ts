import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { LeftSectionService } from './../../../../../../corporate/common/services/leftSection.service';
import { FccGlobalConstantService } from './../../../../../../common/core/fcc-global-constant.service';
import { SearchLayoutService } from './../../../../../../common/services/search-layout.service';
import { PhrasesService } from './../../../../../../common/services/phrases.service';
import { AmendCommonService } from './../../../../../../corporate/common/services/amend-common.service';
import { CodeDataService } from './../../../../../../common/services/code-data.service';
import { SiProductComponent } from '../../../initiation/component/si-product/si-product.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NarrativeService } from '../../../../../../corporate/trade/lc/initiation/services/narrative.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SaveDraftService } from '../../../../../../corporate/trade/lc/common/services/save-draft.service';
import { ProductMappingService } from '../../../../../../common/services/productMapping.service';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { Validators } from '@angular/forms';
import { releaseAmtGreaterThanAvailableAmt, zeroAmount } from '../../../../../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { CustomCommasInCurrenciesPipe } from '../../../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { ConfirmationService } from 'primeng';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { CurrencyConverterPipe } from '../../../../lc/initiation/pipes/currency-converter.pipe';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-si-amend-release-general-details',
  templateUrl: './si-amend-release-general-details.component.html',
  styleUrls: ['./si-amend-release-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiAmendReleaseGeneralDetailsComponent }]
})

export class SiAmendReleaseGeneralDetailsComponent extends SiProductComponent implements OnInit, AfterViewInit {
  form: FCCFormGroup;
  module = `${this.translateService.instant('siAmendReleaseGeneralDetails')}`;
  contextPath: any;
  tnxTypeCode: any;
  refId: any;
  option: any;
  subTnxTypeCode: any;
  params = FccGlobalConstant.PARAMS;
  rendered = FccGlobalConstant.RENDERED;
  readonly = FccGlobalConstant.READONLY;
  entityName: any;
  val: any;
  amountreplaceregex: any;
  releaseAmountField = 'releaseAmount';
  releaseAmountWithCurrency = 'releaseAmountWithCurrency';
  setReleaseAmtNull: boolean;
  mode;
  currency;
  allowedDecimals;
  lcAmount;
  lcAvailAmount;
  utilizedAmount;
  currencyField = 'currency';
  validatorPattern = FccGlobalConstant.AMOUNT_VALIDATION;
  flagDecimalPlaces;
  constructor(protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService,
              protected commonService: CommonService,
              protected translateService: TranslateService,
              protected codeDataService: CodeDataService,
              protected phrasesService: PhrasesService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected amendCommonService: AmendCommonService,
              protected narrativeService: NarrativeService,
              protected resolverService: ResolverService,
              protected searchLayoutService: SearchLayoutService,
              protected transactionDetailService: TransactionDetailService,
              protected productMappingService: ProductMappingService,
              protected dialogService: DialogService,
              protected leftSectionService: LeftSectionService,
              protected saveDraftService: SaveDraftService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected utilityService: UtilityService, protected siProductService: SiProductService
    ) {
      super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
        searchLayoutService, utilityService, resolverService, fileArray, dialogRef, currencyConverterPipe, siProductService);
}

ngOnInit(): void {
  super.ngOnInit();
  this.contextPath = this.fccGlobalConstantService.contextPath;
  this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
  this.option = this.commonService.getQueryParametersFromKey('option');
  this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
  this.initializeFormGroup();
  this.lcAmount = this.stateService.getValue(FccGlobalConstant.SI_AMEND_RELEASE_GENERAL_DETAILS, 'lcAmount', false);
  this.currency = this.stateService.getValue(FccGlobalConstant.SI_AMEND_RELEASE_GENERAL_DETAILS, 'currency', false);
  this.utilizedAmount = this.stateService.getValue(FccGlobalConstant.SI_AMEND_RELEASE_GENERAL_DETAILS, 'utilizedAmount', false);
  this.lcAvailAmount = this.stateService.getValue(FccGlobalConstant.SI_AMEND_RELEASE_GENERAL_DETAILS, 'lcAvailAmt', false);
  if (this.commonService.isNonEmptyField('currency', this.form)){
    this.form.get('currency')[this.params][this.rendered] = true;
  }
  if (this.commonService.isNonEmptyField(this.releaseAmountField, this.form)){
    this.form.get(this.releaseAmountField)[this.params][this.rendered] = true;
  }
  this.setReleaseAmtNull = false;
  this.form.addFCCValidators(this.releaseAmountField,
      Validators.compose([Validators.required, Validators.pattern(this.validatorPattern)]), 0);
  this.setAmountReplaceReqgex();
  this.populateAmountFields();
}
initializeFormGroup() {
  this.form = this.stateService.getSectionData(FccGlobalConstant.SI_AMEND_RELEASE_GENERAL_DETAILS);
  this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
  this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
  if (this.commonService.isNonEmptyField('tnxCurrency', this.form)){
    this.form.get('tnxCurrency').setValue(this.currency);
  }
  this.commonService.formatForm(this.form);
  if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    this.commonService.getSwiftVersionValue();
  }
  this.form.get(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE).setValue(this.subTnxTypeCode);
  if (this.commonService.isNonEmptyField('releaseRequestDate', this.form)){
    this.form.get('releaseRequestDate').setValue(new Date());
  }
  this.swiftRenderedFields();
}

saveFormOject() {
  this.stateService.setStateSection('siAmendReleaseGeneralDetails', this.form);
}

onClickFullRelease() {
  const toggleValue = this.form.get('fullRelease').value;
  const remainingAvailableAmount = (+parseFloat(this.commonService.replaceCurrency(this.lcAmount))) -
  (+parseFloat(this.commonService.replaceCurrency(this.utilizedAmount)));
  const availableAmount = this.currencyConverterPipe.transform(remainingAvailableAmount.toString(), this.currency);
  this.form.get('availableAmountSI').setValue(this.currency.concat(' ').concat(availableAmount));
  if (toggleValue === FccBusinessConstantsService.NO) {
      this.form.get(this.releaseAmountField).setValue('');
      this.form.get('tnxAmt').setValue('');
      this.form.get(this.releaseAmountField)[this.params][this.readonly] = false;
  } else {
      this.form.get(this.releaseAmountField).setValue(availableAmount);
      this.form.get('tnxAmt').setValue(availableAmount);
      this.form.get(this.releaseAmountField)[this.params][this.readonly] = true;
  }
  this.releaseAmountValidation();
}

populateAmountFields() {
  if (this.utilizedAmount === ''){
    this.utilizedAmount = '0';
  }
  const remainingAvailableAmount = (+parseFloat(this.commonService.replaceCurrency(this.lcAmount))) -
    (+parseFloat(this.commonService.replaceCurrency(this.utilizedAmount)));
  const availableAmount = this.currencyConverterPipe.transform(remainingAvailableAmount.toString(), this.currency);
  const availableAmountFloat = parseFloat(this.commonService.replaceCurrency(availableAmount));
  const lcAmountFloat = parseFloat(this.commonService.replaceCurrency(this.lcAmount));
  const tnxAmt = this.stateService.getValue(FccGlobalConstant.SI_AMEND_RELEASE_GENERAL_DETAILS, this.releaseAmountField, false);
  if (this.mode === 'DRAFT') {
    if (tnxAmt) {
      const tnxAmtFloat = parseFloat(this.commonService.replaceCurrency(tnxAmt));
      if (tnxAmtFloat === availableAmountFloat || tnxAmtFloat === lcAmountFloat) {
        this.form.get('fullRelease').setValue(FccBusinessConstantsService.YES);
        this.setAmountFields(FccBusinessConstantsService.YES, tnxAmt);
      } else {
        this.form.get('fullRelease').setValue(FccBusinessConstantsService.NO);
        this.setAmountFields(FccBusinessConstantsService.NO, tnxAmt);
      }
    } else {
      this.form.get('fullRelease').setValue(FccBusinessConstantsService.NO);
      this.setAmountFields(FccBusinessConstantsService.NO, tnxAmt);
    }
  } else {
    const toggleValue = this.form.get('fullRelease').value;
    if (toggleValue === FccBusinessConstantsService.YES) {
      this.setAmountFields(FccBusinessConstantsService.YES, availableAmount);
    } else {
      this.setAmountFields(FccBusinessConstantsService.NO, tnxAmt);
    }
  }
  if (this.commonService.isNonEmptyField('tnxAmt', this.form)){
    this.form.get('tnxAmt').setValue(tnxAmt);
  }
  this.setReleaseAmtNull = false;
  this.form.get('availableAmountSI').setValue(this.currency.concat(' ').concat(availableAmount));
}

setAmountFields(toggleValue, releaseAmount) {
  this.form.get(this.releaseAmountField).clearValidators();
  this.form.get(this.releaseAmountField).setValue(releaseAmount);
  if (toggleValue === FccBusinessConstantsService.NO) {
    this.form.get(this.releaseAmountField)[this.params][this.readonly] = false;
  } else {
    this.form.get(this.releaseAmountField)[this.params][this.readonly] = true;
  }
  this.releaseAmountValidation();
}

onBlurReleaseAmount() {
  const relAmt = this.form.get(this.releaseAmountField);
  let releaseAmt = relAmt.value;
  releaseAmt = this.commonService.replaceCurrency(releaseAmt);
  releaseAmt = this.currencyConverterPipe.transform(releaseAmt.toString(), this.currency);
  this.form.get(this.releaseAmountField).setValue(releaseAmt);
  relAmt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
  this.setMandatoryField(this.form, this.releaseAmountField, true);
  this.flagDecimalPlaces = 0;
  this.form.get('tnxAmt').setValue(releaseAmt);
  if (releaseAmt !== '') {
    this.releaseAmountValidation();
  } else {
    this.form.get(this.releaseAmountField).markAsDirty();
    this.form.get(this.releaseAmountField).setErrors({ required: true });
  }
}

releaseAmountValidation() {
  this.lcAmount = this.stateService.getValue(FccGlobalConstant.SI_AMEND_RELEASE_GENERAL_DETAILS, 'lcAmount', false);
  const originalLCAmt = this.commonService.replaceCurrency(this.lcAmount);
  const utilizedAmount = this.commonService.replaceCurrency(
    this.stateService.getValue(
      FccGlobalConstant.SI_AMEND_RELEASE_GENERAL_DETAILS,
      "utilizedAmount",
      false
    )
  );
  const availableAmt = +originalLCAmt - +utilizedAmount;
  const availableFloatAmt = parseFloat(availableAmt.toString());
  const releaseAmt = this.form.get(this.releaseAmountField).value;
  const releaseAmtFloatValue = parseFloat(this.commonService.replaceCurrency(releaseAmt));
  if (releaseAmtFloatValue === 0) {
    this.form.get(this.releaseAmountField).clearValidators();
    this.form.addFCCValidators(this.releaseAmountField,
      Validators.compose([Validators.required, zeroAmount]), 0);
    this.form.get(this.releaseAmountField).setErrors({ zeroAmount: true });
    this.form.get(this.releaseAmountField).markAsDirty();
    this.form.get(this.releaseAmountField).markAsTouched();
    this.form.get(this.releaseAmountField).updateValueAndValidity();
  } else if (releaseAmtFloatValue > availableFloatAmt) {
    this.form.get(this.releaseAmountField).clearValidators();
    this.form.addFCCValidators(this.releaseAmountField,
      Validators.compose([Validators.required, releaseAmtGreaterThanAvailableAmt]), 0);
    this.form.get(this.releaseAmountField).setErrors({ releaseAmtGreaterThanAvailableAmt: true });
    this.form.get(this.releaseAmountField).markAsDirty();
    this.form.get(this.releaseAmountField).markAsTouched();
    this.form.get(this.releaseAmountField).updateValueAndValidity();
  } else if (releaseAmtFloatValue > 0 && releaseAmtFloatValue < availableFloatAmt) {
    if (this.form.get(this.releaseAmountField).hasError('invalidAmt')) {
      this.form.get(this.releaseAmountField).setErrors({ invalidAmt: true });
    } else {
      this.form.get(this.releaseAmountField).clearValidators();
      this.form.get(this.releaseAmountField).setValue(releaseAmt);
      this.form.get(this.releaseAmountField).updateValueAndValidity();
    }
  } else if (releaseAmtFloatValue > 0 && releaseAmtFloatValue === availableFloatAmt) {
    this.form.get('fullRelease').setValue(FccBusinessConstantsService.YES);
    this.form.get(this.releaseAmountField)[this.params][this.readonly] = true;
  }
}

ngAfterViewInit() {
  if (this.currency && this.lcAmount){
    this.form.get(FccGlobalConstant.SI_AMEND_RELEASE_LC_AMT).setValue(this.currency.concat(' ').concat(this.lcAmount));
  }
  this.setPayload();
}

setPayload() {
  if (this.commonService.isNonEmptyField(FccGlobalConstant.SI_AMEND_RELEASE_LC_AMT, this.form)){
    let amount = this.form.get(FccGlobalConstant.SI_AMEND_RELEASE_LC_AMT).value;
    const tnxAmt = this.stateService.getValue(FccGlobalConstant.SI_AMEND_RELEASE_GENERAL_DETAILS, this.releaseAmountField, false);
    amount = amount.split(' ');
    this.form.get('currency').setValue(amount[0]);
    this.form.get(FccGlobalConstant.SI_AMEND_RELEASE_LC_AMT).setValue(this.currency.concat(' ').concat(amount[1]));
    this.form.get('tnxAmt').setValue(tnxAmt);
  }
}

setAmountReplaceReqgex() {
  if (localStorage.getItem('language') === 'fr') {
    this.amountreplaceregex = /\s/g;
  } else {
    this.amountreplaceregex = /[^0-9.]/g;
  }
}
swiftRenderedFields() {
  this.commonService.getSwiftVersionValue();
  if (this.commonService.swiftVersion === FccGlobalConstant.SWIFT_2021) {
    if (this.form.get('expiryType').value &&
        this.form.get('expiryType').value !== FccGlobalConstant.BLANK_SPACE_STRING) {
      this.form.get('expiryType')[this.params][this.rendered] = true;
    } else {
      this.form.get(FccGlobalConstant.EXPIRY_TYPE)[this.params][this.rendered] = false;
    }
  } else {
    this.form.get('expiryType')[this.params][this.rendered] = false;
  }
}
}
