import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-iframe-deeplink-url',
  templateUrl: './iframe-deeplink-url.component.html',
  styleUrls: ['./iframe-deeplink-url.component.scss']
})
export class IframeDeeplinkUrlComponent implements OnInit {
  urlParam: any;
  URL: any;
  payLoad: any;
  deepLinkURLType: any;
  iframehtml: any;
  @Input() urlReq: any[];

  constructor(protected commonService: CommonService) { }

  ngOnInit(): void {
    this.urlReq = this.commonService.iframeURL;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.deepLinkURLType = response.deepLinkUrl;
      }
      });
    this.commonService.generateToken().subscribe(response => {
      if (response) {
        const ssoToken = response.SSOTOKEN;
        if (this.deepLinkURLType) {
          this.formPayload(this.urlReq);
        }
        this.commonService.callDeepLinkURL(this.deepLinkURLType, ssoToken, this.URL, this.payLoad).subscribe((resp) => {
          if (resp) {
            this.iframehtml = resp.body;
          }
        });
      }
    });
  }

  formPayload(urlReq: any) {
    this.urlParam = urlReq.split('?').pop();
    this.URL = urlReq.split('?')[0];
    const urlParam1 = this.urlParam.split('&');
    const result = {};
    urlParam1.forEach((pair) => {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    this.payLoad = result;
  }

}
