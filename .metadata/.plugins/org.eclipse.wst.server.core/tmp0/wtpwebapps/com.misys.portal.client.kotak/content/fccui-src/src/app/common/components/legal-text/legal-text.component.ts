import { LegalTextService } from './../../services/legal-text.service';
import { ReauthService } from './../../services/reauth.service';
import { SpacerControl, TextControl, MatCheckboxFormControl, ButtonControl } from './../../../base/model/form-controls.model';
import { FccGlobalConstant } from './../../core/fcc-global-constants';
import { FCCFormGroup } from './../../../base/model/fcc-control.model';
import { Router } from '@angular/router';
import { CommonService } from './../../services/common.service';
import { FormModelService } from './../../services/form-model.service';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormControlService } from './../../../corporate/trade/lc/initiation/services/form-control.service';
import { FCCBase } from './../../../base/model/fcc-base';
import { Component, OnInit } from '@angular/core';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-legal-text',
  templateUrl: './legal-text.component.html',
  styleUrls: ['./legal-text.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LegalTextComponent }]
})
export class LegalTextComponent extends FCCBase implements OnInit {

  form: FCCFormGroup;
  module = ``;

  constructor(protected formControlService: FormControlService, protected translateService: TranslateService,
              protected dynamicDialogConfig: DynamicDialogConfig, protected dynamicDialogRef: DynamicDialogRef,
              protected formModelService: FormModelService, protected legalTextService: LegalTextService,
              protected commonService: CommonService, protected router: Router,
              protected reauthService: ReauthService) {
    super();

  }

 ngOnInit(): void {
    this.initializeFormGroup();
    this.patchFieldParameters(this.form.get('terms'), { label: this.legalTextService.legalTextData });
    this.addAccessibilityControl();
  }

  addAccessibilityControl(): void {
    const titleBarCloseList = Array.from(document.getElementsByClassName('ui-dialog-titlebar-close'));
    titleBarCloseList.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant('close');
      element[FccGlobalConstant.TITLE] = this.translateService.instant('close');
    });    
  }

  initializeFormGroup() {
    this.form = new FCCFormGroup({
      terms: new TextControl('terms', this.translateService, {
        label: '',
        key: 'terms',
        rendered: true,
        boxClass: 'side_bar',
        styleClass: ['indented-text-area-field-35 contentfont'],
        layoutClass: 'p-col-12 inputStyle fheader',
        itemId: 'terms',
        tabIndex: '0'
      }),
      spaces4: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),
      cb: new MatCheckboxFormControl('cb', '', this.translateService, {
        key: 'cb',
        options: [{
          value: 'cb', label: `${this.translateService.instant('N002_92')}`
        }],
        layoutClass: 'p-col-12',
        styleClass: 'margin-all-side leftwrapper bkcolor size',
        rendered: true,
        disabled: true
      }),
      submit: new ButtonControl('submit', this.translateService, {
        label: `${this.translateService.instant('submit')}`,
        key: 'submit',
        btndisable: true,
        rendered: true,
        layoutClass: 'p-col-10',
        tabindex: 1,
        styleClass: this.dir === 'rtl' ? 'primaryButton tncButton leftDirect' : 'primaryButton tncButton rightDirect'
      }),
      cancel: new ButtonControl('cancel', this.translateService, {
        label: `${this.translateService.instant('cancel')}`,
        key: 'cancel',
        rendered: true,
        tabindex: 0,
        layoutClass: 'p-col-2',
        styleClass: this.dir === 'rtl' ? 'secondaryButton tncButton leftDirect' : 'secondaryButton tncButton rightDirect'
      }),
    });

  }

  onClickCb() {
    const value = this.form.get('cb').value === 'Y' ? true : false;
    this.patchFieldParameters(this.form.get('submit'), { btndisable: !value });
  }

  onKeyUpCb() {
    const value = this.form.get('cb').value === 'Y' ? true : false;
    this.patchFieldParameters(this.form.get('submit'), { btndisable: !value });
  }

  onClickSubmit(){
    this.onDialogClose();
    this.commonService.isubmitClicked.next(true);
    setTimeout(() => {
      this.reauthService.reauthenticate(this.legalTextService.requestData, FccGlobalConstant.reAuthComponentKey);
    }, 500);
  }

  onDialogClose() {
    this.dynamicDialogRef.close();
  }

  onClickCancel() {
    this.onDialogClose();
  }

  onScrollTerms() {
    this.patchFieldParameters(this.form.get('cb'), { disabled: false });
  }

}
