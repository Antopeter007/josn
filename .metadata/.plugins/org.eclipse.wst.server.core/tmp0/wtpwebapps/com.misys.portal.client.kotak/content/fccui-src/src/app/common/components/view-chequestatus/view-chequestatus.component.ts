import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FCCBase } from '../../../base/model/fcc-base';
import { FCCFormGroup } from '../../..//base/model/fcc-control.model';
import { HOST_COMPONENT } from '../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { TranslateService } from '@ngx-translate/core';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { FccConstants } from '../../core/fcc-constants';
import { Validators } from '@angular/forms';
import { iif } from 'rxjs/internal/observable/iif';
import { Observable } from 'rxjs/internal/Observable';
import { DashboardService } from '../../services/dashboard.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-view-chequestatus',
  templateUrl: './view-chequestatus.component.html',
  styleUrls: ['./view-chequestatus.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ViewChequestatusComponent }]
})
export class ViewChequestatusComponent extends FCCBase implements OnInit {
  dir: string = localStorage.getItem('langDir');
  form: FCCFormGroup;
  inputJson: any;
  exportFileName: any;
  pCol3 = 'p-col-6 p-lg-6 p-md-6 p-sm-12 inputStyle';
  module: any;
  mode: any;
  options: any;
  radioButtons: any;
  accounts: any;
  entityId: any;
  fetching: any;
  entityDataArray: any;
  chequeNoLength: any;
  errMsg: any;
  isValid: any;
  arr: any;
  cheques: any[];
  allowedNoOfCheques: any;
  chequeNoSeq: any;
  seqNumMaxLen: number;
  bankName: string;
  warningmessage = 'multipleChequemessage';
  warning = 'warning';

  constructor(
    protected dynamicDialogConfig: DynamicDialogConfig,
    protected translateService: TranslateService,
    protected corporateCommonService: CommonService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected formControlService: FormControlService,
    protected dashboardService: DashboardService,
    protected dynamicDialogRef: DynamicDialogRef) {
    super();
  }

  ngOnInit() {
    this.radioButtons = [
      {
        value: '01',
        valueStyleClass: 'p-col-6 p-lg-6 p-md-6 p-sm-6 leftwrapper padding_zero'
      },
      {
        value: '02',
        valueStyleClass: 'p-col-6 p-lg-6 p-md-6 p-sm-6 rightwrapper padding_zero'
      },
      {
        value: '03',
        valueStyleClass: 'p-col-6 p-lg-6 p-md-6 p-sm-6 leftwrapper padding_zero'
      }
    ];
    this.corporateCommonService.putQueryParameters(FccGlobalConstant.ACTION, 'ChqStatusInquirySearchAction');
    if (this.dynamicDialogConfig && this.dynamicDialogConfig.data) {
      this.inputJson = this.dynamicDialogConfig.data;
      this.inputJson.forEach(element => {
        // eslint-disable-next-line no-console
        console.log(element);
        if (element.name === FccConstants.CHEQUENO) {
          element.options = this.radioButtons;
          element.value = element.defaultValue;
        }
      });
      this.initializeFormGroup();
      this.getEntityId();
      this.updateUserAccounts();
    }
  }

  updateUserEntities() {
    if (this.entityDataArray.length === 1) {
      this.form.get('entity').setValue(this.entityDataArray[0].label);
      this.form.get('entity')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    }
    this.form.updateValueAndValidity();
  }

  initializeFormGroup() {
    this.form = new FCCFormGroup({});
    this.form = this.formControlService.getFormControls(this.inputJson);
    this.setFormFieldValidations();
    this.checkSeqNumValidation();
    this.form.get(FccConstants.ACCOUNT_NO)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    if (this.form && this.form.get(FccGlobalConstant.ENTITY)) {
      this.form.get(FccGlobalConstant.ENTITY)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    }
    this.form.addFCCValidators(FccConstants.CHEQUE_NO, Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFocusApplyBtn(event: any) {
    this.dynamicDialogRef.close(this.form);
  }

  onFocusCancelBtn() {
    this.dynamicDialogRef.close();
  }

  getEntityId() {
    this.corporateCommonService.getFormValues(FccGlobalConstant.STATIC_DATA_LIMIT, this.fccGlobalConstantService.userEntities)
      .pipe(
        tap(() => this.fetching = true)
      )
      .subscribe(res => {
        this.fetching = false;
        this.entityDataArray = [];
        res.body.items.forEach(value => {
          const entity: { label: string; value: any } = {
            label: value.shortName,
            value: value.shortName
          };
          this.entityDataArray.push(entity);
        });
        this.patchFieldParameters(this.form.get(FccConstants.ENTITY), { options: this.entityDataArray });
      });
    this.updateUserEntities();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onKeydownEntity(event: any) {
    this.onClickEntity(event);
  }

  updateUserAccounts() {
    iif(() => this.corporateCommonService.isnonEMptyString(this.entityId),
      this.getUserAccountsByEntityId(),
      this.allUserAccounts()
    ).subscribe(
      response => {
        this.accounts = [];
        if (response.items.length > 0) {
          response.items.forEach(
            value => {
              const account: { label: string, value: any } = {
                label: value.number,
                value: {
                  accountNo: value.number,
                  id: value.id,
                  currency: value.currency,
                  type: value.type,
                  accountContext: value.accountContext ? value.accountContext : ''
                }
              };
              this.accounts.push(account);
            });
          this.patchFieldParameters(this.form.get(FccConstants.ACCOUNT_NO), { options: this.accounts });
        }
      });
  }

  getUserAccountsByEntityId(accountParameters?: any): Observable<any> {
    return this.dashboardService.getUserAccountsByEntityId(this.entityId, accountParameters);
  }

  allUserAccounts(): Observable<any> {
    return this.dashboardService.getUserAccount();
  }

  onClickChequeno(event: any) {
    if (this.corporateCommonService.isNonEmptyValue(event.value) && event.value === FccGlobalConstant.CODE_01) {
      this.form.get(FccConstants.CHEQUE_NO_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.CHEQUE_NO_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.CHEQUE_NUMBERS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.CHEQUE_NO_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.CHEQUE_NO_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.CHEQUE_NUMBERS)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.CHEQUE_NUMBERS)[FccGlobalConstant.PARAMS][this.warning] = FccGlobalConstant.EMPTY_STRING;
      this.form.get(FccConstants.CHEQUE_NO_FROM).setValue(null);
      this.form.get(FccConstants.CHEQUE_NO_TO).setValue(null);
      this.form.get(FccConstants.CHEQUE_NUMBERS).setValue(null);
      this.form.get(FccConstants.CHEQUE_NO_FROM).clearValidators();
      this.form.get(FccConstants.CHEQUE_NO_TO).clearValidators();
      this.form.get(FccConstants.CHEQUE_NUMBERS).clearValidators();
      this.form.get(FccConstants.CHEQUE_NO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.CHEQUE_NO)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.addFCCValidators(FccConstants.CHEQUE_NO, Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
      this.form.updateValueAndValidity();
    } else if (this.corporateCommonService.isNonEmptyValue(event.value) && event.value === FccGlobalConstant.CODE_02) {
      this.form.get(FccConstants.CHEQUE_NO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.CHEQUE_NUMBERS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.CHEQUE_NO)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.CHEQUE_NUMBERS)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.CHEQUE_NUMBERS)[FccGlobalConstant.PARAMS][this.warning] = FccGlobalConstant.EMPTY_STRING;
      this.form.get(FccConstants.CHEQUE_NO).setValue(null);
      this.form.get(FccConstants.CHEQUE_NUMBERS).setValue(null);
      this.form.get(FccConstants.CHEQUE_NO).clearValidators();
      this.form.get(FccConstants.CHEQUE_NUMBERS).clearValidators();
      this.form.get(FccConstants.CHEQUE_NO_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.CHEQUE_NO_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.CHEQUE_NO_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccConstants.CHEQUE_NO_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccConstants.CHEQUE_NO_FROM).setValidators(Validators.required);
      this.form.get(FccConstants.CHEQUE_NO_TO).setValidators(Validators.required);
      this.form.addFCCValidators(FccConstants.CHEQUE_NO_FROM, Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
      this.form.addFCCValidators(FccConstants.CHEQUE_NO_TO, Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
      if (this.entityDataArray.length >= 1) {
        this.corporateCommonService.isSpacerRequired = true;
      }
      this.form.updateValueAndValidity();
    } else if (this.corporateCommonService.isNonEmptyValue(event.value) && event.value === FccGlobalConstant.CODE_03) {
      this.form.get(FccConstants.CHEQUE_NO_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.CHEQUE_NO_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.CHEQUE_NO)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(FccConstants.CHEQUE_NO_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.CHEQUE_NO_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.CHEQUE_NO)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      this.form.get(FccConstants.CHEQUE_NO_FROM).setValue(null);
      this.form.get(FccConstants.CHEQUE_NO_TO).setValue(null);
      this.form.get(FccConstants.CHEQUE_NO).setValue(null);
      this.form.get(FccConstants.CHEQUE_NO_FROM).clearValidators();
      this.form.get(FccConstants.CHEQUE_NO_TO).clearValidators();
      this.form.get(FccConstants.CHEQUE_NO).clearValidators();
      this.form.get(FccConstants.CHEQUE_NUMBERS)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccConstants.CHEQUE_NUMBERS)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccConstants.CHEQUE_NUMBERS)[FccGlobalConstant.PARAMS][
        this.warning
      ] = `${this.translateService.instant(this.warningmessage)}`;
      this.form.get(FccConstants.CHEQUE_NUMBERS).setValidators(Validators.required);
      this.form.addFCCValidators(FccConstants.CHEQUE_NUMBERS,
        Validators.compose([Validators.pattern(FccGlobalConstant.commaseparatednumberPattern)]), 0);
      this.form.updateValueAndValidity();
    }
    this.form.updateValueAndValidity();
  }

  onChangeCheque_no(event: any) {
      if (event.srcElement.value.length !== this.chequeNoLength){
        this.form.get('cheque_no').setErrors({ invalidChequeNumber: { maxSize: this.chequeNoLength } });
        this.form.updateValueAndValidity();
    }
  }

  onChangeChequeno_from(event: any) {
    this.form.addFCCValidators(FccConstants.CHEQUE_NO_FROM, Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
    if (event.srcElement.value.length === this.chequeNoLength){
      this.checkRange();
    }else {
      this.form.get(FccConstants.CHEQUE_NO_FROM).setErrors({ invalidChequeNumber: { maxSize: this.chequeNoLength } });
    }
    this.form.updateValueAndValidity();
  }

  onChangeCheque_numbers(event: any) {
    this.arr = event.srcElement.value.split(',');
    this.cheques = [];
    this.arr.forEach(val => {
    this.isValid = /^[0-9]*$/.test(val);
    if (!this.isValid || val.length !== this.chequeNoLength || val === ''){
         this.form.get(FccConstants.CHEQUE_NUMBERS).setErrors({ invalidChequeNumber: { maxSize: this.chequeNoLength } });
      }else if (this.isValid && val.length === this.chequeNoLength){
        if (this.cheques.indexOf(val) === -1){
          this.cheques.push(val);
        }else{
          this.errMsg = this.translateService.instant('duplicateChequeNum');
          this.form.get(FccConstants.CHEQUE_NUMBERS).setErrors({ duplicateChequeNum: this.errMsg });
        }
      }
    });

    if (this.arr.length > this.allowedNoOfCheques){
      this.errMsg = this.translateService.instant('invalidChequeCount') + this.allowedNoOfCheques;
      this.form.get(FccConstants.CHEQUE_NUMBERS).setErrors({ invalidChequeCount: this.errMsg });
    }
    this.form.updateValueAndValidity();
  }

  checkSeqNumValidation() {
    this.corporateCommonService.getBankDetails().subscribe(
        bankRes => {
          this.bankName = bankRes.shortName;
          this.corporateCommonService.getParameterConfiguredValues(this.bankName,
            FccGlobalConstant.PARAMETER_P709).subscribe(responseData => {
              if (this.corporateCommonService.isNonEmptyValue(responseData) &&
              this.corporateCommonService.isNonEmptyValue(responseData.paramDataList)) {
                this.chequeNoSeq = responseData.paramDataList;
                this.seqNumMaxLen = Number(this.chequeNoSeq[0].data_1);
                this.allowedNoOfCheques = Number(this.chequeNoSeq[0].data_2);
              }
            });
        });
  }

  onChangeChequeno_to(event: any) {
    this.form.addFCCValidators(FccConstants.CHEQUE_NO_TO, Validators.compose([Validators.pattern(FccGlobalConstant.numberPattern)]), 0);
    if (event.srcElement.value.length === this.chequeNoLength){
      this.checkRange();
    }else {
      this.form.get(FccConstants.CHEQUE_NO_TO).setErrors({ invalidChequeNumber: { maxSize: this.chequeNoLength } });
    }
    this.form.updateValueAndValidity();
  }

  checkRange() {
    if (this.corporateCommonService.isNonEmptyValue(this.form.get(FccConstants.CHEQUE_NO_FROM).value) &&
      this.corporateCommonService.isNonEmptyValue(this.form.get(FccConstants.CHEQUE_NO_TO).value)){
      if (/^[0-9]*$/.test(this.form.get(FccConstants.CHEQUE_NO_FROM).value)) {
      if ((this.form.get(FccConstants.CHEQUE_NO_FROM).value > this.form.get(FccConstants.CHEQUE_NO_TO).value) ||
      (this.form.get(FccConstants.CHEQUE_NO_FROM).value === this.form.get(FccConstants.CHEQUE_NO_TO).value)){
        this.errMsg = this.translateService.instant('chequeNumberFromErrLessThan');
        this.form.get(FccConstants.CHEQUE_NO_FROM).setErrors({ chequeNumberFromErr: this.errMsg });
      } else if (this.corporateCommonService.isNonEmptyValue(this.form.get(FccConstants.CHEQUE_NO_FROM).value) &&
      (this.form.get(FccConstants.CHEQUE_NO_FROM).value < this.form.get(FccConstants.CHEQUE_NO_TO).value)) {
        this.form.get(FccConstants.CHEQUE_NO_FROM).setErrors(null);
        this.form.get(FccConstants.CHEQUE_NO_FROM).updateValueAndValidity();
      }
    }
    }else {
      this.form.get(FccConstants.CHEQUE_NO_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    }
  }

  setFormFieldValidations() {
    this.corporateCommonService.loadDefaultConfiguration().subscribe(response => {
      if (this.corporateCommonService.isNonEmptyValue(response)){
        this.chequeNoLength = response.chequeNumberLength;
        this.chequeNoLength = Number(this.chequeNoLength);
      }
    });
    this.form.get(FccConstants.CHEQUE_NO)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.form.get(FccConstants.CHEQUE_NO).setValidators(Validators.required);
    this.form.get(FccConstants.CHEQUE_NO)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAXLENGTH] = this.chequeNoLength;
    this.form.get(FccConstants.CHEQUE_NO_FROM)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAXLENGTH] = this.chequeNoLength;
    this.form.get(FccConstants.CHEQUE_NO_TO)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAXLENGTH] = this.chequeNoLength;
   }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickEntity(event: any) {
    const elementId = 'entity';
    let elementValue = this.form.get(elementId).value;
    if (elementValue === null) {
      elementValue = FccGlobalConstant.EMPTY_STRING;
    }
    if (elementValue.length >= 0) {
      const entityDataArray = [];
      this.corporateCommonService.getFormValues(
        this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.userEntities)
        .subscribe(result => {
          result.body.items.forEach(value => {
            const entity: { label: string; value: any } = {
              label: value.shortName,
              value: value.shortName
            };
            entityDataArray.push(entity);
          });
          entityDataArray.sort((a, b) => {
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
          this.patchFieldParameters(this.form.get(elementId), { options: entityDataArray });
          this.form.get(elementId).updateValueAndValidity();
          this.form.updateValueAndValidity();
        });
    }
    this.form.get(elementId).updateValueAndValidity();
  }
}
