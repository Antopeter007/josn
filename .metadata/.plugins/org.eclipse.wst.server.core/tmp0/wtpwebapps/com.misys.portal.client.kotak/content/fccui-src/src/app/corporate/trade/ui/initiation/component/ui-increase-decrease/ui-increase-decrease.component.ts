import { Overlay } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { IrregularIncreaseDecrease } from '../../../common/model/irregular-increase-decrease.model';
import { Variation } from '../../../common/model/Variation.model';
import { UiService } from '../../../common/services/ui-service';
import { UiProductService } from '../../../services/ui-product.service';
import { UiIrregularIncreaseDecreaseDialogComponent } from '../ui-irregular-increase-decrease-dialog/ui-irregular-increase-decrease-dialog';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { HideShowDeleteWidgetsService } from './../../../../../../common/services/hide-show-delete-widgets.service';
import { TradeCommonDataService } from './../../../../common/service/trade-common-data.service';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';


@Component({
  selector: 'app-ui-increase-decrease',
  templateUrl: './ui-increase-decrease.component.html',
  styleUrls: ['./ui-increase-decrease.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiIncreaseDecreaseComponent }]
})
export class UiIncreaseDecreaseComponent extends UiProductComponent implements OnInit, OnDestroy {

  module = ``;
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  private irregularVariationList: IrregularIncreaseDecrease [] = [];
  bgVariationFirstDateField = 'bgVariationFirstDate';
  bgAdviseDaysPriorNbField = FccGlobalConstant.BG_ADVISE_DAYS_NOTICE;
  expiryDate;
  extsnExiryDate;
  bgCurCode;
  bgAmt;
  VARIATION_DEP_FIELD_ERROR = 'variationError';
  INVALID_VARIATION_ERROR = 'invalidVariationError';
  bgVariation: Variation;
  pctField: AbstractControl;
  variationAmtField: AbstractControl;
  option: any;
  variationCurrencyField: AbstractControl;
  isMasterRequired: any;
  variationTypeField: AbstractControl;
  previousbgVariationTypeValue: any;
  allIncDecFields;
  regularFieldsToShow;

  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected leftSectionService: LeftSectionService,
              protected confirmationService: ConfirmationService , protected datePipe: DatePipe, protected uiService: UiService,
              protected tradeCommonDataService: TradeCommonDataService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService, protected dialog: MatDialog,
              protected currencyConverterPipe: CurrencyConverterPipe,
              public overlay: Overlay, protected uiProductService: UiProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.isMasterRequired = this.isMasterRequired;
    this.initializeFormGroup();
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.pctField = this.form.get('bgVariationPct');
    this.variationAmtField = this.form.get('bgVariationAmt');
    this.variationCurrencyField = this.form.get('bgVariationCurCode');
    this.variationTypeField = this.form.get('bgVariationType');
    this.initializeFormValues();
    this.setFormValidations();
    this.commonService.responseChipConfirmationDialog$.subscribe(data => {
      if (data && data.action && data.controlName === 'bgVariationType') {
        this.handleResponse(data);
        this.commonService.responseChipConfirmationDialog$.next(null);
      }
    });
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
  }

  resetAmountFieldsForLengthValidation() {
    this.setAmountLengthValidatorList(['bgVariationAmt', 'bgAmt']);
  }

  initializeFormValues() {
    const bgVariationPeriod = this.tradeCommonDataService.getPeriodOptions('');
    if (this.form.get('bgVariationPeriod')) {
      this.form.get('bgVariationPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = bgVariationPeriod;
    }
    this.bgCurCode = this.uiService.getBgCurCode();
    this.bgAmt = this.uiService.getBgAmt();
    this.form.get('bgVariationCurCode').setValue(this.bgCurCode);
    this.form.get(FccGlobalConstant.BG_INC_DEC_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.populateDataForCopyFrom();
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }
  amendFormFields() {
    const bgVariationAmt = this.form.get(FccGlobalConstant.BG_VAR_AMT).value;
    if (bgVariationAmt === '' || bgVariationAmt === null) {
      this.toggleControls(this.form, [FccGlobalConstant.BG_VAR_CURCODE], false);
      this.toggleControls(this.form, [FccGlobalConstant.BG_VAR_AMT], false);
    } else if (bgVariationAmt !== '' && bgVariationAmt !== null) {
      this.toggleControls(this.form, [FccGlobalConstant.BG_VAR_CURCODE], true);
      this.toggleControls(this.form, [FccGlobalConstant.BG_VAR_AMT], true);
    }
  }
  populateDataForCopyFrom() {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (this.hasVariation() && (tnxTypeCode === FccGlobalConstant.N002_NEW &&
      (mode === FccGlobalConstant.DRAFT_OPTION || mode === FccGlobalConstant.INITIATE))
      || tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.onClickBgVariationType();

      if (this.variationTypeField && this.variationTypeField.value === '02') {
        this.form.get('irregularVariations')[FccGlobalConstant.PARAMS][`hasData`] = true;
        this.form.get('irregularVariations')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.uiService.calculateAndValidateTotalVariation(this.irregularVariationList, this.uiService.getBgAmt(),
        this.form.get(this.INVALID_VARIATION_ERROR));

        const irregularDataList: [] = this.form.get('irregularVariations')[FccGlobalConstant.PARAMS][`data`] as [];

        irregularDataList.forEach(irregularData => {
          const irregularVariationDetails = {
            operationType: irregularData[`operationType`],
            operation: irregularData[`operation`],
            variationFirstDate: irregularData[`variationFirstDate`],
            variationPct: irregularData[`variationPct`],
            variationAmt: irregularData[`variationAmt`],
            variationCurCode: irregularData[`variationCurCode`],
            variationSequence: irregularData[`variationSequence`],
            variationAmtAndCurCode: irregularData[`variationAmtAndCurCode`],
            type: '02',
            sectionType: '01'
          };
          this.irregularVariationList.push(irregularVariationDetails);
        });



        this.form.updateValueAndValidity();
      }

      if (this.variationTypeField && this.variationTypeField.value === '01') {
      // Set switchToPercent value based on percent field value.
      // Based on this the switch will be enabled and percent field will be dispalyed.
      if (this.pctField.value === '' || this.pctField.value === null || this.pctField.value === undefined) {
        this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT).setValue(FccGlobalConstant.CODE_N);
      } else {
        this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT).setValue(FccGlobalConstant.CODE_Y);
      }
      this.onClickSwitchToPercent();
      }
    }


  }
  /**
   * Returns whether the form has variation or not.
   */
  hasVariation(): boolean {
    return (this.variationTypeField &&
    !(this.variationTypeField.value === '' || this.variationTypeField.value === null));
  }
  setFormValidations() {
    // Display error message if amount and currency are not entered in amount charges section
    if (this.bgCurCode === '' || this.bgAmt === '') {
      const errorMsg = `${this.translateService.instant(this.VARIATION_DEP_FIELD_ERROR)}`;
      this.form.get(this.VARIATION_DEP_FIELD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = errorMsg;
      this.form.get(this.VARIATION_DEP_FIELD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
    } else {
      this.form.get(this.VARIATION_DEP_FIELD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.updateValueAndValidity();
    }

    // Day in Month should accept only numbers 1-31.
    this.form.addFCCValidators('bgVariationDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);


    // Percentage should accept only decimals(upto 2 digits) or integers from 1-100, for decrease operation
    if (this.form.get('bgOperationType').value === FccGlobalConstant.VAR_DECREASE_OPERATION) {
      this.form.addFCCValidators('bgVariationPct', Validators.pattern(FccGlobalConstant.percentagePattern), 0);
    } else {
      this.form.addFCCValidators('bgVariationPct', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    }
    this.form.addFCCValidators(FccGlobalConstant.BG_ADVISE_DAYS_NOTICE, Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('bgVariationFrequency', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('bgMaximumNbVariation', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('bgVariationAmt', Validators.pattern(this.commonService.getRegexBasedOnlanguage()), 0);

  }
  onBlurBgVariationAmt() {
    const bgVariationAmt = this.form.get('bgVariationAmt').value;
    const bgVariationCurCode = this.form.get('bgVariationCurCode').value;
    if (bgVariationAmt !== '') {
      if (bgVariationCurCode !== '' || bgVariationCurCode !== undefined) {
        let valueupdated = this.commonService.replaceCurrency(bgVariationAmt);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), bgVariationCurCode);
        this.form.get('bgVariationAmt').setValue(valueupdated);
        this.form.get('bgVariationAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      }
      this.resetAmountFieldsForLengthValidation();
      this.form.get('bgVariationAmt').updateValueAndValidity();
    }
  }

  handleResponse(data) {
    if (data.action === 'cancelled') {
      this.form.get(data.controlName).setValue(data.previousValue);
      this.form.get(data.controlName).updateValueAndValidity();
    } else if (data.action === 'toggle') {
      this.selectbgVaritionType();
    } else if (data.action === 'deselect') {
      this.unSelectbgVariationType(true, data.presentValue);
    }
    this.previousbgVariationTypeValue = this.form.get(data.controlName).value;
  }


  onClickBgVariationType(event?) {
    this.allIncDecFields = ['addVariationType', 'bgOperationType', 'bgVariationFirstDate', 'bgAdviseEventLabel',
      FccGlobalConstant.BG_ADVISE_DAYS_SWITCH, 'bgVariationFrequency', 'bgVariationPeriod', 'bgMaximumNbVariation', 'bgVariationDayInMonth',
      FccGlobalConstant.SWITCH_TO_PERCENT, 'bgVariationPct', 'bgVariationCurCode', 'bgVariationAmt', 'irregularVariations'];

    this.regularFieldsToShow = ['bgOperationType', 'bgVariationFirstDate', 'bgAdviseEventLabel', FccGlobalConstant.BG_ADVISE_DAYS_SWITCH,
      'bgVariationFrequency', 'bgVariationPeriod', 'bgMaximumNbVariation', 'bgVariationDayInMonth', FccGlobalConstant.SWITCH_TO_PERCENT,
      'bgVariationCurCode', 'bgVariationAmt'];

    if (this.isChipEvent(event, this.previousbgVariationTypeValue)) {
      const presentValue = event[FccGlobalConstant.SOURCE][FccGlobalConstant.VALUE];
      const data = {
        controlName: 'bgVariationType',
        previousValue: this.previousbgVariationTypeValue,
        presentValue,
        event: true
      };
      this.commonService.openChipConfirmationDialog$.next(data);
    } else {
      this.selectbgVaritionType();
      this.previousbgVariationTypeValue = this.form.get('bgVariationType').value;
    }
  }

  unSelectbgVariationType(isEvent: boolean, presentValue: string) {
    const hideFieldsArray: string[] = [];
    this.allIncDecFields.forEach(element => hideFieldsArray.push(element));
    this.regularFieldsToShow.forEach(element => hideFieldsArray.push(element));
    this.unSelectButton(isEvent, 'bgVariationType', presentValue, this.previousbgVariationTypeValue, hideFieldsArray, hideFieldsArray);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_TYPE_CODE);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND)
    {
      if (!this.form.get('bgVariationType')[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIOUSCOMPAREVALUE])
      {
        this.patchFieldParameters(this.form.get('incDecTypeLabel'), { infoIcon: false, isAmendedLabel: false });
      }
    }
    this.previousbgVariationTypeValue = null;
  }

  selectbgVaritionType() {
    const sectionForm: FCCFormGroup =
      this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);

    if (sectionForm.controls.uiAmountChargeDetails.get('bgCurCode').value === '' ||
      sectionForm.controls.uiAmountChargeDetails.get('bgCurCode').value === undefined ||
      sectionForm.controls.uiAmountChargeDetails.get('bgCurCode').value === null
      || this.uiService.getBgAmt() === '' || this.uiService.getBgAmt() === undefined || this.uiService.getBgAmt() === null) {
      const errorMsg = `${this.translateService.instant('variationError')}`;
      this.form.get('variationError')[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = errorMsg;
      this.form.get('variationError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
    } else {
      this.form.get('variationError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.bgCurCode = (this.uiService.getBgCurCode()
      ? this.uiService.getBgCurCode()
      : sectionForm.controls.uiAmountChargeDetails.get("bgCurCode").value.value
    );
      this.bgAmt = this.uiService.getBgAmt();
      this.variationCurrencyField.setValue(this.bgCurCode);
      this.form.updateValueAndValidity();
      if (this.variationTypeField && this.variationTypeField.value === '01') {
        // Hide all fields
        this.toggleControls(this.form, this.allIncDecFields, false);
        // remove all validators
        this.removeValidators(this.form, this.allIncDecFields);
        this.toggleControls(this.form, this.regularFieldsToShow, true);
        this.toggleRequired(true, this.form, ['bgVariationFirstDate', 'bgVariationFrequency', 'bgVariationPeriod',
          'bgMaximumNbVariation', 'bgVariationAmt']);
        // set required validators
        this.addRequiredValidator(this.form, ['bgVariationFirstDate', 'bgVariationFrequency', 'bgVariationPeriod',
        'bgMaximumNbVariation', 'bgVariationAmt']);
        // check validation on form load
        this.markFieldTouchedandDirty(this.form, ['bgVariationFirstDate', 'bgVariationFrequency', 'bgVariationPeriod',
        'bgMaximumNbVariation', 'bgVariationAmt']);
        this.variationTypeField.setValue('01');
        this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
        if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
          this.form.get('bgOperationType').setValue('02');
        }
        this.removeMandatory([
          "bgVariationFirstDate",
          "bgVariationFrequency",
          "bgVariationPeriod",
          "bgMaximumNbVariation",
          "bgVariationCurCode",
          "bgVariationAmt",
        ]);

      } else if (this.variationTypeField && this.variationTypeField.value === '02') {
        this.toggleControls(this.form, this.allIncDecFields, false);
        // remove all validators
        this.removeValidators(this.form, this.allIncDecFields);
        this.toggleRequired(false, this.form, ['bgVariationFirstDate', 'bgVariationFrequency', 'bgVariationPeriod',
          'bgMaximumNbVariation', 'bgVariationPct', 'bgVariationAmt']);

        this.toggleControls(this.form, ['addVariationType', 'bgAdviseEventLabel', FccGlobalConstant.BG_ADVISE_DAYS_SWITCH], true);
        this.variationTypeField.setValue('02');
        if (this.irregularVariationList.length > 0) {
          this.toggleControls(this.form, ['irregularVariations'], true);
        }
      }
      this.onClickBgAdviseDaysSwitch();

    }
  }

  removeValidationUnSelectButton() {
    this.removeValidators(this.form, this.allIncDecFields);
    this.form.get('variationError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  }

  onClickBgOperationType() {
    if (this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT) && this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT).value ===
    FccGlobalConstant.CODE_Y) {
      this.uiService.validateVariationPercent(this.form.get('bgOperationType').value, this.pctField);
    } else {
      this.uiService.validateVariationAmount(this.form.get('bgOperationType').value, this.variationAmtField, this.uiService.getBgAmt());
    }

  }

   onClickSwitchToPercent() {
    if (this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT) && this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT).value ===
    FccGlobalConstant.CODE_Y) {
      this.toggleControls(this.form, ['bgVariationPct'], true);
      this.toggleControls(this.form, ['bgVariationCurCode', 'bgVariationAmt'], false);
      this.toggleRequired(true, this.form, ['bgVariationPct']);
      this.toggleRequired(false, this.form, ['bgVariationCurCode', 'bgVariationAmt']);
      this.form.get('bgVariationAmt').setValue('');
      this.form.get('bgVariationAmt').clearValidators();
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryField(this.form, 'bgVariationPct', false);
      }
      this.form.updateValueAndValidity();
    } else {
      this.toggleControls(this.form, ['bgVariationPct'], false);
      this.toggleControls(this.form, ['bgVariationCurCode', 'bgVariationAmt'], true);
      this.toggleRequired(false, this.form, ['bgVariationPct']);
      this.toggleRequired(true, this.form, ['bgVariationCurCode', 'bgVariationAmt']);
      this.form.get('bgVariationPct').setValue('');
      this.form.get('bgVariationPct').clearValidators();
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryFields(this.form, ['bgVariationCurCode', 'bgVariationAmt'], false);
      }
      this.form.updateValueAndValidity();
    }
  }

  openIrregularIncDecDialog(rowData, mode, sequence) {
    const irregularIncDecDialogRef = this.dialog.open(UiIrregularIncreaseDecreaseDialogComponent, {
      width: '35vw',
      height: '55vh',
      id: 'uiIncDecDialog',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: { mode, rowData, sequence }
    });
    irregularIncDecDialogRef.afterClosed().subscribe(result => {

      if (result !== null && result !== undefined && result.data !== '') {
        // eslint-disable-next-line no-console
        console.log(`Dialog result: ${result.data}`);
        // Update the same element in case of edit.
        if (mode === FccGlobalConstant.ACTION_EDIT) {
          const indexofEditedElement = this.irregularVariationList.findIndex((variation) =>
           variation.variationSequence === result.data.variationSequence);

          if (indexofEditedElement === -1) {
              // do nothing.
          } else {
            this.irregularVariationList[indexofEditedElement] = result.data;
          }
        } else {
          this.irregularVariationList.push(result.data);
        }
        this.form.get('irregularVariations')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = this.irregularVariationList;
        this.form.get('irregularVariations')[FccGlobalConstant.PARAMS][`hasData`] = true;
        this.form.get('irregularVariations')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.uiService.calculateAndValidateTotalVariation(this.irregularVariationList, this.uiService.getBgAmt(),
        this.form.get(this.INVALID_VARIATION_ERROR));
        this.form.updateValueAndValidity();
      }
    });

  }
  onClickAddVariationType() {
    const sequence = this.irregularVariationList.length + 1;
    this.openIrregularIncDecDialog('', '', sequence);
  }


  onEditIncreaseDecrease(rowData: any) {
    this.openIrregularIncDecDialog(rowData, FccGlobalConstant.ACTION_EDIT, '');
  }

  onDiscardIncreaseDecrease(rowIndex: number) {
    if (this.irregularVariationList.length > 0) {
      this.irregularVariationList.splice(rowIndex, FccGlobalConstant.LENGTH_1);
      this.uiService.calculateAndValidateTotalVariation(this.irregularVariationList, this.uiService.getBgAmt(),
      this.form.get(this.INVALID_VARIATION_ERROR));
    }
  }

  onClickBgVariationFirstDate() {
    const firstDate = this.form.get(this.bgVariationFirstDateField).value;
    if (this.uiService.getBgExpDate() !== null &&
    this.uiService.getBgExpDate() !== '' &&
    this.uiService.getBgExpDate() !== undefined) {
    this.expiryDate = this.uiService.getBgExpDate();
}
    if (this.uiService.getBgFinalExpiryDate() !== null && this.uiService.getBgFinalExpiryDate() !== '' &&
    this.uiService.getBgFinalExpiryDate() !== undefined) {
    this.extsnExiryDate = this.uiService.getBgFinalExpiryDate();
  }
    if (firstDate !== null && firstDate !== '') {
    this.uiService.setBgFirstDateValidator(firstDate, this.expiryDate, this.extsnExiryDate, this.form.get(this.bgVariationFirstDateField));
    }
  }
  onClickBgAdviseDaysSwitch() {
    const bgAdviseDaysSwitchvalue = this.form.get(FccGlobalConstant.BG_ADVISE_DAYS_SWITCH).value;
    const bgAdviseDaysPriorNb = [FccGlobalConstant.BG_ADVISE_DAYS_NOTICE];
    if (bgAdviseDaysSwitchvalue === FccGlobalConstant.CODE_Y) {
      this.toggleControls(this.form, bgAdviseDaysPriorNb, true);
    } else {
      this.toggleControls(this.form, bgAdviseDaysPriorNb, false);
      this.resetValues(this.form, bgAdviseDaysPriorNb);
    }
    this.onChangeBgAdviseDaysPriorNb();
    this.form.updateValueAndValidity();
  }

  onChangeBgAdviseDaysPriorNb() {
    const daysNumber = this.form.get(this.bgAdviseDaysPriorNbField).value;
    if (this.uiService.getBgExpDate() !== null &&
    this.uiService.getBgExpDate() !== '' &&
    this.uiService.getBgExpDate() !== undefined) {
    this.expiryDate = this.uiService.getBgExpDate();
}
    if (this.uiService.getBgFinalExpiryDate() !== null && this.uiService.getBgFinalExpiryDate() !== '' &&
    this.uiService.getBgFinalExpiryDate() !== undefined) {
    this.extsnExiryDate = this.uiService.getBgFinalExpiryDate();
  }
    if (daysNumber !== null && daysNumber !== '') {
    this.uiService.validateBgVariationDaysNotice(this.form.get(this.bgAdviseDaysPriorNbField),
    this.form.get(this.bgVariationFirstDateField), this.expiryDate, this.extsnExiryDate);
  }
  }

  onFocusBgAdviseDaysPriorNb() {
    const daysNumber = this.form.get(this.bgAdviseDaysPriorNbField).value;
    if (this.uiService.getBgExpDate() !== null &&
    this.uiService.getBgExpDate() !== '' &&
    this.uiService.getBgExpDate() !== undefined) {
    this.expiryDate = this.uiService.getBgExpDate();
}
    if (this.uiService.getBgFinalExpiryDate() !== null && this.uiService.getBgFinalExpiryDate() !== '' &&
    this.uiService.getBgFinalExpiryDate() !== undefined) {
    this.extsnExiryDate = this.uiService.getBgFinalExpiryDate();
  }
    if (daysNumber !== null && daysNumber !== '') {
    this.uiService.validateBgVariationDaysNotice(this.form.get(this.bgAdviseDaysPriorNbField),
    this.form.get(this.bgVariationFirstDateField), this.expiryDate, this.extsnExiryDate);
  }
  }

  onFocusBgVariationAmt() {
    // For decrease operation, the decrease amount should be less than the undertaking amount.
    // If greater or equal, then the bg amt will become negative value.
    this.OnClickAmountFieldHandler('bgVariationAmt');
    this.uiService.validateVariationAmount(this.form.get('bgOperationType').value, this.variationAmtField, this.uiService.getBgAmt());
  }

  onFocusBgVariationPct() {
    this.uiService.validateVariationPercent(this.form.get('bgOperationType').value, this.pctField);
  }

  onFocusBgVariationDayInMonth() {
    // Day in Month should accept only numbers 1-31.
    this.form.addFCCValidators('bgVariationDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);
  }

  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
    this.mergeVariationDetails();
    const typeValues = ['01', '02'];
    if (typeValues.indexOf(this.form.get('bgVariationType').value) > -1) {
    this.form.get(FccGlobalConstant.BG_INC_DEC_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
  }

  mergeVariationDetails() {
    const regularMap = [];

    if (this.variationTypeField.value === '01') {
      // If the percent field is valid, then calculate and set the amount field.
      if (this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT).value === FccGlobalConstant.CODE_Y) {
        if (this.fieldHasValue(this.pctField) && !this.pctField.invalid) {
          const variationAmt = this.uiService.calculateVariationAmt(this.uiService.getBgAmt(), this.pctField.value);
          this.form.get('bgVariationAmt').setValue(variationAmt);
        } else {
          this.form.get('bgVariationAmt').setValue('');
        }
      }
      const selectedJson: { operation: any, first_date: any, percentage: any, amount: any, cur_code: any,
      sequence: any; advise_flag: any, advise_reduction_days: any, maximum_nb_days: any, frequency: any, period: any, day_in_month: any,
        type: any, section_type: any } = {
        operation: this.form.get('bgOperationType').value,
        first_date: (this.form.get("bgVariationFirstDate").value
        ? this.utilityService.transformDateFormat(
            this.form.get("bgVariationFirstDate").value
          )
        : ""
      ),
        percentage: (this.form.get('bgVariationPct').value ? this.form.get('bgVariationPct').value : ''),
        amount: (this.form.get('bgVariationAmt').value ? this.form.get('bgVariationAmt').value : ''),
        cur_code: (this.form.get('bgVariationCurCode').value ? this.form.get('bgVariationCurCode').value : ''),
        sequence: this.variationTypeField.value,
        advise_flag: (this.form.get(FccGlobalConstant.BG_ADVISE_DAYS_SWITCH).value ?
        this.form.get(FccGlobalConstant.BG_ADVISE_DAYS_SWITCH).value : FccGlobalConstant.CODE_N),
        advise_reduction_days: (this.form.get(FccGlobalConstant.BG_ADVISE_DAYS_NOTICE).value ?
        this.form.get(FccGlobalConstant.BG_ADVISE_DAYS_NOTICE).value : ''),
        maximum_nb_days: (this.form.get('bgMaximumNbVariation').value ? this.form.get('bgMaximumNbVariation').value : ''),
        frequency: (this.form.get('bgVariationFrequency').value ? this.form.get('bgVariationFrequency').value : ''),
        period: (this.form.get('bgVariationPeriod').value ? this.form.get('bgVariationPeriod').value : ''),
        day_in_month: (this.form.get('bgVariationDayInMonth').value ? this.form.get('bgVariationDayInMonth').value : '') ,
        type: '01',
        section_type: '01',
    };
      regularMap.push(selectedJson);
  } else if (this.variationTypeField.value === '02') {
    if (this.irregularVariationList.length > 0) {
      this.irregularVariationList.forEach(element => {
        const selectedJson: { operation: any, first_date: any, percentage: any, amount: any, cur_code: any,
          sequence: any, type: any, section_type: any, advise_flag: any, advise_reduction_days: any } = {
            operation: element.operationType,
            first_date: element.variationFirstDate,
            percentage: (element.variationPct ? element.variationPct : ''),
            amount: element.variationAmt,
            cur_code: element.variationCurCode,
            sequence: element.variationSequence,
            type: '02',
            section_type: '01',
            advise_flag: (this.form.get(FccGlobalConstant.BG_ADVISE_DAYS_SWITCH).value ?
            this.form.get(FccGlobalConstant.BG_ADVISE_DAYS_SWITCH).value : FccGlobalConstant.CODE_N),
            advise_reduction_days: (this.form.get(FccGlobalConstant.BG_ADVISE_DAYS_NOTICE).value ?
            this.form.get(FccGlobalConstant.BG_ADVISE_DAYS_NOTICE).value : ''),
        };
        regularMap.push(selectedJson);
      });
    }
  }
    this.resetAmountFieldsForLengthValidation();
    this.form.get('bgVariationsLists').setValue(regularMap);
    if (this.form[`bgVariationsLists`] !== '') {
      this.bgVariation = { variation_line_item: this.form.get('bgVariationsLists').value };
    }

    this.form.get('bgVariations').setValue(this.bgVariation);
    this.productStateService.setStateSection(FccGlobalConstant.UI_UNDERTAKING_DETAILS, this.parentForm, this.isMasterRequired);
  }
  removeMandatory(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

}
