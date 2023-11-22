import { CommonDataService } from './../../../../../common/services/common-data.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, AfterContentInit, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ValidationService } from './../../../../../common/validators/validation.service';
import { validateSwiftCharSet, validateDates, validateDate } from './../../../../../common/validators/common-validator';
import { Constants } from './../../../../../common/constants';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonService } from './../../../../../common/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'fcc-iu-common-renewal-details',
  templateUrl: './common-renewal-details.component.html',
  styleUrls: ['./common-renewal-details.component.scss']
})
export class CommonRenewalDetailsComponent implements OnInit, AfterContentInit {

  @Input() showUndertakingType: string;

  undertakingType = 'Not Defined';

  @Input() public bgRecord;
  @Input() public sectionForm: UntypedFormGroup;
  viewMode: boolean;
  public renewForPeriodObj: any[];
  yearRange: string;
  showRenewalType = true;
  showRenewalSection = false;
  showRollingRenewal = false;
  showRenewalCalendarDate = false;
  showAdviseRenewalDaysNbRow = false;
  showNarrativeCancellation = false;
  showDayInMonth = false;
  cuRenewalTypeSelected: string;
  bgRenewalTypeSelected: string;
  public displayErrorDialog = false;
  public errorTitle: string;
  public errorMessage: string;
  @Output() finalRenewalExpDate = new EventEmitter<string>();
  showNotification = false;
  dateFormat: string;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public iuCommonDataService: IUCommonDataService, public datePipe: DatePipe,
              public commonService: CommonService, public commonData: CommonDataService,
              public translate: TranslateService) { }

  ngOnInit() {
    this.dateFormat = this.commonService.getDateFormat();
    this.renewForPeriodObj = [
      {label: this.commonService.getTranslation('EXTENSION_EXTEND_FOR_DAYS'), value : 'D'},
      {label: this.commonService.getTranslation('EXTENSION_EXTEND_FOR_WEEKS'), value : 'W'},
      {label: this.commonService.getTranslation('EXTENSION_EXTEND_FOR_MONTHS'), value : 'M'},
      {label: this.commonService.getTranslation('EXTENSION_EXTEND_FOR_YEARS'), value : 'Y'}
     ];

    this.undertakingType = this.showUndertakingType;
    this.showNotification = false;

    if (this.iuCommonDataService.getDisplayMode() === 'view' || this.iuCommonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
        this.viewMode = true;
      } else {
        this.viewMode = false;
      }
    this.yearRange = this.commonService.getYearRange();
    if (this.bgRecord[`${this.undertakingType}RenewAmtCode`]) {
      this.iuCommonDataService.setRenewAmtCode(this.bgRecord[`${this.undertakingType}RenewAmtCode`], this.undertakingType);
    }

    if (this.commonData.getIsBankUser() && this.bgRecord.bgRenewalType !== '') {
      if (this.undertakingType === 'cu') {
        if (this.sectionForm.controls.cuRenewForNb && this.sectionForm.controls.cuRenewForNb.value != null &&
          this.sectionForm.controls.cuRenewForNb.value !== '') {
        this.sectionForm.controls.cuRenewForNb.setValidators([Validators.required,
          Validators.pattern(Constants.REGEX_NUMBER)]);
        this.sectionForm.controls.cuRenewForNb.updateValueAndValidity();
        }
        if (this.sectionForm.controls.cuRenewForPeriod && this.sectionForm.controls.cuRenewForPeriod.value != null &&
          this.sectionForm.controls.cuRenewForPeriod.value !== '') {
        this.sectionForm.controls.cuRenewForPeriod.setValidators([Validators.required]);
        this.sectionForm.controls.cuRenewForPeriod.updateValueAndValidity();
        }
      }

      if (this.sectionForm.get(`${this.undertakingType}RollingRenewOnCode`).value === '02') {
        // setting validators
        this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].setValidators(
          [Validators.required, Validators.maxLength(Constants.LENGTH_2), Validators.pattern(Constants.REGEX_DATE_NUMBER)]);
        this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].updateValueAndValidity();
        this.sectionForm.get(`${this.undertakingType}RollingDayInMonth`).enable();
        this.showDayInMonth = true;
      }
      if (this.sectionForm.controls[`${this.undertakingType}RollingRenewalNb`] &&
      this.sectionForm.controls[`${this.undertakingType}RollingRenewalNb`].value != null &&
      this.sectionForm.controls[`${this.undertakingType}RollingRenewalNb`].value !== '') {
      this.sectionForm.controls[`${this.undertakingType}RollingRenewalNb`].setValidators(
        [Validators.required, Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
      this.sectionForm.controls[`${this.undertakingType}RollingRenewalNb`].updateValueAndValidity();
      }

      if ((this.bgRecord[`${this.undertakingType}RenewalType`] === '01' &&
      (this.bgRecord[`${this.undertakingType}RenewOnCode`] === '01' || this.bgRecord[`${this.undertakingType}RenewOnCode`] === '02' )) ||
      (this.bgRecord[`${this.undertakingType}RenewalType`] === '02' &&
      this.bgRecord[`${this.undertakingType}RollingRenewOnCode`] === '02')) {
      this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].setValidators([Validators.required,
      Validators.maxLength(Constants.LENGTH_2), Validators.pattern(Constants.REGEX_DATE_NUMBER)]);
      this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].updateValueAndValidity();
      } else {
        this.sectionForm.get(`${this.undertakingType}RollingDayInMonth`).reset();
        this.sectionForm.get(`${this.undertakingType}RollingDayInMonth`).clearValidators();
        this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].updateValueAndValidity();
      }
      if (this.iuCommonDataService.getMode() === Constants.MODE_DRAFT ||
      this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING) {
       if (this.bgRecord[`${this.undertakingType}RenewalType`] === '01') {
        this.sectionForm.get(`${this.undertakingType}RollingRenewOnCode`).reset();
        this.sectionForm.controls[`${this.undertakingType}RollingRenewOnCode`].updateValueAndValidity();
        this.sectionForm.get(`${this.undertakingType}RollingRenewForNb`).reset();
        this.sectionForm.controls[`${this.undertakingType}RollingRenewForNb`].updateValueAndValidity();
      } else if (this.bgRecord[`${this.undertakingType}RenewalType`] === '02') {
        this.sectionForm.controls[`${this.undertakingType}RollingRenewForNb`].setValidators([Validators.required,
          Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
        this.sectionForm.controls[`${this.undertakingType}RollingRenewForNb`].updateValueAndValidity();
      }
    }
    }
 }

  ngAfterContentInit() {
    if (this.bgRecord[`${this.undertakingType}RenewFlag`] === 'Y') {
      if (!(this.commonData.disableTnx)) {
        this.sectionForm.controls[`${this.undertakingType}RenewOnCode`].enable();
        this.sectionForm.get(`${this.undertakingType}RenewForNb`).enable();
        this.sectionForm.controls[`${this.undertakingType}RenewForPeriod`].enable();
        this.sectionForm.controls[`${this.undertakingType}AdviseRenewalFlag`].enable();
        this.sectionForm.controls[`${this.undertakingType}FinalExpiryDate`].disable();
        this.sectionForm.controls[`${this.undertakingType}RenewAmtCode`].enable();
        this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].enable();
      }
      this.sectionForm.controls[`${this.undertakingType}RenewOnCode`].setValidators([Validators.required]);
      this.sectionForm.get(`${this.undertakingType}RenewForNb`).setValidators([Validators.required,
                        Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      this.sectionForm.controls[`${this.undertakingType}RenewForPeriod`].setValidators([Validators.required]);
      this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].setValidators([Validators.maxLength(Constants.LENGTH_2),
        Validators.pattern(Constants.REGEX_DATE_NUMBER)]);
      this.showRenewalType = true;
      this.commonService.setRenewOnCode(this.bgRecord[`${this.undertakingType}RenewOnCode`], this.undertakingType);
      this.commonService.setRenewForNb(this.bgRecord[`${this.undertakingType}RenewForNb`], this.undertakingType);
      this.commonService.setRenewForPeriod(this.bgRecord[`${this.undertakingType}RenewForPeriod`], this.undertakingType);
      this.commonService.setRollingRenewalNb(this.bgRecord[`${this.undertakingType}RollingRenewalNb`], this.undertakingType);

      if (this.bgRecord[`${this.undertakingType}RenewalType`] === '01') {
       this.showDayInMonth = true;
      }
    }
    if (this.bgRecord[`${this.undertakingType}AdviseRenewalFlag`] === 'Y') {
      this.sectionForm.controls[`${this.undertakingType}AdviseRenewalDaysNb`].setValidators([Validators.required,
        Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
      this.sectionForm.controls[`${this.undertakingType}AdviseRenewalDaysNb`].updateValueAndValidity();
      if (!(this.commonData.disableTnx)) {
        this.sectionForm.controls[`${this.undertakingType}AdviseRenewalDaysNb`].enable();
      }
      this.showAdviseRenewalDaysNbRow = true;
    }
    if (this.bgRecord[`${this.undertakingType}RenewOnCode`] === '02' ) {
     this.commonService.setRenewalCalendarDate(this.bgRecord[`${this.undertakingType}RenewalCalendarDate`], this.undertakingType);
     this.sectionForm.controls[`${this.undertakingType}RenewalCalendarDate`].setValidators([Validators.required]);
     this.sectionForm.controls[`${this.undertakingType}RenewalCalendarDate`].updateValueAndValidity();
     if (!(this.commonData.disableTnx)) {
        this.sectionForm.controls[`${this.undertakingType}RenewalCalendarDate`].enable();
     }
     this.showRenewalCalendarDate = true;
   }
    if (this.bgRecord[`${this.undertakingType}RollingRenewOnCode`] === '02') {
      this.sectionForm.controls[`${this.undertakingType}RollingRenewForNb`].setValidators([Validators.required,
              Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
      this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].setValidators([Validators.required,
        Validators.maxLength(Constants.LENGTH_2), Validators.pattern(Constants.REGEX_DATE_NUMBER)]);
      if (!(this.commonData.disableTnx)) {
        this.sectionForm.controls[`${this.undertakingType}RollingRenewForNb`].enable();
        this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].enable();
      }
      this.showDayInMonth = true;
     }
    if (this.bgRecord[`${this.undertakingType}RollingRenewForNb`] !== '') {
     this.commonService.setRollingRenewForNb(this.bgRecord[`${this.undertakingType}RollingRenewForNb`], this.undertakingType);
     }
    if (this.bgRecord[`${this.undertakingType}RollingRenewForPeriod`] !== '') {
     this.commonService.setRollingRenewForPeriod(this.bgRecord[`${this.undertakingType}RollingRenewForPeriod`], this.undertakingType);
    }

    if (this.bgRecord.bgRenewalType !== undefined) {
      this.bgRenewalTypeSelected = this.bgRecord.bgRenewalType;
      this.commonService.setRenewalType(this.bgRecord.bgRenewalType, this.undertakingType);
    }
    if (this.bgRecord.cuRenewalType !== undefined) {
      this.cuRenewalTypeSelected = this.bgRecord.cuRenewalType;
      this.commonService.setRenewalType(this.bgRecord.cuRenewalType, this.undertakingType);
    }
    if ((this.undertakingType === 'bg' && this.bgRecord.bgRenewalType === '01')
      || (this.undertakingType === 'cu' && this.bgRecord.cuRenewalType === '01')) {
      this.showRenewalSection = true;
      this.showDayInMonth = true;
    } else if ((this.undertakingType === 'bg' && this.bgRecord.bgRenewalType === '02')
      || (this.undertakingType === 'cu' && this.bgRecord.cuRenewalType === '02')) {
      this.showRenewalSection = true;
      this.showRollingRenewal = true;
    }
    if (this.bgRecord[`${this.undertakingType}FinalExpiryDate`] !== '') {
      let maxDate;
      maxDate = this.bgRecord[`${this.undertakingType}FinalExpiryDate`];
      maxDate = this.commonService.getDateObject(maxDate);
      if (this.undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.commonService.maxDate = maxDate;
        this.commonService.expiryDateType = Constants.EXTENSION_EXPIRY_TYPE;
      } else {
       this.commonService.cuMaxDate = maxDate;
       this.commonService.cuExpiryDateType = Constants.EXTENSION_EXPIRY_TYPE;
      }
      if (!this.commonData.getIsBankUser()) {
        this.showNotification = true;
      }
      this.setVariationFrequencyValidator();
      }
    if (this.bgRecord[`${this.undertakingType}RollingCancellationDays`] !== '') {
      this.validateNarrative();
    }
    this.sectionForm.updateValueAndValidity();
  }

  toggleOnRenewalType() {

    let renewalTypeValue;
    if (this.undertakingType === 'bg') {
      renewalTypeValue = this.commonService.getBgRenewalType();
    } else if (this.undertakingType === 'cu') {
      renewalTypeValue = this.commonService.getCuRenewalType();
    }
    if (((this.undertakingType === 'bg' && this.sectionForm.get('bgRenewalType').value === '01' && renewalTypeValue === undefined)
    || (this.undertakingType === 'bg' && this.sectionForm.get('bgRenewalType').value === '01' && renewalTypeValue !== undefined
    && (renewalTypeValue !== this.sectionForm.get('bgRenewalType').value)))
    || ((this.undertakingType === 'cu' && this.sectionForm.get('cuRenewalType').value === '01' && renewalTypeValue === undefined)
    || (this.undertakingType === 'cu' && this.sectionForm.get('cuRenewalType').value === '01' && renewalTypeValue !== undefined
    && (renewalTypeValue !== this.sectionForm.get('cuRenewalType').value))))  {
      this.commonService.setRenewalType(this.sectionForm.get(`${this.undertakingType}RenewalType`).value, this.undertakingType);
      this.showRenewalSection = true;
      this.clearAllFields();
      this.clearAllValidators();
      this.sectionForm.controls[`${this.undertakingType}RenewOnCode`].setValidators([Validators.required]);
      if (this.undertakingType === 'bg') {
        this.sectionForm.controls.bgRenewForNb.setValidators([Validators.required,
          Validators.pattern(Constants.REGEX_NUMBER)]);
        this.sectionForm.controls.bgRenewForNb.updateValueAndValidity();
      } else if (this.undertakingType === 'cu') {
        this.sectionForm.controls.cuRenewForNb.setValidators([Validators.required,
          Validators.pattern(Constants.REGEX_NUMBER)]);
      }

      this.sectionForm.controls[`${this.undertakingType}RenewForPeriod`].setValidators([Validators.required]);
      this.sectionForm.controls[`${this.undertakingType}RenewForPeriod`].updateValueAndValidity();
      this.sectionForm.controls[`${this.undertakingType}RollingRenewalNb`].setValidators(
        [Validators.required, Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
      this.sectionForm.controls[`${this.undertakingType}RollingCancellationDays`].setValidators(
        [Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
      this.sectionForm.controls[`${this.undertakingType}RollingRenewalNb`].setValue('1');
      this.commonService.setRollingRenewalNb(this.sectionForm.get(`${this.undertakingType}RenewalType`).value, this.undertakingType);
      this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].enable();
      this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].setValidators(
        [Validators.maxLength(Constants.LENGTH_2), Validators.pattern(Constants.REGEX_DATE_NUMBER)]);
      if (this.undertakingType === 'bg') {
        this.sectionForm.controls.bgNarrativeCancellation.setValidators([validateSwiftCharSet(Constants.X_CHAR)]);
      } else {
        this.sectionForm.controls.cuNarrativeCancellation.setValidators([validateSwiftCharSet(Constants.X_CHAR)]);
      }

      this.showRollingRenewal = false;
      this.showDayInMonth = true;
      this.showNotification = false;
      this.sectionForm.updateValueAndValidity();

    } else if (((this.undertakingType === 'bg' && this.sectionForm.get('bgRenewalType').value === '02' && renewalTypeValue === undefined)
    || (this.undertakingType === 'bg' && this.sectionForm.get('bgRenewalType').value === '02' && renewalTypeValue !== undefined
    && !(renewalTypeValue === this.sectionForm.get('bgRenewalType').value)))
    || ((this.undertakingType === 'cu' && this.sectionForm.get('cuRenewalType').value === '02' && renewalTypeValue === undefined)
    || (this.undertakingType === 'cu' && this.sectionForm.get('cuRenewalType').value === '02' && renewalTypeValue !== undefined
    && !(renewalTypeValue === this.sectionForm.get('cuRenewalType').value)))) {
      this.commonService.setRenewalType(this.sectionForm.get(`${this.undertakingType}RenewalType`).value, this.undertakingType);
      this.showRenewalSection = true;
      this.showRollingRenewal = true;
      this.showDayInMonth = false;
      this.clearAllFields();
      this.clearAllValidators();
      this.sectionForm.controls[`${this.undertakingType}RenewOnCode`].setValidators([Validators.required]);

      if (this.undertakingType === 'bg') {
        this.sectionForm.controls.bgRenewForNb.setValidators([Validators.required,
          Validators.pattern(Constants.REGEX_NUMBER)]);
        this.sectionForm.controls.bgRenewForNb.updateValueAndValidity();
      } else if (this.undertakingType === 'cu') {
        this.sectionForm.controls.cuRenewForNb.setValidators([Validators.required,
          Validators.pattern(Constants.REGEX_NUMBER)]);
      }
      this.sectionForm.controls[`${this.undertakingType}RenewForPeriod`].setValidators([Validators.required]);
      this.sectionForm.controls[`${this.undertakingType}RenewForPeriod`].updateValueAndValidity();
      this.sectionForm.controls[`${this.undertakingType}RollingRenewOnCode`].setValidators([Validators.required]);
      this.sectionForm.controls[`${this.undertakingType}RollingRenewalNb`].setValidators([Validators.required,
                  Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
      this.sectionForm.controls[`${this.undertakingType}RollingRenewalNb`].updateValueAndValidity();
      this.sectionForm.controls[`${this.undertakingType}RollingRenewForNb`].setValidators(
        [Validators.required, Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
      this.sectionForm.controls[`${this.undertakingType}RollingCancellationDays`].setValidators(
        [Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
      this.sectionForm.controls[`${this.undertakingType}RollingRenewForPeriod`].setValidators([Validators.required]);
      if (this.undertakingType === 'bg') {
        this.sectionForm.controls.bgNarrativeCancellation.setValidators([validateSwiftCharSet(Constants.X_CHAR)]);
      } else {
        this.sectionForm.controls.cuNarrativeCancellation.setValidators([validateSwiftCharSet(Constants.X_CHAR)]);
      }
      this.sectionForm.updateValueAndValidity();
      this.showNotification = false;

    } else {
      this.showRenewalSection = false;
      this.sectionForm.get(`${this.undertakingType}RenewalType`).setValue('');
      this.sectionForm.get(`${this.undertakingType}RenewalType`).clearValidators();
      this.sectionForm.get(`${this.undertakingType}RenewalType`).setErrors(null);
      this.sectionForm.get(`${this.undertakingType}RenewOnCode`).setValue('');
      this.sectionForm.get(`${this.undertakingType}RenewOnCode`).clearValidators();
      this.sectionForm.get(`${this.undertakingType}RenewOnCode`).setErrors(null);
      this.commonService.setRenewalType('', this.undertakingType);
     // Clear all the field values
      this.clearAllFields();
      this.clearAllValidators();
      if (this.undertakingType === 'bg') {
        this.sectionForm.get('bgNarrativeCancellation').setValue('');
     } else {
        this.sectionForm.get('cuNarrativeCancellation').setValue('');
     }
    }
    this.showAdviseRenewalDaysNbRow = false;
    this.setVariationFrequencyValidator();
   }

   setExtensionOnDefault() {
    if ((!this.sectionForm.get(`${this.undertakingType}RenewOnCode`).value) && this.showRenewalSection === true ) {
      this.sectionForm.get(`${this.undertakingType}RenewOnCode`).setValue('01');
      this.sectionForm.get(`${this.undertakingType}RenewOnCode`).updateValueAndValidity();
      this.toggleOnRenew();
      this.commonService.calculateRegularExtFinalExpiryDate(this.undertakingType);
      this.commonService.calculateRollingExtFinalExpiryDate(this.undertakingType);
      this.setFinalExpiryDate(this.undertakingType);
    }
   }

   toggleOnRenewFlag(event) {
     if (event) {
      this.showRenewalType = true;
     } else {
      this.showRenewalType = false;
      // Hide the section
      this.showRenewalSection = false;
      this.sectionForm.get(`${this.undertakingType}RenewalType`).setValue('');
      this.sectionForm.get(`${this.undertakingType}RenewalType`).clearValidators();
      this.sectionForm.get(`${this.undertakingType}RenewalType`).setErrors(null);
      // Clear all the field values
      this.clearAllFields();
      this.clearAllValidators();
     }
     this.setVariationFrequencyValidator();
   }
   toggleOnAdviseFlag() {
     if (this.sectionForm.get(`${this.undertakingType}AdviseRenewalFlag`).value) {
       this.sectionForm.controls[`${this.undertakingType}AdviseRenewalDaysNb`].setValidators(
                        [Validators.required, Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
       this.sectionForm.controls[`${this.undertakingType}AdviseRenewalDaysNb`].updateValueAndValidity();
       this.sectionForm.get(`${this.undertakingType}AdviseRenewalDaysNb`).enable();
       this.showAdviseRenewalDaysNbRow = true;
    } else {
      this.sectionForm.get(`${this.undertakingType}AdviseRenewalDaysNb`).setValue('');
      this.sectionForm.get(`${this.undertakingType}AdviseRenewalDaysNb`).disable();
      this.showAdviseRenewalDaysNbRow = false;
     }
   }

   toggleOnRenew() {
     if (this.sectionForm.get(`${this.undertakingType}RenewOnCode`).value === '02') {
       this.commonService.setRenewOnCode(this.sectionForm.get(`${this.undertakingType}RenewOnCode`).value, this.undertakingType);
       // setting validators
       this.sectionForm.controls[`${this.undertakingType}RenewalCalendarDate`].setValidators([Validators.required]);
       this.sectionForm.controls[`${this.undertakingType}RenewalCalendarDate`].updateValueAndValidity();
       this.sectionForm.get(`${this.undertakingType}RenewalCalendarDate`).enable();
       this.showRenewalCalendarDate = true;
     } else {
       this.commonService.setRenewOnCode(this.sectionForm.get(`${this.undertakingType}RenewOnCode`).value, this.undertakingType);
       this.sectionForm.get(`${this.undertakingType}RenewalCalendarDate`).disable();
       this.sectionForm.get(`${this.undertakingType}RenewalCalendarDate`).setValue('');
       this.showRenewalCalendarDate = false;
     }
   }

   toggleOnRollingRenew() {
    if (this.showRollingRenewal) {
    if (this.sectionForm.get(`${this.undertakingType}RollingRenewOnCode`).value === '02') {
      // setting validators
      this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].setValidators(
        [Validators.required, Validators.maxLength(Constants.LENGTH_2), Validators.pattern(Constants.REGEX_DATE_NUMBER)]);
      this.sectionForm.controls[`${this.undertakingType}RollingDayInMonth`].updateValueAndValidity();
      this.sectionForm.get(`${this.undertakingType}RollingDayInMonth`).enable();
      this.showDayInMonth = true;
    } else {
      this.sectionForm.get(`${this.undertakingType}RollingDayInMonth`).disable();
      this.sectionForm.get(`${this.undertakingType}RollingDayInMonth`).setValue('');
      this.showDayInMonth = false;
    }
   }
  }

    setFinalExpiryDate(undertakingType) {
    if (!this.commonData.getIsBankUser()) {
     if (undertakingType === Constants.UNDERTAKING_TYPE_IU
       && this.commonService.finalExpiryDate && this.commonService.finalExpiryDate !== '' && this.commonService.finalExpiryDate !== null) {
      this.sectionForm.get(`bgFinalExpiryDate`).setValue(this.commonService.finalExpiryDate);
      this.sectionForm.get(`bgFinalExpiryDate`).disable();
      if (!this.commonData.getIsBankUser()) {
        this.showNotification = true;
      }
     } else if (undertakingType === Constants.UNDERTAKING_TYPE_CU && this.commonService.cuFinalExpiryDate
      && this.commonService.cuFinalExpiryDate !== '' && this.commonService.cuFinalExpiryDate !== null) {
      this.sectionForm.get(`cuFinalExpiryDate`).setValue(this.commonService.cuFinalExpiryDate);
      this.sectionForm.get(`cuFinalExpiryDate`).disable();
      if (!this.commonData.getIsBankUser()) {
        this.showNotification = true;
      }
    }
  }
    this.setVariationFrequencyValidator();
  }

  setValidatorFinalExpDate(dateField) {
    let expDate;
    let expDateType;
    let genSection;
    const format = this.commonService.getUserLanguage() === Constants.LANGUAGE_US ? Constants.DATE_FORMAT : Constants.DATE_FORMAT_DMY;
    const currentDate = this.datePipe.transform(new Date(), format);
    if (this.undertakingType === 'cu') {
      genSection = this.sectionForm.parent.get(Constants.SECTION_CU_GENERAL_DETAILS);
    } else {
      genSection = (this.commonData.getIsBankUser() &&
       this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU ) ?
       this.sectionForm.parent.controls[Constants.SECTION_RU_GENERAL_DETAILS] :
       this.sectionForm.parent.controls[Constants.SECTION_UNDERTAKING_GENERAL_DETAILS];
    }
    if (this.sectionForm.get(`${this.undertakingType}RenewOnCode`).value === '01') { // Expiry
      expDate = (this.commonData.getIsBankUser() &&
      this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU ) ? genSection.get('expDate') :
      genSection.get(`${this.undertakingType}ExpDate`);
      expDateType = 'expiry date';
    } else if (this.sectionForm.get(`${this.undertakingType}RenewOnCode`).value === '02') { // Calendar
         expDate = this.sectionForm.get(`${this.undertakingType}RenewalCalendarDate`);
         expDateType = 'renewal calendar date';
    }
    const appDateSection = (this.commonData.getIsBankUser() &&
    this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU ) ?
    Constants.SECTION_TRANSACTION_DETAILS : Constants.SECTION_GENERAL_DETAILS;
    this.sectionForm.controls[dateField].clearValidators();
    this.sectionForm.controls[dateField].setValidators([validateDates(
      this.sectionForm.get(dateField),
      this.sectionForm.parent.get(appDateSection).get(Constants.APPL_DATE),
      Constants.FINAL_EXPIRY_DATE, Constants.APPLICATION_DATE, Constants.LESSER_THAN),
      validateDates(this.sectionForm.get(dateField),
      expDate, Constants.FINAL_EXPIRY_DATE, expDateType, Constants.LESSER_THAN),
      validateDate(this.sectionForm.get(dateField).value, currentDate, Constants.FINAL_EXPIRY_DATE, 'todays date', Constants.LESSER_THAN)]);
    this.sectionForm.controls[dateField].updateValueAndValidity();
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU ) {
       genSection.controls[`expDate`].updateValueAndValidity(); } else {
         genSection.controls[`${this.undertakingType}ExpDate`].updateValueAndValidity(); }
  }
  /*
   * Renew On (Date), should be greater than application date and lesser than expiry Date.
   * CU Renew On (Date), should be greater than application date and lesser than CU expiry Date.
   **/

  setValidatorCalendarDate(dateField) {
    let genSection;
    let expDate;
    if (this.commonData.getIsBankUser() && this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
      expDate = this.sectionForm.parent.get(Constants.SECTION_RU_GENERAL_DETAILS).get('expDate');
    } else {
    if (Constants.MODE_AMEND  ===  this.iuCommonDataService.getMode()) {
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_CU) {
      genSection = this.sectionForm.parent.get(Constants.AMEND_CU_GENERAL_DETAILS);
    } else {
      genSection = this.sectionForm.parent.get(Constants.AMEND_GENERAL_DETAILS);
    }
  } else {
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_CU) {
      genSection = this.sectionForm.parent.get(Constants.SECTION_CU_GENERAL_DETAILS);
    } else {
      genSection = this.sectionForm.parent.get(Constants.SECTION_UNDERTAKING_GENERAL_DETAILS);
    }
  }
    expDate = genSection.get(`${this.undertakingType}ExpDate`);
  }
    // Display Alert Message
    if (expDate.value === '' || expDate.value === null) {
      this.displayErrorDialog = true;
      this.translate.get('ERROR_TITLE').subscribe((value: string) => {
        this.errorTitle = value;
      });
      this.translate.get('EXPIRY_DATE_MANDATORY_ERROR').subscribe((value: string) => {
        this.errorMessage = value;
      });
    }

    this.sectionForm.controls[dateField].clearValidators();

    if (Constants.MODE_AMEND  ===  this.iuCommonDataService.getMode()) {
      this.sectionForm.controls[dateField].setValidators([
        // Check that Renew On(Date), is greater than Amendment/Request Date.
        validateDates(this.sectionForm.get(dateField),
        this.sectionForm.parent.get(Constants.AMEND_GENERAL_DETAILS).get('bgAmdDate'),
        Constants.CALENDAR_DATE, 'amendment request date', Constants.LESSER_THAN),
        // Check that Renew On(Date), is lesser than Expiry Date.
        validateDates(this.sectionForm.get(dateField),
        expDate, Constants.CALENDAR_DATE, Constants.EXPIRY_DATE , Constants.GREATER_THAN)
      ]);
      this.sectionForm.parent.controls[Constants.AMEND_GENERAL_DETAILS].controls.bgExpDate.clearValidators();
      this.sectionForm.parent.controls[Constants.AMEND_GENERAL_DETAILS].controls.bgExpDate.updateValueAndValidity();
    } else {
      const appDateSection = (this.commonData.getIsBankUser() &&
      this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU ) ?
      Constants.SECTION_TRANSACTION_DETAILS : Constants.SECTION_GENERAL_DETAILS;
      this.sectionForm.controls[dateField].setValidators([
      // Check that Renew On(Date), is greater than Application Date.
      validateDates(this.sectionForm.get(dateField),
      this.sectionForm.parent.get(appDateSection).get(Constants.APPL_DATE),
      Constants.CALENDAR_DATE, Constants.APPLICATION_DATE, Constants.LESSER_THAN),
      // Check that Renew On(Date), is lesser than Expiry Date.
      validateDates(this.sectionForm.get(dateField),
      expDate, Constants.CALENDAR_DATE, Constants.EXPIRY_DATE, Constants.GREATER_THAN)
    ]);
      expDate.clearValidators();
      expDate.updateValueAndValidity();
  }
    this.sectionForm.controls[dateField].updateValueAndValidity();
  }

  generatePdf(generatePdfService) {
    if (this.showUndertakingType === 'bg' && this.iuCommonDataService.getPreviewOption() !== 'SUMMARY' ) {
        generatePdfService.setSectionDetails('EXTENSION_DETAILS_LABEL', true, false, 'renewalDetails');
    } else if (this.showUndertakingType === 'cu') {
     generatePdfService.setSectionDetails('COUNTER_EXTENSION_DETAILS_LABEL', true, false, 'cuRenewalDetails');
    }
  }

  /*
   * Clear all fields, when Renewal Allowed is unchecked.
   */
  clearAllFields() {
    this.sectionForm.get(`${this.undertakingType}RenewOnCode`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RenewalCalendarDate`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RenewForNb`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RenewForPeriod`).setValue('');
    this.sectionForm.get(`${this.undertakingType}AdviseRenewalFlag`).setValue('');
    this.sectionForm.get(`${this.undertakingType}AdviseRenewalDaysNb`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RollingRenewOnCode`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RollingRenewForNb`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RollingRenewForPeriod`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RollingDayInMonth`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RollingRenewalNb`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RenewAmtCode`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RollingCancellationDays`).setValue('');
    this.sectionForm.get(`${this.undertakingType}NarrativeCancellation`).setValue('');
    this.sectionForm.get(`${this.undertakingType}FinalExpiryDate`).setValue('');
    this.sectionForm.updateValueAndValidity();
  }

  clearAllValidators() {
    this.sectionForm.get(`${this.undertakingType}RenewOnCode`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RenewOnCode`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}RenewalCalendarDate`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RenewalCalendarDate`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}RenewForNb`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RenewForNb`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}RenewForPeriod`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RenewForPeriod`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}AdviseRenewalFlag`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}AdviseRenewalFlag`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}AdviseRenewalDaysNb`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}AdviseRenewalDaysNb`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}RollingRenewOnCode`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RollingRenewOnCode`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}RollingRenewForNb`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RollingRenewForNb`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}RollingRenewForPeriod`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RollingRenewForPeriod`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}RollingDayInMonth`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RollingDayInMonth`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}RollingRenewalNb`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RollingRenewalNb`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}RenewAmtCode`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RenewAmtCode`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}RollingCancellationDays`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RollingCancellationDays`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}NarrativeCancellation`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}NarrativeCancellation`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}FinalExpiryDate`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}FinalExpiryDate`).setErrors(null);

    this.sectionForm.updateValueAndValidity();
  }

  validateNarrative() {
    if (this.undertakingType === 'bg' &&  this.sectionForm.controls[`bgRollingCancellationDays`].value !== '') {
      this.sectionForm.controls[`bgNarrativeCancellation`].setValidators([Validators.required, Validators.maxLength(Constants.NUMERIC_780),
        validateSwiftCharSet(Constants.X_CHAR)]);
      this.sectionForm.controls[`bgNarrativeCancellation`].updateValueAndValidity();
      this.showNarrativeCancellation = true;
    } else if (this.undertakingType === 'bg' &&  this.sectionForm.controls[`bgRollingCancellationDays`].value === '') {
      this.sectionForm.controls[`bgNarrativeCancellation`].setValidators([Validators.maxLength(Constants.NUMERIC_780),
        validateSwiftCharSet(Constants.X_CHAR)]);
      this.sectionForm.get(`${this.undertakingType}NarrativeCancellation`).setValue('');
      this.sectionForm.controls[`bgNarrativeCancellation`].updateValueAndValidity();
      this.showNarrativeCancellation = false;
    } else if (this.undertakingType === 'cu' &&  this.sectionForm.controls[`cuRollingCancellationDays`].value !== '') {
      this.sectionForm.controls[`cuNarrativeCancellation`].setValidators([Validators.required, Validators.maxLength(Constants.NUMERIC_780),
        validateSwiftCharSet(Constants.X_CHAR)]);
      this.sectionForm.controls[`cuNarrativeCancellation`].updateValueAndValidity();
      this.showNarrativeCancellation = true;
    } else if (this.undertakingType === 'cu' &&  this.sectionForm.controls[`cuRollingCancellationDays`].value === '') {
      this.sectionForm.controls[`cuNarrativeCancellation`].setValidators([Validators.maxLength(Constants.NUMERIC_780),
        validateSwiftCharSet(Constants.X_CHAR)]);
      this.sectionForm.get(`${this.undertakingType}NarrativeCancellation`).setValue('');
      this.sectionForm.controls[`cuNarrativeCancellation`].updateValueAndValidity();
      this.showNarrativeCancellation = false;
    }
  }

  setValueFromField(renewAmtCode, undertakingType) {
    const renewAmtCodeValue = this.iuCommonDataService.getRenewAmtCode(undertakingType);
    if (renewAmtCodeValue && renewAmtCodeValue !== null && renewAmtCodeValue !== '' &&
        (renewAmtCodeValue === this.sectionForm.get(renewAmtCode).value)) {
      this.sectionForm.get(renewAmtCode).reset();
      this.iuCommonDataService.setRenewAmtCode('', undertakingType);
    } else {
      this.iuCommonDataService.setRenewAmtCode(this.sectionForm.get(renewAmtCode).value, undertakingType);
    }
  }
  setVariationFrequencyValidator() {
    let increaseDecreaseForm;
    if (this.undertakingType === 'cu') {
      increaseDecreaseForm = this.sectionForm.parent.get('cuRedIncForm');
    } else {
      increaseDecreaseForm = this.sectionForm.parent.get('redIncForm');
    }
    if (increaseDecreaseForm) {
    this.commonService.validateDatewithExpiryDate(increaseDecreaseForm, this.undertakingType);
    this.finalRenewalExpDate.emit(`${this.sectionForm.get(`${this.undertakingType}FinalExpiryDate`).value},${this.undertakingType}`);
    }
  }



  hasRenewalCalendarDate(): boolean {
    if (this.sectionForm.get(`${this.undertakingType}RenewalCalendarDate`) &&
        this.sectionForm.get(`${this.undertakingType}RenewalCalendarDate`).value !== null &&
        this.sectionForm.get(`${this.undertakingType}RenewalCalendarDate`).value !== '') {
      return true;
    } else {
      return false;
    }
  }

  clearRenewalCalendarDate(event) {
    this.sectionForm.get(`${this.undertakingType}RenewalCalendarDate`).setValue('');
  }

  renewCalendarDateForExpiryForRolling() {
    let genSection;
    //let renewCalendardate;
    let expDate;
    const arg2 = 2;
    if (this.commonData.getIsBankUser() && this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
      expDate = this.sectionForm.parent.get(Constants.SECTION_RU_GENERAL_DETAILS).get('expDate');
    } else {
    if (Constants.MODE_AMEND === this.iuCommonDataService.getMode()) {
      if (this.undertakingType === Constants.UNDERTAKING_TYPE_CU) {
        genSection = this.sectionForm.parent.get(Constants.AMEND_CU_GENERAL_DETAILS);
      } else {
        genSection = this.sectionForm.parent.get(Constants.AMEND_GENERAL_DETAILS);
      }
    } else {
      if (this.undertakingType === Constants.UNDERTAKING_TYPE_CU) {
        genSection = this.sectionForm.parent.get(Constants.SECTION_CU_GENERAL_DETAILS);
      } else {
        genSection = this.sectionForm.parent.get(Constants.SECTION_UNDERTAKING_GENERAL_DETAILS);
      }
    }
    expDate = genSection.get(`${this.undertakingType}ExpDate`);
  }
    const renewCalendardate = expDate.value;
    return renewCalendardate;
  }

  clearAllRenewalFieldsAndValidators() {
    this.sectionForm.get(`${this.undertakingType}RenewFlag`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RenewFlag`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RenewFlag`).setErrors(null);
    this.sectionForm.get(`${this.undertakingType}RenewalType`).setValue('');
    this.sectionForm.get(`${this.undertakingType}RenewalType`).clearValidators();
    this.sectionForm.get(`${this.undertakingType}RenewalType`).setErrors(null);
    // Clear all the other field values
    this.clearAllFields();
    this.clearAllValidators();
  }

}

