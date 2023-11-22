import { Component, OnInit, HostListener } from '@angular/core';
import { FCCBase } from '../../../base/model/fcc-base';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { TextControl, ButtonControl, SpacerControl } from '../../../base/model/form-controls.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { CheckTimeoutService } from '../../services/check-timeout-service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { SessionValidateService } from '../../services/session-validate-service';
import { LogoutService } from '../../services/logout-service';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { LogoutRequest } from '../../model/logout-request';
import { ResponseService } from '../../services/response.service';
import { UserData } from '../../model/user-data';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'fcc-common-session-warning-dialog',
  templateUrl: './session-warning-dialog.component.html',
  styleUrls: ['./session-warning-dialog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SessionWarningDialogComponent }]
})
export class SessionWarningDialogComponent extends FCCBase implements OnInit {

  module: string;
  form: FCCFormGroup;
  dir: string = localStorage.getItem('langDir');
  responseMessage;
  logoutRequest: LogoutRequest = new LogoutRequest();
  contextPath: any;
  logoFilePath: string;
  homeUrl: string;
  userData: UserData = new UserData();
  params = FccGlobalConstant.PARAMS;
  rendered = FccGlobalConstant.RENDERED;

  constructor( protected translateService: TranslateService,
               public dialogRef: DynamicDialogRef,
               protected checkTimeoutService: CheckTimeoutService,
               protected router: Router,
               protected commonService: CommonService,
               protected sessionValidation: SessionValidateService,
               protected logoutService: LogoutService,
               protected fccGlobalConstantService: FccGlobalConstantService,
               protected responseService: ResponseService) {
    super();
   }

  ngOnInit() {
    this.initializeFormGroup();
    const idleFlag = this.commonService.getSessionFlag('idleFlag');
    const alertFlag = this.commonService.getSessionFlag('sessionAlertFlag');
    const maxFlag = this.commonService.getSessionFlag('sessionMaxFlag');
    this.initializeIdleSessionTimeOut(idleFlag);
    this.commonService.putSessionFlag('idleFlag', 'false');
    this.initializeAlertSessionTimeOut(alertFlag);
    this.commonService.putSessionFlag('alertFlag', 'false');
    this.initializeMaxSessionTimeOut(maxFlag);
    this.commonService.putSessionFlag('maxFlag', 'false');
    this.commonService.addTitleBarCloseButtonAccessibilityControl();
  }

  initializeFormGroup() {
    this.form = new FCCFormGroup({
        IdleWarningMsg: new TextControl('IdleWarningMsg', this.translateService, {
        label: `${this.translateService.instant('idleWarningMsg')}`,
        layoutClass: 'p-col-12',
        styleClass: ['dialogMessage'],
        rendered: false
        }),
        SessionAlertWarningMsg: new TextControl('SessionAlertWarningMsg', this.translateService, {
          label: `${this.translateService.instant('SessionAlertWarningMsg')}`,
          layoutClass: 'p-col-12',
          styleClass: ['dialogMessage'],
          rendered: false
        }),
        SessionMaxWarningMsg: new TextControl('SessionMaxWarningMsg', this.translateService, {
          label: `${this.translateService.instant('SessionMaxWarningMsg')}`,
          layoutClass: 'p-col-12',
          styleClass: ['dialogMessage'],
          rendered: false
        }),
        spacer1: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),
        IdleLogoutButton: new ButtonControl('IdleLogoutButton', this.translateService, {
          label: `${this.translateService.instant('IdleLogout')}`,
          layoutClass: 'p-col-10',
          styleClass:  this.dir === 'rtl' ? 'tertiaryButton leftDirect' : 'tertiaryButton rightDirect',
          rendered: false,
          key: 'IdleLogout'
        }),
        IdleOkButton: new ButtonControl('IdleOkButton', this.translateService, {
        label: `${this.translateService.instant('IdleOk')}`,
        layoutClass: 'p-col-2',
        styleClass: this.dir === 'rtl' ? 'primaryButton leftDirect' : 'primaryButton rightDirect',
        rendered: false,
        key: 'IdleOk'
      }),
        SessionAlertOkButton: new ButtonControl('SessionAlertOkButton', this.translateService, {
        label: `${this.translateService.instant('SessionAlertOkButton')}`,
        layoutClass: 'p-col-12',
        styleClass:   this.dir === 'rtl' ? 'primaryButton session leftDirect' : 'primaryButton session rightDirect',
        rendered: false,
        key: 'SessionAlertOkButton'
      }),
        SessionMaxOkButton: new ButtonControl('SessionMaxOkButton', this.translateService, {
        label: `${this.translateService.instant('SessionMaxOkButton')}`,
        layoutClass: 'p-col-12',
        styleClass:   this.dir === 'rtl' ? 'primaryButton session leftDirect' : 'primaryButton session rightDirect',
        rendered: false,
        key: 'SessionMaxOkButton'
      }),
    });
  }

  onClickIdleOkButton() {
    this.checkTimeoutService.reset();
    this.dialogRef.close();
  }

  async onClickIdleLogoutButton() {
    this.Config();
    let flag = true;
    this.logoutRequest.userData = this.userData;
    this.logoutRequest.requestData = null;
    this.logoutRequest.userData.company = null;
    this.logoutRequest.userData.username = null;
    this.logoutRequest.userData.userSelectedLanguage = null;
    await this.logoutService
      .logoutUser(
        this.fccGlobalConstantService.getLogoutUrl(),
        this.logoutRequest
      )
      .toPromise().then(data => {
          this.responseMessage = data.message;
          this.responseService.setResponseMessage(data.message);
          this.commonService.setOnDemandTimedLogout(true);
          localStorage.removeItem('language');
          localStorage.removeItem('langDir');
          localStorage.removeItem('form-dirty');
          localStorage.removeItem('formDestroy');
          localStorage.removeItem('isLanguagedChangedFlag');
          sessionStorage.removeItem('chatbot');
          sessionStorage.removeItem('dojoAngularSwitch');
          sessionStorage.removeItem('baseCurrency');
          sessionStorage.removeItem('logInCheck');
          sessionStorage.removeItem('login');
          sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
          this.commonService.clearCachedData();
          flag = false;
          this.router.navigate(['/logout']);
      });
    const logInCheck = await this.commonService.checkLoggedIn();
    if (!logInCheck && flag){
      this.router.navigate(['/logout']);
    }
    this.dialogRef.close();
  }

  Config() {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.logoFilePath = this.contextPath + response.logoFilePath;
        this.homeUrl = response.homeUrl;
      }
    });
  }

  onClickSessionAlertOkButton() {
    this.dialogRef.close();
  }

  onClickSessionMaxOkButton() {
   this.Config();
   this.logoutRequest.userData = this.userData;
   this.logoutRequest.requestData = null;
   this.logoutRequest.userData.company = null;
   this.logoutRequest.userData.username = null;
   this.logoutRequest.userData.userSelectedLanguage = null;
   this.logoutService
      .logoutUser(
        this.fccGlobalConstantService.getLogoutUrl(),
        this.logoutRequest
      )
      .subscribe(data => {
          this.responseMessage = data.message;
          this.responseService.setResponseMessage(data.message);
          this.commonService.setOnDemandTimedLogout(true);
          localStorage.removeItem('language');
          localStorage.removeItem('langDir');
          localStorage.removeItem('isLanguagedChangedFlag');
          sessionStorage.removeItem('chatbot');
          sessionStorage.removeItem('dojoAngularSwitch');
          sessionStorage.removeItem('baseCurrency');
          sessionStorage.removeItem('logInCheck');
          sessionStorage.removeItem('login');
          sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
          this.commonService.clearCachedData();
          this.router.navigate(['/logout']);
          this.router.navigate(['/login']);
          window.location.reload();
      });
   this.dialogRef.close();
  }

  initializeIdleSessionTimeOut(idleFlag) {
    if (idleFlag === 'true') {
      this.patchFieldParameters(this.form.get('IdleWarningMsg'), { rendered: true });
      this.patchFieldParameters(this.form.get('IdleOkButton'), { rendered: true });
      this.patchFieldParameters(this.form.get('IdleLogoutButton'), { rendered: true });
    }
  }

  initializeAlertSessionTimeOut(alertFlag) {
    if (alertFlag === 'true') {
      const value1 = this.form.get('IdleWarningMsg')[this.params][this.rendered];
      const value2 = this.form.get('IdleOkButton')[this.params][this.rendered];
      const value3 = this.form.get('IdleLogoutButton')[this.params][this.rendered];
      if (value1 === true) {
        this.patchFieldParameters(this.form.get('IdleWarningMsg'), { rendered: false });
      }
      if (value2 === true) {
        this.patchFieldParameters(this.form.get('IdleOkButton'), { rendered: false });
      }
      if (value3 === true) {
        this.patchFieldParameters(this.form.get('IdleLogoutButton'), { rendered: false });
      }
      this.patchFieldParameters(this.form.get('SessionAlertWarningMsg'), { rendered: true });
      this.patchFieldParameters(this.form.get('SessionAlertOkButton'), { rendered: true });
    }
  }

  initializeMaxSessionTimeOut(maxFlag) {
    if (maxFlag === 'true') {
      const value1 = this.form.get('SessionAlertWarningMsg')[this.params][this.rendered];
      const value2 = this.form.get('SessionAlertOkButton')[this.params][this.rendered];
      if (value1 === true) {
        this.patchFieldParameters(this.form.get('SessionAlertWarningMsg'), { rendered: false });
      }
      if (value2 === true) {
        this.patchFieldParameters(this.form.get('SessionAlertOkButton'), { rendered: false });
      }
      this.patchFieldParameters(this.form.get('SessionMaxWarningMsg'), { rendered: true });
      this.patchFieldParameters(this.form.get('SessionMaxOkButton'), { rendered: true });
    }
  }

  @HostListener('document:keydown.escape') onKeydownHandler() {
    this.onDialogClose();
  }

  onDialogClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    const value = this.commonService.openSessionWarningDialog$.value;
    if (value === 'idleFlag') { // Ideal
      this.commonService.putSessionFlag('idleFlag', 'false');
    } else if (value === 'sessionAlertFlag') { // Session
      this.commonService.putSessionFlag('sessionAlertFlag', 'false');
    } else if (value === 'sessionMaxFlag') { // MaxSession
      this.commonService.putSessionFlag('sessionMaxFlag', 'false');
      this.checkTimeoutService.sessionLogin();
    }
  }
}
