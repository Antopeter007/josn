import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  ViewChild,
  HostListener,
  Renderer2,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FCCBase } from './../../../../../base/model/fcc-base';
import {
  FCCMVFormControl,
  FCCFormGroup,
} from './../../../../../base/model/fcc-control.model';


import {
  IDataEmittterModel,
  IUpdateFccBase,
} from '../../form-control-resolver/form-control-resolver.model';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import moment from 'moment';

@Component({
  selector: 'fcc-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
})
export class InputDateComponent
  extends FCCBase
  implements OnInit, AfterViewInit, IUpdateFccBase
{
  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  compData = new Map<string, any>();

  @ViewChild('calendar') calendar: any;
  specialDates = [];
  constructor(
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected renderer: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    //eslint : no-empty-function
  }

  listeners = [];
  calendarOpened(event) {
    if(this.control.params.dateTitle){
      setTimeout(() => {
        this.listeners.forEach(v => {
          v();
        });

        this.listeners = [];

        const buttons
        = document.querySelectorAll('mat-calendar .mat-calendar-body-cell, mat-calendar button, mat-calendar .mat-icon-button');
        buttons.forEach(btn => {
          const x = this.renderer.listen(btn, 'click', () => {
            setTimeout(() => {
              this.calendarOpened(event);
            });
          });

          this.listeners.push(x);
        });
        this.updateDayStyles();
      });
  }
  }
  dateToString(date: any) {
    return (
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2)
    );
  }
updateDayStyles() {
  const elements = document.querySelectorAll(".endDate");
  const x: any = elements.length > 0 ? elements[0].querySelectorAll('.mat-calendar-body-cell') : [];
  x.forEach(y => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dateArr = this.commonService.convertNumbertoEng(y.getAttribute("aria-label")).split('/');
    const tempDate = this.commonService.convertDateFormat(
      this.commonService.convertNumbertoEng(y.getAttribute("aria-label")));
    const dateSearch = this.dateToString(tempDate);
    const data = this.specialDates?.find(f => f.date == dateSearch);
    if (data) {
        const div = y.querySelectorAll('div')[0];
        div.classList.add('tooltip');
        const spans = y.querySelectorAll('span');
        if (spans.length > 0) {
          const span = spans[0];
          span.innerHTML = data.title;
          span.ariaLabel = data.title;
        }
        else {
          const span = document.createElement('span');
          span.innerHTML = data.title;
          span.ariaLabel = data.title;
          span.classList.add('tooltiptext');
          div.appendChild(span);
        }
    }
  });
}
  holidayDateFilter = (d :Date): boolean => {
    this.specialDates = this.control.params.holidayTitleList;
    //const moment = require('moment');
    const date:any = moment(d);
    const holidayList = this.control.params.holidayList;
    if (holidayList) {
      return !holidayList.find(x => moment(x).isSame(date, 'day'));
    } else{
      return date;
    }
  };


  ngAfterViewInit() {
    if (this.commonService.isNonEmptyValue(this.calendar)) {
      this.calendar.el.nativeElement
        .getElementsByClassName(FccGlobalConstant.UI_CALENDAR_BUTTON)[0]
        .setAttribute(
          'title',
          this.translateService.instant(FccGlobalConstant.CALENDAR)
        );
      this.compData.set('calendar', this.calendar);
    }
    this.controlDataEmitter.emit({
      control: this.control,
      data: this.compData,
    });
    if(this.calendar)
    {
      this.calendar.el.nativeElement.getElementsByTagName('input')[0]
      .addEventListener('focus', this.onSelect.bind(this));
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event) {
    if (event && ( event.target.localName === 'select' || event.target.localName === 'body')){
        this.calendar.hideOverlay();
    }
  }

  onClose() {
    this.calendar.el.nativeElement.getElementsByClassName(FccGlobalConstant.UI_CALENDAR_BUTTON)[0].focus();
  }

  onSelect(event): void {
    const calBtns = this.calendar.el.nativeElement.getElementsByTagName('td');
    if(typeof calBtns != 'undefined' && calBtns.length != 0){
      for(let i=0;i<calBtns.length;i++){
        const childEle = calBtns[i].getElementsByTagName('a');
        if(childEle.length != 0){
          calBtns[i].firstChild.setAttribute('tabindex',i);
        }
      }
    }
    event.stopPropagation();
  }

  getSelectedMonthEvents(e) {
    this.commonService.getSelectedMonthEvents();
 }

}
