import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { BehaviorSubject } from 'rxjs';
import { Validators } from '@angular/forms';
import { transferDateIsExceedingFutureDate, transferDateIsHoliday, transferDateLessThanCurrentDate } from '../../corporate/trade/lc/initiation/validator/ValidateDates';
import { UtilityService } from '../../corporate/trade/lc/initiation/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayCalendarService {
  dateTooltipList: any;
  holidayList: any;
  timeperiod: any;
  public holidaysList = new BehaviorSubject(false);
  maxDate: any;

  constructor(protected commonService: CommonService, protected translateService: TranslateService,
    protected utilityService: UtilityService, protected datepipe: DatePipe) {
    //eslint : no-empty-function
  }
  getWeeklyHolidayList(weeklyHolidayOffset, timeperiod){

    const today = new Date();
    const endDate = new Date(new Date().setDate(today.getDate() + Number(timeperiod)));
    const weeklyHolidayList=[];
    for(let t=today; t<=endDate; t.setDate(t.getDate()+1)){
      if(weeklyHolidayOffset.includes(t.getDay())){
        weeklyHolidayList.push(new Date(t));
      }
    }
    return weeklyHolidayList;
  }

  async prepareHolidayList(productCode,subProductCode,currCode,countryCode,bankAbbvName){
    await this.commonService.getHolidayList(productCode,subProductCode,currCode,countryCode,bankAbbvName).subscribe(response=>{
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const today = new Date();
      this.dateTooltipList = [];
      const tempBankHolidayList = [];
      const weeklyHolidayOffsetArr = response.data['weeklyHolidayOffset'];
      const bankHolidayList = response.data['bankHoliday'];
      const tempArr = [];
      weeklyHolidayOffsetArr.forEach((value, index) => {
        tempArr[index] = value-1;
      });

      this.timeperiod = response.data['allowedFTfutureDays'];
      this.holidayList = this.getWeeklyHolidayList(tempArr,this.timeperiod);
      bankHolidayList.forEach((value) => {
        const dateParts = value.split("/");
        const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        this.holidayList.push(dateObject);
        tempBankHolidayList.push(dateObject);
      });
      this.formDateTooltipList(tempBankHolidayList,`${this.translateService.instant('bankHoliday')}`);
      this.formDateTooltipList(this.holidayList,`${this.translateService.instant('weeklyHoliday')}`);
      this.holidaysList.next(true);
    });
  }

  formDateTooltipList(dateList, title){
    dateList.forEach((value) => {
      const convertedDate = this.datepipe.transform(value, FccGlobalConstant.DATE_FORMAT_YYYY_MM_DD);
      this.dateTooltipList.push({ "date": convertedDate,"title": title });
    });
  }

  validateDate(form: any,element : string){
    const holidayTitleList = this.dateTooltipList;
    const transferDate = this.datepipe.transform(form.get(element).value,FccGlobalConstant.DATE_FORMAT_YYYY_MM_DD);
    if(form.get(element)[FccGlobalConstant.PARAMS]['maxDate']) {
      this.maxDate = form.get(element)[FccGlobalConstant.PARAMS]['maxDate'] ;
         }
         const currentDate = this.datepipe.transform(new Date(),FccGlobalConstant.DATE_FORMAT_YYYY_MM_DD);
         if(transferDate && transferDate < currentDate) {
          form.get(element).setValidators([transferDateLessThanCurrentDate]);
          form.get(element).invalid;
          form.get(element).markAsDirty();
          form.get(element).updateValueAndValidity();
         }
      else if(holidayTitleList && holidayTitleList.length>0) {
      const exists = holidayTitleList.filter(
        task => task.date === transferDate);
       if (this.maxDate !== null && transferDate > this.datepipe.transform(this.maxDate,FccGlobalConstant.DATE_FORMAT_YYYY_MM_DD)){
        const dt= this.datepipe.transform(this.maxDate,this.utilityService.dateFormat[localStorage.getItem('language')]);
        form.get(element)['params']['displayMaxDate'] = dt;
        form.get(element).setValidators([transferDateIsExceedingFutureDate]);
        form.get(element).invalid;
        form.get(element).markAsDirty();
        form.get(element).updateValueAndValidity();
        } else if(this.commonService.isNonEmptyValue(exists) && exists.length > 0) {
        form.get(element).setValidators([transferDateIsHoliday]);
        form.get(element).invalid;
        form.get(element).markAsDirty();
        form.get(element).updateValueAndValidity();
      } else{
        form.get(element).clearValidators();
        if(form.get(element)['params']['rendered'] == true) {
        form.get(element).setValidators(Validators.required);
        }
        form.get(element).updateValueAndValidity();
       }

    }else if (this.maxDate !== null && transferDate > this.datepipe.transform(this.maxDate,FccGlobalConstant.DATE_FORMAT_YYYY_MM_DD)){
      const dt= this.datepipe.transform(this.maxDate,this.utilityService.dateFormat[localStorage.getItem('language')]);
      form.get(element)['params']['displayMaxDate'] = dt;
      form.get(element).setValidators([transferDateIsExceedingFutureDate]);
      form.get(element).invalid;
      form.get(element).markAsDirty();
      form.get(element).updateValueAndValidity();
    }
    else{
      form.get(element).clearValidators();
      if(form.get(element)['params']['rendered'] == true) {
      form.get(element).setValidators(Validators.required);
      }
      form.get(element).updateValueAndValidity();
    }
  }
}
