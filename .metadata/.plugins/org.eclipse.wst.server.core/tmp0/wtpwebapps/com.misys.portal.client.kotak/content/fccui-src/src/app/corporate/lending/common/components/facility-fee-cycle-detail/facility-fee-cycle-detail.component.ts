import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';

@Component({
  selector: 'fcc-facility-fee-cycle-detail',
  templateUrl: './facility-fee-cycle-detail.component.html',
  styleUrls: ['./facility-fee-cycle-detail.component.scss']
})
export class FacilityFeeCycleDetailComponent implements OnInit {

  widgetDetails: any;
  items;
  refID;
  xmlName;
  productCode;
  filterParams;
  contextPath;
  pendingActionGrey;
  pendingActionFuchsia;
  subProductCode = '';

  @Input()
  inputParams;
  params: any = {};
  defaultFilterCriteria: any = {};
  boRefID;
  facilityID;
  lnCcy;
  facilityFeeCycleFilterData: any = {};
  pageTitle = '';
  constructor(
    protected translate: TranslateService,
    protected commonService: CommonService,
    protected fccGlobalConstantService: FccGlobalConstantService) {
    }

  ngOnInit(): void {

      this.commonService.facilityFeeCycleFilterCriteria.subscribe(res => {
        this.pageTitle = res.description;
      });

      const productCode = 'productCode';
      Object.keys(this.inputParams).forEach(entryKey => {
        this.params[entryKey] = this.inputParams[entryKey];
      });

      this.commonService.facilityFeeCycleFilterCriteria.subscribe(data => {
        this.facilityFeeCycleFilterData = data;
        this.setDefaultFilterCriteria();
        this.params[FccGlobalConstant.DEFAULT_CRITERIA] = this.defaultFilterCriteria;
        this.commonService.displayFacilityFeeCycle.next(true);
      });

      this.params[productCode] = this.inputParams[FccGlobalConstant.PRODUCT];

      this.items = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
      this.contextPath = this.fccGlobalConstantService.contextPath;
      this.pendingActionFuchsia = this.contextPath + '/content/FCCUI/assets/icons/pendingActionFuchsia.svg';
      this.pendingActionGrey = this.contextPath + '/content/FCCUI/assets/icons/pendingActionGrey.svg';
      this.xmlName = 'loan/listdef/customer/LN/inquiryLNFacilityFeeCycle';

      const listdefName = 'listdefName';
      const showFilterSection = 'showFilterSection';
      const paginator = 'paginator';
      const downloadIconEnabled = 'downloadIconEnabled';
      const colFilterIconEnabled = 'colFilterIconEnabled';
      const passBackEnabled = 'passBackEnabled';
      const columnSort = 'columnSort';
      this.contextPath = this.commonService.getContextPath();
      const filterParamsRequired = 'filterParamsRequired';
      const exportFileName = 'exportFileName';

      this.params[listdefName] = this.xmlName;
      this.params[showFilterSection] = false;
      this.params[paginator] = true;
      this.params[downloadIconEnabled] = true;
      this.params[colFilterIconEnabled] = true;
      this.params[passBackEnabled] = true;
      this.params[columnSort] = true;
      this.params[productCode] = 'LN';
      this.params[filterParamsRequired] = true;
      this.params[exportFileName] = 'Facility-Fee-Cycle-Detail';
  }

  setDefaultFilterCriteria() {
    this.defaultFilterCriteria[FccGlobalConstant.BORROWER_ID] = this.inputParams[FccGlobalConstant.BORROWER_IDS];
    this.defaultFilterCriteria[FccGlobalConstant.FACILITY_ID] = this.inputParams[FccGlobalConstant.FACILITY_ID];
    this.defaultFilterCriteria[FccGlobalConstant.FEE_TYPE] = this.facilityFeeCycleFilterData.description;
    this.defaultFilterCriteria[FccGlobalConstant.FEE_RID] = this.facilityFeeCycleFilterData.feeRID;
    this.defaultFilterCriteria[FccGlobalConstant.EFFECTIVE_DATE] = this.facilityFeeCycleFilterData.effectiveDate;
    this.defaultFilterCriteria[FccGlobalConstant.DUE_DATE] = this.facilityFeeCycleFilterData.actualDueDate;
    this.defaultFilterCriteria[FccGlobalConstant.FAC_CCY] = this.facilityFeeCycleFilterData.currency;
  }
}
