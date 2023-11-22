
import { BankDialogComponent } from './../../../../../common/components/bank-dialog/bank-dialog.component';
import { CommonService } from './../../../../../common/services/common.service';
import { Constants } from '../../../../../common/constants';
import { Component, OnInit, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { ConfirmationService } from 'primeng/api';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { TranslateService } from '@ngx-translate/core';
import { Bank } from '../../../../../common/model/bank.model';
import { DialogService } from 'primeng';


@Component({
  selector: 'fcc-iu-amend-bank-details',
  templateUrl: './amend-bank-details.component.html',
  styleUrls: ['./amend-bank-details.component.scss']
})
export class AmendBankDetailsComponent implements OnInit, AfterContentInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  public amendBankDetailsSection: UntypedFormGroup;
  viewMode: boolean;
  index = 0;
  modalBankDialogTitle: string;
  modalDialogTitle: string;
  public requestedConfirmationPartyObj: any[];
  bankType: string;
  isSearchEnabled = false;
  isBankUser: boolean;
  isAmendBankSectionAvailable = false;
  swiftMode = false;

  constructor(public validationService: ValidationService, public confirmationService: ConfirmationService,
              public commonDataService: IUCommonDataService, public translate: TranslateService,
              public commonService: CommonService, public staticDataService: StaticDataService,
              public dialogService: DialogService,  public commonData: CommonDataService,
              public fb: UntypedFormBuilder) { }

  ngOnInit() {
    if (this.commonDataService.getDisplayMode() === Constants.MODE_VIEW ||
        this.commonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
      this.viewMode = true;
  } else {
      this.viewMode = false;
  }
    // Advising bank should come in the dropdown of Requested Confirmation party,
    // only if Advising bank data is available in the master record.
    if (this.bgRecord.advisingBank.name !== null && this.bgRecord.advisingBank.name !== '' &&
    this.bgRecord.adviseThruBank.name !== null && this.bgRecord.adviseThruBank.name !== '') {
      this.requestedConfirmationPartyObj = [
        {label: '', value: ''},
        {label: this.commonService.getTranslation('BANKDETAILS_TAB_ADVISING_BANK'), value: Constants.ADVISING_BANK},
        {label: this.commonService.getTranslation('BANKDETAILS_TAB_ADVISE_THRU_BANK'), value: Constants.ADVISE_THRU_BANK},
        {label: this.commonService.getTranslation('REQSTD_CONF_PARTY_OTHER'), value: Constants.OTHER}
      ];
    } else if (this.bgRecord.advisingBank.name !== null && this.bgRecord.advisingBank.name !== '') {
    this.requestedConfirmationPartyObj = [
      {label: '', value: ''},
      {label: this.commonService.getTranslation('BANKDETAILS_TAB_ADVISING_BANK'), value: Constants.ADVISING_BANK},
      {label: this.commonService.getTranslation('REQSTD_CONF_PARTY_OTHER'), value: Constants.OTHER}
    ];
   } else if (this.bgRecord.adviseThruBank.name !== null && this.bgRecord.adviseThruBank.name !== '') {
    this.requestedConfirmationPartyObj = [
      {label: '', value: ''},
      {label: this.commonService.getTranslation('BANKDETAILS_TAB_ADVISE_THRU_BANK'), value: Constants.ADVISE_THRU_BANK},
      {label: this.commonService.getTranslation('REQSTD_CONF_PARTY_OTHER'), value: Constants.OTHER}
    ];
   } else {
    this.requestedConfirmationPartyObj = [
      {label: '', value: ''},
      {label: this.commonService.getTranslation('REQSTD_CONF_PARTY_OTHER'), value: Constants.OTHER}
    ];
   }

    this.isBankUser = this.commonData.getIsBankUser();
    this.amendBankDetailsSection =  this.fb.group({
      reqConfParty: [''],
      requestedConfirmationPartySwiftCode: [{value: '', disabled: true }, [Validators.pattern(Constants.REGEX_BIC_CODE)]],
      requestedConfirmationPartyName: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      requestedConfirmationPartyAddressLine1: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      requestedConfirmationPartyAddressLine2: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      requestedConfirmationPartyDom: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      requestedConfirmationPartyAddressLine4: [{value: '', disabled: true }],
      confirmingSwiftCode: [{value: '', disabled: true },  [Validators.pattern(Constants.REGEX_BIC_CODE)]],
      confirmingBankName: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankAddressLine1: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankAddressLine2: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankDom: [{value: '', disabled: true }, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankAddressLine4: [{value: '', disabled: true }]
    });
    if (this.bgRecord.advSendMode && this.bgRecord.advSendMode !== null && this.bgRecord.advSendMode !== '') {
      this.setValidatorsIfModeSwift(this.bgRecord.advSendMode === '01');
     }
    this.initFieldValues();
    // Emit the form group to the parent
    this.formReady.emit(this.amendBankDetailsSection);
  }

  initFieldValues() {
    this.amendBankDetailsSection.patchValue({
      requestedConfirmationPartySwiftCode: this.bgRecord.requestedConfirmationParty.isoCode,
      requestedConfirmationPartyName: this.bgRecord.requestedConfirmationParty.name,
      requestedConfirmationPartyAddressLine1: this.bgRecord.requestedConfirmationParty.addressLine1 ,
      requestedConfirmationPartyAddressLine2: this.bgRecord.requestedConfirmationParty.addressLine2 ,
      requestedConfirmationPartyDom: this.bgRecord.requestedConfirmationParty.dom,
      requestedConfirmationPartyAddressLine4: this.bgRecord.requestedConfirmationParty.addressLine4 ,
      confirmingSwiftCode: this.bgRecord.confirmingBank.isoCode,
      confirmingBankName: this.bgRecord.confirmingBank.name,
      confirmingBankAddressLine1: this.bgRecord.confirmingBank.addressLine1,
      confirmingBankAddressLine2: this.bgRecord.confirmingBank.addressLine2,
      confirmingBankDom: this.bgRecord.confirmingBank.dom,
      confirmingBankAddressLine4: this.bgRecord.confirmingBank.addressLine4,
      reqConfParty: this.bgRecord.reqConfParty
    });

    if (this.commonDataService.getSubProdCode() === Constants.STAND_BY  && this.bgRecord.bgConfInstructions &&
     (this.bgRecord.bgConfInstructions === '01' || this.bgRecord.bgConfInstructions === '02')) {
      this.isAmendBankSectionAvailable = true;
    }

  }

  ngAfterContentInit() {
    if (this.bgRecord[`reqConfParty`] === Constants.OTHER) {
      this.amendBankDetailsSection.get(`requestedConfirmationPartySwiftCode`).enable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyName`).enable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine1`).enable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine2`).enable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyDom`).enable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine4`).enable();
    }
    this.amendBankDetailsSection.updateValueAndValidity();
  }

  changeRequestedConfirmationParty() {
    if (this.amendBankDetailsSection.get(`reqConfParty`).value === Constants.OTHER) {
      this.amendBankDetailsSection.get(`requestedConfirmationPartySwiftCode`).enable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyName`).enable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyName`).setValidators([Validators.required,
        Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine1`).enable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine1`).setValidators([Validators.required,
        Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine2`).enable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyDom`).enable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine4`).enable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartySwiftCode`).setValue('');
      this.amendBankDetailsSection.get(`requestedConfirmationPartyName`).setValue('');
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine1`).setValue('');
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine2`).setValue('');
      this.amendBankDetailsSection.get(`requestedConfirmationPartyDom`).setValue('');
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine4`).setValue('');
      this.amendBankDetailsSection.updateValueAndValidity();
    } else {
      this.amendBankDetailsSection.get(`requestedConfirmationPartyName`).clearValidators();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine1`).clearValidators();
      this.amendBankDetailsSection.get(`requestedConfirmationPartySwiftCode`).disable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyName`).disable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine1`).disable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine2`).disable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyDom`).disable();
      this.amendBankDetailsSection.get(`requestedConfirmationPartyAddressLine4`).disable();
      this.amendBankDetailsSection.updateValueAndValidity();
    }
  }

  setBanksDetails(bank: Bank) {
    if (bank) {
       if (this.bankType === 'requestedConfirmationParty') {
        this.amendBankDetailsSection.get(`${this.bankType}Name`).setValue(bank.NAME);
        this.amendBankDetailsSection.get(`${this.bankType}AddressLine1`).setValue(bank.ADDRESSLINE1);
        this.amendBankDetailsSection.get(`${this.bankType}AddressLine2`).setValue(bank.ADDRESSLINE2);
        this.amendBankDetailsSection.get(`${this.bankType}Dom`).setValue(bank.DOMICILE);
        this.amendBankDetailsSection.get(`${this.bankType}SwiftCode`).setValue(bank.BICCODE);
        this.updateConfirmingBankDetails();
      } else if (this.bankType === 'confirming') {
        this.amendBankDetailsSection.get(`${this.bankType}BankName`).setValue(bank.NAME);
        this.amendBankDetailsSection.get(`${this.bankType}BankAddressLine1`).setValue(bank.ADDRESSLINE1);
        this.amendBankDetailsSection.get(`${this.bankType}BankAddressLine2`).setValue(bank.ADDRESSLINE2);
        this.amendBankDetailsSection.get(`${this.bankType}BankDom`).setValue(bank.DOMICILE);
        this.amendBankDetailsSection.get(`${this.bankType}SwiftCode`).setValue(bank.BICCODE);
      }
    }
  }

  openBankDialog(tabBankType: string) {
    this.bankType = tabBankType;
    this.translate.get('TABLE_SUMMARY_BANKS_LIST').subscribe((res: string) => {
      this.modalBankDialogTitle =  res;
    });
    const ref = this.dialogService.open(BankDialogComponent, {
      data: {
        id: 'bank'
      },
        header: this.modalDialogTitle,
        width: '78vw',
        height: '70vh',
        contentStyle: {overflow: 'auto', height: '70vh'}
       });
    ref.onClose.subscribe((bank) => {
      if (bank) {
        this.setBanksDetails(bank);
      }
    });
  }

  handleChange(e) {
    this.index = e.index;
  }

 // Confirming Bank Mandatory Validation: when confirmation Instructions is 01(Confirm) and 02(May Add), Confirming Bank is Mandatory
checkConfirmingBankMandatory(confValue) {
  this.enableConfirmingBankDetails(confValue);
  if (this.commonDataService.getSubProdCode() === Constants.STAND_BY && confValue !== '' && confValue !== '03') {
       this.isAmendBankSectionAvailable = true;
  } else {
    this.isAmendBankSectionAvailable = false;
  }
}

enableConfirmingBankDetails(confValue) {
  this.amendBankDetailsSection.controls[`reqConfParty`].setValue('');
  this.amendBankDetailsSection.controls[`confirmingBankName`].clearValidators();
  this.amendBankDetailsSection.controls[`confirmingBankName`].setErrors(null);
  this.amendBankDetailsSection.get(`confirmingSwiftCode`).setValue('');
  this.amendBankDetailsSection.get(`confirmingBankName`).setValue('');
  this.amendBankDetailsSection.get(`confirmingBankAddressLine1`).setValue('');
  this.amendBankDetailsSection.get(`confirmingBankAddressLine2`).setValue('');
  this.amendBankDetailsSection.get(`confirmingBankDom`).setValue('');
  this.amendBankDetailsSection.get(`confirmingBankAddressLine4`).setValue('');
  this.amendBankDetailsSection.updateValueAndValidity();
  this.changeRequestedConfirmationParty();
}

checkConfirmingBankAndRequestedConfirmationParty() {
  const arrRequestedConfirmationParty = [this.bgRecord.requestedConfirmationParty.isoCode,
    this.bgRecord.requestedConfirmationParty.name,
    this.bgRecord.requestedConfirmationParty.addressLine1 ,
    this.bgRecord.requestedConfirmationParty.addressLine2 ,
    this.bgRecord.requestedConfirmationParty.dom,
    this.bgRecord.requestedConfirmationParty.addressLine4,
    this.bgRecord.reqConfParty,
    this.bgRecord.confirmingBank.name,
    this.bgRecord.confirmingBank.addressLine1 ,
    this.bgRecord.confirmingBank.addressLine2 ,
    this.bgRecord.confirmingBank.dom,
    this.bgRecord.confirmingBank.addressLine4];

  return this.commonService.isFieldsValuesExists(arrRequestedConfirmationParty);
}

generatePdf(generatePdfService) {
  if (this.commonDataService.getPreviewOption() !== 'SUMMARY' && this.isAmendBankSectionAvailable) {
    generatePdfService.setSectionHeader('BANK_AND_CONFIRMING_PARTY_DETAILS_LABEL', true);
    generatePdfService.setSectionDetails('BANKDETAILS_TAB_REQUESTED_CONFIRMATION_PARTY', true, true, 'reqConfPartyDetails');
    generatePdfService.setSectionDetails('BANKDETAILS_TAB_CONFIRMING_BANK', true, true, 'confirmingBankDetails');
   }
}

setValidatorsIfModeSwift(swiftModeSelected) {
  this.swiftMode = swiftModeSelected;
  if (!swiftModeSelected) {
    this.amendBankDetailsSection.get('requestedConfirmationPartyAddressLine4').enable();
    this.amendBankDetailsSection.get('requestedConfirmationPartyAddressLine4').clearValidators();
    this.amendBankDetailsSection.get('requestedConfirmationPartyAddressLine4').setValidators([Validators.maxLength(Constants.LENGTH_35),
                                                                                  validateSwiftCharSet(Constants.X_CHAR)]);
    this.amendBankDetailsSection.get('requestedConfirmationPartyAddressLine4').updateValueAndValidity();
    this.amendBankDetailsSection.get('confirmingBankAddressLine4').clearValidators();
    this.amendBankDetailsSection.get('confirmingBankAddressLine4').setValidators([Validators.maxLength(Constants.LENGTH_35),
                                                                                  validateSwiftCharSet(Constants.X_CHAR)]);
    this.amendBankDetailsSection.get('confirmingBankAddressLine4').updateValueAndValidity();
  } else {
    this.amendBankDetailsSection.get('requestedConfirmationPartyAddressLine4').clearValidators();
    this.amendBankDetailsSection.get('requestedConfirmationPartyAddressLine4').setValue('');
    this.amendBankDetailsSection.get('requestedConfirmationPartyAddressLine4').disable();
    this.amendBankDetailsSection.get('confirmingBankAddressLine4').clearValidators();
    this.amendBankDetailsSection.get('confirmingBankAddressLine4').setValue('');
    this.amendBankDetailsSection.get('confirmingBankAddressLine4').disable();
  }
}

updateConfirmingBankDetails() {
  if (this.amendBankDetailsSection.get('reqConfParty').value === Constants.ADVISE_THRU_BANK) {
  this.amendBankDetailsSection.patchValue({
    confirmingSwiftCode: this.bgRecord.adviseThruBank.isoCode,
    confirmingBankName: this.bgRecord.adviseThruBank.name,
    confirmingBankAddressLine1: this.bgRecord.adviseThruBank.addressLine1,
    confirmingBankAddressLine2: this.bgRecord.adviseThruBank.addressLine2,
    confirmingBankDom: this.bgRecord.adviseThruBank.dom,
    confirmingBankAddressLine4: this.bgRecord.adviseThruBank.addressLine4
  });
} else if (this.amendBankDetailsSection.get('reqConfParty').value === Constants.ADVISING_BANK) {
  this.amendBankDetailsSection.patchValue({
    confirmingSwiftCode: this.bgRecord.advisingBank.isoCode,
    confirmingBankName: this.bgRecord.advisingBank.name,
    confirmingBankAddressLine1: this.bgRecord.advisingBank.addressLine1,
    confirmingBankAddressLine2: this.bgRecord.advisingBank.addressLine2,
    confirmingBankDom: this.bgRecord.advisingBank.dom,
    confirmingBankAddressLine4: this.bgRecord.advisingBank.addressLine4
  });
} else if (this.amendBankDetailsSection.get('reqConfParty').value === Constants.OTHER) {
  this.amendBankDetailsSection.patchValue({
    confirmingSwiftCode: this.amendBankDetailsSection.get('requestedConfirmationPartySwiftCode').value,
    confirmingBankName: this.amendBankDetailsSection.get('requestedConfirmationPartyName').value,
    confirmingBankAddressLine1: this.amendBankDetailsSection.get('requestedConfirmationPartyAddressLine1').value,
    confirmingBankAddressLine2: this.amendBankDetailsSection.get('requestedConfirmationPartyAddressLine2').value,
    confirmingBankDom: this.amendBankDetailsSection.get('requestedConfirmationPartyDom').value,
    confirmingBankAddressLine4: this.amendBankDetailsSection.get('requestedConfirmationPartyAddressLine4').value
  });
} else {
  this.amendBankDetailsSection.patchValue({
    confirmingSwiftCode: '',
    confirmingBankName: '',
    confirmingBankAddressLine1: '',
    confirmingBankAddressLine2: '',
    confirmingBankDom: '',
    confirmingBankAddressLine4: ''
  });
}

}

}

