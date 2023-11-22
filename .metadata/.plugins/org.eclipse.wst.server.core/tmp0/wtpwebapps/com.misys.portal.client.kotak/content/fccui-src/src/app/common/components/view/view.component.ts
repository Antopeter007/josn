import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FCCFormControl, FCCFormGroup } from '../../../base/model/fcc-control.model';
import { ProductStateService } from '../../../corporate/trade/lc/common/services/product-state.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';
import { FormAccordionPanelService } from '../../services/form-accordion-panel.service';
import { PdfGeneratorService } from '../../services/pdf-generator.service';
import { TabPanelService } from '../../services/tab-panel.service';
import { TransactionDetailService } from './../../services/transactionDetail.service';
import { ListDefService } from '../../services/listdef.service';
//import { DynamicDialogConfig } from 'primeng/dynamicdialog';
//import { ProductMappingService } from '../../services/productMapping.service';


interface CardData {
  value: string;
  viewValue: string;
  tnxCodeValue?: string;
  subTnxValue?: string;
  productStatCode?: string;
}
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {
  eventTnxStatCode: any;
  showSpinner = true;

  constructor(protected activatedRoute: ActivatedRoute, protected stateService: ProductStateService,
              protected pdfGeneratorService: PdfGeneratorService, protected tabPanelService: TabPanelService,
              public translate: TranslateService, protected commonService: CommonService, protected listService: ListDefService,
              protected transactionDetailService: TransactionDetailService,
              protected formAccordionPanelService: FormAccordionPanelService) { }
  transactionId;
  referenceId;
  tnxTypeCode;
  operation;
  mode;
  xmlName;
  filterParams;
  tnxIds: string[] = [];
  tnxIdList = new Map();
  refIdList = new Map();
  lastTnxId = '';
  amendedTransactionList = [];
  lastTnxType = '';
  selectedEvent: string;
  amendProductsList = [FccGlobalConstant.PRODUCT_LC, FccGlobalConstant.PRODUCT_SI, FccGlobalConstant.PRODUCT_BG,
    FccGlobalConstant.PRODUCT_EC];
  amendCompareVisible = false;
  currentTransactionSelected = {};
  productCode;
  subProductCode;
  eventRequiredForEnquiry: any;
  eventTypeCode = 'eventTypeCode';
  params: any = {};
  paramsForSecondCard: any = {};
  pdfData: Map<string, FCCFormGroup>;
  sectionNames: string[];
  tabSectionControlMap: Map<string, Map<string, FCCFormControl>>;
  readonly param = 'params';
  readonly grouphead = 'grouphead';
  readonly previewScreen = 'previewScreen';
  translateLabel = 'translate';
  translateValue = 'translateValue';
  dir: string = localStorage.getItem('langDir');
  modelJson: any;
  accordionSectionsList: string[] = [];
  eventSubTnxTypeCode: any;
  displayCode: any;
  tnxIdForAmend = 'tnxIdForAmend';
  previousTnxIdForAmend = 'previousTnxIdForAmend';
  secondCardData: CardData[] = [];
  transactionList = [];
  previousTnxId = '';
  previousTnxTypeCode = '';
  tradeProducts = [];
  amendCompare: boolean;
  viewScreen: boolean;
  issubprodapplicable:boolean = false;

  ngOnInit() {
    const tnxid = 'tnxid';
    const referenceid = 'referenceid';
    const modeValue = 'mode';
    const prodCode = 'productCode';
    const componentType = 'componentType';
    const accordionViewRequired = 'accordionViewRequired';
    const tnxTypeCode = 'tnxTypeCode';
    const operation = 'operation';
    const eventTnxStatCode = 'eventTnxStatCode';
    const eventSubTnxTypeCode = 'subTnxTypeCode';
    const subProductCode = 'subProductCode';
    this.viewScreen = true;
    this.activatedRoute.queryParams.subscribe(params => {
      if(params && params[referenceid]) {
        this.transactionId = params[tnxid];
        this.referenceId = params[referenceid];
        this.productCode = this.referenceId.substring(FccGlobalConstant.LENGTH_0, FccGlobalConstant.LENGTH_2);
        this.tnxTypeCode = params[tnxTypeCode];
        this.operation = params[operation];
        this.eventTnxStatCode = params[eventTnxStatCode];
        this.eventSubTnxTypeCode = params[eventSubTnxTypeCode];
        this.subProductCode = params[subProductCode];
        this.commonService.putQueryParameters('tnxid', this.transactionId);
      }
    });
    this.amendCompare = this.checkAmendNeeded();
    if (!this.amendCompare) {
      this.fetchPreviousTnxDetails();
    }
    this.mode = 'view';
    this.params[prodCode] = this.productCode;
    this.params[modeValue] = this.mode;
    this.params[FccGlobalConstant.refId] = this.referenceId;
    this.params[FccGlobalConstant.tnxId] = this.transactionId;
    this.params[componentType] = 'summaryDetails';
    this.params[accordionViewRequired] = true;
    this.params[tnxTypeCode] = this.tnxTypeCode;
    this.params[operation] = this.operation;
    this.params[eventTnxStatCode] = this.eventTnxStatCode;
    this.params[FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE] = this.eventSubTnxTypeCode;
    this.params[FccGlobalConstant.eventTab] = true;
    this.params[FccGlobalConstant.transactionTab] = true;
    this.displayCode = this.commonService.displayLabelByCode(this.productCode, this.subProductCode);
    if(FccGlobalConstant.subProdCode_for_actionCode.indexOf(this.subProductCode)>-1){
      this.issubprodapplicable = true;
    }
    if (this.amendCompare) {
      if (this.transactionId) {
        if(this.issubprodapplicable){
          this.fetchDetails(this.transactionId, this.productCode, this.subProductCode);
        }else{
          this.fetchDetails(this.transactionId, this.productCode);
        }
      } else if (this.referenceId) {
        if(this.issubprodapplicable){
          this.fetchDetails(this.referenceId,this.productCode, this.subProductCode, false, true);
        }else{
          this.fetchDetails(this.referenceId);
        }
      }
    }
    if(this.productCode === FccGlobalConstant.PRODUCT_LC ||
      this.productCode === FccGlobalConstant.PRODUCT_SI ||
      this.productCode === FccGlobalConstant.PRODUCT_EC ||
      this.productCode === FccGlobalConstant.PRODUCT_BG){
        this.fetchMasterDetails();
    }
  }

  fetchMasterDetails(){
    this.transactionDetailService.fetchTransactionDetails(this.referenceId).subscribe(response => {
      const responseObj = response.body;
      if (responseObj) {
        this.commonService.masterTnxResponse = responseObj;
      }
     });
  }
  checkAmendNeeded(){
    if(this.amendProductsList.includes(this.productCode)){
      if(this.tnxTypeCode === FccGlobalConstant.N002_AMEND
        && (this.eventTnxStatCode === FccGlobalConstant.N004_UNCONTROLLED || this.eventTnxStatCode === FccGlobalConstant.N004_CONTROLLED)){
        return false;
      } else {
        return true;
      }
    }
    return true;
  }

  fetchPreviousTnxDetails() {
    this.xmlName = this.commonService.getAmendXML(this.productCode);
    const refIdkey = 'ref_id';
    const refId = {};
    refId[refIdkey] = this.referenceId;
    this.filterParams = JSON.stringify(refId);
    const paginatorParams = {};
    this.listService.getTableData(this.xmlName, this.filterParams , JSON.stringify(paginatorParams))
      .subscribe(result => {
          if (result && this.transactionId && this.amendCompare) {
            if(this.issubprodapplicable){
              this.fetchDetails(this.transactionId, this.productCode, this.subProductCode);
            }else{
             this.fetchDetails(this.transactionId, this.productCode);
            }
          } else if (result && this.referenceId && this.amendCompare) {
            if(this.issubprodapplicable){
              this.fetchDetails(this.referenceId, this.productCode, this.subProductCode, false, true);
            }else{
              this.fetchDetails(this.referenceId);
            }
          }
        for (let i = 0; i < result.count; i++) {
          const TNX_ID = result.rowDetails[i].index.find(x => x.name == "tnx_id").value;
          if (this.tnxIds.indexOf(TNX_ID) === -1) {
            this.tnxIdList.set(i.toString(), result.rowDetails[i].index[1].value);
            this.tnxIds.push(TNX_ID);
            this.refIdList.set(i.toString(), result.rowDetails[i].index[0].value);
            this.lastTnxId = TNX_ID;
            this.transactionList.push({ 
              currentTnxId: TNX_ID, 
              tnxTypeCode: result.rowDetails[i].index.find(x => x.name == "tnx_type_code").value, 
              subTnxType: result.rowDetails[i].index.find(x => x.name == "sub_tnx_type_code").value, 
              productStatCode: result.rowDetails[i].index.find(x => x.name == "prod_stat_code").value
            });
            }
          }
          this.showSpinner = false;
        this.populateSecondCard();
      });
  }

  populateSecondCard() {
    const modeValue = 'mode';
    const prodCode = 'productCode';
    const componentType = 'componentType';
    const accordionViewRequired = 'accordionViewRequired';
    const tnxTypeCode = 'tnxTypeCode';
    const operation = 'operation';
    const eventTnxStatCode = 'eventTnxStatCode';
    this.paramsForSecondCard[prodCode] = this.productCode;
    this.paramsForSecondCard[modeValue] = this.mode;
    this.paramsForSecondCard[FccGlobalConstant.refId] = this.referenceId;
    this.paramsForSecondCard[FccGlobalConstant.tnxId] = this.transactionId;
    this.paramsForSecondCard[componentType] = 'summaryDetails';
    this.paramsForSecondCard[accordionViewRequired] = false;
    this.paramsForSecondCard[tnxTypeCode] = this.tnxTypeCode;
    this.paramsForSecondCard[operation] = this.operation;
    this.paramsForSecondCard[eventTnxStatCode] = this.eventTnxStatCode;
    this.paramsForSecondCard[FccGlobalConstant.eventTab] = false;
    this.paramsForSecondCard[this.tnxIdForAmend] = this.transactionId;
    this.paramsForSecondCard[this.previousTnxIdForAmend] = this.transactionList[0].currentTnxId;
  }

  private fetchDetails(id: any, productCode?: undefined, subProductCode?:undefined, isTemplate = false, isRefId = false) {
    this.transactionDetailService.fetchTransactionDetails(id, productCode, isTemplate, subProductCode, isRefId).toPromise()
      .then(response => {
      const responseObj = response.body;
      if (responseObj) {
        if (responseObj.prod_stat_code) {
          this.params[FccGlobalConstant.eventprodStatCode] = responseObj.prod_stat_code;
        }
        if (responseObj.tnx_stat_code) {
          this.params[FccGlobalConstant.eventTnxStatCode] = responseObj.tnx_stat_code;
        }
        if (responseObj.sub_tnx_type_code) {
          this.params[FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE] = responseObj.sub_tnx_type_code;
          this.showSpinner = false;
        }
        this.showSpinner = false;
      }
    });
  }

  ngAfterViewInit() {
    this.translate.get('corporatechannels').subscribe(() => {
      const loadForEventParams = {
        referenceId: this.referenceId,
        transactionId: this.transactionId,
        eventTnxTypeCode: this.tnxTypeCode,
        param: this.params,
        stateTypeNotReq: true
      };
      this.commonService.loadForEventValues.next(loadForEventParams);
    });
  }
  ngOnDestroy() {
    this.transactionId = null;
    this.referenceId = null;
    this.productCode = null;
    this.tnxTypeCode = null;
    this.mode = null;
    this.operation = null;
    this.eventTnxStatCode = null;
    this.commonService.pdfDecodeValue = false;
    this.commonService.masterTnxResponse = null;
  }

  OnEnterKey(event) {
    if (event.code === 'Enter') {
      this.downloadPDF();
    }
  }

  downloadPDF() {
    this.modelJson = this.stateService.getProductModel();
    this.populatePDFData();
    const language = localStorage.getItem('language');
    this.translate.use(language ? language : 'en' );
    this.translate.get('corporatechannels').subscribe(() => {
    // eslint-disable-next-line no-console
    console.log('to ensure that the translations are loaded via making this sequential call');
    this.pdfGeneratorService.createPDF(
      this.pdfData,
      this.modelJson,
      this.referenceId,
      this.productCode,
      FccGlobalConstant.VIEW_SCREEN,
      this.transactionId,
      this.subProductCode,
      this.operation,
      this.tnxTypeCode,
      this.eventTnxStatCode
    );
    });
  }

  populatePDFData() {
    this.pdfData = new Map();
    this.sectionNames = this.stateService.getSectionNames();
    this.sectionNames.forEach(sectionName => {
      if (this.modelJson[sectionName] !== undefined && this.tabPanelService.isTabPanel(this.modelJson[sectionName])) {
        this.tabPanelService.initializeMaps(sectionName, this.stateService.getSectionData(sectionName, this.productCode));
        this.tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
        if (this.tabSectionControlMap.has(sectionName)) {
          const tabForm = new FCCFormGroup({});
          for (const [fieldName, control] of this.tabSectionControlMap.get(sectionName)) {
            let previewScreen = control[this.param][this.previewScreen];
            previewScreen = previewScreen === false ? false : true;
            if (fieldName && previewScreen) {
              tabForm.addControl(fieldName, control);
            }
          }
          this.pdfData.set(sectionName, tabForm);
        }
      } else if (this.modelJson[sectionName] !== undefined &&
        this.formAccordionPanelService.isFormAccordionPanel(this.modelJson[sectionName], undefined, undefined)) {
        this.formAccordionPanelService.initializeFormAccordionMap(sectionName,
          this.stateService.getSectionData(sectionName, this.productCode));
        const accordionPanelForm = new FCCFormGroup({});
        const accordionSubSectionAndControlsListMap = this.formAccordionPanelService.getAccordionSubSectionAndControlsListMap();
        const subSectionControlsMap = accordionSubSectionAndControlsListMap.get(sectionName);
        subSectionControlsMap.forEach((subSectionControlsList: FCCFormControl[], subSectionName: string) => {
          const accordionPanelSubSectionForm = new FCCFormGroup({});
          subSectionControlsList.forEach((subSectionControl) => {
            let previewScreen = subSectionControl[this.param][this.previewScreen];
            previewScreen = previewScreen === false ? false : true;
            if (previewScreen) {
            accordionPanelSubSectionForm.addControl(subSectionControl.key, subSectionControl);
            }
          });
          accordionPanelForm.addControl(subSectionName, accordionPanelSubSectionForm);
        });
        this.accordionSectionsList.push(sectionName);
        this.pdfData.set(sectionName, accordionPanelForm);
      } else {
        const value: FCCFormGroup = this.stateService.getSectionData(sectionName, this.productCode);
        this.pdfData.set(sectionName, value);
      }
    });
    if (this.accordionSectionsList.length > 0) {
      this.pdfGeneratorService.setAccordionList(this.accordionSectionsList);
    }
  }
}

