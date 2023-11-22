import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';

@Component({
  selector: 'fcc-facility-fee-listing',
  templateUrl: './facility-fee-listing.component.html',
  styleUrls: ['./facility-fee-listing.component.scss']
})
export class FacilityFeeListingComponent implements OnInit, AfterViewInit, OnDestroy {

  dir: string = localStorage.getItem('langDir');
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
  pageTitle = '';

  @Input()
  inputParams;

  params: any = {};

  defaultFilterCriteria: any = {};

  constructor(
    protected translate: TranslateService,
    protected commonService: CommonService,
    protected fccGlobalConstantService: FccGlobalConstantService) {
      this.pageTitle = FccGlobalConstant.FEES;
    }
    facilityData;
    borrowers;
    borrowersIDS = '';

  ngOnInit(): void {
      this.borrowersIDS = '';
      const productCode = 'productCode';
      Object.keys(this.inputParams).forEach(entryKey => {
        this.params[entryKey] = this.inputParams[entryKey];
      });
      this.params[productCode] = this.inputParams[FccGlobalConstant.PRODUCT];
      this.facilityData = this.inputParams.facilityDetailsResponse;
      this.borrowers = this.facilityData !== undefined ? this.facilityData.borrowers : [];
      this.borrowers.map((ele, index) => {
        this.borrowersIDS = (index === 0) ? ele.borrowerId : `${this.borrowersIDS},${ele.borrowerId}`;
      });
      this.items = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
      this.contextPath = this.fccGlobalConstantService.contextPath;
      this.pendingActionFuchsia = this.contextPath + '/content/FCCUI/assets/icons/pendingActionFuchsia.svg';
      this.pendingActionGrey = this.contextPath + '/content/FCCUI/assets/icons/pendingActionGrey.svg';
      this.xmlName = 'loan/listdef/customer/LN/inquiryLNFacilityFeeList';
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

      const selectedRow = 'selectedRow';

      this.params[listdefName] = this.xmlName;
      this.params[showFilterSection] = false;
      this.params[paginator] = false;
      this.params[downloadIconEnabled] = true;
      this.params[colFilterIconEnabled] = false;
      this.params[passBackEnabled] = true;
      this.params[columnSort] = true;
      this.params[productCode] = 'LN';
      this.params[filterParamsRequired] = true;
      this.params[exportFileName] = 'facility-fees';
      this.params[selectedRow] = true; // To make auto select first radio button
      this.commonService.defaultLicenseFilter = true;
      this.commonService.licenseCheckBoxRequired = 'N';
      this.commonService.radioButtonHeaderRequired = true;
      this.setDefaultFilterCriteria();
      this.params[FccGlobalConstant.DEFAULT_CRITERIA] = this.defaultFilterCriteria;
  }

  setDefaultFilterCriteria() {
    this.defaultFilterCriteria[FccGlobalConstant.BORROWER_ID] = this.borrowersIDS;
    this.defaultFilterCriteria[FccGlobalConstant.FACILITY_ID] = this.inputParams[FccGlobalConstant.FACILITY_ID];
  }

  ngAfterViewInit() {
    this.commonService.defaultLicenseFilter = false;
    this.commonService.licenseCheckBoxRequired = 'Y';
    this.commonService.radioButtonHeaderRequired = false;
  }

  ngOnDestroy(): void {
    this.commonService.defaultLicenseFilter = false;
    this.commonService.licenseCheckBoxRequired = 'Y';
    this.commonService.radioButtonHeaderRequired = false;
  }

  getDataOnRowClick(event) {
    this.commonService.displayFacilityFeeCycle.next(false);
    const data = event.data;
    setTimeout(() => {
      this.commonService.displayFacilityFeeCycle.next(true);
      this.commonService.facilityFeeCycleFilterCriteria.next(data);
    }, 200);
  }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeDataOnRowClick(event){
    this.commonService.displayFacilityFeeCycle.next(false);
  }
}
