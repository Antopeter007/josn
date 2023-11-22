import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FCCBase } from './../../../base/model/fcc-base';
import { FCCFormGroup } from './../../../base/model/fcc-control.model';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { ProductParams } from '../../model/params-model';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { MultiBankService } from '../../services/multi-bank.service';
import { CodeData } from '../../model/codeData';
import { Validators } from '@angular/forms';
import { FccTradeFieldConstants } from '../../../corporate/trade/common/fcc-trade-field-constants';
import { LcConstant } from '../../../corporate/trade/lc/common/model/constant';
import { HOST_COMPONENT } from '../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { duplicatePhraseAbbvName } from '../../../corporate/trade/lc/initiation/validator/validateAbbvName';

@Component({
  selector: 'fcc-new-phrase',
  templateUrl: '../../../base/model/form.render.html',
  styleUrls: ['./new-phrase.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: NewPhraseComponent }]
})
export class NewPhraseComponent extends FCCBase implements OnInit {
  form: FCCFormGroup;
  module = '';
  options = 'options';
  entities: any;
  productCode: any;
  codeData = new CodeData();
  phraseCategories: any;
  phraseTypes: any;
  paramDataList: any[] = [];
  contentRegex: any;
  blacklistRegex: any;
  phraseProductsForStatic: any[] = [];
  phraseProductsForDynamic: any[] = [];
  formData = new Map();
  phraseAddField: any[] = [];

  @Output()
  phraseCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  phraseSave: EventEmitter<any> = new EventEmitter<any>();
  lcConstant = new LcConstant();
  constructor(protected translateService: TranslateService, protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected formControlService: FormControlService,
              protected multiBankService: MultiBankService) {
    super();
  }

  ngOnInit(): void {
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.contentRegex = response.swiftZChar;
        this.blacklistRegex = response.blacklistSpecialcharRegex;
      }
    });
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    const refModel = FccTradeFieldConstants.PHRASE_MODEL;
    const params: ProductParams = {
      type: FccGlobalConstant.MODEL_SUBSECTION
    };
    this.commonService.getProductModel(params).subscribe(
      response => {
        const dialogmodel = JSON.parse(JSON.stringify(response[refModel]));
        this.form = this.formControlService.getFormControls(dialogmodel);
        this.getUserEntities();
        if (this.productCode === FccGlobalConstant.PRODUCT_LC || this.productCode === FccGlobalConstant.PRODUCT_SI) {
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PHRASE_TYPE), { rendered: true, required: true });
          this.patchFieldParameters(
            this.form.get(FccTradeFieldConstants.PHRASE_PRODUCT),
            { rendered: true, disabled: true, required: true }
          );
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PHRASE_CATEGORY),
            { rendered: true, disabled: true, required: true });
          this.getProductListForPhrases();
          this.getPhraseTypes();
        }
        this.form.addFCCValidators(FccTradeFieldConstants.PHRASE_CONTENT_STATIC,
            Validators.compose([Validators.pattern(this.contentRegex)]), 0);
        this.form.addFCCValidators(FccTradeFieldConstants.PHRASE_DESCRIPTION,
            Validators.compose([Validators.required, Validators.pattern(this.contentRegex)]), 0);
        this.form.addFCCValidators(FccTradeFieldConstants.PHRASE_ABBV_NAME,
          Validators.compose([Validators.required, Validators.pattern(FccGlobalConstant.SPACE_REGEX)]), 0);
        const language = localStorage.getItem(FccGlobalConstant.LANGUAGE);
        if (language === FccGlobalConstant.LANGUAGE_FR){
          this.form.get(FccTradeFieldConstants.PHRASE_CANCEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.PARENT_STYLE_CLASS] =
          this.form.get(FccTradeFieldConstants.PHRASE_CANCEL)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.PARENT_STYLE_CLASS
          ] + " phraseCancelButtonfr";
        }
        if (language === FccGlobalConstant.LANGUAGE_AR){
          this.form.get(FccTradeFieldConstants.PHRASE_CANCEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.PARENT_STYLE_CLASS] =
          this.form.get(FccTradeFieldConstants.PHRASE_CANCEL)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.PARENT_STYLE_CLASS
          ] + " phraseCancelButtonAr";
        }
      });
    this.setHtmlContent();
    this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = '';

    // this.form.statusChanges.subscribe(
    //   status => {
    //     if (status === FccGlobalConstant.VALID) {
    //       this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PHRASE_SAVE), { btndisable: false });
    //     } else {
    //       this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PHRASE_SAVE), { btndisable: true });
    //     }
    //   }
    // );
  }

   onClickPhraseCancel(){
     this.phraseCancel.emit();
   }


   xmlEncode(input)
  {
    if (input)
    {
      input	= input.trim();
      let replaceWith	=	'&amp;';
      input = input.replace(/&/g,	replaceWith);
      replaceWith =	'&lt;';
      input = input.replace(/</g,	replaceWith);
      replaceWith		=	'&gt;';
      input 			= 	input.replace(/>/g,	replaceWith);
      replaceWith		=	'&apos;';
      input 			= 	input.replace(/'/g,	replaceWith);
      replaceWith		=	'&quot;';
      input 			= 	input.replace(/"/g,	replaceWith);

      return input;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onKeypressEditor(event){
    this.disablePhraseContentError();
  }

  onKeyupPhraseContentStatic(){
    this.disablePhraseContentError();
  }

  disablePhraseContentError(){
    if(this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_DYNAMIC).value !== FccGlobalConstant.EMPTY_STRING){
      this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = '';
    }
  }

  onClickSave(){
    const errorMsg = `${this.translateService.instant('errorTitle')}: `+ `${this.translateService.instant('EmptyPhraseContent')}`;
    if (this.form.get(FccTradeFieldConstants.PHRASE_TYPE).value.value === FccGlobalConstant.CODE_DYNAMIC_PHRASE
          && (document.getElementById('editor')?.children?.length === 0 &&
          document.getElementById('editor').textContent === FccGlobalConstant.EMPTY_STRING)){
        this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = errorMsg;
    } else if (this.form.get(FccTradeFieldConstants.PHRASE_TYPE).value.value === FccGlobalConstant.CODE_STATIC_PHRASE
              && this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_STATIC).value == FccGlobalConstant.EMPTY_STRING){
        this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = errorMsg;
    } else if (this.form.get(FccTradeFieldConstants.PHRASE_TYPE) && 
    this.form.get(FccTradeFieldConstants.PHRASE_TYPE).value.value !== FccGlobalConstant.CODE_DYNAMIC_PHRASE && 
    this.form.get('phraseContentStatic') && (this.form.get('phraseContentStatic').value === FccGlobalConstant.EMPTY_STRING ||
      this.form.get('phraseContentStatic').value === 'undefined' )){
        this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = errorMsg;
    }
      else if (this.validateAllFields(this.form)) {
      this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = '';
      this.formData.set('entityShortName', this.form.get(FccTradeFieldConstants.PHRASE_ENTITY).value.value);
      this.formData.set('name', this.form.get(FccTradeFieldConstants.PHRASE_ABBV_NAME).value);
      this.formData.set('description', this.form.get(FccTradeFieldConstants.PHRASE_DESCRIPTION).value);
      if (this.form.get(FccTradeFieldConstants.PHRASE_TYPE).value.value === FccGlobalConstant.CODE_DYNAMIC_PHRASE){
        const data = this.xmlEncode(this.htmlContent);
        this.formData.set('content', data);
      } else {
        this.formData.set('content', this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_STATIC).value);
      }

      if (this.productCode === FccGlobalConstant.PRODUCT_LC || this.productCode === FccGlobalConstant.PRODUCT_SI) {
        this.formData.set('type', this.form.get(FccTradeFieldConstants.PHRASE_TYPE).value.value);
        this.formData.set('product', this.form.get(FccTradeFieldConstants.PHRASE_PRODUCT).value.value);
        this.formData.set('category', this.form.get(FccTradeFieldConstants.PHRASE_CATEGORY).value.value);
      } else {
        this.formData.set('type', FccGlobalConstant.CODE_STATIC_PHRASE);
        this.formData.set('product', this.productCode);
        this.formData.set('category', FccGlobalConstant.DEFAULT_CATEGORY);
      }
      this.commonService.savePhrases(this.formData).subscribe(response => {
        if (response) {
          this.phraseSave.emit();
        }
      }, error => {
        if (error && error.status === FccGlobalConstant.STATUS_401){
          const startIndex = this.blacklistRegex.indexOf("[");
          const endIndex = this.blacklistRegex.lastIndexOf("^]");
          const swiftRegex = `${this.translateService.instant('blacklistedCharsRegex', 
          { validSwiftRegex: this.blacklistRegex.substr(startIndex+1, endIndex-1) })}`;
          this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = swiftRegex;
        }
      });
    }
  }

   onBlurPhraseAbbvName(){
    const abbvName = this.form.get(FccTradeFieldConstants.PHRASE_ABBV_NAME).value;
    this.commonService.checkPhraseAbbvName(abbvName).subscribe(response => {
      if (response.body) {
        this.form.get(FccTradeFieldConstants.PHRASE_ABBV_NAME).setValidators([duplicatePhraseAbbvName]);
        this.form.get(FccTradeFieldConstants.PHRASE_ABBV_NAME).setErrors({ duplicatePhraseAbbvName : true });
        this.form.get(FccTradeFieldConstants.PHRASE_ABBV_NAME).markAsDirty();
        this.form.get(FccTradeFieldConstants.PHRASE_ABBV_NAME).updateValueAndValidity();
        return;
       }
       else
       {
        this.form.get(FccTradeFieldConstants.PHRASE_ABBV_NAME).setErrors(null);
        this.form.get(FccTradeFieldConstants.PHRASE_ABBV_NAME).clearValidators();
       }
    });
    this.spaceValidation(FccTradeFieldConstants.PHRASE_ABBV_NAME);
    this.form.get(FccTradeFieldConstants.PHRASE_ABBV_NAME).setValue(this.form.get(FccTradeFieldConstants.PHRASE_ABBV_NAME).value.trim());
   }

   onBlurPhraseDescription(){
    this.spaceValidation(FccTradeFieldConstants.PHRASE_DESCRIPTION);
  }

   spaceValidation(control: any){
    const abbvValue = this.form.get(control).value;
    if (abbvValue.trim().length === FccGlobalConstant.ZERO){
     this.form.get(control).setErrors({ required: true });
     this.form.get(control).setValue(null);
    }
   }


    getUserEntities() {
      const elementId = FccTradeFieldConstants.PHRASE_ENTITY;
      const elementValue = this.form.get(elementId).value;
      const nonEntity = {
        label: FccGlobalConstant.ENTITY_DEFAULT,
        value: {
          label: FccGlobalConstant.ENTITY_DEFAULT,
          value: FccGlobalConstant.ENTITY_DEFAULT,
          name: FccGlobalConstant.ENTITY_DEFAULT
        }
      };
      if (elementValue.length === 0) {
            let entityDataArray = [];
            if (this.form.get(elementId)[this.options].length === 0 ) {
            this.commonService.getFormValues(this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.userEntities)
              .subscribe(result => {
                result.body.items.forEach(value => {
                  const entity: { label: string; value: any } = {
                    label: value.shortName,
                    value: {
                      label: value.shortName,
                      value: value.shortName,
                      name: value.name
                    }
                  };
                  entityDataArray.push(entity);
                });
                entityDataArray = this.changeToAlphabeticalOrder(entityDataArray);
                this.patchFieldParameters(this.form.get(elementId), { options: entityDataArray });
                if (entityDataArray.length === 1) {
                  this.form.get(elementId).setValue(entityDataArray[0].value);
                  this.form.get(elementId).updateValueAndValidity();
                } else if (entityDataArray.length === 0) {
                  this.form.get(elementId).setValue(nonEntity.value);
                  this.patchFieldParameters(this.form.get(elementId), { rendered: false });
                  this.form.get(elementId).updateValueAndValidity();
                } else {
                  this.form.get(elementId).updateValueAndValidity();
                }
              });
            }
          }
    }

    onClickPhraseType() {
      this.setHtmlContent();
      const phraseTypeVal = this.form.get(FccTradeFieldConstants.PHRASE_TYPE).value;
      if (phraseTypeVal.value === FccGlobalConstant.CODE_DYNAMIC_PHRASE){
        this.patchFieldValueAndParameters(this.form.get(FccTradeFieldConstants.PHRASE_DYNAMIC_COLUMN), '', { rendered: false });
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_DYNAMIC), { rendered: true });
        this.patchFieldValueAndParameters(this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_STATIC), '', { rendered: false });
        this.patchFieldValueAndParameters(this.form.get(FccTradeFieldConstants.PHRASE_PRODUCT), '', { disabled: false,
           options: this.phraseProductsForDynamic });
        this.patchFieldValueAndParameters(this.form.get(FccTradeFieldConstants.PHRASE_CATEGORY), '', { disabled: true });
      }
      if (phraseTypeVal.value === FccGlobalConstant.CODE_STATIC_PHRASE) {
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PHRASE_DYNAMIC_COLUMN), { rendered: false, disabled: true });
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_DYNAMIC), { rendered: false });
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_STATIC), { rendered: true });
        this.patchFieldValueAndParameters(this.form.get(FccTradeFieldConstants.PHRASE_PRODUCT), '', { disabled: false,
          options: this.phraseProductsForStatic });
        this.patchFieldValueAndParameters(this.form.get(FccTradeFieldConstants.PHRASE_CATEGORY), '', { disabled: true });
      }
    }

    setHtmlContent() {
      const htmlContentData = '<a/>';
      this.htmlContent += htmlContentData;
    }

    validateAllFields(form: FCCFormGroup): boolean {
      form.markAllAsTouched();
      let isValid = false;
      if (this.form.get(FccTradeFieldConstants.PHRASE_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === true &&
      this.form.get(FccTradeFieldConstants.PHRASE_TYPE).value.value === FccGlobalConstant.CODE_DYNAMIC_PHRASE ) {
          if (this.form.valid && this.htmlContent !== '') {
              isValid = true;
          }
      } else {
        if (this.form.valid && this.commonService.isNonEmptyValue(this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_STATIC))
        && this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_STATIC).value !== '' &&
        this.commonService.isNonEmptyValue(this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_STATIC).value)) {
          isValid = true;
        }
        }
      return isValid;
    }

    onClickPhraseProduct(){
      const phraseProductVal = this.form.get(FccTradeFieldConstants.PHRASE_PRODUCT).value;
      const phraseTypeVal = this.form.get(FccTradeFieldConstants.PHRASE_TYPE).value;
      if (phraseProductVal) {
        this.phraseCategories = [];
        this.htmlContent = '';
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PHRASE_CATEGORY), { disabled: false });
        this.getPhraseCategories(phraseProductVal.value);
        if (phraseTypeVal.value === FccGlobalConstant.CODE_DYNAMIC_PHRASE) {
          this.commonService.getDynamicPhraseAddFieldData(phraseProductVal.value).subscribe(response => {
            if (response && response.body && response.body.phrasesAddFieldData) {
              this.phraseAddField = [];
              response.body.phrasesAddFieldData.forEach(value => {
                const column: { label: string; value: any } = {
                  label: this.commonService.decodeHtml(value.localizedFieldName),
                  value: {
                    label: this.commonService.decodeHtml(value.localizedFieldName),
                    columnId: value.fieldId,
                    fieldType: value.fieldType
                  }
                };
                this.phraseAddField.push(column);
              });
              this.patchFieldValueAndParameters(this.form.get(FccTradeFieldConstants.PHRASE_DYNAMIC_COLUMN), '',
              { rendered: true,
                disabled: false,
                options: this.phraseAddField
              });
              this.phraseAddField = [];
            }
          });
        }
      }
    }

    onClickDynamicPhraseColumns(){
      const localizedVal = this.form.get(FccTradeFieldConstants.PHRASE_DYNAMIC_COLUMN).value.label;
      const columnName = this.form.get(FccTradeFieldConstants.PHRASE_DYNAMIC_COLUMN).value.columnId;
      const fieldType = this.form.get(FccTradeFieldConstants.PHRASE_DYNAMIC_COLUMN).value.fieldType;
      this.form.get(FccTradeFieldConstants.PHRASE_DYNAMIC_COLUMN).setValue(null);
      if (localizedVal && columnName) {
        const htmlContentData =
        '<input role="textbox" class="rte-editor-product-field" disabled="disabled" field-type="' +
         fieldType + '" id="';
        const htmlContentData1 = htmlContentData + columnName + '" type="button" value="{ ' + localizedVal + ' }" />';
        this.htmlContent += htmlContentData1;
        this.form.get(FccTradeFieldConstants.PHRASE_CONTENT_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = '';
      }
    }

    async getPhraseCategories(productCode: any) {
      this.phraseCategories = [];
      this.codeData.codeId = FccGlobalConstant.CODEDATA_EVENT_TYPE_C048;
      this.codeData.productCode = productCode;
      this.codeData.subProductCode = '';
      this.codeData.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
      localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
      await this.commonService.getCodeDataDetails(this.codeData).toPromise().then(response => {
        response.body.items.forEach(responseValue => {
                this.phraseCategories.push(
                  {
                    label: this.commonService.decodeHtml(responseValue.longDesc),
                    value: {
                      label: this.commonService.decodeHtml(responseValue.longDesc),
                      value: responseValue.value
                    }
                  }
                );
              });
        this.phraseCategories = this.changeToAlphabeticalOrder(this.phraseCategories);
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PHRASE_CATEGORY), { options: this.phraseCategories });
          /**
           * If there is only one pricing option associated with the selected facility set
           * this as default selected in the select box
           */
        if (this.phraseCategories.length === 1) {
          this.form.get(FccTradeFieldConstants.PHRASE_CATEGORY).setValue(this.phraseCategories[0].value);
          this.form.get(FccTradeFieldConstants.PHRASE_CATEGORY).updateValueAndValidity();
        } else {
          this.form.get(FccTradeFieldConstants.PHRASE_CATEGORY).updateValueAndValidity();
        }
        this.phraseCategories = [];
      });
      this.form.updateValueAndValidity();
    }


    getPhraseTypes() {
      this.phraseTypes = [];
      let flag = true;
      this.codeData.codeId = FccGlobalConstant.CODEDATA_EVENT_TYPE_C047;
      this.codeData.productCode = this.productCode;
      this.codeData.subProductCode = '';
      this.codeData.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
      localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
      this.commonService.getCodeDataDetails(this.codeData).subscribe(response => {
        response.body.items.forEach(responseValue => {
                if (responseValue.value === FccGlobalConstant.CODE_DYNAMIC_PHRASE &&
                  !this.commonService.getUserPermissionFlag(FccGlobalConstant.DYNAMIC_PHRASE_PERMISSION)) {
                  flag = false;
                } else {
                  flag = true;
                }
                if (flag) {
                  this.phraseTypes.push(
                    {
                      label: this.commonService.decodeHtml(responseValue.longDesc),
                      value: {
                        label: this.commonService.decodeHtml(responseValue.longDesc),
                        value: responseValue.value
                      }
                    }
                  );
                }
              });
          });
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.PHRASE_TYPE), { options: this.phraseTypes });
        /**
         * If there is only one pricing option associated with the selected facility set
         * this as default selected in the select box
         */
      if (this.phraseTypes.length === 1) {
        this.form.get(FccTradeFieldConstants.PHRASE_TYPE).setValue(this.phraseTypes[0].value);
        this.onClickPhraseType();
        this.form.get(FccTradeFieldConstants.PHRASE_TYPE).updateValueAndValidity();
      } else {
        this.form.get(FccTradeFieldConstants.PHRASE_TYPE).updateValueAndValidity();
      }
      this.form.updateValueAndValidity();
    }


    getProductListForPhrases() {
      this.commonService.getPhraseProductDetails().subscribe(response => {
        if (response) {
         if (response.body.phrasesProducts[0].type === FccGlobalConstant.CODE_STATIC_PHRASE) {
          this.phraseProductsForStatic = this.iterateProducts(response, 0);
         }
         if (response.body.phrasesProducts[1].type === FccGlobalConstant.CODE_DYNAMIC_PHRASE) {
          this.phraseProductsForDynamic = this.iterateProducts(response, 1);
         }
        }
      });
    }


    iterateProducts(response: any, productIndex: any){
      let phraseProducts = [];
      response.body.phrasesProducts[productIndex].product_code.forEach(responseValue => {
        phraseProducts.push(
          {
            label: `${this.translateService.instant(responseValue)}`,
            value: {
              label: `${this.translateService.instant(responseValue)}`,
              value: responseValue
            }
          }
        );
      });
      phraseProducts = this.changeToAlphabeticalOrder(phraseProducts);
      return phraseProducts;
    }



    changeToAlphabeticalOrder(dropdownList: any){
      dropdownList.sort((a, b) => {
        const x = a.label.toLowerCase();
        const y = b.label.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
      });
      return dropdownList;
    }

    onKeyupPhraseType(event) {
      const keycodeIs = event.which || event.keyCode;
      if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty || keycodeIs === this.lcConstant.thirtyTwo) {
        this.onClickPhraseType();
      }
    }

    onKeyupPhraseProduct(event) {
      const keycodeIs = event.which || event.keyCode;
      if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty || keycodeIs === this.lcConstant.thirtyTwo) {
        this.onClickPhraseProduct();
      }
    }
}
