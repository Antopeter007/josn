import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { BehaviorSubject } from 'rxjs';

import { FCCFormGroup } from '../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../common/services/common.service';
import { ResolverService } from '../../../../common/services/resolver.service';
import { ProductStateService } from '../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../lc/initiation/services/utility.service';
import { TfProductComponent } from '../initiation/tf-product/tf-product/tf-product.component';
import { EventEmitterService } from './../../../../common/services/event-emitter-service';
import { SearchLayoutService } from './../../../../common/services/search-layout.service';
import { CurrencyConverterPipe } from '../../lc/initiation/pipes/currency-converter.pipe';
import { TfProductService } from '../services/tf-product.service';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
@Component({
  selector: 'app-tf-license-details',
  templateUrl: './tf-license-details.component.html',
  styleUrls: ['./tf-license-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TfLicenseDetailsComponent }]
})
export class TfLicenseDetailsComponent extends TfProductComponent implements OnInit {

  @Output() messageToEmit = new EventEmitter<string>();
  tnxAmount;
  form: FCCFormGroup;
  module = `${this.translationService.instant('ecLicenseDetails')}`;
  expiryDate: any;
  currency: any;
  responseArray = [];
  beneficiary;
  applicant;
  statuses;
  lcResponse;
  columnsHeader = [];
  allowOverDraw;
  licenseOutStandingAmt;
  errorMsg;
  clonedProducts;
  columnsHeaderData = [];
  formModelArray = [];
  linkedLicenseDetails: any;
  mode: any;

  convertedAmountConstant = FccGlobalConstant.LS_LIAB_AMT;
  LICENSE_DETAILS = FccGlobalConstant.TF_LICENSE_DETAILS;

  constructor(protected eventEmitterService: EventEmitterService, protected stateService: ProductStateService,
              protected commonService: CommonService, protected translationService: TranslateService,
              protected searchLayoutService: SearchLayoutService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected resolverService: ResolverService, protected confirmationService: ConfirmationService,
              protected utilityService: UtilityService, protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected tfProductService: TfProductService) {
    super(eventEmitterService, stateService, commonService, translationService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray, dialogRef, currencyConverterPipe,
      tfProductService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const sectionName = 'tfLicenseDetails';
    this.form = this.stateService.getSectionData(sectionName);
    if (this.stateService.getSectionData('tfAmountDetails').get('currency').value !== '' &&
      this.stateService.getSectionData('tfAmountDetails').get('currency').value !== null &&
      this.stateService.getSectionData('tfAmountDetails').get('currency').value !== undefined &&
      this.stateService.getSectionData('tfAmountDetails').get('currency').value.currencyCode !== null &&
      this.stateService.getSectionData('tfAmountDetails').get('currency').value.currencyCode !== '' &&
      this.stateService.getSectionData('tfAmountDetails').get('currency').value.currencyCode !== undefined) {
      this.currency = this.stateService.getSectionData('tfAmountDetails').get('currency').value.currencyCode;
    }
    this.tnxAmount = this.stateService.getSectionData('tfAmountDetails').get('amount').value;
    if (this.tnxAmount) {
      this.tnxAmount = this.commonService.replaceCurrency(this.tnxAmount);
      this.tnxAmount = parseFloat(this.tnxAmount);
    }
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
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
    this.form.get(FccGlobalConstant.LICENSE_UPLOAD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = '';
  }

  onClickLinkLicense() {
    if (this.currency !== undefined && this.currency !== null && this.currency !== '') {
      if (this.lcResponse !== undefined) {
        this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
        this.lcResponse = null;
        this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
      }
      const header = `${this.translationService.instant('licenseList')}`;
      const obj = {};
      this.commonService.defaultLicenseFilter = true;
      const generalDetails = this.stateService.getSectionData('tfGeneralDetails', undefined, false);
      const subProduct = generalDetails.get('typeOfFinancingList').value;
      let finType = generalDetails.get('finType').value;
      if (finType === '99'){
        finType = '';
      }
      obj[FccGlobalConstant.PRODUCT] = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      obj[FccGlobalConstant.SUB_PRODUCT_CODE] = (subProduct !== undefined && subProduct !== null) ? subProduct : '';
      obj[FccGlobalConstant.OPTION] = '';
      obj[FccGlobalConstant.FIN_TYPE] = (finType !== undefined && finType !== null) ? finType : '';
      obj[FccGlobalConstant.BUTTONS] = false;
      obj[FccGlobalConstant.SAVED_LIST] = false;
      obj[FccGlobalConstant.HEADER_DISPLAY] = false;
      obj[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] = false;
      obj[FccGlobalConstant.LISTDEF] = FccGlobalConstant.LIST_LICENSE_SCREEN;
      obj[FccGlobalConstant.CURRENCY] = this.currency;
      obj[FccGlobalConstant.DEFAULT_LICENSE_FILTER] = true;
      this.resolverService.getSearchData(header, obj);
      this.getLicenseList();

    } else {
      this.errorMsg = `${this.translationService.instant('lcLicenseUploadError')}`;
      this.form.get(FccGlobalConstant.LICENSE_UPLOAD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = this.errorMsg;
      this.form.get(FccGlobalConstant.LICENSE_UPLOAD_ERROR)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.ValidateMultipleLicense();
    this.commonService.defaultLicenseFilter = false;
    this.commonService.toggleLicenseFilter = false;
    this.commonService.formLicenseGrid = false;
    this.commonService.licenseCheckBoxRequired = 'Y';
    this.updateDataArray();
    this.stateService.setStateSection(FccGlobalConstant.TF_LICENSE_DETAILS, this.form);
    if (this.lcResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.lcResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
  }

  onRowEditInit(product) {
    this.clonedProducts[product.id] = { ...product };
  }


  initializeFormGroup() {
    //eslint : no-empty-function
  }

  onClickTrash(ele, a, b) {
    this.onEventClickTrashLicense(ele, a, b);
  }

}
