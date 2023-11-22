import { CommonDataService } from '../../../../../common/services/common-data.service';
import { Constants } from '../../../../../common/constants';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonBankDetailsComponent } from '../common-bank-details/common-bank-details.component';

@Component({
  selector: 'fcc-iu-cu-bank-details',
  templateUrl: './cu-bank-details.component.html',
  styleUrls: ['./cu-bank-details.component.css']
})
export class CuBankDetailsComponent implements OnInit {

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  cuBankDetailsSection: UntypedFormGroup;
  @ViewChild(CommonBankDetailsComponent)commonBankDetailsComponent: CommonBankDetailsComponent;
  viewMode = false;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService,
              public commonDataService: IUCommonDataService, public commonData: CommonDataService) { }

  ngOnInit() {

    this.cuBankDetailsSection =  this.fb.group({
      cuRecipientBankAbbvName: [''],
      cuRecipientBankCustomerReference: [''],
      cuIssuingBankSwiftCode: [''],
      cuIssuingBankName: [''],
      cuIssuingBankAddressLine1: [''],
      cuIssuingBankAddressLine2: [''],
      cuIssuingBankDom: [''],
      cuIssuingBankAddressLine4: ['']
     });

    if ((this.commonDataService.getMode() === Constants.MODE_DRAFT) ||
        (this.commonDataService.getTnxType() === '01' &&
         (this.commonDataService.getOption() === Constants.OPTION_EXISTING
         || this.commonDataService.getOption() === Constants.OPTION_REJECTED))
        || (this.commonData.getIsBankUser() && (this.commonData.getOption() === Constants.SCRATCH
        || this.commonData.getMode() === Constants.MODE_DRAFT))) {
      this.initFieldValues();
     }
   // Emit the form group to the parent
    this.formReady.emit(this.cuBankDetailsSection);
    if (this.commonDataService.getDisplayMode() === 'view') {
      this.viewMode = true;
    } else {
      this.viewMode = false;
    }
  }

  initFieldValues() {
    this.cuBankDetailsSection.patchValue({
      cuRecipientBankAbbvName: this.bgRecord.cuRecipientBank.abbvName,
      cuRecipientBankCustomerReference: this.bgRecord.cuRecipientBank.reference,
      cuIssuingBankSwiftCode: this.bgRecord.cuRecipientBank.isoCode,
      cuIssuingBankName: this.bgRecord.cuRecipientBank.name,
      cuIssuingBankAddressLine1: this.bgRecord.cuRecipientBank.addressLine1,
      cuIssuingBankAddressLine2: this.bgRecord.cuRecipientBank.addressLine2,
      cuIssuingBankDom: this.bgRecord.cuRecipientBank.dom,
      cuIssuingBankAddressLine4: this.bgRecord.cuRecipientBank.addressLine4,
    });
  }
  generatePdf(generatePdfService) {
    if (this.commonBankDetailsComponent) {
      this.commonBankDetailsComponent.generatePdf(generatePdfService);
    }
  }
}
