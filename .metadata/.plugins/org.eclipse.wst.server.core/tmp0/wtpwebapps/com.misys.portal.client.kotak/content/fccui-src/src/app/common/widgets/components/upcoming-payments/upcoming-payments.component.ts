import { FccConstants } from './../../../core/fcc-constants';
import { CurrencyConverterPipe } from './../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { FCMPaymentsConstants } from './../../../../corporate/cash/payments/single/model/fcm-payments-constant';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UtilityService } from './../../../../corporate/trade/lc/initiation/services/utility.service';
import { CommonService } from '../../../../common/services/common.service';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';


@Component({
  selector: 'fcc-upcoming-payments',
  templateUrl: './upcoming-payments.component.html',
  styleUrls: ['./upcoming-payments.component.scss']
})

export class UpcomingPaymentsComponent implements OnInit {


  @Input () widgetDetails: any;
  @ViewChild(MatCalendar, { static: false } ) calendar: MatCalendar<Date>;
  params: any = {};
  dir = localStorage.getItem('langDir');
  multipleTabEnable = false;
  tabName: string;
  currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy').split('/');
  selectedDate: Date = new Date(this.currentDate[1] + '/' + this.currentDate[0] + '/' + this.currentDate[2]);
  displayValue: any = this.transformDateFormat(new Date());// To Display the Date above the tables.
  datesToHighlight = [];
  selectedDateList = [];
  selectedRowList =[];
  upcomingTransactionsList = [];
  numOfDays;
  maxAllowedDaysForUpcomingPayment = 90;
  selectedClientPackageDetails = [];
  fromDate: Date;
  toDate: Date;
  selectedDateParam: Date | any;
  upcomingTransactionsSum: any;
  selectedDateTransactionsSum: any;
  count: any;
  currency = FccConstants.FCM_ISO_CODE;
  showSelectedRow = false;
  packageMap = new Map();
  minDate: Date;
  maxDate: Date;
  disableLeftNavigationArrow : any;
  constructor(protected commonService: CommonService, public datePipe: DatePipe, protected utilityService: UtilityService,
    protected currencyConverterPipe: CurrencyConverterPipe) { }

  ngOnInit(): void {
    this.disableLeftNavigationArrow = "true";
    this.setHeader();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.numOfDays = response.fcmUpcomingPaymentsDurationInDays;
        // this.maxAllowedDaysForUpcomingPayment = response.fcmUpcomingPaymentsDurationInDays;
        this.minDate = new Date();
        this.maxDate = this.utilityService.addToDate(this.selectedDate,'day',(this.maxAllowedDaysForUpcomingPayment-1));
        // this.getSelectedDatePaymentsDetails();
        // this.getSelectedDateClientPackageDetails();
        // this.getUpcomingTransactionDetails();
        this.getUpcomingTransactionDetailsNew();

      }
    });
  }

  setHeader() {
    this.widgetDetails = JSON.parse(this.widgetDetails);
    this.multipleTabEnable = (this.widgetDetails && this.widgetDetails.multipleTabEnable) ? this.widgetDetails.multipleTabEnable : false;
    this.tabName = (this.widgetDetails && this.widgetDetails.tabName && this.commonService.isnonEMptyString(this.widgetDetails.tabName)) ?
                    this.widgetDetails.tabName : FccGlobalConstant.EMPTY_STRING;
  }

  handleDateChangeFromCalendar(event) {
    this.displayValue = this.transformDateFormat(this.selectedDate);
    this.selectedDate = event;
    this.disableLeftNavigation('left');
    // this.getSelectedDatePaymentsDetails();
    // this.getSelectedDateClientPackageDetails();
    // this.getUpcomingTransactionDetails();
    this.getUpcomingTransactionDetailsNew();

  }


  handleDateNavigation(amount, arrow){
    this.selectedDate = this.utilityService.addToDate(this.selectedDate,'day',amount);
    this.disableLeftNavigation(arrow);
    this.displayValue = this.transformDateFormat(this.selectedDate);
    // this.getSelectedDatePaymentsDetails();
    // this.getSelectedDateClientPackageDetails();
    // this.getUpcomingTransactionDetails();
    this.getUpcomingTransactionDetailsNew();

  }

  disableLeftNavigation(arrow) {
    const selectedNewDate = this.utilityService.transformDateToSpecificFormat(this.selectedDate, 'DD-MMM-YYYY');
    const currentDate = this.utilityService.transformDateToSpecificFormat(new Date(), 'DD-MMM-YYYY');
    if (arrow == 'left') {
      if (selectedNewDate === currentDate) {
        this.disableLeftNavigationArrow = "true";
      } else {
        this.disableLeftNavigationArrow = "false";
      }
    }
    if (arrow == 'right') {
      this.disableLeftNavigationArrow = false;
    }
  }

  transformDateFormat(date) {
    const dateString = date.toDateString();
    const dateValue = dateString.split(' ');
    return (dateValue[2] + ' ' + dateValue[1] + ' ' + dateValue[3]);
  }

  selectRow(){
    this.showSelectedRow = true;
  }

  getSelectedDatePaymentsDetails() {
    let filterParams: any = {};
    let formattedAmount: any;
    this.selectedDateParam = this.utilityService.transformDateToSpecificFormat(this.selectedDate, 'DD-MMM-YYYY');
    filterParams.selectedDateParam = this.selectedDateParam;
    filterParams = JSON.stringify(filterParams);
    this.selectedDateList = [];
    this.count = 0;
    let totalAmount = 0;
    this.selectedDateTransactionsSum = 0;
    this.commonService.getExternalStaticDataList(FCMPaymentsConstants.FCM_SELECTED_DATE_PAYMENTS, filterParams)
    .subscribe((response) => {
      if(response) {
        response.forEach(element => {
        const amount = element.amount;
        formattedAmount = this.currencyConverterPipe.transform(element.amount.toString(), this.currency);
          this.selectedDateList.push(
            {
              "product" : element.pdtproduct,
              "currency" : this.currency,
              "amount" : formattedAmount
            }
          );
          this.count+= 1;
          totalAmount = totalAmount + amount;
          this.selectedDateTransactionsSum = this.currencyConverterPipe.transform(totalAmount.toString(), this.currency);
        });
      }
    });
  }

  getPackageDetails(product: string){
    this.selectedRowList = [];
    this.selectedRowList = this.packageMap.get(product);
  }

  getSelectedDateClientPackageDetails() {
    let filterParams: any = {};
    filterParams.selectedDateParam = this.selectedDateParam;
    filterParams = JSON.stringify(filterParams);
    let prodRowList;
    this.packageMap.clear();
    this.commonService.getExternalStaticDataList(FCMPaymentsConstants.FCM_SELECTED_DATE_PACKAGES, filterParams)
    .subscribe((response) => {
      if(response) {
        response.forEach(element => {
          const amount = this.currencyConverterPipe.transform(element.amount.toString(), this.currency);
          const prod = element.pdtproduct;
          if(!this.packageMap.has(prod)) {
           prodRowList = [];
          }
         prodRowList.push(
            {
              "client" : element.phdclient,
              "currency" : this.currency,
              "amount" : amount
            }
          );

          this.packageMap.set(prod, prodRowList);

        });
      }
    });
  }

  getUpcomingTransactionDetails() {
    // Set From Date to selected Date + 1, to exclude the selected Date as that is displayed in Selected Date section.
    const fromDate = this.utilityService.addToDate(this.selectedDate, 'day', 1);
    // Set To Date to selected Date + this.numOfDays - 1.
    const toDate = this.utilityService.addToDate(this.selectedDate, 'day', this.numOfDays - 1);

    // Convert to "11-Mar-2022" format to pass to FCM query
    const fromDateInString = this.utilityService.transformDateToSpecificFormat(fromDate, 'DD-MMM-YYYY');
    const toDateInString = this.utilityService.transformDateToSpecificFormat(toDate, 'DD-MMM-YYYY');
    let filterParams: any = {};
      filterParams.fromDate = fromDateInString;
      filterParams.toDate = toDateInString;
      filterParams = JSON.stringify(filterParams);
      this.upcomingTransactionsList = [];
      this.datesToHighlight = [];
      this.upcomingTransactionsSum = 0;
      let totalAmount = 0;
      this.commonService.getExternalStaticDataList(FCMPaymentsConstants.FCM_UPCOMING_PAYMENTS, filterParams)
        .subscribe((response) => {
          if (response) {
            response.forEach(element => {
              const amount = element.amount;
              const formattedAmount = this.currencyConverterPipe.transform(element.amount.toString(), this.currency);
              this.upcomingTransactionsList.push(
                {
                  "date" : this.transformDateFormat(element.pdtactdate),
                  "currency" : this.currency,
                  "amount" : formattedAmount
                }
              );
              totalAmount = totalAmount + amount;
              this.upcomingTransactionsSum = this.currencyConverterPipe.transform(totalAmount.toString(), this.currency);
              this.datesToHighlight.push(element.pdtactdate);
            });
            this.refreshCalendar();
          }
        });

  }

  getUpcomingTransactionDetailsNew() {
    let filterParams: any = {};
    // let formattedAmount: any;
    this.selectedDateParam = this.utilityService.transformDateToSpecificFormat(this.selectedDate, 'DD-MMM-YYYY');
    filterParams.selectedDateParam = this.selectedDateParam;
    filterParams = JSON.stringify(filterParams);
    this.selectedDateList = [];
    this.count = 0;
    // let totalAmount = 0;
    this.selectedDateTransactionsSum = 0;

    // Set From Date to selected Date + 1, to exclude the selected Date as that is displayed in Selected Date section.
    const fromDate = this.utilityService.addToDate(this.selectedDate, 'day', 0);
    // Set To Date to selected Date + this.numOfDays - 1.
    const toDate = this.utilityService.addToDate(this.selectedDate, 'day', this.numOfDays - 1);

    // Convert to "11-Mar-2022" format to pass to FCM query
    const fromDateInString = this.utilityService.transformDateToSpecificFormat(fromDate, 'DD-MMM-YYYY');
    const toDateInString = this.utilityService.transformDateToSpecificFormat(toDate, 'DD-MMM-YYYY');
    this.selectedDateParam = this.utilityService.transformDateToSpecificFormat(this.selectedDate, 'YYYY-MM-DD');

      this.upcomingTransactionsList = [];
      this.datesToHighlight = [];
      this.upcomingTransactionsSum = 0;
      let totalAmount = 0;
      let upcomingTnxTotalAmount = 0;
      let formattedAmount: any;
      let prodRowList = [];
      this.packageMap.clear();
      // this.selectedDateList = [];
      this.commonService.getUpcomingTransactionDetailsNew(fromDateInString, toDateInString)
        .subscribe((response) => {
          if (response) {
            response.data.forEach(element => {
              if (element.clientdebitdate === this.selectedDateParam) {
                const amount = parseInt(element.totalConsolidatedPackageAmount);
                //package
                element.upcomingPackageSummary.forEach(pack => {
                
                formattedAmount = this.currencyConverterPipe.transform(pack.packageTotalAmount.toString(), this.currency);
                this.selectedDateList.push(
                  {
                    "product": pack.packageName,
                    "currency": this.currency,
                    "amount": formattedAmount
                  }
                );
                this.count += 1;
                totalAmount = totalAmount + amount;
                this.selectedDateTransactionsSum = this.currencyConverterPipe.transform(totalAmount.toString(), this.currency);
                  //client
                pack.clientInformation.forEach(client => {

                      const clientAmount = this.currencyConverterPipe.transform(client.clientTotalAmount.toString(), this.currency);
                      const prod = pack.packageName;
                      if(!this.packageMap.has(prod)) {
                       prodRowList = [];
                      }
                     prodRowList.push(
                        {
                          "client" : client.clientCode,
                          "currency" : this.currency,
                          "amount" : clientAmount
                        }
                      );
            
                      this.packageMap.set(prod, prodRowList);
            
                    });


              });
              } else if (new Date(this.selectedDateParam) < new Date(element.clientdebitdate)) {
              const amount = parseInt(element.totalConsolidatedPackageAmount);
              const UpcomingFormattedAmount = this.currencyConverterPipe
                    .transform(element.totalConsolidatedPackageAmount.toString(), this.currency);
              
                    this.upcomingTransactionsList.push(
                {
                  "date" : this.transformDateFormat(new Date(element.clientdebitdate)),
                  "currency" : this.currency,
                  "amount" : UpcomingFormattedAmount
                }
              );
              upcomingTnxTotalAmount = upcomingTnxTotalAmount + amount;

              this.upcomingTransactionsSum = this.currencyConverterPipe.transform(upcomingTnxTotalAmount.toString(), this.currency);
              this.datesToHighlight.push(element.clientdebitdate);
            }
          
            });
            this.refreshCalendar();
          }
        });
  }

  refreshCalendar() {
    this.calendar.updateTodaysDate();
  }

dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
  // Only highligh dates inside the month view.
  let highlightDate = false;
  if (view === 'month') {
    highlightDate = this.datesToHighlight
        .map(strDate => new Date(strDate))
        .some(d => d.getDate() === cellDate.getDate()
        && d.getMonth() === cellDate.getMonth()
        && d.getFullYear() === cellDate.getFullYear());
  }

  return highlightDate ? 'highlight-date-class' : undefined;
};
}
