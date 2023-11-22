import { FccConstants } from './../common/core/fcc-constants';
import { HttpClient } from '@angular/common/http';
import { HideShowDeleteWidgetsService } from '../common/services/hide-show-delete-widgets.service';
import { SessionValidateService } from '../common/services/session-validate-service';
import { TranslateService } from '@ngx-translate/core';
import { MenuService } from '../common/services/menu.service';
import { CommonService } from '../common/services/common.service';
import { FccGlobalConstantService } from '../common/core/fcc-global-constant.service';
import { UserData } from '../common/model/user-data';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseService } from '../common/services/response.service';
import { LogoutRequest } from '../common/model/logout-request';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  AfterViewInit,
  Renderer2,
  OnDestroy,
  HostListener
} from '@angular/core';
import { LogoutService } from '../common/services/logout-service';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem, SelectItem } from 'primeng/api';
import { GlobalSearchComponent } from '../common/components/global-search/global-search.component';
import { DashboardService } from '../common/services/dashboard.service';
import { ProductList } from '../common/model/ProductList';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ChatbotComponent } from '../common/components/chatbot/chatbot.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { FccGlobalConstant } from '../common/core/fcc-global-constants';
import { FccGlobalConfiguration } from '../common/core/fcc-global-configuration';
import { DatePipe, Location } from '@angular/common';
import { LandingIconList } from '../common/model/LandingIconList';
import { DashboardRoutingService } from '../common/services/dashboard-routing.service';
import { FccHelpService } from '../common/services/fcc-help.service';
import { DateAdapter } from '@angular/material/core';
import { LcConstant } from '../corporate/trade/lc/common/model/constant';
import { FccTaskService } from '../common/services/fcc-task.service';
import { UtilityService } from '../corporate/trade/lc/initiation/services/utility.service';
import { ConfirmationDialogComponent } from '../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { OverlayPanel } from 'primeng';
import { ProductStateService } from '../corporate/trade/lc/common/services/product-state.service';
import { EventEmitterService } from '../common/services/event-emitter-service';
import { LcReturnService } from '../corporate/trade/lc/initiation/services/lc-return.service';
import { ConfirmationGuardDialogComponent } from '../confirmation-guard-dialog/confirmation-guard-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TableService } from '../base/services/table.service';
import { CheckTimeoutService } from '../common/services/check-timeout-service';

@Component({
  selector: 'fcc-common-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  pithLarge: 'pi pi-th-large';
  pipiHome: 'pi pi-home';
  products: ProductList[];
  userName: any;
  hideForLanding: any;
  customerID: any;
  value: boolean;
  logoutRequest: LogoutRequest = new LogoutRequest();
  userData: UserData = new UserData();
  dojoUrl = '';
  responseMessage;
  contextPath: any;
  logoFilePath: string;
  homeUrl: string;
  layout: any = [];
  selectedLayout: LayoutChange;
  layoutChangesComes: any;
  layoutType: any;
  lay: LayoutChange[] = [];
  items = [];
  displayMenu = false;
  displayBredcrumb = true;
  topMenuDisplay: string;
  menuObject: MenuItem[] = [];
  topMenuObject: MenuItem[] = [];
  breadcrumbObject: MenuItem[] = [];
  topBreadcrumbObject: MenuItem[] = [];
  breadmenuObj: MenuItem[] = [];
  activeIndex;
  userEmail = 'welcome@finastra.com';
  two = 2;
  three = 3;
  four = 4;
  dir: string = localStorage.getItem('langDir');
  dirStyle;
  dojoSelectedLanguage: any;
  configuredKey = ['PROFILE_IMAGE'];
  dashboard = '/dashboard';
  landingIconUrl: LandingIconList[] = [];
  classicRoutingUrl: string;
  productKey: any;
  keysNotFoundList: any[] = [];
  productRoutingEnable: any;
  configuredKeysList = 'PRODUCT_CARDS_ROUTING_ENABLE';
  hasChatbotAccess: boolean;
  key;
  contentData;
  helpFlag: boolean;
  res: any;
  defaultlanguage: any;
  configuredKeysListLanguage = 'AVAILABLE_LANGUAGES,LANGUAGE';
  keysNotFoundListLanguage: any[] = [];
  language: SelectItem[] = [];
  selectedLanguageValue: any;
  styleClassName: string;
  positionStyle: string;
  serviceName: any;
  serName: any;
  globalDashboardUrl: any;
  productCardsRouting: any[] = [];
  enableFccui: any;
  @ViewChild('slideMenu') public menu: any;
  @ViewChild('sideBar') public sidebar: any;
  @ViewChild('skipFirst') public skipFirst: ElementRef;
  @ViewChild('profile') public profile: ElementRef;
  @ViewChild('op') profileOverlayPanel: OverlayPanel;
  @ViewChild('op1') dashboardOverlayPanel: OverlayPanel;
  @ViewChild('op4') languageOverlayPanel: OverlayPanel;
  @ViewChild('op3') helpOverlayPanel: OverlayPanel;
  @ViewChild('logoutTab') public logoutTab: ElementRef;
  hideProfileOverlay = false;
  @Output() topMenuDisplayValue: EventEmitter<string> = new EventEmitter<
    string
  >();
  @Output() topMenuObj: EventEmitter<MenuItem[]> = new EventEmitter<
    MenuItem[]
  >();
  imagePath: any;
  userFirstName: any;
  userLastName: any;
  userDisplayName: any;
  companyabbvname: any;
  dropdownSelectedValue: any;
  selectedDropdownLayout: any;
  checkCustomise;
  overlayRef: OverlayRef;
  url = '';
  profileImagePath: any;
  param;
  dashboardDetails;
  noLayout = [{ dashboardName: 'No Option' }];
  accessKey: string;
  productCode: any;
  subProductCode: any;
  widgetCode: any;
  title: any;
  content: any;
  sectionId: string;
  toastPosition: string;
  lcConstant = new LcConstant();
  lastLoginLabel: string;
  showLastLogin: boolean;
  userDateTime: string;
  bankDateTime: string;
  isBankTime = false;
  commonHeader = false;
  helpContentSubProductCodeRequired: any[] = [FccGlobalConstant.PRODUCT_LC, FccGlobalConstant.PRODUCT_LN,
  FccGlobalConstant.PRODUCT_BK, FccGlobalConstant.PRODUCT_TD, FccGlobalConstant.PRODUCT_SE, FccGlobalConstant.PRODUCT_FT];
  helpDeskFlag = false;
  pendingListFlag = false;
  option: any;
  category: any;
  mode: any;
  selectedLanguage: any;
  fetchMenuFromDatabase = false;
  displayDialog = false;
  subMenuUrl: string;
  bankTimeZone: string;
  bankClockInterval: any;
  dropdownOpen = false;
  logoFilePathText: string;
  serviceUrl: string;
  service: string;
  template = "template";
  operation:any;
  digiDash="cash";
  SESSION_INVALID_LANDING_PAGES1 = FccGlobalConstant.SESSION_INVALID_LANDING_PAGES1;
  isLoggedIn:any;
  menuValue: string;

  constructor(
    protected logoutService: LogoutService,
    protected http: HttpClient,
    protected responseService: ResponseService,
    protected commonService: CommonService,
    protected dashboardService: DashboardService,
    protected checkTimeoutService: CheckTimeoutService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected dialogService: DialogService,
    protected menuService: MenuService,
    protected translate: TranslateService,
    protected sessionValidation: SessionValidateService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    protected fccGlobalConfiguration: FccGlobalConfiguration,
    protected router: Router,
    public activatedRoute: ActivatedRoute,
    public location: Location,
    protected dashboardRoutingService: DashboardRoutingService,
    protected renderer: Renderer2, protected helpService: FccHelpService,
    public dateAdapter: DateAdapter<any>, protected datepipe: DatePipe,
    protected taskService: FccTaskService, protected utilityService: UtilityService,
    protected stateService: ProductStateService,
    protected eventEmitterService: EventEmitterService,
    protected dialog: MatDialog,
    protected lcReturn: LcReturnService,
    protected tableService: TableService
  ) {
    this.commonService.productNameRoute = this.location.path().substring(FccGlobalConstant.LENGTH_11);
    this.imagePath = this.commonService.getImagePath();
    this.keysNotFoundListLanguage = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysListLanguage);
    if (this.keysNotFoundListLanguage.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundListLanguage.toString()).subscribe(response => {
        if (response) {
          const language = response.AVAILABLE_LANGUAGES.slice(1, response.AVAILABLE_LANGUAGES.length - 1).replace(/\s/g, '');
          this.initLanguage(language);
          this.loadSelectedLanguage(false);
        }
      });
    } else {
      const language = FccGlobalConfiguration.configurationValues.get('AVAILABLE_LANGUAGES').replace(/\s|\[|\]/g, '');
      this.initLanguage(language);
    }
  }
  home: any;
  breadcrumbHome: any;
  ngOnInit() {
    this.setCommonHeader();
    this.hideIconLandingPage();
    this.commonService.getDashboardUrl();
    this.home = { icon: this.pipiHome, routerLink: this.commonService.globalDashboardUrl };
    this.breadcrumbHome = {
      icon: this.pipiHome,
      command: () => {
        this.breadcrumbObject = [];
        this.setMenulevel(0);
      }
    };
    const loggedIn=sessionStorage.getItem('logInCheck');
    if (!(this.SESSION_INVALID_LANDING_PAGES1.includes(this.router.url)) && loggedIn) {
     this.checkTimeoutService.idleTimeOut(localStorage.getItem('sessionIdleTimeOut'),localStorage.getItem('sessionTimeOut'));
     if(localStorage.getItem('isLanguagedChangedFlag') === 'true'){
      this.checkTimeoutService.sessionDurationTimeout(localStorage.getItem('sessionMaxDurationAlert')
     ,localStorage.getItem('sessionMaxDuration'));
     }

    }
    if (localStorage.getItem('language') === 'ar') {
      this.dir = 'rtl';
    } else {
      this.dir = 'ltr';
    }
    localStorage.setItem('langDir', this.dir);
    this.contextPath = this.commonService.getContextPath();
    if(sessionStorage.getItem('login')){
      this.handleUserDetails();
    }
    this.helpFlag = false;
    const DOJO_ANGULAR_LANGUAGE = 'DOJO_ANGULAR_LANGUAGE';
    this.dojoSelectedLanguage = window[DOJO_ANGULAR_LANGUAGE];
    if (this.dojoSelectedLanguage !== undefined && sessionStorage.getItem('dojoAngularSwitch')
      && sessionStorage.getItem('dojoAngularSwitch') === 'true') {
      this.dojoSelectedLanguage = { name: this.commonService.checKlanguage(this.dojoSelectedLanguage), code: this.dojoSelectedLanguage };
      this.commonService.setSwitchOnLanguage(this.dojoSelectedLanguage);
    }
    this.dir = localStorage.getItem('langDir') !== null && localStorage.getItem('langDir') !== '' ? localStorage.getItem('langDir') : 'ltr';
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.lay = [];
    // this.commonService.dashboardOptionsSubject.subscribe(data => {
    //   this.dropdownSelectedValue = data;
    // });
    this.config();
    this.logoutRequest.userData = this.userData;
    this.logoutRequest.requestData = null;
    this.logoutRequest.userData.company = null;
    this.logoutRequest.userData.username = null;
    this.logoutRequest.userData.userSelectedLanguage = null;

    this.loadDashboardDropdown();
    if(sessionStorage.getItem('login')){
      this.setHelpDeskFlag();
      this.setPendingListFlag();
    }

    this.dirStyle = this.dir === 'rtl' ? 'dirRtlStyle' : 'dirLtrStyle';
    this.toastPosition = this.dir === 'rtl' ? 'top-left' : 'top-right';
    const productCode = 'productCode';
    const subProductCode = 'subProductCode';
    const widgetCode = 'widgetCode';
    const option = 'option';
    const category = 'category';
    const mode = 'mode';
    this.activatedRoute.queryParams.subscribe(params => {
      this.productCode = params[productCode];
      this.subProductCode = params[subProductCode];
      this.widgetCode = params[widgetCode];
      this.option = params[option];
      this.category = params[category];
      this.mode = params[mode];
      if (this.enableFccui !== false) {
        this.initNavMenu();
      }
    });
    if(sessionStorage.getItem('login')){
      this.lcReturn.getamountConfig();
      this.lcReturn.amountConfigMap.subscribe(data =>{
        sessionStorage.setItem('amountConfig', JSON.stringify(data));
      });
    }

  }

  ngOnDestroy(): void {
    this.checkTimeoutService.stopIdle();
    clearInterval(this.bankClockInterval);
  }
  setCommonHeader() {
    this.commonHeader = !this.commonService.getEnableUxAddOn();
  }

  initLanguage(language) {
    language = language.split(',');
    language.forEach(
      value => {
        const langLocal = this.commonService.checKlanguage(value);
        const lang: { label: string, value: any }
          = {
          label: langLocal,
          value: { name: langLocal, code: value }
        };
        this.language.push(lang);
      });
    if (this.language.length === 1) {
      this.selectedLanguage = this.language[0].value;
      this.commonService.setSwitchOnLanguage(this.selectedLanguage);
      this.dateAdapter.setLocale(this.commonService.getLocale(this.language[0].value.code));
    }
  }

  setHelpDeskFlag() {
    this.commonService.getUserPermission(FccGlobalConstant.SE_HELPDESK_ENQUIRY).subscribe(helpdeskPermission => {
      if (helpdeskPermission) {
        this.helpDeskFlag = true;
      }
    });
  }

  setPendingListFlag() {
    this.commonService.getUserPermission(FccGlobalConstant.TODO_LIST).subscribe(todoPermission => {
      if (todoPermission) {
        this.pendingListFlag = true;
      }
    });
  }


  hideIconLandingPage() {
    this.router.events.subscribe((url: any) => {
      if (url.url) {
        if (url.url === '/landing') {
          this.commonService.landingiconHide.next(false);
        } else {
          this.commonService.landingiconHide.next(true);
        }
      }
    }
    );

    this.commonService.landingiconHide.subscribe(data => {
      this.hideForLanding = data;
    });
  }

  initBankClock() {
    this.bankClockInterval = setInterval(() => {
      this.bankDateTime = this.utilityService.getBankDateTime(this.bankTimeZone);
      this.bankDateTime = this.bankDateTime.concat('\xa0\xa0\xa0\xa0');
    }, FccGlobalConstant.LENGTH_60000);
  }

  async getBankAndUserLastLogin() {
    this.commonService.getBankDateAndTime().subscribe(
      bankRes => {
        this.commonService.clearCachedResponses();
        if (bankRes.date !== '' && bankRes.date !== undefined && bankRes.date !== null) {
          const bankServerDate = bankRes.date.split(' ')[0];
          this.commonService.globalBankDateTimezone$.next(bankRes);
          const dateParts = bankServerDate.toString().split('/');
          let bankServerDateObj;
          if (localStorage.getItem('language') === FccGlobalConstant.LANGUAGE_US) {
            bankServerDateObj = new Date(bankServerDate);
          } else {
            bankServerDateObj = new Date(dateParts[FccGlobalConstant.LENGTH_2],
              dateParts[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1,
              dateParts[FccGlobalConstant.LENGTH_0]);
          }

          this.commonService.globalBankDate$.next(bankServerDateObj);
        }
        else {
          this.commonService.globalBankDate$.next(new Date());
        }
      });
    this.commonService.getUserDetailsAPI().subscribe(
      res => {
        if (res.body.userLastLoginDateTime !== '' && res.body.userLastLoginDateTime !== undefined
          && res.body.userLastLoginDateTime !== null) {
          this.commonService.setServerDate(res?.body?.serverDate?.split(' ')[0]);
          this.userDateTime = this.utilityService.transformDateToLocalTZ(res.body.userLastLoginDateTime);
          this.commonService.userDateTimezone$.next(res.body?.userPreferences?.timezone?.replace('&#x2f;', '/'));
          this.commonService.getBankDetails().subscribe(
            bankRes => {
              if (bankRes.date !== '' && bankRes.date !== undefined && bankRes.date !== null) {
                this.bankTimeZone = bankRes.bankTimeZone;
                //Using date from api response
                this.bankDateTime = this.utilityService.transformDateToLocalTZ(bankRes.date);
                this.bankDateTime = this.bankDateTime.concat('\xa0\xa0\xa0\xa0');
                // this.initBankClock();
                this.isBankTime = true;
                this.showLastLogin = true;
              } else {
                this.bankDateTime = '';
                this.isBankTime = false;
                this.showLastLogin = true;
              }
            }
          );
        } else {
          this.showLastLogin = false;
        }
      }
    );
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keyPressOptions(event, op4) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      setTimeout(() => {
        this.renderer.selectRootElement('#profileImage').focus();
      });
    }
  }

  switchLanguage(selectedLanguage) {
    sessionStorage.setItem('langSwitch', 'true');
    this.commonService.langSwitch = true;
    const code = this.fetchSelectedLanguageCode(selectedLanguage);
    const screen = window.location.hash.substring(2).split('?')[FccGlobalConstant.LENGTH_0].split('/')[FccGlobalConstant.LENGTH_0];
    if (code !== undefined || code !== '') {
      this.commonService.changeUserLanguage(code).subscribe(
        res => {
          if (res.response === 'success') {
            localStorage.setItem('isLanguagedChangedFlag', 'true');
            if (screen === 'productScreen') {
              const headerField = `${this.translate.instant('changeLanguagefromProductScreen')}`;
              const dir = localStorage.getItem('langDir');
              const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
              let message;
              if (mode === FccGlobalConstant.DRAFT_OPTION) {
                message = 'changeLangConfirmationMsgdraft';
              } else {
                message = 'changeLangConfirmationMsg';
              }
              const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
                header: headerField,
                width: '35em',
                styleClass: 'fileUploadClass',
                style: { direction: dir },
                data: { locaKey: message }
              });
              dialogRef.onClose.subscribe(async (result: any) => {
                if (result.toLowerCase() === 'yes') {
                  setTimeout(() => {
                    this.commonService.setSwitchOnLanguageForHeader(code);
                    this.taskService.notifySaveTransactionfromTask$.next(true);
                    window.location.reload();
                  }, 5000);
                }
              });
            } else if (screen === 'submit') {
              this.commonService.setSwitchOnLanguageForHeader(code);
              this.homePageRefresh();
            } else {
              this.commonService.setSwitchOnLanguageForHeader(code);
              window.location.reload();
            }
          }
        });
    }
  }
  fetchSelectedLanguageCode(selectedLanguage) {
    let codeLanguageValue = '';
    this.language.forEach((langValue) => {
      if (langValue.label.trim() === selectedLanguage.trim()) {
        codeLanguageValue = langValue.value;
      }
    });
    return codeLanguageValue;
  }

  loadSelectedLanguage(isTabopened: boolean) {
    if (isTabopened && document.getElementById('languagePanelGrid')) {
      document.getElementById('languagePanelGrid').focus();
    }
    this.selectedLanguageValue = this.translate.use(localStorage.getItem('language') ? localStorage.getItem('language') : 'en');
  }

  getSelectedLanguage(): string {
    return localStorage.getItem('language') ? localStorage.getItem('language') : 'en';
  }

  protected handleLandingAndChatbot() {
    this.commonService.hasChatBotAccess().then(data => {
      if (data && data.length > 0) {
        this.hasChatbotAccess = Boolean(data[0].hasChatbotAccess);
      }
    });
    this.commonService.checkLandingPage().subscribe(response => {
      if (
        response.errorMessage &&
        response.errorMessage === 'SESSION_INVALID'
      ) {
        this.sessionValidation.IsSessionValid();
      } else if (response.showlandingpage === 'N') {
        this.value = false;
      } else {
        this.value = true;
      }
    });
    sessionStorage.removeItem('chatbot');
  }

  protected hanldeHorizontalMenu() {
    this.commonService.checkHorizontalMenuPage().subscribe(response => {
      // console.debug('translation from instant method:' + this.translate.instant('MENU_BULK_FINANCE_REQUEST'));
      // console.debug('translation from stream method:');
      // console.debug(this.translate.stream('MENU_BULK_FINANCE_REQUEST'));
      if (
        response.errorMessage &&
        response.errorMessage === 'SESSION_INVALID'
      ) {
        this.sessionValidation.IsSessionValid();
      } else if (response.showhorizontalmenu === 'Y') {
        this.topMenuDisplay = 'true';
        this.commonService.setMenuValue('true');
      } else {
        this.topMenuDisplay = 'false';
        this.commonService.setMenuValue('false');
      }
    });
  }

  protected handleProducts() {
    this.commonService.getProductList().subscribe(
      data => {
        if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else if (data.response && data.response === 'REST_API_SUCCESS') {
          this.products = data.productList;
        }
      },
      () => {
        //eslint : no-empty-function
      }
    );
  }

  protected handleUserDetails() {
    const companyname = localStorage.getItem('companyName');
    this.dashboardService.getUserDetails().subscribe(
      data => {
        this.userFirstName = data.firstName;
        this.userLastName = data.lastName;
        this.userDisplayName = data.userDisplayName;
        this.companyabbvname = companyname;
        this.commonService.setLoggedInUserData(data);
        if (data.contactInformation.email != null && data.contactInformation.email !== '') {
          this.userEmail = new DOMParser().parseFromString((data.contactInformation.email), 'text/html').documentElement.innerText;
        }
        // This is a view screen does not need any of the menu/profileimage etc
        if (this.location.path().indexOf('/view?') === 0) {
          return;
        }
        // There is a logged in user and hence the below calls are to be made
        this.getProfileImage();
        this.horizontalNavMenu();
        this.headerCardIconDetails();	// landingPageData
        this.handleProducts();		// availableProductList
        this.getBankAndUserLastLogin();	// user-details
        this.handleLandingAndChatbot();	// chatbotAccess
        this.getinitMenuObject();
        this.sendTopMenuDisplayValue();

      },
      () => {
        //eslint : no-empty-function
      }
    );
    // this.dashboardService.getUserDetails().subscribe(
    //   data => {
    //     this.userFirstName = data.firstName;
    //   },
    //   error => {}
    // );
  }
  getinitMenuObject() {
    this.translate.get('corporatechannels').subscribe(() => {
      this.initMenuObject();	// menuDetails
    });
  }
  horizontalNavMenu() {
    this.translate.get('corporatechannels').subscribe(() => {
      this.hanldeHorizontalMenu();
    });
  }
  ngAfterViewInit() {
    this.skipFirst.nativeElement.focus();
    this.hideIconLandingPage();
  }

  ngAfterViewChecked() {
    this.commonService.addIdToPmenuDropdown();
  }

  getProfileImage() {
    this.commonService.getConfiguredValues(this.configuredKey.toString()).subscribe(response => {
      if (response.response && response.response === 'REST_API_SUCCESS') {
        this.fccGlobalConfiguration.addConfigurationValues(response, this.configuredKey);
        this.profileImagePath = this.fccGlobalConstantService.contextPath + FccGlobalConfiguration.configurationValues.get('PROFILE_IMAGE');
      }
    });
  }

  checkValue(checkEvent) {
    if (checkEvent && checkEvent.checked) {
      this.commonService
        .saveLandingpagepreference('Y')
        .subscribe(
          data => {
            if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
              this.sessionValidation.IsSessionValid();
            }
          },
          () => {
            //eslint : no-empty-function
          }
        );
    } else {
      this.commonService
        .saveLandingpagepreference('N')
        .subscribe(
          data => {
            if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
              this.sessionValidation.IsSessionValid();
            }
          },
          () => {
            //eslint : no-empty-function
          }
        );
    }
  }

  config() {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.logoFilePath = this.contextPath + response.logoFilePath;
        this.logoFilePathText = response.logoFileText;
        if (response.subdomainloginallowed) {
          this.homeUrl = response.subdomainhomeurls;
        } else {
          this.homeUrl = response.homeUrl;
        }
        this.commonHeader = !response.enableUxAddOn;
        this.commonService.setEnableUxAddOn(response.enableUxAddOn);
        this.commonService.setAngularProducts(response.angularProducts);
        this.commonService.setAngularSubProducts(response.angularSubProducts);
        this.productCardsRouting = response.productCardsRoutingEnable;
        this.enableFccui = response.enableFccui;
      }
    });
  }

  //
  loadDashboardDropdown() {
    if (!this.hideShowDeleteWidgetsService.flagForDropDown) {
      this.layout = [];
      this.lay = [];
      let product = this.commonService.productNameRoute;
      const dontShowRouter = 'dontShowRouter';
      if (window[dontShowRouter] && window[dontShowRouter] === true) {
        if (product === undefined || product === '') {
          product = 'global';
        }
      }
      if (product !== '' && this.location.path().substring(FccGlobalConstant.LENGTH_11) !== undefined || null) {
        this.commonService.getListOFDashboard(product === undefined ? this.location.path().substring(FccGlobalConstant.LENGTH_11) : product)
          .subscribe(data => {
            const gtpDashbaordDetails = data.gtpDashbaordDetails?.dashboardName;
            const userDashboard = data.gtpuserDashboard;
            const dashCat = data.gtpDashbaordDetails?.dashboardCategory;
            userDashboard.forEach(element => {
              const layoutDropdown: { dashboardName: string; dashboardId: any; userDashboardId; dashboardVisibility, dashboardCategory } = {
                dashboardName: element.dashboardName,
                dashboardId: element.dashboardId,
                userDashboardId: element.userDashboardId,
                dashboardVisibility: element.dashboardVisibility,
                dashboardCategory: ''
              };
              layoutDropdown.dashboardCategory = dashCat;
              this.layout.push(layoutDropdown);
              this.lay = this.layout;
            });
            this.dashbboardDropChanged(gtpDashbaordDetails);
          });
      }
    }
  }

  dashbboardDropChanged(gtpDashbaordDetails) {
    if (gtpDashbaordDetails !== null || undefined) {
      this.selectedDropdownLayout = this.lay.find(
        x => x.dashboardName === gtpDashbaordDetails
      );
    } else {
      this.selectedDropdownLayout = this.noLayout;
    }
  }

  logout() {
    window[FccGlobalConstant.firstLogin] = false;
    if (this.stateService.getAutoSaveConfig()?.isAutoSaveEnabled) {
      this.eventEmitterService.cancelTransaction.subscribe(() => {
        const paramKeys = {
          productCode: this.stateService.autosaveProductCode,
          subProductCode: this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE),
          referenceId: this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID),
          option: this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION),
          tnxType: this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_TYPE_CODE),
          subTnxtype: this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TNX_TYPE)
        };
        this.commonService.deleteAutosave(
          paramKeys
        ).subscribe(resp => {
          if (resp?.responseDetails?.message) {
            this.stateService.setAutoSaveCreateFlagInState(true);
          }
        });
      });
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.mode = params.mode;
      this.option = params.option;
    });
    if (this.mode === FccGlobalConstant.DRAFT_OPTION || (this.mode === FccGlobalConstant.INITIATE &&
      this.commonService.referenceId) || (this.mode === FccGlobalConstant.EXISTING)) {
      const dialogRef = this.dialog.open(ConfirmationGuardDialogComponent, {
        panelClass: 'confirmDialogClass',
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        height: 'auto',
        width: '600px',
        autoFocus: false,
        disableClose: false,
        hasBackdrop: true,
        data: { isFromLogout : true }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result && result.ref_id) {
            this.onClickDiscard({}, result);
          }
          if (result === 'save') {
            this.commonService.isSaveOperationFromLogoutPopUp$.next(true);
            setTimeout(() => {
              this.callLogout();
            }, FccGlobalConstant.LENGTH_500);

          }
        }
      });
    }
    else {
      this.callLogout();
    }
  }

  onClickDiscard(event, rowData) {
    this.tableService.deleterowObject = [];
    this.tableService.deleterowObject.push(event, rowData);
    const productCode = rowData.product_code;
    const refId = rowData.ref_id;
    const tnxId = rowData.tnx_id ? rowData.tnx_id : this.commonService.eventId;
    const subProductCode = rowData.sub_product_code;
    let headerField;
    let message;
    if (this.option === FccGlobalConstant.TEMPLATE) {
      headerField = `${this.translate.instant('discardTemplate')}`;
      message = `${this.translate.instant('discardTemplateConfirmation')}`;
    } else {
      this.option = FccGlobalConstant.GENERAL;
      headerField = `${this.translate.instant('discardTransaction')}`;
      message = `${this.translate.instant('discardConfirmationMsg')}`;
    }
    const optMode = this.option;
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: message }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.tableService.selectedDeleteService(productCode, refId, tnxId, subProductCode, optMode);
        setTimeout(() => {
          this.callLogout();
        }, FccGlobalConstant.LENGTH_500);
      }
      else
      {
        this.callLogout();
      }
    });
  }


  callLogout() {
    this.logoutService
      .logoutUser(
        this.fccGlobalConstantService.getLogoutUrl(),
        this.logoutRequest
      )
      .subscribe(data => {
        if (data.response === 'success') {
          const dontShowRouter = 'dontShowRouter';
          this.responseMessage = data.message;
          this.responseService.setResponseMessage(data.message);
          this.commonService.setOnDemandTimedLogout(true);
          this.commonService.dashboardOptionsSubject.next(null);
          sessionStorage.removeItem('chatbot');
          sessionStorage.removeItem('logInCheck');
          sessionStorage.removeItem('login');
          localStorage.removeItem('isLanguagedChangedFlag');
          this.commonService.clearCachedData();
          if (this.overlayRef !== undefined) {
            this.overlayRef.dispose();
          }
          sessionStorage.removeItem('dateRangeFormat');
          sessionStorage.removeItem('dojoAngularSwitch');
          sessionStorage.removeItem('logInCheck');
          sessionStorage.removeItem('login');
          sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
          let logoutDojoUrl = '';
          logoutDojoUrl = this.fccGlobalConstantService.contextPath;
          logoutDojoUrl = logoutDojoUrl + this.fccGlobalConstantService.servletName + '#/logout';
          window[dontShowRouter] = false;
          const dojoContentElement = document.querySelector('.colmask');
          if (dojoContentElement && dojoContentElement !== undefined) {
            (dojoContentElement as HTMLElement).style.display = 'none';
            }
          window.open(logoutDojoUrl, '_self');
        } else if (data.response === 'failed') {
          localStorage.removeItem('language');
          localStorage.removeItem('langDir');
          localStorage.setItem('language', 'en');
          localStorage.setItem('langDir', 'ltr');
          sessionStorage.removeItem('chatbot');
          sessionStorage.removeItem('logInCheck');
          if (this.overlayRef !== undefined) {
            this.overlayRef.dispose();
          }
          sessionStorage.removeItem('dojoAngularSwitch');
          sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
          this.router.navigate(['/login']);
        }
      });
  }

  initMenuObject() {
    this.fetchMenuFromDatabase = false;
    this.menuService
      .getMenu(this.fccGlobalConstantService.getMenuPath())
      .subscribe(resp => {
        if (resp.response === 'REST_API_SUCCESS') {
          if (resp.fetchFromDatabase) {
            this.fetchMenuFromDatabase = true;
          }
          this.createMenuItems(resp);
        } else {
          this.commonService.clearCachedResponses();
        }
      });
  }

  onClick() {
    this.dialogService.open(GlobalSearchComponent, {
      width: '100%',
      contentStyle: {
        height: '101vh',
        overflow: 'auto',
        'background-color': '#FAFAFA'
      },
      showHeader: false,
      baseZIndex: 9999,
      closeOnEscape: true
    });
  }

  onClickDownloadCenter(){
    this.router.navigate(['/downloadCenter']);
  }

  layoutchange(event) {
    this.dropdownOpen = false;
    if (event.value.dashboardVisibility === 'private') {
      this.commonService.saveDashboardPreference(event.value).subscribe(res => {
        // eslint-disable-next-line no-console
        console.log('save Dashboard Preferences' + JSON.stringify(res.status));
      }, err => {
        // eslint-disable-next-line no-console
        console.log('Error message : save Dashboard Preferences' + err.message);
      });
    }
    this.hideShowDeleteWidgetsService.flagForDropDown = true;
    const dontShowRouter = 'dontShowRouter';
    if (window[dontShowRouter] && window[dontShowRouter] === true) {
      window[dontShowRouter] = false;
      const dojoContentElement = document.querySelector('.colmask');
      if (dojoContentElement && dojoContentElement !== undefined) {
        (dojoContentElement as HTMLElement).style.display = 'none';
      }
      const footerComponentID = 'footerHtml';
      const dojoFooterElement = document.getElementById(footerComponentID);
      if (dojoFooterElement && dojoFooterElement !== undefined) {
        (dojoFooterElement as HTMLElement).style.display = 'none !important;';
      }
    }
    this.commonService.dashboardOptionsSubject.next(event.value);
    this.dashbboardDropChanged(event.value.dashboardName);
  }

  createMenuItems(menuResponse) {
    const dontShowRouter = 'dontShowRouter';
    if (window[dontShowRouter] && window[dontShowRouter] === true) {
      this.menuObject.push({
        label: this.translate.instant('dashboard'),
        icon: this.pipiHome,
        command: () => this.homePageRefresh()
      });
    } else {
      this.commonService.getDashboardUrl();
      this.menuObject.push({
        label: this.translate.instant('dashboard'),
        icon: this.pipiHome,
        routerLink: [this.commonService.globalDashboardUrl]
      });
    }

    this.handleMenuItems(menuResponse);
    this.topMenuObj.emit(this.topMenuObject);
    this.commonService.setMenuObject(this.menuObject);
  }

  handleMenuItems(menuResponse: any) {
    let vertical;
    let product = [];
    let menu = [];
    let subMenu = [];
    let topVertical;
    let topProduct = [];
    let subProductCodeValue = '';
    menuResponse.menus.forEach(element => {
      element.subMenus.forEach(subElement => {
        ({ subMenu, subProductCodeValue } = this.handleSubMenuAndSubProdCode(subElement,
          subMenu, menu, subProductCodeValue, product, topProduct));
        menu = [];
      });
      vertical = {
        label: this.translate.instant(element.menuLabel),
        icon: this.pithLarge,
        items: product,
        command: (event: any) => {
          this.activeIndex = 0;
          if (this.breadcrumbObject.length < this.four) {
            this.breadcrumbObject.push({
              label: event.item.label,
              url: event.item.url,
              command: () => {
                this.activeIndex = 1;
                this.breadcrumbObject = this.breadcrumbObject.slice(
                  0,
                  this.activeIndex
                );
                this.setMenulevel(1);
              }
            });
          }
        }
      };
      topVertical = {
        label: this.translate.instant(element.menuLabel),
        separator: false,
        items: topProduct
      };
      this.menuObject.push(vertical);
      this.topMenuObject.push(topVertical);
      product = [];
      topProduct = [];
    });
  }

  private handleSubMenuAndSubProdCode(subElement: any, subMenu: any[], menu: any[],
    subProductCodeValue: string, product: any[], topProduct: any[]) {
    if (subElement.navMenu !== 'false') {
      subMenu = this.handleSubMenuElements(subElement, subMenu, menu);
      if (subElement.subMenuUrl !== undefined && subElement.subMenuUrl !== null && subElement.subMenuUrl !== ''
        && subElement.deepLinking === true) {
        this.setDeepLinkingData(subElement, topProduct, product);
      } else if (subElement.subMenuUrl !== undefined && subElement.subMenuUrl !== null && subElement.subMenuUrl !== ''
        && subElement.deepLinking === false) {
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          icon: this.pithLarge,
          url: subElement.subMenuUrl,
          headers: { ssoToken: subElement.ssoToken }
        });
        topProduct.push({
          label: this.translate.instant(subElement.subMenuLabel),
          icon: this.pithLarge,
          url: subElement.subMenuUrl,
          headers: { ssoToken: subElement.ssoToken }
        });
      } else if (subElement.routerLink !== undefined && subElement.routerLink !== null && subElement.routerLink !== ''
        && subElement.deepLinking === false) {
        subProductCodeValue = this.handleSubEleRouterLink(subElement, subProductCodeValue, topProduct, product);
      } else if (subElement.routerLink !== undefined && subElement.routerLink !== null && subElement.routerLink !== ''
        && subElement.deepLinking === true) {
        subProductCodeValue = this.handleSubEleRouterLinkDeepLinking(subElement, subProductCodeValue, topProduct, product);
      } else {
        this.pushSubElementToProduct(product, subElement, menu);
      }

    }
    return { subMenu, subProductCodeValue };
  }

  private handleSubEleRouterLinkDeepLinking(subElement: any, subProductCodeValue: string, topProduct: any[], product: any[]) {

    if (subElement.option !== undefined && subElement.option !== null && subElement.option !== '' &&
      subElement.widgetCode !== undefined && subElement.widgetCode !== null && subElement.widgetCode !== '') {
      this.setDeepLinkingData(subElement, topProduct, product);
    } else if (subElement.widgetCode !== undefined && subElement.widgetCode !== null && subElement.widgetCode !== '') {
      this.setDeepLinkingData(subElement, topProduct, product);
    } else {
      this.setDeepLinkingData(subElement, topProduct, product);
      subProductCodeValue = '';
    }

    return '';
  }

  private setDeepLinkingData(subElement: any, topProduct: any[], product: any[]) {
    if (subElement.urlType === FccGlobalConstant.INTERNAL) {
      topProduct.push({
        label: this.translate.instant(subElement.subMenuLabel),
        url: subElement.subMenuUrl,
        headers: { ssoToken: subElement.ssoToken }
      });
      product.push({
        label: this.translate.instant(subElement.subMenuLabel),
        url: subElement.subMenuUrl,
        headers: { ssoToken: subElement.ssoToken }
      });
    } else {
      topProduct.push({
        label: this.translate.instant(subElement.subMenuLabel),
        headers: { ssoToken: subElement.ssoToken },
        command: () => this.goToExternalLink(subElement)
      });
      product.push({
        label: this.translate.instant(subElement.subMenuLabel),
        headers: { ssoToken: subElement.ssoToken },
        command: () => this.goToExternalLink(subElement)
      });
    }
  }

  onDropdownChange(event) {
    if (event) {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }

  oncloseDropdown(event: KeyboardEvent) {
    if (event) {
      this.dropdownOpen = false;
    }
  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event:
    KeyboardEvent) {
    if (event) {
      if (this.profileOverlayPanel && !this.dropdownOpen) {
        this.profileOverlayPanel.hide();
      }
      if (this.dashboardOverlayPanel) {
        this.dashboardOverlayPanel.hide();
      }
      if (this.helpOverlayPanel) {
        this.helpOverlayPanel.hide();
      }
      if (this.languageOverlayPanel) {
        this.languageOverlayPanel.hide();
      }
    }
  }

  goToExternalLink(subElement: any) {
    this.displayDialog = false;
    this.subMenuUrl = '';
    if (subElement.urlType === FccGlobalConstant.EXTERNAL) {
      this.displayDialog = true;
      this.subMenuUrl = subElement.subMenuUrl;
      if (subElement.ssoToken != undefined && subElement.ssoToken != null && subElement.ssoToken != '') {
        this.subMenuUrl += '?SEC_TKN=' + subElement.ssoToken + '&LANGUAGE=en_UK';
      }
    } else if (subElement.urlType === FccGlobalConstant.IFRAME) {
      if (subElement.securityType === FccGlobalConstant.SSO) {
        this.commonService.iframeURL = subElement.subMenuUrl;
        this.commonService.deepLinkingQueryParameter = subElement.queryParameter;
        this.router.navigate(['/sso-deeplink-url']);
      } else {
        this.commonService.iframeURL = subElement.subMenuUrl;
        this.router.navigate(['/iframe']);
      }
    }
    this.commonService.navigateToLink(subElement);
  }

  navigateToExternalUrl() {
    this.displayDialog = false;
    window.open(this.subMenuUrl, FccGlobalConstant.BLANK);
  }

  private handleSubEleRouterLink(subElement: any, subProductCodeValue: string, topProduct: any[], product: any[]) {
    if (subElement.subProductCode !== '' && subElement.subProductCode !== null && subElement.subProductCode !== undefined) {
      subProductCodeValue = subElement.subProductCode;
    }
    if (this.fetchMenuFromDatabase === false) {
      if (subElement.option !== undefined && subElement.option !== null && subElement.option !== '') {
        topProduct.push({
          label: this.translate.instant(subElement.subMenuLabel),
          routerLink: [subElement.routerLink],
          queryParams: {
            productCode: subElement.productCode, widgetCode: subElement.widgetCode,
            subProductCode: subElement.subProductCode, option: subElement.option
          }
        });
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          routerLink: [subElement.routerLink],
          queryParams: {
            productCode: subElement.productCode, widgetCode: subElement.widgetCode,
            subProductCode: subElement.subProductCode, option: subElement.option
          }
        });
      } else if (subElement.widgetCode !== undefined && subElement.widgetCode !== null && subElement.widgetCode !== '') {
        topProduct.push({
          label: this.translate.instant(subElement.subMenuLabel),
          routerLink: [subElement.routerLink],
          queryParams: { productCode: subElement.productCode, widgetCode: subElement.widgetCode }
        });
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          routerLink: [subElement.routerLink],
          queryParams: { productCode: subElement.productCode, widgetCode: subElement.widgetCode }
        });
      } else {
        topProduct.push({
          label: this.translate.instant(subElement.subMenuLabel),
          routerLink: [subElement.routerLink],
          queryParams: { productCode: subElement.productCode, subProductCode: subProductCodeValue, option: subElement.option }
        });
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          routerLink: [subElement.routerLink],
          queryParams: { productCode: subElement.productCode, subProductCode: subProductCodeValue, option: subElement.option }
        });
        subProductCodeValue = '';
      }
    } else {
      if (subElement.option !== undefined && subElement.option !== null && subElement.option !== '' &&
        subElement.widgetCode !== undefined && subElement.widgetCode !== null && subElement.widgetCode !== '') {
        topProduct.push({
          label: this.translate.instant(subElement.subMenuLabel),
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&widgetCode=' +
            subElement.widgetCode + '&subProductCode=' + subProductCodeValue + '&option=' + subElement.option,
          headers: { ssoToken: subElement.ssoToken }
        });
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&widgetCode=' +
            subElement.widgetCode + '&subProductCode=' + subProductCodeValue + '&option=' + subElement.option,
          headers: { ssoToken: subElement.ssoToken }
        });
      } else if (subElement.widgetCode !== undefined && subElement.widgetCode !== null && subElement.widgetCode !== '') {
        topProduct.push({
          label: this.translate.instant(subElement.subMenuLabel),
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&widgetCode=' + subElement.widgetCode,
          headers: { ssoToken: subElement.ssoToken }
        });
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&widgetCode=' + subElement.widgetCode,
          headers: { ssoToken: subElement.ssoToken }
        });
      } else if (subElement.category !== undefined && subElement.category !== null && subElement.category !== '' &&
        subElement.operation !== undefined && subElement.operation !== null && subElement.operation !== '') {
        topProduct.push({
          label: this.translate.instant(subElement.subMenuLabel),
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&subProductCode=' +
            subProductCodeValue + '&option=' + subElement.option + '&operation=' + subElement.operation +
            '&category=' + subElement.category,
          headers: { ssoToken: subElement.ssoToken }
        });
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&subProductCode=' +
            subProductCodeValue + '&option=' + subElement.option + '&operation=' + subElement.operation +
            '&category=' + subElement.category,
          headers: { ssoToken: subElement.ssoToken }
        });
      } else if (subElement.category !== undefined && subElement.category !== null && subElement.category !== '') {
        topProduct.push({
          label: this.translate.instant(subElement.subMenuLabel),
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&subProductCode=' +
            subProductCodeValue + '&option=' + subElement.option + '&category=' + subElement.category,
          headers: { ssoToken: subElement.ssoToken }
        });
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&subProductCode=' +
            subProductCodeValue + '&option=' + subElement.option + '&category=' + subElement.category,
          headers: { ssoToken: subElement.ssoToken }
        });
      } else {
        topProduct.push({
          label: this.translate.instant(subElement.subMenuLabel),
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&subProductCode=' +
            subProductCodeValue + '&option=' + subElement.option,
          headers: { ssoToken: subElement.ssoToken }
        });
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&subProductCode=' +
            subProductCodeValue + '&option=' + subElement.option,
          headers: { ssoToken: subElement.ssoToken }
        });
        subProductCodeValue = '';
      }
    }
    return subProductCodeValue;
  }

  private pushSubElementToProduct(product: any[], subElement: any, menu: any[]) {
    product.push({
      label: this.translate.instant(subElement.subMenuLabel),
      icon: this.pithLarge,
      items: menu,
      command: (event: any) => {
        this.activeIndex = 1;
        if (this.breadcrumbObject.length < this.four) {
          this.breadcrumbObject.push({
            label: event.item.label,
            url: event.item.url,
            command: () => {
              this.activeIndex = this.two;
              this.breadcrumbObject = this.breadcrumbObject.slice(
                0,
                this.activeIndex
              );
              this.setMenulevel(this.two);
            }
          });
        }
      }
    });
  }

  private handleSubElementRouterLink(subElement: any, subProductCodeValue: string, product: any[]) {
    if (subElement.subProductCode !== '' && subElement.subProductCode !== null && subElement.subProductCode !== undefined) {
      subProductCodeValue = subElement.subProductCode;
    }
    if (this.fetchMenuFromDatabase === false) {
      if (subElement.widgetCode !== undefined && subElement.widgetCode !== null && subElement.widgetCode !== '') {
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          icon: this.pithLarge,
          routerLink: [subElement.routerLink],
          queryParams: { productCode: subElement.productCode, widgetCode: subElement.widgetCode },
          headers: { ssoToken: subElement.ssoToken }
        });
      } else {
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          icon: this.pithLarge,
          routerLink: [subElement.routerLink],
          queryParams: { productCode: subElement.productCode, subProductCode: subProductCodeValue, option: subElement.option },
          headers: { ssoToken: subElement.ssoToken }
        });
        subProductCodeValue = '';
      }
    } else if (this.fetchMenuFromDatabase === true) {
      if (subElement.widgetCode !== undefined && subElement.widgetCode !== null && subElement.widgetCode !== '') {
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          icon: this.pithLarge,
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&widgetCode=' + subElement.widgetCode,
          headers: { ssoToken: subElement.ssoToken }
        });
      } else {
        product.push({
          label: this.translate.instant(subElement.subMenuLabel),
          icon: this.pithLarge,
          url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/' +
            subElement.routerLink + '?productCode=' + subElement.productCode + '&subProductCode=' +
            subProductCodeValue + '&option=' + subElement.option,
          headers: { ssoToken: subElement.ssoToken }
        });
        subProductCodeValue = '';
      }
    }
    return subProductCodeValue;
  }
  private handleSubMenuElements(subElement: any, subMenu: any[], menu: any[]) {
    subElement.subMenus.forEach(ele => {
      ele.subMenus.forEach(subEle => {
        subMenu.push({
          label: this.translate.instant(subEle.subMenuLabel),
          icon: this.pithLarge,
          url: subEle.subMenuUrl,
          command: (event: any) => {
            this.activeIndex = this.three;
            if (this.breadcrumbObject.length < this.four) {
              this.breadcrumbObject.push({
                label: event.item.label,
                url: event.item.url,
                command: () => {
                  this.activeIndex = this.four;
                  this.breadcrumbObject = this.breadcrumbObject.slice(
                    0,
                    this.activeIndex
                  );
                  this.setMenulevel(this.four);
                }
              });
            }
          }
        });
      });
      menu.push({
        label: this.translate.instant(ele.subMenuLabel),
        icon: this.pithLarge,
        items: subMenu,
        url: subMenu.length > 0 ? '' : ele.subMenuUrl,
        command: (event: any) => {
          this.activeIndex = this.two;
          if (this.breadcrumbObject.length < this.four) {
            this.breadcrumbObject.push({
              label: event.item.label,
              url: event.item.url,
              command: () => {
                this.activeIndex = this.three;
                this.breadcrumbObject = this.breadcrumbObject.slice(
                  0,
                  this.activeIndex
                );
                this.setMenulevel(this.three);
              }
            });
          }
        }
      });
      subMenu = [];
    });
    return subMenu;
  }

  toggleMenu() {
    this.topMenuDisplay = this.topMenuDisplay === 'true' ? 'false' : 'true';
    if (this.topMenuDisplay === 'true') {
      this.commonService.setMenuValue('true');
      this.commonService.saveHorizontalMenupreference('Y').subscribe(
        data => {
          if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
            this.sessionValidation.IsSessionValid();
          }
        },
        () => {
          //eslint : no-empty-function
        }
      );
    }
    if (this.topMenuDisplay === 'false') {
      this.commonService.setMenuValue('false');
      this.commonService.saveHorizontalMenupreference('N').subscribe(
        data => {
          if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
            this.sessionValidation.IsSessionValid();
          }
        },
        () => {
          //eslint : no-empty-function
        }
      );
    }
  }

  setMenulevel(level: number) {
    this.menu.left = 0 - this.menu.menuWidth * level;
  }

  hideSidebar(event) {
    this.sidebar.close(event);
  }

  switchViewProfile() {
    sessionStorage.setItem('dojoAngularSwitch', 'true');
    this.url = '';
    if (
      this.contextPath !== undefined &&
      this.contextPath !== null &&
      this.contextPath !== ''
    ) {
      this.url = this.contextPath;
    }
    this.url = this.url + this.fccGlobalConstantService.servletName + '/screen/CustomerSystemFeaturesScreen?option=PROFILE_MAINTENANCE';
    this.router.navigate([]).then(() => {
      window.open(this.url, '_self');
    });
  }

  routeLP() {
    this.commonService.getDashboardUrl();
    this.router.navigate([this.commonService.globalDashboardUrl]);
  }

  sendTopMenuDisplayValue() {
    this.topMenuDisplayValue.emit(this.topMenuDisplay);
  }

  /*this method will create an overlay and attach the component to it to open floating panels on the screen.*/
  onClickChatBot() {
    const config = new OverlayConfig();
    config.hasBackdrop = false;
    this.overlayRef = this.overlay.create(config);
    if (sessionStorage.getItem('chatbot') && sessionStorage.getItem('chatbot') === 'open') {
      if (document.getElementById('chat') !== null &&
        document.getElementById('chat').style.display === FccGlobalConstant.STYLE_HIDECHATBOT) {
        document.getElementById('chat').style.display = FccGlobalConstant.STYLE_SHOWCHATBOT;
      }
      return;
    }
    sessionStorage.setItem('chatbot', 'open');
    this.overlayRef.attach(new ComponentPortal(ChatbotComponent, this.viewContainerRef));
  }
  homePageRefresh() {
    this.commonService.dashboardProductPath = this.location.path();
    const dontShowRouter = 'dontShowRouter';
    let homeDojoUrl = '';
    if (!this.commonService.getEnableUxAddOn() && window[dontShowRouter] && window[dontShowRouter] === true) {
      homeDojoUrl = this.fccGlobalConstantService.contextPath;
      homeDojoUrl = homeDojoUrl + this.fccGlobalConstantService.servletName;
      homeDojoUrl = homeDojoUrl + '/screen?classicUXHome=true';
      window.open(homeDojoUrl, '_self');
    } else if (this.enableFccui === this.commonService.getEnableUxAddOn() === false) {
      this.commonService.getDashboardUrl();
      homeDojoUrl = this.fccGlobalConstantService.contextPath;
      homeDojoUrl = homeDojoUrl + this.fccGlobalConstantService.servletName;
      homeDojoUrl = homeDojoUrl + '/screen?classicUXHome=true';
      homeDojoUrl = homeDojoUrl + this.fccGlobalConstantService.servletName + '#' + this.commonService.globalDashboardUrl;
      window.open(homeDojoUrl, '_self');
    } else if (window[dontShowRouter] && window[dontShowRouter] === true
      || (this.commonService.dashboardProductPath.includes('/dashboard/loanDeals'))
      || (this.commonService.dashboardProductPath.includes('/dashboard/loan'))
      || (this.commonService.dashboardProductPath.includes('/dashboard/trade'))
      || (this.commonService.dashboardProductPath.includes('/dashboard/accSummary'))
      || (this.commonService.dashboardProductPath.includes('/downloadCenter'))
      || (this.commonService.dashboardProductPath.includes('/dashboard/accSummary'))) {
      this.commonService.getDashboardUrl();
      homeDojoUrl = this.fccGlobalConstantService.contextPath;
      homeDojoUrl = homeDojoUrl + this.fccGlobalConstantService.servletName + '#' + this.commonService.globalDashboardUrl;
      this.router.navigate([]).then(() => {
        window[dontShowRouter] = false;
        const dojoContentElement = document.querySelector('.colmask');
        if (dojoContentElement && dojoContentElement !== undefined) {
          (dojoContentElement as HTMLElement).style.display = 'none';
        }
        const footerComponentID = 'footerHtml';
        const dojoFooterElement = document.getElementById(footerComponentID);
        if (dojoFooterElement && dojoFooterElement !== undefined) {
          (dojoFooterElement as HTMLElement).style.display = 'none !important;';
        }
        window.open(homeDojoUrl, '_self');
      });

    } else {
      this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
        this.commonService.getDashboardUrl();
        this.router.navigate([this.commonService.globalDashboardUrl]);
      });
    }
    this.displayBredcrumb = false;
  }

  initNavMenu() {
    let screen = window.location.hash.substring(2);
    const url = window.location.href;
    const keyArray = url.split('/dashboard/');
    this.operation = keyArray[1];
    if (screen !== null) {
      screen = screen.split('?')[FccGlobalConstant.LENGTH_0].split('/')[FccGlobalConstant.LENGTH_0];
    }

    if (this.productCode !== undefined || screen === 'submit' || screen === 'tabPanelListing'
    || this.category === 'FCM' || screen === 'commonProductScreen' || screen === 'dashboard') {
      this.displayBredcrumb = true;
    } else {
      this.displayBredcrumb = false;
    }
     if (screen ==='dashboard' && this.operation !=='accSummary?option=ACCOUNTS' && this.operation !=='loanDeals')
    {
      this.displayBredcrumb = false;
    }
    this.menuService
      .getMenu(this.fccGlobalConstantService.getMenuPath())
      .subscribe(resp => {
        if (resp.response === 'REST_API_SUCCESS') {
          if (resp.fetchFromDatabase) {
            this.fetchMenuFromDatabase = true;
          }
          this.translate.get('corporatechannels').subscribe(() => {
            this.navBreadcrumb(resp);
          });
        } else {
          this.commonService.clearCachedResponses();
        }
      });
  }

  navBreadcrumb(bmenuResponse: any) {
    let screen = window.location.hash.substring(2);
    if (screen !== null) {
      screen = screen.split('?')[FccGlobalConstant.LENGTH_0].split('/')[FccGlobalConstant.LENGTH_0];
    }

    if (this.commonService.getEnableUxAddOn()) {

      //added tempProductCode and tempSubProductCode for handling Lending Services breacrumb, as values are getting updated for screen urls
      let tempProductCode;
      let tempSubProductCode;
      if (this.productCode === 'SE' && this.subProductCode === 'LNCDS') {
        tempProductCode = 'LN';
        this.option = 'DT';
      }

      if (this.productCode === 'BK' && this.subProductCode === 'LNRPN') {
        tempProductCode = 'LN';
        this.option = 'GENERAL';
      }

      if (this.productCode === 'BK' && this.subProductCode === 'BLFP') {
        tempProductCode = 'FT';
        tempSubProductCode = 'LNFP';
      }
      if (this.productCode === 'SE' && this.subProductCode === 'CTCHP') {
        tempProductCode = 'SE';
        tempSubProductCode = 'SEEML';
      }
      if ((screen === 'productListing' && this.option !== 'TEMPLATE') || screen === 'tabPanelListing' || screen === 'dashboard') {
        bmenuResponse.menus.forEach(belement => {
          this.service = belement.menuLabel.split('_');
          this.serviceName = this.service[1];
          this.menuValue = this.serviceName.toLocaleLowerCase();
          if (this.serviceName === 'DIGITAL') {
            this.menuValue = this.digiDash;
          }
          belement.subMenus.forEach(subelement => {
            if (this.commonService.isnonEMptyString(this.subProductCode)) {
              if (this.subProductCode === subelement.subProductCode && subelement.productCode === this.productCode) {
                if(this.commonService.isnonEMptyString(subelement.disableBreadCrumbUrl) && subelement.disableBreadCrumbUrl === 'Y') {
                  this.createBreadMenuObjWithoutUrl(belement);
                } else {
                  this.createBreadMenuObjForDashboard(belement);
                }
              }
            } else if (this.commonService.isnonEMptyString(this.option) && this.option !== 'GENERAL') {
              if (subelement.option === this.option) {
                this.createBreadMenuObjForDashboard(belement);
              }
            } else if(subelement.subMenuLabel === 'MODULE_LOAN_DEALS') {
              this.createBreadMenuObjForDashboard(belement);
            } else if (subelement.category === this.category || subelement.widgetCode === this.widgetCode
              || subelement.productCode === this.productCode) {
              this.createBreadMenuObjForDashboard(belement);
            }
          });
        });
      } else if (this.option !== 'TEMPLATE' && (screen === 'productScreen' || screen === 'reviewScreen'
        || screen === 'facilityOverView' || screen === 'commonProductScreen' || screen === 'accountDetails')) {
        bmenuResponse.menus.forEach(belement => {
          this.service = belement.menuLabel.split('_');
          this.serviceName = this.service[1];
          this.menuValue = this.serviceName.toLocaleLowerCase();
          if (this.serviceName === 'DIGITAL') {
            this.menuValue = this.digiDash;
          }
          belement.subMenus.forEach(subelement => {
            if (this.commonService.isnonEMptyString(tempSubProductCode)) {
              if (tempSubProductCode === subelement.subProductCode && subelement.productCode === tempProductCode) {
                if(this.commonService.isnonEMptyString(subelement.disableBreadCrumbUrl) && subelement.disableBreadCrumbUrl === 'Y') {
                  this.createBreadMenuObjWithoutUrl(belement);
                } else {
                  this.createBreadMenuObjForDashboard(belement);
                }
                this.createBreadMenuObjForListing(subelement);
              }
            } else if (this.commonService.isnonEMptyString(tempProductCode)) {
              if (subelement.productCode === tempProductCode && subelement.option === this.option) {
                this.createBreadMenuObjForDashboard(belement);
                this.createBreadMenuObjForListing(subelement);
              }
            } else if (this.commonService.isnonEMptyString(this.subProductCode)
            && FccGlobalConstant.INCLUDED_SUB_PRODUCT_CODE_FOR_BREADCRUMB.includes(this.subProductCode)) {
              if (this.subProductCode === subelement.subProductCode && subelement.productCode === this.productCode) {
                if(this.commonService.isnonEMptyString(subelement.disableBreadCrumbUrl) && subelement.disableBreadCrumbUrl === 'Y') {
                  this.createBreadMenuObjWithoutUrl(belement);
                } else {
                  this.createBreadMenuObjForDashboard(belement);
                }
                this.createBreadMenuObjForListing(subelement);
              }
            } else if (subelement.productCode === this.productCode
              || ((screen === 'commonProductScreen' || screen === 'accountDetails') && subelement.option === this.option)) {


              if (this.option === FccGlobalConstant.FACILITYOVERVIEW_OPTION) {
                this.createBreadMenuObjForDashboard(belement);
                this.breadmenuObj.push({
                  label: this.translate.instant('facilitiesList'),
                  url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/productListing'
                    + '?productCode=' + this.productCode + '&option=' + 'FACILITYLIST'
                });
              } else if (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_LNDR
                || this.mode === 'INITIATE') {
                if (subelement.option === 'GENERAL') {
                  this.createBreadMenuObjForDashboard(belement);
                  this.createBreadMenuObjForListing(subelement);
                }
              } else {
                this.createBreadMenuObjForDashboard(belement);
                this.createBreadMenuObjForListing(subelement);
              }
            }
          });
        });
      } else if ((this.option === 'TEMPLATE')) {
        bmenuResponse.menus.forEach(belement => {
          this.service = belement.menuLabel.split('_');
          this.serviceName = this.service[1];
          this.menuValue = this.serviceName.toLocaleLowerCase();
          belement.subMenus.forEach(subelement => {
            if (subelement.productCode === this.productCode || subelement.option === this.option) {
              this.createBreadMenuObjForDashboard(belement);
              this.breadmenuObj.push({
                label: this.translate.instant(subelement.subMenuLabel),
                routerLink: [subelement.routerLink],
                queryParams: {
                  productCode: subelement.productCode, widgetCode: subelement.widgetCode,
                  subProductCode: subelement.subProductCode, option: subelement.option
                }
              });
              if (screen === 'productScreen' || screen === 'reviewScreen') {

                this.breadmenuObj.push({
                  label: this.translate.instant(this.template),
                  url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/productListing'
                    + '?productCode=' + this.productCode + '&subProductCode=' + this.subProductCode + '&option=' + this.option
                });

              }
            }
          });
        });
      }
    } else {
      this.navBreadCrumbForDisableUXAddon(bmenuResponse, screen);
    }
  }

  navBreadCrumbForDisableUXAddon(bmenuResponse: any, screen: any) {
    bmenuResponse.menus.forEach(belement => {
      if (belement.menuLabel === "MODULE_LOAN_SERVICES") {
        belement.subMenus.forEach(subelement => {
          if (screen === 'productListing') {
            if (subelement.productCode === this.productCode) {
              this.breadmenuObj = [

              ];
            }
          }
          else if (screen === 'productScreen' || screen === 'reviewScreen' || screen === 'facilityOverView') {
            if ((subelement.productCode === this.productCode && this.subProductCode === 'LNDR')
              || (subelement.productCode === this.productCode && this.mode === 'INITIATE')
              || (this.productCode === 'BK' && this.subProductCode === 'LNRPN')) {
              this.breadmenuObj = [
                {
                  label: this.translate.instant('N001_LN'),
                  url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/productListing'
                    + '?productCode=' + 'LN' + '&option=' + 'GENERAL'
                }

              ];
            } else if ((subelement.productCode === this.productCode && this.option === 'FACILITYOVERVIEW')) {
              this.breadmenuObj = [
                {
                  label: this.translate.instant('facilitiesList'),
                  url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/productListing'
                    + '?productCode=' + 'LN' + '&option=' + 'FACILITYLIST'
                }

              ];
            }

            else if (this.productCode === 'SE' && this.subProductCode === 'LNCDS') {
              this.breadmenuObj = [
                {
                  label: this.translate.instant('SE.LNCDS'),
                  url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName
                    + '#/productListing' + '?productCode=' + 'LN' + '&option=' + 'DT'
                }
              ];
            } else if ((this.productCode === 'FT' && this.subProductCode === 'LNFP')
              || (this.productCode === 'BK' && this.subProductCode === 'BLFP')) {
              this.breadmenuObj = [
                {
                  label: this.translate.instant('MODULE_FEE_PAYMENT'),
                  url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/productListing'
                    + '?productCode=' + 'FT' + '&subProductCode=' + 'LNFP' + '&option=' + 'GENERAL'
                }
              ];
            }
          }
        });
      }

      else if (belement.menuLabel === "MODULE_TRADE_SERVICES" && this.subProductCode !== 'LNFP') {
        belement.subMenus.forEach(subelement => {
          if (screen === 'productListing' && this.option === 'TEMPLATE') {
            if (subelement.productCode === this.productCode) {
              this.breadmenuObj = [
                {
                  label: this.translate.instant(subelement.subMenuLabel),
                  routerLink: [subelement.routerLink],
                  queryParams: {
                    productCode: subelement.productCode, widgetCode: subelement.widgetCode,
                    subProductCode: subelement.subProductCode, option: subelement.option
                  }
                }
              ];

            }

          }
          else if (screen === 'productListing' && !this.option) {
            this.breadmenuObj = [];
          }

          else if (screen === 'productScreen' || screen === 'reviewScreen') {
            if (subelement.productCode === this.productCode) {
              if (this.option === 'TEMPLATE') {
                this.breadmenuObj = [
                  {
                    label: this.translate.instant(subelement.subMenuLabel),
                    routerLink: [subelement.routerLink],
                    queryParams: {
                      productCode: subelement.productCode, widgetCode: subelement.widgetCode,
                      subProductCode: subelement.subProductCode, option: subelement.option
                    }
                  },
                  {
                    label: this.translate.instant(this.template),
                    url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/productListing'
                      + '?productCode=' + this.productCode + '&subProductCode=' + this.subProductCode + '&option=' + this.option
                  }
                ];
              } else {
                this.breadmenuObj = [
                  {
                    label: this.translate.instant(subelement.subMenuLabel),
                    routerLink: [subelement.routerLink],
                    queryParams: {
                      productCode: subelement.productCode, widgetCode: subelement.widgetCode,
                      subProductCode: subelement.subProductCode, option: subelement.option
                    }
                  }
                ];
              }
            }
          }
        });
      }
      else if (this.subProductCode !== 'LNCDS' && this.subProductCode !== 'LNFP') {

        if ((screen === 'productListing' && this.option !== 'TEMPLATE') || screen === 'tabPanelListing') {
          this.breadmenuObj = [];
        } else {
          belement.subMenus.forEach(subelement => {
            if (screen === 'productScreen' || screen === 'reviewScreen') {
              if (subelement.productCode === this.productCode) {
                this.breadmenuObj = [
                  {
                    label: this.translate.instant(subelement.subMenuLabel),
                    routerLink: [subelement.routerLink],
                    queryParams: {
                      productCode: subelement.productCode, widgetCode: subelement.widgetCode,
                      subProductCode: subelement.subProductCode, option: subelement.option
                    }
                  }
                ];
              }

            }
            else if (screen === 'commonProductScreen') {
              if (subelement.option === this.option) {
                this.breadmenuObj = [
                  {
                    label: this.translate.instant(subelement.subMenuLabel),
                    routerLink: [subelement.routerLink],
                    queryParams: {
                      option: subelement.option, widgetCode: subelement.widgetCode,
                      category: subelement.category
                    }
                  }
                ];
              }
            }
          });
        }
      }
    });

  }

  createBreadMenuObjForDashboard(belement: any) {
    this.breadmenuObj = [
      {
        label: this.translate.instant(belement.menuLabel),
        url: this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName
          + FccGlobalConstant.dashboardLink + this.menuValue
      },
    ];
  }

  createBreadMenuObjWithoutUrl(belement: any) {
    this.breadmenuObj = [
      {
        label: this.translate.instant(belement.menuLabel)
      },
    ];
  }

  createBreadMenuObjForListing(subelement: any) {
    this.breadmenuObj.push({
      label: this.translate.instant(subelement.subMenuLabel),
      url: subelement.subMenuUrl
    });
  }

  skipLink(targetId: string) {
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.setAttribute('tabindex', '0');
    }
  }
  getKeyCode(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === FccGlobalConstant.LENGTH_13) {
      setTimeout(() => {
        this.renderer.selectRootElement('#profileImage').focus();
      });
    }
  }

  profileFocusOut(event, dialog) {
    dialog.hide(event);
    setTimeout(() => {
      this.logoutTab.nativeElement.focus();
    });
  }

  updateDropList(op, event) {
    if (this.commonHeader) {
      this.switchViewProfile();
    } else {
      op.toggle(event);
      this.loadDashboardDropdown();
    }
  }

  genericRouteHandler(product: ProductList): void {
    this.dashboardRoutingService.genericRouteHandler(product);
    this.commonService.dashboardOptionsSubject.next(null);
  }

  filterProductName(product: string, size: number): string {
    return this.dashboardRoutingService.filterProductName(product, size);
  }

  layoutChangeCards(e) {
    // eslint-disable-next-line no-console
    console.log('layoutChangeCards -----');
    this.dashboardRoutingService.layoutChangeCards(e);
  }

  navigateToHelpdesk() {
    if (this.helpDeskFlag) {
      let helpDeskURL = '';
      helpDeskURL = this.fccGlobalConstantService.contextPath;
      helpDeskURL = helpDeskURL + this.fccGlobalConstantService.servletName;
      helpDeskURL = helpDeskURL + '#/productScreen?productCode=SE&subProductCode=CTCHP&tnxTypeCode=01&mode=INITIATE';
      window.open(helpDeskURL, '_self');
    }
  }

  navigateToPendingTask() {
    if (this.pendingListFlag) {
      let pendingApprovalURL = '';
      pendingApprovalURL = this.fccGlobalConstantService.contextPath;
      pendingApprovalURL = pendingApprovalURL + this.fccGlobalConstantService.servletName;
      pendingApprovalURL = pendingApprovalURL + `#/productListing?dashboardType=GLOBAL&option=${FccGlobalConstant.PENDING_APPROVAL}`;
      this.router.navigate([]).then(() => {
        window[FccGlobalConstant.DONT_SHOW_ROUTER] = false;
        const dojoContentElement = document.querySelector('.colmask');
        if (dojoContentElement && dojoContentElement !== undefined) {
          (dojoContentElement as HTMLElement).style.display = 'none';
        }
        window.open(pendingApprovalURL, '_self');
      });
    }
  }

  headerCardIconDetails() {
    this.commonService.getLandingPageDataAPI().subscribe(response => {
      if (response.status === FccGlobalConstant.HTTP_RESPONSE_SUCCESS) {
        const a = response.body.landingPageCustomizationDetailsList;
        for (let i = 0; i < a.length; i++) {
          if (a[i].identifier === FccGlobalConstant.LANDING_IDENTIFIER_ICON) {
            this.commonService.putLandingPageLinks('iconUrl' + i, this.contextPath + a[i].imagePath);
            this.commonService.putLandingPageLinks('product' + i, a[i].title);
            this.landingIconUrl.push({
              product: this.commonService.getLandingPageLinks('product' + i),
              iconUrl: this.commonService.getLandingPageLinks('iconUrl' + i)
            });
          }
        }
      }
    });
  }

  onClickHelpSection() {
    this.helpFlag = false;
    this.title = '';
    this.content = '';
    const url = window.location.href;
    const keyArray = url.split('/dashboard/');
    const dojoScreen = url.split('/screen/');
    let screen = window.location.hash.substring(2);
    const screenValue = window.location.hash.substring(2);
    if (screen !== null) {
      screen = screen.split('?')[FccGlobalConstant.LENGTH_0].split('/')[FccGlobalConstant.LENGTH_0];
    }
    const subProductCodeValue = this.helpContentSubProductCodeRequired.indexOf(this.productCode) > -1 ?
      this.subProductCode : FccGlobalConstant.EMPTY_STRING;
    if (screen === FccGlobalConstant.PRODUCT_LISTING_SCREEN &&
      screenValue.indexOf(FccGlobalConstant.CHECK_OPTION_TEMPLATE) > -1) {
      this.key = this.helpService.helpKeyProductListingTemplate(this.productCode, subProductCodeValue);
    } else if (screen === 'productListing') {
      if (
        !subProductCodeValue &&
        this.option &&
        this.option !== '' &&
        this.helpContentSubProductCodeRequired.indexOf(this.productCode) > -1
      ) {
        const keyId = this.productCode + '_' + this.option;
        this.key = keyId.length > 19 ? keyId.substr(0, 19) : keyId;
      } else if (
        !!subProductCodeValue &&
        this.option &&
        this.option !== '' &&
        this.helpContentSubProductCodeRequired.indexOf(this.productCode) > -1
      ) {
        const keyId = this.productCode + '_' + this.subProductCode + '_' + this.option;
        this.key = keyId.length > 19 ? keyId.substr(0, 19) : keyId;
      } else if(this.commonService.isnonEMptyString(this.productCode)){
        this.key = this.helpService.helpKeyProductListing(
          this.productCode,
          subProductCodeValue
        );
      } else if ((this.commonService.isEmptyValue(this.productCode) && this.option &&
      this.option !== '' )) {
        this.key = this.option;
      }
    } else if (screen === 'productScreen') {
      const tnxCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
      if ((tnxCode === FccGlobalConstant.N002_AMEND || tnxCode === FccGlobalConstant.N002_INQUIRE)
        && this.productCode === FccGlobalConstant.PRODUCT_TD) {
        this.key = this.productCode.concat('_').concat(subProductCodeValue).concat('_UWGD').concat('_UX');
      } else {
        this.key = this.helpService.helpKeyProductScreen(this.productCode, subProductCodeValue);
      }
    } else if (screen === 'reviewScreen') {
      this.key = this.helpService.helpKeyReviewScreen(this.productCode, subProductCodeValue);
    } else if (screen === FccConstants.TAB_PANEL_LISTING) {
      this.key = this.helpService.helpKeyTabPanelListing(this.widgetCode);
    } else if (screen === FccGlobalConstant.VIEW_CHEQUE_STATUS) {
      this.key = FccConstants.CHEQUE_SERVICES_CODE + '_STATUS_UX';
    } else if (screen === FccGlobalConstant.FACILITYOVERVIEW_SCREEN) {
      const keyId = this.productCode + '_' + this.option;
      this.key = keyId.length > 19 ? keyId.substr(0, 19) : keyId;
    } else if (keyArray && keyArray.length > 0 && keyArray[1] && keyArray[1] !== 'global') {
      this.key = FccGlobalConstant.DB_UX_KEY + keyArray[1].toUpperCase();
    } else {
      this.key = 'DB_UX_01';
    }
    this.accessKey = this.key; // placeholder to update as per defined convention
    if(dojoScreen.length > 1) {
     this.onlineHelpCentre();
    } else {
    this.helpServiceCall(this.accessKey);
    if (this.helpFlag) {
      this.helpServiceCall('DB_UX_01');
    }
  }
  }
  onClickHelp(event, op3) {
    const url = window.location.href;
    const dojoScreen = url.split('/screen/');
    if(dojoScreen.length > 1) {
      op3.hide(event);
     } else {
    op3.show(event);
  }
  }
  getContent() {
    return this.content;
  }
  onlineHelpCentre() {
    let helpCentreUrl = '';
    helpCentreUrl = this.contextPath + this.fccGlobalConstantService.servletName + '/screen/OnlineHelpScreen?helplanguage='
      + window.localStorage.language + '&accesskey=' + this.accessKey;
    window.open(helpCentreUrl, '_blank', 'top=40');
  }
  helpServiceCall(value) {
    this.helpService.getHelpSection(value).subscribe(response => {
      if (response) {
        this.title = response.Title;
        this.contentData = response.content;
        this.content = this.contentData.replace(/contextPath/g, this.contextPath);
      }
      if (this.title === '' && this.content === '') {
        this.helpFlag = true;
      }
    });
  }
}

interface LayoutChange {
  dashboardName: string;
  dashboardId: number;
  userDashboardId: number;
  dashboardVisibility: string;
}

