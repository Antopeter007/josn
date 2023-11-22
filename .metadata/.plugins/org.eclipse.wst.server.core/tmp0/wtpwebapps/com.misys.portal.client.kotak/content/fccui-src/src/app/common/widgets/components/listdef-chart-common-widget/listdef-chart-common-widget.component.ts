import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { forkJoin, of } from 'rxjs';

import { GlobalDashboardComponent } from '../../../../common/components/global-dashboard/global-dashboard.component';
import { FccGlobalConfiguration } from '../../../../common/core/fcc-global-configuration';
import { CommonService } from '../../../../common/services/common.service';
import { HideShowDeleteWidgetsService } from '../../../../common/services/hide-show-delete-widgets.service';
import { LocaleService } from './../../../../base/services/locale.service';
import { CorporateCommonService } from './../../../../corporate/common/services/common.service';
import {
  ConfirmationDialogComponent
} from './../../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { UtilityService } from './../../../../corporate/trade/lc/initiation/services/utility.service';
import { TransactionsListdefComponent } from './../../../components/transactions-listdef/transactions-listdef.component';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { BankApprovalsAndRejectionsService } from './../../../services/bank-approvals-and-rejections.service';
import { ListDefService } from './../../../services/listdef.service';

@Component({
  selector: 'app-listdef-chart-common-widget',
  templateUrl: './listdef-chart-common-widget.component.html',
  styleUrls: ['./listdef-chart-common-widget.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class ListdefChartCommonWidgetComponent implements OnInit, AfterViewInit, OnDestroy {
  filterOption: any =[];
  selectedPrimaryFilter = 'All';
  countForAllEvent: any;
  valueCodeMap = new Map<string, string>();
  showMore: boolean;
  totalfilteredCount: any;
  hideChart: boolean;
  billReferenceEnabled: boolean;

  constructor(protected globalDashboardComponent: GlobalDashboardComponent,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected commonService: CommonService, protected router: Router,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected listService: ListDefService,
              protected translateService: TranslateService,
              protected bankApprovalsAndRejectionsService: BankApprovalsAndRejectionsService,
              protected corporateCommonService: CorporateCommonService,
              protected datePipe: DatePipe,
              protected localeService: LocaleService,
              protected utilityService: UtilityService,
              protected fccGlobalConfiguration: FccGlobalConfiguration,
              protected dialogService: DialogService) { }

@Input()
widgetDetails: any;
nudges: any;
widgets;
contextPath: any;
header: any;
widgetConfig: any;
@Input () dashboardName;
inputParams: any = {};
transListdef: any;
@ViewChild('listdef') public listdef: TransactionsListdefComponent;
finalData: any[] = [];
isUiloaded: boolean;
dashboardType: any;
defaultRow: any;
defaultSortOrder: any;
listdefName: any;
retultdataArray: any;
totalRecords: any;
metadata;
groupNames: any [] = [];
goupNamesDataMap: any;
checkCustomise;
classCheck;
hideShowCard;
approvedTransactionsTitle = this.translateService.instant('pendingApproval');
chartData: any;
chartdataoptions = this.bankApprovalsAndRejectionsService.polarAreaChartOptions;
transactionCountMap = new Map();
resulDataArrayMap = new Map<string, any[]>();
primaryFilter: string;
secondaryFilter: string;
validationFilter: string;
defaultSecondaryFilterList: secondaryFilterModel [] = [];
secondaryFilterList: secondaryFilterModel [] = [];
secondaryFilterArrayMap = new Map<string, any[]>();
defaultPrimaryFilterList: primaryFilterModel [] = [];
primaryFilterList: primaryFilterModel [] = [];
primaryFilterMap = new Map<string, any[]>();
defaultValidationFilterList: primaryFilterModel [] = [];
validationFilterList: primaryFilterModel [] = [];
validationFilterMap = new Map<string, any[]>();
cols = [];
dataAvailable: boolean;
approvalDays: any;
day = this.translateService.instant('day');
star = this.translateService.instant('star');
of = this.translateService.instant('of');
days;
rowCount;
daterange;
defaultSelection;
dojoPath = `${this.fccGlobalConstantService.servletName}/screen/`;
two = 2;
three = 3;
currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy').split('/');
dateRangeDays: any;
scrollable: boolean;
cssChart: any;
cssTable: any;
cssTextAlingnRight = 'right';
cssTextAlingnLeft = 'left';
dir: any;
selectedLegend = '';
date: Date;
recordsDisplayed: string;
showMessage = this.translateService.instant('showMessage');
totalCount = 0;
viewAllTnxPermission = false;
recordAvailable = false;
selectedValidationVal = 'All';
selectedProduct = [];
enableValidationFilter = false;
configuredKeysList = 'ENABLE_VALIDATION_FILTER_TRADE_PENDING_APPROVAL,show.billReference';
keysNotFoundList: any[] = [];
separator = '|';
statusPrefix: string = "N002_";
ngOnInit(): void {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
    this.keysNotFoundList = this.configuredKeysList.split(',');
    this.commonService.deleteIconClicked$.subscribe(
      res => {
        if (res === 'yes') {
          this.hideChart = true;
          this.cssTable = 'p-col-12';
        }
        if (res === 'no') {
          this.hideChart = false;
          this.cssTable = 'p-col-9';
        }
    });
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        this.fccGlobalConfiguration.addConfigurationValues(
          response,
          this.keysNotFoundList
        );
        this.updateValues();
      });
    } else {
      this.updateValues();
    }
    const keys : any [] = Object.keys(sessionStorage);
    keys.forEach(key => {
      if(key.indexOf('PaymentTrade') >= 0) {
        sessionStorage.removeItem(key);
      }
    });

    const dashboardTypeValue = 'dashboardTypeValue';
    const listDefName = 'listdefName';
    this.dataAvailable = true;
    this.translateService.get('corporatechannels').subscribe(() => {
      this.recordsDisplayed = this.translateService.instant('recordsDisplayed');
    });
    this.contextPath = this.commonService.getContextPath();
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.header = this.widgets.widgetName;
    if (this.widgets !== '' && this.widgets.widgetConfig) {
      this.widgetConfig = JSON.parse(this.widgets.widgetConfig);
      const dashBoardURI = this.dashboardName.split('/');
      this.dashboardType = dashBoardURI[dashBoardURI.length - 1].toUpperCase() ;
      this.inputParams[dashboardTypeValue] = this.dashboardType;
      this.listdefName = this.widgetConfig.tableConfig[listDefName];
      this.defaultSelection = this.widgetConfig.defalugroup;
      this.commonService.dashboardWidget = true;
      if (this.widgetConfig.daterange){
        this.daterange = this.widgetConfig.daterange;
      }
    }

    if (this.commonService.isnonEMptyString(this.widgetConfig)
          && this.commonService.isnonEMptyString(this.widgetConfig.viewAllPermission)){
      this.commonService.getUserPermission(this.widgetConfig.viewAllPermission).subscribe(permission => {
        if (permission) {
          this.viewAllTnxPermission = true;
        }
      });
    }
    if (this.defaultSelection){
      this.selectedLegend = this.translateService.instant(this.defaultSelection);
    }
    this.approvedTransactionsTitle = this.translateService.instant(this.widgets.widgetName);

    this.scrollable = false;
    this.cssChart = 'p-col-3';
    this.cssTable = 'p-col-9';

    if (this.widgets.widgetName === 'pendingApproval'){
      this.approvalDays = this.translateService.instant('nopendingapprovals');
    }else if (this.widgets.widgetName === 'upcomingEventsLoan'){
      this.date = new Date(new Date());
      const dateRangeDays = this.datePipe.transform(this.date.setDate(this.date.getDate() + parseInt(this.daterange, 0)),
      this.localeService.getDateLocaleJson(localStorage.getItem('language')).dateFormat);
      this.approvalDays = this.translateService.instant('noupcomingevents') + ' ' + dateRangeDays;
    }

    this.dir = localStorage.getItem('langDir');

    if (localStorage.getItem('language') === 'ar'){
      this.cssTextAlingnRight = 'left';
      this.cssTextAlingnLeft = 'right';
    }
    if (this.defaultSelection) {
      this.updateValues();
      this.updateGroupNames();
      this.updateColumsData(this.defaultSelection);
    }
    this.getMetaData();

    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });

    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });

  }

  updateValues() {
    this.days = FccGlobalConfiguration.configurationValues.get('BANK_APPROVAL_AND_REJECTION_DAYS');
    this.rowCount = FccGlobalConfiguration.configurationValues.get('BANK_APPROVAL_AND_REJECTION_ROW_COUNT');
    this.enableValidationFilter = ((FccGlobalConfiguration.configurationValues
      .get('ENABLE_VALIDATION_FILTER_TRADE_PENDING_APPROVAL') === 'true')
       || this.widgets.widgetName === FccGlobalConstant.TRADE_PAYMENT_WIDGET) ? true : false;
  // console.log('bill reference Enabled  1', FccGlobalConfiguration.configurationValues.get('show.billReference'));
  this.billReferenceEnabled = (FccGlobalConfiguration.configurationValues
        .get('show.billReference') === 'true') ? true : false;
  }

  onValidationChange(val: string) {
    this.selectedValidationVal = val;
    //console.log('selected value ',this.selectedValidationVal);
  }
  onPrimaryFilterChange(val: string) {
    this.selectedPrimaryFilter = val;
    //console.log('selected primary ',this.selectedPrimaryFilter);
  }
  updateGroupNames() {
    this.goupNamesDataMap = this.widgetConfig.columngrouping;
    Object.keys(this.goupNamesDataMap).forEach(key => {
      this.groupNames.push(key);
    });
  }

  updateColumsData(defaultSelection: any){
    const columnslist = this.goupNamesDataMap[defaultSelection];
    const field = 'field';
    const header = 'header';
    const width = 'width';

    this.cols = [];

    columnslist.forEach(ele => {
      const obj = {};
      obj[field] = ele.field;
      obj[header] = this.translateService.instant(ele.header);
      obj[width] = ele.width;
      this.cols.push(obj);
    });
  }
  underscoreToCamelcase(name: string) {
    return name.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }
  getMetaData() {
    this.listService.getMetaData(this.listdefName.split(',')[0], FccGlobalConstant.EMPTY_STRING, FccGlobalConstant.EMPTY_STRING)
      .subscribe(response => {
        this.getColumns(response);
        this.metadata = response;
        this.inputParams.metadata = response;
        this.inputParams.metadata.Column.map(ele=>{
          ele.name = (ele.name.indexOf('_') > -1) ? this.underscoreToCamelcase(ele.name) : ele.name;
        });
        this.inputParams[FccGlobalConstant.DRILL_DOWN_ENABLED] = true;
        this.inputParams[FccGlobalConstant.SHOW_FILTER_SECTION] = false;
        this.inputParams.chartTableData = true;
        this.setDefaultProperties();
        this.getRecords();
        this.recordAvailable = true;
      });
  }

  onPanelShowHandler(): void {
    const multiSelectClose = Array.from(document.getElementsByClassName('ui-multiselect-close'));
    multiSelectClose.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("close");
      element[FccGlobalConstant.TITLE] = this.translateService.instant("close");
    });
  }
  getColumns(data: any) {
    if (data.Column) {
      data.Column.forEach(element => {
        if (!this.defaultSelection) {
          element.isColumnSortDisabled = true;
        }
        if (element.primaryFilter) {
          this.primaryFilter = (element.name.indexOf('_') > -1) ? this.toCamelCase(element.name) : element.name;
        }
        if (element.secondaryFilter) {
          this.secondaryFilter = (element.name.indexOf('_') > -1) ? this.toCamelCase(element.name) : element.name;
        }
        if (element.validationFilter) {
          this.validationFilter = (element.name.indexOf('_') > -1) ? this.toCamelCase(element.name) : element.name;
        }
        if (element.width && element.width.indexOf(FccGlobalConstant.PERCENT) > -1) {
          element.width = element.width.replace(FccGlobalConstant.PERCENT, FccGlobalConstant.EM);
        }
      });
    }
  }

  setDefaultProperties() {
    this.defaultSortOrder = this.metadata.ListDefDefaultProperties[0]?.default_order_type === 'd' ? -1 : 1;
    this.defaultRow = this.metadata.ListDefDefaultProperties[0]?.page;
  }

  toCamelCase(str: string) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }

  formatResult(result: any, response: any) {
        const tempTableData = result.rowDetails;
        const data = [];
        if (tempTableData) {
          tempTableData.forEach(element => {
            const obj = {};
            element.index.forEach(ele => {
              const formattedName = (ele.name.indexOf('_') > -1) ? this.toCamelCase(ele.name) : ele.name;
              let value = ele.value;
              if (formattedName === 'entity' && (value === '' || value === null || value === undefined)){
                    value = response.body.shortName;
              }
              if ((formattedName === 'custRefId' || formattedName === 'inpDttm' || formattedName === 'maturityDate'
                || formattedName === 'boRefId') || formattedName === 'boReleaseDttm' && value) {
                value = this.commonService.decodeHtml(value);
              }
              if ((formattedName === 'status' || formattedName === 'fullType') && value) {
                value = value.replaceAll('&#x28;', '(');
                value = value.replaceAll('&#x29;', ')');
              }
              obj[formattedName] = value;
            });
            data.push(obj);
          });
       }
        return data;
  }

  getRecords() {
    let filterparams = {};
    if ( this.daterange !== undefined){
       filterparams = { dashboardType: this.dashboardType, daterange: this.daterange };
    }else{
      filterparams = { dashboardType: this.dashboardType };
    }
    const paginatorParams = { first: 0, rows: this.defaultRow, sortOrder: this.defaultSortOrder };
    this.getResponsesFromListDef(filterparams, paginatorParams).subscribe(result => {
         this.corporateCommonService.getValues(this.fccGlobalConstantService.corporateDetails).
         subscribe(response => {
          const response0 = this.formatResult(result[0], response);
          this.inputParams.totalRecords = response0;
          this.inputParams.widgetName = this.widgets.widgetName;
          if (this.widgets.widgetName === 'pendingApproval') {
            this.inputParams.exportFileName = this.translateService.instant('PendingApprovalTradeList');
          }
          else if (this.widgets.widgetName === FccGlobalConstant.TRADE_PAYMENT_WIDGET) {
            this.inputParams.exportFileName = this.translateService.instant(FccGlobalConstant.TRADE_PAYMENT_WIDGET);
          } else if (this.widgets.widgetName === FccGlobalConstant.TRANSACTION_IN_PROGRESS) {
            this.statusPrefix = "N004_";
          }
          if ( result[1] !== undefined){
            const response1 = this.formatResult(result[1], response);
            this.retultdataArray = response0.concat(response1);
          }else{
            this.retultdataArray = response0;
            this.totalRecords = response0;
          }
          if (this.retultdataArray.length === 0){
            this.dataAvailable = false;
          }
          const dataArray: string[] = [];
          const bgcolors: any[] = [];
          const labelArray: string[] = [];
          const bordercolors: any[] = [];
          this.prepareDataArray();
          this.prepareChartData();
          this.hideColumns();
          if (this.defaultSelection) {
            this.retultdataArray = this.resulDataArrayMap.get(this.defaultSelection);
            if (this.retultdataArray === undefined && this.dataAvailable === true){
              for ( let i = 0 ; i < this.groupNames.length; i++){
                if (this.resulDataArrayMap.get(this.groupNames[i]) !== undefined) {
                  this.retultdataArray = this.resulDataArrayMap.get(this.groupNames[i]);
                  this.defaultSelection = this.groupNames[i];
                  this.selectedLegend = this.translateService.instant(this.groupNames[i]);
                  this.updateColumsData(this.groupNames[i]);
                  break;
                }
              }
            }
            if (this.retultdataArray && this.retultdataArray.length > 10){
              this.showMore = true;
              this.retultdataArray = this.retultdataArray.slice(0, 10);
            } else {
              this.showMore = false;
            }
            this.groupNames.forEach((element, index) => {
              bgcolors.push(this.bankApprovalsAndRejectionsService.colorsList[index]);
              bordercolors.push(this.bankApprovalsAndRejectionsService.borderColorsList[index]);
              if (this.transactionCountMap.has(element)){
                dataArray.push(this.transactionCountMap.get(element));
                labelArray.push(element);
              }

              if (!this.resulDataArrayMap.has(element)){
                this.resulDataArrayMap.set(element, []);
              }

            });

            this.groupNames = [];
            const labelsWithcount: string[] = [];

            labelArray.forEach((element, index) => {
              labelArray [index] = this.translateService.instant(element);
              this.groupNames.push(element);
              labelsWithcount.push(this.translateService.instant(labelArray[index]) + ':' + ' ' +
              '(' + dataArray[index] + ')');
            });

            const legendNamePie =
                  `${this.translateService.instant(this.approvedTransactionsTitle)}`;

            this.chartData = this.bankApprovalsAndRejectionsService.getPolarAreaData(labelsWithcount, dataArray,
              legendNamePie, bgcolors, bordercolors);
          }
          if (this.widgets.widgetName === FccGlobalConstant.TRADE_PAYMENT_WIDGET
            && this.defaultValidationFilterList && this.defaultValidationFilterList.length > 0) {
            this.selectedValidationVal = this.defaultValidationFilterList[0].primaryFilterCode;
            this.onClickValidator(this.defaultValidationFilterList[0].primaryFilterCode);
          }
        });

      });


  }

  filterValidationData(filterRec) : any[]{
    if (filterRec && filterRec.length > 0 && this.selectedValidationVal && this.selectedValidationVal !== 'All') {
      filterRec= filterRec.filter(data=> data[this.validationFilter] === this.selectedValidationVal);
    }
    return filterRec;
  }

  prepareChartData(filteredProductList?: secondaryFilterModel[], filteredTnxList?: primaryFilterModel[]) {
    let isProductFiltered = false;
    if (!this.defaultSelection) {
      this.bankApprovalsAndRejectionsService.removeLabel = true;
      const bgcolors: any[] = [];
      const labelArray: string[] = [];
      const bordercolors: any[] = [];
      const dataArray2 = [];
      if (filteredProductList && filteredProductList.length > 0) {
        // APPLYING FILTERED RECORDS TO THE LIST DATA TO DISPLAY CHART //
        this.secondaryFilterList = filteredProductList;
        let validationFilter;
        let tnxSelectedData;
        if (filteredTnxList && filteredTnxList.length > 0) {
          validationFilter = filteredTnxList.filter(data => data.filterType === 'validationFilter');
        }
        if (validationFilter && validationFilter.length > 0){
          this.validationFilterList = filteredTnxList;
          tnxSelectedData = this.validationFilterList.filter(rec=>rec.isChecked);
        } else {
          this.primaryFilterList = filteredTnxList;
          tnxSelectedData = this.primaryFilterList.filter(rec=>rec.isChecked);
        }
        if (this.secondaryFilterList && this.secondaryFilterList.length > 1 &&
          tnxSelectedData && (tnxSelectedData.length === 1 || tnxSelectedData.length === 0) ) {
            isProductFiltered = true;
        }
        this.retultdataArray = this.secondaryFilterArrayMap.get(this.secondaryFilterList[0].secondaryFilterCode);
        this.retultdataArray = this.filterValidationData(this.retultdataArray);
        if (this.retultdataArray && this.retultdataArray.length > 0 && this.selectedPrimaryFilter !== 'All') {
          this.retultdataArray = this.retultdataArray.filter(data =>
            this.translateService.instant(this.statusPrefix + data[this.primaryFilter]) === this.selectedPrimaryFilter);
        }
      }
      else if (filteredTnxList && filteredTnxList.length > 0) {
        // APPLYING FILTERED RECORDS TO THE LIST DATA TO DISPLAY CHART //
        let tnxSelectedData;
        const validationFilter = filteredTnxList.filter(data => data.filterType === 'validationFilter');
        if (validationFilter && validationFilter.length > 0) {
          this.validationFilterList = filteredTnxList;
          tnxSelectedData = this.validationFilterList.filter(rec=>rec.isChecked);
          this.retultdataArray = this.validationFilterMap.get(tnxSelectedData[0].primaryFilterCode);
          if (this.retultdataArray && this.retultdataArray.length > 0
            && this.selectedPrimaryFilter && this.selectedPrimaryFilter !== 'All') {
            this.retultdataArray = this.retultdataArray.filter(data =>
              this.translateService.instant(this.statusPrefix + data[this.primaryFilter]) === this.selectedPrimaryFilter);
          }
          isProductFiltered = true;
        }
        else {
          this.primaryFilterList = filteredTnxList;
          //console.log('filtered tnx list', filteredTnxList);
          if (this.primaryFilterList && this.primaryFilterList.length > 0 && this.primaryFilterList.length === 1 &&
            this.secondaryFilterList && this.secondaryFilterList.length > 1) {
            isProductFiltered = true;
          }
          else if (this.selectedPrimaryFilter === 'All' && this.selectedProduct.length === 0){
            isProductFiltered = true;
          }
          const resultArray = [];
          this.primaryFilterList.forEach(filter=> {
            if (this.primaryFilterMap.get(filter.primaryFilterCode) && this.primaryFilterMap.get(filter.primaryFilterCode).length > 0) {
              this.primaryFilterMap.get(filter.primaryFilterCode).forEach(rec=>{
                resultArray.push(rec);
              });
            }
          });
          this.retultdataArray = this.filterValidationData(resultArray);
        }

      }
      else {
        if(this.secondaryFilter){
          isProductFiltered = true;
        }
        // SHOW THE DEFAULT VALUES WITHOUT ANY FILTERS //
        const arrayOfProducts = Array.from(this.secondaryFilterArrayMap.keys());
        arrayOfProducts.forEach(rec => {
          const model = {
            secondaryFilterCode: rec,
            isChecked: false
          };
          if (this.secondaryFilterList.findIndex(data => data.secondaryFilterCode === rec) < 0) {
            this.secondaryFilterList.push(model);
            this.defaultSecondaryFilterList.push(model);
          }
        });
        if (this.validationFilterList && this.validationFilterList.length === 0){
        const arrayOfValidators = Array.from(this.validationFilterMap.keys());
        arrayOfValidators.sort();
        arrayOfValidators.forEach(rec => {
          if (rec) {
            const model = {
              primaryFilterCode: rec,
              isChecked: false,
              filterType: 'validationFilter',
              count: 0
            };
            this.validationFilterList.push(model);
            this.defaultValidationFilterList.push(model);
          }
        });
      }
      if (this.primaryFilterList && this.primaryFilterList.length === 0
        && this.valueCodeMap && this.valueCodeMap.entries()) {
        // this.primaryFilterList = [];this.defaultPrimaryFilterList=[];
        const tnxArray = Array.from(new Map([...this.valueCodeMap.entries()]
          .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))).keys());
        tnxArray.forEach(rec => {
          const model = {
            primaryFilterCode: rec,
            isChecked: false,
            count: 0
          };
          this.primaryFilterList.push(model);
          this.defaultPrimaryFilterList.push(model);
        });
      }
      }
      //console.log('productListMap : ', this.secondaryFilterList);
      //console.log('secondaryFilterArrayMap : ', this.secondaryFilterArrayMap);
      //console.log('primaryFilterMap : ', this.primaryFilterMap);
      //console.log('primaryFilterList : ', this.primaryFilterList);
      //console.log('isProductFiltered : ', isProductFiltered);
      //console.log('retultdataArray : ', this.retultdataArray);
      // FETCHING TABLE RECORDS //
      if (this.secondaryFilterArrayMap && this.secondaryFilterArrayMap.size > 0
        && filteredProductList && filteredProductList.length > 0) {
        this.retultdataArray = [];
        this.secondaryFilterList.forEach(product => {
          if (this.secondaryFilterArrayMap.get(product.secondaryFilterCode)) {
            this.secondaryFilterArrayMap.get(product.secondaryFilterCode).forEach(rec => {
              this.retultdataArray.push(rec);
            });
          }
        });
        this.retultdataArray = this.filterValidationData(this.retultdataArray);
        if (this.retultdataArray && this.retultdataArray.length > 0 && this.selectedPrimaryFilter
          && this.selectedPrimaryFilter !== 'All') {
          this.retultdataArray = this.retultdataArray.filter(data =>
            this.translateService.instant(this.statusPrefix + data[this.primaryFilter]) === this.selectedPrimaryFilter);
        }
        //console.log('retult Array ', this.retultdataArray);
      }

      // ACTUAL CHART REPRESENTATION //
      if (isProductFiltered) {
        const labelsWithcount: string[] = [];
        const tableRecords = [];
        this.secondaryFilterList.forEach((element, index) => {
          bgcolors.push(this.bankApprovalsAndRejectionsService.colorsList[index]);
          bordercolors.push(this.bankApprovalsAndRejectionsService.borderColorsList[index]);
          if (filteredTnxList && filteredTnxList.length === 1) {
            const tempProductArray = this.secondaryFilterArrayMap.get(element.secondaryFilterCode);
            if (tempProductArray && tempProductArray.length > 0) {
              let filterProdAndTnx;
              let validationFilter;
              if (filteredTnxList && filteredTnxList.length > 0) {
                validationFilter = filteredTnxList.filter(data => data.filterType === 'validationFilter');
              }
              if (validationFilter && validationFilter.length > 0) {
                filterProdAndTnx = tempProductArray.filter(prodArray => filteredTnxList.some(
                  ele => ele.primaryFilterCode === prodArray[this.validationFilter]));
                filterProdAndTnx = this.filterValidationData(filterProdAndTnx);
                //console.log(' filterProdAndTnx validation : ', filterProdAndTnx);
                if (filterProdAndTnx && filterProdAndTnx.length > 0
                  && this.selectedPrimaryFilter && this.selectedPrimaryFilter !== 'All') {
                  filterProdAndTnx = filterProdAndTnx.filter(data =>
                    this.translateService.instant(this.statusPrefix+ data[this.primaryFilter]) === this.selectedPrimaryFilter);
                }
                filterProdAndTnx.forEach(ele => {
                  tableRecords.push(ele);
                });
              } else {
                filterProdAndTnx = tempProductArray.filter(prodArray => filteredTnxList.some(
                  ele => ele.primaryFilterCode === this.translateService.instant(this.statusPrefix+prodArray[this.primaryFilter])));
                filterProdAndTnx = this.filterValidationData(filterProdAndTnx);
                //console.log(' filterProdAndTnx : ', filterProdAndTnx);
                if (filterProdAndTnx && filterProdAndTnx.length > 0) {
                  filterProdAndTnx.forEach(ele => {
                    tableRecords.push(ele);
                  });
                }
              }
              dataArray2.push(filterProdAndTnx.length);
              labelArray.push(element.secondaryFilterCode);
              labelsWithcount.push(this.translateService.instant(labelArray[index]) + ':' + ' ' +
                '(' + filterProdAndTnx.length + ')');
            }
          } else if (element.secondaryFilterCode){
            const tmpdataArray = this.secondaryFilterArrayMap.get(element.secondaryFilterCode);
            dataArray2.push(tmpdataArray.length);
            tmpdataArray.forEach(ele => {
              tableRecords.push(ele);
            });
            labelArray.push(element.secondaryFilterCode);
            labelsWithcount.push(this.translateService.instant(labelArray[index]) + ':' + ' ' +
              '(' + tmpdataArray.length + ')');
          }
        });
        this.retultdataArray = tableRecords;
        //console.log('labelArray ', labelArray);
        //console.log('dataArray2 ', dataArray2);
        this.secondaryFilterList = [];

        labelArray.forEach((element, index) => {
          labelArray[index] = this.translateService.instant(element);
          const model = {
            secondaryFilterCode: element,
            isChecked: true
          };
          this.secondaryFilterList.push(model);
        });
        const legendNamePie = `${this.translateService.instant(this.approvedTransactionsTitle)}`;
        this.chartData = this.bankApprovalsAndRejectionsService.getPolarAreaData(labelsWithcount, dataArray2,
          legendNamePie, bgcolors, bordercolors);
      } else {

        const labelsWithcount: string[] = [];
        let tmpdataArray = [];
        this.primaryFilterList.forEach((element, index) => {
          if (this.primaryFilterMap.has(element.primaryFilterCode)) {
            if (filteredProductList && filteredProductList.length > 0) {
              const tempdataArray = this.primaryFilterMap.get(element.primaryFilterCode);
              if (tempdataArray && tempdataArray.length > 0) {
                let filterProdAndTnx = tempdataArray.filter(element => filteredProductList.some(
                  ele => ele.secondaryFilterCode === element[this.secondaryFilter]));
                filterProdAndTnx = this.filterValidationData(filterProdAndTnx);
                //console.log(' filterProdAndTnx : ', filterProdAndTnx);
                dataArray2.push(filterProdAndTnx.length);
                labelArray.push(element.primaryFilterCode);
                labelsWithcount.push(labelArray[index] + ':' + ' ' +
                  '(' + filterProdAndTnx.length + ')');
              }
            } else {
              const dataArray = this.primaryFilterMap.get(element.primaryFilterCode);
              if (this.selectedPrimaryFilter === 'All') {
                tmpdataArray = [];
              }
              dataArray.forEach(data => {
                tmpdataArray.push(data);
              });
              tmpdataArray = this.filterValidationData(tmpdataArray);
              dataArray2.push(tmpdataArray.length);
              labelArray.push(element.primaryFilterCode);
              labelsWithcount.push(labelArray[index] + ':' + ' ' +
                '(' + tmpdataArray.length + ')');
            }
          }
          if (!this.primaryFilterMap.has(element.primaryFilterCode)) {
            this.primaryFilterMap.set(element.primaryFilterCode, []);
          }
          bgcolors.push(this.bankApprovalsAndRejectionsService.colorsList[index]);
          bordercolors.push(this.bankApprovalsAndRejectionsService.borderColorsList[index]);
        });
        //console.log('labelArray ', labelArray);
        //console.log('dataArray2 ', dataArray2);
        this.primaryFilterList = [];

        labelArray.forEach((element, index) => {
          labelArray[index] = this.translateService.instant(element);
          const model = {
            primaryFilterCode: element,
            isChecked: true, count: 0
          };
          this.primaryFilterList.push(model);
        });
        const legendNamePie = `${this.translateService.instant(this.approvedTransactionsTitle)}`;
        this.chartData = this.bankApprovalsAndRejectionsService.getPolarAreaData(labelsWithcount, dataArray2,
          legendNamePie, bgcolors, bordercolors);
      }
      this.getCountOfRecords();
      this.totalfilteredCount = this.retultdataArray.length;
      this.inputParams.totalRecords = this.retultdataArray;
      if (this.widgets.widgetName === 'pendingApproval' || this.widgets.widgetName === FccGlobalConstant.TRANSACTION_IN_PROGRESS) {
        this.retultdataArray.sort((a, b) =>
          new Date(b.inpDttm.split('/')[FccGlobalConstant.LENGTH_2],
            b.inpDttm.split('/')[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1,
            b.inpDttm.split('/')[FccGlobalConstant.LENGTH_0]).getTime() -
          new Date(a.inpDttm.split('/')[2], a.inpDttm.split('/')[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1,
            a.inpDttm.split('/')[FccGlobalConstant.LENGTH_0]).getTime());
      }
      else if (this.widgets.widgetName === FccGlobalConstant.TRADE_PAYMENT_WIDGET) {
        this.retultdataArray.sort((a, b) =>
          new Date(a.maturityDate.split('/')[FccGlobalConstant.LENGTH_2],
            a.maturityDate.split('/')[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1,
            a.maturityDate.split('/')[FccGlobalConstant.LENGTH_0]).getTime() -
          new Date(b.maturityDate.split('/')[FccGlobalConstant.LENGTH_2],
            b.maturityDate.split('/')[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1,
            b.maturityDate.split('/')[FccGlobalConstant.LENGTH_0]).getTime());
      }
      if (this.retultdataArray && this.retultdataArray.length > 10) {
        this.showMore = true;
        this.retultdataArray = this.retultdataArray.slice(0, 10);
      }else {
        this.showMore = false;
      }
    }
  }

  getCountOfRecords() {
    if (this.selectedValidationVal !== 'All') {
      this.countForAllEvent = 0;
      this.defaultPrimaryFilterList.forEach((filter, filterIndex) => {
        this.primaryFilterMap.forEach((event, mapIndex) => {
          if (this.defaultPrimaryFilterList[filterIndex].primaryFilterCode === mapIndex) {
            let recordsAvailable = event;
            if (this.selectedProduct && this.selectedProduct.length > 0) {
              recordsAvailable = [];
              recordsAvailable = event.filter(tnx => this.selectedProduct.some(pdt => pdt.productCode === tnx.productCode));
            }
            this.defaultPrimaryFilterList[filterIndex].count = recordsAvailable.length > 0 ?
              recordsAvailable.filter(rec => rec[this.validationFilter] === this.selectedValidationVal).length : 0;
            this.countForAllEvent = this.countForAllEvent + this.defaultPrimaryFilterList[filterIndex].count;
        }
      });
    });
    } else if (this.selectedValidationVal === 'All') {
      this.countForAllEvent = 0;
      this.defaultPrimaryFilterList.forEach((filter, filterIndex) => {
        this.primaryFilterMap.forEach((event, mapIndex, )=>{
          if(this.defaultPrimaryFilterList[filterIndex].primaryFilterCode === mapIndex) {
            let recordsAvailable = event;
            if (this.selectedProduct && this.selectedProduct.length > 0){
              recordsAvailable = [];
              recordsAvailable = event.filter(tnx => this.selectedProduct.some(pdt => pdt.productCode === tnx.productCode ));
            }
            this.defaultPrimaryFilterList[filterIndex].count = recordsAvailable.length > 0 ? recordsAvailable.length : 0;
            this.countForAllEvent = this.countForAllEvent + this.defaultPrimaryFilterList[filterIndex].count;
          }
        });
      });
    }
  }

  prepareDataArray(){
    //console.log('total Array ',this.retultdataArray);
    this.retultdataArray.forEach(element => {
      this.totalCount++;
      if (this.defaultSelection) {
        const transactionType = (element.transactionType).toLowerCase().replace(/\s/g, '');
        if ((this.transactionCountMap.get(transactionType)) === undefined){
          this.transactionCountMap.set(transactionType, 1);
          const tmpdataArray = [];
          tmpdataArray.push(element);
          this.resulDataArrayMap.set(transactionType, tmpdataArray);
        }else{
          this.transactionCountMap.set(transactionType,
                          this.transactionCountMap.get(transactionType) + 1);
          const tmpdataArray = this.resulDataArrayMap.get(transactionType);
          tmpdataArray.push(element);
          this.resulDataArrayMap.set(transactionType, tmpdataArray);
        }
      }
      else {
        const productType = this.secondaryFilter ? element[this.secondaryFilter].replace(/\s/g, '') : null;
        const transactionType = (this.primaryFilter) ?
          this.translateService.instant(this.statusPrefix + element[this.primaryFilter].replace(/\s/g, '')) : null;
        const validationType = this.validationFilter ? element[this.validationFilter].replace(/\s/g, '') : null;

        if ((this.primaryFilterMap.get(transactionType)) === undefined) {
          const tmpdataArray = [];
          tmpdataArray.push(element);
          this.primaryFilterMap.set(transactionType, tmpdataArray);
          this.valueCodeMap.set(transactionType, element[this.primaryFilter]);
        }else{
          const tmpdataArray = this.primaryFilterMap.get(transactionType);
          tmpdataArray.push(element);
          this.primaryFilterMap.set(transactionType, tmpdataArray);
          this.valueCodeMap.set(transactionType, element[this.primaryFilter]);
        }

        if (productType && (this.secondaryFilterArrayMap.get(productType)) === undefined) {
          const tmpdataArray = [];
          tmpdataArray.push(element);
          this.filterOption.push({
            label: this.translateService.instant(productType),
            value: {
              productCode: productType,
              name: this.translateService.instant(productType)
            }
          });
          this.secondaryFilterArrayMap.set(productType, tmpdataArray);
        }else if (productType){
          const tmpdataArray = this.secondaryFilterArrayMap.get(productType);
          tmpdataArray.push(element);
          this.secondaryFilterArrayMap.set(productType, tmpdataArray);
        }

        if ((this.validationFilterMap.get(validationType)) === undefined){
          const tmpdataArray = [];
          tmpdataArray.push(element);
          this.validationFilterMap.set(validationType, tmpdataArray);
        }else{
          const tmpdataArray = this.validationFilterMap.get(validationType);
          tmpdataArray.push(element);
          this.validationFilterMap.set(validationType, tmpdataArray);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.isUiloaded = true;
  }

  loadArray() {
    if (this.isUiloaded) {
      this.finalData = this.listdef.finalData;
      // eslint-disable-next-line no-console
      //console.log(this.listdef.finalData);
      this.listdef.table.data = [];
      this.listdef.addColumnDetails();
    }
  }

  checkForBooleanValue(value: string) {
    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return value;
    }
  }

  deleteCards() {
    this.hideShowDeleteWidgetsService.listdefChartComp.next(true);
    this.hideShowDeleteWidgetsService.listdefChartComp.subscribe(
      res => {
        this.hideShowCard = res;
      }
    );
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(this.widgets.widgetName, this.widgets.widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(this.widgets.widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }

  selectData(e: any){

    this.updateColumsData(this.groupNames[e.element._index]);
    this.retultdataArray = this.resulDataArrayMap.get(this.groupNames[e.element._index]);
    if (this.retultdataArray.length > 10){
        this.showMore = true;
        this.retultdataArray = this.retultdataArray.slice(0, 10);
    }else {
      this.showMore = false;
    }

    this.selectedLegend = this.translateService.instant(this.groupNames[e.element._index]);

  }

  getResponsesFromListDef(filterparams: any, paginatorParams: any) {
    const listdefarray = this.listdefName.split(',');
    if ( listdefarray[1] !== undefined){
     return forkJoin([this.listService.getTableData(listdefarray[0], JSON.stringify(filterparams) , JSON.stringify(paginatorParams)),
      this.listService.getTableData(listdefarray[1], JSON.stringify(filterparams) , JSON.stringify(paginatorParams))]);
    }else{
      return forkJoin([this.listService.getTableData(listdefarray[0], JSON.stringify(filterparams) , JSON.stringify(paginatorParams)),
      of(undefined)]);
    }

  }

  onClickViewAllTransactions() {
    const dashBoardURI = this.dashboardName.split('/');
    const dashboardNameVal = dashBoardURI[dashBoardURI.length - 1].toUpperCase();
    this.commonService.setWidgetClicked(dashboardNameVal);

    if(this.header === 'upcomingEventsLoan'){
      this.router.navigate(['productListing'], { queryParams: { productCode: 'LN', operation:'live',option: 'GENERAL' } });
    } else if(dashboardNameVal === 'TRADE'){
      let pdtArray;
      const eventValSelected = this.valueCodeMap.get(this.selectedPrimaryFilter);
      if (this.selectedProduct && this.selectedProduct.length > 0) {
        pdtArray = '';
        this.selectedProduct.forEach(pdt => {
          if (pdtArray !== '' ) {
            pdtArray = pdtArray + this.separator;
          }
          pdtArray = pdtArray+pdt.productCode + 'Tnx';
        });
      }
      this.generateFilterFromWidget(pdtArray, eventValSelected);
      if (this.header === FccGlobalConstant.TRADE_PAYMENT_WIDGET) {
        if (this.selectedValidationVal === 'outstanding') {
        this.router.navigate(['productListing'], {
          queryParams: {
            dashboardType: dashboardNameVal,
            subProductCode: null, option: 'TRADEPAYMENTOUTSTANDINGWIDGET'
          }
        });
      } else {
        this.router.navigate(['productListing'], {
          queryParams: {
            dashboardType: dashboardNameVal,
            subProductCode: null, option: 'TRADEPAYMENTOVERDUEWIDGET'
          }
        });
      }
      } else {
        this.router.navigate(['productListing'], {
          queryParams: {
            dashboardType: dashboardNameVal,
            subProductCode: null, option: this.header
          }
        });
      }
    }else{
      this.router.navigate(['productListing'], { queryParams: { dashboardType: dashboardNameVal,
        subProductCode: null, option: this.header } });
    }
  }
  generateFilterFromWidget(pdtArray, eventValSelected) {
    if (this.widgets.widgetName === FccGlobalConstant.PENDING_APPROVAL) {
      const filterPreference = {};
      if (pdtArray) {
        filterPreference[FccGlobalConstant.PARAMETER1] = pdtArray ? pdtArray : '';
      }
      filterPreference['event'] = this.selectedPrimaryFilter !== 'All' ? eventValSelected : '';
      this.commonService.setFilterPreference(filterPreference);
    }
    else if (this.widgets.widgetName === FccGlobalConstant.TRANSACTION_IN_PROGRESS) {
      const filterPreference = {};
      if (pdtArray) {
        filterPreference[FccGlobalConstant.PARAMETER1] = pdtArray ? pdtArray : '';
      }
      filterPreference['tnx_stat_code'] = this.selectedPrimaryFilter !== 'All' ? eventValSelected : '';
      this.commonService.setFilterPreference(filterPreference);
    }
    else if (this.widgets.widgetName === FccGlobalConstant.ACTION_REQUIRED_WIDGET) {
      const filterPreference = {};
      if (pdtArray) {
        filterPreference[FccGlobalConstant.PARAMETER1] = pdtArray ? pdtArray : '';
      }
      if (eventValSelected === FccGlobalConstant.RESPONSE) {
        const responseArray = [FccGlobalConstant.N042_AMENDMENT_RESPONSE,
        FccGlobalConstant.N042_CANCEL_RESPONSE,
        FccGlobalConstant.N042_CONSENT_RESPONSE,
        FccGlobalConstant.N042_EARLY_PAYMENT_ACCEPTANCE,
        FccGlobalConstant.N042_EARLY_PAYMENT_ACCEPTANCE,
        FccGlobalConstant.N042_CLEAN_RESPONSE];
        let filterString = '';
        responseArray.forEach(pdt => {
          if (pdt !== '' ) {
            filterString = filterString + pdt + this.separator;
          }
        });
        filterPreference['action_req_code'] = filterString;
      } else if (eventValSelected === FccGlobalConstant.DISCREPANCY) {
        filterPreference['action_req_code'] = FccGlobalConstant.N042_DISCREPANCY_RESPONSE;
      }else if (eventValSelected === FccGlobalConstant.INSTRUCTION) {
        const responseArray = [FccGlobalConstant.N042_STANDING_INSTRUCTIONS, FccGlobalConstant.N042_CUSTOMER_INSTRUCTION];
        let filterString = '';
        responseArray.forEach(pdt => {
          if (pdt !== '' ) {
            filterString = filterString + pdt + this.separator;
          }
        });
        filterPreference['action_req_code'] = filterString;
      }
      this.commonService.setFilterPreference(filterPreference);
    }
    else if (this.widgets.widgetName === FccGlobalConstant.TRADE_PAYMENT_WIDGET) {
      const filterPreference = {};
      if (pdtArray) {
        filterPreference[FccGlobalConstant.PARAMETER1] = pdtArray ? pdtArray : '';
      }
      let productArray;
      if (eventValSelected === 'incoming') {
        const incomingProducts = ['EC', 'EL', 'SR', 'BR'];
        if (this.selectedProduct && this.selectedProduct.length > 0) {
          productArray = this.selectedProduct.filter(item => incomingProducts.includes(item.productCode)).map(a => a.productCode);
        } else {
          productArray = incomingProducts;
        }
      } else if (eventValSelected === 'outgoing') {
        const outgoingProducts = ['LC', 'BG', 'SI', 'IC'];
        if (this.selectedProduct && this.selectedProduct.length > 0) {
          productArray = this.selectedProduct.filter(item => outgoingProducts.includes(item.productCode)).map(a => a.productCode);
        } else {
          productArray = outgoingProducts;
        }
      }
      if (productArray && productArray.length > 0) {
        pdtArray = '';
        productArray.forEach(pdt => {
          if (pdtArray !== '') {
            pdtArray = pdtArray + this.separator;
          }
          pdtArray = pdtArray + pdt + 'Tnx';
        });
        filterPreference[FccGlobalConstant.PARAMETER1] = pdtArray ? pdtArray : '';
      }
      this.commonService.setFilterPreference(filterPreference);
    }
  }

  onRemoveChart() {
    this.commonService.isDeleteIconClicked('yes');
    this.cssTable = 'p-col-12';
  }
  getChartClass() {
    return this.cssChart;
  }

  onClickLoanPayment($event, rowData) {
    const tnxType = FccGlobalConstant.N002_INQUIRE;
    const optionValue = FccGlobalConstant.EXISTING_OPTION;
    const subTnxTypeCode = FccGlobalConstant.N003_PAYMENT;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams: {
        productCode: rowData.productCode, refId: rowData.refId,
        tnxTypeCode: tnxType, option: optionValue, subTnxTypeCode
      }
    });
  }


  onClickRollover($event, rowData) {
    this.commonService.selectedRows = [];
    const formattedData = {
      ref_id: rowData.refId,
      pricing_option: rowData.pricingOption,
      borrower_reference: rowData.borrowerReference,
      bo_facility_id: rowData.boFacilityId,
      bo_deal_id: rowData.boDealId,
      cur_code: rowData.curCode,
      repricing_date: rowData.repricingDate
    };
    this.commonService.selectedRows.push(formattedData);
    const currentDateToValidate = this.utilityService.transformDateFormat(new Date());
    const dateRequestParams = this.commonService.requestToValidateDate(currentDateToValidate, formattedData);
    this.commonService.getValidateBusinessDate(dateRequestParams).subscribe((res) => {
      if (res) {
        if (res && res.adjustedLocalizedDate && formattedData && formattedData.repricing_date){
          const adjustedDate = this.utilityService.transformddMMyyyytoDate(res.adjustedLocalizedDate);
          const selectedDate = this.utilityService.transformddMMyyyytoDate(formattedData.repricing_date);
          if (!this.utilityService.compareDateFields(adjustedDate, selectedDate)) {
            this.getConfigDataForRollover(formattedData);
          } else {
            const dir = localStorage.getItem('langDir');
            const locaKeyValue = `${this.translateService.instant('repriceDateLessThanSelectedDate')}` + res.adjustedLocalizedDate;
            this.dialogService.open(ConfirmationDialogComponent, {
              header: `${this.translateService.instant('message')}`,
              width: '35em',
              styleClass: 'fileUploadClass',
              style: { direction: dir },
              data: { locaKey: locaKeyValue,
                showOkButton: true,
                showNoButton: false,
                showYesButton: false
              },
              baseZIndex: 10010,
              autoZIndex: true
            });
          }
        }
      }
    });
  }

  getConfigDataForRollover(rowData) {
    this.commonService.getConfiguredValues('CHECK_FACILITY_STATUS_ON_CLICK_ROLLOVER').subscribe(resp => {
      if (resp.response && resp.response === 'REST_API_SUCCESS') {
        if (resp.CHECK_FACILITY_STATUS_ON_CLICK_ROLLOVER === 'true'){
          this.listService
                .getFacilityDetail('/loan/listdef/customer/LN/getFacilityDetail',
                rowData.borrower_reference, rowData.bo_deal_id ).subscribe(facResponse => {
                  facResponse.rowDetails.forEach(facility => {
                    const filteredData = facility.index.filter(row => row.name === 'id'
                      && (this.commonService.decodeHtml(row.value) === rowData.bo_facility_id));
                    if (filteredData && filteredData.length > 0){
                      const filteredStatusData = facility.index.filter(row => row.name === 'status');
                      if (filteredStatusData[0].value === FccGlobalConstant.expired) {
                        const dir = localStorage.getItem('langDir');
                        const locaKeyValue = this.translateService.instant('rolloverErrorOnExpiredFacility');
                        const expiredFacDialog = this.dialogService.open(ConfirmationDialogComponent, {
                          header: `${this.translateService.instant('message')}`,
                          width: '35em',
                          styleClass: 'fileUploadClass',
                          style: { direction: dir },
                          data: { locaKey: locaKeyValue,
                            showOkButton: true,
                            showNoButton: false,
                            showYesButton: false
                          },
                          baseZIndex: 10010,
                          autoZIndex: true
                        });
                        expiredFacDialog.onClose.subscribe(() => {
                          //eslint : no-empty-function
                        });
                      } else {
                          this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
                            queryParams: {
                              productCode: FccGlobalConstant.PRODUCT_BK,
                              subProductCode: FccGlobalConstant.SUB_PRODUCT_LNRPN,
                              mode: FccGlobalConstant.INITIATE,
                              option: FccGlobalConstant.BK_LOAN_REPRICING,
                              tnxTypeCode: FccGlobalConstant.N002_NEW
                            },
                          });
                    }
                  }
                  });
                });
        } else {
            this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
              queryParams: {
                productCode: FccGlobalConstant.PRODUCT_BK,
                subProductCode: FccGlobalConstant.SUB_PRODUCT_LNRPN,
                mode: FccGlobalConstant.INITIATE,
                option: FccGlobalConstant.BK_LOAN_REPRICING,
                tnxTypeCode: FccGlobalConstant.N002_NEW
              },
            });
        }
      }
    });
  }

  onClickViews(event, rowData) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['view'], { queryParams: { tnxid: rowData.tnxId, referenceid: rowData.refId,
        productCode: rowData.productCode, tnxTypeCode: rowData.tnxTypeCode,
        eventTnxStatCode: rowData.tnxStatCode, mode: FccGlobalConstant.VIEW_MODE,
        subTnxTypeCode: rowData.subTnxTypeCode,
        operation: FccGlobalConstant.PREVIEW } })
    );
    const popup = window.open('#' + url, '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
    const productId = `${this.translateService.instant(rowData.product_code)}`;
    const mainTitle = `${this.translateService.instant('MAIN_TITLE')}`;
    popup.onload = () => {
      popup.document.title = mainTitle + ' - ' + productId;
    };
}
 productChange() {
    this.defaultSecondaryFilterList.forEach(product=>{
      product.isChecked = false;
    });
    this.secondaryFilterList = this.defaultSecondaryFilterList;
    this.selectedProduct.forEach(pdt => {
      this.defaultSecondaryFilterList.forEach(product=>{
        if(product.secondaryFilterCode === pdt.productCode) {
          product.isChecked = true;
        }
      });
      this.secondaryFilterList.forEach(product=>{
        if (product.secondaryFilterCode === pdt.productCode) {
          product.isChecked = true;
        }
      });
    });
    this.hideColumns();
 }

 hideColumns() {
   this.inputParams.metadata.Column.forEach(col => {
     if ((this.selectedPrimaryFilter !== 'All'
       || this.defaultPrimaryFilterList && this.defaultPrimaryFilterList.length === 1)
       && col.name === 'tnxTypeCode') {
       col.showAsDefault = false;
     } else if (this.selectedPrimaryFilter === 'All' &&
       this.defaultPrimaryFilterList &&
       this.defaultPrimaryFilterList.length > 1 && col.name === 'tnxTypeCode') {
       col.showAsDefault = true;
     } else if (this.selectedValidationVal !== 'All' &&
       this.enableValidationFilter && col.name === 'nextauthoriserPreviousUsers') {
       col.showAsDefault = false;
     } else if (this.selectedValidationVal === 'All' &&
        this.enableValidationFilter && col.name === 'nextauthoriserPreviousUsers') {
       col.showAsDefault = true;
       col.hidden = false;
     } else if (!this.enableValidationFilter && col.name === 'nextauthoriserPreviousUsers') {
        col.hidden = true;
     }
     if (this.billReferenceEnabled ){
      if (col.name === 'impBillRefId') {
        col.hidden = false;
      } else if (col.name === 'boTnxId') {
        col.hidden = true;
      }
    }else if (!this.billReferenceEnabled ){
      if (col.name === 'impBillRefId') {
        col.hidden = true;
      } else if (col.name === 'boTnxId') {
        col.hidden = false;
      }
    }
   });
 }
 onClickProduct() {
  this.productChange();
  const filteredProductData = this.secondaryFilterList.filter(rec=>rec.isChecked);
  let filteredTnxData = this.primaryFilterList.filter(rec=>rec.isChecked);
  const filteredValidationData = this.validationFilterList.filter(rec=>rec.isChecked);
  if (filteredTnxData && (filteredTnxData.length !== 1) &&
  filteredValidationData && (filteredValidationData.length !== 1)
  && filteredProductData && filteredProductData.length > 0){
    filteredTnxData = this.defaultPrimaryFilterList;
  }
  if (filteredValidationData && filteredValidationData.length === 1) {
    filteredTnxData = filteredValidationData;
  }
  this.prepareChartData(filteredProductData, filteredTnxData);
  //console.log('product list ', this.secondaryFilterList);
 }

 onClickTnx(event, itemCode) {
  this.productChange();
  //console.log('event value tnx ',event);
  this.primaryFilterList = this.defaultPrimaryFilterList;
  if (itemCode === 'All') {
    this.defaultPrimaryFilterList.forEach(tnx=>{
        tnx.isChecked = true;
    });
    this.primaryFilterList = this.defaultPrimaryFilterList;
  } else {
    this.defaultPrimaryFilterList.forEach(tnx=>{
      if(tnx.primaryFilterCode === itemCode) {
        tnx.isChecked = true;
      }else {
        tnx.isChecked = false;
      }
    });
    this.primaryFilterList.forEach(tnx=>{
      if(tnx.primaryFilterCode === itemCode) {
        tnx.isChecked = true;
      }else {
        tnx.isChecked = false;
      }
    });
  }
  const filteredProductData = this.secondaryFilterList.filter(rec=>rec.isChecked);
  const filteredTnxData = this.primaryFilterList.filter(rec=>rec.isChecked);
  //console.log('filtered product data ', filteredProductData);
  this.prepareChartData(filteredProductData, filteredTnxData);
  //console.log(' tnx list ', this.secondaryFilterList);
 }

 onClickValidator(itemCode) {
  // console.log('event value product ',event);
  this.productChange();
  this.validationFilterList = this.defaultValidationFilterList;
  this.defaultValidationFilterList.forEach(tnx=>{
    if(tnx.primaryFilterCode === itemCode) {
      tnx.isChecked = true;
    }else {
      tnx.isChecked = false;
    }
  });
  let filteredData;
  if (itemCode === 'All' && this.selectedPrimaryFilter !== 'All') {
    this.primaryFilterList.forEach(tnx=>{
      if(tnx.primaryFilterCode === this.selectedPrimaryFilter) {
        tnx.isChecked = true;//event.target.checked;
      }else {
        tnx.isChecked = false;
      }
    });
    filteredData = this.primaryFilterList;
  }
  else {
    this.validationFilterList.forEach(tnx=>{
      if(tnx.primaryFilterCode === itemCode) {
        tnx.isChecked = true;
      }else {
        tnx.isChecked = false;
      }
    });
    filteredData = this.validationFilterList;
  }
  const filteredProductData = this.secondaryFilterList.filter(rec=>rec.isChecked);
  if (this.secondaryFilterList && this.secondaryFilterList.length > 0){
    this.selectedProduct.forEach(pdt=>{
      filteredProductData.push(pdt.productCode);
    });
  }
  const filteredTnxData = filteredData.filter(rec=>rec.isChecked);
  this.prepareChartData(filteredProductData, filteredTnxData);
  //console.log(' tnx list ', filteredData);
 }

  onClickView(event, rowData, actionvalue){
    // const url = 'reviewScreen?tnxid=21062600019247&referenceid=LN21060000014796&action=approve&mode=view&productCode=LN'
    // + '&subProductCode=LNDR';
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['reviewScreen'], {
        queryParams: {
          tnxid: rowData.tnxId,
          referenceid: rowData.refId,
          mode: FccGlobalConstant.VIEW_MODE,
          productCode: rowData.productCodeVal,
          subProductCode: rowData.subProductCodeVal,
          operation: FccGlobalConstant.LIST_INQUIRY,
          hideTopMenu: FccGlobalConstant.HIDE_TOP_MENU
        }
      })
    );
    if (rowData && rowData.productCodeVal && (rowData.productCodeVal === FccGlobalConstant.PRODUCT_LN ||
      rowData.subProductCodeVal === FccGlobalConstant.SUB_PRODUCT_LNRPN
      || rowData.subProductCodeVal === FccGlobalConstant.SUB_PRODUCT_BLFP)) {
      this.router.navigate(['reviewScreen'], {
        queryParams: {
          tnxid: rowData.tnxId,
          referenceid: rowData.refId,
          action: actionvalue,
          mode: FccGlobalConstant.VIEW_MODE,
          productCode: rowData.productCodeVal,
          subProductCode: rowData.subProductCodeVal,
          operation: FccGlobalConstant.LIST_INQUIRY
        }
      });
    } else {
      window.open('#' + url, '_blank', 'top=100,left=200,height=800,width=900,toolbar=no,resizable=no');
    }
  }

  getColumnAction(action: any, acctionName: any){
    if (action && action.indexOf(acctionName) > -1){
      return true;
    }else{
      return false;
    }
  }

  checkLegend(legendName: string): boolean {
    const translatedLegendName = this.translateService.instant(legendName);
    return translatedLegendName === this.selectedLegend;
  }

  checkWidgetName(widgetName: string): boolean {
    return this.widgets.widgetName === widgetName;
  }

  setDirections(purpose: string, value: string): string {
    switch (purpose) {
      case 'className':
        return this.dir === 'rtl' ? 'ui-rtl' : 'none';
      case 'direction':
        return this.dir === 'rtl' ? 'left' : 'right';
      case 'paginatorDirection':
        return this.dir === 'rtl' ? (value === 'left' ? 'paginatorright' : 'paginatorleft') :
          (value === 'left' ? 'paginatorleft' : 'paginatorright');
      case 'colDirection':
        return this.dir === 'rtl' ? (value === 'left' ? 'right' : 'left') : value;
    }
  }
  ngOnDestroy(): void {
    this.bankApprovalsAndRejectionsService.removeLabel = false;
  }
}
export interface secondaryFilterModel {
  secondaryFilterCode: string;
  isChecked: boolean
}
export interface primaryFilterModel {
  primaryFilterCode: string;
  filterType?: string;
  isChecked: boolean;
  count: number;
}
