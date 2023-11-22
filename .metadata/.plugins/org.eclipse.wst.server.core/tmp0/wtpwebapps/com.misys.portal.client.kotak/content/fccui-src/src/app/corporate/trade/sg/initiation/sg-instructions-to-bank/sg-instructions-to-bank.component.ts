import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { AccountDetailsList } from '../../../../../common/model/accountDetailsList';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { PhrasesService } from '../../../../../common/services/phrases.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { ImportLetterOfCreditResponse } from '../../../lc/initiation/model/models';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { SgProductService } from '../../services/sg-product.service';
import { SgProductComponent } from '../../sg-product/sg-product.component';
import { CorporateCommonService } from './../../../../../corporate/common/services/common.service';
import { DashboardService } from '../../../../../common/services/dashboard.service';

@Component({
  selector: 'app-sg-instructions-to-bank',
  templateUrl: './sg-instructions-to-bank.component.html',
  styleUrls: ['./sg-instructions-to-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SgInstructionsToBankComponent }]
})
export class SgInstructionsToBankComponent extends SgProductComponent implements OnInit, OnDestroy {

  lcConstant = new LcConstant();
  accounts = [];
  entityName: any;
  entityNameRendered: any;
  accountDetailsList: AccountDetailsList;
  entitiesList: any;
  lcResponseForm = new ImportLetterOfCreditResponse();
  rendered = this.lcConstant.rendered;
  params = this.lcConstant.params;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  tnxTypeCode: any;
  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  module = `${this.translateService.instant(FccGlobalConstant.SG_INSTRUCTIONS_TO_BANK)}`;
  otherInst = 'otherInst';
  isStaticAccountEnabled: boolean;
  constructor(protected commonService: CommonService, protected stateService: ProductStateService,
              protected eventEmitterService: EventEmitterService, protected translateService: TranslateService,
              protected corporateCommonService: CorporateCommonService, protected phrasesService: PhrasesService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService, protected utilityService: UtilityService,
              protected resolverService: ResolverService, protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected sgProductService: SgProductService,
              protected dashboardService: DashboardService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, sgProductService);
  }

  ngOnInit(): void {
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.initializeFormGroup();
    this.iterateControls(FccGlobalConstant.SG_APPLICANT_BENEFICIARY,
      this.stateService.getSectionData(FccGlobalConstant.SG_APPLICANT_BENEFICIARY));
    this.updateNarrativeCount();
  }

  updateNarrativeCount() {
    if (this.form.get('otherInst').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('otherInst').value);
      this.form.get('otherInst')[this.params][this.enteredCharCount] = count;
    }
  }

  ngOnDestroy() {
    this.stateService.setStateSection(FccGlobalConstant.SG_INSTRUCTIONS_TO_BANK, this.form);
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.SG_INSTRUCTIONS_TO_BANK;
    this.form = this.stateService.getSectionData(sectionName);
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get(this.otherInst)[FccGlobalConstant.PARAMS][FccGlobalConstant.PHRASE_ENABLED] = true;
    } else {
      this.form.get(this.otherInst)[FccGlobalConstant.PARAMS][FccGlobalConstant.PHRASE_ENABLED] = false;
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
      if (myvalue[key].type === FccGlobalConstant.INPUT_DROPDOWN_FILTER && myvalue[key].key === 'applicantEntity') {
        this.entityName = myvalue[key].value.shortName;
        this.entityNameRendered = myvalue[key].params.rendered;
        this.entitiesList = myvalue[key].options.length;
      }
    });
    this.getAccounts();
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
     this.patchFieldParameters(this.form.get(FccGlobalConstant.PRINCIPAL_ACT), { options: this.getUpdatedAccounts() });
     this.patchFieldParameters(this.form.get(FccGlobalConstant.FEE_ACT), { options: this.getUpdatedAccounts() });

    } else if (this.entityNameRendered !== undefined) {
      this.patchUpdatedAccounts(emptyCheck);
  } else {
    this.patchUpdatedAccounts(emptyCheck);
  }
    if (this.entityName === undefined && this.entitiesList > 1) {
      this.patchFieldParameters(this.form.get(FccGlobalConstant.PRINCIPAL_ACT), { options: [] });
      this.patchFieldParameters(this.form.get(FccGlobalConstant.FEE_ACT), { options: [] });
   }
    this.updateValue();
    this.updateBankValue();
    
    if(this.form.get(FccGlobalConstant.FEE_ACT)[this.params].required ){
      let feeActOptions = this.getUpdatedAccounts();
      if(feeActOptions){
        feeActOptions = feeActOptions.filter((item) =>item.label !== "");
         this.patchFieldParameters(this.form.get(FccGlobalConstant.FEE_ACT), { options: feeActOptions });
      }
    }
      if (this.form.get(FccGlobalConstant.PRINCIPAL_ACT)[this.params].required){
        let principalActoptnion = this.getUpdatedAccounts();
      if(principalActoptnion){
        principalActoptnion = principalActoptnion.filter((item) =>item.label !== "");
        this.patchFieldParameters(this.form.get(FccGlobalConstant.PRINCIPAL_ACT), { options: principalActoptnion });
       }
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

  getUpdatedAccounts(): any[] {
    this.updateValue();
    return this.accounts;
  }

  onClickPhraseIcon(event: any, key: any) {
    this.entityName = this.stateService.getSectionData(FccGlobalConstant.SG_APPLICANT_BENEFICIARY).get('applicantEntity').value.shortName;
    if (this.entityName !== '' && this.entityName !== undefined) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SG, key, '01', false, this.entityName);
    } else {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SG, key, '01', false);
    } }

  updateValue() {
    if (this.lcResponseForm.bankInstructions !== undefined && this.context === 'readonly') {
      let exists = this.accounts.filter(
        task => task.label === this.lcResponseForm.bankInstructions.principalAccount.number);
      if (exists.length > 0) {
      this.form.get(FccGlobalConstant.PRINCIPAL_ACT).setValue(this.accounts.filter(
          task => task.label === this.lcResponseForm.bankInstructions.principalAccount.number)[0].value);
        }
      this.patchFieldParameters(this.form.get(FccGlobalConstant.PRINCIPAL_ACT), { readonly: true });
      exists = this.accounts.filter(
        task => task.label === this.lcResponseForm.bankInstructions.feeAccount.number);
      if (exists.length > 0) {
      this.form.get(FccGlobalConstant.FEE_ACT).setValue(this.accounts.filter(
       task => task.label === this.lcResponseForm.bankInstructions.feeAccount.number)[0].value);
      }
      this.patchFieldParameters(this.form.get(FccGlobalConstant.FEE_ACT), { readonly: true });
     }
      const exist1 = this.accounts.filter(task => task.label === this.form.get(FccGlobalConstant.FEE_ACT).value.label);
      if(this.form.get(FccGlobalConstant.FEE_ACT).value && exist1 !== null && exist1.length > 0){
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.FEE_ACT),this.accounts.filter(
        task => task.label === this.form.get(FccGlobalConstant.FEE_ACT).value.label)[0].value, {});
     }
      const exist2 = this.accounts.filter(task => task.label === this.form.get(FccGlobalConstant.PRINCIPAL_ACT).value.label);
      if(this.form.get(FccGlobalConstant.PRINCIPAL_ACT).value && exist2 !== null && exist2.length > 0){
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.PRINCIPAL_ACT),this.accounts.filter(
        task => task.label === this.form.get(FccGlobalConstant.PRINCIPAL_ACT).value.label)[0].value, {});
     }
  }

  updateBankValue() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    const principalAct = this.stateService.getValue(FccGlobalConstant.SG_INSTRUCTIONS_TO_BANK, FccGlobalConstant.PRINCIPAL_ACT, false);
    const feeAct = this.stateService.getValue(FccGlobalConstant.SG_INSTRUCTIONS_TO_BANK, FccGlobalConstant.FEE_ACT, false);
    let exists = this.accounts.filter(
          task => task.label === principalAct);
    if (exists.length > 0) {
        this.form.get(FccGlobalConstant.PRINCIPAL_ACT).setValue(this.accounts.filter(
            task => task.label === principalAct)[0].value);
          }
    exists = this.accounts.filter(
          task => task.label === feeAct);
    if (exists.length > 0) {
        this.form.get(FccGlobalConstant.FEE_ACT).setValue(this.accounts.filter(
          task => task.label === feeAct)[0].value);
        }
    }
  }
}
