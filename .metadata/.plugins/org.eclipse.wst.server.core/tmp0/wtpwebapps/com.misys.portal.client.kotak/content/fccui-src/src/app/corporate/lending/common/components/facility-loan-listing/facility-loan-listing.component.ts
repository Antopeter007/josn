
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fcc-facility-loan-listing',
  templateUrl: './facility-loan-listing.component.html',
  styleUrls: ['./facility-loan-listing.component.scss']
})
export class FacilityLoanListingComponent implements OnInit {

  menuToggleFlag: any;
  dir: string = localStorage.getItem('langDir');
  @Input() inputParams;
  params: any = {};
  defaultFilterCriteria: any = {};
  constructor(protected commonService: CommonService) { }

  ngOnInit(): void {
    const productCode = 'ProductCode';
    const option = 'Option';
    Object.keys(this.inputParams).forEach(entryKey => {
      this.params[entryKey] = this.inputParams[entryKey];
    });
    this.params[productCode] = this.inputParams[FccGlobalConstant.PRODUCT];
    this.params[option] = 'FACILITYOVERVIEW';
    this.params[FccGlobalConstant.PASSBACK_ENABLED] = true;
    this.params[FccGlobalConstant.BUTTONS] = false;
    this.params[FccGlobalConstant.SAVED_LIST] = false;
    this.params[FccGlobalConstant.HEADER_DISPLAY] = false;
    this.params[FccGlobalConstant.DOWNLOAD_ICON_ENABLED] = true;
    this.params[FccGlobalConstant.FILTER_PARAMS_REQUIRED] = true;
    this.setDefaultFilterCriteria();
    this.params[FccGlobalConstant.DEFAULT_CRITERIA] = this.defaultFilterCriteria;
  }

  setDefaultFilterCriteria() {
    this.defaultFilterCriteria[FccGlobalConstant.BO_FACILITY_NAME] = this.inputParams[FccGlobalConstant.FACILITY_NAME];
    this.defaultFilterCriteria[FccGlobalConstant.BO_DEAL_NAME] = this.inputParams[FccGlobalConstant.DEAL_NAME];
  }

}
