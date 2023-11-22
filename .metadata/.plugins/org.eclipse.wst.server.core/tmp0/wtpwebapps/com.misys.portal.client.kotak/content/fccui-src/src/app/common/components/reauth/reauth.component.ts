
import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ReauthService } from '../../services/reauth.service';
import { SeveralSubmitService } from '../../services/several-submit.service';

@Component({
  selector: 'fcc-common-reauth',
  templateUrl: './reauth.component.html',
  styleUrls: ['./reauth.component.scss']
})
export class ReauthComponent implements OnInit {

  authKey = '12345';
  validationError = 'reauthenticationFailed';
  displayError: boolean;
  reauthEnabled: boolean;
  dir: string;
  errorHeader = `${this.translateService.instant('errorTitle')}`;

  constructor(protected dynamicDialogRef: DynamicDialogRef,
              protected dynamicDialogConfig: DynamicDialogConfig,
              protected reauthService: ReauthService,
              protected severalSubmitService: SeveralSubmitService,
              protected translateService: TranslateService) { }

  ngOnInit() {
    this.dir = localStorage.getItem('langDir') ? localStorage.getItem('langDir') : 'ltr';
    // this.displayError = false;
    // this.reauthEnabled = this.reauthService.reauthEnabled();
    // if (this.reauthEnabled === false) {
    //   this.validateSuccess();
    // }
  }

  validate(authInput) {
    if (authInput.value === this.authKey) {
      this.validateSuccess();
    } else {
      this.displayError = true;
      authInput.value = '';
    }
  }

  validateSuccess() {
    // this.onDialogClose();
    // this.reauthService.doReauthentication();
    // if (this.dynamicDialogConfig.data.action === FccGlobalConstant.SUBMIT) {
    //   this.reauthService.submitTransaction(this.dynamicDialogConfig.data);
    // }
    // if (this.dynamicDialogConfig.data.action === FccGlobalConstant.APPROVE) {
    //   this.reauthService.approveTransaction(this.dynamicDialogConfig.data);
    // }
    // if (this.dynamicDialogConfig.data.action === FccGlobalConstant.RETURN) {
    //   this.reauthService.returnTransaction(this.dynamicDialogConfig.data);
    // }
    // if (this.dynamicDialogConfig.data.action === FccGlobalConstant.SEVERAL_SUBMIT) {
    //   this.severalSubmitService.severalSubmitTransaction(this.dynamicDialogConfig.data);
    // }
    // this.reauthService.cancelReauthentication();
  }

  @HostListener('document:keydown.escape') onKeydownHandler() {
    this.onDialogClose();
  }

  onDialogClose() {
    this.dynamicDialogRef.close();
  }

  @HostListener('paste', ['$event'])
  blockPaste(e: Event) {
    e.preventDefault();
  }
}
