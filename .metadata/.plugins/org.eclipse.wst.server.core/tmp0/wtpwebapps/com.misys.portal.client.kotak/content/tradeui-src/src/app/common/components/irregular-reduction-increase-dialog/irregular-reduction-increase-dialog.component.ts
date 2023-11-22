import { ReductionService } from './../../services/reduction.service';
import { Constants } from '../../constants';
import { Component, OnInit, EventEmitter, Output, ElementRef} from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, ConfirmationService } from 'primeng';
import { CommonService } from '../../services/common.service';
import { Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IUCommonDataService } from '../../../trade/iu/common/service/iuCommonData.service';
import { CommonDataService } from '../../services/common-data.service';
import { ValidationService } from '../../../common/validators/validation.service';
import { validateCurrCode, validateSwiftCharSet } from '../../validators/common-validator';
import { StaticDataService } from '../../services/staticData.service';
import { IrregularDetails } from '../../model/IrregularDetails.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fcc-iu-irregular-reduction-increase-dialog',
  templateUrl: './irregular-reduction-increase-dialog.component.html',
  styleUrls: ['./irregular-reduction-increase-dialog.component.scss']
})
export class IrregularReductionIncreaseDialogComponent implements OnInit {

  irregularDetailsForm: UntypedFormGroup;
  public operationTypeObj: any[];
  yearRange: string;
  reductionDate: string;
  operationType: string;
  percentage: string;
  amount: string;
  event: string;
  undertakingType: string;
  curCode: string;
  reductionType: string;
  adviseEventFlag: string;
  adviseDaysperNb: string;
  reductionForm: UntypedFormGroup;
  public irregularReductionMap: IrregularDetails[] = [];
  public currencies;
  currencyCode: string;
  sequence: string;
  setIncreaseOperation: boolean;
  dateFormat: string;
  @Output() formReady = new EventEmitter<UntypedFormGroup>();

  constructor(public fb: UntypedFormBuilder, public dialogRef: DynamicDialogRef,  public config: DynamicDialogConfig,
              public iuCommonService: IUCommonDataService, public translate: TranslateService,
              public confirmationService: ConfirmationService, public el: ElementRef,
              public commonData: CommonDataService, public reductionService: ReductionService, public validationService: ValidationService,
              public commonService: CommonService, protected staticDataService: StaticDataService) {}

    ngOnInit() {
      this.dateFormat = this.commonService.getDateFormat();
      this.reductionDate = this.config.data.reductionDate;
      this.operationType = this.config.data.operation;
      this.percentage =  this.config.data.percentage;
      this.amount =  this.config.data.amount;
      this.event = this.config.data.eventType;
      this.curCode = this.config.data.currencyCode;
      this.undertakingType = this.config.data.type;
      this.reductionType = this.config.data.reductionType;
      this.adviseEventFlag = this.config.data.adviseEventFlag;
      this.adviseDaysperNb = this.config.data.adviseDaysperNb;
      this.reductionForm = this.config.data.form;
      this.currencyCode = this.config.data.defaultCurrCode;
      this.sequence = this.config.data.sequence;
      this.setIncreaseOperation = this.config.data.setIncreaseOperation;

      this.yearRange = this.commonService.getYearRange();
      this.operationTypeObj = [
        { label: this.commonService.getTranslation('INCREASE'), value: '01', disabled: false },
        { label: this.commonService.getTranslation('DECREASE'), value: '02', disabled: false }
      ];

      this.irregularDetailsForm = this.fb.group({
        bgOperationType: ['02'],
        bgVariationFirstDate: [''],
        bgVariationPct: [''],
        bgVariationCurCode: [{value: '', disabled: true}] ,
        bgVariationAmt: [''],
        cuOperationType: ['02'],
        cuVariationFirstDate: [''],
        cuVariationPct: [''],
        cuVariationCurCode:  [{value: '', disabled: true}],
        cuVariationAmt: ['']
      });

      if (this.undertakingType === 'bg') {
        this.irregularDetailsForm.get('bgVariationFirstDate').setValidators([Validators.required]);
        this.irregularDetailsForm.get('bgVariationPct').setValidators([Validators.required, Validators.maxLength(Constants.LENGTH_12),
          Validators.pattern(Constants.REGEX_PERCENTAGE)]);
        this.irregularDetailsForm.get('bgVariationCurCode').setValidators([Validators.required,
          Validators.maxLength(Constants.LENGTH_3), validateSwiftCharSet(Constants.X_CHAR)]);
        this.irregularDetailsForm.get('bgVariationAmt').setValidators(Validators.required);
      } else if (this.undertakingType === 'cu') {
        this.irregularDetailsForm.get('cuVariationFirstDate').setValidators([Validators.required]);
        this.irregularDetailsForm.get('cuVariationPct').setValidators([Validators.required, Validators.maxLength(Constants.LENGTH_12),
          Validators.pattern(Constants.REGEX_PERCENTAGE)]);
        this.irregularDetailsForm.get('cuVariationCurCode').setValidators([Validators.required,
          Validators.maxLength(Constants.LENGTH_3), validateSwiftCharSet(Constants.X_CHAR)]);
        this.irregularDetailsForm.get('cuVariationAmt').setValidators(Validators.required);
      }

      if (this.event === 'edit') {
        this.initAllFields();
      }

      if (this.setIncreaseOperation) {
        this.operationTypeObj[1].disabled = true;
        this.irregularDetailsForm.get(`${this.undertakingType}OperationType`).setValue('01');
      }

    }

    pushIrregularDetails() {
      if (this.irregularDetailsForm.touched || this.irregularDetailsForm.dirty) {
      this.validateFields(this.irregularDetailsForm);
      if (this.irregularDetailsForm.valid) {
      const operationType = this.irregularDetailsForm.get(`${this.undertakingType}OperationType`).value;
      const date = this.irregularDetailsForm.get(`${this.undertakingType}VariationFirstDate`).value;
      const percentage = this.irregularDetailsForm.get(`${this.undertakingType}VariationPct`).value;
      const amt = this.irregularDetailsForm.get(`${this.undertakingType}VariationAmt`).value;
      const curCode = this.irregularDetailsForm.get(`${this.undertakingType}VariationCurCode`).value;
      let sectionType;
      if (this.undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        sectionType = '01';
        this.irregularReductionMap = this.reductionService.getBgIrregularlist();
      } else {
        sectionType = '02';
        this.irregularReductionMap = this.reductionService.getCuIrregularlist();
      }
      let data;
      if (this.event === 'edit') {
        data = this.irregularReductionMap.find(ob => (ob.operationType === operationType &&
          ob.variationFirstDate === date && ob.sectionType === sectionType && this.sequence !== ob.variationSequence ));
      } else {
      data = this.irregularReductionMap.find(ob => (ob.operationType === operationType &&
        ob.variationFirstDate === date && ob.sectionType === sectionType));
      }
      if (data !== undefined ) {
        this.dialogRef.close({event: 'DuplicateEntry', data: this.irregularReductionMap});
      } else {
      this.irregularReductionMap = this.reductionService.pushIrregularDetails(this.event, this.undertakingType, operationType,  date,
                       percentage, amt, curCode, this.reductionType, this.adviseEventFlag, this.adviseDaysperNb,
                       this.sequence);
      let irregularErrorList;
      irregularErrorList = this.reductionService.validateIrregularItems(this.irregularReductionMap, this.undertakingType);
      if (irregularErrorList !== null && irregularErrorList.length > 0 ) {
        this.dialogRef.close({event: 'errorItem', data: irregularErrorList});
        } else {
        this.dialogRef.close({event: 'IrregularMap', data: this.irregularReductionMap});
        }
      }
      }
    } else {
      this.dialogRef.close();
    }
    }

    initAllFields() {
      if (this.operationType !== '') {
        this.irregularDetailsForm.get(`${this.undertakingType}OperationType`).setValue(this.operationType);
      }
      if (this.percentage !== '') {
        this.irregularDetailsForm.get(`${this.undertakingType}VariationAmt`).disable();
      }
      if (this.amount !== '' && (this.percentage === '' || this.percentage == null)) {
        this.irregularDetailsForm.get(`${this.undertakingType}VariationPct`).disable();
      }
      this.irregularDetailsForm.patchValue({
          bgVariationFirstDate: this.reductionDate,
          bgVariationPct: this.commonService.getPercentWithoutLanguageFormatting(this.percentage),
          bgVariationCurCode: this.curCode,
          bgVariationAmt: this.amount,
          cuVariationFirstDate: this.reductionDate,
          cuVariationPct: this.commonService.getPercentWithoutLanguageFormatting(this.percentage),
          cuVariationCurCode: this.curCode,
          cuVariationAmt: this.amount
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

    setCurrencyCode() {
      this.irregularDetailsForm.get(`${this.undertakingType}VariationCurCode`).setValue(
        this.iuCommonService.getCurCode(this.undertakingType));
    }

    validateFields(mainForm: UntypedFormGroup) {
      mainForm.markAllAsTouched();
      if (!this.irregularDetailsForm.valid) {
            let message = '';
            let dialogHeader = '';
            this.translate.get('ERROR_TITLE').subscribe((value: string) => {
              dialogHeader =  value;
            });
            this.translate.get('IRREGULAR_ERROR').subscribe((value: string) => {
              message =  value;
            });

            this.confirmationService.confirm({
              message,
              header: dialogHeader,
              icon: 'pi pi-exclamation-triangle',
              key: 'fieldErrorDialog',
              rejectVisible: false,
              acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
              accept: () => {}
              });
          }
        }
    checkMaxDate()  {
      return this.undertakingType === Constants.UNDERTAKING_TYPE_IU ? this.commonService.maxDate : this.commonService.cuMaxDate;
    }

}
