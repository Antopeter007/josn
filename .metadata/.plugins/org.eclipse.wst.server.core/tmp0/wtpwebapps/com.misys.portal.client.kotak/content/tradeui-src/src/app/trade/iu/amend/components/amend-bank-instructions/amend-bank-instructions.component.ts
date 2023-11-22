import { TranslateService } from '@ngx-translate/core';
import { PhraseDialogComponent } from './../../../../../common/components/phrase-dialog/phrase-dialog.component';
import { Constants } from '../../../../../common/constants';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ValidationService } from '../../../../../common/validators/validation.service';

import { DialogService } from 'primeng';
import { DropdownOptions } from '../../../common/model/DropdownOptions.model';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { AccountDialogComponent } from '../../../../../common/components/account-dialog/account-dialog.component';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { CommonService } from '../../../../../common/services/common.service';

interface Account {
  ACCOUNTNO: string;
}


@Component({
  selector: 'fcc-iu-amend-bank-instructions',
  templateUrl: './amend-bank-instructions.component.html',
  styleUrls: ['./amend-bank-instructions.component.scss']
})
export class AmendBankInstructionsComponent implements OnInit {

  @Input() undertakingType;
  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  viewMode = false;
  unsignedMode = false;
  amendBankInstructionsSection: UntypedFormGroup;
  modalDialogTitle: string;

  constructor(
    protected fb: UntypedFormBuilder, public translate: TranslateService,
    public validationService: ValidationService,
    public iuCommonDataService: IUCommonDataService,
    public dialogService: DialogService,
    protected staticDataService: StaticDataService,
    public commonDataService: CommonDataService, public commonService: CommonService
  ) { }

  public transmissionMethodObj: DropdownOptions[];
  public sendAttachmentsObj: DropdownOptions[] = [];
  bankLargeParamDataMap = new Map();
  deliveryModeDropdown: DropdownOptions[] = [];
  deliveryToDropdown: DropdownOptions[] = [];
  deliveryToOtherApplicableCode: any[] = [];

  ngOnInit() {
    this.deliveryToOtherApplicableCode = Constants.DELIVERY_TO_OTHER_APPLICABLE_CODE;
    this.translate.get('TABLE_PHRASES_LIST').subscribe((res: string) => {
      this.modalDialogTitle =  res;
    });

    if (this.iuCommonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
      this.unsignedMode = true;
    }

    // for dropdown values which are fetched from service call
    this.fetchLargeParamDataValues(Constants.DELIVERY_MODE_PARM_ID);
    this.fetchLargeParamDataValues(Constants.DELIVERY_TO_PARM_ID);
    const delvOrgUndertakingTextLength = 35;
    const accountNumberLength = 34;
    const freeFormatTextLength = 210;
    const deliveryToOtherLength = 210;
    this.amendBankInstructionsSection = this.fb.group({
      bgDelvOrgUndertaking: [{ value: '', disabled: false }],
      bgDelvOrgUndertakingText: ['', [Validators.maxLength(delvOrgUndertakingTextLength),
      validateSwiftCharSet(Constants.X_CHAR)]],
      bgPrincipalActNo: ['', [Validators.maxLength(accountNumberLength), validateSwiftCharSet(Constants.X_CHAR)]],
      bgFeeActNo: ['', [Validators.maxLength(accountNumberLength), validateSwiftCharSet(Constants.X_CHAR)]],
      bgDeliveryTo: [{ value: '', disabled: false }],
      bgDeliveryToOther: [{ value: '', disabled: true }, [Validators.maxLength(deliveryToOtherLength),
      validateSwiftCharSet(Constants.X_CHAR)]],
      bgFreeFormatText: ['', [Validators.maxLength(freeFormatTextLength), validateSwiftCharSet(Constants.X_CHAR)]]
    });
    this.initFieldValues();
    if (!(this.bgRecord[`bgDelvOrgUndertaking`] && this.bgRecord[`bgDelvOrgUndertaking`] !== null
        && this.bgRecord[`bgDelvOrgUndertaking`] !== '')) {
      this.amendBankInstructionsSection.get(`bgDelvOrgUndertaking`).setValue(null);
    }
    if (!(this.bgRecord[`bgDeliveryTo`] && this.bgRecord[`bgDeliveryTo`] !== null
        && this.bgRecord[`bgDeliveryTo`] !== '')) {
      this.amendBankInstructionsSection.get(`bgDeliveryTo`).setValue(null);
    }
    // Emit the form group to the parent
    this.formReady.emit(this.amendBankInstructionsSection);
  }

  initFieldValues() {
    this.commonDataService.setEntity(this.bgRecord.entity);
    this.transmissionMethodObj = this.iuCommonDataService.getTransmissionMethod('') as DropdownOptions[];
    this.amendBankInstructionsSection.patchValue({
      bgPrincipalActNo: this.bgRecord.bgPrincipalActNo,
      bgFeeActNo: this.bgRecord.bgFeeActNo,
      bgDeliveryToOther: this.bgRecord.bgDeliveryToOther,
      bgFreeFormatText: this.bgRecord.bgFreeFormatText,
      bgDelvOrgUndertakingText: this.bgRecord.bgDelvOrgUndertakingText,
    });
    if (this.unsignedMode || this.iuCommonDataService.getMode() === Constants.MODE_DRAFT) {
      this.amendBankInstructionsSection.patchValue({
        bgDelvOrgUndertakingText: this.bgRecord.bgDelvOrgUndertakingText
      });
      if (this.bgRecord.bgDelvOrgUndertaking === '99' || this.bgRecord.bgDelvOrgUndertaking === '02') {
        this.amendBankInstructionsSection.controls.bgDelvOrgUndertakingText.enable();
        if (this.bgRecord.bgDelvOrgUndertaking === '99') {
          this.amendBankInstructionsSection.get('bgDelvOrgUndertakingText').setValidators([Validators.required]);
        }
      }
    }
    if (this.bgRecord.bgDeliveryTo !== '' && this.bgRecord.bgDeliveryTo !== null) {
      this.amendBankInstructionsSection.get('bgDeliveryTo').setValue(this.bgRecord.bgDeliveryTo);
    }
    if (this.bgRecord.bgDeliveryTo && this.deliveryToOtherApplicableCode.indexOf(this.bgRecord.bgDeliveryTo) > -1) {
      this.amendBankInstructionsSection.controls.bgDeliveryToOther.enable();
    }
  }

  changeOriginalUndertakingDel(event) {
    if (event.value === '99' || event.value === '02') {
      this.amendBankInstructionsSection.get('bgDelvOrgUndertakingText').setValue('');
      this.enableFields('bgDelvOrgUndertakingText');
      this.amendBankInstructionsSection.get('bgDelvOrgUndertakingText').clearValidators();
      if (this.amendBankInstructionsSection.get('bgDelvOrgUndertaking').value === '99') {
        this.amendBankInstructionsSection.get('bgDelvOrgUndertakingText').setValidators(
          [Validators.required, Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      } else {
        this.amendBankInstructionsSection.get('bgDelvOrgUndertakingText').setValidators(
          [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      }
    } else {
      this.disableFieldsAndResetValue('bgDelvOrgUndertakingText');
    }
  }

  changeDeliveryTo(value) {
    if (value && this.deliveryToOtherApplicableCode.indexOf(value) > -1) {
      this.enableFields('bgDeliveryToOther');
    } else {
      this.disableFieldsAndResetValue('bgDeliveryToOther');
    }
  }

  clearPrincipalAcc(event) {
    this.amendBankInstructionsSection.get('bgPrincipalActNo').setValue('');
  }

  clearFeeAcc(event) {
    this.amendBankInstructionsSection.get('bgFeeActNo').setValue('');
  }

  public openAccountDialog(fieldId): void {
    const ref = this.dialogService.open(AccountDialogComponent, {
      header: 'List of Accounts',
      width: '1000px',
      height: '400px',
      contentStyle: { overflow: 'auto' }
    });
    ref.onClose.subscribe((account: Account) => {
      if (account) {
        this.amendBankInstructionsSection.get(fieldId).setValue(account.ACCOUNTNO);
      }
    });
  }

  private enableFields(fieldId: string) {
    this.amendBankInstructionsSection.get(fieldId).markAsUntouched({ onlySelf: true });
    this.amendBankInstructionsSection.get(fieldId).markAsPristine({ onlySelf: true });
    this.amendBankInstructionsSection.get(fieldId).updateValueAndValidity();
    this.amendBankInstructionsSection.get(fieldId).enable();
  }

  private disableFieldsAndResetValue(fieldId: string) {
    this.amendBankInstructionsSection.get(fieldId).setValue('');
    this.amendBankInstructionsSection.get(fieldId).disable();
  }

  hasFeeAccountValue(): boolean {
    if (this.amendBankInstructionsSection.get(`bgFeeActNo`) &&
        this.amendBankInstructionsSection.get(`bgFeeActNo`).value !== null &&
        this.amendBankInstructionsSection.get(`bgFeeActNo`).value !== '') {
      return true;
    } else {
      return false;
    }
  }

  hasPrincipalAccountValue(): boolean {
    if (this.amendBankInstructionsSection.get(`bgPrincipalActNo`) &&
        this.amendBankInstructionsSection.get(`bgPrincipalActNo`).value !== null &&
        this.amendBankInstructionsSection.get(`bgPrincipalActNo`).value !== '') {
      return true;
    } else {
      return false;
    }
  }

  openPhraseDialog(formControlName: string) {
    const applicantEntityName = this.bgRecord.entity != null ? this.bgRecord.entity : this.bgRecord.applicantName;
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
        if (this.amendBankInstructionsSection.get(formControlName).value != null &&
            this.amendBankInstructionsSection.get(formControlName).value !== '') {
            finalText = this.amendBankInstructionsSection.get(formControlName).value.concat('\n');
        } else {
          finalText = this.amendBankInstructionsSection.get(formControlName).value;
        }
        finalText = finalText.concat(text);
        this.amendBankInstructionsSection.get(formControlName).setValue(finalText);
      }
    });
  }

  fetchLargeParamDataValues(parmId: string) {
    this.staticDataService.fetchLargeParamData(parmId).subscribe(data => {
      if (data && data != null && data.largeParamBankDatas && data.largeParamBankDatas && data.largeParamBankDatas.length !== 0) {
        const largeParamBanks = data.largeParamBankDatas;
        largeParamBanks.forEach(element => {
          this.bankLargeParamDataMap.set(element.bank, element.values);
        });
        const bankSection = this.amendBankInstructionsSection.parent.get(`amendBankDetailsSection`);
        const recepientBank = (bankSection) ? this.bgRecord.recipientBank.abbvName : '';

        let bankName = this.commonDataService.isBankUser ? this.commonService.getCompanyName() : recepientBank;

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
    if (bankName != null && bankName !== '' && this.bankLargeParamDataMap.size > 0) {
      if (this.amendBankInstructionsSection.get(`bgDelvOrgUndertaking`) && parmId === Constants.DELIVERY_MODE_PARM_ID) {
        this.deliveryModeDropdown.length = 0;
        const largeParamData = this.bankLargeParamDataMap.get(bankName);
        largeParamData.forEach(element => {
          const largeParamEle: any = {};
          largeParamEle.label = element.label;
          largeParamEle.value = element.value;
          this.deliveryModeDropdown.push(largeParamEle);
          if (this.bgRecord[`bgDelvOrgUndertaking`] === element.value && persistFieldValue) {
            this.amendBankInstructionsSection.get(`bgDelvOrgUndertaking`).setValue(element.value);
          }
      });
      } else if (this.amendBankInstructionsSection.get(`bgDeliveryTo`) && parmId === Constants.DELIVERY_TO_PARM_ID) {
        this.deliveryToDropdown.length = 0;
        const largeParamData = this.bankLargeParamDataMap.get(bankName);
        largeParamData.forEach(element => {
          const largeParamEle: any = {};
          largeParamEle.label = element.label;
          largeParamEle.value = element.value;
          this.deliveryToDropdown.push(largeParamEle);
          if (this.bgRecord[`bgDeliveryTo`] === element.value && persistFieldValue) {
            this.amendBankInstructionsSection.get(`bgDeliveryTo`).setValue(element.value);
          }
      });
      }
    }
  }
}

