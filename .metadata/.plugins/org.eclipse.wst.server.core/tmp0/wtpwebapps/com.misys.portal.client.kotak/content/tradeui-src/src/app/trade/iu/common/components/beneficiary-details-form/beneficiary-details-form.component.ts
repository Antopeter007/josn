import { PartyDetailsComponent } from '../../../../common/components/party-details/party-details.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from '../../../../../common/constants';
import { CommonService } from '../../../../../common/services/common.service';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';

import { IUCommonDataService } from '../../service/iuCommonData.service';
import { LicenseService } from '../../../../../common/services/license.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { DialogService, ConfirmationService } from 'primeng';

interface Type {
  name: string;
  value: string;
}
@Component({
  selector: 'fcc-iu-common-beneficiary-details',
  templateUrl: './beneficiary-details-form.component.html',
  styleUrls: ['./beneficiary-details-form.component.scss']
})
export class IUCommonBeneficiaryDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  beneficiaryDetailsFormSection: UntypedFormGroup;
  viewMode: boolean;
  mode: string;
  isBankUser: boolean;
  @Output() updateBankDetails = new EventEmitter<any>();

  @ViewChild(PartyDetailsComponent) genericApplicantDetails: PartyDetailsComponent;
  @ViewChildren(PartyDetailsComponent) genericBeneficiaryDetails: QueryList<PartyDetailsComponent>;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public iuCommonDataService: IUCommonDataService, public translate: TranslateService,
              public commonService: CommonService, public dialogService: DialogService,
              public license: LicenseService, public confirmationService: ConfirmationService,
              public commonData: CommonDataService) {
  }

  ngOnInit() {
    this.isBankUser = this.commonData.getIsBankUser();
    if (this.iuCommonDataService.getDisplayMode() === Constants.MODE_VIEW
      || this.iuCommonDataService.getDisplayMode() === Constants.VIEW_AMEND
      || this.iuCommonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
      this.viewMode = true;
    } else {
      this.viewMode = false;
    }
    this.mode = this.iuCommonDataService.getMode();
    if (this.iuCommonDataService.getMode() === Constants.MODE_AMEND || (this.iuCommonDataService.getMode() === Constants.MODE_DRAFT &&
      this.iuCommonDataService.getTnxType() === '03') || this.iuCommonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
      this.mode = Constants.INITIATE_AMEND;
    }
    const maxLength35 = Constants.LENGTH_35;
    this.beneficiaryDetailsFormSection = this.fb.group({
      beiCode: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR),
      Validators.pattern(Constants.REGEX_BIC_CODE)]],
      beneficiaryName: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      beneficiaryAddressLine1: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      beneficiaryAddressLine2: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      beneficiaryDom: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      beneficiaryAddressLine4: [''],
      beneficiaryCountry: ['', Validators.pattern(Constants.REGEX_CURRENCY)],

      beneficiaryContact: [''],
      contactName: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      contactAddressLine1: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      contactAddressLine2: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      contactDom: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      contactAddressLine4: [''],
      contactCountry: ['', [Validators.maxLength(Constants.LENGTH_2), validateSwiftCharSet(Constants.X_CHAR)]],
      customerIdentifier: [{ value: '', disabled: false }],
      customerIdentifierOther: [{ value: '', disabled: true }],
      customerContactDetails: ['']

    });
    this.setValidationsOnBeneFields(this.iuCommonDataService.getBeneMandatoryVal());

    if ((this.iuCommonDataService.getMode() === Constants.MODE_DRAFT || this.iuCommonDataService.getMode() === Constants.MODE_AMEND
      || (this.iuCommonDataService.getTnxType() === '01' &&
        (this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING
        || this.iuCommonDataService.getOption() === Constants.OPTION_REJECTED))) || this.isBankUser) {
      this.initFieldValues();
    }
    if (this.bgRecord.advSendMode && this.bgRecord.advSendMode !== null && this.bgRecord.advSendMode !== '') {
      this.setValidatorsIfModeSwift(this.bgRecord.advSendMode === '01');
    }
    this.formReady.emit(this.beneficiaryDetailsFormSection);
  }

  initFieldValues() {
    this.beneficiaryDetailsFormSection.patchValue({
      beiCode: this.bgRecord.beiCode,
      beneficiaryName: this.bgRecord.beneficiaryName,
      beneficiaryAddressLine1: this.bgRecord.beneficiaryAddressLine1,
      beneficiaryAddressLine2: this.bgRecord.beneficiaryAddressLine2,
      beneficiaryDom: this.bgRecord.beneficiaryDom,
      beneficiaryAddressLine4: this.bgRecord.beneficiaryAddressLine4,
      beneficiaryCountry: this.bgRecord.beneficiaryCountry,

      beneficiaryContact: this.iuCommonDataService.getCheckboxBooleanValues(this.bgRecord.beneficiaryContact),
      contactName: this.bgRecord.contactName,
      contactAddressLine1: this.bgRecord.contactAddressLine1,
      contactAddressLine2: this.bgRecord.contactAddressLine2,
      contactDom: this.bgRecord.contactDom,
      contactAddressLine4: this.bgRecord.contactAddressLine4,
      contactCountry: this.bgRecord.contactCountry,
    });

    if (this.mode === Constants.INITIATE_AMEND) {
      this.beneficiaryDetailsFormSection.controls.customerContactDetails.setValidators([Validators.maxLength(Constants.LENGTH_780),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.beneficiaryDetailsFormSection.controls.customerContactDetails.updateValueAndValidity();
      if (this.bgRecord.customerIdentifier !== '') {
        this.beneficiaryDetailsFormSection.get('customerIdentifier').setValue(this.bgRecord.customerIdentifier);
        if (this.bgRecord.customerIdentifier === 'OTHR') {
          this.beneficiaryDetailsFormSection.get('customerIdentifierOther').enable();
        }
      }
      this.beneficiaryDetailsFormSection.patchValue({
        customerIdentifierOther: this.bgRecord.customerIdentifierOther,
        customerContactDetails: this.bgRecord.customerContactDetails
      });
    }
  }

  onChangeCustomerIdentifier(value) {
    if (value === 'OTHR') {
      this.beneficiaryDetailsFormSection.controls.customerIdentifierOther.setValidators([Validators.required,
      Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]);
      this.beneficiaryDetailsFormSection.controls.customerIdentifierOther.updateValueAndValidity();
      this.beneficiaryDetailsFormSection.get('customerIdentifierOther').enable();
      this.beneficiaryDetailsFormSection.get('customerIdentifierOther').setValue('');
    } else {
      this.beneficiaryDetailsFormSection.get('customerIdentifierOther').setValue(this.bgRecord.customerIdentifierOther);
      this.beneficiaryDetailsFormSection.get('customerIdentifierOther').disable();
      this.beneficiaryDetailsFormSection.updateValueAndValidity();
    }
  }

  setValidationsOnBeneFields(isMandatory: boolean) {
    const maxLength35 = Constants.LENGTH_35;
    if (isMandatory) {
      this.beneficiaryDetailsFormSection.controls.beneficiaryName.setValidators([Validators.required, Validators.maxLength(maxLength35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.beneficiaryDetailsFormSection.controls.beneficiaryAddressLine1.setValidators(
        [Validators.required, Validators.maxLength(maxLength35),
        validateSwiftCharSet(Constants.X_CHAR)]);
      this.beneficiaryDetailsFormSection.controls.beneficiaryCountry.setValidators([Validators.required,
      Validators.pattern(Constants.REGEX_CURRENCY)]);
      this.beneficiaryDetailsFormSection.controls.beiCode.setValidators([Validators.maxLength(maxLength35),
      validateSwiftCharSet(Constants.X_CHAR), Validators.pattern(Constants.REGEX_BIC_CODE)]);
      this.beneficiaryDetailsFormSection.updateValueAndValidity();
    } else {
      this.beneficiaryDetailsFormSection.controls.beneficiaryName.setValidators([Validators.maxLength(maxLength35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.beneficiaryDetailsFormSection.controls.beneficiaryAddressLine1.setValidators([Validators.maxLength(maxLength35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.beneficiaryDetailsFormSection.controls.beneficiaryCountry.setValidators([Validators.pattern(Constants.REGEX_CURRENCY)]);
      this.beneficiaryDetailsFormSection.controls.beiCode.setValidators([Validators.maxLength(maxLength35),
      validateSwiftCharSet(Constants.X_CHAR),
      Validators.pattern(Constants.REGEX_BIC_CODE)]);
      this.beneficiaryDetailsFormSection.updateValueAndValidity();

    }
  }

  generatePdf(generatePdfService) {
    if (this.genericApplicantDetails) {
      this.genericApplicantDetails.generatePdf(generatePdfService, 'beneficiary');
      this.genericApplicantDetails.generatePdf(generatePdfService, 'contact');
    }
  }
  setValidatorsIfModeSwift(swiftModeSelected) {
    if (!swiftModeSelected) {
      this.beneficiaryDetailsFormSection.get('beneficiaryAddressLine4').enable();
      this.beneficiaryDetailsFormSection.get('beneficiaryAddressLine4').clearValidators();
      this.beneficiaryDetailsFormSection.get('beneficiaryAddressLine4').setValidators([Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.beneficiaryDetailsFormSection.get('beneficiaryAddressLine4').updateValueAndValidity();
      this.beneficiaryDetailsFormSection.get('contactAddressLine4').enable();
      this.beneficiaryDetailsFormSection.get('contactAddressLine4').clearValidators();
      this.beneficiaryDetailsFormSection.get('contactAddressLine4').setValidators([Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.beneficiaryDetailsFormSection.get('contactAddressLine4').updateValueAndValidity();
    } else {
      this.beneficiaryDetailsFormSection.get('beneficiaryAddressLine4').clearValidators();
      this.beneficiaryDetailsFormSection.get('beneficiaryAddressLine4').setValue('');
      this.beneficiaryDetailsFormSection.get('beneficiaryAddressLine4').disable();
      this.beneficiaryDetailsFormSection.get('contactAddressLine4').clearValidators();
      this.beneficiaryDetailsFormSection.get('contactAddressLine4').setValue('');
      this.beneficiaryDetailsFormSection.get('contactAddressLine4').disable();
    }
    if (this.genericBeneficiaryDetails && this.genericBeneficiaryDetails !== null) {
      this.genericBeneficiaryDetails.forEach((child) => { child.setValidatorsIfModeSwift(swiftModeSelected); });
    }
  }
}
