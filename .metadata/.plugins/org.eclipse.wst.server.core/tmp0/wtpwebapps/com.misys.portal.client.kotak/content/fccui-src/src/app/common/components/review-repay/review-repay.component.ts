import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';
import { ListDefService } from '../../services/listdef.service';
import { UtilityService } from './../../../corporate/trade/lc/initiation/services/utility.service';
import { FormatAmdNoService } from '../../services/format-amd-no.service';
@Component({
  selector: 'fcc-review-repayment',
  templateUrl: './review-repay.component.html',
  styleUrls: ['./review-repay.component.scss']
})
export class ReviewRepaymentComponent implements OnInit {
  widgetDetails: any;
  isMaker = false;
  items;
  refID;
  xmlName;
  productCode;
  filterParams;
  contextPath;
  pendingActionGrey;
  pendingActionFuchsia;
  subProductCode = '';
  componentTitle;
  downloadTitle = 'Download';
  inputParams: any = {};
  dir: string = localStorage.getItem('langDir');
  csvDownload = this.translate.instant('csvDownload');
  generalDetails = [];
  boRefID;
  lnCcy;
  constructor(
    protected formatAmdNoService: FormatAmdNoService, protected utilityService: UtilityService,
    protected listService: ListDefService, protected translate: TranslateService, protected commonService: CommonService,
    protected fccGlobalConstantService: FccGlobalConstantService) { }

  ngOnInit(): void {
    this.items = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.refID = this.items.recordDetails.referenceId;
    this.boRefID = this.items.transactionCode.body.bo_ref_id;
    this.lnCcy = this.items.transactionCode.body.ln_cur_code;
    this.productCode = this.items.recordDetails.productCode;
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.pendingActionFuchsia = this.contextPath + '/content/FCCUI/assets/icons/pendingActionFuchsia.svg';
    this.pendingActionGrey = this.contextPath + '/content/FCCUI/assets/icons/pendingActionGrey.svg';
    this.xmlName = 'loan/listdef/customer/LN/inquiryLNRepaymentCycleInfo';
    // this.items.widgetData.displayTabs.forEach(element => {
    //   if (element.interest) {
    //     this.xmlName = element.events.child.listdefPath;
    //   }
    // });

    const filterValues = {};
    const borefidkey = 'borefid';
    filterValues[borefidkey] = this.boRefID;
    const loanCcykey = 'loan_ccy';
    filterValues[loanCcykey] = this.lnCcy;
    this.filterParams = JSON.stringify(filterValues);
    const paginatorParams = {};
    const makerPermission = this.commonService.getPermissionName(this.productCode, 'save', this.subProductCode);
    this.commonService.getUserPermission(makerPermission).subscribe(result => {
      if (result) {
        this.isMaker = true;
      } else {
        this.isMaker = false;
      }
    });
    const listdefName = 'listdefName';
    const showFilterSection = 'showFilterSection';
    const paginator = 'paginator';
    const downloadIconEnabled = 'downloadIconEnabled';
    const colFilterIconEnabled = 'colFilterIconEnabled';
    const passBackEnabled = 'passBackEnabled';
    const columnSort = 'columnSort';
    this.contextPath = this.commonService.getContextPath();
    const productCode = 'productCode';
    const filterParam = 'filterParams';
    const filterParamsRequired = 'filterParamsRequired';
    const exportFileName = 'exportFileName';
    const filterChipsRequired = 'filterChipsRequired';

    this.inputParams[listdefName] = this.xmlName;
    this.inputParams[filterChipsRequired] = false;
    this.inputParams[showFilterSection] = false;
    this.inputParams[paginator] = true;
    this.inputParams[downloadIconEnabled] = true;
    this.inputParams[colFilterIconEnabled] = true;
    this.inputParams[passBackEnabled] = true;
    this.inputParams[columnSort] = true;
    this.inputParams[productCode] = 'LN';
    this.inputParams[filterParamsRequired] = true;
    this.inputParams[filterParam] = filterValues;
    this.inputParams[exportFileName] = 'Repayment Schedule';

    this.listService.getTableData(this.xmlName, this.filterParams , JSON.stringify(paginatorParams))
    .subscribe(result => {
    const tmpdata = result.rowDetails.map((ele) => ele.index);
    tmpdata.map( ( el , index ) => {
        el.map( e => {

          if ( index === 0) {
            if ( e.name === FccGlobalConstant.REPAYTYPE ) {
              this.generalDetails.push( { key: 'repaymentType', value: this.commonService.decodeHtml(e.value) } ); }
            if ( e.name === FccGlobalConstant.REPAYFREQUENCY ) {
              this.generalDetails.push( { key: 'repaymentFrequency', value: this.translate.instant(e.value) } ); }
            if ( e.name === FccGlobalConstant.OUTSTANDING_AMOUNT ) {
              this.generalDetails.push( { key: 'currentOutstandingAmt', value: this.commonService.decodeHtml(e.value) } ); }
            if ( e.name === FccGlobalConstant.REPAYCURRENCY ) { this.generalDetails.push( { key: 'loan_ccy', value: e.value } ); }
            }
        });
    });
    this.componentTitle = tmpdata.length === 0 ? null : 'General';
    });

  }

}

