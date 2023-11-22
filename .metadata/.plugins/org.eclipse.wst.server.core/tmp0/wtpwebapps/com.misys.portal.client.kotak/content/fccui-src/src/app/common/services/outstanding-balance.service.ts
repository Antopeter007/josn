import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService } from '../../common/services/dashboard.service';
import { FccGlobalConstantService } from '../../common/core/fcc-global-constant.service';
import { SessionValidateService } from '../../common/services/session-validate-service';
import 'chartjs-plugin-datalabels';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { StaticTranslateLoader } from '../core/StaticTranslateLoader';

@Injectable({
  providedIn: 'root'
})
export class OutstandingBalanceService {
  product = this.translateService.instant('product');
  currency = this.translateService.instant('currency');
  amount = this.translateService.instant('amount');
  logarithmic = 'logarithmic';
  doughnutChart = 'doughnutChart';
  barChart = 'barChart';
  logarithmicChart = 'logarithmicChart';
  gridView = 'gridView';
  notAvailable = 'notAvailable';

  doghnutChartOptions: any = {
    tooltips: {
      bodyFontFamily: FccGlobalConstant.CHART_FONT_FAMILY,
      callbacks: {
        label(tooltipItem, data) {
          return `${StaticTranslateLoader.translation.instant('consolidatedAmtFor')} ${data.labels[tooltipItem.index]}`;
        }
      }
    },
    legend: {
      display: true,
      position: 'right',
      onClick: e => e.stopPropagation(),
      labels: {
        fontColor: '#777777',
        fontFamily: FccGlobalConstant.CHART_FONT_FAMILY,
      }
    },
    layout: {
      padding: {
        top: 50,
        bottom: 50
      }
    },
    labels: {
      position: '#777777'
     },
    plugins: {
      limitCenterText: false,
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
          family: FccGlobalConstant.CHART_FONT_FAMILY,
          size: 12
        },
        padding: {
          right: 50,
          left: 60
        }
      }
    }
  };

  doughnutChartOptions: any = {
    tooltips: {
      bodyFontFamily: FccGlobalConstant.CHART_FONT_FAMILY,
      callbacks: {
        label(tooltipItem, data) {
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
        fontColor: '#777777',
        fontFamily: FccGlobalConstant.CHART_FONT_FAMILY
      }
    },
    layout: {
      padding: {
        top: 50,
        bottom: 50
      }
    },
    cutoutPercentage: 85,
    labels: {
      position: '#777777',
      fontFamily: FccGlobalConstant.CHART_FONT_FAMILY
    },
    plugins: {
      limitCenterText: false,
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
          family: FccGlobalConstant.CHART_FONT_FAMILY,
          size: 12
        }
      }
    }
  };
  barChartOptions: any = {
    tooltips: {
      titleFontFamily: FccGlobalConstant.CHART_FONT_FAMILY,
      bodyFontFamily: FccGlobalConstant.CHART_FONT_FAMILY,
      callbacks: {
        label(tooltipItem, data) {
          const tooltipValue =
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${StaticTranslateLoader.translation.instant('consolidatedAmtStands')} ${parseInt(tooltipValue, 10).toLocaleString()}`;
        }
      }
    },
    layout: {
      padding: {
        right: 100
      }
    },
    legend: {
      display: false,
      position: 'top',
      onClick: e => e.stopPropagation(),
      labels: {
        fontColor: '#777777'
      }
    },
    scales: {
      xAxes: [
        {
          display: false,
          stacked: false,
          gridLines: {
            display: false
          },
          ticks: {
            beginAtZero: true
          }
        }
      ],
      yAxes: [
        {
          display: true,
          barThickness: '22',
          stacked: true,
          ticks: {
            fontSize: 12,
            fontFamily: FccGlobalConstant.CHART_FONT_FAMILY,
            fontColor: '#777777',
            fontWeight: '500' },
          scaleLabel: {
            display: false
          },
          gridLines: {
            display: false
          }
        }
      ]
    },
    plugins: {
      limitCenterText: false,
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'end',
        formatter(data, dataObj) {
          if (dataObj && dataObj.dataset && dataObj.dataset.dataValue && dataObj.dataset.dataValue.length > 0) {
            return dataObj.dataset.dataValue[dataObj.dataIndex];
          } else {
            return parseInt(data, 10).toLocaleString();
          }
        },
        color: '#777777',
        font: {
          weight: 500,
          family: FccGlobalConstant.CHART_FONT_FAMILY,
          size: 12
        }
      }
    }
  };
  logarithmicChartOptions: any = {
    tooltips: {
      titleFontFamily: FccGlobalConstant.CHART_FONT_FAMILY,
      bodyFontFamily: FccGlobalConstant.CHART_FONT_FAMILY,
      callbacks: {
        label(tooltipItem, data) {
          const tooltipValue =
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${StaticTranslateLoader.translation.instant('consolidatedAmtStands')} ${parseInt(tooltipValue, 10).toLocaleString()}`;
        }
      }
    },
    legend: {
      display: false,
      position: 'top',
      onClick: e => e.stopPropagation(),
      labels: {
        fontColor: '#777777'
      }
    },
    scales: {
      xAxes: [
        {
          type: 'logarithmic',
          display: false,
          stacked: false,
          gridLines: {
            display: false
          },
          ticks: {
            min: 1
          }
        }
      ],
      yAxes: [
        {
          display: true,
          barThickness: '22',
          stacked: true,
          ticks: {
            fontSize: 12,
            fontFamily: FccGlobalConstant.CHART_FONT_FAMILY,
            fontColor: '#777777',
            fontWeight: '500'
          },
          scaleLabel: {
            display: false
          },
          gridLines: {
            display: false
          }
        }
      ]
    },
    plugins: {
      limitCenterText: false,
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'start',
        color: '#FFFFFF',
        formatter(data, dataObj) {
          if (dataObj && dataObj.dataset && dataObj.dataset.dataValue && dataObj.dataset.dataValue.length > 0) {
            return dataObj.dataset.dataValue[dataObj.dataIndex];
          } else {
            return parseInt(data, 10).toLocaleString();
          }
        },
        font: {
          weight: 500,
          family: FccGlobalConstant.CHART_FONT_FAMILY,
          size: 12
        }
      }
    }
  };

  cols = [
    { field: 'product', header: this.product },
    { field: 'currency', header: this.currency },
    { field: 'totalAmount', header: this.amount }
  ];

  constructor(
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected dashboardService: DashboardService,
    protected translateService: TranslateService,
    protected sessionValidation: SessionValidateService
  ) {}

  arrangeData(dataArray: any[], productArray: any[], currencyCode: string) {
    const arrangedDataArray: any[] = [];
    if (productArray && productArray.length > 0) {
      productArray.forEach(product => {
        if (dataArray && dataArray.length > 0) {
          dataArray.forEach(value => {
            if (value.product === product && Number(value.amount) !== 0) {
              let temp = Number(value.amount.replace(/[^0-9.-]+/g,""));
              temp = Math.floor(temp/100);
              if(value.product === product&& temp !== 0){
              const productName: string = this.translateService.instant(
                product
              );
              const totalAmount: number = value.amount;
              arrangedDataArray.push({
                product: productName,
                currency: currencyCode,
                totalAmount: totalAmount
              });
            }
          
          }});
        }
      });
    }
    return arrangedDataArray;
  }

  sortData(dataArray: any[]) {
    if (dataArray && dataArray.length > 0) {
      return dataArray.sort((a, b) =>
      //eslint-disable-next-line no-useless-escape
      parseFloat(a.totalAmount.replace(/[^0-9\.]+/g, '')) < parseFloat(b.totalAmount.replace(/[^0-9\.]+/g, '')) ? 1 : -1
      );
    }
  }

  getCurrencyList() {
    const currencyList: any[] = [];
    this.dashboardService
      .getAccountBalance('', '')
      .subscribe(data => {
        if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else if (data.response && data.response === 'REST_API_SUCCESS') {
          currencyList.push({
            label: data.totalAccountBalanceOnBaseCurrency.currencyCode,
            value: data.totalAccountBalanceOnBaseCurrency.currencyCode
          });
          if (data.totalAccountBalanceBasedOnCurrency.length > 0) {
            data.totalAccountBalanceBasedOnCurrency.forEach(value => {
              let addCurrency = true;
              for (let i = 0; i < currencyList.length; i++) {
                if (currencyList[i].label === value.currencyCode) {
                  addCurrency = false;
                  {
                    break;
                  }
                }
              }
              if (addCurrency === true) {
                currencyList.push({
                  label: value.currencyCode,
                  value: value.currencyCode
                });
              }
            });
          }
        }
      });
    return currencyList;
  }

  getChartData(
    labels: string[],
    firstDataSet: string[],
    firstLegend: string,
    firstSetBackgroundColor: string[],
    firstSetBorderColor: string[],
    secondDataSet: string[],
    secondLegend: string,
    secondSetBackgroundColor: string[],
    secondSetBorderColor: string[],
    firstDataValue: string[]
  ) {
    let jsonString: string =
      '{' +
      FccGlobalConstant.LABELS +
      JSON.stringify(labels) +
      ',' +
      FccGlobalConstant.DATASET +
      '{' +
      '"label": "' +
      firstLegend +
      '",' +
      '"backgroundColor": ' +
      JSON.stringify(firstSetBackgroundColor) +
      ',' +
      '"borderColor": ' +
      JSON.stringify(firstSetBorderColor) +
      ',' +
      '"data": ' +
      JSON.stringify(firstDataSet);
      if (firstDataValue && firstDataValue.length !== 0) {
        jsonString =
        jsonString + ',' +
        '"dataValue": ' +
        JSON.stringify(firstDataValue) +
        '}';
      } else {
        jsonString = jsonString + '}';
      }
    if (secondDataSet.length !== 0) {
      jsonString =
        jsonString +
        ',' +
        '{' +
        '"label": "' +
        secondLegend +
        '",' +
        '"backgroundColor": ' +
        JSON.stringify(secondSetBackgroundColor) +
        ',' +
        '"borderColor": ' +
        JSON.stringify(secondSetBorderColor) +
        ',' +
        '"data": ' +
        JSON.stringify(secondDataSet) +
        '}';
    }
    jsonString = jsonString + ']}';
    const chartData = JSON.parse(jsonString);
    return chartData;
  }

  getChartDataPie(
    labels: string[],
    data: string[],
    legend: string,
    backgroundColorPie: string[],
    borderColorPie: string[]
  ) {
    const jsonString: string =
      '{' +
      FccGlobalConstant.LABELS +
      JSON.stringify(labels) +
      ',' +
      FccGlobalConstant.DATASET +
      '{' +
      '"label": "' +
      legend +
      '",' +
      '"backgroundColor": ' +
      JSON.stringify(backgroundColorPie) +
      ',' +
      '"borderColor": ' +
      JSON.stringify(borderColorPie) +
      ',' +
      '"data": ' +
      JSON.stringify(data) +
      '}]}';
    const chartData = JSON.parse(jsonString);
    return chartData;
  }

  getChartDataDoughnut(
    labels: string[],
    data: string[],
    legend: string,
    backgroundColorDoughnut: string[],
    borderColorDoughnut: string[],
    hoverBackgroundColorDoughnut: string[],
    hoverBorderColorDoughnut: string[]
  ) {
    const jsonString: string =
      '{' +
      FccGlobalConstant.LABELS +
      JSON.stringify(labels) +
      ',' +
      FccGlobalConstant.DATASET +
      '{' +
      '"label": "' +
      legend +
      '",' +
      '"backgroundColor": ' +
      JSON.stringify(backgroundColorDoughnut) +
      ',' +
      '"borderColor": ' +
      JSON.stringify(borderColorDoughnut) +
      ',' +
      '"hoverBackgroundColor": ' +
      JSON.stringify(hoverBackgroundColorDoughnut) +
      ',' +
      '"hoverBorderColor": ' +
      JSON.stringify(hoverBorderColorDoughnut) +
      ',' +
      '"data": ' +
      JSON.stringify(data) +
      '}]}';
    const chartData = JSON.parse(jsonString);
    return chartData;
  }

}
