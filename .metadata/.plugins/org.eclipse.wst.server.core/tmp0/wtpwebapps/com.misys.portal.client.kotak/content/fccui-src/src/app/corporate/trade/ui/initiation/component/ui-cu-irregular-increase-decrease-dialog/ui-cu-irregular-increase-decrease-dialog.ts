import { Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { TradeCommonDataService } from '../../../../common/service/trade-common-data.service';
import { ProductStateService } from '../../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { IrregularIncreaseDecrease } from '../../../common/model/irregular-increase-decrease.model';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { UiService } from './../../../common/services/ui-service';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ui-cu-irregular-increase-decrease-dialog',
  templateUrl: './ui-cu-irregular-increase-decrease-dialog.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiCuIrregularIncreaseDecreaseComponent }]
})
export class UiCuIrregularIncreaseDecreaseComponent extends UiProductComponent implements OnInit {

  form: FCCFormGroup;
  module = ``;
  cuVariationFirstDateField = 'cuVariationFirstDate';
  cuAdviseDaysPriorNbField = 'cuAdviseDaysPriorNb';
  expiryDate: any;
  extsnExiryDate: any;
  datePipe: any;
  variationSequence: any;
  isMasterRequired: any;
  data: any;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected tradeCommonDataService: TradeCommonDataService, protected config: DynamicDialogConfig,
              protected confirmationService: ConfirmationService, protected uiService: UiService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected matDialogRef: MatDialogRef<UiCuIrregularIncreaseDecreaseComponent>,
              protected currencyConverterPipe: CurrencyConverterPipe,
              @Inject(MAT_DIALOG_DATA) data, protected uiProductService: UiProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
              this.data = data;
}

  ngOnInit(): void {
    this.isMasterRequired = this.isMasterRequired;
    this.initializeFormGroup();
    this.initializeFormValues();
    this.setFormValidations();
  }
  initializeFormGroup() {
    this.form =
    this.productStateService.getSectionData(FccGlobalConstant.UI_COUNTER_IRREGULAR_INC_DEC_DETAILS, undefined, this.isMasterRequired);
    this.resetCuVariationAmt();
  }

  initializeFormValues() {
    if (this.data.mode === 'EDIT') {
      this.populateDataForEdit(this.data.rowData);
    } else {
    const curCode = this.uiService.getCuCurCode();
    this.form.get('cuVariationCurCode').setValue(curCode);
    this.variationSequence = this.data.sequence;
    this.form.get('addIrregularVariation')[FccGlobalConstant.PARAMS][`btndisable`] = true;
    }
  }

  resetCuVariationAmt() {
    this.setAmountLengthValidator('cuVariationAmt');
  }

  setFormValidations() {
    if (this.form.get('cuVariationPct')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) {
      this.toggleRequired(true, this.form, ['cuVariationPct']);
    } else if (this.form.get('cuVariationAmt')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) {
      this.toggleRequired(true, this.form, ['cuVariationAmt']);
    }
    this.form.addFCCValidators('cuAdviseDaysPriorNb', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('cuVariationPct', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('cuVariationAmt', Validators.pattern(this.commonService.getRegexBasedOnlanguage()), 0);
    // Day in Month should accept only numbers 1-31.
    this.form.addFCCValidators('cuVariationDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);
    // Percentage should accept only decimals(upto 2 digits) or integers from 1-100, for decrease operation
    if (this.form.get('cuOperationType').value === '02') {
      this.form.addFCCValidators('cuVariationPct', Validators.pattern(FccGlobalConstant.percentagePattern), 0);
    }
    this.resetCuVariationAmt();
  }

  onClickSwitchToPercent() {
    if (this.form.get('switchToPercent') && this.form.get('switchToPercent').value === 'Y') {
      this.toggleControls(this.form, ['cuVariationPct'], true);
      this.toggleControls(this.form, ['cuVariationCurCode', 'cuVariationAmt'], false);
      this.toggleRequired(true, this.form, ['cuVariationPct']);
      this.toggleRequired(false, this.form, ['cuVariationCurCode', 'cuVariationAmt']);
      this.form.updateValueAndValidity();
    } else {
      this.toggleControls(this.form, ['cuVariationPct'], false);
      this.toggleControls(this.form, ['cuVariationCurCode', 'cuVariationAmt'], true);
      this.toggleRequired(false, this.form, ['cuVariationPct']);
      this.toggleRequired(true, this.form, ['cuVariationCurCode', 'cuVariationAmt']);
      this.form.updateValueAndValidity();
    }
    this.resetCuVariationAmt();
  }

  populateDataForEdit(rowData) {
    this.form.get('cuOperationType').setValue(rowData[`operationType`]);
    this.form.get('cuVariationFirstDate').setValue(this.commonService.convertToDateFormat(rowData[`variationFirstDate`]));
    this.variationSequence = rowData.variationSequence;
    if (rowData[`variationPct`] !== '') {
      this.form.get('cuVariationPct').setValue(rowData[`variationPct`]);
    }
    if (rowData[`cuVariationAmt`] !== '') {
      this.form.get('cuVariationAmt').setValue(rowData[`variationAmt`]);
      this.form.get('cuVariationCurCode').setValue(rowData[`variationCurCode`]);
    }
    this.resetCuVariationAmt();
  }

  addIrregularVariation() {
    if (this.form.get('switchToPercent') && this.form.get('switchToPercent').value === 'Y') {
      const variationAmt = this.uiService.calculateVariationAmt(this.uiService.getCuAmt(), this.form.get('cuVariationPct').value);
      this.form.get(`cuVariationAmt`).setValue(variationAmt);
    }
    const curCode = this.form.get('cuVariationCurCode').value;
    const amt = this.form.get('cuVariationAmt').value;
    const irregularVariationDetails : IrregularIncreaseDecrease = {
      operationType: this.form.get('cuOperationType').value,
      operation: this.tradeCommonDataService.getIncDecOperation(this.form.get('cuOperationType').value),
      variationFirstDate: (this.form.get("cuVariationFirstDate").value
      ? this.utilityService.transformDateFormat(
          this.form.get("cuVariationFirstDate").value
        )
      : ""
    ),
      variationPct: this.form.get('cuVariationPct').value,
      variationAmt: amt,
      variationCurCode: curCode,
      variationSequence: this.variationSequence,
      variationAmtAndCurCode: curCode.concat(' ').concat(amt),
      type: '02',
      sectionType: '02'
    };
    this.resetCuVariationAmt();
    this.matDialogRef.close({ data: irregularVariationDetails });
  }

  onClickAddIrregularVariation() {
    this.addIrregularVariation();
  }

  onFocusAddIrregularVariation() {
    this.addIrregularVariation();
  }

  onClickCancel() {
    this.matDialogRef.close({ data: {} });
  }

  onFocusCancel() {
    this.matDialogRef.close({ data: {} });
  }

  onClickCuVariationFirstDate() {
    const firstDate = this.form.get(this.cuVariationFirstDateField).value;
    if (this.uiService.getCuExpDate() !== null && this.uiService.getCuExpDate() !== '' && this.uiService.getCuExpDate() !== undefined) {
      this.expiryDate = this.uiService.getCuExpDate();
    }
    if (this.uiService.getCuFinalExpiryDate() !== null &&
    this.uiService.getCuFinalExpiryDate() !== '' &&
    this.uiService.getCuFinalExpiryDate() !== undefined) {
      this.extsnExiryDate = this.uiService.getCuFinalExpiryDate();
    }
    if (firstDate !== null && firstDate !== '') {
      this.uiService.setCuFirstDateValidator(firstDate, this.expiryDate, this.extsnExiryDate,
        this.form.get(this.cuVariationFirstDateField));
    }
  }

  onChangeCuAdviseDaysPriorNb() {
    const daysNumber = this.form.get(this.cuAdviseDaysPriorNbField).value;
    if (this.uiService.getCuExpDate() !== null &&
      this.uiService.getCuExpDate() !== '' &&
      this.uiService.getCuExpDate() !== undefined) {
      this.expiryDate = this.uiService.getCuExpDate();
    }
    if (this.uiService.getCuFinalExpiryDate() !== null && this.uiService.getCuFinalExpiryDate() !== '' &&
      this.uiService.getCuFinalExpiryDate() !== undefined) {
      this.extsnExiryDate = this.uiService.getCuFinalExpiryDate();
    }
    if (daysNumber !== null && daysNumber !== '') {
      this.uiService.validateCuVariationDaysNotice(this.form.get(this.cuAdviseDaysPriorNbField),
      this.form.get(this.cuVariationFirstDateField),
      this.expiryDate, this.extsnExiryDate);
    }
  }

  onFocusCuVariationAmt() {
    this.OnClickAmountFieldHandler('cuVariationAmt');
    const variationAmtField = this.form.get('cuVariationAmt');
    if (this.fieldHasValue(variationAmtField)) {
      this.form.get('addIrregularVariation')[FccGlobalConstant.PARAMS][`btndisable`] = false;
    }
    // For decrease operation, the decrease amount should be less than the undertaking amount.
    // If greater or equal, then the cu amt will become negative value.
    this.uiService.validateVariationAmount(this.form.get('cuOperationType').value, variationAmtField, this.uiService.getCuAmt());
  }

  onFocusCuVariationPct() {
    const pctField = this.form.get('cuVariationPct');
    this.uiService.validateVariationPercent(this.form.get('cuOperationType').value, pctField);
    if (this.fieldHasValue(pctField)) {
      this.form.get('addIrregularVariation')[FccGlobalConstant.PARAMS][`btndisable`] = false;
    }
    // If the percent field is valid, then calculate and set the amount field.
    if (!pctField.invalid) {
      const variationAmt = this.uiService.calculateVariationAmt(this.uiService.getCuAmt(), pctField.value);
      this.form.get('cuVariationAmt').setValue(variationAmt);
    } else {
      this.form.get('cuVariationAmt').setValue('');
    }
    this.resetCuVariationAmt();
  }

  onFocusCuVariationDayInMonth() {
    // Day in Month should accept only numbers 1-31.
    this.form.addFCCValidators('cuVariationDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);
  }

  onKeyupCuVariationAmt() {
    const variationAmtField = this.form.get('cuVariationAmt');
    if (this.fieldHasValue(variationAmtField)) {
      this.form.get('addIrregularVariation')[FccGlobalConstant.PARAMS][`btndisable`] = false;
    }
    this.resetCuVariationAmt();
  }
  onKeyupCuVariationPct() {
    const pctField = this.form.get('cuVariationPct');
    if (this.fieldHasValue(pctField)) {
      this.form.get('addIrregularVariation')[FccGlobalConstant.PARAMS][`btndisable`] = false;
    }
  }

}
