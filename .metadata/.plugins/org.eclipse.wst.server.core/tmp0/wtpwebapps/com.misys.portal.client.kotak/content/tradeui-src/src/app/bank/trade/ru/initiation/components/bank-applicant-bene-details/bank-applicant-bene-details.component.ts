import { CommonService } from './../../../../../../common/services/common.service';
import { Component, OnInit, EventEmitter, Output, Input, ViewChild, AfterContentInit} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { validateSwiftCharSet } from './../../../../../../common/validators/common-validator';
import { Constants } from './../../../../../../common/constants';
import { BankCommonApplicantBeneDetailsComponent
} from '../bank-common-applicant-bene-details/bank-common-applicant-bene-details.component';
import { CommonDataService } from './../../../../../../common/services/common-data.service';

@Component({
  selector: 'fcc-ru-bank-applicant-bene-details',
  templateUrl: './bank-applicant-bene-details.component.html',
  styleUrls: ['./bank-applicant-bene-details.component.scss']
})
export class BankApplicantBeneDetailsComponent implements OnInit, AfterContentInit {

  @ViewChild(BankCommonApplicantBeneDetailsComponent)
  bankCommonApplicantBeneDetailsComponent: BankCommonApplicantBeneDetailsComponent;

  constructor(public fb: UntypedFormBuilder, public commonData: CommonDataService, protected commonService: CommonService) { }

  @Input() public jsonContent;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  ruApplicantBeneDetailsForm: UntypedFormGroup;
  type: string;

  ngOnInit() {
    this.ruApplicantBeneDetailsForm = this.fb.group({
      entity: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      beneficiaryAbbvName: ['', [Validators.required]],
      beneficiaryName: ['', [Validators.required, Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      beneficiaryAddressLine1: ['', [Validators.required, Validators.maxLength(Constants.LENGTH_35),
                                  validateSwiftCharSet(Constants.X_CHAR)]],
      beneficiaryAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      beneficiaryDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      beneficiaryAddressLine4: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      beneficiaryReference: ['', [Validators.maxLength(this.commonService.getCustRefIdLength()), validateSwiftCharSet(Constants.X_CHAR)]],
      applicantName: ['', [Validators.maxLength(Constants.LENGTH_35), Validators.required, validateSwiftCharSet(Constants.X_CHAR)]],
      applicantAddressLine1: ['', [Validators.maxLength(Constants.LENGTH_35), Validators.required,
                                     validateSwiftCharSet(Constants.X_CHAR)]],
      applicantAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      applicantDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      applicantAddressLine4: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      applicantReference: ['', [Validators.maxLength(this.commonService.getCustRefIdLength()), validateSwiftCharSet(Constants.X_CHAR)]],
      applicantAbbvName: ['', [Validators.maxLength(Constants.LENGTH_35), Validators.required, validateSwiftCharSet(Constants.X_CHAR)]]
  });

    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
     this.ruApplicantBeneDetailsForm.get('applicantAbbvName').clearValidators();
    } else {
     this.ruApplicantBeneDetailsForm.get('beneficiaryAbbvName').clearValidators();
     this.ruApplicantBeneDetailsForm.get('beneficiaryName').clearValidators();
     this.ruApplicantBeneDetailsForm.get('beneficiaryAddressLine1').clearValidators();
    }

    if (this.commonData.getProductCode() === 'BG') {
      this.ruApplicantBeneDetailsForm.get('applicantAbbvName').disable();
      this.ruApplicantBeneDetailsForm.get('applicantName').disable();
    } else if (this.commonData.getProductCode() === 'BR') {
      this.ruApplicantBeneDetailsForm.get('beneficiaryAbbvName').disable();
      this.ruApplicantBeneDetailsForm.get('beneficiaryName').disable();
    }

    if (this.jsonContent.applicantName !== null && this.jsonContent.applicantName !== '') {
    this.ruApplicantBeneDetailsForm.patchValue({
      entity: this.jsonContent.entity,
      applicantAbbvName: this.jsonContent.applicantAbbvName,
      applicantName: this.jsonContent.applicantName,
      applicantAddressLine1: this.jsonContent.applicantAddressLine1,
      applicantAddressLine2: this.jsonContent.applicantAddressLine2,
      applicantDom: this.jsonContent.applicantDom,
      applicantAddressLine4: this.jsonContent.applicantAddressLine4,
      applicantReference: this.jsonContent.applicantReference
    });
  }

    // Emit the form group to the parent
    this.formReady.emit(this.ruApplicantBeneDetailsForm);
  }

  ngAfterContentInit() {
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
      this.ruApplicantBeneDetailsForm.removeControl('applicantReference');
    }
  }

  generatePdf(generatePdfService) {
    if (this.bankCommonApplicantBeneDetailsComponent) {
      this.bankCommonApplicantBeneDetailsComponent.generatePdf(generatePdfService);
    }


  }
}
