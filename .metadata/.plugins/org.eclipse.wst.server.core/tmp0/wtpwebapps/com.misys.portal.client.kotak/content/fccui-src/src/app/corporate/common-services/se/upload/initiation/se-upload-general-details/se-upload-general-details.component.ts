import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
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
import { SeUploadProductService } from '../../services/se-upload-product.service';
import { SeUploadProductComponent } from '../se-upload-product/se-upload-product.component';
import { FileHandlingService } from '../../../../../../common/services/file-handling.service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { CorporateCommonService } from '../../../../../common/services/common.service';
import { CorporateDetails } from '../../../../../../common/model/corporateDetails';
import { CodeDataService } from '../../../../../../common/services/code-data.service';
import { DashboardService } from '../../../../../../common/services/dashboard.service';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-se-upload-general-details',
  templateUrl: './se-upload-general-details.component.html',
  styleUrls: ['./se-upload-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SeUploadGeneralDetailsComponent }]
})
export class SeUploadGeneralDetailsComponent extends SeUploadProductComponent implements OnInit, OnDestroy {
  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  @ViewChild('fccCommonTextArea') public fccCommonTextAreaId: ElementRef;
  lcConstant = new LcConstant();
  module = `${this.translateService.instant(FccGlobalConstant.SE_UPLOAD_GENERAL_DETAILS)}`;
  params = this.lcConstant.params;
  readOnly = this.lcConstant.readonly;
  transactionSubscription: Subscription[] = [];
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
  dataParam = 'data';
  attachmentId = 'attachmentId';
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
  customerInstnsLen: any;
  element = 'customerInstructionText';
  customerInstnsRowCount: number;
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
  codeIDSubTopic: any;
  subTopicValues: any;
  accounts = [];
  accountsWithCur = [];
  entityId: any;
  fetching = true;
  entityDataArray = [];

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
    protected seUploadProductService: SeUploadProductService, protected fileHandlingService: FileHandlingService,
    protected multiBankService: MultiBankService, protected dropdownAPIService: DropDownAPIService,
    protected taskService: FccTaskService, protected corporateCommonService: CorporateCommonService,
    protected dashboardService: DashboardService,
    protected codeDataService: CodeDataService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, uploadFile, dialogRef, currencyConverterPipe, seUploadProductService);
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
    this.initializeFormGroup();
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.selectedEntity = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value;
      if (typeof this.selectedEntity === 'object' && this.selectedEntity) {
        this.selectedEntity = this.selectedEntity.shortName;
      }
      this.multiBankService.setCurrentEntity(this.selectedEntity);
      this.updateCustomerInstructionCount();
    }
  }

  updateCustomerInstructionCount(){
    if (this.commonService.isnonEMptyString(this.form.get('customerInstructionText').value)) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('customerInstructionText').value);
      this.form.get('customerInstructionText')[this.params][this.enteredCharCount] = count;
    }
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.SE_UPLOAD_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.form.updateValueAndValidity();
    this.commonService.formatForm(this.form);
    this.getCorporateBanks();
    this.getCorporateReferences();
    this.getEntityDataArray();
    // this.handleValuesOnLoad();
  }

  getEntityDataArray() {
    this.transactionSubscription.push(this.commonService.getFormValues(FccGlobalConstant.STATIC_DATA_LIMIT, 
      this.fccGlobalConstantService.userEntities)
      .pipe(
        tap(() => this.fetching = true)
      )
      .subscribe(res => {
        this.fetching = false;
        res.body.items.forEach(value => {
          const entity: { label: string; value: any } = {
            label: value.shortName,
            value: value.id
          };
          this.entityDataArray.push(entity);
        });
        this.getUserEntities();
        if (res.body.items && res.body.items.length > 0){
          this.getEntityId();
        } else {
          this.getUserAccounts();
          this.getCorporateBanks();
        }
      }));
  }

  getEntityId() {
    const entity = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value;
    if (entity) {
      this.entityName = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value.shortName;
      this.entityDataArray.forEach(value => {
        if (entity.shortName === value.label) {
          this.entityId = value.value;
          if (this.commonService.isnonEMptyString(this.entityId)) {
            this.getStaticAccounts();
          }
        }
      });
    } 
  }
    
  onClickApplicantEntity() {
    const entity = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value;
    if (entity) {
      this.getEntityId();
      this.multiBankService.setCurrentEntity(entity.shortName);
      this.multiBankService.clearIssueRef();
      // sync with task entity TODO: revisit
      this.taskService.setTaskEntity(entity);
      this.getCorporateBanks();
      this.getCorporateReferences();
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_NAME), entity.name, {});
      this.form.updateValueAndValidity();
    }
  }

  getUserEntities() {
    this.updateUserEntities();
  }

  updateUserEntities() {
    this.multiBankService.getEntityList().forEach(entity => {
      this.entities.push(entity);
    });
    const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, 
      FccGlobalConstant.APPLICANT_ENTITY, this.form);
    if (valObj && valObj[this.VALUE] && !this.taskService.getTaskEntity()) {
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY).patchValue(valObj[this.VALUE]);
    } else if (this.taskService.getTaskEntity()) {
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY).patchValue(this.taskService.getTaskEntity());
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
        this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)) {
        this.form.get(FccGlobalConstant.APPLICANT_NAME).setValue(this.taskService.getTaskEntity().name);
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
          this.transactionSubscription.push(this.corporateCommonService.getValues(this.fccGlobalConstantService.corporateDetails)
          .subscribe(response => {
            if (response.status === this.responseStatusCode) {
              this.corporateDetails = response.body;
              if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
                this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)) {
                this.form.get(FccGlobalConstant.APPLICANT_NAME).setValue(this.corporateDetails.name);
              }
            }
          }));
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
      this.multiBankService.setCurrentEntity(this.entities[0].value.shortName);
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

  getCorporateBanks() {
    this.selectedEntity = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value;
    if (typeof this.selectedEntity === 'object' && this.selectedEntity) {
      this.selectedEntity = this.selectedEntity.shortName;
    }
    this.multiBankService.setCurrentEntity(this.selectedEntity);
    this.setBankNameList();
    const defaultFirst = (this.corporateBanks && this.corporateBanks.length === 1) ? true : false;
    const val = this.dropdownAPIService.getInputDropdownValue(this.corporateBanks,
      FccGlobalConstant.SE_BANK_NAME_LIST, this.form, defaultFirst);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST), { options: this.corporateBanks });
    if (val && this.commonService.isnonEMptyString(val)) {
      this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST).setValue(val);
    }
    if (this.modeRef == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropdownAPIService
        .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.SE_BANK_NAME_LIST, this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj) {
        this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST).setValue(valObj.label);
      }
    }
    const valueDisplayed = this.dropdownAPIService
      .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.SE_BANK_NAME_LIST, this.form);
    if (valueDisplayed) {
      this.onClickSeBankNameList(valueDisplayed);
    }
    if (this.corporateBanks.length === FccGlobalConstant.LENGTH_1 && val
      && this.commonService.isnonEMptyString(val)) {
      this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
    }
    if (val && this.commonService.isnonEMptyString(val)) {
      this.multiBankService.setCurrentBank(val);
    }
    if (this.taskService.getTaskBank()) {
      if (this.corporateBanks && this.corporateBanks.length === 1) {
        this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST).setValue(this.taskService.getTaskBank().value);
        this.multiBankService.setCurrentBank(this.taskService.getTaskBank().value);
      } else if (this.corporateBanks && this.corporateBanks.length > 1
        && val && this.commonService.isnonEMptyString(val)) {
        const filteredBank = this.corporateBanks.filter(rec => rec.value === val);
        if (filteredBank && filteredBank.length > 0) {
          this.taskService.setTaskBank(filteredBank[0]);
          this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST).setValue(this.taskService.getTaskBank().value);
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
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST).value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST), { amendPersistenceSave: true });
      const valObj = { label: String, value: String };
      const valueDisplayedBank = this.dropdownAPIService.getDropDownFilterValueObj(this.corporateBanks, 
        FccGlobalConstant.SE_BANK_NAME_LIST, this.form);
      if (this.commonService.isnonEMptyString(valueDisplayedBank)) {
        valObj.label = valueDisplayedBank[FccGlobalConstant.LABEL];
        if (valObj) {
          this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST).setValue(valObj.label);
        }
      }
    }
    this.getFileTypeList();
  }
  setBankNameList() {
    if (this.nameOrAbbvName === FccGlobalConstant.ABBV_NAME) {
      if (this.multiBankService.getBankList() && this.multiBankService.getBankList().length > 0) {
        this.corporateBanks = [];
        this.multiBankService.getBankList().forEach(bank => {
          bank.label = bank.value;
          this.corporateBanks.push(bank);
        });
      }
    } else {
      if (this.multiBankService.getBankList() && this.multiBankService.getBankList().length > 0) {
        this.corporateBanks = [];
        this.multiBankService.getBankList().forEach(bank => {
          this.corporateBanks.push(bank);
        });
      }
    }
  }

  onClickSeBankNameList(event) {
    if (event && event.value) {
      this.multiBankService.setCurrentBank(event.value);
      const taskBank = this.corporateBanks.filter((item) => item.value === event.value);
      this.taskService.setTaskBank(taskBank[0]);
      this.getFileTypeList();
      this.setIssuerReferenceList();
    }
  }

  getCorporateReferences() {
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ISSUER_REF_LIST), { options: [] });
    this.entityName = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value.shortName;
    const applicantName = this.form.get(FccGlobalConstant.APPLICANT_NAME).value;
    if (this.entityName === '') {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.readOnly] = true;
    } else {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.readOnly] = false;
    }
    if (this.commonService.isnonEMptyString(this.entityName)
      || this.commonService.isnonEMptyString(applicantName)) {
      this.setIssuerReferenceList();
    }
  }

  setIssuerReferenceList() {
    this.corporateReferences = [];
    const referenceList = this.multiBankService.getReferenceList();
    referenceList.forEach(reference => {
      this.corporateReferences.push(reference);
    });
    const isDefaultFirst = this.corporateReferences.length === FccGlobalConstant.LENGTH_1;
    let val = this.dropdownAPIService.getInputDropdownValue(this.corporateReferences, 
      FccGlobalConstant.ISSUER_REF_LIST, this.form, isDefaultFirst);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ISSUER_REF_LIST), { options: this.corporateReferences });
    if (this.modeRef == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropdownAPIService
        .getDropDownFilterValueObj(this.corporateReferences, FccGlobalConstant.ISSUER_REF_LIST, this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj) {
        this.form.get(FccGlobalConstant.ISSUER_REF_LIST).setValue(valObj.label);
      }
    }
    val = this.multiBankService.updateRefonEntityChange && !isDefaultFirst && !val ? '' : val;
    this.form.get(FccGlobalConstant.ISSUER_REF_LIST).setValue(val);
    if (this.corporateReferences.length === 1) {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.readOnly] = true;
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
    } else {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.readOnly] = false;
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
    }
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && this.form.get(FccGlobalConstant.ISSUER_REF_LIST).value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get(FccGlobalConstant.ISSUER_REF_LIST), { amendPersistenceSave: true });
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropdownAPIService.getDropDownFilterValueObj(this.corporateReferences,
        FccGlobalConstant.ISSUER_REF_LIST, this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj) {
        this.form.get(FccGlobalConstant.ISSUER_REF_LIST).setValue(valObj.label);
      }
    }
  }  
  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SE, key, '', true);
  }



  getFileTypeList() {
    const key1 = this.form.get(FccGlobalConstant.SE_BANK_NAME_LIST)?.value;
    this.transactionSubscription.push(this.commonService
      .getParameterConfiguredValues(key1,FccGlobalConstant.PARAMETER_P651)
      .subscribe((response) => {
        if (response && response.paramDataList) {
          const fileType = [];
          response.paramDataList.forEach((element) => {
            const translatedFileTypeVal = `${this.translateService.instant(element.data_1)}`;
            const file: { label: string; value: any } = {
              label: translatedFileTypeVal,
              value: element.data_1
            };
            fileType.push(file);
          });
          this.patchFieldParameters(this.form.get(FccGlobalConstant.FILE_TYPE), { options: fileType });
          this.form.updateValueAndValidity();
        }
      }));
  }

  getStaticAccounts() {
    if (this.form.get('marginAct')) {
      this.transactionSubscription.push(this.dashboardService
        .getUserAccountsByEntityId(this.entityId).subscribe(response => {
        this.updateAccounts(response);
      }));
    }
  }

  getUserAccounts() {
    if (this.form.get('marginAct')) {
      this.transactionSubscription.push(this.dashboardService
        .getUserAccount().subscribe(response => {
        this.updateAccounts(response);
      }));
    }
  }

  updateAccounts(response) {
    this.accounts = [];
    this.accountsWithCur = [];
    this.accounts = [];
    if (response && response.items.length > 0) {
      response.items.forEach(
        value => {
          const account = this.commonService.getUpdatedAccount(value);
          this.accounts.push(account);
      });
      this.patchFieldParameters(this.form.get('marginAct'), { options: this.accounts });
      if (this.form.get('marginAct') && this.form.get('marginAct').value) {
        this.patchFieldValueAndParameters(this.form.get('marginAct'),this.accounts.filter(
          acc => acc.label === this.form.get('marginAct').value.label)[0].value, {});
      }
    }
  }


  ngOnDestroy() {
    if (this.transactionSubscription && this.transactionSubscription.length > 0){
      this.transactionSubscription.forEach(sub => {
        sub.unsubscribe();
      });
    }
    this.stateService.setStateSection(FccGlobalConstant.SE_UPLOAD_GENERAL_DETAILS, this.form);
  }
    
}
