import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UaProductComponent } from '../ua-product/ua-product.component';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { ProductStateService } from './../../../lc/common/services/product-state.service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './../../../../../common/services/common.service';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { ResolverService } from './../../../../../common/services/resolver.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { DynamicDialogRef } from 'primeng';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { UaProductService } from '../../services/ua-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ua-license-details',
  templateUrl: './ua-license-details.component.html',
  styleUrls: ['./ua-license-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UaLicenseDetailsComponent }]
})
export class UaLicenseDetailsComponent extends UaProductComponent implements OnInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  module = `${this.translationService.instant('uaLicenseDetails')}`;
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

  constructor(protected eventEmitterService: EventEmitterService, protected stateService: ProductStateService,
              protected commonService: CommonService, protected translationService: TranslateService,
              protected confirmationService: ConfirmationService, protected utilityService: UtilityService,
              protected translateService: TranslateService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected searchLayoutService: SearchLayoutService, protected resolverService: ResolverService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uaProductService: UaProductService) {
                super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
                  searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, uaProductService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const sectionName = FccGlobalConstant.UA_LICENSE_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
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
    if (this.stateService.getSectionData &&
    this.stateService.getSectionData(FccGlobalConstant.UA_GENERAL_DETAIL).get('bgExpDate')) {
    this.expiryDate = this.stateService.getSectionData(FccGlobalConstant.UA_GENERAL_DETAIL).get('bgExpDate').value;
    }
    if ( this.mode !== FccGlobalConstant.INITIATE && !this.commonService.formLicenseGrid) {
    if ( this.form.get(FccGlobalConstant.LINKEDLICENSES) && this.form.get(FccGlobalConstant.LINKEDLICENSES).value !== null
    && this.form.get(FccGlobalConstant.LINKEDLICENSES).value !== '' &&
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
    if (this.form.get('licenseUploadError')) {
    this.form.get('licenseUploadError')[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = '';
    }
  }

  onClickLinkLicense() {
    if ( this.expiryDate !== '' && this.expiryDate !== undefined && this.expiryDate !== null) {
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

  handleLicenseGrid(response: any) {
    let existingArr = [];
    this.allowOverDraw = response.responseData[0]['LICENSEDEFINITION@ALLOW_OVERDRAW'];
    this.licenseOutStandingAmt = response.responseData[0][FccGlobalConstant.LS_LIAB_AMT];
    existingArr = this.form.get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS];
    if (existingArr?.length > 0) {
      for (let i = 0; i < response.responseData.length; i++) {
        for (let j = 0; j < existingArr.length; j++) {
          if (response.responseData[i].REF_ID === existingArr[j].REF_ID) {
            break;
          } else if (j === existingArr.length - 1) {
              existingArr.push(response.responseData[i]);
          }
        }
      }
      this.form.get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS] = existingArr;
      this.stateService.setStateSection(FccGlobalConstant.UA_LICENSE_DETAILS, this.form);
      this.form.updateValueAndValidity();
    } else {
      this.form.get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS] = response.responseData;
      this.stateService.setStateSection(FccGlobalConstant.UA_LICENSE_DETAILS, this.form);
      this.form.updateValueAndValidity();
    }

    this.stateService.getSectionData(FccGlobalConstant.UA_LICENSE_DETAILS);
    this.formModelArray = this.form.get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.SUBCONTROLSDETAILS];
    this.columnsHeader = [];
    this.columnsHeaderData = [];
    this.formateResult();
    this.patchFieldParameters(this.form.get('license'), { columns: this.columnsHeader });
    this.patchFieldParameters(this.form.get('license'), { columnsHeaderData: this.columnsHeaderData });
    this.form.get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = this.responseArray;
    this.updateDataArray();
    this.form.get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.MESSAGE1] =
      `${this.translationService.instant('Allocatedamountexceed')}`;
    this.form.get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.MESSAGE2] =
      `${this.translationService.instant('SumofAllocatedLicenseamount')}`;
    this.form.get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.TRASH_ACTION] = 'pi-trash';
    this.form.updateValueAndValidity();
    this.form.get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    const sessionArr = this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS];
    if (sessionArr.length === 0) {
      this.form.get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
  }

  ngOnDestroy() {
    this.ValidateMultipleLicense();
    this.commonService.defaultLicenseFilter = false;
    this.commonService.toggleLicenseFilter = false;
    this.commonService.licenseCheckBoxRequired = 'Y';
    this.commonService.formLicenseGrid = false;
    this.updateDataArray();
    this.stateService.setStateSection(FccGlobalConstant.UA_LICENSE_DETAILS, this.form);
    if (this.lcResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.lcResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
  }

  onClickTrash(ele) {
    const sessionCols = 'sessionCols';
    const sessionArr = this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][sessionCols];
    for ( let i = 0; i < sessionArr.length; i++) {
      if ( ele.REF_ID === sessionArr[i].REF_ID ) {
        sessionArr.splice(i , 1);
        this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][sessionCols] = sessionArr;
        this.form.updateValueAndValidity();
        this.stateService.setStateSection(FccGlobalConstant.UA_LICENSE_DETAILS, this.form);
      }
    }
    this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][sessionCols] = sessionArr;
    this.stateService.setStateSection(FccGlobalConstant.UA_LICENSE_DETAILS, this.form);
    this.form.updateValueAndValidity();
    this.stateService.setStateSection(FccGlobalConstant.UA_LICENSE_DETAILS, this.form);
    if (sessionArr.length === 0) {
      const data = 'data';
      this.responseArray = [];
      this.form.get('license')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][sessionCols] = [];
      this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] = [];
      this.stateService.setStateSection(FccGlobalConstant.LICENSE_DETAILS, this.form);
      this.lcResponse = [];
    }
  }

  onRowEditInit(product) {
    this.clonedProducts[product.id] = { ...product };
  }

  formateResult() {
    const sessionCols = 'sessionCols';
    for (let i = 0; i < this.formModelArray.length; i++) {
      let key: any;
      key = Object.keys(this.formModelArray[i]);
      key = key[0];
      this.columnsHeader.push(key);
      const headerdata = this.translationService.instant(key);
      this.columnsHeaderData.push(headerdata);
    }
    this.responseArray = this.form.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][sessionCols];
    for (let i = 0; i < this.responseArray.length; i++) {
      for (let j = 0; j < this.columnsHeader.length; j++) {
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j],
          { value: this.getValue(this.responseArray[i][this.columnsHeader[j]]), writable: true });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Type',
          { value: this.getType(this.columnsHeader[j]), writable: false });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Status',
          { value: this.getEditStatus(this.columnsHeader[j]), writable: false });
      }
    }
  }


  getValue(val: any) {
    if (val) {
      return val;
    } else {
      return '';
    }
  }

  getType(key) {
    let retuntype;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][FccGlobalConstant.NAME].toString()) {
          retuntype = this.formModelArray[i][key][FccGlobalConstant.TYPE];
        }
      } catch (e) {
      }
    }
    return retuntype;
  }

  getEditStatus(key) {
    let retuntype;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][FccGlobalConstant.NAME].toString()) {
          retuntype = this.formModelArray[i][key][FccGlobalConstant.EDIT_STATUS];
        }
      } catch (e) {
      }
    }
    return retuntype;
  }
}
