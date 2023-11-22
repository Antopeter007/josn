import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ScreenMapping } from '../../../../base/model/screen-mapping';
import { ProductService } from '../../../../base/services/product.service';
import { GlobalDashboardComponent } from '../../../../common/components/global-dashboard/global-dashboard.component';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../common/services/common.service';
import { TableService } from '../../../../base/services/table.service';
import { HideShowDeleteWidgetsService } from '../../../../common/services/hide-show-delete-widgets.service';
import { ListDataDownloadService } from '../../../../common/services/list-data-download.service';
import { NudgesService } from '../../../../common/services/nudges.service';
import { ListDefService } from '../../../services/listdef.service';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';
import { FormGroup } from '@angular/forms';
import { ButtonItemList } from './../../../model/ButtonItemList';
import { SubmissionRequest } from '../../../model/submissionRequest';
import { SeveralSubmitService } from '../../../../common/services/several-submit.service';


@Component({
  selector: 'fcc-listdef-common-widget',
  templateUrl: './listdef-common-widget.component.html',
  styleUrls: ['./listdef-common-widget.component.scss'],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class ListdefCommonWidgetComponent implements OnInit, OnDestroy {
  constructor(protected globalDashboardComponent: GlobalDashboardComponent,
              protected tableService: TableService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected nudgesService: NudgesService,
              protected commonService: CommonService, protected router: Router,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected listDataDownloadService: ListDataDownloadService,
              protected translateService: TranslateService,
              protected changedetector: ChangeDetectorRef,
              protected productService: ProductService,
              protected activatedRoute: ActivatedRoute,
              protected listservice: ListDefService,
              protected translate: TranslateService,
              protected submitService: SeveralSubmitService,
              protected severalSubmitService: SeveralSubmitService,
              protected listService: ListDefService
  ) { }
  static urlKeyMapping = {
    REF_ID: 'referenceid',
    TNX_ID: 'tnxId',
    TNX_TYPE_CODE: 'tnxtype',
    OPTION: 'option',
    OPERATION: 'operation',
    SUB_TNX_TYPE_CODE: 'subtnxtype',
    MODE: 'mode'
  };
  inputParams: any = {};
  checkCustomise: any;
  hideShowCard: any;
  classCheck: any;
  contextPath: any;
  url = '';
  @Input()
  widgetDetails: any;
  dojoPath = `${this.fccGlobalConstantService.servletName}/screen/`;
  header: string;
  widgetConfig;
  widgets;
  @Input() dashboardName;
  displayDashboardValue = false;
  eventData;
  nudges: any[] = [];
  nudgesRequired: any;
  widgetConfigData: any;
  viewAllurl: string;
  viewAllTnxPermission = false;
  defaultFilterCriteria: any = {};
  defaultFilterCriteriaSubscription: Subscription;
  displayTabs = false;
  tabsList: any;
  widgetCode: any;
  favSwitchchecked: any;
  recordCount : any;
  favourite: any = FccGlobalConstant.FAVOURITES;
  selectedRowsdata: any[] = [];
  @Output() rowSelectEventListdef: EventEmitter<any> = new EventEmitter<any>();
  selectedRowsdataForDeleteClear: any[] = [];
  changed: boolean =true;
  params: any = {};
  buttonList = [];
  disableReturn = false;
  commentsRequired = true;
  checkBoxEnabled = false;
  commentsMandatory = false;
  checkedEnable = true;
  activeItem: any = {};
  dashboardType: any = '';
  @Output() rowUnSelectEventListdef: EventEmitter<any> = new EventEmitter<any>();
  productCode: string;
  category: string;
  responseMap;
  comments = '';
  enableMultiSubmitResponse: boolean;
  multiSubmitForm: FormGroup;
  buttonItemList: ButtonItemList[] = [];
  bottomButtonList: any[] = [];
  enableButtons: boolean;
  buttonItems: any = [];
  dir: string = localStorage.getItem('langDir');
  @Output() multiSelectEventListdef: EventEmitter<any> = new EventEmitter<any>();
  @Output() widgetRefreshList: EventEmitter<any> = new EventEmitter<any>();
  submissionRequest: SubmissionRequest = {};
  respSubscription;
  passback: any ;
  checkBoxClick: boolean = false;
  checkBoxCleared: boolean = false;


  ngOnInit() {
    const dashboardTypeValue = 'dashboardTypeValue';
    const displayDashboard = 'displayDashboard';
    this.contextPath = this.commonService.getContextPath();
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    if (this.commonService.isNonEmptyValue(this.widgets.widgetConfig)) {
      this.widgetConfigData = JSON.parse(this.widgets.widgetConfig);
      if (this.widgetConfigData.drillDownEnabled) {
        this.inputParams[FccGlobalConstant.DRILL_DOWN_ENABLED] = this.widgetConfigData.drillDownEnabled;
        this.inputParams[FccGlobalConstant.DRILL_DOWN_TABLE_CONFIG] = this.widgetConfigData.drillDownTableConfig;
        this.inputParams[FccGlobalConstant.IS_PARENT_LIST] = true;
      }
    }

    if(this.commonService.isnonEMptyString(this.commonService.getAccountSummaryFilter())){
      this.inputParams[FccGlobalConstant.DEFAULT_CRITERIA] = this.commonService.getAccountSummaryFilter();
    }

    if (this.commonService.isNonEmptyValue(this.widgetConfigData.tabs) &&
    this.widgetConfigData.tabs.length > 0 ) {
      this.displayTabs = true;
      this.widgetCode = FccGlobalConstant.PAYMENTAPPROVALWIDGET;
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.listservice.getSectionTabDetails("", this.widgetCode).subscribe((resp) => {
        //eslint : no-empty-function
      });
       this.tabsList = this.widgetConfigData;
    } else {
      this.displayTabs = false;
    }

    this.nudgesRequired = this.commonService.isNonEmptyValue(this.widgetConfigData.enableNudges) ?
      this.widgetConfigData.enableNudges : false;
    if (this.nudgesRequired && this.commonService.isNonEmptyValue(this.widgets.widgetConfig)) {
      this.commonService.getNudges(this.widgetDetails).then(data => {
        this.nudges = data;
      });
    }
    this.header = this.widgets.widgetName;
    if (this.commonService.isnonEMptyString(this.widgetConfigData)
        && this.commonService.isnonEMptyString(this.widgetConfigData.viewAllPermission)){
      this.commonService.getUserPermission(this.widgetConfigData.viewAllPermission).subscribe(permission => {
        if (permission) {
          this.viewAllTnxPermission = true;
        }
      });
    }
    this.inputParams[FccGlobalConstant.IS_DASHBOARD_WIDGET] = true;
    this.inputParams[FccGlobalConstant.WIDGET_NAME] = this.commonService.isnonEMptyString(this.widgets) ?
      this.widgets.widgetName : FccGlobalConstant.LIST_DATA_TITLE;
    if (this.widgets !== '' && this.widgets.widgetConfig) {
      this.widgetConfig = JSON.parse(this.widgets.widgetConfig);
      const dashBoardURI = this.dashboardName.split('/');
      const dashboardType = dashBoardURI[dashBoardURI.length - 1].toUpperCase();
      this.inputParams[dashboardTypeValue] = dashboardType;
      this.displayDashboardValue = this.widgetConfig.tableConfig[displayDashboard];
      this.inputParams[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] =
      this.commonService.isnonEMptyString(this.widgetConfig.tableConfig) ?
       this.widgetConfig.tableConfig[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] : false;
       if (this.inputParams.widgetName == 'pendingApproval') {
       this.commentsRequired = this.widgetConfig.tableConfig.commentsRequired;
       this.checkBoxEnabled = this.widgetConfig.tableConfig.checkBoxPermission === "true" ? true : false;
       this.getButtonDetails(this.widgetConfig.tableConfig.buttonList);
       }
       Object.keys(this.widgetConfig.tableConfig).forEach(element => {
        this.inputParams[element] = this.checkForBooleanValue(this.widgetConfig.tableConfig[element]);
        this.inputParams.isViewMore = this.widgetConfigData.tableConfig.isViewMore;
      });
    }
    this.commonService.dashboardOptionsSubject.subscribe(data => {
      this.classCheck = data;
    });

    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.commonService.dashboardWidget = true;
    this.setDefaultFilterCriteria();

    if (this.checkedEnable) {
        this.resetResponse();
      }
    this.respSubscription = this.commonService.isResponse.subscribe(
      data => {
        this.onSubmissionResponse(data);
      });

  }




  onSubmissionResponse(response) {
    if (response) {
      this.resetResponse();
      this.responseMap = this.severalSubmitService.getMultiSubmitResponse();
      this.enableMultiSubmitResponse = true;
      this.commonService.refreshPendingApprovalWidgetList.next(true);
    }
  }

  setDefaultFilterCriteria() {
    this.defaultFilterCriteriaSubscription = this.commonService.dealDetailsBehaviourSubject.subscribe(filterValues => {
      if (filterValues !== null) {
        this.inputParams.skipRequest = false;
        this.defaultFilterCriteria[FccGlobalConstant.BO_DEAL_NAME] = filterValues.name;
        this.inputParams = { ...this.inputParams };
        this.inputParams[FccGlobalConstant.DEFAULT_CRITERIA] = this.defaultFilterCriteria;
      }
    });
  }

  deleteCards() {
    this.hideShowDeleteWidgetsService.listdefCommonComp.next(true);
    this.hideShowDeleteWidgetsService.listdefCommonComp.subscribe(
      res => {
        this.hideShowCard = res;
      }
    );
    setTimeout(() => {
      this.hideShowDeleteWidgetsService.getSmallWidgetActions(this.widgets.widgetName, this.widgets.widgetPosition);
      this.globalDashboardComponent.deleteCardLayout(this.widgets.widgetName);
    }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
  }

  onClickView(event, valObj){
    this.tableService.onClickViewMultiSubmit(event, valObj);
  }

  onClickViewAllTransactions() {
    const dashBoardURI = this.dashboardName.split('/');
    const dashboardNameVal = dashBoardURI[dashBoardURI.length - 1].toUpperCase();
    this.commonService.setWidgetClicked(dashboardNameVal);
    this.router.navigate(['productListing'], { queryParams: { dashboardType: dashboardNameVal, option: this.header } });
  }

  onRowSelect(event) {
    if(!this.checkBoxCleared) {
      if (!this.displayDashboardValue && event.type !== FccGlobalConstant.checkBox) {
        if(this.passback === undefined) {
        if (event.data) {
          this.passback = event.data.passbackParameters;
          this.eventData = event.data;
        } else {
          this.passback = event.selectedRowsData.passbackParameters;
          this.eventData = event.selectedRowsData;
        }
      }
      if (event.type === 'click' && !this.checkBoxClick) {
        const screenName = ScreenMapping.screenmappings[this.passback.PRODUCT_CODE];
        let urlParams = '?';
        let url = '';
        Object.keys(this.passback).forEach(element => {
          urlParams = `${urlParams}${ListdefCommonWidgetComponent.urlKeyMapping[element]}=${this.passback[element]}&`;
        });
        urlParams = urlParams.substring(0, urlParams.length - 1);
        if (this.passback.PRODUCT_CODE === FccGlobalConstant.PRODUCT_FT &&
          (this.passback.SUB_PRODUCT_CODE === FccGlobalConstant.SUB_PRODUCT_CODE_BILLP
            || this.passback.PRODUCT_CODE === FccGlobalConstant.SUB_PRODUCT_CODE_BILLS)) {
          urlParams = `${urlParams}&option=${this.passback.SUB_PRODUCT_CODE}`;
        }
        if (this.contextPath !== undefined && this.contextPath !== null && this.contextPath !== '') {
          url = this.contextPath;
        }
        url = `${url}${this.dojoPath}${screenName}${urlParams}`;
        this.commonService.getSwiftVersionValue();
        if (this.commonService.isAngularProductUrl(this.passback.PRODUCT_CODE, this.passback.SUB_PRODUCT_CODE)
          && (!(this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
            (this.passback.PRODUCT_CODE === FccGlobalConstant.PRODUCT_BG ||
              this.passback.PRODUCT_CODE === FccGlobalConstant.PRODUCT_BR)))) {
          if (this.passback.TNX_TYPE_CODE === FccGlobalConstant.N002_INQUIRE && this.passback.MODE !== FccGlobalConstant.UNSIGNED) {
            this.handleActionRequiredRecords(event);
          } else if (this.passback.MODE === FccGlobalConstant.UNSIGNED && this.passback.PRODUCT_CODE === FccGlobalConstant.PRODUCT_TD) {
            this.router.navigate([FccGlobalConstant.REVIEW_SCREEN], {
              queryParams: {
                referenceid: this.passback.REF_ID,
                tnxid: this.passback.TNX_ID, productCode: this.passback.PRODUCT_CODE, subProductCode: this.passback.SUB_PRODUCT_CODE,
                tnxTypeCode: this.passback.TNX_TYPE_CODE,
                mode: FccGlobalConstant.VIEW_MODE, operation: FccGlobalConstant.LIST_INQUIRY, action: FccGlobalConstant.APPROVE
              }
            });
          } else if (this.passback.MODE === FccGlobalConstant.UNSIGNED) {
            this.router.navigate([FccGlobalConstant.REVIEW_SCREEN], {
              queryParams: {
                referenceid: this.passback.REF_ID,
                tnxid: this.passback.TNX_ID, productCode: this.passback.PRODUCT_CODE, subProductCode: this.passback.SUB_PRODUCT_CODE,
                mode: FccGlobalConstant.VIEW_MODE, operation: FccGlobalConstant.LIST_INQUIRY, action: FccGlobalConstant.APPROVE,
                tnxTypeCode: this.passback.TNX_TYPE_CODE
              }
            });
          }
        } else {
          this.router.navigate([]).then(() => {
            window.open(url, '_self');
          });
        }
      }
      } else {
        this.selectedRowsdata.push(event.data.box_ref);
        this.selectedRowsdataForDeleteClear.push(event.data);
        this.passback = event.data.passbackParameters;
        if (event.type === 'checkbox') {
          this.checkBoxClick = true;
        }
      }
    } else {
      this.checkBoxCleared = false;
  }
}

  onHeaderCheckboxToggle(event) {

    this.activatedRoute.queryParams.subscribe(params=>{
      if((params.option==FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC ||
            params.option === FccGlobalConstant.PAYMENTS)
            && params.category==FccGlobalConstant.FCM.toUpperCase()){
          if(!event.checked){
            this.commentsMandatory=false;
          }
          if(null!=event.selectedRows&&undefined!=event.selectedRows){
            this.selectedRowsdata=event.selectedRows;
          }else{
            this.selectedRowsdata = [];
          }
      }else{
        this.multiSelectEventListdef.emit(event);
        if (event.checked) {
          if (this.activeItem && this.activeItem[`displayInputSwitch`] && this.activeItem[`displayInputSwitch`][`display`]) {
            this.selectedRowsdata = [];
            this.selectedRowsdata = event.selectedRows;
          } else {
            event.selectedRows.forEach(element => {
              if (element.prod_stat_code !== FccGlobalConstant.N005_EXPIRE && element.prod_stat_code !== FccGlobalConstant.N005_EXPIRED)
              {
                this.selectedRowsdata.push(element.box_ref);
                this.selectedRowsdataForDeleteClear.push(element);
              }
            });
          }
        } else {
        this.selectedRowsdata = [];
        this.selectedRowsdataForDeleteClear = [];
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickMultiApprove(actionParams) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.activatedRoute.queryParams.subscribe(obs => {
        if (this.selectedRowsdata.length) {
          this.enableMultiSubmitResponse = false;
          this.submissionRequest.listKeys = this.selectedRowsdata;
          // placeholder for comments, to set when implemented in backend
          this.submitService.performSeveralSubmit(this.submissionRequest, FccGlobalConstant.APPROVE);
        }

    });
  }

  onClickMultiReturn(actionParams) {

    //retained the existing flow
    if (this.selectedRowsdata.length && actionParams.comment && actionParams.comment.length > 0) {
      this.enableMultiSubmitResponse = false;
      this.submissionRequest.listKeys = this.selectedRowsdata;
      this.submissionRequest.comments = actionParams.comment;
      this.submitService.performSeveralSubmit(this.submissionRequest, FccGlobalConstant.RETURN);
      this.disableReturn = false;
    } else {
      this.disableReturn = true;
    }

  }

  actionRequired(event, data) {
    if(data.action_req_code === FccGlobalConstant.ACTION_REQUIRED_12)
    {
      this.tableService.onClickDiscrepant(event, data);
    }
    else if(data.action_req_code === FccGlobalConstant.ACTION_REQUIRED_26) {
      this.tableService.onClickRequestSettlement(event, data);
    }
    else if(data.action_req_code === FccGlobalConstant.ACTION_REQUIRED_99 ||
       data.action_req_code === FccGlobalConstant.ACTION_REQUIRED_03 ||
        data.action_req_code === FccGlobalConstant.ACTION_REQUIRED_05 ||
        data.action_req_code === FccGlobalConstant.ACTION_REQUIRED_07) {
      this.tableService.onClickRespond(event, data);
    }
    else if(data.action_req_code === FccGlobalConstant.ACTION_REQUIRED_15) {
      this.tableService.onClickAcceptIP(event, data);
    }
}

  onClickViewAll() {
    if (this.widgetConfigData.tableConfig && this.widgetConfigData.tableConfig.viewAll) {
      this.commonService.redirectToLink(this.widgetConfigData.tableConfig.viewAll);
    }
  }

  handleAction(actionParam) {
    const fnName = `onClickMulti${actionParam.action.substr(0, 1).toUpperCase()}${actionParam.action.substr(1)}`;
    this[fnName](actionParam);
  }

  //Loads bottom button item list
  getButtonDetails(outerButtons: any) {
    this.buttonItemList = [];
    this.bottomButtonList = [];
    if (outerButtons && outerButtons.length > 0) {
      this.enableButtons = true;
      this.buttonItems = outerButtons;
      for (let i = 0; i < this.buttonItems.length; i++) {
        this.commonService.putButtonItems('buttonName' + i, this.translate.instant(this.buttonItems[i].localizationKey));
        this.commonService.putButtonItems('buttonClass' + i, this.buttonItems[i].styleClass);
        this.commonService.putButtonItems('buttonType' + i, this.buttonItems[i].type);
        this.bottomButtonList.push({
          localizationKey: this.commonService.getButtonItems('buttonName' + i),
          buttonClass: this.commonService.getButtonItems('buttonClass' + i),
        });
      }
    }
     else {
      this.enableButtons = false;
    }
  }

  resetResponse() {
    this.responseMap = '';
    this.comments = '';
    this.selectedRowsdata = [];
    this.selectedRowsdataForDeleteClear = [];
    this.enableMultiSubmitResponse = false;
    this.disableReturn = false;
    //this.transListdef = undefined;
    if (this.multiSubmitForm) {
      this.multiSubmitForm.controls.comments.patchValue('');
    }
  }

  getRowUnSelectEvent(event) {
    this.activatedRoute.queryParams.subscribe(params => {
      if ((params.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC ||
            params.option === FccGlobalConstant.PAYMENTS)
            && params.category === FccGlobalConstant.FCM.toUpperCase()) {
        this.selectedRowsdata = event.selectedRowsData;
        this.commentsMandatory = false;
      } else {
        this.rowUnSelectEventListdef.emit(event);
        if (event.type === 'checkbox') {
          this.disableReturn = false;
          this.checkBoxClick = false;
          this.checkBoxCleared = true;
          this.selectedRowsdata.forEach((item, index) => {
            if (item === event.data.box_ref || JSON.stringify(item) === JSON.stringify(event.data)) {
              this.selectedRowsdata.splice(index, 1);
              this.selectedRowsdataForDeleteClear.splice(index, 1);
            }
          });
        }
      }
    });
  }

  checkForBooleanValue(value: string) {
    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return value;
    }
  }

  onEventRaised() {
    const inputParams = JSON.parse(JSON.stringify(this.inputParams));
    if(this.favSwitchchecked) {
      inputParams[FccGlobalConstant.FAVOURITE] = FccGlobalConstant.CODE_Y;
    } else {
      inputParams[FccGlobalConstant.FAVOURITE] = FccGlobalConstant.CODE_N;
    }
    this.inputParams = inputParams;
  }

  getTotalCount(event) {
    this.recordCount = event;
  }

  handleActionRequiredRecords(event) {
    const prodCode = this.commonService.isnonEMptyString(this.passback.PRODUCT_CODE) ?
                    this.passback.PRODUCT_CODE : this.eventData.product_code;
    const subProdCode = this.commonService.isnonEMptyString(this.passback.SUB_PRODUCT_CODE) ?
                        this.passback.SUB_PRODUCT_CODE : this.eventData.sub_product_code;
    const entity = this.commonService.isnonEMptyString(this.eventData.entity) ? this.eventData.entity : '';
    const tnxID = this.commonService.isnonEMptyString(this.passback.TNX_ID) ?
                  this.passback.TNX_ID : this.eventData.tnx_id;
    const refID = this.commonService.isnonEMptyString(this.passback.REF_ID) ?
                  this.passback.REF_ID : this.eventData.ref_id;
    const tnxTypeCode = this.commonService.isnonEMptyString(this.passback.TNX_TYPE_CODE) ?
                        this.passback.TNX_TYPE_CODE : this.eventData.tnx_type_code;
    const subTnxTypeCode = this.commonService.isnonEMptyString(this.passback.SUB_TNX_TYPE_CODE) ?
                            this.passback.SUB_TNX_TYPE_CODE : this.eventData.sub_tnx_type_code;
    const hasPermission = this.commonService.isUserHavingSavePermission(prodCode, subProdCode, entity);
    if(hasPermission) {
      if (this.passback.ACTION_REQUIRED_CODE !== '') {
        this.actionRequired(event, this.eventData);
      }
      else {
        this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
          queryParams: {
            refId: refID,
            tnxId: tnxID, productCode: prodCode, subProductCode: subProdCode,
            tnxTypeCode: tnxTypeCode,
            option: FccGlobalConstant.ACTION_REQUIRED
          }
        });
      }
    } else {
      this.router.navigate(['reviewScreen'], { queryParams: { tnxid: tnxID, referenceid: refID,
        productCode: prodCode,
        subProductCode: subProdCode, mode: FccGlobalConstant.VIEW_MODE, operation: 'LIST_INQUIRY',
        subTnxTypeCode: subTnxTypeCode, tnxTypeCode: tnxTypeCode } });
    }
  }

  ngOnDestroy(){
    if(this.defaultFilterCriteriaSubscription) {
      this.defaultFilterCriteriaSubscription.unsubscribe();
    }
    this.commonService.dashboardWidget = false;

    this.resetResponse();
    this.commonService.isResponse.next(false);
    if(this.respSubscription){
      this.respSubscription.unsubscribe();
    }
     this.commonService.noReloadListDef = false;
    this.commonService.widgetFilterParams = {};
  }
}
