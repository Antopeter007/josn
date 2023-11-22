import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDashboardComponent } from '../../../components/global-dashboard/global-dashboard.component';
import { FccGlobalConstantService } from '../../../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../core/fcc-global-constants';
import { OPEN_CLOSE_ANIMATION } from '../../../model/animation';
import { CommonService } from '../../../services/common.service';
import { FccTaskService } from '../../../services/fcc-task.service';
import { HideShowDeleteWidgetsService } from '../../../services/hide-show-delete-widgets.service';

@Component({
  selector: 'fcc-ongoing-task',
  templateUrl: './fcc-ongoing-task.component.html',
  styleUrls: ['./fcc-ongoing-task.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION],
})
export class FccOngoingTaskComponent implements OnInit {
  hideShowCard;
  checkCustomise;
  classCheck;
  contextPath: any;
  taskMonitorUrl;
  taskObj;
  dashboardType: any;
  dir: string = localStorage.getItem('langDir');
  @Input() widgetDetails;

  constructor(
    protected globalDashboardComponent: GlobalDashboardComponent,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected commonService: CommonService,
    protected router: Router,
    protected taskService: FccTaskService
  ) {}

  ngOnInit(): void {
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe((data) => {
      this.checkCustomise = data;
    });
    this.commonService.dashboardOptionsSubject.subscribe((data) => {
      this.classCheck = data;
    });
    this.contextPath = this.commonService.getContextPath();
    this.taskMonitorUrl = this.contextPath + this.fccGlobalConstantService.servletName + FccGlobalConstant.TASK_MONITORING_URL;
    this.taskService.getTaskWidgetDetails(this.taskService.dashboardCategory).subscribe(
        (res) => {
          this.taskObj = res.items;
          this.taskObj.forEach(object => {
            object.TASKNAME = this.commonService.decodeHtml(object.TASKNAME);
            object.DESCRIPTION = this.commonService.decodeHtml(object.DESCRIPTION);
          });
    }
    );
  }
  deleteCards() {
    this.hideShowDeleteWidgetsService.ongoingTaskCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.ongoingTaskCardHideShow.subscribe(
      (res) => {
        this.hideShowCard = res;
      }
    );
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
      JSON.parse(this.widgetDetails).widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
    } , FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }
  taskMonitoringCentre() {
    window.open(this.taskMonitorUrl, FccGlobalConstant.SELF);
  }
  navigateToForms(event: any, task: any){
    if (task.ROUTINGSCREENTYPE === FccGlobalConstant.ANGULAR) {
      // For opening the task tab in form while navigating from widget
      this.taskService.currentTaskIdFromWidget$.next(FccGlobalConstant.TASKS);
      this.router.navigateByUrl(task.SCREEN);
    }
      else{ // Navigate to DOJO URL
    window.open(task.SCREEN, FccGlobalConstant.SELF);
  }
}
comments(task){
  if (task.ROUTINGSCREENTYPE === FccGlobalConstant.ANGULAR) {
    this.router.navigateByUrl(task.SCREEN);
    this.taskService.currentTaskIdFromWidget$.next(task.CURTASKID);
  }
  else{ // Navigate to DOJO URL
    window.open(task.SCREEN, FccGlobalConstant.SELF);
  }
}
}
