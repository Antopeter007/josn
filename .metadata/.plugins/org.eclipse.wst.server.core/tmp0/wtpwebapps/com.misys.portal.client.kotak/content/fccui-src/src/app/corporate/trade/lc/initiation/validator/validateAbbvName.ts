import { AbstractControl } from '@angular/forms';

export function duplicatePhraseAbbvName(control: AbstractControl) {
      return {
        duplicatePhraseAbbvName: {
        parsedDomain: control.value
      }
    };
}
