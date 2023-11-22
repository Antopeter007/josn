import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { HOST_COMPONENT } from '../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FCCBase } from '../../../base/model/fcc-base';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';
import { ProductMappingService } from '../../services/productMapping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { DropDownAPIService } from '../../services/dropdownAPI.service';
import { DashboardService } from '../../services/dashboard.service';
import { FccConstants } from '../../core/fcc-constants';
import { FccBusinessConstantsService } from '../../core/fcc-business-constants.service';
import { MessageService } from 'primeng/api';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import moment from 'moment';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  providers: [
    { provide: HOST_COMPONENT, useExisting: AccountDetailsComponent }
  ]
})
export class AccountDetailsComponent extends FCCBase implements OnInit {

  form: FCCFormGroup;
  module = '';
  mode;
  detailsResponse;
  subscriptions: Subscription[] = [];
  apiModel;
  operation;
  option;
  useOnChange = true;
  accountTypeOptions = [];
  accountNumberSelectionNoteTxt : string;
  accountDetailsData : any;
  startPeriodDate: any;
  endPeriodDate: any;
  showStartPeriod: any;
  showEndPeriod: any;
  entityReq: any;
  accountOwnerType: any;
  userAccountBalance;
  hasStatementPermission : boolean = false;
  customStartDate: any;
  customEndDate: any;
  thresholdSearchPeriod: number;
  longerPeriodStartDate: any;
  longerPeriodEndDate: any;
  applicationDate: any;
  accountNumber: any;
  entityResponse: any;
  toastPosition = 'top-left';
  visible = false;
  position = 'top-left';
  requestAccountStatementSuccessMessage: any;
  requestAccountStatementSimilarMessage1: any;
  requestAccountStatementSimilarMessage2: any;
  successRequest = false;
  similarRequest = false;
  downloadCenter = 'downloadCenter';
  download = 'accountStatementDownload';
  makeNewRequest = 'makeNewRequest';
  selectedFormat: any;
  selectedEntity: any;
  dir = localStorage.getItem('langDir');
  contextPath: any;
  selectFormatOptions = [];
  longerPeriodValue: any;
  periodOptions = [];
  statementAttachmentId;
  statementFileName;
  statementStatus;
  preparingFile = false;
  requestAccountStatementprepdownloadMessage1: any;
  requestAccountStatementprepdownloadMessage2: any;
  dateRangePeriod: any;

  constructor(protected commonService: CommonService, protected formControlService: FormControlService,
    protected translateService: TranslateService, protected productMappingService: ProductMappingService,
    protected router: Router,protected titleCasePipe:TitleCasePipe, protected dropdownAPIService: DropDownAPIService,
    protected datePipe: DatePipe, protected dashboardService: DashboardService, protected activatedRoute: ActivatedRoute,
    public translate: TranslateService, protected messageService: MessageService,
    protected fccGlobalConstantService: FccGlobalConstantService) {
      super();
     }

  ngOnInit(): void {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.isStepperDisabled = true;
    this.accountDetailsData = this.commonService.getAccountDetailsData();
    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P851,
      FccGlobalConstant.ACCOUNT_STATEMENT_SYNC, null).subscribe(
      (response) => {
        if (this.commonService.isNonEmptyValue(response) &&
          this.commonService.isNonEmptyValue(response.paramDataList) && response.paramDataList[0] &&
          response.paramDataList[0][FccGlobalConstant.DATA_4]) {
          this.dateRangePeriod = response.paramDataList[0][FccGlobalConstant.DATA_4];
          sessionStorage.setItem('thresholdSearchPeriod', this.dateRangePeriod);
          this.thresholdSearchPeriod = parseInt(this.dateRangePeriod);
        }
      }
    );
    this.translate.get('corporatechannels').subscribe(() => {
      this.commonService.getUserPermission('').subscribe(() => {
        this.hasStatementPermission = this.commonService.getUserPermissionFlag(FccGlobalConstant.ACCOUNT_STATEMENT_ACCESS);
        this.initializeFormGroup();
      });
    });
  }

  initializeFormGroup() {
    const params = this.getFormModelParams();
    this.activatedRoute.queryParams.subscribe(params => {
      this.commonService.putQueryParameters(FccGlobalConstant.OPERATION,params[FccGlobalConstant.OPERATION]);
      this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
      this.commonService.putQueryParameters(FccGlobalConstant.OPTION,params[FccGlobalConstant.OPTION]);
      this.option =this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    });
    if(this.operation === FccGlobalConstant.ACCOUNT_DETAILS){
      this.commonService.getProductModel(params).subscribe(
        response => {
          const formData = response['accountDetails'];
          this.form = this.formControlService.getFormControls(formData);
          this.getAccountTypeList();

      });
      this.subscriptions.push(this.productMappingService.getApiModel('accountDetails', undefined, undefined, undefined, undefined,
        'ACCOUNTS', undefined).subscribe(apiMappingModel => {
          this.apiModel = apiMappingModel;
        }));
    } else if (this.operation === FccGlobalConstant.ACCOUNT_STATEMENT) {
      if(this.hasStatementPermission){
        const params = {
          type: 'FORM',
          productCode: 'accountStatement',
          option: 'ACCOUNTS'
        };
        this.commonService.getProductModel(params).subscribe(
          response => {
            const formData = response['accountStatement'];
            this.form = this.formControlService.getFormControls(formData);
            const params = { 'screenType' : FccGlobalConstant.ACCOUNT_STATEMENT };
            this.getAccountTypeList(params);
        });
        this.populateStatementPeriod(FccGlobalConstant.ACCOUNT_STATEMENT_SYNC, 'statementPeriod');
        this.subscriptions.push(this.productMappingService.getApiModel('accountStatement', undefined, undefined, undefined, undefined,
        'ACCOUNTS', undefined).subscribe(apiMappingModel => {
          this.apiModel = apiMappingModel;
          if(this.commonService.isEmptyValue(this.form.get('accountNumber').value.value)){
            this.form.get('statementTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            this.form.get('statementLongerPeriodToggle')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
          } else {
            this.form.get('statementTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.form.get('statementLongerPeriodToggle')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
            this.prepareInputdata();
          }
        }));
      } else {
        this.router.navigate(['/error']);
      }
    }
    this.form.get('btnDownloadStatementLongerPeriod')['params']['rendered'] = false;

  }

  getFormModelParams(){
    return {
      type: 'FORM',
      productCode: 'accountDetails',
      option: 'ACCOUNTS'
    };
  }

  updateDropdown(key, dropdownList) {
    if (key === 'accountNumber') {
      const accountNumberList = [];
      dropdownList.forEach(element => {
        const paymentPackage: { label: string, value: any } = {
          label: element.number,
            value : {
              label: element.number,
              value: element.number,
              shortName: element.id,
              currency: element.currency,
              accountContext: element.accountContext,
              type : element.type
            }
        };
        accountNumberList.push(paymentPackage);
      });
      this.patchFieldParameters(this.form.get(key), { options: accountNumberList });
    }
  }

  onChangeaccountNumber(){
    this.form.get('accountNumberSelectionNote')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    const accountId = this.form.get('accountNumber').value.shortName;
    const req = { accountId : accountId };
            this.subscriptions.push(this.commonService.getAccountDetails(req).subscribe(response => {
              this.detailsResponse = response;
              this.commonService.timeStampToday$.next(response.bankDateTime);
              this.accountOwnerType = this.detailsResponse.ownerType;
              const resetFieldsList = Object.keys(this.form.controls).filter(key =>
                key !== 'accountType' && key !== 'accountNumber' && key !== 'statementLongerPeriodToggle' &&
                key !== 'statementLongerPeriod' && key !== 'statementLongerPeriodFormat'
              );
              this.resetRenderOnlyFields(this.form,resetFieldsList);
              this.setRenderOnlyFields(this.form, true);
              this.productMappingService.setFormValues(this.form, response, this.apiModel);
              Object.keys(this.form.controls).forEach(key => {
                if(this.form.get(key)[FccGlobalConstant.PARAMS] &&
                    this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.DYNAMIC_CRITERIA]){
                  const dynamicCriteria = this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.DYNAMIC_CRITERIA];
                  if(dynamicCriteria.dependControl && dynamicCriteria.requiredValues &&
                      dynamicCriteria.requiredValues.includes(this.form.get(dynamicCriteria.dependControl).value)){
                    this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
                  } else {
                    this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
                  }
                  if(dynamicCriteria.hideIfEmpty && this.commonService.isEmptyValue(this.form.get(key).value)){
                    this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
                  } else if(dynamicCriteria.hideIfEmpty !== undefined && this.commonService.isNonEmptyValue(this.form.get(key).value)) {
                    this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
                  }
                }
                if(key.toLowerCase().indexOf('amount') !== -1 &&
                    this.commonService.isNonEmptyValue(this.form.get(key).value)){
                  this.form.get(key).setValue(this.commonService.getCurrencySymbolForDownloads(
                    this.form.get('accountCurrency').value, this.form.get(key).value));
                }
                if(key.toLowerCase().indexOf('rate') !== -1 &&
                    this.commonService.isNonEmptyValue(this.form.get(key).value)){
                  this.form.get(key).setValue(this.form.get(key).value + FccGlobalConstant.PERCENT);
                }
                if(key !== undefined && key === 'status'){
                  const status = this.titleCasePipe.transform(this.form.get('status').value);
                  this.form.get('status').setValue(status);
                }
                if(this.commonService.isEmptyValue(this.form.get(key).value)) {
                  this.form.get(key).setValue(FccGlobalConstant.SAMPLE_COMMENT);
                }
              });
              //call balance API for Statement
              if(this.operation === FccGlobalConstant.ACCOUNT_STATEMENT){
                this.dashboardService.getUserAccountBalance(accountId).subscribe(data => {
                  this.userAccountBalance = data;
                  if(this.commonService.isnonEMptyString(data.ledgerBalance)){
                    this.form.get('ledgerBalance')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
                    this.form.get('ledgerBalance').setValue(this.commonService.getCurrencySymbolForDownloads(
                      this.form.get('accountCurrency').value, data.ledgerBalance));
                  }
                  if(this.commonService.isnonEMptyString(data.availableBalance)){
                    this.form.get('availableBalance')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
                    this.form.get('availableBalance').setValue(this.commonService.getCurrencySymbolForDownloads(
                      this.form.get('accountCurrency').value, data.availableBalance));
                  }
                    this.prepareInputdata();
                });
              }
              this.setEntityDetails(response);
              this.form.updateValueAndValidity();
              if(this.operation === FccGlobalConstant.ACCOUNT_STATEMENT){
                if(this.commonService.isEmptyValue(this.form.get('accountNumber').value.value)){
                  this.form.get('statementTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
                } else {
                  if(this.form.get('statementLongerPeriodToggle').value === FccBusinessConstantsService.YES){
                    this.onClickStatementLongerPeriodToggle();
                  } else {
                    this.form.get('statementTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
                    this.prepareInputdata();
                  }
                }
              }

    }));
    if (this.longerPeriodValue === FccBusinessConstantsService.YES){
      this.renderLongerPeriodStatementDownload();
      }
    this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.form.updateValueAndValidity();
  }

  getAccountTypeList(params?){
    const request = { language : localStorage.getItem('language') };
    this.commonService.getAccountTypeList(request, params).subscribe(accountTypes => {
      if(accountTypes && accountTypes.items){
        this.accountTypeOptions = [];
        this.accountTypeOptions = accountTypes.items.map(item =>
            ({ 'label' : item.description ,
                    'value' : {
                      'label' : item.description,
                      'value' : item.type,
                      'ownerType' : item.ownerType,
                      'shortName' : item.type+item.ownerType
                    }
                  })
        );
        if (this.accountTypeOptions && this.accountTypeOptions.length && this.accountTypeOptions.length > 1) {
          this.accountTypeOptions.unshift(FccGlobalConstant.ALL_ACCOUNTS_OBJ);
        }
        this.patchFieldParameters(this.form.get('accountType'), { options: this.accountTypeOptions });
        if(this.commonService.isNonEmptyValue(this.accountDetailsData)){
          const accountTypeCode = this.accountDetailsData.account_type_code + this.accountDetailsData.owner_type;
          this.form.get('accountType').setValue(accountTypeCode);
          this.patchDropdownValue('accountType');
          this.onChangeaccountType();
        }
      }
    });
  }

  onChangeaccountType(){
    if(this.commonService.isNonEmptyValue(this.form.get('accountType')) &&
      this.commonService.isnonEMptyString(this.form.get('accountType').value)){
        this.form.get('accountNumber').setValue('');
        this.accountNumberSelectionNoteTxt = `${this.translateService.instant('accountNumberSelectionNoteTxt')}`;
        this.form.get('accountNumberSelectionNote').setValue(this.accountNumberSelectionNoteTxt);
        this.form.get('accountNumberSelectionNote')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        const params = {};
        if(this.operation === FccGlobalConstant.ACCOUNT_STATEMENT){
          params['screenType'] = FccGlobalConstant.ACCOUNT_STATEMENT;
        }
        if(this.commonService.isnonEMptyString(this.form.get('accountType').value.value)){
          params['accountType'] = this.form.get('accountType').value.value;
        }
        if(this.commonService.isnonEMptyString(this.form.get('accountType').value.ownerType)){
          params['ownerType'] = this.form.get('accountType').value.ownerType;
        } else {
          params['ownerType'] = null;
        }
        this.subscriptions.push(this.commonService.getAccounts(params)
        .subscribe((response) => {
          if (response && response[FccGlobalConstant.ITEMS]) {
              this.updateDropdown('accountNumber',response[FccGlobalConstant.ITEMS]);
              if(this.commonService.isNonEmptyValue(this.accountDetailsData)
                  && this.form.get('accountType').value.value === this.accountDetailsData.account_type_code){
                    this.form.get('accountNumber').setValue(this.accountDetailsData.account_id);
                    this.patchDropdownValue('accountNumber');
                    this.onChangeaccountNumber();
                    this.accountDetailsData = null;
              }
          }
        }));
        this.form.get(FccGlobalConstant.ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.setRenderOnlyFields(this.form, false);
    }
  }

  setRenderOnlyFields(form, flag) {
    Object.keys(form.controls).forEach((id) => this.setRenderOnly(form, id, flag));
    if(this.operation === FccGlobalConstant.ACCOUNT_STATEMENT){
      if(this.form.get('accountNumber').value) {
        this.form.get('statementPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.populateStatementPeriod(FccGlobalConstant.ACCOUNT_STATEMENT_SYNC, 'statementPeriod');
        this.form.get('statementLongerPeriodToggle')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
      this.form.get('accountStatementText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }else{
      this.form.get('accountDetailsText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }

  }

  setRenderOnly(form, id, flag) {
    if(form.controls[id][FccGlobalConstant.TYPE] === FccGlobalConstant.VIEW_MODE_TYPE
        || form.controls[id][FccGlobalConstant.TYPE] === FccGlobalConstant.TEXT){
      this.patchFieldParameters(form.controls[id], { rendered: flag });
    }
  }

  onClickBtnAccountSummary(){
    this.router.navigateByUrl('/dashboard/accSummary?option=' +this.option);
  }

  setEntityDetails(response){
      if(this.commonService.isNonEmptyValue(response.entity) && response.entity.length === 1){
        this.form.get(FccGlobalConstant.LINKED_ENTITY_DETAILS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.ENTITY_SHORT_NAME).setValue(response.entity[0].entityShortName);
        this.form.get(FccGlobalConstant.ENTITY_NAME).setValue(response.entity[0].entityName);
        this.form.get(FccGlobalConstant.ENTITY_SHORT_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.ENTITY_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else if (this.commonService.isNonEmptyValue(response.entity) && response.entity.length > 1){
        this.form.get(FccGlobalConstant.ENTITY_SHORT_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.ENTITY_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.LINKED_ENTITY_DETAILS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = response.entity;
        this.form.get(FccGlobalConstant.ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.LIST_DATA] = true;
        this.form.get(FccGlobalConstant.ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.hasActions] = false;
      } else {
        this.form.get(FccGlobalConstant.LINKED_ENTITY_DETAILS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.ENTITY_SHORT_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.ENTITY_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.entityResponse = response.entity;
  }

  patchDropdownValue(key) {
    if (this.form.get(key).value !== FccGlobalConstant.EMPTY_STRING) {
      const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.form.controls[key]['options'], key, this.form);
      if (valObj) {
        this.form.get(key).patchValue(valObj[`value`]);
      }
    }
  }

  resetRenderOnlyFields(form, ids: string[]) {
    ids.forEach((id) => this.resetRenderOnly(form, id));
  }

  resetRenderOnly(form, id) {
    this.resetValue(form, id, null);
    form.get(id).markAsUntouched();
    form.get(id).markAsPristine();
  }

  prepareInputdata(){
    const filterParams = {
      account_type : this.form.get('accountType').value.value,
      account_no : this.form.get('accountNumber').value.value,
      account_id : this.form.get('accountNumber').value.shortName,
      create_date : this.startPeriodDate,
      create_date2 : this.endPeriodDate,
      operation : 'LIST_STATEMENTS'
    };
    const requestObj = {};
    if(this.accountOwnerType === FccConstants.EXTERNAL_ACCOUNT_OWNER_TYPE){
      requestObj['listdefName'] = FccConstants.ACCOUNT_STATEMENT_EXTERNAL_LISTDEF;
    } else{
      requestObj['listdefName'] = FccConstants.ACCOUNT_STATEMENT_LISTDEF;
    }
    requestObj['showFilterSection'] = 'false';
    requestObj['listpaginatordefName'] = 'true';
    requestObj['downloadIconEnabled'] = true;
    requestObj['colFilterIconEnabled'] = 'false';
    requestObj['passBackEnabled'] = 'false';
    requestObj['columnSort'] = true;
    requestObj['productCode'] = 'accountStatement';
    requestObj['filterParamsRequired'] = 'false';
    requestObj['filterParam'] = filterParams;
    requestObj['filterChipsRequired'] = 'false';
    requestObj['enableListDataDownload'] = true;
    requestObj['wildsearch'] = 'false';
    requestObj['tableName'] = this.translateService.instant('statementPeriodMsg',
    { accountNo: this.form.get('accountNumber').value.value,
      startDate: this.showStartPeriod,
      endDate: this.showEndPeriod });
    requestObj['formData'] = this.detailsResponse;
    requestObj['userAccountBalance'] = this.userAccountBalance;
    requestObj['startPeriodDate'] = this.startPeriodDate;
    requestObj['endPeriodDate'] = this.endPeriodDate;
    this.commonService.listdefInputParams.next(requestObj);
  }

  getStatementPeriod(period){
    if (this.form) {
      this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.updateValueAndValidity();
    }
    if(period === 'DATERANGE') {
      this.customEndDate = null;
      this.customStartDate = null;
    }
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    const last15thday = new Date();
    switch(period){
      case 'CURRENTDAY':
        startDate = endDate = today;
        break;
      case 'PREVIOUSDAY':
        today.setDate(today.getDate() - 1);
        startDate = endDate = today;
        break;
      case 'LAST15DAYS':
        last15thday.setDate(last15thday.getDate() - 14);
        startDate = last15thday;
        endDate = today;
        break;
      case 'CURRENTMONTH':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date();
        break;
      case 'PREVIOUSMONTH':
        startDate = new Date(today.getFullYear(), today.getMonth()-1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'DATERANGE':
        this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        this.customEndDate = this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.MAX_DATE];
        this.customStartDate = this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.MIN_DATE];
        this.form.updateValueAndValidity();
        return;
    }
    this.startPeriodDate = this.datePipe.transform(startDate,'dd/MM/yyyy');
    this.endPeriodDate = this.datePipe.transform(endDate,'dd/MM/yyyy');
    this.showStartPeriod = this.datePipe.transform(startDate,'dd MMM yyyy');
    this.showEndPeriod = this.datePipe.transform(endDate,'dd MMM yyyy');
    if(this.commonService.isEmptyValue(this.form.get('accountNumber').value.value)){
      this.form.get('statementTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    } else {
      this.form.get('statementTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.prepareInputdata();
    }
  }

  onClickStatementPeriod(){
    this.getStatementPeriod(this.form.get('statementPeriod').value.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChangeStartDate(event, key) {
    if(event && event.target.value && event.target.value._d) {
      this.form.get(key).markAsTouched();
      this.customStartDate = event.target.value._d;
      let difference = 0;
      if(this.customEndDate && this.customStartDate) {
        difference = (this.customEndDate.setHours(0,0,0,0) - this.customStartDate.setHours(0,0,0,0))/(1000*24*3600);
      }
      this.startPeriodDate = this.datePipe.transform(event.target.value._d,'dd/MM/yyyy');
      this.showStartPeriod = this.datePipe.transform(event.target.value._d,'dd MMM yyyy');
      if(this.customStartDate.setHours(0,0,0,0) >=
      this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.MIN_DATE].setHours(0,0,0,0) &&
        this.customEndDate.setHours(0,0,0,0) <=
        this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAX_DATE].setHours(0,0,0,0) &&
        this.customStartDate.setHours(0,0,0,0) <= this.customEndDate.setHours(0,0,0,0) &&
        typeof difference === 'number' && difference <= this.thresholdSearchPeriod) {
        this.prepareInputdata();
        this.form.get(key).setErrors(null);

      } else if (this.customEndDate >
        this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAX_DATE]) {
        const errMsg = this.translate.instant('endDaterangeError',
        { selectedDate:  moment(this.customEndDate).format(sessionStorage.getItem('dateRangeFormat')),
          todayDate: moment(new Date()).format(sessionStorage.getItem('dateRangeFormat')) });
        this.form.get(key).setErrors({ endDaterangeError: errMsg });
      } else if (difference && difference > this.thresholdSearchPeriod) {
        const errMsg = this.translate.instant('rangeError',
        { startDate: moment(this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.MIN_DATE])
          .format(sessionStorage.getItem('dateRangeFormat')) });
        this.form.get(key).setErrors({ rangeError: errMsg });
      } else if (this.customStartDate > this.customEndDate) {
        const errMsg = this.translate.instant('startDaterangeError',
        { endDate:  moment(this.customEndDate).format(sessionStorage.getItem('dateRangeFormat')),
          startDate: moment(this.customStartDate).format(sessionStorage.getItem('dateRangeFormat')) });
          this.form.get(key).setErrors({ startDaterangeError: errMsg });
      } else if (this.customStartDate <
        this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.MIN_DATE]) {
        this.form.get(key).setErrors({ invalidDates: true });
      }
    } else if (event && event.target.value === null && !event.targetElement.value) {
      this.form.get(key).setErrors(null);
    } else {
      const errMsg = this.translate.instant('dateFormatError',
      { format:  sessionStorage.getItem('dateRangeFormat') });
      this.form.get(key).setErrors({ dateFormatError: errMsg });
    }
    if (this.longerPeriodValue === FccBusinessConstantsService.YES){
      this.renderLongerPeriodStatementDownload();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChangeEndDate(event, key) {
    if(event && event.target.value && event.target.value._d) {
      this.customEndDate = event.target.value._d;
      let difference = 0;
      if (this.customEndDate && this.customStartDate) {
        difference = (this.customEndDate.setHours(0,0,0,0) - this.customStartDate.setHours(0,0,0,0))/(1000*24*3600);
      }
      this.endPeriodDate = this.datePipe.transform(event.target.value._d,'dd/MM/yyyy');
      this.showEndPeriod = this.datePipe.transform(event.target.value._d,'dd MMM yyyy');
      if (this.customStartDate.setHours(0,0,0,0) >=
        this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.MIN_DATE].setHours(0,0,0,0) &&
        this.customEndDate.setHours(0,0,0,0) <=
        this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAX_DATE].setHours(0,0,0,0) &&
        this.customStartDate.setHours(0,0,0,0) <= this.customEndDate.setHours(0,0,0,0) &&
        typeof difference === 'number' && difference <= this.thresholdSearchPeriod) {
        this.prepareInputdata();
        this.form.get(key).setErrors(null);

      } else if (this.customEndDate >
        this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAX_DATE]) {
        const errMsg = this.translate.instant('endDaterangeError',
        { selectedDate:  moment(this.customEndDate).format(sessionStorage.getItem('dateRangeFormat')),
          todayDate: moment(new Date()).format(sessionStorage.getItem('dateRangeFormat')) });
        this.form.get(key).setErrors({ endDaterangeError: errMsg });
      } else if (difference && difference > this.thresholdSearchPeriod) {
        const errMsg = this.translate.instant('rangeError',
        { startDate: moment(this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.MIN_DATE])
          .format(sessionStorage.getItem('dateRangeFormat')) });
        this.form.get(key).setErrors({ rangeError: errMsg });
      } else if (this.customStartDate > this.customEndDate) {
        const errMsg = this.translate.instant('startDaterangeError',
        { endDate:  moment(this.customEndDate).format(sessionStorage.getItem('dateRangeFormat')),
          startDate: moment(this.customStartDate).format(sessionStorage.getItem('dateRangeFormat')) });
          this.form.get(key).setErrors({ startDaterangeError: errMsg });
      } else if (this.customStartDate <
        this.form.get(key)[FccGlobalConstant.PARAMS][FccGlobalConstant.MIN_DATE]) {
        this.form.get(key).setErrors({ invalidDates: true });
      }
    } else if (event && event.target.value === null && !event.targetElement.value) {
      this.form.get(key).setErrors(null);
    } else {
      const errMsg = this.translate.instant('dateFormatError',
      { format:  sessionStorage.getItem('dateRangeFormat') });
      this.form.get(key).setErrors({ dateFormatError: errMsg });
    }
    if (this.longerPeriodValue === FccBusinessConstantsService.YES){
      this.renderLongerPeriodStatementDownload();
    }
  }

  onClickStatementLongerPeriodToggle(){
    this.longerPeriodValue = this.form.get('statementLongerPeriodToggle').value;
    if (this.longerPeriodValue === FccBusinessConstantsService.YES){
      this.form.get('statementPeriod')['params']['rendered'] = false;
      this.form.get('statementTable')['params']['rendered'] = false;
      this.form.get('statementLongerPeriod')['params']['rendered'] = true;
      this.form.get('statementLongerPeriodFormat')['params']['rendered'] = true;
      this.populateStatementPeriod(FccGlobalConstant.ACCOUNT_STATEMENT_ASYNC, 'statementLongerPeriod');
      this.onClickStatementLongerPeriod();
      this.populateStatementLongerPeriodDownloadFormat();
      this.renderLongerPeriodStatementDownload();
      this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.updateValueAndValidity();
    } else {
      this.form.get('statementPeriod')['params']['rendered'] = true;
      this.form.get('statementLongerPeriod')['params']['rendered'] = false;
      this.form.get('statementLongerPeriodFormat')['params']['rendered'] = false;
      this.form.get('btnDownloadStatementLongerPeriod')['params']['rendered'] = false;
      this.populateStatementPeriod(FccGlobalConstant.ACCOUNT_STATEMENT_SYNC, 'statementPeriod');
      this.onClickStatementPeriod();
      if(this.operation === FccGlobalConstant.ACCOUNT_STATEMENT){
        if(this.commonService.isEmptyValue(this.form.get('accountNumber').value.value)){
          this.form.get('statementTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        } else {
          this.form.get('statementTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          this.prepareInputdata();
        }
      }
      this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.updateValueAndValidity();
    }
  }

  onClickBtnDownloadStatementLongerPeriod(){
    const selectedPeriod = this.form.get('statementLongerPeriod').value.value;
    this.prepareStatementDataLongerPeriod(selectedPeriod);
  }

  onClickStatementLongerPeriod(){
    const selectedPeriod = this.form.get('statementLongerPeriod').value.value;
    if(selectedPeriod === 'DATERANGE'){
      this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.updateValueAndValidity();
    } else {
      this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('statementDateRangePicker')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.customEndDate = null;
      this.customStartDate = null;
      this.form.updateValueAndValidity();
    }
    this.renderLongerPeriodStatementDownload();
  }

  prepareStatementDataLongerPeriod(period: any){
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    const last6thmonthday = new Date();
    const lastYearDay = new Date();
    let startDateArr = [];
    let endDateArr = [];
    switch(period){
      case 'LAST6MONTHS':
        last6thmonthday.setDate(last6thmonthday.getDate() - 182);
        startDate = last6thmonthday;
        endDate = today;
        break;
      case 'LAST1YEAR':
        lastYearDay.setDate(lastYearDay.getDate() - 365);
        startDate = lastYearDay;
        endDate = today;
        break;
      case 'CURRENTFINANCIALYEAR':
        startDateArr = this.form.get('statementLongerPeriod').value.startDateArr;
        endDateArr = this.form.get('statementLongerPeriod').value.endDateArr;
        if((today.getMonth()+1) >= startDateArr[1]){
          startDate = new Date(startDateArr[1] + '/' + startDateArr[0] + '/' + today.getFullYear());
        } else {
          startDate = new Date(startDateArr[1] + '/' + startDateArr[0] + '/' + (today.getFullYear()-1));
        }
        endDate = today;
        break;
      case 'LASTFINANCIALYEAR':
        startDateArr = this.form.get('statementLongerPeriod').value.startDateArr;
        endDateArr = this.form.get('statementLongerPeriod').value.endDateArr;
        if((today.getMonth()+1) >= startDateArr[1]){
          startDate = new Date(startDateArr[1] + '/' + startDateArr[0] + '/' +(today.getFullYear()-1));
          endDate = new Date(endDateArr[1] + '/' + endDateArr[0] + '/' + today.getFullYear());
        } else {
          startDate = new Date(startDateArr[1] + '/' + startDateArr[0] + '/' +(today.getFullYear()-2));
          endDate = new Date(endDateArr[1] + '/' + endDateArr[0] + '/' + (today.getFullYear()-1));
        }
        break;
      case 'DATERANGE':
        startDate = this.customStartDate;
        endDate = this.customEndDate;
    }
    this.longerPeriodStartDate = this.datePipe.transform(startDate,'dd/MM/yyyy');
    this.longerPeriodEndDate = this.datePipe.transform(endDate,'dd/MM/yyyy');
    this.applicationDate = this.datePipe.transform(today,'dd/MM/yyyy');
    this.selectedFormat = this.form.get('statementLongerPeriodFormat').value;
    if(this.commonService.isEmptyValue(this.form.get('accountNumber').value.value)){
      return;
    } else {
      this.accountNumber = this.form.get('accountNumber').value.value;
    }
    this.selectedEntity = this.entityResponse?this.entityResponse[0].entityShortName: '';
    this.requestAccountStatement('N');
  }

  onClickMakeNewRequest(){
    this.requestAccountStatement('Y');
  }


  requestAccountStatement(typeOfRequestData: any){
    const request = {
      statement_start_date: this.longerPeriodStartDate,
      statement_end_date: this.longerPeriodEndDate,
      appl_date: this.applicationDate,
      entity: this.selectedEntity,
      modeOfDownload: this.selectedFormat.trim(),
      accountNumber: this.accountNumber,
      typeOfRequest: typeOfRequestData
    };
    this.commonService.requestAccountStatement(request).subscribe(
      res => {
        if(this.commonService.isnonEMptyString(res.ref_id)){
          this.requestAccountStatementSuccessMessage = `${this.translateService.instant('requestAccountStatementSuccess',
          { statementName: res.statement_file_name })}`;
          this.similarRequest = false;
          this.successRequest = true;
        } else if(this.commonService.isnonEMptyString(res.similarRecordMessage)){
          this.similarRequest = true;
          this.successRequest = false;
          this.statementAttachmentId = res.statement_attachment_id;
          this.statementFileName = res.statement_file_name;
          this.statementStatus = res.statement_upload_status;
          if(this.statementStatus === FccGlobalConstant.ZERO_STRING){
            this.preparingFile = true;
            this.requestAccountStatementprepdownloadMessage1 = `${this.translateService.instant(
                'requestAccountStatementprepdownloadMessage1', { statementName: res.statement_file_name })}`;
            this.requestAccountStatementprepdownloadMessage2 = `${this.translateService.instant(
              'requestAccountStatementprepdownloadMessage2')}`;
          } else {
            this.preparingFile = false;
            this.requestAccountStatementSimilarMessage1 = `${this.translateService.instant('requestAccountSimilarRecordExists1',
            { statementName: res.statement_file_name })}`;
            this.requestAccountStatementSimilarMessage2 = `${this.translateService.instant('requestAccountSimilarRecordExists2')}`;
          }
        }
      }
    );
  }

  onChangeStatementLongerPeriodFormat(){
    this.renderLongerPeriodStatementDownload();
  }

  populateStatementLongerPeriodDownloadFormat(){
    this.selectFormatOptions = [];
    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P851,
      FccGlobalConstant.ACCOUNT_STATEMENT_PRODUCT_CODE, null).subscribe(
      (response) => {
        if (this.commonService.isNonEmptyValue(response) &&
          this.commonService.isNonEmptyValue(response.paramDataList) && response.paramDataList[0] &&
          response.paramDataList[0][FccGlobalConstant.DATA_1]) {
          const selectOptions = response.paramDataList[0][FccGlobalConstant.DATA_1].split(',');
          selectOptions.forEach(element => {
            const format: { label: string, value: any } = {
              label: element,
                value : element
            };
            this.selectFormatOptions.push(format);
          });
          this.form.get('statementLongerPeriodFormat')['params']['options'] = this.selectFormatOptions;
          this.form.get('statementLongerPeriodFormat').setValue(this.selectFormatOptions[0].value);
          this.renderLongerPeriodStatementDownload();
        }
      }
    );
  }

  populateStatementPeriod(parameter: any, fieldName: any){
    this.periodOptions = [];
    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P851,
      parameter, null).subscribe(
      (response) => {
        if (this.commonService.isNonEmptyValue(response) &&
          this.commonService.isNonEmptyValue(response.paramDataList) && response.paramDataList[0] &&
          response.paramDataList[0][FccGlobalConstant.DATA_1]) {
          const selectOptions = response.paramDataList[0][FccGlobalConstant.DATA_1].split(',');
          const startDateArr = response.paramDataList[0][FccGlobalConstant.DATA_2].split(',');
          const endDateArr = response.paramDataList[0][FccGlobalConstant.DATA_3].split(',');
          this.dateRangePeriod = response.paramDataList[0][FccGlobalConstant.DATA_4];
          const defaultPeriod = response.paramDataList[0][FccGlobalConstant.DATA_5];
          sessionStorage.setItem('thresholdSearchPeriod', this.dateRangePeriod);
          this.thresholdSearchPeriod = parseInt(this.dateRangePeriod);
          this.periodOptions = [];
          selectOptions.forEach(element => {
            const format: { label: string, value: any } = {
              label: `${this.translateService.instant(element.trim())}`,
              value : {
                label: `${this.translateService.instant(element.trim())}`,
                value : element.trim(),
                startDateArr: startDateArr,
                endDateArr: endDateArr
              }
            };
            this.periodOptions.push(format);
          });
          this.form.get(fieldName)['params']['options'] = this.periodOptions;
          this.form.get(fieldName).setValue( this.periodOptions.filter(
            task => task.label === `${this.translateService.instant(defaultPeriod)}`)[0].value);
          const today = new Date();
          const thresholdDate = new Date();
          const maxDate = thresholdDate.setDate(today.getDate() - this.thresholdSearchPeriod);
          const disableMinDate = this.form.get('statementDateRangePicker')['params']['disableMinDate'];
          const enableMaxDate = this.form.get('statementDateRangePicker')['params']['enableMaxDate'];
          this.form.get('statementDateRangePicker')['params']['minDate'] = (disableMinDate !== undefined && disableMinDate) ?
              new Date(maxDate) : new Date();
          this.form.get('statementDateRangePicker')['params']['maxDate'] = (enableMaxDate !== undefined && enableMaxDate) ?
              new Date() : null;
          this.form.updateValueAndValidity();
          if (this.longerPeriodValue === FccBusinessConstantsService.YES){
            this.renderLongerPeriodStatementDownload();
          } else {
            this.onClickStatementPeriod();
          }
        }
      }
    );
  }

  renderLongerPeriodStatementDownload(){
    const accountNumber = this.form.get('accountNumber').value.value;
    const selectedPeriod = this.form.get('statementLongerPeriod').value.value;
    const statementFormat = this.form.get('statementLongerPeriodFormat').getRawValue();
    if(selectedPeriod === 'DATERANGE'){
       if(this.commonService.isnonEMptyString(accountNumber) && this.commonService.isnonEMptyString(statementFormat)
       && this.commonService.isnonEMptyString(this.customStartDate) && this.commonService.isnonEMptyString(this.customEndDate)){
        this.form.get('btnDownloadStatementLongerPeriod')['params']['rendered'] = true;
       } else {
        this.form.get('btnDownloadStatementLongerPeriod')['params']['rendered'] = false;
       }
    } else {
      if(this.commonService.isnonEMptyString(accountNumber) && this.commonService.isnonEMptyString(statementFormat)
       && this.commonService.isnonEMptyString(selectedPeriod)){
        this.form.get('btnDownloadStatementLongerPeriod')['params']['rendered'] = true;
       } else {
        this.form.get('btnDownloadStatementLongerPeriod')['params']['rendered'] = false;
       }
    }


  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event:
    KeyboardEvent) {
    this.similarRequest = false;
    this.successRequest = false;
  }

  onClickAccountStatementDownload() {
    const id = this.statementAttachmentId;
    const fileName = this.statementFileName;
    this.commonService.downloadAttachments(id).subscribe(
      response => {
        let fileType;
        if (response.type) {
          fileType = response.type;
        } else {
          fileType = 'application/octet-stream';
        }
        const newBlob = new Blob([response.body], { type: fileType });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob, fileName);
            return;
        }

        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = fileName;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        window.URL.revokeObjectURL(data);
        link.remove();
    });
  }
}
