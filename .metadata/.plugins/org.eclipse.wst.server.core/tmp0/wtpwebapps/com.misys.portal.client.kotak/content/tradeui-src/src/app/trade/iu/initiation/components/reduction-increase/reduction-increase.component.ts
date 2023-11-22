import { CommonReductionIncreaseComponent } from './../common-reduction-increase/common-reduction-increase.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonService } from './../../../../../common/services/common.service';
import { Constants } from '../../../../../common/constants';
import { CommonDataService } from './../../../../../common/services/common-data.service';
import { DialogService } from 'primeng';

@Component({
  selector: 'fcc-iu-initiate-reduction-increase',
  templateUrl: './reduction-increase.component.html',
  styleUrls: ['./reduction-increase.component.scss']
})
export class ReductionIncreaseComponent implements OnInit {

  @Input() public bgRecord;
  @Input() public isTnxAmtCurCodeEmpty;
  redIncForm: UntypedFormGroup;
  collapsible = true;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @ViewChild(CommonReductionIncreaseComponent)commonReductionIncreaseChildComponent: CommonReductionIncreaseComponent;

  constructor(public fb: UntypedFormBuilder, public dialog: DialogService,
              public validationService: ValidationService, public translate: TranslateService,
              public commonDataService: IUCommonDataService, public staticDataService: StaticDataService,
              public commonService: CommonService , public commonData: CommonDataService) { }

  ngOnInit() {
    this.redIncForm = this.fb.group({
      bgVariationType: [''],
      bgAdviseEventFlag: [''],
      bgAdviseDaysPriorNb: [{value: '', disabled: true}, Validators.pattern(Constants.REGEX_NUMBER)],
      bgMaximumNbVariation: ['', [Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]],
      bgVariationFrequency: [''],
      bgVariationPeriod: [''],
      bgVariationDayInMonth: ['', [Validators.maxLength(Constants.LENGTH_2), Validators.pattern(Constants.REGEX_NUMBER)]],
      bgVariationsLists: ['']
    });
    if ((this.commonDataService.getMode() === Constants.MODE_DRAFT || this.commonDataService.getMode() === Constants.MODE_AMEND
    ||  ((this.commonDataService.getOption() === Constants.OPTION_EXISTING && this.commonData.getIsBankUser())
    || this.commonDataService.getOption() === Constants.OPTION_REJECTED) ) &&
        this.bgRecord.bgVariation) {
      this.initFieldValues();
    }
    if (this.bgRecord.bgVariation) {
      this.collapsible = false;
    }
    this.formReady.emit(this.redIncForm);
  }

  initFieldValues() {
    this.redIncForm.patchValue({
      bgVariationType: this.bgRecord.bgVariation.variationLineItem[0].type,
      bgAdviseEventFlag: this.commonDataService.getCheckboxBooleanValues(this.bgRecord.bgVariation.variationLineItem[0].adviseFlag),
      bgAdviseDaysPriorNb: this.bgRecord.bgVariation.variationLineItem[0].adviseReductionDays,
      bgMaximumNbVariation: this.bgRecord.bgVariation.variationLineItem[0].maximumNbDays,
      bgVariationFrequency: this.bgRecord.bgVariation.variationLineItem[0].frequency,
      bgVariationPeriod: this.bgRecord.bgVariation.variationLineItem[0].period,
      bgVariationDayInMonth: this.bgRecord.bgVariation.variationLineItem[0].dayInMonth
    });
  }

  generatePdf(generatePdfService) {
    if (this.commonReductionIncreaseChildComponent) {
      this.commonReductionIncreaseChildComponent.generatePdf(generatePdfService);
    }
  }
}
