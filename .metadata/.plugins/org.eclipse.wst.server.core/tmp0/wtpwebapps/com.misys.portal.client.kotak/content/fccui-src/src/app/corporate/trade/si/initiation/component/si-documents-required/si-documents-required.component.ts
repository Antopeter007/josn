import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from './../../../../../../common/core/fcc-global-constant.service';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { NarrativeService } from './../../../../../../corporate/trade/lc/initiation/services/narrative.service';
import { UtilityService } from './../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-si-documents-required',
  templateUrl: './si-documents-required.component.html',
  styleUrls: ['./si-documents-required.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiDocumentsRequiredComponent }]
})
export class SiDocumentsRequiredComponent extends SiProductComponent implements OnInit, OnDestroy {

  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  lcConstant = new LcConstant();
  module = '';
  element = FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DOC_REQ_TEXT;
  swiftZCharRegex: string;
  swiftExtendedNarrativeEnable: boolean;
  paramDataList: any[] = [];
  modeOfTransmission;
  docRequiredRowCount: number;
  maxLength = this.lcConstant.maximumlength;
  maxRowCount = this.lcConstant.maxRowCount;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  allowedCharCount = this.lcConstant.allowedCharCount;
  params = this.lcConstant.params;
  swift = 'swift';
  mode: any;
  docRequiredMandatory: boolean;
  docRequiredcounter = this.lcConstant.zero;
  openAllSvg = 'openAllSvg';
  closeAllSvg = 'closeAllSvg';
  openAllSvgPath: any;
  closeAllSvgPath: any;
  contextPath: any;
  tnxTypeCode: any;
  mandatoryFields: any[];
  readonly = this.lcConstant.readonly;
  phrasesResponseForDocReqd: any;
  displayValue: string;
  finalTextValue = '';
  entityName: any;
  responseData: string;
  option;
  totalNarrativeCount;
  amendEditSection = 'siGoodsandDoc';
  amendEditsubSection = 'siDocRequired';
  amendEditTextAreaKey = 'docRequiredAmendEditTextArea';
  repAllTextAreaKey = 'docRequiredAmendEditTextArea0';
  textAreaCount;
  textAreaCreated = false;
  docsRequiredLen;
  isRepall = false;
  currentVerbCode: any;

  constructor(protected emitterService: EventEmitterService, protected stateService: ProductStateService,
              protected formControlService: FormControlService, protected commonService: CommonService,
              protected fccBusinessConstantsService: FccBusinessConstantsService, protected narrativeService: NarrativeService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected translateService: TranslateService,
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
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.openAllSvgPath = this.contextPath + '/content/FCCUI/assets/icons/expandAll.svg';
    this.closeAllSvgPath = this.contextPath + '/content/FCCUI/assets/icons/collapseAll.svg';
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
        this.form = obj as FCCFormGroup;
    }
    this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    this.updateNarrativeCount(this.form, this.element);
    this.configAndValidations();
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get(this.element)[this.params][FccGlobalConstant.PHRASE_ENABLED] = true;
    } else {
      this.form.get(this.element)[this.params][FccGlobalConstant.PHRASE_ENABLED] = false;
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.updateMasterData();
      this.amendFormFields();
      if(this.operation === 'PREVIEW'){
        this.form.get('docReqAmendEditTextAreaRead')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('docReqAmendEditTextAreaRead')[this.params]['hidden'] = false;
        this.form.get('docReqAmendEditTextAreaRead')[this.params]['previewScreen'] = true;
      }
      this.configAndValidationsAmend();
      if (!this.textAreaCreated){
        if (this.mode === FccGlobalConstant.DRAFT_OPTION)
        {
          this.textAreaCount = this.docRequiredcounter;
        }
        else {
          this.textAreaCount = 0;
        }
        this.textAreaCreated = true;
      }
    }
    this.narrativeService.callingDocReqComponent = false;
    if (this.commonService.isnonEMptyString(this.form.get('docReqAmendEditTextAreaRead').value)){
      if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.form.get('docRequiredRepAll').value === 'Y'
      && this.form.get('docReqAmendEditTextAreaRead').value.includes('REPALL')) {
        this.textAreaCount = 0;
        this.docRequiredcounter = 0;
        const fieldObj1 = this.amendHistoryHeaderJsonObject(this.form.get('docRequiredAmendHistoryHeader'));
        this.form.removeControl('docRequiredAmendHistoryHeader');
        const fieldObj2 = this.narrativeService.narrativeExpansionPanelJsonObject(
          this.form.get('docRequiredAmendmentPanel'));
        this.form.removeControl('docRequiredAmendmentPanel');
        this.form.get('docRequiredAmendOptions')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get(this.amendEditTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get(this.amendEditTextAreaKey).setValue(null);
        const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
          this.form.get(this.amendEditTextAreaKey));
        this.form.addControl(this.repAllTextAreaKey, this.formControlService.getControl(fieldObj));
        this.form.get(this.repAllTextAreaKey)[FccGlobalConstant.KEY] = this.repAllTextAreaKey;
        this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
        this.form.addControl('docRequiredAmendHistoryHeader', this.formControlService.getControl(fieldObj1));
        this.form.addControl('docRequiredAmendmentPanel', this.formControlService.getControl(fieldObj2));
        this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.START] = 'Repall';
        if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(this.repAllTextAreaKey, Validators.pattern(this.swiftZCharRegex), 0);
        }
        this.docRequiredcounter++;
      }
      else if (this.mode === FccGlobalConstant.DRAFT_OPTION && (this.form.get('docReqAmendEditTextAreaRead').value.includes('ADD') ||
      this.form.get('docReqAmendEditTextAreaRead').value.includes('DELETE'))) {
        this.form.get('docRequiredRepAll').setValue('N');
        this.form.get('docRequiredAmendOptions')[this.params][FccGlobalConstant.RENDERED] = true;
      }
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, 'docRequiredText', false);
      this.form.get('docRequiredText').setErrors(null);
      this.form.get('docRequiredText').clearValidators();
    }
  }

  updateMasterData() {
    this.narrativeService.updateMasterData(this.form, this.element, 'masterDocReqdView');
  }

  configAndValidationsAmend() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZCharRegex = response.swiftZChar;
        this.swiftExtendedNarrativeEnable = response.swiftExtendedNarrativeEnable;
        this.docRequiredMandatory = response.docReqMandatory;
        this.documentRequiredMandatory();
        if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
          this.totalNarrativeCount = this.narrativeService.getTotalAmendNarrativeCount(
            this.amendEditSection,
            this.amendEditsubSection,
            this.form,
            this.amendEditTextAreaKey,
            this.docRequiredcounter
          );

          this.narrativeService.documentReqSubjectAmend.next(this.totalNarrativeCount);
          this.form.addFCCValidators(this.element, Validators.pattern(this.swiftZCharRegex), 0);
          for ( let i = 0; i < this.docRequiredcounter ; i++){
            const tempAmendEditTextArea = this.amendEditTextAreaKey.concat(i.toString());
            this.form.addFCCValidators( tempAmendEditTextArea, Validators.pattern(this.swiftZCharRegex), 0);
            this.form.get(tempAmendEditTextArea).updateValueAndValidity();
            this.form.get(tempAmendEditTextArea)[this.params][this.swift] = true;
            this.form.get(tempAmendEditTextArea)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_800;
            this.narrativeService.swiftModeTransmissionAmend(
              this.form,
              tempAmendEditTextArea,
              this.totalNarrativeCount,
              this.stateService,
              this.docsRequiredLen
            );

          }
          this.form.get(this.element).updateValueAndValidity();
          if (!this.swiftExtendedNarrativeEnable) {
            this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_LC,
              FccGlobalConstant.PARAMETER_P940).subscribe(responseData => {
                if (responseData) {
                  this.paramDataList = responseData.paramDataList;
                  this.parameterList();
                  // this.narrativeService.validateMaxLengthAmend(maxLength, this.totalNarrativeCount, this.form, this.element);
                }
              });
          }
        } else {
          this.texelCourierModeTransmission();
        }
      }
    });
    this.totalNarrativeCount = this.narrativeService.getTotalAmendNarrativeCount(this.amendEditSection,
      this.amendEditsubSection, this.form, this.amendEditTextAreaKey, this.docRequiredcounter );
    this.narrativeService.documentReqSubjectAmend.next(this.totalNarrativeCount);
  }

  onKeyupDocRequiredText() {
    const data = this.form.get(this.element).value;
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace(/[\r\n]+/gm, '' ) : '';
    if (checkForValue === '') {
      this.form.get(this.element).setValue('');
      this.form.get(this.element).setErrors({ invalid: true });
      this.form.get(this.element).updateValueAndValidity();
    } else {
      const exp = new RegExp(this.commonService.swiftNarrativeFilterValue,"g");
        let x = "";
        this.form.get(this.element).value.split(exp).forEach(function(arrayItem: string){
          if(arrayItem.trim() !== ""){
             x = x.concat(" ", arrayItem.trim());}

        });
        this.form.get(this.element).setValue(x);
        this.form.get(this.element).setErrors({ invalid: false });
        this.form.get(this.element).updateValueAndValidity();
    }
    const currentCount = this.form.get(this.element)[this.params][this.enteredCharCount];
    this.narrativeService.documentReqSubject.next(currentCount);
    this.configAndValidations();
    this.totalCountValidation();
  }

  onKeyupDocRequiredAmendEditTextArea(event, key) {
    const data = this.form.get(key).value;
    const maxLength = this.form.get(key)[this.params][this.maxLength];
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace( /[\r\n]+/gm, '' ) : '';
    // let emptyAmendEditArea:boolean = false;
    if (checkForValue === '') {
      this.form.get(key).setValue(null);
      this.form.get(key).setErrors({ invalid: true });
      this.form.get(key).updateValueAndValidity();
    } else {
        const exp = new RegExp(this.commonService.swiftNarrativeFilterValue,"g");
        this.form.get(this.element).setValue(this.form.get(this.element).value.replaceAll(exp,' '));

      this.form.get(key).setErrors({ invalid: false });
      this.form.get(key).updateValueAndValidity();
      this.narrativeService.limitCharacterCountPerLine(key, this.form);
    }

    this.totalNarrativeCount = this.narrativeService.getTotalAmendNarrativeCount(
      this.amendEditSection,
      this.amendEditsubSection,
      this.form,
      this.amendEditTextAreaKey,
      this.docRequiredcounter
    );

    this.narrativeService.documentReqSubjectAmend.next(this.totalNarrativeCount);
    this.narrativeService.totalCountValidationAmendSI(key, this.form, this.totalNarrativeCount, this.stateService, this.docsRequiredLen);
    if (data.length > maxLength) {
      this.form.get(key).setErrors( { maxSizeExceedsIndividual: { maxSize: maxLength } } );
    }
  }

  onFocusDocRequiredText() {
    this.totalCountValidation();
  }

  onFocusDocRequiredAmendEditTextArea(event, key) {
    this.narrativeService.totalCountValidationAmendSI(key, this.form, this.totalNarrativeCount, this.stateService, this.docsRequiredLen);
  }

  totalCountValidation() {
    const totalCount = (this.narrativeService.goodAndDocsCount === undefined ? 0 : this.narrativeService.goodAndDocsCount) +
                        (this.narrativeService.documentReqCount === undefined ? 0 : this.narrativeService.documentReqCount) +
                        (this.narrativeService.additionalInfoCount === undefined ? 0 : this.narrativeService.additionalInfoCount) +
                        (this.narrativeService.specialBeneCount === undefined ? 0 : this.narrativeService.specialBeneCount);
    if (totalCount > this.narrativeService.getNarrativeTotalSwiftCharLength()) {
      this.form.get(this.element).setErrors({ maxSizeExceeds: { maxSize: this.narrativeService.getNarrativeTotalSwiftCharLength() } });
    }
  }

  configAndValidations() {
    this.form.get(this.element).clearValidators();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZCharRegex = response.swiftZChar;
        this.swiftExtendedNarrativeEnable = response.swiftExtendedNarrativeEnable;
        this.docRequiredMandatory = response.docReqMandatory;
        this.documentRequiredMandatory();
        if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators(this.element, Validators.pattern(this.swiftZCharRegex), 0);
          this.swiftModeTransmission();
          this.form.get(this.element).updateValueAndValidity();
          if (!this.swiftExtendedNarrativeEnable) {
            this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_SI,
              FccGlobalConstant.PARAMETER_P940).subscribe(responseData => {
                if (responseData) {
                  this.paramDataList = responseData.paramDataList;
                  this.parameterList();
                  this.docsRequiredLen = this.docRequiredRowCount * FccGlobalConstant.LENGTH_65;
                  this.form.get(this.element)[this.params][this.maxLength] = this.docsRequiredLen;
                  this.form.get(this.element)[this.params][this.allowedCharCount] = this.docsRequiredLen;
                  this.form.get(this.element)[this.params][this.maxRowCount] = this.docRequiredRowCount;
                  this.validateCharCount();
                }
              });
          }
          else{
            this.docsRequiredLen = this.form.get(this.element)[this.params][this.maxRowCount] * FccGlobalConstant.LENGTH_65;
            this.validateCharCount();
          }
        } else {
          this.texelCourierModeTransmission();
        }
      }
    });
    this.validateCharCount();
  }

  validateCharCount() {
    const count = this.form.get(this.element)[this.params][this.enteredCharCount];
    const validationError = {
      maxlength: { actualLength: count, requiredLength: this.docsRequiredLen } };
    if (count > this.docsRequiredLen) {
      this.form.addFCCValidators(this.element, Validators.compose([() =>validationError]), 0);
      this.form.get(this.element).markAsDirty();
      this.form.get(this.element).markAsTouched();
      this.form.get(this.element).setErrors({ maxlength: true });
    }
    this.form.get(this.element).updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  documentRequiredMandatory() {
    if (this.docRequiredMandatory && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.setMandatoryField(this.form, this.element, true);
      this.form.addFCCValidators(this.element, Validators.required, 1);
      this.form.get(this.element).updateValueAndValidity();
    }
    this.removeMandatory([this.element]);
  }

  parameterList() {
    if (this.paramDataList !== null) {
      this.paramDataList.forEach(element => {
        if (element.data_2 === this.lcConstant.docReq) {
          this.docRequiredRowCount = Number(element.data_1);
        }
      });
      if (this.docRequiredRowCount === undefined || this.docRequiredRowCount === null) {
        this.docRequiredRowCount = FccGlobalConstant.LENGTH_100;
      }
    }
  }

  texelCourierModeTransmission() {
    if (!this.docRequiredMandatory) {
      this.form.get(this.element).setValidators([]);
      this.form.get(this.element).updateValueAndValidity();
    }
    this.form.get(this.element)[this.params][this.swift] = false;
    if(this.swiftExtendedNarrativeEnable) {
      this.form.get(this.element)[this.params][this.swift] = true;
    }
    this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_800;
    this.form.get(this.element)[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeSwiftCharLength();
    this.form.get(this.element)[this.params][this.maxLength] = this.narrativeService.getNarrativeSwiftCharLength();
  }

  swiftModeTransmission() {
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.form.get(this.element)[this.params][this.swift] = false;
      if(this.swiftExtendedNarrativeEnable) {
        this.form.get(this.element)[this.params][this.swift] = true;
      }
    this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_800;
    this.form.get(this.element)[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeSwiftCharLength();
    this.form.get(this.element)[this.params][this.maxLength] = this.narrativeService.getNarrativeSwiftCharLength();
  }
  }

  updateNarrativeCount(form: any, key: string) {
    if (form.get(key).value) {
      let text = this.form.get(key).value;
      if(text.endsWith('\n')) {
        text = text.slice(0,-1);
      }
      const count = this.commonService.counterOfPopulatedData(text);
      this.narrativeService.documentReqSubject.next(count);
      this.form.get(this.element)[this.params][this.enteredCharCount] = count;
    }
  }

  amendHistoryHeaderJsonObject(field): any {
    const obj = {};
    const nameStr = 'name';
    const typeStr = 'type';
    const renderedStr = 'rendered';
    const layoutClassStr = 'layoutClass';
    const styleClassStr = 'styleClass';
    const previewScreenStr = 'previewScreen';
    obj[nameStr] = field.key ;
    obj[typeStr] = field.type;
    obj[renderedStr] = field.params.rendered;
    obj[layoutClassStr] = field.params.layoutClass;
    obj[styleClassStr] = field.params.styleClass;
    obj[previewScreenStr] = field.params.previewScreen;
    return obj;
  }

  onClickDocRequiredAmendOptions(obj: any) {
    const fieldObj1 = this.amendHistoryHeaderJsonObject(this.form.get('docRequiredAmendHistoryHeader'));
    this.form.removeControl('docRequiredAmendHistoryHeader');
    const fieldObj2 = this.narrativeService.narrativeExpansionPanelJsonObject(
      this.form.get('docRequiredAmendmentPanel'));
    this.form.removeControl('docRequiredAmendmentPanel');
    const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
      this.form.get(this.amendEditTextAreaKey));
    let newKeyName = this.amendEditTextAreaKey + this.docRequiredcounter;
    this.form.addControl(newKeyName, this.formControlService.getControl(fieldObj));
    this.form.get(newKeyName)[FccGlobalConstant.KEY] = newKeyName;
    this.form.get(newKeyName)[this.params][FccGlobalConstant.RENDERED] = true;
    this.form.get(newKeyName)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
    this.docRequiredcounter++;
    const count = this.docRequiredcounter;
    let newCount;
    for (let i = this.docRequiredcounter - 1; i >= 0 ; i--) {
      let newName = this.amendEditTextAreaKey + i;
      if (i > 0) {
        const newKeyFinal = this.narrativeService.getFinalNewKeyName(this.form, this.amendEditTextAreaKey, i, fieldObj, newName);
        if (this.commonService.isNonEmptyValue(newKeyFinal)) {
          newName = newKeyFinal;
          this.docRequiredcounter--;
          newCount = this.docRequiredcounter;
        }
      }
      const narrativefieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(this.form.get(newName));
      const newControlVal = this.form.get(newName).value;
      this.form.removeControl(newName);
      this.form.addControl(newName, this.formControlService.getControl(narrativefieldObj));
      if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(newName, Validators.pattern(this.swiftZCharRegex), 0);
      }
      this.form.get(newName)[FccGlobalConstant.KEY] = newName;
      this.form.get(newName)[FccGlobalConstant.VALUE] = newControlVal;
    }
    if (count !== this.docRequiredcounter) {
      newKeyName = this.amendEditTextAreaKey + (newCount - 1);
      this.form.addControl(newKeyName, this.formControlService.getControl(fieldObj));
      this.form.get(newKeyName)[FccGlobalConstant.KEY] = newKeyName;
      this.form.get(newKeyName)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(newKeyName)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
    }
    this.form.addControl('docRequiredAmendHistoryHeader', this.formControlService.getControl(fieldObj1));
    this.form.addControl('docRequiredAmendmentPanel', this.formControlService.getControl(fieldObj2));
    this.form.get('docRequiredAmendmentPanel').patchValue(fieldObj2[FccGlobalConstant.VALUE]);

    if (obj.value === 'amendAdd') {
      this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Add';
    } else {
      this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Delete';
    }
    this.textAreaCount++;
    this.narrativeService.totalCountValidationAmendSI(newKeyName, this.form, this.totalNarrativeCount, this.stateService,
       this.docsRequiredLen);
  }

  onBlurDocRequiredAmendEditTextArea(event, key) {
    const strResult = event.srcElement.value ? event.srcElement.value : event.srcElement.innerText;
    if ((this.form.get('docRequiredRepAll').value === 'N') && (key !== null || key !== undefined)) {
      this.form.get(key).setValue(strResult);
    } else {
      this.form.get(this.repAllTextAreaKey).setValue(strResult);
    }
    this.narrativeService.totalCountValidationAmendSI(key, this.form, this.totalNarrativeCount, this.stateService, this.docsRequiredLen);
    this.ngOnDestroy();
  }

  onClickDocRequiredAmendEditTextArea(event, key) {
    this.form.removeControl(key);
    this.totalNarrativeCount = this.narrativeService.getTotalAmendNarrativeCount(
      this.amendEditSection,
      this.amendEditsubSection,
      this.form,
      this.amendEditTextAreaKey,
      this.docRequiredcounter
    );

    this.narrativeService.documentReqSubjectAmend.next( this.totalNarrativeCount);
    this.form.get(FccGlobalConstant.NAR_TAB_CONTROL_DOC_REQD_AMD_OPT).setValue(null);
    this.narrativeService.totalCountValidationAmendSI( key, this.form, this.totalNarrativeCount, this.stateService, this.docsRequiredLen);
  }


  onClickDocRequiredRepAll(isDraftDataPopulated: boolean = false) {
    if (this.form.get('docRequiredRepAll').value === 'Y') {
      for (let i = 0 ; i < this.docRequiredcounter ; i++) {
        if (this.form.get(this.amendEditTextAreaKey + i)) {
        this.onClickDocRequiredAmendEditTextArea(null, this.amendEditTextAreaKey + i);
        this.docRequiredcounter++;
        }
      }
      this.textAreaCount = 0;
      this.docRequiredcounter = 0;
      const fieldObj1 = this.amendHistoryHeaderJsonObject(this.form.get('docRequiredAmendHistoryHeader'));
      this.form.removeControl('docRequiredAmendHistoryHeader');
      const fieldObj2 = this.narrativeService.narrativeExpansionPanelJsonObject(
        this.form.get('docRequiredAmendmentPanel'));
      this.form.removeControl('docRequiredAmendmentPanel');
      this.form.get('docRequiredAmendOptions')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(this.amendEditTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(this.amendEditTextAreaKey).setValue(null);
      const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
        this.form.get(this.amendEditTextAreaKey));
      this.form.addControl(this.repAllTextAreaKey, this.formControlService.getControl(fieldObj));
      this.form.get(this.repAllTextAreaKey)[FccGlobalConstant.KEY] = this.repAllTextAreaKey;
      this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
      this.form.addControl('docRequiredAmendHistoryHeader', this.formControlService.getControl(fieldObj1));
      this.form.addControl('docRequiredAmendmentPanel', this.formControlService.getControl(fieldObj2));
      this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.START] = 'Repall';
      if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators(this.repAllTextAreaKey, Validators.pattern(this.swiftZCharRegex), 0);
      }
      this.docRequiredcounter++;
      if (this.mode === FccGlobalConstant.DRAFT_OPTION && isDraftDataPopulated) {
        this.form.get(this.repAllTextAreaKey).setValue(JSON.parse(this.form.get('docReqAmendEditTextAreaRead').value).text);
      }
    } else {
      this.setValuesForRepallNo();
    }
  }

  amendFormFields() {
    this.form.get(this.element)[this.params][this.swift] = true;
    this.form.get(this.element)[this.params][this.readonly] = true;
    this.form.get(this.element)[FccGlobalConstant.PARAMS][FccGlobalConstant.ROWS] = FccGlobalConstant.LENGTH_4;
    this.form.get('docRequiredAmendmentPanel')[this.params][this.openAllSvg] = this.openAllSvgPath;
    this.form.get('docRequiredAmendmentPanel')[this.params][this.closeAllSvg] = this.closeAllSvgPath;
    this.mandatoryFields = [this.element];
    this.setMandatoryFields(this.form, this.mandatoryFields, false);
    this.form.get(this.element).updateValueAndValidity();
    if (this.form.get(this.amendEditTextAreaKey).value && this.form.get(this.amendEditTextAreaKey).value.items) {
      this.docRequiredcounter = this.form.get(this.amendEditTextAreaKey).value.items.length;
    }
  }

  ngOnDestroy() {
    if (this.commonService.isnonEMptyString(this.form.get('docReqAmendEditTextAreaRead').value)) {
      if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.mode === FccGlobalConstant.DRAFT_OPTION &&
        ((this.docRequiredcounter === this.lcConstant.zero && this.form.get('docReqAmendEditTextAreaRead').value.includes('REPALL'))
        || this.docRequiredcounter === this.lcConstant.zero)
        ){
          const docRequiredAmendEditTextAreaRead = this.form.get('docReqAmendEditTextAreaRead').value.includes('\n') ?
          JSON.parse((this.form.get('docReqAmendEditTextAreaRead').value).replace(/\n/g, '\\n')) :
          JSON.parse(this.form.get('docReqAmendEditTextAreaRead').value);
          let docRequiredAmendEditTextAreaReadCount = docRequiredAmendEditTextAreaRead.length;
          if (docRequiredAmendEditTextAreaRead.verb === 'REPALL' || docRequiredAmendEditTextAreaRead.verb === 'ADD' ||
          docRequiredAmendEditTextAreaRead.verb === 'DELETE') {
            docRequiredAmendEditTextAreaReadCount = 1;
          }
          for (let i = 0; i < docRequiredAmendEditTextAreaReadCount; i++){
          const newKeyName = this.amendEditTextAreaKey + i ;
          const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
            this.form.get(this.amendEditTextAreaKey));
          this.form.addControl(newKeyName, this.formControlService.getControl(fieldObj));
          this.form.get(newKeyName)[FccGlobalConstant.KEY] = newKeyName;
          this.form.get(newKeyName)[this.params][FccGlobalConstant.RENDERED] = true;
          this.form.get(newKeyName)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
          if (docRequiredAmendEditTextAreaReadCount === 1) {
            this.form.get(newKeyName).setValue(docRequiredAmendEditTextAreaRead.text);
            if (docRequiredAmendEditTextAreaRead.verb === 'ADD') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Add';
            }
            else if (docRequiredAmendEditTextAreaRead.verb === 'DELETE') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Delete';
            } else {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Repall';
              this.form.get('docRequiredRepAll').setValue('Y');
            }
          } else {
            this.form.get(newKeyName).setValue(docRequiredAmendEditTextAreaRead[i].text);
            if (docRequiredAmendEditTextAreaRead[i].verb === 'ADD') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Add';
            }
            if (docRequiredAmendEditTextAreaRead[i].verb === 'DELETE') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Delete';
            }
          }
          }
          const arraySet: {items: any} = {
            items: []
          };
          this.form.get(this.amendEditTextAreaKey).setValue(arraySet);
          let tempCounter = 0;
          for (let i = 0; i < docRequiredAmendEditTextAreaReadCount; i++) {
            const narrativeTextValue = this.form.get(this.amendEditTextAreaKey + i).value;
            this.currentVerbCode = docRequiredAmendEditTextAreaReadCount === 1 ? docRequiredAmendEditTextAreaRead.verb
             : docRequiredAmendEditTextAreaRead[i].verb;
            if (narrativeTextValue === '') {
              if (this.currentVerbCode === 'Repall') {
                this.form.get('docRequiredRepAll').setValue('N');
                this.setValuesForRepallNo();
              } else {
                this.form.removeControl(this.amendEditTextAreaKey + i);
              }
            } else {
              if (this.currentVerbCode === 'Repall') {
                this.form.get('docRequiredRepAll').setValue('Y');
              }
              const jsonVal = { verb: String, text: String };
              jsonVal.verb = this.currentVerbCode.toLowerCase();
              jsonVal.text = narrativeTextValue;
              this.form.get(this.amendEditTextAreaKey).value[FccGlobalConstant.ITEMS].push(jsonVal);
              tempCounter++;
            }
        }
          this.docRequiredcounter = tempCounter;
      }
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.docRequiredcounter > this.lcConstant.zero) {
      const arraySet: {items: any} = {
        items: []
      };
      this.form.get(this.amendEditTextAreaKey).setValue(arraySet);
      let tempCounter = 0;
      for (let i = 0; i < this.docRequiredcounter; i++) {
        if (this.commonService.isNonEmptyField(this.amendEditTextAreaKey + i, this.form)){
        const narrativeTextValue = this.form.get(this.amendEditTextAreaKey + i).value;
        const verbCode = this.form.get(this.amendEditTextAreaKey + i)[this.params][FccGlobalConstant.START];
        if (narrativeTextValue === '') {
          if (verbCode === 'Repall') {
            this.form.get('docRequiredRepAll').setValue('N');
            this.setValuesForRepallNo();
          } else {
            this.form.removeControl(this.amendEditTextAreaKey + i);
          }
        } else {
          const jsonVal = { verb: String, text: String };
          jsonVal.verb = verbCode.toLowerCase();
          jsonVal.text = narrativeTextValue;
          this.form.get(this.amendEditTextAreaKey).value[FccGlobalConstant.ITEMS].push(jsonVal);
          tempCounter++;
        }
      }
    }
      this.docRequiredcounter = tempCounter;
      if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.docRequiredcounter === 0) {
        this.form.get('docReqAmendEditTextAreaRead').setValue(null);
      }
    }
    this.parentForm.controls[this.controlName] = this.form;
  }

  onClickPhraseIcon(event, key) {
    this.entityName = this.stateService.getSectionData(FccGlobalConstant.SI_APPLICANT_BENEFICIARY).get('applicantEntity').value.shortName;
    if (this.entityName !== '' && this.entityName !== undefined) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '02', false, this.entityName);
    } else {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '02', false);
    }
  }

  removeMandatory(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
      this.form.get(fields[0]).setErrors(null);
      this.form.get(fields[0]).clearValidators();
    }
  }

  onClickDocRequiredText($event){
    this.onBlurDocRequiredText($event);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBlurDocRequiredText($event){
    const data = this.form.get(this.element).value;
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace( /[\r\n]+/gm, '' ) : '';
    if (checkForValue === '') {
      this.form.get(this.element).setValue('');
      this.form.get(this.element).setErrors({ invalid: true });
      this.form.controls.docRequiredText.markAsDirty();
      this.form.controls.docRequiredText.markAsTouched();
      this.form.get(this.element).updateValueAndValidity();
    } else {
      const exp = new RegExp(this.commonService.swiftNarrativeFilterValue,"g");
      this.form.get(this.element).setValue(this.form.get(this.element).value.replaceAll(exp,' '));
      this.form.get(this.element).setErrors({ invalid: false });
      this.form.get(this.element).updateValueAndValidity();
    }
    const currentCount = this.form.get(this.element)[this.params][this.enteredCharCount];
    this.narrativeService.documentReqSubject.next(currentCount);
    this.configAndValidations();
    this.totalCountValidation();
  }

  setValuesForRepallNo() {
      this.form.get('docRequiredAmendOptions')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(this.amendEditTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(this.amendEditTextAreaKey).setValue(null);
      this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
      this.form.get(this.repAllTextAreaKey).setValue(null);
      if (this.form.get(this.repAllTextAreaKey)) {
        this.onClickDocRequiredAmendEditTextArea(null, this.repAllTextAreaKey);
      }
  }
}

