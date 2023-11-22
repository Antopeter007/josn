import { FccGlobalConfiguration } from './../../core/fcc-global-configuration';
import { LandingIconList } from './../../model/LandingIconList';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { CommonService } from './../../services/common.service';
import { ProductList } from './../../model/ProductList';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionValidateService } from './../../services/session-validate-service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { LandingContainerUrlList } from './../../model/LandingContainerUrlList';
import { LandingContainerVideoList } from './../../model/LandingContainerVideoList';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MenuService } from './../../services/menu.service';
import { LcReturnService } from '../../../corporate/trade/lc/initiation/services/lc-return.service';
import { ParamInitializerService } from '../../services/param-initializer.service';

@Component({
  selector: 'fcc-common-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})

export class LandingpageComponent implements OnInit {
  products: ProductList[];
  contextPath: any;
  customerID: any;
  productKey: any;
  userName: any;
  logoFilePath: string;
  landingContainerUrl: LandingContainerUrlList[] = [];
  landingContainerVideoUrl: LandingContainerVideoList[] = [];
  landingIconUrl: LandingIconList[] = [];
  landingFooterBG: string;
  homeUrl: string;
  changeLayout: string;
  isChecked: boolean;
  dir: string;
  dirWelcomeMsg: string;
  dirLogo: string;
  dirLandingCheck: string;
  urlSafe: SafeResourceUrl;
  convertedUrl: string;
  noVideos = false;
  classicRoutingUrl: string;
  numVisible = FccGlobalConstant.LENGTH_1;
  numScroll = FccGlobalConstant.LENGTH_1;
  dashboard = '/dashboard';
  configuredKeysList = 'PRODUCT_CARDS_ROUTING_ENABLE';
  keysNotFoundList: any[] = [];
  productRoutingEnable: any;
  res: any;
  logoFilePathText: string;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected commonService: CommonService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected sessionValidation: SessionValidateService,
    protected sanitizer: DomSanitizer,
    protected menuService: MenuService,
    protected translate: TranslateService,
    protected fccGlobalConfiguration: FccGlobalConfiguration,
    protected lcReturn: LcReturnService,
    protected paramInitializerService: ParamInitializerService
  ) {
    this.commonService.preventBackButton();
  }

  ngOnInit() {
    if (window[FccGlobalConstant.firstLogin] !== undefined && window[FccGlobalConstant.firstLogin] === false
      && window[FccGlobalConstant.changePassword] == true) {
        window[FccGlobalConstant.changePassword] = false;
      window[FccGlobalConstant.firstLogin] = true;
      window.location.reload();
    }
    this.lcReturn.getamountConfig();
    this.paramInitializerService.fetchParamData();
    this.commonService.getSwitchOnLAnguage();
    this.dir = localStorage.getItem('langDir');
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

    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.landingContainerUrlDetails();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.logoFilePath = this.contextPath + response.logoFilePath;
        this.landingFooterBG = this.contextPath + response.landingFooterBG;
        this.logoFilePathText = response.logoFileText;
        if ( response.subdomainloginallowed ) {
          this.homeUrl = response.subdomainhomeurls;
        } else {
          this.homeUrl = response.homeUrl;
        }
        this.changeLayout = response.selectedLayout;
      }
    });
    if (this.dir === 'rtl') {
      this.dirWelcomeMsg = 'p-col-12 welcome-msg-right';
      this.dirLogo = 'p-col-12 logo-img-right';
      this.dirLandingCheck = 'p-col-12 landingcheck-right';
    } else {
      this.dirWelcomeMsg = 'p-col-12 welcome-msg';
      this.dirLogo = 'p-col-12 logo-img';
      this.dirLandingCheck = 'p-col-12 landingcheck';
    }
    this.lcReturn.amountConfigMap.subscribe(data =>{
      sessionStorage.setItem('amountConfig', JSON.stringify(data));
    });
  }

  checkValue(checkEvent) {
    if (checkEvent && checkEvent.checked) {
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
    } else {
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
    }
  }

  layoutChange(e) {
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
            this.router.navigate([this.dashboard, this.res], { replaceUrl: true });
            this.commonService.productNameRoute = this.res;
          } else {
            this.setClassicUrlForCards(e);
          }
        }
      });
    }
  }

  landingContainerUrlDetails() {
    this.commonService.getLandingPageDataAPI().subscribe(response => {
      if (response.status === FccGlobalConstant.HTTP_RESPONSE_SUCCESS) {
       const a = response.body.landingPageCustomizationDetailsList;
       for (let i = 0; i < a.length; i++) {
        this.noVideos = true;
        if (a[i].identifier === FccGlobalConstant.LANDING_IDENTIFIER_LINK) {
          this.commonService.putLandingPageLinks('urlPath' + i, a[i].urlPath);
          this.commonService.putLandingPageLinks('imagePath' + i, this.contextPath + a[i].imagePath);
          this.commonService.putLandingPageLinks('title' + i, a[i].title);
          this.commonService.putLandingPageLinks('description' + i, a[i].description);
          this.commonService.putLandingPageLinks('altText' + i, a[i].altText);
          this.landingContainerUrl.push({
            urlPath: this.commonService.getLandingPageLinks('urlPath' + i),
            imagePath: this.commonService.getLandingPageLinks('imagePath' + i),
            title: this.commonService.getLandingPageLinks('title' + i),
            description: this.commonService.getLandingPageLinks('description' + i),
            altText: this.commonService.getLandingPageLinks('altText' + i)
          });
        }
        if (a[i].identifier === FccGlobalConstant.LANDING_IDENTIFIER_PATH) {
          this.commonService.putLandingPageLinks('urlVideoPath' + i, a[i].urlPath);
          this.commonService.putLandingPageLinks('altText' + i, a[i].altText);
          this.convertedUrl = this.commonService.getLandingPageLinks('urlVideoPath' + i) as string;
          this.landingContainerVideoUrl.push({
            urlLink:  this.convertedSafeUrl(this.convertedUrl),
            index: true,
            itemId: i,
            altText: this.commonService.getLandingPageLinks('altText' + i)
          });
        }
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

  convertedSafeUrl(safeUrl) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
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
          this.router.navigate(['/login']); // Handled as the action on menu which directs to Dojo wont have user details on session logout
        }
      },
      (error) => {
        if (error.status === FccGlobalConstant.STATUS_401) {
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
      this.router.navigate([`/${product.productUrl}/${this.productKey}`]);
    } else {
      this.layoutChange(product.product);
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

}
