import { LicenseService } from '../../../../common/services/license.service';
import { GeneratePdfService } from '../../../../common/services/generate-pdf.service';

import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { BeneficiaryDialogComponent } from '../../../../common/components/beneficiary-dialog/beneficiary-dialog.component';
import { BankDialogComponent } from '../../../../common/components/bank-dialog/bank-dialog.component';
import { CountryDialogComponent } from '../../../../common/components/country-dialog/country-dialog.component';
import { ValidationService } from '../../../../common/validators/validation.service';
import { Constants } from '../../../../common/constants';
import { CommonService } from '../../../../common/services/common.service';
import { ConfirmationService } from 'primeng/api';
import { IUCommonDataService } from '../../../iu/common/service/iuCommonData.service';
import { CommonDataService } from '../../../../common/services/common-data.service';
import { validateCountryCode, validateSwiftCharSet } from '../../../../../app/common/validators/common-validator';
import { StaticDataService } from '../../../../../app/common/services/staticData.service';
import { CountryValidationService } from '../../../../common/services/countryValidation.service';
import { DialogService } from 'primeng';


interface Beneficiaries {
  abbvname: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  dom: string;
  country: string;
  entity: string;
}

@Component({
  selector: 'fcc-trade-party-details',
  templateUrl: './party-details.component.html',
  styleUrls: ['./party-details.component.scss'],
})
export class PartyDetailsComponent implements OnInit {

  @Input() bankType;
  @Input() viewMode;
  @Input() showAltFlag;
  @Input() showBEICode;
  @Input() labelName;
  @Input() labelAddress;
  @Input() labelCountry;

  @Input() public bgRecord;
  @Input() public genericBankDetails: UntypedFormGroup;
  mode: string;
  displayBeneficiaryDialog = false;
  modalBeneficiaryDialogTitle: string;
  displayCountryDialog = false;
  modalDialogTitle: string;
  displayBankDialog = false;
  modalBankDialogTitle: string;
  tabBankType: string;
  showAltAppSection: boolean;
  showBeneficiaryContact: boolean;
  showCuBeneficiaryContact: boolean;
  swiftMode = false;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService, public commonService: CommonService,
              public commonDataService: IUCommonDataService, public translate: TranslateService, public dialogService: DialogService,
              public generatePdfService: GeneratePdfService,
              public license: LicenseService, public staticDataService: StaticDataService, public confirmationService: ConfirmationService,
              public commonData: CommonDataService, public countryValidationService: CountryValidationService) { }


  get luStatus(): boolean {
    return this.commonDataService.displayLUSection();
  }

  get isBeneMandatory(): boolean {
    return this.commonDataService.getBeneMandatoryVal();
  }

ngOnInit() {
    if (this.commonDataService.getMode() === Constants.MODE_AMEND ||
    (this.commonDataService.getMode() === Constants.MODE_DRAFT && this.commonDataService.getTnxType() === '03')) {
      this.mode = Constants.INITIATE_AMEND;
      this.commonDataService.setBeneficiary(this.bgRecord.beneficiaryName);
    }
    if ((this.commonDataService.getMode() === Constants.MODE_DRAFT || this.commonDataService.getMode() === Constants.MODE_AMEND
        || (this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING)
        || (this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_REJECTED)
        || (this.commonData.getIsBankUser() && this.genericBankDetails))
        && (this.genericBankDetails.get('forAccount') && this.genericBankDetails.get('forAccount').value)) {
      this.showAltAppSection = true;
    } else if (this.commonDataService.getOption() === Constants.OPTION_SCRATCH_GUARANTEE) {
      this.showAltAppSection = false;
    }
    if ((this.commonDataService.getMode() === Constants.MODE_DRAFT
        || ((this.commonDataService.getTnxType() === '01' || this.commonDataService.getTnxType() === '03')
        && (this.commonDataService.getOption() === Constants.OPTION_EXISTING ||
        this.commonDataService.getOption() === Constants.OPTION_REJECTED ||
          this.commonDataService.getOption() === Constants.OPTION_TEMPLATE)))) {
            const arr = [this.bgRecord.contactName, this.bgRecord.contactAddressLine1, this.bgRecord.contactAddressLine2,
              this.bgRecord.contactDom, this.bgRecord.contactAddressLine4, this.bgRecord.contactCountry];
            const contactPresent = this.commonService.isFieldsValuesExists(arr);
            if (this.genericBankDetails.get('beneficiaryContact')) {
              this.genericBankDetails.get('beneficiaryContact').setValue(contactPresent);
            }
            this.showBeneficiaryContact = contactPresent;
    }
    if ((this.commonDataService.getMode() === Constants.MODE_DRAFT
        || ((this.commonDataService.getTnxType() === '01' || this.commonDataService.getTnxType() === '03')
          && (this.commonDataService.getOption() === Constants.OPTION_EXISTING ||
          this.commonDataService.getOption() === Constants.OPTION_REJECTED ||
            this.commonDataService.getOption() === Constants.OPTION_TEMPLATE)))) {
          const arr = [this.bgRecord.cuContact.name, this.bgRecord.cuContact.addressLine1, this.bgRecord.cuContact.addressLine2,
            this.bgRecord.cuContact.dom, this.bgRecord.cuContact.addressLine4, this.bgRecord.cuContact.country];
          const cuContactPresent = this.commonService.isFieldsValuesExists(arr);
          if (this.genericBankDetails.get('cuBeneficiaryContact')) {
            this.genericBankDetails.get('cuBeneficiaryContact').setValue(cuContactPresent);
          }
          this.showCuBeneficiaryContact = cuContactPresent;
    }
    if (this.commonDataService.getAdvSendMode() !== null) {
      this.setValidatorsIfModeSwift(this.commonDataService.getAdvSendMode());
    }
    if (this.bgRecord.advSendMode && this.bgRecord.advSendMode !== null && this.bgRecord.advSendMode !== '') {
      this.commonDataService.setAdvSendMode(this.bgRecord.advSendMode);
      this.setValidatorsIfModeSwift(this.bgRecord.advSendMode === '01');
    }
    if (this.genericBankDetails && this.genericBankDetails.get('forAccount') && this.commonData.disableTnx) {
      this.genericBankDetails.get('forAccount').disable();
    }
  }

toggleAltApplicantDetails() {
  if (this.genericBankDetails.get('forAccount').value) {
    this.showAltAppSection = true;
    this.genericBankDetails.get('altApplicantName').enable();
    this.genericBankDetails.get('altApplicantAddressLine1').enable();
    this.genericBankDetails.get('altApplicantAddressLine2').enable();
    this.genericBankDetails.get('altApplicantDom').enable();
    if (this.commonDataService.getAdvSendMode() !== null && !this.commonDataService.getAdvSendMode()) {
      this.genericBankDetails.get('altApplicantAddressLine4').enable();
      this.genericBankDetails.get('altApplicantAddressLine4').clearValidators();
      this.genericBankDetails.get('altApplicantAddressLine4').setValidators([Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.genericBankDetails.get('altApplicantAddressLine4').updateValueAndValidity();
      this.swiftMode = this.commonDataService.getAdvSendMode();
    } else {
      this.genericBankDetails.get('altApplicantAddressLine4').clearValidators();
      this.genericBankDetails.get('altApplicantAddressLine4').setValue('');
      this.genericBankDetails.get('altApplicantAddressLine4').disable();
      this.swiftMode = this.commonDataService.getAdvSendMode();
    }
    this.genericBankDetails.get('altApplicantCountry').enable();
  } else {
    this.showAltAppSection = false;
    this.genericBankDetails.get('altApplicantName').setValue('');
    this.genericBankDetails.get('altApplicantName').disable();
    this.genericBankDetails.get('altApplicantAddressLine1').setValue('');
    this.genericBankDetails.get('altApplicantAddressLine1').disable();
    this.genericBankDetails.get('altApplicantAddressLine2').setValue('');
    this.genericBankDetails.get('altApplicantAddressLine2').disable();
    this.genericBankDetails.get('altApplicantDom').setValue('');
    this.genericBankDetails.get('altApplicantDom').disable();
    this.genericBankDetails.get('altApplicantAddressLine4').setValue('');
    this.genericBankDetails.get('altApplicantAddressLine4').disable();
    this.genericBankDetails.get('altApplicantCountry').setValue('');
    this.genericBankDetails.get('altApplicantCountry').disable();
  }
}

public openBeneficiaryPopup(bankType): void {
     if (bankType === 'cuBeneficiary') {
       this.openBankDialog(bankType);
     } else {
       this.openBeneficiaryDialog(bankType);
     }
}

public openBeneficiaryDialog(bankType): void {
  this.translate.get('TABLE_SUMMARY_COUNTERPARTIES_LIST').subscribe((res: string) => {
    this.modalDialogTitle =  res;
  });
  this.tabBankType = bankType;
  const ref = this.dialogService.open(BeneficiaryDialogComponent, {
    data: {
      id: 'beneficiary'
    },
      header: this.modalDialogTitle,
      width: '80vw',
      height: '70vh',
      contentStyle: {overflow: 'auto', height: '70vh'}
    });
  ref.onClose.subscribe((bene) => {
    if (bene) {
      this.setBeneficiaryDetailsFromPopUp(bene);
    }
  });
}

openCountryDialog() {
  this.translate.get('TABLE_SUMMARY_COUNTRY_LIST').subscribe((res: string) => {
    this.modalDialogTitle =  res;
  });
  const ref = this.dialogService.open(CountryDialogComponent, {
      header: this.modalDialogTitle,
      width: '30vw',
      height: '65vh',
      contentStyle: {overflow: 'auto', height: '65vh'}
    });
  ref.onClose.subscribe((selectedCountryCode) => {
    if (selectedCountryCode) {
      this.genericBankDetails.get(`${this.bankType}Country`).setValue(selectedCountryCode);
    }
  });
}

openBankDialog(tabBankType: string) {
  this.translate.get('TABLE_SUMMARY_BANKS_LIST').subscribe((res: string) => {
    this.modalBankDialogTitle =  res;
  });
  this.tabBankType = tabBankType;
  const ref = this.dialogService.open(BankDialogComponent, {
    data: {
      id: 'bank'
    },
      header: this.modalBankDialogTitle,
      width: '80vw',
      height: '75vh',
      contentStyle: {overflow: 'auto', height: '75vh'}
    });
  ref.onClose.subscribe((bank) => {
    if (bank) {
      this.genericBankDetails.get(`${this.tabBankType}Name`).setValue(bank.NAME);
      this.genericBankDetails.get(`${this.tabBankType}AddressLine1`).setValue(bank.ADDRESSLINE1);
      this.genericBankDetails.get(`${this.tabBankType}AddressLine2`).setValue(bank.ADDRESSLINE2);
      this.genericBankDetails.get(`${this.tabBankType}Dom`).setValue(bank.DOMICILE);
      if (this.tabBankType === 'cuBeneficiary') {
        this.genericBankDetails.get('cuBeiCode').setValue(bank.BICCODE);
      } else {
        this.genericBankDetails.get('beiCode').setValue(bank.BICCODE);
      }
      // this.commonDataService.setBeneficiary(bene.name);
    }
  });
}

onBankDialogClose(event) {
  if (event.bank) {
    this.genericBankDetails.get(`${this.tabBankType}Name`).setValue(event.bank.NAME);
    this.genericBankDetails.get(`${this.tabBankType}AddressLine1`).setValue(event.bank.ADDRESSLINE1);
    this.genericBankDetails.get(`${this.tabBankType}AddressLine2`).setValue(event.bank.ADDRESSLINE2);
    this.genericBankDetails.get(`${this.tabBankType}Dom`).setValue(event.bank.DOMICILE);
    if (this.tabBankType === 'cuBeneficiary') {
        this.genericBankDetails.get('cuBeiCode').setValue(event.bank.BICCODE);
    } else {
      this.genericBankDetails.get('beiCode').setValue(event.bank.BICCODE);
    }
  }
  if (!event.display) {
    this.tabBankType = '';
  }
  this.displayBankDialog = event.display;
}

generatePdf(generatePdfService, partyType) {
  if (partyType === 'applicant') {
    generatePdfService.setSectionHeader('HEADER_APPLICANT_DETAILS', true);
    if (this.bgRecord.entity !== '' && this.bgRecord.entity !== null && this.commonData.getProductCode() !== Constants.PRODUCT_CODE_RU) {
      const entityDiv = document.getElementById('entity_view_row');
      if (entityDiv.getElementsByTagName('label')[0]) {
        this.generatePdfService.setSectionLabel(entityDiv.getElementsByTagName('label')[0].innerText, false);
      }
      if (entityDiv.getElementsByTagName('label')[1]) {
        this.generatePdfService.setSectionContent(entityDiv.getElementsByTagName('label')[1].innerText, false);
      }
    }
    generatePdfService.setSectionDetails('', false, false, 'applicantDetails');
  }
  if (partyType === 'altApplicant') {
    if (this.bgRecord.forAccount === 'Y') {
      generatePdfService.setSectionLabel('', true);
      generatePdfService.setSubSectionHeader('HEADER_ALTERNATE_PARTY_DETAILS', true);
    }
    generatePdfService.setSectionDetails('', false, false, 'altApplicantDetails');
  }

  if (partyType === 'beneficiary') {

    generatePdfService.setSectionHeader('HEADER_BENEFICIARY_DETAILS', true);
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU && this.bgRecord.entity !== '' && this.bgRecord.entity !== null) {
      const entityDiv = document.getElementById('entity_view_row');
      if (entityDiv.getElementsByTagName('label')[0]) {
        this.generatePdfService.setSectionLabel(entityDiv.getElementsByTagName('label')[0].innerText, false);
      }
      if (entityDiv.getElementsByTagName('label')[1]) {
        this.generatePdfService.setSectionContent(entityDiv.getElementsByTagName('label')[1].innerText, false);
      }
    }
    generatePdfService.setSectionDetails('', false, false, 'beneficiaryDetails');
  }

  if (partyType === 'contact') {
    generatePdfService.setSectionDetails('', false, false, 'contactDetails');
  }


  if (partyType === 'cuBeneficiary') {
    generatePdfService.setSectionDetails('HEADER_COUNTER_BENEFICIARY_DETAILS', true, false, 'cuBeneficiaryDetails');
  }
  if (partyType === 'cuContact') {
    generatePdfService.setSectionDetails('', false, false, 'cuContactDetails');
  }

 }

updateLicenseList(inputType) {
  if (this.license.licenseMap.length === 0) {
    if (inputType === 'dialog') {
      this.openBeneficiaryPopup(this.bankType);
    } else if (this.bankType === 'beneficiary' &&
                inputType === 'input') {
      this.commonDataService.setBeneficiary(this.genericBankDetails.get(`${this.bankType}Name`).value);
      this.commonDataService.setBeneAdd1(this.genericBankDetails.get(`${this.bankType}AddressLine1`).value);
      this.commonDataService.setBeneAdd2(this.genericBankDetails.get(`${this.bankType}AddressLine2`).value);
      this.commonDataService.setBeneDom( this.genericBankDetails.get(`${this.bankType}Dom`).value);
      this.commonDataService.setBeneCount( this.genericBankDetails.get(`${this.bankType}Country`).value);
    } else if (this.bankType === 'beneficiary' || this.bankType === 'cuBeneficiary') {
      this.openBeneficiaryPopup(this.bankType);
    }
  } else {
    if (this.bankType === 'applicant' || this.bankType === 'beneficiary') {
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
        key: 'deleteLicenseConfirmDialogEnt',
        accept: () => {
          this.license.removeLinkedLicense();
          if (inputType === 'dialog') {
            this.openBeneficiaryPopup(this.bankType);
          }
        },
        reject: () => {
          if (this.bankType === 'beneficiary' && inputType === 'input') {
            this.genericBankDetails.get(`${this.bankType}Name`).setValue(this.commonDataService.getBeneficiary());
            this.genericBankDetails.get(`${this.bankType}AddressLine1`).setValue(this.commonDataService.getBeneAdd1());
            this.genericBankDetails.get(`${this.bankType}AddressLine2`).setValue(this.commonDataService.getBeneAdd2());
            this.genericBankDetails.get(`${this.bankType}Dom`).setValue(this.commonDataService.getBeneDom());
            this.genericBankDetails.get(`${this.bankType}Country`).setValue(this.commonDataService.getBeneCount());
          }
        }
    });
  } else if ((this.commonDataService.displayLUSection() && this.bankType === 'cuBeneficiary' && inputType === 'dialog')) {
        this.openBeneficiaryPopup(this.bankType);
  } else if (!((this.bankType === 'beneficiary') ||
    (this.commonDataService.displayLUSection() && this.bankType === 'cuBeneficiary'))) {
      this.openBeneficiaryPopup(this.bankType);
  }
  }
}

  setBeneficiaryDetailsFromPopUp(bene) {
    const beneAdd2 = bene.addressLine2 ? bene.addressLine2 : '';
    const beneDom = bene.dom ? bene.dom : '';
    const beneCountry = bene.country ? bene.country : '';
    this.genericBankDetails.get(`${this.tabBankType}Name`).setValue(bene.name);
    this.genericBankDetails.get(`${this.tabBankType}AddressLine1`).setValue(bene.addressLine1);
    this.genericBankDetails.get(`${this.tabBankType}AddressLine2`).setValue(beneAdd2);
    this.genericBankDetails.get(`${this.tabBankType}Dom`).setValue(beneDom);
    this.genericBankDetails.get(`${this.tabBankType}Country`).setValue(beneCountry);
    if (this.tabBankType === 'cuBeneficiary') {
      this.genericBankDetails.get('cuBeiCode').setValue(bene.bei);
    } else {
      this.genericBankDetails.get('beiCode').setValue(bene.bei);
    }
    if (this.bankType === 'beneficiary') {
      this.commonDataService.setBeneficiary(bene.name);
      this.commonDataService.setBeneAdd1(bene.addressLine1);
      this.commonDataService.setBeneAdd2(beneAdd2);
      this.commonDataService.setBeneDom(beneDom);
      this.commonDataService.setBeneCount(beneCountry);
    }
  }

  /**
   * toggle the beneficiary contact details section.
   */
  toggleBeneficiaryContactDetails(partyType) {
    if (partyType === 'contact' && this.genericBankDetails.get('beneficiaryContact').value) {
      this.showBeneficiaryContact = true;
      this.genericBankDetails.get('contactName').enable();
      this.genericBankDetails.get('contactAddressLine1').enable();
      this.genericBankDetails.get('contactAddressLine2').enable();
      this.genericBankDetails.get('contactDom').enable();
      if (this.commonDataService.getAdvSendMode() !== null && !this.commonDataService.getAdvSendMode()) {
        this.genericBankDetails.get('contactAddressLine4').enable();
        this.genericBankDetails.get('contactAddressLine4').clearValidators();
        this.genericBankDetails.get('contactAddressLine4').setValidators([Validators.maxLength(Constants.LENGTH_35),
        validateSwiftCharSet(Constants.X_CHAR)]);
        this.genericBankDetails.get('contactAddressLine4').updateValueAndValidity();
        this.swiftMode = this.commonDataService.getAdvSendMode();
      } else {
        this.genericBankDetails.get('contactAddressLine4').clearValidators();
        this.genericBankDetails.get('contactAddressLine4').setValue('');
        this.genericBankDetails.get('contactAddressLine4').disable();
        this.swiftMode = this.commonDataService.getAdvSendMode();
      }
    } else if (partyType === 'contact') {
      this.showBeneficiaryContact = false;
      this.genericBankDetails.get('contactName').setValue('');
      this.genericBankDetails.get('contactName').disable();
      this.genericBankDetails.get('contactAddressLine1').setValue('');
      this.genericBankDetails.get('contactAddressLine1').disable();
      this.genericBankDetails.get('contactAddressLine2').setValue('');
      this.genericBankDetails.get('contactAddressLine2').disable();
      this.genericBankDetails.get('contactDom').setValue('');
      this.genericBankDetails.get('contactDom').disable();
      this.genericBankDetails.get('contactAddressLine4').setValue('');
      this.genericBankDetails.get('contactAddressLine4').disable();
    }

    if (partyType === 'cuContact' && this.genericBankDetails.get('cuBeneficiaryContact').value) {
      this.showCuBeneficiaryContact = true;
      this.genericBankDetails.get('cuContactName').enable();
      this.genericBankDetails.get('cuContactAddressLine1').enable();
      this.genericBankDetails.get('cuContactAddressLine2').enable();
      this.genericBankDetails.get('cuContactDom').enable();
      if (this.commonDataService.getAdvSendMode() !== null && !this.commonDataService.getAdvSendMode()) {
        this.genericBankDetails.get('cuContactAddressLine4').enable();
        this.genericBankDetails.get('cuContactAddressLine4').clearValidators();
        this.genericBankDetails.get('cuContactAddressLine4').setValidators([Validators.maxLength(Constants.LENGTH_35),
        validateSwiftCharSet(Constants.X_CHAR)]);
        this.genericBankDetails.get('cuContactAddressLine4').updateValueAndValidity();
        this.swiftMode = this.commonDataService.getAdvSendMode();
      } else {
        this.genericBankDetails.get('cuContactAddressLine4').clearValidators();
        this.genericBankDetails.get('cuContactAddressLine4').setValue('');
        this.genericBankDetails.get('cuContactAddressLine4').disable();
        this.swiftMode = this.commonDataService.getAdvSendMode();
      }
    } else if (partyType === 'cuContact') {
      this.showCuBeneficiaryContact = false;
      this.genericBankDetails.get('cuContactName').setValue('');
      this.genericBankDetails.get('cuContactName').disable();
      this.genericBankDetails.get('cuContactAddressLine1').setValue('');
      this.genericBankDetails.get('cuContactAddressLine1').disable();
      this.genericBankDetails.get('cuContactAddressLine2').setValue('');
      this.genericBankDetails.get('cuContactAddressLine2').disable();
      this.genericBankDetails.get('cuContactDom').setValue('');
      this.genericBankDetails.get('cuContactDom').disable();
      this.genericBankDetails.get('cuContactAddressLine4').setValue('');
      this.genericBankDetails.get('cuContactAddressLine4').disable();
    }
  }
  setValidatorsIfModeSwift(swiftModeSelected) {
    this.swiftMode = swiftModeSelected;
  }

}
