import { DialogService } from 'primeng';
import { BankDialogComponent } from './../../../../../../common/components/bank-dialog/bank-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { validateSwiftCharSet } from './../../../../../../common/validators/common-validator';
import { Constants } from './../../../../../../common/constants';
import { CommonDataService } from './../../../../../../common/services/common-data.service';
import { IUCommonDataService } from './../../../../../../trade/iu/common/service/iuCommonData.service';
import { ValidationService } from './../../../../../../common/validators/validation.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Bank } from './../../../../../../common/model/bank.model';

@Component({
  selector: 'fcc-ru-bank-details',
  templateUrl: './bank-ru-bank-details.component.html',
  styleUrls: ['./bank-ru-bank-details.component.scss']
})

export class BankRuBankDetailsComponent implements OnInit {
  ruBankDetailsSection: UntypedFormGroup;
  tabBankType: string;
  modalBankDialogTitle: string;
  viewMode = false;
  index = 0;
  isMandatory: string;
  @Input() public brRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  isConfirmingBankMandatory = false;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public iuCommonDataService: IUCommonDataService, public commonData: CommonDataService,
              public translate: TranslateService, public dialogService: DialogService) { }

  ngOnInit() {
    this.ruBankDetailsSection =  this.fb.group({
      issuingBankSwiftCode: ['', Validators.pattern(Constants.REGEX_BIC_CODE)],
      issuingBankName: ['', [Validators.required, Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      issuingBankAddressLine1: ['', [Validators.required, Validators.maxLength(Constants.LENGTH_35),
                                    validateSwiftCharSet(Constants.X_CHAR)]],
      issuingBankAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      issuingBankDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      issuingBankAddressLine4: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankSwiftCode: ['', [Validators.pattern(Constants.REGEX_BIC_CODE)]],
      confirmingBankName: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankAddressLine1: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      confirmingBankAddressLine4: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      adviseThruBankSwiftCode: ['', Validators.pattern(Constants.REGEX_BIC_CODE)],
      adviseThruBankName: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      adviseThruBankAddressLine1: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      adviseThruBankAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      adviseThruBankDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      adviseThruBankAddressLine4: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
    });

    if (this.commonData.getDisplayMode() === Constants.MODE_VIEW) {
      this.viewMode = true;
    } else {
      this.viewMode = false;
    }
    this.checkConfirmingBankMandatory(this.brRecord.cfmInstCode);
    if (this.iuCommonDataService.getMode() === Constants.MODE_DRAFT || this.commonData.getOption() === Constants.OPTION_EXISTING) {
     this.initFieldValues();
    }

  // Emit the form group to the parent
    this.formReady.emit(this.ruBankDetailsSection);
  }

  initFieldValues() {
    this.ruBankDetailsSection.patchValue({
      issuingBankTypeCode: this.brRecord.issuingBankTypeCode,
      issuingBankSwiftCode: this.brRecord.issuingBank.isoCode,
      issuingBankName: this.brRecord.issuingBank.name,
      issuingBankAddressLine1: this.brRecord.issuingBank.addressLine1 ,
      issuingBankAddressLine2: this.brRecord.issuingBank.addressLine2 ,
      issuingBankDom: this.brRecord.issuingBank.dom,
      issuingBankAddressLine4: this.brRecord.issuingBank.addressLine4 ,
      advisingSwiftCode: this.brRecord.advisingBank.isoCode,
      advisingBankName: this.brRecord.advisingBank.name,
      advisingBankAddressLine1: this.brRecord.advisingBank.addressLine1,
      advisingBankAddressLine2: this.brRecord.advisingBank.addressLine2,
      advisingBankDom:  this.brRecord.advisingBank.dom,
      advisingBankAddressLine4:  this.brRecord.advisingBank.addressLine4,
      adviseThruBankSwiftCode: this.brRecord.adviseThruBank.isoCode,
      adviseThruBankName: this.brRecord.adviseThruBank.name,
      adviseThruBankAddressLine1: this.brRecord.adviseThruBank.addressLine1,
      adviseThruBankAddressLine2: this.brRecord.adviseThruBank.addressLine2,
      adviseThruBankDom: this.brRecord.adviseThruBank.dom ,
      adviseThruBankAddressLine4: this.brRecord.adviseThruBank.addressLine4,
      confirmingBankSwiftCode: this.brRecord.confirmingBank.isoCode,
      confirmingBankName: this.brRecord.confirmingBank.name,
      confirmingBankAddressLine1: this.brRecord.confirmingBank.addressLine1,
      confirmingBankAddressLine2: this.brRecord.confirmingBank.addressLine2,
      confirmingBankDom: this.brRecord.confirmingBank.dom,
      confirmingBankAddressLine4: this.brRecord.confirmingBank.addressLine4
    });
  }

  openBankDialog(tabBankType: string) {
    this.tabBankType = tabBankType;
    this.translate.get('TABLE_SUMMARY_BANKS_LIST').subscribe((res: string) => {
      this.modalBankDialogTitle =  res;
    });
    const ref = this.dialogService.open(BankDialogComponent, {
      data: {
        id: 'bank'
      },
        header: this.modalBankDialogTitle,
        width: '65vw',
        height: '77vh',
        contentStyle: {overflow: 'auto', height: '77vh'}
      });
    ref.onClose.subscribe((bank) => {
      if (bank) {
        this.setBanksDetails(bank);
      }
    });
  }

  setBanksDetails(bank: Bank) {
        this.ruBankDetailsSection.get(`${this.tabBankType}BankSwiftCode`).setValue(bank.BICCODE);
        this.ruBankDetailsSection.get(`${this.tabBankType}BankAddressLine1`).setValue(bank.ADDRESSLINE1);
        this.ruBankDetailsSection.get(`${this.tabBankType}BankAddressLine2`).setValue(bank.ADDRESSLINE2);
        this.ruBankDetailsSection.get(`${this.tabBankType}BankDom`).setValue(bank.DOMICILE);
        this.ruBankDetailsSection.get(`${this.tabBankType}BankName`).setValue(bank.NAME);
  }

  // Confirming Bank Mandatory Validation: when confirmation Instructions is 01(Confirm) and 02(May Add), Confirming Bank is Mandatory
checkConfirmingBankMandatory(confValue) {
  if ((this.iuCommonDataService.getSubProdCode() === 'STBY' || this.brRecord.subProductCode === 'STBY') &&
  confValue !== '' && confValue !== '03') {
    this.enableConfirmingBankDetails();
  } else {
    this.disableConfirmingBankDetails();
  }
}

enableConfirmingBankDetails() {
      this.isMandatory = '*';
      this.isConfirmingBankMandatory = true;
      if (!(this.commonData.disableTnx)) {
      this.ruBankDetailsSection.get('confirmingBankSwiftCode').enable();
      this.ruBankDetailsSection.get('confirmingBankName').clearValidators();
      this.ruBankDetailsSection.get('confirmingBankName').setValidators([Validators.required,
                 Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      this.ruBankDetailsSection.get('confirmingBankName').enable();
      this.ruBankDetailsSection.get('confirmingBankAddressLine1').clearValidators();
      this.ruBankDetailsSection.get('confirmingBankAddressLine1').setValidators([Validators.required,
               Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      this.ruBankDetailsSection.get('confirmingBankAddressLine1').enable();
      this.ruBankDetailsSection.get('confirmingBankAddressLine2').enable();
      this.ruBankDetailsSection.get('confirmingBankDom').enable();
      this.ruBankDetailsSection.get('confirmingBankAddressLine4').enable();
      this.ruBankDetailsSection.updateValueAndValidity();
      }
}

disableConfirmingBankDetails() {
  this.isMandatory = '';
  this.isConfirmingBankMandatory = false;
  this.ruBankDetailsSection.get('confirmingBankSwiftCode').setValue('');
  this.ruBankDetailsSection.get('confirmingBankSwiftCode').disable();
  this.ruBankDetailsSection.get('confirmingBankName').clearValidators();
  this.ruBankDetailsSection.get('confirmingBankName').setErrors(null);
  this.ruBankDetailsSection.get('confirmingBankAddressLine1').clearValidators();
  this.ruBankDetailsSection.get('confirmingBankAddressLine1').setErrors(null);
  this.ruBankDetailsSection.get('confirmingBankName').setValue('');
  this.ruBankDetailsSection.get('confirmingBankName').disable();
  this.ruBankDetailsSection.get('confirmingBankAddressLine1').setValue('');
  this.ruBankDetailsSection.get('confirmingBankAddressLine1').disable();
  this.ruBankDetailsSection.get('confirmingBankAddressLine2').setValue('');
  this.ruBankDetailsSection.get('confirmingBankAddressLine2').disable();
  this.ruBankDetailsSection.get('confirmingBankDom').setValue('');
  this.ruBankDetailsSection.get('confirmingBankDom').disable();
  this.ruBankDetailsSection.get('confirmingBankAddressLine4').setValue('');
  this.ruBankDetailsSection.get('confirmingBankAddressLine4').disable();
  this.ruBankDetailsSection.updateValueAndValidity();
}
generatePdf(generatePdfService) {
  generatePdfService.setSectionHeader('BANK_DETAILS_LABEL', true);
  generatePdfService.setSectionDetails('BANKDETAILS_ISSUING_BANK_DETAILS', true, true, 'issuingBankDetails');
  generatePdfService.setSectionDetails('BANKDETAILS_TAB_CONFIRMING_BANK', true, true, 'confirmingBankDetails');
  generatePdfService.setSectionDetails('BANKDETAILS_TAB_ADVISE_THRU_BANK', true, true, 'advisingThruBankDetails');
 }

 changeActiveIndex(indexNo) {
  this.index = indexNo;
  }
  handleChange(e) {
    this.index = e.index;
  }
  checkIfBankAvailable(bankType): boolean {
    if (bankType && bankType !== null && this.brRecord[bankType].name) {
      return (Object.values(this.brRecord[bankType]).some(bankField => {
        return bankField !== '';
      }));
    } else {
      return false;
    }
  }
}
