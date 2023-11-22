import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FCCFormGroup } from '../../../../../../app/base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../../app/common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../app/common/core/fcc-global-constants';
import { BankDetails } from '../../../../../../app/common/model/bankDetails';
import { CorporateDetails } from '../../../../../../app/common/model/corporateDetails';
import { CounterpartyDetailsList } from '../../../../../../app/common/model/counterpartyDetailsList';
import { CountryList } from '../../../../../../app/common/model/countryList';
import { Entities } from '../../../../../../app/common/model/entities';
import { References } from '../../../../../../app/common/model/references';
import { CommonService } from '../../../../../../app/common/services/common.service';
import { DropDownAPIService } from '../../../../../../app/common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../app/common/services/event-emitter-service';
import { FormModelService } from '../../../../../../app/common/services/form-model.service';
import { MultiBankService } from '../../../../../../app/common/services/multi-bank.service';
import { SessionValidateService } from '../../../../../../app/common/services/session-validate-service';
import { LeftSectionService } from '../../../../../../app/corporate/common/services/leftSection.service';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { CorporateCommonService } from '../../../../common/services/common.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { LcReturnService } from '../../../lc/initiation/services/lc-return.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { TfProductComponent } from '../tf-product/tf-product/tf-product.component';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { TfProductService } from '../../services/tf-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'app-tf-applicant-financing-bank',
  templateUrl: './tf-applicant-financing-bank.component.html',
  styleUrls: ['./tf-applicant-financing-bank.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TfApplicantFinancingBankComponent }]
})
export class TfApplicantFinancingBankComponent extends TfProductComponent implements OnInit {

  @Output() messageToEmit = new EventEmitter<string>();

  marginallSide = 'margin-all-side';
  lcConstant = new LcConstant();
  form: FCCFormGroup;
  appBenNameRegex;
  module = `${this.translateService.instant('tfApplicantFinancingBankDetails')}`;
  contextPath: any;
  appBenAddressRegex;
  appBenNameLength;
  appBenFullAddrLength: any;
  mode = this.lcConstant.mode;
  params = this.lcConstant.params;
  maxlength = this.lcConstant.maximumlength;
  rendered = this.lcConstant.rendered;
  beneLengthWithoutEntity = FccGlobalConstant.LENGTH_200;
  disableDropDown = false;
  length35 = FccGlobalConstant.LENGTH_35;
  entities = [];
  address = [];
  entity: Entities;
  countryList: CountryList;
  counterpartyDetailsList: CounterpartyDetailsList;
  corporateDetails: CorporateDetails;
  readonly = this.lcConstant.readonly;
  lcMode: string;
  autoDisplayFirst = this.lcConstant.autoDisplayFirst;
  responseStatusCode = 200;
  tnxTypeCode: any;
  bankDetails: BankDetails;
  corporateBanks = [];
  references: References;
  entityName: any;
  private readonly VALUE = 'value';
  corporateReferences = [];
  language = localStorage.getItem('language');
  productCode: any;
  entityAddressType: any;
  disabled = this.lcConstant.disabled;
  nameOrAbbvName: any;

  mandatoryFileds = ['applicantEntity', 'applicantName', 'applicantSecondAddress', 'applicantFirstAddress',
                     'applicantFullAddress'];
  constructor(
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected router: Router,
    protected leftSectionService: LeftSectionService,
    protected lcReturnService: LcReturnService,
    protected utilityService: UtilityService,
    protected corporateCommonService: CorporateCommonService,
    protected sessionValidation: SessionValidateService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected prevNextService: PrevNextService,
    protected saveDraftService: SaveDraftService,
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected stateService: ProductStateService,
    protected emitterService: EventEmitterService,
    protected multiBankService: MultiBankService,
    protected dropdownAPIService: DropDownAPIService,
    protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected resolverService: ResolverService,
    protected fileArray: FilelistService,
    protected dialogRef: DynamicDialogRef,
    protected taskService: FccTaskService,
    protected currencyConverterPipe: CurrencyConverterPipe, protected tfProductService: TfProductService) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray, dialogRef,
      currencyConverterPipe, tfProductService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameOrAbbvName = response.TradeIssuingBankNameOrAbbvName;
      }
    });
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    window.scroll(0, 0);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    const subProductCodeValueTF = this.stateService.getControl(FccGlobalConstant.TF_GENERAL_DETAILS,
      FccGlobalConstant.TYPE_OF_FINANCING_LIST, false);
    this.commonService.getAddressBasedOnParamData(FccGlobalConstant.PARAMETER_P347, this.productCode,
      subProductCodeValueTF.value.label);
    this.initializeFormGroup();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.appBenNameRegex = response.BeneficiaryNameRegex;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.nameTradeLength;
        this.appBenFullAddrLength = response.nonSwiftAddrLength;
        // if (this.language !== FccGlobalConstant.LANGUAGE_AR){
        //   this.form.addFCCValidators('applicantName', Validators.pattern(this.appBenAddressRegex), 0 );
        //   this.form.addFCCValidators('applicantFirstAddress', Validators.pattern(this.appBenAddressRegex), 0 );
        //   this.form.addFCCValidators( 'applicantSecondAddress',  Validators.pattern(this.appBenAddressRegex), 0);
        //   this.form.addFCCValidators(
        //     'applicantThirdAddress',
        //     Validators.pattern(this.appBenAddressRegex),
        //     0
        //   );
        //   this.form.addFCCValidators(
        //     'applicantFullAddress',
        //     Validators.pattern(this.appBenAddressRegex),
        //     0
        //   );
        // }
        this.form.addFCCValidators('applicantName', Validators.maxLength(this.appBenNameLength), 0 );
        this.form.addFCCValidators('applicantFirstAddress', Validators.maxLength(this.appBenNameLength), 0 );
        this.form.addFCCValidators(
          'applicantSecondAddress',
          Validators.maxLength(this.appBenNameLength),
          0
        );
        this.form.addFCCValidators(
          'applicantThirdAddress',
          Validators.maxLength(this.appBenNameLength),
          0
        );
        this.form.addFCCValidators(
          'applicantFullAddress',
          Validators.maxLength(this.appBenFullAddrLength),
          0
        );
        this.form.get('applicantName')[this.params][this.maxlength] = this.multiBankService.getIsEntity()
        ? this.appBenNameLength : this.beneLengthWithoutEntity;
        this.form.updateValueAndValidity();
        this.form.markAllAsTouched();
        }
      });
    this.getCorporateBanks();
    const applicantReference = this.commonService.getTfApplicantReference();
    if (this.commonService.isEmptyValue(applicantReference)) {
      this.getCorporateReferences();
    } else {
      const applicantReferenceList = [];
      applicantReferenceList.push({ label: applicantReference, value: applicantReference });
      this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: applicantReferenceList });
      this.form.get('issuerReferenceList').setValue(applicantReference);
      this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS][this.disabled] = true;
    }
  }

  ngOnDestroy() {
    this.stateService.setStateSection('tfApplicantFinancingBankDetails', this.form);
  }

  onClickNext() {
    this.handleNextPreviousEvent();
  }

  onClickPrevious() {
    this.handleNextPreviousEvent();
  }

  handleNextPreviousEvent() {
    this.saveFormObject();
    if (!CommonService.isTemplateCreation) {
    this.saveDraftService.changeSaveStatus('tfApplicantFinancingBankDetails',
      this.stateService.getSectionData('tfApplicantFinancingBankDetails'));
    }
  }

  saveFormObject() {
    if (this.utilityService.getMasterValue('mode') === 'draft') {
      if (this.form.get('applicantEntity').value !== undefined) {
        this.utilityService.putMasterdata('applicantEntity', this.form.get('applicantEntity').value.label);
      }
      if (this.form.get('beneficiaryEntity').value !== undefined) {
        this.utilityService.putMasterdata('beneficiaryEntity', this.form.get('beneficiaryEntity').value.label);
      }
      if (this.form.get('altApplicantcountry').value !== undefined) {
        this.utilityService.putMasterdata('altApplicantcountry', this.form.get('altApplicantcountry').value.label);
      }
    }
    this.stateService.setStateSection('tfApplicantFinancingBankDetails', this.form);
  }

  getUserEntities() {
    this.updateUserEntities();
  }

  onClickApplicantEntity() {
    const entity = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value;
    if (entity) {
    this.multiBankService.setCurrentEntity(entity.shortName);
    this.taskService.setTaskEntity(entity);
    this.form.get('applicantName').setValue(entity.name);
    this.entityName = entity.shortName;
    const entityAddress = this.multiBankService.getAddress(entity.shortName);
    this.entities.forEach(value => {
      if (entity.shortName === value.value.shortName) {
        if (entityAddress.Address !== undefined) {
        this.patchFieldValueAndParameters(this.form.get('applicantFirstAddress'), entityAddress.Address.line1, '');
        this.patchFieldValueAndParameters(this.form.get('applicantSecondAddress'), entityAddress.Address.line2, '');
        this.patchFieldValueAndParameters(this.form.get('applicantThirdAddress'), entityAddress.Address.line3, '');
        }
      }
    });
    }
    this.getCorporateBanks();
    const applicantReference = this.commonService.getTfApplicantReference();
    if (this.commonService.isEmptyValue(applicantReference)) {
      this.getCorporateReferences();
    } else {
      const applicantReferenceList = [];
      applicantReferenceList.push({ label: applicantReference, value: applicantReference });
      this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: applicantReferenceList });
      this.form.get('issuerReferenceList').setValue(applicantReference);
      this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS][this.disabled] = true;
    }
  }

  initializeFormGroup() {
      const sectionName = 'tfApplicantFinancingBankDetails';
      this.form = this.stateService.getSectionData(sectionName);
      this.getUserEntities();
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        this.patchFieldParameters(this.form.get('applicantEntity'), { options: this.entities });
      }
      if (this.commonService.isnonEMptyString(this.form.get('applicantEntity').value)) {
        this.form.get('applicantEntity')[this.params][this.rendered] = true;
        this.togglePreviewScreen(this.form, ['applicantEntity'], true);
      }
  }

  updateUserEntities() {
    this.multiBankService.getEntityList().forEach(entity => {
      this.entities.push(entity);
    });

    const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, 'applicantEntity', this.form);
    if (valObj && !this.taskService.getTaskEntity()) {
      this.form.get('applicantEntity').patchValue(valObj[this.VALUE]);
      this.multiBankService.setCurrentEntity(valObj[this.VALUE].shortName);
    } else if (this.taskService.getTaskEntity()){
      this.form.get('applicantEntity').patchValue(this.taskService.getTaskEntity());
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
          this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)){
          this.form.get('applicantName').setValue(this.taskService.getTaskEntity().name);
      }
    }

    if (this.entities.length === 0) {
      this.form.get('applicantName')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('applicantFirstAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('applicantSecondAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('applicantThirdAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      if (this.form.get('applicantEntity')) {
        this.form.get('applicantEntity')[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, 'applicantEntity', false);
        this.form.get('applicantEntity').clearValidators();
        this.form.get('applicantEntity').updateValueAndValidity();
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
       (this.form.get(FccGlobalConstant.APPLICANT_NAME).value === undefined ||
        this.form.get(FccGlobalConstant.APPLICANT_NAME).value === null ||
        this.form.get(FccGlobalConstant.APPLICANT_NAME).value === FccGlobalConstant.EMPTY_STRING)) {
          this.corporateCommonService.getValues(this.fccGlobalConstantService.corporateDetails).subscribe(response => {
            if (response.status === this.responseStatusCode) {
              this.corporateDetails = response.body;
              if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
              this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)){
                this.form.get('applicantName').setValue(this.corporateDetails.name);
              }
              if (this.commonService.addressType && this.commonService.addressType === FccGlobalConstant.POSTAL_ADDRESS_PA) {
                this.entityAddressType = FccGlobalConstant.POSTAL_ADDRESS;
              } else {
                this.entityAddressType = FccGlobalConstant.SWIFT_ADDRESS;
              }
              if (response.body[this.entityAddressType]) {
                this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).setValue(response.body[this.entityAddressType].line1);
                this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).setValue(response.body[this.entityAddressType].line2);
                this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).setValue(response.body[this.entityAddressType].line3);
              }
            }
          });
      }
    } else if (this.entities.length === 1) {
      this.form.get('applicantEntity').setValue({ label: this.entities[0].value.label, name: this.entities[0].value.name,
         shortName: this.entities[0].value.shortName });
      this.form.get('applicantEntity')[this.params][this.readonly] = true;
      this.multiBankService.setCurrentEntity(this.entities[0].value.shortName);
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
          this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)){
        this.form.get('applicantName').setValue(this.entities[0].value.name);
      }
      this.entityName = this.entities[0].value.shortName;
      const entityAddress = this.multiBankService.getAddress(this.entities[0].value.shortName);
      if (entityAddress.Address !== undefined) {
        if ((this.form.get('applicantFirstAddress').value === undefined) || (this.form.get('applicantFirstAddress').value === null) ||
        (this.form.get('applicantFirstAddress').value === '')){
          this.patchFieldValueAndParameters(this.form.get('applicantFirstAddress'), entityAddress.Address.line1, '');
        }
        if ((this.form.get('applicantSecondAddress').value === undefined) || (this.form.get('applicantSecondAddress').value === null) ||
        (this.form.get('applicantSecondAddress').value === '')){
          this.patchFieldValueAndParameters(this.form.get('applicantSecondAddress'), entityAddress.Address.line2, '');
        }
        if ((this.form.get('applicantThirdAddress').value === undefined) || (this.form.get('applicantThirdAddress').value === null) ||
        (this.form.get('applicantThirdAddress').value === '')){
          this.patchFieldValueAndParameters(this.form.get('applicantThirdAddress'), entityAddress.Address.line3, '');
        }
      }
      this.getCorporateBanks();
      const applicantReference = this.commonService.getTfApplicantReference();
      if (this.commonService.isEmptyValue(applicantReference)) {
        this.getCorporateReferences();
      } else {
        const applicantReferenceList = [];
        applicantReferenceList.push({ label: applicantReference, value: applicantReference });
        this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: applicantReferenceList });
        this.form.get('issuerReferenceList').setValue(applicantReference);
        this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS][this.disabled] = true;
      }
      this.form.get('applicantName')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('applicantFirstAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('applicantSecondAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('applicantThirdAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
    } else if (this.entities.length > 1) {
      this.form.get('applicantEntity')[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get('applicantEntity')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get('applicantName')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('applicantFirstAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('applicantSecondAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('applicantThirdAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.getCorporateBanks();
      if ((this.form.get('applicantEntity').value === undefined) || (this.form.get('applicantEntity').value === null) ||
            (this.form.get('applicantEntity').value === '')) {

        const sectionName = 'tfGeneralDetails';
        let type;
        type = this.stateService.getSectionData(sectionName);
        type = type.controls.requestOptionsTF.value;
        if ( type !== '03') {
        this.setEntityFromLC();
       }
      }
    }
  }

  setEntityFromLC() {
    const entityName = this.commonService.getLcResponse().entity;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let entityValue: any;
    const entity = this.entities.find( item => {
      entityValue = item.value.name;
      return item.value.shortName === entityName;
    });
    const entityAddress = this.multiBankService.getAddress(entity.value.shortName);
    this.form.get('applicantEntity').setValue({ label: entity.value.label, name: entity.value.name, shortName: entity.value.shortName });
    this.multiBankService.setCurrentEntity(entity.value.shortName);
    this.form.get('applicantName').setValue(entity.value.name);
    this.taskService.setTaskEntity(entity.value);
    if (entityAddress.Address !== undefined) {
      if ((this.form.get('applicantFirstAddress').value === undefined) || (this.form.get('applicantFirstAddress').value === null) ||
        (this.form.get('applicantFirstAddress').value === '')){
          this.patchFieldValueAndParameters(this.form.get('applicantFirstAddress'), entityAddress.Address.line1, '');
      }
      if ((this.form.get('applicantSecondAddress').value === undefined) || (this.form.get('applicantSecondAddress').value === null) ||
        (this.form.get('applicantSecondAddress').value === '')){
          this.patchFieldValueAndParameters(this.form.get('applicantSecondAddress'), entityAddress.Address.line2, '');
      }
      if ((this.form.get('applicantThirdAddress').value === undefined) || (this.form.get('applicantThirdAddress').value === null) ||
        (this.form.get('applicantThirdAddress').value === '')){
          this.patchFieldValueAndParameters(this.form.get('applicantThirdAddress'), entityAddress.Address.line3, '');
      }
    }
    this.entityName = entity.value.shortName;
    const applicantReference = this.commonService.getTfApplicantReference();
    if (this.commonService.isEmptyValue(applicantReference)) {
      this.getCorporateReferences();
    } else {
      const applicantReferenceList = [];
      applicantReferenceList.push({ label: applicantReference, value: applicantReference });
      this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: applicantReferenceList });
      this.form.get('issuerReferenceList').setValue(applicantReference);
      this.form.get('issuerReferenceList')[FccGlobalConstant.PARAMS][this.disabled] = true;
    }
  }

  getCorporateBanks() {
    this.setBankNameList();
    const defaultFirst = (this.corporateBanks && this.corporateBanks.length === 1) ? true : false;
    const val = this.dropdownAPIService.getInputDropdownValue(this.corporateBanks,
      'bankNameList', this.form, defaultFirst);
    this.patchFieldParameters(this.form.get('bankNameList'), { options: this.corporateBanks });
    if (val && this.commonService.isnonEMptyString(val)) {
      this.form.get('bankNameList').setValue(val);
    }
    if (this.corporateBanks.length === 1) {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.BANK_NAME_LIST)[FccGlobalConstant.PARAMS][this.disabled] = false;
    }
    if (val && this.commonService.isnonEMptyString(val)) {
      this.multiBankService.setCurrentBank(val);
    }
    if (this.taskService.getTaskBank()) {
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
      if (this.mode == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY ||
        this.operation == FccGlobalConstant.PREVIEW ) {
      const valObj = { label: String, value: String };
      const valueDisplayed = this.dropdownAPIService
      .getDropDownFilterValueObj(this.corporateBanks, FccGlobalConstant.BANK_NAME_LIST, this.form);
      valObj.label = valueDisplayed ? valueDisplayed[FccGlobalConstant.LABEL] : '';
      if (valObj) {
        this.form.get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
      if(this.stateService
        .getSectionData(FccGlobalConstant.TF_APPLICANT_BANK_DETAILS_SECTION, undefined, false, FccGlobalConstant.EVENT_STATE))
      {
        this.stateService
        .getSectionData(FccGlobalConstant.TF_APPLICANT_BANK_DETAILS_SECTION, undefined, false, FccGlobalConstant.EVENT_STATE)
        .get(FccGlobalConstant.BANK_NAME_LIST).setValue(valObj.label);
      }
      }
    }
    }
    
    if (this.commonService.getUserDateTimezone() &&
      this.commonService.getUserDateTimezone().getValue() &&
      this.commonService.getUserDateTimezone().getValue() !== this.taskService.getTaskBank()?.timezone) {
      this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    } else {
      this.form.get('bankTimezoneMessage')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
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
    if (event && event.value && this.form.get('bankNameList') && !this.form.get('bankNameList')[this.params][this.disabled]) {
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
        this.setIssuerReferenceList();
      }
    }

  setIssuerReferenceList() {
    this.corporateReferences = [];
    const referenceList = this.multiBankService.getReferenceList();
    referenceList.forEach(reference => {
      this.corporateReferences.push(reference);
    });
    const isDefaultFirst = this.corporateReferences.length === FccGlobalConstant.LENGTH_1;
    let val = this.dropdownAPIService.getInputDropdownValue(this.corporateReferences, 'issuerReferenceList', this.form, isDefaultFirst);
    this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: this.corporateReferences });
    val = this.multiBankService.updateRefonEntityChange && !isDefaultFirst ? '' : val;
    this.form.get('issuerReferenceList').setValue(val);
    if (this.corporateReferences.length === 1) {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.disabled] = true;
    } else {
      this.form.get(FccGlobalConstant.ISSUER_REF_LIST)[this.params][this.disabled] = false;
    }
    if (this.mode == FccGlobalConstant.VIEW && this.operation == FccGlobalConstant.LIST_INQUIRY ||
      this.operation == FccGlobalConstant.PREVIEW ) {
    const valObj = { label: String, value: String };
    const valueDisplayed = this.dropdownAPIService
    .getDropDownFilterValueObj(this.corporateReferences, FccGlobalConstant.ISSUER_REFERENCE_LIST, this.form);
    valObj.label = valueDisplayed ? valueDisplayed[FccGlobalConstant.LABEL] : '';
    if (valObj) {
      this.form.get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
    if(this.stateService
      .getSectionData(FccGlobalConstant.TF_APPLICANT_BANK_DETAILS_SECTION, undefined, false, FccGlobalConstant.EVENT_STATE))
    {
      this.stateService.getSectionData(FccGlobalConstant.TF_APPLICANT_BANK_DETAILS_SECTION, undefined, false, FccGlobalConstant.EVENT_STATE)
      .get(FccGlobalConstant.ISSUER_REFERENCE_LIST).setValue(valObj.label);
    }
  }
}
  }

  getCorporateReferences() {
    this.patchFieldParameters(this.form.get('issuerReferenceList'), { options: [] });
    if (this.entityName === '') {
      this.form.get('issuerReferenceList')[this.params][this.readonly] = true;
    } else {
      this.form.get('issuerReferenceList')[this.params][this.readonly] = false;
    }
    this.setIssuerReferenceList();
    }

}
