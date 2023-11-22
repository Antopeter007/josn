import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { ResolverService } from '../../../../../common/services/resolver.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { AccountDetailsList } from './../../../../../common/model/accountDetailsList';
import { BankDetails } from './../../../../../common/model/bankDetails';
import { References } from './../../../../../common/model/references';
import { CommonService } from './../../../../../common/services/common.service';
import { DropDownAPIService } from './../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { MultiBankService } from './../../../../../common/services/multi-bank.service';
import { PhrasesService } from './../../../../../common/services/phrases.service';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { CorporateCommonService } from './../../../../../corporate/common/services/common.service';
import { EcProductComponent } from './../ec-product/ec-product.component';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { AmendCommonService } from './../../../../common/services/amend-common.service';
import { EcProductService } from '../../services/ec-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { DashboardService } from './../../../../../common/services/dashboard.service';
import { TabPanelService } from './../../../../../common/services/tab-panel.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ec-remitting-bank',
  templateUrl: './ec-remitting-bank.component.html',
  styleUrls: ['./ec-remitting-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EcRemittingBankComponent }]
})
export class EcRemittingBankComponent extends EcProductComponent implements OnInit {

  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  form: FCCFormGroup;
  module = '';
  bankDetails: BankDetails;
  corporateBanks = [];
  corporateReferences = [];
  references: References;
  entityName: any;
  entitiesList: any;
  productCode: any;
  accounts = [];
  accountDetailsList: AccountDetailsList;
  entityNameRendered: any;
  phrasesResponse: any;
  otherInst = 'otherInst';
  tnxTypeCode: any;
  option: any;
  params = 'params';
  enteredCharCount = 'enteredCharCount';
  disabled = 'disabled';
  mode: any;
  selectedEntity;
  nameOrAbbvName: any;
  isStaticAccountEnabled: boolean;
  entityChange$: Subscription;
  constructor(protected commonService: CommonService, protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected stateService: ProductStateService,
              protected eventEmitterService: EventEmitterService, protected translateService: TranslateService,
              protected searchLayoutService: SearchLayoutService, protected elementRef: ElementRef,
              protected phrasesService: PhrasesService, protected multiBankService: MultiBankService,
              protected dropdownAPIService: DropDownAPIService, protected resolverService: ResolverService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected utilityService: UtilityService, protected taskService: FccTaskService,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected amendCommonService: AmendCommonService, protected ecProductService: EcProductService,
              protected dashboardService: DashboardService, protected tabPanelService: TabPanelService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, ecProductService);
  }

  ngOnInit(): void {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameOrAbbvName = response.TradeIssuingBankNameOrAbbvName;
      }
    });
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
      this.form = obj as FCCFormGroup;
    }

    this.initializeFormGroup();
    this.iterateControls(FccGlobalConstant.DRAWER_DRAWEE, this.stateService.getSectionData(FccGlobalConstant.DRAWER_DRAWEE));
    this.getCorporateBanks();
    this.getCorporateReferences();
    if (!this.commonService.isUpdateRefSubScribed)
    {
      this.multiBankService.myUpdateRefonEntityChangeSub = this.multiBankService.updateRefonEntityChangeSub.subscribe(
        data => {
          if (data) {
            this.commonService.isUpdateRefSubScribed = true;
            this.getCorporateBanks();
            this.getCorporateReferences();
          }
        }
      );
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.removeMandatoryForTemplate(['bankNameList', 'issuerReferenceList']);
      this.form.get('bankNameList').setErrors(null);
      this.form.get('bankNameList').clearValidators();
      this.form.get('issuerReferenceList').setErrors(null);
      this.form.get('issuerReferenceList').clearValidators();
      this.form.get('issuerReferenceList').updateValueAndValidity();
    }
    if (this.option === FccGlobalConstant.EXISTING) {
      this.form.get('issuerReferenceList').setValue(FccGlobalConstant.EMPTY_STRING);
      this.form.get('issuerReferenceList').setErrors({ required: false });
      this.form.get('issuerReferenceList').clearValidators();
    }
    this.updateNarrativeCount();
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      this.amendCommonService.compareTransactionAndMasterForAmend(productCode);
    }
  }

  updateNarrativeCount() {
    if (this.form.get('otherInst').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('otherInst').value);
      this.form.get('otherInst')[this.params][this.enteredCharCount] = count;
    }
  }

  initializeFormGroup() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
      this.commonService.formatForm(this.form);
    }
  }

  amendFormFields() {
    this.amendCommonService.setValueFromMasterToPrevious('ecbankDetails');
  }
  getCorporateBanks() {
    if (this.stateService.getSectionData(FccGlobalConstant.DRAWER_DRAWEE).get('drawerEntity').value.shortName !== undefined){
      this.selectedEntity =
      this.stateService.getSectionData(FccGlobalConstant.DRAWER_DRAWEE).get('drawerEntity').value.shortName;
    } else {
      this.selectedEntity = this.stateService.getSectionData(FccGlobalConstant.DRAWER_DRAWEE).get('drawerEntity').value;
    }
    if (typeof this.selectedEntity === 'object'){
      this.selectedEntity = this.selectedEntity.shortName;
    }
    this.multiBankService.setCurrentEntity(this.selectedEntity);
    this.setBankNameList();
    const defaultFirst = (this.corporateBanks && this.corporateBanks.length === 1) ? true : false;
    const val = this.dropdownAPIService.getInputDropdownValue(this.corporateBanks, 'bankNameList', this.form, defaultFirst);
    this.patchFieldParameters(this.form.get('bankNameList'), { options: this.corporateBanks });
    if (val && this.commonService.isnonEMptyString(val)) {
      this.form.get('bankNameList').setValue(val);
    }
    if (this.mode == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
      const tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
      this.patchFieldParameters(tabSectionControlMap.get(FccGlobalConstant.EC_BANK_DETAILS).get(FccGlobalConstant.BANK_NAME_LIST),
      { options:this.corporateBanks });
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropdownAPIService
      .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.BANK_NAME_LIST, this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
       if (valObj) {
       this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
       if(this.stateService.getSectionData(FccGlobalConstant.EC_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))
       {
         this.stateService.getSectionData(FccGlobalConstant.EC_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
         .get(FccGlobalConstant.REMITTING_BANK).get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
        }
      }
      }
    if (this.corporateBanks.length === 1) {
      this.form.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    } else {
      this.form.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
    }
    if (val && this.commonService.isnonEMptyString(val)) {
      this.multiBankService.setCurrentBank(val);
    }
    if (this.taskService.getTaskBank()){
      if (this.corporateBanks && this.corporateBanks.length === 1) {
        this.form.get('bankNameList').setValue(this.taskService.getTaskBank().value);
        this.multiBankService.setCurrentBank(this.taskService.getTaskBank().value);
      } else if (this.corporateBanks && this.corporateBanks.length > 1
         && val && this.commonService.isnonEMptyString(val)) {
        const filteredBank = this.corporateBanks.filter(rec=>rec.value === val);
        if (filteredBank && filteredBank.length > 0){
          this.taskService.setTaskBank(filteredBank[0]);
          this.form.get('bankNameList').setValue(this.taskService.getTaskBank().value);
          this.multiBankService.setCurrentBank(this.taskService.getTaskBank().value);
        }
      }
    } else {
      // Creating issue in case of multibank customer. So checking multibank and if not setting first as default
       if (val && this.commonService.isnonEMptyString(val)) {
        const filteredBank = this.corporateBanks.filter(rec=>rec.value === val);
        if (filteredBank && filteredBank.length > 0){
          this.taskService.setTaskBank(filteredBank[0]);
        } else if (this.corporateBanks && this.corporateBanks.length === 1){
          this.taskService.setTaskBank(this.corporateBanks[0]);
        }
      } else if (this.corporateBanks && this.corporateBanks.length === 1){
        this.taskService.setTaskBank(this.corporateBanks[0]);
      }
    }
    if (this.commonService.getUserDateTimezone() &&
      this.commonService.getUserDateTimezone().getValue() &&
      this.commonService.getUserDateTimezone().getValue() !== this.taskService.getTaskBank()?.timezone) {
      this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    } else {
      this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && this.form.get('bankNameList').value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get('bankNameList'), { amendPersistenceSave: true });
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropdownAPIService.getDropDownFilterValueObj(this.corporateBanks, 'bankNameList', this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      const bankNameAmmend = this.form.get(FccGlobalConstant.BANK_NAME_LIST).value;
      this.form.get(FccGlobalConstant.BANK_NAME_AMMEND).setValue(bankNameAmmend);
      if (valObj) {
        this.form.get('bankNameList').setValue(valObj.label);
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
    if (event && event.value)
    {
      this.multiBankService.setCurrentBank(event.value);
      const taskBank = this.corporateBanks.filter((item) => item.value === event.value);
      this.taskService.setTaskBank(taskBank[0]);
      if (this.commonService.getUserDateTimezone() && taskBank && taskBank.length > 0 &&
          this.commonService.getUserDateTimezone().getValue() &&
          this.commonService.getUserDateTimezone().getValue() !== taskBank[0].timezone) {
          this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        } else {
          this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        if (this.corporateBanks && this.corporateBanks.length > 1) {
          this.validateOtherSectionDates(this.form.get('bankNameList')[this.params]['sectionToValidate'],
          taskBank[0].timezone);
        }
      this.setIssuerReferenceList();
    }
  }

  getCorporateReferences() {
    this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: [] });
    this.entityName = this.stateService.getSectionData(FccGlobalConstant.DRAWER_DRAWEE).get('drawerEntity').value ?
    this.stateService.getSectionData(FccGlobalConstant.DRAWER_DRAWEE).get('drawerEntity').value :
    this.stateService.getSectionData(FccGlobalConstant.DRAWER_DRAWEE).get('drawerEntity').value.shortName;
    if (this.entityName !== undefined && this.entityName !== null && this.entityName !== '') {
      this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
    } else {
       this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
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
    let val = this.dropdownAPIService
                  .getInputDropdownValue(this.corporateReferences, 'issuerReferenceList', this.form, isDefaultFirst);
    this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: this.corporateReferences });
    val = this.multiBankService.updateRefonEntityChange && !isDefaultFirst ? '' : val;
    this.form.get('issuerReferenceList').setValue(val);
    if (this.mode == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
      const tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
      this.patchFieldParameters(tabSectionControlMap.get(FccGlobalConstant.EC_BANK_DETAILS).get(FccGlobalConstant.BANK_NAME_LIST),
      { options:this.corporateReferences });
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropdownAPIService
      .getDropDownFilterValueObj(this.corporateReferences, FccGlobalConstant.BANK_NAME_LIST, this.form);
       valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
       if (valObj && this.commonService.isnonEMptyString(valObj.label)) {
         this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
         if(this.stateService.getSectionData(FccGlobalConstant.EC_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))
         {
           this.stateService.getSectionData(FccGlobalConstant.EC_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
           .get(FccGlobalConstant.REMITTING_BANK).get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
          }
        }
      }
      if (this.corporateReferences.length === 1) {
        this.form.get('issuerReferenceList')[this.params][this.disabled] = true;
      } else {
        this.form.get('issuerReferenceList')[this.params][this.disabled] = false;
      }
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && this.form.get('issuerReferenceList').value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get('issuerReferenceList'), { amendPersistenceSave: true });
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropdownAPIService.getDropDownFilterValueObj(this.corporateReferences, 'issuerReferenceList', this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj) {
        this.form.get('issuerReferenceList').setValue(valObj.label);
      }
    }
  }

  updateBankValue() {
    if ((this.form.get('principalAct') && this.form.get('principalAct').value) ||
        (this.form.get('feeAct') && this.form.get('feeAct').value)) {
      const principalAct = this.form.get('principalAct').value;
      const feeAct = this.form.get('feeAct').value;
      let exists = this.accounts.filter(
              task => task.label === principalAct);
      if (exists.length > 0) {
            this.form.get('principalAct').setValue(this.accounts.filter(
                task => task.label === principalAct)[0].value);
              }
      exists = this.accounts.filter(
              task => task.label === feeAct);
      if (exists.length > 0) {
            this.form.get('feeAct').setValue(this.accounts.filter(
              task => task.label === feeAct)[0].value);
        }
    }
    const exist1 = this.accounts.filter(task => task.label === this.form.get('feeAct').value.label);
    if(this.form.get(FccGlobalConstant.FEE_ACT).value && exist1 !== null && exist1.length > 0){
      this.patchFieldValueAndParameters(this.form.get('feeAct'),this.accounts.filter(
        task => task.label === this.form.get('feeAct').value.label)[0].value, {});
      }
     const exist2 = this.accounts.filter(task => task.label === this.form.get('principalAct').value.label);
     if(this.form.get(FccGlobalConstant.PRINCIPAL_ACT).value && exist2 !== null && exist2.length > 0){
      this.patchFieldValueAndParameters(this.form.get('principalAct'),this.accounts.filter(
        task => task.label === this.form.get('principalAct').value.label)[0].value, {});
      }
  }

  getAccounts() {
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.isStaticAccountEnabled = this.commonService.getIsStaticAccountEnabled();
    if (this.isStaticAccountEnabled) {
      this.corporateCommonService.getStaticAccounts(this.fccGlobalConstantService.getStaticDataLimit(), this.productCode)
      .subscribe(response => {
        this.updateAccounts(response.body);
      });
    } else {
      this.commonService.getUserProfileAccount(this.productCode, this.entityName).subscribe(
        accountsResponse => {
          this.updateAccounts(accountsResponse);
        });
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
            this.accounts.push(empty);
            emptyCheck = false;
          }
          const account = this.commonService.getUpdatedAccount(value);
          this.accounts.push(account);
        }
      });
      this.patchFieldParameters(this.form.get('principalAct'), { options: this.getUpdatedAccounts() });
      this.patchFieldParameters(this.form.get('feeAct'), { options: this.getUpdatedAccounts() });

    } else if (this.entityNameRendered !== undefined) {
      this.patchUpdatedAccounts(emptyCheck);
    } else {
      this.patchUpdatedAccounts(emptyCheck);
    }
    if (this.entityName === undefined && this.entitiesList > 1) {
      this.patchFieldParameters(this.form.get('principalAct'), { options: [] });
      this.patchFieldParameters(this.form.get('feeAct'), { options: [] });
    }
    this.updateBankValue();
  }

  iterateControls(title, mapValue) {
    let value;
    if (mapValue !== undefined) {
      Object.keys(mapValue).forEach((key, index) => {
        if (index === 0) {
          value = mapValue.controls;
          this.iterateFields(value);
        }
      });
    } else {
      this.getAccounts();
    }
  }

  iterateFields(myvalue) {
    Object.keys(myvalue).forEach((key) => {
      if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
        if ( myvalue[key].key === 'drawerEntity') {
          this.entityName = myvalue[key].value;
          this.entityNameRendered = myvalue[key].params.rendered;
        }
      } else {
      if (myvalue[key].type === 'input-dropdown-filter' && myvalue[key].key === 'drawerEntity') {
        this.entityName = myvalue[key].value.shortName;
        this.entityNameRendered = myvalue[key].params.rendered;
        this.entitiesList = myvalue[key].options.length;
       }
      }
    });
    this.getAccounts();
  }

  updateAmendBankValue() {
    const principalAct = this.stateService.getValue(FccGlobalConstant.EC_BANK_DETAILS, 'principalAct', true);
    const feeAct = this.stateService.getValue(FccGlobalConstant.EC_BANK_DETAILS, 'feeAct', true);
    let exists = this.accounts.filter(
          task => task.label === principalAct);
    if (exists.length > 0) {
        this.form.get('principalAct').setValue(this.accounts.filter(
            task => task.label === principalAct)[0].value);
          }
    exists = this.accounts.filter(
          task => task.label === feeAct);
    if (exists.length > 0) {
        this.form.get('feeAct').setValue(this.accounts.filter(
         task => task.label === feeAct)[0].value);
        }
  }

  getUpdatedAccounts(): any[] {
    return this.accounts;
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_EC, key);
  }

  removeMandatoryForTemplate(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  patchUpdatedAccounts(emptyCheck) {
    this.accountDetailsList.items.forEach(value => {
      if (emptyCheck) {
        const empty = this.commonService.getEmptyAccount();
        this.accounts.push(empty);
        emptyCheck = false;
      }
      const account = this.commonService.getUpdatedAccount(value);
      if (this.accountDetailsList.items && this.accountDetailsList.items.length !== this.accounts.length - 1) {
        this.accounts.push(account);
      }
    });
    this.patchFieldParameters(this.form.get(FccGlobalConstant.PRINCIPAL_ACT), { options: this.getUpdatedAccounts() });
    this.patchFieldParameters(this.form.get(FccGlobalConstant.FEE_ACT), { options: this.getUpdatedAccounts() });
  }

  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
    if(this.entityChange$) {
      this.entityChange$.unsubscribe();
    }
  }

}
