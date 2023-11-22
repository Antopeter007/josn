import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FCCBase } from '../../../../../../base/model/fcc-base';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { TextControl, RoundedButtonControl, SpacerControl } from '../../../../../../base/model/form-controls.model';
import { CommonService } from './../../../../../../common/services/common.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { ProductStateService } from '../../../common/services/product-state.service';

@Component({
  selector: 'fcc-trade-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ConfirmationDialogComponent }]
})
export class ConfirmationDialogComponent extends FCCBase implements OnInit, OnDestroy {

  module: string;
  form: FCCFormGroup;
  modeValue;
  option;
  index;
  tnxTypeCode;
  showSavedInfo: boolean;
  savedInfo: any;
  constructor(protected commonService: CommonService, protected translateService: TranslateService,
              public dialogRef: DynamicDialogRef, protected router: Router, protected dynamicDialogConfig: DynamicDialogConfig,
              protected activatedRoute: ActivatedRoute, protected stateService: ProductStateService,) {
    super();
  }
  ngOnDestroy(): void {
    this.commonService.setOpenDialog(0);
    if (this.commonService.getQueryParametersFromKey('action') === FccGlobalConstant.APPROVE) {
      this.commonService.isApproveAllowed.next(true);
    }
  }

  ngOnInit() {
    this.modeValue = this.router.url.split('&');
    this.activatedRoute.queryParams.subscribe(params => {
      this.tnxTypeCode = params.tnxTypeCode;
    });
    this.getEditModeUrl();
    if(this.dynamicDialogConfig.data?.lastUpdatedDateTime &&
      this.stateService.getAutoSaveConfig()?.isAutoSaveEnabled) {
      this.showSavedInfo = true;
    } else {
      this.showSavedInfo = false;
    }
    this.initializeFormGroup();
    this.addAccessibilityControl();
  }

  initializeFormGroup() {
    this.form = new FCCFormGroup({
        deleteConfirmationMsg: new TextControl('deleteConfirmationMsg', this.translateService, {
          label:
          this.option === FccGlobalConstant.TEMPLATE &&
          this.tnxTypeCode !== FccGlobalConstant.N002_NEW
            ? `${this.translateService.instant("deleteTemplateConfirmation")}`
             : this.getLocalizationKey() !== null ?
              `${this.translateService.instant(this.getLocalizationKey())}` :
              `${this.translateService.instant('deleteConfirmationMsg')}`,
        layoutClass: 'p-col-12',
        styleClass: ['deleteConfirmationMsg'],
        rendered: true
        }),
        timeStamp: new TextControl('lastSavedMsg', this.translateService, {
        label:`${this.translateService.instant("savedInfo")}` + `${this.dynamicDialogConfig.data?.lastUpdatedDateTime}`,
        layoutClass: 'p-col-8',
        styleClass: ['savedInfo'],
        rendered: this.showSavedInfo
        }),
        spacer01: new SpacerControl(this.translateService, {
          sectionType: 'spacerModel',
          noofspacers: '1',
          layoutClass: this.showReturnButton() ? 'p-col-8' : 'p-col-10',
          rendered: this.showSpacer()
        }),
        yesButton: new RoundedButtonControl('yesButton', this.translateService, {
        label: `${this.translateService.instant('yes')}`,
        layoutClass: this.showSavedInfo? 'p-col-2' : 'p-col-10',
        styleClass: ['tertiaryButton'],
        rendered: this.showYesButton(),
        key: 'Yes'
      }),
        NoButton: new RoundedButtonControl('noButton', this.translateService, {
        label: `${this.translateService.instant('no')}`,
        layoutClass: this.showSavedInfo? 'p-col-2' : 'p-col-2',
        styleClass: ['ConfirmButton'],
        rendered: this.showNoButton(),
        key: 'No'
      }),
        okButton: new RoundedButtonControl('yesButton', this.translateService, {
        label: `${this.translateService.instant('ok')}`,
        layoutClass: this.showCancelButton() ? 'p-col-10' : 'p-col-12',
        styleClass: ['tertiaryButton'],
        rendered: this.showOkButton(),
        key: 'ok'
      }),
      autoForwardButton: new RoundedButtonControl('autoForwardButton', this.translateService, {
        label: `${this.translateService.instant('autoForward')}`,
        layoutClass: this.showReturnButton() ? 'p-col-8' : 'p-col-10',
        styleClass: ['tertiaryButton'],
        rendered: this.showAutoForwardButton(),
        key: 'AutoForward'
      }),
      returnButton: new RoundedButtonControl('returnButton', this.translateService, {
        label: `${this.translateService.instant('return')}`,
        layoutClass: 'p-col-2',
        styleClass: ['ConfirmButton'],
        rendered: this.showReturnButton(),
        key: 'return'
      }),
        cancelButton: new RoundedButtonControl('cancelButton', this.translateService, {
        label: `${this.translateService.instant('cancel')}`,
        layoutClass: 'p-col-2',
        styleClass: ['ConfirmButton'],
        rendered: this.showCancelButton(),
        key: 'cancel'
      }),
      closeButton: new RoundedButtonControl('closeButton', this.translateService, {
        label: `${this.translateService.instant('Close')}`,
        layoutClass: 'p-col-2',
        styleClass: ['ConfirmButton'],
        rendered: this.showCloseButton(),
        key: 'close'
      }),
      saveButton: new RoundedButtonControl('saveButton', this.translateService, {
        label: `${this.translateService.instant('save')}`,
        layoutClass: 'p-col-2',
        styleClass: ['ConfirmButton'],
        rendered: this.showSaveButton(),
        key: 'save'
      }),
        NoButtonTertiary: new RoundedButtonControl('noButtonTertiary', this.translateService, {
        label: `${this.translateService.instant('no')}`,
        layoutClass:'p-col-10',
        styleClass: ['tertiaryButton'],
        rendered: this.showNoButtonTertiary(),
        key: 'No'
      }),
        yesButtonPrimary: new RoundedButtonControl('yesButtonPrimary', this.translateService, {
        label: `${this.translateService.instant('yes')}`,
        layoutClass:'p-col-2',
        styleClass: ['ConfirmButton'],
        rendered: this.showYesButtonPrimary(),
        key: 'Yes'
      }),
        cancelButtonTertiary: new RoundedButtonControl('cancelButton', this.translateService, {
        label: `${this.translateService.instant('cancel')}`,
        layoutClass: 'p-col-9',
        styleClass: ['tertiaryButton'],
        rendered: this.showCancelButtonTertiary(),
        key: 'cancel'
      }),
        sendReminderButtonPrimary: new RoundedButtonControl('sendReminderButtonPrimary', this.translateService, {
        label: `${this.translateService.instant('SEND_REMINDER')}`,
        layoutClass:'p-col-3',
        styleClass: ['ConfirmButton'],
        rendered: this.showSendReminderButtonPrimary(),
        key: 'Yes'
      })
    });
  }

  onClickReturnButton() {
    setTimeout(() => {
    this.dialogRef.close('return');
    }, 400);
  }

  showReturnButton() {
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showReturnButton !== undefined
      && this.dynamicDialogConfig.data.showReturnButton !== null ) {
        return this.dynamicDialogConfig.data.showReturnButton;
    } else {
      return false;
    }
  }

  showSpacer() {
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showSpacer !== undefined
      && this.dynamicDialogConfig.data.showSpacer !== null ) {
        return this.dynamicDialogConfig.data.showSpacer;
    } else {
      return false;
    }
  }
  showAutoForwardButton() {
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showAutoForwardButton !== undefined
      && this.dynamicDialogConfig.data.showAutoForwardButton !== null ) {
        return this.dynamicDialogConfig.data.showAutoForwardButton;
    } else {
      return false;
    }
  }

  showCloseButton() {
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showCloseButton !== undefined
      && this.dynamicDialogConfig.data.showCloseButton !== null ) {
        return this.dynamicDialogConfig.data.showCloseButton;
    } else {
      return false;
    }
  }

  onClickAutoForwardButton() {
    setTimeout(() => {
    this.dialogRef.close('autoForward');
    }, 400);
  }

  onClickCloseButton() {
    setTimeout(() => {
    this.dialogRef.close('close');
    }, 400);
  }

  addAccessibilityControl(): void {
    const titleBarCloseList = Array.from(document.getElementsByClassName('ui-dialog-titlebar-close'));
    titleBarCloseList.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant('close');
      element[FccGlobalConstant.TITLE] = this.translateService.instant('close');
    });    
  }

  getEditModeUrl() {
    for (this.index = 0; this.index < this.modeValue.length; this.index++) {
      if (this.modeValue[this.index].indexOf('option') === 0) {
        this.option = this.modeValue[this.index].split('=').pop();
      }
    }
  }

  onClickSaveForLaterButton() {
    setTimeout(() => {
    this.dialogRef.close('saveForLater');
    }, 400);
  }

  onClickYesButton() {
    setTimeout(() => {
    this.dialogRef.close('yes');
    }, 400);
  }

  onClickNoButton() {
    setTimeout(() => {
    this.dialogRef.close('no');
    }, 400);
  }

  onClickSaveButton() {
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

  onClickOkButton() {
    setTimeout(() => {
      this.dialogRef.close('ok');
      }, 400);
  }

  onClickCancelButton() {
    setTimeout(() => {
      this.dialogRef.close('cancel');
      }, 400);
  }

  onClickCancelButtonTertiary() {
    setTimeout(() => {
      this.dialogRef.close('cancel');
      }, 400);
  }

  onClickYesButtonPrimary() {
    setTimeout(() => {
    this.dialogRef.close('yes');
    }, 400);
  }

  onClickSendReminderButtonPrimary() {
    setTimeout(() => {
    this.dialogRef.close('yes');
    }, 400);
  }

  onClickNoButtonTertiary() {
    setTimeout(() => {
    this.dialogRef.close('no');
    }, 400);
  }

  showYesButton(): boolean{
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showYesButton !== undefined
      && this.dynamicDialogConfig.data.showYesButton !== null ) {
        return this.dynamicDialogConfig.data.showYesButton;
      } else { return true; }
  }

  showNoButton(): boolean{
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showNoButton !== undefined
      && this.dynamicDialogConfig.data.showNoButton !== null ) {
        return this.dynamicDialogConfig.data.showNoButton;
      } else { return true; }
  }

  showOkButton(): boolean{
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showOkButton !== undefined
      && this.dynamicDialogConfig.data.showOkButton !== null ) {
        return this.dynamicDialogConfig.data.showOkButton;
      } else { return false; }
  }

  showCancelButton(): boolean{
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showCancelButton !== undefined
      && this.dynamicDialogConfig.data.showCancelButton !== null ) {
        return this.dynamicDialogConfig.data.showCancelButton;
      } else { return false; }
  }

  showCancelButtonTertiary(): boolean{
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showCancelButtonTertiary !== undefined
      && this.dynamicDialogConfig.data.showCancelButtonTertiary !== null ) {
        return this.dynamicDialogConfig.data.showCancelButtonTertiary;
      } else { return false; }
  }

  showSaveButton(): boolean{
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showSaveButton !== undefined
      && this.dynamicDialogConfig.data.showSaveButton !== null ) {
        return this.dynamicDialogConfig.data.showSaveButton;
      } else { return false; }
  }

  showYesButtonPrimary(): boolean{
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showYesButtonPrimary !== undefined
      && this.dynamicDialogConfig.data.showYesButtonPrimary !== null ) {
        return this.dynamicDialogConfig.data.showYesButtonPrimary;
      } else { return false; }
  }

  showNoButtonTertiary(): boolean{
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showNoButtonTertiary !== undefined
      && this.dynamicDialogConfig.data.showNoButtonTertiary !== null ) {
        return this.dynamicDialogConfig.data.showNoButtonTertiary;
      } else { return false; }
  }

  showSendReminderButtonPrimary(): boolean{
    if (this.dynamicDialogConfig.data !== undefined && this.dynamicDialogConfig.data.showSendReminderButtonPrimary !== undefined
      && this.dynamicDialogConfig.data.showSendReminderButtonPrimary !== null ) {
        return this.dynamicDialogConfig.data.showSendReminderButtonPrimary;
      } else { return false; }
  }
}
