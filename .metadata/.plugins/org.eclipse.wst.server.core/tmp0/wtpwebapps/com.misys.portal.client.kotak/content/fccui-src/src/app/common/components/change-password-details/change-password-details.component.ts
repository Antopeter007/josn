import { Component, OnInit } from '@angular/core';
import { FCCBase } from './../../../base/model/fcc-base';
import { FCCFormGroup } from './../../../base/model/fcc-control.model';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import {
  TextControl,
  ButtonControl,
  SpacerControl,
  InputTextControl,
  InputPasswordControl,
  ImageFormControl
} from './../../../base/model/form-controls.model';
import { Validators } from '@angular/forms';
import { oldNewPassChecker, newconfirmPassChecker, confirmNewPassChecker } from '../../../corporate/common/validator/ValidationKeys';
import {
  ConfirmationDialogComponent
} from '../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { FccGlobalConfiguration } from '../../core/fcc-global-configuration';
import { SessionValidateService } from '../../services/session-validate-service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EncryptionService } from '../../services/encrypt.service';
import { PlatformLocation } from '@angular/common';
import { LogoutRequest } from '../../model/logout-request';
import { UserData } from '../../model/user-data';
import { LogoutService } from '../../services/logout-service';
import { ResponseService } from '../../services/response.service';
import { RetrieveCredentialsService } from '../../retrievecredential/services/retrieve-credentials.service';
import { ResetPasswordRequestData } from '../../retrievecredential/model/retrieveCredentialsReqData';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'fcc-common-change-password-details',
  templateUrl: './change-password-details.component.html',
  styleUrls: ['./change-password-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ChangePasswordDetailsComponent }]
})
export class ChangePasswordDetailsComponent extends FCCBase implements OnInit {
  form: FCCFormGroup;
  module = '';
  dir: string = localStorage.getItem('langDir');
  emailRegEx: any;
  passwordCharSet: any;
  passwordMinLength: any;
  passwordMaxLength: any;
  mobileRegEx: any;
  mobileNoMaxLength: any;
  mobileNoMinLength: any;
  loginIdRegEx: any;
  forgotPassword: any;
  configuredKeysList = 'LOGINID_VALIDATION_REGEX,MOBILE_FORMAT_REGEX,MOBILE_FORMAT_MAXLENGTH,' +
                       'EMAIL_FORMAT_REGEX,PASSWORD_CHARSET,PASSWORD_MAXIMUM_LENGTH,PASSWORD_MIMIMUM_LENGTH,MOBILE_FORMAT_MINLENGTH,' +
                       'FORGOTPASSWORD_SHOW';
  keysNotFoundList: any[] = [];
  loginData: any;
  source: any;
  loginMode: any;
  userId: any;
  contextPath: any;
  passwrdPattern: any;
  loginError: any;
  params = 'params';
  rendered = 'rendered';
  responseMessage;
  logoutRequest: LogoutRequest = new LogoutRequest();
  logoFilePath: string;
  homeUrl: string;
  invalidateSessionAfterPwdChange: any;
  showDialogBoxAfterPwdChange: any;
  userData: UserData = new UserData();
  resetPasswordData: ResetPasswordRequestData;

  constructor(protected translateService: TranslateService, protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected fccGlobalConfiguration: FccGlobalConfiguration,
              protected sessionValidation: SessionValidateService,
              protected router: Router, protected loginService: LoginService,
              protected encryptionService: EncryptionService, protected location: PlatformLocation,
              protected logoutService: LogoutService, protected retrieveCredentialsService: RetrieveCredentialsService,
              protected dialogService: DialogService,
              protected responseService: ResponseService) {
    super();
    this.loginService.preLoginBackBtnCheck(location);
  }

  ngOnInit() {
    this.loginService.checkValidSession(this.commonService.getLoginMode().get('LOGIN_MODE'));
    this.keysNotFoundList = this.configuredKeysList.split(',');
    if (this.keysNotFoundList.length !== 0) {
      this.commonService.getConfiguredValues(this.keysNotFoundList.toString()).subscribe(response => {
        if (response.response && response.response === 'REST_API_SUCCESS') {
          this.fccGlobalConfiguration.addConfigurationValues(response, this.keysNotFoundList);
          this.updateValues();
        }
      });
    } else {
      this.updateValues();
    }
    this.initializeFormGroup();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    const mode = this.commonService.getLoginMode();
    this.loginMode = mode.get('LOGIN_MODE');
    if (this.commonService.getOtpAuthScreenSource() === FccGlobalConstant.PASSWORD_RESET) {
      this.resetPasswordData = this.commonService.getResetPasswordData();
      this.patchFieldValueAndParameters(this.form.get('ftUserCurrentPwd'), null, { rendered: false });
    } else {
    this.userId = mode.get('USER_ID');
    this.patchFieldValueAndParameters(this.form.get('ftUserIdValue'), '', { label: this.userId });
    this.initializeUserContactDetails(this.loginMode);
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.patchFieldParameters(this.form.get('logoImage'), { path: this.contextPath + response.logoFilePath });
        this.patchFieldParameters(this.form.get('logoImage'), { homeUrl: response.homeUrl });
        this.patchFieldParameters(this.form.get('logoImage'), { altText: this.translateService.instant('FinastraLoginImage') });
      }
    });

    if (this.loginMode === FccGlobalConstant.CHANGE_PASSWORD_QA) {
      const loginData = this.commonService.getLogindata();
      this.patchFieldValueAndParameters(this.form.get('ftUserMobileNo'), loginData.get('USER_PHONE'), {});
      this.patchFieldValueAndParameters(this.form.get('ftUserEmailId'), loginData.get('USER_EMAIL_ID'), {});
    }
  }

    setDirection() {
      if (this.dir === 'rtl') {
        return 'p-col-12 leftDir';
      } else {
        return 'p-col-12 rightDir';
      }
    }
  updateValues() {
    this.emailRegEx = FccGlobalConfiguration.configurationValues.get('EMAIL_FORMAT_REGEX');
    this.passwordCharSet = FccGlobalConfiguration.configurationValues.get('PASSWORD_CHARSET');
    this.passwordMinLength = FccGlobalConfiguration.configurationValues.get('PASSWORD_MIMIMUM_LENGTH');
    this.passwordMaxLength = FccGlobalConfiguration.configurationValues.get('PASSWORD_MAXIMUM_LENGTH');
    this.mobileRegEx = FccGlobalConfiguration.configurationValues.get('MOBILE_FORMAT_REGEX');
    this.mobileNoMaxLength = FccGlobalConfiguration.configurationValues.get('MOBILE_FORMAT_MAXLENGTH');
    this.mobileNoMinLength = FccGlobalConfiguration.configurationValues.get('MOBILE_FORMAT_MINLENGTH');
    this.loginIdRegEx = FccGlobalConfiguration.configurationValues.get('LOGINID_VALIDATION_REGEX');
    this.patchFieldParameters(this.form.get('ftUserMobileNo'), { maxlength: this.mobileNoMaxLength });
    this.patchFieldParameters(this.form.get('ftUserMobileNo'), { minlength: this.mobileNoMinLength });
    this.patchFieldParameters(this.form.get('ftUserCurrentPwd'), { maxlength: this.passwordMaxLength });
    this.patchFieldParameters(this.form.get('ftUserNewPwd'), { maxlength: this.passwordMaxLength });
    this.patchFieldParameters(this.form.get('ftUserConfrmPwd'), { maxlength: this.passwordMaxLength });
    this.updateValidations();
  }

  updateValidations() {
    this.form.addFCCValidators('ftUserMobileNo', Validators.compose([Validators.required, Validators.maxLength(this.mobileNoMaxLength),
      Validators.minLength(this.mobileNoMinLength), Validators.pattern(this.mobileRegEx)]), 0);
    this.form.addFCCValidators('ftUserEmailId', Validators.compose([Validators.required, Validators.pattern(this.emailRegEx)]), 0);
    this.form.addFCCValidators('ftNewUserIdValue', Validators.pattern(this.loginIdRegEx), 0);
  }

    initializeFormGroup() {
      this.form = new FCCFormGroup({
        logoImage: new ImageFormControl('logoImage', this.translateService,
        {
          layoutClass: 'p-col-12 no-mr-pd logo-img logo-grid paddingb',
          anchorNeeded: true,
          rendered: true
        }),
        firstTimeLoginModule: new TextControl('firstTimeLoginModule', this.translateService, {
          key: 'firstTimeLoginModule',
          label: `${this.translateService.instant('firstTimeLoginModule')}`,
          rendered: false,
          layoutClass: 'p-col-12'
        }),
        ftUserId: new TextControl('ftUserId', this.translateService, {
          key: 'ftUserId',
          label: `${this.translateService.instant('loginUserId')}`,
          rendered: false,
          layoutClass: 'p-col-4',
          styleClass: 'ftUserId'
        }),
        ftUserIdValue: new TextControl('ftUserIdValue', this.translateService, {
          key: 'ftUserIdValue',
          label: '',
          rendered: false,
          layoutClass: 'p-col-4',
          readonly: true,
          styleClass: 'ftUserIdValue'
        }),
        ftUserChangeUserId: new ButtonControl('ftUserChangeUserId', this.translateService, {
          key: 'ftUserChangeUserId',
          label: `${this.translateService.instant('changeUserId')}`,
          rendered: false,
          layoutClass: 'p-col-4',
          styleClass: 'tertiaryButton'
        }),
        ftNewUserIdValue: new InputTextControl('ftNewUserIdValue', '', this.translateService, {
          key: 'ftNewUserIdValue',
          label: `${this.translateService.instant('changeUserIdValue')}`,
          rendered: false,
          maxlength : FccGlobalConstant.LOGIN_ID_MAXLENGTH,
          layoutClass: 'p-col-12'
        }),
        ftContactDetail: new TextControl('ftContactDetail', this.translateService, {
          key: 'ftContactDetail',
          label: `${this.translateService.instant('contactDetails')}`,
          rendered: false,
          layoutClass: 'p-col-12'
        }),
        ftUserMobileNo: new InputTextControl('ftUserMobileNo', '', this.translateService, {
          label: `${this.translateService.instant('mobileNo')}`,
          key: 'ftUserMobileNo',
          layoutClass: 'p-col-12',
          styleClass: 'ftUserAllField',
          rendered: false,
          required: true
        }),
        ftUserEmailId: new InputTextControl('ftUserEmailId', '', this.translateService, {
          label: `${this.translateService.instant('email')}`,
          key: 'ftUserEmailId',
          rendered: false,
          layoutClass: 'p-col-12',
          styleClass: 'ftUserAllField',
          required: true
        }),
        ftUserChangePwdLbl: new TextControl('ftUserChangePwdLbl', this.translateService, {
          key: 'ftUserChangePwdLbl',
          label: `${this.translateService.instant('changePassWord')}`,
          rendered: true,
          layoutClass: 'p-col-12'
        }),
        ftUserCurrentPwd: new InputPasswordControl('ftUserCurrentPwd', '', this.translateService, {
          label: `${this.translateService.instant('currentPassword')}`,
          key: 'ftUserCurrentPwd',
          rendered: true,
          layoutClass: 'p-col-12',
          styleClass: 'ftUserAllField',
          required: true,
          newPassword: false,
          hintText: `${this.translateService.instant('passwordHintText')}`,
          styleClassName: this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC ? 'labelStyleArabic' : 'labelStyleEng'
        }),
        ftUserNewPwd: new InputPasswordControl('ftUserNewPwd', '', this.translateService, {
          label: `${this.translateService.instant('newPassword')}`,
          key: 'ftUserNewPwd',
          rendered: true,
          layoutClass: 'p-col-12',
          styleClass: 'ftUserAllField',
          required: true,
          newPassword: true,
          hintText: `${this.translateService.instant('passwordHintText')}`,
          styleClassName: this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC ? 'labelStyleArabic' : 'labelStyleEng'
        }),
        ftUserConfrmPwd: new InputPasswordControl('ftUserConfrmPwd', '', this.translateService, {
          label: `${this.translateService.instant('confirmNewPassword')}`,
          key: 'ftUserConfrmPwd',
          rendered: true,
          layoutClass: 'p-col-12',
          styleClass: 'ftUserAllField',
          required: true,
          newPassword: true,
          hintText: `${this.translateService.instant('passwordHintText')}`,
          styleClassName: this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC ? 'labelStyleArabic' : 'labelStyleEng'
        }),
        spacer2: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),
        errorMessage: new TextControl('errorMessage', this.translateService, {
          key: 'errorMessage',
          label: '',
          rendered: false,
          layoutClass: 'p-col-12',
          styleClass: 'otpErrorMsg'
        }),
        ftUserSubmitBtn: new ButtonControl('ftUserSubmitBtn', this.translateService, {
          key: 'ftUserSubmitBtn',
          label: `${this.translateService.instant('submit')}`,
          rendered: true,
          btndisable: true,
          layoutClass: this.setDirection(),
          styleClass: 'ftUserSubmitBtn primaryButton'
        }),
        spacer3: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),

      });

      this.form.controls.ftUserCurrentPwd.valueChanges.subscribe(() =>
        this.form.controls.ftUserNewPwd.updateValueAndValidity());

      this.form.controls.ftUserNewPwd.valueChanges.subscribe(() =>
        this.form.controls.ftUserConfrmPwd.updateValueAndValidity());

      this.form.statusChanges.subscribe(
        status => {
          if (status === FccGlobalConstant.VALID) {
            this.patchFieldParameters(this.form.get('ftUserSubmitBtn'), { btndisable: false });
          } else {
            this.patchFieldParameters(this.form.get('ftUserSubmitBtn'), { btndisable: true });
          }
        }
      );
     }

    onClickFtUserChangeUserId() {
      const value = this.form.get('ftNewUserIdValue')[this.params][this.rendered];
      if (value === true) {
        this.patchFieldValueAndParameters(this.form.get('ftNewUserIdValue'), null, { rendered: false });
      } else {
        this.patchFieldParameters(this.form.get('ftNewUserIdValue'), { rendered: true });
      }
    }

    onBlurFtNewUserIdValue() {
        const userID = this.form.get('ftNewUserIdValue').value;
        this.commonService.checkUniqueUserID(userID).subscribe(
          res => {
            if (res.userNameExists) {
              this.form.get('ftNewUserIdValue').setErrors({ userIdExist : true });
            }
          }
        );
        const newUserID = this.form.get('ftNewUserIdValue').value;
        const newUserIDUpper = newUserID !== null ? newUserID.toUpperCase() : '';
        this.form.get('ftNewUserIdValue').setValue(newUserIDUpper);
    }

  onClickFtUserSubmitBtn() {
    if (this.commonService.getOtpAuthScreenSource() === FccGlobalConstant.PASSWORD_RESET) {
    this.callPasswordChangeApi();
    } else {
    const data = this.commonService.getLogindata();
    this.loginData = data.get('FCC_LOGIN_DATA');
    this.loginData.mode = this.loginMode;
    this.loginData.email = this.form.get('ftUserEmailId').value;
    this.loginData.phone = this.form.get('ftUserMobileNo').value;
    this.loginData.password = this.form.get('ftUserCurrentPwd').value;
    this.loginData.newPasswordValue = this.form.get('ftUserNewPwd').value;
    this.loginData.newPasswordConfirm = this.form.get('ftUserConfrmPwd').value;
    this.loginData.newUserName = this.form.get('ftNewUserIdValue').value;
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
          this.handleLogin(this.loginData, clientSideEncryptionEnabled.toString());
        }
      });
    } else if (FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption) !== '' ||
    FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption) !== null) {
        if (!this.commonService.isEmptyValue(FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption)))
        {
          clientSideEncryptionEnabled = FccGlobalConfiguration.configurationValues.get(configuredKeyClientEncryption);
        }
        this.handleLogin(this.loginData, clientSideEncryptionEnabled);
    }
  }
}

callPasswordChangeApi() {
  const badRequest = 400;
  const internalError = 500;
  this.resetPasswordData = this.commonService.getResetPasswordData();
  this.resetPasswordData.password.newPassword = this.form.controls.ftUserNewPwd.value;
  this.resetPasswordData.password.confirmPassword = this.form.controls.ftUserConfrmPwd.value;
  this.commonService.retrievePassword(this.resetPasswordData).subscribe(
    () => {
      this.retrieveCredentialsService.setResponseMessage('resetPasswordSuccess');
      this.retrieveCredentialsService.setResponseHeader('success');
      this.router.navigateByUrl(FccGlobalConstant.RESPONSE_MESSAGE_PATH);
    },
    (error: HttpErrorResponse) => {
      if (error.status === badRequest) {
        if (error.error.detail.toString().indexOf('Password does not meet the requirement') > -1) {
          this.retrieveCredentialsService.setResponseMessage('passwordRequirementError');
        } else if (error.error.detail.toString().indexOf('new password and the confirm password are not same') > -1) {
          this.retrieveCredentialsService.setResponseMessage('newConfrmpasswordMismatch');
        } else if (error.error.detail.toString().indexOf('Invalid length') > -1 ) {
          this.retrieveCredentialsService.setResponseMessage('invalidPasswordLength');
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
  );
}


  onBlurFtUserEmailId() {
    this.forgotPassword = FccGlobalConfiguration.configurationValues.get('FORGOTPASSWORD_SHOW');
    if (this.forgotPassword === 'true') {
    const data = this.commonService.getLogindata();
    const language = localStorage.getItem('language');
    this.loginData = data.get('FCC_LOGIN_DATA');
    this.loginData.email = this.form.get('ftUserEmailId').value;
    this.commonService.checkUniqueEmail(this.loginData, language).subscribe(
      res => {
        // eslint-disable-next-line no-console
        console.log(res);
      },
       (error: HttpErrorResponse) => {
        if (error.status === FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST) {
          this.form.get('ftUserEmailId').setErrors({ emailIdExist : true });
        }
      }
    );
    }
  }

  handleLogin(data: any, clientSideEncryptionEnabled: string) {
    this.patchFieldParameters(this.form.get('errorMessage'), { rendered: false, label: '' });
    if (clientSideEncryptionEnabled === 'true') {
      this.encryptionService.generateKeys().subscribe(keyDataResponse => {
          if (keyDataResponse.response === 'success') {
          const keys = keyDataResponse.keys;
          const htmlUsedModulus = keys.htmlUsedModulus;
          const crSeq = keys.cr_seq;
          data.password = this.encryptionService.encryptText(data.password, htmlUsedModulus, crSeq);
          data.newPasswordValue = this.encryptionService.encryptText(data.newPasswordValue, htmlUsedModulus, crSeq);
          data.newPasswordConfirm = this.encryptionService.encryptText(data.newPasswordConfirm, htmlUsedModulus, crSeq);
          this.form.get('ftUserCurrentPwd').setValue(data.password);
          this.form.get('ftUserNewPwd').setValue(data.newPasswordValue);
          this.form.get('ftUserConfrmPwd').setValue(data.newPasswordConfirm);
          this.callLoginAPI(data);
          }
        });
    } else {
      this.callLoginAPI(data);
    }
  }

  callLoginAPI(data: any) {
    const language = localStorage.getItem('language');
    this.source = 'change_password';
    this.commonService.login(data, language).subscribe(
      res => {
        if (res.response === 'success') {
          if (res.mode === '' || res.mode === 'credentials') {
            this.Config();
            sessionStorage.setItem('passwordReset', 'change_password');
            window[FccGlobalConstant.firstLogin] = false;
            if (!this.invalidateSessionAfterPwdChange) {
              this.source = 'login';
              window[FccGlobalConstant.changePassword] = true;
              this.commonService.putLoginData('FCC_LOGIN_DATA', data);
              this.commonService.putLoginMode('USER_ID', data.username);
              this.commonService.putLoginData('USER_EMAIL', res.objectData.email);
              this.commonService.putLoginData('USER_PHONE', res.objectData.phone);
              this.commonService.putLoginMode('LOGIN_MODE', res.mode);
              this.commonService.setBaseCurrency(res.objectData?.baseCurrency ? res.objectData.baseCurrency : '');
              if (this.showDialogBoxAfterPwdChange) {
                this.showDialogBox(res);
              } else {
                this.loginService.setNextComponent(res, this.source);
              }
            } else {
              // Changes added to show success message on successful change of password
              this.retrieveCredentialsService.setResponseMessage('resetPasswordSuccess');
              this.retrieveCredentialsService.setResponseHeader('success');
              this.router.navigateByUrl(FccGlobalConstant.RESPONSE_MESSAGE_PATH);
            }
          } else {
            this.loginService.setNextComponent(res, this.source);
          }
        } else if (res.response === 'failed') {
          this.patchFieldParameters(this.form.get('errorMessage'), { rendered: true, label: res.errorMessage });
          this.clearPasswordFields();
        } else {
          sessionStorage.removeItem('login');
          this.sessionValidation.IsSessionValid();
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST) {
          let uniqueEmailError = false;
          let oldPasswordError = false;
          let newPasswordError = false;
          let samePreviousPasswordError = false;
          if (error.error.validationFailure && error.error.validationFailure[0].field === 'email') {
            this.clearPasswordFields();
            uniqueEmailError = true;
          }
          if (error.error.validationFailure && error.error.validationFailure[0].field === 'old_password') {
            this.clearPasswordFields();
            oldPasswordError = true;
          }
          if (error.error.validationFailure && error.error.validationFailure[0].field === 'newPassword') {
            this.clearPasswordFields();
            newPasswordError = true;
          }
          if (error.error.message && error.error.message.includes('samePreviousPassword')) {
            this.clearPasswordFields();
            samePreviousPasswordError = true;
          }
          if (samePreviousPasswordError || newPasswordError || oldPasswordError || uniqueEmailError) {
            if (uniqueEmailError) {
              this.form.get('ftUserEmailId').setErrors({ emailNotUnique: true });
            }
            if (samePreviousPasswordError) {
              this.form.get('ftUserNewPwd').setErrors({ samePreviousPassword: true });
            }
            if (newPasswordError) {
              this.form.get('ftUserNewPwd').setErrors({ wrongNewPassword: true });
            }
            if (oldPasswordError) {
              this.form.get('ftUserCurrentPwd').setErrors({ wrongOldPassword: true });
            }
            this.patchFieldParameters(this.form.get('ftUserSubmitBtn'), { btndisable: true });
          }
        }
      }
    );
  }

  showDialogBox(res) {
    const showPasswordSuccess = this.dialogService.open(ConfirmationDialogComponent, {
      header: `${this.translateService.instant('passwordChangeDialogHeader')}`,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: localStorage.getItem('langDir') },
      data: {
        locaKey: this.translateService.instant('passwordChangeSuccessHome'),
        showOkButton: true,
        showNoButton: false,
        showYesButton: false
      }
    });
    showPasswordSuccess.onClose.subscribe(() => {
      this.loginService.setNextComponent(res, this.source);
    });
  }

  clearPasswordFields() {
    this.patchFieldValueAndParameters(this.form.get('ftUserCurrentPwd'), '', '');
    this.patchFieldValueAndParameters(this.form.get('ftUserNewPwd'), '', '');
    this.patchFieldValueAndParameters(this.form.get('ftUserConfrmPwd'), '', '');
  }

  initializeUserContactDetails(loginMode) {
     if (loginMode === FccGlobalConstant.CHANGE_PASSWORD_QA) {
            this.patchFieldParameters(this.form.get('firstTimeLoginModule'), { rendered: true });
            this.patchFieldParameters(this.form.get('ftUserId'), { rendered: true });
            this.patchFieldParameters(this.form.get('ftUserIdValue'), { rendered: true });
            this.patchFieldParameters(this.form.get('ftUserChangeUserId'), { rendered: true });
            this.patchFieldParameters(this.form.get('ftNewUserIdValue'), { rendered: false });
            this.patchFieldParameters(this.form.get('ftContactDetail'), { rendered: true });
            this.patchFieldParameters(this.form.get('ftUserMobileNo'), { rendered: true });
            this.patchFieldParameters(this.form.get('ftUserEmailId'), { rendered: true });
      }
  }

  onBlurFtUserNewPwd() {
    const curPwdVal = this.form.get('ftUserCurrentPwd').value;
    const newPwdVal = this.form.get('ftUserNewPwd').value;
    const confrmPwdVal = this.form.get('ftUserConfrmPwd').value;
    this.passwrdPattern = new RegExp(this.passwordCharSet);
    this.patchFieldParameters(this.form.get('errorMessage'), { rendered: false, label: '' });
    if (newPwdVal !== undefined && newPwdVal === '') {
      this.form.get('ftUserNewPwd').clearValidators();
      this.form.addFCCValidators('ftUserNewPwd', Validators.compose([Validators.required]), 0);
      this.form.get('ftUserNewPwd').updateValueAndValidity();
    } else if (newPwdVal !== '' && newPwdVal.length < this.passwordMinLength) {
      this.form.get('ftUserNewPwd').clearValidators();
      this.form.addFCCValidators('ftUserNewPwd', Validators.compose([Validators.minLength(this.passwordMinLength)]), 0);
      this.form.get('ftUserNewPwd').updateValueAndValidity();
    } else if (newPwdVal !== '' && newPwdVal.length > this.passwordMaxLength) {
      this.form.get('ftUserNewPwd').clearValidators();
      this.form.addFCCValidators('ftUserNewPwd', Validators.compose([Validators.maxLength(this.passwordMaxLength)]), 0);
      this.form.get('ftUserNewPwd').updateValueAndValidity();
    } else if (newPwdVal !== '' && this.passwrdPattern.test(newPwdVal) === false) {
      this.form.get('ftUserNewPwd').clearValidators();
      this.form.addFCCValidators('ftUserNewPwd', Validators.compose([Validators.pattern(this.passwordCharSet)]), 0);
      this.form.get('ftUserNewPwd').updateValueAndValidity();
    } else if (curPwdVal !== '' && newPwdVal !== '' && curPwdVal === newPwdVal) {
      this.form.get('ftUserNewPwd').clearValidators();
      this.form.addFCCValidators('ftUserNewPwd', Validators.compose([oldNewPassChecker]), 0);
      this.form.get('ftUserNewPwd').updateValueAndValidity();
    } else if (confrmPwdVal !== '' && newPwdVal !== '' && confrmPwdVal !== newPwdVal) {
        this.form.get('ftUserNewPwd').clearValidators();
        this.form.addFCCValidators('ftUserNewPwd', Validators.compose([confirmNewPassChecker]), 0);
        this.form.get('ftUserNewPwd').updateValueAndValidity();
   } else if (confrmPwdVal !== '' && newPwdVal !== '' && newPwdVal === confrmPwdVal) {
        this.form.get('ftUserConfrmPwd').clearValidators();
        this.form.get('ftUserNewPwd').clearValidators();
        this.form.get('ftUserConfrmPwd').updateValueAndValidity();
        this.form.get('ftUserNewPwd').updateValueAndValidity();
   } else {
      this.form.get('ftUserNewPwd').clearValidators();
      this.form.get('ftUserNewPwd').updateValueAndValidity();
    }
  }

onBlurFtUserCurrentPwd() {
    const curPwdVal = this.form.get('ftUserCurrentPwd').value;
    this.patchFieldParameters(this.form.get('errorMessage'), { rendered: false, label: '' });
    if (curPwdVal !== undefined && curPwdVal === '') {
      this.form.get('ftUserCurrentPwd').clearValidators();
      this.form.addFCCValidators('ftUserCurrentPwd', Validators.compose([Validators.required]), 0);
      this.form.get('ftUserCurrentPwd').updateValueAndValidity();
    // } else if (curPwdVal !== '' && curPwdVal.length < this.passwordMinLength) {
    //   this.form.get('ftUserCurrentPwd').clearValidators();
    //   this.form.addValidators('ftUserCurrentPwd', Validators.compose([Validators.minLength(this.passwordMinLength)]), 0);
    //   this.form.get('ftUserCurrentPwd').updateValueAndValidity();
    } else if (curPwdVal !== '' && curPwdVal.length > this.passwordMaxLength) {
      this.form.get('ftUserCurrentPwd').clearValidators();
      this.form.addFCCValidators('ftUserCurrentPwd', Validators.compose([Validators.maxLength(this.passwordMaxLength)]), 0);
      this.form.get('ftUserCurrentPwd').updateValueAndValidity();
    } else {
      this.form.get('ftUserCurrentPwd').clearValidators();
      this.form.get('ftUserCurrentPwd').updateValueAndValidity();
    }
  }
  onBlurFtUserConfrmPwd() {
    const curPwdVal = this.form.get('ftUserCurrentPwd').value;
    const newPwdVal = this.form.get('ftUserNewPwd').value;
    const confrmPwdVal = this.form.get('ftUserConfrmPwd').value;
    this.passwrdPattern = new RegExp(this.passwordCharSet);
    this.patchFieldParameters(this.form.get('errorMessage'), { rendered: false, label: '' });
    if (this.loginMode === FccGlobalConstant.CHANGE_PASSWORD) {
  this.resetErrors();
  }
    if (confrmPwdVal !== undefined && confrmPwdVal === '') {
      this.form.get('ftUserConfrmPwd').clearValidators();
      this.form.addFCCValidators('ftUserConfrmPwd', Validators.compose([Validators.required]), 0);
      this.form.get('ftUserConfrmPwd').updateValueAndValidity();
    } else if (confrmPwdVal !== '' && confrmPwdVal.length < this.passwordMinLength) {
      this.form.get('ftUserConfrmPwd').clearValidators();
      this.form.addFCCValidators('ftUserConfrmPwd', Validators.compose([Validators.minLength(this.passwordMinLength)]), 0);
      this.form.get('ftUserConfrmPwd').updateValueAndValidity();
    } else if (confrmPwdVal !== '' && confrmPwdVal.length > this.passwordMaxLength) {
      this.form.get('ftUserConfrmPwd').clearValidators();
      this.form.addFCCValidators('ftUserConfrmPwd', Validators.compose([Validators.maxLength(this.passwordMaxLength)]), 0);
      this.form.get('ftUserConfrmPwd').updateValueAndValidity();
    } else if (confrmPwdVal !== '' && this.passwrdPattern.test(confrmPwdVal) === false) {
      this.form.get('ftUserConfrmPwd').clearValidators();
      this.form.addFCCValidators('ftUserConfrmPwd', Validators.compose([Validators.pattern(this.passwordCharSet)]), 0);
      this.form.get('ftUserConfrmPwd').updateValueAndValidity();
    } else if (confrmPwdVal !== '' && newPwdVal !== '' && newPwdVal !== confrmPwdVal) {
      this.form.get('ftUserConfrmPwd').clearValidators();
      this.form.addFCCValidators('ftUserConfrmPwd', Validators.compose([newconfirmPassChecker]), 0);
      this.form.get('ftUserConfrmPwd').updateValueAndValidity();
    } else if (curPwdVal !== '' && confrmPwdVal !== '' && curPwdVal === confrmPwdVal) {
        this.form.get('ftUserConfrmPwd').clearValidators();
        this.form.addFCCValidators('ftUserConfrmPwd', Validators.compose([oldNewPassChecker]), 0);
        this.form.get('ftUserConfrmPwd').updateValueAndValidity();
    } else if (confrmPwdVal !== '' && newPwdVal !== '' && newPwdVal === confrmPwdVal) {
        this.form.get('ftUserConfrmPwd').clearValidators();
        this.form.get('ftUserNewPwd').clearValidators();
        this.form.get('ftUserConfrmPwd').updateValueAndValidity();
        this.form.get('ftUserNewPwd').updateValueAndValidity();
    } else {
      this.form.get('ftUserConfrmPwd').clearValidators();
      this.form.get('ftUserConfrmPwd').updateValueAndValidity();
    }
  }

  onPasteFtUserCurrentPwd(e) {
    e.preventDefault();
  }

  onPasteFtUserNewPwd(e) {
    e.preventDefault();
  }

  onPasteFtUserConfrmPwd(e) {
    e.preventDefault();
  }

  Config() {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.logoFilePath = this.contextPath + response.logoFilePath;
        this.homeUrl = response.homeUrl;
        this.invalidateSessionAfterPwdChange = response.invalidateSessionAfterPwdChange;
        this.showDialogBoxAfterPwdChange = response.showDialogBoxAfterPwdChange;
      }
    });
  }
resetErrors(){
    this.form.get('ftUserEmailId').setErrors(null);
    this.form.get('ftUserMobileNo').setErrors(null);
}
}
