import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';
import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from './../../../services/common.service';
import { Router } from '@angular/router';
import { ScreenMapping } from '../../../../../app/base/model/screen-mapping';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';

@Component({
  selector: 'fcc-common-pending-approval',
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class PendingApprovalComponent implements OnInit {

  @Input () dashboardName;
  @Input() widgetDetails;
  listdefName = 'core/listdef/customer/MC/openPendingApprovalMCList';
  showFilterSection = false;
  checkCustomise;
  hideShowCard;
  classCheck;
  dojoUrl: any;
  contextPath: any;
  url = '';
  dashboardType: any;

  constructor(protected globalDashboardComponent: GlobalDashboardComponent,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected commonService: CommonService,
              protected router: Router,
              protected fccGlobalConstantService: FccGlobalConstantService) {}
              inputParams: any = {};
  ngOnInit() {
    const dashBoardURI = this.dashboardName.split('/');
    this.dashboardType = dashBoardURI[dashBoardURI.length - 1].toUpperCase() ;
    this.contextPath = this.commonService.getContextPath();
    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });
    const listdefName = 'listdefName';
    const showFilterSection = 'showFilterSection';
    const paginator = 'paginator';
    const downloadIconEnabled = 'downloadIconEnabled';
    const colFilterIconEnabled = 'colFilterIconEnabled';
    const passBackEnabled = 'passBackEnabled';
    const columnSort = 'columnSort';
    const dashboardTypeValue = 'dashboardTypeValue';

    this.inputParams[listdefName] = this.listdefName;
    this.inputParams[showFilterSection] = false;
    this.inputParams[paginator] = false;
    this.inputParams[downloadIconEnabled] = false;
    this.inputParams[colFilterIconEnabled] = false;
    this.inputParams[passBackEnabled] = true;
    this.inputParams[columnSort] = false;
    this.inputParams[dashboardTypeValue] = this.dashboardType;

  }

  deleteCards() {
    this.hideShowDeleteWidgetsService.pendingApprovalCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.pendingApprovalCardHideShow.subscribe(
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

  onClickViewAllTransactions() {
    sessionStorage.setItem('dojoAngularSwitch', 'true');
    this.dojoUrl = '';
    if (this.contextPath !== null && this.contextPath !== '') {
      this.dojoUrl = this.contextPath;
    }
    this.dojoUrl = `${this.dojoUrl}${this.fccGlobalConstantService.servletName}`;
    this.dojoUrl = `${this.dojoUrl}/screen/MessageCenterScreen?operation=LIST_SUBMIT&option=TODO`;
    this.router.navigate([]).then(() => {
      window.open(this.dojoUrl, '_self');
    });
  }

  onRowSelect(event) {
    const mode = 'UNSIGNED';
    const passback = event.data.passbackParameters;
    const productCode = passback.PRODUCT_CODE;
    const screenName = ScreenMapping.screenmappings[productCode];
    const tnxtype = passback.TNX_TYPE_CODE;
    const subtnxtype = passback.SUB_TNX_TYPE_CODE === undefined ||
    passback.SUB_TNX_TYPE_CODE === ''
      ? 'null'
      : passback.SUB_TNX_TYPE_CODE;
    const referenceId = passback.REF_ID;
    const tnxId = passback.TNX_ID;
    if (this.contextPath !== undefined && this.contextPath !== null && this.contextPath !== '') {
     this.url = this.contextPath;
     }
    this.url = `${this.url}${this.fccGlobalConstantService.servletName}/`;
    this.url = `${this.url}screen/${screenName}?mode=${mode}&tnxtype=${tnxtype}&subtnxtype=${subtnxtype}`;
    this.url = `${this.url}&referenceid=${referenceId}&tnxid=${tnxId}&option=null`;
    this.router.navigate([]).then(() => {
      window.open(this.url, '_self');
    });
  }
}
