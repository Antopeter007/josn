import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { LcProductService } from '../../../../services/lc-product.service';
import { PhrasesService } from '../../../../../../../common/services/phrases.service';
import { ResolverService } from '../../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../../common/services/search-layout.service';
import { LcConstant } from '../../../../common/model/constant';
import { CurrencyConverterPipe } from '../../../pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../services/filelist.service';
import { UtilityService } from '../../../services/utility.service';
import { LcProductComponent } from '../../lc-product/lc-product.component';
import { FCCFormGroup } from './../../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from './../../../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../../../common/services/event-emitter-service';
import { ProductStateService } from './../../../../common/services/product-state.service';
import { FormControlService } from './../../../services/form-control.service';
import { NarrativeService } from './../../../services/narrative.service';
import { HOST_COMPONENT } from './../../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccConstants } from './../../../../../../../common/core/fcc-constants';

@Component({
  selector: 'app-period-for-presentation',
  templateUrl: './period-for-presentation.component.html',
  styleUrls: ['./period-for-presentation.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: PeriodForPresentationComponent }]
})
export class PeriodForPresentationComponent extends LcProductComponent implements OnInit, AfterViewInit {

  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  lcConstant = new LcConstant();
  module = '';
  element = 'periodOfPresentationText';
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
  productCode:string;
  count: any;
  paramFieldMaxAllowedChars = 0;
  swiftXcharRegex;
  cols = FccGlobalConstant.MAX_COL_COUNT;

  constructor(protected emitterService: EventEmitterService, protected stateService: ProductStateService,
              protected formControlService: FormControlService, protected narrativeService: NarrativeService,
              protected fccBusinessConstantsService: FccBusinessConstantsService, protected commonService: CommonService,
              protected elementRef: ElementRef, protected translateService: TranslateService,
              protected searchLayoutService: SearchLayoutService, protected phrasesService: PhrasesService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected lcProductService: LcProductService
    ) {
    super(emitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
   }

  ngOnInit(): void {
    const obj = this.parentForm.controls[this.controlName];
    this.count = 0;
    if (obj !== null) {
        this.form = obj as FCCFormGroup;
    }

    this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    this.productCode=this.commonService.getQueryParametersFromKey('productCode');
    this.form.addFCCValidators('nbdays', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('periodOfPresentationText', Validators.pattern(this.swiftXCharRegex), 0);
    this.updatePeriodOfPresentationField();

    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get(this.element)[this.params][FccGlobalConstant.PHRASE_ENABLED] = true;
    } else {
      this.form.get(this.element)[this.params][FccGlobalConstant.PHRASE_ENABLED] = false;
    }
    this.updateNarrativeCount();
    this.validatePeriodOfPresentationTextAreaCount();
    this.validatePeriodOfPresentationInvalidChars();
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

  updatePeriodOfPresentationField()
  {
    const defaultParamFieldName = 'periodOfPresentationText';
    const defaultParamModeOfTransmission = (this.modeOfTransmission === FccBusinessConstantsService.SWIFT)
      ? FccBusinessConstantsService.SWIFT : FccConstants.DEFAULT_CRITERIA;
    let paramFieldMaxRowCount = 1;
    let paramFieldMaxColumnCount = 35;
    let paramFieldMaxAllowedChars = 35;

    if(this.productCode && (this.productCode === 'SI'|| this.productCode === 'LC') && this.modeOfTransmission) {

    this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_LC,
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

      if(this.modeOfTransmission !== FccBusinessConstantsService.SWIFT) {
        paramFieldMaxRowCount = 25;
        paramFieldMaxColumnCount = 65;
        paramFieldMaxAllowedChars = 1625;
      }

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
    }
    this.paramFieldMaxAllowedChars = paramFieldMaxAllowedChars;
  }
  swiftModeTransmission() {
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_1625;
      this.form.get(this.element)[this.params][this.allowedCharCount] = FccGlobalConstant.LENGTH_25 * FccGlobalConstant.LENGTH_65;
      this.form.get(this.element)[this.params][this.cols] = FccGlobalConstant.LENGTH_65;
      this.form.get(this.element)[this.params]['maxLength'] = FccGlobalConstant.LENGTH_1625;
    }
  }
  configAndValidations() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZCharRegex = response.swiftZChar;
        this.swiftXcharRegex = response.swiftXCharacterSet;
        if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT ||
          (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT)) {
          this.form.addFCCValidators(this.element, Validators.pattern(this.swiftXcharRegex), 0);
          this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_35;
          this.form.addFCCValidators('periodOfPresentationText', Validators.pattern(this.swiftXcharRegex), 0);
        } else {
          this.swiftModeTransmission();
          this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_1625;
          this.form.addFCCValidators(this.element, Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_1625)]), 0);
        }
      }
    });
  }


  replacePeriodOfPresentationText() {
    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {

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
  }
  onFocusPeriodOfPresentationText(){
    this.validatePeriodOfPresentationTextAreaCount();
    this.validatePeriodOfPresentationInvalidChars();
    this.form.get(this.element).updateValueAndValidity();
  }


  onBlurPeriodOfPresentationText(){
    this.replacePeriodOfPresentationText();
    this.validatePeriodOfPresentationTextAreaCount();
    this.validatePeriodOfPresentationInvalidChars();
    this.form.get(this.element).updateValueAndValidity();
  }

  onKeyupPeriodOfPresentationText() {
    this.validatePeriodOfPresentationTextAreaCount();
    this.validatePeriodOfPresentationInvalidChars();
    this.form.get(this.element).updateValueAndValidity();
  }

  onClickPhraseIcon(event, key) {
    this.entityName = this.stateService.getSectionData(FccGlobalConstant.APPLICANT_BENEFICIARY).get('applicantEntity').value.shortName;
    if (this.entityName !== '' && this.entityName !== undefined) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LC, key, '07', true, this.entityName);
    } else {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LC, key, '07', true);
    }
  }

  validatePeriodOfPresentationTextAreaCount() {
    this.configAndValidations();
     const count = this.form.get(this.element)[this.params][this.enteredCharCounts];
     if(count > this.paramFieldMaxAllowedChars){
      const validationError = {
				maxlength: { actualLength: count, requiredLength: this.paramFieldMaxAllowedChars } };
      this.form.addFCCValidators(FccGlobalConstant.PERIOD_OF_PRESENTATION_TEXT, Validators.compose([() =>validationError]), 0);
      this.form.controls.periodOfPresentationText.markAsDirty();
      this.form.controls.periodOfPresentationText.markAsTouched();
      this.form.controls.periodOfPresentationText.setErrors({ maxlength: true });
    } else{
      this.form.controls.periodOfPresentationText.setErrors(null);
      this.form.controls.periodOfPresentationText.clearValidators();
    }
    this.form.controls.periodOfPresentationText.updateValueAndValidity();
  }

  validatePeriodOfPresentationInvalidChars(){
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

  ngAfterViewInit() {
    this.onBlurPeriodOfPresentationText();
  }
}
