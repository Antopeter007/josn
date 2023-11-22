import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'fcc-common-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements ControlValueAccessor, OnInit {
  value: Date = null;

  calendarID: any;
  valueDate: any;
  placeholder: any;
  calendarLabel: string;
  inline: boolean;
  showIcon: boolean;
  showButtons: boolean;
  dateFormat: any;
  showTime: boolean;
  hourFormat: any;
  minDate: any;
  maxDate: any;
  readOnly: boolean;
  disabledDates: boolean;
  disabledDays: any;
  numberOfMonths: any;
  monthNavigator: any;
  yearNavigator: any;
  yearRange: any;
  five = 5;
  ten = 10;

  @Input()
  params: any = [];

  private onChangeFn: (date: Date) => void = () => {};
  private onTouchFn: () => void = () => {};

  writeValue(date: any, touched?: boolean): void {
    this.updateDate(date, touched || false);
  }

  registerOnChange(fn: (date: Date) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  getYearRange(yr) {
    const year = new Date().getFullYear();
    if (yr == null || yr === '') {
      return year - this.five + ':' + (year + this.ten);
    } else {
      return yr;
    }
  }

  setDisabledState?(isDisabled: boolean): void {}

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.params = this.params !== undefined ? this.params : {};
  }

  private updateDate(date: Date, touched: boolean = true): void {
    this.value = date;

    if (touched) {
      this.onChangeFn(date);
      this.onTouchFn();
    }
  }
}
