import { CommonService } from '../../../../../common/services/common.service';
import { Constants } from '../../../../../common/constants';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonAmountDetailsComponent } from '../../../common/components/common-amount-details/common-amount-details.component';
import { CommonDataService } from '../../../../../common/services/common-data.service';


@Component({
  selector: 'fcc-iu-initiate-cu-amount-details',
  templateUrl: './cu-amount-details.component.html',
  styleUrls: ['./cu-amount-details.component.scss']
})
export class CuAmountDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Output() resetRenewalDetails = new EventEmitter<any>();
  @ViewChild(CommonAmountDetailsComponent)commonAmountDetailsChildComponent: CommonAmountDetailsComponent;
  @Output() isTnxAmtCurCodeEmpty = new EventEmitter<any>();
  @Output() bgCurrencyCode = new EventEmitter<any>();
  collapsible: boolean;
  isBankInquiry: boolean;
  cuAmountDetailsSection: UntypedFormGroup;
  currencyDecimalMap = new Map<string, number>();
  isLiabAmtRequired = true;


  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public commonDataService: IUCommonDataService, public commonService: CommonService,
              public commonData: CommonDataService) { }

  ngOnInit() {
    if ((this.commonDataService.getDisplayMode() === 'view' && this.checkForDataIfPresent()) || this.commonData.getIsBankUser()
    || ((this.commonDataService.getOption() === Constants.OPTION_TEMPLATE || this.commonDataService.getMode() === Constants.MODE_DRAFT)
    && this.checkForDataIfPresent())) {
      this.collapsible = true;
    } else {
      this.collapsible = false;
    }
    this.cuAmountDetailsSection = this.fb.group({
      cuCurCode: ['', [Validators.maxLength(Constants.LENGTH_3), validateSwiftCharSet(Constants.X_CHAR)]],
      cuAmt: [''],
      cuAvailableAmt: [''],
      cuLiabAmt: [''],
      cuTolerancePositivePct: ['', [Validators.maxLength(Constants.LENGTH_2),
        Validators.pattern(Constants.REGEX_TOLERANCE)]],
      cuToleranceNegativePct: ['', [Validators.maxLength(Constants.LENGTH_2),
        Validators.pattern(Constants.REGEX_TOLERANCE)]],
      cuNarrativeAdditionalAmount: [''],
      cuConsortium: [''],
      cuConsortiumDetails: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_140)]],
      cuNetExposureCurCode: ['', [Validators.maxLength(Constants.LENGTH_3), validateSwiftCharSet(Constants.X_CHAR)]],
      cuNetExposureAmt: [''],
      cuOpenChrgBorneByCode: [''],
      cuCorrChrgBorneByCode: [''],
      cuConfChrgBorneByCode: ['']
    });
    this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();

    if (this.commonData.getIsBankUser() || this.commonDataService.getMode() === Constants.MODE_DRAFT) {
      this.initFieldValues();
    }
    this.commonService.setCuUndertakingAmt(this.cuAmountDetailsSection.get('cuAmt').value);
    if (Constants.OPTION_HISTORY === this.commonDataService.getOption() && this.commonData.getIsBankUser()) {
      this.isBankInquiry = true;
    }
    this.formReady.emit(this.cuAmountDetailsSection);
  }

  checkForDataIfPresent() {
    const arr = [this.bgRecord.cuCurCode, this.bgRecord.cuAmt, this.bgRecord.cuTolerancePositivePct,
                  this.bgRecord.cuToleranceNegativePct, this.bgRecord.cuNarrativeAdditionalAmount,
                  this.bgRecord.cuConsortiumDetails, this.bgRecord.cuNetExposureCurCode, this.bgRecord.cuCorrChrgBorneByCode,
                  this.bgRecord.cuNetExposureAmt, this.bgRecord.cuOpenChrgBorneByCode, this.bgRecord.cuConfChrgBorneByCode];

    return this.bgRecord.cuConsortium === 'Y' || this.commonService.isFieldsValuesExists(arr);
  }

  initFieldValues() {
    this.cuAmountDetailsSection.patchValue({
      cuCurCode: this.bgRecord.cuCurCode,
      cuAmt: this.commonService.transformAmt(this.bgRecord.cuAmt, this.bgRecord.cuCurCode),
      cuAvailableAmt: this.commonService.transformAmt(this.bgRecord.cuAvailableAmt, this.bgRecord.cuCurCode),
      cuLiabAmt: this.commonService.transformAmt(this.bgRecord.cuLiabAmt, this.bgRecord.cuLiabCurCode),
      cuTolerancePositivePct: this.commonService.getPercentWithoutLanguageFormatting(this.bgRecord.cuTolerancePositivePct),
      cuToleranceNegativePct: this.commonService.getPercentWithoutLanguageFormatting(this.bgRecord.cuToleranceNegativePct),
      cuNarrativeAdditionalAmount: this.bgRecord.cuNarrativeAdditionalAmount,
      cuConsortium: this.commonDataService.getCheckboxBooleanValues(this.bgRecord.cuConsortium),
      cuConsortiumDetails: this.bgRecord.cuConsortiumDetails,
      cuNetExposureCurCode: this.bgRecord.cuNetExposureCurCode,
      cuNetExposureAmt: this.commonService.transformAmt(this.bgRecord.cuNetExposureAmt, this.bgRecord.cuNetExposureCurCode),
      cuOpenChrgBorneByCode: this.bgRecord.cuOpenChrgBorneByCode,
      cuCorrChrgBorneByCode: this.bgRecord.cuCorrChrgBorneByCode,
      cuConfChrgBorneByCode: this.bgRecord.cuConfChrgBorneByCode
    });
    if (this.commonData.getIsBankUser() && !(this.bgRecord.productCode === Constants.PRODUCT_CODE_IU &&
       ((this.bgRecord.provisionalStatus === 'Y' ||
      (['98', '78', '79']).includes(this.bgRecord.prodStatCode)) || (this.commonData.getOperation() ===
      Constants.OPERATION_CREATE_REPORTING && this.bgRecord.tnxTypeCode === Constants.TYPE_INQUIRE &&
      this.bgRecord.prodStatCode !== '03' && (this.bgRecord.subTnxTypeCode === '88' || this.bgRecord.subTnxTypeCode === '89'))))) {
      this.cuAmountDetailsSection.get('cuAvailableAmt').setValidators(Validators.required);
      this.cuAmountDetailsSection.get('cuLiabAmt').setValidators(Validators.required);
      this.cuAmountDetailsSection.get('cuCurCode').setValidators(Validators.required);
      this.cuAmountDetailsSection.get('cuAmt').setValidators(Validators.required);
      this.cuAmountDetailsSection.updateValueAndValidity();
    }
  }

  resetRenewalSection(flag) {
    this.resetRenewalDetails.emit(flag);
  }

  generatePdf(generatePdfService) {
    if (this.commonAmountDetailsChildComponent) {
      this.commonAmountDetailsChildComponent.generatePdf(generatePdfService);
    }
  }

  clearVariationAmtValidations(isTnxAmtCurCodeNull: string) {
      this.isTnxAmtCurCodeEmpty.emit(isTnxAmtCurCodeNull);
  }

  setVariationCurrCode(bgCurrCode: string) {
    this.bgCurrencyCode.emit(bgCurrCode);
  }
}
