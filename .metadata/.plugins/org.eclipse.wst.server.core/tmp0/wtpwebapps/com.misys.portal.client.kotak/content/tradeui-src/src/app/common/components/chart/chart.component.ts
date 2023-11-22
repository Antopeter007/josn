import { Component, OnInit, Input} from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng';
import { CommonService } from './../../../common/services/common.service';
import { IUCommonDataService } from './../../../trade/iu/common/service/iuCommonData.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MaximizedChartComponent } from './../../../common/components/maximized-chart/maximized-chart.component';
import { CommonDataService } from '../../services/common-data.service';
import { Constants } from '../../constants';


@Component({
  selector: 'fcc-common-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  public chartOption;
  public jsonContent;
  imagePath: string;
  public allSameCcy: any[] = [];
  public lineData: any;
  public lineOptions: any;
  public chartData: any[] = [];
  public xAxisData: any[] = [];
  public yAxisData: any[] = [];
  chartReleaseDate: any[] = [];
  eventTnxType: any[] = [];
  eventSubTnxType: any[] = [];
  yAxisLabel: string;
  @Input() refId;
  @Input() productCode;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig,
              public commonDataService: IUCommonDataService, public commonService: CommonService,
              public translate: TranslateService, public dialogService: DialogService , public commonData: CommonDataService) { }

  ngOnInit() {

   this.imagePath = this.commonService.getImagePath();

   this.commonService.getChartData(this.refId, this.productCode).subscribe(data => {
    const pipe = new DatePipe(Constants.LANGUAGE_EN); // Use your own locale
    const currentCurr: any[] = [];
    this.chartData = data.body.responseData;
    this.chartData.forEach((axisdata) => {
      this.xAxisData.push(pipe.transform(axisdata.dateAndTime, 'MMM yy'));
      this.yAxisData.push(axisdata.amount);
      this.chartReleaseDate.push(pipe.transform(axisdata.dateAndTime, 'mediumDate'));
      currentCurr.push(axisdata.currency);
      this.translate.get(this.commonDataService.getTnxTypeCode(axisdata.tnxType)).subscribe(
        (res: string) => {
          this.eventTnxType.push(res);
      });
      if (axisdata.subTnxType && axisdata.subTnxType !== null) {
        this.translate.get(this.commonData.getTnxSubTypeCode(axisdata.subTnxType)).subscribe(
        (res: string) => {
          this.eventSubTnxType.push(res);
      });
      } else {
        this.eventSubTnxType.push('');
      }
    });
    if (this.chartData.length !== 0) {
      this.yAxisLabel = this.chartData[this.chartData.length - 1].currency;
    }
    // tslint:disable-next-line:only-arrow-functions
    this.allSameCcy = currentCurr.filter(function(cur, pos) {
      return currentCurr.indexOf(cur) === pos;
    });
    if (this.allSameCcy.length === 1) {
      this.prepareChartData();
    }
   });

  }

  prepareChartData() {
    let xAxisLabel;
    let tooltipReleaseDate;
    let availableAmt;
    this.translate.get('CHART_XAXIS_DATE_LABEL').subscribe((res: string) => {
      xAxisLabel = res;
    });
    this.translate.get('CHART_TOOLTIP_RELEASE_DATE').subscribe((res: string) => {
      tooltipReleaseDate = res;
    });
    this.translate.get('CHART_TOOLTIP_AVBL_AMT_LABEL').subscribe((res: string) => {
      availableAmt = res;
    });
    const tooltipsDateLabel = this.chartReleaseDate;
    const tooltipsTnxLabel = this.eventTnxType;
    const tooltipsSubTnxLabel = this.eventSubTnxType;
    const tooltipsAmount = this.yAxisData;
    this.lineOptions = {
      tooltips: {
        mode: 'index',
        displayColors: false,
        callbacks: {
            title(tooltipItem, data) {
              let tnxVal;
              let subTnxVal;
              tnxVal = tooltipsTnxLabel[tooltipItem[0].index];
              subTnxVal = tooltipsSubTnxLabel[tooltipItem[0].index];
              return `${tnxVal}  ${subTnxVal}`;
            },
            label(tooltipItem, data) {
              return `${availableAmt} : ${tooltipsAmount[tooltipItem.index]}`;
            },
            afterLabel(tooltipItem, data) {
              return `${tooltipReleaseDate} : ${tooltipsDateLabel[tooltipItem.index]}`;
            }
        }
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: this.yAxisLabel
          },
          ticks: {
            beginAtZero: true
          }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: xAxisLabel
        },
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

    this.lineData = {
    labels: this.xAxisData,
    datasets: [
      {
        data: this.yAxisData,
        fill: 'origin',
        borderWidth: 2,
        type: 'line',
        lineTension: 0,
        backgroundColor: 'rgba(134, 203, 240, 0.7)',
        hoverBackgroundColor: 'rgba(159, 86, 205, 1)',
        borderColor: '#00add6'
      }
    ]
  };
}

showMaximizedChart() {
  if (this.allSameCcy.length === 1) {
   this.dialogService.open(MaximizedChartComponent, {
     data: {
       id: this.lineData,
       options: this.lineOptions
     },
     width: '1000px',
     height: '400px'
   });
 }
}

}
