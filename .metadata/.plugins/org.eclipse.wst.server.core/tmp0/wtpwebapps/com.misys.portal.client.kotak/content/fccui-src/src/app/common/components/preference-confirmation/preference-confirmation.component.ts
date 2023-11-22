import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UntypedFormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-preference-confirmation',
  templateUrl: './preference-confirmation.component.html',
  styleUrls: ['./preference-confirmation.component.scss']
})
export class PreferenceConfirmationComponent implements OnInit {

  filterPreferenceForm: UntypedFormGroup;
  errorState = false;
  buttonDisabled = false;
  preferenceValidationMinLen;
  preferenceValidationMaxLen;
  preferenceValidationRegex;
  filterPreferenceTitle;


  constructor( protected formBuilder: UntypedFormBuilder, protected dynamicDialogConfig: DynamicDialogConfig,
               protected dynamicDialogRef: DynamicDialogRef, protected translateService: TranslateService ) {
                 this.preferenceValidationMinLen = dynamicDialogConfig.data.preferenceValidationMinLen;
                 this.preferenceValidationMaxLen = dynamicDialogConfig.data.preferenceValidationMaxLen;
                 this.preferenceValidationRegex = dynamicDialogConfig.data.preferenceValidationRegex;
                 this.filterPreferenceTitle = dynamicDialogConfig.header ? dynamicDialogConfig.header : 'preferenceTitle';
               }

ngOnInit(): void {
  this.dashboardSaveForm();
  this.filterPreferenceForm = new UntypedFormGroup({
    filterPreferenceName: new UntypedFormControl(),
    PreferenceCheckBox: new UntypedFormControl()
 });
 this.addAccessibilityControl();
}

addAccessibilityControl(): void {
  const titleBarCloseList = Array.from(document.getElementsByClassName('ui-dialog-titlebar-close'));
  titleBarCloseList.forEach(element => {
    element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant('close');
    element[FccGlobalConstant.TITLE] = this.translateService.instant('close');
  });    
}

dashboardSaveForm() {
  this.filterPreferenceForm = this.formBuilder.group({
    filterPreferenceName: [''],
    PreferenceCheckBox : false,
    errorMessage: ''
  });
}
onFocusInput() {
  this.errorState = false;
}

onCloseDialog() {
  this.filterPreferenceForm.get('filterPreferenceName').clearValidators();
  this.errorState = false;
  this.buttonDisabled = false;
}
onShowDialog() {
  this.filterPreferenceForm.get('filterPreferenceName').setValidators([
    Validators.pattern(this.preferenceValidationRegex), Validators.required,
    Validators.minLength(this.preferenceValidationMinLen),
    Validators.maxLength(this.preferenceValidationMaxLen)]);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
onKeyUpInput(event) {
  this.filterPreferenceForm.valueChanges.subscribe(() => {
      const value = this.filterPreferenceForm.get('filterPreferenceName').value;
      if (value.length >= FccGlobalConstant.LENGTH_3) {
      }
  });
}

  submitDashboardName() {
    let defaultPreferenceValue;
    const savedName = this.filterPreferenceForm.get('filterPreferenceName').value;
    if (this.filterPreferenceForm && this.filterPreferenceForm.get('PreferenceCheckBox')) {
      const defaultPreference = this.filterPreferenceForm.get('PreferenceCheckBox').value;
      defaultPreferenceValue = (defaultPreference === true) ? FccGlobalConstant.CODE_Y : FccGlobalConstant.CODE_N;
    }
    const data = { savedName, defaultPreferenceValue };
    this.dynamicDialogRef.close(data);
  }

}
