import { IcProductComponent } from './../ic-product/ic-product.component';
import { Component, OnInit } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../common/services/common.service';
import { ResolverService } from '../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../common/services/search-layout.service';
import { ProductStateService } from '../../lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../base/model/fcc-control.model';
import { EventEmitterService } from './../../../../common/services/event-emitter-service';
import { IcProductService } from '../services/ic-product.service';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ic-license-details',
  templateUrl: './ic-license-details.component.html',
  styleUrls: ['./ic-license-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: IcLicenseDetailsComponent }]

})
export class IcLicenseDetailsComponent extends IcProductComponent implements OnInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  module = `${this.translationService.instant('icLicenseDetails')}`;
  lcResponse;
  templateResponse;
  backToBackResponse;
  licenseOutStandingAmt;
  expiryDate: any;
  assigneeName: any;
  currency: any;
  cptyName: any;
  errorMsg: any;
  option: any;
  patchdata: boolean;
  columnsHeader = [];
  columnsHeaderData = [];
  responseArray = [];
  formModelArray = [];
  clonedProducts: { [s: string]: any } = {};
  statuses: SelectItem[];
  editTableData;
  tnxAmount;
  allowOverDraw;
  linkedLicenseDetails: any;
  mode: any;

  LICENSE_DETAILS = FccGlobalConstant.IC_LICENSE_DETAILS;
  convertedAmountConstant = FccGlobalConstant.CONVERTEDAMT;


  constructor(protected eventEmitterService: EventEmitterService, protected stateService: ProductStateService,
              protected commonService: CommonService, protected translationService: TranslateService,
              protected searchLayoutService: SearchLayoutService, protected resolverService: ResolverService,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected utilityService: UtilityService, protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected icProductService: IcProductService
    ) {
    super(eventEmitterService, stateService, commonService, translationService, confirmationService,
          customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileList,
          dialogRef, currencyConverterPipe, icProductService);
}

  ngOnInit() {
    super.ngOnInit();
    const sectionName = 'icLicenseDetails';
    this.form = this.stateService.getSectionData(sectionName);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    if (this.option === FccGlobalConstant.OPTION_ASSIGNEE || this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.currency = this.stateService.getSectionData('assignmentConditions').get('currency').value;
      this.tnxAmount = this.stateService.getSectionData('assignmentConditions').get('assignmentAmount').value;
      if (this.tnxAmount !== '' && this.tnxAmount !== null && this.tnxAmount !== undefined) {
        this.tnxAmount = this.commonService.replaceCurrency(this.tnxAmount);
        this.tnxAmount = parseFloat(this.tnxAmount);
      }
    } else if (this.option === FccGlobalConstant.OPTION_TRANSFER || this.mode === FccGlobalConstant.DRAFT_OPTION) {
      if (this.stateService.getSectionData('transferDetails').get('currency').value !== '' &&
        this.stateService.getSectionData('transferDetails').get('currency').value !== null &&
        this.stateService.getSectionData('transferDetails').get('currency').value !== undefined) {
        this.currency = this.stateService.getSectionData('transferDetails').get('currency').value;
      }
      this.tnxAmount = this.stateService.getSectionData('transferDetails').get('transferAmount').value;
      if (this.tnxAmount !== '' && this.tnxAmount !== null && this.tnxAmount !== undefined) {
        this.tnxAmount = this.commonService.replaceCurrency(this.tnxAmount);
        this.tnxAmount = parseFloat(this.tnxAmount);
      }
    }
    this.expiryDate = this.stateService.getSectionData('icGeneralDetails').get('expiryDate').value;
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
    this.form.get('licenseUploadError')[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = '';
  }

  onClickLinkLicense() {
    if (this.expiryDate !== '' && this.expiryDate !== undefined && this.expiryDate !== null) {
      if (this.lcResponse !== undefined) {
        this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
        this.lcResponse = null;
        this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
      }
      const header = `${this.translationService.instant('licenseList')}`;
      const obj = {};
      this.commonService.defaultLicenseFilter = true;
      const subProduct = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
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
      this.resolverService.getSearchData(header, obj);
      this.getLicenseList();

    } else {
      this.errorMsg = `${this.translationService.instant(FccGlobalConstant.LICENSE_UPLOAD_ERROR)}`;
      this.form.get(FccGlobalConstant.LICENSE_UPLOAD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = this.errorMsg;
      this.form.get(FccGlobalConstant.LICENSE_UPLOAD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
    }
  }

ngOnDestroy() {
  this.ValidateMultipleLicense();
  this.commonService.defaultLicenseFilter = false;
  this.commonService.toggleLicenseFilter = false;
  this.commonService.licenseCheckBoxRequired = 'Y';
  this.commonService.formLicenseGrid = false;
  this.updateDataArray();
  this.stateService.setStateSection(FccGlobalConstant.EL_LICENSE_DETAILS, this.form);
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
