import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { Component, OnInit, Input } from '@angular/core';
import { HideShowDeleteWidgetsService } from '../../../../common/services/hide-show-delete-widgets.service';
import { GlobalDashboardComponent } from '../../../../common/components/global-dashboard/global-dashboard.component';
import { CommonService } from '../../../../common/services/common.service';
import { DashboardService } from '../../../../common/services/dashboard.service';
import { FccGlobalConstantService } from '../../../../common/core/fcc-global-constant.service';
import { HttpClient } from '@angular/common/http';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';

@Component({
  selector: 'fcc-generic-html',
  templateUrl: './generic-html-component.html',
  styleUrls: ['./generic-html-component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]

})
export class GenericHtmlComponent implements OnInit {
  checkCustomise;
  hideShowCard;
  resultContent;
  externalContent;
  resultXslContent;
  params;
  @Input()
  widgetDetails: any;
  widgets;
  constructor(protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected globalDashboardComponent: GlobalDashboardComponent,
              protected commonService: CommonService,
              protected dashboardService: DashboardService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected http: HttpClient) { }

  ngOnInit() {
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    if (this.widgets !== '' && this.widgets.widgetConfig) {
      const widgetUrl = JSON.parse(this.widgets.widgetConfig).url;
      this.commonService.getCustomContent(widgetUrl).subscribe(result => {
        this.externalContent = result.body.content;
      });
    } else {
      this.commonService.getWidgetContent(this.widgets.widgetName).subscribe(response => {
        this.resultContent = response.body.content;
      });
    }
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });

  }

  deleteCards() {
    this.hideShowDeleteWidgetsService.genericHtmlComp.next(true);
    this.hideShowDeleteWidgetsService.genericHtmlComp.subscribe(res => {
      this.hideShowCard = res;
    });
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(this.widgets.widgetName, this.widgets.widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(this.widgets.widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }
}
