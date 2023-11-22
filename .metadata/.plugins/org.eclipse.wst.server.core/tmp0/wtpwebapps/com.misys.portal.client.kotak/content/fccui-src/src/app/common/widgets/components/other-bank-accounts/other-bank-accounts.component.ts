import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { CommonService } from './../../../services/common.service';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { Component, Input, OnInit } from '@angular/core';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fcc-common-other-bank-accounts',
  templateUrl: './other-bank-accounts.component.html',
  styleUrls: ['./other-bank-accounts.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class OtherBankAccountsComponent implements OnInit {
  accounts: any;
  checkCustomise;
  hideShowCard;
  classCheck;
  @Input() widgetDetails;
    constructor(protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
                protected globalDashboardComponent: GlobalDashboardComponent, protected commonService: CommonService,
                protected translateService: TranslateService) { }

  ngOnInit() {
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
    this.accounts = [
      { ccy: 'HSBC', flag: '23,456,789', rate: '38,678,999' },
      { ccy: 'ICICI', flag: '23,456,789', rate: '38,678,999' },
      { ccy: 'CITI', flag: '23,456,789', rate: '38,678,999' },
      { ccy: 'HDFC', flag: '22,456,789', rate: '33,678,999' },
      ];
  }
  deleteCards() {
      this.hideShowDeleteWidgetsService.OtherBankAccountCardHideShow.next(true);
      this.hideShowDeleteWidgetsService.OtherBankAccountCardHideShow.subscribe(res => {
        this.hideShowCard = res;
      });
      setTimeout(() => {
        this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
        JSON.parse(this.widgetDetails).widgetPosition);
        this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
      }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
   }
}
