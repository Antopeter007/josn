import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { AccountDetailsList } from '../../../../../../common/model/accountDetailsList';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { TradeCommonDataService } from '../../../../../../corporate/trade/common/service/trade-common-data.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiService } from '../../../common/services/ui-service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { CorporateCommonService } from './../../../../../common/services/common.service';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccTradeFieldConstants } from './../../../../../trade/common/fcc-trade-field-constants';
import { LcConstant } from '../../../../lc/common/model/constant';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { ImportLetterOfCreditResponse } from '../../../../lc/initiation/model/models';

@Component({
  selector: 'app-ui-instructions-for-bank',
  templateUrl: './ui-instructions-for-bank.component.html',
  styleUrls: ['./ui-instructions-for-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiInstructionsForBankComponent }]
})
export class UiInstructionsForBankComponent extends UiProductComponent implements OnInit {

  form: FCCFormGroup;
  lcConstant = new LcConstant();
  accountDetailsList: AccountDetailsList;
  entityName: any;
  entityNameRendered: any;
  entitiesList: any;
  accounts = [];
  delvOrgUndertakingOptions = [];
  byCollection = 'BY_COLLECTION';
  byCourier = 'BY_COURIER';
  other = 'BY_OTHER';
  byMessengerHandDeliver = 'BY_MESSENGER';
  byRegisteredMailOrAirmail = 'BY_REGISTERED_MAIL';
  byMail = 'BY_MAIL';
  swiftXChar;
  swiftZChar;
  module = `${this.translateService.instant(FccGlobalConstant.UI_INSTRUCTIONS_FOR_BANK)}`;
  transmissionMode: any;
  isMasterRequired: any;
  partyNameAddressLength;
  maxLength = 'maxlength';
  enteredCharCount = 'enteredCharCount';
  options = this.lcConstant.options;
  list: any [];
  isStaticAccountEnabled = true;
  allowedCharCount = FccGlobalConstant.ALLOWED_CHAR_COUNT;
  lcResponseForm = new ImportLetterOfCreditResponse();
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected corporateCommonService: CorporateCommonService, protected phrasesService: PhrasesService,
              protected tradeCommonDataService: TradeCommonDataService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected amendCommonService: AmendCommonService, protected uiService: UiService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService,
              protected fccGlobalConstantService: FccGlobalConstantService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.isMasterRequired = this.isMasterRequired;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.isStaticAccountEnabled = response.tradeStaticAccounts;
      }
    });
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.initializeFormGroup();
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
    this.iterateControls(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS,
      this.stateService.getSectionData(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS));
    this.getDeliveryTo();
    this.initializeDelvOrgUndertaking();
    this.populateDataForCopyFrom();
    this.updateNarrativeCount();
    this.partyNameAddressLength = FccGlobalConstant.LENGTH_6 * FccGlobalConstant.LENGTH_35;
    this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER)[this.params][this.maxLength] =
                  (this.partyNameAddressLength + FccGlobalConstant.LENGTH_5);
  }
  updateNarrativeCount() {
    if (this.form.get('bgFreeFormatText').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('bgFreeFormatText').value);
      this.form.get('bgFreeFormatText')[this.params][this.enteredCharCount] = count;
    }
    if (this.form.get('bgDeliveryToOther').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('bgDeliveryToOther').value);
      this.form.get('bgDeliveryToOther')[this.params][this.enteredCharCount] = count;
    }
  }

  amendFormFields(){
    this.updateAmendValues();
    this.form.updateLabel(FccTradeFieldConstants.UI_DEL_ORG_UNDERTAKING,
      this.translateService.instant(FccTradeFieldConstants.UI_DEL_AMEND_UNDERTAKING));
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.UI_INSTRUCTIONS_FOR_BANK);
   }
  updateAmendValues() {
     const delv = this.productStateService.getSectionData(FccGlobalConstant.UI_INSTRUCTIONS_FOR_BANK, undefined, this.isMasterRequired);
     const delOrg = delv.value;
     const exists = this.delvOrgUndertakingOptions.filter(
       task => task.code === delOrg);
     if (exists.length > 0) {
      this.form.get('bgDelvOrgUndertaking').setValue(this.delvOrgUndertakingOptions.filter(
        task => task.code === delOrg)[0].label);
    }
   }

   initializeFormGroup() {
    const sectionName = FccGlobalConstant.UI_INSTRUCTIONS_FOR_BANK;
    this.transmissionMode =
    this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
    this.form = this.productStateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    this.removeValidators(this.form,
      [FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_COURIER, FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_OTHR,
      FccTradeFieldConstants.BG_DELV_TO_OTHER]);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.swiftXChar = response.swiftXCharacterSet;
      this.swiftZChar = response.swiftZChar;
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_COURIER, Validators.pattern(this.swiftXChar), 0);
        this.form.addFCCValidators(FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_OTHR, Validators.pattern(this.swiftXChar), 0);
        if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023) {
          this.form.addFCCValidators(FccTradeFieldConstants.BG_DELV_TO_OTHER, Validators.pattern(this.swiftZChar), 0);
        }
        else{
          this.form.addFCCValidators(FccTradeFieldConstants.BG_DELV_TO_OTHER, Validators.pattern(this.swiftXChar), 0);
        }
      }
      if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.transmissionMode[0] && this.transmissionMode[0].value) {
        if (this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators(FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_COURIER, Validators.pattern(this.swiftXChar), 0);
          this.form.addFCCValidators(FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_OTHR, Validators.pattern(this.swiftXChar), 0);
          if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023) {
            this.form.addFCCValidators(FccTradeFieldConstants.BG_DELV_TO_OTHER, Validators.pattern(this.swiftZChar), 0);
          }
          else{
            this.form.addFCCValidators(FccTradeFieldConstants.BG_DELV_TO_OTHER, Validators.pattern(this.swiftXChar), 0);
          }
        }
      }
    });
    this.form.updateValueAndValidity();
  }

  getDeliveryTo() {
    const sectionForm: FCCFormGroup = this.productStateService.getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    );
    const bankName = sectionForm.get('recipientBankName').value;
    const language = localStorage.getItem('language');
    this.commonService.getParamData(FccGlobalConstant.PRODUCT_BG, FccTradeFieldConstants.PARAMETER_P806).subscribe(response => {
        if (response) {
          this.list = this.tradeCommonDataService.getDeliveryToParamData(response, bankName, language,
            FccTradeFieldConstants.BG_DELIVERY_TO, FccGlobalConstant.PRODUCT_BG);
          this.list.sort((a, b) => (a.value > b.value) ? 1 : -1);
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.BG_DELIVERY_TO), { options: this.list });
          if (this.list[0] !== undefined && (this.form.get(FccTradeFieldConstants.BG_DELIVERY_TO).value === '' ||
            this.form.get(FccTradeFieldConstants.BG_DELIVERY_TO).value === null)) {
              this.form.get(FccTradeFieldConstants.BG_DELIVERY_TO)[FccGlobalConstant.PARAMS].defaultValue = this.list[0].value;
              this.form.get(FccTradeFieldConstants.BG_DELIVERY_TO).setValue(this.list[0].value);
            }
          this.form.get(FccTradeFieldConstants.BG_DELIVERY_TO).updateValueAndValidity();
        }
    });
  }

  getAccounts() {
    const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
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
      this.accounts = [];
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
      this.patchFieldParameters(this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT), { options: this.accounts });
      this.patchFieldParameters(this.form.get(FccGlobalConstant.UI_FEE_ACT), { options: this.accounts });
    } else if (this.entityNameRendered !== undefined) {
      this.patchUpdatedAccounts(emptyCheck);
    } else {
      this.patchUpdatedAccounts(emptyCheck);
    }
      if (this.entityName === undefined && this.entitiesList > 1) {
        this.patchFieldParameters(this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT), { options: [] });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.UI_FEE_ACT), { options: [] });
    }
      this.updateValue();
      this.updateBankValue();

      if(this.form.get(FccGlobalConstant.UI_FEE_ACT)[this.params].required ){
        let feeActOptions = this.getUpdatedAccounts();
        if(feeActOptions){
          feeActOptions = feeActOptions.filter((item) =>item.label !== "");
           this.patchFieldParameters(this.form.get(FccGlobalConstant.UI_FEE_ACT), { options: feeActOptions });
        }
      }
        if (this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT)[this.params].required){
          let principalActoptnion = this.getUpdatedAccounts();
        if(principalActoptnion){
          principalActoptnion = principalActoptnion.filter((item) =>item.label !== "");
          this.patchFieldParameters(this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT), { options: principalActoptnion });
         }
        }
    }

    initializeDelvOrgUndertaking() {

      const bgDelvOrgUndertaking = this.tradeCommonDataService.getBgDelvOrgUndertaking('');
      if (this.form.get('bgDelvOrgUndertaking')) {
        this.form.get('bgDelvOrgUndertaking')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = bgDelvOrgUndertaking;
      }
      this.delvOrgUndertakingOptions = bgDelvOrgUndertaking;
      }

    onClickBgDelvOrgUndertaking() {
      const bgDelvOrgUndertakingTextFields = [FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_COURIER,
         FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_OTHR];
      const bgDelvOrgUndertakingFieldsValues = [FccGlobalConstant.DELV_MODE_INST_VALUE_02, FccGlobalConstant.DELV_MODE_INST_VALUE_99];
      if (this.form.get('bgDelvOrgUndertaking') &&
          (this.form.get('bgDelvOrgUndertaking').value !== '' && this.form.get('bgDelvOrgUndertaking').value !== null &&
          bgDelvOrgUndertakingFieldsValues.indexOf(this.form.get('bgDelvOrgUndertaking').value) > -1)) {
        if (this.form.get('bgDelvOrgUndertaking').value === FccGlobalConstant.DELV_MODE_INST_VALUE_99) {
          this.toggleControls(this.form, [FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_OTHR], true);
          this.toggleRequired(true, this.form, [FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_OTHR]);
          if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
            (this.transmissionMode[0] && this.transmissionMode[0].value &&
              this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
            this.form.addFCCValidators(FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_OTHR, Validators.pattern(this.swiftXChar), 0);
          }
          this.hideBgDelDelvOrgUndertakingText([FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_COURIER]);
        } else if (this.form.get('bgDelvOrgUndertaking').value === FccGlobalConstant.DELV_MODE_INST_VALUE_02){
          this.toggleControls(this.form, [FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_COURIER], true);
          this.toggleRequired(true, this.form, [FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_COURIER]);
          if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
            (this.transmissionMode[0] && this.transmissionMode[0].value &&
              this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
            this.form.addFCCValidators(FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_COURIER, Validators.pattern(this.swiftXChar), 0);
          }
          this.hideBgDelDelvOrgUndertakingText([FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_OTHR]);
        }
      } else {
        this.hideBgDelDelvOrgUndertakingText(bgDelvOrgUndertakingTextFields);
        this.form.get('bgDelvOrgUndertakingText').setValue('');
    }
  }

  hideBgDelDelvOrgUndertakingText(fieldstoHide: string[]) {
    this.toggleControls(this.form, fieldstoHide, false);
    this.toggleRequired(false, this.form, fieldstoHide);
    this.removeValidators(this.form, fieldstoHide);
  }

  onClickBgDeliveryTo() {
      this.commonService.getSwiftVersionValue();
      if (this.form.get('bgDeliveryTo') &&
          (this.form.get('bgDeliveryTo').value !== '' && this.form.get('bgDeliveryTo').value !== null &&
          (this.form.get('bgDeliveryTo').value === '02' || this.form.get('bgDeliveryTo').value === '04' ||
          this.form.get('bgDeliveryTo').value === '05'))) {
        this.toggleControls(this.form, ['bgDeliveryToOther'], true);
        this.uiProductService.swift2023Changes();
        this.toggleRequired(true, this.form, ['bgDeliveryToOther']);
        if(this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2023){
          this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER)[this.params][this.allowedCharCount] = '210';
          this.partyNameAddressLength = FccGlobalConstant.LENGTH_6 * FccGlobalConstant.LENGTH_35;
          this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER)[this.params][this.maxLength] =
                      (this.partyNameAddressLength + FccGlobalConstant.LENGTH_5);
        }
        else{
          this.partyNameAddressLength = FccGlobalConstant.LENGTH_12 * FccGlobalConstant.LENGTH_65;
          this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER)[this.params][this.maxLength] =
                    (this.partyNameAddressLength + FccGlobalConstant.LENGTH_11);
        }
        if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
          (this.transmissionMode[0] && this.transmissionMode[0].value &&
            this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT)) {
              if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023) {
                this.form.addFCCValidators('bgDeliveryToOther', Validators.pattern(this.swiftZChar), 0);
              }
              else{
                this.form.addFCCValidators('bgDeliveryToOther', Validators.pattern(this.swiftXChar), 0);
              }
        }
      } else {
        this.toggleControls(this.form, ['bgDeliveryToOther'], false);
        this.toggleRequired(false, this.form, ['bgDeliveryToOther']);
        this.form.get(FccTradeFieldConstants.BG_DELIVERY_TO).clearValidators();
        this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER).clearValidators();
        this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER).setErrors({ invalid: false });
        this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER).updateValueAndValidity();
    }
      this.form.updateValueAndValidity();
  }

  onClickPhraseIcon(event, key) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_BG, key, '', true);
  }

  populateDataForCopyFrom() {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const option = this.uiService.getOption();
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if ((tnxTypeCode === FccGlobalConstant.N002_NEW &&
      (option === FccGlobalConstant.EXISTING_OPTION || option === FccGlobalConstant.TEMPLATE
        || mode === FccGlobalConstant.DRAFT_OPTION)) || tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.onClickBgDeliveryTo();
      this.onClickBgDelvOrgUndertaking();
    }
  }

  onKeyupBgDeliveryToOther(event){
    const data = event.target.value;
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace( /[\r\n]+/gm, '' ) : '';
    const cols = this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER)[this.params].cols;
    if (checkForValue === '') {
        this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER).setValue(null);
        this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER).setErrors({ invalid: true });
        this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER).updateValueAndValidity();
    } else {
        this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER).setErrors({ invalid: false });
        this.form.get(FccTradeFieldConstants.BG_DELV_TO_OTHER).updateValueAndValidity();
        this.commonService.limitCharacterCountPerLine(FccTradeFieldConstants.BG_DELV_TO_OTHER, this.form, cols);
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
        if (myvalue[key].type === 'input-dropdown-filter' && myvalue[key].key === 'applicantEntity') {
          this.entityName = myvalue[key].value.shortName;
          this.entityNameRendered = myvalue[key].params.rendered;
          this.entitiesList = myvalue[key].options.length;
        }
      }
    });
    this.getAccounts();
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
    this.patchFieldParameters(this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT), { options: this.getUpdatedAccounts() });
    this.patchFieldParameters(this.form.get(FccGlobalConstant.UI_FEE_ACT), { options: this.getUpdatedAccounts() });
  }

  updateValue() {
    if (this.lcResponseForm.bankInstructions !== undefined && this.context === 'readonly') {
      let exists = this.accounts.filter(
        task => task.label === this.lcResponseForm.bankInstructions.principalAccount.number);
      if (exists.length > 0) {
      this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT).setValue(this.accounts.filter(
          task => task.label === this.lcResponseForm.bankInstructions.principalAccount.number)[0].value);
        }
      this.patchFieldParameters(this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT), { readonly: true });
      exists = this.accounts.filter(
        task => task.label === this.lcResponseForm.bankInstructions.feeAccount.number);
      if (exists.length > 0) {
      this.form.get(FccGlobalConstant.UI_FEE_ACT).setValue(this.accounts.filter(
       task => task.label === this.lcResponseForm.bankInstructions.feeAccount.number)[0].value);
      }
      this.patchFieldParameters(this.form.get(FccGlobalConstant.UI_FEE_ACT), { readonly: true });
     }
    const exist1 = this.accounts.filter(task => task.label === this.form.get(FccGlobalConstant.UI_FEE_ACT).value.label);
    if(this.form.get(FccGlobalConstant.UI_FEE_ACT).value && exist1 !== null && exist1.length > 0){
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.UI_FEE_ACT),this.accounts.filter(
        task => task.label === this.form.get(FccGlobalConstant.UI_FEE_ACT).value.label)[0].value, {});
    }
    const exist2 = this.accounts.filter(task => task.label === this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT).value.label);
    if(this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT).value && exist2 !== null && exist2.length > 0){
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT),this.accounts.filter(
        task => task.label === this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT).value.label)[0].value, {});
    }
  }

  updateBankValue() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    const principalAct = this.stateService.getValue(FccGlobalConstant.UI_INSTRUCTIONS_FOR_BANK, FccGlobalConstant.UI_PRINCIPAL_ACT, false);
    const feeAct = this.stateService.getValue(FccGlobalConstant.UI_INSTRUCTIONS_FOR_BANK, FccGlobalConstant.UI_FEE_ACT, false);
    let exists = this.accounts.filter(
          task => task.label === principalAct);
    if (exists.length > 0) {
        this.form.get(FccGlobalConstant.UI_PRINCIPAL_ACT).setValue(this.accounts.filter(
            task => task.label === principalAct)[0].value);
          }
    exists = this.accounts.filter(
          task => task.label === feeAct);
    if (exists.length > 0) {
        this.form.get(FccGlobalConstant.UI_FEE_ACT).setValue(this.accounts.filter(
          task => task.label === feeAct)[0].value);
        }
    }
  }

  getUpdatedAccounts(): any[] {
    this.updateValue();
    return this.accounts;
  }


  ngOnDestroy() {
    if (this.form.get('bgDelvOrgUndertaking').value === FccGlobalConstant.DELV_MODE_INST_VALUE_99) {
      this.form.get('bgDelvOrgUndertakingText').setValue(this.form.get(FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_OTHR).value);
    } else if (this.form.get('bgDelvOrgUndertaking').value === FccGlobalConstant.DELV_MODE_INST_VALUE_02) {
      this.form.get('bgDelvOrgUndertakingText').setValue(this.form.get(FccGlobalConstant.UI_DEL_UNDERTAKING_TEXT_COURIER).value);
    } else {
      this.form.get('bgDelvOrgUndertakingText').setValue('');
    }
    this.onClickBgDeliveryTo();
    this.stateService.setStateSection(FccGlobalConstant.UI_INSTRUCTIONS_FOR_BANK, this.form);
  }

}
