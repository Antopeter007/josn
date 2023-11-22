import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../../../common/constants';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonGeneralDetailsComponent } from '../common-general-details/common-general-details.component';
import { CommonService } from '../../../../../common/services/common.service';


@Component({
  selector: 'fcc-iu-cu-general-details',
  templateUrl: './cu-general-details.component.html',
  styleUrls: ['./cu-general-details.component.scss']
})
export class CuGeneralDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Output() resetRenewalDetails = new EventEmitter<any>();
  @Output() cuConfInstructions = new EventEmitter<UntypedFormGroup>();
  cuGeneraldetailsSection: UntypedFormGroup;
  collapsible: boolean;
  @Output() expDate = new EventEmitter<string>();
  @Output() expiryDateExtension = new EventEmitter<string>();
  @ViewChild(CommonGeneralDetailsComponent)commonGeneralDetailsComponent: CommonGeneralDetailsComponent;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public commonDataService: IUCommonDataService, public commonData: CommonDataService,
              public commonService: CommonService) { }

  ngOnInit() {
    if ((this.commonDataService.getDisplayMode() === 'view' && this.checkForDataIfPresent()) || this.commonData.getIsBankUser()
    || ((this.commonDataService.getOption() === Constants.OPTION_TEMPLATE || this.commonDataService.getMode() === Constants.MODE_DRAFT)
    && this.checkForDataIfPresent())) {
      this.collapsible = true;
    } else {
      this.collapsible = false;
    }
    this.cuGeneraldetailsSection = this.fb.group({
      cuSubProductCode: [''],
      cuConfInstructions: [''],
      cuTransferIndicator: [''],
      narrativeTransferConditionsCu: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_780),
      validateSwiftCharSet(Constants.Z_CHAR)]],
      cuTypeCode: [''],
      cuTypeDetails: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35),
                                      validateSwiftCharSet(Constants.X_CHAR)]],
      cuEffectiveDateTypeCode: '',
      cuEffectiveDateTypeDetails: {value: '', disabled: true },
      cuExpDateTypeCode: [''],
      cuExpDate: '',
      cuApproxExpiryDate: {value: '', disabled: true},
      cuExpEvent: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_780)]],
    });

    if (this.commonData.getIsBankUser()) {
      this.cuGeneraldetailsSection.controls[`cuSubProductCode`].setValidators([Validators.required]);
      this.cuGeneraldetailsSection.controls[`cuSubProductCode`].updateValueAndValidity();
      this.cuGeneraldetailsSection.controls[`cuTypeCode`].setValidators([Validators.required]);
      this.cuGeneraldetailsSection.controls[`cuTypeCode`].updateValueAndValidity();
      this.cuGeneraldetailsSection.controls[`cuEffectiveDateTypeCode`].setValidators([Validators.required]);
      this.cuGeneraldetailsSection.controls[`cuEffectiveDateTypeCode`].updateValueAndValidity();
      if (this.commonDataService.getCUSubProdCode() === 'STBY') {
        this.cuGeneraldetailsSection.controls[`cuConfInstructions`].setValidators([Validators.required]);
        this.cuGeneraldetailsSection.controls[`cuConfInstructions`].updateValueAndValidity();
        this.cuGeneraldetailsSection.controls[`cuTransferIndicator`].setValidators([Validators.required]);
        this.cuGeneraldetailsSection.controls[`cuTransferIndicator`].updateValueAndValidity();
        this.cuGeneraldetailsSection.controls[`narrativeTransferConditionsCu`].setValidators([Validators.required,
          Validators.maxLength(Constants.LENGTH_780), validateSwiftCharSet(Constants.Z_CHAR)]);
        this.cuGeneraldetailsSection.controls[`narrativeTransferConditionsCu`].updateValueAndValidity();
      }
      this.cuGeneraldetailsSection.controls[`cuExpDateTypeCode`].setValidators([Validators.required]);
      this.cuGeneraldetailsSection.controls[`cuExpDateTypeCode`].updateValueAndValidity();
      this.cuGeneraldetailsSection.controls[`cuExpDate`].setValidators([Validators.required]);
      this.cuGeneraldetailsSection.controls[`cuExpDate`].updateValueAndValidity();
    }


    if ((this.commonDataService.getMode() === Constants.MODE_DRAFT) || (this.commonData.getIsBankUser()) ||
    (this.commonDataService.getTnxType() !== '01' &&
    (this.commonDataService.getOption() === Constants.OPTION_EXISTING || this.commonDataService.getOption() === Constants.OPTION_REJECTED)
     )) {
      this.initFieldValues();
    }
    this.commonDataService.setExpDateType('', Constants.UNDERTAKING_TYPE_CU);
    // Emit the form group to the parent
    this.formReady.emit(this.cuGeneraldetailsSection);
  }

  checkForDataIfPresent() {
    const arr = [this.bgRecord.cuSubProductCode, this.bgRecord.cuConfInstructions, this.bgRecord.narrativeTransferConditionsCu,
                  this.bgRecord.cuTypeCode, this.bgRecord.cuEffectiveDateTypeCode, this.bgRecord.cuEffectiveDateTypeDetails,
                  this.bgRecord.cuExpDateTypeCode, this.bgRecord.cuExpDate, this.bgRecord.cuApproxExpiryDate,
                  this.bgRecord.cuExpEvent];

    return this.bgRecord.cuTransferIndicator === 'Y' || this.commonService.isFieldsValuesExists(arr);
  }

  initFieldValues() {
    this.cuGeneraldetailsSection.patchValue({
      cuSubProductCode: this.bgRecord.cuSubProductCode,
      cuConfInstructions: this.bgRecord.cuConfInstructions,
      cuTransferIndicator: this.commonDataService.getCheckboxBooleanValues(this.bgRecord.cuTransferIndicator),
      narrativeTransferConditionsCu: this.bgRecord.narrativeTransferConditionsCu,
      cuTypeCode: this.bgRecord.cuTypeCode,
      cuTypeDetails: this.bgRecord.cuTypeDetails,
      cuEffectiveDateTypeCode: this.bgRecord.cuEffectiveDateTypeCode,
      cuEffectiveDateTypeDetails: this.bgRecord.cuEffectiveDateTypeDetails,
      cuExpDateTypeCode: this.bgRecord.cuExpDateTypeCode,
      cuExpDate: this.bgRecord.cuExpDate,
      cuApproxExpiryDate: this.bgRecord.cuApproxExpiryDate,
      cuExpEvent: this.bgRecord.cuExpEvent,
    });

    if (this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING) {
        this.cuGeneraldetailsSection.get('cuExpDate').setValue('');
        this.cuGeneraldetailsSection.get('cuTransferIndicator').setValue('');
        this.cuGeneraldetailsSection.get('narrativeTransferConditionsCu').setValue('');
        this.cuGeneraldetailsSection.get('cuApproxExpiryDate').setValue('');
        this.cuGeneraldetailsSection.get('narrativeTransferConditionsCu').setValue('');
        this.cuGeneraldetailsSection.get('cuTransferIndicator').setValue('');
        if (this.bgRecord.cuExpDateTypeCode === '03') {
        this.cuGeneraldetailsSection.get('cuExpEvent').setValue('');
      }
    }
  }

  resetRenewalSection(event) {
    this.resetRenewalDetails.emit(Constants.UNDERTAKING_TYPE_CU);
  }
  setConfInstValue(value) {
    this.cuConfInstructions.emit(value);
  }
  generatePdf(generatePdfService) {
    if (this.commonGeneralDetailsComponent) {
    this.commonGeneralDetailsComponent.generatePdf(generatePdfService);
    }
  }

  setExpDate(expDate) {
    this.expDate.emit(expDate);
  }

  setExpiryDateForExtension(expiryDateExtension) {
    this.expiryDateExtension.emit(expiryDateExtension);
  }

}
