import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { GlobalDashboardComponent } from './../../../components/global-dashboard/global-dashboard.component';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';
import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from './../../../services/common.service';
import { ScreenMapping } from '../../../../../app/base/model/screen-mapping';
import { Router } from '@angular/router';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';

@Component({
  selector: 'fcc-common-action-required',
  templateUrl: './action-required.component.html',
  styleUrls: ['./action-required.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class ActionRequiredComponent implements OnInit {

  inputParams: any = {};
  checkCustomise: any;
  hideShowCard: any;
  classCheck: any;
  contextPath: any;
  url = '';


  constructor(protected globalDashboardComponent: GlobalDashboardComponent,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected commonService: CommonService, protected router: Router,
              protected fccGlobalConstantService: FccGlobalConstantService
  ) {}

  @Input () dashboardName;
  @Input() widgetDetails;

  dashboardType;

  ngOnInit() {

    const dashBoardURI = this.dashboardName.split('/');
    this.dashboardType = dashBoardURI[dashBoardURI.length - 1].toUpperCase() ;

    const listdefName = 'listdefName';
    const showFilterSection = 'showFilterSection';
    const paginator = 'paginator';
    const downloadIconEnabled = 'downloadIconEnabled';
    const colFilterIconEnabled = 'colFilterIconEnabled';
    const passBackEnabled = 'passBackEnabled';
    const dashboardTypeValue = 'dashboardTypeValue';
    const columnSort = 'columnSort';
    this.contextPath = this.commonService.getContextPath();

    this.inputParams[listdefName] = 'core/listdef/customer/MC/openActionRequiredList';
    this.inputParams[showFilterSection] = false;
    this.inputParams[paginator] = false;
    this.inputParams[downloadIconEnabled] = false;
    this.inputParams[colFilterIconEnabled] = false;
    this.inputParams[passBackEnabled] = true;
    this.inputParams[columnSort] = false;
    this.inputParams[dashboardTypeValue] = this.dashboardType;

    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });

    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
  }

  deleteCards() {
    this.hideShowDeleteWidgetsService.actionRequiredCardHideShow.next(true);
    this.hideShowDeleteWidgetsService.actionRequiredCardHideShow.subscribe(
      res => {
        this.hideShowCard = res;
      }
    );
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(JSON.parse(this.widgetDetails).widgetName,
      JSON.parse(this.widgetDetails).widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(JSON.parse(this.widgetDetails));
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }

  getDataOnRowClick(event) {
    const passback = event.data.passbackParameters;
    const productCode = passback.PRODUCT_CODE;
    const screenName = ScreenMapping.screenmappings[productCode];
    const referenceId = passback.REF_ID;
    const tnxId = passback.TNX_ID;
    const actionRequiredCode = passback.ACTION_REQ_CODE;
    if (this.contextPath !== undefined && this.contextPath !== null && this.contextPath !== '') {
     this.url = this.contextPath;
     }
    this.url = `${this.url}${this.fccGlobalConstantService.servletName}/screen/`;
    this.url = `${this.url}${screenName}?tnxtype=13&referenceid=${referenceId}&option=ACTION_REQUIRED`;
    this.url = `${this.url}&tnxid=${tnxId}`;
    this.url = `${this.url}&actionRequiredCode=${actionRequiredCode}`;
    this.router.navigate([]).then(() => { window.open(this.url, '_self'); });
  }

}
