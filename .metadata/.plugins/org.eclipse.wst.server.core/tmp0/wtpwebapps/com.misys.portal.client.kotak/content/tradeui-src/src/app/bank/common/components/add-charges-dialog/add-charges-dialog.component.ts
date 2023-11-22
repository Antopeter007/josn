import { CommonDataService } from './../../../../common/services/common-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DialogService, DynamicDialogConfig, ConfirmationService } from 'primeng';
import { DropdownOptions } from '../../../../trade/iu/common/model/DropdownOptions.model';
import { ValidationService } from '../../../../common/validators/validation.service';
import { ChargeService } from '../../../../common/services/charge.service';
import { TradeCommonDataService } from '../../../../trade/common/services/trade-common-data.service';
import { Constants } from '../../../../common/constants';
import { validateSwiftCharSet, validateCurrCode } from '../../../../common/validators/common-validator';
import { CurrencyDialogComponent } from '../../../../common/components/currency-dialog/currency-dialog.component';
import { Charge } from '../../../../common/model/charge.model';
import { CommonService } from '../../../../common/services/common.service';
import { IUCommonDataService } from './../../../../trade/iu/common/service/iuCommonData.service';
import { StaticDataService } from './../../../../common/services/staticData.service';
import { LicenseService } from './../../../../common/services/license.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'fcc-common-add-charges-dialog',
  templateUrl: './add-charges-dialog.component.html',
  styleUrls: ['./add-charges-dialog.component.scss'],
  providers: [DialogService]
})
export class AddChargesDialogComponent implements OnInit {

  @Input() chargeSection: UntypedFormGroup;
  chargeOptions: DropdownOptions [];
  statusOptions: DropdownOptions [];
  chargeId;
  charge: Charge;
  yearRange: string;
  chargedetailsForm: UntypedFormGroup;
  mode: string;
  dateFormat: string;
  public currencies;
  currencyDecimalMap = new Map<string, number>();
  decimalNumberOfCurrency: number;
  constructor(protected fb: UntypedFormBuilder, public validationService: ValidationService, public ref: DynamicDialogRef,
              public translate: TranslateService, public confirmationService: ConfirmationService,
              public config: DynamicDialogConfig, protected chargeService: ChargeService,
              public dialogService: DialogService, protected license: LicenseService, protected datePipe: DatePipe,
              public commonDataService: IUCommonDataService, protected staticDataService: StaticDataService,
              public commonService: CommonService, protected tradeCommonDataService: TradeCommonDataService,
              public commonData: CommonDataService) { }

  ngOnInit() {
    this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();
    this.buildForm();
    this.chargedetailsForm = this.config.data.form;
    this.yearRange = this.commonService.getYearRange();
    this.chargeOptions = this.tradeCommonDataService.getChargeType('');
    this.statusOptions = this.tradeCommonDataService.getChargeStatus('');
    if (this.config.data.charge !== null && this.config.data.charge !== '') {
        this.initFieldValues();
        this.mode = 'DRAFT';
    } else {
        this.chargeId = this.config.data.chargeId;
    }
    this.dateFormat = this.commonService.getDateFormat();
    // set Max Application Date
    let curDate;
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    curDate = this.commonService.getDateObject(currentDate);
    this.commonService.setcurrentdate(curDate);
  }

  buildForm() {
    const maxLen368 = 368;
    const maxLen3 = 3;
    this.chargeSection = this.fb.group({
      charge: ['', [Validators.required]] ,
      description: ['', [Validators.required, Validators.maxLength(maxLen368), validateSwiftCharSet(Constants.Z_CHAR)]],
      bgCurCode: ['', [Validators.maxLength(maxLen3), Validators.required, validateSwiftCharSet(Constants.X_CHAR)]],
      bgAmt: ['', [Validators.required]],
      status: ['', [Validators.required]],
      settlementDate: [{value: '', disabled: true}]
    });
    this.chargeSection.patchValue({
      bgCurCode: this.config.data.curCode,
    });
  }

  initFieldValues() {
    this.charge = this.config.data.charge as Charge;
    this.chargeId = Number(this.charge.chargeId);
    this.chargeSection.patchValue({
      charge: this.charge.chrgCode ,
      description: this.charge.additionalComment ,
      bgCurCode: this.charge.curCode,
      bgAmt: this.charge.amt,
      status: this.charge.status,
      settlementDate: this.charge.settlementDate
    });
    this.toggleOnStatus(this.charge.status);
    }

  onSave() {
    this.validateAllFields();
    if (this.chargeSection.valid) {
      const charge = new Charge();
      charge.chargeId = this.chargeId.toString();
      charge.chrgCode = this.chargeSection.get('charge').value;
      charge.additionalComment = this.chargeSection.get('description').value;
      charge.curCode = this.chargeSection.get('bgCurCode').value;
      charge.amt = this.chargeSection.get('bgAmt').value;
      charge.status = this.chargeSection.get('status').value;
      charge.settlementDate = this.chargeSection.get('settlementDate').value;
      charge.createdInSession = 'Y';
      if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
        charge.bearerRoleCode = '01';
      } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
        charge.bearerRoleCode = '02';
      }
      this.ref.close();
      if (this.mode === 'DRAFT') {
        this.chargeService.updateCharges(charge);
      } else {
        this.chargeService.addCharges(charge);
      }

    }
  }

  selectCurrency(curCode: any, amtField: any) {
    const dialogRef = this.dialogService.open(CurrencyDialogComponent, {
      header: 'List Of Currencies',
      width: '440px',
      height: '500px',
      contentStyle: {'max-height': '510px'}
    });
    dialogRef.onClose.subscribe((isoCode: string) => {
      if (isoCode) {
        this.chargeSection.get(curCode).setValue(isoCode);
        this.commonDataService.setCurCode(isoCode, '');
        this.chargeSection.get(amtField).updateValueAndValidity();
        this.commonService.transformAmtAndSetValidators( this.chargeSection.get(amtField), this.chargeSection.get(curCode), curCode);
      }
    });
}

  validateCurrency(value) {
  let tempCurrencies;
  if (this.currencies === undefined || this.currencies === null || this.currencies.length === 0) {
    this.currencies = [];
    this.staticDataService.getCurrencies().subscribe(data => {
      tempCurrencies = data.currencies as string[];
      this.currencies = tempCurrencies;
      value.setValidators([value.validators, validateCurrCode(this.currencies)]);
      value.updateValueAndValidity();
    });
  } else {
    value.setValidators([value.validators, validateCurrCode(this.currencies)]);
    value.updateValueAndValidity();
  }
}

  updateLicenseList(inputField) {
  if (this.license.licenseMap.length === 0) {
    if (inputField === 'dialog') {
      this.selectCurrency('bgCurCode', 'bgAmt');
    }
    this.commonDataService.setCurCode(this.chargeSection.get('bgCurCode').value, '');
  } else {
      let message = '';
      let dialogHeader = '';
      this.translate.get('DELINK_LICENSE_CONFIRMATION_MSG').subscribe((value: string) => {
              message =  value;
              });
      this.translate.get('DAILOG_CONFIRMATION').subscribe((res: string) => {
          dialogHeader =  res;
        });
      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: 'pi pi-exclamation-triangle',
        key: 'deleteLicenseConfirmDialog',
        accept: () => {
          this.license.removeLinkedLicense();
          if (inputField === 'dialog') {
            this.selectCurrency('bgCurCode', 'bgAmt');
          }
          this.commonDataService.setCurCode(this.chargeSection.get('bgCurCode').value, '');
        },
        reject: () => {
          this.chargeSection.get('bgCurCode').setValue(this.commonDataService.getCurCode(''));
        }
      });
    }
  }

  onCancel() {
    this.ref.close();
  }

  toggleOnStatus(event) {
    if (event === '01') {
      this.chargeSection.controls.settlementDate.enable();
      if (this.chargeSection.get('settlementDate').value == null || this.chargeSection.get('settlementDate').value === '') {
        const currentDate = this.datePipe.transform(new Date(), Constants.DATE_FORMAT_DMY);
        this.chargeSection.controls.settlementDate.setValue(currentDate);
      }
      this.chargeSection.controls.settlementDate.setValidators([Validators.required]);
      this.commonService.setSettlementDateValidator('settlementDate', this.chargedetailsForm, this.chargeSection);
      this.chargeSection.controls.settlementDate.updateValueAndValidity();
        } else {
      this.chargeSection.controls.settlementDate.setValue('');
      this.chargeSection.controls.settlementDate.disable();
    }
  }

  validateAllFields() {
    this.chargeSection.markAllAsTouched();
  }
}
