import { Component, OnInit, ViewChild } from '@angular/core';
import { FCCBase } from './../../../base/model/fcc-base';
import { FCCFormGroup } from './../../../base/model/fcc-control.model';
import {
  TextControl,
  RoundedButtonControl,
  SelectButtonControl,
  ButtonControl,
  SpacerControl,
  InputPasswordControl,
  ImageFormControl
} from './../../../base/model/form-controls.model';
import { CommonService } from '../../services/common.service';
import { SessionValidateService } from '../../services/session-validate-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { interval } from 'rxjs';
import { FccGlobalConfiguration } from '../../core/fcc-global-configuration';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { Validators } from '@angular/forms';
import { validOtpChecker } from '../../../corporate/common/validator/ValidationKeys';
import { LoginService } from '../../services/login.service';
import { EncryptionService } from '../../services/encrypt.service';
import { CheckTimeoutService } from '../../services/check-timeout-service';
import { PlatformLocation } from '@angular/common';
import { RetrieveCredentialsService } from '../../retrievecredential/services/retrieve-credentials.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ResetPasswordRequestData } from '../../retrievecredential/model/retrieveCredentialsReqData';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { ConfirmationDialogComponent } from '../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
    selector: 'fcc-common-login-auth',
    templateUrl: './login-auth.component.html',
    styleUrls: ['./login-auth.component.scss'],
    providers: [{ provide: HOST_COMPONENT, useExisting: LoginAuthComponent }]
})
export class LoginAuthComponent extends FCCBase implements OnInit {

  form: FCCFormGroup;
  title: any;
  module = '';
  dir: string = localStorage.getItem('langDir');
  observable: any;
  authMode: string[] = [];
  maxPassLength: number;
  selectedChannelMode: string;
  otpCount = 0;
  otpSubmittedCount = 0;
  maxOtpCount: number;
  otpExpireTimer: number;
  data: any;
  userSelectedLanguage: string;
  userEmail: string;
  userMobile: string;
  plainPass: any;
  configuredKeysList = 'RESEND_OTP_MAX_COUNT,OTP_EXPIRE_TIMEOUT,OTP_MAX_LENGTH,OTP_CHANNEL_MODE';
  FA_FA_CHECK_CIRCLE = 'fa fa-check-circle fa-2x';
  keysNotFoundList: any[] = [];
  otpTimeExpired: boolean;
  @ViewChild('loginAuth') public loginAuth: any;
  loginData: any;
  contextPath: any;
  validateLoginMode: string;
  resetPasswordData: ResetPasswordRequestData;
  otpSendMode: string;
  otpValidateMode: string;
  otpOnload = false;
  isRendered = true;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router,
              protected fccGlobalConfiguration: FccGlobalConfiguration, protected fccGlobalConstantService: FccGlobalConstantService,
              protected loginService: LoginService, protected encryptionService: EncryptionService,
              protected checkTimeoutService: CheckTimeoutService, protected location: PlatformLocation,
              protected retrieveCredentialsService: RetrieveCredentialsService, public dialogService: DialogService) {
    super();
    loginService.preLoginBackBtnCheck(location);
  }

  ngOnInit() {
    this.loginService.checkValidSession(this.commonService.getLoginMode().get('LOGIN_MODE'));
    this.keysNotFoundList = this.configuredKeysList.split(',');
    if (this.keysNotFoundList.length !== 0) {
      if (this.commonService.getOtpAuthScreenSource() === FccGlobalConstant.PASSWORD_RESET) {
        this.resetPasswordData = this.commonService.getResetPasswordData();
        this.userEmail = this.resetPasswordData.details.email;
        this.otpSendMode = this.resetPasswordData.mode;
        this.otpOnload = true;
      } else {
      this.data = this.commonService.getLogindata();
      this.loginData = this.data.get('FCC_LOGIN_DATA');
      this.loginData.mode = this.commonService.getLoginMode().get('LOGIN_MODE');
      this.loginData.email = this.data.get('USER_EMAIL');
      this.userEmail = this.data.get('USER_EMAIL');
      this.userMobile = this.data.get('USER_PHONE');
      }
      let maskedEmail = [];
      maskedEmail = this.userEmail.split('@');
      const firstEmailPart: string = maskedEmail[0];
      let maskEmailPart = '';
      for (let i = 0; i < firstEmailPart.length; i++) {
        if (i === 0 || i === firstEmailPart.length - 1 || i === firstEmailPart.length - FccGlobalConstant.LENGTH_2) {
          maskEmailPart = maskEmailPart.concat(firstEmailPart[i]);
          continue;
        }
        maskEmailPart = maskEmailPart.concat('*');
      }
      maskedEmail[0] = maskEmailPart;
      this.userEmail = maskedEmail[0] + '@' + maskedEmail[1];
      if (this.userMobile !== undefined) {
        const maskMobile = '********' + this.userMobile.charAt(this.userMobile.length - FccGlobalConstant.LENGTH_2)
                                      + this.userMobile.charAt(this.userMobile.length - 1);
        this.userMobile = maskMobile;
      }
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response) {
          this.maxPassLength = response.OTP_MAX_LENGTH;
          this.maxOtpCount = response.RESEND_OTP_MAX_COUNT;
          this.otpExpireTimer = response.OTP_EXPIRE_TIMEOUT;
          this.authMode = response.OTP_CHANNEL_MODE.split(',');
          this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
          this.contextPath = this.fccGlobalConstantService.contextPath;
          this.commonService.loadDefaultConfiguration().subscribe(res => {
            if (res) {
              this.intializeForm();
              this.patchFieldParameters(this.form.get('logoImage'), { path: this.contextPath + res.logoFilePath });
              this.patchFieldParameters(this.form.get('logoImage'), { homeUrl: res.homeUrl });
              this.patchFieldParameters(this.form.get('logoImage'), { altText: this.translateService.instant('FinastraLoginImage') });
            }
          });
        }
      });
    }
  }

  getLoginData() {
    return this.loginData;
  }

  intializeForm() {
    this.initializeFormGroup();
    this.showNoUserEmail();
    this.updateValidations();
    if (this.authMode.length > 1) {
      this.showAvailableModes();
      this.form.updateValueAndValidity();
    } else {
      this.selectedChannelMode = this.authMode[0];
      this.onClickChannelMode(this.selectedChannelMode);
    }
  }

  showAvailableModes() {
    this.patchFieldParameters(this.form.get('authenticationText'), { rendered: true });
    this.patchFieldParameters(this.form.get('authChannelText'), { rendered: true });
    this.patchFieldParameters(this.form.get('channelMode'), { rendered: true });
  }

  showNoUserEmail() {
    if (this.commonService.isEmptyValue(this.userEmail)) {
      this.patchFieldParameters(this.form.get('noUserEmail'), { rendered: true });
      this.patchFieldParameters(this.form.get('authenticationText'), { rendered: false });
      this.patchFieldParameters(this.form.get('otpVerificationHeader'), { rendered: false });
      this.form.updateValueAndValidity();
    }
  }

  initializeFormGroup() {
    this.form = new FCCFormGroup({
      spacer0: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),
      logoImage: new ImageFormControl('logoImage', this.translateService,
        {
          layoutClass: 'p-col-12 no-mr-pd logo-img logo-grid paddingb',
          anchorNeeded: true,
          rendered: true
      }),
      spacer1: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),
      spacer2: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),
      authenticationText: new TextControl('authenticationText', this.translateService, {
        label: `${this.translateService.instant('otpAuthHeader')}`,
        layoutClass: 'p-col-12',
        styleClass: ['authHeader'],
        rendered: true
      }),
      noUserEmail: new TextControl('noUserEmail', this.translateService, {
        label: `${this.translateService.instant('noUserEmail')}`,
        layoutClass: 'p-col-12',
        styleClass: ['noUserEmail'],
        rendered: false
      }),
      authChannelText: new TextControl('authChannelText', this.translateService, {
        label: `${this.translateService.instant('otpChannelMode')}`,
        layoutClass: 'p-col-12',
        styleClass: ['textMessage'],
        rendered: false
      }),
      channelMode: new SelectButtonControl('channelMode', '', this.translateService, {
        label: `${this.translateService.instant('channelMode')}`,
        options: this.getRequestTypeArray(),
        rendered: false,
        styleClass: ['transmission'],
        layoutClass: 'p-grid p-col-12',
        matIcon: 'check_circle'
      }),
      otpVerificationHeader: new TextControl('otpVerificationHeader', this.translateService, {
        label: `${this.translateService.instant('otpVerifHeader')}`,
        layoutClass: 'p-col-12',
        styleClass: ['otpHeader'],
        rendered: true
      }),
      otpInputText: new TextControl('otpInputText', this.translateService, {
        label: '',
        layoutClass: 'p-col-12',
        styleClass: ['otpMessage'],
        rendered: false
      }),
      enteredOtp: new InputPasswordControl('enteredOtp', '', this.translateService, {
        label: `${this.translateService.instant('otpInput')}`,
        styleClass: 'margin-side',
        layoutClass: 'p-col-6 p-md-6 p-lg-6 p-sm-12 leftwrapper',
        rendered: false,
        required: false,
        maxlength: this.maxPassLength,
        newPassword: true,
        hintText: `${this.translateService.instant('otpHintText')}` + this.maxPassLength + `${this.translateService.instant('digits')}`
      }),
      otpTimer: new TextControl('otpTimer', this.translateService, {
        label: '',
        layoutClass: 'p-col-6',
        styleClass: ['otpTimer'],
        rendered: false
      }),
      resendOtpBtn: new ButtonControl('resendOtpBtn', this.translateService, {
        key: 'resendOtpBtn',
        label: `${this.translateService.instant('otpResendBtn')}`,
        layoutClass: 'p-col-4',
        btndisable: false,
        styleClass: this.dir === 'ltr' ? 'tertiaryButton leftDirectResBtn' : 'tertiaryButton rightDirectResBtn',
        rendered: false
      }),
      backToLoginbtn: new RoundedButtonControl('backToLoginbtn', this.translateService, {
        key: 'backToLoginbtn',
        label: 'Back',
        rendered: false,
        btndisable: false,
        layoutClass: 'p-col-4',
        styleClass: this.dir === 'ltr' ? 'tertiaryButton leftDirectBackBtn' : 'tertiaryButton rightDirectBackBtn',
      }),
      submitBtn: new RoundedButtonControl('submitBtn', this.translateService, {
      label: `${this.translateService.instant('submit')}`,
      layoutClass: 'p-col-4',
      styleClass: this.dir === 'ltr' ? 'primaryButton leftDirectSubBtn' : 'primaryButton rightDirectSubBtn',
      rendered: false,
      btndisable: true,
      key: 'submit'
    })
    });

    this.form.statusChanges.subscribe(
      status => {
        if (status === FccGlobalConstant.VALID && this.otpTimeExpired === false) {
          this.patchFieldParameters(this.form.get('submitBtn'), { btndisable: false });
        } else {
          this.patchFieldParameters(this.form.get('submitBtn'), { btndisable: true });
        }
      }
    );
  }

  getRequestTypeArray() {
    let requestTypeArr;
    if (this.authMode.length === 1 && this.authMode[0] === 'email') {
        requestTypeArr = [
        { label: `${this.translateService.instant('emailMode')}`, value: 'email', icon: this.FA_FA_CHECK_CIRCLE }
      ];
    } else if (this.authMode.length === 1 && this.authMode[0] === 'mobile') {
        requestTypeArr = [
        { label: `${this.translateService.instant('mobileMode')}`, value: 'mobile', icon: this.FA_FA_CHECK_CIRCLE }
      ];
    } else if (this.authMode.length === FccGlobalConstant.LENGTH_2 && this.authMode[0] === 'email' && this.authMode[1] === 'mobile') {
      requestTypeArr = [
        { label: `${this.translateService.instant('emailMode')}`, value: 'email', icon: this.FA_FA_CHECK_CIRCLE },
        { label: `${this.translateService.instant('mobileMode')}`, value: 'mobile', icon: this.FA_FA_CHECK_CIRCLE }
      ];
    }
    return requestTypeArr;
  }

  onClickBackToLoginbtn() {

    const dir = localStorage.getItem('langDir');
    const locaKeyValue = this.translateService.instant('backToLoginScrenConfMsg');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: `${this.translateService.instant('backToLoginScrenConfMsgHdr')}`,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: locaKeyValue }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.backToLoginScreen();
      }
    });
  }

  backToLoginScreen() {
    const configuredKeyOidcSSOEnabled = 'OIDC_SSO_ENABLED';
    let keyNotFoundList = [];
    let isOidcSSOEnabled = 'false';
    keyNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(configuredKeyOidcSSOEnabled);
    if (keyNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(keyNotFoundList.toString()).subscribe(res => {
        if (res) {
          isOidcSSOEnabled = res.OIDC_SSO_ENABLED;
          this.fccGlobalConfiguration.addConfigurationValues(res, keyNotFoundList);
          if (isOidcSSOEnabled === 'true') {
            this.router.navigate(['/login']);
            window.location.reload();
          } else {
            window[FccGlobalConstant.firstLogin] = false;
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  onClickChannelMode(data: any) {
    if (data.value === undefined) {
      this.selectedChannelMode = data;
    } else {
      this.selectedChannelMode = data.value;
    }
    this.form.get('enteredOtp').reset();
    this.otpCount = this.otpCount + 1;
    if (this.otpCount > this.maxOtpCount) {
      this.patchFieldParameters(this.form.get('otpInputText'),
                                              { label: `${this.translateService.instant('otpMaxTrialExceeded')}` });
      this.patchFieldParameters(this.form.get('otpInputText'), { styleClass: 'otpErrorMsg' });
      this.patchFieldParameters(this.form.get('resendOtpBtn'), { btndisable: true });
      this.patchFieldParameters(this.form.get('enteredOtp'), { disable: true });
      if (this.commonService.getOtpAuthScreenSource() === FccGlobalConstant.PASSWORD_RESET) {
        this.otpOnload = false;
        this.callPasswordResetApi('OtpGen');
      } else {
        this.otpTimeExpired = true;
        this.observable.unsubscribe();
        this.setSessionTimeOut();
      }
      return;
    }
    this.patchFieldParameters(this.form.get('otpInputText'), { styleClass: 'otpMessage' });
    if (this.selectedChannelMode === 'email') {
        if (this.userEmail !== undefined) {
          this.patchFieldParameters(this.form.get('otpInputText'), { label: `${this.translateService.instant('emailOtp')}` +
          FccGlobalConstant.BLANK_SPACE_STRING + this.userEmail });
          this.isRendered = true;
        } else {
          this.patchFieldParameters(this.form.get('otpInputText'), { label: `${this.translateService.instant('otpEmailError')}` });
          this.isRendered = false;
        }
      } else if (this.selectedChannelMode === 'mobile') {
        if (this.userMobile !== undefined) {
          this.patchFieldParameters(this.form.get('otpInputText'), { label: `${this.translateService.instant('mobileOtp')}` +
          FccGlobalConstant.BLANK_SPACE_STRING + this.userMobile });
          this.isRendered = true;
        } else {
          this.patchFieldParameters(this.form.get('otpInputText'), { label: `${this.translateService.instant('otpMobileError')}` });
          this.isRendered = false;
        }
    }
    if (this.commonService.getOtpAuthScreenSource() === FccGlobalConstant.PASSWORD_RESET) {
      this.callPasswordResetApi('OtpGen');
    } else {
      this.callOtpLoginApi();
    }
  }

  callPasswordResetApi(action: string) {
    const badRequest = 400;
    const internalError = 500;
    this.resetPasswordData = this.commonService.getResetPasswordData();
    if (action === 'OtpVal') {
      this.resetPasswordData.otpSubmission = this.form.get('enteredOtp').value;
      this.resetPasswordData.mode = this.otpValidateMode;
    } else if (action === 'OtpGen') {
      this.resetPasswordData.mode = this.otpSendMode;
    }
    this.commonService.retrievePassword(this.resetPasswordData).subscribe(
      (res) => {
        if (action === 'OtpGen') {
          this.otpValidateMode = res.nextMode;
          this.commonService.otpAuthScreenSource = FccGlobalConstant.PASSWORD_RESET;
          this.showOtpForm();
          this.runTimer();
        } else if (action === 'OtpVal') {
          this.resetPasswordData.mode = res.nextMode;
          this.commonService.setResetPasswordData(this.resetPasswordData);
          this.router.navigate(['/change-password']);
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === badRequest) {
          if (error.error.detail.toString().indexOf('Invalid OTP') > -1) {
            this.form.get('enteredOtp').setErrors({ wrongOtp: true });
          } else if (error.error.detail.toString().indexOf('OTP_EXPIRE_TIMEOUT') > -1) {
            this.form.get('enteredOtp').setErrors({ expiredOtp: true });
          } else if ((error.error.detail.toString().indexOf('MAX OTP ATTEMPT') > -1) && !this.otpOnload) {
            return;
          } else {
          if ((error.error.detail.toString().indexOf('MAX OTP ATTEMPT') > -1) && this.otpOnload) {
            this.retrieveCredentialsService.setResponseMessage('maxOtpResendError');
          } else if (error.error.detail.toString().indexOf('USER LOCKED') > -1) {
            this.retrieveCredentialsService.setResponseMessage('otpMaxTrialUserLock');
          } else {
            this.retrieveCredentialsService.setResponseMessage('retrievalFailed');
          }
          this.retrieveCredentialsService.setResponseHeader('failure');
          this.router.navigateByUrl(FccGlobalConstant.RESPONSE_MESSAGE_PATH);
        }
        } else if (error.status === internalError) {
          this.retrieveCredentialsService.setResponseMessage('retrievalFailed');
          this.retrieveCredentialsService.setResponseHeader('failure');
          this.router.navigateByUrl(FccGlobalConstant.RESPONSE_MESSAGE_PATH);
        }
      }
    );
  }

  callOtpLoginApi() {
    const loginTempData = this.getLoginData();
    loginTempData.mode = 'otp_auth';
    const language = localStorage.getItem('language');
    this.commonService.login(loginTempData, language, this.selectedChannelMode).subscribe(
      response => {
        if (response.response === 'success') {
            this.validateLoginMode = response.mode;
            this.showOtpForm();
            this.runTimer();
        } else {
            this.patchFieldParameters(this.form.get('otpInputText'),
                                                { label: response.errorMessage });
            this.patchFieldParameters(this.form.get('otpInputText'), { styleClass: 'otpErrorMsg', rendered: true });
            this.patchFieldParameters(this.form.get('backToLoginbtn'), { rendered: this.isRendered });
            this.patchFieldParameters(this.form.get('resendOtpBtn'), { rendered: this.isRendered });
            this.form.updateValueAndValidity();
            this.observable.unsubscribe();
            this.setSessionTimeOut();
            return;
        }
      }
    );
  }

  showOtpForm() {
    this.patchFieldParameters(this.form.get('otpInputText'), { rendered: true });
    this.patchFieldParameters(this.form.get('otpTimer'), { rendered: this.isRendered });
    this.patchFieldParameters(this.form.get('enteredOtp'), { rendered: this.isRendered });
    this.patchFieldParameters(this.form.get('backToLoginbtn'), { rendered: this.isRendered });
    this.patchFieldParameters(this.form.get('resendOtpBtn'), { rendered: this.isRendered });
    this.patchFieldParameters(this.form.get('submitBtn'), { rendered: this.isRendered });
    this.patchFieldParameters(this.form.get('submitBtn'), { btndisable: this.isRendered });
    this.form.updateValueAndValidity();
  }

  onClickResendOtpBtn() {
    this.patchFieldParameters(this.form.get('otpInputText'), { rendered: false, label: '' });
    this.onClickChannelMode(this.selectedChannelMode);
    this.form.get('enteredOtp').reset();
  }

  runTimer() {
    const param = FccGlobalConstant.PARAMS;
    const label = FccGlobalConstant.LABEL;
    let minutes = Math.floor((this.otpExpireTimer) / FccGlobalConstant.LENGTH_60);
    let seconds = (this.otpExpireTimer) % FccGlobalConstant.LENGTH_60;
    if (this.form.get('otpTimer')[param][label] !== '') {
        this.observable.unsubscribe();
    }
    this.otpTimeExpired = false;
    this.observable = interval(FccGlobalConstant.LENGTH_1000).subscribe( () => {
      if (minutes === 0 && seconds === 0) {
          this.otpTimeExpired = true;
          this.observable.unsubscribe();
          this.patchFieldParameters(this.form.get('submitBtn'), { btndisable: true });
          this.patchFieldParameters(this.form.get('otpInputText'),
                                                { label: `${this.translateService.instant('otpTimerExpired')}` });
          this.patchFieldParameters(this.form.get('otpInputText'), { styleClass: 'otpErrorMsg' });
      }
      if (minutes !== 0 && seconds === 0) {
          seconds = FccGlobalConstant.LENGTH_59;
          minutes = minutes - 1;
      } else if (seconds !== 0) {
          seconds = seconds - 1;
      }
      let remSec;
      if (seconds < FccGlobalConstant.LENGTH_10) {
        remSec = '0' + seconds;
       } else {
         remSec = seconds;
       }
      this.patchFieldParameters(this.form.get('otpTimer'), { label: '0' + minutes + ':' + remSec });
    });
  }

  onClickEnteredOtp() {
    this.form.get('enteredOtp').clearValidators();
    this.updateValidations();
  }

  updateValidations() {
    this.form.addFCCValidators('enteredOtp', Validators.compose([Validators.required, Validators.compose([validOtpChecker])]), 0);
  }

  setSessionTimeOut() {
    setTimeout(() => {
      this.sessionValidation.IsSessionValid();
      }, FccGlobalConstant.MFA_TIMER_INTERVAL);
  }

  onClickSubmitBtn() {
    this.patchFieldParameters(this.form.get('otpInputText'), { label: '' });
    if (this.commonService.getOtpAuthScreenSource() === FccGlobalConstant.PASSWORD_RESET) {
      this.callPasswordResetApi('OtpVal');
    } else {
      this.onSubmitLoginOtp();
    }

  }

  onSubmitLoginOtp() {
    const loginTempData = this.getLoginData();
    loginTempData.mode = this.validateLoginMode;
    loginTempData.password = this.form.get('enteredOtp').value;
    this.plainPass = this.form.get('enteredOtp').value;
    let clientSideEncryptionEnabled = 'true';
    // client side encryption
    const configuredKeyClientEncryption = 'ENABLE_CLIENT_SIDE_ENCRYPTION';
    let keyNotFoundList = [];
    keyNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(configuredKeyClientEncryption);
    if (keyNotFoundList.length !== 0) {
      this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response) {
          clientSideEncryptionEnabled = response.clientSidePasswordEncryption;
        }
      });
      this.commonService.getConfiguredValues(keyNotFoundList.toString()).subscribe(response => {
        if (response) {
          if (!this.commonService.isEmptyValue(response.ENABLE_CLIENT_SIDE_ENCRYPTION))
          {
            clientSideEncryptionEnabled = response.ENABLE_CLIENT_SIDE_ENCRYPTION;
          }
          this.fccGlobalConfiguration.addConfigurationValues(response, keyNotFoundList);
          this.handleLogin(loginTempData, clientSideEncryptionEnabled.toString());
        }
      });
    } else if (FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption) !== '' ||
    FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption) !== null) {
      if (!this.commonService.isEmptyValue(FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption)))
      {
        clientSideEncryptionEnabled = FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption);
      }
        this.handleLogin(loginTempData, clientSideEncryptionEnabled);
    }
  }
    handleLogin(data: any, clientSideEncryptionEnabled: string) {
      if (clientSideEncryptionEnabled === 'true') {
        this.encryptionService.generateKeys().subscribe(keyDataResponse => {
            if (keyDataResponse.response === 'success') {
            const keys = keyDataResponse.keys;
            const htmlUsedModulus = keys.htmlUsedModulus;
            const crSeq = keys.cr_seq;
            data.password = this.encryptionService.encryptText(data.password, htmlUsedModulus, crSeq);
            this.form.get('enteredOtp').setValue(data.password);
            this.callLoginAPI(data);
            }
          });
      } else {
        this.callLoginAPI(data);
      }
    }

    callLoginAPI(data: any) {
      const sessionIdleTimeOut = FccGlobalConfiguration.configurationValues.get('SESSION_IDLE_TIME_OUT');
      const sessionTimeOut = FccGlobalConfiguration.configurationValues.get('SESSION_TIME_OUT');
      const sessionMaxDuration = FccGlobalConfiguration.configurationValues.get('SESSION_MAX_DURATION');
      const sessionMaxDurationAlert = FccGlobalConfiguration.configurationValues.get('SESSION_MAX_DURATION_ALERT');
      const language = localStorage.getItem('language');
      const source = 'login_mfa';
      this.commonService.login(data, language, this.selectedChannelMode).subscribe(
        response => {
          if (response.response === 'success') {
              this.observable.unsubscribe();
              if (response.mode === 'change_password_qa') {
                this.commonService.putLoginData('USER_EMAIL_ID', response.email);
                this.commonService.putLoginData('USER_PHONE', response.phone);
              }
              this.commonService.putLoginMode('LOGIN_MODE', response.mode);
              this.commonService.putLoginMode('LOGIN_MODE', response.mode);
              this.loginService.setNextComponent(response, source);
              this.commonService.clearCachedResponses();
              // this.checkTimeoutService.idleTimeOut(sessionIdleTimeOut, sessionTimeOut);
              this.checkTimeoutService.sessionDurationTimeout(sessionMaxDurationAlert, sessionMaxDuration);
              return true;
          } else {
            this.otpSubmittedCount = this.otpSubmittedCount + 1;
            this.form.get('enteredOtp').setValue(this.plainPass);
            if (this.otpSubmittedCount > this.maxOtpCount) {
              this.patchFieldParameters(this.form.get('otpInputText'),
                                                    { label: `${this.translateService.instant('otpSubmitLockAccount')}` });
              this.patchFieldParameters(this.form.get('otpInputText'), { styleClass: 'otpErrorMsg' });
              this.patchFieldParameters(this.form.get('resendOtpBtn'), { btndisable: true });
              this.patchFieldParameters(this.form.get('submitBtn'), { btndisable: true });
              this.patchFieldParameters(this.form.get('enteredOtp'), { disable: true });
              this.otpTimeExpired = true;
              this.observable.unsubscribe();
              this.setSessionTimeOut();
              return;
            }
            const errorMessage: string = response.errorMessage;
            if (response.response === 'failed') {
              if(errorMessage.indexOf('Invalid') > -1){
                this.form.get('enteredOtp').setErrors({ wrongOtp: true });
              }
              else if (errorMessage.indexOf('expired') > -1) {
                this.form.get('enteredOtp').setErrors({ expiredOtp: true });
              }
              this.patchFieldParameters(this.form.get('otpInputText'),
                                            { label: errorMessage });
              this.patchFieldParameters(this.form.get('otpInputText'), { styleClass: 'otpErrorMsg' });
            } else {
              this.patchFieldParameters(this.form.get('otpInputText'),
                                                { label: `${this.translateService.instant('otpGenerateFailure')}` });
              this.patchFieldParameters(this.form.get('otpInputText'), { styleClass: 'otpErrorMsg' });
              this.observable.unsubscribe();
              this.setSessionTimeOut();
            }
            return false;
          }
        });
  }

}
