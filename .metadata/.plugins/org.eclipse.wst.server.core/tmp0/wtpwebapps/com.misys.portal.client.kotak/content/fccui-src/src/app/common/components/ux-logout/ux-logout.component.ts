import { FccGlobalConstant } from './../../core/fcc-global-constants';
import { LeftSectionService } from '../../../corporate/common/services/leftSection.service';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { CommonService } from './../../services/common.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { UserFeedbackService } from '../../services/feedback-service';
import { FeedbackRequest } from '../../model/feedback-request';
import { ResponseService } from '../../services/response.service';
import { CheckTimeoutService } from '../../services/check-timeout-service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionValidateService } from '../../services/session-validate-service';
import { FccGlobalConfiguration } from '../../core/fcc-global-configuration';

@Component({
  selector: 'fcc-common-ux-logout',
  templateUrl: './ux-logout.component.html',
  styleUrls: ['./ux-logout.component.scss']
})
export class UxLogoutComponent implements OnInit {

  feedbackSubmittedValue: boolean;
  invalidFeedbackValue: boolean;
  isTimedOutValue: boolean;
  charactersEnteredValue;
  responseMessage;
  imagePath;
  feedbackForm: UntypedFormGroup;
  feedbackRequest: FeedbackRequest = new FeedbackRequest();
  rating = 0;
  contextPath: any;
  starRatingSize: any;
  feedbackCharLength: any;
  loginImageFilePath: any;
  homeUrl;
  dirPaddingStyle;
  dirPaddingLogo;
  value = 0;
  i: any;
  enableLogoutRating: boolean;
  url: any;
  dir: string = localStorage.getItem('langDir');

  constructor(protected feedback: UserFeedbackService, protected responseService: ResponseService,
              protected sessionTimeout: CheckTimeoutService, protected fb: UntypedFormBuilder,
              protected route: ActivatedRoute, protected commonService: CommonService,
              protected translate: TranslateService, protected router: Router,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected sessionValidation: SessionValidateService,
              protected leftSectionService: LeftSectionService,
              protected checkTimeoutService: CheckTimeoutService,
              protected fccGlobalConfiguration: FccGlobalConfiguration
              ) {
    this.translate.setDefaultLang('en');

    const starrating = 5;
    const feedbackcharlength = 6500;
    this.starRatingSize = this.commonService.getStarRatingSize() !== undefined ? this.commonService.getStarRatingSize() : starrating;
    this.feedbackCharLength = this.commonService.getfeedbackCharLength() !== undefined ?
    this.commonService.getfeedbackCharLength() : feedbackcharlength;

    this.homeUrl = this.commonService.getHomeUrl();
    if ( this.checkTimeoutService.idleTimeOutEvent) {
    this.checkTimeoutService.resetTimeOut();
    }
  }

  getDate(): string {
    const currentdate = new Date();
    return currentdate.toISOString();
  }

  ngOnInit() {
    sessionStorage.removeItem('chatbot');
    sessionStorage.removeItem('dojoAngularSwitch');
    sessionStorage.removeItem('baseCurrency');
    sessionStorage.removeItem('logInCheck');
    sessionStorage.removeItem('amountConfig');
    sessionStorage.removeItem('logInCheck');
    sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    sessionStorage.removeItem('login');

    const keys : any [] = Object.keys(sessionStorage);
    keys.forEach(key => {
      if(key.indexOf('preference') >= 0) {
        sessionStorage.removeItem(key);
      }
    });
    this.resetLCForm();
    this.config();
    // to be removed once header-footer of old UI are handled
    const e = document.getElementsByClassName('header')[0] as any;
    if (e && e.style) {
      e.style.display = 'none';
    }

    this.feedbackForm = this.fb.group({
        date_time:  '',
        feedback: ['', Validators.maxLength(this.feedbackCharLength)],
        rating: 0,
        location: ''
    });
    if (this.translate.currentLang === 'ar') {
      this.dirPaddingStyle = 'p-grid right-body';
      this.dirPaddingLogo = 'p-grid right-logo';
    } else {
      this.dirPaddingStyle = 'p-grid left-body';
      this.dirPaddingLogo = 'p-grid left-logo';
    }
  }

  get feedbackSubmitted(): boolean {
    return this.feedbackSubmittedValue;
  }

  get invalidFeedback(): boolean {
    return this.invalidFeedbackValue;
  }

  get charactersEntered() {
    this.charactersEnteredValue = this.feedbackForm.get('feedback').value.length;
    return this.charactersEnteredValue;
  }

  onSubmit() {
    const timeout = 5000;
    this.feedbackRequest.feedbackTime = this.getDate();
    this.feedbackRequest.feedback = this.feedbackForm.get('feedback').value;
    this.feedbackRequest.rating = this.rating;
    this.feedback.submitFeedback(this.fccGlobalConstantService.getSubmitFeedbackUrl(), this.feedbackRequest
    ).subscribe(
      data => {
        if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else if (data.response && data.response === 'REST_API_SUCCESS') {
          this.responseMessage = data.message;
          this.responseService.setResponseMessage(data.message);
          this.feedbackSubmittedValue = true;
          this.invalidFeedbackValue = false;
          this.feedbackForm.get('feedback').setValue('');
          this.rating = 0;
          setTimeout(() => {
            this.router.navigate(['']);
          }, timeout);
        } else {
          this.invalidFeedbackValue = true;
          this.feedbackSubmittedValue = false;
        }
      }
    );
  }

  goToLogin() {
    // OIDC SSO Enabled Scenario handling
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
            sessionStorage.removeItem('login');
            this.router.navigate(['/login']);
            window.location.reload();
          } else {
            window[FccGlobalConstant.firstLogin] = false;
            sessionStorage.removeItem('login');
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      sessionStorage.removeItem('login');
      this.router.navigate(['/login']);
    }
  }

  goToHome() {
    window.open(this.homeUrl);
  }

  resetForm() {
    this.feedbackSubmittedValue = false;
  }

  config() {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(
      response => {
        if (response) {
          this.imagePath = this.contextPath + response.logoFilePath;
          this.loginImageFilePath = this.contextPath + response.loginImageFilePath;
          this.enableLogoutRating = response.enableLogoutRating;
        }
      }
    );
  }

  resetLCForm() {
    this.leftSectionService.progressBarData.subscribe(
      data => {
        this.value = data;
      }
    );
    this.leftSectionService.progressBarData.next(0);
    // if (this.leftSectionService.items !== undefined) {
    //    for (this.i of this.leftSectionService.items) {
    //           this.i.styleClass = '';
    //         }
    // }
    // this.leftSectionService.highlightMenuSection.next(0);
  }


}
