import { Component, Input, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CommonService } from '../../../../common/services/common.service';
import { HideShowDeleteWidgetsService } from '../../../../common/services/hide-show-delete-widgets.service';
import { GlobalDashboardComponent } from '../../../../common/components/global-dashboard/global-dashboard.component';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';

declare let FcmWidget: any;

@Component({
  selector: 'script-widget',
  templateUrl: './script-widget.component.html',
  styleUrls: ['./script-widget.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})

export class ScriptWidgetComponent implements OnInit {
  widgetUrl: SafeResourceUrl;
  scriptUrl: string;
  elemId: string;
  ssoTokenAppend: string;
  ssoTokenJson: any;
  containerElemId: any;
  widgetLink: any;
  checkCustomise;
  classCheck;
  @Input()
  widgetDetails: any;
  widgets: any;
  widgetName: any;
  scriptWidgetUrl: SafeResourceUrl;
  scriptRootUrl: any;
  scriptBaseUrl: any;
  resultContent: any;
  hideShowCard: any;
  constructor(
    protected commonService: CommonService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected globalDashboardComponent: GlobalDashboardComponent,
  ) {
   }

  ngOnInit() {
    const initWidgets = new FcmWidget();
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.widgetName = this.widgets.widgetName;
    this.commonService.getUnifiedWidget().subscribe(data => {
      this.ssoTokenAppend = data.secretToken;
      this.scriptRootUrl = data.scriptSourceWidgetUrl;
      this.scriptBaseUrl = data.scriptBaseUrl;
      data.scriptWidgetList.forEach(element => {
        if (element.containerElemId === this.widgetName) {
          this.scriptWidgetUrl = element.widgetUrl;
          this.ssoTokenJson = {
            ssoToken: this.ssoTokenAppend,
            rootUrl: this.scriptRootUrl
          };
          this.containerElemId = element.containerElemId;
          initWidgets.fcmAddWidgets(this.ssoTokenJson, this.containerElemId, this.scriptWidgetUrl, this.scriptBaseUrl);
        }
  });
});
    this.updateCustomise();
}
deleteCards() {
  this.hideShowDeleteWidgetsService.scriptWidgetComponent.next(true);
  this.hideShowDeleteWidgetsService.scriptWidgetComponent.subscribe(res => {
    this.hideShowCard = res;
  });
  setTimeout(() => {
    this.hideShowDeleteWidgetsService.getSmallWidgetActions(this.containerElemId, this.widgets.widgetPosition);
    this.globalDashboardComponent.deleteCardLayout(this.containerElemId);
  }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
}
updateCustomise() {
  this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
    this.checkCustomise = data;
  });
  this.commonService.dashboardOptionsSubject.subscribe(data => {
    this.classCheck = data;
  });
}
}
