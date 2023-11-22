import { LocationStrategy, getCurrencySymbol, DatePipe } from '@angular/common';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng';
import { MenuItem, Message } from 'primeng/api';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AmendTransactionsMap } from './../../base/model/amend-mapping';
import { ImportLetterOfCreditResponse } from '../../corporate/trade/lc/initiation/model/importLetterOfCreditResponse';
import { invalidAmount } from '../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { FccConstants } from '../core/fcc-constants';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { CorporateDetails } from '../model/corporateDetails';
import { CounterpartyRequest } from '../model/counterpartyRequest';
import { ProductParams } from '../model/params-model';
import { ResetPasswordRequestData } from '../retrievecredential/model/retrieveCredentialsReqData';
import { FCCFormControl, FCCFormGroup } from './../../base/model/fcc-control.model';
import { ListDefService } from './../../common/services/listdef.service';
import { FccGlobalConstantService } from './../core/fcc-global-constant.service';
import { CodeData } from './../model/codeData';
import { DeepLinkingService } from './deep-linking.service';
import { FileUploadHandlerService } from './file-upload-handler.service';
import { LicenseDetailsHandlerService } from './license-details-handler.service';
import { NudgesService } from './nudges.service';
import { MessageService } from 'primeng';
import { FCCBase } from '../../base/model/fcc-base';
import { PurchaseOrder } from './../../corporate/trade/lc/initiation/services/purchaseOrder';
import { FCMPaymentsConstants } from '../../corporate/cash/payments/single/model/fcm-payments-constant';
import { orderBy } from 'lodash';
import { CurrencyConverterPipe } from '../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';

@Injectable({ providedIn: 'root' })
export class CommonService extends FCCBase {
  public static isTemplateCreation = false;
  public queryParameters = new Map([]);
  authenticated: any;
  referenceId;
  dialogReload = "";
  beneGroupId;
  eventId;
  isnewEventSaved = false;
  // this attribute is added to show the comment dialog during batch selection
  showCommentDialog = true;
  counterTransaction = [];
  applDate;
  masterAllAccountlistingArray: any;
  public isubmitClicked = new BehaviorSubject(false);
  public isSubmitAllowed = new BehaviorSubject(false);
  public parentFormValidCheck = new BehaviorSubject(false);
  public sectionItemList = new BehaviorSubject([]);
  public carouselIndex = new BehaviorSubject(0);
  public carouselscrollIndex = new BehaviorSubject(0);
  public isApproveAllowed = new BehaviorSubject(true);
  public isMultiApproveAllowed = new BehaviorSubject(false);
  public isCommentSectionBtnEnabled = new BehaviorSubject(true);
  public saveAllowed = new BehaviorSubject(true);
  isSaveAllowed = true;
  angularProducts: string[];
  viewAllScreens: string[];
  public getProductCode = new BehaviorSubject<any>(null);
  public displayFacilityFeeCycle = new BehaviorSubject<boolean>(false);
  public facilityFeeCycleFilterCriteria = new BehaviorSubject<any>(null);
  public chequeViewDetails = new BehaviorSubject(null);
  public batchRefId = new BehaviorSubject(null);
  public timeStampToday$ = new BehaviorSubject(0);
  allAccountType = false;
  checkForBillsTnx = false;
  multipleablesInaPage = false;
  public isSpacerRequired = false;
  public applDateService = new BehaviorSubject<any>(null);
  public inputParamList: any;
  public bindingValue: any;
  public filterDataAvailable = false;
  public filterPreferenceData: any;
  public licenseCheckBoxRequired = 'Y';
  public swiftVersion;
  public swiftNarrativeFilterValue;
  public formLicenseGrid = false;
  public amendDescofGooodsHandle = false;
  isDiscardClicked = false;
  public narrativeDetailsHandle = false;
  public amendDescofGooodsCounter = 0;
  public narrativeDraft = false;
  public formDocumentGrid = false;
  public purchaseOrderLineItemGridExpandedElementData = new BehaviorSubject<[any, any]>(null);
  public purchaseOrderLineItemGridSelectedData = new BehaviorSubject<any>([]);
  public purchaseOrderLineItemGridUpdateSelectedData = new BehaviorSubject<any>(null);
  public purchaseOrders = new BehaviorSubject<PurchaseOrder[]>([]);
  public purchaseOrdersSelectedData = new BehaviorSubject<PurchaseOrder[]>([]);
  public purchaseOrderAdded = new BehaviorSubject<PurchaseOrder>(null);
  public purchaseOrderUpdated = new BehaviorSubject<PurchaseOrder>(null);
  public purchaseOrderUpdateIndex = new BehaviorSubject<number>(null);
  public formPurchaseOrderGrid = false;
  public amountAlreadyExists = false;
  public isOverrideLCAmountSelectd: string = 'NONE';
  public freeFormatOptionSelected = false;
  public autoSavedTime = new BehaviorSubject<any>(null);
  angularSubProducts: string[];
  private sessionIdleTimeout: number;
  public dashboardWidget = false;
  private useMidRate: boolean;
  private starRatingSize;
  private feedbackCharLength;
  private homeUrl;
  public globalDashboardUrl;
  private onDemandTimedLogout;
  filterParams;
  allGroupAccountsData: any[] = [];
  contentType = 'Content-Type';
  public LayoutSetting: any = 'layout1';
  private maxUploadSize;
  public dashboardOptionsSubject = new BehaviorSubject<any>(null);
  public landingiconHide = new BehaviorSubject<any>(true);
  public footerStatus = new BehaviorSubject<any>(false);
  public TFRequestType = new BehaviorSubject<any>(null);
  public channelRefNo = new BehaviorSubject<any>(null);
  public warningCancelResponse = new BehaviorSubject(null);
  public FTRequestType = new BehaviorSubject<any>(1);
  public amountConfigMap = new BehaviorSubject([]);
  public submitButtonEnable= new BehaviorSubject<any>(true);
  public highlightError = new BehaviorSubject<any>(null);
  public defaultLicenseFilter = false;
  public iframeURL: any;
  public deepLinkingQueryParameter: any;
  public toggleLicenseFilter = false;
  public radioButtonHeaderRequired = false;
  public backTobackExpDateFilter = false;
  public actionsDisable = false;
  public buttonsDisable = false;
  private menuObject: MenuItem[] = [];
  public dir: string;
  public languageOf: string;
  public igroupName: any;
  public loginDataMap = new Map([]);
  public termsAndConditionData = new Map([]);
  public loginModeMap = new Map([]);
  public dojoIdentifiermap = new Map([]);
  public sessionFlagmap = new Map([]);
  private landingPage;
  public dashboardType = 'globalDashboard';
  public landingPageLinksMap = new Map([]);
  public productNameRoute = '';
  public dashboardProductPath = '';
  public topMenuToggle: BehaviorSubject<string>;
  public showCustomHeader = false;
  public buttonItemsMap = new Map([]);
  public masterDataMap = new Map([]);
  public pdfDecodeValue = false;
  public modePdf = false;
  public decodeNarrative = true;
  public formLoadDraft = true;
  private shipmentExpiryDateForBackToBack: any;
  private amountForBackToBack: any;
  private clearBackToBackLCfields: any;
  public listDataFilterParams: any;
  public selectedRows = [];
  public summaryDetails = {};
  private readonly VALUE = 'value';
  address = 'Address';
  addressLine1 = 'line1';
  addressLine2 = 'line2';
  addressLine3 = 'line3';
  addressLine4 = 'line4';
  public tableColumnHeaders: any;
  private totalBeneFavCount: number;
  openReauthDialog$ = new BehaviorSubject(null);
  openSessionWarningDialog$ = new BehaviorSubject(null);
  isConfirmationDialogueVisible = new BehaviorSubject(false);
  openChipConfirmationDialog$ = new BehaviorSubject(null);
  openConfirmationDialog$ = new BehaviorSubject(null);
  responseConfirmationDialog$ = new BehaviorSubject(null);
  responseChipConfirmationDialog$ = new BehaviorSubject(null);
  public globalBankDate$ = new BehaviorSubject<any>({});
  public globalBankDateTimezone$ = new BehaviorSubject<any>({});
  public userDateTimezone$ = new BehaviorSubject<any>({});
  initiateProdComp$ = new BehaviorSubject(null);
  filterDialogueStatus = new BehaviorSubject(null);
  noOfTablesLoaded = new BehaviorSubject(0);
  refreshListBehaviourSubject = new BehaviorSubject(null);
  noReloadListDef = false;
  filterInputVal: any;
  control: any;
  valueStr = 'value';
  customerInstructionText = 'customerInstructionText';
  label = FccGlobalConstant.LABEL;
  options = FccGlobalConstant.OPTIONS;
  // Observable string sources
  private listenEditClick = new Subject<string>();
  savedResponse = new Subject<any>();
  errorResponse = new Subject<any>();
  // Observable string streams
  editClicked$ = this.listenEditClick.asObservable();
  savedResponse$ = this.savedResponse.asObservable();
  errorResponse$ = this.errorResponse.asObservable();
  openLegelTextDialog$ = new BehaviorSubject(null);
  // Observable string sources
  private missionAnnouncedSource = new Subject<string>();
  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();

  // Observable string sources
  private listenInstInquiryClicked = new Subject<string>();

  // Observable string streams
  listenInstInquiryClicked$ = this.listenInstInquiryClicked.asObservable();

  // Observable string sources
  private listenJourneyClick = new Subject<string>();
  // Observable string streams
  journeyClicked$ = this.listenJourneyClick.asObservable();

  // Observable string sources
  private listenSetEntityClicked = new Subject<string>();
  // Observable string streams
  listenSetEntityClicked$ = this.listenSetEntityClicked.asObservable();

  private listenSetEntitySuccess = new Subject<string>();
  // Observable string streams
  listenSetEntitySuccess$ = this.listenSetEntitySuccess.asObservable();

  // Observable string sources
  private listenSetReferenceClicked = new Subject<string>();
  // Observable string streams
  listenSetReferenceClicked$ = this.listenSetReferenceClicked.asObservable();

  // Observable string sources
  private eyeIconClicked = new Subject<string>();
  // Observable string streams
  eyeIconClicked$ = this.eyeIconClicked.asObservable();

  // Observable string sources
  private deleteIconClicked = new Subject<string>();
  // Observable string streams
  deleteIconClicked$ = this.deleteIconClicked.asObservable();

  private listenSetReferenceSuccess = new Subject<string>();
  // Observable string streams
  listenSetReferenceSuccess$ = this.listenSetReferenceSuccess.asObservable();

    // bene Save Toggle
    toggleVisibilityChange = new Subject<boolean>();
    istoggleVisible = true;
  // Cache Map to store the repeated get request responses
  private cachedResponses = new Map<string, any>();

  // etag version change
  etagVersionChange = new Subject<any>();

  eTagVersion: string;

  // user permissions map
  private userPermissions = new Map([]);

  // user permmission map grouped by entity
  private userPermissionsByEntityMap = new Map<string, Map<string, boolean>>();

  private loginImageFilePath = '';

  public isTranslationServiceInitialized = new BehaviorSubject(false);

  // Observable string sources
  public listenTransmissionMode = new Subject<string>();
  // Observable string streams
  tranmissionModeChanged$ = this.listenTransmissionMode.asObservable();

  private enrichmentTableMap = new Map<number, any>();

  public paymentBatchBalanceValidation = new BehaviorSubject(false);

  public hideShowAccountTable:any = new BehaviorSubject({});

  public hideShowCarouselCard = new BehaviorSubject(false);

  public getAccountList$ = new BehaviorSubject([]);

  public beneficiaryDefaultAccountValidation = new BehaviorSubject(false);

  public isBillReferenceEnabled = new BehaviorSubject({});
  public selectedTab = new BehaviorSubject(null);
  public paymentResponse = new BehaviorSubject(null);

  openDialogs = 0;
  errorStatus: any;
  commonErrPage: any;
  errorList: string[] = [];
  interceptorRetry: any = 0;
  responseStatusCode = 200;
  otpAuthScreenSource = '';
  isViewPopup = false;
  parent = false;
  displayableJsonValue: any;
  metadata: any;
  inputParams: any = {};
  requestForm = 'REQUEST-FROM';
  cacheRequest = 'cache-request';
  counterpartyRequest: CounterpartyRequest;
  corporateDetails: CorporateDetails;
  companyBaseCurrency: any;
  isEnableUxAddOn: boolean;
  settlementCurCode: any;
  amountFormatAbbvNameList: any;
  public isUpdateRefSubScribed = false;

  private resetPasswordData: ResetPasswordRequestData;

  private tfBillAmount: any;
  enteredCharCountBtBTemp;
  currentStateRefId: string;
  currentStateApiModel: any;
  currentStateTnxResponse: any;
  tnxResponse: any;
  masterTnxResponse: any;
  tnxResponse1: any;
  tnxResponse2: any;
  tnxRefID : any;
  private lcResponse: string;
  private tfFinAmount: any;
  private tfFinCurrency: any;
  private tfApplicantReference: any;
  enableLicenseSection: boolean;
  private componentRowData: any;
  viewPopupFlag = false;
  comparisonPopup = false;
  public isMasterRequired = false;
  liMode: any;
  liCopyFrom: any;
  addressType: any;
  public rowSellistdefName: string;
  responseMap: Map<any, any> = new Map();
  public isResponse = new BehaviorSubject(false);
  currentUserMail: any;
  loginUserId: any;
  loginUser: any;
  public siBankDetailResponseObj;
  public siViewSpecimenDownloadParams;
  public uiBankDetailResponseObj;
  public uiViewSpecimenDownloadParams;
  public productState = new BehaviorSubject<any>({});
  public loadForEventValues = new BehaviorSubject<any>({});
  mode: string;
  currentRouteTitle = new BehaviorSubject<string>('');
  titleKey: any;
  mainTitleKey: any;
  option: string;
  public parentReference = new BehaviorSubject<string>('');
  public parentTnxObj = new BehaviorSubject<string>('');
  public childReference = new BehaviorSubject<string>('');
  public childTnxObj = new BehaviorSubject<string>('');
  isCompanyCaseSensitiveSearchEnabled: boolean;
  isUserCaseSensitiveSearchEnabled: boolean;
  widgetClicked = '';
  isStaticAccountEnabled: boolean;
  public dealDetailsBehaviourSubject = new BehaviorSubject(null);
  widgetFilterParams: any;
  nudges: any;
  isMT700Upload: any;
  public externalUrlLink: any;
  public displayDialog = false;
  filterPreference: any = {};
  isStepperDisabled: boolean;
  private showPopup: boolean;
  private actionPopup: boolean;
  isFooterSticky = new BehaviorSubject(false);
  setActiveTab = false;
  setActiveTabIndex = 0;
  inputAutoComp = new BehaviorSubject(false);
  refreshPaymentList = new BehaviorSubject(false);
  refreshPaymentWidgetList = new BehaviorSubject(null);
  refreshBeneApprovalWidgetList = new BehaviorSubject(null);
  refreshPendingApprovalWidgetList = new BehaviorSubject(null);
  amountConfig = new BehaviorSubject("");
  getType: string;
  paymentWidget = false;
  beneApproveRejectWidget = false;
  beneApproveRejectWidgetRejectReason = '';
  beneApproveRejectWidgetclose = false;
  paymentWidgetListdefFilter: string;
  isChildList = new BehaviorSubject(false);
  batchAmtTransactionSubject$ = new BehaviorSubject(new Map());
  isViewMore = new BehaviorSubject(false);
  private batchFormData : any[] = [];
  allowedDocViewerMimeTypes: string[] = [];
  beneficiaryEmailLimit:number;
  batchEditInstrument = new BehaviorSubject(null);
  onBatchTxnUpdateClick = new BehaviorSubject(null);
  onBatchTxnSaveClick = new BehaviorSubject(null);
  batchData = new BehaviorSubject(null);
  batchDiscardInstrument = new BehaviorSubject(-1);
  batchEditSubmitFlag = new BehaviorSubject(null);
  batchAddSubmitFlag = new BehaviorSubject(null);
  batchInstrumntCancelFlag = new BehaviorSubject(false);
  batchTransactionBalance = new BehaviorSubject(null);
  buttonList: any[] = [];
  refreshTable = new BehaviorSubject(false);
  scrapCommentRequired=false;
  displayRemarks = new BehaviorSubject(null);
  public isssoENabled = new BehaviorSubject(false);
  refreshBatchDetails = new BehaviorSubject(false);
  accountSummaryFilter = [];
  loggedInUserData = [];
  accountSummaryWidgetsColumnDetailsMap = new Map<string, any>();
  refreshAccountSummaryCarousel = new BehaviorSubject(false);
  langSwitch = false;
  selectedBatchpaymentStatus: any;
  batchpaymentStatus: any;
  batchRefNumber: any;
  fcmOptionParam = '';
  enableBatchModificationActions = new BehaviorSubject(false);
  public accountDetailsData : any;
  listdefInputParams = new BehaviorSubject(null);
  public isCourierTrackingFeatureEnabled : boolean = false;
  compName: any;
  protected exchangeRateConfig : any;
  bulkBankError = new BehaviorSubject(false);
  showReviewErrorSection = false;
  public curCode : any;
  protected adhocBeneValidationConfig : any = {};
  public onCloseDeleteSubject = new BehaviorSubject(false);
  public onCloseDeleteSubScription: any;
  public oncloseDeleteRedirect = true;
  public isComingFromDiscard = false;
  public isDisacrdSelectionYes = false;
  public isSaveOperationFromLogoutPopUp$ = new Subject<any>();
  serverDate: string;
  productType: string;
  cashProductDetailsMap = new Map<string, any>();
  hideamendtoggle: boolean;
  isNextEnabled= new BehaviorSubject(true);

  entityAddressType: string;
  entities = [];
  beneficiaries = [];
  updatedBeneficiaries = [];
  country = [];
  lcResponseForm = new ImportLetterOfCreditResponse();
  benePreviousValue: any;
  context = localStorage.getItem(FccGlobalConstant.CONTEXT_PATH);
  abbvNameList = [];
  entityNameList = [];
  fxAmountFieldList = [];
  beneDefaultEmailId = null;
  public seBehaviourSubject = new BehaviorSubject(null);

  selectedBatchInstrumentStatus: any;
  fcmPackageDetails = new BehaviorSubject(null);
  fcmPaymentProductTypeDetails = new BehaviorSubject(null);
  fcmPayFromDetails = new BehaviorSubject(null);
  invalidSessionLandingPages = [];
  public clientSideSensitiveParamsEncryption = false ;
  public listClientSideParamsEncryption: string[];
  
  public paramsEncryptionData = { htmlUsedModulus:'',crSeq:'' };
  public isEncryptionAPITriggered = false;
  public encryptionKeysTimeoUt = 120000;
  isDownloadInProgress = false;
  batchStatus: any;
  balanceDetail: any;
  public isLoading = new BehaviorSubject<any>(false);
  globalRoleCheck;
  expandFilterSection;
  public renderer: Renderer2;
  public cachedRequests: Record<string, Observable<HttpEvent<any>>> = {};
  public isEventModelSection = false;
  actionName: string = '';

  constructor(
    protected http: HttpClient, public fccGlobalConstantService: FccGlobalConstantService,
    public translate: TranslateService, public locationStrategy: LocationStrategy,
    protected router: Router, protected matIconRegistry: MatIconRegistry, protected domSanitizer: DomSanitizer,
    public fileUploadHandlerService: FileUploadHandlerService, public licenseDetailsHandlerService: LicenseDetailsHandlerService,
    protected route: ActivatedRoute, protected titleService: Title,
    protected listDefService: ListDefService, protected dialogService: DialogService,
    protected nudgesService: NudgesService,
    protected deepLinkingSerice: DeepLinkingService,
    protected messageService:MessageService,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected datePipe: DatePipe,
    rendererFactory: RendererFactory2
  ) {
    super();
    this.renderer = rendererFactory.createRenderer(null, null);
    this.topMenuToggle = new BehaviorSubject<string>(null);
    this.etagVersionChange.subscribe(etag => {this.eTagVersion = etag;});
  }

  seGeneralsDetailsLoad(parameter: any) {
      this.seBehaviourSubject.next(parameter);
  }

  setAngularProducts(angularProducts: string[]) {
    this.angularProducts = angularProducts;
  }

  setAngularSubProducts(angularSubProducts: string[]) {
    this.angularSubProducts = angularSubProducts;
  }

  getAngularProducts(): string[] {
    return this.angularProducts;
  }

  getAngularSubProducts(): string[] {
    return this.angularSubProducts;
  }

  setViewAllScreens(viewAllScreens: string[]) {
    this.viewAllScreens = viewAllScreens;
  }

  getViewAllScreens(): string[] {
    return this.viewAllScreens;
  }

  isAngularProductUrl(productCode, subProductCode): boolean {
    if (!subProductCode || subProductCode === null || subProductCode === 'null' || subProductCode === '') {
      return this.angularProducts.indexOf(productCode) > -1;
    } else {
      return this.angularProducts.indexOf(productCode) > -1 && this.angularSubProducts.indexOf(subProductCode) > -1;
    }
  }

  setEnableUxAddOn(value: boolean) {
    this.isEnableUxAddOn = value;
  }

  getEnableUxAddOn() {
    return this.isEnableUxAddOn;
  }
  setEncryptionKeysTimeoUt(encryptionKeyTimeout: number)
  {
    this.encryptionKeysTimeoUt = encryptionKeyTimeout;
  }
  getEncryptionKeysTimeoUt(): number
  {
    return this.encryptionKeysTimeoUt;
  }
  setClientSideSensitiveParamsEncryption(value: boolean) {
    this.clientSideSensitiveParamsEncryption = value;
  }
  getClientSideSensitiveParamsEncryption() {
    return this.clientSideSensitiveParamsEncryption;
  }
  setListClientSideParamsEncryption(listClientSideParamsEncryption: string[]) {
    this.listClientSideParamsEncryption = listClientSideParamsEncryption;
   }
   getListClientSideParamsEncryption(): string[] {
    return this.listClientSideParamsEncryption;
  }

  setSummaryDetails(data) {
    this.summaryDetails = data;
  }

  getSummaryDetails() {
    return this.summaryDetails;
  }

  setSelectedBatchpaymentStatus(selectedBatchpaymentStatus) {
    this.selectedBatchpaymentStatus = selectedBatchpaymentStatus;
  }

  setServerDate(date: string) {
    this.serverDate = date;
  }

  getServerDate() {
    return this.serverDate;
  }

  getSelectedBatchpaymentStatus() {
    return this.selectedBatchpaymentStatus;
  }

  setBatchpaymentStatus(batchpaymentStatus) {
    this.batchpaymentStatus = batchpaymentStatus;
  }

  getBatchpaymentStatus() {
    return this.batchpaymentStatus;
  }

  setWidgetClicked(data) {
    this.widgetClicked = data;
  }

  getWidgetClicked() {
    return this.widgetClicked;
  }

  setOpenDialog(number: number) {
    this.openDialogs = number;
  }

  getOpenDialog() {
    return this.openDialogs;
  }

  setFilterPreference(filterPreference) {
    this.filterPreference = filterPreference;
  }

  getFilterPreference() {
    return this.filterPreference;
  }

  setBaseCurrency(value: string) {
    sessionStorage.setItem('baseCurrency' , value);
  }

  getBaseCurrency() {
    return sessionStorage.getItem('baseCurrency');
  }

  setAccountDetailsData(data) {
    this.accountDetailsData = data;
  }

  getAccountDetailsData() {
    return this.accountDetailsData;
  }

  // this function removes single error from the error list of control
  removeError(control: AbstractControl, error: string) {
    const err = control.errors;
    if (err) {
      // delete the particular error sent in param
      delete err[error];
      if (!Object.keys(err).length) {
        // if no errors left set control errors to null making it VALID
        control.setErrors(null);
      } else {
        // controls got other errors so set them back
        control.setErrors(err);
      }
    }
  }

  //  escape special characters from json string (to be used before JSON.parse)
  escapeSplCharactersBeforeParse(inputStr: string): string {
    return inputStr.replace(/\n/g, '\\n')
            .replace(/\r/g , '\\r')
            .replace(/\t/g , '\\t')
            .replace(/'/g , '\'')
            .replace(/"/g , '\\\"'); //eslint-disable-line no-useless-escape
  }

  // Service message commands
  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }

  isEditClicked(edit: string) {
    this.listenEditClick.next(edit);
  }

  addedResponse(res: any) {
    this.savedResponse.next(res);
  }

  showError(res: any) {
    this.errorResponse.next(res);
  }

  isInstInquiryClicked(rowData) {
    this.listenInstInquiryClicked.next(rowData);
  }

  isJourneyClicked(journey: string) {
    this.listenJourneyClick.next(journey);
  }

  isTransmissionModeChanged(data: string) {
    this.listenTransmissionMode.next(data);
  }

  isSetEntityClicked(rowData) {
    this.listenSetEntityClicked.next(rowData);
  }
  setEntitySuccedded() {
    this.listenSetEntitySuccess.next('yes');
  }
  isSetReferenceClicked(rowData) {
    this.listenSetReferenceClicked.next(rowData);
  }
  setReferenceSuccedded() {
    this.listenSetReferenceSuccess.next('yes');
  }
  isEyeIconClicked(value){
    if (value){
      this.eyeIconClicked.next('yes');
    } else {
      this.eyeIconClicked.next('no');
    }
  }

  isDeleteIconClicked(value){
    this.deleteIconClicked.next(value);
  }

  putGlobalBankDate(value) {
    this.globalBankDate$ = value;
  }

  getGlobalBankDate() {
    return this.globalBankDate$;
  }

  putGlobalBankDateTimezone(value) {
    this.globalBankDateTimezone$ = value;
  }

  getGlobalBankDateTimezone() {
    return this.globalBankDateTimezone$;
  }

  putUserDateTimezone(value) {
    this.userDateTimezone$ = value;
  }

  getUserDateTimezone() {
    return this.userDateTimezone$;
  }

  getBankDateForComparison() {
    if(this.getGlobalBankDate() && this.isnonEMptyString(this.getGlobalBankDate().getValue())){
      return this.getGlobalBankDate().getValue();
    } else {
      return new Date();
    }
  }

  public getShipmentExpiryDateForBackToBack(): any {
    return this.shipmentExpiryDateForBackToBack;
  }
  public setShipmentExpiryDateForBackToBack(value: any) {
    this.shipmentExpiryDateForBackToBack = value;
  }
  public getAmountForBackToBack(): any {
    return this.amountForBackToBack;
  }
  public setAmountForBackToBack(value: any) {
    this.amountForBackToBack = value;
  }
  public getClearBackToBackLCfields(): any {
    return this.clearBackToBackLCfields;
  }
  public setClearBackToBackLCfields(value: any) {
    this.clearBackToBackLCfields = value;
  }

  public getResetPasswordData(): ResetPasswordRequestData {
    return this.resetPasswordData;
  }
  public setResetPasswordData(value: ResetPasswordRequestData) {
    this.resetPasswordData = value;
  }

  putSessionFlag(key, value) {
    this.sessionFlagmap.set(key, value);
  }

  getSessionFlag(key) {
    return this.sessionFlagmap.get(key);
  }

  putEnrichmentDetails(value: any, key: number) {
    this.enrichmentTableMap.set(key, value);
  }

  getEnrichmentDetails(key: number) {
    return this.enrichmentTableMap.get(key);
  }

  setComponentRowData(data) {
    this.componentRowData = data;
  }

  getComponentRowData() {
    return this.componentRowData;
  }

  setShowPopup(val) {
    this.showPopup = val;
  }

  getShowPopup() {
    return this.showPopup;
  }

  setActionPopup(val) {
    this.actionPopup = val;
  }

  getActionPopup() {
    return this.actionPopup;
  }

  putLandingPageLinks(key, data) {
    this.landingPageLinksMap.set(key, data);
  }

  getLandingPageLinks(key) {
    return this.landingPageLinksMap.get(key);
  }

  putButtonItems(key, data) {
    this.buttonItemsMap.set(key, data);
  }

  getButtonItems(key) {
    return this.buttonItemsMap.get(key);
  }

  putMasterData(key, data) {
    this.masterDataMap.set(key, data);
  }

  getMasterData(key) {
    return this.masterDataMap.get(key);
  }

  clearMasterData() {
    this.masterDataMap.clear();
  }

  putLoginMode(key, data) {
    this.loginModeMap.set(key, data);
  }

  getLoginMode() {
    return this.loginModeMap;
  }

  clearLoginModeMap() {
    this.loginModeMap.clear();
  }

  putLoginData(key, data) {
    this.loginDataMap.set(key, data);
  }

  getLogindata() {
    return this.loginDataMap;
  }

  clearLoginDataMap() {
    this.loginDataMap.clear();
  }

  putTermsAndConditionData(key, data) {
    this.termsAndConditionData.set(key, data);
  }

  getTermsAndConditionData() {
    return this.termsAndConditionData;
  }

  putQueryParameters(key: any, data: any) {
    this.queryParameters.set(key, data);
  }

  getQueryParameters() {
    return this.queryParameters;
  }

  getQueryParametersFromKey(key: any): any {
    return this.queryParameters.get(key);
  }

  setOptionQueryParameterFCM(key: any): any {
    this.fcmOptionParam = key;
  }

  getOptionQueryParameterFCM(): any {
    return this.fcmOptionParam;
  }

  clearQueryParameters() {
    this.queryParameters.clear();
  }

  getCachedResponses() {
    return this.cachedResponses;
  }

  clearCachedResponses() {
    this.cachedResponses.clear();
    this.cachedRequests = {};
    // eslint-disable-next-line no-console
    console.log('clearing the cached responses: ' + this.cachedResponses.size);
  }

  getLiMode() {
    return this.liMode;
  }

  setLiMode(liMode) {
    this.liMode = liMode;
  }


  getLiCopyFrom() {
    return this.liCopyFrom;
  }

  setLiCopyFrom(liCopyFrom) {
    this.liCopyFrom = liCopyFrom;
  }

  clearCachedData() {
    this.cachedResponses.clear();
    try {
      this.userPermissions.clear();
      this.userPermissionsByEntityMap.clear();
    } catch (error) {
      this.userPermissions = new Map([]);
      this.userPermissionsByEntityMap = new Map<string, Map<string, boolean>>();
    }
  }

  login(data, lang: string, preferredMode?: any): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    data.mode = data.mode ? data.mode : '';
    data.tandcflag = data.tandcflag ? data.tandcflag : '';
    data.newUserName = data.newUserName ? data.newUserName : '';
    data.newPasswordValue = data.newPasswordValue ? data.newPasswordValue : '';
    data.newPasswordConfirm = data.newPasswordConfirm ? data.newPasswordConfirm : '';
    data.phone = data.phone ? data.phone : '';
    data.email = data.email ? data.email : '';
    data.nextScreen = data.nextScreen ? data.nextScreen : '';
    preferredMode = preferredMode ? preferredMode : '';
    const requestPayload = {
      userData: {
        username: data.username,
        company: data.corporateid,
        userSelectedLanguage: lang
      },
      requestData: { password: data.password,
                     mode: data.mode,
                     tandcflag: data.tandcflag,
                     newUserName: data.newUserName,
                     newPasswordValue: data.newPasswordValue,
                     newPasswordConfirm: data.newPasswordConfirm,
                     phone: data.phone,
                     email: data.email,
                     nextScreen: data.nextScreen,
                     captcha: data.recaptcha,
                     preferredMode }
    };
    return this.http.post<any>(
      this.fccGlobalConstantService.fccLogin,
      requestPayload,
      { headers, withCredentials: true }
    );
  }

  public checkUniqueEmail(loginData, lang: string): Observable<any> {
    const requestPayload = {
       userId: loginData.username,
       corporateId: loginData.corporateid,
       email: loginData.email,
       language: lang
  };
    // API CALL to check unique emailID
    return this.http.post<any>(this.fccGlobalConstantService.uniqueEmailIdUrl, requestPayload);
  }

  public retrieveUserId(request): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const completePath = this.fccGlobalConstantService.getRetrieveUserId();
    const requestPayload = request;
    return this.http.post<any>(completePath, requestPayload, { headers });
  }
  public retrievePassword(request): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const completePath = this.fccGlobalConstantService.getRetrievePassword();
    const requestPayload = request;
    return this.http.post<any>(completePath, requestPayload, { headers });
  }
  async checkLoggedIn(): Promise<boolean> {
    await this.getUserDetailsAPI().toPromise().then(
      (res) => {
        if (res.status === FccGlobalConstant.LENGTH_200) {
          this.authenticated = true;
          this.loginUserId = res.body.userId;
          this.loginUser = res.body.id;
          this.currentUserMail = this.decodeHtml(res.body.contactInformation.email);
        } else {
          this.authenticated = false;
        }
      },
      () => {
        this.authenticated = false;
      }
    );
    return this.authenticated;
  }

  public getProductList(): Observable<any> {
    const headers = this.getCacheEnabledHeaders();
    return this.http.get<any>(
      this.fccGlobalConstantService.getPRoductList,
      { headers }
    );
  }

requestToValidateDate(dateForValidate, rowData): any{
  const dateRequestParams: any = {};
  dateRequestParams.dateToValidate = dateForValidate;
  dateRequestParams.isRepricingDate = 'N';
  dateRequestParams.boFacilityId = rowData.bo_facility_id;
  dateRequestParams.currency = rowData.cur_code;
  dateRequestParams.pricingOptionName = rowData.pricing_option;
  dateRequestParams.dealId = rowData.bo_deal_id;
  dateRequestParams.operation = '';
  dateRequestParams.borrowerId = rowData.borrower_reference;
  return dateRequestParams;
}

  /**
   * @param prododctCode Product code.
   * @param parmId ParmId as PARM_ID of GTP_LARGE_PARAM_KEY.
   * Add the parmId in portal.properties for key large.param.parmid.whitelist
   */

public getParamData(prododctCode , parmId) {
  const headers = this.getCacheEnabledHeaders();
  const reqURl =
  `${this.fccGlobalConstantService.getParamDetails}?parmId=${parmId}&key_2=${prododctCode}`;
  return this.http.get<any>(reqURl, { headers } );

}

public getParamDataBasedOnLanguage(parmId: any) {
  const language = localStorage.getItem(FccGlobalConstant.LANGUAGE);
  const headers = this.getCacheEnabledHeaders();
  const reqURl = `${this.fccGlobalConstantService.getParamDetails}?parmId=${parmId}&key_4=${language}`;
  return this.http.get<any>(reqURl, { headers } );
}

public downloadTemplate(templateId: string): Observable<HttpResponse<Blob>> {
  const completePath = this.fccGlobalConstantService.getTemplateDownloadUrl(templateId) + '/content';
  return this.http.get(completePath, { responseType: 'blob', observe: 'response' });
}

public getAmountFormatAbbreviationList() {
  this.getParamDataBasedOnLanguage(FccConstants.PARAMETER_P702).subscribe(response => {
    if (response && response.largeParamDetails && response.largeParamDetails.length > 0) {
      let paramDataList: any;
      response.largeParamDetails.forEach(element => {
        paramDataList = element.largeParamDataList;
      });
      this.setAmountFormatAbbvNameList(paramDataList);
    }
  });
}

public validateCustomerInstructionTextAreaCount(form: any) {
  if (form) {
    const count = form.get(this.customerInstructionText)['params']['enteredCharCount'];
    const maxLimit = form.get(this.customerInstructionText)['params']['allowedCharCount'];
    if (count > maxLimit){
    const validationError = {
      maxlength: { actualLength: count, requiredLength: maxLimit } };
    form.addFCCValidators(this.customerInstructionText, Validators.compose([() =>validationError]), 0);
    form.get(this.customerInstructionText).markAsDirty();
    form.get(this.customerInstructionText).markAsTouched();
  } else if (count == undefined || count == 0) {
      form.get(this.customerInstructionText).setValidators(Validators.required);
  } else{
    form.get(this.customerInstructionText).clearValidators();
    form.get(this.customerInstructionText).setErrors('');
  }
  form.get(this.customerInstructionText).updateValueAndValidity();
  form.updateValueAndValidity();
 }
}

getShowCustomHeaderValue() {
  this.loadDefaultConfiguration().subscribe(response => {
    if (response) {
      this.showCustomHeader = response.showCustomHeader;
    }
  });
}

  counterOfPopulatedData(strResult, length?: any) {
    let len = 65;
    if (length !== undefined && length !== null) {
      len = length;
    }
    this.enteredCharCountBtBTemp = 0;
    if (strResult && (strResult.indexOf('\n') > -1 || strResult.indexOf('\r') > -1)) {
      const strInputArray = strResult.split('\n');
      let k = 0;
      for (let i = 0; i < strInputArray.length - 1; i++) {
          const strInputText = strInputArray[i];
          let num = 0;
          if (!( strInputText.length % len === 0) || strInputText.length === 0){
            num = 1;
          }
          this.enteredCharCountBtBTemp +=
          ((Math.trunc(strInputText.length / len)) + (num)) * len;
          k++;
      }
      if (k === strInputArray.length - 1) {
        this.enteredCharCountBtBTemp += strInputArray[k].length;
      }
      return this.enteredCharCountBtBTemp;
    } else {
        this.enteredCharCountBtBTemp = strResult ? strResult.length : 0;
        return this.enteredCharCountBtBTemp;
    }
}

limitCharacterCountPerLine(key, form, length?) {
  const initialValue = form.get(key).value;
  let charLimit;
  let DATA_LENGTH = FccGlobalConstant.LENGTH_35;
  if (this.isnonEMptyString(length)){
    DATA_LENGTH = length;
  }
  const lineArray = initialValue.split('\n');
  for (let i = 0; i < lineArray.length; i++) {
    charLimit = DATA_LENGTH;

    if (lineArray[i].length <= charLimit) {
      continue;
    }
    const tempKey = lineArray[i].substr(charLimit, lineArray[i].length - charLimit);
    lineArray[i] = lineArray[i].substr(0, charLimit);
    if (this.isNonEmptyValue(lineArray[i + 1])) {
      lineArray[i + 1] = tempKey.concat(lineArray[i + 1]);
    }
    else {
      lineArray.length++;
      lineArray[i + 1] = tempKey;
    }
  }
  const keyValue = lineArray.join('\n');
  form.get(key).setValue(keyValue);
}
  /**
   *  Method to fetch Embed token from Server side
   */
  public getEmbedToken(productKey: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = { productKey };
    return this.http.post<any>(
      this.fccGlobalConstantService.getEmbedToken,
      requestPayload,
      { headers }
    );
  }

  beneAbbvNameDisabled(abbvName){
    const startElement = document.getElementById(abbvName);
    let currentElement = startElement;
    while (currentElement) {
      if (currentElement.tagName.toLowerCase() === "mat-form-field") {
          this.renderer.addClass(currentElement, "mat-form-field-disabled");
          break;
      }
      currentElement = currentElement.parentElement;
    }
  }

  getContextPath() {
    return window[FccGlobalConstant.CONTEXT_PATH];
  }
  public getloginImageFilePath() {
    return this.loginImageFilePath;
  }
  public setloginImageFilePath(value) {
    this.loginImageFilePath = value;
  }
  getImagePath() {
    return this.getContextPath() + '/content/FCCUI/assets/images/';
  }

  public getSessionIdleTimeout() {
    return this.sessionIdleTimeout;
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      // eslint-disable-next-line arrow-body-style
      (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  public setSessionIdleTimeout(sessionIdleTimeout) {
    this.sessionIdleTimeout = sessionIdleTimeout;
  }

  public getUseMidRate() {
    return this.useMidRate;
  }

  public setUseMidRate(useMidRate) {
    this.useMidRate = useMidRate;
  }

  public getStarRatingSize() {
    return this.starRatingSize;
  }
  public setStarRatingSize(starRatingSize) {
    this.starRatingSize = starRatingSize;
  }

  public getfeedbackCharLength() {
    return this.feedbackCharLength;
  }
  public setfeedbackCharLength(feedbackCharLength) {
    this.feedbackCharLength = feedbackCharLength;
  }

  public getHomeUrl() {
    return this.homeUrl;
  }
  public setHomeUrl(homeUrl) {
    this.homeUrl = homeUrl;
  }

  public getOnDemandTimedLogout() {
    return this.onDemandTimedLogout;
  }
  public setOnDemandTimedLogout(onDemandTimedLogout) {
    this.onDemandTimedLogout = onDemandTimedLogout;
  }

  public setMenuObject(menuObject) {
    this.menuObject = menuObject;
  }
  public getMenuObject() {
    return this.menuObject;
  }
  public setMaxUploadSize(maxUploadSize) {
    return this.maxUploadSize = maxUploadSize;
  }
  public getMaxUploadSize() {
    return this.maxUploadSize;
  }
  public setTotalBeneFavCount(totalBeneFavCount: number) {
    return this.totalBeneFavCount = totalBeneFavCount;
  }
  public getTotalBeneFavCount() {
    return this.totalBeneFavCount;
  }
  public getTfBillAmount(): any {
    return this.tfBillAmount;
  }
  public setTfBillAmount(value: any) {
    this.tfBillAmount = value;
  }

  public getTfFinAmount(): any {
    return this.tfFinAmount;
  }
  public setTfFinAmount(value: any) {
    this.tfFinAmount = value;
  }

  public getTfFinCurrency(): any {
    return this.tfFinCurrency;
  }
  public setTfFinCurrency(value: any) {
    this.tfFinCurrency = value;
  }

  public getTfApplicantReference(): any {
    return this.tfApplicantReference;
  }
  public setTfApplicantReference(value: any) {
    this.tfApplicantReference = value;
  }

  public getLcResponse(): any {
    return this.lcResponse;
  }
  public setLcResponse(value: any) {
    this.lcResponse = value;
  }

  getUserContextEnabledHeaders = () => new HttpHeaders({ 'user-context':  'true', 'Content-Type': 'application/json' });

  getBankContextEnabledHeaders = () => new HttpHeaders({ 'bank-context':  'true', 'Content-Type': 'application/json' });

  getCacheEnabledHeaders() {
    return new HttpHeaders({ 'cache-request': 'true', 'Content-Type': 'application/json' });
  }

  public loadDefaultConfiguration(): Observable<any> {
    const headers = this.getCacheEnabledHeaders();
    const completePath = this.fccGlobalConstantService.getConfgurations();
    return this.http.get<any>(completePath, { headers }).pipe(
      shareReplay()
    );
  }

  getCurrencySymbol(curCode: string, amt: string): string {
    const currSymbol = getCurrencySymbol(curCode, 'narrow');
    return curCode !== currSymbol ? `${currSymbol} ${amt}` : `${amt}`;
  }

  getCurrSymbol(curCode: string) {
    return getCurrencySymbol(curCode, 'narrow');
  }

  getCurrencySymbolWide(currency: any) {
    const curSymbol = this.getCurrSymbol(currency);
    return (curSymbol === currency || this.isEmptyValue(curSymbol)) ?
    currency : currency + FccGlobalConstant.BLANK_SPACE_STRING + curSymbol;
  }

  public userCurrencies(request) {
    const headers = this.getCacheEnabledHeaders();
    const completePath = this.fccGlobalConstantService.getCurrencies();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const requestPayload = request;
    return this.http.get<any>(completePath, { headers });
  }

  public bankCurrencies(request) {
    const headers = this.getCacheEnabledHeaders();
    const completePath = this.fccGlobalConstantService.getBankCurrencies();
    const requestPayload = request;
    return this.http.post<any>(completePath, requestPayload, { headers });
  }


public getExternalStaticDataList(filter, filterParams?: string, disableCaching?: boolean) {
  if (this.isEmptyValue(filterParams)) {
    filterParams = FccGlobalConstant.EMPTY_STRING;
  }
  let headers = this.getCacheEnabledHeaders();
  if(disableCaching){
    headers = new HttpHeaders({ 'cache-request':  'false', 'Content-Type': 'application/json' });
  }
  const reqURl = `${this.fccGlobalConstantService.getExternalStaticDataUrl()}?option=${filter}&FilterValues=${filterParams}`;
  return this.http.get<any>(reqURl, { headers } );
}

public getPaymentBulkUploadDetailsOfRefNo(refNo) {
  const headers = this.getCacheEnabledHeaders();
  const reqURl = `${this.fccGlobalConstantService.getPaymentBulkUploadDetails()}?refNo=${refNo}`;
  return this.http.get<any>(reqURl, { headers } );
}

public getBeneBulkUploadDetailsOfRefNo(refNo) {
  const headers = this.getCacheEnabledHeaders();
  const reqURl = `${this.fccGlobalConstantService.getBeneBulkUploadDetails()}?refNo=${refNo}`;
  return this.http.get<any>(reqURl, { headers } );
}

  checkLandingPage(): Observable<any> {
    const headers = this.getCacheEnabledHeaders();
    const reqURl = `${this.fccGlobalConstantService.getLandingPage}?&userPreference=showlandingpage`;
    return this.http.get<any>(reqURl, { headers } );
  }

  public saveLandingpagepreference(
    showlandingpage: string
  ): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = {
      userPreference: 'showlandingpage',
      userPreferenceValue: showlandingpage
    };
    this.clearCachedResponses();
    return this.http.post<any>(
      this.fccGlobalConstantService.saveLandingpreference,
      requestPayload,
      { headers }
    );
  }
  checkHorizontalMenuPage(): Observable<any> {
    const headers = this.getCacheEnabledHeaders();
    const reqURl = `${this.fccGlobalConstantService.getLandingPage}`;
    return this.http.get<any>(reqURl, { headers } );
  }

  public saveHorizontalMenupreference(
    menuPrefernce: string
  ): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = {
      userPreference: 'showhorizontalmenu',
      userPreferenceValue: menuPrefernce
    };
    return this.http.post<any>(
      this.fccGlobalConstantService.saveLandingpreference,
      requestPayload,
      { headers }
    );
  }
  public getComponents() {
    return this.http.get<any>(
      this.fccGlobalConstantService.contextPath + '/../../assets/showcase/data/layout.json'
      );
  }

  getConfiguredValues(configuredKeys: string): Observable<any> {
    const headers = this.getCacheEnabledHeaders();
    const reqURl =
    `${this.fccGlobalConstantService.getConfigurationDetails}?configuredKey=${configuredKeys}`;
    return this.http.get<any>(reqURl, { headers } );
  }

  getAutosaveParameterConfiguredValues(paramKeys: any = {}): Observable<any> {
    let params = '';
    const keys = Object.keys(paramKeys);
    for (let index = 0; index < keys.length; index++) {
      if (paramKeys[keys[index]]) {
        params = `${params}&${keys[index]}=${paramKeys[keys[index]]}`;
      }
    }
    return this.http.get<any>(`${this.fccGlobalConstantService.getParamConfig}?${params.substring(1, params.length)}`,
      { headers : this.getUserContextEnabledHeaders() } );
  }

  isOnlyAutosaveEnabled = (data): boolean => data === FccGlobalConstant.AUTOSAVE_ALONE;

  getParameterConfiguredValues(configuredKeys: string, paramId: string, key2?: string, key3?: string): Observable<any> {
    const headers = this.getCacheEnabledHeaders();
    let baseUrl = `${this.fccGlobalConstantService.getParamConfig}?paramId=${paramId}`;
    if (configuredKeys !== null && configuredKeys !== undefined && configuredKeys !== '') {
      baseUrl = baseUrl + `&KEY_1=${configuredKeys}`;
    }
    if (key2 !== null && key2 !== undefined && key2 !== '') {
      baseUrl = baseUrl + `&KEY_2=${key2}`;
    }
    if (key3 !== null && key3 !== undefined && key3 !== '') {
      baseUrl = baseUrl + `&KEY_3=${key3}`;
    }
    const reqURL = baseUrl;
    return this.http.get<any>(reqURL, { headers } );
  }

  getBankContextParameterConfiguredValues(paramId: string, key2?: string, key3?: string): Observable<any> {
    const headers = this.getBankContextEnabledHeaders();
    let baseUrl = `${this.fccGlobalConstantService.getParamConfig}?paramId=${paramId}`;
    if (key2 !== null && key2 !== undefined && key2 !== '') {
      baseUrl = baseUrl + `&KEY_2=${key2}`;
    }
    if (key3 !== null && key3 !== undefined && key3 !== '') {
      baseUrl = baseUrl + `&KEY_3=${key3}`;
    }
    return this.http.get<any>(baseUrl, { headers } );
  }

  getCodeKey(codeId: any, type: any, prodCode: any, subProductCode: any){

    let key = null ;
    key = codeId + '_' + type + '_' + prodCode + '_' + subProductCode;
    return key;
  }

  getFormValues(limit: number, url: string): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[FccGlobalConstant.REQUEST_FORM] = FccGlobalConstant.REQUEST_INTERNAL;
    obj['cache-request'] = 'true';
    const headers = new HttpHeaders(obj);
    const reqURl = `${url}?limit=${limit}`;
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }
  async getFormValuesWithOffset(offset, limit, url) {
    const headers = this.getCacheEnabledHeaders();
    const reqURl = `${url}?limit=${limit}&offset=${offset}`;
    return await this.http.get<any>(reqURl, { headers, observe: 'response' }).toPromise().then(res => res.body)
    .catch(res => res)
    .then(data => data);
  }

  public uploadAttachmentsForBeneAndPayments(file: File, title: string, uploadType?: any, attachmentGroup?: string,
     productCode?: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('title', encodeURIComponent(title));
    formData.append('fileName', encodeURIComponent(file.name));
    formData.append('requestType', FccGlobalConstant.REQUEST_INTERNAL);
    if (this.isnonEMptyString(uploadType)) {
      formData.append('type', FccGlobalConstant.SWIFT);
      formData.append('attachmentGroup', FccGlobalConstant.OTHER);
    } else {
      formData.append('type', FccGlobalConstant.CUSTOMER);
      formData.append('attachmentGroup', attachmentGroup);
    }
    formData.append('productCode', productCode);

    return this.http.post<any>(this.fccGlobalConstantService.getFileUploadUrl(), formData);
  }


  public saveFormData(request) {
    const iKey = this.fccGlobalConstantService.generateUIUD();
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[FccGlobalConstant.idempotencyKey] = iKey;
    const headers = new HttpHeaders(obj);
    const completePath = this.fccGlobalConstantService.saveLCAsDraft;
    const requestPayload = request;
    return this.http.post<any>(completePath, requestPayload, { headers , observe: 'response' });
  }

  public saveLCTemplateData(request): Observable<any> {
    const iKey = this.fccGlobalConstantService.generateUIUD();
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[FccGlobalConstant.idempotencyKey] = iKey;
    const headers = new HttpHeaders(obj);
    const completePath = this.fccGlobalConstantService.saveLCTemplate;
    return this.http.post<any>(completePath, request, { headers , observe: 'response' });
  }

  public deleteLCTemplate(templateName: string, subProductCode?: any): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    let reqUrl: any;
    const url = `${this.fccGlobalConstantService.deleteLCTemplate + templateName}`;
    if (subProductCode) {
      reqUrl = `${url}?subProductCode=${subProductCode}`;
    } else {
      reqUrl = `${url}`;
    }
    return this.http.delete<any>(reqUrl, { headers , observe: 'response' });
  }

  public deleteTemplate(templateName: any, productCode: any, subProductCode?: any): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    let reqUrl: any;
    const url = `${this.fccGlobalConstantService.deleteTemplate + templateName}?productCode=${productCode}`;
    if (subProductCode) {
      reqUrl = `${url}&subProductCode=${subProductCode}`;
    } else {
      reqUrl = `${url}`;
    }
    return this.http.delete<any>(reqUrl, { headers , observe: 'response' });
  }

  public deleteLC(lcNumber: string): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    return this.http.delete<any>(this.fccGlobalConstantService.deleteLC + lcNumber, { headers , observe: 'response' });
  }

  public deleteTD(refId: any, tnxId: any): Observable<any> {
    const tempRefId = refId;
    const tempTnxId = tnxId;
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj['cache-request'] = 'true';
    const headers = new HttpHeaders(obj);
    const reqURl = `${this.fccGlobalConstantService.deleteTD}?refId=${tempRefId}&tnxId=${tempTnxId}`;
    return this.http.put<any>(reqURl, { headers , observe: 'response' });
  }

  public delete(groupId: any): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    return this.http.delete<any>(this.fccGlobalConstantService.delete + groupId, { headers , observe: 'response' });
  }

  public deleteAutosave(paramKeys: any = {}): Observable<any> {
    const reqURl = this.fccGlobalConstantService.getAutoSaveUrl();
    let params = '';
    const keys = Object.keys(paramKeys);
    for (let index = 0; index < keys.length; index++) {
      if (paramKeys[keys[index]]) {
        params = `${params}&${keys[index]}=${paramKeys[keys[index]]}`;
      }
    }
    return this.http.delete<any>(`${reqURl}?${params.substring(1, params.length)}`,
      { headers : this.getUserContextEnabledHeaders() } );
  }
    public genericDelete(prodCode: any, refId: any, tnxId: any, subProdCode: any): Observable<any> {
      const uri = this.fccGlobalConstantService.genericDelete;
      const tnxDetails = [{
        eventId: tnxId,
        productCode: prodCode,
        id: refId,
        subProductCode: subProdCode
    }];
      const options = {
        headers: new HttpHeaders({
          'Content-Type': FccGlobalConstant.APP_JSON
        }),
        body: {
          transactions: tnxDetails
        },
      };
      return this.http.request<string>(FccGlobalConstant.HTTP_DELETE, uri, options);
        }
    getCodeDataDetails(codeData: CodeData): Observable<any> {
    const codeId = codeData.codeId;
    const productCode = codeData.productCode;
    const subProductCode = codeData.subProductCode;
    const language = codeData.language;
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj['cache-request'] = 'true';
    const headers = new HttpHeaders(obj);
    // junk character is appened in URL
    // eslint-disable-next-line max-len
    const reqURl = `${this.fccGlobalConstantService.getCodeData}?CodeId=${codeId}&ProductCode=${productCode}&SubProductCode=${subProductCode}&Language=${language}`;
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }

  getSubTopic(paramId: string, key4: string): Observable<any> {
    const headers = this.getCacheEnabledHeaders();
    let baseUrl = `${this.fccGlobalConstantService.getParamConfig}?paramId=${paramId}`;
    const key3 = FccGlobalConstant.PARAMETER_P321;
    baseUrl = baseUrl + `&KEY_3=${key3}`;
    if (key4 !== null && key4 !== undefined && key4 !== '') {
      baseUrl = baseUrl + `&KEY_4=${key4}`;
    }
    const reqURL = baseUrl;
    return this.http.get<any>(reqURL, { headers } );
  }

  getPackagesValues(isPackageRequired: boolean): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj['cache-request'] = 'true';
    const headers = new HttpHeaders(obj);
    const reqURl = `${this.fccGlobalConstantService.packages}?isPackageRequired=${isPackageRequired}`;
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }

  public getPhraseProductDetails(): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj['cache-request'] = 'true';
    const headers = new HttpHeaders(obj);
    const reqURl = this.fccGlobalConstantService.getProductsForPhrases();
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }

  public getDynamicPhraseAddFieldData(productCode: string): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj['cache-request'] = 'true';
    const headers = new HttpHeaders(obj);
    const reqURl = `${this.fccGlobalConstantService.addFieldsForDynamicPhrases}?productCode=${productCode}`;
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }

  public savePhrases(data: any): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const body = {
      entityShortName: data.get('entityShortName'),
      name: data.get('name'),
      type: data.get('type'),
      product: data.get('product'),
      category: data.get('category'),
      description: data.get('description'),
      content: data.get('content')
    };
    return this.http.post<any>(this.fccGlobalConstantService.getPhraseSaveUrl(), body, { headers, observe: 'response' });
  }

  public checkPhraseAbbvName(abbvName: string): Observable<any>{
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const reqURl = `${this.fccGlobalConstantService.validatePhraseAbbvName}?abbvName=${abbvName}`;
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }

  public saveOrSubmitBank(request: any): Observable<any> {
    const requestPayload = request;
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const completePath = this.fccGlobalConstantService.getBankSaveUrl();
    return this.http.post<any>(completePath, requestPayload, { headers, observe: 'response' });
  }

   public updateSavedFormData(transactionID: string, etag, request): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        obj[FccGlobalConstant.ifMatch] = etag;
        const headers = new HttpHeaders(obj);
        const completePath = this.fccGlobalConstantService.putSavedLCUrl(transactionID);
        const requestPayload = request;
        return this.http.put<any>(completePath, requestPayload, { headers , observe: 'response' });
    }

  public uploadAttachments(file: File, title: string, lcNumber: any, eventId: any,
    uploadType?: any, validationType?: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('title', encodeURIComponent(title));
    // encoding has been removed as the name in the "file" object is being encoded
    formData.append('fileName', file.name);
    formData.append('id', lcNumber);
    formData.append('eventId', eventId);
    if (this.isnonEMptyString(uploadType)) {
      formData.append('type', FccGlobalConstant.SWIFT);
      formData.append('attachmentGroup', FccGlobalConstant.OTHER);
    } else {
      formData.append('type', FccGlobalConstant.CUSTOMER);
    }
    if (this.isnonEMptyString(validationType)) {
      formData.append('validation_type', validationType);
    }

    return this.http.post<any>(this.fccGlobalConstantService.getFileUploadUrl(), formData);
  }

  public deleteAttachments(attachmentId: string): Observable<any> {
    return this.http.delete<any>(this.fccGlobalConstantService.getFileDeleteUrl(attachmentId));
  }

  public downloadAttachments(attachmentId: string): Observable<HttpResponse<Blob>> {
  const completePath = this.fccGlobalConstantService.getFileDownloadUrl(attachmentId) + '/content';
    return this.http.get(completePath, { responseType: 'blob', observe: 'response' });
  }

  public downloadNewsAttachments(attachmentId: string, attachmentType: string): Observable<HttpResponse<Blob>> {
    const completePath = this.fccGlobalConstantService.getNewsAttachmentDownloadUrl(attachmentId, attachmentType);
    return this.http.get(completePath, { responseType: 'blob', observe: 'response' });
  }

  setCurrentRouteTitle(title: any) {
    if (title) {
      this.currentRouteTitle.next(title);
    }
  }

  getCurrentRouteTitle() {
    this.currentRouteTitle.subscribe(
      (currentValue: any) => {
        this.titleKey = currentValue;
      }
    );
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
    this.getTranslatedMainTitle();
    if (this.titleKey) {
    this.getCurrentRouteTitle();
    this.setTranslatedTitle();
    }
  }

  getTranslatedMainTitle() {
    const mainTitleKey = 'MAIN_TITLE';
    this.translate.get(mainTitleKey).subscribe((translated: string) => {
      this.mainTitleKey = translated;
    });
  }

  setTranslatedTitle() {
    const dontShowRouter = 'dontShowRouter';
    if (!(window[dontShowRouter] && window[dontShowRouter] === true )) {
      this.translate.get(this.titleKey).subscribe((translated: string) => {
        const translatedTitleKey = translated;
        const completeTitle = this.mainTitleKey + '-' + translatedTitleKey;
        // if title translation is missing, then display main title(to avoid displaying URL details)
        if(this.isnonEMptyString(completeTitle)) {
        this.titleService.setTitle(completeTitle);
        }
        else {
          const mainTitle = this.translate.instant('MAIN_TITLE');
          this.titleService.setTitle(mainTitle);
        }
      });
    }
  }

  setSwitchOnLanguageForHeader(lang) {
    this.languageOf = lang.code;
    this.translate.use(lang.code);
    localStorage.setItem('language' , this.languageOf);
  }

  getLocale(lang) {
    if (lang && lang !== null) {
      if (`en` === lang) {
        return 'en-gb';
      } else if ('us' === lang) {
        return 'en-us';
      } else if ('zh' === lang) {
        return 'zh-cn';
      } else {
        return lang.concat('-').concat(lang);
      }
    } else {
      return 'en-gb';
    }
  }
  getSwitchOnLAnguage() {
    const a = localStorage.getItem('language');
    this.translate.use(a);
  }
  checKlanguage(lang: string) {
    let language = '';
    if (lang === 'en') {
      language = FccGlobalConstant.N061_EN;
    } else if (lang === 'fr') {
      language = FccGlobalConstant.N061_FR;
    } else if (lang === 'us') {
      language = FccGlobalConstant.N061_US;
    } else if (lang === 'ar') {
      language = FccGlobalConstant.N061_AR;
    } else if (lang === 'de') {
      language = FccGlobalConstant.N061_DE;
    } else if (lang === 'es') {
      language = FccGlobalConstant.N061_ES;
    } else if (lang === 'th') {
      language = FccGlobalConstant.N061_TH;
    } else if (lang === 'zh') {
      language = FccGlobalConstant.N061_ZH;
    } else if (lang === 'br') {
      language = FccGlobalConstant.N061_BR;
    } else {
      language = FccGlobalConstant.N061_EN;
    }
    return language;
  }

  public checkUniqueUserID(userID: string): Observable<any> {
    // API CALL to check unique userID
    return this.http.get<any>(this.fccGlobalConstantService.getUniqueUserIdUrl(userID));
  }
  putDojoAngularSwitch(key, value) {
    this.dojoIdentifiermap.set(key, value);
  }
  getDojoAngularSwitch(key) {
    return this.dojoIdentifiermap.get(key);
  }

  public getDuplicateBeneDetails(beneName?: string, beneAccNo?: string): Observable<any> {
    const url = this.fccGlobalConstantService.getDuplicateBeneDetails;
    const headers = this.getCacheEnabledHeaders();
    const reqURl = `${url}?beneName=${beneName}&beneAccountNumber=${beneAccNo}`;
    return this.http.get<any>( reqURl, { headers } );
  }

  public getUserDetailsAPI(): Observable<any> {
    // API CALL to get the userdetails
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[this.requestForm] = FccGlobalConstant.REQUEST_INTERNAL;
    obj['cache-request'] = 'true';
    const headers = new HttpHeaders(obj);
    return this.http.get<any>(this.fccGlobalConstantService.getUserDetails, { headers, observe: 'response' });
  }

  /**
   * Checks if the user has chatbot permission
   */
  public hasChatBotAccess() {
    const headers = this.getCacheEnabledHeaders();
    return this.http
      .get<any>(
        this.fccGlobalConstantService.hasChatbotAccess, { headers })
      .toPromise()
      .then(res => res.chatBotSessionDetailsList as any[])
      .catch(res => res)
      .then(data => data);
  }

  public getCorporateDetailsAPI(additionalheader: any): Observable<any> {
    // API CALL to get the Corporate Details
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[this.cacheRequest] = 'true';
    if (additionalheader) {
    obj[this.requestForm] = additionalheader;
    }
    const headers = new HttpHeaders(obj);
    return this.http.get<any>(this.fccGlobalConstantService.corporateDetails, { headers, observe: 'response' });
  }

  // Below method is used to decode HTML entities
  decodeHtml(input) {
    const contentType = 'text/html';
    const doc = new DOMParser().parseFromString(input, contentType);
    return (doc && doc.documentElement) ? doc.documentElement.innerText : '';
  }

  userAuthorizationDetails(): Observable<any> {
    const headers = new HttpHeaders({ ContentType: FccGlobalConstant.APP_JSON });
    return this.http.get<any>(this.fccGlobalConstantService.userAuthorizationDetails, { headers });
  }

  public getLandingPage() {
    return this.landingPage;
  }
  public setLandingPage(landingPage) {
    this.landingPage = landingPage;
  }

  getCustomContent(reqURl: string): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const completeUrl = `${this.fccGlobalConstantService.baseUrl + reqURl}`;
    return this.http.get<any>(completeUrl, { headers , observe: 'response' });
  }

  getWidgetContent(widgetName: string): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[this.cacheRequest] = 'true';
    const headers = new HttpHeaders(obj);
    const reqURl = `${this.fccGlobalConstantService.getWidgetContent}?widgetName=${widgetName}`;
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }
  public getLandingPageDataAPI(): Observable<any> {
    // API CALL to get the landing pageparameter data
    const headers = this.getCacheEnabledHeaders();
    return this.http.get<any>(this.fccGlobalConstantService.getLandingPageData, { headers, observe: 'response' });
  }

  // fetch model from api
  public getProductModel(params: ProductParams): Observable<any> {
    // commenting out this as a temporary fix, this api call has to be refactored
    const headers = this.getCacheEnabledHeaders();
    const opts = this.buildQueryParams(params);
    return this.http.get<any>(this.fccGlobalConstantService.getProductModelURL(params.type),
    { headers, params: opts, observe: 'body' });
  }

  buildQueryParams(productParams: ProductParams): HttpParams {
    const params = new HttpParams({
      fromObject: {
        productCode: productParams.productCode,
        subProductCode: productParams.subProductCode,
        tnxTypeCode: productParams.tnxTypeCode,
        subTnxTypeCode: productParams.subTnxTypeCode,
        option: productParams.option,
        operation: productParams.operation,
        mode: productParams.mode,
        category: productParams.category
      }
    });
    return params;
  }

  getListOFDashboard(productType) {
    const headers = this.getCacheEnabledHeaders();
    const completePath = `${this.fccGlobalConstantService.getDashboardList}?dashboardCategory=${productType}`;
    return this.http.get<any>(completePath, { headers });
  }

  saveDashboardPreference(data): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const body = {
      dashboardCategory: data.dashboardCategory,
      dashboardName: data.dashboardName,
      userDashboardId: data.userDashboardId,
      dashboardId: data.dashboardId
    };
    this.clearCachedData();
    return this.http.post<any>(this.fccGlobalConstantService.saveDashboardPreferences, body, { headers, observe: 'response' });
  }

  async createPersonalizedDashboad(body) {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    this.clearCachedData();
    return await this.http.post<any>(this.fccGlobalConstantService.createUserDashboard, body, { headers, observe: 'response' })
    .toPromise()
      .then(res => res.body as any[])
      .catch(res => res)
      .then(data => data);
  }

  async updatePersonalizedDashboad(body) {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    this.clearCachedData();
    return await this.http.put<any>(this.fccGlobalConstantService.updateUserDashboard, body, { headers, observe: 'response' })
    .toPromise()
      .then(res => res.body as any[])
      .catch(res => res)
      .then(data => data);
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
    history.pushState(null, null, location.href);
    });
  }
  getMenuValue(): Observable<string> {
    return this.topMenuToggle.asObservable();
  }
    setMenuValue(newValue): void {
    this.topMenuToggle.next(newValue);
  }

  getOtpAuthScreenSource() {
    return this.otpAuthScreenSource;
  }

  /**
   * API call to get the journey details
   */
  public getJourneyDetails(refId: string, eventId: string): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
  //  return this.http.get<any>(this.fccGlobalConstantService.getJourneyDetails(refId), { headers, observe: 'response' });

    let reqUrl: string;
    const url = this.fccGlobalConstantService.detailJourney;
    if (this.isnonEMptyString(eventId)) {
      reqUrl = `${url}?refId=${refId}&eventId=${eventId}`;
    } else {
      reqUrl = `${url}?refId=${refId}`;
    }
    return this.http.get<any>(reqUrl, { headers, observe: 'response' });
  }

  fetchEtagVersion(transactionID: string): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const reqURl = this.fccGlobalConstantService.getLCTransactionDataDetailsUrl(transactionID);
    return this.http.get<any>(reqURl, { headers, observe: 'response' });
}

      getTransactionDetails(reqURl) {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        return this.http.get<any>(reqURl, { headers, observe: 'response' });
      }

      getFileDetails(refId: string) {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        const reqUrl = `${this.fccGlobalConstantService.getFileDetails}?id=${refId}`;
        return this.http.get<any>(reqUrl, { headers, observe: 'response' });
      }

      async getCoverBillDetails(refId: string, tnxId: string, autoGenDoc?: string) {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        obj[FccGlobalConstant.REQUEST_FORM] = FccGlobalConstant.REQUEST_INTERNAL;
        const headers = new HttpHeaders(obj);
        let reqUrl = `${this.fccGlobalConstantService.getFileDetails}?id=${refId}&eventId=${tnxId}`;
        if(autoGenDoc)
        {
          reqUrl = reqUrl + `&autoGenDoc=${autoGenDoc}`;
        }
        return await this.http.get<any>(reqUrl, { headers, observe: 'response' }).toPromise().then(res => res.body)
        .catch(res => res)
        .then(data => data);
      }

      getMasterDetails(reqURl) {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        return this.http.get<any>(reqURl, { headers, observe: 'response' });
      }

      generateTemplateName(productCode): Observable<any> {
        const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
        const body = {
          productCode
        };
        return this.http.post<any>(this.fccGlobalConstantService.generateTemplateName, body, { headers, observe: 'response' });
      }

      // API CALL to load countires
      loadCountries(): Observable<any> {
        const headers = this.getCacheEnabledHeaders();
        const baseUrl = this.fccGlobalConstantService.countries;
        const offset = FccGlobalConstant.LENGTH_0;
        const limit = this.fccGlobalConstantService.getStaticDataLimit();
        return this.http.get<any>(baseUrl + `?limit=${limit}&offset=${offset}`, { headers, observe: 'response' });
      }

      public getCountries() {
        return new Observable(subscriber => {
          this.loadCountries().subscribe(data => {
            subscriber.next(data.body);
          });
        });
      }
      // API CALL to load the user permissions
      loadUserPermissions(): Observable<any> {
        const headers = this.getCacheEnabledHeaders().set('REQUEST-FROM', 'INTERNAL');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const baseUrl = this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.restServletName;
        const offset = FccGlobalConstant.LENGTH_0;
        const limit = this.fccGlobalConstantService.getStaticDataLimit();
        const completePath = baseUrl + `/access-permissions?limit=${limit}&offset=${offset}`;
        return this.http.get<any>(completePath, { headers, observe: 'response' });
      }

      // Checks if the permission is there or not in the user permissions list
      public getUserPermissionFlag(key: string) {
        for (const element in this.userPermissions) {
          if (this.userPermissions[element].actionAllowed === key) {
            return true;
          }
        }
        return false;
      }

      public getUserPermissionFlagGlobalCheck(key: string) {
        for (const element in this.userPermissions) {
          // entity-less user doesnt have shortName
          const hasShortName = this.isNonEmptyValue(this.userPermissions[element].shortName) ? true : false;
          if(hasShortName) {
          if (this.userPermissions[element].actionAllowed === key && this.userPermissions[element].shortName !== 'global') {
              return true;
            }
          } else {
            if (this.userPermissions[element].actionAllowed === key) {
              return true;
            }
          }
        }
        return false;
      }

      public getUserEntityPermissionFlag(key: string, shortName: string) {
        for (const element in this.userPermissions) {
          if (this.isnonEMptyString(shortName) &&
            (this.userPermissions[element].shortName === shortName && this.userPermissions[element].actionAllowed === key )) {
            return true;
          }
        }
        return false;
      }

      // Loads the user permissions if not available and returns the input permission availability
      public getUserPermission(key: string) {
        return new Observable(subscriber => {
          if (Object.keys(this.userPermissions).length > 0) {
            subscriber.next(this.getUserPermissionFlag(key));
          } else {
            this.loadUserPermissions().subscribe(data => {
              this.userPermissions = data.body.items;
              this.setPermissionAsEntityMap(data.body.items);
              subscriber.next(this.getUserPermissionFlag(key));
            });
          }
        });
      }

      // loads the user permissions if not available and updates input the permission map with user permissions
      getButtonPermission(buttonPermission): Observable<any> {
        return new Observable(subscriber => {
          if (Object.keys(this.userPermissions).length > 0) {
            subscriber.next(this.getButtonPermissionFlag(buttonPermission));
          } else {
            this.loadUserPermissions().subscribe(data => {
              this.userPermissions = data.body.items;
              this.setPermissionAsEntityMap(data.body.items);
              subscriber.next(this.getButtonPermissionFlag(buttonPermission));
            });
          }
        });
      }

      setPermissionAsEntityMap(permissionObject: any) {
        for (const permissionObj of permissionObject) {
          if (this.userPermissionsByEntityMap.has(permissionObj[`${FccGlobalConstant.SHORT_NAME}`])){
            const map = this.userPermissionsByEntityMap.get(permissionObj[`${FccGlobalConstant.SHORT_NAME}`]);
            map.set(permissionObj[`${FccGlobalConstant.ACTION_ALLOWED}`], true);
            this.userPermissionsByEntityMap.set(permissionObj[`${FccGlobalConstant.SHORT_NAME}`], map);
          } else{
            const map = new Map<string, boolean>();
            map.set(permissionObj[`${FccGlobalConstant.ACTION_ALLOWED}`], true);
            this.userPermissionsByEntityMap.set(permissionObj[`${FccGlobalConstant.SHORT_NAME}`], map);
          }
        }
      }

      checkUserPermissionByEntity(entity: string, permission: string): boolean {
        if (this.userPermissionsByEntityMap.has(entity)) {
          const valueMap = this.userPermissionsByEntityMap.get(entity);
          if (valueMap.has(permission)) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }

      // updates input the permission map with user permissions
      getButtonPermissionFlag(buttonPermission): any {
        for (const [key] of buttonPermission) {
          if ( this.getUserPermissionFlag(key)) {
            buttonPermission.set(key, true);
          }
        }
        return buttonPermission;
      }

      savePaymentBeneficiaryDetails(requestPayload: any) {
        const obj = {};
        let iKey = sessionStorage.getItem(FccGlobalConstant.idempotencyKey);
        if (this.isEmptyValue(iKey)) {
          iKey = this.fccGlobalConstantService.generateUIUD();
          sessionStorage.setItem(FccGlobalConstant.idempotencyKey, iKey);
        }
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        obj[FccGlobalConstant.idempotencyKey] = iKey;
        const headers = new HttpHeaders(obj);
        const completePath = this.fccGlobalConstantService.paymentBeneficiaryDetails;
        return this.http.post<any>(completePath, requestPayload, { headers, observe: 'response' });
      }

      updatePaymentBeneficiaryDetails(requestPayload: any, groupId?: any) {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        const completePath = this.fccGlobalConstantService.updatePaymentBeneficiaryDetails + groupId;
        return this.http.put<any>(completePath, requestPayload, { headers });
      }

      public getPaymentBeneficiaryDetails(beneGroupId: string, event: string): Observable<any> {
        const url = this.fccGlobalConstantService.paymentBeneficiaryDetails;
        const headers = this.getCacheEnabledHeaders();
        const reqURl = `${url}/${beneGroupId}?event=${event}`;
        return this.http.get<any>( reqURl, { headers } );
      }

      fcmBeneficiaryCreation(requestPayload: any) {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        obj['X-Request-ID'] = this.fccGlobalConstantService.generateUIUD();
        obj[FccGlobalConstant.idempotencyKey] = requestPayload.idempotencyKey;
        const headers = new HttpHeaders(obj);
        this.submitButtonEnable.next(false);
        if (requestPayload.requestType === FccGlobalConstant.ADD_FEATURES) {
          const completePath = this.fccGlobalConstantService.fcmBeneficiaryCreation;
          return this.http.post<any>(completePath, requestPayload.request, { headers, observe: 'response' });
        } else if (requestPayload.requestType === FccGlobalConstant.UPDATE_FEATURES) {
          const completePath = this.fccGlobalConstantService.fcmBeneficiaryUpdation;
          return this.http.put<any>(completePath, requestPayload.request, { headers, observe: 'response' });
        }
      }

      persistFormDetails(request: any) {
        let iKey = sessionStorage.getItem(FccGlobalConstant.idempotencyKey);
        this.mode = this.getQueryParametersFromKey(FccGlobalConstant.MODE);
        const tnxid = request.common ? request.common.tnxid : '';
        if (!this.isnonEMptyString(tnxid)) {
          if (iKey === null) {
            iKey = this.fccGlobalConstantService.generateUIUD();
            sessionStorage.setItem(FccGlobalConstant.idempotencyKey, iKey);
          }
        } else {
            iKey = null;
        }
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        if (!this.isnonEMptyString(tnxid)) {
          obj[FccGlobalConstant.idempotencyKey] = iKey;
        }
        if (this.eTagVersion) {
          obj['If-Match'] = this.eTagVersion;
        }
        const headers = new HttpHeaders(obj);
        const completePath = this.fccGlobalConstantService.baseUrl + 'genericsave';
        return this .http.post<any>(completePath, request, { headers, observe: 'response' });
      }

      public loadPdfConfiguration(): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        obj[this.cacheRequest] = 'true';
        const headers = new HttpHeaders(obj);
        const completePath = this.fccGlobalConstantService.getPdfConfigurations;
        return this.http.get<any>(completePath, { headers });
      }

      public getAmendmentNo(requestPayload: any): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        const completePath = this.fccGlobalConstantService.getAmendmentNo;
        return this.http.post<any>(completePath, requestPayload, { headers });
      }

      public getBankDetails(): Observable<any> {
        const completePath = this.fccGlobalConstantService.bankDetailsForPdf;
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        obj[FccGlobalConstant.REQUEST_FORM] = FccGlobalConstant.REQUEST_INTERNAL;
        obj[this.cacheRequest] = 'true';
        const headers = new HttpHeaders(obj);
        return this.http.get<any>(completePath, { headers });
      }

      public getBankDateAndTime(): Observable<any> {
        const completePath = this.fccGlobalConstantService.bankDateAndTime;
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        obj[FccGlobalConstant.REQUEST_FORM] = FccGlobalConstant.REQUEST_INTERNAL;
        obj[this.cacheRequest] = 'true';
        const headers = new HttpHeaders(obj);
        return this.http.get<any>(completePath, { headers });
      }

      getPermissionName(productCode: string, suffix: string, subProductCode?: string): string {
        let permission;
        if (subProductCode && subProductCode !== '' && subProductCode !== null && subProductCode !== 'undefined') {
          permission = productCode.toLowerCase().concat('_').concat(subProductCode).toLowerCase().concat('_').concat(suffix);
        } else {
          permission = productCode.toLowerCase().concat('_').concat(suffix);
        }
        return permission;
      }

      formatForm(form: FCCFormGroup) {
        Object.keys(form.controls).forEach(fieldName => {
          const fieldControl = form.get(fieldName);
          if ((fieldControl.value !== undefined && fieldControl.value === FccGlobalConstant.BLANK_SPACE_STRING) ||
              (fieldControl[FccGlobalConstant.TYPE] === FccGlobalConstant.VIEW_MODE_TYPE && fieldControl.value === null)) {
            fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            form.get(fieldName).updateValueAndValidity();
          } else if (fieldControl[FccGlobalConstant.TYPE] === FccGlobalConstant.VIEW_MODE_TYPE && fieldControl.value !== undefined &&
            fieldControl.value !== FccGlobalConstant.BLANK_SPACE_STRING && fieldControl.value !== null &&
            fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] !== false
            ){
            fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            form.get(fieldName).updateValueAndValidity();
          }
        });
      }

      /**
       *  @param fieldname of the form
       */
      isNonEmptyField(fieldName: any, form: FCCFormGroup) {
        return (form.get(fieldName) !== undefined && form.get(fieldName) !== null);
      }

       /**
        * @param fieldname of the form
        */
      isNonEmptyValue(fieldValue: any) {
        return (fieldValue !== undefined && fieldValue !== null);
      }

      isEmptyValue(fieldValue: any) {
        return (fieldValue === undefined || fieldValue === null || fieldValue === FccGlobalConstant.EMPTY_STRING);
      }

      isnonEMptyString(fieldValue: any) {
      return (fieldValue !== undefined && fieldValue !== null && fieldValue !== '' );
      }

      isnonBlankString(fieldValue: any) {
        return (fieldValue !== undefined && fieldValue !== null && fieldValue.trim() !== '' );
      }

      /**
       *  Formats grouped values in listgin screen rows based on if type is export or otherwise
       *  Example 3 entites linked to an account can be formatted as entityABC(+2)
       */
      formatGroupedColumns(type: string, groupedValues: string): string {
        let formattedColumnVal = FccGlobalConstant.EMPTY_STRING;
        if (type !== 'export') {
          if (groupedValues.indexOf(',') > 0) {
            const splittedArray = groupedValues.split(',');
            formattedColumnVal += formattedColumnVal + splittedArray[0] + '(+' + (splittedArray.length - 1) +
            ')';
          }
          else {
            formattedColumnVal = groupedValues;
          }
        } else {
          formattedColumnVal = groupedValues;
        }
        return formattedColumnVal;
      }

      public isIBANValid(country?: string, currency?: string, accountNo?: string): Observable<any> {
        const url = this.fccGlobalConstantService.isIBANValid;
        const headers = this.getCacheEnabledHeaders();
        const reqURl = `${url}?country=${country}&currency=${currency}&accountNo=${accountNo}`;
        return this.http.get<any>( reqURl, { headers } );
        }

      /**
       *  @param fieldname of the form
       */
      clearValidatorsAndUpdateValidity(fieldName: any, form: FCCFormGroup) {
        form.get(fieldName).clearValidators();
        form.get(fieldName).updateValueAndValidity();

      }

      // Pass the fields name as parameter. This method sets the fields value to null
      setFieldValuesToNull(fieldName: any[], form: FCCFormGroup) {
        let index: any;
        for (index = 0; index < fieldName.length; index++) {
          form.controls[fieldName[index]].setValue('');
        }
      }

      checkSettlementCurAndBaseCur( form: any) {
        this.getCorporateDetailsAPI(FccGlobalConstant.REQUEST_INTERNAL).subscribe(response => {
          if (response.status === FccGlobalConstant.HTTP_RESPONSE_SUCCESS) {
            this.corporateDetails = response.body;
            this.companyBaseCurrency = this.corporateDetails.baseCurrency;
            this.settlementCurCode = form.get('currency').value;
            if (form.get('forwardContract') && (this.settlementCurCode === this.companyBaseCurrency)) {
              form.get('forwardContract')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
              form.updateValueAndValidity();
            }
          }
        });
      }

      convertToDateFormat(dateEntered: string): Date {
        let dateObject = new Date();
        if (dateEntered !== '' && dateEntered != null) {
          const dateParts = dateEntered.split('/');
          const userLanguage = window[FccGlobalConstant.USER_LANGUAGE];
          if (userLanguage === FccGlobalConstant.LANGUAGE_US) {
            dateObject = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[0] - 1, +dateParts[1]);
          } else {
            dateObject = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[1] - 1, +dateParts[0]);
          }
        }
        return dateObject;
      }

      public deleteEL(elTnxId: string): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        return this.http.delete<any>(this.fccGlobalConstantService.deleteEL + elTnxId, { headers , observe: 'response' });
      }
      public deleteBG(bgTnxId: string): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        return this.http.delete<any>( this.fccGlobalConstantService.deleteEL + bgTnxId, { headers , observe: 'response' });
      }
      markAccountAsFav(accountId: string): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        return this.http.post<any>(this.fccGlobalConstantService.addFavAccount + accountId, { headers , observe: 'response' });
      }

      markAccountAsUnFav(accountId: string): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        return this.http.delete<any>(this.fccGlobalConstantService.delFavAccount + accountId, { headers , observe: 'response' });
      }


      public audit(request): Observable<any> {
        const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
        const completePath = this.fccGlobalConstantService.getAudit();
        const requestPayload = request;
        return this.http.post<any>(completePath, requestPayload, { headers });
      }

      replacePhraseText(text: string) {
       if (this.isNonEmptyValue(text))
       {
        const tempArray = text.split('');
        for (let i = 0; i < tempArray.length; i++) {
          if (tempArray[i] === 'n' && tempArray[i - 1] === '\\') {
            tempArray[i] = '&#10;';
            tempArray[i - 1] = '';
          } else if (tempArray[i] === '\\' && tempArray[i - 1] === '\\') {
            tempArray[i] = '\\';
            tempArray[i - 1] = '';
          } else if (tempArray[i] === '\'' && tempArray[i - 1] === '\\') {
            tempArray[i] = '\'';
            tempArray[i - 1] = '';
        }
      }
        const temp = tempArray.join('').toString();
        return temp;
      }
      return "";
    }

      getUnifiedWidget() {
        const headers = this.getCacheEnabledHeaders();
        const reqPath = this.fccGlobalConstantService.getUnifiedWidget;
        return this.http.get<any>(reqPath, { headers });
     }

    convertNumberToTimePattern(time :any) {
      const mystring = time.replace(/(..?)/g, '$1:').slice(0,-1);
      let hour = (mystring.split(':'))[0];
      let min = (mystring.split(':'))[1];
      const part = hour >= 12 ? 'PM' : 'AM';
      if (parseInt(hour) == 0){
      hour = 12;
      }
      min = (min+'').length == 1 ? `0${min}` : min;
      hour = hour > 12 ? hour - 12 : hour;
      hour = (hour+'').length == 1 ? `0${hour}` : hour;
      return hour + '.' + min + part;
    }

    convertNumberToTime(time: any){
      const mystring = time.replace(/(..?)/g, '$1:').slice(0,-1);
      const hour = (mystring.split(':'))[0];
      const min = (mystring.split(':'))[1];
      return hour + ':' + min;
    }

    calculateMaxDate(days: any){
      const currentTimeAsMs = Date.now();
      const adjustedTimeAsMs = currentTimeAsMs + (1000 * 60 * 60 * 24 * days);
      const adjustedDateObj = new Date(adjustedTimeAsMs);
      const year = adjustedDateObj.getFullYear();
      const month = adjustedDateObj.getMonth();
      const date = adjustedDateObj.getDate();
      return new Date(year , month, date);
    }

    checkHoliday(startDate: Date, holidayList: any) {
      let flag = false;
      holidayList?.forEach((date) => {
        if(startDate.getDate() === new Date(date).getDate() && startDate.getMonth() === new Date(date).getMonth() &&
        startDate.getFullYear() === new Date(date).getFullYear()) {
          if (!flag) {
            flag = true;
          }
        }
      });
      return flag;
    }

    getImmediateWorkingDate(response: any, startDate: Date, holidayList: any) {
      let flag = true;
      while(flag) {
        if (startDate?.getDay() === 1) {
          if (response[0]?.monday_flag === FccGlobalConstant.CODE_Y || this.checkHoliday(startDate, holidayList)) {
            startDate = new Date(new Date().setDate(startDate.getDate() + 1));
          } else {
            flag = false;
            return startDate;
          }
        } else if (startDate?.getDay() === 2) {
          if (response[0]?.tuesday_flag === FccGlobalConstant.CODE_Y || this.checkHoliday(startDate, holidayList)) {
            startDate = new Date(new Date().setDate(startDate.getDate() + 1));
          } else {
            flag = false;
            return startDate;
          }
        } else if (startDate?.getDay() === 3) {
          if (response[0]?.wednesday_flag === FccGlobalConstant.CODE_Y || this.checkHoliday(startDate, holidayList)) {
            startDate = new Date(new Date().setDate(startDate.getDate() + 1));
          } else {
            flag = false;
            return startDate;
          }
        } else if (startDate?.getDay() === 4) {
          if (response[0]?.thursday_flag === FccGlobalConstant.CODE_Y || this.checkHoliday(startDate, holidayList)) {
            startDate = new Date(new Date().setDate(startDate.getDate() + 1));
          } else {
            flag = false;
            return startDate;
          }
        } else if (startDate?.getDay() === 5) {
          if (response[0]?.friday_flag === FccGlobalConstant.CODE_Y || this.checkHoliday(startDate, holidayList)) {
            startDate = new Date(new Date().setDate(startDate.getDate() + 1));
          } else {
            flag = false;
            return startDate;
          }
        } else if (startDate?.getDay() === 6) {
          if (response[0]?.saturday_flag === FccGlobalConstant.CODE_Y || this.checkHoliday(startDate, holidayList)) {
            startDate = new Date(new Date().setDate(startDate.getDate() + 1));
          } else {
            flag = false;
            return startDate;
          }
        } else if (startDate?.getDay() === 0) {
          if (response[0]?.sunday_flag === FccGlobalConstant.CODE_Y || this.checkHoliday(startDate, holidayList)) {
            startDate = new Date(new Date().setDate(startDate.getDate() + 1));
          } else {
            flag = false;
            return startDate;
          }
        } else {
          if (this.checkHoliday(startDate, holidayList)) {
            startDate = new Date(new Date().setDate(startDate.getDate() + 1));
          } else {
            flag = false;
            return startDate;
          }
        }
      }
    }

    fetchDynamicPhrases(request: any) {
      const obj = {};
      obj[this.contentType] = FccGlobalConstant.APP_JSON;
      const headers = new HttpHeaders(obj);
      const completePath = this.fccGlobalConstantService.dynamicPhrases;
      return this .http.post<any>(completePath, request, { headers, observe: 'response' });
    }

    replaceCurrency(amount: any) {
      const lang = localStorage.getItem('language');
      if (amount !== null && amount !== undefined && lang === 'fr') {
            let updateAmount = amount.replace(/,/g, '.');
            updateAmount = updateAmount.replace(/ /g, '');
            if((updateAmount.match(/[^0-9.]/g)) !== null){
              updateAmount = updateAmount.replace(/[^0-9.]/g, '');
            }
            return updateAmount.replace(/[^0-9. ]/g, '');
      } else if (amount !== null && amount !== undefined && lang === FccGlobalConstant.LANGUAGE_AR) {
          const updateAmount = amount.replace(/٫/g, '.');
          amount = updateAmount.replace(/٬/g, ',');
          if((amount.match(/[^0-9.]/g)) !== null){
            return amount.replace(/[^0-9.]/g, '');
          } else {
            return amount.replace(/,/g, '');
          }
      } else if (amount !== null && amount !== undefined) {
          return amount.replace(/[^0-9.]/g, '');
      }
      return '';
    }

    currencyReplace(amount: any) {
      const lang = localStorage.getItem('language');
      if(lang === FccGlobalConstant.LANGUAGE_FR) {
        if (amount !== null && amount !== undefined && amount.match(/[^0-9.,]/g) !== null) {
          return '';
        }
        else {
          amount = amount.replace(/,/g, '.');
          return amount;
        }
      } else if(lang === FccGlobalConstant.LANGUAGE_AR) {
        if (amount !== null && amount !== undefined && amount.match(/[^0-9.,٫٬]/g) !== null) {
          return '';
        }
        else {
          amount = amount.replace(/,/g, '.');
          amount = amount.replace(/٫/g, '.');
          amount = amount.replace(/٬/g, '.');
          return amount;
        }
      } else if (amount !== null && amount !== undefined && amount.match(/[^0-9.]/g) !== null) {
        return '';
      }
      return amount;
    }

    getChatConfigurationDetails() {
      const headers = this.getCacheEnabledHeaders();
      const reqPath = this.fccGlobalConstantService.chatConfigUrl;
      return this.http.get<any>(reqPath, { headers });
    }

    getSpeechText(base64: any): Observable<any> {
      const reqURl = this.fccGlobalConstantService.speechtoTextUrl;
      return this.http.post<any>(reqURl, base64);
    }

    countInputChars(strResult, length?) {
      this.enteredCharCountBtBTemp = 0;
      let DATA_LENGTH = FccGlobalConstant.LENGTH_35;
      if (this.isnonEMptyString(length)){
        DATA_LENGTH = length;
      }
      if (strResult && (strResult.indexOf('\n') > -1 || strResult.indexOf('\r') > -1)) {
        const strInputArray = strResult.split('\n');
        let k = 0;
        for (let i = 0; i < strInputArray.length - 1; i++) {
            const strInputText = strInputArray[i];
            this.enteredCharCountBtBTemp +=
            ((Math.trunc(strInputText.length / (DATA_LENGTH + 1))) + FccGlobalConstant.LENGTH_1) * DATA_LENGTH;
            k++;
        }
        if (k === strInputArray.length - 1) {
          this.enteredCharCountBtBTemp += strInputArray[k].length;
        }
        return this.enteredCharCountBtBTemp;
      } else {
          this.enteredCharCountBtBTemp = strResult ? strResult.length : 0;
          return this.enteredCharCountBtBTemp;
      }
  }

  checkPendingClientBankViewForAmendTnx(): boolean {
    const tnxTypeCode = this.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const mode = this.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const operation = this.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    const tnxId = this.getQueryParametersFromKey(FccGlobalConstant.TNXID);
    const eventTnxStatCode = this.getQueryParametersFromKey(FccGlobalConstant.eventTnxStatCode);
    let returnValue = true;
    if (tnxTypeCode === FccGlobalConstant.N002_AMEND && mode === FccGlobalConstant.VIEW_SCREEN &&
      operation === FccGlobalConstant.PREVIEW && tnxId !== '' &&
      (eventTnxStatCode === FccGlobalConstant.N002_NEW || // eventTnxStatCode === FccGlobalConstant.N002_UPDATE ||
      //eventTnxStatCode === FccGlobalConstant.N002_AMEND //check the impact of removing this code.
         eventTnxStatCode === FccGlobalConstant.N002_EXTEND
         )) {
        returnValue = false;
    }
    return returnValue;
  }

  checkValidFileExtension(fileExt, validFileExtensions): boolean {
    for (let i = 0; i < validFileExtensions.length; i++) {
      const ext: string = validFileExtensions[i].toLowerCase();
      if (ext.trim() === fileExt.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  checkCashProduct(productCode: string, subProductCode: string) {
    const ftSubProductList = [
      FccGlobalConstant.N047_INTERNAL_TRANSFER,
      FccGlobalConstant.N047_THIRD_PARTY_TRANSFER,
      FccGlobalConstant.N047_DOMESTIC_TRANSFER,
      FccGlobalConstant.N047_INDIA_DOMESTIC_TRANSFER,
      FccGlobalConstant.N047_SINGAPORE_DOMESTIC_TRANSFER,
      FccGlobalConstant.N047_HK_RTGS,
      FccGlobalConstant.N047_MT101,
      FccGlobalConstant.N047_MT103,
      FccGlobalConstant.N047_FI103,
      FccGlobalConstant.N047_FI202,
      FccGlobalConstant.N047_BILLP,
      FccGlobalConstant.N047_BILLS,
      FccGlobalConstant.N047_DDA,
      FccGlobalConstant.N047_PICO,
      FccGlobalConstant.N047_PIDD,
      FccGlobalConstant.N047_HVPS,
      FccGlobalConstant.N047_HVXB,
      FccGlobalConstant.N047_BANKB
    ];
    this.cashProductDetailsMap.set(FccGlobalConstant.PRODUCT_FT, ftSubProductList);
    if (this.cashProductDetailsMap.get(productCode)
      && this.cashProductDetailsMap.get(productCode).indexOf(subProductCode) > -1) {
      return true;
    }
    return false;
  }

  getAmendXML(prodCode): string[]{
    const amendXML = AmendTransactionsMap.mappings[prodCode];
    return amendXML;
  }

  getFileExtPath(fileName: string) {
    const fileExtn = fileName.split('.').pop().toLowerCase();
    const path = `${this.getContextPath()}`;
    const alt = `" alt = "`;
    const imgSrcStartTag = '<img src="';
    const endTag = '"/>';
    const pdfFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.PDF_IMG_PATH).concat(alt)
    .concat(`${this.translate.instant(FccGlobalConstant.PDF_ALT)}`).concat(endTag);
    const docFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.DOC_IMG_PATH).concat(alt)
    .concat(`${this.translate.instant(FccGlobalConstant.DOC_ALT)}`).concat(endTag);
    const xlsFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.XLS_IMG_PATH).concat(alt)
    .concat(`${this.translate.instant(FccGlobalConstant.XSL_ALT)}`).concat(endTag);
    const xlsxFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.XLSX_IMG_PATH).concat(alt)
    .concat(`${this.translate.instant(FccGlobalConstant.XSLS_ALT)}`).concat(endTag);
    const pngFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.PNG_IMG_PATH).concat(alt)
    .concat(`${this.translate.instant(FccGlobalConstant.PNG_ALT)}`).concat(endTag);
    const jpgFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.JPG_IMG_PATH).concat(alt)
    .concat(`${this.translate.instant(FccGlobalConstant.JPG_ALT)}`).concat(endTag);
    const txtFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.TXT_IMG_PATH).concat(alt)
    .concat(`${this.translate.instant(FccGlobalConstant.TXT_ALT)}`).concat(endTag);
    const zipFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.ZIP_IMG_PATH).concat(alt)
    .concat(`${this.translate.instant(FccGlobalConstant.ZIP_ALT)}`).concat(endTag);
    const rtgFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.RTF_IMG_PATH).concat(alt)
    .concat(`${this.translate.instant(FccGlobalConstant.RTF_ALT)}`).concat(endTag);
    const csvFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.CSV_IMG_PATH).concat(alt)
    .concat(`${this.translate.instant(FccGlobalConstant.CSV_ALT)}`).concat(endTag);
    const rarFilePath = imgSrcStartTag.concat(path).concat(FccGlobalConstant.RAR_IMG_PATH).concat(alt)
    .concat(`${this.translate.instant(FccGlobalConstant.RAR_ALT)}`).concat(endTag);
    switch (fileExtn) {
      case 'pdf':
        return pdfFilePath;
      case 'docx':
      case 'doc':
        return docFilePath;
      case 'xls':
        return xlsFilePath;
      case 'xlsx':
        return xlsxFilePath;
      case 'png':
        return pngFilePath;
      case 'jpg':
        return jpgFilePath;
      case 'jpeg':
        return jpgFilePath;
      case 'txt':
        return txtFilePath;
      case 'zip':
        return zipFilePath;
      case 'rtf':
        return rtgFilePath;
      case 'csv':
        return csvFilePath;
      case 'rar':
        return rarFilePath;
      default:
        return fileExtn;
    }
  }

  getSwiftVersionValue() {
    this.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        if ( response.swiftVersion ) {
          this.swiftVersion = response.swiftVersion;
        }
      }
    });
  }

  getDashboardUrl() {
    this.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        if ( response.globalDashboardUrl ) {
         this.globalDashboardUrl = response.globalDashboardUrl;
        }
     }
  });
 }

  getSwiftNarrativeFilterValues(){
    this.loadDefaultConfiguration().subscribe(response => {
      if(response){
        if(response.swiftNarrativeFilterValue){
          this.swiftNarrativeFilterValue = response.swiftNarrativeFilterValue;
        }
      }
    });
  }

  getCourierTrackingFeatureEnabled() {
    this.loadDefaultConfiguration().subscribe(response => {
      if (response?.courierTrackingFeatureEnabled) {
          this.isCourierTrackingFeatureEnabled = response.courierTrackingFeatureEnabled;
      }
    });
  }

  validateProductCodeWithRefId(productCode: any, refId: any) {
    if (refId !== undefined && refId !== null && refId !== '') {
      const prodCodeFromRefId = refId.substring(FccGlobalConstant.LENGTH_0, FccGlobalConstant.LENGTH_2);
      if (productCode && prodCodeFromRefId !== productCode) {
        this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
        this.getDashboardUrl();
        this.router.navigate([this.globalDashboardUrl]);
      });
      }
    }
  }
  /**
   * Set Entity Submit API
   */
  public setEntity(request): Observable<any> {
    const completePath = this.fccGlobalConstantService.setEntityURL;
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const requestPayload = request;
    return this.http.post<any>(completePath, requestPayload, { headers , observe: 'response' });
  }

  getNumberWithoutLanguageFormatting(amt: any) {
    if (this.isnonEMptyString(amt)) {
      amt = amt.split(FccGlobalConstant.COMMA).join('');
    }
    return amt;
  }

  async getBase64FDataFromFile(filePath) {
    const res = await fetch(filePath);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result);
      }, false);

      reader.onerror = () => reject(this);
      reader.readAsDataURL(blob);
    });
  }
  /**
   * Set Reference Submit API
   */
  public setReference(request, id): Observable<any> {
    const completePath = this.fccGlobalConstantService.setReferenceURL + id;
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const requestPayload = request;
    return this.http.post<any>(completePath, requestPayload, { headers , observe: 'response' });
  }

  public registerCustomMatIcons() {
    this.registerCustomMatIcon('accordion_expand_all', 'accordion_expand_all.svg');
    this.registerCustomMatIcon('accordion_collapse_all', 'accordion_collapse_all.svg');
    this.registerCustomMatIcon('filter_alt', 'filter_alt.svg');
    this.registerCustomMatIcon('pending_actions', 'pending_actions.svg');
    this.registerCustomMatIcon('drag_indicator', 'drag_indicator.svg');
    this.registerCustomMatIcon('download_centre', 'download_centre.svg');
    this.registerCustomMatIcon('accordion_expand_all_selected', 'accordion_expand_all_selected.svg');
    this.registerCustomMatIcon('accordion_collapse_all_selected', 'accordion_collapse_all_selected.svg');
  }

  protected registerCustomMatIcon(iconName: string, iconFileName: string) {
    const iconsPath = this.getContextPath() + '/content/FCCUI/assets/icons/';
    this.matIconRegistry.addSvgIcon(
      iconName,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`${iconsPath}${iconFileName}`)
    );
  }

  getRegexBasedOnlanguage() {
    const regexAmount = `${this.translate.instant('amountregex')}`;
    return regexAmount;
  }

  checkNegativeAmount(form: any, amtValue: any, amountField: any) {
    if (parseFloat(amtValue) < 0) {
      form.addFCCValidators(amountField,
        Validators.compose([Validators.required, invalidAmount]), 0);
      form.get(amountField).clearValidators();
      form.get(amountField).setErrors({ invalidAmt: true });
      form.get(amountField).markAsDirty();
      form.get(amountField).markAsTouched();
      return false;
    }
    return true;
  }

  checkRegexAmount(form: any, amtValue: any, amountField: any) {
    form.addFCCValidators(amountField,
      Validators.compose([Validators.pattern(this.getRegexBasedOnlanguage())]), 0);
    form.get(amountField).updateValueAndValidity();
    if (form.get(amountField).hasError('pattern')) {
      form.get(amountField).setErrors({ pattern : true });
      form.get(amountField).markAsDirty();
      form.get(amountField).markAsTouched();
      return false;
    }
    return true;
  }

  public changeUserLanguage(languageCode) {
    const headers = this.getCacheEnabledHeaders();
    const completePath = this.fccGlobalConstantService.getUserLanguageUrl();
    const requestPayload = {
      requestData: { language: languageCode.code }
    };
    return this.http.post<any>(completePath, requestPayload, { headers });
  }

  checkForBankName(stateService: any, form: any, bankDetails: any, issuingBank: any, incoTermRules: any, incoTermRulesMessage: any) {
    const bankNameValue = (stateService && stateService.getSectionData(bankDetails) &&
    stateService.getSectionData(bankDetails).get(issuingBank)) ?
    stateService.getSectionData(bankDetails).get(issuingBank).value :
    FccGlobalConstant.EMPTY_STRING;
    if (bankNameValue === FccGlobalConstant.EMPTY_STRING || (bankNameValue && (bankNameValue.bankNameList === undefined ||
      bankNameValue.bankNameList === null || bankNameValue.bankNameList === FccGlobalConstant.EMPTY_STRING))) {
        form.get(incoTermRules)[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING]
       = `${this.translate.instant(incoTermRulesMessage)}`;
    } else {
      form.get(incoTermRules)[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING]
      = FccGlobalConstant.EMPTY_STRING;
    }
  }

  getAllDeals(custReferences) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
          fromObject: {
            custReferences
          } });
    return this.http.get<any>(this.fccGlobalConstantService.getAllDeals, { headers , params, observe: 'response' });
  }

  getAllFacilities(dealIds, custReferences) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
          fromObject: {
            dealIds,
            custReferences
          } });
    return this.http.get<any>(this.fccGlobalConstantService.getAllFacilities, { headers , params, observe: 'response' });
  }

  getFacilityDetails(facilityId, custReferences) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
      fromObject: {
        custReferences
      } });
    return this.http.get<any>(this.fccGlobalConstantService.getFacilityDetails(facilityId), { headers , params, observe: 'response' });
  }

  getValidateBusinessDate(requestPayload) {
    return this.http.post<any>(this.fccGlobalConstantService.getValidateBusinessDate, requestPayload);
  }

  /**
   *  Save adhoc beneficiary
   */
  saveBeneficiary(counterpartyRequest: CounterpartyRequest) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[FccGlobalConstant.REQUEST_FORM] = FccGlobalConstant.REQUEST_INTERNAL;
    const headers = new HttpHeaders(obj);
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    return this.http.post<any>(this.fccGlobalConstantService.adhocCounterparties, counterpartyRequest, {
      headers
    });
  }

  validateValue(param: any) {
    let validValue = FccGlobalConstant.EMPTY_STRING;
    if (param !== undefined && param !== null) {
      validValue = param;
    }
    return validValue;
  }
  getAddressBasedOnParamData(parameterId: any, productCode: any, subProductCode?: any) {
    this.addressType = null;
    this.getParameterConfiguredValues(productCode, parameterId, subProductCode).subscribe(responseData => {
      if (responseData && responseData.paramDataList && responseData.paramDataList.length > FccGlobalConstant.LENGTH_0) {
         responseData.paramDataList.forEach(element => {
          if (element[FccGlobalConstant.KEY_1] && element[FccGlobalConstant.KEY_1] === productCode) {
            if (subProductCode && element[FccGlobalConstant.KEY_2] === subProductCode) {
              this.addressType = element[FccGlobalConstant.DATA_1];
            }
            this.addressType = this.addressType ? this.addressType : element[FccGlobalConstant.DATA_1];
          }
         });
         this.addressType = this.addressType ? this.addressType :
         responseData.paramDataList[FccGlobalConstant.LENGTH_0][FccGlobalConstant.DATA_1];
      }
    });
  }

  public redirectPage() {
    const dontShowRouter = 'dontShowRouter';
    let homeDojoUrl = '';
    this.getDashboardUrl();
    homeDojoUrl = this.fccGlobalConstantService.contextPath;
    homeDojoUrl = homeDojoUrl + this.fccGlobalConstantService.servletName + '#' + this.globalDashboardUrl;
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
  }

  handleComputedProductAmtFieldForAmendDraft(form: any, amtField: any) {
    let computedAmtValue = '';
    if (form.get(amtField) && form.get(amtField).value && (form.get(amtField).value).indexOf(FccGlobalConstant.BLANK_SPACE_STRING) > -1) {
      computedAmtValue = this.replaceCurrency(form.get(amtField).value).toString();
    }
    return computedAmtValue;
  }
  checkForSwiftEnabledProduct(productCode) {
    if (productCode === FccGlobalConstant.PRODUCT_BG) {
      return true;
    } else {
      return false;
    }
  }

  getCommitmentScheduledValues(reqParam: any): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
      fromObject: {
        facilityId: reqParam.facilityId,
        rolloverDate: reqParam.rolloverDate,
        facilityCurrency: reqParam.facilityCurrency,
        loanCurrency: reqParam.loanCurrency,
        loanAmount: reqParam.loanAmount
      }
    });
    return this.http.get<any>(this.fccGlobalConstantService.getCommitmentScheduledValue, {
      headers, params, observe: 'response'
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  patchFieldParameters(control: any, params: {}) {
    if (control == null || control === undefined) {
      return;
    }
    control.params = Object.assign(control.params, params);
    Object.keys(params).forEach(element => {
      if ('updateOptions' in control && element === 'options') {
        control.updateOptions();
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  patchFieldValueAndParameters(control: any, value: any, params: {}) {
    control.patchValue(value);
    control.updateValueAndValidity();
    this.patchFieldParameters(control, params);
  }

  setMandatoryField(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { required: flag });
  }
  setMandatoryFields(form, ids: string[], flag) {
    ids.forEach(id => this.setMandatoryField(form, id, flag));
  }



  isLoanBulk(productCode, subProdCode) {
    if (productCode === FccGlobalConstant.PRODUCT_BK
      && (subProdCode === FccGlobalConstant.SUB_PRODUCT_LNRPN || subProdCode === FccGlobalConstant.SUB_PRODUCT_BLFP )) {
      return true;
    }
    return false;
  }

  isExistingLoan(productCode: string, subTnxType: string, mode: string) {
    if ((mode === FccGlobalConstant.EXISTING || mode === FccGlobalConstant.PAYMENT)
      && productCode === FccGlobalConstant.PRODUCT_LN
      && (subTnxType === FccGlobalConstant.N003_INCREASE
      || subTnxType === FccGlobalConstant.N003_DRAWDOWN || subTnxType === FccGlobalConstant.N003_PAYMENT)
      ) {
      return true;
    }
    return false;
  }

  setParentTnxInformation(parentTnxObj: any) {
    if (parentTnxObj) {
      this.parentTnxObj.next(parentTnxObj);
    }
  }

  getParentTnxInformation() {
    return this.parentTnxObj;
  }


  setChildTnxInformation(childTnxObj: any) {
    if (childTnxObj) {
      this.childTnxObj.next(childTnxObj);
    }
  }

  getChildTnxInformation() {
    return this.childTnxObj;
  }

  setParentReference(parentReference: any) {
    if (parentReference) {
      this.parentReference.next(parentReference);
    }
  }

  setChildReference(childReference: any) {
    if (childReference) {
      this.childReference.next(childReference);
    }
  }

  getChildReference() {
    this.childReference.subscribe(
      (currentValue: any) => currentValue
    );
  }

  getChildReferenceAsObservable() {
    return this.childReference;
  }

  getParentReference() {
    this.parentReference.subscribe(
      (currentValue: any) => currentValue
    );
  }

  getParentReferenceAsObservable() {
    return this.parentReference;
  }

  openParentTransactionPopUp(
    parentProductCode: string, parentRefId: string, subProdCode?: string, tnxId?: string,
    tnxTypeCode?: string, eventTnxStatCode?: string, subTnxTypeCode?: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['view'], { queryParams: { tnxid: tnxId, referenceid: parentRefId,
        productCode: parentProductCode, subProductCode: subProdCode, tnxTypeCode,
        eventTnxStatCode, mode: FccGlobalConstant.VIEW_MODE,
        subTnxTypeCode,
        operation: FccGlobalConstant.PREVIEW } })
    );
    const popup = window.open('#' + url, '_blank');
    const productId = `${this.translate.instant(parentProductCode)}`;
    const mainTitle = `${this.translate.instant('MAIN_TITLE')}`;
    popup.onload = function() {
      popup.document.title = mainTitle + ' - ' + productId;
    };
  }

  openChildTransactionPopUp(
    childProductCode: string, childRefId: string, subProdCode?: string, tnxId?: string,
    tnxTypeCode?: string, eventTnxStatCode?: string, subTnxTypeCode?: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['view'], { queryParams: { tnxid: tnxId, referenceid: childRefId,
        productCode: childProductCode, subProductCode: subProdCode, tnxTypeCode,
        eventTnxStatCode, mode: FccGlobalConstant.VIEW_MODE,
        subTnxTypeCode,
        operation: FccGlobalConstant.PREVIEW } })
    );
    const popup = window.open('#' + url, '_blank');
    const productId = `${this.translate.instant(childProductCode)}`;
    const mainTitle = `${this.translate.instant('MAIN_TITLE')}`;
    popup.onload = function() {
      popup.document.title = mainTitle + ' - ' + productId;
    };
  }

  openChildTransactionInquiryScreen(childProductCode: string, childRefId: string,
    subProdCode?: string, tnxId?: string, tnxTypeCode?: string ) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['reviewScreen'], {
        queryParams: {
          tnxid: tnxId,
          referenceid: childRefId,
          mode: FccGlobalConstant.VIEW_MODE,
          tnxTypeCode: tnxTypeCode,
          productCode: childProductCode,
          subProductCode: subProdCode,
          operation: FccGlobalConstant.LIST_INQUIRY
        }
      })
      );
      this.router.navigate([]).then(() => {
        window.open('#' + url, '_self');
        window.location.reload();
      });
 }

  getUserAuditByTnx(tnxId): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    return this.http.get<any>(this.fccGlobalConstantService.getUserAuditByTnx(tnxId), { headers , observe: 'response' });
  }
  getUserAccountType(url: string): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[FccGlobalConstant.REQUEST_FORM] = FccGlobalConstant.REQUEST_INTERNAL;
    obj['cache-request'] = 'true';
    const headers = new HttpHeaders(obj);
    const reqURl = `${url}`;
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }

  getUserAccountIds(url: string, productCode?: string, subProdCode?: string): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[FccGlobalConstant.REQUEST_FORM] = FccGlobalConstant.REQUEST_INTERNAL;
    obj['cache-request'] = 'true';
    const headers = new HttpHeaders(obj);
    const reqURl = `${url}`;
    const offset = FccGlobalConstant.LENGTH_0;
    const limit = this.fccGlobalConstantService.getStaticDataLimit();
    const accountType = FccGlobalConstant.EMPTY_STRING;
    const ownerType = FccGlobalConstant.EMPTY_STRING;
    const product = productCode!=undefined ? productCode : FccGlobalConstant.EMPTY_STRING;
    const subProduct = subProdCode!=undefined ? subProdCode : FccGlobalConstant.EMPTY_STRING;
    const params = `?limit=${limit}&offset=${offset}&accountType=${accountType}&ownerType=${ownerType}` +
      `&productCode=${product}&subProductCode=${subProduct}`;
    return this.http.get<any>(reqURl + params, { headers , observe: 'response' });
  }

  updateUserEntities(form, stateService, multiBankService, taskService, dropdownAPIService, corporateCommonService) {
    multiBankService.getEntityList().forEach(entity => {
      this.entities.push(entity);
    });
    const valObj = dropdownAPIService.getDropDownFilterValueObj(this.entities, FccGlobalConstant.APPLICANT_ENTITY, form);
    if (valObj && valObj[this.VALUE] && !taskService.getTaskEntity()) {
      form.get(FccGlobalConstant.APPLICANT_ENTITY).patchValue(valObj[this.VALUE]);
      multiBankService.setCurrentEntity(valObj[this.VALUE].shortName);
    } else if (taskService.getTaskEntity()){
      form.get(FccGlobalConstant.APPLICANT_ENTITY).patchValue(taskService.getTaskEntity());
      form.get(FccGlobalConstant.APPLICANT_NAME).setValue(taskService.getTaskEntity().name);
    }

    if (this.entities.length === 0) {
      form.get(FccGlobalConstant.APPLICANT_NAME)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      if (form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)) {
          form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      }
      form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      if (form.get(FccGlobalConstant.APPLICANT_ENTITY)) {
        form.get(FccGlobalConstant.APPLICANT_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.setMandatoryField(form, FccGlobalConstant.APPLICANT_ENTITY, false);
        form.get(FccGlobalConstant.APPLICANT_ENTITY).clearValidators();
        form.get(FccGlobalConstant.APPLICANT_ENTITY).updateValueAndValidity();
      }
      if (this.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, form) &&
       (form.get(FccGlobalConstant.APPLICANT_NAME).value === undefined ||
        form.get(FccGlobalConstant.APPLICANT_NAME).value === null ||
        form.get(FccGlobalConstant.APPLICANT_NAME).value === FccGlobalConstant.EMPTY_STRING)) {
        corporateCommonService.getValues(this.fccGlobalConstantService.corporateDetails).subscribe(response => {
          if (response.status === this.responseStatusCode) {
            this.corporateDetails = response.body;
            form.get(FccGlobalConstant.APPLICANT_NAME).setValue(this.corporateDetails.name);
            if (this.addressType && this.addressType === FccGlobalConstant.POSTAL_ADDRESS_PA) {
              this.entityAddressType = FccGlobalConstant.POSTAL_ADDRESS;
            } else {
              this.entityAddressType = FccGlobalConstant.SWIFT_ADDRESS;
            }
            if (response.body[this.entityAddressType]) {
              if (!form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).value) {
                form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)
                .setValue(this.decodeHtml(response.body[this.entityAddressType].line1));
              }
              if (!form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).value) {
                form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)
                .setValue(this.decodeHtml(response.body[this.entityAddressType].line2));
              }
              if (!form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).value) {
                form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)
                .setValue(this.decodeHtml(response.body[this.entityAddressType].line3));
              }
            }
          }
        });
      }
      // this.patchFieldParameters(form.get('beneficiaryEntity'), {options: this.updateBeneficiaries(form) });

    } else if (this.entities.length === 1) {
      form.get(FccGlobalConstant.APPLICANT_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      form.get(FccGlobalConstant.APPLICANT_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue({ label: this.entities[0].value.label, name: this.entities[0].value.name,
         shortName: this.entities[0].value.shortName });
      form.get(FccGlobalConstant.APPLICANT_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      multiBankService.setCurrentEntity(this.entities[0].value.shortName);
      if (this.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, form) &&
      this.isEmptyValue(form.get(FccGlobalConstant.APPLICANT_NAME).value)){
        form.get(FccGlobalConstant.APPLICANT_NAME).setValue(this.entities[0].value.name);
      }
      form.get(FccGlobalConstant.APPLICANT_NAME)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      if (form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)) {
        form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      }
      form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      const address = multiBankService.getAddress(this.entities[0].value.shortName);
      if (!form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).value) {
        this.patchFieldValueAndParameters(form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
        address[this.address][this.addressLine1], {});
      }
      if (!form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).value) {
        this.patchFieldValueAndParameters(form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
        address[this.address][this.addressLine2], {});
      }
      if (!form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).value) {
        this.patchFieldValueAndParameters(form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
        address[this.address][this.addressLine3], {});
      }
      if (!form.get(FccGlobalConstant.APPLICANT_ADDRESS_4).value) {
        this.patchFieldValueAndParameters(form.get(FccGlobalConstant.APPLICANT_ADDRESS_4),
        address[this.address][this.addressLine4], {});
      }
    } else if (this.entities.length > 1) {
      form.get(FccGlobalConstant.APPLICANT_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      form.get(FccGlobalConstant.APPLICANT_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      // this.patchFieldParameters(form.get('beneficiaryEntity'), {options: [] });
      form.get(FccGlobalConstant.APPLICANT_NAME)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      if (form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)) {
          form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      }
      form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
    }
    // this.patchFieldParameters(form.get('beneficiaryEntity'), { options: this.updateBeneficiaries(form) });
    this.UpdateEntityBeni(form, stateService);
    this.removeMandatory([FccGlobalConstant.APPLICANT_ENTITY], form);
  }
  removeMandatory(fields: any, form) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(form, fields, false);
    }
  }

  UpdateEntityBeni(form, stateService) {
    if (this.lcResponseForm.applicant && this.lcResponseForm.applicant.entityShortName !== undefined && this.context === 'readonly') {
      form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue( this.entities.filter(
      task => task.label === this.lcResponseForm.applicant.entityShortName)[0].value);
      this.patchFieldParameters(form.get(FccGlobalConstant.APPLICANT_ENTITY), { readonly: true });
      // form.get('beneficiaryEntity').setValue( this.updatedBeneficiaries.filter(
      //   task => task.value.label === this.lcResponseForm.beneficiary.name)[0].value);
      // this.patchFieldParameters(form.get('beneficiaryEntity'), {readonly: true});
    }
    if (form.get(FccGlobalConstant.APPLICANT_ENTITY) && form.get(FccGlobalConstant.APPLICANT_ENTITY).value
    && this.context !== 'readonly') {
      const applicantEntity = stateService.getValue(FccGlobalConstant.APPLICANT_BENEFICIARY,
          FccGlobalConstant.APPLICANT_ENTITY, false);
      if (applicantEntity ) {
        const exist = this.entities.filter( task => task.value.label === applicantEntity);
        if (exist.length > 0) {
        form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue( this.entities.filter(
          task => task.value.label === applicantEntity)[0].value);
        } else {
          const applicantName = form.get(FccGlobalConstant.APPLICANT_NAME).value;
          if (this.isNonEmptyValue(applicantName) && applicantName !== '') {
            const exists = this.entities.filter( task => task.value.name === applicantName);
            if (exists.length > 0) {
              form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue( this.entities.filter(
                task => task.value.name === applicantName)[0].value);
            }
          }
        }
      }
    }
  }


  public generateToken(request?: any) {
    const headers = this.getCacheEnabledHeaders();
    const completePath = this.fccGlobalConstantService.generateTokenUrl;
    return this.http.post<any>(completePath, request, { headers });
  }

  public callDeepLinkURL(deepLinkURLType: any, token ?: any, url ?: any, payLoad ?: any): Observable<any> {
    let headers;
    let body;
    if (deepLinkURLType) {
      headers = { contentType: FccGlobalConstant.APP_JSON, SEC_TKN: token, Accept: 'text/html', Authorization: token };
      body = payLoad ;
      return this.http.request('POST', url, { body, headers , observe: 'response' , responseType: 'text' });
    } else {
      headers = { contentType: FccGlobalConstant.APP_JSON, Accept: 'text/html' };
      body = payLoad ;
      const reqURL = `${url}?SEC_TKN=${token}`;
      return this.http.request('POST', reqURL, { body, headers , observe: 'response' , responseType: 'text' });
    }
  }

  getAllAccountsMappedToGroup(filterValues: any) {
    this.filterParams = filterValues;
    return this.listDefService.getTableData(FccConstants.ACCOUNTS_MAPPED_TO_GROUP, JSON.stringify(this.filterParams), '');
  }
  setCompanyCaseSensitiveSearchEnabled(value: boolean) {
    this.isCompanyCaseSensitiveSearchEnabled = value;
  }

  getCompanyCaseSensitiveSearchEnabled() {
    return this.isCompanyCaseSensitiveSearchEnabled;
  }

  setUserCaseSensitiveSearchEnabled(value: boolean) {
    this.isUserCaseSensitiveSearchEnabled = value;
  }

  getUserCaseSensitiveSearchEnabled() {
    return this.isUserCaseSensitiveSearchEnabled;
  }

  setIsStaticAccountEnabled(isStaticAccountEnabled: boolean) {
    this.isStaticAccountEnabled = isStaticAccountEnabled;
  }
  getIsStaticAccountEnabled(): boolean {
    return this.isStaticAccountEnabled;
  }

  dealDetailsDashboardLoad(parameter: any) {
    this.dealDetailsBehaviourSubject.next(parameter);
  }

  setAmountFormatAbbvNameList(amountFormatAbbvNameList) {
    this.amountFormatAbbvNameList = amountFormatAbbvNameList;
  }

  getAmountFormatAbbvNameList() {
    return this.amountFormatAbbvNameList;
  }

  chequeViewDetailsLoad(parameter: any) {
    this.chequeViewDetails.next(parameter);
  }

  setIsMT700Upload(isMT700Upload: any) {
    this.isMT700Upload = isMT700Upload;
  }

  getIsMT700Upload(): any {
    return this.isMT700Upload;
  }

  public getNudges(widgetDetail, productCode?, subProductCode?): Promise<any>{
    return new Promise(async (resolver) => { // eslint-disable-line no-async-promise-executor
     const widgetDetails = this.isNonEmptyValue(widgetDetail) ? JSON.parse(widgetDetail) : {};
     if (this.isnonEMptyString(widgetDetails)) {
        await this.nudgesService.getNudges(widgetDetails.widgetName, productCode, subProductCode).then(data => {
       this.nudges = data.nudgetList ? data.nudgetList : [];
       for (let i = 0; i < this.nudges.length; i++) {
        this.getDeepLinkingData(this.nudges, i).then(response => {
          this.nudges = response;
          resolver(this.nudges);
        });
       }
     });
   }
   });
 }

 public getHyperLinks(widgetName): Promise<any>{
  return new Promise(async (resolver) => { // eslint-disable-line no-async-promise-executor
   if (this.isnonEMptyString(widgetName)) {
      await this.nudgesService.getNudges(widgetName).then(data => {
     this.nudges = data.nudgetList ? data.nudgetList : [];
     for (let i = 0; i < this.nudges.length; i++) {
      this.getDeepLinkingData(this.nudges, i).then(response => {
        this.nudges = response;
        resolver(this.nudges);
      });
     }
   });
 }
 });
}

  getDeepLinkingData(nudges, index): Promise<any>{
    return new Promise(async (resolver) => { // eslint-disable-line no-async-promise-executor
      this.deepLinkingSerice.getDeepLinking(nudges[index].productProcessor, nudges[index].urlKey).then(data => {
        if (data.deepLinkingDetails && data.deepLinkingDetails[0]
            && data.deepLinkingDetails[0].deepLinkingDataList.length > 0 && nudges.length > 0) {
          nudges[index].urlType = data.deepLinkingDetails[0].deepLinkingDataList[0].urlType;
          nudges[index].url = data.deepLinkingDetails[0].deepLinkingDataList[0].url;
          nudges[index].securityType = data.deepLinkingDetails[0].deepLinkingDataList[0].securityType;
          nudges[index].httpMethod = data.deepLinkingDetails[0].deepLinkingDataList[0].httpMethod;
          nudges[index].headerParameters = data.deepLinkingDetails[0].deepLinkingDataList[0].headerParameters;
          nudges[index].bodyParameters = data.deepLinkingDetails[0].deepLinkingDataList[0].bodyParameters;
          nudges[index].target = data.deepLinkingDetails[0].deepLinkingDataList[0].target;
          nudges[index].permission = data.deepLinkingDetails[0].deepLinkingDataList[0].permission;
          nudges[index].urlScreenType = data.deepLinkingDetails[0].deepLinkingDataList[0].urlScreenType;
          nudges[index].queryParameter = data.deepLinkingDetails[0].deepLinkingDataList[0].queryParameter;
          resolver(nudges);
        }
      });
    });
 }

 public getHyperLink(nudge: any): Promise<any> {
    return new Promise(async (resolver) => { // eslint-disable-line no-async-promise-executor
      this.getDeepLinkingDataForSingleNudge(nudge).then(response => {
        this.nudges = response;
        resolver(this.nudges);
      });
    });
  }

 getDeepLinkingDataForSingleNudge(nudge: any): Promise<any>{
  return new Promise(async (resolver) => { // eslint-disable-line no-async-promise-executor
    this.deepLinkingSerice.getDeepLinking(nudge.productProcessor, nudge.urlKey).then(data => {
      if (data.deepLinkingDetails && data.deepLinkingDetails[0]
          && data.deepLinkingDetails[0].deepLinkingDataList.length > 0 && nudge) {
        nudge.urlType = data.deepLinkingDetails[0].deepLinkingDataList[0].urlType;
        nudge.url = data.deepLinkingDetails[0].deepLinkingDataList[0].url;
        nudge.securityType = data.deepLinkingDetails[0].deepLinkingDataList[0].securityType;
        nudge.httpMethod = data.deepLinkingDetails[0].deepLinkingDataList[0].httpMethod;
        nudge.headerParameters = data.deepLinkingDetails[0].deepLinkingDataList[0].headerParameters;
        nudge.bodyParameters = data.deepLinkingDetails[0].deepLinkingDataList[0].bodyParameters;
        nudge.target = data.deepLinkingDetails[0].deepLinkingDataList[0].target;
        nudge.permission = data.deepLinkingDetails[0].deepLinkingDataList[0].permission;
        nudge.urlScreenType = data.deepLinkingDetails[0].deepLinkingDataList[0].urlScreenType;
        nudge.queryParameter = data.deepLinkingDetails[0].deepLinkingDataList[0].queryParameter;
        resolver(nudge);
      }
    });
  });
}
 getFCMProductCode(option, tabName){
  if (option === 'BENEFICIARY_MASTER_MAINTENANCE_MC' && tabName === FCMPaymentsConstants.SINGLE_TAB){
      return FccGlobalConstant.PRODUCT_BM;
  } else if (option === 'BENEFICIARY_MASTER_MAINTENANCE_MC' && tabName === FCMPaymentsConstants.BULK_TAB) {
    return FccConstants.PRODUCT_BB;
  } else if (option === 'PAYMENTS' && tabName === FCMPaymentsConstants.SINGLE_TAB) {
    return FccConstants.PRODUCT_IN;
  } else if (option === 'PAYMENTS' && tabName === FCMPaymentsConstants.BULK_TAB) {
    return FccConstants.PRODUCT_PB;
  } else {
    return '';
  }
}

navigateToLink(item) {
  // To be used for Post requests SSO (Ex: Download statement)
  if (item.httpMethod.toUpperCase() === FccConstants.POST){
    this.generateToken().subscribe(response => {
      if (response) {
        const ssoToken = response.SSOTOKEN;
        const queryParameter = item.queryParameter;
        const headerType = item.headerParameters as string;
        if (headerType.toUpperCase() === FccConstants.HEADER && queryParameter){
          const headerObject = {
            [queryParameter] : ssoToken
          };
          const headers = new HttpHeaders(headerObject);
          return this.http.post<any>(item.url, item.bodyParameters, { headers });
        } else if (item.headerParameters === 'url' && queryParameter){
          const url = item.url + '?' + queryParameter + '=' + ssoToken;
          return this.http.post<any>(url, item.bodyParameters);
        }
      }
  });
  } else if (item.urlType === FccGlobalConstant.INTERNAL && this.isNonEmptyValue(item.urlScreenType)
  && item.urlScreenType !== '') {
    this.displayDialog = false;
    const urlScreenType = item.urlScreenType as string;
    if (urlScreenType.toUpperCase() === FccGlobalConstant.ANGULAR_UPPER_CASE) {
      window.scrollTo(0, 0);
      this.router.navigate([]).then(() => {
        window.open(item.url, FccGlobalConstant.SELF);
      });
    } else {
      const urlContext = this.getContextPath();
      const dojoUrl = urlContext + this.fccGlobalConstantService.servletName + item.url;
      this.router.navigate([]).then(() => {
        window.open(dojoUrl, FccGlobalConstant.SELF);
      });
    }
  } else if (item.urlType === FccGlobalConstant.EXTERNAL) {
    if (item.securityType === FccGlobalConstant.SSO) {
      this.generateToken().subscribe(response => {
        if (response) {
          const ssoToken = response.SSOTOKEN;
          const queryParameter = item.queryParameter;
          const headerObject = {
            [queryParameter] : ssoToken
          };
          const headers = new HttpHeaders(headerObject);
          this.http.get<any>(item.url, { headers }).subscribe( () => {
            window.open(item.url, FccGlobalConstant.BLANK);
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (error) => {
            window.open(item.url, FccGlobalConstant.BLANK);
          }
          );
        }
      });
    }else {
      window.open(item.url, FccGlobalConstant.BLANK);
    }
  } else if (item.urlType === FccGlobalConstant.IFRAME) {
    this.displayDialog = false;
    if (item.securityType === FccGlobalConstant.SSO) {
      this.iframeURL = item.url;
      this.deepLinkingQueryParameter = item.queryParameter;
      this.router.navigate(['/sso-deeplink-url']);
    } else{
      this.iframeURL = item.url;
      this.router.navigate(['/iframe']);
    }
  }
}

dropdownOption(control?:any, val?:any) {
  Object.keys(control[this.options]).forEach(dropDownobj => {
    if (control[this.options][dropDownobj][this.valueStr] === val) {
      val = control[this.options][dropDownobj][this.label];
    }
  });
  // Setting the value in control for view popup, to get data in PDF
  this.mode = this.getQueryParametersFromKey(FccGlobalConstant.MODE);
  if (this.mode === FccGlobalConstant.VIEW_MODE) {
    control.setValue(val);
   }
}

  public getUserProfileAccount(productCode, entity, subProductCode?): Observable<any> {
    const headers = new HttpHeaders({ 'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqUrl = `${this.fccGlobalConstantService.userProfileAccounts}`;
    let reqPayload = {};
    if(this.isnonEMptyString(subProductCode)){
      reqPayload = {
        requestData: { productCode, subProductCode, option: FccGlobalConstant.USER_ACCOUNT, entity },
      };
    }
    else{
      reqPayload = {
        requestData: { productCode, option: FccGlobalConstant.USER_ACCOUNT, entity },
      };
    }
    return this.http.post<any>(reqUrl, reqPayload, { headers });
  }

  // Display label based on product code and sub product code
  public displayLabelByCode(productCode, subProductCode) {
    switch (subProductCode) {
      case FccGlobalConstant.SUB_PRODUCT_LNCDS:
      case FccGlobalConstant.SUB_PRODUCT_BLFP:
      case FccGlobalConstant.SUB_PRODUCT_LNRPN:
      case FccGlobalConstant.SUB_PRODUCT_CTCHP:
      case FccGlobalConstant.SUB_PRODUCT_ULOAD:
        return this.translate.instant('N047_' + subProductCode);
      default:
        return `${this.translate.instant(productCode)}`;
    }
  }

  autoSaveForm(requestObj, createFlag: boolean, productCode?: string, subProductCode?: string, option?: string
    , referenceId?: string, tnxTypeCode?: string, version?: string) {
    const headers = new HttpHeaders({ 'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON
    , 'Idempotency-Key': this.fccGlobalConstantService.generateUIUD() });
    const reqUrl = this.fccGlobalConstantService.getAutoSaveUrl();
    const requestPayload = {
      productCode: this.getValue(productCode),
      subProductCode: this.getValue(subProductCode),
      option: this.getValue(option),
      referenceId: this.getValue(referenceId),
      tnxTypeCode: this.getValue(tnxTypeCode),
      version: this.getValue(version),
      formData: JSON.stringify(requestObj)
    };
    if (createFlag) {
      return this.http.post<any>(reqUrl , requestPayload , { headers });
    }
    else {
      return this.http.put<any>(reqUrl , requestPayload , { headers });
    }
  }

  getValue(value) {
    return value ? value : FccGlobalConstant.EMPTY_STRING;
  }

  getAutoSavedForm(productCode?: string, subProductCode?: string, referenceId?: string, tnxTypeCode?: string, option?: string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const reqURl = this.fccGlobalConstantService.getAutoSaveUrl();
    const params = `?productCode=${this.getValue(productCode)}&subProductCode=${this.getValue(subProductCode)}&referenceId=${this
      .getValue(referenceId)}&tnxTypeCode=${this.getValue(tnxTypeCode)}&option=${this.getValue(option)}`;
    return this.http.get<any>(reqURl.concat(params), { headers });
  }

  getBeneficiaryAccounts(associationId, fetchAccountsList?) {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqURl =
     `${this.fccGlobalConstantService.beneficiaryAccounts}/${associationId}`;
    const params = new HttpParams({
      fromObject: {
        fetchAccountsList
      }
    });
    return this.http.get<any>(
      reqURl,
      { headers, params }
    );
  }

  markBeneAccountPairAsFavUnFav(associationId: string, favStatus): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqURl =
    `${this.fccGlobalConstantService.favPaymentBeneficiaryDetails}/${associationId}`+'/favourite';
    const requestPayload = {
      isFavourite: favStatus,
    };
    return this.http.put<any>(reqURl,requestPayload, { headers , observe: 'response' });
  }

  getFavBeneCount(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqURl = `${this.fccGlobalConstantService.favBeneficiaryCount}`;
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }

  beneficiaryStatus(associationId: string, status: string, beneficiaryId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqURl = `${this.fccGlobalConstantService.beneficiaryStatus}/${associationId}`+'/status?beneficiaryId='+beneficiaryId;
    const requestPayload = {
      event: status,
      makerRemarks: "",
      checkerRemarks: ""
    };
    return this.http.put<any>(reqURl,requestPayload, { headers , observe: 'response' });
  }

  addIdToPmenuDropdown() {
    const allMenues: any = Array.from(document.getElementsByTagName('p-menubar'));
    allMenues.forEach((menu) => {
      const list: any = menu.getElementsByTagName('ul')[0];
      const allLinks: any = Array.from(list.getElementsByTagName('a'));
      allLinks.forEach((link) => {
        const spanValue = link.getElementsByClassName('ui-menuitem-text')[0];
        const idValue = spanValue.textContent.replace(/\s+/g, '_').trim();
        link.setAttribute("id", idValue + '_link');
        spanValue.setAttribute("id", idValue);
      });
    });
  }

  addIdToMatTabLabel(){
    const allMenues: any = Array.from(document.getElementsByTagName('mat-tab-header'));
    allMenues.forEach((menu) => {
        const matTabLabel: any = Array.from(menu.getElementsByClassName('mat-tab-label'));
        matTabLabel.forEach((label) => {
        const matTabLabelContent = label.getElementsByClassName('mat-tab-label-content')[0];
        const value = matTabLabelContent.textContent.trim().replace(/\s+/g, '_');
        matTabLabelContent.setAttribute("id", value + "_Content");
        label.setAttribute("id", value);
        });
    });
  }

  validateProduct(form: FCCFormGroup, fieldName: string, productCode: string): boolean {
    const checkApplicableProducts = form.get(fieldName)[FccGlobalConstant.PARAMS]['applicableValidation'][0]['applicableProducts'];
    if (checkApplicableProducts !== undefined) {
    return checkApplicableProducts.indexOf(productCode) > -1;
    } else {
      return true;
    }
  }

  public submitSinglePayment(requestObj) {
    const iKey = this.fccGlobalConstantService.generateUIUD();
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj['xRequestID'] = iKey;
    obj[FccGlobalConstant.idempotencyKey] = requestObj.idempotencyKey;
    const headers = new HttpHeaders(obj);
    const completePath = this.fccGlobalConstantService.singlePaymentURL;
    const requestPayload = requestObj.request;
    this.submitButtonEnable.next(false);
    return this.http.post<any>(completePath, requestPayload, { headers , observe: 'response' });
  }

  public submitBulkPayment(request) {
    const completePath = this.fccGlobalConstantService.bulkPaymentURL;
    const requestPayload = request;
    this.submitButtonEnable.next(false);
    return this.http.post<any>(completePath, requestPayload);
  }

  public submitBulkBene(request) {
    const completePath = this.fccGlobalConstantService.bulkBeneURL;
    const requestPayload = request;
    this.submitButtonEnable.next(false);
    return this.http.post<any>(completePath, requestPayload);
  }

  public getPaymentDetails(request){
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const reqURl = this.fccGlobalConstantService.paymentDetailsurl + request.paymentReferenceNumber + '/payments-detail'+
    '?pageSize='+ request.pageSize + '&first=' + request.first;
    return this.http.get<any>(reqURl, { headers });
  }

  public getInstrumentDetails(request, instumentRefNum){
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const reqURl = this.fccGlobalConstantService.paymentDetailsurl + request.paymentReferenceNumber +
    '/payments-detail?instrumentPaymentReference='+ instumentRefNum;
    return this.http.get<any>(reqURl, { headers });
  }

  public getPaymentOverviewDetails(liquidationDateDuration): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const reqURl = this.fccGlobalConstantService.paymentOverviewDetailsURL+ '?liquidationDateDuration='+liquidationDateDuration;
    return this.http.get<any>(reqURl, { headers });
  }

  getListPopupActions(listdefName?: string, status?: string, option?: string, category?: string,
    screenName?: string) {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const reqURl = this.fccGlobalConstantService.getPopupActionsUrl();
    const params = `?listdefName=${this.getValue(listdefName)}&status=${this.getValue(status)}` +
    `&Option=${this.getValue(option)}&category=${this.getValue(category)}` +
    `&screenName=${this.getValue(screenName)}`;
    return this.http.get<any>(reqURl.concat(params), { headers });
  }

  viewDetailsPopup(associationId: string): Promise<any> {
    return new Promise<any>((res) => {
      let accountResponse: any;

        if (this.isnonEMptyString(associationId)) {
           this.getBeneficiaryAccounts(associationId).subscribe(response => {
            if (response.data && response.data.bankAccountBeneStatus) {
              accountResponse = response.data;
              res(accountResponse);
            }
          });
        }

    });
  }

  public getAccountDetails(request){
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const reqURl = this.fccGlobalConstantService.getAccountDetails + request.accountId;
    return this.http.get<any>(reqURl, { headers });
  }

  public getAccountAdditionalPostingDetails(lineId,statementId){
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const reqURl = this.fccGlobalConstantService.getAccountAdditionalPostingDetails+
    "?lineId="+lineId+"&statementId="+statementId;
    return this.http.get<any>(reqURl, { headers });
  }

  public getMT940Details(){
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const reqURl = this.fccGlobalConstantService.baseUrl + 'MT940';
    return this.http.get<any>(reqURl, { headers });
  }

  public getAccounts(params){
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const reqURl = this.fccGlobalConstantService.accountListUrl;
    params['limit'] = 1000;
    return this.http.get<any>(reqURl, { params, headers });
  }

  public getDropdownDetails(url,request?){
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    let reqUrl = '';
    if(this.isNonEmptyValue(request)){
      reqUrl = this.fccGlobalConstantService.baseUrl + url + request.id;
    } else {
      reqUrl = this.fccGlobalConstantService.baseUrl + url;
    }
    return this.http.get<any>(reqUrl, { headers });
  }

  public getAccountTypeList(request, params?){
    const headers = new HttpHeaders({ 'Content-Type' : FccGlobalConstant.APP_JSON, 'Accept':  FccGlobalConstant.APP_JSON });
    const reqURl = this.fccGlobalConstantService.getAccountTypes + request.language;
    return this.http.get<any>(reqURl, { params, headers });
  }

  public getExchangeRateConfig(params){
    const headers = new HttpHeaders({ 'Content-Type' : FccGlobalConstant.APP_JSON, 'Accept':  FccGlobalConstant.APP_JSON,
    'cache-request' : 'true' });
    const reqURl = this.fccGlobalConstantService.getExchangeRateConfig;
    return this.http.get<any>(reqURl, { params, headers });
  }

  public getFxDetails(params){
    const headers = new HttpHeaders({ 'Content-Type' : FccGlobalConstant.APP_JSON, 'Accept':  FccGlobalConstant.APP_JSON });
    const reqURl = this.fccGlobalConstantService.getFxDetails;
    return this.http.get<any>(reqURl, { params, headers });
  }

  public isListdefActionColumn(column: string): boolean {
    return column === FccGlobalConstant.ACTION? true: false;
  }

  setFooterSticky(footerFlag: boolean){
    this.isFooterSticky.next(footerFlag);
  }
  getFooterStickyFlag(){
    return this.isFooterSticky;

  }

  showToasterMessage(message:Message){
    this.messageService.add(message);
  }


  performBeneficiaryMultiApproveRejectFCM(associationIdsArr:string[],eventType:string,
    comment:string, associationId?:string, beneficiaryId?:string){
    if(associationId==undefined||associationId==null){
      associationId=associationIdsArr[0];
    }
   return this.http.put(this.fccGlobalConstantService.baseUrl +
    `beneficiary-accounts/${associationId}/status?associationIds=`+associationIdsArr+`&beneficiaryId=`+beneficiaryId, {
      makerRemarks: "",
      checkerRemarks: comment,
      event: eventType
    });
  }

  performBeneficiarySendReminderFCM(associationId) {
    return this.http.post(this.fccGlobalConstantService.baseUrl +
      `beneficiary-accounts/${associationId}/alert?associationId=`+associationId, {
        alertCode: "BENE_REG_PENDAPR"
    });
  }


  performBeneficiaryApproveRejectFCM(associationId:string,eventType:string,comment,beneficiaryId?: string){
    return this.http.put(this.fccGlobalConstantService.baseUrl +
      `beneficiary-accounts/${associationId}/status?beneficiaryId=`+beneficiaryId, {
      makerRemarks: "",
      checkerRemarks: comment,
      event: eventType
    });
  }

  /**
  *
  * @param associationId
  * @param eventType
  * @param comment
  */
  approveReject(associationId?:string,eventType?:string,comment?:string,beneficiaryId?: string){
    if(this.isnonEMptyString(associationId)&&this.isnonEMptyString(eventType)){
      if(eventType==FccGlobalConstant.ACTION_APPROVE || eventType==FccGlobalConstant.ACTION_REJECT
        || eventType==FccGlobalConstant.MODEL_SUBMIT){
        return this.performBeneficiaryApproveRejectFCM(associationId,eventType,comment,beneficiaryId);
      }

    }

}

paymentsApproveReject(paymentReferenceNumber?:string,eventType?:string,comment?:string){
  if(this.isnonEMptyString(paymentReferenceNumber)&&this.isnonEMptyString(eventType)){
    if(eventType==FccGlobalConstant.ACTION_APPROVE || eventType==FccGlobalConstant.ACTION_REJECT){
      return this.performPaymentsApproveRejectFCM(paymentReferenceNumber,eventType,comment);
    }

  }

}

paymentDiscard(paymentReferenceNumber: any, action: any, comment: any) {
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/paymentstatus`, {
    checkerRemarks: comment,
    event: action
  });
}

paymentSendReminder(paymentReferenceNumber: any, alertCode: any) {
  return this.http.post(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/alert`, {
    alertCode: alertCode
  });
}

paymentInstrumentDiscard(paymentReferenceNumber: any, action: any, instrumentRefNumber: any, comment)
{
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`+
    `/batchpaymentdeleteinstrument?instrumentPaymentReference=${instrumentRefNumber}`,{
      event: action,
      checkerRemarks: comment

    });
}

paymentInstrumentApproveFCM(paymentReferenceNumber: any, action: any, instrumentRefNumber: any)
{
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`+
    `/batchpaymentapproveinstrument?instrumentPaymentReference=${instrumentRefNumber}`,{
      event: action,
      checkerRemarks: ''

    });
}


paymentInstrumentRejectFCM(paymentReferenceNumber: any, action: any, instrumentRefNumber: any, comment)
{
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`+
    `/batchpaymentrejectinstrument?instrumentPaymentReference=${instrumentRefNumber}`,{
      event: action,
      checkerRemarks: comment
    });
}

paymentSingleInstrumentVerifyFCM(paymentReferenceNumber: any, action: any, comment)
{
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`+
    `/verifysinglepayment`,{
      event: action,
      checkerRemarks: comment
    });
}

paymentSingleInstrumentRejectFCM(paymentReferenceNumber: any, action: any, comment)
{
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`+
    `/verifyrejectsinglepayment`,{
      event: action,
      checkerRemarks: comment

    });
}

paymentCheckerRejectFCM(paymentReferenceNumber: any, action: any, comment)
{
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`+
    `/paymentstatuscheckerReject`,{
      event: action,
      checkerRemarks: comment

    });
}

paymentCheckerApproveFCM(paymentReferenceNumber: any, action: any, comment)
{
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`+
    `/paymentstatusApprove`,{
      event: action,
      checkerRemarks: comment

    });
}

paymentInstrumentVerifyFCM(paymentReferenceNumber: any, action: any, instrumentRefNumber: any, comment)
{
  let url = '';
  if(instrumentRefNumber !== undefined && instrumentRefNumber !== null && instrumentRefNumber !== '' ){
    url = this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`+
    `/batchpaymentverifyinstrument?instrumentPaymentReference=${instrumentRefNumber}`;
  }else{
    url = this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`+
    `/batchpaymentverifyinstrument`;
  }
  return this.http.put(
    url,{
      event: action,
      checkerRemarks: comment

    });
}

paymentInstrumentVerifierRejectFCM(paymentReferenceNumber: any, action: any, instrumentRefNumber: any, comment)
{
  let url = '';
  if(instrumentRefNumber !== undefined && instrumentRefNumber !== null && instrumentRefNumber !== '' ){
    url = this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`+
    `/verifyrejectbatchpayment?instrumentPaymentReference=${instrumentRefNumber}`;
  }else{
    url = this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`+
    `/verifyrejectbatchpayment`;
  }
  return this.http.put(
    url,{
      event: action,
      checkerRemarks: comment

    });
}

batchPaymentAction(paymentReferenceNumber: any, action: any, comment: any) {
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/batchpaymentstatus`, {
    checkerRemarks: comment,
    event: action
  });
}

sendbatchPaymentAction(paymentReferenceNumber: any, action: any, comment: any) {
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/sendbatchpayment`, {
    checkerRemarks: comment,
    event: action
  });
}

scrapBatchInstrumentPaymentAction(paymentReferenceNumber: any, action: any, instrumentRefNumber: any, comment: any) {
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`
    +`/scrapbatchpayment?instrumentPaymentReference=${instrumentRefNumber}`, {
    checkerRemarks: comment,
    event: action
  });
}

sendBatchInstrumentPaymentAction(paymentReferenceNumber: any, action: any, instrumentRefNumber: any, comment: any) {
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}`
    +`/sendbatchpayment?instrumentPaymentReference=${instrumentRefNumber}`, {
    checkerRemarks: comment,
    event: action
  });
}

scrapbatchPaymentAction(paymentReferenceNumber: any, action: any, comment: any) {
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/scrapbatchpayment`, {
    checkerRemarks: comment,
    event: action
  });
}

batchPaymentActionApprove(paymentReferenceNumber: any, action: any, comment: any) {
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/batchpaymentstatusApprove`, {
    checkerRemarks: comment,
    event: action
  });
}

batchPaymentActionReject(paymentReferenceNumber: any, action: any, comment: any) {
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/batchpaymentstatusReject`, {
    checkerRemarks: comment,
    event: action
  });
}

beneDiscard(associationId) {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.delete(this.fccGlobalConstantService.fcmBeneficiaryCreation+`/${associationId}`, { headers });
}

performPaymentsApproveRejectFCM(paymentReferenceNumber:string,eventType:string,comment){
  return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/paymentstatus`, {
    checkerRemarks: comment,
    event: eventType
  });
}

  performTransactionPaymentsApproveRejectFCM(paymentReferenceNumbers: any, eventType: string,
    comment: string, paymentReferenceNumber?: string) {
    if (paymentReferenceNumber == undefined || paymentReferenceNumber == null) {
      paymentReferenceNumber = paymentReferenceNumbers[0];
    }
   return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/paymentstatus?paymentReferenceNumbers=`
    +paymentReferenceNumbers, {
      checkerRemarks: comment,
      event: eventType
    });
  }

  performTransactionPaymentsMultiApproveRejectFCM(paymentReferenceNumbers: any, eventType: string,
    comment: string, paymentReferenceNumber?: string) {
    if (paymentReferenceNumber == undefined || paymentReferenceNumber == null) {
      paymentReferenceNumber = paymentReferenceNumbers[0];
    }
    if (eventType === FccGlobalConstant.multiTransactionEventType.REJECT){
      return this.http.put(
        this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/paymentstatusMultiCheckerReject?paymentReferenceNumbers=`
        +paymentReferenceNumbers, {
          checkerRemarks: comment,
          event: eventType
        });
    } else {
      return this.http.put(
        this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/paymentstatusMultiApprove?paymentReferenceNumbers=`
        +paymentReferenceNumbers, {
          checkerRemarks: comment,
          event: eventType
        });
    }
  }

  performPaymentsVerifyFCM(paymentReferenceNumbers: any, eventType: string,
    comment: string, paymentReferenceNumber?: string) {
    if (paymentReferenceNumber == undefined || paymentReferenceNumber == null) {
      paymentReferenceNumber = paymentReferenceNumbers[0];
    }
   return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/paymentVerify?paymentReferenceNumbers=`
    +paymentReferenceNumbers, {
      checkerRemarks: comment,
      event: eventType
    });
  }

  performPaymentsSendFCM(paymentReferenceNumbers: any, eventType: string,
    comment: string, paymentReferenceNumber?: string) {
    if (paymentReferenceNumber == undefined || paymentReferenceNumber == null) {
      paymentReferenceNumber = paymentReferenceNumbers[0];
    }
   return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/paymentSend?paymentReferenceNumbers=`
    +paymentReferenceNumbers, {
      checkerRemarks: comment,
      event: eventType
    });
  }

  performPaymentsVerifierRejectFCM(paymentReferenceNumbers: any, eventType: string,
    comment: string, paymentReferenceNumber?: string) {
    if (paymentReferenceNumber == undefined || paymentReferenceNumber == null) {
      paymentReferenceNumber = paymentReferenceNumbers[0];
    }
   return this.http.put(
    this.fccGlobalConstantService.paymentDetailsurl+`${paymentReferenceNumber}/paymentVerifierReject?paymentReferenceNumbers=`
    +paymentReferenceNumbers, {
      checkerRemarks: comment,
      event: eventType
    });
  }

  viewAdditionalInfoPopup(paymentReferenceNumber: string): Promise<any> {
    return new Promise<any>((res) => {
      let accountResponse: any;
        if (this.isnonEMptyString(paymentReferenceNumber)) {
          const req = {
            paymentReferenceNumber : paymentReferenceNumber
          };
          this.getPaymentDetails(req).subscribe(response => {
            if (response.data) {
              const flatMap = {};
              const paymentDetail = this.removeBeneCodeIfNotSavedDuringAdhoc(response.data);
              this.convertResponse(paymentDetail,FccGlobalConstant.PAYMENT_DETAILS_MAPPING,flatMap);
              accountResponse = flatMap;
              res(accountResponse);
            }
          });
        }

    });
  }

  viewAdditionalInfoInstrumentPopup(paymentReferenceNumber: string, instrumentRefNum: string): Promise<any> {
    return new Promise<any>((res) => {
      let accountResponse: any;
        if (this.isnonEMptyString(paymentReferenceNumber)) {
          const req = {
            paymentReferenceNumber : paymentReferenceNumber
          };
          this.getInstrumentDetails(req, instrumentRefNum).subscribe(response => {
            if (response.data) {
              const flatMap = {};
              const paymentDetail = this.removeBeneCodeIfNotSavedDuringAdhoc(response.data);
              this.convertResponse(paymentDetail,FccGlobalConstant.INSTRUMENT_PAYMENT_DETAILS_MAPPING,flatMap);
              accountResponse = flatMap;
              res(accountResponse);
            }
          });
        }

    });
  }

  removeBeneCodeIfNotSavedDuringAdhoc(data){
    const creditor = data.paymentDetail[0]?.creditorDetails;
    if(creditor?.isAdhocCreditor && !creditor?.addReceiverToDirectory){
      delete creditor?.creditorIdentification;
    }
    return data;
  }

  convertResponse(response,map ,flatMap){
    const paramId = FccGlobalConstant.CONFIDENTIAL_PARAMETER;
    let confidentialString = FccGlobalConstant.EMPTY_STRING;
    this.getParameterConfiguredValues(null, paramId).subscribe(resp => {
      if (resp && resp.paramDataList) {
        resp.paramDataList.forEach(element => {
           confidentialString = element.data_1;
        });
      }
    });
    Object.keys(map).forEach(key => {
      const fields = map[key];
      let value;
      const prefix = '-';
      if (Array.isArray(fields[0])) {
        const valueArr = [];
        let val = '';
        fields.forEach(arr => {
          value = Object.assign({}, response);
          val = this.getComplexValue(arr, value);
          if(arr.includes('currency')){
            val = '('+val+')';
          } else if(val !==''){
            val = prefix+val;
          }
          valueArr.push(val);
        });
        value = valueArr.join('').slice(1);
      } else {
        value = Object.assign({}, response);
        value = this.getComplexValue(fields, value);
      }
      if(this.isnonEMptyString(confidentialString) && this.isnonEMptyString(value) &&
        typeof value === 'string' && value.indexOf(FccGlobalConstant.CONFIDENTIAL_STRING) !==-1 ){
        value = confidentialString;
      }
      flatMap[key] = value;
    });
  }

  getComplexValue(fields, value){
    fields.forEach(field => {
      if(Array.isArray(value[field])) {
        value = value[field][0];
      } else if(typeof value[field] === 'object'){
        value = value[field];
      } else if(typeof value[field] !== 'object'){
        value = value[field] || ' ';
      }
    });
    return value;
  }

  removeResponseField(response, map, tnxStatus){
    Object.keys(map).forEach(key =>{
      if(key !== tnxStatus){
        const fields = map[key];
        fields.forEach(val =>{
          delete response[val];
        });
      }
    });
    return response;
  }

    isObjectEmpty(object){
      return Object.keys(object).length === 0 ;
    }
  public updateSinglePayment(requestObj) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const completePath = this.fccGlobalConstantService.singlePaymentURL + `/${requestObj.paymentReferenceNumber}`;
    const requestPayload = requestObj.request;
    return this.http.put<any>(completePath, requestPayload, { headers , observe: 'response' });
  }

  setInputAutoComp(flag: boolean){
    this.inputAutoComp.next(flag);
  }

  addTitleBarCloseButtonAccessibilityControl(): void {
    const closeButton = Array.from(document.getElementsByClassName('ui-dialog-titlebar-close'));
    closeButton.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translate.instant("close");
      element[FccGlobalConstant.TITLE] = this.translate.instant("close");
    });
  }

  getCurrencySymbolForPDF(curCode: string, amt: any): string {
    const currSymbol = getCurrencySymbol(curCode, "narrow");
    return curCode !== currSymbol ? `${curCode} ${getCurrencySymbol(curCode, "narrow")} ${amt}` : `${curCode} ${amt}`;
  }

  getCurrencyFormatedAmount(curCode: string, amt: any, currencySymbolDisplayEnabled: boolean): string {
    if (this.isnonEMptyString(curCode) && this.isnonEMptyString(amt) && amt !== '-') {
      return currencySymbolDisplayEnabled ? this.getCurrencySymbolForDownloads(curCode, amt) : amt;
    }
    return amt;
  }

  getCurrencyFormatedAmountForPreview(curCode: string, amt: any): string {
    const currencyAmount = this.getCurrencySymbol(curCode, amt);
    const isArabic = localStorage.getItem(FccGlobalConstant.LANGUAGE) === FccGlobalConstant.LANGUAGE_AR;
    if (this.isnonEMptyString(curCode) && this.isnonEMptyString(amt) && amt !== '-' && !isArabic) {
      return currencyAmount;
    } else if (isArabic) {
      return currencyAmount.split(' ').reverse().join(' ');
    }
    return amt;
  }

  getCurrencyFormatedAmountForListdef(curCode: string, amt: string, currencySymbolDisplayEnabled: boolean): string {
    if (this.isnonEMptyString(curCode) && this.isnonEMptyString(amt) && amt !== '-') {
      return currencySymbolDisplayEnabled ? this.getCurrencySymbolForListdef(
        curCode, amt, localStorage.getItem(FccGlobalConstant.LANGUAGE)) : amt;
    }
    return amt;
  }

  getCurrencySymbolForDownloads(curCode: string, amt: string): string {
    const currSymbol = getCurrencySymbol(curCode, "narrow");
    return curCode !== currSymbol ? `${currSymbol} ${amt}` : `${amt}`;
  }

  removeAmountFormatting(value: any) {
    const language = localStorage.getItem('language');
    let amt: any;
    if (language === 'fr') {
      amt = value.replace(/\s/g, '').replace(',', '.');
      return amt;
    } else if (language === 'ar') {
      amt = value.replace(/,/g, '').replace('٫', '.');
      return amt;
    } else {
      amt = value.replace(/,/g, '');
      return amt;
    }
  }

  getCurrencySymbolForListdef(curCode: string, amt: any, language: string): string {
    const currSymbol = getCurrencySymbol(curCode, "narrow");
    let newAmt;
    if (!isNaN(amt[0])) {
      if (language !== 'ar') {
        newAmt = curCode !== currSymbol ? `${currSymbol} ${amt}` : `${amt}`;
      } else {
        newAmt = curCode !== currSymbol ? `${amt} ${currSymbol}` : `${amt}`;
      }
    } else {
      newAmt = amt;
    }
    return newAmt;
  }

  checkEnrichmentValuesValid(enrichmentFields: any, enrichmentFieldsName: any, form: any): any {
    let valid = true;
    if (enrichmentFields && enrichmentFieldsName.length > 0) {
      for (let i = 0; i < enrichmentFieldsName.length; i++) {
        switch(enrichmentFields[enrichmentFieldsName[i]].type) {
          case FccGlobalConstant.inputDate:
            break;
          case FccGlobalConstant.inputRadio:
            if (this.getFormElement(form,enrichmentFieldsName[i])[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] &&
            this.isEmptyValue(this.getFormElement(form,enrichmentFieldsName[i]).value)) {
              this.getFormElement(form,enrichmentFieldsName[i]).setErrors({ required: true });
              this.getFormElement(form,enrichmentFieldsName[i]).markAsTouched();
              valid = false;
            }
            break;
          case FccGlobalConstant.inputText:
            if (this.isnonEMptyString(this.getFormElement(form,enrichmentFieldsName[i]).value)) {
              if (enrichmentFields[enrichmentFieldsName[i]].dataType === 'A') {
                const numVal = Number(this.getFormElement(form,enrichmentFieldsName[i]).value);
                const max = enrichmentFields[enrichmentFieldsName[i]].maxValue;
                const min = enrichmentFields[enrichmentFieldsName[i]].minValue;
                if (numVal > max || numVal < min) {
                  this.getFormElement(form,enrichmentFieldsName[i]).setErrors({ amountRangeError: { min: min, max: max } });
                  this.getFormElement(form,enrichmentFieldsName[i]).markAsTouched();
                  valid = false;
                }
              } else if (enrichmentFields[enrichmentFieldsName[i]].dataType === 'S' ||
              enrichmentFields[enrichmentFieldsName[i]].dataType === 'N') {
                const minLength = enrichmentFields[enrichmentFieldsName[i]].minlength;
                const maxLength = enrichmentFields[enrichmentFieldsName[i]].maxlength;
                if (this.getFormElement(form,enrichmentFieldsName[i]).value.length < minLength) {
                  this.getFormElement(form,enrichmentFieldsName[i]).setErrors({ minlength: { requiredLength: minLength } });
                  this.getFormElement(form,enrichmentFieldsName[i]).markAsTouched();
                  valid = false;
                }
                if (this.getFormElement(form,enrichmentFieldsName[i]).value.length > maxLength) {
                  this.getFormElement(form,enrichmentFieldsName[i]).setErrors({ maxlength: { requiredLength: maxLength } });
                  this.getFormElement(form,enrichmentFieldsName[i]).markAsTouched();
                  valid = false;
                }
              }
            }
            break;
          default:
            break;
        }
      }
    }
    return { valid: valid, form: form };
  }

  isPositiveNumber(number):boolean{
    let flag = false;
    if(!isNaN(number)){
      if(+number >= 0){
        flag = true;
      }
    }
    return flag;
  }

  redirectToLink(link, filterObj?) {
    if (link) {
      const isAngularUrl = link && link.indexOf('#') > -1;
      if (isAngularUrl) {
        const url = link.split('#')[1];
        window.scroll(0, 0);
        if (filterObj) {
          this.router.navigateByUrl(url, { state: { filterdata: filterObj } });
        } else {
          this.router.navigateByUrl(url);
        }
      } else {
        const contextPath = this.getContextPath();
        const dojoPath = `${this.fccGlobalConstantService.servletName}/screen/`;
        let url = '';
        if (contextPath !== null && contextPath !== '') {
          url = contextPath;
        }
        url = `${url}${dojoPath}${link}`;
        this.router.navigate([]).then(() => {
          window.open(url, '_self');
        });
      }
    }
  }
  getAmountConfigurationValue(currency?: string): Observable<any> {
    const headers = this.getCacheEnabledHeaders();
    let baseUrl = `${this.fccGlobalConstantService.getAmountConfig}`;

    if (currency !== null && currency !== undefined && currency !== '') {
      baseUrl = baseUrl + `&CURRENCY=${currency}`;
    }
    const reqURL = baseUrl;
    return this.http.get<any>(reqURL, { headers });
  }
  public getamountConfiguration() {
      this.getAmountConfigurationValue().subscribe((response) => {
        if (this.isNonEmptyValue(response) && this.isNonEmptyValue(response.amountConfigMap)) {
          const amountConfigMap = response.amountConfigMap;
          this.amountConfigMap.next(amountConfigMap);
        }
      });
    }

  realAmount(currencySymbolDisplayEnabled: any, totalAmtInFormat: any,
    baseCurrencyUserLimitCurrency: any) {
    const language = localStorage.getItem('language');
    let totalAmtNumber: any;
    if (language === 'fr') {
      if (currencySymbolDisplayEnabled) {
        totalAmtNumber = this.getCurrencySymbol(baseCurrencyUserLimitCurrency,
          totalAmtInFormat.split(',')[0]) + ',';
      } else {
        totalAmtNumber = totalAmtInFormat.split(',')[0] + ',';
      }
    } else if (language === 'ar') {
      if (currencySymbolDisplayEnabled) {
        totalAmtNumber = this.getCurrencySymbol(baseCurrencyUserLimitCurrency,
          totalAmtInFormat.split('٫')[0]) + '٫';
      } else {
        totalAmtNumber = totalAmtInFormat.split('٫')[0] + '٫';
      }
    } else {
      if (currencySymbolDisplayEnabled) {
        totalAmtNumber = this.getCurrencySymbol(baseCurrencyUserLimitCurrency,
          totalAmtInFormat.split('.')[0]) + '.';
      } else {
        totalAmtNumber = totalAmtInFormat.split('.')[0] + '.';
      }
    }
    return totalAmtNumber;
  }

  paymentDashboardAction( request: any, packageName?: string, debtorIdentification?: string) {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const reqURl = this.fccGlobalConstantService.paymentDetailsurl + 'paymentactionrequest';
    const params = `?packageName=${this.getValue(packageName)}
    &debtorIdentification=${this.getValue(debtorIdentification)}`;
    return this.http.put<any>(reqURl.concat(params), request, { headers });
  }
  setIsChildList(flag: boolean){
    this.isChildList.next(flag);
  }
  getIsChildList(){
    return this.isChildList;
  }
  setIsViewMore(flag: boolean){
    this.isViewMore.next(flag);
  }
  getIsViewMore(){
    return this.isViewMore;
  }

  setDefaultClient(dropdownList, form, controlName) {
    const defaultClient = dropdownList.length ? dropdownList[0].defaultclient : null;
    const obj = [];
    let objValue;
    let currValue;
    dropdownList.forEach(element => {
    objValue = {
      label: element.clientid,
      value : {
        label: element.clientid,
        name: element.clientdesc,
        shortName: element.clientid
      }
    };
    obj.push(objValue);
    if (defaultClient && element.clientid === defaultClient) {
      currValue = objValue.value;
    }
    });
    if (dropdownList.length === 1 && !form.controls[controlName].value) {
      this.patchFieldValueAndParameters(form.controls[controlName], obj[0].value, { options: obj });
    } else if (currValue && !form.controls[controlName].value) {
      this.patchFieldValueAndParameters(form.controls[controlName], currValue, { options: obj });
    } else {
      this.patchFieldParameters(form.controls[controlName], { options: obj });
    }
  }

  updateBatchStatus(paymentReferenceNumber){
    const formValues = {};
    const filterParams = {};
    const batchDetailsNew = [];
    const request = {
      'paymentReferenceNumber': paymentReferenceNumber,'pageSize': 10, first: 0
    };
    this.getPaymentDetails(request).subscribe(resp => {
      if (resp) {
        const submitResponse = resp.data;
        this.batchStatus = submitResponse.paymentHeader.batchStatus;
        const detailsList = JSON.parse(localStorage.batchDetailsData).viewDetails;
        detailsList.forEach(detail => {
          const details = {};
          details[FccGlobalConstant.KEY] = detail[FccGlobalConstant.KEY];
          if (detail[FccGlobalConstant.KEY] === 'batchStatus'){
            details[FccGlobalConstant.VALUE] = submitResponse.paymentHeader.batchStatus;
          } else {
            details[FccGlobalConstant.VALUE] = detail[FccGlobalConstant.VALUE];
          }
          batchDetailsNew.push(details);
        });
        filterParams['paymentReferenceNumber'] = paymentReferenceNumber;
        formValues[FccConstants.VIEW_DETAILS] = batchDetailsNew;
        formValues[FccConstants.FILTER_PARAM_VALUES] = filterParams;
        localStorage.setItem('batchDetailsData', JSON.stringify(formValues));
        this.refreshBatchDetails.next(true);
      }});
  }

  setDefaultPayTO(dropdownList, form, controlName) {
    let objValue;
    const obj = [];
    let currValue;

    dropdownList.forEach(element => {
      objValue = {
        label: element.accountno,
        value : {
          label: element.accountno,
          name: element.bene_account_type,
          shortName: element.accountno,
          defaultAcc: element.default_account,
          accountType : element.bene_account_type,
          currency : element.bene_account_ccy
        }
      };
      obj.push(objValue);
      if (element.default_account === 'Y') {
        currValue = objValue.value;
      }
      });
    this.patchFieldValueAndParameters(form.controls[controlName], currValue, { options: obj });


  }


  setBatchFormData(formData){
    this.batchFormData = formData;
  }

  getBatchFormData(){
    return this.batchFormData;
  }

  setAccountSummaryFilter(accountSummaryFilter){
    this.accountSummaryFilter = accountSummaryFilter;
  }

  getAccountSummaryFilter(){
    return this.accountSummaryFilter;
  }

  setLoggedInUserData(loggedInUserData){
    this.loggedInUserData = loggedInUserData;
  }

  getLoggedInUserData(){
    return this.loggedInUserData;
  }

  getUpcomingTransactionDetailsNew(fromDate, toDate) {
    const headers = this.getCacheEnabledHeaders();
    const reqURl = `${this.fccGlobalConstantService.getUpcomingPaymentSummaryUrl()}?fromDate=${fromDate}&toDate=${toDate}`;
    return this.http.get<any>(reqURl, { headers } );
  }

  getAllowedDocViewerMimeTypes() {
    this.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        if ( response.docViewerMimeType ) {
          this.allowedDocViewerMimeTypes = response.docViewerMimeType;
        }
      }
    });
  }

  public getBulkMappingDetails(bank?): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    let reqURl = this.fccGlobalConstantService.getBulkMapperUrl();
    if(this.isnonEMptyString(bank)){
      reqURl = reqURl + `?bankAbbvName=${bank}`;
    }
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }

  getBeneficiaryDetails(beneficiaryId): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqURl = `${this.fccGlobalConstantService.getBeneficiaryDetails}?beneficiaryId=${beneficiaryId}`;
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }

  getBeneficiaryAccountDetails(beneficiaryId): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqURl = `${this.fccGlobalConstantService.getBeneficiaryAccountDetails}?beneficiaryId=${beneficiaryId}`;
    return this.http.get<any>(reqURl, { headers , observe: 'response' });
  }

  getHolidayList(productCode, subProductCode?: string, currency?: string, country?: string, bankAbbvName?: string){
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    let reqURl = `${this.fccGlobalConstantService.bankHolidayList}?`;
    if(this.isnonEMptyString(productCode)){
      reqURl = reqURl + `productCode=${productCode}`;
    }
    if(this.isnonEMptyString(subProductCode)){
      reqURl = reqURl + `&subProductCode=${subProductCode}`;
    }
    if(this.isnonEMptyString(currency)){
      reqURl = reqURl + `&currency=${currency}`;
    }
    if(this.isnonEMptyString(country)){
      reqURl = reqURl + `&country=${country}`;
    }
    if(this.isnonEMptyString(bankAbbvName)){
      reqURl = reqURl + `&bankAbbvName=${bankAbbvName}`;
    }
    return this.http.get<any>(reqURl, { headers } );
  }

  convertCurrencyFormatStrToFloat(numStr:any):number{
    let floatValue = 0;
    if(this.isnonEMptyString(numStr)){
      floatValue = parseFloat(numStr.toString().replace(",", "")) || 0;
    }
    return floatValue;
  }

  replaceStringToNumberFormat(numStr:any):number{
    let numValue = 0;

    if(this.isnonEMptyString(numStr)){
      numStr = numStr.replace(new RegExp(FccGlobalConstant.NUMBER_REPLACE_CHARS, "g"), "");
      numValue = parseInt(numStr) || 0;
    }

    return numValue;
  }

  replaceNumberToFloatStringPerLang(numValue){
    let numStr = numValue.toString();
    const language = localStorage.getItem('language');
    if(this.isnonEMptyString(numValue)){
      if (language === 'fr') {
        numStr = numStr.replace(".", ",");
      }else if(language === 'ar'){
        numStr = numStr.replace(".", "٫");
      }
    }
    return numStr;
  }

  compareArray(array1 , array2, sortAndCompare = false){
    if(sortAndCompare){
      array1 = array1.slice().sort();
      array2 = array2.slice().sort();
      return this.isEqual(array1,array2);
    }else{
      return this.isEqual(array1,array2);
    }
  }
  isEqual(a, b)
  {
    return a.join() == b.join();
  }

  getTableData(widgetDetail,dashboardType?:any,listDataDownloadLimit?:any) {
    const appliedFilter = this.getAccountSummaryFilter();
    const filterParams = { "account_type":widgetDetail.accountType,
    "account_ccy":appliedFilter[FccGlobalConstant.ACCOUNT_CURRENCY],"entity":appliedFilter[FccGlobalConstant.ENTITY],
    "bank": this.isnonEMptyString(appliedFilter['bank']) ? appliedFilter['bank'] : appliedFilter[FccGlobalConstant.BANK],
    "dashboardType":dashboardType,"enableListDataDownload":"true",
    "skippagination": appliedFilter["skippagination"] };
    const paginatorParams = { first: 0, rows: listDataDownloadLimit, sortOrder: undefined, filters: {}, globalFilter: null };
    return this.listDefService.getTableData(widgetDetail.listdefName, JSON.stringify(filterParams), JSON.stringify(paginatorParams));
  }

  requestAccountStatement(request: any){
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const completePath = this.fccGlobalConstantService.getRequestAccountStatementUrl();
    const requestPayload = request;
    return this.http.post<any>(completePath, requestPayload, { headers });
  }

  convertToString(data){
    return data.toString();
  }

  setExchangeRateConfiguration(exchangeRateConfig){
    this.exchangeRateConfig = exchangeRateConfig;
  }

  getExchangeRateConfiguration(){
    return this.exchangeRateConfig;
  }

  isAppliedScreen(){
    FccGlobalConstant.ACCOUNT_SUMMARY_DASHBOARD_SCRN_URL_LIST.forEach(ele =>{
      if(this.router.url.indexOf(ele) > -1){
        return true;
      }
    });
    return false;
  }

  handlePurchaseOrders(response){
    const purchaseOrders = [];
    const lineItems = response['line_items'];
    const purchaseOrderGroupById = {};
    if (Array.isArray(lineItems)) {
      lineItems.forEach(function(lineItem) {
        purchaseOrderGroupById [lineItem.po_ref_id] = purchaseOrderGroupById [lineItem.po_ref_id] || [];
        purchaseOrderGroupById [lineItem.po_ref_id].push(lineItem);
      });

      Object.keys(purchaseOrderGroupById).forEach(function(key) {
        let purchaseOrder = null;
        if(purchaseOrderGroupById[key] !== undefined && (purchaseOrderGroupById[key].length>0)){
          purchaseOrder = purchaseOrderGroupById[key][0];
        }
        const obj = new Object();
        obj['PurchaseOrderID'] = purchaseOrder.po_ref_id;
        if(typeof(purchaseOrder.po_date)==='string'){
          let dateObject = new Date();
          if (purchaseOrder.po_date !== '' && purchaseOrder.po_date != null) {
            const dateParts = purchaseOrder.po_date.split('/');
            const userLanguage = window[FccGlobalConstant.USER_LANGUAGE];
            if (userLanguage === FccGlobalConstant.LANGUAGE_US) {
              dateObject = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[0] - 1, +dateParts[1]);
            } else {
              dateObject = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[1] - 1, +dateParts[0]);
            }
          }
          obj['PurchaseOrderDate'] = new Date(dateObject);
        }
        else{
          obj['PurchaseOrderDate'] = new Date(this.datePipe.transform(purchaseOrder.po_date,'dd/MM/yyyy'));
        }
        obj['PurchaseOrderTaxes'] = purchaseOrder.taxes;
        obj['PurchaseOrderLineItems'] = [];
        purchaseOrderGroupById[key].forEach(function(item) {
          const objLineItem = new Object();
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_DESCRIPTION] = item.description;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_CODE] = item.qty_unit_measr_code;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE] = item.qty_val;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_POS] = item.qty_tol_pstv_pct;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG] = item.qty_tol_neg_pct;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT] = item.price_amt;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_PRICE_UNIT_POS] = item.price_tol_pstv_pct;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg] = item.price_tol_neg_pct;
          objLineItem['PurchaseOrderLineItemNumber'] = item.line_item_number;
          obj['PurchaseOrderLineItems'].push(objLineItem);
        });
        purchaseOrders.push(obj);
    });
    }
    else if (lineItems.po_ref_id) {
      const obj = new Object();
      obj['PurchaseOrderID'] = lineItems.po_ref_id;
      if(typeof(lineItems.po_date)==='string'){
        let dateObject = new Date();
          if (lineItems.po_date !== '' && lineItems.po_date != null) {
            const dateParts = lineItems.po_date.split('/');
            const userLanguage = window[FccGlobalConstant.USER_LANGUAGE];
            if (userLanguage === FccGlobalConstant.LANGUAGE_US) {
              dateObject = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[0] - 1, +dateParts[1]);
            } else {
              dateObject = new Date(+dateParts[FccGlobalConstant.NUMERIC_TWO], +dateParts[1] - 1, +dateParts[0]);
            }
          }
          obj['PurchaseOrderDate'] = new Date(dateObject);
      }
      else{
        obj['PurchaseOrderDate'] = new Date(this.datePipe.transform(lineItems.po_date,'dd/MM/yyyy'));
      }
      obj['PurchaseOrderTaxes'] = lineItems.taxes;
      const objLineItem = new Object();
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_DESCRIPTION] = lineItems.description;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_CODE] = lineItems.qty_unit_measr_code;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE] = lineItems.qty_val;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_POS] = lineItems.qty_tol_pstv_pct;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG] = lineItems.qty_tol_neg_pct;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT] = lineItems.price_amt;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_PRICE_UNIT_POS] = lineItems.price_tol_pstv_pct;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg] = lineItems.price_tol_neg_pct;
      objLineItem['PurchaseOrderLineItemNumber'] = lineItems.line_item_number;
      obj['PurchaseOrderLineItems'] = [objLineItem];
      purchaseOrders.push(obj);
    }
    return purchaseOrders;
  }

  getSectionForm(
    sectionName: string, form: FCCFormGroup
  ): FCCFormGroup {
    return form.controls[
      sectionName
    ] as FCCFormGroup;
  }

  getControl(
    sectionForm: any,
    controlName: string
  ): FCCFormControl {
    return sectionForm[
      FccGlobalConstant.CONTROLS
    ][controlName] as FCCFormControl;
  }

  addControltoForm(modelJson) {
    const response :any = {};
    const form = new FCCFormGroup({});
    const sectionNames = [];
    Object.keys(modelJson).forEach((section) => {
      const renderDynamicSection =
        modelJson[section].rendered !== undefined
          ? modelJson[section].rendered
          : true;
        if (
          sectionNames.indexOf(section) === -1 &&
          typeof modelJson[section] === "object"
        ) {
          if (renderDynamicSection) {
            sectionNames.push(section);
            const control = new FCCFormGroup({});
            form.addControl(section, control);
          }
        }
    });
    response.form = form;
    response.sectionNames = sectionNames;
    return response;
  }

  getlistSortingData(productCode){
    //sorting data for list box component
    const sortingKeys = [];

    if(productCode == FccGlobalConstant.PRODUCT_LN) {
      sortingKeys.push({ name: 'Event_SORT_ASC', key: 'transaction_type',value:'1' });
      sortingKeys.push({ name: 'Event_SORT_DES', key: 'transaction_type',value:'-1' });
    } else {
      sortingKeys.push({ name: 'Event_SORT_ASC', key: 'tnx_type_code',value:'1' });
      sortingKeys.push({ name: 'Event_SORT_DES', key: 'tnx_type_code',value:'-1' });
    }

    // Excluding amount sorting for product which not required
    if(productCode !== FccGlobalConstant.PRODUCT_SE) {
      sortingKeys.push({ name: 'Event_SORT_AMT_HIGH', key: 'tnx_amt',value:'1' });
      sortingKeys.push({ name: 'Event_SORT_AMT_LOW', key: 'tnx_amt',value:'-1' });
    }

    sortingKeys.push({ name: 'Event_SORT_DATE_HIGH', key: 'bo_release_dttm',value:'1' });
    sortingKeys.push({ name: 'Event_SORT_DATE_LOW', key: 'bo_release_dttm',value:'-1' });

    return sortingKeys;
  }

  eventSorting(value,data){
    const sortType = value['_value'][0].value === "1" ? 'asc' : 'desc';
    const sortKey = value['_value'][0].key;
    if(data.length === 0){
      return [];
    }
       switch (sortKey) {
          case 'bo_release_dttm': {
          const userLng = localStorage.getItem('language');
          data.forEach((s)=>{
            const dateSplitValue = s.bo_release_dttm.split('/');
            const dateRevValue = dateSplitValue.reverse();
            const dateValue = (userLng.toLowerCase() === 'us') ? dateRevValue[0]+'/'+dateRevValue[2]+'/'+dateRevValue[1]:
            dateRevValue[0]+'/'+dateRevValue[1]+'/'+dateRevValue[2];
             s['orderByDate'] = -new Date(dateValue);
          });
           return (sortType==="desc") ? orderBy(data,'orderByDate','desc') :
           orderBy(data,'orderByDate');
          }
          case 'tnx_amt': {
             data.forEach((res)=>{
                 if(isNaN(res['tnx_amt'])){
                  res['tnx_amt'] = this.replaceCurrency(res['tnx_amt']);
                  res['tnx_amt'] = parseFloat(res['tnx_amt']);
                 }
             });
             return (sortType==="desc") ? orderBy(data,value['_value'][0].key,'desc') :
             orderBy(data,value['_value'][0].key);
          }
          default: {
            return (sortType==="desc") ? orderBy(data,value['_value'][0].key,'desc') :
            orderBy(data,value['_value'][0].key);
          }
        }
    }

  fetchAdhocBeneValidationConfig(params){
    this.getExternalStaticDataList(FccConstants.FCM_ADHOC_BENE_VALIDATION, params).subscribe(response => {
      if(response) {
        this.adhocBeneValidationConfig = response[0];
      }
    });
  }

  getAdhocBeneValidationConfig(){
    return this.adhocBeneValidationConfig;
  }

  convertNumbertoEng(inputDate){
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    const englishNumber = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g];
    const language = localStorage.getItem('language');
    let dateStr = inputDate.toString();
    if (language === 'ar') {
      for (let i = 0; i < 10; i++) {
        dateStr = dateStr.replace(arabicNumbers[i], i).replace(englishNumber[i], i);
      }
    }
    return dateStr;
  }

  convertDateFormat(dateEntered: string): Date {
    let dateObject = new Date();
    if (dateEntered !== '' && dateEntered != null) {
      const dateParts = dateEntered.split('/');
      const userLanguage = localStorage.getItem('language');
      if (userLanguage === FccGlobalConstant.LANGUAGE_US) {
        dateObject = new Date(+dateParts[2], +dateParts[0] - 1, +dateParts[1]);
      } else {
        dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
      }
    }
    return dateObject;
  }

  amountValidation(form, currency){
    this.fxAmountFieldList.forEach(amtField => {
      let isValid = true;
      form.get(amtField).clearValidators();
      let transferAmt = form.get(amtField).value;
      if (transferAmt !== '' && this.isNonEmptyValue(transferAmt)) {
        isValid = this.checkNegativeAmount(form, transferAmt, amtField);
        isValid = this.checkRegexAmount(form, transferAmt, amtField);
        if (isValid) {
          transferAmt = this.replaceCurrency(transferAmt);
          transferAmt = this.currencyConverterPipe.transform(transferAmt.toString(), currency);
          form.get(amtField).setValue(transferAmt);
        }
      }
    });
  }

  getISO(controlName, form){
    let iso = '';
      if(controlName.startsWith('ft')){
        iso = form.get(FccGlobalConstant.FT_CURRCODE).value.label;
      }
      if(controlName.startsWith('cu')) {
        iso = form.get('cuCurCode').value.currencyCode;
      }else{
        iso = this.isNonEmptyValue(form.get(FccGlobalConstant.CURRENCY)?.value) &&
        this.isNonEmptyValue(form.get(FccGlobalConstant.CURRENCY).value.currencyCode) ?
        form.get(FccGlobalConstant.CURRENCY).value.currencyCode : null;
      }
      return iso;
  }

  isValidAmountValue(form: any, controlName: any, fromAmount: any, fromCurrency: any, currencyDecimalplacesZero: any,
    currencyDecimalplacesThree: any){
    this.removeValidators(form, [controlName]);
    if (this.isnonEMptyString(fromAmount) && this.isNonEmptyValue(fromAmount.match(this.getRegexBasedOnlanguage()))) {
      const seprator = `${this.translate.instant('decimalSeprator')}`;
      const groupSeprator = `${this.translate.instant('groupSeprator')}`;
      fromAmount = fromAmount.split(groupSeprator).join('');
        if (this.isnonEMptyString(fromCurrency)) {
            if (currencyDecimalplacesThree.includes(fromCurrency)) {
                if (this.isValidDecimalLength(form, controlName, fromAmount, fromCurrency, FccGlobalConstant.LENGTH_3,
                  FccGlobalConstant.LENGTH_2, seprator) &&
                    this.isValidDecimalLength(form, controlName, fromAmount, fromCurrency, FccGlobalConstant.LENGTH_11,
                      FccGlobalConstant.LENGTH_1, seprator)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (currencyDecimalplacesZero.includes(fromCurrency) &&
                fromAmount.length <= FccGlobalConstant.LENGTH_15) {
                if (this.isValidDecimalLength(form, controlName, fromAmount, fromCurrency, FccGlobalConstant.LENGTH_0,
                  FccGlobalConstant.LENGTH_2, seprator)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (this.isValidDecimalLength(form, controlName, fromAmount, fromCurrency, FccGlobalConstant.LENGTH_2,
              FccGlobalConstant.LENGTH_2, seprator) &&
                this.isValidDecimalLength(form, controlName, fromAmount, fromCurrency, FccGlobalConstant.LENGTH_12,
                  FccGlobalConstant.LENGTH_1, seprator)) {
                return true;
            }
            else {
                if (!this.isDecimalPresentInAmount(fromAmount, seprator) &&
                    this.isValidDecimalLength(form, controlName, fromAmount, fromCurrency, FccGlobalConstant.LENGTH_12,
                      FccGlobalConstant.LENGTH_1, seprator)) {
                    return true;
                }
                else if (this.isValidDecimalLength(form, controlName, fromAmount, fromCurrency, FccGlobalConstant.LENGTH_12,
                  FccGlobalConstant.LENGTH_1, seprator) &&
                    this.isValidDecimalLength(form, controlName, fromAmount, fromCurrency, FccGlobalConstant.LENGTH_2,
                      FccGlobalConstant.LENGTH_2, seprator)
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
          return true;
        }
    }
    else if (this.isnonEMptyString(fromAmount) && (this.isNonEmptyValue(fromAmount.match("^[0-9\\.,]+$")) ||
    this.isNonEmptyValue(fromAmount.match(this.getRegexBasedOnlanguage())))) {
      const lang = localStorage.getItem('language');
      if(lang === 'fr' && this.amountAlreadyExists){
        let valueupdated = this.replaceCurrency(fromAmount);
        sessionStorage.setItem('decimalValue','null');
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), fromCurrency);
        form.get(controlName).setValue(valueupdated);
        form.get(controlName).updateValueAndValidity();
        return true;
      }
    }
    else if (this.isnonEMptyString(fromAmount) && !this.isNonEmptyValue(fromAmount.match(this.getRegexBasedOnlanguage()))) {
        form.get(controlName).setErrors({ invalidAmount: true });
        return false;
    } else {
        return true;
    }
  }

  isDecimalPresentInAmount(fromAmount: any, seprator: any){
    if (fromAmount.indexOf(seprator) > -1) {
        return true;
    }
    return false;
  }

  isValidDecimalLength(form: any, controlName: any, fromAmount: any, fromCurrency: any, requiredLength: any,
    partType: any, seprator: any){
      const amountParts = fromAmount.split(seprator);
      if (partType === FccGlobalConstant.LENGTH_1 && this.isNonEmptyValue(amountParts) &&
          amountParts[0].length <= requiredLength) {
          return true;
      }
      if (partType === FccGlobalConstant.LENGTH_1 && this.isNonEmptyValue(amountParts) &&
          amountParts[0].length > requiredLength) {
          form.get(controlName).setErrors({ amountMaxLengthRangeReached: { currency: fromCurrency } });
          return false;
      }
      if(partType === FccGlobalConstant.LENGTH_2 && amountParts.length === 1){
        return true;
      }
      if(partType === FccGlobalConstant.LENGTH_2 && amountParts.length > 1 && amountParts[1].length <= requiredLength){
        return true;
      }
      else if (partType === FccGlobalConstant.LENGTH_2 && this.isNonEmptyValue(amountParts) &&
          amountParts.length > 1 && amountParts[1].length === requiredLength) {
          return true;
      }
      let allowedDecimalPointText = '';
      if(requiredLength === FccGlobalConstant.LENGTH_2){
        allowedDecimalPointText = `${this.translate.instant('two')}`;
      }
      if(requiredLength === FccGlobalConstant.LENGTH_3){
        allowedDecimalPointText = `${this.translate.instant('three')}`;
      }
      if(partType === FccGlobalConstant.LENGTH_2 && amountParts.length > 1 && amountParts[1].length > requiredLength){
        form.get(controlName).setErrors({ decimalLengthRangeReached:
          {
            currency: fromCurrency,
            decimalPoint: requiredLength,
            allowedDecimalPoint:allowedDecimalPointText.toLowerCase()
          } } );
        return false;
      }
      else {
          return false;
      }
  }

  getFormElement(form,element){
    return form.get(element) ? form.get(element) : form.controls[element];
  }
  getEmptyAccount(){
    const empty: { label: string; value: any } = {
      label: '',
      value: {
        label: '',
        shortName: '' ,
        info: `${this.translate.instant('emptyAccountNone')}`
      }
    };
    return empty;
  }
  getUpdatedAccount(value){
    const account: { label: string; value: any } = {
      label: value.number,
      value: {
          label: value.number,
          info: value.currency,
          shortName: value.number,
          description: value.description
      }
    };
    return account;
  }

  // return true if user is having product save permission, else false
  isUserHavingSavePermission(prodCode, subProdCode, entity): boolean{
    let permission;
    if(this.isnonEMptyString(prodCode) && this.isnonEMptyString(subProdCode)) {
      permission = `${prodCode}_${subProdCode}_save`.toLowerCase();
    } else if(this.isnonEMptyString(prodCode)) {
      permission = `${prodCode}_save`.toLowerCase();
    } else {
      permission = '';
    }
    this.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.globalRoleCheck = response.enableGlobalRoleCheck;
      }
    });
    if(this.isnonEMptyString(permission)) {
      let isHavingPermission;
      if(this.globalRoleCheck) {
        isHavingPermission = this.isnonEMptyString(entity) ?
        (this.getUserEntityPermissionFlag(permission, 'global') || this.getUserEntityPermissionFlag(permission, entity)) :
        this.getUserPermissionFlag(permission);
        return isHavingPermission;
      } else {
        isHavingPermission = this.isnonEMptyString(entity) ?
        this.getUserEntityPermissionFlag(permission, entity) :
        this.getUserPermissionFlag(permission);
        return isHavingPermission;
      }
    }
    // to retain existing behavior, when unable to form permission
    return true;
  }

    // Using the object gives more performance than a Map
    public availableInCache(request: HttpRequest<any>): boolean {
       return this.key(request) in this.cachedRequests;
    }

    public getFromCache(request: HttpRequest<any>): Observable<HttpEvent<any>> {
       return this.cachedRequests[this.key(request)];
     }

    public setToCache(request: HttpRequest<any>, response: Observable<HttpEvent<any>>): void {
       this.cachedRequests[this.key(request)] = response;
    }

    public deleteFromCache(request: HttpRequest<any>): void {
       delete this.cachedRequests[this.key(request)];
    }

    public clearCache(request: HttpRequest<any>): void {
      delete this.cachedRequests[this.key(request)];
   }

    private key(request: HttpRequest<any>): string {
       return [request.urlWithParams, request.responseType].join('#');
    }

  addMonthAttributes(datePickerMonth: Element) {
      if(datePickerMonth !== undefined) {
        datePickerMonth.setAttribute('onfocus', 'this.size=12;');
        datePickerMonth.setAttribute('onblur', 'this.size=0;');
      }
  }
  addYearAttributes(datePickerYear: Element) {
      if(datePickerYear !== undefined) {
        datePickerYear.setAttribute('onfocus', 'this.size=20;');
        datePickerYear.setAttribute('onblur', 'this.size=0;');
      }
  }

  getSelectedMonthEvents() {
    const datePicker = document.getElementsByClassName("ui-datepicker")[0];
    if(datePicker) {
      setTimeout(()=> {
        const datePickerYear = datePicker.getElementsByClassName("ui-datepicker-year")[0];
        const datePickerMonth = datePicker.getElementsByClassName("ui-datepicker-month")[0];
        this.addMonthAttributes(datePickerMonth);
        this.addYearAttributes(datePickerYear);
      },0);
    }
  }
}

export interface FcmBeneficiaryStatusRequest{
  event:string,
  makerRemarks:string,
  checkerRemarks:string
}
