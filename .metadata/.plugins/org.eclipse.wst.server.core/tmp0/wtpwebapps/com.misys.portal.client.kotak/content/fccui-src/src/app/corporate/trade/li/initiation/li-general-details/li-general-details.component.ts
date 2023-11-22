import { PhrasesService } from './../../../../../common/services/phrases.service';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DialogService, DynamicDialogRef } from 'primeng';
import { ProductMappingService } from '../../../../../common/services/productMapping.service';
import { TransactionDetailService } from '../../../../../common/services/transactionDetail.service';

import { CommonService } from '../../../../../common/services/common.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { FCCFormControl, FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { LcConstant } from './../../../lc/common/model/constant';
import { ProductStateService } from './../../../lc/common/services/product-state.service';
import { LiProductComponent } from './../../li-product/li-product.component';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { FccBusinessConstantsService } from './../../../../../common/core/fcc-business-constants.service';
import { FccTradeFieldConstants } from '../../../common/fcc-trade-field-constants';
import { compareExpiryDateEqualToCurrentDate, compareTransportDocDateEqualToCurrentDate, expiryDateGreaterThanSelectedExpiryDate, invalidDate } from '../../../lc/initiation/validator/ValidateDates';
import { LiProductService } from '../../services/li-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';
@Component({
  selector: 'fcc-li-general-details',
  templateUrl: './li-general-details.component.html',
  styleUrls: ['./li-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LiGeneralDetailsComponent }]
})
export class LiGeneralDetailsComponent extends LiProductComponent implements OnInit, OnDestroy, AfterViewChecked {
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  previewScreen = this.lcConstant.previewScreen;
  rendered = this.lcConstant.rendered;
  form: FCCFormGroup;
  module = `${this.translateService.instant(FccGlobalConstant.LI_GENERAL_DETAILS)}`;
  maximumlength = this.lcConstant.maximumlength;
  mode: any;
  tnxId: any;
  productCode: any;
  subTnxTypeCode: any;
  option: any;
  refId: any;
  tnxTypeCode;
  liDetailsResponse: any;
  fromExisitingLiResponse;
  options = this.lcConstant.options;
  disabled = this.lcConstant.disabled;
  liDescOfGoods = 'liDescOfGoods';
  entityName: any;
  fromExisitingLcResponse: any;
  fromExisitingElResponse: any;
  expiryDateLc: any;
  styleClass = this.lcConstant.styleClass;
  readonly = this.lcConstant.readonly;
  isPreview: boolean;
  transportDocumentType = 'transportDocumentType';
  selectedExpiryDate: any;
  currentDate = this.commonService.getBankDateForComparison();
  isView: boolean;

  excludedFieldsNdSections: any;
  copyFromProductCode = '';
  excludingJsonFileKey = '';
  fieldsArray = [];
  sectionsArray = [];
  custRefLength;
  enteredCharCount = 'enteredCharCount';
  taskSubscription : Subscription;

  constructor(
    protected router: Router,
    protected eventEmitterService: EventEmitterService,
    protected stateService: ProductStateService,
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected fileArray: FilelistService,
    protected dialogRef: DynamicDialogRef,
    protected phrasesService: PhrasesService,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected productMappingService: ProductMappingService,
    protected transactionDetailService: TransactionDetailService,
    protected fccTaskService: FccTaskService,
    protected formModelService: FormModelService, protected dialogService: DialogService, protected liProductService: LiProductService
    ) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, liProductService);
   }

  ngOnInit(): void {
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.isPreview = this.mode === FccGlobalConstant.INITIATE || this.mode === FccGlobalConstant.DRAFT_OPTION ||
    this.mode === FccGlobalConstant.EXISTING;
    this.isView = this.mode === FccGlobalConstant.VIEW_MODE;
    this.initializeFormGroup();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.custRefLength = response.customerReferenceTradeLength;
        this.form.get('customerReference').clearValidators();
        this.form.addFCCValidators('customerReference', Validators.maxLength(this.custRefLength), 0); }
    });
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.getExcludedFieldsNdSections();
    this.updateNarrativeCount();
    this.taskSubscription = this.fccTaskService.notifyTaskAfterSaveTnx$.subscribe(data => {
      if(data) {
      if (this.form && this.commonService.isNonEmptyField('removeLabel', this.form)) {
        this.form.get('removeLabel')[this.params][this.rendered] = false;
      }
      }
      });
  }
  updateNarrativeCount() {
    if (this.form.get('liDescOfGoods').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('liDescOfGoods').value);
      this.form.get('liDescOfGoods')[this.params][this.enteredCharCount] = count;
    }
  }

  initializeFormGroup() {
  const sectionName = FccGlobalConstant.LI_GENERAL_DETAILS;
  this.form = this.stateService.getSectionData(sectionName);
  this.form.get(FccGlobalConstant.CHANNELS_ID)[this.params][this.rendered] = false;
  if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
    this.form.get(this.liDescOfGoods)[FccGlobalConstant.PARAMS][FccGlobalConstant.PHRASE_ENABLED] = true;
  } else {
    this.form.get(this.liDescOfGoods)[FccGlobalConstant.PARAMS][FccGlobalConstant.PHRASE_ENABLED] = false;
  }
  if (!this.commonService.getQueryParametersFromKey(FccGlobalConstant.IS_MASTER)) {
  const eventStatCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.eventTnxStatCode);
  const returnCommentsField = this.stateService.getSectionData(FccGlobalConstant.eventDetails).get('returnComments');
  const returnComents = (returnCommentsField !== null && returnCommentsField !== undefined) ? returnCommentsField.value : '';
  if (eventStatCode && eventStatCode.toString() === FccGlobalConstant.STRING_03 && returnComents !== ''
  && this.mode === FccGlobalConstant.VIEW_MODE) {
    this.stateService.getSectionData(FccGlobalConstant.eventDetails).get('returnComments')[this.params][this.rendered] = false;
  }
}
  const transportDocType = this.form.get(this.transportDocumentType).value;
  if (transportDocType && transportDocType.toString() === FccBusinessConstantsService.OTHER_99) {
      this.form.get(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE)[this.params][this.rendered] = true;
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE], true);
      if (this.isPreview) {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.TRANSPORT_DOC_TYPE], false);
      }
      if (this.isView) {
        this.form.get(FccTradeFieldConstants.TRANSPORT_DOC_TYPE)[this.params][this.rendered] = false;
      }
  }else{
    this.form.get(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE)[this.params][this.rendered] = false;
    this.togglePreviewScreen(this.form, [FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE], false);
    this.togglePreviewScreen(this.form, [FccTradeFieldConstants.TRANSPORT_DOC_TYPE], true);
  }
  const createFromOpt = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value;
  const parentRef = this.form.get(FccGlobalConstant.PARENT_REF).value;
  if ((createFromOpt === FccGlobalConstant.LICOPY_FROM_LC || createFromOpt === FccGlobalConstant.LICOPY_FROM_EL)
   && parentRef !== '' && this.isView) {
    this.form.get(FccGlobalConstant.PARENT_REF)[this.params][this.rendered] = true;
  }
  this.editModeDataPopulate();
  this.commonService.setLiMode(null);
  if (this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.LICOPY_FROM_EL){
    this.commonService.setLiMode(FccGlobalConstant.LICOPY_FROM_EL);
    this.form.get(FccGlobalConstant.RELATED_REFERENCE)[this.params][this.rendered] = false;
    this.togglePreviewScreen(this.form, [FccGlobalConstant.RELATED_REFERENCE], false);
  } else if (this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.LICOPY_FROM_LC){
    this.commonService.setLiMode(FccGlobalConstant.LICOPY_FROM_LC);
    this.form.get(FccGlobalConstant.RELATED_REFERENCE)[this.params][this.rendered] = false;
    this.togglePreviewScreen(this.form, [FccGlobalConstant.RELATED_REFERENCE], false);
  } else if (this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.COPYFROM_LI){
    this.commonService.setLiMode(FccGlobalConstant.COPYFROM_LI);
    this.form.get(FccGlobalConstant.RELATED_REFERENCE)[this.params][this.rendered] = true;
    this.togglePreviewScreen(this.form, [FccGlobalConstant.RELATED_REFERENCE], true);
    this.togglePreviewScreen(this.form, [FccGlobalConstant.PARENT_REF], false);
  } else {
    this.form.get(FccGlobalConstant.RELATED_REFERENCE)[this.params][this.rendered] = true;
    this.togglePreviewScreen(this.form, [FccGlobalConstant.RELATED_REFERENCE], true);
  }
  if (this.form.get('parentExpiryDate').value){
    this.selectedExpiryDate = this.form.get('parentExpiryDate').value;
  }
  if (this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS) &&
  this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS)[this.params][this.rendered]) {
    this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS)[this.params]['showRemoveLink'] = false;
  }
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LI, key);
  }

  resetCreateForm() {
    if (!this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value) {
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
    }
  }

  getExcludedFieldsNdSections() {
    const productCode = FccGlobalConstant.PRODUCT_LI;
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

  setFieldsArrayNdSectionsData(isTemplate: boolean, productCode: string) {
    this.revertCopyFromDetails();
    if (isTemplate) {
      this.excludingJsonFileKey = FccGlobalConstant.TEMPLATE.toLowerCase();
    } else {
      this.excludingJsonFileKey = productCode + FccGlobalConstant.TRANSACTION;
    }
    if (this.excludedFieldsNdSections) {
      this.fieldsArray = this.excludedFieldsNdSections[this.excludingJsonFileKey].fields;
      this.sectionsArray = this.excludedFieldsNdSections[this.excludingJsonFileKey].sections;
    }
  }

  onClickCreateFromOptions(data: any) {
    if (data.value === FccGlobalConstant.COPYFROM_LI) {
      this.onClickCopyFromLI();
    } else if (data.value === FccGlobalConstant.LICOPY_FROM_LC) {
      this.onClickExistingLC();
    } else if (data.value === FccGlobalConstant.LICOPY_FROM_EL) {
      this.onClickExistingEL();
    }
  }

  onClickCopyFromLI() {
    this.setFieldsArrayNdSectionsData(false, FccGlobalConstant.PRODUCT_LI);
    const header = `${this.translateService.instant('existingLIList')}`;
    const productCode = FccGlobalConstant.PRODUCT;
    const headerDisplay = FccGlobalConstant.HEADER_DISPLAY;
    const buttons = FccGlobalConstant.BUTTONS;
    const savedList = FccGlobalConstant.SAVED_LIST;
    const option = FccGlobalConstant.OPTION;
    const downloadIconEnabled = FccGlobalConstant.DOWNLOAD_ICON_ENABLED;
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_LI;
    obj[option] = FccGlobalConstant.EXISTING_OPTION;
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    // const fieldsArray = [FccGlobalConstant.EXPIRY_DATE_FIELD, FccGlobalConstant.CUSTOMER_REF];

    this.resolverService.getSearchData(header, obj);
    this.liDetailsResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (this.fromExisitingLiResponse !== undefined && this.fromExisitingLiResponse !== null) {
        this.fromExisitingLiResponse.unsubscribe();
      } else {
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
      }
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        const prodCode = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
          && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
          FccGlobalConstant.PRODUCT_LI : undefined;
        const eventIdToPass = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
          && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
          response.responseData.TNX_ID : response.responseData.REF_ID;
        this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_LI).subscribe(apiMappingModel => {
        this.transactionDetailService.fetchTransactionDetails(eventIdToPass, prodCode, false).subscribe(responseData => {
        const responseObj = responseData.body;
        if (!this.fieldsArray || this.fieldsArray.length === 0) {
          responseObj.li_amt = '';
          responseObj.li_cur_code = '';
        }
        const setStateForProduct = {
          responseObject: responseObj,
          apiModel: apiMappingModel,
          isMaster: false,
          fieldsList: this.fieldsArray,
          sectionsList: this.sectionsArray
        };
        this.commonService.productState.next(setStateForProduct);
        this.form = this.stateService.getSectionData(FccGlobalConstant.LI_GENERAL_DETAILS);
        this.stateService.getSectionData(FccGlobalConstant.LI_APPLICANT_BENEFICIARY)
        .get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue(responseObj.beneficiary_name);
        this.commonService.setLcResponse(responseObj);
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.REFERENCE_SELECTED)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.FETCH_REF_VALUE)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.FETCH_REF_VALUE).patchValue(response.responseData.REF_ID);
        this.form.get(FccGlobalConstant.PARENT_REF).patchValue(response.responseData.REF_ID);
        this.togglePreviewScreen(this.form, [FccGlobalConstant.PARENT_REF], false);
        this.form.get(FccGlobalConstant.CHANNELS_ID)[this.params][this.rendered] = false;
        this.commonService.setLiMode(null);
        this.commonService.setLiMode(FccGlobalConstant.COPYFROM_LI);
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.COPYFROM_LI);
        this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCH_REF_VALUE), { readonly: true });
        if (!this.fieldsArray || this.fieldsArray.length === 0) {
          this.form.get(FccGlobalConstant.CUSTOMER_REF).setValue(FccGlobalConstant.EMPTY_STRING);
        }
        this.form.get(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE)[this.params][this.rendered] = false;
        const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
        this.toggleCreateFormButtons(val, null, true);
        this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS)[this.params][this.rendered] = false;
        this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS)[this.params][this.previewScreen] = false;

        /**
         * Commenting since, no need to show parent transactionc card in case of copying from same product code
         */
        // this.form.get(FccGlobalConstant.FETCH_REF_VALUE).patchValue(response.responseData.REF_ID);
        // this.form.get('lcRefId').patchValue(response.responseData.REF_ID);
        // this.form.get(FccGlobalConstant.CROSSREF_REFID).patchValue(response.responseData.REF_ID);
        // this.form.get(FccGlobalConstant.CROSSREF_TNXID).patchValue(response.responseData.TNX_ID);
        // this.form.get(FccGlobalConstant.CROSSREF_PRODCODE).patchValue(FccGlobalConstant.PRODUCT_LI);
        // this.form.get(FccGlobalConstant.CROSSREF_CHILD_PRODCODE).patchValue(FccGlobalConstant.PRODUCT_LI);
        // this.form.get(FccGlobalConstant.LI_OPTION).patchValue(FccGlobalConstant.EXISTING_OPTION);
        // this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue('copyFromLI');
        // this.commonService.setLiCopyFrom('copiedFrom');
        // this.initializeFormToDetailsResponse(response.responseData.REF_ID, this.mode);
      });
    });
      }
    });
  }

  toggleCreateFormButtons(val, val1, enable) {
    val.forEach( (element) => {
      element[this.disabled] = enable;
    });
  }

  onClickTransportDocumentType() {
    const transportDocType = this.form.get(this.transportDocumentType).value;
    if (transportDocType && transportDocType.toString() === FccBusinessConstantsService.OTHER_99) {
      this.form.get(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE)[this.params][this.rendered] = true;
      if (this.mode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE,
          Validators.compose([Validators.pattern(FccGlobalConstant.ALPHA_NUMERIC)]), 1);
      }
      this.form.addFCCValidators(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE,
        Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 1);
      this.setMandatoryField(this.form, FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE, true);
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE], true);
      if (this.isPreview) {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.TRANSPORT_DOC_TYPE], false);
      }
      if (this.isView) {
        this.form.get(FccTradeFieldConstants.TRANSPORT_DOC_TYPE)[this.params][this.rendered] = false;
      }
    } else {
      this.form.get(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE).setValue(null);
      this.form.get(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE).clearValidators();
      this.setMandatoryField(this.form, FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE, false);
      this.form.get(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE)[this.params][this.rendered] = false;
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE], false);
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.TRANSPORT_DOC_TYPE], true);
    }
    this.form.get(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE).updateValueAndValidity();
  }

  onClickExistingLC() {
    this.setFieldsArrayNdSectionsData(false, FccGlobalConstant.PRODUCT_LC);
    const header = `${this.translateService.instant('liExistingLcList')}`;
    const productCode = 'productCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_LC;
    obj[option] = FccGlobalConstant.EXISTING_OPTION;
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    obj[FccGlobalConstant.CURRENT_DATE] = this.currentDate;
    // const fieldsArray = ['expiryDate', FccGlobalConstant.CUSTOMER_REF, 'amount'];

    this.resolverService.getSearchData(header, obj);
    this.fromExisitingLcResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (this.liDetailsResponse !== undefined && this.liDetailsResponse !== null) {
          this.liDetailsResponse.unsubscribe();
      } else {
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
      }
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        this.transactionDetailService.fetchTransactionDetails(response.responseData.REF_ID, null, false).subscribe(responseData => {
          const responseObj = responseData.body;
          this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_LI).subscribe(apiMappingModel => {
          const setStateForProduct = {
            responseObject: responseObj,
            apiModel: apiMappingModel,
            isMaster: false,
            fieldsList: this.fieldsArray,
            sectionsList: this.sectionsArray
          };
          this.commonService.productState.next(setStateForProduct);
          this.form = this.stateService.getSectionData(FccGlobalConstant.LI_GENERAL_DETAILS);
          this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
          if (!this.fieldsArray || this.fieldsArray.length === 0) {
            this.form.get(FccGlobalConstant.LI_DESC_GOODS).setValue(null);
            this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValue(null);
            this.form.get(FccGlobalConstant.CUSTOMER_REF).setValue(FccGlobalConstant.EMPTY_STRING);
          }
          this.commonService.setLiCopyFrom('copiedFrom');
          this.initializeFormToDetailsResponse(response.responseData.REF_ID, this.mode);
          this.form.get(FccGlobalConstant.FETCH_REF_VALUE).patchValue(response.responseData.REF_ID);
          this.form.get('lcRefId').patchValue(response.responseData.REF_ID);
          this.form.get(FccGlobalConstant.CROSSREF_REFID).patchValue(response.responseData.REF_ID);
          this.form.get(FccGlobalConstant.CROSSREF_TNXID).patchValue(response.responseData.TNX_ID);
          this.form.get(FccGlobalConstant.CROSSREF_PRODCODE).patchValue(FccGlobalConstant.PRODUCT_LC);
          this.form.get(FccGlobalConstant.CROSSREF_CHILD_PRODCODE).patchValue(FccGlobalConstant.PRODUCT_LI);
          this.form.get(FccGlobalConstant.LI_OPTION).patchValue(FccGlobalConstant.EXISTING_OPTION);
          this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.LICOPY_FROM_LC);
          this.form.get(FccGlobalConstant.RELATED_REFERENCE)[this.params][this.rendered] = false;
          this.togglePreviewScreen(this.form, [FccGlobalConstant.RELATED_REFERENCE], false);
          this.form.get(FccGlobalConstant.CHANNELS_ID)[this.params][this.rendered] = false;
          this.commonService.setLiMode(null);
          this.commonService.setLiMode(FccGlobalConstant.LICOPY_FROM_LC);
          this.form.get(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE)[this.params][this.rendered] = false;
          const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
          this.toggleCreateFormButtons(val, '', true);
          this.form.updateValueAndValidity();
        });
      });
      }
    });
  }

  onClickExistingEL() {
    this.setFieldsArrayNdSectionsData(false, FccGlobalConstant.PRODUCT_EL);
    const header = `${this.translateService.instant('liExistingElList')}`;
    const productCode = 'productCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_EL;
    obj[option] = FccGlobalConstant.EXISTING_OPTION;
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    obj[FccGlobalConstant.CURRENT_DATE] = this.currentDate;
    // const fieldsArray = ['expiryDate', FccGlobalConstant.CUSTOMER_REF, 'amount'];

    this.resolverService.getSearchData(header, obj);
    this.fromExisitingElResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (this.liDetailsResponse !== undefined && this.liDetailsResponse !== null) {
          this.liDetailsResponse.unsubscribe();
      } else {
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
      }
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        this.transactionDetailService.fetchTransactionDetails(response.responseData.REF_ID, null, false).subscribe(responseData => {
          const responseObj = responseData.body;
          this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_LI).subscribe(apiMappingModel => {
          const setStateForProduct = {
            responseObject: responseObj,
            apiModel: apiMappingModel,
            isMaster: false,
            fieldsList: this.fieldsArray,
            sectionsList: this.sectionsArray
          };
          this.commonService.productState.next(setStateForProduct);
          this.form = this.stateService.getSectionData(FccGlobalConstant.LI_GENERAL_DETAILS);
          this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
          if (!this.fieldsArray || this.fieldsArray.length === 0) {
            this.form.get(FccGlobalConstant.LI_DESC_GOODS).setValue(null);
            this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValue(null);
            this.form.get(FccGlobalConstant.CUSTOMER_REF).setValue(FccGlobalConstant.EMPTY_STRING);
          }
          this.commonService.setLiCopyFrom('copiedFrom');
          this.initializeFormToDetailsResponse(response.responseData.REF_ID, this.mode);
          this.form.get(FccGlobalConstant.FETCH_REF_VALUE).patchValue(response.responseData.REF_ID);
          this.form.get('lcRefId').patchValue(response.responseData.REF_ID);
          this.form.get(FccGlobalConstant.CROSSREF_REFID).patchValue(response.responseData.REF_ID);
          this.form.get(FccGlobalConstant.CROSSREF_TNXID).patchValue(response.responseData.TNX_ID);
          this.form.get(FccGlobalConstant.CROSSREF_PRODCODE).patchValue(FccGlobalConstant.PRODUCT_LC);
          this.form.get(FccGlobalConstant.CROSSREF_CHILD_PRODCODE).patchValue(FccGlobalConstant.PRODUCT_LI);
          this.form.get(FccGlobalConstant.LI_OPTION).patchValue(FccGlobalConstant.EXISTING_OPTION);
          this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.LICOPY_FROM_EL);
          this.form.get(FccGlobalConstant.RELATED_REFERENCE)[this.params][this.rendered] = false;
          this.togglePreviewScreen(this.form, [FccGlobalConstant.RELATED_REFERENCE], false);
          this.form.get(FccGlobalConstant.CHANNELS_ID)[this.params][this.rendered] = false;
          this.commonService.setLiMode(null);
          this.commonService.setLiMode(FccGlobalConstant.LICOPY_FROM_EL);
          this.form.get(FccTradeFieldConstants.OTHER_TRANSPORT_DOC_TYPE)[this.params][this.rendered] = false;
          const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
          this.toggleCreateFormButtons(val, '', true);
          this.form.updateValueAndValidity();
        });
      });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initializeFormToDetailsResponse(response: any, mode?: any) {
    this.transactionDetailService.fetchTransactionDetails(response).subscribe(responseData => {
      const responseObj = responseData.body;
      this.commonService.setParentTnxInformation(responseObj);
      if (responseObj.beneficiary_name){
        this.stateService.getSectionData(FccGlobalConstant.LI_APPLICANT_BENEFICIARY)
        .get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue(responseObj.beneficiary_name);
      }
      if (responseObj.entity) {
        this.stateService.getSectionData(FccGlobalConstant.LI_APPLICANT_BENEFICIARY)
        .get(FccGlobalConstant.APPLICANT_ENTITY).setValue(responseObj.entity);
        this.stateService.getSectionData(FccGlobalConstant.LI_APPLICANT_BENEFICIARY)
        .get(FccGlobalConstant.APPLICANT_NAME).setValue(responseObj.entity);
      }

      let dateParts;
      if (responseObj.exp_date) {
        dateParts = responseObj.exp_date.toString().split('/');
        this.selectedExpiryDate = new Date(dateParts[FccGlobalConstant.LENGTH_2],
              dateParts[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1, dateParts[FccGlobalConstant.LENGTH_0]);
        this.form.get('parentExpiryDate').setValue(this.selectedExpiryDate);
      }
      this.commonService.setLcResponse(responseObj);
      this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_LI).subscribe(apiMappingModel => {
      const setStateForProduct = {
        responseObject: responseObj,
        apiModel: apiMappingModel,
        isMaster: false,
        fieldsList: this.fieldsArray,
        sectionsList: this.sectionsArray
      };
      this.commonService.productState.next(setStateForProduct);
      this.form.get(FccGlobalConstant.PARENT_REF).patchValue(response);
      this.form.get(FccGlobalConstant.FETCH_REF_VALUE)[this.params][this.rendered] = false;
      const liCardControl = this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS) as FCCFormControl;
      const cardData = this.productMappingService.getDetailsOfCardData(responseObj, liCardControl);
      this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS)[this.params][this.options] = cardData;
      this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS)[this.params][this.rendered] = true;
      this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS)[this.params]['showRemoveLink'] = true;
      this.form.get(FccGlobalConstant.CREATE_FROM)[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
      const isDescInExcludedFields = (this.fieldsArray && this.fieldsArray.indexOf(FccGlobalConstant.LI_DESC_GOODS) > -1);
      if (this.form.get(FccGlobalConstant.LI_DESC_GOODS).value === null || this.form.get(FccGlobalConstant.LI_DESC_GOODS).value === '') {
        if (!isDescInExcludedFields) {
          const displayValue = this.commonService.replacePhraseText(responseObj.narrative_description_goods.issuance.data.datum.text);
          const decodedValue = this.commonService.decodeHtml(displayValue);
          this.form.get(FccGlobalConstant.LI_DESC_GOODS).setValue(decodedValue);
          this.phrasesService.updateNarrativeCount(this.form, FccGlobalConstant.LI_DESC_GOODS);
          this.form.get(FccGlobalConstant.LI_DESC_GOODS).updateValueAndValidity();
        }
      }
      if (this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).value) {
        this.onClickExpiryDate();
      }
      this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.REFERENCE_SELECTED)[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.PARENT_REF)[this.params][this.rendered] = false;
      this.form.updateValueAndValidity();
    });
  });
  }

  revertCopyFromDetails() {
    this.copyFromProductCode = '';
    this.excludingJsonFileKey = '';
    this.fieldsArray = [];
    this.sectionsArray = [];
  }

  onClickRemoveLabel() {
    this.revertCopyFromDetails();
    const headerField = `${this.translateService.instant('removeSelectedTransaction')}`;
    const obj = {};
    const locaKey = 'locaKey';
    if ( this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.COPYFROM_LI) {
      obj[locaKey] = FccGlobalConstant.COPYFROM_LI_KEY;
    } else if ( this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.LICOPY_FROM_LC) {
      obj[locaKey] = FccGlobalConstant.LICOPY_FROM_LC;
    } else if ( this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.LICOPY_FROM_EL) {
      obj[locaKey] = FccGlobalConstant.LICOPY_FROM_EL;
    }
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      data: obj,
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.commonService.setLiMode(null);
        this.commonService.setLiCopyFrom(null);
        this.form.get(FccGlobalConstant.RELATED_REFERENCE)[this.params][this.rendered] = true;
        this.togglePreviewScreen(this.form, [FccGlobalConstant.RELATED_REFERENCE], true);
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
        this.commonService.setLcResponse(null);
        this.liDetailsResponse = null;
        this.fromExisitingElResponse = null;
        this.fromExisitingLcResponse = null;
        this.selectedExpiryDate = null;
        this.form.get('parentExpiryDate').setValue(null);
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValidators([compareExpiryDateEqualToCurrentDate]);
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
        this.resetFieldsForCopyFrom();
      }
    });
  }

  onClickRemoveLiCardDetails() {
    this.onClickRemoveLabel();
  }

  resetFieldsForCopyFrom(): void {
    this.commonService.setParentReference(null);
    if (this.liDetailsResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.liDetailsResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
    if (this.fromExisitingLiResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.fromExisitingLiResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
    if (this.fromExisitingElResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.fromExisitingElResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
    this.productStateService.clearState();
    this.formModelService.getFormModel(FccGlobalConstant.PRODUCT_LI).subscribe(modelJson => {
      this.productStateService.initializeProductModel(modelJson);
      this.productStateService.initializeState(FccGlobalConstant.PRODUCT_LI);
      this.productStateService.populateAllEmptySectionsInState();
      this.form.reset();
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.CREATE_FROM)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.REFERENCE_SELECTED)[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.FETCH_REF_VALUE)[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
      this.form.get(FccTradeFieldConstants.LI_CARD_DETAILS)[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.FETCH_REF_VALUE).setValue('');
      this.form.get(FccGlobalConstant.CUSTOMER_REF).setValue('');
      this.form.get(FccGlobalConstant.CROSSREF_REFID).setValue('');
      this.form.get(FccGlobalConstant.CROSSREF_TNXID).setValue('');
      this.form.get(FccGlobalConstant.CROSSREF_PRODCODE).setValue('');
      this.form.get(FccGlobalConstant.CROSSREF_CHILD_PRODCODE).setValue('');
      this.form.get(FccGlobalConstant.CROSSREF_CHILD_REFID).setValue('');
      this.form.get(FccGlobalConstant.CROSSREF_CHILD_TNXID).setValue('');
      this.form.get(FccGlobalConstant.LI_OPTION).setValue('');
      const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
      this.toggleCreateFormButtons(val, '', false);
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
    });
  }

  editModeDataPopulate() {
    const parentRefID = this.form.get(FccGlobalConstant.PARENT_REF).value;
    if ( this.mode === FccGlobalConstant.DRAFT_OPTION && this.commonService.isNonEmptyValue(parentRefID) &&
    this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form)) {
     if ( this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.COPYFROM_LI) {
        this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(parentRefID);
        this.togglePreviewScreen(this.form, [FccGlobalConstant.PARENT_REF], false);
        this.handlecopyFromFields();
      } else if ( this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.LICOPY_FROM_LC) {
        this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(parentRefID);
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.LICOPY_FROM_LC);
        this.handlecopyFromLCEdit(parentRefID);
      } else if ( this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).value === FccGlobalConstant.LICOPY_FROM_EL) {
        this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(parentRefID);
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.LICOPY_FROM_EL);
        this.handlecopyFromLCEdit(parentRefID);
      }
    }
  }

  handlecopyFromFields(response?: any) {
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).patchValue(FccGlobalConstant.COPYFROM_LI);
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.REFERENCE_SELECTED)[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.FETCH_REF_VALUE)[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
    if (this.commonService.isNonEmptyValue(response)){
      this.form.get(FccGlobalConstant.FETCH_REF_VALUE).patchValue(response.responseData.REF_ID);
      this.form.get(FccGlobalConstant.PARENT_REF).patchValue(response.responseData.REF_ID);
    } else if (this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.PARENT_REF).value)){
      this.form.get(FccGlobalConstant.FETCH_REF_VALUE).patchValue(this.form.get(FccGlobalConstant.PARENT_REF).value);
    }
    this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCH_REF_VALUE), { readonly: true });
    const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
    this.toggleCreateFormButtons(val, null, true);
   }

   handlecopyFromLCEdit(parentRefID: any){
    this.initializeFormToDetailsResponse(parentRefID, this.mode);
   }

  ngOnDestroy() {
    if (this.form !== undefined && this.form.get(FccGlobalConstant.REMOVE_LABEL)) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
    }
    this.stateService.setStateSection(FccGlobalConstant.LI_GENERAL_DETAILS, this.form);
    if(this.taskSubscription != null && this.taskSubscription != undefined){
      this.taskSubscription.unsubscribe();     
     } 
  }

  onClickExpiryDate(){
    const dateVal = this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).value;
    if ((dateVal !== null && dateVal !== '')) {
    if (dateVal) {
      this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValidators([compareExpiryDateEqualToCurrentDate]);
    }
    if (this.selectedExpiryDate) {
      const dateDiff = this.dateDifference(dateVal, this.selectedExpiryDate);
      if (dateDiff < FccGlobalConstant.ZERO) {
        this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValidators([expiryDateGreaterThanSelectedExpiryDate]);
      }
    }
    }
  else {
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).clearValidators();
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).setValidators([Validators.required]);
  }
    this.form.get(FccGlobalConstant.EXPIRY_DATE_FIELD).updateValueAndValidity();
  }


  onClickTransportDocumentDate(){
    const dateVal = this.form.get(FccGlobalConstant.TRANSPORT_DOC_DATE).value;
    if ((dateVal !== null && dateVal !== '')) {
    if (dateVal) {
      this.form.get(FccGlobalConstant.TRANSPORT_DOC_DATE).setValidators([compareTransportDocDateEqualToCurrentDate]);
    }
    }
  else {
    this.form.get(FccGlobalConstant.TRANSPORT_DOC_DATE).clearValidators();
    this.form.get(FccGlobalConstant.TRANSPORT_DOC_DATE).setValidators([invalidDate]);
  }
    this.form.get(FccGlobalConstant.TRANSPORT_DOC_DATE).updateValueAndValidity();
  }

  dateDifference(today: any, date: any) {
    const todayVal = new Date(today);
    const dateVal = new Date(date);
    const date1 = Date.UTC(todayVal.getFullYear(), todayVal.getMonth(), todayVal.getDate());
    const date2 = Date.UTC(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate());
    return Math.floor((date2 - date1) / FccGlobalConstant.ONE_DAY_TOTAL_TIME);
  }

  ngAfterViewChecked(): void {
    this.resetCreateForm();
  }

}
