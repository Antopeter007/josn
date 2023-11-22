import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef, DialogService } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from './../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { AccountDetailsList } from './../../../../../../common/model/accountDetailsList';
import { BankDetails } from './../../../../../../common/model/bankDetails';
import { Beneficiaries } from './../../../../../../common/model/beneficiaries';
import { CorporateDetails } from './../../../../../../common/model/corporateDetails';
import { CounterpartyDetailsList } from './../../../../../../common/model/counterpartyDetailsList';
import { CurrencyRequest } from './../../../../../../common/model/currency-request';
import { Entities } from './../../../../../../common/model/entities';
import { References } from './../../../../../../common/model/references';
import { CommonService } from './../../../../../../common/services/common.service';
import { DropDownAPIService } from './../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../../common/services/form-model.service';
import { MultiBankService } from './../../../../../../common/services/multi-bank.service';
import { PhrasesService } from './../../../../../../common/services/phrases.service';
import { SearchLayoutService } from './../../../../../../common/services/search-layout.service';
import { SessionValidateService } from './../../../../../../common/services/session-validate-service';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { LeftSectionService } from './../../../../../../corporate/common/services/leftSection.service';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { SaveDraftService } from './../../../../../../corporate/trade/lc/common/services/save-draft.service';
import {
  AdviseThroughBankComponent,
} from './../../../../../../corporate/trade/lc/initiation/component/advise-through-bank/advise-through-bank.component';
import {
  AdvisingBankComponent,
} from './../../../../../../corporate/trade/lc/initiation/component/advising-bank/advising-bank.component';
import {
  IssuingBankComponent,
} from './../../../../../../corporate/trade/lc/initiation/component/issuing-bank/issuing-bank.component';
import {
  CustomCommasInCurrenciesPipe,
} from './../../../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import {
  emptyCurrency,
  orderingAndTransfereeAccountNotBeSame,
  zeroAmount,
} from './../../../../../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { FtTradeProductComponent } from './../ft-trade-product/ft-trade-product.component';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { FtTradeProductService } from '../services/ft-trade-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { compareExecutionDateToCurrentDate, invalidDate } from '../../../../lc/initiation/validator/ValidateDates';
import { LcTemplateService } from './../../../../../../common/services/lc-template.service';
import { ProductMappingService } from '../../../../../../common/services/productMapping.service';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import {
  ConfirmationDialogComponent
} from '../../../../../../../app/corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { LcConstant } from './../../../../lc/common/model/constant';
import { Subscription } from 'rxjs';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';

@Component({
  selector: 'app-ft-trade-general-details',
  templateUrl: './ft-trade-general-details.component.html',
  styleUrls: ['./ft-trade-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: FtTradeGeneralDetailsComponent }]
})

export class FtTradeGeneralDetailsComponent extends FtTradeProductComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @Output() messageToEmit = new EventEmitter<string>();
  @Output() notify = new EventEmitter<any>();
  @ViewChild('tabs') public tabs: MatTabGroup;
  @ViewChild(IssuingBankComponent, { read: IssuingBankComponent }) public issuingBankComponent: IssuingBankComponent;
  @ViewChild(AdvisingBankComponent, { read: AdvisingBankComponent }) public advisingBankComponent: AdvisingBankComponent;
  @ViewChild(AdviseThroughBankComponent, { read: AdviseThroughBankComponent })
  public adviseThroughBankComponent: AdviseThroughBankComponent;
  form: FCCFormGroup;
  module = `${this.translateService.instant('generalDetails')}`;
  option: any;
  tableColumns = [];
  refId: any;
  docId: any;
  data: any;
  contextPath: any;
  fileName: any;
  references: References;
  params = FccGlobalConstant.PARAMS;
  rendered = FccGlobalConstant.RENDERED;
  required = FccGlobalConstant.REQUIRED;
  mode: any;
  subTnxTypeCode: any;
  actionReqCode: any;
  renderedFieldsRemittance: any[];
  nonRenderedFieldsRemittance: any[];
  renderedFieldsOwn: any[];
  nonRenderedFieldsOwn: any[];
  responseStatusCode = 200;
  entities = [];
  beneficiaries = [];
  updatedBeneficiaries = [];
  entity: Entities;
  counterpartyDetailsList: CounterpartyDetailsList;
  beneficiaryList: Beneficiaries;
  corporateDetails: CorporateDetails;
  curRequest: CurrencyRequest = new CurrencyRequest();
  currency: SelectItem[] = [];
  OMR = 'OMR';
  BHD = 'BHD';
  TND = 'TND';
  JPY = 'JPY';
  isoamt = '';
  enteredCurMethod = false;
  iso;
  val;
  validatorPattern = FccGlobalConstant.AMOUNT_VALIDATION;
  flagDecimalPlaces;
  twoDecimal = 2;
  threeDecimal = 3;
  length2 = FccGlobalConstant.LENGTH_2;
  length3 = FccGlobalConstant.LENGTH_3;
  length4 = FccGlobalConstant.LENGTH_4;
  accounts = [];
  accountsWithCur = [];
  accountDetailsList: AccountDetailsList;
  entityNameRendered: any;
  entityName: any;
  entitiesList: any;
  bankDetails: BankDetails;
  corporateBanks = [];
  corporateReferences = [];
  advisingBankResponse: any;
  adviseThroughBankResponse: any;
  private readonly VALUE = 'value';
  phrasesResponse: any;
  transferType: any;
  allowedDecimals = -1;
  subProductCode: any;
  transmissionMode: any;
  transferTypeValue: any;
  address1TradeLength;
  address2TradeLength;
  domTradeLength;
  address4TradeLength;
  appBenNameRegex: any;
  appBenAddressRegex: any;
  appBenNameLength: any;
  appBenFullAddrLength: any;
  maxlength = 'maxlength';
  orderingActField = 'orderingAct';
  transfereeActField = 'transfereeAct';
  productCode: any;
  subProductCodeForAddressType: any;
  addressType: any;
  entityAddressType: any;
  benePreviousValue: any;
  swiftXCharRegex;
  templteId;
  readonly = FccGlobalConstant.READONLY;
  templateResponse;
  sectionName = FccGlobalConstant.FT_TRADE_GENERAL_DETAILS;
  options = 'options';
  templateIDSubProdCode: any;
  templateKey: string;
  nameOrAbbvName: any;
  custRefLength;
  trimActName: any;
  beneEditToggleVisible: boolean;
  fieldNames = [];
  regexType: string;
  enquiryRegex;
  swiftZchar;
  swiftXChar;
  defaultFilterCriteria: any = {};
  ftDetailsResponse: any;
  excludedFieldsNdSections: any;
  copyFromProductCode = '';
  excludingJsonFileKey = '';
  fieldsArray = [];
  sectionsArray = [];
  lcConstant = new LcConstant();
  disabled = this.lcConstant.disabled;
  currentCreateForm;
  transfererEntity: any;
  copyFrom = true;
  beneficiaryFirstAddressVal: any;
  beneficiarySecondAddressVal: any;
  beneficiaryThirdAddressVal: any;
  beneficiaryActVal: any;
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;
  enteredCharCount = 'enteredCharCount';
  taskSubscription : Subscription;
  swifCodeRegex: any;
  isStaticAccountEnabled: boolean;

  constructor(protected translateService: TranslateService,
    protected commonService: CommonService,
    protected stateService: ProductStateService,
    protected eventEmitterService: EventEmitterService,
    protected leftSectionService: LeftSectionService,
    protected saveDraftService: SaveDraftService,
    protected corporateCommonService: CorporateCommonService,
    public fccGlobalConstantService: FccGlobalConstantService,
    protected sessionValidation: SessionValidateService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected viewContainerRef: ViewContainerRef,
    protected elementRef: ElementRef,
    protected cdRef: ChangeDetectorRef,
    protected resolver: ComponentFactoryResolver,
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected multiBankService: MultiBankService,
    protected dropdownAPIService: DropDownAPIService,
    protected phrasesService: PhrasesService,
    protected confirmationService: ConfirmationService,
    protected utilityService: UtilityService,
    protected fileArray: FilelistService,
    protected dialogRef: DynamicDialogRef,
    protected resolverService: ResolverService,
    protected lcTemplateService: LcTemplateService,
    protected productMappingService: ProductMappingService,
    protected transactionDetailService: TransactionDetailService,
    protected dialogService: DialogService,
    protected fccTaskService: FccTaskService,
    protected currencyConverterPipe: CurrencyConverterPipe, protected ftTradeProductService: FtTradeProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, ftTradeProductService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameOrAbbvName = response.TradeIssuingBankNameOrAbbvName;
        this.enquiryRegex = response.swiftZChar;
        this.swiftXChar = response.swiftXCharacterSet;
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
        this.swifCodeRegex = response.bigSwiftCode;
      }
    });
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.templteId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TEMPLATE_ID);
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
    }
    this.initializeFormGroup();
    this.getCurrencyDetail();
    this.iterateControls(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS,
      this.stateService.getSectionData(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS));
    this.transmissionMode = this.form.get('transmissionModeFund').value;
    this.clearingFormValidators(['transfererFirstAddress', 'transfererSecondAddress', 'transfererThirdAddress',
     'beneficiaryFirstAddress', 'beneficiarySecondAddress', 'beneficiaryThirdAddress']);
    this.commonService.loadDefaultConfiguration().subscribe(response => {

    if (response && this.transferTypeValue === FccGlobalConstant.FT_TTPT) {
      this.swiftXCharRegex = response.swiftXCharacterSet;
      this.appBenNameRegex = response.BeneficiaryNameRegex;
      this.appBenAddressRegex = response.BeneficiaryAddressRegex;
      this.appBenNameLength = response.BeneficiaryNameLength;
      this.appBenFullAddrLength = response.nonSwiftAddrLength;
      this.address1TradeLength = response.address1TradeLength;
      this.address2TradeLength = response.address2TradeLength;
      this.domTradeLength = response.domTradeLength;
      this.address4TradeLength = response.address4TradeLength;
      this.custRefLength = response.customerReferenceTradeLength;
      this.swifCodeRegex = response.bigSwiftCode;
      this.form.addFCCValidators('customerReference', Validators.maxLength(this.custRefLength), 0);
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('transfererFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('transfererSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('transfererThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('beneficiaryFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('beneficiarySecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('beneficiaryThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);

        this.form.addFCCValidators('advisingswiftCode', Validators.pattern(this.swifCodeRegex), 0);
        this.form.addFCCValidators('advisingBankName', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('advisingBankFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('advisingBankSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('advisingBankThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('advThroughswiftCode', Validators.pattern(this.swifCodeRegex), 0);
        this.form.addFCCValidators('adviceThroughFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('adviceThroughSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('adviceThroughThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('beneficiaryAct', Validators.pattern(this.swiftXCharRegex), 0);

      }
      this.form.get('transfererFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
      this.form.get('transfererSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
      this.form.get('transfererThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
      this.form.get('beneficiaryFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
      this.form.get('beneficiarySecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
      this.form.get('beneficiaryThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
      this.form.get('beneficiaryAct')[this.params][this.maxlength] = this.domTradeLength;
    } else if (response && this.transferTypeValue === FccGlobalConstant.FT_TINT) {
      this.form.get('transfererFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
      this.form.get('transfererSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
      this.form.get('transfererThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
    }
  });
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    if (this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value !== undefined &&
      this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value !== FccGlobalConstant.EMPTY_STRING) {
      this.benePreviousValue = this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value;
    }
    if ((this.option !== FccGlobalConstant.TEMPLATE) && (this.mode === FccGlobalConstant.DRAFT_OPTION
      && this.form.get('templateName').value)) {
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
      this.form.get('templateSelection')[this.params][this.rendered] = true;
      this.form.get('fetchedTemplate')[this.params][this.rendered] = true;
      this.form.get('fetchedTemplate').patchValue(this.form.get('templateName').value);
      this.patchFieldParameters(this.form.get('fetchedTemplate'), { readonly: true });
    }
    this.toggleVisibilityChange.subscribe(value => {
      this.beneEditToggleVisible = value;
      if (this.beneEditToggleVisible) {
        this.patchFieldParameters(this.form.get('beneficiaryAct'), { readonly: false });
      }
    });
    this.clearingFormValidators(['payThroughBank', 'accountWithBank', 'paymentDetalsTransferee', 'transfereeReference']);
    this.fieldNames = ['transfereeReference', 'payThroughBank', 'accountWithBank', 'paymentDetalsTransferee'];
    if (this.transmissionMode === FccBusinessConstantsService.SWIFT && this.option !== FccGlobalConstant.TEMPLATE) {
      this.fieldNames.forEach(ele => {
        this.form.get(ele).clearValidators();
        this.regexType = this.form.get(ele)[FccGlobalConstant.PARAMS]['applicableValidation'][0]['characterValidation'];
        if (this.regexType === FccGlobalConstant.SWIFT_X) {
          this.regexType = this.swiftXChar;
        } else if (this.regexType === FccGlobalConstant.SWIFT_Z) {
          this.regexType = this.enquiryRegex;
        }
        if (this.commonService.validateProduct(this.form, ele, this.productCode)) {
          this.form.addFCCValidators(ele, Validators.pattern(this.regexType), 0);
        }
      });
    }
    this.templateChanges();
    this.getExcludedFieldsNdSections();
    this.getCorporateBanks();
    this.getCorporateReferences();
    this.updateNarrativeCount();
    this.taskSubscription = this.fccTaskService.notifyTaskAfterSaveTnx$.subscribe(data => {
      if(data) {
      if (this.form && this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
      }
      if (this.form && this.commonService.isNonEmptyField('removeLabel', this.form)) {
          this.form.get('removeLabel')[this.params][this.rendered] = false;
          }
      }
      });
  }
  updateNarrativeCount() {
    if (this.form.get('otherInst').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('otherInst').value);
      this.form.get('otherInst')[this.params][this.enteredCharCount] = count;
    }
    if (this.form.get('paymentDetalsTransferee').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('paymentDetalsTransferee').value);
      this.form.get('paymentDetalsTransferee')[this.params][this.enteredCharCount] = count;
    }
    this.editModeDataPopulate();
  }

  ngAfterViewChecked(): void {
    const rowDataElement = document.querySelectorAll('.removeLabelStyle,.removeLabelTemplateStyle');
    if(rowDataElement){
      rowDataElement.forEach(element => {
        element.setAttribute('tabIndex', '0');
      });
    }
    if (this.form.get(FccGlobalConstant.EXECUTION_DATE)["params"]?.required) {
      this.form.get(FccGlobalConstant.EXECUTION_DATE).clearValidators();
      this.form.get(FccGlobalConstant.EXECUTION_DATE).setValidators([Validators.required]);
      this.form.get(FccGlobalConstant.EXECUTION_DATE).updateValueAndValidity();
    }
  }

  getExcludedFieldsNdSections() {
    const productCode = FccGlobalConstant.PRODUCT_FT;
    const subProductCode = '';
    this.transactionDetailService.getExcludedFieldsNdSections(productCode, subProductCode).subscribe(
      (response) => {
        this.excludedFieldsNdSections = response.body;
      }, (error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    );
  }

  ngAfterViewInit() {
    if (this.form && this.form.get('amount') && this.form.get('amount').value) {
      const amountValue = this.form.get('amount').value;
      if (amountValue != undefined && amountValue != null && amountValue != '') {
        this.onBlurAmount();
      }
    }
  }

  ngOnDestroy() {
    if(this.form && this.nonNumericCurrencyValidator){
      const amt = this.form.get(FccGlobalConstant.AMOUNT_FIELD);
      if(this.commonService.isNonEmptyValue(amt)){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value,
          this.form.get('currency').value.currencyCode,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
    }
    this.stateService.setStateSection(FccGlobalConstant.FT_GENERAL_DETAILS, this.form);
    this.templateResponse = null;
    if (this.form && this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
    }
    if (this.form && this.commonService.isNonEmptyField('removeLabel', this.form)) {
      this.form.get('removeLabel')[this.params][this.rendered] = false;
    }
    this.commonService.actionsDisable = false;
    this.commonService.buttonsDisable = false;
    if(this.taskSubscription != null && this.taskSubscription != undefined){
      this.taskSubscription.unsubscribe();
     }
  }

  handleOnChange() {
    if (this.issuingBankComponent) {
      this.issuingBankComponent.ngOnDestroy();
    }
    if (this.adviseThroughBankComponent) {
      this.adviseThroughBankComponent.ngOnDestroy();
    }
    if (this.advisingBankComponent) {
      this.advisingBankComponent.ngOnDestroy();
    }
  }

  clearingFormValidators(fields: any) {
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
    }
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.FT_TRADE_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    if (this.subProductCode) {
      this.form.get('transferTypeOptions').setValue(this.subProductCode);
    }
    this.transferType = this.stateService.getSectionData('ftTradeGeneralDetails').get('transferTypeOptions');
    this.transferTypeValue = this.form.get('transferTypeOptions').value;
    this.transmissionMode = this.form.get('transmissionModeFund').value;
    if (this.mode === 'INITIATE' || this.mode === FccGlobalConstant.DRAFT_OPTION || this.option === 'TEMPLATE') {
      this.form.get('bankDetailsType').setValue('issuingBank');
      this.form.get('forwardContract')[this.params][this.rendered] = false;
    }
    this.clearingFormValidators(['transfererFirstAddress', 'transfererSecondAddress', 'transfererThirdAddress',
      'beneficiaryFirstAddress', 'beneficiarySecondAddress', 'beneficiaryThirdAddress']);
    this.commonService.loadDefaultConfiguration().subscribe(response => {

      if (response && this.transferTypeValue === FccGlobalConstant.FT_TTPT) {
        this.swiftXCharRegex = response.swiftXCharacterSet;
        this.appBenNameRegex = response.BeneficiaryNameRegex;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.nameTradeLength;
        this.appBenFullAddrLength = response.nonSwiftAddrLength;
        this.address1TradeLength = response.address1TradeLength;
        this.address2TradeLength = response.address2TradeLength;
        this.domTradeLength = response.domTradeLength;
        this.address4TradeLength = response.address4TradeLength;
        this.custRefLength = response.customerReferenceTradeLength;
        this.form.addFCCValidators('customerReference', Validators.maxLength(this.custRefLength), 0);
        if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
          this.appBenNameLength = FccGlobalConstant.LENGTH_35;
          this.address1TradeLength = FccGlobalConstant.LENGTH_35;
          this.address2TradeLength = FccGlobalConstant.LENGTH_35;
          this.domTradeLength = FccGlobalConstant.LENGTH_35;
          this.form.addFCCValidators('transfererFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('transfererSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('transfererThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('beneficiaryFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('beneficiarySecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('beneficiaryThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('transfererName', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('beneficiaryAct', Validators.pattern(this.swiftXCharRegex), 0);
          // this.form.addFCCValidators('transfereeReference', Validators.pattern(this.swiftXCharRegex), 0);
          // this.form.addFCCValidators('paymentDetalsTransferee', Validators.pattern(this.swiftXCharRegex), 0);
        }
        this.form.get('transfererName')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('transfererFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        this.form.get('transfererSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        this.form.get('transfererThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
        this.form.get('beneficiaryFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        this.form.get('beneficiarySecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        this.form.get('beneficiaryThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
        this.form.get('beneficiaryAct')[this.params][this.maxlength] = this.domTradeLength;
      } else if (response && this.transferTypeValue === FccGlobalConstant.FT_TINT) {
        this.form.get('transfererFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        this.form.get('transfererSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        this.form.get('transfererThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
      }
      this.form.markAllAsTouched();
    });
    if (this.transferType) {
      this.onClickTransferTypeOptions(this.transferType);
    }
    this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS].styleClass =
      this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS].styleClass.splice(0, 1);
    this.patchFieldParameters(this.form.get('transfererEntity'), { options: this.entities });
    this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.beneficiaries });
    this.patchFieldParameters(this.form.get('bankDetailsType'), { options: this.getSelectButtonArray() });
    this.patchFieldParameters(this.form.get('orderingAct'), { options: this.getUpdatedAccountsWithCur() });
    this.commonService.formatForm(this.form);
    this.onClickBankDetailsType(this.form.get('bankDetailsType'));
    this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD);
    this.editModeDataPopulate();
  }

  getSelectButtonArray(): any[] {
    const selectButtonArr = [
      { label: `${this.translateService.instant('issuingBank')}`, value: 'issuingBank' },
      { label: `${this.translateService.instant('accountWithBank')}`, value: 'advisingBank' },
      { label: `${this.translateService.instant('payThroughBank')}`, value: 'adviceThrough' },
    ];
    return selectButtonArr;

  }

  onClickBankDetailsType(data: any) {
    if (data.value === 'issuingBank') {
      this.form.get('bankNameHeader')[this.params][this.rendered] = true;
      this.form.get('bankNameList')[this.params][this.rendered] = true;
      this.form.get('issuerReferenceList')[this.params][this.rendered] = true;
      this.form.get('issuerReferenceHeader')[this.params][this.rendered] = true;
      this.form.get('bankInstructions')[this.params][this.rendered] = true;
      this.form.get('feeAct')[this.params][this.rendered] = true;
      this.form.get('otherInst')[this.params][this.rendered] = true;
      const accountbankFields = ['accountWithBank', 'advisingswiftCode', 'advisingBankIcons', 'advisingBankName',
        'advisingBankFirstAddress', 'advisingBankSecondAddress', 'advisingBankThirdAddress'];
      const payBankFields = ['payThroughBank', 'advThroughswiftCode', 'advThroughBankIcons', 'adviceThroughName',
        'adviceThroughFirstAddress', 'adviceThroughSecondAddress', 'adviceThroughThirdAddress'];
      const hideFields = (accountbankFields).concat(payBankFields);
      this.toggleControls(this.form, hideFields, false);
      this.togglePreviewScreen(this.form, hideFields, true);
      this.form.updateValueAndValidity();
    }
    if (data.value === 'advisingBank') {
      this.form.get('bankNameHeader')[this.params][this.rendered] = false;
      this.form.get('bankNameList')[this.params][this.rendered] = false;
      this.form.get('issuerReferenceList')[this.params][this.rendered] = false;
      this.form.get('issuerReferenceHeader')[this.params][this.rendered] = false;
      this.form.get('bankInstructions')[this.params][this.rendered] = false;
      this.form.get('feeAct')[this.params][this.rendered] = false;
      this.form.get('otherInst')[this.params][this.rendered] = false;
      const accountbankFields = ['accountWithBank', 'advisingswiftCode', 'advisingBankIcons', 'advisingBankName',
        'advisingBankFirstAddress', 'advisingBankSecondAddress', 'advisingBankThirdAddress'];
      const payBankFields = ['payThroughBank', 'advThroughswiftCode', 'advThroughBankIcons', 'adviceThroughName',
        'adviceThroughFirstAddress', 'adviceThroughSecondAddress', 'adviceThroughThirdAddress'];
      const hideFields = payBankFields;
      this.toggleControls(this.form, hideFields, false);
      const displayFields = accountbankFields;
      this.renderDependentFields(displayFields);
      this.togglePreviewScreen(this.form, hideFields, true);
      this.form.addFCCValidators('advisingswiftCode', Validators.pattern(this.swifCodeRegex), 0);
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('advisingBankName', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('advisingBankFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('advisingBankSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('advisingBankThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
      }
      this.form.updateValueAndValidity();
    }
    if (data.value === 'adviceThrough') {
      this.form.get('bankNameHeader')[this.params][this.rendered] = false;
      this.form.get('bankNameList')[this.params][this.rendered] = false;
      this.form.get('issuerReferenceList')[this.params][this.rendered] = false;
      this.form.get('issuerReferenceHeader')[this.params][this.rendered] = false;
      this.form.get('bankInstructions')[this.params][this.rendered] = false;
      this.form.get('feeAct')[this.params][this.rendered] = false;
      this.form.get('otherInst')[this.params][this.rendered] = false;
      const accountbankFields = ['accountWithBank', 'advisingswiftCode', 'advisingBankIcons', 'advisingBankName',
        'advisingBankFirstAddress', 'advisingBankSecondAddress', 'advisingBankThirdAddress'];
      const payBankFields = ['payThroughBank', 'advThroughswiftCode', 'advThroughBankIcons', 'adviceThroughName',
        'adviceThroughFirstAddress', 'adviceThroughSecondAddress', 'adviceThroughThirdAddress'];
      const hideFields = accountbankFields;
      this.toggleControls(this.form, hideFields, false);
      const displayFields = payBankFields;
      this.renderDependentFields(displayFields);
      this.togglePreviewScreen(this.form, hideFields, true);
      this.form.addFCCValidators('advThroughswiftCode', Validators.pattern(this.swifCodeRegex), 0);
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('adviceThroughName', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('adviceThroughFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('adviceThroughSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
        this.form.addFCCValidators('adviceThroughThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
      }
      this.form.updateValueAndValidity();
    }

  }

  templateChanges() {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.form.get('templateName')[this.params][this.rendered] = true;
      this.form.get('templateName')[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get('templateDescription')[this.params][this.rendered] = true;
      this.form.get('transfereeReference')[this.params][this.required] = false;
      this.form.get('transfererEntity')[this.params][this.required] = false;
      this.form.get('orderingAct')[this.params][this.required] = false;
      this.form.get('currency')[this.params][this.required] = false;
      this.form.get('amount')[this.params][this.required] = false;
      this.form.get('executionDate')[this.params][this.required] = false;
      this.form.get('bankNameList')[this.params][this.required] = false;
      this.form.get('issuerReferenceList')[this.params][this.required] = false;
      this.form.get('transfereeAct')[this.params][this.required] = false;
      this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY)[this.params][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_1)[this.params][FccGlobalConstant.REQUIRED] = false;
      this.form.get('beneficiaryAct')[this.params][this.required] = false;
      this.form.get('createFrom')[this.params][this.rendered] = false;
      this.form.get('createFromOptions')[this.params][this.rendered] = false;
      if (this.mode !== FccGlobalConstant.DRAFT_OPTION && !this.form.get('templateName').value) {
        this.commonService.generateTemplateName(FccGlobalConstant.PRODUCT_FT).subscribe(res => {
          const jsonContent = res.body as string[];
          const templateName = jsonContent[`templateName`];
          this.form.get('templateName').setValue(templateName);
          this.commonService.putQueryParameters('templateName', this.form.get('templateName').value);
        });
      }
      this.commonService.putQueryParameters('templateName', this.form.get('templateName').value);
      this.setMandatoryField(this.form, 'transfererEntity', false);
      if (this.templteId !== undefined && this.templteId !== null && this.mode === FccGlobalConstant.DRAFT_OPTION) {
        this.form.get('templateName')[this.params][this.readonly] = false;
      }
      this.commonService.clearValidatorsAndUpdateValidity('transfererEntity', this.form);
      this.commonService.clearValidatorsAndUpdateValidity('transfereeReference', this.form);
      this.commonService.clearValidatorsAndUpdateValidity('orderingAct', this.form);
      this.commonService.clearValidatorsAndUpdateValidity('beneficiaryAct', this.form);
      this.commonService.clearValidatorsAndUpdateValidity('currency', this.form);
      this.commonService.clearValidatorsAndUpdateValidity('amount', this.form);
      this.commonService.clearValidatorsAndUpdateValidity('executionDate', this.form);
      this.commonService.clearValidatorsAndUpdateValidity('bankNameList', this.form);
      this.commonService.clearValidatorsAndUpdateValidity('issuerReferenceList', this.form);
      this.commonService.clearValidatorsAndUpdateValidity('transfereeAct', this.form);
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators('beneficiaryAct', Validators.pattern(this.swiftXCharRegex), 0);
      }
    }
  }

  onBlurTemplateName() {
    if (!this.form.get('templateName')[this.params][this.readonly]) {
      const templateName = this.form.get('templateName').value;
      this.lcTemplateService.isTemplateNameExists(templateName, FccGlobalConstant.PRODUCT_FT).subscribe(res => {
        const jsonContent = res.body as string[];
        const isTemplateIdExists = jsonContent[`isTemplateIdExists`];
        if (isTemplateIdExists) {
          this.form.get('templateName').setErrors({ duplicateTemplateName: { templateName } });
        } else if (templateName === '') {
          this.form.get('templateName').setErrors({ required: true });
        } else {
          this.form.get('templateName').setErrors(null);
        }
      });
    }
  }

  checkBeneSaveAllowed(event, key) {
    this.onClickBeneficiaryEntity(event, key);
  }

  onClickTransferTypeOptions(event) {
    this.form.get('subProductCode').setValue(event.value);
    this.subProductCodeForAddressType = this.form.get(FccGlobalConstant.SUB_PRODUCT_CODE).value;
    if (event.value === FccGlobalConstant.FT_TINT) {
      this.renderedFieldsOwn = ['transfereeAct', 'transfereeDescription', 'bankNameHeader', 'bankNameList',
        'issuerReferenceHeader', 'issuerReferenceList', 'bankInstructions', 'feeAct', 'otherInst'];
      this.toggleControls(this.form, this.renderedFieldsOwn, true);
      this.nonRenderedFieldsRemittance = ['beneficiaryAct', 'chargeType', 'chargeOptions', 'modeofTransmission',
        'transmissionModeFund', 'bankDetailsType'];
      this.toggleControls(this.form, this.nonRenderedFieldsRemittance, false);
      this.setValueToNull(this.nonRenderedFieldsRemittance);
      const benefields = ['beneficiaryHeader', 'beneficiaryEntity', 'beneficiaryFirstAddress', 'beneficiarySecondAddress',
        'beneficiaryThirdAddress'];
      const accountbankFields = ['accountWithBank', 'advisingswiftCode', 'advisingBankIcons', 'advisingBankName',
        'advisingBankFirstAddress', 'advisingBankSecondAddress', 'advisingBankThirdAddress'];
      const payBankFields = ['payThroughBank', 'advThroughswiftCode', 'advThroughBankIcons', 'adviceThroughName',
        'adviceThroughFirstAddress', 'adviceThroughSecondAddress', 'adviceThroughThirdAddress'];
      const hideFields = benefields.concat(accountbankFields).concat(payBankFields);
      this.renderDependentFields(null, hideFields);
      const nonMandatoryFields = this.nonRenderedFieldsRemittance.concat(benefields);
      const mandatoryFields = ['transfereeAct'];
      const emptyFields = ['transfererEntity', 'transfererName', 'transfererFirstAddress', 'transfererSecondAddress',
        'transfererThirdAddress', 'orderingAct', 'currency', 'amount', 'executionDate', 'transfereeReference',
        'forwardContract', 'paymentDetalsTransferee', 'feeAct', 'otherInst'];
      if (this.transferType.value !== FccGlobalConstant.FT_TINT) {
        this.setValueToNull(this.renderedFieldsOwn);
        this.setValueToNull(emptyFields);
        this.removeMandatory(nonMandatoryFields, mandatoryFields);
      }
      if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
        this.removeMandatory(nonMandatoryFields, mandatoryFields);
      }
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.removeMandatory(['transfereeAct'], []);
      }
      if (this.currentCreateForm !== null && this.currentCreateForm === 'existingft') {
        this.removeMandatory(nonMandatoryFields, []);
      }
      this.form.get('ftType').setValue('01');
      this.clearingFormValidators(['paymentDetalsTransferee', 'transfereeReference', 'transfererName',
        'transfererFirstAddress', 'transfererSecondAddress', 'transfererThirdAddress'
        , 'beneficiaryFirstAddress', 'beneficiarySecondAddress', 'beneficiaryThirdAddress']);
      this.form.get('transfererFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
      this.form.get('transfererSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
      this.form.get('transfererThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
      // this.form.get('transfererFourthAddress')[this.params][this.maxlength] = this.appBenFullAddrLength;
    } else {
      this.nonRenderedFieldsOwn = ['transfereeAct', 'transfereeDescription'];
      this.toggleControls(this.form, this.nonRenderedFieldsOwn, false);
      this.setValueToNull(this.nonRenderedFieldsOwn);
      this.resettingValidators('transfereeAct');
      this.renderedFieldsRemittance = ['beneficiaryAct', 'chargeType', 'chargeOptions', 'modeofTransmission',
        'transmissionModeFund', 'bankDetailsType'];
      this.toggleControls(this.form, this.renderedFieldsRemittance, true);
      const benefields = ['beneficiaryHeader', 'beneficiaryEntity', 'beneficiaryFirstAddress', 'beneficiarySecondAddress',
        'beneficiaryThirdAddress'];
      if (this.form.get('transmissionModeFund').value === FccGlobalConstant.EMPTY_STRING ||
        this.form.get('chargeOptions').value === FccGlobalConstant.EMPTY_STRING) {
        this.form.get('transmissionModeFund').setValue(FccGlobalConstant.TRANSMISSION_FUND_SWIFT);
        this.form.get('chargeOptions').setValue(FccGlobalConstant.CHARGE_OPTION_FUND_SHA);
      }
      const displayFields = benefields;
      this.renderDependentFields(displayFields);
      const beneMandatoryfields = ['beneficiaryEntity', 'beneficiaryFirstAddress'];
      const nonMandatoryFields = this.nonRenderedFieldsOwn;
      const mandatoryFields = this.renderedFieldsRemittance.concat(beneMandatoryfields);
      const emptyFields = ['transfererEntity', 'transfererName', 'transfererFirstAddress', 'transfererSecondAddress',
        'transfererThirdAddress', 'orderingAct', 'currency', 'amount', 'executionDate', 'transfereeReference',
        'forwardContract', 'paymentDetalsTransferee', 'feeAct', 'otherInst'];
      if (this.transferType.value !== FccGlobalConstant.FT_TTPT) {
        this.setValueToNull(this.renderedFieldsRemittance);
        this.removeMandatory(nonMandatoryFields, mandatoryFields);
        this.setValueToNull(emptyFields);
      }
      else {
        const refBeneMandatoryfields = ['beneficiaryEntity', 'beneficiaryFirstAddress', 'beneficiaryAct'];
        if (this.option === FccGlobalConstant.TEMPLATE) {
          this.setMandatoryFields(this.form, refBeneMandatoryfields, false);
        } else {
          this.setMandatoryFields(this.form, refBeneMandatoryfields, true);
        }
      }
      this.form.get('ftType').setValue('02');
      this.clearingFormValidators(['transfererSecondAddress', 'transfererThirdAddress'
        , 'beneficiaryFirstAddress', 'beneficiarySecondAddress', 'beneficiaryThirdAddress']);
      this.transmissionMode = this.form.get('transmissionModeFund').value;
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators('transfererName', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('transfererFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('transfererSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('transfererThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('beneficiaryFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('beneficiarySecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('beneficiaryThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('beneficiaryAct', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('advisingBankName', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('advisingBankFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('advisingBankSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('advisingBankThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('adviceThroughFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('adviceThroughSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('adviceThroughThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
        }
      this.form.addFCCValidators('customerReference', Validators.maxLength(this.custRefLength), 0);
      this.form.get('transfererFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
      this.form.get('transfererSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
      this.form.get('transfererThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
      this.form.get('beneficiaryFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
      this.form.get('beneficiarySecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
      this.form.get('beneficiaryThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
      this.form.get('beneficiaryAct')[this.params][this.maxlength] = this.domTradeLength;

    }
    this.entities = [];
    // this.beneficiaries = [];
    // this.updatedBeneficiaries = [];
    this.form.get('transfererFirstAddress').updateValueAndValidity();
    this.form.get('transfererSecondAddress').updateValueAndValidity();
    this.form.get('transfererThirdAddress').updateValueAndValidity();
    this.form.get('beneficiaryFirstAddress').updateValueAndValidity();
    this.form.get('beneficiarySecondAddress').updateValueAndValidity();
    this.form.get('beneficiaryThirdAddress').updateValueAndValidity();
    this.form.get('beneficiaryAct').updateValueAndValidity();
    this.form.get('transfererName').updateValueAndValidity();
    this.form.get('transfereeReference').updateValueAndValidity();
    this.form.get('paymentDetalsTransferee').updateValueAndValidity();
    this.form.get('advisingBankFirstAddress').updateValueAndValidity();
    this.form.get('advisingBankSecondAddress').updateValueAndValidity();
    this.form.get('advisingBankThirdAddress').updateValueAndValidity();
    this.form.get('adviceThroughFirstAddress').updateValueAndValidity();
    this.form.get('adviceThroughSecondAddress').updateValueAndValidity();
    this.form.get('adviceThroughThirdAddress').updateValueAndValidity();
    this.getBeneficiaries();
    this.getAccounts();
  }

  removeMandatory(fields: any, mandatoryFields: any) {
    this.setMandatoryFields(this.form, fields, false);
    this.setMandatoryFields(this.form, mandatoryFields, true);
    fields.forEach(element => {
      this.resettingValidators(element);
    });
    this.form.updateValueAndValidity();
  }

  protected renderDependentFields(displayFields?: any, hideFields?: any) {
    if (displayFields) {
      this.toggleControls(this.form, displayFields, true);
      // this.setValueToNull(hideFields);
    }
    if (hideFields) {
      this.toggleControls(this.form, hideFields, false);
      this.setValueToNull(hideFields);
    }
    // this.setMandatoryFields(this.form, displayFields, true);
    // this.patchFieldValueAndParameters(field, paymentDraftValue,
    // { options: this.getPaymentDraftArray(paymentDraftOptions) });
    // this.removeMandatory(displayFields);

  }

  setValueToNull(fieldName: any[]) {
    let index: any;
    for (index = 0; index < fieldName.length; index++) {
      this.form.controls[fieldName[index]].setValue('');
    }
  }

  resettingValidators(fieldvalue) {
    this.setMandatoryField(this.form, fieldvalue, false);
    this.form.get(fieldvalue).clearValidators();
    this.form.get(fieldvalue).updateValueAndValidity();
  }

  onClickAdvisingBankIcons() {
    if (this.adviseThroughBankResponse !== undefined) {
      this.adviseThroughBankResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
    const header = `${this.translateService.instant('listOfBanks')}`;
    const productCode = 'productCode';
    const subProductCode = 'subProductCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    const obj = {};
    obj[productCode] = '';
    obj[option] = 'staticBank';
    obj[subProductCode] = '';
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    const urlOption = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    if (urlOption === FccGlobalConstant.TEMPLATE) {
      const templateCreation = 'templateCreation';
      obj[templateCreation] = true;
    }
    this.resolverService.getSearchData(header, obj);
    this.advisingBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((advResponse) => {

      if (advResponse && advResponse !== null && advResponse.responseData && advResponse.responseData !== null) {
        advResponse.responseData.ISO_CODE ? this.form.get('advisingswiftCode').patchValue(advResponse.responseData.ISO_CODE) :
          this.form.get('advisingswiftCode').patchValue(advResponse.responseData[4]);
        advResponse.responseData.NAME ? this.form.get('advisingBankName').patchValue(advResponse.responseData.NAME) :
          this.form.get('advisingBankName').patchValue(advResponse.responseData[0]);
        advResponse.responseData.ADDRESS_LINE_1 ? this.form.get('advisingBankFirstAddress')
          .patchValue(advResponse.responseData.ADDRESS_LINE_1) :
          this.form.get('advisingBankFirstAddress').patchValue(advResponse.responseData[1]);
        advResponse.responseData.ADDRESS_LINE_2 ? this.form.get('advisingBankSecondAddress')
          .patchValue(advResponse.responseData.ADDRESS_LINE_2) :
          this.form.get('advisingBankSecondAddress').patchValue(advResponse.responseData[2]);
        advResponse.responseData.DOM ? this.form.get('advisingBankThirdAddress').patchValue(advResponse.responseData.DOM) :
          this.form.get('advisingBankThirdAddress').patchValue(advResponse.responseData[3]);
      }
      const val: string = this.form.get('advisingswiftCode').value;
      const regex = new RegExp(this.swifCodeRegex);
      if(!regex.test(val)) {
        this.form.get('advisingswiftCode').setErrors({ invalidBICError: true });
        this.form.get('advisingswiftCode').markAsDirty();
        this.form.get('advisingswiftCode').markAsTouched();
      }
      this.form.updateValueAndValidity();
    });
  }

  onClickAdvThroughBankIcons() {
    if (this.advisingBankResponse !== undefined) {
      this.advisingBankResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
    const header = `${this.translateService.instant('listOfBanks')}`;
    const productCode = 'productCode';
    const subProductCode = 'subProductCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    const obj = {};
    obj[productCode] = '';
    obj[option] = 'staticBank';
    obj[subProductCode] = '';
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    const urlOption = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    if (urlOption === FccGlobalConstant.TEMPLATE) {
      const templateCreation = 'templateCreation';
      obj[templateCreation] = true;
    }
    this.resolverService.getSearchData(header, obj);
    this.adviseThroughBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((responseAdvThru) => {

      if (responseAdvThru && responseAdvThru !== null && responseAdvThru.responseData && responseAdvThru.responseData !== null) {
        responseAdvThru.responseData.ISO_CODE ? this.form.get('advThroughswiftCode').patchValue(responseAdvThru.responseData.ISO_CODE) :
          this.form.get('advThroughswiftCode').patchValue(responseAdvThru.responseData[4]);
        responseAdvThru.responseData.NAME ? this.form.get('adviceThroughName').patchValue(responseAdvThru.responseData.NAME) :
          this.form.get('adviceThroughName').patchValue(responseAdvThru.responseData[0]);
        responseAdvThru.responseData.ADDRESS_LINE_1 ? this.form.get('adviceThroughFirstAddress')
          .patchValue(responseAdvThru.responseData.ADDRESS_LINE_1) :
          this.form.get('adviceThroughFirstAddress').patchValue(responseAdvThru.responseData[1]);
        responseAdvThru.responseData.ADDRESS_LINE_2 ? this.form.get('adviceThroughSecondAddress')
          .patchValue(responseAdvThru.responseData.ADDRESS_LINE_2) :
          this.form.get('adviceThroughSecondAddress').patchValue(responseAdvThru.responseData[2]);
        responseAdvThru.responseData.DOM ? this.form.get('adviceThroughThirdAddress').patchValue(responseAdvThru.responseData.DOM) :
          this.form.get('adviceThroughThirdAddress').patchValue(responseAdvThru.responseData[3]);
        const val: string = this.form.get('advThroughswiftCode').value;
        const regex = new RegExp(this.swifCodeRegex);
        if(!regex.test(val)) {
          this.form.get('advThroughswiftCode').setErrors({ invalidBICError: true });
          this.form.get('advThroughswiftCode').markAsDirty();
          this.form.get('advThroughswiftCode').markAsTouched();
        }
        this.form.updateValueAndValidity();
      }
    });
  }

  getBeneficiaries() {
    if (this.form.get(FccGlobalConstant.SUB_PRODUCT_CODE) && this.form.get(FccGlobalConstant.SUB_PRODUCT_CODE).value
    && this.copyFrom) {
      const subProductCode = this.form.get(FccGlobalConstant.SUB_PRODUCT_CODE).value;
      if (subProductCode === FccGlobalConstant.FT_TTPT && this.mode !== FccGlobalConstant.VIEW_MODE) {
        this.corporateCommonService.retrieveBeneficiaries(this.fccGlobalConstantService.getStaticDataLimit(), subProductCode)
          .subscribe(response => {
            if (response.status === this.responseStatusCode) {
              this.beneficiaries = [];
              this.updatedBeneficiaries = [];
              this.getBeneficiariesAsList(response.body);
            }
            this.getUserEntities();
          });
      } else {
        this.getUserEntities();
      }
    }
  }

  getUserEntities() {
    this.updateUserEntities();
  }

  updateUserEntities() {
    if(this.entities && !this.entities.length) {
      this.multiBankService.getEntityList().forEach(entity => {
        this.entities.push(entity);
      });
    }
    const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, 'transfererEntity', this.form);
    if (valObj) {
      this.form.get('transfererEntity').patchValue(valObj[this.VALUE]);
      this.multiBankService.setCurrentEntity(valObj[this.VALUE].shortName);
    }

    if (this.entities.length === 0) {
      this.form.get('transfererName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('transfererFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('transfererSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('transfererThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      if (this.form.get('transfererEntity')) {
        this.form.get('transfererEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.setMandatoryField(this.form, 'transfererEntity', false);
        this.form.get('transfererEntity').clearValidators();
        this.form.get('transfererEntity').updateValueAndValidity();
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.TRANSFERER_NAME, this.form) &&
        (this.form.get(FccGlobalConstant.TRANSFERER_NAME).value === undefined ||
          this.form.get(FccGlobalConstant.TRANSFERER_NAME).value === null ||
          this.form.get(FccGlobalConstant.TRANSFERER_NAME).value === FccGlobalConstant.EMPTY_STRING)) {
        this.corporateCommonService.getValues(this.fccGlobalConstantService.corporateDetails).subscribe(response => {
          this.commonService.getParameterConfiguredValues(this.productCode,
            FccGlobalConstant.PARAMETER_P347, this.subProductCodeForAddressType).subscribe(responseData => {
              if (responseData && responseData.paramDataList && responseData.paramDataList.length > FccGlobalConstant.LENGTH_0) {
                responseData.paramDataList.forEach(element => {
                  if (element[FccGlobalConstant.KEY_1] && element[FccGlobalConstant.KEY_1] === this.productCode) {
                    if (this.subProductCodeForAddressType && element[FccGlobalConstant.KEY_2] === this.subProductCodeForAddressType) {
                      this.addressType = element[FccGlobalConstant.DATA_1];
                    }
                    this.addressType = this.addressType ? this.addressType : element[FccGlobalConstant.DATA_1];
                  }
                });
                this.addressType = this.addressType ? this.addressType :
                  responseData.paramDataList[FccGlobalConstant.LENGTH_0][FccGlobalConstant.DATA_1];
              }
              if (response.status === this.responseStatusCode) {
                this.corporateDetails = response.body;
                this.form.get(FccGlobalConstant.TRANSFERER_NAME).setValue(this.corporateDetails.name);
                if (this.addressType && this.addressType === FccGlobalConstant.POSTAL_ADDRESS_PA) {
                  this.entityAddressType = FccGlobalConstant.POSTAL_ADDRESS;
                } else {
                  this.entityAddressType = FccGlobalConstant.SWIFT_ADDRESS;
                }
                if (response.body[this.entityAddressType]) {
                  this.form.get(FccGlobalConstant.TRANSFERER_FIRST_ADDRESS).setValue(response.body[this.entityAddressType].line1);
                  this.form.get(FccGlobalConstant.TRANSFERER_SECOND_ADDRESS).setValue(response.body[this.entityAddressType].line2);
                  this.form.get(FccGlobalConstant.TRANSFERER_THIRD_ADDRESS).setValue(response.body[this.entityAddressType].line3);
                }
              }
            });
        });
      }
      this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.updateBeneficiaries() });
      this.getCorporateBanks();
      this.getCorporateReferences();

    } else if (this.entities.length === 1) {
      this.form.get('transfererEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get('transfererEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('transfererEntity').setValue({
        label: this.entities[0].value.label, name: this.entities[0].value.name,
        shortName: this.entities[0].value.shortName
      });
      this.form.get('transfererEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      this.form.get('transfererEntity').updateValueAndValidity();
      this.multiBankService.setCurrentEntity(this.entities[0].value.shortName);
      this.form.get('transfererName').setValue(this.entities[0].value.name);
      this.form.get('transfererName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('transfererFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('transfererSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('transfererThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.updateBeneficiaries() });
      const entityAddress = this.multiBankService.getAddress(this.entities[0].value.shortName);
      if (this.updatedBeneficiaries.length === 1) {
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { autoDisplayFirst: true });
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { readonly: true });
        this.onClickBeneficiaryEntity(this.updatedBeneficiaries[0], '');
      } else {
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { readonly: false });
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { autoDisplayFirst: false });
      }
      if (entityAddress.Address !== undefined) {
        this.patchFieldValueAndParameters(this.form.get('transfererFirstAddress'), entityAddress.Address.line1, '');
        this.patchFieldValueAndParameters(this.form.get('transfererSecondAddress'), entityAddress.Address.line2, '');
        this.patchFieldValueAndParameters(this.form.get('transfererThirdAddress'), entityAddress.Address.line3, '');
      }
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.removeMandatory(['amount'], []);
      }
      this.getCorporateBanks();
      this.getCorporateReferences();
    } else if (this.entities.length > 1) {
      this.form.get('transfererEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get('transfererEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.patchFieldParameters(this.form.get('transfererEntity'), { options: this.entities });
      this.form.get('transfererEntity').updateValueAndValidity();

      this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: [] });
      this.form.get('transfererName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('transfererFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('transfererSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('transfererThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.removeMandatory(['transfererEntity'], []);
      }
    }
    this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.updateBeneficiaries() });
    this.getCorporateBanks();
    this.getCorporateReferences();
    this.form.updateValueAndValidity();
    this.updateBeneValues();
  }

  updateBeneficiaries(): any[] {
    this.updatedBeneficiaries = [];
    if (!this.form.get('transfererEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) {
      this.beneficiaries.forEach(value => {
        if (value.value.entity === '*') {
          const beneficiary: { label: string; value: any } = {
            label: value.label,
            value: value.value
          };
          this.updatedBeneficiaries.push(beneficiary);
        }
      });
    }
    if (this.form.get('transfererEntity').value && this.form.get('transfererEntity').value.shortName !== undefined
     && this.form.get('transfererEntity').value && this.form.get('transfererEntity').value.shortName !== '') {
      this.beneficiaries.forEach(value => {
        if (this.form.get('transfererEntity').value.shortName === value.value.entity || value.value.entity === '*') {
          const beneficiary: { label: string; value: any } = {
            label: value.label,
            value: value.value
          };
          this.updatedBeneficiaries.push(beneficiary);
        }
      });
    }
    return this.updatedBeneficiaries;
  }

  getBeneficiariesAsList(body: any) {
    this.beneficiaryList = body;
    this.beneficiaryList.items.forEach(value => {
      const beneficiary: { label: string; value: any } = {
        label: this.commonService.decodeHtml(value.name),
        value: {
          label: this.commonService.decodeHtml(value.name),
          beneficiaryAddress: (value.beneficiaryAddress !== undefined && value.beneficiaryAddress !== null) ?
            this.commonService.decodeHtml(value.beneficiaryAddress) : '',
          // swiftAddressLine2: value.swiftAddress.line2,
          // swiftAddressLine3: value.swiftAddress.line3,
          currency: value.currency,
          entity: decodeURI(value.entityShortName),
          accountNumber: value.accountNumber,
          name: this.commonService.decodeHtml(value.name)
        }
      };
      this.beneficiaries.push(beneficiary);
      this.updatedBeneficiaries.push(beneficiary);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickBeneficiaryEntity(event, key) {
    if (event === true) {
      this.form
        .get('beneficiaryFirstAddress')
        .setValue(FccGlobalConstant.EMPTY_STRING);
      this.form
        .get('beneficiarySecondAddress')
        .setValue(FccGlobalConstant.EMPTY_STRING);
      this.form
        .get('beneficiaryThirdAddress')
        .setValue(FccGlobalConstant.EMPTY_STRING);
      this.form
        .get('beneficiaryAct')
        .setValue(FccGlobalConstant.EMPTY_STRING);
      this.patchFieldParameters(this.form.get('beneficiaryAct'), { readonly: false });
      this.onBlurBeneficiaryAct(event);
    }
    else if (event.value) {
      this.form.get('beneficiaryEntity').setValue(event.value);
      if (event.value.beneficiaryAddress) {
        const beneficiaryArray = event.value.beneficiaryAddress.split(',');
        const beneficiaryList = [];
        for (let i = 0; i < beneficiaryArray.length; i++) {
          beneficiaryList.push(beneficiaryArray[i]);
        }
        this.form
          .get('beneficiaryFirstAddress')
          .setValue(beneficiaryList[0] ? beneficiaryList[0] : FccGlobalConstant.EMPTY_STRING);
        this.form
          .get('beneficiarySecondAddress')
          .setValue(beneficiaryList[1] ? beneficiaryList[1] : FccGlobalConstant.EMPTY_STRING);
        this.form
          .get('beneficiaryThirdAddress')
          .setValue(beneficiaryList[2] ? beneficiaryList[2] : FccGlobalConstant.EMPTY_STRING);
      } else if (this.mode !== FccGlobalConstant.DRAFT_OPTION) {
        this.form
          .get('beneficiaryFirstAddress')
          .setValue(FccGlobalConstant.EMPTY_STRING);
        this.form
          .get('beneficiarySecondAddress')
          .setValue(FccGlobalConstant.EMPTY_STRING);
        this.form
          .get('beneficiaryThirdAddress')
          .setValue(FccGlobalConstant.EMPTY_STRING);
      }
      this.form
        .get('beneficiaryAct')
        .setValue(event.value.currency.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(event.value.accountNumber));
      this.patchFieldParameters(this.form.get('beneficiaryAct'), { readonly: true });
      this.onBlurBeneficiaryAct(event);
    }
  }

  onChangeBeneficiaryAct() {
    const accountName = this.form
      .get('beneficiaryAct').value;
    this.trimActName = accountName.toString();
    this.form.get('beneficiaryAccount').setValue(this.trimActName.trim());
    this.form.get('transfereeAccount').setValue(this.trimActName.trim());
  }

  onClickTransfererEntity(event) {
    if (event.value) {
      this.multiBankService.setCurrentEntity(event.value.shortName);
      this.patchFieldValueAndParameters(this.form.get('transfererName'), event.value.name, '');
      const entityAddress = this.multiBankService.getAddress(event.value.shortName);
      this.entities.forEach(value => {
        if (event.value.shortName === value.value.shortName) {
          if (entityAddress.Address !== undefined) {
            this.patchFieldValueAndParameters(this.form.get('transfererFirstAddress'), entityAddress.Address.line1, '');
            this.patchFieldValueAndParameters(this.form.get('transfererSecondAddress'), entityAddress.Address.line2, '');
            this.patchFieldValueAndParameters(this.form.get('transfererThirdAddress'), entityAddress.Address.line3, '');
          }
        }
      });
      this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.updateBeneficiaries() });
      this.setValueToNull(['beneficiaryFirstAddress', 'beneficiarySecondAddress', 'beneficiaryThirdAddress',
        'beneficiaryEntity']);

      if (this.updatedBeneficiaries.length === 1) {
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { autoDisplayFirst: true });
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { readonly: true });
        this.onClickBeneficiaryEntity(this.updatedBeneficiaries[0], '');
      } else {
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { readonly: false });
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { autoDisplayFirst: false });

      }
      this.getCorporateBanks();
      this.getCorporateReferences();
      this.accounts = [];
      this.accountsWithCur = [];
      this.iterateFields(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, this.form.controls);
    }
    this.addValidationforTransferName();
  }

  addValidationforTransferName() {
    const data: any = this.form.controls.transfererName;
    const maxLenth = data.params.maxlength;
    if (data.value !== null) {
      const inputdatalenth = data.value.length;
      if (inputdatalenth > maxLenth) {
        this.form.addFCCValidators('transfererName', Validators.maxLength(maxLenth), 0);
      }
    }
  }

  updateEntityValues() {
    if (this.form.get('transfererEntity') && this.form.get('transfererEntity').value) {
      const transfererEntity = this.stateService.getValue(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, 'transfererEntity', false);
      if (transfererEntity) {
        this.form.get('transfererEntity').setValue(this.entities.filter(
          task => task.value.label === transfererEntity)[0].value);
      }
    }
  }

  getCurrencyDetail() {
    if (this.form.get('currency')[FccGlobalConstant.OPTIONS].length === 0) {
      this.commonService.userCurrencies(this.curRequest).subscribe(
        response => {
          if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
            this.sessionValidation.IsSessionValid();
          } else {
            response.items.forEach(
              value => {
                const ccy: { label: string, value: any } = {
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
                this.currency.push(ccy);
              });
            this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
          }
          if (this.form.get('currency').value !== FccGlobalConstant.EMPTY_STRING) {
            const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency, 'currency', this.form);
            if (valObj) {
              this.form.get('currency').patchValue(valObj[`value`]);
            }
          }
        });
    }
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_FT, key);
  }

  saveFormOject() {
    this.stateService.setStateSection(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, this.form);
  }

  /*validation on change of currency field*/
  onClickCurrency(event) {
  this.getCurrencyDetail();
  this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
  if (event.value !== undefined) {
    this.enteredCurMethod = true;
    this.iso = event.value.currency ? event.value.currency : event.value.currencyCode;
    this.isoamt = this.iso;
    const amt = this.form.get('amount');
    this.val = amt.value;
    if(this.option !== FccGlobalConstant.TEMPLATE){
      this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD,
        Validators.compose([Validators.required, Validators.pattern(this.commonService.getRegexBasedOnlanguage())]), 0);
      this.setMandatoryField(this.form, FccGlobalConstant.AMOUNT_FIELD, true);
    }
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    this.flagDecimalPlaces = 0;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }

    if (this.val !== '' && this.val !== null) {
      let valueupdated = this.commonService.replaceCurrency(this.val);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
      this.form.get('amount').setValue(valueupdated);
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.removeMandatory(['amount'], []);
    }
    this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD);
    this.form.get('amount').updateValueAndValidity();
  }
}

onKeyupAmount() {
  const amt = this.form.get('amount');
  this.val = amt.value;
  if(this.nonNumericCurrencyValidator){
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value,
      this.form.get('currency').value.currencyCode,
      this.currencyDecimalplacesZero,
      this.currencyDecimalplacesThree)){
      return;
    }
  }
}
  /*validation on change of amount field*/
  onBlurAmount() {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
    const amt = this.form.get('amount');
    this.val = amt.value;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value,
        this.form.get('currency').value.currencyCode,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (this.val !== '') {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get('amount').setValidators(emptyCurrency);
      }

      if ((this.iso !== '' && this.commonService.isNonEmptyValue(this.iso)) && this.option !== FccGlobalConstant.TEMPLATE) {
        this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD,
          Validators.compose([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]), 0);
          if(this.option !== FccGlobalConstant.TEMPLATE){
            this.form.addFCCValidators(FccGlobalConstant.AMOUNT_FIELD,
              Validators.compose([Validators.required]), 0);
          }
        this.allowedDecimals = FccGlobalConstant.LENGTH_0;
        this.form.get('amount').setErrors({ required: true });
        let valueupdated = this.commonService.replaceCurrency(this.val);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValue(valueupdated);
        this.amountValidation();
      }
      this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
    }
  }

  onClickAmount() {
    this.OnClickAmountFieldHandler(FccGlobalConstant.AMOUNT_FIELD);
  }

  onFocusAmount() {
    this.OnClickAmountFieldHandler(FccGlobalConstant.AMOUNT_FIELD);
  }

  amountValidation() {
    const transferAmt = this.form.get('amount').value;
    const transferAmtFloatValue = parseFloat(transferAmt.toString());
    if (transferAmtFloatValue === 0 && this.option !== FccGlobalConstant.TEMPLATE) {
      this.form.get('amount').clearValidators();
      this.form.addFCCValidators('amount',
        Validators.compose([Validators.required, zeroAmount]), 0);
      this.form.get('amount').setErrors({ zeroAmount: true });
      this.form.get('amount').markAsDirty();
      this.form.get('amount').markAsTouched();
      this.form.get('amount').updateValueAndValidity();
    }
  }

  getAccounts() {
    if (this.form.get('orderingAct') || this.form.get('feeAct') || this.form.get('transfereeAct')) {
      const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      this.isStaticAccountEnabled = this.commonService.getIsStaticAccountEnabled();
      if (this.isStaticAccountEnabled) {

        this.corporateCommonService.getStaticAccounts(this.fccGlobalConstantService.getStaticDataLimit(), productCode)
          .subscribe(response => {
              this.updateAccounts(response.body);
          });
      } else {
        const subProductCode = this.form.get('transferTypeOptions').value;
        this.commonService.getUserProfileAccount(productCode, this.entityName, subProductCode).subscribe(
          accountsResponse => {
            this.updateAccounts(accountsResponse);
          });
      }
    }
  }

  updateAccounts(body: any) {
    this.accountDetailsList = body;
    let emptyCheck = true;
    if (this.entityName !== undefined && this.entityName !== '') {
      this.accountDetailsList.items.forEach(value => {
        if ((this.isStaticAccountEnabled && (this.entityName === value.entityShortName || value.entityShortName === '*')) ||
      (!this.isStaticAccountEnabled)) {
          if (emptyCheck) {
            const empty = this.commonService.getEmptyAccount();
            if(this.accounts.findIndex((item) => item.label === empty.label) < 0) {
              this.accounts.push(empty);
            }
            emptyCheck = false;
          }
          if (value.currency) {
            const accountWithCur: { label: string; value: any } = {
              label: value.currency.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(value.number),
              value: {
                label: value.number,
                currency: value.currency
              }
            };
            if(this.accounts.findIndex((item) => item.value.label === accountWithCur.value.label) < 0) {
              this.accountsWithCur.push(accountWithCur);
            }
          }
          const account = this.commonService.getUpdatedAccount(value);
          if(this.accounts.findIndex((item) => item.label === account.label) < 0) {
            this.accounts.push(account);
          }

        }
      });
      this.patchFieldParameters(this.form.get('orderingAct'), { options: this.getUpdatedAccountsWithCur() });
      this.patchFieldParameters(this.form.get('transfereeAct'), { options: this.getUpdatedAccountsWithCur() });
      this.patchFieldParameters(this.form.get('feeAct'), { options: this.getUpdatedAccounts() });

    } else if (this.entityNameRendered !== undefined) {
      this.accountDetailsList.items.forEach(value => {
        if (emptyCheck) {
          const empty = this.commonService.getEmptyAccount();
          this.accounts.push(empty);
          emptyCheck = false;
        }
        if (value.entityShortName === '*') {
          const account = this.commonService.getUpdatedAccount(value);
          if (value.currency) {
            const accountWithCur: { label: string; value: any } = {
              label: value.currency.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(value.number),
              value: {
                label: value.number,
                currency: value.currency
              }
            };
            this.accountsWithCur.push(accountWithCur);
          }
          this.accounts.push(account);
        }
      });
      this.patchFieldParameters(this.form.get('orderingAct'), { options: this.getUpdatedAccountsWithCur() });
      this.patchFieldParameters(this.form.get('transfereeAct'), { options: this.getUpdatedAccountsWithCur() });
      this.patchFieldParameters(this.form.get('feeAct'), { options: this.getUpdatedAccounts() });
    } else {
      this.accountDetailsList.items.forEach(value => {
        if (emptyCheck) {
          const empty = this.commonService.getEmptyAccount();
          this.accounts.push(empty);
          emptyCheck = false;
        }
        if (value.currency) {
          const accountWithCur: { label: string; value: any } = {
            label: value.currency.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(value.number),
            value: {
              label: value.number,
              currency: value.currency
            }
          };
          this.accountsWithCur.push(accountWithCur);
        }
        const account = this.commonService.getUpdatedAccount(value);
        this.accounts.push(account);
      });
      this.patchFieldParameters(this.form.get('orderingAct'), { options: this.getUpdatedAccountsWithCur() });
      this.patchFieldParameters(this.form.get('transfereeAct'), { options: this.getUpdatedAccountsWithCur() });
      this.patchFieldParameters(this.form.get('feeAct'), { options: this.getUpdatedAccounts() });
    }
    if (this.entityName === undefined && this.entitiesList > 1) {
      this.patchFieldParameters(this.form.get('orderingAct'), { options: [] });
      this.patchFieldParameters(this.form.get('transfereeAct'), { options: [] });
      this.patchFieldParameters(this.form.get('feeAct'), { options: [] });
    }
    this.updateBankValue();

    if(this.form.get('feeAct')[this.params].required ){
      let feeActOptions = this.getUpdatedAccounts();
      if(feeActOptions){
        feeActOptions = feeActOptions.filter((item) =>item.label !== "");
         this.patchFieldParameters(this.form.get('feeAct'), { options: feeActOptions });
      }
    }
  }

  getCorporateBanks() {
    this.setBankNameList();
    const isDefaultFirst = this.corporateBanks.length === FccGlobalConstant.LENGTH_1;
    const val = this.dropdownAPIService
    .getInputDropdownValue(this.corporateBanks, FccGlobalConstant.BANK_NAME_LIST, this.form,isDefaultFirst);
      this.patchFieldParameters(this.form.get('bankNameList'), { options: this.corporateBanks });
      this.form.get('bankNameList').setValue(val);
      this.multiBankService.setCurrentBank(val);
      const taskBank = this.corporateBanks.filter((item) => item.value === val);
      if (this.commonService.getUserDateTimezone() && taskBank && taskBank.length > 0 &&
        this.commonService.getUserDateTimezone().getValue() &&
        this.commonService.getUserDateTimezone().getValue() !== taskBank[0].timezone) {
        this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.mode == FccGlobalConstant.VIEW && (this.operation == FccGlobalConstant.LIST_INQUIRY ||
          this.operation == FccGlobalConstant.PREVIEW) ) {
        const valObj = { label: String, value: String };
        const valueDisplayed = this.dropdownAPIService
        .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.BANK_NAME_LIST, this.form);
        valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
        if (valObj && valObj.label) {this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
        if(this.stateService.getSectionData(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE ))
        {
          this.stateService.getSectionData(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
          .get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
        }
      }
    }
    this.form.get("bankNameList").updateValueAndValidity();
  }

  setBankNameList() {
    if (this.nameOrAbbvName === 'abbv_name') {
      this.corporateBanks = [];
      this.multiBankService.getBankList().forEach(bank => {
        bank.label = bank.value;
        this.corporateBanks.push(bank);
      });
    } else {
      this.corporateBanks = [];
      this.multiBankService.getBankList().forEach(bank => {
        this.corporateBanks.push(bank);
      });
    }
  }

  onClickBankNameList(event) {
    this.multiBankService.setCurrentBank(event.value);
    const taskBank = this.corporateBanks.filter((item) => item.value === event.value);
    if (this.commonService.getUserDateTimezone() && taskBank && taskBank.length > 0 &&
    this.commonService.getUserDateTimezone().getValue() &&
    this.commonService.getUserDateTimezone().getValue() !== taskBank[0].timezone) {
    this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
  } else {
    this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  }
    this.setIssuerReferenceList();
  }

  getCorporateReferences() {
    this.corporateReferences = [];
    this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: [] });
    if (this.form.get('transfererEntity').value) {
      this.entityName = this.form.get('transfererEntity').value.shortName ?
      this.form.get('transfererEntity').value.shortName :
      this.form.get('transfererEntity').value;
    }
    if (this.form.get(FccGlobalConstant.TRANSFERER_ENTITY).value) {
      this.entityName = this.form.get(FccGlobalConstant.TRANSFERER_ENTITY).value.shortName ?
      this.form.get(FccGlobalConstant.TRANSFERER_ENTITY).value.shortName :
      this.form.get(FccGlobalConstant.TRANSFERER_ENTITY).value;
    }
    if (this.entityName === '') {
      this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    } else {
      this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
    }
    this.setIssuerReferenceList();
  }

  setIssuerReferenceList() {
    this.corporateReferences = [];
    this.multiBankService.getReferenceList().forEach(reference => {
      this.corporateReferences.push(reference);
    });
    if (this.corporateReferences.length > 0) {
      const isDefaultFirst = this.corporateBanks.length === FccGlobalConstant.LENGTH_1;
      let val = this.dropdownAPIService.getInputDropdownValue(this.corporateReferences, 'issuerReferenceList', this.form, isDefaultFirst);
      this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: this.corporateReferences });
      val = this.multiBankService.updateRefonEntityChange && !isDefaultFirst && !val ? '' : val;
      this.form.get('issuerReferenceList').setValue(val);
      if (this.mode == FccGlobalConstant.VIEW && (this.operation == FccGlobalConstant.LIST_INQUIRY ||
          this.operation == FccGlobalConstant.PREVIEW) ) {
        const valObj = { label: String, value: String };
        const valueDisplayed = this.dropdownAPIService.getDropDownFilterValueObj(this.corporateReferences,
          FccGlobalConstant.ISSUER_REFERENCE_LIST, this.form);
          if (valueDisplayed !== undefined && valueDisplayed[FccGlobalConstant.LABEL] !== undefined ){
        valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
        if (valObj && valObj.label )
        {
        this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
        if(this.stateService.getSectionData(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))
        {
          this.stateService.getSectionData(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
          .get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
        }
      }
    }
    }
  }
  else{
    if (this.mode == FccGlobalConstant.VIEW && (this.operation == FccGlobalConstant.LIST_INQUIRY ||
      this.operation == FccGlobalConstant.PREVIEW)
      && (this.stateService.getSectionData(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))) {
         this.stateService.getSectionData(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
         .get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST).value);
      }
  }
    }

  iterateControls(title, mapValue) {
    let value;
    if (mapValue !== undefined) {
      Object.keys(mapValue).forEach((key, index) => {
        if (index === 0) {
          value = mapValue.controls;
          this.iterateFields(title, value);
        }
      });
    } else {
      this.getAccounts();
    }
  }

  iterateFields(title, myvalue) {
    Object.keys(myvalue).forEach((key) => {
      if (myvalue[key].type === 'input-dropdown-filter' && myvalue[key].key === 'transfererEntity') {
        this.entityName = myvalue[key].value && myvalue[key].value.shortName ? myvalue[key].value.shortName : myvalue[key].value;
        this.entityNameRendered = myvalue[key].params.rendered;
        this.entitiesList = myvalue[key].options.length;
      }
    });
    this.getAccounts();
  }

  getUpdatedAccounts(): any[] {
    return this.accounts;
  }

  getUpdatedAccountsWithCur(): any[] {
    return this.accountsWithCur;
  }

  updateEntityBeneValues(currency) {
    if (currency) {
      const exists = this.currency.filter(
        task => task.value.label === currency);
      if (exists.length > 0) {
        this.form.get('currency').setValue(this.currency.filter(
          task => task.value.label === currency)[0].value);
        this.form.updateValueAndValidity();
      }
    }
  }

  onClickTransfereeAct(event) {
    this.accountValidation(this.transfereeActField);
    this.updateEntityBeneValues(event.value.currency);
    if (event.value) {
      this.form.get('transfereeAccount').setValue(event.value.label);
      this.form.get('transfereeCurrency').setValue(event.value.currency);
    }
    this.onClickCurrency(event);
    this.renderForwardContract();
  }

  accountValidation(fieldName: string) {
    if (fieldName === this.transfereeActField && this.form.get(this.transfereeActField).value) {
      this.form.get(this.transfereeActField).clearValidators();
      this.form.get(this.transfereeActField).updateValueAndValidity();
    }
    if (fieldName === this.orderingActField && this.form.get(this.orderingActField).value) {
      this.form.get(this.orderingActField).clearValidators();
      this.form.get(this.orderingActField).updateValueAndValidity();
    }
    if (this.form.get(this.transfereeActField).value !== '' &&
      this.form.get(this.transfereeActField).value.label === this.form.get(this.orderingActField).value.label) {
      if (fieldName === this.transfereeActField) {
        this.form.get(this.transfereeActField).setValidators(orderingAndTransfereeAccountNotBeSame);
        this.form.get(this.transfereeActField).updateValueAndValidity();
      } else {
        this.form.get(this.orderingActField).setValidators(orderingAndTransfereeAccountNotBeSame);
        this.form.get(this.orderingActField).updateValueAndValidity();
      }
    }
  }

  onBlurBeneficiaryAct(event) {
    this.updateEntityBeneValues(event.value.currency);
    if (event.value) {
      this.form.get('beneficiaryAccount').setValue(event.value.accountNumber);
      this.form.get('beneficiaryCurrency').setValue(event.value.currency);
      this.form.get('transfereeAccount').setValue(event.value.accountNumber);
      this.form.get('transfereeCurrency').setValue(event.value.currency);
    }
    this.onClickCurrency(event);
    this.renderForwardContract();
  }

  onClickOrderingAct(event) {
    this.accountValidation(this.orderingActField);
    this.form.get('orderingAccount').setValue(event.value.label);
    this.form.get('orderingCurrency').setValue(event.value.currency);
    this.renderForwardContract();
  }

  renderForwardContract() {
    if (this.form.get('orderingCurrency') && this.form.get('orderingCurrency').value ||
      this.form.get('transfereeAct') && this.form.get('transfereeAct').value.currency ||
      this.form.get('beneficiaryCurrency') && this.form.get('beneficiaryCurrency').value) {
      const orderingCurrency = this.form.get('orderingCurrency').value;
      const transfereeAct = this.form.get('transfereeAct').value.currency;
      const beneficiaryCurrency = this.form.get('beneficiaryCurrency').value;
      this.form.get('forwardContract').setValue(FccGlobalConstant.EMPTY_STRING);
      if (orderingCurrency && transfereeAct && orderingCurrency !== transfereeAct) {
        this.form.get('forwardContract')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else if (orderingCurrency && beneficiaryCurrency && orderingCurrency !== beneficiaryCurrency) {
        this.form.get('forwardContract')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        this.form.get('forwardContract')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
    }
  }

  updateBankValue() {
    if ((this.form.get('orderingAct') && this.form.get('orderingAct').value) ||
      (this.form.get('feeAct') && this.form.get('feeAct').value) ||
      (this.form.get('transfereeAct') && this.form.get('transfereeAct').value)) {
      const orderingAct = this.mode === FccGlobalConstant.DRAFT_OPTION ?
        this.stateService.getValue(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, 'orderingAct', false) :
        this.form.get('orderingAct').value;
      const transfereeAct = this.mode === FccGlobalConstant.DRAFT_OPTION ?
        this.stateService.getValue(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, 'transfereeAct', false) :
        this.form.get('transfereeAct').value;
      const feeAct = this.form.get('feeAct').value;
      let exists = this.accountsWithCur.filter(
        task => (this.mode === FccGlobalConstant.DRAFT_OPTION ? task.value.label === orderingAct :
          task.value.label === orderingAct.label));
      if (exists.length > 0) {
        this.form.get('orderingAct').setValue(this.accountsWithCur.filter(
          task => (this.mode === FccGlobalConstant.DRAFT_OPTION ? task.value.label === orderingAct :
            task.value.label === orderingAct.label))[0].value);
      }
      exists = this.accounts.filter(
        task => task.label === feeAct);
      if (exists.length > 0) {
        this.form.get('feeAct').setValue(this.accounts.filter(
          task => task.label === feeAct)[0].value);
      }
      exists = this.accountsWithCur.filter(
        task => (this.mode === FccGlobalConstant.DRAFT_OPTION ? task.value.label === transfereeAct :
          task.value.label === transfereeAct.label));
      if (exists.length > 0) {
        this.form.get('transfereeAct').setValue(this.accountsWithCur.filter(
          task => (this.mode === FccGlobalConstant.DRAFT_OPTION ? task.value.label === transfereeAct :
            task.value.label === transfereeAct.label))[0].value);
      }
    }
    const exist1 = this.accounts.filter(task => task.label === this.form.get('feeAct').value.label);
    if(this.form.get('feeAct').value && exist1 !== null && exist1.length > 0){
      this.patchFieldValueAndParameters(this.form.get('feeAct'),this.accounts.filter(
        task => task.label === this.form.get('feeAct').value.label)[0].value, {});
    }
    this.form.updateValueAndValidity();
  }

  updateBeneValues() {
    if (this.form.get('beneficiaryEntity') && this.form.get('beneficiaryEntity').value && this.mode === FccGlobalConstant.DRAFT_OPTION) {
      const beneficiaryEntity = this.stateService.getValue(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS, 'beneficiaryEntity', false);
      if (beneficiaryEntity) {
        const beneficiaryNameLabel = this.updatedBeneficiaries.filter(task => task.value.label === beneficiaryEntity);
        const beneficiaryName = this.updatedBeneficiaries.filter(task => task.value.name === beneficiaryEntity);
        if (beneficiaryNameLabel !== undefined && beneficiaryNameLabel !== null && beneficiaryNameLabel.length > 0) {
          this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).setValue(beneficiaryNameLabel[0].value.name);
        } else if (beneficiaryName !== undefined && beneficiaryName !== null && beneficiaryName.length > 0) {
          this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).setValue(beneficiaryName[0].value);
        }
      }
    }
    else if (this.benePreviousValue !== undefined && this.benePreviousValue !== null) {
      this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).setValue(this.benePreviousValue);
    }
    if (this.beneficiaryFirstAddressVal !== undefined && this.beneficiaryFirstAddressVal !== null) {
      this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_1).setValue(this.beneficiaryFirstAddressVal);
    }
    if (this.beneficiarySecondAddressVal !== undefined && this.beneficiarySecondAddressVal !== null) {
      this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_2).setValue(this.beneficiarySecondAddressVal);
    }
    if (this.beneficiaryThirdAddressVal !== undefined && this.beneficiaryThirdAddressVal !== null) {
      this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_3).setValue(this.beneficiaryThirdAddressVal);
    }
    if (this.beneficiaryActVal !== undefined && this.beneficiaryActVal !== null) {
      this.form.get(FccGlobalConstant.BENEFICIARY_ACC).setValue(this.beneficiaryActVal);
    }
    this.form.get(FccGlobalConstant.TRANSFERER_NAME).setValue(this.form.get(FccGlobalConstant.TRANSFERER_NAME).value);
    this.form.get(FccGlobalConstant.TRANSFERER_FIRST_ADDRESS).setValue(this.form.get(FccGlobalConstant.TRANSFERER_FIRST_ADDRESS).value);
    this.form.get(FccGlobalConstant.TRANSFERER_SECOND_ADDRESS).setValue(this.form.get(FccGlobalConstant.TRANSFERER_SECOND_ADDRESS).value);
    this.form.get(FccGlobalConstant.TRANSFERER_THIRD_ADDRESS).setValue(this.form.get(FccGlobalConstant.TRANSFERER_THIRD_ADDRESS).value);
    this.form.updateValueAndValidity();
  }

  onClickNext() {
    this.saveFormOject();
    if (!CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
      this.saveDraftService.changeSaveStatus(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS,
        this.stateService.getSectionData(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS));
    }
    if (this.form.valid && !CommonService.isTemplateCreation) {
      this.leftSectionService.addSummarySection();
    }
    if (this.form.invalid) {
      this.leftSectionService.removeSummarySection();
    }
  }
  onClickExecutionDate() {
    let executionDate = this.form.get(FccGlobalConstant.EXECUTION_DATE).value;
    const currentDate = this.commonService.getBankDateForComparison();
    if ((executionDate !== null && executionDate !== '')) {
      executionDate = `${executionDate.getDate()}/${(executionDate.getMonth() + 1)}/${executionDate.getFullYear()}`;
      executionDate = (executionDate !== '' && executionDate !== null) ?
        this.commonService.convertToDateFormat(executionDate) : '';
      this.form.get(FccGlobalConstant.EXECUTION_DATE).clearValidators();
      if (executionDate !== '' && (executionDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0))) {
        this.form.get(FccGlobalConstant.EXECUTION_DATE).setValidators([compareExecutionDateToCurrentDate]);
        this.form.get(FccGlobalConstant.EXECUTION_DATE).updateValueAndValidity();
      } else {
        this.form.get(FccGlobalConstant.EXECUTION_DATE).clearValidators();
        this.form.get(FccGlobalConstant.EXECUTION_DATE).updateValueAndValidity();
      }
    } else {
      this.form.get(FccGlobalConstant.EXECUTION_DATE).clearValidators();
      this.form.get(FccGlobalConstant.EXECUTION_DATE).setValidators([invalidDate]);
      this.form.get(FccGlobalConstant.EXECUTION_DATE).updateValueAndValidity();
    }
  }
  hideBeneficiarySection(subProductCode) {
    if (subProductCode && subProductCode === FccGlobalConstant.FT_TINT) {
      this.form.get('modeofTransmission')[this.params][this.rendered] = false;
      this.form.get('transmissionModeFund')[this.params][this.rendered] = false;
      this.form.get('chargeType')[this.params][this.rendered] = false;
      this.form.get('chargeOptions')[this.params][this.rendered] = false;
      this.form.get('beneficiaryAct')[this.params][this.rendered] = false;
      this.form.get('beneficiaryAct')[this.params][this.required] = false;
      this.form.get('beneficiaryHeader')[this.params][this.rendered] = false;
      this.form.get('beneficiaryEntity')[this.params][this.rendered] = false;
      this.form.get('beneficiaryEntity')[this.params][this.required] = false;
      this.form.get('beneficiaryEntity').updateValueAndValidity();
      this.form.get('beneficiaryFirstAddress')[this.params][this.rendered] = false;
      this.form.get('beneficiaryFirstAddress')[this.params][this.required] = false;
      this.form.get('beneficiarySecondAddress')[this.params][this.rendered] = false;
      this.form.get('beneficiaryThirdAddress')[this.params][this.rendered] = false;
      this.form.get('transfereeAct')[this.params][this.rendered] = true;
      this.form.get('transfereeAct')[this.params][this.required] = true;
      this.form.get('transfereeDescription')[this.params][this.rendered] = true;
      this.form.get('transfereeDescription')[this.params][this.required] = false;
      this.form.get('forwardContract')[this.params][this.rendered] = false;
      this.form.get('accountWithBank')[this.params][this.rendered] = false;
      this.form.get('advisingswiftCode')[this.params][this.rendered] = false;
      this.form.get('advisingBankIcons')[this.params][this.rendered] = false;
      this.form.get('advisingBankName')[this.params][this.rendered] = false;
      this.form.get('advisingBankFirstAddress')[this.params][this.rendered] = false;
      this.form.get('advisingBankSecondAddress')[this.params][this.rendered] = false;
      this.form.get('advisingBankThirdAddress')[this.params][this.rendered] = false;
      this.form.get('bankDetailsType')[this.params][this.rendered] = false;
      this.form.get('payThroughBank')[this.params][this.rendered] = false;
      this.form.get('advThroughswiftCode')[this.params][this.rendered] = false;
      this.form.get('advThroughBankIcons')[this.params][this.rendered] = false;
      this.form.get('adviceThroughFirstAddress')[this.params][this.rendered] = false;
      this.form.get('adviceThroughName')[this.params][this.rendered] = false;
      this.form.get('adviceThroughSecondAddress')[this.params][this.rendered] = false;
      this.form.get('adviceThroughThirdAddress')[this.params][this.rendered] = false;
    } else {
      this.form.get('modeofTransmission')[this.params][this.rendered] = true;
      this.form.get('transmissionModeFund')[this.params][this.rendered] = true;
      this.form.get('chargeType')[this.params][this.rendered] = true;
      this.form.get('chargeOptions')[this.params][this.rendered] = true;
      this.form.get('beneficiaryAct')[this.params][this.rendered] = true;
      this.form.get('beneficiaryAct')[this.params][this.required] = true;
      this.form.get('beneficiaryHeader')[this.params][this.rendered] = true;
      this.form.get('beneficiaryEntity')[this.params][this.rendered] = true;
      this.form.get('beneficiaryEntity')[this.params][this.required] = true;
      this.form.get('beneficiaryFirstAddress')[this.params][this.rendered] = true;
      this.form.get('beneficiaryFirstAddress')[this.params][this.required] = true;
      this.form.get('beneficiarySecondAddress')[this.params][this.rendered] = true;
      this.form.get('beneficiaryThirdAddress')[this.params][this.rendered] = true;
      this.form.get('transfereeAct')[this.params][this.rendered] = false;
      this.form.get('transfereeAct')[this.params][this.required] = false;
      this.form.get('transfereeDescription')[this.params][this.rendered] = false;
      this.form.get('transfereeDescription')[this.params][this.required] = false;
      this.form.get('forwardContract')[this.params][this.rendered] = false;
    }
  }
  onClickCreateFromOptions(data: any) {
    if (data.value === FccTradeFieldConstants.EXISTING_FT) {
      this.currentCreateForm = data.value;
      this.onClickExistingFT();
    } else if (data.value === FccGlobalConstant.TEMPLATE_VALUE) {
      this.currentCreateForm = data.value;
      this.onClickExistingTemplate();
    }
  }

  onClickExistingFT() {
    this.form.get('createFromOptions').setValue('');
    this.copyFrom = true;
    this.setFieldsArrayNdSectionsData(false, FccGlobalConstant.PRODUCT_FT);
    const header = `${this.translateService.instant('existingFTList')}`;
    const productCode = FccGlobalConstant.PRODUCT;
    const headerDisplay = FccGlobalConstant.HEADER_DISPLAY;
    const buttons = FccGlobalConstant.BUTTONS;
    const savedList = FccGlobalConstant.SAVED_LIST;
    const option = FccGlobalConstant.OPTION;
    const defaultFilterCriteria = FccGlobalConstant.DEFAULT_CRITERIA;
    const downloadIconEnabled = FccGlobalConstant.DOWNLOAD_ICON_ENABLED;
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_FT;
    obj[option] = 'Existing';
    if(this.form.get('transferTypeOptions').value == FccGlobalConstant.FT_TTPT){
      this.defaultFilterCriteria[FccGlobalConstant.FT_TYPE] = FccGlobalConstant.CODE_02;
    } else {
      this.defaultFilterCriteria[FccGlobalConstant.FT_TYPE] = FccGlobalConstant.CODE_01;
    }
    obj[defaultFilterCriteria] = this.defaultFilterCriteria;
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    this.resolverService.getSearchData(header, obj);
    this.ftDetailsResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        const prodCode = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
          && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
          FccGlobalConstant.PRODUCT_FT : undefined;
        const eventIdToPass = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
          && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
          response.responseData.TNX_ID : response.responseData.REF_ID;
        this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_FT);
        this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_FT).subscribe(apiMappingModel => {
          this.transactionDetailService.fetchTransactionDetails(eventIdToPass, prodCode, false).subscribe(responseData => {
            const responseObj = responseData.body;
            const setStateForProduct = {
              responseObject: responseObj,
              apiModel: apiMappingModel,
              isMaster: false,
              fieldsList: this.fieldsArray,
              sectionsList: this.sectionsArray
            };
            this.commonService.productState.next(setStateForProduct);
            this.form = this.stateService.getSectionData(FccGlobalConstant.FT_GENERAL_DETAILS);
            if (!this.fieldsArray || this.fieldsArray.length === 0) {
              this.stateService.getSectionData(FccGlobalConstant.FT_GENERAL_DETAILS).get('issuerReferenceList').
              setValue(FccGlobalConstant.EMPTY_STRING);
            }
            this.handlecopyFromFields(response);
            this.patchFieldParameters(this.form.get('bankDetailsType'), { options: this.getSelectButtonArray() });
            this.form.get('bankDetailsType').setValue('issuingBank');
			this.updateUserEntities();
            const entityVal = setStateForProduct.responseObject.entity;
            this.form.get('transfererEntity').setValue(entityVal);
            const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, 'transfererEntity', this.form);
            if (valObj) {
              this.patchFieldParameters(this.form.get('transfererEntity'), { options: this.entities });
              this.form.get('transfererEntity').patchValue(valObj[this.VALUE]);
            }
            const subProdCode = setStateForProduct.responseObject.sub_product_code;
            this.getCurrencyDetail();
            this.hideBeneficiarySection(subProdCode);
            const valObjBene = this.dropdownAPIService.getDropDownFilterValueObj(this.beneficiaries, 'beneficiaryEntity', this.form);
            if (valObjBene && valObjBene[this.VALUE]) {
              this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.beneficiaries });
              this.form.get('beneficiaryEntity').patchValue(valObjBene[this.VALUE]);
              if (this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value !== undefined &&
                this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value !== FccGlobalConstant.EMPTY_STRING) {
                this.benePreviousValue = this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value;
				const beneficiaryArray = valObjBene[this.VALUE].beneficiaryAddress.split(',');
                const beneficiaryList = [];
                for (let i = 0; i < beneficiaryArray.length; i++) {
                  beneficiaryList.push(beneficiaryArray[i]);
                }
                this.patchFieldValueAndParameters(this.form.get('beneficiaryFirstAddress'), beneficiaryList[0], '');
                this.patchFieldValueAndParameters(this.form.get('beneficiarySecondAddress'), beneficiaryList[1], '');
                this.patchFieldValueAndParameters(this.form.get('beneficiaryThirdAddress'), beneficiaryList[2], '');
                this.patchFieldValueAndParameters(this.form.get('beneficiaryAct'), valObjBene[this.VALUE].accountNumber, '');
              }
            }
            const valObjOrder = this.dropdownAPIService.getDropDownFilterValueObj(this.getUpdatedAccountsWithCur(),
             'orderingAct', this.form);
            if (valObjOrder) {
              this.patchFieldParameters(this.form.get('orderingAct'), { options: this.getUpdatedAccountsWithCur() });
              this.form.get('orderingAct').patchValue(valObjOrder[this.VALUE]);
            }
            const valObjTransfer = this.dropdownAPIService.getDropDownFilterValueObj(this.accountsWithCur, 'transfereeAct', this.form);
            if (valObjTransfer && valObjTransfer[this.VALUE]) {
              this.patchFieldParameters(this.form.get('transfereeAct'), { options: this.accountsWithCur });
              this.form.get('transfereeAct').patchValue(valObjTransfer[this.VALUE]);
            }
            this.onClickBankDetailsType(this.form.get('bankDetailsType'));
            this.patchFieldParameters(this.form.get('feeAct'), { options: this.getUpdatedAccounts() });
            this.leftSectionService.reEvaluateProgressBar.next(true);
            this.transfererEntity = this.stateService.getSectionData('ftTradeGeneralDetails').get('transfererEntity');
            if (this.transfererEntity.value) {
              this.multiBankService.setCurrentEntity(this.transfererEntity.value.shortName);
            }
            this.form.get('transfererName')
            .patchValue(this.stateService.getSectionData('ftTradeGeneralDetails').get('transfererName').value);
            this.form.get('transfererFirstAddress')
            .patchValue(this.stateService.getSectionData('ftTradeGeneralDetails').get('transfererFirstAddress').value);
            this.form.get('transfererSecondAddress')
            .patchValue(this.stateService.getSectionData('ftTradeGeneralDetails').get('transfererSecondAddress').value);
            this.form.get('transfererThirdAddress')
            .patchValue(this.stateService.getSectionData('ftTradeGeneralDetails').get('transfererThirdAddress').value);
            this.form.get('paymentDetalsTransferee')
            .patchValue(this.stateService.getSectionData('ftTradeGeneralDetails').get('paymentDetalsTransferee').value);
            this.form.get('otherInst')
            .patchValue(this.stateService.getSectionData('ftTradeGeneralDetails').get('otherInst').value);
            this.form.get('transfereeDescription')
            .patchValue(this.stateService.getSectionData('ftTradeGeneralDetails').get('transfereeDescription').value);
            this.initializeFormGroup();
          });
        });
      }
    });
  }

  handlecopyFromFields(response?: any) {
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccTradeFieldConstants.EXISTING_FT);
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
    this.form.get(FccTradeFieldConstants.REFERENCE_SELECTED)[this.params][this.rendered] = true;
    this.form.get(FccTradeFieldConstants.FETCH_REF_VALUE)[this.params][this.rendered] = true;
    this.form.get(FccTradeFieldConstants.FETCH_REF_VALUE)[this.params][this.rendered] = true;
    this.form.get(FccTradeFieldConstants.REMOVE_LABEL)[this.params][this.rendered] = true;
    if ( this.mode === FccGlobalConstant.DRAFT_OPTION &&
      this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.PARENT_REF).value)) {
      this.form.get(FccTradeFieldConstants.REMOVE_LABEL)[this.params][this.rendered] = false;
    }
    if (this.commonService.isNonEmptyValue(response)){
      this.form.get(FccTradeFieldConstants.FETCH_REF_VALUE).patchValue(response.responseData.REF_ID);
      this.form.get('parentReference').patchValue(response.responseData.REF_ID);
    } else if (this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.PARENT_REF).value)){
      this.form.get(FccGlobalConstant.FETCH_REF_VALUE).patchValue(this.form.get(FccGlobalConstant.PARENT_REF).value);
    }
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.FETCH_REF_VALUE), { readonly: true });
    const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
    this.toggleCreateFormButtons(val, null, true);
   }

  setFieldsArrayNdSectionsData(isTemplate: boolean, productCode: string) {
    this.revertCopyFromDetails();
    this.excludingJsonFileKey = productCode + FccGlobalConstant.TRANSACTION;
    if (this.excludedFieldsNdSections) {
      this.fieldsArray = this.excludedFieldsNdSections[this.excludingJsonFileKey].fields;
      this.sectionsArray = this.excludedFieldsNdSections[this.excludingJsonFileKey].sections;
    }
  }

  revertCopyFromDetails() {
    this.copyFromProductCode = '';
    this.excludingJsonFileKey = '';
    this.fieldsArray = [];
    this.sectionsArray = [];
  }

  onClickExistingTemplate() {

    this.form.get('createFromOptions').setValue('');
    const header = `${this.translateService.instant('templateListingForFT')}`;
    const productCode = FccGlobalConstant.PRODUCT;
    const subProductCode = FccGlobalConstant.SUB_PRODUCT_CODE;
    const headerDisplay = FccGlobalConstant.HEADER_DISPLAY;
    const buttons = FccGlobalConstant.BUTTONS;
    const savedList = FccGlobalConstant.SAVED_LIST;
    const option = FccGlobalConstant.OPTION;
    const downloadIconEnabled = FccGlobalConstant.DOWNLOAD_ICON_ENABLED;
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_FT;
    obj[option] = FccGlobalConstant.CREATE_FROM_TEMPLATE;
    obj[subProductCode] = '';
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    this.commonService.actionsDisable = true;
    this.commonService.buttonsDisable = true;
    this.resolverService.getSearchData(header, obj);
    this.templateResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        this.getTemplateById(response.responseData.TEMPLATE_ID, response.responseData.SUB_PRODUCT_CODE);
      }
    });
  }

  getTemplateById(templateID, subProductCode) {
    this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_FT);
    this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_FT).subscribe(apiMappingModel => {
      this.transactionDetailService.fetchTransactionDetails(templateID, FccGlobalConstant.PRODUCT_FT, true, subProductCode)
        .subscribe(responseData => {
          const responseObj = responseData.body;
          const setStateForProduct = {
            responseObject: responseObj,
            apiModel: apiMappingModel,
            isMaster: false
          };
          this.commonService.productState.next(setStateForProduct);
          this.form = this.stateService.getSectionData(this.sectionName);
          this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
          this.form.get('templateSelection')[this.params][this.rendered] = true;
          this.form.get('fetchedTemplate')[this.params][this.rendered] = true;
          this.form.get('removeLabelTemplate')[this.params][this.rendered] = true;
          const element = document.createElement('div');
          element.innerHTML = templateID;
          templateID = element.textContent;
          this.form.get('fetchedTemplate').patchValue(templateID);
          this.patchFieldParameters(this.form.get('fetchedTemplate'), { readonly: true });
          this.form.get('transfereeReference').setValue('');
          this.form.get('customerReference').setValue('');
          const subProdCode = setStateForProduct.responseObject.sub_product_code;
          this.form.get('transferTypeOptions').setValue(subProdCode);
          this.hideBeneficiarySection(subProdCode);
          this.getCurrencyDetail();
          this.form.get('amount').setValue('');
          this.form.get('executionDate').setValue('');
          this.patchFieldParameters(this.form.get('bankDetailsType'), { options: this.getSelectButtonArray() });
          this.form.get('bankDetailsType').setValue('issuingBank');
          const entityVal = setStateForProduct.responseObject.entity;
          this.form.get('transfererEntity').setValue(entityVal);
          this.iterateControls(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS,
            this.stateService.getSectionData(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS));
          const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, 'transfererEntity', this.form);
          if (valObj) {
            this.patchFieldParameters(this.form.get('transfererEntity'), { options: this.entities });
            this.form.get('transfererEntity').patchValue(valObj[this.VALUE]);
          }
          if (this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value !== undefined &&
          this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value !== FccGlobalConstant.EMPTY_STRING) {
           this.benePreviousValue = this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value;
           const curr = this.form.get(FccGlobalConstant.BENEFICIARY_CURR)?.value;
           this.beneficiaryActVal = curr.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(
            this.form.get(FccGlobalConstant.BENEFICIARY_ACC)?.value);
          }
          this.updateDataOnTemplateLoad();
          this.getBeneficiaries();
          this.updateBeneficiaries();
          const valObjBene = this.dropdownAPIService.getDropDownFilterValueObj(this.beneficiaries, 'beneficiaryEntity', this.form);
          if (valObjBene && valObjBene[this.VALUE]) {
            this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.beneficiaries });
            this.form.get('beneficiaryEntity').patchValue(valObjBene[this.VALUE]);
          }
          this.updateBeneValues();
          const valObjOrder = this.dropdownAPIService.getDropDownFilterValueObj(this.getUpdatedAccountsWithCur(), 'orderingAct', this.form);
          if (valObjOrder) {
            this.patchFieldParameters(this.form.get('orderingAct'), { options: this.getUpdatedAccountsWithCur() });
            this.form.get('orderingAct').patchValue(valObjOrder[this.VALUE]);
          }
          const valObjTransfer = this.dropdownAPIService.getDropDownFilterValueObj(this.accountsWithCur, 'transfereeAct', this.form);
          if (valObjTransfer && valObjTransfer[this.VALUE]) {
            this.patchFieldParameters(this.form.get('transfereeAct'), { options: this.accountsWithCur });
            this.form.get('transfereeAct').patchValue(valObjTransfer[this.VALUE]);
          }
          this.onClickBankDetailsType(this.form.get('bankDetailsType'));
          this.patchFieldParameters(this.form.get('feeAct'), { options: this.getUpdatedAccounts() });
        });
    });
  }
  onClickRemoveLabelTemplate() {
    this.templateKey = FccGlobalConstant.TEMPLATEFROM_KEY;
    this.onClickRemoveLabel();
  }

  onKeyupRemoveLabel() {
    this.onClickRemoveLabel();
  }

  onKeyupRemoveLabelTemplate() {
    this.onClickRemoveLabelTemplate();
  }

  onClickRemoveLabel() {
    const dir = localStorage.getItem('langDir');
    this.commonService.setParentReference(null);
    const headerField = `${this.translateService.instant('removeSelectedTransaction')}`;
    const obj = {};
    const locaKey = 'locaKey';
    if (this.templateKey) {
      obj[locaKey] = this.templateKey;
    } else {
      obj[locaKey] = FccGlobalConstant.COPYFROM_FT_KEY;
    }
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      data: obj,
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        if (this.templateKey) {
          this.resetRemoveLabelTemplate();
        } else {
          this.resetFieldsForCopyFrom();
        }
      }
      this.templateKey = null;
    });
  }
  resetRemoveLabelTemplate() {
    this.form.get('createFromOptions')[this.params][this.rendered] = true;
    this.form.get('templateSelection')[this.params][this.rendered] = false;
    this.form.get('fetchedTemplate')[this.params][this.rendered] = false;
    this.form.get('removeLabelTemplate')[this.params][this.rendered] = false;
    this.form.get('fetchedTemplate').setValue('');
    this.form.get('createFromOptions').setValue('');
    this.templateResponse.unsubscribe();
    this.productStateService.clearState();
    this.formModelService.getFormModel(FccGlobalConstant.PRODUCT_FT).subscribe(modelJson => {
      this.productStateService.initializeProductModel(modelJson);
      this.productStateService.initializeState(FccGlobalConstant.PRODUCT_FT);
      this.productStateService.populateAllEmptySectionsInState();
    });
    this.initializeFormGroup();
  }

  /**
 *  Reset fields for Copy From on click on confirmation from dialog box
 */
  resetFieldsForCopyFrom(): void {
    if (this.commonService.isNonEmptyValue(this.ftDetailsResponse)){
      this.ftDetailsResponse.unsubscribe();
    }
    this.productStateService.clearState();
    this.formModelService.getFormModel(FccGlobalConstant.PRODUCT_FT).subscribe(modelJson => {
      this.productStateService.initializeProductModel(modelJson);
      this.productStateService.initializeState(FccGlobalConstant.PRODUCT_FT);
      this.productStateService.populateAllEmptySectionsInState();
      this.form = this.stateService.getSectionData(FccGlobalConstant.FT_GENERAL_DETAILS);
      this.form.get('createFromOptions')[this.params][this.rendered] = true;
      this.form.get('referenceSelected')[this.params][this.rendered] = false;
      this.form.get('fetchedRefValue')[this.params][this.rendered] = false;
      this.form.get('removeLabel')[this.params][this.rendered] = false;
      this.form.get('fetchedRefValue').setValue('');
      this.form.get('customerReference').setValue('');
      const val = this.form.get('createFromOptions')[this.params][this.options];
      this.toggleCreateFormButtons(val, '',false);
      this.form.get('createFromOptions').setValue('');
    });
    this.copyFrom = false;
    this.initializeFormGroup();
    const emptyFields = ['beneficiaryEntity','bankNameList','issuerReferenceList'];
    this.setValueToNull(emptyFields);
  }

  toggleCreateFormButtons(val, val1, enable) {
    val.forEach( (element) => {
      element[this.disabled] = enable;
    });
  }

  onKeyupPaymentDetalsTransferee(event: any) {
    const params = 'params';
    const maxRowCount = 'maxRowCount';
    const fieldSize = 'fieldSize';
    const control = this.form.get('paymentDetalsTransferee');
    const maxrows = control[params][maxRowCount];
    const numberofcharRow = control[params][fieldSize];
    if (event.key === 'Enter' && (control.hasError('rowCountMoreThanAllowed') || (control.hasError('rowCountExceeded')))) {
      control.setErrors({ rowCountMoreThanAllowed: { maxRows: maxrows, charPerRow: numberofcharRow } });
    }
  }
  updateDataOnTemplateLoad(){
    this.form.get(FccGlobalConstant.OTHER_INSTRUCTION).setValue(this.form.get(FccGlobalConstant.OTHER_INSTRUCTION).value);
    this.form.get(FccGlobalConstant.PAYMENT_INSTRUCTION).setValue(this.form.get(FccGlobalConstant.PAYMENT_INSTRUCTION).value);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.CURRENCY), { options: this.currency });
    if (this.form.get(FccGlobalConstant.CURRENCY).value !== FccGlobalConstant.EMPTY_STRING) {

      const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency, FccGlobalConstant.CURRENCY, this.form);
      if (valObj) {
        this.form.get(FccGlobalConstant.CURRENCY).patchValue(valObj[`value`]);
      }
    }
  }
editModeDataPopulate() {
  const templateName = this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_NAME, this.form) ?
                        this.form.get(FccGlobalConstant.TEMPLATE_NAME).value : undefined;
  if ((this.mode === 'DRAFT' && this.option !== FccGlobalConstant.TEMPLATE) && this.commonService.isNonEmptyValue(templateName) &&
    this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_TEMPLATE, this.form)) {
    this.handleTemplateFields(templateName);
    if (this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
    }
  }
}
handleTemplateFields(templateID) {
  this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.EXISTING_TEMPLATE);
  this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
  this.form.get(FccGlobalConstant.CREATE_FROM)[this.params][this.rendered] = false;
  this.form.get('templateSelection')[this.params][this.rendered] = true;
  this.form.get('fetchedTemplate')[this.params][this.rendered] = true;
  this.form.get('removeLabelTemplate')[this.params][this.rendered] = true;
  const element = document.createElement('div');
  element.innerHTML = templateID;
  templateID = element.textContent;
  this.form.get(FccGlobalConstant.FETCHED_TEMPLATE).patchValue(templateID);
  this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCHED_TEMPLATE), { readonly: true });
}
}
