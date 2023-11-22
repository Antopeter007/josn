import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../common/services/common.service';
import { CurrencyAbbreviationPipe } from '../../../pipes/currency-abbreviation.pipe';
import { DashboardService } from './../../../services/dashboard.service';
import { IAccountData } from './../../../../common/model/accountGroup';
import { ListDefService } from '../../../services/listdef.service';
import { MessageService } from 'primeng';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  data: any[] = [];
  accountType: '';
  accounts: any[] = [];
  resultArray: any[] = [];
  selected: boolean;
  items: any[];
  selectedItems: any = [];
  vals: any;
  modifiedAccountsData = new Map<string, string>();
  accountData = {} as IAccountData;
  group: any;
  selectedAccount: any;
  errorState = false;
  errorMessage: any;
  submitDisabled = true;
  allGroupAccountsData: any[] = [];
  groupname: any;
  groupAccounts: any;
  displayGroupName: any;
  maxGroupNameLength = 35;
  header: any;
  isCreateGroup: any;
  isValidName = true;
  dir: string = localStorage.getItem('langDir');
  minGroupAccounts: any;
  groupWarningMessage: any;
  isGroupAccount: boolean;
  editAccountCount: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    protected commonService: CommonService,
    protected dashboardService: DashboardService,
    protected translateService: TranslateService,
    protected currencyAbbreviation: CurrencyAbbreviationPipe,
    protected listService: ListDefService,
    protected messageService: MessageService,
    protected translate: TranslateService,
    protected dynamicDialogRef: MatDialogRef<EditDialogComponent>
  ) {

    this.selectedAccount = data;
    this.group = data?.selectedGroupInfo;
    this.groupAccounts = data.accounts;
    this.isCreateGroup = data.isCreateGroup;
    this.displayGroupName = data.displayGroupName;
    this.header = data.header === '' ? '' : this.translate.instant(data.header);
    this.groupname = this.group === undefined ? '' : this.group.groupName;
    this.commonService.igroupName = this.groupname;
    this.minGroupAccounts = data.minGroupAccounts === undefined ? '' : data.minGroupAccounts;
    this.allGroupAccountsData = data.payment;
  }

  ngOnInit(): void {
    this.getSelectedAccount();
    this.getAvailabeAccount();
    if (this.commonService.isNonEmptyValue(this.displayGroupName) && this.isCreateGroup) {
      this.groupWarningMessage = `${this.translate.instant('createGroupMessage',
        { count: this.minGroupAccounts })}`;
    }
    else if (this.commonService.isNonEmptyValue(this.displayGroupName) && !this.isCreateGroup) {
      this.groupWarningMessage = `${this.translate.instant('editGroupMessage')}`;
      this.editAccountCount = this.group.groupAccountCount;
    }
  }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBlur(event) {
    const groupName = this.groupname;
    this.isValidName = true;
    if (this.commonService.isnonEMptyString(groupName) && !(/^[a-zA-Z0-9]*$/.test(groupName))) {
      this.isValidName = false;
    }
    this.checkIfModified();
  }

  getAvailabeAccount() {
    if (this.displayGroupName) {
      this.isGroupAccount = true;
    } else {
      this.isGroupAccount = false;
    }
    this.groupAccounts.forEach((element: any) => {
      const accountNo = element.index.filter(item => item.name === 'account_no');
      const accountDesc = element.index.filter(item => item.name === FccGlobalConstant.ACCOUNT_TYPE);
      const accountId = element.index.filter(item => item.name === 'account_id');
      const entity = {
        accountNo: accountNo[0].value,
        descriptionData: this.translate.instant(this.commonService.decodeHtml(accountDesc[0].value)),
        accountId: accountId[0].value
      };
      if (!this.selectedItems.some(account => account.accountId === entity.accountId)) {
        this.resultArray.push(entity);
      }
    });
  }

  getSelectedAccount() {
    if (this.isCreateGroup !== true) {
      if (this.allGroupAccountsData) {
        this.allGroupAccountsData.forEach((element: any) => {
          const accountNo = element.index.filter(item => item.name === FccGlobalConstant.ACCOUNT_NUMBER);
          const accountDesc = element.index.filter(item => item.name === FccGlobalConstant.ACCOUNT_TYPE);
          const accountId = element.index.filter(item => item.name === FccGlobalConstant.ACCOUNT_ID);
          const entity = {
            accountNo: accountNo[0].value,
            descriptionData: this.translate.instant(FccGlobalConstant.CODEDATA_ACCOUNT_TYPE_N068 + '_' +
            this.commonService.decodeHtml(accountDesc[0].value)),
            accountId: accountId[0].value
          };
          this.selectedItems.push(entity);
        });
      }
      const filterArray = this.selectedItems.reduce((accumalator, current) => {
        if (!accumalator.some(item => item.accountNo === current.accountNo && item.accountDesc === current.accountDesc)) {
          accumalator.push(current);
        }
        return accumalator;
      }, []);
      this.selectedItems = filterArray;
    }
  }

  select(vals: any, idx: number) {
    if (vals.selected) {
      return;
    }
    vals.selected = true;
    this.selectedItems.push(vals);
    if (this.modifiedAccountsData.has(vals.accountId)) {
      this.modifiedAccountsData.delete(vals.accountId);
    } else {
      this.modifiedAccountsData.set(vals.accountId, FccGlobalConstant.ACTION_ADD);
    }
    this.resultArray.splice(idx, 1);
    if (!this.isCreateGroup) {
      this.editAccountCount = this.editAccountCount + 1;
    }
    this.checkIfModified();
  }

  unSelect(vals: any, idx: number) {
    vals.selected = false;
    this.selectedItems.splice(idx, 1);
    this.resultArray.push(vals);
    if (this.modifiedAccountsData.has(vals.accountId)) {
      this.modifiedAccountsData.delete(vals.accountId);
    } else {
      this.modifiedAccountsData.set(vals.accountId, FccGlobalConstant.ACTION_DELETE);
    }
    if (!this.isCreateGroup) {
      this.editAccountCount = this.editAccountCount - 1;
    }
    this.checkIfModified();
  }

  checkIfModified() {
    if (this.modifiedAccountsData.size > 0 && !(this.isGroupAccount) && this.displayGroupName) {
      this.submitDisabled = true;
    }
    else if (this.isGroupAccount && this.isCreateGroup && this.modifiedAccountsData.size < this.minGroupAccounts) {
      this.submitDisabled = true;
    }
    else if (this.isGroupAccount && !this.isCreateGroup && this.editAccountCount < this.minGroupAccounts) {
      this.submitDisabled = true;
    }
    else if (this.groupname === undefined || this.groupname === '') {
      this.submitDisabled = true;
    } else if (this.groupname === this.commonService.igroupName && this.modifiedAccountsData.size === 0) {
      this.submitDisabled = true;
    } else if (!this.isValidName) {
      this.submitDisabled = true;
    }
    else {
      this.submitDisabled = false;
    }

    if (this.commonService.isNonEmptyValue(this.displayGroupName) && this.isCreateGroup &&
    this.modifiedAccountsData.size < this.minGroupAccounts || (this.isCreateGroup && this.submitDisabled)) {
      this.groupWarningMessage = `${this.translate.instant('createGroupMessage',
        { count: this.minGroupAccounts })}`;
    }
    else if (this.commonService.isNonEmptyValue(this.displayGroupName) && !this.isCreateGroup &&
    this.editAccountCount < this.minGroupAccounts) {
      this.groupWarningMessage = `${this.translate.instant('createGroupMessage',
        { count: this.minGroupAccounts })}`;
    } else if (this.commonService.isNonEmptyValue(this.displayGroupName) && !this.isCreateGroup &&
    this.commonService.isEmptyValue(this.groupname)) {
      this.groupWarningMessage = `${this.translate.instant('createGroupMessage',
        { count: this.minGroupAccounts })}`;
    } else if (this.commonService.isNonEmptyValue(this.displayGroupName) && !this.isCreateGroup &&
    this.groupname === this.commonService.igroupName && this.modifiedAccountsData.size === 0 ) {
      this.groupWarningMessage = `${this.translate.instant('editGroupMessage',
      { count: this.minGroupAccounts })}`;
    }
    else {
      this.groupWarningMessage = '';
    }
  }

  setAccountGroup() {
    if (this.isCreateGroup) {
      this.accountData.name = this.groupname;
      this.accountData.accounts = [];
      for (const [key] of this.modifiedAccountsData.entries()) {
        this.accountData.accounts.push({
          accountId: key
        });
      }
      this.dashboardService
        .createAccountGroup(this.accountData)
        .subscribe((response) => {
          if (response.status === FccGlobalConstant.LENGTH_200) {
            this.onConfirmationSave(this.groupname, 'groupCreateToasterMessage');
            this.group = { groupId: response.body.id };
            this.dynamicDialogRef.close(this.group);
            this.errorState = false;
          }
        }, err => {
          this.errorState = true;
          const account = this.selectedItems.find(item => item.accountId === err.error.causes[0].field) ?
            this.selectedItems.find(item => item.accountId === err.error.causes[0].field) :
            this.resultArray.find(item => item.accountId === err.error.causes[0].field);
          if (account && account.descriptionData) {
            this.errorMessage = err.error.causes[0].title + '(' + account.descriptionData + ')';
          } else {
            this.errorMessage = err.error.causes[0].title;
          }
        });

    } else {
      if (this.displayGroupName) {
        this.accountData.name = this.groupname;
      } else {
        this.accountData.name = this.group.groupName;
      }
      this.accountData.classification = this.group.classification;
      this.accountData.accounts = [];
      for (const [key, value] of this.modifiedAccountsData.entries()) {
        this.accountData.accounts.push({
          accountId: key,
          operation: value,
        });
      }
      this.dashboardService
        .setAccountGroup(this.accountData, this.group.groupId)
        .subscribe((response) => {
          if (response.status === FccGlobalConstant.LENGTH_200) {
            this.onConfirmationSave(this.group.groupName, 'groupSaveToasterMessage');
            this.dynamicDialogRef.close(this.group);
            this.errorState = false;
          }
        }, errorResponse => {
          this.errorState = true;
          const account = this.selectedItems.find(item => item.accountId === errorResponse.error.causes[0].field) ?
            this.selectedItems.find(item => item.accountId === errorResponse.error.causes[0].field) :
            this.resultArray.find(item => item.accountId === errorResponse.error.causes[0].field);
          if (account && account.descriptionData) {
            this.errorMessage = errorResponse.error.causes[0].title + '(' + account.descriptionData + ')';
          } else {
            this.errorMessage = errorResponse.error.causes[0].title;
          }
        });
    }
  }

  onConfirmationSave(groupName: any, msg: any) {
    const tosterObj = {
      maxOpened: 1,
      autoDismiss: true,
      life: 2000,
      key: 'tc',
      severity: 'success',
      detail: `${this.translateService.instant(groupName)}` + ' ' + `${this.translateService.instant(msg)}`
    };
    this.messageService.add(tosterObj);
  }

  ngOnDestroy() {
    this.displayGroupName = false;
    this.isCreateGroup = false;
    this.commonService.igroupName = '';
  }
}


