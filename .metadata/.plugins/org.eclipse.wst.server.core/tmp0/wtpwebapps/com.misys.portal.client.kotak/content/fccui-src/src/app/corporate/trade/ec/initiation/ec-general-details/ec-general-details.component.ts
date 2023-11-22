import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AmendCommonService } from './../../../../common/services/amend-common.service';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { ProductMappingService } from '../../../../../common/services/productMapping.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { LcTemplateService } from '../../../../../common/services/lc-template.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { TransactionDetailService } from '../../../../../common/services/transactionDetail.service';
import { FormControlService } from '../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import {
  ConfirmationDialogComponent,
} from './../../../lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { EcProductComponent } from './../ec-product/ec-product.component';
import { PhrasesService } from './../../../../../common/services/phrases.service';
import { EcProductService } from '../../services/ec-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccTradeFieldConstants } from '../../../common/fcc-trade-field-constants';
import { Validators } from '@angular/forms';
import { FccGlobalConfiguration } from './../../../../../common/core/fcc-global-configuration';
import { FormatAmdNoService } from './../../../../../common/services/format-amd-no.service';
import { Subscription } from 'rxjs';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';

@Component({
  selector: 'app-ec-general-details',
  templateUrl: './ec-general-details.component.html',
  styleUrls: ['./ec-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EcGeneralDetailsComponent }]
})
export class EcGeneralDetailsComponent extends EcProductComponent implements OnInit {

  @Output() messageToEmit = new EventEmitter<string>();
  lcConstant = new LcConstant();
  form: FCCFormGroup;
  module = `${this.translateService.instant('generalDetails')}`;
  contextPath: any;
  progressivebar: number;
  tnxTypeCode: any;
  barLength: any;
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  templateResponse;
  copyFromResponse;
  styleClass = this.lcConstant.styleClass;
  disabled = this.lcConstant.disabled;
  options = this.lcConstant.options;
  readonly = this.lcConstant.readonly;
  enteredCharCount = 'enteredCharCount';
  option: any;
  custRefLength;
  mode: any;
  templateKey: string;
  refId: any;
  tnxStatCode: any;
  amdNoVal: any;
  templateIDSubProdCode: any;

  templteId;

  excludedFieldsNdSections: any;
  copyFromProductCode = '';
  excludingJsonFileKey = '';
  fieldsArray = [];
  sectionsArray = [];
  configuredKeysList = 'show.DA.tenor.description.text.area';
  keysNotFoundList: any[] = [];
  taskSubscription : Subscription;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService,
              protected prevNextService: PrevNextService,
              protected utilityService: UtilityService, protected saveDraftService: SaveDraftService,
              protected searchLayoutService: SearchLayoutService,
              protected lcTemplateService: LcTemplateService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected stateService: ProductStateService, protected route: ActivatedRoute,
              protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
              protected dialogService: DialogService, protected fccTaskService: FccTaskService,
              public fccGlobalConstantService: FccGlobalConstantService, protected productMappingService: ProductMappingService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService, protected amendCommonService: AmendCommonService,
              public phrasesService: PhrasesService, protected fileListSvc: FilelistService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected formatAmdNoService: FormatAmdNoService,
              protected fccGlobalConfiguration: FccGlobalConfiguration, protected ecProductService: EcProductService) {
      super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
        searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, ecProductService);
    }

  ngOnInit(): void {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxStatCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.eventTnxStatCode);
    this.templteId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TEMPLATE_ID);
    this.initializeFormGroup();
    this.barLength = this.leftSectionService.progressBarPerIncrease(FccGlobalConstant.EC_GENERAL_DETAILS);
    this.leftSectionService.progressBarData.subscribe(
      data => {
        this.progressivebar = data;
      }
    );
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
    this.templateChanges();
    this.editModeDataPopulate();
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      this.amendCommonService.compareTransactionAndMasterForAmend(productCode);
    }
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.custRefLength = response.customerReferenceTradeLength;
        this.addValidators();

      }
    });
    this.setAmendmentNumbers();
    this.getExcludedFieldsNdSections();
    this.editModeDataPopulate();

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

  setAmendmentNumbers(){
    const amdReqNo = this.stateService.getSectionData(FccGlobalConstant.eventDetails).get('amendmentReqNo');
    const amendmentNo = this.stateService.getSectionData(FccGlobalConstant.eventDetails).get('amendmentNo');
    if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
      ( this.commonService?.currentStateTnxResponse !== undefined
        && this.commonService.currentStateTnxResponse.prod_stat_code === FccGlobalConstant.N005_AMENDED) && amendmentNo !== null)) {
      const amdReqNoValue = (amdReqNo && amdReqNo.value) ? amdReqNo.value: '';
      const amdNoAvl = (amendmentNo && amendmentNo.value) ? true :false;
      if (amdNoAvl) {
        amendmentNo[this.params][this.rendered] = false;
        this.amdNoVal = amendmentNo.value;
      }
      if ((this.tnxStatCode === FccGlobalConstant.N004_UNCONTROLLED || this.tnxStatCode === FccGlobalConstant.N004_INCOMPLETE ||
        ( this.commonService?.currentStateTnxResponse !== undefined
        && this.commonService.currentStateTnxResponse.tnx_stat_code === FccGlobalConstant.N004_UNCONTROLLED))
        && (amdReqNoValue === null || amdReqNoValue === undefined || amdReqNoValue === '')){
          amdReqNo.setValue(FccGlobalConstant.AMD_REQ_NOT_GENERATED);
          amendmentNo[this.params][this.rendered] = false;
          amdReqNo[this.params][this.rendered] = true;
      } else if(( this.commonService?.currentStateTnxResponse !== undefined
          && this.commonService.currentStateTnxResponse.prod_stat_code === FccGlobalConstant.N005_REJECTED)
          || (amdReqNoValue && !amdNoAvl)){
        amdReqNo.setValue(this.formatAmdNoService.formatAmdNo(amdReqNoValue));
        amendmentNo[this.params][this.rendered] = false;
        amdReqNo[this.params][this.rendered] = true;
      } else {
        if(amdNoAvl && ( this.commonService?.currentStateTnxResponse !== undefined
          && this.commonService.currentStateTnxResponse?.tnx_stat_code === FccGlobalConstant.N004_ACKNOWLEDGED)){
          amendmentNo.setValue(this.formatAmdNoService.formatAmdNo(this.amdNoVal));
        }
        if (amdReqNo) {
          amdReqNo[this.params][this.rendered] = false;
        }
      }
      if(amdReqNo) {
        amdReqNo.updateValueAndValidity();
      }
      if(amendmentNo){
        amendmentNo.updateValueAndValidity();
      }
      }
  }

 addValidators()
  {
    this.form.addFCCValidators('ecDraweeReference', Validators.maxLength(this.custRefLength), 0);
    this.form.addFCCValidators('ecCustomerReference', Validators.maxLength(this.custRefLength), 0);
    this.form.get('ecDraweeReference').updateValueAndValidity();
    this.form.get('ecCustomerReference').updateValueAndValidity();
  }


  getExcludedFieldsNdSections() {
    const productCode = FccGlobalConstant.PRODUCT_EC;
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

  /**
   * Initialise the form from state servic
   */
  initializeFormGroup() {
    const sectionName = 'ecGeneralDetails';
    this.form = this.stateService.getSectionData(sectionName);
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response.response && response.response === 'REST_API_SUCCESS') {
          this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
          this.patchFieldValueAndParameters(this.form.get('enableDescTextArea'),
          response['show.DA.tenor.description.text.area'], {});
          this.form.get('enableDescTextArea').markAsTouched();
          this.form.get('enableDescTextArea').markAsDirty();
        }
      });
    } else {
      this.patchFieldValueAndParameters(this.form.get('enableDescTextArea'),
      FccGlobalConfiguration.configurationValues.get('show.DA.tenor.description.text.area'), {});
      this.form.get('enableDescTextArea').markAsTouched();
      this.form.get('enableDescTextArea').markAsDirty();
    }

    const tnxId = this.commonService.isNonEmptyValue(this.form.get('tnxId').value) ? this.form.get('tnxId').value :
                  this.commonService.getQueryParametersFromKey('tnxid');
    if (this.mode === FccGlobalConstant.INITIATE || this.mode === FccGlobalConstant.DRAFT_OPTION) {
      const collectionType = this.stateService.getSectionData('ecGeneralDetails').get('collectionTypeOptions');
      const collectionTypeOptions = collectionType[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      const hasRegularPermission = this.commonService.getUserPermissionFlag('ec_regular');
      const hasDirectPermission = this.commonService.getUserPermissionFlag('ec_direct');
      const hasDirectAltPermission = this.commonService.getUserPermissionFlag('ec_direct_alt');
      if (collectionTypeOptions) {
          if (!hasRegularPermission) {
            this.removeOptionFromCollectionType(collectionTypeOptions, '01');
          }
          if (!hasDirectPermission) {
            this.removeOptionFromCollectionType(collectionTypeOptions, '02');
          }
          if (!hasDirectAltPermission) {
            this.removeOptionFromCollectionType(collectionTypeOptions, '03');
          }
          this.patchFieldParameters(this.form.get(FccGlobalConstant.COLECTION_TYPE_OPTIONS), { options: collectionTypeOptions });
        }
      }
    if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND) && (tnxId === null || tnxId === undefined || tnxId === '')) {
      this.fileListSvc.resetList();
      const docSectionName = 'ecDocumentDetails';
      const form : FCCFormGroup = this.stateService.getSectionData(docSectionName);
      form.get('attachments').setValue(null);
      this.stateService.setStateSection(docSectionName, form);
      if(this.form.get(FccGlobalConstant.DOCUMENTS) !== null && this.form.get(FccGlobalConstant.DOCUMENTS) !== undefined){
        this.form.get(FccGlobalConstant.DOCUMENTS).updateValueAndValidity();
      }
    }
    if (this.mode !== FccGlobalConstant.INITIATE && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      const collectionType = this.stateService.getSectionData('ecGeneralDetails').get('collectionTypeOptions');
      if (collectionType) {
        const colTypeVal = collectionType.value;
        const collectionTypeOptions = collectionType[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
        this.ecProductService.toggleCreateFormButtons(collectionTypeOptions, colTypeVal);
        this.onClickCollectionTypeOptions(collectionType);
      }
    }

    const createFromOptions = this.stateService.getSectionData('ecGeneralDetails').get(FccGlobalConstant.CREATE_FROM_OPERATIONS);
    if (createFromOptions && createFromOptions.value) {
      const collectionTypeOptions = createFromOptions[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      this.disableCreateFormButtons(collectionTypeOptions, true);
    }
    this.addValidators();
    this.commonService.formatForm(this.form);
    this.form.updateValueAndValidity();
  }

  amendFormFields() {
    if (this.form.get('docsSendMode').value !== null){
      const val = this.form.get('docsSendMode').value;
      if (val === '') {
        this.form.get('docsSendMode')[this.params][this.rendered] = false;
      }
    }
    this.form.get('amendNarrativeText')[this.params][this.rendered] = true;
    this.form.get('amendmentNarrative')[this.params][this.rendered] = true;
    this.amendCommonService.setValueFromMasterToPrevious('ecGeneralDetails');
    this.updateNarrativeCount();
  }

  updateNarrativeCount() {
    if (this.form.get('amendmentNarrative').value) {
      const cols = this.form.get('amendmentNarrative')[this.params]['cols'];
      const count = this.commonService.counterOfPopulatedData(this.form.get('amendmentNarrative').value, cols);
      this.form.get('amendmentNarrative')[this.params][this.enteredCharCount] = count;
    }
  }

  saveFormOject() {
    this.stateService.setStateSection(FccGlobalConstant.EC_GENERAL_DETAILS, this.form);
  }

  onClickCollectionTypeOptions(event) {
    if (event.value === '02' || event.value === '03') {
      if (this.form.get('modeofTransmission')) {
        this.form.get('modeofTransmission')[this.params][this.rendered] = false;
      }
      if (this.form.get('docsSendMode')) {
        this.form.get('docsSendMode')[this.params][this.rendered] = false;
        this.form.get('docsSendMode').setValue('');
      }
    } else {
      if (this.form.get('modeofTransmission')) {
        this.form.get('modeofTransmission')[this.params][this.rendered] = true;
      }
      if (this.form.get('docsSendMode')) {
        this.form.get('docsSendMode')[this.params][this.rendered] = true;
      }
    }
  }

  onClickCreateFromOptions(data: any) {
    if (data.value === FccGlobalConstant.TEMPLATE_VALUE) {
      this.onClickExistingTemplate();
    } else if (data.value === FccGlobalConstant.COPY_FROM) {
      this.onClickCopyFrom();
    }
    const form = this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS);
    if (this.form.get('enableDescTextArea') && this.form.get('enableDescTextArea').value === 'true') {
      form.controls.ecTermCode['options'] = form.controls.ecTermCode['options'].filter(element => element.value !== '04');
      form.controls.ecTenorType['options'] = form.controls.ecTenorType['options'].filter(element => element.value !== '03');
      form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)[this.params][FccGlobalConstant.RENDERED] = true;
      form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC)[this.params][FccGlobalConstant.RENDERED] = false;
    } else if (this.form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)) {
      form.get(FccTradeFieldConstants.OTHER_EC_TENOR_DESC_TEXT_AREA)[this.params][FccGlobalConstant.RENDERED] = false;
    }
    this.saveFormOject();
    this.stateService.setStateSection(FccGlobalConstant.EC_PAYMENT_DETAILS, form);
  }

  onBlurTemplateName() {
    if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_NAME, this.form)
    && (!this.form.get(FccGlobalConstant.TEMPLATE_NAME)[this.params][this.readonly])) {
      const templateName = this.form.get(FccGlobalConstant.TEMPLATE_NAME).value;
      this.lcTemplateService.isTemplateNameExists(templateName, FccGlobalConstant.PRODUCT_EC).subscribe( res => {
        const jsonContent = res.body as string[];
        const isTemplateIdExists = jsonContent[`isTemplateIdExists`];
        if (isTemplateIdExists) {
          this.form.get(FccGlobalConstant.TEMPLATE_NAME).setErrors({ duplicateTemplateName: { templateName } });
        } else {
          this.form.get(FccGlobalConstant.TEMPLATE_NAME).setErrors(null);
        }
      });
    }
  }

  onClickExistingTemplate() {
    this.setFieldsArrayNdSectionsData(true, '');

     //const header = `${this.translateService.instant('ecTemplateListing')}`;
    const header = `${this.translateService.instant('templateListingForEC')}`;
    const productCode = FccGlobalConstant.PRODUCT;
    const subProductCode = FccGlobalConstant.SUB_PRODUCT_CODE;
    const headerDisplay = FccGlobalConstant.HEADER_DISPLAY;
    const buttons = FccGlobalConstant.BUTTONS;
    const savedList = FccGlobalConstant.SAVED_LIST;
    const option = FccGlobalConstant.OPTION;
    const downloadIconEnabled = FccGlobalConstant.DOWNLOAD_ICON_ENABLED;
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_EC;
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
        this.templateIDSubProdCode = response.responseData.SUB_PRODUCT_CODE;
        this.getTemplateById(response.responseData.TEMPLATE_ID, response.responseData.EC_TYPE_CODE);
      }
    });

  }

  onClickCopyFrom() {
    this.setFieldsArrayNdSectionsData(false, FccGlobalConstant.PRODUCT_EC);

    const header = `${this.translateService.instant('copyFromEC')}`;
    const productCode = FccGlobalConstant.PRODUCT;
    const subProductCode = FccGlobalConstant.SUB_PRODUCT_CODE;
    const headerDisplay = FccGlobalConstant.HEADER_DISPLAY;
    const buttons = FccGlobalConstant.BUTTONS;
    const savedList = FccGlobalConstant.SAVED_LIST;
    const option = FccGlobalConstant.OPTION;
    const downloadIconEnabled = FccGlobalConstant.DOWNLOAD_ICON_ENABLED;
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_EC;
    obj[option] = 'Existing';
    obj[subProductCode] = '';
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;

    this.resolverService.getSearchData(header, obj);
    this.copyFromResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        this.copyFromRef(response.responseData.TNX_ID, response.responseData.REF_ID, response.responseData.EC_TYPE_CODE);
      }
    });

  }

  copyFromRef(tnxId: any, refId: any, ecTypeCode: any) {
    this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_EC);
    const prodCode = (tnxId !== undefined && tnxId !== null
      && tnxId !== FccGlobalConstant.EMPTY_STRING ) ?
      FccGlobalConstant.PRODUCT_EC : undefined;
    const eventIdToPass = (tnxId !== undefined && tnxId !== null
      && tnxId !== FccGlobalConstant.EMPTY_STRING ) ?
      tnxId : refId;
    this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_EC).subscribe(apiMappingModel => {
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
      const sectionName = FccGlobalConstant.EC_GENERAL_DETAILS;
      this.form = this.stateService.getSectionData(sectionName);
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
      this.form.get('referenceSelected')[this.params][this.rendered] = true;
      this.form.get('fetchedRefValue')[this.params][this.rendered] = true;
      this.form.get('removeLabel')[this.params][this.rendered] = true;
      this.form.get('fetchedRefValue').patchValue(refId);
      this.form.get('parentReference').patchValue(refId);
      this.patchFieldParameters(this.form.get('fetchedRefValue'), { readonly: true });
      this.form.get('ecCustomerReference').setValue(FccGlobalConstant.EMPTY_STRING);
      if (!this.fieldsArray || this.fieldsArray.length === 0) {
        this.form.get(FccTradeFieldConstants.BANK_REFERENCE).setValue(FccGlobalConstant.EMPTY_STRING);
      }
      this.patchFieldParameters(this.form.get('ecCustomerReference'), { readonly: false });
      this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCHED_TEMPLATE), { readonly: true });
      this.form.get(FccGlobalConstant.COLECTION_TYPE_OPTIONS).setValue(ecTypeCode);
      const collectionType = this.stateService.getSectionData(sectionName).get(FccGlobalConstant.COLECTION_TYPE_OPTIONS);
      this.onClickCollectionTypeOptions(collectionType);
      this.removeUnwantedFieldsForExistingEC();
    });
  });
  }

  removeUnwantedFieldsForExistingEC(){
    if (this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS)
      && this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS).get(FccGlobalConstant.AMOUNT_FIELD)){
        this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS).get(FccGlobalConstant.AMOUNT_FIELD)
          .setValue(FccGlobalConstant.EMPTY_STRING);
        this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS).get(FccGlobalConstant.CURRENCY)
          .setValue(FccGlobalConstant.EMPTY_STRING);
    }
    if (this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS)
      && this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS).get(FccGlobalConstant.EC_MATURITY_DATE)){
      this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS).get(FccGlobalConstant.EC_MATURITY_DATE).setValue(null);
    }
    if((this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS)
    && this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS).get('ecAvailableAmt')))
    {
      this.stateService.getSectionData(FccGlobalConstant.EC_PAYMENT_DETAILS).get('ecAvailableAmt')
      .setValue(FccGlobalConstant.EMPTY_STRING);
    }
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

  revertCopyFromDetails() {
    this.copyFromProductCode = '';
    this.excludingJsonFileKey = '';
    this.fieldsArray = [];
    this.sectionsArray = [];
    this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).setValue('');
    this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).updateValueAndValidity();
  }

  onClickRemoveLabel() {
    this.revertCopyFromDetails();
    const headerField = `${this.translateService.instant('removeSelectedTransaction')}`;
    const obj = {};
    const locaKey = 'locaKey';
    obj[locaKey] = this.templateKey ? this.templateKey : FccGlobalConstant.COPYFROM_EC_KEY;
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
        if (this.templateKey) {
          this.resetRemoveLabelTemplate();
        } else {
          this.resetFieldsForCopyFromTemplate();
        }
      }
      this.templateKey = null;
    });
  }

  toggleCreateFormButton(val, enable) {
    val.forEach( (element) => {
      element[this.disabled] = enable;
    });
  }

  removeUnwantedFieldsForTemplate() {
    if (!this.fieldsArray || this.fieldsArray.length === 0) {
      this.stateService.getSectionData(FccGlobalConstant.EC_BANK_DETAILS).get(FccGlobalConstant.REMITTING_BANK)
      .get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(FccGlobalConstant.EMPTY_STRING);
    }
  }
  getTemplateById(templateID, ecTypeCode) {
    this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_EC);
    this.transactionDetailService.
    fetchTransactionDetails(templateID, FccGlobalConstant.PRODUCT_EC, true, this.templateIDSubProdCode).subscribe(responseData => {
      const responseObj = responseData.body;
      this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_EC).subscribe(apiMappingModel => {
      const setStateForProduct = {
        responseObject: responseObj,
        apiModel: apiMappingModel,
        isMaster: false,
        fieldsList: this.fieldsArray,
        sectionsList: this.sectionsArray
      };
      this.commonService.productState.next(setStateForProduct);
      const sectionName = FccGlobalConstant.EC_GENERAL_DETAILS;
      this.form = this.stateService.getSectionData(sectionName);
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.FETCHED_TEMPLATE)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = true;
      const element = document.createElement('div');
      element.innerHTML = templateID;
      templateID = element.textContent;
      this.form.get(FccGlobalConstant.FETCHED_TEMPLATE).patchValue(templateID);
      this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCHED_TEMPLATE), { readonly: true });
      this.form.get(FccGlobalConstant.COLECTION_TYPE_OPTIONS).setValue(ecTypeCode);
      const ecDraweeReference = setStateForProduct.responseObject.drawee_reference;
      this.form.get(FccGlobalConstant.EC_DRAWEE_REFERENCE).setValue(ecDraweeReference);
      const collectionType = this.stateService.getSectionData(sectionName).get(FccGlobalConstant.COLECTION_TYPE_OPTIONS);
      this.addValidators();
      this.onClickCollectionTypeOptions(collectionType);
      this.removeUnwantedFieldsForTemplate();
    });
  });
  }

  /**
   *  Reset fields for Copy From on click on confirmation from dialog box
   */
  resetFieldsForCopyFromTemplate() {
    this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).setValue('');
    this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).updateValueAndValidity();
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = true;
    this.form.get('referenceSelected')[this.params][this.rendered] = false;
    this.form.get('fetchedRefValue')[this.params][this.rendered] = false;
    this.form.get('removeLabel')[this.params][this.rendered] = false;
    this.form.get('fetchedRefValue').setValue('');
    const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
    const val1 = this.form.get(FccGlobalConstant.COLECTION_TYPE_OPTIONS)[this.params][this.options];
    this.toggleTemplateCreateFormButtons(val, val1, false);
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
    this.copyFromResponse.unsubscribe();
    this.productStateService.clearState();
    this.formModelService.getFormAndSubSectionModel(FccGlobalConstant.PRODUCT_EC).subscribe(modelJson => {
      if (modelJson) {
        this.formModelService.subSectionJson = modelJson[1];
        this.productStateService.initializeState(FccGlobalConstant.PRODUCT_EC);
        this.productStateService.populateAllEmptySectionsInState();
        this.form.get('ecCustomerReference').setValue('');
      }
    });
  }

  onClickRemoveLabelTemplate() {
    this.templateKey = FccGlobalConstant.TEMPLATEFROM_KEY;
    this.onClickRemoveLabel();
  }

  resetRemoveLabelTemplate() {
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.FETCHED_TEMPLATE)[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.FETCHED_TEMPLATE).setValue('');
    const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
    const val1 = this.form.get(FccGlobalConstant.COLECTION_TYPE_OPTIONS)[this.params][this.options];
    this.toggleTemplateCreateFormButtons(val, val1, false);
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
    this.templateResponse.unsubscribe();
    this.productStateService.clearState();
    this.formModelService.getFormAndSubSectionModel(FccGlobalConstant.PRODUCT_EC).subscribe(modelJson => {
      if (modelJson) {
        this.formModelService.subSectionJson = modelJson[1];
        // this.productStateService.initializeProductModel(modelJson[0]); // probably not required again to initialize
        this.productStateService.initializeState(FccGlobalConstant.PRODUCT_EC);
        this.productStateService.populateAllEmptySectionsInState();
      }
    });
    this.initializeFormGroup();
  }

  toggleTemplateCreateFormButtons(val, val1, enable) {
    val.forEach( (element) => {
      element[this.disabled] = enable;
    });
  }

  disableCreateFormButtons(val, enable) {
    val.forEach( (element) => {
      element[this.disabled] = enable;
    });
  }

  ngAfterViewChecked() {
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.resetCreatForm();
    }
  }

  resetCreatForm() {
    if ( this.form.get(FccGlobalConstant.FETCHED_TEMPLATE).value ) {
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue(FccGlobalConstant.TEMPLATE_VALUE);
    }
    if ( this.form.get(FccGlobalConstant.FETCH_REF_VALUE).value ) {
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue(FccGlobalConstant.COPY_FROM);
    }
    if ( (!this.form.get(FccGlobalConstant.FETCHED_TEMPLATE).value) && (!this.form.get(FccGlobalConstant.FETCH_REF_VALUE).value)) {
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue(FccGlobalConstant.EMPTY_STRING);
    }
  }

  templateChanges() {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.form.get(FccGlobalConstant.TEMPLATE_NAME)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.TEMPLATE_NAME)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.addFCCValidators(FccGlobalConstant.TEMPLATE_NAME,
        Validators.compose([Validators.pattern(FccGlobalConstant.TEMPLATE_NAME_VALIDATION)]), 0);
      this.form.get(FccGlobalConstant.TEMPLATE_DESC)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.CREATE_FROM)[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.SUB_PRODUCT_CODE), FccGlobalConstant.SUBPRODUCT_DEFAULT, {});
      if (this.mode !== FccGlobalConstant.DRAFT_OPTION && !this.form.get(FccGlobalConstant.TEMPLATE_NAME).value) {
        this.commonService.generateTemplateName(FccGlobalConstant.PRODUCT_EC).subscribe( res => {
          const jsonContent = res.body as string[];
          const templateName = jsonContent[`templateName`];
          this.form.get(FccGlobalConstant.TEMPLATE_NAME).setValue(templateName);
        });
      }
      if ( this.templteId !== undefined && this.templteId !== null && this.mode === FccGlobalConstant.DRAFT_OPTION) {
        this.form.get('templateName')[this.params][this.readonly] = true;
      }
    }
  }

  editModeDataPopulate() {
    const templateName = this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_NAME, this.form) ?
                          this.form.get(FccGlobalConstant.TEMPLATE_NAME).value : undefined;
    if ((this.mode === 'DRAFT' && this.option !== FccGlobalConstant.TEMPLATE) && this.commonService.isNonEmptyValue(templateName) &&
      this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_TEMPLATE, this.form)) {
      this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(templateName);
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
    this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.FETCHED_TEMPLATE)[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = true;
    const element = document.createElement('div');
    element.innerHTML = templateID;
    templateID = element.textContent;
    this.form.get(FccGlobalConstant.FETCHED_TEMPLATE).patchValue(templateID);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCHED_TEMPLATE), { readonly: true });
}

  ngOnDestroy() {
    this.stateService.setStateSection(FccGlobalConstant.EC_GENERAL_DETAILS, this.form);
    this.templateResponse = null;
    if (this.form && this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
    }
    this.copyFromResponse = null;
    if (this.form && this.commonService.isNonEmptyField('removeLabel', this.form)) {
      this.form.get('removeLabel')[this.params][this.rendered] = false;
    }
    this.commonService.actionsDisable = false;
    this.commonService.buttonsDisable = false;
    if(this.taskSubscription != null && this.taskSubscription != undefined){
       this.taskSubscription.unsubscribe();
      }
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_EC, key);
  }

  removeOptionFromCollectionType(collectionTypeOptions, codeValue) {
    for (let i = 0; i < collectionTypeOptions.length; i++) {
      const value = collectionTypeOptions[i].value;
      if (value === codeValue) {
        collectionTypeOptions.splice(i, 1);
        break;
      }
    }
  }

}
