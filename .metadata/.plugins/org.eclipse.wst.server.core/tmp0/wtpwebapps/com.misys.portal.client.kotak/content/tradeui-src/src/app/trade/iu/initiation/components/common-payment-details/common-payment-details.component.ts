import { Constants } from './../../../../../common/constants';
import { CommonService } from './../../../../../common/services/common.service';
import { IUCommonDataService } from '../../../../../trade/iu/common/service/iuCommonData.service';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { DialogService } from 'primeng';

@Component({
  selector: 'fcc-iu-common-payment-details',
  templateUrl: './common-payment-details.component.html',
  styleUrls: ['./common-payment-details.component.scss']
})
export class CommonPaymentDetailsComponent implements OnInit {

  @Input() undertakingType;
  @Input() sectionForm: UntypedFormGroup;
  @Input() bgRecord;
  viewMode: boolean;
  selected: string;
  cuSelected: string;
  isBankUser = false;

  constructor(public validationService: ValidationService, public commonDataService: IUCommonDataService,
              public commonService: CommonService, public translate: TranslateService,
              public staticDataService: StaticDataService, public dialogService: DialogService,
              public commonData: CommonDataService, public fb: UntypedFormBuilder) { }

  public crediAvailwithBankDropDown: any[];

  ngOnInit() {
    this.isBankUser = this.commonData.getIsBankUser();
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_CU &&
       !(this.bgRecord[`cuCreditAvailableWithBank`] && this.bgRecord[`cuCreditAvailableWithBank`] !== null
       && this.bgRecord[`cuCreditAvailableWithBank`] !== '')) {
       this.sectionForm.get(`cuCreditAvailableWithBank`).setValue(null);
    }
    if (this.commonDataService.getDisplayMode() === 'view' ||
        this.commonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
      this.viewMode = true;
    } else {
      this.viewMode = false;
    }
    this.crediAvailwithBankDropDown = [
      { label: this.commonService.getTranslation('BANKDETAILS_TAB_ADVISING_BANK'), value: '02' },
      { label: this.commonService.getTranslation('BANKDETAILS_ISSUING_BANK_DETAILS'), value: '01' },
      { label: this.commonService.getTranslation('PAYMENT DETAILS SECTION ANY BANK'), value:  '03' },
      { label: this.commonService.getTranslation('BANKDETAILS_TAB_ADVISE_THRU_BANK'), value:  '08' },
      { label: this.commonService.getTranslation('PAYMENT_DETAILS_SECTION_OTHER'), value:  '99' }
    ];
    this.sectionForm.addControl(`${this.undertakingType}AnyBankName`, new UntypedFormControl(''));
    this.sectionForm.addControl(`${this.undertakingType}AnyBankAddressLine1`, new UntypedFormControl(''));
    this.sectionForm.addControl(`${this.undertakingType}AnyBankAddressLine2`, new UntypedFormControl(''));
    this.sectionForm.addControl(`${this.undertakingType}AnyBankDom`, new UntypedFormControl(''));
    this.sectionForm.addControl(`${this.undertakingType}AnyBankAddressLine4`, new UntypedFormControl(''));

    if (this.bgRecord.bgCrAvlByCode === '') {
      this.selected = Constants.CRED_ON_DEMAND_VALUE;
    } else {
      this.selected = this.bgRecord.bgCrAvlByCode;
    }
    if ((this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING
    && this.undertakingType === 'bg') ||
    (this.commonDataService.getTnxType() !== '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING ) ||
    this.commonDataService.getOption() === Constants.OPTION_TEMPLATE ||
    this.commonDataService.getMode() === Constants.MODE_DRAFT || this.commonDataService.getMode() === Constants.MODE_AMEND
    || (this.commonDataService.getOption() === Constants.OPTION_REJECTED && this.commonDataService.getTnxType() === '01'
    && this.undertakingType === 'bg')) {
      this.initFieldValues();
    }
    if ((this.bgRecord.cuCrAvlByCode) &&
    !(this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING)) {
      this.commonDataService.setCreditAvailBy(this.bgRecord.cuCrAvlByCode, Constants.UNDERTAKING_TYPE_CU);
    }

  }

  initFieldValues() {
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
      this.sectionForm.patchValue({
        bgCreditAvailableWithBank: this.bgRecord.bgCreditAvailableWithBank.type,
        bgCrAvlByCode: this.bgRecord.bgCrAvlByCode,
        bgAnyBankName: this.bgRecord.bgCreditAvailableWithBank.name,
        bgAnyBankAddressLine1: this.bgRecord.bgCreditAvailableWithBank.addressLine1,
        bgAnyBankAddressLine2: this.bgRecord.bgCreditAvailableWithBank.addressLine2,
        bgAnyBankDom: this.bgRecord.bgCreditAvailableWithBank.dom,
        bgAnyBankAddressLine4: this.bgRecord.bgCreditAvailableWithBank.addressLine4,
        cuCreditAvailableWithBank: this.bgRecord.cuCreditAvailableWithBank.type,
        cuCrAvlByCode: this.bgRecord.cuCrAvlByCode,
        cuAnyBankName: this.bgRecord.cuCreditAvailableWithBank.name,
        cuAnyBankAddressLine1: this.bgRecord.cuCreditAvailableWithBank.addressLine1,
        cuAnyBankAddressLine2: this.bgRecord.cuCreditAvailableWithBank.addressLine2,
        cuAnyBankDom: this.bgRecord.cuCreditAvailableWithBank.dom,
        cuAnyBankAddressLine4: this.bgRecord.cuCreditAvailableWithBank.addressLine4,
      });
    } else {
      this.sectionForm.patchValue({
        bgCreditAvailableWithBank: this.bgRecord.bgCreditAvailableWithBank.type,
        bgCrAvlByCode: this.bgRecord.bgCrAvlByCode,
        bgAnyBankName: this.bgRecord.bgCreditAvailableWithBank.name,
        bgAnyBankAddressLine1: this.bgRecord.bgCreditAvailableWithBank.addressLine1,
        bgAnyBankAddressLine2: this.bgRecord.bgCreditAvailableWithBank.addressLine2,
        bgAnyBankDom: this.bgRecord.bgCreditAvailableWithBank.dom,
        bgAnyBankAddressLine4: this.bgRecord.bgCreditAvailableWithBank.addressLine4
      });
    }

    if ((this.bgRecord.cuCrAvlByCode && this.bgRecord.cuCrAvlByCode !== '') &&
    !(this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING)) {
      this.cuSelected = this.bgRecord.cuCrAvlByCode;
    }
  }
  changeCreditAvailableWithBank() {
    if (this.sectionForm.get(`${this.undertakingType}CreditAvailableWithBank`).value ===  '99' ) {
      this.sectionForm.get(`${this.undertakingType}AnyBankName`).enable();
      this.sectionForm.get(`${this.undertakingType}AnyBankName`).setValue('');
      this.sectionForm.get(`${this.undertakingType}AnyBankAddressLine1`).enable();
      this.sectionForm.get(`${this.undertakingType}AnyBankAddressLine2`).enable();
      this.sectionForm.get(`${this.undertakingType}AnyBankDom`).enable();
      this.sectionForm.get(`${this.undertakingType}AnyBankAddressLine4`).enable();
    } else {
      this.sectionForm.get(`${this.undertakingType}AnyBankName`).setValue('');
      this.sectionForm.get(`${this.undertakingType}AnyBankName`).disable();
      this.sectionForm.get(`${this.undertakingType}AnyBankAddressLine1`).setValue('');
      this.sectionForm.get(`${this.undertakingType}AnyBankAddressLine1`).disable();
      this.sectionForm.get(`${this.undertakingType}AnyBankAddressLine2`).setValue('');
      this.sectionForm.get(`${this.undertakingType}AnyBankAddressLine2`).disable();
      this.sectionForm.get(`${this.undertakingType}AnyBankDom`).setValue('');
      this.sectionForm.get(`${this.undertakingType}AnyBankDom`).disable();
      this.sectionForm.get(`${this.undertakingType}AnyBankAddressLine4`).setValue('');
      this.sectionForm.get(`${this.undertakingType}AnyBankAddressLine4`).disable();
    }
  }

  setValueFromField(creditAvai, undertakingType) {
    const creditValue = this.commonDataService.getCuCreditAvailBy();
    if (creditValue && creditValue !== null && creditValue !== '' && (creditValue === this.sectionForm.get(creditAvai).value)) {
      this.sectionForm.get(creditAvai).reset();
      this.commonDataService.setCreditAvailBy('', undertakingType);
    } else {
      this.commonDataService.setCreditAvailBy(this.sectionForm.get(creditAvai).value, undertakingType);
    }
  }
  generatePdf(generatePdfService) {
    if (this.undertakingType === 'bg') {
      if (this.commonDataService.getPreviewOption() !== 'SUMMARY') {
        generatePdfService.setSectionDetails('HEADER_UNDERTAKING_PAYMENT_DETAILS', true, false, 'bgPaymentDetailsSection');
      }
    } else if (this.undertakingType === 'cu') {
      generatePdfService.setSectionDetails('HEADER_COUNTER_PAYMENT_DETAILS', true, false, 'cuPaymentDetailsSection');
    }
  }

  getCreditAvailBy(name) {
    const creditAvailByList = new Map();
    creditAvailByList.set(Constants.ISSUING_BANK, Constants.NUMERIC_STRING_ONE);
    creditAvailByList.set(Constants.ADVISING_BANK, Constants.NUMERIC_STRING_TWO);
    creditAvailByList.set(Constants.ANY_BANK, Constants.NUMERIC_STRING_THREE);
    creditAvailByList.set(Constants.ADVISE_THRU_BANK, Constants.NUMERIC_STRING_EIGHT);
    creditAvailByList.set(Constants.OTHER, Constants.NUMERIC_STRING_NINTY_NINE);
    if (name !== '' && name !== null && name !== Constants.ADVISING_BANK && name !== Constants.ISSUING_BANK
    && name !== Constants.ANY_BANK && name !== Constants.ADVISE_THRU_BANK) {
      name = Constants.OTHER;
    }
    return creditAvailByList.get(name);
  }
}
