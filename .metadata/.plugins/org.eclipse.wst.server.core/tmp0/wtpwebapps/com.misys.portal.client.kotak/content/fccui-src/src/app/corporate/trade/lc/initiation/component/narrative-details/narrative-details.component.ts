import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { LcConstant } from '../../../common/model/constant';
import { ProductStateService } from '../../../common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { FormControlService } from '../../services/form-control.service';
import { LcReturnService } from '../../services/lc-return.service';
import { PrevNextService } from '../../services/prev-next.service';
import { UtilityService } from '../../services/utility.service';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from './../../../../../../common/core/fcc-global-constant.service';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../../common/services/form-model.service';
import { LcTemplateService } from './../../../../../../common/services/lc-template.service';
import { SaveDraftService } from './../../../common/services/save-draft.service';
import { NarrativeService } from './../../services/narrative.service';
import { LcProductComponent } from './../lc-product/lc-product.component';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { LcProductService } from '../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'fcc-trade-narrative-details',
  templateUrl: './narrative-details.component.html',
  styleUrls: ['./narrative-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: NarrativeDetailsComponent }]
})
export class NarrativeDetailsComponent extends LcProductComponent implements OnInit, AfterViewInit, OnDestroy {

  form: FCCFormGroup;
  lcConstant = new LcConstant();
  module: string;
  modeOfTransmission;
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  maxLength = this.lcConstant.maxlength;
  allowedCharCount = this.lcConstant.allowedCharCount;
  descOfGoodscounter = this.lcConstant.zero;
  ownerDocument = 'ownerDocument';
  var: any;
  tnxTypeCode: any;
  obj: any;
  docRequiredMandatory;
  config;
  mode: any;
  goodsandDoc = 'goodsandDoc';
  descOfGoods = 'descOfGoods';
  AmendEditTextArea = 'descOfGoodsAmendEditTextArea';
  descOfGoodsRepAll = 'descOfGoodsRepAll';
  descOfGoodsAmendHistoryHeader = 'descOfGoodsAmendHistoryHeader';
  descOfGoodsAmendmentPanel = 'descOfGoodsAmendmentPanel';
  narrativeDescOfGoodsDetails: any;
  mainSection = 'mainSection';
  subSection = 'subSection';
  subSectionNarrativeCount = 'subSectionNarrativeCount';
  subSectionAmendEditTextArea = 'subSectionAmendEditTextArea';
  subSectionRepall = 'subSectionRepall';
  subSectionAmendHistoryHeader = 'subSectionAmendHistoryHeader';
  subSectionAmendPanel = 'subSectionAmendPanel';
  subSectionAmendExitTextAreaRead = 'subSectionAmendExitTextAreaRead';
  masterData = 'masterData';
  masterDataView = 'masterDataView';
  mainText = 'mainText';
  isMasterRequired: any;
  option: any;
  swiftExtendedNarrativeEnable: any;

  constructor(protected commonService: CommonService,
              protected translationService: TranslateService,
              protected router: Router,
              protected lcReturnService: LcReturnService,
              protected leftSectionService: LeftSectionService,
              protected utilityService: UtilityService,
              protected prevNextService: PrevNextService,
              protected saveDraftService: SaveDraftService,
              protected lcTemplateService: LcTemplateService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected emitterService: EventEmitterService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected stateService: ProductStateService,
              protected narrativeService: NarrativeService,
              protected fccBusinessConstantsService: FccBusinessConstantsService,
              protected elementRef: ElementRef,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService,
              protected amendCommonService: AmendCommonService,
              protected resolverService: ResolverService,
              protected fileList: FilelistService,
              protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected lcProductService: LcProductService
) {
    super(emitterService, stateService, commonService, translationService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
    this.module = translationService.instant('narrativeDetails');
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.isMasterRequired = this.isMasterRequired;

    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.form = this.stateService.getSectionData(FccGlobalConstant.NARRATIVE_DETAILS, undefined, this.isMasterRequired);
    if(this.tnxTypeCode === FccGlobalConstant.N002_AMEND){
      this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.updateMasterNarrativesToAmendScreen(this.form);
    }
    this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND &&
      this.option !== FccGlobalConstant.TEMPLATE)
    {
      this.narrativeService.handleAmendNarrativeDraft(
        this.descOfGoodsJsonObject(),
        this.form,
        FccGlobalConstant.N009_NARRATIVE_DESCRIPTION_GOODS
      );

    this.narrativeService.handleAmendNarrativeDraft(
      this.docReqJsonObject(),
      this.form,
      FccGlobalConstant.N009_NARRATIVE_DOCUMENTS_REQUIRED
    );

    this.narrativeService.handleAmendNarrativeDraft(
      this.addInstJsonObject(),
      this.form,
      FccGlobalConstant.N009_NARRATIVE_ADDITIONAL_INSTRUCTIONS
    );

    this.narrativeService.handleAmendNarrativeDraft(
      this.spcPayJsonObject(),
      this.form,
      FccGlobalConstant.N009_NARRATIVE_SPECIAL_PAYMENT_CONDITIONS_BENEFICIARY
    );

    }
    
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.docRequiredMandatory = response.docReqMandatory;
        this.swiftExtendedNarrativeEnable = response.swiftExtendedNarrativeEnable;
      }
    });
    // -------------------------------------------------------------
    this.narrativeService.descriptionOfGoodsSubject.subscribe(charLength => {
      this.narrativeService.getGoodsAndDescData().subscribe(data => {
        this.narrativeService.goodAndDocsCount = data;
      });
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      if (this.swiftExtendedNarrativeEnable) {
      this.form.get('narrativeCount')[this.params][this.rendered] = true;
      this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
      (this.narrativeService.specialBeneCount === undefined ? 0 : this.narrativeService.specialBeneCount) +
      (this.narrativeService.documentReqCount === undefined ? 0 : this.narrativeService.documentReqCount) +
      (this.narrativeService.additionalInfoCount === undefined ? 0 : this.narrativeService.additionalInfoCount);
      } else {
        // Display individual narravtive text count, retained commented code for future reference
      //   if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT
      //       || (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT)) {
      //     this.form.get('narrativeCount')[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeNonSwiftCharLength();
      //   }
      //   else {
      //     this.form.get('narrativeCount')[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeSwiftCharLength();
      // }
        this.form.get('narrativeMessage')[this.params][this.rendered] = false;
        // this.form.get('narrativeCount')[this.params][this.rendered] = true;
        //  this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength
       }
      }
    });
    // --------------------------------------------------------------
    this.narrativeService.specialBeneSubject.subscribe(charLength => {
      this.narrativeService.getSpecialBeneData().subscribe(data => {
        this.narrativeService.specialBeneCount = data;
      });
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      if (this.swiftExtendedNarrativeEnable) {
      this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
      (this.narrativeService.documentReqCount === undefined ? 0 : this.narrativeService.documentReqCount) +
      (this.narrativeService.additionalInfoCount === undefined ? 0 : this.narrativeService.additionalInfoCount) +
      (this.narrativeService.goodAndDocsCount === undefined ? 0 : this.narrativeService.goodAndDocsCount);
      } else {
        if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT
          || (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT)) {
        this.form.get('narrativeCount')[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeNonSwiftCharLength();
      }
      else {
        this.form.get('narrativeCount')[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeSwiftCharLength();
      }
        this.form.get('narrativeMessage')[this.params][this.rendered] = false;
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength;
      }
      }
    });
    // ---------------------------------------------------------------
    this.narrativeService.documentReqSubject.subscribe(charLength => {
      this.narrativeService.getDocumentReqData().subscribe(data => {
        this.narrativeService.documentReqCount = data;
      });
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      if (this.swiftExtendedNarrativeEnable) {
      this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
      (this.narrativeService.specialBeneCount === undefined ? 0 : this.narrativeService.specialBeneCount) +
      (this.narrativeService.additionalInfoCount === undefined ? 0 : this.narrativeService.additionalInfoCount) +
      (this.narrativeService.goodAndDocsCount === undefined ? 0 : this.narrativeService.goodAndDocsCount);
      } else {
        if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT
          || (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT)) {
        this.form.get('narrativeCount')[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeNonSwiftCharLength();
      }
      else {
        this.form.get('narrativeCount')[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeSwiftCharLength();
      }
        this.form.get('narrativeMessage')[this.params][this.rendered] = false;
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength;
       }
      }
    });
    // ----------------------------------------------------------------
    this.narrativeService.additionalInfoSubject.subscribe(charLength => {
      this.narrativeService.getAdditionalInfoData().subscribe(data => {
        this.narrativeService.additionalInfoCount = data;
      });
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      if (this.swiftExtendedNarrativeEnable) {
      this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
      (this.narrativeService.specialBeneCount === undefined ? 0 : this.narrativeService.specialBeneCount) +
      (this.narrativeService.goodAndDocsCount === undefined ? 0 : this.narrativeService.goodAndDocsCount) +
      (this.narrativeService.documentReqCount === undefined ? 0 : this.narrativeService.documentReqCount);
      } else {
        if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT
          || (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT)) {
        this.form.get('narrativeCount')[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeNonSwiftCharLength();
      }
      else {
        this.form.get('narrativeCount')[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeSwiftCharLength();
      }
        this.form.get('narrativeMessage')[this.params][this.rendered] = false;
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength;
      }
      }
    });

    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.narrativeService.descriptionOfGoodsSubjectAmend.subscribe(charLength => {
        this.narrativeService.getGoodsAndDescDataAmend().subscribe(data => {
          this.narrativeService.goodAndDocsCountAmend = data;
        });
        if (this.swiftExtendedNarrativeEnable) {
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
          (this.narrativeService.specialBeneCountAmend === undefined ? 0 : this.narrativeService.specialBeneCountAmend) +
          (this.narrativeService.documentReqCountAmend === undefined ? 0 : this.narrativeService.documentReqCountAmend) +
          (this.narrativeService.additionalInfoCountAmend === undefined ? 0 : this.narrativeService.additionalInfoCountAmend);
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      } else {
        this.form.get('narrativeMessage')[this.params][this.rendered] = false;
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength;
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      }
      });
    // --------------------------------------------------------------
      this.narrativeService.specialBeneSubjectAmend.subscribe(charLength => {
        this.narrativeService.getSpecialBeneDataAmend().subscribe(data => {
          this.narrativeService.specialBeneCountAmend = data;
        });
        if (this.swiftExtendedNarrativeEnable) {
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
          (this.narrativeService.documentReqCountAmend === undefined ? 0 : this.narrativeService.documentReqCountAmend) +
          (this.narrativeService.additionalInfoCountAmend === undefined ? 0 : this.narrativeService.additionalInfoCountAmend) +
          (this.narrativeService.goodAndDocsCountAmend === undefined ? 0 : this.narrativeService.goodAndDocsCountAmend);
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      } else {
        this.form.get('narrativeMessage')[this.params][this.rendered] = false;
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = 0 +
        (this.narrativeService.goodAndDocsCount === undefined ? 0 : this.narrativeService.goodAndDocsCount);
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      }
      });
    // ---------------------------------------------------------------
      this.narrativeService.documentReqSubjectAmend.subscribe(charLength => {
        this.narrativeService.getDocumentReqDataAmend().subscribe(data => {
          this.narrativeService.documentReqCountAmend = data;
        });
        if (this.swiftExtendedNarrativeEnable) {
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
          (this.narrativeService.specialBeneCountAmend === undefined ? 0 : this.narrativeService.specialBeneCountAmend) +
          (this.narrativeService.additionalInfoCountAmend === undefined ? 0 : this.narrativeService.additionalInfoCountAmend) +
          (this.narrativeService.goodAndDocsCountAmend === undefined ? 0 : this.narrativeService.goodAndDocsCountAmend);
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      } else {
        this.form.get('narrativeMessage')[this.params][this.rendered] = false;
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength;
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      }
      });
    // ----------------------------------------------------------------
      this.narrativeService.additionalInfoSubjectAmend.subscribe(charLength => {
        this.narrativeService.getAdditionalInfoDataAmend().subscribe(data => {
          this.narrativeService.additionalInfoCountAmend = data;
        });
        if (this.swiftExtendedNarrativeEnable) {
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
          (this.narrativeService.specialBeneCountAmend === undefined ? 0 : this.narrativeService.specialBeneCountAmend) +
          (this.narrativeService.documentReqCountAmend === undefined ? 0 : this.narrativeService.documentReqCountAmend) +
          (this.narrativeService.goodAndDocsCountAmend === undefined ? 0 : this.narrativeService.goodAndDocsCountAmend);
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      } else {
        this.form.get('narrativeMessage')[this.params][this.rendered] = false;
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength;
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      }
      });
  }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      let amendTotalAllowedNarrativeCharCount;
      if (!this.swiftExtendedNarrativeEnable) {
        if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT
          || (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT)) {
            amendTotalAllowedNarrativeCharCount = this.narrativeService.getNarrativeNonSwiftCharLength();
          }
         else {
          amendTotalAllowedNarrativeCharCount = this.narrativeService.getNarrativeSwiftCharLength();
        }
      }
      else {
        amendTotalAllowedNarrativeCharCount = FccGlobalConstant.NARRATIVE_TOTAL_SWIFT_CHAR__AMEND_LENGTH;
      }
      this.form.get('narrativeCount')[this.params][this.allowedCharCount] = amendTotalAllowedNarrativeCharCount;
      this.amendFormFields();
      this.renderAmendNarrativeCount(this.descOfGoodsJsonObject(), amendTotalAllowedNarrativeCharCount);
      this.renderAmendNarrativeCount(this.docReqJsonObject(), amendTotalAllowedNarrativeCharCount);
      this.renderAmendNarrativeCount(this.addInstJsonObject(), amendTotalAllowedNarrativeCharCount);
      this.renderAmendNarrativeCount(this.spcPayJsonObject(), amendTotalAllowedNarrativeCharCount);
    }
  }
  updateNarrativeCountAllTabs(form: FCCFormGroup, totalNarrCountValue) {
    this.narrativeService.updateCumulativeAmendNarrativeCount(
      this.descOfGoodsJsonObject(),
      form,
      totalNarrCountValue
    );

    this.narrativeService.updateCumulativeAmendNarrativeCount(
      this.docReqJsonObject(),
      form,
      totalNarrCountValue
    );

    this.narrativeService.updateCumulativeAmendNarrativeCount(
      this.addInstJsonObject(),
      form,
      totalNarrCountValue
    );

    this.narrativeService.updateCumulativeAmendNarrativeCount(
      this.spcPayJsonObject(),
      form,
      totalNarrCountValue
    );
  }

  updateMasterNarrativesToAmendScreen(form: FCCFormGroup) {
    const tempMaster = this.stateService.getSectionData(FccGlobalConstant.NARRATIVE_DETAILS, undefined, true);
    const masterDescGoodsText =
      tempMaster.get(FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.NAR_TAB_CONTROL_DESC_OF_GOODS)
        .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DESC_OF_GOODS_TEXT) ?
        tempMaster.get(FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.NAR_TAB_CONTROL_DESC_OF_GOODS)
          .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DESC_OF_GOODS_TEXT).value :
        null;
    const masterDocsReqdText =
      tempMaster.get(FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.NAR_TAB_CONTROL_DOC_REQ).
        get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DOC_REQ_TEXT) ?
        tempMaster.get(FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.NAR_TAB_CONTROL_DOC_REQ)
          .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DOC_REQ_TEXT).value :
        null;
    const masterAddlInstnsText =
      tempMaster.get(FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.NAR_TAB_CONTROL_ADD_INST)
        .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT) ?
        tempMaster.get(FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.NAR_TAB_CONTROL_ADD_INST)
          .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT).value :
        null;
    const masterSplPaymentBeneText =
      tempMaster.get(FccGlobalConstant.NAR_TAB_OTHER_DETAILS).get(FccGlobalConstant.NAR_TAB_CONTROL_SPECIAL_BENE)
        .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT) ?
        tempMaster.get(FccGlobalConstant.NAR_TAB_OTHER_DETAILS).get(FccGlobalConstant.NAR_TAB_CONTROL_SPECIAL_BENE)
          .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT).value :
        null;

    form.get(FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.NAR_TAB_CONTROL_DESC_OF_GOODS)
      .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DESC_OF_GOODS_TEXT).setValue(masterDescGoodsText);
    form.get(FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.NAR_TAB_CONTROL_DOC_REQ)
      .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DOC_REQ_TEXT).setValue(masterDocsReqdText);

    if (form.get(this.goodsandDoc).get(FccGlobalConstant.NAR_TAB_CONTROL_ADD_INST)
      .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT) !== undefined &&
      form.get(this.goodsandDoc).get(FccGlobalConstant.NAR_TAB_CONTROL_ADD_INST)
        .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT) !== null) {
      form.get(this.goodsandDoc).get(FccGlobalConstant.NAR_TAB_CONTROL_ADD_INST)
        .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT).setValue(masterAddlInstnsText);
    }
    if (form.get(FccGlobalConstant.NAR_TAB_OTHER_DETAILS).get(FccGlobalConstant.NAR_TAB_CONTROL_SPECIAL_BENE)
      .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT) !== undefined &&
      form.get(FccGlobalConstant.NAR_TAB_OTHER_DETAILS).get(FccGlobalConstant.NAR_TAB_CONTROL_SPECIAL_BENE)
        .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT) !== null) {
      form.get(FccGlobalConstant.NAR_TAB_OTHER_DETAILS).get(FccGlobalConstant.NAR_TAB_CONTROL_SPECIAL_BENE)
        .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT).setValue(masterSplPaymentBeneText);
    }
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
    spcPayObj[this.mainText] = 'splPaymentBeneText';
    spcPayObj[this.masterData] = 'masterSplBene';
    spcPayObj[this.masterDataView] = 'masterSplBeneView';
    return spcPayObj;
    }

  onMatSectionChange(event, tabs: ElementRef) {
    if (event === FccGlobalConstant.LENGTH_0 ) {
      tabs[this.ownerDocument].body.querySelector('div .horMenuCssClass .sectionCol9 .section-top form .narrative-counter-class').
      style.display = 'block';
    }
    if (this.commonService.getClearBackToBackLCfields() === 'yes') {
      this.form.reset();
    }
  }



  amendFormFields() {
    this.form.get('narrativeCount')[this.params][this.rendered] = false;
    if ((this.mode !== FccGlobalConstant.VIEW_MODE && this.operation !== FccGlobalConstant.PREVIEW) ||
    (this.mode === FccGlobalConstant.VIEW_MODE && this.operation === FccGlobalConstant.LIST_INQUIRY)) {
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.NARRATIVE_DETAILS);
    }
  }

  renderAmendNarrativeCount(obj, amendTotalAllowedNarrativeCharCount) {
    const mainSection = obj[this.mainSection];
    const subSection = obj[this.subSection];
    const subSectionNarrativeCount = obj[this.subSectionNarrativeCount];
    this.form.get(mainSection).get(subSection).get(subSectionNarrativeCount)[this.params][this.rendered] = true;
    this.form.get(mainSection).get(subSection).get(subSectionNarrativeCount)[
      this.params
    ][this.allowedCharCount] = amendTotalAllowedNarrativeCharCount;
  }

  ngAfterViewInit() {
    const descGoods = this.form.value[FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS][
      FccGlobalConstant.NAR_TAB_CONTROL_DESC_OF_GOODS
    ][FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DESC_OF_GOODS_TEXT];

    const docReq = this.form.value[FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS][
      FccGlobalConstant.NAR_TAB_CONTROL_DOC_REQ
    ][FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DOC_REQ_TEXT];

    const additionalInstruct = this.form.value[FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS][
      FccGlobalConstant.NAR_TAB_CONTROL_ADD_INST
    ][FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT];

    const specialBene = this.form.value[FccGlobalConstant.NAR_TAB_OTHER_DETAILS][
      FccGlobalConstant.NAR_TAB_CONTROL_SPECIAL_BENE
    ][FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT];

    if (descGoods !== '' || descGoods !== undefined) {
      const countDescGoods = this.commonService.counterOfPopulatedData(descGoods);
      this.narrativeService.descriptionOfGoodsSubject.next(countDescGoods);
    }
    if (docReq !== '' || descGoods !== undefined) {
      const countDocReqs = this.commonService.counterOfPopulatedData(docReq);
      this.narrativeService.documentReqSubject.next(countDocReqs);
    }
    if (additionalInstruct !== '' || descGoods !== undefined) {
      const countAdditionalInstruct = this.commonService.counterOfPopulatedData(additionalInstruct);
      this.narrativeService.additionalInfoSubject.next(countAdditionalInstruct);
    }
    if (specialBene !== '' || descGoods !== undefined) {
      const countSpecialBene = this.commonService.counterOfPopulatedData(specialBene);
      this.narrativeService.specialBeneSubject.next(countSpecialBene);
    }
  }


  ngOnDestroy() {
    const docReqText = this.form.get(FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.NAR_TAB_CONTROL_DOC_REQ)
    .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DOC_REQ_TEXT).value;
    const dscOfGoods = this.form.get(FccGlobalConstant.NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.NAR_TAB_CONTROL_DESC_OF_GOODS)
      .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DESC_OF_GOODS_TEXT).value;

    if (this.docRequiredMandatory && this.narrativeService.callingDocReqComponent && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND
        && this.option !== FccGlobalConstant.TEMPLATE && (docReqText === '' || docReqText === null
        || dscOfGoods === '' || dscOfGoods === null)) {
      this.form.setErrors({ invalid: true });
    }
    this.stateService.setStateSection(FccGlobalConstant.NARRATIVE_DETAILS, this.form, this.isMasterRequired);
  }

}
