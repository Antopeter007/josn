import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HOST_COMPONENT } from '../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { ProductMappingService } from '../../../../../../common/services/productMapping.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import { LcConstant } from '../../../../../trade/lc/common/model/constant';
import { ProductStateService } from '../../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../../trade/lc/initiation/services/utility.service';
import { SeProductService } from '../../services/se-product.service';
import { SeProductComponent } from '../se-product/se-product.component';
import { FileHandlingService } from '../../../../../../common/services/file-handling.service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { CorporateCommonService } from '../../../../../common/services/common.service';
import { CorporateDetails } from '../../../../../../common/model/corporateDetails';
import { CodeDataService } from '../../../../../../common/services/code-data.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CodeData } from '../../../../../../common/model/codeData';
@Component({
  selector: 'app-se-general-details',
  templateUrl: './se-general-details.component.html',
  styleUrls: ['./se-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SeGeneralDetailsComponent }]
})
export class SeGeneralDetailsComponent extends SeProductComponent implements OnInit, OnDestroy {
  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  @ViewChild('fccCommonTextArea') public fccCommonTextAreaId: ElementRef;
  lcConstant = new LcConstant();
  module = `${this.translateService.instant(FccGlobalConstant.SE_GENERAL_DETAILS)}`;
  params = this.lcConstant.params;
  readOnly = this.lcConstant.readonly;
  allowedCharCount = this.lcConstant.allowedCharCount;
  maximumlength = this.lcConstant.maximumlength;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  mode: any;
  tnxId: any;
  productCode: any;
  subProductCode: any;
  subTnxTypeCode: any;
  option: any;
  refId: any;
  docId: any;
  rendered = FccGlobalConstant.RENDERED;
  tableColumns = [];
  contextPath: any;
  tnxTypeCode: any;
  selectedRefId: string;
  customerInstructionText = 'customerInstructionText';
  fromExisitingLcResponse;
  styleClass = this.lcConstant.styleClass;
  options = this.lcConstant.options;
  disabled = this.lcConstant.disabled;
  actionReqCode: any;
  entityName;
  custRefLength;
  previewScreen = this.lcConstant.previewScreen;
  paramDataList: any[] = [];
  customerInstnsLen : any;
  element = 'customerInstructionText';
  customerInstnsRowCount : number;
  maxRowCount = this.lcConstant.maxRowCount;
  cols = this.lcConstant.cols;
  sectionHeader = FccGlobalConstant.SECTION_HEADER;
  copyFromProductCode = '';
  excludingJsonFileKey = '';
  fieldsArray = [];
  sectionsArray = [];
  entities = [];
  private readonly VALUE = 'value';
  readonly = this.lcConstant.readonly;
  selectedEntity;
  isMasterRequired: any;
  corporateBanks = [];
  modeRef;
  nameOrAbbvName: any;
  corporateReferences = [];
  responseStatusCode = 200;
  beneficiaries = [];
  updatedBeneficiaries = [];
  corporateDetails: CorporateDetails;
  codeIDTopic: any;
  topicValues: any;
  selectedTopic: any;
  mandatory = false;
  parentTnxData: any;
  entityFetchEvent: any;

  constructor(protected commonService: CommonService, protected stateService: ProductStateService,
              protected eventEmitterService: EventEmitterService, protected translateService: TranslateService,
              public uploadFile: FilelistService, protected phrasesService: PhrasesService,
              public fccGlobalConstantService: FccGlobalConstantService, protected elementRef: ElementRef,
              protected searchLayoutService: SearchLayoutService, protected transactionDetailService: TransactionDetailService,
              protected formModelService: FormModelService,
              protected dialogService: DialogService, protected productMappingService: ProductMappingService,
              protected resolverService: ResolverService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected utilityService: UtilityService,
              protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
              protected seProductService: SeProductService, protected fileHandlingService: FileHandlingService,
              protected multiBankService: MultiBankService, protected dropdownAPIService: DropDownAPIService,
              protected taskService: FccTaskService, protected corporateCommonService: CorporateCommonService,
              protected codeDataService: CodeDataService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, uploadFile, dialogRef, currencyConverterPipe, seProductService);
  }

  ngOnInit(): void {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.actionReqCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.ACTION_REQUIRED_CODE);
    }
    this.initializeFormGroup();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.custRefLength = response.customerReferenceTradeLength;
        this.form.addFCCValidators('customerReference', Validators.maxLength(this.custRefLength), 0);
        this.form.addFCCValidators('beneficiaryReference', Validators.maxLength(this.custRefLength), 0);
      }
    });
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
  }

  ngOnDestroy() {
    if (this.form !== undefined && this.form.get(FccGlobalConstant.REMOVE_LABEL)) {
      this.form.get(FccGlobalConstant.REMOVE_LABEL)[this.params][this.rendered] = false;
    }
    this.stateService.setStateSection(FccGlobalConstant.SE_GENERAL_DETAILS, this.form);
    // Below changes causes, form state error
    // if( this.entityFetchEvent != null
    //   &&  this.entityFetchEvent != undefined) {
    // this.entityFetchEvent.entityFetched.unsubscribe();
  //}
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.SE_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.commonService.formatForm(this.form);
    if(this.multiBankService.getEntityList().length > 0){
      this.getUserEntities();
    } else {
      this.entityFetchEvent = this.multiBankService.entityFetched.subscribe(data => {
        if(data){
          this.getUserEntities();
        }
      });
    }
    this.populateTopicOptions();
    this.getCorporateBanks();
    this.getCorporateReferences();
    this.setActionRequiredFields();
  }

  setActionRequiredFields() {
    if (this.tnxId) {
      this.transactionDetailService.fetchTransactionDetails(
        this.getTnxIdForActionRequired(), this.productCode, false, this.subProductCode).subscribe(response => {
          const responseObj = response.body;
          if (responseObj) {
            this.parentTnxData = responseObj;
            this.updateCustomerInstructions();
            this.initializeSubtopic(responseObj.sub_topic, responseObj.topic);
          }
        });
    }
  }

  getTnxIdForActionRequired() {
    let fetchTnxID = this.tnxId;
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      return fetchTnxID;
    }
    if (this.commonService.isnewEventSaved && this.commonService.eventId) {
      fetchTnxID = this.commonService.eventId;
    } else if (!this.commonService.isnewEventSaved) {
      fetchTnxID = this.tnxId;
    }
    return fetchTnxID;
  }

  updateCustomerInstructions() {
    if (this.parentTnxData && this.parentTnxData.free_format_text) {
      if (this.mode === FccGlobalConstant.DRAFT_OPTION || this.commonService.isnewEventSaved) {
        this.form.get(this.customerInstructionText).setValue(this.parentTnxData.free_format_text.text);
      } else if (!this.commonService.isnewEventSaved) {
        this.form.get(this.customerInstructionText).setValue('');
      }
    }
  }

  populateTopicOptions() {
    this.codeIDTopic = this.form.get(FccGlobalConstant.TOPIC)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    this.topicValues = this.codeDataService.getCodeData(this.codeIDTopic, FccGlobalConstant.PRODUCT_SE,
      FccGlobalConstant.SUBPRODUCT_DEFAULT, this.form, FccGlobalConstant.TOPIC);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.TOPIC), { options: this.topicValues });
  }

  onClickTopic() {
    this.initializeSubtopic(undefined, undefined);
  }

  initializeSubtopic(parentTnxSubtopic?: string, parentTopic?:string) {
    const eventDataArray = [];
    const selectedTopicID = parentTopic != undefined ? parentTopic : this.form.get(FccGlobalConstant.TOPIC).value;
    this.commonService.getSubTopic(FccGlobalConstant.PARAM_P812, selectedTopicID).subscribe(response => {
      response.paramDataList.forEach(responseValue => {
        const eventData: { value: string; label: string; mandatory: string; id: string; } = {
          value: responseValue.key_1,
          label: this.translateService.instant(FccGlobalConstant.PARAM_P812 + "_" + responseValue.key_1),
          mandatory: responseValue.data_5,
          id: 'subTopic_' + responseValue.key_1
        };
        eventDataArray.push(eventData);
      });

      eventDataArray.forEach(subTopicdata => {
        this.mandatory = subTopicdata.mandatory === FccGlobalConstant.CODE_Y ? true : false;
      });

      if (this.mandatory) {
        this.form.get(FccGlobalConstant.SUBTOPIC)[this.params][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccGlobalConstant.SUBTOPIC).addValidators(Validators.required);
      } else {
        this.form.get(FccGlobalConstant.SUBTOPIC)[this.params][FccGlobalConstant.REQUIRED] = false;
        this.form.get(FccGlobalConstant.SUBTOPIC).clearValidators();
      }

      this.patchFieldParameters(this.form.get(FccGlobalConstant.SUBTOPIC), { options: eventDataArray });

      if(this.commonService.isNonEmptyValue(parentTnxSubtopic)) {
        this.form.get(FccGlobalConstant.SUBTOPIC).setValue(parentTnxSubtopic);
      }

      this.form.get(FccGlobalConstant.SUBTOPIC).updateValueAndValidity();
    });
  }

  onClickApplicantEntity() {
    this.getCorporateBanks();
    this.getCorporateReferences();
  }

  getUserEntities() {
    this.updateUserEntities();
  }

  updateUserEntities() {
    this.multiBankService.getEntityList().forEach(entity => {
      this.entities.push(entity);
    });
    const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, FccGlobalConstant.APPLICANT_ENTITY, this.form);
    if (valObj && valObj[this.VALUE] && !this.taskService.getTaskEntity()) {
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY).patchValue(valObj[this.VALUE]);
    } else if (this.taskService.getTaskEntity()) {
      this.form.get('applicantEntity').patchValue(this.taskService.getTaskEntity());
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
        this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)) {
        this.form.get('applicantName').setValue(this.taskService.getTaskEntity().name);
      }
    }
    if (this.entities.length === 0) {
      this.form.get(FccGlobalConstant.APPLICANT_NAME)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      if (this.form.get(FccGlobalConstant.APPLICANT_ENTITY)) {
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.APPLICANT_ENTITY, false);
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY).clearValidators();
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY).updateValueAndValidity();
      }

      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
        (this.form.get(FccGlobalConstant.APPLICANT_NAME).value === undefined ||
          this.form.get(FccGlobalConstant.APPLICANT_NAME).value === null ||
          this.form.get(FccGlobalConstant.APPLICANT_NAME).value === FccGlobalConstant.EMPTY_STRING)) {
        this.corporateCommonService.getValues(this.fccGlobalConstantService.corporateDetails).subscribe(response => {
          if (response.status === this.responseStatusCode) {
            this.corporateDetails = response.body;
            if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
              this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)) {
              this.form.get(FccGlobalConstant.APPLICANT_NAME).setValue(this.corporateDetails.name);
            }
          }
        });
      }
      this.form.get(FccGlobalConstant.APPLICANT_NAME)[this.params][this.readonly] = true;
    } else if (this.entities.length === 1) {
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue({
        label: this.entities[0].value.label, name: this.entities[0].value.name,
        shortName: this.entities[0].value.shortName
      });
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][this.readonly] = true;
      this.multiBankService.setCurrentEntity(this.entities[0].value.name);
      this.hideApplicantName();
    } else if (this.entities.length > 1) {
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.RENDERED] = true;
      this.hideApplicantName();
    }
    this.patchFieldParameters(this.form.get(FccGlobalConstant.APPLICANT_ENTITY), { options: this.entities });
  }

  hideApplicantName() {
    this.form.get(FccGlobalConstant.APPLICANT_NAME)[this.params][this.rendered] = false;
    this.setMandatoryField(this.form, FccGlobalConstant.APPLICANT_NAME, false);
    this.form.get(FccGlobalConstant.APPLICANT_NAME).clearValidators();
    this.form.get(FccGlobalConstant.APPLICANT_NAME).updateValueAndValidity();
    this.form.get(FccGlobalConstant.APPLICANT_ENTITY).updateValueAndValidity();
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SE, key, '', true);
  }

  getCorporateBanks() {
    let entityName;
    if (this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value && this.mode !== FccGlobalConstant.VIEW_MODE) {
      this.selectedEntity = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value;
      if (typeof this.selectedEntity === 'object' && this.selectedEntity) {
          entityName = this.selectedEntity.shortName;
          this.selectedEntity = this.selectedEntity.shortName;
      }

      /**
       * Adding this code because the entity Name is used in this.multiBankService.setCurrentEntity,
       * to fetch bankList from this.entityBankMap.
       * this.entityBankMap has key as Name rather than the abbv_name/shortName.
       * Ideally this needs to be corrected in the map to use abbv_name as key.
       *
       */
      if (entityName === undefined) {
        this.entities.forEach(entity => {
          if (entity.value.shortName === this.selectedEntity) {
            entityName = entity.value.name;
          }
        });
      }

      if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === '01') {
        this.multiBankService.setCurrentEntity(entityName);
      } else {
        this.multiBankService.setCurrentEntity(this.selectedEntity);
      }
    } else {
      const valobj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, 'applicantEntity', this.form);
      if (valobj && valobj[FccGlobalConstant.VALUE] && !this.taskService.getTaskEntity()) {
        this.multiBankService.setCurrentEntity(valobj[FccGlobalConstant.VALUE].name);
      }
    }
    this.setBankNameList();
    const defaultFirst = (this.corporateBanks && this.corporateBanks.length === 1) ? true : false;
    const val = this.dropdownAPIService.getInputDropdownValue(this.corporateBanks,
      FccGlobalConstant.SE_BANK_NAME_LIST, this.form, defaultFirst);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST), { options: this.corporateBanks });
    if (val && this.commonService.isnonEMptyString(val)) {
      this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST).setValue(val);
    }
    if (this.corporateBanks.length === 1) {
      this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = false;
    }
    if (val && this.commonService.isnonEMptyString(val)) {
      if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === '01') {
        this.multiBankService.setCurrentBank(val, entityName);
      } else {
        this.multiBankService.setCurrentBank(val);
      }
    }
    if (this.taskService.getTaskBank()) {
      if (this.corporateBanks && this.corporateBanks.length === 1) {
        this.form.get('seBankNameList').setValue(this.taskService.getTaskBank().value);
        this.multiBankService.setCurrentBank(this.taskService.getTaskBank().value);
      } else if (this.corporateBanks && this.corporateBanks.length > 1
        && val && this.commonService.isnonEMptyString(val)) {
        const filteredBank = this.corporateBanks.filter(rec => rec.value === val);
        if (filteredBank && filteredBank.length > 0) {
          this.taskService.setTaskBank(filteredBank[0]);
          this.form.get('seBankNameList').setValue(this.taskService.getTaskBank().value);
          this.multiBankService.setCurrentBank(this.taskService.getTaskBank().value);
        }
      }
    } else {
      // this.taskService.setTaskBank(this.corporateBanks[0]);
      // Creating issue in case of multibank customer. So checking multibank and if not setting first as default
      if (val && this.commonService.isnonEMptyString(val)) {
        const filteredBank = this.corporateBanks.filter(rec => rec.value === val);
        if (filteredBank && filteredBank.length > 0) {
          this.taskService.setTaskBank(filteredBank[0]);
        } else if (this.corporateBanks && this.corporateBanks.length === 1) {
          this.taskService.setTaskBank(this.corporateBanks[0]);
        }
      } else if (this.corporateBanks && this.corporateBanks.length === 1) {
        this.taskService.setTaskBank(this.corporateBanks[0]);
      }
    }
    if (this.mode === FccGlobalConstant.VIEW && (this.operation === FccGlobalConstant.LIST_INQUIRY
      || this.operation === FccGlobalConstant.PREVIEW)) {
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropdownAPIService
        .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.SE_BANK_NAME_LIST, this.form);
      if (valueDisplayed !== undefined && valueDisplayed[FccGlobalConstant.LABEL] !== undefined) {
        valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
        if (valObj) {
          this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST).setValue(valObj.label);
        }
      }
    }
    if (this.mode === FccGlobalConstant.VIEW && (this.operation === FccGlobalConstant.LIST_INQUIRY
      || this.operation === FccGlobalConstant.PREVIEW)) {
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropdownAPIService
        .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.SE_BANK_NAME_LIST, this.form);
      if (valueDisplayed !== undefined && valueDisplayed[FccGlobalConstant.LABEL] !== undefined) {
        valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
        if (valObj) {
          this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST).setValue(valObj.label);
        }
      }
    }
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
    if (event && event.value && this.form.get('seBankNameList') && !this.form.get('seBankNameList')[this.params][this.disabled]) {
      this.multiBankService.setCurrentBank(event.value);
      const taskBank = this.corporateBanks.filter((item) => item.value === event.value);
      this.taskService.setTaskBank(taskBank[0]);
      this.setIssuerReferenceList();
    }
  }

  getCorporateReferences() {
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ISSUER_REF_LIST), { options: [] });
    this.entityName = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value.shortName;
    if (this.entityName === '') {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.readonly] = true;
    } else {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.readonly] = false;
    }
    this.setIssuerReferenceList();
  }

  setIssuerReferenceList() {
    this.corporateReferences = [];
    const referenceList = this.multiBankService.getReferenceList();
    referenceList.forEach(reference => {
      this.corporateReferences.push(reference);
    });
    const isDefaultFirst = this.corporateReferences.length === FccGlobalConstant.LENGTH_1;
    let val = this.dropdownAPIService.getInputDropdownValue(this.corporateReferences, FccGlobalConstant.ISSUER_REF_LIST, this.form,
      isDefaultFirst);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ISSUER_REF_LIST), { options: this.corporateReferences });
    val = this.multiBankService.updateRefonEntityChange && !isDefaultFirst && !val ? '' : val;
    this.form.get(FccGlobalConstant.ISSUER_REF_LIST).setValue(val);
    if (this.mode === FccGlobalConstant.VIEW && (this.operation === FccGlobalConstant.LIST_INQUIRY
      || this.operation === FccGlobalConstant.PREVIEW)) {
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropdownAPIService.getDropDownFilterValueObj(this.corporateReferences,
        (FccGlobalConstant.ISSUER_REF_LIST), this.form);
      if (valueDisplayed !== undefined && valueDisplayed[FccGlobalConstant.LABEL] !== undefined) {
        valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
        if (valObj) {
          this.form.get(FccGlobalConstant.ISSUER_REF_LIST).setValue(valObj.label);
        }
      }
    }
    if (this.corporateReferences.length === 1) {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.disabled] = false;
    }

  }

}
