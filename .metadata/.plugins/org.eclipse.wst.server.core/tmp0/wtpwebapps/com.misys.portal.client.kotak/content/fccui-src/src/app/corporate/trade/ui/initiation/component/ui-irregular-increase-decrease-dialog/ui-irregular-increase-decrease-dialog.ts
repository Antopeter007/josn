import { Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
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
import { HideShowDeleteWidgetsService } from './../../../../../../common/services/hide-show-delete-widgets.service';
import { UiService } from './../../../common/services/ui-service';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ui-irregular-increase-decrease-dialog',
  templateUrl: './ui-irregular-increase-decrease-dialog.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiIrregularIncreaseDecreaseDialogComponent }]
})

export class UiIrregularIncreaseDecreaseDialogComponent extends UiProductComponent implements OnInit {
  form: FCCFormGroup;
  module = ``;
  bgVariationFirstDateField = 'bgVariationFirstDate';
  bgAdviseDaysPriorNbField = 'bgAdviseDaysPriorNb';
  expiryDate: any;
  extsnExiryDate: any;
  datePipe: any;
  variationSequence: any;
  data: any;
  isMasterRequired: any;

  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected tradeCommonDataService: TradeCommonDataService, protected uiService: UiService,
              protected confirmationService: ConfirmationService, protected dialogRef: DynamicDialogRef,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected matDialogRef: MatDialogRef<UiIrregularIncreaseDecreaseDialogComponent>,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService,
              @Inject(MAT_DIALOG_DATA) data) {
    super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray, dialogRef, currencyConverterPipe,
      uiProductService);
    this.data = data;
  }

  ngOnInit() {
    this.isMasterRequired = this.isMasterRequired;
    this.initializeFormGroup();
    this.initializeFormValues();
    this.setFormValidations();

  }

  initializeFormGroup() {
    this.form =
    this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_IRREGULAR_INC_DEC_DETAILS, undefined, this.isMasterRequired);
  }

  initializeFormValues() {
    this.resetBgVariationAmtFieldLengthValidation();
    if (this.data.mode === 'EDIT') {
      this.populateDataForEdit(this.data.rowData);
    } else {
      const curCode = this.uiService.getBgCurCode();
      this.form.get('bgVariationCurCode').setValue(curCode);
      this.variationSequence = this.data.sequence;
      this.form.get('addUiIrregularVariation')[FccGlobalConstant.PARAMS][`btndisable`] = true;

    }
  }

  resetBgVariationAmtFieldLengthValidation() {
    this.setAmountLengthValidator('bgVariationAmt');
  }

  setFormValidations() {
    if (this.form.get('bgVariationPct')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) {
      this.toggleRequired(true, this.form, ['bgVariationPct']);
    } else if (this.form.get('bgVariationAmt')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) {
      this.toggleRequired(true, this.form, ['bgVariationAmt']);
    }
    this.form.addFCCValidators('bgAdviseDaysPriorNb', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('bgVariationPct', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('bgVariationAmt', Validators.pattern(this.commonService.getRegexBasedOnlanguage()), 0);
    // Day in Month should accept only numbers 1-31.
    this.form.addFCCValidators('bgVariationDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);
    // Percentage should accept only decimals(upto 2 digits) or integers from 1-100, for decrease operation
    if (this.form.get('bgOperationType').value === '02') {
      this.form.addFCCValidators('bgVariationPct', Validators.pattern(FccGlobalConstant.percentagePattern), 0);
    }
  }

  onClickSwitchToPercent() {
    if (this.form.get('switchToPercent') && this.form.get('switchToPercent').value === 'Y') {
      this.toggleControls(this.form, ['bgVariationPct'], true);
      this.toggleControls(this.form, ['bgVariationCurCode', 'bgVariationAmt'], false);
      this.toggleRequired(true, this.form, ['bgVariationPct']);
      this.toggleRequired(false, this.form, ['bgVariationCurCode', 'bgVariationAmt']);
      this.form.updateValueAndValidity();
    } else {
      this.toggleControls(this.form, ['bgVariationPct'], false);
      this.toggleControls(this.form, ['bgVariationCurCode', 'bgVariationAmt'], true);
      this.toggleRequired(false, this.form, ['bgVariationPct']);
      this.toggleRequired(true, this.form, ['bgVariationCurCode', 'bgVariationAmt']);
      this.form.updateValueAndValidity();
    }
  }

  addUiIrregularVariation() {
    if (this.form.get('switchToPercent') && this.form.get('switchToPercent').value === 'Y') {
      const variationAmt = this.uiService.calculateVariationAmt(this.uiService.getBgAmt(), this.form.get('bgVariationPct').value);
      this.form.get(`bgVariationAmt`).setValue(variationAmt);
    }
    const curCode = this.form.get('bgVariationCurCode').value;
    const amt = this.form.get('bgVariationAmt').value;
    const irregularVariationDetails : IrregularIncreaseDecrease = {
      operationType: this.form.get('bgOperationType').value,
      operation: this.tradeCommonDataService.getIncDecOperation(this.form.get('bgOperationType').value),
      variationFirstDate: (this.form.get("bgVariationFirstDate").value
      ? this.utilityService.transformDateFormat(
          this.form.get("bgVariationFirstDate").value
        )
      : ""
    ),
      variationPct: this.form.get('bgVariationPct').value,
      variationAmt: amt,
      variationCurCode: curCode,
      variationSequence: this.variationSequence,
      variationAmtAndCurCode: curCode.concat(' ').concat(amt),
      type: '02',
      sectionType: '01'
    };
    this.resetBgVariationAmtFieldLengthValidation();
    this.matDialogRef.close({ data: irregularVariationDetails });
  }

  onClickAddUiIrregularVariation() {
    this.addUiIrregularVariation();
  }

  onFocusAddUiIrregularVariation() {
    this.addUiIrregularVariation();
  }

  onClickCancel() {
    this.matDialogRef.close();
  }

  onFocusCancel() {
    this.matDialogRef.close();
  }

  populateDataForEdit(rowData) {
    this.form.get('bgOperationType').setValue(rowData[`operationType`]);
    this.form.get('bgVariationFirstDate').setValue(this.commonService.convertToDateFormat(rowData[`variationFirstDate`]));
    this.variationSequence = rowData.variationSequence;
    if (rowData[`variationPct`] !== '') {
      this.form.get('bgVariationPct').setValue(rowData[`variationPct`]);
    }
    if (rowData[`bgVariationAmt`] !== '') {
      this.form.get('bgVariationAmt').setValue(rowData[`variationAmt`]);
      this.form.get('bgVariationCurCode').setValue(rowData[`variationCurCode`]);
    }
  }

  onClickBgVariationFirstDate() {
    const firstDate = this.form.get(this.bgVariationFirstDateField).value;
    if (this.uiService.getBgExpDate() !== null && this.uiService.getBgExpDate() !== '' && this.uiService.getBgExpDate() !== undefined) {
      this.expiryDate = this.uiService.getBgExpDate();
    }
    if (this.uiService.getBgFinalExpiryDate() !== null &&
      this.uiService.getBgFinalExpiryDate() !== '' &&
      this.uiService.getBgFinalExpiryDate() !== undefined) {
      this.extsnExiryDate = this.uiService.getBgFinalExpiryDate();
    }
    if (firstDate !== null && firstDate !== '') {
    this.uiService.setBgFirstDateValidator(firstDate, this.expiryDate, this.extsnExiryDate, this.form.get(this.bgVariationFirstDateField));
    }
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
      this.form.get(this.bgVariationFirstDateField),
      this.expiryDate, this.extsnExiryDate);
    }
  }

  onFocusBgVariationAmt() {
    this.OnClickAmountFieldHandler('bgVariationAmt');
    const variationAmtField = this.form.get('bgVariationAmt');
    if (this.fieldHasValue(variationAmtField)) {
      this.form.get('addUiIrregularVariation')[FccGlobalConstant.PARAMS][`btndisable`] = false;
    }
    // For decrease operation, the decrease amount should be less than the undertaking amount.
    // If greater or equal, then the bg amt will become negative value.
    this.uiService.validateVariationAmount(this.form.get('bgOperationType').value, variationAmtField, this.uiService.getBgAmt());
  }

  onFocusBgVariationPct() {
    const pctField = this.form.get('bgVariationPct');
    this.uiService.validateVariationPercent(this.form.get('bgOperationType').value, pctField);
    if (this.fieldHasValue(pctField)) {
      this.form.get('addUiIrregularVariation')[FccGlobalConstant.PARAMS][`btndisable`] = false;
    }
    // If the percent field is valid, then calculate and set the amount field.
    if (!pctField.invalid) {
      const variationAmt = this.uiService.calculateVariationAmt(this.uiService.getBgAmt(), pctField.value);
      this.form.get('bgVariationAmt').setValue(variationAmt);
    } else {
      this.form.get('bgVariationAmt').setValue('');
    }
  }

  onFocusBgVariationDayInMonth() {
    // Day in Month should accept only numbers 1-31.
    this.form.addFCCValidators('bgVariationDayInMonth', Validators.pattern(FccGlobalConstant.REGEX_DATE_NUMBER), 0);
  }

  onKeyupBgVariationAmt() {
    const variationAmtField = this.form.get('bgVariationAmt');
    if (this.fieldHasValue(variationAmtField)) {
      this.form.get('addUiIrregularVariation')[FccGlobalConstant.PARAMS][`btndisable`] = false;
    }
    this.resetBgVariationAmtFieldLengthValidation();
  }
  onKeyupBgVariationPct() {
    const pctField = this.form.get('bgVariationPct');
    if (this.fieldHasValue(pctField)) {
      this.form.get('addUiIrregularVariation')[FccGlobalConstant.PARAMS][`btndisable`] = false;
    }
  }

}
