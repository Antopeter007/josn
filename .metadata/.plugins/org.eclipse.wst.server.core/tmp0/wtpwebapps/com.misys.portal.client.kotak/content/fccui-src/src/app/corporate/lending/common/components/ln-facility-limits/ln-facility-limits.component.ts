import { MultiBankService, EntityDropDown } from './../../../../../common/services/multi-bank.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
@Component({
  selector: 'fcc-ln-facility-limits',
  templateUrl: './ln-facility-limits.component.html',
  styleUrls: ['./ln-facility-limits.component.scss']
})
export class LnFacilityLimitsComponent implements OnInit, OnChanges {
  @Input() inputParams;
  dir: string = localStorage.getItem('langDir');
  listDefData = [
    { header: 'LNSubLimits', listDefName: '/loan/listdef/customer/LN/lnFacilitySubLimitLists', grid: 'p-lg-6' },
    { header: 'LNRiskLimits', listDefName: '/loan/listdef/customer/LN/lnFacilityRiskLimitList', grid: 'p-lg-6' },
    { header: 'LNBorrowerLimits', listDefName: '/loan/listdef/customer/LN/lnFacilityBorrowerLimits', grid: 'p-lg-6' },
    { header: 'LNCurrencyLimits', listDefName: '/loan/listdef/customer/LN/lnFacilityCurrencyLimitLists', grid: 'p-lg-6' }
  ];
  facilityData: any;
  borrowers: [] = [];
  step = 0;
  filterValues ;
  borrowerEntitiesMap: Map<string, Set<EntityDropDown>>;


  constructor(protected multiBankService: MultiBankService) { }
  defaultFilterCriteria: any = {};

  ngOnInit(): void {
      this.createInputParams();
  }

  ngOnChanges(){
      this.createInputParams();
  }

  setDirection() {
    if (this .dir === 'rtl') {
      return 'right';
    } else {
      return 'left';
    }
  }

  createInputParams = () => {
    if (this.inputParams.facilityDetailsResponse) {
    this.multiBankService.getCustomerBankDetailsAPI(FccGlobalConstant.PRODUCT_LN, '', FccGlobalConstant.REQUEST_INTERNAL).subscribe(
    res => {
      this.multiBankService.initializeLendingProcess(res);
      this.borrowerEntitiesMap = this.multiBankService.getCustomerEntities();
      this.facilityData = this.inputParams.facilityDetailsResponse;
      this.borrowers = this.facilityData !== undefined ? this.facilityData.borrowers : [];
      if (this.borrowers.length !== 0 ){
          this.setDefaultFilterCriteria();
          this.listDefData = this.listDefData.map((e) => ({ ...e, inputParams: {
          listdefName: e.listDefName,
          showFilterSection: false,
          paginator: false,
          downloadIconEnabled: false,
          colFilterIconEnabled: false,
          passBackEnabled: true,
          columnSort: true,
          productCode: FccGlobalConstant.PRODUCT_LN,
          [FccGlobalConstant.HEADER_DISPLAY]: false,
          filterParamsRequired: true,
          defaultFilterCriteria: this.defaultFilterCriteria
        } }));
      }
          },
    () => {
    this.multiBankService.clearAllData();
          });
    }
  };
  setDefaultFilterCriteria() {
    this.defaultFilterCriteria[FccGlobalConstant.FACILITYID] = this.facilityData.facilityId;
    this.defaultFilterCriteria[FccGlobalConstant.BORROWERID] = this.borrowers[this.step][`borrowerId`];
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
