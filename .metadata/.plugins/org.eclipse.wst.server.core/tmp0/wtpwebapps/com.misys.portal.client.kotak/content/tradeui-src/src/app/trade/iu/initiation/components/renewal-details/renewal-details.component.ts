import { Constants } from './../../../../../common/constants';
import { CommonRenewalDetailsComponent } from './../common-renewal-details/common-renewal-details.component';

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { CommonService } from '../../../../../common/services/common.service';



@Component({
  selector: 'fcc-iu-renewal-details',
  templateUrl: './renewal-details.component.html',
  styleUrls: ['./renewal-details.component.scss']
})
export class RenewalDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  renewalDetailsSection: UntypedFormGroup;
  @ViewChild(CommonRenewalDetailsComponent) commonRenewalDetails: CommonRenewalDetailsComponent;
  isBankUser: boolean;
  showSection = false;
  viewMode: boolean;
  collapsible: boolean;
  arr: any;
  @Output() renewalExpDate = new EventEmitter<UntypedFormGroup>();
  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public iuCommonDataService: IUCommonDataService, public commonData: CommonDataService,
              public commonService: CommonService) { }

  ngOnInit() {
    this.isBankUser = this.commonData.getIsBankUser();
    if (this.checkForDataIfPresent()) {
      this.collapsible = true;
    } else {
      this.collapsible = false;
    }
    this.renewalDetailsSection = this.fb.group({
      bgRenewalType: [''],
      bgRenewFlag: [''],
      bgRenewOnCode: [''],
      bgRenewalCalendarDate: [{value: '', disabled: true }],
      bgRenewForNb: [''],
      bgRenewForPeriod: [''],
      bgAdviseRenewalFlag: [''],
      bgAdviseRenewalDaysNb: [{value: '', disabled: true }],
      bgRollingRenewalFlag: [''],
      bgRollingRenewOnCode: [''],
      bgRollingRenewForNb: [''],
      bgRollingRenewForPeriod: [''],
      bgRollingDayInMonth: [''],
      bgRollingRenewalNb: [''],
      bgRollingCancellationDays: [''],
      bgNarrativeCancellation: ['' , [Validators.maxLength(Constants.NUMERIC_780)]],
      bgRenewAmtCode: [''],
      bgFinalExpiryDate: ['']
    });

    if (Constants.SCRATCH === this.commonData.getOption() && this.iuCommonDataService.getExpDateType() === '02') {
      this.showSection = true;
    } else if ((this.iuCommonDataService.getDisplayMode() === Constants.MODE_VIEW
        && this.iuCommonDataService.getExpDateType() === '02')) {
      this.showSection = true;
    } else if (this.iuCommonDataService.getMode() === Constants.MODE_DRAFT && this.bgRecord.expDateTypeCode === '02') {
      this.showSection = true;
    } else {
      this.showSection = false;
    }

    if (this.isBankUser || (this.iuCommonDataService.getMode() === Constants.MODE_DRAFT) ||
      (this.iuCommonDataService.getMode() === Constants.MODE_AMEND) ||
      (this.iuCommonDataService.getTnxType() === '01' && (this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING
      || this.iuCommonDataService.getOption() === Constants.OPTION_REJECTED))) {
      this.initFieldValues();
    }
    // Emit the form group to the parent
    this.formReady.emit(this.renewalDetailsSection);
  }

  checkForDataIfPresent() {
    if (this.commonService.getEnableUIUX() && this.isBankUser) {
    this.arr = [this.bgRecord.bgRenewalType,
      this.bgRecord.bgRenewalCalendarDate,
      this.bgRecord.bgRenewForNb,
      this.bgRecord.bgRenewForPeriod,
      this.bgRecord.bgAdviseRenewalDaysNb,
      this.bgRecord.bgRollingRenewForNb,
      this.bgRecord.bgRollingRenewForPeriod,
      this.bgRecord.bgRollingDayInMonth,
      this.bgRecord.bgRollingRenewalNb,
      this.bgRecord.bgRollingCancellationDays,
      this.bgRecord.bgNarrativeCancellation,
      this.bgRecord.bgRenewAmtCode,
      this.bgRecord.bgFinalExpiryDate];
    } else {
      this.arr = [this.bgRecord.bgRenewalType,
        this.bgRecord.bgRenewOnCode,
        this.bgRecord.bgRenewalCalendarDate,
        this.bgRecord.bgRenewForNb,
        this.bgRecord.bgRenewForPeriod,
        this.bgRecord.bgAdviseRenewalDaysNb,
        this.bgRecord.bgRollingRenewOnCode,
        this.bgRecord.bgRollingRenewForNb,
        this.bgRecord.bgRollingRenewForPeriod,
        this.bgRecord.bgRollingDayInMonth,
        this.bgRecord.bgRollingRenewalNb,
        this.bgRecord.bgRollingCancellationDays,
        this.bgRecord.bgNarrativeCancellation,
        this.bgRecord.bgRenewAmtCode,
        this.bgRecord.bgFinalExpiryDate];
    }

    return this.bgRecord.bgRenewFlag === 'Y' || this.bgRecord.bgAdviseRenewalFlag === 'Y' ||
            this.bgRecord.bgRollingRenewalFlag === 'Y' || this.commonService.isFieldsValuesExists(this.arr);
  }


  initFieldValues() {
    this.renewalDetailsSection.patchValue({
      bgRenewalType: this.bgRecord.bgRenewalType,
      bgRenewFlag: this.iuCommonDataService.getCheckboxBooleanValues(this.bgRecord.bgRenewFlag),
      bgRenewOnCode: this.bgRecord.bgRenewOnCode,
      bgRenewalCalendarDate: this.bgRecord.bgRenewalCalendarDate,
      bgRenewForNb: this.bgRecord.bgRenewForNb,
      bgRenewForPeriod: this.bgRecord.bgRenewForPeriod,
      bgAdviseRenewalFlag: this.iuCommonDataService.getCheckboxBooleanValues(this.bgRecord.bgAdviseRenewalFlag),
      bgAdviseRenewalDaysNb: this.bgRecord.bgAdviseRenewalDaysNb,
      bgRollingRenewalFlag: this.iuCommonDataService.getCheckboxBooleanValues(this.bgRecord.bgRollingRenewalFlag),
      bgRollingRenewOnCode: this.bgRecord.bgRollingRenewOnCode,
      bgRollingRenewForNb: this.bgRecord.bgRollingRenewForNb,
      bgRollingRenewForPeriod: this.bgRecord.bgRollingRenewForPeriod,
      bgRollingDayInMonth: this.bgRecord.bgRollingDayInMonth,
      bgRollingRenewalNb: this.bgRecord.bgRollingRenewalNb,
      bgRollingCancellationDays: this.bgRecord.bgRollingCancellationDays,
      bgNarrativeCancellation: this.bgRecord.bgNarrativeCancellation,
      bgRenewAmtCode: this.bgRecord.bgRenewAmtCode,
      bgFinalExpiryDate: this.bgRecord.bgFinalExpiryDate
    });

    if (this.iuCommonDataService.getTnxType() === '01' &&
    (this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING ||
    this.iuCommonDataService.getOption() === Constants.OPTION_REJECTED)) {
      this.renewalDetailsSection.get('bgRenewalCalendarDate').setValue('');
      this.renewalDetailsSection.get('bgFinalExpiryDate').setValue('');
    }
  }

  generatePdf(generatePdfService) {
    if (this.commonRenewalDetails) {
      this.commonRenewalDetails.generatePdf(generatePdfService);
    }

  }

  emitFinalRenewalExpDate(finalRenewalExpiryDate) {
     this.renewalExpDate.emit(finalRenewalExpiryDate);
  }
}
