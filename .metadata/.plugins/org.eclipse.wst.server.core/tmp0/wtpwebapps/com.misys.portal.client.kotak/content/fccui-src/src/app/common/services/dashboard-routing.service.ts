import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { TranslateService } from '@ngx-translate/core';
import { LandingIconList } from '../model/LandingIconList';
import { UserData } from '../model/user-data';
import { ProductList } from '../model/ProductList';
import { FccGlobalConfiguration } from '../core/fcc-global-configuration';
import { Router } from '@angular/router';
import { MenuService } from './menu.service';
import { CommonService } from './common.service';

@Injectable({ providedIn: 'root' })
export class DashboardRoutingService {

  public dashboardType = 'globalDashboard';
  public landingPageLinksMap = new Map([]);
  public productNameRoute = '';
  dashboard = '/dashboard';
  landingIconUrl: LandingIconList[] = [];
  classicRoutingUrl: string;
  productKey: any;
  keysNotFoundList: any[] = [];
  productRoutingEnable: any;
  configuredKeysList = 'PRODUCT_CARDS_ROUTING_ENABLE';
  res: any;
  userData: UserData = new UserData();
  products: ProductList[];

  constructor(
    protected http: HttpClient,
    public fccGlobalConstantService: FccGlobalConstantService,
    public translate: TranslateService,
    protected fccGlobalConfiguration: FccGlobalConfiguration,
    protected router: Router,
    protected menuService: MenuService,
    protected commonService: CommonService
  ) {}

  layoutChangeCards(e) {
    let dashboardName: string = e;
    if ('MENU_DM_INQUIRY' === dashboardName) {
        dashboardName = FccGlobalConstant.DM;
      }
    if ('MODULE_FCM' === dashboardName) {
        dashboardName = FccGlobalConstant.FCM;
      }
    const getModule = dashboardName.substring(0, FccGlobalConstant.LENGTH_7);
    if ( getModule === 'MODULE_') {
        const value = dashboardName.substring(FccGlobalConstant.LENGTH_7);
        this.res = value.slice(0, -FccGlobalConstant.LENGTH_9).toLocaleLowerCase();
      }
    if (dashboardName === 'globalDashboard') {
        this.res = dashboardName.substring(0, FccGlobalConstant.LENGTH_6);
      }
    if (dashboardName === '') {
        this.router.navigate([this.dashboard, dashboardName], { replaceUrl: true });
        this.commonService.productNameRoute = dashboardName;
      }
    this.keysNotFoundList = this.configuredKeysList.split(',');
    if (this.keysNotFoundList.length !== 0) {
        this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
          if (response.response && response.response === 'REST_API_SUCCESS') {
            this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
            this.productRoutingEnable = FccGlobalConfiguration.configurationValues.get('PRODUCT_CARDS_ROUTING_ENABLE');
            if (this.productRoutingEnable.indexOf(this.res) > -1) {
                const dontShowRouter = 'dontShowRouter';
                const servletName = window[FccGlobalConstant.SERVLET_NAME];
                const contextPath = this.commonService.getContextPath();
                const isUrlAcceptable = servletName && window.location.pathname + '#' === (contextPath + servletName) + '#';
                if (window[dontShowRouter] && window[dontShowRouter] === true && !isUrlAcceptable) {
                  let homeDojoUrl = '';
                  homeDojoUrl = this.fccGlobalConstantService.contextPath;
                  homeDojoUrl = homeDojoUrl + this.fccGlobalConstantService.servletName + '#/dashboard/' + this.res;
                  this.router.navigate([]).then(() => {
                    window[dontShowRouter] = false;
                    (document.querySelector('.colmask') as HTMLElement).style.display = 'none';
                    window.open(homeDojoUrl, '_self');
                  });
                } else {
                  this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                    this.router.navigate([this.dashboard, this.res]);
                    this.commonService.productNameRoute = this.res;
                  });
                }
            } else {
              this.setClassicUrlForCards(e);
            }
          }
        });
      }
  }


  // This method is just temporary approach and user will be navigated to the concerned dashboard once and when those dashboards are ready
  setClassicUrlForCards(menuLabel) {
    if (menuLabel === FccGlobalConstant.MODULE_FCM) {
      menuLabel = FccGlobalConstant.MODULE_CASH_SERVICES;
    }
    this.menuService
      .getMenu(this.fccGlobalConstantService.getMenuPath())
      .subscribe(resp => {
        if (resp.response === 'REST_API_SUCCESS') {
          for (const value of resp.menus) {
            if (menuLabel === value.menuLabel) {
              this.classicRoutingUrl = value.subMenus[0].subMenuUrl;
              this.classicLayoutChange(this.classicRoutingUrl);
            }
          }
        } else if (resp.response === 'REST_API_FAILED') {
          sessionStorage.removeItem('login');
          this.router.navigate(['/login']); // Handled for con-current login scenario as the action on
                                            // menu which directs to Dojo wont have user details on session logout
        }
      },
      (error) => {
        if (error.status === FccGlobalConstant.STATUS_401) {
          sessionStorage.removeItem('login');
          sessionStorage.setItem('isForceLogout', 'true');
          sessionStorage.removeItem('login');
          this.router.navigate(['/login']);
        }
      });
  }

  // This method is just temporary approach and user will be navigated to the concerned dashboard once and when those dashboards are ready
  classicLayoutChange(layoutUrl) {
    sessionStorage.setItem('dojoAngularSwitch', 'true');
    this.router.navigate([]).then(() => {
      window.open(layoutUrl, '_self');
    });
  }
  /**
   * Handles DOJO and Angular Routes based on Key Value within landing page
   */
  genericRouteHandler(product: ProductList): void {

    const cardType = product.productCategory;
    if (cardType === FccGlobalConstant.POWER_BI_TYPE) {
      this.productKey = this.filterProductName(product.product, FccGlobalConstant.LENGTH_5);
      const dontShowRouter = FccGlobalConstant.DONT_SHOW_ROUTER;
      let homeDojoUrl = '';
      homeDojoUrl = this.fccGlobalConstantService.contextPath;
      homeDojoUrl = homeDojoUrl + `${this.fccGlobalConstantService.servletName}#/${product.productUrl}/${this.productKey}`;

      if (window[dontShowRouter] && window[dontShowRouter] === true ) {
        this.loadfromDojoToAngular(homeDojoUrl);
      } else {
      this.router.navigate([`/${product.productUrl}/${this.productKey}`]);
      }
    } else {
      this.layoutChangeCards(product.product);
    }
  }
  /**
   * 2 TYPES OF PRODUCT name formats possible frm server side:
   * MODULE_PRODUCTNAME_SERVICES
   * MENU_PRODUCTNAME_ACTION
   * EX: If Product name is MENU_CORPORATE_TREASURER, RETURNS CORPORATE
   * Ex: iF Product name is MODULE_ADMINISTRATION_SERVICES, RETURNS ADMINISTRATION
   */
  filterProductName(product: string, size: number): string {
      const getModule = product.substring(0, size);
      const productNameAction = product.substring(size);
      if (getModule === 'MENU_') {
        return productNameAction.slice(0, -FccGlobalConstant.LENGTH_7);
      } else {
        return productNameAction.slice(0, -FccGlobalConstant.LENGTH_9);
      }
    }
    /**
     * Function to load the page when traversing from Dojo to Angular
     * Since used from couple of places in same file refactoring-sonar
     */
    loadfromDojoToAngular(path: string): void {
        const dontShowRouter = FccGlobalConstant.DONT_SHOW_ROUTER;
        this.router.navigate([]).then(() => {
        window[dontShowRouter] = false;
        (document.querySelector('.colmask') as HTMLElement).style.display = 'none';
        window.open(path, '_self');
      });
    }

}
