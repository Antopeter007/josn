import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from './../../../../../../common/core/fcc-global-constant.service';
import { TabPanelService } from './../../../../../../common/services/tab-panel.service';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { NarrativeService } from './../../../../../../corporate/trade/lc/initiation/services/narrative.service';
import { UtilityService } from './../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'app-si-narrative-details',
  templateUrl: './si-narrative-details.component.html',
  styleUrls: ['./si-narrative-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiNarrativeDetailsComponent }]
})
export class SiNarrativeDetailsComponent extends SiProductComponent implements OnInit, AfterViewInit, OnDestroy {

  form: FCCFormGroup;
  lcConstant = new LcConstant();
  module: string;
  modeOfTransmission;
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  maxLength = this.lcConstant.maxlength;
  allowedCharCount = this.lcConstant.allowedCharCount;
  ownerDocument = 'ownerDocument';
  tnxTypeCode: any;
  docRequiredMandatory;
  mode: any;
  goodsandDoc = 'siGoodsandDoc';
  descOfGoods = 'siDescOfGoods';
  AmendEditTextArea = 'descOfGoodsAmendEditTextArea';
  descOfGoodsRepAll = 'descOfGoodsRepAll';
  descOfGoodsAmendHistoryHeader = 'descOfGoodsAmendHistoryHeader';
  descOfGoodsAmendmentPanel = 'descOfGoodsAmendmentPanel';
  narrativeDescOfGoodsDetails: any;
  mainSection = 'mainSection';
  subSection = 'subSection';
  subSectionAmendEditTextArea = 'subSectionAmendEditTextArea';
  subSectionNarrativeCount = 'subSectionNarrativeCount';
  subSectionRepall = 'subSectionRepall';
  subSectionAmendHistoryHeader = 'subSectionAmendHistoryHeader';
  subSectionAmendPanel = 'subSectionAmendPanel';
  subSectionAmendExitTextAreaRead = 'subSectionAmendExitTextAreaRead';
  descOfGoodscounter = this.lcConstant.zero;
  requestLCType: any;
  var: any;
  obj: any;
  config;
  option: any;
  isMasterRequired: any;
  masterData = 'masterData';
  masterDataView = 'masterDataView';
  mainText = 'mainText';
  swiftExtendedNarrativeEnable: any;

  constructor(protected commonService: CommonService,
              protected translationService: TranslateService,
              protected utilityService: UtilityService,
              protected formControlService: FormControlService,
              protected emitterService: EventEmitterService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected stateService: ProductStateService,
              protected narrativeService: NarrativeService,
              protected fccBusinessConstantsService: FccBusinessConstantsService,
              protected elementRef: ElementRef,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService,
              protected resolverService: ResolverService,
              protected fileArray: FilelistService,
              protected dialogRef: DynamicDialogRef,
              protected tabPanelService: TabPanelService,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected amendCommonService: AmendCommonService, protected siProductService: SiProductService
) {
    super(emitterService, stateService, commonService, translationService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, siProductService);
    this.module = translationService.instant('siNarrativeDetails');
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.requestLCType = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('requestOptionsLC').value;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);

    this.form = this.stateService.getSectionData(FccGlobalConstant.SI_NARRATIVE_DETAILS);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.tnxTypeCode !== FccGlobalConstant.DRAFT_OPTION) {
      this.updateMasterNarrativesToAmendScreen(this.form);
    }
    if (this.requestLCType === FccGlobalConstant.REQUEST_OPTION_LC_FREE_FORMAT && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.form.get('freeFormatNarrativeText')[this.params][this.rendered] = true;
      if (!(this.option === FccGlobalConstant.TEMPLATE)) {
        this.form.get('freeFormatNarrativeText')[this.params][FccGlobalConstant.REQUIRED] = true;
      }
      this.form.get('siGoodsandDoc')[this.rendered] = false;
      this.form.get('siOtherDetails')[this.rendered] = false;
    }
    else {
    this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    this.isMasterRequired = this.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.form = this.stateService.getSectionData(FccGlobalConstant.SI_NARRATIVE_DETAILS, undefined, this.isMasterRequired);
    this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    this.form.get('narrativeTab')[this.params][this.rendered] = true;
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
    // this.form.get('narrativeCount')[this.params][this.rendered] = true;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.docRequiredMandatory = response.docReqMandatory;
        this.swiftExtendedNarrativeEnable = response.swiftExtendedNarrativeEnable;
      }
    });
    // --------------------------------------------------------------
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
        } else{
          this.form.get('narrativeMessage')[this.params][this.rendered] = false;
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
          this.form.get('narrativeCount')[this.params][this.rendered] = true;
          this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
          (this.narrativeService.documentReqCount === undefined ? 0 : this.narrativeService.documentReqCount) +
          (this.narrativeService.additionalInfoCount === undefined ? 0 : this.narrativeService.additionalInfoCount) +
          (this.narrativeService.goodAndDocsCount === undefined ? 0 : this.narrativeService.goodAndDocsCount);
        } else {
          this.form.get('narrativeMessage')[this.params][this.rendered] = false;
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
          this.form.get('narrativeCount')[this.params][this.rendered] = true;
          this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
          (this.narrativeService.specialBeneCount === undefined ? 0 : this.narrativeService.specialBeneCount) +
          (this.narrativeService.additionalInfoCount === undefined ? 0 : this.narrativeService.additionalInfoCount) +
          (this.narrativeService.goodAndDocsCount === undefined ? 0 : this.narrativeService.goodAndDocsCount);
        } else {
          this.form.get('narrativeMessage')[this.params][this.rendered] = false;
        }
      }
    });
    // ----------------------------------------------------------------
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.narrativeService.descriptionOfGoodsSubjectAmend.subscribe(charLength => {
        this.narrativeService.getGoodsAndDescDataAmend().subscribe(data => {
          this.narrativeService.goodAndDocsCountAmend = data;
        });
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
          (this.narrativeService.specialBeneCountAmend === undefined ? 0 : this.narrativeService.specialBeneCountAmend) +
          (this.narrativeService.documentReqCountAmend === undefined ? 0 : this.narrativeService.documentReqCountAmend) +
          (this.narrativeService.additionalInfoCountAmend === undefined ? 0 : this.narrativeService.additionalInfoCountAmend);
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      });
    // --------------------------------------------------------------
      this.narrativeService.specialBeneSubjectAmend.subscribe(charLength => {
        this.narrativeService.getSpecialBeneDataAmend().subscribe(data => {
          this.narrativeService.specialBeneCountAmend = data;
        });
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
          (this.narrativeService.documentReqCountAmend === undefined ? 0 : this.narrativeService.documentReqCountAmend) +
          (this.narrativeService.additionalInfoCountAmend === undefined ? 0 : this.narrativeService.additionalInfoCountAmend) +
          (this.narrativeService.goodAndDocsCountAmend === undefined ? 0 : this.narrativeService.goodAndDocsCountAmend);
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      });
    // ---------------------------------------------------------------
      this.narrativeService.documentReqSubjectAmend.subscribe(charLength => {
        this.narrativeService.getDocumentReqDataAmend().subscribe(data => {
          this.narrativeService.documentReqCountAmend = data;
        });
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
          (this.narrativeService.specialBeneCountAmend === undefined ? 0 : this.narrativeService.specialBeneCountAmend) +
          (this.narrativeService.additionalInfoCountAmend === undefined ? 0 : this.narrativeService.additionalInfoCountAmend) +
          (this.narrativeService.goodAndDocsCountAmend === undefined ? 0 : this.narrativeService.goodAndDocsCountAmend);
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      });
    // ----------------------------------------------------------------
      this.narrativeService.additionalInfoSubjectAmend.subscribe(charLength => {
        this.narrativeService.getAdditionalInfoDataAmend().subscribe(data => {
          this.narrativeService.additionalInfoCountAmend = data;
        });
        this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
          (this.narrativeService.specialBeneCountAmend === undefined ? 0 : this.narrativeService.specialBeneCountAmend) +
          (this.narrativeService.documentReqCountAmend === undefined ? 0 : this.narrativeService.documentReqCountAmend) +
          (this.narrativeService.goodAndDocsCountAmend === undefined ? 0 : this.narrativeService.goodAndDocsCountAmend);
        this.updateNarrativeCountAllTabs(this.form, this.form.get('narrativeCount')[this.params][this.enteredCharCount] );
      });
  }
    this.additionalInstNarrativeCount();
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
      const amendTotalAllowedNarrativeCharCount = this.narrativeService.getNarrativeTotalSwiftCharLength() -
                this.narrativeService.getNarrativeNonSwiftCharLength();
      this.form.get('narrativeCount')[this.params][this.allowedCharCount] = amendTotalAllowedNarrativeCharCount;
      this.renderAmendNarrativeCount(this.descOfGoodsJsonObject(), amendTotalAllowedNarrativeCharCount);
      this.renderAmendNarrativeCount(this.docReqJsonObject(), amendTotalAllowedNarrativeCharCount);
      this.renderAmendNarrativeCount(this.addInstJsonObject(), amendTotalAllowedNarrativeCharCount);
      this.renderAmendNarrativeCount(this.spcPayJsonObject(), amendTotalAllowedNarrativeCharCount);
    }
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
    const tempMaster = this.stateService.getSectionData(FccGlobalConstant.SI_NARRATIVE_DETAILS, undefined, true);
    if (tempMaster !== undefined){
    const masterDescGoodsText =
      tempMaster.get(FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_DESC_OF_GOODS)
      .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DESC_OF_GOODS_TEXT) ?
      tempMaster.get(FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_DESC_OF_GOODS)
      .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DESC_OF_GOODS_TEXT).value :
      null;
    const masterDocsReqdText =
      tempMaster.get(FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_DOC_REQ)
      .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DOC_REQ_TEXT) ?
      tempMaster.get(FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_DOC_REQ)
      .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DOC_REQ_TEXT).value :
      null;
    const masterAddlInstnsText =
    tempMaster.get(FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_ADD_INST)
    .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT) ?
      tempMaster.get(FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_ADD_INST)
      .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT).value :
      null;
    const masterSplPaymentBeneText =
      tempMaster.get(FccGlobalConstant.SI_NAR_TAB_OTHER_DETAILS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_SPECIAL_BENE).
      get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT) ?
      tempMaster.get(FccGlobalConstant.SI_NAR_TAB_OTHER_DETAILS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_SPECIAL_BENE).
      get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT).value :
      null;

    form.get(FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_DESC_OF_GOODS)
    .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DESC_OF_GOODS_TEXT).
    setValue(masterDescGoodsText);
    form.get(FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_DOC_REQ)
    .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DOC_REQ_TEXT).
    setValue(masterDocsReqdText);

    if (form.get(FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_ADD_INST).
      get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT) !== undefined &&
      form.get(FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_ADD_INST)
        .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT) !== null)
    {
      form.get(FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_ADD_INST)
        .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT).setValue(masterAddlInstnsText);
    }

    if (form.get(FccGlobalConstant.SI_NAR_TAB_OTHER_DETAILS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_SPECIAL_BENE)
      .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT) !== undefined &&
      form.get(FccGlobalConstant.SI_NAR_TAB_OTHER_DETAILS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_SPECIAL_BENE)
        .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT) !== null)
    {
      form.get(FccGlobalConstant.SI_NAR_TAB_OTHER_DETAILS).get(FccGlobalConstant.SI_NAR_TAB_CONTROL_SPECIAL_BENE)
        .get(FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT).setValue(masterSplPaymentBeneText);
    }
  }
  }

  descOfGoodsJsonObject(): any {
    const descOfGoodsObj = {};
    descOfGoodsObj[this.mainSection] = 'siGoodsandDoc';
    descOfGoodsObj[this.subSection] = 'siDescOfGoods';
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
    docReqObj[this.mainSection] = 'siGoodsandDoc';
    docReqObj[this.subSection] = 'siDocRequired';
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
    addInstObj[this.mainSection] = 'siGoodsandDoc';
    addInstObj[this.subSection] = 'siAdditionallnstruction';
    addInstObj[this.subSectionAmendEditTextArea] = 'addInstructionAmendEditTextArea';
    addInstObj[this.subSectionNarrativeCount] = 'addInstructionsTabNarrativeCount';
    addInstObj[this.subSectionRepall] = 'addInstructionRepAll';
    addInstObj[this.subSectionAmendHistoryHeader] = 'addInstructionAmendHistoryHeader';
    addInstObj[this.subSectionAmendPanel] = 'addInstructionAmendmentPanel';
    addInstObj[this.subSectionAmendExitTextAreaRead] = 'addInstAmendEditTextAreaRead';
    addInstObj[this.mainText] = 'splPaymentBeneText';
    addInstObj[this.masterData] = 'masterSplBene';
    addInstObj[this.masterDataView] = 'masterSplBeneView';
    return addInstObj;
  }

  spcPayJsonObject(): any {
    const spcPayObj = {};
    spcPayObj[this.mainSection] = 'siOtherDetails';
    spcPayObj[this.subSection] = 'siSpecialPaymentNarrativeBene';
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

  protected additionalInstNarrativeCount() {
    this.narrativeService.additionalInfoSubject.subscribe(charLength => {
      this.narrativeService.getAdditionalInfoData().subscribe(data => {
        this.narrativeService.additionalInfoCount = data;
      });
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        if (this.swiftExtendedNarrativeEnable) {
          this.form.get('narrativeCount')[this.params][this.rendered] = true;
          this.form.get('narrativeCount')[this.params][this.enteredCharCount] = charLength +
          (this.narrativeService.specialBeneCount === undefined ? 0 : this.narrativeService.specialBeneCount) +
          (this.narrativeService.goodAndDocsCount === undefined ? 0 : this.narrativeService.goodAndDocsCount) +
          (this.narrativeService.documentReqCount === undefined ? 0 : this.narrativeService.documentReqCount);
        }else{
          this.form.get('narrativeMessage')[this.params][this.rendered] = false;
        }
      }

    });
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
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.SI_NARRATIVE_DETAILS);
  }

  renderAmendNarrativeCount(obj, amendTotalAllowedNarrativeCharCount) {
    const mainSection = obj[this.mainSection];
    const subSection = obj[this.subSection];
    const subSectionNarrativeCount = obj[this.subSectionNarrativeCount];
    if (this.form.get(mainSection).get(subSection).get(subSectionNarrativeCount) != null){
      this.form.get(mainSection).get(subSection).get(subSectionNarrativeCount)[this.params][this.rendered] = true;
      this.form.get(mainSection).get(subSection).get(subSectionNarrativeCount)[
        this.params
      ][this.allowedCharCount] = amendTotalAllowedNarrativeCharCount;
    }
  }

  ngAfterViewInit() {
    const descGoods = this.form.value[FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS][
      FccGlobalConstant.SI_NAR_TAB_CONTROL_DESC_OF_GOODS
    ][FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DESC_OF_GOODS_TEXT];

    const docReq = this.form.value[FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS][
      FccGlobalConstant.SI_NAR_TAB_CONTROL_DOC_REQ
    ][FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DOC_REQ_TEXT];

    const additionalInstruct = this.form.value[FccGlobalConstant.SI_NAR_TAB_GOODS_AND_DOCS][
      FccGlobalConstant.SI_NAR_TAB_CONTROL_ADD_INST
    ][FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT];

    const specialBene =
      this.form.value[FccGlobalConstant.SI_NAR_TAB_OTHER_DETAILS][
        FccGlobalConstant.SI_NAR_TAB_CONTROL_SPECIAL_BENE
      ][FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT];

    if ((descGoods !== '' || descGoods !== undefined) && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND){
      const countDescGoods = this.commonService.counterOfPopulatedData(descGoods);
      this.narrativeService.descriptionOfGoodsSubject.next(countDescGoods);
    }
    if ((docReq !== '' || descGoods !== undefined) && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND){
      const countDocReqs = this.commonService.counterOfPopulatedData(docReq);
      this.narrativeService.documentReqSubject.next(countDocReqs);
    }
    if ((additionalInstruct !== '' || descGoods !== undefined) && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND){
      const countAdditionalInstruct = this.commonService.counterOfPopulatedData(additionalInstruct);
      this.narrativeService.additionalInfoSubject.next(countAdditionalInstruct);
    }
    if ((specialBene !== '' || descGoods !== undefined) && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND){
      const countSpecialBene = this.commonService.counterOfPopulatedData(specialBene);
      this.narrativeService.specialBeneSubject.next(countSpecialBene);
    }
  }

  ngOnDestroy() {
    if (this.docRequiredMandatory && this.narrativeService.callingDocReqComponent && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND
      && this.option !== FccGlobalConstant.TEMPLATE) {
      this.form.setErrors({ invalid: true });
    }
    this.stateService.setStateSection(FccGlobalConstant.SI_NARRATIVE_DETAILS, this.form, this.isMasterRequired);
  }
}
