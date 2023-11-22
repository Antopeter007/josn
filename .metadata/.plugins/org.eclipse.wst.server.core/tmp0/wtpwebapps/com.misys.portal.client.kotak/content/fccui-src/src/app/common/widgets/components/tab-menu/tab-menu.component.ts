import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { CommonService } from './../../../services/common.service';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';
import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'fcc-common-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class TabMenuComponent implements OnInit {

  items: MenuItem[];
  activeItem: MenuItem;
  transactionInProgress = false;
  tasks = false;
  myActivities = false;
  checkCustomise;
  hideShowCard;
  classCheck;
  two = 2;
  dir: string = localStorage.getItem('langDir');
  @Input() dashboardName;
  @Input() widgetDetails;
  nudges: any;
  constructor(protected translateService: TranslateService,
              protected globalDashboardComponent: GlobalDashboardComponent,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected commonService: CommonService
  ) {}
  ngOnInit() {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
    const transactionInProgress = 'transactionInProgress';
    this.items = [
      { label: transactionInProgress, id: transactionInProgress }
    ];

    this.activeItem = this.items[0];
    this.transactionInProgress = true;
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
  }

  displayComponent(event, index) {
    this.transactionInProgress = false;
    this.tasks = false;
    this.myActivities = false;
    if (index === 0) {
      this.transactionInProgress = true;
    } else if (index === 1) {
      this.tasks = true;
    } else if (index === this.two) {
      this.myActivities = true;
    }
    this.activeItem = this.items[index];
  }

  deleteCards() {
    this.hideShowDeleteWidgetsService.tabMenuCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.tabMenuCardHideShow.subscribe(res => {
      this.hideShowCard = res;
    });
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
      JSON.parse(this.widgetDetails).widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
 }

 setDirection() {
   if (this.dir === 'rtl') {
    return 'right';
   } else {
    return 'none';
   }
 }

}
