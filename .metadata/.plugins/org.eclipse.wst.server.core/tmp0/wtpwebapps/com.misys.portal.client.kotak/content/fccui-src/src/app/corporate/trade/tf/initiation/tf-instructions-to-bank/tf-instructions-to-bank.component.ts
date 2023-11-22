import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { FCCFormGroup } from '../../../../../../app/base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../../app/common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../app/common/core/fcc-global-constants';
import { AccountDetailsList } from '../../../../../../app/common/model/accountDetailsList';
import { CommonService } from '../../../../../../app/common/services/common.service';
import { EventEmitterService } from '../../../../../../app/common/services/event-emitter-service';
import { FormModelService } from '../../../../../../app/common/services/form-model.service';
import { LcTemplateService } from '../../../../../../app/common/services/lc-template.service';
import { SearchLayoutService } from '../../../../../../app/common/services/search-layout.service';
import { LeftSectionService } from '../../../../../../app/corporate/common/services/leftSection.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { LcReturnService } from '../../../lc/initiation/services/lc-return.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { TfProductComponent } from '../tf-product/tf-product/tf-product.component';
import { PhrasesService } from './../../../../../common/services/phrases.service';
import { CorporateCommonService } from './../../../../../corporate/common/services/common.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { TfProductService } from '../../services/tf-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { DashboardService } from './../../../../../common/services/dashboard.service';

@Component({
  selector: 'app-tf-instructions-to-bank',
  templateUrl: './tf-instructions-to-bank.component.html',
  styleUrls: ['./tf-instructions-to-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TfInstructionsToBankComponent }]
})
export class TfInstructionsToBankComponent extends TfProductComponent implements OnInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  module = `${this.translateService.instant('tfInstructionsToBank')}`;
  subheader = '';
  accounts = [];
  entityName: any;
  entityNameRendered: any;
  accountDetailsList: AccountDetailsList;
  entitiesList: any;
  barLength: any;
  tnxTypeCode: any;
  phrasesResponse: any;
  mode: any;
  isStaticAccountEnabled: boolean;
  enteredCharCount = 'enteredCharCount';

  constructor(
    protected translateService: TranslateService,
    protected router: Router,
    protected lcReturnService: LcReturnService,
    protected leftSectionService: LeftSectionService,
    protected utilityService: UtilityService,
    protected corporateCommonService: CorporateCommonService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected prevNextService: PrevNextService,
    protected saveDraftService: SaveDraftService,
    protected lcTemplateService: LcTemplateService,
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected commonService: CommonService,
    protected emitterService: EventEmitterService,
    protected stateService: ProductStateService,
    protected phrasesService: PhrasesService,
    protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected resolverService: ResolverService,
    protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
    protected currencyConverterPipe: CurrencyConverterPipe, protected tfProductService: TfProductService,
    protected dashboardService: DashboardService) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, tfProductService);
  }

  ngOnInit() {
    super.ngOnInit();
    window.scroll(0, 0);
    this.initializeFormGroup();
    this.iterateControls('tfApplicantFinancingBankDetails', this.stateService.getSectionData('tfApplicantFinancingBankDetails'));
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.updateNarrativeCount();
    if (this.mode === 'DRAFT') {
      this.updateBankValue();
    }
  }
  updateNarrativeCount() {
    if (this.form.get('otherInst').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('otherInst').value);
      this.form.get('otherInst')[this.params][this.enteredCharCount] = count;
    }
  }

  updateBankValue() {
    if (this.mode === 'DRAFT') {
      const principalAct = this.stateService.getValue('tfInstructionsToBank', 'principalAct', false);
      const feeAct = this.stateService.getValue('tfInstructionsToBank', 'feeAct', false);
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
      this.form.updateValueAndValidity();
    }
  }

  saveFormObject() {
    this.stateService.setStateSection(
      'tfInstructionsToBank',
      this.form
    );
  }

  initializeFormGroup() {
    const sectionName = 'tfInstructionsToBank';
    this.form = this.stateService.getSectionData(sectionName);
    this.saveDraftService.putFormdata('tfInstructionsToBank', this.form);
  }

  ngOnDestroy() {
    this.stateService.setStateSection(
      'tfInstructionsToBank',
      this.form
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
    this.updateBankValue();

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
          if (myvalue[key].type === 'input-dropdown-filter') {
            if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
              if ( myvalue[key].key === 'applicantEntity') {
                  this.entityName = myvalue[key].value;
                  this.entityNameRendered = myvalue[key].params.rendered;
            }
          } else {
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

  getUpdatedAccounts(): any[] {
    return this.accounts;
  }
  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_TF, key);
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
