import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, ElementRef, forwardRef, HostListener } from '@angular/core';

@Component({
  selector: 'fcc-inputtextarea',
  templateUrl: './inputtextarea.component.html',
  styleUrls: ['./inputtextarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputtextareaComponent)
    }
  ]
})
export class InputtextareaComponent implements OnInit, ControlValueAccessor {

  textareaLabel: any;
  maxChars: any;

  private strResult = '';

  @Input()
  rows: any = [];

  @Input()
  cols: any = [];

  @Input() autoResize: boolean;

  @Input() controlName: AbstractControl;

  @Input()
  params: any = [];

  @Input()
  textAreaValue: string;

  @Output() onResize: EventEmitter<any> = new EventEmitter();

  propagateChange = (_: any) => {};

  onChange: (value: any) => void = () => null;

  private onTouchTextArea: () => void = () => null;

  constructor(public el: ElementRef) { }

  ngOnInit() {
    this.rows = this.rows !== undefined ? this.rows : {};
    this.cols = this.cols !== undefined ? this.cols : {};
    this.maxChars = this.rows * this.cols;
    this.params = this.params !== undefined ? this.params : {};
  }

  get fieldValue() {
    return this.textAreaValue;
  }

  set fieldValue(val) {
    this.textAreaValue = val;
    this.propagateChange(this.textAreaValue);
  }

  writeValue(obj: any): void {
    this.textAreaValue = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchTextArea = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  @HostListener('focus', ['$event'])
    onFocus(e) {
        this.validateRowCount();
    }

    @HostListener('blur', ['$event'])
    onBlur(e) {
        if (this.autoResize) {
            this.resize(e);
        }
    }

  resize(event?: Event) {
    this.el.nativeElement.style.height = 'auto';
    this.el.nativeElement.style.height = this.el.nativeElement.scrollHeight + 'em';

    if (parseFloat(this.el.nativeElement.style.height) >= parseFloat(this.el.nativeElement.style.maxHeight)) {
        this.el.nativeElement.style.overflowY = 'scroll';
        this.el.nativeElement.style.height = this.el.nativeElement.style.maxHeight;
    } else {
        this.el.nativeElement.style.overflow = 'hidden';
    }

    this.onResize.emit(event || {});
  }

  public validateRowCount() {
    this.strResult = '';
    let intCountCol = 0;
    let intPosLastSpace = -1;
    let strInput = this.textAreaValue;
    let rowCount = 0;
    const cols = this.cols;
    const rows = this.rows;
    strInput = strInput.replace(/(\r\n)+$/, '');
    strInput = strInput.replace(/(\n)+$/, '');

    for (let k =  0;  k < strInput.length; k++) {
      const strCurrentChar = strInput.charAt(k);

      if ((strCurrentChar === '\r') || (strCurrentChar === '\n')) {
        this.strResult += '\n';
        intCountCol = 0;
        rowCount++;

        intPosLastSpace = -1;
        if (strCurrentChar === '\r') {
          k++;
        }
      } else if (intCountCol === cols) {
        if (intPosLastSpace === -1) {
          this.strResult += '\n';
          intCountCol = 1;
        } else {
          this.strResult = `${this.strResult.slice(0, this.strResult.length - (k - intPosLastSpace) + 1)} ${'\n'}
                      ${this.strResult.slice(this.strResult.length - (k - intPosLastSpace) + 1)}`;
          intCountCol = k - intPosLastSpace;
        }
        this.strResult += strCurrentChar;
        rowCount++;
        intPosLastSpace = -1;
      } else {
        // Otherwise we simply copy the character and increment the counter:
        this.strResult += strCurrentChar;
        intCountCol++;
      }

      // If the current character is a space, we store its position
      if (strCurrentChar === ' ') {
        intPosLastSpace = k;
      }
    }
    this.controlName.setValue(this.strResult);
    if ((rowCount + 1) > rows) {
      this.controlName.setErrors({rowCountMoreThanAllowed: {enteredRow: rowCount + 1, maxRows: rows, charPerRow: cols}});
    }
 }

}
