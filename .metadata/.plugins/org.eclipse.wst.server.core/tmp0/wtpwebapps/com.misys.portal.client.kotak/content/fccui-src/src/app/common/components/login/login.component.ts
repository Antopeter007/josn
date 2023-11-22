import { EncryptionService } from './../../services/encrypt.service';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { CommonService } from './../../services/common.service';
import { DOCUMENT } from '@angular/common';
import { Inject, Optional } from '@angular/core';
import { Component, OnInit, HostListener , OnDestroy } from '@angular/core';
import {
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { LogoutRequest } from '../../model/logout-request';
import { UserData } from '../../model/user-data';
import { BnNgIdleService } from 'bn-ng-idle';
import { LogoutService } from '../../services/logout-service';
import { ResponseService } from '../../services/response.service';
import { CheckTimeoutService } from '../../services/check-timeout-service';
import { SessionValidateService } from '../../services/session-validate-service';
import { SelectItem, MessageService } from 'primeng/api';
import { FccGlobalConfiguration } from '../../core/fcc-global-configuration';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { LoginService } from '../../services/login.service';
import { DateAdapter } from '@angular/material/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';


@Component({
  selector: 'fcc-common-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit , OnDestroy {
  loginForm: UntypedFormGroup;
  submitted = false;
  submitError = false;
  language: SelectItem[] = [];
  selectedLanguage: any;
  loginUserSelectedLanguage: string;
  errorMessage = false;
  isChecked: boolean;
  errorMessageDisplay: string;
  public formSubmitAttempt: boolean;
  checkLoginStatus: string;
  contextPath: any;
  responseMessage: any;
  logoutRequest: LogoutRequest = new LogoutRequest();
  userData: UserData = new UserData();
  logoFilePath: string;
  loginImageFilePath: string;
  myModel: any;
  passwordMinLength: number;
  passwordMaxLength: number;
  loginPageSupportUs: string;
  homeUrl: string;
  dir: string;
  defaultlanguage: any;
  configuredKeysList = 'AVAILABLE_LANGUAGES,LANGUAGE';
  keysNotFoundList: any[] = [];
  source: any;
  loginError: any;
  passwordReset: any;
  sessionInvalidVal: any;
  forceLogoutVal: any;
  displayForgotPwd = false;
  styleClassName: string;
  positionStyle: string;
  isRecaptchaEnabled = false;
  isRecaptchaV2Enabled = false;
  captchaversion = window[FccGlobalConstant.CAPTCHA_VERSION];
  captchaResponse = '';
  errorHeader = `${this.translateService.instant('errorTitle')}`;
  translationServiceloaded = false;
  ssoEnabled = false;
  loginBtnState: boolean = false;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    public router: Router,
    public commonService: CommonService,
    protected cookieService: CookieService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected bnIdle: BnNgIdleService,
    protected logout: LogoutService,
    protected responseService: ResponseService,
    protected sessionValidation: SessionValidateService,
    protected fccGlobalConfiguration: FccGlobalConfiguration,
    protected loginService: LoginService,
    protected translateService: TranslateService,
    protected messageService: MessageService,
    protected encryptionService: EncryptionService,
    protected checkTimeoutService: CheckTimeoutService,
    public dateAdapter: DateAdapter<any>,
    @Optional() public reCaptchaV3Service: ReCaptchaV3Service,
    @Inject(DOCUMENT) protected document: any
  ) {
    if ('grecaptcha' in window) {
      delete window.grecaptcha;
    }
    this.keysNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(this.configuredKeysList);
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response) {
          const Avllanguage = response.AVAILABLE_LANGUAGES.slice(1, response.AVAILABLE_LANGUAGES.length - 1).replace(/\s/g, '');
          this.initLanguage(Avllanguage, response.LANGUAGE);
        }
      });
    } else {
      const Avllangs = FccGlobalConfiguration.configurationValues.get('AVAILABLE_LANGUAGES').replace(/\s|\[|\]/g, '');
      this.initLanguage(Avllangs, FccGlobalConfiguration.configurationValues.get('LANGUAGE'));
    }
  }

  initLanguage(AvlLangs, respLang) {
    AvlLangs = AvlLangs.split(',');
    AvlLangs.forEach(
    value => {
      const langLocal = this.commonService.checKlanguage(value);
      const lang: {label: string, value: any}
      = { label: langLocal ,
        value: { name: langLocal, code: value }
      };
      this.language.push(lang);
  });
    if (this.language.length === 1){
      this.selectedLanguage = this.language[0].value;
      this.commonService.setSwitchOnLanguage(this.selectedLanguage);
      this.dateAdapter.setLocale(this.commonService.getLocale(this.language[0].value.code));
    } else {
      this.selectedLanguage = { name: this.commonService.checKlanguage(respLang), code: respLang };
      this.commonService.setSwitchOnLanguage(this.selectedLanguage);
      this.dateAdapter.setLocale(this.commonService.getLocale(respLang));
    }
    if (this.selectedLanguage.code === FccGlobalConstant.LANGUAGE_AR) {
      this.styleClassName = 'labelStyleArabic';
      this.positionStyle = 'top-right';
    } else {
      this.styleClassName = 'labelStyleEng';
      this.positionStyle = 'top-left';
    }
  }

  ngOnInit() {
    if (window[FccGlobalConstant.firstLogin] !== undefined && window[FccGlobalConstant.firstLogin] === false) {
      window[FccGlobalConstant.firstLogin] = true;
      window.location.reload();
    }
    this.Config();
    this.dir = localStorage.getItem('langDir') ? localStorage.getItem('langDir') : 'ltr';
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.logoutRequest.userData = this.userData;
    this.logoutRequest.requestData = null;
    this.logoutRequest.userData.company = null;
    this.logoutRequest.userData.username = null;
    this.logoutRequest.userData.userSelectedLanguage = null;
    this.sessionValidation.clearSession(false);
    this.commonService.otpAuthScreenSource = '';
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      this.styleClassName = 'labelStyleArabic';
      this.positionStyle = 'top-right';
    } else {
      this.styleClassName = 'labelStyleEng';
      this.positionStyle = 'top-left';
    }
    this.commonService.isTranslationServiceInitialized.subscribe(res => {
      this.translationServiceloaded = res;
      if (res)
      {
        this.loginForm = this.formBuilder.group({
        corporateid: [
          null,
          Validators.compose([
            Validators.pattern('^[a-zA-Z0-9,._\\-]*$'),
            Validators.required
          ])
        ],
        username: [
          null,
          Validators.compose([
            Validators.pattern('^[a-zA-Z0-9-]*$'),
            Validators.required
          ])
        ],
        password: [null, Validators.required],
        recaptcha: ['', Validators.required]
      });
      this.commonService.isssoENabled.subscribe(res => {
            if(res)
            { this.ssoEnabled = true;
              this.SSOLogin();
            }
      });
    }
   });
    this.passwordChange();
    this.forceLogout();
    this.sessionInvalid();
  }

  SSOLogin()
  {
    this.onSubmitLogin(this.loginForm.value);
  }

  ngOnDestroy() {
    this.selectTheme();
    this.commonService.isTranslationServiceInitialized.unsubscribe();
  }

  selectTheme() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response.chooseBankTheme !== undefined || response.chooseBankTheme !== null) {
        this.document.documentElement.classList.value = response.chooseBankTheme;
      } else {
        this.document.documentElement.classList.value = FccGlobalConstant.DEFAULT_THEME;
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmitLogin(data: any) {
    const valid = this.checkFields();
    if (!valid && !this.ssoEnabled) {
      return;
    }
    if (this.isRecaptchaEnabled && (this.captchaversion === FccGlobalConstant.LENGTH_3 || this.captchaversion === '3'))
     {
        this.
        reCaptchaV3Service.execute('onSubmitLogin')
          .subscribe((token) => {
            data.recaptcha = token;
            this.submitLogin(data);
         }
       );
     }
     else
     {
       if (this.isRecaptchaV2Enabled)
       {
        data.recaptcha = this.captchaResponse;
       }
       this.submitLogin(data);
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
          this.loginForm.get('password').setValue(data.password);
          this.callLoginAPI(data);
          }
        });
    } else {
      this.callLoginAPI(data);
    }
  }

  submitLogin(data: any)
  {
    let clientSideEncryptionEnabled = 'true';
    this.loginUserSelectedLanguage =
      localStorage.getItem('language') !== null &&
      localStorage.getItem('language') !== ''
        ? localStorage.getItem('language')
        : 'en';

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
           this.handleLogin(data, clientSideEncryptionEnabled.toString());
         }
       });
     } else if (FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption) !== '' ||
     FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption) !== null) {
      if (!this.commonService.isEmptyValue(FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption)))
      {
        clientSideEncryptionEnabled = FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption);
      }
         this.handleLogin(data, clientSideEncryptionEnabled);
     }
  }

  // login API handler
  callLoginAPI(data: any) {
    this.loginBtnState = true;
    const sessionIdleTimeOut = FccGlobalConfiguration.configurationValues.get('SESSION_IDLE_TIME_OUT');
    const sessionTimeOut = FccGlobalConfiguration.configurationValues.get('SESSION_TIME_OUT');
    const sessionMaxDuration = FccGlobalConfiguration.configurationValues.get('SESSION_MAX_DURATION');
    const sessionMaxDurationAlert = FccGlobalConfiguration.configurationValues.get('SESSION_MAX_DURATION_ALERT');
    const badRequest = 400;
    // Handling Deeplinked URL
    const loginDataDetails = this.commonService.getLogindata();
    if (loginDataDetails.get(FccGlobalConstant.PREVIOUS_URL) !== '' && loginDataDetails.get(FccGlobalConstant.PREVIOUS_URL) !== '/'
            && loginDataDetails.get(FccGlobalConstant.PREVIOUS_URL) !== undefined
            && loginDataDetails.get(FccGlobalConstant.PREVIOUS_URL) !== '/http:'
            && loginDataDetails.get(FccGlobalConstant.PREVIOUS_URL) !== '/https:') {
      data.nextScreen = loginDataDetails.get(FccGlobalConstant.PREVIOUS_URL);
      this.commonService.putLoginData(FccGlobalConstant.IS_ANGULAR_URL, true);
     } else if (loginDataDetails.get(FccGlobalConstant.REDIRECT_URL) !== '') {
      data.nextScreen = loginDataDetails.get(FccGlobalConstant.REDIRECT_URL);
    }
    this.commonService.login(data, this.loginUserSelectedLanguage).subscribe(
      res => {
          if (res.response === 'success') {
            this.formSubmitAttempt = false;
            data.password = '';
            this.commonService.putLoginData('FCC_LOGIN_DATA', data);
            this.commonService.putLoginMode('USER_ID', data.username);
            this.commonService.putLoginData('USER_EMAIL', res.objectData.email);
            this.commonService.putLoginData('USER_PHONE', res.objectData.phone);
            this.commonService.putLoginMode('LOGIN_MODE', res.mode);
            localStorage.setItem(FccGlobalConstant.LANGUAGE,
            res.objectData?.language ? res.objectData.language : FccGlobalConstant.LANGUAGE_EN );
            this.commonService.setBaseCurrency(res.objectData?.baseCurrency ? res.objectData.baseCurrency : '');
            this.resModeAcceptTerms(res);
            this.resModeChangePassword(res);
            this.resModeOtpAuth(res, sessionIdleTimeOut, sessionTimeOut, sessionMaxDurationAlert, sessionMaxDuration);
            this.loginService.setNextComponent(res, this.source);
            const keys : any [] = Object.keys(sessionStorage);
            keys.forEach(key => {
              if(key.indexOf('preference') >= 0) {
                sessionStorage.removeItem(key);
              }
            });
            this.commonService.clearCachedResponses();
            this.commonService.getAmountFormatAbbreviationList();
          } else {
          this.loginForm.reset();
          this.formSubmitAttempt = true;
          this.errorMessageDisplay = res.errorMessage;
          sessionStorage.removeItem('login');
          this.router.navigate(['/login']);
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === badRequest) {
          if (error.error.message.indexOf('locked') > -1 && error.error.message.indexOf('some time') === -1) {
            this.loginError = `${this.translateService.instant('accountLock')}`;
          } else if (error.error.message.indexOf('not active') > -1) {
            this.loginError = `${this.translateService.instant('accountInactive')}`;
          } else if (error.error.message.indexOf('some time') > -1) {
            this.loginError = `${this.translateService.instant('accountSoftLock')}`;
          } else if (error.error.message.indexOf('INVALID_CAPTCHA') > -1) {
            this.loginError = `${this.translateService.instant('invalidCaptcha')}`;
          } else {
            this.loginError = `${this.translateService.instant('passwordIncorrect')}`;
          }
        } else {
          this.loginError = `${this.translateService.instant('passwordIncorrect')}`;
        }
        this.loginForm.reset();
        this.formSubmitAttempt = true;
        this.loginBtnState = false;
      }
    );
  }
  resModeAcceptTerms(res: any) {
    if (res.mode === 'accept_terms') {
      this.commonService.putTermsAndConditionData('TandCdata', res.objectData.tandctext);
    }
  }

  resModeChangePassword(res: any) {
    if (res.mode === 'change_password_qa') {
      this.commonService.putLoginData('USER_EMAIL_ID', res.email);
      this.commonService.putLoginData('USER_PHONE', res.phone);
    }
  }

  resModeOtpAuth(res: any, sessionIdleTimeOut: any, sessionTimeOut: any, sessionMaxDurationAlert: any, sessionMaxDuration: any) {
    this.source = 'login';
    if (res.mode !== 'otp_auth' ) {
      // this.checkTimeoutService.idleTimeOut(sessionIdleTimeOut, sessionTimeOut);
      this.checkTimeoutService.sessionDurationTimeout(sessionMaxDurationAlert, sessionMaxDuration);
    }
  }

  initIdleTimer() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.commonService.setSessionIdleTimeout(response.sessionIdleTimeout);
        this.bnIdle
          .startWatching(this.commonService.getSessionIdleTimeout())
          .subscribe(res => {
            if (res && this.commonService.checkLoggedIn()) {
              this.logoutRequest.requestData = null;
              this.logoutRequest.userData.username = null;
              this.logoutRequest.userData.company = null;
              this.logoutRequest.userData.userSelectedLanguage = null;
              this.logout
                .logoutUser(
                  this.fccGlobalConstantService.getLogoutUrl(),
                  this.logoutRequest
                )
                .subscribe(data => {
                  if (data.response === 'success') {
                    localStorage.clear();
                    sessionStorage.removeItem('dateRangeFormat');
                    localStorage.removeItem('isLanguagedChangedFlag');
                    this.responseMessage = data.message;
                    this.responseService.setResponseMessage(data.message);
                    this.commonService.setOnDemandTimedLogout(true);
                    this.commonService.clearCachedData();
                    this.router.navigate(['/logout']);
                  }
                });
            }
          });
      }
    });
  }

  switchLanguage(selectedLanguage) {
    this.commonService.setSwitchOnLanguage(selectedLanguage);
    this.dateAdapter.setLocale(this.commonService.getLocale(selectedLanguage.code));
    this.formSubmitAttempt = false;
    this.loginForm.reset();
    this.dir = localStorage.getItem('langDir') ? localStorage.getItem('langDir') : 'ltr';
    if (this.dir === 'rtl') {
      this.styleClassName = 'labelStyleArabic';
    } else {
      this.styleClassName = 'labelStyleEng';
    }
    }

  onBlurCorporateMethod() {
    const corporateValue = this.loginForm.value.corporateid;
    localStorage.setItem('companyName', corporateValue);
    this.commonService.compName = corporateValue;
    let corporateChangeValue;
    if (this.commonService.getCompanyCaseSensitiveSearchEnabled()) {
      corporateChangeValue = corporateValue;
    }
    else {
      corporateChangeValue = corporateValue !== null ? corporateValue.toUpperCase() : '';
    }
    this.loginForm.controls.corporateid.setValue(corporateChangeValue);
  }
  onBlurUserMethod() {
    const userValue = this.loginForm.value.username;
    let userChangeValue;
    if (this.commonService.getUserCaseSensitiveSearchEnabled()) {
      userChangeValue = userValue;
    }
    else {
      userChangeValue = userValue !== null ? userValue.toUpperCase() : '';
    }
    this.loginForm.controls.username.setValue(userChangeValue);
  }

  passwordChange() {
    const timeOut = 500;
    this.passwordReset = sessionStorage.getItem('passwordReset');
    sessionStorage.removeItem('passwordReset');
    sessionStorage.removeItem('logInCheck');
    if (this.passwordReset === 'change_password') {
      window.location.reload();
      setTimeout(() => {
        this.messageService.add({
          key: 'loginKey',
          severity: 'success',
          summary: `${this.translateService.instant('passwordUpdate')}`,
          detail: `${this.translateService.instant('passwordChangeSuccess')}`,
        });
      }, timeOut);
    }
  }

  forceLogout() {
    const timeOut = 500;
    this.forceLogoutVal = sessionStorage.getItem('isForceLogout');
    sessionStorage.removeItem('isForceLogout');
    sessionStorage.removeItem('logInCheck');
    if (this.forceLogoutVal === 'true') {
      setTimeout(() => {
        this.messageService.add({
          key: 'loginKey',
          severity: 'success',
          summary: `${this.translateService.instant('forceLogoutHeader')}`,
          detail: `${this.translateService.instant('forceLogoutMsg')}`,
        });
      }, timeOut);
    }
  }

  Config() {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {

        if ( response.subdomainloginallowed ) {
          this.homeUrl = response.subdomainhomeurls;
          this.loginPageSupportUs = response.subdomainloginPageSupportUs;
        } else {
          this.homeUrl = response.homeUrl;
          this.loginPageSupportUs = response.loginPageSupportUs;
        }

        this.logoFilePath = this.contextPath + response.logoFilePath;
        this.loginImageFilePath =
          this.contextPath + response.loginImageFilePath;
        this.passwordMinLength = response.passwordMinLength;
        this.passwordMaxLength = response.passwordMaxLength;
        this.displayForgotPwd = response.forgotpasswordShow;
        this.isRecaptchaEnabled = response.enableRecaptchaForLogin;
        this.isRecaptchaV2Enabled = this.isRecaptchaEnabled &&
         ((this.captchaversion === FccGlobalConstant.LENGTH_2) || (this.captchaversion === '2'));
        this.commonService.setHomeUrl(response.homeUrl);
        this.commonService.setStarRatingSize(response.starRatingSize);
        this.commonService.setAngularProducts(response.angularProducts);
        this.commonService.setAngularSubProducts(response.angularSubProducts);
        this.commonService.setEnableUxAddOn(response.enableUxAddOn);
        this.commonService.setfeedbackCharLength(response.feedbackCharLength);
        this.commonService.setCompanyCaseSensitiveSearchEnabled(response.companySearchCaseSensitiveEnable);
        this.commonService.setUserCaseSensitiveSearchEnabled(response.userSearchCaseSensitiveEnable);
        this.commonService.isssoENabled.next(response.ssoEnabled);
      }
    });
  }

  sessionInvalid() {
    const timeOut = 500;
    this.sessionInvalidVal = localStorage.getItem('sessionInvalid');
    localStorage.removeItem('sessionInvalid');
    if (this.sessionInvalidVal === 'sessionInvalid') {
      setTimeout(() => {
        this.messageService.add({
          key: 'loginKey',
          severity: 'success',
          summary: `${this.translateService.instant('sessionInvalidHeader')}`,
          detail: `${this.translateService.instant('sessionInvalidMsg')}`,
        });
      }, timeOut);
    }
  }

  onClickCaptcha(response: string) {
    this.captchaResponse = response;
  }

  @HostListener('window:popstate', ['$event'])
    onLoginBackBtn(event: Event) {
     event.preventDefault();
  }

  checkFields(): boolean {
    let validFieldsCheck = true;
    if (this.loginForm.value.username === null || this.loginForm.value.corporateid === null || this.loginForm.value.password === null ||
      this.loginForm.value.username === '' || this.loginForm.value.corporateid === '' || this.loginForm.value.password === '') {
      this.loginError = `${this.translateService.instant(FccGlobalConstant.FIELDS_NOT_ENTERED_ERROR)}`;
      this.formSubmitAttempt = true;
      validFieldsCheck = false;
    }
    return validFieldsCheck;
  }
  navigateToRetrieveDetails() {
    this.commonService.putLoginMode('LOGIN_MODE', 'forgot_password');
    this.router.navigateByUrl('/retrieve');
  }
}
