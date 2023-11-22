import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, ConfirmationService } from 'primeng';
import { Constants } from '../../../../../common/constants';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { CommonService } from '../../../../../common/services/common.service';
import { LicenseService } from '../../../../../common/services/license.service';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { PartyDetailsComponent } from '../../../../common/components/party-details/party-details.component';
import { IUCommonDataService } from '../../service/iuCommonData.service';

@Component({
  selector: 'fcc-iu-common-alt-applicant-details',
  templateUrl: './alt-applicant-details-form.component.html',
  styleUrls: ['./alt-applicant-details-form.component.scss']
})
export class IUCommonAltApplicantDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  altApplicantDetailsFormSection: UntypedFormGroup;
  viewMode: boolean;
  mode: string;
  isBankUser: boolean;
  isExistingDraftMenu;

  @Output() updateBankDetails = new EventEmitter<any>();

  @ViewChild(PartyDetailsComponent) genericApplicantDetails: PartyDetailsComponent;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public iuCommonDataService: IUCommonDataService, public translate: TranslateService,
              public commonService: CommonService, public dialogService: DialogService,
              public license: LicenseService, public confirmationService: ConfirmationService,
              public commonData: CommonDataService) {
  }

  ngOnInit() {
    this.isBankUser = this.commonData.getIsBankUser();
    this.isExistingDraftMenu = (this.bgRecord.tnxTypeCode === Constants.TYPE_REPORTING
      && this.commonData.getMode() === Constants.MODE_DRAFT);
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
    this.altApplicantDetailsFormSection = this.fb.group({
      forAccount: [''],
      altApplicantName: [{ value: '', disabled: true }, [Validators.maxLength(maxLength35), Validators.required,
      validateSwiftCharSet(Constants.X_CHAR)]],
      altApplicantAddressLine1: [{ value: '', disabled: true }, [Validators.maxLength(maxLength35), Validators.required,
      validateSwiftCharSet(Constants.X_CHAR)]],
      altApplicantAddressLine2: [{ value: '', disabled: true },
      [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      altApplicantDom: [{ value: '', disabled: true }, [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      altApplicantAddressLine4: [{ value: '', disabled: true },
      [Validators.maxLength(maxLength35), validateSwiftCharSet(Constants.X_CHAR)]],
      altApplicantCountry: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(Constants.REGEX_CURRENCY)]],
    });

    if ((this.iuCommonDataService.getMode() === Constants.MODE_DRAFT || this.iuCommonDataService.getMode() === Constants.MODE_AMEND
      || (this.iuCommonDataService.getTnxType() === '01' &&
        (this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING ||
        this.iuCommonDataService.getOption() === Constants.OPTION_REJECTED)))
        || this.isBankUser) {
      this.initFieldValues();
    }
    if (this.iuCommonDataService.getAdvSendMode() !== null) {
      this.setValidatorsIfModeSwift(this.iuCommonDataService.getAdvSendMode() === '01');
    }
    if (this.bgRecord.advSendMode && this.bgRecord.advSendMode !== null && this.bgRecord.advSendMode !== '') {
      this.setValidatorsIfModeSwift(this.bgRecord.advSendMode === '01');
    }
    this.formReady.emit(this.altApplicantDetailsFormSection);
  }

  initFieldValues() {
    this.altApplicantDetailsFormSection.patchValue({
      forAccount: this.iuCommonDataService.getCheckboxBooleanValues(this.bgRecord.forAccount),
      altApplicantName: this.bgRecord.altApplicantName,
      altApplicantAddressLine1: this.bgRecord.altApplicantAddressLine1,
      altApplicantAddressLine2: this.bgRecord.altApplicantAddressLine2,
      altApplicantDom: this.bgRecord.altApplicantDom,
      altApplicantAddressLine4: this.bgRecord.altApplicantAddressLine4,
      altApplicantCountry: this.bgRecord.altApplicantCountry,
    });
    if (this.bgRecord.forAccount === 'Y' && !(this.commonData.disableTnx)
    && !((this.isExistingDraftMenu || Constants.OPTION_EXISTING === this.commonData.getOption())
    && this.commonData.getProductCode() === 'BG')) {
      this.altApplicantDetailsFormSection.controls.altApplicantName.enable();
      this.altApplicantDetailsFormSection.controls.altApplicantAddressLine1.enable();
      this.altApplicantDetailsFormSection.controls.altApplicantAddressLine2.enable();
      this.altApplicantDetailsFormSection.controls.altApplicantDom.enable();
      this.altApplicantDetailsFormSection.controls.altApplicantAddressLine4.enable();
      this.altApplicantDetailsFormSection.controls.altApplicantCountry.enable();
    }
  }

  generatePdf(generatePdfService) {
    if (this.genericApplicantDetails) {
      this.genericApplicantDetails.generatePdf(generatePdfService, 'altApplicant');
    }
  }
  setValidatorsIfModeSwift(swiftModeSelected) {
    if (!swiftModeSelected)  {
      if ((Constants.OPTION_EXISTING === this.commonData.getOption() || this.isExistingDraftMenu)
      && !(this.commonData.disableTnx) &&  this.commonData.getProductCode() === 'BR') {
      this.altApplicantDetailsFormSection.get('altApplicantAddressLine4').enable();
      } else if ((Constants.OPTION_EXISTING === this.commonData.getOption() || this.isExistingDraftMenu)
      && (this.commonData.disableTnx) &&  this.commonData.getProductCode() === 'BR') {
      this.altApplicantDetailsFormSection.get('altApplicantAddressLine4').disable();
      } else if ((Constants.OPTION_EXISTING === this.commonData.getOption() || this.isExistingDraftMenu)
      &&  this.commonData.getProductCode() === 'BG') {
      this.altApplicantDetailsFormSection.get('altApplicantAddressLine4').disable();
      } else {
      this.altApplicantDetailsFormSection.get('altApplicantAddressLine4').enable();
      }
      this.altApplicantDetailsFormSection.get('altApplicantAddressLine4').clearValidators();
      this.altApplicantDetailsFormSection.get('altApplicantAddressLine4').setValidators([Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]);
      this.altApplicantDetailsFormSection.get('altApplicantAddressLine4').updateValueAndValidity();
    } else {
      this.altApplicantDetailsFormSection.get('altApplicantAddressLine4').clearValidators();
      this.altApplicantDetailsFormSection.get('altApplicantAddressLine4').setValue('');
      this.altApplicantDetailsFormSection.get('altApplicantAddressLine4').disable();
    }
    if (this.genericApplicantDetails && this.genericApplicantDetails !== null) {
      this.genericApplicantDetails.setValidatorsIfModeSwift(swiftModeSelected);
    }
  }
}
