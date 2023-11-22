import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { ExchangeRateRequest } from '../../../model/xch-rate-request';
import { ExchangeRateService } from '../../../services/exchange-rate.service';
import { Component, Input, OnInit } from '@angular/core';
import { UserData } from '../../../model/user-data';
import { CommonService } from '../../../services/common.service';
import { CurrencyRequest } from '../../../model/currency-request';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { SessionValidateService } from '../../../services/session-validate-service';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';

@Component({
  selector: 'fcc-common-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION],
})
export class ExchangeRateComponent implements OnInit {

  currency: SelectItem[] = [];
  baseCurrency: any;
  xchRequest: ExchangeRateRequest = new ExchangeRateRequest();
  curRequest: CurrencyRequest = new CurrencyRequest();
  expandCount = 0;
  originalRateResponse: any;
  defaultCurrencies: any;
  responseCurrencies:any;
  defaultFlag = true;
  imagePath;
  exchangeRates = [];
  useMidRateValue: boolean;
  checkCustomise;
  hideShowCard;
  classCheck;
  three = 3;
  five = 5;
  ten = 10;
  dir: string = localStorage.getItem('langDir');
  dirFlagStyle;
  dirTextStyle;
  dirFieldTextStyle;
  dirDropDownStyle;
  dirTableCcyText;
  dropDownFocus = '';
  @Input() widgetDetails: any;
  nudges: any;
  tabIndex: string;
  constructor(protected xch: ExchangeRateService,
              protected commonService: CommonService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected translate: TranslateService,
              protected globalDashboardComponent: GlobalDashboardComponent,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected sessionValidation: SessionValidateService) { }

  ngOnInit() {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
    this.imagePath = this.commonService.getImagePath();
    // This should take the value of user's base currency from session
    this.xchRequest.userData = new UserData();
    this.xchRequest.userData.userSelectedLanguage = 'en';
    this.curRequest.userData = this.xchRequest.userData;
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
    this.commonService.loadDefaultConfiguration().subscribe(
      response => {
        if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else if (response) {
          this.useMidRateValue = response.useMidRate;
        }
        if (response) {
          this.defaultCurrencies = response.currencyExchangeratewidgetDisplay;
        }
    });

    this.commonService.userCurrencies(this.curRequest).subscribe(
    response => {
      if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
        this.sessionValidation.IsSessionValid();
      } else {
      response.items.forEach(
        value => {
        const ccy: {label: string, value: any} = {
          label: value.isoCode + ' - ' + this.toTitleCase(value.name),
            value: {
            label: value.name,
            iso: value.isoCode + ' - ' + this.toTitleCase(value.name),
            country: value.principalCountryCode
          }
        };
        this.currency.push(ccy);

        if (response.baseCurrency === value.isoCode) {
          this.baseCurrency = { label: value.name, iso: value.isoCode, country: value.principalCountryCode };
        }
      });
      this.getExchangeRates();
    }
    });

    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
      if (this.checkCustomise) {
        this.tabIndex = '-1';
      }
    });

    if (this.dir === 'rtl') {
      this.dirFlagStyle = 'dropdown-flag-direction';
      this.dirTextStyle = 'dropdown-text-direction';
      this.dirDropDownStyle = 'dirDropDownStyle';
      this.dirFieldTextStyle = 'field-text-direction';
      this.dirTableCcyText = 'table-ccy-text-direction';
    } else {
      this.dirFlagStyle = 'dropdown-flag';
      this.dirTextStyle = 'dropdown-text';
      this.dirFieldTextStyle = 'field-text';
      this.dirTableCcyText = 'table-ccy-text';
    }
  }

  get xchRates() {
    return this.exchangeRates;
  }

  get useMidRate() {
    return this.useMidRateValue;
  }

  calculate() {
    this.defaultFlag = false;
    this.getExchangeRates();
  }

  onFocus(){
    this.dropDownFocus = 'dropDownFocus';
  }

  onFocusout() {
    this.dropDownFocus = '';
  }

  getExchangeRates() {
    this.exchangeRates = [];
    this.responseCurrencies = [];
    this.xchRequest.fromCurrency = this.baseCurrency.iso.substring(0, this.three);
    this.xch.getExchangeRate(this.fccGlobalConstantService.getExchangeRateUrl(), this.xchRequest).subscribe(
      response => {
        if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else {
        response.exchangeRatesResponseData.forEach(
          value => {
            this.responseCurrencies.push(value.currencyCode);
        });

        this.originalRateResponse = response.exchangeRatesResponseData;
        this.defaultCurrencies.forEach(
          value => {
            const ind = this.responseCurrencies.indexOf(value);
            if (ind !== -1 && this.exchangeRates.length < 5) {
              this.exchangeRates.push(this.originalRateResponse[ind]);
            }
        });

        const temp = this.originalRateResponse;
        temp.slice(0, this.five).forEach(
          element => {
            if (this.exchangeRates.length < 5) {
              this.exchangeRates.push(element);
            }
        });
        this.expandCount = 0;
      }
      }
    );
  }

  getMoreCurrencies() {
    this.expandCount++;
    const temp = this.originalRateResponse;
    if (this.expandCount === 1) {
      if (this.defaultCurrencies.length > this.five) {
        this.defaultCurrencies.slice(this.five).forEach(
          value => {
            const ind = this.responseCurrencies.indexOf(value);
            if (ind !== -1 && this.exchangeRates.length < 10) {
              this.exchangeRates.push(this.originalRateResponse[ind]);
            }
        });
      }
      temp.slice(0, this.ten).forEach(
        element => {
          if (this.exchangeRates.indexOf(element) === -1 && this.exchangeRates.length < 10) {
            this.exchangeRates.push(element);
          }
      });
    }
  }

  getDefaultCurrencies() {
    this.exchangeRates = this.exchangeRates.slice(0, this.five);
    this.expandCount = 0;
  }

  toTitleCase(value) {
    return value.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  deleteCards() {
      this.hideShowDeleteWidgetsService.currentExchangeRateCardHideShow.next(true);
      this.hideShowDeleteWidgetsService.currentExchangeRateCardHideShow.subscribe(res => {
        this.hideShowCard = res;
      });
      setTimeout(() => {
        this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
        JSON.parse(this.widgetDetails).widgetPosition);
        this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
      } , FccGlobalConstant.DELETE_TIMER_INTERVAL);
    }
    onKeyUp(e) {
      const keycode = e.keyCode;
      if (keycode === FccGlobalConstant.LENGTH_13) {
        this.getExchangeRates();
      }
    }

}
