import { Component, EventEmitter, OnInit, Output, AfterViewInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, SelectItem } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { iif, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CodeData } from '../../../../../../common/model/codeData';
import { Entities } from '../../../../../../common/model/entities';
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
import { HOST_COMPONENT } from '../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../../../trade/lc/common/services/product-state.service';
import { SaveDraftService } from '../../../../../trade/lc/common/services/save-draft.service';
import { CurrencyConverterPipe } from '../../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../../trade/lc/initiation/services/filelist.service';
import { FormControlService } from '../../../../../trade/lc/initiation/services/form-control.service';
import { PrevNextService } from '../../../../../trade/lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../../../trade/lc/initiation/services/utility.service';
import { FccConstants } from './../../../../../../common/core/fcc-constants';
import { StopChequeRequestProductService } from './../../services/stop-cheque-request-product.service';
import { StopChequeRequestProductComponent } from './../stop-cheque-request-product/stop-cheque-request-product.component';

@Component({
  selector: 'app-stop-cheque-request-general-details',
  templateUrl: './stop-cheque-request-general-details.component.html',
  styleUrls: ['./stop-cheque-request-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: StopChequeRequestGeneralDetailsComponent }]
})
export class StopChequeRequestGeneralDetailsComponent extends StopChequeRequestProductComponent implements OnInit, AfterViewInit {

  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  module = `${this.translateService.instant(FccConstants.STOP_CHEQUE_GENERAL_DETAILS)}`;
  contextPath: any;
  progressivebar: number;
  barLength: any;
  mode: any;
  tnxTypeCode: any;
  option: any;
  entity: Entities;
  entities = [];
  accounts: SelectItem[] = [];
  flag = false;
  entityId: string;
  fetching = true;
  entityDataArray = [];
  codeID: any;
  productCode: any;
  subProductCode: any;
  codeData = new CodeData();
  dataArray: any;
  warning = 'warning';
  warningmessage = 'multipleChequemessage';
  list: any [];
  chequeNoLength: any;
  chequeNoSeq: any;
  arr: any;
  allowedNoOfCheques: any;
  errMsg: any;
  lang: any;
  bankName: any;
  valLength: any;
  cheques: any;
  isValid: any;
  validSeq: any;

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
              protected resolverService: ResolverService, protected fileListSvc: FilelistService,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected stopChequeRequestProductService: StopChequeRequestProductService,
              protected multiBankService: MultiBankService,
              protected dropdownAPIService: DropDownAPIService,
              protected taskService: FccTaskService,
              protected dashboardService: DashboardService,
              protected codeDataService: CodeDataService, protected cashCommonDataService: CashCommonDataService) {
super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, stopChequeRequestProductService);
}

  ngOnInit(): void {
    super.ngOnInit();
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.initializeFormGroup();
    this.getEntityId();
    this.getStopChequeReason();
    this.form.get(FccConstants.CHEQUE_TYPE).patchValue(FccGlobalConstant.STRING_02);
    this.barLength = this.leftSectionService.progressBarPerIncrease('stopChequeGeneralDetails');
    this.leftSectionService.progressBarData.subscribe(
    data => {
    this.progressivebar = data;
    }
    );
    if(this.mode === FccGlobalConstant.DRAFT_OPTION) {
      const elementValue = this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS)[FccGlobalConstant.VALUE];
      if(this.commonService.isnonEMptyString(elementValue)) {
        this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS).setValue(elementValue);
        this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS).updateValueAndValidity();
      }
    }
  }

  ngAfterViewInit() {
    this.checkRange();
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

  prepareNumberOfCheques() {
    const elementId = FccConstants.NO_OF_CHEQUE_OPTIONS;
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
    const elementValue = this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    if (this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
        this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
        this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
        this.codeID = this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
      }
    if (elementValue.length === 0) {
        this.dataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, this.subProductCode, this.form, elementId);
        this.patchFieldParameters(this.form.get(elementId), { options: this.dataArray });
      }
    this.onClickNoOfChequesOptions(this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS));
    this.form.get(elementId).updateValueAndValidity();
  }

  onClickNoOfChequesOptions(event) {
   if (event.value === FccGlobalConstant.CODE_01) {
    this.form.get(FccConstants.CHEQUE_NUMBER_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.CHEQUE_NUMBER_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.CHEQUE_NUMBER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE)[FccGlobalConstant.PARAMS][this.warning] = FccGlobalConstant.EMPTY_STRING;
    this.form.get(FccConstants.CHEQUE_NUMBER)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.addFCCValidators(FccConstants.CHEQUE_NUMBER, Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
    this.form.get(FccConstants.CHEQUE_NUMBER_FROM).setValue(null);
    this.form.get(FccConstants.CHEQUE_NUMBER_TO).setValue(null);
    this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE).setValue(null);

   } else if (event.value === FccGlobalConstant.CODE_02) {
    this.form.get(FccConstants.CHEQUE_NUMBER_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.CHEQUE_NUMBER_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.CHEQUE_NUMBER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE)[FccGlobalConstant.PARAMS][
      this.warning
    ] = `${this.translateService.instant(this.warningmessage)}`;
    this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.addFCCValidators(FccConstants.CHEQUE_NUMBER_SEQUENCE,
      Validators.compose([Validators.pattern(FccGlobalConstant.commaseparatednumberPattern)]), 0);
    this.form.get(FccConstants.CHEQUE_NUMBER).setValue(null);
    this.form.get(FccConstants.CHEQUE_NUMBER_FROM).setValue(null);
    this.form.get(FccConstants.CHEQUE_NUMBER_TO).setValue(null);
    if (this.commonService.isnonEMptyString(this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE).value)){
      this.onChangeChequeNumberSequence({ target : this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE) });
      if (!this.validSeq){
        this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE).setValue(null);
       }
       }

  } else {
    this.form.get(FccConstants.CHEQUE_NUMBER_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccConstants.CHEQUE_NUMBER_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccConstants.CHEQUE_NUMBER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE)[FccGlobalConstant.PARAMS][this.warning] = FccGlobalConstant.EMPTY_STRING;
    this.form.get(FccConstants.CHEQUE_NUMBER_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccConstants.CHEQUE_NUMBER_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.addFCCValidators(
      FccConstants.CHEQUE_NUMBER_FROM,
      Validators.compose([
        Validators.pattern(FccGlobalConstant.numberPattern),
      ]),
      0
    );
    this.form.addFCCValidators(FccConstants.CHEQUE_NUMBER_TO, Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
    this.form.get(FccConstants.CHEQUE_NUMBER).setValue(null);
    this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE).setValue(null);
  }
   this.clearValidations();
  }


  checkSeqNumValidation() {
    this.commonService.getBankDetails().subscribe(
        bankRes => {
          this.bankName = bankRes.shortName;
          this.commonService.getParameterConfiguredValues(this.bankName,
            FccGlobalConstant.PARAMETER_P709).subscribe(responseData => {
              if (this.commonService.isNonEmptyValue(responseData) && this.commonService.isNonEmptyValue(responseData.paramDataList)) {
                this.chequeNoSeq = responseData.paramDataList;
                this.allowedNoOfCheques = Number(this.chequeNoSeq[0].data_2);
              }
            });
        });
  }


onChangeChequeNumberSequence({ target }) {
  this.validSeq = true;
  this.arr = target.value.split(',');
  this.cheques = [];
  this.arr.forEach(val => {
    this.isValid = /^[0-9]*$/.test(val);
    if (!this.isValid || val.length !== this.chequeNoLength || val === ''){
         this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE).setErrors({ invalidChequeNumber: { maxSize: this.chequeNoLength } });
         this.validSeq = false;
      }else if (this.isValid && val.length === this.chequeNoLength){
        if (this.cheques.indexOf(val) === -1){
          this.cheques.push(val);
        }else{
          this.errMsg = this.translateService.instant('duplicateChequeNum');
          this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE).setErrors({ duplicateChequeNum: this.errMsg });
          this.validSeq = false;
        }
      }
    });

  if (this.arr.length > this.allowedNoOfCheques){
      this.errMsg = this.translateService.instant('invalidChequeCount') + this.allowedNoOfCheques;
      this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE).setErrors({ invalidChequeCount: this.errMsg });
      this.validSeq = false;
    }
}


  clearValidations() {
    if (this.form.get(FccConstants.CHEQUE_NUMBER_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === false){
      this.setMandatoryField(this.form, FccConstants.CHEQUE_NUMBER_FROM, false);
      this.form.get(FccConstants.CHEQUE_NUMBER_FROM).clearValidators();
      this.form.get(FccConstants.CHEQUE_NUMBER_FROM).updateValueAndValidity();
    }
    if (this.form.get(FccConstants.CHEQUE_NUMBER_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === false){
      this.setMandatoryField(this.form, FccConstants.CHEQUE_NUMBER_TO, false);
      this.form.get(FccConstants.CHEQUE_NUMBER_TO).clearValidators();
      this.form.get(FccConstants.CHEQUE_NUMBER_TO).updateValueAndValidity();
    }
    if (this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === false){
      this.setMandatoryField(this.form, FccConstants.CHEQUE_NUMBER_SEQUENCE, false);
      this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE).clearValidators();
      this.form.get(FccConstants.CHEQUE_NUMBER_SEQUENCE).updateValueAndValidity();
    }
    if (this.form.get(FccConstants.CHEQUE_NUMBER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] === false){
      this.setMandatoryField(this.form, FccConstants.CHEQUE_NUMBER, false);
      this.form.get(FccConstants.CHEQUE_NUMBER).clearValidators();
      this.form.get(FccConstants.CHEQUE_NUMBER).updateValueAndValidity();
    }
  }

  initializeFormGroup() {
    const sectionName = FccConstants.STOP_CHEQUE_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.setFormFieldValidations();
    this.checkSeqNumValidation();
    this.prepareNumberOfCheques();
    this.form.updateValueAndValidity();
  }

  setFormFieldValidations() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (this.commonService.isNonEmptyValue(response)){
        this.chequeNoLength = response.chequeNumberLength;
        this.chequeNoLength = Number(this.chequeNoLength);
      }
    });
    this.form.get(FccConstants.ACCOUNT_NUMBER)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccConstants.CHEQUE_NUMBER)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccConstants.CHEQUE_NUMBER)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAXLENGTH] = this.chequeNoLength;
    this.form.get(FccConstants.CHEQUE_NUMBER_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAXLENGTH] = this.chequeNoLength;
    this.form.get(FccConstants.CHEQUE_NUMBER_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAXLENGTH] = this.chequeNoLength;
  }

  onChangeChequeNumber({ target }) {
    if (target.value.length !== this.chequeNoLength){
      this.form.get(FccConstants.CHEQUE_NUMBER).setErrors({ invalidChequeNumber: { maxSize: this.chequeNoLength } });
    }
  }

  onChangeChequeNumberFrom({ target }) {
    this.form.addFCCValidators(
      FccConstants.CHEQUE_NUMBER_FROM,
      Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]),
      0
    );
    if (target.value.length === this.chequeNoLength){
      this.checkRange();
    }else {
    this.form.get(FccConstants.CHEQUE_NUMBER_FROM).setErrors({ invalidChequeNumber: { maxSize: this.chequeNoLength } });
    }

  }

  onChangeChequeNumberTo({ target }) {
    this.form.addFCCValidators(
      FccConstants.CHEQUE_NUMBER_TO,
      Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]),
      0
    );
    if (target.value.length === this.chequeNoLength){
      this.checkRange();
    }else {
      this.form.get(FccConstants.CHEQUE_NUMBER_TO).setErrors({ invalidChequeNumber: { maxSize: this.chequeNoLength } });
    }

  }

  checkRange() {
    if (this.commonService.isNonEmptyValue(this.form.get(FccConstants.CHEQUE_NUMBER_FROM).value) &&
      this.commonService.isNonEmptyValue(this.form.get(FccConstants.CHEQUE_NUMBER_TO).value)){
      if (/^[0-9]*$/.test(this.form.get(FccConstants.CHEQUE_NUMBER_FROM).value)) {
      if ((this.form.get(FccConstants.CHEQUE_NUMBER_FROM).value > this.form.get(FccConstants.CHEQUE_NUMBER_TO).value) ||
      (this.form.get(FccConstants.CHEQUE_NUMBER_FROM).value === this.form.get(FccConstants.CHEQUE_NUMBER_TO).value)){
        this.errMsg = this.translateService.instant('chequeNumberFromErrLessThan');
        this.form.get(FccConstants.CHEQUE_NUMBER_FROM).setErrors({ chequeNumberFromErr: this.errMsg });
      } else if (this.form.get(FccConstants.CHEQUE_NUMBER_FROM).value < this.form.get(FccConstants.CHEQUE_NUMBER_TO).value) {
        this.commonService.getParameterConfiguredValues(this.bankName, FccGlobalConstant.PARAMETER_P996)
          .subscribe((responseData) => {
            let chequeRangeParamValue;
            if (responseData?.paramDataList && responseData.paramDataList.length && responseData.paramDataList[0].data_1) {
              chequeRangeParamValue = parseInt(responseData.paramDataList[0].data_1, 10);
            }
            if (chequeRangeParamValue && this.form.get(FccConstants.CHEQUE_NUMBER_TO).value
              - this.form.get(FccConstants.CHEQUE_NUMBER_FROM).value >= chequeRangeParamValue) {
              this.errMsg = this.translateService.instant('chequeNumberRangeParam', { chequeRangeParamValue });
              this.form.get(FccConstants.CHEQUE_NUMBER_FROM).setErrors({ chequeNumberFromErr: this.errMsg });
            } else {
              this.form.get(FccConstants.CHEQUE_NUMBER_FROM).setErrors(null);
              this.form.get(FccConstants.CHEQUE_NUMBER_FROM).updateValueAndValidity();
            }
          });
      }
    }
    }else {
      this.form.get(FccConstants.CHEQUE_NUMBER_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    }
  }


  saveFormOject() {
    this.stateService.setStateSection(FccConstants.STOP_CHEQUE_GENERAL_DETAILS, this.form);
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

  onKeyupEntity() {
    this.onClickEntity(this.form.get(FccGlobalConstant.ENTITY_TEXT));
  }

  getStopChequeReason() {
    const language = localStorage.getItem('language');
    this.commonService.getParamData(FccGlobalConstant.PRODUCT_SE, FccConstants.PARAMETER_P700).subscribe(response => {
        if (response) {
          this.list = this.cashCommonDataService.getStopChequeReasonParamData(response, FccConstants.BANK_DEFAULT, language,
            FccConstants.STOP_CHEQUE_REASON, FccGlobalConstant.PRODUCT_SE);

          this.list.sort((a, b) => (a.value > b.value) ? 1 : -1);
          this.patchFieldParameters(this.form.get(FccConstants.STOP_CHEQUE_REASON), { options: this.list });
          this.form.get(FccConstants.STOP_CHEQUE_REASON).updateValueAndValidity();
        }
    });
  }

  onClickStopChequeReason(event) {
    if (event.value) {
      this.form.get(FccConstants.STOP_CHEQUE_REASON).setValue(event.value);
    }
  }

  getUserEntities() {
    this.updateUserEntities();
  }

  setChequeNumOptionsValue() {
    const noOfChequesArray = this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    if(noOfChequesArray && noOfChequesArray !== null && noOfChequesArray.length > 0) {
      if(this.commonService.isNonEmptyValue(noOfChequesArray[0]) && this.mode === FccGlobalConstant.INITIATE) {
        this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS).setValue(noOfChequesArray[0].value);
        this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS).updateValueAndValidity();
        this.onClickNoOfChequesOptions(this.form.get(FccConstants.NO_OF_CHEQUE_OPTIONS));
      }
    }
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
    if ((this.form.get(FccGlobalConstant.ENTITY_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS]).length === 0) {
      this.patchFieldParameters(this.form.get(FccGlobalConstant.ENTITY_TEXT), { options: this.entities });
      this.getEntities(FccGlobalConstant.ENTITY_TEXT);
    }
    this.updateUserAccounts();
    this.setChequeNumOptionsValue();
    this.form.updateValueAndValidity();
  }

  onClickAccountNumber(event) {
    if (event.value) {
      this.form.get(FccConstants.ACCOUNT_NUMBER).setValue(event.value);
      this.form.get(FccConstants.APPLICANT_ACCOUNT_ID).setValue(event.value.id);
      this.form.get('applReference').setValue(event.value.reference);
    }
  }

  updateUserAccounts() {
    const filterValues = {};
    const productTypes = 'product-types';
    const parameter = 'parameter';
    const drCr = 'dr-cr';
    const option = 'option';
    filterValues[productTypes] = 'SE:COCQS';
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
    const account = this.stateService.
      getValue(FccConstants.STOP_CHEQUE_GENERAL_DETAILS, accountType, false);
    const accountLabel = this.accounts.filter(task => task.value.label === account);
    const accountName = this.accounts.filter(task => task.value.name === account);
    if (accountLabel !== undefined && accountLabel !== null && accountLabel.length > 0) {
      this.form.get(accountType).setValue(accountLabel[0].value);
    } else if (accountName !== undefined && accountName !== null && accountName.length > 0) {
      this.form.get(accountType).setValue(accountName[0].value);
    }
  }

  getEntities(entity: any) {
    const entityFormValue = this.form.get(entity).value;
    const entityValue = this.stateService.
      getValue(FccConstants.STOP_CHEQUE_GENERAL_DETAILS, entity, false);
    if (entityValue) {
      const exist = this.entities.filter(task => task.value.label === entityValue);
      if (exist.length > 0) {
        this.form.get(entity).setValue(this.entities.filter(
          task => task.value.label === entityValue)[0].value);
      } else {
        if (this.commonService.isNonEmptyValue(entityFormValue) && entityFormValue !== '') {
          const exists = this.entities.filter(task => task.value.name === entityFormValue);
          if (exists.length > 0) {
            this.form.get(entity).setValue(this.entities.filter(
              task => task.value.name === entityFormValue)[0].value);
          }
        }
      }
      this.entityDataArray.forEach(value => {
        if (entityFormValue.shortName === value.label) {
          this.entityId = value.value;
        }
      });
    }
  }

  allUserAccounts(accountParameters: any): Observable<any> {
    return this.dashboardService.getUserSpecificAccount(accountParameters);
  }

  getUserAccountsByEntityId(accountParameters: any): Observable<any> {
    return this.dashboardService.getUserAccountsByEntityId(this.entityId, accountParameters);
  }

}
