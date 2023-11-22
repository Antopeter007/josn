import { FccGlobalConstant } from '../../common/core/fcc-global-constants';

export class DateFormatLocale {
  static dateLocaleJson = {
    en: {
     dateFormat: 'dd/MM/yy'
  },
  us: {
    dateFormat: 'MM/dd/yy'
},
  fr: {
    dateFormat: 'dd/MM/yy'
  },
  ar: {
    dateFormat: 'dd/MM/yy'
  }
};
}

export const DATE_FORMAT = {
  parse: {
    dateInput: sessionStorage.getItem('dateRangeFormat') ? sessionStorage.getItem('dateRangeFormat') :
    FccGlobalConstant.DATE_RANGE_FORMAT,
  },
  display: {
    dateInput: sessionStorage.getItem('dateRangeFormat') ? sessionStorage.getItem('dateRangeFormat') :
    FccGlobalConstant.DATE_RANGE_FORMAT,
    monthYearLabel: FccGlobalConstant.DATE_RANGE_FORMAT,
    dateA11yLabel: FccGlobalConstant.DATE_RANGE_FORMAT,
    monthYearA11yLabel: FccGlobalConstant.DATE_RANGE_FORMAT,
  },
};
