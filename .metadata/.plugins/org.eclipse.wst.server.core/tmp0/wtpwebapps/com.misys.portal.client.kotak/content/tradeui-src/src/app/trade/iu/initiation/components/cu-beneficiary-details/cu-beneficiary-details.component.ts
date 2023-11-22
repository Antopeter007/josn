import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../common/validators/validation.service';

import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { Constants } from '../../../../../common/constants';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { PartyDetailsComponent } from '../../../../common/components/party-details/party-details.component';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { CommonService } from '../../../../../common/services/common.service';



@Component({
  selector: 'fcc-iu-cu-beneficiary-details',
  templateUrl: './cu-beneficiary-details.component.html',
  styleUrls: ['./cu-beneficiary-details.component.scss']
})
export class CuBeneficiaryDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  cuBeneficaryDetailsSection: UntypedFormGroup;
  entity: string;
  viewMode: boolean;
  collapsible: boolean;
  @ViewChild(PartyDetailsComponent)genericApplicantDetails: PartyDetailsComponent;
  @ViewChildren(PartyDetailsComponent) genericBeneficiaryDetails: QueryList<PartyDetailsComponent>;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService, public commonData: CommonDataService,
              public commonDataService: IUCommonDataService, public commonService: CommonService) { }

  ngOnInit() {
    this.cuBeneficaryDetailsSection = this.fb.group({

      cuBeiCode: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR),
                  Validators.pattern(Constants.REGEX_BIC_CODE)]],

      cuBeneficiaryName: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      cuBeneficiaryAddressLine1: ['', [Validators.maxLength(Constants.LENGTH_35),
                                      validateSwiftCharSet(Constants.X_CHAR)]],
      cuBeneficiaryAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      cuBeneficiaryDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      cuBeneficiaryAddressLine4: [''],
      cuBeneficiaryCountry: ['', [Validators.pattern(Constants.REGEX_CURRENCY)]],
      cuBeneficiaryReference:  ['', [Validators.maxLength(Constants.LENGTH_16), validateSwiftCharSet(Constants.X_CHAR)]],

      cuBeneficiaryContact: [''],
      cuContactName: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      cuContactAddressLine1: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      cuContactAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      cuContactDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      cuContactAddressLine4: [''],
    });


    if (this.commonData.getIsBankUser() || (this.commonDataService.getMode() === Constants.MODE_DRAFT)) {
      this.initFieldValues();
    }
    if (this.commonDataService.getAdvSendMode() !== null) {
        this.setValidatorsIfModeSwift(this.commonDataService.getAdvSendMode());
    }
    if (this.bgRecord.advSendMode && this.bgRecord.advSendMode !== null && this.bgRecord.advSendMode !== '') {
        this.setValidatorsIfModeSwift(this.bgRecord.advSendMode === '01');
    }
    // Emit the form group to the parent
    this.formReady.emit(this.cuBeneficaryDetailsSection);

    if (this.commonDataService.getDisplayMode() === 'view') {
        this.viewMode = true;
      } else {
        this.viewMode = false;
      }

    if (this.checkForDataIfPresent() || this.commonData.getIsBankUser()) {
        this.collapsible = true;
    } else {
        this.collapsible = false;
    }
    if ((this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING) ||
    (this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_REJECTED)) {
      this.collapsible = false;
    }
    if (this.commonData.getIsBankUser()) {
      this.cuBeneficaryDetailsSection.controls[`cuBeneficiaryName`].setValidators([Validators.required]);
      this.cuBeneficaryDetailsSection.controls[`cuBeneficiaryName`].updateValueAndValidity();
      this.cuBeneficaryDetailsSection.controls[`cuBeneficiaryAddressLine1`].setValidators([Validators.required]);
      this.cuBeneficaryDetailsSection.controls[`cuBeneficiaryAddressLine1`].updateValueAndValidity();
      this.cuBeneficaryDetailsSection.controls[`cuBeneficiaryCountry`].setValidators([Validators.required]);
      this.cuBeneficaryDetailsSection.controls[`cuBeneficiaryCountry`].updateValueAndValidity();
    }
  }

  checkForDataIfPresent() {
    const arr = [this.bgRecord.cuBeneficiary.beiCode, this.bgRecord.cuBeneficiary.name,  this.bgRecord.cuBeneficiary.addressLine1 ,
      this.bgRecord.cuBeneficiary.addressLine2, this.bgRecord.cuBeneficiary.dom, this.bgRecord.cuBeneficiary.addressLine4 ,
      this.bgRecord.cuBeneficiary.country, this.bgRecord.cuBeneficiary.reference, this.bgRecord.cuContact.name,
       this.bgRecord.cuContact.addressLine1 , this.bgRecord.cuContact.addressLine2,  this.bgRecord.cuContact.dom ,
       this.bgRecord.cuContact.addressLine4];

    return this.commonService.isFieldsValuesExists(arr);
    }

  initFieldValues() {
    if (this.bgRecord.cuBeneficiary) {
      this.cuBeneficaryDetailsSection.patchValue({
        cuBeiCode: this.bgRecord.cuBeneficiary.beiCode,
        cuBeneficiaryName: this.bgRecord.cuBeneficiary.name,
        cuBeneficiaryAddressLine1: this.bgRecord.cuBeneficiary.addressLine1,
        cuBeneficiaryAddressLine2: this.bgRecord.cuBeneficiary.addressLine2,
        cuBeneficiaryDom: this.bgRecord.cuBeneficiary.dom,
        cuBeneficiaryAddressLine4: this.bgRecord.cuBeneficiary.addressLine4,
        cuBeneficiaryCountry: this.bgRecord.cuBeneficiary.country,
        cuBeneficiaryReference: this.bgRecord.cuBeneficiary.reference
      });
    }
    if (this.bgRecord.cuContact) {
      this.cuBeneficaryDetailsSection.patchValue({
        cuBeneficiaryContact: this.commonDataService.getCheckboxBooleanValues(this.bgRecord.cuBeneficiaryContact),
        cuContactName: this.bgRecord.cuContact.name,
        cuContactAddressLine1: this.bgRecord.cuContact.addressLine1,
        cuContactAddressLine2: this.bgRecord.cuContact.addressLine2,
        cuContactDom: this.bgRecord.cuContact.dom,
        cuContactAddressLine4: this.bgRecord.cuContact.addressLine4,
      });
    }
  }
  generatePdf(generatePdfService) {
    if (this.genericApplicantDetails) {
      this.genericApplicantDetails.generatePdf(generatePdfService, 'cuBeneficiary');
      this.genericApplicantDetails.generatePdf(generatePdfService, 'cuContact');
    }
  }
  setValidatorsIfModeSwift(swiftModeSelected) {
    if (!swiftModeSelected) {
      this.cuBeneficaryDetailsSection.get('cuBeneficiaryAddressLine4').enable();
      this.cuBeneficaryDetailsSection.get('cuBeneficiaryAddressLine4').clearValidators();
      this.cuBeneficaryDetailsSection.get('cuBeneficiaryAddressLine4').setValidators([Validators.maxLength(Constants.LENGTH_35),
        validateSwiftCharSet(Constants.X_CHAR)]);
      this.cuBeneficaryDetailsSection.get('cuBeneficiaryAddressLine4').updateValueAndValidity();
      this.cuBeneficaryDetailsSection.get('cuContactAddressLine4').enable();
      this.cuBeneficaryDetailsSection.get('cuContactAddressLine4').clearValidators();
      this.cuBeneficaryDetailsSection.get('cuContactAddressLine4').setValidators([Validators.maxLength(Constants.LENGTH_35),
        validateSwiftCharSet(Constants.X_CHAR)]);
      this.cuBeneficaryDetailsSection.get('cuContactAddressLine4').updateValueAndValidity();
    } else {
      this.cuBeneficaryDetailsSection.get('cuBeneficiaryAddressLine4').clearValidators();
      this.cuBeneficaryDetailsSection.get('cuBeneficiaryAddressLine4').setValue('');
      this.cuBeneficaryDetailsSection.get('cuBeneficiaryAddressLine4').disable();
      this.cuBeneficaryDetailsSection.get('cuContactAddressLine4').clearValidators();
      this.cuBeneficaryDetailsSection.get('cuContactAddressLine4').setValue('');
      this.cuBeneficaryDetailsSection.get('cuContactAddressLine4').disable();
    }
    if (this.genericBeneficiaryDetails && this.genericBeneficiaryDetails !== null) {
      this.genericBeneficiaryDetails.forEach((child) => { child.setValidatorsIfModeSwift(swiftModeSelected); });
    }
  }
}
