import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from './../../../../app/base/services/locale.service';
import { FCCFormGroup } from './../../../../app/base/model/fcc-control.model';
import { UtilityService } from './../../../../app/corporate/trade/lc/initiation/services/utility.service';
import { FCCBase } from './../../../../app/base/model/fcc-base';
import { FormControlService } from './../../../../app/corporate/trade/lc/initiation/services/form-control.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CurrencyRequest } from '../../model/currency-request';
import { CommonService } from '../../services/common.service';
import { FccOverlayService } from './../../../../app/base/services/fcc-overlay.service';
import { HOST_COMPONENT } from './../../../../app/shared/FCCform/form/form-resolver/form-resolver.directive';
import { CodeData } from '../../model/codeData';
import { FormService } from '../../services/listdef-form-service';
import { CurrencyConverterPipe } from '../../../../app/corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { validateAmountLength } from '../../../corporate/trade/ui/common/validators/ui-validators';

@Component({
  selector: 'events-filter-popup',
  templateUrl: './events-filter-popup.component.html',
  styleUrls: ['./events-filter-popup.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EventsFilterPopupComponent }]
})
export class EventsFilterPopupComponent extends FCCBase implements OnInit, OnDestroy {

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  rangeValues: number[] = [50,5000];
  pCol3 = 'p-col-3 p-lg-3 p-md-6 p-sm-12 inputStyle';
  multiSelectControl: AbstractControl;
  form: FCCFormGroup;
  filterSectionJson: any[] = [];
  @Input() data: any;
  module: any;
  options = 'options';
  isCurrencyDataLoaded = false;
  curRequest: CurrencyRequest = new CurrencyRequest();
  @Output() applyFilter: EventEmitter<any> = new EventEmitter<any>();
  codeData = new CodeData();
  @Input() productCode: string;
  tnxCurrency: string;
  amt;
  amountValidationPattern:string;
  constructor(protected translateService: TranslateService, protected localeService: LocaleService,
              protected utilityService: UtilityService, protected formControlService: FormControlService,
              protected corporateCommonService: CommonService, protected fccOverlayService: FccOverlayService,
              protected commonService: CommonService, protected lisdefFormService: FormService,
              protected currencyConverterPipe: CurrencyConverterPipe) { 
                super();
              }
  

  ngOnInit(): void {
    this.filterSectionJson = this.data.filterSectionJson;
    this.amountValidationPattern = this.commonService.getRegexBasedOnlanguage();
    this.initializeFormGroup();
  }
  
  initializeFormGroup() {
    this.form = new FCCFormGroup({});
    if (this.filterSectionJson) {
      this.filterSectionJson.forEach(element => {
        element.rendered = true;
        //Prefix 'events' to the field names to have unique onclick method names, 
        // as onclickTnxCurCode are present in filtersection.component.ts also
        if (element.type !== 'button' && !element.name.startsWith('events')) {
          element.name = `events_`+element.name;
        }
        
        if (element.type === 'input-multiselect') {
          element.layoutClass = 'p-col-12';
          element.styleClass = 'selectClass';
          this.form.addControl(this.lisdefFormService.underscoreToCamelcase(element.name), 
          this.lisdefFormService.getControlForFilterSection(element));
          this.lisdefFormService.populateMultiSelectOptions(element.name);  
        }
        if (element.type === 'amountRange') {
          const textControl = {
            name: 'amountRange',
            type: 'text',
            localizationkey: this.translateService.instant('amountRange'),
            key: 'amountRange',
            layoutClass: 'p-col-12',
            styleClass: 'textFieldStyle'
          };
          this.form.addControl(textControl.name, this.formControlService.getControl(textControl));
          element.localizationkey = element.name;
          const elementName = element.name;
          element.type = 'input-text';
          element.layoutClass = 'p-col-6';
          this.form.addControl(this.lisdefFormService.underscoreToCamelcase(element.name), 
          this.lisdefFormService.getControlForFilterSection(element)),
          this.form.get(this.lisdefFormService.underscoreToCamelcase(element.name))
          .setValidators([Validators.pattern(this.amountValidationPattern)]);
          this.patchFieldParameters(this.form.get(this.lisdefFormService.underscoreToCamelcase(element.name)),{ maxlength:16 });
          const name = elementName + `2`;
          element.name = name;
          element.localizationkey = element.name;
          this.form.addControl(this.lisdefFormService.underscoreToCamelcase(element.name), 
          this.lisdefFormService.getControlForFilterSection(element));
          this.form.get(this.lisdefFormService.underscoreToCamelcase(element.name))
          .setValidators([Validators.pattern(this.amountValidationPattern)]);
          this.patchFieldParameters(this.form.get(this.lisdefFormService.underscoreToCamelcase(element.name)),{ maxlength:16 });
          element.type = 'amountRange';
          element.name = elementName;
        } else if (element.type === 'input-date') {
          // element.type = 'input-date-range';
          // Adding label control
          // const textControl = {
          //   name: 'dateRange',
          //   type: 'text',
          //   localizationkey: this.translateService.instant('dateRange'),
          //   key: 'dateRange',
          //   layoutClass: 'p-col-12'
          // };
          // this.form.addControl(textControl.name, this.formControlService.getControl(textControl));
          element.localizationkey = element.name;
          element.appendTo ='none';
          this.form.addControl(this.lisdefFormService.underscoreToCamelcase(element.name), 
          this.lisdefFormService.getControlForFilterSection(element));
        } else {
          this.form.addControl(this.lisdefFormService.underscoreToCamelcase(element.name), 
          this.formControlService.getControl(element));
        }        
      });
      if(this.data.previousFormFilter){
        this.onClickEventsTnxCurCode();
        this.form.setValue(this.data.previousFormFilter);
      }
      
    }
  }

  onClickApplyFilter() {
    //Pass the data to fcc list box component.
    this.fccOverlayService.onCloseOverlay.next(this.form);
  }
  // onBlurApplyFilter() {
  //   this.onClickApplyFilter();
  // }
  // onFocusApplyFilter() {
  //   this.onClickApplyFilter();
  // }
  onKeydownApplyFilter(){
    this.fccOverlayService.onCloseOverlay.next(this.form);
  }

  onClickCancel() {
    //Close the 
    this.fccOverlayService.close();
  }
  onKeydownCancel(){
    this.fccOverlayService.close();
  }
  // onBlurCancel() {
  //   this.onClickCancel();
  // }
  // onFocusCancel() {
  //   this.onClickCancel();
  // }

  onKeydownEventsTnxCurCode() {
    this.onClickEventsTnxCurCode();
  }

  onClickEventsTnxCurCode() {
    const elementId = 'eventsTnxCurCode';
    const element = this.form.get(elementId);

    if (this.commonService.isNonEmptyField(elementId, this.form)
          && element[this.options] && element[this.options].length === 0) {
      let elementValue = this.form.get(elementId).value;
      if (elementValue === null) {
        elementValue = FccGlobalConstant.EMPTY_STRING;
      }
      if (elementValue !== null) {
        const currencyDataArray = [];
        if (this.form.get(elementId)[this.options].length === 0 && !this.isCurrencyDataLoaded) {
          this.corporateCommonService.userCurrencies(this.curRequest).subscribe(result => {
            result.items.forEach(value => {
              const curency: { label: string; value: any } = {
                label: value.isoCode,
                value: value.isoCode
              };
              currencyDataArray.push(curency);
            });
            this.patchFieldParameters(this.form.get(elementId), { options: currencyDataArray });
          },
          () => {
            this.isCurrencyDataLoaded = false;
          });
          this.isCurrencyDataLoaded = true;
        }
      }
      this.form.get(elementId).updateValueAndValidity();
    }
  }

  onClickEventsProdStatCode() {
    const elementId = 'eventsProdStatCode';
    const element = this.form.get(elementId);
    // if (event && event.value) {
    //  element.patchValue(event.value);
    //  element.updateValueAndValidity();
    if (element[this.options] && element[this.options].length === 0) {
      this.productCode = this.form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.PRODUCT];
      let elementValue = this.form.get(elementId).value;
      if (elementValue === null) {
        elementValue = FccGlobalConstant.EMPTY_STRING;
      }
      if ( elementValue.length >= 0) {
        this.codeData.codeId = FccGlobalConstant.CODEDATA_EVENT_TYPE_C093;
        this.codeData.productCode = this.productCode;
        this.codeData.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
        this.codeData.language = localStorage.getItem('language') !== null ? localStorage.getItem('language') : '';
        const eventDataArray = [];
        if (this.form.get(elementId)[this.options].length === 0 ) {
        this.corporateCommonService.getCodeDataDetails(this.codeData).subscribe(response => {
          response.body.items.forEach(responseValue => {
              const eventData: { label: string; value: any } = {
                label: responseValue.longDesc,
                value: responseValue.value
              };
              eventDataArray.push(eventData);
            });
          this.patchFieldParameters(this.form.get(elementId), { options: eventDataArray });
          });
        }
        }
      this.form.get(elementId).updateValueAndValidity();
    }
  }

  onClickEventsTnxTypeCode() {
    const elementId = 'eventsTnxTypeCode';
    const element = this.form.get(elementId);
    if (element[this.options] && element[this.options].length === 0) {
      let elementValue = element.value;
      if (elementValue === null) {
        elementValue = FccGlobalConstant.EMPTY_STRING;
      }
      const productCodeValue = this.form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.PRODUCT];
      this.productCode = this.commonService.isNonEmptyValue(productCodeValue) ? productCodeValue : '*';
      //if (elementValue && elementValue.length >= 0) {
        this.codeData.codeId = FccGlobalConstant.CODEDATA_EVENT_TYPE_C090;
        this.codeData.productCode = this.productCode;
        this.codeData.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
        this.codeData.language = localStorage.getItem('language') !== null ? localStorage.getItem('language') : '';
        const eventDataArray = [];
        if (this.form.get(elementId)[this.options].length === 0 ) {
        this.corporateCommonService.getCodeDataDetails(this.codeData).subscribe(response => {
          response.body.items.forEach(responseValue => {
              const eventData: { label: string; value: any } = {
                label: responseValue.longDesc,
                value: responseValue.value
              };
              eventDataArray.push(eventData);
            });
          this.patchFieldParameters(this.form.get(elementId), { options: eventDataArray });
          });
        }
        //}
      this.form.get(elementId).updateValueAndValidity();
    }
  }
  

  ngOnDestroy() {
    this.fccOverlayService.close();
  }
  onBlurEventsTnxAmt() {  
    this.processEventTnxAmount('eventsTnxAmt');
  }
  onBlurEventsTnxAmt2(){
    this.processEventTnxAmount('eventsTnxAmt2');
  }

  processEventTnxAmount(controlName:string){
    const tnxAmt = this.form.get(controlName);
    tnxAmt.clearValidators();
    this.setAmountLengthValidator(controlName);
    this.form.get(controlName)
    .setValidators([Validators.pattern(this.amountValidationPattern)]);
    this.amt = this.currencyConverterPipe.transform(tnxAmt.value, this.data.tnxCurrency);

    if (this.amt === null || this.amt === undefined ) {
      this.form.get(controlName).setErrors({ amountNotNull: true });
      return;
    }
    if ( tnxAmt.value == 0) {
      return;
    }
    if (this.amt !== '') {

      if (this.data.tnxCurrency !== '' && this.commonService.isNonEmptyValue(this.data.tnxCurrency)) {
        let valueupdated = this.commonService.replaceCurrency(this.amt);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.data.tnxCurrency);
        this.form.get(controlName).setValue(valueupdated);
      }
    }

    this.form.get(controlName).updateValueAndValidity();
  }

  setAmountLengthValidator(controlName: string){
    let amountValue = this.form.get(controlName).value;
    amountValue = this.commonService.replaceCurrency(amountValue);
    const amountMaxLength = this.form.get(controlName)[FccGlobalConstant.PARAMS][FccGlobalConstant.MAXLENGTH];
    if (amountValue.split('.')[1] === FccGlobalConstant.EMPTY_DECIMAL ||
    amountValue.split('.')[1] === FccGlobalConstant.EMPTY_DECIMAL_ZERO) {
      amountValue = amountValue.split('.')[0];
    }
    this.form.addFCCValidators(controlName, Validators.compose([validateAmountLength(amountValue, amountMaxLength)]), 0);
  }
  onFocusEventsTnxAmt($event) {
    this.amt = $event.target.value;
    this.amt = this.commonService.replaceCurrency(this.amt); 
    $event.target.value = this.amt;
  }

  onFocusEventsTnxAmt2($event){
   this.onFocusEventsTnxAmt($event);
  }
}
