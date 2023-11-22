import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

import { ListDefService } from '../../../../../../app/common/services/listdef.service';
import { MultiBankService } from '../../../../../../app/common/services/multi-bank.service';
import { CorporateCommonService } from '../../../../../../app/corporate/common/services/common.service';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../trade/lc/initiation/services/utility.service';
import { LendingCommonDataService } from '../../../common/service/lending-common-data-service';
import { BlfpProductComponent } from '../blfp-product/blfp-product.component';
import { CorporateDetails } from './../../../../../common/model/corporateDetails';
import { DropDownAPIService } from './../../../../../common/services/dropdownAPI.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FacilityDetailsService } from './../../../ln/initiation/services/facility-details.service';
import { FccGlobalConfiguration } from '../../../../../common/core/fcc-global-configuration';

interface FacDealModel {
  dealName: string;
  dealId: string;
  facilityName: string;
  facilityId: string;
  availableToDraw: string;
  fcn: string;
  expiryDate: string;
  maturityDate: string;
  effectiveDate: string;
  mainCurrency: string;
  totalLimit: string;
  bankName: string;
  borrowerRef: string;
  facStatus: string;
}
@Component({
  selector: 'app-blfp-general-details',
  templateUrl: './blfp-general-details.component.html',
  styleUrls: ['./blfp-general-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: BlfpGeneralDetailsComponent }]
})
export class BlfpGeneralDetailsComponent
  extends BlfpProductComponent
  implements OnInit, OnDestroy
{
  contextPath: string;
  tnxTypeCode: any;
  option: any;
  mode: any;
  form: FCCFormGroup;
  module = `${this.translateService.instant('blfpGeneralDetails')}`;
  facilityId: any;
  facilityDetails: any;
  dataList: FacDealModel[];
  dealList: any[];
  entities: any[];
  corporateDetails: CorporateDetails;
  borrowerReferenceList: any;
  borrowerReferenceInternalList = [];
  corporateBanks: any[];
  referenceList: any[];
  selectedDeal: {label: string; value: string; dealId: string; };
  selectedFacility: {label: string; value: string; facilityId: string; };
  dealValue: string;
  savedResponseSubscription: Subscription[] = [];
  facilityDataArray: any[];
  dealNameFromOverview: any;
  facilityNameFromOverview: any;
  referenceId: any;
  configuredKeysList = 'PARTIAL_FEE_PAYMENT_ALLOWED';
  keysNotFoundList: any;
  showSpinner: boolean;

  constructor(
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected router: Router,
    protected fileListSvc: FilelistService,
    protected eventEmitterService: EventEmitterService,
    protected stateService: ProductStateService,
    protected confirmationService: ConfirmationService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected dialogRef: DynamicDialogRef,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected lendingService: LendingCommonDataService,
    protected listService: ListDefService,
    protected multiBankService: MultiBankService,
    protected corporateCommonService: CorporateCommonService,
    protected facilityDetailsService: FacilityDetailsService,
    protected dropdownAPIService: DropDownAPIService,
    protected fccGlobalConfiguration: FccGlobalConfiguration
  ) {
    super(
      eventEmitterService,
      stateService,
      commonService,
      translateService,
      confirmationService,
      customCommasInCurrenciesPipe,
      searchLayoutService,
      utilityService,
      resolverService,
      fileListSvc,
      dialogRef,
      currencyConverterPipe
    );
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.showSpinner = true;
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.TNX_TYPE_CODE
    );
    this.option = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.OPTION
    );
    this.mode = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.MODE
    );
    this.dealNameFromOverview = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.DEAL_NAME
    );
    this.facilityNameFromOverview = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.FACILITY_NAME
    );
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.savedResponseSubscription.push(this.commonService.savedResponse$.subscribe(res => {
      if (res && this.referenceId === undefined){
        this.commonService.referenceId = res.body.ref_id;
        this.initializeFormGroup();
      }
    }));
    this.initializeFormGroup();
    this.patchExtraValues();
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.BLFP_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.referenceId = this.commonService.referenceId;
    this.setHiddenFields();
    if (this.commonService.referenceId !== undefined || this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.form.get('dealName')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.get('feeDetailsReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.facilityDataArray = [];
      this.form.get('facilityOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS].forEach(element => {
        if (this.form.get('facilityID').value !== element.facilityId){
          element.hidden = true;
        } else {
          this.facilityDataArray.push(element);
        }
      });
    }
    if (this.mode === 'view' && this.form.get('dealName') && this.form.get('dealName').value) {
      this.form.get('feeDetailsReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('feeDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }

    this.savedResponseSubscription.push(this.multiBankService.getCustomerBankDetailsAPI(
        FccGlobalConstant.PRODUCT_LN, '', FccGlobalConstant.REQUEST_INTERNAL).subscribe((res) => {
      this.multiBankService.initializeLendingProcess(res);
    }));
    if (this.mode !== 'view') {
      this.savedResponseSubscription.push(this.listService.getActiveFacilityData(
          '/loan/listdef/customer/LN/facilityListingWithBankDetails').subscribe((response) => {
        if (response && response.count > 0) {
          this.dataList = [];
          response.rowDetails.forEach((facility) => {
            this.dataList.push(this.getPropertyValue(facility));
          });
          this.showSpinner = false;
        }
        this.dealList = [];
        this.dataList.forEach((responseValue) => {
          const item: { value: string; label: string, dealId: string; } = {
            label: responseValue.dealName,
            value: responseValue.dealName,
            dealId: responseValue.dealId
          };
          if (
            this.dealList.findIndex(
              (deal) => deal.dealId === responseValue.dealId
            ) === -1
          ) {
            this.dealList.push(item);
          }
        });
        this.dealList.sort((a, b) => {
          const x = a.label.toLowerCase();
          const y = b.label.toLowerCase();
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });

        for (let i = 0; i < this.dealList.length - 1; i++) {
          if (this.dealList[i + 1].label === this.dealList[i].label) {
            this.dealList.splice(i + 1, 1);

          }
        }
        this.patchFieldParameters(this.form.get('dealName'), {
          options: this.dealList,
        });
        if (this.dealList && this.dealList.length > 0 ){
          if (this.dealNameFromOverview){
            this.form.get('dealName').setValue(this.dealNameFromOverview);
            this.form.get('dealName').updateValueAndValidity();
          }
          const dealObject = this.dealList.filter( deal => deal.label === this.form.get('dealName').value)[0];
          this.form.updateValueAndValidity();
          this.onClickDealName(dealObject);
        }
      }));
    }
    this.form.updateValueAndValidity();
  }

  getPropertyValue(array): FacDealModel{
    return {
      dealName: this.commonService.decodeHtml(array.index.filter(row => row.name === 'dealName')[0].value),
      dealId: this.commonService.decodeHtml(array.index.filter(row => row.name === 'dealId')[0].value),
      facilityName: this.commonService.decodeHtml(array.index.filter(row => row.name === 'name')[0].value),
      facilityId: this.commonService.decodeHtml(array.index.filter(row => row.name === 'id')[0].value),
      availableToDraw: (array.index.filter(row => row.name === 'available')[0].value),
      fcn: (array.index.filter(row => row.name === 'fcn')[0].value),
      expiryDate: this.commonService.decodeHtml(array.index.filter(row => row.name === 'expiryDate')[0].value),
      effectiveDate: this.commonService.decodeHtml(array.index.filter(row => row.name === 'effectiveDate')[0].value),
      maturityDate: this.commonService.decodeHtml(array.index.filter(row => row.name === 'maturityDate')[0].value),
      mainCurrency: this.commonService.decodeHtml(array.index.filter(row => row.name === 'currency')[0].value),
      totalLimit: array.index.filter(row => row.name === 'total_amt')[0].value,
      bankName: this.commonService.decodeHtml(array.index.filter(row => row.name === 'bankName')[0].value),
      borrowerRef: array.index.filter(row => row.name === 'customerReference')[0].value,
      facStatus: array.index.filter(row => row.name === 'status')[0].value
    };
  }

  patchExtraValues() {
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(resp => {
        if (resp.response && resp.response === 'REST_API_SUCCESS') {
          this.fccGlobalConfiguration.addConfigurationValues(resp, this.keysNotFoundList);
          this.patchFieldValueAndParameters(this.form.get('canEditFeeAmt'),
              FccGlobalConfiguration.configurationValues.get('PARTIAL_FEE_PAYMENT_ALLOWED'), {});
        }
      });
    } else {
      this.patchFieldValueAndParameters(this.form.get('canEditFeeAmt'),
      FccGlobalConfiguration.configurationValues.get('PARTIAL_FEE_PAYMENT_ALLOWED'), {});
    }
  }
  onClickDealName(event) {
    if (event && event.value !== undefined && event.value !== this.dealValue) {
      if (this.mode !== FccGlobalConstant.DRAFT_OPTION){
        this.resetSelectedData();
      }
      this.facilityId = null;
      const elementId = 'facilityOptions';
      this.dealValue = this.form.get('dealName').value;
      this.selectedDeal = this.form.get('dealName')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS]
        .filter((opt) => opt.value === event.value)[0];
      if (this.commonService.referenceId === undefined && this.mode === FccGlobalConstant.INITIATE) {
        this.facilityDataArray = [];
        const facilityArray = this.dataList.filter((rec) => rec.dealName === this.dealValue);
        facilityArray.forEach(responseValue => {
          const eventData: { label: string; value: any; facilityId: string; disabled: boolean; } = {
            label: responseValue.facilityName,
            value: responseValue.facilityName,
            facilityId: responseValue.facilityId,
            disabled: false
          };
          this.facilityDataArray.push(eventData);
        });
        this.facilityDataArray.sort((a, b) => {
          const x = a.label.toLowerCase();
          const y = b.label.toLowerCase();
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });
        for (let i = 0; i < this.facilityDataArray.length - 1; i++) {
          if (this.facilityDataArray[i + 1].value === this.facilityDataArray[i].value) {
            this.facilityDataArray.splice(i + 1, 1);
          }
        }
      } else {
        this.facilityDataArray = [];
        const facilityArray = this.dataList.filter(
          (rec) =>
            rec.dealName === this.dealValue &&
            rec.facilityId === this.form.get("facilityID").value
        );
        facilityArray.forEach(responseValue => {
          const eventData: { label: string; value: any; facilityId: string; disabled: boolean; } = {
            label: responseValue.facilityName,
            value: responseValue.facilityName,
            facilityId: responseValue.facilityId,
            disabled: false
          };
          this.facilityDataArray.push(eventData);
        });
      }
      this.patchFieldParameters(this.form.get(elementId), { options: this.facilityDataArray });
      this.form.get('facilitiesList')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('facilityOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      if (this.facilityDataArray && this.facilityDataArray.length > 0){
        let facObject;
        if (this.commonService.referenceId === undefined && this.mode === FccGlobalConstant.INITIATE){
          facObject = this.facilityDataArray[0];
          if (this.facilityNameFromOverview){
            facObject = this.facilityDataArray.filter( fac => fac.label === this.facilityNameFromOverview)[0];
          }
        } else {
          if (this.form.get('facilityID').value){
            facObject = this.facilityDataArray.filter( fac => fac.facilityId === this.form.get('facilityID').value)[0];
          } else{
            facObject = this.facilityDataArray[0];
          }
        }
        this.form.get('facilityOptions').setValue(facObject.value);
        this.form.get('facilityOptions').updateValueAndValidity();
        this.form.updateValueAndValidity();
        this.onClickFacilityOptions(facObject);
      }
      this.form.get(elementId).updateValueAndValidity();
    }
  }

  checkFacilityChanged(event) {
    this.selectedFacility = this.form.get('facilityOptions')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS]
    .filter((opt) => opt.value === event.value)[0];
    return (this.selectedFacility.facilityId !== this.form.get('facilityID').value);
  }

  onClickFacilityOptions(event) {
    if (event.value !== undefined && (this.checkFacilityChanged(event) || this.mode === FccGlobalConstant.DRAFT_OPTION)) {
      this.facilityId = this.selectedFacility.facilityId;
      this.patchFieldValueAndParameters(this.form.get('facilityID'), this.facilityId, {});
      this.getFacilityDetails();
      if (this.mode !== FccGlobalConstant.DRAFT_OPTION){
        this.resetSelectedData();
      }
      this.form.get('facilitiesList').setValue(event.value);
    }
  }

  resetSelectedData(){
    if (this.commonService.referenceId === undefined){
      this.form.get('feeDetailsReference').setValue(null);
      this.form.get('feeDetailsEntity').setValue(null);
      this.form.get('lendingRefID').setValue(null);
    }
  }

  private getFacilityDetails() {
    this.facilityDetails = this.dataList.filter((fac) => fac.facilityId === this.facilityId)[0];
    this.setMultiBankServiceDetails();
    this.updateFacilityDetails();
    this.commonService.formatForm(this.form);
  }

  updateFacilityDetails() {
    this.facilityDetailsService.setFacilityDetailsObj(this.facilityDetails);
    if (this.facilityDetails) {
      const sanctionLimitVal = `${this.facilityDetails.mainCurrency} ${this.currencyConverterPipe.transform(
            this.commonService.replaceCurrency(this.facilityDetails.totalLimit.toString()), this.facilityDetails.mainCurrency)}`;
      const availableAmtLimitVal = `${this.facilityDetails.mainCurrency} ${this.currencyConverterPipe.transform(
        this.commonService.replaceCurrency(this.facilityDetails.availableToDraw.toString()), this.facilityDetails.mainCurrency)}`;
      this.patchFieldValueAndParameters(this.form.get('fcn'), this.facilityDetails.fcn, {});
      const cardData = [
        {
          header: this.translateService.instant('fcnNumber'),
          key: 'fcnNumber',
          value: this.facilityDetails.fcn
        },
        {
          header: this.translateService.instant('effectiveDate'),
          key: 'effectiveDate',
          value: this.facilityDetails.effectiveDate
        },
        {
          header: this.translateService.instant('expiryDate'),
          key: 'expiryDate',
          value:  this.utilityService.transformDateFormat(this.utilityService.transformddMMyyyytoDate(this.facilityDetails.expiryDate))
        },
        {
          header: this.translateService.instant('maturityDate'),
          key: 'maturityDate',
          value: this.utilityService.transformDateFormat(this.utilityService.transformddMMyyyytoDate(this.facilityDetails.maturityDate))
        },
        {
          header: this.translateService.instant('sanctionLimit'),
          key: 'sanctionLimit',
          value: sanctionLimitVal
        },
        {
          header: this.translateService.instant('availableAmtLimit'),
          key: 'availableAmtLimit',
          value: availableAmtLimitVal
        }
      ];
      this.form.get('facilityDetails')[this.params][FccGlobalConstant.OPTIONS] = cardData;
      this.form.get('facilityDetails')[FccGlobalConstant.PARAMS][FccGlobalConstant.SECTION_HEADER] = this.facilityDetails.facilityName;
      this.form.get('facilityDetails')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
  }

  onClickViewFacDetails(){
    this.form.get('facilityDetails')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] =
    !(this.form.get('facilityDetails')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]);
  }

  setMultiBankServiceDetails() {
    this.multiBankService
      .getCustomerBankDetailsAPI(FccGlobalConstant.PRODUCT_LN, '', FccGlobalConstant.REQUEST_INTERNAL)
      .subscribe((res) => {
      this.borrowerReferenceList = [];
      this.referenceList = [];
      this.referenceList = this.facilityDetails.borrowerRef.split(',');
      this.multiBankService.initializeLendingProcess(res);
      this.multiBankService.getBorrowerReferenceList().forEach((reference) => {
        this.referenceList.forEach((borrower) => {
          if (borrower === reference.label) {
            this.borrowerReferenceList.push(reference);
          }
        });
      });
      this.multiBankService.getBorrowerReferenceInternalList().forEach((internalRef) => {
        this.referenceList.forEach((borrower) => {
          if (borrower === internalRef.value) {
            this.borrowerReferenceInternalList.push(internalRef.id);
          }
        });
      });
      this.form.get('feeDetailsReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.patchFieldParameters(this.form.get('feeDetailsReference'), { options: this.borrowerReferenceList });
      this.corporateBanks = [];
      if (this.borrowerReferenceList.length === 1) {
        this.form.get('feeDetailsReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
        this.form.get('feeDetailsReference')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        const val = this.dropdownAPIService.getInputDropdownValue(this.borrowerReferenceList, 'feeDetailsReference', this.form);
        this.form.get('feeDetailsReference').setValue(val);
        this.multiBankService.setCurrentBorrowerRefBank(this.borrowerReferenceList[0].value);
        this.multiBankService.getBankList().forEach((bank) => {
          this.corporateBanks.push(bank);
          this.patchFieldValueAndParameters(this.form.get('issuingBankAbbvName'), this.corporateBanks[0].value, {});
          this.patchFieldValueAndParameters(this.form.get('issuingBankName'), this.corporateBanks[0].value, {});
        });
        this.form.get('lendingRefID').setValue(this.borrowerReferenceInternalList[0]);
        this.facilityDetailsService.setCurrentBorrower(this.borrowerReferenceInternalList[0]);
        this.form.get('feeDetailsReference').updateValueAndValidity();
        this.form.updateValueAndValidity();
        this.entities = [];
        this.patchFieldParameters(this.form.get('feeDetailsEntity'), { options: this.updateEntityList() });
        this.form.updateValueAndValidity();
      }
      this.patchFieldParameters(this.form.get('feeDetailsEntity'), { options: this.updateEntityList() });
      this.updateEntity();
    });
  }

onClickFeeDetailsReference(event) {
  if (event && event.value) {
    this.multiBankService.getBorrowerReferenceInternalList().forEach(internalRef => {
      if (event.value === internalRef.value) {
        this.patchFieldValueAndParameters(this.form.get('lendingRefID'), internalRef.id, {});
        this.facilityDetailsService.setCurrentBorrower(internalRef.id);
      }
    });
    this.corporateBanks = [];
    this.multiBankService.setCurrentBorrowerRefBank(event.value);
    this.multiBankService.getBankList().forEach(bank => {
      this.corporateBanks.push(bank);
      this.patchFieldValueAndParameters(this.form.get('issuingBankAbbvName'), this.corporateBanks[0].value, {});
      this.patchFieldValueAndParameters(this.form.get('issuingBankName'), this.corporateBanks[0].value, {});
    });
    this.patchFieldParameters(this.form.get('feeDetailsEntity'), { options: this.updateEntityList() });
  }
}

setHiddenFields() {
  const obj1 = {};
  const ftTnxRecord = 'ft_tnx_record';
  if (this.form.get('feeTnxList') && this.form.get('feeTnxList').value && JSON.parse(this.form.get('feeTnxList').value)){
    const selectedRec = JSON.parse(this.form.get('feeTnxList').value);
    obj1[ftTnxRecord] = selectedRec[ftTnxRecord];
  } else {
    obj1[ftTnxRecord] = [];
    this.patchFieldValueAndParameters(this.form.get('feeTnxList'), JSON.stringify(obj1), {});
  }
  if (this.form.get('feeListReq') && this.form.get('feeListReq').value && JSON.parse(this.form.get('feeListReq').value)) {
    let updatedValue = {};
    const selectedRec = JSON.parse(this.form.get('feeListReq').value);
    if (selectedRec && selectedRec[ftTnxRecord] === undefined){
      updatedValue[ftTnxRecord] = selectedRec;
    } else if (selectedRec && selectedRec[ftTnxRecord] !== undefined){
      updatedValue = selectedRec;
    }
    this.patchFieldValueAndParameters(this.form.get('feeListReq'), JSON.stringify(updatedValue), {});
    this.patchFieldValueAndParameters(this.form.get('feeTnxList'), JSON.stringify(updatedValue), {});
  }
  this.patchFieldValueAndParameters(this.form.get('childProductCode'), FccGlobalConstant.PRODUCT_FT, {});
  this.patchFieldValueAndParameters(this.form.get('childSubProductCode'), FccGlobalConstant.CHILD_SUB_PRODUCT_CODE_LNFP, {});
  this.patchFieldValueAndParameters(this.form.get('bkType'), FccGlobalConstant.BK_TYPE_BKFP, {});
  this.patchFieldValueAndParameters(this.form.get('subTnxTypeCode'), FccGlobalConstant.SUB_TNX_TYPE_CODE_B3, {});
}

  onClickFeeDetailsEntity(event) {
    if (event && event.value) {
      this.patchFieldValueAndParameters(this.form.get('feeDetailsEntity'), event.value, {});
      this.updateCommonData(event.value);
      this.form.get('feeDetailsEntity').updateValueAndValidity();
    }
  }
  updateCommonData(entity) {
    const selectedRec = JSON.parse(this.form.get('feeTnxList').value);
    const ftTnxRecord = 'ft_tnx_record';
    if (selectedRec && selectedRec[ftTnxRecord] && selectedRec[ftTnxRecord].length > 0){
      selectedRec[ftTnxRecord].forEach((rec) => {
        rec.fee_entity = entity ? entity.shortName : null;
      });
    }
    this.patchFieldValueAndParameters(this.form.get('feeTnxList'), JSON.stringify(selectedRec), {});
  }

  updateEntityList() {
    this.entities = [];
    this.multiBankService.getLendingEntityList().forEach(entity => {
      this.entities.push(entity);
    });
    if (this.entities.length === 0) {
      if (this.form.get('feeDetailsEntity')) {
        this.form.get('feeDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.setMandatoryField(this.form, 'feeDetailsEntity', false);
        this.form.get('feeDetailsEntity').clearValidators();
        this.form.get('feeDetailsEntity').updateValueAndValidity();
      }
    } else if (this.entities.length === 1) {
      this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('feeDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get('feeDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('feeDetailsEntity').setValue({ label: this.entities[0].value.label, name: this.entities[0].value.name,
        shortName: this.entities[0].value.shortName });
      this.form.get('feeDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    } else if (this.entities.length > 1) {
      this.form.get('threeSpace01')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('feeDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get('feeDetailsEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
    return this.entities;
  }

  updateEntity() {
    if (this.form.get('feeDetailsEntity') && this.form.get('feeDetailsEntity').value
        && this.stateService.getSectionData(FccGlobalConstant.BLFP_GENERAL_DETAILS).get('feeDetailsEntity')) {
      const feeDetailsEntity = this.stateService.getValue(FccGlobalConstant.BLFP_GENERAL_DETAILS, 'feeDetailsEntity', false);
      if (feeDetailsEntity ) {
        this.form.get('feeDetailsEntity').setValue( this.entities.filter(
          task => task.value.label === feeDetailsEntity)[0].value);
      }
    }

    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.multiBankService.getBorrowerReferenceInternalList().forEach(internalRef => {
        if (this.form.get('feeDetailsReference').value === internalRef.value) {
          this.patchFieldValueAndParameters(this.form.get('lendingRefID'), internalRef.id, {});
          this.facilityDetailsService.setCurrentBorrower(internalRef.id);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.savedResponseSubscription && this.savedResponseSubscription.length > 0){
      this.savedResponseSubscription.forEach(sub => {
        sub.unsubscribe();
      });
    }
    this.stateService.setStateSection(
      FccGlobalConstant.BLFP_GENERAL_DETAILS,
      this.form
    );
  }
}
