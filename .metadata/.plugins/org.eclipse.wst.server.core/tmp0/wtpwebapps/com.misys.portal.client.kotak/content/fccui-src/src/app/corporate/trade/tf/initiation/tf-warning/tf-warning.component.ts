import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { Component, OnInit } from '@angular/core';
import { FCCBase } from '../../../../../base/model/fcc-base';
import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { TextControl, RoundedButtonControl } from '../../../../../base/model/form-controls.model';
import { CommonService } from './../../../../../common/services/common.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-tf-warning',
  templateUrl: './tf-warning.component.html',
  styleUrls: ['./tf-warning.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TfWarningComponent }]
})
export class TfWarningComponent extends FCCBase implements OnInit {

  module: string;
  form: FCCFormGroup;
  modeValue;
  option;
  index;
  tnxTypeCode;
  isYesButton = false;
  constructor(protected commonService: CommonService, protected translateService: TranslateService,
              public dialogRef: DynamicDialogRef, protected router: Router, protected dynamicDialogConfig: DynamicDialogConfig,
              protected activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.modeValue = this.router.url.split('&');
    this.activatedRoute.queryParams.subscribe(params => {
      this.tnxTypeCode = params.tnxTypeCode;
    });
    this.getEditModeUrl();
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    this.form = new FCCFormGroup({
     // icon: new InputIconControl('icon', this.translateService, {
      //   label:  `${this.translateService.instant('Proceed')}`,
      //   layoutClass: 'p-col-1',
      //   styleClass: ['iconWR'],
      //   iconName:'warning_amber',
      //   parentStyleClass:'warningwrapper',
      //   rendered: true,
      //   key: 'Yes'
      // }),
        deleteConfirmationMsg: new TextControl('deleteConfirmationMsg', this.translateService, {
        label: (this.option === FccGlobalConstant.TEMPLATE && this.tnxTypeCode !== FccGlobalConstant.N002_NEW) ?
         `${this.translateService.instant('deleteTemplateConfirmation')}`
             : this.getLocalizationKey() !== null ?
              `${this.translateService.instant(this.getLocalizationKey())}` :
              `${this.translateService.instant('deleteConfirmationMsg')}`,
        layoutClass: 'p-col-12',
        styleClass: ['deleteConfirmationMsg'],
        rendered: true
        }),
        NoButton: new RoundedButtonControl('noButton', this.translateService, {
          label: `${this.translateService.instant('cancel')}`,
          layoutClass: 'p-col-10',
          styleClass: ['tertiaryButton'],
          rendered: true,
          key: 'No'
        }),
        yesButton: new RoundedButtonControl('yesButton', this.translateService, {
        label:  `${this.translateService.instant('proceed')}`,
        layoutClass: 'p-col-2',
        styleClass: ['ConfirmButton'],
        rendered: true,
        key: 'Yes'
      }),
    });
  }

  getEditModeUrl() {
    for (this.index = 0; this.index < this.modeValue.length; this.index++) {
      if (this.modeValue[this.index].indexOf('option') === 0) {
        this.option = this.modeValue[this.index].split('=').pop();
      }
    }
  }

  onClickYesButton() {
    this.isYesButton = true;
    setTimeout(() => {
    this.dialogRef.close('yes');
    }, 400);
  }

  onClickNoButton() {
    setTimeout(() => {
    this.dialogRef.close('no');
    }, 400);
  }

  onDialogClose() {
    setTimeout(() => {
      this.dialogRef.close('no');
      }, 400);
  }

  getLocalizationKey(): any {
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.locaKey !== undefined
      && this.dynamicDialogConfig.data.locaKey !== null ) {
        return this.dynamicDialogConfig.data.locaKey;
      } else { return null; }
  }

  ngOnDestroy() {
    if(!this.isYesButton) {
        this.onDialogClose();
      }
  }
}

