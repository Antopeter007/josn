import { FccGlobalConstant } from './../core/fcc-global-constants';
import { EventEmitter, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../common/services/common.service';
import { SearchLayoutService } from './search-layout.service';
import { BehaviorSubject } from 'rxjs';
import { LcConstant } from './../../../app/corporate/trade/lc/common/model/constant';
import { NarrativeService } from './../../../app/corporate/trade/lc/initiation/services/narrative.service';
import { ProductMappingService } from './productMapping.service';
import { ResolverService } from './resolver.service';
import { FCCBase } from '../../base/model/fcc-base';

@Injectable({
  providedIn: 'root'
})
export class PhrasesService extends FCCBase {

  response: string;
  phrasesResponse: any;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  phraseText;
  subProductCode = '';
  payloadObject: any;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  productComponent = new BehaviorSubject(false);
  requestBuild$ = new EventEmitter(null);
  newPhrasesAdded = new BehaviorSubject(false);


  constructor(protected commonService: CommonService, protected translateService: TranslateService,
              protected searchLayoutService: SearchLayoutService, protected narrativeService: NarrativeService,
              protected productMappingService: ProductMappingService, protected resolverService: ResolverService) {
    super();
  }

  getPhrasesDetails(form: any, productCode: string, phraseField: any, phraseCode?: string, updateCounter = true, entityName?: string) {
      const data = { form, productCode, phraseField, phraseCode, updateCounter, entityName };
      this.requestBuild$.emit(data);

  }

  fetchPhrasesDetails(form: any, productCode: string, phraseField: any, phraseCode?: string, updateCounter = true, entityName?: string) {
    if (this.phrasesResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.phrasesResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
    const phraseId = 'phraseId';
    const header = `${this.translateService.instant('listOfPhrases')}`;
    const obj = {};
    obj[FccGlobalConstant.PRODUCT] = '';
    obj[FccGlobalConstant.OPTION] = FccGlobalConstant.PHRASES;
    obj[FccGlobalConstant.SUB_PRODUCT_CODE] = '';
    obj[FccGlobalConstant.BUTTONS] = false;
    obj[FccGlobalConstant.SAVED_LIST] = false;
    obj[FccGlobalConstant.HEADER_DISPLAY] = false;
    obj[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] = false;
    obj[FccGlobalConstant.FILTER_PARAMS_REQUIRED] = true;
    const productCodeValue = {};
    productCodeValue[FccGlobalConstant.PRODUCTCODE] = productCode.concat('|*');
    if (phraseCode !== undefined && phraseCode !== null && phraseCode !== '') {
      productCodeValue[FccGlobalConstant.CATEGORY] = phraseCode.concat('|99');
    } else {
      productCodeValue[FccGlobalConstant.CATEGORY] = FccGlobalConstant.PHRASES_CODE_WILDCARD;
    }
    if (entityName !== undefined && entityName !== null && entityName !== '') {
      productCodeValue[FccGlobalConstant.ENTITY] = entityName.concat('|*');
    }
    obj[FccGlobalConstant.FILTER_PARAMS] = productCodeValue;
    const urlOption = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    if (urlOption && urlOption === FccGlobalConstant.TEMPLATE) {
      const templateCreation = 'templateCreation';
      obj[templateCreation] = true;
    }

    this.resolverService.getSearchData(header, obj);
    this.phrasesResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((otherInformation) => {
      if (otherInformation !== null) {
        if (otherInformation.responseData.PHRASE_TYPE === '02') {
          this.productMappingService.getApiModel(productCode, this.subProductCode).subscribe(() => {
            const requestObj = this.payloadObject;
            requestObj[phraseId] = otherInformation.responseData.PHRASE_ID;
            // removing template_description from requestObj, if its not template save/submit scenario.
            if ( urlOption && urlOption === FccGlobalConstant.TEMPLATE ) {
              const templateDescription = 'template_description';
              delete requestObj.transaction[templateDescription];
            }
            this.commonService.fetchDynamicPhrases(requestObj).subscribe(res => {
              if (res.status === FccGlobalConstant.LENGTH_200) {
                this.phraseText = res.body.dynamicPhrasesMessage;
                this.patchValuetoField(form, phraseField, updateCounter);
              }
            });
          });
        } else {
          this.phraseText = otherInformation.responseData.TEXT;
          this.patchValuetoField(form, phraseField, updateCounter);
          if (tnxTypeCode === FccGlobalConstant.N002_AMEND && subTnxTypeCode !== FccGlobalConstant.N003_AMEND_RELEASE) {
          this.addAmendLabelIcon(form.get(phraseField), form.controls);
          }
        }
      }
    });
  }
  updateNarrativeCount(form: any, key: string) {
    if (form.get(key).value) {
      const count = this.commonService.counterOfPopulatedData(form.get(key).value);
      form.get(key)[this.params][this.enteredCharCount] = count;
    }
  }

  updateFieldCount(form: any, key: string) {
    const count = this.commonService.counterOfPopulatedData(form.get(key).value);
    if (key === 'descOfGoodsText') {
      this.narrativeService.descriptionOfGoodsSubject.next(count);
    } else if (key === 'docRequiredText') {
      this.narrativeService.documentReqSubject.next(count);
    } else if (key === 'splPaymentBeneText') {
      this.narrativeService.specialBeneSubject.next(count);
    } else if (key === 'additionalInfoSubject') {
      this.narrativeService.additionalInfoSubject.next(count);
    }
  }


  patchValuetoField(form: any, key: string, updateCounter: boolean) {
    const displayValue = this.commonService.replacePhraseText(this.phraseText);
    const decodedValue = this.commonService.decodeHtml(displayValue);
    let formValue = '';
    formValue = form.get(key).value ? form.get(key).value : '';
    form.get(key).patchValue(formValue.concat(decodedValue));
    if (updateCounter) {
      this.updateNarrativeCount(form, key);
    } else {
      this.updateFieldCount(form, key);
    }
    if (form) {
      const count = form.get(key)['params']['enteredCharCount'];
      const maxLimit = form.get(key)['params']['allowedCharCount'];
      if (count > maxLimit){
      const validationError = {
        maxlength: { actualLength: count, requiredLength: maxLimit } };
      form.addFCCValidators(key, Validators.compose([() =>validationError]), 0);
      form.get(key).markAsDirty();
      form.get(key).markAsTouched();
    } else{
      form.get(key).clearValidators();
      form.get(key).setErrors('');
    }
   }
    form.get(key).updateValueAndValidity();
    form.updateValueAndValidity();
    this.newPhrasesAdded.next(true);
  }



}
