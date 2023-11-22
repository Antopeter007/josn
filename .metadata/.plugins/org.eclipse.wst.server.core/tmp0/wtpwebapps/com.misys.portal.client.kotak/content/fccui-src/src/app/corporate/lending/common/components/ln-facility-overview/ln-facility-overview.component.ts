import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

import {
  InstructionInquiryComponent,
} from './../../../../../common/components/instruction-inquiry/instruction-inquiry.component';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { HideShowDeleteWidgetsService } from './../../../../../common/services/hide-show-delete-widgets.service';
import { Amount } from './../../../../trade/lc/initiation/model/amount';
import { CurrencyConverterPipe } from './../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from './../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { LendingCommonDataService } from './../../service/lending-common-data-service';

@Component({
  selector: 'fcc-ln-facility-overview',
  templateUrl: './ln-facility-overview.component.html',
  styleUrls: ['./ln-facility-overview.component.scss']
})
export class FacilityOverviewComponent implements OnInit, AfterViewInit, OnDestroy{
  sideNavTF = false;
  menuToggleFlag: any;
  inputParams: any = {};
  dir: string = localStorage.getItem('langDir');
  productCode: string;
  facilityId: string;
  facilityName: string;
  dealId: string;
  dealName: string;
  overlayRef: OverlayRef;
  borrowerIds: any;
  componentRef: any;
  entityNavPosition = 'end';
  facilityDetail: any = {};
  renderSection = false;
  showFacilityFeeScreenDelay = false;
  status: string;
  displayFacilityFeeCycle = false;
  entitySubscription: Subscription;
  entitySuccessSubsription: Subscription;
  initalDrawDownTF = false;
  initiateFeePayment = false;
  swinglineAllowed: any;
  drawdownAllowed: any;
  contextPath: any;
  facDetailTF = false;
  @ViewChild('drawer') public drawer: MatDrawer;
  @ViewChild('docSearchbutton', { static: true }) public docSearchbutton: ElementRef;
  constructor(protected commonService: CommonService,
              protected activatedRoute: ActivatedRoute,
              protected router: Router,
              protected lendingService: LendingCommonDataService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected overlay: Overlay) { }

  ngAfterViewInit(): void {
    this.showFacilityFeeScreenDelay = true;
  }

  ngOnDestroy(): void {
    this.commonService.displayFacilityFeeCycle.next(false);
  }

  ngOnInit(): void {
    this.contextPath = this.commonService.getContextPath();
    this.initalDrawDownTF = false;
    this.initiateFeePayment = false;
    this.commonService.getMenuValue().subscribe((value) => {
      this.menuToggleFlag = value;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.productCode = params[FccGlobalConstant.PRODUCT];
      this.facilityId = params[FccGlobalConstant.FACILITY_ID];
      this.dealId = params[FccGlobalConstant.DEALID];
      this.dealName = params[FccGlobalConstant.DEAL_NAME];
      this.status = params[FccGlobalConstant.STATUS];
      this.facilityName = params[FccGlobalConstant.FACILITY_NAME];
      this.swinglineAllowed = params[FccGlobalConstant.SWINGLINE_ALLOWED_FLAG];
      this.drawdownAllowed = params[FccGlobalConstant.DRAWDOWN_ALLOWED_FLAG];
      this.inputParams = params;
      this.getFacilityDetails();
    });
    // this.displayFacilityFeeCycle = this.commonService.displayFacilityFeeCycle;
    this.commonService.displayFacilityFeeCycle.subscribe(data => {
      this.displayFacilityFeeCycle = data;
      });
    this.entitySubscription = this.commonService.listenInstInquiryClicked$.subscribe(
        rowdata => {
          this.createOverlay();
          this.commonService.setComponentRowData(rowdata);
          const portal = new ComponentPortal(InstructionInquiryComponent);
          this.componentRef = this.overlayRef.attach<InstructionInquiryComponent>(portal);
          this.componentRef.instance.overlayRef = this.overlayRef;
          this.componentRef.instance.closeSetEntityOverlay.subscribe(() => {
            this.docSearchbutton.nativeElement.focus();
            this.overlayRef.dispose();
            this.hideShowDeleteWidgetsService.customiseSubject.next(false);
            document.body.style.overflow = 'scroll';
          });
        });
    this.entitySuccessSubsription = this.commonService.listenSetEntitySuccess$.subscribe(
        res => {
          if (res === 'yes') {
            this.overlayRef.dispose();
            this.hideShowDeleteWidgetsService.customiseSubject.next(false);
            document.body.style.overflow = 'scroll';
        }
      });
    this.commonService.displayFacilityFeeCycle.subscribe(data => {
      this.displayFacilityFeeCycle = data;
    });
  }

  createOverlay() {
    const config = new OverlayConfig();
    config.hasBackdrop = true;
    this.overlayRef = this.overlay.create(config);
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.dispose();
      document.body.style.overflow = 'scroll';
      this.hideShowDeleteWidgetsService.customiseSubject.next(false);
    });
    this.hideShowDeleteWidgetsService.customiseSubject.next(true);
    document.body.style.overflow = 'hidden';
  }

  getFacilityDetails() {
    const facDetailArray = [];
    this.lendingService.getFacilityDetails(this.facilityId, []).subscribe(response => {
      this.inputParams = { ...this.inputParams, facilityDetailsResponse: response.body };
      this.facDetailTF = true;
      const buttonPermissionData = response.body.borrowers;
      if (this.status.toLowerCase() === 'active'){
        this.initiateFeePayment = this.commonService.getUserPermissionFlag(FccGlobalConstant.BK_BLFP_SAVE);
        if (buttonPermissionData){
          buttonPermissionData.map((e) => {
            if ((e.isDrawdownAllowed || e.isSwinglineAllowed) &&
            parseFloat(response.body.availableToDraw === '' ? '0' : response.body.availableToDraw) > 0){
              this.initalDrawDownTF = true;
            }
          });
        }
      }else{
        this.initalDrawDownTF = false;
        this.initiateFeePayment = false;
      }
      const displayKeys: DisplayKeys = {
        dealName: undefined,
        facilityName: undefined,
        type: undefined,
        mainCurrency: undefined,
        totalLimit: { amount: undefined, currency: undefined },
        availableToDraw: { amount: undefined, currency: undefined },
        balanceOutStanding: { amount: undefined, currency: undefined },
        fcn: undefined,
        borrowers: [],
        status: this.status,
        availableWithPendingLoans: { amount: undefined, currency: undefined },
        utilisedAmount: { amount: undefined, currency: undefined }
      };
      Object.keys(displayKeys).forEach(key => {
        const facilityDetailObj = {};
        if (typeof displayKeys[key] === 'object' && !Array.isArray(displayKeys[key])) {
          facilityDetailObj[`fieldType`] = 'amount';
          facilityDetailObj[`currency`] = response.body[`mainCurrency`];
          facilityDetailObj[`key`] = key;
          facilityDetailObj[`value`] = this.currencyConverterPipe.transform(
           parseInt (response.body[key], 0) > 0 ? response.body[key] : FccGlobalConstant.ZERO_STRING, response.body[`mainCurrency`]);
        } else if (response.body[key] && displayKeys[key] && Array.isArray(displayKeys[key])) {
          facilityDetailObj[`key`] = key;
          let value = '';
          response.body[key].forEach(borrower => {
            value = value + borrower.fccReference + ', ';
          });
          value = value.replace(/,\s*$/, '');
          facilityDetailObj[`value`] = value;
        }else {
          facilityDetailObj[`key`] = key;
          facilityDetailObj[`value`] = displayKeys[key] ? displayKeys[key] : response.body[key];
        }
        facDetailArray.push(facilityDetailObj);
      });
      this.facilityDetail[`detail`] = facDetailArray;
      this.renderSection = true;
    });

  }
  getDataOnRowClick() {
    //eslint : no-empty-function
  }

  removeDataOnRowClick() {
    //eslint : no-empty-function
  }
  setButtonBlockDirection() {
    if (this.dir === 'rtl') {
    return 'left';
    } else {
    return 'right';
    }
  }
  navigateSearch() {
    this.sideNavTF = true;
    const input = {
      facilityName: this.facilityName,
      productCode: this.productCode
    };
    this.commonService.isInstInquiryClicked(input);
  }
  navigateButtonUrl() {
    this.router.navigate(['productScreen'], {
      queryParams: {
        productCode: this.productCode,
        tnxTypeCode: '01',
        mode: 'INITIATE',
        facilityid: this.facilityId,
        swinglineAllowed: this.swinglineAllowed,
        drawdownAllowed: this.drawdownAllowed
      }
    });
  }
  navigateFeePayment() {
    this.router.navigate(['productScreen'], {
      queryParams: {
        productCode: FccGlobalConstant.PRODUCT_BK,
        subProductCode: FccGlobalConstant.SUB_PRODUCT_BLFP,
        tnxTypeCode: '01',
        mode: 'INITIATE',
        option: FccGlobalConstant.BK_LOAN_FEE_PAYMENT,
        dealName: this.dealName,
        dealId: this.dealId,
        facilityId: this.facilityId,
        facilityName: this.facilityName
      }
    });
  }
  onCloseMatDrawer() {
    this.sideNavTF = false;
    this.drawer.close();
    this.hideShowDeleteWidgetsService.customiseSubject.next(false);
    document.body.style.overflow = 'scroll';
  }
  onHeaderCheckboxToggle() {
    //eslint : no-empty-function
  }
}

export interface DisplayKeys {
  dealName: string;
  facilityName: string;
  type: string;
  mainCurrency: string;
  totalLimit: Amount;
  availableToDraw: Amount;
  balanceOutStanding: Amount;
  availableWithPendingLoans: Amount;
  utilisedAmount: Amount;
  fcn: string;
  borrowers: any[];
  status: string;
}
