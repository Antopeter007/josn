import { Component, OnInit } from '@angular/core';
import { FccGlobalConstant } from '../../../core/fcc-global-constants';
import { ListDefService } from '../../../../common/services/listdef.service';
import { CommonService } from '../../../services/common.service';
import { TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-account-summary-graph',
  templateUrl: './account-summary-graph.component.html',
  styleUrls: ['./account-summary-graph.component.scss']
})
export class AccountSummaryGraphComponent implements OnInit {

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
            xAxes: [{
                stacked: true,
                barThickness : FccGlobalConstant.LENGTH_73
            }],
            yAxes: [{
                stacked: true,
                barThickness : FccGlobalConstant.LENGTH_73
            }]
        },
        elements: {
          line: {
              tension: FccGlobalConstant.LENGTH_50,
              intersection: false, // disables bezier curves
              padding: {
                left: FccGlobalConstant.LENGTH_50,
                right: FccGlobalConstant.LENGTH_50
              }
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
          }
        }
  };

  barChartDataKeys;
  barChartType = 'bar';
  barChartLegend = true;
  defaultRow: number;
  metadata;
  defaultSortOrder: number;
  defaultSortField: string;
  listdefName = 'cash/listdef/customer/AB/listWidgetBarGraphAccountSummary';
  asOn = this.translate.instant('asOn');
  weekStarting = this.translate.instant('weekStarting');
  public tabs = [FccGlobalConstant.ONE_AND_SPACE + this.translate.instant('week'),
   FccGlobalConstant.ONE_AND_SPACE + this.translate.instant('month'),
   FccGlobalConstant.SIX_AND_SPACE + this.translate.instant('months'), FccGlobalConstant.ONE_AND_SPACE + this.translate.instant('year')];
  labelName = this.tabs[FccGlobalConstant.LENGTH_0].toLocaleLowerCase();
  public barChartLabels = [];
  chartHeight = FccGlobalConstant.LENGTH_172;
  public barChartData = [
    { data: [], label: this.translate.instant('crAmt'), backgroundColor: '#fdca00', datalabels: {
      display: false }
    },
    { data: [], label: this.translate.instant('drAmt'), backgroundColor: '#5b9bd5', datalabels: {
      display: false }
    },
    { data: [], label: this.translate.instant('totSummary'),
     type: 'line', borderDash: [FccGlobalConstant.LENGTH_10, FccGlobalConstant.LENGTH_5], fill: 'false',
     datalabels: { display: false },
    lineTension: FccGlobalConstant.LENGTH_0,
    borderColor: '#9e480e',
    borderCapStyle: 'butt',
    borderDashOffset: 10.0,
    borderWidth: FccGlobalConstant.LENGTH_2,
    borderJoinStyle: 'miter',
    pointBorderColor: '#9e480e',
    pointBackgroundColor: '#fff'
    }];

    labelTypes = [
      {
        id: FccGlobalConstant.ONE_AND_SPACE + this.translate.instant('week'),
        timeLine: 'weekly',
        label: 'as_on_date',
        text: this.asOn
      },
      {
        id: FccGlobalConstant.ONE_AND_SPACE + this.translate.instant('month'),
        timeLine: 'monthly',
        label: 'week_start_date',
        text: this.weekStarting
      },
      {
        id: FccGlobalConstant.SIX_AND_SPACE + this.translate.instant('months'),
        timeLine: 'halfYearly',
        label: 'month',
        text: ''
      },
      {
        id: FccGlobalConstant.ONE_AND_SPACE + this.translate.instant('year'),
        timeLine: 'yearly',
        label: 'month',
        text: ''
      }];
  constructor(protected listService: ListDefService, protected commonService: CommonService,
              protected translate: TranslateService
    ) {
  }
  ngOnInit() {
    Chart.pluginService.register({
      beforeDraw(chart) {
        chart.clear();
      } });
    this.getAccountSummaryBarGraphData(this.labelName);
  }

  onSelection(event: any): void {
    this.getAccountSummaryBarGraphData(event.tab.textLabel);
  }

  getAccountSummaryBarGraphData(label: string): void{
    this.listService.getMetaData(this.listdefName, FccGlobalConstant.EMPTY_STRING, FccGlobalConstant.EMPTY_STRING)
      .subscribe(response => {
        this.metadata = response;
        this.setDefaultProperties();
        this.buildChartData(label);
      });
  }

  setDefaultProperties(): void {
    this.defaultSortOrder = this.metadata.ListDefDefaultProperties[FccGlobalConstant.LENGTH_0].default_order_type === 'd' ?
     -(FccGlobalConstant.LENGTH_1) : FccGlobalConstant.LENGTH_1;
    this.defaultSortField = this.metadata.ListDefDefaultProperties[FccGlobalConstant.LENGTH_0].default_order;
    this.defaultRow = this.metadata.ListDefDefaultProperties[FccGlobalConstant.LENGTH_0].page;
  }

  buildChartData(timeLabel: string): void {
    const labelKey = timeLabel.toLocaleLowerCase();
    const timeKey = this.labelTypes.find(time => time.id.toLocaleLowerCase() === labelKey);
    this.barChartLabels = [];
    this.barChartData[FccGlobalConstant.LENGTH_0].data = [];
    this.barChartData[FccGlobalConstant.LENGTH_1].data = [];
    this.barChartData[FccGlobalConstant.LENGTH_2].data = [];
    const filterparams = { timeline: timeKey.timeLine };
    const paginatorParams = { first: FccGlobalConstant.LENGTH_0, rows: this.defaultRow, sortOrder: this.defaultSortOrder };
    this.listService.getTableData(this.listdefName, JSON.stringify(filterparams) , JSON.stringify(paginatorParams))
    .subscribe(result => {
      result.rowDetails.filter((e) => {
        const tmpData = e.index;
        // eslint-disable-next-line one-var
        let sumDrAmt , sumCrAmt, totalSum;
        tmpData.map((el) => {
          if (el.name === timeKey.label && (el.value)) { this.barChartLabels.push(timeKey.text + this.commonService.decodeHtml(el.value)); }
          if (el.name === 'cr_amt' && (el.value)) {
            sumCrAmt = Number(el.value);
            this.barChartData[FccGlobalConstant.LENGTH_0].data.push(el.value); }
          if (el.name === 'dr_amt' && (el.value)) {
            sumDrAmt = Number(el.value);
            this.barChartData[FccGlobalConstant.LENGTH_1].data.push(el.value); }
          if (el.name === 'dr_cr' && (el.value)) { this.barChartData[FccGlobalConstant.LENGTH_2].data.push(el.value); }
        });
        if (sumDrAmt && sumCrAmt && this.barChartData[FccGlobalConstant.LENGTH_2]){
          totalSum = sumDrAmt + sumCrAmt;
          this.barChartData[FccGlobalConstant.LENGTH_2].data.push(totalSum);
        }
        if (this.barChartLabels.length === 0) {
          this.barChartData[FccGlobalConstant.LENGTH_0].data = [];
          this.barChartData[FccGlobalConstant.LENGTH_1].data = [];
          this.barChartData[FccGlobalConstant.LENGTH_2].data = [];
       }
       });
      });
  }
}
