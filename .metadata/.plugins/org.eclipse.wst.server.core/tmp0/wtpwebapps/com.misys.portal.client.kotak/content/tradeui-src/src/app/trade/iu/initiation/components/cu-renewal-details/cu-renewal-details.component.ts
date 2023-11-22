import { CommonDataService } from '../../../../../common/services/common-data.service';

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../../../common/constants';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonRenewalDetailsComponent } from '../common-renewal-details/common-renewal-details.component';
import { CommonService } from '../../../../../common/services/common.service';

@Component({
  selector: 'fcc-iu-cu-renewal-details',
  templateUrl: './cu-renewal-details.component.html',
  styleUrls: ['./cu-renewal-details.component.scss']
})
export class CuRenewalDetailsComponent implements OnInit {


  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @ViewChild(CommonRenewalDetailsComponent)commonRenewalDetailsComponent: CommonRenewalDetailsComponent;
  @Output() renewalExpDate = new EventEmitter<UntypedFormGroup>();
  cuRenewalDetailsSection: UntypedFormGroup;
  collapsible: boolean;
  isBankUser: boolean;
  arr: any;
  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public commonDataService: IUCommonDataService, public commonData: CommonDataService,
              public commonService: CommonService) { }

  ngOnInit() {
    this.isBankUser = this.commonData.getIsBankUser();
    if (this.checkForDataIfPresent()) {
      this.collapsible = true;
    } else {
      this.collapsible = false;
    }
    if ((this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING) ||
    (this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_REJECTED)) {
      this.collapsible = false;
    }
    this.cuRenewalDetailsSection = this.fb.group({
      cuRenewalType: [''],
      cuRenewFlag: [''],
      cuRenewOnCode: [''],
      cuRenewalCalendarDate: [{value: '', disabled: true }],
      cuRenewForNb: [''],
      cuRenewForPeriod: [''],
      cuAdviseRenewalFlag: [''],
      cuAdviseRenewalDaysNb: [{value: '', disabled: true }],
      cuRollingRenewalFlag: [''],
      cuRollingRenewOnCode: [''],
      cuRollingRenewForNb: [''],
      cuRollingRenewForPeriod: [''],
      cuRollingDayInMonth: [''],
      cuRollingRenewalNb: [''],
      cuRollingCancellationDays: [''],
      cuNarrativeCancellation: ['', [Validators.maxLength(Constants.LENGTH_140)]],
      cuRenewAmtCode: [''],
      cuFinalExpiryDate: ['']
    });

    if ((this.commonDataService.getMode() === Constants.MODE_DRAFT) || (this.commonData.getIsBankUser()) ||
    (this.commonDataService.getTnxType() !== '01' && (this.commonDataService.getOption() === Constants.OPTION_EXISTING ||
    this.commonDataService.getOption() === Constants.OPTION_REJECTED))) {
      this.initFieldValues();
    }
    // Emit the form group to the parent
    this.formReady.emit(this.cuRenewalDetailsSection);
  }

  checkForDataIfPresent() {
    if (this.commonService.getEnableUIUX() && this.isBankUser) {
    this.arr = [this.bgRecord.cuRenewalType,
      this.bgRecord.cuRenewalCalendarDate,
      this.bgRecord.cuRenewForNb,
      this.bgRecord.cuRenewForPeriod,
      this.bgRecord.cuAdviseRenewalDaysNb,
      this.bgRecord.cuRollingRenewForNb,
      this.bgRecord.cuRollingRenewForPeriod,
      this.bgRecord.cuRollingDayInMonth,
      this.bgRecord.cuRollingRenewalNb,
      this.bgRecord.cuRollingCancellationDays,
      this.bgRecord.cuNarrativeCancellation,
      this.bgRecord.cuRenewAmtCode,
      this.bgRecord.cuFinalExpiryDate];
    } else {
      this.arr = [this.bgRecord.cuRenewalType,
        this.bgRecord.cuRenewOnCode,
        this.bgRecord.cuRenewalCalendarDate,
        this.bgRecord.cuRenewForNb,
        this.bgRecord.cuRenewForPeriod,
        this.bgRecord.cuAdviseRenewalDaysNb,
        this.bgRecord.cuRollingRenewOnCode,
        this.bgRecord.cuRollingRenewForNb,
        this.bgRecord.cuRollingRenewForPeriod,
        this.bgRecord.cuRollingDayInMonth,
        this.bgRecord.cuRollingRenewalNb,
        this.bgRecord.cuRollingCancellationDays,
        this.bgRecord.cuNarrativeCancellation,
        this.bgRecord.cuRenewAmtCode,
        this.bgRecord.cuFinalExpiryDate];
    }
    return this.bgRecord.cuRenewFlag === 'Y' || this.bgRecord.cuAdviseRenewalFlag === 'Y' ||
            this.bgRecord.cuRollingRenewalFlag === 'Y' || this.commonService.isFieldsValuesExists(this.arr);
  }

  initFieldValues() {
    this.cuRenewalDetailsSection.patchValue({
      cuRenewalType: this.bgRecord.cuRenewalType,
      cuRenewFlag: this.commonDataService.getCheckboxBooleanValues(this.bgRecord.cuRenewFlag),
      cuRenewOnCode: this.bgRecord.cuRenewOnCode,
      cuRenewalCalendarDate: this.bgRecord.cuRenewalCalendarDate,
      cuRenewForNb: this.bgRecord.cuRenewForNb,
      cuRenewForPeriod: this.bgRecord.cuRenewForPeriod,
      cuAdviseRenewalFlag: this.commonDataService.getCheckboxBooleanValues(this.bgRecord.cuAdviseRenewalFlag),
      cuAdviseRenewalDaysNb: this.bgRecord.cuAdviseRenewalDaysNb,
      cuRollingRenewalFlag: this.commonDataService.getCheckboxBooleanValues(this.bgRecord.cuRollingRenewalFlag),
      cuRollingRenewOnCode: this.bgRecord.cuRollingRenewOnCode,
      cuRollingRenewForNb: this.bgRecord.cuRollingRenewForNb,
      cuRollingRenewForPeriod: this.bgRecord.cuRollingRenewForPeriod,
      cuRollingDayInMonth: this.bgRecord.cuRollingDayInMonth,
      cuRollingRenewalNb: this.bgRecord.cuRollingRenewalNb,
      cuRollingCancellationDays: this.bgRecord.cuRollingCancellationDays,
      cuNarrativeCancellation: this.bgRecord.cuNarrativeCancellation,
      cuRenewAmtCode: this.bgRecord.cuRenewAmtCode,
      cuFinalExpiryDate: this.bgRecord.cuFinalExpiryDate
    });
    if (this.commonDataService.getTnxType() === '01' &&
    (this.commonDataService.getOption() === Constants.OPTION_EXISTING ||
    this.commonDataService.getOption() === Constants.OPTION_REJECTED)) {
      this.cuRenewalDetailsSection.get('cuRenewalCalendarDate').setValue('');
      this.cuRenewalDetailsSection.get('cuFinalExpiryDate').setValue('');
    }
  }

  generatePdf(generatePdfService) {
    if (this.commonRenewalDetailsComponent) {
      this.commonRenewalDetailsComponent.generatePdf(generatePdfService);
    }
  }

  emitFinalRenewalExpDate(finalRenewalExpiryDate) {
    this.renewalExpDate.emit(finalRenewalExpiryDate);
 }
}
