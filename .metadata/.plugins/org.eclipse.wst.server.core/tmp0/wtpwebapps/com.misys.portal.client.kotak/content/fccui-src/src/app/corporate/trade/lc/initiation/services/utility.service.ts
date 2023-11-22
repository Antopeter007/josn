import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import moment from 'moment';
//convert below statement to import
//const moment = require('moment');

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  
  public map = new Map([
    [FccGlobalConstant.GENERAL_DETAILS , undefined],
    [FccGlobalConstant.APPLICANT_BENEFICIARY, undefined],
    [FccGlobalConstant.BANK_DETAILS, undefined],
    [FccGlobalConstant.AMOUNT_CHARGE_DETAILS, undefined],
    [FccGlobalConstant.PAYMENT_DETAILS, undefined],
    [FccGlobalConstant.SHIPMENT_DETAILS, undefined],
    [FccGlobalConstant.NARRATIVE_DETAILS, undefined],
    [FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY, undefined],
    [FccGlobalConstant.MODE_OF_TRANSMISSION, undefined]
  ]);

  public masterDatamap = new Map([]);

  public sectionmap = new Map([]);
  public dateFormat: Map<any, any>;
  public timezoneDateTimeFormat: Map<any, any>;

  summaryDetails = [];
  constructor(protected datePipe: DatePipe) { }

  putSummarydata(key, data) {
    this.map.set(key, data);
  }

  getSummaryData() {
    return this.map;
  }

  getSectionData(key) {
    return this.map.get(key);
   }

   /*This method will be triggered on click of a new LC */
   resetForm() {
    this.map.clear();
  }

  /*This method is used to transform the date to the given format  yyyy-MM-dd*/
  transformDate(date) {
    return this .datePipe.transform(date, 'yyyy-MM-dd');
  }

  /*Compares two date fields*/
  compareDateFields(earlyDateField, lateDateField) {
    if (earlyDateField && lateDateField) {
      if (this.compare(earlyDateField, lateDateField) < 0) {
        return false;
      }
    }
    return true;
  }

  /*Compare two date objects by date. Returns 0 if equal, positive if a > b, else negative.*/
  compare(date1, date2) {
    date1 = new Date(+date1);
    date2 = date2 ? date2 : new Date();
    date2 = new Date(+date2);

    if (date1 > date2) {
      return 1;
    }
    if (date1 < date2) {
      return -1;
    }
    return 0;
  }

  // summary:
  // Add to a Date in intervals of different size, from milliseconds to years
  // date: Date
  // Date object to start with
  // interval: String
  // A string representing the interval.  One of the following:
  // "year", "month", "day", "hour", "minute", "second",
  // "millisecond", "quarter", "week", "weekday"
  // amount: int
  // How much to add to the date.
  addToDate(date, interval, amount) {
    // convert to Number before copying to accomodate IE
    const sum = new Date(+date);
    let fixOvershoot = false;
    let property = 'Date';

    switch (interval) {
      case 'day': {
        // sum.setDate(sum.getDate() + amount);
        break;
      }
      case 'weekday': {
        // i18n FIXME: assumes Saturday/Sunday weekend, but this is not always true.  see dojo.cldr.supplemental
        // Divide the increment time span into weekspans plus leftover days
        // e.g., 8 days is one 5-day weekspan / and two leftover days
        // Can't have zero leftover days, so numbers divisible by 5 get
        // a days value of 5, and the remaining days make up the number of weeks
        let days;
        let weeks;
        const mod = amount % 5;
        if (!mod) {
          days = amount > 0 ? 5 : -5;
          weeks = amount > 0 ? (amount - 5) / 5 : (amount + 5) / 5;
        } else {
          days = mod;
          weeks = parseInt((amount / 5).toString(), 10);
        }
        // Get weekday value for orig date param
        const strt = date.getDay();
        // Orig date is Sat / positive incrementer
        // Jump over Sun
        let adj = 0;
        if (strt === 6 && amount > 0) {
          adj = 1;
        } else if (strt === 0 && amount < 0) {
        // Orig date is Sun / negative incrementer
        // Jump back over Sat
          adj = -1;
        }
        // Get weekday val for the new date
        const trgt = strt + days;
        // New date is on Sat or Sun
        if (trgt === 0 || trgt === 6) {
          adj = (amount > 0) ? 2 : -2;
        }
        // Increment by number of weeks plus leftover days plus
        // weekend adjustments
        amount = (7 * weeks) + days + adj;
        break;
      }
      case 'year': {
        property = 'FullYear';
        // Keep increment/decrement from 2/29 out of March
        fixOvershoot = true;
        break;
      }
      case 'week': {
        amount = amount * 7;
        break;
      }
      case 'quarter': {
        // Naive quarter is just three months
        amount *= 3;
        // fallthrough...
        break;
      }
      case 'month': {
        // Reset to last day of month if you overshoot
        fixOvershoot = true;
        property = 'Month';
        break;
      }
      default:
        property = 'UTC' + interval.charAt(0).toUpperCase() + interval.substring(1) + 's';
    }

    if (property) {
      sum['set' + property](sum['get' + property]() + amount);
    }

    if (fixOvershoot && (sum.getDate() < date.getDate())) {
      sum.setDate(0);
    }

    return sum;
  }

  transformStringtoDate(value) {
    return new Date(value);
  }

  /*This method is used to transform date format of dd/MM/yyyy into Date format*/
  transformddMMyyyytoDate(value) {
    const language = localStorage.getItem('language');
    if (language === FccGlobalConstant.LANGUAGE_US) {
      const dateParts3 = value.toString().split('/');
      return new Date(dateParts3[FccGlobalConstant.LENGTH_2],
        dateParts3[FccGlobalConstant.LENGTH_0] - FccGlobalConstant.LENGTH_1, dateParts3[FccGlobalConstant.LENGTH_1]);
    } else {
      const dateParts3 = value.toString().split('/');
      return new Date(dateParts3[FccGlobalConstant.LENGTH_2],
        dateParts3[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1, dateParts3[FccGlobalConstant.LENGTH_0]);
    }
  }

  /*This method is used to map the response from API */
  putMasterdata(key, data) {
    this.masterDatamap.set(key, data);
  }
  getMasterValue(key) {
    return this.masterDatamap.get(key);
  }
  getMasterKeys(key) {
    return this.masterDatamap.has(key);
  }
  /*This method is used to transform the date to the given format*/
  formatDate(date, format) {
    return this .datePipe.transform(date, format);
  }
  putSectionFlag(key, value) {
    this.sectionmap.set(key, value);
  }
  getSectionFlag(key) {
    return this.sectionmap.get(key);
  }

  /* Common methods to be used across the application for date/datetime related manipulations */
  // Transform valid Date object in the format(DATE_FORMAT) defined in core_languange.properties file from server
  transformDateFormat(date) {
    return moment(date).format(this.getDateFormat());
  }

  // Transform valid Date object in the format(TIMEZONE_DATE_TIME_FORMAT) defined in core_languange.properties file from server
  transformDateTimeFormat(date) {
    const language = localStorage.getItem('language');
    if (language != null && language !=='' && language !== undefined)
    {
      moment.locale(language);
    }
    return moment(date, this.getTimezoneDateTimeFormat())
      .format(this.getDateTimeFormat())
      .concat(moment.tz(moment.tz.guess()).zoneAbbr());
  }

  transformDateToLocalTZ(date){
    const language = localStorage.getItem('language');
    if (language != null && language !=='' && language !== undefined)
    {
      moment.locale(language);
    }
    /**
    picking up the timezone abbreviation from API response parameter
    "userLastLoginDateTime". 
    Example: "07/07/2023 13:01:37 (IST)". Below line will return IST.
     */
    const tzAbbr = typeof date === 'string'? date.match(/\(([^)]+)\)/)[1] : 
    moment.tz(moment.tz.guess()).zoneAbbr();
    return moment(date, this.getTimezoneDateTimeFormat())
      .format(this.getDateTimeFormat())
      .concat(tzAbbr);
  }

  getBankDateTime(bankTimeZone) {
    return moment()
      .tz(bankTimeZone)?.format(this.getTimeZoneDateTimeFormat());
  }

  // Set DATE_FORMAT which is read from core_language.properties file from server
  setDateFormat(date: any, timezoneDateTime: any) {
    this.dateFormat = date ? date : this.dateFormat;
    this.timezoneDateTimeFormat = timezoneDateTime;
  }

  // Get DATE_FORMAT which is read from core_language.properties file from server
  getRawDateFormat() {
    return this.dateFormat[localStorage.getItem('language')];
  }

  // Converting raw date format to uppercase to change into moment date format
  getDateFormat() {
    return this.getRawDateFormat().toUpperCase();
  }

  // Converting raw date format from MMM to Mmm in cases where date includes months in words
  getDisplayDateFormat() {
    return this.getRawDateFormat().replace(FccGlobalConstant.MONTH_FORMAT_MMM, 'Mmm')
    .replace(FccGlobalConstant.MONTH_FORMAT_MM, 'mm');
  }

  // Converting date format as per prime ng calendar accepted date format
  getDateFormatForRangeSelectionCalendar() {
    const format = this.getRawDateFormat().replace(FccGlobalConstant.MONTH_FORMAT_MMM, FccGlobalConstant.MONTH_FORMAT_M)
    .replace(FccGlobalConstant.MONTH_FORMAT_MM, 'mm').replace(FccGlobalConstant.YEAR_FORMAT_YYYY, 'yy');
    return format;
  }

  // Get TIMEZONE_DATE_TIME_FORMAT which is read from core_language.properties file from server
  getTimezoneDateTimeFormat() {
    const date = this.timezoneDateTimeFormat[localStorage.getItem('language')];
    const index = date.indexOf('HH');
    if (index >= 0) {
      return date.slice(0, index).toUpperCase() + date.slice(index);
    } else {
      return this.timezoneDateTimeFormat[
        localStorage.getItem('language')
      ].toUpperCase();
    }
  }

  // Get Date object from the transformed date string coming in response
  getDateFromAnyFormat(dateValue): Date | any {
    if (this.getVariationsOfFormat(dateValue, true)) {
      return this.getVariationsOfFormat(dateValue, false);
    } else if (this.getVariationsOfFormat(dateValue, true, FccGlobalConstant.MONTH_FORMAT_MMM, FccGlobalConstant.MONTH_FORMAT_MM)) {
      return this.getVariationsOfFormat(dateValue, false, FccGlobalConstant.MONTH_FORMAT_MMM, FccGlobalConstant.MONTH_FORMAT_MM);
    } else if (this.getVariationsOfFormat(dateValue, true, FccGlobalConstant.MONTH_FORMAT_MMM, FccGlobalConstant.MONTH_FORMAT_M)) {
      return this.getVariationsOfFormat(dateValue, false, FccGlobalConstant.MONTH_FORMAT_MMM, FccGlobalConstant.MONTH_FORMAT_M);
    } else {
      return dateValue;
    }
  }

  // Added for conversion of month in dates in case of digit to word conversion Eg - 16/06/2021 => 16/Jun/2021
  getVariationsOfFormat(dateValue, check, oldValue?, newValue?, dateFormat?) {
    const format = dateFormat ? dateFormat : this.getDateFormat();
    if (check) {
      return moment(dateValue, oldValue && newValue ? format.replace(oldValue, newValue) : format, true).isValid();
    } else {
      return moment(dateValue, oldValue && newValue ? format.replace(oldValue, newValue) : format).toDate();
    }
  }

  getDateTimeFormat() {
    return FccGlobalConstant.TIME_STAMP_FORMAT;
  }

  getTimeZoneDateTimeFormat() {
    return FccGlobalConstant.TIMEZONE_DATE_TIME_FORMAT;
  }

  isValidDateForGivenFormat(date: any, dateFormat: any) {
    return (moment(date, dateFormat.toUpperCase(), true).isValid());
  }

  transformDateToSpecificFormat(date,dateFormat) {
    return moment(date).format(dateFormat);
  }
  getUniqueTimeStampValue(){
    return moment(new Date()).format('YYYYMMDDHHmmss');
  }

  getDateWithOffset(offSet: number) {
    moment.locale("en");
    return moment(new Date()).add(offSet, 'd').format();
  }
}
