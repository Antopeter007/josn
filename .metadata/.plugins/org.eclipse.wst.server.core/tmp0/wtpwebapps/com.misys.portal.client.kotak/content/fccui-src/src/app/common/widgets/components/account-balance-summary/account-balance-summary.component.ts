import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../../../common/services/common.service';
import { AccountsSummaryService } from '../../../../common/services/accounts-summary.service';
import { HideShowDeleteWidgetsService } from '../../../../common/services/hide-show-delete-widgets.service';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { GlobalDashboardComponent } from '../../../../common/components/global-dashboard/global-dashboard.component';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { CurrencyAbbreviationPipe } from '../../../pipes/currency-abbreviation.pipe';
import { TransactionsListdefComponent } from '../../../../common/components/transactions-listdef/transactions-listdef.component';
import { ViewChild } from '@angular/core';
import { NudgesService } from '../../../../common/services/nudges.service';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { Router } from '@angular/router';
import { AmountMaskPipe } from '../../../pipes/amount-mask.pipe';
import { FccConstants } from '../../../core/fcc-constants';
import { CurrencyConverterPipe } from '../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-balance-summary',
  templateUrl: './account-balance-summary.component.html',
  styleUrls: ['./account-balance-summary.component.scss']
})
export class AccountBalanceSummaryComponent implements OnInit {
  test: any;
  category = '';
  viewAllurl: string;
  amtBalanceFilterValues = '';
  entityName = '';
  currCode = '';
  innerArray: any[] = [];
  categoriesList: any[] = [];
  widgets: any;
  @Input()
  widgetDetails: any;
  widgetConfigData: any;
  classCheck: any;
  checkCustomise: any;
  hideShowCard: any;
  accountsSummaryData: any[] = [];
  categoryAccountTypes: any[] = [];
  tabs: any[] = [];
  inputParams: any = {};
  invokeList = false;
  viewInText = '';
  viewInCurrency = '';
  onLoadTab = false;
  filterValues: any = {};
  @ViewChild('transactionListdef') transactionsListdefComponent: TransactionsListdefComponent;
  currentCategoryTab: any;
  public spinnerShow = new BehaviorSubject(false);
  dir = localStorage.getItem('langDir');
  widgetTitle = '';
  filterFormDataObj: any;
  nudges: any[] = [];
  nudgesRequired: any;
  widgetConfig: any;
  contextPath: any;
  currencyList = [];
  accountCCY = '';
  renderGraph = false;
  showFilterText = false;
  showFilterIcon = false;
  eyeEnable = false;
  showEye = false;
  grphImage;
  listImage;
  showDownloadBtn: boolean;
  currencyType: any;
  subscriptions: Subscription[] = [];

  constructor(protected accountsSummaryService: AccountsSummaryService,
              protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected globalDashboardComponent: GlobalDashboardComponent,
              protected translateService: TranslateService,
              protected changedetector: ChangeDetectorRef,
              protected router: Router,
              protected nudgesService: NudgesService,
              protected currencyAbbreviation: CurrencyAbbreviationPipe,
              protected amountMask: AmountMaskPipe,
              protected currencyConverterPipe: CurrencyConverterPipe) { }

  ngOnInit(): void {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.grphImage = this.contextPath + '/content/FCCUI/assets/images/Graph.svg';
    this.listImage = this.contextPath + '/content/FCCUI/assets/images/List.svg';
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.showDownloadBtn = this.commonService.isnonEMptyString(this.widgets.widgetConfig.tableConfig) ?
           this.widgets.widgetConfig.tableConfig[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] : false;
    if (this.commonService.isNonEmptyValue(this.widgets.widgetConfig)) {
      this.widgetConfigData = JSON.parse(this.widgets.widgetConfig);
      Object.keys(this.widgetConfigData.tableConfig).forEach(element => {
        this.inputParams[element] = this.checkForBooleanValue(this.widgetConfigData.tableConfig[element]);
        this.category = JSON.stringify(this.widgetConfigData.accountSummaryDetails);
        this.inputParams.isViewMore = this.widgetConfigData.tableConfig.isViewMore;
        this.inputParams.filterText = this.widgetConfigData.tableConfig.filterText;
       });
      if (this.inputParams.filterText === 'true') {
        this.showFilterText = true;
      } else {
        this.showFilterIcon = true;
      }
      }
    this.nudgesRequired = this.commonService.isNonEmptyValue(this.widgetConfigData.enableNudges) ?
      this.widgetConfigData.enableNudges : false;
    if (this.nudgesRequired && this.commonService.isNonEmptyValue(this.widgets.widgetConfig)) {
      this.nudgesService.getNudges(this.widgets.widgetConfig).then(data => {
        this.nudges = data.nudgetList ? data.nudgetList : [];
      });
    }

    this.viewInCurrency = this.commonService.getBaseCurrency();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.currencyList = response.equivalentCurrencyList;
      }
    });

    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });

    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });

    this.viewInText = `${this.translateService.instant(FccGlobalConstant.VIEW_IN_TEXT)}`;
    this.widgetTitle = `${this.translateService.instant(this.widgets.widgetName)}`;
    this.loadConfigurationNdEnableEye();
    this.invokeAccountSummaryAPI();
  }

  loadConfigurationNdEnableEye() {
    this.commonService.getConfiguredValues(FccGlobalConstant.GLOBAL_MASKING_PROPERTY).subscribe(response => {
      if (response.response && response.response === 'REST_API_SUCCESS') {
        if (response[FccGlobalConstant.GLOBAL_MASKING_PROPERTY] === 'true') {
          this.showEye = true;
          this.eyeEnable = true;
        } else {
          this.showEye = false;
          this.eyeEnable = false;
        }
        this.commonService.isEyeIconClicked(this.eyeEnable);
       }
    });
  }

  checkEyeEnable() {
    if (this.eyeEnable) {
      this.eyeEnable = false;
      this.accountsSummaryData = [];
      this.categoriesList = [];
      this.invokeAccountSummaryAPI();
      this.commonService.isEyeIconClicked(false);
    } else {
      this.eyeEnable = true;
      this.commonService.isEyeIconClicked(true);
    }
  }

  deleteCards() {
    this.hideShowDeleteWidgetsService.listdefCommonComp.next(true);
    this.hideShowDeleteWidgetsService.listdefCommonComp.subscribe(
      res => {
        this.hideShowCard = res;
      }
    );
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(this.widgets.widgetName, this.widgets.widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(this.widgets.widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }


  clicked(val: any) {
    this.innerArray = [];
    Object.values(val).forEach((array: any) => {
      array.forEach((value: any) => {
        this.innerArray.push(value);
      });
    });
  }

  onSelectCategory(vals: any) {
    this.categoryAccountTypes = [];
    this.invokeList = false;
    this.onLoadTab = true;
    let i = 0;
    this.categoriesList.forEach(elem => {
      if (this.commonService.isnonEMptyString(elem.amount)) {
        elem.amount = this.currencyConverterPipe.transform(this.commonService.replaceCurrency(elem.amount.toString()),
        this.viewInCurrency);
      }
      if (vals.category === elem.category) {
        elem.selected = true;
        if (this.onLoadTab === true) {
          const tabEvent: any = {};
          tabEvent.index = 0;
          this.onSelection(tabEvent);
          this.onLoadTab = false;
        }
      } else {
        elem.selected = false;
      }
    });
    this.accountsSummaryData.forEach((data: any) => {
      data.accountType.forEach((accountType: any) => {
        if (vals.category === accountType.category) {
          if (Object.keys(accountType).indexOf('accountTypeCode') > -1) {
            const acctTypeName = `${this.translateService.instant('accountTypeCode_' + accountType.accountTypeCode)}`;
            const displayname = this.currencyAbbreviation.transform(accountType.totalAccountTypeBalance);
            this.categoryAccountTypes.push({
              accountTypeName: acctTypeName,
              accountTypeCode: accountType.accountTypeCode,
              accountTypeBalance: accountType.totalAccountTypeBalance,
              accountTypeIndex: i,
              selectedTab: false,
              accountTypeDisplayName: displayname
            });
            i++;
          }
        }
      });
    });
  }

  onSelection(event: any) {
    this.currentCategoryTab = event;
    this.invokeList = false;
    this.changedetector.detectChanges();
    this.categoryAccountTypes.forEach(element => {
      if (event.index === element.accountTypeIndex) {
        this.filterValues.account_type = element.accountTypeCode;
        this.inputParams.filterFormDataObj = this.filterFormDataObj;
        this.inputParams.filterParams = this.filterValues;
        this.inputParams.accountType = element.accountTypeCode;
        this.inputParams.accountCcy = this.viewInCurrency;
        this.inputParams.filterChipsRequired = true;
        this.invokeList = true;
      }
    });
  }

  setClass(vals: any) {
    let classType = '';
    if (vals.selected === true) {
      classType = this.dir === 'rtl' ? 'rtlWith-Background' : 'with-background';
      this.currencyType = 'currencyTypeActive';
    } else {
      classType = this.dir === 'rtl' ? 'rtlWithout-Background' : 'without-background';
      this.currencyType = 'currencyTypeInactive';
    }
    return classType;
  }


  callfilterData(event: any) {
    this.transactionsListdefComponent.filterData(event);
  }

  retrieveFilterParams(event: any) {
    if (event && event.value) {
      const filterParams = event.value;
      if (filterParams.favourite === 'all') {
        filterParams.favourite = '';
      }
      const transformedParameters = {};
      Object.keys(filterParams).forEach(element => {
        if (filterParams[element] instanceof Array) {
          const pipedValue = filterParams[element].toString().replaceAll(',', '|');
          transformedParameters[event.controls[element][FccGlobalConstant.PARAMS].srcElementId] = pipedValue;
        } else {
          transformedParameters[event.controls[element][FccGlobalConstant.PARAMS].srcElementId] = filterParams[element];
        }
      });
      this.filterValues = transformedParameters;
      this.filterFormDataObj = event;
      this.callApiAgain(this.filterValues);
    }
  }

  getFilterChipResetEvent(event: any){
    const control = event?.controlName;
    if(control){
      delete(this.filterValues[control]);
    }else{
      this.filterValues = {};
    }
    this.callApiAgain(this.filterValues);
  }
  callApiAgain(filterValues: any) {
    this.entityName = filterValues.entity;
    this.currCode = filterValues.cur_code;
    this.accountsSummaryData = [];
    this.categoriesList = [];
    this.invokeAccountSummaryAPI();
  }

  invokeAccountSummaryAPI() {
    this.accountCCY = this.viewInCurrency;
    const listdefName = this.inputParams[FccGlobalConstant.LISTDEF_NAME];
    const filterValues = {};
    filterValues[FccConstants.MASKING] = this.eyeEnable ? this.eyeEnable : false;
    if (this.viewInCurrency) {
      filterValues[FccGlobalConstant.ACCOUNT_CURRENCY] = this.viewInCurrency;
    }
    if (this.entityName) {
      filterValues[FccGlobalConstant.ENTITY] = this.entityName;
    }
    if (this.currCode) {
      filterValues[FccGlobalConstant.CUR_CODE] = this.currCode;
    }
    this.amtBalanceFilterValues = JSON.stringify(filterValues);
    this.accountsSummaryService.getAccountDetailsSummary(listdefName, this.category,
      this.amtBalanceFilterValues).then(response => {
      if (response) {
        const categoryListEntries = response.totalCategoryAmount;
        this.accountsSummaryData = response.accountTypeList;
        categoryListEntries.forEach(element => {
          element.selected = false;
          this.categoriesList.push(element);
        });
        this.categoriesList[0].selected = true;

        this.onSelectCategory(this.categoriesList[0]);
        this.onSelection(this.categoriesList[0]);
      }
    });
  }

  checkForBooleanValue(value: string) {
    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return value;
    }
  }

  onClickViewAll() {
    this.subscriptions.push(
      this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response && response.angularAccountScreens && response.angularAccountScreens.length > 0 &&
          response.angularAccountScreens.indexOf(FccConstants.ALL_ACCOUNTS) >= 0) {
          this.viewAllurl = this.widgetConfigData?.tableConfig?.viewAll;
        } else {
          this.viewAllurl = 'AccountBalanceScreen?operation=LIST_BALANCES';
        }
        this.commonService.redirectToLink(this.viewAllurl, this.filterFormDataObj?.value);
      })
    );
  }

  onCurrencyChange($event) {
    if ($event.value) {
      this.viewInCurrency = $event.value;
      this.accountsSummaryData = [];
      this.categoriesList = [];
      this.invokeAccountSummaryAPI();
    }
  }
  toggleDisplay(event) {
    this.renderGraph = event;
  }
}
