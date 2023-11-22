import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FCCFormGroup } from '../base/model/fcc-control.model';
import { FccGlobalConstant } from '../common/core/fcc-global-constants';
import { ProductParams } from '../common/model/params-model';
import { CommonService } from '../common/services/common.service';
import { FormModelService } from '../common/services/form-model.service';
import { CustomHeaderService } from '../custom-header.service';
import { MenuItem, SelectItem } from 'primeng/api';
import { MenuService } from '../common/services/menu.service';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from '../common/core/fcc-global-constant.service';
import { SessionValidateService } from '../common/services/session-validate-service';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { OverlayRef } from '@angular/cdk/overlay';
import { HideShowDeleteWidgetsService } from '../common/services/hide-show-delete-widgets.service';
import { LogoutService } from '../common/services/logout-service';
import { ResponseService } from '../common/services/response.service';
import { LogoutRequest } from '../common/model/logout-request';
import { DashboardService } from '../common/services/dashboard.service';
import { FccGlobalConfiguration } from '../common/core/fcc-global-configuration';
import { FccTaskService } from '../common/services/fcc-task.service';
import { LcConstant } from '../corporate/trade/lc/common/model/constant';
import { GlobalSearchComponent } from '../common/components/global-search/global-search.component';
import { UtilityService } from '../corporate/trade/lc/initiation/services/utility.service';
import { LcReturnService } from '../corporate/trade/lc/initiation/services/lc-return.service';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss']
})
export class CustomHeaderComponent implements OnInit {
  form: FCCFormGroup;
  model: any;
  headerJSON: any;
  contextPath: any;
  headerObject: any;
  breadcrumbObject: MenuItem[] = [];
  menuObject: MenuItem[] = [];
  topMenuObject: MenuItem[] = [];
  breadcrumbHome: any;
  displayMenu = false;
  hideForLanding: any;
  pithLarge: 'pi pi-th-large';
  activeIndex;
  two = 2;
  three = 3;
  four = 4;
  pipiHome: 'pi pi-home';
  topMenuDisplay: string;
  overlayRef: OverlayRef;
  @ViewChild('slideMenu') menu: any;
  @ViewChild('sideBar') sidebar: any;
  @ViewChild('skipFirst') skipFirst: ElementRef;
  @ViewChild('logoutTab') logoutTab: ElementRef;
  hideProfileOverlay = false;
  @Output() topMenuDisplayValue: EventEmitter<string> = new EventEmitter<
    string
  >();
  @Output() topMenuObj: EventEmitter<MenuItem[]> = new EventEmitter<
    MenuItem[]
  >();
  commonHeader = false;
  layout: any = [];
  lay: LayoutChange[] = [];
  selectedDropdownLayout: any;
  url = '';
  noLayout = [{ dashboardName: 'No Option' }];
  logoutRequest: LogoutRequest = new LogoutRequest();
  responseMessage;
  imagePath: any;
  profileImagePath: any;
  logoImagePath: any;
  userFirstName: any;
  userEmail = 'welcome@finastra.com';
  value: boolean;
  dir: string = localStorage.getItem('langDir');
  dirStyle;
  layoutChangesComes: any;
  configuredKey = ['PROFILE_IMAGE'];
  lastLoginLabel: string;
  showLastLogin: boolean;
  userDateTime: string;
  bankDateTime: string;
  isBankTime = false;
  toastPosition: string;
  checkCustomise;
  lcConstant = new LcConstant();
  language: SelectItem[] = [];
  configuredKeysListLanguage = 'AVAILABLE_LANGUAGES,LANGUAGE';
  keysNotFoundListLanguage: any[] = [];
  selectedLanguageValue = '';
  homeUrl: string;
  selectedLanguage: string;
  globalDashboardUrl: any;

  constructor(
    protected formModelService: FormModelService,
    protected commonService: CommonService,
    protected customHeaderService: CustomHeaderService,
    protected dialogService: DialogService,
    protected menuService: MenuService,
    protected translate: TranslateService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected sessionValidation: SessionValidateService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected logoutService: LogoutService,
    protected responseService: ResponseService,
    protected dashboardService: DashboardService,
    protected fccGlobalConfiguration: FccGlobalConfiguration,
    public location: Location,
    protected router: Router,
    protected datepipe: DatePipe,
    protected taskService: FccTaskService,
    protected renderer: Renderer2,
    protected utilityService: UtilityService,
    protected lcReturn: LcReturnService
  ) {
    this.imagePath = this.commonService.getImagePath();
    this.keysNotFoundListLanguage = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysListLanguage);
    if (this.keysNotFoundListLanguage.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundListLanguage.toString()).subscribe(response => {
        if (response) {
          const language = response.AVAILABLE_LANGUAGES.slice(1, response.AVAILABLE_LANGUAGES.length - 1).replace(/\s/g, '');
          this.initLanguage(language);
        }
      });
    } else {
      const language = FccGlobalConfiguration.configurationValues.get('AVAILABLE_LANGUAGES').replace(/\s|\[|\]/g, '');
      this.initLanguage(language);
    }
    this.breadcrumbHome = {
      icon: this.pipiHome,
      command: () => {
        this.breadcrumbObject = [];
        this.setMenulevel(0);
      }
    };
  }

  ngOnInit(): void {

    this.initializeFormGroup();

    this.translate.get('corporatechannels').subscribe(() => {
      this.initMenuObject();
    });

    this.translate.get('corporatechannels').subscribe(() => {
      this.hanldeHorizontalMenu();
    });

    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.loadSelectedLanguage();
    if (localStorage.getItem('language') === 'ar') {
      this.dir = 'rtl';
      } else {
      this.dir = 'ltr';
      }
    localStorage.setItem('langDir' , this.dir);
    this.handleUserDetails();
    this.sendTopMenuDisplayValue();
    this.getBankAndUserLastLogin();
    this.loadDashboardDropdown();

    this.dirStyle = this.dir === 'rtl' ? 'dirRtlStyle' : 'dirLtrStyle';
    this.toastPosition = this.dir === 'rtl' ? 'top-left' : 'top-right';
    this.lcReturn.getamountConfig();
    this.lcReturn.amountConfigMap.subscribe(data =>{
      sessionStorage.setItem('amountConfig', JSON.stringify(data));
    });
  }

  ngAfterViewInit() {
    this.hideIconLandingPage();
  }

  initializeFormGroup() {
    const params: ProductParams = {
      type: FccGlobalConstant.MODEL_HEADER
    };
    this.commonService.getProductModel(params).subscribe(
      response => {
        this.headerJSON = JSON.parse(JSON.stringify(response));
        this.headerObject = this.customHeaderService.getHeaderControl(this.headerJSON);
        if (this.headerObject.params && this.headerObject.params.menuIcon.rendered) {
          this.customHeaderService.isBurgerIconVisible.next(this.headerObject.params.menuIcon.rendered);
        }
        this.config();
        this.getProfileImage();
      });
  }

  config() {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.logoImagePath = this.contextPath + this.headerObject?.params?.logo?.path;
        if ( response.subdomainloginallowed ) {
          this.homeUrl = response.subdomainhomeurls;
        } else {
          this.homeUrl = response.homeUrl;
        }
        this.commonHeader = !response.enableUxAddOn;
        this.commonService.setEnableUxAddOn(response.enableUxAddOn);
        this.commonService.setAngularProducts(response.angularProducts);
        this.commonService.setAngularSubProducts(response.angularSubProducts);
      }
    });
  }

  hideSidebar(event) {
    this.sidebar.close(event);
  }

  initMenuObject() {
    this.menuService
      .getMenu(this.fccGlobalConstantService.getMenuPath())
      .subscribe(resp => {
        if (resp.response === 'REST_API_SUCCESS') {
          this.createMenuItems(resp);
        } else {
          this.commonService.clearCachedResponses();
        }
      });
  }

  createMenuItems(menuResponse) {
    let vertical;
    let product = [];
    let menu = [];
    let subMenu = [];
    let topVertical;
    let topProduct = [];
    let subProductCodeValue = '';
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

    menuResponse.menus.forEach(element => {
      element.subMenus.forEach(subElement => {
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
        if (subElement.routerLink !== undefined && subElement.routerLink !== null && subElement.routerLink !== '') {
          if (subElement.subProductCode !== '' && subElement.subProductCode !== null && subElement.subProductCode !== undefined) {
            subProductCodeValue = subElement.subProductCode;
          }
          if (subElement.widgetCode !== undefined && subElement.widgetCode !== null && subElement.widgetCode !== '') {
            product.push({
              label: this.translate.instant(subElement.subMenuLabel),
              icon: this.pithLarge,
              routerLink: [subElement.routerLink],
              queryParams: { productCode: subElement.productCode, widgetCode: subElement.widgetCode },
              command: (e: any) => {
                this.hideSidebar(e);
              }
            });
          } else {
            product.push({
              label: this.translate.instant(subElement.subMenuLabel),
              icon: this.pithLarge,
              routerLink: [subElement.routerLink],
              queryParams: { productCode: subElement.productCode, subProductCode: subProductCodeValue, option: subElement.option },
              command: (e: any) => {
                this.hideSidebar(e);
              }
            });
            subProductCodeValue = '';
         }
        } else if (subElement.subMenuUrl !== undefined && subElement.subMenuUrl !== null && subElement.subMenuUrl !== '') {
          product.push({
            label: this.translate.instant(subElement.subMenuLabel),
            icon: this.pithLarge,
            url: subElement.subMenuUrl,
            command: () => {
              this.displayMenu = false;
              // this.hideSidebar(e);
            }
          });
        } else {
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
        // TODO: Logic has to be enhanced if there are more number of subProducts
        if (subElement.routerLink !== undefined && subElement.routerLink !== null && subElement.routerLink !== '') {
          if (subElement.subProductCode !== '' && subElement.subProductCode !== null && subElement.subProductCode !== undefined) {
            subProductCodeValue = subElement.subProductCode;
          }
          if (subElement.widgetCode !== undefined && subElement.widgetCode !== null && subElement.widgetCode !== '') {
            topProduct.push({
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
            subProductCodeValue = '';
          }
        } else {
          topProduct.push({
            label: this.translate.instant(subElement.subMenuLabel),
            url: subElement.subMenuUrl
          });
        }
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
    this.topMenuObj.emit(this.topMenuObject);
    this.commonService.setMenuObject(this.menuObject);
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

  homePageRefresh() {
    this.commonService.dashboardProductPath = this.location.path();
    const dontShowRouter = 'dontShowRouter';
    let homeDojoUrl = '';
    if (!this.commonService.getEnableUxAddOn() && window[dontShowRouter] && window[dontShowRouter] === true) {
      homeDojoUrl = this.fccGlobalConstantService.contextPath;
      homeDojoUrl = homeDojoUrl + this.fccGlobalConstantService.servletName;
      homeDojoUrl = homeDojoUrl + '/screen?classicUXHome=true';
      window.open(homeDojoUrl, '_self');
    } else if (window[dontShowRouter] && window[dontShowRouter] === true) {
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
        this.router.navigate([this.commonService.dashboardProductPath]);
      });
    }
  }

  setMenulevel(level: number) {
    this.menu.left = 0 - this.menu.menuWidth * level;
  }

  skipLink(targetId: string) {
    const target = document.getElementById(targetId);
    target.setAttribute('tabindex', '-1');
    target.focus();
    target.setAttribute('tabindex', '0');
  }

  updateDropList(op, event) {
    if (this.commonHeader) {
      this.switchViewProfile();
    } else {
      op.toggle(event);
      this.loadDashboardDropdown();
    }
  }

  private handleUserDetails() {
    this.dashboardService.getUserDetails().subscribe(
      data => {
        this.userFirstName = data.firstName;
        if (data.contactInformation.email != null && data.contactInformation.email !== '') {
          this.userEmail = new DOMParser().parseFromString((data.contactInformation.email), 'text/html').documentElement.textContent;
        }
      },
      () => {
        //eslint : no-empty-function
       }
    );
  }

  profileFocusOut(event, dialog) {
    dialog.hide(event);
    setTimeout(() => {
      this.logoutTab.nativeElement.focus();
    });
  }

  getProfileImage() {
    this.profileImagePath = this.fccGlobalConstantService.contextPath + this.headerObject?.params?.profilePic?.path;
  }

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

  logout() {
    window[FccGlobalConstant.firstLogin] = false;
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
          localStorage.removeItem('isLanguagedChangedFlag');
          this.commonService.clearCachedData();
          if (this.overlayRef !== undefined) {
            this.overlayRef.dispose();
          }
          sessionStorage.removeItem('dojoAngularSwitch');
          let logoutDojoUrl = '';
          logoutDojoUrl = this.fccGlobalConstantService.contextPath;
          logoutDojoUrl = logoutDojoUrl + this.fccGlobalConstantService.servletName + '#/logout';
          this.router.navigate([]).then(() => {
            window[dontShowRouter] = false;
            const dojoContentElement = document.querySelector('.colmask');
            if (dojoContentElement && dojoContentElement !== undefined) {
              (dojoContentElement as HTMLElement).style.display = 'none';
            }
            window.open(logoutDojoUrl, '_self');
          });
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
          this.router.navigate(['']);
        }
      });
  }

  layoutchange(event) {
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

  getBankAndUserLastLogin() {
    this.commonService.getUserDetailsAPI().subscribe(
      res => {
        if (res.body.userLastLoginDateTime !== '' && res.body.userLastLoginDateTime !== undefined
        && res.body.userLastLoginDateTime !== null) {
          this.userDateTime = this.utilityService.transformDateTimeFormat(res.body.userLastLoginDateTime);
          this.commonService.getBankDetails().subscribe(
            bankRes => {
              if (bankRes.date !== '' && bankRes.date !== undefined && bankRes.date !== null) {
                this.bankDateTime = this.utilityService.transformDateTimeFormat(res.body.userLastLoginDateTime);
                this.bankDateTime = this.bankDateTime.concat('\xa0\xa0\xa0\xa0');
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

  private hanldeHorizontalMenu() {
    this.commonService.checkHorizontalMenuPage().subscribe(response => {
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

  sendTopMenuDisplayValue() {
    this.topMenuDisplayValue.emit(this.topMenuDisplay);
  }

  loadSelectedLanguage() {
    this.selectedLanguageValue = localStorage.getItem('language') ? localStorage.getItem('language') : 'en';
  }

  switchLanguage(selectedLanguage) {
    const code = this.fetchSelectedLanguageCode(selectedLanguage);
    const screen = window.location.hash.substring(2).split('?')[FccGlobalConstant.LENGTH_0].split('/')[FccGlobalConstant.LENGTH_0];
    if (code !== undefined || code !== '') {
      this.commonService.changeUserLanguage(code).subscribe(
        res => {
          if (res.response === 'success') {
            if (screen === 'productScreen') {
              setTimeout(() => {
                this.commonService.setSwitchOnLanguageForHeader(code);
                this.taskService.notifySaveTransactionfromTask$.next(true);
                window.location.reload();
              }, 5000);
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    keyPressOptions(event, op4) {
      const keycodeIs = event.which || event.keyCode;
      if (keycodeIs === this.lcConstant.thirteen) {
        setTimeout(() => {
          this.renderer.selectRootElement('#profileImage').focus();
        });
      }
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
        baseZIndex: 9999
      });
    }

    initLanguage(language) {
      language = language.split(',');
      language.forEach(
        value => {
          const langLocal = this.commonService.checKlanguage(value);
          const lang: {label: string, value: any}
          = { label: langLocal ,
            value: { name: langLocal, code: value }
          };
          this.language.push(lang);
      });
      if (this.language.length === 1){
        this.selectedLanguage = this.language[0].value;
        this.commonService.setSwitchOnLanguage(this.selectedLanguage);
        // this.dateAdapter.setLocale(this.commonService.getLocale(this.language[0].value.code));
      }
    }
}

interface LayoutChange {
  dashboardName: string;
  dashboardId: number;
  userDashboardId: number;
  dashboardVisibility: string;
}

