import { AbstractControl, ValidatorFn } from '@angular/forms';

export function compareIndividualFieldCount(control: AbstractControl) {
      return {
      maxSizeExceedsIndividual: {
        parsedDomain: control.value
      }
    };
}

export function compareCumulativeNarrativeFieldCount(maxSize): ValidatorFn{
  return(control: AbstractControl): { [key: string]: any } | null => ({
    maxSizeExceedsAmend: {
    parsedDomain: control.value,
    maxSize
  } });
}

export function rowCountMoreThanAllowed(enteredRow, maxRows, charPerRow): ValidatorFn{
  return(control: AbstractControl): { [key: string]: any } | null => ({
    rowCountMoreThanAllowed: {
    parsedDomain: control.value,
    enteredRow,
    maxRows,
    charPerRow
  } });
}

export function rowCountExceeded(enteredRow, maxRows): ValidatorFn{
  return(control: AbstractControl): { [key: string]: any } | null => ({
      rowCountExceeded: {
    parsedDomain: control.value,
    enteredRow,
    maxRows
  } });
}
