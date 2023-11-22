
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LogoutRequest } from '../model/logout-request';
import { UserData } from '../model/user-data';
import { CommonService } from '../services/common.service';
import { LogoutService } from '../services/logout-service';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {

  logoutRequest: LogoutRequest = new LogoutRequest();
  userData: UserData = new UserData();
  globalDashboardUrl: any;
  constructor(protected router: Router, protected commonService: CommonService,
              protected logout: LogoutService) { }

 async canActivate(
    ): Promise<boolean> {
    const isLoggedIn = await this.commonService.checkLoggedIn();
    if (isLoggedIn === true) {
      this.commonService.getDashboardUrl();
      this.router.navigate([this.commonService.globalDashboardUrl]);
    } else {
        if (this.commonService.getOnDemandTimedLogout() === true) {
          return true;
        } else {
          sessionStorage.removeItem('login');
          this.router.navigate(['/login']);
        }
    }
  }
}
