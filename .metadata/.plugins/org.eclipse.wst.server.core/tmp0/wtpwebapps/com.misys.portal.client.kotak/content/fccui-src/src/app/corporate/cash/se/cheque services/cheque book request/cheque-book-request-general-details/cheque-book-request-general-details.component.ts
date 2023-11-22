import { Component, OnInit, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { CommonService } from '../../../../../../../common/services/common.service';
import { ChequeBookRequestProductComponent } from '../../cheque-book-request-product/cheque-book-request-product/cheque-book-request-product.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, SelectItem } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormModelService } from '../../../../../../../common/services/form-model.service';
import { SearchLayoutService } from '../../../../../../../common/services/search-layout.service';
import { LeftSectionService } from '../../../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../../../../trade/lc/common/services/product-state.service';
import { SaveDraftService } from '../../../../../../trade/lc/common/services/save-draft.service';
import { FormControlService } from '../../../../../../trade/lc/initiation/services/form-control.service';
import { PrevNextService } from '../../../../../../trade/lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../../../../trade/lc/initiation/services/utility.service';
import { HOST_COMPONENT } from '../../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { EventEmitterService } from '../../../../../../../common/services/event-emitter-service';
import { FccGlobalConstantService } from '../../../../../../../common/core/fcc-global-constant.service';
import { FilelistService } from '../../../../../../trade/lc/initiation/services/filelist.service';
import { ResolverService } from '../../../../../../../common/services/resolver.service';
import { CurrencyConverterPipe } from '../../../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { TransactionDetailService } from '../../../../../../../common/services/transactionDetail.service';
import { ProductMappingService } from '../../../../../../../common/services/productMapping.service';
import { CustomCommasInCurrenciesPipe } from '../../../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FCCFormGroup } from '../../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../../../common/core/fcc-global-constants';
import { Entities } from '../../../../../../../common/model/entities';
import { MultiBankService } from '../../../../../../../common/services/multi-bank.service';
import { DropDownAPIService } from '../../../../../../../common/services/dropdownAPI.service';
import { FccTaskService } from '../../../../../../../common/services/fcc-task.service';
import { iif, Observable } from 'rxjs';
import { DashboardService } from '../../../../../../../common/services/dashboard.service';
import { concatMap, debounceTime, filter, tap } from 'rxjs/operators';
import { CodeData } from '../../../../../../../common/model/codeData';
import { CodeDataService } from '../../../../../../../common/services/code-data.service';
import { CashCommonDataService } from '../../../../../../../corporate/cash/services/cash-common-data.service';
import { ChequeBookRequestProductService } from '../../../services/cheque-book-request-product.service';
import { FccConstants } from '../../../../../../../common/core/fcc-constants';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-cheque-book-request-general-details',
  templateUrl: './cheque-book-request-general-details.component.html',
  styleUrls: ['./cheque-book-request-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ChequeBookRequestGeneralDetailsComponent }]
})
export class ChequeBookRequestGeneralDetailsComponent extends ChequeBookRequestProductComponent implements OnInit, AfterViewInit {
  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  module = `${this.translateService.instant(FccConstants.CHEQUE_BOOK_REQUEST_GENERAL_DETAILS)}`;
  contextPath: any;
  progressivebar: number;
  barLength: any;
  mode: any;
  tnxTypeCode: any;
  option: any;
  entity: Entities;
  entities = [];
  accounts: SelectItem[] = [];
  placementAccounts: SelectItem[] = [];
  flag = false;
  entityId: string;
  fetching = true;
  entityDataArray = [];
  codeID: any;
  productCode: any;
  subProductCode: any;
  codeData = new CodeData();
  dataArray: any;
  list: any[];
  bankName: any;
  cur = [];
  isMasterRequired: boolean;
  paramListValue: any;
  arr = [];
  obj = {};
  deliveryRes: any;
  chequeBooks: any;
  noOfChequeBookErrMsg: any;
  errMsg: any;
  controlName: any;
  bankResponse: any;
  collectorNameMaxLength: any;
  collectorIdMaxLength: any;

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
              protected chequeBookRequestProductService: ChequeBookRequestProductService,
              protected multiBankService: MultiBankService,
              protected dropdownAPIService: DropDownAPIService,
              protected taskService: FccTaskService,
              protected dashboardService: DashboardService,
              protected codeDataService: CodeDataService, protected cashCommonDataService: CashCommonDataService) {
      super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
        searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, chequeBookRequestProductService);

      }

  ngOnInit(): void {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.barLength = this.leftSectionService.progressBarPerIncrease(FccConstants.CHEQUE_BOOK_REQUEST_GENERAL_DETAILS);
    this.subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
    this.leftSectionService.progressBarData.subscribe(
            data => {
              this.progressivebar = data;
            }
          );
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.initializeFormGroup();
    this.getEntityId();
    this.loadConfiguration();

  }

  loadConfiguration() {
    this.commonService.loadDefaultConfiguration().subscribe((response) => {
      if (response) {
        this.collectorNameMaxLength = response.collectorNameMaxLength;
        this.collectorIdMaxLength = response.collectorIdMaxLength;
      }
    });
  }

  initializeFormGroup() {
    const sectionName = FccConstants.CHEQUE_BOOK_REQUEST_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.setFormFieldValidations();
    this.getNoOfChequeBooks();
    this.getDeliveryOptions();
    this.updateUserAccounts();
    this.form.updateValueAndValidity();
    this.form.addFCCValidators(
      FccConstants.NO_OF_CHEQUE_BOOKS,
      Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]),
      0
    );
    this.form.get(FccConstants.NO_OF_CHEQUE_BOOKS)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAXLENGTH] = FccGlobalConstant.STRING_02;
  }

  onChangeNoOfChequesBooks({ target }) {
    this.errMsg = '';
    this.form.addFCCValidators(FccConstants.NO_OF_CHEQUE_BOOKS,
            Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
    const flag = /^\+?\d+$/.test(target.value);
    if (!flag) {
      this.form.addFCCValidators(FccConstants.NO_OF_CHEQUE_BOOKS,
        Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
      return;
    }
    if (Number(target.value) < Number(this.chequeBooks[0].data_1)) {
          this.errMsg = this.translateService.instant('noOfChequeBookMinErrMsg') + this.chequeBooks[0].data_1 + ' ' +
          this.translateService.instant('Cheque Book(s)');
          this.form.get(FccConstants.NO_OF_CHEQUE_BOOKS).setErrors({ noOfChequeBookMinErrMsg: this.errMsg });
       }else
       if (Number(target.value) > Number(this.chequeBooks[0].data_2)) {
        this.errMsg = this.translateService.instant('noOfChequeBookMaxErrMsg') + ' ' + this.chequeBooks[0].data_2 + ' ' +
        this.translateService.instant('Cheque Book(s)');
        this.form.get(FccConstants.NO_OF_CHEQUE_BOOKS).setErrors({ noOfChequeBookMaxErrMsg: this.errMsg });
     }
  }

  getNoOfChequeBooks() {
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
    this.commonService.getBankDetails().subscribe(
        bankRes => {
          this.bankName = bankRes.shortName;
          this.commonService.getParameterConfiguredValues(this.bankName,
            FccGlobalConstant.PARAMETER_P997, this.subProductCode, FccGlobalConstant.PRODUCT_SE).subscribe(responseData => {
              if (this.commonService.isNonEmptyValue(responseData) && this.commonService.isNonEmptyValue(responseData.paramDataList)) {
                this.chequeBooks = responseData.paramDataList;
              }
            });
        });
  }


  setFormFieldValidations() {
    this.form.get(FccConstants.ACCOUNT_NUMBER)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccConstants.NO_OF_CHEQUE_BOOKS)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccConstants.DELIVERY_MODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
  }

  saveFormOject() {
    this.stateService.setStateSection(FccConstants.CHEQUE_BOOK_REQUEST_GENERAL_DETAILS, this.form);
  }


  getEntityId() {
    this.commonService.getFormValues(FccGlobalConstant.STATIC_DATA_LIMIT, this.fccGlobalConstantService.userEntities)
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
      });
  }

  getUserEntities() {
    this.updateUserEntities();
  }

  async updateUserEntities() {
    if (!this.multiBankService.getEntityList().length) {
      await this.multiBankService.multiBankAPI(this.productCode, this.subProductCode);
    }
    this.entities = [];
    this.multiBankService.getEntityList().forEach(entity => {
      this.entities.push(entity);
    });
    const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, FccGlobalConstant.ENTITY_TEXT, this.form);
    if (valObj && !this.taskService.getTaskEntity()) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT).patchValue(valObj[FccGlobalConstant.VALUE]);
      this.multiBankService.setCurrentEntity(valObj[FccGlobalConstant.VALUE].name);
    } else if (this.taskService.getTaskEntity()){
      this.form.get(FccGlobalConstant.ENTITY_TEXT).patchValue(this.taskService.getTaskEntity());
    }
    if (this.entities.length === 0) {
      if (this.form.get(FccGlobalConstant.ENTITY_TEXT)) {
        this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.RENDERED] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.ENTITY_TEXT, false);
        this.form.get(FccGlobalConstant.ENTITY_TEXT).clearValidators();
        this.form.get(FccGlobalConstant.ENTITY_TEXT).updateValueAndValidity();
      }
    } else if (this.entities.length === 1) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.ENTITY_TEXT).setValue({ label: this.entities[0].value.label, name: this.entities[0].value.name,
         shortName: this.entities[0].value.shortName });
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.READONLY] = true;
      this.multiBankService.setCurrentEntity(this.entities[0].value.name);
      this.entityId = this.entityDataArray[0].value;
    } else if (this.entities.length > 1) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][FccGlobalConstant.RENDERED] = true;
    }
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ENTITY_TEXT), { options: this.entities });
    if (this.form.get(FccGlobalConstant.ENTITY_TEXT).value) {
      this.entityDataArray.forEach(entity => {
        if (this.form.get(FccGlobalConstant.ENTITY_TEXT).value.label === entity.label) {
          this.entityId = entity.value;
        }
      });
    }
    this.updateUserAccounts();
    this.form.updateValueAndValidity();
  }


  updateUserAccounts() {
    const filterValues = {};
    const productTypes = 'product-types';
    const parameter = 'parameter';
    const drCr = 'dr-cr';
    const option = 'option';
    filterValues[productTypes] = 'SE:CQBKR';
    filterValues[parameter] = '';
    filterValues[drCr] = 'debit';
    filterValues[option] = 'useraccount';
    const accountParameters = JSON.stringify(filterValues);
    iif(() => this.commonService.isnonEMptyString(this.entityId),
      this.getUserAccountsByEntityId(accountParameters),
      this.allUserAccounts(accountParameters)
    ).subscribe(
      response => {
        this.accounts = [];
        if (response.items.length > 0) {
          response.items.forEach(
            value => {
              const account: { label: string, value: any } = {
                label: value.number,
                value: {
                  accountNo: value.number,
                  id: value.id,
                  currency: value.currency,
                  type: value.type,
                  accountContext: value.accountContext ? value.accountContext : '',
                  label: value.number,
                  reference: value.reference
                }
              };
              this.accounts.push(account);
          });
          this.patchFieldParameters(this.form.get(FccConstants.ACCOUNT_NUMBER), { options: this.accounts });
          this.getAccounts(FccConstants.ACCOUNT_NUMBER);
        }
      });
  }

  getAccounts(accountType: any) {
    const account = this.stateService.getValue(FccConstants.CHEQUE_BOOK_REQUEST_GENERAL_DETAILS, accountType, false);
    const accountLabel = this.accounts.filter(task => task.value.label === account);
    const accountName = this.accounts.filter(task => task.value.name === account);
    if (accountLabel !== undefined && accountLabel !== null && accountLabel.length > 0) {
      this.form.get(accountType).setValue(accountLabel[0].value);
    } else if (accountName !== undefined && accountName !== null && accountName.length > 0) {
      this.form.get(accountType).setValue(accountName[0].value);
    }
  }

  allUserAccounts(accountParameters: any): Observable<any> {
    return this.dashboardService.getUserSpecificAccount(accountParameters);
  }

  getUserAccountsByEntityId(accountParameters: any): Observable<any> {
    return this.dashboardService.getUserAccountsByEntityId(this.entityId, accountParameters);
  }

  onClickEntity(event) {
    if (event.value) {
      this.multiBankService.setCurrentEntity(event.value.name);
      this.taskService.setTaskEntity(event.value);
      this.entityDataArray.forEach(value => {
        if (event.value.shortName === value.label) {
          this.entityId = value.value;
          this.flag = true;
          if (this.commonService.isnonEMptyString(this.entityId)) {
            this.updateUserAccounts();
           }
        }
      });
      this.patchFieldParameters(this.form.get(FccConstants.ACCOUNT_NUMBER), { options: this.updateUserAccounts() });
      if (this.accounts.length === 1) {
        this.patchFieldParameters(this.form.get(FccConstants.ACCOUNT_NUMBER), { readonly: true });
        this.onClickAccountNumber(this.accounts[0]);
      } else {
        this.patchFieldParameters(this.form.get(FccConstants.ACCOUNT_NUMBER), { readonly: false });
        this.patchFieldParameters(this.form.get(FccConstants.ACCOUNT_NUMBER), { autoDisplayFirst : false });
      }
    }

  }

  onClickAccountNumber(event) {
    if (event.value) {
      this.form.get(FccConstants.ACCOUNT_NUMBER).setValue(event.value);
      this.form.get(FccConstants.ACCOUNT_ID).setValue(event.value.id);
      this.form.get('applReference').setValue(event.value.reference);
      this.form.updateValueAndValidity();
    }
  }


  getDeliveryOptions() {
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
    this.commonService.getBankDetails().subscribe(
        bankRes => {
          this.bankName = bankRes.shortName;
          this.commonService.getParameterConfiguredValues(this.bankName,
            FccGlobalConstant.PARAMETER_P999, this.subProductCode, FccGlobalConstant.PRODUCT_FT).subscribe(responseData => {
              if (this.commonService.isNonEmptyValue(responseData) && this.commonService.isNonEmptyValue(responseData.paramDataList)) {
                this.deliveryRes = responseData.paramDataList;
                this.getDataForDeliveryOption();
              }
            });
        });
  }

 getDataForDeliveryOption() {
  const elementId = FccConstants.DELIVERY_MODE_OPTIONS;
  this.dataArray = [];
  this.deliveryRes.forEach(element => {
      if (element.data_1 === FccGlobalConstant.CODE_Y) {
        const deliveryOptions: { label: string; value: any; id: any } = {
          label: this.translateService.instant('deliveryModeOptions_03'),
          value: FccGlobalConstant.CODE_03,
          id: 'deliveryModeOptions_03'
        };
        this.dataArray.push(deliveryOptions);
      }
      if (element.data_2 === FccGlobalConstant.CODE_Y) {
        const deliveryOptions: { label: string; value: any; id: any } = {
          label: this.translateService.instant('deliveryModeOptions_04'),
          value: FccGlobalConstant.CODE_04,
          id: 'deliveryModeOptions_04'
        };
        this.dataArray.push(deliveryOptions);
      }
      if (element.data_3 === FccGlobalConstant.CODE_Y) {
        const deliveryOptions: { label: string; value: any; id: any } = {
          label: this.translateService.instant('deliveryModeOptions_08'),
          value: FccGlobalConstant.CODE_08,
          id: 'deliveryModeOptions_08'
        };
        this.dataArray.push(deliveryOptions);
      }
    });
  this.patchFieldParameters(this.form.get(elementId), { options: this.dataArray });
  this.onClickDeliveryModeOptions(this.form.get(FccConstants.DELIVERY_MODE_OPTIONS));
  this.form.get(elementId).updateValueAndValidity();
  }

  onClickDeliveryModeOptions(event) {
    if (this.commonService.isEmptyValue(this.form.get(FccConstants.DELIVERY_MODE_OPTIONS).value)){
      this.form.get(FccConstants.DELIVERY_MODE_OPTIONS).setValue(
        this.form.get("deliveryModeOptions")[FccGlobalConstant.PARAMS][
          FccGlobalConstant.DEFAULT_VALUE
        ]
      );
    }else{
      this.form.get(FccConstants.DELIVERYMODE).setValue(event.value);
    }
    if (event.value === FccGlobalConstant.CODE_08) {
     this.form.get(FccConstants.BRANCH_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
     this.form.get(FccConstants.COLLECTORS_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
     this.form.get(FccConstants.BRANCH_CODE_ICONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
     this.form.get(FccConstants.COLLECTORS_IDENTFICATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
     this.form.get(FccConstants.BRANCH_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
     this.form.get(FccConstants.COLLECTORS_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
     this.form.get(FccConstants.BRANCH_CODE_ICONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
     this.form.get(FccConstants.COLLECTORS_IDENTFICATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
     this.maxLengthValidationDeliveryOptionCollector();
    } else {
     this.form.get(FccConstants.BRANCH_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
     this.form.get(FccConstants.COLLECTORS_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
     this.form.get(FccConstants.BRANCH_CODE_ICONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
     this.form.get(FccConstants.COLLECTORS_IDENTFICATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    this.clearValidations();
   }


   maxLengthValidationDeliveryOptionCollector() {
    this.form.get(FccConstants.COLLECTORS_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAXLENGTH]
     = this.collectorNameMaxLength;
    this.form.get(FccConstants.COLLECTORS_IDENTFICATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAXLENGTH]
     = this.collectorIdMaxLength;
   }

   clearValidations() {
    if (this.form.get(FccConstants.BRANCH_CODE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === false){
      this.setMandatoryField(this.form, FccConstants.BRANCH_CODE, false);
      this.form.get(FccConstants.BRANCH_CODE).clearValidators();
      this.form.get(FccConstants.BRANCH_CODE).updateValueAndValidity();
    }
    if (this.form.get(FccConstants.COLLECTORS_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === false){
      this.setMandatoryField(this.form, FccConstants.COLLECTORS_NAME, false);
      this.form.get(FccConstants.COLLECTORS_NAME).clearValidators();
      this.form.get(FccConstants.COLLECTORS_NAME).updateValueAndValidity();
    }
    if (this.form.get(FccConstants.COLLECTORS_IDENTFICATION)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === false){
      this.setMandatoryField(this.form, FccConstants.COLLECTORS_IDENTFICATION, false);
      this.form.get(FccConstants.COLLECTORS_IDENTFICATION).clearValidators();
      this.form.get(FccConstants.COLLECTORS_IDENTFICATION).updateValueAndValidity();
    }
  }

  onClickBranchCodeIcons() {
    const obj = {};
    this.preapreLookUpObectData(obj);
    const header = `${this.translateService.instant('listOfBanks')}`;
    this.resolverService.getSearchData(header, obj);
    this.bankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((bankBranchCodeResponse) => {
      if (bankBranchCodeResponse !== null) {
        this.updateBankBranchCodeBankDetails(bankBranchCodeResponse);
      }
    });
  }

  onKeyupBranchCodeIcons(event) {
    if(event && event.keyCode === FccGlobalConstant.LENGTH_13) {
      this.onClickBranchCodeIcons();
    }
  }

  preapreLookUpObectData(obj) {
    const productCode = 'productCode';
    const subProductCode = 'subProductCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    obj[productCode] = '';
    obj[FccGlobalConstant.DEFAULT_CRITERIA] = true;
    obj[option] = 'BANK_BRANCH_CODE';
    obj[subProductCode] = '';
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
  }

  updateBankBranchCodeBankDetails(bankBranchCodeResponse) {
    const bankBranchCode = bankBranchCodeResponse.responseData.BANK_CODE.concat(FccGlobalConstant.BLANK_SPACE_STRING)
                            .concat(bankBranchCodeResponse.responseData.BRANCH);
    this.form.get(FccConstants.BRANCH_CODE).patchValue(bankBranchCode);
    this.form.updateValueAndValidity();
  }

  ngAfterViewInit() {
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.NO_OF_CHEQUE_BOOKS).value) && this.chequeBooks) {
          this.onChangeNoOfChequesBooks({ target : this.form.get(FccConstants.NO_OF_CHEQUE_BOOKS) });
        }

    this.form.valueChanges
      .pipe(
            filter(() => this.form.dirty && this.stateService.getAutoSaveConfig()?.isAutoSaveEnabled),
            debounceTime(this.stateService.getAutoSaveConfig()?.autoSaveDelay),
            concatMap(() => this.commonService.autoSaveForm(
                this.productMappingService.buildFormDataJson(this.form, FccConstants.CHEQUE_BOOK_REQUEST_GENERAL_DETAILS)
                , this.stateService.getAutoSaveCreateFlagInState()
                , FccGlobalConstant.PRODUCT_SE, FccGlobalConstant.SE_SUB_PRODUCT_CODE
                )
              )
            )
      .subscribe(resp => {
        if (resp?.message) {
          this.stateService.setAutoSaveCreateFlagInState(false);
        }
      });

      this.stateService.setStateSection(FccConstants.CHEQUE_BOOK_REQUEST_GENERAL_DETAILS, this.form);
  }
}

