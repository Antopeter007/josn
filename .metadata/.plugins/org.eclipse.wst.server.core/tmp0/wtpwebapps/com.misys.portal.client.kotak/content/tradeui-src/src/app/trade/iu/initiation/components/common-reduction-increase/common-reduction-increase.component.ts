import { CommonDataService } from './../../../../../common/services/common-data.service';
import { ReductionService } from './../../../../../common/services/reduction.service';
import { IrregularReductionIncreaseDialogComponent } from './../../../../../common/components/irregular-reduction-increase-dialog/irregular-reduction-increase-dialog.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { StaticDataService } from '../../../../../common/services/staticData.service';
import { validateCurrCode, validateSwiftCharSet, validateVariationDaysInMonth, validateVariationDaysNumber } from '../../../../../common/validators/common-validator';
import { ValidationService } from '../../../../../common/validators/validation.service';
import { IUCommonDataService } from '../../../common/service/iuCommonData.service';
import { CommonService } from './../../../../../common/services/common.service';
import { Constants } from '../../../../../common/constants';
import { IrregularDetails } from '../../../../../common/model/IrregularDetails.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { VariationsData } from '../../../../../common/model/variationsData.model';
import { DialogService } from 'primeng';

@Component({
  selector: 'fcc-iu-common-reduction-increase',
  templateUrl: './common-reduction-increase.component.html',
  styleUrls: ['./common-reduction-increase.component.scss']
})
export class CommonReductionIncreaseComponent implements OnInit {

  @Input() undertakingType: string;
  @Input() public isTnxAmtCurCodeNull;
  @Input() public bgRecord;
  @Input() public sectionForm: UntypedFormGroup;
  viewMode = false;
  public reductionIncreaseOptions: any[];
  imagePath: string;
  public operationTypeObj: any[];
  public periodObj: any[];
  yearRange: string;
  bgCurCode: string;
  public currencies;
  public showIrregularDialog = false;
  currencyCode: string;
  public currCode: string;
  maxDate: string;
  controlsAvailable = false;
  irregularErrorItem: VariationsData;
  isIrregularItemHasAmtError = false;
  isIrregularItemHasDateError = false;
  setIncreaseOperation = false;
  irregularListErrorCount: number;
  dateFormat: string;
  isExistingDraftMenu;
  @ViewChild(IrregularReductionIncreaseDialogComponent) irregularRedIncComp: IrregularReductionIncreaseDialogComponent;

  constructor(public fb: UntypedFormBuilder, public dialog: DialogService,
              public validationService: ValidationService, public translate: TranslateService,
              public iuCommonDataService: IUCommonDataService, public staticDataService: StaticDataService,
              public commonService: CommonService, public dialogService: DialogService, public reductionService: ReductionService,
              public confirmationService: ConfirmationService, public datePipe: DatePipe, public commonDataService: CommonDataService,
              public decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.dateFormat = this.commonService.getDateFormat();
    this.imagePath = this.commonService.getImagePath();
    this.yearRange = this.commonService.getYearRange();
    this.bgCurCode = this.iuCommonDataService.getCurCode(this.undertakingType);

    this.isExistingDraftMenu = (this.bgRecord.tnxTypeCode === Constants.TYPE_REPORTING
      && this.commonDataService.getMode() === Constants.MODE_DRAFT);

    if (this.iuCommonDataService.getDisplayMode() === 'view' || this.commonDataService.getDisplayMode() === 'view'
    || this.iuCommonDataService.getDisplayMode() === Constants.UNSIGNED_AMEND) {
      this.viewMode = true;
    }

    if ((this.commonService.tnxType === Constants.TYPE_AMEND
      && (this.iuCommonDataService.getMode() === Constants.MODE_AMEND
      || this.iuCommonDataService.getMode() === Constants.MODE_DRAFT))
       || (this.commonDataService.getOperation() === Constants.OPERATION_CREATE_REPORTING &&
       (this.commonDataService.getOption() === Constants.SCRATCH || this.commonDataService.getMode() === Constants.MODE_DRAFT))) {
      this.currCode = this.bgCurCode;
    }

    this.operationTypeObj = [
      { label: this.commonService.getTranslation('INCREASE'), value: '01' },
      { label: this.commonService.getTranslation('DECREASE'), value: '02' }
    ];

    this.reductionIncreaseOptions = [
     { label: this.commonService.getTranslation('EXTENSION_TYPE_REGULAR'), value: '01' },
     { label: this.commonService.getTranslation('EXTENSION_TYPE_IRREGULAR'), value: '02' }
   ];

    this.periodObj = [
      {label: this.commonService.getTranslation('EXTENSION_EXTEND_FOR_DAYS'), value : 'D'},
      {label: this.commonService.getTranslation('EXTENSION_EXTEND_FOR_WEEKS'), value : 'W'},
      {label: this.commonService.getTranslation('EXTENSION_EXTEND_FOR_MONTHS'), value : 'M'},
      {label: this.commonService.getTranslation('EXTENSION_EXTEND_FOR_YEARS'), value : 'Y'}
   ];

    if ((this.iuCommonDataService.getMode() === Constants.MODE_DRAFT || this.viewMode ||
            this.iuCommonDataService.getMode() === Constants.MODE_AMEND ||
            this.commonDataService.getOption() === Constants.OPTION_EXISTING || this.isExistingDraftMenu ) &&
        (this.bgRecord[`${this.undertakingType}Variation`] && this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0])) {
          this.iuCommonDataService.setVariationType(this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].type,
           this.undertakingType);
          if (this.iuCommonDataService.getMode() !== Constants.MODE_UNSIGNED) {
          this.resetCommonControls();
          this.addDynamicControls();
          if (this.bgRecord[`${this.undertakingType}Variation`] &&
          this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].type === '01') {
            this.populateRegularFields();
          }
        }
          if (this.bgRecord[`${this.undertakingType}Variation`] &&
            this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].type === '02')  {
              this.populateIrregularFields();
          }
          if (this.iuCommonDataService.getCheckboxBooleanValues(
              this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].adviseFlag)) {
        this.sectionForm.controls[`${this.undertakingType}AdviseDaysPriorNb`].setValue(
          this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].adviseReductionDays);
        this.sectionForm.controls[`${this.undertakingType}AdviseEventFlag`].setValue(true);
        this.sectionForm.controls[`${this.undertakingType}AdviseDaysPriorNb`].setValidators(
                        [Validators.required, Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
        this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).markAsUntouched({ onlySelf: true });
        this.sectionForm.controls[`${this.undertakingType}AdviseDaysPriorNb`].updateValueAndValidity();
        if (!(this.commonDataService.disableTnx)) {
          this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).enable();
        }
      } else {
        this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).setValue('');
        this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).disable();
      }
    }
    if (this.bgRecord[`${this.undertakingType}VariationType`]) {
      this.iuCommonDataService.setVariationType(this.bgRecord[`${this.undertakingType}VariationType`], this.undertakingType);
    }
    if ((Constants.OPTION_EXISTING === this.commonDataService.getOption() || this.isExistingDraftMenu)
    && (this.commonDataService.disableTnx) && this.sectionForm.get(`${this.undertakingType}VariationPct`)) {
      this.sectionForm.get(`${this.undertakingType}VariationPct`).disable();
    }
}

  toggleOnDaysNotice() {
    if (this.sectionForm.get(`${this.undertakingType}AdviseEventFlag`).value) {
      this.sectionForm.controls[`${this.undertakingType}AdviseDaysPriorNb`].setValidators(
                       [Validators.required, Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).markAsUntouched({ onlySelf: true });
      this.sectionForm.controls[`${this.undertakingType}AdviseDaysPriorNb`].updateValueAndValidity();
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).enable();
    } else {
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).setValue('');
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).disable();
    }
  }

  clearFields() {
    if (this.sectionForm.get(`${this.undertakingType}VariationType`).value === '01') {
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).disable();
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).setValue('');
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).setErrors(null);
      this.sectionForm.get(`${this.undertakingType}AdviseEventFlag`).setValue('');
      this.sectionForm.get(`${this.undertakingType}AdviseEventFlag`).setErrors(null);
      this.sectionForm.get(`${this.undertakingType}VariationFrequency`).setValue('');
      this.sectionForm.get(`${this.undertakingType}VariationFrequency`).markAsUntouched({ onlySelf: true });
      this.sectionForm.get(`${this.undertakingType}VariationFrequency`).setErrors(null);
      this.sectionForm.get(`${this.undertakingType}VariationPeriod`).setValue('');
      this.sectionForm.get(`${this.undertakingType}VariationPeriod`).markAsUntouched({ onlySelf: true });
      this.sectionForm.get(`${this.undertakingType}VariationPeriod`).setErrors(null);
      this.sectionForm.get(`${this.undertakingType}VariationDayInMonth`).setValue('');
      this.sectionForm.get(`${this.undertakingType}VariationDayInMonth`).setErrors(null);
      this.sectionForm.get(`${this.undertakingType}MaximumNbVariation`).setValue('');
      this.sectionForm.get(`${this.undertakingType}MaximumNbVariation`).markAsUntouched({ onlySelf: true });
      this.sectionForm.get(`${this.undertakingType}MaximumNbVariation`).setErrors(null);

      if (this.sectionForm.get(`${this.undertakingType}OperationType`)) {
      this.sectionForm.get(`${this.undertakingType}OperationType`).setValue('02');
      this.sectionForm.get(`${this.undertakingType}OperationType`).setErrors(null);

      }
      if (this.sectionForm.get(`${this.undertakingType}VariationFirstDate`)) {
      this.sectionForm.get(`${this.undertakingType}VariationFirstDate`).setValue('');
      this.sectionForm.get(`${this.undertakingType}VariationFirstDate`).markAsUntouched({ onlySelf: true });
      this.sectionForm.get(`${this.undertakingType}VariationFirstDate`).setErrors(null);
      }
      if (this.sectionForm.get(`${this.undertakingType}VariationPct`)) {
      this.sectionForm.get(`${this.undertakingType}VariationPct`).setValue('');
      this.sectionForm.get(`${this.undertakingType}VariationPct`).markAsUntouched({ onlySelf: true });
      this.sectionForm.get(`${this.undertakingType}VariationPct`).setErrors(null);
      }
      if (this.sectionForm.get(`${this.undertakingType}VariationCurCode`)) {
        this.sectionForm.get(`${this.undertakingType}VariationCurCode`).setValue(this.iuCommonDataService.getCurCode(this.undertakingType));
        this.sectionForm.get(`${this.undertakingType}VariationCurCode`).markAsUntouched({ onlySelf: true });
        this.sectionForm.get(`${this.undertakingType}VariationCurCode`).setErrors(null);
      }

      if (this.sectionForm.get(`${this.undertakingType}VariationAmt`)) {
        this.sectionForm.get(`${this.undertakingType}VariationAmt`).enable();
        this.sectionForm.get(`${this.undertakingType}VariationAmt`).setValue('');
        this.sectionForm.get(`${this.undertakingType}VariationAmt`).markAsUntouched({ onlySelf: true });
        this.sectionForm.get(`${this.undertakingType}VariationAmt`).setErrors(null);
      }
      this.setIncreaseOperation = false;
    } else {
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).disable();
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).setValue('');
      this.sectionForm.get(`${this.undertakingType}AdviseEventFlag`).setValue('');
      const irregularListLength = this.irregularList.length;
      for (let i = 0; i <= irregularListLength; ++i) {
          this.irregularList.splice(0, 1);
      }
    }
    this.sectionForm.updateValueAndValidity();
  }
  resetCommonControls() {
  this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).reset();
  this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).disable();
  this.sectionForm.get(`${this.undertakingType}AdviseEventFlag`).reset();
  this.sectionForm.get(`${this.undertakingType}VariationFrequency`).reset();
  this.sectionForm.get(`${this.undertakingType}VariationFrequency`).clearValidators();
  this.sectionForm.get(`${this.undertakingType}VariationPeriod`).reset();
  this.sectionForm.get(`${this.undertakingType}VariationPeriod`).clearValidators();
  this.sectionForm.get(`${this.undertakingType}MaximumNbVariation`).reset();
  this.sectionForm.get(`${this.undertakingType}MaximumNbVariation`).clearValidators();
  this.sectionForm.get(`${this.undertakingType}VariationDayInMonth`).reset();
  this.sectionForm.get(`${this.undertakingType}VariationsLists`).setValue('');
  const irregularListLength = this.irregularList.length;
  for (let i = 0; i <= irregularListLength; ++i) {
      this.irregularList.splice(0, 1);
  }
  this.sectionForm.updateValueAndValidity();
  }
  removeRegularControls() {
    if (this.controlsAvailable) {
      this.sectionForm.removeControl(`${this.undertakingType}VariationFirstDate`);
      this.sectionForm.removeControl(`${this.undertakingType}VariationPct`);
      this.sectionForm.removeControl(`${this.undertakingType}VariationAmt`);
      this.sectionForm.removeControl(`${this.undertakingType}OperationType`);
      this.sectionForm.removeControl(`${this.undertakingType}VariationCurCode`);
    }
  }
  addDynamicControls() {
    if ((this.bgRecord[`${this.undertakingType}Variation`] &&
        this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].type === '01') ||
        (this.sectionForm.get(`${this.undertakingType}VariationType`).value === '01')) {
      this.sectionForm.addControl(`${this.undertakingType}OperationType`, new UntypedFormControl('02'));
      this.sectionForm.addControl(`${this.undertakingType}VariationFirstDate`, new UntypedFormControl('', [Validators.required]));
      this.sectionForm.addControl(`${this.undertakingType}VariationPct`, new UntypedFormControl('', [Validators.required,
                                        Validators.maxLength(Constants.LENGTH_12), Validators.pattern(Constants.REGEX_PERCENTAGE)]));
      this.sectionForm.addControl(`${this.undertakingType}VariationCurCode`, new UntypedFormControl(
        {value: this.iuCommonDataService.getCurCode(this.undertakingType), disabled: true},
                                        [Validators.required, Validators.maxLength(Constants.LENGTH_3),
                                        validateSwiftCharSet(Constants.X_CHAR)]));
      this.currCode =   this.iuCommonDataService.getCurCode(this.undertakingType);
      this.sectionForm.addControl(`${this.undertakingType}VariationAmt`,
                                        new UntypedFormControl('', [Validators.required, Validators.pattern(Constants.REGEX_CURR_COMMA)]));
      this.sectionForm.get(`${this.undertakingType}VariationFrequency`).setValidators([Validators.required,
                                        Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
      this.sectionForm.get(`${this.undertakingType}VariationPeriod`).setValidators(Validators.required);
      this.sectionForm.get(`${this.undertakingType}VariationDayInMonth`).setValidators([Validators.maxLength(Constants.LENGTH_2),
                        Validators.pattern(Constants.REGEX_NUMBER)]);
      this.sectionForm.get(`${this.undertakingType}MaximumNbVariation`).setValidators([Validators.required,
        Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER)]);
      this.controlsAvailable = true;
    } else {
      this.removeRegularControls();
      this.setIncreaseOperation = false;
    }
    this.sectionForm.updateValueAndValidity();
  }

  populateRegularFields() {
    this.sectionForm.get(`${this.undertakingType}VariationType`).setValue('01');
    this.sectionForm.get(`${this.undertakingType}VariationFirstDate`).setValue(
      this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].variationFirstDate);
    this.sectionForm.get(`${this.undertakingType}AdviseEventFlag`).setValue(
      this.iuCommonDataService.getCheckboxBooleanValues(
      this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].adviseFlag));
    this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).setValue(
      this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].adviseReductionDays);
    if (this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].adviseFlag === 'Y') {
    if ((Constants.OPTION_EXISTING === this.commonDataService.getOption() || this.isExistingDraftMenu)
      && !(this.commonDataService.disableTnx)) {
        this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).enable();
    } else if ((Constants.OPTION_EXISTING === this.commonDataService.getOption() || this.isExistingDraftMenu)
    && (this.commonDataService.disableTnx)) {
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).disable();
    } else {
        this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).enable();
    }
    }
    this.sectionForm.get(`${this.undertakingType}VariationFrequency`).setValue(
      this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].frequency);
    this.sectionForm.get(`${this.undertakingType}VariationPeriod`).setValue(
      this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].period);
    this.sectionForm.get(`${this.undertakingType}MaximumNbVariation`).setValue(
      this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].maximumNbDays);
    this.sectionForm.get(`${this.undertakingType}VariationDayInMonth`).setValue(
      this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].dayInMonth);
    this.sectionForm.get(`${this.undertakingType}VariationPct`).setValue(
      this.commonService.getPercentWithoutLanguageFormatting(
        this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].variationPct));
    this.sectionForm.get(`${this.undertakingType}OperationType`).setValue(
      this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].operationType);
    this.currCode = this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].variationCurCode;
    this.sectionForm.get(`${this.undertakingType}VariationCurCode`).setValue(this.currCode);
    this.sectionForm.get(`${this.undertakingType}VariationAmt`).setValue(this.commonService.transformAmt(
      this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].variationAmt, this.currCode));
    if (this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].variationPct !== null &&
        this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].variationPct !== '') {
      this.sectionForm.get(`${this.undertakingType}VariationAmt`).disable();
    } else if (this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].variationAmt !== null &&
    this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].variationAmt !== '' &&
    (this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].variationPct === null ||
    this.bgRecord[`${this.undertakingType}Variation`].variationLineItem[0].variationPct === '') ) {
      this.sectionForm.get(`${this.undertakingType}VariationPct`).disable();
    }

    this.commonService.setFirstDateValidator(`${this.undertakingType}VariationFirstDate`,
      this.sectionForm, this.undertakingType, null);
    this.commonService.validateDatewithExpiryDate(this.sectionForm, this.undertakingType);
    this.commonService.validateVariationPercentage(this.sectionForm, this.undertakingType , null);
    this.commonService.validateVariationAmt(this.sectionForm, this.undertakingType , null);
  }

populateIrregularFields() {
    this.sectionForm.get(`${this.undertakingType}VariationType`).setValue('02');
    let irregularReductionMap;
    for (const reductionRec of this.bgRecord[`${this.undertakingType}Variation`].variationLineItem) {
      const event = 'add';
      const operationType = reductionRec.operationType;
      const date = reductionRec.variationFirstDate;
      const percentage = reductionRec.variationPct;
      const amt = reductionRec.variationAmt;
      const curCode = reductionRec.variationCurCode;
      this.currCode = curCode;
      const reductionType = reductionRec.type;
      const adviseEventFlag = this.iuCommonDataService.getCheckboxBooleanValues(reductionRec.adviseFlag);
      const adviseDaysperNb = reductionRec.adviseReductionDays;
      const sequence =  reductionRec.variationSequence;
      irregularReductionMap = this.reductionService.pushIrregularDetails(event, this.undertakingType, operationType,
                        date, percentage, amt, curCode, reductionType, adviseEventFlag, adviseDaysperNb, sequence);
      if (this.sectionForm &&  this.sectionForm.get(`${this.undertakingType}VariationsLists`)) {
        this.sectionForm.get(`${this.undertakingType}VariationsLists`).setValue(irregularReductionMap);
      }
    }
    const irregularErrorMap = this.reductionService.validateIrregularItems(irregularReductionMap, this.undertakingType);
    const sortedErrList = this.commonService.sortIrregularList(irregularErrorMap);
    this.setErrorForIrregularItem(sortedErrList);
  }
addReductionDetails(eventType: string, date: string, operatonType: string, perc: string, curCode: string, amt: string, sequence: string) {
    let dialogHeader = '';
    let reductionDate = '';
    let operation = '';
    let percentage = '';
    let amount = '';
    let variationSequence = '';
    let currencyCode = '';
    const defaultCurrCode = this.currCode;
    const type = this.undertakingType;
    let setIncreaseOperation = this.setIncreaseOperation;
    const reductionType = this.sectionForm.get(`${this.undertakingType}VariationType`).value;
    const adviseEventFlag = this.sectionForm.get(`${this.undertakingType}AdviseEventFlag`).value;
    const adviseDaysperNb = this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).value;
    const form = this.sectionForm;

    if (date !== '') {
      reductionDate = date;
    }
    if (operatonType !== '') {
      operation = operatonType;
    }
    if (perc !== '') {
      percentage = perc;
    }
    if (curCode !== '') {
      currencyCode = curCode;
    }
    if (amt !== '') {
      amount = amt;
    }
    if (sequence !== '') {
      variationSequence = sequence;
    }
    if (eventType === 'add') {
    this.translate.get('IRREGULAR_INCREASE_DECREASE_DETAILS').subscribe((res: string) => {
      dialogHeader = res;
    });
    } else {
    setIncreaseOperation = false;
    this.translate.get('EDIT_IRREGULAR_INCREASE_DECREASE_DETAILS').subscribe((res: string) => {
      dialogHeader = res;
    });
  }
    const dialogRef = this.dialogService.open(IrregularReductionIncreaseDialogComponent, {
      header: dialogHeader,
      width: '55vw',
      height: '55vh',
      contentStyle: {overflow: 'auto', height: '55vh'},
      data: {eventType, reductionDate, operation, percentage, amount, currencyCode, type, reductionType, adviseEventFlag,
                       adviseDaysperNb, form, defaultCurrCode, sequence, setIncreaseOperation}
    });

    dialogRef.onClose.subscribe((result: any) => {
      let sortedIrregularErrList;
      if (result !== null && result !== undefined && result.event === 'IrregularMap') {
       this.sectionForm.get(`${this.undertakingType}VariationsLists`).setValue(result.data);
       this.setErrorForIrregularItem([]);
      } else if (result !== null && result !== undefined && result.event === 'errorItem') {
        sortedIrregularErrList = this.commonService.sortIrregularList(result.data);
        this.setErrorForIrregularItem(sortedIrregularErrList);
      } else if (result !== null && result !== undefined && result.event === 'DuplicateEntry') {
        let message = '';
        let header = '';
        this.translate.get('WARNING_TITLE').subscribe((value: string) => {
          header =  value;
        });
        this.translate.get('IRREGULAR_DUPLICATE_ENTRY_ERROR').subscribe((value: string) => {
          message =  value;
        });

        this.confirmationService.confirm({
          message,
          header,
          icon: 'pi pi-exclamation-triangle',
          key: 'fieldErrorDialog',
          rejectVisible: false,
          acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
          accept: () => {}
          });
      }
    });
  }

addToForm(name: string, form: UntypedFormGroup) {
    this.sectionForm.setControl(name, form);
   }

  get irregularList() {
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_IU || this.undertakingType === Constants.UNDERTAKING_TYPE_BR) {
      return this.reductionService.getBgIrregularlist();
    } else {
      return this.reductionService.getCuIrregularlist();
    }
  }

deleteRow(sequenceId: string): void {
    let message = '';
    let dialogHeader = '';
    let map: IrregularDetails[] = [];
    let irregularErrorMap: IrregularDetails[] = [];
    let sortedErrList;

    if (this.undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      map = this.reductionService.bgIrregularReductionMap;
    } else {
      map = this.reductionService.cuIrregularReductionMap;
    }

    this.translate.get('DELETE_CONFIRMATION_MSG').subscribe((value: string) => {
            message =  value;
            });

    this.translate.get('DAILOG_CONFIRMATION').subscribe((res: string) => {
        dialogHeader =  res;
      });

    this.confirmationService.confirm({
          message,
          header: dialogHeader,
          icon: 'pi pi-exclamation-triangle',
          key: `${this.undertakingType}ReductionConfirmDialog`,
          acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
          rejectLabel: this.commonService.getTranslation('Cancel'),
          accept: () => {
            for (let i = 0; i < map.length; ++i) {
              if (map[i].variationSequence === sequenceId) {
                  map.splice(i, 1);
              }
            }
            this.reductionService.updateMapSequence(map);
            irregularErrorMap = this.reductionService.validateIrregularItems(map, this.undertakingType);
            sortedErrList = this.commonService.sortIrregularList(irregularErrorMap);
            this.setErrorForIrregularItem(sortedErrList);
          },
          reject: () => {
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
        value.setValidators([validateCurrCode(this.currencies)]);
        value.updateValueAndValidity();
      });
    } else {
      value.setValidators([validateCurrCode(this.currencies)]);
      value.updateValueAndValidity();
    }
  }

validateForNullTnxAmtCurrencyField() {
    this.commonService.validateForNullTnxAmtCurrencyField(null, this.sectionForm, this.undertakingType, null);
  }

validateDaysInMonth(daysControl: AbstractControl) {
  if (!isNaN(Number(daysControl.value)) && parseInt(daysControl.value, 10) > Constants.LENGTH_31) {
    daysControl.setValidators([validateVariationDaysInMonth(daysControl.value)]);
    daysControl.updateValueAndValidity();
  } else {
    daysControl.setValidators([Validators.maxLength(Constants.LENGTH_2), Validators.pattern(Constants.REGEX_NUMBER)]);
    daysControl.updateValueAndValidity();
  }
}


generatePdf(generatePdfService) {
    let content;
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_IU || this.undertakingType === Constants.UNDERTAKING_TYPE_BR &&
        this.iuCommonDataService.getPreviewOption() !== 'SUMMARY' ) {
      generatePdfService.setSectionHeader('KEY_HEADER_UNDERTAKING_INCREASE_DECREASE', true);
      generatePdfService.setSectionDetails('', false, false, 'variationCommonFields');
      generatePdfService.setSectionDetails('', false, false, 'regularDetails');
    } else if (this.undertakingType === 'cu' && this.iuCommonDataService.getPreviewOption() !== 'SUMMARY') {
      generatePdfService.setSectionHeader('KEY_HEADER_LOCAL_UNDERTAKING_INCREASE_DECREASE', true);
      generatePdfService.setSectionDetails('', false, false, 'cuVariationCommonFields');
      generatePdfService.setSectionDetails('', false, false, 'cuRegularDetails');
    }

    // Irregular table
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      content = this.bgRecord.bgVariation;
    } else if (this.undertakingType === Constants.UNDERTAKING_TYPE_BR) {
      content = this.bgRecord.brVariation;
    } else {
      content = this.bgRecord.cuVariation;
    }
    if (content && content !== '' && content.variationLineItem !== '' && content.variationLineItem[0].type === '02') {

      for (const variation of content.variationLineItem) {
        if (variation.variationFirstDate !== '' && variation.operationType !== '' && variation.variationPct !== ''
                        && variation.variationCurCode !== '' && variation.variationAmt !== '') {
          const data: any[] = [];
          const column: string[] = [];
          const headers: string[] = [];
          headers.push(this.commonService.getTranslation('CHARGE_DATE'));
          headers.push(this.commonService.getTranslation('HEADER_OPERATION'));
          headers.push(this.commonService.getTranslation('INCREASE_DECREASE_PERCENTAGE_HEADER'));
          headers.push(this.commonService.getTranslation('AMOUNT'));
          column.push(variation.variationFirstDate);
          column.push(this.commonService.getTranslation(this.iuCommonDataService.getReductionOperationType(variation.operationType)));
          column.push(`${variation.variationPct}%`);
          column.push(`${variation.variationCurCode} ${variation.variationAmt}`);
          data.push(column);
          generatePdfService.createTable(headers, data);
        }
      }
    }
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_IU || this.undertakingType === Constants.UNDERTAKING_TYPE_BR &&
      this.iuCommonDataService.getPreviewOption() !== 'SUMMARY' ) {
        generatePdfService.setSectionDetails('', false, false, 'VariationDaysCommonFields');
    } else if (this.undertakingType === 'cu' && this.iuCommonDataService.getPreviewOption() !== 'SUMMARY') {
      generatePdfService.setSectionDetails('', false, false, 'cuVariationDaysCommonFields');
    }
  }

setErrorForIrregularItem(sortedIrregularErrList: IrregularDetails[]) {
    let isFirstItem = true;
    if (sortedIrregularErrList.length > 0) {
      for (const item of sortedIrregularErrList) {
        if (isFirstItem) {
          isFirstItem = false;
          this.irregularErrorItem = item;
        }
      }
      this.setIncreaseOperation = true;
    } else {
      this.irregularErrorItem = null;
      this.setIncreaseOperation = false;
    }
  }

showErrorOnIrregularItem(): string | null {
    let errorMsg = '';
    if (this.isIrregularItemHasAmtError ) {
    this.translate.get('IRREGULAR_ITEM_ERROR').subscribe((res: string) => {
        errorMsg = res;
      });
    this.sectionForm.get(`${this.undertakingType}VariationsLists`).setErrors({incorrect: true});
    return errorMsg;
    }
    const type = (this.undertakingType === Constants.UNDERTAKING_TYPE_IU ?
      this.commonService.expiryDateType : this.commonService.cuExpiryDateType);
    if (this.isIrregularItemHasDateError) {
      this.translate.get('VARIATION_MAX_DATE_GREATER_ERROR', {type}).subscribe((res: string) => {
          errorMsg = res;
        });
      this.sectionForm.get(`${this.undertakingType}VariationsLists`).setErrors({incorrect: true});
      return errorMsg;
      }
  }

validateVariationDaysNotice() {
    if (this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`) !== null) {
      let dateAfterAdd;
      let firstDate;
      //let currentobj;
      //let days;
      let VarDate;
      const expiryDateString =  Constants.FIRST_DATE;
      const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
      const currentobj = this.commonService.getDateObject(currentDate);
      const daysNumber = this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).value;
      const days = parseInt(daysNumber, 0);
      dateAfterAdd = this.datePipe.transform(currentobj.setDate(currentobj.getDate() + days),
          Constants.DATE_FORMAT);
      dateAfterAdd = Date.parse(dateAfterAdd);
      if (this.sectionForm.get(`${this.undertakingType}VariationType`).value === '02') {
        VarDate = this.irregularList[0].variationFirstDate;
      }
      if (this.sectionForm.get(`${this.undertakingType}VariationType`).value === '01') {
        VarDate = this.sectionForm.get(`${this.undertakingType}VariationFirstDate`).value;
      }
      firstDate = this.commonService.getDateObject(VarDate);
      firstDate = Date.parse(this.datePipe.transform(firstDate , Constants.DATE_FORMAT));
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).setValidators([Validators.required,
        Validators.maxLength(Constants.LENGTH_3), Validators.pattern(Constants.REGEX_NUMBER),
        validateVariationDaysNumber(dateAfterAdd, firstDate, expiryDateString)]);
      this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`).updateValueAndValidity();
    }
}

checkErrorOnIrregularItem(irregularRecord: any) {
    if (irregularRecord.variationSequence === '1') {
      this.sectionForm.get(`${this.undertakingType}VariationsLists`).setErrors(null);
      if (this.sectionForm.get(`${this.undertakingType}AdviseDaysPriorNb`) !== null) {
        this.validateVariationDaysNotice();
      }
    }
    this.isIrregularItemHasAmtError = false;
    if (this.irregularErrorItem !== null && this.irregularErrorItem !== undefined &&
      irregularRecord.variationSequence === this.irregularErrorItem.variationSequence ) {
    this.isIrregularItemHasAmtError = true;
    return true;
    }
    this.isIrregularItemHasDateError = false;
    if ((this.undertakingType === Constants.UNDERTAKING_TYPE_IU && this.iuCommonDataService.getExpDateType() === '02')
    || (this.undertakingType === Constants.UNDERTAKING_TYPE_CU && this.iuCommonDataService.getCUExpDateType() === '02')) {
    let firstDate = irregularRecord.variationFirstDate;
    firstDate = this.commonService.getDateObject(firstDate);
    firstDate = Date.parse(this.datePipe.transform(firstDate , Constants.DATE_FORMAT));
    let maximumFirstDate;
    maximumFirstDate = (this.undertakingType === Constants.UNDERTAKING_TYPE_IU ?
      this.commonService.maxDate : this.commonService.cuMaxDate);
    maximumFirstDate = Date.parse(this.datePipe.transform(maximumFirstDate , Constants.DATE_FORMAT));
    if (maximumFirstDate !== '' && firstDate > maximumFirstDate) {
    this.isIrregularItemHasDateError = true;
    return true;
    }
  }
    return false;
  }
reCalculateVariationAmount() {
    const undertakingAmt = this.commonService.getNumberWithoutLanguageFormatting(this.getUndertakingAmt());
    if (this.sectionForm.get(`${this.undertakingType}VariationType`).value === '01') {
      const variationpercent = this.sectionForm.get(`${this.undertakingType}VariationPct`).value;
      const bgCurCodeControl = this.sectionForm.get(`${this.undertakingType}VariationCurCode`);
      if (variationpercent !== '' && variationpercent != null) {
        let variationAmt = (variationpercent / Constants.LENGTH_100 * undertakingAmt).toString();
        variationAmt = this.commonService.transformAmt(variationAmt, bgCurCodeControl.value);
        this.sectionForm.get(`${this.undertakingType}VariationAmt`).setValue(variationAmt);
      }
    } else if (this.sectionForm.get(`${this.undertakingType}VariationType`).value === '02') {
      this.reCalculateIrregularVariationAmt();
    }
  }

reCalculateIrregularVariationAmt() {
    let map: IrregularDetails[] = [];
    let irregularErrorMap: IrregularDetails[] = [];
    let sortedErrList;
    if (this.undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      map = this.reductionService.bgIrregularReductionMap;
    } else {
      map = this.reductionService.cuIrregularReductionMap;
    }
    const undertakingAmt = this.commonService.getNumberWithoutLanguageFormatting(this.getUndertakingAmt());
    if (map.length > 0) {
    for (const item of map) {
      if (item.variationPct !== '' && this.commonService.compareFirstDatewithAmendDate(item.variationFirstDate)) {
        const bgCurCode = item.variationCurCode;
        let variationAmt = (parseInt(item.variationPct, 10) / Constants.LENGTH_100 * undertakingAmt).toString();
        variationAmt = this.commonService.transformAmt(variationAmt, bgCurCode);
        item.variationAmt = variationAmt;
      }
    }
    irregularErrorMap = this.reductionService.validateIrregularItems(map, this.undertakingType);
    sortedErrList = this.commonService.sortIrregularList(irregularErrorMap);
    this.setErrorForIrregularItem(sortedErrList);
  }
  }

getUndertakingAmt() {
    return (this.undertakingType === Constants.UNDERTAKING_TYPE_IU ? this.commonService.getUndertakingAmt() :
     this.commonService.getCuUndertakingAmt() );
  }

checkMaxDate()  {
    return this.undertakingType === Constants.UNDERTAKING_TYPE_IU ? this.commonService.maxDate : this.commonService.cuMaxDate;
  }

setValueFromField(variationType, undertakingType) {
    const variationTypeValue = this.iuCommonDataService.getVariationType(undertakingType);
    if (variationTypeValue && variationTypeValue !== null && variationTypeValue !== '' &&
        (variationTypeValue === this.sectionForm.get(variationType).value)) {
      this.sectionForm.get(variationType).reset();
      this.iuCommonDataService.setVariationType('', undertakingType);
    } else {
      this.iuCommonDataService.setVariationType(this.sectionForm.get(variationType).value, undertakingType);
    }
    if (this.bgRecord[`${this.undertakingType}Variation`]) {
    this.bgRecord[`${this.undertakingType}Variation`] = null;
    }
    this.resetCommonControls();
    this.addDynamicControls();
  }


}
