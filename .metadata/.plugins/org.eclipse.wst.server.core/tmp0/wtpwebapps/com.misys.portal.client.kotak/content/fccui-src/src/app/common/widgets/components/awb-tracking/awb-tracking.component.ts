import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './../../../services/common.service';

@Component({
  selector: 'fcc-common-awb-tracking',
  templateUrl: './awb-tracking.component.html',
  styleUrls: ['./awb-tracking.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION],
})
export class AwbTrackingComponent implements OnInit {
  @Input () dashboardName;
  @Input() widgetDetails;
  dhlTrackingURL: string;
  display = false;
  contextPath: any;
  checkCustomise;
  hideShowCard;
  classCheck;
  nudges: any;
  constructor(protected router: Router,
              protected commonService: CommonService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected globalDashboardComponent: GlobalDashboardComponent,
              protected fccGlobalConstantService: FccGlobalConstantService) {}
  ngOnInit() {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.dhlTrackingURL = response.dhlTrackingURL;
      }
    });
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
  }
  showDialog() {
    this.display = true;
  }

  eventDetails() {
    this.router.navigate([]).then(() => {
      window.open('dhlTrackingURL', '_self');
    });
  }
  deleteCards() {
    this.hideShowDeleteWidgetsService.awbTrackingCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.awbTrackingCardHideShow.subscribe(res => {
      this.hideShowCard = res;
    });
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
      JSON.parse(this.widgetDetails).widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
 }

 closeDialog() {
  this.display = false;
}

}
