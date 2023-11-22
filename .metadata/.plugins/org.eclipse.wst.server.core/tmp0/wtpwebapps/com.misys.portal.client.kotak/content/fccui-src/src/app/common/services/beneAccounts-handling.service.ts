import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { FilelistService } from '../../corporate/trade/lc/initiation/services/filelist.service';
import { TranslateService } from '@ngx-translate/core';
import { CodeData } from '../model/codeData';
import { ProductStateService } from '../../corporate/trade/lc/common/services/product-state.service';
import { FccConstants } from '../core/fcc-constants';
import { FCMBeneConstants } from '../../corporate/system-features/fcm-beneficiary-maintenance/fcm-beneficiary-general-details/fcm-beneficiary-general-details.constants';


@Injectable({
  providedIn: 'root'
})

export class BeneAccountsHandlingService {
  contentType = 'Content-Type';
  tableColumns = [];
  contextPath: any;
  formModelArray = [];
  responseArray = [];
  codeData = new CodeData();
  columnsHeader = [];
  columnsHeaderData = [];
  name = 'name';
  required = 'required';
  maxlength = 'maxlength';
  type = 'type';
  columnsParam = 'columns';
  columnsHeaderDataParam = 'columnsHeaderData';
  beneAccountDetails: any;
  licenseOutStandingAmt: any;
  currency: any;
  option: any;
  subTnxTypeCode: any;
  isMaster = false;

  constructor(protected fileListSvc: FilelistService, protected translationService: TranslateService,
              protected commonService: CommonService, protected stateService: ProductStateService) {
  }

  handleBeneAccountsTable(control: any, sectionForm: any, productCode: any, sectionName: any, master = false) {
    this.isMaster = master;
    this.handleBeneAccounts(control, sectionForm, productCode, sectionName);
  }

  handleBeneAccounts(control: any, sectionForm: any, productCode: any, sectionName: any) {
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if ( mode !== FccGlobalConstant.INITIATE) {
    if (sectionForm.get('linkedAccounts').value && Object.keys(sectionForm.get('linkedAccounts').value).length) {
      this.beneAccountDetails = sectionForm.get('linkedAccounts').value;
      if (this.beneAccountDetails) {
      const beneAccountsArray = [];
      const beneAccountsJSON = JSON.parse(this.beneAccountDetails);
      if (beneAccountsJSON.length > 0) {
        beneAccountsJSON.forEach(element => {
          const selectedJson: { defaultAccountFlag: any; accountNumber: any, confirmAccountNumber: any, accountType: any,
            beneficiaryBankIfscCode: any, beneficiaryBankName: any, beneficiaryBankBranch: any, paymentType: any, beneficiaryStatus: any
            accountCurrency: any, associationId: any, editOnlyFlag: any } = {
            defaultAccountFlag: element.default_account,
            accountNumber: element.bene_acct_nmbr,
            confirmAccountNumber: element.bene_acct_nmbr,
            accountType: {
              label: element.bene_account_type,
              shortName: element.bene_account_type
            },
            beneficiaryBankIfscCode: {
              label: element.bankcode,
              shortName: element.bankcode
            },
            beneficiaryBankName: element.bankname,
            beneficiaryBankBranch: element.benebranchdesc,
            paymentType: {
              label: element.product_category_desc,
              shortName: element.product_category_desc
            },
            accountCurrency: {
              label: element.bene_account_ccy,
              shortName: element.bene_account_ccy
            },
            associationId: element.drawer_code,
            beneficiaryStatus: FccConstants.SUBMITTED,
            editOnlyFlag: element.default_account === FccGlobalConstant.CODE_Y ? false : true
          };
          beneAccountsArray.push(selectedJson);
          const obj = {};
          obj[FccGlobalConstant.RESPONSE_DATA] = beneAccountsArray;
          this.handleBeneAccountsGrid(obj, control, sectionForm, productCode, sectionName);
        });
        }
      }
      }
    }
  }

  handleBeneAccountsGrid(response: any, fieldControl: any, sectionForm: any, productCode: any, sectionName: any) {
    sectionForm.get(FccConstants.ACCOUNTS_LIST_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.LIST_DATA
    ] = true;
    sectionForm.get(FccConstants.ACCOUNTS_LIST_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.COLUMNS
    ] = FCMBeneConstants.ACCOUNTS_TABLE_COLUMNS;

    sectionForm.get(FccConstants.ACCOUNTS_LIST_TABLE)[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA] = response[FccGlobalConstant.RESPONSE_DATA];
    this.stateService.setStateSection(sectionName, sectionForm, this.isMaster);
    sectionForm.updateValueAndValidity();
  }

}
