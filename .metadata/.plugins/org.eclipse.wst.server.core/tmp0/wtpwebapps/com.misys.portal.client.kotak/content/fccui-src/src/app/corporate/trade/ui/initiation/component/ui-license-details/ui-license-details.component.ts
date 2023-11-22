import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { LcConstant } from '../../../../lc/common/model/constant';
import { ProductStateService } from '../../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { CurrencyConverterPipe } from '../../../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { EventEmitterService } from './../../../../../../common/services/event-emitter-service';
import { UiService } from './../../../common/services/ui-service';
import { UiProductComponent } from './../ui-product/ui-product.component';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ui-license-details',
  templateUrl: './ui-license-details.component.html',
  styleUrls: ['./ui-license-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiLicenseDetailsComponent }]
})
export class UiLicenseDetailsComponent extends UiProductComponent implements OnInit {
  statuses: SelectItem[];
  editTableData;
  lcResponse;
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

  convertedAmountConstant = FccGlobalConstant.CONVERTEDAMT;
  LICENSE_DETAILS = FccGlobalConstant.UI_LICENSE_DETAILS;

  constructor(
    protected stateService: ProductStateService,
    protected emitterService: EventEmitterService,
    protected commonService: CommonService,
    protected translationService: TranslateService,
    protected searchLayoutService: SearchLayoutService,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected uiService: UiService,
    protected confirmationService: ConfirmationService,
    protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef, protected uiProductService: UiProductService
  ) {
    super(emitterService, stateService, commonService, translationService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, uiProductService);
    this.module = translationService.instant('uiLicenseDetails');
  }

  ngOnInit(): void {
    this.patchdata = false;
    window.scroll(0, 0);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const operation = this.commonService.getQueryParametersFromKey('operation');
    this.form = this.stateService.getSectionData(FccGlobalConstant.UI_LICENSE_DETAILS);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if ( this.uiService.getBgAmt() !== '' && this.uiService.getBgAmt() !== undefined && this.uiService.getBgAmt() !== null) {
    this.tnxAmount = this.uiService.getBgAmt();
    }

    if (this.tnxAmount !== '' && this.tnxAmount !== null && this.tnxAmount !== undefined) {
      this.tnxAmount = this.commonService.replaceCurrency(this.tnxAmount);
      this.tnxAmount = parseFloat(this.tnxAmount);
    }
    if (operation === 'PREVIEW' && this.uiService.getBgCurCode() !== null && this.uiService.getBgCurCode() !== '' &&
      this.uiService.getBgCurCode() !== undefined) {
      this.currency = this.uiService.getBgCurCode();
    } else if (this.uiService.getBgCurCode() !== null && this.uiService.getBgCurCode() !== '' &&
      this.uiService.getBgCurCode() !== undefined) {
      this.currency = this.uiService.getBgCurCode();
    }
    if (this.mode !== FccGlobalConstant.INITIATE && !this.commonService.formLicenseGrid) {
      if (this.form.get(FccGlobalConstant.LINKEDLICENSES).value !== null && this.form.get(FccGlobalConstant.LINKEDLICENSES).value !== '' &&
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
              this.handleLicenseGrid(obj);
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
            this.handleLicenseGrid(obj);
          }
        }
      }
    }

    this.initializeFormGroup();
    const OverDrawStatus = 'OverDrawStatus';
    this.form.get('license')[FccGlobalConstant.PARAMS][OverDrawStatus] = false;
    if (this.stateService.getSectionData('uiApplicantBeneficiaryDetails').controls.beneficiaryEntity !== null &&
   this.commonService.isNonEmptyValue(this.stateService.getSectionData('uiApplicantBeneficiaryDetails').controls.beneficiaryEntity.value)) {
      this.beneficiary = this.stateService.getSectionData('uiApplicantBeneficiaryDetails').controls.beneficiaryEntity.value.name;
    }
    if (this.stateService.getSectionData('uiApplicantBeneficiaryDetails').controls.applicantName.value !== null &&
      this.stateService.getSectionData('uiApplicantBeneficiaryDetails').controls.applicantName.value !== '' &&
      this.stateService.getSectionData('uiApplicantBeneficiaryDetails').controls.applicantName.value !== undefined) {
      this.applicant = this.stateService.getSectionData('uiApplicantBeneficiaryDetails').controls.applicantName.value;
    }
    this.expiryDate = this.uiService.getBgExpDate();
    this.form.get(FccGlobalConstant.LICENSE_UPLOAD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = '';
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
    this.stateService.setStateSection(FccGlobalConstant.UI_LICENSE_DETAILS, this.form);
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

  onClickLinkLicense() {
    if ( this.expiryDate !== '' && this.expiryDate !== undefined && this.expiryDate !== null) {
      if (this.lcResponse !== undefined) {
        this.lcResponse = null;
      }
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);

      const header = `${this.translationService.instant('licenseList')}`;
      const obj = {};
      this.commonService.defaultLicenseFilter = true;
      let subProduct = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
      if ((subProduct === undefined || subProduct === null) && this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAILS) &&
      this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAILS).controls.bgSubProductCode !== null &&
      this.commonService.isNonEmptyValue(
        this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAILS)
          .controls.bgSubProductCode.value
      )) {
      subProduct = this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAILS).controls.bgSubProductCode.value;
      }
      obj[FccGlobalConstant.PRODUCT] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      obj[FccGlobalConstant.SUB_PRODUCT_CODE] = (subProduct !== undefined && subProduct !== null) ? subProduct : '';
      obj[FccGlobalConstant.OPTION] = '';
      obj[FccGlobalConstant.BUTTONS] = false;
      obj[FccGlobalConstant.SAVED_LIST] = false;
      obj[FccGlobalConstant.HEADER_DISPLAY] = false;
      obj[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] = false;
      obj[FccGlobalConstant.LISTDEF] = FccGlobalConstant.LIST_LICENSE_SCREEN;
      obj[FccGlobalConstant.EXPIRY_DATE_FIELD] = this.expiryDate;
      obj[FccGlobalConstant.CURRENCY] = this.currency;
      obj[FccGlobalConstant.DEFAULT_LICENSE_FILTER] = true;
      obj[FccGlobalConstant.BENEFICIARY_NAME] = this.beneficiary;
      this.resolverService.getSearchData(header, obj);
      this.getLicenseList();

    } else {
      this.errorMsg = `${this.translationService.instant(FccGlobalConstant.LICENSE_UPLOAD_ERROR)}`;
      this.form.get(FccGlobalConstant.LICENSE_UPLOAD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = this.errorMsg;
      this.form.get(FccGlobalConstant.LICENSE_UPLOAD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
    }
  }
}
