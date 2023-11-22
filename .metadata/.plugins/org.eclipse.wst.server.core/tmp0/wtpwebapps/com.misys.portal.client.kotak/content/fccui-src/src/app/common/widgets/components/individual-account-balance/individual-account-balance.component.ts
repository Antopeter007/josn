import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { SessionValidateService } from './../../../services/session-validate-service';
import { DashboardService } from './../../../services/dashboard.service';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { CommonService } from './../../../services/common.service';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { Component, Input, OnInit } from '@angular/core';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';
import { FccGlobalConstantService } from '../../../../common/core/fcc-global-constant.service';
import { Router } from '@angular/router';
import { FccGlobalConfiguration } from '../../../core/fcc-global-configuration';
import { TranslateService } from '@ngx-translate/core';
import { CustomCommasInCurrenciesPipe } from './../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FccConstants } from './../../../core/fcc-constants';

@Component({
  selector: 'fcc-common-individual-account-balance',
  templateUrl: './individual-account-balance.component.html',
  styleUrls: ['./individual-account-balance.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class IndividualAccountBalanceComponent implements OnInit {
  title = 'currencyWiseAccountBalance';
  accountBalanceBasedOnCurrency: any[] = [];
  configuredKeysList = 'ROW_DISPLAY_INCURRENCY_WISE_ACCOUNTBALANCE,MAXIMUM_DIGITS_DISPLAY_INAMOUNT';
  maxCurrencyRow;
  hasAccountAccess: boolean;
  checkCustomise;
  hideShowCard;
  classCheck;
  keysNotFoundList: any[] = [];
  dojoUrl = '';
  contextPath: any;
  url = '';
  langDir: string = localStorage.getItem('langDir');
  @Input() widgetDetails;
  nudges: any;
  deepLinking: any;
  isAmountConfigured: boolean;
  currencySymbolDisplayEnabled = false;
  dataList: any;

  constructor(protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected globalDashboardComponent: GlobalDashboardComponent,
    protected commonService: CommonService,
    protected dashboardService: DashboardService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected sessionValidation: SessionValidateService,
    protected router: Router,
    protected fccGlobalConfiguration: FccGlobalConfiguration,
    protected translateService: TranslateService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe) { }

  ngOnInit() {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
    this.getProperties();
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
    this.contextPath = this.commonService.getContextPath();
    this.commonService.setFooterSticky(true);
    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P809).subscribe(
      (response) => {
        if (this.commonService.isNonEmptyValue(response) && this.commonService.isNonEmptyValue(response.paramDataList)
        && response.paramDataList[0]) {
          this.currencySymbolDisplayEnabled = response.paramDataList[0][FccGlobalConstant.DATA_1] === 'y';
        }
      }
    );
  }

  getAccountBalance() {
    this.dashboardService
      .getAccountBalance(null, null)
      .subscribe(
        responseData => {
          if (
            responseData.errorMessage &&
            responseData.errorMessage === 'SESSION_INVALID'
          ) {
            this.sessionValidation.IsSessionValid();
          } else if (
            responseData.response &&
            responseData.response === 'REST_API_SUCCESS'
          ) {
            if (responseData.totalAccountBalanceBasedOnCurrency.length === 0) {
              this.hasAccountAccess = false;
            } else {
              this.dataList = responseData.totalAccountBalanceBasedOnCurrency;
              responseData.totalAccountBalanceBasedOnCurrency
                .slice(0, this.maxCurrencyRow)
                .forEach(item => {
                  const amountBeforeDecimal= item.amount;
                  this.accountBalanceBasedOnCurrency.push({
                    ccy: item.currencyCode,
                    amount: this.currencySymbolDisplayEnabled ? this.commonService.getCurrencySymbolForDownloads(
                      item.currencyCode, amountBeforeDecimal) : amountBeforeDecimal,
                    decimal: ''
                  });
                });
              this.hasAccountAccess = true;
            }
          }
        },
        () => {
          //eslint : no-empty-function
        }
      );
      this.getClass();
  }

  getClass() {
  let viewAllClass;
    if(this.dataList && this.dataList.length === 1) {
      viewAllClass = this.langDir === 'rtl' ? 'view-all-link-single-rtl' : 'view-all-link-single';
    } else {
      viewAllClass = this.langDir === 'rtl' ? 'view-all-links-multiple-rtl' :'view-all-links-multiple';
    }
    return viewAllClass;
  }

  getProperties() {
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response.response && response.response === 'REST_API_SUCCESS') {
          this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
          this.updateValues();
        }
      });
    } else {
      this.updateValues();
    }
  }

  updateValues() {
    this.maxCurrencyRow = +FccGlobalConfiguration.configurationValues.get('MAXIMUM_DIGITS_DISPLAY_INAMOUNT');
    this.getAccountBalance();
  }

  viewAll() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        const enableFccui = response.enableFccui;
        const enableUxaddon = response.enableUxaddon;
        if (enableFccui && (enableUxaddon || !enableUxaddon)) {
          const angularUrl = FccConstants.ACCOUNT_SUMMARY_URL;
          window.scroll(0, 0);
          this.router.navigateByUrl(angularUrl);
        } else {
          sessionStorage.setItem('dojoAngularSwitch', 'true');
          this.dojoUrl = '';
          if (this.contextPath !== null && this.contextPath !== '') {
            this.dojoUrl = this.contextPath;
          }
          this.dojoUrl = `${this.dojoUrl}${this.fccGlobalConstantService.servletName}/screen/AccountBalanceScreen?operation=LIST_BALANCES`;
          this.router.navigate([]).then(() => {
            window.open(this.dojoUrl, '_self');
          });
        }
      }
    });
  }

  deleteCards() {
    this.hideShowDeleteWidgetsService.IndividualAccountCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.IndividualAccountCardHideShow.subscribe(res => {
      this.hideShowCard = res;
    });
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
        JSON.parse(this.widgetDetails).widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }
}
