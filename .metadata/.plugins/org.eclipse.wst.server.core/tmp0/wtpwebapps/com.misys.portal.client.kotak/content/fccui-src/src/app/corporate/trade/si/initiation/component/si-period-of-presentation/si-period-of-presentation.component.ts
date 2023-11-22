import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';

import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { NarrativeService } from './../../../../../../corporate/trade/lc/initiation/services/narrative.service';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccConstants } from './../../../../../../common/core/fcc-constants';

@Component({
  selector: 'app-si-period-of-presentation',
  templateUrl: './si-period-of-presentation.component.html',
  styleUrls: ['./si-period-of-presentation.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiPeriodOfPresentationComponent }]
})
export class SiPeriodOfPresentationComponent extends SiProductComponent implements OnInit {

  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  lcConstant = new LcConstant();
  module = '';
  element = FccGlobalConstant.PERIOD_OF_PRESENTATION_TEXT;
  swiftZCharRegex: string;
  swiftXCharRegex: string;
  swiftExtendedNarrativeEnable: boolean;
  paramDataList: any[] = [];
  modeOfTransmission;
  descOfGoodsRowCount: number;
  maxLength = this.lcConstant.maxlength;
  maxRowCount = this.lcConstant.maxRowCount;
  enteredCharCounts = this.lcConstant.enteredCharCounts;
  allowedCharCount = this.lcConstant.allowedCharCount;
  params = this.lcConstant.params;
  swift = 'swift';
  rendered = this.lcConstant.rendered;
  tnxTypeCode: any;
  phrasesResponseForPeriodOfPresent: any;
  displayValue: string;
  finalTextValue = '';
  entityName: any;
  responseData: string;
  paramFieldMaxAllowedChars = 0;
  swiftXcharRegex;
  cols = FccGlobalConstant.MAX_COL_COUNT;

  constructor(protected emitterService: EventEmitterService, protected stateService: ProductStateService,
              protected formControlService: FormControlService, protected narrativeService: NarrativeService,
              protected fccBusinessConstantsService: FccBusinessConstantsService, protected commonService: CommonService,
              protected elementRef: ElementRef, protected translateService: TranslateService,
              protected phrasesService: PhrasesService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected siProductService: SiProductService
    ) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, siProductService);
   }

  ngOnInit(): void {
    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
        this.form = obj as FCCFormGroup;
    }
    this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    this.configAndValidations();
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get(this.element)[this.params][FccGlobalConstant.PHRASE_ENABLED] = true;
    } else {
      this.form.get(this.element)[this.params][FccGlobalConstant.PHRASE_ENABLED] = false;
    }
    this.form.addFCCValidators(FccGlobalConstant.PERIOD_OF_PRESENTATION_NO_DAYS, Validators.pattern(FccGlobalConstant.numberPattern),
              FccGlobalConstant.ZERO);
    this.updatePeriodOfPresentationField();
    this.updateNarrativeCount();
    this.validatePeriodOfPresentationTextAreaCount();
    this.validatePeriodOfPresentationInvalidChars();
  }

  updatePeriodOfPresentationField()
  {
    const defaultParamFieldName = 'periodOfPresentationText';
    const defaultParamModeOfTransmission = (this.modeOfTransmission === FccBusinessConstantsService.SWIFT)
      ? FccBusinessConstantsService.SWIFT : FccConstants.DEFAULT_CRITERIA;
    let paramFieldMaxRowCount = 1;
    let paramFieldMaxColumnCount = 35;
    let paramFieldMaxAllowedChars = 35;

    this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_SI,
      FccGlobalConstant.PARAMETER_P940, defaultParamFieldName, defaultParamModeOfTransmission).subscribe(responseData => {
        responseData.paramDataList.every(row => {
          if(row && row.key_2 === defaultParamFieldName && row.key_3 === defaultParamModeOfTransmission){
            if(row.data_3 && FccConstants.DEFAULT_CRITERIA !== row.data_3){
              paramFieldMaxRowCount = row.data_3;
            }
            if(row.data_1 && FccConstants.DEFAULT_CRITERIA !== row.data_1){
              paramFieldMaxColumnCount = (row.data_1 <= 35 ? 35 : 65);
            }
            if(row.data_4 && FccConstants.DEFAULT_CRITERIA !== row.data_4){
              paramFieldMaxAllowedChars = row.data_4;
              this.paramFieldMaxAllowedChars = paramFieldMaxAllowedChars;
            }
            return false;
          }
          return true;
        });
      });

      this.patchFieldParameters(this.form.get(defaultParamFieldName), { maxlength: paramFieldMaxAllowedChars });
      this.patchFieldParameters(this.form.get(defaultParamFieldName), { fieldSize: paramFieldMaxColumnCount });
      this.patchFieldParameters(this.form.get(defaultParamFieldName), { allowedCharCount: paramFieldMaxAllowedChars });
      this.patchFieldParameters(this.form.get(defaultParamFieldName), { rows: paramFieldMaxRowCount });
      this.patchFieldParameters(this.form.get(defaultParamFieldName), { cols: paramFieldMaxColumnCount });
      this.patchFieldParameters(this.form.get(defaultParamFieldName), {
        styleClass: `indented-text-area-field-${paramFieldMaxColumnCount}`
      });
      this.patchFieldParameters(this.form.get(defaultParamFieldName), {
        layoutClass:`p-col-4 p-md-4 p-lg-4 p-sm-12 text_pop_${paramFieldMaxColumnCount} ` });
      this.patchFieldParameters(this.form.get(defaultParamFieldName), { maxRowCount:paramFieldMaxRowCount });
      this.paramFieldMaxAllowedChars = paramFieldMaxAllowedChars;

  }

  updateNarrativeCount() {
    if (this.form.get('periodOfPresentationText').value) {
      let text = this.form.get('periodOfPresentationText').value;
      if(text.endsWith('\n')) {
        text = text.slice(0,-1);
      }
      const cols = this.form.get('periodOfPresentationText')[this.params]['cols'];
      const count = this.commonService.counterOfPopulatedData(text, cols);
      this.form.get('periodOfPresentationText')[this.params][this.enteredCharCounts] = count;
    }
    this.validatePeriodOfPresentationTextAreaCount();
  }

  configAndValidations() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZCharRegex = response.swiftZChar;
        this.swiftXCharRegex = response.swiftXCharacterSet;
        if ((this.modeOfTransmission === FccBusinessConstantsService.SWIFT)
        || (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT)) {
          // this.form.addFCCValidators(this.element, Validators.pattern(this.swiftXCharRegex), 0);
          this.form.get(this.element).updateValueAndValidity();
          this.form.get('periodOfPresentationText').updateValueAndValidity();
        } else {
          // this.form.get(this.element).setValidators([]);
          this.form.get(this.element).updateValueAndValidity();
        }
      }
    });
  }

  onClickPhraseIcon(event, key) {
    this.entityName = this.stateService.getSectionData(FccGlobalConstant.SI_APPLICANT_BENEFICIARY).get('applicantEntity').value.shortName;
    if (this.entityName !== '' && this.entityName !== undefined) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '07', true, this.entityName);
    } else {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '07', true);
    }
  }

  onFocusPeriodOfPresentationText() {
    // this.updateNarrativeCount();
    this.validatePeriodOfPresentationTextAreaCount();
    this.validatePeriodOfPresentationInvalidChars();
    this.form.get(this.element).updateValueAndValidity();
  }
  swiftModeTransmission() {
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_1625;
      this.form.get(this.element)[this.params][this.allowedCharCount] = FccGlobalConstant.LENGTH_25 * FccGlobalConstant.LENGTH_65;
      this.form.get(this.element)[this.params][this.maxLength] = FccGlobalConstant.LENGTH_25 * FccGlobalConstant.LENGTH_65;
      this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_65;
      this.form.get('periodOfPresentationText')[this.params][FccGlobalConstant.MAXLENGTH] = FccGlobalConstant.LENGTH_1625;
    }
  }

  onBlurPeriodOfPresentationText() {
    this.replacePeriodOfPresentationText();
    this.configAndValidations();
    // this.updateNarrativeCount();
    this.validatePeriodOfPresentationTextAreaCount();
    this.validatePeriodOfPresentationInvalidChars();
    this.form.get(this.element).updateValueAndValidity();
  }

  onKeyupPeriodOfPresentationText() {
    this.replacePeriodOfPresentationText();
    // this.updateNarrativeCount();
    this.validatePeriodOfPresentationTextAreaCount();
    this.validatePeriodOfPresentationInvalidChars();
    this.form.get(this.element).updateValueAndValidity();
  }

  replacePeriodOfPresentationText() {
    this.commonService.getSwiftNarrativeFilterValues();
    const data = this.form.get('periodOfPresentationText').value;
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace( /[\r\n]+/gm, '' ) : '';
    if (checkForValue === '') {
    }
    else{
      const exp = new RegExp(this.commonService.swiftNarrativeFilterValue,"g");
        let x = "";
        this.form.get('periodOfPresentationText').value.split(exp).forEach(function(arrayItem: string){
          if(arrayItem.trim() !== "")
          {
            x = x.concat(" ", arrayItem.trim());
          }
          x = x.trim();
        });
        this.form.get('periodOfPresentationText').reset();
        this.form.get('periodOfPresentationText').setValue(x);
        this.form.get('periodOfPresentationText').setErrors({ invalid: false });
        this.form.get('periodOfPresentationText').updateValueAndValidity();

    }
  }

  validatePeriodOfPresentationTextAreaCount() {
    const count = this.form.get(this.element)[this.params][this.enteredCharCounts];
    if(count > this.paramFieldMaxAllowedChars) {
     const validationError = {
       maxlength: { actualLength: this.enteredCharCounts, requiredLength: this.paramFieldMaxAllowedChars } };
     this.form.addFCCValidators(FccGlobalConstant.PERIOD_OF_PRESENTATION_TEXT, Validators.compose([() =>validationError]), 0);
     this.form.get(FccGlobalConstant.PERIOD_OF_PRESENTATION_TEXT).markAsDirty();
     this.form.get(FccGlobalConstant.PERIOD_OF_PRESENTATION_TEXT).markAsTouched();
     this.form.get(FccGlobalConstant.PERIOD_OF_PRESENTATION_TEXT).updateValueAndValidity();
     this.form.get(FccGlobalConstant.PERIOD_OF_PRESENTATION_TEXT).setErrors({ maxlength: true });
     this.form.updateValueAndValidity();
   } else{
     this.form.get(FccGlobalConstant.PERIOD_OF_PRESENTATION_TEXT).setErrors(null);
     this.form.get(FccGlobalConstant.PERIOD_OF_PRESENTATION_TEXT).clearValidators();
     this.form.get(FccGlobalConstant.PERIOD_OF_PRESENTATION_TEXT).updateValueAndValidity();
   }
 }

  validatePeriodOfPresentationInvalidChars() {
    this.configAndValidations();
    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT ||
      (this.modeOfTransmission[0] && this.modeOfTransmission[0] === FccBusinessConstantsService.SWIFT)) {
        this.form.addFCCValidators('periodOfPresentationText', Validators.pattern(this.swiftXCharRegex), 0);
        const xRegex = new RegExp(this.swiftXCharRegex);
        if (this.form.get('periodOfPresentationText').value && !xRegex.test(this.form.get('periodOfPresentationText').value)) {
          this.form.get(this.element).setErrors({ invalid: true });
          this.form.controls.periodOfPresentationText.markAsDirty();
          this.form.controls.periodOfPresentationText.markAsTouched();
        }
      }
  }

  ngOnDestroy() {
    this.phrasesResponseForPeriodOfPresent = null;
  }

}

