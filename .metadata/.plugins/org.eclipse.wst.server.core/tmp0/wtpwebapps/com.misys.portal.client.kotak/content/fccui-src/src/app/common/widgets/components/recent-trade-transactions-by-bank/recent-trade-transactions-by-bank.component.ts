import { Component, OnInit, Input } from '@angular/core';
import { FccGlobalConstant } from '../../../core/fcc-global-constants';
import { CommonService } from '../../../services/common.service';
import { HideShowDeleteWidgetsService } from '../../../services/hide-show-delete-widgets.service';
import { DashboardService } from '../../../services/dashboard.service';
import { FccGlobalConstantService } from '../../../core/fcc-global-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalDashboardComponent } from '../../../components/global-dashboard/global-dashboard.component';
import { SessionValidateService } from '../../../services/session-validate-service';
import { BankApprovalsAndRejectionsService } from '../../../services/bank-approvals-and-rejections.service';
import { FccGlobalConfiguration } from '../../../core/fcc-global-configuration';
import { Router } from '@angular/router';
import { OPEN_CLOSE_ANIMATION } from '../../../model/animation';
import { MultiBankService } from '../../../services/multi-bank.service';
import { ListDefService } from '../../../services/listdef.service';
import { CodeData } from './../../../../common/model/codeData';


@Component({
  selector: 'app-recent-trade-transactions-by-bank',
  templateUrl: './recent-trade-transactions-by-bank.component.html',
  styleUrls: ['./recent-trade-transactions-by-bank.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class RecentTradeTransactionsByBankComponent implements OnInit {

  @Input () dashboardName;
  checkCustomise;
  hideShowCard;
  selectedProduct = [];
  classCheck;
  polarAreaChartData: any;
  approvedTransactions;
  viewPastTransactions;
  polarAreaChart = this.bankApprovalsAndRejectionsService.polarArea;
  contextPath: any;
  businessAreaList: any[] = [];
  response: any;
  approvalsList: any[] = [];
  dataAvailable: boolean;
  legendsList: any[] = [];
  tnxCount = [];
  colors = [];
  dashboardType ;
  count: any;
  days: string;
  rowCount: string;
  dispalyIcon = false;
  selectedLegend = '';
  totalCount = 0;
  dojoUrl;
  dashboard = '';
  separator = '|';
  polarAreaChartOptions = this.bankApprovalsAndRejectionsService.polarAreaChartOptions;
  borderColors = [];
  productCodes = [];
  approvalDays = this.translateService.instant('approvalDays');
  day = this.translateService.instant('day');
  star = this.translateService.instant('star');
  of = this.translateService.instant('of');
  showMessage = this.translateService.instant('showMessage');
  recordsDisplayed = this.translateService.instant('recordsDisplayed');
  noApprovals = this.translateService.instant('noApprovals');
  cols = [];
  cssTextAlingnRight = 'right';
  cssTextAlingnLeft = 'left';
  recordAvailable = false;
  inputParams: any = {};
  dir: any;
  codeData = new CodeData();
  prodStatCodeSet = new Set();
  approvedProdStatFilter: string = "";

  configuredKeysList = 'BANK_APPROVAL_AND_REJECTION_DAYS,BANK_APPROVAL_AND_REJECTION_ROW_COUNT';
  keysNotFoundList: any[] = [];
  viewAllTnxPermission = false;
  billReferenceEnabled: boolean;

  @Input() widgetDetails;
  nudges: any;
  widgets: any;
  header: any;
  widgetConfig: any;
  listdefName: any;
  filterOption = [];
  isEntityUser: boolean;
  constructor(protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected globalDashboardComponent: GlobalDashboardComponent,
              protected commonService: CommonService,
              protected dashboardService: DashboardService,
              protected translateService: TranslateService,
              protected listService: ListDefService,
              protected sessionValidation: SessionValidateService,
              protected bankApprovalsAndRejectionsService: BankApprovalsAndRejectionsService,
              protected fccGlobalConfiguration: FccGlobalConfiguration,
              protected router: Router, protected multiBankService: MultiBankService,
              protected corporateCommonService: CommonService) { }

  ngOnInit() {
    this.checkUserEntities();
    this.initializeApprovedProductStatCodeFilter();
    this.dir = localStorage.getItem('langDir');
    const dashBoardURI = this.dashboardName.split('/');
    this.dashboardType = dashBoardURI[dashBoardURI.length - 1].toUpperCase() ;
    this.contextPath = this.commonService.getContextPath();
    this.inputParams['dashboardTypeValue'] = this.dashboardType;
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.header = this.widgets.widgetName;
    if (this.widgets !== '' && this.widgets.widgetConfig) {
      this.widgetConfig = JSON.parse(this.widgets.widgetConfig);
      const dashBoardURI = this.dashboardName.split('/');
      this.dashboardType = dashBoardURI[dashBoardURI.length - 1].toUpperCase() ;
      this.inputParams['dashboardTypeValue'] = this.dashboardType;
      this.listdefName = this.widgetConfig.tableConfig.listdefName;
      this.inputParams.widgetName = this.widgets.widgetName;
      if (this.widgets.widgetName === 'approvedTransactionsByBank') {
        this.approvedTransactions = 'approvedTransactions';
        this.viewPastTransactions = 'viewPastApprovedTransactions';
      } else if (this.widgets.widgetName === 'rejectedTransactions') {
        this.approvedTransactions = 'rejectedTransactions';
        this.viewPastTransactions = 'viewPastRejectedTransactions';
      }

    }
    if (this.listdefName) {
      this.getMetaData();
    }

    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response.response && response.response === 'REST_API_SUCCESS') {
          this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
          this.updateValues();
          if (this.widgets.widgetName === 'approvedTransactionsByBank') {
            this.getApprovals();
          } else if (this.widgets.widgetName === 'rejectedTransactions') {
            this.getRejections();
          }
         }
      });
    } else {
      this.updateValues();
      if (this.widgets.widgetName === 'approvedTransactionsByBank') {
        this.getApprovals();
      } else if (this.widgets.widgetName === 'rejectedTransactions') {
        this.getRejections();
      }
    }
    if (localStorage.getItem('language') === 'ar'){
      this.cssTextAlingnRight = 'left';
      this.cssTextAlingnLeft = 'right';
    }
    this.commonService.getUserPermission(FccGlobalConstant.MESSAGE_CENTER_ACCESS).subscribe(permission => {
      if (permission) {
        this.viewAllTnxPermission = true;
      }
    });


    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });

    this.contextPath = this.commonService.getContextPath();

  }


  checkUserEntities() {
    this.multiBankService.getCustomerBankDetails('LN', '').subscribe(
      res => {
        this.multiBankService.initializeProcess(res);
        if (this.multiBankService.getIsEntity()) {
          this.isEntityUser = true;
        }
      },
      () => {
        this.multiBankService.clearAllData();
      }
    );
  }

  getData() {
    const firstSetColorArray = this.colors;
    const labelArray: string[] = this.legendsList;
    const dataArray1: string[] = this.tnxCount;
    const firstSetColor: any[] = [];
    const translatedLabels: string[] = [];
    const legendNamePie =
        `${this.translateService.instant(this.approvedTransactions)} ${
        this.translateService.instant(this.polarAreaChart)}`;

    for (let i = 0; i < labelArray.length; i++) {
      firstSetColor.push(firstSetColorArray[i]);
      translatedLabels.push(this.translateService.instant(labelArray[i]) + ':' + ' ' +
       '(' + this.translateService.instant(dataArray1[i]) + ')');
    }

    this.polarAreaChartData = this.bankApprovalsAndRejectionsService.getPolarAreaData(
      translatedLabels,
        dataArray1,
        legendNamePie,
        firstSetColor,
        this.borderColors
    );

  }

  updateValues() {
    this.days = FccGlobalConfiguration.configurationValues.get('BANK_APPROVAL_AND_REJECTION_DAYS');
    this.rowCount = FccGlobalConfiguration.configurationValues.get('BANK_APPROVAL_AND_REJECTION_ROW_COUNT');
    this.billReferenceEnabled = (FccGlobalConfiguration.configurationValues
      .get('show.billReference') === 'true') ? true : false;
  }

  getApprovals() {
    this.dashboardService.getBankApprovals(FccGlobalConstant.N004_ACKNOWLEDGED, '', true, this.dashboardType).subscribe(
      data => {
        if (data.status === FccGlobalConstant.LENGTH_200) {
          this.response = data.body;
          this.recordAvailable = true;
          this.businessAreaList = this.response.products.split(',');
          this.getTransactions(this.dashboardType);
          this.inputParams[FccGlobalConstant.DRILL_DOWN_ENABLED] = true;
          this.inputParams[FccGlobalConstant.SHOW_FILTER_SECTION] = false;
          this.inputParams.chartTableData = true;
          this.getData();
          // Dropdown Data formation
          if (this.bankApprovalsAndRejectionsService.productsList
            && this.bankApprovalsAndRejectionsService.productsList.length > 0) {
            this.bankApprovalsAndRejectionsService.productsList.forEach((productCode) => {
              this.filterOption.push({
                label: this.translateService.instant(productCode),
                value: {
                  productCode: productCode,
                  name: this.translateService.instant(productCode)
                }
              });
            });
          }
        }
      });
  }

  onClickProduct(){
    if (this.selectedProduct && this.selectedProduct.length > 0 ) {
      const productCodeArray = this.selectedProduct.map(function(product){
        return product.productCode;
      });
      this.approvalsList = this.bankApprovalsAndRejectionsService
              .getMultipleProductTransactionsList(this.dashboard, this.response, productCodeArray, true);
      this.approvalsList.sort((a, b) =>
      new Date(b.boInpDttm.split('/')[FccGlobalConstant.LENGTH_2],
        b.boInpDttm.split('/')[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1,
        b.boInpDttm.split('/')[FccGlobalConstant.LENGTH_0]).getTime() -
      new Date(a.boInpDttm.split('/')[2], a.boInpDttm.split('/')[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1,
        a.boInpDttm.split('/')[FccGlobalConstant.LENGTH_0]).getTime());
        this.approvalsList.forEach(rec=>{
          rec.action = 'VIEW';
        });
      this.approvalsList = this.approvalsList.splice(0, +this.rowCount);
    } else {
      this.getTransactions(this.dashboardType);
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
    this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
    JSON.parse(this.widgetDetails).widgetPosition);
    this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }

  onPanelShowHandler(): void {
    const multiSelectClose = Array.from(document.getElementsByClassName('ui-multiselect-close'));
    multiSelectClose.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("close");
      element[FccGlobalConstant.TITLE] = this.translateService.instant("close");
    });
  }

  getTransactions(type: string) {
    BankApprovalsAndRejectionsService.dataAvailable = false;
      this.approvalsList = [];
      this.dashboard = type;
      this.approvalsList = this.bankApprovalsAndRejectionsService.getTransactionsList(type, this.response, false, true);
      this.inputParams.totalRecords = this.approvalsList;
      this.approvalsList.sort((a, b) =>
      new Date(b.boInpDttm.split('/')[FccGlobalConstant.LENGTH_2],
        b.boInpDttm.split('/')[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1,
        b.boInpDttm.split('/')[FccGlobalConstant.LENGTH_0]).getTime() -
      new Date(a.boInpDttm.split('/')[2], a.boInpDttm.split('/')[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1,
        a.boInpDttm.split('/')[FccGlobalConstant.LENGTH_0]).getTime());
        this.approvalsList.forEach(rec=>{
          rec.action = 'VIEW';
        });
      this.approvalsList = this.approvalsList.splice(0, +this.rowCount);
      this.dataAvailable = BankApprovalsAndRejectionsService.dataAvailable;
      this.count = this.bankApprovalsAndRejectionsService.getTransactionCount(false , type, this.response);
      this.tnxCount = this.count.get('tnxCount');
      this.colors = this.count.get('colors');
      this.legendsList = this.count.get('legendsList');
      this.totalCount = this.count.get('totalCount');
      this.borderColors = this.count.get('borderColors');
      this.productCodes = this.count.get('productCodes');

  }

onClickViewAllTransactions() {
  const dashBoardURI = this.dashboardName.split('/');
  const dashboardNameVal = dashBoardURI[dashBoardURI.length - 1].toUpperCase();
  this.commonService.setWidgetClicked(dashboardNameVal);
  const filterPreference = {};
  let pdtArray;
  if (this.selectedProduct && this.selectedProduct.length > 0) {
    pdtArray = '';
    this.selectedProduct.forEach(pdt => {
      if (pdtArray !== '' ) {
        pdtArray = pdtArray + this.separator;
      }
      pdtArray = pdtArray+pdt.productCode + 'Tnx';
    });
  }
  if (pdtArray) {
    filterPreference[FccGlobalConstant.PARAMETER1] = pdtArray ? pdtArray : '';
  }
  if (this.widgets.widgetName === 'approvedTransactionsByBank') {
    filterPreference[FccGlobalConstant.prodStatCode] = this.approvedProdStatFilter;
  } else if (this.widgets.widgetName === 'rejectedTransactions') {
    filterPreference[FccGlobalConstant.prodStatCode] = FccGlobalConstant.BANK_NOT_PROCESSED_TNX;
  }
  this.commonService.setFilterPreference(filterPreference);
  this.router.navigate(['productListing'], { queryParams: { dashboardType: dashboardNameVal,
  subProductCode: null, option: 'transactionNotification' } });
}

initializeApprovedProductStatCodeFilter(){
  this.codeData.codeId = FccGlobalConstant.PROD_STAT_CODE_KEY;
  this.codeData.productCode = FccGlobalConstant.PRODUCT_DEFAULT;
  this.codeData.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
  this.codeData.language = localStorage.getItem('language') !== null ? localStorage.getItem('language') : '*';
  this.corporateCommonService.getCodeDataDetails(this.codeData).subscribe(response => {

      response.body.items.forEach(responseValue => {
        this.prodStatCodeSet.add(responseValue.value);
      });

      this.prodStatCodeSet.forEach(val => {
        if(val != FccGlobalConstant.BANK_NOT_PROCESSED_TNX) {
           this.approvedProdStatFilter = this.approvedProdStatFilter.concat(String(val), '|');
        }
      });

    });
}

  getRejections() {
    this.dashboardService.getBankApprovals('', FccGlobalConstant.N005_REJECTED, false, this.dashboardType).subscribe(
      data => {
        if (data.status === FccGlobalConstant.LENGTH_200) {
          this.response = data.body;
          this.recordAvailable = true;
          this.businessAreaList = this.response.products.split(',');
          this.getTransactions(this.dashboardType);
          this.inputParams[FccGlobalConstant.DRILL_DOWN_ENABLED] = true;
          this.inputParams[FccGlobalConstant.SHOW_FILTER_SECTION] = false;
          this.inputParams.chartTableData = true;
          this.getData();
          // Dropdown Data formation
          if (this.bankApprovalsAndRejectionsService.productsList
            && this.bankApprovalsAndRejectionsService.productsList.length > 0) {
            this.bankApprovalsAndRejectionsService.productsList.forEach((productCode) => {
              this.filterOption.push({
                label: this.translateService.instant(productCode),
                value: {
                  productCode: productCode,
                  name: this.translateService.instant(productCode)
                }
              });
            });
          }
        }
      });
  }

selectData(e: any) {
    const productCode = this.productCodes[e.element._index];
    const legend = e.element._chart.config.data.labels[e.element._index];
    this.selectedLegend = legend.substring(0, legend.indexOf(':'));

    this.selectedProduct = [{
      productCode: productCode,
      name: this.translateService.instant(productCode)
    }];
    this.onClickProduct();
  }

underscoreToCamelcase(name: string) {
  return name.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}
getMetaData() {
  this.listService.getMetaData(this.listdefName.split(',')[0], FccGlobalConstant.EMPTY_STRING, FccGlobalConstant.EMPTY_STRING)
    .subscribe(response => {
      this.getColumns(response);
      // this.metadata = response;
      this.inputParams.metadata = response;
      // this.inputParams.listdefName = this.listdefName;
      this.inputParams[FccGlobalConstant.DRILL_DOWN_ENABLED] = true;
      this.inputParams[FccGlobalConstant.SHOW_FILTER_SECTION] = false;
      this.inputParams.metadata.Column.map(ele=>{
        ele.name = (ele.name.indexOf('_') > -1) ? this.underscoreToCamelcase(ele.name) : ele.name;
      });
      this.inputParams.chartTableData = true;
      this.recordAvailable = true;
    });
}

getColumns(data: any) {
  if (data.Column) {
    data.Column.forEach(element => {
      element.isColumnSortDisabled = true;
      if (element.width && element.width.indexOf(FccGlobalConstant.PERCENT) > -1) {
        element.width = element.width.replace(FccGlobalConstant.PERCENT, FccGlobalConstant.EM);
      }
      const formattedName = (element.name.indexOf('_') > -1) ? this.underscoreToCamelcase(element.name) : element.name;
      if (formattedName === 'entity' && this.isEntityUser) {
        element.hidden = false;
      } else if (formattedName === 'entity' && !this.isEntityUser){
        element.hidden = true;
      }
      if (this.billReferenceEnabled ){
        if (formattedName === 'impBillRefId') {
          element.hidden = false;
        } else if (formattedName === 'boTnxId') {
          element.hidden = true;
        }
      }else if (!this.billReferenceEnabled ){
        if (formattedName === 'impBillRefId') {
          element.hidden = true;
        } else if (formattedName === 'boTnxId') {
          element.hidden = false;
        }
      }
    });
  }
}

}
