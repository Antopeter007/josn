import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { LcConstant } from '../../../common/model/constant';
import { ProductStateService } from '../../../common/services/product-state.service';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { FormControlService } from '../../services/form-control.service';
import { LcReturnService } from '../../services/lc-return.service';
import { PrevNextService } from '../../services/prev-next.service';
import { UtilityService } from '../../services/utility.service';
import { AccountDetailsList } from './../../../../../../common/model/accountDetailsList';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../../common/services/form-model.service';
import { LcTemplateService } from './../../../../../../common/services/lc-template.service';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { ImportLetterOfCreditResponse } from './../../model/importLetterOfCreditResponse';
import { LcProductComponent } from './../lc-product/lc-product.component';
import { LcProductService } from '../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { DashboardService } from './../../../../../../common/services/dashboard.service';
@Component({
  selector: 'fcc-instructions-to-bank',
  templateUrl: './instructions-to-bank.component.html',
  styleUrls: ['./instructions-to-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: InstructionsToBankComponent }]
})
export class InstructionsToBankComponent extends LcProductComponent implements OnInit, OnDestroy {
  form: FCCFormGroup;
  module = `${this.translateService.instant('bankInstructions')}`;
  subheader = '';
  lcConstant = new LcConstant();
  accounts = [];
  // summaryDetails: any;
  entityName: any;
  entityNameRendered: any;
  accountDetailsList: AccountDetailsList;
  entitiesList: any;
  lcResponseForm = new ImportLetterOfCreditResponse();
  rendered = this.lcConstant.rendered;
  params = this.lcConstant.params;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  barLength: any;
  tnxTypeCode: any;
  phrasesResponseForInstToBank: any;
  displayValue: string;
  finalTextValue = '';
  entityNameForPhrases: any;
  responseData: string;
  filterParams;
  isMasterRequired: any;
  sectionName = 'bankInstructions';
  isStaticAccountEnabled: boolean;
  swiftZCharRegex: string;
  mode;
  modeValue;

  constructor(
    protected translateService: TranslateService,
    protected router: Router,
    protected lcReturnService: LcReturnService,
    protected leftSectionService: LeftSectionService,
    protected utilityService: UtilityService,
    protected corporateCommonService: CorporateCommonService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected prevNextService: PrevNextService,
    protected lcTemplateService: LcTemplateService,
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected commonService: CommonService,
    protected emitterService: EventEmitterService,
    protected stateService: ProductStateService,
    protected searchLayoutService: SearchLayoutService,
    protected phrasesService: PhrasesService,
    protected amendCommonService: AmendCommonService,
    protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected resolverService: ResolverService,
    protected fileList: FilelistService,
    protected dialogRef: DynamicDialogRef,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected lcProductService: LcProductService,
    protected dashboardService: DashboardService
  ) {
    super(emitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
  }

  ngOnInit() {
    super.ngOnInit();
    window.scroll(0, 0);
    this.isMasterRequired = this.isMasterRequired;
    this.modeValue = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.mode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    if (this.mode !== null && this.mode !== undefined && this.mode !== '' && (typeof this.mode === 'object')) {
      this.mode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value[0].value;
    }
    this.operation = this.commonService.getQueryParametersFromKey (FccGlobalConstant.OPERATION);
    this.initializeFormGroup();
    this.iterateControls(FccGlobalConstant.APPLICANT_BENEFICIARY,
    this.stateService.getSectionData(FccGlobalConstant.APPLICANT_BENEFICIARY));

    if (this.context === 'readonly') {
      this.readOnlyMode();
    }

    this.patchLayoutForReadOnlyMode();
    this.updateNarrativeCount();

    if (this.modeValue === FccGlobalConstant.DRAFT_OPTION ) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }

  updateNarrativeCount() {
    if (this.form.get('otherInst').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('otherInst').value);
      this.form.get('otherInst')[this.params][this.enteredCharCount] = count;
    }
  }

  updateBankValue() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    const principalAct = this.stateService.getValue(FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY, 'principalAct', false);
    const feeAct = this.stateService.getValue(FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY, 'feeAct', false);
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
  }

  validateFeeAndPrincipalAct(accountDetails : any) {
    let isPrincpalAct = false;
    let isFeeAct = false;
    const principalAct = this.stateService.getValue(FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY, 'principalAct', false);
    const feeAct = this.stateService.getValue(FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY, 'feeAct', false);
    accountDetails.items.forEach((value:any) => {
      if(this.commonService.isnonEMptyString(principalAct) && principalAct === value.number){
        isPrincpalAct = true;
      }
      });
    if(!isPrincpalAct)
    {
      this.form.get('principalAct').setValue('');
    }
    accountDetails.items.forEach((value:any) => {
      if(this.commonService.isnonEMptyString(feeAct) && feeAct === value.number){
        isFeeAct = true;
      }
      });
    if(!isFeeAct)
    {
      this.form.get('feeAct').setValue('');
    }
  }

  patchLayoutForReadOnlyMode() {
    if ( this.form.getFormMode() === 'view') {

      const controls = Object.keys(this.form.controls);
      let index: any;
      for (index = 0; index < controls.length; index++) {
        this.viewModeChange(this.form, controls[index]);
      }
    }
  }

    readOnlyMode() {
      this.lcReturnService.allLcRecords.subscribe(data => {
        this.lcResponseForm = data;
        this.patchFieldValueAndParameters(this.form.get('otherInst'), this.lcResponseForm.narrative.otherInformation,
        { readonly: true });

        this.updateValue();
      });
      this.form.get('previous')[this.params][this.rendered] = false;
      this.form.get('next')[this.params][this.rendered] = false;
      this.form.setFormMode('view');
    }

  amendFormFields() {
    if ((this.mode !== FccGlobalConstant.VIEW_MODE && this.operation !== FccGlobalConstant.PREVIEW) ||
      (this.mode === FccGlobalConstant.VIEW_MODE && this.operation === FccGlobalConstant.LIST_INQUIRY)) {
    this.amendCommonService.setValueFromMasterToPrevious(this.sectionName);
    }
  }

  initializeFormGroup() {
    this.form = this.stateService.getSectionData(this.sectionName, undefined, this.isMasterRequired);
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get('otherInst')[this.params][FccGlobalConstant.PHRASE_ENABLED] = true;
    } else {
      this.form.get('otherInst')[this.params][FccGlobalConstant.PHRASE_ENABLED] = false;
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }

  ngOnDestroy() {
    this.stateService.setStateSection(
      FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY,
      this.form, this.isMasterRequired
    );
  }

  getAccounts() {
    const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.isStaticAccountEnabled = this.commonService.getIsStaticAccountEnabled();
    if (this.isStaticAccountEnabled) {

      this.corporateCommonService.getStaticAccounts(this.fccGlobalConstantService.getStaticDataLimit(), productCode)
        .subscribe(response => {
            this.updateAccounts(response.body);
        });
    } else {
      this.commonService.getUserProfileAccount(productCode, this.entityName).subscribe(
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
    this.updateValue();
    this.updateBankValue();
    this.validateFeeAndPrincipalAct(body);

    if(this.form.get('feeAct')[this.params].required ){
      let feeActOptions = this.getUpdatedAccounts();
      if(feeActOptions){
        feeActOptions = feeActOptions.filter((item) =>item.label !== "");
         this.patchFieldParameters(this.form.get('feeAct'), { options: feeActOptions });
      }
    }
      if (this.form.get('principalAct')[this.params].required){
        let principalActoptnion = this.getUpdatedAccounts();
      if(principalActoptnion){
        principalActoptnion = principalActoptnion.filter((item) =>item.label !== "");
        this.patchFieldParameters(this.form.get('principalAct'), { options: principalActoptnion });
       }
      }  
  }

  iterateControls(title, mapValue) {
    let value;
    if (mapValue !== undefined) {
    Object.keys(mapValue).forEach((key, index) => {
      if (index === 0) {
        value = mapValue.controls;
        this.iterateFields(title, value);
      }
    });
} else {
  this.getAccounts();
}
  }

  iterateFields(title, myvalue) {
    Object.keys(myvalue).forEach((key) => {
        if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
          if ( myvalue[key].key === 'applicantEntity') {
            this.entityName = myvalue[key].value;
            this.entityNameRendered = myvalue[key].params.rendered;
          }
        } else {
          if (myvalue[key].type === 'input-dropdown-filter') {
            if ( myvalue[key].key === 'applicantEntity') {
              this.entityName = myvalue[key].value.shortName;
              this.entityNameRendered = myvalue[key].params.rendered;
              this.entitiesList = myvalue[key].options.length;
            }
          }
        }
    });
    this.getAccounts();
  }

  updateValue() {
    if (this.lcResponseForm.bankInstructions !== undefined && this.context === 'readonly') {
      let exists = this.accounts.filter(
        task => task.label === this.lcResponseForm.bankInstructions.principalAccount.number);
      if (exists.length > 0) {
      this.form.get('principalAct').setValue(this.accounts.filter(
          task => task.label === this.lcResponseForm.bankInstructions.principalAccount.number)[0].value);
        }
      this.patchFieldParameters(this.form.get('principalAct'), { readonly: true });
      exists = this.accounts.filter(
        task => task.label === this.lcResponseForm.bankInstructions.feeAccount.number);
      if (exists.length > 0) {
      this.form.get('feeAct').setValue(this.accounts.filter(
       task => task.label === this.lcResponseForm.bankInstructions.feeAccount.number)[0].value);
      }
      this.patchFieldParameters(this.form.get('feeAct'), { readonly: true });
     }
     const exist1 = this.accounts.filter(task => task.label === this.form.get('feeAct').value.label);
    if(this.form.get('feeAct').value && exist1 !== null && exist1.length > 0){
      this.patchFieldValueAndParameters(this.form.get('feeAct'),this.accounts.filter(
        task => task.label === this.form.get('feeAct').value.label)[0].value, {});
     }
     const exist2 = this.accounts.filter(task => task.label === this.form.get('principalAct').value.label);
     if(this.form.get('principalAct').value && exist2 !== null && exist2.length > 0){
      this.patchFieldValueAndParameters(this.form.get('principalAct'),this.accounts.filter(
        task => task.label === this.form.get('principalAct').value.label)[0].value, {});
     }
  } 

  updateAmendBankValue() {
    const principalAct = this.stateService.getValue(FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY, 'principalAct', true);
    const feeAct = this.stateService.getValue(FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY, 'feeAct', true);
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
    this.updateValue();
    return this.accounts;
  }


  onClickPhraseIcon(event, key) {
    this.entityNameForPhrases = this.stateService.getSectionData(FccGlobalConstant.APPLICANT_BENEFICIARY)
    .get('applicantEntity').value.shortName;
    if (this.entityNameForPhrases !== '' && this.entityNameForPhrases !== undefined) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LC, key, '12', true, this.entityName);
    } else {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_LC, key, '12', true);
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

}

