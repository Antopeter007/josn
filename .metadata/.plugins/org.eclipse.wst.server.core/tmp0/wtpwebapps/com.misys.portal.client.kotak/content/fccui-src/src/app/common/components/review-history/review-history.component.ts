import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList, OnDestroy, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ListDefService } from '../../services/listdef.service';
import { FormatAmdNoService } from '../../services/format-amd-no.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from './../../../corporate/trade/lc/initiation/services/utility.service';
import { CommonService } from '../../services/common.service';
import { ReviewTransactionDetailsComponent } from '../review-transaction-details/review-transaction-details.component';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { Router } from '@angular/router';
import { AmendComparisonDialogComponent } from '../amend-comparison-dialog/amend-comparison-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductStateService } from '../../../corporate/trade/lc/common/services/product-state.service';
import { FCCFormControl, FCCFormGroup } from '../../../base/model/fcc-control.model';
import { PdfGeneratorService } from '../../services/pdf-generator.service';
import { TabPanelService } from '../../services/tab-panel.service';
import { FormAccordionPanelService } from '../../services/form-accordion-panel.service';
import { EnumMapping } from '../../../base/model/enum-mapping';
import { FormService } from '../../services/listdef-form-service';
import { FccListBoxComponent } from './../../../shared/FCCform/form-controls/modules/fcc-list-box/fcc-list-box.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-review-history',
  templateUrl: './review-history.component.html',
  styleUrls: ['./review-history.component.scss']
})
export class ReviewHistoryComponent implements OnInit, AfterViewInit, OnDestroy {
  widgetDetails: any;
  items;
  tnxID;
  refID;
  xmlName;
  productCode;
  filterParams;
  subTnxTypeCode = '';
  amdNo = '';
  boTnxId = '';
  boReleasedttm = '';
  tnxTypeCode = '';
  productStatusCode = '';
  actionReqCode = '';
  subProductCode = '';
  currentTnxId = '';
  iconValue;
  titleValue;
  labelValue;
  dateObject: any;
  dateParts: any;
  indexDetails: [] = [];
  events: SelectItem[] = [];
  response = false;
  responseValue = '';
  selectedEvent: string;
  dir: string = localStorage.getItem('langDir');
  tnxIdList = new Map();
  tnxIds: string[] = [];
  refIdList = new Map();
  entityList = new Map();
  actionReqCodeList = new Map();
  tnxTypeCodeList = new Map();
  subTnxTypeCodeList = new Map();
  subProductCodeList = new Map();
  crossChildTnxList = new Map();
  tnxStatusCodeList = new Map();
  prodStatusCodeList = new Map();
  respondTnxList = new Map();
  respondTnx = true;
  respond;
  crossChildTnx;
  tnxStatCode;
  prodStatCode;
  contextPath;
  pendingActionFuchsia;
  pendingActionGrey;
  params: any = {};
  flagTo = true;
  isMaker = false;
  currentTransactionSelected = {};
  amendedTransactionList = [];
  lastTnxId = '';
  lastTnxType = '';
  amendCompareVisible = false;
  dialogRef: any;
  amendProductsList = [FccGlobalConstant.PRODUCT_LC, FccGlobalConstant.PRODUCT_SI, FccGlobalConstant.PRODUCT_BG,
    FccGlobalConstant.PRODUCT_EL, FccGlobalConstant.PRODUCT_SR];
  operation: any;
  selectedEventRefId: any;
  selectedEventTnxId: any;
  selectedEventTnxTypeCode: any;
  selectedEventTnxStatCode: any;
  pdfData: Map<string, FCCFormGroup>;
  sectionNames: string[];
  tabSectionControlMap: Map<string, Map<string, FCCFormControl>>;
  modelJson: any;
  accordionSectionsList: string[] = [];
  eventSubTnxTypeCode: any;
  master: boolean;
  stateType: any;
  eventsTableData: any[] = [];
  eventsListColumns: any[] = [];
  eventsListFilterSectionJson: any[] = [];
  productCodeList = ['LC', 'IR','EL', 'TF','SI','SR','SG', 'FT', 'BR','BG', 'LI','IC','EC','LN','TD', 'SE'];

  pageSizeOptions = [];
  listBoxSortData:any[] = [];
  eventDataEmit:EventEmitter<any> = new EventEmitter<any>();
  paginatorSortData:any={};
  isCurrencySymbolDisplayEnabled = false;

  previousSortingData:any={};
  isAmountSort:boolean = false;
  entity: any;
  selectedEntity: any;
  selectedSubProdCode: any;

  @ViewChild(ReviewTransactionDetailsComponent) protected reviewTransactionDetailsComponent: ReviewTransactionDetailsComponent;
  @ViewChildren(ReviewTransactionDetailsComponent)
  protected reviewTransactionDetailsComponentList: QueryList<ReviewTransactionDetailsComponent>;
  @ViewChild(FccListBoxComponent) protected fccListBoxComponent: FccListBoxComponent;


  constructor(protected listService: ListDefService, protected formatAmdNoService: FormatAmdNoService,
              protected utilityService: UtilityService, protected translate: TranslateService, protected router: Router,
              protected commonService: CommonService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected dialogService: DialogService, protected stateService: ProductStateService,
              protected pdfGeneratorService: PdfGeneratorService, protected tabPanelService: TabPanelService,
              protected formAccordionPanelService: FormAccordionPanelService,protected listdefFormService: FormService) { }

  ngOnInit(): void {
    this.respond = `${this.translate.instant('respond')}`;
    this.items = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.refID = this.items.recordDetails.referenceId;
    this.productCode = this.items.recordDetails.productCode;
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.pendingActionFuchsia = this.contextPath + '/content/FCCUI/assets/icons/pendingActionFuchsia.svg';
    this.pendingActionGrey = this.contextPath + '/content/FCCUI/assets/icons/pendingActionGrey.svg';
    this.isCurrencySymbolDisplayEnabled = (localStorage.getItem(FccGlobalConstant.CUR_SYMBOL_ENABLED) === 'y');
    this.items.widgetData.displayTabs.forEach(element => {
      if (element.events) {
        this.xmlName = element.events.child.listdefPath;
      }
    });

    const refIdkey = 'ref_id';
    const refId = {};
    refId[refIdkey] = this.refID;
    this.filterParams = JSON.stringify(refId);
    const paginatorParams = {};
    const makerPermission = this.commonService.getPermissionName(this.productCode, 'save', this.subProductCode);
    this.commonService.getUserPermission(makerPermission).subscribe(result => {
      if (result) {
        this.isMaker = true;
      } else {
        this.isMaker = false;
      }
    });
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.pageSizeOptions = response.EventListPageOptions;
    });
    if (this.productCodeList.indexOf(this.productCode) >= 0) {
      this.listBoxSortData = this.commonService.getlistSortingData(this.productCode);
      this.listBoxSortData.map((res)=>{
              if(typeof res["name"] != "undefined"){
                  res.name = this.translate.instant(res.name);
              }
      });
      forkJoin({
        tableData: this.listService.getTableData(this.xmlName, this.filterParams , JSON.stringify(paginatorParams)),
        metaData: this.listService.getMetaData(this.xmlName, this.productCode, ''),
      }).subscribe(({ tableData, metaData }) => {
        this.setEventsListData(tableData);
        const eventsListMetadata = metaData;
        this.eventsListColumns = this.listdefFormService.prepareColumns(eventsListMetadata);
        this.eventsListColumns.length !=0 ? this.eventsListColumns.push('Event_Action') : '';
        this.eventsListFilterSectionJson = this.listdefFormService.getFields(eventsListMetadata, this.productCode);
        this.eventsListFilterSectionJson.push({
          name: 'cancel',
          type: 'button',
          localizationkey: 'cancel',
          key: 'cancel',
          styleClass: 'secondaryButton'
        });
        this.eventsListFilterSectionJson.push({
          name: 'applyFilter',
          type: 'button',
          localizationkey: 'applyFilter',
          key: 'applyFilter',
          styleClass: 'primaryButton'
        });
        this.respondButton(0);
        this.respondButtonforSeekBene();
        this.loadDataForPDF(this.eventsTableData[0], 0);
        this.eventDataEmit.next(this.eventsTableData);
    });
  }
  // TODO:: To be removed once implemented for all products
    if (this.productCodeList.indexOf(this.productCode) < 0) {
    this.listService.getTableData(this.xmlName, this.filterParams , JSON.stringify(paginatorParams))
    .subscribe(result => {
      for (let i = 0; i < result.count; i++) {
        if (this.tnxIds.indexOf(result.rowDetails[i].index[1].value) === -1) {
          this.tnxIdList.set(i.toString(), result.rowDetails[i].index[1].value);
          this.tnxIds.push(result.rowDetails[i].index[1].value);
          this.refIdList.set(i.toString(), result.rowDetails[i].index[0].value);
          this.lastTnxId = result.rowDetails[i].index[1].value;
          this.indexDetails = result.rowDetails[i].index;
          this.fetchValue();
          this.displayValue();
          this.actionReqCodeList.set(i.toString(), this.actionReqCode);
          this.tnxTypeCodeList.set(i.toString(), this.tnxTypeCode);
          this.subTnxTypeCodeList.set(i.toString(), this.subTnxTypeCode);
          this.subProductCodeList.set(i.toString(), this.subProductCode);
          this.crossChildTnxList.set(i.toString(), this.crossChildTnx);
          this.tnxStatusCodeList.set(i.toString(), this.tnxStatCode);
          this.prodStatusCodeList.set(i.toString(), this.prodStatCode);
          const event: { value: string, title: string, label: string, icon: string, styleClass: string} = {
          icon: this.iconValue,
          title: this.titleValue,
          label: this.labelValue,
          value: i.toString(),
          styleClass: this.responseValue
          };
          this.events.push(event);
        }
      }
      this.selectedEvent = this.events[0].value;
      this.amendedTransactionList.push({ currentTnxId: this.lastTnxId, tnxType: this.lastTnxType, tnxTypeCode: this.tnxTypeCode,
        subTnxType: this.subTnxTypeCode, productStatCode: this.prodStatCode });
        if (this.checkIfAmendTransaction(this.selectedEvent) && (this.selectedEvent !== (this.tnxIdList.size - 1).toString())) {
          if (this.amendProductsList.indexOf(this.productCode) !== -1) { // hiding-comparison-button-for-loan-screen
            this.amendCompareVisible = true;
            this.currentTransactionSelected = {
              tnxId: this.tnxIdList.get(this.selectedEvent),
              tnxType: this.getTnxType(this.selectedEvent),
              subTnxType: this.getSubTnxType(this.selectedEvent),
              productStatCode: this.getProductStatusCode(this.selectedEvent)
            };
          }
        } else {
          this.amendCompareVisible = false;
        }
      this.respondButton('0');
      this.respondButtonforSeekBene();
      this.setDataAtLoadForPDF();
    });
  }
  }

  ngAfterViewInit() {
    if (this.flagTo) {
      this.reviewTransactionDetailsComponentList.changes.subscribe(() => {
        if (this.flagTo) {
        this.reviewTransactionDetailsComponent.checkEmit(this.refIdList.get('0'), this.tnxIdList.get('0'),
                this.tnxTypeCodeList.get('0'), this.subTnxTypeCodeList.get('0'), this.tnxStatusCodeList.get('0'),
                this.actionReqCodeList.get('0'), this.prodStatusCodeList.get('0'));
        this.flagTo = false;
        if (this.amendedTransactionList.length > 1) {
          this.currentTransactionSelected = {
            tnxId: this.amendedTransactionList[0].currentTnxId,
            tnxType: this.amendedTransactionList[0].tnxType,
            subTnxType: this.amendedTransactionList[0].subTnxType,
            productStatCode: this.amendedTransactionList[0].productStatCode,
          };
        }
        if (this.checkIfAmendTransaction('0') && this.tnxIdList.size > 1 && this.amendProductsList.indexOf(this.productCode) !== -1) {
          this.amendCompareVisible = true;
        }
        }
      });
    }
  }

  // TODO :: remove after implemented for all products
  emitReview(selectedEvent) {
    this.respondButton(selectedEvent);
    const tnxIDKeys = this.tnxIdList.keys();
    let tnxId = tnxIDKeys.next();
    let flag = false;
    while (tnxId && tnxId.value !== undefined && tnxId.value !== null) {
      if (selectedEvent === tnxId.value) {
        flag = true;
        break;
      }
      tnxId = tnxIDKeys.next();
    }
    if (flag) {
      this.reviewTransactionDetailsComponent.checkEmit(this.refIdList.get(selectedEvent), this.tnxIdList.get(selectedEvent),
                     this.tnxTypeCodeList.get(selectedEvent), this.subTnxTypeCodeList.get(selectedEvent),
                     this.tnxStatusCodeList.get(selectedEvent), this.actionReqCodeList.get(selectedEvent),
                     this.prodStatusCodeList.get(selectedEvent));
    } else {
      this.reviewTransactionDetailsComponent.checkEmit(this.refIdList.get(selectedEvent), '',
                      this.tnxTypeCodeList.get(selectedEvent), this.subTnxTypeCodeList.get(selectedEvent),
                      this.tnxStatusCodeList.get(selectedEvent), this.actionReqCodeList.get(selectedEvent),
                      this.prodStatusCodeList.get(selectedEvent));
    }
    this.displayAmendComparisionButton(selectedEvent);
  }

  /**
   * This method renders the selected event details on the right side of the events tab.
   * Also displays respond and comparison button for applicable events.
   * @param selectedEvent
   */
  displayedSelectedEvent(selectedEvent) {
    const selectedEventIndex = selectedEvent.row_index;
    this.respondButton(selectedEventIndex);
    const tnxIDKeys = this.tnxIdList.keys();
    let tnxId = tnxIDKeys.next();
    let flag = false;
    while (tnxId && tnxId.value !== undefined && tnxId.value !== null) {
      if (selectedEventIndex === tnxId.value) {
        flag = true;
        break;
      }
      tnxId = tnxIDKeys.next();
    }

    if (flag) {
      this.reviewTransactionDetailsComponent.checkEmit(selectedEvent.ref_id, selectedEvent.tnx_id,
        this.tnxTypeCodeList.get(selectedEventIndex), selectedEvent.sub_tnx_type_code,
        this.tnxStatusCodeList.get(selectedEventIndex), selectedEvent.action_req_code,
        this.prodStatusCodeList.get(selectedEventIndex));
    } else {
      this.reviewTransactionDetailsComponent.checkEmit(selectedEvent.ref_id, '',
        this.tnxTypeCodeList.get(selectedEventIndex), selectedEvent.sub_tnx_type_code,
        this.tnxStatusCodeList.get(selectedEventIndex), selectedEvent.action_req_code,
        this.prodStatusCodeList.get(selectedEventIndex));
    }
    this.displayAmendComparisionButton(selectedEventIndex);
  }

  displaySelectedSortData(sortEvent) {
     const reqParams = sortEvent['value'];
     this.respondButton(0);
     this.respondButtonforSeekBene();
     if(reqParams._value[0]?.key != 'tnx_amt'){
      this.isAmountSort = false;
      this.previousSortingData = sortEvent;
      const sortedData = this.commonService.eventSorting(sortEvent.value,sortEvent.data);
      if (sortedData && sortedData.length > 0) {
        try {
        this.loadDataForPDF(sortedData[0], 0);
        this.selectedEvent = sortedData[0].row_index;
        this.displayAmendComparisionButton(this.selectedEvent);

        } catch (error) {}
      }
      this.eventDataEmit.next(sortedData);
      this.fccListBoxComponent.onSelectEvent(sortedData[0]);
     }else{
      this.isAmountSort = true;
      this.paginatorSortData = { sortField:reqParams._value[0]?.key,sortOrder:reqParams._value[0]?.value };
      this.listService.getTableData(this.xmlName, this.filterParams, JSON.stringify(this.paginatorSortData)).subscribe((tableData)=>{
         this.setEventsListData(tableData);
         if (this.eventsTableData && this.eventsTableData.length > 0) {
          try {
           this.loadDataForPDF(this.eventsTableData[0], 0);
           this.selectedEvent = this.eventsTableData[0].row_index;
           this.fccListBoxComponent.onSelectEvent(this.eventsTableData[0]);// To highlight first event on the left
           this.displayAmendComparisionButton(this.selectedEvent);

          } catch (error) {}
        }
         this.eventDataEmit.next(this.eventsTableData);

      });
     }
  }

  getTnxType(selectedEvent) {
    for (const tnx of this.amendedTransactionList) {
      if (tnx.currentTnxId === this.tnxIdList.get(selectedEvent)) {
        return tnx.tnxType;
      }
    }
    // if(this.tnxIdList.get(selectedEvent)) {
    //   return this.tnxIdList.get(selectedEvent);
    // }
    return 'Transaction';
  }
  getSubTnxType(selectedEvent) {
    for (const tnx of this.amendedTransactionList) {
      if (tnx.currentTnxId === this.tnxIdList.get(selectedEvent)) {
        return tnx.subTnxType;
      }
    }
    return '';
  }

  getProductStatusCode(selectedEvent)
  {
    for (const tnx of this.amendedTransactionList) {
      if (tnx.currentTnxId === this.tnxIdList.get(selectedEvent)) {
        return tnx.productStatCode;
      }
    }
    // if (this.prodStatusCodeList.get(selectedEvent)) {
    //   return this.prodStatusCodeList.get(selectedEvent);
    // }
    return '';
  }

  checkIfAmendTransaction(selectedEvent) {
    // for (const tnx of this.amendedTransactionList) {
    //   if (tnx.currentTnxId === this.tnxIdList.get(selectedEvent)) {
    //     return true;
    //   }
    // }
    // return false;
    this.selectedEventTnxTypeCode = this.tnxTypeCodeList.get(selectedEvent);
    if (this.selectedEventTnxTypeCode === FccGlobalConstant.N002_AMEND ||
      this.getProductStatusCode(selectedEvent) === FccGlobalConstant.N005_AMENDED) {
        return true;
      } else {
      return false;
    }
  }

  // TODO:: To remove after all products are moved to listing format
  fetchValue() {
    let data = { name: String, value: String };
    this.tnxTypeCode = '';
    this.subTnxTypeCode = '';
    this.productStatusCode = '';
    this.boReleasedttm = '';
    this.amdNo = '';
    this.boTnxId = '';
    this.entity = '';
    this.indexDetails.forEach( (details) => {
    data = details;
    if (data.name.toString() === FccGlobalConstant.TNXTYPECODE) {
      this.tnxTypeCode = data.value.toString();
    }
    if (data.name.toString() === FccGlobalConstant.SUB_TNX_TYPE_CODE) {
      this.subTnxTypeCode = data.value.toString();
    }
    if (data.name.toString() === FccGlobalConstant.PROD_STAT_CODE) {
      this.productStatusCode = data.value.toString();
    }
    if (data.name.toString() === FccGlobalConstant.BO_RELEASE_DTTM) {
      this.boReleasedttm = this.commonService.decodeHtml(data.value.toString());
    }
    if (data.name.toString() === FccGlobalConstant.AMD_NO) {
      this.amdNo = data.value.toString();
    }
    if (data.name.toString() === FccGlobalConstant.ACTION_REQ_CODE) {
      this.actionReqCode = data.value.toString();
    }
    if (data.name.toString() === FccGlobalConstant.subProductCode) {
      this.subProductCode = data.value.toString();
    }
    if (data.name.toString() === FccGlobalConstant.crossChildTnxID) {
      this.crossChildTnx = data.value.toString();
    }
    if (data.name.toString() === FccGlobalConstant.tnxStatusCode) {
      this.tnxStatCode = data.value.toString();
    }
    if (data.name.toString() === FccGlobalConstant.prodStatCode) {
      this.prodStatCode = data.value.toString();
    }
    if (data.name.toString() === 'tnx_id') {
      this.currentTnxId = data.value.toString();
    }
    if (data.name.toString() === FccGlobalConstant.BO_TNX_ID) {
      this.boTnxId = this.commonService.decodeHtml(data.value.toString());
    }
    if(data.name.toString() === FccGlobalConstant.ENTITY) {
      this.entity = data.value.toString();
    }
  });
}
  // @TODO::To remove after events listing implemented for all products
  displayValue() {
    let tnxType = '';
    let formattedDate = '';
    let subTnxType = '';
    let amdNoValue = '';
    this.iconValue = '';
    this.titleValue = '';
    this.labelValue = '';
    formattedDate = this.boReleasedttm;
    const applProdStatCode = [FccGlobalConstant.N005_ACCEPTED, FccGlobalConstant.N005_SETTLED, FccGlobalConstant.N005_DISCREPANT,
      FccGlobalConstant.N005_PART_SETTLED, FccGlobalConstant.N005_PART_SIGHT_PAID, FccGlobalConstant.N005_FULL_SIGHT_PAID,
      FccGlobalConstant.N005_INPROGRESS, FccGlobalConstant.N005_PAID, FccGlobalConstant.N005_GENERAL_REQUEST,
      FccGlobalConstant.N005_CLAIM_PRESENTATION, FccGlobalConstant.N005_CLAIM_SETTLEMENT, FccGlobalConstant.N005_CLAIM_ACCEPTED,
      FccGlobalConstant.N005_CLAIM_REJECTED, FccGlobalConstant.N005_AWAITING_DOCUMENTS, FccGlobalConstant.N005_CLAIM_REJECTION,
      FccGlobalConstant.N005_GENERAL_CLAIM_REQUEST, FccGlobalConstant.N005_DEFERRED_PAYMENT, FccGlobalConstant.N005_PRESENTATION];
    const applTnxTypeCode = [FccGlobalConstant.N002_ACCEPT, FccGlobalConstant.N002_SETTLE, FccGlobalConstant.N002_REPORTING,
        FccGlobalConstant.N002_INQUIRE];
    if (this.tnxTypeCode === FccGlobalConstant.LENGTH_15.toString() ||
     this.productStatusCode === FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL.toString()) {
      subTnxType = `${this.translate.instant('N005_' + this.productStatusCode)}`;
    }
    else if (this.subTnxTypeCode !== '' && this.subTnxTypeCode !== undefined &&
    this.tnxTypeCode !== FccGlobalConstant.LENGTH_15.toString()) {
    subTnxType = `${this.translate.instant('LIST_N003_' + this.subTnxTypeCode)}`;
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      tnxType = `${this.translate.instant('LIST_N002_' + this.tnxTypeCode)}`;
    } else {
      tnxType = `${this.translate.instant('N002_' + this.tnxTypeCode)}`;
    }
    if (this.productStatusCode && this.productStatusCode === FccGlobalConstant.N005_AMENDED && this.amdNo) {
      amdNoValue = this.formatAmdNoService.formatAmdNo(this.amdNo);
      if (amdNoValue !== undefined && amdNoValue !== null && amdNoValue !== '') {
        const iconValue = this.getProductSpecificTitle(tnxType, this.tnxTypeCode, true);
        this.iconValue = `${iconValue} ${amdNoValue}`;
      } else {
        this.iconValue = this.getProductSpecificTitle(tnxType, this.tnxTypeCode, true);
      }
    } else {
      this.iconValue = this.getProductSpecificTitle(tnxType, this.tnxTypeCode, true);
    }
    this.lastTnxType = tnxType;
    if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
      ((this.productCode === FccGlobalConstant.PRODUCT_EL || this.productCode === FccGlobalConstant.PRODUCT_SR)
       && this.tnxTypeCode === FccGlobalConstant.N002_REPORTING ))
        && this.productStatusCode &&
        this.productStatusCode === FccGlobalConstant.N005_AMENDED ||
       ((this.productCode === FccGlobalConstant.PRODUCT_EL || this.productCode === FccGlobalConstant.PRODUCT_SR) &&
        this.productStatusCode === FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL) &&
        this.tnxStatCode === FccGlobalConstant.N004_ACKNOWLEDGED && this.currentTnxId) {
          let tempTnxType = `${this.translate.instant('LIST_N002_' + this.tnxTypeCode)}`;
          if (this.amdNo) {
            amdNoValue = this.formatAmdNoService.formatAmdNo(this.amdNo);
            tempTnxType = `${tempTnxType} ${amdNoValue}`;
          }
          this.amendedTransactionList.push({ currentTnxId: this.currentTnxId, tnxType: tempTnxType, tnxTypeCode: this.tnxTypeCode,
             subTnxType: this.subTnxTypeCode, productStatCode: this.prodStatCode });
    }
    if (this.actionReqCode !== '' && this.crossChildTnx === '') {
      this.responseValue = this.actionReqCode;
    } else {
      this.responseValue = '';
    }
    if (applProdStatCode.includes(this.productStatusCode) && applTnxTypeCode.includes(this.tnxTypeCode)){
      if (this.boTnxId !== undefined && this.boTnxId !== null && this.boTnxId !== '') {
        const titleValue = this.getProductSpecificTitle(subTnxType, this.tnxTypeCode, false);
        this.titleValue = `${titleValue} ${this.boTnxId}`;
      } else {
        this.titleValue = this.getProductSpecificTitle(subTnxType, this.tnxTypeCode, false);
      }
    } else if ((this.productCode === FccGlobalConstant.PRODUCT_EL || this.productCode === FccGlobalConstant.PRODUCT_EC) &&
              (this.productStatusCode === FccGlobalConstant.N005_FINANCED ||
              this.productStatusCode === FccGlobalConstant.N005_ACCEPTED ||
              this.productStatusCode === FccGlobalConstant.N005_FINANCE_REJECTED) &&
              this.tnxTypeCode === FccGlobalConstant.N002_REPORTING) {
      if (this.commonService.isnonEMptyString(this.boTnxId)) {
        const titleValue = this.getProductSpecificTitle(subTnxType, this.tnxTypeCode, false);
        this.titleValue = `${titleValue} ${this.boTnxId}`;
      } else {
        this.titleValue = this.getProductSpecificTitle(subTnxType, this.tnxTypeCode, false);
      }
    } else {
      this.titleValue = this.getProductSpecificTitle(subTnxType, this.tnxTypeCode, false);
    }
    this.labelValue = formattedDate;
  }
// @TODO :: Remove commented code after implemented for all products.
  protected getProductSpecificTitle(subTnxType: string, tnxTypeCode: string, requied: boolean): string {
    switch (true) {
      case (tnxTypeCode === FccGlobalConstant.N002_AMEND && this.productCode === FccGlobalConstant.PRODUCT_LN):
      if (!requied){
        subTnxType = '';
      }else{
        subTnxType = this.translate.instant('LIST_N003_01');
      }
      break;
      case (tnxTypeCode === FccGlobalConstant.N002_MESSAGE && this.productCode === FccGlobalConstant.PRODUCT_LN):
      if (!requied){
        subTnxType = '';
      }else{
        subTnxType = this.translate.instant('payment');
      }
      break;
      default:
      break;
    }
    return subTnxType;
  }

  /**
   * The method checks if respond button should be displayed for the selected event or not.
   * If the selected event has an action required value and its child tnx is empty(i.e. event not acted upon even in draft status)
   * @param selectedEvent
   */
  respondButton(selectedEvent) {
    this.selectedEvent = selectedEvent;
    this.selectedEventRefId = this.refIdList.get(selectedEvent);
    this.selectedEventTnxId = this.tnxIdList.get(selectedEvent);
    this.selectedEventTnxTypeCode = this.tnxTypeCodeList.get(selectedEvent);
    this.selectedEventTnxStatCode = this.tnxStatusCodeList.get(selectedEvent);
    this.selectedEntity = this.entityList.get(selectedEvent);
    this.selectedSubProdCode = this.commonService.isnonEMptyString(this.subProductCode) ? this.subProductCode
    : this.subProductCodeList.get(selectedEvent);
    // @TODO :: Remove commented code after implemented for all products.
    // const codeKeys = this.actionReqCodeList.keys();
    // let key = codeKeys.next();
    // const codeValues = this.actionReqCodeList.values();
    // let value = codeValues.next();
    // const crossValues = this.crossChildTnxList.values();
    // let crossValue = crossValues.next();
    // while (key.value < selectedEvent || selectedEvent === key.value) {
    //   if (value.value !== '' && crossValue.value === '' && this.isMaker) {
    //     this.response = true;
    //   } else {
    //     this.response = false;
    //   }
    //   key = codeKeys.next();
    //   value = codeValues.next();
    //   crossValue = crossValues.next();
    // }
    const isHavingSavePermission =
    this.commonService.isUserHavingSavePermission(this.productCode, this.selectedSubProdCode, this.selectedEntity);
    if (this.actionReqCodeList.get(selectedEvent) !== '' && this.crossChildTnxList.get(selectedEvent) === ''
    && this.isMaker && isHavingSavePermission) {
      this.response = true;
    } else {
      this.response = false;
    }
  }

  respondButtonforSeekBene()
  {
    for (let selectedEvent = 0; selectedEvent < this.tnxIdList.size; selectedEvent++)
    {
    const codeKeys = this.actionReqCodeList.keys();
    let key = codeKeys.next();
    const codeValues = this.actionReqCodeList.values();
    let value = codeValues.next();
    const crossValues = this.crossChildTnxList.values();
    let crossValue = crossValues.next();
    while (key.value < selectedEvent.toString() || selectedEvent.toString() === key.value) {
      if (value.value !== '' && crossValue.value === '' && this.isMaker) {
        this.respondTnxList.set(this.tnxIdList.get(selectedEvent.toString()), true);
      } else {
        this.respondTnxList.set(this.tnxIdList.get(selectedEvent.toString()), false);
      }
      key = codeKeys.next();
      value = codeValues.next();
      crossValue = crossValues.next();
    }
  }

    if (this.amendedTransactionList && this.respondTnxList)
  {
    for (let i = 0 ; i < this.amendedTransactionList.length ; i++)
    {
      this.amendedTransactionList[i].respond = this.respondTnxList.get(this.amendedTransactionList[i].currentTnxId);
    }
  }

  }
  onClickRespondButton(event, selectedEvent) { // handled only for message to bank, redirection for rest of scenarios needs to be handled.
    const tnxIDKeys = this.tnxIdList.keys();
    let tnxIDkey = tnxIDKeys.next();
    const tnxIDValues = this.tnxIdList.values();
    const refIDValues = this.refIdList.values();
    const subProductCodeValues = this.subProductCodeList.values();
    const prodStatCodeValues = this.prodStatusCodeList.values();
    const tnxType = FccGlobalConstant.N002_INQUIRE;
    const actionRequiredCodeValues = this.actionReqCodeList.values();
    let tnxIDValue = tnxIDValues.next();
    let refIDValue = refIDValues.next();
    const prodStatValue = prodStatCodeValues.next();
    let subProductCodeValue = subProductCodeValues.next();
    let actionRequiredCodeValue = actionRequiredCodeValues.next();
    while (tnxIDkey.value < selectedEvent || selectedEvent === tnxIDkey.value) {
      if (selectedEvent === tnxIDkey.value && tnxIDValue.value !== '') {
        const productCodeValue = refIDValue.value.substring(FccGlobalConstant.LENGTH_0, FccGlobalConstant.LENGTH_2);
        if (actionRequiredCodeValue.value === FccGlobalConstant.N042_CLEAN_RESPONSE) {
          const paymentProductCode = [FccGlobalConstant.N005_PART_SIGHT_PAID, FccGlobalConstant.N005_FULL_SIGHT_PAID];
          if (productCodeValue === FccGlobalConstant.PRODUCT_BG || productCodeValue === FccGlobalConstant.PRODUCT_LC &&
              (prodStatValue.value === FccGlobalConstant.N005_BILL_CLEAN || paymentProductCode.indexOf(prodStatValue.value) > -1)) {
            const optionValue = FccGlobalConstant.ACTION_REQUIRED;
            this.router.navigate(['productScreen'], {
              queryParams: {
                refId: refIDValue.value,
                productCode: productCodeValue,
                tnxTypeCode: tnxType,
                option: optionValue,
                tnxId: tnxIDValue.value
              }
            });
          }
          else{
          const optionValue = FccGlobalConstant.EXISTING_OPTION;
          const subTnxTypeCodeValue = FccGlobalConstant.N003_SETTLEMENT_REQUEST;
          this.router.navigate(['productScreen'], { queryParams: { refId: refIDValue.value,
            productCode: productCodeValue,
            subProductCode: subProductCodeValue.value, tnxTypeCode: tnxType, option: optionValue,
            subTnxTypeCode: subTnxTypeCodeValue
             } });
          }
        } else if (actionRequiredCodeValue.value === FccGlobalConstant.N042_DISCREPANCY_RESPONSE &&
          (productCodeValue === FccGlobalConstant.PRODUCT_LC || productCodeValue === FccGlobalConstant.PRODUCT_SI)) {
          const optionValue = FccGlobalConstant.EXISTING_OPTION;
          const modeValue = FccGlobalConstant.DISCREPANT;
          this.router.navigate(['productScreen'], { queryParams: { refId: refIDValue.value,
            productCode: productCodeValue,
            subProductCode: subProductCodeValue.value, tnxTypeCode: tnxType,
            option: optionValue, tnxId: tnxIDValue.value, mode: modeValue } });
        } else if (productCodeValue === FccGlobalConstant.PRODUCT_TF) {
          const optionValue = FccGlobalConstant.ACTION_REQUIRED;
          const subProdCode = this.getTFSubProdCode(subProductCodeValue.value);
          this.router.navigate(['productScreen'], { queryParams: { refId: refIDValue.value,
            productCode: productCodeValue,
            subProductCode: subProdCode, tnxTypeCode: tnxType, option: optionValue,
            tnxId: tnxIDValue.value
             } });
        } else {
          const optionValue = FccGlobalConstant.ACTION_REQUIRED;
          this.router.navigate(['productScreen'], { queryParams: { refId: refIDValue.value,
            productCode: productCodeValue,
            subProductCode: subProductCodeValue.value, tnxTypeCode: tnxType, option: optionValue,
            tnxId: tnxIDValue.value
             } });
        }
      }
      tnxIDkey = tnxIDKeys.next();
      tnxIDValue = tnxIDValues.next();
      refIDValue = refIDValues.next();
      subProductCodeValue = subProductCodeValues.next();
      actionRequiredCodeValue = actionRequiredCodeValues.next();
    }
  }

  getTFSubProdCode(value: any) {
    switch (value) {
      case 'Trust Receipt' :
        return 'ITRPT';
      case 'Import Loan Collection' :
        return 'ILNIC';
      case 'Buyers Credit' :
        return 'IBCLC';
      case 'Other Import Financing' :
        return 'IOTHF';
      case 'Export Bills Exchange Purchase' :
        return 'EBEXP';
      case 'Export Discounting Collection' :
        return 'EDIEC';
      case 'Other Export Financing' :
        return 'EOTHF';
    }
  }

  openAmendComparison() {
    this.dialogRef = this.dialogService.open(AmendComparisonDialogComponent, {
      data: {
        selectedTransaction: this.currentTransactionSelected,
        transactionList: this.amendedTransactionList
      },
      width: '95vw',
      header: `${this.translate.instant('amendComparison')} ${this.refID}`,
      contentStyle: {
        height: '95vh',
        overflow: 'auto',
        backgroundColor: '#fff'
      },
      styleClass: 'viewLayoutClass',
      showHeader: true,
      baseZIndex: 9999,
      autoZIndex: true,
      dismissableMask: true,
      closeOnEscape: true,
      style: { direction: this.dir }
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.selectedEventTnxId = null;
    this.selectedEventRefId = null;
    this.productCode = null;
    this.subProductCode = null;
    this.selectedEventTnxTypeCode = null;
    this.tnxTypeCode = null;
    this.operation = null;
    this.selectedEventTnxStatCode = null;
    this.commonService.pdfDecodeValue = false;
  }

  OnEnterKey(event) {
    if (event.code === 'Enter') {
      this.downloadPDF();
    }
  }

  // To delete once implemented for all products.
  setDataAtLoadForPDF(){
    this.reviewTransactionDetailsComponent.checkEmit(this.refIdList.get('0'), this.tnxIdList.get('0'),
    this.tnxTypeCodeList.get('0'), this.subTnxTypeCodeList.get('0'), this.tnxStatusCodeList.get('0'),
    this.actionReqCodeList.get('0'), this.prodStatusCodeList.get('0'));
  }

  loadDataForPDF(rowData, index){
    this.reviewTransactionDetailsComponent.checkEmit(rowData.ref_id, rowData.tnx_id,
    this.tnxTypeCodeList.get(index), this.subTnxTypeCodeList.get(index), this.tnxStatusCodeList.get(index),
    this.actionReqCodeList.get(index), this.prodStatusCodeList.get(index));
  }

  downloadPDF() {
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.stateType = EnumMapping.stateTypeEnum.EVENTSTATE;
    this.modelJson = this.stateService.getProductModel();
    this.populatePDFData();
    this.pdfGeneratorService.createPDF(
      this.pdfData,
      this.modelJson,
      this.selectedEventRefId,
      this.productCode,
      FccGlobalConstant.VIEW_SCREEN,
      this.selectedEventTnxId,
      this.subProductCode,
      FccGlobalConstant.EMPTY_STRING,
      this.selectedEventTnxTypeCode,
      this.selectedEventTnxStatCode,
      this.stateType
    );
  }

  populatePDFData() {
    this.pdfData = new Map();
    this.sectionNames = this.stateService.getSectionNames(this.master, this.stateType);
    this.sectionNames.forEach(sectionName => {
      if (this.modelJson[sectionName] !== undefined && this.tabPanelService.isTabPanel(this.modelJson[sectionName])) {
        this.setSectionNameForTab(sectionName);
      } else if (this.modelJson[sectionName] !== undefined &&
        this.formAccordionPanelService.isFormAccordionPanel(this.modelJson[sectionName], undefined, undefined)) {
        this.formAccordionPanelService.initializeFormAccordionMap(sectionName,
          this.stateService.getSectionData(sectionName, this.productCode, this.master, this.stateType));
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
        const value: FCCFormGroup = this.stateService.getSectionData(sectionName, this.productCode, this.master, this.stateType);
        this.pdfData.set(sectionName, value);
      }
    });
    if (this.accordionSectionsList.length > 0) {
      this.pdfGeneratorService.setAccordionList(this.accordionSectionsList);
    }
  }

  setSectionNameForTab(sectionName: any) {
    this.tabPanelService.initializeMaps(sectionName, this.stateService.getSectionData(sectionName, this.productCode,
      this.master, this.stateType));
    this.tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
    if (this.tabSectionControlMap.has(sectionName)) {
      const tabForm = new FCCFormGroup({});
      for (const [fieldName, control] of this.tabSectionControlMap.get(sectionName)) {
        let previewScreen = control[FccGlobalConstant.PARAMS][FccGlobalConstant.PREVIEW_SCREEN];
        previewScreen = previewScreen === false ? false : true;
        if (fieldName && previewScreen) {
          tabForm.addControl(fieldName, control);
        }
      }
      this.pdfData.set(sectionName, tabForm);
    }
  }

  applyEventsFilter(filterParams) {

    this.filterParams = this.listdefFormService.transformFilterParams('', filterParams, '', this.refID);
    //const paginatorParams = this.paginatorSortData;
    //{ first: 0, rows: this.defaultRow, sortOrder: this.sortOrder, filters: {}, globalFilter: null };

    this.listService.getTableData(this.xmlName, this.filterParams , JSON.stringify(this.paginatorSortData))
    .subscribe(tableData => {
      this.setEventsListData(tableData);
      this.respondButton(0);
      this.respondButtonforSeekBene();
      if({}.propertyIsEnumerable.call(this.previousSortingData, "value") && !this.isAmountSort){
        this.previousSortingData.data = this.eventsTableData;
        this.displaySelectedSortData(this.previousSortingData);
      }else{
        this.eventDataEmit.next(this.eventsTableData);
      }

      if (this.eventsTableData && this.eventsTableData.length > 0) {
        this.loadDataForPDF(this.eventsTableData[0], 0);
        this.selectedEvent = this.eventsTableData[0].row_index;
      }
      this.fccListBoxComponent.closeFilterPopup();
    });
  }

  setEventsListData(tableData) {
    let rowIndex = 0;
    this.eventsTableData = [];
      tableData.rowDetails.forEach (rowDetails => {
        const obj = {};
        rowDetails.index.forEach( rowData => {
          obj['row_index'] = rowIndex;
          // To display "CCY CCYSymbol Amt" based on config
          if (rowData.name === "amount" && this.commonService.isnonEMptyString(rowData.value)
            && this.isCurrencySymbolDisplayEnabled) {
              const amtWithCurcode = rowData.value;
              const curCode = amtWithCurcode.substring(0, amtWithCurcode.indexOf(' '));
              const amt = amtWithCurcode.substring(amtWithCurcode.indexOf(' '), amtWithCurcode.length);
            obj[rowData.name] = curCode.concat(' ').concat(this.commonService.getCurrencySymbol(curCode, amt));
          } else {
            obj[rowData.name] = this.commonService.decodeHtml(rowData.displayValue ? rowData.displayValue :
              (rowData.value ? rowData.value : '     '));
          }

          if (rowData.name === 'ref_id') {
            this.refIdList.set(rowIndex, rowData.value);
          } else if (rowData.name === 'tnx_id') {
            this.tnxIdList.set(rowIndex, rowData.value);
            this.tnxIds.push(rowData.value);
            this.lastTnxId = rowData.value;
            this.currentTnxId = rowData.value;
          } else if (rowData.name === 'tnx_type_code') {
            this.tnxTypeCodeList.set(rowIndex, rowData.value);
            this.tnxTypeCode = rowData.value;
            this.lastTnxType = `${this.translate.instant('N002_' + rowData.value)}`;
          } else if (rowData.name === 'prod_stat_code') {
            this.prodStatusCodeList.set(rowIndex, rowData.value);
            this.productStatusCode = rowData.value;
          } else if (rowData.name === FccGlobalConstant.tnxStatusCode) {
            this.tnxStatusCodeList.set(rowIndex, rowData.value);
            this.tnxStatCode = rowData.value;
          } else if (rowData.name === FccGlobalConstant.ACTION_REQ_CODE) {
            this.actionReqCodeList.set(rowIndex, rowData.value);
            this.actionReqCode = rowData.value;
          } else if (rowData.name === 'sub_tnx_type_code') {
            this.subTnxTypeCodeList.set(rowIndex, rowData.value);
            this.subTnxTypeCode = rowData.value;
          } else if (rowData.name === FccGlobalConstant.crossChildTnxID) {
            this.crossChildTnxList.set(rowIndex, rowData.value);
            this.crossChildTnx = rowData.value;
          } else if (rowData.name === FccGlobalConstant.subProductCode) {
            this.subProductCodeList.set(rowIndex, rowData.value);
          } else if (rowData.name === FccGlobalConstant.BO_RELEASE_DTTM) {
            this.boReleasedttm = this.commonService.decodeHtml(rowData.value.toString());
          } else if (rowData.name === FccGlobalConstant.AMD_NO) {
            this.amdNo = rowData.value.toString();
          } else if (rowData.name.toString() === FccGlobalConstant.subProductCode) {
            this.subProductCode = rowData.value.toString();
          } else if (rowData.name.toString() === FccGlobalConstant.BO_TNX_ID) {
            this.boTnxId = this.commonService.decodeHtml(rowData.value.toString());
          } else if (rowData.name.toString() === FccGlobalConstant.ENTITY) {
            this.entityList.set(rowIndex, rowData.value);
          }
        });
          let subTnxType = '';
          if (this.tnxTypeCode === FccGlobalConstant.LENGTH_15.toString() ||
            this.productStatusCode === FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL.toString()) {
            subTnxType = `${this.translate.instant('N005_' + this.productStatusCode)}`;
          }
          else if (this.subTnxTypeCode !== '' && this.subTnxTypeCode !== undefined &&
          this.tnxTypeCode !== FccGlobalConstant.LENGTH_15.toString()) {
          subTnxType = `${this.translate.instant('LIST_N003_' + this.subTnxTypeCode)}`;
          }
          if(this.productCode === FccGlobalConstant.PRODUCT_EL && subTnxType !== ''){
            obj['tnx_type_code'] = this.lastTnxType.concat(' ').concat(' ('+subTnxType+')');
          }
          rowIndex++;
          this.eventsTableData.push(obj);
          this.selectedEvent = this.eventsTableData[0].row_index;
          // Required to handle amend comparison screen
          let tnxType = '';
          let amdNoValue = '';
         if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
           tnxType = `${this.translate.instant('LIST_N002_' + this.tnxTypeCode)}`;
         } else {
           tnxType = `${this.translate.instant('N002_' + this.tnxTypeCode)}`;
         }
          if (this.productStatusCode && this.productStatusCode === FccGlobalConstant.N005_AMENDED && this.amdNo) {
            amdNoValue = this.formatAmdNoService.formatAmdNo(this.amdNo);
            if (amdNoValue !== undefined && amdNoValue !== null && amdNoValue !== '') {
              const iconValue = this.getProductSpecificTitle(tnxType, this.tnxTypeCode, true);
              this.iconValue = `${iconValue} ${amdNoValue}`;
            } else {
              this.iconValue = this.getProductSpecificTitle(tnxType, this.tnxTypeCode, true);
            }
          } else {
            this.iconValue = this.getProductSpecificTitle(tnxType, this.tnxTypeCode, true);
          }
          this.lastTnxType = tnxType;
          if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
            ((this.productCode === FccGlobalConstant.PRODUCT_EL || this.productCode === FccGlobalConstant.PRODUCT_SR)
             && this.tnxTypeCode === FccGlobalConstant.N002_REPORTING ))
              && this.productStatusCode &&
              this.productStatusCode === FccGlobalConstant.N005_AMENDED ||
             ((this.productCode === FccGlobalConstant.PRODUCT_EL || this.productCode === FccGlobalConstant.PRODUCT_SR) &&
              this.productStatusCode === FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL) &&
              this.tnxStatCode === FccGlobalConstant.N004_ACKNOWLEDGED && this.currentTnxId) {
                let tempTnxType = `${this.translate.instant('LIST_N002_' + this.tnxTypeCode)}`;
                if (this.amdNo) {
                  amdNoValue = this.formatAmdNoService.formatAmdNo(this.amdNo);
                  tempTnxType = `${tempTnxType} ${amdNoValue}`;
                }
                this.amendedTransactionList.push({ currentTnxId: this.currentTnxId, tnxType: tempTnxType, tnxTypeCode: this.tnxTypeCode,
                   subTnxType: this.subTnxTypeCode, productStatCode: this.prodStatCode });
            }
          else if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
                  this.amendedTransactionList.push({ currentTnxId: this.lastTnxId, tnxType: this.lastTnxType, tnxTypeCode: this.tnxTypeCode,
                  subTnxType: this.subTnxTypeCode, productStatCode: this.prodStatCode });
            }
          else {
              this.displayAmendmentEventReporting();
          }
            this.displayAmendComparisionButton(this.selectedEvent);
        });
  }
  displayAmendmentEventReporting(){
    if (this.productCode === FccGlobalConstant.PRODUCT_EL || this.productCode === FccGlobalConstant.PRODUCT_SR ||
        this.tnxTypeCode === FccGlobalConstant.N002_REPORTING || ((this.productCode === FccGlobalConstant.PRODUCT_EL
      || this.productCode === FccGlobalConstant.PRODUCT_SR) &&
        this.productStatusCode === FccGlobalConstant.PROD_STAT_CODE_AMENDMENT_AWAITING_BENE_APPROVAL) &&
        this.tnxStatCode === FccGlobalConstant.N004_ACKNOWLEDGED && this.currentTnxId) {
        this.isAmendApplicable();
    }
  }
  isAmendApplicable(){
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.productStatusCode &&
        this.productStatusCode === FccGlobalConstant.N005_AMENDED ){
          let tempTnxType = `${this.translate.instant('LIST_N002_' + this.tnxTypeCode )}`;
          const amendment= `${this.translate.instant('Amendment')}`;
          if (this.amdNo) {
            const amdNoValue = this.formatAmdNoService.formatAmdNo(this.amdNo);
            tempTnxType = `${tempTnxType }(${amendment} ${amdNoValue})`;
          }
          this.amendedTransactionList.push({ currentTnxId: this.currentTnxId, tnxType: tempTnxType, tnxTypeCode: this.tnxTypeCode,
            subTnxType: this.subTnxTypeCode, productStatCode: this.prodStatCode });
           }
  }

  /**
   * This method checks whether "Comparsion" button should be displayed for the selected event.
   * @param selectedEvent
   */
  displayAmendComparisionButton(selectedEvent) {
    if (this.checkIfAmendTransaction(selectedEvent) && (selectedEvent !== (this.tnxIdList.size - 1).toString())) {
      if (this.amendProductsList.indexOf(this.productCode) !== -1) { // hiding-comparison-button-for-loan-screen
        this.amendCompareVisible = true;
      }
      this.currentTransactionSelected = {
        tnxId: this.tnxIdList.get(selectedEvent),
        tnxType: this.getTnxType(selectedEvent),
        subTnxType: this.getSubTnxType(selectedEvent),
        productStatCode: this.getProductStatusCode(selectedEvent)
      };
    } else {
      this.amendCompareVisible = false;
    }
  }

}
