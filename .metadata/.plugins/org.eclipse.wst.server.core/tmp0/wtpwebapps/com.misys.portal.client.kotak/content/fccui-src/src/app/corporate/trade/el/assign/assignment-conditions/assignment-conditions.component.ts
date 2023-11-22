import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { CounterpartyRequest } from '../../../../../common/model/counterpartyRequest';
import { CounterpartyDetailsList } from '../../../../../../app/common/model/counterpartyDetailsList';
import { FccGlobalConfiguration } from '../../../../../common/core/fcc-global-configuration';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import {
  amountCanNotBeZero,
  assignmentAmtGreaterThanAvailableAmt,
} from '../../../lc/initiation/validator/ValidateAmt';
import { ElProductComponent } from '../../el-product/el-product.component';
import { FCCFormGroup } from './../../../.../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../common/services/form-model.service';
import { PhrasesService } from './../../../../../common/services/phrases.service';
import { CorporateCommonService } from './../../../../../corporate/common/services/common.service';
import { LeftSectionService } from './../../../../../corporate/common/services/leftSection.service';
import { ElProductService } from '../../services/el-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'app-assignment-conditions',
  templateUrl: './assignment-conditions.component.html',
  styleUrls: ['./assignment-conditions.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: AssignmentConditionsComponent }]
})
export class AssignmentConditionsComponent extends ElProductComponent implements OnInit {

  form: FCCFormGroup;
  lcConstant = new LcConstant();
  module = `${this.translateService.instant(FccGlobalConstant.ASSIGNMENT_CONDITIONS)}`;
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
  validatorPattern = FccGlobalConstant.AMOUNT_VALIDATION;
  productCode: any;
  responseStatusCode = 200;
  counterpartyDetailsList: CounterpartyDetailsList;
  beneficiaries = [];
  lcAmount;
  currency;
  assignmentAmount;
  allowedDecimals = -1;
  assignmentAmountField = 'assignmentAmount';
  utilizedAmount;
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
  transmissionMode: any;
  flagDecimalPlaces;
  beneEditToggleVisible = false;
  syBeneAdd: any;
  benePreviousValue: any;
  abbvNameList = [];
  entityAddressType: any;
  saveTogglePreviousValue: any;
  beneAbbvPreviousValue: any;
  entityNameList = [];
  assineeName: any;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService, protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected utilityService: UtilityService,
              protected fccGlobalConfiguration: FccGlobalConfiguration, protected stateService: ProductStateService,
              protected eventEmitterService: EventEmitterService, protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected phrasesService: PhrasesService,
              protected searchLayoutService: SearchLayoutService, protected resolverService: ResolverService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected elProductService: ElProductService) {
                super(eventEmitterService, stateService, commonService, translateService, confirmationService,
                      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileList,
                      dialogRef, currencyConverterPipe, elProductService);
  }

  ngOnInit(): void {
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    // this.transmissionMode = this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode').value;
    this.initializeFormGroup();
    //this.checkBeneSaveAllowed();
    this.getBeneficiaries();
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response.response && response.response === 'REST_API_SUCCESS') {
          this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
        }
      });
    }
    this.updateValues();
    this.lcAmount = this.stateService.getValue(FccGlobalConstant.ASSIGNMENT_CONDITIONS, 'lcAmount', false);
    this.currency = this.stateService.getValue(FccGlobalConstant.ASSIGNMENT_CONDITIONS, 'currency', false);
    this.lcAmount = this.commonService.replaceCurrency(this.lcAmount);
    if (this.commonService.isNonEmptyValue(this.form.get('utilizedAmount').value) &&
     this.commonService.isNonEmptyValue(this.currency)) {
      this.utilizedAmount = this.commonService.replaceCurrency(this.form.get('utilizedAmount').value);
      this.utilizedAmount = this.currencyConverterPipe.transform(this.utilizedAmount.toString(), this.currency);
    }
    if (this.utilizedAmount === '') {
      this.utilizedAmount = FccGlobalConstant.ZERO_STRING;
    }
    const orgAmountValue = this.currencyConverterPipe.transform(this.lcAmount, this.currency);
    this.form.get('amount').setValue(this.currency.concat(' ').concat(orgAmountValue));
    this.form.addFCCValidators(this.assignmentAmountField,
      Validators.compose([Validators.required, Validators.pattern(this.validatorPattern)]), 0);
    this.form.get('currency')[this.params][this.rendered] = true;
    this.form.get(this.assignmentAmountField)[this.params][this.rendered] = true;
    this.setAssignmentAmtNull = false;
    this.form.addFCCValidators(this.assignmentAmountField,
      Validators.compose([Validators.required, Validators.pattern(this.validatorPattern)]), 0);
    this.populateAmountFields();
    this.updateAssigneeEntityValue();
    this.updateNarrativeCount();
    if (this.form.get('assigneeEntity').value !== undefined && this.form.get('assigneeEntity').value !== FccGlobalConstant.EMPTY_STRING) {
      this.benePreviousValue = this.form.get('assigneeEntity').value;
      this.assineeName = this.form.get('assigneeEntity').value;
      if (this.assineeName && this.assineeName !== null &&
        this.assineeName.value && this.assineeName.value !== null) {
        this.form.get(FccGlobalConstant.ASSIGNEE_BENEFICIARY_NAME).setValue(this.assineeName.value);
        this.form.get(FccGlobalConstant.ASSIGNEE_NAME).setValue(this.assineeName.value);
      } else {
        this.form.get(FccGlobalConstant.ASSIGNEE_BENEFICIARY_NAME).setValue(this.assineeName);
        this.form.get(FccGlobalConstant.ASSIGNEE_NAME).setValue(this.assineeName);
      }

      this.form.get('assigneeName').updateValueAndValidity();
    }
    if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) && this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value) {
      this.saveTogglePreviousValue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
    }
    if (this.form.get(FccGlobalConstant.BENE_ABBV_NAME) &&
    this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value) &&
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value !== FccGlobalConstant.EMPTY_STRING) {
     this.beneAbbvPreviousValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
    }

          this.form.markAllAsTouched();
          this.form.updateValueAndValidity();

          this.form.get('assigneeEntity').clearValidators();
          this.form.get('assigneeEntity').updateValueAndValidity();
          this.form.get('assigneeFirstAddress').clearValidators();
          this.form.get('assigneeFirstAddress').updateValueAndValidity();

  }



  updateNarrativeCount() {
    if (this.form.get('customerInstructions').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('customerInstructions').value);
      this.form.get('customerInstructions')[this.params][this.enteredCharCount] = count;
    }
  }

  initializeFormGroup() {
  const sectionName = FccGlobalConstant.ASSIGNMENT_CONDITIONS;
  this.form = this.stateService.getSectionData(sectionName);
  this.setAmountLengthValidator(this.assignmentAmountField);
  }

  onClickFullAssignment() {
    const toggleValue = this.form.get('fullAssignment').value;
    const remainingAvailableAmount = +this.commonService.replaceCurrency(this.lcAmount) -
    +this.commonService.replaceCurrency(this.utilizedAmount);
    const availableAmount = this.currencyConverterPipe.transform(remainingAvailableAmount.toString(), this.currency);
    this.form.get('availableAmount').setValue(this.currency.concat(' ').concat(availableAmount));
    if (toggleValue === FccBusinessConstantsService.NO) {
      this.form.get(this.assignmentAmountField).setValue('');
      this.form.get(this.assignmentAmountField)[this.params][this.readonly] = false;
      this.form.controls[this.assignmentAmountField].enable();
    } else {
      this.form.get(this.assignmentAmountField).setValue(availableAmount);
      this.form.get(this.assignmentAmountField)[this.params][this.readonly] = true;
      this.form.controls[this.assignmentAmountField].disable();
      this.form.get(this.assignmentAmountField).setErrors(null);
      this.form.get(this.assignmentAmountField).clearValidators();
    }
    this.assignmentAmountValidation();
    this.form.get(this.assignmentAmountField).updateValueAndValidity();
  }

  /*validation on change of amount field*/
  onBlurAssignmentAmount() {
    this.setAmountLengthValidator(this.assignmentAmountField);
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

  onClickAssignmentAmount() {
    this.OnClickAmountFieldHandler(this.assignmentAmountField);
  }

  OnClickAmountFieldHandler(controlName: string) {
    if (this.getAmountOriginalValue(controlName)) {
      this.form.get(controlName).setValue(this.setAmountOriginalValue(controlName));
      this.form.get(controlName).updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

  setAmountOriginalValue(controlName: string) {
    if (this.form.get(controlName)) {
      this.form.get(controlName)[this.params][this.ORIGINAL_VALUE] = this.commonService.replaceCurrency(this.form.get(controlName).value);
    }
  }

  getAmountOriginalValue(controlName: string): string{
    return this.form.get(controlName)[this.params][this.ORIGINAL_VALUE];
  }
  updateValues() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameRegex = response.BeneficiaryNameRegex;
        this.addressRegex = response.BeneficiaryAddressRegex;
        this.nameLength = response.BeneficiaryNameLength;
        this.swifCodeRegex = response.bigSwiftCode;
        this.address1TradeLength = response.address1TradeLength;
        this.address2TradeLength = response.address2TradeLength;
        this.domTradeLength = response.domTradeLength;
        this.address4TradeLength = response.address4TradeLength;
        this.beneAbbvNameRegex = response.BeneficiaryAbbvNameRegex;
        this.form.get('assigneeFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        this.form.get('assigneeSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        this.form.get('assigneeThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
        this.form.get('assigneeFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
        // if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        //   this.form.addFCCValidators('assigneeFirstAddress', Validators.pattern(this.addressRegex), 0);
        //   this.form.addFCCValidators('assigneeSecondAddress', Validators.pattern(this.addressRegex), 0);
        //   this.form.addFCCValidators('assigneeThirdAddress', Validators.pattern(this.addressRegex), 0);
        //   this.swiftZCharRegex = FccGlobalConfiguration.configurationValues.get('SWIFT_VALIDATION_REGEX_ZCHAR');
        //   this.form.addFCCValidators('customerInstructions', Validators.pattern(this.swiftZCharRegex), 0);
        //   this.form.addFCCValidators('assigneeName', Validators.pattern(this.nameRegex), 0);
        // }
        this.form.get('assigneeFirstAddress').updateValueAndValidity();
        this.form.get('assigneeSecondAddress').updateValueAndValidity();
        this.form.get('assigneeThirdAddress').updateValueAndValidity();
        this.form.get('customerInstructions').updateValueAndValidity();
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
    });
  }

  getBeneficiariesAsList(body: any) {
    this.counterpartyDetailsList = body;
    this.beneficiaries = [];
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
        this.commonService.saveBeneficiary(this.getCounterPartyObject(this.form)).subscribe();
      }
    }
  }

  populateAmountFields() {
    const remainingAvailableAmount = +this.commonService.replaceCurrency(this.lcAmount) -
    +this.commonService.replaceCurrency(this.utilizedAmount);
    const availableAmount = this.currencyConverterPipe.transform(remainingAvailableAmount.toString(), this.currency);
    const availableAmountFloat = parseFloat(this.commonService.replaceCurrency(availableAmount));
    const lcAmountFloat = parseFloat(this.commonService.replaceCurrency(this.lcAmount));
    let tnxAmt = this.commonService.replaceCurrency(this.stateService.getValue(
      FccGlobalConstant.ASSIGNMENT_CONDITIONS,
      this.assignmentAmountField,
      false
    ));
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

  setAmountFields(toggleValue, assignmentAmount) {
    this.form.get(this.assignmentAmountField).clearValidators();
    this.form.get(this.assignmentAmountField).setValue(assignmentAmount);
    if (toggleValue === FccBusinessConstantsService.NO) {
      this.form.get(this.assignmentAmountField)[this.params][this.readonly] = false;
    } else {
      this.form.get(this.assignmentAmountField)[this.params][this.readonly] = true;
      this.form.controls[this.assignmentAmountField].disable();
    }
    this.assignmentAmountValidation();
    this.form.get(this.assignmentAmountField).updateValueAndValidity();
  }

  assignmentAmountValidation() {
    const originalLCAmt = this.commonService.replaceCurrency(this.lcAmount);
    const utilizedAmount = this.commonService.replaceCurrency(this.stateService.getValue(FccGlobalConstant.ASSIGNMENT_CONDITIONS,
      'utilizedAmount', false));
    const availableAmt = +originalLCAmt - +utilizedAmount;
    const availableFloatAmt = parseFloat(availableAmt.toString());
    let assignmentAmt = this.commonService.replaceCurrency(this.form.get(this.assignmentAmountField).value);
    assignmentAmt = this.currencyConverterPipe.transform(assignmentAmt.toString(), this.currency);
    const assignmentAmtFloatValue = parseFloat(assignmentAmt !== null ? this.commonService.replaceCurrency(assignmentAmt) : 0);
    if (this.commonService.isNonEmptyValue(assignmentAmtFloatValue) && this.commonService.isNonEmptyValue(assignmentAmt) !== null &&
    assignmentAmtFloatValue <= 0) {
      this.form.get(this.assignmentAmountField).clearValidators();
      const amnt = this.form.get(this.assignmentAmountField);
      amnt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      this.form.addFCCValidators(this.assignmentAmountField,
        Validators.compose([Validators.required, amountCanNotBeZero]), 0);
      this.form.get(this.assignmentAmountField).setErrors({ amountCanNotBeZero: true });
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
      this.form.get(this.assignmentAmountField).updateValueAndValidity();
    } else if (this.commonService.isNonEmptyValue(assignmentAmtFloatValue) &&
    assignmentAmtFloatValue > 0 && assignmentAmtFloatValue < availableFloatAmt) {
      if (this.form.get(this.assignmentAmountField).hasError('invalidAmt')) {
            this.form.get(this.assignmentAmountField).setErrors({ invalidAmt: true });
      } else {
        this.form.get(this.assignmentAmountField).clearValidators();
        this.form.get(this.assignmentAmountField).setValue(assignmentAmt);
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

  ngAfterViewInit() {
    if (this.form && this.commonService.isNonEmptyField(FccGlobalConstant.AMOUNT_FIELD, this.form) &&
      this.commonService.isNonEmptyValue(this.form.get('amount').value) &&
      this.commonService.isNonEmptyField( FccGlobalConstant.CURRENCY, this.form)) {
      let amount = this.form.get('amount').value;
      amount = amount.split(' ');
      this.form.get('currency').setValue(amount[0]);
      this.form.get('amount').setValue(this.currency.concat(' ').concat(amount[1]));
    }
  }

  updateAssigneeEntityValue() {
    if (this.form.get('assigneeEntity').value) {
      const assigneeEntity = this.stateService.getValue(FccGlobalConstant.ASSIGNMENT_CONDITIONS, 'assigneeEntity', false);
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

  onClickPhraseIcon(event, key) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_EL, key, '', true);
  }

  // method to check if adhoc beneficiary save can be performed
  checkBeneSaveAllowed(toggleValue){
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
      this.beneEditToggleVisible = toggleValue;
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
      }
  }

  // clear bene abbv validator
  clearBeneAbbvValidator()
  {
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).clearValidators();
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
  }

  // Display bene abbv name after turning on bene save toggle
  onClickBeneficiarySaveToggle() {
    const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
    if (togglevalue === FccBusinessConstantsService.YES) {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = false;
      this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
        Validators.compose([Validators.required, Validators.pattern(this.beneAbbvNameRegex)]), 0);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
    } else {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
      this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setValue(FccGlobalConstant.EMPTY_STRING);
      this.clearBeneAbbvValidator();
    }
  }
  // to create adhoc beneficiary object
  getCounterPartyObject(form: FCCFormGroup): CounterpartyRequest {
    const counterpartyRequest: CounterpartyRequest = {
      name: this.commonService.validateValue(form.get(FccGlobalConstant.ASSIGNEE_NAME).value),
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
    if (this.abbvNameList.indexOf(abbvName) > -1 && !this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly]) {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ duplicateCounterpartyAbbvName: { abbvName } });
    }

    this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
    Validators.compose([Validators.required, Validators.pattern(this.beneAbbvNameRegex)]), 0);
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();

    if ((abbvName.split(' ').length-1) !== 0) {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ whiteSpaceNotAllowed: { abbvName } });
    }
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
    if (beneAbbvNameValue !== undefined && beneAbbvNameValue !== null && beneAbbvNameValue !== FccGlobalConstant.EMPTY_STRING){
      if (!(this.entityNameList.includes(this.benePreviousValue?.name ? this.benePreviousValue.name : this.benePreviousValue))){
        this.onBlurBeneAbbvName();
      } else {
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = true;
        this.clearBeneAbbvValidator();
      }
    }
  }

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

}

