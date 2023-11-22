import { CalendarLocale } from '../model/CalendarLocale';

import { Injectable } from '@angular/core';
import { DateFormatLocale } from '../model/DateFormatLocale';
import { CommonService } from '../../common/services/common.service';
import { FccGlobalConstant } from '../../common/core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  protected calendarLocaleJson = CalendarLocale.calendarLocaleJson;
  protected dateLocaleJson = DateFormatLocale.dateLocaleJson;
  weekStartDay: string;
  constructor(protected commonService: CommonService) {}

  public getCalendarLocaleJson(language) {
    const startDayOfWeek = this.getStartDayOfWeek();
    if (this.commonService.isNonEmptyValue(startDayOfWeek) && startDayOfWeek !== -1) {
      this.calendarLocaleJson[language].firstDayOfWeek = startDayOfWeek;
    }
    return this.calendarLocaleJson[language];
  }

  public getDateLocaleJson(language) {
    return this.dateLocaleJson[language];
  }

  public getStartDayOfWeek(): number {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.weekStartDay = response?.weekStartDay;
      }
    });
    return FccGlobalConstant.daysOfWeek.indexOf(this.weekStartDay?.toUpperCase());
  }
}
