import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { validateCurrCode, validateSwiftCharSet } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonService } from '../../../../../common/services/common.service';
import { Constants } from '../../../../../common/constants';
import { CommonReductionIncreaseComponent } from '../common-reduction-increase/common-reduction-increase.component';
import { DialogService } from 'primeng';

@Component({
  selector: 'fcc-iu-cu-reduction-increase',
  templateUrl: './cu-reduction-increase.component.html',
  styleUrls: ['./cu-reduction-increase.component.css']
})

export class CuReductionIncreaseComponent implements OnInit {

  @Input() public bgRecord;
  cuRedIncForm: UntypedFormGroup;
  collapsible = true;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @ViewChild(CommonReductionIncreaseComponent)commonReductionIncreaseChildComponent: CommonReductionIncreaseComponent;

  constructor(public fb: UntypedFormBuilder, public dialog: DialogService,
              public validationService: ValidationService, public translate: TranslateService,
              public commonDataService: IUCommonDataService, public staticDataService: StaticDataService,
              public commonService: CommonService) { }

  ngOnInit() {
    this.cuRedIncForm = this.fb.group({
      cuVariationType: [''],
      cuAdviseEventFlag: [''],
      cuAdviseDaysPriorNb: [{value: '', disabled: true }],
      cuMaximumNbVariation: ['', [Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]],
      cuVariationFrequency: ['', [Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]],
      cuVariationPeriod: [''],
      cuVariationDayInMonth: ['', [Validators.maxLength(Constants.LENGTH_2), Validators.pattern(Constants.REGEX_NUMBER)]],
      cuVariationsLists: ['']
    });
    if (this.commonDataService.getMode() === Constants.MODE_DRAFT &&
        this.bgRecord.cuVariation) {
      this.initFieldValues();
    }
    if (this.bgRecord.cuVariation) {
      this.collapsible = false;
    }
    if ((this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_EXISTING) ||
    (this.commonDataService.getTnxType() === '01' && this.commonDataService.getOption() === Constants.OPTION_REJECTED)) {
      this.collapsible = true;
    }
    this.formReady.emit(this.cuRedIncForm);
  }

  initFieldValues() {
    this.cuRedIncForm.patchValue({
      cuVariationType: this.bgRecord.cuVariation.variationLineItem[0].type,
      cuAdviseEventFlag: this.commonDataService.getCheckboxBooleanValues(this.bgRecord.cuVariation.variationLineItem[0].adviseFlag),
      cuAdviseDaysPriorNb: this.bgRecord.cuVariation.variationLineItem[0].adviseReductionDays,
      cuMaximumNbVariation: this.bgRecord.cuVariation.variationLineItem[0].maximumNbDays,
      cuVariationFrequency: this.bgRecord.cuVariation.variationLineItem[0].frequency,
      cuVariationPeriod: this.bgRecord.cuVariation.variationLineItem[0].period,
      cuVariationDayInMonth: this.bgRecord.cuVariation.variationLineItem[0].dayInMonth
    });
  }

  generatePdf(generatePdfService) {
    if (this.commonReductionIncreaseChildComponent) {
      this.commonReductionIncreaseChildComponent.generatePdf(generatePdfService);
    }
  }
}
