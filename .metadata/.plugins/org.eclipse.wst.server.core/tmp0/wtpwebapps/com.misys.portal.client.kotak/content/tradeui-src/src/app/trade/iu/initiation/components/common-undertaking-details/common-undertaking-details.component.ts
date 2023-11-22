import { PhraseDialogComponent } from './../../../../../common/components/phrase-dialog/phrase-dialog.component';
import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { CountryDialogComponent } from '../../../../../common/components/country-dialog/country-dialog.component';
import { Constants } from '../../../../../common/constants';
import { CommonService } from '../../../../../common/services/common.service';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonDataService } from './../../../../../common/services/common-data.service';
import { DropdownOptions } from './../../../common/model/DropdownOptions.model';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { CountryValidationService } from './../../../../../common/services/countryValidation.service';
import { DialogService } from 'primeng';

export interface Type {
  name: string;
  value: string;
}

@Component({
  selector: 'fcc-iu-common-undertaking-details',
  templateUrl: './common-undertaking-details.component.html',
  styleUrls: ['./common-undertaking-details.component.scss']
})
export class CommonUndertakingDetailsComponent implements OnInit, AfterContentInit {

  @Input() undertakingType;
  @Input() formName: UntypedFormGroup;
  @Input() bgRecord;
  viewMode: boolean;
  public isMOAmend = false;
  isExistingDraftMenu;
  modalDialogTitle: string;
  swiftVersion: number;
  isSwiftVersion2023Enable = false;

  constructor(public validationService: ValidationService, public commonDataService: IUCommonDataService,
              public commonService: CommonService, public translate: TranslateService,
              public staticDataService: StaticDataService, public dialogService: DialogService,
              public commonData: CommonDataService, public confirmationService: ConfirmationService,
              public countryValidationService: CountryValidationService) { }

  textLangOther: string;
  textLang: string;
  textLangOtherLabel: string;
  headerCountriesListDialog: string;
  swiftMode = false;
  isBankUser = false;
  public rulesApplicableObj: any[];
  public undertakingTextObj: any[];
  public specialTermsObj: any[] = [];
  public textLanguageData: Type[] = [];
  public textLanguageObj: any[] = [];
  public provisionalStatus: string;
  demandIndicatorDataMap = new Map();
  demandIndicatorDropdown: DropdownOptions[] = [];
  getNarrativeNameForUndertaking(fieldName: string) {
    if (this.undertakingType === 'bg') {
      return fieldName;
    } else {
      return 'cuNarrativeUndertakingTermsAndConditions';
    }
  }

   ngOnInit() {
     this.isBankUser = this.commonData.getIsBankUser();
     this.isExistingDraftMenu = (this.bgRecord.tnxTypeCode === Constants.TYPE_REPORTING
      && this.commonData.getMode() === Constants.MODE_DRAFT);
     this.setFieldsIfNull();

     if (this.isBankUser && (this.bgRecord[`prodStatCode`] === '08' || this.bgRecord[`prodStatCode`] === '31'
         || (this.bgRecord[`prodStatCode`] === '03' && this.bgRecord.tnxTypeCode === Constants.TYPE_AMEND)) ) {
     this.isMOAmend = true;
     }

     this.rulesApplicableObj = [
       { label: this.commonService.getTranslation('RULES_APPLICABLE_URDG'), value: '06' },
       { label: this.commonService.getTranslation('RULES_APPLICABLE_ISPR'), value: '07' },
       { label: this.commonService.getTranslation('RULES_APPLICABLE_OTHR'), value: '99' },
       { label: this.commonService.getTranslation('RULES_APPLICABLE_NONE'), value: '09' },
       { label: this.commonService.getTranslation('RULES_APPLICABLE_UCPR'), value: '10' }
     ];

     this.undertakingTextObj = [
      {label: this.commonService.getTranslation('BANK_STANDARD'), value: '01'},
      {label: this.commonService.getTranslation('BENEFICIARY_WORDING'), value: '02'},
      {label: this.commonService.getTranslation('OUR_WORDING'), value: '03'},
      {label: this.commonService.getTranslation('SAME_AS_SPECIFY'), value: '04'}
     ];

     this.staticDataService.fetchBusinessCodes(Constants.SPECIAL_TERMS_CODE).subscribe(data => {
       this.specialTermsObj = data.dropdownOptions as DropdownOptions[];
       if (this.bgRecord.bgSpecialTerms !== '' && this.undertakingType === 'bg') {
         this.formName.get(`${this.undertakingType}SpecialTerms`).setValue(this.bgRecord.bgSpecialTerms);
       }
     });

     this.fetchLargeParamDataValues(Constants.DEMAND_INDICATOR_PARM_ID);

     this.translate.get('GTEEDETAILS_TEXT_LANGUAGE_OTHER').subscribe((res: string) => {
       this.textLangOtherLabel = res;
     });

     // get languages from service
     this.staticDataService.getLanguage().subscribe(data => {
       this.textLanguageData = data.languages;
       // push * for other language so user can enter manually in text box given below
       this.textLanguageData.push({ name: this.textLangOtherLabel, value: '*' });
       this.textLanguageData.forEach(lang => {
         const textLangElement: any = [];
         textLangElement.label = lang.name;
         textLangElement.value = lang.value;
         this.textLanguageObj.push(textLangElement);
         if (this.bgRecord[`${this.undertakingType}TextLanguage`] === textLangElement.value &&
           ((this.commonDataService.getTnxType() !== '01' && this.commonDataService.getOption() !== Constants.OPTION_EXISTING)
             || this.undertakingType !== 'cu' ||
             (this.commonDataService.getOption() === Constants.OPTION_TEMPLATE && this.undertakingType === 'cu'))) {
           this.formName.get(`${this.undertakingType}TextLanguage`).setValue(textLangElement.value);
         }
       });
     });

     if (this.commonDataService.getDisplayMode() === 'view') {
       this.viewMode = true;
     } else {
       this.viewMode = false;
     }

     this.commonService. getSwiftVersion();
     this.swiftVersion = this.commonService.swiftVersion;
     if(this.swiftVersion >= Constants.SWIFT_VERSION2023){
      this.isSwiftVersion2023Enable = true;

     }

     if (this.commonDataService.getAdvSendMode() !== null) {
      this.setValidatorsIfModeSwift(this.commonDataService.getAdvSendMode());
     }
     if (this.bgRecord.advSendMode && this.bgRecord.advSendMode !== null && this.bgRecord.advSendMode !== '') {
      this.setValidatorsIfModeSwift(this.bgRecord.advSendMode === '01');
     }
     this.translate.get('TABLE_PHRASES_LIST').subscribe((res: string) => {
      this.modalDialogTitle =  res;
    });
   }
   setFieldsIfNull() {
     if (!(this.bgRecord[`${this.undertakingType}Rule`] && this.bgRecord[`${this.undertakingType}Rule`] !== null
       && this.bgRecord[`${this.undertakingType}Rule`] !== '')) {
       this.formName.get(`${this.undertakingType}Rule`).setValue(null);
     }
     if (!(this.bgRecord[`${this.undertakingType}DemandIndicator`] && this.bgRecord[`${this.undertakingType}DemandIndicator`] !== null
       && this.bgRecord[`${this.undertakingType}DemandIndicator`] !== '')) {
       this.formName.get(`${this.undertakingType}DemandIndicator`).setValue(null);
     }
     if ((this.undertakingType === Constants.UNDERTAKING_TYPE_CU) &&
          !(this.commonService.isFieldsValuesExists([this.bgRecord[`cuTextTypeCode`]]))) {
        this.formName.get(`cuTextTypeCode`).setValue(null);
        if (this.isBankUser) {
          this.formName.get(`cuTextTypeCode`).setValue('01');
        }
     }
     if (this.undertakingType === Constants.UNDERTAKING_TYPE_IU &&
       !(this.bgRecord[`bgSpecialTerms`] && this.bgRecord[`bgSpecialTerms`] !== null
         && this.bgRecord[`bgSpecialTerms`] !== '')) {
       this.formName.get(`bgSpecialTerms`).setValue(null);
     }
     if (!(this.bgRecord[`${this.undertakingType}TextLanguage`] && this.bgRecord[`${this.undertakingType}TextLanguage`] !== null
       && this.bgRecord[`${this.undertakingType}TextLanguage`] !== '')) {
       this.formName.get(`${this.undertakingType}TextLanguage`).setValue(null);
     }
   }

   ngAfterContentInit() {
     if (this.bgRecord[`${this.undertakingType}Rule`] === '99' && !(this.commonData.disableTnx)) {
      this.formName.get(`${this.undertakingType}RuleOther`).enable();
     }
     if (this.bgRecord[`${this.undertakingType}TextTypeCode`] === '04' && !(this.commonData.disableTnx)) {
      this.formName.get(`${this.undertakingType}TextTypeDetails`).enable();
      if (this.undertakingType === 'bg') {
        this.formName.get(`${this.undertakingType}SpecialTerms`).disable();
      }
    }
     if ((this.bgRecord[`${this.undertakingType}TextTypeCode`] === '01' && !(this.commonData.disableTnx))
     && (!(Constants.OPTION_EXISTING === this.commonData.getOption() || this.isExistingDraftMenu))) {
      this.formName.get(`${this.undertakingType}TextTypeDetails`).disable();
      if (this.undertakingType === 'bg') {
        this.formName.get(`${this.undertakingType}SpecialTerms`).enable();
      }
    }
     if (this.formName.controls[`${this.undertakingType}TextLanguage`] && this.bgRecord[`${this.undertakingType}TextLanguage`] === '*' &&
        !(this.commonData.disableTnx)) {
      this.formName.get(`${this.undertakingType}TextLanguageOther`).enable();
    }
     if (this.isMOAmend) {
      this.updateMOAmendStatus(true);
      if (this.bgRecord[`bgAmdDetails`] && this.bgRecord[`bgAmdDetails`] != null && this.bgRecord[`bgAmdDetails`] !== '') {
        this.formName.get(`bgAmdDetails`).setValue(this.bgRecord[`bgAmdDetails`]);
      }
     }
     this.formName.updateValueAndValidity();
  }

changeRulesApplicable() {
  if (this.formName.get(`${this.undertakingType}Rule`).value === '99') {
    this.formName.get(`${this.undertakingType}RuleOther`).enable();
    } else {
      this.formName.get(`${this.undertakingType}RuleOther`).setValue('');
      this.formName.get(`${this.undertakingType}RuleOther`).markAsUntouched({ onlySelf: true });
      this.formName.get(`${this.undertakingType}RuleOther`).markAsPristine({ onlySelf: true });
      this.formName.get(`${this.undertakingType}RuleOther`).updateValueAndValidity();
      this.formName.get(`${this.undertakingType}RuleOther`).disable();
  }
 }

changeUndertakingText() {
  if (this.formName.get(`${this.undertakingType}TextTypeCode`).value === '04') {
       this.formName.get(`${this.undertakingType}TextTypeDetails`).enable();
       if (this.undertakingType === 'bg') {
        this.formName.get(`${this.undertakingType}SpecialTerms`).setValue('');
        this.formName.get(`${this.undertakingType}SpecialTerms`).disable();
        this.formName.get('bgTextTypeDetails').setValidators([Validators.required]);
        this.formName.get('bgTextTypeDetails').updateValueAndValidity();
       }
    } else if (this.formName.get(`${this.undertakingType}TextTypeCode`).value === '01') {
      this.formName.get(`${this.undertakingType}TextTypeDetails`).setValue('');
      this.formName.get(`${this.undertakingType}TextTypeDetails`).disable();
      if (this.undertakingType === 'bg') {
        this.formName.get(`${this.undertakingType}SpecialTerms`).enable();
      }
    } else {
      if (this.undertakingType === 'bg') {
        this.formName.get(`${this.undertakingType}SpecialTerms`).disable();
        this.formName.get(`${this.undertakingType}SpecialTerms`).setValue('');
      }
      this.formName.get(`${this.undertakingType}TextTypeDetails`).setValue('');
      this.formName.get(`${this.undertakingType}TextTypeDetails`).markAsUntouched({ onlySelf: true });
      this.formName.get(`${this.undertakingType}TextTypeDetails`).markAsPristine({ onlySelf: true });
      this.formName.get(`${this.undertakingType}TextTypeDetails`).updateValueAndValidity();
      this.formName.get(`${this.undertakingType}TextTypeDetails`).disable();
  }
}

changeTextLanguage() {
  if (this.formName.get(`${this.undertakingType}TextLanguage`).value === '*') {
    this.formName.get(`${this.undertakingType}TextLanguageOther`).enable();
    } else {
      this.formName.get(`${this.undertakingType}TextLanguageOther`).setValue('');
      this.formName.get(`${this.undertakingType}TextLanguageOther`).markAsUntouched({ onlySelf: true });
      this.formName.get(`${this.undertakingType}TextLanguageOther`).markAsPristine({ onlySelf: true });
      this.formName.get(`${this.undertakingType}TextLanguageOther`).updateValueAndValidity();
      this.formName.get(`${this.undertakingType}TextLanguageOther`).disable();
  }
 }

  openCountryDialog() {
    if (!this.formName.get(`${this.undertakingType}GovernCountry`).disabled) {
      this.translate.get('TABLE_SUMMARY_COUNTRY_LIST').subscribe((res: string) => {
        this.headerCountriesListDialog =  res;
      });
      const ref = this.dialogService.open(CountryDialogComponent, {
        header: this.headerCountriesListDialog,
        width: '30vw',
        height: '65vh',
        contentStyle: {overflow: 'auto', height: '65vh'}
      });
      ref.onClose.subscribe((countryValue: string) => {
        if (countryValue) {
          this.formName.get(`${this.undertakingType}GovernCountry`).setValue(countryValue);
        }
      });
    }
  }

  generatePdf(generatePdfService) {
    if (this.undertakingType === '' || this.undertakingType === null || this.undertakingType === 'bg') {
      if (this.commonDataService.getPreviewOption() !== 'SUMMARY') {
        generatePdfService.setSectionDetails('UNDERTAKING_DETAILS_LABEL', true, false, 'undertakingDetails');
      }
    } else if (this.undertakingType === 'cu') {
      generatePdfService.setSectionDetails('COUNTER_UNDERTAKING_DETAILS_LABEL', true, false, 'cuUndertakingDetails');
    }
  }

  updateMOAmendStatus(status: boolean) {
    this.isMOAmend = status;
    if (this.isMOAmend) {
      if (this.swiftMode) {
        this.formName.addControl(`bgAmdDetails`, new UntypedFormControl('', [Validators.maxLength(Constants.LENGTH_9750),
          validateSwiftCharSet(Constants.Z_CHAR)]));
        this.formName.get(this.getNarrativeNameForUndertaking('bgNarrativeTextUndertaking')).clearValidators();
        this.formName.get(this.getNarrativeNameForUndertaking('bgNarrativeTextUndertaking')).updateValueAndValidity();
        this.formName.get(`bgNarrativeUnderlyingTransactionDetails`).clearValidators();
        this.formName.get(`bgNarrativeUnderlyingTransactionDetails`).updateValueAndValidity();
        this.formName.get(`bgNarrativePresentationInstructions`).clearValidators();
        this.formName.get(`bgNarrativePresentationInstructions`).updateValueAndValidity();
      } else {
        this.formName.addControl(`bgAmdDetails`, new UntypedFormControl(''));
      }
    } else if (this.formName.get(`bgAmdDetails`)) {
      this.formName.get(`bgAmdDetails`).setValue('');
      this.formName.get(`bgAmdDetails`).setErrors(null);
      this.formName.get(`bgAmdDetails`).setValidators(null);
      this.formName.removeControl(`bgAmdDetails`);
      this.setValidatorsIfModeSwift(this.swiftMode);
    }
  }
  setValidatorsIfModeSwift(swiftModeSelected) {
    this.swiftMode = swiftModeSelected;
    if (!swiftModeSelected) {
      this.formName.get(this.getNarrativeNameForUndertaking('bgNarrativeTextUndertaking')).clearValidators();
      this.formName.get(this.getNarrativeNameForUndertaking('bgNarrativeTextUndertaking')).updateValueAndValidity();
      this.formName.get(`${this.undertakingType}NarrativeUnderlyingTransactionDetails`).clearValidators();
      if (this.undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.formName.get(this.getNarrativeNameForUndertaking('bgNarrativeTextUndertaking')).setValidators(
          [Validators.required]);
        this.formName.get(this.getNarrativeNameForUndertaking('bgNarrativeUnderlyingTransactionDetails')).setValidators(
            [Validators.required, Validators.maxLength(Constants.LENGTH_3250)]);
      }
      if (this.isBankUser && this.undertakingType === 'cu') {
        this.formName.get(this.getNarrativeNameForUndertaking('bgNarrativeTextUndertaking')).setValidators(
          [Validators.maxLength(Constants.LENGTH_9750), validateSwiftCharSet(Constants.Z_CHAR),
          Validators.required]);
        this.formName.get(this.getNarrativeNameForUndertaking('bgNarrativeTextUndertaking')).updateValueAndValidity();
        this.formName.get('cuNarrativeUnderlyingTransactionDetails').setValidators([Validators.required]);
      }
      this.formName.get(`${this.undertakingType}NarrativeUnderlyingTransactionDetails`).updateValueAndValidity();
      this.formName.get(`${this.undertakingType}NarrativePresentationInstructions`).clearValidators();
      this.formName.get(`${this.undertakingType}NarrativePresentationInstructions`).updateValueAndValidity();
    } else {
      this.formName.get(this.getNarrativeNameForUndertaking('bgNarrativeTextUndertaking')).clearValidators();
      this.formName.get(this.getNarrativeNameForUndertaking('bgNarrativeTextUndertaking')).setValidators(
        [Validators.required, Validators.maxLength(Constants.LENGTH_9750), validateSwiftCharSet(Constants.Z_CHAR)]);
      this.formName.get(this.getNarrativeNameForUndertaking('bgNarrativeTextUndertaking')).updateValueAndValidity();
      this.formName.get(`${this.undertakingType}NarrativeUnderlyingTransactionDetails`).clearValidators();
      this.formName.get(`${this.undertakingType}NarrativeUnderlyingTransactionDetails`).setValidators([
        Validators.required, Validators.maxLength(Constants.LENGTH_3250), validateSwiftCharSet(Constants.Z_CHAR)]);
      this.formName.get(`${this.undertakingType}NarrativeUnderlyingTransactionDetails`).updateValueAndValidity();
      this.formName.get(`${this.undertakingType}NarrativePresentationInstructions`).clearValidators();
      this.formName.get(`${this.undertakingType}NarrativePresentationInstructions`).setValidators(
        [Validators.maxLength(Constants.LENGTH_6500), validateSwiftCharSet(Constants.Z_CHAR)]);
      this.formName.get(`${this.undertakingType}NarrativePresentationInstructions`).updateValueAndValidity();
    }
  }

  openPhraseDialog(formControlName: string) {
    let applicantEntityName = '';
    if (this.commonService.getNumberOfEntities() === Constants.NUMERIC_ZERO) {
      applicantEntityName = this.bgRecord.applicantName;
    } else if (this.commonService.getNumberOfEntities() === Constants.NUMERIC_ONE) {
      applicantEntityName = this.bgRecord.entity;
    } else {
      applicantEntityName = this.commonData.getEntity();
    }

    if (!(this.commonData.getIsBankUser()) && (applicantEntityName == null || applicantEntityName === '')) {
      let message = '';
      let dialogHeader = '';
      this.translate.get('WARNING_TITLE').subscribe((value: string) => {
        dialogHeader = value;
      });
      this.translate.get('ENTITY_MANDATORY_ERROR').subscribe((value: string) => {
        message = value;
      });
      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: 'pi pi-exclamation-triangle',
        key: 'entityWarningPhraseUndertaking',
        rejectVisible: false,
        acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
        accept: () => {
        }
      });
    } else {
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
          if (this.formName.get(formControlName).value != null &&
          this.formName.get(formControlName).value !== '') {
          finalText = this.formName.get(formControlName).value.concat('\n');
          } else {
          finalText = this.formName.get(formControlName).value;
          }
          finalText = finalText.concat(text);
          this.formName.get(formControlName).setValue(finalText);
        }
      });
    }
  }
  fetchLargeParamDataValues(parmId: string) {
    this.staticDataService.fetchLargeParamData(parmId).subscribe(data => {
      if (data && data != null && data.largeParamBankDatas && data.largeParamBankDatas.length !== 0) {
        const largeParamBanks = data.largeParamBankDatas;
        largeParamBanks.forEach(element => {
          this.demandIndicatorDataMap.set(element.bank, element.values);
        });
        const bankSection = this.formName.parent.get(`bankDetailsSection`);

        const recepientBank = (bankSection && bankSection.get(`recipientBankName`) &&
                              bankSection.get(`recipientBankName`).value != null &&
                              bankSection.get(`recipientBankName`).value !== '') ?
                              this.commonDataService.getBankDetails(bankSection.get(`recipientBankAbbvName`).value) : '';

        let bankName = this.isBankUser ? this.commonService.getCompanyName() : recepientBank;

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
    if (bankName != null && bankName !== '' && parmId === Constants.DEMAND_INDICATOR_PARM_ID) {
      if (this.demandIndicatorDataMap.size > 0) {
        if (this.demandIndicatorDataMap.get(bankName)) {
        this.demandIndicatorDropdown.length = 0;
        const largeParamData = this.demandIndicatorDataMap.get(bankName);
        largeParamData.forEach(element => {
          const largeParamEle: any = {};
          largeParamEle.label = element.label;
          largeParamEle.value = element.value;
          this.demandIndicatorDropdown.push(largeParamEle);
          if (this.undertakingType !== 'cu' && this.bgRecord[`bgDemandIndicator`] === element.value && persistFieldValue) {
            this.formName.get(`bgDemandIndicator`).setValue(element.value);
          }
          if (this.undertakingType === 'cu' && this.bgRecord[`cuDemandIndicator`] === element.value && persistFieldValue) {
            this.formName.get(`cuDemandIndicator`).setValue(element.value);
          }
      });
      } else {
        this.demandIndicatorDropdown = [];
        if (this.undertakingType === 'bg') {
          this.formName.get(`bgDemandIndicator`).setValue('');
        } else if (this.undertakingType === 'cu') {
          this.formName.get(`cuDemandIndicator`).setValue('');
        }
      }
      }
    }
  }
}
