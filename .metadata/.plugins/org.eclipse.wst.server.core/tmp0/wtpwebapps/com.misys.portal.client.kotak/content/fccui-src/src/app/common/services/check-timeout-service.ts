import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { interval } from 'rxjs';

import { FccGlobalConstant } from '../../common/core/fcc-global-constants';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { LogoutRequest } from '../model/logout-request';
import { UserData } from '../model/user-data';
import { CommonService } from './common.service';
import { LogoutService } from './logout-service';
import { ResponseService } from './response.service';
import { SessionValidateService } from './session-validate-service';

@Injectable()
export class CheckTimeoutService {

  public sessionTimeOut = false;
  idleState = FccGlobalConstant.IDLE_NOT_STARTED;
  timedOut = false;
  lastPing?: Date = null;
  module: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  observable: any;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  idleTimeOutEvent: any;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeOutEvent: any;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  warningEvent: any;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseMessage: any;
  logoutRequest: LogoutRequest = new LogoutRequest();
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  contextPath: any;
  logoFilePath: string;
  homeUrl: string;
  userData: UserData = new UserData();
  subscriptions: Subscription[]= [];
  idleAlertRequiredFlag: boolean = true;
  constructor(protected idle: Idle,
              protected keepalive: Keepalive,
              protected translateService: TranslateService,
              protected dialogService: DialogService,
              protected sessionValidation: SessionValidateService,
              protected commonService: CommonService,
              protected router: Router,
              protected responseService: ResponseService,
              protected logoutService: LogoutService,
              protected fccGlobalConstantService: FccGlobalConstantService ) {
  }
  idleTimeOut(sessionIdle, sessionTime) {
    // sets an idle timeout from turbine.properties.
    this.idle.setIdle(parseInt(sessionIdle, 10));
    // sets a timeout period offrom turbine.properties. after the defined seconds of inactivity, the user will be considered timed out.
    const timeOut = sessionTime - sessionIdle;
    this.idle.setTimeout(timeOut);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.subscriptions.push(
    this.idle.onIdleEnd.subscribe(() => this.idleState = FccGlobalConstant.IDLE_NOT_AVAIALABLE));
    this.timeOutEvent = this.idle.onTimeout.subscribe(() => {
      this.idleState = FccGlobalConstant.IDLE_TIMED_OUT;
      this.timedOut = true;
      localStorage.setItem('sessionInvalid', 'sessionInvalid');
      this.sessionValidation.IsSessionValid();
      this.resetTimeOut();
    });
    this.idleTimeOutEvent = this.idle.onIdleStart.subscribe(async () => {
      if (this.dialogService.dialogComponentRef) {
        this.dialogService.dialogComponentRef.destroy();
      }
      if(this.idleAlertRequiredFlag){
        this.idleState = FccGlobalConstant.IDLE_STATE;
        this.commonService.putSessionFlag('idleFlag', 'true');
        this.commonService.openSessionWarningDialog$.next('idleFlag');
      }
    });
    this.warningEvent = this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = FccGlobalConstant.IDLE_COUNTDOWN + countdown + FccGlobalConstant.IDLE_SECONDS;
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(FccGlobalConstant.LENGTH_15);
    this.subscriptions.push(
    this.keepalive.onPing.subscribe(() => this.lastPing = new Date()));
    this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = FccGlobalConstant.IDLE_STARTED;
    this.timedOut = false;
  }

  stopIdle() {
    this.idle.stop();
  }

  sessionDurationTimeout(sessionMaxDurationAlert, sessionMaxDuration) {
    let seconds = sessionMaxDuration;
    this.observable = interval(FccGlobalConstant.LENGTH_1000).subscribe( () => {
      if (seconds === 0) {
        if (this.dialogService.dialogComponentRef) {
          this.dialogService.dialogComponentRef.destroy();
        }
        this.commonService.putSessionFlag('sessionMaxFlag', 'true');
        this.commonService.openSessionWarningDialog$.next('sessionMaxFlag');
        sessionStorage.removeItem('login');
        this.observable.unsubscribe();
      }
      if (seconds !== 0 ) {
          seconds = seconds - 1;
      }
      if (seconds === (sessionMaxDuration - sessionMaxDurationAlert)) {
        this.idleAlertRequiredFlag = false;
        if (this.dialogService.dialogComponentRef) {
          this.dialogService.dialogComponentRef.destroy();
        }
        this.commonService.putSessionFlag('sessionAlertFlag', 'true');
        this.commonService.openSessionWarningDialog$.next('sessionAlertFlag');
       }
    });
  }

  resetTimeOut() {
    if(this.idleTimeOutEvent)
    {
      this.idleTimeOutEvent.unsubscribe();
    }
    if(this.warningEvent)
    {
      this.warningEvent.unsubscribe();
    }
    if(this.timeOutEvent)
    {
      this.timeOutEvent.unsubscribe();
    }
    if(this.observable)
    {
      this.observable.unsubscribe();
    }
  }

  sessionLogin() {
    this.Config();
    this.logoutRequest.userData = this.userData;
    this.logoutRequest.requestData = null;
    this.logoutRequest.userData.company = null;
    this.logoutRequest.userData.username = null;
    this.logoutRequest.userData.userSelectedLanguage = null;
    this.subscriptions.push(
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
            let logoutDojoUrl = '';
            const dontShowRouter = 'dontShowRouter';
            logoutDojoUrl = this.fccGlobalConstantService.contextPath;
            logoutDojoUrl = logoutDojoUrl + this.fccGlobalConstantService.servletName + '#/logout';
            const loginUrl = this.fccGlobalConstantService.contextPath + this.fccGlobalConstantService.servletName + '#/login';
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.router.navigate([]).then(result => {
              window[dontShowRouter] = false;
              const dojoContentElement = document.querySelector('.colmask');
              if (dojoContentElement && dojoContentElement !== undefined) {
                (dojoContentElement as HTMLElement).style.display = 'none';
              }
              window.open(logoutDojoUrl, '_self');
              window.open(loginUrl, '_self');
            });

        }));
  }

  Config() {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.subscriptions.push(
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.logoFilePath = this.contextPath + response.logoFilePath;
        this.homeUrl = response.homeUrl;
      }
    }));
  }
}
