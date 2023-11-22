import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { SessionValidateService } from './session-validate-service';
import { Router } from '@angular/router';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { PlatformLocation } from '@angular/common';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { FccGlobalConfiguration } from '../core/fcc-global-configuration';
import { EncryptionService } from './encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  contextPath: any;
  landingPageEnabled: any;
  constructor(public commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected router: Router, protected fccGlobalConstantService: FccGlobalConstantService,
              protected fccGlobalConfiguration: FccGlobalConfiguration, protected encryptionService: EncryptionService) { }

  setNextComponent(res: any, source: any) {
    this.contextPath = this.commonService.getContextPath();
    let url = '';
    if (
      this.contextPath !== undefined &&
      this.contextPath !== null &&
      this.contextPath !== ''
    ) {
      url = this.contextPath;
    }
    const loginData = this.commonService.getLogindata();
    switch (res.mode) {
      case '':
        case 'credentials': if (res.mode === '')
        {
          this.encryptionService.getAPIParamEncryptionKeys();
        }
        if (source === 'login' || source === 'terms_and_condition' || source === 'login_mfa') {
                              if ((res.mode === '' || res.mode === 'credentials') && res.classicUXHome === false ) {
                               this.handleNonClassicUXHome(res, loginData);
                              } else if (res.classicUXHome === true) {
                               this.handleClassicUXHome(res, loginData, url);
                              }
                             } else if (source === 'change_password') {
                                sessionStorage.setItem('passwordReset', 'change_password');
                                this.sessionValidation.IsSessionValid();
                            }
                            break;
        case 'accept_terms' : this.resModeAcceptTerms(res);
                              this.router.navigate(['/terms-and-condition']);
                              break;
        case 'otp_auth' : this.router.navigate(['/login-mfa']);
                              break;
        case 'change_password_qa':
        case 'change_password' : this.router.navigate(['/change-password']);
                                 break;
        case 'otp_auth_validate' : break;
        default: this.sessionValidation.IsSessionValid();
    }
  }

  resModeAcceptTerms(res: any) {
    if (res.mode === 'accept_terms') {
      this.commonService.putTermsAndConditionData('TandCdata', res.objectData.tandctext);
    }
  }

  handleNonClassicUXHome(res: any, loginData: any) {
    let isOIDCEnabled = 'false';
    const configuredKeyOidcEnabled = 'OIDC_ENABLED';
    let keyNotFoundList = [];
    keyNotFoundList = this.fccGlobalConfiguration.configurationValuesCheck(configuredKeyOidcEnabled);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.landingPageEnabled = response.showLandingPage;
      }
    });
    if (keyNotFoundList.length !== 0) {
      this.commonService.loadDefaultConfiguration().subscribe(response => {
        if (response) {
         isOIDCEnabled = response.isOIDCEnabled;
        }
      });
       this.commonService.getConfiguredValues(keyNotFoundList.toString()).subscribe(response => {
         if (response) {
          if (!this.commonService.isEmptyValue(response.OIDC_ENABLED))
          {
            isOIDCEnabled = response.OIDC_ENABLED;
          }
          this.fccGlobalConfiguration.addConfigurationValues(response, keyNotFoundList);
          this.handleURLHandlingForNonClassicUX(res, loginData, isOIDCEnabled.toString());
         }
       });
     } else if (FccGlobalConfiguration.configurationValues.get(configuredKeyOidcEnabled) !== '' ||
     FccGlobalConfiguration.configurationValues.get(configuredKeyOidcEnabled) !== null) {
      isOIDCEnabled = FccGlobalConfiguration.configurationValues.get(configuredKeyOidcEnabled);
      this.handleURLHandlingForNonClassicUX(res, loginData, isOIDCEnabled);
     }
  }

  handleURLHandlingForNonClassicUX(res: any, loginData: any, isOIDCEnabled: any) {
    if (res.redirectionURL !== null && res.redirectionURL !== '' && res.redirectionURL !== undefined
    && (res.redirectionURL).indexOf('oauth') > -1 && isOIDCEnabled === 'true') {
      window.open(res.redirectionURL, '_self');
    } else {
    this.commonService.checkLandingPage().subscribe(response => {
      if (
          response.errorMessage &&
          response.errorMessage === 'SESSION_INVALID'
        ) {
          this.sessionValidation.IsSessionValid();
        } else if (res.redirectionURL !== null && res.redirectionURL !== '') {
          if (loginData.get(FccGlobalConstant.REDIRECT_URL) !== '' && loginData.get(FccGlobalConstant.REDIRECT_URL) !== undefined) {
            let dojoUrl = '';
            this.commonService.putLoginData(FccGlobalConstant.REDIRECT_URL, '');
            dojoUrl = res.redirectionURL;
            this.router.navigate([]).then(() => {
              window.open(dojoUrl, '_self');
            });
          } else {
            this.router.navigateByUrl(res.redirectionURL);
          }
        } else if (this.landingPageEnabled && response.showlandingpage === 'Y') {
          this.router.navigate(['/landing']);
        } else {
          this.commonService.setLandingPage('N');
          this.commonService.getDashboardUrl();
          this.router.navigate([this.commonService.globalDashboardUrl]);
        }
      });
    }
  }

  handleClassicUXHome(res: any, loginData: any, url: any) {
    let dojoUrl = '';
    const dojoHome = this.fccGlobalConstantService.servletName + '/screen?classicUXHome=true';
    sessionStorage.setItem('dojoAngularSwitch', 'true');
    if (res.redirectionURL !== null && res.redirectionURL !== '') {
      if (loginData.get(FccGlobalConstant.IS_ANGULAR_URL) !== '' &&
       loginData.get(FccGlobalConstant.IS_ANGULAR_URL) === true) {
        dojoUrl = url + dojoHome;
        this.commonService.putLoginData(FccGlobalConstant.IS_ANGULAR_URL, '');
      } else {
        dojoUrl = res.redirectionURL;
      }
    } else {
      dojoUrl = url + dojoHome;
    }
    this.router.navigate([]).then(() => {
      window.open(dojoUrl, '_self');
    });
  }

  checkValidSession(currentMode: any) {
      if (currentMode === undefined) {
         this.sessionValidation.clearSession(true);
     }
   }

  preLoginBackBtnCheck(location: PlatformLocation) {
    location.onPopState(() => {
      let preLoginCondition = true;
      FccGlobalConstant.PRE_LOGIN_VALID_LANDING_PAGES.forEach(
        (url) => {
          if (!(location.hash.indexOf(url) > -1)) {
            preLoginCondition = false;
          }
        });
      if (preLoginCondition) {
        this.sessionValidation.clearSession(true);
        return false;
      } else {
        return true;
      }
    });
  }
}
