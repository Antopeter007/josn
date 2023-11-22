import { DecimalPipe } from '@angular/common';
import { CommonService } from '../../../../../common/services/common.service';
import { Component, OnInit, Input, AfterContentInit, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { Constants } from '../../../../../common/constants';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng';


import { validateCurrCode, validateSwiftCharSet, validateAmount} from '../../../../../common/validators/common-validator';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { CurrencyDialogComponent } from '../../../../../common/components/currency-dialog/currency-dialog.component';
import { IUCommonDataService } from '../../service/iuCommonData.service';
import { IUService } from '../../service/iu.service';
import { LicenseService } from '../../../../../common/services/license.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonDataService } from '../../../../../common/services/common-data.service';

@Component({
  selector: 'fcc-common-amount-details',
  templateUrl: './common-amount-details.component.html',
  styleUrls: ['./common-amount-details.component.scss']
})
export class CommonAmountDetailsComponent implements OnInit, AfterContentInit {

  @Input() showUndertakingType: string;

  undertakingType = 'Not Defined';

  @Output() bookingAmtCheck1 = new EventEmitter<any>();
  @Output() bgAmtCheck = new EventEmitter<any>();
  @Input() public bgRecord;
  @Input() public sectionForm: UntypedFormGroup;
  commonAmountDetails: UntypedFormGroup;
  viewMode: boolean;
  displayDgar = false;
  displayStby = false;
  displayLuDepu = false;
  hasDepuRole = false;
  subProductsList;
  selected: string;
  tempUndertakingType: string;
  confInstType: string;
  public currencies;
  currencyDecimalMap = new Map<string, number>();
  decimalNumberOfCurrency: number;
  showConfirmingCharge = false;
  showLuConfirmingCharge = false;
  swiftMode = false;
  isBankInquiry: boolean;
  @Output() isTnxAmtCurCodeNull = new EventEmitter<any>();
  @Output() bgCurrencyCode = new EventEmitter<any>();
  isAmountRequired = true;
  swiftVersion: number;
  isSwiftVersion2023Enable = false;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public translate: TranslateService, public confirmationService: ConfirmationService,
              public commonDataService: IUCommonDataService, public commonService: CommonService, public dialog: DialogService,
              public iuService: IUService, public staticDataService: StaticDataService, public license: LicenseService,
              public decimalPipe: DecimalPipe, public commonData: CommonDataService) { }

  ngOnInit() {
   this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();
   this.commonService. getSwiftVersion();
    this.swiftVersion = this.commonService.swiftVersion;
    if(this.swiftVersion >= Constants.SWIFT_VERSION2023){
     this.isSwiftVersion2023Enable = true;
    }
   if (this.commonDataService.getDisplayMode() === 'view') {
        this.viewMode = true;
      } else {
        this.viewMode = false;
      }
   if (this.showUndertakingType === 'bg') {
      this.undertakingType = 'bg';
    } else if (this.showUndertakingType === 'cu') {
      this.undertakingType = 'cu';
      if (Constants.OPTION_HISTORY === this.commonDataService.getOption() && this.commonData.getIsBankUser()) {
        this.isBankInquiry = true;
      }
    }
   if (this.bgRecord[`${this.undertakingType}OpenChrgBorneByCode`]) {
      this.commonDataService.setCharges(this.bgRecord[`${this.undertakingType}OpenChrgBorneByCode`], 'issuance', this.undertakingType);
    }
   if (this.bgRecord[`${this.undertakingType}CorrChrgBorneByCode`]) {
      this.commonDataService.setCharges(this.bgRecord[`${this.undertakingType}CorrChrgBorneByCode`], 'correspondent', this.undertakingType);
    }
   if (this.bgRecord[`${this.undertakingType}ConfChrgBorneByCode`]) {
      this.commonDataService.setCharges(this.bgRecord[`${this.undertakingType}ConfChrgBorneByCode`], 'confirmation', this.undertakingType);
    }
   if (this.commonDataService.getAdvSendMode() !== null) {
      this.setValidatorsIfModeSwift(this.commonDataService.getAdvSendMode());
    }
   if (this.bgRecord.advSendMode && this.bgRecord.advSendMode !== null && this.bgRecord.advSendMode !== '') {
      this.setValidatorsIfModeSwift(this.bgRecord.advSendMode === '01');
    }
   if (this.commonData.getIsBankUser() && (this.bgRecord[`${this.undertakingType}OpenChrgBorneByCode`] === null  ||
    this.bgRecord[`${this.undertakingType}OpenChrgBorneByCode`] === '')) {
    this.sectionForm.get(`${this.undertakingType}OpenChrgBorneByCode`).setValue('');
    }
   if (this.commonData.getIsBankUser() && (this.bgRecord[`${this.undertakingType}CorrChrgBorneByCode`] === null  ||
   this.bgRecord[`${this.undertakingType}CorrChrgBorneByCode`] === '')) {
    this.sectionForm.get(`${this.undertakingType}CorrChrgBorneByCode`).setValue('');
    }
   if (this.commonData.getIsBankUser() &&
   ((this.commonDataService.getSubProdCode() === Constants.STAND_BY &&
   (this.bgRecord[`${this.undertakingType}ConfInstructions`] !== '' &&
   this.bgRecord[`${this.undertakingType}ConfInstructions`] !== '03')) ||
   (this.commonDataService.getCUSubProdCode() === Constants.STAND_BY &&
   (this.bgRecord[`${this.undertakingType}ConfInstructions`] !== '' &&
   this.bgRecord[`${this.undertakingType}ConfInstructions`] !== '03' ))) &&
   (this.bgRecord[`${this.undertakingType}ConfChrgBorneByCode`] === null  ||
   this.bgRecord[`${this.undertakingType}ConfChrgBorneByCode`] === '')) {
    this.sectionForm.get(`${this.undertakingType}ConfChrgBorneByCode`).setValue('02');
    }
  }

  ngAfterContentInit() {

    if ((this.bgRecord[`${this.undertakingType}Consortium`] === 'Y') && !(this.commonData.disableTnx)) {
      this.sectionForm.controls[`${this.undertakingType}Consortium`].enable();
      this.sectionForm.controls[`${this.undertakingType}ConsortiumDetails`].enable();
      this.sectionForm.controls[`${this.undertakingType}NetExposureCurCode`].enable();
    }
    if (this.bgRecord.cuConfInstructions && this.bgRecord.cuConfInstructions !== '03') {
      this.showLuConfirmingCharge = true;
    }
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
    if (this.bgRecord.bgConfInstructions && this.bgRecord.bgConfInstructions !== '03')  {
      this.showConfirmingCharge = true;
    }
  } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU &&
  this.bgRecord.cfmInstCode && this.bgRecord.cfmInstCode !== '03') {
      this.showConfirmingCharge = true;
  }
    if (this.bgRecord[`${this.undertakingType}CurCode`] != null && this.bgRecord[`${this.undertakingType}CurCode`] !== '') {
      this.commonDataService.setCurCode(this.bgRecord[`${this.undertakingType}CurCode`], this.undertakingType);
    }
    this.sectionForm.updateValueAndValidity();
    if (this.commonData.getIsBankUser() && this.bgRecord.productCode === Constants.PRODUCT_CODE_IU &&
    ((this.bgRecord.provisionalStatus === 'Y' || (['98', '78', '79']).includes(this.bgRecord.prodStatCode)) ||
     (this.commonData.getOperation() === Constants.OPERATION_CREATE_REPORTING && this.bgRecord.tnxTypeCode === Constants.TYPE_INQUIRE &&
    this.bgRecord.prodStatCode !== '04' && (this.bgRecord.subTnxTypeCode === '88' || this.bgRecord.subTnxTypeCode === '89')))) {
      this.isAmountRequired = false;
    }
    if (this.sectionForm.get(`${this.undertakingType}AvailableAmt`).value != null &&
    this.sectionForm.get(`${this.undertakingType}AvailableAmt`).value !== '') {
      this.onChangeAvailableAmt();
    }
  }
  checkConfirmingChargeManadatory(confValue) {
    this.sectionForm.get('bgConfChrgBorneByCode').setValue('');
    if (this.commonDataService.getSubProdCode() === Constants.STAND_BY && confValue !== '' && confValue !== '03') {
      this.showConfirmingCharge = true;
      this.sectionForm.get('bgConfChrgBorneByCode').enable();
      if (this.commonData.getIsBankUser()) {
      this.sectionForm.get('bgConfChrgBorneByCode').setValue('02');
      }
    } else {
      this.showConfirmingCharge = false;
      this.sectionForm.get('bgConfChrgBorneByCode').disable();
    }
  }

  checkCuConfirmingChargeManadatory(confValue) {
    this.sectionForm.get('cuConfChrgBorneByCode').setValue('');
    if (this.commonDataService.getCUSubProdCode() === Constants.STAND_BY && confValue !== '' && confValue !== '03') {
      this.showLuConfirmingCharge = true;
      this.sectionForm.get('cuConfChrgBorneByCode').enable();

      if (this.commonData.getIsBankUser()) {
      this.sectionForm.get('cuConfChrgBorneByCode').setValue('02');
      }
    } else {
      this.showLuConfirmingCharge = false;
      this.sectionForm.get('cuConfChrgBorneByCode').disable();
    }

  }
  onChangeSubProductCode(value) {
    this.sectionForm.get('bgConfChrgBorneByCode').setValue('');
    if (value === Constants.STAND_BY) {
      this.sectionForm.get('bgConfChrgBorneByCode').enable();
    } else {
      this.sectionForm.get('bgConfChrgBorneByCode').disable();
    }
  }
  onChangeAvailableAmt() {
    if (this.commonData.getIsBankUser() && (this.showUndertakingType === 'bg' || this.showUndertakingType === 'cu')) {
      let compareString = 'lesserThanOrEqualTo';

      if ((this.sectionForm.get(`${this.undertakingType}NarrativeAdditionalAmount`).value != null &&
        this.sectionForm.get(`${this.undertakingType}NarrativeAdditionalAmount`).value !== '') ||
        (this.sectionForm.get(`${this.undertakingType}TolerancePositivePct`).value != null &&
        this.sectionForm.get(`${this.undertakingType}TolerancePositivePct`).value !== '')) {
          compareString = 'greaterThan';
      }

      this.sectionForm.get(`${this.undertakingType}AvailableAmt`).setValidators(
        validateAmount(this.sectionForm.get(`${this.undertakingType}AvailableAmt`),
      this.sectionForm.get(`${this.undertakingType}Amt`),
      'Available Amt' , 'Undertaking Amount' , compareString));

      if (this.isAmountRequired) {
        this.sectionForm.get(`${this.undertakingType}AvailableAmt`).setValidators([
          validateAmount(this.sectionForm.get(`${this.undertakingType}AvailableAmt`),
        this.sectionForm.get(`${this.undertakingType}Amt`),
        'Available Amt' , 'Undertaking Amount' , compareString), Validators.required]);
      }
      this.sectionForm.get(`${this.undertakingType}AvailableAmt`).updateValueAndValidity();
    }
  }

  onChangeLiabilityAmt() {
    if (this.commonData.getIsBankUser() && (this.showUndertakingType === 'bg' || this.showUndertakingType === 'cu')) {
      this.sectionForm.get(`${this.undertakingType}LiabAmt`).setValidators(
        validateAmount(this.sectionForm.get(`${this.undertakingType}LiabAmt`), this.sectionForm.get(`${this.undertakingType}AvailableAmt`),
        'Liability Amt' , 'Available Amount' , 'greaterThanOrEqualTo'));

      if (this.isAmountRequired) {
        this.sectionForm.get(`${this.undertakingType}LiabAmt`).setValidators([
          validateAmount(this.sectionForm.get(`${this.undertakingType}LiabAmt`),
          this.sectionForm.get(`${this.undertakingType}AvailableAmt`),
        'Liability Amt' , 'Available Amount' , 'greaterThanOrEqualTo'), Validators.required]);
      }
      this.sectionForm.get(`${this.undertakingType}LiabAmt`).updateValueAndValidity();
    }
  }

  toggleConsortiumDetails() {
    if (this.sectionForm.get(`${this.undertakingType}Consortium`).value) {
      this.sectionForm.get(`${this.undertakingType}ConsortiumDetails`).enable();
      this.sectionForm.controls[`${this.undertakingType}NetExposureCurCode`].enable();
      this.sectionForm.controls[`${this.undertakingType}NetExposureAmt`].enable();
      this.sectionForm.get(`${this.undertakingType}NetExposureCurCode`).setValidators([Validators.maxLength(Constants.LENGTH_3),
        validateSwiftCharSet(Constants.X_CHAR)]);
      this.sectionForm.updateValueAndValidity();

    } else {
      this.sectionForm.get(`${this.undertakingType}ConsortiumDetails`).setValue('');
      this.sectionForm.get(`${this.undertakingType}ConsortiumDetails`).disable();
      this.sectionForm.get(`${this.undertakingType}NetExposureCurCode`).setValue('');
      this.sectionForm.get(`${this.undertakingType}NetExposureCurCode`).disable();
      this.sectionForm.get(`${this.undertakingType}NetExposureCurCode`).clearValidators();
      this.sectionForm.get(`${this.undertakingType}NetExposureAmt`).setValue('');
      this.sectionForm.get(`${this.undertakingType}NetExposureAmt`).disable();

    }
  }

  selectCurrency(curCode: any, amtField: any) {
    let dialogHeader = '';
    this.translate.get('KEY_HEADER_CURRENCY_LOOKUP').subscribe((res: string) => {
      dialogHeader =  res;
    });
    const dialogRef = this.dialog.open(CurrencyDialogComponent, {
      header: dialogHeader,
      width: '30vw',
      height: '60vh',
      contentStyle: {overflow: 'auto', height: '60vh'}
    });
    dialogRef.onClose.subscribe((isoCode: string) => {
      if (isoCode) {
        this.sectionForm.get(curCode).setValue(isoCode);
        this.commonDataService.setCurCode(isoCode, this.undertakingType);
        this.sectionForm.get(amtField).updateValueAndValidity();
        this.commonService.transformAmtAndSetValidators( this.sectionForm.get(amtField), this.sectionForm.get(curCode), curCode);
        this.emitVariationCurrCode();
        this.validateBookingAmt();
      }
    });
}

validateTnxAmtWithLimitAmt() {
  this.bgAmtCheck.emit();
}

validateCurrency(value) {
  let tempCurrencies;
  if (this.currencies === undefined || this.currencies === null || this.currencies.length === 0) {
    this.currencies = [];
    this.staticDataService.getCurrencies().subscribe(data => {
      tempCurrencies = data.currencies as string[];
      this.currencies = tempCurrencies;
      value.setValidators([validateCurrCode(this.currencies)]);
      value.updateValueAndValidity();
    });
  } else {
    value.setValidators([validateCurrCode(this.currencies)]);
    value.updateValueAndValidity();
  }
}

validateBookingAmt() {
  this.bookingAmtCheck1.emit();
}

generatePdf(generatePdfService) {
  if (this.showUndertakingType === 'bg') {
      generatePdfService.setSectionDetails('HEADER_AMOUNT_CONFIRMATION_DETAILS', true, false, 'bgAmountDetails');
  } else if (this.showUndertakingType === 'cu') {
      generatePdfService.setSectionDetails('HEADER_COUNTER_AMOUNT_CONFIRMATION_DETAILS', true, false, 'cuAmountDetails');
  }
}

updateLicenseList(inputField) {
  if (this.license.licenseMap.length === 0) {
    if (inputField === 'dialog') {
      this.selectCurrency(`${this.undertakingType}CurCode`, `${this.undertakingType}Amt`);
    }
    this.commonDataService.setCurCode(this.sectionForm.get(`${this.undertakingType}CurCode`).value, this.undertakingType);
    this.sectionForm.get(`${this.undertakingType}CurCode`).setValue(this.commonDataService.getCurCode(this.undertakingType));
  } else if (this.undertakingType === 'bg') {
      let message = '';
      let dialogHeader = '';
      this.translate.get('DELINK_LICENSE_CONFIRMATION_MSG').subscribe((value: string) => {
              message =  value;
              });
      this.translate.get('DAILOG_CONFIRMATION').subscribe((res: string) => {
          dialogHeader =  res;
        });
      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: 'pi pi-exclamation-triangle',
        key: 'deleteLicenseConfirmDialog',
        accept: () => {
          this.license.removeLinkedLicense();
          if (inputField === 'dialog') {
            this.selectCurrency('bgCurCode', 'bgAmt');
          }
          this.commonDataService.setCurCode(this.sectionForm.get(`${this.undertakingType}CurCode`).value, this.undertakingType);
        },
        reject: () => {
          this.sectionForm.get(`${this.undertakingType}CurCode`).setValue(this.commonDataService.getCurCode(this.undertakingType));
        }
      });
    } else {
      if (inputField === 'dialog') {
        this.selectCurrency(`${this.undertakingType}CurCode`, `${this.undertakingType}Amt`);
      }
    }
  this.emitVariationCurrCode();
  }

  clearVariationAmtValidations() {
    this.undertakingType === Constants.UNDERTAKING_TYPE_IU ?
    this.commonService.setUndertakingAmt(this.sectionForm.get(`${this.undertakingType}Amt`).value) :
    this.commonService.setCuUndertakingAmt(this.sectionForm.get(`${this.undertakingType}Amt`).value);
    if (this.sectionForm.get(`${this.undertakingType}CurCode`).value !== '' &&
    this.sectionForm.get(`${this.undertakingType}Amt`).value !== '' && this.sectionForm.get(`${this.undertakingType}Amt`).value !== null) {
    this.isTnxAmtCurCodeNull.emit(`false,${this.undertakingType}`);
   } else {
    this.isTnxAmtCurCodeNull.emit(`true,${this.undertakingType}`);
   }
  }

  setIncDecBgAmt() {

    this.commonService.getMasterDetails(this.bgRecord[`refId`], Constants.PRODUCT_CODE_IU, '').subscribe(data => {
      const orgData = data.masterDetails as string[];
      const orgBgAmt = parseFloat(this.commonService.getNumberWithoutLanguageFormatting(orgData[`bgAmt`]));
      const newBgAmt = parseFloat(this.commonService.getNumberWithoutLanguageFormatting(
        this.sectionForm.get(`${this.undertakingType}Amt`).value));

      if (orgBgAmt > newBgAmt) {
        this.commonData.setSubTnxTypeCode('02');
      } else if (orgBgAmt < newBgAmt) {
        this.commonData.setSubTnxTypeCode('01');
      }
    });
  }

  emitVariationCurrCode() {
    const curCode = `${this.undertakingType}CurCode`;
    this.bgCurrencyCode.emit(`${this.sectionForm.get(curCode).value},${this.undertakingType}`);
  }

  setValueFromField(charge, chargeType, undertakingType) {
    const chargeValue = this.commonDataService.getChargesForCommonAmount(chargeType, undertakingType);
    if (chargeValue && chargeValue !== null && chargeValue !== '' && (chargeValue === this.sectionForm.get(charge).value)) {
      this.sectionForm.get(charge).reset();
      this.commonDataService.setCharges('', chargeType, undertakingType);
    } else {
      this.commonDataService.setCharges(this.sectionForm.get(charge).value, chargeType, undertakingType);
    }
  }

  setValidatorsIfModeSwift(swiftModeSelected) {
    this.swiftMode = swiftModeSelected;
    if (!swiftModeSelected) {
      this.sectionForm.get(`${this.undertakingType}NarrativeAdditionalAmount`).clearValidators();
      this.sectionForm.get(`${this.undertakingType}NarrativeAdditionalAmount`).updateValueAndValidity();
    } else {
      this.sectionForm.get(`${this.undertakingType}NarrativeAdditionalAmount`).clearValidators();
      this.sectionForm.get(`${this.undertakingType}NarrativeAdditionalAmount`).setValidators([Validators.maxLength(Constants.LENGTH_780),
                                                                                                validateSwiftCharSet(Constants.Z_CHAR)]);
      this.sectionForm.get(`${this.undertakingType}NarrativeAdditionalAmount`).updateValueAndValidity();
    }
  }

}
