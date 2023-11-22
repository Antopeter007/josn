import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FccBusinessConstantsService } from '../../../../../common/core/fcc-business-constants.service';
import { CounterpartyRequest } from '../../../../../common/model/counterpartyRequest';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CorporateDetails } from '../../../../../common/model/corporateDetails';
import { CounterpartyDetailsList } from '../../../../../common/model/counterpartyDetailsList';
import { Entities } from '../../../../../common/model/entities';
import { CommonService } from '../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';
import { MultiBankService } from '../../../../../common/services/multi-bank.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { ImportLetterOfCreditResponse } from '../../../lc/initiation/model/models';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { SgProductComponent } from '../../sg-product/sg-product.component';
import { CorporateCommonService } from './../../../../../corporate/common/services/common.service';
import { Validators } from '@angular/forms';
import { SgProductService } from '../../services/sg-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'app-sg-applicant-beneficiary',
  templateUrl: './sg-applicant-beneficiary.component.html',
  styleUrls: ['./sg-applicant-beneficiary.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SgApplicantBeneficiaryComponent }]
})
export class SgApplicantBeneficiaryComponent extends SgProductComponent implements OnInit, OnDestroy {

  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  entities = [];
  beneficiaries = [];
  updatedBeneficiaries = [];
  entity: Entities;
  counterpartyDetailsList: CounterpartyDetailsList;
  corporateDetails: CorporateDetails;
  readonly = this.lcConstant.readonly;
  lcMode: string;
  autoDisplayFirst = this.lcConstant.autoDisplayFirst;
  lcResponseForm = new ImportLetterOfCreditResponse();
  responseStatusCode = 200;
  @Output() messageToEmit = new EventEmitter<string>();
  form: FCCFormGroup;
  module = `${this.translateService.instant(FccGlobalConstant.SG_APPLICANT_BENEFICIARY)}`;
  appBenAddressRegex;
  beneAbbvNameRegex;
  maxlength = this.lcConstant.maximumlength;
  addressLine1 = 'line1';
  addressLine2 = 'line2';
  addressLine3 = 'line3';
  addressLine4 = 'line4';
  address = 'Address';
  syBeneAdd: boolean;
  beneEditToggleVisible: boolean;
  beneAbbvName: string;
  contentType: any;
  counterpartyRequest: CounterpartyRequest;
  abbvNameList = [];
  benePreviousValue: any;
  operation;
  screenMode;
  entityAddressType: any;
  tnxTypeCode: any;
  entityNameList = [];
  beneficiaryFlag = false;
  saveTogglePreviousValue: any;
  beneAbbvPreviousValue: any;
  
  constructor(
    protected commonService: CommonService,
    protected stateService: ProductStateService,
    protected eventEmitterService: EventEmitterService,
    protected translateService: TranslateService,
    protected corporateCommonService: CorporateCommonService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected multiBankService: MultiBankService,
    protected dropdownAPIService: DropDownAPIService,
    protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected fileList: FilelistService,
    protected dialogRef: DynamicDialogRef,
    protected taskService: FccTaskService,
    protected http: HttpClient,
    protected currencyConverterPipe: CurrencyConverterPipe, protected sgProductService: SgProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, sgProductService);
    }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.stateService.getSectionData(FccGlobalConstant.SG_GENERAL_DETAILS).get('crossRefChildRefId')
          .setValue(this.commonService.referenceId);
    this.stateService.getSectionData(FccGlobalConstant.SG_GENERAL_DETAILS).get('crossRefChildTnxId')
          .setValue(this.commonService.eventId);
    //this.checkBeneSaveAllowed();
    if (this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value !== undefined &&
    this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value !== FccGlobalConstant.EMPTY_STRING) {
      this.benePreviousValue = this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value;
    }
    if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) && this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value){
      this.saveTogglePreviousValue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
    }
    if (this.form.get(FccGlobalConstant.BENE_ABBV_NAME) &&
    this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value) &&
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value !== FccGlobalConstant.EMPTY_STRING) {
     this.beneAbbvPreviousValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
    }
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.screenMode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if(this.entities.length === 0 && this.screenMode === FccGlobalConstant.VIEW_MODE){
        this.getUserEntities();
    }
  }

  // method to check if adhoc beneficiary save can be performed
  // checkBeneSaveAllowed(){
  //   this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
  //   this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
  //   this.form.get(FccGlobalConstant.BENE_ABBV_NAME).clearValidators();
  //   this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
  //   this.toggleVisibilityChange.subscribe(value => {
  //     this.beneEditToggleVisible = value;
  //     if (this.syBeneAdd && this.beneEditToggleVisible){
  //     this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
  //     this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = false;
  //     this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
  //     this.onClickBeneficiarySaveToggle();
  //   }
  //   else{
  //     if (!this.syBeneAdd || !this.beneEditToggleVisible){
  //       this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = false;
  //       this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
  //       this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
  //       this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
  //       this.form.get(FccGlobalConstant.BENE_ABBV_NAME).clearValidators();
  //       this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
  //     }
  //   } });
  // }

  checkBeneSaveAllowed(toggleValue){
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
    this.clearBeneAbbvValidator();
    this.beneEditToggleVisible = toggleValue;
    if (this.syBeneAdd && this.beneEditToggleVisible){
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = false;
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
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

  // method to check if adhoc beneficiary save can be performed for amend
  checkBeneSaveAllowedForAmend(beneAmendValue: any) {
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
    this.clearBeneAbbvValidator();
    if (this.syBeneAdd && this.entityNameList !== undefined && this.entityNameList.length > 0
      && (this.entityNameList.indexOf(beneAmendValue) === -1)){
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = false;
      this.onClickBeneficiarySaveToggle();
    }
    else {
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
        this.clearBeneAbbvValidator();
    }
  }

  // clear bene abbv validator
  clearBeneAbbvValidator() {
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).clearValidators();
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
  }

  ngOnDestroy() {
    this.stateService.setStateSection(FccGlobalConstant.SG_APPLICANT_BENEFICIARY, this.form);
    if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) !== null) {
      const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
      if (togglevalue !== undefined && togglevalue === FccBusinessConstantsService.YES &&
        !this.form.get(FccGlobalConstant.BENE_ABBV_NAME).hasError('duplicateCounterpartyAbbvName')){
          if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.screenMode === FccGlobalConstant.DRAFT_OPTION){
            this.commonService.saveBeneficiary(this.getCounterPartyObjectForAmend(this.form)).subscribe();
          }else{
            this.commonService.saveBeneficiary(this.getCounterPartyObject(this.form)).subscribe();
          }
        }
    }
    if (this.beneficiaryFlag){
      this.commonService.setLiCopyFrom(null);
    }
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.SG_APPLICANT_BENEFICIARY;
    this.form = this.stateService.getSectionData(sectionName);
    this.getBeneficiaries();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        const address1TradeLength = response.address1TradeLength;
        const address2TradeLength = response.address2TradeLength;
        const domTradeLength = response.domTradeLength;
        const address4TradeLength = response.address4TradeLength;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        const appBenNameLength = response.nameTradeLength;
        this.beneAbbvNameRegex = response.BeneficiaryAbbvNameRegex;
        // this.form.addFCCValidators(FccGlobalConstant.APPLICANT_NAME, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.APPLICANT_NAME)[this.params][this.maxlength] = appBenNameLength;
        this.form.get(FccGlobalConstant.APPLICANT_NAME).updateValueAndValidity();
        // this.form.addFCCValidators(FccGlobalConstant.APPLICANT_ADDRESS_1, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[this.params][this.maxlength] = address1TradeLength;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).updateValueAndValidity();
        // this.form.addFCCValidators(FccGlobalConstant.APPLICANT_ADDRESS_2, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[this.params][this.maxlength] = address2TradeLength;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).updateValueAndValidity();
        // this.form.addFCCValidators(FccGlobalConstant.APPLICANT_ADDRESS_3, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[this.params][this.maxlength] = domTradeLength;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).updateValueAndValidity();
        // this.form.addFCCValidators(FccGlobalConstant.APPLICANT_ADDRESS_4, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4)[this.params][this.maxlength] = address4TradeLength;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4).updateValueAndValidity();
        // this.form.addFCCValidators(FccGlobalConstant.TRANS_BENE_ADDRESS_1, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1)[this.params][this.maxlength] = address1TradeLength;
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1).updateValueAndValidity();
        // this.form.addFCCValidators(FccGlobalConstant.TRANS_BENE_ADDRESS_2, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2)[this.params][this.maxlength] = address2TradeLength;
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2).updateValueAndValidity();
        // this.form.addFCCValidators(FccGlobalConstant.TRANS_BENE_ADDRESS_3, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3)[this.params][this.maxlength] = domTradeLength;
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3).updateValueAndValidity();
        // this.form.addFCCValidators(FccGlobalConstant.TRANS_BENE_ADDRESS_4, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_4)[this.params][this.maxlength] = address4TradeLength;
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_4).updateValueAndValidity();
      }
    });
    }

  updateBeneficiary() {
    let beneficiaryEntity;
    if (this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value) {
      if (this.commonService.liCopyFrom){
        beneficiaryEntity = this.commonService.getLcResponse().beneficiary_name;
      } else {
       beneficiaryEntity =
      this.stateService.getValue(FccGlobalConstant.SG_APPLICANT_BENEFICIARY, FccGlobalConstant.TRANS_BENE_ENTITY, false);
      }
      if (beneficiaryEntity && this.beneficiaries.length > 0
        && this.beneficiaries.filter(task => task.label === beneficiaryEntity).length > 0) {
        const beneFilteredValue = this.beneficiaries.filter(task => task.label === beneficiaryEntity)[0].value;
        if (beneFilteredValue) {
          this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue(beneFilteredValue);
        } else {
          this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue('');
        }
        this.onClickBeneficiaryAccessibility(beneFilteredValue);
      }
    } else if ( this.commonService.getLcResponse() && this.commonService.getLcResponse().beneficiary_name) {
      beneficiaryEntity = this.commonService.getLcResponse().beneficiary_name;
      const beneFilteredValue = this.beneficiaries.filter(task => task.label === beneficiaryEntity)[0].value;
      if (beneFilteredValue) {
        this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue(beneFilteredValue);
      } else {
        this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue('');
      }
      this.onClickBeneficiaryAccessibility(beneFilteredValue);
    }
    this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).updateValueAndValidity();
    this.beneficiaryFlag = true;
  }

  onClickBeneficiaryAccessibility(value) {
    if (value) {
      this.form.get(FccGlobalConstant.TRANS_BENE_NAME).setValue(value.name);
      if (this.commonService.isNonEmptyField(FccGlobalConstant.TRANS_BENE_ADDRESS_1, this.form) &&
        this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1).value)){
        this.form
          .get(FccGlobalConstant.TRANS_BENE_ADDRESS_1)
          .setValue(value.swiftAddressLine1);
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.TRANS_BENE_ADDRESS_2, this.form) &&
        this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2).value)){
      this.form
        .get(FccGlobalConstant.TRANS_BENE_ADDRESS_2)
        .setValue(value.swiftAddressLine2);
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.TRANS_BENE_ADDRESS_3, this.form) &&
        this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3).value)){
      this.form
        .get(FccGlobalConstant.TRANS_BENE_ADDRESS_3)
        .setValue(value.swiftAddressLine3);
      }
    }
     }

    getBeneficiaries() {
      this.corporateCommonService.getCounterparties(
        this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.counterparties)
      .subscribe(response => {
        if (response.status === this.responseStatusCode) {
          this.getBeneficiariesAsList(response.body);
        }
        this.getUserEntities();
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
            swiftAddressLine1: this.commonService.decodeHtml(value.swiftAddress.line1),
            swiftAddressLine2: this.commonService.decodeHtml(value.swiftAddress.line2),
            swiftAddressLine3: this.commonService.decodeHtml(value.swiftAddress.line3),
            entity: decodeURI(value.entityShortName),
            shortName: this.commonService.decodeHtml(value.shortName),
            name: this.commonService.decodeHtml(value.name)
          }
        };
        this.abbvNameList.push(this.commonService.decodeHtml(value.shortName));
        if (this.entityNameList !== undefined) {
          this.entityNameList.push(this.commonService.decodeHtml(value.name));
        }
        this.beneficiaries.push(beneficiary);
        this.updatedBeneficiaries.push(beneficiary);
      });
      if (this.operation === FccGlobalConstant.PREVIEW && this.screenMode === FccGlobalConstant.VIEW_MODE) {
        if (this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value !== FccGlobalConstant.EMPTY_STRING &&
        typeof(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value) === 'object') {
          const adhocBene: { label: string; value: any } = {
            label: this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value.label,
            value: {
              label: this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value.label,
              swiftAddressLine1: '',
              swiftAddressLine2: '',
              swiftAddressLine3: '',
              entity: '&#x2a;',
              shortName: '',
              name: ''
            }
          };
          this.beneficiaries.push(adhocBene);
          this.updatedBeneficiaries.push(adhocBene);
        }
       }
    }

    getUserEntities() {
      this.updateUserEntities();
    }

    updateUserEntities() {
      this.multiBankService.getEntityList().forEach(entity => {
        this.entities.push(entity);
      });
      const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, FccGlobalConstant.APPLICANT_ENTITY, this.form);
      if (valObj && !this.taskService.getTaskEntity() && valObj[FccGlobalConstant.VALUE]){
          this.form.get(FccGlobalConstant.APPLICANT_ENTITY).patchValue(valObj[FccGlobalConstant.VALUE]);
          this.multiBankService.setCurrentEntity(valObj[FccGlobalConstant.VALUE].name);
        } else if (this.taskService.getTaskEntity()){
        this.form.get('applicantEntity').patchValue(this.taskService.getTaskEntity());
        if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
          this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)){
          this.form.get('applicantName').setValue(this.taskService.getTaskEntity().name);
        }
      }
      if (this.entities.length === 0) {
        this.form.get(FccGlobalConstant.APPLICANT_NAME)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        if (this.form.get(FccGlobalConstant.APPLICANT_ENTITY)) {
          this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][this.rendered] = false;
          this.setMandatoryField(this.form, FccGlobalConstant.APPLICANT_ENTITY, false);
          this.form.get(FccGlobalConstant.APPLICANT_ENTITY).clearValidators();
          this.form.get(FccGlobalConstant.APPLICANT_ENTITY).updateValueAndValidity();
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
                  this.form.get(FccGlobalConstant.APPLICANT_NAME).setValue(this.corporateDetails.name);
                }
                if (this.commonService.addressType && this.commonService.addressType === FccGlobalConstant.POSTAL_ADDRESS_PA) {
                  this.entityAddressType = FccGlobalConstant.POSTAL_ADDRESS;
                } else {
                  this.entityAddressType = FccGlobalConstant.SWIFT_ADDRESS;
                }
                if (response.body[this.entityAddressType]) {
                  this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)
                  .setValue(this.commonService.decodeHtml(response.body[this.entityAddressType].line1));
                  this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)
                  .setValue(this.commonService.decodeHtml(response.body[this.entityAddressType].line2));
                  this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)
                  .setValue(this.commonService.decodeHtml(response.body[this.entityAddressType].line3));
                }
              }
            });
        }
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { options: this.updateBeneficiaries() });
      } else if (this.entities.length === 1) {
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue({ label: this.entities[0].value.label, name: this.entities[0].value.name,
           shortName: this.entities[0].value.shortName });
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][this.readonly] = true;
        this.multiBankService.setCurrentEntity(this.entities[0].value.shortName);
        if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
          this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)){
          this.form.get(FccGlobalConstant.APPLICANT_NAME).setValue(this.entities[0].value.name);
        }
        this.form.get(FccGlobalConstant.APPLICANT_NAME)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { options: this.updateBeneficiaries() });
        if (this.updatedBeneficiaries.length === 1 && !this.benePreviousValue &&
          !this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value) {
          this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { autoDisplayFirst : true });
          this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { readonly: true });
          // this.onClickTransBeneficiaryEntity(this.updatedBeneficiaries[0]);
          this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).updateValueAndValidity();
        } else {
          this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { readonly: false });
          this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { autoDisplayFirst : false });
          this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).updateValueAndValidity();
        }
      } else if (this.entities.length > 1) {
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.RENDERED] = true;
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { options: [] });
        this.form.get(FccGlobalConstant.APPLICANT_NAME)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
        this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
        let flag = true;
        if (this.stateService.getValue(FccGlobalConstant.SG_GENERAL_DETAILS, FccGlobalConstant.CREATE_FROM_OPERATIONS, false)) {
          if (((this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value === undefined) ||
            (this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value === null) ||
              (this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value === ''))) {
            this.setEntityFromLC();
            flag = false;
          }
          if (this.commonService.liCopyFrom && flag) {
            this.setEntityFromLC();
          }
        }
      }
      this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { options: this.updateBeneficiaries() });
      this.UpdateEntityBeni();
      this.patchFieldParameters(this.form.get(FccGlobalConstant.APPLICANT_ENTITY), { options: this.entities });
      //this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { options: this.beneficiaries });
      this.updateBeneficiary();
      this.updateBeneSaveToggleDisplay();
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
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue(
        { label: entity.value.label, name: entity.value.name, shortName: entity.value.shortName });
      this.multiBankService.setCurrentEntity(entity.value.shortName);
      this.form.get(FccGlobalConstant.APPLICANT_NAME).setValue(entity.value.name);
      this.taskService.setTaskEntity(entity.value);
      if (entityAddress.Address !== undefined) {
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1), entityAddress.Address.line1, '');
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2), entityAddress.Address.line2, '');
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3), entityAddress.Address.line3, '');
      }
    }

    updateBeneSaveToggleDisplay(){
      const beneAbbvNameValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
      if (this.benePreviousValue !== undefined &&
        (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.screenMode === FccGlobalConstant.DRAFT_OPTION)){
        this.checkBeneSaveAllowedForAmend(this.benePreviousValue.name);
        if (this.saveTogglePreviousValue === FccBusinessConstantsService.YES && this.beneAbbvPreviousValue) {
          this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
          this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
        }
      }
      if (beneAbbvNameValue !== null && beneAbbvNameValue !== FccGlobalConstant.EMPTY_STRING){
        if (!(this.entityNameList.includes(this.benePreviousValue.name ? this.benePreviousValue.name : this.benePreviousValue))){
          this.onBlurBeneAbbvName();
        }else {
          this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = true;
          this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = true;
          this.clearBeneAbbvValidator();
          this.commonService.beneAbbvNameDisabled('beneAbbvName');
        }
      }
    }

    onKeyupApplicantEntity(event) {
      const keycodeIs = event.which || event.keyCode;
      if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty) {
        this.onClickApplicantEntityForAccessibility(this.form.get('applicantEntity').value);
      }
    }

    onClickApplicantEntityForAccessibility(values) {
      if(this.screenMode === FccGlobalConstant.INITIATE){
        this.stateService.getSectionData(FccGlobalConstant.SG_ISSUING_BANK_AMOUNT).controls['sgIssuingBankAndAmount']
        .get('issuerReferenceList').setValue('');
        }
      if (values) {
        this.multiBankService.setCurrentEntity(values.shortName);
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_NAME), values.name, '');
        this.entities.forEach(value => {
          if (value.value.shortName === values.shortName) {
            const address = this.multiBankService.getAddress(value.value.shortName);
            this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
              address[this.address][this.addressLine1], '');
            this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
              address[this.address][this.addressLine2], '');
            this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
              address[this.address][this.addressLine3], '');
            this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4),
              address[this.address][this.addressLine4], '');
          }
        });
        this.setBeneficiaryNull();
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { options: this.updateBeneficiaries() });
        this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
        FccGlobalConstant.APPLICANT_BENE_STYLE_CLASS;
        if (this.updatedBeneficiaries.length === 1) {
          this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { readonly: true });
          this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
          FccGlobalConstant.SINGLE_BENE_STYLE_CLASS;
          this.onClickTransBeneficiaryEntity(this.updatedBeneficiaries[0]);
        } else {
          this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { readonly: false });
          this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { autoDisplayFirst: false });
          this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
          FccGlobalConstant.APPLICANT_BENE_STYLE_CLASS;
        }
      }
  }

    onClickApplicantEntity() {
      const entity = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value;
      if(this.screenMode === FccGlobalConstant.INITIATE){
        this.stateService.getSectionData(FccGlobalConstant.SG_ISSUING_BANK_AMOUNT).get('issuerReferenceList').setValue('');
        }
    if (entity) {
      this.multiBankService.setCurrentEntity(entity.shortName);
      this.multiBankService.clearIssueRef();
      this.taskService.setTaskEntity(entity);
      this.form.get(FccGlobalConstant.APPLICANT_NAME).setValue(entity.name);
      this.entities.forEach(value => {
        if (entity.shortName === value.value.shortName) {
          const address = this.multiBankService.getAddress(value.value.shortName);
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
          address[this.address][this.addressLine1], '');
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
          address[this.address][this.addressLine2], '');
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
          address[this.address][this.addressLine3], '');
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4),
          address[this.address][this.addressLine4], '');
        }
      });
      this.setBeneficiaryNull();
      this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { options: this.updateBeneficiaries() });
      if (this.updatedBeneficiaries.length === 1) {
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { readonly: true });
        //this.onClickTransBeneficiaryEntity(this.updatedBeneficiaries[0]);
      } else {
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { readonly: false });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { autoDisplayFirst : false });
      }
      this.multiBankService.updateRefonEntityChangeSub.next(true);
    }
    }
    setBeneficiaryNull() {
      let setEntityToNull = true;
      if (this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY) && this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value &&
        this.form.get(FccGlobalConstant.APPLICANT_NAME) && this.form.get(FccGlobalConstant.APPLICANT_NAME).value
        && this.beneficiaries && this.beneficiaries.length > 0) {
        const selectedbeneEntity = this.beneficiaries
          .filter(rec => rec.value.label === this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value.label)[0]?.value.entity;
        if (selectedbeneEntity && (selectedbeneEntity === '&#x2a;'
          || selectedbeneEntity === this.form.get(FccGlobalConstant.APPLICANT_NAME).value)) {
          setEntityToNull = false;
        }
      }
      if (setEntityToNull) {
        this.form.get(FccGlobalConstant.TRANS_BENE_NAME).setValue('');
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1).setValue('');
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2).setValue('');
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3).setValue('');
        this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue('');
        if (this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_4)) {
          this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_4).setValue('');
        }
      }
    }

    onKeyupTransBeneficiaryEntity(event) {
      const keycodeIs = event.which || event.keyCode;
      if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty) {
        this.onClickBeneficiaryEntityForAccessibility(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value);
      }
    }

    onClickBeneficiaryEntityForAccessibility(value) {
      if (value) {
          this.form.get('transBeneficiaryEntity').setValue(value.name);
          this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1).setValue(value.swiftAddressLine1);
          this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2).setValue(value.swiftAddressLine2);
          this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3).setValue(value.swiftAddressLine3);
      }
    }

    onClickTransBeneficiaryEntity(event) {
      if (event.value) {
        this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue(event.value);
        this.form.get(FccGlobalConstant.TRANS_BENE_NAME).setValue(event.value.name);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1).setValue(event.value.swiftAddressLine1);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2).setValue(event.value.swiftAddressLine2);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3).setValue(event.value.swiftAddressLine3);
        if (this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_4)) {
          this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_4).setValue(event.value.swiftAddressLine4);
        }
      }
    }



    UpdateEntityBeni() {
      if (this.lcResponseForm.applicant && this.lcResponseForm.applicant.entityShortName !== undefined && this.context === 'readonly') {
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue( this.entities.filter(
        task => task.label === this.lcResponseForm.applicant.entityShortName)[0].value);
        this.patchFieldParameters(this.form.get(FccGlobalConstant.APPLICANT_ENTITY), { readonly: true });
        this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue( this.updatedBeneficiaries.filter(
          task => task.value.label === this.lcResponseForm.beneficiary.name)[0].value);
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { readonly: true });
        }
        else if (this.benePreviousValue !== undefined && this.benePreviousValue !== null) {
          this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue(this.benePreviousValue);
        }
    }

    updateBeneficiaries(): any[] {
      this.updatedBeneficiaries = [];
      if (!this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][this.rendered]) {
        this.beneficiaries.forEach(value => {
          if (value.value.entity === '&#x2a;') {
            const beneficiary: { label: string; value: any } = {
              label: value.label,
              value: value.value
            };
            this.updatedBeneficiaries.push(beneficiary);
          }
        });
      }
      if (this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value.shortName !== undefined &&
          this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value.shortName !== '') {
        this.beneficiaries.forEach(value => {
          if (this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value.shortName === value.value.entity || value.value.entity === '&#x2a;') {
            const beneficiary: { label: string; value: any } = {
              label: value.label,
              value: value.value
            };
            this.updatedBeneficiaries.push(beneficiary);
          }
        });
      }
      return this.updatedBeneficiaries;
    }
    onClickBeneficiarySaveToggle() {
      const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
      if (togglevalue === FccBusinessConstantsService.YES) {
        this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
          Validators.compose([Validators.required, Validators.pattern(this.beneAbbvNameRegex)]), 0);
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = false;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
      } else {
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setValue(FccGlobalConstant.EMPTY_STRING);
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME).clearValidators();
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
      }
    }

    getCounterPartyObject(form: FCCFormGroup): CounterpartyRequest {
      const counterpartyRequest: CounterpartyRequest = {
        name: form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value,
        shortName: form.get(FccGlobalConstant.BENE_ABBV_NAME).value,
        swiftAddress: {
          line1: form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1).value,
          line2: form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2).value,
          line3: form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3).value,
        },
        country: form.get(FccGlobalConstant.TRANS_BENE_COUNTRY).value.shortName,
        entityShortName: '*',
      };
      return counterpartyRequest;
    }

    // to create adhoc beneficiary object for Amend
    getCounterPartyObjectForAmend(form: FCCFormGroup): CounterpartyRequest {
      let beneName: string;
      if (form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value.name !== undefined){
      beneName = form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value.name;
    } else {
      beneName = form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value;
    }
      const counterpartyRequest: CounterpartyRequest = {
        name: this.commonService.validateValue(beneName),
        shortName: this.commonService.validateValue(form.get(FccGlobalConstant.BENE_ABBV_NAME).value),
        swiftAddress: {
          line1: this.commonService.validateValue(form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1).value),
          line2: this.commonService.validateValue(form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2).value),
          line3: this.commonService.validateValue(form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3).value),
        },
        country: this.commonService.validateValue(form.get(FccGlobalConstant.TRANS_BENE_COUNTRY).value.shortName),
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
}


