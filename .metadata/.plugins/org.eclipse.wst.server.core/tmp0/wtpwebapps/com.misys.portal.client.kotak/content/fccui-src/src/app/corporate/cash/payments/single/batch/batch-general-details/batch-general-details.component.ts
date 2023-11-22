import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfirmationService, DialogService, DynamicDialogRef } from 'primeng';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccConstants } from '../../../../../../common/core/fcc-constants';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CodeDataService } from '../../../../../../common/services/code-data.service';
import { CommonService } from '../../../../../../common/services/common.service';
import { DashboardService } from '../../../../../../common/services/dashboard.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { ProductMappingService } from '../../../../../../common/services/productMapping.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import { CashCommonDataService } from '../../../../../../corporate/cash/services/cash-common-data.service';
import { LeftSectionService } from '../../../../../../corporate/common/services/leftSection.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { SaveDraftService } from '../../../../../../corporate/trade/lc/common/services/save-draft.service';
import { CurrencyConverterPipe } from '../../../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../../../corporate/trade/lc/initiation/services/filelist.service';
import { FormControlService } from '../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { PrevNextService } from '../../../../../../corporate/trade/lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { HOST_COMPONENT } from '../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FCMPaymentsConstants } from '../../model/fcm-payments-constant';
import { PaymentBatchProductService } from '../../services/payment-batch-product.service';
import { BatchPaymentAccordionComponent } from '../batch-payment-accordion/batch-payment-accordion.component';
import { BatchProductComponent } from '../batch-product/batch-product.component';
import { Subscription } from 'rxjs';
import { PaymentBatchService } from '../../../../../../common/services/payment.service';
import { concatMap, debounceTime, filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../../../../../app/corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { PreviewService } from '../../../../../../corporate/trade/lc/initiation/services/preview.service';
import { DatePipe } from '@angular/common';
import { SessionValidateService } from '../../../../../../../app/common/services/session-validate-service';
import { CurrencyRequest } from '../../../../../../../app/common/model/currency-request';
import { multipleEmailValidation } from '../../../../../common/validator/ValidationKeys';
import { PaymentInstrumentProductService } from '../../services/payment-instrument-product.service';
import moment from 'moment';
@Component({
  selector: 'app-batch-general-details',
  templateUrl: './batch-general-details.component.html',
  styleUrls: ['./batch-general-details.component.scss'],
  providers: [
    { provide: HOST_COMPONENT, useExisting: BatchGeneralDetailsComponent }
  ]
})
export class BatchGeneralDetailsComponent extends BatchProductComponent implements OnInit, AfterViewInit {
  @Output() messageToEmit = new EventEmitter<string>();
  @Output() emitBatchRefId = new EventEmitter();
  form: FCCFormGroup;
  module = `${this.translateService.instant(FccConstants.BATCH_GENERAL_DETAILS)}`;
  mode;
  count = 0;
  accordionArray = [];
  counterTransaction = [];
  subscriptions: Subscription[] = [];
  valMap = new Map();
  changeFieldsMap = new Map();
  productType = '';
  changefiledOfAmtAndTransMap = new Map();
  valMpaForPackage = new Map();
  @ViewChild(BatchPaymentAccordionComponent, { read: BatchPaymentAccordionComponent }) public batchpaymentAccordion:
  BatchPaymentAccordionComponent;
  FieldValToOpenDialog: string;
  beneficiaryCodeRegex: any;
  beneficiaryNameRegex: any;
  mobileNumberRegex: any;
  productCode;
  option;
  category;
  apiModel;
  paymentRefNo: string;
  paymentColumnList = [];
  paymentFieldList = [];
  adhocFieldList = [];
  maxDate: Date;
  minDate: Date;
  holidayList: any[];
  beneEditToggleVisible: boolean;
  beneNameAndCodeVal: any;
  curRequest: CurrencyRequest = new CurrencyRequest();
  editRecordIndex;
  ifscResponse: Subscription;
  testData: any;
  batchRefNumber: any;
  instrumentRefNumber: any;
  scrollTimeout = 100;
  scrollTimer:any;
  scrollTop:number;
  scrollHeight: number;
  elementHeight: number;
  scrolling = false;
  atBottom = false;
  changeinAmtAndTransField = false;
  isControlTotalRequired = true;
  batchRefId: any;
  beneNameCode: any;
  accountLimit = 0;
  paymentTablelength = 0;
  subscriptionForAutosave: Subscription[] = [];
  enrichmentSubscriptions: Subscription[] = [];
  parentForm: FCCFormGroup;
  loadEnrichDataAutoSaveFlag: boolean;
  enrichmentFields: any;
  isEnrichTypeMultiple: any;
  enrichmentFieldsName: any[] = [];
  columnOrder: any;
  isSaveValid: boolean;
  addNewMode: boolean;
  displayAddEnrichment = false;
  paymentCount = 0;
  reviewComments : any;
  paymentReferenceNumber : string;
  paymentDetailsResponse : any;
  editBatchSubscription : Subscription;
  paymentRef = '';
  @Output() checkSubmitStatus: EventEmitter<any> = new EventEmitter();
  beneBalanceAmt = -1;
  beneTxnNoBalance = -1;
  beneLimitMap = new Map();
  isDialogOpen: boolean;
  isMandatoryEnrichmentPresent = false;
  addCopyPaymentCheckbox = true;
  payFromValue: string;
  isInstrumentAdded = false;
  deletedEnrichmentsIndex = [];
  paymentPackageName: any;
  updatedFlag = false;
  controlTotalFlag = true;
  productTypeArray: any[] = [];
  mondayFlag: any;
  tuesdayFlag: any;
  wednesdayFlag: any;
  thrusdayFlag: any;
  fridayFlag: any;
  saturdayFlag: any;
  sundayFlag: any;
  maxDays: any;
  zeroProofingFlag = true;
  beneEmailrequiredFlag = false;
  beneEmailIdEditPageFlag = false;
  beneMobileNorequiredFlag = false;
  beneMobileNoEditPageFlag = false;
  enrichmentSequence: any[];
  cuttOffTime: any;
  isSavePaymentClicked = false;
  isCancelClicked = false;
  selectedProductType: any = '';
  discardedInstrument = false;
  isTrashIconTriggered = false;
  isAddPaymentClicked = false;
  updateClicked = false;
  editBalanceDetails = false;
  cancelEditedBalanceDetails = false;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService,
              protected prevNextService: PrevNextService,
              protected utilityService: UtilityService, protected saveDraftService: SaveDraftService,
              protected searchLayoutService: SearchLayoutService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected stateService: ProductStateService, protected route: ActivatedRoute,
              protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
              protected dialogService: DialogService,
              public fccGlobalConstantService: FccGlobalConstantService, protected productMappingService: ProductMappingService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected paymentBatchProductService: PaymentBatchProductService,
              protected multiBankService: MultiBankService,
              protected dropdownAPIService: DropDownAPIService,
              protected taskService: FccTaskService,
              protected paymentService: PaymentBatchService,
              protected dashboardService: DashboardService, protected paymentInstrumentProductService: PaymentInstrumentProductService,
              protected codeDataService: CodeDataService, protected cashCommonDataService: CashCommonDataService,
              protected previewService: PreviewService, public datepipe: DatePipe, protected sessionValidation: SessionValidateService) {
      super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
        searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, paymentBatchProductService);

      }

  ngOnInit(): void {
    super.ngOnInit();
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.category = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.paymentInstrumentProductService.resetEnrichmentConfig();
    this.stateService.autosaveProductCode = FccGlobalConstant.PRODUCT_BT;
    this.mode = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.MODE
    );
    this.subscriptions.push(
      this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response && response.showStepper !== FccConstants.STRING_TRUE) {
          this.commonService.isStepperDisabled = true;
        }
      })
    );
    this.initializeFormGroup();
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
    this.editBatchSubscription = this.commonService.batchEditInstrument.subscribe((value) => {
      if(this.commonService.isNonEmptyValue(value)) {
        this.getEnrichmentFields();
        this.patchInstrumentValues(value,this.form);
      }
      this.transactionsDetailUpdate();
      //this.transactionDetailsRender();
    });
    this.commonService.counterTransaction = this.counterTransaction;
    this.subscriptions.push(this.commonService.batchDiscardInstrument.subscribe((value) => {
      if(value > -1){
        this.discardInstrument(value);
      }
    }));
    this.onClickAddBeneficiaryCheckbox();
    this.form.removeControl(FccGlobalConstant.FCM_FIELD_PAYER);
  }
   if (this.commonService.isNonEmptyValue(localStorage.getItem('enrichmentFields'))
   && localStorage.getItem('enrichmentFields') !== 'undefined') {
    this.enrichmentFields = JSON.parse(localStorage.getItem('enrichmentFields'));
   }

    this.commonService.getConfiguredValues('BENEFICIARY_CREATION_ACCOUNT_LIMIT')
    .subscribe(resp => {
      if(resp && resp?.BENEFICIARY_CREATION_ACCOUNT_LIMIT) {
        this.accountLimit = parseInt(resp.BENEFICIARY_CREATION_ACCOUNT_LIMIT, 10);
      }
    });

    this.route.queryParams.subscribe((data) => {
      this.commonService.putQueryParameters(FccGlobalConstant.CATEGORY, data.category);
      this.commonService.putQueryParameters(FccGlobalConstant.OPTION, data.option);
    });

    if (this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE).value) {
      this.paymentRef = this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE).value;
    }
    if (this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value) {
      this.beneNameCode = this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value;
      this.form.get(FccConstants.FCM_NON_ADHOC_BENEFECIARY_NAME)
      .patchValue(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value.name);
    }
    this.initializeDropdownValues(['clientDetails']);
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PRODUCT_TYPE).value)) {
      this.onClickPaymentProductType();
    }
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_BENEFECIARY_NAME).value)) {
      this.onClickBeneficiaryNameCode();
    }

    this.paymentService.paymentRefNoSubscription$.subscribe((val) => {
      this.paymentRefNo = val;
    });
    this.getCurrencyDetail();
    this.getApiModel();

    this.eventEmitterService.autoSaveForLater.subscribe(sectionName => {
      if(sectionName === FccConstants.BATCH_GENERAL_DETAILS) {
          this.commonService.autoSaveForm(
            this.productMappingService.buildFormDataJson(this.form, FccConstants.FCM_BENEFICIARY_GENERAL_DETAILS)
            , this.stateService.getAutoSaveCreateFlagInState()
            , FccGlobalConstant.PRODUCT_BT
            , ''
            , this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION)
            ).subscribe(resp => {
              if (resp?.message) {
                this.stateService.setAutoSaveCreateFlagInState(false);
              }
            });
      }
    });


    this.eventEmitterService.renderSavedValues.subscribe(sectionName => {
      let flag = false;
      if(sectionName === FccConstants.BATCH_GENERAL_DETAILS) {
       if (this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value) {
        this.beneNameCode = this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value;
        this.form.get(FccConstants.FCM_NON_ADHOC_BENEFECIARY_NAME)
        .patchValue(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value.name);
      }
        this.paymentTablelength = this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
          FccGlobalConstant.DATA
        ]?.length;
        if(this.paymentTablelength > 0) {

         const formData = this.commonService.getBatchFormData();
         formData.push(this.cloneAbstractControl(this.form).controls);
         this.commonService.setBatchFormData(formData);
          this.renderFieldsAsEarlier(
            this.form,
            FCMPaymentsConstants.FCM_PAYMENT_FIELDS
          );
          if(this.form.get('beneficiaryBankIfscCode')[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] === false) {
            this.form.get('beneficiaryBankIfscCode').clearValidators();
          }
          this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = false;
          const griddata =this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.DATA];
            griddata.forEach(element => {
              element[FccConstants.UPDATE_FLAG] = true;
              element.highlight = false;
            });

        } else {
          this.loadEnrichDataAutoSaveFlag = true;
          this.getEnrichmentFields();
          if (this.commonService.isnonEMptyString(this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE_NUMBER).value)) {
            this.setRenderOnlyFields(
              this.form,
              FCMPaymentsConstants.FCM_PAYMENT_FIELDS,
              true
            );
          }
          if (this.checkMandatoryFieldsInEnrichments() &&
          this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].length === 0) {
            this.onClickAddEnrichmentField(null,true);
            flag = true;
            this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = flag;
          } else if(!this.checkMandatoryFieldsInEnrichments()) {
            this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD, true);
          }
          this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = false;

          this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = false;
        }
        this.removeValidators(this.form, FCMPaymentsConstants.FCM_PAYMENT_FIELDS);
        this.removeValidators(this.form, FCMPaymentsConstants.DISPLAY_ADHOC_BENEFICIARY_FIELDS);
        if (this.enrichmentFieldsName.length === 0 && !this.form.get(this.enrichmentFieldsName[0])) {
          this.loadEnrichmentDataOnAutoSave();
        }
        if (this.paymentTablelength === 0 &&
          this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].length > 0) {
            this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            if(this.isEnrichTypeMultiple){
              this.setRenderOnly(this.form, 'addNewEnrichment', true);
            }
        } else if(this.paymentTablelength > 0) {
          this.form.get(FCMPaymentsConstants.CANCEL_PAYMENT)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = false;
        }
        this.form.updateValueAndValidity();
       }
    });

    this.subscriptionForAutosave.push(
      this.eventEmitterService.renderSavedEnrichValues.subscribe((obj) => {
        if (this.enrichmentFieldsName.length > 0 && this.paymentTablelength < 1 && Object.keys(obj).length > 0 &&
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].length < 1) {
          this.enrichmentFieldsName.forEach((field) => {
            if (this.enrichmentFields[field].type === 'input-date' && typeof(obj[field]) === 'string' &&
            this.commonService.isnonEMptyString(obj[field])) {
              const val = obj[field].split('/');
              this.commonService.getFormElement(this.form,
                field).setValue(new Date(`${val[1]}/${val[0]}/${val[2]}`));
              this.commonService.getFormElement(this.form,field).updateValueAndValidity();
            } else {
              this.commonService.getFormElement(this.form,field).setValue(obj[field]); //
              this.commonService.getFormElement(this.form,field).updateValueAndValidity();
            }
          });
        }
        })
    );


  this.subscriptionForAutosave.push(
    this.eventEmitterService.cancelTransaction.subscribe(sectionName => {
      if(sectionName === FccConstants.BATCH_GENERAL_DETAILS) {
        const paramKeys = {
          productCode : FccGlobalConstant.PRODUCT_BT,
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
            }
            const griddata =this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
              FccGlobalConstant.DATA];
              griddata.forEach(element => {
                element[FccConstants.UPDATE_FLAG] = false;
              });
          });
      }
    })
  );
    if (!this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS]['btndisable']
     && !this.changeinAmtAndTransField) {
      this.changeinAmtAndTransField = true;
      this.commonService.batchAmtTransactionSubject$.subscribe((val) => {
        this.changefiledOfAmtAndTransMap = val;
      });

    }
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      this.fetchDetails();
    }

  const griddata =this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
  griddata.forEach(element => {
    element[FccConstants.UPDATE_FLAG] = true;
  });

    // Validations
    this.form.addFCCValidators(
      FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION,
      Validators.pattern(FccGlobalConstant.NUMBER_REGEX),
      0
    );
    this.form.addFCCValidators(
      FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT,
      Validators.pattern(FccGlobalConstant.AMOUNT_VALIDATION),
      0
    );

    this.addTransactionValidation();
    this.onClickReceiverType();
    this.checkAdditionalFieldExist();
    this.changeToasterStyle(true);
  }

  callAutosave() {
    if (this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION) === FccGlobalConstant.ADD_FEATURES) {
      this.subscriptionForAutosave.push(
      this.form.valueChanges
      .pipe(
            filter(() => this.form.dirty && this.stateService.getAutoSaveConfig()?.isAutoSaveEnabled),
            debounceTime(this.stateService.getAutoSaveConfig()?.autoSaveDelay),
            concatMap(() => this.commonService.autoSaveForm(
                this.productMappingService.buildFormDataJson(this.form, FccConstants.BATCH_GENERAL_DETAILS)
                , this.stateService.getAutoSaveCreateFlagInState()
                , FccGlobalConstant.PRODUCT_BT
                , null
                , this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION)
                )
              )
            )
      .subscribe(resp => {
        if (resp?.message) {
          this.stateService.setAutoSaveCreateFlagInState(false);
        }
        if(resp?.responseDetails) {
          this.stateService.setAutoSavedTime(resp?.responseDetails?.lastUpdatedDateTime);
        }
      }));
      this.commonService.getProductCode.next(FccGlobalConstant.PRODUCT_BT);
      this.stateService.setStateSection(FccConstants.BATCH_GENERAL_DETAILS, this.form);
      this.onClickClientDetails();
      this.onClickPaymentPackages(null, true);
    }
  }

  ngAfterViewInit(): void {
    this.paymentInstrumentProductService.getPaymentMultisetFlag().subscribe(
      res =>{
        this.isEnrichTypeMultiple = res;
      }
    );
    if(this.operation !== FCMPaymentsConstants.MODIFY_BATCH){
      this.callAutosave();
    }
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.form.valueChanges.subscribe(change => {
        this.checkSubmitStatus.emit(this.form.valid);
      });
    }

    if (this.commonService.isnonEMptyString(this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE_NUMBER).value)) {
      this.disableTransactionField();
    }
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      this.editBatchSubscription = this.commonService.batchEditInstrument.subscribe((value) => {
        if(this.commonService.isNonEmptyValue(value)) {
          this.patchInstrumentValues(value,this.form);
        }
      });
      this.commonService.paymentResponse.subscribe(
        res => {
          this.paymentDetailsResponse = res;
        }
      );
    }

  }

  initializeFormGroup() {
    this.paymentColumnList = FCMPaymentsConstants.FCM_PAYMENT_COLUMNS;
    this.paymentFieldList = FCMPaymentsConstants.FCM_PAYMENT_FIELDS;
    this.adhocFieldList = FCMPaymentsConstants.FCM_BATCH_ADHOC_PAYMENT_FIELDS;
    const sectionName = FccConstants.BATCH_GENERAL_DETAILS;
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH && this.commonService.isNonEmptyValue(this.parentForm)
       && !this.commonService.isObjectEmpty(this.parentForm?.controls)){
      this.form = this.parentForm;
      this.updateOriginalAmountMaxLength(FccConstants.FCM_PAYMENT_AMOUNT);
      this.updateOriginalAmountMaxLength(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT);
      this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.paymentService.paymentRefNoSubscription$.next(this.commonService.getQueryParametersFromKey('paymentReferenceNumber'));
      this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT, null);
      this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION, null);
      this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FCMPaymentsConstants.BALANCE_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FCMPaymentsConstants.BALANCE_TRANSACTION_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get("balanceSpacer")[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    } else {
      this.form = this.stateService.getSectionData(sectionName);
      this.updateOriginalAmountMaxLength(FccConstants.FCM_PAYMENT_AMOUNT);
      this.updateOriginalAmountMaxLength(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT);
      this.paymentTablelength = this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.DATA
      ]?.length;
      let isPaymentFieldLoaded = false;
      if (this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value && this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value) {
      let filterParameter: any = {};
      filterParameter.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode;
      filterParameter.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label;
      filterParameter = JSON.stringify(filterParameter);
      this.subscriptions.push(
        this.commonService.getExternalStaticDataList(FccConstants.FCM_PAYMENT_ZERO_PROOF_FLAG, filterParameter).subscribe(response => {
        if (response) {
          const zeroProof = response[0].check_zero_proof === 'Y' ? true : false;
          this.zeroProofingFlag = zeroProof;
        }}));
      }
      if(this.form.get(FccConstants.FCM_PAYMENT_PAY_TO)){
        isPaymentFieldLoaded = this.form.get(FccConstants.FCM_PAYMENT_PAY_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED];
      }
      if (this.paymentTablelength > 0 && !isPaymentFieldLoaded) {
          this.isInstrumentAdded = true;
          this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.LIST_DATA
          ] = true;
          this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]
          .forEach(item => {
            if (item.amount.indexOf('?') > -1) {
              item.amount = item.amount.replace('?', this.commonService.getCurrSymbol(item.currency));
            }
            this.counterTransaction.push(this.balanceTransactionFormat(item.amountDecimal));
          });
          this.transactionsDetailUpdate();
          this.renderFieldsAsEarlier(
            this.form,
            this.paymentFieldList
          );
          this.renderFieldsAsEarlier(
            this.form,
            [FccConstants.FCM_BENEFICIARY_CODE_VIEW, FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW]
          );
          if(this.form.get('beneficiaryBankIfscCode')[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] === false) {
            this.form.get('beneficiaryBankIfscCode').clearValidators();
          }
          this.renderFieldsAsEarlier(
            this.form,
            FCMPaymentsConstants.DISPLAY_ADHOC_BENEFICIARY_FIELDS
          );

            this.showAddPaymentButton();
            this.setRenderOnlyFields(
              this.form,
              FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS,
              false
            );
            this.form.get(FCMPaymentsConstants.PAYMENTS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
            this.form.get(FccConstants.FCM_PAYMENT_PACKAGES)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
            this.transactionDetailsRender();
          } else if (this.paymentTablelength > 0 && isPaymentFieldLoaded){
            this.retainPaymentFields();
          } else {
          if (this.commonService.isnonEMptyString(this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE_NUMBER).value)) {
            this.form.get(FccConstants.COPY_PAYMENT_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          }else{
            this.form.get(FccConstants.COPY_PAYMENT_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          }
          this.form.get(FCMPaymentsConstants.BALANCE_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get(FCMPaymentsConstants.BALANCE_TRANSACTION_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get("balanceSpacer")[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        if (this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE_NUMBER).value ||
            this.form.get(FCMPaymentsConstants.ADD_PAYMENT_FLAG).value === FccConstants.STRING_TRUE) {
          const payRefNo = this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE_NUMBER).value;
          this.paymentService.paymentRefNoSubscription$.next(payRefNo);
          this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get(FCMPaymentsConstants.PAYMENTS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;

        this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.commonService.batchRefId.next(payRefNo);
        this.changeinAmtAndTransField = true;
        this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
        this.form.get(FccConstants.FCM_PAYMENT_PACKAGES)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
        this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT, this.paymentTransactionAmtRemoveFormat());
        this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION, this.paymentNoOfTransactionReplaceChars());
        if(!isPaymentFieldLoaded){
          this.showAddPaymentButton();
        }
        if (this.form.get(FccConstants.ADDITIONAL_INFORMATION).value === FccGlobalConstant.CODE_Y) {
          this.onClickAdditionalInformation();
        }
      }
      this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.enableCreateBatch();
      this.commonService.putQueryParameters(FccGlobalConstant.PRODUCT, this.form.get('productCode').value);
    }
  }

  onClickCreateBatch() {
    if(this.addTransactionValidation()){
      return;
    }
    let paymentTransactionAmt = this.form.get('paymentTransactionAmt').value;
    if (this.form.get('paymentTransactionAmt').value != null) {
      paymentTransactionAmt = this.commonService.removeAmountFormatting(paymentTransactionAmt);
    }
    if (this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX)?.value === FccGlobalConstant.CODE_Y) {
      this.form.get('isConfidentialPayment').setValue(FccGlobalConstant.CODE_Y);
    } else {
      this.form.get('isConfidentialPayment').setValue(FccGlobalConstant.CODE_N);
    }
    const datestamp = this.utilityService.getUniqueTimeStampValue();
    const productCode = this.productCode?.substring(0, 2) ? this.productCode.substring(0, 2) : 'XX';
    const paymentReference = productCode + datestamp;
    const requestObj = {
      debtorIdentification: this.form.get('clientDetails').value.label,
      legalEntity: this.form.get('legalEntity').value,
      controlTotal: this.form.get('paymentNoOfTransaction').value || 0,
      controlSum: paymentTransactionAmt || 0,
      paymentReference: paymentReference,
      txnType: this.form.get('transactionType').value,
      methodOfPayment: this.form.get('paymentPackages').value.label,
      isConfidentialPayment: this.form.get('isConfidentialPayment').value === 'Y' ? true : false,
      isControlTotalRequired: this.isControlTotalRequired
    };
    this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA] = [];

    this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS]['btndisable'] = true;
    this.paymentService.createBatch(requestObj).subscribe((res) => {
      this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS]['btndisable'] = false;
      if (res && res.data.paymentReferenceNumber) {
        this.batchRefNumber = res.data.paymentReferenceNumber;
        this.commonService.batchRefNumber = res.data.paymentReferenceNumber;
        this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE_NUMBER).setValue(res.data.paymentReferenceNumber);
        this.paymentService.paymentRefNoSubscription$.next(res.data.paymentReferenceNumber);
        this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        if (!requestObj.controlTotal || requestObj.controlTotal > 1) {
          this.form.get(FccConstants.COPY_PAYMENT_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        }
        this.form.get(FCMPaymentsConstants.PAYMENTS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.setRenderOnlyFields(
          this.form,
          this.paymentFieldList,
          true
        );
        if (this.checkMandatoryFieldsInEnrichments()) {
          this.onClickAddEnrichmentField(null);
        } else {
          this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD, this.displayAddEnrichment);
        }
        this.getRegexValidation();
        if(this.commonService.isnonEMptyString(res.data)){
          this.batchRefId = res.data.paymentReferenceNumber;
          this.commonService.batchRefId.next(this.batchRefId);
        }
      }
      this.commonService.setBatchFormData([]);
      if(document.getElementById(FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT)) {
        document.getElementById(FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT).focus();
      }
      this.changeinAmtAndTransField = true;
      this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.get(FccConstants.FCM_PAYMENT_PACKAGES)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT, this.paymentTransactionAmtRemoveFormat());
      this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION, this.paymentNoOfTransactionReplaceChars());
      this.callAutosave();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }, _err => {
      this.showErrorToaster(_err);
      this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS]['btndisable'] = false;
    });
    if(this.commonService.isnonEMptyString(this.form.get('paymentPackages').value)){
      this.disableTransactionField();
    }
    this.transactionsDetailUpdate();
    this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = true;
  }
  checkMandatoryFieldsInEnrichments(): boolean {
    let val = false;
    if(this.commonService.isNonEmptyValue(this.enrichmentFields)) {
      Object.keys(this.enrichmentFields).forEach((key) => {
        if (this.enrichmentFields[key].required) {
          val = true;
          this.isMandatoryEnrichmentPresent = true;
        }
      });
    }
    return val;
  }

  paymentNoOfTransactionReplaceChars(){
    if (this.form) {
      let noOfTransactions = this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).value;
      noOfTransactions = this.commonService.replaceStringToNumberFormat(noOfTransactions);
      return noOfTransactions;
    }
  }

  onBlurPaymentNoOfTransaction() {
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).value)) {
      if (!this.zeroProofingFlag) {
        this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).setValidators(Validators.required);
        this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).updateValueAndValidity();
      }
      this.isControlTotalRequired = true;
      this.validateEnableSave();
    } else {
      if (!this.zeroProofingFlag) {
        this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
        this.resetValidation(this.form, FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT);
        this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).updateValueAndValidity();
      }
      this.isControlTotalRequired = false;
    }
    this.enableCreateBatch();
    const noOfTransactions = this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).value;
    const paymentReference = this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE_NUMBER).value;
    if(!this.controlTotalFlag){
      this.clearValidators(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION);
    }
    this.addTransactionValidation();
    if (this.commonService.isnonEMptyString(noOfTransactions)) {
      let validationError = null;
      const transactionCharCheck = new RegExp(FccGlobalConstant.NUMBER_REGEX, "g");
      const transactionZeroCheck = new RegExp(FccGlobalConstant.START_WITHOUT_ZERO, "g");
      if(!transactionCharCheck.test(noOfTransactions)) {
        validationError = { accountNumberInvalid: true };
        this.addFccValidation(validationError, FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION);
        this.controlTotalFlag = false;
      }else if(!transactionZeroCheck.test(noOfTransactions)){
        validationError = { allowedNumberValues: { minValue : "1", maxValue:"9999" } };
        this.addFccValidation(validationError, FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION);
        this.controlTotalFlag = false;
      }
    }
    this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).updateValueAndValidity();

    if (this.changeinAmtAndTransField) {
      const noOfTransactionsPrevValue = this.changefiledOfAmtAndTransMap.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION);
      if(noOfTransactionsPrevValue !== this.paymentNoOfTransactionReplaceChars() &&
      (this.commonService.isnonEMptyString(paymentReference) || this.commonService.isnonEMptyString(noOfTransactionsPrevValue)))
      {
        this.openDialog();
      }
    }
  }

  onClickUpdateTransaction(){
    const message = `${this.translateService.instant('on saving AMt')}`;
    this.count = 1;
      this.dialogRef = this.dialogService.open(
        ConfirmationDialogComponent,
        {
          header: `${this.translateService.instant('updateTransaction')}`,
          width: '35em',
          baseZIndex: 10000,
          styleClass: 'fileUploadClass',
          data: { locaKey: message,
            showCancelButton:true,
            showNoButton: false,
            showYesButton: false,
            showSaveButton: true },
        }
      );
      this.subscriptions.push(this.dialogRef.onClose.subscribe((result) => {
        if (result.toLowerCase() === 'savedInfo') {
          this.resetFormfields();
        } else if(result.toLowerCase() === 'cancel'){
          this.resetFormToOriginal();
        }
      }));
  }

  panelControlArrayCopy(panelControlArray){
    const newPanelControlArray = {};
    for(const key of Object.keys(panelControlArray)) {
      newPanelControlArray[key] = { ...panelControlArray[key] };
      if (panelControlArray[key] !== undefined) {
        newPanelControlArray[key].__proto__ = panelControlArray[key].__proto__;
      }

    }
    return newPanelControlArray;
  }

  renderButtonForNextAccordion(panelData){
    panelData.forEach(element => {
      if(element.name === 'cancel'){
        element.rendered = true;
      }
    });
  }

  onClickAddPayment(){
    this.isAddPaymentClicked = true;
    this.isInstrumentAdded = false;
    this.setRenderOnlyFields(
      this.form,
      this.paymentFieldList,
      true
    );
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      this.commonService.batchAddSubmitFlag.next(true);
      this.form.get('balanceAmtTrnValidMsg')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    this.resetRenderOnlyFields(this.form, FCMPaymentsConstants.FCM_PAYMENT_RESET_FIELDS);
    this.patchFieldParameters(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME),{ options:[] });
    this.patchFieldParameters(this.form.get(FccConstants.FCM_PAYMENT_PAY_TO),{ options:[] });
    this.setAmountOriginalValue(FccConstants.FCM_PAYMENT_AMOUNT);
    this.resetRenderOnlyFields(this.form, FCMPaymentsConstants.FCM_BATCH_ADHOC_PAYMENT_FIELDS);
    this.resetRenderOnlyFields(this.form, FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS);
    this.form.get(FccConstants.FCM_ACCOUNT_NO).setValue('');
    FCMPaymentsConstants.FCM_PAYMENT_COLUMNS.forEach((item) => {
      if (item !== 'beneficiaryType') {
        this.form.get(item)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      }
    });
    if (this.checkMandatoryFieldsInEnrichments()) {
      this.onClickAddEnrichmentField(null);
    } else if(this.commonService.isNonEmptyValue(this.enrichmentFields)) {
      this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD, true);
    } else {
      this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD, false);
    }
    this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FCMPaymentsConstants.ADD_PAYMENT_FLAG).patchValue(FccConstants.STRING_TRUE);
    this.transactionDetailsRender();
    this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = true;
    this.beneNameCode = undefined;
    this.form.get(FccConstants.COPY_PAYMENT_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    if(this.form.get(FccConstants.COPY_PAYMENT_CHECKBOX).value === FccGlobalConstant.CODE_Y
      && this.commonService.isnonEMptyString(this.payFromValue)){
      this.retainDropdownValues(this.form.get(FccConstants.FCM_PAYMENT_PAY_FROM) , this.payFromValue);
    }
    this.scrollToForm();
    this.form.get(FccConstants.FCM_PRODUCT_TYPE)[FccGlobalConstant.PARAMS].warning = '';
    this.validateNextEnable();
  }

  initializeDropdownValues(dropdownFields?, filterParams?){
    dropdownFields.forEach((dropdownField) => {
      if (dropdownField === 'paymentPackages') {
        let filterParamsTemp: any = {};
        filterParamsTemp.paymentPackages = 'B';
        filterParamsTemp.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label;
        filterParamsTemp = JSON.stringify(filterParamsTemp);
        this.subscriptions.push(this.commonService.getExternalStaticDataList(dropdownField, filterParamsTemp)
        .subscribe((response) => {
          if (response) {
              this.updateDropdown(dropdownField,response);
          }
        }));
      } else if (dropdownField === 'payFrom') {
        let filterParamsTemp: any = {};
        filterParamsTemp.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode ?
        this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode : this.form.get(FccConstants.FCM_PAYMENT_PACKAGES)?.value;
        filterParamsTemp.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.label;
        filterParamsTemp.payFromType = 'B';
        filterParamsTemp = JSON.stringify(filterParamsTemp);
        if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.label)
        && this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.label)) {
        this.commonService.getExternalStaticDataList(dropdownField, filterParamsTemp)
        .subscribe((response) => {
          if (response) {
              this.updateDropdown(dropdownField,response);
          }
        });
      }
      } else if(dropdownField === FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME
        && JSON.parse(filterParams).clientCode === 'KOTAK'){
          let startIndex = JSON.parse(filterParams).startIndex;
          const limit = JSON.parse(filterParams).endIndex;
          let endIndex = JSON.parse(filterParams).endIndex;
          const filterParamsTemp = JSON.parse(filterParams);
          this.commonService.getExternalStaticDataList(dropdownField, filterParams, true)
        .subscribe((response) => {
          const beneCodeList = [];
          if (response) {
              const rowCount = response[0].row_count;
              this.updateBeneCodeNameDropdown(response, beneCodeList);
              while(startIndex <= rowCount-limit){
                startIndex = endIndex+1;
                endIndex = startIndex + limit - 1;
                filterParamsTemp.startIndex = startIndex;
                filterParamsTemp.endIndex = endIndex;
                this.commonService.getExternalStaticDataList(dropdownField, JSON.stringify(filterParamsTemp), true)
                  .subscribe((response) => {
                    this.updateBeneCodeNameDropdown(response, beneCodeList);
                  });
              }
          }
        });
      } else if(dropdownField === FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME){
          this.subscriptions.push(this.commonService.getExternalStaticDataList(dropdownField, filterParams, true)
        .subscribe((response) => {
          if (response) {
              this.updateDropdown(dropdownField,response);
          }
        }));
        } else if(dropdownField === FccConstants.BENE_BANK_IFSC_CODE){
          const filterParsed = JSON.parse(filterParams);
          if(filterParsed.paymenttype && filterParsed.ifscValue && filterParsed.ifscValue.length > 3){
            this.subscriptions.push(this.commonService.getExternalStaticDataList(dropdownField, filterParams, true)
          .subscribe((response) => {
            if (response) {
                this.updateDropdown(dropdownField,response);
            }
          }));
          }
        } else {
        this.subscriptions.push(this.commonService.getExternalStaticDataList(dropdownField, filterParams)
        .subscribe((response) => {
          if (response) {
              this.updateDropdown(dropdownField,response);
          }
        }));
      }
    });
  }

  updateBeneCodeNameDropdown(dropdownList, beneCodeList){
    dropdownList.forEach(element => {
      const benefeciaryNameCode: { label: string, value: any } = {
        label: element.receiver_code,
        value : {
          label: element.receiver_code,
          name: element.benedescription,
          shortName: element.benedescription,
          maxTxnLimit: element.max_txn_limit,
          limitLevelFlag: element.limit_level_flag,
          maxNoTxn: element.max_no_txn,
          periodType: element.period_type,
          drawerCode: element.code,
          ifscCode: element.bank_id,
          emailId : element.bene_email_id,
          mobileNumber: element.bene_mobile_nmbr
        }
      };
      beneCodeList.push(benefeciaryNameCode);
    });
    if (this.beneNameCode) {
      beneCodeList = this.uniqueBeneficaryList(beneCodeList);
      this.patchFieldValueAndParameters(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME),
      this.beneNameCode, { options: beneCodeList });
    } else {
      this.patchFieldParameters(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME), { options: beneCodeList });
    }
    this.callBeneficiaryCodeBasedOptions();
  }

  uniqueBeneficaryList(beneficiaryDataArray) {
    return beneficiaryDataArray.reduce((unique, o) => {
      if (!unique.some(obj => obj.label === o.label)) {
        unique.push(o);
      }
      return unique;
    }, []);
  }

  updateDropdown(key, dropdownList) {
    if (key === FccConstants.FCM_CLIENT_CODE_DETAILS) {
      this.commonService.setDefaultClient(dropdownList, this.form, key);
      if (this.form.controls[key].value) {
        this.onClickClientDetails();
      }
    } else if (key === FccConstants.FCM_PAYMENT_PACKAGES) {
      const paymentPackages = [];
      dropdownList.forEach(element => {
        const paymentPackage: { label: string, value: any } = {
          label: element.package,
            value : {
              label: element.package,
              name: element.paymenttype,
              shortName: element.package,
              paymentType: element.payment_type,
              productCode: element.mypproduct
            }
        };
        paymentPackages.push(paymentPackage);
      });
      this.patchFieldParameters(this.form.get(key), { options: paymentPackages });
      this.callPackageBasedOptions();
    } else if (key === FccConstants.FCM_PAYMENT_PAY_FROM){
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const payFromList = [];
      dropdownList.forEach(element => {
        const payFrom: { label: string, value: any } = {
          label: element.code,
          value : {
            label: element.code,
            name: element.description,
            shortName: element.description,
            accountType : element.account_type,
            currency : element.currency,
            accountName : element.acct_name,
            accountId : element.code
          }
        };
        payFromList.push(payFrom);
      });
      this.patchFieldParameters(this.form.get(key), { options: payFromList });
      this.patchDropdownValue(key);
    } else if (key === FccConstants.FCM_PRODUCT_TYPE){
      const productTypeList = [];
      dropdownList.forEach(element => {
        const productType: { label: string, value: any } = {
          label: element.code,
          value : {
            label: element.code,
            shortName: element.description,
            perProductMinLimit: element.per_txn_min_amnt,
            perProductMaxLimit: element.per_txn_max_amnt,
            legalEntityAmtFlag: element.legalentityamt_flag === FccGlobalConstant.CODE_Y ?
              FccGlobalConstant.CODE_Y : FccGlobalConstant.CODE_N,
            legalEntityAmt: element.legalentityamt_flag === FccGlobalConstant.CODE_Y ?
              element.legalentityamt : FccGlobalConstant.ZERO
          }
        };
        productTypeList.push(productType);
      });
      this.patchFieldParameters(this.form.get(key), { options: productTypeList });
      this.patchDropdownValue(key);
      this.productTypeArray = productTypeList;
      this.onClickPaymentProductType();
    } else if (key === FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME){
      let beneCodeList = [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const beneCodeSet = new Set();
      dropdownList.forEach(element => {
        const benefeciaryNameCode: { label: string, value: any } = {
          label: element.receiver_code,
          value : {
            label: element.receiver_code,
            name: element.benedescription,
            shortName: element.benedescription,
            maxTxnLimit: element.max_txn_limit,
            limitLevelFlag: element.limit_level_flag,
            maxNoTxn: element.max_no_txn,
            periodType: element.period_type,
            drawerCode: element.code,
            ifscCode: element.bank_id,
            emailId : element.bene_email_id,
            mobileNumber: element.bene_mobile_nmbr
          }
        };
        beneCodeList.push(benefeciaryNameCode);
      });
      if (this.beneNameCode) {
        beneCodeList = this.uniqueBeneficaryList(beneCodeList);
        this.patchFieldValueAndParameters(this.form.get(key), this.beneNameCode, { options: beneCodeList });
      } else {
        this.patchFieldParameters(this.form.get(key), { options: beneCodeList });
      }
      this.callBeneficiaryCodeBasedOptions();
    } else if (key === FccConstants.FCM_PAYMENT_PAY_TO){
      this.commonService.setDefaultPayTO(dropdownList, this.form, key);
      const payToList = [];
      dropdownList.forEach(element => {
        const payTo: { label: string, value: any } = {
          label: element.accountno,
          value : {
            label: element.accountno,
            name: element.bene_account_type,
            shortName: element.accountno,
            defaultAcc: element.default_account,
            accountType : element.bene_account_type,
            currency : element.bene_account_ccy,
            ifscCode : element.ifsc_code
          }
        };
        payToList.push(payTo);
      });
      this.patchFieldParameters(this.form.get(key), { options: payToList });
      this.patchDropdownValue(key);
      this.onClickPayTo();
    } else if (key === FccConstants.FCM_RECEIVER_TYPE) {
      let recType: { label: string, value: any };
      dropdownList.forEach(element => {
        if (element.receiver_lei_type === 'C') {
          recType = {
            label: FccConstants.RECEIVER_TYPE_CORPORATE,
            value: FccConstants.RECEIVER_TYPE_CORPORATE
          };
        } else if (element.receiver_lei_type === 'I') {
          recType = {
            label: 'INDIVIDUAL',
            value: 'INDIVIDUAL'
          };
        }
        this.form.get(FccConstants.FCM_RECEIVER_TYPE).setValue(recType.value);
        if (this.form.get(FccConstants.BATCH_ADHOC_FLAG).value !== FccConstants.BATCH_PAYMENT_ADHOC_FLOW) {
          this.form.get(FccConstants.FCM_RECEIVER_TYPE).disable();
        }
        this.form.get(FccConstants.FCM_RECEIVER_TYPE).updateValueAndValidity();
        this.onClickReceiverType();
      });
    } else if (key === FccConstants.FCM_LEI_CODE) {
      let leiCodeVal = null;
      dropdownList.forEach(element => {
        if (element.receiver_lei_type === 'C') {
          leiCodeVal = element.receiver_lei_code;
        }
      });
      this.form.get(FccConstants.FCM_LEI_CODE).setValue(leiCodeVal);
      if (this.form.get(FccConstants.BATCH_ADHOC_FLAG).value !== FccConstants.BATCH_PAYMENT_ADHOC_FLOW
      || this.form.get(FccConstants.FCM_RECEIVER_TYPE).value === FccConstants.RECEIVER_TYPE_INDIVIDUAL) {
        this.form.get(FccConstants.FCM_LEI_CODE).disable();
      }
      this.form.get(FccConstants.FCM_LEI_CODE).updateValueAndValidity();
      this.form.get(FccConstants.ADDITIONAL_INFORMATION).setValue(FccGlobalConstant.CODE_Y);
      this.onClickAdditionalInformation();
      this.onClickReceiverType();
    }else if (key === FccConstants.BENE_BANK_IFSC_CODE){
      const beneBankIfscList = [];
      dropdownList.forEach(element => {
        const beneBankIfsc: { label: string, value: any } = {
          label: element.ifsc,
          value : {
            label: element.ifsc,
            name: element.ifsc,
            shortName: element.ifsc,
            drawee_bank_code: element.drawee_bank_code,
            drawee_branch_code: element.drawee_branch_code,
            drawee_branch_description: element.drawee_branch_description,
            drawee_bank_description: element.drawee_bank_description
          }
        };
        beneBankIfscList.push(beneBankIfsc);
      });
      this.patchFieldParameters(this.form.get(key), { options: beneBankIfscList });
      this.patchDropdownValue(key);
    } else if (key === FccConstants.FCM_PAYMENT_ACCOUNT_TYPE) {
      const paymentAccountTypeList = [];
      dropdownList.forEach(element => {
        const paymentAccountType: { label: string, value: any } = {
          label : element.preload_value,
          value : {
            label: element.preload_value,
            shortName: element.preload_value
          }
        };
        paymentAccountTypeList.push(paymentAccountType);
      });
      if (this.operation === FCMPaymentsConstants.MODIFY_BATCH &&
        this.commonService.isEmptyValue(this.form.get(key).value)) {
        this.form.get(key).setValue(paymentAccountTypeList[0]?.value);
      }
      this.patchFieldParameters(this.form.get(key), { options: paymentAccountTypeList });
      this.patchDropdownValue(key);
    } else if (key === FccConstants.FCM_PAYMENT_EFFECTIVE_DATE) {
      dropdownList.forEach(element => {
        this.form.get(FccConstants.FCM_PAYMENT_EFFECTIVE_DATE)[FccGlobalConstant.PARAMS]['maxDate'] =
        this.commonService.calculateMaxDate(element.allow_max_future_days);
        this.maxDays = element.allow_max_future_days;
      });
      this.setProfileHolidays();
    }
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value)) {
      this.onClickAmount();
      this.onFocusAmount();
      this.onBlurAmount();
    }
  }

  setProfileHolidays(){
    let filterParams: any = {};
    filterParams.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
    this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
    filterParams.productCode = filterParams.productCode + '%';
    filterParams = JSON.stringify(filterParams);
    this.holidayList =[];
    this.subscriptions.push(this.commonService.getExternalStaticDataList(FCMPaymentsConstants.FCM_FETCH_HOLIDAY_LIST, filterParams)
    .subscribe((response) => {
      if (response) {
        this.mondayFlag = response[0]?.monday_flag;
        this.tuesdayFlag = response[0]?.tuesday_flag;
        this.wednesdayFlag = response[0]?.wednesday_flag;
        this.thrusdayFlag = response[0]?.thursday_flag;
        this.fridayFlag = response[0]?.friday_flag;
        this.saturdayFlag = response[0]?.saturday_flag;
        this.sundayFlag = response[0]?.sunday_flag;
        response.forEach(element => {
          const latestDate = this.datepipe.transform(element.holiday_date, 'yyyy-MM-dd');
          this.holidayList.push(latestDate);
        });
        if (this.commonService.isEmptyValue(this.form.get('effectiveDate').value) &&
        this.operation === FccGlobalConstant.ADD_FEATURES) {
          const nextWorkingDate = this.commonService.getImmediateWorkingDate(response,
            new Date(this.commonService.getServerDate()),this.holidayList);
          this.form.get('effectiveDate').setValue(nextWorkingDate);
          this.onClickEffectiveDate();
        }
        this.calculateWeeklyDays();
      }
    }));
  }

  calculateWeeklyDays(){
    const currentDate = new Date();
    const week = Number(this.maxDays/7);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    if(this.mondayFlag === 'Y'){
      const offset = 8 - currentDate.getDay(); // days till next Monday
      if(currentDate.getDay() === 1){
        this.holidayList.push( currentDate );
      }
      for(let i = 0 ; i < week ; i++) {
      this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
      }
    }
    if(this.tuesdayFlag === 'Y'){
      const offset = 2 - currentDate.getDay(); // days till next Monday
      if(currentDate.getDay() === 2){
        this.holidayList.push( currentDate );
      }
      for(let i = 0 ; i < week ; i++) {
      this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
      }
    }
    if(this.wednesdayFlag === 'Y'){
      const offset = 3 - currentDate.getDay(); // days till next Monday
      if(currentDate.getDay() === 3){
        this.holidayList.push( currentDate );
      }
      for(let i = 0 ; i < week ; i++) {
      this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
      }
    }
    if(this.thrusdayFlag === 'Y'){
      const offset = 4 - currentDate.getDay(); // days till next Monday
      if(currentDate.getDay() === 4){
        this.holidayList.push( currentDate );
      }
      for(let i = 0 ; i < week ; i++) {
      this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
      }
    }
    if(this.fridayFlag === 'Y'){
      const offset = 5 - currentDate.getDay(); // days till next Monday
      if(currentDate.getDay() === 5){
        this.holidayList.push( currentDate );
      }
      for(let i = 0 ; i < week ; i++) {
      this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
      }
    }
    if(this.saturdayFlag === 'Y'){
      const offset = 6 - currentDate.getDay(); // days till next Monday
      if(currentDate.getDay() === 6){
        this.holidayList.push( currentDate );
      }
      for(let i = 0 ; i < week ; i++) {
      this.holidayList.push( new Date(year, month, date + offset + 7 * i) );
      }
    }
    if(this.sundayFlag === 'Y'){
      this.calculateAllSunday();
    }
    this.form.get(FccConstants.FCM_PAYMENT_EFFECTIVE_DATE)[FccGlobalConstant.PARAMS]['holidayList'] = this.holidayList;
  }

  calculateAllSunday() {
    const currentDate = new Date();
    const startDate = this.datepipe.transform(currentDate, 'yyyy-MM-dd');
    const maxDate = this.form.get(FccConstants.FCM_PAYMENT_EFFECTIVE_DATE)[FccGlobalConstant.PARAMS]['maxDate'];
    const endDate = this.datepipe.transform(maxDate, 'yyyy-MM-dd');
    //const moment = require('moment');
    const start = moment(startDate);
    const end = moment(endDate);
    const day = 0;
    const current = start.clone();
    while (current.day(7 + day).isBefore(end)) {
      this.holidayList.push(current.clone());
    }
  }

  onClickClientDetails() {
    let filterParams: any = {};

    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value)) {
    this.form.get(FccConstants.FCM_CLIENT_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.FieldValToOpenDialog = 'clientCodeClick';
    this.patchFieldValueAndParameters(this.form.get(FccConstants.FCM_CLIENT_NAME),
            this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.name, {});
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value)) {
            this.FieldValToOpenDialog = FccConstants.FCM_CLIENT_CODE_CLICK;
            this.form.get(FccConstants.FCM_CLIENT_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.patchFieldValueAndParameters(this.form.get(FccConstants.FCM_CLIENT_NAME),
            this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.name, {});

              }
      filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
      this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
      filterParams = JSON.stringify(filterParams);
      this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_DATA_PAYMENT_PACKAGE, filterParams);
    }
    this.validateEnableSave();
  }

  getRegexValidation() {
    this.commonService.getConfiguredValues('PAYMENT_SINGLE_CUSTREFLIECODE_VALIDATION,BENEFICIARY_FORM_ACCOUNT_NUMBER_VALIDATION,'
    + 'BENEFICIARY_FORM_BENE_CODE_VALIDATION,BENEFICIARY_FORM_BENE_NAME_VALIDATION,BENEFICIARY_FORM_MOBILE_NUMBER_VALIDATION')
  .subscribe(resp => {
    if (resp.response && resp.response === 'REST_API_SUCCESS') {
      this.beneficiaryCodeRegex = resp.BENEFICIARY_FORM_BENE_CODE_VALIDATION;
      this.beneficiaryNameRegex = resp.BENEFICIARY_FORM_BENE_NAME_VALIDATION;
      this.mobileNumberRegex = resp.BENEFICIARY_FORM_MOBILE_NUMBER_VALIDATION;
      this.doBeneFormValidation();
    }});
  }

  doBeneFormValidation() {

    this.form.addFCCValidators(
      FccConstants.FCM_BENEFICIARY_CODE,
      Validators.pattern(this.beneficiaryCodeRegex),
      0
    );

    this.form.addFCCValidators(
      FccConstants.FCM_MOBILE_NUMBER,
      Validators.pattern(this.mobileNumberRegex),
      0
    );

    if(typeof (this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value) === 'string'){
      this.form.addFCCValidators(
        FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME,
        Validators.pattern(this.beneficiaryNameRegex),
        0
      );
    } else {
      this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).clearValidators();
      this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).setErrors(null);
      this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).setValidators([Validators.required]);
      this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).updateValueAndValidity();
    }
  }

  onClickPaymentPackages(_event, fromViewInit = false) {
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value)) {
      this.commonService.isConfirmationDialogueVisible.next(true);
      this.patchFieldValueAndParameters(this.form.get(FccConstants.FCM_PAYMENT_PAYMENT_TYPE),
            this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value.name, {});
      this.patchFieldValueAndParameters(this.form.get(FccConstants.FCM_PAYMENT_TYPE_ID),
            this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value.paymentType, {});
      this.loadFieldBasedOnPackage(fromViewInit);

      let filterParams: any = {};
      if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_TYPE_ID).value)) {
        filterParams.paymentTypeId = this.form.get(FccConstants.FCM_PAYMENT_TYPE_ID).value;
        filterParams = JSON.stringify(filterParams);
        this.subscriptions.push(
          this.commonService.getExternalStaticDataList(FccConstants.FCM_PAYMENT_PRODUCT_ID, filterParams).subscribe(response => {
            if (response) {
              this.patchFieldValueAndParameters(this.form.get(FccConstants.FCM_PAYMENT_PRODUCT_ID),
                response[0].product_id, {});
            }
          })
        );
      }
      let params: any = {};
      params.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode;
      params = JSON.stringify(params);
      this.commonService.fetchAdhocBeneValidationConfig(params);
      this.FieldValToOpenDialog = 'paymentPackClick';
      let filterParamsTemp: any = {};
      filterParamsTemp.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode;
      filterParamsTemp.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.label;
      filterParamsTemp = JSON.stringify(filterParamsTemp);
      this.initializeDropdownValues(FCMPaymentsConstants.FCM_PAY_FROM, filterParamsTemp);
      this.validateEnableSave();
      this.subscriptions.push(
        this.commonService.getExternalStaticDataList(FccConstants.FCM_PAYMENT_ZERO_PROOF_FLAG, filterParamsTemp).subscribe(response => {
        if (response) {
          const zeroProof = response[0].check_zero_proof === 'Y' ? true : false;
          this.zeroProofingFlag = zeroProof;
          if (zeroProof) {
            this.isControlTotalRequired = true;
            this.resetValidation(this.form, FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION);
            this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
            this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).enable();
            this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).setValidators(Validators.required);
            this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).updateValueAndValidity();
            this.resetValidation(this.form, FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT);
            this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
            this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).enable();
            this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).setValidators(Validators.required);
            this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).updateValueAndValidity();
          } else {
            this.isControlTotalRequired = false;
            this.resetValidation(this.form, FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION);
            this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
            this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).disable();
            this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).updateValueAndValidity();
            this.resetValidation(this.form, FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT);
            this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
            this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).disable();
            this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).updateValueAndValidity();
            if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).value) ||
            this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).value)) {
              this.isControlTotalRequired = true;
            }
          }
          this.enableCreateBatch();
        }
      }));
    }
    if (!this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value)) {
      this.commonService.isConfirmationDialogueVisible.next(false);
    }
  }

   openDialog(){
    if(!this.isDialogOpen) {
      const message = `${this.translateService.instant('batchPaymentChange')}`;
      this.count = 1;
      this.dialogRef = this.dialogService.open(
        ConfirmationDialogComponent,
        {
          header: `${this.translateService.instant('confirmation')}`,
          width: '35em',
          baseZIndex: 10000,
          styleClass: 'fileUploadClass',
          data: { locaKey: message },
        }
      );
      this.isDialogOpen = true;
      this.subscriptions.push(this.dialogRef.onClose.subscribe((result) => {
        if (result.toLowerCase() === 'yes') {
         this.updateBatchHeader();
         this.validateEnableSave();
        } else if(result.toLowerCase() === 'no'){
          this.resetAmtTranFieldToOriginal();
        }
        this.isDialogOpen = false;
      }));
    }

  }

  updateBatchHeader(){
    let paymentTransactionAmt = this.form.get('paymentTransactionAmt').value;
    if (this.form.get('paymentTransactionAmt').value != null) {
      paymentTransactionAmt = this.commonService.removeAmountFormatting(paymentTransactionAmt);
    }
    let requestObj = null;
    let referenceNumber = null;
    const datestamp = this.utilityService.getUniqueTimeStampValue();
    const productCode = this.productCode?.substring(0, 2) ? this.productCode.substring(0, 2) : 'BT';
    const paymentReference = productCode + datestamp;
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      referenceNumber = this.commonService.getQueryParametersFromKey('paymentReferenceNumber');
      requestObj = {
        debtorIdentification: this.form.get('clientDetails').value,
        legalEntity: this.form.get('legalEntity').value,
        controlTotal: this.form.get('paymentNoOfTransaction').value || 0,
        controlSum: paymentTransactionAmt || 0,
        paymentReference: paymentReference,
        txnType: this.form.get('transactionType').value,
        methodOfPayment: this.paymentPackageName,
        isConfidentialPayment: this.form.get('isConfidentialPayment').value === 'Y' ? true : false,
        isControlTotalRequired: true
      };
    }else{
      referenceNumber = this.commonService.isnonEMptyString(this.batchRefNumber) ? this.batchRefNumber : this.paymentRefNo;
      requestObj = {
        debtorIdentification: this.form.get('clientDetails').value.label,
        legalEntity: this.form.get('legalEntity').value,
        controlTotal: this.form.get('paymentNoOfTransaction').value || 0,
        controlSum: paymentTransactionAmt || 0,
        paymentReference: paymentReference,
        txnType: this.form.get('transactionType').value,
        methodOfPayment: this.form.get('paymentPackages').value.label,
        isConfidentialPayment: this.form.get('isConfidentialPayment').value === 'Y' ? true : false,
        isControlTotalRequired: true
      };
    }

    this.paymentService.updateBatchHeader(requestObj, referenceNumber).subscribe((res) => {
      if (res && res.data.paymentReferenceNumber) {
        if (this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].length < 0
        && (!requestObj.controlTotal || requestObj.controlTotal > 1)) {
          this.form.get(FccConstants.COPY_PAYMENT_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        }
      if (this.operation === FCMPaymentsConstants.MODIFY_BATCH) {
        const req = {
          paymentReferenceNumber: this.paymentReferenceNumber ? this.paymentReferenceNumber :
            this.paymentRefNo, pageSize: 10, first: 0
        };
        this.subscriptions.push(this.commonService.getPaymentDetails(req).subscribe(response => {
          this.paymentDetailsResponse = response;
          //this.showAddPaymentButton();
          this.resetAmtAndNoOfTransactionField();
          this.transactionsDetailUpdate(true);
          this.transactionDetailsRender();
        }));
      } else {
        this.resetAmtAndNoOfTransactionField();
        this.transactionsDetailUpdate(true);
        this.transactionDetailsRender();
      } 
      }
    }, (_err) => {
        this.showErrorToaster(_err);
      });
  }

  resetAmtAndNoOfTransactionField(){
    this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT, this.paymentTransactionAmtRemoveFormat());
    this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION, this.paymentNoOfTransactionReplaceChars());
      const hasFields = this.form.get(FCMPaymentsConstants.FCM_PAYMENT_FIELDS[0])[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED];
      if(!hasFields){
        this.showAddPaymentButton();
      }
    this.count = 0;
  }

  resetAmtTranFieldToOriginal(){
    this.count =0;
    this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT)
    .setValue( this.changefiledOfAmtAndTransMap.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT));
    this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION)
    .setValue( this.changefiledOfAmtAndTransMap.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION));

    this.form.updateValueAndValidity();
  }


  resetFormfields(){
    this.count =0;
    if (this.FieldValToOpenDialog === 'clientCodeClick'){
      this.form.get('paymentPackages').setValue(null);
    } else if(this.FieldValToOpenDialog === 'paymentPackClick'){

    }
    this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.PARAMS]['shortDescription'] = "";
    this.form.get(FCMPaymentsConstants.PAYMENT_NO_OF_TRANSACTIONS).setValue( null);
    this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).setValue( null);
    this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
     FccGlobalConstant.DATA] = {};
    this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccConstants.COPY_PAYMENT_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FCMPaymentsConstants.PAYMENTS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    this.valMap.clear();
  }

  resetFormToOriginal(){
    this.count =0;
    this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).setValue( this.valMap.get(FccConstants.FCM_CLIENT_CODE_DETAILS));
    this.form.get('clientName').setValue( this.valMap.get('clientName'));
    this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).setValue( this.valMap.get(FccConstants.FCM_PAYMENT_PACKAGES));
    this.form.get(FccConstants.FCM_PAYMENT_PAYMENT_TYPE).setValue( this.valMap.get(FccConstants.FCM_PAYMENT_PAYMENT_TYPE));
    this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.PARAMS] = "";
    this.form.updateValueAndValidity();
    }

  loadFieldBasedOnPackage(fromViewInit?: boolean){
    let filterParams: any = {};
    filterParams.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode;
    filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
    this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
    filterParams = JSON.stringify(filterParams);
    this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_PACKAGE_BASED_OPTIONS, filterParams);
    if(!fromViewInit){
      this.initializeCheckboxVal(FCMPaymentsConstants.FCM_FETCH_CONFIDENTIALITY_CHECKBOX, filterParams);
      this.getEnrichmentFields(fromViewInit);
    }
   }

   onClickPaymentProductType() {
    let filterParams: any = {};
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PRODUCT_TYPE).value) ||
    this.operation === FCMPaymentsConstants.MODIFY_BATCH) {
      //this.selectedProductType = this.form.get(FccConstants.FCM_PRODUCT_TYPE).value;
      this.valMap.set(FccConstants.FCM_PAYMENT_PACKAGES,this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value);
      this.valMap.set(FccConstants.FCM_PAYMENT_PAYMENT_TYPE,this.form.get(FccConstants.FCM_PAYMENT_PAYMENT_TYPE).value);
      this.getCutOffTime();
      if (this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value) {
        this.beneNameCode = this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value;
      }
      filterParams.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode ?
      this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode : this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value;
      filterParams.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
      this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
      filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
    this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
      if (this.commonService.isnonEMptyString(filterParams.clientCode) &&
        filterParams.clientCode === 'KOTAK') {
        filterParams.startIndex = FccGlobalConstant.LENGTH_1;
        filterParams.endIndex = FccGlobalConstant.LENGTH_200;
      }
      filterParams = JSON.stringify(filterParams);
      this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_PRODUCT_CODE_BASED_OPTIONS, filterParams);
      let filterParameter: any = {};
      filterParameter.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
      this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
      filterParameter = JSON.stringify(filterParameter);
      this.subscriptions.push(
        this.commonService.getExternalStaticDataList('productCodeDetails', filterParameter).subscribe(response => {
          if (response) {
            this.productType = response[0]?.pay_coll_detail;
          }
        })
      );
      if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_PRODUCT_TYPE)) &&
        this.form.get(FccConstants.FCM_PRODUCT_TYPE).value !== this.changeFieldsMap.get(FccConstants.FCM_PRODUCT_TYPE)){
        this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
          'btndisable'
        ] = false || this.checkForRequiredFields();
      }
      this.changeFieldsMap.set(FccConstants.FCM_PRODUCT_TYPE,this.form.get(FccConstants.FCM_PRODUCT_TYPE).value);

      if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value)) {
        this.onClickAmount();
        this.onBlurAmount();
      }
      this.validateEnableUpdate();
      this.validateEnableSave();
    }
  }

  validateEnableSave() {

    const enableSave = this.isFormValid();
    setTimeout(() => {
      if((!this.form.get('saveEnrichment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED])
      && (!this.form.get('updateEnrichment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED])
      && enableSave){
        if (this.isSavePaymentClicked) {
          this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = true;
        } else {
          this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = false;
        }
    }else if(!enableSave){
      this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = true;
    }
    const isParentFormValid = enableSave;
    this.commonService.parentFormValidCheck.next(isParentFormValid);
    this.validateNextEnable();
    }, FccGlobalConstant.LENGTH_2000);
  }

  validateNextEnable() {
    const balanceDetails = this.balanceTransactionDetails();
    if(this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED] === true ||
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.RENDERED] === true ||
        this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.DATA].length === 0 ||
        (this.isCancelClicked && this.zeroProofingFlag && balanceDetails.balanceTransaction > 0 &&
          balanceDetails.balanceAmount > 0)) {
        this.commonService.isNextEnabled.next(false);
      } else if(this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.DATA].length > 0 && this.zeroProofingFlag &&
        balanceDetails.balanceTransaction > 0 && balanceDetails.balanceAmount > 0) {
          this.commonService.isNextEnabled.next(false);
      } else {
        this.commonService.isNextEnabled.next(true);
      }
  }

  checkCutOffTimings() {
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PRODUCT_TYPE).value)) {
      this.form.get(FccConstants.FCM_PRODUCT_TYPE)[FccGlobalConstant.PARAMS].warning =
        `${this.translateService.instant(FccConstants.CUT_OFF_TIME)}` + this.cuttOffTime;
      this.form.get(FccConstants.FCM_PRODUCT_TYPE)[FccGlobalConstant.PARAMS].warningStyleClass = 'cutOffWarning';
      const time = new Date();
      const getSystemHour = time.getHours();
      const getSystemMin = time.getMinutes();
      if(this.commonService.isnonEMptyString(this.cuttOffTime)){
        const productTime = this.cuttOffTime;
        const spiltProductTime = productTime.split(':');
        const productTimeHour = parseInt(spiltProductTime[0]);
        const productTimeMin = parseInt(spiltProductTime[1]);
        if (getSystemHour >= productTimeHour && getSystemMin > productTimeMin){
          this.form.get(FccConstants.FCM_PRODUCT_TYPE)[FccGlobalConstant.PARAMS].warning = '';
          this.form.get(FccConstants.FCM_PRODUCT_TYPE).setErrors({ productCutOffTime: true });
        }
      }
    }
  }

  onClickBeneficiaryNameCode() {
    let filterParams: any = {};
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value)) {
      this.beneNameAndCodeVal = this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value;

      if(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]){
        this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW).setValue(
        this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value.label);
        this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }

      const filterParamsBene = '{"clientCode":'+this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.label+
    ',"beneDrawerCode":'+this.beneNameAndCodeVal.drawerCode+'}';
      this.beneEmailrequiredFlag = false;
      this.beneEmailIdEditPageFlag = false;
      this.beneMobileNorequiredFlag = false;
      this.beneMobileNoEditPageFlag = false;
      this.commonService.getExternalStaticDataList(
        'beneDailyConsumption', filterParamsBene, true)
        .subscribe((response) => {
          if (response.length) {
              if(this.beneNameAndCodeVal.periodType==='D'){
                this.beneBalanceAmt = response[0].n_amnt === undefined ? this.beneNameAndCodeVal.maxTxnLimit - 0 :
                  this.beneNameAndCodeVal.maxTxnLimit - response[0].n_amnt;
                this.beneTxnNoBalance = response[0].n_cnt === undefined ? this.beneNameAndCodeVal.maxNoTxn - 0 :
                  this.beneNameAndCodeVal.maxNoTxn - response[0].n_cnt;
              }else{
                this.beneBalanceAmt = -1;
                this.beneTxnNoBalance = -1;
              }
          }
          if(!this.beneLimitMap.has(this.beneNameAndCodeVal.label)){
            this.beneLimitMap.set(this.beneNameAndCodeVal.label, { balanceAmt: this.beneBalanceAmt, balanceTxnNo: this.beneTxnNoBalance });
          }
        });

      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.FCM_ADD_BENE_CHECKBOX).setValue('N');
      if(typeof (this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value) === 'string'){
        filterParams.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value;
      } else {
        filterParams.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode;
      }
      filterParams.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
      this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
      filterParams.receiverCode = this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value.label;
      filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
    this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
      filterParams = JSON.stringify(filterParams);
      this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_BENEFICIARY_CODE_BASED_OPTIONS, filterParams);
      this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.PARAMS]['shortDescription'] = "";
      if(this.beneEditToggleVisible) {
        this.form.get(FCMPaymentsConstants.BENEFICIARY_NAME).setValue(
          this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value.label);
      }

      if(this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value.label)){
        this.form.get(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME).setValue(
          this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value.label);
        this.form.get(FCMPaymentsConstants.BENEFICIARY_NAME).setValue(
          this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value.label);
      } else {
        this.form.get(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME).setValue(
          this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value);
        this.form.get(FCMPaymentsConstants.BENEFICIARY_NAME).setValue(
          this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value);
      }
      if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME)) &&
        this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value !==
        this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME)){
        this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
          'btndisable'
        ] = false;
      }
      this.changeFieldsMap.set(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME,
          this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value);

      this.validateEnableSave();
      this.validateEnableUpdate();
    }
    this.doBeneFormValidation();
    this.onClickReceiverType();
  }

  buildFCMBeneficiaryRequestObject(form, mappingModel): any {
    const requestObject = {};
    const objModel = FCMPaymentsConstants.FCM_ADHOC_BENEFICIARY_FIELDS;
    const sectionFormValue = form;
    if (sectionFormValue.controls !== null && mappingModel !== null) {
      Object.keys(sectionFormValue.controls).forEach(key => {
        if (FCMPaymentsConstants.FCM_ADHOC_BENE_PAYMENT_FIELDS.includes(key)) {
          const control = sectionFormValue.controls[key];
          const mapping = objModel[key];
          let val = this.previewService.getPersistenceValue(control, false);
          if (key === FccConstants.FCM_PAYMENT_PAYMENT_TYPE) {
            val = val.replace(/\s/g,"").toUpperCase();
          }
          if(mapping != undefined && !this.commonService.isEmptyValue(val)) {
            this.createNested(mapping,requestObject, val);
          } else {
            const mappingKey = this.productMappingService.getRequestFieldNameFromMappingModel(key, mappingModel);
            if (control[FccGlobalConstant.PARAMS][FccConstants.MAP_BOOLEAN_VALUE]) {
              requestObject[mappingKey] = (val === FccGlobalConstant.CODE_Y) ? true : false;
            } else {
              requestObject[mappingKey] = val;
            }
          }
        }
      });
    }
    const data = [];
    data.push(requestObject['bankAccount']);
    requestObject['bankAccount'] = data;

    requestObject['clientId'] = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.label;
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      requestObject['clientId'] = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
    }
    requestObject['beneficiaryId'] = this.form.get(FccConstants.FCM_BENEFICIARY_CODE).value;
    requestObject['beneficiaryName'] = this.form.get(FccConstants.FCM_BENEFECIARY_NAME).value;

    delete requestObject['undefined'];
    return requestObject;
  }
  onBlurSequence(){
    this.validateEnableSave();
  }

  onKeyupSequence(){
    this.validateEnableSave();
  }

  onKeyupAccountNumber(){
    this.validateEnableSave();
  }

  onKeyupConfirmAccountNumber(){
    this.validateEnableSave();
  }

  onKeyupAmount(event){
    this.updateAmountLenghtValidation(event, FccConstants.FCM_PAYMENT_AMOUNT);
    this.validateEnableSave();
  }

  onKeyupBeneficiaryCode(){
    const saveBeneficiaryCss = this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS];
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
      saveBeneficiaryCss.replace(" disable-save-beneficiary", "");

    if (!this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_BENEFICIARY_CODE).value)) {
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
        saveBeneficiaryCss + " disable-save-beneficiary";

      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccConstants.FCM_SWITCH_HYPERLINK_AND_IMG] = false;
      this.form.updateValueAndValidity();
    }
    this.validateEnableSave();
  }

  onClickBeneficiaryCode(event) {
    let beneficiaryObj;
    event.preventDefault();
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_BENEFICIARY_CODE).value) &&
    event?.currentTarget?.id !== FccConstants.FCM_BENEFICIARY_CODE ) {
      this.form.get(FCMPaymentsConstants.BENEFICIARY_NAME).setValue(this.form.get(FccConstants.FCM_BENEFICIARY_CODE).value);
      this.form.get(FCMPaymentsConstants.CREDITOR_CURRENCY).setValue(this.form.get(FccGlobalConstant.CURRENCY).value.label);
      if (this.apiModel) {
        beneficiaryObj = this.buildFCMBeneficiaryRequestObject(this.form,this.apiModel);
      }
      this.paymentService.fcmAdhocBeneficiaryCreation(beneficiaryObj).subscribe(response => {
        if(response && response.status === FccGlobalConstant.HTTP_RESPONSE_SUCCESS) {
          this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccConstants.FCM_SWITCH_HYPERLINK_AND_IMG] = true;
          this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccConstants.FCM_SWITCH_IMG_PATH] = true;
          this.form.updateValueAndValidity();
          beneficiaryObj = {};
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      error => {
        if(error?.error?.errors){
          const err = error?.error?.errors[0]?.code;
          const errMsg = this.translateService.instant(err);
          this.form.get(FccConstants.FCM_BENEFICIARY_CODE).setErrors({ savBeneMessage: errMsg });
        }
        this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccConstants.FCM_SWITCH_HYPERLINK_AND_IMG] = true;
        this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccConstants.FCM_SWITCH_IMG_PATH] = false;
        this.form.updateValueAndValidity();
      });
      this.validateEnableSave();
    }
  }

  onBlurBeneficiaryCode(){
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_BENEFICIARY_CODE)) &&
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE).value !== this.changeFieldsMap.get(FccConstants.FCM_BENEFICIARY_CODE)) {
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    let filterParams: any = {};
    filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.label;
    filterParams.token = Math.floor(Math.random() * 1000);
    filterParams = JSON.stringify(filterParams);
    const beneCode = this.form.get(FccConstants.FCM_BENEFICIARY_CODE).value.toUpperCase().replaceAll(' ', '');
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE).setValue(beneCode);
    this.changeFieldsMap.set(FccConstants.FCM_BENEFICIARY_CODE, beneCode);
    this.subscriptions.push(
      this.commonService.getExternalStaticDataList(FccConstants.FCM_BENEFICIARY_CODE, filterParams).subscribe(response => {
        if(response) {
          let beneCodeFound = false;
          for (const value of response) {
            if (beneCode === value?.receiver_code) {
              const validationError = { beneficiaryCodeExist : true };
              this.addValidatorBeneCode(Validators.compose([() => validationError]));
              beneCodeFound = true;
              break;
            }
          }
          if(!beneCodeFound){
            this.addValidatorBeneCode(Validators.pattern(this.beneficiaryCodeRegex));
          }
        }
      })
    );
    this.validateEnableSave();
    this.validateEnableUpdate();
  }

  addValidatorBeneCode(validator: Validators){
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE).clearValidators();
    this.form.addFCCValidators(FccConstants.FCM_BENEFICIARY_CODE,validator, 0);
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE).updateValueAndValidity();
  }

  onClickPayTo(){
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).value)) {
      const data = {
        value : this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).value.accountType,
        shortName : this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).value.accountType,
        label : this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).value.accountType
      };
      this.form.get(FCMPaymentsConstants.ACCOUNT_TYPE).setValue(data);
      this.form.get(FCMPaymentsConstants.ACCOUNT_NUMBER).setValue(this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).value.label);
      this.form.get(FCMPaymentsConstants.CREDITOR_CURRENCY).setValue(this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).value.currency);
      if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_PAY_TO)) &&
        !this.compareObject(this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).value,
      this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_PAY_TO)) &&
      typeof(this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).value) ===
      typeof(this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_PAY_TO))){
        this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
          'btndisable'
        ] = false;
      }
      this.changeFieldsMap.set(FccConstants.FCM_PAYMENT_PAY_TO,
      this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).value);
      this.validateEnableSave();
      this.validateEnableUpdate();
      this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW).setValue(
        this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).value.ifscCode);
    } else {
      this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW).setValue(null);
    }
  }

  onClickPayFrom(){
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_PAY_FROM).value)) {
      const opts = this.form.get(FccConstants.FCM_PAYMENT_PAY_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      if (!(opts && opts.length > 0)) {
        this.initializeDropdownValues([FccConstants.FCM_PAYMENT_PAY_FROM]);
      }
      this.valMap.set(FccConstants.FCM_PAYMENT_PACKAGES,this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value);
      this.valMap.set(this.form.get(FccConstants.FCM_PAYMENT_PAYMENT_TYPE),this.form.get(FccConstants.FCM_PAYMENT_PAYMENT_TYPE).value);
      this.form.get('debitorCurrency').setValue(this.form.get(FCMPaymentsConstants.PAY_FROM).value.currency);
      this.form.get('debitorType').setValue(this.form.get(FCMPaymentsConstants.PAY_FROM).value.accountType);
      this.form.get('debitorName').setValue(this.form.get(FCMPaymentsConstants.PAY_FROM).value.accountName);
      this.form.get('debtorAccountId').setValue(this.form.get(FCMPaymentsConstants.PAY_FROM).value.accountId);
      if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_PAY_FROM)) &&
        this.form.get(FccConstants.FCM_PAYMENT_PAY_FROM).value !== this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_PAY_FROM) &&
      typeof(this.form.get(FccConstants.FCM_PAYMENT_PAY_FROM).value) ===
      typeof(this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_PAY_FROM))){
        this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
          'btndisable'
        ] = false;
      }
      this.changeFieldsMap.set(FccConstants.FCM_PAYMENT_PAY_FROM,this.form.get(FccConstants.FCM_PAYMENT_PAY_FROM).value);
      this.validateEnableSave();
      this.validateEnableUpdate();
      }
  }

  initializeCheckboxVal(checkboxField?, filterParams?) {
    this.subscriptions.push(this.commonService.getExternalStaticDataList(checkboxField, filterParams)
    .subscribe((response) => {
      if (response && (response.length > 0)) {
         if (response[0].mypconfidential === FccGlobalConstant.CODE_Y){
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX).setValue(null);
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
         } else if(response[0].mypconfidential === FccGlobalConstant.CODE_M) {
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX).setValue(FccGlobalConstant.CODE_Y);
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
         } else {
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX).setValue(null);
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
          this.form.get(FccConstants.FCM_PAYMENT_CONFIDENTIAL_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
         }
      }
    }));
  }

  checkIfscSaveAllowed(toggleValue){
    if (toggleValue){
      if (this.commonService.isnonEMptyString(this.form.get(FccConstants.BENE_BANK_IFSC_CODE).value)) {
        this.form.get(FccConstants.BENE_BANK_IFSC_CODE).setValue(
          this.form.get(FccConstants.BENE_BANK_IFSC_CODE)?.value);
      }
    }
  }

  checkBeneSaveAllowed(toggleValue){
    this.beneEditToggleVisible = toggleValue;
    if (this.beneEditToggleVisible){
      if(this.commonService.getAdhocBeneValidationConfig()?.adhocbeneflag === 'N'){
        const validationError = {
          adhocBeneNotAllowed: true
        };
        this.addFccValidation(validationError, FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME);
        this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).setValue('');
      } else {
      this.beneEmailrequiredFlag = true;
      this.beneMobileNorequiredFlag = true;
      this.form.get(FccConstants.FCM_ADD_BENE_CHECKBOX).setValue(FccGlobalConstant.CODE_N);
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE).setValue('');
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE).clearValidators();
      this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).setValue(null);
      this.setAmountOriginalValue(FccConstants.FCM_PAYMENT_AMOUNT);
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.onClickAdditionalInformation();
      this.form.get(FccConstants.FCM_PAYMENT_PAY_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.FCM_LEI_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.FCM_RECEIVER_TYPE).enable();
      this.form.get(FccConstants.FCM_LEI_CODE).enable();
      this.form.get(FccConstants.FCM_PAYMENT_ACCOUNT_TYPE).setValue('');
      this.form.get(FccConstants.FCM_PAYMENT_ACCOUNT_TYPE).clearValidators();
      this.form.get(FccConstants.ACCOUNT_NUMBER).setValue('');
      this.form.get(FccConstants.ACCOUNT_NUMBER).clearValidators();
      this.form.get(FccConstants.BENE_BANK_IFSC_CODE).setValue('');
      this.form.get(FccConstants.BENE_BANK_IFSC_CODE).clearValidators();
      this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).setValue('');
      this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).clearValidators();
      this.form.get(FccConstants.FCM_RECEIVER_TYPE).setValue('');
      this.form.get(FccConstants.FCM_RECEIVER_TYPE).clearValidators();
      this.form.get(FccConstants.FCM_LEI_CODE).setValue('');
      this.form.get(FccConstants.FCM_LEI_CODE).clearValidators();
      this.form.get(FccConstants.BATCH_ADHOC_FLAG).setValue(FccConstants.BATCH_PAYMENT_ADHOC_FLOW);
      this.form.get(FCMPaymentsConstants.IS_ADHOC_CREDITOR).setValue(true);
      this.setRenderOnlyFields(
        this.form,
        FCMPaymentsConstants.DISPLAY_ADHOC_BENEFICIARY_FIELDS,
        true
      );
      if(this.commonService.getAdhocBeneValidationConfig()?.saveadhocbeneflag === 'N'){
        this.form.get(FccConstants.FCM_ADD_BENE_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.setRequired(this.form,
        FCMPaymentsConstants.REQUIRED_ADHOC_BENEFICIARY_FIELDS,
        true);
      if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value)) {
        this.form.get(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME).setValue(
          this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value);
        let filterParams: any = {};
        if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_PRODUCT_ID).value)) {
          let filterParameter: any = {};
          filterParameter.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
          this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
          filterParameter = JSON.stringify(filterParameter);
          this.subscriptions.push(
            this.commonService.getExternalStaticDataList('productCodeDetails', filterParameter).subscribe(response => {
              if (response) {
                this.productType = response[0]?.pay_coll_detail;
                filterParams.paymenttype = this.productType;
                filterParams = JSON.stringify(filterParams);
                this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_ADHOC_BASED_OPTIONS, filterParams);
              }
            })
            );
          }
        }
      this.validateEnableUpdate();
      this.validateEnableSave();
      this.updateAdhocVal();
    }
  }
  else{
    if (!this.beneEditToggleVisible){
      this.form.get(FccConstants.FCM_PAYMENT_PAY_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.BATCH_ADHOC_FLAG).setValue(FccConstants.BATCH_PAYMENT_NON_ADHOC_FLOW);
      this.form.get(FCMPaymentsConstants.IS_ADHOC_CREDITOR).setValue(false);
      this.setRenderOnlyFields(
        this.form,
        FCMPaymentsConstants.DISPLAY_ADHOC_BENEFICIARY_FIELDS,
        false
      );
      this.setRequired(this.form,
        FCMPaymentsConstants.REQUIRED_ADHOC_BENEFICIARY_FIELDS,
        false);
      this.form.get(FccConstants.FCM_PAYMENT_ACCOUNT_TYPE).setValue('');
      this.form.get(FccConstants.FCM_ACCOUNT_NO).setValue('');
      this.form.get(FccConstants.FCM_CONFIRM_ACCONT_NO).setValue('');
      this.form.get(FccConstants.BENE_BANK_IFSC_CODE).setValue('');
      this.form.get(FccConstants.FCM_ACCOUNT_NO).clearValidators();
      this.form.get(FccConstants.FCM_CONFIRM_ACCONT_NO).clearValidators();
      this.form.get(FccConstants.BENE_BANK_IFSC_CODE).clearValidators();
      this.form.get(FccConstants.FCM_PAYMENT_ACCOUNT_TYPE).clearValidators();
      if(!this.form.valid){
        this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = true;
      }
     }
    }
    this.validateEnableSave();
  }
  updateAdhocVal() {
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME)) &&
      this.form.get(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME).value !==
    this.changeFieldsMap.get(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME)){
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    this.validateEnableUpdate();
    this.changeFieldsMap.set(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME,
      this.form.get(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME).value);
  }

  setRenderOnlyFields(form, ids: string[], flag) {
    ids.forEach((id) => this.setRenderOnly(form, id, flag));
  }
  setRenderOnly(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { rendered: flag });
    if (!flag) {
      this.setRequiredOnly(form, id, false);
    }
  }

  setRequired(form, ids: string[], flag) {
    ids.forEach((id) => this.setRequiredOnly(form, id, flag));
  }

  setRequiredOnly(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { required: flag });
    if(!flag && this.commonService.isNonEmptyField(id, form)){
      form.controls[id].setErrors(null);
      form.controls[id].clearValidators();
      form.controls[id].updateValueAndValidity();
    }
  }

  renderFieldsAsEarlier(form, ids: string[]){
    ids.forEach((id) => this.setRenderOnly(form, id, form.get(id)['params']['rendered']));
  }

  getApiModel() {
    this.productMappingService.getApiModel(this.productCode, undefined, undefined, undefined, undefined,
      this.option, this.category).subscribe(apiMappingModel => {
        this.apiModel = apiMappingModel;
      });
  }

  onClickSavePayment(){
    this.form.updateValueAndValidity();
    if(!this.form.valid){
      return;
    }
    this.isSavePaymentClicked = true;
    if(this.commonService.isEmptyValue(this.form.controls['accountNumber'].value)){
      this.onClickPayTo();
    }
    this.onClickCurrency();
    let instrumentObj;
    const retainedItem = this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].filter(
      (item) => item['discardFlag'] === false
    );
    if (this.form.get(FccConstants.BATCH_ADHOC_FLAG).value === FccConstants.BATCH_PAYMENT_ADHOC_FLOW) {
      this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).setValue(this.form.get(FccConstants.ACCOUNT_NUMBER).value);
      this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW).setValue(
        this.form.get(FccConstants.BENE_BANK_IFSC_CODE).value);
      if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_BENEFICIARY_CODE).value)) {
        this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW).setValue(
          this.form.get(FccConstants.FCM_BENEFICIARY_CODE).value);
      } else {
        this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW).setValue(null);
      }
    }
    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = [];
    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = [...retainedItem];
    if (this.apiModel) {
      if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
        instrumentObj = this.buildSinglePaymentRequestObject(this.apiModel, this.form);
      } else {
        this.stateService.getSectionNames().forEach(section => {
          const sectionFormValue = this.stateService.getSectionData(section);
          instrumentObj = this.buildSinglePaymentRequestObject(this.apiModel, sectionFormValue);
        });
      }
    }
    this.valMap.set(FccConstants.FCM_CLIENT_CODE_DETAILS,this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value);
    this.valMap.set(FccConstants.FCM_CLIENT_NAME,this.form.get(FccConstants.FCM_CLIENT_NAME).value);
    const datestamp = this.utilityService.getUniqueTimeStampValue();
    const productCode = this.productCode?.substring(0, 2) ? this.productCode.substring(0, 2) : 'XX';
    const paymentReference = productCode + datestamp;
    const batchObj = {
      paymentReference: paymentReference,
      transactionType: this.form.get('transactionType').value
    };
    if(this.addCopyPaymentCheckbox){
      this.payFromValue = this.form.get(FccConstants.FCM_PAYMENT_PAY_FROM).value.name;
      this.addCopyPaymentCheckbox = false;
    }

    // Check If benficiary code(creditorr id ) is added.
    if(this.form.get(FccConstants.FCM_ADD_BENE_CHECKBOX).value === FccGlobalConstant.CODE_Y
        && this.commonService.isnonEMptyString(this.form.get('beneficiaryCode'))){
      instrumentObj.creditorDetails.creditorIdentification = this.form.get('beneficiaryCode').value; //beneficiaryCode
    }

    let requestObj = { ...batchObj, ...instrumentObj };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = true;
    this.paymentService.addInstrumnet(requestObj, this.paymentRefNo).subscribe((data) => {
      //this.selectedProductType = '';
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
      requestObj = {};
      if(this.operation === FCMPaymentsConstants.MODIFY_BATCH) {
        this.commonService.refreshPaymentList.next(true);
        this.resolverService.updateBatchStatus(this.paymentRefNo);
      }
      this.commonService.onBatchTxnSaveClick.next(true);
      const instrumentRefNumber = data.data.instrumentReferenceNumber;
      this.form.get(FccConstants.FCM_LEI_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      if (this.form.get('adhocFlag').value === FccConstants.BATCH_PAYMENT_NON_ADHOC_FLOW) {
      const beneBalAmt = this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceAmt;
      const amountFieldVal = this.commonService.removeAmountFormatting(this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value);
      this.beneLimitMap.set(this.beneNameAndCodeVal?.label,
        {
          balanceAmt: beneBalAmt - amountFieldVal,
          balanceTxnNo: this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceTxnNo - 1
        });
      }
      localStorage.removeItem("beneLimitAmt");
      this.form.get(FccConstants.FCM_PRODUCT_TYPE)[FccGlobalConstant.PARAMS].warning = '';
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.COPY_PAYMENT_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      if (data.data !== null) {
      this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.LIST_DATA
      ] = true;
      this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.COLUMNS
      ] = this.paymentColumnList;
      const paymentsTableLength =
      this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].length;
      const enrichObj = this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
      this.deletedEnrichmentsIndex = [];
      this.commonService.putEnrichmentDetails(enrichObj, paymentsTableLength);
      this.commonService.putEnrichmentDetails(this.enrichmentFieldsName, 999);
      const gridObj = {};
      let curCode = '';
      for (const item in this.form.value) {
        if (this.paymentFieldList.includes(item)) {
          gridObj[item] = this.previewService.getPersistenceValue(this.form.controls[item], false);
          if (item === 'currency') {
            curCode = gridObj[item];
          }
          if (item === 'amount') {
            gridObj['amountDecimal'] = this.commonService.removeAmountFormatting(gridObj[item]);
            if (localStorage.getItem(FccGlobalConstant.CUR_SYMBOL_ENABLED) === 'y') {
              const updatedAmt = this.commonService.getCurrencySymbol(curCode, gridObj[item]);
              gridObj[item] = updatedAmt;
            }
          }
        }
      }

      for (const item in this.form.controls) {
        if (FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS.includes(item)) {
          gridObj[item] = this.previewService.getPersistenceValue(this.form.controls[item], false);
        }
      }
      gridObj['beneficiaryType'] = FCMPaymentsConstants.BENEFICIARY_TYPE_EXISTING;
      //changes for ADHoc flow
      if(this.beneEditToggleVisible){
        this.paymentFieldList.forEach(element => {
         if(element === 'payTo'){
          gridObj[element] = this.previewService.getPersistenceValue(this.form.controls['accountNumber'], false);
         }
       });
       gridObj['beneficiaryType'] = FCMPaymentsConstants.BENEFICIARY_TYPE_ADHOC;
      }
      gridObj[FccConstants.INSTRUMENT_REF_NUMBER] = instrumentRefNumber;
      gridObj['adhocFlow'] = this.beneEditToggleVisible;
      gridObj['payToOptions'] = this.form.get('payTo')['options'];
      gridObj['beneficiaryNameCodeOptions'] = this.form.get('beneficiaryNameCode')['options'];
      this.addAdhocFlowFields(gridObj);
      this.addAdditionalAttributesInTableObject(gridObj);
      this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.DATA].push(gridObj);
      this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] =
      [...this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
          FccGlobalConstant.DATA]];
      let req = {};
      if (this.operation === FCMPaymentsConstants.MODIFY_BATCH) {
        req = {
          paymentReferenceNumber: this.paymentReferenceNumber ? this.paymentReferenceNumber :
            this.paymentRefNo, pageSize: 10, first: 0
        };
      } else {
        req = {
          paymentReferenceNumber: this.paymentReferenceNumber ? this.paymentReferenceNumber :
            this.paymentRefNo
        };
      }
      this.subscriptions.push(this.commonService.getPaymentDetails(req).subscribe(response => {
        this.paymentDetailsResponse = response;
        this.counterTransactionListUpdate(this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value);
        this.showAddPaymentButton();
        this.transactionsDetailUpdate();
        this.transactionDetailsRender();
      }));
      this.setRenderOnlyFields(
        this.form,
        this.paymentFieldList,
        false
      );
      this.setRenderOnlyFields(
        this.form,
        FCMPaymentsConstants.DISPLAY_ADHOC_BENEFICIARY_FIELDS,
        false
      );
      this.setRenderOnlyFields(
        this.form,
        FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS,
        false
      );
    }
      this.form.get('addNewEnrichment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      const formData = this.commonService.getBatchFormData();
      formData.push(this.cloneAbstractControl(this.form).controls);
      this.commonService.setBatchFormData(formData);

      this.removeControls(this.enrichmentFieldsName);
      this.setRenderOnly(this.form,FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER,false);
      ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment',
      'addEnrichmentField'].forEach((field) => {
        this.patchFieldParameters(this.form.controls[field], { rendered: false });
      });
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE).setValue('');
      const saveBeneficiaryCss = this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS];
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
      saveBeneficiaryCss + " disable-save-beneficiary";
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccConstants.FCM_SWITCH_HYPERLINK_AND_IMG] = false;
      this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.PARAMS]['shortDescription'] = "";
      this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = [];
      this.form.updateValueAndValidity();
      this.isInstrumentAdded = true;
      this.commonService.parentFormValidCheck.next(true);
      if (!this.zeroProofingFlag) {
        this.commonService.isNextEnabled.next(true);
      }
      this.resetRenderOnlyFields(this.form, FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS);
      this.isSavePaymentClicked = false;
      this.form.get(FccGlobalConstant.AMOUNT_FIELD)[this.params][FccGlobalConstant.MAXLENGTH] =
        this.form.get(FccGlobalConstant.AMOUNT_FIELD)[this.params][FccGlobalConstant.ORIGNAL_MAX_LENGTH];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }, _err => {
      this.showErrorToaster(_err);
      this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = false;
      this.commonService.parentFormValidCheck.next(true);
      this.commonService.isNextEnabled.next(false);
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
      this.isSavePaymentClicked = false;
    });
  }

  onClickUpdatePayment() {
    this.updateClicked = true;
    this.editBalanceDetails = false;
    this.cancelEditedBalanceDetails = false;
    if(!this.form.valid){
      return;
    }
    if(this.commonService.isEmptyValue(this.form.controls['accountNumber'].value)){
      this.onClickPayTo();
    }
    if (this.form.get(FccConstants.BATCH_ADHOC_FLAG).value === FccConstants.BATCH_PAYMENT_ADHOC_FLOW) {
      this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).setValue(this.form.get(FccConstants.ACCOUNT_NUMBER).value);
      this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW).setValue(
        this.form.get(FccConstants.BENE_BANK_IFSC_CODE).value);
      if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_BENEFICIARY_CODE).value)) {
        this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW).setValue(
          this.form.get(FccConstants.FCM_BENEFICIARY_CODE).value);
      } else {
        this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW).setValue(null);
      }
    }
    this.onClickCurrency();
    let instrumentObj;
    if (this.apiModel) {
      if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
        instrumentObj = this.buildSinglePaymentRequestObject(this.apiModel, this.form);
      } else {
        this.stateService.getSectionNames().forEach(section => {
          const sectionFormValue = this.stateService.getSectionData(section);
          instrumentObj = this.buildSinglePaymentRequestObject(this.apiModel, sectionFormValue);
        });
      }
    }
    const retainedRecord = this.form
      .get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].filter(
        (_item, i) => i !== this.editRecordIndex
      );
      let batchObj;
      const datestamp = this.utilityService.getUniqueTimeStampValue();
      const productCode = this.productCode?.substring(0, 2) ? this.productCode.substring(0, 2) : 'XX';
      const paymentReference = productCode + datestamp;
      if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      batchObj = {
        paymentReference: paymentReference,
        transactionType: this.form.get('transactionType').value
      };
      } else {
        batchObj = {
          paymentReference: paymentReference,
          transactionType: this.form.get('transactionType').value
        };
      }
      const requestObj = { ...batchObj, ...instrumentObj };
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = true;
    this.paymentService.updateInstrumnet( requestObj, this.paymentRefNo, this.instrumentRefNumber).subscribe((data) => {
       if (data !== null || data !== undefined){
        this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
          FccGlobalConstant.COLUMNS
        ] = this.paymentColumnList;
        if(this.operation === FCMPaymentsConstants.MODIFY_BATCH) {
          this.commonService.refreshPaymentList.next(true);
          this.resolverService.updateBatchStatus(this.paymentRefNo);
          const req = {
            paymentReferenceNumber: this.paymentReferenceNumber ? this.paymentReferenceNumber :
              this.paymentRefNo, pageSize: 10, first: 0
            };
            this.subscriptions.push(this.commonService.getPaymentDetails(req).subscribe(response => {
              this.paymentDetailsResponse = response;
              this.showAddPaymentButton();
              this.transactionsDetailUpdate();
              this.transactionDetailsRender();
            }));
          this.counterTransactionListUpdate(this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value, this.editRecordIndex);
        }
        this.commonService.onBatchTxnUpdateClick.next(true);
        if (this.form.get('adhocFlag').value === FccConstants.BATCH_PAYMENT_NON_ADHOC_FLOW){
        const beneBalAmt = this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceAmt;
        const amountFieldVal = this.commonService.removeAmountFormatting(this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value);
        this.beneLimitMap.set(this.beneNameAndCodeVal?.label,
          {
            balanceAmt: beneBalAmt - amountFieldVal,
            balanceTxnNo: this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceTxnNo - 1
          });
        }
        localStorage.removeItem("beneLimitAmt");
        const gridObj = {};
        let curCode = '';
        for (const item in this.form.value) {
          if (this.paymentFieldList.includes(item)) {
            gridObj[item] = this.previewService.getPersistenceValue(this.form.controls[item], false);
            if (item === 'currency') {
              curCode = gridObj[item];
            }
            if (item === 'amount') {
              gridObj['amountDecimal'] = this.commonService.removeAmountFormatting(gridObj[item]);
              if (localStorage.getItem(FccGlobalConstant.CUR_SYMBOL_ENABLED) === 'y') {
                const updatedAmt = this.commonService.getCurrencySymbol(curCode, gridObj[item]);
                gridObj[item] = updatedAmt;
                this.transactionsDetailUpdate(true);
              }
            }
          }
        }
        for (const item in this.form.controls) {
          if (FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS.includes(item)) {
            gridObj[item] = this.previewService.getPersistenceValue(this.form.controls[item], false);
          }
        }
        if(this.form.get('adhocFlag').value === 'paymentAdhocFlow'){
          this.paymentFieldList.forEach(element => {
           if(element === 'payTo'){
            gridObj[element] = this.previewService.getPersistenceValue(this.form.controls['accountNumber'], false);
           }
         });
         gridObj['adhocFlow'] = true;
         gridObj['beneficiaryType'] = FCMPaymentsConstants.BENEFICIARY_TYPE_ADHOC;
         this.updateAdhocFlowFields(gridObj);
         if (this.commonService.isnonEMptyString(this.form.value[FccConstants.FCM_BENEFICIARY_CODE])){
          gridObj[FccConstants.FCM_BENEFICIARY_CODE] = this.form.value[FccConstants.FCM_BENEFICIARY_CODE];
        }
        }
        else{
          gridObj['adhocFlow'] = false;
          gridObj['beneficiaryType'] = FCMPaymentsConstants.BENEFICIARY_TYPE_EXISTING;
          gridObj['beneficiaryBankIfscCode'] = this.beneNameAndCodeVal?.ifscCode ? this.beneNameAndCodeVal?.ifscCode : null ;
          gridObj['beneficiaryCode'] = this.beneNameAndCodeVal?.label ? this.beneNameAndCodeVal?.label : null ;
        }
        gridObj[FccConstants.INSTRUMENT_REF_NUMBER] = this.instrumentRefNumber;
        gridObj['payToOptions'] = this.form.get('payTo')['options'];
        gridObj['beneficiaryNameCodeOptions'] = this.form.get('beneficiaryNameCode')['options'];

        this.addAdditionalAttributesInTableObject(gridObj);
        retainedRecord.splice(this.editRecordIndex, 0, gridObj);

        if(this.operation !== FCMPaymentsConstants.MODIFY_BATCH) {
          this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.DATA
          ] = [...retainedRecord];
          this.counterTransactionListUpdate(this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value, this.editRecordIndex, true);
        }

        this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
          FccGlobalConstant.RENDERED
        ] = false;
        this.showAddPaymentButton(true);
        ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment',
        'addEnrichmentField'].forEach((field) => {
          this.patchFieldParameters(this.form.controls[field], { rendered: false });
        });
        this.setRenderOnlyFields(
          this.form,
          this.paymentFieldList,
          false
        );
        this.setRenderOnlyFields(
          this.form,
          this.adhocFieldList,
          false
        );
        this.form.get(FCMPaymentsConstants.IFSC_SEARCH_ICON)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.setRenderOnlyFields(
          this.form,
          FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS,
          false
        );
        this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
          FccGlobalConstant.RENDERED
        ] = false;

        this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      const formData = this.commonService.getBatchFormData();
      formData[this.editRecordIndex] = this.cloneAbstractControl(this.form).controls;
      this.commonService.setBatchFormData(formData);
      const griddata = this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA];
      const enrichObj = this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].filter(
        (item) => item['discardFlag'] === false
      );
      this.commonService.putEnrichmentDetails(enrichObj, this.editRecordIndex);
      griddata.forEach(element => {
        element[FccConstants.UPDATE_FLAG] = true;
      });
      ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment',
      'addEnrichmentField'].forEach((field) => {
        this.patchFieldParameters(this.form.controls[field], { rendered: false });
      });
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE).setValue('');
      const saveBeneficiaryCss = this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS];
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
      saveBeneficiaryCss + " disable-save-beneficiary";
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccConstants.FCM_SWITCH_HYPERLINK_AND_IMG] = false;
      this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.PARAMS]['shortDescription'] = "";
      this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.deletedEnrichmentsIndex = [];
      this.paymentInstrumentProductService.setEnrichmentIndex('');

      this.setRenderOnly(
        this.form,
        'rejectReasons',
        false
      );
      if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
        this.commonService.enableBatchModificationActions.next(true);
      }
      this.commonService.parentFormValidCheck.next(true);
      if (!this.zeroProofingFlag) {
        this.commonService.isNextEnabled.next(true);
      }
      this.resetAndHideEnrichmentFields();
      this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('addEnrichmentField')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('addNewEnrichment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.editRecordIndex = -1;
      this.updateClicked = false;
      this.resetRenderOnlyFields(this.form, FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD)[this.params][FccGlobalConstant.MAXLENGTH] =
        this.form.get(FccGlobalConstant.AMOUNT_FIELD)[this.params][FccGlobalConstant.ORIGNAL_MAX_LENGTH];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }, _err => {
        this.showErrorToaster(_err);
        this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = false;
        this.commonService.parentFormValidCheck.next(true);
        this.commonService.isNextEnabled.next(false);
      });
  }

  addAdditionalAttributesInTableObject(gridObj) {
    gridObj[FccConstants.UPDATE_FLAG] = true;
    if (this.operation === FccGlobalConstant.UPDATE_FEATURES) {
      gridObj[FccConstants.LEGAL_ENTITY] = 'IN';
      gridObj[FccConstants.FCM_CLIENT_CODE_DETAILS] = this.form.value[FccConstants.FCM_CLIENT_CODE_DETAILS];
      gridObj[FccConstants.FCM_BENEFICIARY_CODE] = this.form.value[FccConstants.FCM_BENEFICIARY_CODE];
    }
  }

  addAdhocFlowFields(gridObj) {
    if (this.beneEditToggleVisible){
      for (const item in this.form.value) {
        if (this.adhocFieldList.includes(item)) {
          gridObj[item] = this.previewService.getPersistenceValue(this.form.controls[item], false);
        }
      }
      if (this.commonService.isnonEMptyString(this.form.value[FccConstants.FCM_BENEFICIARY_CODE])){
        gridObj[FccConstants.FCM_BENEFICIARY_CODE] = this.form.value[FccConstants.FCM_BENEFICIARY_CODE];
      }
    } else {
      gridObj['beneficiaryBankIfscCode'] = this.beneNameAndCodeVal?.ifscCode ? this.beneNameAndCodeVal?.ifscCode : null ;
      gridObj['beneficiaryCode'] = this.beneNameAndCodeVal?.label ? this.beneNameAndCodeVal?.label : null ;
    }
  }

  updateAdhocFlowFields(gridObj) {

      for (const item in this.form.value) {
        if (this.adhocFieldList.includes(item)) {
          gridObj[item] = this.previewService.getPersistenceValue(this.form.controls[item], false);
        }
      }

  }


  onClickPencilIcon(_event, _key, index, rowData) {
    this.editRecordIndex = index;
    this.testData = rowData;
    rowData.highlight = true;
    localStorage.setItem("beneLimitAmt", rowData.amountDecimal);
    this.instrumentRefNumber = rowData.instrumentRefNumber;
    this.resetRenderOnlyFields(this.form, FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS);
    this.resetRenderOnlyFields(this.form, [FCMPaymentsConstants.ACCT_NUMBER]);
    const data =this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA];
      data.forEach(element => {
        element[FccConstants.UPDATE_FLAG] = false;
      });
    this.counterTransaction.splice(this.editRecordIndex, 1);
    this.transactionsDetailUpdate();
    if (this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.RENDERED]) {
      this.setRenderOnlyFields(
        this.form,
        this.paymentFieldList,
        false
      );
    }
    if (rowData.beneficiaryNameCode) {
      this.beneNameCode = rowData.beneficiaryNameCode;
    }
    this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED] = false;
    if (!rowData.adhocFlow) {
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW).setValue(rowData?.beneficiaryCode);
      this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW).setValue(rowData?.beneficiaryBankIfscCode);
    }
    this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED] = true;
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = true;
      if (rowData.adhocFlow) {
        this.form.get(FccConstants.BATCH_ADHOC_FLAG).setValue(FccConstants.BATCH_PAYMENT_ADHOC_FLOW);
        this.form.get(FCMPaymentsConstants.IS_ADHOC_CREDITOR).setValue(true);
        this.setRenderOnlyFields(
          this.form,
          FCMPaymentsConstants.FCM_ADHOC_PAYMENT_FIELDS,
          true
        );
        if(this.commonService.getAdhocBeneValidationConfig()?.saveadhocbeneflag === 'N'){
          this.form.get(FccConstants.FCM_ADD_BENE_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        this.updateCheckBoxDetailsOnEdit(rowData);
        if(rowData?.addBeneficiaryCheckbox == 'Y'){
          this.form.get(FccConstants.FCM_ADD_BENE_CHECKBOX).setValue(FccGlobalConstant.CODE_Y);
          this.onClickAddBeneficiaryCheckbox();
        }
        this.retainRenderedOnlyField(
          this.form,
          this.adhocFieldList,
          rowData
        );
        let filterParams: any = {};
        let filterParameter: any = {};
        filterParameter.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
        this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
        filterParameter = JSON.stringify(filterParameter);
        this.subscriptions.push(
          this.commonService.getExternalStaticDataList('productCodeDetails', filterParameter).subscribe(response => {
            if (response) {
              this.productType = response[0]?.pay_coll_detail;
              filterParams.paymenttype = this.productType ? this.productType : '';
              filterParams = JSON.stringify(filterParams);
              this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_ADHOC_BASED_OPTIONS, filterParams);
            }
          })
          );
        if (rowData.beneficiaryNameCodeOptions != null) {
          this.patchFieldParameters(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME),
          { options: rowData.beneficiaryNameCodeOptions });
          this.patchDropdownValue(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME);
        }
        this.retainRenderedOnlyField(
          this.form,
          this.adhocFieldList,
          rowData
        );
        this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
          FccGlobalConstant.RENDERED] = false;
      } else{
        this.form.get(FccConstants.BATCH_ADHOC_FLAG).setValue(FccConstants.BATCH_PAYMENT_NON_ADHOC_FLOW);
        this.form.get(FCMPaymentsConstants.IS_ADHOC_CREDITOR).setValue(false);
        this.setRenderOnlyFields(
          this.form,
          FCMPaymentsConstants.FCM_PAYMENT_FIELDS,
          true
        );
        this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
          FccGlobalConstant.RENDERED] = false;
        if (rowData.beneficiaryNameCodeOptions != null) {
          this.patchFieldParameters(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME),
          { options: rowData.beneficiaryNameCodeOptions });
          this.patchDropdownValue(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME);
        }
        if (rowData.payToOptions != null) {
          this.patchFieldParameters(this.form.get(FccConstants.FCM_PAYMENT_PAY_TO), { options: rowData.payToOptions });
          this.patchDropdownValue(FccConstants.FCM_PAYMENT_PAY_TO);
        }
        this.retainRenderedOnlyField(
          this.form,
          this.paymentFieldList,
          rowData
        );
      }
      if(rowData.instrumentstatus == FccGlobalConstant.PENDING_REPAIR
          || rowData.instrumentstatus === FccGlobalConstant.REJECTED || rowData.instrumentstatus === FccGlobalConstant.VERIFIER_REJECTED){
        this.setRenderOnly(
          this.form,
          'rejectReasons',
          true
        );
      } else {
        this.setRenderOnly(
          this.form,
          'rejectReasons',
          false
        );
      }

      this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.RENDERED] = false;
      if (!(this.commonService.isEmptyValue(this.commonService.getEnrichmentDetails(index)) ||
      this.commonService.getEnrichmentDetails(index)?.length === 0)) {
        this.form.get('addEnrichmentField')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        if (this.isEnrichTypeMultiple) {
          this.form.get('addNewEnrichment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        }
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.LIST_DATA] = true;
        if (this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.COLUMNS]?.length === 0) {
          if (this.enrichmentFieldsName && this.enrichmentFieldsName.length === 0) {
            this.enrichmentFieldsName = [...this.commonService.getEnrichmentDetails(FccGlobalConstant.LENGTH_999)];
          }
          this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.COLUMNS] = [...this.enrichmentFieldsName];
        }
        const enrichData = this.commonService.getEnrichmentDetails(index);
        enrichData.forEach(element => {
          element['discardFlag'] = false;
        });
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA
        ] = [...enrichData];
        this.setRenderOnly(this.form, FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER, true);
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment'].forEach((field) => {
          this.patchFieldParameters(this.form.controls[field], { rendered: false });
        });
        if (this.isMandatoryEnrichmentPresent || this.checkMandatoryFieldsInEnrichments()) {
          this.resetAndHideEnrichmentFields();
          this.onClickAddEnrichmentField(null);
        } else {
          if (this.commonService.isNonEmptyValue(this.enrichmentFields)) {
            this.form.get('addEnrichmentField')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          } else {
            this.form.get('addEnrichmentField')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          }
        }
      }
    this.transactionDetailsRender();
    this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).clearValidators();
    this.beneNameAndCodeVal = this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value;
    if (!rowData.adhocFlow && this.operation !== FCMPaymentsConstants.MODIFY_BATCH) {
    const beneBalAmt = this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceAmt;
    const amountFieldVal = this.commonService.removeAmountFormatting(this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value);
    this.beneLimitMap.set(this.beneNameAndCodeVal?.label,
      {
        balanceAmt: beneBalAmt + this.commonService.convertCurrencyFormatStrToFloat(amountFieldVal),
        balanceTxnNo: this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceTxnNo + 1
      });
    }
    this.form.updateValueAndValidity();
    this.onClickAdditionalInformation();
    this.onClickReceiverType();
    this.onScroll();
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      this.form.get('balanceAmtTrnValidMsg')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    this.validateEnableSave();
  }

  retainBeneCodeName(control , value, rowData){
      const val = control.params.options.filter( option =>
        option.value.shortName === value
      )[0];
      this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).setValue(val);
      if(rowData.adhocFlow){
        this.form.get(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME).setValue(
          rowData.beneficiaryNameCode);
      }else{
        this.form.get(FCMPaymentsConstants.BENEFICIARY_NAME).setValue(
          val.label);
      }

      control.updateValueAndValidity();

  }
  onClickTrashIcon(_event, rowData, index) {
    const headerField = `${this.translateService.instant('deletePayment')}`;
    const message = `${this.translateService.instant(
      'deletePaymentConfirmationMsg'
    )}`;
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: message },
      baseZIndex: 9999,
      autoZIndex: true
    });
    this.subscriptions.push(dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === FccGlobalConstant.CONFIRMATION_YES) {
        this.counterTransaction.splice(index, 1);
        this.transactionsDetailUpdate();
        const action = FccGlobalConstant.ACTION_DISCARD;
        const comment = '';
        this.instrumentRefNumber = rowData.instrumentRefNumber;
        this.paymentInstrumentDiscard(this.commonService.batchRefNumber, action, this.instrumentRefNumber, comment, rowData);
        if (
          this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.DATA
          ].length === 1
        ) {
          this.isTrashIconTriggered = true;
          this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.DATA
          ] = [];
          this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = false;
          this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = false;
          this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = true;
          this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
            'btndisable'] = true;
          this.validateNextEnable();
          this.resetRenderOnlyFields(this.form, FCMPaymentsConstants.FCM_PAYMENT_RESET_FIELDS);
          this.patchFieldParameters(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME),{ options:[] });
          this.patchFieldParameters(this.form.get(FccConstants.FCM_PAYMENT_PAY_TO),{ options:[] });
          this.setAmountOriginalValue(FccConstants.FCM_PAYMENT_AMOUNT);
          this.resetRenderOnlyFields(this.form, FCMPaymentsConstants.FCM_BATCH_ADHOC_PAYMENT_FIELDS);
          this.resetRenderOnlyFields(this.form, FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS);
          this.setRenderOnlyFields(
            this.form,
            FCMPaymentsConstants.FCM_PAYMENT_FIELDS,
            true
          );

          this.setRequired(
            this.form,
            FCMPaymentsConstants.FCM_PAYMENT_FIELDS,
            true
          );
          this.beneNameCode = undefined;
          this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS]['warning'] = "";
          this.commonService.paymentBatchBalanceValidation.next(false);
          if (this.checkMandatoryFieldsInEnrichments()) {
            this.onClickAddEnrichmentField(null);
          } else {
            this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD, this.displayAddEnrichment);
          }
        } else {
          const retainedItem = this.form
            .get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].filter(
              (_item, i) => i !== index
            );
          this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.DATA
          ] = [];
          this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.DATA
          ] = [...retainedItem];
          this.showAddPaymentButton();
          this.validateEnableSave();
        }
        const formData = this.commonService.getBatchFormData();
        formData.splice(index,1);
        this.transactionDetailsRender();
        this.commonService.setBatchFormData(formData);
      }
    }));
  }

  paymentInstrumentDiscard(paymentReferenceNumber, action, instrumentRefNumber, comment, data) {
    this.commonService.paymentInstrumentDiscard(paymentReferenceNumber, action, instrumentRefNumber, comment)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .subscribe(_res => {
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translateService.instant('success')}`,
          detail: `${this.translateService.instant('singleDiscardToasterMessage')}`
        });
        let req = {};
          if (this.operation === FCMPaymentsConstants.MODIFY_BATCH) {
            req = { paymentReferenceNumber : paymentReferenceNumber, pageSize: 10, first: 0 };
        } else {
          req = { paymentReferenceNumber : paymentReferenceNumber };
        }
        this.subscriptions.push(this.commonService.getPaymentDetails(req).subscribe(response => {
        this.paymentDetailsResponse = response;
        this.transactionsDetailUpdate();
        this.transactionDetailsRender(); 
        data.beneficiaryNameCodeOptions.forEach(element => {
          if (element.label === data.beneficiaryCode) {
            this.beneNameAndCodeVal = element.value;
          }
        });
        if (!data.adhocFlag) {
        const beneBalAmt = this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceAmt;
        const amountFieldVal = data.amountDecimal;
        this.beneLimitMap.set(this.beneNameAndCodeVal?.label,
          {
            balanceAmt: beneBalAmt + this.commonService.convertCurrencyFormatStrToFloat(amountFieldVal),
            balanceTxnNo: this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceTxnNo + 1
          });
        }
        }));
      }, _err => {
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

  onScroll() {
    document.getElementById("editGridTable")?.scrollIntoView();
  }
  onClickCancel(){
    this.isCancelClicked = true;
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH &&
      FccGlobalConstant.REJECTED !== this.paymentDetailsResponse.data.paymentHeader.batchStatus){
        this.commonService.batchInstrumntCancelFlag.next(false);
    }
    if (this.isAddPaymentClicked) {
      this.form.get(FccConstants.FCM_PRODUCT_TYPE).setValue(this.form.get('paymentProductType')['options'][0].value);
      this.onClickPaymentProductType();
      this.isAddPaymentClicked = false;
    }
    this.form.get(FccConstants.COPY_PAYMENT_CHECKBOX)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.PARAMS]['shortDescription'] = "";
    this.setRenderOnlyFields(
      this.form,
      this.paymentFieldList,
      false
    );
    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].forEach((item, i) => {
      if (this.deletedEnrichmentsIndex.indexOf(i) > -1) {
        item['discardFlag'] = false;
      }
    });
    this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED] = false;
    this.setRenderOnlyFields(
      this.form,
      this.adhocFieldList,
      false
    );
    this.setRenderOnlyFields(
      this.form,
      FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS,
      false
    );
    if(this.enrichmentFieldsName.length>0){
      this.resetAndHideEnrichmentFields();
      this.setRenderOnlyFields(
        this.form,
        [...this.enrichmentFieldsName],
        false
      );
    }

    this.setRenderOnly(
      this.form,
      'rejectReasons',
      false
    );

    this.updatedFlag = false;
    this.patchFieldParameters(this.form.get(FccConstants.FCM_EFFECTIVE_DATE), { hasChanged: false });
    if(this.testData !== undefined){
      this.testData.highlight = false;
    }


    const data =this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA];

      if(this.operation === FCMPaymentsConstants.MODIFY_BATCH) {
        if (this.editBalanceDetails) {
          this.cancelEditedBalanceDetails = true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.paymentDetailsResponse?.data?.paymentDetail.forEach((element, index) => {
          element[FccConstants.UPDATE_FLAG] = true;
          if(element['index'] == this.editRecordIndex){
            this.counterTransactionListUpdate(parseFloat(this.commonService.removeAmountFormatting(
              element.instructedAmountCurrencyOfTransfer2.amount)), this.editRecordIndex);
          }
        });
      } else {
        data.forEach((element, index) => {
          element[FccConstants.UPDATE_FLAG] = true;
          if(index == this.editRecordIndex){
            this.counterTransactionListUpdate(element.amount, this.editRecordIndex);
          }
        });
      }
      this.paymentInstrumentProductService.setEnrichmentIndex('');
      if(data.length > 0 || this.operation === FCMPaymentsConstants.MODIFY_BATCH){
        this.form.get(FCMPaymentsConstants.PAYMENTS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }else{
        this.form.get(FCMPaymentsConstants.PAYMENTS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment',
      'addEnrichmentField'].forEach((field) => {
        this.patchFieldParameters(this.form.controls[field], { rendered: false });
      });
      if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
        this.setRenderOnly(this.form, 'addEnrichmentField', false);
        this.commonService.enableBatchModificationActions.next(true);
      }
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE).setValue('');
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    const saveBeneficiaryCss = this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS];
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
    saveBeneficiaryCss + " disable-save-beneficiary";
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccConstants.FCM_SWITCH_HYPERLINK_AND_IMG] = false;
    this.showAddPaymentButton();
    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.editRecordIndex = -1;
    this.transactionDetailsRender();
    this.transactionsDetailUpdate();
    this.commonService.parentFormValidCheck.next(true);
    if (!this.zeroProofingFlag) {
      this.commonService.isNextEnabled.next(true);
    }
    this.validateNextEnable();
    if (this.form.get('adhocFlag').value === FccConstants.BATCH_PAYMENT_NON_ADHOC_FLOW 
    && this.commonService.isnonEMptyString(localStorage.getItem("beneLimitAmt"))) {
      const beneBalAmt = this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceAmt;
      const amountFieldVal = this.commonService.removeAmountFormatting(localStorage.getItem("beneLimitAmt"));
      this.beneLimitMap.set(this.beneNameAndCodeVal?.label,
        {
          balanceAmt: beneBalAmt - amountFieldVal,
          balanceTxnNo: this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceTxnNo - 1
        });
    }
    localStorage.removeItem("beneLimitAmt");
    this.form.get(FccGlobalConstant.AMOUNT_FIELD)[this.params][FccGlobalConstant.MAXLENGTH] =
      this.form.get(FccGlobalConstant.AMOUNT_FIELD)[this.params][FccGlobalConstant.ORIGNAL_MAX_LENGTH];
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FCMPaymentsConstants.IFSC_SEARCH_ICON)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  }


  onClickAdditionalInformation() {
    if (this.form.get(FccConstants.ADDITIONAL_INFORMATION).value === FccGlobalConstant.CODE_Y
      && this.form.get(FccConstants.ADDITIONAL_INFORMATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === true) {
      this.setRenderOnlyFields(
        this.form,
        FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS,
        true
      );
      const isAdhoc = this.form.get(FCMPaymentsConstants.IS_ADHOC_CREDITOR).value;
      if(!this.beneEmailIdEditPageFlag){
        if(!isAdhoc){
          const emailId = this.commonService.isnonEMptyString(
            this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.emailId) ?
          this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.emailId :
          this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.value?.emailId;
          this.form.get(FccConstants.FCM_EMAIL_ID).setValue(emailId);
          this.form.get(FccConstants.FCM_EMAIL_ID).disable();
          if(this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value)
          && !this.commonService.isnonEMptyString(emailId)){
            this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG).setValue(`${this.translateService.instant('beneEmailIdWarnMsg')}`);
          } else{
            this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          }
          this.form.get(FccConstants.FCM_RECEIVER_TYPE).disable();
          this.form.get(FccConstants.FCM_LEI_CODE).disable();
        } else {
          this.form.get(FccConstants.FCM_EMAIL_ID).enable();
          this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get(FccConstants.FCM_RECEIVER_TYPE).enable();
          if (this.form.get(FccConstants.FCM_RECEIVER_TYPE).value === FccConstants.RECEIVER_TYPE_INDIVIDUAL) {
            this.form.get(FccConstants.FCM_LEI_CODE).disable();
          } else {
            this.form.get(FccConstants.FCM_LEI_CODE).enable();
          }
        }
      } else {
        if(!isAdhoc) {
          this.form.get(FccConstants.FCM_EMAIL_ID).disable();
          if(!this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_EMAIL_ID).value)){
            this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG).setValue(`${this.translateService.instant('beneEmailIdWarnMsg')}`);
          } else{
            this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          }
          this.form.get(FccConstants.FCM_RECEIVER_TYPE).disable();
          this.form.get(FccConstants.FCM_LEI_CODE).disable();
        } else {
          this.form.get(FccConstants.FCM_EMAIL_ID).enable();
          this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get(FccConstants.FCM_RECEIVER_TYPE).enable();
          if (this.form.get(FccConstants.FCM_RECEIVER_TYPE).value === FccConstants.RECEIVER_TYPE_INDIVIDUAL) {
            this.form.get(FccConstants.FCM_LEI_CODE).disable();
          } else {
            this.form.get(FccConstants.FCM_LEI_CODE).enable();
          }
        }

      }
      if(!this.beneMobileNoEditPageFlag){
        if(!isAdhoc){
          const mobileNumber = this.commonService.isnonEMptyString(
            this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.mobileNumber) ?
          this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.mobileNumber :
          this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.value?.mobileNumber;
          this.form.get(FccConstants.FCM_MOBILE_NUMBER).setValue(mobileNumber);
          this.form.get(FccConstants.FCM_MOBILE_NUMBER).disable();
          if(this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value)
          && !this.commonService.isnonEMptyString(mobileNumber)){
            this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG).setValue(`${this.translateService.instant('beneMobileNoWarnMsg')}`);
          } else{
            this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          }

        } else {
          this.form.get(FccConstants.FCM_MOBILE_NUMBER).enable();
          this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
      } else {
        if(!isAdhoc) {
        this.form.get(FccConstants.FCM_MOBILE_NUMBER).disable();
          if(!this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_MOBILE_NUMBER).value)){
            this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG).setValue(`${this.translateService.instant('beneMobileNoWarnMsg')}`);
          } else{
            this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          }
      } else {
        this.form.get(FccConstants.FCM_MOBILE_NUMBER).enable();
        this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
    }
    } else {
      this.setRenderOnlyFields(
        this.form,
        FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS,
        false
      );
      this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
  }

  buildSinglePaymentRequestObject(mappingModel, form): any {
    let requestObject = {};
    const objModel = FCMPaymentsConstants.FCM_ADD_BATCH_INSTRUMENT_FIELD;
      const sectionFormValue = form.controls;
      if (sectionFormValue !== null && mappingModel !== null) {
        Object.keys(sectionFormValue).forEach(key => {
          const control = sectionFormValue[key];
          const mapping = objModel[key];
          let val = this.previewService.getPersistenceValue(control, false);
          if(key == FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME){
            if(sectionFormValue[FccConstants.FCM_ADD_BENE_CHECKBOX].value == FccGlobalConstant.CODE_Y){
              val = sectionFormValue[FccConstants.FCM_BENEFICIARY_CODE].value;
            } else {
              val = '';
            }
          }
          if (key === FCMPaymentsConstants.AMOUNT && typeof val === 'string') {
            val = this.commonService.removeAmountFormatting(val);
          }
          if (key === FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT && typeof val === 'string') {
            val = this.commonService.removeAmountFormatting(val);
          }
          if(mapping != undefined) {
            if (!(key === FccConstants.FCM_BENEFECIARY_NAME &&
              this.form.get(FccConstants.BATCH_ADHOC_FLAG).value === FccConstants.BATCH_PAYMENT_NON_ADHOC_FLOW)) {
              this.createNested(mapping,requestObject, val, control);
            }
          } else {
            let mappingKey = this.productMappingService.getRequestFieldNameFromMappingModel(key, mappingModel);
            if (key === 'enrichmentListTable') {
              mappingKey = 'enrichmentDetails';
              const EnrichValue = this.getEnrichmentObject(control[this.params]);
              if (EnrichValue['singleSet'] && this.isNonEmptyObject(EnrichValue['singleSet'])) {
                requestObject[mappingKey] = EnrichValue;
              }
              if (EnrichValue['multiSet'] && this.isNonEmptyObject(EnrichValue['multiSet'])) {
                requestObject[mappingKey] = EnrichValue;
              }
            }
            else if (control[FccGlobalConstant.PARAMS][FccConstants.MAP_BOOLEAN_VALUE]) {
              requestObject[mappingKey] = (val === FccGlobalConstant.CODE_Y) ? true : false;
            } else {
              requestObject[mappingKey] = val;
            }
          }
        });
      }
    if (this.commonService.isEmptyValue(requestObject['creditorDetails']['account']['type'])) {
      requestObject['creditorDetails']['account']['type'] = this.commonService.isNonEmptyValue(
        sectionFormValue['accountType']?.value?.value) ? sectionFormValue['accountType']?.value?.value :
        sectionFormValue['accountType']?.value?.label;
    }

    if(this.commonService.isNonEmptyValue(this.form.get(FccConstants.FCM_MOBILE_NUMBER).value)) {
      requestObject['creditorDetails']['mobileNumber'] = this.form.get(FccConstants.FCM_MOBILE_NUMBER).value;
    }
    if(this.commonService.isNonEmptyValue(this.form.get(FccConstants.FCM_EMAIL_ID).value)) {
      requestObject['creditorDetails']['emailid'] = this.form.get(FccConstants.FCM_EMAIL_ID).value;
    }
    requestObject = this.updateCustomerRefNo(requestObject);
    if (this.productType === FccGlobalConstant.CODE_04) {
      requestObject = this.updateDetailsForInHouseTransfer(requestObject);
    }
    return requestObject;
  }

  updateDetailsForInHouseTransfer(obj: any) {
    obj[FCMPaymentsConstants.CREDITOR_AGENT][FCMPaymentsConstants.IDENTIFIER_TYPE] = FCMPaymentsConstants.SYSTEM;
    let id = "";
    if(this.form.get(FccConstants.BENE_BANK_IFSC_CODE)?.value?.shortName){
      id = this.form.get(FccConstants.BENE_BANK_IFSC_CODE)?.value?.shortName;
    } else {
      id = this.form.get(FccConstants.BENE_BANK_IFSC_CODE)?.value;
    }
    obj[FCMPaymentsConstants.CREDITOR_AGENT][FCMPaymentsConstants.OTHER_ID] = id;
    return obj;
  }
  updateCustomerRefNo(object){
    if(object[FCMPaymentsConstants.CUSTOMER_REFERENCE_NUMBER] == ''){
      const datestamp = this.utilityService.getUniqueTimeStampValue();
      const productCode = this.productCode?.substring(0, 2) ? this.productCode?.substring(0, 2) : 'XX';
      object[FCMPaymentsConstants.CUSTOMER_REFERENCE_NUMBER] = productCode + datestamp;
    }
    object[FCMPaymentsConstants.PAYMENT_REFERENCE] = object[FCMPaymentsConstants.CUSTOMER_REFERENCE_NUMBER];
    return object;
  }

  isNonEmptyObject(obj: any): boolean {
    return Object.keys(obj).length === 0 ? false : true;
  }

  getEnrichmentObject(params: any) {
    const obj = {};
    if (params['data'] !== null && params['data'] !== undefined && params['data']?.length > 0) {
      if (this.isEnrichTypeMultiple) {
        obj['multiSet'] = [];
        params['data'].forEach((data) => {
          const enrichObj = {};
          params['columns'].forEach((ele) => {
            enrichObj[this.enrichmentFields[ele].code] = data[ele];
          });
          if (data['discardFlag']) {
            enrichObj['discardFlag'] = data['discardFlag'];
          }
          obj['multiSet'].push(enrichObj);
        });
      } else {
        obj['singleSet'] = {};
        params['data'].forEach((data) => {
          const enrichObj = {};
          params['columnsOrder'].sort((a,b) => a['order'] - b['order']).forEach((ele) => {
            enrichObj[ele.code] = data[ele.column];
          });
          if (data['discardFlag']) {
            params['columnsOrder'].sort((a,b) => a['order'] - b['order']).forEach((ele) => {
              enrichObj[ele.code] = '';
            });
          }
          obj['singleSet'] = enrichObj;
        });
      }
    }
    return Object(obj);
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

  getCurrencyDetail() {
    this.subscriptions.push(this.commonService.userCurrencies(this.curRequest).subscribe(
      response => {
        if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else {
          const currencyDetailList = [];
          response.items.forEach(
            value => {
              const ccy: { label: string, value } = {
                label: value.isoCode,
                value: {
                  label: value.isoCode,
                  iso: `${value.isoCode} - ${this.toTitleCase(value.name)}`,
                  country: value.principalCountryCode,
                  currencyCode: value.isoCode,
                  shortName: value.isoCode,
                  name: value.name
                }
              };
              currencyDetailList.push(ccy);
            });
            this.patchFieldParameters(this.form.get('currency'), { options: currencyDetailList });
         }
      })
    );
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  retainRenderedOnlyField(form, _ids: string[], rowdata, enrichmentFlag = false) {
    for (const [key, value] of Object.entries(rowdata)) {
      if(form.controls[key]) {
        if(key === 'beneficiaryNameCode'){
          this.retainBeneCodeName(form.controls[key] , value, rowdata);
        } else if (key === 'amount') {
          let amountDecimal = rowdata['amountDecimal'];
          amountDecimal = this.commonService.isnonEMptyString(amountDecimal) ? amountDecimal : 0;
          this.commonService.getFormElement(this.form,key).setValue(amountDecimal.toString());
          this.commonService.getFormElement(this.form,key).patchValue(amountDecimal.toString());
          this.commonService.getFormElement(this.form,key)[this.params][this.ORIGINAL_VALUE] = amountDecimal;
          this.commonService.getFormElement(this.form,key).updateValueAndValidity();
        } else if(form.controls[key].type === 'input-date' && typeof(value) === 'string') {
          if (enrichmentFlag && this.enrichmentFields[key] &&
            this.enrichmentFields[key]?.format === FccGlobalConstant.FCM_MM_DD_YYYY_FORMAT) {
              if (this.commonService.isnonEMptyString(value)) {
                const initial = value.split(/\//);
                this.retainDateValue(form.controls[key] , [initial[1], initial[0], initial[2]].join('/'));
              } else {
                form.controls[key].patchValue(value);
                form.controls[key].updateValueAndValidity();
              }
          } else {
            this.retainDateValue(form.controls[key] , value);
          }
        } else {
          this.patchFieldValueAndParameters(form.controls[key], value, {});
          this.retainDropdownValues(form.controls[key] , value);
        }
      }
    }
  }

  resetRenderOnlyFields(form, ids: string[]) {
    ids.forEach((id) => this.resetRenderOnly(form, id));
  }

  resetRenderOnly(form, id) {
    if(FCMPaymentsConstants.BOOLEAN_CONTROLS.includes(id)){
      this.resetValue(form, id, FccGlobalConstant.CODE_N);
    } else {
      this.resetValue(form, id, null);
    }
    if (id === FCMPaymentsConstants.AMOUNT) {
      this.form.get(id)[this.params][this.ORIGINAL_VALUE] = null;
    }
    form.get(id).markAsUntouched();
    form.get(id).markAsPristine();
  }

  showAddPaymentButton(updateFlag?: boolean){
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      this.getEnrichmentFields();
    }
    const noOfTransactions = this.form.get(FCMPaymentsConstants.PAYMENT_NO_OF_TRANSACTIONS).value;
    const transactionAmount = this.form.get(FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT).value;
    const balanceDetail = this.balanceTransactionDetails(updateFlag);
    if(this.zeroProofingFlag === false) {
      this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = false;
    } else {
    let paymentTableLength = 0;
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH) {
      paymentTableLength = this.paymentDetailsResponse?.data?.paymentHeader?.controlTotal -
      this.paymentDetailsResponse?.data?.paymentHeader?.remainingCount;
    } else {
      paymentTableLength = this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.DATA].length;
    }
    if (this.form.get(FccConstants.ENRICHMENT_LIST_TABLE) && paymentTableLength > 0) {
      this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    } else if(this.operation === FccGlobalConstant.ADD_FEATURES &&
      this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].length > 0) {
      this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
    if(this.commonService.isnonEMptyString(noOfTransactions) && this.commonService.isnonEMptyString(transactionAmount)
      && (noOfTransactions <= paymentTableLength || balanceDetail.balanceAmount <= 0)){
        this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = false;
        this.form.get("balanceSpacer")[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    } else if(this.operation === FCMPaymentsConstants.MODIFY_BATCH && noOfTransactions == paymentTableLength) {
      this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get("balanceSpacer")[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    } else {
      this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = false;
    }
  }
  }

  fetchAdhocDropdown(){
    let filterParams: any = {};
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_PRODUCT_ID).value)) {
      filterParams.paymenttype = this.productType;
      filterParams.ifscValue = this.commonService.isnonEMptyString(this.form.get(FccConstants.BENE_BANK_IFSC_CODE)?.value) ?
      this.form.get(FccConstants.BENE_BANK_IFSC_CODE).value.toString().concat('%') : 'BLANK';
      filterParams = JSON.stringify(filterParams);
      this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_ADHOC_BASED_OPTIONS.slice(0, 1), filterParams);
    }
  }

  onKeyupBeneficiaryBankIfscCode(event) {
    const keycodeIs = event.which || event.keyCode;
    const beneIfscVal = this.form.get(FccConstants.BENE_BANK_IFSC_CODE).value;
    this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.PARAMS]['shortDescription'] = "";
    this.form.get(FccConstants.BENE_BANK_IFSC_CODE).setErrors(null);
    if (keycodeIs === FccGlobalConstant.LENGTH_13 || keycodeIs === FccGlobalConstant.LENGTH_38
      || keycodeIs === FccGlobalConstant.LENGTH_40) {
      this.onClickBeneficiaryBankIfscCode();
    } else if (this.commonService.isnonEMptyString(beneIfscVal) && beneIfscVal.length > 3){
      this.fetchAdhocDropdown();
    } else if (this.commonService.isnonEMptyString(beneIfscVal) && beneIfscVal.length <= 3){
      this.form.get(FccConstants.BENE_BANK_IFSC_CODE).setErrors({ IFSCfourChar: true });
    }
    this.validateEnableSave();
  }

  onClickBeneficiaryBankIfscCode(val?: any) {
    if (val) {
      this.form.get(FccConstants.BENE_BANK_IFSC_CODE).patchValue(val.value);
    }
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.BENE_BANK_IFSC_CODE)) &&
      this.form.get(FccConstants.BENE_BANK_IFSC_CODE).value?.label !==
    this.changeFieldsMap.get(FccConstants.BENE_BANK_IFSC_CODE)) {
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    this.addIFSCShortDesc();
    this.validateEnableUpdate();
    this.validateEnableSave();
  }

  onKeyupBeneficiaryBankIfscCodeIcons(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === FccGlobalConstant.LENGTH_13) {
      this.onClickBeneficiaryBankIfscCodeIcons();
    }
  }

  onClickBeneficiaryBankIfscCodeIcons() {
    const obj = {};
    this.preapreLookUpObjectData(obj);
    const header = `${this.translateService.instant('IFSC_Details')}`;
    this.resolverService.getSearchData(header, obj);
    this.ifscResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
          if (response) {
            this.form.get(FccConstants.BENE_BANK_IFSC_CODE).setValue(response.responseData.IFSC);
            const options = this.createOptionObj(response?.responseData);
            const valObj = this.dropdownAPIService.getDropDownFilterValueObj(options, FccConstants.BENE_BANK_IFSC_CODE, this.form);
            if (valObj) {
              this.form.get(FccConstants.BENE_BANK_IFSC_CODE).setValue(valObj[`value`]);
            }
            this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.PARAMS]['shortDescription']
            = response.responseData.DRAWEE_BANK_DESCRIPTION+", "+response.responseData.DRAWEE_BRANCH_DESCRIPTION;
          }
        }
      );
  }

  preapreLookUpObjectData(obj) {
    let filterParams: any = {};
    filterParams.paymentType = this.productType;
    filterParams.ifscValue = '%';
    filterParams = JSON.stringify(filterParams);
    obj[FccGlobalConstant.FILTER_PARAMS] = filterParams;
    obj[FccGlobalConstant.PRODUCT] = '';
    obj[FccGlobalConstant.DEFAULT_CRITERIA] = true;
    obj[FccConstants.BENE_BANK_CODE_OPTION] = FccConstants.BENE_BANK_IFSC_CODE;
    obj[FccGlobalConstant.SUB_PRODUCT_CODE] = '';
    obj[FccGlobalConstant.BUTTONS] = false;
    obj[FccGlobalConstant.SAVED_LIST] = false;
    obj[FccGlobalConstant.HEADER_DISPLAY] = false;
    obj[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] = false;
    obj[FccGlobalConstant.CATEGORY] = FccConstants.FCM;
    obj[FccGlobalConstant.IFSC_VALUE] = '%';
  }

  onClickAddBeneficiaryCheckbox(){
    const checkboxVal = this.form.get(FccConstants.FCM_ADD_BENE_CHECKBOX).value;
    const saveBeneficiaryCss = this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS];
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
    saveBeneficiaryCss + " disable-save-beneficiary";

    if (checkboxVal === FccGlobalConstant.CODE_Y) {
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.setRenderOnlyFields(
        this.form,
        FCMPaymentsConstants.DISPLAY_BENE_CODE,
        true
      );
      this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = true;
    } else {
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.FCM_BENEFICIARY_CODE).setValue('');
      this.setRenderOnlyFields(
        this.form,
        FCMPaymentsConstants.DISPLAY_BENE_CODE,
        false
      );
      this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = false;
    }
    this.form.updateValueAndValidity();
  }
  patchDropdownValue(key) {
    if (this.form.get(key).value !== FccGlobalConstant.EMPTY_STRING) {
      const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.form.controls[key]['options'], key, this.form);
      if (valObj && !this.commonService.isObjectEmpty(valObj)) {
        this.form.get(key).patchValue(valObj[`value`]);
      }
    }
  }

  retainDropdownValues(control , value){
    if(control.params.type === 'input-dropdown-filter' && typeof (value) !== 'object'){
      const val = control.params.options?.filter( option =>
        option.value.shortName === value
      )[0];
      if(val !==undefined){
        control.patchValue(val.value);
      }

      control.updateValueAndValidity();
    }
  }

  retainDateValue(control, stringDate){
    control.patchValue(this.commonService.convertToDateFormat(stringDate));
    control.updateValueAndValidity();
  }

  paymentTransactionAmtRemoveFormat(){
    let paymentTransactionAmount;
    if(this.form && this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT)) &&
        this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).value)){
      paymentTransactionAmount = this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT)?.value;
      paymentTransactionAmount = paymentTransactionAmount.toString();
      paymentTransactionAmount = paymentTransactionAmount.replace(new RegExp(FccGlobalConstant.AMOUNT_REPLACE_CHARS, "g"), "");
      paymentTransactionAmount = this.commonService.removeAmountFormatting(paymentTransactionAmount);
    }else{
      paymentTransactionAmount = "";
    }
    return paymentTransactionAmount;
  }

  onClickPaymentTransactionAmt(){
    let paymentTransactionAmount = this.paymentTransactionAmtRemoveFormat();
    paymentTransactionAmount = this.commonService.replaceNumberToFloatStringPerLang(paymentTransactionAmount);
    this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).setValue(paymentTransactionAmount);
  }

  onKeyupPaymentTransactionAmt(event){
    this.updateAmountLenghtValidation(event, FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT);
    let paymentTransactionAmount = this.paymentTransactionAmtRemoveFormat();
    if(paymentTransactionAmount.indexOf(".") > 0){
      paymentTransactionAmount = paymentTransactionAmount.substr(0, paymentTransactionAmount.indexOf(".")+3);
      paymentTransactionAmount = this.commonService.replaceNumberToFloatStringPerLang(paymentTransactionAmount);
      this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).setValue(paymentTransactionAmount);
    }
  }

  onBlurPaymentTransactionAmt() {
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).value)) {
      if (!this.zeroProofingFlag) {
        this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).setValidators(Validators.required);
        this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).updateValueAndValidity();
      }
      this.isControlTotalRequired = true;
      this.validateEnableSave();
    } else {
      if (!this.zeroProofingFlag) {
        this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
        this.resetValidation(this.form, FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION);
        this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).updateValueAndValidity();
      }
      this.isControlTotalRequired = false;
    }
    this.enableCreateBatch();
    const paymentReference = this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE_NUMBER).value;
    if (this.changeinAmtAndTransField) {
      const transactionsAmountPrevValue = this.changefiledOfAmtAndTransMap.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT);
      if (this.paymentTransactionAmtRemoveFormat() !== transactionsAmountPrevValue &&
        (this.commonService.isnonEMptyString(paymentReference) || this.commonService.isnonEMptyString(transactionsAmountPrevValue))) {
        this.openDialog();
      }
    }
    const paymentTransactionAmount = this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).value;
    if(!this.controlTotalFlag){
      this.clearValidators(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT);
    }
    this.addTransactionValidation();
    if (this.commonService.isnonEMptyString(paymentTransactionAmount)) {
      let validationError = null;
      let valueupdated;
      const amountCharCheck = new RegExp(this.commonService.getRegexBasedOnlanguage(), "g");
      const amountZeroCheck = new RegExp(FccGlobalConstant.START_AMOUNT_WITHOUT_ZERO, "g");
      const paymentTransactionDecimal = this.paymentTransactionAmtRemoveFormat();

      if (!amountCharCheck.test(paymentTransactionAmount)) {
        validationError = { accountNumberInvalid: true };
      } else if (!amountZeroCheck.test(paymentTransactionDecimal)) {
        let number = "99999999999.99";
        number = this.commonService.replaceCurrency(number);
        number = this.currencyConverterPipe.transform(number, FccConstants.FCM_ISO_CODE);
        validationError = { allowedNumberValues: { minValue: "1", maxValue: number } };
      } else if (!FccGlobalConstant.AMOUNT_LENGTH_11_VALIDATION.test(paymentTransactionDecimal)) {
        validationError = {
          amountMaxLength:
            { field: "Amount Of Transaction", maxLength: FccGlobalConstant.MAX_LENGTH_11 }
        };
      }
      if (this.commonService.isnonEMptyString(validationError)) {
        this.addFccValidation(validationError, FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT);
      } else {
        valueupdated = paymentTransactionDecimal;
        valueupdated = valueupdated.toString();
        valueupdated = this.commonService.replaceCurrency(valueupdated);
        valueupdated = this.currencyConverterPipe.transform(valueupdated, FccConstants.FCM_ISO_CODE);
        this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).setValue(valueupdated);
      }
    }
    this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).updateValueAndValidity();
  }

  enableCreateBatch() {
    if (this.zeroProofingFlag === true &&
      this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value) &&
      this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).value) &&
      this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).value) &&
      parseFloat(this.commonService.removeAmountFormatting(
        this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).value)) > FccGlobalConstant.ZERO &&
      parseInt(this.commonService.removeAmountFormatting(
        this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).value)) > FccGlobalConstant.ZERO) {
      this.form.get(FccConstants.FCM_PAYMENT_PAYMENT_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS]['btndisable'] = false;
    } else if (this.zeroProofingFlag === false &&
      this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value) &&
      ((this.commonService.isEmptyValue(this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).value) &&
        this.commonService.isEmptyValue(this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).value)) ||
        (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).value) &&
          this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).value) &&
          parseFloat(this.commonService.removeAmountFormatting(
            this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).value)) > FccGlobalConstant.ZERO &&
          parseInt(this.commonService.removeAmountFormatting(
            this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).value)) > FccGlobalConstant.ZERO))) {
      this.form.get(FccConstants.FCM_PAYMENT_PAYMENT_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS]['btndisable'] = false;
    } else {
      this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS]['btndisable'] = true;
    }
  }

  addTransactionValidation(){
    let validationError = null;
    if(!this.controlTotalFlag){
      const paymentTransactionAmount = this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).value;
      const noOfTransactions = this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).value;


      if(this.commonService.isEmptyValue(noOfTransactions) && this.commonService.isEmptyValue(paymentTransactionAmount)){
        this.clearValidators(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION);
        this.clearValidators(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT);
      }else if(this.commonService.isEmptyValue(paymentTransactionAmount)){
        validationError = { required:true };
        this.addFccValidation(validationError, FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT);
        this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).markAsTouched();
      }else if(this.commonService.isEmptyValue(noOfTransactions)){
        validationError = { required:true };
        this.addFccValidation(validationError, FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION);
        this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).markAsTouched();
      }
    }

    this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).updateValueAndValidity();
    this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).updateValueAndValidity();
    return validationError;
  }

  onClickEffectiveDate(){
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_EFFECTIVE_DATE)) &&
      this.form.get(FccConstants.FCM_EFFECTIVE_DATE).value !== this.changeFieldsMap.get(FccConstants.FCM_EFFECTIVE_DATE)){
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false || this.addNewMode;
      this.patchFieldParameters(this.form.get(FccConstants.FCM_EFFECTIVE_DATE), { hasChanged: true });
    }
    this.validateEnableUpdate();
    this.validateEnableSave();
    this.changeFieldsMap.set(FccConstants.FCM_EFFECTIVE_DATE,this.form.get(FccConstants.FCM_EFFECTIVE_DATE).value);
    this.form.updateValueAndValidity();
  }

  onClickCurrency(){
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_CURRENCY)) &&
      this.form.get(FccConstants.FCM_CURRENCY).value !== this.changeFieldsMap.get(FccConstants.FCM_CURRENCY) &&
    typeof(this.form.get(FccConstants.FCM_CURRENCY).value) === typeof(this.changeFieldsMap.get(FccConstants.FCM_CURRENCY))){
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    const currency = this.form.get(FccConstants.FCM_CURRENCY).value?.label;
    const amt = this.form.get(FccConstants.FCM_PAYMENT_AMOUNT);
    const val = amt.value;
    //amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    //this.setMandatoryField(this.form, FccConstants.FCM_PAYMENT_AMOUNT, true);
    if (this.commonService.isnonEMptyString(val)) {
      if (val <= 0) {
        this.paymentAmountAddFCCValidation({ amountCanNotBeZero: true });
        return;
      } else {
        this.formatAmount();
      }
    } else {
      this.paymentAmountAddFCCValidation({ required: true });
    }
    //this.setAmountLengthValidator(FccConstants.FCM_PAYMENT_AMOUNT);
    //this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).updateValueAndValidity();
    this.changeFieldsMap.set(FccConstants.FCM_CURRENCY, currency);
    this.form.get(FCMPaymentsConstants.CREDITOR_ACCOUNT_CURRENCY).setValue(this.form.get(FccConstants.FCM_CURRENCY).value?.label);
    this.validateEnableSave();
    this.validateEnableUpdate();
  }

  formatAmount() {

    const currency = this.form.get(FccGlobalConstant.CURRENCY).value?.label;
    const val = this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value;
    let valueupdated;
    if (val) {
      valueupdated = this.commonService.replaceCurrency(val);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), currency);
      this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).setValue(valueupdated);
      this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).updateValueAndValidity();
      this.changeFieldsMap.set(FccConstants.FCM_PAYMENT_AMOUNT, valueupdated);
    }
  }

  onClickAmount() {
    this.OnClickAmtFieldHandler(FccConstants.FCM_PAYMENT_AMOUNT);
    this.form.addFCCValidators(
      'amount',
      Validators.pattern(this.commonService.getRegexBasedOnlanguage()),
      0
    );
    this.validateEnableSave();
  }

  onFocusAmount() {
    this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).clearValidators();
  }

  onBlurAmount() {
    const currency = this.form.get(FccGlobalConstant.CURRENCY).value.label;
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_AMOUNT)) &&
      this.currencyConverterPipe.transform(this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value.toString(), currency) !==
    this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_AMOUNT)
    && !this.updateClicked) {
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false || this.checkForUpdateButton();
    }
    this.updateBeneLimitMap();
    const amtdecimalVal = this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value;
    if (this.commonService.isnonEMptyString(amtdecimalVal)) {
      let validationError = null;
      const productMinLimit = this.form.get(FccConstants.FCM_PRODUCT_TYPE).value.perProductMinLimit;
      const productMaxLimit = this.form.get(FccConstants.FCM_PRODUCT_TYPE).value.perProductMaxLimit;
      const formatedMinLimit = this.commonService.isnonEMptyString(productMinLimit) ?
        this.currencyConverterPipe.transform(productMinLimit.toString(), currency) : '';
      const formatedMaxLimit = this.commonService.isnonEMptyString(productMaxLimit) ?
        this.currencyConverterPipe.transform(productMaxLimit.toString(), currency) : '';
      const productName = this.form.get(FccConstants.FCM_PRODUCT_TYPE).value.label;
      const transactionCount = this.form.get(FCMPaymentsConstants.PAYMENT_NO_OF_TRANSACTIONS).value;
      const transactionAmount = this.form.get(FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT).value;
      this.setAmountOriginalValue(FccConstants.FCM_PAYMENT_AMOUNT);
      const balanceDetail = this.balanceTransactionDetails();
      const beneBalAmt = this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceAmt;
      const beneTnxCntBalance = this.beneLimitMap.get(this.beneNameAndCodeVal?.label)?.balanceTxnNo;
      if (this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value &&
        (this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value <= FccGlobalConstant.ZERO)) {
        validationError = { amountCanNotBeZero: true };
        this.paymentAmountAddFCCValidation(validationError);
      } else if (amtdecimalVal < productMinLimit || amtdecimalVal > productMaxLimit) {
        if (this.commonService.isnonEMptyString(currency)) {
          validationError = {
            amountLimitPerProdType:
            {
              currency: currency, productMinLimit: formatedMinLimit, productMaxLimit: formatedMaxLimit
              , productName: productName
            }
          };
        } else {
          validationError = { selectCurrency: true };
        }
        this.paymentAmountAddFCCValidation(validationError);
      } else if (this.zeroProofingFlag && balanceDetail.balanceAmount <
        this.commonService.convertCurrencyFormatStrToFloat(amtdecimalVal) &&
        balanceDetail.balanceTransaction > 0 &&
        this.commonService.isnonEMptyString(transactionCount) &&
        this.commonService.isnonEMptyString(transactionAmount)) {
        validationError = {
          balanceAmtLessThanInstrumentAmount: { balanceTransactionAmount: balanceDetail.balanceAmount }
        };
        this.paymentAmountAddFCCValidation(validationError);
      } else if (this.zeroProofingFlag && balanceDetail.balanceTransaction > 1
        && balanceDetail.balanceAmount === this.commonService.convertCurrencyFormatStrToFloat(amtdecimalVal)) {
        validationError = {
          balanceAmtError: { balanceTransactionAmount: balanceDetail.balanceAmount }
        };
        this.paymentAmountAddFCCValidation(validationError);
      } else if (this.form.get(FccConstants.BATCH_ADHOC_FLAG).value !== FccConstants.BATCH_PAYMENT_ADHOC_FLOW &&
      beneBalAmt !== -1 && this.commonService.convertCurrencyFormatStrToFloat(amtdecimalVal) > beneBalAmt) {
        validationError = {
          beneAmtLimitExceeds: true
        };
        this.paymentAmountAddFCCValidation(validationError);
      } else if (this.form.get(FccConstants.BATCH_ADHOC_FLAG).value !== FccConstants.BATCH_PAYMENT_ADHOC_FLOW &&
      beneTnxCntBalance !== -1 && beneTnxCntBalance <= 0) {
        validationError = {
          beneTnxLimitExceeds: true
        };
        this.paymentAmountAddFCCValidation(validationError);
      } else {
        if(this.operation !== FCMPaymentsConstants.MODIFY_BATCH){
          this.updateAmountControlLength(FccConstants.FCM_PAYMENT_AMOUNT);
        }
        this.setAmountLengthValidator(FccConstants.FCM_PAYMENT_AMOUNT);
        this.formatAmount();
      }
    }
    if (!this.commonService.isnonEMptyString(amtdecimalVal)) {
      this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).setValue(amtdecimalVal);
      this.setAmountOriginalValue(FccConstants.FCM_PAYMENT_AMOUNT);
      this.paymentAmountAddFCCValidation({ required: true });
    }
    if (this.form.get(FccConstants.BATCH_ADHOC_FLAG).value === FccConstants.BATCH_PAYMENT_ADHOC_FLOW) {
      const paymentproductType = this.form.get(FccConstants.FCM_PRODUCT_TYPE).value.label;
      for (let i = 0; i < this.productTypeArray.length; i++) {
        if (paymentproductType === this.productTypeArray[i].label) {
          const legalEntityAmt = this.productTypeArray[i].value.legalEntityAmt;
          const amount = Number(this.commonService.removeAmountFormatting(
          this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value).split('.')[0]);
          if (legalEntityAmt > FccGlobalConstant.ZERO && amount >= legalEntityAmt) {
            this.form.get(FccConstants.ADDITIONAL_INFORMATION).setValue(FccGlobalConstant.CODE_Y);
            this.onClickAdditionalInformation();
            this.form.get(FccConstants.FCM_RECEIVER_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
            this.onClickReceiverType();
          } else {
            this.form.get(FccConstants.FCM_LEI_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
            //this.form.get(FccConstants.FCM_LEI_CODE).setValue(null);
            this.resetValidation(this.form, FccConstants.FCM_RECEIVER_TYPE);
            this.form.get(FccConstants.FCM_LEI_CODE).updateValueAndValidity();
            this.form.get(FccConstants.FCM_RECEIVER_TYPE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
            //this.form.get(FccConstants.FCM_RECEIVER_TYPE).setValue(null);
            this.resetValidation(this.form, FccConstants.FCM_LEI_CODE);
            this.form.get(FccConstants.FCM_RECEIVER_TYPE).updateValueAndValidity();
            this.form.get(FccConstants.ADDITIONAL_INFORMATION).setValue(FccGlobalConstant.CODE_N);
            this.checkAdditionalFieldExist();
            this.onClickAdditionalInformation();
          }
        }
      }
    } else {
      const paymentproductType = this.form.get(FccConstants.FCM_PRODUCT_TYPE).value.label;
      for (let i = 0; i < this.productTypeArray.length; i++) {
        if (paymentproductType === this.productTypeArray[i].label) {
          const legalEntityAmt = this.productTypeArray[i].value.legalEntityAmt;
          const amount = Number(this.commonService.removeAmountFormatting(
          this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value).split('.')[0]);
          if (legalEntityAmt > FccGlobalConstant.ZERO && amount >= legalEntityAmt &&
            this.form.get(FccConstants.FCM_RECEIVER_TYPE).value === FccConstants.RECEIVER_TYPE_CORPORATE
            && this.commonService.isEmptyValue(this.form.get(FccConstants.FCM_LEI_CODE).value)) {
              const currency = this.form.get(FccGlobalConstant.CURRENCY).value.label;
              const formattedLegalEntityAmt = this.currencyConverterPipe.transform(legalEntityAmt.toString(), currency);
              const validationError = {
                leiAlertMessage:
                {
                  legalEntityAmt : formattedLegalEntityAmt
                }
              };
              this.addFccValidation(validationError, FccConstants.FCM_PAYMENT_AMOUNT);
            }
        }
      }
    }
    this.validateEnableSave();
    this.validateEnableUpdate();
  }

  checkAdditionalFieldExist(){
    const debitNarration = this.form.get(FCMPaymentsConstants.DEBIT_NARRATION).value;
    const creditNarration = this.form.get(FCMPaymentsConstants.CREDIT_NARRATION).value;
    const emialid = this.form.get(FCMPaymentsConstants.EMAILID).value;
    const mobileNumber = this.form.get(FccConstants.FCM_MOBILE_NUMBER).value;
    const leiCode = this.form.get(FccConstants.FCM_LEI_CODE).value;
    const customerRefNo = this.form.get(FCMPaymentsConstants.CUSTOMER_REFERENCE_NUMBER).value;
    const receiverType = this.form.get(FccConstants.FCM_RECEIVER_TYPE).value;
    if(debitNarration || creditNarration || emialid || mobileNumber || leiCode || customerRefNo || receiverType){
      this.form.get(FccConstants.ADDITIONAL_INFORMATION).setValue(FccGlobalConstant.CODE_Y);
      this.onClickAdditionalInformation();
    }
  }

  paymentAmountAddFCCValidation(validationError){
    if(this.commonService.isNonEmptyValue(validationError)){
      this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).clearValidators();
      this.form.addFCCValidators(FccConstants.FCM_PAYMENT_AMOUNT, Validators.compose([() => validationError]), 0);
      this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).updateValueAndValidity();
    }
  }

  addFccValidation(validationError, validationField:string){
    if(this.commonService.isNonEmptyValue(validationError)){
      this.form.get(validationField).clearValidators();
      this.form.addFCCValidators(validationField, Validators.compose([() => validationError]), 0);
      this.form.get(validationField).updateValueAndValidity();
    }
  }

  clearValidators(validationField:string){
    this.form.get(validationField).clearValidators();
  }

  onClickAccountType(){
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_ACCOUNT_TYPE)) &&
      this.form.get(FccConstants.FCM_PAYMENT_ACCOUNT_TYPE).value !==
    this.changeFieldsMap.get(FccConstants.FCM_PAYMENT_ACCOUNT_TYPE)){
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    this.validateEnableUpdate();
    this.changeFieldsMap.set(FccConstants.FCM_PAYMENT_ACCOUNT_TYPE,this.form.get(FccConstants.FCM_PAYMENT_ACCOUNT_TYPE).value);
    this.form.get(FCMPaymentsConstants.CREDITOR_ACCOUNT_TYPE).setValue(this.form.get(FccConstants.FCM_PAYMENT_ACCOUNT_TYPE).value.label);
  }

  onBlurCustomerReferenceNumber(){
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_CUSTOMER_REF)) &&
      this.form.get(FccConstants.FCM_CUSTOMER_REF).value !==
    this.changeFieldsMap.get(FccConstants.FCM_CUSTOMER_REF)){
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    this.validateEnableUpdate();
    this.changeFieldsMap.set(FccConstants.FCM_CUSTOMER_REF,this.form.get(FccConstants.FCM_CUSTOMER_REF).value);

  }

  resetValidation(form, id) {
    form.get(id).setErrors(null);
    form.get(id).markAsUntouched();
    form.get(id).markAsPristine();
    form.get(id).clearValidators();
  }

  onClickReceiverType(){
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_RECEIVER_TYPE)) &&
      this.form.get(FccConstants.FCM_RECEIVER_TYPE).value !==
    this.changeFieldsMap.get(FccConstants.FCM_RECEIVER_TYPE)){
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    if (this.form.get(FccConstants.FCM_RECEIVER_TYPE).value === FccConstants.RECEIVER_TYPE_CORPORATE) {
      this.form.get(FccConstants.FCM_LEI_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      if (this.form.get(FccConstants.BATCH_ADHOC_FLAG).value === FccConstants.BATCH_PAYMENT_ADHOC_FLOW) {
        this.form.get(FccConstants.FCM_LEI_CODE).enable();
        const paymentproductType = this.form.get(FccConstants.FCM_PRODUCT_TYPE).value.label;
        for (let i = 0; i < this.productTypeArray.length; i++) {
          if (paymentproductType === this.productTypeArray[i].label) {
            const legalEntityAmt = this.productTypeArray[i].value.legalEntityAmt;
            const amount = Number(this.commonService.removeAmountFormatting(
              this.form.get(FccConstants.FCM_PAYMENT_AMOUNT).value).split('.')[0]);
            if (legalEntityAmt > FccGlobalConstant.ZERO && amount >= legalEntityAmt) {
              this.form.get(FccConstants.FCM_LEI_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
              this.form.get(FccConstants.FCM_LEI_CODE).setValidators(Validators.required);
            }
          }
        }
      }
    } else if (this.form.get(FccConstants.FCM_RECEIVER_TYPE).value === FccConstants.RECEIVER_TYPE_INDIVIDUAL) {
      this.form.get(FccConstants.FCM_LEI_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.FCM_LEI_CODE).setValue(null);
      this.resetValidation(this.form, FccConstants.FCM_LEI_CODE);
      this.form.get(FccConstants.FCM_LEI_CODE).disable();
      this.form.updateValueAndValidity();
    }
    this.changeFieldsMap.set(FccConstants.FCM_RECEIVER_TYPE,this.form.get(FccConstants.FCM_RECEIVER_TYPE).value);
    this.validateEnableSave();
    this.validateEnableUpdate();
  }

  onBlurLeiCode(){
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_LEI_CODE)) &&
      this.form.get(FccConstants.FCM_LEI_CODE).value !==
    this.changeFieldsMap.get(FccConstants.FCM_LEI_CODE)){
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    const leiCode = this.form.get(FccConstants.FCM_LEI_CODE).value;
    const leiCodeRegex = new RegExp(FccGlobalConstant.LEI_CODE_PATTERN);
    const checkLeiCode = leiCodeRegex.test(leiCode);
    if ((this.commonService.isnonEMptyString(leiCode) && leiCode.length !== 20) || !checkLeiCode) {
      this.form.get(FccConstants.FCM_LEI_CODE).setErrors({ leiCodeError: true });
    }
    this.changeFieldsMap.set(FccConstants.FCM_LEI_CODE,this.form.get(FccConstants.FCM_LEI_CODE).value);
    this.validateEnableUpdate();
    this.validateEnableSave();
  }
  onBlurEmailID(){
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_EMAIL_ID)) &&
    this.form.get(FccConstants.FCM_EMAIL_ID).value !== this.changeFieldsMap.get(FccConstants.FCM_EMAIL_ID)){
      this.updateEmailValidity();
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    this.validateEnableSave();
    this.validateEnableUpdate();
    this.changeFieldsMap.set(FccConstants.FCM_EMAIL_ID,this.form.get(FccConstants.FCM_EMAIL_ID).value);
  }

  onFocusEmailID(){
    this.form.get(FccConstants.FCM_EMAIL_ID).clearValidators();
    this.form.get(FccConstants.FCM_EMAIL_ID).updateValueAndValidity();
  }

  onBlurMobileNumber(){
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_MOBILE_NUMBER)) &&
      this.form.get(FccConstants.FCM_MOBILE_NUMBER).value !==
    this.changeFieldsMap.get(FccConstants.FCM_MOBILE_NUMBER)){
      this.updateMobileNumberValidity();
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    this.checkMobileNumberLength();
    this.validateEnableSave();
    this.validateEnableUpdate();
    this.changeFieldsMap.set(FccConstants.FCM_MOBILE_NUMBER,this.form.get(FccConstants.FCM_MOBILE_NUMBER).value);
  }

  checkMobileNumberLength(){
    const mobileControl = this.form.get(FccConstants.FCM_MOBILE_NUMBER);
    const min = mobileControl[FccGlobalConstant.PARAMS][FccGlobalConstant.MINLENGTH];
    if (mobileControl.value.length < min && mobileControl.value.length > 0) {
      mobileControl.setErrors({ mobileMinError: { min: min } });
    }
  }

  onClickMobileNumber(){
    this.updateMobileNumberValidity();
  }

  onFocusMobileNumber(){
    this.form.get(FccConstants.FCM_MOBILE_NUMBER).clearValidators();
    this.form.get(FccConstants.FCM_MOBILE_NUMBER).updateValueAndValidity();
  }

  onBlurDebitNarration(){
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_DEBIT_NARRATION)) &&
      this.form.get(FccConstants.FCM_DEBIT_NARRATION).value !==
    this.changeFieldsMap.get(FccConstants.FCM_DEBIT_NARRATION)){
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    this.validateEnableUpdate();
    this.changeFieldsMap.set(FccConstants.FCM_DEBIT_NARRATION,this.form.get(FccConstants.FCM_DEBIT_NARRATION).value);

  }

  onBlurCreditNarration(){
    if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.FCM_CREDIT_NARRATION)) &&
      this.form.get(FccConstants.FCM_CREDIT_NARRATION).value !==
    this.changeFieldsMap.get(FccConstants.FCM_CREDIT_NARRATION)){
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    this.validateEnableUpdate();
    this.changeFieldsMap.set(FccConstants.FCM_CREDIT_NARRATION,this.form.get(FccConstants.FCM_CREDIT_NARRATION).value);

  }

  onBlurAccountNumber(){
if (this.commonService.isnonEMptyString(this.changeFieldsMap.get(FccConstants.ACCOUNT_NUMBER)) &&
  this.form.get(FccConstants.ACCOUNT_NUMBER).value !==
    this.changeFieldsMap.get(FccConstants.ACCOUNT_NUMBER)){
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    this.changeFieldsMap.set(FccConstants.ACCOUNT_NUMBER,this.form.get(FccConstants.ACCOUNT_NUMBER).value);
    if(!this.checkAccountNumberMatch()) {
      const validationError = {
        accountNumberMismatch: true
      };
      this.addFccValidation(validationError, FccConstants.FCM_CONFIRM_ACCONT_NO);
    } else {
      this.form.get(FccConstants.FCM_CONFIRM_ACCONT_NO).setErrors(null);
      this.form.get(FccConstants.FCM_CONFIRM_ACCONT_NO).clearValidators();
      this.form.get(FccConstants.FCM_CONFIRM_ACCONT_NO).updateValueAndValidity();
    }
    this.form.updateValueAndValidity();
    this.validateEnableSave();
    this.validateEnableUpdate();
  }

  onBlurConfirmAccountNumber(){
    if(!this.checkAccountNumberMatch()) {
      const validationError = {
        accountNumberMismatch: true
      };
      this.addFccValidation(validationError, FccConstants.FCM_CONFIRM_ACCONT_NO);
    } else {
      this.form.get(FccConstants.FCM_CONFIRM_ACCONT_NO).setErrors(null);
      this.form.get(FccConstants.FCM_CONFIRM_ACCONT_NO).clearValidators();
      this.form.get(FccConstants.FCM_CONFIRM_ACCONT_NO).updateValueAndValidity();
    }
    this.form.updateValueAndValidity();
    this.validateEnableUpdate();
    this.validateEnableSave();
  }

  ngOnDestroy() {
    this.batchRefId = null;
    this.changeinAmtAndTransField = false;
    this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT, this.paymentTransactionAmtRemoveFormat());
    this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION, this.paymentNoOfTransactionReplaceChars());
    this.commonService.batchAmtTransactionSubject$.next(this.changefiledOfAmtAndTransMap);
    this.subscriptionForAutosave.forEach(subs => subs.unsubscribe());
    this.subscriptions.forEach(subs => subs.unsubscribe());
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      this.editBatchSubscription.unsubscribe();
      this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT,null);
      this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION,null);
      this.commonService.batchAmtTransactionSubject$.next(this.changefiledOfAmtAndTransMap);
    }
    this.commonService.paymentBatchBalanceValidation.next(false);
    this.commonService.batchDiscardInstrument.next(-1);
    this.commonService.batchEditSubmitFlag.next(null);
    this.commonService.batchAddSubmitFlag.next(null);
    this.commonService.batchTransactionBalance.next(null);
    this.commonService.batchInstrumntCancelFlag.next(false);
    this.commonService.displayRemarks.next(null);
    this.commonService.batchEditInstrument.next(null);
    this.stateService.autosaveProductCode = '';
    this.changeToasterStyle(false);
}

  updateEmailValidity(){
    if (this.form.get(FccConstants.FCM_EMAIL_ID)[FccGlobalConstant.PARAMS][FccGlobalConstant.MULTI_VALUE_LIMIT]==0) {
      this.subscriptions.push(
        this.commonService.getConfiguredValues('BENEFICIARY_EMAIL_LIMIT')
          .subscribe(resp => {
            if(resp && resp?.BENEFICIARY_EMAIL_LIMIT) {
              this.form.get(FccConstants.FCM_EMAIL_ID)[FccGlobalConstant.PARAMS][FccGlobalConstant.MULTI_VALUE_LIMIT]
              = parseInt(resp.BENEFICIARY_EMAIL_LIMIT, 10);
              this.form.get(FccConstants.FCM_EMAIL_ID).clearValidators();
              this.form.addFCCValidators(FccConstants.FCM_EMAIL_ID, Validators.compose([Validators.compose([multipleEmailValidation])]), 0);
              this.form.get(FccConstants.FCM_EMAIL_ID).updateValueAndValidity();
            }
          }
        )
      );
    } else {
      this.form.get(FccConstants.FCM_EMAIL_ID).clearValidators();
      this.form.addFCCValidators(FccConstants.FCM_EMAIL_ID, Validators.compose([Validators.compose([multipleEmailValidation])]), 0);
      this.form.get(FccConstants.FCM_EMAIL_ID).updateValueAndValidity();
    }
  }

  updateMobileNumberValidity() {
    this.form.get(FccConstants.FCM_MOBILE_NUMBER).clearValidators();
    this.form.addFCCValidators(
      FccConstants.FCM_MOBILE_NUMBER,
      Validators.pattern(this.mobileNumberRegex),
      0
    );
    this.form.get(FccConstants.FCM_MOBILE_NUMBER).updateValueAndValidity();
  }

  cloneAbstractControl<T extends AbstractControl>(control: T): T {
    let newControl: T;
    if (control instanceof UntypedFormGroup) {
      const formGroup = new UntypedFormGroup({}, control.validator, control.asyncValidator);
      const controls = control.controls;
      Object.keys(controls).forEach(key => {
        formGroup.addControl(key, this.cloneAbstractControl(controls[key]));
      });
      newControl = formGroup as any;
    }
    else if (control instanceof UntypedFormArray) {
      const formArray = new UntypedFormArray([], control.validator, control.asyncValidator);
      control.controls.forEach(formControl => formArray.push(this.cloneAbstractControl(formControl)));
      newControl = formArray as any;
    }
    else if (control instanceof UntypedFormControl) {
      newControl = new UntypedFormControl(control.value, control.validator, control.asyncValidator) as any;
      newControl[FccConstants.KEY] = control[FccConstants.KEY];
      newControl[FccConstants.OPTIONS] = control[FccConstants.OPTIONS];
      newControl[FccConstants.PARAMS] = control[FccConstants.PARAMS];
      newControl[FccConstants.SECTION_HEADER] = control[FccConstants.SECTION_HEADER];
      newControl[FccConstants.TYPE] = control[FccConstants.TYPE];
    }
    else {
      throw new Error('Error: unexpected control value');
    }
    if (control.disabled) {
      newControl.disable({ emitEvent: false });
    }
    return newControl;
  }

  transactionsDetailUpdate(updateFlag?: boolean){
    let transactionCount = this.form?.get(FCMPaymentsConstants.PAYMENT_NO_OF_TRANSACTIONS)?.value;
    let transactionAmount = this.form?.get(FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT)?.value;

    let balanceValidatonMessage = '';
    let balanceValidatonMessageEditpg = '';
    let currencyValue = this.form?.get(FccConstants.FCM_CURRENCY)?.value;
    currencyValue = this.commonService.isnonEMptyString(currencyValue) ? currencyValue.label : FccConstants.FCM_ISO_CODE;
    if (this.commonService.isnonEMptyString(transactionCount) && this.commonService.isnonEMptyString(transactionAmount)
    && this.zeroProofingFlag) {
      transactionAmount = this.commonService.replaceCurrency(transactionAmount);
      transactionAmount = this.currencyConverterPipe.transform(transactionAmount.toString(),
        FccConstants.FCM_ISO_CODE);
      this.form.get(FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT).setValue(transactionAmount);
      const balanceDetail = this.balanceTransactionDetails(updateFlag);
      let balanceAmountCurrency = balanceDetail.balanceAmount.toString();
      const balanceTransaction = (balanceDetail.balanceTransaction >= 0) ? balanceDetail.balanceTransaction.toString() : '0';
      balanceAmountCurrency = this.commonService.replaceCurrency(balanceAmountCurrency);
      balanceAmountCurrency = this.currencyConverterPipe.transform(balanceAmountCurrency.toString(),
        FccConstants.FCM_ISO_CODE);
      balanceAmountCurrency = (balanceDetail.balanceAmount >= 0) ? balanceAmountCurrency : '0';
      if (localStorage.getItem(FccGlobalConstant.CUR_SYMBOL_ENABLED) === 'y') {
        balanceAmountCurrency = this.commonService.getCurrencySymbol(currencyValue, balanceAmountCurrency);
      }
      this.form.get(FCMPaymentsConstants.BALANCE_NO_OF_TRANSACTION).setValue(balanceTransaction);
      this.form.get(FCMPaymentsConstants.BALANCE_TRANSACTION_AMOUNT).setValue(balanceAmountCurrency);
      transactionAmount = this.commonService.removeAmountFormatting(transactionAmount);
      transactionAmount = this.commonService.convertCurrencyFormatStrToFloat(transactionAmount);
      transactionCount = this.commonService.convertCurrencyFormatStrToFloat(transactionCount);

      if(transactionCount >= balanceDetail.balanceTransaction && balanceDetail.balanceTransaction!=0
        && transactionAmount >= balanceDetail.balanceAmount && balanceDetail.balanceAmount!=0 &&
        (this.operation === FCMPaymentsConstants.MODIFY_BATCH ||
        this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]?.length > 0)){
        balanceValidatonMessage = `${this.translateService.instant('balanceAmountAndTransactionValid')}`;
        balanceValidatonMessageEditpg = balanceValidatonMessage;
        this.commonService.paymentBatchBalanceValidation.next(true);
        this.commonService.isNextEnabled.next(false);
      }else if(transactionCount >= balanceDetail.balanceTransaction && balanceDetail.balanceTransaction!=0 &&
        (this.operation === FCMPaymentsConstants.MODIFY_BATCH ||
        this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]?.length > 0)
        || this.isTrashIconTriggered){
        this.isTrashIconTriggered = false;
        balanceValidatonMessage = `${this.translateService.instant('balanceTransactionValid')}`;
        balanceValidatonMessageEditpg = balanceValidatonMessage;
        this.commonService.paymentBatchBalanceValidation.next(true);
        this.commonService.isNextEnabled.next(false);
      }else if(transactionAmount >= balanceDetail.balanceAmount && balanceDetail.balanceAmount!=0 &&
        (this.operation === FCMPaymentsConstants.MODIFY_BATCH
        || this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]?.length > 0)
        || this.isTrashIconTriggered){
        this.isTrashIconTriggered = false;
        balanceValidatonMessage = `${this.translateService.instant('balanceAmountValid')}`;
        balanceValidatonMessageEditpg = balanceValidatonMessage;
        this.commonService.paymentBatchBalanceValidation.next(true);
        this.commonService.isNextEnabled.next(false);
      } else {
        balanceValidatonMessage = "";
        balanceValidatonMessageEditpg = "";
        this.commonService.isNextEnabled.next(true);
        this.commonService.paymentBatchBalanceValidation.next(false);
      }
      if(this.operation === FCMPaymentsConstants.MODIFY_BATCH &&
        balanceDetail.balanceAmount <= 0 && balanceDetail.balanceTransaction <= 0){
        this.form.get('balanceAmtTrnValidMsg')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS]['warning']
        = balanceValidatonMessage;
      if(!this.editBalanceDetails && this.operation === FCMPaymentsConstants.MODIFY_BATCH &&
        this.commonService.isnonEMptyString(balanceValidatonMessageEditpg)){
        this.form.get('balanceAmtTrnValidMsg')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('balanceAmtTrnValidMsg').setValue(balanceValidatonMessageEditpg);
      }
    } else {
      let totalAmount = (this.counterTransaction.length) > 0 ?
      this.counterTransaction.reduce((currentItem,previousItem)=>currentItem + previousItem) : 0;
      if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
        totalAmount = this.paymentDetailsResponse?.data?.paymentHeader?.controlSum;
        if (this.editBalanceDetails){
          totalAmount = this.commonService.convertCurrencyFormatStrToFloat(totalAmount) - 
          this.commonService.convertCurrencyFormatStrToFloat(this.commonService.removeAmountFormatting(this.form.get('amount').value));
        }
        if (this.editBalanceDetails && this.cancelEditedBalanceDetails){
          this.commonService.convertCurrencyFormatStrToFloat(totalAmount) +  
          this.commonService.convertCurrencyFormatStrToFloat(this.commonService.removeAmountFormatting(this.form.get('amount').value));
        }
      }
      let totalAmtCurrency = totalAmount.toString();
      totalAmtCurrency = this.commonService.replaceCurrency(totalAmtCurrency);
      let totalAmountCurrency = this.currencyConverterPipe.transform(totalAmtCurrency.toString(),
      FccConstants.FCM_ISO_CODE);
      if (localStorage.getItem(FccGlobalConstant.CUR_SYMBOL_ENABLED) === 'y') {
        totalAmountCurrency = this.commonService.getCurrencySymbol(currencyValue, totalAmountCurrency);
      }
      if(this.operation !== FCMPaymentsConstants.MODIFY_BATCH) {
      this.form.get(FCMPaymentsConstants.COUNTER_NO_OF_TRANSACTION).setValue(this.counterTransaction.length);
      if (this.counterTransaction.length.toString() !== FccGlobalConstant.ZERO_STRING) {
        this.form.get(FCMPaymentsConstants.PAYMENT_NO_OF_TRANSACTIONS).setValue(this.counterTransaction.length.toString());
      } else {
        this.form.get(FCMPaymentsConstants.PAYMENT_NO_OF_TRANSACTIONS).setValue(null);
      }
    } else {
      let totalNumberOfTransaction = this.paymentDetailsResponse?.data?.paymentHeader?.controlTotal;
      if (this.editBalanceDetails){
        totalNumberOfTransaction = totalNumberOfTransaction - 1;
      }
      if (this.editBalanceDetails && this.cancelEditedBalanceDetails) {
        totalNumberOfTransaction = totalNumberOfTransaction + 1;
        this.editBalanceDetails = false;
        this.cancelEditedBalanceDetails = false;
      }
      this.form.get(FCMPaymentsConstants.COUNTER_NO_OF_TRANSACTION).setValue(totalNumberOfTransaction);
      this.form.get(FCMPaymentsConstants.PAYMENT_NO_OF_TRANSACTIONS).setValue(totalNumberOfTransaction.toString());
    }
      this.form.get(FCMPaymentsConstants.COUNTER_TRANSACTION_AMOUNT).setValue(totalAmountCurrency);
      if (totalAmtCurrency.toString() !== FccGlobalConstant.ZERO_STRING) {
        this.form.get(FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT).setValue(
          this.currencyConverterPipe.transform(totalAmtCurrency.toString(),
        FccConstants.FCM_ISO_CODE).toString());
      } else {
        this.form.get(FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT).setValue(null);
      }
      this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS]['warning'] = "";
      this.commonService.paymentBatchBalanceValidation.next(false);
    }
  }


  counterTransactionListUpdate(instrumentAmount, index:number=-1, updateFlag?: boolean){
    instrumentAmount = this.balanceTransactionFormat(instrumentAmount);
    if(index >= 0){
      this.counterTransaction.splice(index, 0, instrumentAmount);
    }else{
      this.counterTransaction.push(instrumentAmount);
    }
    this.transactionsDetailUpdate(updateFlag);
    this.transactionDetailsRender();
  }

  transactionDetailsRender(){
    const transactionCount = this.form.get(FCMPaymentsConstants.PAYMENT_NO_OF_TRANSACTIONS).value;
    const transactionAmount = this.form.get(FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT).value;
    const addPayButton = this.form.get(FCMPaymentsConstants.ADD_PAYMENT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED];
    this.form.get("balanceSpacer")[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    const gridData = this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA];
    this.form.get(FCMPaymentsConstants.COUNTER_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FCMPaymentsConstants.COUNTER_TRANSACTION_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FCMPaymentsConstants.BALANCE_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FCMPaymentsConstants.BALANCE_TRANSACTION_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    const paymentTableLength = this.paymentDetailsResponse?.data?.paymentHeader?.controlTotal -
      this.paymentDetailsResponse?.data?.paymentHeader?.remainingCount;
    if (this.zeroProofingFlag && this.commonService.isnonEMptyString(transactionCount) &&
          this.commonService.isnonEMptyString(transactionAmount)) {
      if (gridData.length > 0 || paymentTableLength > 0) {
        if (!addPayButton || this.editRecordIndex > -1) {
          this.form.get("balanceSpacer")[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        }
        this.form.get(FCMPaymentsConstants.BALANCE_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FCMPaymentsConstants.BALANCE_TRANSACTION_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
    } else {
      if(gridData.length > 0 || paymentTableLength > 0){
        if (!addPayButton) {
          this.form.get("balanceSpacer")[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        }
        this.form.get(FCMPaymentsConstants.COUNTER_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FCMPaymentsConstants.COUNTER_TRANSACTION_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
    }
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      if (this.zeroProofingFlag) {
        if (!addPayButton || this.editRecordIndex > -1) {
          this.form.get("balanceSpacer")[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        }
        this.form.get(FCMPaymentsConstants.BALANCE_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FCMPaymentsConstants.BALANCE_TRANSACTION_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        if (!addPayButton) {
          this.form.get("balanceSpacer")[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        }
        this.form.get(FCMPaymentsConstants.COUNTER_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FCMPaymentsConstants.COUNTER_TRANSACTION_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
    }
  }

  balanceTransactionDetails(updateFlag?: boolean){
    const balanceDetail = { "balanceTransaction" : 0, "balanceAmount": 0 };
    const gridData =this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA];
    let transactionCount = this.form.get(FCMPaymentsConstants.PAYMENT_NO_OF_TRANSACTIONS).value;
    let transactionAmount = this.form.get(FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT).value;
    transactionCount = this.commonService.isnonEMptyString(transactionCount) ? transactionCount : 0;
    transactionAmount = this.commonService.isnonEMptyString(transactionAmount) ? transactionAmount : 0;
    if (transactionAmount > 0) {
      transactionAmount = this.commonService.removeAmountFormatting(transactionAmount);
    }
    let balanceTotal = transactionCount;
    let balanceAmount = this.balanceTransactionFormat(transactionAmount);
    const paymentTableLength = this.paymentDetailsResponse?.data?.paymentHeader?.controlTotal -
    this.paymentDetailsResponse?.data?.paymentHeader?.remainingCount;
    if(gridData.length==0 && paymentTableLength == 0){
      this.counterTransaction = [];
    }
    if(this.counterTransaction.length > 0){
      balanceTotal = (transactionCount > 0) ? transactionCount - this.counterTransaction.length : 0;
      balanceAmount = (balanceAmount > 0) ? balanceAmount - this.counterTransaction.reduce(
        (currentItem,previousItem)=>currentItem + previousItem) : 0;
      balanceAmount = Math.round(balanceAmount * FccGlobalConstant.LENGTH_100) / FccGlobalConstant.LENGTH_100;
    }
    if(this.discardedInstrument ||
      (this.paymentDetailsResponse && !updateFlag && !(balanceAmount > 0))) {
      balanceDetail.balanceTransaction = this.paymentDetailsResponse?.data?.paymentHeader?.remainingCount;
      balanceDetail.balanceAmount = this.paymentDetailsResponse?.data?.paymentHeader?.remainingAmount;
      this.discardedInstrument = false;
    } else if (this.paymentDetailsResponse && this.operation === FCMPaymentsConstants.MODIFY_BATCH) {
      let balanceTransaction = this.paymentDetailsResponse?.data?.paymentHeader?.remainingCount;
      let balanceAmount = this.paymentDetailsResponse?.data?.paymentHeader?.remainingAmount;
      if (this.zeroProofingFlag && this.editBalanceDetails) {
        balanceTransaction = balanceTransaction + 1;
        balanceAmount = this.commonService.convertCurrencyFormatStrToFloat(balanceAmount) + 
        this.commonService.convertCurrencyFormatStrToFloat(this.commonService.removeAmountFormatting(this.form.get('amount').value));
      }
      if (this.zeroProofingFlag && this.editBalanceDetails && this.cancelEditedBalanceDetails) {
        balanceTransaction = balanceTransaction - 1;
        balanceAmount = this.commonService.convertCurrencyFormatStrToFloat(balanceAmount) - 
        this.commonService.convertCurrencyFormatStrToFloat(this.commonService.removeAmountFormatting(this.form.get('amount').value));
        this.editBalanceDetails = false;
        this.cancelEditedBalanceDetails = false;
      }
      balanceDetail.balanceTransaction = balanceTransaction;
      balanceDetail.balanceAmount = balanceAmount;
    }else {
      balanceDetail.balanceTransaction = balanceTotal;
      balanceDetail.balanceAmount = balanceAmount;
    }
    this.commonService.balanceDetail = balanceDetail;
    this.commonService.batchTransactionBalance.next(balanceDetail);
    return balanceDetail;
  }

  disableTransactionField(){
    const transactionCount = this.form.get(FCMPaymentsConstants.PAYMENT_NO_OF_TRANSACTIONS);
    const transactionAmount = this.form.get(FCMPaymentsConstants.PAYMENT_TRANSACTION_AMT);

    if(this.commonService.isEmptyValue(transactionCount.value) && this.commonService.isEmptyValue(transactionAmount.value)){
      transactionCount[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      transactionAmount[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      transactionCount[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      transactionAmount[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
    }else{
      transactionCount[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      transactionAmount[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      transactionCount[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      transactionAmount[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
    }
  }

  balanceTransactionFormat(transactionAmount){
    let formatAmount = this.commonService.replaceCurrency(transactionAmount.toString());
    formatAmount = this.commonService.convertCurrencyFormatStrToFloat(formatAmount);
    return formatAmount;
  }


  getEnrichmentFields(fromViewInit = false,fromSave = false){
    if(fromViewInit){
      this.valMap.set(FccConstants.FCM_PAYMENT_PACKAGES,null);
    }
    let packageName ;
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      packageName = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES)?.value;
    }else{
      packageName = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES)?.value?.label;
    }

    const prepackageName = this.valMap.get(FccConstants.FCM_PAYMENT_PACKAGES);
    if (this.commonService.isEmptyValue(prepackageName) || (prepackageName.label !== packageName || this.loadEnrichDataAutoSaveFlag) ) {
    let filterParams: any = {};
    filterParams.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode ?
    this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode : this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value;
    filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
    this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
    filterParams = JSON.stringify(filterParams);
    this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD,false);
    if(!fromViewInit){
      this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD,false);
    }
    this.subscriptions.push(
      this.commonService.getExternalStaticDataList(FccConstants.FCM_ENRICHMENT_BY_PACKAGE, filterParams).subscribe(response => {
        if(response && !this.commonService.isObjectEmpty(response)) {
          // radio buttons changes
          Object.keys(response).forEach((key) => {
            if (response[key].type === 'input-radio') {
              let filterParams: any = {};
              filterParams.enrichmentCode = response[key].code;
              filterParams.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode ?
              this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode : this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value;
              filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
              this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
              filterParams = JSON.stringify(filterParams);
              const options = [];
              const styleClass = response[key]['options'][0]?.valueStyleClass;
              this.commonService.getExternalStaticDataList(FccConstants.FCM_ENRICHMENT_RADIO_OPTIONS, filterParams).subscribe(res => {
                if (res) {
                  res.forEach((obj) => {
                    obj['value'] = obj.option_description;
                    obj['valueStyleClass'] = styleClass;
                    options.push(obj);
                  });
                  response[key]['options'] = options;
                  response[key][FccConstants.ENRICHMENT] = true;
                  this.displayAddEnrichment = true;
                  this.enrichmentFields = response;
                  localStorage.setItem('enrichmentFields',JSON.stringify(this.enrichmentFields));
                  this.updateEnrichmentFieldName();
                  this.updateEnrichmentTypeFlag();
                  this.addFieldsInEnrichmentGroup();
                  this.updateColumnOrder();
                  if(!fromSave){
                    this.hideAllEnrichmentFields();
                  }
                  if(fromViewInit){
                    this.setRenderOnly(this.form,FCMPaymentsConstants.ADD_ENRICHMENT_FIELD,false);
                    this.setRenderOnly(this.form,FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER,true);
                    if(!fromSave){
                      this.resetEnrichmentFields();
                    }
                  }
                  this.form.updateValueAndValidity();
                  this.valMap.set(FccConstants.FCM_PAYMENT_PACKAGES,this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value);
                  if(this.loadEnrichDataAutoSaveFlag){
                    this.loadEnrichmentFieldsOnAutoSave();
                  }
                }
              });
            }
          });
          this.displayAddEnrichment = true;
          this.enrichmentFields = response;
          localStorage.setItem('enrichmentFields',JSON.stringify(this.enrichmentFields));
          this.updateEnrichmentFieldName();
          this.updateEnrichmentTypeFlag();
          this.addFieldsInEnrichmentGroup();
          this.updateColumnOrder();
          if(!fromSave){
            this.hideAllEnrichmentFields();
          }
          if(fromViewInit){
            this.setRenderOnly(this.form,FCMPaymentsConstants.ADD_ENRICHMENT_FIELD,false);
            this.setRenderOnly(this.form,FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER,true);
            if(!fromSave){
              this.resetEnrichmentFields();
            }
          }
          this.form.updateValueAndValidity();
          this.valMap.set(FccConstants.FCM_PAYMENT_PACKAGES,this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value);
          if(this.loadEnrichDataAutoSaveFlag){
            this.loadEnrichmentFieldsOnAutoSave();
          }
        } else{
          this.removeEnrichmentData();
        }
      })
    );
    }
  }

  resetAndHideEnrichmentFields(){
    this.resetEnrichmentFields();
    this.showHideEnrichmentFields(false);
  }

  updateEnrichmentFieldName(){
    this.enrichmentFieldsName = [];
    this.enrichmentSequence = [];
    this.enrichmentFieldsName = Object.keys(this.enrichmentFields);
    this.enrichmentFieldsName.forEach((val) => {
      this.enrichmentSequence.push(this.enrichmentFields[val]);
    });
    this.enrichmentSequence = this.enrichmentSequence.sort((a, b) => a.order - b.order);
    this.enrichmentFieldsName = this.enrichmentSequence.map(obj => obj.code);
  }
  updateEnrichmentTypeFlag(){
    const flag = this.enrichmentFields[this.enrichmentFieldsName[0]].typeFlag;
    if(this.commonService.isnonEMptyString(flag)){
      this.isEnrichTypeMultiple = flag === 'M';
    }
    this.paymentInstrumentProductService.setPaymentMultiset(this.isEnrichTypeMultiple);

  }
  addFieldsInEnrichmentGroup(){
    let updatedGroupHeader = '';
    this.enrichmentFieldsName.forEach((element, i) => {
      if (i === 0) {
        this.enrichmentFields[element].grouphead = FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER;
        updatedGroupHeader = element;
      } else {
        this.enrichmentFields[element].grouphead = updatedGroupHeader;
        updatedGroupHeader = element;
      }
    });
  }
  updateColumnOrder(){
    this.columnOrder = [];
    this.enrichmentFieldsName.forEach(element => {
      this.columnOrder.push({
        column : this.enrichmentFields[element].name,
        order : this.enrichmentFields[element].order,
        code : this.enrichmentFields[element].code,
        format : this.enrichmentFields[element].format });
    });
    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.COLUMNS_ORDER
    ] = this.columnOrder;
  }
  hideAllEnrichmentFields(){
    this.enrichmentFieldsName.forEach(element => {
      this.enrichmentFields[element].rendered = false;
    });
    this.setRenderOnly(this.form, FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER,false);
  }

  resetEnrichmentFields(){
    this.enrichmentFieldsName.map((value: string) => {
      const field = this.commonService.getFormElement(this.form,value);
      if(!this.commonService.isEmptyValue(field)){
        this.commonService.getFormElement(this.form,value).setValue(null);
        this.commonService.getFormElement(this.form,value).markAsUntouched();
        this.commonService.getFormElement(this.form,value).markAsPristine();
      }
    });
    this.form.updateValueAndValidity();
  }

  loadEnrichmentFieldsOnAutoSave(){
    const tableLen = this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA
    ]?.length;
    if(tableLen > 0){
      this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD,false);
      this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.LIST_DATA
      ] = true;
      if(this.isEnrichTypeMultiple){
        this.setRenderOnly(this.form,FCMPaymentsConstants.FCM_ENRICHMENT_SAVE_ADD_NEW,false);
        this.setRenderOnly(this.form,FCMPaymentsConstants.FCM_ENRICHMENT_ADD_NEW,true);
        this.setRenderOnly(this.form,FCMPaymentsConstants.FCM_ENRICHMENT_CANCEL,true);
      }
    }
    this.form.updateValueAndValidity();
    this.loadEnrichDataAutoSaveFlag = false;
  }

  resetAndHideTable(){
    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA] = [];
      this.setRenderOnly(this.form, FccConstants.ENRICHMENT_LIST_TABLE,false);
  }

  showHideEnrichmentFields(show){
    if(show){
      const field = this.form.get(this.enrichmentFieldsName[0]);
      if(this.commonService.isEmptyValue(field)){
        this.form = this.formControlService.addNewFormControlsInSequence(this.enrichmentFieldsName, this.enrichmentFields, this.form);
        this.addEnrichmentValidation();
      } else {
        Object.keys(this.enrichmentFields).forEach((field) => {
          this.commonService.getFormElement(this.form,
            field)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = this.enrichmentFields[field]?.required;
        });
      }
      this.enrichmentFieldsName.forEach(field =>{
        this.commonService.getFormElement(this.form,field).markAsUntouched();
      });
      this.setRenderOnlyFields(this.form, this.enrichmentFieldsName, show );
    } else{
      if(!this.commonService.isEmptyValue(this.enrichmentFields)){
        this.formControlService.removeFormControls(this.enrichmentFields, this.form);
      }
    }
    /*this.setRenderOnlyFields(
      this.form,
      [...FCMPaymentsConstants.ENRICHMENT_SAVE_CANCEL],
      show
    );*/
    if (this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA]?.length > 0) {
        this.setRenderOnly(this.form, FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER, true);
    }
    else if (!(this.form.get(this.enrichmentFieldsName[0]) && this.form.get(this.enrichmentFieldsName[0])[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED])) {
      this.setRenderOnly(this.form, 'addEnrichmentField', true);
    }
    this.setRenderOnly(this.form, FCMPaymentsConstants.FCM_ENRICHMENT_ADD_NEW,false);
    this.form.updateValueAndValidity();
  }

  addEnrichmentValidation(){
    this.enrichmentFieldsName.forEach(element => {
      const field = this.commonService.getFormElement(this.form,element);
      field[FccGlobalConstant.PARAMS][FccConstants.ENRICHMENT] = true;
      field.valueChanges.subscribe(() => {
        this.callAutosave();
      });
      if(!this.commonService.isEmptyValue(field)){
        if(this.enrichmentFields[element].dataType == FccGlobalConstant.TYPE_NUMERIC){
          this.form.addFCCValidators(
            element,
            Validators.compose([
              Validators.pattern(FccGlobalConstant.NUMBER_REGEX),
            ]),
            0
          );
        } else if(this.enrichmentFields[element].dataType == FccGlobalConstant.TYPE_AMOUNT){
          this.form.addFCCValidators(
            element,
            Validators.compose([
              Validators.pattern(FccGlobalConstant.AMOUNT_VALIDATION),
            ]),
            0
          );
        } else if(this.enrichmentFields[element].type == FccGlobalConstant.checkBox){
          if(this.enrichmentFields[element].required){
            field.setValue(FccGlobalConstant.CODE_Y);
            field[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
          }
        }
        this.setRequiredOnly(this.form, element, this.enrichmentFields[element].required);
      }
    });
    this.form.updateValueAndValidity();
  }

  onClickAddEnrichmentField(event, resetFlag = false) {
    this.generateEnrichmentFields();
    this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD,false);
    if (!resetFlag) {
      this.resetAndHideTable();
    }
    this.showHideEnrichmentFields(true);
    if(this.isEnrichTypeMultiple) {
      this.setRenderOnly(this.form, 'addNewEnrichment', false);
      this.setRenderOnly(this.form, 'saveEnrichment', true);
      if (this.isMandatoryEnrichmentPresent) {
        this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.setRenderOnly(this.form, 'cancelEnrichment', false);
      } else {
        this.setRenderOnly(this.form, 'cancelEnrichment', true);
      }
    }
    if(!this.isEnrichTypeMultiple){
      this.setRenderOnly(this.form, 'saveEnrichment', true);
      if (!this.isMandatoryEnrichmentPresent) {
        this.setRenderOnly(this.form, 'cancelEnrichment', true);
      }
    }
    this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
      'btndisable'
    ] = true;
    this.validateEnableSave();
  }

  generateEnrichmentFields(fromSave = false){
    let field = undefined;
    if (!this.commonService.isEmptyValue(this.enrichmentFieldsName)) {
      field = this.form.get(this.enrichmentFieldsName[0]);
    }
    if(this.commonService.isEmptyValue(field)){
      this.getEnrichmentFields(true,fromSave);
      this.form.updateValueAndValidity();
    }
  }

  onClickSaveEnrichment(_event,fromAddNew = false){
    const obj = this.commonService.checkEnrichmentValuesValid(this.enrichmentFields, this.enrichmentFieldsName, this.form);
    const enrichfieldsValid = obj.valid;
    this.form = obj.form;
    if (this.checkForRequiredFields() || !enrichfieldsValid) {
      if(fromAddNew){
        this.isSaveValid = false;
      }
      return;
    }
    this.addNewMode = false;
    this.generateEnrichmentFields(true);
    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.LIST_DATA
    ] = true;
    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_ENRICH_GRID] = true;
    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.COLUMNS
    ] = this.enrichmentFieldsName;

    const gridObj = {};
    for (const item in this.form.controls) {
      if (this.enrichmentFieldsName.includes(item)) {
        if(this.form.controls[item][FccGlobalConstant.TYPE] === FccGlobalConstant.inputDate){
          gridObj[item] = this.getFormatedDate(item);
          gridObj[item + FCMPaymentsConstants.ORIGNAL] = this.form.controls[item].value;
        }else{
          gridObj[item] = this.form.controls[item].value;
        }
      }
    }
    this.addAdditionalAttributesInTableObject(gridObj);
    gridObj['discardFlag'] = false;
    if(fromAddNew){
      this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.DATA].push(gridObj);
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
          FccGlobalConstant.DATA] = [...this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.DATA]];
        this.isSaveValid = true;
        this.enrichmentFieldsName.forEach(field =>{
          this.commonService.getFormElement(this.form,field).markAsUntouched();
        });
        this.setRenderOnlyFields(
          this.form,
          this.enrichmentFieldsName,
          false
        );
    } else{
      if(this.isEnrichTypeMultiple){
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
          FccGlobalConstant.DATA].push(gridObj);
          this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.DATA] = [...this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
              FccGlobalConstant.DATA]];
      }else{
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
          FccGlobalConstant.DATA] = [gridObj];
          this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
            FccGlobalConstant.DATA] = [...this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
              FccGlobalConstant.DATA]];
      }
        this.enrichmentFieldsName.forEach(field =>{
          this.commonService.getFormElement(this.form,field).markAsUntouched();
        });
        this.setRenderOnlyFields(this.form, [...this.enrichmentFieldsName], false);
    }
    if (this.form.get('updatePayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) {
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    this.setRenderOnly(this.form,FccConstants.ENRICHMENT_LIST_TABLE,true);
    ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment'].forEach((field) => {
      this.patchFieldParameters(this.form.controls[field], { rendered: false });
    });
    if(this.isEnrichTypeMultiple){
      this.setRenderOnly(this.form, 'addNewEnrichment', true);
    }
    this.updatedFlag = true;
    this.validateEnableSave();
    this.form.updateValueAndValidity();
  }

  onClickSaveAndAddNewEnrichment(event){
    this.onClickSaveEnrichment(event,true);
    if(this.isSaveValid){
      this.onClickAddNewEnrichment();
    }
  }

  onClickAddNewEnrichment(){
    this.addNewMode = true;
    this.generateEnrichmentFields();
    this.showHideEnrichmentFields(true);
    this.resetRenderOnlyFields(this.form, this.enrichmentFieldsName);
    this.addEnrichmentValidation();
    this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
      'btndisable'
    ] = true;
    this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
      'btndisable'
    ] = true;
    this.setRenderOnly(this.form, 'addNewEnrichment', false);
    this.setRenderOnly(this.form, 'saveEnrichment', true);
    this.setRenderOnly(this.form, 'cancelEnrichment', true);
    this.validateEnableSave();
  }

  onClickCancelEnrichment() {
    this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
      'btndisable'
    ] = !(this.updatedFlag || this.form.get('effectiveDate')[FccGlobalConstant.PARAMS]?.hasChanged);
    this.disableTable(false, this.paymentInstrumentProductService.getEnrichmentIndex());
    this.paymentInstrumentProductService.setEnrichmentIndex('');
    this.isSaveValid = false;
    if(this.isEnrichTypeMultiple && this.addNewMode){
      this.paymentInstrumentProductService.setEnrichmentIndex('');
      this.cancelFields();
      this.addNewMode = false;
    }else{
      if (this.checkOriginalLengthOfEnrichmentTable(
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]) > 0) {
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD,true);
        this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
    }
    this.resetAndHideEnrichmentFields();
    this.setRenderOnly(this.form, 'cancel', true);
    ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment'].forEach((field) => {
      this.patchFieldParameters(this.form.controls[field], { rendered: false });
    });
    if(this.isEnrichTypeMultiple &&
      this.checkOriginalLengthOfEnrichmentTable(
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]) > 0) {
      this.setRenderOnly(this.form, 'addNewEnrichment', true);
    } else if (!this.isEnrichTypeMultiple &&
      this.checkOriginalLengthOfEnrichmentTable(
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]) > 0) {
      this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    } else {
      this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    this.enrichmentSubscriptions.forEach(subs => subs.unsubscribe());
    this.validateEnableSave();
  }

  checkForRequiredFields() {
    let invalidStatus = false;
    this.enrichmentFieldsName.forEach(field =>{
      if (this.commonService.isnonEMptyString(this.form?.get(field))) {
        this.commonService.getFormElement(this.form,field).markAsTouched();
        if ((this.commonService.getFormElement(this.form,
          field)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] === true &&
        this.commonService.isEmptyValue(this.commonService.getFormElement(this.form,field).value))) {
          this.commonService.getFormElement(this.form,field).setErrors({ required: true });
          this.commonService.getFormElement(this.form,field).markAsTouched();
          invalidStatus = true;
        }
      }
    });
    if (this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.STATUS] === FccConstants.STATUS_INVALID) {
        invalidStatus = true;
    }
    return invalidStatus;
  }

  getFormatedDate(item){
    const format = this.columnOrder.find(e => {
      if(e.code === item){
        return e.format;
      }
    }).format.toUpperCase();
    return this.commonService.isEmptyValue(this.form.controls[item].value) ? FccGlobalConstant.EMPTY_STRING :
    this.utilityService.transformDateToSpecificFormat(this.form.controls[item].value, format);
  }

  cancelFields(){
    this.enrichmentFieldsName.forEach(field =>{
      this.commonService.getFormElement(this.form,field).markAsUntouched();
    });
    this.setRenderOnlyFields(
      this.form,
      [...this.enrichmentFieldsName],
      false
    );
    if(this.isEnrichTypeMultiple){
      this.setRenderOnly(this.form, 'addNewEnrichment', true);
      this.setRenderOnly(this.form, 'saveEnrichment', false);
      this.setRenderOnly(this.form, 'cancelEnrichment', false);
    }
  }

  disableTable(flag, index){
    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].forEach((element, i) => {
      element[FccConstants.UPDATE_FLAG] = !flag;
      if (i === index) {
        element.highlight = flag;
      }
    });
  }

  detectValueChangeOnUpdate(){
    this.enrichmentFieldsName.forEach(field =>{
      this.enrichmentSubscriptions.push(
        this.commonService.getFormElement(this.form,field).valueChanges.subscribe(change => {
          if(this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA][
            this.paymentInstrumentProductService.getEnrichmentIndex()][field] !== change) {
            this.disableUpdateButton(false);
          }
        })
      );
    });
  }

  disableUpdateButton(disable:boolean){
    this.setButtonDisable(this.form, 'updateEnrichment', disable);
  }

  setButtonDisable(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { btndisable: flag });
  }

  onClickEditEnrichment(_event, _key, index, rowData) {
    if (this.commonService.isEmptyValue(this.paymentInstrumentProductService.getEnrichmentIndex())) {
      this.paymentInstrumentProductService.setEnrichmentIndex(index);
      this.disableTable(true, this.paymentInstrumentProductService.getEnrichmentIndex());
      this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = true;
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = true;
      this.generateEnrichmentFields();
      if(!this.isEnrichTypeMultiple){
        this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.paymentInstrumentProductService.setEnrichmentGridEditIndex(index);
      this.showHideEnrichmentFieldsForEdit(true);
      this.retainRenderedOnlyField(
        this.form,
        this.enrichmentFieldsName,
        rowData,
        true
      );
      ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment'].forEach((field) => {
        this.patchFieldParameters(this.form.controls[field], { rendered: false });
      });
      this.setRenderOnly(this.form, 'cancel', true);
      this.setRenderOnly(this.form, 'updateEnrichment', true);
      this.disableUpdateButton(true);
      this.detectValueChangeOnUpdate();
      this.setRenderOnly(this.form, 'cancelEnrichment', true);
    }
    this.validateEnableSave();
  }

  onClickDeleteEnrichment(_event, _key, index) {
    const headerField = `${this.translateService.instant(FCMPaymentsConstants.DELETE_ENRICHMENT)}`;
    const message = `${this.translateService.instant(
      FCMPaymentsConstants.DELETE_ENRICHMENT_CONFIRM
    )}`;
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: message },
      baseZIndex: 9999,
      autoZIndex: true
    });
    this.subscriptions.push(dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === FccGlobalConstant.CONFIRMATION_YES) {
        if (this.checkOriginalLengthOfEnrichmentTable(
          this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]
          ) === 1) {
          this.deletedEnrichmentsIndex.push(index);
          this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA][index]['discardFlag'] = true;
          ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment'].forEach((field) => {
            this.patchFieldParameters(this.form.controls[field], { rendered: false });
          });
          if (this.isMandatoryEnrichmentPresent || this.checkMandatoryFieldsInEnrichments()) {
            this.resetAndHideEnrichmentFields();
            this.onClickAddEnrichmentField(null,true);
            this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            this.form.get(FccConstants.ENRICHMENT_LIST_TABLE).updateValueAndValidity();
            this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
              'btndisable'
            ] = true;
            this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
              'btndisable'
            ] = true;
            this.checkForRequiredFields();
          } else {
            this.resetAndHideEnrichmentFields();
            this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            this.form.get(FccConstants.ENRICHMENT_LIST_TABLE).updateValueAndValidity();
            this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            this.setRenderOnly(this.form, 'addEnrichmentField', true);
            this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
              'btndisable'
            ] = false;
            this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
              'btndisable'
            ] = false;
          }
        } else {
          this.deletedEnrichmentsIndex.push(index);
          this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA][index]['discardFlag'] = true;
          this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
            'btndisable'
          ] = false;
          this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
            'btndisable'
          ] = false;
        }
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translateService.instant('success')}`,
          detail: this.translateService.instant('deleteSuccessMessage')
        });
        this.updatedFlag = true;
        if (this.checkOriginalLengthOfEnrichmentTable(
          this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]) > 0) {
          this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
            'btndisable'
          ] = false;
        }
      }
    }));
    this.validateEnableSave();
  }

  showHideEnrichmentFieldsForEdit(show){
    if(show){
      const field = this.form.get(this.enrichmentFieldsName[0]);
      if(this.commonService.isEmptyValue(field)){
        this.form = this.formControlService.addNewFormControlsInSequence(this.enrichmentFieldsName, this.enrichmentFields, this.form);
        this.addEnrichmentValidation();
      }
      this.enrichmentFieldsName.forEach(field =>{
        this.commonService.getFormElement(this.form,field).markAsUntouched();
        if(this.enrichmentFields[field].required){
          this.setRequiredOnly(this.form,field,true);
        }
      });
      this.setRenderOnlyFields(this.form, this.enrichmentFieldsName, show );
    } else{
      if(!this.commonService.isEmptyValue(this.enrichmentFields)){
        this.formControlService.removeFormControls(this.enrichmentFields, this.form);
      }
    }
    this.setRenderOnly(this.form, FCMPaymentsConstants.FCM_ENRICHMENT_UPDATE,show);
    this.setRenderOnlyFields(this.form, FCMPaymentsConstants.ENRICHMENT_SAVE_CANCEL,!show);
    this.setRenderOnly(this.form, FCMPaymentsConstants.FCM_ENRICHMENT_ADD_NEW,!show);
    this.setRenderOnly(this.form, FCMPaymentsConstants.FCM_ENRICHMENT_SAVE_ADD_NEW,!show);
    this.form.updateValueAndValidity();
  }

  onClickUpdateEnrichment(event){
    if(this.isEnrichTypeMultiple){
      this.disableTable(false, this.paymentInstrumentProductService.getEnrichmentIndex());
      this.paymentInstrumentProductService.setEnrichmentIndex('');
      let enrichIndex = undefined;
      this.paymentInstrumentProductService.getEnrichmentGridEditIndex().subscribe(
        res => {
          enrichIndex = res;
        }
      );
      const obj = this.commonService.checkEnrichmentValuesValid(this.enrichmentFields, this.enrichmentFieldsName, this.form);
      const enrichfieldsValid = obj.valid;
      this.form = obj.form;
      if (this.checkForRequiredFields() || !enrichfieldsValid) {
        return;
      }
      this.generateEnrichmentFields(true);
      const retainedRecord = this.form
        .get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].filter(
          (_item, i) => i !== enrichIndex
        );
      this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.IS_ENRICH_GRID] = true;
      const gridObj = {};
      for (const item in this.form.controls) {
        if (this.enrichmentFieldsName.includes(item)) {
          if(this.form.controls[item][FccGlobalConstant.TYPE] === FccGlobalConstant.inputDate){
            gridObj[item] = this.getFormatedDate(item);
            gridObj[item + FCMPaymentsConstants.ORIGNAL] = this.form.controls[item].value;
          }else{
            gridObj[item] = this.form.controls[item].value;
          }
        }
      }
      gridObj['discardFlag'] = false;
      this.addAdditionalAttributesInTableObject(gridObj);
      retainedRecord.splice(enrichIndex, 0, gridObj);
      this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
        FccGlobalConstant.DATA
      ] = [...retainedRecord];
      this.setRenderOnly(this.form, FCMPaymentsConstants.FCM_ENRICHMENT_UPDATE,false);
      this.showHideEnrichmentFields(false);
      this.setRenderOnly(this.form,FCMPaymentsConstants.FCM_ENRICHMENT_ADD_NEW,true);
      this.setRenderOnly(this.form,FCMPaymentsConstants.FCM_ENRICHMENT_CANCEL,true);
      this.setRenderOnly(this.form, FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER,true);
    }else{
      this.paymentInstrumentProductService.setEnrichmentIndex('');
      if (this.checkForRequiredFields()) {
        return;
      }
      this.onClickSaveEnrichment(event);
    }
    ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment'].forEach((field) => {
      this.patchFieldParameters(this.form.controls[field], { rendered: false });
    });
    if (this.form.get('updatePayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) {
      this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
        'btndisable'
      ] = false;
    }
    this.form.get(FCMPaymentsConstants.SAVE_PAYMENT)[FccGlobalConstant.PARAMS][
      'btndisable'
    ] = false;
    if(this.isEnrichTypeMultiple) {
      this.setRenderOnly(this.form, 'addNewEnrichment', true);
    }
    this.validateEnableSave();
  }

  loadEnrichmentDataOnAutoSave(){
    this.loadEnrichDataAutoSaveFlag = true;
    this.getEnrichmentFields();
  }

  removeControls(controls: string[]) {
    controls.forEach((ele) => {
      this.form.removeControl(ele);
    });
  }

  fetchDetails(){
    this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FCMPaymentsConstants.PAYMENTS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.paymentReferenceNumber = this.commonService.getQueryParametersFromKey('paymentReferenceNumber');
    let req = {};
    if (this.operation === FCMPaymentsConstants.MODIFY_BATCH) {
      req = { paymentReferenceNumber : this.paymentReferenceNumber, pageSize: 10, first: 0 };
    } else {
      req = { paymentReferenceNumber : this.paymentReferenceNumber };
    }
    this.subscriptions.push(this.productMappingService.getApiModel(this.productCode, undefined, undefined, undefined, undefined,
      this.option, this.category).subscribe(apiMappingModel => {
        this.apiModel = apiMappingModel;
        this.subscriptions.push(this.commonService.getPaymentDetails(req).subscribe(response => {
          this.paymentDetailsResponse = response;
          if (response?.data) {
            if(response.data?.paymentHeader?.debtor){
              this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).setValue({
                label: response.data?.paymentHeader.debtor.debtorIdentification,
                name: response.data?.paymentHeader.debtor.name,
                shortName: response.data?.paymentHeader.debtor.shortName
              });
              if (this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value
              && this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.label) {
                this.form.get(FccConstants.FCM_CLIENT_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
                this.form.get(FccConstants.FCM_CLIENT_NAME).setValue(
                  this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.name);
              this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).setValue(
                this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.label
              );
            }
            }
            if (response.data?.paymentHeader?.rejectRemark) {
              this.reviewComments = response.data.paymentHeader.rejectRemark.replace(/\n/g, '<br>');
              this.commonService.displayRemarks.next(this.reviewComments);
            }
            if(response.data?.paymentHeader?.isConfidentialPayment){
              response.data.paymentHeader.isConfidentialPayment = 'Y';
            }
            if(response.data){
              this.commonService.batchData.next(response.data);
            }
            response.data.paymentDetail.forEach(item => {
              if (item.instructedAmountCurrencyOfTransfer2.amount.indexOf('?') > -1) {
                item.instructedAmountCurrencyOfTransfer2.amount = item.instructedAmountCurrencyOfTransfer2.amount
                .replace('?', this.commonService.getCurrSymbol(item.instructedAmountCurrencyOfTransfer2.currency));
              }
              this.counterTransaction[item.index] = this.balanceTransactionFormat(this.commonService.removeAmountFormatting(
                item.instructedAmountCurrencyOfTransfer2.amount));
            });
            this.productMappingService.setFormValues(this.form, response.data, apiMappingModel);
            let filterParam: any = {};
            filterParam.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value;
            filterParam.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
            filterParam = JSON.stringify(filterParam);
            this.subscriptions.push(
              this.commonService.getExternalStaticDataList(FccConstants.FCM_PAYMENT_ZERO_PROOF_FLAG, filterParam).subscribe(response => {
              if (response) {
                const zeroProof = (response[0]?.check_zero_proof && response[0]?.check_zero_proof === 'Y') ? true : false;
                this.zeroProofingFlag = zeroProof;
                if (zeroProof) {
                  this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
                  this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).enable();
                  this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).setValidators(Validators.required);
                  this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).updateValueAndValidity();
                  this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
                  this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).enable();
                  this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).setValidators(Validators.required);
                  this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).updateValueAndValidity();
                } else {
                  this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
                  this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).disable();
                  this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).updateValueAndValidity();
                  this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED]=false;
                  this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).disable();
                  this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).updateValueAndValidity();
                }
                this.transactionsDetailUpdate();
                this.showAddPaymentButton();
                this.transactionDetailsRender();
              }
            }));
            let params: any = {};
            params.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value;
            params = JSON.stringify(params);
            this.commonService.fetchAdhocBeneValidationConfig(params);
            this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT, this.paymentTransactionAmtRemoveFormat());
            this.changefiledOfAmtAndTransMap.set(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION, this.paymentNoOfTransactionReplaceChars());
            this.callPackageBasedOptions();

          }
        }));
      }));
    }
    getPaymentDetails(){
      let req = {};
      if (this.operation === FCMPaymentsConstants.MODIFY_BATCH) {
        req = { paymentReferenceNumber : this.paymentReferenceNumber, pageSize: 10, first: 0 };
      } else {
        req = { paymentReferenceNumber : this.paymentReferenceNumber };
      }
      return this.commonService.getPaymentDetails(req).toPromise();
    }

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   async discardInstrument(value){
    const response = await this.getPaymentDetails();
    this.paymentDetailsResponse = response;
    this.counterTransaction = this.commonService.counterTransaction;
    this.discardedInstrument = true;
    this.transactionsDetailUpdate();
    this.transactionDetailsRender();
    this.showAddPaymentButton();
    }
    patchInstrumentValues(value,form){
      this.commonService.batchEditSubmitFlag.next(true);
      if(this.form) {
        this.form.get('effectiveDate')['params']['maxlength'] = null;
        this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = true;
        this.paymentRefNo = this.commonService.getQueryParametersFromKey('paymentReferenceNumber');
        this.paymentReferenceNumber = this.paymentRefNo;
        const objModel = FCMPaymentsConstants.FCM_BATCH_INSTRUMENT_FORM_FIELD_MAPPING;
        const req = { paymentReferenceNumber : this.paymentReferenceNumber };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.subscriptions.push(this.commonService.getInstrumentDetails(req,value.instrumentPaymentReference).subscribe(response => {
          //this.paymentDetailsResponse = response;
          let paymentDetails = {};
          if(this.commonService.isNonEmptyValue(this.paymentDetailsResponse?.data?.paymentDetail) &&
            this.paymentDetailsResponse['data']['paymentDetail']?.length > 0){
              this.editRecordIndex = this.paymentDetailsResponse['data']['paymentDetail']
              .findIndex(ele => parseInt(ele.instrumentPaymentReference) === parseInt(value.instrumentPaymentReference)
            );
            paymentDetails = this.paymentDetailsResponse['data']['paymentDetail'][this.editRecordIndex];
          }
          this.editRecordIndex = paymentDetails['index'];
          value.adhocFlow = paymentDetails['creditorDetails']['isAdhocCreditor'];
          value = this.updateAdditionalInfoOnModify(value,paymentDetails);
          this.onClickPencilIcon('','',this.editRecordIndex,value);
          this.instrumentRefNumber = value.instrumentPaymentReference;
          this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE_NUMBER_FIELD).setValue(this.paymentReferenceNumber);
          this.beneEmailIdEditPageFlag = true;
          this.beneMobileNoEditPageFlag = true;
          this.patchBatchInstrumentForm(form, objModel, paymentDetails);
          if(paymentDetails['instrumentstatus'] == FccGlobalConstant.PENDING_REPAIR){
            if(paymentDetails['errorList']){
              let errorMsg = '';
              for(let i = 0; i < paymentDetails['errorList'].length; i++){
                errorMsg = errorMsg + paymentDetails['errorList'][i].errorMessage + '. ';
              }
              this.form.get('rejectReasons').setValue(errorMsg);
            }
          } else if(this.commonService.isNonEmptyValue(paymentDetails['rejectRemark'])){
            this.form.get('rejectReasons').setValue(paymentDetails['rejectRemark']);
          }
          if (paymentDetails['creditorDetails']['isAdhocCreditor']) {
            if (paymentDetails['creditorDetails']['addReceiverToDirectory'] === true) {
              this.form.get(FccConstants.FCM_ADD_BENE_CHECKBOX).setValue(FccGlobalConstant.CODE_Y);
              this.onClickAddBeneficiaryCheckbox();
              this.form.get(FccConstants.FCM_BENEFICIARY_CODE).setValue(
                this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW)?.value);
            } else if ((paymentDetails['creditorDetails']['addReceiverToDirectory'] === false)) {
              this.form.get(FccConstants.FCM_ADD_BENE_CHECKBOX).setValue(FccGlobalConstant.CODE_N);
              this.onClickAddBeneficiaryCheckbox();
            }
          }
          if (Object.keys(paymentDetails).indexOf('enrichmentDetails') > -1) {
            this.patchBatchEnrichmentDetails(paymentDetails['enrichmentDetails']);
          }
          this.form.get('effectiveDate').setValue(new Date(this.form.get('effectiveDate').value));
          if(this.form.get('beneficiaryBankIfscCode')[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED ] === false) {
            this.form.get('beneficiaryBankIfscCode').clearValidators();
          }
          this.callBeneficiaryCodeBasedOptions();
          this.onClickBeneficiaryBankIfscCode();
          if(value.adhocFlow) {
            let filterParams: any = {};
            if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_PRODUCT_ID).value)) {
              filterParams.paymenttype = this.productType;
              filterParams = JSON.stringify(filterParams);
              this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_ADHOC_BASED_OPTIONS, filterParams);
            }
            this.updateAdhocVal();
            this.form.get('beneficiaryNameCode').patchValue(paymentDetails['creditorDetails']['creditorName']);
            this.form.get(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME).setValue(
              paymentDetails['creditorDetails']['creditorName']);
              this.form.get('beneficiaryNameCode').updateValueAndValidity();
              this.beneNameCode = paymentDetails['creditorDetails']['creditorName'];
          }
          this.onClickCurrency();
          this.onClickPayFrom();
          this.scrollToForm();
          this.editBalanceDetails = true;
          this.transactionsDetailUpdate();
          this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS]['btndisable'] = true;
          this.form.updateValueAndValidity();
          if(this.commonService.isNonEmptyValue(this.form.get('customerReferenceNumber').value)
             || this.commonService.isNonEmptyValue(this.form.get('receiverType').value)){
            this.form.get(FccConstants.ADDITIONAL_INFORMATION).setValue(FccGlobalConstant.CODE_Y);
            this.setRenderOnlyFields(
              this.form, FCMPaymentsConstants.DISPLAY_ADDITIONAL_INFO_FIELDS,true
            );
          }
        }));
      }
    }
  updateAdditionalInfoOnModify(value, paymentDetails){
    value['debitNarration'] = paymentDetails?.referenceInformation?.debitDescription;
    value['creditNarration'] = paymentDetails?.referenceInformation?.creditDescription;
    return value;
  }
  patchBatchEnrichmentDetails(enrichmentObj: any) {
    this.getEnrichmentFieldsDetails(enrichmentObj);
  }
  getEnrichmentFieldsDetails(enrichObj: any) {
    let filterParams: any = {};
    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA] = [];
    filterParams.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode ?
    this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode : this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value;
    filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
    this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
    filterParams = JSON.stringify(filterParams);
    this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD,false);
    this.commonService.getExternalStaticDataList(FccConstants.FCM_ENRICHMENT_BY_PACKAGE, filterParams).subscribe(response => {
      if(response && !this.commonService.isObjectEmpty(response)) {
        Object.keys(response).forEach((key, i) => {
          if (response[key].type === 'input-radio') {
            let filterParams: any = {};
            filterParams.enrichmentCode = response[key].code;
            filterParams.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode ?
            this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode : this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value;
            filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
            this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
            filterParams = JSON.stringify(filterParams);
            const options = [];
            const styleClass = response[key]['options'][0]?.valueStyleClass;
            this.commonService.getExternalStaticDataList(FccConstants.FCM_ENRICHMENT_RADIO_OPTIONS, filterParams).subscribe(res => {
              if (res) {
                res.forEach((obj) => {
                  obj['value'] = obj.option_description;
                  obj['valueStyleClass'] = styleClass;
                  options.push(obj);
                });
                response[key]['options'] = options;
                response[key][FccConstants.ENRICHMENT] = true;
                this.displayAddEnrichment = true;
                this.enrichmentFields = response;
                localStorage.setItem('enrichmentFields',JSON.stringify(this.enrichmentFields));
                this.updateEnrichmentFieldName();
                this.updateEnrichmentTypeFlag();
                this.addFieldsInEnrichmentGroup();
                this.updateColumnOrder();
                if (i === Object.keys(response).length - 1) {
                  this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
                    FccGlobalConstant.LIST_DATA
                  ] = true;
                  this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
                    FccGlobalConstant.COLUMNS] = [...this.enrichmentFieldsName];
                  if (this.isEnrichTypeMultiple) {
                    if (this.commonService.isNonEmptyValue(enrichObj['multiSet']) &&
                    Object.keys(enrichObj['multiSet']).length > 0) {
                    enrichObj['multiSet']?.forEach((ele) => {
                      const val = {};
                      Object.keys(this.enrichmentFields).forEach((field) => {
                        if (!this.commonService.isEmptyValue(ele[this.enrichmentFields[field].code])) {
                          val[field] = ele[this.enrichmentFields[field].code];
                        } else {
                          val[field] = '';
                        }
                      });
                      this.addAdditionalAttributesInTableObject(val);
                      val['discardFlag'] = false;
                      this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].push(val);
                    });
                  }
                }
                  if (!this.isEnrichTypeMultiple) {
                    const val = {};
                    if (this.commonService.isNonEmptyValue(enrichObj['singleSet']) &&
                    Object.keys(enrichObj['singleSet']).length > 0) {
                      Object.keys(this.enrichmentFields).forEach((field) => {
                        if (!this.commonService.isEmptyValue(enrichObj['singleSet'][this.enrichmentFields[field].code])) {
                          val[field] = enrichObj['singleSet'][this.enrichmentFields[field].code];
                        } else {
                          val[field] = '';
                        }
                      });
                    this.addAdditionalAttributesInTableObject(val);
                    val['discardFlag'] = false;
                    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
                      FccGlobalConstant.DATA].push(val);
                  }
                }
                  this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
                    FccGlobalConstant.DATA] = [...this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
                    FccGlobalConstant.DATA]];
                  if (this.checkOriginalLengthOfEnrichmentTable(
                    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]) > 0) {
                    this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
                    this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][
                      FccGlobalConstant.RENDERED] = true;
                    if (this.isEnrichTypeMultiple) {
                      ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment'].forEach(
                        (field) => {
                        this.patchFieldParameters(this.form.controls[field], { rendered: false });
                        }
                      );
                      this.setRenderOnly(this.form, 'addNewEnrichment', true);
                      this.resetAndHideEnrichmentFields();
                      this.setRenderOnly(this.form, 'cancel', true);
                    }
                  } else {
                    if (this.isMandatoryEnrichmentPresent || this.checkMandatoryFieldsInEnrichments()) {
                      this.onClickAddEnrichmentField(null);
                    } else {
                      this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD, true);
                    }
                  }
                  this.form.updateValueAndValidity();
                }
              } else {
                this.removeEnrichmentData();
              }
            });
          } else if (i === Object.keys(response).length - 1) {
            this.displayAddEnrichment = true;
            this.enrichmentFields = response;
            localStorage.setItem('enrichmentFields',JSON.stringify(this.enrichmentFields));
            this.updateEnrichmentFieldName();
            this.updateEnrichmentTypeFlag();
            this.addFieldsInEnrichmentGroup();
            this.updateColumnOrder();
            this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
              FccGlobalConstant.LIST_DATA
            ] = true;
            this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
              FccGlobalConstant.COLUMNS] = [...this.enrichmentFieldsName];
            if (this.isEnrichTypeMultiple) {
              if (this.commonService.isNonEmptyValue(enrichObj['multiSet']) &&
                    Object.keys(enrichObj['multiSet']).length > 0) {
              enrichObj['multiSet']?.forEach((ele) => {
              const val = {};
              Object.keys(this.enrichmentFields).forEach((field) => {
                if (!this.commonService.isEmptyValue(ele[this.enrichmentFields[field].code])) {
                val[field] = ele[this.enrichmentFields[field].code];
                } else {
                val[field] = '';
                }
              });
              this.addAdditionalAttributesInTableObject(val);
              val['discardFlag'] = false;
              this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].push(val);
              });
            }
          }
            if (!this.isEnrichTypeMultiple) {
              const val = {};
              if (this.commonService.isNonEmptyValue(enrichObj['singleSet']) &&
              Object.keys(enrichObj['singleSet']).length > 0) {
              Object.keys(this.enrichmentFields).forEach((field) => {
                if (!this.commonService.isEmptyValue(enrichObj['singleSet'][this.enrichmentFields[field].code])) {
                val[field] = enrichObj['singleSet'][this.enrichmentFields[field].code];
                } else {
                val[field] = '';
                }
              });
              this.addAdditionalAttributesInTableObject(val);
              val['discardFlag'] = false;
              this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
              FccGlobalConstant.DATA].push(val);
            }
          }
            this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
              FccGlobalConstant.DATA] = [...this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][
              FccGlobalConstant.DATA]];
            if (this.checkOriginalLengthOfEnrichmentTable(
              this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]) > 0) {
              this.form.get(FccConstants.ENRICHMENT_LIST_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
              this.form.get(FCMPaymentsConstants.ENRICHMENT_FIELD_HEADER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
              if (this.isEnrichTypeMultiple) {
              ['saveAndAddNewEnrichment', 'addNewEnrichment', 'saveEnrichment', 'updateEnrichment', 'cancelEnrichment'].forEach((field) => {
                this.patchFieldParameters(this.form.controls[field], { rendered: false });
              });
              this.setRenderOnly(this.form, 'addNewEnrichment', true);
              this.resetAndHideEnrichmentFields();
              this.setRenderOnly(this.form, 'cancel', true);
              }
            } else {
              if (this.isMandatoryEnrichmentPresent || this.checkMandatoryFieldsInEnrichments()) {
              this.onClickAddEnrichmentField(null);
              } else {
              this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD, true);
              }
            }
            this.form.updateValueAndValidity();
          }
        });
      }
    });
  }

  initializeDropdownValuesForEdit(dropdownFields?, filterParams?){
    dropdownFields.forEach((dropdownField) => {
      if (dropdownField === 'paymentPackages') {
        let filterParamsTemp: any = {};
        filterParamsTemp.paymentPackages = 'B';
        filterParamsTemp.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
        filterParamsTemp = JSON.stringify(filterParamsTemp);
        this.subscriptions.push(this.commonService.getExternalStaticDataList(dropdownField, filterParamsTemp)
        .subscribe((response) => {
          if (response) {
              this.updateDropdown(dropdownField,response);
          }
        }));
      } else if (dropdownField === 'payFrom') {
        let filterParams: any = {};
        const packageOptions = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES)[FccConstants.PARAMS][FccConstants.OPTIONS];
        const form = this.form;
        const selectedPackage = packageOptions?.filter(ele => ele.value?.productCode === form.get(FccConstants.FCM_PAYMENT_PACKAGES).value);
        if(this.commonService.isNonEmptyValue(selectedPackage) && selectedPackage.length > 0){
          filterParams.packageCode = selectedPackage[0].value?.productCode;
          filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
          filterParams.payFromType = 'B';
          filterParams = JSON.stringify(filterParams);
          if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value)) {
          this.subscriptions.push(this.commonService.getExternalStaticDataList(dropdownField, filterParams)
          .subscribe((response) => {
            if (response) {
                this.updateDropdown(dropdownField,response);
            }
          }));
          }
        }
      } else {
        this.subscriptions.push(this.commonService.getExternalStaticDataList(dropdownField, filterParams)
        .subscribe((response) => {
          if (response) {
              this.updateDropdown(dropdownField,response);
          }
        }));
      }
    });
  }

  patchBatchInstrumentForm(form, objModel, jsonObject): any {
    Object.keys(objModel).forEach(key => {
      let value = jsonObject;
      objModel[key].forEach(field => {
        value = value[field];
      });
      if(form.get(key)){
        form.get(key).reset();
        form.get(key).setValue(value);
        if(key === FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME) {
          let filterParams: any = {};
          filterParams.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode ?
          this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode : this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value;
          filterParams.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
          this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
          filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
          this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
          filterParams = JSON.stringify(filterParams);
          this.subscriptions.push(
            this.commonService.getExternalStaticDataList(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME, filterParams)
            .subscribe(response => {
              if (response) {
                const beneCodeList = [];
                response.forEach(element => {
                  const benefeciaryNameCode: { label: string, value: any } = {
                    label: element.receiver_code,
                    value : {
                      label: element.receiver_code,
                      name: element.benedescription,
                      shortName: element.benedescription,
                      maxTxnLimit: element.max_txn_limit,
                      limitLevelFlag: element.limit_level_flag,
                      maxNoTxn: element.max_no_txn,
                      periodType: element.period_type,
                      drawerCode: element.code,
                      ifscCode: element.bank_id,
                      emailId : element.bene_email_id,
                      mobileNumber: element.bene_mobile_nmbr
                    }
                  };
                  beneCodeList.push(benefeciaryNameCode);
                });
                this.patchFieldValueAndParameters(this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME),
                value,{ options: beneCodeList });
                if (this.form.get('adhocFlag').value === FccConstants.BATCH_PAYMENT_NON_ADHOC_FLOW) {
                this.patchDropdownValue(key);
                this.form.get(FccConstants.FCM_EMAIL_ID).setValue(
                  this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.emailId);
                this.form.get(FccConstants.FCM_EMAIL_ID).disable();
                this.form.get(FccConstants.FCM_MOBILE_NUMBER).setValue(
                  this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.mobileNumber);
                this.form.get(FccConstants.FCM_MOBILE_NUMBER).disable();
                if(this.form.get(FccConstants.FCM_MOBILE_NUMBER).value) {
                  this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
                } else {
                  this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
                }
                if(this.form.get(FccConstants.FCM_EMAIL_ID).value) {
                  this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
                } else {
                  this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
                }
              }
                this.form.updateValueAndValidity();
                this.onClickReceiverType();
                this.patchFieldValueAndParameters(form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME),
                value,{ options: beneCodeList });
                if (this.form.get('adhocFlag').value === FccConstants.BATCH_PAYMENT_NON_ADHOC_FLOW) {
                  this.patchDropdownValue(key);
                }
                form.get(key).updateValueAndValidity();
            }}
            )
            );
        }
          if (key === FccConstants.FCM_PAYMENT_PAY_TO) {
            let filterParams: any = {};
            filterParams.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode ?
            this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode : this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value;
            filterParams.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
            this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
            filterParams.receiverCode = jsonObject['creditorDetails']['creditorIdentification'];
            filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
            this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
            filterParams = JSON.stringify(filterParams);
            this.subscriptions.push(
              this.commonService.getExternalStaticDataList(FccConstants.FCM_PAYMENT_PAY_TO, filterParams)
              .subscribe(response => {
                if (response) {
                  this.commonService.setDefaultPayTO(response, this.form, key);
                  const payToList = [];
                  response.forEach(element => {
                    const payTo: { label: string, value: any } = {
                    label: element.accountno,
                    value : {
                      label: element.accountno,
                      name: element.bene_account_type,
                      shortName: element.accountno,
                      defaultAcc: element.default_account,
                      accountType : element.bene_account_type,
                      currency : element.bene_account_ccy,
                      ifscCode : element.ifsc_code
                    }
                  };
                  payToList.push(payTo);
                });

                this.patchFieldValueAndParameters(this.form.get(FccConstants.FCM_PAYMENT_PAY_TO),
                value,{ options: payToList });
                this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW).setValue(
                  this.form.get(FccConstants.FCM_PAYMENT_PAY_TO).value.ifscCode);
                this.form.updateValueAndValidity();
                this.patchFieldValueAndParameters(form.get(FccConstants.FCM_PAYMENT_PAY_TO),
                value,{ options: payToList });
                this.patchDropdownValue(key);
                form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW).setValue(
                  form.get(FccConstants.FCM_PAYMENT_PAY_TO).value.ifscCode);
                form.get(key).updateValueAndValidity();
                }}));
          }

        if (key === FccConstants.BENE_BANK_IFSC_CODE) {
          let filterParameter: any = {};
          filterParameter.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
          this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
          filterParameter = JSON.stringify(filterParameter);
      this.subscriptions.push(
        this.commonService.getExternalStaticDataList('productCodeDetails', filterParameter).subscribe(response => {
          if (response) {
            this.productType = response[0]?.pay_coll_detail;
            let filterParams: any = {};
           filterParams.paymenttype = this.productType;
           const index = this.paymentDetailsResponse['data']['paymentDetail']
              .findIndex(ele => parseInt(ele.instrumentPaymentReference) === parseInt(this.instrumentRefNumber));
           if (this.commonService.isnonEMptyString(this.form.get(FccConstants.BENE_BANK_IFSC_CODE)?.value)){
            filterParams.ifscValue = this.form.get(FccConstants.BENE_BANK_IFSC_CODE)?.value;
           } else if(this.paymentDetailsResponse?.data?.paymentDetail[index]?.creditorAgent?.otherId){
            filterParams.ifscValue = this.paymentDetailsResponse?.data?.paymentDetail[index]?.creditorAgent?.otherId;
           }
           filterParams = JSON.stringify(filterParams);
           const filterParsed = JSON.parse(filterParams);
           if(filterParsed.paymenttype && filterParsed.ifscValue && filterParsed.ifscValue.length > 3){
             this.subscriptions.push(
              this.commonService.getExternalStaticDataList(FccConstants.BENE_BANK_IFSC_CODE, filterParams)
              .subscribe(response => {
                if (response) {
                  const beneBankIfscList = [];
                  response.forEach(element => {
                    const beneBankIfsc: { label: string, value: any } = {
                    label: element.ifsc,
                    value : {
                      label: element.ifsc,
                      shortName: element.ifsc,
                      drawee_bank_code: element.drawee_bank_code,
                      drawee_branch_code: element.drawee_branch_code,
                      drawee_branch_description: element.drawee_branch_description,
                      drawee_bank_description: element.drawee_bank_description
                    }
                  };
                  beneBankIfscList.push(beneBankIfsc);
                });

                this.patchFieldValueAndParameters(this.form.get(FccConstants.BENE_BANK_IFSC_CODE),
                value,{ options: beneBankIfscList });
                this.form.updateValueAndValidity();
                this.patchFieldValueAndParameters(form.get(FccConstants.BENE_BANK_IFSC_CODE),
                value,{ options: beneBankIfscList });
                if (this.form.get('adhocFlag').value === FccConstants.BATCH_PAYMENT_NON_ADHOC_FLOW) {
                  this.patchDropdownValue(key);
                }
                this.addIFSCShortDesc();
                form.get(key).updateValueAndValidity();
                }
              })
              );
            }
          }
          })
          );
      }
        if (key === FccConstants.FCM_PAYMENT_AMOUNT) {
          this.updateAmountControlLength(FccConstants.FCM_PAYMENT_AMOUNT);
          this.setAmountOriginalValue(FccConstants.FCM_PAYMENT_AMOUNT);
        }
        form.get(key).updateValueAndValidity();
        form.get(key).markAsTouched();
        if(form.get(key).type === FccGlobalConstant.INPUT_DROPDOWN_FILTER
            || form.get(key).type === FccGlobalConstant.INPUT_AUTOCOMPLETE){
          const opts = form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
              if ((opts && opts?.length > 0)) {
                this.patchDropdownValue(key);
              }
        }
        if(key === FccConstants.FCM_RECEIVER_TYPE && this.form.get(key).value
        && this.form.get(key).value === FccConstants.RECEIVER_TYPE_INDIVIDUAL) {
          this.form.get(FccConstants.FCM_LEI_CODE).disable();
        }
      }
    });
  }
  addIFSCShortDesc(){
    if (this.form.get(FccConstants.BENE_BANK_IFSC_CODE).value) {
      this.changeFieldsMap.set(FccConstants.BENE_BANK_IFSC_CODE, this.form.get(FccConstants.BENE_BANK_IFSC_CODE).value.label);
      const options = this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.OPTIONS];
      options.forEach(option => {
        if (option.value.label === this.form.get(FccConstants.BENE_BANK_IFSC_CODE).value?.label) {
          this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.PARAMS]['shortDescription']
          = option.value.drawee_bank_description+", "+option.value.drawee_branch_description;
        } else if (option.value.label === this.form.get(FccConstants.BENE_BANK_IFSC_CODE).value) {
          this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.PARAMS]['shortDescription']
          = option.value.drawee_bank_description+", "+option.value.drawee_branch_description;
        }
      });
    }
  }
  callPackageBasedOptions(){
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH
        && this.commonService.isNonEmptyValue(this.form.get(FccConstants.FCM_PAYMENT_PACKAGES))){
      let filterParams: any = {};
      const packageOptions = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES)[FccConstants.PARAMS][FccConstants.OPTIONS];
      const form = this.form;
      const selectedPackage = packageOptions?.filter(ele => ele.value?.productCode === form.get(FccConstants.FCM_PAYMENT_PACKAGES).value);
      if(this.commonService.isNonEmptyValue(selectedPackage) && selectedPackage.length > 0){
        this.paymentPackageName = selectedPackage[0].label;
        filterParams.packageCode = selectedPackage[0].value?.productCode;
        filterParams.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
        this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
        filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
    this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
        filterParams = JSON.stringify(filterParams);
        this.initializeDropdownValuesForEdit(FCMPaymentsConstants.FCM_FETCH_PACKAGE_BASED_OPTIONS,filterParams);
        this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_PRODUCT_CODE_BASED_OPTIONS, filterParams);

        this.patchFieldValueAndParameters(this.form.get(FccConstants.FCM_PAYMENT_PAYMENT_TYPE),
          selectedPackage[0].value.name, {});
        this.patchFieldValueAndParameters(this.form.get(FccConstants.FCM_PAYMENT_TYPE_ID),
          selectedPackage[0].value.paymentType, {});
        filterParams = {};
        if (this.commonService.isnonEMptyString(this.form.get(FccConstants.FCM_PAYMENT_TYPE_ID).value)) {
          filterParams.paymentTypeId = this.form.get(FccConstants.FCM_PAYMENT_TYPE_ID).value;
          filterParams = JSON.stringify(filterParams);
          this.subscriptions.push(
            this.commonService.getExternalStaticDataList(FccConstants.FCM_PAYMENT_PRODUCT_ID, filterParams).subscribe(response => {
              if(response) {
                this.patchFieldValueAndParameters(this.form.get(FccConstants.FCM_PAYMENT_PRODUCT_ID),
                          response[0].product_id, {});
              }
            })
          );
        }
      }
    }
  }

  callBeneficiaryCodeBasedOptions(){
    if(this.operation === FCMPaymentsConstants.MODIFY_BATCH && this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME)){
      let filterParams: any = {};
      const packageOptions = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES)[FccConstants.PARAMS][FccConstants.OPTIONS];
      const form = this.form;
      const selectedPackage = packageOptions?.filter(ele => ele.value?.productCode === form.get(FccConstants.FCM_PAYMENT_PACKAGES).value);
      if(this.commonService.isNonEmptyValue(selectedPackage) && selectedPackage.length > 0){
        filterParams.packageCode = selectedPackage[0].value?.productCode;
        filterParams.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
        this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
        filterParams.receiverCode = this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.label;
        filterParams.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label ?
          this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label : this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value;
        filterParams = JSON.stringify(filterParams);
        this.initializeDropdownValues(FCMPaymentsConstants.FCM_FETCH_BENEFICIARY_CODE_BASED_OPTIONS, filterParams);
        if (this.form.get(FccConstants.BATCH_ADHOC_FLAG).value === FccConstants.BATCH_PAYMENT_NON_ADHOC_FLOW) {
          this.patchDropdownValue('beneficiaryNameCode');
          this.patchDropdownValue('payTo');
          this.form.get(FCMPaymentsConstants.BENEFICIARY_NAME).setValue(
            this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.label);
          this.form.get(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME).setValue(
            this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.label);
        } else {
          this.form.get(FCMPaymentsConstants.BENEFICIARY_NAME).setValue(
            this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value);
          this.form.get(FCMPaymentsConstants.BENEFICIARY_ADHOC_NAME).setValue(
            this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value);
        }
      }
    }
  }


  onChangeCustomerReferenceNumber() {
    if(this.form.get(FCMPaymentsConstants.CUSTOMER_REFERENCE_NUMBER).value) {
      this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE).setValue(this.form.get(FCMPaymentsConstants.CUSTOMER_REFERENCE_NUMBER).value);
    } else {
      this.form.get(FCMPaymentsConstants.PAYMENT_REFERENCE).setValue(this.paymentRef);
    }
  }

  scrollToForm() {
    setTimeout(() => {
      document.getElementById(FCMPaymentsConstants.PAY_FROM)?.scrollIntoView({ block: 'center' });
    },0);
  }

  checkOriginalLengthOfEnrichmentTable(enrichTableData: any): number {
    let length = 0;
    enrichTableData.forEach((item) => {
      if (item['discardFlag'] === false) {
        length = length + 1;
      }
    });
    return length;
  }
  compareObject(obj1: any, obj2: any): boolean {
    if (typeof(obj1) === typeof(obj2)) {
      if (typeof(obj1) === 'object') {
        Object.keys(obj1).forEach((key) => {
          if (obj1[key] !== obj2[key]) {
            return false;
          }
        });
        return true;
      } else {
        return obj1 === obj2;
      }
    } else {
      return false;
    }
  }

  checkAccountNumberMatch():boolean {
    const accountNo = this.form.get(FccConstants.FCM_ACCOUNT_NO);
    const confirmAccountNo = this.form.get(FccConstants.FCM_CONFIRM_ACCONT_NO);
    if (this.commonService.isNonEmptyValue(accountNo.value) &&
        this.commonService.isNonEmptyValue(confirmAccountNo.value)) {
      return(accountNo.value === confirmAccountNo.value);
    }
  }

  updateCheckBoxDetailsOnEdit(data){
    const beneCode = data[FCMPaymentsConstants.CREDITOR_IDENTIFICATION];
    if(this.commonService.isnonEMptyString(beneCode)){
      this.commonService.getBeneficiaryAccountDetails(beneCode.toUpperCase()).subscribe(response => {
        if (response?.body.data) {
          this.form.get(FccConstants.FCM_ADD_BENE_CHECKBOX).setValue(FccGlobalConstant.CODE_N);
          this.form.get(FccConstants.FCM_BENEFICIARY_CODE).setValue('');
          this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get(FccConstants.FCM_BENEFICIARY_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
          this.setRenderOnly(this.form, FccConstants.FCM_ADD_BENE_CHECKBOX, false);
        }
      });
    }
  }
  retainPaymentFields(){
    this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.LIST_DATA
    ] = true;
    this.form.get(FCMPaymentsConstants.PAYMENTS_TABLE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA]
    .forEach(item => {
      if (item.amount.indexOf('?') > -1) {
        item.amount = item.amount.replace('?', this.commonService.getCurrSymbol(item.currency));
      }
      this.counterTransaction.push(this.balanceTransactionFormat(item.amountDecimal));
    });
    this.transactionsDetailUpdate();
    if(this.form.get('beneficiaryBankIfscCode')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] === false) {
      this.form.get('beneficiaryBankIfscCode').clearValidators();
    }
    this.form.get(FCMPaymentsConstants.PAYMENTS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccConstants.FCM_PAYMENT_CREATE_BATCH)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
    this.form.get(FccConstants.FCM_PAYMENT_PACKAGES)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.transactionDetailsRender();
  }

  removeEnrichmentData(){
    this.setRenderOnly(this.form, FCMPaymentsConstants.ADD_ENRICHMENT_FIELD,false);
    this.displayAddEnrichment = false;
    this.enrichmentFields = undefined;
    this.enrichmentFieldsName = [];
    localStorage.setItem('enrichmentFields',this.enrichmentFields);
  }

  onChangepaymentPackages() {
    this.form.get(FccConstants.FCM_PAYMENT_NO_OF_TRANSACTION).setValue(null);
    this.form.get(FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT).setValue(null);
  }

  onChangepaymentProductType(){
    this.productType = '';
    this.beneNameCode = undefined;
    this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).setValue(null);
    this.setFieldsValue(this.form, FCMPaymentsConstants.PAYMENT_PRODUCT_TYPE_DEPENDANT_FIELDS, null);
    this.form.get(FccConstants.BENE_BANK_IFSC_CODE)[FccGlobalConstant.PARAMS]['shortDescription'] = null;
    this.form.get(FccConstants.FCM_RECEIVER_TYPE).setValue(null);
    this.form.get(FccConstants.FCM_BENEFICIARY_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.FCM_BENEFICIARY_BANK_IFSC_CODE_VIEW)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.FCM_EMAIL_ID_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.FCM_EMAIL_ID).enable();
    this.form.get(FccConstants.FCM_MOBILE_NUMBER_WARN_MSG)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.FCM_MOBILE_NUMBER).enable();
    this.onClickPaymentProductType();
  }

  setFieldsValue(form, fields: string[], value) {
      fields.forEach((field) => this.patchFieldValueAndParameters(form.get(field),
      value, { options: null }));
  }

  showErrorToaster(_err){
    let errMsg = '';
      if (_err.error !== null && Object.keys(_err.error).length !== 0) {
        for (const key in _err.error.errors) {
          const sequence = +key + 1;
          errMsg = errMsg + '(' + sequence + ') ' + _err.error.errors[key].description + ' \r\n ';
        }
      } else {
        errMsg = `${this.translateService.instant('FCM_ERROR_TECH_0001')}`;
      }
      this.commonService.showToasterMessage({
        life: 20000,
        key: 'tc',
        severity: 'error',
        summary: this.translateService.instant('error'),
        detail: errMsg
      });
  }

  changeToasterStyle(flag){
    Array.from(document.getElementsByTagName('p-toast')).forEach((element) => {
      if (flag) {
        element.classList.add('toast-full-width');
      } else {
        element.classList.remove('toast-full-width');
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickCopyPaymentAccountNo(_event) {
    this.form.updateValueAndValidity();
  }

  getCutOffTime() {
    let filterParams1: any = {};
    filterParams1.packageCode = this.form.get(FccConstants.FCM_PAYMENT_PACKAGES).value?.productCode;
    filterParams1.productCode = this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label ?
    this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value?.label : this.form.get(FccConstants.FCM_PRODUCT_TYPE)?.value;
    filterParams1.clientCode = this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value?.label;
    filterParams1 = JSON.stringify(filterParams1);
    this.subscriptions.push(
      this.commonService.getExternalStaticDataList(FccConstants.CUTTOFF_TIME_PRODUCT_TYPE, filterParams1).subscribe(response => {
        if (response && response.length > 0) {
          this.cuttOffTime = this.commonService.convertNumberToTime(response[0].cutoff_time);
          this.checkCutOffTimings();
        }
      })
    );
  }

  checkForUpdateButton(){
    let statusFlag = this.checkForRequiredFields();
    if(this.form.get('saveEnrichment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] && this.addNewMode){
      statusFlag = true;
    }
    return statusFlag;
  }

  updateBeneLimitMap() {
    const options = this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME)['params']['options'];
    let beneNameFlag = false;
      let beneNameCode = this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value?.label;
      if(!this.commonService.isNonEmptyValue(beneNameCode)) {
        beneNameFlag = true;
        beneNameCode = this.form.get(FccConstants.FCM_PAYMENT_BENEFICIARY_CODE_NAME).value;
      }

      options?.forEach(task => {
      if (beneNameFlag){
        if(task.value.name === beneNameCode){
          this.beneNameAndCodeVal = task.value;
        }
      } else {
        if(task.label === beneNameCode){
          this.beneNameAndCodeVal = task.value;
        }
        }
      });
    const filterParamsBene = '{"clientCode":'+this.form.get(FccConstants.FCM_CLIENT_CODE_DETAILS).value.label+
    ',"beneDrawerCode":'+this.beneNameAndCodeVal?.drawerCode+'}';
      this.beneEmailrequiredFlag = false;
      this.beneEmailIdEditPageFlag = false;
      this.beneMobileNorequiredFlag = false;
      this.beneMobileNoEditPageFlag = false;
      this.commonService.getExternalStaticDataList(
        'beneDailyConsumption', filterParamsBene)
        .subscribe((response) => {
          if (response.length) {
              if(this.beneNameAndCodeVal?.periodType==='D'){
                this.beneBalanceAmt = response[0].n_amnt === undefined ? this.beneNameAndCodeVal?.maxTxnLimit - 0 :
                  this.beneNameAndCodeVal?.maxTxnLimit - response[0].n_amnt;
                this.beneTxnNoBalance = response[0].n_cnt === undefined ? this.beneNameAndCodeVal?.maxNoTxn - 0 :
                  this.beneNameAndCodeVal?.maxNoTxn - response[0].n_cnt;
              }else{
                this.beneBalanceAmt = -1;
                this.beneTxnNoBalance = -1;
              }
          }
          if(!this.beneLimitMap.has(this.beneNameAndCodeVal?.label)){
            this.beneLimitMap.set(this.beneNameAndCodeVal?.label, { balanceAmt: this.beneBalanceAmt, balanceTxnNo: this.beneTxnNoBalance });
          }
        });
      }

      validateEnableUpdate() {
        if(!this.isFormValid()) {
          this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
            'btndisable'
          ] = true;
        } else {
          this.form.get(FCMPaymentsConstants.UPDATE_PAYMENT)[FccGlobalConstant.PARAMS][
            'btndisable'
          ] = false;
        }
      }

      isFormValid(){
        let isValid = true;
        for (const field in this.form.controls) {
          const control = this.commonService.getFormElement(this.form,field);
          if((control['params'].required && !control.valid) || control.status === 'INVALID'){//
            isValid = false;
              break;
          }
        }
        return isValid;
      }
    createOptionObj(element){
    const ifscVal = [];
    const ifsc: { label: string, value: any } = {
      label: element?.IFSC,
    value : {
      label: element?.IFSC,
      name: element?.IFSC,
      shortName: element?.IFSC,
      drawee_bank_code: element?.DRAWEE_BANK_CODE,
      drawee_bank_description: element?.DRAWEE_BANK_DESCRIPTION,
      drawee_branch_code: element?.DRAWEE_BRANCH_CODE,
      drawee_branch_description: element?.DRAWEE_BRANCH_DESCRIPTION
    }
    };
    ifscVal.push(ifsc);
    this.patchFieldParameters(this.form.get(FccConstants.BENE_BANK_IFSC_CODE), { options: ifscVal });
    return ifscVal;
  }
}


