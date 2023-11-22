import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { PhrasesService } from '../../../../../../../common/services/phrases.service';
import { ResolverService } from '../../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../../common/services/search-layout.service';
import { LcConstant } from '../../../../common/model/constant';
import { CurrencyConverterPipe } from '../../../pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../services/filelist.service';
import { LcProductComponent } from '../../lc-product/lc-product.component';
import { FCCFormGroup } from './../../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from './../../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../../../common/services/event-emitter-service';
import { ProductStateService } from './../../../../common/services/product-state.service';
import { FormControlService } from './../../../services/form-control.service';
import { NarrativeService } from './../../../services/narrative.service';
import { UtilityService } from './../../../services/utility.service';
import { LcProductService } from '../../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-additional-instructions',
  templateUrl: './additional-instructions.component.html',
  styleUrls: ['./additional-instructions.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: AdditionalInstructionsComponent }]
})
export class AdditionalInstructionsComponent extends LcProductComponent implements OnInit, OnDestroy {

  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  lcConstant = new LcConstant();
  totalNarrativeCount;
  module = '';
  element = 'addInstructionText';
  swiftZCharRegex: string;
  swiftExtendedNarrativeEnable: boolean;
  paramDataList: any[] = [];
  modeOfTransmission;
  additionalInstRowCount: number;
  maxLength = this.lcConstant.maximumlength;
  maxRowCount = this.lcConstant.maxRowCount;
  mode: any;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  allowedCharCount = this.lcConstant.allowedCharCount;
  params = this.lcConstant.params;
  swift = 'swift';
  addInstructioncounter = this.lcConstant.zero;
  openAllSvg = 'openAllSvg';
  closeAllSvg = 'closeAllSvg';
  openAllSvgPath: any;
  closeAllSvgPath: any;
  contextPath: any;
  tnxTypeCode: any;
  mandatoryFields: any[];
  readonly = this.lcConstant.readonly;
  phrasesResponseForAddInst: any;
  displayValue: string;
  finalTextValue = '';
  entityName: any;
  responseData: string;
  amendEditSection = 'goodsandDoc';
  amendEditsubSection = 'additionallnstruction';
  amendEditTextAreaKey = 'addInstructionAmendEditTextArea';
  repAllTextAreaKey = 'addInstructionAmendEditTextArea0';
  textAreaCount;
  textAreaCreated = false;
  additionalInsLen;
  isRepall = false;
  currentVerbCode: any;

  constructor(protected emitterService: EventEmitterService, protected stateService: ProductStateService,
              protected formControlService: FormControlService, protected commonService: CommonService,
              protected fccBusinessConstantsService: FccBusinessConstantsService,
              protected utilityService: UtilityService, protected narrativeService: NarrativeService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected translateService: TranslateService,
              protected searchLayoutService: SearchLayoutService, protected phrasesService: PhrasesService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService, protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected lcProductService: LcProductService
    ) {
    super(emitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
   }

  ngOnInit(): void {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.openAllSvgPath = this.contextPath + '/content/FCCUI/assets/icons/expandAll.svg';
    this.closeAllSvgPath = this.contextPath + '/content/FCCUI/assets/icons/collapseAll.svg';
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const obj = this.parentForm.controls[this.controlName];
    this.commonService.getSwiftNarrativeFilterValues();
    if (obj !== null) {
        this.form = obj as FCCFormGroup;
    }
    this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    this.configAndValidations();
    if (!this.swiftExtendedNarrativeEnable) {
      const currentCount = this.form.get(this.element)[this.params][this.enteredCharCount];
      this.narrativeService.additionalInfoSubject.next(currentCount);
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get(this.element)[this.params][FccGlobalConstant.PHRASE_ENABLED] = true;
    } else {
      this.form.get(this.element)[this.params][FccGlobalConstant.PHRASE_ENABLED] = false;
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.updateMasterData();
      this.amendFormFields();
      if(this.operation === 'PREVIEW'){
        this.form.get('addInstAmendEditTextAreaRead')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('addInstAmendEditTextAreaRead')[this.params]['hidden'] = false;
        this.form.get('addInstAmendEditTextAreaRead')[this.params]['previewScreen'] = true;
      }
      this.configAndValidationsAmend();
      if (!this.textAreaCreated){
        if (this.mode === FccGlobalConstant.DRAFT_OPTION)
        {
          this.textAreaCount = this.addInstructioncounter;
        }
        else {
          this.textAreaCount = 0;
        }
        this.textAreaCreated = true;
      }
    }
    if (this.commonService.isnonEMptyString(this.form.get('addInstAmendEditTextAreaRead').value)){
      if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.form.get('addInstructionRepAll').value === 'Y'
      && this.form.get('addInstAmendEditTextAreaRead').value.includes('REPALL')) {
        this.textAreaCount = 0;
        this.addInstructioncounter = 0;
        const fieldObj1 = this.amendHistoryHeaderJsonObject(this.form.get('addInstructionAmendHistoryHeader'));
        this.form.removeControl('addInstructionAmendHistoryHeader');
        const fieldObj2 = this.narrativeService.narrativeExpansionPanelJsonObject(
          this.form.get('addInstructionAmendmentPanel'));
        this.form.removeControl('addInstructionAmendmentPanel');
        this.form.get('addInstructionAmendOptions')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get(this.amendEditTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get(this.amendEditTextAreaKey).setValue(null);
        const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
          this.form.get(this.amendEditTextAreaKey));
        this.form.addControl(this.repAllTextAreaKey, this.formControlService.getControl(fieldObj));
        this.form.get(this.repAllTextAreaKey)[FccGlobalConstant.KEY] = this.repAllTextAreaKey;
        this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
        this.form.addControl('addInstructionAmendHistoryHeader', this.formControlService.getControl(fieldObj1));
        this.form.addControl('addInstructionAmendmentPanel', this.formControlService.getControl(fieldObj2));
        this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.START] = 'Repall';
        if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(this.repAllTextAreaKey, Validators.pattern(this.swiftZCharRegex), 0);
        }
        this.addInstructioncounter++;
      }
      else if (this.mode === FccGlobalConstant.DRAFT_OPTION && (this.form.get('addInstAmendEditTextAreaRead').value.includes('ADD') ||
      this.form.get('addInstAmendEditTextAreaRead').value.includes('DELETE'))) {
        this.form.get('addInstructionRepAll').setValue('N');
        this.form.get('addInstructionAmendOptions')[this.params][FccGlobalConstant.RENDERED] = true;
      }
    }
    this.updateNarrativeCount();
    if (this.mode === FccGlobalConstant.DRAFT_OPTION){
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }

    this.narrativeService.totalCountValidatonSubscription.subscribe((val) => {
      if (val && this.swiftExtendedNarrativeEnable) {
        this.narrativeService.clearCountValidationForAmend(this.form, this.totalNarrativeCount,
          this.stateService);
      }
    });
  }
  updateNarrativeCount() {
    if (this.form.get('addInstructionText').value) {
      let text = this.form.get('addInstructionText').value;
      if(text.endsWith('\n')) {
        text = text.slice(0,-1);
      }
      const count1 = this.commonService.counterOfPopulatedData(text);
      this.form.get('addInstructionText')[this.params][this.enteredCharCount] = count1;
    }
  }

updateMasterData() {
  this.narrativeService.updateMasterData(this.form, this.element, 'masterAddInstrView');

  }
  onKeyupAddInstructionText() {
    this.commonService.getSwiftNarrativeFilterValues();
    const data = this.form.get(this.element).value;
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace( /[\r\n]+/gm, '' ) : '';
    if (checkForValue === '') {
      this.form.get(this.element).setValue('');
      this.form.get(this.element).setErrors({ invalid: false });
      this.form.controls.splPaymentBeneText.markAsDirty();
      this.form.controls.splPaymentBeneText.markAsTouched();
      this.form.get(this.element).updateValueAndValidity();
    }
    else{
        const exp = new RegExp(this.commonService.swiftNarrativeFilterValue,"g");
        let x = "";
        this.form.get(this.element).value.split(exp).forEach(function(arrayItem: string){
          if(arrayItem.trim() !== ""){
          x = x.concat(" ", arrayItem.trim());}

        });
        this.form.get(this.element).setValue(x);
        this.form.get(this.element).updateValueAndValidity();
    }
    const currentCount = this.form.get(this.element)[this.params][this.enteredCharCount];
    this.narrativeService.additionalInfoSubject.next(currentCount);
    this.configAndValidations();
    this.totalCountValidation();
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }

  onClickAddInstructionText() {
    this.onBlurAddInstructionText();
  }

  onBlurAddInstructionText() {
    const data = this.form.get(this.element).value;
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace( /[\r\n]+/gm, '' ) : '';
    if (checkForValue === '') {
      this.form.get(this.element).setValue('');
      this.form.get(this.element).setErrors({ invalid: true });
      this.form.controls.addInstructionText.markAsDirty();
      this.form.controls.addInstructionText.markAsTouched();
      this.form.get(this.element).updateValueAndValidity();
    } else {
    const exp = new RegExp(this.commonService.swiftNarrativeFilterValue,"g");
    this.form.get(this.element).setValue(this.form.get(this.element).value.replaceAll(exp,' '));
    this.form.get(this.element).setErrors({ invalid: false });
    this.form.get(this.element).updateValueAndValidity();
  }
  const currentCount = this.form.get(this.element)[this.params][this.enteredCharCount];
  this.narrativeService.additionalInfoSubject.next(currentCount);
  this.configAndValidations();
  this.totalCountValidation();
  this.form.markAllAsTouched();
  this.form.updateValueAndValidity();
  }

  onKeyupAddInstructionAmendEditTextArea(event, key) {
    this.commonService.getSwiftNarrativeFilterValues();
    const data = this.form.get(key).value;
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace( /[\r\n]+/gm, '' ) : '';
    if (checkForValue === '') {
      this.form.get(key).setValue(null);
      this.form.get(key).setErrors({ invalid: true });
      this.form.get(key).updateValueAndValidity();
    } else {
        const exp = new RegExp(this.commonService.swiftNarrativeFilterValue,"g");
        let x = "";
        this.form.get(this.element).value.split(exp).forEach(function(arrayItem: string){
          if(arrayItem.trim() === ""){ }
          else {x = x.concat(" ", arrayItem.trim());}

        });

      this.form.get(key).setErrors({ invalid: false });
      this.form.get(key).updateValueAndValidity();
      this.narrativeService.limitCharacterCountPerLine(key, this.form);
    }

    this.totalNarrativeCount = this.narrativeService.getTotalAmendNarrativeCount(
      this.amendEditSection,
      this.amendEditsubSection,
      this.form,
      this.amendEditTextAreaKey,
      this.addInstructioncounter
    );

    this.narrativeService.additionalInfoSubjectAmend.next(this.totalNarrativeCount);
    this.narrativeService.totalCountValidationAmend(key, this.form, this.totalNarrativeCount, this.stateService, this.additionalInsLen);
  }

  onFocusAddInstructionText() {
    this.totalCountValidation();
  }

  onFocusAddInstructionAmendEditTextArea(event, key) {
    this.narrativeService.totalCountValidationAmend(key, this.form, this.totalNarrativeCount, this.stateService);
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
        if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators(this.element, Validators.pattern(this.swiftZCharRegex), 0);
          this.swiftModeTransmission();
          this.form.get(this.element).updateValueAndValidity();
          if (!this.swiftExtendedNarrativeEnable && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
            this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_LC,
              FccGlobalConstant.PARAMETER_P940).subscribe(responseData => {
                if (responseData) {
                  this.paramDataList = responseData.paramDataList;
                  this.parameterList();
                  this.additionalInsLen = this.additionalInstRowCount * FccGlobalConstant.LENGTH_65;
                  this.form.get(this.element)[this.params][this.maxLength] = this.additionalInsLen;
                  this.form.get(this.element)[this.params][this.allowedCharCount] = this.additionalInsLen;
                  this.form.get(this.element)[this.params][this.maxRowCount] = this.additionalInstRowCount;
                  this.validateCharCount();
                }
              });
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
      maxlength: { actualLength: count, requiredLength: this.additionalInsLen } };
    if (count > this.additionalInsLen) {
      this.form.addFCCValidators(this.element, Validators.compose([() =>validationError]), 0);
      this.form.get(this.element).markAsDirty();
      this.form.get(this.element).markAsTouched();
      this.form.get(this.element).setErrors({ maxlength: true });
    }
    this.form.get(this.element).updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  configAndValidationsAmend() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZCharRegex = response.swiftZChar;
        this.swiftExtendedNarrativeEnable = response.swiftExtendedNarrativeEnable;
        if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
          this.totalNarrativeCount = this.narrativeService.getTotalAmendNarrativeCount(
            this.amendEditSection,
            this.amendEditsubSection,
            this.form,
            this.amendEditTextAreaKey,
            this.addInstructioncounter
          );

          this.narrativeService.additionalInfoSubjectAmend.next(this.totalNarrativeCount);
          for (let i = 0; i < this.addInstructioncounter; i++) {
            const tempAmendEditTextArea = this.amendEditTextAreaKey.concat(i.toString());
            this.form.addFCCValidators(tempAmendEditTextArea, Validators.pattern(this.swiftZCharRegex), 0);
            this.form.get(tempAmendEditTextArea).updateValueAndValidity();
            this.form.get(tempAmendEditTextArea)[this.params][this.swift] = true;
            this.form.get(tempAmendEditTextArea)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_800;
            this.narrativeService.swiftModeTransmissionAmend(
              this.form,
              tempAmendEditTextArea,
              this.totalNarrativeCount,
              this.stateService,
              this.additionalInsLen
            );

          }
          this.form.get(this.element).updateValueAndValidity();
          this.form.addFCCValidators(this.element, Validators.pattern(this.swiftZCharRegex), 0);
          if (!this.swiftExtendedNarrativeEnable) {
            this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_LC,
              FccGlobalConstant.PARAMETER_P940).subscribe(responseData => {
                if (responseData) {
                  this.paramDataList = responseData.paramDataList;
                  this.parameterList();
                  this.additionalInsLen = this.additionalInstRowCount * FccGlobalConstant.LENGTH_65;
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
      this.amendEditsubSection, this.form, this.amendEditTextAreaKey, this.addInstructioncounter);
    this.narrativeService.additionalInfoSubjectAmend.next(this.totalNarrativeCount);
    this.form.get(this.element).addValidators(
      Validators.maxLength(this.form.get(this.element)[this.params][this.maxLength]));
  }


  parameterList() {
    if (this.paramDataList !== null) {
      this.paramDataList.forEach(element => {
        if (element.data_2 === this.lcConstant.addCond) {
          this.additionalInstRowCount = Number(element.data_1);
        }
      });
      if (this.additionalInstRowCount === undefined || this.additionalInstRowCount === null) {
        this.additionalInstRowCount = FccGlobalConstant.LENGTH_100;
      }
    }
  }

  texelCourierModeTransmission() {
    this.form.get(this.element).setValidators([]);
    this.form.get(this.element).updateValueAndValidity();

     // Display individual narravtive text count on disabled extendive narrative property
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
    this.form.get(this.element).updateValueAndValidity();

     // Display individual narravtive text count on disabled extendive narrative property
    this.form.get(this.element)[this.params][this.swift] = false;
    if(this.swiftExtendedNarrativeEnable) {
        this.form.get(this.element)[this.params][this.swift] = true;
    }
    this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_800;
    this.form.get(this.element)[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeSwiftCharLength();
    this.form.get(this.element)[this.params][this.maxLength] = this.narrativeService.getNarrativeSwiftCharLength();
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

  onClickAddInstructionAmendOptions(obj: any) {
    const fieldObj1 = this.amendHistoryHeaderJsonObject(this.form.get('addInstructionAmendHistoryHeader'));
    this.form.removeControl('addInstructionAmendHistoryHeader');
    const fieldObj2 = this.narrativeService.narrativeExpansionPanelJsonObject(
      this.form.get('addInstructionAmendmentPanel'));
    this.form.removeControl('addInstructionAmendmentPanel');
    const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
      this.form.get(this.amendEditTextAreaKey));
    let newKeyName = this.amendEditTextAreaKey + this.addInstructioncounter;
    this.form.addControl(newKeyName, this.formControlService.getControl(fieldObj));
    this.form.get(newKeyName)[FccGlobalConstant.KEY] = newKeyName;
    this.form.get(newKeyName)[this.params][FccGlobalConstant.RENDERED] = true;
    this.form.get(newKeyName)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
    this.addInstructioncounter++;
    const count = this.addInstructioncounter;
    let newCount;
    for (let i = this.addInstructioncounter - 1; i >= 0 ; i--) {
      let newName = this.amendEditTextAreaKey + i;
      if (i > 0) {
        const newKeyFinal = this.narrativeService.getFinalNewKeyName(this.form, this.amendEditTextAreaKey, i, fieldObj, newName);
        if (this.commonService.isNonEmptyValue(newKeyFinal)) {
          newName = newKeyFinal;
          this.addInstructioncounter--;
          newCount = this.addInstructioncounter;
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
    if (count !== this.addInstructioncounter) {
      newKeyName = this.amendEditTextAreaKey + (newCount - 1);
      this.form.addControl(newKeyName, this.formControlService.getControl(fieldObj));
      this.form.get(newKeyName)[FccGlobalConstant.KEY] = newKeyName;
      this.form.get(newKeyName)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(newKeyName)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
    }
    this.form.addControl('addInstructionAmendHistoryHeader', this.formControlService.getControl(fieldObj1));
    this.form.addControl('addInstructionAmendmentPanel', this.formControlService.getControl(fieldObj2));
    this.form.get('addInstructionAmendmentPanel').patchValue(fieldObj2[FccGlobalConstant.VALUE]);

    if (obj.value === 'amendAdd') {
      this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Add';
    } else {
      this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Delete';
    }
    this.textAreaCount++;
    this.narrativeService.totalCountValidationAmend(newKeyName, this.form, this.totalNarrativeCount, this.stateService,
       this.additionalInsLen);
  }

  onBlurAddInstructionAmendEditTextArea(event, key) {
    const strResult = event.srcElement.value ? event.srcElement.value : event.srcElement.innerText;
    if ((this.form.get('addInstructionRepAll').value === 'N') && (key !== null || key !== undefined)) {
      this.form.get(key).setValue(strResult);
    } else {
      this.form.get(this.repAllTextAreaKey).setValue(strResult);
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.patchFieldParameters(this.form.get(this.element), { isNarrativeAmended: false });
      for (let i = 0; i < this.addInstructioncounter; i++) {
        const narrativeTextValue = this.form.get('addInstructionAmendEditTextArea' + i).value;
        if (narrativeTextValue !== '') {
          this.patchFieldParameters(this.form.get(this.element), { isNarrativeAmended: true });
          break;
        }
      }
    }
    this.narrativeService.totalCountValidationAmend(key, this.form, this.totalNarrativeCount, this.stateService, this.additionalInsLen);
    this.ngOnDestroy();
  }

  onClickAddInstructionAmendEditTextArea(event, key) {
    this.patchFieldParameters(this.form.get(this.element), { isNarrativeAmended: false });
    this.form.removeControl(key);
    this.totalNarrativeCount = this.narrativeService.getTotalAmendNarrativeCount(
      this.amendEditSection,
      this.amendEditsubSection,
      this.form,
      this.amendEditTextAreaKey,
      this.addInstructioncounter
    );

    this.narrativeService.additionalInfoSubjectAmend.next(this.totalNarrativeCount);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      for (let i = 0; i < this.addInstructioncounter; i++) {
        if (this.form.get('addInstructionAmendEditTextArea' + i) !== null &&
        this.form.get('addInstructionAmendEditTextArea' + i) !== undefined) {
        const narrativeTextValue = this.form.get('addInstructionAmendEditTextArea' + i).value;
        if (narrativeTextValue !== '') {
          this.patchFieldParameters(this.form.get(this.element), { isNarrativeAmended: true });
          break;
        }
      }
      }
    }
    this.form.get(FccGlobalConstant.NAR_TAB_CONTROL_ADD_INSTN_AMD_OPT).setValue(null);
    this.narrativeService.totalCountValidationAmend(key, this.form, this.totalNarrativeCount, this.stateService, this.additionalInsLen);
  }

  onClickAddInstructionRepAll(isDraftDataPopulated: boolean = false) {
    if (this.form.get('addInstructionRepAll').value === 'Y') {
      for (let i = 0 ; i < this.addInstructioncounter ; i++) {
        if (this.form.get(this.amendEditTextAreaKey + i)) {
        this.onClickAddInstructionAmendEditTextArea(null, this.amendEditTextAreaKey + i);
        this.addInstructioncounter++;
        }
      }
      this.textAreaCount = 0;
      this.addInstructioncounter = 0;
      const fieldObj1 = this.amendHistoryHeaderJsonObject(this.form.get('addInstructionAmendHistoryHeader'));
      this.form.removeControl('addInstructionAmendHistoryHeader');
      const fieldObj2 = this.narrativeService.narrativeExpansionPanelJsonObject(
        this.form.get('addInstructionAmendmentPanel'));
      this.form.removeControl('addInstructionAmendmentPanel');
      this.form.get('addInstructionAmendOptions')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(this.amendEditTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(this.amendEditTextAreaKey).setValue(null);
      const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
        this.form.get(this.amendEditTextAreaKey));
      this.form.addControl(this.repAllTextAreaKey, this.formControlService.getControl(fieldObj));
      this.form.get(this.repAllTextAreaKey)[FccGlobalConstant.KEY] = this.repAllTextAreaKey;
      this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
      this.form.addControl('addInstructionAmendHistoryHeader', this.formControlService.getControl(fieldObj1));
      this.form.addControl('addInstructionAmendmentPanel', this.formControlService.getControl(fieldObj2));
      this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.START] = 'Repall';
      if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators(this.repAllTextAreaKey, Validators.pattern(this.swiftZCharRegex), 0);
      }
      this.addInstructioncounter++;
      if (this.mode ===FccGlobalConstant.DRAFT_OPTION && isDraftDataPopulated) {
        this.form.get(this.repAllTextAreaKey).setValue(JSON.parse(this.form.get('addInstAmendEditTextAreaRead').value).text);
      }
    } else {
      this.setValuesForRepallNo();
    }
  }

  amendFormFields() {
    this.form.get(this.element)[this.params][this.swift] = true;
    this.form.get(this.element)[this.params][this.readonly] = true;
    this.form.get(this.element)[FccGlobalConstant.PARAMS][FccGlobalConstant.ROWS] = FccGlobalConstant.LENGTH_4;
    if (this.form.get('addInstructionAmendmentPanel')[this.params]) {
      this.form.get('addInstructionAmendmentPanel')[this.params][this.openAllSvg] = this.openAllSvgPath;
      this.form.get('addInstructionAmendmentPanel')[this.params][this.closeAllSvg] = this.closeAllSvgPath;
    }
    this.mandatoryFields = [this.element];
    this.setMandatoryFields(this.form, this.mandatoryFields, false);
    this.form.get(this.element).updateValueAndValidity();
    if (this.form.get(this.amendEditTextAreaKey).value && this.form.get(this.amendEditTextAreaKey).value.items) {
      this.addInstructioncounter = this.form.get(this.amendEditTextAreaKey).value.items.length;
    }
    this.form.get('addInstructionRepAll')[this.params][FccGlobalConstant.PREVIOUSCOMPAREVALUE] = undefined;
  }

  ngOnDestroy() {
    if (this.commonService.isnonEMptyString(this.form.get('addInstAmendEditTextAreaRead').value)) {
      if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.mode === FccGlobalConstant.DRAFT_OPTION &&
        ((this.addInstructioncounter === this.lcConstant.zero && this.form.get('addInstAmendEditTextAreaRead').value.includes('REPALL'))
        || this.addInstructioncounter === this.lcConstant.zero)
        ){
          const addInstAmendEditTextAreaRead = this.form.get('addInstAmendEditTextAreaRead').value.includes('\n') ?
          JSON.parse((this.form.get('addInstAmendEditTextAreaRead').value).replace(/\n/g, '\\n')) :
          JSON.parse(this.form.get('addInstAmendEditTextAreaRead').value);
          let addInstAmendEditTextAreaReadCount = addInstAmendEditTextAreaRead.length;
          if (addInstAmendEditTextAreaRead.verb === 'REPALL' || addInstAmendEditTextAreaRead.verb === 'ADD' ||
           addInstAmendEditTextAreaRead.verb === 'DELETE') {
            addInstAmendEditTextAreaReadCount = 1;
          }
          for (let i = 0; i < addInstAmendEditTextAreaReadCount; i++) {
          const newKeyName = this.amendEditTextAreaKey + i ;
          const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
            this.form.get(this.amendEditTextAreaKey));
          this.form.addControl(newKeyName, this.formControlService.getControl(fieldObj));
          this.form.get(newKeyName)[FccGlobalConstant.KEY] = newKeyName;
          this.form.get(newKeyName)[this.params][FccGlobalConstant.RENDERED] = true;
          this.form.get(newKeyName)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
          if (addInstAmendEditTextAreaReadCount === 1) {
            this.form.get(newKeyName).setValue(addInstAmendEditTextAreaRead.text);
            if (addInstAmendEditTextAreaRead.verb === 'ADD') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Add';
            }
            else if (addInstAmendEditTextAreaRead.verb === 'DELETE') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Delete';
            } else {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Repall';
              this.form.get('addInstructionRepAll').setValue('Y');
            }
          } else {
            this.form.get(newKeyName).setValue(addInstAmendEditTextAreaRead[i].text);
            if (addInstAmendEditTextAreaRead[i].verb === 'ADD') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Add';
            }
            if (addInstAmendEditTextAreaRead[i].verb === 'DELETE') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Delete';
            }
          }
          }
          const arraySet: {items: any} = {
            items: []
          };
          this.form.get(this.amendEditTextAreaKey).setValue(arraySet);
          let tempCounter = 0;
          for (let i = 0; i < addInstAmendEditTextAreaReadCount; i++) {
            const narrativeTextValue = this.form.get(this.amendEditTextAreaKey + i).value;
            this.currentVerbCode = addInstAmendEditTextAreaReadCount === 1 ? addInstAmendEditTextAreaRead.verb
             : addInstAmendEditTextAreaRead[i].verb;
            if (narrativeTextValue === '') {
              if (this.currentVerbCode === 'Repall') {
                this.form.get('addInstructionRepAll').setValue('N');
                this.setValuesForRepallNo();
              } else {
                this.form.removeControl(this.amendEditTextAreaKey + i);
              }
            } else {
              if (this.currentVerbCode === 'Repall') {
                this.form.get('addInstructionRepAll').setValue('Y');
              }
              const jsonVal = { verb: String, text: String };
              jsonVal.verb = this.currentVerbCode.toLowerCase();
              jsonVal.text = narrativeTextValue;
              this.form.get(this.amendEditTextAreaKey).value[FccGlobalConstant.ITEMS].push(jsonVal);
              tempCounter++;
            }
        }
          this.addInstructioncounter = tempCounter;
      }
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.addInstructioncounter > this.lcConstant.zero) {
      const arraySet: {items: any} = {
        items: []
      };
      this.form.get(this.amendEditTextAreaKey).setValue(arraySet);
      let tempCounter = 0;
      for (let i = 0; i < this.addInstructioncounter; i++) {
        if (this.commonService.isNonEmptyField(this.amendEditTextAreaKey + i, this.form)) {
        const narrativeTextValue = this.form.get(this.amendEditTextAreaKey + i).value;
        const verbCode = this.form.get(this.amendEditTextAreaKey + i)[this.params][FccGlobalConstant.START];
        if (narrativeTextValue === '') {
          if (verbCode === 'Repall') {
            this.form.get('addInstructionRepAll').setValue('N');
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
      this.addInstructioncounter = tempCounter;
      if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.addInstructioncounter === 0) {
        this.form.get('addInstAmendEditTextAreaRead').setValue(null);
      }
    }
    this.parentForm.controls[this.controlName] = this.form;
  }

  onClickPhraseIcon(event, key) {
    this.entityName = this.stateService.getSectionData(FccGlobalConstant.APPLICANT_BENEFICIARY).get('applicantEntity').value.shortName;
    if (this.entityName !== '' && this.entityName !== undefined) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LC, key, '03', false, this.entityName);
    } else {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LC, key, '03', false);
    }
  }

  setValuesForRepallNo() {
    this.form.get('addInstructionAmendOptions')[this.params][FccGlobalConstant.RENDERED] = true;
    this.form.get(this.amendEditTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
    this.form.get(this.amendEditTextAreaKey).setValue(null);
    this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
    this.form.get(this.repAllTextAreaKey).setValue(null);
    if (this.form.get(this.repAllTextAreaKey)) {
      this.onClickAddInstructionAmendEditTextArea(null, this.repAllTextAreaKey);
    }
  }
}
