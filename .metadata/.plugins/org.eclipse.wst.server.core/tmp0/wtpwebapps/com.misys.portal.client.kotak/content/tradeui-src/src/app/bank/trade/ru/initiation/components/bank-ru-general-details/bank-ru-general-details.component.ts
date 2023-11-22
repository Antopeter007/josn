import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

import { Constants } from './../../../../../../common/constants';
import { CommonService } from './../../../../../../common/services/common.service';
import { LicenseService } from './../../../../../../common/services/license.service';
import { StaticDataService } from './../../../../../../common/services/staticData.service';
import {
  validateDate,
  validateDates,
  validateExpDateWithOtherDate,
  validateSwiftCharSet,
} from './../../../../../../common/validators/common-validator';
import { ValidationService } from './../../../../../../common/validators/validation.service';
import { CodeData } from './../../../../../../trade/common/model/codeData.model';
import { DropdownOptions } from './../../../../../../trade/iu/common/model/DropdownOptions.model';
import { IUService } from './../../../../../../trade/iu/common/service/iu.service';
import { IUCommonDataService } from './../../../../../../trade/iu/common/service/iuCommonData.service';
import { DropdownObject } from './../../../../../../trade/iu/common/model/DropdownObject.model';
import { CommonDataService } from './../../../../../../common/services/common-data.service';
import { TnxIdGeneratorService } from './../../../../../../common/services/tnxIdGenerator.service';

@Component({
  selector: 'fcc-ru-bank-general-details',
  templateUrl: './bank-ru-general-details.component.html',
  styleUrls: ['./bank-ru-general-details.component.scss']
})
export class BankRuGeneralDetailsComponent implements OnInit {
  @Input() public brRecord;
  @Output() expDate = new EventEmitter<string>();
  @Output() expiryDateExtension = new EventEmitter<string>();
  ruGeneraldetailsSection: UntypedFormGroup;
  displayDgar = false;
  displayStby = false;
  displayDepu = false;
  subProductsList;
  selected: string;
  length: any;
  typeOfUndertakingObj: any[] = [];
  typeOfUndertaking: CodeData[];
  public issueDateTypeObj: DropdownOptions[] = [];
  public transmissionMethodObj: DropdownOptions[];
  yearRange: string;
  viewMode: boolean;
  currentDate = this.datePipe.transform(new Date(), Constants.DATE_FORMAT_DMY);
  dateFormat: string;
  isBankUser: boolean;
  isExistingDraftMenu = false;
  isRUScratchUnsignedMode = false;
  bankLargeParamDataMap = new Map();
  deliveryModeDropdown: DropdownOptions[] = [];
  deliveryToDropdown: DropdownOptions[] = [];
  deliveryToOtherApplicableCode: any[] = [];
  swiftVersion: number;
  isSwiftVersion2023Enable = false;
  charLength: number;
  charValidation: string;

  @Output() confInstructions = new EventEmitter<UntypedFormGroup>();
  @Output() resetRenewalDetails = new EventEmitter<any>();
  @Output() formReady = new EventEmitter<UntypedFormGroup>();

  constructor(protected fb: UntypedFormBuilder, public commonService: CommonService,
              protected iuService: IUService, public commonDataService: IUCommonDataService,
              protected staticDataService: StaticDataService, protected datePipe: DatePipe,
              public validationService: ValidationService, protected license: LicenseService,
              public commonData: CommonDataService, public translate: TranslateService,
              public tnxIdGeneratorService: TnxIdGeneratorService,
              public confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.deliveryToOtherApplicableCode = Constants.DELIVERY_TO_OTHER_APPLICABLE_CODE;
    this.isBankUser = this.commonData.getIsBankUser();
    this.commonService. getSwiftVersion();
    this.swiftVersion = this.commonService.swiftVersion;
    if(this.swiftVersion >= Constants.SWIFT_VERSION2023){
     this.isSwiftVersion2023Enable = true;
    }
    this.isExistingDraftMenu = (this.brRecord.tnxTypeCode === Constants.TYPE_REPORTING
      && this.commonData.getMode() === Constants.MODE_DRAFT);
    this.dateFormat = this.commonService.getDateFormat();
    if (this.brRecord.tnxTypeCode === Constants.TYPE_NEW && this.commonData.getProductCode() === 'BR' &&
    this.commonData.getMode() === Constants.MODE_UNSIGNED) {
      this.isRUScratchUnsignedMode = true;
    }
    this.ruGeneralDetails();
    this.setviewmode();
    this.yearRange = this.commonService.getYearRange();
    // Fetch the subproducts acc to the permissions of the user
    this.getSubproductsOnPermission();
    this.transmissionMethodObj =  this.commonDataService.getTransmissionMethod('') as DropdownOptions[];
    this.staticDataService.fetchBusinessCodes(Constants.EFFEC_DATE_TYPE_CODE).subscribe(data => {
        this.issueDateTypeObj = data.dropdownOptions as DropdownOptions[];
    });
    this.fetchLargeParamDataValues(Constants.DELIVERY_MODE_PARM_ID);
    this.fetchLargeParamDataValues(Constants.DELIVERY_TO_PARM_ID);
    this.staticDataService.getCodeData('C082').subscribe(cData => {
        this.typeOfUndertaking = cData.codeData;
        this.typeOfUndertaking.forEach(data => {
          const undertakingElement: any = {};
          undertakingElement.label = data.longDesc;
          undertakingElement.value = data.codeVal;
          this.typeOfUndertakingObj.push(undertakingElement);
          if (this.brRecord.bgTypeCode !== '') {
            this.ruGeneraldetailsSection.get('bgTypeCode').setValue(this.brRecord.bgTypeCode);
          }
        });
      });
    this.datesValidation();
    // Emit the form group to the parent
    this.formReady.emit(this.ruGeneraldetailsSection);
    if (this.brRecord.boRefId && this.brRecord.boRefId !== undefined && this.brRecord.boRefId !== null
      && this.brRecord.boRefId !== ''){
        this.commonDataService.setBORefId(this.brRecord.boRefId);
      }
}
getRows(){
  if(this.isSwiftVersion2023Enable) {
    return Constants.LENGTH_12;
  }
  else {
    return Constants.LENGTH_6;
  }
}
getAllowedCharCount(){
  if(this.isSwiftVersion2023Enable) {
    return Constants.LENGTH_780;
  }
  else {
    return Constants.LENGTH_210;
  }
}
getFieldSize(){
  if(this.isSwiftVersion2023Enable) {
    return 'L';
  }
  else {
    return 'S';
  }
}
getColumns(){
  if(this.isSwiftVersion2023Enable) {
    return Constants.LENGTH_65;
  }
  else {
    return Constants.LENGTH_35;
  }
}
ruGeneralDetails() {
  this.ruGeneraldetailsSection = this.fb.group({
    advSendMode: null,
    advSendModeText: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
    issuingBankReference:  ['', [Validators.required, Validators.maxLength(this.commonService.getCustRefIdLength()),
      validateSwiftCharSet(Constants.X_CHAR)]],
    advisingBankReference:  ['', [Validators.maxLength(Constants.LENGTH_16),
        validateSwiftCharSet(Constants.X_CHAR)]],
    issDate: ['', [Validators.required]],
    additionalCustRef: ['', [Validators.maxLength(Constants.LENGTH_16),
      validateSwiftCharSet(Constants.X_CHAR)]],
    delvOrgUndertaking: null,
    delvOrgUndertakingText: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
    bgDeliveryTo: null,
    bgDeliveryToOther: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_210),
      validateSwiftCharSet(Constants.X_CHAR)]],
    subProductCode: ['', [Validators.required]],
    purpose: ['01'],
    bgTypeCode: ['', [Validators.required]],
    bgTypeDetails: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(Constants.LENGTH_35),
                                    validateSwiftCharSet(Constants.X_CHAR)]],
    cfmInstCode: [''],
    bgTransferIndicator: [''],
    narrativeTransferConditions: [{value: '', disabled: true}, [
    validateSwiftCharSet(Constants.Z_CHAR)]],
    issDateTypeCode: ['', [Validators.required]],
    issDateTypeDetails: [{value: '', disabled: true }, [Validators.required]],
    expDateTypeCode: ['02', Validators.required],
    expDate: ['', [Validators.required]],
    approxExpiryDate: {value: '', disabled: true},
    expEvent: [{value: '', disabled: true}, [validateSwiftCharSet(Constants.X_CHAR), Validators.maxLength(Constants.LENGTH_780)]]
  });
}
datesValidation() {
if (this.brRecord.approxExpiryDate !== null &&
  (this.ruGeneraldetailsSection.get('expDateTypeCode').value === '01' ||
  this.ruGeneraldetailsSection.get('expDateTypeCode').value === '03')) {
    this.ruGeneraldetailsSection.get('approxExpiryDate').enable();
    this.ruGeneraldetailsSection.get('expEvent').enable();
    this.ruGeneraldetailsSection.get('expDate').clearValidators();
    this.ruGeneraldetailsSection.get('expDate').updateValueAndValidity();
}

if (this.brRecord.expDateTypeCode !== '') {
  this.commonDataService.setExpDateType(this.brRecord.expDateTypeCode, '');
} else {
this.commonDataService.setExpDateType('02', '');
}
if (this.brRecord.issDate && this.brRecord.issDate !== null && this.brRecord.issDate !== '') {
  const minDate = this.commonService.getDateObject(this.brRecord.issDate);
  this.commonService.setMinSettlementDate(minDate);
}
}

setviewmode() {
  if (this.commonDataService.getDisplayMode() === Constants.MODE_VIEW) {
    this.viewMode = true;
    if (this.isRUScratchUnsignedMode) {
      this.getFieldValues();
    }
  } else {
    this.viewMode = false;
    if (this.commonDataService.getMode() === Constants.MODE_DRAFT || this.commonDataService.getOption() === Constants.OPTION_EXISTING) {
      this.getFieldValues();
      this.changeDeliveryTo();
      this.onChangeIssuedate();
      this.onCheckedTransferIndicator();
      this.changeTypeOfUndertaking();
  }
  }
}
getSubproductsOnPermission() {
  this.iuService.getIUSubProducts().subscribe(data => {
    this.length = data.dropdownOptions.length;
    this.subProductsList = data.dropdownOptions;
    for (let i = 0; i < this.length; i++) {
      const value = data.dropdownOptions[i].value;
      if (value === Constants.STAND_BY) {
        this.displayStby = true;
      } else if (value === Constants.DEMAND_GUARANTEE) {
        this.displayDgar = true;
      } else if (value === Constants.DEPEND_UNDERTAKING) {
        this.displayDepu = true;
      }
    }
    if (this.brRecord && (this.commonDataService.getMode() === Constants.MODE_DRAFT ||
    this.commonDataService.getOption() === Constants.OPTION_EXISTING ||
    this.commonDataService.getDisplayMode() === Constants.MODE_VIEW)) {
    if (this.brRecord.subProductCode !== '') {
      this.selected = this.brRecord.subProductCode;
      }
    } else {
    if (this.length === 1) {
      this.selected = data.dropdownOptions[0].value;
    } else if (this.displayDgar) {
      this.selected = Constants.DEMAND_GUARANTEE;
    } else if (this.displayStby) {
      this.selected = Constants.STAND_BY;
    } else if (this.displayDepu) {
      this.selected = Constants.DEPEND_UNDERTAKING;
    }
  }
    this.commonDataService.setSubProdCode(this.selected, '');
});
}
getFieldValues() {
  this.ruGeneraldetailsSection.patchValue({
    issuingBankReference: this.brRecord.issuingBankReference,
    advisingBankReference: this.brRecord.advisingBank.reference,
    advSendMode: this.brRecord.advSendMode,
    advSendModeText: this.brRecord.advSendModeText,
    issDate: this.brRecord.issDate,
    additionalCustRef: this.brRecord.additionalCustRef,
    delvOrgUndertaking: this.brRecord.delvOrgUndertaking,
    delvOrgUndertakingText: this.brRecord.delvOrgUndertakingText,
    bgDeliveryTo: this.brRecord.bgDeliveryTo,
    bgDeliveryToOther: this.brRecord.bgDeliveryToOther,
    bgTypeCode: this.brRecord.bgTypeCode,
    issDateTypeCode: this.brRecord.issDateTypeCode,
    issDateTypeDetails: this.brRecord.issDateTypeDetails,
    expDateTypeCode: this.brRecord.expDateTypeCode,
    expDate: this.brRecord.expDate,
    approxExpiryDate: this.brRecord.approxExpiryDate,
    expEvent: this.brRecord.expEvent,
    subProductCode: this.brRecord.subProductCode,
    bgTypeDetails: this.brRecord.bgTypeDetails,
    cfmInstCode: this.brRecord.cfmInstCode,
    bgConfInstructions: this.brRecord.bgConfInstructions,
    bgTransferIndicator: this.commonDataService.getCheckboxBooleanValues(this.brRecord.bgTransferIndicator),
    narrativeTransferConditions: this.brRecord.narrativeTransferConditions,
  });

  this.commonData.setRefId(this.brRecord.refId);
  if ((this.commonData.getIsBankUser()) &&
        this.commonData.getOption() === Constants.OPTION_EXISTING) {
      this.tnxIdGeneratorService.getTransactionId().subscribe(data => {
        this.commonData.setTnxId(data.tnxId);
        this.ruGeneraldetailsSection.patchValue({
          tnxId: this.commonData.getTnxId()
        });
      });
    }
}
onChangeSubProdCode() {
  this.commonDataService.setSubProdCode(this.ruGeneraldetailsSection.get('subProductCode').value, '');
  if (this.ruGeneraldetailsSection.get('subProductCode').value !== Constants.STAND_BY) {
      if (this.ruGeneraldetailsSection.get('cfmInstCode')) {
        this.ruGeneraldetailsSection.get('cfmInstCode').setValue('');
      }
      if (this.ruGeneraldetailsSection.get('bgTransferIndicator').value &&
            this.ruGeneraldetailsSection.get('narrativeTransferConditions')) {
      this.ruGeneraldetailsSection.get('bgTransferIndicator').clearValidators();
      this.ruGeneraldetailsSection.get('bgTransferIndicator').setValue('');
      this.ruGeneraldetailsSection.get('narrativeTransferConditions').clearValidators();
      this.ruGeneraldetailsSection.get('narrativeTransferConditions').setValue('');
    }
  } else if (this.commonDataService.getSubProdCode() === 'STBY') {
      this.ruGeneraldetailsSection.get('cfmInstCode').setValue('03');
      this.setConfInstValue(this.ruGeneraldetailsSection.get('cfmInstCode').value);
    }
}

changeTypeOfUndertaking() {
  this.enableOrDisableFields('bgTypeCode', 'bgTypeDetails', '99');
}

setConfInstValue(value) {
  this.confInstructions.emit(value);
}

onChangeIssuedate() {
  this.enableOrDisableFields('issDateTypeCode', 'issDateTypeDetails', '99');
}

onChangeExpDateTypeCode() {
  if (this.ruGeneraldetailsSection.get('expDateTypeCode').value === '01' ||
  this.ruGeneraldetailsSection.get('expDateTypeCode').value === '03' ) {
    this.ruGeneraldetailsSection.get('expEvent').enable();
    this.ruGeneraldetailsSection.get('expEvent').setValidators([Validators.maxLength(Constants.LENGTH_780),
      validateSwiftCharSet(Constants.X_CHAR)]);
    this.ruGeneraldetailsSection.get('expDate').setValue('');
    this.commonDataService.setExpDate('');
    this.ruGeneraldetailsSection.get('expDate').disable();
    this.ruGeneraldetailsSection.get('expDate').clearValidators();
    this.ruGeneraldetailsSection.get('approxExpiryDate').clearValidators();
    this.ruGeneraldetailsSection.get('approxExpiryDate').setValue('');
    this.ruGeneraldetailsSection.get('approxExpiryDate').enable();
  } else if (this.ruGeneraldetailsSection.get('expDateTypeCode').value === '02') {
    this.ruGeneraldetailsSection.get('expEvent').setValue('');
    this.ruGeneraldetailsSection.get('expEvent').disable();
    this.ruGeneraldetailsSection.get('expDate').enable();
    this.ruGeneraldetailsSection.get('expDate').setValue('');
    this.ruGeneraldetailsSection.get('expDate').setValidators(Validators.required);
    this.ruGeneraldetailsSection.get('expDate').markAsUntouched({ onlySelf: true });
    this.ruGeneraldetailsSection.get('expDate').markAsPristine({ onlySelf: true });
    this.ruGeneraldetailsSection.get('approxExpiryDate').setValue('');
    this.ruGeneraldetailsSection.get('approxExpiryDate').disable();
  }
  this.ruGeneraldetailsSection.updateValueAndValidity();
  this.commonDataService.setExpDateType(this.ruGeneraldetailsSection.get('expDateTypeCode').value, '');
  this.setVariationFrequencyValidator();
  this.resetRenewalDetails.emit();
}

setValidatorExpDate(dateField) {
  const renSection = this.ruGeneraldetailsSection.parent.get('renewalDetailsSection');
  const shipSection = this.ruGeneraldetailsSection.parent.get('shipmentDetailsSection');
  this.ruGeneraldetailsSection.controls[dateField].clearValidators();
  if (renSection !== null && renSection.get('bgFinalExpiryDate') && renSection.get('bgRenewalCalendarDate')) {
    this.ruGeneraldetailsSection.controls[dateField].setValidators([
      validateDates(this.ruGeneraldetailsSection.get(dateField), renSection.get('bgFinalExpiryDate'),
      Constants.EXPIRY_DATE, Constants.FINAL_EXPIRY_DATE, Constants.GREATER_THAN),
      validateExpDateWithOtherDate(this.ruGeneraldetailsSection.get(dateField), this.ruGeneraldetailsSection.get('issDateTypeDetails'),
      Constants.EFFECTIVE_DATE), validateExpDateWithOtherDate(this.ruGeneraldetailsSection.get(dateField),
      renSection.get('bgRenewalCalendarDate'),
      'renewal calendar date'), validateDate(this.ruGeneraldetailsSection.get(dateField).value,
      this.currentDate, Constants.EXPIRY_DATE, Constants.TODAYS_DATE, Constants.LESSER_THAN)]);
    renSection.get('bgFinalExpiryDate').updateValueAndValidity();
  } else {
    this.ruGeneraldetailsSection.controls[dateField].setValidators([
      validateExpDateWithOtherDate(this.ruGeneraldetailsSection.get(dateField), this.ruGeneraldetailsSection.get('issDateTypeDetails'),
      Constants.EFFECTIVE_DATE), validateDate(this.ruGeneraldetailsSection.get(dateField).value,
      this.currentDate, Constants.EXPIRY_DATE, Constants.TODAYS_DATE, Constants.LESSER_THAN)]);
  }
  if (this.commonDataService.getSubProdCode() === Constants.STAND_BY && shipSection !== null && shipSection.get('lastShipDate')) {
    this.ruGeneraldetailsSection.controls[dateField].setValidators([validateExpDateWithOtherDate(
      this.ruGeneraldetailsSection.get(dateField), shipSection.get('lastShipDate'), 'last shipment date')]);
    shipSection.get('lastShipDate').clearValidators();
    shipSection.get('lastShipDate').updateValueAndValidity();
  } else if (this.commonDataService.getSubProdCode() === Constants.STAND_BY &&
   shipSection !== null && shipSection.get('earliestShipDate')) {
    this.ruGeneraldetailsSection.controls[dateField].setValidators([validateExpDateWithOtherDate(
      this.ruGeneraldetailsSection.get(dateField), shipSection.get('earliestShipDate'), 'earliest shipment date')]);
    shipSection.get('earliestShipDate').clearValidators();
    shipSection.get('earliestShipDate').updateValueAndValidity();
  }
  this.ruGeneraldetailsSection.controls[dateField].updateValueAndValidity();
}

setValidationIssueDate(dateField) {
  this.ruGeneraldetailsSection.controls[dateField].clearValidators();
  let relevantExpiryDate;
  if (this.ruGeneraldetailsSection.get('expDateTypeCode').value === '02') {
      relevantExpiryDate = 'expDate';
    } else if (this.ruGeneraldetailsSection.get('expDateTypeCode').value === '03' ||
    this.ruGeneraldetailsSection.get('expDateTypeCode').value === '01') {
      relevantExpiryDate = 'approxExpiryDate';
    }
  if (relevantExpiryDate !== null && relevantExpiryDate !== undefined) {
    this.ruGeneraldetailsSection.controls[dateField].setValidators([validateDate(this.ruGeneraldetailsSection.get(dateField).value,
      this.ruGeneraldetailsSection.get(relevantExpiryDate).value, Constants.EFFECTIVE_DATE, Constants.EXPIRY_DATE, Constants.GREATER_THAN),
      validateDate(this.ruGeneraldetailsSection.get(dateField).value, this.currentDate, Constants.EFFECTIVE_DATE,
       Constants.TODAYS_DATE, Constants.LESSER_THAN)]);
  } else {
  this.ruGeneraldetailsSection.controls[dateField].setValidators([validateDate(this.ruGeneraldetailsSection.get(dateField).value,
    this.currentDate, Constants.EFFECTIVE_DATE, Constants.TODAYS_DATE, Constants.LESSER_THAN)]);
  }
  this.ruGeneraldetailsSection.controls[dateField].updateValueAndValidity();
}

onCheckedTransferIndicator() {
  if (this.ruGeneraldetailsSection.get('bgTransferIndicator').value) {
      this.ruGeneraldetailsSection.get('narrativeTransferConditions').enable();
  } else {
      this.ruGeneraldetailsSection.get('narrativeTransferConditions').setValue('');
      this.ruGeneraldetailsSection.get('narrativeTransferConditions').disable();
    }
  }

  updateLicenseList() {
      if (this.license.licenseMap.length === 0) {
        this.commonDataService.setExpDate(this.ruGeneraldetailsSection.get('expDate').value);
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
          key: 'deleteLicenseConfirmDialog',
          accept: () => {
            this.license.removeLinkedLicense();
            this.commonDataService.setExpDate(this.ruGeneraldetailsSection.get('expDate').value);
          },
          reject: () => {
            this.ruGeneraldetailsSection.get('expDate').setValue(this.commonDataService.getExpDate());
          }
        });
      }
  }
  setVariationFrequencyValidator() {
    let increaseDecreaseForm;
    increaseDecreaseForm = this.ruGeneraldetailsSection.parent.get('redIncForm');
    if (this.ruGeneraldetailsSection.get('expDateTypeCode').value !== '02') {
        this.commonService.maxDate = '';
      }
    this.commonService.validateDatewithExpiryDate(increaseDecreaseForm, 'bg');
    this.expDate.emit(this.ruGeneraldetailsSection.get('expDate').value);
 }
  setExpiryDateForExt() {
   this.expiryDateExtension.emit(this.ruGeneraldetailsSection.get('expDate').value);
  }
  clearApproxExpiryDate(event) {
    this.ruGeneraldetailsSection.get('approxExpiryDate').setValue('');
   }
  updateLicenseListExpType() {
    if (!(this.commonData.disableTnx)) {
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
          key: 'deleteLicenseConfirmDialog',
          accept: () => {
            this.license.removeLinkedLicense();
            this.onChangeExpDateTypeCode();
          },
          reject: () => {
            this.ruGeneraldetailsSection.get('expDateTypeCode').setValue(this.commonDataService.getExpDateType());
            if (this.commonDataService.getExpDateType() === '02') {
              this.ruGeneraldetailsSection.get('expDate').setValue(this.commonDataService.getExpDate());
            }
          }
        });
      }
    }
  }

  enableOrDisableFields(inputField: string, enabledField: string, expectedValue: string) {
    if (this.ruGeneraldetailsSection.get(inputField).value === expectedValue) {
      this.ruGeneraldetailsSection.get(enabledField).markAsUntouched({ onlySelf: true });
      this.ruGeneraldetailsSection.get(enabledField).markAsPristine({ onlySelf: true });
      this.ruGeneraldetailsSection.get(enabledField).updateValueAndValidity();
      this.ruGeneraldetailsSection.get(enabledField).enable();
    } else {
      this.ruGeneraldetailsSection.get(enabledField).setValue('');
      this.ruGeneraldetailsSection.get(enabledField).disable();
   }
  }
  hasApproxExpiryDate(): boolean {
    if (this.ruGeneraldetailsSection.get('approxExpiryDate') &&
    this.ruGeneraldetailsSection.get('approxExpiryDate').value !== null &&
    this.ruGeneraldetailsSection.get('approxExpiryDate').value !== '') {
      return true;
    } else {
      return false;
    }
  }
  changeMethodOfTransmission() {
    this.enableOrDisableFields('advSendMode', 'advSendModeText', '99');
  }

  changeDeliveryTo() {
    if (this.ruGeneraldetailsSection.get('bgDeliveryTo') != null &&
    Constants.DELIVERY_TO_OTHER_APPLICABLE_CODE.indexOf(this.ruGeneraldetailsSection.get('bgDeliveryTo').value) > -1) {
      this.charLength = this.swiftVersion >= Constants.SWIFT_VERSION2023 ? Constants.LENGTH_780 : Constants.LENGTH_210;
      this.charValidation = this.swiftVersion >= Constants.SWIFT_VERSION2023 ? Constants.Z_CHAR : Constants.X_CHAR;
      this.ruGeneraldetailsSection.get('bgDeliveryToOther').clearValidators();
      this.ruGeneraldetailsSection.get('bgDeliveryToOther').markAsUntouched({ onlySelf: true });
      this.ruGeneraldetailsSection.get('bgDeliveryToOther').markAsPristine({ onlySelf: true });
      this.ruGeneraldetailsSection.get('bgDeliveryToOther').updateValueAndValidity();
      this.ruGeneraldetailsSection.get('bgDeliveryToOther').enable();
      this.ruGeneraldetailsSection.get('bgDeliveryToOther').setValidators(
        [Validators.maxLength(this.charLength), validateSwiftCharSet(this.charValidation)]);
    } else {
      this.ruGeneraldetailsSection.get('bgDeliveryToOther').setValue('');
      this.ruGeneraldetailsSection.get('bgDeliveryToOther').disable();
    }
  }

  changeOriginalUndertakingDel() {
    if (this.ruGeneraldetailsSection.get('delvOrgUndertaking') != null &&
      (this.ruGeneraldetailsSection.get('delvOrgUndertaking').value === '99' ||
      this.ruGeneraldetailsSection.get('delvOrgUndertaking').value === '02')) {
      this.ruGeneraldetailsSection.get('delvOrgUndertakingText').clearValidators();
      this.ruGeneraldetailsSection.get('delvOrgUndertakingText').markAsUntouched({ onlySelf: true });
      this.ruGeneraldetailsSection.get('delvOrgUndertakingText').markAsPristine({ onlySelf: true });
      this.ruGeneraldetailsSection.get('delvOrgUndertakingText').updateValueAndValidity();
      this.ruGeneraldetailsSection.get('delvOrgUndertakingText').enable();
      if (this.ruGeneraldetailsSection.get('delvOrgUndertaking').value === '99') {
        this.ruGeneraldetailsSection.get('delvOrgUndertakingText').setValidators(
          [Validators.required, Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      } else {
        this.ruGeneraldetailsSection.get('delvOrgUndertakingText').setValidators(
          [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      }
    } else {
      this.ruGeneraldetailsSection.get('delvOrgUndertakingText').setValue('');
      this.ruGeneraldetailsSection.get('delvOrgUndertakingText').disable();
    }
  }

  generatePdf(generatePdfService) {
    generatePdfService.setSectionDetails('HEADER_GENERAL_DETAILS', true, false, 'generalDetails');
  }
  setValidatorOnIssueDate() {
    this.ruGeneraldetailsSection.get('issDate').setValidators([validateDate(
      this.ruGeneraldetailsSection.get('issDate').value, this.currentDate,
      Constants.ISSUE_DATE, Constants.APPLICATION_DATE, Constants.GREATER_THAN)]);
    this.ruGeneraldetailsSection.get('issDate').updateValueAndValidity();
    const minDate = this.commonService.getDateObject(this.ruGeneraldetailsSection.get(`issDate`).value);
    this.commonService.setMinSettlementDate(minDate);
  }
  fetchLargeParamDataValues(parmId: string) {
    this.staticDataService.fetchLargeParamData(parmId).subscribe(data => {
      if (data && data != null && data.largeParamBankDatas && data.largeParamBankDatas.length !== 0) {
        const largeParamBanks = data.largeParamBankDatas;
        largeParamBanks.forEach(element => {
          this.bankLargeParamDataMap.set(element.bank, element.values);
        });
        const bankSection = this.ruGeneraldetailsSection.parent.get(`ruBankDetailsSection`);

        const recepientBank = (bankSection && bankSection.get(`recipientBankName`) &&
                              bankSection.get(`recipientBankName`).value != null &&
                              bankSection.get(`recipientBankName`).value !== '') ?
                              this.ruGeneraldetailsSection.parent.get(`bankDetailsSection`).get(`recipientBankName`) : '';

        let bankName = this.isBankUser ? this.commonService.getCompanyName() : recepientBank;

        if (bankName !== '' || (this.commonService.isFieldsValuesExists([this.brRecord[`recipientBank`][`abbvName`]]))) {
          if (bankName === '') {
            bankName = this.brRecord[`recipientBank`][`abbvName`];
          }
          this.getLargeParamDataOptions(bankName, true, parmId);
        }
      }
    });
  }
  getLargeParamDataOptions(bankName, persistFieldValue: boolean, parmId: string) {
    if (bankName != null && bankName !== '' && this.bankLargeParamDataMap.size > 0) {
      if (this.ruGeneraldetailsSection.get(`delvOrgUndertaking`) && parmId === Constants.DELIVERY_MODE_PARM_ID) {
        this.deliveryModeDropdown.length = 0;
        const largeParamData = this.bankLargeParamDataMap.get(bankName);
        largeParamData.forEach(element => {
          const largeParamEle: any = {};
          largeParamEle.label = element.label;
          largeParamEle.value = element.value;
          this.deliveryModeDropdown.push(largeParamEle);
          if (this.brRecord[`delvOrgUndertaking`] === element.value && persistFieldValue) {
            this.ruGeneraldetailsSection.get(`delvOrgUndertaking`).setValue(element.value);
          }
      });
      } else if (this.ruGeneraldetailsSection.get(`bgDeliveryTo`) && parmId === Constants.DELIVERY_TO_PARM_ID) {
        this.deliveryToDropdown.length = 0;
        const largeParamData = this.bankLargeParamDataMap.get(bankName);
        largeParamData.forEach(element => {
          const largeParamEle: any = {};
          largeParamEle.label = element.label;
          largeParamEle.value = element.value;
          this.deliveryToDropdown.push(largeParamEle);
          if (this.brRecord[`bgDeliveryTo`] === element.value && persistFieldValue) {
            this.ruGeneraldetailsSection.get(`bgDeliveryTo`).setValue(element.value);
          }
      });
    }
  }
  }
}
