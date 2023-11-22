import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, GuardsCheckEnd, NavigationCancel, NavigationStart, Router } from '@angular/router';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { TransactionDetailService } from '../services/transactionDetail.service';
import { CommonService } from './../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  previousUrl: string;
  observable: any;
  loginMode: any;
  globalDashboardUrl: any;
  constructor(protected router: Router, protected commonService: CommonService,
              protected route: ActivatedRoute, protected transactionDetailService: TransactionDetailService) {
  }
async canActivate(
    route: ActivatedRouteSnapshot): Promise<boolean> {

    const mode = this.commonService.getLoginMode();
    this.loginMode = mode.get('LOGIN_MODE');
    const paramsData = route.queryParams;
    const path = route.routeConfig.path;
    const id = route.queryParams.tnxId;
    const logInCheck = await this.commonService.checkLoggedIn();
    const logoutCheck = window[FccGlobalConstant.LOGOUT_CHECK];
    const loginData = this.commonService.getLogindata();
    sessionStorage.setItem('logInCheck', logInCheck.toString());
    const prevUrl = loginData.get('PREVIOUS_URL');
    if ( this.loginMode === FccGlobalConstant.CHANGE_PASSWORD ||
       this.loginMode === FccGlobalConstant.CHANGE_PASSWORD_QA) {
        return false;
    } else if (logInCheck === true && logoutCheck !== 'true') {
      sessionStorage.setItem('login', 'valid');
      if (prevUrl !== '' && prevUrl !== undefined) {
        this.commonService.putLoginData('PREVIOUS_URL', '');
      }
      if (path === 'productScreen' && id) {
        const checkTnxStatus = await this.checkStatus(paramsData);
        if (checkTnxStatus) { return true; }
        else {
          this.commonService.getDashboardUrl();
          this.router.navigate([this.commonService.globalDashboardUrl]);
          return false;
        }
      }
      return true;
    } else {
      this.observable = this.router.events.subscribe(e => {
        if (e instanceof NavigationStart || e instanceof GuardsCheckEnd || e instanceof NavigationCancel) {
          if (sessionStorage.getItem('login') && e.url !== '/login') {
            this.previousUrl = e.url;
            this.commonService.putLoginData('PREVIOUS_URL', e.url);
            this.observable.unsubscribe();
            sessionStorage.setItem('isForceLogout', 'true');
            sessionStorage.removeItem('login');
            this.router.navigate(['/login']);
            window[FccGlobalConstant.LOGOUT_CHECK] = 'false';
            return false;
          } else {
            this.observable.unsubscribe();
            this.router.navigate(['/login']);
            return false;
          }
        }
      });

    }
  }

  async checkStatus(params: any): Promise<boolean> {
    const productCode = params.productCode;
    const subProductCode = params.subProductCode;
    const id = params.tnxId;
    let isAccessible = false;
    await this.transactionDetailService.fetchTransactionDetails(id, productCode, false, subProductCode).toPromise().then(
      (res) => {
        const responseObj = res.body;
        if (parseInt(responseObj.tnx_stat_code, 10) === 1 || parseInt(responseObj.tnx_stat_code, 10) === 4) {
          isAccessible = true;
        } else {
          isAccessible = false;
        }
      }
    );
    return isAccessible;
  }
}
