import { MaxlengthCurrenciesPipe } from './../../../pipes/maxlength-currencies.pipe';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { CommonService } from '../../../services/common.service';
import { CurrencyConversionRequest } from '../../../model/currency-conversion-request';
import { CurrencyConversionService } from '../../../services/currency-conversion.service';
import { Component, Input, OnInit } from '@angular/core';
import { UserData } from '../../../model/user-data';
import { CurrencyRequest } from '../../../model/currency-request';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { DecimalPipe } from '@angular/common';
import { SessionValidateService } from '../../../services/session-validate-service';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';
import { CustomCommasInCurrenciesPipe } from './../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FccGlobalConfiguration } from '../../../core/fcc-global-configuration';

@Component({
  selector: 'fcc-common-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION],
})
export class CurrencyConverterComponent implements OnInit {
  currency = [];
  ccRequest: CurrencyConversionRequest = new CurrencyConversionRequest();
  curRequest: CurrencyRequest = new CurrencyRequest();
  selectedCurrency;
  calculatedAmount: number;

  fromCurrency: any;
  toCurrency: any ;
  fromAmount = '100';
  defaultFlag = true;
  imagePath;
  fromAmountString = '';
  toAmountString = '';
  toAmountValue = '0';
  hideShowCard;
  checkCustomise;
  classCheck;
  eighteen = 18;
  ten = 10;
  thirtyOne = 31;
  fortyThree = 43;
  fiftySeven = 57;
  dir: string = localStorage.getItem('langDir');
  dirFlagStyle;
  dirFieldFlagStyle;
  dirTextStyle;
  dirFieldTextStyle;
  dirDropDownStyle;
  currenciesDiv51;
  currenciesDiv52;
  iso;
  OMR = 'OMR';
  BHD = 'BHD';
  TND = 'TND';
  JPY = 'JPY';
  JOD = 'JOD';
  KWD = 'KWD';
  LYD = 'LYD';
  flagDecimalPlaces = -1;
  toAmtDecimalPlaces: any;
  toAmtDeciPlace: any;
  length4 = FccGlobalConstant.LENGTH_4;
  fromAmtSize: number;
  length11 = FccGlobalConstant.LENGTH_11;
  length12 = FccGlobalConstant.LENGTH_12;
  length14 = FccGlobalConstant.LENGTH_14;
  length15 = FccGlobalConstant.LENGTH_15;
  length17 = FccGlobalConstant.LENGTH_17;
  length18 = FccGlobalConstant.LENGTH_18;
  configuredKeysList = 'CURRENCY_CONVERTER_TOCURRENCIESLIST';
  keysNotFoundList: any[] = [];
  toCurrencies: any;
  toCurrencyList = [];
  @Input() widgetDetails;
  nudges: any;
  tabIndex: string;

  constructor(
    protected cc: CurrencyConversionService,
    protected commonService: CommonService,
    protected translate: TranslateService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected dp: DecimalPipe,
    protected sessionValidation: SessionValidateService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected globalDashboardComponent: GlobalDashboardComponent,
    protected maxlengthCurrenciesPipe: MaxlengthCurrenciesPipe,
    protected fccGlobalConfiguration: FccGlobalConfiguration
  ) {}

  get toAmount(): any {
    return this.toAmountValue;
  }

  get fromAmountStr() {
    const fromAmt = this.fromAmount.toString();
    if (fromAmt.substring(0, fromAmt.indexOf('.')).length > this.eighteen) {
      this.fromAmountString = fromAmt.substring(0, this.eighteen);
    } else {
      this.fromAmountString = '';
    }
    return this.fromAmountString;
  }

  get toAmountStr() {
    const toAmt = this.toAmount.toString();
    const toCur = this.toCurrency === undefined ? '' : this.toCurrency.iso;
    if ( toAmt.substring(0, toAmt.indexOf('.')).length > this.eighteen ||
      (toCur === 'JPY' && toAmt.length > this.eighteen)
    ) {
      this.toAmountString = toAmt.substring(0, this.eighteen);
    } else {
      this.toAmountString = '';
    }
    return this.toAmountString;
  }

  ngOnInit() {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
    this.imagePath = this.commonService.getImagePath();
    this.ccRequest.userData = new UserData();
    this.ccRequest.userData.userSelectedLanguage = localStorage.getItem('language');
    this.curRequest.userData = this.ccRequest.userData;
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
      if (this.checkCustomise) {
        this.tabIndex = '-1';
      }
    });

    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.commonService
        .getConfiguredValues(this.keysNotFoundList.toString())
        .subscribe(response => {
          if (response.response && response.response === 'REST_API_SUCCESS') {
            this.fccGlobalConfiguration.addConfigurationValues(
              response,
              this.keysNotFoundList
            );
            this.getCurrencies();
          }
        });
    } else {
      this.getCurrencies();
    }

    if (this.dir === 'rtl') {
      this.dirFlagStyle = 'dropdown-flag-direction';
      this.dirTextStyle = 'dropdown-text-direction';
      this.dirDropDownStyle = 'dirDropDownStyle';
      this.dirFieldTextStyle = 'field-text-direction';
      this.dirFieldFlagStyle = 'field-flag-direction';
      this.currenciesDiv51 = 'currenciesDiv51Dir';
      this.currenciesDiv52 = 'currenciesDiv52Dir';
    } else {
      this.dirFlagStyle = 'dropdown-flag';
      this.dirTextStyle = 'dropdown-text';
      this.dirFieldTextStyle = 'field-text';
      this.dirFieldFlagStyle = 'field-flag';
      this.currenciesDiv51 = 'currenciesDiv51';
      this.currenciesDiv52 = 'currenciesDiv52';
    }
  }

  toggleCurrency() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
    this.calculateFromCurrency();
    this.calculateToCurrency();
  }

  /* validation on change of 'from currency' field */
  calculateFromCurrency() {
    this.defaultFlag = false;
    // on change of 'from currency' value, 'from Amount' value is reset to '100'
    this.fromAmount = '100';
    this.calculateFromAmount();
  }

  /* validation on change of 'to currency' field */
  calculateToCurrency() {
    this.defaultFlag = false;
    this.calculateToAmount();
  }

  calculateAmount() {
    this.removeDelimiters();
    this.ccRequest.fromCurrency = this.fromCurrency.iso;
    this.ccRequest.toCurrency = this.toCurrency.iso;
    this.ccRequest.fromCurrencyAmount = this.fromAmount.toString();
    if (this.fromCurrency.iso !== undefined && this.fromCurrency.iso != null && this.toCurrency.iso !== undefined &&
        this.toCurrency.iso != null && this.fromAmount !== undefined && this.fromAmount != null) {
      this.cc.getConversion(this.fccGlobalConstantService.getCurrencyConverterUrl(), this.ccRequest).subscribe(
        response => {
          if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
            this.sessionValidation.IsSessionValid();
          } else {
          this.toAmountValue = response.toCurrencyAmount != null ? response.toCurrencyAmount : 0;
          this.addToAmtDelimiters();
          this.removeDelimitersToAmt() ;
          }
        });
    }
  }

  calculateFromAmount() {
    this.calculateAmount();
    this.addFromAmtDelimiters();
  }

  calculateToAmount() {
    this.calculateAmount();
  }

  addFromAmtDelimiters() {
    this.fromAmount = this.commonService.removeAmountFormatting(this.fromAmount.toString());
    this.customCommasInCurrenciesPipe.transform(this.fromAmount, this.fromCurrency.iso);
  }

  onBlurFromAmt() {
    this.addFromAmtDelimiters();
    if (
        this.fromCurrency.iso === this.OMR ||
        this.fromCurrency.iso === this.BHD ||
        this.fromCurrency.iso === this.TND
      ) {
      if (this.fromAmount.indexOf('.') > -1 && (this.fromAmount.indexOf(','))) {
        this.fromAmtSize = this.length18;
      } else if (this.fromAmount.indexOf('.') > -1 && (!this.fromAmount.indexOf(','))) {
        this.fromAmtSize = this.length15;
      } else {
        this.fromAmtSize = this.length11;
      }
    } else if (this.fromCurrency.iso === this.JPY) {
      if ((this.fromAmount.indexOf(',') > -1)) {
        this.fromAmtSize = this.length17;
      } else {
        this.fromAmtSize = this.length14;
      }
    } else {
      if (this.fromAmount.indexOf('.') > -1 && (this.fromAmount.indexOf(',') > -1)) {
        this.fromAmtSize = this.length18;
      } else if (this.fromAmount.indexOf('.') > -1 && (this.fromAmount.indexOf(',') === -1)) {
        this.fromAmtSize = this.length15;
      } else {
        this.fromAmtSize = this.length12;
      }
    }
  }

  addToAmtDelimiters() {
    if (this.fromAmount.indexOf(',') === -1) {
      this.fromAmount = Number(this.fromAmount).toLocaleString('en-US', { minimumFractionDigits: 2 });
    }
  }

  removeDelimiters() {
    const re = /\,/gi; //eslint-disable-line no-useless-escape
    this.fromAmount = this.fromAmount.replace(re, '');
    this.fromAmtSize = this.maxlengthCurrenciesPipe.transform(this.fromCurrency.iso, this.fromAmount);
  }

  removeDelimitersToAmt() {
    const re = /\,/gi; //eslint-disable-line no-useless-escape
    this.toAmountValue = this.toAmountValue.replace(re, '');
  }

  isNumber(event) {
    const charCode = event.charCode;
    if (charCode > this.thirtyOne && (charCode < this.fortyThree || charCode > this.fiftySeven)) {
      return false;
    }
    return true;
  }

  fromAmtMaxlength() {
    const amtSize = this.maxlengthCurrenciesPipe.transform(this.fromCurrency.iso, this.fromAmount);
    if (this.fromCurrency.iso === this.OMR || this.fromCurrency.iso === this.BHD || this.fromCurrency.iso === this.TND ||
      this.fromCurrency.iso === this.JOD || this.fromCurrency.iso === this.KWD
      || this.fromCurrency.iso === this.LYD && amtSize > this.length11) {
      this.fromAmtSize = this.length11;
    } else if (amtSize < this.length12) {
      this.fromAmtSize = amtSize;
    } else {
      this.fromAmtSize = this.length12;
    }
  }
  deleteCards() {
    this.hideShowDeleteWidgetsService.currencyConverterCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.currencyConverterCardHideShow.subscribe(res => {
      this.hideShowCard = res;
    });
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
      JSON.parse(this.widgetDetails).widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }

   getCurrencies() {
    this.toCurrencies = FccGlobalConfiguration.configurationValues.get('CURRENCY_CONVERTER_TOCURRENCIESLIST');
    this.toCurrencies = this.toCurrencies.replace('[', '');
    this.toCurrencies = this.toCurrencies.replace(']', '');
    this.toCurrencies = this.toCurrencies.split(',');
    this.commonService.userCurrencies(this.curRequest).subscribe(
      response => {
        if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else {
        response.items.forEach(
          value => {
            const ccy: {label: string, value: any}
            = { label: value.isoCode, value: { label: value.name, iso: value.isoCode, country: value.principalCountryCode } };
            this.currency.push(ccy);
            if (response.baseCurrency === value.isoCode) {
              this.fromCurrency = { label: value.name, iso: value.isoCode, country: value.principalCountryCode };
            }
        });

        this.toCurrencies.forEach(
          value => {
            this.getCurrencyDesc(response , value.trim());

          });
        if (this.toCurrencyList[0].iso === response.baseCurrency) {
          this.toCurrency = this.toCurrencyList[1];
        } else {
          this.toCurrency = this.toCurrencyList[0];
        }
        this.calculateFromAmount();
        this.calculateToAmount();
      }
      });
   }

   getCurrencyDesc(response: any, currency: string) {
     for (let i = 0; i < response.items.length; i++) {
      if (currency === response.items[i].isoCode) {
        this.toCurrencyList.push({ label: response.items[i].name, iso: response.items[i].isoCode,
          country: response.items[i].principalCountryCode });
        break;
      }
     }
   }
}
