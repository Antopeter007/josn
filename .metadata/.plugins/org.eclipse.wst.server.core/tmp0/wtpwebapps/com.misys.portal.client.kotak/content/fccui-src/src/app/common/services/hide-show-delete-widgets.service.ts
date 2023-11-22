
import { FccGlobalConstantService } from './../core/fcc-global-constant.service';
import { CommonService } from '../../common/services/common.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class HideShowDeleteWidgetsService {
  contextPath = window[FccGlobalConstant.CONTEXT_PATH];
  public dashboardOptionsSubject = new BehaviorSubject<any>('layout1');
  public customiseSubject = new BehaviorSubject(false);

  // layout1 store length of cards in panels <<<<<<<<<<<<<<<<<<<//
  public dashboard1sidePanel = new BehaviorSubject(0);
  public dashboard1rightTop = new BehaviorSubject(0);
  public dashboard1rightBottom = new BehaviorSubject(0);
  // End Of store action for panel >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

  // All cards Action RightTop start<<<<<<<<<<<< //
  public accountBalanceCardHideShow = new BehaviorSubject(false);
  public IndividualAccountCardHideShow = new BehaviorSubject(false);
  public OtherBankAccountCardHideShow = new BehaviorSubject(false);
  public dailyAuthLimitCardHideShow = new BehaviorSubject(false);
  public miniStatementCardHideShow = new BehaviorSubject(false);
  public ongoingTaskCardHideShow = new BehaviorSubject(false);
  // Action Closed For Right TOp PAnel>>>>>>>>>>>>>>>>>>>>>//

  // All Cards Action SidePAnel <<<<<<<<<<<<<<///
  public currencyConverterCardHideShow = new BehaviorSubject(false);
  public currentExchangeRateCardHideShow = new BehaviorSubject(false);
  public calanderCardHideShow = new BehaviorSubject(false);
  public awbTrackingCardHideShow = new BehaviorSubject(false);
  public actionRequiredCardHideShow = new BehaviorSubject(false);
  public pendingApprovalCardHideShow = new BehaviorSubject(false);
  public tabMenuCardHideShow = new BehaviorSubject(false);
  public genericHtmlComp = new BehaviorSubject(false);
  public listdefCommonComp = new BehaviorSubject(false);
  public loanDealSummary = new BehaviorSubject(false);
  public listdefChartComp = new BehaviorSubject(false);
  public dealOverviewComp = new BehaviorSubject(false);
  // End >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

  // All cards Action Right Bottom <<<<<<<<<<<<//
  public fccNewsCardHideShow = new BehaviorSubject(false);
  public availableAmountExportCardHideShow = new BehaviorSubject(false);
  public availableAmountImportCardHideShow = new BehaviorSubject(false);
  public loansOutstandingCardHideShow = new BehaviorSubject(false);
  public outstandingBalanceCardHideShow = new BehaviorSubject(false);
  public approvedTransactionsByBankComponent = new BehaviorSubject(false);
  public rejectedTransactionsByBankComponent = new BehaviorSubject(false);
  public scriptWidgetComponent = new BehaviorSubject(false);
  public iframeWidgetComponent = new BehaviorSubject(false);
  // End >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

  // Actions for layout1 Right Top PAnel <<<<<<<<<<<<<<< //
  public checkToGetAllCards = new BehaviorSubject(false);
  public dragDropEnableDesable = new BehaviorSubject(false);
  public dashboard1deletealloverlay = new BehaviorSubject(false);
  // End Actions fro Right Top PAnel >>>>>>>>>>>>>>>>>>>>>>>>//

  // Action For Dashboard Side Panel <<<<<<<<<<<<<<<<<<<<//
  public checkToGetAllCardsSidePanel = new BehaviorSubject(false);
  public dragDropEnableDesableSidePanel = new BehaviorSubject(false);
  public dashboard1deletealloverlaySidePanel = new BehaviorSubject(false);
  // End >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

  // Action for Dashboard right Bottom <<<<<<<<<<<<<<<<<//
  public checkToGetAllCardsRightBottom = new BehaviorSubject(false);
  public dragDropEnableDesableRightBottom = new BehaviorSubject(false);
  public dashboard1deletealloverlayRightBottom = new BehaviorSubject(false);

  // Action for center panel <<<<<<<<<<<<<<
  public checkToGetAllCardsCenter = new BehaviorSubject(false);
  public dragDropEnableDesableCenter = new BehaviorSubject(false);
  public dashboard1deletealloverlayCenter = new BehaviorSubject(false);

  // Action for right panel <<<<<<<<<<<<<<
  public checkToGetAllCardsRight = new BehaviorSubject(false);
  public dragDropEnableDesableRight = new BehaviorSubject(false);
  public dashboard1deletealloverlayRight = new BehaviorSubject(false);

  // Action for left panel <<<<<<<<<<<<<<
  public checkToGetAllCardsLeft = new BehaviorSubject(false);
  public dragDropEnableDesableLeft = new BehaviorSubject(false);
  public dashboard1deletealloverlayLeft = new BehaviorSubject(false);

  // End >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

  // overlay when zero element present in panel
  public dashboard2deletealloverlay = new BehaviorSubject(false);
  public dashboard2deletealloverlaySidePanel = new BehaviorSubject(false);
  public dashboard2deletealloverlayRightBottom = new BehaviorSubject(false);

  public dashboard3deletealloverlay = new BehaviorSubject(false);
  public dashboard3deletealloverlaySidePanel = new BehaviorSubject(false);
  public dashboard3deletealloverlayRightBottom = new BehaviorSubject(false);
  // End-------------------------------------

  // OVerLay OPEn <<<<<<<<<<<<<<<<<<//
  public dashboard1overlayrighttop = new BehaviorSubject(false);
  public dashboard1overlaysidepanel = new BehaviorSubject(false);
  public dashboard1overlayrightbottom = new BehaviorSubject(false);
  // end >>>>>>>>>>>>>>>>>>>>>>>>>>>//

  // overlay dashboard2---
  public dashboard2overlayrighttop = new BehaviorSubject(false);
  public dashboard2overlaysidepanel = new BehaviorSubject(false);
  public dashboard2overlayrightbottom = new BehaviorSubject(false);
  // End----------------

  // overlay dashboard3--
  public dashboard3overlayrighttop = new BehaviorSubject(false);
  public dashboard3overlaysidepanel = new BehaviorSubject(false);
  public dashboard3overlayrightbottom = new BehaviorSubject(false);
  // End-----------------

  // Overlay dashboard4---
  public dashboard4overlaycenterpanel = new BehaviorSubject(false);
  public dashboard4overlayrightpanel = new BehaviorSubject(false);
  public dashboard4overlayleftpanel = new BehaviorSubject(false);
  // end >>>>>>>>>>>>>>>>>>>>>>>>>>>//

  // TEmp array for dahboard1 //
  rightTopTemp = [];
  sidePanelTemp = [];
  rightBottomTemp = [];

  // dashboard 4
  centerPanelTemp = [];
  rightPanelTemp = [];
  leftPanelTemp = [];
  // End >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

  // temp array fro dashboard2
  rightTopSecondTempArr = [];
  sidePanelSecondTempArr = [];
  rightBottomSecondTempArr = [];
  // End

  rightTopThirdTempArr = [];
  sidePanelThirdTempArr = [];
  rightBottomThirdTempArr = [];

  overlayOn = false;
  selectedDashboard;
  flagForDropDown = false;

  constructor(
    protected http: HttpClient,
    protected commonService: CommonService,
    protected fccGlobalConstantService: FccGlobalConstantService
  ) {}

  getSmallWidgetActions(data, layoutType) {
    // ------------------------------------------------------------>
    if (layoutType === 'rightTop') {
        for (let i = 0; i < this.rightTopTemp.length; i++) {
          const value = this.rightTopTemp[i].widgetName;
          if (value === data) {
            this.rightTopTemp.splice(i, 1);
            this.checkToGetAllCards.next(true);
          }
        }
        if (this.rightTopTemp.length === 0) {
          this.dashboard1overlayrighttop.next(true);
        }
    }
    // ----------------------------------------------------------->
    if (layoutType === 'sidePanel') {
        for (let i = 0; i < this.sidePanelTemp.length; i++) {
          const value = this.sidePanelTemp[i].widgetName;
          if (value === data) {
            this.sidePanelTemp.splice(i, 1);
            this.checkToGetAllCardsSidePanel.next(true);
          }
        }
        if (this.sidePanelTemp.length === 0) {
          this.dashboard1overlaysidepanel.next(true);
        }
    }
    //  ------------------------------------------------------------>
    if (layoutType === 'rightBottom') {
        for (let i = 0; i < this.rightBottomTemp.length; i++) {
          const value = this.rightBottomTemp[i].widgetName;
          if (value === data) {
            this.rightBottomTemp.splice(i, 1);
            this.checkToGetAllCardsRightBottom.next(true);
          }
        }
        if (this.rightBottomTemp.length === 0) {
          this.dashboard1overlayrightbottom.next(true);
        }
    }

    if (layoutType === 'centerPanel') {
      for (let i = 0; i < this.centerPanelTemp.length; i++) {
        const value = this.centerPanelTemp[i].widgetName;
        if (value === data) {
          this.centerPanelTemp.splice(i, 1);
          this.checkToGetAllCardsCenter.next(true);
        }
      }
      if (this.centerPanelTemp.length === 0) {
        this.dashboard4overlaycenterpanel.next(true);
      }
    }

    if (layoutType === 'rightPanel') {
      for (let i = 0; i < this.rightPanelTemp.length; i++) {
        const value = this.rightPanelTemp[i].widgetName;
        if (value === data) {
          this.rightPanelTemp.splice(i, 1);
          this.checkToGetAllCardsRight.next(true);
        }
      }
      if (this.rightPanelTemp.length === 0) {
        this.dashboard4overlayrightpanel.next(true);
      }
    }

    if (layoutType === 'leftPanel') {
      for (let i = 0; i < this.leftPanelTemp.length; i++) {
        const value = this.leftPanelTemp[i].widgetName;
        if (value === data) {
          this.leftPanelTemp.splice(i, 1);
          this.checkToGetAllCardsLeft.next(true);
        }
      }
      if (this.leftPanelTemp.length === 0) {
        this.dashboard4overlayleftpanel.next(true);
      }
    }
  }

  addSmallWidgetActions(widgetId , widgetColumn , widgetRow , widgetSelector, permissionName, widgetName, widgetConfig, layout ) {
    let isalreadyExists = true;

    if (layout === 'rightTop') {
        const valueArray = [];
        for (let i = 0; i < this.rightTopTemp.length; i++) {
          valueArray.push(this.rightTopTemp[i].widgetName);
        }
        if (valueArray.indexOf(widgetName) === -1) {
          const cards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number, 'widgetSelector': string,
           'permissionName': string, 'widgetName': string, 'widgetConfig': string, 'widgetPosition': string}
          = { widgetId, widgetColumn, widgetRow, widgetSelector, permissionName, widgetName, widgetConfig, widgetPosition: 'rightTop' };
          this.rightTopTemp.push(cards);
          this.checkToGetAllCards.next(true);
          isalreadyExists = false;
        }

    }

    if (layout === 'sidePanel') {
        const valueArray2 = [];
        for (let i = 0; i < this.sidePanelTemp.length; i++) {
          valueArray2.push(this.sidePanelTemp[i].widgetName);
        }
        if (valueArray2.indexOf(widgetName) === -1) {
          const cards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number, 'widgetSelector': string,
          'permissionName': string, 'widgetName': string, 'widgetConfig': string, 'widgetPosition': string}
          = { widgetId, widgetColumn, widgetRow, widgetSelector, permissionName, widgetName, widgetConfig, widgetPosition: 'sidePanel' };
          this.sidePanelTemp.push(cards);
          this.checkToGetAllCardsSidePanel.next(true);
          isalreadyExists = false;
        }
    }

    if (layout === 'rightBottom') {
        const valueArray3 = [];
        for (let i = 0; i < this.rightBottomTemp.length; i++) {
          valueArray3.push(this.rightBottomTemp[i].widgetName);
        }
        if (valueArray3.indexOf(widgetName) === -1) {
          const cards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number, 'widgetSelector': string,
          'permissionName': string, 'widgetName': string, 'widgetConfig': string, 'widgetPosition': string }
          = { widgetId, widgetColumn, widgetRow, widgetSelector, permissionName, widgetName, widgetConfig, widgetPosition: 'rightBottom' };
          this.rightBottomTemp.push(cards);
          this.checkToGetAllCardsRightBottom.next(true);
          isalreadyExists = false;
        }
    }

    if (layout === 'centerPanel') {
      const valueArray4 = [];
      for (let i = 0; i < this.centerPanelTemp.length; i++) {
        valueArray4.push(this.centerPanelTemp[i].widgetName);
      }
      if (valueArray4.indexOf(widgetName) === -1) {
        const cards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number, 'widgetSelector': string,
        'permissionName': string, 'widgetName': string, 'widgetConfig': string, 'widgetPosition': string }
        = { widgetId, widgetColumn, widgetRow, widgetSelector, permissionName, widgetName, widgetConfig, widgetPosition: 'centerPanel' };
        this.centerPanelTemp.push(cards);
        this.checkToGetAllCardsCenter.next(true);
        isalreadyExists = false;
      }
    }

    if (layout === 'rightPanel') {
      const valueArray4 = [];
      for (let i = 0; i < this.rightPanelTemp.length; i++) {
        valueArray4.push(this.rightPanelTemp[i].widgetName);
      }
      if (valueArray4.indexOf(widgetName) === -1) {
        const cards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number, 'widgetSelector': string,
        'permissionName': string, 'widgetName': string, 'widgetConfig': string, 'widgetPosition': string }
        = { widgetId, widgetColumn, widgetRow, widgetSelector, permissionName, widgetName, widgetConfig, widgetPosition: 'rightPanel' };
        this.rightPanelTemp.push(cards);
        this.checkToGetAllCardsRight.next(true);
        isalreadyExists = false;
      }
    }

    if (layout === 'leftPanel') {
      const valueArray4 = [];
      for (let i = 0; i < this.leftPanelTemp.length; i++) {
        valueArray4.push(this.leftPanelTemp[i].widgetName);
      }
      if (valueArray4.indexOf(widgetName) === -1) {
        const cards: { 'widgetId': string, 'widgetColumn': number, 'widgetRow': number, 'widgetSelector': string,
        'permissionName': string, 'widgetName': string, 'widgetConfig': string, 'widgetPosition': string }
        = { widgetId, widgetColumn, widgetRow, widgetSelector, permissionName, widgetName, widgetConfig, widgetPosition: 'leftPanel' };
        this.leftPanelTemp.push(cards);
        this.checkToGetAllCardsLeft.next(true);
        isalreadyExists = false;
      }
    }

    return isalreadyExists;
  }


  // get the user preference based widget
  public getComponents(layoutType: string , dashboardType: string) {
    const params = new HttpParams()
    .set('layoutType', layoutType)
    .set('dashboardType', dashboardType);
    return this.http
      .get<any>(
        this.fccGlobalConstantService.getDashboardWidget , { params })
      .toPromise()
      .then(res => res.widgetDetailsList as any[])
      .catch(res => res)
      .then(data => data);
  }

// Get all the widget list for which the user is having permission
  public getAllComponentList(dashboardType: string ) {
    const params = new HttpParams()
    .set('dashboardType', dashboardType);
    return this.http
      .get<any>(
        this.fccGlobalConstantService.getDashboardPermissionWidget , { params })
      .toPromise()
      .then(res => res.widgetDetailsList as any[])
      .catch(res => res)
      .then(data => data);
  }

  // Save the dashboard preference
  public saveDashboardPreference(dashboardData: string[] , layoutType: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const widgetDetailsList = (dashboardData);
    const requestPayload = { widgetDetailsList, layoutType };
    return this.http.post<any>(this.fccGlobalConstantService.saveDashboardData, requestPayload, { headers });
  }

  public getUserDashboardData(dashboardId: string , dashboardType: string) {
    const params = new HttpParams()
      .set('dashboardCategory', dashboardType)
      .set('dashboardId', dashboardId);
    return this.http
      .get<any>(
        this.fccGlobalConstantService.getuserDashboardWidget , { params })
          .toPromise()
          .then(res => res)
          .catch(res => res)
          .then(data => data);
  }
}
