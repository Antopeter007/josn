import { CommonDataService } from './../../../../../common/services/common-data.service';
import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DialogService } from 'primeng';
import { TabView } from 'primeng/tabview';

import { Constants } from '../../../../../common/constants';
import { Bank } from '../../../../../common/model/bank.model';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { CommonService } from '../../../../../common/services/common.service';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { BankDialogComponent } from '../../../../../common/components/bank-dialog/bank-dialog.component';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';



export interface BankList {
  ABBVNAME: string;
  ENTITY: string;
  NAME: string;
  ADDRESSLINE1: string;
  ADDRESSLINE2: string;
  DOMICILE: string;
  ADDRESSLINE4: string;
  BICCODE: string;
}

export interface IssuerReference {
  reference: string;
  description: string;
}

export interface LeadBank {
  bankname: string;
  bankId: string;
}

@Component({
  selector: 'fcc-iu-common-bank-details',
  templateUrl: './common-bank-details.component.html',
  styleUrls: ['./common-bank-details.component.scss'],
})
export class CommonBankDetailsComponent implements OnInit, AfterContentInit {

  @Input() public bgRecord;
  @Input() public customerRef;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Output() bankName = new EventEmitter<string>();
  @Output() issuerReferenceChange = new EventEmitter<any>();
  @Input() public undertakingType: string;
  @Input() public formName: UntypedFormGroup;
  @Input() adviseBankRequired = true;
  viewMode: boolean;
  index = 0;
  genericBankDetails: UntypedFormGroup;
  headerBankListDialog: string;
  displayBankDialog = false;
  modalBankDialogTitle: string;
  selectedBank: BankList;
  tabUndertakingType: string;
  tabBankType: string;
  modalDialogTitle: string;
  @ViewChild(TabView) tabView: TabView;
  public bankTypeObj: any[] = [];
  public referenceObj: any[] = [];
  public bankDetails;
  bankAbbvName: string;
  swiftMode = false;

  constructor(public validationService: ValidationService, public confirmationService: ConfirmationService,
              public commonDataService: IUCommonDataService, public translate: TranslateService,
              public commonService: CommonService, public staticDataService: StaticDataService,
              public dialogService: DialogService, public commonData: CommonDataService) { }

  bankNameLabel = this.commonService.getTranslation('RECIPIENT_BANK_NAME');
  bankIdentifier = this.commonService.getTranslation('RECIPIENT_BANK_IDENTIFIER');
  showProcessingBankTab = false;
  isConfirmingBankMandatory = false;
  isLocalAdviseThroughMandatory = false;
  enableConfirmPopUp = true;
  showIssuingSwiftCode = false;
  selectedIssuerReference: string;
  public issuingInstructionsObj: any[];
  isMandatory: string;
  isProcessingBankMandatory: string;
  isAdvisingBankMandatory: string;
  bankType: string;
  isMT798Enabled = false;
  toDisplayRecipientBank = false;

   ngOnInit() {
    if (this.commonDataService.getDisplayMode() === 'view') {
        this.viewMode = true;
    } else {
        this.viewMode = false;
    }
    if (this.bgRecord.advSendMode === '01') {
      this.swiftMode = true;
    }
    if (this.commonService.getUserLanguage() === 'ar') {
      // Align the tabs for RTL. Since the alignment is fixed, we are adding a custom style here
      const style = document.createElement('style');
      style.innerHTML =
        'body .ui-tabview.ui-tabview-top .ui-tabview-nav li {' +
        'float: right;' +
        '}';
      const ref = document.querySelector('style');
      ref.parentNode.insertBefore(style, ref);
    }
    this.issuingInstructionsObj = [
      {label: this.commonService.getTranslation('ISSUING_INSTR_DIRECT'), value: '01'},
      {label: this.commonService.getTranslation('ISSUING_INSTR_INDIRECT'), value: '02'}
     ];

    if (this.commonData.getIsBankUser() && this.undertakingType === '') {
      this.formName.controls.recipientBankAbbvName.clearValidators();
      this.formName.controls.recipientBankCustomerReference.clearValidators();
      this.formName.get('recipientBankAbbvName').setValue(this.bgRecord.recipientBank.abbvName);
      this.formName.get('recipientBankAbbvNameHidden').setValue(this.bgRecord.recipientBank.abbvName);
      this.formName.get('recipientBankCustomerReference').setValue(this.bgRecord.applicantReference);
      this.bankName.emit(this.bgRecord.recipientBank.abbvName);
    } else if (this.formName) {
      let entityName;
      if (this.formName.parent.get(Constants.SECTION_APPLICANT_DETAILS)
          && this.formName.parent.get(Constants.SECTION_APPLICANT_DETAILS).get('entity') !== undefined
          && this.formName.parent.get(Constants.SECTION_APPLICANT_DETAILS).get('entity').value !== '') {
         entityName = this.formName.parent.get(Constants.SECTION_APPLICANT_DETAILS).get('entity').value;
      } else if (this.bgRecord.entity !== null) {
          entityName = this.bgRecord.entity;
      } else {
        entityName = '';
      }
    // get Associated Bank
      this.staticDataService.getAssociatedBank(entityName).subscribe(data => {
      this.commonDataService.setBankDetails(data.associatedBanks);
      this.commonDataService.setBankNameDetails(data.associatedBanks);
      if (data.associatedBanks.length >= 1) {
        if (data.associatedBanks.length > 1) {
          this.toDisplayRecipientBank = true;
          this.commonData.setIsMultiBank(true);
        } else {
          this.toDisplayRecipientBank = false;
        }
        this.bankDetails = data;
        this.bankTypeObj.length = 0;
        data.associatedBanks.forEach(obj => {
          const bankElement: any = {};
          bankElement.label = obj.bankname;
          bankElement.value = obj.bankId;
          this.bankTypeObj.push(bankElement);
          if (data.associatedBanks.length === 1 && this.undertakingType === '') {
            this.formName.get('recipientBankAbbvName').setValue(obj.bankId);
            this.formName.get('recipientBankName').setValue(obj.name);
            if ((this.commonDataService.getMode() !== Constants.MODE_DRAFT) || (this.commonDataService.isFromBankTemplateOption)) {
            this.formName.get(`${this.undertakingType}issuingBankTypeCode`).setValue('01');
            this.changeIssuingInstructor();
            }
            this.commonService.setMainBankDetails(obj.bankname, obj.name);
            this.bankName.emit(this.commonDataService.getBankDetails(obj.bankId));
          }
          if (obj.bankname === this.bgRecord.recipientBank.abbvName && this.undertakingType === '') {
            this.commonService.setMainBankDetails(obj.bankname, obj.name);
            this.formName.get('recipientBankAbbvName').setValue(obj.bankId);
            this.bankName.emit(this.commonDataService.getBankDetails(obj.bankId));
          }
          this.staticDataService.getCustomerReference(obj.bankname, entityName).subscribe(referenceData => {
            if (referenceData.linkedReferences.length >= 1) {
              this.referenceObj.length = 0;
              referenceData.linkedReferences.forEach(refObj => {
              const referenceElement: any = {};
              refObj.description = this.commonService.decodeHtml(refObj.description);
              referenceElement.label = refObj.description;
              referenceElement.value = refObj.reference;
              this.referenceObj.push(referenceElement);
              // Customer Ref should not be shown in copy From IU screen
              if ((this.commonDataService.getTnxType() === '01' && this.commonDataService.getMode() === Constants.MODE_DRAFT) &&
                  (refObj.reference === this.bgRecord.recipientBank.reference && this.undertakingType === '')) {
                  this.formName.get('recipientBankCustomerReference').setValue(refObj.reference);
              }
              if (referenceData.linkedReferences.length === 1 && !this.toDisplayRecipientBank) {
                this.formName.get('recipientBankCustomerReference').setValue(refObj.reference);
              } else {
                this.toDisplayRecipientBank = true;
              }
            });
            }
          });
        });
        }
    });
   }
    if (this.bgRecord.advSendMode && this.bgRecord.advSendMode !== null && this.bgRecord.advSendMode !== '') {
    this.setValidatorsIfModeSwift(this.bgRecord.advSendMode === '01');
   }
   }

  ngAfterContentInit() {
    if (this.bgRecord[`${this.undertakingType}issuingBankTypeCode`] === '02' && !(this.commonData.disableTnx)) {
      this.formName.get(`${this.undertakingType}issuingBankSwiftCode`).enable();
      this.formName.get(`${this.undertakingType}issuingBankName`).enable();
      this.formName.get(`${this.undertakingType}issuingBankAddressLine1`).enable();
      this.formName.get(`${this.undertakingType}issuingBankAddressLine2`).enable();
      this.formName.get(`${this.undertakingType}issuingBankDom`).enable();
      this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).enable();
      this.showIssuingSwiftCode = true;
      this.formName.updateValueAndValidity();
    }
    if (this.bgRecord[`${this.undertakingType}leadBankFlag`] === 'Y') {
      this.bankNameLabel = this.commonService.getTranslation('BANK_DETAILS_LEAD_BANK_NAME');
      this.bankIdentifier = this.commonService.getTranslation('BANK_DETAILS_LEAD_BANK_IDENTIFIER');
      this.showProcessingBankTab = true;
      this.isProcessingBankMandatory = '*';
      this.formName.updateValueAndValidity();
  }
  this.commonService. getSwiftVersion();
  const swiftVersion = this.commonService.swiftVersion;
    if (this.bgRecord.purpose === Constants.CODE_02 || this.bgRecord.purpose === Constants.CODE_03 ||
        (this.swiftMode === true && swiftVersion >= Constants.SWIFT_VERSION2023)){
          this.isLocalAdviseThroughMandatory = true;
          this.isMandatory = '*';
          if (!(this.commonData.disableTnx)) {
            this.formName.get(`${this.undertakingType}localAdviseThroughSwiftCode`).enable();
            this.formName.get(`${this.undertakingType}localAdviseThroughName`).enable();
            this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine1`).enable();
            this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine2`).enable();
            this.formName.get(`${this.undertakingType}localAdviseThroughDom`).enable();
            this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`).enable();
          }
        }
    if (this.bgRecord.subProductCode === 'STBY' && (this.bgRecord.bgConfInstructions === '01' ||
        this.bgRecord.bgConfInstructions === '02')) {
      this.isConfirmingBankMandatory = true;
      this.isMandatory = '*';
      if (!(this.commonData.disableTnx)) {
        this.formName.get(`${this.undertakingType}confirmingSwiftCode`).enable();
        this.formName.get(`${this.undertakingType}confirmingBankName`).enable();
        this.formName.get(`${this.undertakingType}confirmingBankAddressLine1`).enable();
        this.formName.get(`${this.undertakingType}confirmingBankAddressLine2`).enable();
        this.formName.get(`${this.undertakingType}confirmingBankDom`).enable();
        this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).enable();
      }
      if (this.bgRecord.reqConfParty && this.bgRecord.reqConfParty != null && this.bgRecord.reqConfParty !== '') {
        this.enableConfirmPopUp = false;
        this.formName.get(`${this.undertakingType}confirmingSwiftCode`).disable();
        this.formName.get(`${this.undertakingType}confirmingBankName`).disable();
        this.formName.get(`${this.undertakingType}confirmingBankAddressLine1`).disable();
        this.formName.get(`${this.undertakingType}confirmingBankAddressLine2`).disable();
        this.formName.get(`${this.undertakingType}confirmingBankDom`).disable();
        this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).disable();
      }
      this.formName.updateValueAndValidity();
    }
    if (this.bgRecord.applicantReference !== '') {
        this.selectedIssuerReference = this.bgRecord.applicantReference;
    }
  }
  // Method to validate Advising Bank, when AdvisingThru bank is keyed in, check for Advising Bank details-
  // error dialog when advising bank is null
  checkAdvisingBank() {
    this.formName.controls[`${this.undertakingType}advisingBankName`].clearValidators();
    // If advising thru bank is not empty
    if (this.formName.get(`${this.undertakingType}adviseThruBankName`) &&
    this.formName.get(`${this.undertakingType}adviseThruBankName`).value !== '') {
      // setting advising bank mandatory and checking for empty and setting required validators
      this.isAdvisingBankMandatory = '*';
      if (this.formName.get(`${this.undertakingType}advisingBankName`) &&
      this.formName.get(`${this.undertakingType}advisingBankName`).value === '') {
        this.formName.controls[`${this.undertakingType}advisingBankName`].markAsTouched();
        this.formName.controls[`${this.undertakingType}advisingBankName`].setValidators([Validators.required]);
        // error popup
        let message = '';
        let dialogHeader = '';
        this.translate.get('SELECT_REQUIRED_VALUES_ADVISING_BANK').subscribe((value: string) => {
            message = value;
           });

        this.translate.get('DAILOG_ERROR').subscribe((res: string) => { dialogHeader = res; });

        this.confirmationService.confirm({
          message,
          header: dialogHeader,
          icon: 'pi pi-exclamation-triangle',
          key: 'advisingBankErrorDialog',
          rejectVisible: false,
          acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
          accept: () => {
          }
      });
     } else {
       // advising bank is not empty and maxlength and charset validators are set
      this.formName.controls[`${this.undertakingType}advisingBankName`].setValidators([Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]);
     }
    } else {
      // advising thru bank is empty and advising bank is not empty, removed mandatory check for advising bank and
      // maxlength and charset validators are set
      this.isAdvisingBankMandatory = '';
      this.formName.controls[`${this.undertakingType}advisingBankName`].setValidators([Validators.maxLength(Constants.LENGTH_35),
        validateSwiftCharSet(Constants.X_CHAR)]);
     }
    this.formName.controls[`${this.undertakingType}advisingBankName`].updateValueAndValidity();
  }
  onChecked() {
    if (this.formName.get(`${this.undertakingType}leadBankFlag`).value) {
      this.bankNameLabel = this.commonService.getTranslation('BANK_DETAILS_LEAD_BANK_NAME');
      this.bankIdentifier = this.commonService.getTranslation('BANK_DETAILS_LEAD_BANK_IDENTIFIER');
      this.showProcessingBankTab = true;
      this.isProcessingBankMandatory = '*';
      this.formName.get('processingSwiftCode').enable();
      this.formName.get('processingBankAddressLine1').enable();
      this.formName.get('processingBankAddressLine2').enable();
      this.formName.get('processingBankDom').enable();
      this.formName.get('processingBankAddressLine4').enable();
      this.formName.get('processingBankName').enable();

    } else {
      this.bankNameLabel = this.commonService.getTranslation('RECIPIENT_BANK_NAME');
      this.bankIdentifier = this.commonService.getTranslation('RECIPIENT_BANK_IDENTIFIER');
      this.showProcessingBankTab = false;
      this.isProcessingBankMandatory = '';
      this.formName.get('processingSwiftCode').setValue('');
      this.formName.get('processingSwiftCode').disable();
      this.formName.get('processingBankAddressLine1').setValue('');
      this.formName.get('processingBankAddressLine1').disable();
      this.formName.get('processingBankAddressLine2').setValue('');
      this.formName.get('processingBankAddressLine2').disable();
      this.formName.get('processingBankDom').setValue('');
      this.formName.get('processingBankDom').disable();
      this.formName.get('processingBankAddressLine4').setValue('');
      this.formName.get('processingBankAddressLine4').disable();
      this.formName.get('processingBankName').setValue('');
      this.formName.get('processingBankName').disable();
    }
  }

  setBanksDetails(bank: Bank) {
    if (bank) {
         this.formName.get(`${this.bankType}BankAddressLine1`).setValue(bank.ADDRESSLINE1);
         this.formName.get(`${this.bankType}BankAddressLine2`).setValue(bank.ADDRESSLINE2);
         this.formName.get(`${this.bankType}BankDom`).setValue(bank.DOMICILE);
         if (this.tabBankType === 'issuing') {
          this.formName.get(`${this.bankType}BankSwiftCode`).setValue(bank.BICCODE);
        } else {
          this.formName.get(`${this.bankType}SwiftCode`).setValue(bank.BICCODE);
        }

         if (this.tabUndertakingType !== 'cu') {
          this.formName.get(`${this.bankType}BankName`).setValue(bank.NAME);
        }
    }
  }

  onChangeIssuerReference() {
    const issuerref = this.formName.get(`${this.undertakingType}recipientBankCustomerReference`).value;
    if (issuerref != null && issuerref !== '' && issuerref !== undefined) {
      this.commonService.issuerRefPresent = true;
      this.commonService.issuerRef = issuerref;
      this.issuerReferenceChange.emit(issuerref);
    }
  }

  changeIssuingInstructor() {
    if (this.formName.get(`${this.undertakingType}issuingBankTypeCode`).value === '02') {
      this.formName.get(`${this.undertakingType}issuingBankSwiftCode`).enable();
      this.formName.get(`${this.undertakingType}issuingBankName`).enable();
      this.formName.get(`${this.undertakingType}issuingBankName`).setValidators([Validators.required,
        Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      this.formName.get(`${this.undertakingType}issuingBankAddressLine1`).enable();
      this.formName.get(`${this.undertakingType}issuingBankAddressLine1`).setValidators([Validators.required,
        Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      this.formName.get(`${this.undertakingType}issuingBankAddressLine2`).enable();
      this.formName.get(`${this.undertakingType}issuingBankDom`).enable();
      if (this.formName.get(`${this.undertakingType}issuingBankSwiftCode`).value === null) {
        this.formName.get(`${this.undertakingType}issuingBankSwiftCode`).setValue('');
      }
      if (this.formName.get(`${this.undertakingType}issuingBankName`).value === null) {
        this.formName.get(`${this.undertakingType}issuingBankName`).setValue('');
      }
      if (this.formName.get(`${this.undertakingType}issuingBankAddressLine1`).value === null) {
        this.formName.get(`${this.undertakingType}issuingBankAddressLine1`).setValue('');
      }
      if (this.formName.get(`${this.undertakingType}issuingBankAddressLine2`).value === null) {
        this.formName.get(`${this.undertakingType}issuingBankAddressLine2`).setValue('');
      }
      this.formName.get(`${this.undertakingType}issuingBankAddressLine2`).setValidators([Validators.maxLength(Constants.LENGTH_35),
        validateSwiftCharSet(Constants.X_CHAR)]);
      this.formName.get(`${this.undertakingType}issuingBankAddressLine2`).updateValueAndValidity();
      if (this.formName.get(`${this.undertakingType}issuingBankDom`).value === null) {
        this.formName.get(`${this.undertakingType}issuingBankDom`).setValue('');
      }
      this.formName.get(`${this.undertakingType}issuingBankDom`).setValidators([Validators.maxLength(Constants.LENGTH_35),
        validateSwiftCharSet(Constants.X_CHAR)]);
      this.formName.get(`${this.undertakingType}issuingBankDom`).updateValueAndValidity();
      if (this.formName.parent.get('generaldetailsSection').get('advSendMode') &&
          this.formName.parent.get('generaldetailsSection').get('advSendMode') !== null &&
          this.formName.parent.get('generaldetailsSection').get('advSendMode').value !== '01') {
        this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).clearValidators();
        if (this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).value === null) {
          this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).setValue('');
        }
        this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).disable();
      } else {
        this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).enable();
        this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).clearValidators();
        this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).setValidators([Validators.maxLength(Constants.LENGTH_35),
          validateSwiftCharSet(Constants.X_CHAR)]);
        this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).updateValueAndValidity();
      }
      this.showIssuingSwiftCode = true;
      this.formName.updateValueAndValidity();
    } else if (this.formName.get(`${this.undertakingType}issuingBankTypeCode`).value === '01') {
      this.bankDetails.associatedBanks.forEach(obj => {
        if (obj.bankId === this.formName.get('recipientBankAbbvName').value) {
          this.formName.get('issuingBankSwiftCode').setValue(obj.isoCode);
          this.formName.get('issuingBankName').setValue(obj.bankname);
          this.formName.get('issuingBankAddressLine1').setValue(obj.addressLine1);
          this.formName.get('issuingBankAddressLine2').setValue(obj.addressLine2);
          this.formName.get('issuingBankDom').setValue(obj.dom);
        }
      });
      this.formName.get(`${this.undertakingType}issuingBankName`).clearValidators();
      this.formName.get(`${this.undertakingType}issuingBankAddressLine1`).clearValidators();
      this.formName.get(`${this.undertakingType}issuingBankSwiftCode`).disable();
      this.formName.get(`${this.undertakingType}issuingBankName`).disable();
      this.formName.get(`${this.undertakingType}issuingBankAddressLine1`).disable();
      this.formName.get(`${this.undertakingType}issuingBankAddressLine2`).disable();
      this.formName.get(`${this.undertakingType}issuingBankDom`).disable();
      this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).disable();
      this.showIssuingSwiftCode = false;
      this.formName.updateValueAndValidity();
    }
  }

  updateValues() {
     let recBankName;
     this.referenceObj = [];
     this.bankAbbvName = this.formName.get('recipientBankAbbvName').value;
     this.bankTypeObj.forEach(element => {
      if (element.value === this.bankAbbvName) {
        recBankName = element.label;
      }
     });
     this.commonService.setMainBankDetails(recBankName, this.commonDataService.getBankName(recBankName));
     this.bankName.emit(recBankName);
     let entityName;
     if (this.formName.parent.get(Constants.SECTION_APPLICANT_DETAILS).get('entity') !== undefined
         && this.formName.parent.get(Constants.SECTION_APPLICANT_DETAILS).get('entity').value !== '') {
        entityName = this.formName.parent.get(Constants.SECTION_APPLICANT_DETAILS).get('entity').value;
     } else {
       entityName = '';
     }
     if (this.bankAbbvName != null && this.bankAbbvName !== '') {
     this.staticDataService.getCustomerReference(recBankName, entityName).subscribe(data => {
            if (data.linkedReferences.length >= 1) {
              data.linkedReferences.forEach(refObj => {
              const referenceElement: any = {};
              referenceElement.label = refObj.description;
              referenceElement.value = refObj.reference;
              this.referenceObj.push(referenceElement);
          });
        }
      });
     this.changeIssuingInstructor();
    }
  }

  public setGenericBankDetailsForm(genericBankDetails: UntypedFormGroup) {
    this.genericBankDetails = genericBankDetails;
  }
// Confirming Bank Mandatory Validation: when confirmation Instructions is 01(Confirm) and 02(May Add), Confirming Bank is Mandatory
checkConfirmingBankMandatory(confValue) {
  if (this.commonDataService.getSubProdCode() === 'STBY' && confValue !== '' && confValue !== '03' &&
  !(this.formName.controls[`advBankConfReq`].value || this.formName.controls[`adviseThruBankConfReq`].value ||
    this.formName.controls[`localAdviseThroughConfReq`].value)) {
    this.enableConfirmingBankDetails();
  } else {
    this.disableConfirmingBankDetails(confValue);
  }
}

enableConfirmingBankDetails() {
  this.isConfirmingBankMandatory = true;
  this.isMandatory = '*';
  this.enableConfirmPopUp = true;
  this.formName.controls[`${this.undertakingType}confirmingBankName`].clearValidators();
  this.formName.controls[`${this.undertakingType}confirmingBankName`].setValidators(Validators.required);
  this.formName.get(`${this.undertakingType}confirmingSwiftCode`).enable();
  this.formName.get(`${this.undertakingType}confirmingBankName`).enable();
  this.formName.get(`${this.undertakingType}confirmingBankName`).setValidators([Validators.maxLength(Constants.LENGTH_35),
  validateSwiftCharSet(Constants.X_CHAR)]);
  this.formName.get(`${this.undertakingType}confirmingBankName`).updateValueAndValidity();
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine1`).enable();
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine1`).setValidators([Validators.maxLength(Constants.LENGTH_35),
  validateSwiftCharSet(Constants.X_CHAR)]);
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine1`).updateValueAndValidity();
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine2`).enable();
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine2`).setValidators([Validators.maxLength(Constants.LENGTH_35),
  validateSwiftCharSet(Constants.X_CHAR)]);
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine2`).updateValueAndValidity();
  this.formName.get(`${this.undertakingType}confirmingBankDom`).enable();
  this.formName.get(`${this.undertakingType}confirmingBankDom`).setValidators([Validators.maxLength(Constants.LENGTH_35),
  validateSwiftCharSet(Constants.X_CHAR)]);
  this.formName.get(`${this.undertakingType}confirmingBankDom`).updateValueAndValidity();
  if (this.formName.parent.get('generaldetailsSection').get('advSendMode') &&
    this.formName.parent.get('generaldetailsSection').get('advSendMode') !== null &&
    this.formName.parent.get('generaldetailsSection').get('advSendMode').value === '01') {
    this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).clearValidators();
    if (this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).value === null) {
      this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).setValue('');
    }
    this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).disable();
  } else {
    this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).enable();
    this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).clearValidators();
    this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).setValidators([Validators.maxLength(Constants.LENGTH_35),
    validateSwiftCharSet(Constants.X_CHAR)]);
    this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).updateValueAndValidity();
  }
  this.formName.updateValueAndValidity();
}
disableConfirmingBankDetails(confValue) {
  if (this.commonDataService.getSubProdCode() === 'STBY' && confValue !== '' && confValue !== '03') {
    this.isConfirmingBankMandatory = true;
    this.isMandatory = '*';
    } else {
      this.isConfirmingBankMandatory = false;
      this.isMandatory = '';
    }
  this.enableConfirmPopUp = false;
  this.formName.controls[`${this.undertakingType}confirmingBankName`].clearValidators();
  this.formName.controls[`${this.undertakingType}confirmingBankName`].setErrors(null);
  this.formName.get(`${this.undertakingType}advBankConfReq`).setValue(false);
  this.formName.get(`${this.undertakingType}adviseThruBankConfReq`).setValue(false);
  this.formName.get(`${this.undertakingType}confirmingSwiftCode`).setValue('');
  this.formName.get(`${this.undertakingType}confirmingSwiftCode`).disable();
  this.formName.get(`${this.undertakingType}confirmingBankName`).setValue('');
  this.formName.get(`${this.undertakingType}confirmingBankName`).disable();
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine1`).setValue('');
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine1`).disable();
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine2`).setValue('');
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine2`).disable();
  this.formName.get(`${this.undertakingType}confirmingBankDom`).setValue('');
  this.formName.get(`${this.undertakingType}confirmingBankDom`).disable();
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).setValue('');
  this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).disable();
  this.formName.updateValueAndValidity();
}

  openBankDialog(tabBankType: string, tabUndertakingType: string) {
    this.tabBankType = tabBankType;
    this.tabUndertakingType = tabUndertakingType;
    this.bankType = tabUndertakingType + tabBankType;
    this.translate.get('TABLE_SUMMARY_BANKS_LIST').subscribe((res: string) => {
      this.modalBankDialogTitle = res;
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
        if ((tabBankType === 'advising' && this.formName.controls[`advBankConfReq`].value) ||
         (tabBankType === 'adviseThru' && this.formName.controls[`adviseThruBankConfReq`].value)) {
          this.populateConfirmBankDetails(tabBankType);
        }
      }
    });
  }
  generatePdf(generatePdfService) {
     if (this.undertakingType !== 'cu' && this.commonDataService.getPreviewOption() !== 'SUMMARY') {
      if (this.commonData.getProductCode() === 'BG') {
        generatePdfService.setSectionDetails('BANK_DETAILS_LABEL', true, false, 'recipientDetails');
      }
      if (this.commonData.getProductCode() === 'BR') {
        generatePdfService.setSectionHeader('BANK_DETAILS_LABEL', true);
        generatePdfService.setSectionDetails('BANKDETAILS_TAB_ADVISING_BANK', true, true, 'advisingBankDetail');
      }
      generatePdfService.setSectionDetails('BANKDETAILS_ISSUING_BANK_DETAILS', true, true, 'issuingBankDetails');
      if (this.adviseBankRequired && this.commonData.getProductCode() === 'BG') {
        generatePdfService.setSectionDetails('BANKDETAILS_TAB_ADVISING_BANK', true, true, 'advisingBankDetails');
      }
      generatePdfService.setSectionDetails('BANKDETAILS_TAB_ADVISE_THRU_BANK', true, true, 'advisingThruBankDetails');
      if (this.commonDataService.getSubProdCode() === Constants.STAND_BY &&
      (this.bgRecord.bgConfInstructions === Constants.CODE_01 ||
      this.bgRecord.bgConfInstructions === Constants.CODE_02)) {
      generatePdfService.setSectionDetails('BANKDETAILS_TAB_CONFIRMING_BANK', true, true, 'confirmingBankDetails');
      }
      if (this.bgRecord.getPurpose === Constants.CODE_02 || this.bgRecord.getPurpose === Constants.CODE_03
        || (this.swiftMode === true && this.commonService.getSwiftVersion() === Constants.SWIFT_VERSION2023)) {
          generatePdfService.setSectionDetails('BANKDETAILS_TAB_LOCAL_ADVISE_THROUGH_BANK', true, true, 'localAdviseThroughDetails');
        }
      generatePdfService.setSectionDetails('BANKDETAILS_TAB_PROCESSING_BANK', true, true, 'processingBankDetails');
      generatePdfService.setSectionDetails('COUNTER_BANK_DETAILS_LABEL', true, false, 'luRecipientBankDetails');
     }
  }

  checkIfBankAvailable(bankType): boolean {
    if (bankType && bankType !== null && this.bgRecord[bankType].name) {
      return (Object.values(this.bgRecord[bankType]).some(bankField => bankField !== ''));
    } else {
      return false;
    }
  }
  changeActiveIndex(indexNo) {
    this.index = indexNo;
  }
  handleChange(e) {
    this.index = e.index;
  }
  setValidatorsIfModeSwift(swiftModeSelected) {
    this.swiftMode = swiftModeSelected;
    if (!swiftModeSelected) {
      this.setValidatorsIfNotSwift();
    } else {
      this.setValidatorsIfSwift();
    }
  }

  setValidatorsIfNotSwift() {
    if (this.formName.get(`${this.undertakingType}issuingBankAddressLine4`) &&
      this.formName.get(`${this.undertakingType}issuingBankAddressLine4`) !== null &&
      this.formName.get(`${this.undertakingType}issuingBankTypeCode`) &&
      this.formName.get(`${this.undertakingType}issuingBankTypeCode`) !== null &&
      this.formName.get(`${this.undertakingType}issuingBankTypeCode`).value !== '01') {
      this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).enable();
      this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).clearValidators();
      this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).setValidators([Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).updateValueAndValidity();
    }
    if (this.formName.get(`${this.undertakingType}advisingBankAddressLine4`) &&
      this.formName.get(`${this.undertakingType}advisingBankAddressLine4`) !== null) {
      this.formName.get(`${this.undertakingType}advisingBankAddressLine4`).enable();
      this.formName.get(`${this.undertakingType}advisingBankAddressLine4`).clearValidators();
      this.formName.get(`${this.undertakingType}advisingBankAddressLine4`).setValidators([Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.formName.get(`${this.undertakingType}advisingBankAddressLine4`).updateValueAndValidity();
    }
    if (this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`) &&
      this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`) !== null) {
      this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`).enable();
      this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`).clearValidators();
      this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`).setValidators([Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`).updateValueAndValidity();
    }
    if (this.formName.get(`${this.undertakingType}adviseThruBankAddressLine4`) &&
      this.formName.get(`${this.undertakingType}adviseThruBankAddressLine4`) !== null) {
      this.formName.get(`${this.undertakingType}adviseThruBankAddressLine4`).enable();
      this.formName.get(`${this.undertakingType}adviseThruBankAddressLine4`).clearValidators();
      this.formName.get(`${this.undertakingType}adviseThruBankAddressLine4`).setValidators([Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.formName.get(`${this.undertakingType}adviseThruBankAddressLine4`).updateValueAndValidity();
    }
    if (this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`) &&
      this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`) !== null) {
      this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).enable();
      this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).clearValidators();
      this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).setValidators([Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).updateValueAndValidity();
    }
  }
  setValidatorsIfSwift() {
    if (this.formName.get(`${this.undertakingType}issuingBankAddressLine4`) &&
      this.formName.get(`${this.undertakingType}issuingBankAddressLine4`) !== null) {
      this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).clearValidators();
      this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).setValue('');
      this.formName.get(`${this.undertakingType}issuingBankAddressLine4`).disable();
    }
    if (this.formName.get(`${this.undertakingType}advisingBankAddressLine4`) &&
      this.formName.get(`${this.undertakingType}advisingBankAddressLine4`) !== null) {
      this.formName.get(`${this.undertakingType}advisingBankAddressLine4`).clearValidators();
      this.formName.get(`${this.undertakingType}advisingBankAddressLine4`).setValue('');
      this.formName.get(`${this.undertakingType}advisingBankAddressLine4`).disable();
    }
    if (this.formName.get(`${this.undertakingType}adviseThruBankAddressLine4`) &&
      this.formName.get(`${this.undertakingType}adviseThruBankAddressLine4`) !== null) {
      this.formName.get(`${this.undertakingType}adviseThruBankAddressLine4`).clearValidators();
      this.formName.get(`${this.undertakingType}adviseThruBankAddressLine4`).setValue('');
      this.formName.get(`${this.undertakingType}adviseThruBankAddressLine4`).disable();
    }
    if (this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`) &&
      this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`) !== null) {
      this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`).clearValidators();
      this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`).setValue('');
      this.formName.get(`${this.undertakingType}localAdviseThroughAddressLine4`).disable();
    }
    if (this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`) &&
      this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`) !== null) {
      this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).clearValidators();
      this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).setValue('');
      this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).disable();
    }
  }

  toggleAdvConfreq(bankType: string, value) {
    if (!value && ((bankType === Constants.ADVISE_THRU_BANK_TYPE && !this.formName.controls[`advBankConfReq`].value) ||
     (bankType === Constants.ADVISING_BANK_TYPE && !this.formName.controls[`adviseThruBankConfReq`].value) ||
      (bankType === Constants.LOCAL_ADVISE_THROUGH_BANK_TYPE && !this.formName.controls[`localAdviseThroughConfReq`].value))) {
      this.enableConfirmPopUp = true;
      this.formName.controls[`${this.undertakingType}confirmingBankName`].setValue('');
      this.formName.controls[`${this.undertakingType}confirmingBankName`].enable();

      this.formName.get(`${this.undertakingType}confirmingSwiftCode`).setValue('');
      this.formName.controls[`${this.undertakingType}confirmingSwiftCode`].enable();

      this.formName.get(`${this.undertakingType}confirmingBankAddressLine1`).setValue('');
      this.formName.controls[`${this.undertakingType}confirmingBankAddressLine1`].enable();

      this.formName.get(`${this.undertakingType}confirmingBankAddressLine2`).setValue('');
      this.formName.controls[`${this.undertakingType}confirmingBankAddressLine2`].enable();

      this.formName.get(`${this.undertakingType}confirmingBankDom`).setValue('');
      this.formName.controls[`${this.undertakingType}confirmingBankDom`].enable();

      if (this.formName.parent.get('generaldetailsSection').get('advSendMode') &&
        this.formName.parent.get('generaldetailsSection').get('advSendMode') !== null &&
        this.formName.parent.get('generaldetailsSection').get('advSendMode').value !== '01') {
        this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).setValue('');
        this.formName.controls[`${this.undertakingType}confirmingBankAddressLine4`].enable();
      }
    } else if (value && ((bankType === Constants.ADVISE_THRU_BANK_TYPE && this.formName.controls[`advBankConfReq`].value) ||
    (bankType === Constants.ADVISING_BANK_TYPE && this.formName.controls[`adviseThruBankConfReq`].value) ||
    (bankType === Constants.LOCAL_ADVISE_THROUGH_BANK_TYPE && !this.formName.controls[`localAdviseThroughConfReq`].value)) ) {
      let message = '';
      let dialogHeader = '';
      this.translate.get('DAILOG_CONFIRMATION').subscribe((data) => {
        dialogHeader = data;
      });
      const confirmMsg1 = 'ADVISE_THRU_BANK_CONF_WARNING';
      const confirmMsg2 = 'ADVISING_BANK_CONF_WARNING';
      const confirmMsg3 = 'LOCAL_ADVISE_THROUGH_CONF_WARNING';
      if (bankType === Constants.ADVISE_THRU_BANK_TYPE) {
        this.translate.get(confirmMsg1).subscribe((data) => {
          message = data;
        });
      }
      else if (bankType === Constants.ADVISING_BANK_TYPE) {
        this.translate.get(confirmMsg2).subscribe((data) => {
          message = data;
        });
      }
      else {
        this.translate.get(confirmMsg3).subscribe((data) => {
          message = data;
        });
    }
      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: 'pi pi-exclamation-triangle',
        key: 'confimationReqWarningDialog',
        accept: () => {
          if (bankType === Constants.ADVISE_THRU_BANK_TYPE) {
          this.formName.controls[`adviseThruBankConfReq`].setValue(false);
           }
          else if (bankType === Constants.ADVISING_BANK_TYPE) {
          this.formName.controls[`advBankConfReq`].setValue(false);
            }
          else {
          this.formName.controls[`localAdviseThroughConfReq`].setValue(false);
          }
          this.populateConfirmBankDetails(bankType);
        },
        reject: () => {
          if (bankType === Constants.ADVISE_THRU_BANK_TYPE) {
            this.formName.controls[`adviseThruBankConfReq`].setValue(false);
             }
            else if (bankType === Constants.ADVISING_BANK_TYPE) {
            this.formName.controls[`advBankConfReq`].setValue(false);
              }
            else {
            this.formName.controls[`localAdviseThroughConfReq`].setValue(false);
            }
        }
           });
    } else {
      this.populateConfirmBankDetails(bankType);
    }
  }
  populateConfirmBankDetails(bankType) {
    if ((bankType === Constants.ADVISING_BANK_TYPE && this.formName.controls[`advBankConfReq`].value) ||
    (bankType === Constants.ADVISE_THRU_BANK_TYPE && this.formName.controls[`adviseThruBankConfReq`].value) ||
    (bankType === Constants.LOCAL_ADVISE_THROUGH_BANK_TYPE && !this.formName.controls[`localAdviseThroughConfReq`].value)) {
      this.enableConfirmPopUp = false;
      this.formName.controls[`${this.undertakingType}confirmingBankName`].setValue(
        this.formName.controls[`${this.undertakingType}${bankType}BankName`].value
      );
      this.formName.controls[`${this.undertakingType}confirmingBankName`].disable();

      this.formName.get(`${this.undertakingType}confirmingSwiftCode`).setValue(
        this.formName.controls[`${this.undertakingType}${bankType}SwiftCode`].value
      );
      this.formName.controls[`${this.undertakingType}confirmingSwiftCode`].disable();

      this.formName.get(`${this.undertakingType}confirmingBankAddressLine1`).setValue(
        this.formName.controls[`${this.undertakingType}${bankType}BankAddressLine1`].value
      );
      this.formName.controls[`${this.undertakingType}confirmingBankAddressLine1`].disable();

      this.formName.get(`${this.undertakingType}confirmingBankAddressLine2`).setValue(
        this.formName.controls[`${this.undertakingType}${bankType}BankAddressLine2`].value
      );
      this.formName.controls[`${this.undertakingType}confirmingBankAddressLine2`].disable();

      this.formName.get(`${this.undertakingType}confirmingBankDom`).setValue(
        this.formName.controls[`${this.undertakingType}${bankType}BankDom`].value
      );
      this.formName.controls[`${this.undertakingType}confirmingBankDom`].disable();

      if (this.formName.parent.get('generaldetailsSection').get('advSendMode') &&
        this.formName.parent.get('generaldetailsSection').get('advSendMode') !== null &&
        this.formName.parent.get('generaldetailsSection').get('advSendMode').value !== '01') {
        this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).setValue(
          this.formName.controls[`${this.undertakingType}${bankType}BankAddressLine4`].value
        );
        this.formName.controls[`${this.undertakingType}confirmingBankAddressLine4`].disable();
      }
    }
  }

onProductStatusChange() {
  if (!(this.formName.controls[`advBankConfReq`].value || this.formName.controls[`adviseThruBankConfReq`].value)) {
    this.enableConfirmingBankDetails();
  } else {
    this.isConfirmingBankMandatory = true;
    this.isMandatory = '*';
    this.enableConfirmPopUp = false;
    this.formName.controls[`${this.undertakingType}confirmingBankName`].clearValidators();
    this.formName.controls[`${this.undertakingType}confirmingBankName`].setErrors(null);
    this.formName.get(`${this.undertakingType}confirmingSwiftCode`).disable();
    this.formName.get(`${this.undertakingType}confirmingBankName`).disable();
    this.formName.get(`${this.undertakingType}confirmingBankAddressLine1`).disable();
    this.formName.get(`${this.undertakingType}confirmingBankAddressLine2`).disable();
    this.formName.get(`${this.undertakingType}confirmingBankDom`).disable();
    this.formName.get(`${this.undertakingType}confirmingBankAddressLine4`).disable();
    this.formName.updateValueAndValidity();
  }
}

}
