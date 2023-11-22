import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem, Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { FccConstants } from '../../core/fcc-constants';
import { LcReturnService } from '../../../corporate/trade/lc/initiation/services/lc-return.service';

import { FccGlobalConfiguration } from '../../core/fcc-global-configuration';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { DashboardObject } from '../../model/dashboard';
import { childProp, firstChild, secondChild } from '../../model/layout';
import { FccTaskService } from '../../services/fcc-task.service';
import { GlobalDashboardServcie } from '../../services/global-dashboard.service';
import { SidenavService } from '../../services/side-nav.service';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { CommonService } from './../../services/common.service';
import { HideShowDeleteWidgetsService } from './../../services/hide-show-delete-widgets.service';
import { ParamInitializerService } from '../../services/param-initializer.service';

@Component({
  selector: 'fcc-common-global-dashboard',
  templateUrl: './global-dashboard.component.html',
  styleUrls: ['./global-dashboard.component.scss'],
  providers: [MessageService, ConfirmationService, MatSidenavContainer]
})
export class GlobalDashboardComponent implements OnInit ,
OnDestroy, AfterViewInit {

  topMenuDisplay: string;
  sidePanelLength;
  sidePanel = [];
  rightTop = [];
  rightBottom = [];
  leftPanel = [];
  centerPanel = [];
  rightPanel = [];

  // mapped values from layout
  layoutObject: any;

  sidePanelSecondDashboard = [];
  sidePanelThirdDashboard = [];
  rightTopSecondDashboard = [];
  rightTopThirdDashboard = [];
  rightBottomSecondDashboard = [];
  rightBottomThirdDashboard = [];

  sidePanelAll = [];
  rightTopAll = [];
  rightBottomAll = [];
  centerPanelAll = [];
  rightPanelAll = [];
  leftPanelAll = [];
  dashboardType;
  topMenuObject: MenuItem[] = [];
  displayTopMenu;
  contextPath;
  dashboardBG;
  checkCustomise;
  getDashboardLayout;
  // overlay dashboard1
  checkForOverlayDisplay: boolean;
  checkForOverlayDisplaySidepanel: boolean;
  checkForOverlayDisplayRightBottom: boolean;
  // overlay dashboard2---
  checkForSecondOverlayRightTop: boolean;
  checkForSecondOverlaySidePanel: boolean;
  checkForSecondOverlayRightBottom: boolean;
  // overlay dashboard3----
  checkForThirdOverlayRightTop: boolean;
  checkForThirdOverlaySidePanel: boolean;
  checkForThirdOverlayRightBottom: boolean;
  // overlay dashboard4----
  checkForOverlayDisplayCenterpanel: boolean;
  checkForOverlayDisplayRightpanel: boolean;
  checkForOverlayDisplayLeftpanel: boolean;
  // End-------------------
  isDraggingEnabled;

  displaySecondPopupRightTop: boolean;
  displaySecondPopupSidePanel: boolean;
  displaySecondPopupRightBottom: boolean;

  displayThirdPopupRightTop: boolean;
  displayThirdPopupSidePanel: boolean;
  displayThirdPopupRightBottom: boolean;
  // DashboardType Declaration
  addRightTopIconsDisabled = true;
  addSidePanelIconsDisabled = true;
  addRightBottomIconsDisabled = true;
  addCenterPanelIconsDisabled = true;
  addRightPanelIconsDisabled = true;
  addLeftPanelIconsDisabled = true;


  // dynamic grid cols
  rowOfRow = [];
  rowOfCol = [];
  zValue;
  msgs: Message[] = [];
  display = false;
  dashboardData: any;
  dashboardID: string;
  dashboardObj = new DashboardObject();
  model: any;
  dashNameForm: UntypedFormGroup;
  getDetailsOfLoadedDashbord;
  errorState = false;
  saveDashboardMessage: any;
  dashboardOverRide = false;
  checked = true;
  disabled = true;
  menuToggleFlag;
  buttonDisabled = false;
  dashboardValidationMinLen;
  dashboardValidationMaxLen;
  dashboardValidationRegex;
  lastLoginLabel: string;
  showLastLogin: boolean;
  userDateTime: string;
  bankDateTime: string;
  isBankTime = false;
  dir: string = localStorage.getItem('langDir');
  saveType: any;
  subMenu = [];
  errorMessage: string;
  disableSaveButton = false;
  allowPersonalization: boolean;
  keysNotFoundList: any[] = [];
  configuredKeysList = 'DEALS_DASHBOARD_PERSONALIZATION_ENABLED';
  index = 0;
  tempWidgetNodes = [];
  accountList: any;
  @ViewChildren('listdefTable') items: QueryList<ElementRef>;
  @ViewChild('accountListContainer') accountListContainer: ElementRef;

  dashboardSubscription: Subscription;
  routeSubscription: Subscription;
  dealsDashBoardSubscription: Subscription;
  showAccountSummaryWidgets = true;
  constructor(
    protected commonService: CommonService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected translateService: TranslateService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected messageService: MessageService,
    protected router: Router,
    protected formBuilder: UntypedFormBuilder,
    protected activatedRoute: ActivatedRoute,
    protected datepipe: DatePipe,
    protected sidenavService: SidenavService,
    protected globalDashboardServcie: GlobalDashboardServcie,
    protected taskService: FccTaskService,
    protected fccGlobalConfiguration: FccGlobalConfiguration,
    protected route: ActivatedRoute,
    protected lcReturn: LcReturnService,
    protected paramInitializerService: ParamInitializerService
  ) {
    if (commonService.getLandingPage() === 'N') {
        this.commonService.preventBackButton();
    }
    this.dashboardSaveForm();
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
    this.commonService.getMenuValue().subscribe((value) => {
      this.menuToggleFlag = value;
    });
    setTimeout(() => {
      this.displayTopMenu = localStorage.getItem('topMenuDisplay');
    });
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });

    this.commonService.carouselIndex.subscribe((value) => {
      this.index = value;
    });

    this.hideShowDeleteWidgetsService.dashboard1overlayrighttop.subscribe(
      data => {
        this.checkForOverlayDisplay = data;
      }
    );

    this.hideShowDeleteWidgetsService.dashboard1overlaysidepanel.subscribe(
      data => {
        this.checkForOverlayDisplaySidepanel = data;
      }
    );

    this.hideShowDeleteWidgetsService.dashboard1overlayrightbottom.subscribe(
      data => {
        this.checkForOverlayDisplayRightBottom = data;
      }
    );
    this.hideShowDeleteWidgetsService.dashboard2overlayrighttop.subscribe(
      data => {
        this.checkForSecondOverlayRightTop = data;
      }
    );
    this.hideShowDeleteWidgetsService.dashboard2overlayrightbottom.subscribe(
      data => {
        this.checkForSecondOverlayRightBottom = data;
      }
    );
    this.hideShowDeleteWidgetsService.dashboard2overlaysidepanel.subscribe(
      data => {
        this.checkForSecondOverlaySidePanel = data;
      }
    );

    this.hideShowDeleteWidgetsService.dashboard3overlayrighttop.subscribe(
      data => {
        this.checkForThirdOverlayRightTop = data;
      }
    );

    this.hideShowDeleteWidgetsService.dashboard3overlaysidepanel.subscribe(
      data => {
        this.checkForThirdOverlaySidePanel = data;
      }
    );

    this.hideShowDeleteWidgetsService.dashboard3overlayrightbottom.subscribe(
      data => {
        this.checkForThirdOverlayRightBottom = data;
      }
    );

    this.hideShowDeleteWidgetsService.dashboard4overlaycenterpanel.subscribe(
      data => {
        this.checkForOverlayDisplayCenterpanel = data;
      }
    );

    this.hideShowDeleteWidgetsService.dashboard4overlayrightpanel.subscribe(
      data => {
        this.checkForOverlayDisplayRightpanel = data;
      }
    );

    this.hideShowDeleteWidgetsService.dashboard4overlayleftpanel.subscribe(
      data => {
        this.checkForOverlayDisplayLeftpanel = data;
      }
    );

    this.hideShowDeleteWidgetsService.checkToGetAllCards.subscribe(data => {
      if (data === true) {
        this.getAllCardsList('rightTop');
      } else {
        this.rightTopAll = [];
      }
    });

    this.hideShowDeleteWidgetsService.checkToGetAllCardsSidePanel.subscribe(
      data => {
        if (data === true) {
          this.getAllCardsList('sidePanel');
        } else {
          this.sidePanelAll = [];
        }
      }
    );

    this.hideShowDeleteWidgetsService.checkToGetAllCardsRightBottom.subscribe(
      data => {
        if (data === true) {
          this.getAllCardsList('rightBottom');
        } else {
          this.rightBottomAll = [];
        }
      }
    );

    this.hideShowDeleteWidgetsService.checkToGetAllCardsCenter.subscribe(
      data => {
        if (data === true) {
          this.getAllCardsList('centerPanel');
        } else {
          this.centerPanelAll = [];
        }
      }
    );

    this.hideShowDeleteWidgetsService.checkToGetAllCardsRight.subscribe(
      data => {
        if (data === true) {
          this.getAllCardsList('rightPanel');
        } else {
          this.rightPanelAll = [];
        }
      }
    );

    this.hideShowDeleteWidgetsService.checkToGetAllCardsLeft.subscribe(
      data => {
        if (data === true) {
          this.getAllCardsList('leftPanel');
        } else {
          this.leftPanelAll = [];
        }
      }
    );

    this.hideShowDeleteWidgetsService.dragDropEnableDesable.subscribe(data => {
      this.isDraggingEnabled = data;
    });

    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.dashboardBG = this.contextPath + response.dashboardBG;
        this.dashboardValidationMinLen = response.namedminLength;
        this.dashboardValidationMaxLen = response.namedmaxLength;
        this.dashboardValidationRegex = response.namedregex;
      }
    });
    this.dashboardSubscription = this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.getDashboardLayout = '';
      this.hideShowDeleteWidgetsService.customiseSubject.next(false);
      if(!this.routeSubscription) {
        this.routeSubscription = this.activatedRoute.params.subscribe(
          params => {
            if(params.name === FccConstants.ACC_SUMMARY) {
              document.body.style.overflowY = 'hidden';
              window.scroll(0,0);
            }
            this.commonService.productNameRoute = params.name;
            this.layoutLoading(data);
          }
          );
      } else {
        const params = this.route.snapshot.paramMap['params'];
        this.commonService.productNameRoute = params.name;
        this.layoutLoading(data);
      }
    });

    this.sidenavService.subMenu$.subscribe((items) => {
      this.subMenu = items;
    });
    if (!this.dealsDashBoardSubscription) {
    this.dealsDashBoardSubscription = this.activatedRoute.params.subscribe(
      params => {
        if (FccGlobalConfiguration.configurationValues.has('DEALS_DASHBOARD_PERSONALIZATION_ENABLED')) {
          const dashboardEnable = FccGlobalConfiguration.configurationValues.get('DEALS_DASHBOARD_PERSONALIZATION_ENABLED');
          if ((params.name === FccGlobalConstant.LOANDEALS ||
            params?.name?.toString().toUpperCase() === FccGlobalConstant.ACCOUNT_SUMMARY_DASHBOARD_TYPE) &&
            (dashboardEnable === 'false' || !dashboardEnable)) {
            this.allowPersonalization = false;
          } else {
            this.allowPersonalization = true;
          }
        } else {
          this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
          if (this.keysNotFoundList.length !== 0) {
            this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
              if (response.response && response.response === 'REST_API_SUCCESS') {
                this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
                const dashboardEnable = FccGlobalConfiguration.configurationValues.get('DEALS_DASHBOARD_PERSONALIZATION_ENABLED');
                if ((params.name === FccGlobalConstant.LOANDEALS ||
                  params?.name?.toString().toUpperCase() === FccGlobalConstant.ACCOUNT_SUMMARY_DASHBOARD_TYPE) &&
                  (dashboardEnable === 'false' || !dashboardEnable)) {
                  this.allowPersonalization = false;
                } else {
                  this.allowPersonalization = true;
                }
              }
            });
          }
        }
      }
    );
    }

    let paramsValue = '';
    if(!this.routeSubscription) {
      this.routeSubscription = this.activatedRoute.params.subscribe(
        params => {
          paramsValue = params.name;
        }
        );
    }
    if(this.commonService.isNonEmptyValue(paramsValue) && paramsValue === 'global') {
      const currentPathUrl = this.activatedRoute.snapshot['_routerState'].url;
      this.commonService.getDashboardUrl();
      const configuredPathUrl = this.commonService.globalDashboardUrl;
      if(this.commonService.isnonEMptyString(currentPathUrl) && this.commonService.isnonEMptyString(configuredPathUrl) &&
      currentPathUrl !== configuredPathUrl) {
        this.router.navigate([this.commonService.globalDashboardUrl]);
      }
    }
    this.lcReturn.amountConfigMap.subscribe(data =>{
      sessionStorage.setItem('amountConfig', JSON.stringify(data));
    });
  }

  ngAfterViewInit() {
    this.items.changes.subscribe(() => {
      this.tempWidgetNodes = this.items.toArray();
      this.commonService.noOfTablesLoaded.next(this.tempWidgetNodes.length);
    });
  }

  reloadAccountSummaryWidgets(){
    this.showAccountSummaryWidgets = false;
    setTimeout(() => {
      this.showAccountSummaryWidgets = true;
    }, FccGlobalConstant.LENGTH_1000);
  }


layoutLoading(data) {
    if (data !== null) {
      this.dashboardID = data.dashboardId;
    } else {
      this.dashboardID = '';
    }
    this.sidePanel = [];
    this.rightTop = [];
    this.rightBottom = [];
    this.leftPanel = [];
    this.rightPanel = [];
    this.centerPanel = [];
    this.getDetailsOfLoadedDashbord = {};

    this.hideShowDeleteWidgetsService.getUserDashboardData( this.dashboardID , this.commonService.productNameRoute).then((res) => {
      if (res && res.dashboardDataObject) {
        this.getDashboardLayout = res.layoutName;
        this.getDetailsOfLoadedDashbord = res;
        this.taskService.dashboardCategory = res.dashboardCategory;
        const layoutJSONData = (JSON.parse (res.layoutJSON)).firstLayout;
        this.layoutObject = this.globalDashboardServcie.getLayoutControls((JSON.parse (res.layoutJSON)));
        this.layoutDesign(layoutJSONData);

        this.dashboardData = res;

        const data = res.dashboardDataObject.widgetDetailsList.map(element => element.widgetName);
        this.accountList = data;
        this.commonService.getAccountList$.next(this.accountList);

        res.dashboardDataObject.widgetDetailsList.forEach(element => {
            if (element.widgetColumn === 3 && element.widgetRow === 3) {
                const smallCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
                'widgetSelector': string, 'permissionName': string, 'widgetName': string, 'widgetConfig': string,
                'widgetPosition': string } = {
                  widgetId: element.widgetId, widgetColumn: element.widgetColumn,
                   widgetRow: element.widgetRow, widgetSelector: element.widgetSelector, permissionName: element.permissionName,
                   widgetName: element.widgetName, widgetConfig: element.widgetConfig, widgetPosition: 'rightTop' };
                this.rightTop.push(smallCards);

            }
            if (element.widgetColumn === 3 && element.widgetRow === 6) {
                const mediumCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
                'widgetSelector': string, 'permissionName': string, 'widgetName': string, 'widgetConfig': string,
                'widgetPosition': string} = {
                  widgetId: element.widgetId, widgetColumn: element.widgetColumn,
                   widgetRow: element.widgetRow, widgetSelector: element.widgetSelector, permissionName: element.permissionName,
                   widgetName: element.widgetName, widgetConfig: element.widgetConfig, widgetPosition: 'sidePanel' };
                this.sidePanel.push(mediumCards);
            }
            if (element.widgetColumn === 9 && element.widgetRow === 9) {
                const largeCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
                'widgetSelector': string, 'permissionName': string, 'widgetName': string, 'widgetConfig': string,
                'widgetPosition': string } = {
                  widgetId: element.widgetId, widgetColumn: element.widgetColumn,
                   widgetRow: element.widgetRow, widgetSelector: element.widgetSelector, permissionName: element.permissionName,
                   widgetName: element.widgetName, widgetConfig: element.widgetConfig, widgetPosition: 'rightBottom' };
                this.rightBottom.push(largeCards);
            }
            if (element.widgetColumn === 2 && element.widgetRow === 2) {
              const leftCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
              'widgetSelector': string, 'permissionName': string, 'widgetName': string, 'widgetConfig': string,
              'widgetPosition': string } = {
                widgetId: element.widgetId, widgetColumn: element.widgetColumn,
                 widgetRow: element.widgetRow, widgetSelector: element.widgetSelector, permissionName: element.permissionName,
                 widgetName: element.widgetName, widgetConfig: element.widgetConfig, widgetPosition: 'leftPanel' };
              this.leftPanel.push(leftCards);
            }
            if (element.widgetColumn === 7 && element.widgetRow === 7) {
              const centerCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
              'widgetSelector': string, 'permissionName': string, 'widgetName': string, 'widgetConfig': string,
              'widgetPosition': string } = {
                widgetId: element.widgetId, widgetColumn: element.widgetColumn,
                 widgetRow: element.widgetRow, widgetSelector: element.widgetSelector, permissionName: element.permissionName,
                 widgetName: element.widgetName, widgetConfig: element.widgetConfig, widgetPosition: 'centerPanel' };
              this.centerPanel.push(centerCards);
            }

            if (element.widgetColumn === 7 && element.widgetRow === 3) {
              const rightCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
              'widgetSelector': string, 'permissionName': string, 'widgetName': string, 'widgetConfig': string,
              'widgetPosition': string } = {
                widgetId: element.widgetId, widgetColumn: element.widgetColumn,
                 widgetRow: element.widgetRow, widgetSelector: element.widgetSelector, permissionName: element.permissionName,
                 widgetName: element.widgetName, widgetConfig: element.widgetConfig, widgetPosition: 'rightPanel' };

              this.rightPanel.push(rightCards);
            }

        });
    }
  });
}

customize() {
  this.hideShowDeleteWidgetsService.rightTopTemp = this.rightTop;
  this.hideShowDeleteWidgetsService.sidePanelTemp = this.sidePanel;
  this.hideShowDeleteWidgetsService.rightBottomTemp = this.rightBottom;
  this.hideShowDeleteWidgetsService.centerPanelTemp = this.centerPanel;
  this.hideShowDeleteWidgetsService.rightPanelTemp = this.rightPanel;
  this.hideShowDeleteWidgetsService.leftPanelTemp = this.leftPanel;

  this.rightTopAll = [];
  this.sidePanelAll = [];
  this.rightBottomAll = [];
  this.centerPanelAll = [];
  this.rightPanelAll = [];
  this.leftPanelAll = [];

  this.hideShowDeleteWidgetsService.customiseSubject.next(true);
  this.hideShowDeleteWidgetsService.dragDropEnableDesable.next(true);
  this.addRightTopIconsDisabled = true;
  this.addSidePanelIconsDisabled = true;
  this.addRightBottomIconsDisabled = true;
  this.addCenterPanelIconsDisabled = true;
  this.addRightPanelIconsDisabled = true;
  this.addLeftPanelIconsDisabled = this.layoutObject.params.displaySideNav ? false : true;
}

overlayCall() {
  this.display = true;
}

// On Rename CheckBox selection in Save popup
onCheck(event) {
  if (event.checked) {
    this.dashNameForm.get('dashboardName').enable();
  } else {
    this.dashNameForm.get('dashboardName').disable();
    this.dashNameForm.patchValue({
      dashboardName: this.getDetailsOfLoadedDashbord.dashboardName
    });
  }
}

// On Save action after clicking on Personalize - updation of private dashboards
saveCustomise() {
  this.display = true;
  this.buttonDisabled = true;
  if (this.getDetailsOfLoadedDashbord.dashboardVisibility === 'private') {
    this.dashNameForm.patchValue({
      dashboardName: this.getDetailsOfLoadedDashbord.dashboardName
    });
    this.dashNameForm.patchValue({ dashboardCheckBox: false });
    this.dashboardOverRide = true;
    this.dashNameForm.get('dashboardName').disable();
    this.saveType = 'save';
  }
}

// On SaveAs action after clicking on Personalize - creation of private dashboards from public/private dashboards
saveAsCustomise() {
      this.display = true;
      this.buttonDisabled = true;
      if (this.getDetailsOfLoadedDashbord.dashboardVisibility === 'public' ||
      this.getDetailsOfLoadedDashbord.dashboardVisibility === 'private') {
        this.dashNameForm.patchValue({
          dashboardName: ''
        });
        this.dashboardOverRide = false;
        this.dashNameForm.get('dashboardName').enable();
        this.saveType = 'saveAs';
      }
}

toggleSavebutton(){
  if ( this.centerPanel.length > 0 || this.sidePanel.length > 0 || this.rightTop.length > 0 ||
    this.rightBottom.length > 0 || this.rightPanel.length > 0 ){
    return false;
  }else{
    return true;
  }
}


submitDashboardName() {
  this.disableSaveButton = true;
  if (this.layoutObject.params && this.layoutObject.params.displaySideNav) {
    this.hideShowDeleteWidgetsService.leftPanelTemp = this.leftPanel;
  }
  const finalArr = [...this.hideShowDeleteWidgetsService.sidePanelTemp, ...this.hideShowDeleteWidgetsService.leftPanelTemp,
    ...this.hideShowDeleteWidgetsService.rightTopTemp, ...this.hideShowDeleteWidgetsService.rightBottomTemp,
    ...this.hideShowDeleteWidgetsService.centerPanelTemp, ...this.hideShowDeleteWidgetsService.rightPanelTemp];

  if (this.getDetailsOfLoadedDashbord !== undefined || null) {
    this.dashboardObj.dashbaordId = this.getDetailsOfLoadedDashbord.dashboardId;
    this.dashboardObj.userDashboardId = this.getDetailsOfLoadedDashbord.userDashboardId;
    this.dashboardObj.dashboardName = this.dashNameForm.get('dashboardName').value;
    this.dashboardObj.dashboardTemplateId = this.getDetailsOfLoadedDashbord.dashboardTemplateId;
    this.dashboardObj.layoutId = this.getDetailsOfLoadedDashbord.layoutId;
    this.dashboardObj.layoutName = this.getDetailsOfLoadedDashbord.layoutName;
    if (this.getDetailsOfLoadedDashbord.dashboardVisibility === 'public') {
      this.dashboardObj.dashboardVisibility = 'private';
      this.dashboardObj.saveNewDashboard = true;
    }
    if (this.getDetailsOfLoadedDashbord.dashboardVisibility === 'private') {
      this.dashboardObj.dashboardVisibility = 'private';
      if (this.saveType === 'saveAs') {
        this.dashboardObj.saveNewDashboard = true;  // Parameter set for dashboard creation on SaveAs
      } else {
        this.dashboardObj.saveNewDashboard = false; // Parameter set for dashboard updation on Save
      }
    }
    this.dashboardObj.dashboardCategory = this.getDetailsOfLoadedDashbord.dashboardCategory;
    this.dashboardObj.dashboardDataObject = {
      widgetDetailsList: finalArr
    };
  }

  if (this.dashboardObj.saveNewDashboard === true) {  // Calling dashboard creation API
    this.commonService.createPersonalizedDashboad(this.dashboardObj).then(res => {
      this.disableSaveButton = false;
      this.dashboardResponseHandler(res);
    });
  } else if (this.dashboardObj.saveNewDashboard === false) {  // Calling dashboard updation API
    this.commonService.updatePersonalizedDashboad(this.dashboardObj).then(res => {
      this.disableSaveButton = false;
      this.dashboardResponseHandler(res);
    });
  }
}

  private dashboardResponseHandler(res: any) {
    const resBody: any = res;
    if (resBody) {
      const objForDashboardChange = {
        dashboardCategory: this.getDetailsOfLoadedDashbord.dashboardCategory,
        dashboardId: resBody.dashboardId,
        dashboardName: resBody.dashboardName,
        dashboardVisibility: this.dashboardObj.dashboardVisibility,
        userDashboardId: this.getDetailsOfLoadedDashbord.userDashboardId
      };
      if (resBody.error) {
        this.errorState = true;
        this.saveDashboardMessage = resBody.message;
        this.errorMessage = resBody.error.causes[0].userLanguageTitle;
      }
      if (resBody.message === 'Dashboard Saved Successfully' && resBody.successMessage === 'success') {
        this.display = false;
        this.savePPCustomize();
        this.getDetailsOfLoadedDashbord.dashboardVisibility = 'private';
        this.getDetailsOfLoadedDashbord.dashboardId = resBody.dashboardId;
        this.getDetailsOfLoadedDashbord.dashboardName = resBody.dashboardName;
        this.hideShowDeleteWidgetsService.flagForDropDown = false;
        this.commonService.dashboardOptionsSubject.next(objForDashboardChange);
      }
    }
  }

getAllCardsList(layoutIdentifier) {
  if (layoutIdentifier === 'rightTop') {
    this.rightTopAll = [];
  }
  if (layoutIdentifier === 'sidePanel') {
    this.sidePanelAll = [];
  }
  if (layoutIdentifier === 'rightBottom') {
    this.rightBottomAll = [];
  }
  if ( layoutIdentifier === 'centerPanel') {
    this.centerPanelAll = [];
  }
  if ( layoutIdentifier === 'rightPanel') {
    this.rightPanelAll = [];
  }
  if ( layoutIdentifier === 'leftPanel') {
    this.leftPanelAll = [];
  }

  this.hideShowDeleteWidgetsService.getAllComponentList(this.commonService.productNameRoute).then(widgetList => {
      widgetList.forEach(element => {
        if (layoutIdentifier === 'rightTop') {
          if (element.widgetColumn === 3 && element.widgetRow === 3) {
              const valueArray = [];
              for (let i = 0; i < this.rightTop.length; i++) {
                  valueArray.push(this.rightTop[i].widgetName);
              }
              if (valueArray.indexOf(element.widgetName) === -1) {
                  const smallCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
                   'widgetSelector': string, 'permissionName': string , 'widgetName': string, 'widgetConfig': string, 'existing': string,
                   'widgetPosition': string
                  } = { widgetId: element.widgetId,
                     widgetColumn: element.widgetColumn, widgetRow: element.widgetRow, widgetSelector: element.widgetSelector,
                     permissionName: element.permissionName, widgetName: element.widgetName, widgetConfig: element.widgetConfig,
                      existing: 'NO', widgetPosition: 'rightTop' };
                  this.rightTopAll.push(smallCards);
             } else {
                  const smallCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
                   'widgetSelector': string, 'permissionName': string, 'widgetName': string, 'widgetConfig': string
                   'existing': string, 'widgetPosition': string } = { widgetId: element.widgetId, widgetColumn: element.widgetColumn,
                     widgetRow: element.widgetRow, widgetSelector: element.widgetSelector, permissionName: element.permissionName,
                     widgetName: element.widgetName, widgetConfig: element.widgetConfig, existing: 'YES', widgetPosition: 'rightTop' };
                  this.rightTopAll.push(smallCards);
              }

          }
        }

        if (layoutIdentifier === 'sidePanel') {
        if (element.widgetColumn === 3 && element.widgetRow === 6) {
              const valueArray = [];
              for (let i = 0; i < this.sidePanel.length; i++) {
                  valueArray.push(this.sidePanel[i].widgetName);
              }
              if (valueArray.indexOf(element.widgetName) === -1) {
                  const mediumCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number, 'widgetSelector': string,
                  // eslint-disable-next-line max-len
                  'permissionName': string , 'widgetName': string, 'widgetConfig': string, 'existing': string, 'widgetPosition': string } = { widgetId: element.widgetId, widgetColumn: element.widgetColumn, widgetRow: element.widgetRow,
                     widgetSelector: element.widgetSelector, permissionName: element.permissionName ,
                     widgetName: element.widgetName, widgetConfig: element.widgetConfig, existing: 'NO', widgetPosition: 'sidePanel' };
                  this.sidePanelAll.push(mediumCards);
              } else {
                  const mediumCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number, 'widgetSelector': string,
                  'permissionName': string, 'widgetName': string, 'widgetConfig': string, 'existing': string, 'widgetPosition': string } = {
                    widgetId: element.widgetId, widgetColumn: element.widgetColumn, widgetRow: element.widgetRow,
                     widgetSelector: element.widgetSelector, permissionName: element.permissionName, widgetName: element.widgetName,
                     widgetConfig: element.widgetConfig, existing: 'YES', widgetPosition: 'sidePanel' };
                  this.sidePanelAll.push(mediumCards);
              }
          }
        }


        if (layoutIdentifier === 'rightBottom') {
          if (element.widgetColumn === 9 && element.widgetRow === 9) {
            let layoutConfig: any = FccGlobalConstant.EMPTY_STRING;
            if (this.commonService.isNonEmptyValue(element.widgetConfig)) {
              layoutConfig = JSON.parse(element.widgetConfig).layoutConfig;
            }

            if (this.commonService.isEmptyValue(layoutConfig)) {
              this.rightBottomCardSelector(element);
            } else {
              if (!layoutConfig.notApplicableLayout.includes(layoutIdentifier)) {
               this.rightBottomCardSelector(element);
              }
            }
          }
        }

        if (layoutIdentifier === 'centerPanel') {
          if (element.widgetColumn === 7 && element.widgetRow === 7) {
            const valueArray = [];
            for (let i = 0; i < this.centerPanel.length; i++) {
                valueArray.push(this.centerPanel[i].widgetName);
            }
            if (valueArray.indexOf(element.widgetName) === -1) {
              const centerCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
                'widgetSelector': string, 'permissionName': string , 'widgetName': string, 'widgetConfig': string,
                'existing': string, 'widgetPosition': string
              } = { widgetId: element.widgetId,
                  widgetColumn: element.widgetColumn, widgetRow: element.widgetRow, widgetSelector: element.widgetSelector,
                  permissionName: element.permissionName, widgetName: element.widgetName, widgetConfig: element.widgetConfig,
                  existing: 'NO', widgetPosition: 'centerPanel' };
              this.centerPanelAll.push(centerCards);
            } else {
              const centerCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
                'widgetSelector': string, 'permissionName': string, 'widgetName': string, 'widgetConfig': string
                'existing': string, 'widgetPosition': string } = { widgetId: element.widgetId, widgetColumn: element.widgetColumn,
                  widgetRow: element.widgetRow, widgetSelector: element.widgetSelector, permissionName: element.permissionName,
                  widgetName: element.widgetName, widgetConfig: element.widgetConfig, existing: 'YES', widgetPosition: 'centerPanel' };
              this.centerPanelAll.push(centerCards);
            }
          }
        }

        if (layoutIdentifier === 'rightPanel') {
          if (element.widgetColumn === 7 && element.widgetRow === 3) {
            const valueArray = [];
            for (let i = 0; i < this.rightPanel.length; i++) {
                valueArray.push(this.rightPanel[i].widgetName);
            }
            if (valueArray.indexOf(element.widgetName) === -1) {
              const rightCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
                'widgetSelector': string, 'permissionName': string , 'widgetName': string, 'widgetConfig': string,
                'existing': string, 'widgetPosition': string
              } = { widgetId: element.widgetId,
                  widgetColumn: element.widgetColumn, widgetRow: element.widgetRow, widgetSelector: element.widgetSelector,
                  permissionName: element.permissionName, widgetName: element.widgetName, widgetConfig: element.widgetConfig,
                  existing: 'NO', widgetPosition: 'rightPanel' };
              this.rightPanelAll.push(rightCards);
            } else {
              const rightCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
                'widgetSelector': string, 'permissionName': string, 'widgetName': string, 'widgetConfig': string
                'existing': string, 'widgetPosition': string } = { widgetId: element.widgetId, widgetColumn: element.widgetColumn,
                  widgetRow: element.widgetRow, widgetSelector: element.widgetSelector, permissionName: element.permissionName,
                  widgetName: element.widgetName, widgetConfig: element.widgetConfig, existing: 'YES', widgetPosition: 'rightPanel' };
              this.rightPanelAll.push(rightCards);
            }
          }
        }

        if (layoutIdentifier === 'leftPanel') {
          if (element.widgetColumn === 2 && element.widgetRow === 2) {
            const valueArray = [];
            for (let i = 0; i < this.leftPanel.length; i++) {
                valueArray.push(this.leftPanel[i].widgetName);
            }
            if (valueArray.indexOf(element.widgetName) === -1) {
              const leftCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
                'widgetSelector': string, 'permissionName': string , 'widgetName': string, 'widgetConfig': string, 'existing': string,
                'widgetPosition': string
              } = { widgetId: element.widgetId,
                  widgetColumn: element.widgetColumn, widgetRow: element.widgetRow, widgetSelector: element.widgetSelector,
                  permissionName: element.permissionName, widgetName: element.widgetName, widgetConfig: element.widgetConfig,
                  existing: 'NO', widgetPosition: 'leftPanel' };
              this.leftPanelAll.push(leftCards);
            } else {
              const leftCards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number,
                'widgetSelector': string, 'permissionName': string, 'widgetName': string, 'widgetConfig': string
                'existing': string, 'widgetPosition': string } = { widgetId: element.widgetId, widgetColumn: element.widgetColumn,
                  widgetRow: element.widgetRow, widgetSelector: element.widgetSelector, permissionName: element.permissionName,
                  widgetName: element.widgetName, widgetConfig: element.widgetConfig, existing: 'YES', widgetPosition: 'leftPanel' };
              this.leftPanelAll.push(leftCards);
            }
          }
        }
      });
  });
}

private rightBottomCardSelector(element) {
  const valueArray = [];
  for (let i = 0; i < this.rightBottom.length; i++) {
    valueArray.push(this.rightBottom[i].widgetName);
  }
  if (valueArray.indexOf(element.widgetName) === -1) {
    const largeCards: {
      'widgetId': string, 'widgetColumn': number, 'widgetRow': number, 'widgetSelector': string,
      'permissionName': string, 'widgetName': string, 'widgetConfig': string, 'existing': string, 'widgetPosition': string
    } = {
      widgetId: element.widgetId, widgetColumn: element.widgetColumn, widgetRow: element.widgetRow,
      widgetSelector: element.widgetSelector, permissionName: element.permissionName, widgetName: element.widgetName,
      widgetConfig: element.widgetConfig, existing: 'NO', widgetPosition: 'rightBottom'
    };
    this.rightBottomAll.push(largeCards);
  } else {
    const largeCards: {
      'widgetId': string, 'widgetColumn': number, 'widgetRow': number, 'widgetSelector': string,
      'permissionName': string, 'widgetName': string, 'widgetConfig': string, 'existing': string, 'widgetPosition': string
    } = {
      widgetId: element.widgetId, widgetColumn: element.widgetColumn, widgetRow: element.widgetRow,
      widgetSelector: element.widgetSelector, permissionName: element.permissionName, widgetName: element.widgetName,
      widgetConfig: element.widgetConfig, existing: 'YES', widgetPosition: 'rightBottom'
    };
    this.rightBottomAll.push(largeCards);
  }
}


setMenuObject(topMenuObj: MenuItem[]) {
    this.topMenuObject = topMenuObj;
  }

setDisplayTopMenu(displayTopMenu: string) {
    this.displayTopMenu = displayTopMenu;
  }

droplayout1sidePanel(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.hideShowDeleteWidgetsService.sidePanelTemp,
      event.previousIndex,
      event.currentIndex
    );
    this.sidePanel = this.hideShowDeleteWidgetsService.sidePanelTemp;
  }

droplayout1rightTop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.hideShowDeleteWidgetsService.rightTopTemp,
      event.previousIndex,
      event.currentIndex
    );
    this.rightTop = this.hideShowDeleteWidgetsService.rightTopTemp;
  }

droplayout1rightBottom(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.hideShowDeleteWidgetsService.rightBottomTemp,
      event.previousIndex,
      event.currentIndex
    );
    this.rightBottom = this.hideShowDeleteWidgetsService.rightBottomTemp;
  }

  droplayoutCenterPanel(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.hideShowDeleteWidgetsService.centerPanelTemp,
      event.previousIndex,
      event.currentIndex
    );
    this.centerPanel = this.hideShowDeleteWidgetsService.centerPanelTemp;
  }

  droplayoutRightPanel(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.hideShowDeleteWidgetsService.rightPanelTemp,
      event.previousIndex,
      event.currentIndex
    );
    this.rightPanel = this.hideShowDeleteWidgetsService.rightPanelTemp;
  }

  droplayoutLeftPanel(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.hideShowDeleteWidgetsService.leftPanelTemp,
      event.previousIndex,
      event.currentIndex
    );
    this.leftPanel = this.hideShowDeleteWidgetsService.leftPanelTemp;
  }

deleteCardLayout(data: string) {
    this.messageService.add({ life: 1000,
      key: 'myKey1',
      severity: 'success',
      detail: `${this.translateService.instant(
        data
      )} ${this.translateService.instant('is_component_deleted')}`
    });
  }

addCardToLAyout(id, column, row, selector, permissionName, widgetName, widgetConfig, layout) {
    const isalreadyExists = this.hideShowDeleteWidgetsService.addSmallWidgetActions(
      id, column, row, selector, permissionName, widgetName, widgetConfig, layout);

    if (isalreadyExists === true) {
      this.messageService.add({ life: 1000,
        key: 'myKey1',
        severity: 'success',
        detail:
          this.translateService.instant(widgetName) +
          ' ' +
          this.translateService.instant('is_component_added_exists')
      });
    } else {
        this.messageService.add({ life: 1000,
          key: 'myKey1',
          severity: 'success',
          detail:
            this.translateService.instant(widgetName) +
            ' ' +
            this.translateService.instant('is_component_added')
        });
    }

  }

savePPCustomize() {
    this.operationOfPersonalization();
  }

cancelCustomization() {
    this.operationOfPersonalization();
    this.layoutLoading(this.commonService.dashboardOptionsSubject.getValue());
    this.display = false;
    this.dashNameForm.reset();
    this.dashNameForm.patchValue({
      dashboardCheckBox: false
    });
  }

operationOfPersonalization() {
    this.hideShowDeleteWidgetsService.customiseSubject.next(false);
    this.hideShowDeleteWidgetsService.accountBalanceCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.IndividualAccountCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.OtherBankAccountCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.ongoingTaskCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.currencyConverterCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.currentExchangeRateCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.calanderCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.awbTrackingCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.fccNewsCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.availableAmountExportCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.availableAmountImportCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.loansOutstandingCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.outstandingBalanceCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.pendingApprovalCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.actionRequiredCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.tabMenuCardHideShow.next(false);
    this.hideShowDeleteWidgetsService.dragDropEnableDesable.next(false);
    this.hideShowDeleteWidgetsService.checkToGetAllCards.next(false);
    this.hideShowDeleteWidgetsService.checkToGetAllCardsSidePanel.next(false);
    this.hideShowDeleteWidgetsService.checkToGetAllCardsRightBottom.next(false);
    this.hideShowDeleteWidgetsService.checkToGetAllCardsCenter.next(false);
    this.hideShowDeleteWidgetsService.checkToGetAllCardsRight.next(false);
    this.hideShowDeleteWidgetsService.checkToGetAllCardsLeft.next(false);
    this.hideShowDeleteWidgetsService.rightTopTemp = [];
    this.hideShowDeleteWidgetsService.sidePanelTemp = [];
    this.hideShowDeleteWidgetsService.rightBottomTemp = [];
    this.hideShowDeleteWidgetsService.rightPanelTemp = [];
    this.hideShowDeleteWidgetsService.centerPanelTemp = [];
    this.hideShowDeleteWidgetsService.leftPanelTemp = [];
    this.hideShowDeleteWidgetsService.dashboard1overlayrighttop.next(false);
    this.hideShowDeleteWidgetsService.dashboard1overlaysidepanel.next(false);
    this.hideShowDeleteWidgetsService.dashboard1overlayrightbottom.next(false);
    this.hideShowDeleteWidgetsService.dashboard2overlayrighttop.next(false);
    this.hideShowDeleteWidgetsService.dashboard2overlaysidepanel.next(false);
    this.hideShowDeleteWidgetsService.dashboard2overlayrightbottom.next(false);
    this.hideShowDeleteWidgetsService.dashboard3overlayrighttop.next(false);
    this.hideShowDeleteWidgetsService.dashboard3overlaysidepanel.next(false);
    this.hideShowDeleteWidgetsService.dashboard3overlayrightbottom.next(false);
    this.hideShowDeleteWidgetsService.scriptWidgetComponent.next(false);
    this.hideShowDeleteWidgetsService.dashboard3overlayrighttop.next(false);
    this.hideShowDeleteWidgetsService.dashboard3overlayrightbottom.next(false);
    this.hideShowDeleteWidgetsService.dashboard4overlaycenterpanel.next(false);
    this.hideShowDeleteWidgetsService.dashboard4overlayrightpanel.next(false);
    this.hideShowDeleteWidgetsService.dashboard4overlayleftpanel.next(false);
    this.addLeftPanelIconsDisabled = this.layoutObject.params.displaySideNav ? false : true;
    window.scroll(0, 0);
  }

RightTopOverlay() {
    if (this.checkCustomise === true) {
      this.hideShowDeleteWidgetsService.checkToGetAllCards.next(true);
      this.hideShowDeleteWidgetsService.dashboard1overlayrighttop.next(true);
      this.hideShowDeleteWidgetsService.dashboard2overlayrighttop.next(true);
      this.hideShowDeleteWidgetsService.dashboard3overlayrighttop.next(true);
      this.addRightTopIconsDisabled = false;
    }
  }
SidepanelOverlay(styleclass) {
    this.scrollBottom(styleclass);
    if (this.checkCustomise === true) {
      this.hideShowDeleteWidgetsService.checkToGetAllCardsSidePanel.next(true);
      this.hideShowDeleteWidgetsService.dashboard1overlaysidepanel.next(true);
      this.hideShowDeleteWidgetsService.dashboard2overlaysidepanel.next(true);
      this.hideShowDeleteWidgetsService.dashboard3overlaysidepanel.next(true);
      this.addSidePanelIconsDisabled = false;
    }
  }

scrollBottom(styleclass) {
    const doc = document.getElementsByClassName(styleclass)[0] as HTMLElement;
    const left = doc.offsetLeft;
    const bottom = doc.offsetHeight + doc.offsetTop;
    window.scroll(left, bottom);
  }

RightBottomOverlay(styleclass?: any) {
  if (this.commonService.isnonEMptyString(styleclass)) {
    this.scrollBottom(styleclass);
    if (this.checkCustomise === true) {
        this.hideShowDeleteWidgetsService.checkToGetAllCardsRightBottom.next(
          true
        );
        this.hideShowDeleteWidgetsService.dashboard1overlayrightbottom.next(true);
        this.hideShowDeleteWidgetsService.dashboard2overlayrightbottom.next(true);
        this.hideShowDeleteWidgetsService.dashboard3overlayrightbottom.next(true);
        this.addRightBottomIconsDisabled = false;
      }
  }
  }

  centerPanelOverlay() {
    if (this.checkCustomise === true) {
      this.hideShowDeleteWidgetsService.checkToGetAllCardsCenter.next(true);
      this.hideShowDeleteWidgetsService.dashboard4overlaycenterpanel.next(true);
      this.addCenterPanelIconsDisabled = false;
    }
  }

  rightPanelOverlay() {
    if (this.checkCustomise === true) {
      this.hideShowDeleteWidgetsService.checkToGetAllCardsRight.next(true);
      this.hideShowDeleteWidgetsService.dashboard4overlayrightpanel.next(true);
      this.addRightPanelIconsDisabled = false;
    }
  }

  leftPanelOverlay() {
    if (this.checkCustomise === true) {
      this.hideShowDeleteWidgetsService.checkToGetAllCardsLeft.next(true);
      this.hideShowDeleteWidgetsService.dashboard4overlayleftpanel.next(true);
      this.addLeftPanelIconsDisabled = false;
    }
  }

secondDashboardLayout() {
    if (this.checkCustomise === true) {
      return 'p-dir-rev';
    }
    if (this.checkCustomise === false) {
      if ((this.rightTop.length === 0 ) && (this.rightBottom.length === 0)) {
        return null;
      } else {
        return 'p-dir-rev';
      }
    }
  }

receiveTopMenuDisplayValue($event) {
    this.topMenuDisplay = $event;
  }

layoutDesign(obj) {
    this.rowOfRow = [];
    let gridObj = {};
    obj.child.forEach((element, index) => {
      const indexOfParent = index;
      const paramObj = { width : element.width, smallDevice : element.smallDevice, mediumDevice : element.mediumDevice,
                    largeDevice : element.largeDevice, xtraLargeDevice : element.xtraLargeDevice };
      gridObj = { ...gridObj, ...paramObj };
      this.rowOfRow.push(gridObj);
      element.child.forEach((childElement, childElementindex) => {
          const getKey = Object.keys(childElement);
          this.zValue = childElement;
          const indexOfChild = childElementindex;
          if (indexOfChild === 0) {
            getKey.forEach((subChildElement, FfirstSubChildElementindex) => {
              const ind = FfirstSubChildElementindex;
              const prop = firstChild[ind];
              this.rowOfRow[indexOfParent][prop] = this.zValue[childProp[ind]];
            });
          }
          if (indexOfChild === 1) {
            getKey.forEach((subChildElement, secondSubChildElementIndex) => {
              const ind = secondSubChildElementIndex;
              const prop = secondChild[ind];
              this.rowOfRow[indexOfParent][prop] = this.zValue[childProp[ind]];
            });
          }
          this.zValue = null;
      });
    });
  }

styleObject1() {
    if (this.checkCustomise === false) {
      return null;
    }
    if (this.checkCustomise === true) {
      return { marginTop: FccGlobalConstant.LENGTH_8 + 'px' };
    }
  }

styleObject2() {
    if (this.checkCustomise === false) {
      if (this.rightTop?.length === 0) {
          return { marginTop: FccGlobalConstant.LENGTH_9 + 'px' };
      } else {
        return { marginTop: 0 + 'px' };
       }
    }
    if (this.checkCustomise === true) {
        return { marginTop: FccGlobalConstant.LENGTH_8 + 'px' };
    }
}

classObject1() {
    if (this.checkCustomise === true) {
      return 'p-col-' + this.rowOfRow[1].width + ' ' + 'p-lg-' + this.rowOfRow[1].largeDevice + ' ' +
              'p-sm-' + this.rowOfRow[1].smallDevice + ' ' + 'p-xl-' + this.rowOfRow[1].xtraLargeDevice + ' ' +
              'p-md-' + this.rowOfRow[1].mediumDevice;
    }
    if (this.checkCustomise === false) {
      if (this.sidePanel.length === 0 ) {
          return 'p-col-12 p-lg-12 p-sm-12 p-md-12';
      } else {
          // return 'p-col-12 p-lg-9 p-sm-9 p-md-9';
          return 'p-col-' + this.rowOfRow[1].width + ' ' + 'p-lg-' + this.rowOfRow[1].largeDevice + ' ' +
                  'p-sm-' + this.rowOfRow[1].smallDevice + ' ' + 'p-xl-' + this.rowOfRow[1].xtraLargeDevice + ' ' +
                  'p-md-' + this.rowOfRow[1].mediumDevice;
      }

    }
  }

classObject2() {
    if (this.checkCustomise === true) {
      return 'p-col-12 p-lg-9 p-sm-12 p-md-12';
    }
    if (this.checkCustomise === false) {
      if (this.sidePanel.length === 0) {
        return 'p-col-12 p-lg-12 p-sm-12 p-md-12';
    } else {
        return 'p-col-12 p-lg-9 p-sm-12 p-md-12';
    }
    }
  }


dashboardSaveForm() {
    this.dashNameForm = this.formBuilder.group({
      dashboardName: [''],
      dashboardCheckBox : false,
      errorMessage: ''
    });
  }
  onFocusInput() {
    this.errorState = false;
  }

  onCloseDialog() {
    this.dashNameForm.get('dashboardName').clearValidators();
    this.errorState = false;
    this.buttonDisabled = false;
  }
  onShowDialog() {
    this.dashNameForm.get('dashboardName').setValidators([
      Validators.pattern(this.dashboardValidationRegex), Validators.required,
      Validators.minLength(this.dashboardValidationMinLen),
      Validators.maxLength(this.dashboardValidationMaxLen)]);
      this.addAccessibilityControl();
  }

  addAccessibilityControl(): void {
    const titleBarCloseList = Array.from(document.getElementsByClassName('ui-dialog-titlebar-close'));
    titleBarCloseList.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant('close');
      element[FccGlobalConstant.TITLE] = this.translateService.instant('close');
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onKeyUpInput(event) {
    this.dashNameForm.valueChanges.subscribe(() => {
        const value = this.dashNameForm.get('dashboardName').value;
        if (value.length >= FccGlobalConstant.LENGTH_3) {
          // this.buttonDisabled = false;
        }
    });
  }

  onScroll(e) {
    const colFilterEle:any = document.querySelector('.ui-multiselect-panel.ui-widget') ;
    if(colFilterEle){
      colFilterEle.style.visibility = 'hidden';
    }
    this.tempWidgetNodes = this.tempWidgetNodes.filter((item) => item.nativeElement.childNodes.length);
    const scrollTop = e.target.scrollTop;
    this.tempWidgetNodes.forEach(() => {
      if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight)) {
        this.commonService.carouselscrollIndex.next(0);
      } else if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight +
        this.tempWidgetNodes[1].nativeElement.clientHeight) &&
        scrollTop > (this.tempWidgetNodes[0].nativeElement.clientHeight)) {
          this.commonService.carouselscrollIndex.next(1);
      } else if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight +
        this.tempWidgetNodes[1].nativeElement.clientHeight + this.tempWidgetNodes[2].nativeElement.clientHeight)
        && scrollTop > (this.tempWidgetNodes[0].nativeElement.clientHeight +
          this.tempWidgetNodes[1].nativeElement.clientHeight)) {
            this.commonService.carouselscrollIndex.next(2);
      } else if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight +
        this.tempWidgetNodes[1].nativeElement.clientHeight + this.tempWidgetNodes[2].nativeElement.clientHeight +
        this.tempWidgetNodes[3].nativeElement.clientHeight) && scrollTop >
        (this.tempWidgetNodes[0].nativeElement.clientHeight + this.tempWidgetNodes[1].nativeElement.clientHeight
          + this.tempWidgetNodes[2].nativeElement.clientHeight)) {
            this.commonService.carouselscrollIndex.next(3);
      } else if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight +
        this.tempWidgetNodes[1].nativeElement.clientHeight + this.tempWidgetNodes[2].nativeElement.clientHeight
        + this.tempWidgetNodes[3].nativeElement.clientHeight + this.tempWidgetNodes[4].nativeElement.clientHeight)
        && scrollTop > (this.tempWidgetNodes[0].nativeElement.clientHeight +
          this.tempWidgetNodes[1].nativeElement.clientHeight + this.tempWidgetNodes[2].nativeElement.clientHeight +
          this.tempWidgetNodes[3].nativeElement.clientHeight)) {
            this.commonService.carouselscrollIndex.next(4);
      }
    });

  }

  onCoruoselClick() {
    let topPosition = FccGlobalConstant.ZERO;
    this.tempWidgetNodes = this.tempWidgetNodes.filter((item) => item.nativeElement.childNodes.length);
    this.tempWidgetNodes.forEach((item, i) => {
      if (i === this.index) {
        const offsetTop = FccGlobalConstant.LENGTH_1 * FccGlobalConstant.LENGTH_10;
        this.accountListContainer.nativeElement.scrollTop = topPosition ? topPosition + offsetTop : topPosition;
      }
      topPosition += item.nativeElement.offsetHeight;
    });
  }

  ngOnDestroy() {
    this.hideShowDeleteWidgetsService.flagForDropDown = false;
    if(this.routeSubscription){
      this.routeSubscription.unsubscribe();
    }
    if(this.dashboardSubscription){
      this.dashboardSubscription.unsubscribe();
    }
    document.body.style.overflowY = 'auto';
  }

}

