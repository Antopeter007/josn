import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';

import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { TransactionDetailService } from '../../../../../common/services/transactionDetail.service';
import { FormControlService } from '../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import {
  ConfirmationDialogComponent,
} from '../../../lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { CorporateDetails } from './../../../../../common/model/corporateDetails';
import { CounterpartyDetailsList } from './../../../../../common/model/counterpartyDetailsList';
import { CountryList } from './../../../../../common/model/countryList';
import { Entities } from './../../../../../common/model/entities';
import { CommonService } from './../../../../../common/services/common.service';
import { DropDownAPIService } from './../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { MultiBankService } from './../../../../../common/services/multi-bank.service';
import { CorporateCommonService } from './../../../../../corporate/common/services/common.service';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import { EcProductComponent } from './../ec-product/ec-product.component';
import { FccTaskService } from '../../../../../common/services/fcc-task.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { AmendCommonService } from './../../../../common/services/amend-common.service';
import { FccBusinessConstantsService } from '../../../../../common/core/fcc-business-constants.service';
import { CounterpartyRequest } from '../../../../../common/model/counterpartyRequest';
import { LcConstant } from '../../../lc/common/model/constant';
import { EcProductService } from '../../services/ec-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'fcc-drawer-drawee',
  templateUrl: './drawer-drawee.component.html',
  styleUrls: ['./drawer-drawee.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: DrawerDraweeComponent }]

})
export class DrawerDraweeComponent extends EcProductComponent implements OnInit {

  module = `${this.translateService.instant('drawerDraweeDetails')}`;
  lcConstant = new LcConstant();
  tnxTypeCode: any;
  form: FCCFormGroup;
  contextPath: any;
  swiftXChar;
  appBenNameRegex;
  appBenAddressRegex;
  address1TradeLength;
  address2TradeLength;
  domTradeLength;
  address4TradeLength;
  appBenNameLength;
  appBenFullAddrLength: any;
  beneLengthWithoutEntity = FccGlobalConstant.LENGTH_200;
  disableDropDown = false;
  length35 = FccGlobalConstant.LENGTH_35;
  entities = [];
  beneficiaries = [];
  updatedBeneficiaries = [];
  country = [];
  beneficiaryCountry = [];
  entity: Entities;
  countryList: CountryList;
  counterpartyDetailsList: CounterpartyDetailsList;
  corporateDetails: CorporateDetails;
  lcMode: string;
  responseStatusCode = 200;
  syBeneAdd: any;
  beneEditToggleVisible = false;
  benePreviousValue: any;
  licenseData: any;
  sessionCols: any;
  licenseValue: any;
  option: any;
  address = 'Address';
  addressLine1 = 'line1';
  addressLine2 = 'line2';
  addressLine3 = 'line3';
  addressLine4 = 'line4';
  rendered = 'rendered';
  // drawerFullAddressValue: any;
  // applicantFullAddressValue: string;
  operation;
  mode: any;
  abbvNameList = [];
  entityAddressType: any;
  entityNameList = [];
  saveTogglePreviousValue: any;
  beneAbbvPreviousValue: any;
  maxlength = this.lcConstant.maximumlength;

  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService,
              protected prevNextService: PrevNextService, protected corporateCommonService: CorporateCommonService,
              protected utilityService: UtilityService, protected saveDraftService: SaveDraftService,
              protected searchLayoutService: SearchLayoutService, protected dropdownAPIService: DropDownAPIService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected stateService: ProductStateService, protected route: ActivatedRoute,
              protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
              protected dialogService: DialogService,
              public fccGlobalConstantService: FccGlobalConstantService, protected multiBankService: MultiBankService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef, protected amendCommonService: AmendCommonService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService, protected taskService: FccTaskService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected ecProductService: EcProductService) {
super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
  searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, ecProductService);
}

  ngOnInit(): void {
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    window.scroll(0, 0);
    this.initializeFormGroup();
    if ( this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].data !== null &&
          this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].data !== '' &&
          this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].data !== undefined) {
    this.licenseData = this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].data;
          }
    if ( this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].sessionCols !== null &&
          this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].sessionCols !== '' &&
          this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].sessionCols !== undefined) {
    this.sessionCols = this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].sessionCols;
          }
    if ( this.stateService.getSectionData('ecLicenseDetails').get('linkedLicenses').value !== null &&
          this.stateService.getSectionData('ecLicenseDetails').get('linkedLicenses').value !== '' &&
            this.stateService.getSectionData('ecLicenseDetails').get('linkedLicenses').value !== undefined) {
    this.licenseValue = this.stateService.getSectionData('ecLicenseDetails').get('linkedLicenses').value;
        }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftXChar = response.swiftXCharacterSet;
        this.appBenNameRegex = response.BeneficiaryNameRegex;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.nameTradeLength;
        this.appBenFullAddrLength = response.nonSwiftAddrLength;
        this.address1TradeLength = response.address1TradeLength;
        this.address2TradeLength = response.address2TradeLength;
        this.domTradeLength = response.domTradeLength;
        this.address4TradeLength = response.address4TradeLength;
        //this.form.addFCCValidators('drawerName', Validators.pattern(this.swiftXChar), 0 );
        this.form.addFCCValidators('drawerName', Validators.maxLength(this.appBenNameLength), 0 );
        // this.form.addFCCValidators('drawerFirstAddress', Validators.pattern(this.appBenAddressRegex), 0 );
        this.form.addFCCValidators('drawerFirstAddress', Validators.maxLength(this.address1TradeLength), 0 );
        // this.form.addFCCValidators( 'drawerSecondAddress',  Validators.pattern(this.appBenAddressRegex),
        //   0
        // );
        this.form.addFCCValidators(
          'drawerSecondAddress',
          Validators.maxLength(this.address2TradeLength),
          0
        );
        // this.form.addFCCValidators(
        //   'drawerThirdAddress',
        //   Validators.pattern(this.appBenAddressRegex),
        //   0
        // );
        this.form.addFCCValidators(
          'drawerThirdAddress',
          Validators.maxLength(this.domTradeLength),
          0
        );
        // this.form.addFCCValidators(
        //   'drawerFullAddress',
        //   Validators.pattern(this.appBenAddressRegex),
        //   0
        // );
        this.form.addFCCValidators(
          'drawerFullAddress',
          Validators.maxLength(this.appBenFullAddrLength),
          0
        );
        // this.form.addFCCValidators(
        //   'draweeFirstAddress',
        //   Validators.pattern(this.appBenAddressRegex),
        //   0
        // );
        this.form.addFCCValidators(
          'draweeFirstAddress',
          Validators.maxLength(this.address1TradeLength),
          0
        );
        // this.form.addFCCValidators(
        //   'draweeSecondAddress',
        //   Validators.pattern(this.appBenAddressRegex),
        //   0
        // );
        this.form.addFCCValidators(
          'draweeSecondAddress',
          Validators.maxLength(this.address2TradeLength),
          0
        );
        // this.form.addFCCValidators(
        //   'draweeThirdAddress',
        //   Validators.pattern(this.appBenAddressRegex),
        //   0
        // );
        this.form.addFCCValidators(
          'draweeThirdAddress',
          Validators.maxLength(this.domTradeLength),
          0
        );
        // this.form.addFCCValidators(
        //   'draweeFullAddress',
        //   Validators.pattern(this.appBenAddressRegex),
        //   0
        // );
        this.form.addFCCValidators( 'draweeFullAddress', Validators.maxLength(this.appBenFullAddrLength), 0 );
        this.form.addFCCValidators(
          'drawerFourthAddress',
          Validators.maxLength(this.address4TradeLength),
          0
        );
        this.form.get('drawerName')[this.params][this.maxlength] = this.multiBankService.getIsEntity()
        ? this.appBenNameLength : this.beneLengthWithoutEntity;
        this.form.updateValueAndValidity();
        this.form.markAllAsTouched();
      }
    });
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      this.amendCommonService.compareTransactionAndMasterForAmend(productCode);
    }
    // this.checkBeneSaveAllowed();
    if (this.form.get('draweeEntity').value !== undefined && this.form.get('draweeEntity').value !== FccGlobalConstant.EMPTY_STRING) {
      this.benePreviousValue = this.form.get('draweeEntity').value;
    }
    if (this.form.get(FccGlobalConstant.SAVE_DRAWEE) && this.form.get(FccGlobalConstant.SAVE_DRAWEE).value){
      this.saveTogglePreviousValue = this.form.get(FccGlobalConstant.SAVE_DRAWEE).value;
    }
    if (this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME) &&
    this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME)) &&
    this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).value !== FccGlobalConstant.EMPTY_STRING) {
      this.beneAbbvPreviousValue = this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).value;
    }
    if (this.entities.length === 0 && this.mode === FccGlobalConstant.VIEW_MODE) {
      this.getUserEntities();
    }
  }

  clearingFormValidators(fields: any){
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
    }
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.DRAWER_DRAWEE;
    this.form = this.stateService.getSectionData(sectionName);
    this.getBeneficiaries();
    this.getCountryDetail();
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.patchFieldParameters(this.form.get('drawerEntity'), { options: this.entities });
    }
    //this.patchFieldParameters(this.form.get('draweeEntity'), { options: this.beneficiaries });
    this.patchFieldParameters(this.form.get('draweecountry'), { options: this.beneficiaryCountry });
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
      this.commonService.formatForm(this.form);
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

  getUserEntities() {
    this.updateUserEntities();
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.handleDrawerData();
    }
  }

  updateUserEntities() {
    this.multiBankService.getEntityList().forEach(entity => {
      this.entities.push(entity);
    });

    const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, 'drawerEntity', this.form);
    if (valObj && !this.taskService.getTaskEntity() && valObj[FccGlobalConstant.VALUE]) {
      this.form.get('drawerEntity').patchValue(valObj[FccGlobalConstant.VALUE]);
      this.multiBankService.setCurrentEntity(valObj[FccGlobalConstant.VALUE].shortName);
    }else if (this.taskService.getTaskEntity()){
      this.form.get('drawerEntity').patchValue(this.taskService.getTaskEntity());
      if (this.commonService.isNonEmptyField(FccGlobalConstant.DRAWER_NAME, this.form) &&
        this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.DRAWER_NAME).value)){
        this.form.get('drawerName').setValue(this.taskService.getTaskEntity().name);
      }
    }

    if (this.entities.length === 0) {
      this.form.get('drawerName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('drawerFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('drawerSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('drawerThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      if (this.form.get('drawerEntity')) {
        this.form.get('drawerEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.setMandatoryField(this.form, 'drawerEntity', false);
        this.form.get('drawerEntity').clearValidators();
        this.form.get('drawerEntity').updateValueAndValidity();
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.DRAWER_NAME, this.form) &&
       (this.form.get(FccGlobalConstant.DRAWER_NAME).value === undefined ||
        this.form.get(FccGlobalConstant.DRAWER_NAME).value === null ||
        this.form.get(FccGlobalConstant.DRAWER_NAME).value === FccGlobalConstant.EMPTY_STRING)) {
          this.corporateCommonService.getValues(this.fccGlobalConstantService.corporateDetails).subscribe(response => {
            if (response.status === this.responseStatusCode) {
              this.corporateDetails = response.body;
              if (this.commonService.isNonEmptyField(FccGlobalConstant.DRAWER_NAME, this.form) &&
              this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.DRAWER_NAME).value)){
                this.form.get(FccGlobalConstant.DRAWER_NAME).setValue(this.corporateDetails.name);
              }
              if (this.commonService.addressType && this.commonService.addressType === FccGlobalConstant.POSTAL_ADDRESS_PA) {
                this.entityAddressType = FccGlobalConstant.POSTAL_ADDRESS;
              } else {
                this.entityAddressType = FccGlobalConstant.SWIFT_ADDRESS;
              }
              if (response.body[this.entityAddressType]) {
                if (!this.form.get(FccGlobalConstant.DRAWER_FIRST_ADDRESS).value) {
                  if(this.commonService.decodeHtml(response.body[this.entityAddressType].line1) !== "undefined"){
                  this.form.get(FccGlobalConstant.DRAWER_FIRST_ADDRESS)
                  .setValue(this.commonService.decodeHtml(response.body[this.entityAddressType].line1));
                  }
                  else{
                    this.form.get(FccGlobalConstant.DRAWER_FIRST_ADDRESS).setValue(response.body[this.entityAddressType].line1);
                  }
                }
                if (!this.form.get(FccGlobalConstant.DRAWER_SECOND_ADDRESS).value) {
                  if(this.commonService.decodeHtml(response.body[this.entityAddressType].line2) !== "undefined"){
                  this.form.get(FccGlobalConstant.DRAWER_SECOND_ADDRESS)
                  .setValue(this.commonService.decodeHtml(response.body[this.entityAddressType].line2));
                  }
                  else{
                  this.form.get(FccGlobalConstant.DRAWER_SECOND_ADDRESS).setValue(response.body[this.entityAddressType].line2);
                }
                }
                if (!this.form.get(FccGlobalConstant.DRAWER_THIRD_ADDRESS).value) {
                  if(this.commonService.decodeHtml(response.body[this.entityAddressType].line3) !== "undefined"){
                  this.form.get(FccGlobalConstant.DRAWER_THIRD_ADDRESS)
                  .setValue(this.commonService.decodeHtml(response.body[this.entityAddressType].line3));
                  }
                  else{
                    this.form.get(FccGlobalConstant.DRAWER_THIRD_ADDRESS).setValue(response.body[this.entityAddressType].line3);
                  }
                }
              }
            }
          });
      }
      this.patchFieldParameters(this.form.get('draweeEntity'), { options: this.updateBeneficiaries() });

    } else if (this.entities.length === 1) {
      this.form.get('drawerEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get('drawerEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('drawerEntity').setValue({ label: this.entities[0].value.label, name: this.entities[0].value.name,
         shortName: this.entities[0].value.shortName });
      this.form.get('drawerEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
      this.multiBankService.setCurrentEntity(this.entities[0].value.shortName);
      if (this.commonService.isNonEmptyField(FccGlobalConstant.DRAWER_NAME, this.form) &&
        this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.DRAWER_NAME).value)){
        this.form.get('drawerName').setValue(this.entities[0].value.name);
      }
      this.form.get('drawerName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('drawerFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('drawerSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('drawerThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.patchFieldParameters(this.form.get('draweeEntity'), { options: this.updateBeneficiaries() });

      if (this.updatedBeneficiaries.length === 1 && !this.benePreviousValue && !this.form.get('draweeEntity').value) {
        this.patchFieldParameters(this.form.get('draweeEntity'), { autoDisplayFirst : true });
        this.patchFieldParameters(this.form.get('draweeEntity'), { readonly: true });
        // this.onClickDraweeEntity(this.updatedBeneficiaries[0]);
        this.form.get('draweeEntity').updateValueAndValidity();
      } else {
        this.patchFieldParameters(this.form.get('draweeEntity'), { readonly: false });
        this.patchFieldParameters(this.form.get('draweeEntity'), { autoDisplayFirst : false });
        this.form.get('draweeEntity').updateValueAndValidity();
      }
      const address = this.multiBankService.getAddress(this.entities[0].value.shortName);
      if (this.commonService.isNonEmptyField(FccGlobalConstant.DRAWER_FIRST_ADDRESS, this.form) &&
      this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.DRAWER_FIRST_ADDRESS).value)){
        this.patchFieldValueAndParameters(this.form.get('drawerFirstAddress'), address[this.address][this.addressLine1], {});
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.DRAWER_SECOND_ADDRESS, this.form) &&
      this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.DRAWER_SECOND_ADDRESS).value)){
        this.patchFieldValueAndParameters(this.form.get('drawerSecondAddress'), address[this.address][this.addressLine2], {});
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.DRAWER_THIRD_ADDRESS, this.form) &&
      this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.DRAWER_THIRD_ADDRESS).value)){
        this.patchFieldValueAndParameters(this.form.get('drawerThirdAddress'), address[this.address][this.addressLine3], {});
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.DRAWER_FOURTH_ADDRESS, this.form) &&
      this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.DRAWER_FOURTH_ADDRESS).value)){
        this.patchFieldValueAndParameters(this.form.get('drawerFourthAddress'), address[this.address][this.addressLine4], {});
      }
    } else if (this.entities.length > 1) {
      this.form.get('drawerEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get('drawerEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.patchFieldParameters(this.form.get('draweeEntity'), { options: [] });
      this.form.get('drawerName')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('drawerFirstAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('drawerSecondAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('drawerThirdAddress')[FccGlobalConstant.PARAMS].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
    }
    this.patchFieldParameters(this.form.get('draweeEntity'), { options: this.updateBeneficiaries() });
    this.updateEntityBeneValues();
    this.updateDraweeSaveToggleDisplay();
    this.removeMandatoryForTemplate(['drawerEntity', 'drawerName', 'drawerFirstAddress']);
  }

  onFocusYesButton() {
    this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].data = null;
    this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS].sessionCols = null;
    this.stateService.getSectionData('ecLicenseDetails').get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.stateService.getSectionData('ecLicenseDetails').get('linkedLicenses').setValue(null) ;
    this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
    this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
  }

  onClickDraweeEntity(event) {
    if (event.value) {
      this.form
        .get('draweeEntity')
        .setValue(event.value);
      this.form
        .get('draweeFirstAddress')
        .setValue(event.value.swiftAddressLine1);
      this.form
        .get('draweeSecondAddress')
        .setValue(event.value.swiftAddressLine2);
      this.form
        .get('draweeThirdAddress')
        .setValue(event.value.swiftAddressLine3);
      if (!event.value.country) {
        this.form.get(FccGlobalConstant.DRAWEE_COUNTRY).setValue(null);
      } else {
        const exist = this.beneficiaryCountry.filter(task => task.value.shortName === event.value.country);
        if (exist !== null && exist.length > 0) {
          this.form.get('draweecountry').setValue( this.beneficiaryCountry.filter(
            task => task.value.shortName === event.value.country)[0].value);
        } else if (!this.form.get(FccGlobalConstant.DRAWEE_COUNTRY).value) {
          this.patchFieldValueAndParameters(
            this.form.get(FccGlobalConstant.DRAWEE_COUNTRY), { label: event.value.country, shortName: event.value.country }, {});
        }
      }
      this.form.get('draweeEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
      FccGlobalConstant.APPLICANT_BENE_STYLE_CLASS;
      this.updateCountryValues();
      this.handleLinkedLicense();
      if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND){
        this.addAmendLabel();
      }
      this.draweeDropdownValValidation();
    }
  }

  draweeDropdownValValidation(){
    const beneEntity = this.form.get('draweeEntity')[FccGlobalConstant.VALUE][FccGlobalConstant.NAME];
    if (beneEntity && beneEntity !== null && beneEntity !== '') {
      const beneNameReg = new RegExp(this.appBenAddressRegex);
      if (beneNameReg.test(beneEntity) === false) {
        this.form.addFCCValidators('draweeEntity', Validators.compose([Validators.pattern(this.appBenAddressRegex)]), 0);
        this.form.get('draweeEntity').updateValueAndValidity();
      }
      else{
        this.form.get('draweeEntity').clearValidators();
        this.form.get('draweeEntity').updateValueAndValidity();
      }
    }
  }

 draweeInputValValidation() {
    const beneEntity = this.form.get('draweeEntity')[FccGlobalConstant.VALUE];
    if (beneEntity && beneEntity !== null && beneEntity !== ''
    && this.commonService.isnonEMptyString(this.form.get('draweeEntity').value)
    && typeof(this.form.get('draweeEntity').value) !== 'object') {
      const beneNameReg = new RegExp(this.appBenAddressRegex);
      if (beneNameReg.test(beneEntity) === false) {
        this.form.addFCCValidators('draweeEntity', Validators.compose([Validators.pattern(this.appBenAddressRegex)]), 0);
        this.form.get('draweeEntity').updateValueAndValidity();
      }
      else{
        this.form.get('draweeEntity').clearValidators();
        this.form.get('draweeEntity').updateValueAndValidity();
      }
    }
  }

  addAmendLabel() {
    this.addAmendLabelOnBeneficiary(this.form.get('draweeFirstAddress'));
    this.addAmendLabelOnBeneficiary(this.form.get('draweeSecondAddress'));
    this.addAmendLabelOnBeneficiary(this.form.get('draweeThirdAddress'));
    this.addAmendLabelOnBeneficiary(this.form.get('draweecountry'));
  }

  addAmendLabelOnBeneficiary(control: any) {
    const header = this.form.get('draweeHeader');
    this.groupAmendLabel(control, control.value, this.form, header);
    if (this.commonService.isNonEmptyValue(control.params.previousCompareValue)
        && control.params.previousCompareValue === FccGlobalConstant.EMPTY_STRING &&
        control.value !== control.params.previousCompareValue)
     {
       this.patchFieldParameters(control, { infoIcon: true, groupLabel: true });
       this.patchFieldParameters(header, { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
     }
  }

  handleLinkedLicense() {
    if ((this.licenseData && this.licenseData.length > 0)
        || (this.sessionCols && this.sessionCols.length > 0) || this.licenseValue > 0) {
      const dir = localStorage.getItem('langDir');
      const headerField = `${this.translateService.instant('deleteLinkedLicense')}`;
      const obj = {};
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        data: obj,
        header: headerField,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir }
      });
      dialogRef.onClose.subscribe((result: any) => {
        if (result.toLowerCase() === 'yes') {
          this.onFocusYesButton();
        }
      });
    }
  }
  // method to check if adhoc beneficiary save can be performed
  checkBeneSaveAllowed(toggleValue){
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
    this.clearDraweeAbbvValidator();
    this.beneEditToggleVisible = toggleValue;
    if (this.syBeneAdd && this.beneEditToggleVisible) {
    this.form.get(FccGlobalConstant.SAVE_DRAWEE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccGlobalConstant.SAVE_DRAWEE)[this.params][FccGlobalConstant.DISABLED] = false;
    this.form.get(FccGlobalConstant.SAVE_DRAWEE).setValue(FccBusinessConstantsService.NO);
    this.onClickDraweeSaveToggle();
    }
    else{
      if (!this.syBeneAdd || !this.beneEditToggleVisible){
        this.form.get(FccGlobalConstant.SAVE_DRAWEE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get(FccGlobalConstant.SAVE_DRAWEE).setValue(FccBusinessConstantsService.NO);
        this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.DRAWEE_ABBV_NAME, false);
        this.clearDraweeAbbvValidator();
      }
    }
  }

  // clear drawee abbv validator
  clearDraweeAbbvValidator()
  {
    this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).clearValidators();
    this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).updateValueAndValidity();
  }

  // Display bene abbv name after turning on bene save toggle
  onClickDraweeSaveToggle() {
    const togglevalue = this.form.get(FccGlobalConstant.SAVE_DRAWEE).value;
    if (togglevalue === FccBusinessConstantsService.YES) {
      this.form.addFCCValidators(FccGlobalConstant.DRAWEE_ABBV_NAME,
        Validators.compose([Validators.required, Validators.pattern(FccGlobalConstant.SPACE_REGEX)]), 0);
      this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME)[this.params][FccGlobalConstant.READONLY] = false;
      this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).updateValueAndValidity();
    } else {
      this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.setMandatoryField(this.form, FccGlobalConstant.DRAWEE_ABBV_NAME, false);
      this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).setValue(FccGlobalConstant.EMPTY_STRING);
      this.clearDraweeAbbvValidator();
    }
  }
  onKeyupDrawerEntity(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty) {
      this.onClickDrawerEntityAccessibility(this.form.get(FccGlobalConstant.DRAWER_ENTITY).value);
    }
  }

  onClickDrawerEntityAccessibility(value) {
    if(this.mode === FccGlobalConstant.INITIATE){
      this.stateService.getSectionData(FccGlobalConstant.EC_BANK_DETAILS).controls['remittingBank']
      .get('issuerReferenceList').setValue('');
      }
    if (value) {
      this.postClickRKeyUpOnDrawerEntity(value);
    }
    this.removeMandatoryForTemplate([FccGlobalConstant.DRAWEE_ENTITY,
                                    FccGlobalConstant.DRAWEE_ADDRESS_1,
                                    FccGlobalConstant.DRAWEE_COUNTRY]);
  }

  onClickDrawerEntity() {
    const entity = this.form.get(FccGlobalConstant.DRAWER_ENTITY).value;
    if(this.mode === FccGlobalConstant.INITIATE){
      this.stateService.getSectionData(FccGlobalConstant.EC_BANK_DETAILS).controls['remittingBank']
      .get('issuerReferenceList').setValue('');
      }
    if (entity) {
      this.postClickRKeyUpOnDrawerEntity(entity);
    }
    this.removeMandatoryForTemplate([FccGlobalConstant.DRAWEE_ENTITY,
                                    FccGlobalConstant.DRAWEE_ADDRESS_1,
                                    FccGlobalConstant.DRAWEE_COUNTRY]);
  }

  postClickRKeyUpOnDrawerEntity(value) {
    if (value) {
      this.multiBankService.setCurrentEntity(value.shortName);
      this.taskService.setTaskEntity(value);
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.DRAWER_NAME), value.name, {});
      this.entities.forEach(entityValue => {
        if (value.shortName === entityValue.value.shortName) {
          const address = this.multiBankService.getAddress(entityValue.value.shortName);
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.DRAWER_FIRST_ADDRESS),
            address[this.address][this.addressLine1], {});
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.DRAWER_SECOND_ADDRESS),
            address[this.address][this.addressLine2], {});
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.DRAWER_THIRD_ADDRESS),
            address[this.address][this.addressLine3], {});
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.DRAWER_FOURTH_ADDRESS),
            address[this.address][this.addressLine4], {});
        }
      });
      this.setBeneficiaryNull();
      this.patchFieldParameters(this.form.get(FccGlobalConstant.DRAWEE_ENTITY), { options: this.updateBeneficiaries() });
      if (this.updatedBeneficiaries.length === 1) {
        this.patchFieldParameters(this.form.get(FccGlobalConstant.DRAWEE_ENTITY), { autoDisplayFirst : true });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.DRAWEE_ENTITY), { readonly: true });
        //this.onClickDraweeEntity(this.updatedBeneficiaries[0]);
      } else {
        this.patchFieldParameters(this.form.get(FccGlobalConstant.DRAWEE_ENTITY), { readonly: false });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.DRAWEE_ENTITY), { autoDisplayFirst : false });
        this.form.get(FccGlobalConstant.DRAWEE_ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
        FccGlobalConstant.SINGLE_BENE_STYLE_CLASS;
      }
      this.form.updateValueAndValidity();
      this.multiBankService.updateRefonEntityChangeSub.next(true);
      this.handleLinkedLicense();
    }
  }

  setBeneficiaryNull() {
    let setEntityToNull = true;
    if (this.form.get(FccGlobalConstant.DRAWEE_ENTITY) && this.form.get(FccGlobalConstant.DRAWEE_ENTITY).value &&
        this.form.get(FccGlobalConstant.DRAWER_NAME) && this.form.get(FccGlobalConstant.DRAWER_NAME).value
        && this.beneficiaries && this.beneficiaries.length > 0) {
        const selectedbeneEntity = this.beneficiaries.filter(rec =>
          rec.value.label === this.form.get('draweeEntity').value.label)[0]?.value.entity;
        if (selectedbeneEntity === '&#x2a;' || selectedbeneEntity === this.form.get(FccGlobalConstant.DRAWER_NAME).value) {
          setEntityToNull = false;
        }
      }
    if (setEntityToNull) {
      this.setValueToNull([FccGlobalConstant.DRAWEE_ADDRESS_1,
      FccGlobalConstant.DRAWEE_ADDRESS_2,
      FccGlobalConstant.DRAWEE_ADDRESS_3,
      FccGlobalConstant.DRAWEE_COUNTRY,
      FccGlobalConstant.DRAWEE_ENTITY]);
    }
  }


  updateBeneficiaries(): any[] {
    this.updatedBeneficiaries = [];
    if (!this.form.get('drawerEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) {
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
    if (this.form.get('drawerEntity').value.shortName !== undefined && this.form.get('drawerEntity').value.shortName !== '') {
      this.beneficiaries.forEach(value => {
        if (this.form.get('drawerEntity').value.shortName === value.value.entity || value.value.entity === '&#x2a;') {
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
      this.updatedBeneficiaries.push(beneficiary);
    });
    if (this.operation === FccGlobalConstant.PREVIEW && this.mode === FccGlobalConstant.VIEW_MODE) {
      if (this.form.get('draweeEntity').value !== FccGlobalConstant.EMPTY_STRING &&
      typeof(this.form.get('draweeEntity').value) === 'object') {
        const adhocBene: { label: string; value: any } = {
          label: this.form.get('draweeEntity').value.label,
          value: {
            label: this.form.get('draweeEntity').value.label,
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

 getCountryDetail() {
   this.commonService.getCountries().subscribe(data => {
    this.updateCountries(data);
   });
  }

  updateCountries(body: any) {
    this.countryList = body;
    this.countryList.countries.forEach(value => {
      const country: { label: string; value: any } = {
        label: value.alpha2code + '-' + value.name,
        value: {
          label: value.alpha2code,
          shortName: value.alpha2code,
          name: value.name
        }
      };
      this.country.push(country);
      const beneCountry: { label: string; value: any } = {
        label: value.alpha2code + '-' + value.name,
        value: {
          label: value.alpha2code,
          shortName: value.alpha2code,
          name: value.name
        }
      };
      this.beneficiaryCountry.push(beneCountry);
    });
    this.updateCountryValues();
  }

  setValueToNull(fieldName: any[]) {
    let index: any;
    for (index = 0; index < fieldName.length; index++) {
      this.form.controls[fieldName[index]].setValue(null);
    }
    this.form.updateValueAndValidity();
  }

  updateCountryValues() {
    if (this.commonService.isNonEmptyField(FccGlobalConstant.DRAWEE_COUNTRY, this.form) &&
     this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.DRAWEE_COUNTRY).value) &&
     this.beneficiaryCountry.length > 0) {
      const draweecountry = this.form.get(FccGlobalConstant.DRAWEE_COUNTRY).value;
      if (this.commonService.isNonEmptyValue(draweecountry) && draweecountry !== '') {
        const exists = this.beneficiaryCountry.filter(
          task => task.value.shortName === draweecountry.shortName);
        if (this.commonService.isNonEmptyValue(exists) && exists.length > 0) {
          this.form.get(FccGlobalConstant.DRAWEE_COUNTRY).setValue( this.beneficiaryCountry.filter(
            task => task.value.shortName === draweecountry.shortName)[0].value);
        }
      }
    }
  }

  updateEntityBeneValues() {
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      if (this.form.get('drawerEntity') && this.form.get('drawerEntity').value) {
        const drawerEntity = this.stateService.getValue(FccGlobalConstant.DRAWER_DRAWEE, 'drawerEntity', false);
        if (drawerEntity && this.entities && this.entities.length > 0) {
          this.form.get('drawerEntity').setValue( this.entities.filter(
          task => task.value.label === drawerEntity)[0].value);
        }
      }
    }
    if (this.form.get('draweeEntity') && this.form.get('draweeEntity').value) {
      const draweeEntity = this.stateService.getValue(FccGlobalConstant.DRAWER_DRAWEE, 'draweeEntity', false);
      if (draweeEntity && this.updatedBeneficiaries !== undefined && this.updatedBeneficiaries.length > 0 &&
        this.updatedBeneficiaries.filter(
        task => task.value.name === draweeEntity).length > 0) {
        this.form.get('draweeEntity').setValue( this.updatedBeneficiaries.filter(
          task => task.value.name === draweeEntity)[0].value);
      }
    }
    else if (this.benePreviousValue !== undefined){
      this.form.get('draweeEntity').setValue(this.benePreviousValue);
    }
  }

  removeMandatoryForTemplate(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  ngOnDestroy() {
    this.stateService.setStateSection(FccGlobalConstant.DRAWER_DRAWEE, this.form);
    if (this.form.get(FccGlobalConstant.SAVE_DRAWEE) !== null) {
      const togglevalue = this.form.get(FccGlobalConstant.SAVE_DRAWEE).value;
      if (togglevalue !== undefined && togglevalue === FccBusinessConstantsService.YES &&
        !this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).hasError('duplicateCounterpartyAbbvName')) {
          if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.mode === FccGlobalConstant.DRAFT_OPTION) {
            this.commonService.saveBeneficiary(this.getCounterPartyObjectForAmend(this.form)).subscribe();
          }else{
          this.commonService.saveBeneficiary(this.getCounterPartyObject(this.form)).subscribe();
          }
      }
    }
  }

  // to create adhoc beneficiary object
  getCounterPartyObject(form: FCCFormGroup): CounterpartyRequest {
    const counterpartyRequest: CounterpartyRequest = {
      name: this.commonService.validateValue(form.get(FccGlobalConstant.DRAWEE_ENTITY).value),
      shortName: this.commonService.validateValue(form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).value),
      swiftAddress: {
        line1: this.commonService.validateValue(form.get(FccGlobalConstant.DRAWEE_ADDRESS_1).value),
        line2: this.commonService.validateValue(form.get(FccGlobalConstant.DRAWEE_ADDRESS_2).value),
        line3: this.commonService.validateValue(form.get(FccGlobalConstant.DRAWEE_ADDRESS_3).value),
      },
      country: this.commonService.validateValue(
        (form.get(FccGlobalConstant.DRAWEE_COUNTRY).value) ? form.get(FccGlobalConstant.DRAWEE_COUNTRY).value.shortName : ''
        ),
      entityShortName: FccGlobalConstant.ENTITY_DEFAULT,
    };
    return counterpartyRequest;
  }

  amendFormFields() {
    if (this.commonService.checkPendingClientBankViewForAmendTnx()) {
      this.handleAmendrawer();
      this.amendCommonService.setValueFromMasterToPrevious('drawerDraweeDetails');
      this.form.get('draweeFullAddress')[this.params][this.rendered] = false;
    }
  }

  protected handleAmendrawer() {
    this.handledraweeData();
    // let drawerFourthAddressValue = '';
    if (this.form.get('drawerEntity')) {
      this.form.get('drawerEntity')[this.params][this.rendered] = true;
    }
    this.form.get('drawerName')[this.params][this.rendered] = true;
    if (this.commonService.isNonEmptyField('drawerFirstAddress', this.form)) {
      this.form.get('drawerFirstAddress')[this.params][this.rendered] = true;
      this.form.get('drawerFirstAddress').clearValidators();
    }
    if (this.commonService.isNonEmptyField('drawerSecondAddress', this.form)) {
      this.form.get('drawerSecondAddress')[this.params][this.rendered] = true;
      this.form.get('drawerSecondAddress').clearValidators();
    }
    if (this.commonService.isNonEmptyField('drawerThirdAddress', this.form)) {
      this.form.get('drawerThirdAddress')[this.params][this.rendered] = true;
      this.form.get('drawerThirdAddress').clearValidators();
    }
    if (this.form.get('drawerFourthAddress') !== undefined && this.form.get('drawerFourthAddress') !== null) {
      this.form.get('drawerFourthAddress')[this.params][this.rendered] = true;
      this.form.get('drawerFourthAddress').clearValidators();
      this.setMandatoryFields(this.form, ['drawerFourthAddress'], false);
    }
    this.form.get('drawerFullAddress')[this.params][this.rendered] = true;
    // const drawerFirstAddressValue = this.stateService.getValue('drawerDraweeDetails', 'drawerFirstAddress', true);
    // const drawerSecondAddressValue = this.stateService.getValue('drawerDraweeDetails', 'drawerSecondAddress', true);
    // const drawerThirdAddresssValue = this.stateService.getValue('drawerDraweeDetails', 'drawerThirdAddress', true);
    // this.drawerFullAddressValue = drawerFirstAddressValue;
    // if (drawerSecondAddressValue !== undefined && drawerSecondAddressValue !== null && drawerSecondAddressValue !== ' ') {
    //  this.drawerFullAddressValue = this.drawerFullAddressValue.concat(addressDelimiter).concat(drawerSecondAddressValue);
    // }
    // if (drawerThirdAddresssValue !== undefined && drawerThirdAddresssValue !== null && drawerThirdAddresssValue !== ' ') {
    //  this.drawerFullAddressValue = this.drawerFullAddressValue.concat(addressDelimiter).concat(drawerThirdAddresssValue);
    // }
    // drawerFourthAddressValue = this.stateService.getValue('drawerDraweeDetails', 'drawerFourthAddress', true);
    // if (drawerFourthAddressValue !== undefined && drawerFourthAddressValue !== null && drawerFourthAddressValue !== ' ') {
    //  this.drawerFullAddressValue = this.drawerFullAddressValue.concat(addressDelimiter).concat(drawerFourthAddressValue);
    // }
    // this.patchFieldValueAndParameters(this.form.get('drawerFullAddress'), this.drawerFullAddressValue,
    //  { readonly: true });
    // this.patchFieldParameters(this.form.get('drawerFullAddress'), { previousValue: this.drawerFullAddressValue });
    this.form.get('drawerName').updateValueAndValidity();
    this.form.get('drawerFirstAddress').updateValueAndValidity();
    if (this.form.get('drawerSecondAddress')) {
        this.form.get('drawerSecondAddress').updateValueAndValidity();
    }
    this.form.get('drawerThirdAddress').updateValueAndValidity();
    if (this.form.get('drawerFourthAddress') !== undefined && this.form.get('drawerFourthAddress') !== null) {
      this.form.get('drawerFourthAddress').updateValueAndValidity();
    }
    this.form.get('drawerFullAddress').updateValueAndValidity();
  }

  handledraweeData() {
    let drawerEntity = this.commonService.isNonEmptyField('drawerEntity', this.form) ?
    this.form.get('drawerEntity').value : this.form.get('drawerEntity');
    if (typeof drawerEntity === 'object') {
      drawerEntity = drawerEntity.label;
    }
    const drawerEntityLabel = this.entities.filter( task => task.value.label === drawerEntity);
    if (drawerEntityLabel !== undefined && drawerEntityLabel !== null && drawerEntityLabel.length > 0) {
         this.form.get('drawerEntity').setValue(drawerEntityLabel[0].value.shortName);
    }
    this.updateEntityBeneValues();
    this.updateCountryValues();
  }

  // validation on change of beneAbbvName field
  onBlurDraweeAbbvName() {
    const abbvName = this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).value;
    if (this.abbvNameList.indexOf(abbvName) > -1 &&
    !this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME)[this.params][FccGlobalConstant.READONLY]) {
      this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).setErrors({ duplicateCounterpartyAbbvName: { abbvName } });
    }
  }

  updateDraweeSaveToggleDisplay(){
    if (this.benePreviousValue !== undefined &&
      (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.mode === FccGlobalConstant.DRAFT_OPTION)){
      this.checkBeneSaveAllowedForAmend(this.benePreviousValue.name);
      if (this.saveTogglePreviousValue === FccBusinessConstantsService.YES && this.beneAbbvPreviousValue){
        this.form.get(FccGlobalConstant.SAVE_DRAWEE)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME)[this.params][this.rendered] = true;
      }
    }
    const beneAbbvNameValue = this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).value;
    if (beneAbbvNameValue !== null && beneAbbvNameValue !== FccGlobalConstant.EMPTY_STRING){
        if (!(this.entityNameList.includes(this.benePreviousValue.name ? this.benePreviousValue.name : this.benePreviousValue))){
          this.onBlurDraweeAbbvName();
        }else{
          this.form.get(FccGlobalConstant.SAVE_DRAWEE)[this.params][FccGlobalConstant.DISABLED] = true;
          this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME)[this.params][FccGlobalConstant.READONLY] = true;
          this.clearDraweeAbbvValidator();
         this.commonService.beneAbbvNameDisabled('draweeAbbvName');
        }
    }
  }

  // method to check if adhoc beneficiary save can be performed for amend
  checkBeneSaveAllowedForAmend(beneAmendValue: any) {
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
    this.clearDraweeAbbvValidator();
    if (this.syBeneAdd && this.entityNameList !== undefined && this.entityNameList.length > 0
      && (this.entityNameList.indexOf(beneAmendValue) === -1)){
      this.form.get(FccGlobalConstant.SAVE_DRAWEE)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.SAVE_DRAWEE)[this.params][FccGlobalConstant.DISABLED] = false;
      this.onClickDraweeSaveToggle();
    }
    else {
        this.form.get(FccGlobalConstant.SAVE_DRAWEE)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.DRAWEE_ABBV_NAME)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.DRAWEE_ABBV_NAME, false);
        this.clearDraweeAbbvValidator();
    }
  }

  // to create adhoc beneficiary object
  getCounterPartyObjectForAmend(form: FCCFormGroup): CounterpartyRequest {
    let beneName: string;
    if (form.get(FccGlobalConstant.DRAWEE_ENTITY).value.name !== undefined){
          beneName = form.get(FccGlobalConstant.DRAWEE_ENTITY).value.name;
        } else {
          beneName = form.get(FccGlobalConstant.DRAWEE_ENTITY).value;
        }
    const counterpartyRequest: CounterpartyRequest = {
            name: this.commonService.validateValue(beneName),
          shortName: this.commonService.validateValue(form.get(FccGlobalConstant.DRAWEE_ABBV_NAME).value),
          swiftAddress: {
            line1: this.commonService.validateValue(form.get(FccGlobalConstant.DRAWEE_ADDRESS_1).value),
            line2: this.commonService.validateValue(form.get(FccGlobalConstant.DRAWEE_ADDRESS_2).value),
            line3: this.commonService.validateValue(form.get(FccGlobalConstant.DRAWEE_ADDRESS_3).value),
          },
          country: this.commonService.validateValue(form.get(FccGlobalConstant.DRAWEE_COUNTRY).value.shortName),
          entityShortName: FccGlobalConstant.ENTITY_DEFAULT,
        };
    return counterpartyRequest;
  }

  handleDrawerData() {
    let drawerEntity = this.commonService.isNonEmptyField('drawerEntity', this.form) ?
    this.form.get('drawerEntity').value : this.form.get('drawerEntity');
    if (typeof drawerEntity === 'object') {
      drawerEntity = drawerEntity.label;
    }
    const drawerEntityLabel = this.entities.filter( task => task.value.label === drawerEntity);
    if (drawerEntityLabel !== undefined && drawerEntityLabel !== null && drawerEntityLabel.length > 0) {
         this.form.get('drawerEntity').setValue(drawerEntityLabel[0].value.shortName);
    }
  }

}

