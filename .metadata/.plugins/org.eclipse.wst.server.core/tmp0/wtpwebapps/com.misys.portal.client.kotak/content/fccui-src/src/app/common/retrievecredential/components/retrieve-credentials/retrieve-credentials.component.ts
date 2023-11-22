import { Subscription } from 'rxjs';
import { RetrieveCredentialsService } from './../../services/retrieve-credentials.service';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { CommonService } from './../../../services/common.service';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { ImageFormControl, SelectButtonControl, CaptchaControl, InputTextControl,
SpacerControl, RoundedButtonControl } from './../../../../base/model/form-controls.model';
import { FCCFormGroup } from './../../../../base/model/fcc-control.model';
import { FCCBase } from './../../../../base/model/fcc-base';

import { TranslateService } from '@ngx-translate/core';
import { Validators } from '@angular/forms';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RetrieveUserReqData, ResetPasswordRequestData } from '../../model/retrieveCredentialsReqData';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { PlatformLocation } from '@angular/common';
import { LoginService } from '../../../../common/services/login.service';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccGlobalConfiguration } from '../../../../common/core/fcc-global-configuration';

@Component({
  selector: 'fcc-app-retrieve-credentials',
  templateUrl: './retrieve-credentials.component.html',
  styleUrls: ['./retrieve-credentials.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: RetrieveCredentialsComponent }]
})
export class RetrieveCredentialsComponent extends FCCBase implements OnInit, OnDestroy {
  form: FCCFormGroup;
  module = '';
  queryParmValue = '';
  dir: string = localStorage.getItem('langDir');
  language = localStorage.getItem('language');
  logoFilePath: string;
  loginImageFilePath: string;
  contextPath: string;
  captchaResponse = '';
  userData: RetrieveUserReqData;
  retrievePasswordData: ResetPasswordRequestData;
  captchaVersion = window[FccGlobalConstant.CAPTCHA_VERSION];
  retrieveSelected = FccGlobalConstant.PASSWORD_RESET;
  isforgotPasswordCaptcha: boolean;
  emailRegEx: string | RegExp;
  subscriptions: Subscription[]= [];
  FA_FA_CHECK_CIRCLE = 'fa fa-check-circle fa-2x';

  constructor(protected translateService: TranslateService, protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected router: Router,
              protected retrieveCredentialsService: RetrieveCredentialsService, protected loginService: LoginService,
              protected location: PlatformLocation,
              protected fccGlobalConfiguration: FccGlobalConfiguration,
              public reCaptchaV3Service: ReCaptchaV3Service) {
    super();
    this.loginService.preLoginBackBtnCheck(location);
  }
  ngOnDestroy(): void {
   this.subscriptions.forEach(subs => subs.unsubscribe());
  }
  @HostListener('window:popstate')
  onPopState() {
    window[FccGlobalConstant.firstLogin] = false;
  }
  ngOnInit() {
    this.loginService.checkValidSession(this.commonService.getLoginMode().get('LOGIN_MODE'));
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.subscriptions.push(
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.logoFilePath = this.contextPath + response.logoFilePath;
        this.commonService.setloginImageFilePath(this.loginImageFilePath);
        this.loginImageFilePath =
        this.contextPath + response.loginImageFilePath;
        this.emailRegEx = response.emailRegex;
        this.isforgotPasswordCaptcha = response.enableForgotPasswordRecaptcha;
        this.initializeFormGroup();
      }
    }));
  }
  initializeFormGroup() {
    const inputLayoutStyle = 'p-col-9 p-md-9 p-lg-9 p-sm-12';
    this.form = new FCCFormGroup({
      logoImage: new ImageFormControl('logoImage', this.translateService, {
        layoutClass: 'logo-grid',
        styleClass: 'logo-img',
        path: this.logoFilePath,
        homeUrl: this.commonService.getHomeUrl(),
        anchorNeeded: true,
        altText: `${this.translateService.instant('FinastraLoginImage')}`,
        rendered: true
      }),
      retrievalOption: new SelectButtonControl('retrievalOption', this.retrieveSelected, this.translateService, {
        label: '',
        options: this.getRequestTypeArray(),
        rendered: true,
        styleClass: 'bank-select',
        layoutClass: 'p-grid p-col-12'
      }),
      corporateId: new InputTextControl('corporateId', '', this.translateService, {
        label: `${this.translateService.instant('Corporate_ID')}`,
        key: 'corporateId',
        rendered: true,
        layoutClass: inputLayoutStyle,
        validators: Validators.compose([
                    Validators.required,
                    Validators.maxLength(FccGlobalConstant.LENGTH_35)])
      }),
      userIdentifier: new InputTextControl('userIdentifier', '', this.translateService, {
        label: `${this.translateService.instant('username')}`,
        key: 'userIdentifier',
        rendered: true,
        layoutClass: inputLayoutStyle,
        validators: Validators.compose([
                    Validators.required,
                    Validators.maxLength(FccGlobalConstant.LENGTH_32)])
      }),
      ftUserEmailId: new InputTextControl('ftUserEmailId', '', this.translateService, {
        label: `${this.translateService.instant('email')}`,
        key: 'ftUserEmailId',
        rendered: true,
        layoutClass: inputLayoutStyle,
        validators: Validators.compose([
                   Validators.required,
                   Validators.maxLength(FccGlobalConstant.LENGTH_255),
                   Validators.pattern(this.emailRegEx)])
      }),
      retreiveUserCaptcha: new CaptchaControl('retreiveUserCaptcha', '', this.translateService, {
        label: `${this.translateService.instant('captcha')}`,
        key: 'retreiveUserCaptcha',
        rendered: ((this.captchaVersion === FccGlobalConstant.LENGTH_2) || (this.captchaVersion === '2')),
        required: true,
        layoutClass: inputLayoutStyle,
        styleClass: 'captcha-margin'
      }),
      backToLoginbtn: new RoundedButtonControl('backToLoginbtn', this.translateService, {
        key: 'backToLoginbtn',
        label: `${this.translateService.instant('backToLoginPageMsg')}`,
        rendered: true,
        btndisable: false,
        layoutClass: 'p-col-10',
        styleClass:  'ui-button-rounded primaryButton buttonSpac',
      }),
      submitBtn: new RoundedButtonControl('submitBtn', this.translateService, {
        key: 'submitBtn',
        label: `${this.translateService.instant('next')}`,
        rendered: true,
        btndisable: true,
        layoutClass: 'p-col-2',
        styleClass:  'ui-button-rounded primaryButton buttonSpac',
      }),
      spacer1: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),
    });

    this.form.setFormMode('edit');
    this.subscriptions.push(
    this.form.statusChanges.subscribe(
      status => {
        if (status === FccGlobalConstant.VALID) {
          this.patchFieldParameters(this.form.get('submitBtn'), { btndisable: false });
        } else {
          this.patchFieldParameters(this.form.get('submitBtn'), { btndisable: true });
        }
      }
    ));
  }

  getRequestTypeArray() {
    const requestTypeArr = [
      { label: `${this.translateService.instant('resetPassword')}`, value: FccGlobalConstant.PASSWORD_RESET,
      icon: this.FA_FA_CHECK_CIRCLE },
      { label: `${this.translateService.instant('retrieveUsername')}`, value: 'userName', icon: this.FA_FA_CHECK_CIRCLE }
    ];
    return requestTypeArr;
  }

  onClickCaptcha(response: string) {
    this.captchaResponse = response;
  }

  onBlurCorporateId() {
    const corporateValue = this.form.get('corporateId').value;
    const corporateChangeValue = corporateValue !== null ? corporateValue.toUpperCase() : '';
    this.form.get('corporateId').setValue(corporateChangeValue);
  }

  onBlurUserIdentifier() {
    const userValue = this.form.get('userIdentifier').value;
    const userChangeValue = userValue !== null ? userValue.toUpperCase() : '';
    this.form.get('userIdentifier').setValue(userChangeValue);
  }

  onClickBackToLoginbtn() {
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


  onClickSubmitBtn() {
    this.validateFields();
    if (this.form.valid) {
      if (!this.isforgotPasswordCaptcha) {
        this.submitApiExecution();
      } else {
      this.getCaptchaAndSubmit('submitBtn');
      }
     }
  }

  getCaptchaAndSubmit(action: string): void {
    if (this.captchaVersion === FccGlobalConstant.LENGTH_3 || this.captchaVersion === '3') {
      this.subscriptions.push(
      this.reCaptchaV3Service.execute(action)
        .subscribe((token) => {
          this.captchaResponse = token;
          this.submitApiExecution();
        }
      ));
    } else if (this.captchaVersion === FccGlobalConstant.LENGTH_2 ||
              this.captchaVersion === '2') {
      this.submitApiExecution();
    }
  }
  submitApiExecution() {
    if (this.retrieveSelected === 'userName') {
      this.submitRetrieveUserApiExecution();
    } else if (this.retrieveSelected === FccGlobalConstant.PASSWORD_RESET) {
      this.submitForgotPassWordApiExecution();
    }
  }

  submitForgotPassWordApiExecution() {
    this.retrievePasswordData = new ResetPasswordRequestData();
    this.retrievePasswordData.details.corporateId = this.form.controls.corporateId.value;
    this.retrievePasswordData.details.email = this.form.controls.ftUserEmailId.value;
    this.retrievePasswordData.userId = this.form.controls.userIdentifier.value;
    this.retrievePasswordData.language = this.language;
    this.retrievePasswordData.captcha = this.captchaResponse;
    this.retrievePasswordData.mode = 'forgot_password';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const badRequest = 400;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const internalError = 500;
    this.subscriptions.push(
    this.commonService.retrievePassword(this.retrievePasswordData).subscribe(
      (res) => {
        this.retrieveCredentialsService.setResponseMessage('retrievalSuccess');
        this.retrieveCredentialsService.setResponseHeader('success');
        this.commonService.otpAuthScreenSource = FccGlobalConstant.PASSWORD_RESET;
        this.retrievePasswordData.mode = res.nextMode;
        this.commonService.putLoginMode('LOGIN_MODE', 'forgot_password');
        this.commonService.setResetPasswordData(this.retrievePasswordData);
        this.router.navigate(['/login-mfa']);
      },
      (error: HttpErrorResponse) => {
        this.errorResponseHandle(error);
      }
    ));
  }

  submitRetrieveUserApiExecution() {
    this.userData = new RetrieveUserReqData();
    this.userData.details.email = this.form.controls.ftUserEmailId.value;
    this.userData.details.corporateId = this.form.controls.corporateId.value;
    this.userData.language = this.language;
    this.userData.captcha = this.captchaResponse;
    this.subscriptions.push(
    this.commonService.retrieveUserId(this.userData).subscribe(
      () => {
        this.retrieveCredentialsService.setResponseMessage('retrievalSuccess');
        this.retrieveCredentialsService.setResponseHeader('success');
        this.router.navigateByUrl(FccGlobalConstant.RESPONSE_MESSAGE_PATH);
      },
      (error: HttpErrorResponse) => {
        this.errorResponseHandle(error);
      }
    ));
  }

  errorResponseHandle(error: HttpErrorResponse) {
    const badRequest = 400;
    const internalError = 500;
    if (error.status === badRequest) {
      if (error.error.detail.toString().indexOf('Invalid captcha') > -1) {
        const captchaMessage = (this.retrieveSelected === FccGlobalConstant.PASSWORD_RESET ? 'invalidCaptchaFailed' :
         'retrievalCaptchaFailed');
        this.retrieveCredentialsService.setResponseMessage(captchaMessage);
      } else if (error.error.detail.toString().indexOf('not allowed to change') > -1) {
        this.retrieveCredentialsService.setResponseMessage('inactiveUserError');
      } else if (error.error.detail.toString().indexOf('USER LOCKED') > -1) {
        this.retrieveCredentialsService.setResponseMessage('otpMaxTrialUserLock');
      } else if (error.error.detail.toString().indexOf('emailid pattern') > -1) {
        this.retrieveCredentialsService.setResponseMessage('invalidEmailPattern');
      } else if (error.error.detail.toString().indexOf('Invalid length given for the company') > -1) {
        this.retrieveCredentialsService.setResponseMessage('invalidCompanyLength');
      } else if (error.error.detail.toString().indexOf('combination of company name, email ID') > -1) {
        this.retrieveCredentialsService.setResponseMessage('invalidUserEmailCombo');
      } else if (error.error.detail.toString().indexOf('Invalid length given for the user') > -1) {
        this.retrieveCredentialsService.setResponseMessage('invalidUserLength');
      } else if (error.error.detail.toString().indexOf('combination of user name, company name, email ID') > -1) {
        this.retrieveCredentialsService.setResponseMessage('invalidCompanyUserEmailCombo');
      } else {
        this.retrieveCredentialsService.setResponseMessage('retrievalFailed');
      }
      this.retrieveCredentialsService.setResponseHeader('failure');
    } else if (error.status === internalError) {
      this.retrieveCredentialsService.setResponseMessage('retrievalFailed');
      this.retrieveCredentialsService.setResponseHeader('failure');
    }
    this.router.navigateByUrl(FccGlobalConstant.RESPONSE_MESSAGE_PATH);
  }

  validateFields() {
     this.form.markAllAsTouched();
  }

  setDirection() {
    if (this.dir === 'rtl') {
      return 'p-col-12 leftDir';
    } else {
      return 'p-col-12 rightDir';
    }
  }
 //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClickRetrievalOption(data: any) {
    this.retrieveSelected = data.value;
    if (data.value === FccGlobalConstant.PASSWORD_RESET) {
      this.form.reset();
      this.form.get('userIdentifier').setValidators([Validators.required, Validators.maxLength(FccGlobalConstant.LENGTH_32)]);
      this.patchFieldValueAndParameters(this.form.get('userIdentifier'), '', { rendered: true });
    } else {
      this.form.reset();
      this.form.get('userIdentifier').clearValidators();
      this.patchFieldValueAndParameters(this.form.get('userIdentifier'), '', { rendered: false });
    }
    this.patchFieldValueAndParameters(this.form.get('retrievalOption'), this.retrieveSelected, '');
    this.form.updateValueAndValidity();
    this.captchaResponse = '';
  }
}
