import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injectable,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, getCurrencySymbol } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { MessageService, OverlayPanel } from 'primeng';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { MultiSelect } from 'primeng/multiselect';
import { Table } from 'primeng/table';
import { FilterUtils } from 'primeng/utils';
import { forkJoin, Observable, Subject } from 'rxjs';
import { ShowDialogDirective } from '../../../../app/common/components/listdef-popup/show-dialog.directive';
import { ButtonItemList } from '../../../../app/common/model/ButtonItemList';

import {
  ColumnCustomizationComponent
} from '../../../common/components/column-customization/column-customization.component';
import {
  ConfirmationDialogComponent,
} from '../../../../app/corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { FccGlobalConstantService } from '../../../common/core/fcc-global-constant.service';
import { AmountMaskPipe } from '../../../common/pipes/amount-mask.pipe';
import { CurrencyAbbreviationPipe } from '../../../common/pipes/currency-abbreviation.pipe';
import { CommonService } from '../../../common/services/common.service';
import { ListDataDownloadService } from '../../../common/services/list-data-download.service';
import { DashboardService } from '../../../common/services/dashboard.service';
import { ListDefService } from '../../../common/services/listdef.service';
import { LcConstant } from '../../../corporate/trade/lc/common/model/constant';
import { UtilityService } from '../../../corporate/trade/lc/initiation/services/utility.service';
import { PaginatorParams } from '../../model/paginator-params';
import { FccConstants } from './../../../common/core/fcc-constants';
import { FccGlobalConstant } from './../../../common/core/fcc-global-constants';
import { TableService } from './../../services/table.service';
import { SubmissionRequest } from '../../../common/model/submissionRequest';
import { SeveralSubmitService } from '../../../common/services/several-submit.service';
import { PaymentTansactionPopupComponent } from '../../../../app/common/components/payment-tansaction-popup/payment-tansaction-popup.component';
import { ResolverService } from '../../../common/services/resolver.service';
import { HideShowDeleteWidgetsService } from '../../../common/services/hide-show-delete-widgets.service';
import { FCMPaymentsConstants } from '../../../../app/corporate/cash/payments/single/model/fcm-payments-constant';
import { PaymentBatchService } from '../../../../app/common/services/payment.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { AccountStatementDownloadService } from '../../../common/services/account-statement-download.service';
import { CourierTrackerComponent } from '../../../common/components/courier-tracker/courier-tracker.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { FCCFormControl, FCCFormGroup } from '../../model/fcc-control.model';
import { FormAccordionPanelService } from '../../../common/services/form-accordion-panel.service';
import { TabPanelService } from '../../../common/services/tab-panel.service';
import { PdfGeneratorService } from '../../../common/services/pdf-generator.service';
import { FormModelService } from '../../../common/services/form-model.service';
import { TransactionDetailService } from '../../../common/services/transactionDetail.service';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { ProductMappingService } from '../../../common/services/productMapping.service';
import { LocalStorage } from '@ng-idle/core';
import { FccGlobalConfiguration } from '../../../common/core/fcc-global-configuration';

@Component({
  selector: 'fcc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [],
  animations: [
    trigger('rowExpansionTrigger', [
      state(
        'void',
        style({
          transform: 'translateX(-10%)',
          opacity: 0
        })
      ),
      state(
        'active',
        style({
          transform: 'translateX(0)',
          opacity: 1
        })
      ),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
@Injectable({
  providedIn: 'root'
})
export class TableComponent implements OnInit, OnChanges, AfterContentChecked {
  checkCustomise: boolean;
  viewFullTable: boolean;
  constructor(protected translate: TranslateService,
    public commonService: CommonService, protected router: Router,
    protected messageService: MessageService,
    protected dialogService: DialogService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected currencyAbbreviation: CurrencyAbbreviationPipe,
    protected listDataDownloadService: ListDataDownloadService,
    protected dashboardService: DashboardService,
    protected accounStatementDownloadService: AccountStatementDownloadService,
    protected changedetector: ChangeDetectorRef,
    protected activatedRoute: ActivatedRoute,
    protected amountMask: AmountMaskPipe,
    protected listService: ListDefService,
    protected tableService: TableService,
    protected utilityService: UtilityService,
    protected el: ElementRef,
    protected zone: NgZone,
    protected renderer: Renderer2,
    protected http: HttpClient,
    public dialog: MatDialog,
    protected severalSubmitService: SeveralSubmitService,
    protected translateService: TranslateService, protected resolverService: ResolverService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected datePipe: DatePipe,
    protected paymentService: PaymentBatchService,
    protected formAccordionPanelService: FormAccordionPanelService,
    protected tabPanelService: TabPanelService,
    protected pdfGeneratorService: PdfGeneratorService,
    protected formModelService: FormModelService,
    protected transactionDetailService: TransactionDetailService,
    protected productMappingService: ProductMappingService,
    protected formControlService: FormControlService
    ) {

    this.showColumnFilterSec = false;
    this.columnFilter = {};
  }
  toggleRequired = this.commonService.defaultLicenseFilter !== undefined ? this.commonService.defaultLicenseFilter :
    this.commonService.toggleLicenseFilter;
  actionsDisable = this.commonService.actionsDisable;
  checkBoxRequired = this.commonService.licenseCheckBoxRequired;
  radioButtonHeaderRequired = this.commonService.radioButtonHeaderRequired;
  permission: any;
  deleterowObject: any[] = [];
  deleterowstatus = false;
  columns: any[] = [];
  actionData: any[] = [];
  rowDataActionList: any[] =[];
  selectedCol: any[] = [];
  selectionColumns: any;
  data: any[];
  items: any;
  expandComponent: string;
  paginator: any;
  rows: any;
  values: any[] = [];
  responsive: any;
  dataKey: any;
  rowexpansion: any;
  filterplaceholder: any;
  globalsearch: any;
  globalSort: any;
  columnSort: any;
  selectMode: any;
  selectedRow: any;
  exportlabel: any;
  tableName: any;
  multiSelectColumnLabel: any;
  loading: boolean;
  isLazyEnabled: boolean;
  totalRecords: number;
  sortField: string;
  sortOrder: number;
  columnActions: boolean;
  wildsearch: boolean;
  actionconfig: boolean;
  alignPagination: any;
  rowExpansionData: any[] = [];
  item: any[] = [];
  buttonItemList: ButtonItemList[] = [];
  threeDotButtonsList: any[] = [];
  defaultLabel = this.translate.instant('select');
  listDownload = this.translate.instant('listDownload');
  batchDownload = this.translate.instant('batchDownload');
  csvDownload = this.translate.instant('csvDownload');
  public inputElement: ElementRef;
  columnFilter: {};
  showColumnFilterSec: boolean;
  fileName: string;
  ariaLabelSort = this.translate.instant('ariaLabelSort');
  ariaLabelDescSort = this.translate.instant('ariaLabelDescSort');
  ariaLabelAscSort = this.translate.instant('ariaLabelAscSort');
  noTopBeneString: string;
  passbackParameters: any;
  passBackEnabled: boolean;
  selectionEnabled: boolean;
  listdefActionIconsDisplay: boolean;
  downloadIconEnabled: boolean;
  colFilterIconEnabled: boolean;
  enhancedUXTable: boolean;
  displayDashboard: boolean;
  configForButton: any;
  showButtons: boolean;
  displayDialog = false;
  displayInputSwitch: any;
  externalUrlLink: any;
  isDashboardWidget = false;
  enableListDataDownload: boolean;
  allowedDownloadOptions: any;
  selectedDownloadOption: any;
  allowedSubOptionsDownload = [FccConstants.CURRENT_DOWNLOAD, FccConstants.FULL_DOWNLOAD];
  maxColumnForPDFModePortrait: any;
  dateFormatForExcelDownload: any;
  listDataDownloadLimit: any;
  accountStatementDownloadLimit: any;
  listDataDownloadWidgetDetails: any;
  hideActionsShowCheckBox = false;
  showRemoveChips = false;
  favAccountList: any;
  isFavAccount = false;
  disableHeaderCheckbox = false;
  enableRowSelectForWidget = false;
  checkBoxAction = false;
  favRow = false;
  enterOnThreeDots: boolean = false;
  filterChipsRequired: boolean;
  displayLength = FccGlobalConstant.CHARACTER_LENGTH_DISPLAY;
  updateColumnCustomizationMap = new Map();
  enableCustomizeColWithoutPref: boolean;
  totalFavBeneLimit: any;
  totalFavBeneCount: any;
  favIconPermission: boolean = false;
  isBeneApprovalWidgetMaker = false;
  currencySymbolDisplayEnabled: boolean;
  approvalByTransaction: boolean = false;
  actionParam:any;
  subActions: string[]=[];
  isDownloadAction: boolean= false;
  showSubMenu: boolean = true;
  lcProductAmount = ['lc_liab_amt', 'li_liab_amt', 'bg_liab_amt',
    'fin_liab_amt', 'sg_liab_amt', 'ec_outstanding_amt', 'ic_outstanding_amt'];
  isBillReferenceEnabled: boolean;
  currentActiveTab: any;
  showColumnsWithCurrency = ['EQUIVALENT_OPENING_BALANCE', 'EQUIVALENT_PRINCIPAL_AMOUNT', 'EQUIVALENT_AVAILABLE_BALANCE',
    'EQUIVALENT_AMOUNT', 'EQUIVALENT_MATURITY_AMOUNT', 'EQUIVALENT_CURRENT_AMOUNT'];
  checkboxData: any[] = [];
  modelJson: any;
  transactionId;
  referenceId;
  subProductCode: any;
  tnxTypeCode: any;
  operation: any;
  eventTnxStatCode: any;
  pdfData: Map<string, FCCFormGroup>;
  batchPdfData: Map<string, FCCFormGroup>;
  sectionNames: string[];
  accordionSectionsList: string[] = [];
  tabSectionControlMap: Map<string, Map<string, FCCFormControl>>;
  transactionInformation: any[] = [];
  eventTypeCode: string;
  subTnxTypeCode: string;
  protected sectionList: string[] = [];
  protected stateData: FCCFormGroup;
  protected STATE_TYPE = "stateType";
  protected stateType: string;
  refid : any;
  subTnx: any;
  mode: any;
  tnxType: any;
  optionnow: any;
  batchDetailsFormModel: any;
  batchDetailsApiMappingModel: any;
  private _batchDetailsJsonChanges = new Subject<any>();
  public batchDetailsJsonChanges = this._batchDetailsJsonChanges.asObservable();
  batchDetailsStateData: FCCFormGroup;
  downloadBatchIconEnabled: boolean;
  @Input()
  compService: any = [];
  @Input()
  filterChips: any = [];
  @Output()
  childDeleteEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  childDeleteAllEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  lazyEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  download: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  refreshList: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  widgetRefreshList: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  refreshTableData: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  rowSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  rowUnSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  resetTableFilters: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  switchListDef: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectAllCheckboxEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewMoreClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() viewAllClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('menu') public menu: MenuModule;
  @ViewChild('tt') public ptable: Table;
  @ViewChildren('filter') public filter: QueryList<MultiSelect>;
  @ViewChild(MultiSelect) public filterObj: MultiSelect;
  @ViewChild('wildsearchid') public wildsearchid: ElementRef;
  @ViewChildren('title') public title: QueryList<ElementRef>;
  @Input() inputParams: any;
  isViewMore = false;
  isViewAllClicked = false;
  downloadFileName = this.translate.instant('download');
  filterChipsList: any = [];
  rppOptions: any;
  dir: string = localStorage.getItem('langDir');
  rowExp;
  contextPath: string;
  modeValue;
  option;
  index;
  selectedRows: any[];
  deleteSuccessMessage = `${this.translate.instant('deleteSuccessMessage')}`;
  productCode;
  lcConstant = new LcConstant();
  allowColumnCustomization: boolean;
  frozenColMaxLimit: any;
  currentFrozenColLimit = 0;
  isFrozenColMaxLimitReached = false;
  isSelectColMinLimitReached = false;
  @ViewChild('op') colOverlayPanel: OverlayPanel;
  isSelectAll = true;
  columnList: any[];
  listdefLastFreezedColumnIndex;
  overlayLastFreezedColumnIndex;
  scrollable = false;
  hasFilterableColumn: boolean;
  staticTextSelectObj: any = {};
  staticTextFrozenObj: any = {};
  selectValidationmessage: any;
  freezeValidationmessage: any;
  standardTable = false;
  displayPopupRow: boolean;
  clearAll;
  @ViewChild('op') public columnCustomizationPanel: OverlayPanel;
  @ViewChild('actionPanel') public actionPanel: OverlayPanel;
  @ViewChildren('action') public action: QueryList<ElementRef>;
  displayUserAuditDialog = false;
  userAuditDialogObj: any = {};
  tnxId: any;
  filterIconEnabled: any;
  currRowindex: any;
  maskEnable = true;
  @Input() enableMasking = false;
  currentActionIndex: any;
  preferenceSelected = true;
  isDisplayTotalBalance = false;
  showAccountType = false;
  displayAccountType: any;
  @Input() viewInCurrency: any;
  @Input() displayTotalAmtBalance: any;
  @Input() defaultDaysCount: string;

  widgetCode = '';
  adjustActionWidth = false;
  commaSeparatedColumnList = [FccGlobalConstant.ACCOUNT_ENTITY, FccGlobalConstant.ENTITYCOL
    , FccGlobalConstant.BENE_ACCOUNT_TNX, FccGlobalConstant.BENE_ACCOUNT_MASTER];
  inAndContains = 'inAndContains';
  originalValue = 'originalValue';
  filteredRowData: any;
  sampleComment = FccGlobalConstant.SAMPLE_COMMENT;
  remarks = '';
  showPopup: boolean;
  actionPopup: boolean;
  @Output() advancedFilterEvent: EventEmitter<any> = new EventEmitter();
  enableFilterPopup = false;
  @ViewChild('ptt') public parentDivOfPtable: ElementRef;
  offSetMarginForScroll = 999;
  parrentDivHeight = -1;
  tableHeight = -1;
  hideExtraSpace = false;
  changed = false;

  dataTemp: any;
  routeOption: string;
  @Output()
  updateColumns: EventEmitter<any> = new EventEmitter<any>();
  currentState: LazyLoadEvent = {};
  paginatorParams = PaginatorParams.paginatorParams;
  showPaginator: boolean = false;
  bankName: any;
  enableColCustomizationPopup: boolean = false;
  favBeneListDefName = 'core/listdef/customer/MC/favoriteBeneficiariesList';
  topBeneListDefName = 'core/listdef/customer/MC/topBeneficiariesList';
  accountStatementExternal = FccConstants.ACCOUNT_STATEMENT_EXTERNAL_LISTDEF;
  accountStatementListDefName = FccConstants.ACCOUNT_STATEMENT_LISTDEF;
  submissionRequest: SubmissionRequest = {};
  topBeneText;
  showTableBelowMessage = false;
  dialogRef: any;
  isDisabled = false;
  globalFilterColList: any;
  fileConfigData = null;
  fileConfigDataForDownload = null;
  courierReferenceListObj: any[] = [];
  waybillRefId: any[] = [];
  searchBoxLength: any;
  courierApplicableProductCode: string[] = [FccGlobalConstant.PRODUCT_EC, FccGlobalConstant.PRODUCT_EL,
    FccGlobalConstant.PRODUCT_LC, FccGlobalConstant.PRODUCT_SI, FccGlobalConstant.PRODUCT_SR, FccGlobalConstant.PRODUCT_IC,
    FccGlobalConstant.PRODUCT_BG, FccGlobalConstant.PRODUCT_BR];
    @ViewChild('checkboxRef', {static: false}) checkboxRef: { focus: () => any; };
  fullListDataDownload = "full";
  isListingScreen: boolean = false;
  listingScreenName;
  viewAllInfoFlag: any = false;
  checkHeader = true;
  optionEmptyLink: any;

  ngOnInit() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.searchBoxLength = response.nameTradeLength;
    });
    this.maskEnable = this.enableMasking;
    this.activatedRoute.queryParams.subscribe((data) => {
      this.routeOption = data.option;
      this.subProductCode = data.subProductCode;
    });
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.filterIconEnabled = response.showListdefSearch;
        this.listdefActionIconsDisplay = response.listdefActionIconsDisplay;
      }
    });
    this.commonService.getBankDetails().subscribe((bankRes) => {
      this.bankName = bankRes.shortName;
      this.commonService.getParameterConfiguredValues(
        this.bankName,
        FccGlobalConstant.PARAMETER_P714
      ).subscribe((responseData) => {
        if (this.commonService.isNonEmptyValue(responseData) && responseData?.paramDataList) {
          if (responseData?.paramDataList[0]?.data_1 === FccGlobalConstant.CODE_Y) {
            this.enableColCustomizationPopup = true;
          } else {
            this.enableColCustomizationPopup = false;
          }
        }
      });
    });
    if (this.inputParams && this.commonService.isnonEMptyString(this.inputParams.isViewMore)) {
      this.isViewMore = this.inputParams.isViewMore === 'true' ? true : false;
    }
    if (this.inputParams && this.commonService.isnonEMptyString(this.inputParams.showFilter) &&
      this.commonService.isnonEMptyString(this.inputParams.accountType)) {
      this.showAccountType = this.inputParams.showFilter === true ? true : false;
      if (this.inputParams.externalAccount === true) {
        this.displayAccountType = this.translate.instant(FccConstants.EXTERNAL_ACCOUNTS);
      } else {
        this.displayAccountType = this.translate.instant('N068_' + this.inputParams.accountType);
      }
    }
    if (this.inputParams && this.commonService.isnonEMptyString(this.inputParams.displayTotalBalance)) {
      this.isDisplayTotalBalance = this.inputParams.displayTotalBalance === true ? true : false;
    }
    this.clearAll = this.translate.instant('clearall');
    this.contextPath = this.commonService.getContextPath();
    this.modeValue = this.router.url.split('&');
    if(this.inputParams !== undefined && this.inputParams.showWidgetOverlay !== undefined) {
      this.displayPopupRow = this.inputParams.showWidgetOverlay;
    }
    this.isDashboardWidget = this.commonService.dashboardWidget;
    if(this.isDashboardWidget && this.inputParams)
    {
      if(this.inputParams['colFilterIconEnabled'] === undefined)
      {
        this.filterIconEnabled = false;
      }
      else
      {
        this.filterIconEnabled = this.inputParams['colFilterIconEnabled'];
      }
    }
    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P809).subscribe(
      (response) => {
        if (this.commonService.isNonEmptyValue(response) &&
        this.commonService.isNonEmptyValue(response.paramDataList) && response.paramDataList.length > 0) {
          this.currencySymbolDisplayEnabled = response.paramDataList[0][FccGlobalConstant.DATA_1] === 'y';
        }
      });
    this.getEditModeUrl();
    this.favIconPermission = this.commonService.getUserPermissionFlag(FccGlobalConstant.FAV_BENE_ICON_PERMISSION);
    if (this.favIconPermission && (this.inputParams.listdefName === FccGlobalConstant.FCM_BENE_APPROVED_LISTDEF
      || this.inputParams.listdefName === FccGlobalConstant.FCM_BENE_All_LISTDEF)) {
      this.getTotalFavBeneCount();
    }
    if(this.inputParams && this.inputParams.listdefName == FccGlobalConstant.FCM_PAYMENT_DETAILS_LISTDEF){
      this.updateCheckboxFlagForBatch();
    }
    this.isBeneApprovalWidgetMaker = this.commonService.getUserPermissionFlag(FccGlobalConstant.BENE_APPROVAL_WIDGET_PERMISSION);
    if (this.isBeneApprovalWidgetMaker && this.inputParams.listdefName === FccGlobalConstant.FCM_BENE_APPROVED_LISTDEF_WIDGET) {
      this.updateLinksForNoRecord();
    }
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.option === FccGlobalConstant.PENDING_APPROVAL) {
        this.disableHeaderCheckbox = false;
      }
    });

    if (this.inputParams?.isDashboardWidget && (this.commonService.isNonEmptyValue(this.inputParams.checkBoxPermission)
     && this.inputParams.checkBoxPermission == true) &&
      this.inputParams.widgetName === FccGlobalConstant.PENDING_APPROVAL) {
      this.enableRowSelectForWidget = true;
    }

    /* Creating a custom filter to check whether the value exists in and contains it(comma-separated scenario)
       Eg - Filter values applied on account feild are ACC01, ACC03
            Record 1 contains accounts ACC01, ACC02
            Record 2 contains account ACC03
            Record 3 contains account ACC04

            It will result in filtering out first two records i.e. Record 1 and Record 2 as the filter value
            ACC03 exists 'IN' this list i.e. Record2 and filter value ACC01 exists 'IN' this list and Record 1
            'CONTAINS' it as one the accounts
    */
    FilterUtils[this.inAndContains] = (value, filter, filterLocale): boolean => {
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      for (let i = 0; i < filter.length; i++) {
        if (FilterUtils.contains(value, filter[i], filterLocale)) {
          return true;
        }
      }
      return false;
    };
    this.getRows();
    this.getrppOptions();
    this.showPaginator = this.inputParams.showPaginator ? this.inputParams.showPaginator : true;
    this.commonService.refreshPaymentList.subscribe((val) => {
      if (val) {
        this.refreshList.emit();
        this.commonService.refreshPaymentList.next(false);
      }
    });

    this.commonService.refreshPendingApprovalWidgetList.subscribe((val) => {
      if (val) {
        this.widgetRefreshList.emit(FccGlobalConstant.PENDING_APPROVAL_WIDGET_LISTDEF);
        this.commonService.refreshPendingApprovalWidgetList.next(false);
      }
    });

    this.commonService.enableBatchModificationActions.subscribe((val) => {
      if (val) {
        this.actionsDisable = false;
        this.commonService.enableBatchModificationActions.next(false);
      }
    });
    this.commonService.refreshListBehaviourSubject.subscribe((val) => {
      if (val) {
        this.refreshList.emit();
        this.commonService.refreshListBehaviourSubject.next(false);
      }
    });
    this.commonService.getCourierTrackingFeatureEnabled();
    if (this.commonService.isCourierTrackingFeatureEnabled){
      this.showWaybillForRowData();
    }
    if ((this.productCode === FccGlobalConstant.PRODUCT_LC || this.productCode === FccGlobalConstant.PRODUCT_SI ||
      this.productCode === FccGlobalConstant.PRODUCT_BG) && (this.currentActiveTab === 'uaPendingActions' || this.currentActiveTab === 'uiactions' )){
        this.downloadBatchIconEnabled = true;
    }else{
      this.downloadBatchIconEnabled = false;
    }

    this.batchDetailsJsonChanges.subscribe(response => {
      if(response && response.val){
        const tnxCheckboxData = this.checkboxData.map(({tnx_id}) => tnx_id);
        tnxCheckboxData.forEach(tnx => {
          let batchForm = this.populateBatchPDFData(this.batchDetailsApiMappingModel, response.val[tnx], this.batchDetailsFormModel);
          this.batchPdfData.set(tnx, batchForm);
        });
        this.pdfGeneratorService.generateBatchPdf(this.batchPdfData, this.sectionNames, this.productCode, this.subProductCode);
      }
    });
    this.tableService.refreshList.subscribe(data=>{
      if(data) {
        this.refreshList.emit();
      }
    })

    if(this.router.url) {
      let routeURl = this.router.url.split('?')[0];
      if(routeURl === '/productListing' || routeURl === '/statusListing') {
        this.isListingScreen = true;
        this.listingScreenName = routeURl;
      }
    }
    this.commonService.isLoading.subscribe(res=>{
      res ? this.startLoadingSpinner() : this.stopLoadingSpinner();
    })
  }

  ngAfterViewChecked(): void {
    this.handleScrollForRtl();
    const rowDataElement = document.querySelectorAll('.rowDataStyle');
    if(rowDataElement && !this.checkCustomise){
      rowDataElement.forEach(element => {
        element.setAttribute('tabIndex', '0');
      })
    }
  }

  ngAfterContentChecked(): void {
    if(document.querySelector('.header-div') && this.checkHeader && document.querySelector('.ui-table-scrollable-body')) {
      this.checkHeader = false;
      this.tableService.tableRendered.next(true);
    }
    if(document.querySelector('.checkboxWidth')){
      const checkBoxWidth: HTMLElement = document.querySelector('.checkboxWidth');
      checkBoxWidth.style.width = FccGlobalConstant.CHECK_BOX_WIDTH+'em';
    }
  }

  getApprovalByTransaction(rowData) {
   if (this.activatedRoute.snapshot.data[FccGlobalConstant.TITLE] === FccGlobalConstant.VIEW_CHEQUE_STATUS
        && this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION) !== FCMPaymentsConstants.MODIFY_BATCH) {
        if (this.resolverService.approvalByTransaction && this.commonService.buttonList.length > 0) {
          this.approvalByTransaction = true;
          return true;
        } else {
          this.approvalByTransaction = false;
          return false;
        }
      }


    return this.approvalByTransaction;
  }
  getColumns() {
    this.loadConfiguration();
    this.inputParams.subProductCode = this.activatedRoute.snapshot.queryParams[FccGlobalConstant.SUB_PRODUCT_CODE];
    this.inputParams.subProductCode = (this.inputParams.subProductCode !== undefined && this.inputParams.subProductCode !== null) ? this.inputParams.subProductCode : '';
    this.inputParams.option = this.activatedRoute.snapshot.queryParams[FccGlobalConstant.OPTION];
    this.inputParams.option = (this.inputParams.option !== undefined && this.inputParams.option !== null) ? this.inputParams.option : '';
    if (this.activatedRoute.snapshot.queryParams[FccGlobalConstant.WIDGET_CODE] !== undefined) {
      this.inputParams.widgetName = this.activatedRoute.snapshot.queryParams[FccGlobalConstant.WIDGET_CODE];
    }
    this.inputParams.widgetName = (this.inputParams.widgetName !== undefined && this.inputParams.widgetName !== null) ? this.inputParams.widgetName : '';
    this.inputParams.productCode = this.activatedRoute.snapshot.queryParams[FccGlobalConstant.PRODUCT];
    this.inputParams.productCode = (this.inputParams.productCode !== undefined && this.inputParams.productCode !== null) ? this.inputParams.productCode : '';

    const selectedTabName = (this.inputParams.activeTab !== undefined && this.inputParams.activeTab !== null) ? this.inputParams.activeTab.localizationKey : '';
    this.currentActiveTab = selectedTabName;
    if (!this.enableCustomizeColWithoutPref) {
      if (this.inputParams?.preferenceData?.columns && this.inputParams.preferenceData.columns.length) {
        this.columns = this.inputParams.preferenceData.columns;
        this.columns.forEach(colPref => {
          this.compService.columns.forEach(col => {
            if (colPref.localizationkey && col.localizationkey && colPref.localizationkey === col.localizationkey) {
              colPref.header = col.header;
            }
          });
        });
      } else {
        this.columns = this.compService.columns;
      }
      this.updateColumnDetails();
    } else {
      this.listService.getColumnCustomizationData(this.inputParams.listdefName, this.inputParams.productCode,
        this.inputParams.subProductCode, this.inputParams.widgetName, this.inputParams.option, selectedTabName).subscribe(result => {
          if (result && this.inputParams.listdefName) {
            if (result.body.columnValues != null) {
              this.updateColumnCustomizationMap.set(this.inputParams.listdefName, true);
              if(this.columns == null || this.columns == undefined || this.columns.length == 0)
              this.columns = JSON.parse(result.body.columnValues).columnData;
              // this code is added to decode column header from columncustomization response where header is encoded.
              this.columns.forEach(colVal => {
                colVal.header = decodeURIComponent(colVal.header);
              });
              this.columns.forEach(colPref => {
                if ( this.compService.columns &&  this.compService.columns.length > 0){
                  this.compService.columns.forEach(col => {
                    if (colPref.localizationkey && col.localizationkey && colPref.localizationkey === col.localizationkey) {
                      colPref.header = col.header;
                    }
                  });
                }
              });
            } else {
              this.columns = this.compService.columns;
            }
            this.updateColumnDetails();
          } else if (this.inputParams.listdefName){
            this.updateColumnCustomizationMap.set(this.inputParams.listdefName, false);
            this.updateColumnDetails();
          }
          else {
              if (result && result.body.columnValues != null) {
                this.columns = JSON.parse(result.body.columnValues).columnData;
                this.columns.forEach(colPref => {
                  if (this.compService.columns && this.compService.columns.length > 0) {
                    this.compService.columns.forEach(col => {
                      if (colPref.localizationkey && col.localizationkey && colPref.localizationkey === col.localizationkey) {
                        colPref.header = col.header;
                        if (this.inputParams && this.inputParams.dashboardTypeValue === 'TRADE'
                                  && this.inputParams.widgetName === 'pendingTrade') {
                          colPref.showAsDefault = col.showAsDefault;
                        }
                      }
                    });
                  }
                });
              } else {
               this.columns = this.compService.columns;
              }
              this.data = this.compService.values;
          }
        });
    }
  }

  checkBillReferenceEnabled(){
    if( this.columns && ( this.inputParams.productCode === FccGlobalConstant.PRODUCT_LC || this.inputParams.productCode === FccGlobalConstant.PRODUCT_SI
      || this.inputParams.productCode === FccGlobalConstant.PRODUCT_BG )
      && ( this.currentActiveTab === 'uaPendingActions' || this.currentActiveTab === 'uiactions' ) && this.isBillReferenceEnabled === false){
       this.columns = this.columns?.filter(el => ( el.field !== FccGlobalConstant.IMP_BILL_REFERENCE_ID ));
  }
   this.commonService.isBillReferenceEnabled.next({
    'productCode': this.inputParams.productCode,
     'activeTab' : this.currentActiveTab,
    'isBillReferenceEnabled':this.isBillReferenceEnabled
  });
  }

  updateColumnDetails() {
    this.checkBillReferenceEnabled();
    this.selectionColumns = this.columns;
    this.setLastFreezedColumnIndex();
    this.hasFilterableColumn = this.enableColumnFilterIcon();
    this.setScrollable();
    if (this.commonService.isnonEMptyString(this.columns)) {
      this.commonService.tableColumnHeaders = this.columns;
      if (this.inputParams && this.inputParams?.widgetName &&
        this.inputParams?.widgetName.toLowerCase().indexOf('accountsummary') > -1) {
        this.commonService.accountSummaryWidgetsColumnDetailsMap.set(this.inputParams.widgetName, this.columns);
      }
    }

    if (this.columns && this.columns.length) {
      this.columns = this.columns.map((item) => {
        return {
          ...item,
          selected: [],
          title: this.translate.instant('select')
        }
      })
    }
  }
  getValues() {
    this.dataTemp = this.compService.values;
    this.data = this.compService.values;
    if (!this.adjustActionWidth && this.compService.values && this.compService.values.length) {
      this.compService.values.forEach(value => {
        if (!this.adjustActionWidth && value.action && value.action.split(',').length > FccGlobalConstant.LENGTH_3) {
          this.adjustActionWidth = true;
          if (value.action.includes('actionName')) {
            this.adjustActionWidth = false;
          }
        }
      });
    }
  }

  getPaginator() {
    this.paginator = this.compService.paginator;
  }

  getRows() {
    this.rows = this.compService.rows;
    this.paginatorParams.defaultRows = this.compService.rows;
  }

  getIsLazyEnabled() {
    this.isLazyEnabled = this.compService.lazy;
  }

  getTotalRecords() {
    this.totalRecords = this.compService.totalRecords;
    this.showTableBelowMessage = false;
    if (this.inputParams.tabName === 'FAVORITE_BENEFICIARIES') {
      this.commonService.setTotalBeneFavCount(this.totalRecords);
    }
    if (this.inputParams.tabName === 'TOP_BENEFICIARIES') {
      if(this.totalRecords > 0){
        this.showTableBelowMessage = true;
      }
    }
  }

  getSortField() {
    this.sortField = this.compService.sortfield;
  }

  getSortOrder() {
    this.sortOrder = this.compService.sortOrder;
  }

  getResponsive() {
    this.responsive = this.compService.responsive;
  }
  getDataKey() {
    this.dataKey = this.compService.datakey;
  }

  getRowexpansion() {
    this.rowexpansion = this.compService.rowexpansion;
  }

  getExpandRowData() {
    this.rowExpansionData = this.compService.expandRowCols;
  }

  getColumnActions() {
    this.columnActions = this.compService.columnActions;
  }

  getWildSearch() {
    this.wildsearch = this.compService.wildsearch;
  }

  getactionconfig() {
    this.actionconfig = this.compService.actionconfig;
    if (this.inputParams.listdefName === FccGlobalConstant.ACCOUNT_STATEMENT_LISTDEF) {
      this.actionconfig = true;
    }
  }

  getalignPagination() {
    this.alignPagination = this.compService.alignPagination;
  }

  getColumnsort() {
    this.columnSort = this.compService.columnSort;
  }

  getFileName() {
    this.fileName = this.compService.fileName !== '' ? this.compService.fileName : this.downloadFileName;
  }

  getrppOptions() {
    this.rppOptions = this.compService.rppOptions;
    this.paginatorParams.rppOptions = this.compService.rppOptions;
  }

  getSelectMode() {
    this.selectMode = this.compService.selectMode;
  }

  getSelectedRow() {
    this.selectedRow = this.compService.selectedRow;
  }

  getPassbackParameters() {
    this.passbackParameters = this.compService.passbackParameters;
  }

  getPassBackEnabled() {
    this.passBackEnabled = this.compService.passBackEnabled;
  }

  getSelectionEnabled() {
    this.selectionEnabled = this.compService.selectionEnabled;
  }

  getDownloadIconEnabled() {
    this.downloadIconEnabled = this.compService.downloadIconEnabled;
  }

  getColFilterIconEnabled() {
    this.colFilterIconEnabled = this.commonService.isEmptyValue(this.inputParams?.dashboardTypeValue) ?
      this.filterIconEnabled : this.compService.colFilterIconEnabled;
  }

  getEnhancedUXTable() {
    this.enhancedUXTable = this.compService.enhancedUXTable;
  }

  getFilterChipsRequired() {
    this.filterChipsRequired = this.compService.filterChipsRequired;
  }

  getDisplayDashboard() {
    this.displayDashboard = this.compService.displayDashboard;
    this.setActionColumn();
  }

  getShowButtons() {
    this.showButtons = this.compService.showButton;
    if (this.showButtons) {
      this.buttonItemList = [];
      this.configForButton = 2;
      this.configForButton = parseInt(this.compService.listDataDownloadWidgetDetails.showNoOfButtons);
      this.getButtonsForWidget(this.compService.values)
    }
  }

  getActionData() {
    this.actionPopup = this.commonService.getActionPopup();
    if (this.data && this.data.length && this.actionconfig) {
      this.data.forEach(element => {
        if (!this.commonService.isEmptyValue(element.action)){
          this.rowDataActionList.push(JSON.parse(element.action));
          this.actionData = JSON.parse(element.action);
        } else {
          this.rowDataActionList.push(element.action);
          this.actionData = [];
        }
      });
    }
  }

  getSelectedRows() {
    this.selectedRows = this.compService.selectedRows;
  }

  getcheckBoxPermission() {
    let operation;
    this.activatedRoute.queryParams.subscribe(params => {
      operation = params[FccGlobalConstant.OPERATION];
    });
    if((this.productCode === FccGlobalConstant.PRODUCT_LC || this.productCode === FccGlobalConstant.PRODUCT_SI ||
      this.productCode === FccGlobalConstant.PRODUCT_BG) && (this.currentActiveTab === 'uaPendingActions' || this.currentActiveTab === 'uiactions' )){
        this.permission = true;
    } else if((operation === FccConstants.VIEW_AUTH || operation === FccConstants.VIEW_SEND) && !this.isDisabled){
      this.permission = true;
    }
    else{
        this.permission = this.compService.checkBoxPermission ? this.compService.checkBoxPermission : false;
    }
  }

  getDashboardWidgetDetails() {
    this.standardTable = false;
    this.isDashboardWidget = this.commonService.isnonEMptyString(this.compService.listDataDownloadWidgetDetails) ?
      this.compService.listDataDownloadWidgetDetails.isDashboardWidget : false;
    this.enableListDataDownload = this.commonService.isnonEMptyString(this.compService.listDataDownloadWidgetDetails) ?
      this.compService.listDataDownloadWidgetDetails.enableListDataDownload : false;
    this.listDataDownloadWidgetDetails = this.compService.listDataDownloadWidgetDetails;
    if (this.listDataDownloadWidgetDetails && this.listDataDownloadWidgetDetails.showWidgetOverlay) {
      this.standardTable = this.listDataDownloadWidgetDetails.showWidgetOverlay;
    }
    this.showPopup = this.commonService.isNonEmptyValue(this.commonService.getShowPopup()) ? this.commonService.getShowPopup() : this.inputParams?.showPopup;
    this.actionPopup = this.commonService.getShowPopup() || this.commonService.getActionPopup();
    if (this.showPopup || this.actionPopup) {
      this.standardTable = this.commonService.getShowPopup() || this.commonService.getActionPopup();
    }
    if (this.listDataDownloadWidgetDetails
      && this.commonService.isnonEMptyString(this.listDataDownloadWidgetDetails.dashboardType)
      && this.commonService.isnonEMptyString(this.compService.fileName)) {
      this.listDataDownloadWidgetDetails.exportFileName = this.compService.fileName;
    }
    if(this.listDataDownloadWidgetDetails){
      this.getFileNameConfigData(this.listDataDownloadWidgetDetails);
    }
    if (this.listDataDownloadWidgetDetails && this.listDataDownloadWidgetDetails?.productCode === FccGlobalConstant.ACCOUNT_STATEMENT_PRODUCT_CODE) {
      this.showSubMenu = false;
      this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P851, FccGlobalConstant.ACCOUNT_STATEMENT_PRODUCT_CODE, null).subscribe(
        (response) => {
          if (this.commonService.isNonEmptyValue(response) &&
            this.commonService.isNonEmptyValue(response.paramDataList) && response.paramDataList[0] &&
            response.paramDataList[0][FccGlobalConstant.DATA_1]) {
            this.allowedDownloadOptions = response.paramDataList[0][FccGlobalConstant.DATA_1].split(',');
          }
        }
      );
    }
  }
  getDisplayInputSwitch() {
    this.displayInputSwitch = this.compService.displayInputSwitch;
  }

  getIsSortableColumnDisabled(columnSort, isColumnSortDisabled, colField) {
    let colSortDisabled = false;
    if (!columnSort || isColumnSortDisabled || colField === FccGlobalConstant.ACTION) {
      colSortDisabled = true;
    }
    return colSortDisabled;
  }

  setCurrentActionIndex(index) {
    this.currentActionIndex = index;
  }

  getButtonsForWidget(data: any) {
    let actionNamesList = '';
    if (data !== null || data !== undefined || data.length) {
      const actionJson = JSON.parse(data[0]?.action);
      if (actionJson.length > 0) {
        actionJson.forEach(element => {
          if (!this.buttonItemList.includes(element.actionName)) {
            this.buttonItemList.push({
              buttonName: element.actionName,
              buttonClass: element.buttonClass,
              hideTooltip: element.hideTooltip ? element.hideTooltip : "",
              routerLink: "",
              listdefDialogEnable: "",
              dialogPopupName: "",
              listScreenOption: "",
              tnxTypeCode: "",
              mode: "",
              productCode: "",
              productProcessor: "",
              urlKey: ""
            });
          }
        });
      }
    }
  }
  getActionDetails(event: Event, data: any, shouldSplit: boolean, index) {
    this.setFocusOnThreeDots(index);
    this.item = [];
    let actionNames = null;
    let actionNamesList = '';
    if (shouldSplit) {
      actionNames = data.action.split(',').slice(FccGlobalConstant.LENGTH_3);
    } else {
      const actionJson = JSON.parse(data.action);
      if (actionJson.length > 0) {
        actionJson.forEach(element => {
          actionNamesList = actionNamesList.concat(element.actionName).concat(',');
        });
      }
      actionNames = actionNamesList.substring(0, actionNamesList.length - 1);
      actionNames = actionNames.split(',');
      actionNames.forEach(element => {
        if (element) {
          this.item.push({
            label: this.translate.instant(element),
            command: () => this.onClickAction(event, data, element)
          });
        }
      });
    }
  }

  getButtonDetails(event: Event, data: any) {
    this.threeDotButtonsList = [];
    const actionJson = JSON.parse(data.action);
    if (actionJson.length > this.configForButton) {
      const buttonList = actionJson.slice(this.configForButton, actionJson.length);
      buttonList.forEach(element => {
        if (element) {
          this.threeDotButtonsList.push({
            label: this.translate.instant(element.actionName)
          });
        }
      });
    }
  }
  onKeyEnter(event: any, rowData: any, actionName?: any, matmenu?: MatMenuTrigger) {
    if(actionName === FccGlobalConstant.DOWNLOAD_STATEMENT || actionName=== FccGlobalConstant.UPLOAD_STATEMENT) {
      matmenu.openMenu();
    } else {
      this.onClickAction(event, rowData, actionName);
    }
  }
  onClickAction(event: any, rowData: any, actionName?: any) {
    if (rowData && this.commonService.isNonEmptyValue(rowData.action) && rowData.action !== '') {
      if (actionName === FccGlobalConstant.TD_UPDATE) {
        this.tableService.onClickTDUpdate(event, rowData, this.option);
      } else if (actionName === FccGlobalConstant.TD_WITHDRAW) {
        this.tableService.onClickTDWithDraw(event, rowData, this.option);
      }
      else {
        this.urlHandling(rowData, actionName);
      }



    }
  }

  getActionDetailsData(event: Event, data: any, shouldSplit: boolean, showInThreeDotsOnly: boolean) {
    this.item = [];
    let actionNames;
    let actionNamesList = '';
    if (shouldSplit) {
      actionNames = data.action.split(',').slice(FccGlobalConstant.LENGTH_3);
    } else {
      let actionJson;
      if (showInThreeDotsOnly) {
        actionJson = JSON.parse(data.action);
      }
      else {
        actionJson = JSON.parse(data.action).slice(3, data.action.length);
      }
      if (actionJson.length > 0) {
        actionJson.forEach(element => {
          actionNamesList = actionNamesList.concat(element.actionName).concat(',');
        });
      }
      actionNames = actionNamesList.substring(0, actionNamesList.length - 1);
      actionNames = actionNames.split(',');
      actionNames.forEach(element => {
        if (element) {
          this.item.push({
            label: this.translate.instant(element),
            name: element,
            command: () => this.onClickAction(event, data, element)
          });
        }
      });
    }
  }

  getAddFavOption(actionName) {
    if (actionName === 'ADD_FAVOURITE') {
      if (this.commonService.getTotalBeneFavCount() >= this.totalFavBeneLimit)
        return true;
      else
        return false;
    } else {
      return false;
    }
  }

  sortColumn(col: any) {
    if (col.orderType === '') {
      col.orderType = 'asc';
    } else if (col.orderType === 'asc') {
      col.orderType = 'desc';
    } else {
      col.orderType = 'asc';
    } const data = {
      sortField: col.field,
      sortOrder: col.orderType === 'asc' ? 1 : -1
    };
    this.sort(data);
  }

  setFocusOnThreeDots(index) {
    Array.from(document.getElementsByClassName('iconwrapper')).forEach((element, arrayIndex) => {
      if (index === arrayIndex) {
        document.getElementsByClassName('iconwrapper')[index].classList.add('overdraw');
      } else if (document.getElementsByClassName('iconwrapper')[arrayIndex].classList.contains('overdraw')) {
        document.getElementsByClassName('iconwrapper')[arrayIndex].classList.remove('overdraw');
      }
    });
  }


  getMenus(event: Event, data: any, index) {
    if(this.commonService.getQueryParameters()?.get('operation') === 'MODIFY_BATCH') {
      data.highlight = true;
    }
    const anchorElement = document.querySelector('.cdk-overlay-container');
    anchorElement.classList.add("cdk-overlay-container-threedots-popup");
    const floatingEle = document.querySelector('.ui-dialog-mask'
    +'.ui-dialog-visible.ui-dialog-bottom.ng-star-inserted');

    if(null != floatingEle){
      floatingEle.classList.add('floating-panel-z-index');
    }

    this.setFocusOnThreeDots(index);
    this.item = [];
    const actionNames = data.action.split(',').slice(FccGlobalConstant.LENGTH_3);
    actionNames.forEach(element => {
      if (element === FccGlobalConstant.ACTION_EDIT) {
        this.item.push({
          label: this.translate.instant('edit'),
          command: () => this.onClickEdit(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_VIEW) {
        this.item.push({
          label: this.translate.instant(FccGlobalConstant.VIEW_MODE),
          command: () => this.onClickView(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_APPROVE) {
        this.item.push({
          label: this.translate.instant('approve'),
          command: () => this.onClickApprove(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_RETURN) {
        this.item.push({
          label: this.translate.instant('return'),
          command: () => this.onClickReturn(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_DETAIL) {
        this.item.push({
          label: this.translate.instant('Details'),
          command: () => this.onClickDetail(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_TERMINATE) {
        this.item.push({
          label: this.translate.instant('Terminate'),
          command: () => this.onClickDetail(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_FUTURECANCEL) {
        this.item.push({
          label: this.translate.instant('futureCancel'),
          command: () => this.onClickDetail(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_AMEND) {
        this.item.push({
          label: this.translate.instant('amend'),
          command: () => this.onClickAmend(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_DISCARD) {
        this.item.push({
          label: this.translate.instant('discard'),
          command: () => this.onClickDiscard(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_MESSAGE) {
        this.item.push({
          label: this.translate.instant('message'),
          command: () => this.onClickMessage(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_COPY) {
        this.item.push({
          label: this.translate.instant('copy'),
          command: () => this.onClickCopy(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_ASSIGNMENT) {
        this.item.push({
          label: this.translate.instant('assignment'),
          command: () => this.onClickAssignment(event, data)
        });
      } else if (element === FccGlobalConstant.OPTION_REMITTANCE_LETTER) {
        this.item.push({
          label: this.translate.instant('generateRemittanceLetter'),
          command: () => this.onClickRemittanceLetter(event, data)
        });
      } else if (element === FccGlobalConstant.OPTION_TRANSFER) {
        this.item.push({
          label: this.translate.instant('transfer'),
          command: () => this.onClickTransfer(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_CORRESPONDENCE) {
        this.item.push({
          label: this.translate.instant('correspondence'),
          command: () => this.onClickCorrespondence(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_REQUEST_SETTLEMENT) {
        this.item.push({
          label: this.translate.instant('requestsettlement'),
          command: () => this.onClickRequestSettlement(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_RESPOND) {
        this.item.push({
          label: this.translate.instant('respond'),
          command: () => this.onClickRespond(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_DISCREPANT) {
        this.item.push({
          label: this.translate.instant('discrepant'),
          command: () => this.onClickDiscrepant(event, data)
        });
      } else if (element === FccGlobalConstant.REPAY) {
        this.item.push({
          label: this.translate.instant('repay'),
          command: () => this.onClickRepay(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_FACILITY_DETAIL) {
        this.item.push({
          label: this.translate.instant('facilitydetail'),
          command: () => this.onClickFacilityDetail(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_DRAWDOWN) {
        this.item.push({
          label: this.translate.instant('drawdown'),
          command: () => this.onClickDrawdown(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_ROLLOVER) {
        this.item.push({
          label: this.translate.instant('rollover'),
          command: () => this.onClickRollover(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_LOAN_INCREASE) {
        this.item.push({
          label: this.translate.instant('increase'),
          command: () => this.onClickIncrease(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_LOAN_PAYMENT) {
        this.item.push({
          label: this.translate.instant('principalPayment'),
          command: () => this.onClickLoanPayment(event, data)
        });
      } else if (element === 'SET_ENTITY') {
        this.item.push({
          label: this.translate.instant('SET_ENTITY'),
          command: () => this.onClickSetEntity(event, data)
        });
      } else if (element === 'SET_REFERENCE') {
        this.item.push({
          label: this.translate.instant('SET_REFERENCE'),
          command: () => this.onClickSetReference(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_AMEND_RELEASE) {
        this.item.push({
          label: this.translate.instant('amendRelease'),
          command: () => this.onClickAmendRelease(event, data)
        });
      } else if (element === 'CANCEL') {
        this.item.push({
          label: this.translate.instant('CANCEL'),
          command: () => this.onClickCancel(event, data)
        });
      } else if (element === FccGlobalConstant.ACTION_USER_AUDIT) {
        this.item.push({
          label: this.translate.instant('userAudit'),
          command: () => this.onClickUserAudit(event, data)
        });
      } else if (element.includes('actionName')) {
        const actionName = element.split(':')[1].replace(/[^\w ]/g, '');
        outerloop:if (!(actionName === FccGlobalConstant.ADD_FAVOURITE && data[FccGlobalConstant.FAVROUITE_ACCOUNT] == 'true') &&
          !(actionName === FccGlobalConstant.REMOVE_FAVOURITE && data[FccGlobalConstant.FAVROUITE_ACCOUNT] == 'false') &&
          !(actionName === FccGlobalConstant.VIEW_ADDITIONAL_INFO) && !(actionName === FccGlobalConstant.VIEW_BENEFICIARY) &&
          !(actionName === FccGlobalConstant.EDIT_INSTRUMENT) && !(actionName === FccGlobalConstant.UPDATE_INSTRUMENT)
          && !(actionName === FccGlobalConstant.DISCARD_INSTRUMENT)) {
            if(this.router.url === '/statusListing' && localStorage.isBatchPayment === FccGlobalConstant.STRING_TRUE
            && !this.approvalByTransaction){
              break outerloop;
            }
            if(!this.resolverService.instrumentLevelConfigFlag &&
              data.instrumentstatus === FccGlobalConstant.PENDINGSEND){
                break outerloop;
              }
            if(/* (!((actionName === FccGlobalConstant.ACTION_APPROVE)
            && data[FccGlobalConstant.IS_BATCH_PAYMENT] === FccGlobalConstant.STRING_FALSE))
            &&  */(!((actionName === FccGlobalConstant.REPEAT_PAYMENT)
            && data[FccGlobalConstant.IS_BATCH_PAYMENT] === FccGlobalConstant.STRING_TRUE))  ){
              this.item.push({
                label: this.translate.instant(actionName),
                command: () => this.urlHandling(data, actionName)
              });
            }
        } else if (this.showActionPopup(actionName, data)) {
          this.item.push({
            label: this.translate.instant(actionName),
            command: () => this.handlePopUp(data, actionName)
          });
        } else if (actionName === FccGlobalConstant.EDIT_INSTRUMENT) {
          if (this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION) === FCMPaymentsConstants.MODIFY_BATCH){
          this.item.push({
            label: this.translate.instant('EDIT_INSTRUMENT'),
            command: () => this.onClickEditInstrument(data)
          });
        }
        } else if (actionName === FccGlobalConstant.UPDATE_INSTRUMENT) {
          if (this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION) === FCMPaymentsConstants.MODIFY_BATCH){
          this.item.push({
            label: this.translate.instant(actionName),
            command: () => this.onClickEditInstrument(data)
          });
        }
        } else if (actionName === FccGlobalConstant.DISCARD_INSTRUMENT) {
          if (this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION) === FCMPaymentsConstants.MODIFY_BATCH){
          this.item.push({
            label: this.translate.instant('DISCARD_INSTRUMENT'),
            command: () => this.discardBatchInstrument(data)
          });
        }
      }
      } else if (element === 'UPDATE') {
        this.item.push({
          label: this.translate.instant('UPDATE'),
          command: () => this.onClickUpdate(event, data)
        });
      } else if (element === 'DELETE_BENEFICIARY') {
        this.item.push({
          label: this.translate.instant('DELETE_BENEFICIARY'),
          command: () => this.onClickDelete(event, data)
        });
      } else if (element === 'REJECT') {
        this.item.push({
          label: this.translate.instant('REJECT'),
          command: () => this.onClickUserAudit(event, data)
        });
      } else if (element === 'DOWNLOAD') {
        this.item.push({
          label: this.translate.instant('DOWNLOAD'),
          command: () => this.onClickAccountStatementDownload(event, data)
        });
      }
    });
  }

  exportExcel() {
  }
  selectDownload(tt: any) {
    this.download.emit(tt);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateViewMoreFlag();
    this.commonService.eyeIconClicked$.subscribe(
      res => {
        if (res === 'yes') {
          this.maskEnable = true;
        }
        if (res === 'no') {
          this.maskEnable = false;
        }
      });
    this.commonService.deleteIconClicked$.subscribe(
      res => {
        if (res === 'yes') {
          this.viewFullTable = true;
        }
        if (res === 'no') {
          this.viewFullTable = false;
        }
    });
    this.intialiseData();
    if (this.filterChips && this.filterChips.length) {
      /* Deep Copy */
      this.filterChipsList = JSON.parse(JSON.stringify(this.filterChips));
      this.showRemoveChips = true;
    } else {
      this.showRemoveChips = false;
    }
    this.addIdToPaginatorDropdown();
    this.filterChipsList.forEach(chip => {
      if (chip.value && !chip.actualValue) {
        chip.actualValue = chip.value;
      }
    })
  }

  freezeAction() {
    const div: any = document.getElementsByClassName('ui-table-wrapper')[0];
    if (div) {
      const table: any = div.getElementsByTagName('table')[0];
      if (table.offsetWidth > div.offsetWidth) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  onShowChart() {
    this.commonService.isDeleteIconClicked('no');
  }
  RemoveChips(item) {
    this.childDeleteEvent.emit(item);
  }

  RemoveAllChips(item) {
    this.childDeleteAllEvent.emit(item);
    this.showRemoveChips = false;
  }

  intialiseData() {
    this.getColumns();

    this.getValues();

    this.getPaginator();

    this.getRows();

    this.getResponsive();

    this.getDataKey();

    this.getIsLazyEnabled();

    this.getTotalRecords();

    this.getRowexpansion();

    this.getColumnActions();

    this.getWildSearch();

    this.getactionconfig();

    this.getalignPagination();

    this.getExpandRowData();

    this.getColumnsort();

    this.getcheckBoxPermission();

    this.getrppOptions();

    this.getSelectMode();

    this.getSelectedRow();

    this.getPassbackParameters();

    this.getPassBackEnabled();

    this.getSelectionEnabled();

    this.getDownloadIconEnabled();

    this.getColFilterIconEnabled();

    this.getEnhancedUXTable();

    this.getDisplayDashboard();

    this.getShowButtons();

    this.getActionData();

    this.getDashboardWidgetDetails();

    this.getDisplayInputSwitch();

    this.getDisableHeaderCheckbox();

    this.setAllowColumnCustomization();

    this.setFrozenColMaxLimit();

    this.getFavrouiteAccount();

    this.getFilterChipsRequired();

    this.addPaginatorAccessibility(document);
    this.scrollDelay();

    this.showColumnFilterSec = false;

    if (this.ptable && Object.keys(this.ptable.filters).length > 0) {
      const results = '_results';
      Object.keys(this.ptable.filters).forEach(element => {
        this.ptable.filter('', element, 'in');
      });
      this.filter[results].forEach(ds => {
        ds.value = null;
        ds.updateLabel();
      });
      this.ptable.reset();
    }

    setTimeout(() => {
      this.loading = false;
    }, FccGlobalConstant.LENGTH_1000);
  }

  loadTableData(event: LazyLoadEvent, fromSort = false) {
    this.isLazyEnabled = true;
    if (this.ptable) {
      this.ptable.lazy = this.isLazyEnabled;
    this.loading = true;
    }
    if (fromSort) {
      this.currentState.sortField = event.sortField;
      this.currentState.sortOrder = event.sortOrder;
      this.currentState.rows = this.ptable.rows;
      this.currentState.first = this.ptable.first;
    } else {
      this.currentState.filters = event.filters;
      this.currentState.first = event.first;
      this.currentState.globalFilter = event.globalFilter;
      this.currentState.multiSortMeta = event.multiSortMeta;
      this.currentState.rows = event.rows;
    }
    this.lazyEvent.emit(this.currentState);
  }

  getFilterValues(event: Event, columnField: string, tt: any) {
    const filterArray = [];
    const set = new Set();
    let dataMap;
    dataMap = this.data;
    let result = [new Set(dataMap.map(item => item[this.originalValue] && item[this.originalValue].get(columnField)
      ? item[this.originalValue].get(columnField) : item[columnField]))];
    if (this.commaSeparatedColumnList.indexOf(columnField) !== -1) {
      const data = [new Set(dataMap.map(item => item[FccGlobalConstant.ORIG_GROUPED_VAL] ? item[FccGlobalConstant.ORIG_GROUPED_VAL]
        : item[this.originalValue] && item[this.originalValue].get(columnField) ? item[this.originalValue].get(columnField)
          : item[columnField]))];
      for (const item1 of data) {
        for (const item2 of item1) {
          if (this.commonService.isNonEmptyValue(item2)) {
            const finalData = (item2 as string).split(',');
            finalData.forEach(element => {
              set.add(element.trim());
            });
          }
        }
      }
      result = [set];
    }
    for (const item of result) {
      item.forEach(element => {
        if (element !== '') {
          if (element.toString() === '&#x2a;') {
            element = '&#x2a;';
          }
          if (columnField === 'tnx_type_code') {
            filterArray.push({
              label: this.translate.instant('N002_' + element),
              value: element
            });
          } else if (columnField === 'prod_stat_code') {
            filterArray.push({
              label: this.translate.instant('N005_' + element),
              value: element
            });
          } else if (columnField === 'action_req_code') {
            filterArray.push({
              label: this.translate.instant('N042_' + element),
              value: element
            });
          } else if (columnField === 'sub_product_code') {
            filterArray.push({
              label: this.translate.instant('N047_' + element),
              value: element
            });
          } else if (columnField === 'product_code') {
            filterArray.push({
              label: this.translate.instant('N001_' + element),
              value: element
            });
          } else if (columnField === 'ft_type') {
            filterArray.push({
              label: this.translate.instant('N029_' + element),
              value: element
            });
          } else if (columnField === 'lc_exp_date_type_code') {
            filterArray.push({
              label: this.translate.instant('C085_' + element),
              value: element
            });
          }
          else if (columnField === 'product_type_code') {
            filterArray.push({
              label: this.translate.instant('C010_' + element),
              value: element
            });
          }
          else if (columnField === 'account_type') {
            filterArray.push({
              label: this.translate.instant('N068_' + element),
              value: element
            });
          }
          else if (columnField === 'tenor_type') {
            filterArray.push({
              label: this.translate.instant('C095_' + element),
              value: element
            });
          }
          else if (columnField === 'account_type_code') {
            filterArray.push({
              label: this.translate.instant('N068_' + element),
              value: element
            });
          }
          else if (columnField === 'ObjectDataString@no_of_cheques') {
            filterArray.push({
              label: this.translate.instant('noOfChequesOptions_' + element),
              value: element
            });
          } else if(columnField === 'bankAccount@isDefaultAccount'){
            if(element === 'true'){
              filterArray.push({
                label: this.translate.instant('yes'),
                value: element
              });
            }else{
              filterArray.push({
                label: this.translate.instant('no'),
                value: element
              });
            }
          } else if (columnField === 'topic') {
            filterArray.push({
              label: this.translate.instant('P321_' + element),
              value: element
            });
          } else if (columnField === 'sub_topic') {
            filterArray.push({
              label: this.translate.instant('P812_' + element),
              value: element
            });
          } else {
            filterArray.push({
              label: this.commonService.decodeHtml(element),
              value: element
            });
          }
          this.columnFilter[columnField] = filterArray;
        }
      });
    }
    return this.columnFilter;
  }

  displayColumnFilter() {
    this.showColumnFilterSec = !this.showColumnFilterSec;
  }

  clientFilter(event: any, tt: any, columnField: string) {
    let matchCriteria = 'in';
    if (event.value.length !== 0) {
      this.isLazyEnabled = false;
      this.rppOptions = null;
    }
    this.columns.forEach((item) => {
      if (item.field === columnField) {
        item.title = event.value && event.value.length === 0 ? this.translate.instant('select') :
          event.value && event.value.length === 1 ? event.value[0] : `${event.value.length} items selected`;
      }
    });
    if (this.commaSeparatedColumnList.indexOf(columnField) !== -1) {
      matchCriteria = this.inAndContains;
    }
    this.data.forEach(record => {
      record[columnField] = record[this.originalValue] && record[this.originalValue].get(columnField)
        ? record[this.originalValue].get(columnField) : record[columnField];
    });
    tt.filter(event.value, columnField, matchCriteria);
  }
  paginate(event: any, tt: any) {
    if (Object.keys(event.filters).length === 0) {
      tt.totalRecords = this.totalRecords;
      this.isLazyEnabled = true;
      this.rppOptions = this.compService.rppOptions;
    }
  }

  /* This method is called after client-side filtering and handles the logic for displaying the value being searched
     against the record itself.
     Eg - Filter value applied on account feild is ACC01
          Record 1 contains accounts ACC01, ACC02

          It will result in displaying account as ACC01 instead of  ACC01(+1) against Record 1
  */
  customFilter(event) {
    this.filteredRowData = [];
    if (event?.filters && Object.keys(event.filters).length > 0 && event?.filteredValue && event.filteredValue.length > 0) {
      event.filteredValue.forEach(filteredRecord => {
        filteredRecord[this.originalValue] = filteredRecord[this.originalValue] ? filteredRecord[this.originalValue] : new Map();
        Object.keys(event.filters).forEach(filterKey => {
          const filteredList = new Array();
          [...event.filters[filterKey].value].forEach(filter => {
            if (FilterUtils.contains(filteredRecord[this.originalValue].get(filterKey)
              ? filteredRecord[this.originalValue].get(filterKey) : filteredRecord[filterKey], filter)) {

              if (!filteredRecord[this.originalValue].get(filterKey)) {
                filteredRecord[this.originalValue].set(filterKey, filteredRecord[filterKey]);
              }
              filteredList.push(filter);
              filteredRecord[filterKey] = this.sortAndCompare(filteredRecord[this.originalValue].get(filterKey)
                , filteredList) ? filteredRecord[this.originalValue].get(filterKey)
                : this.sortByDefaultColumnValue(filteredList, filteredRecord[this.originalValue].get(filterKey).split(',')[0]);
            }
          });
        });
        this.filteredRowData.push(filteredRecord);
      });
    } else if (event?.filters && Object.keys(event.filters).length === 0) {
      this.data = this.compService.values;
      this.dataTemp = this.compService.values
      this.filteredRowData = this.data;
    }
  }

  // Sorting an array based on default value
  sortByDefaultColumnValue(filteredList, defaultValue) {
    const defaultValueIndex = filteredList.indexOf(defaultValue);
    if (defaultValueIndex > 0) {
      const temp = filteredList[0];
      filteredList.splice(defaultValueIndex, 1);
      filteredList.splice(0, 1, defaultValue);
      filteredList.push(temp);
    }
    return filteredList.join(',');
  }

  // Converts comma separated string(Param 1) to array, sorts both arrays and then compares and return the result
  sortAndCompare(commaSeparatedString, array) {
    const arr = commaSeparatedString.split(',');
    arr.sort();
    array.sort();
    return JSON.stringify(arr) === JSON.stringify(array);
  }

  onRowSelect(event: any, tt: any, rowData?: any) {
    const widgetArray = ['pendingTrade'];
    if (this.commonService.isnonEMptyString(event.data) && event.type === FccGlobalConstant.checkBox) {
      this.checkboxData.push(event.data);
    }
    if (this.inputParams && this.inputParams.dashboardTypeValue === 'TRADE'
    && ((widgetArray.indexOf(this.inputParams.widgetName) > -1)  && rowData)) {
      const eventData = JSON.parse(rowData.tnxId);
      if (eventData) {
        const passback = eventData.fieldValuePassbackParameters;
        this.router.navigate([FccGlobalConstant.REVIEW_SCREEN], {
          queryParams: {
            referenceid: passback.REF_ID,
            tnxid: passback.TNX_ID,
            productCode: passback.PRODUCT_CODE,
            subProductCode: rowData.subProductCodeVal,
            mode: FccGlobalConstant.VIEW_MODE,
            operation: FccGlobalConstant.LIST_INQUIRY,
            action: FccGlobalConstant.APPROVE,
            tnxTypeCode: passback.TNX_TYPE_CODE
          }
        });
      }
    } else if (this.inputParams && this.inputParams.dashboardTypeValue === 'TRADE'
    && (this.inputParams.widgetName === FccGlobalConstant.ACTION_REQUIRED_WIDGET) && rowData) {
      this.onClickActionRequiredRow(event, rowData);
    }
    else if (this.inputParams && (this.inputParams.dashboardTypeValue === 'TRADE'
    && (this.inputParams.widgetName === FccGlobalConstant.TRADE_PAYMENT_WIDGET
      ||  this.inputParams.widgetName === FccGlobalConstant.PENDING_APPROVAL) && rowData)) {
      rowData.product_code = rowData.productCode;
      rowData.sub_product_code = rowData.subProductCodeVal;
      rowData.ref_id = rowData.refId;
      rowData.tnx_id = JSON.parse(rowData.tnxId).fieldValuePassbackParameters.TNX_ID;
      rowData.tnx_type_code = rowData.tnxTypeCode;
      rowData.sub_tnx_type_code = rowData.subTnxTypeCode;
      rowData.cust_ref_id = rowData.CustRefId;
      this.option = this.inputParams.widgetName;

      if (rowData.tnxStatCode === '02'
          || rowData.tnxStatCode.toUpperCase() === 'UNCONTROLLED') {
        this.onClickApprove(event, rowData);
      } else {
        this.onClickDetail(event, rowData);
      }

    }
    else if (this.inputParams && this.inputParams.dashboardTypeValue === 'TRADE'
      && (this.inputParams.widgetName === FccGlobalConstant.TRANSACTION_IN_PROGRESS) && rowData) {
      rowData.product_code = rowData.productCode;
      rowData.sub_product_code = rowData.subProductCode;
      rowData.ref_id = rowData.refId;
      rowData.tnx_id = rowData.tnxId;
      rowData.tnx_type_code = rowData.tnxTypeCode;
      rowData.sub_tnx_type_code = rowData.subTnxTypeCode;
      rowData.cust_ref_id = rowData.CustRefId;
      this.option = this.inputParams.widgetName;
      if (rowData.tnxStatCode === '01') {
        this.onClickEdit(event, rowData);
      } else if (rowData.tnxStatCode === '02') {
        this.onClickApprove(event, rowData);
      } else if (rowData.tnxStatCode === '03') {
        this.onClickDetail(event, rowData);
      }
    } else if (this.inputParams?.isDashboardWidget &&
      (this.commonService.isNonEmptyValue(this.inputParams.checkBoxPermission) && this.inputParams.checkBoxPermission == true) &&
     this.inputParams.widgetName === FccGlobalConstant.PENDING_APPROVAL && event.type === FccGlobalConstant.checkBox) {
      event['selectedRowsData'] = tt.selection;
      this.addFilters(event);
      this.rowSelectEvent.emit(event);
     }
     else if (this.inputParams && (this.inputParams.dashboardTypeValue === 'TRADE'
    && (this.inputParams.widgetName === FccGlobalConstant.TRADE_PAYMENT_WIDGET
      ||  this.inputParams.widgetName === FccGlobalConstant.PENDING_APPROVAL) && rowData)) {
      rowData.product_code = rowData.productCode;
      rowData.sub_product_code = rowData.subProductCodeVal;
      rowData.ref_id = rowData.refId;
      rowData.tnx_id = JSON.parse(rowData.tnxId).fieldValuePassbackParameters.TNX_ID;
      rowData.tnx_type_code = rowData.tnxTypeCode;
      rowData.sub_tnx_type_code = rowData.subTnxTypeCode;
      rowData.cust_ref_id = rowData.CustRefId;
      this.option = this.inputParams.widgetName;
      if (rowData.tnxStatCode === '02'
      || rowData.tnxStatCode.toUpperCase() === 'UNCONTROLLED') {
    this.onClickApprove(event, rowData);
  } else {
      this.onClickDetail(event, rowData);
  }
    } else {
      let routeUrl='';
      this.activatedRoute.params.subscribe(p=>{routeUrl = p.name});
      if (this.inputParams?.isDashboardWidget && routeUrl !== FccConstants.ACC_SUMMARY) {
        if (event.target != undefined && event.target.type != 'button' && !event.target.className.includes('ui-button-text')) {
          this.switchListDef.emit(event);
          if (tt.selection.length > 0) {
            event['selectedRowsData'] = tt.selection;
          } else {
            event['selectedRowsData'] = rowData;
          }
          this.addFilters(event);
          this.rowSelectEvent.emit(event);
        }
      } else {
        event['selectedRowsData'] = tt.selection;
        this.addFilters(event);
        this.rowSelectEvent.emit(event);
      }
  }

  }

  onClickActionRequiredRow(event, rowData) {
    rowData.action_req_code = rowData.actionCode;
    rowData.product_code = rowData.productCode;
      rowData.sub_product_code = rowData.subProductCode;
      rowData.ref_id = rowData.refId;
      rowData.tnx_id = rowData.tnxId;
      rowData.tnx_type_code = rowData.tnxTypeCode;
      rowData.sub_tnx_type_code = rowData.subTnxTypeCode;
      rowData.cust_ref_id = rowData.CustRefId;
      this.option = this.inputParams.widgetName;
    if(rowData.actionCode === FccGlobalConstant.ACTION_REQUIRED_12)
    {
      this.tableService.onClickDiscrepant(event, rowData);
    }
    else if(rowData.actionCode === FccGlobalConstant.ACTION_REQUIRED_26) {
      this.tableService.onClickRequestSettlement(event, rowData);
    }
    else if(rowData.actionCode === FccGlobalConstant.ACTION_REQUIRED_99 ||
      rowData.actionCode === FccGlobalConstant.ACTION_REQUIRED_03 ||
       rowData.actionCode === FccGlobalConstant.ACTION_REQUIRED_05 ||
        rowData.actionCode === FccGlobalConstant.ACTION_REQUIRED_07) {
      this.tableService.onClickRespond(event, rowData);
    }
    else if(rowData.actionCode === FccGlobalConstant.ACTION_REQUIRED_15) {
      this.tableService.onClickAcceptIP(event, rowData);
    }
}

  addFilters(event: any) {
    if (this.displayInputSwitch && this.displayInputSwitch.display) {
      event[`selected`] = true;
      event[`fetchRecords`] = this.ptable._selection.length <= 1 ? true : false;
      event[`filterParams`] = {};
      this.disableHeaderCheckbox = false;
      this.checkBoxAction = true;
      Object.keys(this.displayInputSwitch[FccGlobalConstant.FILTER_PARAMS]).forEach(filterName => {
        Object.keys(event.data).forEach(columnName => {
          if (filterName === columnName) {
            event[FccGlobalConstant.FILTER_PARAMS][filterName] = event.data[filterName];
          }
        });
      });
    }
  }

  onRowUnSelect(event: any, tt: any) {
    event['selectedRowsData'] = tt.selection;
    if (this.displayInputSwitch && this.displayInputSwitch.display && event.type === FccGlobalConstant.checkBox) {
      event[`selected`] = false;
      event[`fetchRecords`] = false;
      if (this.ptable._selection.length === 0) {
        event[`fetchRecords`] = true;
        this.disableHeaderCheckbox = true;
      }
    }
    if (this.commonService.isnonEMptyString(event.data) && event.type === FccGlobalConstant.checkBox){
      this.checkboxData.forEach((item, index) => {
        if (JSON.stringify(item) === JSON.stringify(event.data)) {
          this.checkboxData.splice(index, 1);
        }
      });
    }
    this.rowUnSelectEvent.emit(event);
  }

  setClass(): string {
    if (this.dir === 'rtl') {
      return 'rowStyleDirection';
    } else {
      return 'rowStyle';
    }
  }

  setDirections(purpose: string, value: string, col?: any): string {
    switch (purpose) {
      case 'className':
        return this.dir === 'rtl' ? 'ui-rtl' : 'none';
      case 'direction':
        return this.dir === 'rtl' ? 'left' : 'right';
      case 'paginatorDirection':
        return this.dir === 'rtl' ? (value === 'left' ? 'paginatorright' : 'paginatorleft') :
          (value === 'left' ? 'paginatorleft' : 'paginatorright');
      case 'colDirection':
        return (value !== 'center' && this.dir === 'rtl') ? (value === 'left' ? 'right' : 'left') : value;
      case 'colDivFlexDirection':{
        if(col && (col.field === 'tnx_amt'|| col.field === 'liab_amt' || col.field === 'ln_amt'|| col.field === 'amt' ||
        col.field === 'total_amount'|| col.field === 'utilised_amt' || col.field === 'totalCommitment_amt'
        || (this.lcProductAmount.indexOf(col.field) > -1))){
          return 'initial';
        }
        return value === 'right' ? 'row-reverse' : 'initial';
      }
      case 'colDivJustification':
        return value === 'center' ? 'center' : 'flex-start';
      case 'colorDot':
        if (this.dir === 'ltr') {
          return value === 'right' && localStorage.getItem(FccGlobalConstant.LANGUAGE) === 'ar' ? 'rtl' : 'ltr';
        } else {
          return value === 'right' ? 'ltr' : 'rtl';
        }
    }
  }

  // Float Direction added for Amount Header
  setFloatDirection(col){
    if (col.field === 'tnx_amt' || (this.lcProductAmount.indexOf(col.field) > -1) || col.field === 'liab_amt'
      || col.field === 'ln_amt' || col.field === 'amt'
      || col.field === 'total_amount' || col.field === 'utilised_amt' || col.field === 'totalCommitment_amt') {
      if (localStorage.getItem(FccGlobalConstant.LANGUAGE) === 'ar') {
        return 'left'
      }
      return 'right'
    }
  }

  convertToCSV(objArray, headerList): string {
    const selectedColumns = [];
    const notSelectedCol = [];
    if (this.inputParams !== undefined && this.inputParams.preferenceData !== undefined &&
      this.inputParams.preferenceData.columns.length > 0) {
      this.inputParams.preferenceData.columns.filter(el => el.showAsDefault).forEach(val => selectedColumns.push(val.field));
      if (this.inputParams.preferenceName && this.inputParams.preferenceName !== '' && selectedColumns.length > 0) {
        headerList.filter(el => !(selectedColumns.find(element => element === el.field)))
          .forEach(val => notSelectedCol.push(val.field));
      }
    }
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    const row = '';
    if (!notSelectedCol.includes('action')) {
      notSelectedCol.push('action');
    }
    const excludeCols = notSelectedCol;
    const cellValue = '';
    const language = localStorage.getItem('language');

    if (language === FccGlobalConstant.LANGUAGE_AR) {
      str = this.convertToCSVArabic(headerList, row, array, excludeCols, cellValue, str);
    } else {
      str = this.convertToCSVOtherLang(headerList, row, array, excludeCols, cellValue, str);
    }

    return str;
  }

  exportDataBasedOnType(exportType: string) {
    let data = '';
    if (exportType === 'csv') {
      data = this.convertToCSV(this.compService.exportData, this.compService.exportCols);
    }
    const BOM = '\uFEFF';
    data = BOM + data;
    const blob = new Blob([data], { type: `text/${exportType};charset=utf-8` });
    saveAs(blob, this.translate.instant(this.compService.fileName) + '.' + exportType);
  }


  convertToCSVArabic(headerList, row, array, excludeCols, cellValue, str) {
    const headerListLength = headerList.length - 1;

    for (let i = headerListLength; i >= 0; i--) {
      if (excludeCols.indexOf(headerList[i].field) === -1) {
        row += headerList[i].header + ',';
      }
    }

    row = row.slice(0, -1);
    str += row + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let j = headerListLength; j >= 0; j--) {
        if (excludeCols.indexOf(headerList[j].field) === -1) {
          const head = headerList[j].field;
          if (head === 'tnx_type_code') {
            cellValue = this.translate.instant('N002_' + array[i][head]);
          } else if (head === 'prod_stat_code') {
            cellValue = this.translate.instant('N005_' + array[i][head]);
          } else if (head === 'sub_product_code') {
            cellValue = this.translate.instant('N047_' + array[i][head]);
          } else if (head === 'action_req_code') {
            cellValue = this.translate.instant('N042_' + array[i][head]);
          } else if (head === 'product_code') {
            cellValue = this.translate.instant('N001_' + array[i][head]);
          } else {
            cellValue = array[i][head];
          }
          if (cellValue && cellValue.indexOf(',') > -1) {
            line += '"' + this.commonService.decodeHtml(cellValue) + '",';
          } else {
            line += this.commonService.decodeHtml(cellValue) + ',';
          }
        }
      }
      str += line + '\r\n';
    }
    return str;
  }

  convertToCSVOtherLang(headerList, row, array, excludeCols, cellValue, str): string {
    for (const index of headerList) {
      if (excludeCols.indexOf(index.field) === -1) {
        row += index.header + ',';
      }
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index of headerList) {
        if (excludeCols.indexOf(index.field) === -1) {
          const head = index.field;
          if (head === 'tnx_type_code') {
            cellValue = this.translate.instant('N002_' + array[i][head]);
          } else if (head === 'prod_stat_code') {
            cellValue = this.translate.instant('N005_' + array[i][head]);
          } else if (head === 'sub_product_code') {
            cellValue = this.translate.instant('N047_' + array[i][head]);
          } else if (head === 'action_req_code') {
            cellValue = this.translate.instant('N042_' + array[i][head]);
          } else if (head === 'product_code') {
            cellValue = this.translate.instant('N001_' + array[i][head]);
          } else {
            cellValue = array[i][head];
          }
          if (cellValue && cellValue.indexOf(',') > -1) {
            line += '"' + this.commonService.decodeHtml(cellValue) + '",';
          } else if (cellValue === undefined || cellValue === null) {
            line += ',';
          } else {
            line += this.commonService.decodeHtml(cellValue) + ',';
          }
        }
      }
      str += line + '\r\n';
    }
    return str;
  }


  setIndex(i) {
    if (i === undefined) {
      this.rowExp = i;
    }
    if (this.rowExp !== i) {
      this.rowExp = i;
    }
  }

  collapse(i): any {
    if (this.rowExp !== i) {
      const collapseStyle = {
        'border-top': 1 + 'px' + ' solid' + ' #d7d6d7'
      };
      return collapseStyle;
    }
  }

  expandCall(): any {
    if (this.rowExp !== undefined) {
      const expandCallStyle = {
        'border-bottom': 0 + 'px'
      };
      return expandCallStyle;
    }
  }

  expandCallBottom(): any {
    if (this.rowExp !== undefined) {
      const expandCallBottomStyle = {
        'border-bottom': 1 + 'px' + ' solid' + ' #d7d6d7'
      };
      return expandCallBottomStyle;
    }
  }
  onClickView(event, rowData) {
    if (this.inputParams.widgetName === 'approvedTransactionsByBank' ||
    this.inputParams.widgetName === 'rejectedTransactions' ) {
      rowData.product_code = rowData.productCode;
      rowData.sub_product_code = rowData.subProductCode;
      rowData.ref_id = rowData.refId;
      rowData.tnx_id = rowData.tnxId;
      rowData.tnx_type_code = rowData.tnxTypeCode;
      rowData.sub_tnx_type_code = rowData.subTnxTypeCode;
      rowData.cust_ref_id = rowData.CustRefId;
      this.option = this.inputParams.widgetName;
    }
    this.tableService.onClickView(event, rowData);
  }

  onClickBillView(event, rowData) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['billView'], {
        queryParams: {
          tnxid: rowData.tnx_id, referenceid: rowData.ref_id,
          productCode: rowData.product_code, billId: rowData.bill_id, billType: rowData.bill_type
        }
      })
    );
    const popup = window.open('#' + url, '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
    const productId = `${this.translate.instant(rowData.product_code)}`;
    const mainTitle = `${this.translate.instant('MAIN_TITLE')}`;
    popup.onload = () => {
      popup.document.title = mainTitle + ' - ' + productId;
    };
  }

  showWaybillForRowData(){
    this.waybillRefId = [];
    if(this.productCode && this.courierApplicableProductCode.indexOf(this.productCode) !== -1)
    {
    this.listService
    .getCourierTnxColumns('/trade/listdef/customer/'+ this.productCode + '/listTnxWithCourierDetailsOnly').subscribe(
      resp => {
        if(resp && resp.rowDetails) {
          resp.rowDetails.forEach((res)=> {
            this.waybillRefId.push(res.index.filter( row => row.name === 'ref_id' )[0]['value']);
          });
        }
      });
    }
  }

  showAwbTrackingIcon(rowData: any) {
          let showIcon : boolean = false;
          let applicableTabs : string[] = ['live','outstanding','advised','uaadvised'];
          this.commonService.getCourierTrackingFeatureEnabled();
          if (this.waybillRefId.includes(rowData.ref_id) && (applicableTabs.includes(this.inputParams.activeTab.localizationKey?.toLowerCase()) ||
          applicableTabs.includes(this.inputParams.activeTab.localizationKeyPdf?.toLowerCase()))) {
            showIcon = true;
          }
          return this.commonService.isCourierTrackingFeatureEnabled && showIcon;
  }

  getCourierPartnerWaybills($event, rowData)
  {
    this.courierReferenceListObj = [];

    this.listService
    .getCourierTnxColumns('/trade/listdef/customer/' + rowData.product_code + '/listTnxWithCourierDetailsOnly', rowData.ref_id).subscribe(
      resp => {
        resp.rowDetails.forEach(courier => {
          if (courier.index && courier.index[0]?.name && courier.index[0]?.value) {
            let obj = {};
            courier.index.forEach(field => {
              obj[field.name] = field.value;
            });
            this.courierReferenceListObj.push(obj);
          }
        });

        // Considered updated tnx by filtering based on bill_ref >> STARTS
        const tempObj1 = this.courierReferenceListObj;
        const tempObj2 = this.courierReferenceListObj;
        let finalObj = this.courierReferenceListObj;
        for(let i = 0; i < tempObj1.length; i++)
        {
          for(let j = 0; j < tempObj2.length; j++)
          {
            if(i != j)
            {
              if (tempObj1[i]?.imp_bill_ref_id && tempObj2[j]?.imp_bill_ref_id
                && tempObj1[i]?.tnx_id && tempObj1[j]?.tnx_id)
                {
                  if (tempObj1[i]?.imp_bill_ref_id === tempObj2[j]?.imp_bill_ref_id && tempObj1[i]['tnx_id'] < tempObj2[j]['tnx_id']) {
                    //eslint-disable-next-line no-console
                    console.trace("Considered updated tnx by filtering based on bill_ref.");
                    delete finalObj[i];
                  }
                }
              }
            }
        }

        // Remove empty item from finalObj
        finalObj = finalObj.filter( item => item != undefined);

        this.courierReferenceListObj = finalObj;
        // Considered updated tnx by filtering based on bill_ref << ENDS

    const dir = localStorage.getItem('langDir');
    const locaKeyValue = this.translate.instant('message');
    let tempDialogTitle = `${this.translate.instant('REF_ID')}` + ":" + " " + rowData.ref_id;
    tempDialogTitle += rowData.bo_ref_id ? (" | " + `${this.translate.instant('BO_REF_ID')}` + ":" + " " + rowData.bo_ref_id) : "";
    const courierDialog = this.dialogService.open(CourierTrackerComponent, {
      header: tempDialogTitle,
      width: '80em',
      style: { direction: dir },
      styleClass: 'fileUploadClass',
      data: {
        courierList:this.courierReferenceListObj,
        rowData : rowData,
        locaKey: locaKeyValue,
        showOkButton: true,
        showNoButton: false,
        showYesButton: false
      },
      baseZIndex: 10010,
      autoZIndex: true
    });
    courierDialog.onClose.subscribe((result: any) => {});
      });
  }

  onClickApprove(event: any, rowData: any) {
    if (this.commonService.isEmptyValue(this.option)) {
      this.widgetCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.WIDGET_CODE);
    }
    this.tableService.onClickApprove(event, rowData, this.option, this.widgetCode);
  }

  onClickLendingApprove(event, rowData) {
    this.router.navigate(['reviewScreen'], {
      queryParams: {
        tnxid: rowData.tnx_id, referenceid: rowData.ref_id,
        action: FccGlobalConstant.APPROVE, mode: FccGlobalConstant.VIEW_MODE,
        productCode: rowData.ref_id.substring(FccGlobalConstant.LENGTH_0, FccGlobalConstant.LENGTH_2),
        subProductCode: rowData.sub_product_code, facilityid: rowData.bo_facility_id, borrowerIds: rowData.borrower_reference,
        operation: FccGlobalConstant.LIST_INQUIRY
      }
    });
  }

  urlHandling(rowData: any, actionName: any) {
    let actionJson: any;
    if (this.showPopup || this.actionPopup) {
      this.handlePopUp(rowData, actionName);
    }
    if (!this.actionconfig) {
      actionJson = JSON.parse(rowData.action.match(/\[(.*?)\]/)[0]);
    } else {
      actionJson = JSON.parse(rowData.action);
    }

    if (actionJson.length > 0) {
      actionJson.forEach(element => {
        if (element.actionName === actionName) {
          const url = element.urlLink;
          const urlType = element.urlType ? element.urlType : '';
          const urlScreenType = element.urlScreenType ? element.urlScreenType : '';
          if(actionName === FccGlobalConstant.DOWNLOAD_STATEMENT || actionName === FccGlobalConstant.UPLOAD_STATEMENT
          || element.actionName === FccGlobalConstant.DOWNLOAD)
          {
            this.isDownloadAction = true;
        } else{
          this.isDownloadAction = false;
        }
         if(element.subActions !== undefined){
            this.subActions= element.subActions.split(',');
          }
          if (element.actionName === FccGlobalConstant.ADD_FAVOURITE || element.actionName === FccGlobalConstant.REMOVE_FAVOURITE) {
            this.markRecordAsFavorUnFav(rowData);
          } else if (element.actionName === FccGlobalConstant.ACTION_DEACTIVATE_BENEFICIARY) {
            this.beneficiaryStatus(rowData, FccGlobalConstant.SUSPEND, 'fcmBeneSuspend', 'fcmBeneNotSuspend', 'fcmBeneSuspendConfirmation')
          } else if (element.actionName === FccGlobalConstant.ACTION_SUSPEND_BENEFICIARY) {
            this.beneficiaryStatus(rowData, FccGlobalConstant.SUSPEND, 'fcmBeneSuspend', 'fcmBeneNotSuspend', 'fcmBeneSuspendConfirmation')
          } else if (element.actionName === FccGlobalConstant.ACTION_ACTIVATE_BENEFICIARY) {
            this.beneficiaryStatus(rowData, FccGlobalConstant.ENABLE, 'fcmBeneActivate', 'fcmBeneNotActivate', 'fcmBeneActivateConfirmation')
          } else if (element.actionName === 'DISCARD' && this.routeOption === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC) {
            this.beneDiscard(rowData);
          } else if (element.actionName === 'DISCARD') {
            this.paymentDiscard(rowData, element.actionName);
          } else if (element.actionName === 'SEND_REMINDER') {
            this.paymentSendReminder(rowData);
          } else if (actionName === 'SEND_BENE_REMINDER') {
            this.beneReminderPopup(rowData);
          } else if (actionName === 'BENE_APPROVE') {
            this.doBeneficiaryApproveFCM(rowData);
          } else if (actionName === 'BENE_REJECT') {
            this.onClickBeneReject(rowData, actionName);
          }
          else if (element.actionName === 'verify') {
            this.onClickVerify(rowData, actionName);
          } else if(element.actionName === 'VERIFY'){
            this.onClickBatchInstrumentVerify(rowData, actionName);
          } else if ((element.actionName === 'REJECT' && rowData.batchStatus === FccGlobalConstant.PENDINGMYVERIFICATION) ||
          element.actionName === 'BATCH_INSTRUMENT_REJECT' || element.actionName === 'BATCH_INSTRUMENT_SCRAP') {
            this.onClickVerifyReject(rowData, actionName);
          } else if (element.actionName === 'REJECT' && rowData.batchStatus !== FccGlobalConstant.PENDINGMYVERIFICATION){
            this.onClickCheckerReject(rowData, 'CHECKER_REJECT');
          } else if(element.actionName === 'BATCH_INSTRUMENT_APPROVE'){
            this.approveBatchInstrument(rowData, actionName);
          } else if(element.actionName === 'BATCH_INSTRUMENT_SEND'){
            this.sendBatchInstrument(rowData, actionName);
          } else if(element.actionName === 'APPROVE'){
            this.approvePayment(rowData, actionName);
          } else if(element.actionName === 'VERIFY_REJECT'){
            this.onClickBatchInstrumentVerifyReject(rowData, actionName);
          } else if (element.actionName === 'submit') {
            if(this.isConfidentialAllowed(rowData, element.actionName)){
              this.onClickSubmit(rowData, actionName);
            }
          } else if (element.httpMethod && element.httpMethod.toUpperCase() === FccConstants.POST) {
          } else if (element.actionName === FccGlobalConstant.SEND) {
            this.onClickSend(rowData);
          } else if (element.actionName === FccGlobalConstant.SCRAP) {
            this.onClickScrap(rowData, actionName);
          } else if (actionName === FccGlobalConstant.DISCARD_INSTRUMENT) {
            if (this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION) === FCMPaymentsConstants.MODIFY_BATCH){
             this.discardBatchInstrument(rowData)
          }
          }else if (element.actionName === FccConstants.BATCH_DETAILS
            || element.actionName === FccConstants.VIEW_SEND
            || element.actionName === FccConstants.VIEW_AUTH) {
            this.onClickFCMBatchdetails(url, rowData);
          }else if (element.actionName === FccConstants.VIEWDETAILS) {
            this.onClickViewAccountDetails(url, rowData);
          } else if (element.actionName === 'VIEWSTATEMENT') {
            this.onClickViewAccountDetails(url, rowData);
          } else if (element.actionName === FccConstants.ADDITIONAL_DETAILS) {
            this.handlePopUp(rowData, actionName);
          } else if (element.httpMethod && element.httpMethod.toUpperCase() === FccConstants.POST) {
            this.commonService.generateToken().subscribe(response => {
              if (response) {
                const ssoToken = response.SSOTOKEN;
                const queryParameter = element.queryParameter;
                const headerType = element.headerParameters as string;
                if (headerType.toUpperCase() === FccConstants.HEADER && queryParameter) {
                  const headerObject = {
                    [queryParameter]: ssoToken
                  };
                  const headers = new HttpHeaders(headerObject);
                  return this.http.post<any>(element.url, element.bodyParameters, { headers });
                } else if (element.headerParameters === 'url' && queryParameter) {
                  const finalUrl = element.url + '?' + queryParameter + '=' + ssoToken;
                  return this.http.post<any>(finalUrl, element.bodyParameters);
                }
              }
            });
          }
          else if (urlType === FccGlobalConstant.INTERNAL && this.commonService.isNonEmptyValue(urlScreenType)
            && urlScreenType !== '') {
            const urlScreenTypeString = urlScreenType as string;
            if (urlScreenTypeString.toUpperCase() === FccGlobalConstant.ANGULAR_UPPER_CASE) {
              if(this.isConfidentialAllowed(rowData, element.actionName)) {
                if(rowData.isBatchPayment === "true"){
                    this.commonService.setSummaryDetails(rowData);
                    localStorage.setItem(FccGlobalConstant.MODIFY_BATCH, FccGlobalConstant.STRING_TRUE);
                    if (this.commonService.isnonEMptyString(rowData['pageUrl'])) {
                      localStorage.setItem('identifyPage', rowData['pageUrl']);
                    }
                    this.router.navigate([]).then(result => {
                    window.open(element.alternateUrlLink, FccGlobalConstant.SELF);
                  });
                } else {
                  this.commonService.setSummaryDetails(rowData);
                  if (actionName === FccGlobalConstant.ACTION_MAKE_PAYMENT) {
                    this.commonService.actionName = 'MAKE_PAYMENT';
                  }
                  if (this.commonService.isnonEMptyString(url)){
                    this.router.navigate([]).then(result => {
                      window.open(url, FccGlobalConstant.SELF);
                    });
                  }
                }
              }
            } else {
              const urlContext = this.commonService.getContextPath();
              const dojoUrl = urlContext + this.fccGlobalConstantService.servletName + url;
              window.open(dojoUrl, FccGlobalConstant.SELF);
            }
          }
          else if (urlType === FccGlobalConstant.EXTERNAL) {
            if (element.securityType === FccGlobalConstant.SSO) {
              this.commonService.generateToken().subscribe(response => {
                if (response) {
                  const ssoToken = response.SSOTOKEN;
                  const queryParameter = element.queryParameter;
                  const headerObject = {
                    [queryParameter]: ssoToken
                  };
                  const headers = new HttpHeaders(headerObject);
                  this.http.get<any>(url, { headers }).subscribe(() => {
                    window.open(url, FccGlobalConstant.BLANK);
                  },
                    (error) => {
                      window.open(url, FccGlobalConstant.BLANK);
                    }
                  );
                }
              });
            } else {
              this.externalUrlLink = url;
              this.displayDialog = true;
            }
          } else if (urlType === FccGlobalConstant.IFRAME) {
            if (element.securityType === FccGlobalConstant.SSO) {
              this.commonService.iframeURL = url;
              this.commonService.deepLinkingQueryParameter = element.queryParameter;
              this.router.navigate(['/sso-deeplink-url']);
            } else {
              this.commonService.iframeURL = url;
              this.router.navigate(['/iframe']);
            }
          }
        }
      });
    }
  }

  isConfidentialAllowed(rowData,action){
    let flag = true;
    if(rowData?.isConfidentialPayment === 'true'){
      let errorMessage = ''
      switch (action) {
        case 'EDIT':
          errorMessage = 'editError';
          flag = false;
          break;
        case 'UPDATE':
          errorMessage = 'updateError';
          flag = false;
          break;
        case 'submit':
          errorMessage = 'submitError';
          flag = false;
          break;
      }
      this.commonService.showToasterMessage({
        life : 5000,
        key: 'tc',
        severity: 'error',
        summary:this.translate.instant('error'),
        detail:this.translate.instant(errorMessage)
      });
    }
    return flag;
  }

  beneReminder(rowData) {
    let headerField;
    let message;
    headerField = `${this.translate.instant('sendRemainderBeneHeader')}`;
    message = `${this.translate.instant('sendReminderBeneBody')}`;
    const direction = 'direction';
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: message ,
        showNoButton: false,
        showYesButton: false,
        showCancelButtonTertiary: true,
        showSendReminderButtonPrimary: true
      }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.sendBeneReminder(rowData);
      }
    });
  }

  beneDiscard(rowData) {
    let headerField;
    let message;
    headerField = `${this.translate.instant('deleteBeneficiary')}`;
    message = `${this.translate.instant('discardbeneTransaction')}`;
    const direction = 'direction';
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
        this.continueDeleteForBene(rowData);
      }
    });
  }

  continueDeleteForBene(rowData) {
    this.startLoadingSpinner();
    this.commonService.beneDiscard(rowData['bankAccount@associationId']).subscribe(_res => {
      this.stopLoadingSpinner();

      this.commonService.showToasterMessage({
        life: 5000,
        key: 'tc',
        severity: 'success',
        summary:  `${this.translate.instant('success')}`,
        detail: this.translate.instant('singleBeneDiscardToasterMessage', { beneficiary: rowData['bankAccount@associationId'] })
      });
      this.refreshList.emit();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    },(response) =>{
      this.stopLoadingSpinner();
      this.showErrorToaster(response?.error?.errors[0].description, rowData);
    });
  }

  paymentDiscard(rowData, action) {
    this.deleterowObject = [];
    this.deleterowObject.push(event, rowData);
    let headerField;
    let message;
    if(rowData.isBatchPayment.toLowerCase() == 'true'){
      headerField = `${this.translate.instant('discardBatch')}`;
    }else{
      headerField = `${this.translate.instant('discardTransaction')}`;
    }
    message = `${this.translate.instant('discardPaymentTransaction')}`;
    const direction = 'direction';
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: message,
        showNoButton: false,
        showYesButton: false,
        showNoButtonTertiary: true,
        showYesButtonPrimary: true
       }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.continueDeleteForPayments(rowData.paymentReferenceNumber, action, rowData.isBatchPayment);
      }
    });

  }

  getDigit(amount: any): string {
    const lang = localStorage.getItem(FccGlobalConstant.LANGUAGE);
    if (amount.toString().indexOf('.') > -1 && (lang === FccGlobalConstant.LANGUAGE_EN || lang === FccGlobalConstant.LANGUAGE_US)) {
      const digit = (amount.toString().split('.')[0]).trim();
      return digit;
    }
    return amount.toString();
  }

  getDecimal(amount: any): string {
    const lang = localStorage.getItem(FccGlobalConstant.LANGUAGE);
    if (amount.toString().indexOf('.') > -1 && (lang === FccGlobalConstant.LANGUAGE_EN || lang === FccGlobalConstant.LANGUAGE_US)) {
      const decimal= (amount.toString().split('.')[1]).trim();
      return '.'.concat(decimal);
    }
    return '';
  }

  checkAmountField(field: any): boolean {
    const fields = ['clientTotalAmount', 'packageTotalAmount', 'instructedAmountCurrencyOfTransfer2@amount', 'controlSum'];
    return fields.indexOf(field) > -1 ? true : false;
  }

  paymentSendReminder(rowData) {
    const headerField = `${this.translate.instant('SEND_REMINDER')}`;
    const message =  `${this.translate.instant('sendReminderPaymentTransaction')}`;
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: message,
        showNoButton: false,
        showYesButton: false,
        showCancelButtonTertiary: true,
        showSendReminderButtonPrimary: true
       }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.continueSendReminderForPayments(rowData.paymentReferenceNumber, rowData.batchStatus);
      }
    });

  }

  onClickVerify(rowData, actionName) {
    this.startLoadingSpinner();
    this.commonService.paymentSingleInstrumentVerifyFCM(rowData.paymentReferenceNumber, FccGlobalConstant.VERIFY, '').subscribe((res) => {
      this.stopLoadingSpinner();
      const tosterObj = {
        life: 5000,
        key: 'tc',
        severity: 'success',
        summary: `${this.translate.instant('success')}`,
        detail: this.translate.instant('verifyToasterMessage', { paymentReferenceNumber: rowData.paymentReferenceNumber })
      };
      this.messageService.add(tosterObj);
      this.refreshList.emit();
    }, (_err) => {
      this.stopLoadingSpinner();
      let errorMessage = '';
        if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
          errorMessage = 'failedApiErrorMsg';
        } else {
          errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
        }
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errorMessage)
        });
    })
  }

  onClickVerifyReject(rowData, actionName) {
    const dir = localStorage.getItem('langDir');
    this.dialogService.open(PaymentTansactionPopupComponent, {
      header: this.translate.instant('rejectTransactionHeader'),
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: {
        rowData,
        actionName
      }
    });
  }

  onClickCheckerReject(rowData, actionName) {
    const dir = localStorage.getItem('langDir');
    this.dialogService.open(PaymentTansactionPopupComponent, {
      header: this.translate.instant('rejectTransactionHeader'),
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: {
        rowData,
        actionName
      }
    });
  }

  onClickBeneReject(rowData, actionName) {
    const dir = localStorage.getItem('langDir');
    this.dialogService.open(PaymentTansactionPopupComponent, {
      header: this.translate.instant('rejectTransactionHeader'),
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: {
        rowData,
        actionName
      }
    });
  }
  onClickBatchInstrumentVerifyReject(rowData, actionName){
    const dir = localStorage.getItem('langDir');
    this.dialogService.open(PaymentTansactionPopupComponent, {
      header: this.translate.instant('rejectTransactionHeader'),
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: {
        rowData,
        actionName
      }
    });
  }

  onClickBatchInstrumentVerify(rowData, actionName){
    let headerField;
    let message;
    headerField = `${this.translate.instant('verifyTransaction')}`;
    message = `${this.translate.instant('verifyTransactionMsgThreeDot')}`;
    const direction = 'direction';
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
        this.verifyBatchInstrument(rowData, FccGlobalConstant.VERIFY);
      }
    });
  }

  verifyBatchInstrument(rowData, actionName){
    this.startLoadingSpinner();
    this.commonService.paymentInstrumentVerifyFCM(this.commonService.batchRefNumber,
      actionName,rowData.instrumentPaymentReference,
       '').subscribe(() => {
        this.stopLoadingSpinner();
     const tosterObj = {
       life : 5000,
       key: 'tc',
       severity: 'success',
       summary: `${this.translate.instant('success')}`,
       detail: `${this.translate.instant('verifyInstrumentToasterMessage')}`
     };
     this.messageService.add(tosterObj);
      this.commonService.refreshTable.next(true);
      this.resolverService.updateBatchStatus(this.commonService.batchRefNumber);
     this.dialogRef.close();
   }, (_err) => {
    this.stopLoadingSpinner();
    let errorMessage = '';
    if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
      errorMessage = 'failedApiErrorMsg';
    } else {
      errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
    }
    this.commonService.showToasterMessage({
      life : 5000,
      key: 'tc',
      severity: 'error',
      summary:this.translate.instant('error'),
      detail:this.translate.instant(errorMessage)
    });
     this.dialogRef.close();
   });
  }

  onClickSubmit(rowData, actionName) {
    this.startLoadingSpinner();
    let iKey = sessionStorage.getItem(FccGlobalConstant.idempotencyKey);
    if (this.commonService.isEmptyValue(iKey)) {
      iKey = this.fccGlobalConstantService.generateUUIDUsingTime();
      sessionStorage.setItem(FccGlobalConstant.idempotencyKey, iKey);
    }
    this.paymentService.submitBatchPayment(rowData.paymentReferenceNumber,iKey)
        .subscribe(_res => {
          this.stopLoadingSpinner();
          sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary: `${this.translate.instant('success')}`,
            detail: this.translate.instant('singleSubmitToasterMessage', { paymentReferenceNumber: rowData.paymentReferenceNumber })
          });
          this.refreshList.emit();
        }, _err => {
          this.stopLoadingSpinner();
          let errMsg = '';
          if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
            errMsg = 'failedApiErrorMsg';
          } else {
            errMsg = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
          }
          sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'error',
            summary: 'Error',
            detail: this.translateService.instant(errMsg)
          });
        });
  }

  discardBatchInstrument(rowData) {
    this.deleterowObject = [];
    this.deleterowObject.push(event, rowData);
    let headerField;
    let message;
    headerField = `${this.translate.instant('discardTransaction')}`;
    message = `${this.translate.instant('discardPaymentTransaction')}`;
    const direction = 'direction';
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: message,
        showNoButton: false,
        showYesButton: false,
        showNoButtonTertiary: true,
        showYesButtonPrimary: true
       }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        let paymentReferenceNumber = this.commonService.getQueryParametersFromKey('paymentReferenceNumber');
        const req = { paymentReferenceNumber : paymentReferenceNumber, pageSize: 10, first: 0 };
        this.commonService.getPaymentDetails(req).subscribe(response => {
        this.paymentInstrumentDiscard(paymentReferenceNumber, rowData.instrumentPaymentReference,'', rowData.index);
        response['data']['paymentDetail'].forEach(ele => {
          if (parseInt(ele.instrumentPaymentReference) === parseInt(rowData.instrumentPaymentReference)) {
            const index = ele.index;
            this.commonService.counterTransaction.splice(index, 1);
          }
        });
      });
    }});


  }



  paymentInstrumentDiscard(paymentReferenceNumber, instrumentRefNumber, comment, index) {
    this.startLoadingSpinner();
    this.commonService.paymentInstrumentDiscard(paymentReferenceNumber, FccGlobalConstant.ACTION_DISCARD, instrumentRefNumber, comment)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .subscribe(_res => {
        this.stopLoadingSpinner();
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translate.instant('success')}`,
          detail: `${this.translateService.instant('singleDiscardToasterMessage')}`
        });
        this.refreshTableData.emit();
        this.commonService.batchDiscardInstrument.next(index);
      }, _err => {
        this.stopLoadingSpinner();
        let errMsg = '';
        try {
          errMsg = _err.error?.detail?_err.error.detail:'failedApiErrorMsg';
        } catch (err) {
          errMsg = _err.error.detail;
        }
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'error',
          summary: 'Error',
          detail: this.translateService.instant(errMsg)
        });
      });
  }
  continueDeleteForPayments(paymentReferenceNumber, action, isBatchPayment) {
    let errMsg: string;
    const comment = '';
    if(isBatchPayment.toLowerCase() == 'true'){
      this.fcmBatchPaymentAction(paymentReferenceNumber, action, comment);
    }else{
      this.startLoadingSpinner();
      this.commonService.paymentDiscard(paymentReferenceNumber, action, comment)
        .subscribe(_res => {
          this.stopLoadingSpinner();

          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary: `${this.translate.instant('success')}`,
            detail: `${this.translate.instant('singleDiscardToasterMessage')}`
          });
          this.refreshList.emit();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }, _err => {
          this.stopLoadingSpinner();
          let errMsg = '';
          try {
            errMsg = _err.error.detail;
          } catch (err) {
            errMsg = _err.error.detail;
          }
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'error',
            summary: 'Error',
            detail: this.translate.instant(errMsg)
          });
        });
    }
    setTimeout(() => {
      this.deleterowstatus = false;
    }, FccGlobalConstant.LENGTH_2000);

  }


  continueSendReminderForPayments(paymentReferenceNumber, batchStatus) {
    this.startLoadingSpinner();
    let alertCode = '';
    if(batchStatus === FccGlobalConstant.PENDINGAPPROVAL){
      alertCode = 'CW_TXN_PENDING_AUTH';
    } else if(batchStatus === FccGlobalConstant.PENDING_VERIFICATION){
      alertCode = 'CW_TXN_PENDING_VERIF';
    }
    this.commonService.paymentSendReminder(paymentReferenceNumber, alertCode)
      .subscribe(_res => {
        this.stopLoadingSpinner();
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translate.instant('success')}`,
          detail: `${this.translate.instant('sendReminderSuccessMessage')}`
        });
        this.refreshList.emit();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }, _err => {
        this.stopLoadingSpinner();
        let errorMessage = '';
        if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
          errorMessage = 'failedApiErrorMsg';
        } else {
          errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
        }
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errorMessage)
        });
      });
      setTimeout(() => {
        this.deleterowstatus = false;
      }, FccGlobalConstant.LENGTH_2000);
  }

  fcmBatchPaymentAction(paymentReferenceNumber, action, comment){
    this.startLoadingSpinner();
    this.commonService.batchPaymentAction(paymentReferenceNumber, action, comment)
        .subscribe(_res => {
          this.stopLoadingSpinner();

          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary: `${this.translate.instant('success')}`,
            detail: this.translate.instant('batchDiscardToasterMessage', { paymentReferenceNumber: paymentReferenceNumber })
          });
          this.refreshList.emit();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }, _err => {
          this.stopLoadingSpinner();
          let errMsg = '';
          errMsg = _err.error?.detail?_err.error.detail:'failedApiErrorMsg';
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'error',
            summary: 'Error',
            detail: this.translate.instant(errMsg)
          });
        });
  }

  navigateToExternalUrl() {
    this.displayDialog = false;
    window.open(this.externalUrlLink, FccGlobalConstant.BLANK);
  }

  onClickReturn(event, rowData) {
    this.tableService.onClickReturn(event, rowData);
  }

  onClickAmend(event, rowData) {
    this.tableService.onClickAmend(event, rowData, this.option);
  }

  onClickAmendRelease(event, rowData) {
    this.tableService.onClickAmendRelease(event, rowData, this.option);
  }

  onClickSend(rowData) {
    this.startLoadingSpinner();
    if(rowData.isBatchPayment.toLowerCase() == 'true'){
      this.commonService.sendbatchPaymentAction(rowData.paymentReferenceNumber, FccGlobalConstant.SEND, '').subscribe((res) => {
        this.stopLoadingSpinner();
        const tosterObj = {
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translate.instant('success')}`,
          detail: `${this.translate.instant('sendToBankBatchToasterMessage', { refNo: rowData.paymentReferenceNumber })}`
        };
        this.messageService.add(tosterObj);
        this.refreshList.emit();
      }, (_err) => {
        this.stopLoadingSpinner();
        let errorMessage = '';
        if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
          errorMessage = 'failedApiErrorMsg';
        } else {
          errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
        }
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errorMessage)
        });
      })
    }
    else{
    this.commonService.performPaymentsApproveRejectFCM(rowData.paymentReferenceNumber, FccGlobalConstant.SEND, '').subscribe((res) => {
      const tosterObj = {
        life: 5000,
        key: 'tc',
        severity: 'success',
        summary: `${this.translate.instant('success')}`,
        detail: `${this.translate.instant('sendToBankToasterMessage', { refNo: rowData.paymentReferenceNumber })}`
      };
      this.messageService.add(tosterObj);
      this.refreshList.emit();
    }, (_err) => {
      let errorMessage = '';
        if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
          errorMessage = 'failedApiErrorMsg';
        } else {
          errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
        }
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errorMessage)
        });
    })
  }
  }

  onClickScrap(rowData, actionName) {
    const dir = localStorage.getItem('langDir');
    this.dialogService.open(PaymentTansactionPopupComponent, {
      header: this.translate.instant('scrapTransactionHeader'),
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: {
        rowData,
        actionName
      }
    });
  }

  onClickCopy(event, rowData) {
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams: {
        productCode: rowData.product_code,
        subProductCode: rowData.sub_product_code,
        tnxTypeCode: FccGlobalConstant.N002_NEW,
        refId: rowData.ref_id,
        option: 'EXISTING'
      },
    });
  }

  onClickDiscard(event, rowData) {
    this.tableService.onClickDiscard(event, rowData, this.option);
  }

  onClickMessage(event, rowData) {
    this.tableService.onClickMessage(event, rowData, this.option);
  }
  onClickDetail(event, rowData) {
    this.tableService.onClickDetail(event, rowData);
  }

  onClickRepay(event, rowData) {
    const tnxType = FccGlobalConstant.N002_INQUIRE;
    const optionValue = FccGlobalConstant.EXISTING_OPTION;
    const subTnxTypeCodeValue = FccGlobalConstant.REPAY_OPTION;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams: {
        refId: rowData.ref_id,
        productCode: rowData.product_code, subProductCode: rowData.sub_product_code,
        tnxTypeCode: tnxType, option: optionValue, subTnxTypeCode: subTnxTypeCodeValue
      }
    });
  }

  callHover(rowData?: any): any {
    this.commonService.rowSellistdefName = this.inputParams;
    if (this.rowExp !== undefined) {
      const callHoverStyle = {
        border: 1 + 'px' + ' solid' + ' #c137a2'
      };
      return callHoverStyle;
    } else if (rowData.originalGroupedValMap) {
      this.handleTitle(rowData.originalGroupedValMap);
    }
  }

  handleTitle(titleMap: any) {
    this.title.forEach((ele, i) => {
      const currTitle = ele.nativeElement.querySelector('div').querySelector('div').title;
      if (titleMap.get(currTitle)) {
        ele.nativeElement.querySelector('div').querySelector('div').title = titleMap.get(currTitle);
      }
    });
  }

  keyPressRoute(event, rowData, action) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      const fnName = `onClick${action}`;
      const fn = this[fnName];
      if (fn && (typeof fn === 'function')) {
        this[fnName](event, rowData);
      }
    }
  }

  keyPressRouteOptions(event, rowData, action, option) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      const fnName = `onClick${action}`;
      const fn = this[fnName];
      if (fn && (typeof fn === 'function')) {
        this[fnName](event, rowData, option);
      }
    }
  }

  keyPressOptions(event, menu) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      menu.toggle(event);
    }
  }

  matMenuClose(rowData){
    const anchorElement = document.querySelector('.cdk-overlay-container');
    anchorElement.classList.remove("cdk-overlay-container-threedots-popup");
    if(this.commonService.getQueryParameters()?.get('operation') === 'MODIFY_BATCH') {
      rowData.highlight = false;
    }
  }

  keyPressRouteDots(event) {

    const keycodeIs = event.which || event.keyCode;
    this.item.forEach(element => {
      if (element.label === event.target.innerText) {
        element.command();
      }
      let ele = document.getElementsByClassName('threeDotsMenu');
      if (ele && ele.length) {
        this.renderer.setStyle(document.getElementsByClassName('threeDotsMenu')[FccGlobalConstant.ZERO], 'display', 'none')
      }
    });
  }

  keyPressRouteURL(event, rowData, actionName) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirteen) {
      const fnName = `onClickAction`;
      const fn = this[fnName];
      if (fn && (typeof fn === 'function')) {
        this[fnName](event, rowData, actionName);
      }
    }
  }

  onClickEdit(event, rowData) {
    localStorage.removeItem('templPrevValue');
    this.tableService.onClickEdit(event, rowData);
  }

  onClickAcceptIP(event, rowData) {
    this.tableService.onClickAcceptIP(event, rowData);
  }

  onClickAcceptCN(event, rowData) {
    this.tableService.onClickAcceptCN(event, rowData);
  }

  onClickAcceptPOA(event, rowData) {
    this.tableService.onClickAcceptPOA(event, rowData);
  }

  onClickLendingEdit(event, rowData) {
    this.tableService.onClickLendingEdit(event, rowData);
  }

  onClickAssignment(event, rowData) {
    this.tableService.onClickAssignment(event, rowData, this.option);
  }

  onClickRemittanceLetter(event, rowData) {
    this.tableService.onClickRemittanceLetter(event, rowData, this.option);
  }

  onClickTransfer(event, rowData) {
    this.tableService.onClickTransfer(event, rowData, this.option);
  }

  getEditModeUrl() {
    for (this.index = 0; this.index < this.modeValue.length; this.index++) {
      if (this.modeValue[this.index].indexOf('option') === 0) {
        this.option = this.modeValue[this.index].split('=').pop();
      }
      if (this.modeValue[this.index].indexOf('productCode') > -1) {
        this.productCode = this.modeValue[this.index].split('=').pop();
      }
    }
  }

  onClickCorrespondence(event, rowData) {
    this.tableService.onClickCorrespondence(event, rowData);
  }

  onClickRequestSettlement(event, rowData) {
    this.tableService.onClickRequestSettlement(event, rowData);
  }


  onClickDiscrepant($event, rowData) {
    this.tableService.onClickDiscrepant($event, rowData);
  }

  onClickRollover($event, rowData) {
    this.commonService.selectedRows = [];
    this.commonService.selectedRows.push(rowData);
    const currentDateToValidate = this.utilityService.transformDateFormat(new Date());
    const dateRequestParams = this.commonService.requestToValidateDate(currentDateToValidate, rowData);
    const hasPendingTransaction = this.listService
      .checkPendingTransaction('/loan/listdef/customer/LN/checkPendingTransactionForRollover', rowData.ref_id);
    const getBusinessDate = this.commonService.getValidateBusinessDate(dateRequestParams);
    forkJoin([hasPendingTransaction, getBusinessDate]).subscribe(([pendingTransactionResponse, businessDateResponse]) => {
      if (businessDateResponse && businessDateResponse.adjustedLocalizedDate && rowData && rowData.repricing_date) {
        const adjustedDate = this.utilityService.transformddMMyyyytoDate(businessDateResponse.adjustedLocalizedDate);
        const selectedDate = this.utilityService.transformddMMyyyytoDate(rowData.repricing_date);
        if (pendingTransactionResponse && pendingTransactionResponse.count === 0) {
          const dir = localStorage.getItem('langDir');
          const locaKeyValue = `${this.translate.instant('cannotRepriceDueToPendingTransaction')}`;
          const pendingTransactionRef = this.dialogService.open(ConfirmationDialogComponent, {
            header: `${this.translate.instant('message')}`,
            width: '35em',
            styleClass: 'fileUploadClass',
            style: { direction: dir },
            data: {
              locaKey: locaKeyValue,
              showOkButton: true,
              showNoButton: false,
              showYesButton: false
            },
            baseZIndex: 10010,
            autoZIndex: true
          });
        } else if (this.utilityService.compareDateFields(adjustedDate, selectedDate)) {
          const dir = localStorage.getItem('langDir');
          const locaKeyValue = `${this.translate.instant('repriceDateLessThanSelectedDate')}` + businessDateResponse.adjustedLocalizedDate;
          const rolloverDialogRef = this.dialogService.open(ConfirmationDialogComponent, {
            header: `${this.translate.instant('message')}`,
            width: '35em',
            styleClass: 'fileUploadClass',
            style: { direction: dir },
            data: {
              locaKey: locaKeyValue,
              showOkButton: true,
              showNoButton: false,
              showYesButton: false
            },
            baseZIndex: 10010,
            autoZIndex: true
          });
        } else {
          this.getConfigDataForRollover(rowData, adjustedDate, selectedDate, pendingTransactionResponse);
        }
      }
    });
  }

  getConfigDataForRollover(rowData, adjustedDate, selectedDate, pendingTransactionResponse) {
    this.commonService.getConfiguredValues('CHECK_FACILITY_STATUS_ON_CLICK_ROLLOVER').subscribe(resp => {
      if (resp.response && resp.response === 'REST_API_SUCCESS') {
        if (resp.CHECK_FACILITY_STATUS_ON_CLICK_ROLLOVER === 'true') {
          this.listService
            .getFacilityDetail('/loan/listdef/customer/LN/getFacilityDetail',
              rowData.borrower_reference, rowData.bo_deal_id).subscribe(facResponse => {
                facResponse.rowDetails.forEach(facility => {
                  const filteredData = facility.index.filter(row => row.name === 'id'
                    && (this.commonService.decodeHtml(row.value) === rowData.bo_facility_id));
                  if (filteredData && filteredData.length > 0) {
                    const filteredStatusData = facility.index.filter(row => row.name === 'status');
                    if (filteredStatusData[0].value === FccGlobalConstant.expired) {
                      const dir = localStorage.getItem('langDir');
                      const locaKeyValue = this.translate.instant('rolloverErrorOnExpiredFacility');
                      const expiredFacDialog = this.dialogService.open(ConfirmationDialogComponent, {
                        header: `${this.translate.instant('message')}`,
                        width: '35em',
                        styleClass: 'fileUploadClass',
                        style: { direction: dir },
                      data: {
                          locaKey: locaKeyValue,
                          showOkButton: true,
                          showNoButton: false,
                          showYesButton: false
                        },
                        baseZIndex: 10010,
                        autoZIndex: true
                      });
                      expiredFacDialog.onClose.subscribe((result: any) => {
                      });
                    } else {
                      if ((!this.utilityService.compareDateFields(adjustedDate, selectedDate))
                        && pendingTransactionResponse && pendingTransactionResponse.count > 0) {
                        this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
                          queryParams: {
                            productCode: FccGlobalConstant.PRODUCT_BK,
                            subProductCode: FccGlobalConstant.SUB_PRODUCT_LNRPN,
                            mode: FccGlobalConstant.INITIATE,
                            option: FccGlobalConstant.BK_LOAN_REPRICING,
                            tnxTypeCode: FccGlobalConstant.N002_NEW
                          },
                        });
                      }
                    }
                  }
                });
              });
        } else {
          if ((!this.utilityService.compareDateFields(adjustedDate, selectedDate))
            && pendingTransactionResponse && pendingTransactionResponse.count > 0) {
            this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
              queryParams: {
                productCode: FccGlobalConstant.PRODUCT_BK,
                subProductCode: FccGlobalConstant.SUB_PRODUCT_LNRPN,
                mode: FccGlobalConstant.INITIATE,
                option: FccGlobalConstant.BK_LOAN_REPRICING,
                tnxTypeCode: FccGlobalConstant.N002_NEW
              },
            });
          }
        }
      }
    });
  }

  onClickRespond($event, rowData) {
    this.tableService.onClickRespond($event, rowData);
  }

  onClickDrawdown($event, rowData) {
    const tnxType = FccGlobalConstant.N002_NEW;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams: {
        productCode: FccGlobalConstant.PRODUCT_LN,
        tnxTypeCode: tnxType, mode: FccGlobalConstant.INITIATE, facilityid: rowData.id,
        swinglineAllowed: rowData.swinglineAllowed, drawdownAllowed: rowData.drawdownAllowed
      }
    });
  }

  textForDrawdown(rowData) {
    let drawdownText = '';
    if (rowData && rowData.dealName) {
      drawdownText = this.translate.instant('drawdown') + ' ' + this.translate.instant('on') + ' ' + rowData.dealName;
    } else if (rowData && rowData.name) {
      drawdownText = this.translate.instant('drawdown') + ' ' + this.translate.instant('on') + ' ' + rowData.name;
    }
    return drawdownText;
  }

  textForDetail(rowData) {
    let detailText = '';
    if (rowData && rowData.dealName) {
      detailText = this.translate.instant('Detail') + ' ' + this.translate.instant('of') + ' ' + rowData.dealName;
    } else if (rowData && rowData.name) {
      detailText = this.translate.instant('Detail') + ' ' + this.translate.instant('of') + ' ' + rowData.name;
    }
    return detailText;
  }

  onClickFacilityDetail($event, rowData) {
    const optionValue = FccGlobalConstant.FACILITYOVERVIEW_OPTION;
    const keys : any [] = Object.keys(sessionStorage);
    keys.forEach(key => {
      if(key.indexOf('lnFacility') >= 0) {
        sessionStorage.removeItem(key);
      }
    });
    this.router.navigate(['facilityOverView'], {
      queryParams: {
        productCode: FccGlobalConstant.PRODUCT_LN,
        facilityid: rowData.id, facilityName: rowData.name, dealName: rowData.dealName,
        status: rowData.status, option: optionValue, swinglineAllowed: rowData.swinglineAllowed,
        drawdownAllowed: rowData.drawdownAllowed
      }
    });
  }

  onClickDocumentEdit($event, rowData) {
    const optionValue = FccGlobalConstant.FACILITYOVERVIEW_OPTION;
    this.router.navigate(['productScreen'], {
      queryParams: {
        productCode: rowData.product_code,
        subProductCode: rowData.sub_product_code, tnxTypeCode: FccGlobalConstant.N002_NEW,
        mode: FccGlobalConstant.INITIATE, rowData: JSON.stringify(rowData)
      }
    });
  }

  onClickIncrease($event, rowData) {
    const tnxType = FccGlobalConstant.N002_AMEND;
    const mode = FccGlobalConstant.EXISTING_OPTION;
    const subTnxType = FccGlobalConstant.N003_INCREASE;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams:
      {
        productCode: rowData.product_code, subProductCode: rowData.sub_product_code, refId: rowData.ref_id,
        tnxTypeCode: tnxType, mode, subTnxTypeCode: subTnxType
      }
    });
  }

  onClickLoanPayment($event, rowData) {
    const tnxType = FccGlobalConstant.N002_INQUIRE;
    const subTnxTypeCode = FccGlobalConstant.N003_PAYMENT;
    const mode = FccGlobalConstant.EXISTING_OPTION;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams: {
        productCode: rowData.product_code, subProductCode: rowData.sub_product_code, refId: rowData.ref_id,
        tnxTypeCode: tnxType, mode, subTnxTypeCode
      }
    });
  }

  onClickSetEntity($event, rowData) {
    this.commonService.isSetEntityClicked(rowData);
  }

  onClickSetReference($event, rowData) {
    this.commonService.isSetReferenceClicked(rowData);
  }

  onClickCancel(event, rowData) {
    if (rowData.product_code === FccGlobalConstant.PRODUCT_TD) {
      this.onCancelTD(event, rowData);
    } else {
      this.tableService.onClickCancel(event, rowData);
    }
  }

  onClickDelete(event, rowData) {
    this.tableService.onClickDelete(event, rowData);
  }

  onClickUpdate(event, rowData) {
    this.tableService.onClickUpdate(event, rowData);
  }

  onCancelTD(event, rowData) {
    const productCode = rowData.product_code;
    const refId = rowData.ref_id;
    const tnxId = rowData.tnx_id;
    const subProductCode = rowData.sub_product_code;
    let headerField;
    let message;
    headerField = `${this.translate.instant('cancelTDTransaction')}`;
    message = `${this.translate.instant('cancelTDConfirmationMsg')}`;
    const direction = 'direction';
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
        this.continueDeleteTD(productCode, refId, tnxId, subProductCode);
      }
    });
  }

  continueDeleteTD(productCode, refId, tnxId, subProductCode) {
    let result: Observable<any>;
    result = this.commonService.deleteTD(refId, tnxId);
    result.subscribe(data => {
      if (data.messageKey === FccGlobalConstant.TD_DELETE_SUCCESS) {
        const tosterObj = {
          life: 5000,
          key: 'tc',
          severity: 'success',
          detail: `${this.translate.instant('singleCancelToasterMessage')}`
        };
        this.messageService.add(tosterObj);
        this.commonService.isResponse.next(true);
        setTimeout(() => {
        }, FccGlobalConstant.LENGTH_2000);

      }
    });
  }

  onClickUserAudit(event, rowData) {
    this.tnxId = null;
    this.changedetector.detectChanges();
    this.userAuditDialogObj.ref_id = rowData.ref_id;
    this.userAuditDialogObj.tnx_type_code = this.translate.instant('N002_' + rowData.tnx_type_code);
    this.tnxId = rowData.tnx_id;
    this.currRowindex = this.data.findIndex(element => JSON.stringify(element) === JSON.stringify(rowData));
  }

  onClickAccountStatementDownload(event, rowData) {
    const id = rowData.attachment_id;
    const fileName = rowData.statement_file_name;
    this.commonService.downloadAttachments(id).subscribe(
      response => {
        let fileType;
        if (response.type) {
          fileType = response.type;
        } else {
          fileType = 'application/octet-stream';
        }
        const newBlob = new Blob([response.body], { type: fileType });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob, fileName);
            return;
        }

        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = fileName;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        window.URL.revokeObjectURL(data);
        link.remove();
    });
  }

  onUserAuditDataLoad(event) {
    this.actionPanel.toggle(event, this.action.filter((ele, i) => this.currRowindex === i).pop().nativeElement);
  }

  onClickViewMoreAuditRecords() {
    this.displayUserAuditDialog = true;
    this.actionPanel.hide();
  }

  onClickFCMBatchdetails(urlLink, rowData) {
    this.resolverService.handleFcmBatchDetailsScreen(urlLink, rowData);
  }

  onClickViewAccountDetails(urlLink, rowData){
    this.resolverService.handleAccountDetailsScreen(urlLink, rowData);
  }

  /**
   * primeng table selects all rows per page only.
   * customizable selection is not yet available and in pipeline for future milestone feature request
   * TBU when the feature is available.
   * @see github.com/primefaces/primeng/issues/8139
   *
   * also a known bug issue in prime table component(master checkbox remains checked in next page) require primeng version upgrade.
   *
   * current behaviour,
   *  -  when headercheckbox is checked, emit selection and append to prev selection in parent component
   *  -  if unchecked, reset selection in parent component
   */
  onHeaderCheckboxToggle(event, tt) {

    if (this.displayInputSwitch && this.displayInputSwitch.display && !event.checked) {
      event[`selected`] = false;
      event[`fetchRecords`] = false;
      if (this.ptable._selection.length === 0) {
        event[`fetchRecords`] = true;
        this.disableHeaderCheckbox = true;
      }
      this.refreshTableData.emit();
    }
    this.selectAllCheckboxEvent.emit({
      checked: event.checked,
      selectedRows: tt.selection
    });
    if(event.checked){
      this.checkboxData = [];
      this.checkboxData.push(...tt.selection);
    }else{
      this.checkboxData = [];
    }
  }

  checkRowData() {
    return (this.data && this.data.length > 0) ? true : false;
  }

  getConvertedvalue(event) {
    this.globalFilterColList  = this.columns.filter(p=>{
      return p.field !== 'action';
    })
    if ((this.inputParams.option as string)?.toUpperCase() === 'TEMPLATE') {
      return event;
    }
    let headerArr = this.columns.map((item) => item.field);
    if (headerArr && headerArr.length && headerArr.includes(FccConstants.ACCOUNT_NO)) {
      return event;
    }
    let isEventKey = false;
    if (event.indexOf(',') > -1) {
      isEventKey = true;
    } else {
      const intNew = parseInt(event, 10);
      const eventArray = event.toString().split('');
      if (!isNaN(intNew) && (eventArray.includes('.') || eventArray.includes(','))) {
        const numparts = event.toString().split('.');
        numparts[0] = numparts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return numparts.join('.');
      } else {
        isEventKey = true;
      }
    }
    if (isEventKey) {
      return event;
    }
  }

  handleSwitchChange(event) {
    this.hideActionsShowCheckBox = event.checked;
    this.resetPaginator();
    if (event.checked) {
      this.switchListDef.emit(event);
    } else {
      this.resetTableFilters.emit(event);
    }
  }

  resetPaginator() {
    this.ptable._first = 0;
    this.ptable._rows = this.rows;
  }

  globalSearch(value) {
    if (value) {
      this.ptable.lazy = false;
    } else {
      setTimeout(() => {
        this.isLazyEnabled = true;
        this.ptable.lazy = this.isLazyEnabled;
        this.intialiseData();
      }, FccGlobalConstant.LENGTH_500);
    }
  }

  globalSearchBar() {
    if (this.wildsearchid.nativeElement.value) {
      this.ptable.lazy = false;
      this.globalSearch(this.wildsearchid.nativeElement.value);
    }
  }

  loadConfiguration() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        if (this.activatedRoute.snapshot.data[FccGlobalConstant.TITLE] === FccGlobalConstant.ACCOUNT_DETAILS_TITLE){
          this.allowedDownloadOptions = response.listDataDownloadOptionsIncludeMT940;
        } else {
          this.allowedDownloadOptions = response.listDataDownloadOptions;
        }
        this.maxColumnForPDFModePortrait = response.listDataPDFMaxColForPortraitMode;
        if(response.dateFormat && localStorage.getItem(FccGlobalConstant.LANGUAGE)){
          this.dateFormatForExcelDownload=response.dateFormat[localStorage.getItem(FccGlobalConstant.LANGUAGE)];
        } else {
          this.dateFormatForExcelDownload = response.listDataExcelDateFormat;
        }
          this.listDataDownloadLimit = response.listDataMaxRecordsDownload;
        this.accountStatementDownloadLimit = response.accountStatementPdfLimit;
        if (this.compService?.frozenColMaxLimit) {
          this.frozenColMaxLimit = this.compService.frozenColMaxLimit;
        } else {
          this.frozenColMaxLimit = response.freezeColumnMaxLimit;
        }
        this.favAccountList = response.favrouiteAccountTypes;
        this.enableCustomizeColWithoutPref = response.enableCustomizeColumn;
        this.totalFavBeneLimit = response.beneMaxFavLimit;
        this.noTopBeneString = this.translate.instant('noTopBene') + response.noTopBene + this.translate.instant('day') + this.translate.instant('regBene');
        this.topBeneText = this.translate.instant('topBeneFirst') + response.topBeneRecodslimit +
            this.translate.instant('topBeneMiddle') + response.noTopBene + this.translate.instant('topBeneLast');
        this.isBillReferenceEnabled = response.isBillReferenceEnabled;
        }
    });
    this.enableFilterPopup = this.compService?.enableFilterPopup;
  }

  markAsFavorUnFav(rowdata) {
    if (rowdata[FccGlobalConstant.FAVROUITE] === '' || rowdata[FccGlobalConstant.FAVROUITE] === FccGlobalConstant.CODE_N) {
      this.commonService.markAccountAsFav(rowdata.account_id).subscribe(response => {
        rowdata[FccGlobalConstant.FAVROUITE] = FccGlobalConstant.CODE_Y;
        this.favRow = true;
        const tosterObj = {
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary:  `${this.translate.instant('success')}`,
          detail: `${this.translate.instant('favAccAdded')}`
        };
        this.messageService.add(tosterObj);
      },(response) =>{
        this.showErrorToaster(response?.error?.errors[0].description, rowdata);
      });
    } else if (rowdata[FccGlobalConstant.FAVROUITE] === FccGlobalConstant.CODE_Y) {
      this.commonService.markAccountAsUnFav(rowdata.account_id).subscribe(response => {
        rowdata[FccGlobalConstant.FAVROUITE] = FccGlobalConstant.CODE_N;
        this.favRow = false;
        const tosterObj = {
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary:  `${this.translate.instant('success')}`,
          detail: `${this.translate.instant('favAccRemoved')}`
        };
        this.messageService.add(tosterObj);
      },(response) =>{
        this.showErrorToaster(response?.error?.errors[0].description, rowdata);
      });
    }
  }

  markRecordAsFavorUnFav(rowdata) {
    this.startLoadingSpinner();
    let associationId = '';
    let isFavorite = '';
    if (rowdata[FccGlobalConstant.ASSOCIATION_ID] && rowdata[FccGlobalConstant.FAVROUITE_ACCOUNT]) {
      isFavorite = rowdata[FccGlobalConstant.FAVROUITE_ACCOUNT];
      associationId = rowdata[FccGlobalConstant.ASSOCIATION_ID];
    }
    else {
      isFavorite = rowdata[FccGlobalConstant.STATIC_FAVOURITE_ACCOUNT];
      associationId = rowdata[FccGlobalConstant.ASSOCIATION_ID];
    }
    if (isFavorite.toLowerCase() == "false") {
      this.commonService.markBeneAccountPairAsFavUnFav(associationId, true).subscribe(response => {
        this.stopLoadingSpinner();
        isFavorite = "true";
        rowdata[FccGlobalConstant.FAVROUITE_ACCOUNT] = "true";
        const tosterObj = {
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary:  `${this.translate.instant('success')}`,
          detail: `${this.translate.instant('favBeneAdded')}`
        };
        this.messageService.add(tosterObj);
        setTimeout(() => {
          //eslint : no-empty-function
        }, FccGlobalConstant.LENGTH_2000);
        if (this.inputParams.tabName === 'TOP_BENEFICIARIES') {
          this.commonService.setTotalBeneFavCount(this.commonService.getTotalBeneFavCount() + 1);
          window.location.reload();
        } else {
          this.getTotalFavBeneCount();
        }
      },(response) =>{
        this.stopLoadingSpinner();
        this.showErrorToaster(response?.error?.errors[0].description, rowdata);
      });
    } else if (isFavorite.toLowerCase() == "true") {
      this.commonService.markBeneAccountPairAsFavUnFav(associationId, false).subscribe(response => {
        this.stopLoadingSpinner();
        isFavorite = "false";
        rowdata[FccGlobalConstant.FAVROUITE_ACCOUNT] = "false";
        const tosterObj = {
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary:  `${this.translate.instant('success')}`,
          detail: `${this.translate.instant('favBeneRemoved')}`
        };
        this.messageService.add(tosterObj);
        setTimeout(() => {
          //eslint : no-empty-function
        }, FccGlobalConstant.LENGTH_2000);
        if (this.inputParams.tabName === 'TOP_BENEFICIARIES') {
          this.commonService.setTotalBeneFavCount(this.commonService.getTotalBeneFavCount() - 1);
          window.location.reload();
        } else {
          this.getTotalFavBeneCount();
        }
      },(response) =>{
        this.stopLoadingSpinner();
        this.showErrorToaster(response?.error?.errors[0].description, rowdata);
      });
    }
  }

  beneficiaryStatus(rowdata, status, successToasterMsg, errorToasterMsg, popUpMessage) {
    this.startLoadingSpinner();
    let headerField = `${this.translate.instant('confirmation')}`;
    let message = `${this.translate.instant(popUpMessage)}`;
    let associationId = '';
    if (rowdata[FccGlobalConstant.ASSOCIATION_ID]) {
      associationId = rowdata[FccGlobalConstant.ASSOCIATION_ID];
    }
    else {
      associationId = rowdata[FccGlobalConstant.STATIC_ASSOCIATION_ID];
    }
    let beneficiaryId = '';
    if (rowdata[FccGlobalConstant.BENEFICIARY_ID])
    {
      beneficiaryId = rowdata[FccGlobalConstant.BENEFICIARY_ID];
    }
    if (status === FccGlobalConstant.SUSPEND) {
      this.commonService.setActiveTab = true;
      this.commonService.setActiveTabIndex = 1;
    }
    const direction = 'direction';
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
        this.commonService.beneficiaryStatus(associationId, status, beneficiaryId).subscribe(response => {
          if (response.status == 200) {
            this.stopLoadingSpinner();
            const tosterObj = {
              life: 5000,
              key: 'tc',
              severity: 'success',
              summary:  `${this.translate.instant('success')}`,
              detail: rowdata[FccGlobalConstant.BENEFICIARY_NAME] + ` ${this.translate.instant(successToasterMsg)}`
            };
            this.messageService.add(tosterObj);
            setTimeout(() => {
              //eslint : no-empty-function
            }, FccGlobalConstant.LENGTH_2000);
            this.refreshTableData.emit();
         }
        },(response) =>{
          this.stopLoadingSpinner();
          this.showErrorToaster(response?.error?.errors[0].description, rowdata);
        });
      }
    });
  }

  showErrorToaster(error, rowdata){
    const tosterObj = {
      life : 5000,
      key: 'tc',
      severity: 'error',
      summary: 'Error',
      detail: error ? rowdata[FccGlobalConstant.associationIdKey] + error : `${this.translate.instant('failedApiErrorMsg')}`
    };
    this.messageService.add(tosterObj);
    setTimeout(() => {
      //eslint : no-empty-function
    }, FccGlobalConstant.LENGTH_2000);
  }

  onClickDownloadOption(downloadOption: any) {
    this.selectedDownloadOption = downloadOption;
    if(!this.showSubMenu && downloadOption == 'CSV'){
      this.onClickSubMenuDownload(downloadOption);
    }else if(this.listDataDownloadWidgetDetails &&
      this.listDataDownloadWidgetDetails?.productCode === FccGlobalConstant.ACCOUNT_STATEMENT_PRODUCT_CODE){
         this.onClickSubMenuDownload(FccConstants.FULL_DOWNLOAD);
    }
  }

  onClickSubMenuDownload(subOptionDownload: any) {
    this.selectedCol = [];
    const pdfData = this.commonService.isNonEmptyValue(this.filteredRowData) ? this.filteredRowData : this.data;
    const setDownloadOption = this.selectedDownloadOption + FccConstants.STRING_UNDERSCORE + subOptionDownload;
    if (this.inputParams && this.inputParams.totalRecords) {
      this.listDataDownloadWidgetDetails.totalRecords = this.inputParams.totalRecords;
      this.listDataDownloadWidgetDetails.exportFileName = this.inputParams.exportFileName;
    }
    if (this.inputParams !== undefined && this.inputParams.preferenceData !== undefined &&
      this.inputParams.preferenceData.columns.length > 0 && this.inputParams.preferenceName && this.inputParams.preferenceName !== '') {
      this.inputParams.preferenceData.columns.filter(el => el.showAsDefault).forEach(val => this.selectedCol.push(val));
      if (this.columns.length > 0 && this.selectedCol.length > 0) {
        this.selectedCol = this.columns.filter(el => this.selectedCol.find(element => element.field === el.field));
      }
      this.listDataDownloadService.checkListDataDownloadOption(setDownloadOption, this.selectedCol, pdfData,
        this.listDataDownloadWidgetDetails, this.maxColumnForPDFModePortrait, this.dateFormatForExcelDownload, this.listDataDownloadLimit,this.fileConfigData);
    } else if(this.listDataDownloadWidgetDetails && this.listDataDownloadWidgetDetails?.productCode === FccGlobalConstant.ACCOUNT_STATEMENT_PRODUCT_CODE
      && subOptionDownload == 'CSV') {
      this.accounStatementDownloadService.checkListDataDownloadOption(subOptionDownload, this.columns, pdfData,
        this.listDataDownloadWidgetDetails, this.maxColumnForPDFModePortrait, this.dateFormatForExcelDownload, this.listDataDownloadLimit,this.fileConfigData);
    }
    else {
      let columnTemp = this.columns;
      this.listDataDownloadService.checkListDataDownloadOption(setDownloadOption, this.columns, pdfData,
        this.listDataDownloadWidgetDetails, this.maxColumnForPDFModePortrait, this.dateFormatForExcelDownload, this.listDataDownloadLimit,this.fileConfigData,this.accountStatementDownloadLimit);
      this.columns = columnTemp;
    }
    if (subOptionDownload === this.fullListDataDownload) {
      const tosterObj = {
        life: 5000,
        key: 'tc',
        severity: 'warn',
        summary: `${ this.translate.instant('disclaimerToasterMessage') }`,
        detail: `${ this.translate.instant('fullDownloadToasterMessager', { listDataDownloadLimit: this.listDataDownloadLimit } ) }`
      };
      this.messageService.add(tosterObj);
   }
  }

  /* Below method sets the allowColumnCustomization attribute which in turn decides
  whether to enable column customization overlay or not*/
  setAllowColumnCustomization() {
    if (this.compService.allowColumnCustomization === 'false') {
      this.allowColumnCustomization = false;
    } else if (this.compService.allowColumnCustomization === 'true') {
      this.allowColumnCustomization = true;
    } else {
      this.allowColumnCustomization = this.compService.allowColumnCustomization;
    }
  }

  /* Below method sets the frozenColMaxLimit attribute which in turn decides
  how many columns can be freezed for the current listdef*/
  setFrozenColMaxLimit() {
    if (this.inputParams?.isDashboardWidget && this.compService?.frozenColMaxLimit) {
      this.frozenColMaxLimit = this.compService.frozenColMaxLimit;
    }
  }

  // Below method used to get the fav account type from portal.properties
  getFavrouiteAccount() {
    this.isFavAccount = false;
    const favAccountList = this.favAccountList;
    if (this.data && this.commonService.isNonEmptyValue(this.data[0]) && this.commonService.isnonEMptyString(this.data[0].account_type_code)) {
      const accountType = this.data[0].account_type_code;
      if (favAccountList) {
        favAccountList.forEach(propertyVal => {
          if (propertyVal === accountType) {
            this.isFavAccount = true;
          }
        });
      }
    }
  }


  // Below method sets the last frozen column index for listdef column list
  setLastFreezedColumnIndex() {
    if (this.columns && this.columns.length) {
      for (let index = 0; index < this.columns.length; index++) {
        if (!this.columns[index].frozen) {
          this.listdefLastFreezedColumnIndex = index < 0 ? null : index - 1;
          break;
        }
      }
    }
  }

  // Below method sets the last frozen column index for column customization overlay column list
  setLastFreezedColumnListIndex() {
    if (this.columnList && this.columnList.length) {
      for (let index = 0; index < this.columnList.length; index++) {
        if (!this.columnList[index].frozen) {
          this.overlayLastFreezedColumnIndex = index < 0 ? null : index - 1;
          break;
        }
      }
    }
  }

  /* Below method sets scrollable attribute which in turn is used to apply scrolling
  related css to the table elements*/
  setScrollable() {
    if (this.columns && this.columns.length) {
      this.columns.forEach(col => {
        if (col.width && col.width.indexOf(FccGlobalConstant.PERCENT) > -1) {
          col.width = col.width.replace(FccGlobalConstant.PERCENT, FccGlobalConstant.EM);
        }
      });
      this.scrollable = true;
    } else {
      this.scrollable = false;
    }
  }

  /* Below method is to display or hide column-filter icon based on column visibility
and if it is filterable
*/
enableColumnFilterIcon(): boolean {
  let isColumnFilterEnabled = false;
  if (!this.columns || this.columns.length === 0) {
    return false;
  }
  for (const col of this.columns) {
    if (!col.hidden && col.showAsDefault && col.columnFilterType && col.columnFilterType.trim() !== '') {
      isColumnFilterEnabled = true;
      break; // Exit the loop if at least one column is filterable
    }
  }
  if (!isColumnFilterEnabled) {
    this.showColumnFilterSec = false;
  }
  return isColumnFilterEnabled;
}

  allowRequestSettlement(rowData): boolean {
    return this.tableService.checkIsRequestSettlementAllowed(rowData);
  }


// Below method loads the column customization overlay list
loadTableColumns(event) {
  this.columnList = JSON.parse(JSON.stringify(this.columns));
  this.setLastFreezedColumnListIndex();
  this.isFrozenColMaxLimitReached = false;
  this.isSelectColMinLimitReached = false;
  this.createStaticTextObj();
  if (this.columnList.filter(col => col.showAsDefault).length === this.columnList.length) {
    this.isSelectAll = true;
  } else {
    this.isSelectAll = false;
  }
  if (this.inputParams.preferenceName){
    this.preferenceSelected = true;
  } else {
    if (!this.enableCustomizeColWithoutPref){
      this.preferenceSelected = false;
    }
    if (this.inputParams.preferenceName) {
      this.preferenceSelected = true;
    } else {
      if (!this.enableCustomizeColWithoutPref) {
        this.preferenceSelected = false;
      }

    }
  }
    this.columnCustomizationPanel.toggle(event);
    setTimeout(() => this.checkboxRef?.focus());
  }


  // Below method gets invoked on selection of a checkbox in column customization overlay
  onSelectColumn(event, index) {
    if (event) {
      this.isSelectAll = this.columnList.filter((t, i) => t.showAsDefault && i !== index).length === this.columnList.length - 1;
    } else {
      this.isSelectAll = false;
    }
    this.validateSelectedColMinLimit(event, index);
  }

  validateSelectedColMinLimit(event, index) {
    if (this.columnList.filter((col, i) => (i !== index && col.showAsDefault && col.field !== FccGlobalConstant.ACTION) ||
      (i === index && event)).length < FccGlobalConstant.LENGTH_3) {
      this.isSelectColMinLimitReached = true;
    } else {
      this.isSelectColMinLimitReached = false;
    }
  }

  // Below method gets invoked on selection of Select All checkbox in column customization overlay
  onSelectAll() {
    this.isSelectAll = !this.isSelectAll;
    if (!this.columnList) {
      return;
    }
    let selectedCount = 0;
    this.columnList.forEach(col => {
      if (!col.frozen) {
        col.showAsDefault = this.isSelectAll;
      }
      if (col.showAsDefault) {
        selectedCount++;
      }
    });
    if (selectedCount < FccGlobalConstant.LENGTH_3) {
      this.isSelectColMinLimitReached = true;
    } else {
      this.isSelectColMinLimitReached = false;
    }
  }

  openDialog(event) {
    const dialogRef = this.dialog.open(ColumnCustomizationComponent, {
      height: "auto",
      width: "36em",
      data: {
        params: this.inputParams,
        dataValue: this.columns,
        event: event,
        frozenColMaxLimit: this.frozenColMaxLimit
      },
    scrollStrategy: new NoopScrollStrategy()
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.columnList = result;
        this.saveAndUpdateColumnCustomizationData();
      }
    });
  }

  someSelected() {
    if (!this.columnList) {
      return false;
    }
    const selectedColCount = this.columnList.filter(t => t.showAsDefault).length;
    return selectedColCount < this.columnList.length && selectedColCount !== 0;
  }

  // Below method gets invoked on locking/freezing of a column in column customization overlay
  onLockClick(index, action) {
    this.setCurrentFrozenColLimit();
    if ((this.currentFrozenColLimit < this.frozenColMaxLimit) || (this.currentFrozenColLimit === this.frozenColMaxLimit && action === 'unfreeze')) {
      this.columnList[index].frozen = !this.columnList[index].frozen;
      this.columnList[index].showAsDefault = this.columnList[index].frozen ? true : this.columnList[index].showAsDefault;
      const colList = [...this.columnList.filter(col => col.frozen), ...this.columnList.filter(col => !col.frozen)];
      this.columnList = JSON.parse(JSON.stringify(colList));
      this.setLastFreezedColumnListIndex();
      this.isFrozenColMaxLimitReached = false;
      this.validateSelectedColMinLimit(true, index);
    } else {
      this.isFrozenColMaxLimitReached = true;
      this.staticTextFrozenObj[FccGlobalConstant.STATIC_TEXT_MESSAGE] = this.freezeValidationmessage;
    }
  }

  createStaticTextObj() {
    this.selectValidationmessage = `${this.translate.instant(FccGlobalConstant.MINIMUM_COLUMNS_SELECTED)}`;
    this.freezeValidationmessage = `${this.translate.instant(FccGlobalConstant.MAXIMUM_COLUMNS_FROZEN, { frozenColumns: this.frozenColMaxLimit })}`;
    this.staticTextSelectObj[FccGlobalConstant.STATIC_TEXT_MESSAGE] = this.selectValidationmessage;
    this.staticTextSelectObj[FccGlobalConstant.FONT_SIZE] = FccGlobalConstant.ZERO_DOT_EIGHTY_FIVE_EM;
    this.staticTextSelectObj[FccGlobalConstant.FONT_COLOR] = FccGlobalConstant.ERROR_MESSAGE_COLOR;
    this.staticTextSelectObj[FccGlobalConstant.POSITION] = FccGlobalConstant.RELATIVE_POSITION;
    this.staticTextSelectObj[FccGlobalConstant.WIDTH] = FccGlobalConstant.AUTO_WIDTH;
    this.staticTextFrozenObj = JSON.parse(JSON.stringify(this.staticTextSelectObj));
    this.staticTextFrozenObj[FccGlobalConstant.STATIC_TEXT_MESSAGE] = this.freezeValidationmessage;
  }

  setCurrentFrozenColLimit() {
    this.currentFrozenColLimit = this.columnList.filter(col => col.frozen).length;
  }

  // Below method gets invoked on dropping a column on reordering in column customization overlay
  drop(event: CdkDragDrop<string[]>) {
    if ((this.columnList[event.previousIndex].frozen && this.columnList[event.currentIndex].frozen) ||
      (!this.columnList[event.previousIndex].frozen && !this.columnList[event.currentIndex].frozen)) {
      // Below method changes the position of column selected for reordering in the column list
      moveItemInArray(this.columnList, event.previousIndex, event.currentIndex);
      this.columnList = JSON.parse(JSON.stringify(this.columnList));
      this.setLastFreezedColumnListIndex();
    }
  }

  // Below method gets invoked on press of Cancel button in column customization overlay
  onCancel() {
    this.columnList = JSON.parse(JSON.stringify(this.columns));
    this.colOverlayPanel.hide();
  }

  // Below method gets invoked on press of Apply button in column customization overlay
  onApply() {
    if (this.inputParams.isDashboardWidget) {
      this.columns = JSON.parse(JSON.stringify(this.columnList));
      this.colOverlayPanel.hide();
      this.setLastFreezedColumnIndex();
    } else if (this.inputParams.preferenceName && !this.enableCustomizeColWithoutPref) {
      this.modifyFilterPreferenceData();
    } else if (this.enableCustomizeColWithoutPref) {
      this.saveAndUpdateColumnCustomizationData();
    }
  }

  modifyFilterPreferenceData() {
    if (this.inputParams?.preferenceData) {
      this.inputParams.preferenceData.columns = JSON.parse(JSON.stringify(this.columnList));
      if (this.inputParams?.preferenceData?.columns && this.inputParams.preferenceData.columns.length) {
        this.inputParams.preferenceData.columns.forEach(pref => {
          pref.header = encodeURIComponent(pref.header);
        });
      }
      this.listService.modifyFilterDataPreference(this.inputParams.listdefName, this.inputParams.productCode, this.inputParams.preferenceName,
        this.inputParams.preferenceData, this.inputParams.subProductCode).subscribe(result => {
          if (result) {
            this.columns = JSON.parse(JSON.stringify(this.columnList));
            this.colOverlayPanel.hide();
            this.setLastFreezedColumnIndex();
          }
        });
    }
  }

saveAndUpdateColumnCustomizationData() {
   this.inputParams.preferenceData = {};
   const selectedTabName = (this.inputParams.activeTab !== undefined &&  this.inputParams.activeTab !== null) ?
                            this.inputParams.activeTab.localizationKey : '';
    this.inputParams.preferenceData.columns = JSON.parse(JSON.stringify(this.columnList));
    if (this.inputParams?.preferenceData?.columns && this.inputParams.preferenceData.columns.length) {
      this.inputParams.preferenceData.columns.forEach(pref => {
        pref.header = encodeURIComponent(pref.header);
      });
    }

      this.listService.saveAndUpdateColumnCustomization(this.inputParams.listdefName, this.inputParams.productCode,
      this.inputParams.preferenceData.columns, this.inputParams.subProductCode, this.inputParams.widgetName,
      this.inputParams.option, selectedTabName, this.updateColumnCustomizationMap.get(this.inputParams.listdefName)).subscribe(result => {
        if (result) {
          this.columns = JSON.parse(JSON.stringify(this.columnList));
          this.colOverlayPanel.hide();
          this.setLastFreezedColumnIndex();
          this.hasFilterableColumn = this.enableColumnFilterIcon();
        }
      });
  }


  // Below method calculates the dynamic width of a column based on dynamic list of frozen columns in listdef table
  calculateDynamicWidth(index, dir) {
    let currIndex = 0;
    let dynamicWidth = this.getLeftRightOnCheckBox() === 0?0 : parseFloat(FccGlobalConstant.CHECK_BOX_WIDTH);
    let emWidth;
    while (currIndex < index) {
      emWidth = this.columns[currIndex].width.indexOf(FccGlobalConstant.EM) > -1 ? this.columns[currIndex].width.slice(0
        , this.columns[currIndex].width.indexOf(FccGlobalConstant.EM)) : null;
      dynamicWidth += emWidth ? parseFloat(emWidth) : 0;
      currIndex++;
    }
    if (this.dir === 'ltr' && dir === 'left') {
      return emWidth ? dynamicWidth + FccGlobalConstant.EM : FccGlobalConstant.INITIAL;
    } else if (this.dir === 'rtl' && dir === 'right') {
      return emWidth ? dynamicWidth + FccGlobalConstant.EM : FccGlobalConstant.INITIAL;
    } else {
      return FccGlobalConstant.INITIAL;
    }
  }


  getLeftRightOnCheckBox(){
    if((this.permission && this.checkRowData() && (this.checkBoxRequired === 'Y'))
     || this.hideActionsShowCheckBox || this.approvalByTransaction){
      return FccGlobalConstant.CHECK_BOX_WIDTH + 'em';
    }
    return 0;
  }

  viewMore() {
    this.viewMoreClicked.emit(this.inputParams);
  }

  viewAllClickedfn() {
    if (this.inputParams.listdefName === FccGlobalConstant.BENE_APPROVAL_LISTDEF) {
    this.commonService.setActiveTab = true;
    this.commonService.setActiveTabIndex = 2;
    }

    this.viewAllClicked.emit(this.isViewAllClicked);
  }

  removeMenu(menu): any {
    setTimeout(() => { menu.hide(); },
      FccGlobalConstant.LENGTH_5000);
    (document.querySelector('.ellipisis:hover') as HTMLElement).style.visibility = 'hidden';
  }

  setActionColumn() {
    const isActionIconsRequired = this.inputParams.isActionIconsRequired === true ? true : false;
    if (this.columns && this.columns.length) {
      this.columns.forEach(element => {
        if (element.field === 'action' && (this.displayDashboard === false
          && this.inputParams.isDashboardWidget && !isActionIconsRequired)) {
          element.width = '0%';
          element.header = '';
        }
      });
    }
  }

  getDisableHeaderCheckbox() {
    if (this.displayInputSwitch && this.compService.displayInputSwitch.display && this.checkBoxAction === false) {
      this.disableHeaderCheckbox = this.compService.displayInputSwitch.disableHeaderCheckbox;
    }
  }

  get actionColumnName(): string {
    if (this.commonService.isNonEmptyValue(this.data) && this.commonService.isNonEmptyValue(this.data[0])) {
      const actionList: string[] = this.data[0].action ? this.data[0].action.split(',') : [];
      if (actionList.length > 1) {
        return this.translate.instant('ACTIONS');
      } else {
        return this.translate.instant('ACTION');
      }
    }
    return this.translate.instant('ACTION');
  }

  showColorCode = (rowData, col) => rowData['colorCode_' + col.field] ? true : false


  showAdditionalRemarks(rowData, col) {
    if (col.remarkApplicabilityList.split(',').includes(rowData[col.field])) {
      this.remarks = rowData[col.remarkValueColumn];
      if (this.remarks) {
        return true;
      } else {
        return false;
      }

    } else {
      return false;
    }
  }

  callAdvancedFilter(event) {
    this.advancedFilterEvent.emit(event);
  }

  addIdToPaginatorDropdown() {
    const allPaginator: any = Array.from(document.getElementsByTagName('p-paginator'));
    allPaginator.forEach((paginator) => {
      const dropdown: any = paginator.getElementsByTagName('p-dropdown')[0];
      if (dropdown) {
        const dropdownBtn = dropdown.getElementsByClassName('ui-dropdown-trigger')[0];
        dropdownBtn.setAttribute("id", "paginatorDropdown");
      }
    });
    this.commonService.showCommentDialog = false;
  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event:
    KeyboardEvent) {
    if (event) {
      this.colOverlayPanel.hide();
    }
    const menuItem = document.getElementsByClassName('threeDotsMenu');
    while (menuItem && menuItem.length > 0) {
      menuItem[0].parentNode.removeChild(menuItem[0]);
    }
    const downloadMenuItem = document.getElementsByClassName('downloadMatMainMenu');
    const downloadSubMenuItem = document.getElementsByClassName('downloadMatSubMenu');
    while (downloadMenuItem && downloadMenuItem.length > 0 && ((!downloadSubMenuItem) || (downloadSubMenuItem && downloadSubMenuItem.length === 0))) {
      downloadMenuItem[0].parentNode.removeChild(downloadMenuItem[0]);
    }
    if (this.actionPanel) {
      this.actionPanel.hide();
    }
  }

  getTotalFavBeneCount() {
    this.commonService.getFavBeneCount().subscribe(response => {
      this.totalFavBeneCount = response.body.data._meta.totalCount;
    });
  }
  @ViewChild(ShowDialogDirective) direc;
  handlePopUp(rowData, actionName) {
    if (actionName === FccGlobalConstant.VIEW_BENEFICIARY) {
      this.direc.openDialogFromAction(rowData, this.currentActionIndex, this.rows, this.showPopup, this.actionPopup, this.inputParams)
    } else if (actionName === FccGlobalConstant.VIEW_ADDITIONAL_INFO) {
      this.direc.openDialogFromAction(rowData, this.currentActionIndex, this.rows, this.showPopup, this.actionPopup, this.inputParams)
    } else if (actionName === FccConstants.ADDITIONAL_DETAILS) {
      this.direc.openDialogFromAction(rowData, this.currentActionIndex, this.rows, true, this.actionPopup, this.inputParams)
    }
    if (actionName === FccGlobalConstant.VIEW_PAYMENT_BULK) {
      this.direc.openBulkPaymentDialogFromAction(rowData, this.currentActionIndex, this.rows, this.showPopup, this.inputParams)
    }
    if (actionName === 'VIEW_BENE_BULK') {
      this.direc.openBulkBeneDialogFromAction(rowData, this.currentActionIndex, this.rows, this.showPopup, this.inputParams)
    }
  }

  approveBatchInstrument(rowData, actionName){
    this.startLoadingSpinner();
    this.commonService.paymentInstrumentApproveFCM(this.commonService.batchRefNumber, 'APPROVE', rowData.instrumentPaymentReference).subscribe(_res=>
      {
        this.stopLoadingSpinner();
      this.commonService.showToasterMessage({
        life : 5000,
        key: 'tc',
        severity: 'success',
        summary:  `${this.translate.instant('success')}`,
        detail: this.translate.instant('PAYMENTS_BATCH_APPROVAL_SUCCESS_MSG')
      });
      this.commonService.refreshTable.next(true);
      this.resolverService.updateBatchStatus(this.commonService.batchRefNumber);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _err=>{
      this.stopLoadingSpinner();
      let errorMessage = '';
      if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
        errorMessage = 'failedApiErrorMsg';
      } else {
        errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';

      }
      this.commonService.showToasterMessage({
        life : 5000,
        key: 'tc',
        severity: 'error',
        summary:this.translate.instant('error'),
        detail:this.translate.instant(errorMessage)
      });
    });
  }

  sendBatchInstrument(rowData, actionName){
    this.startLoadingSpinner();
    this.commonService.sendBatchInstrumentPaymentAction(this.commonService.batchRefNumber, FccGlobalConstant.SEND,
      rowData.instrumentPaymentReference, '').subscribe(_res=>
      {
        this.stopLoadingSpinner();
      this.commonService.showToasterMessage({
        life : 5000,
        key: 'tc',
        severity: 'success',
        summary:  `${this.translate.instant('success')}`,
        detail: this.translate.instant('PAYMENTS_BATCH_SEND_SUCCESS_MSG')
      });
      this.commonService.refreshTable.next(true);
      this.resolverService.updateBatchStatus(this.commonService.batchRefNumber);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _err=>{
      this.stopLoadingSpinner();
      let errorMessage = '';
      if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
        errorMessage = 'failedApiErrorMsg';
      } else {
        errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';

      }
      this.commonService.showToasterMessage({
        life : 5000,
        key: 'tc',
        severity: 'error',
        summary:this.translate.instant('error'),
        detail:this.translate.instant(errorMessage)
      });
    });
  }

  approvePayment(rowData, actionName){
    this.startLoadingSpinner();
    this.commonService.paymentCheckerApproveFCM(rowData.paymentReferenceNumber,
      FccGlobalConstant.multiTransactionEventType.APPROVE, '').subscribe(_res=>
      {
        this.stopLoadingSpinner();
      this.commonService.showToasterMessage({
        life : 5000,
        key: 'tc',
        severity: 'success',
        summary:  `${this.translate.instant('success')}`,
        detail: this.translate.instant('PAYMENTS_BATCH_APPROVAL_SUCCESS_MSG')
      });
      this.refreshList.emit();
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _err=>{
      this.stopLoadingSpinner();
      let errorMessage = '';
      if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
        errorMessage = 'failedApiErrorMsg';
      } else {
        errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';

      }
      this.commonService.showToasterMessage({
        life : 5000,
        key: 'tc',
        severity: 'error',
        summary:this.translate.instant('error'),
        detail:this.translate.instant(errorMessage)
      });
    });
  }

  handleScrollForRtl() {
    const scrollableTableHeader: HTMLElement = this.el.nativeElement.querySelector('.ui-table-scrollable-header');
    const scrollableTableBody: HTMLElement = this.el.nativeElement.querySelector('.ui-table-scrollable-body');
    this.zone.runOutsideAngular(() => {
      if (scrollableTableHeader && scrollableTableBody && this.dir === 'rtl') {
        this.scrollableTableBodyScroll = this.renderer.listen(scrollableTableBody, 'scroll', () => {
          scrollableTableHeader.scrollLeft = scrollableTableBody.scrollLeft;
        });
      }
    });
  }
  getScrollableFlag() {
    let flag = false;
    if (this.ptable && this.parentDivOfPtable) {
      if (this.parrentDivHeight < this.parentDivOfPtable.nativeElement.offsetHeight && !this.changed) {
        this.parrentDivHeight = this.parentDivOfPtable.nativeElement.offsetHeight;
        this.changed = true;
      }
      if (this.tableHeight < this.ptable.el.nativeElement.firstChild.offsetHeight) {
        this.tableHeight = this.ptable.el.nativeElement.firstChild.offsetHeight;
      }
      if (this.parrentDivHeight > this.tableHeight) {
        this.hideExtraSpace = true;
      } else {
        this.hideExtraSpace = false;
      }
     // flag = false;
      flag = this.ptable.el.nativeElement.firstChild.offsetHeight > this.parrentDivHeight - this.offSetMarginForScroll;
    }
    const div1: HTMLElement = this.el.nativeElement.querySelector('.ui-table-scrollable-body');
    const div2: any = document.getElementsByClassName('ui-table-wrapper')[0];
    const div = div1 ? div1 : div2;
    if (div) {
      const table: any = div.getElementsByTagName('table')[0];
      if (table.offsetHeight + FccGlobalConstant.LENGTH_100 < this.parrentDivHeight) {
        this.hideExtraSpace = true;
      } else {
        this.hideExtraSpace = false;
      }
    }

    if(this.isListingScreen) {
      flag = this.isListingScreen;
    }
    return flag;
  }
  scrollableTableBodyScroll: () => void;

  disableRow(rowData) {
    let status = rowData[FccGlobalConstant.BANK_BENE_STATUS];
    let instrumentStatus = rowData['instrumentstatus'];
    if (status === FccGlobalConstant.SUSPENDED) {
      return true;
    } else if (this.activatedRoute.snapshot.data[FccGlobalConstant.TITLE] === FccGlobalConstant.VIEW_CHEQUE_STATUS
      && instrumentStatus !== FccGlobalConstant.PENDINGMYVERIFICATION
      && instrumentStatus !== FccGlobalConstant.VERIFIED && instrumentStatus !== FccGlobalConstant.VERIFIER_REJECTED)
    {
      if(this.commonService.isnonEMptyString(this.commonService.selectedBatchInstrumentStatus) &&
      this.commonService.selectedBatchInstrumentStatus !== instrumentStatus){
        this.disableHeaderCheckbox = true;
        this.isDisabled = true;
      } else if(instrumentStatus === FccGlobalConstant.PENDINGMYAPPROVAL){
        if(this.commonService.getUserPermissionFlag(FccGlobalConstant.FCM_APPROVE_BATCH_INSTRUMENT_PERMISSION)){
          this.isDisabled = false;
        } else {
          this.disableHeaderCheckbox = true;
          this.isDisabled = true;
        }
      } else if(instrumentStatus === FccGlobalConstant.PENDINGSEND){
        if(this.resolverService.instrumentLevelConfigFlag){
          this.isDisabled = false;
        } else {
          this.isDisabled = true;
          this.disableHeaderCheckbox = true;
        }
      } else {
        this.disableHeaderCheckbox = true;
        this.isDisabled = true;
      }
      return false;
    } else if ((this.commonService.getSelectedBatchpaymentStatus() === FccGlobalConstant.PENDINGMYVERIFICATION
    || this.commonService.getSelectedBatchpaymentStatus() === FccGlobalConstant.PARTIALLYVERIFIED)
    && this.activatedRoute.snapshot.data[FccGlobalConstant.TITLE] !== FccGlobalConstant.VIEW_CHEQUE_STATUS) {
      if(rowData['batchStatus'] === FccGlobalConstant.VERIFIED)
      {
        this.disableHeaderCheckbox = true;
        this.isDisabled = true;
        return false;
      }
    } else if (this.commonService.getSelectedBatchpaymentStatus() === FccGlobalConstant.VERIFIED &&
    this.activatedRoute.snapshot.data[FccGlobalConstant.TITLE] !== FccGlobalConstant.VIEW_CHEQUE_STATUS){
      if(rowData['batchStatus'] === FccGlobalConstant.PENDINGMYVERIFICATION || rowData['batchStatus'] === FccGlobalConstant.PARTIALLYVERIFIED)
      {
        this.disableHeaderCheckbox = true;
        this.isDisabled = true;
        return false;
      }
    } else if (this.commonService.getSelectedBatchpaymentStatus() === null  &&
                this.activatedRoute.snapshot.data[FccGlobalConstant.TITLE] !== FccGlobalConstant.VIEW_CHEQUE_STATUS &&
        (rowData['batchStatus'] === FccGlobalConstant.VERIFIED || rowData['batchStatus'] === FccGlobalConstant.PENDINGMYVERIFICATION ||
            rowData['batchStatus'] === FccGlobalConstant.PARTIALLYVERIFIED)){
        this.disableHeaderCheckbox = true;
        this.isDisabled = false;
        return false;
    } else if (this.routeOption === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC &&
                this.inputParams.activeTab.actionCode === FccGlobalConstant.BENEFICIARY_PENDING_APPROVAL_ACTION_CODE &&
                rowData.makerName === this.commonService.loginUser){
        this.disableHeaderCheckbox = true;
        this.isDisabled = true;
        return false;
    }
    this.isDisabled = false;
    return false;
  }

  @ViewChild(ShowDialogDirective) directive;
  checkForEnter(event, rowData) {
    const keyCode = event.keyCode;
    let status = rowData[FccGlobalConstant.BANK_BENE_STATUS];
    if (keyCode === FccGlobalConstant.LENGTH_13 && this.commonService.getUserPermissionFlag(FccGlobalConstant.VIEW_BENE_PERMISSION)
      && status !== FccGlobalConstant.SUSPENDED && !this.enterOnThreeDots) {
      this.directive.openDialogFromAction(rowData, this.currentActionIndex, this.rows, this.showPopup, this.actionPopup, this.inputParams);
    }
    this.enterOnThreeDots = false;
  }

  checkForEnterOnAction(event, rowData) {
    this.enterOnThreeDots = true;
  }

  performSingleBeneficiaryApprFCM(element: any, rowData: any) {
    if (FccGlobalConstant.APPROVE_ELEMENT == element.label) {
      this.commonService.performBeneficiaryApproveRejectFCM(rowData[FccGlobalConstant.associationIdKey], FccGlobalConstant.multiTransactionEventType.APPROVE, "").subscribe(res => {
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary:  `${this.translate.instant('success')}`,
          detail: this.translate.instant('beneSingeApprovalSuccessMsg', { accountIdKey: rowData[FccGlobalConstant.accountIdKey] })
        });
        console.log(res);
      }, err => {
        let errMsg: string = '';
        try {
          errMsg = err.error.errors[0].description;
        } catch (err) {
          errMsg = '';
        }

        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'error',
          summary: this.translateService.instant('error'),
          detail: errMsg == '' ? this.translate.instant('beneSingleApprovalFailedMsg', { accountIdKey: rowData[FccGlobalConstant.accountIdKey] }) : errMsg
        });
        console.log(err);
      });

    }
  }

  showActionPopup(actionName, data): boolean {
    return ((actionName === FccGlobalConstant.VIEW_ADDITIONAL_INFO) || (actionName === FccGlobalConstant.VIEW_BENEFICIARY)) &&
      !(actionName === FccGlobalConstant.multiTransactionEventType.REJECT) && !(actionName === FccGlobalConstant.multiTransactionEventType.APPROVE);
  }
  navigateURL(eventUrl: any) {
    this.router.navigateByUrl(eventUrl);
  }
  sort(event) {
    this.columns.forEach(element => {
      if (element.field === event.sortField) {
        element.orderType = event.sortOrder === 1 ? FccGlobalConstant.ASC : FccGlobalConstant.DESC;
      } else {
        element.orderType = '';
      }
    });
    this.loadTableData(event, true);
    this.updateColumns.emit(this.columns);
  }

  setCurrentPage(event) {
    this.ptable.first = ((event.target.value - 1) * this.ptable.rows);
    this.ptable.firstChange.emit(this.ptable.first);
    this.ptable.onLazyLoad.emit(this.ptable.createLazyLoadMetadata());
    this.scrollToHeader()
  }

  onPageChange($event) {
    this.scrollToHeader();
  }

  scrollToHeader() {
    if(this.isListingScreen) {
      const tableHeaderNode: HTMLElement = document.querySelector('.options-body');
      const tableHeaderTop = tableHeaderNode.offsetTop || 0;
      const tableHeaderHeight = tableHeaderNode.offsetHeight || 0;
      const menubarNode: HTMLElement = document.querySelector('p-menubar');
      const menubarHeight = menubarNode.offsetHeight > FccGlobalConstant.LENGTH_50 ? FccGlobalConstant.LENGTH_50 : 0;
      window.scroll(0, (tableHeaderTop - (tableHeaderHeight + menubarHeight)));

    }
  }
  setPageSize(data) {
    this.ptable.reset();
    this.ptable._rows = data.pageSize;
    if(this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY) === FccConstants.FCM){
      this.ptable._first = 0;
    }
    this.ptable.onLazyLoad.emit(this.ptable.createLazyLoadMetadata());
    this.commonService.showCommentDialog = false;
    this.scrollToHeader();
  }
  updateLinksForNoRecord() {
    this.inputParams.noRecordsLinkMsg = FccGlobalConstant.FCM_CREATE_BENE_LINK_MSG;
    this.inputParams.noRecordsLink = FccGlobalConstant.FCM_CREATE_BENE_LINK;
  }
  displaySortIcon(field){
    const div = document.getElementById('customSort' + field);
    if (div){
      div.style.display = 'inline';
    }
  }
  hideSortIcon(field){
    const div = document.getElementById('customSort' + field);
    if (div){
      if (!div.classList.contains('applied-sort')) {
        div.style.display = 'none';
      }
    }
  }

  addfavBeneficiaries() {
    this.router.navigateByUrl('productListing?option=BENEFICIARY_MASTER_MAINTENANCE_MC&category=FCM');
  }

  getEventName(row, col) {
    if (row['product_code'] && (row['product_code'] === 'LN') && col.field !== 'product_code') {
      if (row['tnx_type_code'] && row['sub_tnx_type_code_val']) {
        const tnxTypeCode = row['tnx_type_code'];
        const subtnxTypeCode = row['sub_tnx_type_code_val'];
        if (tnxTypeCode === '03') {
          return "increase";
        } else if (tnxTypeCode === '13' && subtnxTypeCode === '16') {
          return "payment";
        } else if (tnxTypeCode === '01' && subtnxTypeCode === '97') {
          return "REPRICING";
        } else if (tnxTypeCode === '01' && subtnxTypeCode === 'B1') {
          return "N047_SWG";
        } else {
          return "N047_LNDR";
        }
      }
    } else if (row['product_code'] === 'BK' && col.field !== 'product_code' && row['sub_product_code'] === 'LNRPN') {
      return "REPRICING";
    } else if (row['product_code'] === 'BK' && col.field === 'product_code' && row['sub_product_code'] === 'LNRPN') {
      return col.codeId + "_" + row[col.field] + "_" + row['tnx_type_code'];
    } else {
      return col.codeId + "_" + row[col.field];
    }
  }

  onClickRemoveOrDeleteRejectedTnx(event, rowData, clickedOptn) {
    this.deleterowObject = [];
    this.deleterowObject.push(event, rowData);
    const productCode = rowData.product_code;
    const refId = rowData.ref_id;
    const tnxId = rowData.tnx_id;
    const subProductCode = rowData.sub_product_code;
    let headerField;
    let message;
    if (clickedOptn === FccGlobalConstant.REMOVE) {
      headerField = `${this.translate.instant('clearTransaction')}`;
      message = `${this.translate.instant('clearConfirmationMessage')}`;
    } else if (clickedOptn === FccGlobalConstant.DELETE) {
      headerField = `${this.translate.instant('deleteTransaction')}`;
      message = `${this.translate.instant('deleteConfirmationMessage')}`;
    }

    const direction = 'direction';
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
        this.continueRemoveOrDelete(rowData, productCode, refId, tnxId, subProductCode, clickedOptn);
      }
    });
  }
  async continueRemoveOrDelete(rowData, productCode, refId, tnxId, subProductCode, clickedOptn) {
    let result: Observable<any>;
    let successMsgClear = 'clearToasterMessage';
    let successMsgDelete = 'deleteToasterMessage';
    const boxRef = [];
    boxRef.push(rowData.box_ref);
    this.submissionRequest.listKeys = boxRef;
    if (clickedOptn === FccGlobalConstant.REMOVE) {
      await this.severalSubmitService.performSeveralRejectedMaintenance(this.submissionRequest, FccGlobalConstant.REMOVE, successMsgClear);
      this.refreshList.emit();
    } else if (clickedOptn === FccGlobalConstant.DELETE) {
      await this.severalSubmitService.performSeveralRejectedMaintenance(this.submissionRequest, FccGlobalConstant.DELETE, successMsgDelete);
      this.refreshList.emit();

    }
  }

  isMakerPersona() {
    return this.checkPermission(this.inputParams.noRecordsMakerPermission);
  }

  isCheckerPersona() {
    return this.checkPermission(this.inputParams.noRecordsCheckerPermission);
  }

  checkPermission(permissionList) {
    let isPermitted = false;
    if (permissionList && permissionList.length) {
      let permissions = permissionList.split(',');
      permissions.forEach(permission => {
        if (this.commonService.getUserPermissionFlag(permission)) {
          isPermitted = true;
        }
      });
    }
    return isPermitted;
  }

  addAccessibilityControl(): void {
    const titleBarCloseList = Array.from(document.getElementsByClassName('ui-dialog-titlebar-close'));
    titleBarCloseList.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant('close');
      element[FccGlobalConstant.TITLE] = this.translateService.instant('close');
    });
  }

  showUserAuditDialogHandler(): void {
    this.addAccessibilityControl();
  }

  getCurrencySymbol(curCode: string): string {
    return this.commonService.isnonEMptyString(curCode) ? getCurrencySymbol(curCode, 'narrow') : '';
  }
  beneAction(event: Event, rowData: any, button: any) {
    this.startLoadingSpinner();
    if (rowData != null && rowData.beneficiaryId != null) {
      this.beneWidgetAction(rowData, button,this.inputParams);
    } else {
      this.paymentWidgetAction(event, rowData, button, this.inputParams);
    }
  }
  updateViewMoreFlag() {
    let isChild = false;
    let isViewMore = false;
    this.commonService.getIsChildList().subscribe(res => {
      isChild = res;
    })
    this.commonService.getIsViewMore().subscribe(res => {
      isViewMore = res;
    })
    if (isChild && !isViewMore) {
      if (this.inputParams && this.inputParams.childTableConfig
        && this.commonService.isnonEMptyString(this.inputParams.childTableConfig.isViewMore)) {
        this.isViewMore = this.inputParams.childTableConfig.isViewMore === 'true' ? true : false;
      }
    }
  }

  onClickEditInstrument(data){
    this.commonService.batchEditInstrument.next(data);
    this.actionsDisable = true;
  }

  beneWidgetAction(rowData: any, button: any, inputParams: any){
    let accountId = rowData[FccGlobalConstant.accountIdData];
    const successAccArr = [];
    if(button.buttonName === FccGlobalConstant.ACTION_APPROVE) {
      if (accountId === FccGlobalConstant.BENE_MUL) {
        let associationIdsArr = [];
        associationIdsArr = rowData.associationId.split(',');
        this.commonService.performBeneficiaryMultiApproveRejectFCM(associationIdsArr,
          FccGlobalConstant.multiTransactionEventType.APPROVE,
          '',null, rowData[FccGlobalConstant.BENEFICIARY_ID]).subscribe(_res => {

            this.widgetRefreshList.emit(FccGlobalConstant.BENE_APPROVAL_LISTDEF);
            this.commonService.showToasterMessage({
              life: 5000,
              key: 'tc',
              severity: 'success',
              summary:  `${this.translate.instant('success')}`,
              detail: this.translateService.instant(FccGlobalConstant.BENE_MUL_APPROVAL_SUCCESS, {beneficiaryName: rowData.beneficiaryId})
            });

            associationIdsArr.forEach(assocId => {
              successAccArr.push(assocId);
            });
          },
            _err => {
              const failedAccounts = _err.error;
              const failedIds = [];
              let errMsg: string = '';
              //remove failed from success
              if (Object.keys(failedAccounts).length !== 0) {
                for (const key in failedAccounts) {
                  associationIdsArr.splice(associationIdsArr.indexOf(key), 1);
                  if (key !== 'code') {
                  failedIds.push(key);
                  }
                }
              }

              //populate succeeded bene
              associationIdsArr.forEach(assocId => {
                successAccArr.push(assocId);
              });
              if(_err.status === 500) {
                this.commonService.showToasterMessage({
                  life: 5000,
                  key: 'tc',
                  severity: 'error',
                  summary: this.translateService.instant('error'),
                  detail: errMsg == '' ? this.translateService.instant(FccGlobalConstant.API_FAILURE) : errMsg
                });
              } else {
              this.commonService.showToasterMessage({
                life: 5000,
                key: 'tc',
                severity: 'error',
                summary: this.translateService.instant('error'),
                detail: this.translateService.instant(FccGlobalConstant.BENE_MUL_APPROVAL_FAILURE, { accountIds: failedIds })
              });
            }
            });
      } else {
        let associationId = rowData.associationId;
        this.commonService.performBeneficiaryApproveRejectFCM(associationId, FccGlobalConstant.multiTransactionEventType.APPROVE, "",
        rowData[FccGlobalConstant.BENEFICIARY_ID]).subscribe(res => {
          this.widgetRefreshList.emit(FccGlobalConstant.BENE_APPROVAL_LISTDEF);
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary:  `${this.translate.instant('success')}`,
            detail: this.translateService.instant(FccGlobalConstant.BENE_SINGLE_APPROVAL_SUCCESS, { beneficiaryName: rowData.beneficiaryId })
          });

        }, err => {
          let errMsg: string = '';
          try {
            errMsg = err.error.errors[0].description;
          } catch (err) {
            errMsg = '';
          }

          if(err.status === 500) {
            this.commonService.showToasterMessage({
              life: 5000,
              key: 'tc',
              severity: 'error',
              summary: this.translateService.instant('error'),
              detail: errMsg == '' ? this.translateService.instant(FccGlobalConstant.API_FAILURE) : errMsg
            });
          } else {

          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'error',
            summary: this.translateService.instant('error'),
            detail: errMsg == '' ? this.translateService.instant(FccGlobalConstant.BENE_SINGLE_APPROVAL_FAILURE, { accountIdKey: accountId }) : errMsg
          });
        }
        });
      }

    } else if(button.buttonName === FccGlobalConstant.ACTION_REJECT) {
      this.commonService.beneApproveRejectWidget = true;
      let message = `${this.translate.instant('deleteConfirmationMessage')}`;
      const dir = localStorage.getItem('langDir');
      let dialogRef = this.dialogService.open(PaymentTansactionPopupComponent, {
        header: this.translateService.instant('rejectTransactionHeader'),
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir },
        data: {
          rowData
        }
    });
    dialogRef.onClose.subscribe((result: any) => {
        if (this.commonService.beneApproveRejectWidget) {
        this.refreshBeneApproveRejectData(rowData, this.commonService.beneApproveRejectWidgetRejectReason);
        }
    });
    }
  }

  paymentWidgetAction(event: Event, rowData: any, button: any, inputParams: any){
    let paymentReferenceList = rowData.paymentReferenceList.split(',');
    paymentReferenceList = paymentReferenceList.filter(item => item !== null && item !== '');
    const clientCode = rowData.clientCode ? rowData.clientCode : null;
    const packageName = rowData.packageName ? rowData.packageName : null;
    const request = {
      event: button.buttonName,
      checkerRemarks: '',
      paymentReferenceNumber: paymentReferenceList
    };
    switch (button.buttonName) {
      case 'APPROVE':
      case 'SEND':
        this.commonService.paymentDashboardAction(request, packageName, clientCode).subscribe(
          () => {
            if (button.buttonName === 'APPROVE') {
              this.widgetRefreshList.emit(FccConstants.FCM_PAYMENT_APPROVAL_WIDGET_LISTDEF);
            } else {
              this.widgetRefreshList.emit(FccConstants.FCM_SEND_SCRAP_WIDGET_LISTDEF);
            }
            let successMsg = '';
            if ('APPROVE' === button.buttonName) {
              successMsg = `${this.translateService.instant('approveToasterMEssage',
                { name: packageName ? packageName : clientCode })}`;
            } else {
              successMsg = `${this.translateService.instant('sendToasterMEssage',
                { name: packageName ? packageName : clientCode })}`;
            }
            const tosterObj = {
              life: 5000,
              key: 'tc',
              severity: 'success',
              detail: successMsg
            };
            this.commonService.showToasterMessage(tosterObj);
          }, (_err) => {
            let errorMessage = '';
            if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
              errorMessage = 'failedApiErrorMsg';
            } else {
              errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
            }
            const tosterObj = {
              life: 5000,
              key: 'tc',
              severity: 'error',
              detail: `${this.translateService.instant(errorMessage)}`
            };
            this.commonService.showToasterMessage(tosterObj);
          }
        );
        break;
      case 'REJECT':
        this.commonService.paymentWidget = true;
        this.dialogService.open(PaymentTansactionPopupComponent, {
          header: this.translateService.instant('rejectTransactionHeader'),
          width: '35em',
          styleClass: 'fileUploadClass',
          style: { direction: localStorage.getItem('langDir') },
          data: {
            rowData: rowData,
            action: button.buttonName,
            inputParam: inputParams
          },
        });
        break;
      case 'SCRAP':
        this.commonService.paymentWidget = true;
        this.dialogService.open(PaymentTansactionPopupComponent, {
          header: this.translateService.instant('scrapTransactionHeader'),
          width: '35em',
          styleClass: 'fileUploadClass',
          style: { direction: localStorage.getItem('langDir') },
          data: {
            rowData: rowData,
            action: button.buttonName,
            inputParam: inputParams
          },
        });
        break;
    }
  }

  refreshBeneApproveRejectData(rowData , textArea) {
    this.commonService.beneApproveRejectWidget = false;
    this.commonService.beneApproveRejectWidgetRejectReason = '';
    let textAreaValue = textArea;
    const successAccArr = [];
    let accountId = rowData[FccGlobalConstant.accountIdData];
    if (accountId === FccGlobalConstant.BENE_MUL) {
      let associationIdsArr = [];
      associationIdsArr = rowData.associationId.split(',');
      this.commonService.performBeneficiaryMultiApproveRejectFCM(associationIdsArr,
        FccGlobalConstant.multiTransactionEventType.REJECT,
        textAreaValue,null, rowData[FccGlobalConstant.BENEFICIARY_ID]).subscribe(_res => {

      this.widgetRefreshList.emit(FccGlobalConstant.BENE_APPROVAL_LISTDEF);
      this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary:  `${this.translate.instant('success')}`,
            detail: this.translate.instant(FccGlobalConstant.BENE_MUL_REJECT_SUCCESS , {beneficiaryName: rowData.beneficiaryId})
          });

          associationIdsArr.forEach(assocId => {
            successAccArr.push(assocId);
          });

        },
          _err => {
            const failedAccounts = _err.error;
            const failedIds = [];
            let errMsg: string = '';

            //remove failed from success
            if (Object.keys(failedAccounts).length !== 0) {
              for (const key in failedAccounts) {
                associationIdsArr.splice(associationIdsArr.indexOf(key), 1);
                if (key !== 'code') {
                failedIds.push(key);
                }
              }
            }

            //populate succeeded bene
            associationIdsArr.forEach(assocId => {
              successAccArr.push(assocId);
            });
            if(_err.status === 500) {
              this.commonService.showToasterMessage({
                life: 5000,
                key: 'tc',
                severity: 'error',
                summary: this.translateService.instant('error'),
                detail: errMsg == '' ? this.translateService.instant(FccGlobalConstant.API_FAILURE) : errMsg
              });
            } else {
            this.commonService.showToasterMessage({
              life: 5000,
              key: 'tc',
              severity: 'error',
              summary: this.translate.instant('error'),
              detail: this.translate.instant(FccGlobalConstant.BENE_MUL_REJECT_FAILURE, { accountIds: failedIds })
            });
          }
          });
    } else {
      let associationId = rowData.associationId;
      this.commonService.performBeneficiaryApproveRejectFCM(associationId, FccGlobalConstant.multiTransactionEventType.REJECT, textAreaValue,
        rowData[FccGlobalConstant.BENEFICIARY_ID]).subscribe(res => {
        this.widgetRefreshList.emit(FccGlobalConstant.BENE_APPROVAL_LISTDEF);
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary:  `${this.translate.instant('success')}`,
          detail: this.translate.instant(FccGlobalConstant.BENE_SINGLE_REJECT_SUCCESS, { beneficiaryName: rowData.beneficiaryId })
        });

      }, err => {
        let errMsg: string = '';
        try {
          errMsg = err.error.errors[0].description;
        } catch (err) {
          errMsg = '';
        }

        if(err.status === 500) {
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'error',
            summary: this.translate.instant('error'),
            detail: errMsg == '' ? this.translateService.instant(FccGlobalConstant.API_FAILURE) : errMsg
          });
        } else {
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'error',
          summary: this.translate.instant('error'),
          detail: errMsg == '' ? this.translate.instant(FccGlobalConstant.BENE_SINGLE_REJECT_FAILURE, { accountIdKey: accountId }) : errMsg
        });
      }
      });
    }
  }
  addPaginatorAccessibility(document: Document): void {
    const uiPaginatorFirstList = Array.from(document.getElementsByClassName('ui-paginator-first'));
    const uiPaginatorPreviousList = Array.from(document.getElementsByClassName('ui-paginator-prev'));
    const uiPaginatorNextList = Array.from(document.getElementsByClassName('ui-paginator-next'));
    const uiPaginatorLastList = Array.from(document.getElementsByClassName('ui-paginator-last'));

    uiPaginatorFirstList.forEach(element=> {
      element[FccGlobalConstant.ARIA_LABEL] = this.translate.instant("goToFirstPage");
      element[FccGlobalConstant.TITLE] = this.translate.instant("goToFirstPage");
    });

    uiPaginatorPreviousList.forEach(element=> {
      element[FccGlobalConstant.TITLE] = this.translate.instant("previousPage");
    });

    uiPaginatorNextList.forEach(element=> {
      element[FccGlobalConstant.TITLE] = this.translate.instant("nextPage");
    });

    uiPaginatorLastList.forEach(element=> {
      element[FccGlobalConstant.TITLE ] = this.translate.instant("goToLastPage");
    });
  }

  updateCheckboxFlagForBatch(){
    let filterParam: any = {};
    let batchStatus = '';
    if(localStorage.batchDetailsData){
      const generalDetails = JSON.parse(localStorage.batchDetailsData).viewDetails;
      generalDetails.forEach((item) => {
        if (item.key === FccConstants.METHOD_OF_PAYMENT) {
          filterParam.packageId = item.value;
        } else if(item.key === FccGlobalConstant.PAYMENTS_STATUS){
          batchStatus = item.value;
        }
      });
    }
    filterParam= JSON.stringify(filterParam);
    this.commonService.getExternalStaticDataList(FccGlobalConstant.APPROVAL_LEVEL, filterParam)
    .subscribe((response) => {
      if (null !== response &&
        ((response[0]?.approval_levels === '0')
        || batchStatus === FccGlobalConstant.PENDINGMYVERIFICATION
        || batchStatus === FccGlobalConstant.PARTIALLYVERIFIED
        || batchStatus === FccGlobalConstant.VERIFIER_REJECTED
        || batchStatus === FccGlobalConstant.VERIFIED)) {
          if([FccGlobalConstant.PENDING_MY_APPROVAL_STATUS,
            ...FccGlobalConstant.PENDING_SEND_STATUS].includes(batchStatus)){
              const operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
              if(operation === FccConstants.VIEW_AUTH || operation === FccConstants.VIEW_SEND){
                this.resolverService.approvalByTransaction = true;
              } else {
                this.resolverService.approvalByTransaction = false;
              }
            } else {
              this.resolverService.approvalByTransaction = true;
            }
      }
    });
  }

  scrollDelay() {
    let bodyTag = document.getElementsByTagName('body');
    bodyTag[0].style.overflow = 'hidden';
    setTimeout(()=>{
      bodyTag[0].style.overflow = 'auto'; })
  }

  beneReminderPopup(rowData) {
    let headerField;
    let message;
    headerField = `${this.translate.instant('sendRemainderBeneHeader')}`;
    message = `${this.translate.instant('sendReminderBeneBody')}`;
    const direction = 'direction';
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: message ,
        showNoButton: false,
        showYesButton: false,
        showCancelButtonTertiary: true,
        showSendReminderButtonPrimary: true
      }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.sendBeneReminder(rowData);
      }
    });
  }

  doBeneficiaryApproveFCM(rowData) {
    this.startLoadingSpinner();
    const associationId = rowData['bankAccount@associationId'];
    const beneficiaryId: string = rowData[FccGlobalConstant.BENEFICIARY_ID];
    const beneficiaryName: string = rowData[FccGlobalConstant.BENEFICIARY_NAME];
    this.commonService.approveReject(associationId, FccGlobalConstant.ACTION_APPROVE, '', beneficiaryId)
      .subscribe(_res => {
        this.stopLoadingSpinner();
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary:  `${this.translate.instant('success')}`,
          detail: this.translate.instant('beneSingeApprovalSuccessMsg', { beneficiaryName: beneficiaryName })
        });
        this.refreshList.emit();
      }, (err) => {
        this.stopLoadingSpinner();
        let errorMessage = '';
        if (err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
          errorMessage = 'failedApiErrorMsg';
        } else {
          errorMessage = err.error.errors[0].description;
        }
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errorMessage)
        });
  });
  }

  isPaymentListing(){
    return (this.activatedRoute.snapshot.queryParams[FccGlobalConstant.OPTION] === FccGlobalConstant.PAYMENTS
      && this.activatedRoute.snapshot.queryParams[FccGlobalConstant.CATEGORY] === FccConstants.FCM);
  }
  sendBeneReminder(rowData) {
    this.startLoadingSpinner();
    let associationId = rowData['bankAccount@associationId'];
      this.commonService.performBeneficiarySendReminderFCM(associationId).subscribe( data => {
        this.stopLoadingSpinner();;
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translate.instant('success')}`,
          detail: this.translate.instant(FccGlobalConstant.BENE_REMINDER_SUCESS)


        });
        }, _err => {
          this.stopLoadingSpinner();
          let errorMessage = '';
        if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
          errorMessage = 'failedApiErrorMsg';
        } else {
          errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
        }
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errorMessage)
        });
        });
        setTimeout(() => {
          this.deleterowstatus = false;
        }, FccGlobalConstant.LENGTH_2000);
        }

   getFileNameConfigData(widgetDetails,fromDownload? : boolean) {
    let key = '';
    if (widgetDetails && widgetDetails.productCode)
    {
      key = widgetDetails.productCode;
    } else if(widgetDetails && widgetDetails.dashboardTypeValue)
    {
      key = (widgetDetails.dashboardTypeValue).toUpperCase();
    }
    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P850, null, key).subscribe(
      (response) =>{
        if(fromDownload){
          this.fileConfigDataForDownload = response;
        }else{
          this.fileConfigData = response;
        }
      }
    );
  }

  getToolTipMsg(localized, rowData) {
    let actionJson = JSON.parse(rowData.action);
    let toolTipMsg = '';
    if (actionJson.length > 0) {
      actionJson.forEach(element => {
          this.actionParam = element.actionParam;

          if (localized === FccGlobalConstant.DOWNLOAD_STATEMENT) {
            toolTipMsg = this.translateService.instant(FccGlobalConstant.DOWNLOAD_STATEMENT,
              { limitchecheck: this.actionParam });
          }
        else {
          toolTipMsg = `${this.translateService.instant(localized)}`;
        }
      });
      return toolTipMsg;
    }

  }

  onClickStatementDownloadMenu( subOptionDownload: any, rowData: any){
    this.downloadStatementData(rowData,subOptionDownload)
  }

  downloadStatementData(rowData,subOptionDownload){
    const filterParams = this.prepareParamObjForStatement(rowData);
    let listdefName = null;
    if(rowData.owner_type === FccConstants.EXTERNAL_ACCOUNT_OWNER_TYPE){
      listdefName = FccConstants.ACCOUNT_STATEMENT_EXTERNAL_LISTDEF;
    } else{
      listdefName = FccConstants.ACCOUNT_STATEMENT_LISTDEF;
    }
    const tempWidget = {
      listdefName: listdefName,
      option: "ACCOUNTS",
      productCode: "accountStatement",
      filterParams : filterParams
    }
    this.getFileNameConfigData(tempWidget,true);
    let cols = []
    this.listService.getColumnCustomizationData(tempWidget.listdefName, tempWidget.productCode).subscribe(result => {
        if (result) {
          cols = result.body.metaDataResponse.Column;
          cols = this.updateCols(cols);
          if(subOptionDownload == FccGlobalConstant.CSV){
            const accountId = rowData.account_id;
            const req = { accountId : accountId };
            let detailsResponse ;
            let userAccountBalance ;
            this.commonService.getAccountDetails(req).subscribe(response => {
              detailsResponse = response;
              this.dashboardService.getUserAccountBalance(accountId).subscribe(data => {
                userAccountBalance = data;
                const requestObj = {};
                requestObj['formData'] = detailsResponse;
                requestObj['userAccountBalance'] = userAccountBalance;
                requestObj['startPeriodDate'] = filterParams.create_date;
                requestObj['endPeriodDate'] = filterParams.create_date2;
                this.commonService.listdefInputParams.next(requestObj);

                this.accounStatementDownloadService.checkListDataDownloadOption(subOptionDownload, cols, [],
                    tempWidget, this.maxColumnForPDFModePortrait, this.dateFormatForExcelDownload, this.listDataDownloadLimit,this.fileConfigDataForDownload);
              })
            })
          }else{
            const subOption = subOptionDownload + FccConstants.STRING_UNDERSCORE + FccConstants.FULL_DOWNLOAD;
            this.listDataDownloadService.checkListDataDownloadOption(subOption, cols, [],
              tempWidget, this.maxColumnForPDFModePortrait, this.dateFormatForExcelDownload, this.listDataDownloadLimit,this.fileConfigDataForDownload,this.accountStatementDownloadLimit);
          }
          }
      });
    }

  prepareParamObjForStatement(rowData){
    let range = null;
    range = this.getStatementPeriod(this.actionParam);
    const params = {
      account_type: rowData.account_type_code,
      account_no: rowData.account_no,
      account_id: rowData.account_id,
      create_date: range.startDate,
      create_date2: range.endDate,
      operation: "LIST_STATEMENTS",
      enableListDataDownload: true
    }
    return params;
  }

  getStatementPeriod(period){
    if(this.commonService.isEmptyValue(period) || isNaN(period)){
      period = '15';
    }
    let startDate = new Date();
    let endDate = new Date();
    startDate.setDate(startDate.getDate() - (+period - 1));
    return {
      startDate: this.datePipe.transform(startDate,'dd/MM/yyyy'),
      endDate: this.datePipe.transform(endDate,'dd/MM/yyyy')
    }

  }

  updateCols(data: any) {
    let cols = [];
    if (data) {
      const tempCols = [];
      const expandTempCols = [];
      data.forEach(element => {
        if (!element.hidden) {
          tempCols.push({
          field: element.name,
          index: element.index,
          header: this.getHeader(element),
          align: element.align,
          hidden: element.hidden,
          width: element.width,
          columnFilterType: element.columnFilterType,
          isColumnSortDisabled: element.isColumnSortDisabled ? element.isColumnSortDisabled : false,
          showInThreeDotsOnly: element.showInThreeDotsOnly ? element.showInThreeDotsOnly : false,
          showAbbvAmt: element.showAbbvAmt,
          showAsDefault: element.showAsDefault,
          frozen: element.frozen,
          maskable: element.maskable,
          localizationkey: element.localizationkey,
          isCodeField: element.isCodeField,
          codeId: element.codeId,
          isClubbed: element.isClubbed,
          showDisplayValue: element.showDisplayValue,
          groupedValues: element.groupedValues,
          isClubbedField : element.isClubbedField,
          clubbedFieldsList : element.clubbedFieldsList,
          separator : element.separator,
          groupBy: element.groupBy,
          sortBy: element.sortBy,
          colorCode: element.colorCode,
          remarkApplicabilityList: element.remarkApplicabilityList,
          remarkValueColumn: element.remarkValueColumn,
          showFavIcon: element.showFavIcon,
          orderType : this.getSortingOrder(element.orderType)
        });
      } else {
        expandTempCols.push({
        field: element.name,
        index: element.index,
        header: this.translate.instant(element.name).toUpperCase(),
        align: element.align
        });
      }
    });
      cols = tempCols;
    }
    return cols;
  }
  getSortingOrder(orderType){
    return orderType ? (orderType === 'a' ? 'asc' : 'desc') : '';
  }
  getHeader(element) {
    let equivalentCurrency = '';
    if(this.commonService.isnonEMptyString(this.commonService.getAccountSummaryFilter())){
      const appliedFilter = this.commonService.getAccountSummaryFilter();
      Object.keys(appliedFilter).forEach(filter => {
        if (filter === 'account_ccy'){
          if(appliedFilter[filter] !== ''){
            equivalentCurrency = appliedFilter[filter];
          } else {
            equivalentCurrency = this.commonService.getBaseCurrency();
          }
        }
      });
    }
    const baseCurrency = equivalentCurrency ? equivalentCurrency : this.commonService.getBaseCurrency();
    if (element.localizationkey) {
      if ((this.showColumnsWithCurrency.indexOf(element.localizationkey) > -1) && baseCurrency) {
        return this.translate.instant(element.localizationkey) + ' (' + baseCurrency + ')';
      } else {
        return this.translate.instant(element.localizationkey);
      }
    } else {
        return '';
    }
  }

  OnEnterKey(event) {
    if (event.code === 'Enter') {
      this.downloadBatchPdf();
    }
  }

  downloadBatchPdf(){
    this.batchPdfData = new Map();
    this.formModelService.getFormModelForBatchDetails().subscribe(modelJson => {
      this.batchDetailsFormModel = modelJson;
    });
    this._batchDetailsJsonChanges.next(null);
    this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(apiMappingModel => {
      this.batchDetailsApiMappingModel = apiMappingModel;
      const tnxCheckboxData = this.checkboxData.map(({tnx_id}) => tnx_id);
        this.transactionDetailService.fetchBatchTransactionDetails(tnxCheckboxData, this.productCode, this.subProductCode).subscribe(response => {
          if (this.commonService.isNonEmptyValue(response) && this.commonService.isNonEmptyValue(response.body)) {
            this._batchDetailsJsonChanges.next({ 'val': response.body });
          }
        });
    });
  }

  populateBatchPDFData(apiMappingModel, responseJson, modelJson){
    let batchForm = new FCCFormGroup({});
    this.sectionNames = [];
    var response = this.commonService.addControltoForm(modelJson);
    let batchDetailsForm = response.form;
    this.sectionNames = response.sectionNames;
    this.sectionNames.forEach(sectionName => {
        const mappingFieldKey = modelJson[sectionName];
        batchForm  = this.formControlService.addNewFormControls(mappingFieldKey, this.commonService.getSectionForm(sectionName, batchDetailsForm));
        batchDetailsForm.controls[sectionName] = batchForm;
      });
      const mode = 'view';
      const master= false;
      let applicableFieldsToSet = null;
      this.sectionNames.forEach(sectionName => {
        const sectionForm = this.commonService.getSectionForm(sectionName, batchDetailsForm);
        Object.keys(sectionForm.controls).forEach(fieldName => {
          const mappingFieldKey = apiMappingModel[fieldName];
          const fieldControl = this.commonService.getControl(sectionForm, fieldName);

          if (sectionForm.controls[fieldName][FccGlobalConstant.PARAMS] &&
            sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][`dynamicField`] &&
            sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][`dynamicField`] === true) {
              this.productMappingService.handleMappingForDynamicFields(sectionForm, fieldName, fieldControl.type,
                apiMappingModel, responseJson, fieldControl, master, mode);
          }
          const clubbedListArray = fieldControl['params']['clubbedList'];
          if (clubbedListArray && clubbedListArray.length > 0) {
            this.productMappingService.getClubbedFields(responseJson, fieldControl, fieldName,apiMappingModel);
          }
          else if (fieldControl !== undefined && (applicableFieldsToSet === undefined || applicableFieldsToSet === null)) {
            this.productMappingService.setValueToControl(mappingFieldKey, sectionForm, fieldName, responseJson, fieldControl, master, mode);
          } else if (fieldControl !== undefined && (this.productMappingService.isMappingRequiredForField(applicableFieldsToSet, fieldName))) {
            this.productMappingService.setValueToControl(mappingFieldKey, sectionForm, fieldName, responseJson, fieldControl, master, mode);
          }
        });
        batchDetailsForm.controls[sectionName] = sectionForm;
    });
    return batchDetailsForm;
  }

  startLoadingSpinner() {
    this.loading = true;
    this.isLazyEnabled = true;
    if (this.ptable) {
      this.ptable.lazy = this.isLazyEnabled;
    }
  }

  stopLoadingSpinner() {
    this.loading = false;
    this.isLazyEnabled = false;
    if (this.ptable) {
      this.ptable.lazy = this.isLazyEnabled;
    }
  }

  getColHeaderClassName(colName){
    const whitespaceRegExp = / /g;
    return colName.replace(whitespaceRegExp, '-')
  }

  getOption() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.optionEmptyLink = params.option;
    });
  }

  getEmptyMsg() {
    this.getOption();
    if (this.optionEmptyLink === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC) {
      const fetchRecordDays = FccGlobalConfiguration.configurationValues.get('FETCH_RECORD_DAYS');
      const noRecordBeneString = this.translate.instant('beneNoRecordsMsg') + this.translate.instant('benefetchRecordMsg')
      + fetchRecordDays + this.translate.instant('day');
      return noRecordBeneString;
    }
    return this.inputParams.activeTab.noRecordsMsg
  }

  getEmptyLink() {
    if (this.inputParams?.isButtonsAvailable) {
      return this.inputParams?.activeTab?.noRecordsLinkMsg;
    } else if (this.optionEmptyLink === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC &&
      this.checkPermission(FccGlobalConstant.FCM_APPROVE_BENEFICIARY_PERMISSION)) {
      return `paymentsOverview`;
    }
  }

  navigateEmptyURL(eventUrl: any) {
    if (this.inputParams?.isButtonsAvailable) {
      this.router.navigateByUrl(eventUrl);
    } else if (this.optionEmptyLink === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC &&
      this.checkPermission(FccGlobalConstant.FCM_APPROVE_BENEFICIARY_PERMISSION)) {
        this.router.navigateByUrl(`/tabPanelListing?widgetCode=PAYMENTS_OVERVIEW`);
    }
  }
}
