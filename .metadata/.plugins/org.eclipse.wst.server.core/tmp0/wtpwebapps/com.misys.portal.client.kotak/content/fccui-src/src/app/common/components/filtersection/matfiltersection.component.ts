import {
  Component,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { LocaleService } from '../../../base/services/locale.service';
import { UtilityService } from '../../../corporate/trade/lc/initiation/services/utility.service';
import { FccConstants } from '../../core/fcc-constants';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { CommonService } from '../../services/common.service';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { LendingCommonDataService } from '../../../corporate/lending/common/service/lending-common-data-service';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { HOST_COMPONENT } from '../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FiltersectionComponent } from './filtersection.component';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { ButtonControl, DropdownFormControl, InputDateControl, InputTextControl, MultiSelectFormControl, SelectButtonControl, SpacerControl } from '../../../base/model/form-controls.model';
import { AbstractControl } from '@angular/forms';
import { ComponentService } from '../../../base/services/component.service';
import { MultiBankService } from '../../../common/services/multi-bank.service';
import { FormService } from '../../services/listdef-form-service';

@Component({
  selector: 'fcc-common-matfiltersection',
  templateUrl: './matfiltersection.component.html',
  styleUrls: ['./matfiltersection.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: MatFiltersectionComponent }]
})
export class MatFiltersectionComponent extends FiltersectionComponent {


  constructor(protected translateService: TranslateService,
              protected commonService: CommonService,
              protected corporateCommonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected activatedRoute: ActivatedRoute,
              protected lendingService: LendingCommonDataService,
              protected dynamicDialogConfig: DynamicDialogConfig,
              protected formControlService: FormControlService,
              protected dynamicDialogRef: DynamicDialogRef,
              protected utilityService: UtilityService,
              protected multiBankService : MultiBankService,
              protected localeService: LocaleService,
              protected lisdefFormService: FormService,
              @Inject(MAT_DIALOG_DATA) public data,
              protected matDialog: MatDialogRef<MatFiltersectionComponent>,
              protected compService: ComponentService) {
    super(translateService, commonService, corporateCommonService, fccGlobalConstantService, activatedRoute, lendingService,
      dynamicDialogConfig,formControlService,dynamicDialogRef,utilityService,multiBankService, localeService, lisdefFormService);
  }

  buttonForm: FCCFormGroup;

  initializeFormGroup() {
    this.form = new FCCFormGroup({});
    this.buttonForm = new FCCFormGroup({});
    let obj1 = {};
    if (this.data) {
      const displayJSON = 'displayJSON';
      const buttonJSON = 'buttonJSON';
      const widgetFilterJSON = 'widgetFilterJSON';
      const formData = 'formData';
      obj1 = this.data;
      this.widgetData = obj1[displayJSON];
      this.buttonJSONValue = obj1[buttonJSON];
      this.widgetFilterRequired = obj1[widgetFilterJSON];
      this.formDataValue = obj1[formData];
    }
    if (this.widgetFilterRequired) {
      this.inputJson = this.widgetData;
    }
    if (this.commonService.filterDataAvailable) {
      this.inputJson = this.filterPreferenceDataBinding(this.inputJson, this.commonService.filterPreferenceData);
    }
    if (this.filterParams) {
      this.inputJson = this.filterPreferenceDataBinding(this.inputJson, this.filterParams);
    }
    this.handleFormDatavalue();
    if (this.buttonJSONValue) {
      this.handleFilterButtons();
    }
    this.backupValue = this.form.getRawValue();
    this.viewInCurrency = this.commonService.getBaseCurrency();
    if (this.commonService.isNonEmptyField(FccConstants.ACCOUNTCCY, this.form) &&
    this.commonService.isEmptyValue(this.form.get(FccConstants.ACCOUNTCCY).value)) {
      this.onClickAccountCcy();
      this.form.get(FccConstants.ACCOUNTCCY).setValue(this.viewInCurrency);
    }
  }

  protected handleFormDatavalue() {
    if (this.formDataValue) {
      this.form = this.formDataValue;
    } else {
      if (this.inputJson) {
        this.inputJson.forEach(element => {
          if (element.name === 'revolving_flag' || element.name === 'ntrf_flag' || element.name === 'renew_flag'
          || element.name === 'rolling_renewal_flag') {
            element.type = 'input-multiselect';
            element.options[0].label = `${this.translateService.instant('Y')}`;
            element.options[0].value = 'Y';
            element.options[1].label = `${this.translateService.instant('N')}`;
            element.options[1].value = 'N';
          }
          if (element.name !== 'export_list') {
            this.form.addControl(this.underscoreToCamelcase(element.name), this.getControl(element));
            this.populateMultiSelectOPtions(element.name);
          } else {
            this.exportFileName = element.fileName;
          }
        });
        if (this.filterParams) {
          this.filterApplied.emit();
        }
      }
    }
  }

  protected handleFilterButtons() {
    if (this.dir === 'ltr') {
      if (this.buttonJSONValue.cancelBtn) {
        this.buttonForm.addControl(this.buttonJSONValue.cancelBtn.name, this.getControl(this.buttonJSONValue.cancelBtn));
      }
      if (this.buttonJSONValue.resetBtn) {
        this.buttonForm.addControl(this.buttonJSONValue.resetBtn.name, this.getControl(this.buttonJSONValue.resetBtn));
      }
      if (this.buttonJSONValue.applyBtn) {
        this.buttonForm.addControl(this.buttonJSONValue.applyBtn.name, this.getControl(this.buttonJSONValue.applyBtn));
      }
    }
    if (this.dir === 'rtl') {
      if (this.buttonJSONValue.applyBtn) {
        this.buttonForm.addControl(this.buttonJSONValue.applyBtn.name, this.getControl(this.buttonJSONValue.applyBtn));
        this.buttonForm.get(this.buttonJSONValue.applyBtn.name)[FccGlobalConstant.PARAMS].layoutClass =
        'button-filter-width-11';
      }
      if (this.buttonJSONValue.resetBtn) {
        this.buttonForm.addControl(this.buttonJSONValue.resetBtn.name, this.getControl(this.buttonJSONValue.resetBtn));
        this.buttonForm.get(this.buttonJSONValue.resetBtn.name)[FccGlobalConstant.PARAMS].layoutClass = 'button-filter-width-14';
      }
      if (this.buttonJSONValue.cancelBtn) {
        this.buttonForm.addControl(this.buttonJSONValue.cancelBtn.name, this.getControl(this.buttonJSONValue.cancelBtn));
        this.buttonForm.get(this.buttonJSONValue.cancelBtn.name)[FccGlobalConstant.PARAMS].layoutClass = 'button-filter-width-14';
      }
    }
  }

  getControl(element: any) {
    const pCol4 = 'p-col-12 p-lg-4 p-md-6 p-sm-6 inputStyle';
    let control: AbstractControl;
    switch (element.type) {
      case 'input-multiselect':
      control = new MultiSelectFormControl(this.underscoreToCamelcase(element.name), element.value, this.translateService, {
        placeholder: `${this.translateService.instant(element.localizationkey)}`,
        options: element.options,
        layoutClass: pCol4,
        styleClass: 'triggerIcon',
        rendered: true,
        maxSelectLabels: 1,
        srcElementId: element.name,
        productCode: element.productCode
      });
      break;
      case 'select-button':
      control = new SelectButtonControl(this.underscoreToCamelcase(element.name), element.selected, this.translateService, {
          label: `${this.translateService.instant(element.name)}`,
          options: element.options,
          styleClass: 'bank-select time-frame',
          layoutClass: 'p-col-12',
          rendered: true,
          srcElementId: element.name,
          showHorizontal: true
        });
      break;
      case 'button':
      control = new ButtonControl(this.underscoreToCamelcase(element.name), this.translateService, {
          label: `${this.translateService.instant(element.name)}`,
          options: element.options,
          styleClass: element.styleClass,
          layoutClass: element.layoutClass,
          rendered: true,
          srcElementId: element.name,
          showHorizontal: true
        });
      break;
      case 'button-div':
      control = this.getDivControl(element);
      break;
      case 'spacer':
        control = new SpacerControl(this.translateService, {
          layoutClass: element.layoutClass,
          rendered: element.rendered !== undefined ? element.rendered : true
        });
        break;
      case 'input-date':
      control = new InputDateControl(this.underscoreToCamelcase(element.name), '', this.translateService, {
        label: `${this.translateService.instant(element.localizationkey)}`,
        layoutClass: pCol4,
        styleClass: ['dateStyle calendarStyle'],
        srcElementId: element.name,
        selectionMode: 'mat',
        rendered: true,
        langLocale: this.localeService.getCalendarLocaleJson(this.language),
        dateFormat: this.utilityService.getDateFormatForRangeSelectionCalendar()
      });
      break;
      case 'input-dropdown':
      control = new DropdownFormControl(this.underscoreToCamelcase(element.name), '', this.translateService, {
        label: `${this.translateService.instant(element.localizationkey)}`,
        options: element.options,
        layoutClass: pCol4,
        styleClass: 'triggerIcon',
        rendered: true,
        maxSelectLabels: 1,
        srcElementId: element.name,
        productCode: element.productCode
      });
      break;
      default:
        control = new InputTextControl(this.underscoreToCamelcase(element.name), element.value, this.translateService, {
          label: `${this.translateService.instant(element.localizationkey)}`,
          styleClass: ['textFieldStyle'],
          layoutClass: pCol4,
          rendered: true,
          srcElementId: element.name
        });
    }

    return control;
  }

  onFocusApplyBtn() {
    super.onFocusApplyBtn();
    this.matDialog.close(this.form);
  }

  onClickCancelBtn() {
    super.onClickCancelBtn();
    this.matDialog.close(this.form);
  }

  onClickResetBtn() {
    super.onClickResetBtn();
    this.form.reset();
  }
}
