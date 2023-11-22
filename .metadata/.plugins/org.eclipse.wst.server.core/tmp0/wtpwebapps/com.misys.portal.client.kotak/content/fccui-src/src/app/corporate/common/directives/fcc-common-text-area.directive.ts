import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { FccGlobalConstant } from '../../../common/core/fcc-global-constants';
import { LcConstant } from '../../trade/lc/common/model/constant';
import { rowCountExceeded, rowCountMoreThanAllowed } from '../../trade/lc/initiation/validator/ValidateNarratives';
import { CommonService } from './../../../common/services/common.service';

@ Directive({
  selector: '[fccCommonTextArea]'
})
export class FccCommonTextAreaDirective implements OnInit {

  lcConstant = new LcConstant();
  private strResult = '';
  private enteredCharCount = 0;
  params = this.lcConstant.params;
  maxlength = this.lcConstant.maxlength;
  maxRowCount = this.lcConstant.maxRowCount;
  enteredCharCounts = this.lcConstant.enteredCharCounts;
  rowCounts = this.lcConstant.rowCount;
  allowedCharCount = this.lcConstant.allowedCharCount;
  disableNextLineCharCount = this.lcConstant.disableNextLineCharCount;
  fieldSize = this.lcConstant.fieldSize;
  rows = this.lcConstant.rows;
  styleClass = this.lcConstant.styleClass;
  cols;
  definedCols;
  totalRowCount;
  maxRows;
  readonly = this.lcConstant.readonly;
  @ Input() controlName: AbstractControl;
  constructor(protected el: ElementRef, protected commonService: CommonService) {

  }

  @ HostListener('keyup') onKeyUp() {
    this.validateRowAndCharacterCount();
  }
  @ HostListener('focus') onFocus() {
    this.validateRowAndCharacterCount();
  }

  ngOnInit(): void {
    this.validateRowAndCharacterCount();
    this.validateTextAreaOnLoad();
  }

  // to count character and validate maximum rows
  protected validateRowAndCharacterCount() {
    this.strResult = '';
    let intCountCol = 0;
    const strInput = this.el.nativeElement.value;
    let rowCount = 1;
    this.cols = this.el.nativeElement.cols;
    this.definedCols = this.lcConstant.sixtySix;
    const maxrows = this.controlName[this.params][this.maxRowCount];
    const disableNextLineCount = this.controlName[this.params][this.disableNextLineCharCount];
    for (let k = 0; k < strInput.length; k++) {
      const strCurrentChar = strInput.charAt(k);

      if ((strCurrentChar === '\r' ) || (strCurrentChar === '\n')) {
        this.strResult += '\n';
        rowCount++;
        intCountCol = 0;
        if (strCurrentChar === '\r') {
          k++;
        }
      } else if (intCountCol === this.cols) {
        intCountCol = 1;
        this.strResult += strCurrentChar;
        rowCount++;
      } else {
        // Otherwise we simply copy the character and increment the counter:
          this.strResult += strCurrentChar;
          intCountCol++;
      }
    }
    this.totalRowCount = rowCount;
    this.maxRows = maxrows;
    this.setStyleClass(rowCount, maxrows);
    this.enteredCharCount = 0;
    if (this.strResult !== '' && disableNextLineCount ) {
      this.getCharCount();
    } else if (this.strResult !== '') {
      if (this.cols === FccGlobalConstant.LENGTH_35) {
        this.enteredCharCount = this.commonService.countInputChars(this.strResult);
      } else {
        this.enteredCharCount = this.commonService.counterOfPopulatedData(this.strResult);
      }
    }
    this.controlName.setValue(this.strResult);
    this.controlName[this.params][this.enteredCharCounts] = this.enteredCharCount;
    const val = this.controlName[this.params][this.readonly];
    if (!val){
    const currentValidators = this.controlName.validator;
    if (maxrows !== '' && rowCount > maxrows && disableNextLineCount) {
      this.controlName.setValidators(Validators.compose([currentValidators, rowCountExceeded(rowCount, maxrows)]));
      // this.controlName.setErrors({rowCountExceeded: {enteredRow: rowCount, maxRows: maxrows}});
      this.controlName.markAsDirty();
      this.controlName.markAsTouched();
      this.controlName.updateValueAndValidity();
    } else if (maxrows !== '' && rowCount > maxrows) {
      this.controlName.setValidators(Validators.compose([currentValidators, rowCountMoreThanAllowed(rowCount, maxrows, this.cols)]));
      // this.controlName.setErrors({rowCountMoreThanAllowed: {enteredRow: rowCount, maxRows: maxrows, charPerRow: this.cols}});
      this.controlName.markAsDirty();
      this.controlName.markAsTouched();
      this.controlName.updateValueAndValidity();
    } else {
      if (this.controlName.hasError('rowCountExceeded') || this.controlName.hasError('rowCountMoreThanAllowed')) {
        this.controlName.clearValidators();
        this.controlName.setErrors(null);
        if (this.controlName[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED]) {
          this.controlName.setValidators([Validators.required]);
        }
        this.controlName.updateValueAndValidity();
      }
      if (this.enteredCharCount === 0) {
        this.controlName[this.params][this.rowCounts] = 0;
      } else {
        this.controlName[this.params][this.rowCounts] = rowCount;
      }
  }
}
 }

 setStyleClass(rowCount, maxrows) {
  const styleClass = this.controlName[this.params][this.styleClass];
  if (this.controlName[this.params][this.fieldSize] === FccGlobalConstant.LENGTH_35) {
    if (rowCount > maxrows) {
      this.el.nativeElement.rows = maxrows;
      this.controlName[this.params][this.rows] = maxrows;
      this.controlName[this.params][this.styleClass] = `${styleClass} indented-text-area-field-35-with-scrollbar`;
    } else {
      this.el.nativeElement.rows = rowCount;
      this.controlName[this.params][this.rows] = rowCount;
      this.controlName[this.params][this.styleClass] = `${styleClass} indented-text-area-field-35`;
    }
  } else if (this.controlName[this.params][this.fieldSize] === FccGlobalConstant.LENGTH_65) {
      const rows = 15;
      if (rowCount > rows) {
        this.el.nativeElement.rows = rows;
        this.controlName[this.params][this.rows] = rows;
        this.controlName[this.params][this.styleClass] = `${styleClass} indented-text-area-field-65-with-scrollbar`;
      } else {
        this.el.nativeElement.rows = rowCount;
        this.controlName[this.params][this.rows] = rowCount;
        this.controlName[this.params][this.styleClass] = `${styleClass} indented-text-area-field-65`;
      }
  } else if (this.controlName[this.params][this.fieldSize] === FccGlobalConstant.LENGTH_64) {
    const rows = 5;
    if (rowCount > rows) {
      this.el.nativeElement.rows = rows;
      this.controlName[this.params][this.rows] = rows;
      this.controlName[this.params][this.styleClass] = `${styleClass} indented-text-area-field-64-with-scrollbar`;
    } else {
      this.el.nativeElement.rows = rowCount;
      this.controlName[this.params][this.rows] = rowCount;
      this.controlName[this.params][this.styleClass] = `${styleClass} indented-text-area-field-64`;
    }
}
 }
 strResultNotSpace() {
  if (this.strResult.indexOf('\n') > -1 || this.strResult.indexOf('\r') > -1) {
    const strInputArray = this.strResult.split('\n');
    let k = 0;
    for (let i = 0; i < strInputArray.length - 1; i++) {
        const strInputText = strInputArray[i];
        this.enteredCharCount += ((Math.trunc(strInputText.length / this.definedCols)) + 1) * this.cols;
        k++;
    }
    if (k === strInputArray.length - 1) {
      this.enteredCharCount += strInputArray[k].length;
    }
  } else {
    this.enteredCharCount = this.strResult.length;
  }
 }
 getCharCount() {
  this.enteredCharCount = this.strResult.length;
 }

 validateTextAreaOnLoad() {
  const currentValidators = this.controlName.validator;
  if (this.controlName.hasError('rowCountExceeded')) {
    // this.controlName.markAsDirty();
    // this.controlName.markAsTouched();
    this.controlName.setValidators(Validators.compose([currentValidators, rowCountExceeded(this.totalRowCount, this.maxRows)]));
    // this.controlName.setValidators([rowCountExceeded(this.totalRowCount, this.maxRows)]);
    // this.controlName.setErrors({ rowCountExceeded: {enteredRow: this.totalRowCount, maxRows: this.maxRows} });
    this.controlName.markAsDirty();
    this.controlName.markAsTouched();
    this.controlName.updateValueAndValidity();
  } else if (this.controlName.hasError('rowCountMoreThanAllowed')) {
    this.controlName.markAsDirty();
    this.controlName.markAsTouched();
    this.controlName.setValidators(Validators.compose(
      [currentValidators, rowCountMoreThanAllowed(this.totalRowCount, this.maxRows, this.cols)]));
    // this.controlName.setValidators([rowCountMoreThanAllowed(this.totalRowCount, this.maxRows, this.cols)]);
    // this.controlName.setErrors(
    //  { rowCountMoreThanAllowed:{enteredRow: this.totalRowCount, maxRows: this.maxRows, charPerRow: this.cols}});
    this.controlName.markAsDirty();
    this.controlName.markAsTouched();
    this.controlName.updateValueAndValidity();
  }
}

}
