import { IUCommonAltApplicantDetailsComponent } from './../../../../../../trade/iu/common/components/alt-applicant-details-form/alt-applicant-details-form.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BeneficiaryDialogComponent } from './../../../../../../common/components/beneficiary-dialog/beneficiary-dialog.component';
import { EntityDialogComponent } from './../../../../../../common/components/entity-dialog/entity-dialog.component';
import { Constants } from './../../../../../../common/constants';
import { CommonDataService } from './../../../../../../common/services/common-data.service';
import { Entity } from './../../../../../../common/model/entity.model';
import { IUCommonDataService } from './../../../../../../trade/iu/common/service/iuCommonData.service';
import { ValidationService } from './../../../../../../common/validators/validation.service';
import { DialogService, DynamicDialogRef } from 'primeng';

@Component({
  selector: 'fcc-ru-bank-common-applicant-bene-details',
  templateUrl: './bank-common-applicant-bene-details.component.html',
  styleUrls: ['./bank-common-applicant-bene-details.component.scss']
})
export class BankCommonApplicantBeneDetailsComponent implements OnInit {

  @ViewChild(IUCommonAltApplicantDetailsComponent) altApplicantDetails: IUCommonAltApplicantDetailsComponent;

  @Input() type;
  @Input() public jsonContent;
  @Input() ruCommonApplicantBeneDetailsForm: UntypedFormGroup;
  modalDialogTitle: string;
  viewMode = false;
  applicantType: string;
  header: string;
  isExistingDraftMenu: boolean;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();

  constructor(public dialogService: DialogService, public translate: TranslateService,
              public commonDataService: CommonDataService, public iuCommonDataService: IUCommonDataService,
              public ref: DynamicDialogRef,  public validationService: ValidationService ) { }

  ngOnInit() {
    if (this.commonDataService.getDisplayMode() === Constants.MODE_VIEW) {
      this.viewMode = true;
    } else {
        this.viewMode = false;
    }
    this.isExistingDraftMenu = (this.jsonContent.tnxTypeCode === Constants.TYPE_REPORTING
      && this.commonDataService.getMode() === Constants.MODE_DRAFT);
    if (this.type === 'applicant') {
      this.header = 'HEADER_APPLICANT_DETAILS';
    } else {
      this.header = 'HEADER_BENEFICIARY_DETAILS';
    }
    if (this.iuCommonDataService.getMode() === Constants.MODE_DRAFT || this.commonDataService.getOption() === Constants.OPTION_EXISTING) {
      this.initFieldValues();
    }
  }
  initFieldValues() {
    this.ruCommonApplicantBeneDetailsForm.patchValue({
      entity: this.jsonContent.entity,
      beneficiaryAbbvName: this.jsonContent.beneficiaryAbbvName,
      beneficiaryName: this.jsonContent.beneficiaryName,
      beneficiaryAddressLine1: this.jsonContent.beneficiaryAddressLine1,
      beneficiaryAddressLine2: this.jsonContent.beneficiaryAddressLine2,
      beneficiaryDom: this.jsonContent.beneficiaryDom,
      beneficiaryAddressLine4: this.jsonContent.beneficiaryAddressLine4,
      beneficiaryCountry: this.jsonContent.beneficiaryCountry,
      beneficiaryReference: this.jsonContent.beneficiaryReference
    });
    this.commonDataService.setEntity(this.jsonContent.entity);
  }

  addToForm(name: string, form: UntypedFormGroup) {
    this.ruCommonApplicantBeneDetailsForm.setControl(name, form);
  }
  openEntityDialog(): void {
    this.translate.get('TABLE_SUMMARY_ENTITIES_LIST').subscribe((res: string) => {
      this.modalDialogTitle =  res;
    });
    const entityRef = this.dialogService.open(EntityDialogComponent, {
        data: {id: 'entities', form: this.ruCommonApplicantBeneDetailsForm},
        header: this.modalDialogTitle,
        width: '70vw',
        height: '70vh',
        contentStyle: {overflow: 'auto', height: '70vh' }
      });
    entityRef.onClose.subscribe((entity: Entity) => {
        if (entity) {
          if (this.commonDataService.getProductCode() === 'BG') {
            this.applicantType = 'applicant';
          } else {
            this.applicantType = 'beneficiary';
          }
          this.commonDataService.setEntity(entity.ENTITY);
          this.commonDataService.setApplicant(entity.ABBVNAME);
          if (entity.ENTITY != null && entity.ENTITY !== '') {
            this.ruCommonApplicantBeneDetailsForm.get('entity').setValue(entity.ENTITY);
          } else {
            this.ruCommonApplicantBeneDetailsForm.get('entity').setValue('');
          }
          this.ruCommonApplicantBeneDetailsForm.get(`${this.applicantType}AbbvName`).setValue(entity.ABBVNAME);
          this.ruCommonApplicantBeneDetailsForm.get(`${this.applicantType}Name`).setValue(entity.NAME);
          this.ruCommonApplicantBeneDetailsForm.get(`${this.applicantType}AddressLine1`).setValue(entity.ADDRESSLINE1);
          this.ruCommonApplicantBeneDetailsForm.get(`${this.applicantType}AddressLine2`).setValue(entity.ADDRESSLINE2);
          this.ruCommonApplicantBeneDetailsForm.get(`${this.applicantType}Dom`).setValue(entity.DOMICILE);
          if (entity.ADDRESSLINE4 && entity.ADDRESSLINE4 != null) {
            this.ruCommonApplicantBeneDetailsForm.get(`${this.applicantType}AddressLine4`).setValue(entity.ADDRESSLINE4);
          }
          this.ruCommonApplicantBeneDetailsForm.get(`${this.applicantType}Reference`).setValue(entity.REFERENCE);
          entityRef.close();
        }
    });

  }

  public openBeneficiaryDialog(): void {
    this.translate.get('TABLE_SUMMARY_COUNTERPARTIES_LIST').subscribe((res: string) => {
      this.modalDialogTitle =  res;
    });
    const ref = this.dialogService.open(BeneficiaryDialogComponent, {
      data: {
        id: 'beneficiary'
      },
        header: this.modalDialogTitle,
        width: '70vw',
        height: '70vh',
        contentStyle: {overflow: 'auto', height: '70vh' }
      });
    ref.onClose.subscribe((bene) => {
      if (bene) {
        this.ruCommonApplicantBeneDetailsForm.get('applicantName').setValue(bene.name);
        this.ruCommonApplicantBeneDetailsForm.get('applicantAddressLine1').setValue(bene.addressLine1);
        this.ruCommonApplicantBeneDetailsForm.get('applicantAddressLine2').setValue(bene.addressLine2);
        this.ruCommonApplicantBeneDetailsForm.get('applicantDom').setValue(bene.dom);
        this.ruCommonApplicantBeneDetailsForm.get('applicantAddressLine4').setValue(bene.country);
        this.ruCommonApplicantBeneDetailsForm.get('applicantReference').setValue(bene.bei);
        this.iuCommonDataService.setBeneficiary(bene.name);
      }
    });
  }
  generatePdf(generatePdfService) {
    if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_IU) {
    generatePdfService.setSectionDetails('HEADER_APPLICANT_DETAILS', true, false, 'applicantDetails');
    if (this.altApplicantDetails) {
      this.altApplicantDetails.generatePdf(generatePdfService);
    }
    generatePdfService.setSectionDetails('HEADER_BENEFICIARY_DETAILS', true, false, 'beneficiaryDetails');
  } else if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_RU) {
    generatePdfService.setSectionDetails('HEADER_BENEFICIARY_DETAILS', true, false, 'beneficiaryDetails');
    generatePdfService.setSectionDetails('HEADER_APPLICANT_DETAILS', true, false, 'applicantDetails');
    if (this.altApplicantDetails) {
      this.altApplicantDetails.generatePdf(generatePdfService);
    }
  }
    generatePdfService.setSectionDetails('', true, false, 'contactDetails');
  }
}
