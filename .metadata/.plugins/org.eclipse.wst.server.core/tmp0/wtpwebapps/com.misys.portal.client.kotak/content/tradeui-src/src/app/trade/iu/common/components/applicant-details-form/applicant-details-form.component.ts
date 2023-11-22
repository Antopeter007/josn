import { PartyDetailsComponent } from '../../../../common/components/party-details/party-details.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EntityDialogComponent } from '../../../../../common/components/entity-dialog/entity-dialog.component';
import { Constants } from '../../../../../common/constants';
import { CommonService } from '../../../../../common/services/common.service';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';

import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng';
import { Entity } from '../../../../../common/model/entity.model';
import { IUCommonDataService } from '../../service/iuCommonData.service';
import { LicenseService } from '../../../../../common/services/license.service';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { IUCommonAltApplicantDetailsComponent } from '../alt-applicant-details-form/alt-applicant-details-form.component';


@Component({
  selector: 'fcc-iu-common-applicant-details',
  templateUrl: './applicant-details-form.component.html',
  styleUrls: ['./applicant-details-form.component.scss']
})
export class IUCommonApplicantDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  applicantDetailsFormSection: UntypedFormGroup;
  viewMode: boolean;
  mode: string;
  displayEntity = false;
  displayEntityBank = false;
  entity: string;
  numberOfEntities: number;
  isBankUser: boolean;
  applicantNameLength: any;
  applicantAddressLine1Length: any;
  applicantAddressLine2Length: any;
  applicantDomLength: any;
  applicantAddressLine4Length: any;
  @Output() updateBankDetails = new EventEmitter<any>();

  @ViewChild(PartyDetailsComponent) genericApplicantDetails: PartyDetailsComponent;
  @ViewChild(IUCommonAltApplicantDetailsComponent) altApplicantDetails: IUCommonAltApplicantDetailsComponent;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public iuCommonDataService: IUCommonDataService, public translate: TranslateService,
              public commonService: CommonService, public dialogService: DialogService,
              public license: LicenseService, public confirmationService: ConfirmationService,
              public commonData: CommonDataService) {
  }

  ngOnInit() {
    this.isBankUser = this.commonData.getIsBankUser();
    this.numberOfEntities = this.commonService.getNumberOfEntities();
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

    this.applicantDetailsFormSection = this.fb.group({
      entity: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      applicantName: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      applicantAddressLine1: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      applicantAddressLine2: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      applicantDom: ['', [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      applicantAddressLine4: [''],
      applicantCountry: ['', [Validators.pattern(Constants.REGEX_CURRENCY)]],
    });

    if (this.mode !== Constants.INITIATE_AMEND) {
      this.applicantDetailsFormSection.controls.applicantAddressLine1.setValidators([Validators.maxLength(maxLength35),
         Validators.required, validateSwiftCharSet(Constants.X_CHAR)]);
      this.applicantDetailsFormSection.controls.applicantName.setValidators([Validators.maxLength(maxLength35),
         Validators.required, validateSwiftCharSet(Constants.X_CHAR)]);
      this.applicantDetailsFormSection.controls.applicantCountry.setValidators([Validators.pattern(Constants.REGEX_CURRENCY),
        Validators.required]);
    }

    if ((this.numberOfEntities > 0)
      || (this.mode && this.mode === Constants.INITIATE_AMEND && this.bgRecord.entity !== null && this.bgRecord.entity !== '')
      || (this.mode && this.mode === Constants.MODE_DRAFT && this.bgRecord.entity !== null && this.bgRecord.entity !== '')) {
      this.displayEntity = true;
    } else if (this.isBankUser && this.bgRecord.entity !== null && this.bgRecord.entity !== '') {
      this.displayEntityBank = true;
      this.numberOfEntities = 1;
      this.entity = this.bgRecord.entity;
      this.applicantDetailsFormSection.patchValue({
        entity: this.entity
      });
    }

    if (!this.isBankUser && this.numberOfEntities === 1 && this.commonData.getEntity() !== null) {
      this.entity = this.commonData.getEntity();
      this.applicantDetailsFormSection.patchValue({
        entity: this.entity,
      });
    }

    if (this.mode !== Constants.INITIATE_AMEND && this.iuCommonDataService.getMode() !== Constants.MODE_DRAFT
      && this.numberOfEntities <= 1) {
      this.applicantDetailsFormSection.patchValue({
        applicantName: this.bgRecord.applicantName,
        applicantAddressLine1: this.bgRecord.applicantAddressLine1,
        applicantAddressLine2: this.bgRecord.applicantAddressLine2,
        applicantDom: this.bgRecord.applicantDom,
        applicantCountry: this.bgRecord.applicantCountry,
      });
    }

    if ((this.iuCommonDataService.getMode() === Constants.MODE_DRAFT || this.iuCommonDataService.getMode() === Constants.MODE_AMEND
      || (this.iuCommonDataService.getTnxType() === '01' &&
        (this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING
        || this.iuCommonDataService.getOption() === Constants.OPTION_REJECTED))) || this.isBankUser) {
      this.initFieldValues();
    }
    if (this.bgRecord.advSendMode && this.bgRecord.advSendMode !== null && this.bgRecord.advSendMode !== '') {
      this.setValidatorsIfModeSwift(this.bgRecord.advSendMode === '01');
    }
    this.formReady.emit(this.applicantDetailsFormSection);
  }

  initFieldValues() {
    this.applicantDetailsFormSection.patchValue({
      entity: this.bgRecord.entity,
      applicantName: this.bgRecord.applicantName,
      applicantAddressLine1: this.bgRecord.applicantAddressLine1,
      applicantAddressLine2: this.bgRecord.applicantAddressLine2,
      applicantDom: this.bgRecord.applicantDom,
      applicantAddressLine4: this.bgRecord.applicantAddressLine4,
      applicantCountry: this.bgRecord.applicantCountry,
    });
    this.commonData.setEntity(this.bgRecord.entity);
  }

  addToForm(name: string, form: UntypedFormGroup) {
    this.applicantDetailsFormSection.setControl(name, form);
  }

  openEntityDialog(fieldId): void {
    const ref = this.dialogService.open(EntityDialogComponent, {
      header: this.commonService.getTranslation('TABLE_SUMMARY_ENTITIES_LIST'),
      width: '70vw',
      height: '70vh',
      contentStyle: { overflow: 'auto', height: '70vh' }
    });
    ref.onClose.subscribe((entity: Entity) => {
      if (entity) {
        this.applicantDetailsFormSection.get(fieldId).setValue(entity.ABBVNAME);
        this.applicantDetailsFormSection.get('applicantName').setValue(entity.NAME);
        this.applicantDetailsFormSection.get('applicantAddressLine1').setValue(entity.ADDRESSLINE1);
        this.applicantDetailsFormSection.get('applicantAddressLine2').setValue(entity.ADDRESSLINE2);
        this.applicantDetailsFormSection.get('applicantDom').setValue(entity.DOMICILE);
        this.applicantDetailsFormSection.get('applicantCountry').setValue(entity.COUNTRY);
        this.commonData.setEntity(entity.ABBVNAME);
        this.updateBankDetailsForEntity();
      }
    });
  }

  generatePdf(generatePdfService) {
    if (this.genericApplicantDetails) {
      this.genericApplicantDetails.generatePdf(generatePdfService, 'applicant');
    }
  }

  updateLicenseList() {
    if (this.license.licenseMap.length !== 0) {
      let message = '';
      let dialogHeader = '';
      this.translate.get('DELINK_LICENSE_CONFIRMATION_MSG').subscribe((value: string) => {
        message = value;
      });
      this.translate.get('DAILOG_CONFIRMATION').subscribe((res: string) => {
        dialogHeader = res;
      });
      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: 'pi pi-exclamation-triangle',
        key: 'deleteLicenseConfirmDialogEnt',
        accept: () => {
          this.license.removeLinkedLicense();
          this.openEntityDialog('entity');
        },
        reject: () => {
        }
      });
    } else {
      this.openEntityDialog('entity');
    }
  }

  updateBankDetailsForEntity() {
    this.updateBankDetails.emit();
    const bankDetailsSection = this.applicantDetailsFormSection.parent.get('bankDetailsSection');
    bankDetailsSection.get('recipientBankCustomerReference').setValue('');
    bankDetailsSection.get('recipientBankAbbvName').setValue('');
    if (this.commonData.getIsMultiBank()) {
      bankDetailsSection.get('issuingBankTypeCode').setValue('');
      bankDetailsSection.get('issuingBankSwiftCode').setValue('');
      bankDetailsSection.get('issuingBankName').setValue('');
      bankDetailsSection.get('issuingBankAddressLine1').setValue('');
      bankDetailsSection.get('issuingBankAddressLine2').setValue('');
      bankDetailsSection.get('issuingBankDom').setValue('');
      bankDetailsSection.get('issuingBankAddressLine4').setValue('');
      bankDetailsSection.get('issuingBankSwiftCode').disable();
      bankDetailsSection.get('issuingBankName').disable();
      bankDetailsSection.get('issuingBankAddressLine1').disable();
      bankDetailsSection.get('issuingBankAddressLine2').disable();
      bankDetailsSection.get('issuingBankDom').disable();
      bankDetailsSection.get('issuingBankAddressLine4').disable();
    }
  }

  clearApplicantDetailsSection(clearApplicantSection) {
    this.numberOfEntities = this.commonService.getNumberOfEntities();
    if (clearApplicantSection && this.numberOfEntities !== 1) {
      this.applicantDetailsFormSection.get('entity').setValue('');
      this.applicantDetailsFormSection.get('applicantName').setValue('');
      this.applicantDetailsFormSection.get('applicantAddressLine1').setValue('');
      this.applicantDetailsFormSection.get('applicantAddressLine2').setValue('');
      this.applicantDetailsFormSection.get('applicantDom').setValue('');
      this.applicantDetailsFormSection.get('applicantAddressLine4').setValue('');
      this.applicantDetailsFormSection.get('applicantCountry').setValue('');
      this.commonData.setEntity('');
    } else if (this.numberOfEntities === 1) {
      this.entity = this.bgRecord.entity;
      this.applicantDetailsFormSection.patchValue({
        entity: this.entity,
        applicantName: this.bgRecord.applicantName,
        applicantAddressLine1: this.bgRecord.applicantAddressLine1,
        applicantAddressLine2: this.bgRecord.applicantAddressLine2,
        applicantDom: this.bgRecord.applicantDom,
        applicantAddressLine4: this.bgRecord.applicantAddressLine4,
        applicantCountry: this.bgRecord.applicantCountry
      });
      this.commonData.setEntity(this.entity);
    }
  }

  setValidatorsIfModeSwift(swiftModeSelected) {
    if (!swiftModeSelected) {
      this.applicantNameLength = this.commonService.getNameTradeLength();
      this.applicantAddressLine1Length = this.commonService.getAddress1TradeLength();
      this.applicantAddressLine2Length = this.commonService.getAddress2TradeLength();
      this.applicantDomLength  = this.commonService.getDomTradeLength();
      this.applicantAddressLine4Length = this.commonService.getAddress4TradeLength();
      this.applicantDetailsFormSection.get('applicantAddressLine4').enable();
      this.applicantDetailsFormSection.get('applicantAddressLine4').clearValidators();
      this.applicantDetailsFormSection.get('applicantAddressLine4').setValidators([Validators.maxLength(this.applicantAddressLine4Length)]);
      this.applicantDetailsFormSection.get('applicantAddressLine4').updateValueAndValidity();
      this.applicantDetailsFormSection.get('applicantAddressLine1').clearValidators();
      this.applicantDetailsFormSection.get('applicantAddressLine1').setValidators([Validators.maxLength(this.applicantAddressLine1Length)]);
      this.applicantDetailsFormSection.get('applicantAddressLine1').updateValueAndValidity();
      this.applicantDetailsFormSection.get('applicantAddressLine2').clearValidators();
      this.applicantDetailsFormSection.get('applicantAddressLine2').setValidators([Validators.maxLength(this.applicantAddressLine2Length)]);
      this.applicantDetailsFormSection.get('applicantAddressLine2').updateValueAndValidity();
      this.applicantDetailsFormSection.get('applicantName').clearValidators();
      this.applicantDetailsFormSection.get('applicantName').setValidators([Validators.maxLength(this.applicantNameLength)]);
      this.applicantDetailsFormSection.get('applicantName').updateValueAndValidity();
      this.applicantDetailsFormSection.get('applicantDom').clearValidators();
      this.applicantDetailsFormSection.get('applicantDom').setValidators([Validators.maxLength(this.applicantDomLength)]);
      this.applicantDetailsFormSection.get('applicantDom').updateValueAndValidity();
    } else {
      this.applicantNameLength = Constants.LENGTH_35;
      this.applicantAddressLine1Length = Constants.LENGTH_35;
      this.applicantAddressLine2Length = Constants.LENGTH_35;
      this.applicantDomLength  = Constants.LENGTH_35;
      this.applicantAddressLine4Length = Constants.LENGTH_35;
      this.applicantDetailsFormSection.get('applicantAddressLine4').clearValidators();
      this.applicantDetailsFormSection.get('applicantAddressLine4').setValue('');
      this.applicantDetailsFormSection.get('applicantAddressLine4').disable();
      this.applicantDetailsFormSection.get('applicantAddressLine1').clearValidators();
      this.applicantDetailsFormSection.get('applicantAddressLine1').setValidators([Validators.maxLength(this.applicantAddressLine1Length),
                                                                                    validateSwiftCharSet(Constants.X_CHAR)]);
      this.applicantDetailsFormSection.get('applicantAddressLine1').updateValueAndValidity();
      this.applicantDetailsFormSection.get('applicantAddressLine2').clearValidators();
      this.applicantDetailsFormSection.get('applicantAddressLine2').setValidators([Validators.maxLength(this.applicantAddressLine2Length),
                                                                                    validateSwiftCharSet(Constants.X_CHAR)]);
      this.applicantDetailsFormSection.get('applicantAddressLine2').updateValueAndValidity();
      this.applicantDetailsFormSection.get('applicantName').clearValidators();
      this.applicantDetailsFormSection.get('applicantName').setValidators([Validators.maxLength(this.applicantNameLength),
                                                                                    validateSwiftCharSet(Constants.X_CHAR)]);
      this.applicantDetailsFormSection.get('applicantName').updateValueAndValidity();
      this.applicantDetailsFormSection.get('applicantDom').clearValidators();
      this.applicantDetailsFormSection.get('applicantDom').setValidators([Validators.maxLength(this.applicantDomLength),
                                                                                    validateSwiftCharSet(Constants.X_CHAR)]);
      this.applicantDetailsFormSection.get('applicantDom').updateValueAndValidity();
    }
    if (this.altApplicantDetails && this.altApplicantDetails !== null) {
      this.altApplicantDetails.setValidatorsIfModeSwift(swiftModeSelected);
    }
    if (this.genericApplicantDetails && this.genericApplicantDetails !== null) {
      this.genericApplicantDetails.setValidatorsIfModeSwift(swiftModeSelected);
    }
  }

}
