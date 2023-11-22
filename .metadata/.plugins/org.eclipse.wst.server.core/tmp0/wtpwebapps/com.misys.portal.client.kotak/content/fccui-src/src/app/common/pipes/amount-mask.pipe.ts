import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'amountMask'
})
export class AmountMaskPipe implements PipeTransform {

  constructor(protected translateService: TranslateService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any): unknown {
    return this.translateService.instant('maskedValue');
  }

}
