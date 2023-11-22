import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, SelectItem } from 'primeng';
import { Subscription } from 'rxjs';
import { MultiSelectFormControl } from '../../../../base/model/form-controls.model';
import { CommonService } from '../../../../common/services/common.service';
import { FormService } from '../../../../common/services/listdef-form-service';
import { ResolverService } from '../../../../common/services/resolver.service';
import { ConfirmationDialogComponent } from '../../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { UtilityService } from '../../../../corporate/trade/lc/initiation/services/utility.service';
import { FiltersectionComponent } from '../../../components/filtersection/filtersection.component';
import { GlobalDashboardComponent } from '../../../components/global-dashboard/global-dashboard.component';
import { TransactionsListdefComponent } from '../../../components/transactions-listdef/transactions-listdef.component';
import { FccConstants } from '../../../core/fcc-constants';
import { FccGlobalConstantService } from '../../../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../core/fcc-global-constants';
import { ButtonItemList } from '../../../model/ButtonItemList';
import { ProductFormHeaderParams } from '../../../model/params-model';
import { SubmissionRequest } from '../../../model/submissionRequest';
import { ListDefService } from '../../../services/listdef.service';
import { SeveralSubmitService } from '../../../services/several-submit.service';
import { TableService } from './../../../../base/services/table.service';

@Component({
  selector: 'app-tab-panel-listing',
  templateUrl: './tab-panel-listing.component.html',
  styleUrls: ['./tab-panel-listing.component.scss'],
  providers: [GlobalDashboardComponent]
})
export class TabPanelListingComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @Output() rowSelectEventListdef: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowUnSelectEventListdef: EventEmitter<any> = new EventEmitter<any>();
  @Output() multiSelectEventListdef: EventEmitter<any> = new EventEmitter<any>();
  activeItem: any = {};
  @Input() data: ProductFormHeaderParams;
  hasSubmissionAccess: boolean;
  toggleRequired = this.commonService.defaultLicenseFilter;
  enableMultiSubmitResponse: boolean;
  respSubscription: Subscription;
  disableReturn = false;
  multiSubmitForm: UntypedFormGroup;
  commentsRequired = false;
  buttonItemList: ButtonItemList[] = [];
  bottomButtonList: any[] = [];
  buttonItems: any = [];
  commentButtonList: any = [];
  submissionRequest: SubmissionRequest = {};
  allTabDetails: any;
  responseMap ;
  comments = '';
  subMenu: any = [];
  tabListingArray: any = [];
  tabbedMenu = [];
  widgetCode: any = '';
  productCode: any = '';
  buttonList = [];
  subProductCode: any = '';
  option: any = '';
  dashboardName = 'global';
  currentActive = FccGlobalConstant.ZERO;
  params: any = {};
  parameters: any = {};
  tempWidgetNodes = [];
  displayHeader = true;
  tabListingHeader = '';
  allAccountlistingArray: any = [];
  listdefListingArray: any = [];
  componentListingArray: any = [];
  masterAllAccountlistingArray: any = [];
  allAccountPage = false;
  accountType: SelectItem[];
  selectedEmploye: SelectItem;
  routeIndex;
  resetFormSubject: any;
  isFiltersClicked = false;
  formValues: any[] = [];
  widgetFilterData: any;
  indexAcc: number = null;
  buttons: any[] = [];
  displayableJson: any;
  displayableJsonValue: any;
  dir: string = localStorage.getItem('langDir');
  dirChevronStyle;
  showFilterSection = false;
  showAllAccountPageFilter = false;
  eventEmitter = false;
  filterValOfAccType: any;
  masterTabPanel: any;
  userAccountTypeArray: any;
  multipleTabEnable = false;
  tabName: string;
  metadata: any;
  activeIndex = FccGlobalConstant.ZERO;
  activeTabIndex = FccGlobalConstant.ZERO;
  @ViewChildren('tablList') items: QueryList<ElementRef>;
  @ViewChild('tabListContent') tabListContent: ElementRef;
  @ViewChild('panelTabs') panelTabs: ElementRef;
  @Input() someInput: string;
  @ViewChild(FiltersectionComponent) public formValuesBinding: FiltersectionComponent;
  @Input() getformValue: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren('listdef') tabPanel: QueryList<TransactionsListdefComponent>;
  @ViewChild('listdef') tabPanellist: TransactionsListdefComponent;
  firstLoad = true;
  routerFilterParams: any;
  filterParams: any;
  filterParam: any = {};
  diaplayAdvFilterData = false;
  chequeParams: any = {};
  selectedRowsdata: string[] = [];
  changed: boolean;
  displayDialog = false;
  tabConfigHeader: any;
  urlName: any;
  contentType = 'Content-Type';
  count: any;
  paginatorParams: any;
  activeState = false;
  isAllAccountScreen = false;
  @Input() inputParams;
  category: string;

  constructor(protected activatedRoute: ActivatedRoute, protected listService: ListDefService,
              protected commonService: CommonService,
              protected translateService: TranslateService,
              protected utilityService: UtilityService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected router: Router, protected fb: UntypedFormBuilder,
              protected formService: FormService,
              protected dialogService: DialogService,
              protected resolverService: ResolverService,
              protected severalSubmitService: SeveralSubmitService,
              protected changedetector: ChangeDetectorRef,
              protected http: HttpClient,
              protected tableService: TableService) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.widgetCode = queryParams[`widgetCode`] || '';
      this.productCode = queryParams[`productCode`] || '';
      this.routeIndex = queryParams[`tabIndex`] || '';
      this.subProductCode = queryParams[`subProductCode`] || '';
      this.params = {};
      this.allAccountlistingArray = [];
      this.listdefListingArray = [];
      this.componentListingArray = [];
      if (this.widgetCode) {
        this.displayWidget();
      } else {
        this.displayTable();
      }
      
      this.commonService.clearQueryParameters();
      Object.keys(queryParams).forEach(element => {
        if (this.isParamValid(queryParams[element])) {
          this.commonService.putQueryParameters(element, queryParams[element]);
        }
      });
      if (this.commonService.isnonEMptyString(queryParams.activeTab)) {
        this.onTabChange({ index : +queryParams.activeTab });
       }
    });
    this.routerFilterParams = this.router.getCurrentNavigation()?.extras?.state?.filterdata;
  }

  ngOnInit(): void {
    this.multiSubmitForm = this.fb.group({
      comments: ['']
    });
    if (!this.productCode) {
      document.body.style.overflow = FccGlobalConstant.BODY_SCROLL_HIDDEN;
    }
    this.buttons = [
      {
        localizationkey: this.translateService.instant('apply'),
        name: 'applyBtn',
        type: 'submit',
        functionCall: 'handleApply($event)',
        className: 'primaryButton',
        hidden: 'false'
      }
    ];

    if (this.dir === 'rtl') {
      this.dirChevronStyle = 'chevronRtlStyle';
    } else {
      this.dirChevronStyle = 'chevronLtrStyle';
    }
    if (this.routerFilterParams) {
      Object.keys(this.routerFilterParams).forEach(element => {
        if (this.routerFilterParams[element] instanceof Array) {
          this.routerFilterParams[element] = this.routerFilterParams[element].toString()
          .replaceAll(',', '|');
        }
      });
    }
    this.respSubscription = this.commonService.isResponse.subscribe(
      data => {
        this.onSubmissionResponse(data);
      });
      this.isAllAccountScreen = this.widgetCode && this.widgetCode === FccConstants.ALL_ACCOUNTS;
  }

  @HostListener('window:keyup', ['$event'])
  tabEvent(event: KeyboardEvent) {
    const FILTER_SECTION_DIV_ID = 'filterSectionDivison';
    const KEYBOARD_TAB_KEY = 'Tab';
    const DOWNLOAD_BUTTON = 'tableDownload';

    const filterSectionDiv = document.getElementById(FILTER_SECTION_DIV_ID);
    const isFocused = (document.activeElement === filterSectionDiv);

    const isTabSkipRequired = (event.key === KEYBOARD_TAB_KEY
      && isFocused
      && !this.isFiltersClicked);
    if (isTabSkipRequired) {
      const tableDownload = document.getElementById(DOWNLOAD_BUTTON);
      tableDownload.setAttribute('tabindex', '-1');
      tableDownload.focus();
      tableDownload.setAttribute('tabindex', '0');
    }
  }

  toggleAdvancedFilter() {
    this.isFiltersClicked = !this.isFiltersClicked;
  }

  getMetadataForChequeStatus() {
    this.listService.getMetaData(FccConstants.VIEW_CHEQUE_STATUS_LISTDEF, FccGlobalConstant.PRODUCT_SE)
      .subscribe(response => {
        this.metadata = response;
      });
  }

  handlefilterPopup() {
    this.resolverService.handleViewStatuspopup();
  }

  ngAfterViewInit() {
    this.items.changes.subscribe(() => {
      this.tempWidgetNodes = this.items.toArray();
      if (this.tempWidgetNodes.length > 1) {
        this.tempWidgetNodes[this.tempWidgetNodes.length - 1].nativeElement.style.height =
          this.tempWidgetNodes[this.tempWidgetNodes.length - 1].nativeElement.offsetHeight + FccGlobalConstant.LENGTH_2000 + 'px';
      }
      if (this.routeIndex) {
        this.onWidgetClick(Number(this.routeIndex));
      } else {
        this.onWidgetClick(FccGlobalConstant.ZERO);
      }
    });
  }

  ngAfterViewChecked() {
    if (this.formValuesBinding && this.firstLoad && this.routerFilterParams && this.commonService.filterInputVal) {
      this.getFormValue(null, true, null, this.routerFilterParams);
      this.firstLoad = false;
    }
    this.commonService.addIdToMatTabLabel();
  }

  displayWidget() {
    const metadata = 'metadata';
    this.allAccountPage = false;
    this.diaplayAdvFilterData = false;
    this.listService.getSectionTabDetails(this.productCode, this.widgetCode).subscribe((resp) => {
      if (resp.Buttons && resp.Buttons.length) {
        this.buttonList = resp.Buttons;
      }
      if (resp.actionPopup) {
        this.commonService.setActionPopup(resp.actionPopup);
      }
      this.tabListingArray = resp.TabLists;
      this.tabListingHeader = resp.TabHeader;
      if (this.productCode && resp.TabLists && resp.TabLists.length) {
        if (resp.TabLists[FccGlobalConstant.ZERO].Tabs && resp.TabLists[FccGlobalConstant.ZERO].Tabs.length) {
          this.onChequeTabClicked(resp.TabLists[this.activeTabIndex].Tabs[this.activeIndex],
            resp.TabLists[this.activeTabIndex]);
          this.allTabDetails = resp.TabLists[FccGlobalConstant.ZERO];
        }
      } else {
        this.multipleTabEnable = this.tabListingArray && this.tabListingArray.length > 1 ? true : false;
        this.tabListingArray.forEach((item) => {
        if (item.tabSelector === FccGlobalConstant.LISTDEF_COMMON_COMPONENT &&
          item.TabConfig && item.TabConfig.length > FccGlobalConstant.ZERO) {
          for (const tabconfig of item.TabConfig) {
            this.parameters = {};
            this.params = {};
            Object.keys(tabconfig).forEach(element => {
              this.params[element] = this.checkForBooleanValue(tabconfig[element]);
              this.parameters[element] = this.checkForBooleanValue(tabconfig[element]);
            });
            if (this.widgetCode !== FccConstants.PAYMENTS_OVERVIEW)
            {
              this.params[FccConstants.DISPLAY_TOTAL_BALANCE] = true;
              this.parameters[FccConstants.DISPLAY_TOTAL_BALANCE] = true;
            }
            if (item.showFilter) {
              this.parameters[metadata] = item.MetaDataResponse;
              this.parameters[FccGlobalConstant.WILDSEARCH] = true;
              // Column customization is not applicable for lisdef under All Accounts of Account Services
              this.parameters.allowColumnCustomization = false;
              this.parameters.showFilter = item.showFilter;
              this.params.allowPreferenceSave = this.commonService.isnonEMptyString(item?.allowPreferenceSave)
              ? item.allowPreferenceSave : true;
              // Resetting preferences
              this.parameters.preferenceName = undefined;
              this.parameters.preferenceData = undefined;
              this.parameters.actionconfig = true;
              this.parameters.widgetName = this.translateService.instant('N068_' + tabconfig.accountType);
              this.parameters[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = this.parameters[FccGlobalConstant.DOWNLOAD_ICON_ENABLED];
              this.tabName = item.tabName;
              this.parameters.multipleTabEnable = false;
              this.allAccountlistingArray.push(this.parameters);
              this.commonService.masterAllAccountlistingArray = this.allAccountlistingArray;
            } else {
              this.params[metadata] = item.MetaDataResponse;
              this.params[FccGlobalConstant.ACTIONCONFIG] = true;
              this.params[FccGlobalConstant.WILDSEARCH] = true;
              this.params.allowColumnCustomization = true;
              this.params.allowPreferenceSave = this.commonService.isnonEMptyString(item?.allowPreferenceSave)
              ? item.allowPreferenceSave : true;
              // Resetting preferences
              this.params.preferenceName = undefined;
              this.params.preferenceData = undefined;
              this.params.multipleTabEnable = this.multipleTabEnable;
              this.params.tabName = item.tabName;
              this.params[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = this.params[FccGlobalConstant.DOWNLOAD_ICON_ENABLED];
              this.listdefListingArray.push(this.params);
              item[FccGlobalConstant.LISTDEF_NAME] = this.params[FccGlobalConstant.LISTDEF_NAME];
            }
          }
        } else {
          item.widgetName = item.tabName;
          item.widgetSelector = item.tabSelector;
          item.multipleTabEnable = this.multipleTabEnable;
        }
      });
        this.params[FccGlobalConstant.WIDGET_NAME] =
        this.tabListingHeader ? this.tabListingHeader : FccGlobalConstant.LIST_DATA_TITLE;
      }
    });
    this.userAccountTypeArray = [];
    const language = localStorage.getItem('language') !== null ? localStorage.getItem('language') : '';
    this.commonService.getUserAccountType(this.fccGlobalConstantService.userAccountsType + '/' + language)
      .subscribe(result => {
        result.body.items.forEach(value => {
          const accountType: { label: string; value: any } = {
            label: value.description,
            value: value.type
          };
          this.userAccountTypeArray.push(accountType);
        });
      });

  }

  displayTable() {
    const metadata = 'metadata';
    this.allAccountPage = false;
    this.diaplayAdvFilterData = false;
    const filterParams = this.setDefaultFilterCriteria();
    this.category = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
      this.listService.getTabDetails(this.inputParams.ProductCode, this.inputParams.subProductCode,
        this.inputParams.Option, this.inputParams.listDef, filterParams, this.category).subscribe((resp) => {
      if (resp.Buttons && resp.Buttons.length) {
        this.buttonList = resp.Buttons;
      }
      if (resp.actionPopup) {
        this.commonService.setActionPopup(resp.acptionPopup);
      }
      this.tabListingArray = resp.TabLists;
      this.tabListingHeader = resp.TabHeader;
      if (this.productCode && resp.TabLists && resp.TabLists.length) {
        if (resp.TabLists[FccGlobalConstant.ZERO].Tabs && resp.TabLists[FccGlobalConstant.ZERO].Tabs.length) {
          this.onChequeTabClicked(resp.TabLists[this.activeTabIndex].Tabs[this.activeIndex],
            resp.TabLists[this.activeTabIndex]);
          this.allTabDetails = resp.TabLists[FccGlobalConstant.ZERO];
        }
      } else {
        this.multipleTabEnable = this.tabListingArray && this.tabListingArray.length > 1 ? true : false;
        this.tabListingArray.forEach((item) => {
        if (item.tabSelector === FccGlobalConstant.LISTDEF_COMMON_COMPONENT &&
          item.TabConfig && item.TabConfig.length > FccGlobalConstant.ZERO) {
          for (const tabconfig of item.TabConfig) {
            this.parameters = {};
            this.params = {};
            Object.keys(tabconfig).forEach(element => {
              this.params[element] = this.checkForBooleanValue(tabconfig[element]);
              this.parameters[element] = this.checkForBooleanValue(tabconfig[element]);
            });
            if (this.widgetCode !== FccConstants.PAYMENTS_OVERVIEW)
            {
              this.params[FccConstants.DISPLAY_TOTAL_BALANCE] = true;
              this.parameters[FccConstants.DISPLAY_TOTAL_BALANCE] = true;
            }
            if (item.showFilter) {
              this.parameters[metadata] = item.MetaDataResponse;
              this.parameters[FccGlobalConstant.WILDSEARCH] = true;
              // Column customization is not applicable for lisdef under All Accounts of Account Services
              this.parameters.allowColumnCustomization = false;
              this.parameters.showFilter = item.showFilter;
              this.params.allowPreferenceSave = this.commonService.isnonEMptyString(item?.allowPreferenceSave)
              ? item.allowPreferenceSave : true;
              // Resetting preferences
              this.parameters.preferenceName = undefined;
              this.parameters.preferenceData = undefined;
              this.parameters.actionconfig = true;
              this.parameters.widgetName = this.translateService.instant('N068_' + tabconfig.accountType);
              this.parameters[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = this.parameters[FccGlobalConstant.DOWNLOAD_ICON_ENABLED];
              this.tabName = item.tabName;
              this.parameters.multipleTabEnable = false;
              this.allAccountlistingArray.push(this.parameters);
              this.commonService.masterAllAccountlistingArray = this.allAccountlistingArray;
            } else {
              this.params[metadata] = item.MetaDataResponse;
              this.params[FccGlobalConstant.ACTIONCONFIG] = true;
              this.params[FccGlobalConstant.WILDSEARCH] = true;
              this.params.allowColumnCustomization = true;
              this.params.allowPreferenceSave = this.commonService.isnonEMptyString(item?.allowPreferenceSave)
              ? item.allowPreferenceSave : true;
              // Resetting preferences
              this.params.preferenceName = undefined;
              this.params.preferenceData = undefined;
              this.params.multipleTabEnable = this.multipleTabEnable;
              this.params.tabName = item.tabName;
              this.params[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = this.params[FccGlobalConstant.DOWNLOAD_ICON_ENABLED];
              this.listdefListingArray.push(this.params);
              item[FccGlobalConstant.LISTDEF_NAME] = this.params[FccGlobalConstant.LISTDEF_NAME];
            }
          }
        } else {
          item.widgetName = item.tabName;
          item.widgetSelector = item.tabSelector;
          item.multipleTabEnable = this.multipleTabEnable;
        }
      });
        this.params[FccGlobalConstant.WIDGET_NAME] =
        this.tabListingHeader ? this.tabListingHeader : FccGlobalConstant.LIST_DATA_TITLE;
      }
    });
    this.userAccountTypeArray = [];
    const language = localStorage.getItem('language') !== null ? localStorage.getItem('language') : '';
    this.commonService.getUserAccountType(this.fccGlobalConstantService.userAccountsType + '/' + language)
      .subscribe(result => {
        result.body.items.forEach(value => {
          const accountType: { label: string; value: any } = {
            label: value.description,
            value: value.type
          };
          this.userAccountTypeArray.push(accountType);
        });
      });

  }


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
    return JSON.stringify(filterParams);
  }

  OnEnterKey(event, index) {
    if (event && event.code && event.code === 'Enter') {
      this.onWidgetClick(index);
    }
  }

  onWidgetClick(i) {
    if (!this.productCode) {
      let topPosition = FccGlobalConstant.ZERO;
      this.items.forEach((item, index) => {
        if (index === i) {
          const offsetTop = i * FccGlobalConstant.LENGTH_16;
          this.tabListContent.nativeElement.scrollTop = topPosition ? topPosition + offsetTop : topPosition;
          this.currentActive = i;
        }
        topPosition += item.nativeElement.offsetHeight;
      });
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = FccGlobalConstant.BODY_SCROLL_AUTO;
  }

  onScroll(e) {
    const scrollTop = e.target.scrollTop;
    // Logic for hiding header that is breaking scroll and tab selection feature
    // this.displayHeader = scrollTop === 0;
    // if (scrollTop !== 0) {
    //   this.panelTabs.nativeElement.style.background = 'white';
    //   this.panelTabs.nativeElement.style.paddingBottom = '0';
    //   if (window.innerWidth < 1160) {
    //     this.panelTabs.nativeElement.style.paddingTop = '3em !important';
    //   }
    // } else {
    //   this.panelTabs.nativeElement.style.background = '#f9f8fd';
    // }
    this.tempWidgetNodes.forEach(() => {
      if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight)) {
        this.currentActive = 0;
      } else if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight +
        this.tempWidgetNodes[1].nativeElement.clientHeight) &&
        scrollTop > (this.tempWidgetNodes[0].nativeElement.clientHeight)) {
        this.currentActive = 1;
      } else if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight +
        this.tempWidgetNodes[1].nativeElement.clientHeight + this.tempWidgetNodes[2].nativeElement.clientHeight)
        && scrollTop > (this.tempWidgetNodes[0].nativeElement.clientHeight +
          this.tempWidgetNodes[1].nativeElement.clientHeight)) {
        this.currentActive = 2;
      } else if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight +
        this.tempWidgetNodes[1].nativeElement.clientHeight + this.tempWidgetNodes[2].nativeElement.clientHeight +
        this.tempWidgetNodes[3].nativeElement.clientHeight) && scrollTop >
        (this.tempWidgetNodes[0].nativeElement.clientHeight + this.tempWidgetNodes[1].nativeElement.clientHeight
          + this.tempWidgetNodes[2].nativeElement.clientHeight)) {
        this.currentActive = 3;
      } else if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight +
        this.tempWidgetNodes[1].nativeElement.clientHeight + this.tempWidgetNodes[2].nativeElement.clientHeight
        + this.tempWidgetNodes[3].nativeElement.clientHeight + this.tempWidgetNodes[4].nativeElement.clientHeight)
        && scrollTop > (this.tempWidgetNodes[0].nativeElement.clientHeight +
          this.tempWidgetNodes[1].nativeElement.clientHeight + this.tempWidgetNodes[2].nativeElement.clientHeight +
          this.tempWidgetNodes[3].nativeElement.clientHeight)) {
        this.currentActive = 4;
      } else if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight +
        this.tempWidgetNodes[1].nativeElement.clientHeight + this.tempWidgetNodes[2].nativeElement.clientHeight
        + this.tempWidgetNodes[3].nativeElement.clientHeight + this.tempWidgetNodes[4].nativeElement.clientHeight +
        this.tempWidgetNodes[5].nativeElement.clientHeight) && scrollTop >
        (this.tempWidgetNodes[0].nativeElement.clientHeight + this.tempWidgetNodes[1].nativeElement.clientHeight +
          this.tempWidgetNodes[2].nativeElement.clientHeight + this.tempWidgetNodes[3].nativeElement.clientHeight +
          this.tempWidgetNodes[4].nativeElement.clientHeight)) {
        this.currentActive = 5;
      } else if (scrollTop < (this.tempWidgetNodes[0].nativeElement.clientHeight +
        this.tempWidgetNodes[1].nativeElement.clientHeight + this.tempWidgetNodes[2].nativeElement.clientHeight
        + this.tempWidgetNodes[3].nativeElement.clientHeight + this.tempWidgetNodes[4].nativeElement.clientHeight +
        this.tempWidgetNodes[5].nativeElement.clientHeight + this.tempWidgetNodes[6].nativeElement.clientHeight)
        && scrollTop > (this.tempWidgetNodes[0].nativeElement.clientHeight +
          this.tempWidgetNodes[1].nativeElement.clientHeight + this.tempWidgetNodes[2].nativeElement.clientHeight +
          this.tempWidgetNodes[3].nativeElement.clientHeight + this.tempWidgetNodes[4].nativeElement.clientHeight +
          this.tempWidgetNodes[5].nativeElement.clientHeight)) {
        this.currentActive = 6;
      }
    });
  }

  refreshProductList() {
    this.displayWidget();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFilterApply(event) {
    this.resetResponse();
  }
  onHeaderCheckboxToggle(event) {
    this.multiSelectEventListdef.emit(event);
    if (event.checked) {
      if (this.activeItem && this.activeItem[`displayInputSwitch`] && this.activeItem[`displayInputSwitch`][`display`]) {
        this.selectedRowsdata = [];
        this.selectedRowsdata = event.selectedRows;
      } else {
        this.selectedRowsdata = [];
        event.selectedRows.forEach(element => {
          if (element.prod_stat_code !== FccGlobalConstant.N005_EXPIRE && element.prod_stat_code !== FccGlobalConstant.N005_EXPIRED)
          {
            this.selectedRowsdata.push(element.box_ref);
          }
        });
      }
    } else {
    this.selectedRowsdata = [];
    }
  }

  getRowSelectEvent(event) {
    this.rowSelectEventListdef.emit(event);
    if (event.type === 'checkbox' && event.data.box_ref) {
      this.selectedRowsdata.push(event.data.box_ref);
    } else if (event.type === 'checkbox') {
      this.selectedRowsdata.push(event.data);
    }
  }

  getRowUnSelectEvent(event) {
    this.rowUnSelectEventListdef.emit(event);
    if (event.type === 'checkbox') {
      this.disableReturn = false;
      this.selectedRowsdata.forEach((item, index) => {
        if (item === event.data.box_ref || JSON.stringify(item) === JSON.stringify(event.data)) {
          this.selectedRowsdata.splice(index, 1);
        }
      });
    }
  }

  onFilterApplied() {
    this.handleApplyClick();
  }

  checkForBooleanValue(value: string) {
    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        if (this.commonService.isnonEMptyString(value) && value.toString().indexOf(',') !== -1) {
          const valueArray = value.split(',');
          let result = '';
          valueArray.forEach(element => {
            const trimmedValue: string = element;
            result = result + trimmedValue.trim() + '|';
          });
          value = result.substring(0, result.length - 1);
        }
        return value;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFilter(event) {
    if (this.commonService.filterInputVal) {
      this.displayableJson = this.commonService.filterInputVal;
    }
  }

  getFormValue(event, showContent: boolean, filterDataParam?: any, routerFilterParams?: any) {
    this.diaplayAdvFilterData = false;
    this.eventEmitter = true;

    if (this.displayableJson === null || this.displayableJson === undefined) {
      this.displayableJson = { ...this.commonService.filterInputVal };
    }
    this.diaplayAdvFilterData = true;
    this.filterParam.diaplayAdvFilterData = true;
    if (routerFilterParams) {
      this.filterParams = routerFilterParams;
      this.changedetector.detectChanges();
    }
    event = { ...event, showContent };
    this.toggleAdvancedFilter();
    this.masterTabPanel = this.tabPanel;
    this.formValues = [];
    let bindingValues;
    let resultArray;
    if (filterDataParam || this.widgetFilterData) {
      bindingValues = this.commonService.isNonEmptyValue(filterDataParam) ? filterDataParam : this.widgetFilterData;
      if (this.commonService.isNonEmptyValue(filterDataParam) && this.commonService.isNonEmptyValue(filterDataParam.value)) {
        resultArray = Object.keys(filterDataParam.value);
      } else {
        resultArray = Object.keys(this.widgetFilterData.value);
      }
    } else {
      bindingValues = this.commonService.isNonEmptyValue(this.formValuesBinding) ? this.formValuesBinding.form : undefined;
      this.commonService.bindingValue = bindingValues;
      if (this.commonService.isNonEmptyValue(bindingValues)) {
        resultArray = Object.keys(this.formValuesBinding.form.value);
      }
    }
    if (showContent) {
      resultArray.forEach(subele => {
        const element = bindingValues.controls[subele];
        if (element instanceof MultiSelectFormControl && element.value instanceof Array && element.value.length > 0) {
          this.getMultiSelectFormControlFormValues(element, subele, bindingValues);
        } else if ((element.value !== '' && element.value !== null) && element.value.length > 0) {
          this.getDefaultFormValues(element, subele, bindingValues);
        }
      });
    }
    return this.formValues;
  }
  getMultiSelectFormControlFormValues(element: any, subele: any, bindingValues?: any) {
    let elementValues = '';
    if (element.value.length > FccGlobalConstant.LENGTH_2) {
      if (subele === FccGlobalConstant.PARAMETER1) {
        const element0 = element.value[0].trim().substring(0, 2);
        const element1 = element.value[1].trim().substring(0, 2);
        const value0 = this.translateService.instant(element0.trim());
        const value1 = this.translateService.instant(element1.trim());
        elementValues = value0 + ' , ' + value1
          + ' & ' + (element.value.length - FccGlobalConstant.LENGTH_2) + ' '
          + this.translateService.instant(FccGlobalConstant.MORE);
      } else {
        for (let i = 0; i < FccGlobalConstant.LENGTH_2; i++) {
          elementValues = elementValues + element.value[i] + ' , ';
        }
        elementValues = elementValues.substring(0, elementValues.length - FccGlobalConstant.LENGTH_3) + ' & '
          + (element.value.length - FccGlobalConstant.LENGTH_2) + ' '
          + this.translateService.instant('more');
      }
    } else {
      if (subele === 'accountType') {
        for (let i = 0; i < element.value.length; i++) {
          elementValues = elementValues + this.translateService.instant('N068_' + element.value[i].trim()) + ' , ';
        }
        elementValues = elementValues.substring(0, elementValues.length - FccGlobalConstant.LENGTH_3);
      } else if (subele === FccGlobalConstant.PARAMETER1) {
        for (let i = 0; i < element.value.length; i++) {
          const eleValue = element.value[i].trim().substring(0, 2);
          elementValues = elementValues + this.translateService.instant(eleValue) + ' , ';
        }
        elementValues = elementValues.substring(0, elementValues.length - FccGlobalConstant.LENGTH_3);
      }
      else {
        element.value.forEach(value => {
          elementValues = elementValues + value + ' , ';
        });
        elementValues = elementValues.substring(0, elementValues.length - FccGlobalConstant.LENGTH_3);
      }
    }
    this.formValues.push({
      name: this.translateService.instant(
        (bindingValues.controls[subele][FccGlobalConstant.PARAMS].srcElementId).toUpperCase()),
      value: elementValues
    });
  }

  getDefaultFormValues(element: any, subele: any, bindingValues?: any) {
    if (element.key === FccGlobalConstant.TIMEFRAME) {
      for (const optionValue of element.options) {
        if (element.value === optionValue.value) {
          element.value = optionValue.displayedValue;
        }
      }
    }
    if (subele === 'accountType') {
      this.formValues.push({
        name: this.translateService.instant(
          (bindingValues.controls[subele][FccGlobalConstant.PARAMS].srcElementId).toUpperCase()),
        value: 'N068_' + element.value
      });
    } else {
    this.formValues.push({
      name: this.translateService.instant(
        (bindingValues.controls[subele][FccGlobalConstant.PARAMS].srcElementId).toUpperCase()),
      value: element.value
    });
  }
  }

  handleApplyClick(event?: Event, filterDataParam?: any) {
    this.activeState = false;
    this.getFormValue(event,true);
    this.commonService.bindingValue = this.commonService.isNonEmptyValue(this.formValuesBinding) ? this.formValuesBinding.form : undefined;
    const filterval = this.commonService.bindingValue;
    const fields = filterval.value;
    this.filterValOfAccType = null;
    Object.keys(fields).forEach(key => {
      if (key === 'accountType' && fields[key] !== '') {
        this.filterValOfAccType = fields[key];
      }
    });
    this.commonService.multipleablesInaPage = false;
    const filterList = [];
    this.commonService.allAccountType = false;
    const filterListTemp = this.commonService.masterAllAccountlistingArray;
    this.allAccountlistingArray = this.commonService.masterAllAccountlistingArray;
    if (this.filterValOfAccType) {
      this.commonService.multipleablesInaPage = true;
      if (this.filterValOfAccType !== 'all') {
        filterListTemp.forEach(element => {
          if (this.filterValOfAccType === element.accountType) {
            filterList.push(element);
          }
        });
        this.allAccountlistingArray = filterList;
      } else {
        this.commonService.allAccountType = true;
        this.allAccountlistingArray = filterListTemp;
      }
    }
    this.handleApply(event, filterDataParam);
  }

  handleApply(event?: Event, filterDataParam?: any) {
    this.tabPanel.forEach(element => {
      element.handleApply(event, filterDataParam);
    });
  }
  doNothing(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onButtonClick(i: number) {
    this.activeIndex = i;
    this.listService.getSectionTabDetails(this.productCode, this.widgetCode).subscribe((resp) => {
      this.tabListingArray = resp.TabLists;
      this.checkForTabsBtnClick();
    });
  }

  onTabChange($event) {
    if (this.activeTabIndex != $event.index) {
      this.activeIndex = 0;
    }
    this.activeTabIndex = $event.index;
    this.checkForTabsBtnClick();
  }

  checkForTabsBtnClick() {
    this.resetResponse();
    this.tabListingArray.forEach((item, i) => {
      if (i === this.activeTabIndex) {
        if(item.Tabs.length > 0){
          item.Tabs.forEach((tab, j) => {
            if (j === this.activeIndex) {
                this.onChequeTabClicked(tab, item);
            }
        });
        } else{
          item.Switches.forEach((tab, j) => {
            if (j === this.activeIndex) {
             this.onTabClicked(tab,item);
            }
        });
        }
        }
    });
  }

  onChequeTabClicked(selectedTab, tabDetails) {
    this.changed = false;
    this.changedetector.detectChanges();
    this.chequeParams = {
      listdefName: selectedTab.listdefname,
      checkBoxPermission: selectedTab.severalSubmit ? true : false,
      colFilterIconEnabled: tabDetails.TabConfig[FccGlobalConstant.ZERO].colFilterIconEnabled,
      downloadIconEnabled: tabDetails.TabConfig[FccGlobalConstant.ZERO].downloadIconEnabled,
      paginator: tabDetails.TabConfig[FccGlobalConstant.ZERO].paginator,
      passBackEnabled: tabDetails.TabConfig[FccGlobalConstant.ZERO].passBackEnabled,
      showFilterSection: tabDetails.TabConfig[FccGlobalConstant.ZERO].showFilterSection,
      productCode: this.productCode,
      subProductCode: this.subProductCode,
      activeTab: {
        ...selectedTab,
        extraPdfTitle: tabDetails.tabName,
        localizationKeyPdf: selectedTab.localizationKey
      }
    };
    const metadata = 'metadata';
    const submissionAccess = 'hasSubmissionAccess';
    if (tabDetails.showFilter) {
      this.chequeParams[metadata] = tabDetails.MetaDataResponse;
      this.chequeParams[FccGlobalConstant.WILDSEARCH] = true;
      this.chequeParams.allowColumnCustomization = true;
      this.chequeParams.showFilter = tabDetails.showFilter;
      this.commentButtonList = selectedTab.buttonList;
      this.chequeParams.allowPreferenceSave = this.commonService.isnonEMptyString(tabDetails?.allowPreferenceSave)
      ? tabDetails.allowPreferenceSave : true;
      // Resetting preferences
      this.chequeParams.preferenceName = undefined;
      this.chequeParams.preferenceData = undefined;
      this.chequeParams[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = this.chequeParams[FccGlobalConstant.DOWNLOAD_ICON_ENABLED];
      this.chequeParams.multipleTabEnable = false;
      this.chequeParams[submissionAccess] = selectedTab.severalSubmit;
      this.hasSubmissionAccess = selectedTab.severalSubmit ? true : false;
      this.allAccountlistingArray.push(this.chequeParams);
      this.commonService.masterAllAccountlistingArray = this.allAccountlistingArray;
      this.commentsRequired = selectedTab.commentsRequired ? selectedTab.commentsRequired : false;
    }
    this.changed = true;
  }


  onTabClicked(tab,tabDetails) {
    this.changed = false;
    const defaultSortOrder = tab.orderType === 'd' ? -1 : 1;
    this.count = tabDetails.MetaDataResponse.ListDefDefaultProperties[0].page;
    this.paginatorParams = {
      "first":0,
      "rows":this.count,
      "sortField": tab.values,
      "sortOrder": defaultSortOrder,
      "filters":{},
      "globalFilter":null
    };
    this.changedetector.detectChanges();
    this.tabConfigHeader = tabDetails.TabConfig[FccGlobalConstant.ZERO].tabConfigHeader ?
                            tabDetails.TabConfig[FccGlobalConstant.ZERO].tabConfigHeader : '';
    this.chequeParams = {
      listdefName: tabDetails.TabConfig[FccGlobalConstant.ZERO].listdefName,
      colFilterIconEnabled: tabDetails.TabConfig[FccGlobalConstant.ZERO].colFilterIconEnabled,
      downloadIconEnabled: tabDetails.TabConfig[FccGlobalConstant.ZERO].downloadIconEnabled,
      paginator: tabDetails.TabConfig[FccGlobalConstant.ZERO].paginator,
      passBackEnabled: tabDetails.TabConfig[FccGlobalConstant.ZERO].passBackEnabled,
      showFilterSection: tabDetails.TabConfig[FccGlobalConstant.ZERO].showFilterSection,
      productCode: this.productCode,
      subProductCode: this.subProductCode,
      columnSort : true,
      paginatorParams : this.paginatorParams,
      activeTab: {
        extraPdfTitle: tabDetails.tabName
      }
    };
    this.changed = true;
  }

  onSwitchChange(i,tab,tabconfig) {
    this.count = tabconfig.MetaDataResponse.ListDefDefaultProperties[0].page;
    this.activeIndex = i;
    const defaultSortOrder = tab.orderType === 'd' ? -1 : 1;
    this.paginatorParams = {
      "first":0,
      "rows":this.count,
      "sortField": '',
      "sortOrder": defaultSortOrder,
      "filters":{},
      "globalFilter":null
    };
    // this.paginatorParams.sortField = tab.values;
    const filterParams = {
      sortColumn : "topFetch",
      sortValue : tab.values
    };
    const listdefName = tabconfig.TabConfig[FccGlobalConstant.ZERO].listdefName;
    this.listService.getTableData(listdefName, JSON.stringify(filterParams) , JSON.stringify(this.paginatorParams))
    .subscribe(result => {
      this.tabPanel.forEach(element => {
        if (element.tabName === 'TOP_BENEFICIARIES')
        {
          element.setTableData(result,'');
        }
      });
    });
  }


  handleHyperlink(hyperlinkData) {
    this.urlName = hyperlinkData.routerLink ? hyperlinkData.routerLink : '';
    if((hyperlinkData?.source).toLowerCase() === "external"){
      this.displayDialog = true;
    } else {
      this.displayDialog = false;
      this.router.navigateByUrl(this.urlName);
    }
  }

  navigateToExternalUrl() {
    window.open(this.urlName, '_blank');
    this.displayDialog = false;
  }

  close() {
    this.displayDialog = false;
  }

  navigateButtonUrl(eventUrl: any) {
    this.router.navigateByUrl(eventUrl);
    this.commonService.channelRefNo.next(null);
  }

  handleAction(actionParam) {
    const fnName = `onClickMulti${actionParam.action.substr(0, 1).toUpperCase()}${actionParam.action.substr(1)}`;
    this[fnName](actionParam);
  }

  // checks permission and atleast one row selected
toggleSubmission(): boolean {
  return this.hasSubmissionAccess && this.selectedRowsdata.length > 0 && !this.toggleRequired;
}

onSubmissionResponse(response) {
  if (response) {
    this.resetResponse();
    this.onButtonClick(this.activeIndex);
    this.displayWidget();
    // this.ngOnInit();
    this.responseMap = this.severalSubmitService.getMultiSubmitResponse();
    this.enableMultiSubmitResponse = true;
  }
}

resetResponse() {
  this.responseMap = '';
  this.comments = '';
  this.selectedRowsdata = [];
  this.enableMultiSubmitResponse = false;
  this.disableReturn = false;
  if (this.multiSubmitForm) {
    this.multiSubmitForm.controls.comments.patchValue('');
  }
}

  // Loads button item list
  getButtonDetails(outerButtons: any, bottomButtoms: any) {
    this.buttonItemList = [];
    this.bottomButtonList = [];
    if (outerButtons && outerButtons.length > 0) {
      // this.enableButtons = true;
      this.buttonItems = outerButtons;
      for (let i = 0; i < this.buttonItems.length; i++) {
        this.commonService.putButtonItems('buttonName' + i, this.translateService.instant(this.buttonItems[i].localizationKey));
        this.commonService.putButtonItems('buttonClass' + i, this.buttonItems[i].buttonClass);
        this.commonService.putButtonItems('routerLink' + i, this.buttonItems[i].routerLink);
        this.commonService.putButtonItems('listdefDialogEnable' + i, this.buttonItems[i].listdefDialogEnable);
        this.commonService.putButtonItems('dialogPopupName' + i, this.buttonItems[i].dialogPopupName);
        this.commonService.putButtonItems('listScreenOption' + i, this.buttonItems[i].listScreenOption);
        this.commonService.putButtonItems('tnxTypeCode' + i, this.buttonItems[i].tnxTypeCode);
        this.commonService.putButtonItems('mode' + i, this.buttonItems[i].mode);
        this.commonService.putButtonItems('productCode' + i, this.buttonItems[i].productCode);
        this.buttonItemList.push({
          buttonName: this.commonService.getButtonItems('buttonName' + i),
          buttonClass: this.commonService.getButtonItems('buttonClass' + i),
          routerLink: this.commonService.getButtonItems('routerLink' + i),
          listdefDialogEnable: this.commonService.getButtonItems('listdefDialogEnable' + i),
          dialogPopupName: this.commonService.getButtonItems('dialogPopupName' + i),
          listScreenOption: this.commonService.getButtonItems('listScreenOption' + i),
          tnxTypeCode: this.commonService.getButtonItems('tnxTypeCode' + i),
          mode: this.commonService.getButtonItems('mode' + i),
          productCode: this.commonService.getButtonItems('productCode' + i)
        });
      }
    }
    if (bottomButtoms) {
      bottomButtoms.forEach(element => {
        this.bottomButtonList.push(element);
      });
    } else {
      // this.enableButtons = false;
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
            const locaKeyValue = `${this.translateService.instant('repriceDateLessThanSelectedDate')}` + res.adjustedLocalizedDate;
            this.dialogService.open(ConfirmationDialogComponent, {
              header: `${this.translateService.instant('message')}`,
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
  onClickMultiApprove(actionParams) {
    if (this.selectedRowsdata.length) {
      this.enableMultiSubmitResponse = false;
      this.submissionRequest.listKeys = this.selectedRowsdata;
      // placeholder for comments, to set when implemented in backend
      this.severalSubmitService.performSeveralSubmit(this.submissionRequest, FccGlobalConstant.APPROVE);
    }
  }
  onClickMultiReturn(actionParams) {
    if (this.selectedRowsdata.length && actionParams.comment && actionParams.comment.length > 0) {
      this.enableMultiSubmitResponse = false;
      this.submissionRequest.listKeys = this.selectedRowsdata;
      this.submissionRequest.comments = actionParams.comment;
      this.severalSubmitService.performSeveralSubmit(this.submissionRequest, FccGlobalConstant.RETURN);
      this.disableReturn = false;

    } else {
    this.disableReturn = true;
    this.commonService.isCommentSectionBtnEnabled.next(true);
   }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickMultiDelete(actionParams) {
    if (this.selectedRowsdata.length) {
      const headerField = `${this.translateService.instant('deleteTransaction')}`;
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
          await this.severalSubmitService.performSeveralDelete(this.submissionRequest, FccGlobalConstant.DELETE);
          this.onChequeTabClicked(this.activeIndex, this.allTabDetails);
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickMultiCancel(actionParams) {
    if (this.selectedRowsdata.length) {
      const headerField = `${this.translateService.instant('cancelTransaction')}`;
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
          await this.severalSubmitService.performSeveralCancel(this.submissionRequest, FccGlobalConstant.CANCEL_OPTION);
          this.onChequeTabClicked(this.activeIndex, this.allTabDetails);
        }
      });
    }
  }

  getConfigDataForRollover(rowData, actionParams) {
    this.commonService.getConfiguredValues('CHECK_FACILITY_STATUS_ON_CLICK_ROLLOVER').subscribe(resp => {
      if (resp.response && resp.response === 'REST_API_SUCCESS') {
        if (resp.CHECK_FACILITY_STATUS_ON_CLICK_ROLLOVER === 'true'){
          this.listService
                .getFacilityDetail('/loan/listdef/customer/LN/getFacilityDetail',
                rowData.borrower_reference, rowData.bo_deal_id ).subscribe(facResponse => {
                  facResponse.rowDetails.forEach(facility => {
                    const filteredData = facility.index.filter(row => row.name === 'id'
                      && (this.commonService.decodeHtml(row.value) === rowData.bo_facility_id));
                    if (filteredData && filteredData.length > 0){
                      const filteredStatusData = facility.index.filter(row => row.name === 'status');
                      if (filteredStatusData[0].value === FccGlobalConstant.expired) {
                        const dir = localStorage.getItem('langDir');
                        const locaKeyValue = this.translateService.instant('rolloverErrorOnExpiredFacility');
                        const expiredFacDialog = this.dialogService.open(ConfirmationDialogComponent, {
                          header: `${this.translateService.instant('message')}`,
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

  isParamValid(param: any) {
    let isParamValid = false;
    if (param !== undefined && param !== null && param !== '') {
      isParamValid = true;
    }
    return isParamValid;
  }

  onClickView(event, valObj) {
    this.tableService.onClickViewMultiSubmit(event, valObj);
  }
}
