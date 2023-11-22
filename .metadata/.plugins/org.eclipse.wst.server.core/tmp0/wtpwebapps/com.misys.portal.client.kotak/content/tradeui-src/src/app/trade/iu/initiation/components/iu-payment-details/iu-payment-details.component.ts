import { Constants } from './../../../../../common/constants';
import { CommonService } from './../../../../../common/services/common.service';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonPaymentDetailsComponent } from '../common-payment-details/common-payment-details.component';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { DialogService } from 'primeng';

@Component({
  selector: 'fcc-iu-payment-details',
  templateUrl: './iu-payment-details.component.html',
  styleUrls: ['./iu-payment-details.component.scss']
})
export class IuPaymentDetailsComponent implements OnInit {

  @Input() public bgRecord;
  paymentDetailsForm: UntypedFormGroup;
  collapsible = false;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @ViewChild(CommonPaymentDetailsComponent)commonPaymentDetailsComponent: CommonPaymentDetailsComponent;

  constructor(public fb: UntypedFormBuilder, public dialog: DialogService,
              public validationService: ValidationService, public translate: TranslateService,
              public commonDataService: IUCommonDataService, public commonService: CommonService) { }

  ngOnInit() {
    this.paymentDetailsForm = this.fb.group({
      bgCreditAvailableWithBank: [],
      bgCrAvlByCode: ['06'],
      bgAnyBankName: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      bgAnyBankAddressLine1: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      bgAnyBankAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      bgAnyBankDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      bgAnyBankAddressLine4: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]]
    });

    if (this.commonDataService.getDisplayMode() === 'view') {
      if ((this.bgRecord.bgCreditAvailableWithBank && this.bgRecord.bgCreditAvailableWithBank.name &&
          this.bgRecord.bgCreditAvailableWithBank.name !== null && this.bgRecord.bgCreditAvailableWithBank.name !== '') ||
          (this.bgRecord.bgCrAvlByCode && this.bgRecord.bgCrAvlByCode !== null && this.bgRecord.bgCrAvlByCode !== '')) {
        this.collapsible = false;
      } else {
        this.collapsible = true;
      }
    }

    if (this.commonDataService.getOption() === Constants.OPTION_EXISTING ||
        this.commonDataService.getOption() === Constants.OPTION_TEMPLATE ||
        this.commonDataService.getMode() === Constants.MODE_DRAFT ||
        this.commonDataService.getMode() === Constants.MODE_AMEND ||
        this.commonDataService.getMode() === Constants.OPTION_REJECTED) {
      // this.initFieldValues();
  }
    this.formReady.emit(this.paymentDetailsForm);
  }

  initFieldValues() {
    if (this.bgRecord.subProductCode === Constants.STAND_BY) {
      this.paymentDetailsForm.patchValue({
        bgCreditAvailableWithBank: this.commonDataService.getCrAvailByBankDropDownCode(this.bgRecord.bgCreditAvailableWithBank.name),
        bgCrAvlByCode: this.bgRecord.bgCrAvlByCode
      });
    }
  }
  generatePdf(generatePdfService) {
    this.commonPaymentDetailsComponent.generatePdf(generatePdfService);
  }
}
