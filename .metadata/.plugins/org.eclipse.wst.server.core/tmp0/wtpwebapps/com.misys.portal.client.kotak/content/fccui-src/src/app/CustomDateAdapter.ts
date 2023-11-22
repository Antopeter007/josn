import { Inject, Injectable, Optional } from '@angular/core';
import { MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { Platform } from '@angular/cdk/platform';
import { UtilityService } from './corporate/trade/lc/initiation/services/utility.service';
import { LocaleService } from './base/services/locale.service';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter{

    constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale, platform: Platform,
                protected utilityService: UtilityService, protected localeService: LocaleService) {
        super(dateLocale, platform);
    }

    parse(value: any): Date | null {
        if (value) {
          return this.utilityService.getDateFromAnyFormat(value);
        }
        return value;
      }

    format(date, displayFormat): any {
        if (date && date instanceof Date) {
            return this.utilityService.transformDateFormat(date);
        } else {
            return super.format(date, displayFormat);
        }
    }

    getFirstDayOfWeek(): number {
        const firstDayOfWeek = this.localeService.getStartDayOfWeek();
        if (firstDayOfWeek !== undefined && firstDayOfWeek !== null && firstDayOfWeek !== -1) {
            return firstDayOfWeek;
        }
        return 0;
    }
}
