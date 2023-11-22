import { FccGlobalConstant } from '../core/fcc-global-constants';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EventEmitter, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './common.service';
import { SearchLayoutService } from './search-layout.service';
import { NarrativeService } from '../../corporate/trade/lc/initiation/services/narrative.service';
import { ProductMappingService } from './productMapping.service';
import { ResolverService } from './resolver.service';
import { FCCBase } from '../../base/model/fcc-base';
import { DialogService } from 'primeng';
import {
  ConfirmationDialogComponent,
} from '../../../app/corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { DropDownAPIService } from './dropdownAPI.service';

@Injectable({
  providedIn: 'root'
})
export class AccountLookupService extends FCCBase {

  isPAB: any;
  transferFrom : any;

  constructor(protected commonService: CommonService, protected translateService: TranslateService,
    protected searchLayoutService: SearchLayoutService, protected narrativeService: NarrativeService,
    protected productMappingService: ProductMappingService, protected resolverService: ResolverService,
    protected dialogService: DialogService,protected dropdownAPIService: DropDownAPIService) {
    super();
  }

  fetchAccountDetails(form: any, productCode: string, subProductCode: any, entityName: any, bankName: any, option: any) {
    const header = `${this.translateService.instant('listOfAccounts')}`;
    const obj = {};
    obj[FccGlobalConstant.PRODUCT] = productCode;
    obj[FccGlobalConstant.BUTTONS] = false;
    obj[FccGlobalConstant.SAVED_LIST] = false;
    obj[FccGlobalConstant.HEADER_DISPLAY] = false;
    obj[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] = false;
    obj[FccGlobalConstant.FILTER_PARAMS_REQUIRED] = true;
    obj[FccGlobalConstant.OPTION] = option;


    const productCodeValue = {};
    if (productCode !== undefined && productCode !== null && productCode !== '') {
      productCodeValue[FccGlobalConstant.PRODUCT] = productCode;
    }
    if (productCode !== undefined && productCode !== null && productCode !== '') {
      productCodeValue[FccGlobalConstant.PRODUCT_TYPES] = productCode.concat(':' + subProductCode);
    }
    if (entityName !== undefined && entityName !== null && entityName !== '') {
      productCodeValue[FccGlobalConstant.ENTITY] = entityName['shortName'];
    }
    if (bankName !== undefined && bankName !== null && bankName !== '') {
      productCodeValue[FccGlobalConstant.BANK_ABBV_NAME] = bankName['shortName'];
    }

    productCodeValue[FccGlobalConstant.OPTION] = option;
    productCodeValue[FccGlobalConstant.DEBIT_CREDIT] = FccGlobalConstant.DEBIT;
    productCodeValue[FccGlobalConstant.ACTION] = FccGlobalConstant.STATIC_DATA_ACTION;
    obj[FccGlobalConstant.FILTER_PARAMS] = productCodeValue;


    this.resolverService.getSearchData(header, obj);

    //patch value
    this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (response) {
        const selectedAcc = response.responseData[FccGlobalConstant.CURCODE] + " " + response.responseData[FccGlobalConstant.BENE_ACC_NO]
          + " " + response.responseData[FccGlobalConstant.ACT_DESCRIPTION];
        this.transferFrom = response.responseData[FccGlobalConstant.BENE_ACC_NO];
        this.isPAB = response.responseData[FccGlobalConstant.PAB];
        form.get(FccGlobalConstant.FT_BENE_NAME).setErrors(null);
        if(productCode === FccGlobalConstant.PRODUCT_BK){
          form.get(FccGlobalConstant.BK_TRANSFER_FROM).setValue(selectedAcc);
          form.get(FccGlobalConstant.BK_TRANSFER_FROM_ACT_CURRENCY).setValue(response.responseData[FccGlobalConstant.CURCODE]);
          form.get(FccGlobalConstant.BK_TRANSFER_FROM_ACT_NUMBER).setValue(response.responseData[FccGlobalConstant.BENE_ACC_NO]);
          if(this.isPAB === FccGlobalConstant.YES) {
            form.get(FccGlobalConstant.BULK_PAB)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            form.get(FccGlobalConstant.BULK_PAB).setValue(FccGlobalConstant.CODE_Y);
          } else {
            form.get(FccGlobalConstant.BULK_PAB).setValue(FccGlobalConstant.CODE_N);
            form.get(FccGlobalConstant.BULK_PAB)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
          }
        } else {
          form.get(FccGlobalConstant.FT_TRANSFER_FROM).setValue(selectedAcc);
          form.get(FccGlobalConstant.FT_TRANSFER_FROM_ACT_CURRENCY).setValue(response.responseData[FccGlobalConstant.CURCODE]);
          form.get(FccGlobalConstant.FT_TRANSFER_FROM_ACT_NUMBER).setValue(response.responseData[FccGlobalConstant.BENE_ACC_NO]);
          form.get(FccGlobalConstant.FT_TRANSFER_FROM_ACT_DESC).setValue(response.responseData[FccGlobalConstant.ACT_DESCRIPTION]);
          form.get(FccGlobalConstant.FT_TRANSFER_FROM_REFERNCE).setValue(
            response.responseData[FccGlobalConstant.FT_TRANSFER_FROM_REF]);
          form.get(FccGlobalConstant.FT_BENE_NAME).setValue(null);
          form.get(FccGlobalConstant.FT_BENE_ACC).setValue(null);
          form.get(FccGlobalConstant.FT_BENE_NAME)['params']['shortDescription']
            = FccGlobalConstant.EMPTY_STRING;
          form.get(FccGlobalConstant.FT_BENE_CUR_CODE).setValue(null);
          form.get(FccGlobalConstant.FT_CURRCODE).setValue(null);
          form.get(FccGlobalConstant.FT_AMOUNT_FIELD).setValue(null);
        }
        if(this.isPAB === FccGlobalConstant.YES) {
          form.get(FccGlobalConstant.FT_BENE_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = 'readonly-input';
          form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = 'readonly-input';
          form.get(FccGlobalConstant.FT_BENE_NAME)[FccGlobalConstant.PARAMS].readonly = true;
          form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS].readonly = true;
          form.get(FccGlobalConstant.FT_BENE_CUR_CODE)[FccGlobalConstant.PARAMS].readonly = true;
       } else {
          form.get(FccGlobalConstant.FT_BENE_NAME)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = '';
          form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] = '';
          form.get(FccGlobalConstant.FT_BENE_NAME)[FccGlobalConstant.PARAMS].readonly = false;
          form.get(FccGlobalConstant.FT_BENE_ACC)[FccGlobalConstant.PARAMS].readonly = false;
          form.get(FccGlobalConstant.FT_BENE_CUR_CODE)[FccGlobalConstant.PARAMS].readonly = false;
        }
      }
    });
  }

  fetchBeneficiaryDetails(form: any, productCode: string, subProductCode: any, entityName: any, bankName: any, option: any) {
    const header = `${this.translateService.instant('listOfBeneficiary')}`;
    const obj = {};
    obj[FccGlobalConstant.PRODUCT] = productCode;
    obj[FccGlobalConstant.BUTTONS] = false;
    obj[FccGlobalConstant.SAVED_LIST] = false;
    obj[FccGlobalConstant.HEADER_DISPLAY] = false;
    obj[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] = false;
    obj[FccGlobalConstant.FILTER_PARAMS_REQUIRED] = true;
    obj[FccGlobalConstant.OPTION] = option;


    const productCodeValue = {};
    if (productCode !== undefined && productCode !== null && productCode !== '') {
      productCodeValue[FccGlobalConstant.PRODUCT] = subProductCode;
    }
    if (productCode !== undefined && productCode !== null && productCode !== '') {
      productCodeValue[FccGlobalConstant.PRODUCT_TYPES] = subProductCode;
    }
    if (entityName !== undefined && entityName !== null && entityName !== '') {
      productCodeValue[FccGlobalConstant.ENTITYNAME] = entityName[FccGlobalConstant.SHORT_NAME];
    }
    if (bankName !== undefined && bankName !== null && bankName !== '') {
      productCodeValue[FccGlobalConstant.BANK_ABBV_NAME] = bankName[FccGlobalConstant.SHORT_NAME];
    }
    if (form.get(FccGlobalConstant.FT_TRANSFER_FROM).value !== undefined && form.get(FccGlobalConstant.FT_TRANSFER_FROM).value !== null) {
      productCodeValue[FccGlobalConstant.DEBIT_ACC_NO] = this.transferFrom;
    }
    productCodeValue[FccGlobalConstant.OPTION] = option;
    productCodeValue[FccGlobalConstant.DEBIT_CREDIT] = FccGlobalConstant.CREDIT;
    productCodeValue[FccGlobalConstant.PAB_STAT] = this.isPAB ===
    FccGlobalConstant.YES ? FccGlobalConstant.CODE_Y : FccGlobalConstant.CODE_N;

    productCodeValue[FccGlobalConstant.ACTION] = FccGlobalConstant.STATIC_DATA_ACTION;

    obj[FccGlobalConstant.FILTER_PARAMS] = productCodeValue;

    this.resolverService.getSearchData(header, obj);

    //patch value
    this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {
      if (response) {
        if (response.responseData[FccGlobalConstant.BENE_ACC] != form.get(FccGlobalConstant.FT_TRANSFER_FROM).value) {
          form.get(FccGlobalConstant.FT_BENE_ACT_ID).setValue(response.responseData[FccGlobalConstant.beneActID]);
          form.get(FccGlobalConstant.FT_BENE_ACT_PAB).setValue(
            response.responseData[FccGlobalConstant.beneActPab].toLowerCase() === FccGlobalConstant.CONFIRMATION_YES ?
            FccGlobalConstant.CODE_Y : FccGlobalConstant.CODE_N);
          if(form.get(FccGlobalConstant.APPLICANT_ACT_PAB)){
            form.get(FccGlobalConstant.APPLICANT_ACT_PAB).setValue(
              response.responseData[FccGlobalConstant.beneActPab].toLowerCase() === FccGlobalConstant.CONFIRMATION_YES ?
              FccGlobalConstant.CODE_Y : FccGlobalConstant.CODE_N);
          }
          form.get(FccGlobalConstant.FT_BENE_NAME).setValue(response.responseData[FccGlobalConstant.HEADER_BENE_NAME]);
          this.commonService.beneDefaultEmailId = response.responseData[FccGlobalConstant.BENE_EMAIL_ID];
          form.get(FccGlobalConstant.FT_BENE_ACC).setValue(response.responseData[FccGlobalConstant.BENE_ACC]);
          if (response.responseData.HEADER_BENEFICIARY_PRE_APPROVED === 'Yes') {
            form.get(FccGlobalConstant.FT_BENE_NAME)['params']['shortDescription']
            = `${this.translateService.instant(FccGlobalConstant.FT_PAB_MESSAGE)}`;
          }
          else {
            form.get(FccGlobalConstant.FT_BENE_NAME)['params']['shortDescription']
            = FccGlobalConstant.EMPTY_STRING;
          }
          form.get(FccGlobalConstant.FT_BENE_CUR_CODE).setValue(response.responseData[FccGlobalConstant.BENE_CUR_CODE]);
          this.patchDropdownValue(FccGlobalConstant.FT_BENE_CUR_CODE,form);

        } else {
          const headerField = `${this.translateService.instant('error')}`;
          const message = `${this.translateService.instant(FccGlobalConstant.TRANSER_TO_ERR)}`;
          const dir = localStorage.getItem('langDir');
          this.dialogService.open(ConfirmationDialogComponent, {
            header: headerField,
            width: '70em',
            styleClass: 'fileUploadClass',
            style: { direction: dir },
            data: { locaKey: message },
            contentStyle: { direction: dir },
            baseZIndex: 1000,
            autoZIndex: true,
            dismissableMask: false,
            closeOnEscape: true,
          });
        }
      }
    });
    return false;
  }

  patchDropdownValue(key,form) {
    if (form.get(key).value !== FccGlobalConstant.EMPTY_STRING) {
      const valObj = this.dropdownAPIService.getDropDownFilterValueObj(form.controls[key]['options'], key,form);
      if (valObj) {
        form.get(key).patchValue(valObj[`value`]);
      }
    }
  }
}
