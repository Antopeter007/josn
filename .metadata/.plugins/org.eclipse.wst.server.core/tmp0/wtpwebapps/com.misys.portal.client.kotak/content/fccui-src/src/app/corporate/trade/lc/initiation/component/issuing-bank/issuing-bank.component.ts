import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LcConstant } from '../../../common/model/constant';
import { ProductStateService } from '../../../common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { FormControlService } from '../../services/form-control.service';
import { UtilityService } from '../../services/utility.service';
import { LcProductComponent } from '../lc-product/lc-product.component';
import { BankDetails } from './../../../../../../common/model/bankDetails';
import { References } from './../../../../../../common/model/references';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { ImportLetterOfCreditResponse } from './../../model/importLetterOfCreditResponse';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { LcProductService } from '../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { TabPanelService } from './../../../../../../common/services/tab-panel.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-issuing-bank',
  templateUrl: './issuing-bank.component.html',
  styleUrls: ['./issuing-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: IssuingBankComponent }]
})
export class IssuingBankComponent extends LcProductComponent implements OnInit, OnDestroy {

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
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  entitiesList: any;
  readonly = this.lcConstant.readonly;
  disabled = this.lcConstant.disabled;
  provisionalBankList: Set<string> = new Set<string>();
  lcResponseForm = new ImportLetterOfCreditResponse();
  option;
  tnxTypeCode: any;
  entities = [];
  nameOrAbbvName: any;
  entityChange$: Subscription;
  prevCreateFrom;
  popup: boolean;
  provisionalTagValue: any;

  constructor(protected stateService: ProductStateService, protected emitterService: EventEmitterService,
              protected formControlService: FormControlService, protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected utilityService: UtilityService,
              protected commonService: CommonService, protected multiBankService: MultiBankService,
              protected dropDownAPIservice: DropDownAPIService, protected confirmationService: ConfirmationService,
              protected translateService: TranslateService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService, protected resolverService: ResolverService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef, protected taskService: FccTaskService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected lcProductService: LcProductService,
              protected tabPanelService: TabPanelService
  ) {
    super(emitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
  }

  ngOnInit(): void {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameOrAbbvName = response.TradeIssuingBankNameOrAbbvName;
      }
    });
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const obj = this.parentForm.controls[this.controlName];
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.provisionalTagValue = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('provisionalLCToggle').value;
    this.provisionalBankList = this.commonService.getQueryParametersFromKey('provisionalBankList');
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    if (obj !== null) {
      this.form = obj as FCCFormGroup;
    }
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
      this.setMandatoryField(this.form, 'bankNameList', false);
      this.setMandatoryField(this.form, 'issuerReferenceList', false);
      this.form.get('bankNameList').setErrors(null);
      this.form.get('bankNameList').clearValidators();
      this.form.get('issuerReferenceList').setErrors(null);
      this.form.get('issuerReferenceList').clearValidators();
      this.form.get('issuerReferenceList').updateValueAndValidity();
      this.form.get('bankNameList').updateValueAndValidity();
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION ||
      this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND){
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      const event = {
        value : this.form.get('bankNameList').value
      };
      this.onClickBankNameList(event);
    }
  }


  getCorporateBanks() {
    this.multiBankService.getEntityList().forEach(entity => {
      this.entities.push(entity);
    });
    const valobj = this.dropDownAPIservice.getDropDownFilterValueObj(this.entities, 'applicantEntity',
                  this.stateService.getSectionData(FccGlobalConstant.APPLICANT_BENEFICIARY));
    if (valobj && valobj[FccGlobalConstant.VALUE] && !this.taskService.getTaskEntity()) {
      this.multiBankService.setCurrentEntity(valobj[FccGlobalConstant.VALUE].shortName);
    }
    this.setBankNameList();
    const defaultFirst = (this.corporateBanks && this.corporateBanks.length === 1) ? true : false;
    const val = this.dropDownAPIservice.getInputDropdownValue(this.corporateBanks, 'bankNameList', this.form, defaultFirst);
    this.patchFieldParameters(this.form.get('bankNameList'), { options: this.corporateBanks });
    if (this.mode == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
      const tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
      this.patchFieldParameters(tabSectionControlMap.get(FccGlobalConstant.BANK_DETAILS).get(FccGlobalConstant.BANK_NAME_LIST),
       { options:this.corporateBanks });
      const valObj = { label: String, value: String };
    const valueDisplayed = this.dropDownAPIservice
    .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.BANK_NAME_LIST, this.form);
    valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
     if (valObj) {
     this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
     if(this.stateService.getSectionData(FccGlobalConstant.BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))
     {
       this.stateService.getSectionData(FccGlobalConstant.BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
       .get(FccGlobalConstant.LC_ISSUING_BANK).get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label); } }
      }
    if (val && this.commonService.isnonEMptyString(val)) {
      this.form.get('bankNameList').setValue(val);
    }
    if (this.corporateBanks.length === 1) {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = false;
    }

    const generalDetails = this.stateService.getSectionData('generalDetails');
    const prov = generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.PROVISIONALRENDERED];
    const isAnyBanProv = generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.ISANYPROVBANKAVL];
    if (this.corporateBanks.length === FccGlobalConstant.LENGTH_1 && isAnyBanProv) {
      if(val && this.commonService.isnonEMptyString(val)){
        this.popup = true;
        this.keyDataResponse(val);
        if(this.popup){
          generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE).setValue('N');
          generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.PROVISIONALRENDERED] = false;
          generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.RENDERED] = false;
        }
        if(!this.popup){
          generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.PROVISIONALRENDERED] = true;
          generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.RENDERED] = true;
        }
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE).updateValueAndValidity();
      generalDetails.updateValueAndValidity();
    }
    } else if(this.corporateBanks.length > 1 && !prov && isAnyBanProv) {
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.PROVISIONALRENDERED] = true;
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.RENDERED] = true;
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE).updateValueAndValidity();
      generalDetails.updateValueAndValidity();
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
    }else {
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
      const valueDisplayed = this.dropDownAPIservice.getDropDownFilterValueObj(this.corporateBanks, 'bankNameList', this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
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
      this.popup = true;
      this.keyDataResponse(event.value);
      const generalDetails = this.stateService.getSectionData('generalDetails');

      if (!this.form.get('bankNameList')[this.params][this.disabled]) {
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
        if (this.corporateBanks && this.corporateBanks.length > 1 && taskBank && taskBank.length > 0) {
          this.validateOtherSectionDates(this.form.get('bankNameList')[this.params]['sectionToValidate'],
          taskBank[0].timezone);
        }
        this.setIssuerReferenceList();
    }
    if(this.provisionalTagValue === 'Y' && this.popup ){
      this.chipSelection(event, FccGlobalConstant.PROVISIONAL_MSG);
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE).setValue('N');
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE).updateValueAndValidity();
      generalDetails.updateValueAndValidity();
    }
    else if(this.provisionalTagValue === 'Y'){
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE).setValue('Y');
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE).updateValueAndValidity();
      generalDetails.updateValueAndValidity();
    }
    if(!this.popup){
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.DISABLED] = false;
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE).updateValueAndValidity();
      generalDetails.updateValueAndValidity();
    }
    if(this.popup){
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE)[this.params][FccGlobalConstant.DISABLED] = true;
      generalDetails.get(FccGlobalConstant.PROVISIONAL_TOGGLE).updateValueAndValidity();
      generalDetails.updateValueAndValidity();
    }
  }
  }

  keyDataResponse(value){
    this.commonService.getParamData(FccGlobalConstant.PRODUCT_LC, 'P306').subscribe(response => {
      let index = 0;
      if (this.provisionalBankList) {
        for (const currentNumber of this.provisionalBankList) {
          if(currentNumber === value){
            for (let i = 0; i < response.largeParamDetails.length; i++) {
              if (response.largeParamDetails[i].largeParamKeyDetails !== null) {
                if(response.largeParamDetails[i].largeParamKeyDetails.key_1 === currentNumber){
                  index =i;
                }
              }
            }
            if (response.largeParamDetails[index].largeParamDataList[0].data_2 === 'Y') {
              this.popup = false;
            }
          }
          else if(!this.provisionalBankList.has(value)){
            for (let i = 0; i < response.largeParamDetails.length; i++) {
              if (response.largeParamDetails[i].largeParamKeyDetails !== null
                && response.largeParamDetails[i].largeParamKeyDetails.key_1 === '*') {
              if (response.largeParamDetails[i].largeParamDataList !== null) {
                if (response.largeParamDetails[i].largeParamDataList[0].data_2 === 'Y') {
                  this.popup = false;
                }
              }
            }
            }
          }
      }
    }
    });
  }

  chipSelection(data , message) {
    const presentValue = data[FccGlobalConstant.SOURCE][FccGlobalConstant.VALUE];
    this.prevCreateFrom = this.taskService.taskBank === undefined ? presentValue : this.taskService.taskBank.value;
    const data1 = {
        controlName: 'bankNameList',
        previousValue: this.prevCreateFrom,
        presentValue,
        event: true,
        locaKey: message
      };
      this.commonService.openConfirmationDialog$.next(data1);
  }

  getCorporateReferences() {
    this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: [] });
    this.entityName = this.stateService.getSectionData(FccGlobalConstant.APPLICANT_BENEFICIARY).get('applicantEntity').value.shortName;
    if (this.entityName === '') {
      this.form.get('issuerReferenceList')[this.params][this.disabled] = true;
    } else {
      this.form.get('issuerReferenceList')[this.params][this.disabled] = false;
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
    let val = this.dropDownAPIservice.
                   getInputDropdownValue(this.corporateReferences, 'issuerReferenceList', this.form, isDefaultFirst);
    this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: this.corporateReferences });
    if (this.mode == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
      const tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
      this.patchFieldParameters(tabSectionControlMap.get(FccGlobalConstant.BANK_DETAILS).get(FccGlobalConstant.ISSUER_REFERENCE_LIST),
      { options:this.corporateReferences });
      const valObj = { label: String, value: String };
    const valueDisplayed = this.dropDownAPIservice
    .getDropDownFilterValueObj(this.corporateReferences, FccGlobalConstant.ISSUER_REFERENCE_LIST, this.form);
    if (valueDisplayed !== undefined) {
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
    }
    if (valObj) {
    this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
    if(this.stateService.getSectionData(FccGlobalConstant.BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))
   {
     this.stateService.getSectionData(FccGlobalConstant.BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
     .get(FccGlobalConstant.LC_ISSUING_BANK).get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
    }
  }
      }
    val = this.multiBankService.updateRefonEntityChange && !isDefaultFirst && !val ? '' : val;
    this.form.get('issuerReferenceList').setValue(val);
    if (this.corporateReferences.length === 1) {
      this.form.get('issuerReferenceList')[this.params][this.disabled] = true;
    } else {
      this.form.get('issuerReferenceList')[this.params][this.disabled] = false;
    }
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && this.form.get('issuerReferenceList').value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get('issuerReferenceList'), { amendPersistenceSave: true });
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropDownAPIservice.getDropDownFilterValueObj(this.corporateReferences, 'issuerReferenceList', this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj) {
        this.form.get('issuerReferenceList').setValue(valObj.label);
      }
    }
  }

  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
    if(this.entityChange$) {
      this.entityChange$.unsubscribe();
    }
  }
}
