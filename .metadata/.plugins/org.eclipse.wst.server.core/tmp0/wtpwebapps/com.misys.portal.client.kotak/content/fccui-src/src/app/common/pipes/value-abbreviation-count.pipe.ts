import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueAbbreviationCount'
})
export class ValueAbbreviationCountPipe implements PipeTransform {

  /* Transforms comma separated values into value count if no max length is passed.
  Eg -
  C1,C2,C3,C4 => C1(+3)
  A1,A2 => A1(+1)

  Transforms comma separated values into values upto max length and then appends ... if max length is passed
  Eg - if max length is 3
  C1,C2,C3,C4 => C1,C2,C3...
  */
  transform(value: any, maxLength?: any): any {
    if (value) {
      let arr = value.split(',');
      if (arr.length > 1) {
        if (maxLength && arr.length > maxLength) {
          arr = arr.splice(0, maxLength).toString();
          return arr.toString().concat('...');
        } else if (!maxLength) {
          return arr[0].concat('(+').concat(arr.length - 1).concat(')');
        }
      }
    }
    return value;
  }
}
