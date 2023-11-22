import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

import { Constants } from '../../../../../common/constants';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonUndertakingDetailsComponent } from '../common-undertaking-details/common-undertaking-details.component';
import { CommonDataService } from '../../../../../common/services/common-data.service';

@Component({
  selector: 'fcc-iu-initiate-undertaking-details',
  templateUrl: './undertaking-details.component.html',
  styleUrls: ['./undertaking-details.component.scss']
})

export class UndertakingDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  undertakingDetailsForm: UntypedFormGroup;
  @ViewChild(CommonUndertakingDetailsComponent) commonUndertakingDetailsComponent: CommonUndertakingDetailsComponent;
  isBankUser: boolean;
  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public iuCommonDataService: IUCommonDataService, public commonData: CommonDataService) {}

    ngOnInit() {
      this.isBankUser = this.commonData.getIsBankUser();
      this.undertakingDetailsForm = this.fb.group({
        bgRule: [''],
        bgRuleOther: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
        bgDemandIndicator: [''],
        bgGovernCountry: ['', [Validators.pattern(Constants.REGEX_CURRENCY)]],
        bgGovernText: ['', [Validators.maxLength(Constants.LENGTH_65), validateSwiftCharSet(Constants.X_CHAR)]],
        bgGovernCountrySubdiv: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
        bgTextTypeCode: ['01', [Validators.required]],
        bgTextTypeDetails: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35),
                                                              validateSwiftCharSet(Constants.X_CHAR)]],
        bgSpecialTerms: [''],
        bgTextLanguage: [''],
        bgTextLanguageOther: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35),
                              validateSwiftCharSet(Constants.X_CHAR)]],
        bgNarrativeTextUndertaking: ['', [Validators.maxLength(Constants.LENGTH_9750), Validators.required,
                              validateSwiftCharSet(Constants.Z_CHAR)]],
        bgNarrativeUnderlyingTransactionDetails: ['', [Validators.maxLength(Constants.LENGTH_3250), Validators.required,
                                                          validateSwiftCharSet(Constants.Z_CHAR)]],
        bgNarrativePresentationInstructions: ['', [Validators.maxLength(Constants.LENGTH_6500), validateSwiftCharSet(Constants.Z_CHAR)]]
      });

      if (this.isBankUser || (this.iuCommonDataService.getMode() === Constants.MODE_DRAFT) ||
            (this.iuCommonDataService.getTnxType() === '01' && (this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING
            || this.iuCommonDataService.getOption() === Constants.OPTION_REJECTED))) {
        this.initFieldValues();
      }
      if (this.iuCommonDataService.getTnxType() === '01' && this.commonData.getOption() === Constants.SCRATCH
      && this.iuCommonDataService.getIsFromBankTemplateOption() && this.bgRecord.bgTextTypeCode === '02') {
      this.undertakingDetailsForm.get('bgTextTypeCode').setValue('01');
    }
      if ((this.commonData.getIsBankUser() && this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) ||
      ((this.iuCommonDataService.isFromBankTemplateOption) &&
      (this.iuCommonDataService.isEditorTemplate || this.iuCommonDataService.isXslTemplate))) {
        this.undertakingDetailsForm.get('bgTextTypeCode').disable();
      }
    // Emit the form group to the parent
      this.formReady.emit(this.undertakingDetailsForm);
    }

    initFieldValues() {
      this.undertakingDetailsForm.patchValue({
        bgRule: this.bgRecord.bgRule,
        bgRuleOther: this.bgRecord.bgRuleOther,
        bgDemandIndicator: this.bgRecord.bgDemandIndicator,
        bgGovernCountry: this.bgRecord.bgGovernCountry,
        bgGovernText: this.bgRecord.bgGovernText,
        bgGovernCountrySubdiv: this.bgRecord.bgGovernCountrySubdiv,
        bgTextTypeCode: this.bgRecord.bgTextTypeCode,
        bgTextTypeDetails: this.bgRecord.bgTextTypeDetails,
        bgSpecialTerms: this.bgRecord.bgSpecialTerms,
        bgTextLanguage: this.bgRecord.bgTextLanguage,
        bgTextLanguageOther: this.bgRecord.bgTextLanguageOther,
        bgNarrativeTextUndertaking: this.bgRecord.bgNarrativeTextUndertaking,
        bgNarrativeUnderlyingTransactionDetails: this.bgRecord.bgNarrativeUnderlyingTransactionDetails,
        bgNarrativePresentationInstructions: this.bgRecord.bgNarrativePresentationInstructions
      });
    }

    generatePdf(generatePdfService) {
      if (this.commonUndertakingDetailsComponent) {
      this.commonUndertakingDetailsComponent.generatePdf(generatePdfService);
      }
    }
}
