import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUpdateFccBase, IDataEmittterModel } from '../../form-control-resolver/form-control-resolver.model';
import { FCCBase } from '../../../../../base/model/fcc-base';
import {
  FCCMVFormControl,
  FCCFormGroup,
} from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { DATE_FORMAT } from '../../../../../../app/base/model/DateFormatLocale';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-input-date-range',
  templateUrl: './input-date-range.component.html',
  styleUrls: ['./input-date-range.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ],
})
export class InputDateRangeComponent extends FCCBase implements OnInit, IUpdateFccBase, AfterViewInit {

  dateFormat = sessionStorage.getItem('dateRangeFormat') ? sessionStorage.getItem('dateRangeFormat') :
  FccGlobalConstant.DATE_RANGE_FORMAT;
  thresholdPeriod: number;
  startDate: any;
  endDate: any;
  changeEvent = new Event('change');
  blurEvent = new Event('blur');
  startDateNode: any;
  endDateNode: any;
  timeStamptoday: any;
  toolTipMsg: any;
  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  @Output() controlDataEmitter: EventEmitter<IDataEmittterModel> =
    new EventEmitter<IDataEmittterModel>();
  compData = new Map<string, any>();
  displayStartDate: any;

  constructor(protected commonService: CommonService,
    protected translateService: TranslateService, protected datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    // method for initialization for pre-populating date ranage

    this.thresholdPeriod = parseInt(sessionStorage.getItem('thresholdSearchPeriod'));
    this.commonService.timeStampToday$.subscribe((value) => {
      this.timeStamptoday = value;
    });
    const today = new Date(this.timeStamptoday);
    const thresholdDate = new Date(this.timeStamptoday);
    this.startDate = new Date(thresholdDate.setDate(today.getDate() - this.thresholdPeriod));
    this.endDate = today;
    this.displayStartDate = moment(this.startDate).format(this.dateFormat);
    this.toolTipMsg = `<div class='tooltip-container'>
                        <div class='tooltip-header'>${this.translateService.instant("notes")}</div>
                        <span class='tooltip-text'>${this.translateService.instant("dateFormat", { format: this.dateFormat })}</span>
                        <span class='tooltip-text'>${this.translateService.instant("thresholdText",
                        { startDate: this.displayStartDate })}</span>
                      </div>`;
  }

  ngAfterViewInit(): void {
    const calendarIcon = document.getElementsByTagName('mat-datepicker-toggle');
    if(calendarIcon && calendarIcon.length && calendarIcon[0].children
        && calendarIcon[0].children.length) {
        calendarIcon[0].children[0]['title'] = this.translateService.instant('calendar');
    }
    this.startDateNode = document.getElementById('startDate');
    this.endDateNode = document.getElementById('endDate');

    this.startDateNode.dispatchEvent(this.changeEvent);
    this.startDateNode.dispatchEvent(this.blurEvent);

    this.endDateNode.dispatchEvent(this.changeEvent);
    this.endDateNode.dispatchEvent(this.blurEvent);
  }

  onClickEnter(e) {
    e.preventDefault();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  OnBlurDateRange($event, type, key) {
    if(type === 'StartDate' && !$event.target.value) {
      this.startDate = new Date(new Date().setDate(new Date(this.timeStamptoday).getDate() - this.thresholdPeriod));
      setTimeout(() => {
        this.startDateNode.dispatchEvent(this.blurEvent);
        this.startDateNode.dispatchEvent(this.changeEvent);
      }, 10);
    }
    if(type === 'EndDate' && !$event.target.value) {
      this.endDate = new Date(this.timeStamptoday);
      setTimeout(() => {
        this.endDateNode.dispatchEvent(this.blurEvent);
        this.endDateNode.dispatchEvent(this.changeEvent);
      }, 10);
    }
  }
}
