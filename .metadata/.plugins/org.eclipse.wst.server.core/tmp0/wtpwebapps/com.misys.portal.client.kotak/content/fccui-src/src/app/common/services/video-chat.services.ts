import { Injectable } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from './common.service';

declare function ChatConfiguration(): any;
@Injectable({
  providedIn: 'root'
})
export class VideoChatService {
  widgetKey: any;
  scriptUrl: any;
  constructor(
    protected dashboardService: DashboardService,
    protected sanitizer: DomSanitizer,
    protected commonService: CommonService
  ) {
  }

 getChatDetails() {
    this.commonService.getChatConfigurationDetails().subscribe(data => {
       this.widgetKey = data.widgetKey;
       this.scriptUrl = data.scriptUrl;
       if (data.videoEnable) {
       ChatConfiguration.prototype.chat(this.widgetKey, this.scriptUrl);
    }
      });
  }

}
