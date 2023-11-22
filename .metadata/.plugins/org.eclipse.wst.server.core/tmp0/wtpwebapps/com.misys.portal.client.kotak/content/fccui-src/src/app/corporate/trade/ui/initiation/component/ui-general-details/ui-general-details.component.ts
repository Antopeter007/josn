import { AfterViewInit, AfterViewChecked, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { ProductMappingService } from '../../../../../../common/services/productMapping.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { ConfirmationDialogComponent } from '../../../../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiService } from '../../../common/services/ui-service';
import { LcTemplateService } from '../../../../../../common/services/lc-template.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { TransactionDetailService } from './../../../../../../common/services/transactionDetail.service';
import { LcConstant } from './../../../../lc/common/model/constant';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FormatAmdNoService } from '../../../../../../common/services/format-amd-no.service';
import { Subscription } from 'rxjs';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { MultiBankService } from '../../../../../../../app/common/services/multi-bank.service';

@Component({
  selector: 'app-ui-general-details',
  templateUrl: './ui-general.details.component.html',
  styleUrls: ['./ui-general.details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiGeneralDetailsComponent }]
})
export class UiGeneralDetailsComponent extends UiProductComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  form: FCCFormGroup;
  appBenForm: FCCFormGroup;
  module = `${this.translateService.instant(FccGlobalConstant.UI_GENERAL_DETAIL)}`;
  contextPath: any;
  mode: any;
  tnxId: any;
  productCode: any;
  subTnxTypeCode: any;
  option: any;
  refId: any;
  amdNum;
  fromExisitingUIResponse: any;
  uiTemplateResponse: any;
  uiBankTemplateResponse: any;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  styleClass = this.lcConstant.styleClass;
  options = this.lcConstant.options;
  disabled = this.lcConstant.disabled;
  sectionName = 'generalDetails';
  rendered = this.lcConstant.rendered;
  swiftXChar;
  swiftZChar;
  templteId;
  readonly = this.lcConstant.readonly;
  transmissionMode: any;
  templateIDSubProdCode: any;
  isMasterRequired: any;
  fromBankResponse;
  uiBankTemplateFlag;
  viewSpecimenDownloadParams;
  bankDetailResponseObj;
  editModeDownloadData;
  bankTemplateName;
  @ViewChildren('selBtn') public myDivElementRef: QueryList<any>;
  formDataObj = 'formData';
  templateKey: string;
  custRefLength;
  tnxStatCode: any;
  amdNoVal: any;

  excludedFieldsNdSections: any;
  excludingJsonFileKey = '';
  fieldsArray = [];
  sectionsArray = [];
  maxLength;
  taskSubscription : Subscription;
  isGlobalLvlCheckEnabled;
  RenderProvisional: boolean;
  isAnyProvBankAvl: boolean;
  provisionalBankList: Set<string> = new Set<string>();
  sitype: Set<string> = new Set<string>();
  provisionalBankMap: Map<string, any> = new Map();
  singleBank: boolean;
  provRender: boolean;
  provisionalBankArr = [];

  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, public confirmationService: ConfirmationService,
              protected leftSectionService: LeftSectionService, protected dialogService: DialogService,
              public uiService: UiService, protected amendCommonService: AmendCommonService,
              protected lcTemplateService: LcTemplateService,
              protected resolverService: ResolverService, protected searchLayoutService: SearchLayoutService,
              protected productMappingService: ProductMappingService, protected utilityService: UtilityService,
              protected transactionDetailService: TransactionDetailService,
              protected formModelService: FormModelService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected phrasesService: PhrasesService, protected formatAmdNoService: FormatAmdNoService,
              protected fccTaskService: FccTaskService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService,
              protected multiBankService: MultiBankService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.isMasterRequired = this.isMasterRequired;
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.option = this.commonService.getQueryParametersFromKey('option');
    this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.templteId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TEMPLATE_ID);
    this.tnxStatCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.eventTnxStatCode);
    this.initializeFormGroup();
    this.setLUStatus();
    this.templateChanges();
    this.getExcludedFieldsNdSections();
    this.onClickProvisionalStatus();
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      this.amendCommonService.compareTransactionAndMasterForAmend(productCode);
    }
    this.uiBankTemplateFlag = this.commonService.getUserPermissionFlag(FccGlobalConstant.UI_BANK_TEMPLATE);
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.custRefLength = response.customerReferenceTradeLength;
        if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators('customerReference', Validators.maxLength(this.custRefLength), 0);
          this.form.addFCCValidators('beneficiaryReference', Validators.maxLength(this.custRefLength), 0);
        }
      }
    });
    if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators('narrativeTransferConditions',
      Validators.compose([Validators.maxLength(this.maxLength), Validators.pattern(this.swiftZChar)]), 0);
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
    this.setAmendmentNumbers();
    this.editModeDataPopulate();

    this.taskSubscription = this.fccTaskService.notifyTaskAfterSaveTnx$.subscribe(data => {
      if(data) {
      if (this.form && this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL, this.form)) {
        this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
      }
      if (this.form && this.commonService.isNonEmptyField('removeLabelTemplate', this.form)) {
        this.form.get('removeLabelTemplate')[this.params][this.rendered] = false;
          }
      }
      if ((this.option === FccGlobalConstant.TEMPLATE ||
        this.form.get('createFromOptions').value === FccGlobalConstant.TEMPLATE_VALUE)
          && this.form.get('bgSubProductCode') &&
      this.form.get('bgSubProductCode').value != '') {
        this.form.get('bgSubProductCode')['params']['readonly'] = true;
      }
      });
      if ((this.option === FccGlobalConstant.TEMPLATE ||
        this.form.get('createFromOptions').value === FccGlobalConstant.TEMPLATE_VALUE)
         && this.mode === FccGlobalConstant.DRAFT_OPTION) {
          this.form.get('bgSubProductCode')['params']['readonly'] = true;
      }


  }

  setAmendmentNumbers(){
    const amdReqNo = this.stateService.getSectionData(FccGlobalConstant.eventDetails).get('amendmentReqNo');
    const amendmentNo = this.stateService.getSectionData(FccGlobalConstant.eventDetails).get('amendmentNo');
    if ((this.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
      ( this.commonService?.currentStateTnxResponse !== undefined
        && this.commonService.currentStateTnxResponse?.prod_stat_code === FccGlobalConstant.N005_AMENDED ) && amendmentNo !== null)) {
      const amdReqNoValue = (amdReqNo && amdReqNo.value) ? amdReqNo.value: '';
      const amdNoAvl = (amendmentNo && amendmentNo.value) ? true :false;
      if (amdNoAvl) {
        this.amdNoVal = amendmentNo.value;
        amendmentNo[this.params][this.rendered] = false;
      }
      if ((this.tnxStatCode === FccGlobalConstant.N004_UNCONTROLLED || this.tnxStatCode === FccGlobalConstant.N004_INCOMPLETE ||
        ( this.commonService?.currentStateTnxResponse !== undefined
        && this.commonService.currentStateTnxResponse?.tnx_stat_code === FccGlobalConstant.N004_UNCONTROLLED))
        && (amdReqNoValue === null || amdReqNoValue === undefined || amdReqNoValue === '')){
          if (this.commonService.isNonEmptyValue(amdReqNo)) {
            amdReqNo.setValue(FccGlobalConstant.AMD_REQ_NOT_GENERATED);
            amdReqNo[this.params][this.rendered] = true;
          }
          if (this.commonService.isNonEmptyValue(amendmentNo)) {
            amendmentNo[this.params][this.rendered] = false;
          }
      } else if(( this.commonService?.currentStateTnxResponse !== undefined
          && this.commonService.currentStateTnxResponse?.prod_stat_code === FccGlobalConstant.N005_REJECTED)
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

  getExcludedFieldsNdSections() {
    const productCode = FccGlobalConstant.PRODUCT_BG;
    this.transactionDetailService.getExcludedFieldsNdSections(productCode).subscribe(
      (response) => {
        this.excludedFieldsNdSections = response.body;
      }, (error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    );
  }

  initializeFormGroup() {
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    const sectionName = FccGlobalConstant.UI_GENERAL_DETAIL;
    this.form = this.productStateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    this.provisional();
    if (this.commonService.isnonEMptyString(this.form.get('advSendMode').value)){
      this.transmissionMode = this.form.get('advSendMode').value;
    } else {
      this.form.get('advSendMode').setValue(FccBusinessConstantsService.SWIFT);
      this.transmissionMode = this.form.get('advSendMode').value;
    }
    this.commonService.isTransmissionModeChanged(this.form.get('advSendMode').value);
    this.form.updateValueAndValidity();
    this.productStateService.setStateSection(FccGlobalConstant.UI_GENERAL_DETAIL, this.form, this.isMasterRequired);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      if (this.form.get(FccTradeFieldConstants.MODE_OF_TRANSMISSION)) {
        this.form.get(FccTradeFieldConstants.MODE_OF_TRANSMISSION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      if (this.transmissionMode[0] && this.transmissionMode[0].value === FccBusinessConstantsService.OTHER_99) {
      this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT], true);
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.ADV_SEND_MODE], false);
      }
    }
    this.commonService.formatForm(this.form);
    this.form.updateValueAndValidity();
    this.setPurposeValue();
    this.resetCreateForm();
    this.populateDataForEditFrom();
    this.handlePurposeValuesForDepu();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.swiftXChar = response.swiftXCharacterSet;
      this.swiftZChar = response.swiftZChar;
      this.isGlobalLvlCheckEnabled = response.enableGlobalRoleCheck;
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('customerReference', Validators.compose([Validators.maxLength(this.custRefLength)]), 0);
        this.form.addFCCValidators('beneficiaryReference', Validators.compose([Validators.maxLength(this.custRefLength)]), 0);
        this.form.addFCCValidators('advSendModeText', Validators.pattern(this.swiftXChar), 0);
        if(this.commonService.isnonEMptyString(this.form.get('narrativeTransferConditions'))){
        this.maxLength = this.form.get('narrativeTransferConditions')[this.params]['maxlength'];
        this.form.addFCCValidators('narrativeTransferConditions',
        Validators.compose([Validators.maxLength(this.maxLength), Validators.pattern(this.swiftZChar)]), 0);
       }
      }
    });
    this.setFormsOfUndertaking();
  }

  setFormsOfUndertaking() {
    const perms = ['bg_dgar_save', 'bg_stby_save', 'bg_depu_save'];
    const eventDataArray = [];
    let flag;
    perms.forEach(perKey => {
      if(this.isGlobalLvlCheckEnabled) {
        flag = this.commonService.getUserPermissionFlag(perKey);
      } else {
        flag = this.commonService.getUserPermissionFlagGlobalCheck(perKey);
      }
      if (flag) {
        const eventData: { label: string; value: any } = {
          label: `${this.translateService.instant(perKey.split('_')[1].toUpperCase().toString())}`,
          value: `${perKey.split('_')[1].toUpperCase().toString()}`
        };
        eventDataArray.push(eventData);
      }
    });
    setTimeout(() => {
      this.form.get('bgSubProductCode')[FccGlobalConstant.OPTIONS] = eventDataArray;
      const val = this.form.get('bgSubProductCode').value;
      if (val === undefined || val === null || val === '') {
        this.form.get('bgSubProductCode').setValue(eventDataArray[0].value);
        this.onClickBgSubProductCode();
      }
      this.form.updateValueAndValidity();
      }, 1000);
  }

  populateMultiBank() {
    const subProductCode = this.commonService.isNonEmptyValue(this.form.get('bgSubProductCode').value) ?
    this.form.get('bgSubProductCode').value : '';
    this.multiBankService.getCustomerBankDetails( FccGlobalConstant.PRODUCT_BG, subProductCode).subscribe(
      res => {
        this.multiBankService.initializeProcess(res);
      }
    );
  }

  resetCreateForm() {
    if (this.form && this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_BANK_TEMPLATE, this.form) &&
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE).value) {
      this.form.get('createFromOptions').setValue(FccGlobalConstant.BANK_TEMPLATE);
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        this.form.get(FccGlobalConstant.CREATE_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        if(this.mode === 'DRAFT'){
        this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
        }
        else{
        this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = true;
        }
      }
    }
    if ( this.form.get('fetchedRefValue').value ) {
      this.form.get('createFromOptions').setValue('bgCopyFrom');
    }
    else if ( this.form.get('fetchedBankTemplate').value ) {
      this.form.get('createFromOptions').setValue('bankTemplate');
    }
    else if ( this.form.get(FccGlobalConstant.FETCHED_TEMPLATE).value ) {
      this.form.get('createFromOptions').setValue('template');
    }
    if ((!this.form.get('fetchedRefValue').value) && (!this.form.get('fetchedTemplate').value)
      && (!this.form.get('fetchedBankTemplate').value)) {
      this.form.get('createFromOptions').setValue('');
    }
  }

  templateChanges() {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.form.get(FccGlobalConstant.REQUEST_TYPE_UI)[this.params][this.rendered] = false;
      if (this.form.get(FccGlobalConstant.PROVISIONAL_STATUS)) {
      this.form.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][this.rendered] = false;
      }
      this.form.get(FccGlobalConstant.TEMPLATE_NAME)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.TEMPLATE_NAME)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.addFCCValidators(FccGlobalConstant.TEMPLATE_NAME,
        Validators.compose([Validators.pattern(FccGlobalConstant.TEMPLATE_NAME_VALIDATION)]), 0);
      this.form.get(FccGlobalConstant.TEMPLATE_DESC)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.CREATE_FROM)[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
      if (this.mode !== FccGlobalConstant.DRAFT_OPTION && !this.form.get(FccGlobalConstant.TEMPLATE_NAME).value) {
        this.commonService.generateTemplateName(FccGlobalConstant.PRODUCT_BG).subscribe( res => {
          const jsonContent = res.body as string[];
          const templateName = jsonContent[`templateName`];
          this.form.get(FccGlobalConstant.TEMPLATE_NAME).setValue(templateName);
          this.commonService.putQueryParameters(FccGlobalConstant.TEMPLATE_NAME, this.form.get(FccGlobalConstant.TEMPLATE_NAME).value);
        });
      }
      this.commonService.putQueryParameters(FccGlobalConstant.TEMPLATE_NAME, this.form.get(FccGlobalConstant.TEMPLATE_NAME).value);
      if ( this.templteId !== undefined && this.templteId !== null && this.mode === FccGlobalConstant.DRAFT_OPTION) {
          this.form.get(FccGlobalConstant.TEMPLATE_NAME)[this.params][this.readonly] = false;
      }
    } else if(this.mode === FccGlobalConstant.VIEW){
      this.form.get('templateSelection')[this.params][this.rendered] = true;
      this.form.get('templateSelection')[this.params][this.lcConstant.previewScreen] = true;
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[this.params][this.lcConstant.previewScreen] = true;
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[this.params][this.readonly] = true;
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE).updateValueAndValidity();
    }
  }

  amendFormFields() {
   this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.UI_GENERAL_DETAIL);
   if (this.form.get(FccGlobalConstant.PROVISIONAL_STATUS)) {
   this.form.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][this.rendered] = false;
   }
   if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.mode === FccGlobalConstant.DRAFT_OPTION){
    if (this.form.get('bankReferenceView') && this.form.get('bankReferenceView').value)
    {
      this.form.get('bankReferenceView')[this.params][this.rendered] = true;
      this.form.get('bankReferenceView').updateValueAndValidity();
    }
    if (this.form.get('issDate') && this.form.get('issDate').value)
    {
      this.form.get('issDate')[this.params][this.rendered] = true;
      this.form.get('issDate').updateValueAndValidity();
    }
    if (this.form.get('orgExpiryDate') && this.form.get('orgExpiryDate').value)
    {
      this.form.get('orgExpiryDate')[this.params][this.rendered] = true;
      this.form.get('orgExpiryDate').updateValueAndValidity();
    }
  }
}

  setPurposeValue() {
      const val = this.form.get('purposeUI').value;
      const purposeOptions = this.form.get('purposeUI')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      purposeOptions.forEach( (element) => {
        if (element.value === val) {
          element[FccGlobalConstant.CHECKED] = true;
        } else {
          element[FccGlobalConstant.CHECKED] = false;
        }
      });
  }

  onClickAdvSendMode(data: any) {
    this.transmissionMode = data.value;
    if (data.value === '99') {
      this.form.get('advSendModeTextOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.ADV_SEND_MODE], false);
      this.form.get('narrativeTransferConditions').clearValidators();
    } else {
      this.form.get('advSendModeTextOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.ADV_SEND_MODE], true);
      this.form.get('advSendModeText').setValue('');
      this.form.get('advSendModeText').clearValidators();
      this.form.get('advSendModeText').updateValueAndValidity();
      this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }

    if (data.value === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators('customerReference', Validators.compose([Validators.maxLength(this.custRefLength)]), 0);
      this.form.addFCCValidators('beneficiaryReference', Validators.compose([Validators.maxLength(this.custRefLength)]), 0);
      this.form.addFCCValidators('advSendModeText', Validators.pattern(this.swiftXChar), 0);
      this.form.addFCCValidators('narrativeTransferConditions',
      Validators.compose([Validators.maxLength(this.maxLength), Validators.pattern(this.swiftZChar)]), 0);
      this.form.get('customerReference').updateValueAndValidity();
      this.form.get('additionalCustRef').updateValueAndValidity();
      this.form.get('beneficiaryReference').updateValueAndValidity();
      this.form.get('advSendModeText').updateValueAndValidity();
      this.form.get('narrativeTransferConditions').updateValueAndValidity();
    } else {
      this.form.get('additionalCustRef').clearValidators();
      this.form.get('advSendModeText').clearValidators();
      this.form.get('narrativeTransferConditions').clearValidators();
      this.form.get('customerReference').updateValueAndValidity();
      this.form.get('additionalCustRef').updateValueAndValidity();
      this.form.get('beneficiaryReference').updateValueAndValidity();
      this.form.get('advSendModeText').updateValueAndValidity();
      this.form.get('narrativeTransferConditions').updateValueAndValidity();
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, 'advSendModeText', false);
      this.form.setErrors(null);
      this.form.clearValidators();
      this.form.updateValueAndValidity();
    }
    this.commonService.isTransmissionModeChanged(this.form.get('advSendMode').value);
  }

  onClickBgSubProductCode() {
    const val = this.form.get('bgSubProductCode').value;
    this.form.get('bgSubProductCode').setValue(null);
    this.form.get('bgSubProductCode').setValue(val);
    if (this.form.get('bgSubProductCode') && this.form.get('bgSubProductCode').value === FccGlobalConstant.STBY) {
      this.toggleFormFields(true, this.form, ['bgConfInstructions', 'confirmationInstruction', 'bgTransferIndicator']);
      this.form.get('bgTransferIndicator').setValue('N');
      this.form.get('bgTransferIndicator').updateValueAndValidity();
      this.setLUStatus();
    } else {
      this.toggleFormFields(false, this.form, ['bgConfInstructions', 'confirmationInstruction', 'bgTransferIndicator',
      'narrativeTransferConditions']);
    }
    this.onClickBgConfInstructions();
    if ((this.commonService.uiBankDetailResponseObj && this.commonService.uiBankDetailResponseObj.sub_product_code &&
      this.commonService.uiBankDetailResponseObj.sub_product_code != null) &&
      (this.form.get('bgSubProductCode')) &&
      (this.form.get('bgSubProductCode').value !== this.commonService.uiBankDetailResponseObj.sub_product_code)) {
        this.onClickRemoveLabelTemplate();
    }
    this.handlePurposeValuesForDepu();
    this.populateMultiBank();
    this.resetApplicantFieldsOnSubprodChange();
  }

  resetApplicantFieldsOnSubprodChange() {
    const fields = ['applicantEntity','applicantName', 'applicantFirstAddress', 'applicantSecondAddress',
    'applicantThirdAddress', 'applicantFullAddress', 'applicantcountry'];

    fields.forEach(ele => {
      this.stateService.getSectionData(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS).get(ele).setValue('');
      this.stateService.getSectionData(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS).get(ele).updateValueAndValidity();
    });
    this.stateService.getSectionData(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS)
    .get('applicantEntity')['params']['readonly'] = false;
    this.fccTaskService.setTaskEntity('');
  }

  handlePurposeValuesForDepu() {
    const purposeOptions = this.form.get('purposeUI')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    if (this.form.get('bgSubProductCode') && this.form.get('bgSubProductCode').value === FccTradeFieldConstants.SUB_PROD_CODE_DEPU) {
        this.form.get(FccTradeFieldConstants.UI_PURPOSE).setValue('01');
        purposeOptions.forEach( (element) => {
        if (element.value !== '01') {
          element[FccGlobalConstant.READONLY] = true;
        }
      });
        this.setLUStatus();
      } else {
        purposeOptions.forEach( (element) => {
          element[FccGlobalConstant.READONLY] = false;
        });
      }
  }

  onClickBgConfInstructions(){
    const confirmingBank = this.stateService
    .getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    )
    .get("uiConfirmingBank");

    const advisingBank = this.stateService
    .getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    )
    .get("uiAdvisingBank");

    const advisThruBank = this.stateService
    .getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    )
    .get("uiAdviceThrough");

    const localAdvThruBank = this.stateService
    .getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    )
    .get("uiLocalAdviseThrough");


    const confirmingBankFields = ['confirmingBankIcons', 'confirmingSwiftCode', 'confirmingBankName',
    'confirmingBankFirstAddress', 'confirmingBankSecondAddress', 'confirmingBankThirdAddress'];
    const confirmCheckReq = (this.form.get('bgSubProductCode') && this.form.get('bgSubProductCode').value === 'STBY' &&
    this.form.get('bgConfInstructions') && this.form.get('bgConfInstructions').value !== '03');
    if (confirmingBank) {
        this.toggleControls(confirmingBank, confirmingBankFields, confirmCheckReq);
    }
    if (advisThruBank && advisThruBank.get('adviseThruBankConfReq')) {
        advisThruBank.get('adviseThruBankConfReq')[this.params].rendered = confirmCheckReq;
    }
    if (advisingBank && advisingBank.get('advBankConfReq')) {
        advisingBank.get('advBankConfReq')[this.params].rendered = confirmCheckReq;
    }
    if (localAdvThruBank && localAdvThruBank.get('localAdviseThroughBankConfReq')) {
      localAdvThruBank.get('localAdviseThroughBankConfReq')[this.params].rendered = confirmCheckReq;
  }
  }

  onClickPurposeUI() {
    if (this.form.get('purposeUI').value === '01' && this.uiService.getOldPurposeVal() !== '') {
      const headerField = `${this.translateService.instant('Change of Purpose')}`;
      const dir = localStorage.getItem('langDir');
      const locaKey = 'locaKey';
      const obj = {};
      let isUserConfirmed = false;
      obj[locaKey] = 'purposeConfirmationMsg';
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        data: obj,
        header: headerField,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir }
      });
      dialogRef.onClose.subscribe((result: any) => {
        if (result.toLowerCase() === 'yes') {
          this.setLUStatus();
          isUserConfirmed = true;
        } else if (result.toLowerCase() === 'no') {
          this.form.get('purposeUI').setValue(this.uiService.getOldPurposeVal());
          this.setLUStatus();
          isUserConfirmed = true;
        }
      });
      dialogRef.onDestroy.subscribe((result: any) => {
        if (result === undefined && isUserConfirmed === false) {
          this.form.get('purposeUI').setValue(this.uiService.getOldPurposeVal());
          this.setLUStatus();
        }
      });
    } else {
      this.setLUStatus();
      this.uiService.setOldPurposeVal(this.form.get('purposeUI').value);
    }
  }

  setLUStatus() {
    if (this.enableCounterSection && ((this.form.get('purposeUI').value === '02' || this.form.get('purposeUI').value === '03')
        || (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get('purposeUI').value[0] &&
         (this.form.get('purposeUI').value[0].value === '02'
        || this.form.get('purposeUI').value[0].value === '03'))) && this.form.get('bgSubProductCode')
        && (!(this.form.get('bgSubProductCode').value === 'DEPU')
        || !(this.form.get('bgSubProductCode').value === FccGlobalConstant.STBY))) {
  //   const prevIndex = this.productStateService.getUISectionindex(FccGlobalConstant.UI_UNDERTAKING_DETAILS);
     this.leftSectionService.addDynamicSection([{ sectionName : FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS }]);
    } else {
      this.leftSectionService.removeDynamicSection([{ sectionName : FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS }]);
    }
  }

  onClickBgTransferIndicator() {
    if (this.form.get('bgTransferIndicator') && this.form.get('bgTransferIndicator').value === 'Y') {
      this.form.get('narrativeTransferConditions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('narrativeTransferConditions').setValue('');
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.BG_TRANSFER_INDICATOR], true);
    } else {
      this.form.get('narrativeTransferConditions').setValue('');
      this.form.get('narrativeTransferConditions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.BG_TRANSFER_INDICATOR], false);
    }
  }
  ngOnDestroy() {
    if (this.form !== undefined && this.form.get('removeLabelTemplate') !== undefined
        && this.form.get('removeLabelTemplate') !== null) {
      this.form.get('removeLabelTemplate')[this.params][this.rendered] = false;
    }
    if (this.form !== undefined && this.form.get(FccGlobalConstant.REMOVE_LABEL)) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
    }
    this.productStateService.setStateSection(FccGlobalConstant.UI_GENERAL_DETAIL, this.form, this.isMasterRequired);
    this.fromExisitingUIResponse = null;
    this.uiTemplateResponse = null;
    this.uiBankTemplateResponse = null;
    this.commonService.actionsDisable = false;
    this.commonService.buttonsDisable = false;
    this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
    this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    if(this.taskSubscription != null && this.taskSubscription != undefined){
      this.taskSubscription.unsubscribe();
     }
  }

  onClickCreateFromOptions(data: any) {
    if (data.value === 'bgCopyFrom') {
      this.onClickCopyFromUndertakingIssued();
    } else if (data.value === 'template') {
      this.onClickExistingTemplate();
    } else if (data.value === 'bankTemplate') {
      this.onClickBankTemplate();
    }
  }

  onClickBankTemplate() {
    this.setFieldsArrayNdSectionsData(true, '');
    if (this.uiBankTemplateResponse != null) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.uiTemplateResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
    const header = `${this.translateService.instant('bankUITemplateListing')}`;
    const productCode = 'productCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_BG;
    obj[option] = 'UNDERTAKINGBANKTEMPLATE';
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    this.resolverService.getSearchData(header, obj);
    this.commonService.actionsDisable = true;
    this.commonService.buttonsDisable = true;
    this.uiBankTemplateResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (this.fromExisitingUIResponse != null) {
        this.fromExisitingUIResponse.unsubscribe();
      }
      if (this.uiTemplateResponse != null) {
        this.uiTemplateResponse.unsubscribe();
      }
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        this.getBankTemplateById(response.responseData);
      }
    });
  }

  onClickExistingTemplate() {
    this.setFieldsArrayNdSectionsData(true, '');
    if (this.uiTemplateResponse != null) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.uiTemplateResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
    const header = `${this.translateService.instant('templateListingForUI')}`;
    const productCode = FccGlobalConstant.PRODUCT;
    const subProductCode = FccGlobalConstant.SUB_PRODUCT_CODE;
    const headerDisplay = FccGlobalConstant.HEADER_DISPLAY;
    const buttons = FccGlobalConstant.BUTTONS;
    const savedList = FccGlobalConstant.SAVED_LIST;
    const option = FccGlobalConstant.OPTION;
    const downloadIconEnabled = FccGlobalConstant.DOWNLOAD_ICON_ENABLED;
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_BG;
    obj[option] = FccGlobalConstant.CREATE_FROM_TEMPLATE;
    obj[subProductCode] = '';
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    this.commonService.actionsDisable = true;
    this.commonService.buttonsDisable = true;
    this.uiService.setOption(FccGlobalConstant.TEMPLATE);

    this.resolverService.getSearchData(header, obj);
    this.uiTemplateResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (this.fromExisitingUIResponse != null) {
        this.fromExisitingUIResponse.unsubscribe();
      }
      if (this.uiBankTemplateResponse != null) {
        this.uiBankTemplateResponse.unsubscribe();
      }
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        this.templateIDSubProdCode = response.responseData.SUB_PRODUCT_CODE;
        this.getTemplateById(response.responseData.TEMPLATE_ID);
      }
    });
  }

  getBankTemplateById(params: any) {
    const element = document.createElement('div');
    element.innerHTML = params.FEATUREID;
    params.FEATUREID = element.textContent;
    this.productStateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_BG);
    this.transactionDetailService.fetchBankTemplateDetails(FccGlobalConstant.PRODUCT_BG, params)
    .subscribe(responseData => {
      this.commonService.uiBankDetailResponseObj = responseData.body;
      this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_BG).subscribe(apiMappingModel => {
        const setStateForProduct = {
          responseObject: responseData.body,
          apiModel: apiMappingModel,
          isMaster: false,
          fieldsList: this.fieldsArray,
          sectionsList: this.sectionsArray
        };
        this.commonService.productState.next(setStateForProduct);
        const sectionName = FccGlobalConstant.UI_GENERAL_DETAIL;
        this.form = this.productStateService.getSectionData(sectionName, undefined, this.isMasterRequired);
        if (this.tnxTypeCode === '01' && (this.mode === 'INITIATE' || this.mode === 'DRAFT')){
          this.form.get('viewSpecimenHyperLink')[this.params][this.rendered] = true;
        }
        this.setLUStatus();
        if (this.commonService.uiBankDetailResponseObj.bg_text_details_code === '01'
          && !isNaN(this.commonService.uiBankDetailResponseObj.document_id)) {
            this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
            params.FEATUREID, { label: `${this.translateService.instant('UISTATIC')}` });
          }
        if (this.commonService.uiBankDetailResponseObj.bg_text_details_code === '02'
          && isNaN(this.commonService.uiBankDetailResponseObj.document_id)) {
            this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
            params.FEATUREID, { label: `${this.translateService.instant('UIEDITOR')}` });
          }
        if (this.commonService.uiBankDetailResponseObj.stylesheetname !== '**') {
            this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
            params.FEATUREID, { label: `${this.translateService.instant('xmlFile')}` });
          }
        if (this.tnxTypeCode === '01' && (this.mode === 'INITIATE' || this.mode === 'DRAFT')){
          if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_SELECTION, this.form)) {
            this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[this.params][this.rendered] = true;
            this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.TEMPLATE_SELECTION),
              '', { label: `${this.translateService.instant('fromBankTemplateText')}` });
          }
          this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[this.params][this.rendered] = true;
        }
        this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE).patchValue(params.FEATUREID);
        this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE), { readonly: true });
        this.form.get('advSendMode').setValue(FccBusinessConstantsService.SWIFT);
        this.transmissionMode = this.form.get('advSendMode').value;
        this.setFormsOfUndertaking();
        this.form.get('fetchedBankTemplateCompany').patchValue(params.COMPANYID);
        const undertakingType = this.productStateService.getSectionData(
          "uiUndertakingDetails",
          undefined,
          this.isMasterRequired
        ).controls[`uiTypeAndExpiry`][`controls`][`bgTypeCode`];

        undertakingType[this.params][this.disabled] = true;
        this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE), { readonly: true });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCHED_TEMPLATE), { readonly: true });
        this.removeUnwantedFieldsForTemplate();
      });
    });
  }

  onClickViewSpecimenHyperLink() {
    // SPECIFICCUSTOMER && UISTATIC
    const obj = {
      eventId: '', masterId: '', productCode: FccGlobalConstant.PRODUCT_BG, guaranteeName: '', guaranteeCompanyId: '',
      guaranteeTextId: '', docId: '', mode: '', styleSheet: '', formDataXml: ''
    };
    if (this.commonService.uiBankDetailResponseObj.bg_text_details_code === '01' &&
        !isNaN(this.commonService.uiBankDetailResponseObj.document_id)) {
      obj.docId = `${this.commonService.uiBankDetailResponseObj.document_id}`;
      obj.guaranteeCompanyId = `${this.commonService.uiBankDetailResponseObj.guarantee_type_company_id}`;
      this.downloadFileWithContent(obj);
    }
    // UI BANK TEMPLATE EDITOR
    if (this.commonService.uiBankDetailResponseObj.bg_text_details_code === '02'
    && isNaN(this.commonService.uiBankDetailResponseObj.document_id)) {
      if (this.mode === FccGlobalConstant.INITIATE) {
        obj.masterId = `${this.commonService.referenceId}`;
        obj.eventId = `${this.commonService.eventId}`;
        obj.guaranteeName = `${this.commonService.uiBankDetailResponseObj.guarantee_type_name}`;
        obj.guaranteeCompanyId = `${this.commonService.uiBankDetailResponseObj.guarantee_type_company_id}`;
        obj.productCode = FccGlobalConstant.PRODUCT_BG;
        this.downloadFileWithContent(obj);
      }
      if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
        const refId = this.commonService.referenceId !== undefined ? this.commonService.referenceId :
        this.commonService.getQueryParametersFromKey(FccGlobalConstant.refId);
        const eventId = this.commonService.eventId !== undefined ? this.commonService.eventId :
        this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
        obj.masterId = `${refId}`;
        obj.eventId = `${eventId}`;
        obj.guaranteeName = `${this.commonService.uiBankDetailResponseObj.guarantee_type_name}`;
        obj.guaranteeCompanyId = `${this.commonService.uiBankDetailResponseObj.guarantee_type_company_id}`;
        this.downloadFileWithContent(obj);
      }
    }
    // xsla
    if (this.commonService.uiBankDetailResponseObj.stylesheetname !== '**') {
      obj.styleSheet = `${this.commonService.uiBankDetailResponseObj.stylessheetname}`;
      obj[this.formDataObj] = JSON.stringify(this.commonService.currentStateTnxResponse);
      this.downloadFileWithContent(obj);
    }
  }

  async downloadFileWithContent(obj) {
    await this.transactionDetailService.downloadUndertakingSpecimenEditor(obj).toPromise().then(response => {
      let fileType;
      if (response.body.type) {
        fileType = response.type;
      } else {
        fileType = 'application/octet-stream';
      }
      const newBlob = new Blob([response.body], { type: fileType });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      const data = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.href = data;
      //eslint-disable-next-line no-useless-escape
      const filename = response.headers.get('content-disposition').split(';')[1].split('=')[1].replace(/\"/g, '');
      link.download = filename;
      // link.download = fileName;
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      window.URL.revokeObjectURL(data);
      link.remove();
    });
  }

  getTemplateById(templateID) {
    this.productStateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_BG);
    this.transactionDetailService.fetchTransactionDetails(templateID, FccGlobalConstant.PRODUCT_BG, true, this.templateIDSubProdCode)
    .subscribe(responseData => {
      const responseObj = responseData.body;
      this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_BG).subscribe(apiMappingModel => {
        const setStateForProduct = {
          responseObject: responseObj,
          apiModel: apiMappingModel,
          isMaster: false,
          fieldsList: this.fieldsArray,
          sectionsList: this.sectionsArray
        };
        this.commonService.productState.next(setStateForProduct);
        const sectionName = FccGlobalConstant.UI_GENERAL_DETAIL;
        this.form = this.productStateService.getSectionData(sectionName, undefined, this.isMasterRequired);
        this.setLUStatus();
        if (this.tnxTypeCode === '01' && (this.mode === 'INITIATE' || this.mode === 'DRAFT')){
          this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[this.params][this.rendered] = true;
        }
        this.form.get(FccGlobalConstant.FETCHED_TEMPLATE)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = true;
        const element = document.createElement('div');
        element.innerHTML = templateID;
        templateID = element.textContent;
        this.form.get(FccGlobalConstant.FETCHED_TEMPLATE).patchValue(templateID);
        this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCHED_TEMPLATE), { readonly: true });
        const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
        this.toggleCreateFormButtons(val, true);
        this.form.get('bgSubProductCode').setValue(responseData.body.sub_product_code);
        this.form.get('advSendMode').setValue(responseData.body.adv_send_mode);
        this.onClickAdvSendMode(this.form.get('advSendMode'));
        this.setPurposeValue();
        this.removeUnwantedFieldsForTemplate();
        this.updatePaymentDetails(responseData.body.additionalFields);
        if (this.form.get('bgSubProductCode') && this.form.get('bgSubProductCode').value === FccGlobalConstant.STBY) {
          this.toggleFormFields(true, this.form, ['bgConfInstructions', 'confirmationInstruction', 'bgTransferIndicator']);
        } else {
          this.toggleFormFields(false, this.form, ['bgConfInstructions', 'confirmationInstruction', 'bgTransferIndicator',
          'narrativeTransferConditions']);
        }
        if (this.form.get('bgTransferIndicator') && this.form.get('bgTransferIndicator').value === 'Y') {
          this.form.get('narrativeTransferConditions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        } else {
          this.form.get('narrativeTransferConditions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        if (this.form.get('advSendMode') && this.form.get('advSendMode').value === '99') {
          this.form.get('advSendModeTextOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        } else {
          this.form.get('advSendModeTextOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
          this.form.get('advSendModeText').setValue('');
          this.form.get('advSendModeText').clearValidators();
          this.form.get('advSendModeText').updateValueAndValidity();
          this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        this.setLUStatus();
        this.form.updateValueAndValidity();
      });
    });
  }

  updatePaymentDetails(additionalFields: any[]) {
    let paymentDetailsBankEntity;
    additionalFields.forEach(fieldName => {
      const fieldObj = fieldName;
      if (typeof fieldObj === 'object' && fieldObj.name === 'credit_available_with_bank_type') {
        paymentDetailsBankEntity = fieldObj.value;
      }
    });
    const uiUndertakingForm: FCCFormGroup =
      this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);

      uiUndertakingForm.controls.uiPaymentDetails.get('paymentDetailsBankEntity').patchValue(paymentDetailsBankEntity);
      uiUndertakingForm.controls.uiPaymentDetails.updateValueAndValidity();
  }

  removeUnwantedFieldsForTemplate() {
    this.form.get(FccGlobalConstant.CUSTOMER_REF).setValue('');
    if (this.fieldsArray == null || this.fieldsArray.length === 0) {
      const uiUndertakingForm: FCCFormGroup =
      this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
      uiUndertakingForm.controls.uiTypeAndExpiry.get('bgExpDate').patchValue('');
      uiUndertakingForm.controls.uiTypeAndExpiry.updateValueAndValidity();
    }
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
  }

  onClickRemoveLabelTemplate() {
    this.templateKey = FccGlobalConstant.TEMPLATEFROM_KEY;
    this.onClickRemoveLabel();
  }

  onBlurTemplateName() {
    if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_NAME, this.form)
    && (!this.form.get(FccGlobalConstant.TEMPLATE_NAME)[this.params][this.readonly])) {
      const templateName = this.form.get(FccGlobalConstant.TEMPLATE_NAME).value;
      this.lcTemplateService.isTemplateNameExists(templateName, FccGlobalConstant.PRODUCT_BG).subscribe( res => {
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

  resetRemoveLabelTemplate() {
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE).setValue('');
    this.form.get(FccGlobalConstant.FETCHED_TEMPLATE)[this.params][this.rendered] = false;
    this.form.get(FccGlobalConstant.FETCHED_TEMPLATE).setValue('');
    if (this.commonService.uiBankDetailResponseObj && this.commonService.uiBankDetailResponseObj != null) {
      this.form.get('viewSpecimenHyperLink')[this.params][this.rendered] = false;
      const undertakingType = this.productStateService.getSectionData(
        "uiUndertakingDetails",
        undefined,
        this.isMasterRequired
      ).controls[`uiTypeAndExpiry`][`controls`][`bgTypeCode`];

      undertakingType[this.params][this.disabled] = false;
      undertakingType.setValue('');
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE).setValue('');
      this.commonService.uiBankDetailResponseObj = null;
      if (this.uiBankTemplateResponse) {
        this.uiBankTemplateResponse.unsubscribe();
      }
      this.viewSpecimenDownloadParams = undefined;
    }
    this.bankDetailResponseObj = undefined;
    const val = this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.options];
    this.toggleCreateFormButtons(val, false);
    this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS).setValue('');
    if (this.uiTemplateResponse) {
      this.uiTemplateResponse.unsubscribe();
      this.productStateService.clearState();
      this.formModelService.getFormModel(FccGlobalConstant.PRODUCT_BG).subscribe(modelJson => {
      if (modelJson) {
        this.productStateService.initializeProductModel(modelJson);
        this.productStateService.initializeState(FccGlobalConstant.PRODUCT_BG);
        this.productStateService.populateAllEmptySectionsInState();
      }
      this.initializeFormGroup();
    });
  }
}

  onClickCopyFromUndertakingIssued() {
    this.setFieldsArrayNdSectionsData(false, FccGlobalConstant.PRODUCT_BG);
    const header = `${this.translateService.instant('existingUIList')}`;
    const productCode = FccGlobalConstant.PRODUCT;
    const headerDisplay = FccGlobalConstant.HEADER_DISPLAY;
    const buttons = FccGlobalConstant.BUTTONS;
    const savedList = FccGlobalConstant.SAVED_LIST;
    const option = FccGlobalConstant.OPTION;
    const downloadIconEnabled = FccGlobalConstant.DOWNLOAD_ICON_ENABLED;
    const obj = {};
    obj[productCode] = FccGlobalConstant.PRODUCT_BG;
    obj[option] = FccGlobalConstant.EXISTING_OPTION;
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    this.uiService.setOption(FccGlobalConstant.EXISTING_OPTION);

    this.resolverService.getSearchData(header, obj);
    this.fromExisitingUIResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (this.uiTemplateResponse !== undefined && this.uiTemplateResponse !== null) {
        this.uiTemplateResponse.unsubscribe();
      }
      if (this.uiBankTemplateResponse !== undefined && this.uiBankTemplateResponse !== null) {
        this.uiBankTemplateResponse.unsubscribe();
      }
      if (response !== null) {
        this.searchLayoutService.searchLayoutDataSubject.next(null);
        const prodCode = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
          && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
          FccGlobalConstant.PRODUCT_BG : undefined;
        const eventIdToPass = (response.responseData.TNX_ID !== undefined && response.responseData.TNX_ID !== null
          && response.responseData.TNX_ID !== FccGlobalConstant.EMPTY_STRING ) ?
          response.responseData.TNX_ID : response.responseData.REF_ID;
        this.stateService.populateAllEmptySectionsInState(FccGlobalConstant.PRODUCT_BG);
        this.productMappingService.getApiModel(FccGlobalConstant.PRODUCT_BG).subscribe(apiMappingModel => {
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
        this.form = this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired);
        this.setLUStatus();
        this.form.get('createFromOptions')[this.params][this.rendered] = false;
        const selectedRefIdFields = ['referenceSelected', 'fetchedRefValue', 'removeLabel'];
        this.toggleControls(this.form, selectedRefIdFields, true);
        this.form.get('fetchedRefValue').patchValue(response.responseData.REF_ID);
        this.patchFieldParameters(this.form.get('fetchedRefValue'), { readonly: true });
        this.form.get('parentReference').patchValue(response.responseData.REF_ID);
        this.form.get('issDate').patchValue(null);
        this.form.get('bgSubProductCode').setValue(responseData.body.sub_product_code);
        this.setPurposeValue();
        this.form.updateValueAndValidity();
        this.setBeneficiaryContactDetails(responseObj);
        this.handlePurposeValuesForDepu();

        if (this.fieldsArray == null || this.fieldsArray.length === 0) {
          const uiUndertakingForm: FCCFormGroup =
          this.productStateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS, undefined, this.isMasterRequired);
          uiUndertakingForm.controls.uiAmountChargeDetails.get('bgCurCode').patchValue('');
          uiUndertakingForm.controls.uiAmountChargeDetails.get('bgNetExposureCurCode').patchValue('');
          uiUndertakingForm.controls.uiAmountChargeDetails.get('bgAmt').patchValue('');
          uiUndertakingForm.controls.uiAmountChargeDetails.get('bgNetExposureAmt').patchValue('');
          uiUndertakingForm.controls.uiAmountChargeDetails.updateValueAndValidity();
          uiUndertakingForm.controls.uiTypeAndExpiry.get('bgExpDate').patchValue('');
          uiUndertakingForm.controls.uiTypeAndExpiry.updateValueAndValidity();
          uiUndertakingForm.controls.uiContractDetails.get('contractDate').patchValue('');
          uiUndertakingForm.controls.uiContractDetails.get('contractCurCode').patchValue('');
          uiUndertakingForm.controls.uiContractDetails.get('contractAmt').patchValue('');
          uiUndertakingForm.controls.uiContractDetails.updateValueAndValidity();
          this.form.get(FccTradeFieldConstants.BANK_REFERENCE_VIEW).setValue(FccGlobalConstant.EMPTY_STRING);
          this.form.get(FccGlobalConstant.BENEFICIARY_REFERNCE).setValue(FccGlobalConstant.EMPTY_STRING);
          this.form.get(FccGlobalConstant.CUSTOMER_REF).setValue(FccGlobalConstant.EMPTY_STRING);
          this.form.get(FccGlobalConstant.ADDITIONAL_CUSTOMER_REFERENCE).setValue(FccGlobalConstant.EMPTY_STRING);
        }

        if (this.form.get('bgSubProductCode') && this.form.get('bgSubProductCode').value === FccGlobalConstant.STBY) {
          this.toggleFormFields(true, this.form, ['bgConfInstructions', 'confirmationInstruction', 'bgTransferIndicator']);
        } else {
          this.toggleFormFields(false, this.form, ['bgConfInstructions', 'confirmationInstruction', 'bgTransferIndicator',
          'narrativeTransferConditions']);
        }
        if (this.form.get('bgTransferIndicator') && this.form.get('bgTransferIndicator').value === 'Y') {
          this.form.get('narrativeTransferConditions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        } else {
          this.form.get('narrativeTransferConditions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        if (this.form.get('advSendMode') && this.form.get('advSendMode').value === '99') {
          this.form.get('advSendModeTextOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
          this.togglePreviewScreen(this.form, [FccTradeFieldConstants.ADV_SEND_MODE], false);
        } else {
          this.form.get('advSendModeTextOther')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
          this.form.get('advSendModeText').setValue('');
          this.form.get('advSendModeText').clearValidators();
          this.form.get('advSendModeText').updateValueAndValidity();
          this.form.get('advSendModeText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        this.form.updateValueAndValidity();
      });
      });
     }
   });
  }

  toggleCreateFormButtons(val, enable) {
    val.forEach( (element) => {
      element[this.disabled] = enable;
    });
  }
  editModeDataPopulate() {
    const parentRefID = this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).value;
    const templateRefID = this.form.get(FccGlobalConstant.TEMPLATE_NAME).value;
    if(this.mode === 'DRAFT'){
      this.form.get('createFrom')[this.params][this.rendered] = false;
      this.form.get('createFromOptions')[this.params][this.rendered] = false;
    }
    if (this.mode === 'DRAFT' && parentRefID !== undefined && parentRefID !== null) {
      if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get('createFrom')[this.params][this.rendered] = true;
      this.form.get('referenceSelected')[this.params][this.rendered] = true;
      this.form.get('fetchedRefValue')[this.params][this.rendered] = true;
      this.form.get('removeLabel')[this.params][this.rendered] = false;
      this.form.get('fetchedRefValue').patchValue(parentRefID);
      this.form.get(FccTradeFieldConstants.PARENT_REFERENCE).patchValue(parentRefID);
      this.patchFieldParameters(this.form.get('fetchedRefValue'), { readonly: true });
     }
   }
   if(this.mode === 'DRAFT' && templateRefID !== undefined && templateRefID !== null && this.option!=='TEMPLATE'){
    if(this.tnxTypeCode == FccGlobalConstant.N002_NEW) {
      this.form.get('createFrom')[this.params][this.rendered] = true;
      this.form.get('templateSelection')[this.params][this.rendered] = true;
      this.form.get('fetchedTemplate')[this.params][this.rendered] = true;
      this.form.get('removeLabelTemplate')[this.params][this.rendered] = false;
      this.form.get('fetchedTemplate').patchValue(templateRefID);
      this.form.get(FccGlobalConstant.TEMPLATE_NAME).patchValue(templateRefID);
      this.patchFieldParameters(this.form.get('fetchedTemplate'), { readonly: true });
    }
  }
}

  setBeneficiaryContactDetails(responseObj: any) {
    this.appBenForm =
    this.productStateService.getSectionData(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS, undefined, this.isMasterRequired);
    this.appBenForm.get('beneficiaryEntity').patchValue(responseObj.beneficiary_name);
    this.appBenForm.get('applicantEntity').setValue(responseObj.entity);
    if ((responseObj.contact_name && responseObj.contact_name !== '' && responseObj.contact_name != null) ||
        (responseObj.contact_address_line_1 && responseObj.contact_address_line_1 !== '' && responseObj.contact_address_line_1 != null) ||
        (responseObj.contact_address_line_2 && responseObj.contact_address_line_2 !== '' && responseObj.contact_address_line_2 != null) ||
        (responseObj.contact_dom && responseObj.contact_dom !== '' && responseObj.contact_dom != null) ||
        (responseObj.contact_address_line_4 && responseObj.contact_address_line_4 !== '' && responseObj.contact_address_line_4 != null) ||
        (responseObj.contact_country && responseObj.contact_country !== '' && responseObj.contact_country != null)) {
          this.appBenForm.get('beneficiaryContactToggle').setValue('Y');
          const beneficiaryContactFields = ['beneficiaryContactName', 'beneficiaryContactFirstAddress', 'beneficiaryContactSecondAddress',
          'beneficiaryContactThirdAddress', 'beneficiaryContactFourthAddress', 'beneficiaryContactcountry'];
          this.toggleControls(this.appBenForm, beneficiaryContactFields , true);
          this.appBenForm.get('beneficiaryContactName').patchValue(responseObj.contact_name);
          this.appBenForm.get('beneficiaryContactFirstAddress').patchValue(responseObj.contact_address_line_1);
          this.appBenForm.get('beneficiaryContactSecondAddress').patchValue(responseObj.contact_address_line_2);
          this.appBenForm.get('beneficiaryContactThirdAddress').patchValue(responseObj.contact_dom);
          this.appBenForm.get('beneficiaryContactFourthAddress').patchValue(responseObj.contact_address_line_4);
          this.appBenForm.get('beneficiaryContactcountry').patchValue(responseObj.contact_country);
        }
    this.appBenForm.updateValueAndValidity();
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
    this.excludingJsonFileKey = '';
    this.fieldsArray = [];
    this.sectionsArray = [];
  }

  onClickRemoveLabel() {
    this.revertCopyFromDetails();
    const headerField = `${this.translateService.instant('removeSelectedTransaction')}`;
    const obj = {};
    const locaKey = 'locaKey';
    obj[locaKey] = this.templateKey ? this.templateKey : FccGlobalConstant.COPYFROM_UI_KEY;
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
          this.resetFieldsForCopyFrom();
        }
      }
      this.templateKey = null;
    });
  }

  /**
   *  Reset fields for Copy From on click on confirmation from dialog box
   */
  resetFieldsForCopyFrom(): void {
    if (this.fromExisitingUIResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.fromExisitingUIResponse.unsubscribe();
      this.fromExisitingUIResponse = null;
    }
    this.productStateService.clearState();
    this.formModelService.getFormModel(FccGlobalConstant.PRODUCT_BG).subscribe(modelJson => {
      this.productStateService.initializeProductModel(modelJson);
      this.productStateService.initializeState(FccGlobalConstant.PRODUCT_BG);
      this.productStateService.populateAllEmptySectionsInState();
      this.form = this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired);
      this.appBenForm =
      this.productStateService.getSectionData(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS, undefined, this.isMasterRequired);
      this.setFormsOfUndertaking();
      this.setPurposeValue();
      if (this.tnxTypeCode === '01' && (this.mode === 'INITIATE' || this.mode === 'DRAFT')) {
       this.form.get('createFromOptions')[this.params][this.rendered] = true;
      }
      const selectedRefIdFields = ['referenceSelected', 'fetchedRefValue', 'removeLabel'];
      this.toggleControls(this.form, selectedRefIdFields, false);
      this.form.get('fetchedRefValue').setValue('');
      this.form.get('customerReference').setValue('');
      const val = this.form.get('createFromOptions')[this.params][this.options];
      this.toggleCreateFormButtons(val, false);
      this.form.get('createFromOptions').setValue('');
    });
  }

  populateDataForEditFrom() {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const option = this.uiService.getOption();
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.bankTemplateName = this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_BANK_TEMPLATE, this.form) ?
    this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE).value : undefined;
    const templateName = this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_NAME, this.form) ?
    this.form.get(FccGlobalConstant.TEMPLATE_NAME).value : undefined;
    if (tnxTypeCode === FccGlobalConstant.N002_NEW &&
      (option === FccGlobalConstant.EXISTING_OPTION || option === FccGlobalConstant.TEMPLATE
        || mode === FccGlobalConstant.DRAFT_OPTION)) {
          if (this.form.get('bgSubProductCode') && this.form.get('bgSubProductCode').value === 'STBY') {
            this.toggleFormFields(true, this.form, ['bgConfInstructions', 'confirmationInstruction', 'bgTransferIndicator']);
          } else {
            this.toggleFormFields(false, this.form, ['bgConfInstructions', 'confirmationInstruction', 'bgTransferIndicator',
            'narrativeTransferConditions']);
          }
          this.onClickBgConfInstructions();
          if (this.form.get('bgTransferIndicator').value && this.form.get('bgTransferIndicator').value === 'Y') {
          this.toggleFormFields(true, this.form, ['narrativeTransferConditions']);
        } else {
          this.toggleFormFields(false, this.form, ['narrativeTransferConditions']);
          this.togglePreviewScreen(this.form, [FccTradeFieldConstants.BG_TRANSFER_INDICATOR], false);
        } if (this.form.get('advSendMode').value && this.form.get('advSendMode').value === '99') {
          // this.toggleFormFields(true, this.form, ['advSendMode']);
          this.toggleFormFields(true, this.form, ['advSendModeTextOther']);
          this.toggleFormFields(true, this.form, ['advSendModeText']);
          this.togglePreviewScreen(this.form, [FccTradeFieldConstants.ADV_SEND_MODE], false);
        } else {
          //  this.toggleFormFields(false, this.form, ['advSendMode']);
          this.toggleFormFields(false, this.form, ['advSendModeTextOther']);
          this.toggleFormFields(false, this.form, ['advSendModeText']);
        }
    }
    if (this.mode === 'DRAFT' && this.commonService.isNonEmptyValue(this.bankTemplateName) &&
        this.commonService.isNonEmptyField(FccGlobalConstant.CREATE_FROM_OPERATIONS, this.form)) {
      this.checkBankTemplateOnEdit(this.bankTemplateName);
    }
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
    this.onClickProvisionalStatus();
    this.patchFieldParameters(this.form.get(FccGlobalConstant.FETCHED_TEMPLATE), { readonly: true });
  }
  onClickProvisionalStatus(){
    const provisionalTogglevalue = this.form.get(FccGlobalConstant.PROVISIONAL_STATUS).value;
    const provisionalControl = [FccGlobalConstant.PROVISIONAL_STATUS];
    if (provisionalTogglevalue === FccBusinessConstantsService.YES) {
      this.togglePreviewScreen(this.form, provisionalControl, true);
    } else {
      this.togglePreviewScreen(this.form, provisionalControl, false);
    }
    this.form.get(FccGlobalConstant.PROVISIONAL_STATUS).updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  provisional() {
    this.RenderProvisional = false;
    this.commonService.getParamData(FccGlobalConstant.PRODUCT_BG, 'P306').subscribe(response => {
      for (let i = 0; i < response.largeParamDetails.length; i++) {
        if (response.largeParamDetails[i].largeParamKeyDetails !== null) {
          this.provisionalBankList.add(response.largeParamDetails[i].largeParamKeyDetails.key_1);
          this.RenderProvisional = true;
        }
        if (response.largeParamDetails[i].largeParamDataList !== null) {
          for (let j = 0; j < response.largeParamDetails[i].largeParamDataList.length; j++) {
            if (response.largeParamDetails[i].largeParamDataList[j].data_2 === 'Y') {
              this.sitype.add(response.largeParamDetails[i].largeParamDataList[j].data_1);
              this.provisionalBankMap.set(response.largeParamDetails[i].largeParamKeyDetails.key_1 ,
                response.largeParamDetails[i].largeParamDataList[j].data_1);
            }
          }
        }
      }
      let index = 0;
      for (const currentNumber of this.provisionalBankList) {
        for (let i = 0; i < response.largeParamDetails.length; i++) {
          if (response.largeParamDetails[i].largeParamKeyDetails !== null) {
            if(response.largeParamDetails[i].largeParamKeyDetails.key_1 === currentNumber){
              index =i;
            }
          }
        }
        if (!(currentNumber === '*') && response.largeParamDetails[index].largeParamDataList[0].data_2 === 'N') {
          this.RenderProvisional = false;
        }
      }
      for (let i = 0; i < response.largeParamDetails.length; i++) {
        if (response.largeParamDetails[i].largeParamDataList !== null) {
          for (let j = 0; j < response.largeParamDetails[i].largeParamDataList.length; j++) {
            if (response.largeParamDetails[i].largeParamDataList[j].data_2 === 'Y'
            && response.largeParamDetails[i].largeParamKeyDetails.key_1 !== '*') {
              this.RenderProvisional = true;
            }
          }
        }
      }
      this.commonService.putQueryParameters( 'provisionalBankList', this.provisionalBankList);
      this.commonService.putQueryParameters( 'provisionalBankMap', this.provisionalBankMap);
      this.singleBank = (this.provisionalBankList.size === 1) ? true : false;
      this.provisionalBankArr = [];
      for (const currentNumber of this.provisionalBankList) {
        this.provisionalBankArr.push(currentNumber);
    }
      this.provisionlRender();
    });


  }
  provisionlRender() {
    let provisionalVariable = false;
    
    this.multiBankService.getProvisionalBankList().forEach(element => {
      if (this.provisionalBankMap.has(element) || this.provisionalBankMap.has('*')) {
        provisionalVariable = true;
      }
    });
    this.provRender = this.form.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.PROVISIONALRENDERED];
    if (this.RenderProvisional && this.provRender && provisionalVariable && 
      this.option !== 'TEMPLATE' && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND)
    {
      this.form.get(FccGlobalConstant.PROVISIONAL_STATUS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.PROVISIONAL_STATUS)[this.params][FccGlobalConstant.ISANYPROVBANKAVL] = true;
     } else {
       this.form.get(FccGlobalConstant.PROVISIONAL_STATUS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
     }
    this.form.updateValueAndValidity();
  }

  checkBankTemplateOnEdit(bankTemplateName: any) {
    this.form.get(FccGlobalConstant.REFERENCE_SELECTED).patchValue(bankTemplateName);
    if (this.tnxTypeCode === '01' && (this.mode === 'INITIATE' || this.mode === 'DRAFT')) {
      if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_SELECTION, this.form)) {
        this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
    }
    if (this.commonService.isNonEmptyField(FccGlobalConstant.FETCHED_BANK_TEMPLATE, this.form)) {
      if (this.tnxTypeCode === '01' && (this.mode === 'INITIATE' || this.mode === 'DRAFT')) {
        this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
      this.form.get(FccGlobalConstant.FETCHED_BANK_TEMPLATE)[this.params][this.readonly] = true;
      const undertakingType =
      this.productStateService.getSectionData('uiUndertakingDetails',
      undefined, this.isMasterRequired).controls[`uiTypeAndExpiry`][`controls`][`bgTypeCode`];
      undertakingType[this.params][this.disabled] = true;
      this.form.get('createFromOptions').setValue(FccGlobalConstant.BANK_TEMPLATE);
    }
    if (this.commonService.isNonEmptyField(FccGlobalConstant.REMOVE_LABEL_TEMPLATE, this.form)) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL_TEMPLATE)[this.params][this.rendered] = false;
    }
    if (this.tnxTypeCode === '01' && (this.mode === 'INITIATE' || this.mode === 'DRAFT')) {
      this.form.get('viewSpecimenHyperLink')[this.params][this.rendered] = true;
    }
    this.viewDownloadEditMode();
  }

  viewDownloadEditMode() {
    const tnxid = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_ID);
    this.transactionDetailService.fetchTransactionDetails(tnxid, FccGlobalConstant.PRODUCT_BG).subscribe(response => {
      this.editModeDownloadData = response.body;
      const params = {
        COMPANYID: `${this.editModeDownloadData.guarantee_type_company_id}`,
        DOC_ID: ``,
        FEATUREID: `${this.editModeDownloadData.guarantee_type_name}`
      };
      this.transactionDetailService.fetchBankTemplateDetails(FccGlobalConstant.PRODUCT_BG, params).subscribe(responseData => {
        this.commonService.uiBankDetailResponseObj = responseData.body;
        if (this.commonService.uiBankDetailResponseObj.bg_text_details_code === '01' &&
        !isNaN(this.commonService.uiBankDetailResponseObj.document_id)) {
          this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
          params.FEATUREID, { label: `${this.translateService.instant('UISTATIC')}` });
        }
        if (this.commonService.uiBankDetailResponseObj.bg_text_details_code === '02' &&
        isNaN(this.commonService.uiBankDetailResponseObj.document_id)) {
          this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
          params.FEATUREID, { label: `${this.translateService.instant('UIEDITOR')}` });
        }
        if (this.commonService.uiBankDetailResponseObj.stylesheetname !== '**') {
          this.patchFieldValueAndParameters(this.form.get('viewSpecimenHyperLink'),
          params.FEATUREID, { label: `${this.translateService.instant('xmlFile')}` });
        }
        if (this.tnxTypeCode === '01' && (this.mode === 'INITIATE' || this.mode === 'DRAFT')) {
          if (this.commonService.isNonEmptyField(FccGlobalConstant.TEMPLATE_SELECTION, this.form)) {
            this.form.get(FccGlobalConstant.TEMPLATE_SELECTION)[this.params][this.rendered] = true;
            this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.TEMPLATE_SELECTION),
              '', { label: `${this.translateService.instant('fromBankTemplateText')}` });
          }
        }
        this.form.get(FccGlobalConstant.CREATE_FROM_OPERATIONS)[this.params][this.rendered] = false;
      });
    });
  }

  ngAfterViewInit(){
    if (!this.uiBankTemplateFlag && this.myDivElementRef && this.myDivElementRef.toArray()[2]) {
      this.myDivElementRef.toArray()[2].nativeElement.querySelector('#mat-button-toggle-9').style.display = 'none';
    }
  }

  ngAfterViewChecked(): void {
    this.resetCreateForm();
  }
}
