import { FccGlobalConstantService } from '../common/core/fcc-global-constant.service';
import { CommonService } from '../common/services/common.service';
import { Component, OnInit } from '@angular/core';
import { HideShowDeleteWidgetsService } from '../common/services/hide-show-delete-widgets.service';
import { VideoChatService } from '../common/services/video-chat.services';

@Component({
  selector: 'fcc-common-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  contextPath: any;
  logoFilePath: string;
  homeUrl: string;
  aboutUs: string;
  privacyPolicy: string;
  termsConditions: string;
  cookiePolicy: string;
  contactUs: string;
  checkCustomise: any;
  isFooterSticky = false;
  logoFilePathText: string;
  currentYear: number;

  constructor(
    protected commonService: CommonService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected fccGlobalConstantService: FccGlobalConstantService ,
    protected videoChatService: VideoChatService) { }

  ngOnInit() {
    this.Config();
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.videoChatService.getChatDetails();
    this.currentYear = new Date().getFullYear();
  }

  Config() {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(
      response => {
        if (response) {
          this.logoFilePath = this.contextPath + response.logoFilePath;
          if ( response.subdomainloginallowed ) {
            this.homeUrl = response.subdomainhomeurls;
            this.aboutUs = response.subdomainaboutusurl;
            this.privacyPolicy = response.subdomainpripolurl;
            this.termsConditions = response.subdomaintermsurl;
            this.cookiePolicy = response.subdomaincockieurl;
            this.contactUs = response.subdomaincontactusurl;
          } else {
            this.homeUrl = response.homeUrl;
            this.aboutUs = response.aboutUs;
            this.privacyPolicy = response.privacyPolicy;
            this.termsConditions = response.termsConditions;
            this.cookiePolicy = response.cookiePolicy;
            this.contactUs = response.contactUs;
          }
        }
      }
    );
  }
  ngAfterViewChecked(): void {
    this.commonService.getFooterStickyFlag().subscribe(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      res =>{
        this.isFooterSticky = false;
      }
    );
  }
}
