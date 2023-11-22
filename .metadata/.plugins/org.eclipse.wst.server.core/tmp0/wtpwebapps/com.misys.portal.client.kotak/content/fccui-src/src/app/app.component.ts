import { DateAdapter } from '@angular/material/core';
import { FccGlobalConstant } from './common/core/fcc-global-constants';
import { CheckTimeoutService } from './common/services/check-timeout-service';
import { CommonService } from './common/services/common.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConfiguration } from './common/core/fcc-global-configuration';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';
import { ResolverService } from './common/services/resolver.service';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { UtilityService } from './corporate/trade/lc/initiation/services/utility.service';
import { CustomHeaderService } from './custom-header.service';
import { FormControlResolverService } from './shared/FCCform/form-controls/form-control-resolver/form-control-resolver.service';
import { StaticTranslateLoader } from './common/core/StaticTranslateLoader';
import { EncryptionService } from './common/services/encrypt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent implements OnInit {
  title = 'FCCUI';
  hideHeaderFooterUrlArray;
  dir: string;
  footerStatus;
  isSideMenuVisible = false;
  getBrowserLanguage: string;
  userSelectedLanguage: any;
  public languageOf: string;
  currentRouterUrl: string;
  topMenuDisplay: string;
  languageDojo: string;
  dojoSelectedLanguage: any;
  redirectUrl: string;
  keysNotFoundList: any[] = [];
  // eslint-disable-next-line max-len
  configuredKeysList = 'SESSION_IDLE_TIME_OUT,ENABLE_RIGHT_CLICK,SESSION_TIME_OUT,SESSION_MAX_DURATION,SESSION_MAX_DURATION_ALERT,SHOW_COMMON_ERRORPAGE,'
                        + 'INTERCEPTOR_RETRY,ERROR_LIST,AVAILABLE_LANGUAGES,LANGUAGE,CLIENT_LOCALIZATION,LOCALIZATION_DISPLAY_KEYS,'
                        + 'FETCH_RECORD_DAYS';
  sessionIdleTimeOut: any;
  sessionTimeOut: any;
  availableLanguages;
  sessionMaxDuration: any;
  sessionMaxDurationAlert: any;
  titleKey: any;
  mainTitleKey: any;
  globalDashboardUrl; any;
  hideSideNavArray = ['/login', '/logout', '/change-password', '/landing', '/productScreen',
                    '/terms-and-condition', '/login-mfa', '/error',
                    '/retrieve', '/submitResponse', '/view', '/billView'];
  isShowCustomHeader = false;
/* eslint-disable */
  enableContextMenu: boolean;
/* tslint:disable */
  constructor( public translate: TranslateService, public router: Router, protected commonService: CommonService,
               protected fccGlobalConfiguration: FccGlobalConfiguration, protected checkTimeoutService: CheckTimeoutService,
               protected activatedRoute: ActivatedRoute, protected titleService: Title, protected customHeaderService: CustomHeaderService,
               public dateAdapter: DateAdapter<any>, protected resolverService: ResolverService,protected utilityService: UtilityService,
               protected formControlResolver: FormControlResolverService,
               @Inject(DOCUMENT) public document: any, protected metaService: Meta, protected encryptionService:EncryptionService) {
                this.addTag();
                this.commonService.getDashboardUrl();
        sessionStorage.setItem('globalDashboardUrl', this.commonService.globalDashboardUrl);
    if ('grecaptcha' in window) {
      delete window.grecaptcha;
    }
    StaticTranslateLoader.setTranslationService(translate);
    this.setRedirectionUrl();
    this.navigateToHomePage();
    this.setCurrentRouterUrl();
    this.routesinit();
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response.response && response.response === 'REST_API_SUCCESS') {
          this.fccGlobalConfiguration.addConfigurationValues(
            response,
            this.keysNotFoundList
          );
          sessionStorage.setItem('clientLocalization',response.CLIENT_LOCALIZATION);

          this.updateValues();
            // this.checkTimeoutService.idleTimeOut(response.SESSION_IDLE_TIME_OUT, response.SESSION_TIME_OUT);
            // this.checkTimeoutService.sessionDurationTimeout(response.SESSION_MAX_DURATION_ALERT, response.SESSION_MAX_DURATION);
        }
      });
    } else {
      this.updateValues();
    }
  }



  setRedirectionUrl(){
    const nextScreen = 'NEXT_SCREEN';
    this.redirectUrl = window[nextScreen];
    if (this.redirectUrl !== null && this.redirectUrl !== '' && this.redirectUrl !== undefined) {
      this.commonService.putLoginData('REDIRECT_URL', this.redirectUrl);
    }
  }

  navigateToHomePage() {
    const isGlobalDashboard = 'GLOBAL_DASHBOARD';
    const globalDashboardNavigate = window[isGlobalDashboard];
    const contextPath = this.commonService.getContextPath();
    const servletName = window[FccGlobalConstant.SERVLET_NAME];
    const isAngularUrl = servletName && window.location.pathname + '#' === (contextPath + servletName) + '#';
    if(isAngularUrl){
      const location = window.location.href;
      const angularRoute = location.substr(location.indexOf('#')+1);
      console.log('angular route constructed is ' + angularRoute);
      if (angularRoute.indexOf(FccGlobalConstant.QUERYPARAM_QUESTION_MARK) !== 1) {
        this.router.navigateByUrl(angularRoute);
      } else {
        this.router.navigate([angularRoute]);
      }
    }
    else if (globalDashboardNavigate !== null && globalDashboardNavigate !== '' && globalDashboardNavigate !== undefined) {
      let url = '';
      if (
        contextPath !== undefined &&
        contextPath !== null &&
        contextPath !== ''
      ) {
        console.log('angular route constructed is ' + contextPath);
        url = contextPath;
      }
      const urlToNavigate = url + globalDashboardNavigate;
      this.router.navigate([]).then(result => {
        window.open(urlToNavigate, '_self');
      });
    }
  }

  setCurrentRouterUrl() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRouterUrl = event.urlAfterRedirects;
      }
    });
  }

  ininsteptwo(){
    const DOJO_ANGULAR_LANGUAGE = 'DOJO_ANGULAR_LANGUAGE';
    this.dojoSelectedLanguage = window[DOJO_ANGULAR_LANGUAGE];
    if (this.dojoSelectedLanguage !== undefined && sessionStorage.getItem('dojoAngularSwitch')
                    && sessionStorage.getItem('dojoAngularSwitch') === 'true') {
      this.dojoSelectedLanguage = {name: this.commonService.checKlanguage(this.dojoSelectedLanguage), code: this.dojoSelectedLanguage};
      this.commonService.setSwitchOnLanguage(this.dojoSelectedLanguage);
    }
    else if (localStorage.getItem(FccGlobalConstant.LANGUAGE) === undefined || localStorage.getItem(FccGlobalConstant.LANGUAGE) === '') {
      localStorage.setItem(FccGlobalConstant.LANGUAGE ,'en');
    }
  }

  routesinit(){
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).pipe(
      map(() => this.activatedRoute)
    ).pipe(
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
    ).pipe(
        filter((route) => route.outlet === 'primary')
    ).pipe(
        mergeMap((route) => route.data)
    ).subscribe((event) => {
      const product = this.activatedRoute.snapshot.queryParams["productCode"];
      const widgetCode = this.activatedRoute.snapshot.queryParams["widgetCode"];
      this.titleKey = event.title;
      if (this.commonService.isnonEMptyString(product)) {
        this.titleKey = product;
      } else if (this.commonService.isnonEMptyString(widgetCode)) {
        this.titleKey = widgetCode;
      }
      this.commonService.setCurrentRouteTitle(this.titleKey);
      this.setTranslatedTitle() ;
    });
  }

  initTranslateService(){
    this.userSelectedLanguage = localStorage.getItem('language');
    this.dir = localStorage.getItem('langDir') !== null && localStorage.getItem('langDir') !== '' ? localStorage.getItem('langDir') : 'ltr';
    const langToSetAsDefault = this.userSelectedLanguage !== null && this.userSelectedLanguage !== '' ? this.userSelectedLanguage : 'en';
    if (! (this.translate.getDefaultLang() && langToSetAsDefault == this.translate.getDefaultLang() ) ) {
      this.translate.setDefaultLang(langToSetAsDefault);
    }
    const languages = this.availableLanguages ? this.availableLanguages.split(',') : [];
    this.translate.addLangs(languages);
    const browserLanguage = this.userSelectedLanguage !== null && this.userSelectedLanguage !== '' ?
    this.userSelectedLanguage : this.translate.getBrowserLang();
    this.translate.use(languages.includes(browserLanguage) ? browserLanguage :  'en' );
	  this.translate.get('corporatechannels').subscribe((translated: string) => {
      console.debug('to ensure that the translations are loaded via making this sequential call');
    });
    this.commonService.isTranslationServiceInitialized.next(true);
    this.getTranslatedMainTitle();
  }
  /* eslint-enable */
  ngOnInit() {
    this.config();
    this.selectTheme();
    if((!this.commonService.isEncryptionAPITriggered)
    && (sessionStorage.getItem('login') && sessionStorage.getItem('login') === 'valid')
    && (this.currentRouterUrl != "/logout" && this.currentRouterUrl != "/login"))
  {
    this.encryptionService.getAPIParamEncryptionKeys();
    this.commonService.isEncryptionAPITriggered = true;
  }
    this.getBrowserLanguage = this.translate.getBrowserLang();
    this.topMenuDisplay = localStorage.getItem('topMenuDisplay');
    localStorage.setItem(FccGlobalConstant.IMAGE_PATH , this.commonService.getImagePath());
    localStorage.setItem(FccGlobalConstant.CONTEXT_PATH , this.commonService.getContextPath());
    this.commonService.registerCustomMatIcons();
    this.customHeaderService.isBurgerIconVisible.subscribe((data) => {
      this.isSideMenuVisible = data;
    });
    if (!this.formControlResolver.isIntialised) {
      this.formControlResolver.initialize();
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.isShowCustomHeader = response.showCustomHeader;
        this.commonService.invalidSessionLandingPages = response.invalidSessionLandingPages;
      }
    });
  }

  enableFooterInLogin(){
    this.router.events.subscribe((url: any) => {
      if (url.url) {
      if (this.hideHeaderFooterUrlArray.indexOf(url.url) > -1) {
       this.commonService.footerStatus.next(true);
      } else {
        this.commonService.footerStatus.next(false);
      }
    }
    }
    );
  }

  selectTheme() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response.chooseBankTheme !== undefined || response.chooseBankTheme !== null) {
      this.document.documentElement.classList.value = response.chooseBankTheme;
      } else {
        this.document.documentElement.classList.value = FccGlobalConstant.DEFAULT_THEME;
      }
    });
  }

  setSwitchOnLanguage(lang) {
    this.languageOf = lang.code;
    this.translate.use(lang.code);
    localStorage.setItem('language' , this.languageOf);
    if (this.languageOf === 'ar') {
    this.dir = 'rtl';
    } else {
    this.dir = 'ltr';
    }
    localStorage.setItem('langDir' , this.dir);
}
  getSwitchOnLAnguage() {
    const a = localStorage.getItem('language');
    this.translate.use(a);
    this.setTranslatedTitle();
  }

getCurrentLangDir() {
  const langDir = localStorage.getItem('langDir');
  if (undefined !== langDir && null !== langDir && '' !== langDir) {
    return langDir;
  } else {
    return this.dir;
  }
}

  get showHeaderFooter() {
    this.hideHeaderFooterUrlArray = ['/login', '/logout', '/change-password',
                                        '/terms-and-condition', '/login-mfa', '/error',
                                        '/retrieve', '/submitResponse', '/view', '/reviewScreen',
                                        '/billView'];
    if (this.hideHeaderFooterUrlArray.indexOf(this.currentRouterUrl) > -1 ||
    ( this. currentRouterUrl !== undefined && this.currentRouterUrl.substring(0, FccGlobalConstant.LENGTH_13) === '/reviewScreen'
    && this.currentRouterUrl.indexOf(FccGlobalConstant.HIDE_TOP_MENU) > -1) ||
    ( this. currentRouterUrl !== undefined && this.currentRouterUrl.substring(0, FccGlobalConstant.LENGTH_5) === '/view') ||
    ( this. currentRouterUrl !== undefined && this.currentRouterUrl.substring(0, FccGlobalConstant.LENGTH_9) === '/billView' )) {
      return false;
    }
    return true;
  }

  get showSideNav() {
    if (this.currentRouterUrl && this.hideSideNavArray.indexOf(this.currentRouterUrl.split('?')[0]) > -1) {
      return false;
    }
    return true;
  }

  floatingComponentClass() {
    if (!this.showCustomHeader) {
      return FccGlobalConstant.FULL_WIDTH_LAYOUT;
    } else {
      return (this.currentRouterUrl && this.hideSideNavArray.indexOf(this.currentRouterUrl.split('?')[0]) > -1) ?
      FccGlobalConstant.FULL_WIDTH_LAYOUT : FccGlobalConstant.PANEL_WIDTH_LAYOUT;
    }
  }

  get showRouter() {
    const dontShowRouter = 'dontShowRouter';
    const servletName = window[FccGlobalConstant.SERVLET_NAME];
    const contextPath = this.commonService.getContextPath();
    const isUrlAcceptable = servletName && window.location.pathname + '#' === (contextPath + servletName) + '#';
    if (window[dontShowRouter] && window[dontShowRouter] === true && !isUrlAcceptable) {
      return false;
    } else {
      return true;
    }
  }

  get showCustomHeader() {
    return this.isShowCustomHeader;
  }

  get showFooter() {
    this.enableFooterInLogin();
    const dontShowAngularFooterComponent = 'dontShowAngularFooterComponent';
    const servletName = window[FccGlobalConstant.SERVLET_NAME];
    const contextPath = this.commonService.getContextPath();
    const isUrlAcceptable = servletName && window.location.pathname + '#' === (contextPath + servletName) + '#';
    if (this.currentRouterUrl !== undefined && (this.currentRouterUrl.indexOf('/dashboard/accSummary') > -1)) {
      return false;
    } else if (!this.showHeaderFooter
      || (window[dontShowAngularFooterComponent] && window[dontShowAngularFooterComponent] === true && !isUrlAcceptable)) {
      this.commonService.footerStatus.subscribe((data: any) => {
        if (data) {
          this.footerStatus = true;
        } else {
          this.footerStatus = false;
        }
      });
      return this.footerStatus;
    } else {
      return true;
    }
  }

  getTranslatedMainTitle() {
    const mainTitleKey = 'MAIN_TITLE';
    this.translate.get(mainTitleKey).subscribe((translated: string) => {
      this.mainTitleKey = translated;
    });
    this.setTranslatedTitle();
  }

  setTranslatedTitle() {
    const servletName = window[FccGlobalConstant.SERVLET_NAME];
    const contextPath = this.commonService.getContextPath();
    const isAngularUrl = servletName && window.location.pathname + '#' === (contextPath + servletName) + '#';
    if (isAngularUrl && this.titleKey) {
      this.translate.get(this.titleKey).subscribe((translated: string) => {
        const translatedTitleKey = translated;
        const completeTitle = this.mainTitleKey + '-' + translatedTitleKey;
        // if title translation is missing, then display main title(to avoid displaying url)
        if(this.commonService.isnonEMptyString(completeTitle)) {
          this.titleService.setTitle(completeTitle);
        }
        else {
          const mainTitle = this.translate.instant('MAIN_TITLE');
          this.titleService.setTitle(mainTitle);
        }
      });
    }
  }

  receiveTopMenuDisplayValue($event) {
    this.topMenuDisplay = $event;
  }

  config() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        sessionStorage.setItem('thresholdSearchPeriod', response.accstmtSearchPeriod);
        if(response.dateRangeFormat) {
          sessionStorage.setItem('dateRangeFormat', response.dateRangeFormat);
        }
        this.commonService.setAngularProducts(response.angularProducts);
        this.commonService.setAngularSubProducts(response.angularSubProducts);
        this.utilityService.setDateFormat(response.dateFormat, response.timezoneDateTimeFormat);
        this.commonService.setIsStaticAccountEnabled(response.tradeStaticAccounts);
        this.commonService.setViewAllScreens(response.viewAllScreens);
        this.commonService.setListClientSideParamsEncryption(response.listClientSideFieldsEncryption);
        this.commonService.setClientSideSensitiveParamsEncryption(response.clientSideSensitiveFieldsEncryption);
        if(response.clientSideEncryptionKeyTimeOut)
        {
          this.commonService.setEncryptionKeysTimeoUt(response.clientSideEncryptionKeyTimeOut);
        }
      }
    });
  }

  updateValues() {
    this.sessionIdleTimeOut = FccGlobalConfiguration.configurationValues.get('SESSION_IDLE_TIME_OUT');
    this.sessionTimeOut = FccGlobalConfiguration.configurationValues.get('SESSION_TIME_OUT');
    this.sessionMaxDuration = FccGlobalConfiguration.configurationValues.get('SESSION_MAX_DURATION');
    this.sessionMaxDurationAlert = FccGlobalConfiguration.configurationValues.get('SESSION_MAX_DURATION_ALERT');
    this.commonService.commonErrPage = FccGlobalConfiguration.configurationValues.get('SHOW_COMMON_ERRORPAGE');
    this.commonService.interceptorRetry = FccGlobalConfiguration.configurationValues.get('INTERCEPTOR_RETRY');
    this.enableContextMenu = (FccGlobalConfiguration.configurationValues.get('ENABLE_RIGHT_CLICK') === 'true') ? true : false;
    const langs = FccGlobalConfiguration.configurationValues.get('AVAILABLE_LANGUAGES');
    const displayKeys = FccGlobalConfiguration.configurationValues.get('LOCALIZATION_DISPLAY_KEYS');
    this.availableLanguages = langs.slice(1, langs.length - 1).replace(/\s/g, '');
    const errors: string = FccGlobalConfiguration.configurationValues.get('ERROR_LIST');
    errors.split('.').forEach(element => {
      this.commonService.errorList.push(element);
    });
    this.ininsteptwo();
    this.initTranslateService();
    this.dateAdapter.setLocale(this.commonService.getLocale(localStorage.getItem('language')));
    this.document.documentElement.setAttribute('lang', localStorage.getItem('language'));
    localStorage.setItem('sessionIdleTimeOut',this.sessionIdleTimeOut);
    localStorage.setItem('sessionTimeOut',this.sessionTimeOut);
    localStorage.setItem('displayLocalizationKeys', displayKeys);
    localStorage.setItem('sessionMaxDuration',this.sessionMaxDuration);
    localStorage.setItem('sessionMaxDurationAlert',this.sessionMaxDurationAlert);
  }

  @HostListener('document:contextmenu', ['$event'])
  documentRClick(event) {
    if (!this.enableContextMenu){
      event.preventDefault();
    }
  }
  addTag() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response.response && response.response === 'REST_API_SUCCESS' && response.trustedTypeEnable) {
        this.metaService.addTag({ 'http-Equiv': 'Content-Security-Policy',
         content: "trusted-types dompurify default;require-trusted-types-for 'script';" });
      }
    });
  }
}
