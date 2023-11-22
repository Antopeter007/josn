import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { ActivatedRoute } from '@angular/router';
import { LcConstant } from '../../../corporate/trade/lc/common/model/constant';
import { ProductComponent } from '../product-component/product.component';
import { ProductStateService } from '../../../corporate/trade/lc/common/services/product-state.service';
import { FCCFormControl, FCCFormGroup } from '../../../base/model/fcc-control.model';
import { PdfGeneratorService } from '../../services/pdf-generator.service';
import { TabPanelService } from '../../services/tab-panel.service';
import { FormAccordionPanelService } from '../../services/form-accordion-panel.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-review-transaction-details',
  templateUrl: './review-transaction-details.component.html',
  styleUrls: ['./review-transaction-details.component.scss']
})
export class ReviewTransactionDetailsComponent implements OnInit, OnDestroy {

  lcConstant = new LcConstant();
  transactionId;
  referenceId;
  mode;
  productCode;
  params: any = {};
  @Input()
  eventRequiredForEnquiry: any;
  @Input()
  htmlwidgetDetails: any;
  widgets;
  widgetDetails: any;
  dir: string = localStorage.getItem('langDir');
  pdfData: Map<string, FCCFormGroup>;
  sectionNames: string[];
  tabSectionControlMap: Map<string, Map<string, FCCFormControl>>;
  modelJson: any;
  accordionSectionsList: string[] = [];
  eventSubTnxTypeCode: any;
  subProductCode: any;
  tnxTypeCode: any;
  operation: any;
  eventTnxStatCode: any;
  control: any;
  valueStr = 'value';
  label = 'label';
  value : string;
  options = 'options';
  @ViewChild(ProductComponent) protected productComponent: ProductComponent;

  constructor(protected activatedRoute: ActivatedRoute, protected stateService: ProductStateService,
              protected pdfGeneratorService: PdfGeneratorService, protected tabPanelService: TabPanelService,
              protected formAccordionPanelService: FormAccordionPanelService, protected commonService: CommonService) {
  }

  ngOnInit(): void {

    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    if (this.widgetDetails === undefined || this.widgetDetails === '') {
      this.widgets = this.htmlwidgetDetails ? JSON.parse(this.htmlwidgetDetails) : '';
    }
    const tnxid = 'tnxid';
    const referenceid = 'referenceid';
    const modeValue = 'mode';
    const prodCode = 'productCode';
    const componentType = 'componentType';
    const accordionViewRequired = 'accordionViewRequired';
    const eventTypeCode = 'eventTypeCode';
    this.activatedRoute.queryParams.subscribe(params => {
      this.transactionId = params[tnxid];
      this.referenceId = params[referenceid];
      this.productCode = this.referenceId.substring(FccGlobalConstant.LENGTH_0, FccGlobalConstant.LENGTH_2);
      this.subProductCode = params[FccGlobalConstant.SUB_PRODUCT_CODE];
      this.tnxTypeCode = params[FccGlobalConstant.TNX_TYPE_CODE];
      this.operation = params[FccGlobalConstant.OPERATION];
      this.eventTnxStatCode = params[FccGlobalConstant.eventTnxStatCode];
    });
    this.mode = 'view';
    this.params[prodCode] = this.productCode;
    this.params[modeValue] = this.mode;
    this.params[FccGlobalConstant.refId] = this.referenceId;
    this.params[FccGlobalConstant.tnxId] = this.transactionId;
    this.params[componentType] = 'summaryDetails';
    this.params[accordionViewRequired] = true;
    this.params[FccGlobalConstant.eventRequired] = false;
    this.params[FccGlobalConstant.eventsForTransactionTab] = false;
    this.params[FccGlobalConstant.transactionTab] = true;
    this.params[FccGlobalConstant.eventTab] = false;
    if (this.eventRequiredForEnquiry === true) {
      this.params[FccGlobalConstant.eventRequired] = true;
    }
    if (this.transactionId !== undefined && this.transactionId !== '') {
      this.params[FccGlobalConstant.reviewTnxStateCode] = this.widgets.transactionCode.body.tnx_stat_code;
      this.params[FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE] = String(this.widgets.transactionCode.body.sub_tnx_type_code);
      this.params[eventTypeCode] = String(this.widgets.transactionCode.body.tnx_type_code);
      this.params[FccGlobalConstant.reviewActionReqCode] = undefined;
      this.params[FccGlobalConstant.reviewprodStatCode] = this.widgets.transactionCode.body.prod_stat_code;
      if (this.widgets.transactionCode.body.tnx_type_code === FccGlobalConstant.N002_REPORTING ) {
      this.params[FccGlobalConstant.eventsForTransactionTab] = true;
      this.params[FccGlobalConstant.reviewActionReqCode] = this.widgets.transactionCode.body.action_req_code;
      }
    }
  }

  ngOnDestroy() {
    this.transactionId = null;
    this.referenceId = null;
    this.productCode = null;
    this.subProductCode = null;
    this.mode = null;
    this.tnxTypeCode = null;
    this.operation = null;
    this.eventTnxStatCode = null;
    this.commonService.pdfDecodeValue = false;
  }

  checkEmit(refId, tnxId, eventTypeCode, subTxnTypeCode, tnxStatusCode, actionReqCode, prodStatCode) {
    const loadEventPage = 'loadEventPage';
    this.params[FccGlobalConstant.tnxId] = tnxId;
    this.params[FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE] = subTxnTypeCode;
    this.params[loadEventPage] = true;
    this.params[FccGlobalConstant.transactionTab] = false;
    this.params[FccGlobalConstant.eventTab] = true;
    this.params[FccGlobalConstant.eventTnxStatCode] = tnxStatusCode;
    this.params[FccGlobalConstant.eventActionReqCode] = actionReqCode;
    this.params[FccGlobalConstant.eventprodStatCode] = prodStatCode;
    this.productComponent.loadForEvent(refId, tnxId, eventTypeCode, this.params);
  }

  OnEnterKey(event) {
    if (event.code === 'Enter') {
      this.downloadPDF();
    }
  }

  downloadPDF() {
    this.modelJson = this.stateService.getProductModel();
    this.populatePDFData();
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
      this.eventTnxStatCode,
      FccGlobalConstant.EMPTY_STRING
    );
  }

  populatePDFData() {
    this.pdfData = new Map();
    this.sectionNames = this.stateService.getSectionNames();
    this.sectionNames.forEach(sectionName => {
      if (this.modelJson[sectionName] !== undefined && this.tabPanelService.isTabPanel(this.modelJson[sectionName])) {
        this.setSectionNameForTab(sectionName);
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
            let previewScreen = subSectionControl[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN];
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

  setSectionNameForTab(sectionName: any) {
    this.tabPanelService.initializeMaps(sectionName, this.stateService.getSectionData(sectionName, this.productCode));
    this.tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
    if (this.tabSectionControlMap.has(sectionName)) {
      const tabForm = new FCCFormGroup({});
      for (const [fieldName, control] of this.tabSectionControlMap.get(sectionName)) {
        let previewScreen = control[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN];
        previewScreen = previewScreen === false ? false : true;
        const typeVal = control.type;
        const val = control.value;
        if (typeVal === FccGlobalConstant.inputDropdown && control[this.options]) {
          this.commonService.dropdownOption(control,val);
      }
        if (fieldName && previewScreen) {
          tabForm.addControl(fieldName, control);
        }
      }
      this.pdfData.set(sectionName, tabForm);
    }
  }

}
