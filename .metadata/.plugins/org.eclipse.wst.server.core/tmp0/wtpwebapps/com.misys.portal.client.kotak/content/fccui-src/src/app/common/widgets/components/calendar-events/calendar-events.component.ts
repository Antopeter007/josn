import { LocaleService } from '../../../../base/services/locale.service';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { GlobalDashboardComponent } from '../../../components/global-dashboard/global-dashboard.component';
import { FccGlobalConstantService } from '../../../core/fcc-global-constant.service';
import { DashboardService } from '../../../services/dashboard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Calendarevents } from '../../../model/calendar-events';
import { SessionValidateService } from '../../../services/session-validate-service';
import { CommonService } from '../../../services/common.service';
import { FccGlobalConfiguration } from '../../../core/fcc-global-configuration';
import { UtilityService } from '../../../../corporate/trade/lc/initiation/services/utility.service';

@Component({
  selector: 'fcc-common-calendar-events',
  templateUrl: './calendar-events.component.html',
  styleUrls: ['./calendar-events.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class CalendarEventsComponent implements OnInit, AfterViewInit{
  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected globalDashboardComponent: GlobalDashboardComponent,
              protected dashboardService: DashboardService,
              protected commonService: CommonService,
              public datePipe: DatePipe,
              protected sessionValidation: SessionValidateService,
              protected fccGlobalConfiguration: FccGlobalConfiguration,
              protected translateService: TranslateService,
              protected utilityService: UtilityService,
              protected localeService: LocaleService) { }

  @Input () dashboardName;
  @Input () widgetDetails: any;
  nudges: any;
  langDir: string = localStorage.getItem('langDir');
  defaultCalendarEventsCount: number;
  start: string ;
  count: string ;
  mode: string;
  two = 2;
  three = 3;
  currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy').split('/');
  calendarevents: Calendarevents[] = [];
  value: Date = new Date(this.currentDate[1] + '/' + this.currentDate[0] + '/' + this.currentDate[this.two]);
  displayValue: any = this.utilityService.transformDateFormat(new Date());
  language = localStorage.getItem('language');
  eventDates: string[] = [];
  selectedDay: string;
  copyOfeventDates: string[] = [];
  paginationResponse: Calendarevents[] = [];
  contextPath: string;
  allEventsUrl = '';
  checkCustomise;
  hideShowCard;
  yearRange: string = (new Date().getFullYear() - 50) + ':' + (new Date().getFullYear() + 50);
  configuredKeysList = 'CALENDAR_EVENTS_DISPLAY,CALENDAR_EVENT_DATES_DISPLAYCOLOR,'
  + 'DEFAULT_SELECTED_MODE,PAGINATION_START,CALENDAR_EVENT_COUNT_FOR_MONTH,'
  + 'BANK_APPROVAL_AND_REJECTION_DAYS,BANK_APPROVAL_AND_REJECTION_ROW_COUNT';
  keysNotFoundList: any[] = [];
  classCheck;
  dashboardType;
  langLocale: any;
  includeSubProdCodeInUrl = [FccGlobalConstant.PRODUCT_TD];

  ngOnInit() {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
    this.langLocale = this.localeService.getCalendarLocaleJson(this.language);
    const dashBoardURI = this.dashboardName.split('/');
    this.dashboardType = dashBoardURI[dashBoardURI.length - 1].toUpperCase() ;
    this.contextPath = this.commonService.getContextPath();
    this.selectedDay = this.datePipe.transform(new Date(), FccGlobalConstant.DATE_FORMAT_1);
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response.response && response.response === 'REST_API_SUCCESS') {
          this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
          this.updateValues();
         }
      });
    } else {
      this.updateValues();
    }
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
  }

  ngAfterViewInit(): void {
      this.addAccessibilityControls();
  }

  addAccessibilityControls(): void {
    const datePickerNext= Array.from(document.getElementsByClassName("ui-datepicker-next-icon"));
    const datePickerPrev = Array.from(document.getElementsByClassName("ui-datepicker-prev-icon"));
    const datePickerYear = Array.from(document.getElementsByClassName("ui-datepicker-year"));
    const currentDate = Array.from(document.getElementsByClassName('ui-datepicker-current-day'));

    datePickerNext.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("nextMonth");
      element[FccGlobalConstant.TITLE] = this.translateService.instant("nextMonth");
    });

    datePickerPrev.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("previousMonth");
      element[FccGlobalConstant.TITLE] = this.translateService.instant("previousMonth");
    });

    datePickerYear.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("selectYear");
      element[FccGlobalConstant.TITLE] = this.translateService.instant("selectYear");
    });
    
    currentDate.forEach(element => {
      const eventDate = element.querySelector(".non-event-dates");
      element.querySelector('.ui-state-active')[FccGlobalConstant.ARIA_LABEL] = 
      this.translateService.instant("currentDate") + ': ' + eventDate.innerHTML; 
      element[FccGlobalConstant.TITLE] = this.translateService.instant("currentDate") + ': ' + eventDate.innerHTML;
    });
  }

  getCalendarEvents() {
    const currentDateFormat = this.utilityService.getDateFormat();
    const isConversionRequired = (currentDateFormat === FccGlobalConstant.MM_DD_YYYY_FORMAT);
    this.dashboardService
    .getCalendarEvents( this.start, this.count, this.selectedDay, this.mode, this.dashboardType)
    .subscribe(data => {
      if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
        this.sessionValidation.IsSessionValid();
      } else if (data.response && data.response === 'REST_API_SUCCESS') {
        if (data.eventsList != null) {
          if (isConversionRequired) {
            this.createEventsDataWithFiltering(data);
          } else {
            this.createEventsDataWithoutFiltering(data);
          }
      } else {
        this.paginationResponse = [];
        this.calendarevents = [];
      }
      }
    });
  }

  createEventsDataWithoutFiltering(data: any) {
    this.calendarevents = data.eventsList;
    for (let i = 0; i < data.eventsList.length; i++) {
      const value = data.eventsList[i];
      if (this.contextPath !== null && this.contextPath !== '' && this.contextPath !== undefined) {
        this.calendarevents[i].url = this.contextPath;
      } else {
        this.calendarevents[i].url = '';
      }
      if (value.referenceID !== undefined && value.referenceID !== ''
        && value.transactionId !== undefined && value.transactionId !== '') {
          this.calendarevents[i].url += this.fccGlobalConstantService.servletName + '/'
            + FccGlobalConstant.eventDetailsUrlInitial + value.referenceID +
            FccGlobalConstant.eventDetailsUrlWithTnxId + value.transactionId;
          if (value.tnxTypeCode !== undefined && value.tnxTypeCode !== '') {
            this.calendarevents[i].url += FccGlobalConstant.eventDetailsUrlWithTnxTypeCode + value.tnxTypeCode;
          }
          if (value.eventTnxStatCode !== undefined && value.eventTnxStatCode !== '') {
            this.calendarevents[i].url += FccGlobalConstant.eventDetailsUrlWithTnxStatCode + value.eventTnxStatCode;
          }
          const prodCode = value.referenceID.substring(0, this.two);
          let subProdCode = '';
          this.calendarevents[i].url += FccGlobalConstant.eventDetailsUrlEnd + prodCode;
          if(value.subProductCode){
            this.calendarevents[i].url += FccGlobalConstant.eventDetailsUrlSubProdCode + value.subProductCode;
          } else {
             subProdCode = this.includeSubProdCodeInURL(prodCode);
             this.calendarevents[i].url += FccGlobalConstant.eventDetailsUrlSubProdCode + subProdCode;
          }
      } else if ((value.referenceID !== undefined && value.referenceID !== '')
        && (value.transactionId === '' || value.transactionId === undefined)) {
          this.calendarevents[i].url += this.fccGlobalConstantService.servletName + '/'
          + FccGlobalConstant.eventDetailsUrlInitial +
          value.referenceID + FccGlobalConstant.eventDetailsUrlEnd + value.referenceID.substring(0, this.two);
      } else {
        this.calendarevents[i].url = '';
      }
    }
    this.paginationResponse = this.calendarevents.slice(0, this.defaultCalendarEventsCount);
  }

  createEventsDataWithFiltering(data: any) {
    this.calendarevents = [];
    for (let i = 0; i < data.eventsList.length; i++) {
      const value = data.eventsList[i];
      if (value.eventDate === this.displayValue) {
        if (this.contextPath !== null && this.contextPath !== '' && this.contextPath !== undefined) {
          value.url = this.contextPath;
        } else {
          value.url = '';
        }
        if (value.referenceID !== undefined && value.referenceID !== ''
          && value.transactionId !== undefined && value.transactionId !== '') {
            value.url += this.fccGlobalConstantService.servletName + '/'
              + FccGlobalConstant.eventDetailsUrlInitial + value.referenceID +
              FccGlobalConstant.eventDetailsUrlWithTnxId + value.transactionId;
            if (value.tnxTypeCode !== undefined && value.tnxTypeCode !== '') {
              value.url += FccGlobalConstant.eventDetailsUrlWithTnxTypeCode + value.tnxTypeCode;
            }
            if (value.eventTnxStatCode !== undefined && value.eventTnxStatCode !== '') {
              value.url += FccGlobalConstant.eventDetailsUrlWithTnxStatCode + value.eventTnxStatCode;
            }
            value.url += FccGlobalConstant.eventDetailsUrlEnd + value.referenceID.substring(0, this.two);
        } else if ((value.referenceID !== undefined && value.referenceID !== '')
          && (value.transactionId === '' || value.transactionId === undefined)) {
            value.url += this.fccGlobalConstantService.servletName + '/'
            + FccGlobalConstant.eventDetailsUrlInitial +
            value.referenceID + FccGlobalConstant.eventDetailsUrlEnd + value.referenceID.substring(0, this.two);
        } else {
          value.url = '';
        }
        this.calendarevents.push(value);
      }
    }
    this.paginationResponse = this.calendarevents.slice(0, this.defaultCalendarEventsCount);
  }

  getAllEventDates(selectedDate: string) {
    const currentDateFormat = this.utilityService.getDateFormat();
    const isConversionRequired = (currentDateFormat === FccGlobalConstant.MM_DD_YYYY_FORMAT);
    this.dashboardService.getCalendarEvents(
      this.start,
      this.count,
      selectedDate,
      this.mode,
      this.dashboardType
    ).subscribe(data => {
      if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
        this.sessionValidation.IsSessionValid();
      } else if (data.response && data.response === 'REST_API_SUCCESS') {
        if (data.eventsList != null && data.eventsList.length > 0) {
          let index = 0;
          data.eventsList.forEach(
            value => {
              if (isConversionRequired) {
                value.eventDate = this.datePipe.transform(value.eventDate, FccGlobalConstant.DATE_FORMAT_1);
              }
              this.eventDates.push(value.eventDate);
              if (value.eventDate === this.selectedDay) {
                this.calendarevents[index] = value;
                if (this.contextPath !== null && this.contextPath !== '' && this.contextPath !== undefined) {
                  this.calendarevents[index].url = this.contextPath;
                } else {
                  this.calendarevents[index].url = '';
                }
                if (value.referenceID !== undefined && value.referenceID !== ''
                  && value.transactionId !== undefined && value.transactionId !== '') {
                  this.calendarevents[index].url += this.fccGlobalConstantService.servletName + '/'
                  + FccGlobalConstant.eventDetailsUrlInitial + value.referenceID +
                  FccGlobalConstant.eventDetailsUrlWithTnxId + value.transactionId;
                  if (value.tnxTypeCode !== undefined && value.tnxTypeCode !== '') {
                    this.calendarevents[index].url += FccGlobalConstant.eventDetailsUrlWithTnxTypeCode + value.tnxTypeCode;
                  }
                  if (value.eventTnxStatCode !== undefined && value.eventTnxStatCode !== '') {
                    this.calendarevents[index].url += FccGlobalConstant.eventDetailsUrlWithTnxStatCode + value.eventTnxStatCode;
                  }
                  this.calendarevents[index].url += FccGlobalConstant.eventDetailsUrlEnd + value.referenceID.substring(0, this.two);
                  } else if ((value.referenceID !== undefined && value.referenceID !== '')
                  && (value.transactionId === '' || value.transactionId === undefined)) {
                    this.calendarevents[index].url += this.fccGlobalConstantService.servletName + '/'
                    + FccGlobalConstant.eventDetailsUrlInitial +
                    value.referenceID + FccGlobalConstant.eventDetailsUrlEnd + value.referenceID.substring(0, this.two);
                  } else {
                    this.calendarevents[index].url = '';
                  }
                index++;
                }
            });
          this.paginationResponse = this.calendarevents.slice(0, this.defaultCalendarEventsCount);

        } else {
          this.paginationResponse = [];
        }
        this.eventDates = this.eventDates.filter(this.returnUniqueElements);
        this.copyOfeventDates = this.eventDates;
      }
      this.addYearSelectAttributes();
    },
    );
  }

  addYearSelectAttributes() {
    const datePickerYear = document.getElementsByClassName("ui-datepicker-year")[0];
    datePickerYear.setAttribute('onfocus', 'this.size=20;');
    datePickerYear.setAttribute('onblur', 'this.size=0;');
    datePickerYear.setAttribute('onchange', 'this.size=1; this.blur();');
  }

  getSelectedMonthEvents(event) {
    let month = event.month.toString();
    if (event.month < 10) {
      month = '0' + month;
    }
    const monthStartDate = '01/' + month + '/' + event.year.toString();
    this.start = '0';
    this.count = FccGlobalConfiguration.configurationValues.get('CALENDAR_EVENT_COUNT_FOR_MONTH');
    this.mode = '3';
    this.getAllEventDates(monthStartDate);
    if ( this.copyOfeventDates[0] && event.month === this.copyOfeventDates[0].split('/')[1] ) {
      this.eventDates = this.copyOfeventDates;
    } else {
      this.eventDates = [];
    }
  }

  includeSubProdCodeInURL(productCode: any) {
    let subProductCode = '';
    if (this.includeSubProdCodeInUrl.includes(productCode)) {
        switch (productCode)
        {
          case FccGlobalConstant.PRODUCT_TD:
          subProductCode = FccGlobalConstant.SUB_PRODUCT_CODE_CSTD;
          break;
        }
  }
    return subProductCode;
  }

  eventDetails(events) {
    if (!events.referenceID) {
      return;
    }
    const productCode = events.referenceID.substring(FccGlobalConstant.LENGTH_0, FccGlobalConstant.LENGTH_2);
    let subProductCode = '';
    if (events.subProductCode){
      subProductCode = events.subProductCode;
    } else {
    subProductCode = this.includeSubProdCodeInURL(productCode);
    }
    this.commonService.getSwiftVersionValue();
    
    let isAngularProductURL = this.commonService.isAngularProductUrl(productCode, subProductCode);

    /*
    * TODO: To be remove once Angular UI is developed for 
    * Product SE AND sub product 'OTHER'
    */ 
    if(productCode === FccGlobalConstant.PRODUCT_SE
        && this.commonService.isnonBlankString(subProductCode)
        && subProductCode === 'OTHER') {
          isAngularProductURL = false;
    }

    if (isAngularProductURL &&
    (!(this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
      (productCode === FccGlobalConstant.PRODUCT_BG || productCode === FccGlobalConstant.PRODUCT_BR)))) {
        const url = this.router.serializeUrl(
              this.router.createUrlTree(['view'], {
                queryParams: {
                  tnxid: events.transactionId, referenceid: events.referenceID,
                  productCode,
                  subProductCode,
                  tnxTypeCode: events.tnxTypeCode,
                  eventTnxStatCode: events.eventTnxStatCode, mode: FccGlobalConstant.VIEW_MODE,
                  subTnxTypeCode: '',
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
      this.router.navigate([]).then(() => { window.open(events.url, '', 'width=800,height=600,resizable=yes,scrollbars=yes'); });
    }
  }

  returnUniqueElements(value, index, self) {
    return self.indexOf(value) === index;
  }

  getSelectedDateEvents(event) {
    this.displayValue = this.utilityService.transformDateFormat(this.value);
    this.selectedDay = this.datePipe.transform(event, FccGlobalConstant.DATE_FORMAT_1);
    this.mode = FccGlobalConfiguration.configurationValues.get('DEFAULT_SELECTED_MODE');
    this.count = (this.defaultCalendarEventsCount * this.three).toString();
    this.getCalendarEvents();
  }
  getMoreEvents() {
    const temp = this.calendarevents;
    for (let i = this.defaultCalendarEventsCount; i > 0; i--) {
        this.paginationResponse.pop();
      }
    temp.slice(0, this.defaultCalendarEventsCount * this.two).forEach(
      element => {
        this.paginationResponse.push(element);
      });

  }

  getDefaultEvents() {
    const temp = this.calendarevents;
    for (let i = this.defaultCalendarEventsCount * this.two; i > 0; i--) {
        this.paginationResponse.pop();
      }
    temp.slice(0, this.defaultCalendarEventsCount).forEach(
      element => {
        this.paginationResponse.push(element);
      });
  }

  getBackgroundColor(day) {
    let eventDate;
    let check = false;
    for (eventDate of this.eventDates) {
    if (day === +eventDate.split('/')[0]) {
      check = true;
      break;
    }
    }
    if (check) {
      return FccGlobalConfiguration.configurationValues.get('CALENDAR_EVENT_DATES_DISPLAYCOLOR');
    }
  }

  getAllEvents() {
    if (this.contextPath !== null && this.contextPath !== '' && this.contextPath !== undefined) {
        this.allEventsUrl = this.contextPath;
    }
    this.allEventsUrl += this.fccGlobalConstantService.servletName + '/' + FccGlobalConstant.allEventsUrl;
    const eventDate = this.selectedDay.split('/')[2] + this.selectedDay.split('/')[1] + this.selectedDay.split('/')[0];
    this.router.navigate([]).then(() => { window.open(this.allEventsUrl + eventDate, '_self'); });
   }

   updateValues() {
    this.defaultCalendarEventsCount = +FccGlobalConfiguration.configurationValues.get('CALENDAR_EVENTS_DISPLAY');
    this.start = '0';
    this.count = FccGlobalConfiguration.configurationValues.get('CALENDAR_EVENT_COUNT_FOR_MONTH');
    this.mode = '3';
    this.getAllEventDates(this.selectedDay);
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.addAccessibilityControls();
   }

   deleteCards() {
    this.hideShowDeleteWidgetsService.calanderCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.calanderCardHideShow.subscribe(res => {
      this.hideShowCard = res;
    });
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
      JSON.parse(this.widgetDetails).widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
   }

}
