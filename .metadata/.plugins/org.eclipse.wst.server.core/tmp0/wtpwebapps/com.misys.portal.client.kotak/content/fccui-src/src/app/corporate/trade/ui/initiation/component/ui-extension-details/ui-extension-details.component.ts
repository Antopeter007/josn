import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';

import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiService } from '../../../common/services/ui-service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { TradeCommonDataService } from './../../../../common/service/trade-common-data.service';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ui-extension-details',
  templateUrl: './ui-extension-details.component.html',
  styleUrls: ['./ui-extension-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiExtensionDetailsComponent }]
})
export class UiExtensionDetailsComponent extends UiProductComponent implements OnInit {

  module = ``;
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  swiftXChar;
  option: any;
  transmissionMode: any;
  previousBgRenewalTypeValue: any;
  allExtensionFields;
  enquiryRegex: any;
  productCode;
  fieldNames = [];
  regexType: string;
  swiftZchar;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected uiService: UiService, protected tradeCommonDataService: TradeCommonDataService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.transmissionMode =
    this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.productCode = this.commonService.getQueryParametersFromKey (FccGlobalConstant.PRODUCT);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.enquiryRegex = response.swiftZChar;
        this.swiftXChar = response.swiftXCharacterSet;
      }
    });
    this.initializeFormGroup();
    this.initializeDropDownValues();
    this.setFormValidations();
    this.populateDataForCopyFrom();
    this.commonService.responseChipConfirmationDialog$.subscribe(data => {
      if (data && data.action && data.controlName === 'bgRenewalType') {
        this.handleResponse(data);
        this.commonService.responseChipConfirmationDialog$.next(null);
      }
    });
    this.renderFinalExpTip();
    this.fieldNames = ['bgNarrativeCancellation'];
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.form.get(FccGlobalConstant.BG_CANCELLATION_DETAILS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  }

  initializeDropDownValues() {
    const bgRenewForPeriod = this.tradeCommonDataService.getPeriodOptions('');
    if (this.form.get('bgRenewForPeriod')) {
      this.form.get('bgRenewForPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = bgRenewForPeriod;
    }
    if (this.form.get('bgRollingRenewForPeriod')) {
      this.form.get('bgRollingRenewForPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = bgRenewForPeriod;
    }

  }

  populateDataForCopyFrom() {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const option = this.uiService.getOption() ? this.uiService.getOption() : this.option;
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if ((tnxTypeCode === FccGlobalConstant.N002_NEW &&
      (option === FccGlobalConstant.EXISTING_OPTION || option === FccGlobalConstant.TEMPLATE
        || mode === FccGlobalConstant.DRAFT_OPTION)) || tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.onClickBgRenewalType();
      if (this.form.get('bgRenewOnCode') && this.form.get('bgRenewOnCode').value === '02') {
        this.toggleControls(this.form, ['bgRenewalCalendarDate'], true);
        this.toggleRequired(true, this.form, ['bgRenewalCalendarDate']);
      } else {
        this.toggleControls(this.form, ['bgRenewalCalendarDate'], false);
        this.toggleRequired(false, this.form, ['bgRenewalCalendarDate']);
      }
      this.onChangeBgRollingCancellationDays();
      if (this.form.get('bgRenewalType') && this.form.get('bgRenewalType').value === '02') {
        this.onClickBgRollingRenewOnCode();
      }

    }
  }

  setFormValidations() {
    this.form.addFCCValidators('bgRenewForNb', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('bgRollingDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);
    this.form.addFCCValidators('bgRollingRenewalNb', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('bgAdviseRenewalDaysNb', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('bgRollingCancellationDays', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.swiftXChar = response.swiftXCharacterSet;
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('bgNarrativeCancellation', Validators.pattern(this.swiftXChar), 0);
      }
    });

  }

  handleResponse(data) {
    if (data.action === 'cancelled') {
      this.form.get(data.controlName).setValue(data.previousValue);
      this.form.get(data.controlName).updateValueAndValidity();
    } else if (data.action === 'toggle') {
      this.selectBgRenewalType();
    } else if (data.action === 'deselect') {
      this.unSelectBgRenewalType(true, data.presentValue);
    }
    this.previousBgRenewalTypeValue = this.form.get(data.controlName).value;
  }

  onClickBgRenewalType(event?) {
    this.allExtensionFields = ['extensionOnLabel', 'bgRenewOnCode', 'bgRenewalCalendarDate',
    'extensionForLabel', 'bgRenewForNb', 'bgRenewForPeriod', 'bgRollingRenewOnCodeLabel', 'bgRollingRenewOnCode',
    'bgRollingDayInMonth', 'bgRollingRenewForNbLabel', 'bgRollingRenewForNb', 'bgRollingRenewForPeriod', 'bgRollingRenewalNb',
    'bgFinalExpiryDate', 'extensionAmountLabel', 'bgRenewAmtCode', 'bgRollingCancellationDays', 'bgNarrativeCancellation',
    'bgAdviseRenewalLabel', 'bgAdviseRenewalDaysNb'];

    if (this.isChipEvent(event, this.previousBgRenewalTypeValue)) {
      const presentValue = event[FccGlobalConstant.SOURCE][FccGlobalConstant.VALUE];
      const data = {
        controlName: 'bgRenewalType',
        previousValue: this.previousBgRenewalTypeValue,
        presentValue,
        event: true
      };
      this.commonService.openChipConfirmationDialog$.next(data);
    } else {
      this.selectBgRenewalType();
      this.previousBgRenewalTypeValue = this.form.get('bgRenewalType').value;
    }
  }

  unSelectBgRenewalType(isEvent: boolean, presentValue: string) {
    this.unSelectButton(isEvent, 'bgRenewalType', presentValue, this.previousBgRenewalTypeValue, this.allExtensionFields,
      this.allExtensionFields);
    this.previousBgRenewalTypeValue = null;
    this.form.get('bgRenewFlag').setValue(null); // clear
    this.form.get('bgRenewOnCode').setValue(null); // clear
    this.renderFinalExpTip();
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_TYPE_CODE);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND)
    {
      if (!this.form.get('bgRenewalType')[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIOUSCOMPAREVALUE])
      {
        this.patchFieldParameters(this.form.get('extensionBasisLabel'), { infoIcon: false, isAmendedLabel: false });
        this.patchFieldParameters(this.form.get('bgRenewalType'), { infoIcon: false, isAmendedLabel: false });
      }
    }
    this.form.updateValueAndValidity();
  }

  removeValidationUnSelectButton() {
    this.setMandatoryFields(this.form, this.allExtensionFields, false);
    this.removeValidators(this.form, this.allExtensionFields);
  }

  selectBgRenewalType() {
    const regularFieldsToShow = ['extensionOnLabel', 'bgRenewOnCode', 'extensionForLabel', 'bgRenewForNb', 'bgRenewForPeriod',
    'bgRollingDayInMonth', 'bgRollingRenewalNb', 'bgFinalExpiryDate', 'extensionAmountLabel', 'bgRenewAmtCode',
    'bgRollingCancellationDays', 'bgAdviseRenewalLabel', 'bgAdviseRenewalDaysNb'];

    const rollingFieldsToShow = ['extensionOnLabel', 'bgRenewOnCode', 'extensionForLabel', 'bgRenewForNb', 'bgRenewForPeriod',
    'bgRollingRenewOnCodeLabel', 'bgRollingRenewOnCode', 'bgRollingRenewForNbLabel', 'bgRollingRenewForNb', 'bgRollingRenewForPeriod',
    'bgRollingRenewalNb', 'bgFinalExpiryDate', 'bgAdviseRenewalLabel', 'bgAdviseRenewalDaysNb', 'extensionAmountLabel', 'bgRenewAmtCode',
    'bgRollingCancellationDays'];

    if (this.form.get('bgRenewalType') && this.form.get('bgRenewalType').value === '01') {
      // Hide all fields
      this.toggleControls(this.form, this.allExtensionFields, false);
      // remove all validators
      this.removeValidators(this.form, this.allExtensionFields);
      // set all fields are non mandatory
      this.toggleRequired(false, this.form, ['bgRollingRenewOnCode', 'bgRollingRenewForNb', 'bgRollingRenewForPeriod',
      'bgRollingRenewalNb']);
      this.form.get('bgRollingRenewalFlag').setValue('N');
      // Show relevant fields
      this.toggleControls(this.form, regularFieldsToShow, true);
      // set required validators
      this.addRequiredValidator(this.form, ['bgRenewForNb', 'bgRenewForPeriod', 'bgRollingRenewalNb']);
      // check validation on form load
      this.markFieldTouchedandDirty(this.form, ['bgRenewForNb', 'bgRenewForPeriod', 'bgRollingRenewalNb'] );
      this.removeMandatoryFields(['bgRenewForNb', 'bgRenewForPeriod', 'bgRollingRenewalNb']);
      this.form.get('bgRenewFlag').setValue('Y');
      this.setBgRenewOnCode();
      this.form.get('bgFinalExpiryDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      this.renderFinalExpTip();

    } else if (this.form.get('bgRenewalType') && this.form.get('bgRenewalType').value === '02') {

      this.toggleControls(this.form, this.allExtensionFields, false);
      this.removeValidators(this.form, this.allExtensionFields);
      this.toggleRequired(false, this.form, ['bgRenewForNb', 'bgRenewForPeriod', 'bgRollingRenewalNb']);
      this.form.get('bgRollingRenewalFlag').setValue('Y');
      this.toggleControls(this.form, rollingFieldsToShow, true);
      this.addRequiredValidator(this.form, ['bgRollingRenewOnCode', 'bgRollingRenewForNb', 'bgRollingRenewForPeriod',
         'bgRollingRenewalNb']);
      this.markFieldTouchedandDirty(this.form, ['bgRollingRenewOnCode', 'bgRollingRenewForNb', 'bgRollingRenewForPeriod',
      'bgRollingRenewalNb']);
      this.form.addFCCValidators('bgRollingRenewForNb', Validators.pattern(FccGlobalConstant.numberPattern), 0);
      this.removeMandatoryFields(['bgRollingRenewForNb', 'bgRollingRenewForPeriod', 'bgRollingRenewalNb']);
      this.form.get('bgRenewFlag').setValue('Y');
      this.setBgRenewOnCode();
      this.form.get('bgFinalExpiryDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      this.renderFinalExpTip();
    } else {
      this.form.get('bgRenewFlag').setValue('N');
    }
    this.form.updateValueAndValidity();
  }

  setBgRenewOnCode(){
    if(this.form.get('bgRenewOnCode').value === null){
      this.form.get('bgRenewOnCode').setValue('01');
    }
  }

  onClickBgRollingRenewOnCode() {
    if (this.form.get('bgRollingRenewOnCode') && this.form.get('bgRollingRenewOnCode').value === '02') {
      this.toggleControls(this.form, ['bgRollingDayInMonth'], true);
      this.toggleRequired(true, this.form, ['bgRollingDayInMonth']);
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryField(this.form, 'bgRollingDayInMonth', false);
      }
    } else {
      this.toggleControls(this.form, ['bgRollingDayInMonth'], false);
      this.toggleRequired(false, this.form, ['bgRollingDayInMonth']);
    }
  }

  onClickBgRenewOnCode() {
    if (this.form.get('bgRenewOnCode') && this.form.get('bgRenewOnCode').value === '02') {
      this.toggleControls(this.form, ['bgRenewalCalendarDate'], true);
      this.toggleRequired(true, this.form, ['bgRenewalCalendarDate']);
      this.resetValues(this.form, ['bgFinalExpiryDate']);
      this.form.get('tipFinalExpiryDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryField(this.form, 'bgRenewalCalendarDate', false);
      }
    } else {
      this.toggleControls(this.form, ['bgRenewalCalendarDate'], false);
      this.toggleRequired(false, this.form, ['bgRenewalCalendarDate']);
      this.uiService.calculateFinalExpiryDate();
      this.uiService.checkRollingExtFinalExpiryDate();
      this.renderFinalExpTip();
    }
    this.resetValues(this.form, ['bgRenewalCalendarDate']);
  }

  onChangeBgAdviseRenewalDaysNb() {
    if(this.form.get('bgAdviseRenewalDaysNb').value !== '' && this.form.get('bgAdviseRenewalDaysNb').value !== null
        && this.form.get('bgAdviseRenewalDaysNb').value !== undefined) {
      this.form.get('bgAdviseRenewalFlag').setValue('Y');
    }
    else {
      this.form.get('bgAdviseRenewalFlag').setValue('N');
    }
  }

  onChangeBgRollingCancellationDays() {
    if (this.form.get('bgRollingCancellationDays') &&
        (this.form.get('bgRollingCancellationDays').value !== '' && this.form.get('bgRollingCancellationDays').value !== null)) {
      this.toggleControls(this.form, ['bgNarrativeCancellation'], true);
      this.toggleRequired(true, this.form, ['bgNarrativeCancellation']);
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.fieldNames.forEach(ele => {
          this.form.get(ele).clearValidators();
           this.regexType = this.form.get(ele)[FccGlobalConstant.PARAMS]['applicableValidation'][0]['characterValidation'];
          if (this.regexType === FccGlobalConstant.SWIFT_X) {
            this.regexType = this.swiftXChar;
          } else if (this.regexType === FccGlobalConstant.SWIFT_Z) {
            this.regexType = this.enquiryRegex;
          }
          if (this.commonService.validateProduct(this.form, ele, this.productCode)) {
            this.form.addFCCValidators(ele, Validators.pattern(this.regexType), 0);
            }
        });
      }
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryField(this.form, 'bgNarrativeCancellation', false);
      }
    } else {
      this.toggleControls(this.form, ['bgNarrativeCancellation'], false);
      this.toggleRequired(false, this.form, ['bgNarrativeCancellation']);
      this.form.get('bgNarrativeCancellation').setValue('');
    }
    this.form.updateValueAndValidity();
  }

  onChangeBgRenewForNb() {
    this.uiService.calculateFinalExpiryDate();
    this.uiService.checkRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onClickBgRenewForPeriod() {
    this.uiService.calculateFinalExpiryDate();
    this.uiService.checkRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onChangeBgRollingRenewalNb() {
    this.uiService.calculateFinalExpiryDate();
    this.uiService.checkRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onClickBgRenewalCalendarDate() {
    this.uiService.calculateFinalExpiryDate();
    this.uiService.checkRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onClickBgRollingRenewForPeriod() {
    this.uiService.checkRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onChangeBgRollingRenewForNb() {
    this.uiService.checkRollingExtFinalExpiryDate();
    this.renderFinalExpTip();
  }

  onFocusBgRollingDayInMonth() {
    // Day in Month should accept only numbers 1-31.
    this.form.addFCCValidators('bgRollingDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);
  }
  removeMandatoryFields(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  renderFinalExpTip() {
    if (this.form.get(FccGlobalConstant.UI_FINAL_EXPIRY_DATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === true &&
    this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.UI_FINAL_EXPIRY_DATE).value) &&
     this.form.get(FccGlobalConstant.UI_FINAL_EXPIRY_DATE).value !== '') {
        this.form.get(FccGlobalConstant.UI_FINAL_EXPIRY_TIP)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    } else {
        this.form.get(FccGlobalConstant.UI_FINAL_EXPIRY_TIP)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
  }

  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
  }

}
