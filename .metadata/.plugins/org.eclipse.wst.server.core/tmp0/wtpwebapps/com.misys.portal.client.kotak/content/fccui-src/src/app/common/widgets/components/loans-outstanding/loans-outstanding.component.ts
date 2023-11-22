import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { CommonService } from './../../../services/common.service';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { OutstandingBalanceService } from './../../../services/outstanding-balance.service';
import { SessionValidateService } from '../../../services/session-validate-service';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';
import { GraphColorService } from '../../../services/graph-color.service';

@Component({
  selector: 'fcc-common-loans-outstanding',
  templateUrl: './loans-outstanding.component.html',
  styleUrls: ['../../../chart-balance.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class LoansOutstandingComponent implements OnInit {
  tabIndex: string;

  constructor(protected globalDashboardComponent: GlobalDashboardComponent,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected dashboardService: DashboardService,
              protected translateService: TranslateService,
              protected outstandingBalanceService: OutstandingBalanceService,
              protected sessionValidation: SessionValidateService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected commonService: CommonService,
              protected graphColorService: GraphColorService
  ) {}

  contextPath: any;
  loanAmount: any[] = [];
  currencyList: any[] = [];
  product = this.outstandingBalanceService.product;
  currency = this.outstandingBalanceService.currency;
  amount = this.outstandingBalanceService.amount;
  loansOutstanding = 'loansOutstanding';
  doughnutChart = this.outstandingBalanceService.doughnutChart;
  barChart = this.outstandingBalanceService.barChart;
  logarithmicChart = this.outstandingBalanceService.logarithmicChart;
  gridView = this.outstandingBalanceService.gridView;
  notAvailable = this.outstandingBalanceService.notAvailable;
  logarithmic = this.outstandingBalanceService.logarithmic;
  baseCurrency: string;
  toCurrency: string;
  chartDataPie: any;
  chartDataBar: any;
  chartDataLogarithmic: any;
  loanAmountExists = false;
  showChart = true;
  showPie = false;
  showBar = true;
  showLogarithmic = false;
  checkCustomise;
  hideShowCard;
  doghnutChartOptions = this.outstandingBalanceService.doghnutChartOptions;
  barChartOptions = this.outstandingBalanceService.barChartOptions;
  logarithmicChartOptions = this.outstandingBalanceService.logarithmicChartOptions;
  cols = this.outstandingBalanceService.cols;
  classCheck;
  dir: string = localStorage.getItem('langDir');
  dirClassStyle;
  @Input() widgetDetails: any;
  nudges: any;
  currencySymbolDisplayEnabled = false;
ngOnInit() {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P809).subscribe(
      (response) => {
        if (this.commonService.isNonEmptyValue(response) && this.commonService.isNonEmptyValue(response.paramDataList)
        && response.paramDataList[0]) {
          this.currencySymbolDisplayEnabled = response.paramDataList[0][FccGlobalConstant.DATA_1] === 'y';
        }
      }
    );
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.currencyList = this.outstandingBalanceService.getCurrencyList();
    this.getData();
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
      if (this.checkCustomise) {
        this.tabIndex = '-1';
      }
    });
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
    if (this.dir === 'rtl') {
      this.dirClassStyle = 'header-style-direction';
    } else {
      this.dirClassStyle = 'header-style';
    }
}

getData() {

  this.dashboardService.getOutstandingAmount(this.toCurrency)
    .subscribe(responseData => {
      if (responseData.errorMessage && responseData.errorMessage === 'SESSION_INVALID') {
        this.sessionValidation.IsSessionValid();
      } else if (responseData.response && responseData.response === 'REST_API_SUCCESS') {
        this.baseCurrency = responseData.baseCurrency;
        this.toCurrency = responseData.baseCurrency;
        const loanProductArray: string[] = ['LN'];
        this.loanAmount = this.outstandingBalanceService.arrangeData(responseData.outstandingAmount, loanProductArray, this.toCurrency);
        const labelArray: string[] = [];
        const labelArrayPie: string[] = [];
        const dataArray1: string[] = [];
        const dataArray2: string[] = [];
        const valueWithCurrency: string[] = [];
        const language = localStorage.getItem(FccGlobalConstant.LANGUAGE);
        this.loanAmount.forEach(
          value => {
            labelArrayPie.push(value.product + ':' + ' ' + '(' + value.totalAmount + ')');
            labelArray.push(value.product );
            if(language === 'fr'){
              valueWithCurrency.push(this.currencySymbolDisplayEnabled ?
                this.commonService.getCurrencySymbolForDownloads(value.currency, value.totalAmount) : value.totalAmount);
              dataArray1.push(value.totalAmount.replace(/\s/g, '').replace(/,/g, '.'));
            if (!isNaN(value.acceptedAmount)) {
              dataArray2.push(value.acceptedAmount.replace(/\s/g, '').replace(/,/g, '.'));
            }
            } else if (language === 'ar'){
              valueWithCurrency.push(this.currencySymbolDisplayEnabled ?
                this.commonService.getCurrencySymbolForDownloads(value.currency, value.totalAmount) : value.totalAmount);
              dataArray1.push(value.totalAmount.replace(/٬/g, '').replace(/٫/g, '.'));
              if (!isNaN(value.acceptedAmount)) {
                dataArray2.push(value.acceptedAmount.replace(/٬/g, '').replace(/٫/g, '.'));
              }
            } else{
              valueWithCurrency.push(this.currencySymbolDisplayEnabled ?
                this.commonService.getCurrencySymbolForDownloads(value.currency, value.totalAmount) : value.totalAmount);
              dataArray1.push(value.totalAmount.replace(/,/g, ''));
              if (!isNaN(value.acceptedAmount)) {
                dataArray2.push(value.acceptedAmount.replace(/,/g, ''));
              }
            }
          }
        );
        if (labelArray.length !== 0) {
          this.loanAmountExists = true;
        }

        const legendNamePie = `${this.translateService.instant(this.loansOutstanding)} ${
          this.translateService.instant(this.doughnutChart)}`;

        const legendNameBar = `${this.translateService.instant(this.loansOutstanding)} ${
          this.translateService.instant(this.barChart)}`;

        const legendNameLogarithmic = `${this.translateService.instant(this.loansOutstanding)} ${
          this.translateService.instant(this.logarithmicChart)}`;

        const firstSetColor: any[] = [];
        const secondSetColor: any[] = [];
        const firstSetColorArray = this.graphColorService.firstSetColorArray;
        const secondSetColorArray = this.graphColorService.secondSetColorArray;
        for (let i = 0; i < labelArray.length; i++) {
            firstSetColor.push(firstSetColorArray[i]);
            secondSetColor.push(secondSetColorArray[i]);
          }

        this.chartDataPie =
          this.outstandingBalanceService.getChartDataPie(labelArrayPie, dataArray1, legendNamePie, firstSetColor, firstSetColor);
          this.chartDataBar = this.outstandingBalanceService.getChartData(
            labelArray,
            dataArray1,
            legendNameBar,
            firstSetColor,
            firstSetColor,
            dataArray2,
            legendNameBar,
            secondSetColor,
            secondSetColor,
            valueWithCurrency
          );

          this.chartDataLogarithmic = this.outstandingBalanceService.getChartData(
            labelArray,
            dataArray1,
            legendNameLogarithmic,
            firstSetColor,
            firstSetColor,
            dataArray2,
            legendNameBar,
            secondSetColor,
            secondSetColor,
            valueWithCurrency
          );
      }
    },
    () => {
      //eslint : no-empty-function
    });
}
deleteCards() {
    this.hideShowDeleteWidgetsService.loansOutstandingCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.loansOutstandingCardHideShow.subscribe(res => {
      this.hideShowCard = res;
    });
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
      JSON.parse(this.widgetDetails).widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
 }
}
