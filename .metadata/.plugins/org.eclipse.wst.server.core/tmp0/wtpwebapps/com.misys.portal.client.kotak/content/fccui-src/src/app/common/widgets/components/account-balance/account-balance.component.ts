import { FccConstants } from './../../../core/fcc-constants';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { CommonService } from '../../../services/common.service';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { CurrencyConversionRequest } from '../../../model/currency-conversion-request';
import { Router, ActivatedRoute } from '@angular/router';
import { UserData } from '../../../model/user-data';
import { CurrencyRequest } from '../../../model/currency-request';
import { CurrencyConversionService } from '../../../services/currency-conversion.service';
import { DecimalPipe } from '@angular/common';
import { SessionValidateService } from '../../../services/session-validate-service';
import { MessageService } from 'primeng/api';
import { CustomCommasInCurrenciesPipe } from './../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fcc-common-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class AccountBalanceComponent implements OnInit {
  userFirstName = '';
  start = '';
  count = '';
  currency = [];
  baseCurrency: string;
  amountInBaseCurrency: string;
  decimalAmountInBaseCurrency: string;
  ccRequest: CurrencyConversionRequest = new CurrencyConversionRequest();
  curRequest: CurrencyRequest = new CurrencyRequest();
  toCurrency: any = { iso: 'GBP', country: 'gb' };
  checkCustomise;
  hideShowCard;
  classCheck;
  dojoUrl;
  contextPath: any;
  url = '';
  langDir: string = localStorage.getItem('langDir');
  totalAmount: any;
  totalAmountDecimal: any;
  globalBaseCurrency: any;
  globalBaseCurrencyAmount: any;
  dirDropDownStyle;
  @Input() widgetDetails: any;
  nudges: any;
  hasAccountAccess: boolean;
  currencySymbolDisplayEnabled = false;
  subscriptions: Subscription[] = [];

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected commonService: CommonService,
    protected globalDashboardComponent: GlobalDashboardComponent,
    protected dashboardService: DashboardService,
    protected messageService: MessageService,
    protected cc: CurrencyConversionService,
    protected dp: DecimalPipe,
    protected sessionValidation: SessionValidateService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe
  ) { }

  ngOnInit() {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
    this.ccRequest.userData = new UserData();
    this.ccRequest.userData.userSelectedLanguage = 'en';
    this.contextPath = this.commonService.getContextPath();
    const language = localStorage.getItem('language');

    this.dashboardService.getUserDetails().subscribe(
      data => {
        this.userFirstName = data.firstName;
      },
      () => {
        //eslint : no-empty-function
      }
    );

    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P809).subscribe(
      (response) => {
        if (this.commonService.isNonEmptyValue(response) && this.commonService.isNonEmptyValue(response.paramDataList)
        && response.paramDataList[0]) {
          this.currencySymbolDisplayEnabled = response.paramDataList[0][FccGlobalConstant.DATA_1] === 'y';
        }
      }
    );
    this.dashboardService
      .getAccountBalance(this.start, this.count)
      .subscribe(
        data => {
          if (data.errorMessage && (data.errorMessage === 'SESSION_INVALID' || data.errorMessage === 'USER_NOT_AUTHORISED')) {
            this.sessionValidation.IsSessionValid();
          } else if (data.response && data.response === 'REST_API_SUCCESS') {
            if (data.totalAccountBalanceBasedOnCurrency.length === 0) {
              this.hasAccountAccess = false;
            } else {
              if (language === 'fr') {
                this.amountInBaseCurrency = data.totalAccountBalanceOnBaseCurrency.amount.split(
                  ','
                )[0];
                if (
                  data.totalAccountBalanceOnBaseCurrency.amount.indexOf(',') > -1
                ) {
                  this.decimalAmountInBaseCurrency =
                    ',' +
                    data.totalAccountBalanceOnBaseCurrency.amount.split(',')[1];
                }
                this.totalAmount = data.totalAccountBalanceOnBaseCurrency.amount;
                if (this.totalAmount.indexOf(',') > -1) {
                  this.totalAmountDecimal = ',' + this.totalAmount.split(',')[1];
                }
                else {
                  this.totalAmountDecimal = '';
                }
                this.totalAmount = this.totalAmount.split(',')[0];
              } else if (language === 'ar') {
                this.amountInBaseCurrency = data.totalAccountBalanceOnBaseCurrency.amount.split(
                  '٫'
                )[0];
                if (
                  data.totalAccountBalanceOnBaseCurrency.amount.indexOf('٫') > -1
                ) {
                  this.decimalAmountInBaseCurrency =
                    '٫' +
                    data.totalAccountBalanceOnBaseCurrency.amount.split('٫')[1];
                }
                this.totalAmount = data.totalAccountBalanceOnBaseCurrency.amount;
                if (this.totalAmount.indexOf('٫') > -1) {
                  this.totalAmountDecimal = '٫' + this.totalAmount.split('٫')[1];
                }
                else {
                  this.totalAmountDecimal = '';
                }
                this.totalAmount = this.totalAmount.split('٫')[0];
              } else {
                this.amountInBaseCurrency = data.totalAccountBalanceOnBaseCurrency.amount.split(
                  '.'
                )[0];
                if (
                  data.totalAccountBalanceOnBaseCurrency.amount.indexOf('.') > -1
                ) {
                  this.decimalAmountInBaseCurrency =
                    '.' +
                    data.totalAccountBalanceOnBaseCurrency.amount.split('.')[1];
                }
                this.totalAmount = data.totalAccountBalanceOnBaseCurrency.amount;
                if (this.totalAmount.indexOf('.') > -1) {
                  this.totalAmountDecimal = '.' + this.totalAmount.split('.')[1];
                }
                else {
                  this.totalAmountDecimal = '';
                }
                this.totalAmount = this.totalAmount.split('.')[0];
              }
              this.baseCurrency = data.totalAccountBalanceOnBaseCurrency.currencyCode;
              this.toCurrency = data.totalAccountBalanceOnBaseCurrency.currencyCode;
              this.totalAmount = this.currencySymbolDisplayEnabled ?
              this.commonService.getCurrencySymbolForDownloads(this.toCurrency, this.totalAmount) : this.totalAmount;
              const ccy: { label: string; value: any } = {
                label: data.totalAccountBalanceOnBaseCurrency.currencyCode,
                value: data.totalAccountBalanceOnBaseCurrency.currencyCode
              };
              this.currency.push(ccy);
              if (data.totalAccountBalanceBasedOnCurrency.length > 0) {
                data.totalAccountBalanceBasedOnCurrency.forEach(value => {
                  if (
                    data.totalAccountBalanceOnBaseCurrency.currencyCode !==
                    value.currencyCode
                  ) {
                    const Ccy: { label: string; value: any } = {
                      label: value.currencyCode,
                      value: value.currencyCode
                    };
                    this.currency.push(Ccy);
                  }
                });
              }
              this.hasAccountAccess = true;
            }
          }
        },
        () => {
          //eslint : no-empty-function
        }
      );
    if (this.langDir === 'rtl') {
      this.dirDropDownStyle = 'dirDropDownStyle';
    }
  }

  calculateAmount() {
    this.ccRequest.fromCurrency = this.baseCurrency;
    this.ccRequest.toCurrency = this.toCurrency;
    const language = localStorage.getItem('language');
    if (this.decimalAmountInBaseCurrency !== undefined) {
      this.dashboardService
        .getAccountBalance(this.start, this.count)
        .subscribe(
          data => {
            if (data.errorMessage && (data.errorMessage === 'SESSION_INVALID' || data.errorMessage === 'USER_NOT_AUTHORISED')) {
              this.sessionValidation.IsSessionValid();
            } else if (data.response && data.response === 'REST_API_SUCCESS') {
              this.globalBaseCurrency = data.totalAccountBalanceOnBaseCurrency.currencyCode;
              this.globalBaseCurrencyAmount = data.totalAccountBalanceOnBaseCurrency.amount;
            }
          });

      if (this.globalBaseCurrencyAmount !== undefined) {
        if (language === 'fr') {
          this.globalBaseCurrencyAmount = this.globalBaseCurrencyAmount.replace(/\s/g, '').replace(/,/g, '.');
        } else if (language === 'ar') {
          this.globalBaseCurrencyAmount = this.globalBaseCurrencyAmount.replace(/٬/g, '').replace(/٫/g, '.');
        } else {
          this.globalBaseCurrencyAmount = this.globalBaseCurrencyAmount.replace(/,/g, '');
        }
        this.ccRequest.fromCurrencyAmount = this.globalBaseCurrencyAmount;
      } else {
        if (language === 'fr') {
          this.amountInBaseCurrency = this.amountInBaseCurrency.replace(/\s/g, '').replace(/,/g, '.');
        } else if (language === 'ar') {
          this.amountInBaseCurrency = this.amountInBaseCurrency.replace(/٬/g, '').replace(/٫/g, '.');
        } else {
          this.amountInBaseCurrency = this.amountInBaseCurrency.replace(/,/g, '');
        }
        this.ccRequest.fromCurrencyAmount = this.amountInBaseCurrency;
      }
      this.cc
        .getConversion(
          this.fccGlobalConstantService.getCurrencyConverterUrl(),
          this.ccRequest
        )
        .subscribe(response => {
          if (
            response.errorMessage &&
            response.errorMessage === 'SESSION_INVALID'
          ) {
            this.sessionValidation.IsSessionValid();
          } else {
            if (language === 'fr') {
              this.amountInBaseCurrency = response.toCurrencyAmount.split(',')[0];
              if (response.toCurrencyAmount.indexOf(',') > -1) {
                this.decimalAmountInBaseCurrency =
                  ',' + response.toCurrencyAmount.split(',')[1];
              } else {
                this.decimalAmountInBaseCurrency = '';
              }
              if (this.globalBaseCurrency === this.toCurrency) {
                this.totalAmount = this.globalBaseCurrencyAmount.split(',')[0];
                if (this.globalBaseCurrencyAmount.indexOf(',') > -1) {
                  this.totalAmountDecimal = ',' + this.globalBaseCurrencyAmount.split(',')[1];
                } else {
                  this.totalAmountDecimal = '';
                }
              } else {
                this.totalAmount = this.amountInBaseCurrency + this.decimalAmountInBaseCurrency;
                if ((this.amountInBaseCurrency + this.decimalAmountInBaseCurrency).indexOf(',') > -1) {
                  this.totalAmountDecimal = ',' + (this.totalAmount).split(',')[1];
                } else {
                  this.totalAmountDecimal = '';
                }
                this.totalAmount = this.totalAmount.split(',')[0];
              }
              this.baseCurrency = this.toCurrency;
            } else if (language === 'ar') {
              this.amountInBaseCurrency = response.toCurrencyAmount.split('٫')[0];
              if (response.toCurrencyAmount.indexOf('٫') > -1) {
                this.decimalAmountInBaseCurrency =
                  '٫' + response.toCurrencyAmount.split('٫')[1];
              } else {
                this.decimalAmountInBaseCurrency = '';
              }
              if (this.globalBaseCurrency === this.toCurrency) {
                this.totalAmount = this.globalBaseCurrencyAmount.split('٫')[0];
                if (this.globalBaseCurrencyAmount.indexOf('٫') > -1) {
                  this.totalAmountDecimal = '٫' + this.globalBaseCurrencyAmount.split('٫')[1];
                } else {
                  this.totalAmountDecimal = '';
                }
              } else {
                this.totalAmount = this.amountInBaseCurrency + this.decimalAmountInBaseCurrency;
                if ((this.amountInBaseCurrency + this.decimalAmountInBaseCurrency).indexOf('٫') > -1) {
                  this.totalAmountDecimal = '٫' + (this.totalAmount).split('٫')[1];
                } else {
                  this.totalAmountDecimal = '';
                }
                this.totalAmount = this.totalAmount.split('٫')[0];
              }
              this.baseCurrency = this.toCurrency;

            } else {
              this.amountInBaseCurrency = response.toCurrencyAmount.split('.')[0];
              if (response.toCurrencyAmount.indexOf('.') > -1) {
                this.decimalAmountInBaseCurrency =
                  '.' + response.toCurrencyAmount.split('.')[1];
              } else {
                this.decimalAmountInBaseCurrency = '';
              }
              if (this.globalBaseCurrency === this.toCurrency) {
                this.totalAmount = this.globalBaseCurrencyAmount.split('.')[0];
                if (this.globalBaseCurrencyAmount.indexOf('.') > -1) {
                  this.totalAmountDecimal = '.' + this.globalBaseCurrencyAmount.split('.')[1];
                } else {
                  this.totalAmountDecimal = '';
                }
              } else {
                this.totalAmount = this.amountInBaseCurrency + this.decimalAmountInBaseCurrency;
                if ((this.amountInBaseCurrency + this.decimalAmountInBaseCurrency).indexOf('.') > -1) {
                  this.totalAmountDecimal = '.' + (this.totalAmount).split('.')[1];
                } else {
                  this.totalAmountDecimal = '';
                }
                this.totalAmount = this.totalAmount.split('.')[0];
              }
              this.baseCurrency = this.toCurrency;
            }
          }
        });
    }
  }

  allAccounts() {
    this.subscriptions.push(
      this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response) {
          let url = '';
          const enableFccui = response.enableFccui;
          const enableUxaddon = response.enableUxaddon;
          const angularAccountScreens = response.angularAccountScreens;
          if (enableFccui && (enableUxaddon || !enableUxaddon) && angularAccountScreens &&
          angularAccountScreens.length > 0 && angularAccountScreens.indexOf(FccConstants.ALL_ACCOUNTS) >= 0) {
            url = FccConstants.ACCOUNT_SUMMARY_URL;
          } else {
            url = 'AccountBalanceScreen?operation=LIST_BALANCES';
          }
          this.commonService.redirectToLink(url);
        }
      })
    );
  }

  deepLinkingUrlConfig() {
    this.commonService.getHyperLinks('view_all_accounts').then(data => {
      this.commonService.navigateToLink(data[0]);
    });
  }

  deleteCards() {
    this.hideShowDeleteWidgetsService.accountBalanceCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.accountBalanceCardHideShow.subscribe(
      res => {
        this.hideShowCard = res;
      }
    );
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
        JSON.parse(this.widgetDetails).widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }
}
