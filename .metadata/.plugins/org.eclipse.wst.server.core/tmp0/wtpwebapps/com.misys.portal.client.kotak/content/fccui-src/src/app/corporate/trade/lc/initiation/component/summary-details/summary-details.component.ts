import { FileHandlingService } from './../../../../../../common/services/file-handling.service';
import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FccGlobalConstant } from '../../../../../../../app/common/core/fcc-global-constants';
import { FCCBase } from '../../../../../../base/model/fcc-base';
import { TableService } from '../../../../../../base/services/table.service';
import { CountryList } from '../../../../../../common/model/countryList';
import { TransactionDetails } from '../../../../../../common/model/TransactionDetails';
import { CommonService } from '../../../../../../common/services/common.service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { GroupClubService } from '../../../../../../common/services/group-club.service';
import { TabPanelService } from '../../../../../../common/services/tab-panel.service';
import { LendingCommonDataService } from '../../../../../../corporate/lending/common/service/lending-common-data-service';
import { ProductStateService } from '../../../common/services/product-state.service';
import { SaveDraftService } from '../../../common/services/save-draft.service';
import { TransactionDetailsMap } from '../../../common/services/transaction-map.service';
import { FilelistService } from '../../services/filelist.service';
import { FormControlService } from '../../services/form-control.service';
import { NarrativeService } from '../../services/narrative.service';
import { PreviewService } from '../../services/preview.service';
import { UtilityService } from '../../services/utility.service';
import { FCCFormControl, FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { AccordionControl, ExpansionPanelControl, SpacerControl } from './../../../../../../base/model/form-controls.model';
import { documentsHeader, feesAndChargesHeader, purchaseOrderCols, purchaseOrderLineItemCols, variationsHeader } from './../../../../../../common/model/review.model';
import { FormAccordionPanelService } from './../../../../../../common/services/form-accordion-panel.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { ShowDialogDirective } from '../../../../../../../app/common/components/listdef-popup/show-dialog.directive';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ListdefModalComponent } from '../../../../../../../app/common/components/listdef-modal/listdef-modal.component';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { FccConstants } from '../../../../../../common/core/fcc-constants';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import { UiProductService } from '../../../../../../corporate/trade/ui/services/ui-product.service';
import { SiProductService } from '../../../../../../corporate/trade/si/services/si-product.service';
interface ValueDetails {
  setContentWidth?: boolean;
  value?: string;
  type?: string;
  label?: string;
  clubbedHeader?: string;
  masterValue?: string;
  translateValue?: string;
  valStyleClass?: string;
  infolabel?: string;
  fullWidthView?: boolean;
  labelStyleClass?: string;
  labelOnly?: boolean;
  invalidValue?: boolean;
  clubbedInvalidField?: boolean;
  valueOnly?: boolean;
  isHyperLink?: boolean;
  amendCompare?: boolean;
  isNotRequiredForComparison?: boolean;
}

interface SectionDetails {
  section_name: string;
  field_names: string;
  field_value?: string;
  field_master_value?: string;
  field_clubbed?: boolean;
  infolabel?: string;
  field_name_non_transalated?: string;
}

// eslint-disable-next-line max-classes-per-file
class Queue extends Array {
  enqueue(val) {
    this.push(val);
  }

  masterEnqueue(val) {
    this.push(val);
  }

  dequeue() {
    return this.shift();
  }

  peek() {
    return this[0];
  }

  isEmpty() {
    return this.length === 0;
  }
}

@Component({
  selector: 'fcc-summary-details',
  templateUrl: './summary-details.component.html',
  styleUrls: ['./summary-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SummaryDetailsComponent }]
})
export class SummaryDetailsComponent extends FCCBase implements OnInit, AfterViewChecked, OnDestroy {
  form: FCCFormGroup;
  form1: FCCFormGroup;
  // summaryDetails: Map<string, FCCFormGroup>;
  productCode: any;
  subProductCode: any;
  module: any;
  productItems: Map<string, string[]>; // contains Map<SectionName, [FieldName]> from LcFormModel
  summaryDetailsMap: Map<string, Map<string, ValueDetails>>; // Map<SectionName, Map<FieldName, Value>>
  groupItemsMap: Map<string, Map<string, string[]>>; // contains Map<fieldName, Map<GroupHeader, [GroupChildern]>>
  clubbeItemsMap: Map<string, Map<string, string[]>>; // contains Map<FieldName, clubbedHeader, [clubbedList]>
  clubbedDetailsMap: Map<string, Map<string, ValueDetails>>; // Map<SectionName, Map<FieldName, Value>>
  clubbedTrueFields: string[] = [];
  amendClubbedTrueFields: string[] = [];
  dynamicCriteriaMap: Map<string, string>;
  tabSectionList: string[] = [];
  tabSectionControlMap: Map<string, Map<string, FCCFormControl>>; // Map<sectionName, Map<FieldName, FCCFormControl>>;
  singleRowFields: string[]; // [FieldName]
  fileDownloadMap: Map<string, FCCFormControl>; // Map<FieldName, FccFormControl>
  amendNarrativeItemsMap: Map<string, string[]>; // contains Map<SectionName, [FieldName]>
  licenseMap: Map<string, FCCFormControl>;
  accountDetailsMap: Map<string, FCCFormControl>;
  paymentBatchDetailsMap: Map<string, FCCFormControl>;
  cardDataMap: Map<string, FCCFormControl>;
  remInstMap: Map<string, FCCFormControl>;
  pOMap: Map<string, FCCFormControl>;
  amendNarrativeMap: Map<string, string[]>;
  viewDisplayItemsMap: Map<string, string[]>;
  panelValue: any;
  tabNumber: number;
  i: number; // number of spacer
  private transactionDetail: TransactionDetails; // TransactionDetail stored in MAP
  valid = 'valid';
  spacer = 'spacer';
  masters = 'master';
  submitId = 'submitForm';
  key = 'key';
  obj = {};
  accordionView = false;
  showDateField = true;
  isShipmentValue = false;
  shipmentSections: any[] = [];
  excludedforAmendFields: any[] = [];
  itemArray: any[] = [];
  groupArray: any[] = [];
  finalResult: string;
  sectionNames: string[];
  modeValue: any;
  index: any;
  mode: any;
  option: any;
  subTnxType: any;
  master: boolean;
  isTransferAssignee: boolean;
  tnxId: any;
  tnxTypeCode: any;
  eventRequired;
  accordionViewRequired: any;
  isMasterView: any;
  invalidValue = 'invalidValue';
  INVALID_KEY = 'INVALID';
  maxWordLimit = 31530;
  isMaster: any;
  operation: any;
  reviewTnxTypeCode: any;
  reviewSubTnxType: any;
  eventsForTransactionTab: any;
  transactionTab: any;
  eventTab: any;
  inquirySubTnxTypeCode: any;
  reviewTnxStateCode: any;
  eventTnxStatCode: any;
  stateType: any;
  isMasterRequired: any;
  isAmendComparison: any;
  stateId: any;
  transactionDetailtnxTypeCode;
  transactionDetailSubTnxType;
  transactionDetaileventTab;
  transactionDetailtransactionTab;
  transactionDetailisMaster;
  transactionDetailtnxStatCode;
  masterStyle: any;
  clubbedRendered: any;
  amendStyle: string;
  amendTnxStyle: string;
  masterAccordionVal: string;
  layoutValue = 'p-col-12 p-md-12 p-lg-12 p-xl-12 p-sm-12 padding_zero';
  tnxAccordionVal: string;
  accordionPanelControlMap: Map<string, Map<string, FCCFormControl>>; // Map<sectionName, Map<FieldName, FCCFormControl>>;
  innerControlArray: any[] = [];
  hideGrpHeaderList: string[]; // List of group headers to be hidden.
  clubbedChildList: string[] = [];
  isRemittanceLetter: boolean;
  enableLicenseSection: boolean;
  amendedValue: boolean = false;
  amendProductsList = [FccGlobalConstant.PRODUCT_LC, FccGlobalConstant.PRODUCT_SI, FccGlobalConstant.PRODUCT_BG,
    FccGlobalConstant.PRODUCT_EC];
  fcmOption: string;
  formDataObj = 'formData';
  readonly listOfFileUploadSections: string[] = ['fileUploadDetails', 'elFileUploadDetails', 'irFileUploadDetails',
  'sgFileUploadDetails', 'seFileUploadDetails', 'seHelpdeskFileUploadDetails', 'icFileUploadDetails',
  'seUploadFileUploadDetailsComponent',
  'tfAttachmentDetails', 'siFileUploadDetails', 'srFileUploadDetails',
  'ftTradeFileUploadDetails', 'elUploadMT700', 'ecFileUploadDetails', 'uiFileUploadDetails', 'UaFileUploadDetails',
  'liFileUploadDetails', 'customerAttachments', 'lnFileUploadDetails', 'lnrpnFileUploadDetails', 'customerAttachments',
  'bankAttachments', 'lncdsFileUploadDetails', 'blfpFileUploadDetails', 'bankAttachmentHeader'];

  readonly subProductsWhichDontNeedAmendInfoCheck: string[] = [FccGlobalConstant.SUB_PRODUCT_CODE_CSTD];
  readonly listOfLicenseSections: string[] = ['licenseDetails', 'elLicenseDetails', 'icLicenseDetails',
  'tfLicenseDetails', 'ftTradeLicenseDetails', 'ecLicenseDetails', 'uiLicenseDetails', 'uaLicenseDetails'];

  readonly listOfEventInqurySection: string[] = [FccGlobalConstant.eventDetails, FccGlobalConstant.bankMessageEvents];
  readonly previewFieldType = 'previewFieldType';
  readonly id = 'id';
  readonly rendered = 'rendered';
  readonly params = 'params';
  readonly feildType = 'feildType';
  readonly groupChildren = 'groupChildren';
  readonly grouphead = 'grouphead';
  readonly clubbedList = 'clubbedList';
  readonly clubbed = 'clubbed';
  readonly clubbedHeaderText = 'clubbedHeaderText';
  readonly previewScreen = 'previewScreen';
  readonly parentStyleClassStr = 'parentStyleClass';
  readonly label = 'label';
  readonly clubbedDelimiter = 'clubbedDelimiter';
  readonly options = 'options';
  readonly valueStr = 'value';
  readonly noDelete = 'noDelete';
  readonly hasActions = 'hasActions';
  readonly noEdit = 'noEdit';
  readonly inputTable = 'input-table';
  readonly inputEditTable = 'edit-table';
  readonly presentSection = 'presentSection';
  readonly dependSection = 'dependSection';
  readonly dependControl = 'dependControl';
  readonly requiredValue = 'requiredValue';
  readonly requiredValues = 'requiredValues';
  readonly swiftVersion = 'swiftVersion';
  readonly notRequiredValue = 'notRequiredValue';
  readonly dependendCondition = 'dependendCondition';
  readonly parentCondition = 'parentCondition';
  readonly condition = 'condition';
  readonly viceversaCheck = 'viceversaCheck';
  readonly renderCheck = 'renderCheck';
  readonly tnxTypecode = 'tnxTypeCode';
  readonly hideIfEmpty = 'hideIfEmpty';
  readonly columns = 'columns';
  readonly hideByProperty = 'hideByProperty';
  readonly data = 'data';
  readonly isSubsectionModel = 'isSubsectionModel';
  readonly hideFields = 'hideFields';
  readonly prefix = 'prefix';
  readonly NOLOCALIZATIONSTR = 'nolocalization';
  readonly fullWidth = FccGlobalConstant.FULL_WIDTH_VIEW;
  readonly setContentWidth = 'setContentWidth';
  readonly isNotRequiredForComparison = 'isNotRequiredForComparison';
  readonly labelOnly = FccGlobalConstant.LABEL_ONLY;
  readonly valueOnly = FccGlobalConstant.VALUE_ONLY;
  infolabel = 'infolabel';
  groupLabel = 'groupLabel';
  readonly nameStr = 'name';
  readonly typeStr = 'type';
  readonly layoutClassStr = 'layoutClass';
  readonly styleClassStr = 'styleClass';
  readonly previewCriteria = 'previewCriteria';
  readonly hideGrpHeaderInView = 'hideGrpHeaderInView';
  readonly tnxAmtStateCheck = 'tnxAmtStateCheck';
  readonly hideCheckbox = 'hideCheckbox';
  readonly statetype = 'stateType';
  readonly amendCompare = 'isNotRequiredForComparison';

  // Temporary regex check
  //eslint-disable-next-line no-useless-escape
  regex = /^[a-zA-Z0-9 :\,\/'?.+()\\r\\n=@#{!\"%&*;<>_-]*$/;
  GRID_LIST = 'p-grid p-col-12 p-md-12 p-lg-12 p-sm-12';
  GRID = 'p-grid';

  eventInqurySection = ['eventDetails', 'feesAndCharges', 'secondBeneDetails', 'amountDetailsEvents',
  'transferDetailsEvents', 'instToBank', 'bankMessageEvents', FccGlobalConstant.RELEASE_INSTRUCTION_SECTION,
  'bankInstructionsHeader', 'assigneeDetails', 'customerAttachments', 'lineBreakForMaster', FccGlobalConstant.BANK_ATTACHMENT,
   FccGlobalConstant.ADVICE_DISCREPANCY, FccGlobalConstant.PREVIOUS_ATTACHMENTS];

  eventTypeCode: any;
  subTnxTypeCode: any;
  amendPersistenceSave = 'amendPersistenceSave';
  currencyList: any;
  currencySymbolDisplayEnabled = false;
  exchangeRateConfig;
  @ViewChild(ShowDialogDirective) direc;
  dynamicHeaderField = new Map();
  referenceId;
  masterTransactionDetails: any;
  eventDetails: any;
  showAvailableAmount: any;
  renderedField: boolean = true;


  constructor(protected utilityService: UtilityService, protected translateService: TranslateService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected saveDraftService: SaveDraftService, protected formControl: FormControlService,
              protected previewService: PreviewService, protected stateService: ProductStateService,
              protected commonService: CommonService, protected groupClubService: GroupClubService,
              protected tabPanelService: TabPanelService, public uploadFile: FilelistService, protected router: Router,
              protected transactionDetailsMap: TransactionDetailsMap, protected formAccordionPanelService: FormAccordionPanelService,
              protected narrativeService: NarrativeService, protected lendingCommonDataService: LendingCommonDataService,
              protected taskService: FccTaskService, protected tableService: TableService, protected amendCommonService: AmendCommonService,
              public dialog: MatDialog, protected fileHandlingService: FileHandlingService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService,
              protected transactionDetailService: TransactionDetailService,
              protected activatedRoute: ActivatedRoute,
              protected siProductService: SiProductService) {
    super();
  }

  ngOnInit(): void {
    this.previewService.accordionData = this.eventInqurySection;
    window.scroll(0, 0);
    this.i = FccGlobalConstant.LENGTH_0;
    this.tabNumber = FccGlobalConstant.LENGTH_2; // number of items per row
    this.module = this.accordionViewRequired ? '' : `${this.translateService.instant('preview')}`;
    this.mode = this.commonService.getQueryParametersFromKey('mode');
    this.option = this.commonService.getQueryParametersFromKey('option');
    this.subTnxType = this.commonService.getQueryParametersFromKey('subTnxTypeCode');
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
    const referenceid = 'referenceid';
    const refId = 'refId';
    this.activatedRoute.queryParams.subscribe(params => {
      if(params && (params[referenceid] || params[refId])) {
        this.referenceId = (params[refId] !== undefined) ? params[refId] : params[referenceid];
      }
    });
    const params = {
			productCode : this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT),
			subProductCode : this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE)
		};
		this.commonService.getExchangeRateConfig(params).subscribe(res => {
			this.commonService.setExchangeRateConfiguration(res);
		});
    if (this.accordionViewRequired === 'true') {
      this.accordionView = true;
    } else {
      this.accordionView = false;
    }
    this.productCode = this.commonService.getQueryParametersFromKey('productCode');
    this.tnxId = this.commonService.getQueryParametersFromKey('tnxid');
    this.stateType = this.stateType;
    this.stateId = this.stateId;
    this.isMasterRequired = this.isMasterRequired;
    this.isAmendComparison = this.isAmendComparison;
    // review Screen
    this.transactionDetail = this.transactionDetailsMap.getSingleTransaction(this.stateId);


    if (this.commonService.isnonEMptyString(this.transactionDetail)) {
      this.transactionDetailtnxTypeCode = this.transactionDetail.tnxTypeCode;
      this.transactionDetailSubTnxType = this.transactionDetail.subTnxType;
      this.eventTab = this.transactionDetail.eventTab;
      this.transactionTab = this.transactionDetail.transactionTab;
      this.transactionDetailisMaster = this.transactionDetail.isMaster;
      this.transactionDetailtnxStatCode = this.transactionDetail.tnxStatCode;
      this.isMaster = this.transactionDetailisMaster;
    }

    this.operation = this.commonService.getQueryParametersFromKey ('operation');
    this.eventsForTransactionTab = this.commonService.getQueryParametersFromKey('eventsForTransactionTab');

    this.eventTypeCode = this.eventTypeCode !== undefined ? this.eventTypeCode : undefined;
    this.subTnxTypeCode = this.subTnxTypeCode !== undefined ? this.subTnxTypeCode : undefined;
    this.inquirySubTnxTypeCode = this.transactionDetailSubTnxType;

    if((this.transactionDetailtnxStatCode === FccGlobalConstant.N004_UNCONTROLLED ||
      this.transactionDetailtnxStatCode === FccGlobalConstant.N004_CONTROLLED)
      && this.mode == FccGlobalConstant.VIEW_MODE && this.operation === FccGlobalConstant.PREVIEW &&
      this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && this.amendProductsList.includes(this.productCode)){
        this.eventTab = false;
        this.amendedValue = true;
        this.commonService.hideamendtoggle = true;
    } else {
      this.amendedValue = false;
    } // 1. using this.amendedValue to control the specific behaviour
    this.currencySymbolDisplayEnabled = localStorage.getItem(FccGlobalConstant.CUR_SYMBOL_ENABLED) === 'y';
    if ((this.tnxId === '' && (this.eventTypeCode === undefined || this.eventTypeCode === ''))
    || this.commonService.isViewPopup || this.commonService.parent) {
      this.master = true;
     } else {
      this.master = false;
     }
    if (this.isMasterRequired) {
      this.master = true;
    }
    this.sectionNames = this.stateService.getSectionNames(this.master, this.stateType);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response) {
            this.enableLicenseSection = response.showLicenseSection;
            this.currencyList = response.currencyList;
            this.showAvailableAmount = response.showAvailableAmount;
        }
      });
      if(this.productCode === FccGlobalConstant.PRODUCT_LC ||
        this.productCode === FccGlobalConstant.PRODUCT_SI ||
        this.productCode === FccGlobalConstant.PRODUCT_EC ||
        this.productCode === FccGlobalConstant.PRODUCT_BG){
          this.masterTransactionDetails = this.commonService.masterTnxResponse;
      }
      this.setProductItemsMap(this.productCode);
  }

  removeLastChildOutline(remove){
    const element = document.getElementsByClassName('ui-table-thead')[0];
    if (element){
      if(remove){
        element.classList.add("hide-outline");
      }else{
        element.classList.remove("hide-outline");
      }
    }
  }
  ngAfterViewChecked(): void {
    if(this.option === FccGlobalConstant.PAYMENTS){
      this.removeLastChildOutline(true);
    }
    this.addIdToMatPanelBody();
  }
  isAmendScreenControl(): boolean {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    if ((tnxTypeCode === FccGlobalConstant.N002_AMEND || this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND)
        && !this.eventTab && ( subTnxTypeCode !== FccGlobalConstant.N003_AMEND_RELEASE)
         && subTnxTypeCode !== FccGlobalConstant.N003_INCREASE
         && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN && !this.amendedValue) {
      return true;
    } else if ((tnxTypeCode === FccGlobalConstant.N002_AMEND || this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) &&
      this.eventTab && this.operation === FccGlobalConstant.PREVIEW &&
      (subTnxTypeCode !== FccGlobalConstant.N003_AMEND_RELEASE)
      && subTnxTypeCode !== FccGlobalConstant.N003_INCREASE
      && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN&& !this.amendedValue){
      return true;
    }
    return false;
  }

  // creates Map<Section Name, [Field names]> from LcFormModel
  public setProductItemsMap(productCode: string) {
    this.productItems = new Map();
    this.tabSectionControlMap = new Map();
    this.accordionPanelControlMap = new Map();
    this.amendNarrativeItemsMap = new Map();
    this.amendNarrativeMap = new Map();
    this.viewDisplayItemsMap = new Map();

    this.formModelService.getFormModel(productCode, this.eventTypeCode, this.subTnxTypeCode).subscribe(modelJson => {
      this.accordionView = modelJson.isAccordionView !== undefined ? (modelJson.isAccordionView) : this.accordionView;
      this.showDateField = modelJson.showPreviewDateField !== undefined ? (modelJson.showPreviewDateField) : this.showDateField;
      if (this.isAmendComparison) {
        this.accordionView = false;
      }
      //setting initSummary through this block of code is the normal behaviour but we need to redirect it
      if (this.operation === 'LIST_INQUIRY' || (this.operation === 'PREVIEW' && !this.amendedValue) || this.commonService.parent) {
        this.formModelService.getFormModelForEvent().subscribe(eventModelJson => {
          if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND)
            && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
            && this.subTnxType !== FccGlobalConstant.N003_INCREASE
            && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN) {
            this.handleNarrativeGroupChildrenMap(productCode);
          }
          if((this.productCode === FccGlobalConstant.PRODUCT_TD || this.productCode === FccGlobalConstant.PRODUCT_FT)
            && (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_CODE_CSTD || this.subProductCode === FccGlobalConstant.FT_TPT)) {
              this.getExchangeFields(modelJson);
            }
          this.groupClubService.setEventModel(eventModelJson);
          this.groupClubService.initializeMaps(modelJson);
          this.initGroupService();
          this.addSection(eventModelJson, this.option, this.inquirySubTnxTypeCode, this.mode, this.tnxTypeCode);
          if (this.operation !== undefined && (this.operation === 'LIST_INQUIRY' || this.operation === 'PREVIEW')) {
            this.addSection(modelJson, this.option, this.inquirySubTnxTypeCode, this.mode, this.tnxTypeCode);
        } else {
          this.addSection(modelJson, this.option, this.subTnxType, this.mode, this.tnxTypeCode);
        }
          this.initSummary();
        });
      } else {
        if (this.operation !== undefined && this.operation === 'LIST_INQUIRY') {
          this.addSection(modelJson, this.option, this.inquirySubTnxTypeCode, this.mode, this.tnxTypeCode);
        } else {
          if((this.productCode === FccGlobalConstant.PRODUCT_TD || this.productCode === FccGlobalConstant.PRODUCT_FT)
            && (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_CODE_CSTD || this.subProductCode === FccGlobalConstant.FT_TPT)) {
            this.getExchangeFields(modelJson);
          }
          this.groupClubService.initializeMaps(modelJson, this.amendedValue);
          this.initGroupService();
          this.addSection(modelJson, this.option, this.subTnxType, this.mode, this.tnxTypeCode);
          this.initSummary();
        }
      }
    });
  }

  handleNarrativeGroupChildrenMap(productCode: any) {
    switch (productCode) {
    case FccGlobalConstant.PRODUCT_LC:
        this.form1 = this.stateService.getSectionData(FccGlobalConstant.NARRATIVE_DETAILS);
        this.narrativeService.expansionPanelSplitValueLC(this.form1);
        break;
    case FccGlobalConstant.PRODUCT_SI:
        this.form1 = this.stateService.getSectionData(FccGlobalConstant.SI_NARRATIVE_DETAILS);
        this.narrativeService.expansionPanelSplitValueSI(this.form1);
        break;
    case FccGlobalConstant.PRODUCT_EL:
      this.form1 = this.stateService.getSectionData(FccGlobalConstant.NARRATIVE_DETAILS, null, null, FccGlobalConstant.EVENT_STATE);
      break;
    default:
        break;
    }
  }

  onClickSummary() {
    const tnxId = '';
    const tnxTypeCode = '';
    const eventTnxStatCode = '';
    const subTnxTypeCode = '';
    let parentTnxObj;
    let parentRefID = '';
    let parentProductCode = '';
    let subProductCode = '';
    let childTnxObj;
    let childRefID = '';
    let childProductCode = '';

    this.commonService.getParentTnxInformation().subscribe(
      (parentTnx: string) => {
        parentTnxObj = parentTnx;
      }
    );
    this.commonService.getChildTnxInformation().subscribe(
      (childTnx: string) => {
        childTnxObj = childTnx;
      }
    );
    if (parentTnxObj) {
      parentProductCode = parentTnxObj[FccGlobalConstant.PRODUCTCODE];
      parentRefID = parentTnxObj[FccGlobalConstant.CHANNELREF];
      subProductCode = parentTnxObj[FccGlobalConstant.subProductCode] == null ? '' : parentTnxObj[FccGlobalConstant.subProductCode];
    } else {
      this.commonService.getParentReferenceAsObservable().subscribe(
        (parentRef: string) => {
          parentRefID = parentRef;
        }
      );
    }

    if (childTnxObj) {
      childProductCode = childTnxObj[FccGlobalConstant.PRODUCTCODE];
      childRefID = childTnxObj[FccGlobalConstant.CHANNELREF];
      subProductCode = childTnxObj[FccGlobalConstant.subProductCode] == null ? '' : childTnxObj[FccGlobalConstant.subProductCode];
    } else {
      this.commonService.getChildReferenceAsObservable().subscribe(
        (childRef: string) => {
          childRefID = childRef;
        }
      );
    }

    if(this.commonService.isnonEMptyString(parentRefID)) {
    this.commonService.openParentTransactionPopUp(parentProductCode, parentRefID, subProductCode,
      tnxId, tnxTypeCode, eventTnxStatCode, subTnxTypeCode);
    }

    if(this.commonService.isnonEMptyString(childRefID)) {
      this.commonService.openChildTransactionPopUp(childProductCode, childRefID, subProductCode,
        tnxId, tnxTypeCode, eventTnxStatCode, subTnxTypeCode);
    }
  }

  protected initGroupService() {
    this.groupItemsMap = this.groupClubService.getSubGroupMap();
    this.clubbeItemsMap = this.groupClubService.getClubbedFieldMap();
    this.clubbedTrueFields = this.groupClubService.getClubbedTrueFields();
    this.amendClubbedTrueFields = this.groupClubService.getAmendClubbedTrueFields();
    this.dynamicCriteriaMap = this.groupClubService.getDynamicCretiraFields();
    this.hideGrpHeaderList = this.groupClubService.getHideGrpHeaderList();
  }

  protected initSummary() {
    this.initializeSummaryDetailsMap();
    this.checkSectionEmpty();
    this.initializeFormGroup();
  }

  addSection(modelJson, option , subTnxType, mode, tnxTypeCode) {
    Object.keys(modelJson).forEach(section => {
      if (typeof modelJson[section] === 'object') {
        const addSection = this.stateService.checkApplicableSections(modelJson[section], option, subTnxType, mode,
          tnxTypeCode, this.stateId, this.commonService.parent);
        const form = this.stateService.getSectionData(section, undefined, this.master, this.stateType);
        const renderDynamicSection = this.checkSectionDynamicCriteria(form);
        const isEnabledByConfiguration = this.checkSectionConfiguration(form, section);
        if (addSection && renderDynamicSection && isEnabledByConfiguration) {
          if (!(this.isAmendComparison && modelJson[section].notRequiredForAmendComparison))
          {
            this.addSectionNameToProductItems(section, modelJson, addSection);
          }
        }
      }
    });
  }

  addSectionNameToProductItems(section, modelJson, addSection) {
    this.productItems.set(section, []);
    if (this.tabPanelService.isTabPanel(modelJson[section])) {
      this.setTabControls(section);
    } else if (this.formAccordionPanelService.isFormAccordionPanel(modelJson[section], undefined, undefined)) {
      this.setFormAccordionControls(section);
    }
    else if (modelJson[section][this.id]) {
      this.amendNarrativeItemsMap.set(section, []);
      this.amendNarrativeMap.set(section, []);
      if (this.stateService.getSectionData(section) !== undefined) {
        const controls = this.checkSection(section) ? this.stateService.getSectionData(section).controls :
        this.formControlService.getFormControls(modelJson[section], this.stateId).controls;
        Object.keys(controls).forEach(control => {
          const presentControl = controls[control] as FCCFormControl;
          this.checkDynamicControl(control);
          const fieldName = controls[control][this.key];
          const isGroupField = controls[control][this.params][this.grouphead];
          let previewScreen: boolean;
           // Use previewCriteria when we need to display fields conditionally in preview stepper.
          const previewCriteria = controls[control][this.params][this.previewCriteria];
          const isPreview = this.mode === FccGlobalConstant.INITIATE || this.mode === FccGlobalConstant.DRAFT_OPTION ||
              this.mode === FccGlobalConstant.EXISTING;
          if (isPreview && previewCriteria && previewCriteria !== undefined && previewCriteria instanceof Object) {
            this.checkPreviewDynamicCriteria(section, control, previewCriteria);
            previewScreen = controls[control][this.params][this.previewScreen];
          } else {
            previewScreen = controls[control][this.params][this.previewScreen];
            previewScreen = previewScreen === false ? false : true;
          }

          if (controls[control][FccGlobalConstant.TYPE] === FccGlobalConstant.expansionPanelTable) {
            if ((this.transactionDetail && this.transactionDetail.tnxTypeCode
              && this.transactionDetail.tnxTypeCode === FccGlobalConstant.N002_NEW)
              || ((this.mode === FccGlobalConstant.INITIATE || this.mode === FccGlobalConstant.DRAFT_OPTION)
                  && this.tnxTypeCode === FccGlobalConstant.N002_NEW)) {
              previewScreen = true;
            } else {
              previewScreen = false;
            }
          }

          if (fieldName && (!isGroupField || controls[control][this.params][FccConstants.ENRICHMENT]) && previewScreen && addSection) {
            this.setSingleRowFieldsMap(fieldName, presentControl);
            this.setFileDownloadMap(section, fieldName, presentControl);
            this.setLicenseMap(fieldName, presentControl);
            this.setCardDataMap(fieldName, presentControl);
            this.setRemInstMap(section, fieldName, presentControl);
            this.setPOMap(section, fieldName, presentControl);
            this.setAccountDetailsMap(fieldName, presentControl);
            this.setPaymentBatchDetailsMap(fieldName, presentControl);
            this.productItems.get(section).push(fieldName);
          } else if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND
              || this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND)
            && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
            && this.subTnxType !== FccGlobalConstant.N003_INCREASE
            && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN
            && this.eventTab &&
            controls[control][this.params] && controls[control][this.params][FccGlobalConstant.AMEND_TABBED_PANEL] &&
            this.operation === FccGlobalConstant.LIST_INQUIRY &&
            this.productItems.get(section).indexOf(fieldName) === -1
            && this.amendNarrativeMap.get(section).indexOf(fieldName) === -1 ) {
              this.productItems.get(section).push(fieldName);
          }
        });
      }
    }
  }

  checkSection(section: any) {
    return section === FccConstants.INSTRUMENT_GENERAL_DETAILS || FccConstants.BATCH_GENERAL_DETAILS;
  }

  setTabControls(sectionName: string) {
    this.amendNarrativeItemsMap.set(sectionName, []);
    this.amendNarrativeMap.set(sectionName, []);
    this.tabPanelService.initializeMaps(sectionName, this.stateService.getSectionData(sectionName, undefined, this.master, this.stateType));
    this.tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
    if (this.tabSectionControlMap.has(sectionName)) {
      for (const [fieldName, control] of this.tabSectionControlMap.get(sectionName)) {
        this.checkDynamicControl(fieldName);
        this.checkNarrativeSectionToEnableCurrentAmendment(fieldName, control);
        const isGroupField = control[this.params][this.grouphead];
        let previewScreen = control[this.params][this.previewScreen];
        previewScreen = previewScreen === false ? false : true;
        if (fieldName && !isGroupField && previewScreen) {
          this.setSingleRowFieldsMap(fieldName, control);
          this.setFileDownloadMap(sectionName, fieldName, control);
          this.setLicenseMap(fieldName, control);
          this.setRemInstMap(sectionName, fieldName, control);
          this.setPOMap(sectionName, fieldName, control);
          if (this.productItems.get(sectionName).indexOf(fieldName) === -1) {
            this.productItems.get(sectionName).push(fieldName);
          }
          if((this.productCode === FccGlobalConstant.PRODUCT_LC ||
              this.productCode === FccGlobalConstant.PRODUCT_SI ||
              this.productCode === FccGlobalConstant.PRODUCT_EC ||
              this.productCode === FccGlobalConstant.PRODUCT_BG) &&
            (this.operation === FccGlobalConstant.PREVIEW ||
            this.operation === FccGlobalConstant.LIST_INQUIRY) &&
            (sectionName === FccGlobalConstant.NARRATIVE_DETAILS ||
            sectionName === FccGlobalConstant.SI_NARRATIVE_DETAILS)&&
            this.commonService.isnonEMptyString(control.value)){
            this.handleNarrativeSection(fieldName, control, this.tabSectionControlMap.get(sectionName));
          }
        }
        const controlDetails = this.tabSectionControlMap.get(sectionName).get(fieldName);
        if (controlDetails[this.params][FccGlobalConstant.AMEND_NARRATIVE_CLUB] && this.isAmendScreenControl()) {
          this.amendNarrativeItemsMap.get(sectionName).push(fieldName);
          this.handleAmendNarrativeMap(sectionName, fieldName);
          if (this.singleRowFields.indexOf(fieldName) === -1
            && controlDetails[this.params][FccGlobalConstant.PREVIOUS_SINGLE_ROW]) {
            this.singleRowFields.push(fieldName);
          }
        } else if (controlDetails[this.params][FccGlobalConstant.INQUIRY_MAP] && this.operation === FccGlobalConstant.LIST_INQUIRY &&
          this.productItems.get(sectionName).indexOf(fieldName) === -1
          && this.amendNarrativeMap.get(sectionName).indexOf(fieldName) === -1) {
          this.amendNarrativeMap.get(sectionName).push(fieldName);
        }
      }
    }
  }

  checkNarrativeSectionToEnableCurrentAmendment(fieldName, control){
    if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND) &&
        (this.productCode === FccGlobalConstant.PRODUCT_LC ||
        this.productCode === FccGlobalConstant.PRODUCT_SI ||
        this.productCode === FccGlobalConstant.PRODUCT_EC ||
        this.productCode === FccGlobalConstant.PRODUCT_BG) &&
        (this.operation === FccGlobalConstant.PREVIEW ||
        this.operation === FccGlobalConstant.LIST_INQUIRY)) {
      if((FccGlobalConstant.AMEND_NARRATIVE_READ_FILEDS.includes(fieldName)) &&
        this.commonService.isnonEMptyString(control.value))
      {
        control[this.params][FccGlobalConstant.RENDERED] = true;
        control[this.params][FccGlobalConstant.PREVIEW_SCREEN] = true;
        control[this.params][FccGlobalConstant.PREVIOUS_SINGLE_ROW] = true;
        control[this.params][FccGlobalConstant.MASTER_VALUE] = FccGlobalConstant.EMPTY_STRING;
        if (this.singleRowFields.indexOf(fieldName) === -1) {
          this.singleRowFields.push(fieldName);
        }
      }
      control.updateValueAndValidity();
    }
  }

  handleNarrativeSection(fieldName, control, sectionControlMap){
    if((fieldName === FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DESC_OF_GOODS_TEXT
      || fieldName === FccGlobalConstant.EC_DESC_OF_GOODS_TEXT)
      && this.masterTransactionDetails !== undefined){
      const descOfGoodsTextMasterVal = this.masterTransactionDetails['narrative_description_goods'];
      control.setValue(this.previewService.formMasterNarrativeValue(descOfGoodsTextMasterVal));
      control[this.params][FccGlobalConstant.MASTER_VALUE] = descOfGoodsTextMasterVal;
    }
    if(fieldName === FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DOC_REQ_TEXT
      && this.masterTransactionDetails !== undefined){
      const docRequiredTextMasterVal = this.masterTransactionDetails['narrative_documents_required'];
      control.setValue(this.previewService.formMasterNarrativeValue(docRequiredTextMasterVal));
      control[this.params][FccGlobalConstant.MASTER_VALUE] = docRequiredTextMasterVal;
    }
    if(fieldName === FccGlobalConstant.NAR_TAB_NESTED_CONTROL_ADD_INST_TEXT
      && this.masterTransactionDetails !== undefined){
      const addInstructionTextMasterVal =
        this.previewService.formMasterNarrativeValue(this.masterTransactionDetails['narrative_additional_instructions']);
      control.setValue(addInstructionTextMasterVal);
      control[this.params][FccGlobalConstant.MASTER_VALUE] = this.masterTransactionDetails['narrative_additional_instructions'];
    }
    if(fieldName === FccGlobalConstant.NAR_TAB_NESTED_CONTROL_SPECIAL_BENE_TEXT
      && this.masterTransactionDetails !== undefined){
      const splPaymentBeneTextMasterVal =
        this.previewService.formMasterNarrativeValue(this.masterTransactionDetails['narrative_special_beneficiary']);
      control.setValue(splPaymentBeneTextMasterVal);
      control[this.params][FccGlobalConstant.MASTER_VALUE] = this.masterTransactionDetails['narrative_special_beneficiary'];
    }

    if(FccGlobalConstant.AMEND_NARRATIVE_READ_FILEDS.includes(fieldName) &&
    this.commonService.isnonEMptyString(control.value) && control.value.includes('verb')){
      const currentNarrativeValue = this.previewService.formCurrentNarrativeValue(control);
      control.setValue(currentNarrativeValue);
      control[this.params][FccGlobalConstant.MASTER_VALUE] = currentNarrativeValue;
    }
    control.updateValueAndValidity();
    control.setValue(this.commonService.decodeHtml(control.value));
    for (const [field, control] of sectionControlMap) {
      if(FccGlobalConstant.AMEND_NARRATIVE_READ_FILEDS.includes(field) &&
      !this.commonService.isnonEMptyString(control.value)){
        control[this.params][FccGlobalConstant.RENDERED] = false;
        control.updateValueAndValidity();
      }
      if(FccGlobalConstant.AMEND_NARRATIVE_EDIT_FILEDS.includes(field)){
        control[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
        control[this.params][FccGlobalConstant.RENDERED] = false;
        control.updateValueAndValidity();
      }
    }
  }

  protected handleAmendNarrativeMap(sectionName: string, fieldName: string) {
    if (this.amendNarrativeMap.get(sectionName).indexOf(fieldName) === -1) {
      this.amendNarrativeMap.get(sectionName).push(fieldName);
    }
  }

  setFormAccordionControls(sectionName: string) {
    this.amendNarrativeItemsMap.set(sectionName, []);
    const sectionForm = this.stateService.getSectionData(sectionName, undefined, this.master, this.stateType);
    this.formAccordionPanelService.initializeFormAccordionMap(sectionName,
      this.stateService.getSectionData(sectionName, undefined, this.master, this.stateType));
    this.accordionPanelControlMap = this.formAccordionPanelService.getAccordionSectionControlMap();
    if (this.accordionPanelControlMap.has(sectionName)) {
      const accordionSubSectionsListMap = this.formAccordionPanelService.getAccordionSubSectionListMap();
      const accordionSubSectionsList = accordionSubSectionsListMap.get(sectionName);
      accordionSubSectionsList.forEach(subSection => {
      const subSectionForm = sectionForm.controls[subSection] as FCCFormGroup;
      if (this.checkSectionDynamicCriteria(subSectionForm)) {
      Object.keys(subSectionForm.controls).forEach(fieldName => {
        const control = this.accordionPanelControlMap.get(sectionName).get(fieldName);
        if (control !== undefined) {
        this.checkDynamicControl(fieldName);
        const isGroupField = control[this.params][this.grouphead];
        let previewScreen = control[this.params][this.previewScreen];
        let rendered = control[this.params][this.rendered];
        rendered = rendered === false ? false : true;
        previewScreen = previewScreen === false ? false : true;
        if (control.type === 'form-table') {
          previewScreen = rendered;
        }
        if (fieldName && !isGroupField && previewScreen ) {
          this.setSingleRowFieldsMap(fieldName, control);
          this.setFileDownloadMap(sectionName, fieldName, control);
          this.setFileDownloadMap(sectionName, fieldName, control);
          this.setLicenseMap(fieldName, control);
          this.setRemInstMap(sectionName, fieldName, control);
          this.setPOMap(sectionName, fieldName, control);
          this.productItems.get(sectionName).push(fieldName);
        }
        if (control && control[this.params][FccGlobalConstant.AMEND_NARRATIVE_CLUB] && this.isAmendScreenControl()) {
          this.amendNarrativeItemsMap.get(sectionName).push(fieldName);
          if (this.singleRowFields.indexOf(fieldName) === -1
              && control[this.params][FccGlobalConstant.PREVIOUS_SINGLE_ROW]) {
            this.singleRowFields.push(fieldName);
          }
        }
    }
  });
}
});
    }
  }

  setSingleRowFieldsMap(fieldName: string, control: FCCFormControl) {
    const allowedCharCount = 'allowedCharCount';
    const maxlength = 'maxlength';
    if (this.singleRowFields === undefined) {
      this.singleRowFields = [];
    }
    // Push the field if its not already present in the array and if it is rendered = true;
    if (control && control !== undefined && control[this.params][this.rendered] && this.singleRowFields.indexOf(fieldName) === -1) {
      const fullWidth = control[this.params][this.fullWidth];
      if ((control[this.params][allowedCharCount] && Number(control[this.params][allowedCharCount]) > this.maxWordLimit) ||
      (control[this.params][maxlength] && Number(control[this.params][maxlength]) > this.maxWordLimit) || fullWidth) {
      this.singleRowFields.push(fieldName);
    }
  }
  }
  setFileDownloadMap(section: string, fieldName: string, control: FCCFormControl) {
    if (this.fileDownloadMap === undefined) {
      this.fileDownloadMap = new Map();
    }
    if (control.type === this.inputTable || control.type === FccGlobalConstant.FORM_TABLE ||
      control[this.params][this.previewFieldType] === this.inputTable) {
      if (control[FccGlobalConstant.PARAMS][FccGlobalConstant.CHECKBOX_REQUIRED]) {
        const sectionForm: FCCFormGroup = this.stateService.getSectionData(section);
        if (sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW]
          && sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW].length > 0) {
          this.fileDownloadMap.set(fieldName, control);
        }
      } else {
        this.fileDownloadMap.set(fieldName, control);
      }
    }
  }

  setCardDataMap(fieldName: string, control: FCCFormControl) {
    if (this.cardDataMap === undefined) {
      this.cardDataMap = new Map();
    }
    if (control.type === FccGlobalConstant.MAT_CARD) {
      this.cardDataMap.set(fieldName, control);
    }
  }

  setLicenseMap(fieldName: string, control: FCCFormControl) {
    if (this.licenseMap === undefined) {
      this.licenseMap = new Map();
    }
    if (control.type === this.inputEditTable && fieldName !== 'accountListTable') {
      this.licenseMap.set(fieldName, control);
    }
  }

  setAccountDetailsMap(fieldName: string, control: FCCFormControl) {
    if (this.accountDetailsMap === undefined) {
      this.accountDetailsMap = new Map();
    }
    if (control.type === this.inputEditTable && fieldName === 'accountListTable') {
      this.accountDetailsMap.set(fieldName, control);
    }
  }

  setPaymentBatchDetailsMap(fieldName: string, control: FCCFormControl) {
    if (this.paymentBatchDetailsMap === undefined) {
      this.paymentBatchDetailsMap = new Map();
    }
    if (control.type === this.inputEditTable && fieldName === 'paymentsTable') {
      this.paymentBatchDetailsMap.set(fieldName, control);
    }
  }

  setPOMap(section: string, fieldName: string, control: FCCFormControl) {
    if (this.pOMap === undefined) {
      this.pOMap = new Map();
    }
    if (control.type === 'card-summary') {
      if ((this.mode === FccGlobalConstant.INITIATE || this.mode === FccGlobalConstant.DRAFT_OPTION)
          && this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const sectionForm: FCCFormGroup = this.stateService.getSectionData(section);
          this.pOMap.set(fieldName, control);
      } else {
        this.pOMap.set(fieldName, control);
      }
    }
  }

  setRemInstMap(section: string, fieldName: string, control: FCCFormControl) {
    if (this.remInstMap === undefined) {
      this.remInstMap = new Map();
    }
    if (control.type === 'expansion-panel-table') {
      if ((this.mode === FccGlobalConstant.INITIATE || this.mode === FccGlobalConstant.DRAFT_OPTION)
          && this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
        const sectionForm: FCCFormGroup = this.stateService.getSectionData(section);
        const remittanceFlag = sectionForm.controls[FccGlobalConstant.remittanceFlag]
          && sectionForm.controls[FccGlobalConstant.remittanceFlag].value ?
          sectionForm.controls[FccGlobalConstant.remittanceFlag].value : false;
        const selectedRow = sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW];
        if ((remittanceFlag === 'mandatory' || remittanceFlag === 'true')
            && (selectedRow && (selectedRow.accountNumber || selectedRow.description))) {
          this.remInstMap.set(fieldName, control);
        }
      } else {
        this.remInstMap.set(fieldName, control);
      }
    }
  }

  initializeSummaryDetailsMap() {
    this.summaryDetailsMap = new Map();
    this.clubbedDetailsMap = new Map();

    this.sectionNames.forEach(sectionName => {
      if (this.tabPanelService.getTabSectionList().indexOf(sectionName) !== -1 && this.tabSectionControlMap.has(sectionName)
          && this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) === -1) {
        const controls: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [key, control] of this.tabSectionControlMap.get(sectionName)) {
          controls.push(control);
        }
        this.iterateMapControl(sectionName, controls);
      } else if (this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) !== -1 &&
      this.accordionPanelControlMap.has(sectionName)) {
        const sectionForm = this.stateService.getSectionData(sectionName, undefined, this.master, this.stateType);
        this.updateAmountFormatting(sectionName, sectionForm);
        const accordionSubSectionsListMap = this.formAccordionPanelService.getAccordionSubSectionListMap();
        const accordionSubSectionAndControlsListMap = this.formAccordionPanelService.getAccordionSubSectionAndControlsListMap();
        const subSectionList = accordionSubSectionsListMap.get(sectionName);
        const subSectionControlsMap = accordionSubSectionAndControlsListMap.get(sectionName);
        const controls: any[] = [];
        subSectionList.forEach(subSection => {
          const subSectionForm = sectionForm.controls[subSection] as FCCFormGroup;
          if (subSectionForm[this.rendered] !== false) {
          const subSectionControls = subSectionControlsMap.get(subSection);
          controls.push(subSectionControls);
          }
        });

        this.iterateMapControl(sectionName, controls);
      } else {
        if (this.stateService.isStateSectionSet(sectionName, this.master, this.stateType)) {
          const sectionForm: FCCFormGroup = this.stateService.getSectionData(sectionName, undefined, this.master, this.stateType);
          if (sectionForm) {
            this.updateAmountFormatting(sectionName, sectionForm);
            this.iterateMapControl(sectionName, sectionForm.controls);
          }
        }
      }
    });
  }

  updateAmountFormatting(sectionName, sectionForm) {
    const fields = [FccGlobalConstant.TD_CURRENCY, FccGlobalConstant.CURRENCY_TDUP,
    FccGlobalConstant.DEBIT_ACCOUNT_CURCODE, FccGlobalConstant.AMOUNT_FIELD, FccGlobalConstant.TD_AMOUNT,
    FccGlobalConstant.AVAILABLE_AMOUNT_DRAFT, FccGlobalConstant.WITHDRAWAL_AMOUNT, FccGlobalConstant.MATURITY_AMOUNTUP,
    FccGlobalConstant.MATURITY_AMOUNT_DISPLAY, FccGlobalConstant.AVAILABLE_AMOUNT_DISPLAY];
    let curCode = '';
    for (let i = 0; i < fields.length; i++ ) {
      if ((sectionName === FccGlobalConstant.eventDetails && fields[i] === FccGlobalConstant.TD_CURRENCY)
      || ((sectionName === FccGlobalConstant.TRANSACTION_DETAILS || sectionName === FccGlobalConstant.tdCstdUpdateGeneralDetails)
      && (fields[i] === FccGlobalConstant.CURRENCY_TDUP))
      || (sectionName === FccGlobalConstant.tdCstdGeneralDetails && fields[i] === FccGlobalConstant.DEBIT_ACCOUNT_CURCODE)) {
        curCode = sectionForm.get(fields[i])?.value;
      } else {
        let val = sectionForm.get(fields[i])?.value;
        if (sectionName === FccGlobalConstant.tdCstdUpdateGeneralDetails && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
          curCode = sectionForm.get(FccGlobalConstant.CURRENCY_TD)?.value.trim();
          if (!this.commonService.isnonEMptyString(curCode)){
            curCode = sectionForm.get(FccGlobalConstant.CURRENCY_TDUP)?.value.trim();
          } else if (!this.commonService.isnonEMptyString(sectionForm.get(FccGlobalConstant.CURRENCY_TDUP)?.value.trim())) {
            curCode = sectionForm.get(FccGlobalConstant.TD_CURRENCY)?.value.trim();
          }
        }
        if(this.commonService.isnonEMptyString(curCode) && this.commonService.isnonEMptyString(val)) {
          val = this.commonService.replaceCurrency(val);
          val = this.currencyConverterPipe.transform(val.toString(), curCode);
          if (sectionName !== FccGlobalConstant.TRANSACTION_DETAILS && (fields[i] === FccGlobalConstant.WITHDRAWAL_AMOUNT
            || fields[i] === FccGlobalConstant.MATURITY_AMOUNT_DISPLAY || fields[i] === FccGlobalConstant.AVAILABLE_AMOUNT_DISPLAY))
            {
              if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_INQUIRE
              && fields[i] === FccGlobalConstant.WITHDRAWAL_AMOUNT) {
                sectionForm.get(fields[i]).setValue(val);
              } else {
                sectionForm.get(fields[i]).setValue(curCode.concat(' ').concat(val));
              }
            } else {
              sectionForm.get(fields[i]).setValue(val);
            }
          }
        }
      }
    }

  iterateMapControl(sectionName: string, fieldsControl) {
    if (fieldsControl && this.productItems.has(sectionName)) {
      this.productItems.get(sectionName).forEach(fieldName => {
        const control = this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl);
        if (control) {
          const children = control[this.params][this.groupChildren] as [];
          const isGroupHeader = (children !== undefined && children.length > 0) ? true : false;
          let previewScreen = control[this.params][this.previewScreen];
          previewScreen = previewScreen === false ? false : true;
          const dynamicHeaderLabel = control[this.params]['dynamicHeaderLabel'];
          if(this.commonService.isnonEMptyString(dynamicHeaderLabel)){
            this.dynamicHeaderField.set(fieldName,fieldsControl[dynamicHeaderLabel].value);
          }

          const isPreview = this.mode === FccGlobalConstant.INITIATE || this.mode === FccGlobalConstant.DRAFT_OPTION ||
            this.mode === FccGlobalConstant.EXISTING;
            /**
             * Check for previewScreen condition only in case of preview stepper screen.
             * Since before adding all fields, rendered and preview screen check is done later.
             */
          if (control && ((isPreview && previewScreen) || !isPreview)) {
            if (!this.summaryDetailsMap.has(sectionName)) {
              this.summaryDetailsMap.set(sectionName, new Map());
              this.clubbedDetailsMap.set(sectionName, new Map());
            }
            if (this.operation && this.operation === 'LIST_INQUIRY' && control && control.type === 'input-table') {
              this.processTable(control);
            }
            if (this.operation && control.type === 'card-summary') {
              this.processPOData(control);
            }
            if (control[this.params][FccGlobalConstant.AMEND_NARRATIVE_CLUB] && this.isAmendScreenControl()) {
              this.populateNarrativeSectionSummaryDetailsMap(sectionName, fieldName, fieldsControl);
            } else if (isGroupHeader) {
              let hideGrpHeaderInView = control[this.params][this.hideGrpHeaderInView];
              hideGrpHeaderInView = hideGrpHeaderInView === true ? true : false;
              // Hide the Header in preview/view
              if (!hideGrpHeaderInView) {
                this.populateSummaryDetailsMap(sectionName, fieldName, fieldsControl);
              }
            } else {
              this.populateSummaryDetailsMap(sectionName, fieldName, fieldsControl);
            }
            if (this.fileDownloadMap.has(fieldName)) {
              this.setFileDownLoadMapWithStateData(fieldName, this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl));
            }
            if (this.cardDataMap.has(fieldName)) {
              this.setCardDataMapWithStateData(fieldName, this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl));
            }
            if (this.licenseMap.has(fieldName)) {
              this.setLicenseMapMapWithStateData(fieldName, this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl));
            }
            if (this.accountDetailsMap.has(fieldName)) {
              this.setAccountDetailsMapMapWithStateData(fieldName,
                  this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl));
            }
            if (this.paymentBatchDetailsMap.has(fieldName)) {
              this.setPaymentBatchDetailsMapMapWithStateData(fieldName,
                  this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl));
            }
            if (this.remInstMap.has(fieldName)) {
              this.setRemInstMapMapWithStateData(fieldName, this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl));
            }
            if (this.pOMap && this.pOMap.has(fieldName)) {
              this.setPOMapMapWithStateData(fieldName, this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl));
            }
            if (this.clubbeItemsMap && this.clubbeItemsMap.has(fieldName)) {
              this.populateClubbedDetailsMap(sectionName, fieldName, fieldsControl);
            }
            if (control[this.params][FccGlobalConstant.AMEND_NARRATIVE_CLUB]
              && this.isAmendScreenControl()
              && control[this.params][FccGlobalConstant.AMEND_NARRATIVE_GROUP]
              && control[this.params][FccGlobalConstant.GROUP_CHILDREN]) {
              this.iterateAmendNarrativeGroupChildrenMapControl(sectionName, fieldName, fieldsControl);
              if (control[this.params][FccGlobalConstant.HIDE_GRP_HEADER_VIEW] &&
                control[this.params][FccGlobalConstant.HIDE_GRP_HEADER_VIEW] === true) {
                this.hideGrpHeaderList.push(fieldName);
              }
            } else if (control[this.params][this.groupChildren]) {
              this.iterateGroupChildrenMapControl(sectionName, fieldName, fieldsControl);
            }
          }
        }
      });
    }
  }

  processPOData(control: FCCFormControl){
    if (control && control.value && (control.key === 'line_items')) {
      control[this.params][this.columns] = purchaseOrderCols;
      control[this.params]['poLineItemsCols'] = purchaseOrderLineItemCols;
      control[this.params][`data`] = this.commonService.handlePurchaseOrders(control.value);
      control[this.params][FccGlobalConstant.RENDERED] = true;
      control.updateValueAndValidity();
    }
  }

  processTable(control: FCCFormControl) {
    if (control && control.value && (control.key === 'feesAndCharges' || control.key === 'documents' )) {
      if (control.key === 'feesAndCharges') {
        control[this.params][this.columns] = feesAndChargesHeader;
      } else {
        control[this.params][this.columns] = documentsHeader;
      }
      control[this.params][`data`] = control.value;
      control.updateValueAndValidity();
    }
  }

  processFormTable(control: FCCFormControl) {

      control[this.params][this.columns] = variationsHeader;
      control[this.params][`data`] = control.value;
      control.updateValueAndValidity();

  }

  setFileDownLoadMapWithStateData(fieldName: string, fileUploadControl: FCCFormControl) {
    if (fileUploadControl[this.params][this.previewFieldType] &&
        fileUploadControl[this.params][this.previewFieldType] === this.inputTable) {
      const shallowData = this.lendingCommonDataService.convertAccordionDataToTable( fileUploadControl);
      const fileUploadObj = this.jsonObject(fieldName, this.inputTable, FccGlobalConstant.LAYOUT_VALUE, ['fileUploadTable']);
      const shallowControl = this.formControlService.getControl(fileUploadObj);
      const shallowParams = Object.assign({}, fileUploadControl.params);
      shallowParams[this.noDelete] = true;
      shallowParams[FccGlobalConstant.COLUMNS] = shallowData.column;
      shallowParams[FccGlobalConstant.DATA] = shallowData.data;
      shallowControl[this.params] = shallowParams;
      this.fileDownloadMap.set(fieldName, shallowControl as FCCFormControl);
    }
    else {
      const fileUploadObj = this.jsonObject(fieldName, this.inputTable, FccGlobalConstant.LAYOUT_VALUE, ['fileUploadTable']);
      const shallowControl = this.formControlService.getControl(fileUploadObj);
      const shallowParams = Object.assign({}, fileUploadControl.params);
      shallowParams[this.noDelete] = true;
      if (fileUploadControl.params && fileUploadControl.params[FccGlobalConstant.CHECKBOX_REQUIRED]
        && fileUploadControl.params[FccGlobalConstant.SELECTED_ROW]
        && fileUploadControl.params[FccGlobalConstant.SELECTED_ROW].length > 0) {
        shallowParams[FccGlobalConstant.DATA] = fileUploadControl.params[FccGlobalConstant.SELECTED_ROW];
      } else if (fileUploadControl.params && fileUploadControl.params[FccGlobalConstant.CHECKBOX_REQUIRED]
        && !fileUploadControl.params[FccGlobalConstant.SELECTED_ROW]) {
        shallowParams[FccGlobalConstant.RENDERED] = false;
      }
      shallowControl[this.params] = shallowParams;
      this.fileDownloadMap.set(fieldName, shallowControl as FCCFormControl); }
  }

  setCardDataMapWithStateData(fieldName: string, cardDataControl: FCCFormControl) {
    const productCode: string = this.productCode;
    const cardControlName = productCode.toLowerCase() + 'CardDetails';
    const cardDetailsObject = this.jsonObject(fieldName, FccGlobalConstant.MAT_CARD, this.layoutValue, [cardControlName]);
    const shallowControl = this.formControlService.getControl(cardDetailsObject);
    const shallowParams = Object.assign({}, cardDataControl.params);
    shallowParams[this.noDelete] = true;
    shallowControl[this.params] = shallowParams;
    this.cardDataMap.set(fieldName, shallowControl as FCCFormControl);
  }
  setLicenseMapMapWithStateData(fieldName: string, fileUploadControl: FCCFormControl) {
    const fileUploadObj = this.jsonObject(fieldName, this.inputEditTable, this.layoutValue, ['license']);
    const shallowControl = this.formControlService.getControl(fileUploadObj);
    const shallowParams = Object.assign({}, fileUploadControl.params);
    shallowParams[this.invalidValue] = fileUploadControl.status === this.INVALID_KEY;
    shallowParams[this.hasActions] = true;
    shallowParams[this.noEdit] = true;
    shallowControl[this.params] = shallowParams;
    this.licenseMap.set(fieldName, shallowControl as FCCFormControl);
  }

  setAccountDetailsMapMapWithStateData(fieldName: string, fileUploadControl: FCCFormControl) {
    const fileUploadObj = this.jsonObject(fieldName, this.inputEditTable, this.layoutValue, ['accountList']);
    const shallowControl = this.formControlService.getControl(fileUploadObj);
    const shallowParams = Object.assign({}, fileUploadControl.params);
    shallowParams[this.invalidValue] = fileUploadControl.status === this.INVALID_KEY;
    shallowParams[this.hasActions] = true;
    shallowParams[this.noEdit] = true;
    shallowControl[this.params] = shallowParams;
    this.accountDetailsMap.set(fieldName, shallowControl as FCCFormControl);
  }

  setPaymentBatchDetailsMapMapWithStateData(fieldName: string, fileUploadControl: FCCFormControl) {
    const fileUploadObj = this.jsonObject(fieldName, this.inputEditTable, this.layoutValue, ['paymentsTable']);
    const shallowControl = this.formControlService.getControl(fileUploadObj);
    const shallowParams = Object.assign({}, fileUploadControl.params);
    shallowParams[this.invalidValue] = fileUploadControl.status === this.INVALID_KEY;
    shallowParams[this.hasActions] = true;
    shallowParams[this.noEdit] = true;
    shallowControl[this.params] = shallowParams;
    this.paymentBatchDetailsMap.set(fieldName, shallowControl as FCCFormControl);
  }

  setRemInstMapMapWithStateData(fieldName: string, fileUploadControl: FCCFormControl) {
    const dataArray = [];
    const accountNumber = 'accountNumber';
    const description = 'description';
    const fileUploadObj = this.jsonObject(fieldName, this.inputTable, this.layoutValue, ['fileUploadTable']);
    const shallowControl = this.formControlService.getControl(fileUploadObj);
    const shallowParams = Object.assign({}, fileUploadControl.params);
    shallowParams[this.hasActions] = false;
    shallowParams[this.noDelete] = true;
    shallowControl[this.params] = shallowParams;
    if (shallowParams[FccGlobalConstant.SELECTED_ROW]) {
      shallowControl[this.params][FccGlobalConstant.DATA].forEach(selectedRowMatch => {
        if (selectedRowMatch.accountNumber === shallowParams[FccGlobalConstant.SELECTED_ROW][accountNumber]
            && selectedRowMatch.description === shallowParams[FccGlobalConstant.SELECTED_ROW][description]) {
          dataArray.push(selectedRowMatch);
        }
      });
    }
    shallowControl[this.params][FccGlobalConstant.DATA] = dataArray;
    // else if (this.transactionDetail.tnxTypeCode === '01' && (this.mode === FccGlobalConstant.INITIATE
    //   || this.mode ===  FccGlobalConstant.DRAFT_OPTION) && !shallowParams[FccGlobalConstant.SELECTED_ROW]) {
    //     shallowControl[this.params][FccGlobalConstant.DATA] = dataArray;
    // }
    this.remInstMap.set(fieldName, shallowControl as FCCFormControl);
  }

  setPOMapMapWithStateData(fieldName: string, control: FCCFormControl) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dataArray = [];
    // const accountNumber = 'accountNumber';
    // const description = 'description';
    // const fileUploadObj = this.jsonObject(fieldName, this.inputTable, this.layoutValue, ['fileUploadTable']);
    // const shallowControl = this.formControlService.getControl(fileUploadObj);
    // const shallowParams = Object.assign({}, fileUploadControl.params);
    // shallowParams[this.hasActions] = false;
    // shallowParams[this.noDelete] = true;
    // shallowControl[this.params] = shallowParams;
    // if (shallowParams[FccGlobalConstant.SELECTED_ROW]) {
    //   shallowControl[this.params][FccGlobalConstant.DATA].forEach(selectedRowMatch => {
    //     if (selectedRowMatch.accountNumber === shallowParams[FccGlobalConstant.SELECTED_ROW][accountNumber]
    //         && selectedRowMatch.description === shallowParams[FccGlobalConstant.SELECTED_ROW][description]) {
    //       dataArray.push(selectedRowMatch);
    //     }
    //   });
    // }
    // shallowControl[this.params][FccGlobalConstant.DATA] = dataArray;
    // else if (this.transactionDetail.tnxTypeCode === '01' && (this.mode === FccGlobalConstant.INITIATE
    //   || this.mode ===  FccGlobalConstant.DRAFT_OPTION) && !shallowParams[FccGlobalConstant.SELECTED_ROW]) {
    //     shallowControl[this.params][FccGlobalConstant.DATA] = dataArray;
    // }
    this.pOMap.set(fieldName, control as FCCFormControl);
  }

  iterateGroupChildrenMapControl(sectionName: string, fieldName: string, fieldsControl) {
    if (this.groupItemsMap && this.groupItemsMap.get(fieldName) !== undefined) {
      const control = this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (let [, groupChildren] of this.groupItemsMap.get(fieldName)) {
        if (control[this.params][FccGlobalConstant.AMEND_NARRATIVE_CLUB] && this.isAmendScreenControl()) {
          groupChildren = control[this.params][FccGlobalConstant.GROUP_CHILDREN];
          this.groupItemsMap.get(fieldName).set(fieldName, groupChildren);
          if (this.singleRowFields.indexOf(fieldName) === -1) {
            this.singleRowFields.push(fieldName);
          }
        }
        groupChildren.forEach(groupChild => {
          if (this.clubbeItemsMap.has(groupChild)) {
            this.populateClubbedDetailsMap(sectionName, groupChild, fieldsControl);
          }
          this.populateSummaryDetailsMap(sectionName, groupChild, fieldsControl);
        });
      }
    }
  }

  iterateAmendNarrativeGroupChildrenMapControl(sectionName: string, fieldName: string, fieldsControl) {
    const map: Map<string, string[]> = new Map();
    if (this.groupItemsMap) {
    this.groupItemsMap.set(fieldName, map.set(fieldName, []));
    }
    if (this.groupItemsMap && this.groupItemsMap.get(fieldName) !== undefined) {
      const control = this.getConntrolFromfieldsControl(sectionName, fieldName, fieldsControl);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (let [, groupChildren] of this.groupItemsMap.get(fieldName)) {
        if (control[this.params][FccGlobalConstant.AMEND_NARRATIVE_CLUB] && this.isAmendScreenControl()) {
          groupChildren = control[this.params][FccGlobalConstant.GROUP_CHILDREN];
          this.groupItemsMap.get(fieldName).set(fieldName, groupChildren);
          if (this.singleRowFields.indexOf(fieldName) === -1) {
            this.singleRowFields.push(fieldName);
          }
        }
        groupChildren.forEach(groupChild => {
          if (this.clubbeItemsMap.has(groupChild)) {
            this.populateClubbedDetailsMap(sectionName, groupChild, fieldsControl);
          }
          this.populateNarrativeSectionSummaryDetailsMap(sectionName, groupChild, fieldsControl);
        });
      }
    }
  }

  populateNarrativeSectionSummaryDetailsMap(sectionName: string, field: string, fieldsControl) {
    const control = this.getConntrolFromfieldsControl(sectionName, field, fieldsControl);
    this.setNarrativeFieldsToSections(control, sectionName);
  }

  populateSummaryDetailsMap(sectionName: string, field: string, fieldsControl) {
    const control = this.getConntrolFromfieldsControl(sectionName, field, fieldsControl);

    this.messageToBankSingleRowFields(control, field);
    this.narrativeELSingleRowFields(control, field);
    if (this.singleRowFields.indexOf(field) !== -1) {
      const isRendered = control[this.params][this.rendered];
      if (!isRendered) {
        this.singleRowFields.splice(this.singleRowFields.indexOf(field), 1);
      }
    }
    this.handleShipmentMutualFields(control);
    if (control && control[this.params][FccGlobalConstant.VIEW_DISPLAY] &&
        control[this.params][FccGlobalConstant.VIEW_DISPLAY] !== null &&
        control[this.params][FccGlobalConstant.VIEW_DISPLAY] === true) {
      this.viewDisplayItemsMap.set(field, []);
      if (this.viewDisplayItemsMap.get(field).indexOf(sectionName) === -1) {
        this.viewDisplayItemsMap.get(field).push(sectionName);
      }
    }
    if (control && control[this.params] && control[this.params][FccGlobalConstant.PDF_DISPLAY_HIDDEN_VALUE] &&
      this.operation === FccGlobalConstant.PREVIEW
      && (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND)) {
        control[this.params][this.rendered] = false;
      }
    if (((control && control[this.params][this.rendered]) ||
        (control && control[this.params][FccGlobalConstant.VIEW_DISPLAY]))
        && (control && !(control[this.params][this.clubbed]))) {
      this.setFieldsToSections(control, sectionName);
    }
  }

  protected handleShipmentMutualFields(control: FCCFormControl) {
    if (control && control[this.params] && control[this.params][FccGlobalConstant.DISPLAY_PREVIEW] &&
      (this.operation === FccGlobalConstant.PREVIEW || this.operation === FccGlobalConstant.LIST_INQUIRY) &&
      (control.value === '' || control.value === null || control.value === undefined)) {
      control[this.params][this.rendered] = false;
    }
  }


  setNarrativeFieldsToSections(control, sectionName) {
    const fieldName = control.key;
    const typeVal = control.type;
    const translateVal = '';
    const styleClass = control.params.amendPreviewStyle;
    const val = this.previewService.getValue(control, true);
    const masterVal = val;
    let infoLabel = null;
    if (control.params.infolabel || control.params.groupLabel) {
      infoLabel = control.params.infolabel ? control.params.infolabel : control.params.groupLabel;
    }
    let labelVal = control.params[FccGlobalConstant.GROUP_SUB_HEADER] ?
        control.params[FccGlobalConstant.GROUP_SUB_HEADER] : control.params[this.label];
    if (control.type === FccGlobalConstant.expansionPanel) {
      labelVal = control.value.label;
    }
    if ((typeVal !== this.spacer || typeVal !== 'button-div')) {
      const valueDetails: ValueDetails = {
        type: typeVal,
        value: val,
        label: labelVal,
        masterValue: masterVal,
        translateValue: translateVal,
        valStyleClass: styleClass,
        infolabel: infoLabel
      };
      if (control.status === this.INVALID_KEY && (this.mode !== FccGlobalConstant.VIEW_MODE && !this.isMasterView)) {
        valueDetails.invalidValue = true;
      } else if (control.type === FccGlobalConstant.amendNarrativeTextArea &&
        (this.mode !== FccGlobalConstant.VIEW_MODE && !this.isMasterView) && (val.trim().length !== 0 &&
        !this.regex.test(val.replace(/\n/g, '')))) {
          valueDetails.invalidValue = true;
      }
      this.summaryDetailsMap.get(sectionName).set(fieldName, valueDetails);
    }
  }

  setFieldsToSections(control, sectionName) {
    const fieldName = control.key;
    const typeVal = control.type;
    const translate = control.params[FccGlobalConstant.TRANSLATE];
    const isHyperLink = control.params.isHyperLink;
    let translateVal = '';
    let masterVal = control.params[FccGlobalConstant.MASTER_VALUE] && control.params[FccGlobalConstant.MASTER_VALUE] !== undefined ?
      control.params[FccGlobalConstant.MASTER_VALUE] : '';
      if ((this.mode === FccGlobalConstant.VIEW_MODE || this.mode === FccGlobalConstant.EXISTING)
      && (control.type === FccGlobalConstant.inputDropdown ) && control[this.options] !== null) {
        Object.keys(control[this.options]).forEach(dropDownobj => {
          if (control[this.options][dropDownobj][this.valueStr] === masterVal) {
            masterVal = control[this.options][dropDownobj][this.label];
          }
        });
      }
    if ((this.mode === FccGlobalConstant.VIEW_MODE) && control.params[FccGlobalConstant.PREVIEW_VALUE_ATTR]
      && (control.type === FccGlobalConstant.INPUT_DROPDOWN_FILTER) && (masterVal === control.value.shortName)) {
        masterVal = control.value[control.params[FccGlobalConstant.PREVIEW_VALUE_ATTR]];
    }
    if (control.type === FccGlobalConstant.inputTextArea) {
        this.commonService.decodeNarrative = false;
      }
    if (control.params[FccGlobalConstant.stateServiceData]) {
      const sectionForm: FCCFormGroup = this.stateService.getSectionData(sectionName);
      control = this.getConntrolFromfieldsControl(sectionName, fieldName, sectionForm.controls);
    }
    let val = this.previewService.getValue(control, true);
    let infoLabel = null;
    if (control.params.infolabel || control.params.groupLabel) {
      infoLabel = control.params.infolabel ? control.params.infolabel : control.params.groupLabel;
    }
    if (typeVal === 'checkbox' || typeVal === FccGlobalConstant.inputSwitch) {
      if (translate && val !== '') {
        translateVal = control.params[FccGlobalConstant.TRANSLATE_VALUE];
        val = this.translateService.instant( translateVal + val);
      } else {
        val = (val.toLowerCase() === 'y' || val.toLowerCase() === 'yes') ? `${this.translateService.instant('yes')}`
        : `${this.translateService.instant('no')}`;
      }
      if (control.params[FccGlobalConstant.MASTER_VALUE] && control.params[FccGlobalConstant.MASTER_VALUE] !== undefined) {
        masterVal = this.populateAmendMasterCheckboxValue(control, masterVal);
      }
    } else if (translate && control.params[FccGlobalConstant.TRANSLATE] === true && val !== '') {
      translateVal = control.params[FccGlobalConstant.TRANSLATE_VALUE];
      val = this.translateService.instant( translateVal + val);
    } else if (typeVal === FccGlobalConstant.inputDropdown && control[this.options] !== null) {
      Object.keys(control[this.options]).forEach(dropDownobj => {
        if (control[this.options][dropDownobj][this.valueStr] === val) {
          val = control[this.options][dropDownobj][this.label];
          // Setting the value in control for view popup, to get data in PDF
          if (this.mode === FccGlobalConstant.VIEW_MODE) {
            control.value = val;
           }
        }
      });
    } else if (typeVal === FccGlobalConstant.selectButton && control[this.options] && val === '') {
        const tempVal = this.translateService.instant( control.key + '_' + val);
        if (tempVal !== (control.key + '_')) {
          val = tempVal;
        }
    } else if (typeVal === FccGlobalConstant.ROUNDED_BUTTON) {
      val = '';
    }

    if (control.params[FccGlobalConstant.PREVIEW_DISPALYED_VALUE]) {
      val = (control.params[FccGlobalConstant.DISPLAYED_VALUE] !== '' && control.params[FccGlobalConstant.DISPLAYED_VALUE] !== undefined)
      ? control.params[FccGlobalConstant.DISPLAYED_VALUE] : val;
    }

    if ((control.params[FccGlobalConstant.PREVIOUS_READONLY]
        && control.params[FccGlobalConstant.MASTER_VALUE] &&
        control.params[FccGlobalConstant.MASTER_VALUE] !== undefined) ||
        (control.params[FccGlobalConstant.AMEND_PERSISTENCE_SAVE]) ||
        (control.params[FccGlobalConstant.AMEND_SPCIFIC_FIELD] !== undefined &&
          control.params[FccGlobalConstant.AMEND_SPCIFIC_FIELD] === true))
     {masterVal = val; }


    let labelVal = control.params[this.label];
    if (this.commonService.isViewPopup && labelVal === FccGlobalConstant.EMPTY_STRING && this.subTnxType &&
          this.subTnxType === FccGlobalConstant.N003_AMEND_RELEASE) {
      labelVal = control.params[this.key];
    }
    if ((typeVal !== this.spacer || typeVal !== 'button-div')) {
      const valueDetails: ValueDetails = {
        type: typeVal,
        value: val,
        label: labelVal,
        masterValue: masterVal,
        translateValue: translateVal,
        infolabel: infoLabel,
        fullWidthView: control[this.params][this.fullWidth],
        setContentWidth: control[this.params][this.setContentWidth],
        labelOnly: control[this.params][this.labelOnly],
        valueOnly: control[this.params][this.valueOnly],
        amendCompare: control[this.params][this.amendCompare],
        isHyperLink: isHyperLink !== undefined && isHyperLink !== null ? control.params.isHyperLink : false,
        isNotRequiredForComparison: control[this.params][this.isNotRequiredForComparison] ?
          control[this.params][this.isNotRequiredForComparison] : false
      };
      if (control.status === this.INVALID_KEY && (this.mode !== FccGlobalConstant.VIEW_MODE && !this.isMasterView)) {
        valueDetails.invalidValue = true;
      } else if (this.mode !== FccGlobalConstant.VIEW_MODE && !this.isMasterView && val.indexOf('null') > -1) {
        valueDetails.invalidValue = true;
      }
      this.commonService.decodeNarrative = true;
      this.summaryDetailsMap.get(sectionName).set(fieldName, valueDetails);
    }
  }

  populateAmendMasterCheckboxValue(control: any, masterVal: any): string {
      return (masterVal.toLowerCase() === 'y' || masterVal.toLowerCase() === 'yes') ? `${this.translateService.instant('yes')}` :
                  `${this.translateService.instant('no')}`;
  }

  messageToBankSingleRowFields(control: any, fieldName: string) {
    if ((this.tnxTypeCode === FccGlobalConstant.N002_INQUIRE && !this.commonService.isViewPopup) &&
      !(this.option === FccGlobalConstant.OPTION_ASSIGNEE || this.option === FccGlobalConstant.OPTION_TRANSFER ||
        this.subTnxType === FccGlobalConstant.N003_ASSIGNEE || this.subTnxType === FccGlobalConstant.N003_TRANSFER)) {
        this.setSingleRowFieldsMap(fieldName, control);
    } else if ((control && control !== undefined )) {
      const fullWidth = control[this.params][this.fullWidth];
      if (fullWidth) {
        this.setSingleRowFieldsMap(fieldName, control);
      }
    }
  }

  narrativeELSingleRowFields(control: any, fieldName: string) {
    if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND)
          && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
          && this.subTnxType !== FccGlobalConstant.N003_INCREASE
          && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN
          && this.eventTab && control &&
          control[this.params] && control[this.params][FccGlobalConstant.AMEND_TABBED_PANEL] && control.value &&
          this.operation === FccGlobalConstant.LIST_INQUIRY) {
      this.setSingleRowFieldsMap(fieldName, control);
    }
  }

  populateClubbedDetailsMap(sectionName: string, field: string, fieldsControl) {
    const control = this.getConntrolFromfieldsControl(sectionName, field, fieldsControl);
    /**
     * When the first field needs to be hidden dynamically, the complete list is not shown.
     * Hence removing this check, as the check is done while creating the clubbed value.
     */
    // if (control && control[this.params][this.rendered]) {

    if (this.operation !== undefined && (this.operation === 'LIST_INQUIRY' || this.operation === 'PREVIEW')) {
      if (control && control[this.params][this.feildType] && control[this.params][this.feildType] === 'amount' ) {
        const emptyCheck = this.previewService.getValue(control, true);
        if (emptyCheck && emptyCheck !== '') {
          this.populateClubbedDetailsMapControl(control, sectionName, field, fieldsControl) ;
        }
      } else {
        this.populateClubbedDetailsMapControl(control, sectionName, field, fieldsControl) ;
      }
    } else {
      if (control && control[this.params][this.feildType] && control[this.params][this.feildType] === 'amount' ) {
        const emptyCheck = this.previewService.getValue(control, true);
        if (emptyCheck && emptyCheck !== '') {
          this.populateClubbedDetailsMapControl(control, sectionName, field, fieldsControl) ;
        }
      } else {
        this.populateClubbedDetailsMapControl(control, sectionName, field, fieldsControl) ;
      }
    }
    // }
  }

  populateClubbedDetailsMapControl(control, sectionName, field, fieldsControl) {
    this.clubbedChildList.splice(0, this.clubbedChildList.length);
    if (control) {
    const fieldName = control.key;
    let val = this.getClubbedValue(sectionName, field, fieldsControl);
    let masterVal = '';
    if (control.params[FccGlobalConstant.MASTER_VALUE] && control.params[FccGlobalConstant.MASTER_VALUE] !== undefined) {
       masterVal = this.getClubbedValue(sectionName, field, fieldsControl, true);
      }
    const typeVal = control.type;
    const labelVal = control.params[this.label];
    const clubbedHeaderVal = control.params[this.clubbedHeaderText];
    let infoLabel = null;
    if (control.params.infolabel || control.params.groupLabel) {
      infoLabel = control.params.infolabel ? control.params.infolabel : control.params.groupLabel;
    }
    if (this.isAmendComparison && control.params && control.params[this.clubbedList]) {
      const clubbedList = control.params[this.clubbedList];
      clubbedList.forEach(childField => {
        if (fieldsControl[childField] && (fieldsControl[childField].params.infolabel || fieldsControl[childField].params.groupLabel)
            && childField !== 'applicantcountry') {
          infoLabel = true;
        }
      });
    }
    const curCode = val.slice(0, 3);
    if (this.currencyList.indexOf(curCode) > -1 && this.currencySymbolDisplayEnabled) {
      let amtVal = this.commonService.getCurrencySymbol(curCode, val.slice(3).trim());
      if(typeof amtVal != 'undefined' && amtVal != null && this.mode === FccGlobalConstant.VIEW_MODE){
        const splitAmtVal = amtVal.split(" ");
        if(splitAmtVal.length === 2 && !this.commonService.isnonEMptyString(splitAmtVal[1])){
            amtVal = amtVal + '0'+`${this.translateService.instant('decimalSeprator')}`+'00';
            control.patchValue('0'+`${this.translateService.instant('decimalSeprator')}`+'00');
        }
        val = amtVal.indexOf(curCode) > -1 ? `${amtVal}` : `${curCode} ${amtVal}`;
        const masteramtval = this.commonService.getCurrencySymbol(curCode, masterVal.slice(3).trim());
        masterVal = masteramtval.indexOf(curCode) > -1 ? `${masteramtval}` : `${curCode} ${masteramtval}`;
     }
    }
    const perSave = control[this.params][this.amendPersistenceSave];
    if (perSave === true) {
      masterVal = val;
    }
    const valueDetails: ValueDetails = {
      type: typeVal,
      value: val,
      label: labelVal,
      clubbedHeader: clubbedHeaderVal,
      masterValue: masterVal,
      infolabel: infoLabel
    };
    this.checkClubbedFieldsRendered(control, fieldsControl);
    if (control.status === this.INVALID_KEY && (this.mode !== FccGlobalConstant.VIEW_MODE && !this.isMasterView)) {
      valueDetails.invalidValue = true;
    } else if (control.params && control.params[this.clubbedList]) {
      const clubbedList = control.params[this.clubbedList];
      for (let i = 0; i < clubbedList.length; i++) {
        if (fieldsControl[clubbedList[i]] && fieldsControl[clubbedList[i]].status === this.INVALID_KEY &&
        (this.mode !== FccGlobalConstant.VIEW_MODE && !this.isMasterView)) {
          valueDetails.invalidValue = true;
          valueDetails.clubbedInvalidField = fieldsControl[clubbedList[i]].key;
          break;
        }
      }
    }
    if (control && control.params && control.params[this.clubbedList] && control[this.params][this.feildType]
      && control[this.params][this.feildType] === 'amount' ) {
      let showField = true;
      if (control.params.dynamicCriteria && control.params.dynamicCriteria.hideByProperty && this.showAvailableAmount === false) {
        showField = false;
      }
      const clubbedList = control.params[this.clubbedList];
      if (clubbedList.length !== this.clubbedChildList.length && showField) {
        this.clubbedDetailsMap.get(sectionName).set(fieldName, valueDetails);
      }
    } else if (val !== '' && ((control.params[this.clubbedList].length !== this.clubbedChildList.length) || (masterVal !== ''))) {
      this.clubbedDetailsMap.get(sectionName).set(fieldName, valueDetails);
    }
    else {
      if (this.renderedField) {
        this.clubbedDetailsMap.get(sectionName).set(fieldName, valueDetails);
      }
    }
  }
  }

  checkClubbedFieldsRendered(control, fieldsControl) {
    this.renderedField = true;
    this.clubbedRendered = 0;
    if (control.params && control.params[this.clubbedList]) {
      const clubbedList = control.params[this.clubbedList];
      clubbedList.forEach(childField => {
        if (fieldsControl[childField] && fieldsControl[childField].params.rendered) {
            this.clubbedRendered += 1;
        }
      });
      if(this.clubbedRendered === 0){
        this.renderedField = false;
      }
    }
  }
  getClubbedValue(sectionName: string, field: string, fieldsControl, isMaster = false): string {
    const control = this.getConntrolFromfieldsControl(sectionName, field, fieldsControl);
    let clubbedDelimiter = ' ';
    if (control && control[this.params][this.clubbedDelimiter]) {
      clubbedDelimiter = control[this.params][this.clubbedDelimiter];
    }
    let val = '';
    if (control.params[this.clubbedList]) {
      const clubbedList = control.params[this.clubbedList];
      Object.keys(clubbedList).forEach(childField => {
        val = this.getClubbedValueIterator(sectionName, clubbedList[childField], fieldsControl, control, isMaster, val, clubbedDelimiter);
        if (fieldsControl[childField] && (fieldsControl[childField][this.params])
        && !(fieldsControl[childField][this.params][this.rendered]) &&
        this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) === -1)
        {
          this.clubbedChildList.push(childField);
        } else if (fieldsControl[clubbedList[childField]] && (fieldsControl[clubbedList[childField]][this.params])
        && !(fieldsControl[clubbedList[childField]][this.params][this.rendered]) &&
        this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) === -1)
        {
          this.clubbedChildList.push(childField);
        } else if (this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) > -1
        && this.accordionPanelControlMap.get(sectionName).has(field)) {
          const childControl = this.getConntrolFromfieldsControl(sectionName, clubbedList[childField], fieldsControl);
          if (!(this.commonService.isEmptyValue(childControl)) && !(childControl[this.params][this.rendered])) {
            this.clubbedChildList.push(childField);
          }
        }
      });
    }
    if (val.length > 0) {
      val = val.substring(0, val.length - FccGlobalConstant.LENGTH_2);
    }
    return val;
  }

  getClubbedValueIterator(sectionName: string, childField, fieldsControl, control, isMaster, val, clubbedDelimiter): string {
    const childControl = this.getConntrolFromfieldsControl(sectionName, childField.toString(), fieldsControl);
    let value = '';
    let spaceVal = ' ';
    if (clubbedDelimiter === FccGlobalConstant.NEXT_LINE_CHAR) {
      spaceVal = '';
    }
    if (childControl && childControl[this.params][this.rendered] && childControl[this.params][this.previewScreen]) {
      if (childControl.type === 'checkbox') {
        value = this.previewService.getCheckBoxLabelValue(childControl);
        if (control.params[FccGlobalConstant.MASTER_VALUE] && control.params[FccGlobalConstant.MASTER_VALUE] !== undefined && isMaster) {
          value = this.previewService.getMasterCheckBoxLabelValue(childControl);
        }
      } else if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
        this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) && sectionName !== FccGlobalConstant.eventDetails
        && !this.eventTab && isMaster && (childControl.type === 'input-text' || childControl.type === 'input-dropdown'
        || childControl.type === 'input-radio-check')
         && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
         && this.subTnxType !== FccGlobalConstant.N003_INCREASE
         && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN) {
        value = this.previewService.getMasterValue(childControl);
      } else {
        value = this.previewService.getValue(childControl, true);
      }
    }
    const keyArray = ['applicantcountry', 'loanEntitycountry', 'beneficiarycountry', 'beneficiaryTypecountry',
     'addressLinecountry', 'draweecountry', 'altApplicantcountry'];
    const delimitter = '-';
    if (childControl && keyArray.indexOf(childControl.key) > -1)
    {
      let countryList: CountryList;
      this.commonService.getCountries().subscribe(data => {
        countryList = data;
        const exist = countryList.countries.filter(task => task.alpha2code === fieldsControl[childField].value);
        if (exist !== null && exist.length > 0) {
        const country = countryList.countries.filter(task => task.alpha2code === fieldsControl[childField].value.shortName)[0];
        if (country) {
          value = country.alpha2code + delimitter + country.name;
        }
      }
      });
    }

    if (childControl && childControl.params[FccGlobalConstant.TRANSLATE] && value !== '') {
      const translateVal = childControl.params[FccGlobalConstant.TRANSLATE_VALUE];
      value = `${this.translateService.instant( translateVal + value)}`;
    }
    if (value && value.trim() && value.length > 0) {
      val += value + clubbedDelimiter + spaceVal;
    }
    return val;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getParentControlName(sectionName: string, fieldName: string): any {
    const sectionName1 = this.stateService.getSectionData(sectionName);
    return this.managePanelValue(sectionName1, sectionName);
}


  protected managePanelValue(sectionName1: FCCFormGroup, sectionName: string): any {
    Object.keys(sectionName1.controls).forEach(subSectionName => {
      if (sectionName1.controls[subSectionName] instanceof FCCFormGroup) {
        const subSectionControls = sectionName1.controls[subSectionName][FccGlobalConstant.CONTROLS];
        if (subSectionControls) {
          Object.keys(subSectionControls).forEach(nestedSubSection => {
              if (nestedSubSection && subSectionControls[nestedSubSection] instanceof FCCFormGroup) {
                Object.keys(subSectionControls[nestedSubSection].controls).forEach(nestedToNestedSubSection => {
                  if (subSectionControls[nestedSubSection].controls[nestedToNestedSubSection] instanceof ExpansionPanelControl
                      && nestedToNestedSubSection[FccGlobalConstant.VALUE]) {
                    return this.stateService.getNestedToNestedValueObject(sectionName, subSectionName, nestedSubSection,
                      nestedToNestedSubSection, true);
                  }
                });
              }
          });
        }
      }
    });
  }

  getConntrolFromfieldsControl(sectionName: string, fieldName: string, fieldsControl): FCCFormControl {
    let control;
    this.accordionPanelControlMap = this.formAccordionPanelService.getAccordionSectionControlMap();
    if (this.tabPanelService.getTabSectionList().indexOf(sectionName) !== -1
      && this.tabSectionControlMap.get(sectionName).has(fieldName)) {
      control = this.tabSectionControlMap.get(sectionName).get(fieldName);
      if ((sectionName === FccGlobalConstant.NARRATIVE_DETAILS || sectionName === FccGlobalConstant.SI_NARRATIVE_DETAILS)
          && control.value === '' && this.operation === FccGlobalConstant.LIST_INQUIRY) {
        control.value = this.getParentControlName(sectionName, fieldName);
      }
    } else if (this.formAccordionPanelService.getAccordionSectionList().indexOf(sectionName) > -1
      && this.accordionPanelControlMap.get(sectionName).has(fieldName)) {
      control = this.accordionPanelControlMap.get(sectionName).get(fieldName);
    } else {
      control = fieldsControl[fieldName];
    }
    return control;
  }

  checkSectionEmpty() {
    const data = 'data';
    for (const [section, value] of this.summaryDetailsMap) {
      let flag = false;
      if (this.stateService.isStateSectionSet(section, this.master, this.stateType)) {
        for (const [field, valueDetails] of value) {
          if ((valueDetails.type === 'input-table' || valueDetails.type === 'expansion-panel-edit-table') &&
          this.fileDownloadMap.has(field) && this.fileDownloadMap.get(field)[this.params][data].length > 0) {
            flag = true;
            break;
          }
          if (valueDetails.type === 'edit-table' && this.licenseMap.has(field) &&
          this.licenseMap.get(field)[this.params][data].length > 0) {
            flag = true;
            break;
          }
          if (valueDetails.type === 'input-table' && this.remInstMap.has(field) &&
          this.remInstMap.get(field)[this.params][data].length > 0) {
            flag = true;
            break;
          }
          if (valueDetails.type === 'card-summary' && this.pOMap.has(field) &&
          this.pOMap.get(field)[this.params][data].length > 0) {
            flag = true;
            break;
          }
         // Setting flag to true when there is value which is invalid,
          // so that section wont get removed from summary details map.
          //  it will show error for mandatory field
          if (valueDetails.value || valueDetails.invalidValue) {
            flag = true;
            break;
          }
        }
      }
      if (!flag) {
        this.summaryDetailsMap.set(section, undefined);
      }
    }
  }

  jsonObject(name: string, type: string, layoutClass?: string, styleClass?: any, parentStyleClass?: any,
             localization?: any): any {
    this.obj = {};
    this.obj[this.nameStr] = name;
    this.obj[this.typeStr] = type;
    this.obj[this.layoutClassStr] = layoutClass;
    this.obj[this.styleClassStr] = styleClass;
    this.obj[this.parentStyleClassStr] = parentStyleClass;
    this.obj[this.NOLOCALIZATIONSTR] = localization;
    return this.obj;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickDownloadIcon(event, key, index) {
    const id = event.attachmentId;
    const fileName = event.fileName;
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

  onClickChildRef(event, childRefId){
    const tnxId = '';
    const tnxTypeCode = '';
    const eventTnxStatCode = '';
    const subTnxTypeCode = '';
    const childProductCode = childRefId.slice(0, 2);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['view'], { queryParams: { tnxid: tnxId, referenceid: childRefId,
        productCode: childProductCode, tnxTypeCode,
        eventTnxStatCode, mode: FccGlobalConstant.VIEW_MODE,
        subTnxTypeCode,
        operation: FccGlobalConstant.PREVIEW } })
    );
    const popup = window.open('#' + url, '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
    const productId = `${this.translateService.instant(childProductCode)}`;
    const mainTitle = `${this.translateService.instant('MAIN_TITLE')}`;
    popup.onload = function() {
      popup.document.title = mainTitle + ' - ' + productId;
    };
  }

  onClickBulkDetails(event, refId) {
    const tnxId = '';
    const tnxTypeCode = '';
    const eventTnxStatCode = '';
    const subTnxTypeCode = '';
    let parentTnxObj;
    let productCode = '';
    let subProductCode = '';
    this.commonService.getParentTnxInformation().subscribe(
      (parentTnx: string) => {
        parentTnxObj = parentTnx;
      }
    );
    if (parentTnxObj) {
      productCode = parentTnxObj[FccGlobalConstant.PRODUCTCODE];
      subProductCode = parentTnxObj[FccGlobalConstant.subProductCode] == null ? '' : parentTnxObj[FccGlobalConstant.subProductCode];
    }
    this.commonService.openParentTransactionPopUp(productCode, refId, subProductCode,
      tnxId, tnxTypeCode, eventTnxStatCode, subTnxTypeCode);
  }

  /**
   * Fetch the file list based on bank or customer type
   */
  getFileList(key: string) {
    if (key === FccGlobalConstant.BANK_ATTACHMENT || key === FccGlobalConstant.FILE_ATTACHMENT_TABLE) {
      return this.uploadFile.getBankList();
    } else if (key === FccGlobalConstant.EL_MT700_FILE_UPLOAD_TABLE || key === FccGlobalConstant.EL_MT700_UPLOAD){
      return this.uploadFile.getELMT700List();
    } else {
      return this.uploadFile.getList();
    }
  }

  checkDynamicControl(control) {

    if (this.dynamicCriteriaMap !== undefined && this.dynamicCriteriaMap.has(control)) {
      this.checkDynamicCriteria(control);
    }
  }

  checkDynamicCriteria(checkControl) {

    const dependentObject = this.dynamicCriteriaMap.get(checkControl);
    const controlName = checkControl;

    if (dependentObject[this.renderCheck] === undefined &&
      this.mode !== FccGlobalConstant.INITIATE && this.mode !== FccGlobalConstant.DRAFT_OPTION &&
      this.mode !== FccGlobalConstant.EXISTING && this.option !== FccGlobalConstant.TEMPLATE &&
      this.stateService.isStateSectionSet(dependentObject[this.presentSection], this.master, this.stateType) &&
      this.stateService.isStateSectionSet(dependentObject[this.dependSection], this.master, this.stateType)) {
    // eslint-disable-next-line max-len
    const presentSectionForm: FCCFormGroup = this.stateService.getSectionData(dependentObject[this.presentSection], undefined, this.master, this.stateType);
    // eslint-disable-next-line max-len
    const dependSectionForm: FCCFormGroup = this.stateService.getSectionData(dependentObject[this.dependSection], undefined, this.master, this.stateType);

    if (presentSectionForm && presentSectionForm.controls) {
      const presentcontrol = this.getConntrolFromfieldsControl(dependentObject[this.presentSection],
                                              controlName, presentSectionForm.controls);
      const dependentcontrol = this.getConntrolFromfieldsControl(dependentObject[this.dependSection],
            dependentObject[this.dependControl], dependSectionForm.controls);
      // For reducing cognitive complexity
      if (presentcontrol) {
      this.checkForDependentFields(dependentObject, presentcontrol, dependentcontrol);
      }
    }
    }

    if (dependentObject[this.renderCheck] !== undefined && this.mode !== 'INITIATE' && this.mode !== 'DRAFT' &&
    this.stateService.isStateSectionSet(dependentObject[this.presentSection], this.master, this.stateType)) {
      const presentSectionForm: FCCFormGroup = this.stateService.getSectionData(dependentObject[this.presentSection],
        undefined, this.master, this.stateType);
      const dependSectionForm: FCCFormGroup = this.stateService.getSectionData(dependentObject[this.dependSection],
        undefined, this.master, this.stateType);
      if (presentSectionForm !== undefined && presentSectionForm !== null) {
        const presentcontrol = this.getConntrolFromfieldsControl(dependentObject[this.presentSection],
          controlName, presentSectionForm.controls);
      const dependentcontrol = this.getConntrolFromfieldsControl(dependentObject[this.dependSection],
            dependentObject[this.dependControl], dependSectionForm.controls);
      if ((this.isMaster && !dependentObject[this.renderCheck]) ||
              (!this.isMaster && dependentObject[this.tnxTypecode] !== this.transactionDetailtnxTypeCode)) {
// eslint-disable-next-line max-len
    if (presentSectionForm && presentSectionForm.controls) {
      presentcontrol[this.params][this.rendered] = false;
      presentcontrol.updateValueAndValidity();
      }
      }
      if ((dependentObject[this.requiredValue] || dependentObject[this.requiredValues] || dependentObject[this.notRequiredValue]
        || dependentObject[this.viceversaCheck]) && presentcontrol) {
        this.checkForDependentFields(dependentObject, presentcontrol, dependentcontrol);
      }
    }}
  }

  checkForDependentFields(dependentObject, presentcontrol, dependentcontrol) {
    let isHiddenField: boolean;
    const controlName = presentcontrol[this.key];
    const val1 = (presentcontrol && this.commonService.isNonEmptyValue(presentcontrol.value)) ? presentcontrol.value : null;
    const val2 = (dependentcontrol && this.commonService.isNonEmptyValue(dependentcontrol.value)) ? dependentcontrol.value : null;
    if (dependentObject[this.requiredValue]) {
          isHiddenField = this.isHiddenField(dependentObject, controlName);
          if ((val2 && val2 === dependentObject[this.requiredValue] && !isHiddenField) && !(val2 instanceof Array)
          && !(dependentObject[this.hideIfEmpty] && this.commonService.isEmptyValue(val1))) {
            presentcontrol[this.params][this.rendered] = true;
          } else if ((val2 && val2 instanceof Array) && val2[0].value === dependentObject[this.requiredValue] && !isHiddenField 
          && !(dependentObject[this.hideIfEmpty] && this.commonService.isEmptyValue(val1))) {
            presentcontrol[this.params][this.rendered] = true;
          } else {
            presentcontrol[this.params][this.rendered] = false;
          }
          presentcontrol.updateValueAndValidity();
    } else if (dependentObject[this.viceversaCheck] && dependentcontrol) {
      isHiddenField = this.isHiddenField(dependentObject, controlName);
      if (val1 !== undefined && val1 !== '' && val1 !== null && !isHiddenField) {
        dependentcontrol[this.params][this.rendered] = false;
      } else {
        dependentcontrol[this.params][this.rendered] = true;
      }
      dependentcontrol.updateValueAndValidity();
    } else if (dependentObject[this.requiredValues] && dependentObject[this.requiredValues] instanceof Array) {
      isHiddenField = this.isHiddenField(dependentObject, controlName);
      for (const value of dependentObject[this.requiredValues]) {
        if ((val2 && value === val2 && !isHiddenField) && dependentObject[this.swiftVersion]) {
            this.commonService.getSwiftVersionValue();
            this.swiftCheck(dependentObject, presentcontrol);
          presentcontrol.updateValueAndValidity();
          break;
        } else if (val2 && value === val2 && !isHiddenField) {
          presentcontrol[this.params][this.rendered] = true;
          presentcontrol.updateValueAndValidity();
          break;
        } else {
          presentcontrol[this.params][this.rendered] = false;
          presentcontrol.updateValueAndValidity();
        }
      }
    } else if (dependentObject[this.notRequiredValue]) {
      if (val2 && val2 === dependentObject[this.notRequiredValue] && !(val2 instanceof Array)) {
        presentcontrol[this.params][this.rendered] = false;
      } else if ((val2 && val2 instanceof Array) && val2[0].value === dependentObject[this.notRequiredValue]) {
        presentcontrol[this.params][this.rendered] = false;
      } else if (dependentObject[this.swiftVersion]) {
        this.commonService.getSwiftVersionValue();
       this.swiftCheck(dependentObject, presentcontrol);
      } else if(dependentObject[this.hideIfEmpty] && this.commonService.isEmptyValue(val1)){
        presentcontrol[this.params][this.rendered] = false;
      } else {
        presentcontrol[this.params][this.rendered] = true;
      }
      presentcontrol.updateValueAndValidity();
    } else if (dependentObject[this.hideIfEmpty]) {
      if ((dependentObject[this.hideIfEmpty]) === true) {
        if (val2 !== undefined && val2 !== '' && val2 !== null && val2 !== ' ') {
            presentcontrol[this.params][this.rendered] = true;
        } else {
            presentcontrol[this.params][this.rendered] = false;
        }
    } else if ((dependentObject[this.hideIfEmpty]) === false) {
        presentcontrol[this.params][this.rendered] = true;
      }
    } else if (dependentObject[this.dependendCondition]) {
      presentcontrol[this.params][this.rendered] = true;
      presentcontrol.updateValueAndValidity();
    } else if (presentcontrol.value === null && presentcontrol.value === undefined &&
      presentcontrol.value === FccGlobalConstant.EMPTY_STRING &&
      dependentObject[this.dependendCondition] !== undefined && !dependentObject[this.dependendCondition]) {
      presentcontrol[this.params][this.rendered] = false;
      presentcontrol.updateValueAndValidity();
    }
    else if (dependentObject[this.swiftVersion]) {

     this.commonService.getSwiftVersionValue();

     this.swiftCheck(dependentObject, presentcontrol);
    presentcontrol.updateValueAndValidity();

     } else if (dependentObject[this.parentCondition] && this.commonService.parent) {
      presentcontrol[this.params][this.rendered] = false;
      presentcontrol.updateValueAndValidity();
    } else if (dependentObject[this.tnxAmtStateCheck]) {
      const tnxTypeCodeList = dependentObject[this.tnxTypecode];
      if ((tnxTypeCodeList.indexOf(this.transactionDetailtnxTypeCode) > -1) ||
          (dependentObject[this.statetype] === this.stateType)) {
        dependentcontrol[this.params][this.rendered] = true;
        dependentcontrol[this.params][this.previewScreen] = true;
      } else {
        dependentcontrol[this.params][this.rendered] = false;
        dependentcontrol[this.params][this.previewScreen] = false;
      }
      dependentcontrol.updateValueAndValidity();
    } else if (dependentObject[this.hideCheckbox]) {
      dependentcontrol[this.params][this.rendered] = false;
      dependentcontrol.updateValueAndValidity();
    }
  }

  swiftCheck(dependentObject, presentcontrol){
    if(dependentObject[this.condition] === 'gtEqual' &&
    (this.commonService.swiftVersion >= dependentObject[this.swiftVersion] && presentcontrol)) {
      presentcontrol[this.params][this.rendered] = true;
      }
      else if(dependentObject[this.condition] === 'ltEqual' &&
      (this.commonService.swiftVersion <= dependentObject[this.swiftVersion] && presentcontrol)) {
    presentcontrol[this.params][this.rendered] = true;
      }

     else if (this.commonService.swiftVersion === dependentObject[this.swiftVersion] && presentcontrol) {

      presentcontrol[this.params][this.rendered] = true;

     } else {

      presentcontrol[this.params][this.rendered] = false;

      }

  }
  // Iterating productItems for structure
  initializeFormGroup() {
    this.form = new FCCFormGroup({});
    if (this.previewService.isPreview(this.mode) && this.tnxTypeCode === FccGlobalConstant.N002_AMEND &&
    this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE && this.subTnxType !== FccGlobalConstant.N003_INCREASE &&
    this.shouldRenderAmendInfoMsg()) {
      const amendInfoMsgObj = this.jsonObject(FccGlobalConstant.AMEND_INFO_MSG, FccGlobalConstant.TEXT,
        this.layoutValue,
        FccGlobalConstant.AMEND_STYLE, ['amendInfoMessage']);
      this.form.addControl(FccGlobalConstant.AMEND_INFO_MSG, this.formControlService.getControl(amendInfoMsgObj));
    }
    if (this.showDateField === true){
      this.dateHeaderField();
    }
    for (const [key, value] of this.productItems) {
      if(key === 'lineBreakForMaster'){
        const PopupNoteObj = this.getPopupNote();
        const PopUpMsg = FccGlobalConstant.POPUP_MSG;
        this.form.addControl(PopUpMsg, this.formControlService.getControl(PopupNoteObj));
      }
      // comparing LcFormModel with SummaryMap
    else if (this.sectionNames.indexOf(key) > -1) {
      if (this.summaryDetailsMap.has(key) && this.summaryDetailsMap.get(key)) {
         if (this.accordionView) {
           this.startProcessing(key, value);
         } else {
          this.setSectionControl(key, value);
        }
      } else {
        if (this.accordionView) {
             this.isTransferAssignee = (this.option === FccGlobalConstant.OPTION_ASSIGNEE ||
             this.option === FccGlobalConstant.OPTION_TRANSFER ||
             this.subTnxType === FccGlobalConstant.N003_ASSIGNEE || this.subTnxType === FccGlobalConstant.N003_TRANSFER);
             this.isRemittanceLetter = (this.tnxTypeCode === FccGlobalConstant.N002_INQUIRE &&
                                    this.subTnxType === FccGlobalConstant.N003_REMITTANCE_LETTER_GENERATION);
             if ((this.transactionDetailtnxStatCode && this.transactionDetailtnxStatCode !== FccGlobalConstant.N004_ACKNOWLEDGED) ||
             this.previewService.isPreview(this.mode) || this.isTransferAssignee || this.isRemittanceLetter) {
              this.setAccordianEmptySectionControl(key);
             }
        } else {
          this.setEmptySectionControl(key);
        }
      }
    }
    }
    // Display a note at the end of Master View Popup, to view attachments and charges from Details.
    if (this.mode === FccGlobalConstant.VIEW_MODE && this.operation === FccGlobalConstant.PREVIEW &&
       (this.tnxId === '' || this.tnxId === undefined)) {
      const masterPopupMsgObj = this.getMasterPopupMessage();
      let masterPopUpMsg: any;
      if (this.productCode === FccGlobalConstant.PRODUCT_LN) {
        masterPopUpMsg = FccGlobalConstant.MASTER_POPUP_MSG_LN;
      } else {
        masterPopUpMsg = FccGlobalConstant.MASTER_POPUP_MSG;
      }
      this.form.addControl(masterPopUpMsg, this.formControlService.getControl(masterPopupMsgObj));
    }
  }

  shouldRenderAmendInfoMsg() {
    let isValid = true;
    if ((this.subProductsWhichDontNeedAmendInfoCheck.indexOf(this.subProductCode) > -1 && !this.amendedValue)) {
      isValid = false;
    }
    return isValid;
  }

  getMasterPopupMessage(){
    let message: any;
    switch (this.productCode) {
      case FccGlobalConstant.PRODUCT_LN:
        message = this.jsonObject(FccGlobalConstant.MASTER_POPUP_MSG_LN, FccGlobalConstant.SUMMARY_TEXT,
          this.layoutValue, FccGlobalConstant.AMEND_STYLE, ['masterPopupMessageLn']);
        break;
      case FccGlobalConstant.PRODUCT_BK:
        if (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_BLFP || this.subProductCode === FccGlobalConstant.SUB_PRODUCT_LNRPN) {
          message = this.jsonObject(FccGlobalConstant.MASTER_POPUP_MSG_LN, FccGlobalConstant.SUMMARY_TEXT,
            this.layoutValue, FccGlobalConstant.AMEND_STYLE, ['masterPopupMessageLn']);
        }
        break;
      default:
        message = this.jsonObject(FccGlobalConstant.MASTER_POPUP_MSG, FccGlobalConstant.SUMMARY_TEXT,
          this.layoutValue, FccGlobalConstant.AMEND_STYLE, ['masterPopupMessage']);
    }
    return message;
  }


  getPopupNote(){
  const message = this.jsonObject(FccGlobalConstant.POPUP_MSG, FccGlobalConstant.SUMMARY_TEXT,
      this.layoutValue, FccGlobalConstant.AMEND_STYLE, ['PopupMessage']);
    return message;
  }

  setAccordianEmptySectionControl(sectionName: string) {
    const Arrayp = [];
    const isAttachmentSection = this.isFileUploadSections(sectionName);
    const isLicenseSection = this.isLicenseSections(sectionName);
    if (isAttachmentSection) {
      Arrayp.push({ panelHead: `${this.translateService.instant(FccGlobalConstant.NO_ATTACHMENT)}` , panelValue: '' });
    }else if (isLicenseSection) {
      Arrayp.push({ panelHead: `${this.translateService.instant(FccGlobalConstant.NO_LICENSE)}` , panelValue: '' });
    } else {
      Arrayp.push({ panelHead: `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}` , panelValue: '' });
    }
    this.form.addControl(sectionName,
      new AccordionControl(sectionName, this.translateService, {
        rendered: true,
        options: [{ header: `${this.translateService.instant(sectionName)}`, data: Arrayp }],
        layoutClass: this.GRID_LIST,
        gridStyle: this.GRID,
        labelStyle: ['labelStyle'],
        valueStyle: ['valueStyle'],
        masterStyle: ['masterStyle'],
        rowStyle: ['rowStyle'],
        panelHeadStyle: ['panelHeadStyle'],
        key: sectionName,
        parentAccordionExpanded: true,
        childAccordionExpanded: true
      }),
    );
  }

  setEmptySectionControl(sectionName: string) {
    if (this.eventInqurySection.indexOf(sectionName) === -1) {
    this.i++;
    const secObj = this.jsonObject(sectionName, FccGlobalConstant.SUMMARY_TEXT, this.layoutValue, ['summarySection']);
    let val = '';
    // Adding Section in text control
    this.form.addControl(sectionName, this.formControlService.getControl(secObj));
    const isAttachmentSection = this.isFileUploadSections(sectionName);
    const isLicenseSection = this.isLicenseSections(sectionName);
    if (isAttachmentSection) {
      val = `${this.translateService.instant(FccGlobalConstant.NO_ATTACHMENT)}`;
    }else if (isLicenseSection) {
      val = `${this.translateService.instant(FccGlobalConstant.NO_LICENSE)}`;
    } else {
      val = `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
    }

    const fieldObj = this.jsonObject(val, FccGlobalConstant.SUMMARY_TEXT, this.layoutValue, ['summaryField'], undefined, true);
    this.form.addControl('emptyField' + this.i, this.formControlService.getControl(fieldObj));
    }
  }
  isFileUploadSections(sectionName): boolean {
    return this.listOfFileUploadSections.indexOf(sectionName) !== -1;
  }

  isLicenseSections(sectionName): boolean {
    return this.listOfLicenseSections.indexOf(sectionName) !== -1;
  }

  isEventInquirySections(sectionName): boolean {
    return this.listOfEventInqurySection.indexOf(sectionName) !== -1;
  }
  setSectionControl(sectionName: string, fieldNames: string[]) {
    const secObj = this.jsonObject(sectionName, 'summary-text', this.layoutValue, ['summarySection']);
    this.form.addControl(sectionName, this.formControlService.getControl(secObj)); // Adding Section in text control
    const q = new Queue();
    let n = this.tabNumber;
    fieldNames.forEach(fieldName => {
      if (this.groupItemsMap && this.groupItemsMap.has(fieldName) && !this.isGroupEmpty(sectionName, fieldName)) { // checks for Group
        n = this.clearingQueue(sectionName, q, n);
        this.setGroupClubControls(sectionName, fieldName);
      } else if (this.singleRowFields.indexOf(fieldName) !== -1) {
        n = this.clearingQueue(sectionName, q, n);
        this.placingSingleRowFields(sectionName, fieldName);
      } else if (this.fileDownloadMap.has(fieldName)) {
        n = this.clearingQueue(sectionName, q, n);
        this.placingFileDownloadFields(sectionName, fieldName);
      } else if (this.licenseMap.has(fieldName)) {
        n = this.clearingQueue(sectionName, q, n);
        this.placingLicenseFields(sectionName, fieldName);
      } else if (this.cardDataMap.has(fieldName)) {
        n = this.clearingQueue(sectionName, q, n);
        this.addCardDataControl(sectionName, fieldName);
      } else {
        // Check whether parent reference, no need to display in comparison view
        if (!(this.isAmendComparison && fieldName.indexOf('parentReference') > -1)) {
        n = this.placingFields(sectionName, fieldName, q, n);
        }
      }
    });
    n = this.clearingQueue(sectionName, q, n);
  }

  dateHeaderField(){
    const fieldObj = this.jsonObject(this.translateService.instant('dateFollows') + ' ' +
    this.utilityService.getDisplayDateFormat(), 'summary-text', this.layoutValue, ['dateStyle']);
    this.form.addControl('dateHeader' + this.i, this.formControlService.getControl(fieldObj));
    this.i ++;
  }

  clearingQueue(sectionName: string, q: Queue, n: number): number {
    this.afterConstruct(sectionName, q, n);
    return this.tabNumber;
  }

  setGroupClubControls(sectionName: string, fieldName: string) {
    // groupQ maintains the order of the groupChildern values
    const groupQ = new Queue();
    // gn is the number of columns in one row
    let gn: number = this.tabNumber;
    // iterating the group head
    for (const [groupHeader, groupChildren] of this.groupItemsMap.get(fieldName)) {
      // Adding GroupHead in text control
      this.i++;
      const groupHeadObj = this.jsonObject(groupHeader, 'summary-text', this.layoutValue, ['form-header subheader-title']);
      this.form.addControl(groupHeader + this.i, this.formControlService.getControl(groupHeadObj));
      groupChildren.forEach(groupChild => {
        gn = this.iterateGroupClubControl(sectionName, groupChild, groupQ, gn);
      });
    }
    this.afterConstruct(sectionName, groupQ, gn);
    // handling the edge case
    if (gn % this.tabNumber !== 0) {
      this.form.addControl(sectionName + this.spacer + fieldName ,
        new SpacerControl( this.translateService, { layoutClass: 'p-col-6', rendered: true }));
    }
  }

  iterateGroupClubControl(sectionName: string, groupChild: string, groupQ: Queue, gn: number): number {
    let value = '';
    let infolabel = null;
    let masterValue = '';
    // Handling Clubbing
    if (this.clubbeItemsMap.has(groupChild) && this.clubbedDetailsMap.get(sectionName).has(groupChild)) {
      value = this.clubbedDetailsMap.get(sectionName).get(groupChild).value;
      infolabel = this.clubbedDetailsMap.get(sectionName).get(groupChild).infolabel;
      if (!value && (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND ||
        this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) && sectionName !== FccGlobalConstant.eventDetails
        && !this.eventTab && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
        && this.subTnxType !== FccGlobalConstant.N003_INCREASE
        && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN) {
        value = `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
      }
      masterValue = this.clubbedDetailsMap.get(sectionName).get(groupChild).masterValue;
    }
    if (this.clubbedTrueFields.indexOf(groupChild) === -1 || (this.isAmendComparison && groupChild === FccGlobalConstant.CURRENCY)) {
      if ( this.tnxTypeCode === FccGlobalConstant.N002_INQUIRE && this.singleRowFields.indexOf(groupChild) !== -1 &&
            !this.commonService.isViewPopup) {
        this.clearingQueue(sectionName, groupQ, gn);
        this.placingSingleRowFields(sectionName, groupChild);
        gn = 1;
      } else {
        gn = this.construct(sectionName, groupChild, groupQ, gn, value, masterValue, infolabel);
      }
    }
    return gn;
  }

  placingSingleRowFields(sectionName: string, fieldName: string) {
    this.i++;
    const value = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
    this.summaryDetailsMap.get(sectionName).get(fieldName).value : '';
    if (value || value.length === 0) {
      const fieldObj = this.jsonObject(fieldName, 'summary-text', this.layoutValue, ['summaryField']);
      this.form.addControl(fieldName + this.i, this.formControlService.getControl(fieldObj));
      let invalidValue = false;
      if (this.summaryDetailsMap.get(sectionName)) {
        invalidValue = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
          this.summaryDetailsMap.get(sectionName).get(fieldName).invalidValue : false;
        this.patchFieldParameters(this.form.get(fieldName + this.i),
          { invalidValue, origSectionName: sectionName, origFieldName: fieldName });
      }
      this.setValueControl(sectionName, fieldName, value, this.layoutValue);
    }
  }

  placingFileDownloadFields(sectionName: string, fieldName: string) {
    this.i++;
    const fieldObj = this.jsonObject(fieldName, 'summary-text', this.layoutValue, ['summaryField']);
    let flag;
    if (this.fileDownloadMap.get(fieldName)[FccGlobalConstant.PARAMS].bankAttachmentPreview &&
        this.fileDownloadMap.get(fieldName)[FccGlobalConstant.PARAMS].data.length === 0) {
      flag = false;
    } else {
      flag = true;
    }
    this.addFileDownloadFieldsControl (fieldName, fieldObj, flag);
  }

  placingLicenseFields(sectionName: string, fieldName: string) {
    this.i++;
    const fieldObj = this.jsonObject(fieldName, 'summary-text', this.layoutValue, ['summaryField']);
    let flag;
    if (this.licenseMap.get(fieldName)[FccGlobalConstant.PARAMS].bankAttachmentPreview &&
        this.licenseMap.get(fieldName)[FccGlobalConstant.PARAMS].data.length === 0) {
      flag = false;
    } else {
      flag = true;
    }
    this.addLicenseFieldsControl (fieldName, fieldObj, flag);
  }

  addCardDataControl(sectionName: string, fieldName: string) {
    this.i++;
    if (this.cardDataMap.get(fieldName)[FccGlobalConstant.PARAMS].options !== undefined &&
        this.cardDataMap.get(fieldName)[FccGlobalConstant.PARAMS].options.length !== 0) {
      this.form.addControl(fieldName + this.i, this.cardDataMap.get(fieldName));
  }
}

  addFileDownloadFieldsControl(fieldName: string, fieldObj: any, flag: boolean) {
    if (flag) {
      this.form.addControl(fieldName + this.i, this.fileDownloadMap.get(fieldName));
    }
  }

  addLicenseFieldsControl(fieldName: string, fieldObj: any, flag: boolean) {
    if (flag) {
      this.form.addControl(fieldName + this.i, this.formControlService.getControl(fieldObj));
      this.i++;
      this.form.addControl(fieldName + this.i, this.licenseMap.get(fieldName));
    }
  }

  placingFields(sectionName: string, fieldName: string, q: Queue, n: number): number {
    let value = '';
    if (this.clubbeItemsMap && this.clubbeItemsMap.has(fieldName) && this.clubbedDetailsMap.get(sectionName).has(fieldName)) {
      value = this.clubbedDetailsMap.get(sectionName).get(fieldName).value;
      if (!value && (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND ||
        this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) && sectionName !== FccGlobalConstant.eventDetails
        && !this.eventTab && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
        && this.subTnxType !== FccGlobalConstant.N003_INCREASE
        && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN) {
        value = `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
      }
    }
    if (this.clubbedTrueFields && this.clubbedTrueFields.indexOf(fieldName) === -1) {
      n = this.construct(sectionName, fieldName, q, n, value);
    }
    return n;
  }

  isGroupEmpty(sectionName: string, fieldName: string): boolean {
    let isEmpty = true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [groupHeader, groupChildren] of this.groupItemsMap.get(fieldName)) {
      groupChildren.forEach(groupChild => {
        if (this.summaryDetailsMap.get(sectionName).has(groupChild)) {
          isEmpty = false;
        }
      });
    }
    return isEmpty;
  }

  construct(sectionName: string, fieldName: string, q: Queue, n: number, value?: string, masterValue?: string, infolabel?: string): number {
    // comparing LcFormModel with SummaryDetailsMap
    if (this.summaryDetailsMap.get(sectionName).has(fieldName)) {
      const nonTranslatedFieldName = fieldName;
      if (value) {
        fieldName = this.translateService.instant(this.clubbeItemsMap.get(fieldName).keys().next().value);
      }
      if (n > 0) {
        if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
          this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) && sectionName !== FccGlobalConstant.eventDetails
          && !this.eventTab && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
          && this.subTnxType !== FccGlobalConstant.N003_INCREASE && !this.isAmendComparison
          && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN) {
          if (this.amendClubbedTrueFields.indexOf(fieldName) !== -1) {
            n = this.enqueueMasterQueue(sectionName, fieldName, q, n, masterValue, value, true);
          } else {
          n = this.enqueueMasterQueue(sectionName, fieldName, q, n, masterValue, value);
         }
        } else {
          n = this.enqueueQueue(sectionName, fieldName, q, n, value, infolabel, nonTranslatedFieldName);
        }
      }
      if (n === 0) {
        if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
          this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) && sectionName !== FccGlobalConstant.eventDetails
          && !this.eventTab && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
          && this.subTnxType !== FccGlobalConstant.N003_INCREASE && !this.isAmendComparison
          && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN) {
          const index = q.length;
          this.emptyMasterQueueValue(q, index);
        } else {
          this.emptyQueueValue(q);
        }
        n = this.tabNumber;
      }
    }
    return n;
  }

  enqueueQueue(sectionName: string, fieldName: string, q: Queue, n: number, value?: string, infolabel?: string,
               nonTranslatedFieldName?: string): number {
    this.setFieldControl(fieldName, null, sectionName);
    n--;
    const sectionDetails : SectionDetails = {
      section_name: sectionName,
      field_names: fieldName,
      field_name_non_transalated: nonTranslatedFieldName,
      infolabel
    };
    if (value) {
      sectionDetails.field_value = value;
    }
    q.enqueue(sectionDetails);
    return n;
  }

  enqueueMasterQueue(sectionName: string, fieldName: string, q: Queue, n: number,
                     mastervalue?: string, value?: string, clubbed= false): number {
    if (this.amendNarrativeItemsMap.has(sectionName)
        && this.amendNarrativeItemsMap.get(sectionName).indexOf(fieldName) !== -1
        && this.isAmendScreenControl() && !this.isAmendComparison) {
      this.setAmendNarrativeFieldControl(sectionName, fieldName);
      n = 1;
    } else {
      this.setFieldControl(fieldName, null, sectionName);
    }
    n--;
    const sectionDetails : SectionDetails= {
      section_name: sectionName,
      field_names: fieldName,
      field_value: value
    };
    if (mastervalue !== undefined) {
      sectionDetails.field_master_value = mastervalue;
      sectionDetails.field_value = value;
      sectionDetails.field_clubbed = clubbed;
    }
    q.masterEnqueue(sectionDetails);
    return n;
  }

  emptyQueueValue(q: Queue) {
     // Logic to display Value below the field.
     while (!q.isEmpty()) {
         const details: SectionDetails = q.dequeue();
         let clubValue = '';
         if (details.field_value) {
           clubValue = details.field_value;
         }
         this.setValueControl(details.section_name, details.field_name_non_transalated, clubValue);
     }
  }

  emptyMasterQueueValue(q: Queue, index: number) {
    // Logic to display Value below the field.
    let clubValue = '';
    let clubMasterValue = '';
    while (!q.isEmpty()) {
      for (const mastervalue of q) {
        if (mastervalue.field_master_value && mastervalue.field_master_value !== undefined) {
          clubMasterValue = mastervalue.field_master_value;
        }
        this.setMasterValueControl(mastervalue.section_name, mastervalue.field_names, clubMasterValue, 'p-col-6', mastervalue.field_value);
        if (index === 1) {
          this.form.addControl(mastervalue.section_name + this.spacer + mastervalue.field_names ,
            new SpacerControl(this.translateService, { layoutClass: 'p-col-6', rendered: true }));
        }
      }
      for (const v of q) {
        if (v.field_value) {
          clubValue = v.field_value;
        }
        if (v.field_clubbed) {
          this.setValueControl(v.section_name, v.field_names, clubValue, 'p-col-12', v.field_master_value);
        } else {
          this.setValueControl(v.section_name, v.field_names, clubValue, 'p-col-6', v.field_master_value);
        }
        if (index === 1) {
          this.form.addControl(v.section_name + this.spacer + v.field_names ,
            new SpacerControl(this.translateService, { layoutClass: 'p-col-6', rendered: true }));
        }
        q.dequeue();
      }
    }
  }

  afterConstruct(sectionName: string, q: Queue, n: number) {
    while (n > 0) {
      this.i++;
      this.setValueControl(sectionName, this.spacer + n.toFixed() + this.i.toFixed());
      n--;
    }
    if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
      this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) && sectionName !== FccGlobalConstant.eventDetails
      && !this.eventTab && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
      && this.subTnxType !== FccGlobalConstant.N003_INCREASE && !this.isAmendComparison
      && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN) {
      const index = q.length;
      this.emptyMasterQueueValue(q, index);
    } else {
      while (!q.isEmpty()) {
        const details: SectionDetails = q.dequeue();
        let clubValue = '';
        if (details.field_value) {
          clubValue = details.field_value;
        }
        let infolabel = null;
        if (details.infolabel) {
          infolabel = details.infolabel;
        }
        this.setValueControl(details.section_name, details.field_names, clubValue, null, null, infolabel);
      }
  }
  }

  setAmendNarrativeFieldControl(sectionName: string, fieldName: string, layoutClass?: string, styleClass?: any) {
    const labelName = this.summaryDetailsMap.get(sectionName).get(fieldName).label;
    fieldName = labelName ? `${this.translateService.instant(labelName)}` : `${this.translateService.instant(fieldName)}`;
    const styleClassVar = styleClass ? styleClass : ['summaryField'];
    const fieldObj = this.jsonObject(fieldName, 'summary-text', 'p-col-12', styleClassVar);
    this.i++;
    this.form.addControl(fieldName + this.i, this.formControlService.getControl(fieldObj));
  }

  setFieldControl(fieldName: string, layoutClass?: string, sectionName?: any) {
    const keyFieldName = fieldName;
    fieldName = `${this.translateService.instant(fieldName)}`;
    const layoutClassVar = layoutClass ? layoutClass : 'p-col-6';
    const type = 'summary-text';
    const changedFieldName = fieldName + this.i;
    if (fieldName.toLowerCase() === FccGlobalConstant.VIEW){
      const viewSecObj = this.jsonObject(fieldName, FccGlobalConstant.ROUNDED_BUTTON,
      FccGlobalConstant.VIEW_SUMMARY_LAYOUT, ['primaryButton']);
      this.i++;
      this.form.addControl(changedFieldName, this.formControlService.getControl(viewSecObj));
    } else {
      const fieldObj = this.jsonObject(fieldName, type, layoutClassVar, ['summaryField']);
      this.i++;
      this.form.addControl(changedFieldName, this.formControlService.getControl(fieldObj));
    }
    let invalidValue = false;
    if (sectionName && this.summaryDetailsMap.get(sectionName)) {
      invalidValue = this.summaryDetailsMap.get(sectionName).has(keyFieldName) ?
        this.summaryDetailsMap.get(sectionName).get(keyFieldName).invalidValue : false;
      this.patchFieldParameters(this.form.get(changedFieldName),
        { invalidValue, origSectionName: sectionName, origFieldName: keyFieldName });
    }
  }

  setValueControl(sectionName: string, fieldName: string, value?: string, layoutClass?: string, masterValue?: string, infolabel1?: string) {
    let val = '';
    if (this.summaryDetailsMap.get(sectionName).get(fieldName) || value) {
      const layoutClassVar = layoutClass ? layoutClass : 'p-col-6';
      if (value) {
        val = value;
      } else {
        val = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
          this.summaryDetailsMap.get(sectionName).get(fieldName).value : `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
      }

      if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
        this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) && sectionName !== FccGlobalConstant.eventDetails
        && !this.eventTab && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
        && this.subTnxType !== FccGlobalConstant.N003_INCREASE && !this.isAmendComparison
        && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN) {
        if (this.amendNarrativeItemsMap.has(sectionName)
            && this.amendNarrativeItemsMap.get(sectionName).indexOf(fieldName) !== -1
            && this.isAmendScreenControl()) {
          this.setAmendNarrativeValueControl(masterValue, sectionName, fieldName, 'p-col-12', val);
        } else {
          this.setAmendValueControl(masterValue, sectionName, fieldName, layoutClassVar, val);
        }
      } else if ((!val || val.length === 0) && fieldName === FccGlobalConstant.VIEW) {
      } else {
        if (!val || val.length === 0) {
          val = `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
        }
        const valObj = this.jsonObject(val, 'summary-text', layoutClassVar, ['summaryVal'], undefined, true);
        let invalidValue = false;
        if (this.summaryDetailsMap.get(sectionName)) {
          invalidValue = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
          this.summaryDetailsMap.get(sectionName).get(fieldName).invalidValue : false;
          this.patchFieldParameters(this.form.get(fieldName + this.i),
          { invalidValue, origSectionName: sectionName, origFieldName: fieldName });
        }
        this.i++;
        this.form.addControl(sectionName + fieldName + this.i, this.formControlService.getControl(valObj));
        const infolabel = this.getamendInfoLabelForComparioson(sectionName, fieldName);
        if ((infolabel || infolabel1) && (this.isAmendComparison && fieldName !== FccGlobalConstant.BENEFICIARY_ENTITY)) {
          this.patchFieldParameters(this.form.get(sectionName + fieldName + this.i),
          { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
        }
      }
    } else {
      this.i++;
      this.form.addControl(sectionName + fieldName + this.spacer + this.i,
        new SpacerControl( this.translateService, { layoutClass: 'p-col-6', rendered: true }));
    }
  }

  getamendInfoLabelForComparioson(sectionName: string, fieldName: string)
  {
      if (this.summaryDetailsMap.get(sectionName).get(fieldName) &&
      (this.summaryDetailsMap.get(sectionName).get(fieldName).infolabel))
      {
        return this.summaryDetailsMap.get(sectionName).get(fieldName).infolabel;
      }
      else if (this.clubbedDetailsMap.has(sectionName) && this.clubbedDetailsMap.get(sectionName).get(fieldName)
      && this.clubbedDetailsMap.get(sectionName).get(fieldName).infolabel)
      {
        return this.clubbedDetailsMap.get(sectionName).get(fieldName).infolabel;
      }
      else {
         return null;
      }
  }

  setAmendNarrativeValueControl(masterValue: string, sectionName: string, fieldName: string, layoutClassVar: string, val: string) {
    const parentStyleClass = 'masterStyle';
    const summayMaterVal = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
                this.summaryDetailsMap.get(sectionName).get(fieldName).masterValue : '';
    const valStyleClass = this.summaryDetailsMap.get(sectionName).get(fieldName)
                && this.summaryDetailsMap.get(sectionName).get(fieldName).valStyleClass ?
                this.summaryDetailsMap.get(sectionName).get(fieldName).valStyleClass : 'summaryAmendVal';
    const masterVal = masterValue ? masterValue : summayMaterVal;
    let valJsonObj;
    if ((!val || val === ' ') && valStyleClass === 'narrativeMasterValueStyle') {
      val = `${this.translateService.instant('summarymasterempty')}`;
      valJsonObj = this.jsonObject(val, 'summary-text', layoutClassVar, 'summaryAmendVal summaryAmendNarrativeVal');
    } else if (!masterVal && !val || masterVal && !val || masterVal === val) {
      val = FccGlobalConstant.BLANK_SPACE_STRING;
      valJsonObj = this.jsonObject(val, 'summary-text', layoutClassVar, valStyleClass, undefined, true);
    } else {
      valJsonObj = this.jsonObject(val, 'summary-text', layoutClassVar, valStyleClass, parentStyleClass, true);
    }
    this.i++;
    this.form.addControl(sectionName + fieldName + this.i, this.formControlService.getControl(valJsonObj));
  }

  setAmendValueControl(masterValue: string, sectionName: string, fieldName: string, layoutClassVar: string, val: string) {
    const parentStyleClass = 'masterStyle';
    const summayMaterVal = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
                this.summaryDetailsMap.get(sectionName).get(fieldName).masterValue : '';
    const masterVal = masterValue ? masterValue : summayMaterVal;
    let valObj;
    if (!masterVal && !val || masterVal && !val || masterVal === val) {
      val = FccGlobalConstant.BLANK_SPACE_STRING;
      valObj = this.jsonObject(val, 'summary-text', layoutClassVar, ['summaryAmendVal'], undefined, true);
    } else {
      valObj = this.jsonObject(val, 'summary-text', layoutClassVar, ['summaryAmendVal'], parentStyleClass, true);
    }
    this.i++;
    this.form.addControl(sectionName + fieldName + this.i, this.formControlService.getControl(valObj));
  }

  setMasterValueControl(sectionName: string, fieldName: string, value?: string, layoutClass?: string, tnxValue?: string) {
    let masterVal = '';
    if (this.summaryDetailsMap.get(sectionName).get(fieldName) || value || tnxValue) {
      if (value) {
        masterVal = value;
      } else {
       masterVal = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
                      this.summaryDetailsMap.get(sectionName).get(fieldName).masterValue : '';
      }
      const val = tnxValue ? tnxValue : this.summaryDetailsMap.get(sectionName).get(fieldName).value;
      const parentStyleClass = 'masterValueStyle';
      const layoutClassVar = layoutClass ? layoutClass : 'p-col-6';
      let valObj;
      if (!masterVal && val) {
        masterVal = `${this.translateService.instant('summarymasterempty')}`;
        valObj = this.jsonObject(masterVal, 'summary-text', layoutClassVar, ['summaryAmendVal'], parentStyleClass, true);
      } else if (!masterVal && !val) {
        masterVal = `${this.translateService.instant('summarymasterempty')}`;
        valObj = this.jsonObject(masterVal, 'summary-text', layoutClassVar, ['summaryAmendVal'], undefined, true);
      } else {
        if (masterVal !== val || masterVal.length === 0) {
          valObj = this.jsonObject(masterVal, 'summary-text', layoutClassVar, ['summaryAmendVal'], parentStyleClass, true);
        } else {
            valObj = this.masterValueJsonObject(sectionName, fieldName, masterVal, layoutClassVar);
        }
      }
      this.i++;

      if (sectionName === FccGlobalConstant.BANK_DETAILS && fieldName === 'Address' && this.form.get('bankDetailsAddressmaster')) {
        this.form.addControl(sectionName + fieldName + this.masters + this.masters, this.formControlService.getControl(valObj));
        this.form.addControl(sectionName + fieldName + this.masters + this.masters + this.spacer + this.i,
          new SpacerControl( this.translateService, { layoutClass: 'p-col-6', rendered: true }));
      } else {
        this.form.addControl(sectionName + fieldName + this.masters, this.formControlService.getControl(valObj));
      }
    } else {
      this.i++;
      this.form.addControl(sectionName + fieldName + this.masters + this.spacer + this.i,
                              new SpacerControl( this.translateService, { layoutClass: 'p-col-6', rendered: true }));
    }
  }

  masterValueJsonObject(sectionName: string, fieldName: string, masterVal: string, layoutClass: string) {
    let masterValueObj;
    const narrativeClassVar = this.styleClassUpdate(sectionName, fieldName);
    if (this.amendNarrativeItemsMap.has(sectionName)
        && this.amendNarrativeItemsMap.get(sectionName).indexOf(fieldName) !== -1
        && this.isAmendScreenControl()) {
      masterValueObj = this.summaryDetailsMap.get(sectionName).get(fieldName)
                && this.summaryDetailsMap.get(sectionName).get(fieldName).valStyleClass ?
                this.summaryDetailsMap.get(sectionName).get(fieldName).valStyleClass : undefined;
      masterValueObj = this.jsonObject(masterVal, 'summary-text', 'p-col-12', narrativeClassVar, undefined, true);
    } else {
      masterValueObj = this.jsonObject(masterVal, 'summary-text', layoutClass, ['summaryAmendVal'], undefined, true);
    }
    return masterValueObj;
  }

  styleClassUpdate(sectionName: string, fieldName: string) {
    let styleClass;
    if (this.amendNarrativeItemsMap.has(sectionName)
        && this.amendNarrativeItemsMap.get(sectionName).indexOf(fieldName) !== -1
        && this.isAmendScreenControl()) {
      styleClass = this.summaryDetailsMap.get(sectionName).get(fieldName)
                && this.summaryDetailsMap.get(sectionName).get(fieldName).valStyleClass ?
                this.summaryDetailsMap.get(sectionName).get(fieldName).valStyleClass : 'summaryAmendVal';
    }
    return styleClass;
  }

  // add n spacer
  addSpacerControl(n: number, layoutClass?: string) {
    if (n > 0) {
      this.i++;
      const obj = this.jsonObject('previewSpacer' + this.i.toString(), this.spacer, layoutClass, []);
      this.form.addControl('previewSpacer' + this.i.toString(), this.formControlService.getControl(obj));
    } else {
      return;
    }
    this.addSpacerControl(n - 1, layoutClass);
  }

  setSubmitControl() {
    const submit = 10;
    this.addSpacerControl(submit, this.layoutValue);
    const subObj = this.jsonObject('submit', 'rounded-button', 'p-col-6',
      'primaryButton nextButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
    const rendered = 'rendered';
    subObj[rendered] = true;
    this.form.addControl(this.submitId, this.formControlService.getControl(subObj));
  }

  submitRender(id: string, bol: boolean) {
    this.patchFieldParameters(this.form.get(id), { rendered: bol });
  }

  // Accordion View
  startProcessing(sectionName: string, fieldNames: string[]) {
    this.form.addControl(sectionName,
      new AccordionControl(sectionName, this.translateService, {
        rendered: true,
        options: this.getHeader(sectionName, fieldNames),
        layoutClass: this.GRID_LIST,
        gridStyle: this.GRID,
        labelStyle: ['labelStyle'],
        valueStyle: ['valueStyle'],
        masterStyle: ['masterStyle'],
        rowStyle: ['rowStyle'],
        panelHeadStyle: ['panelHeadStyle'],
        key: sectionName,
        parentAccordionExpanded: true,
        childAccordionExpanded: true
      }),
    );
  }

  getHeader(sectionName: string, fieldNames: string[]) {
    const accordionSubSectionControls = this.formAccordionPanelService.getAccordionSubSectionListMap();
    if("lineBreakForMaster" === sectionName) {
      const PopupNoteObj = this.getPopupNote();
      const PopUpMsg = FccGlobalConstant.POPUP_MSG;
      this.form.addControl(PopUpMsg, this.formControlService.getControl(PopupNoteObj));
    }
   else if (accordionSubSectionControls.get(sectionName)) {
      this.placingNestedAccordion(sectionName);
    } else {
      this.getAccordionData(sectionName, fieldNames);
    }
    return [{ header: `${this.translateService.instant(sectionName)}`, data: this.itemArray }];
  }

  getAccordionData(sectionName: string, fieldNames: string[]) {
    this.itemArray = [];
    if (sectionName === 'batchGeneralDetails') {
      fieldNames = fieldNames.toLocaleString().split(',' + 'enrichmentListTable').join('').split(',');
    }
    fieldNames.forEach(fieldName => {
      if (this.groupItemsMap.has(fieldName) && !this.isGroupEmpty(sectionName, fieldName)) { // checks for Group
        this.setGroupClubControlsForAccordion(false, sectionName, fieldName);
      } else if (this.singleRowFields.indexOf(fieldName) !== -1) {
        this.placingSingleRowFieldsAccordion(sectionName, fieldName);
      } else if (this.fileDownloadMap.has(fieldName)) {
        this.placingFileDownloadFieldsAccordion(sectionName, fieldName);
      } else if (this.licenseMap.has(fieldName)) {
        this.placingEditTableAccordion(sectionName, fieldName);
      } else if (this.accountDetailsMap.has(fieldName)) {
        this.placingAccountDetailsTableAccordion(sectionName, fieldName);
      } else if (this.paymentBatchDetailsMap.has(fieldName)) {
        this.placingPaymentBatchDetailsTableAccordion(sectionName, fieldName);
      } else if (this.cardDataMap.has(fieldName)) {
        this.populateCardData(fieldName);
      } else if (this.remInstMap.has(fieldName)) {
        this.placingRemInstTableAccordion(sectionName, fieldName);
      }else if (this.pOMap.has(fieldName)) {
        this.placingPOAccordion(sectionName, fieldName);
      } else {
        this.callAccordionData(sectionName, fieldName);
      }
    });
  }

  protected placingNestedAccordion(sectionName: string) {
    this.itemArray = [];
    const sectionForm = this.stateService.getSectionData(sectionName, undefined, this.master, this.stateType);
    const subsectionControlsMap = this.formAccordionPanelService.getAccordionSubSectionAndControlsListMap();
    const subSectionAccordionMap = subsectionControlsMap.get(sectionName);
    for (const [subSectionName, innerControls] of subSectionAccordionMap.entries()) {
      const subSectionForm = sectionForm.controls[subSectionName] as FCCFormGroup;
      if (subSectionForm[this.rendered] !== false) {
      this.itemArray.push({
        options: this.getNestedAccordion(sectionName, subSectionName, innerControls),
        layoutClass: this.GRID_LIST,
        gridStyle: this.GRID,
        labelStyle: ['labelStyle'],
        valueStyle: ['valueStyle'],
        masterStyle: ['masterStyle'],
        rowStyle: ['rowStyle'],
        panelHeadStyle: ['panelHeadStyle'],
        nestedAccordion: true
      });
    }
    }
  }

  protected getNestedAccordion(sectionName: string, subSectionName: string, innerControls: any) {
    this.innerControlArray = [];
    for (const control of innerControls) {
      if (!(control[this.params][this.grouphead])) {
        const fieldName = control.key;
        if (this.groupItemsMap.has(control.key) && !this.isGroupEmpty(sectionName, control.key)) { // checks for Group
          this.setGroupClubControlsForAccordion(true, sectionName, control.key);
        } else if (this.singleRowFields.indexOf(fieldName) !== -1) {
          this.placingSingleRowFieldsForNestedAccordion(sectionName, fieldName);
        } else if (this.fileDownloadMap.has(fieldName)) {
          this.populateTableForNestedAccordion(fieldName);
        } else if (this.licenseMap.has(fieldName)) {
          this.populateEditTableForNestedAccordion(fieldName);
        } else {
          this.populateDataForNestedAccordion(sectionName, fieldName);
        }
      }
    }
    return [{ header: `${this.translateService.instant(subSectionName)}`, data: this.innerControlArray }];
  }

  placingSingleRowFieldsForNestedAccordion(sectionName: string, fieldName: string) {
    const valueData = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
    this.summaryDetailsMap.get(sectionName).get(fieldName).value : `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
    const masterValueData = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
    this.summaryDetailsMap.get(sectionName).get(fieldName).masterValue : `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
    let invalidValue = false;
    if (this.summaryDetailsMap.get(sectionName)) {
      invalidValue = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
      this.summaryDetailsMap.get(sectionName).get(fieldName).invalidValue : false;
    }
    if (valueData.length > 0) {
      if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) &&
          !this.eventTab && sectionName !== FccGlobalConstant.eventDetails && masterValueData.length > 0
           && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
           && this.subTnxType !== FccGlobalConstant.N003_INCREASE
           && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN) {
        this.innerControlArray.push({ label: `${this.translateService.instant(fieldName)}`, value: valueData,
        masterValue : masterValueData, fullWidth: true, valueStyle: [FccGlobalConstant.VALUE_STYLE], invalidValue, fieldName });
      } else {
        this.innerControlArray.push({ label: `${this.translateService.instant(fieldName)}`,
        value: valueData, fullWidth: true, valueStyle: [FccGlobalConstant.VALUE_STYLE], invalidValue, fieldName });
      }
    } else if (valueData.length === 0 ) {
       if (this.isMaster) {
         // Do nothing
       } else if (this.isMaster === false) {
           if ((this.transactionDetailtnxStatCode && this.transactionDetailtnxStatCode !== FccGlobalConstant.N004_ACKNOWLEDGED
             && this.transactionTab) &&
              (!(this.isEventInquirySections(sectionName)))) {
      this.innerControlArray.push({ label: `${this.translateService.instant(fieldName)}`,
      value: `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`, fullWidth: true,
              valueStyle: [FccGlobalConstant.VALUE_STYLE], invalidValue, fieldName });
              }
       } else {
        this.innerControlArray.push({ label: `${this.translateService.instant(fieldName)}`,
      value: `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`, fullWidth: true,
              valueStyle: [FccGlobalConstant.VALUE_STYLE], invalidValue, fieldName });
       }
    }
  }

  placingEditTableAccordion(sectionName: string, fieldName: string) {
    const control: FCCFormControl = this.licenseMap.get(fieldName);
    if (this.currencySymbolDisplayEnabled && fieldName === 'paymentsTable') {
      control[this.params].data = this.formatCurrency(control[this.params].data);
    }
    const showLabelView = control[FccGlobalConstant.PARAMS][FccGlobalConstant.SHOW_LABEL_VIEW];
    const displayTitle = control[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED];

    if (displayTitle) {
      this.itemArray.push({ label: `${this.translateService.instant(fieldName)}`,
      control, showLabelView, editableTableBlock: true });
    }
  }

  placingAccountDetailsTableAccordion(sectionName: string, fieldName: string) {
    const control: FCCFormControl = this.accountDetailsMap.get(fieldName);
    const showLabelView = control[FccGlobalConstant.PARAMS][FccGlobalConstant.SHOW_LABEL_VIEW];
    this.itemArray.push({ label: `${this.translateService.instant(fieldName)}`,
     control, showLabelView, editableTableBlock: true });
  }

  formatCurrency(data: any): any {
    for (let i = 0; i < data.length; i++) {
      if (data[i].amount.indexOf(' ') === -1) {
        data[i].amount = this.commonService.getCurrencySymbol(data[i].currency, data[i].amount);
      }
    }
    return data;
  }

  placingPaymentBatchDetailsTableAccordion(sectionName: string, fieldName: string) {
    const control: FCCFormControl = this.paymentBatchDetailsMap.get(fieldName);
    const showLabelView = control[FccGlobalConstant.PARAMS][FccGlobalConstant.SHOW_LABEL_VIEW];
    this.itemArray.push({ label: `${this.translateService.instant(fieldName)}`,
     control, showLabelView, editableTableBlock: true });
  }

  setGroupClubControlsForAccordion(isNestedAccordion: boolean, sectionName: string, fieldName: string) {
    // iterating the group head
    for (const [groupHeader, groupChildren] of this.groupItemsMap.get(fieldName)) {
      // Adding GroupHead in text control
      this.groupArray = [];
      let fullWidth;
      let hideGrpHeaderInView = false;
      let currency = '';
      let grpHead;
      if(this.dynamicHeaderField.has(fieldName)
      && this.commonService.isnonEMptyString(this.dynamicHeaderField.get(fieldName))){
        grpHead = groupHeader+'_'+this.dynamicHeaderField.get(fieldName);
      } else{
        grpHead = groupHeader;
      }
      groupChildren.forEach(groupChild => {
        // Handling Clubbing
        this.handleClubbedItems(sectionName, groupChild, fieldName);
        if (this.clubbedTrueFields.indexOf(groupChild) === -1 && !this.clubbeItemsMap.has(groupChild) &&
         this.summaryDetailsMap.get(sectionName).has(groupChild)) {
            let val = this.summaryDetailsMap.get(sectionName).get(groupChild).value;
            if (groupChild === 'currency') {
              currency = val;
            }
            if (val === '' && ((this.transactionDetailtnxStatCode &&
               this.transactionDetailtnxStatCode === FccGlobalConstant.N004_ACKNOWLEDGED)
            || (this.isMaster) || (this.isEventInquirySections(sectionName)))) {
              // Do Nothing
            } else if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
              this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) &&
               this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
               && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN
               && this.subTnxType !== FccGlobalConstant.N003_INCREASE && !this.eventTab &&
              sectionName !== FccGlobalConstant.eventDetails &&
              (this.operation === 'LIST_INQUIRY' || this.operation === FccGlobalConstant.PREVIEW) &&
              (this.amendNarrativeMap.has(sectionName) &&
              this.amendNarrativeMap.get(sectionName).indexOf(fieldName) !== -1)) {

                fullWidth = true;
                const tnxVal = this.summaryDetailsMap.get(sectionName).get(groupChild).value ?
                                this.summaryDetailsMap.get(sectionName).get(groupChild).value :
                                `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
                const fieldLabel = (this.summaryDetailsMap.get(sectionName).get(groupChild).label) ?
                (this.summaryDetailsMap.get(sectionName).get(groupChild).label) : grpHead;
                let invalidValue = false;
                if (this.summaryDetailsMap.get(sectionName)) {
                  invalidValue = this.summaryDetailsMap.get(sectionName).has(groupChild) ?
                  this.summaryDetailsMap.get(sectionName).get(groupChild).invalidValue : false;
                }
                this.groupArray.push({
                  label: `${this.translateService.instant(fieldLabel)}`,
                  value: tnxVal,
                  amendTnxSummaryStyle: (tnxVal === `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`) ?
                                        'valueStyle' : this.summaryDetailsMap.get(sectionName).get(groupChild).valStyleClass,
                  narrativeBlock: true,
                  invalidValue, fieldName: groupChild
                });
              } else {
              if (((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
                this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) &&
                 this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
                 && this.transactionDetailSubTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
                 && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN
                 && this.transactionDetailSubTnxType !== FccGlobalConstant.N003_DRAWDOWN
                 && this.subTnxType !== FccGlobalConstant.N003_INCREASE
                 && this.transactionDetailSubTnxType !== FccGlobalConstant.N003_INCREASE
                 && !this.eventTab && sectionName !== FccGlobalConstant.eventDetails
                 && this.operation !== FccGlobalConstant.PREVIEW && this.productCode !== FccGlobalConstant.PRODUCT_TD)
                 || this.amendedValue) {
                fullWidth = false;
                let masterVal = this.summaryDetailsMap.get(sectionName).get(groupChild).masterValue;
                const tnxVal = this.summaryDetailsMap.get(sectionName).get(groupChild).value;
                if(((sectionName === 'amountChargeDetails' || sectionName === 'siAmountChargeDetails' || sectionName === 'narrativeDetails')
                && (fieldName === 'amendmentChargesLabel' || fieldName === 'amendmentCharges' || fieldName === 'descOfGoodsText'))){
                    masterVal = tnxVal;
                }
                this.amendAccordionValues(masterVal, tnxVal, sectionName, fieldName);
                let invalidValue = false;
                if (this.summaryDetailsMap.get(sectionName)) {
                  invalidValue = this.summaryDetailsMap.get(sectionName).has(groupChild) ?
                  this.summaryDetailsMap.get(sectionName).get(groupChild).invalidValue : false;
                }
                this.groupArray.push({
                  label: `${this.translateService.instant(groupChild)}`,
                  value: this.tnxAccordionVal,
                  masterValue: this.masterAccordionVal,
                  amendSummaryStyle: this.amendStyle,
                  amendTnxSummaryStyle: this.amendTnxStyle,
                  invalidValue, fieldName: groupChild
                });
              } else if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
                this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) &&
                 this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
                 && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN
                 && this.subTnxType !== FccGlobalConstant.N003_INCREASE &&
                this.operation === FccGlobalConstant.PREVIEW && (this.amendNarrativeMap.has(sectionName) &&
                  this.amendNarrativeMap.get(sectionName).indexOf(fieldName) !== -1)) {
                fullWidth = true;
                const tnxVal = this.summaryDetailsMap.get(sectionName).get(groupChild).value ?
                  this.summaryDetailsMap.get(sectionName).get(groupChild).value :
                  `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
                let invalidValue = false;
                if (this.summaryDetailsMap.get(sectionName)) {
                  invalidValue = this.summaryDetailsMap.get(sectionName).has(groupChild) ?
                  this.summaryDetailsMap.get(sectionName).get(groupChild).invalidValue : false;
                }
                this.groupArray.push({
                  label: `${this.translateService.instant(groupChild)}`,
                  value: tnxVal,
                  narrativeBlock: true,
                  amendTnxSummaryStyle: 'valueStyle',
                  invalidValue, fieldName: groupChild
                });
              } else {
                fullWidth = false;
                if (this.summaryDetailsMap.get(sectionName).get(groupChild).type === FccGlobalConstant.SUMMARY_TEXT &&
                this.summaryDetailsMap.get(sectionName).get(groupChild).labelOnly) {
                  let invalidValue = false;
                  if (this.summaryDetailsMap.get(sectionName)) {
                    invalidValue = this.summaryDetailsMap.get(sectionName).has(groupChild) ?
                    this.summaryDetailsMap.get(sectionName).get(groupChild).invalidValue : false;
                  }
                  this.groupArray.push({
                    label: `${this.translateService.instant(groupChild)}`, value: '',
                    isSubHeader: true,
                    fullWidth: this.summaryDetailsMap.get(sectionName).get(groupChild).fullWidthView,
                    invalidValue, fieldName: groupChild
                  });
                } else {
                  let invalidValue = false;
                  if (this.summaryDetailsMap.get(sectionName)) {
                    invalidValue = this.summaryDetailsMap.get(sectionName).has(groupChild) ?
                    this.summaryDetailsMap.get(sectionName).get(groupChild).invalidValue : false;
                  }
                  if (groupChild === 'amountLimit' || groupChild === 'amount' || groupChild === 'paymentTransactionAmt') {
                    const curCode = groupChild === 'amount' ? currency : 'INR';
                    val = this.currencySymbolDisplayEnabled ?
                    this.commonService.getCurrencyFormatedAmountForPreview(curCode, val) : val;
                    this.groupArray.push({
                      label: `${this.translateService.instant(groupChild)}`,
                      value: val ? val : `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`,
                      fullWidth: this.summaryDetailsMap.get(sectionName).get(groupChild).fullWidthView,
                      invalidValue,
                      fieldName: groupChild
                    });
                  } else if(this.summaryDetailsMap.get(sectionName).get(groupChild).type === FccGlobalConstant.selectButton
                  && this.commonService.checkCashProduct(this.productCode,this.subProductCode)) {
                    this.handleChips(val, this.summaryDetailsMap.get(sectionName).get(groupChild).label, sectionName, invalidValue);
                  } else {
                  this.groupArray.push({
                    label: `${this.translateService.instant(groupChild)}`,
                    value: val ? this.summaryDetailsMap.get(sectionName).get(groupChild).value :
                      `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`,
                    fullWidth: this.summaryDetailsMap.get(sectionName).get(groupChild).fullWidthView,
                    invalidValue,
                    fieldName: groupChild
                  });
                }
                }

              }
            }
        }
      });
      let invalidValue1 = false;
      if (this.summaryDetailsMap.get(sectionName)) {
        invalidValue1 = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
        this.summaryDetailsMap.get(sectionName).get(fieldName).invalidValue : false;
      }
      if (this.groupArray.length > 0 && isNestedAccordion) {
        if (this.hideGrpHeaderList.indexOf(fieldName) !== -1) {
          hideGrpHeaderInView = true;
        }
        this.innerControlArray.push({ panelHead: `${this.translateService.instant(grpHead)}`, panelValue: this.groupArray,
        narrativeFullWidth: fullWidth, hideGrpHeaderInView, invalidValue: invalidValue1, fieldName });
      } else if (this.groupArray.length > 0) {
        if (this.hideGrpHeaderList.indexOf(fieldName) !== -1) {
          hideGrpHeaderInView = true;
        }
        this.itemArray.push({ panelHead: `${this.translateService.instant(grpHead)}`, panelValue: this.groupArray,
        narrativeFullWidth: fullWidth, hideGrpHeaderInView, invalidValue: invalidValue1, fieldName });

      }

     }
  }

  handleChips(val: string, key: string, sectionName: string, invalidValue: boolean) {
    val.split(';').forEach((ele, i) => {
      this.groupArray.push({
        label: `${this.translateService.instant(key)} ${i + 1}`, value: ele ? ele :
        `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`,
          fullWidth: this.summaryDetailsMap.get(sectionName).get(key)?.fullWidthView, invalidValue, fieldName: key
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleClubbedItems(sectionName: string, groupChild: string, groupHeader: string) {
    if (this.clubbeItemsMap.has(groupChild) && this.clubbedDetailsMap.get(sectionName).has(groupChild)) {
      const val = this.clubbedDetailsMap.get(sectionName).get(groupChild).value;
      if (val !== undefined && val === '' &&
      ((this.transactionDetailtnxStatCode && this.transactionDetailtnxStatCode === FccGlobalConstant.N004_ACKNOWLEDGED)
       || (this.isMaster) ||
                                (this.isEventInquirySections(sectionName)))) {
    // Do Nothing
      } else {
        if (this.groupArray && this.groupArray.length >= FccGlobalConstant.LENGTH_0 ) {
          const exist = this.groupArray.filter( task => task.label === this.translateService.instant(this.clubbeItemsMap.
            get(groupChild).keys().next().value));
          if (exist.length === FccGlobalConstant.LENGTH_0) {
            if (((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
                this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) && !this.eventTab &&
                sectionName !== FccGlobalConstant.eventDetails &&
                sectionName !== FccGlobalConstant.LN_INCREASE &&
                this.operation !== FccGlobalConstant.PREVIEW
                 && this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
                 && this.subTnxType !== FccGlobalConstant.N003_INCREASE
                 && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN) || this.amendedValue) {
              const masterVal = this.clubbedDetailsMap.get(sectionName).get(groupChild).masterValue;
              const tnxVal = this.clubbedDetailsMap.get(sectionName).get(groupChild).value;
              this.amendAccordionValues(masterVal, tnxVal, sectionName, groupChild);
              let invalidValue = false;
              let clubbedInvalidField = false;
              if (this.clubbedDetailsMap.get(sectionName)) {
                invalidValue = this.clubbedDetailsMap.get(sectionName).has(groupChild) ?
                this.clubbedDetailsMap.get(sectionName).get(groupChild).invalidValue : false;
                clubbedInvalidField = this.clubbedDetailsMap.get(sectionName).has(groupChild) ?
                this.clubbedDetailsMap.get(sectionName).get(groupChild).clubbedInvalidField : false;
              }
              this.groupArray.push({
                label: this.translateService.instant(this.clubbeItemsMap.get(groupChild).keys().next().value),
                  value: this.tnxAccordionVal,
                  masterValue: this.masterAccordionVal,
                  amendSummaryStyle: this.amendStyle,
                  amendTnxSummaryStyle: this.amendTnxStyle,
                  invalidValue, fieldName: groupChild, clubbedInvalidField
              });
            }
            // else if (this.hideGrpHeaderList.indexOf(groupHeader) !== -1) {
            //     const labelName = this.translateService.instant(this.clubbeItemsMap.
            //       get(groupChild).keys().next().value);
            //     this.itemArray.push({
            //       label: labelName ? `${this.translateService.instant(labelName)}` : '',
            //       value: val ? val :
            //         `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`
            //     });
            // }
            else {
              let invalidValue = false;
              let clubbedInvalidField = false;
              if (this.clubbedDetailsMap.get(sectionName)) {
                invalidValue = this.clubbedDetailsMap.get(sectionName).has(groupChild) ?
                this.clubbedDetailsMap.get(sectionName).get(groupChild).invalidValue : false;
                clubbedInvalidField = this.clubbedDetailsMap.get(sectionName).has(groupChild) ?
                this.clubbedDetailsMap.get(sectionName).get(groupChild).clubbedInvalidField : false;
              }
              this.groupArray.push({
                label: this.translateService.instant(this.clubbeItemsMap.get(groupChild).keys().next().value),
                value: val ? this.clubbedDetailsMap.get(sectionName)
                    .get(groupChild).value : `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`, invalidValue,
                    fieldName: groupChild, clubbedInvalidField
              });
            }
          }
      }
      }
    }
  }

  placingSingleRowFieldsAccordion(sectionName: string, fieldName: string) {
    const valueData = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
    this.summaryDetailsMap.get(sectionName).get(fieldName).value : `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
    const masterValueData = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
    this.summaryDetailsMap.get(sectionName).get(fieldName).masterValue : `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
    let invalidValue = false;
    if (this.summaryDetailsMap.get(sectionName)) {
      invalidValue = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
      this.summaryDetailsMap.get(sectionName).get(fieldName).invalidValue : false;
    }
    if (valueData.length > 0) {
      if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) &&
          this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
          && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN
          && this.subTnxType !== FccGlobalConstant.N003_INCREASE &&
          !this.eventTab && sectionName !== FccGlobalConstant.eventDetails && masterValueData.length > 0) {
        this.itemArray.push({ label: `${this.translateService.instant(fieldName)}`, value: valueData,
        masterValue : masterValueData, fullWidth: true, invalidValue, fieldName });
      } else {
        if (this.summaryDetailsMap.get(sectionName).get(fieldName)
          && this.summaryDetailsMap.get(sectionName).get(fieldName).type === FccGlobalConstant.SUMMARY_TEXT &&
          this.summaryDetailsMap.get(sectionName).get(fieldName).labelOnly) {
          this.itemArray.push({
            label: `${this.translateService.instant(fieldName)}`, value: '',
            isSubHeader: true, fullWidth: true, invalidValue, fieldName
          });
        } else if (this.summaryDetailsMap.get(sectionName).get(fieldName)
          && this.summaryDetailsMap.get(sectionName).get(fieldName).valueOnly) {
          this.itemArray.push({
            label: '', value: valueData,
            fullWidth: true, invalidValue, fieldName
          });
        } else if (this.summaryDetailsMap.get(sectionName).get(fieldName)) {
          this.itemArray.push({
            label: `${this.translateService.instant(fieldName)}`,
            value: valueData, fullWidth: true, invalidValue,
            setContentWidth: this.summaryDetailsMap.get(sectionName).get(fieldName).setContentWidth,
          fieldName });
        }
      }
    } else if (valueData.length === 0 && !this.isMaster && ((this.transactionDetailtnxStatCode &&
      this.transactionDetailtnxStatCode !== FccGlobalConstant.N004_ACKNOWLEDGED && this.transactionTab &&
      !this.isEventInquirySections(sectionName)) || (this.mode !== FccGlobalConstant.VIEW_MODE && !this.isMasterView))) {
        this.itemArray.push({
          label: `${this.translateService.instant(fieldName)}`,
          value: `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`, fullWidth: true, invalidValue, fieldName
        });
    }
  }
  callAccordionData(sectionName: string, fieldName: string) {
    this.shipmentSections = [FccGlobalConstant.EARLIEST_SHIPMENT_DATE, FccGlobalConstant.LAST_SHIPMENT_DATE,
      FccGlobalConstant.PERIOD_SHIPMENT_TEXT, FccGlobalConstant.VALUE_SHIPMENT_PERIOD, FccGlobalConstant.SHIP_NAME];
      if (this.shipmentSections.includes(fieldName)){
        this.isShipmentValue = true;
      }
    if (this.clubbeItemsMap.has(fieldName) && this.clubbedDetailsMap.get(sectionName).has(fieldName)) {
      const val = this.clubbedDetailsMap.get(sectionName).get(fieldName).value;
      if (val !== undefined && val === '' &&
        ((this.transactionDetailtnxStatCode && this.transactionDetailtnxStatCode === FccGlobalConstant.N004_ACKNOWLEDGED) ||
          (this.isMaster) || (this.isEventInquirySections(sectionName)))
      ) {
        // Do Nothing
      } else {
        let invalidValue = false;
        let clubbedInvalidField = false;
        if (this.clubbedDetailsMap.get(sectionName)) {
        invalidValue = this.clubbedDetailsMap.get(sectionName).has(fieldName) ?
        this.clubbedDetailsMap.get(sectionName).get(fieldName).invalidValue : false;
        clubbedInvalidField = this.clubbedDetailsMap.get(sectionName).has(fieldName) ?
          this.clubbedDetailsMap.get(sectionName).get(fieldName).clubbedInvalidField : false;
        }
        this.itemArray.push({
          label: this.translateService.instant(this.clubbeItemsMap.get(fieldName).keys().next().value),
          value: val !== '' ? this.clubbedDetailsMap.get(sectionName).get(fieldName).value :
           `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`,
          invalidValue, fieldName, clubbedInvalidField
        });
      }
    } else if (this.clubbedTrueFields.indexOf(fieldName) === -1 && !this.clubbeItemsMap.has(fieldName) &&
    this.summaryDetailsMap.get(sectionName).has(fieldName) && this.summaryDetailsMap.get(sectionName).get(fieldName)) {
      const labelName = this.summaryDetailsMap.get(sectionName).get(fieldName).label;
      if (((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
        this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) &&
        this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
        && this.transactionDetailSubTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
        && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN
        && this.transactionDetailSubTnxType !== FccGlobalConstant.N003_DRAWDOWN
        && this.subTnxType !== FccGlobalConstant.N003_INCREASE
        && this.transactionDetailSubTnxType !== FccGlobalConstant.N003_INCREASE && this.productCode !== FccGlobalConstant.PRODUCT_TD
        && !this.eventTab && !this.summaryDetailsMap.get(sectionName).get(fieldName).isNotRequiredForComparison &&
        sectionName !== FccGlobalConstant.eventDetails) ||
        (this.amendedValue && !this.summaryDetailsMap.get(sectionName).get(fieldName).isNotRequiredForComparison)) {
        const masterVal = this.summaryDetailsMap.get(sectionName).get(fieldName).masterValue;
        const tnxVal = this.summaryDetailsMap.get(sectionName).get(fieldName).value;
        this.amendAccordionValues(masterVal, tnxVal, sectionName, fieldName);
        let invalidValue = false;
        if (this.summaryDetailsMap.get(sectionName)) {
          invalidValue = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
          this.summaryDetailsMap.get(sectionName).get(fieldName).invalidValue : false;
        }
        this.itemArray.push({
          label: labelName ? `${this.translateService.instant(labelName)}` : '',
          value: this.tnxAccordionVal,
          masterValue: this.masterAccordionVal,
          amendSummaryStyle: this.amendStyle,
          amendTnxSummaryStyle: this.amendTnxStyle,
          invalidValue, fieldName
        });
      } else {
        const val = this.summaryDetailsMap.get(sectionName).get(fieldName).value;
        if ((val !== undefined && val === '' && ((this.transactionDetailtnxStatCode &&
            this.transactionDetailtnxStatCode === FccGlobalConstant.N004_ACKNOWLEDGED) ||
          (this.isMaster) || (this.isEventInquirySections(sectionName))))
          && this.checkViewDisplayField(sectionName, fieldName)) {
          // Do Nothing
        } else {
          this.itemArrayFieldPush(labelName, val, sectionName, fieldName);
        }
      }
    }
  }

  protected itemArrayFieldPush(labelName: string, val: string, sectionName: string, fieldName: string) {
    let invalidValue = false;
    if (this.summaryDetailsMap.get(sectionName)) {
      invalidValue = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
      this.summaryDetailsMap.get(sectionName).get(fieldName).invalidValue : false;
    }
    if (this.summaryDetailsMap.get(sectionName).get(fieldName).valueOnly) {
      this.itemArray.push({
        label: '',
        value: val ? this.summaryDetailsMap.get(sectionName).get(fieldName).value :
          `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`,
        invalidValue, fieldName
      });
    } else if (fieldName === FccGlobalConstant.VIEW){
      // DO Nothing
      // View Button should not have any value
    } else {
      val = this.summaryDetailsMap.get(sectionName).get(fieldName).value;
      if (val !== undefined && val === '' && this.isShipmentValue) {
        // Do Nothing
       } else {
        this.itemArray.push({
        label: labelName ? `${this.translateService.instant(labelName)}` : '',
        value: val ? this.summaryDetailsMap.get(sectionName).get(fieldName).value :
          `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`,
        invalidValue, fieldName, fullWidth: this.summaryDetailsMap.get(sectionName).get(fieldName).fullWidthView,
        isHyperLink: this.summaryDetailsMap.get(sectionName).get(fieldName).isHyperLink
      });
    }
  }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickViewSpecimenHyperLink(event) {
    if (this.productCode === FccGlobalConstant.PRODUCT_BG) {
      this.uiProductService.viewSpecimenHyperLink();
    }
    else if (this.productCode === FccGlobalConstant.PRODUCT_SI) {
      this.siProductService.viewSpecimenHyperLink();
    }
  }

  navigateAway(event, sectionName, fieldName, clubbedFieldName) {
    if (clubbedFieldName) {
      this.commonService.isEditClicked(sectionName + '_' + clubbedFieldName);
    } else {
      this.commonService.isEditClicked(sectionName + '_' + fieldName);
    }
  }

  protected checkViewDisplayField(sectionName: any, fieldName: any) {
    let viewDisplayedFieldExists = true;
    if ((this.mode === FccGlobalConstant.VIEW_SCREEN && this.operation === FccGlobalConstant.PREVIEW &&
         this.viewDisplayItemsMap.has(fieldName) &&
      this.viewDisplayItemsMap.get(fieldName).indexOf(sectionName) !== -1)) {
      viewDisplayedFieldExists = false;
    }
    return viewDisplayedFieldExists;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  amendAccordionValues(masterVal: string, tnxVal: string, sectionName: string, fieldName: string) {
    if (masterVal !== null && masterVal !== undefined && masterVal !== FccGlobalConstant.EMPTY_STRING &&
      tnxVal !== null && tnxVal !== undefined && tnxVal !== FccGlobalConstant.EMPTY_STRING && masterVal === tnxVal) {
        this.masterAccordionVal = masterVal;
        this.tnxAccordionVal = FccGlobalConstant.EMPTY_STRING;
        this.amendStyle = 'valueAccordionStyle';
        this.amendTnxStyle = 'valueAccordionStyle';
    } else if (masterVal !== null && masterVal !== undefined && masterVal !== FccGlobalConstant.EMPTY_STRING &&
      tnxVal !== null && tnxVal !== undefined && tnxVal !== FccGlobalConstant.EMPTY_STRING && masterVal !== tnxVal) {
        this.masterAccordionVal = masterVal;
        this.tnxAccordionVal = tnxVal;
        this.amendStyle = 'masterAccordionStyle';
        this.amendTnxStyle = 'tnxAccordionStyle';
    } else if ((masterVal === null || masterVal === undefined || masterVal === FccGlobalConstant.EMPTY_STRING) &&
      tnxVal !== null && tnxVal !== undefined && tnxVal !== FccGlobalConstant.EMPTY_STRING ) {
        this.masterAccordionVal = `${this.translateService.instant('summarymasterempty')}`;
        this.tnxAccordionVal = tnxVal;
        this.amendStyle = 'masterAccordionStyle';
        this.amendTnxStyle = 'tnxAccordionStyle';
    } else {
        this.masterAccordionVal = `${this.translateService.instant('summarymasterempty')}`;
        this.tnxAccordionVal = FccGlobalConstant.EMPTY_STRING;
        this.amendStyle = 'valueAccordionStyle';
        this.amendTnxStyle = 'valueAccordionStyle';
    }
  }
  placingFileDownloadFieldsAccordion(sectionName: string, fieldName: string) {
    const control: FCCFormControl = this.fileDownloadMap.get(fieldName);
    const isMTBBankAttachment = control[FccGlobalConstant.PARAMS].bankAttachmentPreview &&
    control[FccGlobalConstant.PARAMS].data.length === 0;
    const showLabelView = control[FccGlobalConstant.PARAMS][FccGlobalConstant.SHOW_LABEL_VIEW];
    const previewTableStyle = control[FccGlobalConstant.PARAMS][`previewTableStyle`] !== undefined ?
    control[FccGlobalConstant.PARAMS][`previewTableStyle`] : 'fullRowStyleAttachment';
    const noPreviewActions = control[FccGlobalConstant.PARAMS][`noPreviewActions`];
    if (!isMTBBankAttachment)
      {
        switch (fieldName) {
          case FccGlobalConstant.FEECHARGES:
          case FccGlobalConstant.DOCUMENTS:
            this.itemArray.push({ label: `${this.translateService.instant(fieldName)}`, control: this.fileDownloadMap.get(fieldName),
            feesAndChargesBlock: true });
            break;
          case 'interestPayments':
            this.itemArray.push(
              {
                label: `${this.translateService.instant(fieldName)}`,
                showLabelView, control, previewTableStyle, bkVariationsBlock: true
              }
            );
            break;
          case FccGlobalConstant.CHILD_REFERENCE:
            if (control[FccGlobalConstant.PARAMS].data.length > 0 && this.tnxId === undefined) {
              this.itemArray.push({ control: this.fileDownloadMap.get(fieldName), childReferencesBlock: true });
            }
            break;
          case 'bgVariations':
          case 'irregularVariations':
            this.itemArray.push({ label: `${this.translateService.instant(fieldName)}`, showLabelView, control, bgVariationsBlock: true });
            break;
          case FccGlobalConstant.BANK_ATTACHMENT_TABLE:
            this.itemArray.push({ label: `${this.translateService.instant(fieldName)}`, showLabelView, control,
            bankAttachmentsBlock: true });
            break;
          case FccGlobalConstant.FILE_UPLOAD_TABLE:
            this.itemArray.push({ label: `${this.translateService.instant(fieldName)}`, showLabelView, control,
            attachmentBlock: true });
            break;
          case FccGlobalConstant.ROLLED_OVER_FROM:
          case FccGlobalConstant.ROLLED_OVER_TO:
            if (control[FccGlobalConstant.PARAMS].data.length > 0) {
              this.itemArray.push({ control: this.fileDownloadMap.get(fieldName), bulkReferenceBlock: true,
                fullWidth: false, isFromPreviewScreen: this.transactionTab });
            }
            break;
          default:
            this.itemArray.push(
              {
                label: `${this.translateService.instant(fieldName)}`, showLabelView, control,
                previewTableStyle, noPreviewActions, attachmentBlock: true
              }
            );
            break;
        }
      }
  }

  populateCardData(fieldName: string) {
    const control: FCCFormControl = this.cardDataMap.get(fieldName);
    if (control[this.params][this.options] !== undefined) {
      this.itemArray.push({ label: `${this.translateService.instant(fieldName)}`, control,
      cardBlock: true });
    }
  }

  // addFileDownloadFieldsControlAccordion(fieldName: string, flag: boolean) {
  //   if (flag && fieldName !== FccGlobalConstant.FEECHARGES && fieldName !== FccGlobalConstant.DOCUMENTS &&
  //     fieldName !== 'bgVariations' && fieldName !== FccGlobalConstant.BANK_ATTACHMENT_TABLE) {
  //     this.itemArray.push({label: ``,
  //      control: this.fileDownloadMap.get(fieldName), attachmentBlock: true});
  //   }
  //   if (flag && (fieldName === FccGlobalConstant.FEECHARGES || fieldName === FccGlobalConstant.DOCUMENTS)) {
  //     this.itemArray.push({label: ``,
  //      control: this.fileDownloadMap.get(fieldName), feesAndChargesBlock: true});
  //   }
  //   if (flag && (fieldName === 'bgVariations' || fieldName === 'irregularVariations')) {
  //     this.itemArray.push({label: `${this.translateService.instant(fieldName)}`,
  //      control: this.fileDownloadMap.get(fieldName), bgVariationsBlock: true});
  //   }
  //   if (flag && (fieldName === FccGlobalConstant.BANK_ATTACHMENT_TABLE)) {
  //     this.itemArray.push({label: ``,
  //      control: this.fileDownloadMap.get(fieldName), bankAttachmentsBlock: true});
  //   }
  // }

  placingRemInstTableAccordion(sectionName: string, fieldName: string) {
    this.itemArray.push({ label: `${this.translateService.instant(fieldName)}`,
      control: this.remInstMap.get(fieldName), remInstBlock: true });
  }
  placingPOAccordion(sectionName: string, fieldName: string) {
    this.itemArray.push({ label: `${this.translateService.instant(fieldName)}`,
      control: this.pOMap.get(fieldName), poBlock: true });
  }

  populateTableForNestedAccordion(fieldName: string) {
    const isBankAttachment = this.fileDownloadMap.get(fieldName)[FccGlobalConstant.PARAMS].bankAttachmentPreview
    && this.fileDownloadMap.get(fieldName)[FccGlobalConstant.PARAMS].data.length === 0;

    if (!isBankAttachment) {
    switch (fieldName) {
      case FccGlobalConstant.FEECHARGES:
      case FccGlobalConstant.DOCUMENTS:
        this.innerControlArray.push({ label: `${this.translateService.instant(fieldName)}`,
       control: this.fileDownloadMap.get(fieldName), feesAndChargesBlock: true });
        break;
      case FccGlobalConstant.CHILD_REFERENCE:
        this.innerControlArray.push({ label: `${this.translateService.instant(fieldName)}`,
         control: this.fileDownloadMap.get(fieldName), childReferencesBlock: true });
        break;
      case 'bgVariations':
      case 'irregularVariations':
        this.innerControlArray.push({ label: `${this.translateService.instant(fieldName)}`,
        control: this.fileDownloadMap.get(fieldName), bgVariationsBlock: true });
        break;
      case 'cuIrregularVariations':
        this.innerControlArray.push({ label: `${this.translateService.instant(fieldName)}`,
        control: this.fileDownloadMap.get(fieldName), cuVariationsBlock: true });
        break;
      default:
        this.innerControlArray.push({ label: `${this.translateService.instant(fieldName)}`,
        control: this.fileDownloadMap.get(fieldName), attachmentBlock: true });

    }
  }
}

populateEditTableForNestedAccordion(fieldName: string) {
  this.innerControlArray.push({ label: `${this.translateService.instant(fieldName)}`,
     control: this.licenseMap.get(fieldName), editableTableBlock: true });
}

populateDataForNestedAccordion(sectionName: string, fieldName: string) {
  if (this.clubbeItemsMap.has(fieldName) && this.clubbedDetailsMap.get(sectionName).has(fieldName)) {
    this.populateClubbedItems(true, sectionName, fieldName);
  } else if (this.summaryDetailsMap.get(sectionName).has(fieldName) && this.summaryDetailsMap.get(sectionName).get(fieldName)) {
    this.populateNonClubbedItems(true, sectionName, fieldName);
  }
}

  populateClubbedItems(isNestedAccordion: boolean, sectionName: string, fieldName: string) {
    const isLiveTnx = this.transactionDetailtnxStatCode && this.transactionDetailtnxStatCode === FccGlobalConstant.N004_ACKNOWLEDGED;
    const isEventDetails = (sectionName === 'eventDetails');
    const val = this.clubbedDetailsMap.get(sectionName).get(fieldName).value;
    let invalidValue = false;
    let clubbedInvalidField = false;
    if (this.clubbedDetailsMap.get(sectionName)) {
      invalidValue = this.clubbedDetailsMap.get(sectionName).has(fieldName) ?
        this.clubbedDetailsMap.get(sectionName).get(fieldName).invalidValue : false;
      clubbedInvalidField = this.clubbedDetailsMap.get(sectionName).has(fieldName) ?
      this.clubbedDetailsMap.get(sectionName).get(fieldName).clubbedInvalidField : false;
    }
    if (val !== undefined && val === '' && (isLiveTnx || this.isMaster || isEventDetails)) {
        // Do Nothing
      } else {
        if (isNestedAccordion) {
          this.innerControlArray.push({
            label: this.translateService.instant(this.clubbeItemsMap.get(fieldName).keys().next().value),
            value: val !== '' ? this.clubbedDetailsMap.get(sectionName).get(fieldName).value :
            `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`, invalidValue, fieldName, clubbedInvalidField
          });
        } else {
          this.itemArray.push({
            label: this.translateService.instant(this.clubbeItemsMap.get(fieldName).keys().next().value),
            value: val !== '' ? this.clubbedDetailsMap.get(sectionName).get(fieldName).value :
              `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`,
            invalidValue, fieldName, clubbedInvalidField
          });
        }
     }
  }

  populateNonClubbedItems(isNestedAccordion: boolean, sectionName: string, fieldName: string) {
    const labelName = this.summaryDetailsMap.get(sectionName).get(fieldName).label;
    let invalidValue = false;
    this.isShipmentValue = false;
    if (this.summaryDetailsMap.get(sectionName)) {
      invalidValue = this.summaryDetailsMap.get(sectionName).has(fieldName) ?
      this.summaryDetailsMap.get(sectionName).get(fieldName).invalidValue : false;
    }
    const isLiveTnx = this.transactionDetailtnxStatCode && this.transactionDetailtnxStatCode === FccGlobalConstant.N004_ACKNOWLEDGED;
    const isEventDetails = (sectionName === 'eventDetails');
    this.shipmentSections = [FccGlobalConstant.SHIPMENT_EARLIEST_DATE, FccGlobalConstant.SHIPMENT_LAST_DATE,
                            FccGlobalConstant.SHIPMENT_PERIOD_TEXT];
    this.shipmentSections.forEach(shipmentSection => {
      if(shipmentSection === fieldName){
        this.isShipmentValue = true;
      }
    });
    if (((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
      this.transactionDetailtnxTypeCode === FccGlobalConstant.N002_AMEND) &&
      this.subTnxType !== FccGlobalConstant.N003_AMEND_RELEASE
      && this.subTnxType !== FccGlobalConstant.N003_DRAWDOWN
      && this.subTnxType !== FccGlobalConstant.N003_INCREASE && !this.eventTab &&
      this.operation !== FccGlobalConstant.PREVIEW && sectionName !== FccGlobalConstant.eventDetails) || this.amendedValue) {
      let masterVal = this.summaryDetailsMap.get(sectionName).get(fieldName).masterValue;
      const tnxVal = this.summaryDetailsMap.get(sectionName).get(fieldName).value;
      masterVal = this.setMasterFieldDataIfEmpty(masterVal, tnxVal);
      this.amendAccordionValues(masterVal, tnxVal, sectionName, fieldName);
      if (isNestedAccordion) {
        this.innerControlArray.push({
          label: labelName ? `${this.translateService.instant(labelName)}` : '',
          value: this.tnxAccordionVal,
          masterValue: this.masterAccordionVal,
          amendSummaryStyle: this.amendStyle,
          amendTnxSummaryStyle: this.amendTnxStyle,
          invalidValue, fieldName
        });
      } else {
        this.itemArray.push({
          label: labelName ? `${this.translateService.instant(labelName)}` : '',
          value: this.tnxAccordionVal,
          masterValue: this.masterAccordionVal,
          amendSummaryStyle: this.amendStyle,
          amendTnxSummaryStyle: this.amendTnxStyle,
          invalidValue, fieldName
        });
      }
    } else {
      const val = this.summaryDetailsMap.get(sectionName).get(fieldName).value;
      if (val !== undefined && val === '' && (isLiveTnx || this.isMaster || isEventDetails || this.isShipmentValue)) {
              // Do Nothing
              } else {
      this.innerControlArray.push({
        label: labelName ? `${this.translateService.instant(labelName)}` : '',
        value: val ? val : `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`,
        valueStyle: [FccGlobalConstant.VALUE_STYLE], invalidValue, fieldName
      });
    }
  }
  }

  checkPreviewDynamicCriteria(sectionName: string, presentControlName: string, previewScreenCriteria: any) {
    const presentSectionForm: FCCFormGroup =
      this.stateService.getSectionData(sectionName, undefined, this.master, this.stateType);
    const presentControl = this.getConntrolFromfieldsControl(sectionName, presentControlName, presentSectionForm.controls);
    if (previewScreenCriteria && previewScreenCriteria !== undefined && previewScreenCriteria instanceof Object) {
      const dependantControlName = previewScreenCriteria[FccGlobalConstant.DC_DEPENDANT_CONTROL];
      const dependantSectionName = previewScreenCriteria[FccGlobalConstant.DC_DEPENDANT_SECTION];
      const dependantSectionForm: FCCFormGroup =
      this.stateService.getSectionData(dependantSectionName, undefined, this.master, this.stateType);
      const dependentcontrol = this.getConntrolFromfieldsControl(dependantSectionName, dependantControlName, dependantSectionForm.controls);
      const dependentcontrolValue = (dependentcontrol && this.commonService.isNonEmptyValue(dependentcontrol.value)) ?
      dependentcontrol.value : null ;
      if (previewScreenCriteria[this.requiredValues] && previewScreenCriteria[this.requiredValues] instanceof Array) {
        for (const value of previewScreenCriteria[this.requiredValues]) {
          if (dependentcontrolValue && value === dependentcontrolValue) {
            presentControl[this.params][this.previewScreen] = true;
            presentControl.updateValueAndValidity();
            break;
          } else {
            presentControl[this.params][this.previewScreen] = false;
          }
        }
    } else if (previewScreenCriteria[this.notRequiredValue]) { // Hide the present control if the value is equal
      if (dependentcontrolValue && dependentcontrolValue === previewScreenCriteria[this.notRequiredValue]) {
        presentControl[this.params][this.previewScreen] = false;
      }

    } else if (previewScreenCriteria[this.requiredValue]) {
      if (dependentcontrolValue && previewScreenCriteria[this.requiredValue] === dependentcontrolValue) {
        presentControl[this.params][this.previewScreen] = true;
      } else {
        presentControl[this.params][this.previewScreen] = false;
      }
    } else if (previewScreenCriteria[this.viceversaCheck] && dependentcontrolValue) {
      if (dependentcontrolValue !== undefined && dependentcontrolValue !== '' && dependentcontrolValue !== null) {
        presentControl[this.params][this.previewScreen] = false;
      } else {
        presentControl[this.params][this.previewScreen] = true;
      }
      dependentcontrol.updateValueAndValidity();
    }
  } else {
    presentControl[this.params][this.previewScreen] = true;
  }
    presentControl.updateValueAndValidity();
  }

  getSubSectionFields(hiddenFields, prefix) {
    const subSectionFieldsList: string[] = [];
    Object.keys(hiddenFields).forEach(fieldName => {
        const nameOfField = this.groupClubService.getProperFieldName(prefix, hiddenFields[fieldName]);
        subSectionFieldsList.push(nameOfField.toLowerCase());
      });
    return subSectionFieldsList;
  }

  isHiddenField(dependentObject, controlName) {
    if (dependentObject[this.isSubsectionModel] && dependentObject[this.isSubsectionModel] === 'Y' && dependentObject[this.hideFields]) {
      const hiddenFields = dependentObject[this.hideFields];
      const prefix = dependentObject[this.prefix];
      const subSectionFieldsList = this.getSubSectionFields(hiddenFields, prefix);
      if (subSectionFieldsList.indexOf(controlName.toLowerCase()) > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
   }
  }

  checkSectionConfiguration(form: FCCFormGroup, section) {
      let isEnabled = true;
      if ((this.listOfLicenseSections.indexOf(section) > -1) && !this.enableLicenseSection) {
        isEnabled = false;
        form[this.rendered] = false;
      }
      return isEnabled;
  }


  checkSectionDynamicCriteria(form: FCCFormGroup) {
    if (form && form.dynamicRenderCriteria){
      const dependantControlName = form.dynamicRenderCriteria[FccGlobalConstant.DC_DEPENDANT_CONTROL];
      const dependantSectionName = form.dynamicRenderCriteria[FccGlobalConstant.DC_DEPENDANT_SECTION];
      const dependantSectionForm: FCCFormGroup =
      this.stateService.getSectionData(dependantSectionName, undefined, this.master, this.stateType);
      const dependentcontrol =
      this.getConntrolFromfieldsControl(dependantSectionName, dependantControlName, dependantSectionForm.controls);
      const dependentcontrolValue = this.formControlService.getFieldControlValue(dependentcontrol);
      if (form.dynamicRenderCriteria[this.requiredValues] && form.dynamicRenderCriteria[this.requiredValues] instanceof Array) {
          if (form.dynamicRenderCriteria[this.requiredValues].indexOf(dependentcontrolValue) === -1) {
            form[this.rendered] = false;
            form.updateValueAndValidity();
            return false;
          }
    } else if (form.dynamicRenderCriteria[this.requiredValue] &&
       form.dynamicRenderCriteria[this.requiredValue] !== dependentcontrolValue) {
        form[this.rendered] = false;
        form.updateValueAndValidity();
        return false;
    } else if (form.dynamicRenderCriteria[this.hideIfEmpty] && !(this.commonService.isNonEmptyValue(dependentcontrolValue)
    && dependentcontrolValue !== '')) {
        form[this.rendered] = false;
        return false;
    }
      form[this.rendered] = true;
      form.updateValueAndValidity();
}
    return true;
}

  setMasterFieldDataIfEmpty(masterFiledData, tnxFieldData) {
    if (masterFiledData === '') {
      masterFiledData = tnxFieldData;
      return masterFiledData;
    }
    return masterFiledData;
  }

  onClickView(){
    this.tableService.onClickView(null, this.taskService.getTnxResponseObj());
  }

  onClickEyeIcon(event, key, index, rowData){
    this.dialog.closeAll();
    const formData = this.commonService.getBatchFormData()[index];
    const dialogRef: MatDialogRef<ListdefModalComponent> = this.dialog.open(
      ListdefModalComponent, {
      backdropClass: 'cdk-overlay-coloured-backdrop',
      hasBackdrop: true,
      data: {
        data: this.createBatchViewJson(formData, index),
        rowData: rowData,
        heading:  FccGlobalConstant.INSTRUMENT_DETAILS,
        actionResponse: [],
        formData: formData
      }
    });
    return dialogRef;
  }

  createBatchViewJson(controls, index){
    const result = {};
    Object.keys(controls).forEach(key =>{
      if(controls[key][this.params]?.previewScreen && controls[key].type !== FccGlobalConstant.TEXT
          && controls[key][this.params]?.grouphead !== FccGlobalConstant.FCM_FIELD_PAYER &&
          !FccGlobalConstant.EXCLUDED_PAYMENT_DETAILS_FIELD.includes(key)){
        if(this.commonService.isNonEmptyValue(controls[key]?.value) && controls[key].type !== FccGlobalConstant.inputDate
            && typeof(controls[key]?.value) === FccGlobalConstant.OBJECT){
          result[key] = controls[key]?.value.shortName;
        } else if (controls[key].type === FccGlobalConstant.inputDate) {
          result[key] = this.utilityService.transformDateFormat(controls[key]?.value);
        } else {
          if (key === 'rejectReasons' && this.commonService.isEmptyValue(controls[key]?.value)) {
            //result[key] = controls[key]?.value;
          } else {
            result[key] = this.commonService.isnonEMptyString(controls[key]?.value) ? controls[key]?.value :
                        `${this.translateService.instant(FccGlobalConstant.NOT_ENTERED)}`;
          }
        }
      } else if(controls[key].type === 'edit-table' && key === 'enrichmentListTable') {
        result[key] = this.commonService.getEnrichmentDetails(index);
      }
    });
    return result;
  }
  ngOnDestroy(): void {
    if(this.option === FccGlobalConstant.PAYMENTS){
      this.removeLastChildOutline(false);

    }
  }

  getExchangeFields(modelJson){
    const config = this.commonService.getExchangeRateConfiguration();
      const maxNbrContracts = config?.fxBankProperties[0]?.fxNbrContract?.maxNbrContracts?
                              config.fxBankProperties[0].fxNbrContract.maxNbrContracts: 0;
      let posEndField;
      let tempSectionName;
      Object.keys(modelJson).forEach(section => {
        const sectionForm = this.stateService.getSectionData(section, undefined, this.master, this.stateType);
        const extraFields = [];
        const extraFieldControls = {};
        if (sectionForm) {
          Object.keys(sectionForm?.controls).forEach(fieldName => {
            if (sectionForm.controls[fieldName][FccGlobalConstant.PARAMS] &&
              sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][`positionEnd`] &&
              sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][`positionEnd`] === true){
                posEndField=fieldName;
                tempSectionName = section;
              }
            if (maxNbrContracts > 0) {
              if (sectionForm.controls[fieldName][FccGlobalConstant.PARAMS] &&
                sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][`dynamicField`] &&
                sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][`dynamicField`] === true) {
                for (let i = 2; i <= maxNbrContracts; i++) {
                  const currentFieldName = fieldName.substring(0, fieldName.length - 1);
                  const dynamicField = this.formControlService.jsonObjectWithKey(currentFieldName + i,
                    currentFieldName + i, sectionForm.controls[fieldName]['type'],
                    undefined, undefined, false, sectionForm.controls[fieldName][FccGlobalConstant.PARAMS]);
                  if (sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][`previewScreen`] === true) {
                    extraFields.push(currentFieldName + i);
                    extraFieldControls[currentFieldName + i] = dynamicField;
                  }
                }
              }
            }
            if(fieldName === 'totalAmountToUtilise' && sectionForm.controls['totalAmountToUtilise']
                && sectionForm.controls['totalAmountToUtilise'].value?.indexOf(' ') === -1
                && sectionForm.controls['totalAmountToUtiliseCurrency']){
              const amtValue = this.commonService.replaceCurrency(sectionForm.controls['totalAmountToUtilise'].value);
              const amountValue = parseFloat(amtValue);
              const curCode = sectionForm.controls['totalAmountToUtiliseCurrency']?.value;
              let curSymbol;
              if(this.currencySymbolDisplayEnabled){
                curSymbol = this.commonService.getCurrSymbol(curCode);
              } else {
                curSymbol = '';
              }
              if(curSymbol === curCode){
                curSymbol = '';
              }
              const totalSum = this.currencyConverterPipe.transform(amountValue.toString(),curCode);
              const totalAmtVal = curCode +' '+curSymbol+' '+totalSum;
              sectionForm.controls['totalAmountToUtilise'].setValue(totalAmtVal);
            }
          });
        }
        if(extraFields.length){
          for(let i = 2; i <= maxNbrContracts; i++){
            const tempArr = extraFields?.filter(val=>val.indexOf(i)>0);
            if(tempArr.length){
              const fieldName = tempArr[0];
            const groupHead= sectionForm.get(fieldName)?
            sectionForm.get(fieldName)[FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_HEAD] : null;

            if(this.commonService.isnonEMptyString(groupHead)
                && !tempArr.every(elem => modelJson[section][groupHead][FccGlobalConstant.GROUP_CHILDREN].includes(elem))){
                  modelJson[section][groupHead][FccGlobalConstant.GROUP_CHILDREN] =
              modelJson[section][groupHead][FccGlobalConstant.GROUP_CHILDREN].concat(tempArr);
            }
            if(this.commonService.isnonEMptyString(groupHead)){
              sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN] =
              sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN]
              .filter(ele => !tempArr.some(val => ele === val));
            }

            if(this.commonService.isnonEMptyString(groupHead)
                && !tempArr.every(elem => sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN]
                  .includes(elem))){
              sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN] =
              sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN].concat(tempArr);
            }
            tempArr.forEach(ele =>{
              modelJson[section][ele] = extraFieldControls[ele];
            });
          }
          }
        }

        this.moveElement(modelJson,sectionForm,posEndField,tempSectionName);
      });
  }

  addIdToMatPanelBody() {
    if(document.getElementsByClassName('mat-expansion-panel-body')){
      const body = document.getElementsByClassName('mat-expansion-panel-body')[0];
      if (body) {
        body.setAttribute("id", "mat-expansion-panel-body");
      }
    }
  }

  moveElement(modelJson,sectionForm,fieldName,sectionName){
    if(this.commonService.isnonEMptyString(fieldName)){
      const groupHead= sectionForm.get(fieldName)[FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_HEAD];
    const index = sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN].indexOf(fieldName);
    sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN].splice(index,1);
    sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN].push(fieldName);

    const index1 = modelJson[sectionName][groupHead][FccGlobalConstant.GROUP_CHILDREN].indexOf(fieldName);
    modelJson[sectionName][groupHead][FccGlobalConstant.GROUP_CHILDREN].splice(index1,1);
    modelJson[sectionName][groupHead][FccGlobalConstant.GROUP_CHILDREN].push(fieldName);
    }
  }
}
