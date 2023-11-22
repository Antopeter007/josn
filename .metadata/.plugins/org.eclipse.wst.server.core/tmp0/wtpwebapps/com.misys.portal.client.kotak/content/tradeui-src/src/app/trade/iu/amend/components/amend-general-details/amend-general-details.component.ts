import { Constants } from '../../../../../common/constants';
import { Component, OnInit, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ValidationService } from '../../../../../common/validators/validation.service';

import { validateSwiftCharSet, validateDates, validateExpDateWithOtherDate } from '../../../../../common/validators/common-validator';

import { TranslateService } from '@ngx-translate/core';

import { CommonService } from '../../../../../common/services/common.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { IUService } from '../../../common/service/iu.service';
import { LicenseService } from '../../../../../common/services/license.service';
import { ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { IssuedUndertaking } from '../../../common/model/issuedUndertaking.model';


@Component({
  selector: 'fcc-iu-amend-general-details',
  templateUrl: './amend-general-details.component.html',
  styleUrls: ['./amend-general-details.component.scss']
})
export class AmendGeneralDetailsComponent implements OnInit, AfterContentInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Output() confInstructions = new EventEmitter<UntypedFormGroup>();
  @Output() expDate = new EventEmitter<string>();
  @Output() expiryDateExtension = new EventEmitter<string>();
  @Output() resetRenewalDetails = new EventEmitter<any>();
  amendGeneraldetailsSection: UntypedFormGroup;
  expiryDateSelected: string;
  approxExpiryDateSelected: string;
  amdDateSelected: string;
  public jsonContent;
  viewMode = false;
  unsignedMode = false;
  amdNum: string;
  purposeValue: string;
  imagePath: string;
  curDate: string;
  expiryEventFlag = false;
  expiryDateFLag = false;
  approxExpiryDateFlag = false;
  yearRange: string;
  isExpTypeOpen = false;
  orgData = new IssuedUndertaking();
  dateFormat: string;

  constructor(
    protected fb: UntypedFormBuilder, public validationService: ValidationService,
    public commonDataService: IUCommonDataService, public translate: TranslateService, protected iuService: IUService,
    public commonService: CommonService, protected license: LicenseService,
    protected confirmationService: ConfirmationService, public datePipe: DatePipe
    ) { }

  readonly amdRequestDateType = 'amendment request date';
  readonly expiryDateType = 'expiry date';
  readonly expEventLength = 780;
  readonly issueDateType  = 'issue date';

  ngOnInit() {
    this.orgData = this.commonDataService.getOrgData();
    if (this.commonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
      this.unsignedMode = true;
    }
    // Set the value of purpose in Amend based on amend in initiation
    if (this.bgRecord.purpose === '01') {
      this.purposeValue = '01';
    } else if (this.bgRecord[`purpose`] === '02' || this.bgRecord[`purpose`] === '03') {
      this.purposeValue = '02';
    }
    // To get current date
    const format = this.commonService.getUserLanguage() === Constants.LANGUAGE_US ? Constants.DATE_FORMAT : Constants.DATE_FORMAT_DMY;
    const currentDate = this.datePipe.transform(new Date(), format);
    this.curDate = currentDate;
    this.amdDateSelected = currentDate;
    this.dateFormat = this.commonService.getDateFormat();
    const refIdValue = this.bgRecord[`refId`];
    const templateIdLength = 20;
    const custRefIdLength = this.commonService.getCustRefIdLength();
    const additionalCustRefLength = 16;

    this.amendGeneraldetailsSection = this.fb.group({
      refId: '',
      template_id: ['', Validators.maxLength(templateIdLength)],
      custRefId: ['', Validators.maxLength(custRefIdLength)],
      additionalCustRef: ['', Validators.maxLength(additionalCustRefLength)],
      applDate: '',
      bgAmdDate: '',
      bgIssDateTypeCode: '',
      bgIssDateTypeDetails: { value: '', disabled: true },
      purpose: [{ value: '', disabled: false }],
      bgExpDateTypeCode: [{ value: '' }, Validators.required],
      bgExpDate: '',
      bgApproxExpiryDate: { value: '', disabled: true },
      bgExpEvent: [{ value: '' }, [Validators.maxLength(this.expEventLength), validateSwiftCharSet(Constants.X_CHAR)]],
      subProductCode: '',
      purposeValue: '',
      bgAmdNo: '',
      issDate: '',
      curDate: '',
      bgConfInstructions: [''],
      bgTransferIndicator: [''],
      narrativeTransferConditions: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_780),
                                       validateSwiftCharSet(Constants.Z_CHAR)]]
    });
    this.imagePath = this.commonService.getImagePath();
    this.initFieldValues();
    if ((this.commonDataService.getMode() !== Constants.MODE_DRAFT) && !this.unsignedMode) {
      this.iuService.getAmendmentNumber(refIdValue).subscribe(data => {
        const amdNo = data.amdNo as string;
        this.amdNum = amdNo;
        this.amendGeneraldetailsSection.patchValue({ bgAmdNo: this.amdNum });
      });
    } else {
      const amdNoSliceLength = -3;
      const amdNumber = this.bgRecord.bgAmdNo;
      this.amdNum = (`000${amdNumber}`).slice(amdNoSliceLength);
    }
    let amendDate;
    amendDate = this.amdDateSelected ;
    if (amendDate != null && amendDate !== '') {
      amendDate = this.commonService.getDateObject(amendDate);
    }
    this.commonService.setMinFirstDate(amendDate);
    // Emit the form group to the parent
    this.formReady.emit(this.amendGeneraldetailsSection);
    this.yearRange = this.commonService.getYearRange();
  }
  ngAfterContentInit() {
    if (this.bgRecord[`bgTransferIndicator`] === 'Y') {
      this.amendGeneraldetailsSection.controls[`narrativeTransferConditions`].enable();
    }
  }
  initFieldValues() {
    if (this.bgRecord.bgExpDateTypeCode !== '') {
      this.amendGeneraldetailsSection.get('bgExpDateTypeCode').setValue(this.bgRecord.bgExpDateTypeCode);
    }
    this.commonDataService.setExpDate(this.bgRecord.bgExpDate);
    this.commonService.setExpiryDate(this.bgRecord.bgExpDate, 'bg');
    if (this.bgRecord.bgExpDate !== '') {
      this.expiryDateSelected = this.bgRecord.bgExpDate;
    }
    if (this.bgRecord.bgApproxExpiryDate !== '') {
      this.approxExpiryDateSelected = this.bgRecord.bgApproxExpiryDate;
    }
    this.amendGeneraldetailsSection.patchValue({
      refId: this.bgRecord[`refId`],
      template_id: this.bgRecord[`template_id`],
      custRefId: this.bgRecord[`custRefId`],
      additionalCustRef: this.bgRecord[`additionalCustRef`],
      applDate: this.bgRecord[`applDate`],
      bgAmdDate: this.amdDateSelected,
      bgIssDateTypeCode: this.bgRecord[`bgIssDateTypeCode`],
      bgIssDateTypeDetails: this.bgRecord[`bgIssDateTypeDetails`],
      bgExpDate: this.bgRecord[`bgExpDate`],
      purpose: this.purposeValue,
      bgApproxExpiryDate: this.bgRecord[`bgApproxExpiryDate`],
      bgExpEvent: this.bgRecord[`bgExpEvent`],
      subProductCode: this.bgRecord.subProductCode,
      boRefId: this.bgRecord.boRefId,
      bgAmdNo: this.amdNum,
      purposeValue: this.purposeValue,
      issDate: this.bgRecord.issDate,
      curDate: this.curDate,
      bgConfInstructions: this.bgRecord.bgConfInstructions,
      bgTransferIndicator: this.commonDataService.getCheckboxBooleanValues(this.bgRecord.bgTransferIndicator),
      narrativeTransferConditions: this.bgRecord.narrativeTransferConditions
    });
    this.initGeneralFields();
  }
  initGeneralFields() {
    this.commonDataService.setSubProdCode(this.amendGeneraldetailsSection.get('subProductCode').value, '');
    this.commonDataService.setExpDateType(this.amendGeneraldetailsSection.get('bgExpDateTypeCode').value, '');
    if (this.bgRecord.bgExpDateTypeCode === '02') {
      this.amendGeneraldetailsSection.controls.bgExpDate.enable();
      this.amendGeneraldetailsSection.get('bgExpDate').setValidators(Validators.required);
      this.expiryDateFLag = true;
    }
    if (this.bgRecord.bgExpDateTypeCode === '03' || this.bgRecord.bgExpDateTypeCode === '01') {
      this.amendGeneraldetailsSection.controls.bgExpDate.setValue('');
      this.amendGeneraldetailsSection.get('bgExpEvent').enable();
      this.amendGeneraldetailsSection.get('bgExpEvent').setValidators([Validators.maxLength(this.expEventLength),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.amendGeneraldetailsSection.controls.bgApproxExpiryDate.enable();
      if (this.bgRecord.bgExpDateTypeCode === '01') {
        this.isExpTypeOpen = true;
      }
      this.approxExpiryDateFlag = true;
      this.expiryEventFlag = true;
    }
    if (this.bgRecord.bgExpDate !== null && this.bgRecord.bgExpDate !== '' && this.bgRecord.bgExpDate !== undefined) {
      this.amendGeneraldetailsSection.controls.bgExpDate.clearValidators();
      this.amendGeneraldetailsSection.controls.bgExpDate.setValidators(validateDates(
        this.amendGeneraldetailsSection.get(`bgExpDate`), this.amendGeneraldetailsSection.get(`curDate`),
        this.expiryDateType, this.amdRequestDateType, `lesserThan`));
      this.amendGeneraldetailsSection.controls[`bgExpDate`].updateValueAndValidity();
      let maxDate;
      if (this.bgRecord.bgExpDateTypeCode === '02') {
      maxDate = this.bgRecord.bgExpDate;
      maxDate = this.commonService.getDateObject(maxDate);
      } else {
        maxDate = '';
      }
      this.commonService.maxDate = maxDate;
      this.commonService.expiryDateType = Constants.EXPIRY_TYPE;
    }
    this.amendGeneraldetailsSection.updateValueAndValidity();
  }
  onChangeExpDateTypeCode() {
    let value = '';
    if (this.amendGeneraldetailsSection && this.amendGeneraldetailsSection.get('bgExpDateTypeCode')) {
      value = this.amendGeneraldetailsSection.get('bgExpDateTypeCode').value;
    }
    this.commonDataService.setExpDateType(value, '');
    if (value === '01') {
      this.commonDataService.setExpDate('');
      this.amendGeneraldetailsSection.controls.bgExpEvent.setValidators([Validators.maxLength(this.expEventLength),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.amendGeneraldetailsSection.get('bgExpEvent').setValue('');
      this.amendGeneraldetailsSection.get('bgExpEvent').enable();
      this.amendGeneraldetailsSection.controls.bgExpEvent.setValidators([Validators.maxLength(this.expEventLength),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.amendGeneraldetailsSection.get('bgExpDate').setValue('');
      this.amendGeneraldetailsSection.get('bgExpDate').disable();
      this.amendGeneraldetailsSection.get('bgApproxExpiryDate').setErrors(null);
      this.amendGeneraldetailsSection.get('bgApproxExpiryDate').setValue('');
      this.amendGeneraldetailsSection.get('bgApproxExpiryDate').enable();
      this.expiryEventFlag = true;
      this.expiryDateFLag = false;
      this.approxExpiryDateFlag = true;
      this.isExpTypeOpen = true;
      this.amendGeneraldetailsSection.updateValueAndValidity();
    } else if (value === '02') {
      this.amendGeneraldetailsSection.get('bgExpEvent').setValue('');
      this.amendGeneraldetailsSection.get('bgExpEvent').disable();
      this.amendGeneraldetailsSection.get('bgExpDate').enable();
      this.amendGeneraldetailsSection.get('bgExpDate').setValidators(Validators.required);
      this.amendGeneraldetailsSection.get('bgApproxExpiryDate').setValue('');
      this.amendGeneraldetailsSection.get('bgApproxExpiryDate').disable();
      this.expiryEventFlag = false;
      this.expiryDateFLag = true;
      this.isExpTypeOpen = false;
      this.approxExpiryDateFlag = false;
      this.amendGeneraldetailsSection.updateValueAndValidity();
    } else if (value === '03') {
      this.commonDataService.setExpDate('');
      this.amendGeneraldetailsSection.get('bgExpEvent').setValue('');
      this.amendGeneraldetailsSection.get('bgExpEvent').setErrors(null);
      this.amendGeneraldetailsSection.controls.bgExpEvent.setValidators([Validators.required, Validators.maxLength(this.expEventLength),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.amendGeneraldetailsSection.get('bgExpEvent').enable();
      this.amendGeneraldetailsSection.get('bgExpDate').setValue('');
      this.amendGeneraldetailsSection.get('bgExpDate').disable();
      this.amendGeneraldetailsSection.get('bgApproxExpiryDate').setErrors(null);
      this.amendGeneraldetailsSection.get('bgApproxExpiryDate').setValue('');
      this.amendGeneraldetailsSection.get('bgApproxExpiryDate').enable();
      this.expiryEventFlag = true;
      this.expiryDateFLag = false;
      this.isExpTypeOpen = false;
      this.approxExpiryDateFlag = true;
      this.amendGeneraldetailsSection.updateValueAndValidity();
    }
    this.resetRenewalDetails.emit(Constants.UNDERTAKING_TYPE_IU);
  }

  showDailog(refId): void {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;

    const myWindow = window.open(`${url}
      ?option=FULL&referenceid=${refId}&productcode=BG`,
      Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }

  setValidatorAmendDate(dateField) {
    this.amendGeneraldetailsSection.controls[dateField].clearValidators();
    this.amendGeneraldetailsSection.controls[dateField].setValidators([validateDates(
      this.amendGeneraldetailsSection.get(dateField), this.amendGeneraldetailsSection.get('curDate'),
      this.amdRequestDateType, 'current date', Constants.LESSER_THAN),
    validateDates(this.amendGeneraldetailsSection.get(dateField),
      this.amendGeneraldetailsSection.get('bgExpDate'), this.amdRequestDateType, this.expiryDateType, 'greaterThan')]);

    this.amendGeneraldetailsSection.controls[dateField].updateValueAndValidity();
  }

  setValidatorExpDate(dateField) {
    this.commonDataService.setExpDate(this.amendGeneraldetailsSection.get('bgExpDate').value);
    this.amendGeneraldetailsSection.controls[dateField].clearValidators();
    // when expdate type code is projected (03), renewal sections is not applicable so no validators required
    if (this.amendGeneraldetailsSection.get('bgExpDateTypeCode').value === '03') {
      this.amendGeneraldetailsSection.controls[dateField].setValidators([validateDates(
        this.amendGeneraldetailsSection.get(dateField), this.amendGeneraldetailsSection.get('bgAmdDate'),
        this.expiryDateType, this.amdRequestDateType, Constants.LESSER_THAN)]);
    } else if (this.amendGeneraldetailsSection.get('bgExpDateTypeCode').value === '02') {
        this.amendGeneraldetailsSection.parent.controls[Constants.SECTION_RENEWAL_DETAILS].controls.bgRenewalCalendarDate.clearValidators();
        this.amendGeneraldetailsSection.controls[dateField].setValidators([validateDates(
          this.amendGeneraldetailsSection.get(dateField), this.amendGeneraldetailsSection.get('issDate'),
          this.expiryDateType, this.issueDateType, Constants.LESSER_THAN), validateDates(
            this.amendGeneraldetailsSection.get(dateField), this.amendGeneraldetailsSection.get('bgAmdDate'),
            this.expiryDateType, this.amdRequestDateType, Constants.LESSER_THAN), validateDates(
                this.amendGeneraldetailsSection.get(dateField),
                this.amendGeneraldetailsSection.parent.get(Constants.SECTION_RENEWAL_DETAILS).get('bgRenewalCalendarDate'),
                this.expiryDateType, Constants.CALENDAR_DATE, Constants.LESSER_THAN)]);
        this.amendGeneraldetailsSection.parent.controls[Constants.SECTION_RENEWAL_DETAILS].controls.bgRenewalCalendarDate.setErrors(null);
        this.amendGeneraldetailsSection.parent.controls[Constants.SECTION_RENEWAL_DETAILS].controls.bgRenewalCalendarDate.clearValidators();
        this.amendGeneraldetailsSection.parent.controls[Constants.SECTION_RENEWAL_DETAILS]
        .controls.bgRenewalCalendarDate.updateValueAndValidity();
    } else if (this.commonDataService.getSubProdCode() === Constants.STAND_BY) {
      this.amendGeneraldetailsSection.controls[dateField].setValidators([validateDates(
        this.amendGeneraldetailsSection.get(dateField), this.amendGeneraldetailsSection.get('issDate'),
        this.expiryDateType, this.issueDateType, Constants.LESSER_THAN), validateDates(
          this.amendGeneraldetailsSection.get(dateField), this.amendGeneraldetailsSection.get('bgAmdDate'),
          this.expiryDateType, this.amdRequestDateType, Constants.LESSER_THAN), validateExpDateWithOtherDate(
            this.amendGeneraldetailsSection.get(dateField),
            this.amendGeneraldetailsSection.parent.get(Constants.SECTION_SHIPMENT_DETAILS).get('lastShipDate'), 'last shipment date'),
            validateExpDateWithOtherDate(this.amendGeneraldetailsSection.get(dateField),
            this.amendGeneraldetailsSection.parent.get(Constants.SECTION_SHIPMENT_DETAILS)
            .get('earliestShipDate'), 'earliest shipment date')]);
      this.amendGeneraldetailsSection.parent.get(Constants.SECTION_SHIPMENT_DETAILS).get('lastShipDate').clearValidators();
      this.amendGeneraldetailsSection.parent.get(Constants.SECTION_SHIPMENT_DETAILS).get('lastShipDate').updateValueAndValidity();
      this.amendGeneraldetailsSection.parent.get(Constants.SECTION_SHIPMENT_DETAILS).get('earliestShipDate').clearValidators();
      this.amendGeneraldetailsSection.parent.get(Constants.SECTION_SHIPMENT_DETAILS).get('earliestShipDate').updateValueAndValidity();
    } else {
      this.amendGeneraldetailsSection.controls[dateField].setValidators([validateDates(
        this.amendGeneraldetailsSection.get(dateField), this.amendGeneraldetailsSection.get('issDate'),
        this.expiryDateType, this.issueDateType, Constants.LESSER_THAN), validateDates(
          this.amendGeneraldetailsSection.get(dateField), this.amendGeneraldetailsSection.get('bgAmdDate'),
          this.expiryDateType, this.amdRequestDateType, Constants.LESSER_THAN)]);
    }
    this.amendGeneraldetailsSection.controls[dateField].updateValueAndValidity();
    this.amendGeneraldetailsSection.updateValueAndValidity();
  }

  updateLicenseList() {
    if (this.license.licenseMap.length === 0) {
      this.setValidatorExpDate('bgExpDate');
    } else {
      let message = '';
      let dialogHeader = '';
      this.translate.get('DELINK_LICENSE_CONFIRMATION_MSG').subscribe((value: string) => {
        message = value;
      });
      this.translate.get('DAILOG_CONFIRMATION').subscribe((res: string) => {
        dialogHeader = res;
      });
      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: 'pi pi-exclamation-triangle',
        key: 'deleteAmendLicenseConfirmDialog',
        accept: () => {
          this.license.removeLinkedLicense();
          this.setValidatorExpDate('bgExpDate');
        },
        reject: () => {
          this.amendGeneraldetailsSection.get('bgExpDateTypeCode').setValue(this.commonDataService.getExpDate());
        }
      });
    }
  }

  updateLicenseListExpType() {
    if (this.license.licenseMap.length === 0) {
      this.onChangeExpDateTypeCode();
    } else {
      let message = '';
      let dialogHeader = '';
      this.translate.get('DELINK_LICENSE_CONFIRMATION_MSG').subscribe((value: string) => {
        message = value;
      });
      this.translate.get('DAILOG_CONFIRMATION').subscribe((res: string) => {
        dialogHeader = res;
      });
      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: 'pi pi-exclamation-triangle',
        key: 'deleteAmendLicenseConfirmDialog',
        accept: () => {
          this.license.removeLinkedLicense();
          this.onChangeExpDateTypeCode();
        },
        reject: () => {
          this.amendGeneraldetailsSection.get('bgExpDateTypeCode').setValue(this.commonDataService.getExpDateType());
          if (this.commonDataService.getExpDateType() === '02') {
            this.amendGeneraldetailsSection.get('bgExpDateTypeCode').setValue(this.commonDataService.getExpDate());
          }
        }
      });
    }
  }

  setConfInstValue(value) {
      this.confInstructions.emit(value);
  }

  onCheckedTransferIndicator() {
    if (this.amendGeneraldetailsSection.get(`bgTransferIndicator`).value) {
        this.amendGeneraldetailsSection.get(`narrativeTransferConditions`).enable();
    } else {
        this.amendGeneraldetailsSection.get(`narrativeTransferConditions`).setValue('');
        this.amendGeneraldetailsSection.get(`narrativeTransferConditions`).disable();
    }
  }

  setVariationFrequencyValidator() {
    let increaseDecreaseForm;
    if (this.amendGeneraldetailsSection.get(`bgExpDateTypeCode`).value !== '02') {
        this.commonService.maxDate = '';
    }
    increaseDecreaseForm = this.amendGeneraldetailsSection.parent.get(Constants.SECTION_INCR_DECR);
    this.commonService.validateDatewithExpiryDate(increaseDecreaseForm, Constants.UNDERTAKING_TYPE_IU);
    this.expDate.emit(`${this.amendGeneraldetailsSection.get('bgExpDate').value}`);
  }
  setExpiryDateForExt() {
    this.expiryDateExtension.emit(`${this.amendGeneraldetailsSection.get('bgExpDate').value}`);
  }
}
