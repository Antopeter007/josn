import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { CounterpartyRequest } from '../../../../../common/model/counterpartyRequest';

import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConfiguration } from '../../../../../common/core/fcc-global-configuration';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CounterpartyDetailsList } from '../../../../../common/model/counterpartyDetailsList';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { PhrasesService } from '../../../../../common/services/phrases.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { CorporateCommonService } from '../../../../../corporate/common/services/common.service';
import { LeftSectionService } from '../../../../../corporate/common/services/leftSection.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import {
  assignmentAmtGreaterThanAvailableAmt,
  zeroAmount
} from '../../../lc/initiation/validator/ValidateAmt';
import { SrProductComponent } from '../../sr-product/sr-product.component';
import { CurrencyConverterPipe } from './../../../lc/initiation/pipes/currency-converter.pipe';
import { SrProductService } from '../../services/sr-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { CodeData } from './../../../../../common/model/codeData';
import { CodeDataService } from './../../../../../common/services/code-data.service';

@Component({
  selector: 'app-sr-assignment-conditions',
  templateUrl: './sr-assignment-conditions.component.html',
  styleUrls: ['./sr-assignment-conditions.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SrAssignmentConditionsComponent }]
})
export class SrAssignmentConditionsComponent extends SrProductComponent implements OnInit {

  form: FCCFormGroup;
  lcConstant = new LcConstant();
  module = `${this.translateService.instant(FccGlobalConstant.SR_ASSIGNMENT_CONDITIONS)}`;
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  readonly = this.lcConstant.readonly;
  maxlength = this.lcConstant.maximumlength;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  items: MenuItem[];
  swiftXCharRegex: string;
  swiftZCharRegex: string;
  swiftMode = false;
  configuredKeysList = 'SWIFT_VALIDATION_REGEX,SWIFT_VALIDATION_REGEX_ZCHAR';
  keysNotFoundList: any[] = [];
  codeID: any;
  productCode: any;
  subProductCode: any;
  codeData = new CodeData();
  eventDataArray: any;
  responseStatusCode = 200;
  counterpartyDetailsList: CounterpartyDetailsList;
  beneficiaries = [];
  lcAmount;
  currency;
  assignmentAmount;
  allowedDecimals = -1;
  assignmentAmountField = 'assignmentAmount';
  utilizedAmount;
  assignmentAmountWithCurrency = 'assignmentAmountWithCurrency';
  setAssignmentAmtNull: boolean;
  mode;
  addressRegex: any;
  nameLength: any;
  nameRegex: any;
  swifCodeRegex: any;
  address1TradeLength;
  address2TradeLength;
  domTradeLength;
  address4TradeLength;
  beneAbbvNameRegex;
  transmisionMode: any;
  syBeneAdd: any;
  beneAbbvName: any;
  beneEditToggleVisible = false;
  benePreviousValue: any;
  abbvNameList = [];
  entityAddressType: any;
  entityNameList = [];
  saveTogglePreviousValue: any;
  beneAbbvPreviousValue: any;
  leftSectionEnabled;
  isApplicableRulesMandatory: boolean;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService, protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected fccGlobalConfiguration: FccGlobalConfiguration,
              protected stateService: ProductStateService, protected eventEmitterService: EventEmitterService,
              protected corporateCommonService: CorporateCommonService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected phrasesService: PhrasesService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected srProductService: SrProductService,
              protected codeDataService: CodeDataService,) {
                super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
                  searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, srProductService);
  }

  ngOnInit(): void {
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    // this.transmisionMode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    this.transmisionMode = this.commonService.isNonEmptyValue(this.stateService.getSectionData('srGeneralDetails').
    get('transmissionMode')) ? this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode') : '';
    this.initializeFormGroup();
    this.onClickApplicableRulesOptions();
    this.getBeneficiaries();
    this.checkBeneSaveAllowed();
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response.response && response.response === 'REST_API_SUCCESS') {
          this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
        }
      });
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.isApplicableRulesMandatory = response.isApplicableRulesMandatory;
      }
    });
    this.updateValues();
    this.lcAmount = this.stateService.getValue(FccGlobalConstant.SR_ASSIGNMENT_CONDITIONS, 'lcAmount', false);
    this.currency = this.stateService.getValue(FccGlobalConstant.SR_ASSIGNMENT_CONDITIONS, 'currency', false);
    this.lcAmount = this.commonService.replaceCurrency(this.lcAmount);
    if (this.commonService.isNonEmptyValue(this.form.get('utilizedAmount').value) &&
     this.commonService.isNonEmptyValue(this.currency)) {
      this.utilizedAmount = this.commonService.replaceCurrency(this.form.get('utilizedAmount').value);
      this.utilizedAmount = this.currencyConverterPipe.transform(this.utilizedAmount.toString(), this.currency);
    }
    const orgAmountValue = this.currencyConverterPipe.transform(this.lcAmount, this.currency);
    this.form.get('amount').setValue(this.currency.concat(' ').concat(orgAmountValue));
    this.form.addFCCValidators(this.assignmentAmountField,
      Validators.compose([Validators.required, Validators.pattern(this.commonService.getRegexBasedOnlanguage())]), 0);
    this.form.get('currency')[this.params][this.rendered] = true;
    this.form.get(this.assignmentAmountField)[this.params][this.rendered] = true;
    this.setAssignmentAmtNull = false;
    this.form.addFCCValidators(this.assignmentAmountField,
      Validators.compose([Validators.required, Validators.pattern(this.commonService.getRegexBasedOnlanguage())]), 0);
    this.populateAmountFields();
    this.updateAssigneeEntityValue();
    this.handleAmountFields();
    if (this.form.get('assigneeEntity').value !== undefined &&
    this.form.get('assigneeEntity').value !== FccGlobalConstant.EMPTY_STRING) {
      this.benePreviousValue = this.form.get('assigneeEntity').value;
    }
    if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) && this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value){
      this.saveTogglePreviousValue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
  }
    if (this.form.get(FccGlobalConstant.BENE_ABBV_NAME) &&
    this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value)) {
     this.beneAbbvPreviousValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
  }
    this.handleApplicableRules();
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    this.form.get('assigneeEntity').clearValidators();
    this.form.get('assigneeEntity').updateValueAndValidity();
    this.form.get('assigneeFirstAddress').clearValidators();
    this.form.get('assigneeFirstAddress').updateValueAndValidity();
  }

  handleApplicableRules() {
    if(this.isApplicableRulesMandatory === true) {
      this.setMandatoryFields(this.form, [FccGlobalConstant.APPLICABLE_RULES_OPTIONS], true);
    } else {
      this.setMandatoryFields(this.form, [FccGlobalConstant.APPLICABLE_RULES_OPTIONS], false);
      this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS).setErrors(null);
      this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS).clearValidators();
    }
    this.form.updateValueAndValidity();
  }

  handleAmountFields() {
    if (this.commonService.isNonEmptyField('amount', this.form)){
      const amount = this.form.get('amount').value;
      const amountCurrency = amount.substr(0, amount.indexOf(' '));
      const amountValue = amount.substr(amount.indexOf(' ') + 1);
      if (this.commonService.isNonEmptyField('currency', this.form)){
        this.form.get('currency').setValue(amountCurrency);
        if (this.commonService.isNonEmptyValue(this.currency)){
          this.form.get('amount').setValue(this.currency.concat(' ').concat(amountValue));
        }
      }
    }
  }

  initializeFormGroup() {
  const sectionName = FccGlobalConstant.SR_ASSIGNMENT_CONDITIONS;
  this.form = this.stateService.getSectionData(sectionName);
  }

  onClickFullAssignment() {
    const toggleValue = this.form.get('fullAssignment').value;
    const remainingAvailableAmount = +(this.commonService.replaceCurrency(this.lcAmount)) -
     +(this.commonService.replaceCurrency(this.utilizedAmount));
    const availableAmount = this.currencyConverterPipe.transform(remainingAvailableAmount.toString(), this.currency);
    this.form.get('availableAmount').setValue(this.currency.concat(' ').concat(availableAmount));
    if (toggleValue === FccBusinessConstantsService.NO) {
      this.form.get(this.assignmentAmountField).setValue('');
      this.form.controls[this.assignmentAmountField].enable();
      this.form.get(this.assignmentAmountField)[this.params][this.readonly] = false;
    } else {
      this.form.get(this.assignmentAmountField).setValue(availableAmount);
      this.form.controls[this.assignmentAmountField].disable();
      this.form.get(this.assignmentAmountField)[this.params][this.readonly] = true;
      this.form.get(this.assignmentAmountField).setErrors(null);
      this.form.get(this.assignmentAmountField).clearValidators();
    }
    this.assignmentAmountValidation();
    this.form.get(this.assignmentAmountField).updateValueAndValidity();
  }

  /*validation on change of amount field*/
  onBlurAssignmentAmount() {
    let isValid = true;
    this.form.get(this.assignmentAmountField).clearValidators();
    let assignmentAmt = this.form.get(this.assignmentAmountField).value;
    this.allowedDecimals = FccGlobalConstant.LENGTH_0;
    if (assignmentAmt !== '' && this.commonService.isNonEmptyValue(assignmentAmt)) {
      isValid = this.commonService.checkNegativeAmount(this.form, assignmentAmt, this.assignmentAmountField);
      isValid = this.commonService.checkRegexAmount(this.form, assignmentAmt, this.assignmentAmountField);
      if (isValid) {
        assignmentAmt = this.commonService.replaceCurrency(assignmentAmt);
        assignmentAmt = this.currencyConverterPipe.transform(assignmentAmt.toString(), this.currency);
        this.form.get(this.assignmentAmountField).setValue(assignmentAmt);
      }
    }
    this.assignmentAmountValidation();
  }

  updateValues() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.leftSectionEnabled = response.showStepper === 'true';
        this.nameRegex = response.BeneficiaryNameRegex;
        this.addressRegex = response.BeneficiaryAddressRegex;
        this.nameLength = response.BeneficiaryNameLength;
        this.swifCodeRegex = response.bigSwiftCode;
        this.address1TradeLength = response.address1TradeLength;
        this.address2TradeLength = response.address2TradeLength;
        this.domTradeLength = response.domTradeLength;
        this.address4TradeLength = response.address4TradeLength;
        this.beneAbbvNameRegex = response.BeneficiaryAbbvNameRegex;
        this.form.get('assigneeFirstAddress').clearValidators();
        this.form.get('assigneeSecondAddress').clearValidators();
        this.form.get('assigneeThirdAddress').clearValidators();
        this.form.get('assigneeFourthAddress').clearValidators();
        this.form.get('assigneeName').clearValidators();
        this.form.get('assigneeFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        this.form.get('assigneeSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        this.form.get('assigneeThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
        this.form.get('assigneeFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
        if (this.transmisionMode === FccBusinessConstantsService.SWIFT){
          this.form.addFCCValidators('assigneeFirstAddress', Validators.pattern(this.addressRegex), 0);
          this.form.addFCCValidators('assigneeSecondAddress', Validators.pattern(this.addressRegex), 0);
          this.form.addFCCValidators('assigneeThirdAddress', Validators.pattern(this.addressRegex), 0);
          this.form.addFCCValidators('assigneeFourthAddress', Validators.pattern(this.addressRegex), 0);
          this.form.get('assigneeFirstAddress').updateValueAndValidity();
          this.form.get('assigneeSecondAddress').updateValueAndValidity();
          this.form.get('assigneeThirdAddress').updateValueAndValidity();
          this.form.get('assigneeFourthAddress').updateValueAndValidity();
          this.form.addFCCValidators('assigneeName', Validators.pattern(this.nameRegex), 0);
        }
        this.form.addFCCValidators('assigneeName', Validators.compose([Validators.maxLength(this.nameLength)]), 1);
        this.form.get('assigneeName').updateValueAndValidity();
      }
    });
   }

   getBeneficiaries() {
    this.corporateCommonService.getCounterparties(
      this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.counterparties)
    .subscribe(response => {
        if (response.status === this.responseStatusCode) {
          this.getBeneficiariesAsList(response.body);
        }
        this.updateAssigneeEntityValue();
        if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.leftSectionEnabled) {
          this.stateService.setStateSection(FccGlobalConstant.SR_ASSIGNMENT_CONDITIONS, this.form);
          this.leftSectionService.reEvaluateProgressBar.next(true);
        }
    });
  }

  getBeneficiariesAsList(body: any) {
    this.counterpartyDetailsList = body;
    if (this.commonService.addressType && this.commonService.addressType === FccGlobalConstant.POSTAL_ADDRESS_PA) {
      this.entityAddressType = FccGlobalConstant.POSTAL_ADDRESS;
    } else {
      this.entityAddressType = FccGlobalConstant.SWIFT_ADDRESS_LOWERCASE;
    }
    this.counterpartyDetailsList.items.forEach(value => {
      const beneficiary: { label: string; value: any } = {
        label: this.commonService.decodeHtml(value.name),
        value: {
          label: this.commonService.decodeHtml(value.shortName),
          swiftAddressLine1: this.commonService.decodeHtml(value[this.entityAddressType].line1),
          swiftAddressLine2: this.commonService.decodeHtml(value[this.entityAddressType].line2),
          swiftAddressLine3: this.commonService.decodeHtml(value[this.entityAddressType].line3),
          country: value.country,
          entity: decodeURI(value.entityShortName),
          shortName: this.commonService.decodeHtml(value.shortName),
          name: this.commonService.decodeHtml(value.name)
        }
      };
      this.abbvNameList.push(this.commonService.decodeHtml(value.shortName));
      this.entityNameList.push(this.commonService.decodeHtml(value.name));
      this.beneficiaries.push(beneficiary);
    });
    if (this.operation === FccGlobalConstant.PREVIEW && this.mode === FccGlobalConstant.VIEW_MODE) {
      if (this.form.get('assigneeEntity').value !== FccGlobalConstant.EMPTY_STRING &&
      typeof(this.form.get('assigneeEntity').value) === 'object') {
        const adhocBene: { label: string; value: any } = {
          label: this.form.get('assigneeEntity').value.label,
          value: {
            label: this.form.get('assigneeEntity').value.label,
            swiftAddressLine1: '',
            swiftAddressLine2: '',
            swiftAddressLine3: '',
            entity: '&#x2a;',
            shortName: '',
            name: ''
          }
        };
        this.beneficiaries.push(adhocBene);
      }
     }
    this.patchFieldParameters(this.form.get('assigneeEntity'), { options: this.beneficiaries });
  }

  onClickAssigneeEntity(event) {
    if (event.value) {
      this.form.get('assigneeName').setValue(event.value.name);
      this.form.get('assigneeFirstAddress').setValue(event.value.swiftAddressLine1);
      this.form.get('assigneeSecondAddress').setValue(event.value.swiftAddressLine2);
      this.form.get('assigneeThirdAddress').setValue(event.value.swiftAddressLine3);
      this.form.get('assigneecountry').setValue({ label: event.value.country, shortName: event.value.country });
    }
  }
  ngOnDestroy() {
    if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) !== null) {
      const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
      if (togglevalue !== undefined && togglevalue === FccBusinessConstantsService.YES &&
        !this.form.get(FccGlobalConstant.BENE_ABBV_NAME).hasError('duplicateCounterpartyAbbvName')) {
          if (this.mode === FccGlobalConstant.DRAFT_OPTION){
            this.commonService.saveBeneficiary(this.getCounterPartyObjectForAmend(this.form)).subscribe();
          }else{
            this.commonService.saveBeneficiary(this.getCounterPartyObject(this.form)).subscribe();
          }
      }
    }
  }

  populateAmountFields() {
    const remainingAvailableAmount = +(this.commonService.replaceCurrency(this.lcAmount)) -
     +(this.commonService.replaceCurrency(this.utilizedAmount));
    const availableAmount = this.currencyConverterPipe.transform(remainingAvailableAmount.toString(), this.currency);
    const availableAmountFloat = parseFloat(this.commonService.replaceCurrency(availableAmount));
    const lcAmountFloat = parseFloat(this.commonService.replaceCurrency(this.lcAmount));
    let tnxAmt = this.commonService.replaceCurrency(
      this.stateService.getValue(
        FccGlobalConstant.SR_ASSIGNMENT_CONDITIONS,
        this.assignmentAmountField,
        false
      )
    );

    tnxAmt = this.currencyConverterPipe.transform(tnxAmt.toString(), this.currency);
    if (this.mode === 'DRAFT') {
      if (tnxAmt) {
        const tnxAmtFloat = parseFloat(this.commonService.replaceCurrency(tnxAmt));
        if (tnxAmtFloat === availableAmountFloat || tnxAmtFloat === lcAmountFloat) {
          this.form.get('fullAssignment').setValue(FccBusinessConstantsService.YES);
          this.setAmountFields(FccBusinessConstantsService.YES, tnxAmt);
        } else {
          this.form.get('fullAssignment').setValue(FccBusinessConstantsService.NO);
          this.setAmountFields(FccBusinessConstantsService.NO, tnxAmt);
        }
      } else {
        this.form.get('fullAssignment').setValue(FccBusinessConstantsService.NO);
        this.setAmountFields(FccBusinessConstantsService.NO, tnxAmt);
      }
    } else {
      const toggleValue = this.form.get('fullAssignment').value;
      if (toggleValue === FccBusinessConstantsService.YES) {
        this.setAmountFields(FccBusinessConstantsService.YES, availableAmount);
      } else {
        this.setAmountFields(FccBusinessConstantsService.NO, tnxAmt);
      }
    }
    this.setAssignmentAmtNull = false;
    this.form.get('availableAmount').setValue(this.currency.concat(' ').concat(availableAmount));
  }

  onClickApplicableRulesOptions() {
    const applicableRule = this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS).value;
    if (applicableRule && applicableRule.toString() === FccBusinessConstantsService.OTHER_99) {
      this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES).clearValidators();
      if (this.transmisionMode === FccBusinessConstantsService.SWIFT){
        this.form.addFCCValidators(FccGlobalConstant.OTHER_APPLICABLE_RULES, Validators.pattern('^[A-Za-z][A-Za-z0-9 ]*$'), 1);
      }
      this.form.addFCCValidators(FccGlobalConstant.OTHER_APPLICABLE_RULES,
        Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 1);
      this.setMandatoryField(this.form, FccGlobalConstant.OTHER_APPLICABLE_RULES, true);
    } else {
      this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.setMandatoryField(this.form, FccGlobalConstant.OTHER_APPLICABLE_RULES, false);
      this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES).setValue('');
      this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES).clearValidators();
      this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES).setErrors(null);
      this.form.get(FccGlobalConstant.OTHER_APPLICABLE_RULES).updateValueAndValidity();

    }
    this.handleLCApplicableRulesOptions();
  }

  handleLCApplicableRulesOptions() {
  const elementId = FccGlobalConstant.APPLICABLE_RULES_OPTIONS;
  this.productCode = FccGlobalConstant.PRODUCT_DEFAULT;
  this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
  const elementValue = this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
  this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
  if (this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== null &&
      this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== '' &&
      this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID] !== undefined) {
    this.codeID = this.form.get(FccGlobalConstant.APPLICABLE_RULES_OPTIONS)[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
  }
  if (elementValue !== undefined && elementValue.length === 0) {
    if(this.isApplicableRulesMandatory === true) {
    this.eventDataArray = this.codeDataService.getCodeData(this.codeID, this.productCode, '', this.form, elementId);
    } else {
      this.eventDataArray = this.codeDataService.getCodeDataWithEmptyVal(this.codeID, this.productCode,
      this.subProductCode, this.form, elementId);
    }
    this.patchFieldParameters(this.form.get(elementId), { options: this.eventDataArray });
  }
  if (elementValue !== undefined && elementValue.length !== 0) {
    elementValue.forEach((value, index) => {
      if (value.value === '*') {
        elementValue.splice(index, 1);
      }
    });
    this.patchFieldParameters(this.form.get(elementId), { options: elementValue });
    this.form.updateValueAndValidity();
  }
}
  setAmountFields(toggleValue, assignmentAmount) {
    this.form.get(this.assignmentAmountField).clearValidators();
    this.form.get(this.assignmentAmountField).setValue(assignmentAmount);
    if (toggleValue === FccBusinessConstantsService.NO) {
      this.form.get(this.assignmentAmountField)[this.params][this.readonly] = false;
      this.form.controls[this.assignmentAmountField].enable();
    } else {
      this.form.get(this.assignmentAmountField)[this.params][this.readonly] = true;
      this.form.controls[this.assignmentAmountField].disable();
    }
    this.assignmentAmountValidation();
    this.form.get(this.assignmentAmountField).updateValueAndValidity();
  }

  assignmentAmountValidation() {
    const originalLCAmt = this.commonService.replaceCurrency(this.lcAmount);
    const utilizedAmount = this.commonService.replaceCurrency(this.stateService.getValue(FccGlobalConstant.SR_ASSIGNMENT_CONDITIONS,
      'utilizedAmount', false));
    const availableAmt = +originalLCAmt - +utilizedAmount;
    const availableFloatAmt = parseFloat(availableAmt.toString());
    let assignmentAmt = this.commonService.replaceCurrency(this.form.get(this.assignmentAmountField).value);
    assignmentAmt = this.currencyConverterPipe.transform(assignmentAmt.toString(), this.currency);
    const assignmentAmtFloatValue = parseFloat(this.commonService.isNonEmptyValue(assignmentAmt) ?
     this.commonService.replaceCurrency(assignmentAmt) : 0);
    let assignmentAmtDisplay = this.commonService.replaceCurrency(this.form.get(this.assignmentAmountField).value);
    assignmentAmtDisplay = this.currencyConverterPipe.transform(assignmentAmtDisplay.toString(), this.currency);
    if (this.commonService.isNonEmptyValue(assignmentAmtFloatValue) &&
     this.commonService.isNonEmptyValue(assignmentAmt) && assignmentAmtFloatValue <= 0) {
      this.form.get(this.assignmentAmountField).clearValidators();
      this.form.addFCCValidators(this.assignmentAmountField,
        Validators.compose([Validators.required, zeroAmount]), 0);
      this.form.get(this.assignmentAmountField).setErrors({ zeroAmount: true });
      this.form.get(this.assignmentAmountField).markAsDirty();
      this.form.get(this.assignmentAmountField).markAsTouched();
      this.form.get(this.assignmentAmountField).updateValueAndValidity();
    } else if (this.commonService.isNonEmptyValue(assignmentAmtFloatValue) && assignmentAmtFloatValue > availableFloatAmt) {
      this.form.get(this.assignmentAmountField).clearValidators();
      this.form.addFCCValidators(this.assignmentAmountField,
        Validators.compose([Validators.required, assignmentAmtGreaterThanAvailableAmt]), 0);
      this.form.get(this.assignmentAmountField).setErrors({ assignmentAmtGreaterThanAvailableAmt: true });
      this.form.get(this.assignmentAmountField).markAsDirty();
      this.form.get(this.assignmentAmountField).markAsTouched();
      this.form.get(this.assignmentAmountField).setValue(assignmentAmtDisplay);
      this.form.get(this.assignmentAmountField).updateValueAndValidity();
    } else if (this.commonService.isNonEmptyValue(assignmentAmtFloatValue) &&
    assignmentAmtFloatValue > 0 && assignmentAmtFloatValue < availableFloatAmt) {
      if (this.form.get(this.assignmentAmountField).hasError('invalidAmt')) {
            this.form.get(this.assignmentAmountField).setValue(assignmentAmtDisplay);
            this.form.get(this.assignmentAmountField).setErrors({ invalidAmt: true });
      } else {
        this.form.get(this.assignmentAmountField).clearValidators();
        this.form.get(this.assignmentAmountField).setValue(assignmentAmtDisplay);
        this.form.get(this.assignmentAmountField).updateValueAndValidity();
      }
    } else if (this.commonService.isNonEmptyValue(assignmentAmtFloatValue) &&
    assignmentAmtFloatValue > 0 && assignmentAmtFloatValue === availableFloatAmt) {
      this.form.get('fullAssignment').setValue(FccBusinessConstantsService.YES);
      this.form.get(this.assignmentAmountField)[this.params][this.readonly] = true;
    } else if (!(this.commonService.isNonEmptyValue(this.form.get(this.assignmentAmountField).value) &&
    this.form.get(this.assignmentAmountField).value !== '')) {
      this.form.get(this.assignmentAmountField).clearValidators();
      this.form.addFCCValidators(this.assignmentAmountField,
        Validators.compose([Validators.required]), 0);
      this.form.get(this.assignmentAmountField).markAsDirty();
      this.form.get(this.assignmentAmountField).markAsTouched();
      this.form.get(this.assignmentAmountField).updateValueAndValidity();
    }
  }


  updateAssigneeEntityValue() {
    if (this.form.get('assigneeEntity').value) {
      const assigneeEntity = this.stateService.getValue(FccGlobalConstant.SR_ASSIGNMENT_CONDITIONS, 'assigneeEntity', false);
      const beneFilterLength = (this.beneficiaries.filter(task => task.value === this.form.value.assigneeEntity)).length;
      if (assigneeEntity && this.beneficiaries !== undefined && this.beneficiaries.length > 0 && beneFilterLength > 0) {
        const entityFilteredValue = this.beneficiaries.filter(task => task.label === assigneeEntity)[0].value;
        if (entityFilteredValue) {
          this.form.get('assigneeEntity').setValue(entityFilteredValue);
        } else {
          this.form.get('assigneeEntity').setValue('');
        }
      } else {
        this.form.get('assigneeEntity').setValue(this.form.get('assigneeEntity').value);
      }
    }
    else if (this.benePreviousValue !== undefined && this.benePreviousValue !== null) {
      this.form.get('assigneeEntity').setValue(this.benePreviousValue);
    }
    this.updateBeneSaveToggleDisplay();
  }

  updateBeneSaveToggleDisplay(){

    if (this.benePreviousValue !== undefined &&
      (this.mode === FccGlobalConstant.DRAFT_OPTION)){
      this.checkBeneSaveAllowedForAmend(this.benePreviousValue.name);
      if (this.saveTogglePreviousValue === FccBusinessConstantsService.YES && this.beneAbbvPreviousValue){
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
      }
    }
    const beneAbbvNameValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
    if (beneAbbvNameValue !== null && beneAbbvNameValue !== FccGlobalConstant.EMPTY_STRING){
      if (this.benePreviousValue &&
        !(this.entityNameList.includes(this.benePreviousValue.name ? this.benePreviousValue.name : this.benePreviousValue))){
        this.onBlurBeneAbbvName();
      }else{
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = true;
        this.clearBeneAbbvValidator();
      }
    }
  }

  onClickPhraseIcon(event, key) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SR, key, '', true);
  }

  // method to check if adhoc beneficiary save can be performed for amend
  checkBeneSaveAllowedForAmend(beneAmendValue: any) {
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
    if (this.syBeneAdd && this.entityNameList !== undefined && this.entityNameList.length > 0
      && beneAmendValue !== FccGlobalConstant.EMPTY_STRING && (this.entityNameList.indexOf(beneAmendValue) === -1)){
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = false;
      if (this.form.get('assigneeEntity').value !== undefined
        && this.form.get('assigneeEntity').value !== FccGlobalConstant.EMPTY_STRING){
          this.form.get('assigneeName').setValue(this.form.get('assigneeEntity').value);
        }
      this.onClickBeneficiarySaveToggle();
    }
    else {
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
        this.clearBeneAbbvValidator();
    }
  }

     // method to check if adhoc beneficiary save can be performed
     checkBeneSaveAllowed(){
      this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
      this.toggleVisibilityChange.subscribe(value => {
        this.beneEditToggleVisible = value;

        if (this.syBeneAdd && this.beneEditToggleVisible){
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = false;
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
        if (this.form.get('assigneeEntity').value !== undefined
        && this.form.get('assigneeEntity').value !== FccGlobalConstant.EMPTY_STRING){
          this.form.get('assigneeName').setValue(this.form.get('assigneeEntity').value);
        }
        this.onClickBeneficiarySaveToggle();
      }
      else{
        if (!this.syBeneAdd || !this.beneEditToggleVisible){
          this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = false;
          this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
          this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
          this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
          this.clearBeneAbbvValidator();
        }
      } });
    }
    // clear bene abbv validator
    clearBeneAbbvValidator()
    {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).clearValidators();
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
    }
    // Display bene abbv name after turning on bene save toggle
    onClickBeneficiarySaveToggle() {
      this.beneAbbvName = FccGlobalConstant.BENE_ABBV_NAME;
      const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
      if (togglevalue === FccBusinessConstantsService.NO) {
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setValue(FccGlobalConstant.EMPTY_STRING);
        this.clearBeneAbbvValidator();
      }
      else {
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = false;
        this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
          Validators.compose([Validators.required, Validators.pattern(FccGlobalConstant.SPACE_REGEX)]), 0);
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
      }
    }

    // to create adhoc beneficiary object for Amend
    getCounterPartyObjectForAmend(form: FCCFormGroup): CounterpartyRequest {
      let beneName: string;
      if (form.get('assigneeEntity').value.name !== undefined){
      beneName = form.get('assigneeEntity').value.name;
    } else {
      beneName = form.get('assigneeEntity').value;
    }
      const counterpartyRequest: CounterpartyRequest = {
        name: this.commonService.validateValue(beneName),
        shortName: this.commonService.validateValue(form.get(FccGlobalConstant.BENE_ABBV_NAME).value),
        swiftAddress: {
          line1: this.commonService.validateValue(form.get(FccGlobalConstant.ASSIGNEE_BENEFICIARY_ADDRESS_1).value),
          line2: this.commonService.validateValue(form.get(FccGlobalConstant.ASSIGNEE_BENEFICIARY_ADDRESS_2).value),
          line3: this.commonService.validateValue(form.get(FccGlobalConstant.ASSIGNEE_BENEFICIARY_ADDRESS_3).value),
        },
        country: FccGlobalConstant.DEFAULT_COUNTRY,
        entityShortName: FccGlobalConstant.ENTITY_DEFAULT,
      };
      return counterpartyRequest;
    }

      // to create adhoc beneficiary object
      getCounterPartyObject(form: FCCFormGroup): CounterpartyRequest {
        const counterpartyRequest: CounterpartyRequest = {
          name: this.commonService.validateValue(form.get('assigneeEntity').value),
          shortName: this.commonService.validateValue(form.get(FccGlobalConstant.BENE_ABBV_NAME).value),
          swiftAddress: {
            line1: this.commonService.validateValue(form.get(FccGlobalConstant.ASSIGNEE_BENEFICIARY_ADDRESS_1).value),
            line2: this.commonService.validateValue(form.get(FccGlobalConstant.ASSIGNEE_BENEFICIARY_ADDRESS_2).value),
            line3: this.commonService.validateValue(form.get(FccGlobalConstant.ASSIGNEE_BENEFICIARY_ADDRESS_3).value),
          },
          country: FccGlobalConstant.DEFAULT_COUNTRY,
          entityShortName: FccGlobalConstant.ENTITY_DEFAULT,
        };
        return counterpartyRequest;
      }

    // validation on change of beneAbbvName field
    onBlurBeneAbbvName() {
      const abbvName = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors(null);
      if (this.abbvNameList.includes(abbvName) && !this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly]) {
      if (this.abbvNameList.indexOf(abbvName) === -1) {
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ duplicateCounterpartyAbbvName: { abbvName } });
      }
      }
      this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
      Validators.compose([Validators.required, Validators.pattern(this.beneAbbvNameRegex)]), 0);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();

      if ((abbvName.split(' ').length-1) !== 0) {
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ whiteSpaceNotAllowed: { abbvName } });
      }
    }
}

