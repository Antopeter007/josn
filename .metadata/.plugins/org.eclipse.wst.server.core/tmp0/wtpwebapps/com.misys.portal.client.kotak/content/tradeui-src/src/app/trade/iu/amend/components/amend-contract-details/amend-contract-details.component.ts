import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng';
import { Constants } from '../../../../../common/constants';
import { validateCurrCode, validateSwiftCharSet, validateDates } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IssuedUndertaking } from '../../../common/model/issuedUndertaking.model';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { CurrencyDialogComponent } from '../../../../../common/components/currency-dialog/currency-dialog.component';
import { CommonService } from '../../../../../common/services/common.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { DropdownOptions } from '../../../common/model/DropdownOptions.model';


@Component({
  selector: 'fcc-iu-amend-contract-details',
  templateUrl: './amend-contract-details.component.html',
  styleUrls: ['./amend-contract-details.component.scss']
})
export class AmendContractDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  amendContractDetailsSection: UntypedFormGroup;
  viewMode = false;
  unsignedMode = false;
  public displayTenderDate = false;
  orgData = new IssuedUndertaking();
  public currencies;
  yearRange: string;
  dateFormat: string;
  public contractReferences: DropdownOptions[];


  constructor( public fb: UntypedFormBuilder, public dialog: DialogService,
               public validationService: ValidationService, public translate: TranslateService,
               public commonDataService: IUCommonDataService, protected staticDataService: StaticDataService,
               public commonService: CommonService) { }

  ngOnInit() {
    this.dateFormat = this.commonService.getDateFormat();
    if (this.commonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
        this.unsignedMode = true;
      }
    this.orgData = this.commonDataService.getOrgData();
    const contractNarrativeLength = 35;
    const contractCurCodeLength = 3;
    this.amendContractDetailsSection = this.fb.group({
      contractReference: [{value: '', disabled: false}] ,
      contractNarrative: ['', [Validators.maxLength(contractNarrativeLength), validateSwiftCharSet(Constants.X_CHAR)]],
      contractDate: '',
      tenderExpiryDate: '',
      contractCurCode: ['', [Validators.maxLength(contractCurCodeLength)]],
      contractAmt: [''],
      contractPct: ['', [Validators.pattern(Constants.REGEX_PERCENTAGE)]]
    });
    this.initFieldValues();
    if (!(this.bgRecord[`contractReference`] && this.bgRecord[`contractReference`] !== null
        && this.bgRecord[`contractReference`] !== '')) {
      this.amendContractDetailsSection.get(`contractReference`).setValue(null);
    }
    // Emit the form group to the parent
    this.formReady.emit(this.amendContractDetailsSection);
    this.yearRange = this.commonService.getYearRange();
  }

  initFieldValues() {
    this.contractReferences = this.commonDataService.getContractReference('') as DropdownOptions[];
    if (this.bgRecord.contractReference !== '') {
      this.amendContractDetailsSection.get('contractReference').setValue(this.bgRecord.contractReference);
      if (this.bgRecord.contractReference === 'TEND') {
          this.displayTenderDate = true;
        }
    }

    this.amendContractDetailsSection.patchValue({
  contractNarrative: this.bgRecord.contractNarrative,
  contractDate: this.bgRecord.contractDate,
  tenderExpiryDate: this.bgRecord.tenderExpiryDate,
  contractCurCode: this.bgRecord.contractCurCode,
  contractAmt: this.bgRecord.contractAmt,
  contractPct: this.commonService.getPercentWithoutLanguageFormatting(this.bgRecord.contractPct)
  });
}

  toDisplay(event) {
    if (event && event === 'TEND') {
     this.displayTenderDate = true;
    } else {
      this.displayTenderDate = false;
    }
  }

  selectCurrency() {
    let dialogHeader = '';
    this.translate.get('KEY_HEADER_CURRENCY_LOOKUP').subscribe((res: string) => {
      dialogHeader =  res;
    });
    const dialogRef = this.dialog.open(CurrencyDialogComponent, {
      header: dialogHeader,
      width: '450px',
      height: '480px',
    });
    dialogRef.onClose.subscribe(result => {
      this.amendContractDetailsSection.get('contractCurCode').setValue(result);
      this.commonService.transformAmtAndSetValidators(this.amendContractDetailsSection.get('contractAmt'),
                           this.amendContractDetailsSection.get('contractCurCode'), 'contractCurCode');
      this.amendContractDetailsSection.get('contractAmt').updateValueAndValidity();
    });

  }

  validateCurrency() {
    let tempCurrencies;
    if (this.currencies === undefined || this.currencies === null || this.currencies.length === 0) {
      this.currencies = [];
      this.staticDataService.getCurrencies().subscribe(data => {
        tempCurrencies = data.currencies as string[];
        this.currencies = tempCurrencies;
        this.amendContractDetailsSection.controls.contractCurCode.setValidators([validateCurrCode(this.currencies)]);
        this.amendContractDetailsSection.get('contractCurCode').updateValueAndValidity();
      });
    } else {
      this.amendContractDetailsSection.controls.contractCurCode.setValidators([validateCurrCode(this.currencies)]);
      this.amendContractDetailsSection.get('contractCurCode').updateValueAndValidity();
    }
  }

  validateNewContractDate() {
      this.amendContractDetailsSection.get('contractDate').
      setValidators(validateDates(this.amendContractDetailsSection.get('contractDate'),
      this.amendContractDetailsSection.parent.get('amendGeneraldetailsSection').get('bgAmdDate'),
      'New Contract Date' , 'Amend Release Date' , 'greaterThan'));

      this.amendContractDetailsSection.get('contractDate').updateValueAndValidity();
  }

  clearContractDate(event) {
    this.amendContractDetailsSection.get('contractDate').setValue('');
  }

  clearTenderExpiryDate(event) {
    this.amendContractDetailsSection.get('tenderExpiryDate').setValue('');
   }

   hasContractDateValue(): boolean {
    if (this.amendContractDetailsSection.get(`contractDate`) &&
        this.amendContractDetailsSection.get(`contractDate`).value !== null &&
        this.amendContractDetailsSection.get(`contractDate`).value !== '') {
      return true;
    } else {
      return false;
    }
  }

  hasTenderExpDateValue(): boolean {
    if (this.amendContractDetailsSection.get(`tenderExpiryDate`) &&
        this.amendContractDetailsSection.get(`tenderExpiryDate`).value !== null &&
        this.amendContractDetailsSection.get(`tenderExpiryDate`).value !== '') {
      return true;
    } else {
      return false;
    }
  }
}
