import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'filterChip'
})
export class FilterChipPipe implements PipeTransform {
  constructor(protected translationService: TranslateService) {}

  transform(value: any, actual?: boolean): unknown {
    let arr;
    let length;
    let val;
    try {
      arr = value.split('|');
    } catch (e) { }
    if (arr) {
      length = arr.length - 2;
    }
    try {
    val = value.replaceAll('|', ', ');
    } catch (e) {}
    if (actual) {
      let actualValue = '';
      if (arr.length > 0) {
        arr.forEach((element) => {
          actualValue += this.translationService.instant(element);
        });
      }
        return actualValue;
    } else {
      if (length > 0) {
        return `${this.translationService.instant(arr[0])}` + ', ' + `${this.translationService.instant(arr[1])}`
         + ' ' + '& ' + length + ' more';
      } else {
        return `${this.translationService.instant(val)}`;
      }
    }
  }

}
