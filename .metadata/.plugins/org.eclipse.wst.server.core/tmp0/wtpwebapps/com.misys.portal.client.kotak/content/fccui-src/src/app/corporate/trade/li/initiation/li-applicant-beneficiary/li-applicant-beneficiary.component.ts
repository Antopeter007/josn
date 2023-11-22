import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FccBusinessConstantsService } from './../../../../../common/core/fcc-business-constants.service';
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
import { CorporateCommonService } from './../../../../../corporate/common/services/common.service';
import { LiProductComponent } from './../../li-product/li-product.component';
import { LiProductService } from '../../services/li-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
@Component({
  selector: 'fcc-li-applicant-beneficiary',
  templateUrl: './li-applicant-beneficiary.component.html',
  styleUrls: ['./li-applicant-beneficiary.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LiApplicantBeneficiaryComponent }]
})

export class LiApplicantBeneficiaryComponent extends LiProductComponent implements OnInit, OnDestroy {
  mode: any;
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
  module = `${this.translateService.instant(FccGlobalConstant.LI_APPLICANT_BENEFICIARY)}`;
  appBenAddressRegex;
  maxlength = this.lcConstant.maximumlength;
  addressLine1 = 'line1';
  addressLine2 = 'line2';
  addressLine3 = 'line3';
  addressLine4 = 'line4';
  address = 'Address';
  transBeneficiaryType = 'transBeneficiaryType';
  entityAddressType: any;
  isPreview: boolean;
  isView: boolean;

  constructor(protected commonService: CommonService, protected stateService: ProductStateService,
              protected eventEmitterService: EventEmitterService, protected translateService: TranslateService,
              protected corporateCommonService: CorporateCommonService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected multiBankService: MultiBankService, protected dropdownAPIService: DropDownAPIService,
              protected confirmationService: ConfirmationService, protected taskService: FccTaskService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected liProductService: LiProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, liProductService);
  }

  ngOnInit(): void {
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.initializeFormGroup();
    this.stateService.getSectionData(FccGlobalConstant.LI_GENERAL_DETAILS).get('crossRefChildRefId')
          .setValue(this.commonService.referenceId);
    this.stateService.getSectionData(FccGlobalConstant.LI_GENERAL_DETAILS).get('crossRefChildTnxId')
          .setValue(this.commonService.eventId);
  }

  ngOnDestroy() {
    this.stateService.setStateSection(FccGlobalConstant.LI_APPLICANT_BENEFICIARY, this.form);
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.LI_APPLICANT_BENEFICIARY;
    this.form = this.stateService.getSectionData(sectionName);
    this.isPreview = this.mode === FccGlobalConstant.INITIATE || this.mode === FccGlobalConstant.DRAFT_OPTION ||
    this.mode === FccGlobalConstant.EXISTING;
    this.isView = this.mode === FccGlobalConstant.VIEW_MODE;
    this.getBeneficiaries();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        const address1TradeLength = response.address1TradeLength;
        const address2TradeLength = response.address2TradeLength;
        const domTradeLength = response.domTradeLength;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        const appBenNameLength = response.BeneficiaryNameLength;
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
        // this.form.addFCCValidators(FccGlobalConstant.TRANS_BENE_ADDRESS_1, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1)[this.params][this.maxlength] = address1TradeLength;
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1).updateValueAndValidity();
        // this.form.addFCCValidators(FccGlobalConstant.TRANS_BENE_ADDRESS_2, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2)[this.params][this.maxlength] = address2TradeLength;
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2).updateValueAndValidity();
        // this.form.addFCCValidators(FccGlobalConstant.TRANS_BENE_ADDRESS_3, Validators.pattern(this.appBenAddressRegex), 0);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3)[this.params][this.maxlength] = domTradeLength;
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3).updateValueAndValidity();
      }
    });
    const liMode = this.commonService.getLiMode();
    if (liMode === FccGlobalConstant.LICOPY_FROM_EL) {
      this.patchFieldValueAndParameters(this.form.get(this.transBeneficiaryType),
      FccBusinessConstantsService.BENE_TYPE_LI_BUYER, { disabled: true });
    } else if (liMode === FccGlobalConstant.LICOPY_FROM_LC) {
      this.patchFieldValueAndParameters(this.form.get(this.transBeneficiaryType),
      FccBusinessConstantsService.BENE_TYPE_LI_TRANSPORATION, { disabled: true });
    }
    const transBeneType = this.form.get(this.transBeneficiaryType).value;
    if (transBeneType && transBeneType.toString() === FccBusinessConstantsService.OTHER_99) {
      this.form.get(FccGlobalConstant.TRANS_BENE_OTHER_TYPE)[this.params][this.rendered] = true;
      this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_BENE_OTHER_TYPE], true);
      if (this.isPreview) {
        this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_BENE_TYPE], false);
      }
      if (this.isView) {
        this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_BENE_TYPE], true);
        this.form.get(FccGlobalConstant.TRANS_BENE_TYPE)[this.params][this.rendered] = false;
      }
    }else{
      this.form.get(FccGlobalConstant.TRANS_BENE_OTHER_TYPE)[this.params][this.rendered] = false;
      this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_BENE_OTHER_TYPE], false);
      this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_BENE_TYPE], true);
    }
    }
   updateBeneficiary() {
      let beneficiaryEntity;
      if (this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value) {
        if (this.commonService.liCopyFrom){
          beneficiaryEntity = this.commonService.getLcResponse().beneficiary_name;
        } else {
         beneficiaryEntity =
        this.stateService.getValue(FccGlobalConstant.LI_APPLICANT_BENEFICIARY, FccGlobalConstant.TRANS_BENE_ENTITY, false);
        }
        if (beneficiaryEntity) {
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
        const beneFilteredObject = this.beneficiaries.filter(task => task.label === beneficiaryEntity);
        let beneFilteredValue = '';
        if(beneFilteredObject && beneFilteredObject[0])
        {
            beneFilteredValue = beneFilteredObject[0].value;
        }
        if (beneFilteredValue) {
          this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue(beneFilteredValue);
        } else {
          this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue('');
        }
        this.onClickBeneficiaryAccessibility(beneFilteredValue);
      }
      this.commonService.setLiCopyFrom(null);
    }

    getBeneficiaries() {
      this.corporateCommonService.getFormValues(
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
            swiftAddressLine1: this.commonService.decodeHtml(value[this.entityAddressType].line1),
            swiftAddressLine2: this.commonService.decodeHtml(value[this.entityAddressType].line2),
            swiftAddressLine3: this.commonService.decodeHtml(value[this.entityAddressType].line3),
            entity: decodeURI(value.entityShortName),
            shortName: this.commonService.decodeHtml(value.shortName),
            name: this.commonService.decodeHtml(value.name)
          }
        };
        this.beneficiaries.push(beneficiary);
        this.updatedBeneficiaries.push(beneficiary);
      });
    }

    getUserEntities() {
      this.updateUserEntities();
    }

    updateUserEntities() {
      this.multiBankService.getEntityList().forEach(entity => {
        this.entities.push(entity);
      });
      const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, FccGlobalConstant.APPLICANT_ENTITY, this.form);
      if (valObj && !this.taskService.getTaskEntity()) {
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY).patchValue(valObj[FccGlobalConstant.VALUE]);
        this.multiBankService.setCurrentEntity(valObj[FccGlobalConstant.VALUE].shortName);
      }else if (this.taskService.getTaskEntity()){
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
        const address = this.multiBankService.getAddress(this.entities[0].value.shortName);
        if (address !== undefined || address !== null || address !== ''){
          if ((this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).value === undefined) ||
          (this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).value === null) ||
            (this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).value === '')){
            this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
            address[this.address][this.addressLine1], '');
          }
          if ((this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).value === undefined) ||
          (this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).value === null) ||
            (this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).value === '')){
              this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
               address[this.address][this.addressLine2], '');
          }
          if ((this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).value === undefined) ||
          (this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).value === null) ||
            (this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).value === '')){
              this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
               address[this.address][this.addressLine3], '');
          }
        }
        if (this.updatedBeneficiaries.length === 1) {
          this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { autoDisplayFirst : true });
          this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { readonly: true });
          this.onClickTransBeneficiaryEntity(this.updatedBeneficiaries[0]);
        } else {
          this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { readonly: false });
          this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { autoDisplayFirst : false });
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
        if (this.commonService.liMode){
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
      this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { options: this.beneficiaries });
      this.updateBeneficiary();
    }

    onClickApplicantEntity() {
      const entity = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value;
      if(this.mode === FccGlobalConstant.INITIATE){
        this.stateService.getSectionData(FccGlobalConstant.LI_ISSUING_BANK_AMOUNT).get('issuerReferenceList').setValue('');
        }
    if (entity) {
      this.multiBankService.setCurrentEntity(entity.shortName);
      this.multiBankService.clearIssueRef();
      this.taskService.setTaskEntity(entity);
      this.form.get(FccGlobalConstant.APPLICANT_NAME).setValue(entity.name);
      this.entities.forEach(value => {
        if (entity.shortName === value.value.shortName) {
          const address = this.multiBankService.getAddress(value.value.shortName);
          if (address[this.address] !== undefined) {
                this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
                          address[this.address][this.addressLine1], '');
                this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
                    address[this.address][this.addressLine2], '');
                this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
                          address[this.address][this.addressLine3], '');
          }
        }
      });
      this.setBeneficiaryNull();
      this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { options: this.updateBeneficiaries() });
      if (this.updatedBeneficiaries.length === 1) {
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { autoDisplayFirst : true });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY), { readonly: true });
        this.onClickTransBeneficiaryEntity(this.updatedBeneficiaries[0]);
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
      this.form.get('transBeneficiaryName').setValue('');
      this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1).setValue('');
      this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2).setValue('');
      this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3).setValue('');
      this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue('');
    }
  }
    onClickTransBeneficiaryEntity(entityParam: any) {
      let entity;
      if(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value) {
       entity = this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value;
      } else {
        entity = entityParam.value;
      }
      if (entity) {
        this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue(entity);
        this.form.get(FccGlobalConstant.TRANS_BENE_NAME).setValue(entity.name);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1).setValue(entity.swiftAddressLine1);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2).setValue(entity.swiftAddressLine2);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3).setValue(entity.swiftAddressLine3);
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
        if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_ADDRESS_2, this.form) &&
          this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).value)){
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

    onKeyupApplicantEntity(event) {
      const keycodeIs = event.which || event.keyCode;
      if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty) {
        this.onClickApplicantEntityForAccessibility(this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value);
      }
    }

    onClickApplicantEntityForAccessibility(values) {
      if (values) {
        this.multiBankService.setCurrentEntity(values.shortName);
        this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_NAME), values.name, '');
        this.entities.forEach(value => {
          if (value.value.shortName === values.shortName) {
            const address = this.multiBankService.getAddress(value.value.shortName);
            if (address[this.address] !== undefined) {
                  this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
                            address[this.address][this.addressLine1], '');
                  this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
                      address[this.address][this.addressLine2], '');
                  this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
                            address[this.address][this.addressLine3], '');
            }
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

  onKeyupTransBeneficiaryEntity(event) {
      const keycodeIs = event.which || event.keyCode;
      if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty) {
        this.onClickBeneficiaryEntityForAccessibility(this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).value);
      }
    }

  onClickBeneficiaryEntityForAccessibility(value) {
    if (value) {
        this.form.get(FccGlobalConstant.TRANS_BENE_ENTITY).setValue(value);
        this.form.get(FccGlobalConstant.TRANS_BENE_NAME).setValue(value.name);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_1).setValue(value.swiftAddressLine1);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_2).setValue(value.swiftAddressLine2);
        this.form.get(FccGlobalConstant.TRANS_BENE_ADDRESS_3).setValue(value.swiftAddressLine3);
    }
  }

  onClickTransBeneficiaryType() {
    const transBeneType = this.form.get(this.transBeneficiaryType).value;
    if (transBeneType && transBeneType.toString() === FccBusinessConstantsService.OTHER_99) {
      this.form.get(FccGlobalConstant.TRANS_BENE_OTHER_TYPE)[this.params][this.rendered] = true;
      if (this.mode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(FccGlobalConstant.TRANS_BENE_OTHER_TYPE,
          Validators.compose([Validators.pattern(FccGlobalConstant.ALPHA_NUMERIC)]), 1);
      }
      this.form.addFCCValidators(FccGlobalConstant.TRANS_BENE_OTHER_TYPE,
        Validators.compose([Validators.maxLength(FccGlobalConstant.LENGTH_35)]), 1);
      this.setMandatoryField(this.form, FccGlobalConstant.TRANS_BENE_OTHER_TYPE, true);
      this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_BENE_OTHER_TYPE], true);
      if (this.isPreview) {
        this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_BENE_TYPE], false);
      }
      if (this.isView) {
        this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_BENE_TYPE], true);
        this.form.get(FccGlobalConstant.TRANS_BENE_TYPE)[this.params][this.rendered] = false;
      }
    } else {
      this.form.get(FccGlobalConstant.TRANS_BENE_OTHER_TYPE).setValue(null);
      this.form.get(FccGlobalConstant.TRANS_BENE_OTHER_TYPE).clearValidators();
      this.setMandatoryField(this.form, FccGlobalConstant.TRANS_BENE_OTHER_TYPE, false);
      this.form.get(FccGlobalConstant.TRANS_BENE_OTHER_TYPE)[this.params][this.rendered] = false;
      this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_BENE_OTHER_TYPE], false);
      this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_BENE_TYPE], true);
    }
    this.form.get(FccGlobalConstant.TRANS_BENE_OTHER_TYPE).updateValueAndValidity();
  }

}
