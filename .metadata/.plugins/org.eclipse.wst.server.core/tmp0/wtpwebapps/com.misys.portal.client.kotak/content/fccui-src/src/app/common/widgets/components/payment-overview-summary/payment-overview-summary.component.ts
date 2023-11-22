import { Component, Input, OnInit } from '@angular/core';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../common/services/common.service';
import { ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { FccGlobalConstantService } from '../../../core/fcc-global-constant.service';
import { ListDefService } from '../../../../common/services/listdef.service';
import { TranslateService } from '@ngx-translate/core';
import { FccConstants } from '../../../../common/core/fcc-constants';
import { ListDataDownloadService } from '../../../../common/services/list-data-download.service';
import { CurrencyConverterPipe } from '../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';

@Component({
  selector: 'app-payment-overview-summary',
  templateUrl: './payment-overview-summary.component.html',
  styleUrls: ['./payment-overview-summary.component.scss']
})
export class PaymentOverviewSummaryComponent implements OnInit {

  @Input() widgetDetails: any;
  tabName: string;
  multipleTabEnable = false;
  packagesList = [];
  packageDetailsList = [];

  allowedDownloadOptions: any;
  downloadOptions: any;
  maxColumnForPDFModePortrait: any;
  dateFormatForExcelDownload: any;
  listDataDownloadLimit: any;
  selectedDownloadOption:any;
  listDownload = this.translate.instant('listDownload');
  allowedSubOptionsDownload = [FccConstants.CURRENT_DOWNLOAD, FccConstants.FULL_DOWNLOAD];
  

  limitDoughnutChartOptions: any = {
    tooltips: {
      bodyFontFamily: FccGlobalConstant.CHART_FONT_FAMILY,
      bodyFontSize: 10,
      callbacks: {

        afterLabel(tooltipItem, data) {
          const tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${tooltipValue}`;
        },

        label(tooltipItem, data) {
          return `${data.labels[tooltipItem.index].name}- ${data.labels[tooltipItem.index].discount}`;
        },

      }
    },
    legend: {
      display: false,
    },
    cutoutPercentage: 78,
    plugins: {
      limitCenterText: false,
      datalabels: {
        display: false,
      }
    },
  };


  doughnutChartLabels: Label[] = [];

  doughnutChartData = [];

  colors = [];

  backgroundColor = [];

  doughnutChartType: ChartType = 'doughnut';

  showPackageDetails: any;

  contextPath: any;

  dir: string;

  listdefName = 'payments/listdef/paymentsOverviewSummaryWidget';

  metadata;

  defaultSortOrder: number;

  defaultSortField: string;

  numRows: number;

  summaryWidgetDataList: any[] = [];

  defaultRow: number;

  totalConsolidatedPackageAmount: any;

  liquidationDateDuration: any = 'TODAY';

  isMaker: boolean;

  constructor(
    protected listDataDownloadService: ListDataDownloadService,
    protected translate: TranslateService,
    protected commonService: CommonService, 
    protected router: Router, 
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected listService: ListDefService,
    protected currencyConverterPipe: CurrencyConverterPipe) { }

  ngOnInit(): void {

    this.loadConfiguration();
    this.setHeader();

    this.contextPath = this.fccGlobalConstantService.contextPath;

    this.dir = localStorage.getItem('langDir');

    this.getPaymentOverviewSummary();

    this.isMaker = this.commonService.getUserPermissionFlag(FccGlobalConstant.FCM_SAVE_PAYMENTS_INSTRUMENT);

  }

  setHeader() {
    this.widgetDetails = JSON.parse(this.widgetDetails);
    this.multipleTabEnable = (this.widgetDetails && this.widgetDetails.multipleTabEnable) ? this.widgetDetails.multipleTabEnable : false;
    this.tabName = (this.widgetDetails && this.widgetDetails.tabName && this.commonService.isnonEMptyString(this.widgetDetails.tabName)) ?
      this.widgetDetails.tabName : FccGlobalConstant.EMPTY_STRING;
  }

  navigateByUrl(link) {
    const urlContext = this.commonService.getContextPath();
    const navigateUrl = urlContext + this.commonService.fccGlobalConstantService.servletName
                        + link;
    window.open(navigateUrl, FccGlobalConstant.SELF);
  }

  getPaymentOverviewSummary() {
    this.listService.getMetaData(this.listdefName, FccGlobalConstant.EMPTY_STRING, FccGlobalConstant.EMPTY_STRING)
      .subscribe(response => {
        this.metadata = response;
        this.getRecords();
      });
  }

  getRecords() {
    this.packagesList = [];
    this.colors = [];
    this.backgroundColor = [];
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];

    const filterparams = { liquidationDateDuration: this.liquidationDateDuration, packageName: FccGlobalConstant.EMPTY_STRING };
    const paginatorParams = { first: 0, rows: this.defaultRow, sortOrder: this.defaultSortOrder };
    this.listService.getTableData(this.listdefName, JSON.stringify(filterparams) , JSON.stringify(paginatorParams))
      .subscribe(result => {
        this.summaryWidgetDataList = this.formatResult(result);
        this.totalConsolidatedPackageAmount = this.formatAmountValueWithSymbol(
          Number(this.summaryWidgetDataList[0]?.totalconsolidatedpackageamount).toString());

        for (const key in this.summaryWidgetDataList) {
          this.packagesList.push({ "name": this.summaryWidgetDataList[key].packagename,
                                   "amount": this.formatAmountValueWithSymbol(
                                                Number(this.summaryWidgetDataList[key].packagetotalamount).toString()
                                              ),
                                   "discount": this.summaryWidgetDataList[key].packagediscount + '%',
                                   "color":this.summaryWidgetDataList[key].randomcolorcode,
                                   "clientCode": this.summaryWidgetDataList[key].clientcode,
                                   "clientTotalAmount": this.formatAmountValueWithSymbol(
                                    Number(this.summaryWidgetDataList[key].clienttotalamount).toString())
                                  });
        }

        for (let i = 0; i < this.packagesList.length; i++) {
          this.doughnutChartLabels.push(this.packagesList[i]);
          this.doughnutChartData.push(this.packagesList[i].amount.replace(/\D/g, ""));
          this.backgroundColor.push(this.packagesList[i].color);
        }

        this.colors.push({ 'backgroundColor': this.backgroundColor });

      });
  }

  formatAmountValueWithSymbol(amount: any){
    amount = this.currencyConverterPipe.transform(
      amount.toString(),
      'INR',
      );

    amount = this.commonService.getCurrencyFormatedAmount(
      'INR',
      amount,
      true);
    return amount;
  }

    formatResult(result: any) {
      const data = [];
      const tempTableData = result.rowDetails;
      if (tempTableData) {
        tempTableData.forEach(element => {
          const obj = {};
          element.index.forEach(ele => {
            obj[this.toCamelCase(ele.name)] = this.commonService.decodeHtml(ele.value);
              });
          data.push(obj);
        });
      }
      return data;
    }

    toCamelCase(str: string) {
      return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }

    getPackageDetails(packName){
      this.packageDetailsList = [];
      this.showPackageDetails = 5;
      const filterparams = { liquidationDateDuration: this.liquidationDateDuration, packageName: packName };
      const paginatorParams = { first: 0, rows: this.defaultRow, sortOrder: this.defaultSortOrder };
      this.listService.getTableData(this.listdefName, JSON.stringify(filterparams) , JSON.stringify(paginatorParams))
        .subscribe(result => {
          this.summaryWidgetDataList = this.formatResult(result);
        for (const key in this.summaryWidgetDataList) {
          this.packageDetailsList.push({ "clientCode": this.summaryWidgetDataList[key].clientcode,
                                         "clientTotalAmount":this.formatAmountValueWithSymbol(
                                                                Number(this.summaryWidgetDataList[key].clienttotalamount).toString())
                                                              });
        }
        });
    }

    changeDate() {
      this.getPaymentOverviewSummary();
    }

    loadConfiguration() {
      this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response) {
          this.allowedDownloadOptions = response.listDataDownloadOptions;
          this.downloadOptions = JSON.parse(JSON.stringify(response.listDataDownloadOptions));
          this.dateFormatForExcelDownload = response.listDataExcelDateFormat;
          const index = this.downloadOptions.indexOf(FccConstants.CSV_TYPE);
          if (this.downloadOptions.indexOf(FccConstants.CSV_TYPE) !== -1) {
              this.downloadOptions.splice(index, 1);
          } 
       }
      });
    }

    onClickDownloadOption(downloadOption: any) {
      const headers = ["packageName","packageTotalAmount","packageDiscount","clientDetails"];
      const subHeaders = ["clientCode","clientTotalAmount"];
      this.commonService.getPaymentOverviewDetails(this.liquidationDateDuration)
      .subscribe(result => {
        this.listDataDownloadService.checkPaymentSummaryDataDownloadOption(downloadOption,result.data,headers,subHeaders,
         this.dateFormatForExcelDownload,this.liquidationDateDuration);
           
      });

    
    }

}
