import { Component, OnInit, Input } from '@angular/core';
import { HideShowDeleteWidgetsService } from './../../../../common/services/hide-show-delete-widgets.service';
import { CommonService } from './../../../../common/services/common.service';
import { GlobalDashboardComponent } from './../../../../common/components/global-dashboard/global-dashboard.component';
import { OutstandingBalanceService } from './../../../../common/services/outstanding-balance.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import * as Chart from 'chart.js';
import { CustomCommasInCurrenciesPipe } from './../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FccGlobalConstant } from './../../../../common/core/fcc-global-constants';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { UtilityService } from '../../../../corporate/trade/lc/initiation/services/utility.service';
import { StaticTranslateLoader } from '../../../../common/core/StaticTranslateLoader';
import { CurrencyConverterPipe } from '../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';

@Component({
  selector: 'app-daily-auth-limit',
  templateUrl: './daily-auth-limit.component.html',
  styleUrls: ['./daily-auth-limit.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class DailyAuthLimitComponent implements OnInit {

  hideShowCard;
  checkCustomise;
  contextPath: any;
  classCheck;
  chartDataDoughnut: any;
  doughnutChartCenterText: any;
  dailyAuthLimit = 'dailyAuthLimit';
  dailyAvailableAmt = 'dailyAvailableAmt';
  dailyUtilisedAmt = 'dailyUtilisedAmt';
  doughnutChart = this.outstandingBalanceService.doughnutChart;
  currentDate = this.utilityService.transformDateFormat(new Date());
  langDir: string = localStorage.getItem('langDir');
  totalAmt: any;
  NoTotalAmt: any;
  totalAmtNumber: any;
  totalAmtDecimal: any;
  utilised: any;
  utilisedAmtNumber: any;
  utilisedAmtDecimal: any;
  available: any;
  availableAmtNumber: any;
  availableAmtDecimal: any;
  baseCurrencyUserLimitCurrency: any;
  length2 = FccGlobalConstant.LENGTH_2;
  length999 = FccGlobalConstant.LENGTH_999;
  length1000 = FccGlobalConstant.LENGTH_1000;
  length999999 = FccGlobalConstant.LENGTH_999999;
  length1000000 = FccGlobalConstant.LENGTH_1000000;
  length999999999 = FccGlobalConstant.LENGTH_999999999;
  length1000000000 = FccGlobalConstant.LENGTH_1000000000;
  length999999999999 = FccGlobalConstant.LENGTH_999999999999;
  length1000000000000 = FccGlobalConstant.LENGTH_1000000000000;
  length999999999999999 = FccGlobalConstant.LENGTH_999999999999999;
  text1Height = 2.1;
  text2Height = 1.7;

  font1: any = '700 1.5em Roboto';
  fillStyle1: any = '#676763';
  textBaseline1: any = 'middle';

  font2: any = '700 2em Roboto';
  fillStyle2: any = '#707070';
  textBaseline2: any = 'middle';
  content2: any;
  showHeaderToolTip: any;

  limitDoughnutChartOptions: any = {
    tooltips: {
      bodyFontFamily: FccGlobalConstant.CHART_FONT_FAMILY,
      bodyFontSize: 10,
      callbacks: {
        label() {
          return `${StaticTranslateLoader.translation.instant('consolidatedAmt')}`;
        },
        afterLabel(tooltipItem, data) {
          const tooltipValue =
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${data.labels[tooltipItem.index]}: ${tooltipValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
      }
    },
    legend: {
      display: false,
      position: 'right',
      onClick: e => e.stopPropagation(),
      labels: {
        fontColor: '#777777'
      }
    },
    layout: {
      padding: {
        top: 30,
        bottom: 20
      }
    },
    cutoutPercentage: 85,
    labels: {
      position: '#777777'
    },
    plugins: {
      centerText: true,
      datalabels: {
        display: false,
        anchor: 'end',
        align: 'end',
        color: '#777777',
        formatter(value) {
          return parseInt(value, 10).toLocaleString();
        },
        font: {
          weight: 500,
          family: 'Roboto',
          size: 12
        }
      }
    }
  };

  nudges: any;
  deepLinking: any;
  @Input() widgetDetails: any;
  nudgesRequired: any;
  widgetConfigData: any;
  currencySymbolDisplayEnabled = false;

  constructor(protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected commonService: CommonService,
    protected globalDashboardComponent: GlobalDashboardComponent,
    protected outstandingBalanceService: OutstandingBalanceService,
    protected translateService: TranslateService,
    protected datePipe: DatePipe,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected utilityService: UtilityService,
    protected currencyConverterPipe: CurrencyConverterPipe) { }

  ngOnInit() {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P809).subscribe(
      (response) => {
        if (this.commonService.isNonEmptyValue(response) &&
          this.commonService.isNonEmptyValue(response.paramDataList) && response.paramDataList[0]) {
          this.currencySymbolDisplayEnabled = response.paramDataList[0][FccGlobalConstant.DATA_1] === 'y';
        }
      });
    this.contextPath = this.commonService.getContextPath();
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
    this.getData();
  }

  getData() {
    const labelArray: string[] = [];
    const dataArray1: string[] = [];
    const firstSetColor: any[] = [];
    const hoverFirstSetColor: any[] = [];
    const legendNamePie = `${this.translateService.instant(this.dailyAuthLimit)} ${this.translateService.instant(this.doughnutChart)}`;

    this.commonService.userAuthorizationDetails().subscribe(response => {
      if (response) {
        response.authorization.authorizationItems.forEach(element => {
          this.totalAmt = element.baseCurrencyUserLimitAmount;
          if (this.totalAmt !== undefined && this.totalAmt !== null && this.totalAmt !== '') {
            this.baseCurrencyUserLimitCurrency = element.baseCurrencyUserLimitCurrency;
            this.totalAmtNumber = this.realAmount(this.currencySymbolDisplayEnabled,
              this.totalAmt, this.baseCurrencyUserLimitCurrency);
            this.totalAmtDecimal = this.getDecimalValues(this.totalAmt);

            this.utilised = element.totalBaseCurrencyUtilizedLimitAmount;
            this.utilisedAmtNumber = this.realAmount(this.currencySymbolDisplayEnabled,
              this.utilised, this.baseCurrencyUserLimitCurrency);
            this.utilisedAmtDecimal = this.getDecimalValues(this.utilised);

            this.available = (element.baseCurrencyUserLimitAmount - element.totalBaseCurrencyUtilizedLimitAmount)
            .toFixed(2);
            this.availableAmtNumber = this.realAmount(this.currencySymbolDisplayEnabled,
              this.available, this.baseCurrencyUserLimitCurrency);
            this.availableAmtDecimal = this.getDecimalValues(this.available);

            if (this.available > 0) {
              labelArray.push(`${this.translateService.instant(this.dailyAvailableAmt)}`);
              if (this.availableAmtDecimal === '00') {
                dataArray1.push(this.available);
              } else {
                dataArray1.push(this.available.toString());
              }
              firstSetColor.push('#694ED6');
              hoverFirstSetColor.push('#493694');
            }

            if (this.utilised > 0) {
              labelArray.push(`${this.translateService.instant(this.dailyUtilisedAmt)}`);
              dataArray1.push(element.totalBaseCurrencyUtilizedLimitAmount);
              firstSetColor.push('#B4A6EA');
              hoverFirstSetColor.push('#8F7BE1');
            }

            this.content2 = this.formatLongNumber(this.totalAmt);
            this.showHeaderToolTip = `${this.translateService.instant('DAILY_AUTH_LIMIT_INFO', { amount: this.content2 })}`;
          } else {
            this.NoTotalAmt = -1;
          }
        });

        const font1 = this.font1;
        const fillStyle1 = this.fillStyle1;
        const textBaseline1 = this.textBaseline1;
        const content1 = this.translateService.instant('dailyTotalAmt');

        const font2 = this.font2;
        const fillStyle2 = this.fillStyle2;
        const textBaseline2 = this.textBaseline2;
        const dailyLimitAmt = this.content2;

        const langDirection = this.langDir;
        const length2Const = this.length2;
        const text1YHeight = this.text1Height;
        const text2YHeight = this.text2Height;

        Chart.pluginService.register({
          id: 'limitCenterText',
          beforeDraw(chart) {
            chart.clear();
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;

            let text1X = 0;
            let text2X = 0;

            ctx.font = font1;
            ctx.fillStyle = fillStyle1;
            ctx.textBaseline = textBaseline1;

            if (langDirection === 'rtl') {
              text1X = Math.round((width + ctx.measureText(content1).width) / length2Const);
            } else {
              text1X = Math.round((width - ctx.measureText(content1).width) / length2Const);
            }

            const text1Y = height / text1YHeight;
            ctx.fillText(content1, text1X, text1Y);

            ctx.font = font2;
            ctx.fillStyle = fillStyle2;
            ctx.textBaseline = textBaseline2;

            if (langDirection === 'rtl') {
              text2X = Math.round((width + ctx.measureText(dailyLimitAmt).width) / length2Const);
            } else {
              text2X = Math.round((width - ctx.measureText(dailyLimitAmt).width) / length2Const);
            }

            const text2Y = height / text2YHeight;
            ctx.fillText(dailyLimitAmt, text2X, text2Y);
          }
        });

        this.chartDataDoughnut =
          this.outstandingBalanceService.getChartDataDoughnut(labelArray, dataArray1, legendNamePie,
            firstSetColor, firstSetColor, hoverFirstSetColor, hoverFirstSetColor);

        let counter = true;
          if(counter){
            if(this.currencySymbolDisplayEnabled){
              this.availableAmtNumber =this.availableAmtNumber.slice(0,2).concat(this.currencyConverterPipe.transform(this.available,
                this.baseCurrencyUserLimitCurrency).slice(0, -2));
              this.utilisedAmtNumber = this.utilisedAmtNumber.slice(0,2).concat(this.currencyConverterPipe.transform(
                this.utilisedAmtNumber.slice(1).trim(),this.baseCurrencyUserLimitCurrency).slice(0, -2));
              this.totalAmtNumber = this.totalAmtNumber.slice(0,2).concat(this.currencyConverterPipe.transform(
                this.totalAmtNumber.slice(1).trim(),this.baseCurrencyUserLimitCurrency).slice(0, -2));
            }else{
              this.availableAmtNumber = this.currencyConverterPipe.transform(this.available,
                this.baseCurrencyUserLimitCurrency).slice(0, -2);
              this.utilisedAmtNumber = this.currencyConverterPipe.transform(this.utilisedAmtNumber,
                this.baseCurrencyUserLimitCurrency).slice(0, -2);
              this.totalAmtNumber = this.commonService.removeAmountFormatting(this.totalAmtNumber);
              this.totalAmtNumber = this.currencyConverterPipe.transform(this.totalAmtNumber,
                this.baseCurrencyUserLimitCurrency).slice(0, -2);
            }
            counter = false;
          }
      }
    });

  }

  getWholeAvailableAmt(available, availableAmtDecimal) {
    if (availableAmtDecimal === '00') {
      return available + '.' + availableAmtDecimal;
    }
  }

  getDecimalValues(amtInFormat) {
    /* if (language === 'fr') {
      if (amtInFormat.indexOf(',') > -1) {
        return amtInFormat.split(',')[1];
      }
    } else if (language === 'ar') {
      if (amtInFormat.indexOf('٫') > -1) {
        return amtInFormat.split('٫')[1];
      }
    } else { */
      if (amtInFormat.indexOf('.') > -1) {
        return amtInFormat.split('.')[1];
      }
    //}
  }

  realAmount(currencySymbolDisplayEnabled: any, totalAmtInFormat: any,
    baseCurrencyUserLimitCurrency: any) {
    let totalAmtNumber: any;
    if (currencySymbolDisplayEnabled) {
      totalAmtNumber = this.commonService.getCurrencySymbol(baseCurrencyUserLimitCurrency,
        totalAmtInFormat.split('.')[0]) + '.';
    } else {
      totalAmtNumber = totalAmtInFormat.split('.')[0] + '.';
    }
    return totalAmtNumber;
  }
  deleteCards() {
    this.hideShowDeleteWidgetsService.dailyAuthLimitCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.dailyAuthLimitCardHideShow.subscribe(
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

  formatLongNumber(value) {
    let finalValue = 0;
    value = Math.round(value);
    if (value === 0) {
      return 0;
    } else {
      // hundreds
      if (value <= this.length999) {
        return value;
      } else if (value >= this.length1000 && value <= this.length999999) {              // thousands
        finalValue = this.format2Decimal(value / this.length1000);
        return finalValue + 'K';
      } else if (value >= this.length1000000 && value <= this.length999999999) {        // millions
        finalValue = this.format2Decimal(value / this.length1000000);
        return finalValue + 'M';
      } else if (value >= this.length1000000000 && value <= this.length999999999999) {  // billions
        finalValue = this.format2Decimal(value / this.length1000000000);
        return finalValue + 'B';
      } else if (value >= this.length1000000000000 && value <= this.length999999999999999) {  // Trillion
        finalValue = this.format2Decimal(value / this.length1000000000000);
        return finalValue + 'T';
      } else {
        return value;
      }
    }
  }

  format2Decimal(num) {
    const with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return with2Decimals;
  }

}
