import { NestedTreeControl } from '@angular/cdk/tree';
import { DatePipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { EnquiryService } from '../../../corporate/trade/lc/initiation/services/enquiry.service';
import { UtilityService } from '../../../corporate/trade/lc/initiation/services/utility.service';
import { CommonService } from '../../services/common.service';
import { FormatAmdNoService } from '../../services/format-amd-no.service';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../core/fcc-global-constants';
import { TransactionDetailService } from './../../services/transactionDetail.service';

/**
 * Transaction data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface TransactionNode {
  name: string;
  action?: string;
  date?: string;
  children?: TransactionNode[];
}

@Component({
  selector: 'app-review-screen',
  templateUrl: './review-screen.component.html',
  styleUrls: ['./review-screen.component.scss']
})
export class ReviewScreenComponent implements OnInit, OnDestroy {

  menuToggleFlag;
  reviewScreenWidgets = [];
  screenName: string;
  referenceId: string;
  productCode: string;
  subProductCode: string;
  transactionId;
  transactionUrl: string;
  pagePermission: string;
  apiId;
  apiProductCode;
  apiSubProductCode: string;
  subscription: Subscription;
  treeControl = new NestedTreeControl<TransactionNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TransactionNode>();
  currentNode: any;
  dir: string = localStorage.getItem('langDir');
  lastLoginLabel: string;
  showLastLogin: boolean;
  userDateTime: string;
  bankDateTime: string;
  isBankTime = false;
  globalDashboardUrl: any;
  isRefId: boolean = false;

  @ViewChild('drawer') protected drawer: MatDrawer;
  constructor(
    protected commonService: CommonService,
    protected route: ActivatedRoute,
    public fccGlobalConstantService: FccGlobalConstantService,
    protected enquiryService: EnquiryService,
    protected router: Router,
    protected transactionDetailService: TransactionDetailService,
    protected translate: TranslateService,
    protected formatAmdNoService: FormatAmdNoService,
    protected datepipe: DatePipe, protected utilityService: UtilityService
  ) {
    this.subscription = commonService.journeyClicked$.subscribe(
      () => {
        if (this.currentNode) {
          this.treeControl.collapse(this.currentNode);
        }
        this.currentNode = null;
        this.drawer.toggle();
        document.body.style.overflow = 'auto';
    });
  }

  hasChild = (_: number, node: TransactionNode) => !!node.children && node.children.length > 0;

  ngOnInit() {
    const tnxid = 'tnxid';
    const referenceid = 'referenceid';

    const subProductCode = 'subProductCode';

    this.commonService.getMenuValue().subscribe((value) => {
      this.menuToggleFlag = value;
    });

    this.route.queryParams.subscribe(params => {
      this.transactionId = params[tnxid];
      this.referenceId = params[referenceid];
      this.productCode = this.referenceId.substring(0, FccGlobalConstant.LENGTH_2);
      this.subProductCode = params[subProductCode];
    });

    if (this.transactionId === '') {
      this.apiId = this.referenceId;
      if(FccGlobalConstant.subProdCode_for_actionCode.indexOf(this.subProductCode)>-1){
        this.apiProductCode = this.productCode;
        this.apiSubProductCode=this.subProductCode;
        this.isRefId = true;
      }else{
      this.apiProductCode = undefined;
      this.apiSubProductCode = undefined;
      }
    } else {
      this.apiProductCode = this.productCode;
      this.apiId = this.transactionId;
      this.apiSubProductCode = this.subProductCode;
    }
    this.commonService.getJourneyDetails(this.referenceId, this.transactionId).subscribe(response => {
      if (response.body.items) {
      this.populateTreeData(response.body.items);
      } else {
        this.populateTreeData([]);
      }
    });
    const permissionMap = new Map();
    this.enquiryService.getEnquiryModel(this.productCode, this.subProductCode).then(data => {
      const eventModelJson = data;
      const pagePermission = 'pagePermission';
      this.pagePermission = eventModelJson[pagePermission];
      permissionMap.set(this.pagePermission, false);

      this.commonService.getButtonPermission(permissionMap).subscribe( permission => {

    if (permission.get(this.pagePermission) === true) {

      this.transactionDetailService.fetchTransactionDetails(this.apiId, this.apiProductCode, false, 
        this.apiSubProductCode, this.isRefId).toPromise().then(response => {
          // this.enquiryService.getEnquiryModel(this.productCode).then(data => {
            const section = eventModelJson[this.productCode];
            for (const sectionData of section) {
              const widgetKeyArray = Object.keys(sectionData);
              widgetKeyArray.forEach( element => {
              const largeCards: {'widgetSelector': string , 'recordDetails': any , 'transactionCode': any , 'widgetData': any} = {
              widgetSelector: element , recordDetails: {
              transactionId: this.transactionId, referenceId : this.referenceId , productCode : this.productCode
              }, transactionCode: response , widgetData: sectionData[element] };
              this.reviewScreenWidgets.push(largeCards);
              });
            }
        // });
},
() => {
  this.commonService.redirectPage();
});
} else {
  this.commonService.getDashboardUrl();
    this.router.navigate([this.commonService.globalDashboardUrl]);
}
     });

    });
}

populateTreeData(items) {
  const TREE_DATA: TransactionNode[] = [];
  for (const item of items) {
    const childArr = [];
    if (item.validationSteps.length > 0) {
      for (const child of item.validationSteps) {
        childArr.push({
          name: child.fullName,
          action: `${this.translate.instant('ACTION_' + child.actionLabel)}`,
          date: this.utilityService.transformDateTimeFormat((child.date))
        });
      }
    } else {
      childArr.push({
        name:  item.inputterName ? item.inputterName : `${this.translate.instant('bankUser')}`,
        action: `${this.translate.instant('bankInitiate')}`,
        date: this.commonService.isnonEMptyString(item.bo_release_dttm) ?
          this.utilityService.transformDateTimeFormat((item.bo_release_dttm)) :
          this.utilityService.transformDateTimeFormat(
            this.commonService.isnonEMptyString(item.appl_date) ? item.appl_date : item.inp_dttm)
      });
    }
    let tnxType = '';
    let subTnxType = '';
    if (item.tnx_type_code === FccGlobalConstant.LENGTH_15.toString() && item.prod_stat_code !== '' &&
      item.prod_stat_code !== undefined) {
      subTnxType = `${this.translate.instant('N005_' + item.prod_stat_code)}`;
    }
    if (item.sub_tnx_type_code !== '' && item.sub_tnx_type_code !== undefined &&
      item.tnx_type_code === FccGlobalConstant.N002_MESSAGE.toString() && this.productCode !== FccGlobalConstant.PRODUCT_LN) {
    subTnxType = `${this.translate.instant('LIST_N003_' + item.sub_tnx_type_code)}`;
    }
    tnxType = this.tnxTypeCodeAlias(item);
    if (subTnxType !== '') {
      tnxType = tnxType + ' (' + subTnxType + ')';
    }
    let amdNoValue = '';
    const amdNo = item.amd_no;
    if (item.prod_stat_code && item.prod_stat_code === FccGlobalConstant.N005_AMENDED && amdNo) {
      amdNoValue = this.formatAmdNoService.formatAmdNo(amdNo);
      if (amdNoValue) {
        tnxType = `${tnxType} ${amdNoValue}`;
      }
    }
    TREE_DATA.push({
      name: tnxType,
      children: childArr
    });
  }
  this.dataSource.data = TREE_DATA;
}

  tnxTypeCodeAlias(item: any) {
    let eventTypeName: any;
    switch (this.productCode) {
      case FccGlobalConstant.PRODUCT_TD:
        eventTypeName = this.translate.instant('N002_TD_' + item.tnx_type_code);
        break;
      case FccGlobalConstant.PRODUCT_LN:
        eventTypeName = `${this.translate.instant('N002_' + this.productCode + '_' + item.tnx_type_code)}`;
        break;
      case FccGlobalConstant.PRODUCT_BK:
        eventTypeName = `${this.translate.instant('N002_' + this.productCode + '_' + this.subProductCode + '_' + item.tnx_type_code)}`;
        break;
      default:
        if (item.tnx_type_code === FccGlobalConstant.N002_AMEND || item.tnx_type_code === FccGlobalConstant.N002_NEW) {
          eventTypeName = `${this.translate.instant('LIST_N002_' + item.tnx_type_code)}`;
        } else {
          eventTypeName = `${this.translate.instant('N002_' + item.tnx_type_code)}`;
        }
        break;
    }
    return eventTypeName;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleNodes(node) {
    if (this.treeControl.isExpanded(node)) {
      if (!this.currentNode) {
        this.currentNode = node;
      } else {
        this.treeControl.collapse(this.currentNode);
        this.currentNode = node;
      }
    } else {
      this.currentNode = null;
    }
  }
  toggleNodesKeyboard(node) {
    if (!this.treeControl.isExpanded(node)) {
        this.currentNode = node;
        this.treeControl.expand(this.currentNode);
    } else {
      this.treeControl.collapse(this.currentNode);
      this.currentNode = node;
    }
  }
closenav() {
  document.body.style.overflow = 'scroll';
}
@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event:
  KeyboardEvent) {
    if (event){
      this.drawer.close();
      this.closenav();
    }
 }

}
