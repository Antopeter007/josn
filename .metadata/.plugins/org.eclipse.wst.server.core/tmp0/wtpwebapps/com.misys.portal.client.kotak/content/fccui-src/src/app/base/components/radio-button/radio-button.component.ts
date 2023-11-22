import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  forwardRef
} from '@angular/core';

@Component({
  selector: 'fcc-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RadioButtonComponent)
    }
  ]
})
export class RadioButtonComponent implements OnInit {
  @Input() isDisabled = false;
  @Input() hasAutoFocus = false;
  checked = false;
  name: string;
  isNgModel = false;
  val1: string;

  radioName: any;
  radioLabel: any;

  options: any = [];

  radioNgModelValue: any;

  @Input()
  params: any = [];

  onChange: (_: boolean) => void = () => null;
  onTouched: () => void = () => null;

  constructor() {}

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: boolean): void {
    this.checked = value;
  }

  registerOnChange(fn: (_: boolean) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
  ngOnInit() {
    this.params = this.params || null;
  }
}
