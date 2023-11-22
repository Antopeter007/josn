import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './../../services/dashboard.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FccGlobalConstant } from '../../core/fcc-global-constants';

@Component({
  selector: 'fcc-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  chaturl: string;
  urlSafe: SafeResourceUrl;
  chatOriginUrl: string;
  chatbotCheck: boolean;
  @ViewChild('chat') public chat: any;
  constructor(
    protected dashboardService: DashboardService,
    protected sanitizer: DomSanitizer
  ) {
    this.chatbotCheck = false;
   }

  ngOnInit() {
    this.calltoToken();
  }

/*this method will fetch the chatbot url from the api session and assign it.*/
calltoToken() {
  this.dashboardService.getChartBotLink().then(data => {
    if (data) {
      this.chaturl = data[0].chatBotUrl;
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.chaturl);
      this.chatbotCheck = true;
      this.chatOriginUrl = data[0].chatBotOriginUrl;
      this.checkForChatBotResize();
    }
  });
}

  close() {
    sessionStorage.setItem('chatbot', 'close');
    this.chatbotCheck = false;
  }
  /**
   * Event handlers for checking if chatbot has been minimized,closed
   */
  checkForChatBotResize() {
    window.addEventListener('message', (event) => {
        if (event.origin === this.chatOriginUrl) {
            if (event.data) {
                switch (event.data.type) {
                    case 'hideChatBox': {
                    if (this.ischatFrameAvailable()) {
                      document.getElementById('chat').style.height = FccGlobalConstant.CHATBOT_MINIMIZED_HEIGHT;
                    }
                    break;
                    }
                    case 'destroyContainerFrame': {
                      if (this.ischatFrameAvailable()) {
                        document.getElementById('chat').style.display = FccGlobalConstant.STYLE_HIDECHATBOT;
                      }
                      break;
                    }
                    case 'showChatBox': {
                      if (this.ischatFrameAvailable()) {
                      document.getElementById('chat').style.height = FccGlobalConstant.CHATBOT_MAXIMIZED_HEIGHT;
                      }
                      break;
                   }
                }
            }
        }
    });
  }
  /**
   * Check if the chatbot has been opened or not and available in DOM
   */
  ischatFrameAvailable(): boolean {
    return (document.getElementById('chat') !== null || document.getElementById('chat') !== undefined);
  }
}
