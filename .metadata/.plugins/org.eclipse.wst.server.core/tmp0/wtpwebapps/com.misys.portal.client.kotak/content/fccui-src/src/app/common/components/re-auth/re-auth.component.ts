import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';

import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';
import { FormModelService } from '../../services/form-model.service';
import { ReauthService } from '../../services/reauth.service';
import { FCCBase } from './../../../base/model/fcc-base';
import { FCCFormGroup } from './../../../base/model/fcc-control.model';
import { filter, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-re-auth',
  templateUrl: './re-auth.component.html',
  styleUrls: ['./re-auth.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ReAuthComponent }]
})
export class ReAuthComponent extends FCCBase implements OnInit {

  constructor(protected formControlService: FormControlService, protected translateService: TranslateService,
              protected dynamicDialogConfig: DynamicDialogConfig, protected dynamicDialogRef: DynamicDialogRef,
              protected reauthService: ReauthService, protected formModelService: FormModelService,
              protected commonService: CommonService, protected router: Router) {
    super();
    router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart),
      tap(() => this.dynamicDialogRef.close()),
      take(1),
    ).subscribe();
  }
  readonly PARAMS = 'params';
  readonly LABEL = 'label';
  readonly STYLE_CLASS = 'styleClass';
  readonly LAYOUT_CLASS = 'layoutClass';
  readonly ERROR_MSG = 'errorMsg';
  readonly RENDERED = 'rendered';
  readonly REAUTH_KEY = 'reAuthKey';
  readonly BTN_DISABLE = 'btndisable';
  readonly RESEND_OTP = 'resendOTP';
  readonly REAUTH_TIMER = 'reauthTimer';
  readonly OTP_MESSAGE = 'otpMessage';
  readonly VALIDATE_BTN = 'validateBtn';
  readonly VALUE = 'value';
  readonly MAX_LENGTH = 'maxlength';


  form: FCCFormGroup;
  module = ``;
  reSendOTPMaxCount: number; // Maximum number of times OTP can be submitted
  language = localStorage.getItem('language');

  ngOnInit(): void {
    this.getConfigurations();
    this.initializeFormGroup();
    this.reauthService.timeOver.subscribe(data => {
      if (data) {
        this.timerOver();
      }
    });
    this.reauthService.restartTimer.subscribe(data => {
      if (data) {
        this.form.get(this.REAUTH_KEY).enable();
        this.form.get(this.VALIDATE_BTN)[this.PARAMS][this.BTN_DISABLE] = false;
      }
    });
    this.reauthService.errorNotifier.subscribe(flag => {
      if (flag) {
        this.form.get(this.ERROR_MSG)[this.PARAMS][this.RENDERED] = true;
        this.form.get(this.ERROR_MSG).patchValue(this.reauthService.errorMsg);
        this.form.updateValueAndValidity();
      }
    });
    this.reauthService.closeDialogBox$.subscribe(data => {
      if (data) {
        this.onDialogClose();
      }
    });
  }

  getConfigurations() {
    this.reauthService.getConfigurationValue('RESEND_OTP_MAX_COUNT').subscribe(count => {
      this.reSendOTPMaxCount = count;
    });
  }

  initializeFormGroup() {
    this.formModelService.getSubSectionModelAPI().subscribe(model => {
      const dialogmodel = model[FccGlobalConstant.RE_AUTH_MODEL];
      this.form = this.formControlService.getFormControls(dialogmodel);
      this.setReauthLength();
      this.configureReAuth();
    });
  }

  setReauthLength() {
    if (this.reauthService.reauthenticationModeType === this.reauthService.OTP) {
      this.reauthService.getConfigurationValue('OTP_MAX_LENGTH').subscribe(length => {
        this.form.get(this.REAUTH_KEY)[this.PARAMS][this.MAX_LENGTH] = length;
      });
    }
  }

  configureReAuth() {
    if (this.reauthService.reauthenticationModeType === this.reauthService.PASSWORD) {
      this.form.get(this.OTP_MESSAGE)[this.PARAMS][this.LABEL] = (`${this.translateService.instant('password_verification')}`);
      if (this.language === FccGlobalConstant.LANGUAGE_AR) {
        const existingStyle = this.form.get(this.OTP_MESSAGE)[this.PARAMS][this.STYLE_CLASS];
        this.form.get(this.OTP_MESSAGE)[this.PARAMS][this.STYLE_CLASS] = existingStyle + ' messageArabic';
        this.form.get(this.VALIDATE_BTN)[this.PARAMS][this.STYLE_CLASS] = 'validateBtnArabic';
        this.form.get(this.REAUTH_KEY)[this.PARAMS][this.LAYOUT_CLASS] = 'p-col-12';
      }
      this.form.get(this.REAUTH_TIMER)[this.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(this.RESEND_OTP)[this.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(this.REAUTH_KEY)[this.PARAMS][this.LABEL] = (`${this.translateService.instant('password')}`);
    } else if (this.reauthService.reauthenticationModeType === this.reauthService.OTP) {
      this.form.get(this.OTP_MESSAGE)[this.PARAMS][this.LABEL] = `${this.translateService.instant('otp_verification')}`;
    } else if (this.reauthService.reauthenticationModeType === this.reauthService.NO_REAUTH) {
      this.form.get(this.OTP_MESSAGE)[this.PARAMS][this.RENDERED] = false;
    }
  }

  onDialogClose() {
    this.reauthService.isReauthDialogBoxOpen = false;
    this.dynamicDialogRef.close();
  }

  onKeyupReAuthKey() {
    this.clearErrorMSg();
  }

  onClickResendOTP() {
    this.clearErrorMSg();
    if (this.reauthService.logout) {
      this.onDialogClose();
    } else {
      this.reauthService.generateReauthenticationCodeAPI();
      this.reSendOTPMaxCount--;
      if (this.reSendOTPMaxCount === 0) {
        this.disablePopUp();
        this.form.get(this.ERROR_MSG)[this.PARAMS][this.RENDERED] = true;
        this.form.get(this.ERROR_MSG).patchValue(this.translateService.instant('maxOtpResendError'));
        this.form.updateValueAndValidity();
      }
    }
  }

  onClickValidateBtn() {
    if (!this.form.controls[this.REAUTH_KEY].value) {
      this.form.get(this.REAUTH_KEY).markAsTouched();
      return;
    }
    this.clearErrorMSg();
    if (this.reauthService.logout) {
      this.onDialogClose();
    } else {
      if (this.reauthService.click) {
        this.reauthService.click = false;
        const reauthKey = this.form.controls[this.REAUTH_KEY].value ? this.form.controls[this.REAUTH_KEY].value : undefined;
        this.reauthService.handleSubmitTransaction(reauthKey);
      }
    }
  }


  disablePopUp() {
    this.form.get(this.RESEND_OTP)[this.PARAMS][this.BTN_DISABLE] = true;
  }

  timerOver() {
    this.reauthService.timeOver.next(false);
    this.form.get(this.VALIDATE_BTN)[this.PARAMS][this.BTN_DISABLE] = true;
    this.form.get(this.REAUTH_KEY).disable();
  }

  clearErrorMSg() {
    this.form.get(this.ERROR_MSG).patchValue('');
    this.form.updateValueAndValidity();
  }

  logout() {
    localStorage.removeItem('language');
    localStorage.removeItem('langDir');
    localStorage.removeItem('form-dirty');
    localStorage.removeItem('formDestroy');
    sessionStorage.removeItem('chatbot');
    sessionStorage.removeItem('dojoAngularSwitch');
    sessionStorage.removeItem('baseCurrency');
    sessionStorage.removeItem('logInCheck');
    sessionStorage.removeItem('login');
    sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    this.commonService.clearCachedData();
    this.reauthService.logout = false;
    this.router.navigate(['/logout']);
  }

  ngOnDestroy() {
    if (this.reauthService.logout) {
      this.logout();
    }
    this.reauthService.timeOver.next(false);
    this.reauthService.restartTimer.next(false);
    this.reauthService.errorNotifier.next(false);
    this.reauthService.closeDialogBox$.next(false);
    this.commonService.isSubmitAllowed.next(true);
    this.commonService.isCommentSectionBtnEnabled.next(true);
    this.commonService.isApproveAllowed.next(true);
    this.reauthService.click = true;
  }
}
