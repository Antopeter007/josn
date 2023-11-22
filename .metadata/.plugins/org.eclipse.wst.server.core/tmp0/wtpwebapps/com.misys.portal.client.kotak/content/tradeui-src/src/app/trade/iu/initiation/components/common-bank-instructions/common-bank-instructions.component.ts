import { TranslateService } from '@ngx-translate/core';
import { PhraseDialogComponent } from './../../../../../common/components/phrase-dialog/phrase-dialog.component';
import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ConfirmationService, DialogService } from 'primeng';
import { AccountDialogComponent } from '../../../../../common/components/account-dialog/account-dialog.component';
import { Constants } from '../../../../../common/constants';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { DropdownOptions } from '../../../common/model/DropdownOptions.model';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { CommonService } from '../../../../../common/services/common.service';

interface Account {
  ACCOUNTNO: string;
}


@Component({
  selector: 'fcc-iu-common-bank-instructions',
  templateUrl: './common-bank-instructions.component.html',
  styleUrls: ['./common-bank-instructions.component.scss'],
  providers: [DialogService]
})
export class CommonBankInstructionsComponent implements OnInit, AfterContentInit {

  @Input() undertakingType;
  @Input() formName: UntypedFormGroup;
  @Input() public bgRecord;
  unsignedMode: boolean;
  viewMode = false;
  isBankUser = false;
  modalDialogTitle: string;
  deliveryToDataMap = new Map();
  deliveryModeDropdown: DropdownOptions[] = [];
  deliveryToDropdown: DropdownOptions[] = [];
  deliveryModeDataMap = new Map();
  deliveryToOtherApplicableCode: any[] = [];
  swiftVersion: number;
  isSwiftVersion2023Enable = false;
  charLength: number;
  charValidation: string;

  constructor(public validationService: ValidationService, public iuCommonDataService: IUCommonDataService,
              public dialogService: DialogService, public staticDataService: StaticDataService,
              public commonDataService: CommonDataService, public commonService: CommonService,
              public translate: TranslateService, public confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.deliveryToOtherApplicableCode = Constants.DELIVERY_TO_OTHER_APPLICABLE_CODE;
    this.isBankUser = this.commonDataService.getIsBankUser();
    this.commonService. getSwiftVersion();
    this.swiftVersion = this.commonService.swiftVersion;
    if(this.swiftVersion >= Constants.SWIFT_VERSION2023){
     this.isSwiftVersion2023Enable = true;
    }
    if (!(this.bgRecord[`${this.undertakingType}DelvOrgUndertaking`] && this.bgRecord[`${this.undertakingType}DelvOrgUndertaking`] !== null
      && this.bgRecord[`${this.undertakingType}DelvOrgUndertaking`] !== '')) {
      this.formName.get(`${this.undertakingType}DelvOrgUndertaking`).setValue(null);
    }
    if (!(this.bgRecord[`${this.undertakingType}DeliveryTo`] && this.bgRecord[`${this.undertakingType}DeliveryTo`] !== null
      && this.bgRecord[`${this.undertakingType}DeliveryTo`] !== '')) {
      this.formName.get(`${this.undertakingType}DeliveryTo`).setValue(null);
    }
    this.fetchLargeParamDataValues(Constants.DELIVERY_MODE_PARM_ID);
    this.fetchLargeParamDataValues(Constants.DELIVERY_TO_PARM_ID);

    this.translate.get('TABLE_PHRASES_LIST').subscribe((res: string) => {
      this.modalDialogTitle =  res;
    });

    if (this.iuCommonDataService.getMode() === 'UNSIGNED') {
      this.unsignedMode = true;
    } else {
      this.unsignedMode = false;
    }

    if (this.commonDataService.getDisplayMode() === Constants.MODE_VIEW && this.isBankUser) {
      this.viewMode = true;
    } else {
      this.viewMode = false;
    }

  }

  ngAfterContentInit() {
    if (!(this.commonDataService.disableTnx) && this.undertakingType === Constants.UNDERTAKING_TYPE_IU &&
        (this.bgRecord.bgDelvOrgUndertaking === '99' || this.bgRecord.bgDelvOrgUndertaking === '02')) {
      this.formName.get('bgDelvOrgUndertakingText').enable();
      if (this.bgRecord.bgDelvOrgUndertaking === '99') {
        this.formName.get('bgDelvOrgUndertakingText').setValidators([Validators.required]);
      }
    }
    if (!(this.commonDataService.disableTnx) && this.bgRecord[`${this.undertakingType}DeliveryTo`] &&
    this.deliveryToOtherApplicableCode.indexOf(this.bgRecord[`${this.undertakingType}DeliveryTo`]) > -1) {
      this.formName.get(`${this.undertakingType}DeliveryToOther`).enable();
    }
    this.formName.updateValueAndValidity();
  }

  enableOrDisableFields(inputField: string, enabledField: string, expectedValue: string) {
    if (this.formName.get(this.undertakingType + inputField).value === expectedValue) {
      this.formName.get(this.undertakingType + enabledField).markAsUntouched({ onlySelf: true });
      this.formName.get(this.undertakingType + enabledField).markAsPristine({ onlySelf: true });
      this.formName.get(this.undertakingType + enabledField).updateValueAndValidity();
      this.formName.get(this.undertakingType + enabledField).enable();
      this.formName.get(this.undertakingType + enabledField).setValidators(
        [Validators.maxLength(Constants.LENGTH_140), validateSwiftCharSet(Constants.X_CHAR)]);
  } else {
    this.formName.get(this.undertakingType + enabledField).setValue('');
    this.formName.get(this.undertakingType + enabledField).disable();
  }
 }

 enableOrDisableDeliverToOtherField(inputField: string, enabledField: string, expectedValue: any[]) {
  if (expectedValue.indexOf(this.formName.get(this.undertakingType + inputField).value) > -1) {
    this.charLength = this.swiftVersion >= Constants.SWIFT_VERSION2023 ? Constants.LENGTH_780 : Constants.LENGTH_210;
    this.charValidation = this.swiftVersion >= Constants.SWIFT_VERSION2023 ? Constants.Z_CHAR : Constants.X_CHAR;
    this.formName.get(this.undertakingType + enabledField).markAsUntouched({ onlySelf: true });
    this.formName.get(this.undertakingType + enabledField).markAsPristine({ onlySelf: true });
    this.formName.get(this.undertakingType + enabledField).updateValueAndValidity();
    this.formName.get(this.undertakingType + enabledField).enable();
    this.formName.get(this.undertakingType + enabledField).setValidators(
      [Validators.maxLength(this.charLength), validateSwiftCharSet(this.charValidation)]);
} else {
  this.formName.get(this.undertakingType + enabledField).setValue('');
  this.formName.get(this.undertakingType + enabledField).disable();
}
}

 changeOriginalUndertakingDel() {
   this.formName.get('bgDelvOrgUndertakingText').setValue('');
   if (this.formName.get('bgDelvOrgUndertaking') != null &&
     (this.formName.get('bgDelvOrgUndertaking').value === '99' || this.formName.get('bgDelvOrgUndertaking').value === '02')) {
     this.formName.get('bgDelvOrgUndertakingText').clearValidators();
     this.formName.get('bgDelvOrgUndertakingText').markAsUntouched({ onlySelf: true });
     this.formName.get('bgDelvOrgUndertakingText').markAsPristine({ onlySelf: true });
     this.formName.get('bgDelvOrgUndertakingText').updateValueAndValidity();
     this.formName.get('bgDelvOrgUndertakingText').enable();
     if (this.formName.get('bgDelvOrgUndertaking').value === '99') {
       this.formName.get('bgDelvOrgUndertakingText').setValidators(
         [Validators.required, Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
     } else {
       this.formName.get('bgDelvOrgUndertakingText').setValidators(
         [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
     }
   } else {
     this.formName.get('bgDelvOrgUndertakingText').disable();
   }
 }

changeDeliveryTo() {
  this.enableOrDisableDeliverToOtherField('DeliveryTo', 'DeliveryToOther', this.deliveryToOtherApplicableCode);
}

clearPrincipalAcc(event) {
  this.formName.get(`${this.undertakingType}PrincipalActNo`).setValue('');
}

clearFeeAcc(event) {
  this.formName.get(`${this.undertakingType}FeeActNo`).setValue('');
 }

 public openAccountDialog(fieldId): void {
  if (this.commonDataService.getEntity() === null || this.commonDataService.getEntity() === '') {
    this.commonDataService.setEntity('*');
  }
  const ref = this.dialogService.open(AccountDialogComponent, {
      header: 'List of Accounts',
      width: '65vw',
      height: '65vh',
      contentStyle: {overflow: 'auto', height: '65vh'}
    });
  ref.onClose.subscribe((account: Account) => {
      if (account) {
        this.formName.get(fieldId).setValue(account.ACCOUNTNO);
      }
  });
}

  generatePdf(generatePdfService) {
    if ((this.undertakingType === '' || this.undertakingType === null || this.undertakingType === 'bg')
                    && (this.iuCommonDataService.getPreviewOption() !== 'SUMMARY')) {
        if (!this.commonDataService.getIsBankUser()) {
          generatePdfService.setSectionDetails('HEADER_INSTRUCTIONS', true, false, 'bankInstructions');
        } else if (this.commonDataService.getIsBankUser()) {
          generatePdfService.setSectionDetails('HEADER_INSTRUCTIONS_FROM_CUST', true, false, 'bankInstructions');
        }

    }
  }

  hasFeeAccountValue(): boolean {
    if (this.formName.get(`${this.undertakingType}FeeActNo`) &&
        this.formName.get(`${this.undertakingType}FeeActNo`).value !== null &&
        this.formName.get(`${this.undertakingType}FeeActNo`).value !== '') {
      return true;
    } else {
      return false;
    }
  }

  hasPrincipalAccountValue(): boolean {
    if (this.formName.get(`${this.undertakingType}PrincipalActNo`) &&
        this.formName.get(`${this.undertakingType}PrincipalActNo`).value !== null &&
        this.formName.get(`${this.undertakingType}PrincipalActNo`).value !== '') {
      return true;
    } else {
      return false;
    }
  }

  openPhraseDialog(formControlName: string) {
    let applicantEntityName = '';
    if (this.commonService.getNumberOfEntities() === Constants.NUMERIC_ZERO) {
      applicantEntityName = this.bgRecord.applicantName;
    } else if (this.commonService.getNumberOfEntities() === Constants.NUMERIC_ONE) {
      applicantEntityName = this.bgRecord.entity;
    } else {
      applicantEntityName = this.commonDataService.getEntity();
    }

    if (!(this.commonDataService.getIsBankUser()) && (applicantEntityName == null || applicantEntityName === '')) {
      let message = '';
      let dialogHeader = '';
      this.translate.get('WARNING_TITLE').subscribe((value: string) => {
        dialogHeader = value;
      });
      this.translate.get('ENTITY_MANDATORY_ERROR').subscribe((value: string) => {
        message = value;
      });
      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: 'pi pi-exclamation-triangle',
        key: 'entityWarningPhraseInst',
        rejectVisible: false,
        acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
        accept: () => {
        }
      });
    } else {
      const ref = this.dialogService.open(PhraseDialogComponent, {
        data: {
          product: Constants.PRODUCT_CODE_IU,
          categoryName: formControlName,
          applicantEntityName
        },
        header: this.modalDialogTitle,
        width: '65vw',
        height: '80vh',
        contentStyle: { overflow: 'auto', height: '80vh' }
      });
      ref.onClose.subscribe((text: string) => {
        if (text) {
          if (text.includes('\\n')) {
            text = text.split('\\n').join('');
          }
          let finalText = '';
          if (this.formName.get(formControlName).value != null &&
          this.formName.get(formControlName).value !== '') {
          finalText = this.formName.get(formControlName).value.concat('\n');
          } else {
          finalText = this.formName.get(formControlName).value;
          }
          finalText = finalText.concat(text);
          this.formName.get(formControlName).setValue(finalText);
        }
      });
    }
  }
  fetchLargeParamDataValues(parmId: string) {
      this.staticDataService.fetchLargeParamData(parmId).subscribe(data => {
        if (data && data != null && data.largeParamBankDatas && data.largeParamBankDatas.length !== 0) {
          const largeParamBanks = data.largeParamBankDatas;
          if (parmId === Constants.DELIVERY_MODE_PARM_ID) {
            largeParamBanks.forEach(element => {
              this.deliveryModeDataMap.set(element.bank, element.values);
            });
          } else if (parmId === Constants.DELIVERY_TO_PARM_ID) {
            largeParamBanks.forEach(element => {
              this.deliveryToDataMap.set(element.bank, element.values);
            });
          }
          const bankSection = this.formName.parent.get(`bankDetailsSection`);

          const recepientBank = (bankSection && bankSection.get(`recipientBankName`) &&
                                bankSection.get(`recipientBankName`).value != null &&
                                bankSection.get(`recipientBankName`).value !== '') ?
                                this.iuCommonDataService.getBankDetails(bankSection.get(`recipientBankAbbvName`).value) : '';

          let bankName = this.isBankUser ? this.commonService.getCompanyName() : recepientBank;

          if (bankName !== '' || (this.commonService.isFieldsValuesExists([this.bgRecord[`recipientBank`][`abbvName`]]))) {
            if (bankName === '') {
              bankName = this.bgRecord[`recipientBank`][`abbvName`];
            }
            this.getLargeParamDataOptions(bankName, true, parmId);
          }
        }
      });
  }

  getLargeParamDataOptions(bankName, persistFieldValue: boolean, parmId: string) {
    if (bankName != null && bankName !== '') {
      if (this.formName.get(`bgDelvOrgUndertaking`) && parmId === Constants.DELIVERY_MODE_PARM_ID && this.deliveryModeDataMap.size > 0) {
        if (this.deliveryModeDataMap.get(bankName)) {
        this.deliveryModeDropdown.length = 0;
        const largeParamData = this.deliveryModeDataMap.get(bankName);
        largeParamData.forEach(element => {
          const largeParamEle: any = {};
          largeParamEle.label = element.label;
          largeParamEle.value = element.value;
          this.deliveryModeDropdown.push(largeParamEle);
          if (this.bgRecord[`bgDelvOrgUndertaking`] === element.value && persistFieldValue) {
            this.formName.get(`bgDelvOrgUndertaking`).setValue(element.value);
          }
        });
        } else {
        this.deliveryModeDropdown = [];
        this.formName.get(`bgDelvOrgUndertaking`).setValue('');
        }
      } else if (this.formName.get(`bgDeliveryTo`) && parmId === Constants.DELIVERY_TO_PARM_ID && this.deliveryToDataMap.size > 0) {
        if (this.deliveryToDataMap.get(bankName)) {
          this.deliveryToDropdown.length = 0;
          const largeParamData = this.deliveryToDataMap.get(bankName);
          largeParamData.forEach(element => {
            const largeParamEle: any = {};
            largeParamEle.label = element.label;
            largeParamEle.value = element.value;
            this.deliveryToDropdown.push(largeParamEle);
            if (this.bgRecord[`bgDeliveryTo`] === element.value && persistFieldValue) {
              this.formName.get(`bgDeliveryTo`).setValue(element.value);
            }
        });
        } else {
        this.deliveryToDropdown = [];
        this.formName.get(`bgDeliveryTo`).setValue('');
        }
      }
      }
    }
  }
