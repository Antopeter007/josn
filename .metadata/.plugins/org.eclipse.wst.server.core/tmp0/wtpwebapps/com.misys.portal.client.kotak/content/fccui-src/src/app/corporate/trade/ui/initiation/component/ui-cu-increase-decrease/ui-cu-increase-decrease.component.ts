import { Overlay } from '@angular/cdk/overlay';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { IrregularIncreaseDecrease } from '../../../common/model/irregular-increase-decrease.model';
import { Variation } from '../../../common/model/Variation.model';
import { UiService } from '../../../common/services/ui-service';
import {
  UiCuIrregularIncreaseDecreaseComponent
} from '../ui-cu-irregular-increase-decrease-dialog/ui-cu-irregular-increase-decrease-dialog';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { TradeCommonDataService } from './../../../../common/service/trade-common-data.service';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ui-cu-increase-decrease',
  templateUrl: './ui-cu-increase-decrease.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiCuIncreaseDecreaseComponent }]
})
export class UiCuIncreaseDecreaseComponent extends UiProductComponent implements OnInit, OnDestroy {

  form: FCCFormGroup;
  module = ``;
  @Input() parentForm: FCCFormGroup;
  @Input() controlName;
  @Input() data;
  pctField: AbstractControl;
  cuVariationFirstDateField = 'cuVariationFirstDate';
  cuAdviseDaysPriorNbField = FccGlobalConstant.CU_ADVISE_DAYS_NOTICE;
  variationAmtField: AbstractControl;
  option: any;
  cuCurCode;
  cuAmt;
  expiryDate;
  extsnExiryDate;
  VARIATION_DEP_FIELD_ERROR = 'variationError';
  INVALID_VARIATION_ERROR = 'invalidVariationError';
  cuVariation: Variation;
  private irregularVariationList: IrregularIncreaseDecrease [] = [];
  isMasterRequired: any;
  variationCurrencyField: AbstractControl;
  variationTypeField: AbstractControl;
  previouscuVariationTypeValue: any;
  allIncDecFields;
  regularFieldsToShow;

  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected dialogService: DialogService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected tradeCommonDataService: TradeCommonDataService, protected uiService: UiService,
              protected dialog: MatDialog, public overlay: Overlay,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray, dialogRef,
                currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.isMasterRequired = this.isMasterRequired;
    this.initializeFormGroup();
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.pctField = this.form.get('cuVariationPct');
    this.variationAmtField = this.form.get('cuVariationAmt');
    this.variationCurrencyField = this.form.get('cuVariationCurCode');
    this.variationTypeField = this.form.get('cuVariationType');
    this.initializeFormValues();
    this.setFormValidations();
    this.commonService.responseChipConfirmationDialog$.subscribe(data => {
      if (data && data.action && data.controlName === 'cuVariationType') {
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

  resetCuAmtNdCuVariationAmtFields() {
    this.setAmountLengthValidatorList(['cuVariationAmt', 'cuAmt']);
  }

  initializeFormValues() {
    const cuVariationPeriod = this.tradeCommonDataService.getPeriodOptions('');
    if (this.form.get('cuVariationPeriod')) {
      this.form.get('cuVariationPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = cuVariationPeriod;
    }
    this.cuCurCode = this.uiService.getCuCurCode();
    this.cuAmt = this.uiService.getCuAmt();
    if (this.commonService.isnonEMptyString(this.cuCurCode) && this.form.get('cuVariationAmt') 
    && this.commonService.isnonEMptyString(this.form.get('cuVariationAmt').value) ){
      if (this.form.get('cuVariationCurCode')&& this.form.get('cuVariationAmt').value != " ") {
        this.form.get('cuVariationCurCode').setValue(this.cuCurCode);
      }
    }
    else 
    {
      if (this.form.get('cuVariationCurCode')) {
        this.form.get('cuVariationCurCode').setValue('');
      }
    }
    this.form.get(FccGlobalConstant.CU_INC_DEC_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.resetCuAmtNdCuVariationAmtFields();
    this.populateDataForCopyFrom();
  }
  onBlurCuVariationAmt() {
    const cuVariationAmt = this.form.get('cuVariationAmt').value;
    const cuVariationCurCode = this.form.get('cuVariationCurCode').value;
    if (cuVariationAmt !== '') {
      if (cuVariationCurCode !== '' || cuVariationCurCode !== undefined) {
        let valueupdated = this.commonService.replaceCurrency(cuVariationAmt);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), cuVariationCurCode);
        this.form.get('cuVariationAmt').setValue(valueupdated);
        this.form.get('cuVariationAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      }
      this.resetCuAmtNdCuVariationAmtFields();
      this.form.get('cuVariationAmt').updateValueAndValidity();
    }
  }
  populateDataForCopyFrom() {
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (this.hasVariation() && (this.tnxTypeCode === FccGlobalConstant.N002_NEW &&
      mode === FccGlobalConstant.DRAFT_OPTION)
      || this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.onClickCuVariationType();

      if (this.form.get('cuVariationType') && (this.form.get('cuVariationType').value === '02' ||
      (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuVariationType').value[0]
      && this.form.get('cuVariationType').value[0].value === '02'))) {
        this.form.get('cuIrregularVariations')[FccGlobalConstant.PARAMS][`hasData`] = true;
        this.form.get('cuIrregularVariations')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.uiService.calculateAndValidateTotalVariation(this.irregularVariationList, this.uiService.getCuAmt(),
        this.form.get(this.INVALID_VARIATION_ERROR));
        const irregularDataList: [] = this.form.get('cuIrregularVariations')[FccGlobalConstant.PARAMS][`data`] as [];

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
      if (this.form.get('cuVariationType') && (this.form.get('cuVariationType').value === '01' ||
      (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuVariationType').value[0] &&
      this.form.get('cuVariationType').value[0].value === '01'))) {
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

  hasVariation(): boolean {
    return (this.form.get('cuVariationType') &&
    !(this.form.get('cuVariationType').value === '' || this.form.get('cuVariationType').value === null));
  }

  handleResponse(data) {
    if (data.action === 'cancelled') {
      this.form.get(data.controlName).setValue(data.previousValue);
      this.form.get(data.controlName).updateValueAndValidity();
    } else if (data.action === 'toggle') {
      this.selectCuVaritionType();
    } else if (data.action === 'deselect') {
      this.unSelectCuVariationType(true, data.presentValue);
    }
    this.previouscuVariationTypeValue = this.form.get(data.controlName).value;
  }

  onClickCuVariationType(event?) {
    this.allIncDecFields = ['addCuVariationType', 'cuOperationType', 'cuVariationFirstDate', 'cuAdviseEventLabel',
    FccGlobalConstant.CU_ADVISE_DAYS_SWITCH, 'cuVariationFrequency', 'cuVariationPeriod', 'cuMaximumNbVariation', 'cuVariationDayInMonth',
    'switchToPercent', 'cuVariationPct', 'cuVariationCurCode', 'cuVariationAmt', 'cuIrregularVariations'];

    this.regularFieldsToShow = ['cuOperationType', 'cuVariationFirstDate', 'cuAdviseEventLabel', FccGlobalConstant.CU_ADVISE_DAYS_SWITCH,
    'cuVariationFrequency', 'cuVariationPeriod', 'cuMaximumNbVariation', 'cuVariationDayInMonth', 'switchToPercent',
    'cuVariationCurCode', 'cuVariationAmt'];

    if (this.isChipEvent(event, this.previouscuVariationTypeValue)) {
      const presentValue = event[FccGlobalConstant.SOURCE][FccGlobalConstant.VALUE];
      const data = {
        controlName: 'cuVariationType',
        previousValue: this.previouscuVariationTypeValue,
        presentValue,
        event: true
      };
      this.commonService.openChipConfirmationDialog$.next(data);
    } else {
      this.selectCuVaritionType();
      this.previouscuVariationTypeValue = this.form.get('cuVariationType').value;
    }
  }

  unSelectCuVariationType(isEvent: boolean, presentValue: string) {
    const hideFieldsArray: string[] = [];
    this.allIncDecFields.forEach(element => hideFieldsArray.push(element));
    this.regularFieldsToShow.forEach(element => hideFieldsArray.push(element));
    this.unSelectButton(isEvent, 'cuVariationType', presentValue, this.previouscuVariationTypeValue, hideFieldsArray, hideFieldsArray);
    this.previouscuVariationTypeValue = null;
  }

  selectCuVaritionType() {
    const sectionForm: FCCFormGroup =
    this.productStateService.getSectionData(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
    if (sectionForm.controls.uiCuAmountChargeDetails.get('cuCurCode').value === '' ||
      sectionForm.controls.uiCuAmountChargeDetails.get('cuCurCode').value === undefined ||
      sectionForm.controls.uiCuAmountChargeDetails.get('cuCurCode').value === null ||
      this.uiService.getCuAmt() === '' || this.uiService.getCuAmt() === undefined ||
      this.uiService.getCuAmt() === null) {
      const errorMsg = `${this.translateService.instant('variationError')}`;
      this.form.get('variationError')[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = errorMsg;
      this.form.get('variationError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
    } else {
      this.form.get('variationError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.cuCurCode = (this.uiService.getBgCurCode() ? this.uiService.getBgCurCode() : 
      sectionForm.controls.uiCuAmountChargeDetails.get('cuCurCode').value.value);
      if (this.form.get('cuVariationCurCode')) {
        this.form.get('cuVariationCurCode').setValue(this.cuCurCode);
      }
      this.form.updateValueAndValidity();
      if (this.form.get('cuVariationType') && (this.form.get('cuVariationType').value === '01') ||
      (this.form.get('cuVariationType') && this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuVariationType').value[0]
      && this.form.get('cuVariationType').value[0].value === '01')) {
        // Hide all fields
        this.toggleControls(this.form, this.allIncDecFields, false);
        // remove all validators
        this.removeValidators(this.form, this.allIncDecFields);
        this.toggleControls(this.form, this.regularFieldsToShow, true);

        this.toggleRequired(true, this.form, ['cuVariationFirstDate', 'cuVariationFrequency', 'cuVariationPeriod',
          'cuMaximumNbVariation', 'cuVariationAmt']);
        // set required validators
        this.addRequiredValidator(this.form, ['cuVariationFirstDate', 'cuVariationFrequency', 'cuVariationPeriod',
        'cuMaximumNbVariation', 'cuVariationAmt']);
        // check validation on form load
        this.markFieldTouchedandDirty(this.form, ['cuVariationFirstDate', 'cuVariationFrequency', 'cuVariationPeriod',
        'cuMaximumNbVariation', 'cuVariationAmt']);
        if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
          this.form.get('cuVariationType').setValue('01');
          this.form.get('cuOperationType').setValue('01');
        }
        this.removeMandatory([
          "cuVariationFirstDate",
          "cuVariationFrequency",
          "cuVariationPeriod",
          "cuMaximumNbVariation",
          "cuVariationCurCode",
          "cuVariationAmt",
        ]);

      } else if (this.form.get('cuVariationType') && (this.form.get('cuVariationType').value === '02') ||
        (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('cuVariationType') && this.form.get('cuVariationType').value[0]
        && this.form.get('cuVariationType').value[0].value === '02')) {

        this.toggleControls(this.form, this.allIncDecFields, false);
        // remove all validators
        this.removeValidators(this.form, this.allIncDecFields);
        this.toggleRequired(false, this.form, ['cuVariationFirstDate', 'cuVariationFrequency', 'cuVariationPeriod',
          'cuMaximumNbVariation', 'cuVariationPct', 'cuVariationAmt']);
        if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
          this.toggleControls(this.form, ['addCuVariationType', 'cuAdviseEventLabel', FccGlobalConstant.CU_ADVISE_DAYS_SWITCH], true);
        }
        if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
          this.form.get('cuVariationType').setValue('02');
        }
        if (this.irregularVariationList.length > 0) {
          this.toggleControls(this.form, ['cuIrregularVariations'], true);
        }
      }
      this.onClickCuAdviseDaysSwitch();
    }
    this.resetCuAmtNdCuVariationAmtFields();
  }

  removeValidationUnSelectButton() {
    this.removeValidators(this.form, this.allIncDecFields);
    this.form.get('variationError')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  }

  onClickCuAdviseDaysSwitch() {
    const cuAdviseDaysSwitchvalue = this.form.get(FccGlobalConstant.CU_ADVISE_DAYS_SWITCH).value;
    const cuAdviseDaysPriorNb = [FccGlobalConstant.CU_ADVISE_DAYS_NOTICE];
    if (cuAdviseDaysSwitchvalue === FccGlobalConstant.CODE_Y) {
      this.toggleControls(this.form, cuAdviseDaysPriorNb, true);
    } else {
      if (this.form && this.form.get(FccGlobalConstant.CU_ADVISE_DAYS_NOTICE)) {
        this.toggleControls(this.form, cuAdviseDaysPriorNb, false);
      }
      if (this.form && this.form.get(FccGlobalConstant.CU_ADVISE_DAYS_NOTICE)) {
        this.resetValues(this.form, cuAdviseDaysPriorNb);
      }
    }
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.onChangeCuAdviseDaysPriorNb();
    }
    this.form.updateValueAndValidity();
  }

  onClickSwitchToPercent() {
    if (this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT) && this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT).value ===
    FccGlobalConstant.CODE_Y) {
      this.toggleControls(this.form, ['cuVariationPct'], true);
      this.toggleControls(this.form, ['cuVariationCurCode', 'cuVariationAmt'], false);
      this.toggleRequired(true, this.form, ['cuVariationPct']);
      this.toggleRequired(false, this.form, ['cuVariationCurCode', 'cuVariationAmt']);
      this.form.get('cuVariationAmt').setValue('');
      this.form.get('cuVariationAmt').clearValidators();
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryField(this.form, 'cuVariationPct', false);
      }
      this.form.updateValueAndValidity();
    } else {
      this.toggleControls(this.form, ['cuVariationPct'], false);
      this.toggleControls(this.form, ['cuVariationCurCode', 'cuVariationAmt'], true);
      this.toggleRequired(false, this.form, ['cuVariationPct']);
      this.toggleRequired(true, this.form, ['cuVariationCurCode', 'cuVariationAmt']);
      this.form.get('cuVariationPct').setValue('');
      this.form.get('cuVariationPct').clearValidators();
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.setMandatoryFields(this.form, ['cuVariationCurCode', 'cuVariationAmt'], false);
      }
      this.form.updateValueAndValidity();
    }
  }

  openIrregularIncDecDialog(rowData, mode, sequence) {
    const irregularIncDecDialogRef = this.dialog.open(UiCuIrregularIncreaseDecreaseComponent, {
      width: '35vw',
      height: '55vh',
      id: 'uiCuIncDecDialog',
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
        this.form.get('cuIrregularVariations')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = this.irregularVariationList;
        this.form.get('cuIrregularVariations')[FccGlobalConstant.PARAMS][`hasData`] = true;
        this.form.get('cuIrregularVariations')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.uiService.calculateAndValidateTotalVariation(this.irregularVariationList, this.uiService.getCuAmt(),
        this.form.get(this.INVALID_VARIATION_ERROR));
        this.form.updateValueAndValidity();
      }
    });

  }
  onClickAddCuVariationType() {
    const sequence = this.irregularVariationList.length + 1;
    this.openIrregularIncDecDialog('', '', sequence);
  }
  onEditIncreaseDecrease(rowData) {
    this.openIrregularIncDecDialog(rowData, FccGlobalConstant.ACTION_EDIT, '');
  }

  onDiscardIncreaseDecrease(rowIndex: number) {
    if (this.irregularVariationList.length > 0) {
      this.irregularVariationList.splice(rowIndex, FccGlobalConstant.LENGTH_1);
      this.uiService.calculateAndValidateTotalVariation(this.irregularVariationList, this.uiService.getCuAmt(),
      this.form.get(this.INVALID_VARIATION_ERROR));
    }
  }

  onClickCuVariationFirstDate() {
    const firstDate = this.form.get(this.cuVariationFirstDateField).value;
    if (this.uiService.getCuExpDate() !== null &&
    this.uiService.getCuExpDate() !== '' &&
    this.uiService.getCuExpDate() !== undefined) {
    this.expiryDate = this.uiService.getCuExpDate();
}
    if (this.uiService.getCuFinalExpiryDate() !== null && this.uiService.getCuFinalExpiryDate() !== '' &&
    this.uiService.getCuFinalExpiryDate() !== undefined) {
    this.extsnExiryDate = this.uiService.getCuFinalExpiryDate();
  }
    if (firstDate !== null && firstDate !== '') {
    this.uiService.setCuFirstDateValidator(firstDate, this.expiryDate, this.extsnExiryDate, this.form.get(this.cuVariationFirstDateField));
    }
  }

  onChangeCuAdviseDaysPriorNb() {
    let daysNumber: any;
    if (this.form && this.form.get(this.cuAdviseDaysPriorNbField)) {
      daysNumber = this.form.get(this.cuAdviseDaysPriorNbField).value;
    }
    if (this.uiService.getCuExpDate() !== null &&
    this.uiService.getCuExpDate() !== '' &&
    this.uiService.getCuExpDate() !== undefined) {
    this.expiryDate = this.uiService.getCuExpDate();
  }
    if (this.uiService.getCuFinalExpiryDate() !== null && this.uiService.getCuFinalExpiryDate() !== '' &&
    this.uiService.getCuFinalExpiryDate() !== undefined) {
    this.extsnExiryDate = this.uiService.getCuFinalExpiryDate();
  }
    if (daysNumber !== null && daysNumber !== '' && daysNumber !== undefined) {
    this.uiService.validateCuVariationDaysNotice(this.form.get(this.cuAdviseDaysPriorNbField),
    this.form.get(this.cuVariationFirstDateField), this.expiryDate, this.extsnExiryDate);
  }
}

  onFocusCuAdviseDaysPriorNb() {
    let daysNumber: any;
    if (this.form && this.form.get(this.cuAdviseDaysPriorNbField)) {
      daysNumber = this.form.get(this.cuAdviseDaysPriorNbField).value;
    }
    if (this.uiService.getCuExpDate() !== null &&
    this.uiService.getCuExpDate() !== '' &&
    this.uiService.getCuExpDate() !== undefined) {
    this.expiryDate = this.uiService.getCuExpDate();
}
    if (this.uiService.getCuFinalExpiryDate() !== null && this.uiService.getCuFinalExpiryDate() !== '' &&
    this.uiService.getCuFinalExpiryDate() !== undefined) {
    this.extsnExiryDate = this.uiService.getCuFinalExpiryDate();
  }
    if (daysNumber !== null && daysNumber !== '' && daysNumber !== undefined) {
    this.uiService.validateCuVariationDaysNotice(this.form.get(this.cuAdviseDaysPriorNbField),
    this.form.get(this.cuVariationFirstDateField), this.expiryDate, this.extsnExiryDate);
  }
}

  setFormValidations() {
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
    // Display error message if amount and currency are not entered in amount charges section
    if (this.cuCurCode === '' || this.cuAmt === '') {
      const errorMsg = `${this.translateService.instant(this.VARIATION_DEP_FIELD_ERROR)}`;
      this.form.get(this.VARIATION_DEP_FIELD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = errorMsg;
      this.form.get(this.VARIATION_DEP_FIELD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
    } else {
      this.form.get(this.VARIATION_DEP_FIELD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.updateValueAndValidity();
    }

    this.addNumberFieldValidation();

    // Day in Month should accept only numbers 1-31.
    this.form.addFCCValidators('cuVariationDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);
    // Percentage should accept only decimals(upto 2 digits) or integers from 1-100, for decrease operation
    if (this.form.get('cuOperationType').value === FccGlobalConstant.VAR_DECREASE_OPERATION) {
      this.form.addFCCValidators('cuVariationPct', Validators.pattern(FccGlobalConstant.percentagePattern), 0);
    }
  }
  }

  addNumberFieldValidation() {
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.form.addFCCValidators(FccGlobalConstant.CU_ADVISE_DAYS_NOTICE, Validators.pattern(FccGlobalConstant.numberPattern), 0);
      this.form.addFCCValidators('cuVariationFrequency', Validators.pattern(FccGlobalConstant.numberPattern), 0);
      this.form.addFCCValidators('cuMaximumNbVariation', Validators.pattern(FccGlobalConstant.numberPattern), 0);
      this.form.addFCCValidators('cuVariationPct', Validators.pattern(FccGlobalConstant.numberPattern), 0);
      this.form.addFCCValidators('cuVariationAmt', Validators.pattern(this.commonService.getRegexBasedOnlanguage()), 0);
    }
    this.resetCuAmtNdCuVariationAmtFields();
  }
  removeMandatory(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  onClickCuOperationType() {
    if (this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT) && this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT).value ===
    FccGlobalConstant.CODE_Y) {
      this.uiService.validateVariationPercent(this.form.get('cuOperationType').value, this.pctField);
    } else {
      this.uiService.validateVariationAmount(this.form.get('cuOperationType').value, this.variationAmtField, this.uiService.getCuAmt());
    }

  }

  onFocusCuVariationAmt() {
    this.OnClickAmountFieldHandler('cuVariationAmt');
    // For decrease operation, the decrease amount should be less than the undertaking amount.
    // If greater or equal, then the cu amt will become negative value.
    this.uiService.validateVariationAmount(this.form.get('cuOperationType').value, this.variationAmtField, this.uiService.getCuAmt());
  }

  onFocusCuVariationPct() {
    this.uiService.validateVariationPercent(this.form.get('cuOperationType').value, this.pctField);
  }

  onFocusCuVariationDayInMonth() {
    // Day in Month should accept only numbers 1-31.
    this.form.addFCCValidators('cuVariationDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);
  }

  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
    this.mergeVariationDetails();
    const typeValues = ['01', '02'];
    if (this.form.get('cuVariationType')) {
      if (this.form.get('cuVariationType') &&
      typeValues.indexOf(this.form.get('cuVariationType').value) > -1) {
        this.form.get(FccGlobalConstant.CU_INC_DEC_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
    }
  }

  mergeVariationDetails() {
    const regularMap = [];

    if (this.form.get('cuVariationType') && this.form.get('cuVariationType').value === '01') {
      // If the percent field is valid, then calculate and set the amount field.
      if (this.form.get(FccGlobalConstant.SWITCH_TO_PERCENT).value === FccGlobalConstant.CODE_Y) {
        if (this.fieldHasValue(this.pctField) && !this.pctField.invalid) {
          const variationAmt = this.uiService.calculateVariationAmt(this.uiService.getCuAmt(), this.pctField.value);
          this.form.get('cuVariationAmt').setValue(variationAmt);
        } else {
          this.form.get('cuVariationAmt').setValue('');
        }
      }
      const selectedJson: { operation: any, first_date: any, percentage: any, amount: any, cur_code: any,
      sequence: any; advise_flag: any, advise_reduction_days: any, maximum_nb_days: any, frequency: any, period: any, day_in_month: any,
        type: any, section_type: any } = {
        operation: this.form.get('cuOperationType').value,
        first_date: (this.form.get("cuVariationFirstDate").value
        ? this.utilityService.transformDateFormat(
            this.form.get("cuVariationFirstDate").value
          )
        : ""),
        percentage: (this.form.get('cuVariationPct').value ? this.form.get('cuVariationPct').value : ''),
        amount: (this.form.get('cuVariationAmt').value ? this.form.get('cuVariationAmt').value : ''),
        cur_code: (this.form.get('cuVariationCurCode').value ? this.form.get('cuVariationCurCode').value : ''),
        sequence: this.form.get('cuVariationType').value,
        advise_flag: (this.form.get(FccGlobalConstant.CU_ADVISE_DAYS_SWITCH).value ?
        this.form.get(FccGlobalConstant.CU_ADVISE_DAYS_SWITCH).value : FccGlobalConstant.CODE_N),
        advise_reduction_days: (this.form.get(FccGlobalConstant.CU_ADVISE_DAYS_NOTICE).value ?
        this.form.get(FccGlobalConstant.CU_ADVISE_DAYS_NOTICE).value : ''),
        maximum_nb_days: (this.form.get('cuMaximumNbVariation').value ? this.form.get('cuMaximumNbVariation').value : ''),
        frequency: (this.form.get('cuVariationFrequency').value ? this.form.get('cuVariationFrequency').value : ''),
        period: (this.form.get('cuVariationPeriod').value ? this.form.get('cuVariationPeriod').value : ''),
        day_in_month: (this.form.get('cuVariationDayInMonth').value ? this.form.get('cuVariationDayInMonth').value : ''),
        type: '01',
        section_type: '02',
    };
      regularMap.push(selectedJson);
  } else if (this.form.get('cuVariationType') && this.form.get('cuVariationType').value === '02') {
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
            section_type: '02',
            advise_flag: (this.form.get(FccGlobalConstant.CU_ADVISE_DAYS_SWITCH).value ?
            this.form.get(FccGlobalConstant.CU_ADVISE_DAYS_SWITCH).value : FccGlobalConstant.CODE_N),
            advise_reduction_days: (this.form.get(FccGlobalConstant.CU_ADVISE_DAYS_NOTICE).value ?
            this.form.get(FccGlobalConstant.CU_ADVISE_DAYS_NOTICE).value : ''),
        };
        regularMap.push(selectedJson);
      });
    }
  }
    this.resetCuAmtNdCuVariationAmtFields();
    this.form.get('cuVariationsLists').setValue(regularMap);
    if (this.form[`cuVariationsLists`] !== '') {
      this.cuVariation = { variation_line_item: this.form.get('cuVariationsLists').value };
    }
    this.form.get('cuVariations').setValue(this.cuVariation);
    this.productStateService.setStateSection(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, this.parentForm, this.isMasterRequired);
  }
}
