import { AbstractControl } from '@angular/forms';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[fccCommonTextArea]'
})
export class FccCommonTextAreaDirective {


  private strResult = '';
  @Input() controlName: AbstractControl;
  @Input() nonSwiftValidation = false;
  constructor(public el: ElementRef) {  }

  @HostListener('focusout') onFocusOut() {
    this.validateRowCount();
  }

  private validateRowCount() {
    this.strResult = '';
    let intCountCol = 0;
    let strInput = this.el.nativeElement.value;
    let rowCount = 0;
    const cols = this.el.nativeElement.cols;
    const rows = this.el.nativeElement.rows;
    const swiftValidation = !this.nonSwiftValidation;
    strInput = strInput.replace(/(\r\n)+$/, '');
    strInput = strInput.replace(/(\n)+$/, '');

    for (let k =  0;  k < strInput.length; k++) {
      const strCurrentChar = strInput.charAt(k);

      if ((strCurrentChar === '\r') || (strCurrentChar === '\n')) {
        this.strResult += '\n';
        intCountCol = 0;
        rowCount++;

        if (strCurrentChar === '\r') {
          k++;
        }
      } else if (intCountCol === cols) {
        this.strResult += '\n';
        intCountCol = 1;
        this.strResult += strCurrentChar;
        rowCount++;
      } else {
        // Otherwise we simply copy the character and increment the counter:
        this.strResult += strCurrentChar;
        intCountCol++;
      }
    }
    this.controlName.setValue(this.strResult);
    if (((rowCount + 1) > rows) && swiftValidation) {
      this.controlName.setErrors({rowCountMoreThanAllowed: {enteredRow: rowCount + 1, maxRows: rows, charPerRow: cols}});
    }
 }
}
