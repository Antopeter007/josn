import { CommonService } from './../../../../../common/services/common.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../../../common/constants';
import { validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonBankInstructionsComponent } from '../common-bank-instructions/common-bank-instructions.component';
import { CommonDataService } from '../../../../../common/services/common-data.service';



@Component({
  selector: 'fcc-iu-initiate-bank-instructions',
  templateUrl: './bank-instructions.component.html',
  styleUrls: ['./bank-instructions.component.scss']
})

export class BankInstructionsComponent implements OnInit {

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService, public iuCommonDataService: IUCommonDataService,
              public commonDataService: CommonDataService, public commonService: CommonService) {}

  @Input() public bgRecord;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  bankInstructionsForm: UntypedFormGroup;
  collapsible: boolean;

  @ViewChild(CommonBankInstructionsComponent) commonBankInstructionsComponent: CommonBankInstructionsComponent;

  ngOnInit() {
    if ((this.commonDataService.getDisplayMode() === 'view' && this.checkForDataIfPresent()) || this.commonDataService.getIsBankUser()
    || ((this.iuCommonDataService.getOption() === Constants.OPTION_TEMPLATE || this.iuCommonDataService.getMode() === Constants.MODE_DRAFT)
    && this.checkForDataIfPresent())) {
        this.collapsible = true;
      } else {
        this.collapsible = false;
      }

    this.bankInstructionsForm = this.fb.group({
      bgDelvOrgUndertaking: [''],
      bgDelvOrgUndertakingText: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_35),
      validateSwiftCharSet(Constants.X_CHAR)]],
      bgPrincipalActNo: ['', [Validators.maxLength(Constants.LENGTH_34), validateSwiftCharSet(Constants.X_CHAR)]],
      bgFeeActNo: ['', [Validators.maxLength(Constants.LENGTH_34), validateSwiftCharSet(Constants.X_CHAR)]],
      bgDeliveryTo: [''],
      bgDeliveryToOther: [{value: '', disabled: true}, [Validators.maxLength(Constants.LENGTH_210),
      validateSwiftCharSet(Constants.X_CHAR)]],
      bgFreeFormatText: ['', [Validators.maxLength(Constants.LENGTH_210), validateSwiftCharSet(Constants.X_CHAR)]]
    });

    if ((this.iuCommonDataService.getMode() === Constants.MODE_DRAFT) ||
     (this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING && this.commonDataService.getIsBankUser()) ||
          (this.iuCommonDataService.getTnxType() === '01' &&
          (this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING ||
          this.iuCommonDataService.getOption() === Constants.OPTION_REJECTED))) {
      this.initFieldValues();
    }
    // Emit the form group to the parent
    this.formReady.emit(this.bankInstructionsForm);
  }

  checkForDataIfPresent() {
    const arr = [this.bgRecord.bgDelvOrgUndertaking, this.bgRecord.bgDelvOrgUndertakingText, this.bgRecord.bgPrincipalActNo,
                  this.bgRecord.bgFeeActNo, this.bgRecord.bgDeliveryTo, this.bgRecord.bgDeliveryToOther,
                  this.bgRecord.bgFreeFormatText];

    return this.commonService.isFieldsValuesExists(arr);
  }

  initFieldValues() {
    this.bankInstructionsForm.patchValue({
      bgDelvOrgUndertaking: this.bgRecord.bgDelvOrgUndertaking,
      bgDelvOrgUndertakingText: this.bgRecord.bgDelvOrgUndertakingText,
      bgPrincipalActNo: this.bgRecord.bgPrincipalActNo,
      bgFeeActNo: this.bgRecord.bgFeeActNo,
      bgDeliveryTo: this.bgRecord.bgDeliveryTo,
      bgDeliveryToOther: this.bgRecord.bgDeliveryToOther,
      bgFreeFormatText: this.bgRecord.bgFreeFormatText,
    });
    if (this.iuCommonDataService.getTnxType() === '01' &&
    (this.iuCommonDataService.getOption() === Constants.OPTION_EXISTING ||
    this.iuCommonDataService.getOption() === Constants.OPTION_REJECTED)) {
      this.bankInstructionsForm.get('bgFreeFormatText').setValue('');
    }
  }

  generatePdf(generatePdfService) {
    if (this.commonBankInstructionsComponent) {
    this.commonBankInstructionsComponent.generatePdf(generatePdfService);
    }
  }
}

