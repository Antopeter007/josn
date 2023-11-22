import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CodeData } from '../../../../../../common/model/codeData';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { UiService } from '../../../common/services/ui-service';
import { CurrencyConverterPipe } from '../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ui-cu-general-details',
  templateUrl: './ui-cu-general-details.component.html',
  styleUrls: ['./ui-cu-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiCuGeneralDetailsComponent }]
})
export class UiCuGeneralDetailsComponent extends UiProductComponent implements OnInit {
  [x: string]: any;

  form: FCCFormGroup;
  swiftZChar;
  module = ``;
  codeDataRequest = new CodeData();
  transMode: any;
  option: any;
  maxLength;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected leftSectionService: LeftSectionService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService, protected uiService: UiService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
    super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray, dialogRef, currencyConverterPipe,
      uiProductService);
}

  ngOnInit(): void {
    super.ngOnInit();
    this.initializeFormGroup();
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);

    this.initializeDropdownValues();
    this.transMode = this.productStateService
    .getSectionData(
      FccGlobalConstant.UI_GENERAL_DETAIL,
      undefined,
      this.isMasterRequired
    )
    .get("advSendMode").value;

    this.onClickCuSubProductCode();
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.onClickCuExpDateTypeCode();
    }
    this.onClickCuEffectiveDateTypeCode();
}
  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZChar = response.swiftZChar;
      }
    });
    if (this.form.get('cuNarrativeTransferConditions')) {
      this.maxLength = this.form.get('cuNarrativeTransferConditions')[this.params]['maxlength'];
    }
  }

  onClickCuEffectiveDateTypeCode() {
    // show cuEffectiveDateTypeDetails field , when 04 is selected.
    if (this.form.get(FccTradeFieldConstants.CU_EFFECTIVE_DATE) && this.form.get(FccTradeFieldConstants.CU_EFFECTIVE_DATE).value === '99') {
      this.toggleControls(this.form, ['cuEffectiveDateTypeDetails'], true);
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_EFFECTIVE_DATE], false);
    } else if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND &&
      this.form.get(FccTradeFieldConstants.CU_EFFECTIVE_DATE).value[0] !== undefined &&
      this.form.get(FccTradeFieldConstants.CU_EFFECTIVE_DATE).value[0].value === '99')) {
      this.form.get(FccTradeFieldConstants.CU_EFFECTIVE_DATE_TYPE_DETAILS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccTradeFieldConstants.CU_EFFECTIVE_DATE_TYPE_CODE_LABEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_EFFECTIVE_DATE], false);
    } else {
      this.toggleControls(this.form, ['cuEffectiveDateTypeDetails'], false);

    }
    this.onClickCuEffectiveDateTypeDetails();
  }
  onClickCuEffectiveDateTypeDetails() {
    const effectiveDate = this.form.get('cuEffectiveDateTypeDetails').value;
    let expDate: any;
    if (this.form.get('cuExpDate')) {
      expDate = this.form.get('cuExpDate').value;
      if (this.form.get('cuEffectiveDateTypeCode') && (this.form.get('cuEffectiveDateTypeCode').value === '99' ||
      (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuEffectiveDateTypeCode').value[0] !== undefined &&
         this.form.get('cuEffectiveDateTypeCode').value[0].value === '99'))) {
      this.uiService.calculateCuExpiryDate(effectiveDate, expDate, this.form.get('cuExpDate'));
      } else {
        this.uiService.calculateCuExpiryDate('', expDate, this.form.get('cuExpDate'));
      }
    }
   }

  onClickCuExpDate() {
    this.onClickCuEffectiveDateTypeDetails();
  }

  onClickCuExpDateTypeCode() {
    const formAccordionPanels = this.parentForm.get(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS)[
      FccGlobalConstant.PARAMS
    ][`formAccordionPanels`];

    this.form.get('cuExpDate').clearValidators();
    this.form.get('cuExpDate').updateValueAndValidity();
    if (this.form.get('cuExpDateTypeCode') && (this.form.get('cuExpDateTypeCode').value === '01' ||
    (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuExpDateTypeCode').value[0]
      && this.form.get('cuExpDateTypeCode').value[0].value === '01'))) {
      // this.toggleFormFields(true, this.form, ['bgApproxExpiryDate', 'bgExpEvent']);
      this.toggleControls(this.form, ['cuApproxExpiryDate', 'cuExpEvent'], true);
      this.toggleControls(this.form, ['cuExpDate'], false);
      this.toggleRequired(false, this.form, ['cuExpDate', 'cuExpEvent']);
      // this.toggleControls(this.form, ['bgProjectedExpiryDate'], false);
      this.form.get('cuApproxExpiryDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] =
      `${this.translateService.instant('cuApproxExpiryDate')}`;
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        this.form.get('cuApproxExpiryDate').reset();
        this.form.get('cuExpEvent').reset();
        this.form.get('cuExpDate').reset();
      }
     // Hide Extension Details Section.
      this.toggelFormAccordionPanel(this.parentForm, formAccordionPanels, [FccGlobalConstant.UI_COUNTER_EXTENSION_DETAILS], false);
    } else if (this.form.get('cuExpDateTypeCode') && (this.form.get('cuExpDateTypeCode').value === '03' ||
    (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuExpDateTypeCode').value[0]
     && this.form.get('cuExpDateTypeCode').value[0].value === '03'))) {
      this.toggleControls(this.form, ['cuApproxExpiryDate', 'cuExpEvent'], true);
      this.form.get('cuApproxExpiryDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] =
      `${this.translateService.instant('cuProjectedExpiryDate')}`;
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        this.form.get('cuApproxExpiryDate').reset();
        this.form.get('cuExpEvent').reset();
        this.form.get('cuExpDate').reset();
      }
      this.toggleRequired(false, this.form, ['cuExpEvent']);
      this.toggleControls(this.form, ['cuExpDate'], false);
      this.toggleRequired(false, this.form, ['cuExpDate']);
      this.toggelFormAccordionPanel(this.parentForm, formAccordionPanels, [FccGlobalConstant.UI_COUNTER_EXTENSION_DETAILS], false);
    } else {
      this.toggleControls(this.form, ['cuExpDate'], true);
      this.toggleRequired(false, this.form, ['cuExpDate']);
      if (this.form && this.form.get('cuApproxExpiryDate')) {
        this.toggleControls(this.form, ['cuApproxExpiryDate', 'cuExpEvent'], false);
      }
      if (this.form && this.form.get('cuExpEvent')) {
        this.toggleRequired(false, this.form, ['cuExpEvent']);
      }
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.form.get('cuApproxExpiryDate').reset();
      }
      this.toggelFormAccordionPanel(this.parentForm, formAccordionPanels, [FccGlobalConstant.UI_COUNTER_EXTENSION_DETAILS], true);
    }
  }
  updatecusubprodcode(){
    if (this.form.get('cuSubProductCode').value === null) {
      this.codeDataRequest.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    } else {
      this.codeDataRequest.subProductCode = this.form.get('cuSubProductCode').value;
    }
    this.codeDataRequest.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
    localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';

    const typeOfUndertakingArray = [];
    this.commonService.getCodeDataDetails(this.codeDataRequest).subscribe(response => {
      response.body.items.forEach(responseValue => {
          const typeOfUndertaking: { label: string; value: any } = {
              label: responseValue.longDesc,
              value: responseValue.value
          };
          if (responseValue.value !== '*' && responseValue.value !== '99') {
            typeOfUndertakingArray.push(typeOfUndertaking);
            }
        });
      this.form.get('cuTypeCode')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = typeOfUndertakingArray;
    });
  }
  initializeDropdownValues() {
    this.codeDataRequest.codeId = FccGlobalConstant.CODEDATA_UI_UNDERTAKING_TYPE_CODES_C082;
    this.codeDataRequest.productCode = FccGlobalConstant.PRODUCT_BG;

    const perms = ['bg_dgar_save', 'bg_stby_save', 'bg_depu_save'];
    const eventDataArray = [];
    perms.forEach(perKey => {
      const flag = this.commonService.getUserPermissionFlag(perKey);
      if (flag) {
        const eventData: { label: string; value: any } = {
          label: `${this.translateService.instant(perKey.split('_')[1].toUpperCase().toString())}`,
          value: `${perKey.split('_')[1].toUpperCase().toString()}`
        };
        eventDataArray.push(eventData);
      }
    });
    setTimeout(() => {
      this.form.get('cuSubProductCode')[FccGlobalConstant.OPTIONS] = eventDataArray;
      const val = this.form.get('cuSubProductCode').value;
      if (val === undefined || val === null || val === '') {
        this.form.get('cuSubProductCode').setValue(eventDataArray[0].value);
      }
      this.updatecusubprodcode();
      this.form.updateValueAndValidity();
      }, 1000);
  }

  onClickCuSubProductCode() {
    this.updatecusubprodcode();
    const formAccordionPanels = this.parentForm.get(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS)[
      FccGlobalConstant.PARAMS
    ][`formAccordionPanels`];
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
    const val = this.form.get('cuSubProductCode').value;
    this.form.get('cuSubProductCode').setValue(null);
    this.form.get('cuSubProductCode').setValue(val);
    }
    if (this.form.get('cuSubProductCode') && (this.form.get('cuSubProductCode').value === FccGlobalConstant.STBY ||
    (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuSubProductCode')))) {
      if(this.commonService.isNonEmptyValue(this.form.get('cuSubProductCode').value[0]) &&
      this.form.get('cuSubProductCode').value[0].value === FccGlobalConstant.STBY) {
      this.toggleFormFields(true, this.form, ['confirmationOptions', 'confirmationInstruction', 'cuTransferIndicator']);
      if (this.form.get('cuTransferIndicator') && this.form.get('cuTransferIndicator').value === ' ') {
        this.form.get('cuTransferIndicator').setValue('N');
        this.form.get('cuTransferIndicator').updateValueAndValidity();
      }
      this.onClickCuTransferIndicator();
      this.initializeDropdownValues();
      this.toggelFormAccordionPanel(this.parentForm, formAccordionPanels, [FccGlobalConstant.UI_COUNTER_PAYMENT_DETAILS], true);
    }
    } else {

      if (this.form.get('confirmationOptions')) {
        this.toggleFormFields(false, this.form, ['confirmationOptions']);
      }
      if (this.form.get('confirmationInstruction')) {
        this.toggleFormFields(false, this.form, ['confirmationInstruction']);
      }
      if (this.form.get('cuTransferIndicator')) {
        this.toggleFormFields(false, this.form, ['cuTransferIndicator']);
      }
      if (this.form.get('cuNarrativeTransferConditions')) {
        this.toggleFormFields(false, this.form, ['cuNarrativeTransferConditions']);
      }
      this.toggelFormAccordionPanel(this.parentForm, formAccordionPanels, [FccGlobalConstant.UI_COUNTER_PAYMENT_DETAILS], false);
    }
  }

  onClickConfirmationOptions() {
    this.amountForm =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired).
      get('uiCuAmountChargeDetails');
    if (this.form.get('confirmationOptions') && this.form.get('confirmationOptions').value === '02' ||
    this.form.get('confirmationOptions').value === '01') {
      this.amountForm.get('cuConfirmationChargesLabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
     // this.amountForm.get('cuConfChrgBorneByCode')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.amountForm.get('cuConfirmationChargesToBeneficiary')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;

    } else {
      this.amountForm.get('cuConfirmationChargesLabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
     // this.amountForm.get('cuConfChrgBorneByCode')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.amountForm.get('cuConfirmationChargesToBeneficiary')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
  }

  onClickCuTransferIndicator() {
    if (this.form.get('cuTransferIndicator') && this.form.get('cuTransferIndicator').value === 'Y') {
      this.form.get('cuNarrativeTransferConditions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_TRANSFER_INDICATOR], true);
      if (this.option && this.option !== FccGlobalConstant.TEMPLATE && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        this.form.get('cuNarrativeTransferConditions').setValue('');
      }
      if (this.transMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('cuNarrativeTransferConditions',
        Validators.compose([Validators.maxLength(this.maxLength), Validators.pattern(this.swiftZChar)]), 0);
      }
    } else {
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.CU_TRANSFER_INDICATOR], false);
      this.form.get('cuNarrativeTransferConditions').setValue('');
      this.form.get('cuNarrativeTransferConditions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.clearValidators();
    }
    this.form.updateValueAndValidity();
  }

  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
  }

}
