import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../../../common/constants';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonUndertakingDetailsComponent } from '../common-undertaking-details/common-undertaking-details.component';
import { CommonDataService } from '../../../../../common/services/common-data.service';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { CommonService } from '../../../../../common/services/common.service';



@Component({
  selector: 'fcc-iu-initiate-cu-undertaking-details',
  templateUrl: './cu-undertaking-details.component.html',
  styleUrls: ['./cu-undertaking-details.component.scss']
})
export class CuUndertakingDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  cuUndertakingDetailsForm: UntypedFormGroup;
  collapsible: boolean;
  @ViewChild(CommonUndertakingDetailsComponent) commonUndertakingDetailsComponent: CommonUndertakingDetailsComponent;
  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public commonDataService: IUCommonDataService, public commonData: CommonDataService,
              public commonService: CommonService) {}

    ngOnInit() {
      if ((this.commonDataService.getDisplayMode() === 'view' && this.checkForDataIfPresent()) || this.commonData.getIsBankUser()
      || ((this.commonDataService.getOption() === Constants.OPTION_TEMPLATE || this.commonDataService.getMode() === Constants.MODE_DRAFT)
      && this.checkForDataIfPresent())) {
        this.collapsible = true;
      } else {
        this.collapsible = false;
      }
      this.cuUndertakingDetailsForm = this.fb.group({
        cuRule: [''],
        cuRuleOther: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
        cuDemandIndicator: [''],
        cuGovernCountry: ['', [Validators.pattern(Constants.REGEX_CURRENCY)]],
        cuGovernText: ['', [Validators.maxLength(Constants.LENGTH_65), validateSwiftCharSet(Constants.X_CHAR)]],
        cuGovernCountrySubdiv: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
        cuTextTypeCode: [''],
        cuTextTypeDetails: [{value: '', disabled: true},
        [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
        cuTextLanguage: [''],
        cuTextLanguageOther: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35),
                                validateSwiftCharSet(Constants.X_CHAR)]],
        cuNarrativeUndertakingTermsAndConditions: ['',
        [Validators.maxLength(Constants.LENGTH_9750), validateSwiftCharSet(Constants.Z_CHAR)]],
        cuNarrativeUnderlyingTransactionDetails: ['',
        [Validators.maxLength(Constants.LENGTH_3250), validateSwiftCharSet(Constants.Z_CHAR)]],
        cuNarrativePresentationInstructions: ['', [Validators.maxLength(Constants.LENGTH_6500), validateSwiftCharSet(Constants.Z_CHAR)]]
      });

      if (this.commonData.getIsBankUser()) {
        this.cuUndertakingDetailsForm.controls[`cuTextTypeCode`].setValidators([Validators.required]);
        this.cuUndertakingDetailsForm.controls[`cuTextTypeCode`].updateValueAndValidity();
        this.cuUndertakingDetailsForm.controls[`cuTextTypeDetails`].setValidators([Validators.required,
        Validators.required, Validators.maxLength(Constants.LENGTH_35),
          validateSwiftCharSet(Constants.X_CHAR)]);
        this.cuUndertakingDetailsForm.controls[`cuTextTypeDetails`].updateValueAndValidity();
      }
      if (this.commonData.getIsBankUser() || (this.commonDataService.getMode() === Constants.MODE_DRAFT)) {
        this.initFieldValues();
      }
    // Emit the form group to the parent
      this.formReady.emit(this.cuUndertakingDetailsForm);
    }

    checkForDataIfPresent() {
      const arr = [this.bgRecord.cuRule, this.bgRecord.cuRuleOther, this.bgRecord.cuDemandIndicator,
                    this.bgRecord.cuGovernCountry, this.bgRecord.cuGovernText, this.bgRecord.cuGovernCountrySubdiv, this.bgRecord.cuTextTypeCode,
                    this.bgRecord.cuTextTypeDetails, this.bgRecord.cuTextLanguage, this.bgRecord.cuTextLanguageOther,
                    this.bgRecord.cuNarrativeUndertakingTermsAndConditions, this.bgRecord.cuNarrativeUnderlyingTransactionDetails,
                    this.bgRecord.cuNarrativePresentationInstructions];

      return this.commonService.isFieldsValuesExists(arr);
    }

    initFieldValues() {
      this.cuUndertakingDetailsForm.patchValue({
        cuRule: this.bgRecord.cuRule,
        cuRuleOther: this.bgRecord.cuRuleOther,
        cuDemandIndicator: this.bgRecord.cuDemandIndicator,
        cuGovernCountry: this.bgRecord.cuGovernCountry,
        cuGovernText: this.bgRecord.cuGovernText,
        cuGovernCountrySubdiv: this.bgRecord.cuGovernCountrySubdiv,
        cuTextTypeCode: this.bgRecord.cuTextTypeCode,
        cuTextTypeDetails: this.bgRecord.cuTextTypeDetails,
        cuTextLanguage: this.bgRecord.cuTextLanguage,
        cuTextLanguageOther: this.bgRecord.cuTextLanguageOther,
        cuNarrativeUndertakingTermsAndConditions: this.bgRecord.cuNarrativeUndertakingTermsAndConditions,
        cuNarrativeUnderlyingTransactionDetails: this.bgRecord.cuNarrativeUnderlyingTransactionDetails,
        cuNarrativePresentationInstructions: this.bgRecord.cuNarrativePresentationInstructions
      });
    }

    generatePdf(generatePdfService) {
      if (this.commonUndertakingDetailsComponent) {
      this.commonUndertakingDetailsComponent.generatePdf(generatePdfService);
      }
    }
}
