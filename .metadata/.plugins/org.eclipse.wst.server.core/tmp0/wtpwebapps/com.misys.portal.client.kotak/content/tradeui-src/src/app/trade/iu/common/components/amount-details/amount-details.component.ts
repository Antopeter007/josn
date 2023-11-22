import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../../../common/constants';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { CommonAmountDetailsComponent } from '../common-amount-details/common-amount-details.component';
import { IUCommonDataService } from '../../service/iuCommonData.service';
import { CommonService } from '../../../../../common/services/common.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';


@Component({
  selector: 'fcc-iu-common-amount-details',
  templateUrl: './amount-details.component.html',
  styleUrls: ['./amount-details.component.scss']
})
export class IUCommonAmountDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Input() public changeCollapse = false;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Output() bookingAmtCheck2 = new EventEmitter<string>();
  @Input() public isTnxAmtCurCodeNull;
  amountDetailsSection: UntypedFormGroup;
  @Output() isTnxAmtCurCodeEmpty = new EventEmitter<any>();
  @ViewChild(CommonAmountDetailsComponent)commonAmountDetailsChildComponent: CommonAmountDetailsComponent;
  @Output() confInstructions = new EventEmitter<UntypedFormGroup>();
  currencyDecimalMap = new Map<string, number>();
  @Output() bgCurrencyCode = new EventEmitter<any>();
  @Output() bgAmtValidate = new EventEmitter<string>();
  isLiabAmtRequired = true;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService, public commonIuService: IUCommonDataService,
              public commonService: CommonService, public commonData: CommonDataService) {}

  ngOnInit() {
    this.amountDetailsSection = this.fb.group({
      bgCurCode: ['', [Validators.maxLength(Constants.LENGTH_3), Validators.required, validateSwiftCharSet(Constants.X_CHAR)]],
      bgAmt: ['', [Validators.required]],
      bgAvailableAmt: [''],
      bgLiabAmt: [''],
      bgTolerancePositivePct: ['', [Validators.maxLength(Constants.LENGTH_2),
        Validators.pattern(Constants.REGEX_TOLERANCE)]],
      bgToleranceNegativePct: ['', [Validators.maxLength(Constants.LENGTH_2),
        Validators.pattern(Constants.REGEX_TOLERANCE)]],
      bgNarrativeAdditionalAmount: [''],
      bgConsortium: [''],
      bgConsortiumDetails: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_140),
        validateSwiftCharSet(Constants.Z_CHAR)]],
      bgNetExposureCurCode: ['', [Validators.maxLength(Constants.LENGTH_3), validateSwiftCharSet(Constants.X_CHAR)]],
      bgNetExposureAmt: [''],
      bgOpenChrgBorneByCode: [''],
      bgCorrChrgBorneByCode: [''],
      bgConfChrgBorneByCode: ['']
    });
    this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();


    if (this.commonIuService.getMode() === Constants.MODE_DRAFT ||
        (this.commonData.getIsBankUser())) {
      this.initFieldValues();
    }
    if ( this.commonIuService.getTnxType() === '01' &&
    (this.commonIuService.getOption() === Constants.OPTION_EXISTING || this.commonIuService.getOption() === Constants.OPTION_REJECTED)) {
      this.initCopyFromFieldValues();
    }
    this.commonService.setUndertakingAmt(this.amountDetailsSection.get('bgAmt').value);

    if (this.commonData.getIsBankUser() && this.commonData.getProductCode() === 'BR') {
      this.amountDetailsSection.get('bgLiabAmt').disable();
      this.amountDetailsSection.get('bgLiabAmt').clearValidators();
      this.amountDetailsSection.get('bgLiabAmt').updateValueAndValidity();
    }
     // Emit the form group to the parent
    this.formReady.emit(this.amountDetailsSection);
  }

  initFieldValues() {
    this.amountDetailsSection.patchValue({
      bgCurCode: this.bgRecord.bgCurCode,
      bgAmt: this.commonService.transformAmt(this.bgRecord.bgAmt, this.bgRecord.bgCurCode),
      bgTolerancePositivePct: this.commonService.getPercentWithoutLanguageFormatting(this.bgRecord.bgTolerancePositivePct),
      bgToleranceNegativePct: this.commonService.getPercentWithoutLanguageFormatting(this.bgRecord.bgToleranceNegativePct),
      bgNarrativeAdditionalAmount: this.bgRecord.bgNarrativeAdditionalAmount,
      bgConsortium: this.commonIuService.getCheckboxBooleanValues(this.bgRecord.bgConsortium),
      bgConsortiumDetails: this.bgRecord.bgConsortiumDetails,
      bgNetExposureCurCode: this.bgRecord.bgNetExposureCurCode,
      bgNetExposureAmt: this.commonService.transformAmt(this.bgRecord.bgNetExposureAmt, this.bgRecord.bgNetExposureCurCode),
      bgOpenChrgBorneByCode: this.bgRecord.bgOpenChrgBorneByCode,
      bgCorrChrgBorneByCode: this.bgRecord.bgCorrChrgBorneByCode,
      bgConfChrgBorneByCode: this.bgRecord.bgConfChrgBorneByCode
    });
    if (this.commonData.getIsBankUser()) {
      if (this.bgRecord.productCode === Constants.PRODUCT_CODE_IU && ((this.bgRecord.provisionalStatus === 'Y' ||
      (['98', '78', '79']).includes(this.bgRecord.prodStatCode)) || (this.commonData.getOperation() ===
      Constants.OPERATION_CREATE_REPORTING && this.bgRecord.tnxTypeCode === Constants.TYPE_INQUIRE &&
      this.bgRecord.prodStatCode !== '03' && (this.bgRecord.subTnxTypeCode === '88' || this.bgRecord.subTnxTypeCode === '89')))) {
        this.isLiabAmtRequired = false;
      } else {
      this.amountDetailsSection.get('bgAvailableAmt').setValidators(Validators.required);
      }
      this.amountDetailsSection.get('bgAvailableAmt').setValue(
                                this.commonService.transformAmt(this.bgRecord.bgAvailableAmt, this.bgRecord.bgCurCode));
      if (!(this.bgRecord.purpose === '02' || this.bgRecord.purpose === '03') && this.bgRecord.productCode !== Constants.PRODUCT_CODE_RU) {
        if (this.isLiabAmtRequired) {
        this.amountDetailsSection.get('bgLiabAmt').setValidators(Validators.required);
        }
        this.amountDetailsSection.get('bgLiabAmt').setValue(
          this.commonService.transformAmt(this.bgRecord.bgLiabAmt, this.bgRecord.bgCurCode));
      }
      this.amountDetailsSection.updateValueAndValidity();
    }
  }

  emitBGAmount() {
    this.bgAmtValidate.emit();
  }

  initCopyFromFieldValues() {
    this.amountDetailsSection.patchValue({
      bgConsortium: this.commonIuService.getCheckboxBooleanValues(this.bgRecord.bgConsortium),
      bgConsortiumDetails: this.bgRecord.bgConsortiumDetails,
      bgOpenChrgBorneByCode: this.bgRecord.bgOpenChrgBorneByCode,
      bgCorrChrgBorneByCode: this.bgRecord.bgCorrChrgBorneByCode,
      bgConfChrgBorneByCode: this.bgRecord.bgConfChrgBorneByCode
    });
  }

  generatePdf(generatePdfService) {
    if (this.commonAmountDetailsChildComponent) {
    this.commonAmountDetailsChildComponent.generatePdf(generatePdfService);
    }
  }

  emitBookingAmount() {
    this.bookingAmtCheck2.emit();
  }

  clearVariationAmtValidations(isTnxAmtCurCodeNull: string) {
      this.isTnxAmtCurCodeEmpty.emit(isTnxAmtCurCodeNull);
  }

  setVariationCurrCode(bgCurrCode: string) {
    this.bgCurrencyCode.emit(bgCurrCode);
  }
}

