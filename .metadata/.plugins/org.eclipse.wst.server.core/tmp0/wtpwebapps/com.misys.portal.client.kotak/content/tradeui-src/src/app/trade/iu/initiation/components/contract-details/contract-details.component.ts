import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { validateCurrCode, validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CurrencyDialogComponent } from './../../../../../common/components/currency-dialog/currency-dialog.component';
import { Constants } from './../../../../../common/constants';
import { CommonService } from './../../../../../common/services/common.service';
import { CodeData } from './../../../../common/model/codeData.model';
import { validateDates } from './../../../../../common/validators/common-validator';
import { CommonDataService } from './../../../../../common/services/common-data.service';

@Component({
  selector: 'fcc-iu-initiate-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss']
})

export class ContractDetailsComponent implements OnInit {


  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  contractDetails: UntypedFormGroup;
  contractReference: CodeData[];
  viewMode: boolean;
  collapsible: boolean;
  dateFormat: string;
  contractRef: string[] = ['KEY_TENDER', 'KEY_ORDER', 'KEY_CONTRACT', 'KEY_OFFER',
                          'KEY_DELIVERY', 'KEY_PROFORMA_INVOICE', 'KEY_PROJECT'];

  public currencies;
  public contractReferenceObj: any[] = [];
  yearRange: string;

  constructor(public fb: UntypedFormBuilder, protected dialog: DialogService,
              public validationService: ValidationService, public translate: TranslateService, public commonData: CommonDataService,
              public commonDataService: IUCommonDataService, public staticDataService: StaticDataService,
              public commonService: CommonService) { }

  ngOnInit() {
    this.dateFormat = this.commonService.getDateFormat();
    if (this.commonDataService.getDisplayMode() === 'view') {
        this.viewMode = true;
      } else {
        this.viewMode = false;
      }

    if (this.checkForDataIfPresent()) {
        this.collapsible = true;
      } else {
        this.collapsible = false;
      }

    this.contractDetails = this.fb.group({
      contractReference: [''],
      contractNarrative: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      contractDate: [''],
      tenderExpiryDate: [''],
      contractCurCode: ['', [Validators.maxLength(Constants.LENGTH_3)]],
      contractAmt: [''],
      contractPct: ['']
    });

    this.staticDataService.getCodeData('C051').subscribe(data => {
      this.contractReference = data.codeData;
      this.contractReference.forEach(ref => {
        const undertakingElement: any = {};
        undertakingElement.label = ref.longDesc;
        undertakingElement.value = ref.codeVal;
        this.contractReferenceObj.push(undertakingElement);

        if (this.bgRecord.contractReference === undertakingElement.value) {
          this.contractDetails.get('contractReference').setValue(undertakingElement.value);
        }
      });
   });

    if (this.commonDataService.getTnxType() === '01' &&
    (this.commonDataService.getOption() === Constants.OPTION_EXISTING ||
    this.commonDataService.getOption() === Constants.OPTION_REJECTED )) {
      this.initCopyFromFieldValues();
    } else {
      this.initFieldValues();
    }
    if (!(this.bgRecord[`contractReference`] && this.bgRecord[`contractReference`] !== null
       && this.bgRecord[`contractReference`] !== '')) {
       this.contractDetails.get(`contractReference`).setValue(null);
    }
    // Emit the form group to the parent
    this.formReady.emit(this.contractDetails);
    this.yearRange = this.commonService.getYearRange();
  }

  checkForDataIfPresent() {
    const arr = [this.bgRecord.contractReference,
      this.bgRecord.contractNarrative,
      this.bgRecord.contractDate,
      this.bgRecord.tenderExpiryDate,
      this.bgRecord.contractCurCode,
      this.bgRecord.contractAmt,
      this.bgRecord.contractPct];

    return this.commonService.isFieldsValuesExists(arr);
  }

  initFieldValues() {
    this.contractDetails.patchValue({
      contractReference: this.bgRecord.contractReference,
      contractNarrative: this.bgRecord.contractNarrative,
      contractDate: this.bgRecord.contractDate,
      tenderExpiryDate: this.bgRecord.tenderExpiryDate,
      contractCurCode: this.bgRecord.contractCurCode,
      contractAmt: this.commonService.transformAmt(this.bgRecord.contractAmt, this.bgRecord.contractCurCode),
      contractPct: this.commonService.getPercentWithoutLanguageFormatting(this.bgRecord.contractPct)
    });
  }

  initCopyFromFieldValues() {
    this.contractDetails.patchValue({
      contractReference: this.bgRecord.contractReference,
      contractNarrative: this.bgRecord.contractNarrative,
      contractPct: this.commonService.getPercentWithoutLanguageFormatting(this.bgRecord.contractPct)
    });
  }

  toDisplay(): boolean {
    return this.contractDetails.controls.contractReference.value === 'TEND';
  }

  selectCurrency() {
    const dialogRef = this.dialog.open(CurrencyDialogComponent, {
      header: 'List Of Currencies',
      width: '30vw',
      height: '60vh',
      contentStyle: {overflow: 'auto', height: '60vh'}
    });
    dialogRef.onClose.subscribe((isoCode: string) => {
      if (isoCode) {
        this.contractDetails.get('contractCurCode').setValue(isoCode);
        this.commonService.transformAmtAndSetValidators(this.contractDetails.get('contractAmt'),
                                                        this.contractDetails.get('contractCurCode'), 'contractCurCode');
        this.contractDetails.get('contractAmt').updateValueAndValidity();
      }
    });
}
validateCurrency() {
  let tempCurrencies;
  if (this.currencies === undefined || this.currencies === null || this.currencies.length === 0) {
    this.currencies = [];
    this.staticDataService.getCurrencies().subscribe(data => {
      tempCurrencies = data.currencies as string[];
      this.currencies = tempCurrencies;
      this.contractDetails.controls.contractCurCode.setValidators([validateCurrCode(this.currencies)]);
      this.contractDetails.get('contractCurCode').updateValueAndValidity();
    });
  } else {
    this.contractDetails.controls.contractCurCode.setValidators([validateCurrCode(this.currencies)]);
    this.contractDetails.get('contractCurCode').updateValueAndValidity();
  }
}

clearTenderExpDate() {
  if (this.contractDetails.controls.contractReference.value !== 'TEND') {
    this.contractDetails.get('tenderExpiryDate').setValue('');
  }
}
generatePdf(generatePdfService) {
  if (this.commonDataService.getPreviewOption() !== 'SUMMARY') {
    generatePdfService.setSectionDetails('HEADER_UNDERTAKING_CONTRACT_DETAILS', true, false, 'contractDetailsView');
   }

}


clearContractDate(event) {
  this.contractDetails.get('contractDate').setValue('');
}

clearTenderExpiryDate(event) {
  this.contractDetails.get('tenderExpiryDate').setValue('');
 }

 hasContractDateValue(): boolean {
  if (this.contractDetails.get(`contractDate`) &&
      this.contractDetails.get(`contractDate`).value !== null &&
      this.contractDetails.get(`contractDate`).value !== '') {
    return true;
  } else {
    return false;
  }
}

hasTenderExpDateValue(): boolean {
  if (this.contractDetails.get(`tenderExpiryDate`) &&
      this.contractDetails.get(`tenderExpiryDate`).value !== null &&
      this.contractDetails.get(`tenderExpiryDate`).value !== '') {
    return true;
  } else {
    return false;
  }
}

}
