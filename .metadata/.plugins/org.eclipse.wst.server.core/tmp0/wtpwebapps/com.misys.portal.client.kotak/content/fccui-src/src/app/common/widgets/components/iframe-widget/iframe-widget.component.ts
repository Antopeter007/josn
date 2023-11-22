import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FccGlobalConstant } from '../../../core/fcc-global-constants';
import { CommonService } from '../../../services/common.service';
import { HideShowDeleteWidgetsService } from '../../../services/hide-show-delete-widgets.service';
import { GlobalDashboardComponent } from '../../../components/global-dashboard/global-dashboard.component';
import { OPEN_CLOSE_ANIMATION } from '../../../model/animation';

@Component({
  selector: 'iframe-widget',
  templateUrl: './iframe-widget.component.html',
  styleUrls: ['./iframe-widget.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})

export class IframeWidgetComponent implements OnInit {
  widgetUrl: SafeResourceUrl;
  scriptUrl: string;
  elemId: string;
  checkCustomise;
  @Input()
  widgetDetails: any;
  widgets: any;
  widgetName: any;
  iframeWidgetUrl: SafeResourceUrl;
  hideShowCard: any;
  constructor(
    protected sanitizer: DomSanitizer,
    protected elementRef: ElementRef,
    protected render2: Renderer2,
    protected commonService: CommonService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected globalDashboardComponent: GlobalDashboardComponent,
  ) {
   }

  ngOnInit() {
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.widgetName = this.widgets.widgetName;
    this.commonService.getUnifiedWidget().subscribe(data => {
      data.iframeUnifiedWidgetList.forEach(element => {
        if (element.widgetName === this.widgetName) {
          this.iframeWidgetUrl = this.sanitizer.bypassSecurityTrustUrl(element.widgetUrl);
    }
  });
});
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
  this.checkCustomise = data;
});
}
deleteCards() {
  this.hideShowDeleteWidgetsService.iframeWidgetComponent.next(true);
  this.hideShowDeleteWidgetsService.iframeWidgetComponent.subscribe(res => {
    this.hideShowCard = res;
  });
  setTimeout(() => {
    this.hideShowDeleteWidgetsService.getSmallWidgetActions(this.widgets.widgetName, this.widgets.widgetPosition);
    this.globalDashboardComponent.deleteCardLayout(this.widgets.widgetName);
  }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
}
}
