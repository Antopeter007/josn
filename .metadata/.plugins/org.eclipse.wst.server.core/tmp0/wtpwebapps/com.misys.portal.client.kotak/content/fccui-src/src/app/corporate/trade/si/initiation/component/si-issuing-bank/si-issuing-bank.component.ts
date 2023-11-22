import { Component, Input, OnInit } from '@angular/core';
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
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { BankDetails } from './../../../../../../common/model/bankDetails';
import { References } from './../../../../../../common/model/references';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { UtilityService } from './../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { TabPanelService } from './../../../../../../common/services/tab-panel.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-si-issuing-bank',
  templateUrl: './si-issuing-bank.component.html',
  styleUrls: ['./si-issuing-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiIssuingBankComponent }]
})
export class SiIssuingBankComponent extends SiProductComponent implements OnInit {

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
  option;
  tnxTypeCode: any;
  provisionalTagValue: any;
  selectedEntity;
  provisionalBankList: Set<string> = new Set<string>();
  provisionalBankMap: Map<string, any> = new Map();
  selectEntityBank: Set<any> = new Set<any>();
  finalSetofBank = [];
  readonly value = 'value';
  entities = [];
  mode: any;
  nameOrAbbvName: any;
  entityChange$: Subscription;
  prevCreateFrom;
  popup: boolean;

  private entityBankMap: Map<string, IssuingDropdown[]> = new Map();
  constructor(protected stateService: ProductStateService, protected emitterService: EventEmitterService,
              protected formControlService: FormControlService, protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected utilityService: UtilityService,
              protected commonService: CommonService, protected multiBankService: MultiBankService,
              protected dropDownAPIservice: DropDownAPIService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected resolverService: ResolverService, protected translateService: TranslateService,
              protected tabPanelService: TabPanelService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef, protected taskService: FccTaskService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected siProductService: SiProductService
  ) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, siProductService);
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
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    if (obj !== null) {
      this.form = obj as FCCFormGroup;
    }
    this.provisionalTagValue = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('provisionalLCToggle').value;
    this.provisionalBankList = this.commonService.getQueryParametersFromKey('provisionalBankList');
    this.provisionalBankMap = this.commonService.getQueryParametersFromKey('provisionalBankMap');
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND &&
      this.stateService.getSectionData('siApplicantBeneficiaryDetails').get('applicantEntity') &&
      this.stateService.getSectionData('siApplicantBeneficiaryDetails').get('applicantEntity').value &&
      this.stateService.getSectionData('siApplicantBeneficiaryDetails').get('applicantEntity').value !==
      FccGlobalConstant.BLANK_SPACE_STRING ) {
        this.selectedEntity = this.stateService.getSectionData('siApplicantBeneficiaryDetails').get('applicantEntity').value;
    } else {
        this.selectedEntity = this.stateService.getSectionData('siApplicantBeneficiaryDetails').get('applicantEntity').value;
      }
    if (typeof this.selectedEntity === 'object'){
      this.selectedEntity = this.selectedEntity.shortName;
     }
    this.provisionalCheck();
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
      this.setMandatoryField(this.form, FccGlobalConstant.BANK_NAME_LIST, false);
      this.setMandatoryField(this.form, FccGlobalConstant.ISSUER_REFERENCE_LIST, false);
      this.form.get(FccGlobalConstant.BANK_NAME_LIST).setErrors(null);
      this.form.get(FccGlobalConstant.BANK_NAME_LIST).clearValidators();
      this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setErrors(null);
      this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST).clearValidators();
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION ||
      this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND){
      const event = {
        value : this.form.get('bankNameList').value
      };
      this.onClickBankNameList(event);
    }
  }
  provisionalCheck() {

    if (this.provisionalTagValue === 'Y' && !this.provisionalBankMap.has('*') && this.selectedEntity !== undefined)
 {

 this.entityBankMap = this.multiBankService.getEntityBankMap();
 const value = this.entityBankMap.get( this.selectedEntity);

 value.forEach(element => {
       this.selectEntityBank.add(element);
     });

 this.selectEntityBank.forEach(element => {
     if (this.provisionalBankMap.has(element[this.value])) {
     this.finalSetofBank.push(element);
     }
     });

//  this.corporateBanks.forEach(element => {
//       if (this.provisionalBankList.has(element.value) ) {
//         this.finalSetofBank.push(element);
//       }

//      });
//  this.corporateBanks = [];
 this.corporateBanks = this.finalSetofBank;

 } else if (this.provisionalTagValue === 'Y' && !this.provisionalBankMap.has('*') && this.selectedEntity === undefined) {

   this.corporateBanks.forEach(element => {
      if (this.provisionalBankMap.has(element.value) ) {
        this.finalSetofBank.push(element);
      }

     });
   this.corporateBanks = [];
   this.corporateBanks = this.finalSetofBank;

 }

  }

  getCorporateBanks() {
      this.multiBankService.getEntityList().forEach(entity => {
        this.entities.push(entity);
      });
      const valobj = this.dropDownAPIservice.getDropDownFilterValueObj(this.entities, 'applicantEntity',
                  this.stateService.getSectionData(FccGlobalConstant.SI_APPLICANT_BENEFICIARY));
      if (valobj && valobj[FccGlobalConstant.VALUE] && !this.taskService.getTaskEntity()) {
        this.multiBankService.setCurrentEntity(valobj[FccGlobalConstant.VALUE].shortName);
    }
    this.setBankNameList();
    const defaultFirst = (this.corporateBanks && this.corporateBanks.length === 1) ? true : false;
    const val = this.dropDownAPIservice.getInputDropdownValue(this.corporateBanks,
      FccGlobalConstant.BANK_NAME_LIST, this.form, defaultFirst);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.BANK_NAME_LIST), { options: this.corporateBanks });
    if (val && this.commonService.isnonEMptyString(val)) {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(val);
    }
    if (this.mode == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
      const tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
      this.patchFieldParameters(tabSectionControlMap.get(FccGlobalConstant.SI_BANK_DETAILS).get(FccGlobalConstant.BANK_NAME_LIST),
      { options:this.corporateBanks });
      const valObj = { label: String, value: String };
    const valueDisplayed = this.dropDownAPIservice
    .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.BANK_NAME_LIST, this.form);
    valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
     if (valObj) {
     this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
     if(this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))
     {
       this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
       .get(FccGlobalConstant.SI_ISSUING_BANK).get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label); } }
      }
    if (this.corporateBanks.length === 1) {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = false;
    }

    const generalDetails = this.stateService.getSectionData('siGeneralDetails');
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
      this.multiBankService.setCurrentBank(val, this.selectedEntity);
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
        // this.taskService.setTaskBank(this.corporateBanks[0]);
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
      && this.form.get(FccGlobalConstant.BANK_NAME_LIST).value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get(FccGlobalConstant.BANK_NAME_LIST), { amendPersistenceSave: true });
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropDownAPIservice.getDropDownFilterValueObj(this.corporateBanks,
        FccGlobalConstant.BANK_NAME_LIST, this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj) {
        this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
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
      this.multiBankService.setCurrentBank(event.value , this.selectedEntity);
      const taskBank = this.corporateBanks.filter((item) => item.value === event.value);
      this.taskService.setTaskBank(taskBank[0]);
      const generalDetails = this.stateService.getSectionData('siGeneralDetails');
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
      if (!this.form.get('bankNameList')[this.params][this.disabled]) {
        this.setIssuerReferenceList();
      }
    }
  }
  keyDataResponse(value){
    this.commonService.getParamData(FccGlobalConstant.PRODUCT_SI, 'P306').subscribe(response => {
      let index = 0;
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
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST), { options: [] });
    this.entityName = this.stateService.getSectionData(FccGlobalConstant.SI_APPLICANT_BENEFICIARY).get('applicantEntity').value.shortName;
    if (this.entityName === '') {
      this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST)[this.params][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST)[this.params][this.disabled] = false;
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
    let val = this.dropDownAPIservice.getInputDropdownValue(this.corporateReferences, FccGlobalConstant.ISSUER_REFERENCE_LIST, this.form,
      isDefaultFirst);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST), { options: this.corporateReferences });
    val = this.multiBankService.updateRefonEntityChange && !isDefaultFirst && !val ? '' : val;
    this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(val);
    if (this.mode == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY) {
      const tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
      this.patchFieldParameters(tabSectionControlMap.get(FccGlobalConstant.SI_BANK_DETAILS).get(FccGlobalConstant.ISSUER_REFERENCE_LIST),
      { options:this.corporateReferences });
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropDownAPIservice
      .getDropDownFilterValueObj(this.corporateReferences, FccGlobalConstant.ISSUER_REFERENCE_LIST, this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj && valObj.label) {
        this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
      if(this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE))
     {
       this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS, undefined, false, FccGlobalConstant.EVENT_STATE)
       .get(FccGlobalConstant.SI_ISSUING_BANK).get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
      }
    }
      }
    if (this.corporateReferences.length === 1) {
      this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST)[this.params][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST)[this.params][this.disabled] = false;
    }
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST).value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST), { amendPersistenceSave: true });
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropDownAPIservice.getDropDownFilterValueObj(this.corporateReferences,
        FccGlobalConstant.ISSUER_REFERENCE_LIST, this.form);
      valObj.label = valueDisplayed[FccGlobalConstant.LABEL];
      if (valObj) {
        this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
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

export interface IssuingDropdown {
  label: string;
  value: string;
}
