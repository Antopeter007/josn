import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FccGlobalConstantService } from '../../common/core/fcc-global-constant.service';
import { LogoutService } from '../../common/services/logout-service';
import { LogoutRequest } from '../../common/model/logout-request';
import { ResponseService } from '../../common/services/response.service';
import { CommonService } from '../../common/services/common.service';
import { DialogService } from 'primeng/dynamicdialog';
import { UserData } from '../../common/model/user-data';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { MessageService } from 'primeng';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SessionValidateService {
  logoutRequest: LogoutRequest = new LogoutRequest();
  userData: UserData = new UserData();
  responseMessage;
  contextPath: any;
  logoFilePath: string;
  homeUrl: string;

  constructor(
    protected http: HttpClient,
    protected logoutService: LogoutService,
    protected responseService: ResponseService,
    protected router: Router,
    protected commonService: CommonService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected dialogService: DialogService,
    protected translateService: TranslateService,
    protected messageService: MessageService
  ) {}

  IsSessionValid() {
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
        if (data.response === 'success') {
          this.responseMessage = data.message;
          this.responseService.setResponseMessage(data.message);
          this.commonService.setOnDemandTimedLogout(true);
          localStorage.removeItem('language');
          localStorage.removeItem('langDir');
          localStorage.removeItem('form-dirty');
          localStorage.removeItem('formDestroy');
          localStorage.removeItem('isLanguagedChangedFlag');
          sessionStorage.removeItem('dojoAngularSwitch');
          sessionStorage.removeItem('chatbot');
          sessionStorage.removeItem('baseCurrency');
          sessionStorage.removeItem('logInCheck');
          sessionStorage.removeItem('login');
          sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
          sessionStorage.setItem('isForceLogout', 'true');
          this.commonService.clearCachedResponses();
          this.messageService.add({
            key: 'loginKey',
            severity: 'success',
            summary: `${this.translateService.instant('forceLogoutHeader')}`,
            detail: `${this.translateService.instant('forceLogoutMsg')}`,
          });
          this.router.navigate(['/logout']);
          this.router.navigate(['/login']);
          // This is to put a delay before reloding in case of force logout.
          setTimeout(() => {
            sessionStorage.removeItem('isForceLogout');
            window.location.reload();
          }, FccGlobalConstant.MFA_TIMER_INTERVAL);

        } else if (data.response === 'failed') {
          localStorage.removeItem('language');
          localStorage.removeItem('langDir');
          sessionStorage.removeItem('dojoAngularSwitch');
          sessionStorage.removeItem('chatbot');
          sessionStorage.removeItem('baseCurrency');
          sessionStorage.removeItem('logInCheck');
          sessionStorage.removeItem('login');
          sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
          sessionStorage.setItem('isForceLogout', 'true');
          this.messageService.add({
            key: 'loginKey',
            severity: 'success',
            summary: `${this.translateService.instant('forceLogoutHeader')}`,
            detail: `${this.translateService.instant('forceLogoutMsg')}`,
          });
          this.router.navigate(['']);
          this.router.navigate(['/login']);
          // This is to put a delay before reloding in case of force logout.
          setTimeout(() => {
            sessionStorage.removeItem('isForceLogout');
            window.location.reload();
          }, FccGlobalConstant.MFA_TIMER_INTERVAL);
        }
      });
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

  clearSession(routeToLogin) {
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
      if (data.response === 'success') {
        this.responseMessage = data.message;
        this.responseService.setResponseMessage(data.message);
        this.commonService.setOnDemandTimedLogout(true);
        localStorage.removeItem('language');
        localStorage.removeItem('langDir');
        localStorage.setItem('language', 'en');
        localStorage.setItem('langDir', 'ltr');
        localStorage.removeItem('isLanguagedChangedFlag');
        sessionStorage.removeItem('dojoAngularSwitch');
        sessionStorage.removeItem('baseCurrency');
        sessionStorage.removeItem('logInCheck');
        sessionStorage.removeItem('login');
        sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
        this.commonService.clearCachedResponses();
        this.commonService.clearLoginDataMap();
        this.commonService.clearLoginModeMap();
        if (routeToLogin) {
          this.router.navigate(['/login']);
        }
      } else if (data.response === 'failed') {
        this.router.navigate(['/login']);
      }
    });
  }
}
