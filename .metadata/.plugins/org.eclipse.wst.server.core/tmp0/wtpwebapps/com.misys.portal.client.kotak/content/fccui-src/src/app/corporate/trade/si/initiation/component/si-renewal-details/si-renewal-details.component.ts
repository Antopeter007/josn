import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import {
  compareExpiryDateToCurrentDate,
  compareRenewalDateWithExpDate,
  compareRenewalFinalDateWithExpDate, isEmptyExpDate
} from './../../../../../../corporate/trade/lc/initiation/validator/ValidateDates';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'app-si-renewal-details',
  templateUrl: './si-renewal-details.component.html',
  styleUrls: ['./si-renewal-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiRenewalDetailsComponent }]
})
export class SiRenewalDetailsComponent extends SiProductComponent implements OnInit {
  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  option;
  tnxTypeCode: any;
  isMasterRequired: any;
  module = `${this.translateService.instant(FccGlobalConstant.SI_RENEWAL_DETAILS)}`;
  previousrollingRenewalDetailsOptions;
  constructor(protected eventEmitterService: EventEmitterService,
              protected stateService: ProductStateService,
              protected commonService: CommonService, protected amendCommonService: AmendCommonService,
              protected translateService: TranslateService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected siProductService: SiProductService) {
      super(eventEmitterService, stateService, commonService, translateService, confirmationService,
        customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
        dialogRef, currencyConverterPipe, siProductService);
    }

  ngOnInit(): void {
    super.ngOnInit();
    this.isMasterRequired = this.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.initializeFormGroup();
    this.onClickAllowRenewalToggle();
    this.commonService.responseChipConfirmationDialog$.subscribe(data => {
      if (data && data.action && data.controlName === 'rollingRenewalDetailsOptions') {
        this.handleResponse(data);
      }
    });
  }

  setReadOnly(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { readonly: flag });
  }

  setReadOnlyFields(form, ids: string[], flag) {
    ids.forEach(id => this.setReadOnly(form, id, flag));
  }

  handleResponse(data) {
    if (data.action === 'cancelled') {
      this.form.get(data.controlName).setValue(data.previousValue);
      this.form.get(data.controlName).updateValueAndValidity();
    } else if (data.action === 'toggle') {
      this.selectRollingRenewalDetailsOptions();
    } else if (data.action === 'deselect') {
      this.unSelectRollingRenewalDetailsOptions(true, data.presentValue);
    }
    this.previousrollingRenewalDetailsOptions = this.form.get(data.controlName).value;
  }

  onClickRollingRenewalDetailsOptions(event?) {
    if (this.isChipEvent(event, this.previousrollingRenewalDetailsOptions)) {
      const presentValue = event[FccGlobalConstant.SOURCE][FccGlobalConstant.VALUE];
      const data = {
        controlName: 'rollingRenewalDetailsOptions',
        previousValue: this.previousrollingRenewalDetailsOptions,
        presentValue,
        event: true
      };
      this.commonService.openChipConfirmationDialog$.next(data);
    } else {
      this.selectRollingRenewalDetailsOptions();
      this.previousrollingRenewalDetailsOptions = this.form.get('rollingRenewalDetailsOptions').value;
    }
  }

  selectRollingRenewalDetailsOptions() {
    if (this.form.get(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION).value &&
        this.form.get(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION).value ===
              FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION_EVERY) {
            this.selectRollingRenewalDeatilsExpiryOption();
    } else {
      this.selectRollingRenewalDeatilsEveryOption();
    }
  }

  selectRollingRenewalDeatilsExpiryOption() {
    this.form.get(FccGlobalConstant.FREQUENCY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccGlobalConstant.FREQUENCY_PERIOD)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccGlobalConstant.FREQUENCY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccGlobalConstant.FREQUENCY_PERIOD)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.addFCCValidators(FccGlobalConstant.FREQUENCY_PERIOD, Validators.pattern(FccGlobalConstant.numberPattern),
    FccGlobalConstant.ZERO);
    this.form.get('nineSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
  }

  selectRollingRenewalDeatilsEveryOption() {
    this.form.get(FccGlobalConstant.FREQUENCY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccGlobalConstant.FREQUENCY_PERIOD)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccGlobalConstant.FREQUENCY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.form.get(FccGlobalConstant.FREQUENCY_PERIOD)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.form.get('nineSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccGlobalConstant.FREQUENCY).clearValidators();
    this.form.get(FccGlobalConstant.FREQUENCY_PERIOD).clearValidators();
    const resetFieldArray: string[] = [FccGlobalConstant.FREQUENCY, FccGlobalConstant.FREQUENCY_PERIOD];
    this.resetDefaultValuesUnSelectButton(resetFieldArray);
    this.form.updateValueAndValidity();
  }

  unSelectRollingRenewalDetailsOptions(isEvent: boolean, presentValue: string) {
    this.selectRollingRenewalDeatilsEveryOption();
    this.unSelectButton(isEvent, 'rollingRenewalDetailsOptions', presentValue, this.previousrollingRenewalDetailsOptions);
    this.previousrollingRenewalDetailsOptions = null;
    this.form.updateValueAndValidity();
  }

  onClickAllowRenewalToggle() {
    const renewalToggle = this.form.get(FccGlobalConstant.ALLOW_RENEWAL_TOGGLE).value;
    const dependentFields = ['renewOn', 'renewDate', 'numberOf', 'daysNotice', 'rollingRenewalDetailsOptions',
                             'renewForDuration', 'renewalFinalExpiryDate', 'renewalAmountType', 'numberOfRenewals', 'adviseRenewalFlag',
                             'cancellationNotice', 'frequencyPeriod', 'rollingRenewalFlag', 'frequency'];
    const resetFields = ['renewOn', 'renewDate', 'numberOf', 'daysNotice', 'rollingRenewalDetailsOptions',
                          'renewalAmountType', 'renewForDuration', 'renewalFinalExpiryDate', 'numberOfRenewals', 'rollingRenewalFlag',
                          'cancellationNotice', 'frequencyPeriod', 'adviseRenewalFlag', 'frequency', 'renewOnCode'];
    const amendLabelFields = ['renewOn', 'renewDate', 'numberOf', 'daysNotice', 'rollingRenewalDetailsOptions', 'renewFor',
                              'renewalAmount', 'renewForDuration', 'renewalFinalExpiryDate', 'numberOfRenewals', 'rollingRenewalFlag',
                              'cancellationNotice', 'frequencyPeriod', 'adviseRenewalFlag', 'frequency', 'renewalAmountType',
                              'rollingRenewalOn'];
    if (renewalToggle && renewalToggle === FccBusinessConstantsService.YES) {
      this.form.get(FccGlobalConstant.ALLOW_RENEWAL_TOGGLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING]
       = `${this.translateService.instant(FccGlobalConstant.ALLOW_RENEWAL_MESSAGE)}`;
      this.setReadOnlyFields(this.form, dependentFields, false);
      if (this.form.get(FccGlobalConstant.RENEW_FOR_DURATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] !== null &&
          this.form.get(FccGlobalConstant.RENEW_FOR_DURATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] !== '' &&
          this.form.get(FccGlobalConstant.RENEW_FOR_DURATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] !== undefined) {
            this.form.get(FccGlobalConstant.RENEW_FOR_DURATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      }
      this.form.get(FccGlobalConstant.RENEW_ON)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form.get(FccGlobalConstant.RENEW_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.controls[FccGlobalConstant.RENEW_DATE].enable();
      this.form.get(FccGlobalConstant.ADVISE_RENEWAL_FLAG)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form.get(FccGlobalConstant.ROLLING_RENEWAL_FLAG)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form.get(FccGlobalConstant.NUMBER_OF)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.controls[FccGlobalConstant.NUMBER_OF].enable();
      this.form.get(FccGlobalConstant.RENEW_FOR_DURATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      if (!this.form.get(FccGlobalConstant.RENEWAL_AMOUNT_TYPE).value) {
        this.form.get(FccGlobalConstant.RENEWAL_AMOUNT_TYPE).setValue(FccGlobalConstant.RENEWAL_AMOUNT_TYPE_CURRENT);
      }
      this.checkRenewOn();
      this.onClickAdviseRenewalFlag();
      this.onClickRollingRenewalFlag();
      this.onClickRollingRenewalDetailsOptions();
      this.form.updateValueAndValidity();
    } else if (renewalToggle && renewalToggle === FccBusinessConstantsService.NO) {
      this.form.get(FccGlobalConstant.ALLOW_RENEWAL_TOGGLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING]
       = FccGlobalConstant.EMPTY_STRING;
      this.setReadOnlyFields(this.form, dependentFields, true);
      if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
        this.removeAmendLabelFields(this.form, amendLabelFields, false);
      }
      this.resetValues(this.form, resetFields);
      if (this.form.get(FccGlobalConstant.RENEW_FOR_DURATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] !== null &&
          this.form.get(FccGlobalConstant.RENEW_FOR_DURATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] !== '' &&
          this.form.get(FccGlobalConstant.RENEW_FOR_DURATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] !== undefined) {
          this.form.get(FccGlobalConstant.RENEW_FOR_DURATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      }
      this.form.get(FccGlobalConstant.RENEW_ON)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.get(FccGlobalConstant.RENEW_ON_CODE).setValue(null);
      this.form.get(FccGlobalConstant.ADVISE_RENEWAL_FLAG)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.get(FccGlobalConstant.ROLLING_RENEWAL_FLAG)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.get(FccGlobalConstant.RENEW_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccGlobalConstant.NUMBER_OF)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.controls[FccGlobalConstant.RENEW_DATE].disable();
      this.form.controls[FccGlobalConstant.NUMBER_OF].disable();
      this.form.get(FccGlobalConstant.RENEW_FOR_DURATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccGlobalConstant.RENEWAL_AMOUNT_TYPE).setValue(null);
      this.form.get(FccGlobalConstant.RENEW_FOR_DURATION).clearValidators();
      this.onClickAdviseRenewalFlag();
      this.onClickRollingRenewalFlag();
      this.form.clearValidators();
      this.form.setErrors(null);
      this.form.updateValueAndValidity();
    }
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.SI_RENEWAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    this.commonService.formatForm(this.form);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendCommonService.setValueFromMasterToPrevious(sectionName);
    }
    this.form.addFCCValidators(FccGlobalConstant.NUMBER_OF, Validators.pattern(FccGlobalConstant.numberPattern),
     FccGlobalConstant.ZERO);
    this.form.addFCCValidators(FccGlobalConstant.NUMBER_OF_RENEWALS, Validators.pattern(FccGlobalConstant.numberPattern),
              FccGlobalConstant.ZERO);
    this.form.addFCCValidators(FccGlobalConstant.CANCELLATION_NOTICE, Validators.pattern(FccGlobalConstant.numberPattern),
              FccGlobalConstant.ZERO);
    this.form.addFCCValidators(FccGlobalConstant.FREQUENCY_PERIOD, Validators.pattern(FccGlobalConstant.numberPattern),
     FccGlobalConstant.ZERO);
    this.form.addFCCValidators(FccGlobalConstant.DAYS_NOTICE, Validators.pattern(FccGlobalConstant.numberPattern),
     FccGlobalConstant.ZERO);
    this.form.get('nineSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.validateRenewalDate();
  }

  onClickRenewOn() {
    this.form.get(FccGlobalConstant.RENEW_ON_CODE).setValue(null);
    if (this.form.get(FccGlobalConstant.ALLOW_RENEWAL_TOGGLE).value === FccBusinessConstantsService.YES) {
      this.checkRenewOn();
      this.patchFieldParameters(this.form.get(FccGlobalConstant.RENEW_ON), { showCheckBoxIcon: false });
    } else {
      this.form.get(FccGlobalConstant.RENEW_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.RENEW_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      this.form.get(FccGlobalConstant.RENEW_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccGlobalConstant.RENEW_ON)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.get(FccGlobalConstant.RENEW_ON).setValue(null);
    }
    this.form.updateValueAndValidity();
  }

  checkRenewOn() {
    this.setRenewOnCode();
    if (this.form.get(FccGlobalConstant.RENEW_ON).value && this.form.get(FccGlobalConstant.RENEW_ON).value ===
          FccBusinessConstantsService.YES) {
            this.form.get(FccGlobalConstant.RENEW_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            this.form.get(FccGlobalConstant.RENEW_DATE).setValue(null);
            this.form.get(FccGlobalConstant.RENEW_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
            this.form.get(FccGlobalConstant.RENEW_DATE).setErrors(null);
            this.form.get(FccGlobalConstant.RENEW_ON_CODE).setValue(FccGlobalConstant.CODE_01);
            this.form.get(FccGlobalConstant.RENEW_DATE).clearValidators();
            this.form.get(FccGlobalConstant.RENEW_DATE).updateValueAndValidity();
    } else {
      this.form.get(FccGlobalConstant.RENEW_ON_CODE).setValue(FccGlobalConstant.CODE_02);
      this.form.get(FccGlobalConstant.RENEW_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.RENEW_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    }
    this.form.updateValueAndValidity();
  }

  onClickAdviseRenewalFlag() {
    if (this.form.get(FccGlobalConstant.ADVISE_RENEWAL_FLAG).value && this.form.get(FccGlobalConstant.ADVISE_RENEWAL_FLAG).value ===
          FccBusinessConstantsService.YES) {
        this.form.get(FccGlobalConstant.ADVISE_RENEWAL_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.DAYS_NOTICE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.DAYS_NOTICE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        this.form.addFCCValidators(FccGlobalConstant.DAYS_NOTICE, Validators.pattern(FccGlobalConstant.numberPattern),
        FccGlobalConstant.ZERO);
        this.patchFieldParameters(this.form.get(FccGlobalConstant.ADVISE_RENEWAL_FLAG), { showCheckBoxIcon: false });
      } else {
        this.form.get(FccGlobalConstant.DAYS_NOTICE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.DAYS_NOTICE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
        this.form.get(FccGlobalConstant.DAYS_NOTICE).clearValidators();
      }
    this.form.updateValueAndValidity();
  }

  onClickRollingRenewalFlag() {
    if (this.form.get(FccGlobalConstant.ROLLING_RENEWAL_FLAG).value && this.form.get(FccGlobalConstant.ROLLING_RENEWAL_FLAG).value ===
          FccBusinessConstantsService.YES) {
        this.form.get(FccGlobalConstant.ROLLING_RENEWAL_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.ROLLING_RENEWAL_ON)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        if (this.form.get(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION) &&
            (this.form.get(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION).value === null ||
              this.form.get(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION).value === undefined ||
              this.form.get(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION).value === FccGlobalConstant.EMPTY_STRING)) {
          this.form.get(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION).setValue(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION_EXPIRY);
          this.previousrollingRenewalDetailsOptions = this.form.get(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION).value;
        }
        this.form.get(FccGlobalConstant.NUMBER_OF_RENEWALS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.CANCELLATION_NOTICE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.NUMBER_OF_RENEWALS)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccGlobalConstant.CANCELLATION_NOTICE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccGlobalConstant.RENEWAL_FINAL_EXPIRY_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.addFCCValidators(FccGlobalConstant.NUMBER_OF_RENEWALS, Validators.pattern(FccGlobalConstant.numberPattern),
              FccGlobalConstant.ZERO);
        this.form.addFCCValidators(FccGlobalConstant.CANCELLATION_NOTICE, Validators.pattern(FccGlobalConstant.numberPattern),
              FccGlobalConstant.ZERO);
        this.patchFieldParameters(this.form.get(FccGlobalConstant.ROLLING_RENEWAL_FLAG), { showCheckBoxIcon: false });
      } else {
        this.form.get(FccGlobalConstant.ROLLING_RENEWAL_ON)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.NUMBER_OF_RENEWALS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.CANCELLATION_NOTICE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.NUMBER_OF_RENEWALS)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
        this.form.get(FccGlobalConstant.CANCELLATION_NOTICE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
        this.form.get(FccGlobalConstant.RENEWAL_FINAL_EXPIRY_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.FREQUENCY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.FREQUENCY_PERIOD)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.FREQUENCY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
        this.form.get(FccGlobalConstant.FREQUENCY_PERIOD)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
        this.form.get(FccGlobalConstant.FREQUENCY_PERIOD).setErrors(null);
        this.form.get(FccGlobalConstant.FREQUENCY).setErrors(null);
        this.form.get(FccGlobalConstant.ROLLING_RENEWAL_DETAILS_OPTION).setValue(null);
        this.form.get('nineSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.FREQUENCY).clearValidators();
        this.form.get(FccGlobalConstant.FREQUENCY_PERIOD).clearValidators();
        this.form.get(FccGlobalConstant.NUMBER_OF_RENEWALS).clearValidators();
        this.form.get(FccGlobalConstant.CANCELLATION_NOTICE).clearValidators();
        this.form.updateValueAndValidity();
      }
  }

  onClickRenewForDuration(event) {
    const durationValues = this.form.get(FccGlobalConstant.RENEW_FOR_DURATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    if (event.value && durationValues) {
      this.form.get(FccGlobalConstant.FREQUENCY).setValue( durationValues.filter(
         task => task.value === event.value)[0].value);
    }
  }

  onBlurNumberOf() {
    this.zeroDaysValidation(FccGlobalConstant.NUMBER_OF, this.form.get(FccGlobalConstant.NUMBER_OF).value);
  }

  onBlurNumberOfRenewals() {
    this.zeroDaysValidation(FccGlobalConstant.NUMBER_OF_RENEWALS, this.form.get(FccGlobalConstant.NUMBER_OF_RENEWALS).value);
  }

  onBlurCancellationNotice() {
    this.zeroDaysValidation(FccGlobalConstant.CANCELLATION_NOTICE, this.form.get(FccGlobalConstant.CANCELLATION_NOTICE).value);
  }

  onBlurFrequencyPeriod() {
    this.zeroDaysValidation(FccGlobalConstant.FREQUENCY_PERIOD, this.form.get(FccGlobalConstant.FREQUENCY_PERIOD).value);
  }

  onBlurDaysNotice() {
    this.zeroDaysValidation(FccGlobalConstant.DAYS_NOTICE, this.form.get(FccGlobalConstant.DAYS_NOTICE).value);
  }

  zeroDaysValidation(control, value: any) {
    if (control && value && value <= FccGlobalConstant.ZERO) {
      this.form.get(control).setErrors({ fieldCanNotBeZero: true });
    }
    this.form.updateValueAndValidity();
  }

  onClickRenewDate() {
    this.form.get(FccGlobalConstant.RENEW_ON_CODE).setValue(null);
    this.validateRenewalDate();
    this.setRenewOnCode();
  }

  onBlurRenewDate() {
    this.validateRenewalDate();
    this.setRenewOnCode();
  }

  onClickRenewalFinalExpiryDate() {
    this.validateRenewalFinalExpiryDate();
  }

  onBlurRenewalFinalExpiryDate() {
    this.validateRenewalFinalExpiryDate();
  }

  validateRenewalDate(): void {
    if (!this.form.get(FccGlobalConstant.RENEW_DATE).value) {
      this.form.get(FccGlobalConstant.RENEW_DATE).setErrors({ required: true });
      this.form.get(FccGlobalConstant.RENEW_DATE).updateValueAndValidity();
    }
    const renewDate = this.form.get(FccGlobalConstant.RENEW_DATE).value;
    if ( renewDate !== null && renewDate !== '' && renewDate !== undefined) {
    const expDate =
          this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get(FccGlobalConstant.EXPIRY_DATE_FIELD).value;
    if (expDate === FccGlobalConstant.EMPTY_STRING || expDate === undefined || expDate === null) {
      this.form.get(FccGlobalConstant.RENEW_DATE).clearValidators();
      this.form.get(FccGlobalConstant.RENEW_DATE).setValidators([isEmptyExpDate]);
      this.form.get(FccGlobalConstant.RENEW_DATE).updateValueAndValidity();
    } else if (expDate && renewDate && (renewDate > expDate)) {
      this.form.get(FccGlobalConstant.RENEW_DATE).clearValidators();
      this.form.get(FccGlobalConstant.RENEW_DATE).setValidators([compareRenewalDateWithExpDate]);
      this.form.get(FccGlobalConstant.RENEW_DATE).updateValueAndValidity();
    } else if (renewDate) {
      this.form.get(FccGlobalConstant.RENEW_DATE).clearValidators();
      this.form.get(FccGlobalConstant.RENEW_DATE).setValidators([compareExpiryDateToCurrentDate]);
      this.form.get(FccGlobalConstant.RENEW_DATE).updateValueAndValidity();
    } else {
        this.commonService.clearValidatorsAndUpdateValidity(FccGlobalConstant.RENEW_DATE, this.form);
    }
  }
}

validateRenewalFinalExpiryDate(): void {
  if (!this.form.get(FccGlobalConstant.RENEWAL_FINAL_EXPIRY_DATE).value) {
    this.form.get(FccGlobalConstant.RENEWAL_FINAL_EXPIRY_DATE).setErrors({ required: true });
    this.form.get(FccGlobalConstant.RENEWAL_FINAL_EXPIRY_DATE).updateValueAndValidity();
  }
  const renewDate = this.form.get(FccGlobalConstant.RENEWAL_FINAL_EXPIRY_DATE).value;
  if ( renewDate !== null && renewDate !== '' && renewDate !== undefined) {
    const expDate =
          this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get(FccGlobalConstant.EXPIRY_DATE_FIELD).value;
    if (expDate && renewDate && (renewDate < expDate)) {
      this.form.get(FccGlobalConstant.RENEWAL_FINAL_EXPIRY_DATE).clearValidators();
      this.form.get(FccGlobalConstant.RENEWAL_FINAL_EXPIRY_DATE).setValidators([compareRenewalFinalDateWithExpDate]);
      this.form.get(FccGlobalConstant.RENEWAL_FINAL_EXPIRY_DATE).updateValueAndValidity();
    } else {
      this.commonService.clearValidatorsAndUpdateValidity(FccGlobalConstant.RENEWAL_FINAL_EXPIRY_DATE, this.form);
  }
}
}

  setRenewOnCode() {
    if (this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.RENEW_ON).value) &&
       this.form.get(FccGlobalConstant.RENEW_ON).value === FccBusinessConstantsService.YES) {
       this.form.get(FccGlobalConstant.RENEW_ON_CODE).setValue(FccGlobalConstant.CODE_01);
    } else if (this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.RENEW_DATE).value) &&
       this.form.get(FccGlobalConstant.RENEW_DATE).value !== FccGlobalConstant.EMPTY_STRING) {
       this.form.get(FccGlobalConstant.RENEW_ON_CODE).setValue(FccGlobalConstant.CODE_02);
    } else if (this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.RENEW_ON_CODE).value) &&
       this.form.get(FccGlobalConstant.RENEW_ON_CODE).value === FccGlobalConstant.CODE_01) {
       this.form.get(FccGlobalConstant.RENEW_ON).setValue(FccBusinessConstantsService.YES);
   } else {
      this.form.get(FccGlobalConstant.RENEW_ON_CODE).setValue(null);
    }
    this.form.updateValueAndValidity();
  }

  removeAmendLabelFields(form, ids: string[], flag) {
    ids.forEach(id => this.removeAmendLabel(form, id, flag));
  }

  removeAmendLabel(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { infoIcon: flag, infolabel: null });
  }
}
