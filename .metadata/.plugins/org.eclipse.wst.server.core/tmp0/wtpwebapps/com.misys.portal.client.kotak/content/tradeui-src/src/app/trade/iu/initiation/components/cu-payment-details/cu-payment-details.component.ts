import { CommonDataService } from './../../../../../common/services/common-data.service';
import { Constants } from './../../../../../common/constants';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { CommonService } from './../../../../../common/services/common.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonPaymentDetailsComponent } from '../common-payment-details/common-payment-details.component';
import { TranslateService } from '@ngx-translate/core';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { DialogService } from 'primeng';


@Component({
  selector: 'fcc-iu-cu-payment-details',
  templateUrl: './cu-payment-details.component.html',
  styleUrls: ['./cu-payment-details.component.scss']
})
export class CuPaymentDetailsComponent implements OnInit {

  @Input() public bgRecord;
  cuPaymentDetailsForm: UntypedFormGroup;
  collapsible = true;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @ViewChild(CommonPaymentDetailsComponent)commonPaymentDetailsComponent: CommonPaymentDetailsComponent;

  constructor(public fb: UntypedFormBuilder, public dialog: DialogService,
              public validationService: ValidationService, public translate: TranslateService,
              public commonDataService: IUCommonDataService, public commonService: CommonService,
              public commonData: CommonDataService) { }

  ngOnInit() {
    this.cuPaymentDetailsForm = this.fb.group({
      cuCreditAvailableWithBank: [],
      cuCrAvlByCode: ['06'],
      cuAnyBankName: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      cuAnyBankAddressLine1: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      cuAnyBankAddressLine2: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      cuAnyBankDom: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]],
      cuAnyBankAddressLine4: ['', [Validators.maxLength(Constants.LENGTH_35), validateSwiftCharSet(Constants.X_CHAR)]]
    });
    if (this.cuPaymentDetailsForm && this.cuPaymentDetailsForm.get('cuCreditAvailableWithBank') &&
        this.commonDataService.getCUSubProdCode() !== Constants.STAND_BY) {
      this.cuPaymentDetailsForm.get('cuCreditAvailableWithBank').setValue('');
    }

    if (this.commonDataService.getDisplayMode() === 'view' ||
        this.commonDataService.getOption() === Constants.OPTION_TEMPLATE ||
        this.commonDataService.getMode() === Constants.MODE_DRAFT ||
        (this.commonDataService.getTnxType() !== '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING) ||
        (this.commonDataService.getTnxType() !== '01' && this.commonDataService.getOption() === Constants.OPTION_REJECTED)) {
      if ((this.bgRecord.cuCreditAvailableWithBank && this.bgRecord.cuCreditAvailableWithBank.name &&
          this.bgRecord.cuCreditAvailableWithBank.name !== null && this.bgRecord.cuCreditAvailableWithBank.name !== '') ||
          (this.bgRecord.cuCrAvlByCode && this.bgRecord.cuCrAvlByCode !== null && this.bgRecord.cuCrAvlByCode !== '')) {
        this.collapsible = false;
      } else {
        this.collapsible = true;
      }
    }
    if (this.commonData.getIsBankUser()) {
      this.collapsible = false;
    }
    if ((this.commonDataService.getTnxType() !== '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING) ||
    (this.commonDataService.getTnxType() !== '01' && this.commonDataService.getOption() === Constants.OPTION_REJECTED) ||
    this.commonDataService.getOption() === Constants.OPTION_TEMPLATE ||
    this.commonDataService.getMode() === Constants.MODE_DRAFT) {
        this.initFieldValues();
    }
    this.formReady.emit(this.cuPaymentDetailsForm);
  }

  initFieldValues() {
      this.cuPaymentDetailsForm.patchValue({
        cuCreditAvailableWithBank: this.commonDataService.getCrAvailByBankDropDownCode(this.bgRecord.cuCreditAvailableWithBank.name),
        cuCrAvlByCode: this.bgRecord.cuCrAvlByCode
      });
  }
  generatePdf(generatePdfService) {
    this.commonPaymentDetailsComponent.generatePdf(generatePdfService);
  }
}
