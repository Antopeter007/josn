import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { FormControlService } from './form-control.service';
import { CommonService } from './../../../../../common/services/common.service';
import { LcConstant } from '../../common/model/constant';
import { compareCumulativeNarrativeFieldCount, compareIndividualFieldCount } from '../validator/ValidateNarratives';
import { Validators } from '@angular/forms';
import { FccBusinessConstantsService } from './../../../../../common/core/fcc-business-constants.service';
import { FccTradeFieldConstants } from '../../../common/fcc-trade-field-constants';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class NarrativeService {
  descriptionOfGoodsSubject = new ReplaySubject<string>();
  documentReqSubject = new ReplaySubject<string>();
  additionalInfoSubject = new ReplaySubject<string>();
  specialBeneSubject = new ReplaySubject<string>();
  descriptionOfGoodsSubjectAmend = new ReplaySubject<string>();
  documentReqSubjectAmend = new ReplaySubject<string>();
  additionalInfoSubjectAmend = new ReplaySubject<string>();
  specialBeneSubjectAmend = new ReplaySubject<string>();
  callingDocReqComponent = true;
  docRequired = 'docRequired';
  swift = 'swift';
  lcConstant = new LcConstant();
  maxRowCount = this.lcConstant.maxRowCount;
  descOfGoodscounter = this.lcConstant.zero;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  mainSection = 'mainSection';
  subSection = 'subSection';
  subSectionAmendEditTextArea = 'subSectionAmendEditTextArea';
  subSectionNarrativeCount = 'subSectionNarrativeCount';
  subSectionRepall = 'subSectionRepall';
  subSectionAmendHistoryHeader = 'subSectionAmendHistoryHeader';
  subSectionAmendPanel = 'subSectionAmendPanel';
  subSectionAmendExitTextAreaRead = 'subSectionAmendExitTextAreaRead';
  subSectionAmendExitTextAreaDisplay = 'subSectionAmendExitTextAreaDisplay';
  mainTextField = 'mainTextField';
  mainText = 'mainText';
  masterData = 'masterData';
  masterDataView = 'masterDataView';
  params = this.lcConstant.params;
  mode: any;
  var: any;
  obj: any;
  narrativeDescOfGoodsDetails: any;
  additionallnstruction = 'additionallnstruction';
  descOfGoods = 'descOfGoods';
  totalOfFourSubject;
  modeOfTransmission;
  swiftExtendedNarrativeEnable: boolean;
  // ------------------>
  goodAndDocsCount;
  specialBeneCount;
  documentReqCount;
  additionalInfoCount;
  goodAndDocsCountAmend;
  specialBeneCountAmend;
  documentReqCountAmend;
  additionalInfoCountAmend;
  swiftZCharRegex: any;
  productCode: any;
  isMaster: any;
  narrativeTotalSwiftCharAmendLength = 52000;
  narrativeSwiftCharLength = 52000;
  narrativeTotalSwiftCharLength = 65000;
  narrativeNonSwiftCharLength = 6500;
  narrativeTextUndertakingAreaCount = 9750;
  narrativeUnderlyingTransactionDetailsAreaCount = 3250;
  narrativePresentationInstructionsAreaCount = 6500;
  specialBenePaymentDraftCount;
  specialBenePaymentDraftSICount;
  option: any;
  totalCountValidatonSubscription = new BehaviorSubject(null);
  errTextAreasMap = [];

  constructor(protected formControlService: FormControlService,
              protected commonService: CommonService, protected translate: TranslateService) {
  }


  setCharCount(count) {
    this.descriptionOfGoodsSubject.next(count);
  }

  public getNarrativeSwiftCharLength() {
    return this.narrativeSwiftCharLength;
  }

  public getNarrativeTotalSwiftCharAmendLength() {
    return this.narrativeTotalSwiftCharAmendLength;
  }

  public getNarrativeTotalSwiftCharLength() {
    return this.narrativeTotalSwiftCharLength;
  }

  public getNarrativeNonSwiftCharLength() {
    return this.narrativeNonSwiftCharLength;
  }

  public getNarrativeTextUndertakingAreaCount() {
    return this.narrativeTextUndertakingAreaCount;
  }

  public getNarrativeUnderlyingTransactionDetailsAreaCount() {
    return this.narrativeUnderlyingTransactionDetailsAreaCount;
  }

  public getNarrativePresentationInstructionsAreaCount() {
    return this.narrativePresentationInstructionsAreaCount;
  }

  getGoodsAndDescData(): Observable<any> {
    return this.descriptionOfGoodsSubject.asObservable();
  }

  getGoodsAndDescDataAmend(): Observable<any> {
    return this.descriptionOfGoodsSubjectAmend.asObservable();
  }

  getSpecialBeneData(): Observable<any> {
    return this.specialBeneSubject.asObservable();
  }

  getSpecialBeneDataAmend(): Observable<any> {
    return this.specialBeneSubjectAmend.asObservable();
  }

  getDocumentReqData(): Observable<any> {
    return this.documentReqSubject.asObservable();
  }

  getDocumentReqDataAmend(): Observable<any> {
    return this.documentReqSubjectAmend.asObservable();
  }

  getAdditionalInfoData(): Observable<any> {
    return this.additionalInfoSubject.asObservable();
  }

  getAdditionalInfoDataAmend(): Observable<any> {
    return this.additionalInfoSubjectAmend.asObservable();
  }

  amendNarrativeTextAreaJsonObject(field): any {
    const obj = {};
    const nameStr = 'name';
    const typeStr = 'type';
    const renderedStr = 'rendered';
    const startStr = 'start';
    const textAreaClassStr = 'textAreaClass';
    const startClassStr = 'startClass';
    const clearIconClassStr = 'clearIconClass';
    const layoutClassStr = 'layoutClass';
    const styleClassStr = 'styleClass';
    const maxlengthStr = 'maxlength';
    const previewScreenStr = 'previewScreen';
    const previewSingleRowStr = 'previewSingleRow';
    const amendNarrativeClubStr = 'amendNarrativeClub';
    const inquiryMapStr = 'inquiryMap';
    const narrativePDFStr = 'narrativePDF';
    const narrativePDFRenderStr = 'narrativePDFRender';
    const amendNarrativeGroupStr = 'amendNarrativeGroup';
    const amendPreviewStyleStr = 'amendPreviewStyle';
    const typeOfRegex = 'typeOfRegex';
    obj[nameStr] = field.params.key;
    obj[typeStr] = field.type;
    obj[renderedStr] = field.params.rendered;
    obj[startStr] = field.params.start;
    obj[textAreaClassStr] = field.params.textAreaClass;
    obj[startClassStr] = field.params.startClass;
    obj[clearIconClassStr] = field.params.clearIconClass;
    obj[layoutClassStr] = field.params.layoutClass;
    obj[styleClassStr] = field.params.styleClass;
    obj[maxlengthStr] = field.params.maxlength;
    obj[previewScreenStr] = field.params.previewScreen;
    obj[previewSingleRowStr] = field.params.previewSingleRow;
    obj[amendNarrativeClubStr] = field.params.amendNarrativeClub;
    obj[inquiryMapStr] = field.params.inquiryMap;
    obj[narrativePDFStr] = field.params.narrativePDF;
    obj[narrativePDFRenderStr] = field.params.narrativePDFRender;
    obj[amendNarrativeGroupStr] = field.params.amendNarrativeGroup;
    obj[amendPreviewStyleStr] = field.params.amendPreviewStyle;
    obj[typeOfRegex] = field.params.typeOfRegex;
    return obj;
  }

  narrativeExpansionPanelJsonObject(field): any {
    const obj = {};
    const nameStr = 'name';
    const typeStr = 'type';
    const renderedStr = 'rendered';
    const buttonDivClassStr = 'buttonDivClass';
    const openAllStr = 'openAll';
    const openAllClassStr = 'openAllClass';
    const openAllIconStr = 'openAllIcon';
    const openAllAltTextStr = 'openAllAltText';
    const openAllSvgStr = 'openAllSvg';
    const closeAllStr = 'closeAll';
    const closeAllClassStr = 'closeAllClass';
    const closeAllIconStr = 'closeAllIcon';
    const closeAllAltTextStr = 'closeAllAltText';
    const closeAllSvgStr = 'closeAllSvg';
    const multiStr = 'multi';
    const disabledStr = 'disabled';
    const optionsStr = 'options';
    const valueStr = 'value';
    const noPanelMsgStr = 'noPanelMsg';
    const layoutClassStr = 'layoutClass';
    const styleClassStr = 'styleClass';
    const previewScreenStr = 'previewScreen';
    const previewSingleRowStr = 'previewSingleRow';
    const amendNarrativeClubStr = 'amendNarrativeClub';
    const inquiryMapStr = 'inquiryMap';
    const narrativePDFStr = 'narrativePDF';
    const narrativePDFRenderStr = 'narrativePDFRender';
    const amendPreviewStyleStr = 'amendPreviewStyle';
    const typeOfRegex = 'typeOfRegex';
    obj[nameStr] = field.params.key;
    obj[typeStr] = field.type;
    obj[renderedStr] = field.params.rendered;
    obj[buttonDivClassStr] = field.params.buttonDivClass;
    obj[openAllStr] = field.params.openAll;
    obj[openAllClassStr] = field.params.openAllClass;
    obj[openAllIconStr] = field.params.openAllIcon;
    obj[openAllAltTextStr] = field.params.openAllAltText;
    obj[openAllSvgStr] = field.params.openAllSvg;
    obj[closeAllStr] = field.params.closeAll;
    obj[closeAllClassStr] = field.params.closeAllClass;
    obj[closeAllIconStr] = field.params.closeAllIcon;
    obj[closeAllAltTextStr] = field.params.closeAllAltText;
    obj[closeAllSvgStr] = field.params.closeAllSvg;
    obj[multiStr] = field.params.multi;
    obj[disabledStr] = field.params.disabled;
    obj[optionsStr] = field.params.options;
    obj[valueStr] = field.value;
    obj[layoutClassStr] = field.params.layoutClass;
    obj[styleClassStr] = field.params.styleClass;
    obj[noPanelMsgStr] = field.params.noPanelMsg;
    obj[previewScreenStr] = field.params.previewScreen;
    obj[previewSingleRowStr] = field.params.previewSingleRow;
    obj[amendNarrativeClubStr] = field.params.amendNarrativeClub;
    obj[inquiryMapStr] = field.params.inquiryMap;
    obj[narrativePDFStr] = field.params.narrativePDF;
    obj[narrativePDFRenderStr] = field.params.narrativePDFRender;
    obj[amendPreviewStyleStr] = field.params.amendPreviewStyle;
    obj[typeOfRegex] = field.params.typeOfRegex;
    return obj;
  }

  descOfGoodsLoad(form: FCCFormGroup, goodsandDoc: any, descOfGoods: any, operation?: string) {
    const sectionForm1 : FCCFormGroup = form;
    if(sectionForm1 !== undefined && sectionForm1 !== null){
    const sectionForm2 : FCCFormGroup = sectionForm1.get(goodsandDoc) as FCCFormGroup;
    const sectionForm3 : FCCFormGroup = sectionForm2.get(descOfGoods) as FCCFormGroup;
    this.updatingControls(sectionForm3, 'descOfGoodsText', 'descOfGoodsAmendmentPanel', 'descOfGoodsAmendEditTextArea', operation);
    }
  }

  docRequiredLoad(form: FCCFormGroup, goodsandDoc: any, docRequired: any, operation?: string) {
    const sectionForm1 : FCCFormGroup = form;
    if(sectionForm1 !== undefined && sectionForm1 !== null){
    const sectionForm2 : FCCFormGroup = sectionForm1.get(goodsandDoc) as FCCFormGroup;
    const sectionForm4: FCCFormGroup = sectionForm2.get(docRequired) as FCCFormGroup;
    this.updatingControls(sectionForm4, 'docRequiredText', 'docRequiredAmendmentPanel', 'docRequiredAmendEditTextArea', operation);
    }
  }

  additionallnstructionLoad(form: FCCFormGroup, goodsandDoc: any, additionallnstruction: any, operation?: string) {
    const sectionForm1 : FCCFormGroup = form;
    if(sectionForm1 !== undefined && sectionForm1 !== null){
    const sectionForm2 : FCCFormGroup = sectionForm1.get(goodsandDoc) as FCCFormGroup;
    const sectionForm5 : FCCFormGroup = sectionForm2.get(additionallnstruction) as FCCFormGroup;

    this.updatingControls(
      sectionForm5, 'addInstructionText', 'addInstructionAmendmentPanel',
      'addInstructionAmendEditTextArea', operation);
    }
  }

  specialPaymentNarrativeBeneLoad(form: FCCFormGroup, otherDetails: any, specialPaymentNarrativeBene: any, operation?: string) {
    const sectionForm1: FCCFormGroup = form;
    if(sectionForm1 !== undefined && sectionForm1 !== null){
    const sectionForm6: FCCFormGroup = sectionForm1.get(otherDetails) as FCCFormGroup;
    const sectionForm7: FCCFormGroup = sectionForm6.get(specialPaymentNarrativeBene) as FCCFormGroup;

    this.updatingControls(sectionForm7, 'splPaymentBeneText',
    'splPaymentBeneAmendmentPanel', 'splPaymentBeneAmendEditTextArea', operation);
    }
  }

  getTotalAmendNarrativeCount(mainSection: string, subSection: string, form: FCCFormGroup,
                              subSectionAmendTextArea: string, counter: number): any {
    let count = 0;
    for (let i = 0; i < counter; i++) {
      const tempSubSectioAmendTextArea = subSectionAmendTextArea.concat(i.toString());
      if (form.get(tempSubSectioAmendTextArea) !== undefined && form.get(tempSubSectioAmendTextArea) !== null) {
        const data = form.get(tempSubSectioAmendTextArea).value;
        const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace(/[\r\n]+/gm, '') : '';
        if (checkForValue !== '' && checkForValue !== null && checkForValue !== undefined) {
          count += this.commonService.counterOfPopulatedData(checkForValue);
          count += this.commonService.counterOfPopulatedData(form.get(tempSubSectioAmendTextArea)[this.params][FccGlobalConstant.START]);
          count += FccGlobalConstant.NUMERIC_TWO;
        }
      }
    }
    return count;
  }

  updatingControls(sectionForm: FCCFormGroup, controlName1: string, controlName2: string, controlName3: string, operation?: string) {
    let j = 0;
    const groupChildren = [controlName1];
    const len = sectionForm.get(controlName2).value ? sectionForm.get(controlName2).value.length : 0;
    for (let i = len - 1; i >= 0; i--) {
      const newName = controlName2 + j;
      j++;
      if (sectionForm.get(newName)) {
        sectionForm.removeControl(newName);
      }
      const narrativefieldObj = this.narrativeExpansionPanelJsonObject(sectionForm.get(controlName2));
      sectionForm.addControl(
        newName, this.formControlService.getControl(narrativefieldObj));
      sectionForm.get(newName)[FccGlobalConstant.KEY] = newName;
      sectionForm.get(newName).setValue(null);
      sectionForm.get(newName)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = null;
      sectionForm.get(newName).setValue(
        sectionForm.get(controlName2).value[i]);
      sectionForm.get(newName)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = sectionForm
        .get(controlName2).value[i];
      sectionForm.get(newName)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      sectionForm.get(controlName2)[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN] = false;
      sectionForm.get(newName)[FccGlobalConstant.PARAMS][FccGlobalConstant.AMEND_NARRATIVE_CLUB] = true;
      sectionForm.get(newName)[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIOUS_SINGLE_ROW] = true;
      sectionForm.get(newName)[FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_HEAD] = controlName1;
    }
    groupChildren.push(controlName3);
    if (sectionForm.get(controlName1)) {
     sectionForm.get(controlName1)[FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_HEAD_TEXT] = controlName1;
     sectionForm.get(controlName1)[FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN] = groupChildren;
     }
    if (operation && operation === FccGlobalConstant.LIST_INQUIRY) {
      sectionForm.get(controlName3)[FccGlobalConstant.PARAMS][FccGlobalConstant.INQUIRY_MAP] = true;
      sectionForm.get(controlName2)[FccGlobalConstant.PARAMS][FccGlobalConstant.INQUIRY_MAP] = true;
    }
    // if (sectionForm.get(controlName1) !== null) {
    //   sectionForm.get(controlName1)[FccGlobalConstant.PARAMS][FccGlobalConstant.NARRATIVE_RENDER_PDF] = true;
    // }
  }
  updateCumulativeAmendNarrativeCount(obj: any, form, narrativeCountTotal ) {
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const mainSection = obj[this.mainSection];
    const subSection = obj[this.subSection];
    const subSectionNarrativeCount = obj[this.subSectionNarrativeCount];
    form.get(mainSection).get(subSection).get(subSectionNarrativeCount)[this.params][this.enteredCharCount] = narrativeCountTotal;
  }

  handleAmendNarrativeDraft(obj: any, form, narrativeType: string ) {
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const mainSection = obj[this.mainSection];
    const subSection = obj[this.subSection];
    const subSectionAmendEditTextArea = obj[this.subSectionAmendEditTextArea];
    const subSectionRepall = obj[this.subSectionRepall];
    const subSectionAmendExitTextAreaRead = obj[this.subSectionAmendExitTextAreaRead];
    const tnxId = this.commonService.getQueryParametersFromKey('tnxid') ? this.commonService.getQueryParametersFromKey('tnxid') :
    this.commonService.getQueryParametersFromKey('tnxId') ;
    if (tnxId === undefined || tnxId === null || tnxId === '')
    {
      this.updateMasterData(form.get(mainSection).get(subSection), obj[this.mainText] , obj[this.masterDataView]);
    } else {
      this.updateMasterData(form.get(mainSection).get(subSection), obj[this.mainText] , obj[this.masterData]);
    }
    if ( this.mode === FccGlobalConstant.DRAFT_OPTION && !this.commonService.narrativeDetailsHandle &&
      form.get(mainSection).get(subSection).get(subSectionAmendExitTextAreaRead) &&
      form.get(mainSection).get(subSection).get(subSectionAmendExitTextAreaRead) !== '' &&
      form.get(mainSection).get(subSection).get(subSectionAmendExitTextAreaRead) !== undefined &&
      form.get(mainSection).get(subSection).get(subSectionAmendExitTextAreaRead) !== null) {
      const descOfGoodsAmendEditTextArea = form.get(mainSection).get(subSection).get(subSectionAmendExitTextAreaRead);
      if ( descOfGoodsAmendEditTextArea && descOfGoodsAmendEditTextArea.value !== undefined &&
        descOfGoodsAmendEditTextArea.value !== null && descOfGoodsAmendEditTextArea.value !== '') {
        this.narrativeDescOfGoodsDetails = descOfGoodsAmendEditTextArea.value;
        if (this.narrativeDescOfGoodsDetails && this.narrativeDescOfGoodsDetails !== '' &&
            this.narrativeDescOfGoodsDetails !== null && this.narrativeDescOfGoodsDetails !== undefined) {
        const narrativeDescOfGoodsDetailsArray = [];
        let narrativeDescOfGoodsDetailsJSON ;
        try {
          narrativeDescOfGoodsDetailsJSON = JSON.parse(this.narrativeDescOfGoodsDetails);
        }
        catch (e) {
        // If there is error in parsing, special characters are to be escaped
        // start- below lines take the value of "text": key from json string and escape special characters before parsing
        let index;
        let textVar;
        textVar = FccGlobalConstant.NARRATIVE_TEXT_KEY ;
        index = this.narrativeDescOfGoodsDetails.indexOf(textVar);
        if(index === -1) {
          textVar = FccGlobalConstant.NARRATIVE_TEXT_KEY_FOR_AMEND ;
          index = this.narrativeDescOfGoodsDetails.indexOf(textVar);
        }
        const length = this.narrativeDescOfGoodsDetails.length;
        const textKeyLength = textVar.length;
        const tempSubstr = this.narrativeDescOfGoodsDetails.substr( index + textKeyLength, length - (index + textKeyLength) - 2);
        const substr = this.commonService.escapeSplCharactersBeforeParse(tempSubstr);
        this.narrativeDescOfGoodsDetails = this.narrativeDescOfGoodsDetails.replace(tempSubstr, substr);
        // end

        narrativeDescOfGoodsDetailsJSON = JSON.parse(this.narrativeDescOfGoodsDetails);
        }

        if (narrativeDescOfGoodsDetailsJSON.verb !== undefined &&
             narrativeDescOfGoodsDetailsJSON.verb !== null &&
             narrativeDescOfGoodsDetailsJSON.verb !== 'REPALL') {
            let charCount = 0;
            const selectedJson: { verb: any; text: any, id: any} = {
              verb: narrativeDescOfGoodsDetailsJSON.verb,
              text: narrativeDescOfGoodsDetailsJSON.text,
              id : narrativeDescOfGoodsDetailsJSON.id
            };
            charCount = this.getEachNarrativeAmendCount(narrativeDescOfGoodsDetailsJSON.text, narrativeDescOfGoodsDetailsJSON.verb);
            this.updateNarrativeCount(narrativeType, charCount);
            this.descOfGoodscounter++;
            narrativeDescOfGoodsDetailsArray.push(selectedJson);
            this.obj = narrativeDescOfGoodsDetailsArray;
            form.updateValueAndValidity();
          }
         else if (narrativeDescOfGoodsDetailsJSON.length !== undefined &&
              narrativeDescOfGoodsDetailsJSON.length > 1) {
            let charCount = 0;
            narrativeDescOfGoodsDetailsJSON.forEach(element => {
              const selectedJson: { verb: any; text: any, id: any } = {
                verb: element.verb,
                text: element.text,
                id: element.id
              };
              charCount += this.getEachNarrativeAmendCount(element.text, element.verb);
              this.descOfGoodscounter++;
              narrativeDescOfGoodsDetailsArray.push(selectedJson);
              this.obj = narrativeDescOfGoodsDetailsArray;
            });
            this.updateNarrativeCount(narrativeType, charCount);
          } else if (narrativeDescOfGoodsDetailsJSON.verb === 'REPALL') {
            let charCount = 0;
            const selectedJson: { verb: any; text: any } = {
              verb: narrativeDescOfGoodsDetailsJSON.verb,
              text: narrativeDescOfGoodsDetailsJSON.text
            };
            charCount = this.getEachNarrativeAmendCount( narrativeDescOfGoodsDetailsJSON.text, narrativeDescOfGoodsDetailsJSON.verb);
            this.updateNarrativeCount(narrativeType, charCount);
            this.descOfGoodscounter++;
            narrativeDescOfGoodsDetailsArray.push(selectedJson);
            this.obj = narrativeDescOfGoodsDetailsArray;
            form.get(mainSection).get(subSection).get(subSectionRepall).patchValue('Y');
            form.updateValueAndValidity();
          }
        }
        const obj1 = {};
        obj1[FccGlobalConstant.ITEMS] = this.obj;
        form.get(mainSection).get(subSection).get(subSectionAmendEditTextArea).patchValue(obj1);
        this.amendDraftChanges(obj, form);
        form.updateValueAndValidity();
      }
    }
  }

  getEachNarrativeAmendCount(text: any, verb: any): number {
    let charCount = 0;
    const data = text;
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace(/[\r\n]+/gm, '') : '';
    if (checkForValue !== '' && checkForValue !== null && checkForValue !== undefined) {
      charCount += this.commonService.counterOfPopulatedData(checkForValue);
      charCount += this.commonService.counterOfPopulatedData(verb);
      charCount += FccGlobalConstant.NUMERIC_TWO;
    }
    return charCount;
  }

  // below method ensures each line of the entered value of the element key will be restricted to 65 characters
  limitCharacterCountPerLine(key, form) {
    const initialValue = form.get(key).value;
    const startKeyLen = form.get(key)[this.params][FccGlobalConstant.START].length + FccGlobalConstant.LENGTH_2;
    let charLimit;
    const lineArray = initialValue.split('\n');
    for (let i = 0; i < lineArray.length; i++) {

      if (i === 0) {
        // character count should also include keywords /ADD/,/DELETE/ and /REPALL/
        // Since the keywords are already added on click of Add, Delete and Repall, reduce the character
        // limit for first line
        charLimit = FccGlobalConstant.LENGTH_65 - startKeyLen;
      }
      else {
        charLimit = FccGlobalConstant.LENGTH_65;
      }

      if (lineArray[i].length <= charLimit) {
        continue;
      }
      const tempKey = lineArray[i].substr(charLimit, lineArray[i].length - charLimit);
      lineArray[i] = lineArray[i].substr(0, charLimit);
      if (this.commonService.isNonEmptyValue(lineArray[i + 1])) {
        lineArray[i + 1] = tempKey.concat(lineArray[i + 1]);
      }
      else {
        lineArray.length++;
        lineArray[i + 1] = tempKey;
      }
    }
    const keyValue = lineArray.join('\n');
    form.get(key).setValue(keyValue);
  }

  updateNarrativeCount(narrativeType: string, narrativeCharCount) {
    switch (narrativeType) {
      case FccGlobalConstant.N009_NARRATIVE_DESCRIPTION_GOODS:
                          this.descriptionOfGoodsSubjectAmend.next(narrativeCharCount);
                          break;
      case FccGlobalConstant.N009_NARRATIVE_DOCUMENTS_REQUIRED:
                          this.documentReqSubjectAmend.next(narrativeCharCount);
                          break;
      case FccGlobalConstant.N009_NARRATIVE_ADDITIONAL_INSTRUCTIONS:
                          this.additionalInfoSubjectAmend.next(narrativeCharCount);
                          break;
      case FccGlobalConstant.N009_NARRATIVE_SPECIAL_PAYMENT_CONDITIONS_BENEFICIARY:
                          this.specialBeneSubjectAmend.next(narrativeCharCount);
                          break;
    }
  }

  amendDraftChanges(obj: any, form: any) {
    const mainSection = obj[this.mainSection];
    const subSection = obj[this.subSection];
    const subSectionAmendEditTextArea = obj[this.subSectionAmendEditTextArea];
    const subSectionAmendHistoryHeader = obj[this.subSectionAmendHistoryHeader];
    const subSectionAmendPanel = obj[this.subSectionAmendPanel];
    this.var = form.get(mainSection).get(subSection);
    for (let amendDescCounter = 0 ; amendDescCounter < this.obj.length; amendDescCounter++) {
      const fieldObj1 = this.amendHistoryHeaderJsonObject(form.get(mainSection).get(subSection).get(subSectionAmendHistoryHeader));
      this.var.removeControl(subSectionAmendHistoryHeader);
      const fieldObj2 = this.narrativeExpansionPanelJsonObject(
      form.get(mainSection).get(subSection).get(subSectionAmendPanel));
      this.var.removeControl(subSectionAmendPanel);
      const fieldObj = this.amendNarrativeTextAreaJsonObject(
        form.get(mainSection).get(subSection).get(subSectionAmendEditTextArea));
      const newKeyName = subSectionAmendEditTextArea + amendDescCounter;
      this.var.addControl(newKeyName, this.formControlService.getControl(fieldObj));
      form.get(mainSection).get(subSection).get(newKeyName)[FccGlobalConstant.KEY] = newKeyName;
      form.get(mainSection).get(subSection).get(newKeyName)[this.params][FccGlobalConstant.RENDERED] = true;
      form.get(mainSection).get(subSection).get(newKeyName)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
      const newName = subSectionAmendEditTextArea + amendDescCounter;
      const narrativefieldObj = this.amendNarrativeTextAreaJsonObject(form.get(mainSection).get(subSection).get(newName));
      const newControlVal = this.obj[amendDescCounter].text;
      this.var.removeControl(newName);
      this.var.addControl(newName, this.formControlService.getControl(narrativefieldObj));
      form.get(mainSection).get(subSection).get(newName)[FccGlobalConstant.KEY] = newName;
      form.get(mainSection).get(subSection).get(newName)[FccGlobalConstant.VALUE] = newControlVal;
      this.var.addControl(subSectionAmendHistoryHeader, this.formControlService.getControl(fieldObj1));
      this.var.addControl(subSectionAmendPanel, this.formControlService.getControl(fieldObj2));
      form.get(mainSection).get(subSection).get(subSectionAmendPanel).patchValue(fieldObj2[FccGlobalConstant.VALUE]);
      if (this.obj[amendDescCounter].verb === 'ADD') {
        form.get(mainSection).get(subSection).get(newKeyName)[this.params][FccGlobalConstant.START] = 'Add';
      } else if (this.obj[amendDescCounter].verb === 'REPALL') {
        form.get(mainSection).get(subSection).get(newKeyName)[this.params][FccGlobalConstant.START] = 'Repall';
      } else {
        form.get(mainSection).get(subSection).get(newKeyName)[this.params][FccGlobalConstant.START] = 'Delete';
      }
      this.commonService.amendDescofGooodsCounter = amendDescCounter;
      form.updateValueAndValidity();
    }
  }

  handleAmendNarrativeEL(obj: any, form: any) {
    const subSectionAmendExitTextAreaRead = obj[this.subSectionAmendExitTextAreaRead];
    let narrativeDescOfGoodsDetails = form.controls[subSectionAmendExitTextAreaRead].value;
    this.obj = '';
    if (narrativeDescOfGoodsDetails && narrativeDescOfGoodsDetails !== '' &&
              narrativeDescOfGoodsDetails !== null && narrativeDescOfGoodsDetails !== undefined) {
          const narrativeDescOfGoodsDetailsArray = [];
          narrativeDescOfGoodsDetails = narrativeDescOfGoodsDetails.replaceAll('\n', '\\n');
          const narrativeDescOfGoodsDetailsJSON = JSON.parse(narrativeDescOfGoodsDetails);
          if ((narrativeDescOfGoodsDetailsJSON.length === 1 && narrativeDescOfGoodsDetailsJSON.verb !== 'REPALL') ||
                narrativeDescOfGoodsDetailsJSON.length > 1) {
              this.commonService.narrativeDetailsHandle = true;
              narrativeDescOfGoodsDetailsJSON.forEach(element => {
                const selectedJson: { verb: any; text: any, id: any } = {
                  verb: element.verb,
                  text: element.text,
                  id: element.id
                };
                this.descOfGoodscounter++;
                narrativeDescOfGoodsDetailsArray.push(selectedJson);
                this.obj = narrativeDescOfGoodsDetailsArray;
              });
            } else if (narrativeDescOfGoodsDetailsJSON.verb === 'REPALL') {
              const selectedJson: { verb: any; text: any } = {
                verb: narrativeDescOfGoodsDetailsJSON.verb,
                text: narrativeDescOfGoodsDetailsJSON.text
              };
              this.descOfGoodscounter++;
              narrativeDescOfGoodsDetailsArray.push(selectedJson);
              this.obj = narrativeDescOfGoodsDetailsArray;
              // form.get(mainSection).get(subSection).get(subSectionRepall).patchValue('Y');
              form.updateValueAndValidity();
            } else {
              const selectedJson: { verb: any; text: any } = {
                verb: narrativeDescOfGoodsDetailsJSON.verb,
                text: narrativeDescOfGoodsDetailsJSON.text
              };
              narrativeDescOfGoodsDetailsArray.push(selectedJson);
              this.obj = narrativeDescOfGoodsDetailsArray;
            }
          }
    const obj1 = {};
    obj1[FccGlobalConstant.ITEMS] = this.obj;
    // form.get(mainSection).get(subSection).get(subSectionAmendEditTextArea).patchValue(obj1);
    this.amendNarrativeELView(obj, form);
    form.updateValueAndValidity();
  }

  amendNarrativeELView(obj: any, form: any) {
    const subSectionAmendEditTextArea = obj[this.subSectionAmendEditTextArea];
    const subSectionAmendHistoryHeader = obj[this.subSectionAmendHistoryHeader];
    const subSectionAmendPanel = obj[this.subSectionAmendPanel];
    const subSectionAmendExitTextAreaDisplay = obj[this.subSectionAmendExitTextAreaDisplay];
    const mainTextField = obj[this.mainTextField];
    let value = '';
    this.var = form;
    if (this.obj && this.obj.length) {
      for (let amendDescCounter = 0 ; amendDescCounter < this.obj.length; amendDescCounter++) {
        const fieldObj1 = this.amendHistoryHeaderJsonObject(
          form.controls[subSectionAmendHistoryHeader]
        );
        this.var.removeControl(subSectionAmendHistoryHeader);
        const fieldObj2 = this.narrativeExpansionPanelJsonObject(
          form.controls[subSectionAmendPanel]);
        this.var.removeControl(subSectionAmendPanel);
        const fieldObj = this.amendNarrativeTextAreaJsonObject(
          form.controls[subSectionAmendEditTextArea]);
        const newKeyName = subSectionAmendEditTextArea + amendDescCounter;
        this.var.addControl(newKeyName, this.formControlService.getControl(fieldObj));
        form.controls[newKeyName][FccGlobalConstant.KEY] = newKeyName;
        form.controls[newKeyName][this.params][FccGlobalConstant.RENDERED] = true;
        form.controls[newKeyName][this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
        const newName = subSectionAmendEditTextArea + amendDescCounter;
        const narrativefieldObj = this.amendNarrativeTextAreaJsonObject( form.controls[newName]);
        const newControlVal = this.obj[amendDescCounter].text;
        this.var.removeControl(newName);
        this.var.addControl(newName, this.formControlService.getControl(narrativefieldObj));
        form.controls[newName][FccGlobalConstant.KEY] = newName;
        form.controls[newName][FccGlobalConstant.VALUE] = newControlVal;
        this.var.addControl(subSectionAmendHistoryHeader, this.formControlService.getControl(fieldObj1));
        this.var.addControl(subSectionAmendPanel, this.formControlService.getControl(fieldObj2));
        form.controls[subSectionAmendPanel].patchValue(fieldObj2[FccGlobalConstant.VALUE]);
        if (this.obj[amendDescCounter].verb === 'ADD') {
          form.controls[newKeyName][this.params][FccGlobalConstant.START] = 'Add';
          if (this.commonService.comparisonPopup) {
            value = `&lt;Add&gt; ${form.controls[newName][FccGlobalConstant.VALUE]} &lt;End&gt;<br>`;
          } else {
          value = value + '<Add> ' + form.controls[newName][FccGlobalConstant.VALUE] + '<End>' + '\n';
          }
        } else if (this.obj[amendDescCounter].verb === 'REPALL') {
          form.controls[newKeyName][this.params][FccGlobalConstant.START] = 'Repall';
          if (this.commonService.comparisonPopup) {
            value = `&lt;Repall&gt; ${form.controls[newName][FccGlobalConstant.VALUE]} &lt;End&gt;<br>`;
          } else {
            value = value + '<Repall> ' + form.controls[newName][FccGlobalConstant.VALUE] + '<End>';
          }
        } else {
          form.controls[newKeyName][this.params][FccGlobalConstant.START] = 'Delete';
          if (this.commonService.comparisonPopup) {
            value = `&lt;Delete&gt; ${form.controls[newName][FccGlobalConstant.VALUE]} &lt;End&gt;<br>`;
          } else {
            value = value + '<Delete> ' + form.controls[newName][FccGlobalConstant.VALUE] + '<End>' + '\n';
          }
        }
        this.commonService.amendDescofGooodsCounter = amendDescCounter;
        if (this.commonService.comparisonPopup) {
          form.controls[mainTextField].patchValue(value);
        } else {
          form.controls[subSectionAmendExitTextAreaDisplay].patchValue(value);
        }
        form.updateValueAndValidity();
      }
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

  handleAmendViewNarrative(control: any, sectionForm: any, productCode: any, sectionName: any, master = false) {
    this.handleFormAmendViewNarrative(control, sectionForm, productCode, sectionName, master);
  }

  handleFormAmendViewNarrative(control: any, sectionForm: any, productCode: any, sectionName: any, master = false) {
    switch (productCode) {
      case FccGlobalConstant.PRODUCT_LC:
        this.handleAmendNarrativeView(this.descOfGoodsJsonObject(), sectionForm, FccGlobalConstant.N009_NARRATIVE_DESCRIPTION_GOODS);
        this.handleAmendNarrativeView(this.docReqJsonObject(), sectionForm, FccGlobalConstant.N009_NARRATIVE_DOCUMENTS_REQUIRED);
        this.handleAmendNarrativeView(this.addInstJsonObject(), sectionForm, FccGlobalConstant.N009_NARRATIVE_ADDITIONAL_INSTRUCTIONS);
        this.handleAmendNarrativeView(this.spcPayJsonObject(), sectionForm,
          FccGlobalConstant.N009_NARRATIVE_SPECIAL_PAYMENT_CONDITIONS_BENEFICIARY);
        break;
      case FccGlobalConstant.PRODUCT_SI:
        this.handleAmendNarrativeView(this.siDescOfGoodsJsonObject(), sectionForm, FccGlobalConstant.N009_NARRATIVE_DESCRIPTION_GOODS);
        this.handleAmendNarrativeView(this.siDocReqJsonObject(), sectionForm, FccGlobalConstant.N009_NARRATIVE_DOCUMENTS_REQUIRED);
        this.handleAmendNarrativeView(this.siAddInstJsonObject(), sectionForm, FccGlobalConstant.N009_NARRATIVE_ADDITIONAL_INSTRUCTIONS);
        this.handleAmendNarrativeView(this.siSpcPayJsonObject(), sectionForm,
          FccGlobalConstant.N009_NARRATIVE_SPECIAL_PAYMENT_CONDITIONS_BENEFICIARY);
        break;
      case FccGlobalConstant.PRODUCT_EL:
        if (control.key === 'descOfGoodsText' || control.key === 'masterDescOfGoods' || control.key === 'masterDescOfGoodsView' ) {
          this.handleAmendNarrativeMasterView(this.descOfGoodsJsonObject(), sectionForm,
          FccGlobalConstant.N009_NARRATIVE_DESCRIPTION_GOODS, master);
        }
        else if (control.key === 'docRequiredText' || control.key === 'masterDocReqd' || control.key === 'masterDocReqdView' ) {
          this.handleAmendNarrativeMasterView(this.docReqJsonObject(), sectionForm,
          FccGlobalConstant.N009_NARRATIVE_DOCUMENTS_REQUIRED, master);

        }
        else if (control.key === 'addInstructionText' || control.key === 'masterAddInstr' || control.key === 'masterAddInstrView' ) {
          this.handleAmendNarrativeMasterView(this.addInstJsonObject(), sectionForm,
          FccGlobalConstant.N009_NARRATIVE_ADDITIONAL_INSTRUCTIONS, master);

        }
        else if (control.key === 'splPaymentBeneText' || control.key === 'masterSplBene' || control.key === 'masterSplBeneView' ) {
          this.handleAmendNarrativeMasterView(this.spcPayJsonObject(), sectionForm,
          FccGlobalConstant.N009_NARRATIVE_SPECIAL_PAYMENT_CONDITIONS_BENEFICIARY, master);
        }
        break;
      case FccGlobalConstant.PRODUCT_SR:
        if (control.key === 'descOfGoodsText' || control.key === 'masterDescOfGoods' || control.key === 'masterDescOfGoodsView' ) {
          this.handleAmendNarrativeMasterView(this.descOfGoodsJsonObject(), sectionForm,
          FccGlobalConstant.N009_NARRATIVE_DESCRIPTION_GOODS, master);
        }
        else if (control.key === 'docRequiredText' || control.key === 'masterDocReqd' || control.key === 'masterDocReqdView' ) {
          this.handleAmendNarrativeMasterView(this.docReqJsonObject(), sectionForm,
          FccGlobalConstant.N009_NARRATIVE_DOCUMENTS_REQUIRED, master);

        }
        else if (control.key === 'addInstructionText' || control.key === 'masterAddInstr' || control.key === 'masterAddInstrView' ) {
          this.handleAmendNarrativeMasterView(this.addInstJsonObject(), sectionForm,
          FccGlobalConstant.N009_NARRATIVE_ADDITIONAL_INSTRUCTIONS, master);

        }
        else if (control.key === 'splPaymentBeneText' || control.key === 'masterSplBene' || control.key === 'masterSplBeneView' ) {
          this.handleAmendNarrativeMasterView(this.spcPayJsonObject(), sectionForm,
          FccGlobalConstant.N009_NARRATIVE_SPECIAL_PAYMENT_CONDITIONS_BENEFICIARY, master);
        }
        break;
      default:
        break;
    }
  }

  validateMaxLengthAmend(maxLength, totalNarrativeCount, form, element ) {
    const totalNarrativeCountIncludingExistingVal = totalNarrativeCount +
      (this.commonService.counterOfPopulatedData(form.get(element).value));

    if (totalNarrativeCountIncludingExistingVal > maxLength) {
      form.get(element).setErrors({ maxSizeExceedsIndividual: { maxSize: this.getNarrativeTotalSwiftCharLength() } });
    }
    form.updateValueAndValidity();
  }


  totalCountValidationAmend(key, form , totalNarrativeCount, stateServiceParam ,
                            maxLength = this.getNarrativeSwiftCharLength()) {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZCharRegex = response.swiftZChar;
        this.swiftExtendedNarrativeEnable = response.swiftExtendedNarrativeEnable;
      }
    });
    this.modeOfTransmission = stateServiceParam.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;

    const totalCountAllNarratives = stateServiceParam.getSectionData(FccGlobalConstant.NARRATIVE_DETAILS)
    .get('narrativeCount')[this.params][this.enteredCharCount];
    if (totalCountAllNarratives > (this.getNarrativeTotalSwiftCharLength() -
      this.getNarrativeNonSwiftCharLength())) {
      this.totalCountValidatonSubscription.next(false);
      if (this.errTextAreasMap.indexOf(key) === -1) {
        this.errTextAreasMap.push(key);
      }
      form.get(key).markAsDirty();
      form.get(key).markAsTouched();
      form.get(key).setValidators([compareCumulativeNarrativeFieldCount(this.getNarrativeTotalSwiftCharAmendLength())]);
      form.get(key).updateValueAndValidity();
    }
    else if (!this.checkIfIndividualNarrativeCountValid(totalNarrativeCount, maxLength)) {
      this.totalCountValidatonSubscription.next(false);
      if (this.errTextAreasMap.indexOf(key) === -1) {
        this.errTextAreasMap.push(key);
      }
      form.get(key).markAsDirty();
      form.get(key).markAsTouched();
      form.get(key)[this.params][FccGlobalConstant.MAXLENGTH] = maxLength;
      form.get(key).setValidators([compareIndividualFieldCount]);
      form.get(key).updateValueAndValidity();
    }
    else {
      // remove these count validation errors, if valid.
      if (form.get(key)) {
        form.get(key).clearValidators();
        if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
        form.addFCCValidators(key, Validators.pattern(this.swiftZCharRegex), 0);
        }
        this.commonService.removeError(form.get(key), 'maxSizeExceedsAmend');
        this.commonService.removeError(form.get(key), 'maxSizeExceedsIndividual');
        if (!this.totalCountValidatonSubscription.value) {
          this.totalCountValidatonSubscription.next(true);
        } 
      }
    }
    form.updateValueAndValidity();
  }

  clearCountValidationForAmend(form, totalNarrativeCount, stateServiceParam) {
    this.errTextAreasMap.forEach(element => {
      if (form.get(element) !== undefined) {
        this.totalCountValidationAmend(element, form, totalNarrativeCount, stateServiceParam);
      }
    });
  }

  totalCountValidationAmendSI(key, form , totalNarrativeCount, stateServiceParam,
                              maxLength = this.getNarrativeSwiftCharLength()) {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZCharRegex = response.swiftZChar;
        this.swiftExtendedNarrativeEnable = response.swiftExtendedNarrativeEnable;
      }
    });
    this.modeOfTransmission = stateServiceParam.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    const totalCountAllNarratives = stateServiceParam.getSectionData(FccGlobalConstant.SI_NARRATIVE_DETAILS)
    .get('narrativeCount')[this.params][this.enteredCharCount];
    if (totalCountAllNarratives > (this.getNarrativeTotalSwiftCharLength() -
      this.getNarrativeNonSwiftCharLength())) {
      form.get(key).markAsDirty();
      form.get(key).markAsTouched();
      form.get(key).setValidators([compareCumulativeNarrativeFieldCount]);
    }
    else if (!this.checkIfIndividualNarrativeCountValid(totalNarrativeCount, maxLength)) {
      form.get(key).markAsDirty();
      form.get(key).markAsTouched();
      form.get(key)[this.params][FccGlobalConstant.MAXLENGTH] = maxLength;
      form.get(key).setValidators([compareIndividualFieldCount]);
    }
    else {
      if (form.get(key)) {
      // remove these count validation errors, if valid.
      form.get(key).clearValidators();
      if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
      form.addFCCValidators(key, Validators.pattern(this.swiftZCharRegex), 0);
      }
      this.commonService.removeError(form.get(key), 'maxSizeExceedsAmend');
      this.commonService.removeError(form.get(key), 'maxSizeExceedsIndividual');
    }
  }
  }

  isValidAmendNarratives(): boolean{
    const totalCountAllNarratives = this.goodAndDocsCountAmend + this.documentReqCountAmend +
                                    this.specialBeneCountAmend + this.additionalInfoCountAmend;
    if (totalCountAllNarratives >
       (this.getNarrativeTotalSwiftCharLength() - this.getNarrativeNonSwiftCharLength()))
      {
      }
    if (!this.checkIfIndividualNarrativeCountValid( this.goodAndDocsCountAmend ) ||
        !this.checkIfIndividualNarrativeCountValid( this.documentReqCountAmend) ||
        !this.checkIfIndividualNarrativeCountValid( this.specialBeneCountAmend) ||
        !this.checkIfIndividualNarrativeCountValid( this.additionalInfoCountAmend)) {
      }
    return false;
  }

  swiftModeTransmissionAmend(form, element, totalNarrativeCount, stateServiceParam,
                             maxLength = this.getNarrativeSwiftCharLength()) {
    form.get(element).updateValueAndValidity();
    if (!this.checkIfIndividualNarrativeCountValid( totalNarrativeCount, maxLength)){
      form.get(element).setErrors({ maxSizeExceedsIndividual: { maxSize: maxLength } });
    }
    if (!this.checkIfAllNarrativeCountValid( stateServiceParam)){
      form.get(element).setErrors({ maxSizeExceedsAmend:
        { maxSize: FccGlobalConstant.NARRATIVE_TOTAL_SWIFT_CHAR__AMEND_LENGTH } });
    }
  }

  checkIfIndividualNarrativeCountValid(individualNarrativeCount , maxLength = this.getNarrativeSwiftCharLength()): boolean{
    let isValid = true;
    if (this.swiftExtendedNarrativeEnable && individualNarrativeCount > this.getNarrativeSwiftCharLength()){
    isValid = false;
    } else if (!this.swiftExtendedNarrativeEnable && individualNarrativeCount > maxLength) {
      isValid = false;
    }
    return isValid;
  }

  checkIfAllNarrativeCountValid(stateServiceParam): boolean{
    let isAllNarrativeCountValid = true;
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    let totalNarrCount;
    if (this.productCode === FccGlobalConstant.PRODUCT_LC) {
    totalNarrCount = stateServiceParam.getSectionData(FccGlobalConstant.NARRATIVE_DETAILS)
                            .get('narrativeCount')[this.params][this.enteredCharCount];
    } else if (this.productCode === FccGlobalConstant.PRODUCT_SI) {
      totalNarrCount = stateServiceParam.getSectionData(FccGlobalConstant.NARRATIVE_DETAILS)
                            .get('narrativeCount')[this.params][this.enteredCharCount];
    }
    if (totalNarrCount > this.getNarrativeTotalSwiftCharLength() - this.getNarrativeNonSwiftCharLength()){
      isAllNarrativeCountValid = false;
    }
    return isAllNarrativeCountValid;
  }

  descOfGoodsJsonObject(): any {
    const descOfGoodsObj = {};
    descOfGoodsObj[this.mainSection] = 'goodsandDoc';
    descOfGoodsObj[this.subSection] = 'descOfGoods';
    descOfGoodsObj[this.subSectionAmendEditTextArea] = 'descOfGoodsAmendEditTextArea';
    descOfGoodsObj[this.subSectionNarrativeCount] = 'descGoodsTabNarrativeCount';
    descOfGoodsObj[this.subSectionRepall] = 'descOfGoodsRepAll';
    descOfGoodsObj[this.subSectionAmendHistoryHeader] = 'descOfGoodsAmendHistoryHeader';
    descOfGoodsObj[this.subSectionAmendPanel] = 'descOfGoodsAmendmentPanel';
    descOfGoodsObj[this.subSectionAmendExitTextAreaRead] = 'descOfGoodsAmendEditTextAreaRead';
    descOfGoodsObj[this.subSectionAmendExitTextAreaDisplay] = 'descOfGoodsAmendEditTextAreaDisplay';
    descOfGoodsObj[this.mainTextField] = 'descOfGoodsText';
    descOfGoodsObj[this.mainText] = 'descOfGoodsText';
    descOfGoodsObj[this.masterData] = 'masterDescOfGoods';
    descOfGoodsObj[this.masterDataView] = 'masterDescOfGoodsView';
    return descOfGoodsObj;
    }

    docReqJsonObject(): any {
      const docReqObj = {};
      docReqObj[this.mainSection] = 'goodsandDoc';
      docReqObj[this.subSection] = 'docRequired';
      docReqObj[this.subSectionAmendEditTextArea] = 'docRequiredAmendEditTextArea';
      docReqObj[this.subSectionNarrativeCount] = 'docReqdTabNarrativeCount';
      docReqObj[this.subSectionRepall] = 'docRequiredRepAll';
      docReqObj[this.subSectionAmendHistoryHeader] = 'docRequiredAmendHistoryHeader';
      docReqObj[this.subSectionAmendPanel] = 'docRequiredAmendmentPanel';
      docReqObj[this.subSectionAmendExitTextAreaRead] = 'docReqAmendEditTextAreaRead';
      docReqObj[this.subSectionAmendExitTextAreaDisplay] = 'docReqAmendEditTextAreaDisplay';
      docReqObj[this.mainTextField] = 'docRequiredText';
      docReqObj[this.mainText] = 'docRequiredText';
      docReqObj[this.masterData] = 'masterDocReqd';
      docReqObj[this.masterDataView] = 'masterDocReqdView';
      return docReqObj;
      }

    addInstJsonObject(): any {
      const addInstObj = {};
      addInstObj[this.mainSection] = 'goodsandDoc';
      addInstObj[this.subSection] = 'additionallnstruction';
      addInstObj[this.subSectionAmendEditTextArea] = 'addInstructionAmendEditTextArea';
      addInstObj[this.subSectionNarrativeCount] = 'addInstructionsTabNarrativeCount';
      addInstObj[this.subSectionRepall] = 'addInstructionRepAll';
      addInstObj[this.subSectionAmendHistoryHeader] = 'addInstructionAmendHistoryHeader';
      addInstObj[this.subSectionAmendPanel] = 'addInstructionAmendmentPanel';
      addInstObj[this.subSectionAmendExitTextAreaRead] = 'addInstAmendEditTextAreaRead';
      addInstObj[this.subSectionAmendExitTextAreaDisplay] = 'addInstAmendEditTextAreaDisplay';
      addInstObj[this.mainTextField] = 'addInstructionText';
      addInstObj[this.mainText] = 'addInstructionText';
      addInstObj[this.masterData] = 'masterAddInstr';
      addInstObj[this.masterDataView] = 'masterAddInstrView';
      return addInstObj;
      }

    spcPayJsonObject(): any {
      const spcPayObj = {};
      spcPayObj[this.mainSection] = 'otherDetails';
      spcPayObj[this.subSection] = 'specialPaymentNarrativeBene';
      spcPayObj[this.subSectionAmendEditTextArea] = 'splPaymentBeneAmendEditTextArea';
      spcPayObj[this.subSectionNarrativeCount] = 'splBeneTabNarrativeCount';
      spcPayObj[this.subSectionRepall] = 'splPaymentBeneRepAll';
      spcPayObj[this.subSectionAmendHistoryHeader] = 'splPaymentBeneAmendHistoryHeader';
      spcPayObj[this.subSectionAmendPanel] = 'splPaymentBeneAmendmentPanel';
      spcPayObj[this.subSectionAmendExitTextAreaRead] = 'splPaymentBeneAmendEditTextAreaRead';
      spcPayObj[this.subSectionAmendExitTextAreaDisplay] = 'splPaymentBeneAmendEditTextAreaDisplay';
      spcPayObj[this.mainTextField] = 'splPaymentBeneText';
      spcPayObj[this.mainText] = 'splPaymentBeneText';
      spcPayObj[this.masterData] = 'masterSplBene';
      spcPayObj[this.masterDataView] = 'masterSplBeneView';
      return spcPayObj;
      }

      siDescOfGoodsJsonObject(): any {
        const siDescOfGoodsObj = {};
        siDescOfGoodsObj[this.mainSection] = 'siGoodsandDoc';
        siDescOfGoodsObj[this.subSection] = 'siDescOfGoods';
        siDescOfGoodsObj[this.subSectionAmendEditTextArea] = 'descOfGoodsAmendEditTextArea';
        siDescOfGoodsObj[this.subSectionNarrativeCount] = 'descGoodsTabNarrativeCount';
        siDescOfGoodsObj[this.subSectionRepall] = 'descOfGoodsRepAll';
        siDescOfGoodsObj[this.subSectionAmendHistoryHeader] = 'descOfGoodsAmendHistoryHeader';
        siDescOfGoodsObj[this.subSectionAmendPanel] = 'descOfGoodsAmendmentPanel';
        siDescOfGoodsObj[this.subSectionAmendExitTextAreaRead] = 'descOfGoodsAmendEditTextAreaRead';
        siDescOfGoodsObj[this.mainText] = 'descOfGoodsText';
        siDescOfGoodsObj[this.masterData] = 'masterDescOfGoods';
        siDescOfGoodsObj[this.masterDataView] = 'masterDescOfGoodsView';
        return siDescOfGoodsObj;
      }

      siDocReqJsonObject(): any {
        const siDocReqObj = {};
        siDocReqObj[this.mainSection] = 'siGoodsandDoc';
        siDocReqObj[this.subSection] = 'siDocRequired';
        siDocReqObj[this.subSectionAmendEditTextArea] = 'docRequiredAmendEditTextArea';
        siDocReqObj[this.subSectionNarrativeCount] = 'docReqdTabNarrativeCount';
        siDocReqObj[this.subSectionRepall] = 'docRequiredRepAll';
        siDocReqObj[this.subSectionAmendHistoryHeader] = 'docRequiredAmendHistoryHeader';
        siDocReqObj[this.subSectionAmendPanel] = 'docRequiredAmendmentPanel';
        siDocReqObj[this.subSectionAmendExitTextAreaRead] = 'docReqAmendEditTextAreaRead';
        siDocReqObj[this.mainText] = 'docRequiredText';
        siDocReqObj[this.masterData] = 'masterDocReqd';
        siDocReqObj[this.masterDataView] = 'masterDocReqdView';
        return siDocReqObj;
      }

      siAddInstJsonObject(): any {
        const siAddInstObj = {};
        siAddInstObj[this.mainSection] = 'siGoodsandDoc';
        siAddInstObj[this.subSection] = 'siAdditionallnstruction';
        siAddInstObj[this.subSectionAmendEditTextArea] = 'addInstructionAmendEditTextArea';
        siAddInstObj[this.subSectionNarrativeCount] = 'addInstructionsTabNarrativeCount';
        siAddInstObj[this.subSectionRepall] = 'addInstructionRepAll';
        siAddInstObj[this.subSectionAmendHistoryHeader] = 'addInstructionAmendHistoryHeader';
        siAddInstObj[this.subSectionAmendPanel] = 'addInstructionAmendmentPanel';
        siAddInstObj[this.subSectionAmendExitTextAreaRead] = 'addInstAmendEditTextAreaRead';
        siAddInstObj[this.mainText] = 'addInstructionText';
        siAddInstObj[this.masterData] = 'masterAddInstr';
        siAddInstObj[this.masterDataView] = 'masterAddInstrView';
        return siAddInstObj;
      }

      siSpcPayJsonObject(): any {
        const siSpcPayObj = {};
        siSpcPayObj[this.mainSection] = 'siOtherDetails';
        siSpcPayObj[this.subSection] = 'siSpecialPaymentNarrativeBene';
        siSpcPayObj[this.subSectionAmendEditTextArea] = 'splPaymentBeneAmendEditTextArea';
        siSpcPayObj[this.subSectionRepall] = 'splPaymentBeneRepAll';
        siSpcPayObj[this.subSectionNarrativeCount] = 'splBeneTabNarrativeCount';
        siSpcPayObj[this.subSectionAmendHistoryHeader] = 'splPaymentBeneAmendHistoryHeader';
        siSpcPayObj[this.subSectionAmendPanel] = 'splPaymentBeneAmendmentPanel';
        siSpcPayObj[this.subSectionAmendExitTextAreaRead] = 'splPaymentBeneAmendEditTextAreaRead';
        siSpcPayObj[this.mainText] = 'splPaymentBeneText';
        siSpcPayObj[this.masterData] = 'masterSplBene';
        siSpcPayObj[this.masterDataView] = 'masterSplBeneView';
        return siSpcPayObj;
      }

    handleAmendNarrativeMasterView(obj: any, form, narrativeType: string, master = false) {
     if (this.isMaster === undefined) {
       this.isMaster = master;
     }
     if (!this.isMaster) {
        this.updateMasterData(form, obj[this.mainText] , obj[this.masterDataView]);
      } else {
        this.updateMasterData(form, obj[this.mainText] , obj[this.masterData]);
      }
     const response = this.commonService.tnxResponse;
     if (response && response.tnx_id && response.prod_stat_code &&
      response.prod_stat_code === FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL &&
      (!this.isMaster) && !(form.get(obj[this.subSectionAmendExitTextAreaRead]).value !== null) &&
      (form.get(obj[this.masterData]).value !== null)) {
       form.get(obj[this.subSectionAmendExitTextAreaRead])[this.params][FccGlobalConstant.RENDERED] = true;
       this.updateMasterData(form, obj[this.subSectionAmendExitTextAreaRead] , obj[this.masterData]);
      }
   }

    handleAmendNarrativeView(obj: any, form, narrativeType: string) {
      this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
      const action = this.commonService.getQueryParametersFromKey(FccGlobalConstant.ACTION);
      const mainSection = obj[this.mainSection];
      const subSection = obj[this.subSection];
      const subSectionAmendEditTextArea = obj[this.subSectionAmendEditTextArea];
      const subSectionRepall = obj[this.subSectionRepall];
      const subSectionAmendExitTextAreaRead = obj[this.subSectionAmendExitTextAreaRead];
      const tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNXID);
      if (((tnxId === undefined || tnxId === null || tnxId === '') &&
      (this.commonService.currentStateTnxResponse === undefined ||
        (this.commonService.currentStateTnxResponse !== undefined && this.commonService.currentStateTnxResponse.tnx_id === undefined)))
      || (action === FccGlobalConstant.APPROVE))
    {
      this.updateMasterData(form.get(mainSection).get(subSection), obj[this.mainText] , obj[this.masterDataView]);
    } else {
      this.updateMasterData(form.get(mainSection).get(subSection), obj[this.mainText] , obj[this.masterData]);
    }
      if ( this.mode === FccGlobalConstant.VIEW_MODE && !this.commonService.narrativeDetailsHandle &&
        form.get(mainSection).get(subSection).get(subSectionAmendExitTextAreaRead) &&
        form.get(mainSection).get(subSection).get(subSectionAmendExitTextAreaRead) !== '' &&
        form.get(mainSection).get(subSection).get(subSectionAmendExitTextAreaRead) !== undefined &&
        form.get(mainSection).get(subSection).get(subSectionAmendExitTextAreaRead) !== null) {
        const descOfGoodsAmendEditTextArea = form.get(mainSection).get(subSection).get(subSectionAmendExitTextAreaRead);
        if ( descOfGoodsAmendEditTextArea && descOfGoodsAmendEditTextArea.value !== undefined &&
          descOfGoodsAmendEditTextArea.value !== null && descOfGoodsAmendEditTextArea.value !== '') {
          this.narrativeDescOfGoodsDetails = descOfGoodsAmendEditTextArea.value;
          if (this.narrativeDescOfGoodsDetails && this.narrativeDescOfGoodsDetails !== '' &&
              this.narrativeDescOfGoodsDetails !== null && this.narrativeDescOfGoodsDetails !== undefined) {
          const narrativeDescOfGoodsDetailsArray = [];
          let narrativeDescOfGoodsDetailsJSON ;
          try {
            narrativeDescOfGoodsDetailsJSON = JSON.parse(this.narrativeDescOfGoodsDetails);
          }
          catch (e) {
            // If there is error in parsing, special characters are to be escaped
            // start- below lines take the value of "text": key from json string and escape special characters before parsing
          let index;
          let textVar;
          textVar = FccGlobalConstant.NARRATIVE_TEXT_KEY ;
          index = this.narrativeDescOfGoodsDetails.indexOf(textVar);
          if(index === -1) {
            textVar = FccGlobalConstant.NARRATIVE_TEXT_KEY_FOR_AMEND ;
            index = this.narrativeDescOfGoodsDetails.indexOf(textVar);
          }
          const length = this.narrativeDescOfGoodsDetails.length;
          const textKeyLength = textVar.length;
          const tempSubstr = this.narrativeDescOfGoodsDetails.substr( index + textKeyLength, length - (index + textKeyLength) - 2);
          const substr = this.commonService.escapeSplCharactersBeforeParse(tempSubstr);
          this.narrativeDescOfGoodsDetails = this.narrativeDescOfGoodsDetails.replace(tempSubstr, substr);
          narrativeDescOfGoodsDetailsJSON = JSON.parse(this.narrativeDescOfGoodsDetails);
          // end
          }
          if (narrativeDescOfGoodsDetailsJSON.verb !== undefined &&
            narrativeDescOfGoodsDetailsJSON.verb !== null &&
            narrativeDescOfGoodsDetailsJSON.verb !== 'REPALL') {
           let charCount = 0;
           const selectedJson: { verb: any; text: any, id: any} = {
             verb: narrativeDescOfGoodsDetailsJSON.verb,
             text: narrativeDescOfGoodsDetailsJSON.text,
             id : narrativeDescOfGoodsDetailsJSON.id
           };
           charCount = this.getEachNarrativeAmendCount(narrativeDescOfGoodsDetailsJSON.text, narrativeDescOfGoodsDetailsJSON.verb);
           this.updateNarrativeCount(narrativeType, charCount);
           this.descOfGoodscounter++;
           narrativeDescOfGoodsDetailsArray.push(selectedJson);
           this.obj = narrativeDescOfGoodsDetailsArray;
           form.updateValueAndValidity();
         }
        else if (narrativeDescOfGoodsDetailsJSON.length !== undefined &&
             narrativeDescOfGoodsDetailsJSON.length > 1) {
           let charCount = 0;
           narrativeDescOfGoodsDetailsJSON.forEach(element => {
             const selectedJson: { verb: any; text: any, id: any } = {
               verb: element.verb,
               text: element.text,
               id: element.id
             };
             charCount += this.getEachNarrativeAmendCount(element.text, element.verb);
             this.descOfGoodscounter++;
             narrativeDescOfGoodsDetailsArray.push(selectedJson);
             this.obj = narrativeDescOfGoodsDetailsArray;
           });
           this.updateNarrativeCount(narrativeType, charCount);
         } else if (narrativeDescOfGoodsDetailsJSON.verb === 'REPALL') {
           let charCount = 0;
           const selectedJson: { verb: any; text: any } = {
             verb: narrativeDescOfGoodsDetailsJSON.verb,
             text: narrativeDescOfGoodsDetailsJSON.text
           };
           charCount = this.getEachNarrativeAmendCount( narrativeDescOfGoodsDetailsJSON.text, narrativeDescOfGoodsDetailsJSON.verb);
           this.updateNarrativeCount(narrativeType, charCount);
           this.descOfGoodscounter++;
           narrativeDescOfGoodsDetailsArray.push(selectedJson);
           this.obj = narrativeDescOfGoodsDetailsArray;
           form.get(mainSection).get(subSection).get(subSectionRepall).patchValue('Y');
           form.updateValueAndValidity();
         }
        }
          const obj1 = {};
          obj1[FccGlobalConstant.ITEMS] = this.obj;
          form.get(mainSection).get(subSection).get(subSectionAmendEditTextArea).patchValue(obj1);
          this.amendDraftChanges(obj, form);
          form.updateValueAndValidity();
        }
      }
    }

  // below method checks if any empty amend narrative panels are existing, and accordingly creates new panel
  getFinalNewKeyName(form: FCCFormGroup, amendEditTextAreaKey: string, i: number, fieldObj: any, newName: string): any {
    let newKeyFinal;
    for (let j = i; j > 0; j--) {
      const prevName = amendEditTextAreaKey + (j - 1);
      if (this.commonService.isNonEmptyField(prevName, form) && (form.get(prevName).value) === '') {
        form.removeControl(prevName);
        newKeyFinal = prevName;
      }
      else if (!this.commonService.isNonEmptyField(prevName, form)) {
        newKeyFinal = prevName;
      }
    }
    if (this.commonService.isNonEmptyValue(newKeyFinal)) {
      form.removeControl(newName);
      form.addControl(newKeyFinal, this.formControlService.getControl(fieldObj));
      form.get(newKeyFinal)[FccGlobalConstant.KEY] = newKeyFinal;
      form.get(newKeyFinal)[this.params][FccGlobalConstant.RENDERED] = true;
      form.get(newKeyFinal)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
    }
    return newKeyFinal;
  }

  expansionPanelSplitValueLC(form1: any) {
    const goodsandDoc = 'goodsandDoc';
    const descOfGoods = 'descOfGoods';
    const docRequired = 'docRequired';
    const additionallnstruction = 'additionallnstruction';
    const otherDetails = 'otherDetails';
    const specialPaymentNarrativeBene = 'specialPaymentNarrativeBene';
    if(form1 !== null){}
    this.descOfGoodsLoad(form1, goodsandDoc, descOfGoods, FccGlobalConstant.LIST_INQUIRY);
    this.docRequiredLoad(form1, goodsandDoc, docRequired, FccGlobalConstant.LIST_INQUIRY);
    this.additionallnstructionLoad(form1, goodsandDoc, additionallnstruction, FccGlobalConstant.LIST_INQUIRY);
    this.specialPaymentNarrativeBeneLoad(form1, otherDetails, specialPaymentNarrativeBene, FccGlobalConstant.LIST_INQUIRY);
  }

  expansionPanelSplitValueSI(form1: any) {
    const siGoodsandDoc = 'siGoodsandDoc';
    const siDescOfGoods = 'siDescOfGoods';
    const siDocRequired = 'siDocRequired';
    const siAdditionallnstruction = 'siAdditionallnstruction';
    const siOtherDetails = 'siOtherDetails';
    const siSpecialPaymentNarrativeBene = 'siSpecialPaymentNarrativeBene';
    this.descOfGoodsLoad(form1, siGoodsandDoc, siDescOfGoods, FccGlobalConstant.LIST_INQUIRY);
    this.docRequiredLoad(form1, siGoodsandDoc, siDocRequired, FccGlobalConstant.LIST_INQUIRY);
    this.additionallnstructionLoad(form1, siGoodsandDoc, siAdditionallnstruction, FccGlobalConstant.LIST_INQUIRY);
    this.specialPaymentNarrativeBeneLoad(form1, siOtherDetails, siSpecialPaymentNarrativeBene, FccGlobalConstant.LIST_INQUIRY);
   }
// Update the master value in UI for the narratives
   updateMasterData(form: any, narrativeControl: any, masterControl: any)
   {
    const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    const action = this.commonService.getQueryParametersFromKey(FccGlobalConstant.ACTION);
    if ((productCode === 'EL' || productCode === 'SR') && form.get(narrativeControl)) {
      form.get(narrativeControl).setValue('');
    }
    let masterNarrativeDetails;
    let issuanceData = '';
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const operation = this.commonService.getQueryParametersFromKey('operation');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tnxId = this.commonService.getQueryParametersFromKey('tnxid') ? this.commonService.getQueryParametersFromKey('tnxid') :
     this.commonService.getQueryParametersFromKey('tnxId') ;
    if (form.get(masterControl) &&
     form.get(masterControl).value !== null &&
     form.get(masterControl).value !== '' &&
     form.get(masterControl).value !== undefined) {
      masterNarrativeDetails = form.get(masterControl).value;
      const amendDetails = [];
      if (masterNarrativeDetails) {
        const masterNarrativeDetailsJSON = JSON.parse(masterNarrativeDetails);
        if (masterNarrativeDetailsJSON.issuance && masterNarrativeDetailsJSON.issuance.sequence
          && masterNarrativeDetailsJSON.issuance.data && masterNarrativeDetailsJSON.issuance.data.datum
          && masterNarrativeDetailsJSON.issuance.data.datum.text) {
            const selectedField = this.formControlService.setValueArray(masterNarrativeDetailsJSON.issuance.sequence,
            masterNarrativeDetailsJSON.issuance.data.datum);
            if (this.option !== FccGlobalConstant.TEMPLATE && action !== 'approve' && operation !== 'LIST_INQUIRY'
              && productCode !== 'EL') {
              issuanceData = this.translate.instant('ISSUANCE').concat(`\n`);
            }
            form.get(narrativeControl).setValue(issuanceData.concat(this.commonService.decodeHtml(selectedField.value)));
        }
        if (masterNarrativeDetailsJSON.amendments && masterNarrativeDetailsJSON.amendments.amendment) {
          if (Array.isArray(masterNarrativeDetailsJSON.amendments.amendment)) {
            masterNarrativeDetailsJSON.amendments.amendment.forEach(element => {
              const selectedJson: { verb: any; sequence: any, data: any, datum: any } = {
               verb : element.verb,
                sequence: element.sequence,
                data: element.data,
                datum: element.datum
              };
              amendDetails.push(selectedJson);
            });
          } else {
            const selectedJson1: { verb: any; sequence: any, data: any, datum: any } = {
              verb : masterNarrativeDetailsJSON.amendments.amendment.verb,
               sequence: masterNarrativeDetailsJSON.amendments.amendment.sequence,
               data: masterNarrativeDetailsJSON.amendments.amendment.data,
               datum: masterNarrativeDetailsJSON.amendments.amendment.datum
            };
            amendDetails.push(selectedJson1);
          }
          let amendNarrative;
          if (form.get(narrativeControl).value === null) {
            form.get(narrativeControl).setValue(FccGlobalConstant.EMPTY_STRING);
          }
          for (let i = 0; i < amendDetails.length; i++) {
                    if (amendDetails[i].sequence && amendDetails[i].data && amendDetails[i].data.datum) {
                      const selectedField1 = this.formControlService.setValueArray(amendDetails[i].sequence, amendDetails[i].data.datum);
                      amendNarrative = `\n`.concat(FccTradeFieldConstants.NEW_LINE).concat(`\n`).
                      concat(selectedField1.label).concat(`\n`).concat(this.commonService.decodeHtml(selectedField1.value));
                      form.get(narrativeControl).setValue(form.get(narrativeControl).value.concat(amendNarrative));

                  }

                    }
                }
              }
      if(form.get(narrativeControl) !== null){
      this.formControlService.setValueByType(form.get(narrativeControl), form.get(narrativeControl).value);
      form.get(narrativeControl).updateValueAndValidity();
    }
   }
  }

  decodeHtmlFromAmendNarrative(tnxTypeCode, key, form, counter){
    if (tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      for (let i = 0; i < counter; i++) {
        const narrativeTextValue = this.commonService.decodeHtml(form.get(key + i).value);
        form.get(key + i).setValue(narrativeTextValue);
        form.get(key + i).updateValueAndValidity();
      }
    }
  }
}
