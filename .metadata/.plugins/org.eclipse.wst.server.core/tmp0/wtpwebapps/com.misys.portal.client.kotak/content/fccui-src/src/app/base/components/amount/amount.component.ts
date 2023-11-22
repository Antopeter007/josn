import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'fcc-common-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.scss']
})
export class AmountComponent implements OnInit, ControlValueAccessor {
  id: any;
  currencies: SelectItem[];
  currency: any;
  amount: any;
  amountPlaceholder: any;

  @Input()
  params: any = [];

  onChange: (value: any) => void = () => null;

  private onChangeAmt: () => void = () => null;
  private onTouchAmt: () => void = () => null;

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {
    this.onChangeAmt = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchAmt = fn;
  }

  onEventRaised(fn: () => {}): void {
    this.onChange = fn;
  }

  constructor() {}

  ngOnInit() {
    this.params = this.params !== undefined ? this.params : {};
  }
}
