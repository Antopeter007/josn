import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DatePipe } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, SelectItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

import { ProductService } from '../../../base/services/product.service';
import { StepperParams } from '../../../common/model/stepper-model';
import { LeftSectionService } from '../../../corporate/common/services/leftSection.service';
import { ProductStateService } from '../../../corporate/trade/lc/common/services/product-state.service';
import { TransactionDetailsMap } from '../../../corporate/trade/lc/common/services/transaction-map.service';
import { FilelistService } from '../../../corporate/trade/lc/initiation/services/filelist.service';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { LcReturnService } from '../../../corporate/trade/lc/initiation/services/lc-return.service';
import { PreviewService } from '../../../corporate/trade/lc/initiation/services/preview.service';
import { UtilityService } from '../../../corporate/trade/lc/initiation/services/utility.service';
import { UiService } from '../../../corporate/trade/ui/common/services/ui-service';
import { FccConstants } from '../../core/fcc-constants';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { ProductFormHeaderParams } from '../../model/params-model';
import { TaskInput } from '../../model/task-model';
import { TransactionDetails } from '../../model/TransactionDetails';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../../services/dashboard.service';
import { FccHelpService } from '../../services/fcc-help.service';
import { FccTaskService } from '../../services/fcc-task.service';
import { FormAccordionPanelService } from '../../services/form-accordion-panel.service';
import { FormModelService } from '../../services/form-model.service';
import { MultiBankService } from '../../services/multi-bank.service';
import { PhrasesService } from '../../services/phrases.service';
import { ProductMappingService } from '../../services/productMapping.service';
import { ReauthService } from '../../services/reauth.service';
import { TransactionDetailService } from '../../services/transactionDetail.service';
import { AmendComparisonViewComponent } from '../amend-comparison-view/amend-comparison-view.component';
import { MasterViewDetailComponent } from '../master-view-detail/master-view-detail.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { DynamicContentComponent } from './../../../base/components/dynamic-content.component';
import { EnumMapping } from './../../../base/model/enum-mapping';
import { FCCBase } from './../../../base/model/fcc-base';
import { FCCFormControl, FCCFormGroup } from './../../../base/model/fcc-control.model';
import { AmendCommonService } from './../../../corporate/common/services/amend-common.service';
import {
  BeneConstants
} from './../../../corporate/system-features/beneficiary-maintenance/beneficiary-general-detail/beneficiary-general-details.constants';
import { NarrativeService } from './../../../corporate/trade/lc/initiation/services/narrative.service';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { EventEmitterService } from './../../services/event-emitter-service';
import { LegalTextService } from './../../services/legal-text.service';
import { TabPanelService } from './../../services/tab-panel.service';

@Component({
  selector: 'fcc-product-component',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends FCCBase implements OnInit, OnDestroy, AfterViewChecked {
  public static EMPTY: any = new Object();
  menuToggleFlag: string;
  storeIndexValue = 0;
  productCode: string;
  save = this.translateService.instant('save');
  previous = this.translateService.instant('previous');
  next = this.translateService.instant('next');
  Submit = this.translateService.instant('submit');
  showProgresssSpinner: boolean;
  showSavedTimeText: boolean;
  savedTime = '';
  lcHeaderKey: string;
  sections = false;
  types: SelectItem[];
  selectedType: string;
  tasks = false;
  value = 0;
  items: any[] = [];
  componentType: string;
  isEntityUser: boolean;
  eventRequired: boolean;
  @ViewChild('container') container: DynamicContentComponent;
  @ViewChild('container1') container1: DynamicContentComponent;
  @ViewChild('container2') container2: DynamicContentComponent;
  @ViewChild('container3') container3: AmendComparisonViewComponent;
  @ViewChildren('hiddenContainer') hiddenContainer: QueryList<DynamicContentComponent>;
  isParentFormValid: boolean;
  buttonDetails: any[] = [];
  intervalId1;
  intervalId2;
  count = 1;
  savedTimeTextShowvalue = false;
  public spinnerShow = new BehaviorSubject(false);
  public saveUrlStatus = new BehaviorSubject(this.save);
  public savedTimeTextShow = new BehaviorSubject(false);
  public savedTimeText = new BehaviorSubject(this.savedTime);
  timerCode = 60000;
  minutesago = `${this.translateService.instant('minutesAgo')}`;
  savedJustNow = `${this.translateService.instant('savedJustNow')}`;
  leftSectionEnabled;
  referenceId: string;
  beneGroupId: string;
  eventId: string;
  applDate: string;
  @Input() inputParams;
  @Input() secondInputParams;
  isStateReloadNeeded = false;
  isMessageDraftReloadNeeded = false;
  mode: any;
  tnxType: any;
  refId: any;
  tnxId: any;
  taskId: any;
  eventTypeCode: any;
  option: any;
  subTnxType: any;
  subTnxTypeCode: any;
  templateId: any;
  operation: any;
  prodStatus: any;
  tnxStatus: any;
  subProductCode: any;
  actionReqCode: any;
  stepperParams: StepperParams;
  taskInputParams: TaskInput = {};
  review = false;
  isMaster: boolean;
  accordionViewRequired = false;
  isLoadMasterPopup = false;
  reviewComments: any;
  tnxStatCode: any;
  subTnxStatCode: any;
  reInit: boolean;
  reviewCommentsHeader: any;
  subscription: Subscription;
  disabled = 'disabled';
  modeTnxType = 'mode';
  moduleName: string;
  IEview = navigator.userAgent.indexOf('Trident') !== -1;
  channelRefID: any;
  setSystemID = false;
  channelReference: any;
  parentTnxId: any;
  childTnxId: any;
  stepperReEval = false;
  dialogRef: DynamicDialogRef;
  taskDialog: DynamicDialogRef;
  stateType = '';
  stateId: string;
  sectionSubscription: Subscription;
  taskSubscription: Subscription;
  // review Screen from tranasction tab
  reviewTnxTypeCode: any;
  reviewSubTnxType: any;
  // review Screen from event tab
  eventTnxTypeCode: any;
  eventSubTnxType: any;
  parent = false;
  viewMaster = false;
  titleKey: any;
  form: FCCFormGroup;
  params = FccGlobalConstant.PARAMS;
  readonly = FccGlobalConstant.READONLY;
  dir: string = localStorage.getItem('langDir');
  styleClassName: string;
  sysId = 'sysID';
  sysTdArabic = 'sysIDarabic';
  stickyDivArabic = 'stickyDivArabic';
  stickyDiv = 'stickyDiv';
  buttonStyle: any;
  stickyDivIE = 'stickyDivIE';
  prevButtonStyle: any;
  prevButtonArabic = 'primaryButton prevButtonArabic';
  mainheaderStyle: any;
  mainheaderStyleArabic = 'mainheaderArabic';
  mainheader = 'mainheader';
  stickyDivIEArabic = 'stickyDivIEArabic';
  tnxIdForAmend;
  previousTnxIdForAmend;
  showSpinner = true;
  transaction1Header;
  transaction2Header;
  hasTaskPermission: boolean;
  hasCreateTaskPermission: boolean;
  lastLoginLabel: string;
  showLastLogin: boolean;
  userDateTime: string;
  bankDateTime: string;
  isBankTime = false;
  action: any;
  inquiryEventTab: any;
  loadState = true;
  warningHeader: any;
  warningBody: any;
  displayConfirmationDialog: boolean;
  productComponentDestroy = false;
  setStateSubscription: Subscription;
  loadEventValuesSubscription: Subscription;
  initiateProdCompSubscription: Subscription;
  editClickSubscription: Subscription;
  fieldsToFocus: string[] = [];
  isMasterView = false;
  phraseClickSubscription: Subscription;
  isamendmentComparisonEnabled: any = false;
  UnknownDynamicComponent = 'UnknownDynamicComponent';
  viewIndicator = this.translateService.instant('MASTER_DETAILS_HEADER');
  formHeaderInputData: ProductFormHeaderParams = {};
  onClickViewSubscription: Subscription;
  formHeaderComponent;
  accountId: any;
  entityAbbvName: any;
  category: any;
  beneAccountIDResponse;
  readonly subProductsWhichDontNeedMaster: string[] = [FccGlobalConstant.SUB_PRODUCT_CODE_CSTD];
  submitClicked = false;
  pendingRequest = false;
  isSaveAllowed = true;
  issavecompleted = new Subject();
  removeCursorPointer = false;
  isAccessibilityControlAdded = false;
  paymentBatchBalanceValidation = false;
  beneficiaryDefaultAccountValidation = false;
  dynamicFieldFlag = false;
  dynamicFieldIndex: any;
  customerRef;
  secondtnxpdf: any;
  amendedValue: boolean;
  amendProductsList = [FccGlobalConstant.PRODUCT_LC, FccGlobalConstant.PRODUCT_SI, FccGlobalConstant.PRODUCT_BG,
    FccGlobalConstant.PRODUCT_EC];  // Product scope is only for these 4 products.
  isRefId:boolean = false;
  issubprodapplicable:boolean = false;
  enableCounterSection: boolean;
  globalDashboardUrl: any;
  logoutPopupSubscription: Subscription;

  constructor(
    protected activatedRoute: ActivatedRoute, protected router: Router, protected leftSectionService: LeftSectionService,
    protected utilityService: UtilityService, protected translateService: TranslateService, protected lcReturnService: LcReturnService,
    protected fileList: FilelistService, protected elementRef: ElementRef, protected route: ActivatedRoute,
    protected commonService: CommonService, protected stateService: ProductStateService,
    protected eventEmitterService: EventEmitterService, protected previewService: PreviewService,
    protected reauthService: ReauthService, protected transactionDetailService: TransactionDetailService,
    protected productMappingService: ProductMappingService, protected messageService: MessageService,
    protected dialogService: DialogService, protected tabservice: TabPanelService,
    protected resolver: ComponentFactoryResolver, protected formModelService: FormModelService,
    protected narrativeService: NarrativeService, protected titleService: Title, protected multiBankService: MultiBankService,
    protected transactionDetailsMap: TransactionDetailsMap, protected phraseService: PhrasesService,
    protected fccHelpService: FccHelpService,
    protected amendCommonService: AmendCommonService, protected taskService: FccTaskService,
    protected changeDetector: ChangeDetectorRef, protected formAccordionPanelService: FormAccordionPanelService,
    protected datepipe: DatePipe, protected uiService: UiService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected legalTextService: LegalTextService, protected productService: ProductService,
    protected formControlService: FormControlService,
    protected dashboardService: DashboardService
  ) {
    super();
    this.subscription = commonService.missionAnnounced$.subscribe(
      mission => {
        this.toggleNextButton(mission);
      });

    this.editClickSubscription = commonService.editClicked$.subscribe(
      sectionName => {
        this.navigateToSection(sectionName);
      });

    this.sectionSubscription = leftSectionService.dynamicSection$.subscribe(
      section => {
        this.setDynamicSection(section);
      });

    this.taskSubscription = taskService.notifySaveTransactionfromTask$.subscribe(
      taskObj => {
        if (taskObj) {
          this.saveNewTransaction();
        }
      });

    this.onClickViewSubscription = productService.onClickView$.subscribe(e => {
          if (e) {
            this.onClickView();
          }
        });

    this.router.events.subscribe(event => {
      // to close opened dialog when navigating away
      if (event instanceof NavigationEnd) {
        this.closeDialog();
      }
    });
  }

  ngOnInit() {
    this.commonService.referenceId = undefined;
    this.commonService.isDiscardClicked = false;
    sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    this.fccHelpService.helpsectionId.next('GD');
    this.showSpinner = true;
    this.subjectInitialize();
    this.commonService.getMenuValue().subscribe((value) => {
      this.menuToggleFlag = value;
    });
    this.isMasterView = false;
    this.initiateProductComp();
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    if (this.IEview && this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      this.buttonStyle = this.stickyDivIEArabic;
    } else if (this.IEview && this.dir === FccGlobalConstant.LANUGUAGE_DIR_OTHERLANG) {
      this.buttonStyle = this.stickyDivIE;
    } else if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      this.styleClassName = this.sysTdArabic;
      this.buttonStyle = this.stickyDivArabic;
    } else {
      this.styleClassName = this.sysId;
      this.buttonStyle = this.stickyDiv;
    }

    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      this.prevButtonStyle = this.prevButtonArabic;
      this.mainheaderStyle = this.mainheaderStyleArabic;
    } else {
      this.prevButtonStyle = 'primaryButton';
      this.mainheaderStyle = this.mainheader;
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.displayConfirmationDialog = response.displayConfirmationDialog;
        this.enableCounterSection = response.enableCounterSection;
      }
    });
    if (this.eventEmitterService.subsVarData === undefined && this.displayConfirmationDialog === true) {
      this.eventEmitterService.subsVarData = this.eventEmitterService.invokeProductComponentSaveFunction.
        subscribe(() => {
          this.saveData();
        });
    }
    if (this.eventEmitterService.subsPopUpData === undefined) {
      this.eventEmitterService.subsPopUpData =
        this.eventEmitterService.invokeProductComponentSaveNewFunction.subscribe(
          () => {
            if (this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE) === FccGlobalConstant.DRAFT_OPTION) {
              this.eventId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_ID);
              this.referenceId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
            }
            this.saveData();
          }
        );
    }
    this.commonService.productState.subscribe(params => {
      if (params && params !== ProductComponent.EMPTY && params.responseObject &&
        (params.responseObject.product_code === this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT) ||
          params.templateBacktoBack )) {
        this.setState(params.responseObject, params.apiModel, params.isMaster, params.subTnxType,
          params.templateBacktoBack, params.fieldsList, params.sectionsList);
      }
    });
    this.loadEventValuesSubscription = this.commonService.loadForEventValues.subscribe(data => {
      if (data && data.referenceId) {
        this.loadForEvent(data.referenceId, data.transactionId, data.eventTnxTypeCode,
          data.param, data.stateTypeNotReq);
      }
    });
    this.initiateProdCompSubscription = this.commonService.initiateProdComp$.subscribe(data => {
      if (data && this.secondInputParams) {
        this.initiateProductComp();
      }
    });
    this.taskService.currentTaskIdFromWidget$.subscribe(value => {
      if (value) {
        this.selectedType = FccGlobalConstant.TASKS;
        this.tasks = true;
        this.taskId = value;
      }
    }
    );
    if (this.phraseClickSubscription === undefined) {
      this.phraseClickSubscription = this.phraseService.requestBuild$.
        subscribe((data) => {
          if (data && data != null) {
            this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(model => {
              this.buildRequestObject(model, FccGlobalConstant.SAVE);
              this.phraseService.fetchPhrasesDetails(data.form, data.productCode, data.phraseField, data.phraseCode,
                data.updateCounter, data.entityName);
            });
          }
        });
    }

    if (this.productService.checkStateForErrorValidation(this.tnxType, this.option, this.mode, this.tnxId, this.parent, this.operation)) {
      this.stateService.getSectionNames(this.isMaster, this.stateType).forEach(section => {
        if (section !== FccGlobalConstant.SUMMARY_DETAILS) {
          const sectionData = this.stateService.getSectionData(section, this.productCode, false);
          this.loadTabsonInit(sectionData);
          this.setErrors(sectionData, section);
        }
      });
    }

    this.commonService.paymentBatchBalanceValidation.subscribe((res) => {
      this.paymentBatchBalanceValidation = res;
    });

    this.commonService.beneficiaryDefaultAccountValidation.subscribe((res) => {
      if(res) {
        this.commonService.beneficiaryDefaultAccountValidation.next(false);
      }
      this.beneficiaryDefaultAccountValidation = res;
    });
    this.commonService.isSubmitAllowed.subscribe(
      data => {
        if (data) {
          this.submitClicked = false;
        }
      }
    );
    this.commonService.saveAllowed.subscribe(
      data => {
        this.isSaveAllowed = data;
      }
    );

    this.logoutPopupSubscription = this.commonService.isSaveOperationFromLogoutPopUp$.subscribe(result => {
        if (result)
        {
          this.saveData();
        }
      });
  }

  initiateProductComp() {
    const subProductCode = FccGlobalConstant.SUB_PRODUCT_CODE;
    const tnxTypeCode = FccGlobalConstant.TNX_TYPE_CODE;
    const option = FccGlobalConstant.OPTION;
    const templateId = FccGlobalConstant.TEMPLATE_ID;
    const mode = FccGlobalConstant.MODE;
    const refId = FccGlobalConstant.REF_ID;
    const tnxId = FccGlobalConstant.TNX_ID;
    const tnxid = FccGlobalConstant.TNXID;
    const taskId = FccGlobalConstant.TASK_ID;
    const referenceId = FccGlobalConstant.REFERENCE_ID;
    const subTnxTypeCode = FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE;
    const operation = FccGlobalConstant.OPERATION;
    const actionReqCode = FccGlobalConstant.ACTION_REQUIRED_CODE;
    const action = FccGlobalConstant.ACTION;
    const accountId = FccGlobalConstant.ACCOUNTID;
    const entityAbbvName = FccGlobalConstant.ENTITY_ABBV_NAME;
    this.activatedRoute.queryParams.subscribe(params => {
      this.commonService.clearQueryParameters();
      Object.keys(params).forEach(element => {
        this.customerRef = params['custRef'];
        if (this.productService.isParamValid(params[element])) {
          if (element === 'productCode') {
            this.productCode = params[element];
            this.subProductCode = params[subProductCode];
            this.tnxType = params[tnxTypeCode];
            this.option = params[option];
            this.templateId = params[templateId];
            this.mode = params[mode];
            this.refId = (params[refId] !== undefined) ? params[refId] : params[referenceId];
            this.tnxId = (params[tnxId] !== undefined) ? params[tnxId] : params[tnxid];
            this.subTnxType = params[subTnxTypeCode];
            this.operation = params[operation];
            this.action = params[action];
            this.actionReqCode = params[actionReqCode];
            this.taskId = params[taskId];
            this.accountId = params[accountId];
            this.entityAbbvName = params[entityAbbvName];
            this.commonService.validateProductCodeWithRefId(this.productCode, this.refId);
          } else {
            this.tnxType = params[tnxTypeCode];
            this.option = params[option];
            this.templateId = params[templateId];
            this.mode = params[mode];
            this.refId = (params[refId] !== undefined) ? params[refId] : params[referenceId];
            this.tnxId = params[tnxId];
            this.subTnxType = params[subTnxTypeCode];
            this.operation = params[operation];
            this.action = params[action];
            this.actionReqCode = params[actionReqCode];
            this.taskId = params[taskId];
            this.accountId = params[accountId];
            this.entityAbbvName = params[entityAbbvName];
          }
          this.commonService.putQueryParameters(element, params[element]);
        }
      });
      if (this.commonService.isViewPopup && this.commonService.viewPopupFlag
        && !this.commonService.parent && (params[tnxTypeCode] === '03'
        && params['subTnxTypeCode'] !== FccGlobalConstant.N003_AMEND_RELEASE)) {
        this.commonService.putQueryParameters(FccGlobalConstant.TNX_TYPE_CODE, '');
        this.commonService.putQueryParameters(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE, '');
        this.commonService.putQueryParameters(FccGlobalConstant.OPTION, 'existing');
        this.commonService.putQueryParameters(FccGlobalConstant.MODE, '');
      }
      this.productService.setTranslatedTitle(this.productCode, this.subProductCode, this.mode);
      this.setParamsBasedonInputParams();
      this.setParamsBasedonSecondInputParams();
      if ((this.tnxId === '' || this.tnxId === undefined && (this.mode === 'view')) ||
        this.tnxType === FccGlobalConstant.N002_AMEND || this.viewMaster ||
        this.parent || this.subTnxType === FccGlobalConstant.N003_PAYMENT) {
        this.isMaster = true;
      } else {
        this.isMaster = false;
      }
      if (this.tnxType === FccGlobalConstant.N002_INQUIRE && this.option === FccGlobalConstant.ACTION_REQUIRED) {
        this.productService.actionRequiredheaderNameParams(this.productCode, this.tnxId, this.mode,
          this.tnxType, this.subTnxType, this.subProductCode, this.option).subscribe(response => {
            this.lcHeaderKey = response;
          });
      } else if (this.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC) {
        this.lcHeaderKey = this.productService.getHeaderName(null, null, null, null, null, this.option,
          null, this.action);
      } else {
        this.lcHeaderKey = this.productService.getHeaderName(this.productCode, this.mode,
          this.tnxType, this.subTnxType, this.subProductCode, this.option, this.operation, null);
      }
      // this.getFormName();
      // set formheader input data
      this.formHeaderInputData = {
        productCode: this.productCode,
        subProductCode: this.subProductCode,
        tnxTypeCode: this.tnxType,
        subTnxTypeCode: this.subTnxType,
        option: this.option,
        operation: this.operation,
        mode: this.mode,
        refId: this.refId,
        tnxId: this.tnxId,
        showDescriptionHeader: this.productService.displayDescription({
          productCode: this.productCode,
          subProductCode: this.subProductCode
        })
      };
      this.formHeaderComponent = this.productService.getFormHeaderComponent();
      this.translateService.get('corporatechannels').subscribe(() => {
        this.save = this.translateService.instant('save');
        this.previous = this.translateService.instant('previous');
        this.next = this.translateService.instant('next');
        this.Submit = this.translateService.instant('submit');
        this.reviewCommentsHeader = `${this.translateService.instant('reviewCommentsHeader')}`;
        this.channelReference = `${this.translateService.instant('channelReference')}`;
        this.minutesago = `${this.translateService.instant('minutesAgo')}`;
        this.savedJustNow = `${this.translateService.instant(FccGlobalConstant.SAVED_JUST_NOW)}`;
        this.warningBody = `${this.translateService.instant('warningBody')}`;
      });

      this.warningHeader = `${this.translateService.instant('warningHeader')}`;
      this.commonService.putQueryParameters('isMaster', this.isMaster);
      this.commonService.getUserPermission('').subscribe(() => {
        this.hasTaskPermission = this.commonService.getUserPermissionFlag(FccGlobalConstant.COLLAB_ACCESS);
        this.hasCreateTaskPermission = this.productService.getTaskCreatePermission();
        this.initProductModelAndState();
        // this.handleStateInitialization(this.reInit);
        this.multiBankService.multiBankAPI(this.productCode, this.subProductCode);
      });
      if (this.commonService.getAngularProducts() && this.commonService.getAngularProducts().indexOf(this.productCode) > -1
        && this.operation !== FccGlobalConstant.PREVIEW) {
        this.auditCall();
      }
    });
    this.commonService.getAddressBasedOnParamData(FccGlobalConstant.PARAMETER_P347, this.productCode, this.subProductCode);
    this.showSpinner = false;
  }

  auditCall() {
    const requestPayload = {
      productCode: this.productCode,
      subProductCode: this.subProductCode,
      operation: this.operation,
      option: this.option,
      tnxtype: this.tnxType,
      mode: this.mode,
      subTnxType: this.subTnxType,
      listDefName: '',
      referenceId: this.refId,
      tnxId: this.tnxId,
      action: this.action,
      category: this.category
    };

    this.commonService.audit(requestPayload).subscribe(() => {
      //eslint : no-empty-function
    });
  }
  createNewEventForActionRequired() {
    if (this.option === FccGlobalConstant.ACTION_REQUIRED &&
      (this.mode !== FccGlobalConstant.VIEW_MODE && this.mode !== FccGlobalConstant.DRAFT_OPTION)
      && this.tnxId !== undefined && this.tnxId !== null) {
      this.tnxId = undefined;
    }
  }

  protected setParamsBasedonInputParams() {
    if (this.inputParams) {
      this.productCode = this.inputParams.productCode;
      this.refId = this.inputParams.refId;
      this.tnxId = this.inputParams.tnxId;
      this.mode = this.inputParams.mode;
      this.componentType = this.inputParams.componentType;
      this.eventRequired = this.inputParams.eventRequired;
      this.accordionViewRequired = this.inputParams.accordionViewRequired;
      this.isLoadMasterPopup = this.inputParams.isLoadMasterPopup;
      this.isMasterView = this.inputParams.isMasterView;
      this.subTnxType = this.inputParams.subTnxTypeCode;
      this.tnxType = this.inputParams.eventTypeCode ? this.inputParams.eventTypeCode : this.tnxType;
      let id;
      const transactionDetails: TransactionDetails = {
        subTnxType: this.inputParams.subTnxTypeCode,
        tnxTypeCode: this.inputParams.eventTypeCode ? this.inputParams.eventTypeCode : this.inputParams.tnxTypeCode,
        transactionTab: this.inputParams.transactionTab,
        eventTab: this.inputParams.eventTab,
        tnxStatCode: this.inputParams.reviewTnxStateCode,
        actionReqCode: this.inputParams.reviewActionReqCode,
        prodStatCode: this.inputParams.reviewprodStatCode,
        stateType: EnumMapping.stateTypeEnum.EVENTSTATE
      };
      if (this.tnxId === '') {
        this.isMaster = true;
        transactionDetails.stateType = EnumMapping.stateTypeEnum.MASTERSTATE;
        id = this.refId;
        this.stateType = EnumMapping.stateTypeEnum.MASTERSTATE;
      } else {
        this.isMaster = false;
        transactionDetails.stateType = EnumMapping.stateTypeEnum.TNXSTATE;
        id = this.tnxId;
        this.stateType = EnumMapping.stateTypeEnum.TNXSTATE;
      }
      this.stateId = id;
      transactionDetails.isMaster = this.isMaster;
      this.transactionDetailsMap.initializeMaps(id, transactionDetails);

      this.reInit = this.inputParams.reInit;
      this.parent = this.inputParams.parent;
      this.viewMaster = this.inputParams.viewMaster;
    }
  }

  protected setParamsBasedonSecondInputParams() {
    this.isamendmentComparisonEnabled = this.secondInputParams && Object.keys(this.secondInputParams).length > 0;
    if (this.isamendmentComparisonEnabled) {
      this.productCode = this.secondInputParams.productCode;
      this.refId = this.secondInputParams.refId;
      this.tnxId = this.secondInputParams.tnxId;
      this.mode = this.secondInputParams.mode;
      this.componentType = this.secondInputParams.componentType;
      this.eventRequired = this.secondInputParams.eventRequired;
      this.accordionViewRequired = this.secondInputParams.accordionViewRequired;
      this.subTnxType = this.secondInputParams.subTnxTypeCode;
      const transactionDetails : TransactionDetails = {
        subTnxType: this.secondInputParams.subTnxTypeCode,
        tnxTypeCode: this.secondInputParams.eventTypeCode,
        transactionTab: this.secondInputParams.transactionTab,
        eventTab: this.secondInputParams.eventTab,
        tnxStatCode: this.secondInputParams.reviewTnxStateCode,
        actionReqCode: this.secondInputParams.reviewActionReqCode,
        prodStatCode: this.secondInputParams.reviewprodStatCode,
        stateType: EnumMapping.stateTypeEnum.EVENTSTATE
      };
      this.isMaster = false;
      //this.isamendmentComparisonEnabled = true;
      transactionDetails.stateType = EnumMapping.stateTypeEnum.TNXSTATE;
      this.stateType = EnumMapping.stateTypeEnum.TNXSTATE;
      transactionDetails.isMaster = this.isMaster;
      this.reInit = this.secondInputParams.reInit;
      this.viewMaster = this.secondInputParams.viewMaster;
      this.tnxIdForAmend = this.secondInputParams.tnxIdForAmend;
      this.previousTnxIdForAmend = this.secondInputParams.previousTnxIdForAmend;
      const id = this.previousTnxIdForAmend;
      this.stateId = id;
      this.amendedValue = (this.secondInputParams.previousTnxIdForAmend && this.secondInputParams.tnxIdForAmend
        && (this.secondInputParams.previousTnxIdForAmend !== this.secondInputParams.tnxIdForAmend) &&
         this.operation === FccGlobalConstant.PREVIEW
        && this.mode === FccGlobalConstant.VIEW_SCREEN && this.amendProductsList.includes(this.productCode)
        && this.tnxType === FccGlobalConstant.N002_AMEND);
        if (this.amendedValue) {
          this.commonService.hideamendtoggle = true;
        }
      // 1. this.amendedValue is a flag with which we are controlling this behaviour. In this component our focus is on setting state
      this.transactionDetailsMap.initializeMaps(id, transactionDetails);

      const transactionDetails1 : TransactionDetails = {
        subTnxType: this.secondInputParams.subTnxTypeCode,
        tnxTypeCode: this.secondInputParams.tnxTypeCode ? this.secondInputParams.tnxTypeCode : this.secondInputParams.eventTypeCode,
        transactionTab: this.secondInputParams.transactionTab,
        eventTab: this.secondInputParams.eventTab,
        tnxStatCode: this.secondInputParams.reviewTnxStateCode,
        actionReqCode: this.secondInputParams.reviewActionReqCode,
        prodStatCode: this.secondInputParams.reviewprodStatCode,
        stateType: EnumMapping.stateTypeEnum.TNXSTATE
      };
      transactionDetails1.stateType = EnumMapping.stateTypeEnum.TNXSTATE;
      const id1 = this.tnxIdForAmend;
      transactionDetails1.isMaster = true;
      this.transactionDetailsMap.initializeMaps(id1, transactionDetails1);
      this.transaction1Header = this.secondInputParams.transaction1Header;
      this.transaction2Header = this.secondInputParams.transaction2Header;
    }
  }

  protected setSectionList() {
    this.items = this.stateService.getSectionNames(this.isMaster, this.stateType);
    const tempItems = [];
    this.items.forEach(item => {
      if (this.productService.getSetSectionListConditionToPushItem(item)) {
        tempItems.push(item);
      }
    });
    this.items = tempItems;
    this.commonService.sectionItemList.next(this.items);
  }

  protected handleLeftSectionData() {
    this.stepperParams = { isLinear: false, items: this.items, isEditable: true, reEvaluate: this.stepperReEval };
    if (this.mode !== 'view') {
      this.componentType = this.items[0];
    }
    if (this.taskId) {
      // when redirected from task monitoring, set task data for displaying tasks pane
      this.taskInputParams = {
        task: { taskId: this.taskId }
      };
      this.selectedType = FccGlobalConstant.TASKS;
      this.tasks = true;
    } else {
      this.sections = true;
      this.selectedType = 'Sections';
    }
    this.translateService.get('corporatechannels').subscribe(() => {
      this.types = [
        { label: `${this.translateService.instant('sections')}`, value: 'Sections' },
      ];
      if (this.hasTaskPermission && this.option !== FccGlobalConstant.TEMPLATE &&
         this.isTaskEnabled(this.subProductCode, this.option)) {
        this.types.push({ label: `${this.translateService.instant('tasks')}`, value: 'Tasks' });
      }
      if (this.types.length <= FccGlobalConstant.LENGTH_1) { this.removeCursorPointer = true; }
    });
    this.fileList.resetBankList();
    this.fileList.resetList();
    this.fileList.resetDocumentList();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.leftSectionEnabled = response.showStepper === 'true';
        this.activatedRoute.queryParams.subscribe((data) => {
          const category = [FccConstants.FCM];
          if(category.indexOf(data.category) > -1){
            this.leftSectionEnabled = false;
            this.commonService.isStepperDisabled = true;
          }
        });
        if (this.leftSectionEnabled) {
          this.leftSectionService.progressBarMapping(this.items);
          this.commonService.isStepperDisabled = false;
          this.leftSectionService.progressBarData.subscribe(
            data => {
              this.value = data;
            }
          );
        }
      }
    });
  }

  isTaskEnabled(subproduct, option) {
   if (subproduct === FccGlobalConstant.SE_SUB_PRODUCT_CODE ||
    subproduct === FccGlobalConstant.SE_STOPCHEQUE_SUB_PRODUCT_CODE ||
    option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC ||
    subproduct === FccGlobalConstant.SUB_PRODUCT_CTCHP ||
    subproduct === FccGlobalConstant.SUB_PRODUCT_SEEML) {
      return false;
    }
   return true;
  }

  protected populateStateWithTransactionDetails(passedTnxId?: any, secondTnxPassed = false, isMaster = false): Promise<boolean> {
    if (isMaster) {
      // section forms are initialised with related controls
      this.stateService.populateAllEmptySectionsInState(this.productCode);
      this.stateService.populateAllEmptySectionsInState(this.productCode, true);
    } else {
      // section forms are initialised with related controls
      // For amend draft scenario statetype need not be passed in transactiondetails population
      // const stateType =  EnumMapping.stateTypeEnum.AMENDSTATE ? FccGlobalConstant.EMPTY_STRING : this.stateType;
      const stateType = this.stateType;
      this.stateService.populateAllEmptySectionsInState(this.productCode, undefined, stateType);
      this.tabservice.initializeTabPanelService(this.stateService.getProductModel());
    }
    if (this.option === 'EXISTING' && (this.tnxType === FccGlobalConstant.N002_AMEND || this.tnxType === FccGlobalConstant.N002_INQUIRE)
         && this.commonService.isNonEmptyValue(this.accountId)) {
      return new Promise((resolver) => {
        // API call
        this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(apiMappingModel => {
          this.dashboardService.getAccountDetails(this.accountId).subscribe(response => {
              const responseObj = response;
              responseObj.entityName = this.entityAbbvName;
              this.isStateReloadNeeded = true;
              if (isMaster) {
                this.setState(responseObj, apiMappingModel, true);
              } else {
                this.setState(responseObj, apiMappingModel, false, null, null, null, null, secondTnxPassed);
              }
              resolver(true);
            },
              () => {
                resolver(false);
                this.commonService.redirectPage();
              });
        });
      });
    }
    else{
    return new Promise((resolver) => {
      // API call
      this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(apiMappingModel => {
        this.transactionDetailService.fetchTransactionDetails(this.templateId ? this.templateId :
          (passedTnxId ? passedTnxId : this.tnxId), this.productCode,
          this.templateId ? true : false, this.subProductCode).subscribe(response => {
            const responseObj = response.body;
            let secondcheckflag = true;
            this.commonService.tnxRefID = responseObj.ref_id;
            this.commonService.tnxResponse1 = responseObj.tnx_id;
            if (this.commonService.tnxRefID === responseObj.ref_id && (this.commonService.tnxResponse2 === undefined ||
              (this.commonService.tnxResponse2 === this.commonService.tnxResponse1))){
              this.commonService.tnxResponse2 = responseObj.tnx_id;
            } else {
              secondcheckflag = false;
              this.secondtnxpdf = responseObj;
            }
            // 2. storing the previous tnx details in this.common.tnxResponse1 and current tnx details in tnxResponse2.
            //  Using these responses to set state
            this.commonService.etagVersionChange.next(responseObj.version);
            if (responseObj.return_comments && responseObj.return_comments.text
              && responseObj.tnx_stat_code === FccGlobalConstant.N004_INCOMPLETE
              && responseObj.sub_tnx_stat_code === FccGlobalConstant.N015_RETURNED) {
              this.reviewComments = responseObj.return_comments.text.replace(/\n/g, '<br>');
            } else if (responseObj.return_comments
              && responseObj.tnx_stat_code === FccGlobalConstant.N004_INCOMPLETE
              && responseObj.sub_tnx_stat_code === FccGlobalConstant.N015_RETURNED) {
              this.reviewComments = responseObj.return_comments.replace(/\n/g, '<br>');
            }
            if (responseObj.parent_details) {
              if (responseObj.cross_references && responseObj.cross_references.cross_reference &&
                responseObj.cross_references.cross_reference.tnx_id && this.actionReqCode) {
                  this.parentTnxId = responseObj.cross_references.cross_reference.tnx_id;
              } else if (responseObj.parent_details && responseObj.parent_details.ref_id) {
                this.commonService.setParentReference(responseObj.parent_details.ref_id);
                this.commonService.setParentTnxInformation(responseObj.parent_details);
              }
            }
            if (responseObj.child_details) {
              if (responseObj.cross_references && responseObj.cross_references.cross_reference &&
                responseObj.cross_references.cross_reference.child_tnx_id && this.actionReqCode) {
                this.childTnxId = responseObj.cross_references.cross_reference.child_tnx_id;
              } else if (responseObj.child_details && responseObj.child_details.ref_id) {
                this.commonService.setChildReference(responseObj.child_details.ref_id);
                this.commonService.setChildTnxInformation(responseObj.child_details);
              }
            }
            if (responseObj && responseObj.free_format_text && responseObj.free_format_text.text && this.tnxType &&
              this.tnxType === FccGlobalConstant.N002_MESSAGE && this.mode !== FccGlobalConstant.VIEW_MODE &&
              this.mode !== FccGlobalConstant.DRAFT_OPTION) {
              responseObj.free_format_text.text = FccGlobalConstant.EMPTY_STRING;
            }
            if (typeof responseObj['documents'] !== 'undefined') {
              const documentObjectKeys = Object.keys(responseObj.documents);
              let document = [];
              if (typeof responseObj.documents.document['length'] !== 'undefined') {
                document = responseObj.documents.document;
              }
              else {
                for (let i = 0; i < documentObjectKeys.length; i++) {
                  document.push(responseObj.documents[documentObjectKeys[i]]);
                }
              }
              sessionStorage.setItem('ecDocumentDetails', JSON.stringify(document));
            }
            if (isMaster) {
              this.setState(responseObj, apiMappingModel, true);
            } else {
              this.setState(responseObj, apiMappingModel, false, null, null, null, null, secondTnxPassed, secondcheckflag);
            }
            resolver(true);
          },
            () => {
              resolver(false);
              this.commonService.redirectPage();
            });
      });
    });
  }
}

  protected populateStateWithMasterDetails(): Promise<boolean> {
    // section forms are initialised with related controls
    this.stateService.populateAllEmptySectionsInState(this.productCode);
    if (this.tnxType && this.tnxType === FccGlobalConstant.N002_AMEND && this.mode && this.operation &&
      this.mode === FccGlobalConstant.VIEW_MODE && (this.operation === FccGlobalConstant.LIST_INQUIRY ||
        this.operation === FccGlobalConstant.PREVIEW)) {
      this.stateService.populateAllEmptySectionsInState(this.productCode, true);
    } else {
      this.stateService.populateAllEmptySectionsInState(this.productCode, this.isMaster);
    }
    if(FccGlobalConstant.subProdCode_for_actionCode.indexOf(this.subProductCode)>-1){
      this.isRefId = true;
      this.issubprodapplicable = true;

    }
    // API call
    return new Promise((resolver) => {
      this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(apiMappingModel => {
        if(this.issubprodapplicable){
          this.transactionDetailService.fetchTransactionDetails(this.refId, this.productCode, false,
            this.subProductCode, this.isRefId).subscribe(response => {
            const responseObj = response.body;
            if (responseObj.parent_details) {
            if (responseObj.cross_references && responseObj.cross_references.cross_reference &&
              responseObj.cross_references.cross_reference.tnx_id && this.actionReqCode) {
              this.parentTnxId = responseObj.cross_references.cross_reference.tnx_id;
            } else if (responseObj.parent_details && responseObj.parent_details.ref_id) {
              this.commonService.setParentReference(responseObj.parent_details.ref_id);
              this.commonService.setParentTnxInformation(responseObj.parent_details);
            }
          }
          if (responseObj.child_details) {
            if (responseObj.cross_references && responseObj.cross_references.cross_reference &&
              responseObj.cross_references.cross_reference.child_tnx_id && this.actionReqCode) {
              this.childTnxId = responseObj.cross_references.cross_reference.child_tnx_id;
            } else if (responseObj.child_details && responseObj.child_details.ref_id) {
              this.commonService.setChildReference(responseObj.child_details.ref_id);
              this.commonService.setChildTnxInformation(responseObj.child_details);
            }
          }
            this.setState(responseObj, apiMappingModel, this.isMaster);
            resolver(true);
          },
            () => {
              resolver(false);
              this.commonService.redirectPage();
            });

        }else{
          this.transactionDetailService.fetchTransactionDetails(this.refId).subscribe(response => {
            const responseObj = response.body;
            if (responseObj.parent_details) {
            if (responseObj.cross_references && responseObj.cross_references.cross_reference &&
              responseObj.cross_references.cross_reference.tnx_id && this.actionReqCode) {
              this.parentTnxId = responseObj.cross_references.cross_reference.tnx_id;
            } else if (responseObj.parent_details && responseObj.parent_details.ref_id) {
              this.commonService.setParentReference(responseObj.parent_details.ref_id);
              this.commonService.setParentTnxInformation(responseObj.parent_details);
            }
          }
          if (responseObj.child_details) {
            if (responseObj.cross_references && responseObj.cross_references.cross_reference &&
              responseObj.cross_references.cross_reference.child_tnx_id && this.actionReqCode) {
              this.childTnxId = responseObj.cross_references.cross_reference.child_tnx_id;
            } else if (responseObj.child_details && responseObj.child_details.ref_id) {
              this.commonService.setChildReference(responseObj.child_details.ref_id);
              this.commonService.setChildTnxInformation(responseObj.child_details);
            }
          }
            this.setState(responseObj, apiMappingModel, this.isMaster);
            resolver(true);
          },
            () => {
              resolver(false);
              this.commonService.redirectPage();
            });
        }
      });
    });
  }

  private setDynamicSection(section) {
    this.populateDynamicSectionStateWithDetails(section);
  }
  private populateDynamicSectionStateWithDetails(section) {
    const value: FCCFormGroup = this.stateService.getSectionData(section, this.productCode);
    this.productMappingService.setStateFromMapModel(this.commonService.currentStateApiModel, section,
      value, this.commonService.currentStateTnxResponse, this.productCode, this.subProductCode, false);
  }

  public setState(responseObj: any, apiMappingModel: any, master = false, subTnxTypeCode?: any, isTemplateOrBackToBack?: any,
                  applicableFieldsToExclude?: any[], applicableSectionsToExclude?: any[], secondTnxPassed = false,
                  secondcheckflag: boolean = true) {
    // const stateType =  EnumMapping.stateTypeEnum.AMENDSTATE ? FccGlobalConstant.EMPTY_STRING : this.stateType;
    const stateType = this.stateType;
    if (responseObj ) {
      if (secondcheckflag || this.operation !== FccGlobalConstant.PREVIEW || !this.amendedValue){
      if (!master) {
        this.commonService.tnxResponse = responseObj;
      }
      // this.productMappingService.getApiModel(this.productCode).subscribe(apiMappingModel => {
      if (this.parent) {
        this.narrativeService.isMaster = master;
        master = true;
      }
      if (master) {
        this.stateService.getSectionNames(master, stateType).forEach(section => {
          // set Master State
          this.tabservice.initializeMaps(section, this.stateService.getSectionData(section, undefined, master, stateType));
          const masterSection = this.stateService.getSectionData(section, this.productCode, master, stateType);
          if (this.formAccordionPanelService.isFormAccordionPanel(undefined, section, masterSection)) {
            this.formAccordionPanelService.initializeFormAccordionMap(section, masterSection);
          }
          if (subTnxTypeCode && subTnxTypeCode === FccGlobalConstant.LC_BACK_TO_BACK) {
            this.productMappingService.setStateFromMapModel(apiMappingModel, section, masterSection, responseObj,
              this.productCode, this.subProductCode, master, subTnxTypeCode, undefined , undefined , this.isamendmentComparisonEnabled);
          } else {
            this.productMappingService.setStateFromMapModel(apiMappingModel, section, masterSection, responseObj,
              this.productCode, this.subProductCode, master, undefined, undefined, undefined, this.isamendmentComparisonEnabled);
          }
        });
      }
      if (this.loadState) {
        const isHavingSectionNamesToExclude = (applicableSectionsToExclude && applicableSectionsToExclude.length > 0);
        this.stateService.getSectionNames(false, stateType).forEach(section => {
          const isSectionNameInExcludingList =
                  ((isHavingSectionNamesToExclude === true) ? (applicableSectionsToExclude.indexOf(section) !== -1) : false);
          if ( !(isHavingSectionNamesToExclude && isSectionNameInExcludingList) ) {
            // set Transaction State
            this.tabservice.initializeMaps(section, this.stateService.getSectionData(section, undefined, false, stateType));
            let sectionForm;
            if (this.isLoadMasterPopup) {
              sectionForm = this.stateService.getSectionData(section, this.productCode, master, stateType);
            } else {
              sectionForm = this.stateService.getSectionData(section, this.productCode, false, stateType);
            }
            if (this.formAccordionPanelService.isFormAccordionPanel(undefined, section, sectionForm)) {
              this.formAccordionPanelService.initializeFormAccordionMap(section, sectionForm);
            }
            if (subTnxTypeCode && subTnxTypeCode === FccGlobalConstant.LC_BACK_TO_BACK) {
              this.productMappingService.setStateFromMapModel(apiMappingModel, section, sectionForm, responseObj, this.productCode,
                this.subProductCode, false, subTnxTypeCode);
            } else if (applicableFieldsToExclude && applicableFieldsToExclude .length > 0) {
              this.productMappingService.setStateFromMapModel(apiMappingModel, section, sectionForm, responseObj, this.productCode,
                this.subProductCode, false, subTnxTypeCode, applicableFieldsToExclude );
            } else {
              if (!this.isMasterView) {
                this.productMappingService.setStateFromMapModel(apiMappingModel, section, sectionForm, responseObj, this.productCode,
                this.subProductCode, false, undefined, undefined, stateType);
              }
            }
          }
        });
      }
    } else if (this.secondInputParams && (Object.keys(this.secondInputParams > 0)) && this.secondInputParams.previousTnxIdForAmend
    && this.secondInputParams.tnxIdForAmend && (this.secondInputParams.previousTnxIdForAmend !== this.secondInputParams.tnxIdForAmend)){
      this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(apiMappingModel => {
          master = true;
          this.stateService.getSectionNames(false, stateType).forEach(section => {
            this.tabservice.initializeMaps(section, this.stateService.getSectionData(section, undefined, master, stateType));
            const masterSection = this.stateService.getSectionData(section, this.productCode, master, stateType);
            if (this.formAccordionPanelService.isFormAccordionPanel(undefined, section, masterSection)) {
              this.formAccordionPanelService.initializeFormAccordionMap(section, masterSection);
            }
            if (subTnxTypeCode && subTnxTypeCode === FccGlobalConstant.LC_BACK_TO_BACK) {
              this.productMappingService.setStateFromMapModel(apiMappingModel, section, masterSection, responseObj,
                this.productCode, this.subProductCode, master, subTnxTypeCode, undefined , undefined , this.isamendmentComparisonEnabled);
            } else {
              this.productMappingService.setStateFromMapModel(apiMappingModel, section, masterSection, responseObj,
                this.productCode, this.subProductCode, master, undefined, undefined, undefined, this.isamendmentComparisonEnabled);
            }
            this.amendCommonService.setValueFromMasterToPrevious(section, this.productCode);
          });
          this.showSpinner = false;
        });
    }
    // 3. here we are setting both the states and them to amendCommonService where the previous values are set in the state
    // and everything else. Now we move to summary-details to render the previousValues to UI.
      this.commonService.currentStateApiModel = apiMappingModel;
      this.commonService.currentStateTnxResponse = responseObj;
      this.commonService.currentStateRefId = this.refId;
      if (!this.commonService.isViewPopup) {
        this.taskService.setTnxResponseObj(responseObj);
      }
      const onLoad = true;
      if (this.secondInputParams || this.isStateReloadNeeded) {
        this.updateAllSections(onLoad, master);
      } else {
        this.updateAllSections(onLoad);
      }
      if (this.mode !== 'view' && !isTemplateOrBackToBack) {
        if (this.commonService.isExistingLoan(this.productCode, this.subTnxType, this.mode)) {
          this.stepperReEval = false;
        } else {
          this.stepperReEval = onLoad; // recalculate progress and state for openDraft/copyFrom scenarios
        }
        this.handleLeftSectionData();
      }
      if ((this.secondInputParams && (Object.keys(this.secondInputParams).length > 0)) && secondTnxPassed) {
        this.checkAndAddAmendLabel();
      }

      if (this.inputParams !== undefined) {
        this.invokeComponent();
      }
      // });
      if (this.loadState &&
        this.productService.checkStateForErrorValidation(this.tnxType, this.option, this.mode, this.tnxId, this.parent, this.operation)) {
        this.stateService.getSectionNames(this.isMaster, this.stateType).forEach(section => {
          if (section !== FccGlobalConstant.SUMMARY_DETAILS) {
            const sectionData = this.stateService.getSectionData(section, this.productCode, false);
            if(sectionData.value["customerRef"] == null && typeof sectionData.value["customerRef"] != 'undefined'
            && typeof this.customerRef != 'undefined' &&
            this.customerRef != '-' && this.customerRef != ''){
              sectionData.controls.customerRef.setValue(this.customerRef);
            }
            this.loadTabsonInit(sectionData);
            this.setErrors(sectionData, section);
          }
        });
      }
    }
  }

  setBeneficiaryState(response, apiMappingModel) {
    if (response) {
      this.commonService.currentStateApiModel = apiMappingModel;
      this.commonService.beneGroupId = this.beneGroupId;
      const productType = response[FccConstants.PRODUCT_TYPE];
      this.stateService.getSectionNames().forEach(section => {
        const sectionForm = this.stateService.getSectionData(section);
        this.productMappingService.setBeneficiaryStateFromMapModel(apiMappingModel, section, sectionForm, response, productType);
      });
      const onLoad = true;
      this.updateAllSections(onLoad);
    }
  }

  invokeComponent() {
    if (this.container !== undefined) {
      this.container.eventRequired = true;
      this.container.type = 'summaryDetails';
      this.container.ngOnInit();
    }
  }

  checkAndAddAmendLabel() {
    this.stateService.getSectionNames(true).forEach(section => {
      this.tabservice.initializeMaps(section, this.stateService.getSectionData(section, undefined, true));
      const tabSectionMasterControlMap = this.tabservice.getTabSectionControlMap();
      const tabSectionMasterControlMap1 = tabSectionMasterControlMap.get(section);
      this.tabservice.initializeMaps(section, this.stateService.getSectionData(section, undefined, false));
      const tabSectionControlMap = this.tabservice.getTabSectionControlMap();
      if (tabSectionControlMap.has(section)) {
        for (const [fieldName, control] of tabSectionControlMap.get(section)) {
          let masterControl;
          if (tabSectionMasterControlMap1)
          {
            masterControl = tabSectionMasterControlMap1.get(fieldName);
          }
          let comparisonValue = '';
          if (masterControl)
          {
            comparisonValue = this.stateService.getNonLocalizedTabValue(masterControl, true);
          }
          this.amendCommonService.
          compareMasterAndTransactionForTabSection(masterControl, control, comparisonValue, tabSectionControlMap.get(section), true);
        }
      }
      else
      {
        Object.keys(this.stateService.getSectionData(section, undefined, true).controls).forEach(field => {
          const masterFieldControl = this.stateService.getControl(section, field, true);
          const transactionFieldControl = this.stateService.getControl(section, field, false);
          if (masterFieldControl instanceof FCCFormGroup && transactionFieldControl instanceof FCCFormGroup) {
            Object.keys(masterFieldControl.controls).forEach(element => {
              this.updateTabSectionForAmend(masterFieldControl, transactionFieldControl, element);
            });
          } else if (masterFieldControl && transactionFieldControl) {
            const transactionForm: FCCFormGroup = this.stateService.getSectionData(section, undefined, false);
            const comparisonValue = this.stateService.getNonLocalizedValue(section, field, true);
            this.amendCommonService.compareMasterAndTransaction(masterFieldControl, transactionFieldControl,
              comparisonValue, transactionForm, true);
          }
        });
      }
    });
    // Reverse the comparison and check again
    this.stateService.getSectionNames(false).forEach(section => {
      if (section !== FccGlobalConstant.eventDetails && section !== FccGlobalConstant.RELEASE_INSTRUCTION_SECTION)
      {
      this.tabservice.initializeMaps(section, this.stateService.getSectionData(section, undefined, false));
      const tabSectionMasterControlMap = this.tabservice.getTabSectionControlMap();
      const tabSectionMasterControlMap1 = tabSectionMasterControlMap.get(section);
      this.tabservice.initializeMaps(section, this.stateService.getSectionData(section, undefined, true));
      const tabSectionControlMap = this.tabservice.getTabSectionControlMap();
      if (tabSectionControlMap.has(section)) {
        for (const [fieldName, control] of tabSectionControlMap.get(section)) {
          let masterControl;
          if (tabSectionMasterControlMap1)
          {
            masterControl = tabSectionMasterControlMap1.get(fieldName);
          }
          let comparisonValue = '';
          if (masterControl)
          {
            comparisonValue = this.stateService.getNonLocalizedTabValue(masterControl, true);
          }
          this.amendCommonService.
          compareMasterAndTransactionForTabSection(masterControl, control, comparisonValue, tabSectionControlMap.get(section), true);
        }
      }
      else
      {
        Object.keys(this.stateService.getSectionData(section, undefined, false).controls).forEach(field => {
          const masterFieldControl = this.stateService.getControl(section, field, false);
          const transactionFieldControl = this.stateService.getControl(section, field, true);
          if (masterFieldControl instanceof FCCFormGroup && transactionFieldControl instanceof FCCFormGroup) {
            Object.keys(masterFieldControl.controls).forEach(element => {
              this.updateTabSectionForAmend(masterFieldControl, transactionFieldControl, element);
            });
          } else if (masterFieldControl && transactionFieldControl) {
            const transactionForm: FCCFormGroup = this.stateService.getSectionData(section, undefined, true);
            const comparisonValue = this.stateService.getNonLocalizedValue(section, field, false);
            this.amendCommonService.compareMasterAndTransaction(masterFieldControl, transactionFieldControl,
              comparisonValue, transactionForm, true);
          }
        });
      }
    } });
    this.showSpinner = false;
    if (this.container !== undefined) {
      this.container.eventRequired = false;
      this.container.type = 'summaryDetails';
      this.container.ngOnInit();
    }
    if (this.container1 !== undefined) {
      this.container1.eventRequired = false;
      this.container1.type = 'summaryDetails';
      this.container1.ngOnInit();
    }

    if (this.container3 !== undefined) {
      this.container3.ngOnInit();
    }
  }

  updateTabSectionForAmend(masterFieldControl, transactionFieldControl, element) {
    const masterControl = masterFieldControl.controls[element];
    const transactionControl = transactionFieldControl.controls[element];
    const comparisonValue = this.stateService.getNonLocalizedTabValue(masterControl, false);
    // const value = this.stateService.getTabValue(masterControl, false);
    try {
      // temporary check for IU, will remove once summary is complete
      if (this.productCode === FccGlobalConstant.PRODUCT_BG && element !== 'bgAmt' && element !== 'bgCurCode') {
        this.amendCommonService.compareMasterAndTransaction(masterControl, transactionControl,
          comparisonValue, masterFieldControl, true);
      }
    } catch (error) {
      // The field control may not be present, do nothing and carry execution
    }
  }

  updateIndexEvent(event: StepperSelectionEvent) {
    this.saveData();
    this.storeIndexValue = event.selectedIndex;
    this.updateAllSections();
  }

  private updateAmount(requestObj: any) {
    for (const val in requestObj) {
      if (this.productCode && ((this.productCode !== FccGlobalConstant.PRODUCT_TF && (val.indexOf('_amt') > -1)) ||
        (this.productCode === FccGlobalConstant.PRODUCT_TF && (val.indexOf('_amt') === (val.length - ('_amt').length))))) {
        requestObj[val] = this.commonService.replaceCurrency(requestObj[val].toString());
      } else if (this.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC && ((val.indexOf('amt') > -1)
      || (val.indexOf('Amount') > -1))) {
        requestObj[val] = this.commonService.replaceCurrency(requestObj[val].toString());
      }
    }
  }

  // set taskentity when save is initiated from task dialog
  private updateEntity(requestObj: any) {
    const curEntity = this.taskService.getTaskEntity() !== undefined ? this.taskService.getTaskEntity().shortName : '';
    if (this.productCode || (this.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC)) {
      for (const val in requestObj) {
        if (val.indexOf('entity') > -1 && requestObj[val] === '' && !this.referenceId && curEntity) {
          requestObj[val] = curEntity;
          break;
        }
      }
    }
  }

  protected updateAllSections(onLoad = false, master = false, field = '') {
    if (this.items[this.storeIndexValue] !== 'summaryDetails' && this.items[this.storeIndexValue] !== 'lineBreakForMaster') {
      this.items.forEach(section => {
        // will be removing this product code check once the SR, IC and EL scenario is handled
        if (this.isMessageDraftReloadNeeded || this.isStateReloadNeeded || !onLoad ||
          ((this.operation === 'LIST_INQUIRY' || (this.operation === 'PREVIEW' && !this.amendedValue)) &&
            (this.productCode === FccGlobalConstant.PRODUCT_LC || this.productCode === FccGlobalConstant.PRODUCT_SI ||
              this.productCode === FccGlobalConstant.PRODUCT_BG || this.productCode === FccGlobalConstant.PRODUCT_BR ||
              this.productCode === FccGlobalConstant.PRODUCT_LN || this.productCode === FccGlobalConstant.PRODUCT_EC ||
              this.productCode === FccGlobalConstant.PRODUCT_FT || this.productCode === FccGlobalConstant.PRODUCT_LI ||
              this.productCode === FccGlobalConstant.PRODUCT_BK ||
              this.productCode === FccGlobalConstant.PRODUCT_SG ||
              this.productCode === FccGlobalConstant.PRODUCT_TD ||
              (this.productCode === FccGlobalConstant.PRODUCT_TF &&
                section === FccGlobalConstant.TF_APPLICANT_BANK_DETAILS_SECTION)))) {
          this.updateSectionOnChange(section, master, field);
          if (this.isStateReloadNeeded) {
            this.isStateReloadNeeded = false;
          } else if (this.isMessageDraftReloadNeeded) {
            this.isMessageDraftReloadNeeded = false;
          }
        } else if (onLoad) {
          this.updateSectionOnLoad(section);
        }
      });
      this.productService.setCurrentSectionData(this.items[this.storeIndexValue]);
    } else if (this.items[this.storeIndexValue] === 'summaryDetails') {
      this.loadSection(this.storeIndexValue);
      this.productService.setCurrentSectionData(FccGlobalConstant.SUMMARY_DETAILS);
    }
    this.onlineHelp();
    const saveButton = document.getElementById('saveButton');
    if(this.container && this.container.type === 'summaryDetails' && this.commonService.isNonEmptyValue(saveButton)) {
      saveButton.hidden = true;
    }
  }

  protected updateSectionOnLoad(section: string) {
    const queryResults = '_results';
    // const stateType =  EnumMapping.stateTypeEnum.AMENDSTATE ? FccGlobalConstant.EMPTY_STRING : this.stateType;
    const stateType = this.stateType;
    const sectionList = this.stateService.getSectionNames(this.isMaster, stateType);
    if (this.productService.getConditionForUpdateSectionOnLoad(section, sectionList, this.storeIndexValue)) {
      // this.stateService.setStateSection(section, this.container.state.form);
      this.hiddenContainer.changes.subscribe((element) => {
        element[queryResults][0].type = section;
        element[queryResults][0].ngOnInit();
        element[queryResults][0].state.ngOnInit();
        // this.leftSectionService.reEvaluateProgressBar.next(true);
        if (section ===
          this.stateService.getSectionNames(this.isMaster, stateType)[
            this.stateService.getSectionNames(this.isMaster, stateType).length - 1
          ]) {
          this.loadSection(this.storeIndexValue);
        }
      });
    }
  }
  protected updateSectionOnChange(section: string, master = false, field = '') {
    const queryResults = '_results';
    if (this.productService.getConditionForUpdateSectionOnChange(section, this.items, this.storeIndexValue)) {
      this.hiddenContainer[queryResults][0].type = section;
      this.hiddenContainer[queryResults][0].isMasterRequired = master;
      this.hiddenContainer[queryResults][0].ngOnInit();
      if (this.commonService.isnonEMptyString(field)) {
        const sectionName = field.split('_')[0];
        const fieldName = field.split('_')[1];
        const form = this.stateService.getSectionData(sectionName);
        const error = { businessCutOffError: true };
        form.get(fieldName)?.setErrors(error);
        form.get(fieldName)?.markAsTouched();
        this.stateService.setStateSection(sectionName, form);
        this.hiddenContainer[queryResults][0].state.ngOnInit();
      } else {
        this.hiddenContainer[queryResults][0].state.ngOnInit();
      }
     if (section === this.items[this.items.length - 1]
        && this.operation !== 'LIST_INQUIRY') {
        this.loadSection(this.storeIndexValue);
      }
    }
  }

  protected updateSummaryOnChange(master = false) {
    const queryResults = '_results';
    const section = FccGlobalConstant.SUMMARY_DETAILS;
    this.hiddenContainer[queryResults][0].type = section;
    this.hiddenContainer[queryResults][0].isMasterRequired = master;
    this.hiddenContainer[queryResults][0].ngOnInit();
    this.hiddenContainer[queryResults][0].state.ngOnInit();
  }

  saveData() {
    if (this.container !== undefined && this.container.type !== 'summaryDetails' && this.container.state.beforeSaveValidation()) {
      this.productService.OnSaveFormValidation(this.container.state, this.container.type);
      this.setErrors(this.container.state.form, this.container.type);
      this.stateService.setStateSection(this.items[this.storeIndexValue], this.container.state.form);
      if ((!this.referenceId && this.option !== FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC)
      || (this.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC &&
        this.commonService.isEmptyValue(this.beneGroupId))) {
        this.saveNewTransaction();
      } else {
        this.commonService.putQueryParameters(FccGlobalConstant.tnxId, this.eventId);
        if (this.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC) {
          this.updateBeneAccountDetails();
        } else {
          this.updateTransaction();
        }
      }
      this.commonService.referenceId = this.referenceId;
      this.commonService.eventId = this.eventId;
    }
  }

  setErrors(form: FCCFormGroup, section) {
    if (form && form.controls) {
      Object.keys(form.controls).forEach(controls => {
        this.tabservice.initializeMaps(section, this.stateService.getSectionData(section, undefined, false));
        const tabSectionControlMap = this.tabservice.getTabSectionControlMap();
        if (tabSectionControlMap.has(section)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for (const [fieldName, control] of tabSectionControlMap.get(section)) {
            this.checkMandatoryEmptyFields(control);
            if (control[FccGlobalConstant.ERRORS] !== null && control[FccGlobalConstant.ERRORS] !== undefined) {
              control.markAsDirty();
              control.markAsTouched();
            }
          }
        } else {
          this.checkMandatoryEmptyFields(form[FccGlobalConstant.CONTROLS][controls]);
          if (form[FccGlobalConstant.CONTROLS][controls][FccGlobalConstant.ERRORS] !== null &&
            form[FccGlobalConstant.CONTROLS][controls][FccGlobalConstant.ERRORS] !== undefined) {
            form[FccGlobalConstant.CONTROLS][controls].markAsDirty();
            form[FccGlobalConstant.CONTROLS][controls].markAsTouched();
          }
        }
      });
    }
  }

  protected checkMandatoryEmptyFields(control: FCCFormControl) {
    if ((control.type === 'input-text' || control.type === 'narrative-textarea') && control[FccGlobalConstant.PARAMS]
      && control[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] &&
      control[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] === true && this.commonService.isNonEmptyValue(control.value)
      && (typeof control.value !== FccGlobalConstant.NUMBER) && control.value.trim().length === 0) {
      control.setErrors({ required: true });
    }
  }

  protected executePendingSave() {
    if (this.pendingRequest)
    {
      this.pendingRequest = false;
      this.updateTransaction();
    }
  }




  protected updateTransaction() {
    if (!this.submitClicked)
    {
    this.savedTimeTextShow.next(false);
    this.saveUrlStatus.next(this.translateService.instant('saving'));
    this.spinnerShow.next(true);
    if (this.isSaveAllowed)
    {
      this.isSaveAllowed = false;
      this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(model => {
      const requestObj = this.buildRequestObject(model, FccGlobalConstant.SAVE);
      this.commonService.persistFormDetails(requestObj).subscribe(res => {
          if (res.status === FccGlobalConstant.LENGTH_200) {
            this.commonService.addedResponse(res);
            const responseObj = res.body;
            this.commonService.etagVersionChange.next(responseObj.version);
            if (responseObj.cross_references && responseObj.cross_references.cross_reference &&
              responseObj.cross_references.cross_reference.tnx_id && this.actionReqCode) {
              this.parentTnxId = responseObj.cross_references.cross_reference.tnx_id;
            } else if (responseObj.parent_details && responseObj.parent_details.ref_id) {
              this.commonService.setParentReference(responseObj.parent_details.ref_id);
              this.commonService.setParentTnxInformation(responseObj.parent_details);
            }
            this.setSaveStatus();
            this.count = 1;
            if (this.intervalId2) {
              clearInterval(this.intervalId2);
            }
            this.intervalId2 = setInterval(() => {
              if (this.intervalId1) {
                clearInterval(this.intervalId1);
              }
              this.savedTimeText.next(this.translateService.instant('saved') + this.count +
              this.count === 1 ? this.translateService.instant('minuteAgo') : this.translateService.instant('minutesAgo'));
              this.count = this.count + 1;
            }, this.timerCode);
            this.commonService.referenceId = this.referenceId;
            this.commonService.eventId = this.eventId;
            this.taskService.setTnxResponseObj(res.body);
            this.updateAllSections();
          } else {
            this.initializeSaveStatus();
            this.issavecompleted.next(true);
            this.commonService.showError(true);
          }
          this.isSaveAllowed = true;
           //executependingrequest
          this.executePendingSave();
          }, error => {
            this.isSaveAllowed = true;
            this.executePendingSave();
            this.initializeSaveStatus();
            this.issavecompleted.next(true);
            this.commonService.showError(true);
            if (error.error.titleKey === FccGlobalConstant.VERSION_MIS_MATCH)
            {
              const responseObj = {
                error: JSON.stringify(error.error)
              };
              this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(responseObj) } });
            }
          });
      }, () => {
        this.isSaveAllowed = true;
        this.executePendingSave();
    });
    } else {
      this.pendingRequest = true;
     }
   }
  }

  protected updateBeneAccountDetails() {
    this.savedTimeTextShow.next(false);
    this.saveUrlStatus.next(this.translateService.instant('saving'));
    this.spinnerShow.next(true);
    this.productMappingService.getApiModel(undefined, undefined, undefined, undefined, undefined,
      this.option).subscribe(apiMappingModel => {
        const requestObj = this.buildSystemFeatureRequestObject(apiMappingModel, FccConstants.SYSTEM_FEATURE_SAVE);
        this.commonService.updatePaymentBeneficiaryDetails(requestObj, this.beneGroupId).subscribe(response => {
          if (response) {
            this.commonService.addedResponse(response);
            if (response.groupId) {
              this.beneGroupId = response.groupId;
              this.beneAccountIDResponse = response.accountDetails;
              this.commonService.beneGroupId = this.beneGroupId;
            }
            this.setSaveStatus();
            this.count = 1;
            if (this.intervalId2) {
              clearInterval(this.intervalId2);
            }
            this.intervalId2 = setInterval(() => {
              if (this.intervalId1) {
                clearInterval(this.intervalId1);
              }
              this.savedTimeText.next(this.translateService.instant('saved') + this.count + this.translateService.instant('minuteAgo'));
              this.count = this.count + 1;
            }, this.timerCode);
          } else {
            this.initializeSaveStatus();
            this.issavecompleted.next(true);
            this.commonService.showError(true);
          }
        }, error => {
          this.initializeSaveStatus();
          this.issavecompleted.next(true);
          this.commonService.showError(true);
          if (error.error.titleKey === FccGlobalConstant.VERSION_MIS_MATCH)
          {
            const responseObj = {
              error: JSON.stringify(error.error)
            };
            this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(responseObj) } });
          }
        });
      });
    }

  checkTDProductScreen() {
    let isvalid = false;
    if (this.productCode === FccGlobalConstant.PRODUCT_TD && ((this.tnxType === FccGlobalConstant.N002_AMEND ||
      this.tnxType === FccGlobalConstant.N002_INQUIRE))) {
      isvalid = true;
    }
    return isvalid;
  }



  protected saveNewTransaction() {
    this.spinnerShow.next(true);
    this.saveUrlStatus.next(this.translateService.instant('saving'));
    if (this.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC) {
      this.beneAccountIDResponse = null;
      this.productMappingService.getApiModel(undefined, undefined, undefined, undefined, undefined,
        this.option).subscribe(apiMappingModel => {
        const requestObj = this.buildSystemFeatureRequestObject(apiMappingModel, FccConstants.SYSTEM_FEATURE_SAVE);
        this.commonService.savePaymentBeneficiaryDetails(requestObj).subscribe(response => {
          if (response.status === FccGlobalConstant.LENGTH_200) {
            this.commonService.addedResponse(response);
            if (response && response.body && response.body.groupId) {
              this.beneGroupId = response.body.groupId;
              this.beneAccountIDResponse = response.body.accountDetails;
              this.commonService.beneGroupId = this.beneGroupId;
            }
            this.setSaveStatus();
            this.count = 1;
            this.intervalId1 = this.initializeInterval();
            this.setSystemID = true;
            this.channelRefID = this.beneGroupId;
            if (!this.productComponentDestroy) {
              this.commonService.beneGroupId = this.beneGroupId;
            }
          } else {
            this.initializeSaveStatus();
            this.issavecompleted.next(true);
            this.commonService.showError(true);
          }
        }, error => {
          this.initializeSaveStatus();
          this.issavecompleted.next(true);
          this.commonService.showError(true);
          if (error.error.titleKey === FccGlobalConstant.VERSION_MIS_MATCH) {
              const responseObj = {
                error: JSON.stringify(error.error)
              };
              this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(responseObj) } });
            }
        });
      });
    } else {
      this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(mappingModel => {
        const requestObj = this.buildRequestObject(mappingModel, FccGlobalConstant.SAVE);
        if ((this.tnxType === FccGlobalConstant.N002_NEW &&
          (!this.isEntityUser || (this.isEntityUser && this.hasEntityValue(requestObj[`transaction`]))))
          || this.tnxType !== FccGlobalConstant.N002_NEW) {
        if (this.isSaveAllowed)
      {
      this.isSaveAllowed = false;
      this.spinnerShow.next(true);
      this.saveUrlStatus.next(this.translateService.instant('saving'));
      this.commonService.persistFormDetails(requestObj).subscribe(res => {
          if (res.status === FccGlobalConstant.LENGTH_200) {
            this.commonService.addedResponse(res);
            this.referenceId = res.body.ref_id;
            this.applDate = res.body.appl_date;
            this.commonService.etagVersionChange.next(res.body.version);
            const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
            if ((this.tnxType === FccGlobalConstant.N002_NEW && mode && mode === FccGlobalConstant.INITIATE) ||
             this.checkTDProductScreen()) {
              this.channelRefID = this.referenceId;
              this.commonService.channelRefNo.next(this.channelRefID);
              this.commonService.applDateService.next(this.applDate);
              this.setSystemID = true;
            }
            this.eventId = res.body.eventId !== undefined ? res.body.eventId : res.body.tnx_id;
            this.commonService.isnewEventSaved = true;
            this.commonService.putQueryParameters(FccGlobalConstant.tnxId, this.eventId);
            this.setSaveStatus();
            this.count = 1;
            this.intervalId1 = this.initializeInterval();
            if (!this.productComponentDestroy) {
                this.commonService.referenceId = this.referenceId;
              }
            this.commonService.eventId = this.eventId;
            this.taskService.setTnxResponseObj(res.body);
              // to trigger create task after saving a new transaction.
            this.taskService.notifyTaskAfterSaveTnx$.next(true);
            if (this.productCode === FccGlobalConstant.PRODUCT_LC && this.option === FccGlobalConstant.TEMPLATE) {
                this.form = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS);
                this.form.get('templateName')[this.params][this.readonly] = true;
              }
            } else {
              this.initializeSaveStatus();
              this.issavecompleted.next(true);
              this.commonService.showError(true);
            }
          this.isSaveAllowed = true;
          this.executePendingSave();
          }, error => {
        this.isSaveAllowed = true;
        this.executePendingSave();
        this.initializeSaveStatus();
        this.issavecompleted.next(true);
        this.commonService.showError(true);
        if (error.error.titleKey === FccGlobalConstant.VERSION_MIS_MATCH) {
            const responseObj = {
              error: JSON.stringify(error.error)
            };
            this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(responseObj) } });
          }
        });
    }}}, () => {
      this.isSaveAllowed = true;
      this.executePendingSave();
        });
    }
  }

  protected setSaveStatus() {
    this.saveUrlStatus.next(this.translateService.instant('save'));
    this.spinnerShow.next(false);
    this.savedTimeTextShow.next(true);
    this.issavecompleted.next(true);
    this.savedTimeText.next(this.savedJustNow);
  }

  hasEntityValue(requestObj: any) {
    let hasValue = false;
    for (const val in requestObj) {
       if (val.indexOf('entity') > -1 && requestObj[val] !== ''){
         hasValue = true;
         break;
       }
    }
    return hasValue;
  }

  onClickNext() {
    this.saveData();
    ++this.storeIndexValue;
    if (this.leftSectionEnabled) {
      this.autoFocusDivisonOnNextOrPrevious('next');
      this.leftSectionService.isButtonAction.next(true);
      this.leftSectionService.highlightMenuSection.next(this.storeIndexValue);
      this.setFileDetailsSectionFlag();

    }
    this.updateAllSections();
  }

  autoFocusDivisonOnNextOrPrevious(id: string) {
    const button = document.getElementById(id);
    button.blur();

    const domField = document.getElementById('autoFocusDiv');
    domField.focus();

    const comp1 = document.getElementById('autoFocusComp1');
    comp1.focus();

    const comp2 = document.getElementById('autoFocusComp2');
    comp2.focus();
  }

  protected loadSection(index: number) {
    if (index === this.items.length) {
      this.container.type = FccGlobalConstant.SUMMARY_DETAILS;
    } else if (this.items[index]) {
      this.container.type = this.items[index];
    }
    // Check if all sections are valid
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.isParentFormValid = this.stateService.isParentStateValid();
      this.commonService.parentFormValidCheck.next(this.isParentFormValid);
    }
    else {
      this.isParentFormValid = this.stateService.isParentStateValid() && this.isSectionSet();
      this.commonService.parentFormValidCheck.next(this.isParentFormValid);

    }
    if (this.isParentFormValid && this.tnxType === FccGlobalConstant.N002_AMEND && this.container &&
      this.container.type === 'summaryDetails' &&
      this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
      && this.subTnxType !== FccGlobalConstant.N003_INCREASE
      && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN && this.productCode !== FccGlobalConstant.PRODUCT_TD) {
      this.isParentFormValid = this.checkFormAmended();
      this.commonService.parentFormValidCheck.next(this.isParentFormValid);
    }

    if(this.componentType == FccGlobalConstant.BATCH_GENERAL_DETAILS && this.container.type == FccGlobalConstant.SUMMARY_DETAILS
      && this.paymentBatchBalanceValidation){
      this.isParentFormValid = false;
      this.commonService.parentFormValidCheck.next(this.isParentFormValid);
    }

    if(this.componentType == FccConstants.FCM_BENEFICIARY_GENERAL_DETAILS && this.container.type == FccGlobalConstant.SUMMARY_DETAILS
      && this.beneficiaryDefaultAccountValidation){
      this.isParentFormValid = false;
      this.commonService.parentFormValidCheck.next(this.isParentFormValid);
    }

    if (this.container.type !== FccGlobalConstant.SUMMARY_DETAILS) {
      const sectionDataForError = this.stateService.getSectionData(this.container.type, this.productCode, false);
      this.loadTabsonInit(sectionDataForError);
      this.setFocusOnError(sectionDataForError, this.container.type);
    }
    this.container.ngOnInit();
    this.leftSectionService.reEvaluateProgressBar.next(true);
  }

  setFocusOnError(form: FCCFormGroup, section) {
    let flag = false;
    if (form && form.controls) {
      Object.keys(form.controls).forEach(controls => {
        this.tabservice.initializeMaps(section, this.stateService.getSectionData(section, undefined, false));
        const tabSectionControlMap = this.tabservice.getTabSectionControlMap();
        if (tabSectionControlMap.has(section)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for (const [fieldName, control] of tabSectionControlMap.get(section)){
            if (control[FccGlobalConstant.ERRORS] !== null && control[FccGlobalConstant.ERRORS] !== undefined) {
              if (flag === false) {
                this.focus(control.key);
                flag = true;
                break;
              }
            }
          }
        } else {
          if (form[FccGlobalConstant.CONTROLS][controls][FccGlobalConstant.ERRORS] !== null &&
            form[FccGlobalConstant.CONTROLS][controls][FccGlobalConstant.ERRORS] !== undefined) {
            if (flag === false) {
              this.focus(form[FccGlobalConstant.CONTROLS][controls][FccGlobalConstant.KEY]);
              flag = true;
            }
          }
        }
      });
    }
  }

  /*
   * Check if the sections are being set using states service
    If all sections are ticked and valid will return true
  */
  private isSectionSet(): boolean {
    let isSectionSet = true;
    this.items.forEach((step) => {
      if (step !== 'summaryDetails' && !this.stateService.isStateSectionSet(step)) {
        isSectionSet = false;
      }
    });
    return isSectionSet;
  }

  checkFormAmended() {
    let isAmended = false;
    const accordionSubSectionsListMap = this.formAccordionPanelService.getAccordionSubSectionListMap();
    this.stateService.getSectionNames(false, this.stateType).forEach(section => {
      const sectionData = this.stateService.getSectionData(section, this.productCode, false);
      if (accordionSubSectionsListMap.has(section)) {
        const accordionSubSectionsList = accordionSubSectionsListMap.get(section);
        accordionSubSectionsList.forEach(subSection => {
          const subSectionForm = sectionData.controls[subSection] as FCCFormGroup;
          Object.keys(subSectionForm.controls).forEach(field => {
            const fieldControl = this.stateService.getSubControl(section, subSection, field, false);
            if (fieldControl && fieldControl[FccGlobalConstant.PARAMS]) {
              if (fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.INFO_ICON] &&
                fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.INFO_ICON] === true) {
                isAmended = true;
              } else if (fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_AMENDED_LABEL] &&
                fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_AMENDED_LABEL] === true) {
                isAmended = true;
              } else if (fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_NARRATIVE_AMENDED] &&
                fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_NARRATIVE_AMENDED] === true) {
                isAmended = true;
              }
            }
          });
        });
      } else {
        Object.keys(sectionData.controls).forEach(field => {
          const fieldControl = this.stateService.getControl(section, field, false);
          const subSectionForm = sectionData.controls[field] as FCCFormGroup;
          if (subSectionForm && subSectionForm.controls !== undefined) {
            Object.keys(subSectionForm.controls).forEach(element => {
              const innerSectionForm = subSectionForm.controls[element] as FCCFormGroup;
              if (subSectionForm.get(element) && innerSectionForm.controls !== undefined) {
                Object.keys(innerSectionForm.controls).forEach(data => {
                  if (innerSectionForm.get(data) && innerSectionForm.get(data)[FccGlobalConstant.PARAMS]) {
                    if (innerSectionForm.get(data)[FccGlobalConstant.PARAMS][FccGlobalConstant.INFO_ICON] &&
                      innerSectionForm.get(data)[FccGlobalConstant.PARAMS][FccGlobalConstant.INFO_ICON] === true) {
                      isAmended = true;
                    } else if (innerSectionForm.get(data)[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_AMENDED_LABEL] &&
                      innerSectionForm.get(data)[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_AMENDED_LABEL] === true) {
                      isAmended = true;
                    } else if (innerSectionForm.get(data)[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_NARRATIVE_AMENDED] &&
                      innerSectionForm.get(data)[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_NARRATIVE_AMENDED] === true) {
                      isAmended = true;
                    }
                  }
                });
              } else {
                if (subSectionForm.get(element) && subSectionForm.get(element)[FccGlobalConstant.PARAMS]) {
                  if (subSectionForm.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.INFO_ICON] &&
                    subSectionForm.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.INFO_ICON] === true) {
                    isAmended = true;
                  } else if (subSectionForm.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_AMENDED_LABEL] &&
                    subSectionForm.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_AMENDED_LABEL] === true) {
                    isAmended = true;
                  } else if (subSectionForm.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_NARRATIVE_AMENDED] &&
                    subSectionForm.get(element)[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_NARRATIVE_AMENDED] === true) {
                    isAmended = true;
                  }
                }
              }
            });
          } else {
            if (fieldControl && fieldControl[FccGlobalConstant.PARAMS]) {
              if (fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.INFO_ICON] &&
                fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.INFO_ICON] === true) {
                isAmended = true;
              } else if (fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_AMENDED_LABEL] &&
                fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_AMENDED_LABEL] === true) {
                isAmended = true;
              } else if (fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_NARRATIVE_AMENDED] &&
                fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_NARRATIVE_AMENDED] === true) {
                isAmended = true;
              }
            }
          }
        });
      }
    });
    if (!isAmended) {
      const tosterObj = {
        life: 5000,
        key: 'tc',
        severity: 'success',
        summary: `${this.referenceId}`,
        detail: this.translateService.instant('toasterMessageFormNotAmended')
      };
      this.messageService.add(tosterObj);
    }
    return isAmended;
  }

  onClickPrevious() {
    if (this.container.type !== FccGlobalConstant.SUMMARY_DETAILS) {
      this.stateService.setStateSection(this.items[this.storeIndexValue], this.container.state.form);
      this.saveData();
    }
    --this.storeIndexValue;
    this.commonService.getType = FccGlobalConstant.PREVIOUS;
    const selectedSection = sessionStorage.getItem('selectedSection');
      if(typeof selectedSection !== 'undefined' && selectedSection === 'fileUploadDetails'){
        sessionStorage.setItem('selectedSection','N');
      }
    this.routeToSection();


  }

  setFileDetailsSectionFlag(){
    const selectedSection = sessionStorage.getItem('selectedSection');
      if(typeof selectedSection !== 'undefined' && selectedSection === this.leftSectionService.lastSection){
        sessionStorage.setItem('selectedSection','N');
      }
  }
  routeToSection(field?: string) {
    if (this.leftSectionEnabled) {
      this.autoFocusDivisonOnNextOrPrevious('previous');
      this.leftSectionService.isButtonAction.next(true);
      this.leftSectionService.highlightMenuSection.next(this.storeIndexValue);
    }
    this.updateAllSections(false, false, field);
  }

  navigateToSection(combinedFields: string) {
    const names = combinedFields.split('_');
    for (let i = 0; i < this.items.length; i++) {
      if (names[0] === this.items[i] || (names[0].toLowerCase().indexOf('license') > -1
        && this.items[i].toLowerCase().indexOf('license') > -1)) {
        this.storeIndexValue = i;
        break;
      }
    }
    this.routeToSection(combinedFields);
    setTimeout(() => {
      if (names[0].toLowerCase().indexOf('license') === -1 && names[0] !== FccGlobalConstant.EC_DOCUMENT_DETAILS) {
        this.focusOnErrorField(names);
      }
    });
  }

  focusOnErrorField(names) {
    this.fieldsToFocus = [];
    const accordionSubSectionsListMap = this.formAccordionPanelService.getAccordionSubSectionListMap();
    const tabSectionControlMap = this.tabservice.getTabSectionControlMap();
    if (accordionSubSectionsListMap.has(names[0])) {
      const sectionData = this.stateService.getSectionData(names[0], this.productCode, false);
      if (accordionSubSectionsListMap.has(names[0])) {
        const accordionSubSectionsList = accordionSubSectionsListMap.get(names[0]);
        accordionSubSectionsList.forEach(subSection => {
          const subSectionForm = sectionData.controls[subSection] as FCCFormGroup;
          Object.keys(subSectionForm.controls).forEach(field => {
            this.pushToArray(field, names[1]);
          });
        });
      }
    } else if (tabSectionControlMap.has(names[0])) {
      for (const [fieldName] of tabSectionControlMap.get(names[0])) {
        if (fieldName === names[1] && document.getElementById(fieldName)) {
          document.getElementById(fieldName).focus();
          break;
        }
      }
    } else {
      const form = this.stateService.getSectionData(names[0], undefined, false);
      Object.keys(form.controls).forEach(field => {
        if (field === names[1] && form.get(field)[FccGlobalConstant.PARAMS]['autoForward']) {
          const error = { businessCutOffError: true };
          form.get(names[1]).setErrors(error);
          form.get(names[1]).markAsTouched();
          this.stateService.setStateSection(names[0], form);
        } else {
          this.pushToArray(field, names[1]);
        }
      });
    }
    if (this.fieldsToFocus && this.fieldsToFocus.length > 0 && document.getElementById(this.fieldsToFocus[0])) {
      document.getElementById(this.fieldsToFocus[0]).focus();
    }
  }

  pushToArray(field, passedName) {
    if (field === passedName) {
      this.fieldsToFocus.push(field);
    }
  }

  onOptionClick(event: any) {
    this.sections = false;
    this.tasks = false;
    this.selectedType = event.option.value;
    if (this.selectedType === 'Sections') {
      this.sections = true;
    }

    if (this.selectedType === FccGlobalConstant.TASKS) {
      this.tasks = true;
    }
  }

  toggleNextButton(mission) {
    const next = document.getElementById('next');
    const saveButton = document.getElementById('saveButton');
    if (mission === 'yes') {
      next[this.disabled] = true;
      saveButton.hidden = true;
    } else {
      next[this.disabled] = false;
      saveButton.hidden = false;
    }
  }
  ngOnDestroy() {
    this.productComponentDestroy = true;
    this.subscription.unsubscribe();
    this.editClickSubscription.unsubscribe();
    this.sectionSubscription.unsubscribe();
    this.taskSubscription.unsubscribe();
    this.onClickViewSubscription.unsubscribe();
    // this.setStateSubscription.unsubscribe();
    // this.commonService.productState.complete();
    if (this.commonService.isViewPopup) {
      this.setStateSubscription.unsubscribe();
    }
    this.commonService.productState.next(ProductComponent.EMPTY);
    this.loadEventValuesSubscription.unsubscribe();
    this.commonService.isSubmitAllowed.next(true);
    this.commonService.loadForEventValues.complete();
    this.initiateProdCompSubscription.unsubscribe();
    this.phraseClickSubscription.unsubscribe();
    this.taskService.currentTaskIdFromWidget$.next(null);
    if (!this.commonService.isViewPopup) {
      this.taskService.resetTaskData();
      this.commonService.isnewEventSaved = false;
    }
    this.commonService.setShipmentExpiryDateForBackToBack(null);
    this.commonService.setAmountForBackToBack(null);
    this.commonService.setClearBackToBackLCfields(null);
    this.commonService.setParentReference(null);
    this.commonService.setChildTnxInformation(null);
    this.commonService.setChildReference(null);
    this.commonService.setParentTnxInformation(null);
    this.productService.onClickView$.next(false);
    this.eventTypeCode = undefined;
    this.subTnxTypeCode = undefined;
    this.inputParams = undefined;
    this.secondInputParams = undefined;
    this.tnxIdForAmend = undefined;
    this.previousTnxIdForAmend = undefined;
    this.loadState = true;
    this.uiService.isMasterRequired = false;
    this.commonService.isMasterRequired = false;
    this.fileList.clearMasterDocs = true;
    this.commonService.formLoadDraft = true;
    this.commonService.eventId = undefined;
    this.submitClicked = false;
    if(this.logoutPopupSubscription)
    {
      this.logoutPopupSubscription.unsubscribe();
    }
    if (this.multiBankService.myUpdateRefonEntityChangeSub)
    {
      this.multiBankService.myUpdateRefonEntityChangeSub.unsubscribe();
    }
    if (this.commonService.onCloseDeleteSubScription)
    {
      this.commonService.onCloseDeleteSubScription.unsubscribe();
      this.commonService.onCloseDeleteSubScription = undefined;
    }
    this.commonService.isUpdateRefSubScribed = false;
    CommonService.isTemplateCreation = false;
    if (this.eventEmitterService.subsVar)
    {
      this.eventEmitterService.subsVar.unsubscribe();
      this.eventEmitterService.subsVar = undefined ;
    }
    if(!(this.commonService.isComingFromDiscard && this.commonService.isDisacrdSelectionYes))
    {
      this.saveData();
    }
    this.commonService.isComingFromDiscard = false;
    this.commonService.isDisacrdSelectionYes = false;
    this.commonService.saveAllowed.next(true);
    if (this.container !== undefined && this.container.type !== 'summaryDetails' && this.referenceId !== undefined &&
      this.referenceId !== '' && this.referenceId !== null && this.displayConfirmationDialog === false) {
      const tosterObj = {
        life: 5000,
        key: 'tc',
        severity: 'success',
        summary: `${this.referenceId}`,
        detail: this.translateService.instant('toasterMessage')
      };
      this.messageService.add(tosterObj);
    }


    this.fileList.resetBankList();
    this.initializeSaveStatus();
    this.narrativeService.descriptionOfGoodsSubject.next(null);
    this.narrativeService.documentReqSubject.next(null);
    this.narrativeService.additionalInfoSubject.next(null);
    this.narrativeService.specialBeneSubject.next(null);
    this.narrativeService.totalCountValidatonSubscription.next(null);
    this.transactionDetailsMap.transactionDetailsMap = undefined;
    this.fileList.resetDocumentList();
    this.commonService.narrativeDetailsHandle = false;
    this.taskId = undefined;
    this.commonService.clearMasterData();
    if ((this.tnxType === FccGlobalConstant.N002_AMEND || this.tnxType === FccGlobalConstant.N002_NEW ||
      this.tnxType === FccGlobalConstant.N002_INQUIRE || (this.mode === FccGlobalConstant.VIEW &&
      this.operation === FccGlobalConstant.LIST_INQUIRY)) && !this.commonService.viewPopupFlag) {
      this.stateService.clearState();
      }
      // For amend The query parameters are not fetched correctly after opening masterview popup , to avoid this added below code
      if(this.tnxType === FccGlobalConstant.N002_AMEND && this.commonService.viewPopupFlag) {
        this.commonService.putQueryParameters(FccGlobalConstant.TNX_TYPE_CODE, this.tnxType);
        this.commonService.putQueryParameters(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE, this.subTnxType);
        this.commonService.putQueryParameters(FccGlobalConstant.OPTION, this.option);
        this.commonService.putQueryParameters(FccGlobalConstant.MODE, 'EXISTING');
      }

     // that state is getting updated with parent details after opening view popup,to avoid this adding this below code as temp fix
    if (this.commonService.getQueryParameters().get('productCode') === 'BG' && this.tnxType === FccGlobalConstant.N002_INQUIRE
    && this.commonService.viewPopupFlag && this.commonService.parent === true) {
    this.transactionDetailService.fetchTransactionDetails(
      this.commonService.eventId, this.productCode).subscribe(response => {
      const responseObj = response.body;
      if (responseObj) {
        if (responseObj && responseObj.free_format_text) {
          this.stateService.setValue (FccGlobalConstant.UI_MESSAGE_GENERAL_DETAILS, 'customerInstructionText',
          responseObj.free_format_text, false);

        }
      }
     });
    }
    this.initializeDataForBK();
    if (this.eventEmitterService.subsVar !== undefined) {
      this.eventEmitterService.subsVar.unsubscribe();
      this.eventEmitterService.subsVar = undefined;
    }
    if (this.tnxType === FccGlobalConstant.N002_INQUIRE && (this.option === FccGlobalConstant.ACTION_REQUIRED
      || this.mode === FccGlobalConstant.DISCREPANT || this.subTnxType === FccGlobalConstant.N002_SETTLE) &&
      this.tnxId !== undefined && this.tnxId !== null && this.mode === FccGlobalConstant.VIEW_MODE) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.populateStateWithMasterDetails().then(callThis => this.populateStateWithTransactionDetails());
    }
    this.commonService.eventId = undefined;

  }

  initializeDataForBK() {
    if (this.productCode === FccGlobalConstant.PRODUCT_BK) {
      this.referenceId = undefined;
      this.eventId = undefined;
      this.tnxId = undefined;
      if (this.container !== undefined) {
        this.container.ngOnInit();
      }

    }
  }

  submit(){
    this.legalTextService.getConfigurationValue('DISPLAY_LEGAL_TEXT_FOR_LOAN').subscribe(enabled => {
      if(enabled === 'true'){
        this.submitClicked = false;
      }else{
        this.submitClicked = true;
      }
    });
    if (this.isSaveAllowed)
    {
      this.onclickSubmit();
    }
    else
    {
      this.issavecompleted.subscribe(
        value =>
        {
           if (value === true)
           {
            this.onclickSubmit();
           }
        });
    }
  }

  onclickSubmit()
  {
    const validations = [];
    validations.push('validateAllFormFields', 'beforeSubmitValidation');
    if (this.validateMethods(validations)) {
      if (this.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC) {
        this.productMappingService.getApiModel(undefined, undefined, undefined, undefined, undefined,
          this.option).subscribe(apiMappingModel => {
            const requestObj = this.buildSystemFeatureRequestObject(apiMappingModel, FccConstants.SYSTEM_FEATURE_SUBMIT);
            const reauthData: any = {
              action: FccConstants.SYSTEM_FEATURE_SUBMIT,
              request: requestObj,
            };
            this.legalTextService.openLegalTextDiaglog(reauthData);
          });
      } else {
        this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(mappingModel => {
          const requestObj = this.buildRequestObject(mappingModel,
            (this.option === FccGlobalConstant.TEMPLATE) ? 'SAVE_TEMPLATE' : 'SUBMIT');
          const reauthData: any = {
            action: FccGlobalConstant.SUBMIT,
            option: this.option,
            request: requestObj,
          };
          this.legalTextService.openLegalTextDiaglog(reauthData);
        });
      }
      this.submitClicked = !this.submitClicked;
    }
    this.submitClicked = !this.submitClicked;

    this.commonService.isubmitClicked.subscribe(
      data => {
        if (data) {
          this.submitClicked = true;
        } else {
          this.submitClicked = false;
        }
      }
    );
  }
  buildRequestObject(mappingModel, actionType: string): any {
    const requestObj = {};
    const common = 'common';
    const transaction = 'transaction';
    const tnxDetailsReqObject = this.buildTnxRequestObject(mappingModel);
    let commonRequestObj;
    if (this.productCode === FccGlobalConstant.PRODUCT_BK){
      this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      commonRequestObj = this.buildCommonRequestObjectForTemplate();
    } else {
      // removing template_description it if its not template save/submit scenario.
      const templateDescription = 'template_description';
      delete tnxDetailsReqObject[templateDescription];
      commonRequestObj = this.buildCommonRequestObject(actionType);
    }
    if (!this.leftSectionService.getIsEnableLicenseSection()) {
      const linkedLicenses = 'linked_licenses';
      delete tnxDetailsReqObject[linkedLicenses];
    }
    requestObj[common] = commonRequestObj;
    requestObj[transaction] = tnxDetailsReqObject;
    this.phraseService.payloadObject = requestObj;
    return requestObj;
  }

  buildSystemFeatureRequestObject(mappingModel, actionType: string): any {
    const forAPIRequestObj = true;
    let multiAccountsPresent = false;
    const requestObj = {};
    const beneDetailsObj = {};
    let accountDetailsArray = [];
    const accountDetailsObj = {};
    const beneOtherDetailsObj = {};
    requestObj[FccGlobalConstant.OPERATION] = actionType;
    this.stateService.getSectionNames().forEach(section => {
      const sectionFormValue = this.stateService.getSectionData(section);
      if (mappingModel !== null) {
        if (sectionFormValue.controls[FccConstants.ACCOUNTS_LIST_TABLE] !== null) {
          const control = sectionFormValue.controls[FccConstants.ACCOUNTS_LIST_TABLE];
          const colLength = control[FccGlobalConstant.PARAMS][FccGlobalConstant.COLUMNS] ?
          control[FccGlobalConstant.PARAMS][FccGlobalConstant.COLUMNS].length : FccGlobalConstant.LENGTH_0;
          const dataLength = control[FccGlobalConstant.PARAMS][FccGlobalConstant.TABLE_DATA] ?
          control[FccGlobalConstant.PARAMS][FccGlobalConstant.TABLE_DATA].length : FccGlobalConstant.LENGTH_0;
          multiAccountsPresent = (colLength > FccGlobalConstant.LENGTH_0 &&
            dataLength > FccGlobalConstant.LENGTH_0) ? true : false;
          if (multiAccountsPresent) {
            accountDetailsArray = this.addAccountTableDataToRequestObject(mappingModel, control, accountDetailsObj, accountDetailsArray,
              sectionFormValue.controls, forAPIRequestObj);
          }
        }
        Object.keys(sectionFormValue.controls).forEach(fieldName => {
          if (fieldName !== FccGlobalConstant.ENTITY_TEXT && fieldName !== FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE) {
            if (!multiAccountsPresent && BeneConstants.ACCOUNT_DETAILS.includes(fieldName)) {
              this.addFieldToRequestObject(mappingModel, sectionFormValue, fieldName, accountDetailsObj, forAPIRequestObj);
            } else if (BeneConstants.OTHER_DETAILS.includes(fieldName)) {
              this.addFieldToRequestObject(mappingModel, sectionFormValue, fieldName, beneOtherDetailsObj, forAPIRequestObj);
            } else if (!BeneConstants.ACCOUNT_DETAILS.includes(fieldName)) {
              this.addFieldToRequestObject(mappingModel, sectionFormValue, fieldName, beneDetailsObj, forAPIRequestObj);
            }
          } else {
            this.addFieldToRequestObject(mappingModel, sectionFormValue, fieldName, requestObj, forAPIRequestObj);
            this.updateEntity(requestObj);
            this.updateAmount(beneDetailsObj);
          }
        });
      }
    });
    if (!multiAccountsPresent) {
      accountDetailsArray.push(accountDetailsObj);
    }
    beneDetailsObj[FccConstants.ACCOUNT_DETAILS_TAG] = accountDetailsArray;
    beneDetailsObj[FccConstants.BENE_OTHER_DETAILS_TAG] = beneOtherDetailsObj;
    requestObj[FccConstants.BENEFICIARY_DETAILS_TAG] = beneDetailsObj;
    return requestObj;
  }

  addFieldToRequestObject(mappingModel, sectionFormValue, fieldName, requestObj, forAPIRequestObj) {
    const apiFieldName = this.productMappingService.getRequestFieldNameFromMappingModel(fieldName, mappingModel);
    const isFieldTypeComplex = this.productMappingService.checkComplexityTypeForRequestField(fieldName, mappingModel);
    const control = sectionFormValue.controls[fieldName];
    if (isFieldTypeComplex) {
      if (this.productService.isParamValid(control.value)) {
        const value = JSON.parse(control.value);
        requestObj[apiFieldName] = value;
      }
    } else if (apiFieldName) {
      const val = this.previewService.getPersistenceValue(sectionFormValue.controls[fieldName], false, forAPIRequestObj);
      if (val) {
        if (control[FccGlobalConstant.PARAMS][FccConstants.MAP_BOOLEAN_VALUE]) {
          requestObj[apiFieldName] = (val === FccGlobalConstant.CODE_Y) ? true : false;
        } else {
          requestObj[apiFieldName] = val;
        }
      }
    }
  }

  addAccountTableDataToRequestObject(mappingModel, control, accountDetailsObj, accountDetailsArray, sectionControls,
                                     forAPIRequestObj) {
    const columns = control[FccGlobalConstant.PARAMS][FccGlobalConstant.COLUMNS];
    const tableData = control[FccGlobalConstant.PARAMS][FccGlobalConstant.TABLE_DATA];
    accountDetailsArray = [];
    for (let i = 0; i < tableData.length; i++) {
      accountDetailsObj = {};
      columns.forEach(col => {
        const apiFieldName = this.productMappingService.getRequestFieldNameFromMappingModel(col, mappingModel);
        const val = this.previewService.getTableDataValue(sectionControls, col, tableData[i][col], forAPIRequestObj);
        if (sectionControls[col][FccGlobalConstant.PARAMS][FccConstants.MAP_BOOLEAN_VALUE]) {
          accountDetailsObj[apiFieldName] = (val === FccGlobalConstant.CODE_Y) ? true : false;
        } else {
          accountDetailsObj[apiFieldName] = val;
        }
      });
      if (sectionControls[FccConstants.INTERMEDIARY_BANK_IFSC_ADDRESS]) {
        const field = FccConstants.INTERMEDIARY_BANK_IFSC_ADDRESS;
        const fieldValue = sectionControls[FccConstants.INTERMEDIARY_BANK_IFSC_ADDRESS].value;
        const apiFieldName = this.productMappingService.getRequestFieldNameFromMappingModel(field, mappingModel);
        const val = this.previewService.getTableDataValue(sectionControls, field, fieldValue, forAPIRequestObj);
        accountDetailsObj[apiFieldName] = val;
      }
      if (this.commonService.isNonEmptyValue(this.beneAccountIDResponse)
        && this.beneAccountIDResponse.length > FccGlobalConstant.LENGTH_0) {
          this.beneAccountIDResponse.forEach(account => {
            if (account[FccConstants.ACCOUNT_NUMBER] === tableData[i][FccConstants.BENEFICIARY_ACCOUNT_NUMBER]) {
              accountDetailsObj[FccConstants.ACCOUNT_ID] = account[FccConstants.ACCOUNT_ID];
            }
          });
      }
      accountDetailsArray.push(accountDetailsObj);
    }
    return accountDetailsArray;
  }

  private buildTnxRequestObject(model): any {
    const forAPIRequestObj = true;
    const tnxObj = {};
    this.stateService.getSectionNames().forEach(section => {
      const sectionFormValue = this.stateService.getSectionData(section);
      this.tabservice.initializeMaps(section, this.stateService.getSectionData(section, undefined, false));
      const tabSectionControlMap = this.tabservice.getTabSectionControlMap();
      // this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(model => {
      if (tabSectionControlMap.has(section) && model !== null) {
        for (const [fieldName, control] of tabSectionControlMap.get(section)) {
          if (control.params[this.modeTnxType] === undefined || control.params[this.modeTnxType] === this.tnxType) {
            // 1st condition undefined check is for other controls where the mode parameter is not mentioned
            // second condition to compare the mode mentioned in the narrative field of narrative details section
            // with the tnx type code
            // so that the api mapping should happen for the respective controls
            const apiFieldName = this.productMappingService.getRequestFieldNameFromMappingModel(fieldName, model);
            if (apiFieldName) {
              tnxObj[apiFieldName] = this.previewService.getPersistenceValue(control, false, forAPIRequestObj);
            }
          }
        }
      }
      if (model !== null) {
        this.handleTnxObjFromMappingModel(sectionFormValue, model, tnxObj, forAPIRequestObj);
      }
      // });
    });
    if (Object.keys(tnxObj).length !== 0) {
      const productCode = 'product_code';
      const subProductCode = 'sub_product_code';
      tnxObj[productCode] = this.productCode;
      if ( tnxObj[subProductCode] === ' ' || tnxObj[subProductCode] === undefined) {
        tnxObj[subProductCode] = this.subProductCode;
      }
      this.getParentTnxId(tnxObj);
    }
    if (!this.commonService.langSwitch) {
      this.updateAmount(tnxObj);
    }
    this.updateEntity(tnxObj);
    return tnxObj;
  }

  private handleTnxObjFromMappingModel(sectionFormValue: FCCFormGroup, mappingModel: any, tnxObj: any, forAPIRequestObj: boolean) {
    Object.keys(sectionFormValue.controls).forEach(fieldName => {
      let parentField = '';
      if (sectionFormValue.controls[fieldName][FccGlobalConstant.PARAMS] &&
        sectionFormValue.controls[fieldName][FccGlobalConstant.PARAMS][`dynamicField`] &&
        sectionFormValue.controls[fieldName][FccGlobalConstant.PARAMS][`dynamicField`] === true) {
        const currentField = fieldName;
        this.dynamicFieldFlag = true;
        this.dynamicFieldIndex = currentField.substring(currentField.length - 1);
        parentField = sectionFormValue.controls[fieldName][FccGlobalConstant.PARAMS][`parentField`];
      } else {
        parentField = fieldName;
      }
      let apiFieldName = this.productMappingService.getRequestFieldNameFromMappingModel(parentField, mappingModel);
      if (this.dynamicFieldFlag) {
        apiFieldName = apiFieldName.replace(apiFieldName.substring(apiFieldName.length - 1), this.dynamicFieldIndex);
        this.dynamicFieldFlag = false;
      }
      const isFieldTypeComplex = this.productMappingService.checkComplexityTypeForRequestField(parentField, mappingModel);
      if (isFieldTypeComplex) {
        const control = sectionFormValue.controls[fieldName];
        if (this.productService.isParamValid(control.value)) {
          const value = JSON.parse(control.value);
          tnxObj[apiFieldName] = value;
        }
      } else if (apiFieldName) {
        tnxObj[apiFieldName] = this.previewService.getPersistenceValue(sectionFormValue.controls[fieldName], false, forAPIRequestObj);
      }
    });
  }

  protected buildCommonRequestObject(actionType: string): any {
    this.handleSaveSubmitPayload();
    const commonParameters = {};
    commonParameters[FccGlobalConstant.SCREEN] = this.stateService.getScreenName();
    commonParameters[FccGlobalConstant.OPERATION] = actionType;
    commonParameters[FccGlobalConstant.OPTION] = (this.option !== undefined && this.option !== null) ? this.option : undefined;
    commonParameters[FccGlobalConstant.TEMPLATEID] = this.templateId;
    commonParameters[FccGlobalConstant.MODE] = (this.mode !== undefined && this.mode !== null) ? this.mode : undefined;
    commonParameters[FccGlobalConstant.REFERENCE_ID] = this.refId !== undefined ? this.refId : this.referenceId;
    commonParameters[FccGlobalConstant.TNXID] = this.eventId !== undefined ? this.eventId : this.tnxId;
    commonParameters[FccGlobalConstant.TNXTYPE] = this.tnxType;
    commonParameters[FccGlobalConstant.MODULE_NAME] = this.moduleName;
    return commonParameters;
  }

  private buildCommonRequestObjectForTemplate(): any {
    this.handleSaveSubmitPayload();
    const commonParameters = {};
    commonParameters[FccGlobalConstant.SCREEN] = this.stateService.getScreenName();
    commonParameters[FccGlobalConstant.OPERATION] = FccGlobalConstant.SAVE_TEMPLATE;
    commonParameters[FccGlobalConstant.OPTION] = '';
    commonParameters[FccGlobalConstant.REFERENCE_ID] = '';
    commonParameters[FccGlobalConstant.TNXID] = '';
    commonParameters[FccGlobalConstant.TEMPLATEID] = '';
    commonParameters[FccGlobalConstant.MODE] = FccGlobalConstant.DRAFT_OPTION;
    commonParameters[FccGlobalConstant.TNXTYPE] = FccGlobalConstant.N002_NEW;
    commonParameters[FccGlobalConstant.MODULE_NAME] = this.moduleName;
    return commonParameters;
  }

  getParentTnxId(tnxObj: any) {
    const actionRequiredOption = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    const discrepantmode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const actionRequired = this.commonService.getQueryParametersFromKey(FccGlobalConstant.ACTION_REQUIRED_CODE);
    if (this.productService.checkForDiscrepantOrActionRequired(actionRequiredOption, discrepantmode) ||
    this.productService.checkForDraftAndActionRequiredQuery(discrepantmode)
    || (discrepantmode === FccGlobalConstant.DRAFT_OPTION
      && (this.commonService.isNonEmptyValue(actionRequired) && actionRequired === FccGlobalConstant.ACTION_REQUIRED_12))) {
      if (!this.eventId) {
        this.parentTnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
      }
      const parentTnxId = 'parent_tnx_id';
      tnxObj[parentTnxId] = this.parentTnxId;
    }
    const parentTnxId = 'parent_tnx_id';
    tnxObj[parentTnxId] = this.parentTnxId;
  }


  handleSaveSubmitPayload() {
    switch (this.productCode) {
      case FccGlobalConstant.PRODUCT_EL:
      case FccGlobalConstant.PRODUCT_SR:
        if (this.tnxType === FccGlobalConstant.N002_INQUIRE) {
          if (this.mode !== FccGlobalConstant.VIEW_MODE) {
            this.mode = FccGlobalConstant.DRAFT_OPTION;
          }
          const actionRequiredOption = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
          const actionRequiredMode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
          if (actionRequiredOption === FccGlobalConstant.ACTION_REQUIRED || actionRequiredMode === FccGlobalConstant.DISCREPANT) {
            if (!this.eventId) {
              this.tnxId = '';
            } else {
              this.tnxId = this.eventId;
            }
          }
          if (this.option !== FccGlobalConstant.OPTION_ASSIGNEE && this.subTnxType !== FccGlobalConstant.N003_REMITTANCE_LETTER_GENERATION
            && this.option !== FccGlobalConstant.OPTION_TRANSFER) {
            this.option = undefined;
          }
        }
        break;
      case FccGlobalConstant.PRODUCT_IC:
      case FccGlobalConstant.PRODUCT_LC:
      case FccGlobalConstant.PRODUCT_SG:
      case FccGlobalConstant.PRODUCT_EC:
      case FccGlobalConstant.PRODUCT_IR:
      case FccGlobalConstant.PRODUCT_SI:
      case FccGlobalConstant.PRODUCT_LI:
      case FccGlobalConstant.PRODUCT_LN:
      case FccGlobalConstant.PRODUCT_BG:
      case FccGlobalConstant.PRODUCT_BR:
        if (FccGlobalConstant.VIEW_MODE !== this.mode && this.tnxType === FccGlobalConstant.N002_INQUIRE) {
          this.mode = FccGlobalConstant.DRAFT_OPTION;
          this.option = undefined;
          const actionRequiredOption = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
          const actionRequiredMode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
          if (actionRequiredOption === FccGlobalConstant.ACTION_REQUIRED || actionRequiredMode === FccGlobalConstant.DISCREPANT) {
            if (!this.eventId) {
              this.tnxId = '';
            } else {
              this.tnxId = this.eventId;
            }
          }
        }
        break;
      case FccGlobalConstant.PRODUCT_TF:
        if (FccGlobalConstant.VIEW_MODE !== this.mode && this.tnxType === FccGlobalConstant.N002_INQUIRE) {
          this.mode = FccGlobalConstant.DRAFT_OPTION;
          this.option = undefined;
          const actionRequiredOption = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
          if (actionRequiredOption === FccGlobalConstant.ACTION_REQUIRED) {
            if (!this.eventId) {
              this.tnxId = '';
            } else {
              this.tnxId = this.eventId;
            }
          }
        } else if (this.tnxType === FccGlobalConstant.N002_NEW) {
          this.moduleName = this.stateService.getValue('tfGeneralDetails', 'typeOfProduct', false);
        }
        break;
      case FccGlobalConstant.PRODUCT_FT:
        this.mode = FccGlobalConstant.DRAFT_OPTION;
        break;
      case FccGlobalConstant.PRODUCT_SE:
        (this.mode !== undefined && this.mode !== null) ? this.mode : undefined;
        if (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_SEEML) {
          this.option = FccGlobalConstant.SUB_PRODUCT_SEEML;
        } else if (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_CTCHP) {
          this.option = FccGlobalConstant.SUB_PRODUCT_CTCHP;
        } else if (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_ULOAD) {
          this.option = FccGlobalConstant.OPTION_SE_ULOAD;
        }
        else if (this.subProductCode !== FccGlobalConstant.SUB_PRODUCT_LNCDS) {
          this.option = FccGlobalConstant.SE_OPTION;
          this.mode = FccGlobalConstant.DRAFT_OPTION;
        }
        break;
      case FccGlobalConstant.PRODUCT_TD:
        if (this.tnxType === FccGlobalConstant.N002_AMEND || this.tnxType === FccGlobalConstant.N002_INQUIRE) {
          this.option = '';
          this.mode = FccGlobalConstant.DRAFT_OPTION;
        }
        break;
      case FccGlobalConstant.PRODUCT_BK:
        if (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_LNRPN && this.mode === FccGlobalConstant.DRAFT_OPTION) {
          this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_ID);
          this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
        }
        break;
      default:
        break;
    }
  }

  beforeSubmitValidation(): boolean {
    let isValid = false;
    this.eventEmitterService.emitSubmitEvent();
    this.eventEmitterService.subFlag.subscribe(val => {
      isValid = val;
    });
    if (this.eventEmitterService.subsVar !== undefined) {
      this.eventEmitterService.subsVar.unsubscribe();
      this.eventEmitterService.subsVar = undefined;
    }
    return isValid;
  }

  validateMethods(validations: any): boolean {
    let isValidated = false;
    isValidated = validations.every((f) => this[f]());
    return isValidated;
  }
  validateAllFormFields(): boolean {
    return this.stateService.validateStateFields();
  }

  initializeInterval() {
    return [setInterval(() => {
      if (this.count === 1) {
        this.savedTimeText.next(this.translateService.instant('saved') + this.count + this.translateService.instant('minuteAgo'));
      } else {
        this.savedTimeText.next(this.translateService.instant('saved') +
          this.count + this.translateService.instant('minutesAgo'));
      }
      this.count = this.count + 1;
    }, this.timerCode)];
  }

  initializeSaveStatus() {
    if (this.intervalId2) {
      clearInterval(this.intervalId2);
    }
    if (this.intervalId1) {
      clearInterval(this.intervalId1);
    }

    this.saveUrlStatus.next(this.translateService.instant('save'));
    this.savedTimeTextShow.next(false);
    this.spinnerShow.next(false);
  }

  subjectInitialize() {
    this.saveUrlStatus.subscribe(
      data => {
        this.save = data;
      }
    );
    this.spinnerShow.subscribe(
      data => {
        this.showProgresssSpinner = data;
      }
    );
    this.savedTimeText.subscribe(
      data => {
        this.savedTime = data;
      }
    );
    this.savedTimeTextShow.subscribe(
      data => {
        this.showSavedTimeText = data;
      }
    );

  }

  /**
   * initializes productmodel and state.
   * if already initialized, model is re-initialized only if reinit flag is set
   * @param reInit default true as existing behaviour
   */
  initializeStateAndSectionValues(reInit = true) {
    if (this.tnxType === FccGlobalConstant.N002_NEW && (this.mode === 'INITIATE' ||
      (this.templateId === undefined && this.option === FccGlobalConstant.TEMPLATE))) { // If data retrieval isn't required
      this.handleInitiationAndTemplate();
    } else if (((this.tnxType === FccGlobalConstant.N002_NEW || this.tnxType === FccGlobalConstant.N002_INQUIRE)
      && this.mode === 'DRAFT') ||
      (this.actionReqCode && this.mode === 'view' && (this.operation && this.operation !== 'LIST_INQUIRY')
        && (this.isMaster || this.parent)) ||
      (this.templateId && this.mode === 'DRAFT')) { // If only tnx table data retrieval is required
      this.handleMasterTnxStateAndSection(reInit);
    } else if (this.tnxType === FccGlobalConstant.N002_INQUIRE && (this.option === FccGlobalConstant.ACTION_REQUIRED
      || this.mode === FccGlobalConstant.DISCREPANT) && this.tnxId !== undefined && this.tnxId !== null && this.mode !== 'view') {
      this.handleMessageForActionRequiredAndDiscrepant(reInit);
    } else if ((this.tnxType === FccGlobalConstant.N002_AMEND && this.mode === 'EXISTING') ||
      (this.tnxType === FccGlobalConstant.N002_INQUIRE && this.mode === 'EXISTING' && this.subTnxType === FccGlobalConstant.N003_PAYMENT) ||
      ((this.tnxType === FccGlobalConstant.N002_INQUIRE && !this.parent && (this.option === FccGlobalConstant.OPTION_ASSIGNEE ||
        this.option === FccGlobalConstant.EXISTING_OPTION || this.option === FccGlobalConstant.OPTION_TRANSFER ||
        this.option === FccGlobalConstant.CANCEL_OPTION) && this.commonService.isEmptyValue(this.accountId)) ||
        ((this.isMaster || this.mode !== 'view') && this.subTnxType === FccGlobalConstant.N003_REMITTANCE_LETTER_GENERATION) ||
        (this.mode === 'view' && this.isMaster && !this.parent && !((this.operation === FccGlobalConstant.LIST_INQUIRY
          || this.operation === FccGlobalConstant.PREVIEW) &&
          (this.tnxType === FccGlobalConstant.N002_AMEND || this.subTnxType === FccGlobalConstant.N003_PAYMENT) &&
                        this.tnxId)))) { // If only master table data retrieval is required
      this.stateService.initializeState(this.productCode, this.isMaster, reInit, null, null, this.parent,
        '', this.refId);
      this.setSectionList();
      this.populateStateWithMasterDetails();
    } else if (this.tnxType === FccGlobalConstant.N002_NEW && this.option === 'EXISTING') { // Copy From
      this.stateService.initializeState(this.productCode, this.isMaster, reInit);
      this.setSectionList();
      this.populateStateWithMasterDetails();
      this.refId = undefined;
    } else if (this.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC && (this.operation === FccGlobalConstant.ADD_FEATURES
      || this.operation === FccGlobalConstant.UPDATE_FEATURES)) {
      this.handleBeneficiaryData();
    } else if (this.option === FccGlobalConstant.BENEFICIARY_FILE_UPLOAD_MC) {
      this.handleBulkFileUploadBeneData();
    } else if (this.option === FccGlobalConstant.EXISTING_OPTION && (this.tnxType === FccGlobalConstant.N002_AMEND ||
      (this.tnxType === FccGlobalConstant.N002_INQUIRE && !this.parent))) {
      this.handleInitiationAndTemplate();
      this.populateStateWithTransactionDetails();
    } else {
      this.handleOtherFormDetails(reInit);
    }
  }

  protected handleOtherFormDetails(reInit: boolean) {
    if (this.tnxId === '' || this.tnxId === undefined) {
      const inquiryTnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNXID);
      if (!inquiryTnxId) {
        this.tnxId = (this.tnxId !== undefined && this.tnxId !== '') ?
          this.tnxId : this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNXID);
      } else {
        this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNXID);
      }
    }
    if (this.tnxType === FccGlobalConstant.N002_AMEND && this.mode === 'DRAFT') { // If both master and tnx
      // table data retrieval is required
      // this.stateType = EnumMapping.stateTypeEnum.AMENDSTATE;
      this.handleAmendAndDraftForm();
    } else if (this.mode && this.mode === FccGlobalConstant.VIEW_MODE && this.operation &&
      this.operation === FccGlobalConstant.LIST_INQUIRY && this.tnxType && this.tnxType === FccGlobalConstant.N002_AMEND && 
      (this.stateType != FccGlobalConstant.EVENT_STATE)) {
    if (this.productCode === FccGlobalConstant.PRODUCT_TD) {
        this.stateService.initializeState(this.productCode, true, true, undefined, undefined, false, this.stateType, this.tnxId);
        this.setSectionList();
        this.populateStateWithTransactionDetails();
    }
    else if (this.mode && this.mode === FccGlobalConstant.VIEW_MODE && this.operation && this.operation === FccGlobalConstant.LIST_INQUIRY
      && this.tnxType && this.tnxType === FccGlobalConstant.N002_AMEND) {
        this.stateService.initializeState(this.productCode, true, true, undefined, undefined, false, this.stateType, this.tnxId);
        this.setSectionList();
         this.populateStateWithMasterDetails();
        this.populateStateWithTransactionDetails();
          this.updateSummaryOnChange(false);
      }
    else {
        this.stateService.initializeState(this.productCode, true, true, undefined, undefined, false, this.stateType, this.tnxId);
        this.setSectionList();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.populateStateWithMasterDetails().then((isMasterForUpdated) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.populateStateWithTransactionDetails().then((isTnxFormForUpdated) => {
          this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.EMPTY_STRING, this.productCode);
          // This code has been added to re-load the summary details after the master value is set.
          // As in many cases the amendAccordionValues method in summary details is called before the masterVal
          // is set and leads to incorrect display.
          this.updateSummaryOnChange(false);
        });
      });
    }

    } else if ((this.secondInputParams && (Object.keys(this.secondInputParams).length > 0)) && this.mode === 'view') { // Compare two tnx
      let setMaster;
      this.stateService.clearState();
      this.stateService.clearState(true);
      this.stateService.initializeState(this.productCode, true, reInit, this.eventTnxTypeCode, this.eventSubTnxType,
        this.parent, this.stateType, this.tnxIdForAmend);
      this.setSectionList();
      this.loadState = false;
      this.uiService.isMasterRequired = true;
      this.commonService.isMasterRequired = true;
      if(this.amendedValue){
        setMaster = this.isMaster;
      } else {
        setMaster = true;
      }
      // populateStateWithTransactionDetails is called twice.once to fetch current tnx details and
      // once to fetch previous transaction details
      this.populateStateWithTransactionDetails(this.tnxIdForAmend, false, setMaster).then(() => {
        this.loadState = true;
        this.uiService.isMasterRequired = false;
        this.commonService.isMasterRequired = false;
        this.populateStateWithTransactionDetails(this.previousTnxIdForAmend, true).then(() => {
          //eslint : no-empty-function
        });
      });
    } else if (this.mode === 'view' && !this.isMaster) {
      this.stateService.initializeState(this.productCode, this.isMaster, reInit, this.eventTnxTypeCode, this.eventSubTnxType,
        this.parent, this.stateType, this.tnxId);
      this.setSectionList();
      this.populateStateWithTransactionDetails();
    //For non provisional Action required scenario, we need to load transaction details of the parent tnx, hence adding this condition.
    } else if ((this.mode === 'view' && this.parent ) &&
    ((this.tnxType === FccGlobalConstant.N002_INQUIRE && this.option === FccGlobalConstant.EXISTING_OPTION)
    || ((this.option === FccGlobalConstant.ACTION_REQUIRED) &&
      (this.commonService.currentStateTnxResponse.prod_stat_code !== FccGlobalConstant.N005_WORDING_UNDER_REVIEW &&
        this.commonService.currentStateTnxResponse.prod_stat_code !== FccGlobalConstant.N005_FINAL_WORDING)))) {
      this.stateService.initializeState(this.productCode, false, reInit, null, null, this.parent);
      this.setSectionList();
      this.populateStateWithTransactionDetails();
    } else if ((this.mode === 'view' && this.parent ) && (this.option === FccGlobalConstant.ACTION_REQUIRED &&
    (this.commonService.currentStateTnxResponse.prod_stat_code === FccGlobalConstant.N005_WORDING_UNDER_REVIEW ||
      this.commonService.currentStateTnxResponse.prod_stat_code === FccGlobalConstant.N005_FINAL_WORDING))){
      this.stateService.initializeState(this.productCode, false, reInit, null, null, this.parent);
      this.setSectionList();
      this.populateStateWithMasterDetails();
      if (!this.commonService.isViewPopup && this.tnxType !== FccGlobalConstant.N002_INQUIRE) {
      this.populateStateWithTransactionDetails();
    }
  } else if (this.mode && this.mode === FccGlobalConstant.VIEW_MODE && this.subTnxType === FccGlobalConstant.N003_PAYMENT){
    this.stateService.initializeState(this.productCode, true, true, undefined, undefined, false, this.stateType, this.tnxId);
    this.setSectionList();
    this.populateStateWithMasterDetails();
    this.populateStateWithTransactionDetails();
}
else if (this.mode && this.mode === FccGlobalConstant.VIEW_MODE &&
  this.tnxType === FccGlobalConstant.N002_INQUIRE && this.actionReqCode && this.parent){
  this.stateService.initializeState(this.productCode, false, reInit, null, null, this.parent);
  this.setSectionList();
  this.populateStateWithTransactionDetails();
}

  else if (this.category === FccConstants.FCM) {
    switch (this.option) {
      case FccConstants.OPTION_PAYMENTS :
        this.handlePaymentsData();
        break;
      default:
        break;
    }
  }
}

  protected handleMessageForActionRequiredAndDiscrepant(reInit: boolean) {
    this.stateService.initializeState(this.productCode, false, reInit, null, null, this.parent);
    this.setSectionList();
    this.populateStateWithTransactionDetails();
    this.parent = true;
  }

  protected handleAmendAndDraftForm() {
    // this.stateType = EnumMapping.stateTypeEnum.AMENDSTATE;
    this.stateService.initializeState(this.productCode, this.isMaster, true, undefined, undefined, false);
    this.setSectionList();
    this.loadState = false;
    if (this.subProductsWhichDontNeedMaster.indexOf(this.subProductCode) > -1) {
      this.loadTransansationStateData();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const getMasterForm = this.populateStateWithMasterDetails().then(() => {
        this.isStateReloadNeeded = true;
        this.loadTransansationStateData();
      });
    }
  }

  private loadTransansationStateData() {
    this.loadState = true;
    this.populateStateWithTransactionDetails();
  }

  protected handleBeneficiaryData() {
    const beneGrpId = this.commonService.getQueryParametersFromKey(FccConstants.BENEFICIARY_GROUP_ID);
    this.stateService.initializeState(null);
    this.setSectionList();
    this.handleLeftSectionData();
    if (this.commonService.isnonEMptyString(beneGrpId)) {
      this.beneGroupId = beneGrpId;
      this.handleBeneficiaryUpdate();
    }
  }

  protected handlePaymentsData() {
    this.stateService.initializeState(null);
    this.setSectionList();
    this.handleLeftSectionData();

  }

  protected handleBulkFileUploadBeneData() {
    this.stateService.initializeState(null);
    this.setSectionList();
    this.handleLeftSectionData();

  }

  handleBeneficiaryUpdate() {
    this.stateService.populateAllEmptySectionsInState();
    this.productMappingService.getApiModel(undefined, undefined, undefined, undefined, undefined,
      this.option).subscribe(apiMappingModel => {
        this.commonService.getPaymentBeneficiaryDetails(this.beneGroupId, FccGlobalConstant.MASTER).subscribe(response => {
          this.isStateReloadNeeded = true;
          this.setBeneficiaryState(response, apiMappingModel);
        });
      });
  }

  protected handleInitiationAndTemplate() {
    this.stateService.initializeState(this.productCode, this.isMaster); // Initiate
    this.setSectionList();
    this.handleLeftSectionData();
    this.handleTemplateStateAndSection();
    this.option = (this.mode === 'INITIATE'
      && !this.commonService.isLoanBulk(this.productCode, this.subProductCode)) ? FccGlobalConstant.EMPTY_STRING : this.option;
  }

  protected handleTemplateStateAndSection() {
    if (this.option === FccGlobalConstant.TEMPLATE) { // Temporary fix for template creation, to be revisited for template persistence
      CommonService.isTemplateCreation = true;
    }
  }

  protected handleMasterTnxStateAndSection(reInit: boolean) {
    if (this.productService.getConditionForHandleMasterTnxState(this.tnxType, this.productCode, this.subProductCode)) {
      if (this.actionReqCode) {
        this.stateService.initializeState(this.productCode, false, reInit, null, null, this.parent);
        this.setSectionList();
        if (this.parent) {
          this.populateStateWithMasterDetails();
        }
        // to not populate transaction state for viewpopup scenario
        if (!(this.commonService.isViewPopup && this.tnxType === FccGlobalConstant.N002_INQUIRE)) {
          if (this.productCode === FccGlobalConstant.PRODUCT_LC) {
            this.populateStateWithMasterDetails();
           } else {
            this.populateStateWithTransactionDetails();
           }
        this.parent = true;
        }
      } else {
        if (this.isMaster) {
          this.stateService.initializeState(this.productCode, this.isMaster, reInit);
          this.setSectionList();
          this.populateStateWithMasterDetails().then(() => {
            if (this.tnxType === FccGlobalConstant.N002_INQUIRE && this.mode === FccGlobalConstant.DRAFT_OPTION) {
              this.isMessageDraftReloadNeeded = true;
            }
            this.populateStateWithTransactionDetails();
            this.viewMaster = true;
          });
        } else {
          this.stateService.initializeState(this.productCode, false, reInit);
          this.setSectionList();
          if (this.tnxType === FccGlobalConstant.N002_INQUIRE && (this.option === FccGlobalConstant.ACTION_REQUIRED
            || this.mode === FccGlobalConstant.DISCREPANT || this.subTnxType === FccGlobalConstant.N002_SETTLE) &&
            this.tnxId !== undefined && this.tnxId !== null && this.mode !== FccGlobalConstant.VIEW_MODE &&
            this.productCode === FccGlobalConstant.PRODUCT_LC) {
             this.populateStateWithMasterDetails();
            } else {
             this.populateStateWithTransactionDetails();
            }
          this.viewMaster = true;
        }
      }
    } else {
      this.handleTransactionDetailsAndState();
    }
  }

  protected handleTransactionDetailsAndState() {
    this.stateService.initializeState(this.productCode);
    this.setSectionList();
    this.populateStateWithTransactionDetails();
  }

  loadForEvent(refId, tnxId, eventTypeCode, inputParam, stateTypeNotReq = false) {
    if (!stateTypeNotReq) {
      this.stateType = EnumMapping.stateTypeEnum.EVENTSTATE;
    }
    this.stateId = tnxId;
    this.refId = refId;
    this.tnxId = tnxId;
    const transactionDetails: TransactionDetails = {
      subTnxType: inputParam[FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE],
      tnxTypeCode: eventTypeCode,
      transactionTab: inputParam[FccGlobalConstant.transactionTab],
      eventTab: inputParam[FccGlobalConstant.eventTab],
      tnxStatCode: inputParam[FccGlobalConstant.eventTnxStatCode],
      actionReqCode: inputParam[FccGlobalConstant.eventActionReqCode],
      prodStatCode: inputParam[FccGlobalConstant.eventprodStatCode],
      stateType: EnumMapping.stateTypeEnum.EVENTSTATE
    };
    if (this.tnxId === '') {
      this.isMaster = true;
    } else {
      this.isMaster = false;
    }
    this.inquiryEventTab = transactionDetails.eventTab;
    transactionDetails.isMaster = this.isMaster;
    this.transactionDetailsMap.initializeMaps(tnxId, transactionDetails);
    //  this.handleStateInitialization();
    this.initProductModelAndState();
  }

  onClickView() {
    const dir = this.dir;
    this.translateService.get('corporatechannels').subscribe(() => {
      let viewPopUpTitle = this.translateService.instant('MASTER_DETAILS_HEADER');
      if (this.parent) {
        viewPopUpTitle = this.translateService.instant('PARENT_TRANS_DETAILS_HEADER');
      }
      const dialogHeader = this.translateService.instant(this.productService.getFormName(this.productCode, this.tnxType, this.subTnxType,
        this.subProductCode)).concat(' | ', this.refId).concat(' - ', viewPopUpTitle);
      this.dialogRef = this.dialogService.open(MasterViewDetailComponent, {
        data: {
          productCode: this.productCode,
          refId: this.refId,
          tnxId: this.parentTnxId ? this.parentTnxId : this.tnxId,
          enableHeader: true,
          accordionViewRequired: true,
          parent: this.parent,
          viewMaster: this.viewMaster,
          subTnxType: this.subTnxType
        },
        width: '70vw',
        header: dialogHeader,
        contentStyle: {
          height: '70vh',
          overflow: 'auto',
          backgroundColor: '#fff',
          direction: dir
        },
        styleClass: 'viewLayoutClass',
        showHeader: true,
        baseZIndex: 9999,
        autoZIndex: true,
        dismissableMask: true,
        closeOnEscape: true
      });
      this.productService.onClickView$.next(false);
    });
  }



  /**
   * TODO: Revisit for state refactoring when adding third state
   * TBD - identify scenarios to optimize state initialization
   * default true - existing behaviour
   *
   * handle Re-Initialize if,
   *  -state not initialized already
   *  -productcode is different
   *  -if refid is not same.
   *  -new initiation request
   *  -forced through re-init flag
   * @param reInit - force initialization flag
   */
  protected handleStateInitialization(reInit = true) {
    if (reInit) { // existing behaviour
      if (this.isMaster) {
        this.stateService.clearState(this.isMaster, this.stateType);
      }
      this.stateService.clearState(this.isMaster, this.stateType);
      this.initializeStateAndSectionValues(reInit);
    } else if (this.parent) {
      if (!this.stateService.isStateInitialized(this.parent) || this.commonService.currentStateRefId === this.refId) {
        if (this.parent) { // for the parent transaction in action required
          this.stateService.clearState(this.parent);
        }
        if (!this.commonService.isViewPopup && this.parent) { // temp
          this.stateService.clearState();
        }
        this.initializeStateAndSectionValues(reInit);
      }
    } else {
      if (!this.stateService.isStateInitialized(this.isMaster) || this.commonService.currentStateRefId === this.refId) {
        if (this.isMaster) {
          this.stateService.clearState(this.isMaster);
        }
        if (!this.commonService.isViewPopup && this.isMaster) { // temp
          this.stateService.clearState();
        }
        this.initializeStateAndSectionValues(reInit);
      }
    }
  }

  /**
   * initializes product models(FORM, EVENT, SubSection) from API and then initializes state.
   */
  public initProductModelAndState() {
    this.formModelService.getFormSubsectionAndEventModel(this.productCode, this.eventTnxTypeCode, this.eventSubTnxType)
      .subscribe(modelJson => {
        if (modelJson) {
          this.formModelService.subSectionJson = modelJson[1];
          this.stateService.initializeProductModel(modelJson[0], this.isMaster, this.stateType);
          this.stateService.initializeEventModel(modelJson[2], this.stateType);
          this.handleStateInitialization(this.reInit);

        }
      },
        // no permission or config, redirect to global dashboard
        () => {
          if (!this.commonService.getEnableUxAddOn()) {
            const dontShowRouter = 'dontShowRouter';
            let homeDojoUrl = '';
            if (!this.commonService.getEnableUxAddOn() && window[dontShowRouter] && window[dontShowRouter] === true) {
              homeDojoUrl = this.fccGlobalConstantService.contextPath;
              homeDojoUrl = homeDojoUrl + this.fccGlobalConstantService.servletName;
              homeDojoUrl = homeDojoUrl + '/screen?classicUXHome=true';
              window.open(homeDojoUrl, '_self');
            }
          } else {
            this.commonService.getDashboardUrl();
            this.router.navigate([this.commonService.globalDashboardUrl]);
          }
        });
  }



  // close dialog on navigation
  private closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    if (this.taskDialog) {
      this.taskDialog.close();
    }
  }

  onlineHelp() {
    if ((this.items[this.storeIndexValue]) === 'summaryDetails') {
      this.fccHelpService.helpsectionId.next(FccGlobalConstant.PREVIEW_DETAILS);
    } else {
      const sectionId = this.stateService.onlineHelpMap.get(this.items[this.storeIndexValue]);
      this.fccHelpService.helpsectionId.next(sectionId);
    }
  }

  // task pane event action
  onCreateTask() {
    const dir = this.dir;
    this.taskDialog = this.dialogService.open(TaskDialogComponent, {
      header: `${this.translateService.instant('createTask')}`,
      showHeader: true,
      closable: true,
      width: '65vw',
      height: '79vh',
      contentStyle: {
        overflow: 'auto', appendTo: 'body', blockScroll: true,
        direction: dir
      },
      style: { direction: this.dir },
      baseZIndex: 1000,
      autoZIndex: true,
      dismissableMask: false,
      closeOnEscape: true,
      styleClass: 'taskLayoutClass',
    });
  }

  populateStateAndGetMasterDetails(refId: string): Promise<any> {
    // section forms are initialised with related controls
    this.stateService.populateAllEmptySectionsInState(this.productCode);
    if (this.tnxType && this.tnxType === FccGlobalConstant.N002_AMEND && this.mode && this.operation &&
      this.mode === FccGlobalConstant.VIEW_MODE && this.operation === FccGlobalConstant.LIST_INQUIRY) {
      this.stateService.populateAllEmptySectionsInState(this.productCode, true);
    } else {
      this.stateService.populateAllEmptySectionsInState(this.productCode, this.isMaster);
    }
    // API call
    return new Promise((resolver) => {
      this.productMappingService.getApiModel(this.productCode).subscribe(apiMappingModel => {
        this.transactionDetailService.fetchTransactionDetails(refId).subscribe(response => {
          const responseObj = response.body;
          if (responseObj.parent_details) {
          if (responseObj.cross_references && responseObj.cross_references.cross_reference &&
            responseObj.cross_references.cross_reference.tnx_id && this.actionReqCode) {
            this.parentTnxId = responseObj.cross_references.cross_reference.tnx_id;
          } else if (responseObj.parent_details && responseObj.parent_details.ref_id) {
            this.commonService.setParentReference(responseObj.parent_details.ref_id);
            this.commonService.setParentTnxInformation(responseObj.parent_details);
          }
        }
        if (responseObj.child_details) {
          if (responseObj.cross_references && responseObj.cross_references.cross_reference &&
            responseObj.cross_references.cross_reference.child_tnx_id && this.actionReqCode) {
            this.childTnxId = responseObj.cross_references.cross_reference.child_tnx_id;
          } else if (responseObj.child_details && responseObj.child_details.ref_id) {
            this.commonService.setChildReference(responseObj.child_details.ref_id);
            this.commonService.setChildTnxInformation(responseObj.child_details);
          }
        }
          this.setState(responseObj, apiMappingModel, this.isMaster);
          resolver(responseObj);
        },
          () => {
            resolver('');
          });
      });
    });
  }

  loadTabsonInit(sectionData) {
    let type = '';
    let controlName = '';
    let data: any;
    let parentForm: FCCFormGroup;
    Object.keys(sectionData.controls).forEach(control => {
      const subSectionForm = sectionData.controls[control] as FCCFormGroup;
      if (subSectionForm.controls) {
        Object.keys(subSectionForm.controls).forEach(subSectionFormControl => {

          if ((subSectionForm.controls[subSectionFormControl][FccGlobalConstant.TYPE] !== undefined &&
            subSectionForm.controls[subSectionFormControl][FccGlobalConstant.TYPE] === 'tab') ||
            subSectionForm.controls[subSectionFormControl] instanceof FCCFormGroup) {
            type = subSectionFormControl;
            parentForm = sectionData.controls[control] as FCCFormGroup;

            if (subSectionForm.controls[subSectionFormControl][FccGlobalConstant.TYPE] === 'tab') {
              data = this.formControlService.getTabsValue(
                subSectionForm.controls[subSectionFormControl][FccGlobalConstant.PARAMS]
              );
            } else {
              data = subSectionForm.controls[subSectionFormControl];
            }
            controlName = subSectionFormControl;
            if (subSectionForm.controls[subSectionFormControl] instanceof FCCFormGroup) {
              this.loadTabContainerValues(type, parentForm, controlName, data);
            }
          }
        });
      } else if (subSectionForm[FccGlobalConstant.TYPE] === 'tab') {
        data = this.formControlService.getTabsValue(subSectionForm[FccGlobalConstant.PARAMS]);
      }
      if (sectionData.controls[control] instanceof FCCFormGroup) {
        type = control;
        parentForm = sectionData as FCCFormGroup;
        controlName = control;
        this.loadTabContainerValues(type, parentForm, controlName, data);
      }
    });
  }

  loadTabContainerValues(type, parentForm, controlName, data) {
    if (this.container2 !== undefined) {
      this.container2.data = data;
      this.container2.type = type;
      this.container2.parentForm = parentForm;
      this.container2.controlName = controlName;
      this.container2.ngOnInit();
      this.container2.state.ngOnInit();
    }
  }

  ngAfterViewChecked(){
    const pInplaceDiv: HTMLElement = this.elementRef.nativeElement.querySelector('.ui-inplace-display');
    if (pInplaceDiv){
      pInplaceDiv.removeAttribute('tabindex');
    }
    if(!this.isAccessibilityControlAdded) {
      this.addAccessibilityControl();
    }
  }

  addAccessibilityControl(): void {
    const progressBar =Array.from(document.getElementsByClassName('mat-progress-bar'));
    const progressBarTag = Array.from(document.getElementsByTagName('mat-progress-bar'));
    if(progressBar.length > 0 && progressBarTag.length > 0) {
      this.isAccessibilityControlAdded = true;
    }
    progressBar.forEach(element=> {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("progressBar");
      element[FccGlobalConstant.TITLE] = this.translateService.instant("progressBar");
    });
    progressBarTag.forEach(element => {
      element.removeAttribute('tabindex');
      element.setAttribute('tabindex', '0');
    });
  }

}
