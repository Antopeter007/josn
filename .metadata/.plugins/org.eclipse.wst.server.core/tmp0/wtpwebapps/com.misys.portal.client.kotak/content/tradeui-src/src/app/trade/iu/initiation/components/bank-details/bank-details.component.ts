import { CommonDataService } from '../../../../../common/services/common-data.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Constants } from '../../../../../common/constants';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { CommonBankDetailsComponent } from '../common-bank-details/common-bank-details.component';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonService } from './../../../../../common/services/common.service';

@Component({
  selector: 'fcc-iu-initiate-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Output() bankAbbvName = new EventEmitter<string>();
  @Output() issuerReferenceChangePass = new EventEmitter<string>();
  bankDetailsSection: UntypedFormGroup;
  @ViewChild(CommonBankDetailsComponent)commonBankDetailsComponent: CommonBankDetailsComponent;
  isBankUser: boolean;
  swiftVersion: number;

  constructor(public fb: UntypedFormBuilder, public commonService: CommonService, public validationService: ValidationService,
              public iuCommonDataService: IUCommonDataService, public commonData: CommonDataService) { }

  ngOnInit() {
    this.isBankUser = this.commonData.getIsBankUser();
    this.bankDetailsSection = this.fb.group({
      leadBankFlag: '',
      recipientBankAbbvNameHidden: '',
      recipientBankAbbvName: ['', [Validators.required]],
      recipientBankName: ['Demo bank'],
      leadBankIdentifier: ['', [Validators.pattern(Constants.REGEX_BIC_CODE)]],
      recipientBankCustomerReference: ['', [Validators.required]],
      issuingBankTypeCode: ['', [Validators.required]],
      issuingBankSwiftCode: [{value: '', disabled: true }, [Validators.pattern(Constants.REGEX_BIC_CODE)]],
      issuingBankName: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      issuingBankAddressLine1: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      issuingBankAddressLine2: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      issuingBankDom: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      issuingBankAddressLine4: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      advisingSwiftCode: ['', [Validators.pattern(Constants.REGEX_BIC_CODE)]],
      advisingBankName: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      advisingBankAddressLine1: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      advisingBankAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      advisingBankDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      advisingBankAddressLine4: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      advBankConfReq: [''],
      adviseThruSwiftCode: ['', [Validators.pattern(Constants.REGEX_BIC_CODE)]],
      adviseThruBankName: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      adviseThruBankAddressLine1: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      adviseThruBankAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      adviseThruBankDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      adviseThruBankAddressLine4: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      adviseThruBankConfReq: [''],
localAdviseThroughSwiftCode: ['', [Validators.pattern(Constants.REGEX_BIC_CODE)]],
      localAdviseThroughName: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      localAdviseThroughAddressLine1: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      localAdviseThroughAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      localAdviseThroughDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      localAdviseThroughAddressLine4: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      localAdviseThroughConfReq: [''],
      confirmingSwiftCode: ['', [Validators.pattern(Constants.REGEX_BIC_CODE)]],
      confirmingBankName: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankAddressLine1: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankAddressLine2: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankDom: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankAddressLine4: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      processingSwiftCode: ['', [Validators.pattern(Constants.REGEX_BIC_CODE)]],
      processingBankName: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      processingBankAddressLine1: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      processingBankAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      processingBankDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      processingBankAddressLine4: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]]
  });

    if (Constants.OPTION_HISTORY === this.iuCommonDataService.getOption() && this.isBankUser) {
      this.bankDetailsSection.addControl('bgAmt', new UntypedFormControl(''));
      this.bankDetailsSection.addControl('bgAvailableAmt', new UntypedFormControl(''));
    }

    if (this.isBankUser || (this.iuCommonDataService.getMode() === Constants.MODE_DRAFT) ||
      (this.iuCommonDataService.getTnxType() === '01' &&
      (this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING
      || this.iuCommonDataService.getOption() === Constants.OPTION_REJECTED)) ||
      (this.commonData.getIsBankUser() && this.commonData.option === Constants.SCRATCH)) {
   this.initFieldValues();
  }
    if (Constants.OPTION_HISTORY === this.iuCommonDataService.getOption() && this.isBankUser) {
      this.bankDetailsSection.patchValue({
        bgAmt: this.bgRecord.bgAmt,
        bgAvailableAmt: this.bgRecord.bgAvailableAmt
      });
    }
   // Emit the form group to the parent
    this.formReady.emit(this.bankDetailsSection);

}

initFieldValues() {
  this.commonService. getSwiftVersion();
  this.swiftVersion = this.commonService.swiftVersion;
  if(this.swiftVersion !== Constants.SWIFT_VERSION2023){
    this.bgRecord.localAdviseThrough = '';
  }
  this.bankDetailsSection.patchValue({
    leadBankFlag: this.iuCommonDataService.getCheckboxBooleanValues(this.bgRecord.leadBankFlag),
    recipientBankAbbvName: this.bgRecord.recipientBank.abbvName,
    recipientBankName: this.bgRecord.recipientBank.name,
    recipientBankCustomerReference: this.bgRecord.recipientBank.reference,
    leadBankIdentifier: this.bgRecord.recipientBank.isoCode,
    issuingBankTypeCode: this.bgRecord.issuingBankTypeCode,
    issuingBankSwiftCode: this.bgRecord.issuingBank.isoCode,
    issuingBankName: this.bgRecord.issuingBank.name,
    issuingBankAddressLine1: this.bgRecord.issuingBank.addressLine1 ,
    issuingBankAddressLine2: this.bgRecord.issuingBank.addressLine2 ,
    issuingBankDom: this.bgRecord.issuingBank.dom,
    issuingBankAddressLine4: this.bgRecord.issuingBank.addressLine4 ,
    advisingSwiftCode: this.bgRecord.advisingBank.isoCode,
    advisingBankName: this.bgRecord.advisingBank.name,
    advisingBankAddressLine1: this.bgRecord.advisingBank.addressLine1,
    advisingBankAddressLine2: this.bgRecord.advisingBank.addressLine2,
    advisingBankDom:  this.bgRecord.advisingBank.dom,
    advisingBankAddressLine4:  this.bgRecord.advisingBank.addressLine4,
    adviseThruSwiftCode: this.bgRecord.adviseThruBank.isoCode,
    adviseThruBankName: this.bgRecord.adviseThruBank.name,
    adviseThruBankAddressLine1: this.bgRecord.adviseThruBank.addressLine1,
    adviseThruBankAddressLine2: this.bgRecord.adviseThruBank.addressLine2,
    adviseThruBankDom: this.bgRecord.adviseThruBank.dom ,
    adviseThruBankAddressLine4: this.bgRecord.adviseThruBank.addressLine4,
localAdviseThroughSwiftCode: this.bgRecord.localAdviseThrough.isoCode,
    localAdviseThroughName: this.bgRecord.localAdviseThrough.name,
    localAdviseThroughAddressLine1: this.bgRecord.localAdviseThrough.addressLine1,
    localAdviseThroughAddressLine2: this.bgRecord.localAdviseThrough.addressLine2,
    localAdviseThroughDom: this.bgRecord.localAdviseThrough.dom,
    localAdviseThroughAddressLine4: this.bgRecord.localAdviseThrough.addressLine4,
    confirmingSwiftCode: this.bgRecord.confirmingBank.isoCode,
    confirmingBankName: this.bgRecord.confirmingBank.name,
    confirmingBankAddressLine1: this.bgRecord.confirmingBank.addressLine1,
    confirmingBankAddressLine2: this.bgRecord.confirmingBank.addressLine2,
    confirmingBankDom: this.bgRecord.confirmingBank.dom,
    confirmingBankAddressLine4: this.bgRecord.confirmingBank.addressLine4,
    processingSwiftCode: this.bgRecord.processingBank.isoCode,
    processingBankName: this.bgRecord.processingBank.name,
    processingBankAddressLine1: this.bgRecord.processingBank.addressLine1 ,
    processingBankAddressLine2: this.bgRecord.processingBank.addressLine2,
    processingBankDom: this.bgRecord.processingBank.dom,
    processingBankAddressLine4: this.bgRecord.processingBank.addressLine4
  });
  if (this.iuCommonDataService.getTnxType() === '01' &&
  (this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING)
  || this.iuCommonDataService.getOption() === Constants.OPTION_REJECTED) {
    this.bankDetailsSection.controls.recipientBankCustomerReference.setValue('');
  }
  if (this.bgRecord.reqConfParty && this.bgRecord.reqConfParty !== null && this.bgRecord.reqConfParty === Constants.ADVISING_BANK) {
    this.bankDetailsSection.get('advBankConfReq').setValue(true);
  } else if (this.bgRecord.reqConfParty && this.bgRecord.reqConfParty !== null &&
     this.bgRecord.reqConfParty === Constants.ADVISE_THRU_BANK) {
    this.bankDetailsSection.get('adviseThruBankConfReq').setValue(true);
  }
}
emitBankName(event) {
  this.bankAbbvName.emit(event);
}
emitIssuerRef(event) {
  this.issuerReferenceChangePass.emit(event);
}
generatePdf(generatePdfService) {
    if (this.commonBankDetailsComponent) {
    this.commonBankDetailsComponent.generatePdf(generatePdfService);
    }
  }
}
