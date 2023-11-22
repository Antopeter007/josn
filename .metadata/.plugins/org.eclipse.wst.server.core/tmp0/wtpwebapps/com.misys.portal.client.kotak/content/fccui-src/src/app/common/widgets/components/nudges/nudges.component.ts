import { FccConstants } from './../../../core/fcc-constants';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../../common/services/common.service';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { FccGlobalConstantService } from '../../../../common/core/fcc-global-constant.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-nudges',
  templateUrl: './nudges.component.html',
  styleUrls: ['./nudges.component.scss']
})
export class NudgesComponent implements OnInit {
  currentNudge: any;
  displayDialog = false;
  dir = localStorage.getItem('langDir');
  @Input() nudges: any[];
  constructor(protected router: Router, public commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected http: HttpClient) { }

  ngOnInit(): void {
    //eslint : no-empty-function
  }

  navigateToLink(item) {
    if (item.httpMethod?.toUpperCase() === FccConstants.POST){
      this.commonService.generateToken().subscribe(response => {
        if (response) {
          const ssoToken = response.SSOTOKEN;
          const queryParameter = item.queryParameter;
          const headerType = item.headerParameters as string;
          if (headerType.toUpperCase() === FccConstants.HEADER && queryParameter){
              const headerObject = {
                [queryParameter] : ssoToken
              };
              const headers = new HttpHeaders(headerObject);
              return this.http.post<any>(item.url, item.bodyParameters, { headers });
          } else if (item.headerParameters === 'url' && queryParameter){
            const url = item.url + '?' + queryParameter + '=' + ssoToken;
            return this.http.post<any>(url, item.bodyParameters);
          }
        }
    });
   } else if (item.urlType === FccGlobalConstant.INTERNAL && this.commonService.isNonEmptyValue(item.urlScreenType)
    && item.urlScreenType !== '') {
      const urlScreenType = item.urlScreenType as string;
      if (urlScreenType.toUpperCase() === FccGlobalConstant.ANGULAR_UPPER_CASE) {
        this.commonService.redirectToLink(item.url);
      } else {
        const urlContext = this.commonService.getContextPath();
        const dojoUrl = urlContext + this.fccGlobalConstantService.servletName + item.url;
        this.router.navigate([]).then(() => {
          window.open(dojoUrl, FccGlobalConstant.SELF);
        });
      }
    } else if (item.urlType === FccGlobalConstant.EXTERNAL) {
      if (item.securityType === FccGlobalConstant.SSO) {
        this.commonService.generateToken().subscribe(response => {
          if (response) {
            const ssoToken = response.SSOTOKEN;
            const queryParameter = item.queryParameter;
            const headerObject = {
              [queryParameter] : ssoToken
            };
            const headers = new HttpHeaders(headerObject);
            this.http.get<any>(item.url, { headers }).subscribe( () => {
              window.open(item.url, FccGlobalConstant.BLANK);
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (error) => {
              window.open(item.url, FccGlobalConstant.BLANK);
            }
            );
          }
        });
      }else {
        this.displayDialog = true;
        this.currentNudge = item;
      }
    } else if (item.urlType === FccGlobalConstant.IFRAME) {
      if (item.securityType === FccGlobalConstant.SSO) {
        this.commonService.iframeURL = item.url;
        this.commonService.deepLinkingQueryParameter = item.queryParameter;
        this.router.navigate(['/sso-deeplink-url']);
      } else{
        this.commonService.iframeURL = item.url;
        this.router.navigate(['/iframe']);
      }
    }
  }

  navigateToExternalUrl() {
    this.displayDialog = false;
    window.open(this.currentNudge.url, FccGlobalConstant.BLANK);
  }

  nudgeLength(nudges){
      const styles = {
    'justify-content': nudges?.length === 1 ? 'flex-start' : 'space-around'
    };
      return styles;
  }
}
