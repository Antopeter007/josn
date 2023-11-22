import { CurrencyConverterPipe } from './../../pipes/currency-converter.pipe';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef, SelectItem } from 'primeng';
import { BehaviorSubject } from 'rxjs';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LcConstant } from '../../../common/model/constant';
import { ProductStateService } from '../../../common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { UtilityService } from '../../services/utility.service';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { LcProductComponent } from './../lc-product/lc-product.component';
import { LcProductService } from '../../../services/lc-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
@Component({
  selector: 'app-license-details',
  templateUrl: './license-details.component.html',
  styleUrls: ['./license-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LicenseDetailsComponent }]
})
export class LicenseDetailsComponent extends LcProductComponent implements OnInit {
  statuses: SelectItem[];
  editTableData;
  lcResponse ;
  patchdata: boolean;
  columnsHeader = [];
  columnsHeaderData = [];
  responseArray = [];
  formModelArray = [];
  clonedProducts: { [s: string]: any } = {};
  form: FCCFormGroup;
  lcConstant = new LcConstant();
  module: string;
  tnxTypeCode;
  allowOverDraw;
  isMasterRequired: any;
  licenseOutStandingAmt;
  tableColumns = [];
  tnxAmount: any;
  beneficiary;
  currency;
  applicantEntity;
  applicant;
  expiryDate;
  errorMsg;
  OMR = 'OMR';
  BHD = 'BHD';
  TND = 'TND';
  JPY = 'JPY';
  twoDecimal = 2;
  threeDecimal = 3;
  flagDecimalPlaces;
  length2 = FccGlobalConstant.LENGTH_2;
  validatorPattern = FccGlobalConstant.AMOUNT_VALIDATION;
  linkedLicenseDetails: any;
  mode: any;
  PRODUCT_CODE;
  LICENSE_DETAILS = FccGlobalConstant.LICENSE_DETAILS;
  convertedAmountConstant = FccGlobalConstant.LS_LIAB_AMT;
  constructor(
    protected stateService: ProductStateService,
    protected emitterService: EventEmitterService,
    protected commonService: CommonService,
    protected translationService: TranslateService,
    protected searchLayoutService: SearchLayoutService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected confirmationService: ConfirmationService,
    protected fileList: FilelistService,
    protected dialogRef: DynamicDialogRef,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected lcProductService: LcProductService
  ) {
    super(emitterService, stateService, commonService, translationService, confirmationService, customCommasInCurrenciesPipe,
          searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, lcProductService);
    this.module = translationService.instant('licenseDetails');
  }

  ngOnInit(): void {
    this.patchdata = false;
    window.scroll(0, 0);
    this.isMasterRequired = this.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.form = this.stateService.getSectionData(FccGlobalConstant.LICENSE_DETAILS, null, this.isMasterRequired);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if ( this.stateService.getSectionData('amountChargeDetails').get('amount').value !== '' &&
      this.stateService.getSectionData('amountChargeDetails').get('amount').value !== null &&
      this.stateService.getSectionData('amountChargeDetails').get('amount').value !== undefined) {
    this.tnxAmount = this.stateService.getSectionData('amountChargeDetails').get('amount').value;
    }
    if (this.tnxAmount !== '' && this.tnxAmount !== null && this.tnxAmount !== undefined) {
      this.tnxAmount = this.commonService.replaceCurrency(this.tnxAmount);
      this.tnxAmount = parseFloat(this.tnxAmount);
    }
    if (this.commonService.isNonEmptyValue(this.stateService.getSectionData('amountChargeDetails').get('currency').value) &&
      this.stateService.getSectionData('amountChargeDetails').get('currency').value !== '' &&
      this.commonService.isNonEmptyValue(this.stateService.getSectionData('amountChargeDetails').get('currency').value.value)) {
      this.currency = this.stateService.getSectionData('amountChargeDetails').get('currency').value.value;
    } else if (this.commonService.isNonEmptyValue(
        this.stateService.getSectionData('amountChargeDetails').get('currency').value) &&
    this.stateService.getSectionData('amountChargeDetails').get('currency').value !== '' &&
    this.commonService.isNonEmptyValue(this.stateService.getSectionData('amountChargeDetails').get('currency').value.currencyCode)) {
    this.currency = this.stateService.getSectionData('amountChargeDetails').get('currency').value.currencyCode;
    }else if (this.stateService.getSectionData('amountChargeDetails').get('currency').value !== null &&
      this.stateService.getSectionData('amountChargeDetails').get('currency').value !== '' &&
      this.stateService.getSectionData('amountChargeDetails').get('currency').value !== undefined) {
      this.currency = this.stateService.getSectionData('amountChargeDetails').get('currency').value;
    }
    if ( this.mode !== FccGlobalConstant.INITIATE && !this.commonService.formLicenseGrid) {
    if ( this.form.get(FccGlobalConstant.LINKEDLICENSES).value !== null && this.form.get(FccGlobalConstant.LINKEDLICENSES).value !== '' &&
    this.form.get(FccGlobalConstant.LINKEDLICENSES).value !== undefined) {
      this.linkedLicenseDetails = this.form.get(FccGlobalConstant.LINKEDLICENSES).value;
      this.commonService.formLicenseGrid = true;
      if (this.linkedLicenseDetails) {
      const licenseArray = [];
      const licenseJSON = JSON.parse(this.linkedLicenseDetails);
      if (licenseJSON.license.length > 0) {
        licenseJSON.license.forEach(element => {
          const selectedJson: { BO_REF_ID: any; LS_NUMBER: any, REF_ID: any, LS_LIAB_AMT: any, amount: any } = {
            BO_REF_ID: element.bo_ref_id,
            LS_NUMBER: element.ls_number,
            REF_ID: element.ls_ref_id,
            LS_LIAB_AMT: element.ls_os_amt,
            amount: element.ls_allocated_amt
          };
          licenseArray.push(selectedJson);
          const obj = {};
          obj[FccGlobalConstant.RESPONSE_DATA] = licenseArray;
          this.handleLicenseGrid(obj, this.isMasterRequired);
        });
        } else if (Object.keys(licenseJSON[FccGlobalConstant.LICENSE]).length > 0 && licenseJSON.constructor === Object &&
              licenseJSON[FccGlobalConstant.LICENSE].ls_ref_id !== undefined && licenseJSON[FccGlobalConstant.LICENSE].ls_ref_id !== ''
                && licenseJSON[FccGlobalConstant.LICENSE].ls_ref_id !== null) {
            const selectedJson: { BO_REF_ID: any; LS_NUMBER: any, REF_ID: any, LS_LIAB_AMT: any, amount: any } = {
              BO_REF_ID: licenseJSON.license[FccGlobalConstant.BO_REF_ID],
              LS_NUMBER: licenseJSON.license[FccGlobalConstant.LS_NUMBER],
              REF_ID: licenseJSON.license[FccGlobalConstant.LS_REF_ID],
              LS_LIAB_AMT: licenseJSON.license[FccGlobalConstant.LS_OS_AMOUNT],
              amount: licenseJSON.license[FccGlobalConstant.LS_ALLOCATED_AMT]
            };
            licenseArray.push(selectedJson);
            const obj = {};
            obj[FccGlobalConstant.RESPONSE_DATA] = licenseArray;
            this.handleLicenseGrid(obj, this.isMasterRequired);
        }
      }
      }
    }

    this.initializeFormGroup();
    const OverDrawStatus = 'OverDrawStatus';
    this.form.get('license')[FccGlobalConstant.PARAMS][OverDrawStatus] = false;
    if (this.commonService.isNonEmptyValue(
        this.stateService.getSectionData('applicantBeneficiaryDetails').controls.beneficiaryEntity.value) &&
        this.stateService.getSectionData('applicantBeneficiaryDetails').controls.beneficiaryEntity.value !== ''
    && this.commonService.isNonEmptyValue(
        this.stateService.getSectionData('applicantBeneficiaryDetails').controls.beneficiaryEntity.value.name)) {
      this.beneficiary = this.stateService.getSectionData('applicantBeneficiaryDetails').controls.beneficiaryEntity.value.name;
    } else if (this.commonService.isNonEmptyValue(
        this.stateService.getSectionData('applicantBeneficiaryDetails').controls.beneficiaryEntity.value)) {
        this.beneficiary = this.stateService.getSectionData('applicantBeneficiaryDetails').controls.beneficiaryEntity.value;
    }
    if (this.stateService.getSectionData('applicantBeneficiaryDetails').controls.applicantName.value !== null &&
      this.stateService.getSectionData('applicantBeneficiaryDetails').controls.applicantName.value !== '' &&
      this.stateService.getSectionData('applicantBeneficiaryDetails').controls.applicantName.value !== undefined) {
    this.applicant = this.stateService.getSectionData('applicantBeneficiaryDetails').controls.applicantName.value;
      }
    this.expiryDate = this.stateService.getSectionData('generalDetails').get('expiryDate').value;
    this.form.get(FccGlobalConstant.LICENSE_UPLOAD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = '';
  }

  // overriding for new currency pipe usage can be replaced once changes done for all products
  ValidateMultipleLicense() {
    const data = 'data';
    const tnsAmountStatus = 'tnsAmountStatus';
    let licenseArr;
    if (this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== '' &&
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== null &&
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== undefined) {
      licenseArr = this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data];
    }
    this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][tnsAmountStatus] = false;
    let sum = 0;
    if (licenseArr !== null && licenseArr !== undefined && licenseArr !== '') {
      for (let i = 0; i < licenseArr.length; i++) {
        if (licenseArr[i].amount !== '' && licenseArr[i].amount !== null && licenseArr[i].amount !== undefined) {
          let amount = licenseArr[i].amount;
          amount = this.commonService.replaceCurrency(amount);
          amount = parseFloat(amount);
          sum = sum + amount;
          licenseArr[i].amount = this.currencyConverterPipe.transform(amount.toString(), this.currency);
        }
      }
    }

    if (sum !== this.tnxAmount && licenseArr !== null && licenseArr !== undefined && (licenseArr.length > 0)) {
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][tnsAmountStatus] = true;
      this.form.get(FccGlobalConstant.LICENSE).setErrors({ invalid: true });
    } else {
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][tnsAmountStatus] = false;
      this.form.get(FccGlobalConstant.LICENSE).setErrors(null);
    }
    this.form.updateValueAndValidity();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickTrash(ele, a, b) {
    this.onEventClickTrashLicense(ele, a, b);
  }

  ngOnDestroy() {
    this.ValidateMultipleLicense();
    this.commonService.defaultLicenseFilter = false;
    this.commonService.toggleLicenseFilter = false;
    this.commonService.licenseCheckBoxRequired = 'Y';
    this.updateDataArray();
    this.stateService.setStateSection(FccGlobalConstant.LICENSE_DETAILS, this.form, this.isMasterRequired);
    this.commonService.formLicenseGrid = false;
    if (this.lcResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.lcResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
  }
  }

  onRowEditInit(product) {
    this.clonedProducts[product.id] = { ...product };
  }

  onRowEditCancel() {
    //eslint : no-empty-function
  }
  initializeFormGroup() {
    //eslint : no-empty-function
  }
}
