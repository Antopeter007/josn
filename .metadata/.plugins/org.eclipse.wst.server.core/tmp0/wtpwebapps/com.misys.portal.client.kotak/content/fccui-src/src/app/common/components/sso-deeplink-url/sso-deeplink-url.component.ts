import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sso-deeplink-url',
  templateUrl: './sso-deeplink-url.component.html',
  styleUrls: ['./sso-deeplink-url.component.scss']
})
export class SsoDeeplinkUrlComponent implements OnInit{

iframehtml: SafeResourceUrl;
@Input() urlReq: any;
@Input() deepLinkingQueryParameter: any;
globalDashboardUrl: any;

constructor(protected commonService: CommonService,
  private sanitizer: DomSanitizer, //eslint-disable-line @typescript-eslint/no-parameter-properties
  protected router: Router) { } 

ngOnInit(): void {
  this.urlReq = this.commonService.iframeURL;
  this.deepLinkingQueryParameter = this.commonService.deepLinkingQueryParameter;
  if (this.commonService.isNonEmptyValue(this.urlReq) && this.commonService.isNonEmptyValue(this.deepLinkingQueryParameter)) {
    this.commonService.generateToken().subscribe(response => {
    if (response) {
      const ssoToken = response.SSOTOKEN;
      this.iframehtml = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlReq + '?' + this.deepLinkingQueryParameter + '=' + ssoToken);
    }
    });
  }
  else {
    this.commonService.getDashboardUrl();
    this.router.navigate([this.commonService.globalDashboardUrl]);
  }
}
}
