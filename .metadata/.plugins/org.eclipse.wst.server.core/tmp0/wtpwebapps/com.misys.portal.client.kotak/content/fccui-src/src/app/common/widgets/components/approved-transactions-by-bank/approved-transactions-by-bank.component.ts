import { Component, OnInit, Input } from '@angular/core';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { CommonService } from './../../../services/common.service';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { DashboardService } from '../../../services/dashboard.service';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';
import { SessionValidateService } from './../../../../common/services/session-validate-service';
import { BankApprovalsAndRejectionsService } from './../../../services/bank-approvals-and-rejections.service';
import { FccGlobalConfiguration } from '../../../core/fcc-global-configuration';
import { Router } from '@angular/router';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { MultiBankService } from './../../../../common/services/multi-bank.service';
import { CodeData } from './../../../../common/model/codeData';


@Component({
  selector: 'app-approved-transactions-by-bank',
  templateUrl: './approved-transactions-by-bank.component.html',
  styleUrls: ['./approved-transactions-by-bank.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class ApprovedTransactionsByBankComponent implements OnInit {

  @Input () dashboardName;
  checkCustomise;
  hideShowCard;
  classCheck;
  polarAreaChartData: any;
  approvedTransactions = 'approvedTransactions';
  polarAreaChart = this.bankApprovalsAndRejectionsService.polarArea;
  contextPath: any;
  codeData = new CodeData();
  productCode: string;
  prodStatFilter: string = "";
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
  polarAreaChartOptions = this.bankApprovalsAndRejectionsService.polarAreaChartOptions;
  borderColors = [];
  productCodes = [];
  prodStatCodeSet = new Set();
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
  private readonly ENTITY_SHORT_NAME = 'entityShortName';
  configuredKeysList = 'BANK_APPROVAL_AND_REJECTION_DAYS,BANK_APPROVAL_AND_REJECTION_ROW_COUNT';
  keysNotFoundList: any[] = [];
  viewAllTnxPermission = false;

  @Input() widgetDetails;
  nudges: any;
  constructor(protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected globalDashboardComponent: GlobalDashboardComponent,
              protected commonService: CommonService,
              protected dashboardService: DashboardService,
              protected translateService: TranslateService,
              protected sessionValidation: SessionValidateService,
              protected bankApprovalsAndRejectionsService: BankApprovalsAndRejectionsService,
              protected fccGlobalConfiguration: FccGlobalConfiguration,
              protected router: Router, protected multiBankService: MultiBankService,
              protected corporateCommonService: CommonService) { }

  ngOnInit() {
    const dashBoardURI = this.dashboardName.split('/');
    this.dashboardType = dashBoardURI[dashBoardURI.length - 1].toUpperCase() ;
    this.contextPath = this.commonService.getContextPath();
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response.response && response.response === 'REST_API_SUCCESS') {
          this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
          this.updateValues();
          this.getApprovals();
         }
      });
    } else {
      this.updateValues();
      this.getApprovals();
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
    this.cols = [
      { field: 'referenceId', header: 'REFERENCEID', width: '40%' },
      { field: 'entity', header: 'entity', width: '30%' },
      { field: 'counterparty', header: 'beneficiary' , width: '30%' }
    ];

    if (this.dashboardType === 'LOAN') {
      this.getloanDashboardColumns();
    }

    this.getProdStatFilter();
  }


  checkUserEntities() {
    this.multiBankService.getCustomerBankDetails('LN', '').subscribe(
      res => {
        let isEntityAvailable = false;
        Object.keys(res.items).forEach(item => {
          const itemObj = res.items[item];
          if (itemObj[this.ENTITY_SHORT_NAME]) {
            isEntityAvailable = true;
          }
        });
        if (isEntityAvailable) {
          this.cols = [
            { field: 'referenceId', header: this.translateService.instant('REFERENCEID'), width: '22%' },
            { field: 'boRefId', header: this.translateService.instant('boRefId'), width: '14%' },
            { field: 'entity', header: this.translateService.instant('entity'), width: '11%' },
            { field: 'facility', header: this.translateService.instant('boFacilityName'), width: '20%' },
            { field: 'curCode', header: this.translateService.instant('curCode'), width: '10%' },
            { field: 'tnxAmt', header: this.translateService.instant('tnxAmt'), width: '15%' }
          ];
        } else {
          this.cols = [
            { field: 'referenceId', header: this.translateService.instant('REFERENCEID'), width: '22%' },
            { field: 'boRefId', header: this.translateService.instant('boRefId'), width: '20%' },
            { field: 'facility', header: this.translateService.instant('boFacilityName'), width: '20%' },
            { field: 'curCode', header: this.translateService.instant('curCode'), width: '10%' },
            { field: 'tnxAmt', header: this.translateService.instant('tnxAmt'), width: '20%' }
          ];
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
  }

  getApprovals() {
    this.dashboardService.getBankApprovals(FccGlobalConstant.N004_ACKNOWLEDGED, '', true, this.dashboardType).subscribe(
      data => {
        if (data.status === FccGlobalConstant.LENGTH_200) {
          this.response = data.body;
          this.businessAreaList = this.response.products.split(',');
          this.getTransactions(this.dashboardType);
          this.getData();
        }
      });
  }

  deleteCards() {
    this.hideShowDeleteWidgetsService.approvedTransactionsByBankComponent.next(true);
    this.hideShowDeleteWidgetsService.approvedTransactionsByBankComponent.subscribe(
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

  getGlobalDashboardData() {
    this.approvalsList = this.approvalsList.concat(
      this.bankApprovalsAndRejectionsService.getTransactionsList(this.businessAreaList[0], this.response, true));
    this.approvalsList = this.approvalsList.splice(0, +this.rowCount);
  }

  getTransactions(type: string) {
    BankApprovalsAndRejectionsService.dataAvailable = false;
    if (type === 'GLOBAL') {
        this.approvalsList = [];
        this.dashboard = '';
        this.getGlobalDashboardData();
        this.dataAvailable = BankApprovalsAndRejectionsService.dataAvailable;
        this.count = this.bankApprovalsAndRejectionsService.getTransactionCount(true, '', this.response);
        this.tnxCount = this.count.get('tnxCount');
        this.colors =
        this.count.get('colors');
        this.legendsList = this.count.get('legendsList');
        this.totalCount = this.count.get('totalCount');
        this.borderColors = this.count.get('borderColors');
        this.productCodes = this.count.get('productCodes');
        this.selectedLegend = this.legendsList[0];
        this.getloanDashboardColumns();
      } else {
        this.approvalsList = [];
        this.dashboard = type;
        this.approvalsList = this.bankApprovalsAndRejectionsService.getTransactionsList(type, this.response, false);
        this.approvalsList = this.approvalsList.splice(0, +this.rowCount);
        this.dataAvailable = BankApprovalsAndRejectionsService.dataAvailable;
        this.count = this.bankApprovalsAndRejectionsService.getTransactionCount(false , type, this.response);
        this.tnxCount = this.count.get('tnxCount');
        this.colors = this.count.get('colors');
        this.legendsList = this.count.get('legendsList');
        this.totalCount = this.count.get('totalCount');
        this.borderColors = this.count.get('borderColors');
        this.productCodes = this.count.get('productCodes');
        this.selectedLegend = this.legendsList[0];
        this.getloanDashboardColumns();
       }

  }

onClickViewAllTransactions() {
  const dashBoardURI = this.dashboardName.split('/');
  const dashboardNameVal = dashBoardURI[dashBoardURI.length - 1].toUpperCase();
  this.commonService.setWidgetClicked(dashboardNameVal);
  const filterPreference = {};
  filterPreference[FccGlobalConstant.prodStatCode] = this.prodStatFilter;
  this.commonService.setFilterPreference(filterPreference);
  this.router.navigate(['productListing'], { queryParams: { dashboardType: dashboardNameVal,
  subProductCode: null, option: 'transactionNotification' } });
  }

getProdStatFilter(){
  this.codeData.codeId = FccGlobalConstant.PROD_STAT_CODE_KEY;
  this.codeData.productCode = FccGlobalConstant.PRODUCT_DEFAULT;
  this.codeData.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
  this.codeData.language = localStorage.getItem('language') !== null ? localStorage.getItem('language') : '*';
  this.corporateCommonService.getCodeDataDetails(this.codeData).subscribe(response => {

    response.body.items.forEach(responseValue => {
        this.prodStatCodeSet.add(responseValue.value);
      });
      this.prodStatFilter = "";
      this.prodStatCodeSet.forEach(val => {
        if (val != '01') {
          this.prodStatFilter = this.prodStatFilter.concat(String(val), '|');
        }
      });
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
onClickView(event, rowData, index) {
    const productCode = rowData.referenceId.substring(0, FccGlobalConstant.LENGTH_2);
    this.dojoUrl = '';
    const subProductCode = rowData.subProductCode ? rowData.subProductCode : '';
    this.commonService.getSwiftVersionValue();

    let isAngularURL = this.commonService.isAngularProductUrl(productCode, subProductCode);

    if(productCode === 'SE'
      && this.commonService.isnonEMptyString(subProductCode)
      && subProductCode === 'OTHER') {
        isAngularURL = false;
      }

    if (isAngularURL &&
    (!(this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
      (productCode === FccGlobalConstant.PRODUCT_BG || productCode === FccGlobalConstant.PRODUCT_BR)))
      ) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['view'], {
          queryParams: {
            tnxid: rowData.tnxId,
            referenceid: rowData.referenceId,
            productCode, subProductCode,
            tnxTypeCode:  rowData.tnxTypeCode,
            eventTnxStatCode:  rowData.tnxStatCode,
            mode: FccGlobalConstant.VIEW_MODE,
            subTnxTypeCode: rowData.subTnxTypeCode,
            operation: FccGlobalConstant.PREVIEW
          }
        })
      );
      const popup = window.open('#' + url, '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
      const productId = `${this.translateService.instant(productCode)}`;
      const mainTitle = `${this.translateService.instant('MAIN_TITLE')}`;
      popup.onload = () => {
        popup.document.title = mainTitle + ' - ' + productId;
      };
    } else {
      if (this.contextPath !== null && this.contextPath !== '') {
        this.dojoUrl = this.contextPath;
      }
      const uri = `${this.dojoUrl}${this.fccGlobalConstantService.servletName}/screen/ReportingPopup?option=FULL`;
      const params = `&referenceid=${rowData.referenceId}&tnxid=${rowData.tnxId}&productcode=${productCode}`;
      this.dojoUrl = uri + params;
      this.router.navigate([]).then(() => { window.open(this.dojoUrl, '', 'width=800,height=600,resizable=yes,scrollbars=yes'); });
    }
  }

rowOnHover() {
    this.dispalyIcon = true;
  }

removeHover() {
    this.dispalyIcon = false;
  }

selectData(e: any) {
    const productCode = this.productCodes[e.element._index];
    const legend = e.element._chart.config.data.labels[e.element._index];
    this.selectedLegend = legend.substring(0, legend.indexOf(':'));
    this.getloanDashboardColumns();
    if (this.dashboard === '') {
      this.approvalsList = this.bankApprovalsAndRejectionsService
      .getProductWiseTransactionsList(this.dashboard, this.response, productCode, true);
      this.approvalsList = this.approvalsList.splice(0, +this.rowCount);
    } else {
      this.approvalsList = this.bankApprovalsAndRejectionsService
             .getProductWiseTransactionsList(this.dashboard, this.response, productCode, false);
      this.approvalsList = this.approvalsList.splice(0, +this.rowCount);
    }

  }

  getloanDashboardColumns(){
    if (this.selectedLegend === 'LOAN' || this.dashboardType === 'LOAN' || this.selectedLegend === 'Loan'){
        this.prepareLoanColumns();
    }
    else{
      this.multiBankService.getCustomerBankDetails('*', '').subscribe(
        res => {
          let isEntityAvailable = false;
          Object.keys(res.items).forEach(item => {
            const itemObj = res.items[item];
            if (itemObj[this.ENTITY_SHORT_NAME]) {
              isEntityAvailable = true;
            }
          });
          if (isEntityAvailable) {
            this.cols = [
              { field: 'referenceId', header: 'REFERENCEID', width: '30%' },
              { field: 'boRefId', header: this.translateService.instant('boRefId'), width: '30%' },
              { field: 'entity', header: 'entity', width: '20%' },
              { field: 'counterparty', header: 'beneficiary' , width: '20%' }
            ];
          } else {
          this.cols = [
            { field: 'referenceId', header: 'REFERENCEID', width: '40%' },
            { field: 'boRefId', header: this.translateService.instant('boRefId'), width: '40%' },
            { field: 'counterparty', header: 'beneficiary' , width: '30%' }
          ];
      }});
    }
  }


private prepareLoanColumns() {
  this.checkUserEntities();
}

}
