import { CommonService } from '../../../../../common/services/common.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Constants } from '../../../../../common/constants';
import { validateAmountField, validateDecreaseAmount } from '../../../../../common/validators/common-validator';
import { IssuedUndertaking } from '../../../common/model/issuedUndertaking.model';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';

@Component({
  selector: 'fcc-iu-amend-amount-details',
  templateUrl: './amend-amount-details.component.html',
  styleUrls: ['./amend-amount-details.component.scss']
})
export class AmendAmountDetailsComponent implements OnInit {

  @Input() public bgRecord;
  amendAmtForm: UntypedFormGroup;
  viewMode = false;
  unsignedMode = false;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Output() amountChange = new EventEmitter<any>();
  orgData = new IssuedUndertaking();
  isIncremented = false;
  decimalNumberForCurrency: number;
  currencyDecimalMap = new Map<string, number>();
  originalUndertakingAmt: string;
  userLanguage: string;

  constructor(
    protected fb: UntypedFormBuilder,
    public validationService: ValidationService,
    protected commonDataService: IUCommonDataService,
    public commonService: CommonService
  ) { }

  ngOnInit() {

    this.userLanguage = this.commonService.getUserLanguage();
    if (this.commonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
      this.unsignedMode = true;
      if (this.bgRecord.subTnxTypeCode === '01') {
        this.isIncremented = true;
      } else if (this.bgRecord.subTnxTypeCode === '02') {
        this.isIncremented = false;
      }
    }
    this.orgData = this.commonDataService.getOrgData();
    this.commonDataService.setCurCode(this.bgRecord.bgCurCode, '');
    this.amendAmtForm = this.fb.group({
      incAmt: [''],
      decAmt: [''],
      bgAmt: [''],
      tnxAmt: '',
      tnxCurCode: '',
      subTnxTypeCode: '',
      bgToleranceNegativePct: '',
      bgTolerancePositivePct: '',
      bgNarrativeAdditionalAmount: ''
    });

    //  Fetching the decimal number for the currency
    //  setting the decimal number and the currency in the validator service which is used to show the error message
    this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();
    this.decimalNumberForCurrency = this.currencyDecimalMap.get(this.bgRecord.bgCurCode);
    this.originalUndertakingAmt = this.commonService.transformAmt(this.orgData.bgAmt, this.bgRecord.bgCurCode);
    if (this.bgRecord.bgAmt !== '' && this.bgRecord.bgAmt != null) {
      this.commonService.setUndertakingAmt(this.bgRecord.bgAmt);
    } else {
      this.commonService.setUndertakingAmt(this.originalUndertakingAmt);
    }
    this.commonService.setOrgCurCode(this.bgRecord.bgCurCode);
    this.initFieldValues();
    // Emit the form group to the parent
    this.formReady.emit(this.amendAmtForm);

  }
  initFieldValues() {
    if (this.commonDataService.getMode() === Constants.MODE_DRAFT) {
      let iAmt: string;
      let dAmt: string;

      if (this.bgRecord.subTnxTypeCode === '01') {
        iAmt = this.commonService.transformAmt(this.bgRecord.tnxAmt, this.bgRecord.bgCurCode);
        this.isIncremented = true;
      } else if (this.bgRecord.subTnxTypeCode === '02') {
        dAmt = this.commonService.transformAmt(this.bgRecord.tnxAmt, this.bgRecord.bgCurCode);
        this.isIncremented = false;
      }

      this.amendAmtForm.patchValue({
        entity: this.bgRecord.entity,
        incAmt: iAmt,
        decAmt: dAmt,
        bgAmt: this.commonService.transformAmt(this.bgRecord.bgAmt, this.bgRecord.bgCurCode),
        tnxAmt: this.commonService.transformAmt(this.bgRecord.tnxAmt, this.bgRecord.bgCurCode),
        tnxCurCode: this.bgRecord.tnxCurCode,
        subTnxTypeCode: this.bgRecord.subTnxTypeCode,
        bgToleranceNegativePct: this.bgRecord.bgToleranceNegativePct,
        bgTolerancePositivePct: this.bgRecord.bgTolerancePositivePct,
        bgNarrativeAdditionalAmount: this.bgRecord.bgNarrativeAdditionalAmount
      });
    }
    if (this.commonDataService.getMode() === Constants.MODE_AMEND) {
      this.amendAmtForm.patchValue({
        bgToleranceNegativePct: this.bgRecord.bgToleranceNegativePct,
        bgTolerancePositivePct: this.bgRecord.bgTolerancePositivePct,
        bgNarrativeAdditionalAmount: this.bgRecord.bgNarrativeAdditionalAmount
      });
    }

  }

  calculateNewUndertakingIncreaseAmount() {
    if (this.amendAmtForm.get('incAmt').value && (this.amendAmtForm.get('incAmt').value !== null &&
      this.amendAmtForm.get('incAmt').value !== '')) {
      if (this.decimalNumberForCurrency === undefined) {
        this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();
        this.decimalNumberForCurrency = this.currencyDecimalMap.get(this.bgRecord.bgCurCode);
      }
      this.amendAmtForm.controls[`incAmt`].setValidators(validateAmountField(this.bgRecord.bgCurCode,
        this.decimalNumberForCurrency));
      this.amendAmtForm.get('incAmt').setValue(this.commonService.transformAmt(this.amendAmtForm.get('incAmt').value,
        this.bgRecord.bgCurCode));
      this.amendAmtForm.get('decAmt').setValue('');
      const incAmt = this.commonService.getNumberWithoutLanguageFormatting(this.amendAmtForm.get('incAmt').value);
      const origUndertakingAmount = this.commonService.getNumberWithoutLanguageFormatting(this.originalUndertakingAmt);
      const bgAmt = String(parseFloat(origUndertakingAmount) + parseFloat(incAmt));
      this.amendAmtForm.get('bgAmt').setValue(this.commonService.transformAmt(bgAmt, this.bgRecord.bgCurCode));
      this.amendAmtForm.get('tnxAmt').setValue(this.commonService.transformAmt(incAmt, this.bgRecord.bgCurCode));
      this.amendAmtForm.get('tnxCurCode').setValue(this.bgRecord.bgCurCode);
      this.amendAmtForm.get('subTnxTypeCode').setValue('01');
      this.commonService.setUndertakingAmt(bgAmt);
    } else if (this.amendAmtForm.get('incAmt').value === '' && this.amendAmtForm.get('decAmt').value === '') {
      this.amendAmtForm.get('bgAmt').setValue('');
    } else {
      this.amendAmtForm.get('subTnxTypeCode').setValue('03');
      this.commonService.setUndertakingAmt(this.originalUndertakingAmt);
      this.amendAmtForm.get('tnxAmt').setValue('');
      this.amendAmtForm.get('tnxCurCode').setValue('');
    }
    this.amountChange.emit();
  }

  calculateNewUndertakingDecreaseAmount() {
    if (this.amendAmtForm.get('decAmt').value && (this.amendAmtForm.get('decAmt').value !== null &&
      this.amendAmtForm.get('decAmt').value !== '')) {
      if (this.decimalNumberForCurrency === undefined) {
        this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();
        this.decimalNumberForCurrency = this.currencyDecimalMap.get(this.bgRecord.bgCurCode);
      }
      this.amendAmtForm.controls[`decAmt`].setValidators([validateDecreaseAmount(this.bgRecord.bgCurCode),
      validateAmountField(this.bgRecord.bgCurCode, this.decimalNumberForCurrency)]);
      this.amendAmtForm.get('decAmt').setValue(this.commonService.transformAmt(this.amendAmtForm.get('decAmt').value,
        this.bgRecord.bgCurCode));
      this.amendAmtForm.get('incAmt').setValue('');
      const decAmt = this.commonService.getNumberWithoutLanguageFormatting(this.amendAmtForm.get('decAmt').value);
      const origUndertakingAmount = this.commonService.getNumberWithoutLanguageFormatting(this.originalUndertakingAmt);
      const bgAmt = String(parseFloat(origUndertakingAmount) - parseFloat(decAmt));
      this.amendAmtForm.get('bgAmt').setValue(this.commonService.transformAmt(bgAmt, this.bgRecord.bgCurCode));
      this.amendAmtForm.get('tnxAmt').setValue(this.commonService.transformAmt(decAmt, this.bgRecord.bgCurCode));
      this.amendAmtForm.get('tnxCurCode').setValue(this.bgRecord.bgCurCode);
      this.amendAmtForm.get('subTnxTypeCode').setValue('02');
      this.commonService.setUndertakingAmt(bgAmt);
    } else if (this.amendAmtForm.get('incAmt').value === '' && this.amendAmtForm.get('decAmt').value === '') {
      this.amendAmtForm.get('bgAmt').setValue('');
    } else {
      this.amendAmtForm.get('subTnxTypeCode').setValue('03');
      this.commonService.setUndertakingAmt(this.originalUndertakingAmt);
      this.amendAmtForm.get('tnxAmt').setValue('');
      this.amendAmtForm.get('tnxCurCode').setValue('');
    }
    this.amendAmtForm.get('decAmt').updateValueAndValidity();
    this.amountChange.emit();
  }

}
