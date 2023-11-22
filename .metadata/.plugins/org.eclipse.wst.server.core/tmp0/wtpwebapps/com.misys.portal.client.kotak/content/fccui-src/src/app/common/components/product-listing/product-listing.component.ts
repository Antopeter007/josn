import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';

import { FccTradeFieldConstants } from '../../../corporate/trade/common/fcc-trade-field-constants';
import {
  ConfirmationDialogComponent,
} from '../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { UtilityService } from '../../../corporate/trade/lc/initiation/services/utility.service';
import { FccConstants } from '../../core/fcc-constants';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { SubmissionRequest } from '../../model/submissionRequest';
import { SubmitTransaction } from '../../model/submitTransaction';
import { HideShowDeleteWidgetsService } from '../../services/hide-show-delete-widgets.service';
import { SeveralSubmitService } from '../../services/several-submit.service';
import { SetEntityComponent } from '../set-entity/set-entity.component';
import { SetReferenceComponent } from '../set-reference/set-reference.component';
import { TransactionsListdefComponent } from '../transactions-listdef/transactions-listdef.component';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { ButtonItemList } from './../../model/ButtonItemList';
import { CommonService } from './../../services/common.service';
import { ListDefService } from './../../services/listdef.service';
import { ResolverService } from './../../services/resolver.service';
import { SearchLayoutService } from './../../services/search-layout.service';
import { TableService } from './../../../base/services/table.service';
import { TransactionDetailService } from './../../../common/services/transactionDetail.service';
import { ReauthService } from './../../../common/services/reauth.service';
import { PaymentBatchService } from '../../services/payment.service';

@Component({
  selector: 'fcc-common-productlisting',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy, AfterViewInit {
  selectedView: string;
  views: SelectItem[] = [];
  header: string;
  showHeaderToolTip: string;
  infoIconDetails: any = {};
  infoInvoked = false;
  allowMultipleLicense = `${this.translate.instant('allowMultipleLicense')}`;
  outertabs: any;
  listDefSearch: any;
  currectTab: any;
  currectTabkey: any = 0;
  outertabs1: any;
  activeIndex = 0;
  listdefName: string;
  initialised: boolean;
  recordsCount: number;
  displayCount: string;
  rangeDates: any[];
  initiateButton: string;
  respSubscription;
  activeItem: any = {};
  dir: string = localStorage.getItem('langDir');
  changed: boolean;
  displayDialog: any;
  externalUrlLink: any;
  params: any = {};
  tabItems: any = [];
  buttonItems: any = [];
  buttonItemList: ButtonItemList[] = [];
  menuToggleFlag: any;
  enableButtons: boolean;
  enableHeader: boolean;
  enableSaveList: boolean;
  IsExportLC: boolean;
  productCode: string;
  category: string;
  selectedRowsdata: any[] = [];
  selectedRowsdataForDeleteClear: any[] = [];
  submissionRequest: SubmissionRequest = {};
  transaction: SubmitTransaction;
  hasSubmissionAccess: boolean;
  comments = '';
  concatstr = '';
  charCount = 0;
  transListdef: TransactionsListdefComponent;
  multiSubmitForm: UntypedFormGroup;
  responseMap;
  buttonDialogResponse;
  enableMultiSubmitResponse: boolean;
  toggleRequired = this.commonService.defaultLicenseFilter;
  buttonsDisable = this.commonService.buttonsDisable;
  reloadListDef = true;
  checkedEnable = true;
  allowSwitch = false;
  @Input() inputParams;
  @Output() rowSelectEventListdef: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowUnSelectEventListdef: EventEmitter<any> = new EventEmitter<any>();
  @Output() multiSelectEventListdef: EventEmitter<any> = new EventEmitter<any>();
  disableReturn = false;
  lastLoginLabel: string;
  showLastLogin: boolean;
  userDateTime: string;
  bankDateTime: string;
  isBankTime = false;
  overlayRef: OverlayRef;
  contextPath: any;
  bottomButtonList: any[] = [];
  listScreenDetails: any;
  globalDashboardUrl: any;
  tabCount = 0;
  @ViewChild('listdef') protected set listdef(listdef: TransactionsListdefComponent) {
    if (listdef) {
      this.transListdef = listdef;
    }
  }
  charactersEnteredValue: any;
  entitySubscription: Subscription;
  entitySuccessSubsription: Subscription;
  refSubscription: Subscription;
  refSuccessSubsription: Subscription;
  entityNavPosition = 'end';
  referenceNavPosition = 'start';
  localizationKeyPdf = 'localizationKeyPdf';
  actionCode = "actionCode";
  @ViewChild('drawer') protected drawer: MatDrawer;
  @ViewChild('refDrawer') protected refDrawer: MatDrawer;
  showCards = false;
  cardItems: any = [];
  countStyle: any;
  componentRef: any;
  dashboardType: any = '';
  backToDashboard = 'backToDashboard';
  commentsRequired = false;
  commentsMandatory = false;
  buttonList = [];
  viewAllScreens: any;
  enableListDataDownload = false;
  showDeleteButton = true;

  successAccArr:any[]=[];
  failedAccounts:any={};
  confirmationMsg = '';
  failureMsg = '';
  filterCriteria: any;
  verifiedTnx = false;
  pendingVerifiedTnx = false;

  constructor(
    protected router: Router,
    protected translate: TranslateService,
    protected listservice: ListDefService,
    protected changedetector: ChangeDetectorRef,
    protected submitService: SeveralSubmitService,
    protected commonService: CommonService,
    protected activatedRoute: ActivatedRoute, protected searchLayoutService: SearchLayoutService,
    protected severalSubmitService: SeveralSubmitService,
    protected dialogService: DialogService, protected resolverService: ResolverService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected fb: UntypedFormBuilder, protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    public datepipe: DatePipe, protected overlay: Overlay,
    protected utilityService: UtilityService, protected tableService: TableService,
    protected transactionDetailService: TransactionDetailService, protected reauthService: ReauthService,
    protected paymentService: PaymentBatchService) {}

  ngAfterViewInit(): void {
    this.setRetreiveFromCache(true);
    if (this.listdef) {
      this.transListdef = this.listdef;
    }

  }

  setRetreiveFromCache(retreiveFromCache: boolean) {
    this.listservice.setRetreiveListDefFromCache(retreiveFromCache);
  }

  createOverlay() {
    const config = new OverlayConfig();
    config.hasBackdrop = true;
    this.overlayRef = this.overlay.create(config);
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.dispose();
      document.body.style.overflow = 'scroll';
      this.hideShowDeleteWidgetsService.customiseSubject.next(false);
    });
    this.hideShowDeleteWidgetsService.customiseSubject.next(true);
    document.body.style.overflow = 'hidden';
  }

  ngAfterViewChecked() {
    if (this.currectTabkey === 0){
      this.currectTab = this.tabItems[0];
    }
    localStorage.setItem('activeTab',this.activeIndex.toString());
  }

  ngOnInit() {
    this.setRetreiveFromCache(false);
    this.viewAllScreens = this.commonService.getViewAllScreens();
    this.entitySubscription = this.commonService.listenSetEntityClicked$.subscribe(
      rowdata => {
        this.createOverlay();
        this.commonService.setComponentRowData(rowdata);
        const portal = new ComponentPortal(SetEntityComponent);
        this.componentRef = this.overlayRef.attach<SetEntityComponent>(portal);
        this.componentRef.instance.overlayRef = this.overlayRef;
        this.componentRef.instance.closeSetEntityOverlay.subscribe(() => {
          this.overlayRef.dispose();
          this.hideShowDeleteWidgetsService.customiseSubject.next(false);
          document.body.style.overflow = 'scroll';
        });
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.commonService.isnonEMptyString(params.option)) {
        this.commonService.putQueryParameters(FccGlobalConstant.OPTION, params.option);
        this.commonService.putQueryParameters(FccGlobalConstant.CATEGORY, params.category);
        this.commonService.putQueryParameters(FccGlobalConstant.FACILITY_NAME, params.facilityName);
        if (this.viewAllScreens) {
          this.viewAllScreens.forEach(screen => {
            if (screen === this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION)) {
              this.enableListDataDownload = true;
              this.showDeleteButton = false;
              const keys : any [] = Object.keys(sessionStorage);
              keys.forEach(key => {
                if(key && screen && key.toUpperCase().indexOf(screen.toUpperCase()) >= 0) {
                  sessionStorage.removeItem(key);
                }
              });
            }
          });
        }
      }
      if (this.commonService.isnonEMptyString(params.activeTab)) {
        if(this.commonService.isPositiveNumber(params.activeTab)) {
          this.commonService.putQueryParameters(FccGlobalConstant.ACTIVE_TAB, params.activeTab);
          this.activeIndex = +params.activeTab;
          this.commonService.setActiveTab = true;
          this.commonService.setActiveTabIndex = +params.activeTab;
        }
      }

    });
    this.entitySuccessSubsription = this.commonService.listenSetEntitySuccess$.subscribe(
      res => {
        if (res === 'yes') {
          this.overlayRef.dispose();
          this.hideShowDeleteWidgetsService.customiseSubject.next(false);
          document.body.style.overflow = 'scroll';
          this.onChange(this.activeIndex);
      }
    });

    this.refSubscription = this.commonService.listenSetReferenceClicked$.subscribe(
      rowdata => {
        this.createOverlay();
        this.commonService.setComponentRowData(rowdata);
        const portal = new ComponentPortal(SetReferenceComponent);
        this.componentRef = this.overlayRef.attach<SetReferenceComponent>(portal);
        this.componentRef.instance.overlayRef = this.overlayRef;
        this.componentRef.instance.closeSetReferenceOverlay.subscribe(() => {
          this.overlayRef.dispose();
          this.hideShowDeleteWidgetsService.customiseSubject.next(false);
          document.body.style.overflow = 'scroll';
        });
    });

    this.refSuccessSubsription = this.commonService.listenSetReferenceSuccess$.subscribe(
      res => {
        if (res === 'yes') {
          this.overlayRef.dispose();
          this.hideShowDeleteWidgetsService.customiseSubject.next(false);
          document.body.style.overflow = 'scroll';
          this.onChange(this.activeIndex);
      }
    });

    // Default value of the preference dropdown set to 'Default View'
    this.selectedView = `${this.translate.instant('defaultView')}`;
    this.IsExportLC = false;

    const defaultView: { label: string; value: any } = {
      label: this.translate.instant('defaultView'),
      value: 'defaultView'
    };
    this.views.push(defaultView);
    this.enableSaveList = false;
    this.hasSubmissionAccess = false;
    this.multiSubmitForm = this.fb.group({
      comments: ['']
    });

    if (this.reloadListDef) {
      this.activatedRoute.queryParams.subscribe(params => {
        if (params.productCode !== undefined) {
          this.loadContent(params.productCode, params.subProductCode, params.option);
        } else if (this.commonService.isnonEMptyString(params.dashboardType)){
          this.dashboardType = params.dashboardType;
          this.commonService.setWidgetClicked(this.dashboardType);
          this.loadContent(params.dashboardType, params.subProductCode, params.option);
        } else if (params.option !== undefined) {
          this.loadContent(params.productCode, params.subProductCode, params.option);
        }
      });
    }

    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.listDefSearch = response.showListdefSearch;
      }
    });

    this.configureFeilds();
    this.respSubscription = this.commonService.isResponse.subscribe(
      data => {
        this.onSubmissionResponse(data);
      });
    if (this.checkedEnable) {
      this.handleListdefOnChange(this.activeIndex, true);
    }
    this.currectTab = this.tabItems[0];
  }

  resetAccMessageContent(){
    this.successAccArr=[];
    this.failedAccounts={};
  }

  onclickBackToDashboard() {
    if (!this.commonService.getEnableUxAddOn()) {
      let homeDojoUrl = '';
      homeDojoUrl = this.fccGlobalConstantService.contextPath;
      homeDojoUrl = homeDojoUrl + this.fccGlobalConstantService.servletName;
      homeDojoUrl = homeDojoUrl + '/screen?classicUXHome=true';
      window.open(homeDojoUrl, '_self');
    } else {
      const dashboardURL = '/dashboard/' + this.dashboardType.toLowerCase();
      this.router.navigateByUrl(dashboardURL);
    }
  }

  loadContent(productCode: any, subProductCode: any, option: any, listDef?: any) {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.showCards = false;
    this.category = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
    this.commonService.loadDefaultConfiguration().subscribe(async response => {
      if (response) {
        const filterParams = this.setDefaultFilterCriteria();
        this.commonService.setAngularProducts(response.angularProducts);
        this.commonService.setAngularSubProducts(response.angularSubProducts);
        if (this.commonService.getWidgetClicked() === this.dashboardType) {
          await this.listservice.getTabDetails(productCode, subProductCode,
            option, listDef, filterParams, this.category).toPromise().then(async resp => {
            this.listScreenDetails = resp;
            if (resp.ShowPopup) {
              this.commonService.setShowPopup(resp.ShowPopup);
            }
            if (resp.actionPopup) {
              this.commonService.setActionPopup(resp.actionPopup);
            }
            await this.translate.get('corporatechannels').toPromise().then(() => {
            if (resp && resp.Cards && resp.Cards.length > 0) {
              this.showCards = true;
              this.loadCardData(resp, '*');
              this.params.passBackEnabled = false;
            }
            this.getButtonDetails(resp.Buttons, resp.bottomButtons);
            });
          });
        }
        if ((this.commonService.isAngularProductUrl(productCode, subProductCode) ||
        this.inputParams && this.inputParams.screenType === FccGlobalConstant.SCREEN_TYPE_DIALOG) || (option !== undefined)
        || (this.commonService.getWidgetClicked() === this.dashboardType)) {
          this.commonService.getMenuValue().subscribe((value) => {
            this.menuToggleFlag = value;
          });
          // if (option === FccGlobalConstant.PHRASES) {
          //   productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
          //   subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
          //   this.category = this.inputParams.filterParams[FccGlobalConstant.CATEGORY];
          // }
          if (!this.showCards) {
            if (this.listScreenDetails) {
              this.getCorporateData(productCode);
            } else {
              this.listservice.getTabDetails(productCode, subProductCode, option, listDef, filterParams, this.category).subscribe(resp => {
                this.listScreenDetails = resp;
                this.getCorporateData(productCode);
              });
            }
          }
          this.resetAccMessageContent();
          this.resetResponse();
        } else {
          this.commonService.getDashboardUrl();
          this.router.navigate([this.commonService.globalDashboardUrl]);
        }
      }
    });
  }

  /** Get  */
  private getCorporateData(productCode) {
    this.translate.get('corporatechannels').subscribe(() => {
      this.showCards = false;
      if (this.commonService.checkForSwiftEnabledProduct(this.productCode)) {
        const perms = FccTradeFieldConstants.BG_PERMS;
        let hasPermission = '';
        this.commonService.getUserPermission('').subscribe(() => {
          perms.forEach(perKey => {
            const flag = this.commonService.getUserPermissionFlag(perKey);
            if (flag) {
              hasPermission = 'true';
              return;
            }
          });
          if (hasPermission === '') {
            this.listScreenDetails.Buttons.splice(1, 1);
            this.getButtonDetails(this.listScreenDetails.Buttons, this.listScreenDetails.bottomButtons);
          } else {
            this.getButtonDetails(this.listScreenDetails.Buttons, this.listScreenDetails.bottomButtons);
          }
        });
      } else {
        this.getButtonDetails(this.listScreenDetails.Buttons, this.listScreenDetails.bottomButtons);
      }
      if (this.listScreenDetails && this.listScreenDetails.Tabs && this.listScreenDetails.Tabs.length > 0) {
        this.loadProductListingPage(this.listScreenDetails, productCode);
      }
    });
  }
  /**
   * Below method is used to set default criteria on page load.
   * It helps to show the appropriate count based on default criteria.
   */
  private setDefaultFilterCriteria(): string {
    const filterParams = {};
    if (this.inputParams && this.inputParams.category === FccConstants.FCM) {
      const filterParamsValue = JSON.parse(this.inputParams.filterParams);
      Object.keys(filterParamsValue).forEach(filter => {
        filterParams[filter] = filterParamsValue[filter];
      });
    } else if (this.inputParams && this.inputParams.defaultFilterCriteria) {
      Object.keys(this.inputParams.defaultFilterCriteria).forEach(filter => {
        filterParams[filter] = this.inputParams.defaultFilterCriteria[filter];
      });
    }
    if (this.commonService.widgetFilterParams && this.commonService.widgetFilterParams.dashboard === 'TRADE' ) {
      filterParams['product_code']= this.commonService.widgetFilterParams.product_code;
      filterParams['tnx_type_code']= this.commonService.widgetFilterParams.tnx_type_code;
      this.filterCriteria = filterParams;
    }
    return JSON.stringify(filterParams);
  }

  protected loadProductListingPage(resp: any, productCode: any) {
    this.changed = false;
    const listdefName = 'listdefName';
    const metadata = 'metadata';
    const productCodeVal = 'productCode';
    const submissionAccess = 'hasSubmissionAccess';
    const activeTab = 'activeTab';
    const wildsearch = FccGlobalConstant.WILDSEARCH;
    this.outertabs = resp;
    this.productCode = productCode ? productCode : resp.ProductCode;
    this.tabItems = this.dir === 'rtl' ? this.outertabs.Tabs.reverse() : this.outertabs.Tabs;
    this.header = resp.ProductCode === '' ? '' : this.translate.instant(resp.ProductCode);
    if (resp.ProductCode === 'N001_EL') {
      this.IsExportLC = true;
    } else {
      this.IsExportLC = false;
    }
    const language = localStorage.getItem(FccGlobalConstant.LANGUAGE);
    const localizationKeysPdf = this.tabItems[0].localizationKey;
    if (language !== FccGlobalConstant.LANGUAGE_AR) {
      this.tabItems[0].localizationKey = this.translate.instant(this.tabItems[0].localizationKey);
    }
    const activeTabIndex : number = this.commonService.getQueryParametersFromKey(FccGlobalConstant.ACTIVE_TAB);
    if (this.commonService.isnonEMptyString(activeTabIndex)) {
      this.hasSubmissionAccess = this.tabItems[activeTabIndex].severalSubmit;
      this.commentsRequired = this.tabItems[activeTabIndex].commentsRequired;
      this.buttonList = this.tabItems[activeTabIndex].buttonList;
      if(this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY)==FccGlobalConstant.FCM.toUpperCase()){
        this.tabItems[activeTabIndex].buttonList?.forEach(button => {
          if(button.name==FccGlobalConstant.RETURN){
            button.name=FccGlobalConstant.REJECT;
            button.localizationKey=FccGlobalConstant.REJECT;
          }
        });
      }
    } else{
      this.hasSubmissionAccess = this.tabItems[0].severalSubmit;
      this.commentsRequired = this.tabItems[0].commentsRequired;
      this.buttonList = this.tabItems[0].buttonList;
    }
    this.allowSwitch = this.commonService.isNonEmptyValue(this.tabItems[0].allowSwitch) ? this.tabItems[0].allowSwitch : this.allowSwitch;
    this.params[productCodeVal] = productCode === '' ? '' : this.productCode;
    this.params[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = this.commonService.isNonEmptyValue(resp.MultipleFormatEnabled)
    ? resp.MultipleFormatEnabled : false;
    this.params[FccGlobalConstant.COLUMN_FILTER_ICON_ENABLED] = resp.colFilterIconDisabled === true ? false : undefined;
    this.enableSaveList = resp.DefaultViewEnable;
    this.changed = false;
    this.showHeaderToolTip = '';
    this.infoIconDetails = {};
    this.infoInvoked = false;

    if (this.commonService.setActiveTab) {
      this.activeItem = this.tabItems[this.commonService.setActiveTabIndex];
      this.activeIndex = this.tabItems[this.commonService.setActiveTabIndex].index;
      this.params[listdefName] = this.tabItems[this.commonService.setActiveTabIndex].listdefname;
      this.params[submissionAccess] = this.tabItems[this.commonService.setActiveTabIndex].severalSubmit;
      this.params[activeTab] = this.tabItems[this.commonService.setActiveTabIndex];
      this.params[activeTab][this.localizationKeyPdf] = localizationKeysPdf;
      this.params[activeTab][this.actionCode] = this.tabItems[this.commonService.setActiveTabIndex].actionCode;
    } else {
    for (const tab of this.tabItems) {
      if (tab.selected === true) {
        this.activeItem = tab;
        this.activeIndex = tab.index;
        this.params[listdefName] = tab.listdefname;
        this.params[submissionAccess] = tab.severalSubmit;
        this.params[activeTab] = tab;
        this.params[activeTab][this.localizationKeyPdf] = localizationKeysPdf;
        this.params[activeTab][this.actionCode] = tab.actionCode;
      }
    }
  }
    this.commonService.setActiveTab = false;
    this.commonService.setActiveTabIndex = 0;
    this.changedetector.detectChanges();
    this.params[metadata] = this.outertabs.MetaDataResponse;
    this.changed = true;
    this.params[wildsearch] = this.listDefSearch;
    this.params[FccGlobalConstant.SHOW_FILTER_SECTION] = true;
    this.params.filterChipsRequired = this.commonService.isnonEMptyString(this.inputParams?.filterChipsRequired)
    ? this.inputParams.filterChipsRequired : false;
    this.params.allowPreferenceSave = this.commonService.isnonEMptyString(this.inputParams?.allowPreferenceSave)
    ? this.inputParams.allowPreferenceSave : true;
    this.params.allowColumnCustomization = this.commonService.isnonEMptyString(this.inputParams?.allowColumnCustomization)
    ? this.inputParams.allowColumnCustomization : true;
    // Resetting preferences
    this.params.preferenceName = undefined;
    this.params.preferenceData = undefined;
    this.showHeaderToolTip = this.commonService.isEmptyValue(resp.ShowHeaderToolTip) ? '' : this.translate.instant(resp.ShowHeaderToolTip);
    this.infoIconDetails[FccGlobalConstant.DETAILS] = this.showHeaderToolTip;
    this.infoInvoked = true;
    this.redirectToNextUrl(resp.Tabs);
  }

  redirectToNextUrl(tabDetails) {
    const option = this.activatedRoute.snapshot.queryParams.operation;
    if (option === 'initiateDrowdown') {
      this.buttonItemList.forEach(element => {
        if (element.mode === 'INITIATE') {
          this.listingDialog(element);
        }
      });
    }else{
      tabDetails.forEach((e, index) => {
        if ((this.translate.instant(option) === e.localizationKey) || (option === e.localizationKey)){
          this.handleListdefOnChange(index, true);
        }
      });
    }
  }
  protected loadCardData(resp: any, productCode: any) {
    this.changed = false;
    this.cardItems = [];
    const listdefName = 'listdefName';
    const metadata = 'metadata';
    const productCodeVal = 'productCode';
    const submissionAccess = 'hasSubmissionAccess';
    const activeTab = 'activeTab';
    const wildsearch = FccGlobalConstant.WILDSEARCH;
    this.outertabs = resp;
    this.productCode = productCode;
    this.tabItems = this.outertabs.Cards;
    this.header = resp.ProductCode === '' ? '' : this.translate.instant(resp.ProductCode);
    if (resp.ProductCode === 'N001_EL') {
      this.IsExportLC = true;
    } else {
      this.IsExportLC = false;
    }
    this.tabItems[0].localizationKey = this.translate.instant(this.tabItems[0].localizationKey);
    this.hasSubmissionAccess = this.tabItems[0].severalSubmit;
    this.params[productCodeVal] = productCode === '' ? '' : this.productCode;
    this.enableSaveList = resp.DefaultViewEnable;
    this.changed = false;
    this.showHeaderToolTip = '';
    this.infoIconDetails = {};
    this.infoInvoked = false;
    const defaultTab = this.tabItems[0];
    let selected = false;
    for (const tab of this.tabItems) {
      if (tab.dashboardName === this.dashboardType) {
        selected = true;
        this.handleListdefOnChange(tab.index, true);
      }
    }
    if (!selected) {
      this.activeItem = defaultTab;
      this.activeIndex = defaultTab.index;
      this.params[listdefName] = defaultTab.listdefname;
      this.params[submissionAccess] = defaultTab.severalSubmit;
      this.params[activeTab] = defaultTab;
    }
    this.changedetector.detectChanges();
    this.params[metadata] = this.outertabs.MetaDataResponse;
    this.changed = true;
    this.params[wildsearch] = true;
    this.params[FccGlobalConstant.SHOW_FILTER_SECTION] = true;
    this.params.filterChipsRequired = this.commonService.isnonEMptyString(this.inputParams?.filterChipsRequired)
    ? this.inputParams.filterChipsRequired : true;
    const viewAllFromWidgets = ['TRADEPAYMENTOUTSTANDINGWIDGET', 'TRADEPAYMENTOVERDUEWIDGET'];
    if(viewAllFromWidgets.indexOf(this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION)) > -1) {
      this.params.filterChipsRequired = false;
    }
    if (this.viewAllScreens) {
      this.viewAllScreens.forEach(screen => {
        if (screen === this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION)) {
          this.params.filterChipsRequired = false;
        }
      });
    }
    this.params.allowPreferenceSave = this.commonService.isnonEMptyString(this.inputParams?.allowPreferenceSave)
    ? this.inputParams.allowPreferenceSave : true;
    this.params.allowColumnCustomization = this.commonService.isnonEMptyString(this.inputParams?.allowColumnCustomization)
    ? this.inputParams.allowColumnCustomization : true;
    // Resetting preferences
    this.params.preferenceName = undefined;
    this.params.preferenceData = undefined;
    this.showHeaderToolTip = this.commonService.isEmptyValue(resp.ShowHeaderToolTip)
     ? '' : this.translate.instant(resp.ShowHeaderToolTip);
    this.infoIconDetails[FccGlobalConstant.DETAILS] = this.showHeaderToolTip;
    this.infoInvoked = true;
    this.cardItems = this.tabItems;
  }

  onChange(index: any) {
    if (this.checkedEnable) {
    this.handleListdefOnChange(index, true);
    } else {
    this.handleListdefOnChange(index, false);
    }
  }

  OnEnterKey(event) {
    if (event && event.target && event.target.children && event.target.children[0] && event.code && event.code === 'Enter') {
      const index = event.target.children[0].classList.value.split(' ')[0].split('_')[1];
      this.onChange(index);
    }
  }

  OnClickTab(event) {
    if (event && event.target && event.target.children && event.target.children[0]) {
      const index = event.target.children[0].classList.value.split(' ')[0].split('_')[1];
      if(index)
      {
        this.onChange(index);
      }
    }
  }

  onToggleChange(event: any) {
    this.handleListdefOnChange(0, event.checked);
  }

  handleListdefOnChange(index: any, checked: any) {
    this.params[FccGlobalConstant.MULTIPLE_LICENSE] = undefined;
    if (this.inputParams && this.inputParams.defaultLicenseFilter) {
      this.commonService.toggleLicenseFilter = this.commonService.defaultLicenseFilter !== undefined ?
                        this.commonService.defaultLicenseFilter : this.inputParams.defaultLicenseFilter;
    }
    if (this.commonService.defaultLicenseFilter || (this.inputParams && this.inputParams.defaultLicenseFilter)) {
      this.params[FccGlobalConstant.MULTIPLE_LICENSE] = 'N';
      if (checked) {
      this.params[FccGlobalConstant.MULTIPLE_LICENSE] = 'Y';
      this.commonService.licenseCheckBoxRequired = 'Y';
    } else {
      this.params[FccGlobalConstant.MULTIPLE_LICENSE] = 'N';
      this.commonService.licenseCheckBoxRequired = 'N';
    }
  }
    const listdefName = 'listdefName';
    const metadata = 'metadata';
    const wildsearch = FccGlobalConstant.WILDSEARCH;
    const submissionAccess = 'hasSubmissionAccess';
    const activeTab = 'activeTab';
    const filterNoEntity = 'filterNoEntity';
    this.changed = false;
    this.changedetector.detectChanges();
    if (this.tabItems[index]) {
      this.params[listdefName] = this.tabItems[index].listdefname;
      this.params[submissionAccess] = this.tabItems[index].severalSubmit;
      this.hasSubmissionAccess = this.tabItems[index].severalSubmit;
      this.commentsRequired = this.tabItems[index].commentsRequired;
      //change the button name to REJECT only for bene pending approval or payments pending approval flow
      this.activatedRoute.queryParams.subscribe(params=>{
          if(params.category==FccGlobalConstant.FCM.toUpperCase()){
            this.tabItems[index].buttonList?.forEach(button => {
              if(button.name==FccGlobalConstant.RETURN){
                button.name=FccGlobalConstant.REJECT;
                button.localizationKey=FccGlobalConstant.REJECT;
              }
            });
          }
      });

      this.buttonList = this.tabItems[index].buttonList;
      this.params[filterNoEntity] = this.tabItems[index].filterNoEntity;
      this.params.dashboardType = this.tabItems[index].dashboardName;
      this.tabItems[index].selected = true;
      this.tabCount = this.tabItems[index].count;
      this.activeItem = this.tabItems[index];
      this.currectTab = this.tabItems[index];
      this.currectTabkey = index;
    }
    if (this.inputParams && this.inputParams.Option &&
      this.inputParams.Option === FccGlobalConstant.PHRASES) {
     this.params[FccGlobalConstant.FILTER_PARAMS] = this.inputParams[FccGlobalConstant.FILTER_PARAMS];
   }
    if (this.params[FccGlobalConstant.FILTER_PARAMS] === undefined) {
      this.params[FccGlobalConstant.FILTER_PARAMS] = this.filterCriteria;
    }
    if (!(this.params[FccGlobalConstant.FILTER_PARAMS] && this.params[FccGlobalConstant.FILTER_PARAMS][FccGlobalConstant.CATEGORY])) {
      this.params[metadata] = undefined;
    }
    this.params[FccGlobalConstant.ENABLE_RADIO_BUTTON] = checked;
    this.changed = true;
    this.params[wildsearch] = this.listDefSearch;
    this.params[FccGlobalConstant.DEFAULT_LICENSE_FILTER] = this.inputParams ? this.inputParams.defaultLicenseFilter : undefined;
    this.params[activeTab] = this.tabItems[index];
    if (this.tabItems[index] && this.tabItems[index].localizationKey && this.tabItems[index].index !== 0) {
      this.params[activeTab][this.localizationKeyPdf] = this.tabItems[index].localizationKey;
    }
    this.activeIndex = index;
    // Resetting preferences
    this.params.preferenceName = undefined;
    this.params.preferenceData = undefined;
    if (this.enableListDataDownload) {
      this.params.enableListDataDownload = this.enableListDataDownload;
    }
    this.rowUnSelectEventListdef.emit(FccGlobalConstant.MULTIPLE_LICENSE_CHECK);
    this.resetAccMessageContent();
    this.resetResponse();
  }

  navigateToExternalUrl() {
    this.displayDialog = false;
    window.open(this.externalUrlLink, FccGlobalConstant.BLANK);
  }

ngOnChanges() {
  const downloadIconEnabled = 'downloadIconEnabled';
  const filterParams = 'filterParams';
  const filterParamsRequired = 'filterParamsRequired';
  const phrases = FccGlobalConstant.PHRASES;
  const dialog = 'dialog';
  this.params[downloadIconEnabled] = this.inputParams.downloadIconEnabled;
  this.params[filterParams] = this.inputParams.filterParams;
  this.params[filterParamsRequired] = this.inputParams.filterParamsRequired;
  this.params[FccGlobalConstant.CPTY_NAME] = this.inputParams.cptyName;
  this.params[FccGlobalConstant.CURRENCY] = this.inputParams.currency;
  this.params[FccGlobalConstant.EXPIRY_DATE_FIELD] = this.inputParams.expiryDate;
  this.params[FccGlobalConstant.BENEFICIARY_NAME] = this.inputParams.beneficiaryName;
  this.params[FccGlobalConstant.SUB_PRODUCT_CODE] = this.inputParams.subProductCode;
  this.params[FccGlobalConstant.FIN_TYPE] = this.inputParams.ls_type;
  this.params.parmid = this.inputParams.parmid;
  this.params.intermediateBankFlag = this.inputParams.intermediateBankFlag;
  this.params[FccGlobalConstant.ENABLE_RADIO_BUTTON] = this.inputParams.enableRadioButton;
  this.params[FccGlobalConstant.DEFAULT_CRITERIA] = this.inputParams.defaultFilterCriteria;
  this.params[FccGlobalConstant.OPTION] = this.inputParams.Option;
  const isTemplateCreation = this.inputParams.templateCreation;
  const isPhrasesSelected = this.inputParams.Option === phrases ? true : false;
  const isDialog = this.inputParams.screenType === dialog ? true : false;
  if (isTemplateCreation || isPhrasesSelected || this.commonService.noReloadListDef || isDialog) {
    this.reloadListDef = false;
  }
  if (this.commonService.isnonEMptyString(this.inputParams.beneBankCodeOption)) {
    this.params[FccConstants.BENE_BANK_CODE_OPTION] = this.inputParams.beneBankCodeOption;
    this.inputParams.Option = this.inputParams.beneBankCodeOption;
  }
  this.loadContent(this.inputParams.ProductCode, this.inputParams.subProductCode, this.inputParams.Option,
    this.inputParams.listDef );
}
  navigateButtonUrl(eventUrl: any, productProcessor?: any, urlKey?: any) {
    if (this.commonService.isnonEMptyString(productProcessor) && this.commonService.isnonEMptyString(urlKey)) {
      const data: any = {};
      const buttonDeepLinkingData: any = [];
      data.productProcessor = productProcessor;
      data.urlKey = urlKey;
      buttonDeepLinkingData.push(data);
      this.commonService.getDeepLinkingData(buttonDeepLinkingData, 0).then(response => {
      this.commonService.navigateToLink(response[0]);
      this.displayDialog = this.commonService.displayDialog;
      this.externalUrlLink = this.commonService.externalUrlLink;
      });
    } else {
      this.router.navigateByUrl(eventUrl);
      this.commonService.channelRefNo.next(null);
    }
  }

  listingDialog(buttonDetails) {
    this.commonService.noReloadListDef = true;
    this.buttonDialogResponse = null;
    this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
    this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    const header = `${this.translate.instant(buttonDetails.dialogPopupName)}`;
    const productCode = 'productCode';
    const subProductCode = 'subProductCode';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    const obj = {};
    obj[productCode] = buttonDetails.productCode;
    obj[option] = buttonDetails.listScreenOption;
    obj[subProductCode] = '';
    obj[downloadIconEnabled] = false;
    this.resolverService.getSearchData(header, obj);
    this.buttonDialogResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((listResponse) => {

      if (listResponse !== null) {
        this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
          queryParams: {
            productCode: listResponse.responseData.PRODUCT_CODE,
            tnxTypeCode: buttonDetails.tnxTypeCode,
            mode: buttonDetails.mode,
            facilityid: listResponse.responseData.ID,
            swinglineAllowed: listResponse.responseData.SWINGLINEALLOWED,
            drawdownAllowed: listResponse.responseData.DRAWDOWNALLOWED
          }
        });
      }
    });
  }

getCount(index: number) {
  if (this.activeIndex === index && this.transListdef && this.transListdef.inputParams
    && this.transListdef.inputParams.listdefName === this.tabItems[index].listdefname) {
    if (this.transListdef.numRows !== undefined && this.transListdef.numRows !== null) {
      this.tabItems[this.activeIndex].count = this.transListdef.numRows;
    }
    else {
      this.tabItems[this.activeIndex].count = this.tabCount;
    }
  }
  const paginatorParams = { first: 0, rows: 1 };
  let filterParams = "";
  const filterParmsValues = {};
  if(this.commonService.isnonBlankString(this.tabItems[index].dashboardName)){
    filterParmsValues[FccGlobalConstant.DASHBOARD_TYPE] = this.tabItems[index].dashboardName;
    filterParams = JSON.stringify(filterParmsValues);
  }


  if (this.tabItems[index].count == null && this.tabItems[this.activeIndex].count != null &&
    this.tabItems[index].selected != "true") {
    this.tabItems[index].count = "";
    this.listservice.getTableData(this.tabItems[index].listdefname, filterParams, JSON.stringify(paginatorParams), false)
      .subscribe(result => {
        this.tabItems[index].count = result.count;
        return "(" + this.tabItems[index].count + ")";
      });
  } else if (!this.commonService.isEmptyValue(this.tabItems[index].count)) {
    return "(" + this.tabItems[index].count + ")";
  }
}

  setDirection() {
    if (this.dir === 'rtl') {
    return 'right';
    } else {
    return 'none';
    }
  }

  getTotalCount(event) {
    if (this.commonService.isNonEmptyValue(event) && (this.activeIndex > -1) && this.tabItems &&
      this.tabItems.length > 0 && this.tabItems[this.activeIndex]) {
      this.tabItems[this.activeIndex].count = event;
    }
  }
  // Loads button item list
  getButtonDetails(outerButtons: any, bottomButtoms: any) {
    this.buttonItemList = [];
    this.bottomButtonList = [];
    if (outerButtons && outerButtons.length > 0) {
      this.enableButtons = true;
      if (this.category==FccGlobalConstant.FCM.toUpperCase()) {
        this.params['isButtonsAvailable'] = this.enableButtons;
      }
      this.buttonItems = outerButtons;
      for (let i = 0; i < this.buttonItems.length; i++) {
        this.commonService.putButtonItems('buttonName' + i, this.buttonItems[i].localizationKey);
        this.commonService.putButtonItems('buttonClass' + i, this.buttonItems[i].buttonClass);
        this.commonService.putButtonItems('routerLink' + i, this.buttonItems[i].routerLink);
        this.commonService.putButtonItems('listdefDialogEnable' + i, this.buttonItems[i].listdefDialogEnable);
        this.commonService.putButtonItems('dialogPopupName' + i, this.buttonItems[i].dialogPopupName);
        this.commonService.putButtonItems('listScreenOption' + i, this.buttonItems[i].listScreenOption);
        this.commonService.putButtonItems('tnxTypeCode' + i, this.buttonItems[i].tnxTypeCode);
        this.commonService.putButtonItems('mode' + i, this.buttonItems[i].mode);
        this.commonService.putButtonItems('productCode' + i, this.buttonItems[i].productCode);
        this.commonService.putButtonItems('productProcessor' + i, this.buttonItems[i].productProcessor);
        this.commonService.putButtonItems('urlKey' + i, this.buttonItems[i].urlKey);
        this.buttonItemList.push({
          buttonName: this.commonService.getButtonItems('buttonName' + i),
          buttonClass: this.commonService.getButtonItems('buttonClass' + i),
          routerLink: this.commonService.getButtonItems('routerLink' + i),
          listdefDialogEnable: this.commonService.getButtonItems('listdefDialogEnable' + i),
          dialogPopupName: this.commonService.getButtonItems('dialogPopupName' + i),
          listScreenOption: this.commonService.getButtonItems('listScreenOption' + i),
          tnxTypeCode: this.commonService.getButtonItems('tnxTypeCode' + i),
          mode: this.commonService.getButtonItems('mode' + i),
          productCode: this.commonService.getButtonItems('productCode' + i),
          productProcessor: this.commonService.getButtonItems('productProcessor' + i),
          urlKey: this.commonService.getButtonItems('urlKey' + i)
        });
      }
    }
    if (bottomButtoms) {
      bottomButtoms.forEach(element => {
        this.bottomButtonList.push(element);
      });
    } else {
      this.enableButtons = false;
    }
  }

  getRowSelectEvent(event) {
    this.activatedRoute.queryParams.subscribe(params => {
      if ((params.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC ||
            params.option === FccGlobalConstant.PAYMENTS)
        && params.category === FccGlobalConstant.FCM.toUpperCase()) {
        this.selectedRowsdata = event.selectedRowsData;
        this.rowSelectEventListdef.emit(event);
      } else {
        this.rowSelectEventListdef.emit(event);
        if (event.type === 'checkbox' && event.data.box_ref) {
          this.clearRowDataOnPagination();
          this.selectedRowsdata.push(event.data.box_ref + '_' + event.data.tnx_amt);
          this.selectedRowsdataForDeleteClear.push(event.data);
        } else if (event.type === 'checkbox') {
          this.clearRowDataOnPagination();
          this.selectedRowsdata.push(event.data);
          this.selectedRowsdataForDeleteClear.push(event.data);
        }
      }
      this.commonService.showCommentDialog = true;
    });

  }

  getRowUnSelectEvent(event) {
    this.activatedRoute.queryParams.subscribe(params => {
      if ((params.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC ||
            params.option === FccGlobalConstant.PAYMENTS)
            && params.category === FccGlobalConstant.FCM.toUpperCase()) {
        this.selectedRowsdata = event.selectedRowsData;
        this.commentsMandatory = false;
      } else {
        this.rowUnSelectEventListdef.emit(event);
        if (event.type === 'checkbox') {
          this.disableReturn = false;
          this.selectedRowsdata.forEach((item, index) => {
            if (item === event.data.box_ref + '_' + event.data.tnx_amt || JSON.stringify(item) === JSON.stringify(event.data)) {
              this.selectedRowsdata.splice(index, 1);
              this.selectedRowsdataForDeleteClear.splice(index, 1);
            }
          });
        }
      }
    });
  }

  clearRowDataOnPagination() {
    if (this.commonService.showCommentDialog === false) {
      this.selectedRowsdata = [];
      this.selectedRowsdataForDeleteClear = [];
    }
  }

configureFeilds() {
  this.enableButtons = true;
  this.enableHeader = true;
  if (this.inputParams !== undefined && this.inputParams !== '' && this.inputParams !== null) {
    this.enableButtons = (this.inputParams !== undefined && this.inputParams.buttons !== undefined && this.inputParams.buttons !== '') ?
      (this.inputParams.buttons === true ? true : false) : true;

    this.enableHeader = (this.inputParams !== undefined && this.inputParams.headerDisplay !== undefined &&
      this.inputParams.headerDisplay !== '') ?
      (this.inputParams.headerDisplay === true ? true : false) : true;

    this.enableSaveList = (this.inputParams !== undefined && this.inputParams.savedList !== undefined &&
      this.inputParams.savedList !== '') ?
      (this.inputParams.savedList === true ? true : false) : this.enableSaveList;
    }
  }
  onClickMultiRollover(actionParams) {
    this.commonService.selectedRows = [];
    this.selectedRowsdata.forEach(row => {
      this.commonService.selectedRows.push(row);
    });
    const formattedData = this.commonService.selectedRows[0];
    const currentDateToValidate = this.utilityService.transformDateFormat(new Date());
    const dateRequestParams = this.commonService.requestToValidateDate(currentDateToValidate, formattedData);
    this.commonService.getValidateBusinessDate(dateRequestParams).subscribe((res) => {
      if (res) {
        if (res && res.adjustedLocalizedDate && formattedData && formattedData.repricing_date){
          const adjustedDate = this.utilityService.transformddMMyyyytoDate(res.adjustedLocalizedDate);
          const selectedDate = this.utilityService.transformddMMyyyytoDate(formattedData.repricing_date);
          if (!this.utilityService.compareDateFields(adjustedDate, selectedDate)) {
            this.getConfigDataForRollover(formattedData, actionParams);
          } else {
            const dir = localStorage.getItem('langDir');
            const locaKeyValue = `${this.translate.instant('repriceDateLessThanSelectedDate')}` + res.adjustedLocalizedDate;
            this.dialogService.open(ConfirmationDialogComponent, {
              header: `${this.translate.instant('message')}`,
              width: '35em',
              styleClass: 'fileUploadClass',
              style: { direction: dir },
              data: { locaKey: locaKeyValue,
                showOkButton: true,
                showNoButton: false,
                showYesButton: false
              },
              baseZIndex: 10010,
              autoZIndex: true
            });
          }
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resetTableFilterOnSwitch(event) {
    this.selectedRowsdata = [];
  }

  getConfigDataForRollover(rowData, actionParams) {
    this.commonService.getConfiguredValues('CHECK_FACILITY_STATUS_ON_CLICK_ROLLOVER').subscribe(resp => {
      if (resp.response && resp.response === 'REST_API_SUCCESS') {
        if (resp.CHECK_FACILITY_STATUS_ON_CLICK_ROLLOVER === 'true'){
          this.listservice
                .getFacilityDetail('/loan/listdef/customer/LN/getFacilityDetail',
                rowData.borrower_reference, rowData.bo_deal_id ).subscribe(facResponse => {
                  facResponse.rowDetails.forEach(facility => {
                    const filteredData = facility.index.filter(row => row.name === 'id'
                      && (this.commonService.decodeHtml(row.value) === rowData.bo_facility_id));
                    if (filteredData && filteredData.length > 0){
                      const filteredStatusData = facility.index.filter(row => row.name === 'status');
                      if (filteredStatusData[0].value === FccGlobalConstant.expired) {
                        const dir = localStorage.getItem('langDir');
                        const locaKeyValue = this.translate.instant('rolloverErrorOnExpiredFacility');
                        const expiredFacDialog = this.dialogService.open(ConfirmationDialogComponent, {
                          header: `${this.translate.instant('message')}`,
                          width: '35em',
                          styleClass: 'fileUploadClass',
                          style: { direction: dir },
                          data: { locaKey: locaKeyValue,
                            showOkButton: true,
                            showNoButton: false,
                            showYesButton: false
                          },
                          baseZIndex: 10010,
                          autoZIndex: true
                        });
                        expiredFacDialog.onClose.subscribe(() => {
                          //eslint : no-empty-function
                        });
                      } else {
                        this.navigateButtonUrl(actionParams.routerLink);
                    }
                  }
                  });
                });
        } else {
          this.navigateButtonUrl(actionParams.routerLink);
        }
      }
    });
  }

  refreshProductList(event) {
    this.filterCriteria = event.filterCriteria;
    const index = this.activeIndex;
    this.commonService.setActiveTab = true;
    this.commonService.setActiveTabIndex = this.activeIndex;
    this.ngOnInit();
    if (index !== 0) {
      this.onChange(index);
    }
  }

  refreshTableData(){
    const index = this.activeIndex;
    if (index !== 0) {
      this.onChange(index);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickMultiApprove(actionParams) {
    this.resetAccMessageContent();
    let triggermultiSubmit = true;
    let category, option;
    this.activatedRoute.queryParams.subscribe(obs => {
      //bene-listing-multi-appr-reject flow
      category = obs.category;
      option = obs.option;
    });
    if (triggermultiSubmit)
    {
      if (category == (FccGlobalConstant.FCM.toUpperCase()) &&
        option == FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC) {
        this.performBeneficiaryMutliApprRejectFCM(actionParams, FccGlobalConstant.multiTransactionEventType.APPROVE,
          'beneMultiApprovalSuccessMsg', 'beneMultiApprovalFailedMsg');
          this.confirmationMsg = 'accConfirmationMsg';
          this.failureMsg = 'accFailedMsg';
      } else if (category == (FccGlobalConstant.FCM.toUpperCase()) &&
        option == FccGlobalConstant.PAYMENTS) {
        this.performPaymentsMultiApproveRejectFCM(actionParams, FccGlobalConstant.multiTransactionEventType.APPROVE,
          'PAYMENTS_MULTI_APPROVAL_SUCCESS_MSG', 'PAYMENTS_MULTI_APPROVAL_FAILURE_MSG');
          this.confirmationMsg = 'paymentApproveConfirmationMsg';
          this.failureMsg = 'paymentApproveFailureMsg';
      } else {
        //flow for remaining screens untouched
        if (this.selectedRowsdata.length) {
          this.enableMultiSubmitResponse = false;
          this.submissionRequest.listKeys = this.selectedRowsdata;
          // placeholder for comments, to set when implemented in backend
          this.submitService.performSeveralSubmit(this.submissionRequest, FccGlobalConstant.APPROVE);
        }
      }
      triggermultiSubmit = false;
    }
  }

  onClickMultiReturn(actionParams) {

    //retained the existing flow
    if (this.selectedRowsdata.length && actionParams.comment && actionParams.comment.length > 0) {
      this.enableMultiSubmitResponse = false;
      this.submissionRequest.listKeys = this.selectedRowsdata;
      this.submissionRequest.comments = actionParams.comment;
      this.submitService.performSeveralSubmit(this.submissionRequest, FccGlobalConstant.RETURN);
      this.disableReturn = false;
    } else {
      this.disableReturn = true;
      this.commonService.isCommentSectionBtnEnabled.next(true);
    }

  }

  onClickMultiSubmit(actionParams) {
    this.resetAccMessageContent();
    this.performPaymentsMultiSubmitFCM(actionParams, FccGlobalConstant.multiTransactionEventType.VERIFY,
      'PAYMENTS_MULTI_SUBMIT_SUCCESS_MSG', 'PAYMENTS_MULTI_SUBMIT_FAILURE_MSG');
     this.confirmationMsg = 'paymentSubmitConfirmationMsg';
     this.failureMsg = 'paymentSubmitFailureMsg';
  }

  onClickMultiVerify(actionParams) {
    this.resetAccMessageContent();
    this.performPaymentsMultiVerifyFCM(actionParams, FccGlobalConstant.multiTransactionEventType.VERIFY,
      'PAYMENTS_MULTI_VERIFY_SUCCESS_MSG', 'PAYMENTS_MULTI_VERIFY_FAILURE_MSG');
     this.confirmationMsg = 'paymentVerifyConfirmationMsg';
     this.failureMsg = 'paymentVerifyFailureMsg';
  }

  onClickMultiSend(actionParams) {
    this.resetAccMessageContent();
    this.performPaymentsMultiSendFCM(actionParams, FccGlobalConstant.MULTI_SEND_EVENT,
      'PAYMENTS_MULTI_SEND_SUCCESS_MSG', 'PAYMENTS_MULTI_SEND_FAILURE_MSG');
     this.confirmationMsg = 'paymentSendConfirmationMsg';
     this.failureMsg = 'paymentSendFailureMsg';
  }

  onClickMultiReject(actionParams) {

    this.resetAccMessageContent();
    let category, option;
    this.activatedRoute.queryParams.subscribe(obs => {
      category = obs.category;
      option = obs.option;
    });
    if (category == (FccGlobalConstant.FCM.toUpperCase()) &&
      option == FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC) {
        //bene-listing-multi-appr-reject flow
      if(this.isNonEmpty(actionParams.comment)){
        this.commentsMandatory=false;
        this.performBeneficiaryMutliApprRejectFCM(actionParams, FccGlobalConstant.multiTransactionEventType.REJECT,
          'beneMultiRejectSuccessMsg', 'beneMultiRejectFailureMsg');
        this.confirmationMsg = 'accReturnConfirmationMsg';
        this.failureMsg = 'accReturnFailedMsg';
      }else{
        this.commentsMandatory=true;
      }
    } else if (category == (FccGlobalConstant.FCM.toUpperCase()) &&
      option == FccGlobalConstant.PAYMENTS) {
        if(this.selectedRowsdata.length>0){
          const rowData = this.selectedRowsdata[0];
            if(this.isNonEmpty(actionParams.comment)){
              this.commentsMandatory=false;
              if(rowData!=undefined && null!=rowData && rowData.batchStatus !== FccGlobalConstant.PENDINGMYVERIFICATION){
                this.performPaymentsMultiApproveRejectFCM(actionParams, FccGlobalConstant.multiTransactionEventType.REJECT,
                  'PAYMENTS_MULTI_REJECT_SUCCESS_MSG', 'PAYMENTS_MULTI_REJECT_FAILURE_MSG');
              } else {
                this.performPaymentsMultiVerifierRejectFCM(actionParams, FccGlobalConstant.multiTransactionEventType.REJECT,
                  'PAYMENTS_MULTI_REJECT_SUCCESS_MSG', 'PAYMENTS_MULTI_REJECT_FAILURE_MSG');
              }
              this.confirmationMsg = 'paymentRejectConfirmationMsg';
              this.failureMsg = 'paymentRejectFailureMsg';
            }else{
              this.commentsMandatory=true;
            }
        }
      }

  }

  isNonEmpty(text:string){
    return (undefined!=text&&null!=text&&text!=='');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickMultiDelete(actionParams) {
    if (this.selectedRowsdata.length) {
      const headerField = `${this.translate.instant('deleteTransaction')}`;
      this.enableMultiSubmitResponse = false;
      this.submissionRequest.listKeys = this.selectedRowsdata;
      const dir = localStorage.getItem('langDir');
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        header: headerField,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir },
        data: { locaKey: 'multideleteConfirmationMsg' }
      });
      dialogRef.onClose.subscribe(async (result: any) => {
        if (result.toLowerCase() === 'yes') {
          this.activatedRoute.queryParams.subscribe(params => {
            this.commonService.clearQueryParameters();
            Object.keys(params).forEach(element => {
              if (this.isParamValid(params[element])) {
                this.commonService.putQueryParameters(element, params[element]);
              }
            });
          });
          await this.submitService.performSeveralDelete(this.submissionRequest, FccGlobalConstant.DELETE);
          this.onChange(this.activeIndex);
        }
      });
      dialogRef.onDestroy.subscribe( () => {
        this.commonService.isCommentSectionBtnEnabled.next(true);
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickMultiDeleteClear(actionParams) {
    if (this.selectedRowsdata.length) {
      let headerField :string;
      this.enableMultiSubmitResponse = false;
      this.submissionRequest.listKeys = this.selectedRowsdata;
      const dir = localStorage.getItem('langDir');
      const msg = [];
      //const tnxTypeCodeParam = [];
      for (const tab of this.selectedRowsdataForDeleteClear) {
        if(tab.tnx_type_code == '01'){
          //For Loan Rollover type transactions
          if(tab.product_code == 'BK'){
            msg.push('03');
          }
          else if(tab.product_code == 'LN'){
            msg.push('LNDR');
          }
          else{
            msg.push('01');
          }
        }
        else if(tab.tnx_type_code == '03'){
          msg.push('03');
        }
        else if(tab.tnx_type_code == '13'){
          msg.push('13');
        }
        else if(tab.product_code == 'BK' && tab.prod_stat_code == 'Rejected'){
          msg.push('01');
        }
      }
      let popupMsg : string;
      let successMsg : string;
      if((msg.includes('01') || msg.includes('LNDR')) && (msg.includes('13') || msg.includes('03'))){
        if (msg.includes('LNDR')){
          popupMsg = 'deleteClearDrawdownConfirmationMessage';
        }
        else {
          popupMsg = 'deleteClearConfirmationMessage';
        }
        successMsg = 'deleteClearToasterMessage';
        headerField = `${this.translate.instant('deleteClearTransaction')}`;
      }
      else if(msg.includes('03') && msg.includes('13') || (msg.includes('03')) || (msg.includes('13'))){
        popupMsg = 'clearConfirmationMessage';
        successMsg = 'clearToasterMessage';
        headerField = `${this.translate.instant('clearTransaction')}`;
      }
      else if(msg.includes('01') || msg.includes('LNDR')){
        popupMsg = 'deleteConfirmationMessage';
        successMsg = 'deleteToasterMessage';
        headerField = `${this.translate.instant('deleteTransaction')}`;
      }

      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        header: headerField,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir },
        data: { locaKey: popupMsg }
      });
      dialogRef.onClose.subscribe(async (result: any) => {
        if (result.toLowerCase() === 'yes') {
          this.activatedRoute.queryParams.subscribe(params => {
            this.commonService.clearQueryParameters();
            Object.keys(params).forEach(element => {
              if (this.isParamValid(params[element])) {
                this.commonService.putQueryParameters(element, params[element]);
              }
            });
          });
          await this.submitService.performSeveralRejectedMaintenance(this.submissionRequest, FccGlobalConstant.DELETE, successMsg);
          this.onChange(this.activeIndex);
        }
      });
      dialogRef.onDestroy.subscribe(() => {
        this.commonService.isCommentSectionBtnEnabled.next(true);
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickMultiCancel(actionParams) {
    if (this.selectedRowsdata.length) {
      const headerField = `${this.translate.instant('cancelTransaction')}`;
      this.enableMultiSubmitResponse = false;
      this.submissionRequest.listKeys = this.selectedRowsdata;
      const dir = localStorage.getItem('langDir');
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        header: headerField,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir },
        data: { locaKey: 'multiCancelConfirmationMsg' }
      });
      dialogRef.onClose.subscribe(async (result: any) => {
        if (result.toLowerCase() === 'yes') {
          this.activatedRoute.queryParams.subscribe(params => {
            this.commonService.clearQueryParameters();
            Object.keys(params).forEach(element => {
              if (this.isParamValid(params[element])) {
                this.commonService.putQueryParameters(element, params[element]);
              }
            });
          });
          await this.submitService.performSeveralCancel(this.submissionRequest, FccGlobalConstant.CANCEL_OPTION);
          this.onChange(this.activeIndex);
        }
      });
      dialogRef.onDestroy.subscribe(() => {
        this.commonService.isCommentSectionBtnEnabled.next(true);
      });
    }
  }

  isParamValid(param: any) {
    let isParamValid = false;
    if (param !== undefined && param !== null && param !== '') {
      isParamValid = true;
    }
    return isParamValid;
  }

  onSubmissionResponse(response) {
    if (response) {
      this.resetAccMessageContent();
      this.resetResponse();
      this.onChange(this.activeIndex);
      // this.ngOnInit();
      this.responseMap = this.severalSubmitService.getMultiSubmitResponse();
      this.enableMultiSubmitResponse = true;
    }
  }

  resetResponse() {
    this.responseMap = '';
    this.comments = '';
    this.selectedRowsdata = [];
    this.selectedRowsdataForDeleteClear = [];
    this.enableMultiSubmitResponse = false;
    this.disableReturn = false;
    /**
     * commenting below line to resolve tab data count issue
     */
    //this.transListdef = undefined;
    if (this.multiSubmitForm) {
      this.multiSubmitForm.controls.comments.patchValue('');
    }
  }

  onHeaderCheckboxToggle(event) {

    this.activatedRoute.queryParams.subscribe(params=>{
      if((params.option==FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC ||
            params.option === FccGlobalConstant.PAYMENTS)
            && params.category==FccGlobalConstant.FCM.toUpperCase()){
          if(!event.checked){
            this.commentsMandatory=false;
          }
          if(null!=event.selectedRows&&undefined!=event.selectedRows){
            this.selectedRowsdata=event.selectedRows;
          }else{
            this.selectedRowsdata = [];
          }
      }else{
        this.multiSelectEventListdef.emit(event);
        this.selectedRowsdata = [];
        if (event.checked) {
          if (this.activeItem && this.activeItem[`displayInputSwitch`] && this.activeItem[`displayInputSwitch`][`display`]) {
            this.selectedRowsdata = event.selectedRows;
          } else {
            this.selectedRowsdata = [];
            this.selectedRowsdataForDeleteClear = [];
            event.selectedRows.forEach(element => {
              this.selectedRowsdata.push(element.box_ref + '_' + element.tnx_amt);
                this.selectedRowsdataForDeleteClear.push(element);
            });
            this.commonService.showCommentDialog= true;
          }
        } else {
        this.selectedRowsdata = [];
        this.selectedRowsdataForDeleteClear = [];
        }
      }
    });
  }

 get charactersEntered() {
  if (this.multiSubmitForm) {
  this.charactersEnteredValue = this.multiSubmitForm.get('comments').value.length;
  return this.charactersEnteredValue;
  } else {
    return 0;
  }
}

// checks permission and atleast one row selected
toggleSubmission(): boolean {
  if (this.hasSubmissionAccess && this.selectedRowsdata.length === 1 && !this.toggleRequired){
    if(this.selectedRowsdata[0].batchStatus === FccGlobalConstant.PENDINGMYVERIFICATION
      || this.selectedRowsdata[0].batchStatus === FccGlobalConstant.PARTIALLYVERIFIED
      || this.selectedRowsdata[0].batchStatus === FccGlobalConstant.VERIFIED){
        this.commonService.setSelectedBatchpaymentStatus(this.selectedRowsdata[0].batchStatus);
      } else {
        this.commonService.setSelectedBatchpaymentStatus(null);
      }
    if(this.selectedRowsdata[0].batchStatus === FccGlobalConstant.VERIFIED){
        this.verifiedTnx = true;
        this.pendingVerifiedTnx = false;
      } else if(this.selectedRowsdata[0].batchStatus === FccGlobalConstant.PENDINGMYVERIFICATION
        || this.selectedRowsdata[0].batchStatus === FccGlobalConstant.PARTIALLYVERIFIED){
        this.verifiedTnx = false;
        this.pendingVerifiedTnx = true;
      } else {
        this.verifiedTnx = false;
        this.pendingVerifiedTnx = false;
      }
  } else if (this.selectedRowsdata.length === 0){
    this.commonService.setSelectedBatchpaymentStatus(null);
  }
  return this.hasSubmissionAccess && this.selectedRowsdata.length > 0 && !this.toggleRequired;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
onFilterApply(event) {
  if (event && event.value) {
    const filterParams = event.value;
    const transformedParameters = {};
    Object.keys(filterParams).forEach(element => {
      if (filterParams[element] instanceof Array) {
        const pipedValue = filterParams[element].toString().replaceAll(',', '|');
        transformedParameters[event.controls[element][FccGlobalConstant.PARAMS].srcElementId] = pipedValue;
      } else {
        transformedParameters[event.controls[element][FccGlobalConstant.PARAMS].srcElementId] = filterParams[element];
      }
    });
    this.params.filterParams = transformedParameters;
  }
  this.resetAccMessageContent();
  this.resetResponse();
}

ngOnDestroy() {
  this.resetAccMessageContent();
  this.resetResponse();
  this.setRetreiveFromCache(false);
  this.commonService.isResponse.next(false);
  this.respSubscription.unsubscribe();
  this.entitySubscription.unsubscribe();
  this.refSubscription.unsubscribe();
  this.commonService.noReloadListDef = false;
  this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
  this.buttonDialogResponse = null;
  this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
  this.commonService.widgetFilterParams = {};
}

setButtonBlockDirection() {
  if (this.dir === 'rtl') {
  return 'left';
  } else {
  return 'right';
  }
}

  onCloseMatDrawer() {
    this.drawer.close();
    this.refDrawer.close();
    this.hideShowDeleteWidgetsService.customiseSubject.next(false);
    document.body.style.overflow = 'scroll';
  }
  setClass(vals: any) {
    let classType = '';
    if (vals.selected === true && this.activeIndex === vals.index) {
      classType = this.dir === 'rtl' ? 'rtlWith-Background' : 'with-background';
      this.countStyle = 'cardTypeActive';
    } else {
      classType = this.dir === 'rtl' ? 'rtlWithout-Background' : 'without-background';
      this.countStyle = 'cardTypeInactive';
    }
    return classType;
  }

   handleAction(actionParam) {
    const fnName = `onClickMulti${actionParam.action.substr(0, 1).toUpperCase()}${actionParam.action.substr(1)}`;
    this[fnName](actionParam);
  }

  performBeneficiaryMutliApprRejectFCM(actionParams:any, eventType:any, successMsg, errMsg){
    const associationIdsArr = [];
    if(this.selectedRowsdata.length>0){
      this.selectedRowsdata.forEach(rowData=>{
        if(rowData!=undefined&&null!=rowData){
          associationIdsArr.push(rowData[FccGlobalConstant.associationIdKey]);
          this.selectedRowsdata=[];
        }
      });
      this.commonService.performBeneficiaryMultiApproveRejectFCM(associationIdsArr,
        eventType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        actionParams.comment).subscribe(_res => {
          this.refreshTableData();
          this.selectedRowsdata = [];
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary: `${this.translate.instant('success')}`,
            detail: this.translate.instant(successMsg)
          });
          associationIdsArr.forEach(assocId => {
            this.successAccArr.push(assocId);
          });
        },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _err => {
            this.refreshTableData();
            this.failedAccounts = _err.error;
            //remove failed from success
            if (Object.keys(this.failedAccounts).length !== 0) {
              if (this.failedAccounts.code) {
                delete this.failedAccounts.code;
              }
              for (const key in this.failedAccounts) {
                associationIdsArr.splice(associationIdsArr.indexOf(key), 1);
              }
            }

            //populate succeeded bene
            associationIdsArr.forEach(assocId => {
              this.successAccArr.push(assocId);
            });

            this.commonService.showToasterMessage({
              life: 5000,
              key: 'tc',
              severity: 'error',
              summary: this.translate.instant('error'),
              detail: this.translate.instant(errMsg)
            });
          });
    }
  }

  checkEmptyObject(failedAccounts):boolean{
    return Object.keys(failedAccounts).length!==0;
  }

  performPaymentsMultiApproveRejectFCM(actionParams:any, eventType:any, successMsg, errMsg){
      const paymentReferenceNumbers = [];
      if(this.selectedRowsdata.length>0){
        this.selectedRowsdata.forEach(rowData=>{
          if(rowData!=undefined&&null!=rowData){
            paymentReferenceNumbers.push(rowData[FccGlobalConstant.PAYMENT_REFERENCE_NUMBER]);
            this.selectedRowsdata=[];
          }
        });
        this.commonService.performTransactionPaymentsMultiApproveRejectFCM(paymentReferenceNumbers,
          eventType,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          actionParams.comment).subscribe(_res=>
          {
          this.refreshTableData();
          this.selectedRowsdata=[];
          this.commonService.showToasterMessage({
            life : 5000,
            key: 'tc',
            severity: 'success',
            summary: `${this.translate.instant('success')}`,
            detail: this.translate.instant(successMsg)
          });
          paymentReferenceNumbers.forEach(number=>{
            this.successAccArr.push(number);
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _err=>{
          this.refreshTableData();
          this.failedAccounts=_err.error;
          //remove failed from success
          if(Object.keys(this.failedAccounts).length!==0){
            for(const key in this.failedAccounts){
                paymentReferenceNumbers.splice(paymentReferenceNumbers.indexOf(key),1);
            }
          }

          //populate succeeded bene
          paymentReferenceNumbers.forEach(number => {
            this.successAccArr.push(number);
          });

        this.commonService.showToasterMessage({
            life : 5000,
            key: 'tc',
            severity: 'error',
            summary:this.translate.instant('error'),
            detail:this.translate.instant(errMsg)
          });
        });
      }
    }

    performPaymentsMultiSubmitFCM(actionParams:any, eventType:any, successMsg, errMsg){
      const paymentReferenceNumbers = [];
      if(this.selectedRowsdata.length>0){
        this.selectedRowsdata.forEach(rowData=>{
          if(rowData!=undefined&&null!=rowData){
            paymentReferenceNumbers.push(rowData[FccGlobalConstant.PAYMENT_REFERENCE_NUMBER]);
            this.selectedRowsdata=[];
          }
        });
        this.paymentService.submitBatchMultiple(paymentReferenceNumbers, '').subscribe(()=>
        {
          this.refreshTableData();
          this.selectedRowsdata=[];
          this.commonService.showToasterMessage({
            life : 5000,
            key: 'tc',
            severity: 'success',
            summary: `${this.translate.instant('success')}`,
            detail: this.translate.instant(successMsg)
          });
          paymentReferenceNumbers.forEach(number=>{
            this.successAccArr.push(number);
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _err=>{
          this.refreshTableData();
          this.failedAccounts=_err.error;
          //remove failed from success
          if(Object.keys(this.failedAccounts).length!==0){
            for(const key in this.failedAccounts){
                paymentReferenceNumbers.splice(paymentReferenceNumbers.indexOf(key),1);
            }
          }

          //populate succeeded bene
          paymentReferenceNumbers.forEach(number => {
            this.successAccArr.push(number);
          });

        this.commonService.showToasterMessage({
            life : 5000,
            key: 'tc',
            severity: 'error',
            summary:this.translate.instant('error'),
            detail:this.translate.instant(errMsg)
          });
        });
      }
    }

    performPaymentsMultiVerifyFCM(actionParams:any, eventType:any, successMsg, errMsg){
      const paymentReferenceNumbers = [];
      if(this.selectedRowsdata.length>0){
        this.selectedRowsdata.forEach(rowData=>{
          if(rowData!=undefined&&null!=rowData){
            paymentReferenceNumbers.push(rowData[FccGlobalConstant.PAYMENT_REFERENCE_NUMBER]);
            this.selectedRowsdata=[];
          }
        });
        this.commonService.performPaymentsVerifyFCM(paymentReferenceNumbers,
          eventType,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          actionParams.comment).subscribe(_res=>
          {
          this.refreshTableData();
          this.selectedRowsdata=[];
          this.commonService.showToasterMessage({
            life : 5000,
            key: 'tc',
            severity: 'success',
            summary: `${this.translate.instant('success')}`,
            detail: this.translate.instant(successMsg)
          });
          paymentReferenceNumbers.forEach(number=>{
            this.successAccArr.push(number);
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _err=>{
          this.refreshTableData();
          this.failedAccounts=_err.error;
          //remove failed from success
          if(Object.keys(this.failedAccounts).length!==0){
            for(const key in this.failedAccounts){
                paymentReferenceNumbers.splice(paymentReferenceNumbers.indexOf(key),1);
            }
          }

          //populate succeeded bene
          paymentReferenceNumbers.forEach(number => {
            this.successAccArr.push(number);
          });

        this.commonService.showToasterMessage({
            life : 5000,
            key: 'tc',
            severity: 'error',
            summary:this.translate.instant('error'),
            detail:this.translate.instant(errMsg)
          });
        });
      }
    }


    performPaymentsMultiVerifierRejectFCM(actionParams:any, eventType:any, successMsg, errMsg){
      const paymentReferenceNumbers = [];
      if(this.selectedRowsdata.length>0){
        this.selectedRowsdata.forEach(rowData=>{
          if(rowData!=undefined&&null!=rowData){
            paymentReferenceNumbers.push(rowData[FccGlobalConstant.PAYMENT_REFERENCE_NUMBER]);
            this.selectedRowsdata=[];
          }
        });
        this.commonService.performPaymentsVerifierRejectFCM(paymentReferenceNumbers,
          eventType,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          actionParams.comment).subscribe(_res=>
          {
          this.refreshTableData();
          this.selectedRowsdata=[];
          this.commonService.showToasterMessage({
            life : 5000,
            key: 'tc',
            severity: 'success',
            summary: `${this.translate.instant('success')}`,
            detail: this.translate.instant(successMsg)
          });
          paymentReferenceNumbers.forEach(number=>{
            this.successAccArr.push(number);
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _err=>{
          this.refreshTableData();
          this.failedAccounts=_err.error;
          //remove failed from success
          if(Object.keys(this.failedAccounts).length!==0){
            for(const key in this.failedAccounts){
                paymentReferenceNumbers.splice(paymentReferenceNumbers.indexOf(key),1);
            }
          }

          //populate succeeded bene
          paymentReferenceNumbers.forEach(number => {
            this.successAccArr.push(number);
          });

        this.commonService.showToasterMessage({
            life : 5000,
            key: 'tc',
            severity: 'error',
            summary:this.translate.instant('error'),
            detail:this.translate.instant(errMsg)
          });
        });
      }
    }

  onClickView(event, valObj){
    this.tableService.onClickViewMultiSubmit(event, valObj);
  }

  performPaymentsMultiSendFCM(actionParams:any, eventType:any, successMsg, errMsg){
    const paymentReferenceNumbers = [];
    if(this.selectedRowsdata.length>0){
      this.selectedRowsdata.forEach(rowData=>{
        if(rowData!=undefined&&null!=rowData){
          paymentReferenceNumbers.push(rowData[FccGlobalConstant.PAYMENT_REFERENCE_NUMBER]);
          this.selectedRowsdata=[];
        }
      });
      this.commonService.performPaymentsSendFCM(paymentReferenceNumbers,
        eventType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        actionParams.comment).subscribe(_res=>
        {
        this.refreshTableData();
        this.selectedRowsdata=[];
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translate.instant('success')}`,
          detail: this.translate.instant(successMsg)
        });
        paymentReferenceNumbers.forEach(number=>{
          this.successAccArr.push(number);
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _err=>{
        this.refreshTableData();
        this.failedAccounts=_err.error;
        //remove failed from success
        if(Object.keys(this.failedAccounts).length!==0){
          for(const key in this.failedAccounts){
              paymentReferenceNumbers.splice(paymentReferenceNumbers.indexOf(key),1);
          }
        }

        //populate succeeded bene
        paymentReferenceNumbers.forEach(number => {
          this.successAccArr.push(number);
        });

      this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errMsg)
        });
      });
    }
  }

}
