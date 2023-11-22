import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { GlobalDashboardComponent } from './../../../../common/components/global-dashboard/global-dashboard.component';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { CommonService } from './../../../services/common.service';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';

@Component({
  selector: 'app-mini-statement',
  templateUrl: './mini-statement.component.html',
  styleUrls: ['./mini-statement.component.scss'],
})
export class MiniStatementComponent implements OnInit {

  accountNumber: string;
  contextPath: any;
  hideShowCard;
  checkCustomise;
  classCheck;
  rowCount;
  creditImage;
  debitImage;
  istableDataPresent: boolean;
  isaccountDataPresent: boolean;
  selectedEntity: any;
  entityDataArray = [];
  dir: string = localStorage.getItem('langDir');
  fetching = true;
  selectedTransaction = '';
  selectedtransactionType = '';
  SelectedEntityName = '';
  showHeaderToolTip: any;
  @Input() widgetDetails;
  nudges: any;
  constructor(protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected globalDashboardComponent: GlobalDashboardComponent,
              protected translateService: TranslateService) { }

  ngOnInit() {
    this.commonService.getNudges(this.widgetDetails).then(data => {
      this.nudges = data;
    });
    this.showHeaderToolTip = `${this.translateService.instant('MINI_STATEMENT_INFO')}`;
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.contextPath = this.fccGlobalConstantService.contextPath;
        this.rowCount = response.MiniCount.toString();
        this.creditImage = this.contextPath + response.ministatementCreditImage;
        this.debitImage = this.contextPath + response.ministatementDebitImage;
      }
    });
    this.commonService.getFormValues(FccGlobalConstant.STATIC_DATA_LIMIT, this.fccGlobalConstantService.userEntities)
      .pipe(
        tap(() => this.fetching = true)
      )
      .subscribe(res => {
        this.fetching = false;
        res.body.items.forEach(value => {
          const entity: { label: string; value: any } = {
            label: value.shortName,
            value: value.id
          };
          this.entityDataArray.push(entity);
        });
        this.entityDataArray.sort((a, b) => {
          const x = a.label.toLowerCase();
          const y = b.label.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        this.selectedEntity = this.entityDataArray.length > 0 ? this.entityDataArray[0].value : '';
        this.SelectedEntityName = this.entityDataArray.length > 0 ? this.entityDataArray[0].label : '';
      });
  }



  deleteCards() {
    this.hideShowDeleteWidgetsService.miniStatementCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.miniStatementCardHideShow.subscribe(
      res => {
        this.hideShowCard = res;
      }
    );
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
      JSON.parse(this.widgetDetails).widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails).widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }

  accountChange(accountnum) {
    this.accountNumber = accountnum;
  }

  isTableDataPresent(isDataPresent) {
    this.istableDataPresent = isDataPresent;
  }

  isAccountDataPresent(ispresent) {
    this.isaccountDataPresent = ispresent;
  }

  onMatSelectEventRaised(event: any) {
    this.selectedEntity = event.value;
    const selectedEntity = this.entityDataArray.filter(entity => entity.value === event.value)[0];
    this.SelectedEntityName = selectedEntity.label;
  }

  setTransationType(event: any) {
    this.selectedtransactionType = event;
  }
}
