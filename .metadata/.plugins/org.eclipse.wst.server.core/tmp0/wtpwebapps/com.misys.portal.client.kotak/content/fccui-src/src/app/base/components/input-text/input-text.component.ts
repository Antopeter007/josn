import { FCCBase } from '../../model/fcc-base';
import { Component, OnInit, EventEmitter, Output, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fcc-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputTextComponent)
    }
  ]
})


export class InputTextComponent extends FCCBase implements OnInit, ControlValueAccessor {

  @Input()
  rendered: true;
  formSubmitted = false;
  get fieldValue() {
    return this.textFieldValue;
  }

  set fieldValue(val) {
    this.textFieldValue = val;
    this.propagateChange(this.textFieldValue);
  }

  constructor() {
    super();
  }

  textLabel: any;

  @Input()
  textIdx: string;

  @Input()
  params: any;

  @Input()
  textFieldValue: '';

  @Output()
  onClick = new EventEmitter<any>();

  onChange: (value: any) => void = () => null;

  onTouched: () => any = () => null;

  propagateChange = (_: any) => {};

  writeValue(obj: any): void {
    this.textFieldValue = obj;
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit() {
    this.params =
    this.params instanceof Object ? this.params : { styleClass: '' };
  }

  onMouseClicked(event, input) {
    this.onClick.emit(event);
  }
}
