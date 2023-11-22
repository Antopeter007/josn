import { DatePipe } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../base/services/product.service';
import { LeftSectionService } from '../../../corporate/common/services/leftSection.service';
import { ProductStateService } from '../../../corporate/trade/lc/common/services/product-state.service';
import { TransactionDetailsMap } from '../../../corporate/trade/lc/common/services/transaction-map.service';
import { FilelistService } from '../../../corporate/trade/lc/initiation/services/filelist.service';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { LcReturnService } from '../../../corporate/trade/lc/initiation/services/lc-return.service';
import { PreviewService } from '../../../corporate/trade/lc/initiation/services/preview.service';
import { UtilityService } from '../../../corporate/trade/lc/initiation/services/utility.service';
import { UiService } from '../../../corporate/trade/ui/common/services/ui-service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
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
import { AmendCommonService } from './../../../corporate/common/services/amend-common.service';
import { NarrativeService } from './../../../corporate/trade/lc/initiation/services/narrative.service';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { EventEmitterService } from './../../services/event-emitter-service';
import { LegalTextService } from './../../services/legal-text.service';
import { ListDefService } from './../../services/listdef.service';
import { ProductComponent } from '../product-component/product.component';
import { ConfirmationDialogComponent } from '../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { TabPanelService } from '../../services/tab-panel.service';
import { FCMPaymentsConstants } from '../../../corporate/cash/payments/single/model/fcm-payments-constant';
import { FCMBeneConstants } from './../../../corporate/system-features/fcm-beneficiary-maintenance/fcm-beneficiary-general-details/fcm-beneficiary-general-details.constants';
import { FccConstants } from '../../core/fcc-constants';
import { PaymentInstrumentProductService } from '../../../corporate/cash/payments/single/services/payment-instrument-product.service';
import { TransactionDetails } from '../../model/TransactionDetails';
import { PaymentBatchService } from '../../services/payment.service';
import moment from 'moment';
//const moment = require('moment');
@Component({
  selector: 'app-common-product',
  templateUrl: './common-product.component.html',
  styleUrls: ['./common-product.component.scss']
})
export class CommonProductComponent extends ProductComponent implements OnInit, OnDestroy, AfterViewChecked {
  onProductformChangeSubscription: Subscription;
  onInnerProductformChangeSubscription: Subscription;
  commonProductData: any;
  innerProductData: any;
  isOnlyAutosaveEnabled = false;
  autosaveConfigData = { data_1 : FccGlobalConstant.MANUAL_SAVE_ALONE, data_2 : null, data_3 : null };
  apiModelJson: any;
  autoSaveInitializationFlag = false;
  category: any;
  fcmContainerType = [];
  submitWithoutPreview = true;
  subscriptions: Subscription[] = [];
  fieldsMappingStructure;
  beneAssociationId: any;
  isSubmitEnabled = true;
  bankAccountFields: any;
  paymentReferenceNumber : any;
  setSystemID = false;
  count = 0;

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
    protected dashboardService: DashboardService,
    protected listservice: ListDefService, protected paymentService: PaymentBatchService,
    protected paymentInstrumentProductService : PaymentInstrumentProductService
  ) {
    super(activatedRoute, router, leftSectionService, utilityService, translateService, lcReturnService,
      fileList, elementRef, route, commonService, stateService, eventEmitterService, previewService,
      reauthService, transactionDetailService, productMappingService, messageService,
      dialogService, tabservice, resolver, formModelService, narrativeService, titleService, multiBankService,
      transactionDetailsMap, phraseService, fccHelpService, amendCommonService, taskService,
      changeDetector, formAccordionPanelService, datepipe, uiService, fccGlobalConstantService, legalTextService, productService,
      formControlService, dashboardService);
    this.onProductformChangeSubscription = productService.onProductFormChange$.subscribe(e => {
      if (e) {
        this.onProductFormChange(e);
      }
    });
    this.onInnerProductformChangeSubscription = productService.onInnerProductFormChange$.subscribe(e => {
      if (e) {
        this.onInnerProductFormChange(e);
      }
    });
  }

  ngOnInit() {
    super.ngOnInit();
    sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    this.commonService.getConfiguredValues(FccGlobalConstant.FCM_CONTAINER_TYPE).subscribe(resp => {
      if (resp.response && resp.response === FccGlobalConstant.REST_API_SUCCESS) {
       const containerType = resp.FCM_CONTAINER_TYPE.split(',');
       containerType.forEach(element => {
        if (containerType.indexOf(element.replace(/\s|\[|\]/g, '')) === -1) {
          this.fcmContainerType.push(element.replace(/\s|\[|\]/g, ''));
        }
      });

      }});
    this.category = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
      this.paymentInstrumentProductService.setSinglePaymentData.subscribe( res => {
        this.productCode = res.productCode;
      });
    this.commonService.batchRefId.subscribe((batchRefId) => {
      if(this.commonService.isnonEMptyString(batchRefId)){
        this.setSystemID = true;
        this.channelRefID = batchRefId;
      } else {
        this.setSystemID = false;
      }

    });

      this.paymentService.paymentRefNoSubscription$.subscribe((val) => {
        if(this.commonService.isnonEMptyString(val)){
          this.setSystemID = true;
          this.channelRefID = val;
        } else {
          this.setSystemID = false;
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
    const taskId = FccGlobalConstant.TASK_ID;
    const referenceId = FccGlobalConstant.REFERENCE_ID;
    const subTnxTypeCode = FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE;
    const operation = FccGlobalConstant.OPERATION;
    const actionReqCode = FccGlobalConstant.ACTION_REQUIRED_CODE;
    const action = FccGlobalConstant.ACTION;
    const accountId = FccGlobalConstant.ACCOUNTID;
    const entityAbbvName = FccGlobalConstant.ENTITY_ABBV_NAME;
    const category = FccGlobalConstant.CATEGORY;
    const paymentRefNumber = FccGlobalConstant.PAYMENT_REFERENCE_NUMBER;
    this.activatedRoute.queryParams.subscribe(params => {
      this.commonService.clearQueryParameters();
      Object.keys(params).forEach(element => {
        if (this.productService.isParamValid(params[element])) {
          if (element === 'productCode') {
            this.productCode = params[element];
            this.subProductCode = params[subProductCode];
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
            this.paymentReferenceNumber = params[paymentRefNumber];
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
            this.category = params[category];
            this.paymentReferenceNumber = params[paymentRefNumber];
          }
          this.commonService.putQueryParameters(element, params[element]);
        }
      });
      if (this.commonService.isViewPopup && this.commonService.viewPopupFlag
        && !this.commonService.parent && (params[tnxTypeCode] === '03')) {
        this.commonService.putQueryParameters(FccGlobalConstant.TNX_TYPE_CODE, '');
        this.commonService.putQueryParameters(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE, '');
        this.commonService.putQueryParameters(FccGlobalConstant.OPTION, 'existing');
        this.commonService.putQueryParameters(FccGlobalConstant.MODE, '');
      }
      this.productService.setTranslatedTitle(this.productCode, this.subProductCode, this.mode);
      this.setParamsBasedonInputParams();
      this.setParamsBasedonSecondInputParams();
      if (this.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC) {
        this.lcHeaderKey = this.productService.getHeaderName(null, null, null, null, null, this.option,
          this.operation, this.action);
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
        tnxId: this.tnxId
      };
      this.formHeaderComponent = this.productService.getFormHeaderComponent();
      this.translateService.get('corporatechannels').subscribe(() => {
        this.save = this.translateService.instant('save');
        this.previous = this.translateService.instant('previous');
        this.next = this.translateService.instant('next');
        this.Submit = this.translateService.instant('submit');
        this.reviewCommentsHeader = `${this.translateService.instant('rejectReasons')}`;
        this.channelReference = `${this.translateService.instant('batchReference')}`;
        this.minutesago = `${this.translateService.instant('minutesAgo')}`;
        this.savedJustNow = `${this.translateService.instant(FccGlobalConstant.SAVED_JUST_NOW)}`;
        this.warningBody = `${this.translateService.instant('fcmWarningBody')}`;
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
      } else if(this.category.toLowerCase() === (FccGlobalConstant.FCM).toLowerCase() ){
        this.auditCall();
      }
    });
    this.bankAccountFields = this.operation === FccGlobalConstant.UPDATE_FEATURES ? FCMBeneConstants.BANK_ACCOUNT_FIELDS_UPDATE :
    FCMBeneConstants.BANK_ACCOUNT_FIELDS_CREATE;
    this.commonService.getAddressBasedOnParamData(FccGlobalConstant.PARAMETER_P347, this.productCode, this.subProductCode);
  }

  /**
   * initializes productmodel and state.
   * if already initialized, model is re-initialized only if reinit flag is set
   * @param reInit default true as existing behaviour
   */
  initializeStateAndSectionValues() {
      switch (this.option) {
        case FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC:
        this.handleFCMBeneficiaryData();
        break;
        case FccGlobalConstant.BENEFICIARY_FILE_UPLOAD_MC:
        this.handleBulkFileUploadBeneData();
        break;
        case FccConstants.OPTION_PAYMENTS :
        this.handlePaymentsData();
        break;
        default: break;
      }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.onProductformChangeSubscription.unsubscribe();
    this.onInnerProductformChangeSubscription.unsubscribe();
    this.commonService.productState.next(CommonProductComponent.EMPTY);
    this.productService.onProductFormChange$.next(null);
    this.productService.onInnerProductFormChange$.next(null);
  }

  /**
   * initializes product models(FORM, EVENT, SubSection) from API and then initializes state.
   */
  public initProductModelAndState() {
    let filterParams: any = {};
    filterParams.productScreen = true;
    filterParams.fcmOption = this.option;
    filterParams = JSON.stringify(filterParams);
    this.listservice.getTabDetails(this.productCode, null, FccGlobalConstant.GENERAL,
      null, filterParams, null).subscribe(resp => {
      if (resp && resp.ProductTypes) {
        this.commonProductData = resp;
        this.formHeaderInputData.hyperlinks = this.commonProductData.ProductTypes[0].HyperlinkListValues;
        this.formHeaderInputData.productsList = this.commonProductData.ProductTypes;
        resp.ProductTypes.forEach(productType => {
          if (productType.selected) {
            this.productCode = productType.productCode;
          }
          if (this.commonService.isNonEmptyValue(productType.tabProductTypes)) {
            this.formHeaderInputData.tabsListPresent = true;
          }
        });
        this.setProductModel();
      }
    });
  }

  onClickNext() {
    this.paymentInstrumentProductService.isNextFlag = true;
    if (this.stateService.getAutoSaveConfig()?.isAutoSaveEnabled) {
      this.stateService.updateAllSectionsDataInState();
    }
    this.leftSectionService.setStepperSteps(this.items);
    this.leftSectionService.addSummarySection();
    if (FccGlobalConstant.MANUAL_SAVE_ALONE === this.autosaveConfigData.data_1 ||
      FccGlobalConstant.AUTO_AND_MANUAL_SAVE === this.autosaveConfigData.data_1) {
        this.saveData();
    }
    ++this.storeIndexValue;
    this.autoFocusDivisonOnNextOrPrevious('next');
    this.leftSectionService.isButtonAction.next(true);
    this.leftSectionService.highlightMenuSection.next(this.storeIndexValue);
    this.updateAllSections();
  }

  buildSinglePaymentRequestObject(mappingModel, actionType: string): any {
    let requestObject = {};
    const objModel = FCMPaymentsConstants.FCM_SINGLE_PAYMENT_FIELDS;
    requestObject[FccGlobalConstant.OPERATION] = actionType;
    this.stateService.getSectionNames().forEach(section => {
      const sectionFormValue = this.stateService.getSectionData(section);
      if (sectionFormValue.controls !== null && mappingModel !== null) {
        Object.keys(sectionFormValue.controls).forEach(key => {
          const control = sectionFormValue.controls[key];
          const mapping = objModel[key];
          let val = this.previewService.getPersistenceValue(control, false);
          if(key == FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME){
            if(typeof control.value === 'object'){
              val = control.value?.value;
            }
            if(sectionFormValue.controls[FccConstants.FCM_ADD_BENE_CHECKBOX].value == FccGlobalConstant.CODE_Y){
              val = sectionFormValue.controls[FccConstants.FCM_BENEFICIARY_CODE].value;
            } else {
              val = '';
            }
          }
          if(key === FccConstants.ENRICHMENT_LIST_TABLE || key === FCMPaymentsConstants.ADD_ENRICHMENT_FIELD){
            if(key === FccConstants.ENRICHMENT_LIST_TABLE ){
              this.getEnrichmentData(requestObject, control);
            }
          } else {
            if(key === FCMPaymentsConstants.AMOUNT && typeof val === 'string'){
              val = this.commonService.replaceCurrency(val);
            }
            if(mapping != undefined && !this.commonService.isEmptyValue(val)) {
              this.createNested(mapping,requestObject, val, control);
            } else {
              const mappingKey = this.productMappingService.getRequestFieldNameFromMappingModel(key, mappingModel);
              if(mappingKey){
                if (control[FccGlobalConstant.PARAMS][FccConstants.MAP_BOOLEAN_VALUE]) {
                  requestObject[mappingKey] = (val === FccGlobalConstant.CODE_Y) ? true : false;
                } else {
                  requestObject[mappingKey] = val;
                }
              }
            }
          }
        });
        requestObject = this.updateCustomerRefNo(requestObject);
        if (this.commonService.productType && this.commonService.productType === FccGlobalConstant.CODE_04) {
          requestObject = this.updateDetailsForInHouseTransfer(requestObject, sectionFormValue);
        }
      }
    });
    return requestObject;
  }

  updateDetailsForInHouseTransfer(obj: any, form: any) {
    obj[FCMPaymentsConstants.CREDITOR_AGENT][FCMPaymentsConstants.IDENTIFIER_TYPE] = FCMPaymentsConstants.SYSTEM;
    obj[FCMPaymentsConstants.CREDITOR_AGENT][FCMPaymentsConstants.OTHER_ID] =
      form?.get(FccConstants.BENE_BANK_IFSC_CODE)?.value?.shortName;
    return obj;
  }

  updateCustomerRefNo(object){
    if(object[FCMPaymentsConstants.CUSTOMER_REFERENCE_NUMBER] == ''){
      const datestamp = this.utilityService.getUniqueTimeStampValue();
      const productCode = this.productCode.substring(0, 2) ? this.productCode.substring(0, 2) : 'XX';
      object[FCMPaymentsConstants.CUSTOMER_REFERENCE_NUMBER] = productCode + datestamp;
    }
      object[FCMPaymentsConstants.PAYMENT_REFERENCE] = object[FCMPaymentsConstants.CUSTOMER_REFERENCE_NUMBER];
      return object;
  }

  getEnrichmentData(requestObject, control){
    if(control.params.data.length > 0){
      const isMultiSet = this.paymentInstrumentProductService.enrichmentFlags.isEnrichTypeMultiple;
      const data = {};
      if(isMultiSet){
        data[FCMPaymentsConstants.MULTI_SET] = this.getDataFromTable(control.params);
      } else{
        data[FCMPaymentsConstants.SINGLE_SET] = this.getDataFromTable(control.params)[0];
      }
      requestObject[FCMPaymentsConstants.ENRICHMENT_DETAILS_TRANSACTION] = data;
      this.paymentInstrumentProductService.isNextFlag = false;
      this.resetEnrichmentConfig();
    }
  }

  resetEnrichmentConfig(){
    this.paymentInstrumentProductService.enrichmentConfig = {
      enrichmentFields: {},
      enrichmentFieldsName : [],
      columnOrder : [],
      editRecordIndex : 0,
      tempRowData : {}
    };
    this.paymentInstrumentProductService.enrichmentFlags = {
      hasEnrichmentFields : false,
      isEnrichTypeMultiple : true,
      isEnrichmentBtnClicked : false,
      isFieldLoadedOnScreen : false,
      isModeNew: true,
      isPackageChanged: false,
      loadEnrichDataAutoSaveFlag : false,
      isSaveValid : false,
      preloadData : false,
      isEditMode : false,
      hasRequiredField : false
    };
  }

  getDataFromTable(params){
    const tempData = [];
    const data = params.data;
    if(!params.columnsOrder){
      params = this.updateColumnOrder(params);
    }
    const columns = params.columnsOrder.sort((a,b)=> a.order - b.order);
    data.forEach(dt => {
      const dataObj = {};
      columns.forEach(element => {
        dataObj[element.code] = dt[element.code];
      });
      tempData.push(dataObj);
    });
    return tempData;
  }

  updateColumnOrder(params){
    params[FccGlobalConstant.COLUMNS_ORDER] = this.paymentInstrumentProductService.enrichmentConfig.columnOrder;
    return params;
  }

  buildBulkPaymentRequestObject(mappingModel): any {
    const requestObject: FormData = new FormData();
    this.stateService.getSectionNames().forEach(section => {
      const sectionFormValue = this.stateService.getSectionData(section);
      if (sectionFormValue.controls !== null && mappingModel !== null) {
        Object.keys(sectionFormValue.controls).forEach(key => {
          const control: any = sectionFormValue.controls[key];
          const mappingKey = this.productMappingService.getRequestFieldNameFromMappingModel(key, mappingModel);
          if(mappingKey){
            if(control.type === 'input-table'){
              requestObject.append(mappingKey, control.params.data[0].file);
            }else{
              requestObject.append(mappingKey, control.value.label);
            }
          }
      });
    }
    });
    return requestObject;
  }

  buildBulkBeneRequestObject(mappingModel): any {
    const requestObject: FormData = new FormData();
    this.stateService.getSectionNames().forEach(section => {
      const sectionFormValue = this.stateService.getSectionData(section);
      if (sectionFormValue.controls !== null && mappingModel !== null) {
        Object.keys(sectionFormValue.controls).forEach(key => {
          const control: any = sectionFormValue.controls[key];
          const mappingKey = this.productMappingService.getRequestFieldNameFromMappingModel(key, mappingModel);
          if(mappingKey){
            if(control.type === 'input-table'){
              requestObject.append(mappingKey, control.params.data[0].file);
            }else{
              requestObject.append(mappingKey, control.value.label);
            }
          }
      });
    }
    });
    return requestObject;
  }
  createNested(mapping, requestObject, value, control?){
    mapping = mapping.reverse();
    const lastIndex = mapping.length - 1;
    let child = {};
    let obj = {};
    mapping.forEach((element,index) => {
      if(index == 0){
        child[element] = value;
        obj = Object.assign({},child);
      } else if(index < mapping.length -2){
        obj = this.createChild(element,child);
        child = Object.assign({},obj);
      }
    });
    const val = mapping.length > 2 ? obj : value;
    if(requestObject[mapping[lastIndex]] !== undefined && requestObject[mapping[lastIndex]] !== null){
      const temp = Object.assign({},requestObject[mapping[lastIndex]][mapping[lastIndex-1]]);
      if(typeof val === 'string') {
        if (control[FccGlobalConstant.PARAMS][FccConstants.MAP_BOOLEAN_VALUE]) {
          requestObject[mapping[lastIndex]][mapping[lastIndex-1]] =
              (val === FccGlobalConstant.CODE_Y || val === 'true');
        } else {
          requestObject[mapping[lastIndex]][mapping[lastIndex-1]] = val;
        }
      } else {
        requestObject[mapping[lastIndex]][mapping[lastIndex-1]] = Object.assign(temp,val);
      }
    } else {
      if (control && control[FccGlobalConstant.PARAMS] &&
          control[FccGlobalConstant.PARAMS][FccConstants.MAP_BOOLEAN_VALUE]) {
        requestObject[mapping[lastIndex]] = this.createChild([mapping[lastIndex-1]],
            (val === FccGlobalConstant.CODE_Y || val === 'true'));
      } else {
        requestObject[mapping[lastIndex]] = this.createChild([mapping[lastIndex-1]],val);
      }
    }
    mapping.reverse();
  }

  createChild(key,obj){
    return { [key] : obj };
  }

  setTransactionDetailsMap() {
    if (this.commonService.isnonEMptyString(this.productCode)) {
      const transactionDetails : TransactionDetails = {
        productCode: this.productCode
      };
      const id = FccGlobalConstant.PRODUCT;
      this.transactionDetailsMap.initializeMaps(id, transactionDetails);
    }
  }

  setProductModel(formChanged?: boolean) {
    let option;
    if (!formChanged && this.commonProductData?.ProductTypes?.length) {
      const selectedTab = this.commonProductData.ProductTypes.filter(type => type.selected)[0];
      this.productCode = selectedTab?.productCode;
      if (selectedTab?.tabProductTypes?.length) {
        this.productCode = selectedTab.tabProductTypes.filter(type => type.selected).map(type => type.productCode)[0];
      }
      if(!this.commonService.isnonEMptyString(this.productCode) && this.commonProductData?.ProductTypes?.length === 1) {
        this.productCode = this.commonProductData.ProductTypes[0].productCode;
        option = this.productCode === FccConstants.PRODUCT_BB ? FccGlobalConstant.BENEFICIARY_FILE_UPLOAD_MC : option;
      }
    }
    if(!this.commonService.isnonEMptyString(this.productCode)) {
      this.productCode = this.stateService.autosaveProductCode;
    }
    this.setTransactionDetailsMap();
    this.commonService.putQueryParameters(FccGlobalConstant.REFERENCE_ID, this.referenceId);
    this.formModelService.getFormSubsectionAndEventModel(this.productCode,
      this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNXTYPECODE), undefined, option)
        .subscribe(modelJson => {
          if (modelJson) {
            this.formModelService.subSectionJson = modelJson[1];
            this.stateService.initializeProductModel(modelJson[0], this.isMaster, this.stateType);
            this.stateService.initializeEventModel(modelJson[2], this.stateType);
            this.handleStateInitialization(this.reInit);
            if (modelJson[3]?.paramDataList?.length) {
              this.autosaveConfigData = modelJson[3].paramDataList[0];
              this.eventEmitterService.autoSaveDetails.next(this.autosaveConfigData);
              this.isOnlyAutosaveEnabled = this.commonService.isOnlyAutosaveEnabled(modelJson[3].paramDataList[0].data_1);
            } else {
              this.autosaveConfigData = { data_1 : FccGlobalConstant.MANUAL_SAVE_ALONE, data_2 : null, data_3 : null };
              this.isOnlyAutosaveEnabled = false;
            }
            if (FccGlobalConstant.AUTOSAVE_ALONE === this.autosaveConfigData.data_1 ||
              FccGlobalConstant.AUTO_AND_MANUAL_SAVE === this.autosaveConfigData.data_1) {
                this.stateService.setAutoSaveConfig(true, this.autosaveConfigData.data_2);
              } else {
                this.stateService.setAutoSaveConfig(false);
              }
              if (this.commonService.actionName === FccGlobalConstant.ACTION_MAKE_PAYMENT) {
                this.stateService.setAutoSaveConfig(false);
                this.commonService.actionName = '';
              }

            let updatedTimestamp = modelJson[4]?.lastUpdatedDateTime;
            this.stateService.setAutoSavedTime("");
            updatedTimestamp = moment(updatedTimestamp).format('DD/MM/YYYY  h:mm A');

            if (modelJson[4]?.formData && typeof modelJson[4]?.formData === 'string' &&
            Object.keys(modelJson[4]?.formData).length !== 0 &&
              this.stateService.getAutoSaveConfig()?.isAutoSaveEnabled && !this.paymentReferenceNumber
              && this.operation !== FccGlobalConstant.UPDATE_FEATURES && this.count<1) {
              const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
                header: this.translateService.instant('confirmationmsg'),
                width: '35em',
                styleClass: 'fileUploadClass',
                style: { direction: this.dir },
                data: { locaKey: 'autoSaveContinueMessage',
                  showOkButton: false,
                  showNoButton: true,
                  showYesButton: true,
                  lastUpdatedDateTime : updatedTimestamp,
                },
                baseZIndex: 10010,
                autoZIndex: true
              });
              this.count++;
              dialogRef.onClose.subscribe((result: any) => {
                if (result.toLowerCase() === FccGlobalConstant.CONFIRMATION_YES) {
                  this.loadSection(0);
                  this.setAutosaveState(JSON.parse(modelJson[4].formData));
                  this.commonService.autoSavedTime.next(modelJson[4]?.lastUpdatedDateTime);
                  this.count--;
                }else if (result.toLowerCase() === FccGlobalConstant.CONFIRMATION_NO) {
                  this.resetEnrichmentConfig();
                  let vals;
                  this.commonService.getProductCode.subscribe(val=>{
                  if(val) {
                    vals = val;
                  }
                  });
                  const paramKeys = {
                    productCode : this.productCode ? this.productCode : vals,
                    subProductCode : this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE),
                    referenceId : this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID),
                    option : this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION),
                    tnxType : this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_TYPE_CODE),
                    subTnxtype : this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TNX_TYPE)
                   };
                  this.commonService.deleteAutosave(
                    paramKeys
                    ).subscribe(resp=>{
                      if (resp?.responseDetails?.message) {
                        this.stateService.setAutoSaveCreateFlagInState(true);
                        this.commonService.autoSavedTime.next('');
                      }
                    });
                    this.count--;
                  }
              });
              this.stateService.setAutoSaveCreateFlagInState(false);
            } else {
              this.stateService.setAutoSaveCreateFlagInState(true);
            }
            if (formChanged) {
              this.loadSection(0);
            }
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
            this.router.navigateByUrl(FccGlobalConstant.GLOBAL_DASHBOARD);
          }
        });
  }

  @HostListener('window:resize', ['$event'])
  calcTop(property) {
    const header = document.getElementsByClassName('ng-header')[0]?.getBoundingClientRect();
    const stickyHeader = document.getElementsByClassName('stickyHeader')[0]?.getBoundingClientRect();
    if(this.setSystemID){
      if (property === 'top') {
        return header.height + 'px';
      } else if (property === 'paddingTop') {
        return (((header.height + stickyHeader.height) / 6 ) - 14 )+ 'px';
      }
    }else{
      if (property === 'top') {
        return (header.height ) + 'px';
      } else if (property === 'paddingTop') {
        return (header.height + stickyHeader.height) / 6+ 'px';
      }
    }

  }

  getComponentType() {
    return 'nextButton';
  }

  onProductFormChange(event) {
    this.commonProductData.ProductTypes.forEach(productType => {
      if (productType.index === event.index) {
        this.productCode = productType.productCode;
        this.subProductCode = productType.subProductCode;
        this.commonService.putQueryParameters(FccGlobalConstant.OPTION, productType.option);
        this.commonService.putQueryParameters(FccGlobalConstant.TNXTYPECODE, productType.tnxTypeCode);
        this.commonService.putQueryParameters(FccGlobalConstant.PRODUCT, this.productCode);
        this.commonService.putQueryParameters(FccGlobalConstant.SUB_PRODUCT_CODE, this.subProductCode);
        this.formHeaderInputData.hyperlinks = productType.HyperlinkListValues;
        this.setProductModel(true);
        this.setSubmitStatus(true);
      }
    });
  }

  onInnerProductFormChange(event) {
    event.value.forEach(productType => {
      if (productType.index === event.index) {
        this.productCode = productType.productCode;
        this.subProductCode = productType.subProductCode;
        this.commonService.putQueryParameters(FccGlobalConstant.OPTION, productType.option);
        this.commonService.putQueryParameters(FccGlobalConstant.TNXTYPECODE, productType.tnxTypeCode);
        this.commonService.putQueryParameters(FccGlobalConstant.PRODUCT, this.productCode);
        this.commonService.putQueryParameters(FccGlobalConstant.SUB_PRODUCT_CODE, this.subProductCode);
        this.setProductModel(true);
      }
    });
  }

  setAutosaveState(respObj) {
    this.stateService.getSectionNames().forEach(section => {
      this.eventEmitterService.renderSavedValues.next(section);
      this.setSubmitStatus(true);
      const sectionForm = this.stateService.getSectionData(section);
      Object.keys(sectionForm.controls).forEach(fieldName => {
        const fieldControl = this.stateService.getControl(section, fieldName);
        if (fieldControl) {
          const fieldValue = respObj[fieldName];
          this.formControlService.setValueByType(fieldControl, fieldValue, false, true);
          fieldControl.updateValueAndValidity();
        }
      });
      if (section === FccConstants.BATCH_GENERAL_DETAILS) {
        this.eventEmitterService.renderSavedEnrichValues.next(respObj);
      }
    });
  }

  handleFCMBeneficiaryData() {
    const beneAssociationId = this.commonService.getQueryParametersFromKey('associationId');
    this.stateService.initializeState(null);
    this.setSectionList();
    this.handleLeftSectionData();
    if (this.commonService.isnonEMptyString(beneAssociationId)) {
      this.beneAssociationId = beneAssociationId;
      this.handleFCMBeneficiaryUpdate();
    }
  }

  handleFCMBeneficiaryUpdate() {
    this.stateService.populateAllEmptySectionsInState();
    this.productMappingService.getApiModel(undefined, undefined, undefined, undefined, undefined,
      this.option, this.category).subscribe(apiMappingModel => {
        this.commonService.getBeneficiaryAccounts(this.beneAssociationId, FccConstants.STRING_TRUE).subscribe(response => {
          if (response?.data) {
            if (response.data.checkerRemarks && response.data.bankAccountBeneStatus
              && FccConstants.FCM_BENE_REJECTED_STATUS_LIST.indexOf(response.data.bankAccountBeneStatus) > -1) {
              this.reviewComments = response.data.checkerRemarks.replace(/\n/g, '<br>');
            }
            this.isStateReloadNeeded = true;
            this.setState(response.data, apiMappingModel);
            this.loadSection(0);
          }
        });
      });
  }

  setSubmitStatus(event) {
    this.isSubmitEnabled = event;
  }

  updateTimestamp(event) {
    this.commonService.autoSavedTime.next(event);
  }

  onclickSubmit() {
    let iKey = sessionStorage.getItem(FccGlobalConstant.idempotencyKey);
    if (this.commonService.isEmptyValue(iKey)) {
      iKey = this.fccGlobalConstantService.generateUUIDUsingTime();
      sessionStorage.setItem(FccGlobalConstant.idempotencyKey, iKey);
    }
    const validations = [];
    validations.push('validateAllFormFields', 'beforeSubmitValidation');
    if (this.validateMethods(validations)) {
      this.category = this.category === undefined ?
        this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY) : this.category;
      this.subscriptions.push(
        this.productMappingService.getApiModel(this.productCode, this.subProductCode, undefined, undefined, undefined,
          this.option, this.category).subscribe(apiMappingModel => {
            let reauthData;
            switch (this.option) {
              case FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC:
                if (this.category === FccConstants.FCM && this.productCode === FccConstants.PRODUCT_BB) {

                  const requestObj = this.buildBulkBeneRequestObject(apiMappingModel);
                  reauthData = {
                    action: FccConstants.SUBMIT_BULK_BENE,
                    request: requestObj
                  };
                }
                else if (this.category === FccConstants.FCM) {
                  const requestObj = this.buildFCMBeneficiaryRequestObject(apiMappingModel);
                  reauthData = {
                    action: FccConstants.FCM_SUBMIT_FEATURES,
                    request: requestObj,
                    requestType: this.operation,
                    idempotencyKey: sessionStorage.getItem(FccGlobalConstant.idempotencyKey)
                  };
                }
                break;
              case FccConstants.OPTION_PAYMENTS:
                if (this.productCode === FccConstants.PRODUCT_IN) {
                  if(FccGlobalConstant.UPDATE_FEATURES === this.operation){
                    const requestObj = this.buildSinglePaymentRequestObject(apiMappingModel,FccConstants.UPDATE_SINGLE_ELE_PAYMENT);
                    reauthData = {
                      action: FccConstants.UPDATE_SINGLE_ELE_PAYMENT,
                      paymentReferenceNumber : this.paymentReferenceNumber,
                      request: requestObj,
                    };
                  } else {
                    const requestObj = this.buildSinglePaymentRequestObject(apiMappingModel,FccConstants.SUBMIT_SINGLE_ELE_PAYMENT);
                    reauthData = {
                      action: FccConstants.SUBMIT_SINGLE_ELE_PAYMENT,
                      request: requestObj,
                      idempotencyKey: sessionStorage.getItem(FccGlobalConstant.idempotencyKey)
                    };
                  }
                }
                if (this.productCode === FccConstants.PRODUCT_BT) {
                  reauthData = {
                    action: FccConstants.SUBMIT_BATCH_PAYMENT,
                    idempotencyKey: sessionStorage.getItem(FccGlobalConstant.idempotencyKey)
                  };
                }
                if (this.productCode === FccConstants.PRODUCT_PB) {
                  const requestObj = this.buildBulkPaymentRequestObject(apiMappingModel);
                  reauthData = {
                    action: FccConstants.SUBMIT_BULK_PAYMENT,
                    request: requestObj
                  };
                }
                break;
            }
            this.legalTextService.openLegalTextDiaglog(reauthData);
          }));
    }
    this.subscriptions.push(
      this.commonService.isSubmitAllowed.subscribe(
        data => {
          if (data) {
            this.submitClicked = false;
          }
        }
      ));
  }

  buildFCMBeneficiaryRequestObject(mappingModel): any {
    const beneLimitObj = 'beneficiaryLimit';
    const postalAddress = 'postalAddress';
    const bankAccountsObj = 'bankAccount';
    const forAPIRequestObj = true;
    let requestObj = {};
    const beneficiaryLimitObj = {};
    const postalAddressObj = {};
    let bankAccount = [];
    const postalAddrFields = this.operation === FccGlobalConstant.ADD_FEATURES ? FCMBeneConstants.POSTAL_ADDRESS_FIELDS_ADD
    : FCMBeneConstants.POSTAL_ADDRESS_FIELDS_UPDATE;
    const beneLimitFields = this.operation === FccGlobalConstant.ADD_FEATURES ? FCMBeneConstants.BENEFICIARY_LIMIT_ADD
    : FCMBeneConstants.BENEFICIARY_LIMIT_UPDATE;
    if (mappingModel) {
      this.stateService.getSectionNames().forEach(section => {
        const sectionFormValue = this.stateService.getSectionData(section);
        if (sectionFormValue.controls[FccConstants.ACCOUNTS_LIST_TABLE] !== null) {
          const control = sectionFormValue.controls[FccConstants.ACCOUNTS_LIST_TABLE];
          bankAccount = this.addAccountTableDataToRequestObject(mappingModel, control, bankAccount,
            sectionFormValue, forAPIRequestObj);
        }
        Object.keys(sectionFormValue.controls).forEach(fieldName => {
          if (beneLimitFields.includes(fieldName)) {
            this.addFieldToRequestObject(mappingModel, sectionFormValue, fieldName, beneficiaryLimitObj, forAPIRequestObj);
          } else if (postalAddrFields.includes(fieldName)) {
            this.addFieldToRequestObject(mappingModel, sectionFormValue, fieldName, postalAddressObj, forAPIRequestObj);
          } else if (!this.bankAccountFields.includes(fieldName)) {
            this.addFieldToRequestObject(mappingModel, sectionFormValue, fieldName, requestObj, forAPIRequestObj);
          }
        });
        requestObj[beneLimitObj] = beneficiaryLimitObj;
        requestObj[postalAddress] = postalAddressObj;
        requestObj[bankAccountsObj] = bankAccount;
      });
      requestObj = this.updateBeneDetailsForInHouseTransfer(requestObj);
    }
    return requestObj;
  }

  updateBeneDetailsForInHouseTransfer(obj: any) {
    for (let i = 0; i < obj[FCMPaymentsConstants.BANK_ACCOUNT].length; i++) {
      if (obj[FCMPaymentsConstants.BANK_ACCOUNT][i]['paymentType'] === 'INHOUSETRANSFER') {
        obj[FCMPaymentsConstants.BANK_ACCOUNT][i][FCMPaymentsConstants.BENEFICIARY_BANK][FCMPaymentsConstants.IDENTIFIER_TYPE]
        = FCMPaymentsConstants.SYSTEM;
      }
    }
    return obj;
  }

  addAccountTableDataToRequestObject(mappingModel, control, accountsArray, sectionForm, forAPIRequestObj) {
    const accountsObj = 'account';
    const beneBankObj = 'benificiaryBank';
    const columns = FCMBeneConstants.ACCOUNTS_TABLE_COLUMNS_ALL;
    const tableData = control[FccGlobalConstant.PARAMS][FccGlobalConstant.TABLE_DATA];
    let bankAndAccountsData = {};
    let accountDetailsObj = {};
    let beneficiaryBankObj = {};
    this.fieldsMappingStructure = FCMBeneConstants.CONSTRUCT_COMPLEX_FIELD;
    if (columns.length > FccGlobalConstant.LENGTH_0 && tableData.length > FccGlobalConstant.LENGTH_0) {
      for (let i = 0; i < tableData.length; i++) {
        this.bankAccountFields.forEach(field =>{
          if (columns.includes(field)) {
            this.constructAccountsTableObj(mappingModel, sectionForm, field, tableData[i][field], accountDetailsObj, beneficiaryBankObj,
              bankAndAccountsData, forAPIRequestObj);
          } else {
            this.constructAccountDetailsObj(mappingModel, sectionForm, field, accountDetailsObj, beneficiaryBankObj, bankAndAccountsData,
              forAPIRequestObj);
          }
        });
        bankAndAccountsData[accountsObj] = accountDetailsObj;
        bankAndAccountsData[beneBankObj] = beneficiaryBankObj;
        accountsArray.push(bankAndAccountsData);
        accountDetailsObj = {};
        beneficiaryBankObj = {};
        bankAndAccountsData = {};
      }
    }
    return accountsArray;
  }

  constructAccountDetailsObj(mappingModel, sectionForm, field, accountDetailsObj, benificiaryBankObj,
    bankAndAccountsData, forAPIRequestObj) {
    if (FCMBeneConstants.ACCOUNT_DETAILS.includes(field)) {
      if (this.fieldsMappingStructure[field]) {
        this.createNested(this.fieldsMappingStructure[field],accountDetailsObj,
          this.previewService.getPersistenceValue(sectionForm.controls[field], false, forAPIRequestObj));
      } else {
        this.addFieldToRequestObject(mappingModel, sectionForm, field, accountDetailsObj, forAPIRequestObj);
      }
    } else if (FCMBeneConstants.BENEFICIARY_BANK_DETAILS.includes(field)) {
      this.addFieldToRequestObject(mappingModel, sectionForm, field, benificiaryBankObj, forAPIRequestObj);
    } else {
      this.addFieldToRequestObject(mappingModel, sectionForm, field, bankAndAccountsData, forAPIRequestObj);
    }
  }

  constructAccountsTableObj(mappingModel, sectionForm, field, fieldValue, accountDetailsObj, benificiaryBankObj,
    bankAndAccountsData, forAPIRequestObj) {
    if (!fieldValue) {
      fieldValue = sectionForm.get(field).value;
    }
    if (FCMBeneConstants.ACCOUNT_DETAILS.includes(field)) {
      if (this.fieldsMappingStructure[field]) {
        const value = this.previewService.getPersistenceValue(sectionForm.controls[field], false, forAPIRequestObj);
        this.createNested(this.fieldsMappingStructure[field],accountDetailsObj, fieldValue ? fieldValue : value);
      } else {
        this.addTableDataToObject(mappingModel, sectionForm, field, fieldValue, accountDetailsObj, forAPIRequestObj);
      }
    } else if (FCMBeneConstants.BENEFICIARY_BANK_DETAILS.includes(field)) {
      this.addTableDataToObject(mappingModel, sectionForm, field, fieldValue, benificiaryBankObj, forAPIRequestObj);
    } else {
      this.addTableDataToObject(mappingModel, sectionForm, field, fieldValue, bankAndAccountsData, forAPIRequestObj);
    }
  }

  addTableDataToObject(mappingModel, sectionForm, field, fieldValue, obj, forAPIRequestObj) {
    const apiFieldName = this.productMappingService.getRequestFieldNameFromMappingModel(field, mappingModel);
    const val = this.previewService.getTableDataValue(sectionForm.controls, field, fieldValue, forAPIRequestObj);
    if (val) {
      if (sectionForm.controls[field][FccGlobalConstant.PARAMS][FccConstants.MAP_BOOLEAN_VALUE]) {
        obj[apiFieldName] = (val === FccGlobalConstant.CODE_Y) ? true : false;
      } else if (FCMBeneConstants.FIELDS_WITH_ENUM_FORMAT.includes(field)) {
        obj[apiFieldName] = val.trim().replace(/\s/g, FccGlobalConstant.EMPTY_STRING).toUpperCase();
      } else {
        obj[apiFieldName] = val;
      }
    }
  }

  protected handlePaymentsData() {
    const paymentReferenceNumber = this.commonService.getQueryParametersFromKey('paymentReferenceNumber');
    this.stateService.initializeState(null);
    this.setSectionList();
    this.handleLeftSectionData();
    if (this.commonService.isnonEMptyString(paymentReferenceNumber)) {
      this.paymentReferenceNumber = paymentReferenceNumber;
      this.handleFCMPaymentsUpdate();
    }
    this.productService.setCurrentSectionData(this.items[this.storeIndexValue]);
  }

  handleFCMPaymentsUpdate() {
    const req = { paymentReferenceNumber : this.paymentReferenceNumber, pageSize: 10, first: 0 };
    this.subscriptions.push(
      this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response && response.showStepper !== FccConstants.STRING_TRUE) {
          this.commonService.isStepperDisabled = true;
        }
      })
    );
    this.stateService.populateAllEmptySectionsInState();
    this.productMappingService.getApiModel(this.productCode, undefined, undefined, undefined, undefined,
      this.option, this.category).subscribe(apiMappingModel => {
        this.commonService.getPaymentDetails(req).subscribe(response => {
          if (response?.data) {
            if (response.data?.paymentDetail[0]?.rejectRemark) {
              this.reviewComments = response.data.paymentDetail[0].rejectRemark.replace(/\n/g, '<br>');
            }
            if(response.data?.paymentHeader?.isConfidentialPayment){
              response.data.paymentHeader.isConfidentialPayment = 'Y';
            }
            this.isStateReloadNeeded = true;
            this.setState(response.data, apiMappingModel);
            this.loadSection(0);
          }
        });
      });
  }
}
