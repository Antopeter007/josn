import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { TradeCommonDataService } from './../../../../common/service/trade-common-data.service';
import { Validators } from '@angular/forms';
import { UiService } from '../../../common/services/ui-service';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
@Component({
  selector: 'app-ui-cu-extension-details',
  templateUrl: './ui-cu-extension-details.component.html',
  styleUrls: ['./ui-cu-extension-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiCuExtensionDetailsComponent }]
})
export class UiCuExtensionDetailsComponent extends UiProductComponent implements OnInit {

  form: FCCFormGroup;
  module = ``;
  @Input() parentForm: FCCFormGroup;
  @Input() controlName;
  swiftXChar;
  transmissionMode: any;
  option: any;
  previousCuRenewalTypeValue;
  allExtensionFields;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected confirmationService: ConfirmationService, protected tradeCommonDataService: TradeCommonDataService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef, protected uiService: UiService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray, dialogRef,
                currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.transmissionMode =
      this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined,
        this.isMasterRequired).get('advSendMode').value;
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.initializeFormGroup();
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.initializeDropDownValues();
    this.setFormValidations();
    this.populateDataForCopyFrom();
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.toggleControls(this.form, ['extensionOnLabel'], false);
    }
    this.commonService.responseChipConfirmationDialog$.subscribe(data => {
      if (data && data.action && data.controlName === 'cuRenewalType') {
        this.handleResponse(data);
        this.commonService.responseChipConfirmationDialog$.next(null);
      }
    });
    this.renderFinalExpTip();
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.form.get(FccGlobalConstant.CU_CANCELLATION_DETAILS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  }

  initializeDropDownValues() {
    const cuRenewForPeriod = this.tradeCommonDataService.getPeriodOptions('');
    if (this.form.get('cuRenewForPeriod')) {
      this.form.get('cuRenewForPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = cuRenewForPeriod;
    }
    if (this.form.get('cuRollingRenewForPeriod')) {
      this.form.get('cuRollingRenewForPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = cuRenewForPeriod;
    }


  }

  setFormValidations() {
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
    this.form.addFCCValidators('cuRenewForNb', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('cuRollingDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);
    this.form.addFCCValidators('cuRollingRenewalNb', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('cuAdviseRenewalDaysNb', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('cuRollingCancellationDays', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    const maxLength = this.form.get('cuNarrativeCancellation')[this.params]['maxlength'];
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.swiftXChar = response.swiftXCharacterSet;
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('cuNarrativeCancellation',
        Validators.compose([Validators.maxLength(maxLength), Validators.pattern(this.swiftXChar)]), 0);
      }
    });
  }

  }

  handleResponse(data) {
    if (data.action === 'cancelled') {
      this.form.get(data.controlName).setValue(data.previousValue);
      this.form.get(data.controlName).updateValueAndValidity();
    } else if (data.action === 'toggle') {
      this.selectCuRenewalType();
    } else if (data.action === 'deselect') {
      this.unSelectCuRenewalType(true, data.presentValue);
    }
    this.previousCuRenewalTypeValue = this.form.get(data.controlName).value;
  }


  onClickCuRenewalType(event?) {
    this.allExtensionFields = ['extensionOnLabel', 'cuRenewOnCode', 'cuRenewalCalendarDate',
      'cuExtensionForLabel', 'cuRenewForNb', 'cuRenewForPeriod', 'cuRollingRenewOnCodeLabel', 'cuRollingRenewOnCode',
      'cuRollingDayInMonth', 'cuRollingRenewForNbLabel', 'cuRollingRenewForNb', 'cuRollingRenewForPeriod', 'cuRollingRenewalNb',
      'cuFinalExpiryDate', 'extensionAmountLabel', 'cuRenewAmtCode', 'cuRollingCancellationDays',
      'cuAdviseRenewalLabel', 'cuAdviseRenewalDaysNb'];

    if (this.isChipEvent(event, this.previousCuRenewalTypeValue)) {
      const presentValue = event[FccGlobalConstant.SOURCE][FccGlobalConstant.VALUE];
      const data = {
        controlName: 'cuRenewalType',
        previousValue: this.previousCuRenewalTypeValue,
        presentValue,
        event: true
      };
      this.commonService.openChipConfirmationDialog$.next(data);
    } else {
      this.selectCuRenewalType();
      if (this.form.get('cuRenewalType')) {
        this.previousCuRenewalTypeValue = this.form.get('cuRenewalType').value;
      }
    }
  }

  unSelectCuRenewalType(isEvent: boolean, presentValue: string) {
    this.unSelectButton(isEvent, 'cuRenewalType', presentValue, this.previousCuRenewalTypeValue,
      this.allExtensionFields, this.allExtensionFields);
    this.previousCuRenewalTypeValue = null;
    this.form.get('cuRenewFlag').setValue(null); // clear
    this.form.get('cuRenewOnCode').setValue(null); // clear
    this.renderFinalExpTip();
  }

  selectCuRenewalType() {
    const regularFieldsToShow = ['extensionOnLabel', 'cuRenewOnCode', 'cuExtensionForLabel', 'cuRenewForNb', 'cuRenewForPeriod',
      'cuRollingDayInMonth', 'cuRollingRenewalNb', 'cuFinalExpiryDate', 'extensionAmountLabel', 'cuRenewAmtCode',
      'cuRollingCancellationDays', 'cuAdviseRenewalLabel', 'cuAdviseRenewalDaysNb'];

    const rollingFieldsToShow = ['extensionOnLabel', 'cuRenewOnCode', 'cuExtensionForLabel', 'cuRenewForNb', 'cuRenewForPeriod',
      'cuRollingRenewOnCodeLabel', 'cuRollingRenewOnCode', 'cuRollingRenewForNbLabel', 'cuRollingRenewForNb', 'cuRollingRenewForPeriod',
      'cuRollingRenewalNb', 'cuFinalExpiryDate', 'cuAdviseRenewalLabel', 'cuAdviseRenewalDaysNb', 'extensionAmountLabel', 'cuRenewAmtCode',
      'cuRollingCancellationDays'];

    if (this.form.get('cuRenewalType') && (this.form.get('cuRenewalType').value === '01' ||
      (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuRenewalType').value[0]
      && this.form.get('cuRenewalType').value[0].value === '01'))) {
      // Hide all fields
      this.toggleControls(this.form, this.allExtensionFields, false);
      // remove all validators
      this.removeValidators(this.form, this.allExtensionFields);
      // set all fields are non mandatory
      this.toggleRequired(false, this.form, ['cuRollingRenewOnCode', 'cuRollingRenewForNb', 'cuRollingRenewForPeriod',
        'cuRollingRenewalNb']);
      // Show relevant fields
      this.toggleControls(this.form, regularFieldsToShow, true);
      this.form.get('cuRenewFlag').setValue('Y');
      this.form.get('cuRollingRenewalFlag').setValue('N');
      this.addRequiredValidator(this.form, ['cuRenewForNb', 'cuRenewForPeriod', 'cuRollingRenewalNb']);
      // check validation on form load
      this.markFieldTouchedandDirty(this.form, ['cuRenewForNb', 'cuRenewForPeriod', 'cuRollingRenewalNb']);
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        this.form.get('cuRenewOnCode').setValue('01');
      }
    } else if (this.form.get('cuRenewalType') && (this.form.get('cuRenewalType').value === '02' ||
      (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuRenewalType').value[0]
      && this.form.get('cuRenewalType').value[0].value === '02'))) {
      this.toggleControls(this.form, this.allExtensionFields, false);
      // remove all validators
      this.removeValidators(this.form, this.allExtensionFields);
      this.toggleRequired(false, this.form, ['cuRenewForNb', 'cuRenewForPeriod', 'cuRollingRenewalNb']);

      this.toggleControls(this.form, rollingFieldsToShow, true);
      this.form.get('cuRenewFlag').setValue('Y');
      this.form.get('cuRollingRenewalFlag').setValue('Y');
      this.addRequiredValidator(this.form, ['cuRollingRenewOnCode', 'cuRollingRenewForNb', 'cuRollingRenewForPeriod',
     'cuRollingRenewalNb']);
        // check validation on form load
      this.markFieldTouchedandDirty(this.form, ['cuRollingRenewOnCode', 'cuRollingRenewForNb', 'cuRollingRenewForPeriod',
        'cuRollingRenewalNb']);
      this.form.addFCCValidators('cuRollingRenewalNb', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    }
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.form.get('cuRenewOnCode').setValue('01');
    }
    if (this.form.get('cuFinalExpiryDate')) {
      this.form.get('cuFinalExpiryDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    }
    this.renderFinalExpTip();
    this.form.updateValueAndValidity();
  }

  onClickCuRollingRenewOnCode() {
    if (this.form.get('cuRollingRenewOnCode') && this.form.get('cuRollingRenewOnCode').value === '02') {
      this.toggleControls(this.form, ['cuRollingDayInMonth'], true);
      this.toggleRequired(true, this.form, ['cuRollingDayInMonth']);
    } else {
      this.toggleControls(this.form, ['cuRollingDayInMonth'], false);
      this.toggleRequired(false, this.form, ['cuRollingDayInMonth']);
    }
  }

  onClickCuRenewOnCode() {
    if (this.form.get('cuRenewOnCode') && (this.form.get('cuRenewOnCode').value === '02' ||
     (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuRenewOnCode').value[0]
     && this.form.get('cuRenewOnCode').value[0].value === '02'))) {
      this.toggleControls(this.form, ['cuRenewalCalendarDate'], true);
      this.toggleRequired(true, this.form, ['cuRenewalCalendarDate']);
      this.resetValues(this.form, ['cuFinalExpiryDate']);
      this.form.get('tipCuFinalExpiryDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    } else {
      this.toggleControls(this.form, ['cuRenewalCalendarDate'], false);
      this.toggleRequired(false, this.form, ['cuRenewalCalendarDate']);
      this.uiService.calculateCuFinalExpiryDate();
     // this.uiService.calculateRollingExtFinalExpiryDate();
      this.uiService.cuRollingExtFinalExpiryDate();
      this.renderFinalExpTip();
    }
    this.resetValues(this.form, ['cuRenewalCalendarDate']);
  }

  onChangeCuRollingCancellationDays() {
    if (this.form.get('cuRollingCancellationDays') &&
        (this.form.get('cuRollingCancellationDays').value !== '' && this.form.get('cuRollingCancellationDays').value !== null)) {
      this.toggleControls(this.form, ['cuNarrativeCancellation'], true);
      this.toggleRequired(true, this.form, ['cuNarrativeCancellation']);
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryField(this.form, FccGlobalConstant.CU_NARRATIVE_CANCELLATION, false);
      }
    } else {
      if (this.form.get('cuNarrativeCancellation')) {
        this.toggleControls(this.form, ['cuNarrativeCancellation'], false);
        this.toggleRequired(false, this.form, ['cuNarrativeCancellation']);
        this.form.get('cuNarrativeCancellation').setValue('');
      }
    }
    this.form.updateValueAndValidity();
  }

  onChangeCuRenewForNb() {
    this.uiService.calculateCuFinalExpiryDate();
    this.uiService.cuRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onClickCuRenewForPeriod() {
    this.uiService.calculateCuFinalExpiryDate();
    this.uiService.cuRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onChangeCuRollingRenewalNb() {
    this.uiService.calculateCuFinalExpiryDate();
    this.uiService.cuRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onClickCuRenewalCalendarDate() {
    this.uiService.calculateCuFinalExpiryDate();
    this.uiService.cuRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onClickCuRollingRenewForPeriod() {
    this.uiService.cuRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onChangeCuRollingRenewForNb() {
    this.uiService.cuRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onFocusCuRollingDayInMonth() {
    // Day in Month should accept only numbers 1-31.
    this.form.addFCCValidators('cuRollingDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);
  }

  populateDataForCopyFrom() {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const option = this.uiService.getOption() ? this.uiService.getOption() : this.option;
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if ((tnxTypeCode === FccGlobalConstant.N002_NEW &&
      (option === FccGlobalConstant.EXISTING_OPTION || option === FccGlobalConstant.TEMPLATE
        || mode === FccGlobalConstant.DRAFT_OPTION)) || tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.onClickCuRenewalType();
      if (this.form.get('cuRenewOnCode') && (this.form.get('cuRenewOnCode').value === '02' ||
      (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuRenewOnCode').value[0] &&
      this.form.get('cuRenewOnCode').value[0].value === '02'))) {
        this.toggleControls(this.form, ['cuRenewalCalendarDate'], true);
        this.toggleRequired(true, this.form, ['cuRenewalCalendarDate']);
      } else {
        this.toggleControls(this.form, ['cuRenewalCalendarDate'], false);
        this.toggleRequired(false, this.form, ['cuRenewalCalendarDate']);
      }
      this.onChangeCuRollingCancellationDays();
      if (this.form.get('cuRenewalType') && (this.form.get('cuRenewalType').value === '02' ||
       (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuRenewalType').value[0] &&
       this.form.get('cuRenewalType').value[0].value === '02'))) {
        this.onClickCuRollingRenewOnCode();
      }

    }
  }

  renderFinalExpTip() {
    if (this.form.get(FccGlobalConstant.UI_CU_FINAL_EXPIRY_DATE) &&
    this.form.get(FccGlobalConstant.UI_CU_FINAL_EXPIRY_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === true &&
    this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.UI_CU_FINAL_EXPIRY_DATE).value) &&
    this.form.get(FccGlobalConstant.UI_CU_FINAL_EXPIRY_DATE).value !== '') {
      if (this.form.get(FccGlobalConstant.UI_CU_FINAL_EXPIRY_TIP)) {
          this.form.get(FccGlobalConstant.UI_CU_FINAL_EXPIRY_TIP)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
    } else {
      if (this.form.get(FccGlobalConstant.UI_CU_FINAL_EXPIRY_TIP)) {
        this.form.get(FccGlobalConstant.UI_CU_FINAL_EXPIRY_TIP)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
    }
  }

  removeValidationUnSelectButton() {
    this.setMandatoryFields(this.form, this.allExtensionFields, false);
    this.removeValidators(this.form, this.allExtensionFields);
  }
  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
  }
}
