import { FccConstants } from "../../../common/core/fcc-constants";
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { ProductService } from "../../../base/services/product.service";
import { FccGlobalConstant } from "../../core/fcc-global-constants";
import { ProductFormHeaderParams } from "../../model/params-model";
import { CommonService } from "../../services/common.service";
import { ConfirmationGuardDialogComponent } from "../../../confirmation-guard-dialog/confirmation-guard-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ProductStateService } from "../../../corporate/trade/lc/common/services/product-state.service";
import { EventEmitterService } from "../../services/event-emitter-service";
import { Overlay } from "@angular/cdk/overlay";
import moment from 'moment';
//const moment = require('moment');

@Component({
  selector: "product-form-header",
  templateUrl: "./product-form-header.component.html",
  styleUrls: ["./product-form-header.component.scss"],
})
export class ProductFormHeaderComponent implements OnInit,AfterViewInit, OnDestroy {
  @Input() data: ProductFormHeaderParams;
  productFormKey: string;
  productformrefId: string;
  formName: string;
  isViewDetailEnabled: boolean;
  isSubHeaderEnabled: boolean;
  mainheaderStyle: any;
  mainheaderStyleArabic = "mainheaderArabic";
  mainheader = "mainheader";
  view;
  subHeaderText;
  dir: string = localStorage.getItem("langDir");
  innerTabsData: any;
  currentSection: any;
  oldIndex = 0;
  singleOldIndex = 0;
  tabChange: boolean;
  activeIndex = 0;
  activeInnerIndex = 0;
  displayTime = false;
  savedTime: any;
  styleClassName: string;
  sysId = 'sysID';
  sysTdArabic = 'sysIDarabic';
  setSystemID = false;
  channelRefID: any;
  showDescription: boolean;


  constructor(protected overlay: Overlay,
    protected productService: ProductService,
    protected translateService: TranslateService,
    protected commonService: CommonService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected dialog: MatDialog,
    protected stateService: ProductStateService,
    protected eventEmitterService: EventEmitterService
  ) {}
  ngAfterViewInit(): void {
    this.productService.setSectionDetails.subscribe((res) => {
      this.currentSection = res;
      if (document.querySelector(FccConstants.WIDGET_CONTAINER) != null
      && this.currentSection !== FccGlobalConstant.PAYMENTS_BULK_FILEUPLOAD_GENERAL_DETAILS) {
        const cssclass = FccConstants.WIDGET_CONTAINER +","+ FccConstants.RIGHT_HEADER_SECTION;
        const tabCssclass = FccConstants.TAB_PARENT_DIV;
        if (this.currentSection === FccGlobalConstant.SUMMARY_DETAILS) {
          this.display(this.getElementByQuerySelector(cssclass),false);
          this.display(this.getElementByQuerySelector(tabCssclass),false);
        } else {
          if(this.data.operation === FccGlobalConstant.UPDATE_FEATURES && this.data.option === FccGlobalConstant.PAYMENTS){
            this.display(this.getElementByQuerySelector(cssclass),false);
            this.display(this.getElementByQuerySelector(tabCssclass),false);
          }else{
            this.display(this.getElementByQuerySelector(cssclass),true);
            this.display(this.getElementByQuerySelector(tabCssclass),true);
          }
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      this.mainheaderStyle = this.mainheaderStyleArabic;
      this.styleClassName = this.sysTdArabic;
    } else {
      this.mainheaderStyle = this.mainheader;
      this.styleClassName = this.sysId;
    }

    this.formName = this.productService.getFormName(
      this.data.productCode,
      this.data.tnxTypeCode,
      this.data.subTnxTypeCode,
      this.data.subProductCode,
      this.data.option,
      this.data.operation
    );
    if (
      this.data.tnxTypeCode === FccGlobalConstant.N002_NEW &&
      this.formName === FccGlobalConstant.PRODUCT_EL
    ) {
      this.productFormKey = this.translateService.instant(
        "ExportLetterOfCreditMT700Header"
      );
    } else {
      this.productFormKey = this.translateService.instant(this.formName);
    }
    this.showDescription = this.data?.showDescriptionHeader;
    this.view = this.translateService.instant(FccGlobalConstant.VIEW_MODE);
    this.productformrefId =
      this.data.refId !== undefined ? ": ".concat(this.data.refId) : "";
    // To remove the below product specific code once MPS-69379 is fixed.
    if (
      (this.data.productCode === FccGlobalConstant.PRODUCT_LN ||
        this.data.productCode === FccGlobalConstant.PRODUCT_TD) &&
      (this.data.tnxTypeCode === FccGlobalConstant.N002_NEW ||
        this.data.tnxTypeCode === FccGlobalConstant.N002_AMEND ||
        this.data.tnxTypeCode === FccGlobalConstant.N002_INQUIRE)
    ) {
      this.isViewDetailEnabled = false;
    } else {
      this.isViewDetailEnabled = this.productService.isViewDetailEnabled(
        this.data
      );
    }
    this.isSubHeaderEnabled = this.productService.isSubHeaderEnabled(this.data);
    this.oldIndex = this.activeIndex;

    this.commonService.autoSavedTime.subscribe(val=>{
      if(this.commonService.isnonEMptyString(val)) {
        const autoSavedTime = moment(val).format('h:mm A');
        this.displayTime = true;
        this.savedTime = `${this.translateService.instant('autoSavedAt',{ time: autoSavedTime })}`;
      } else {
        this.displayTime = false;
      }
    });
    this.commonService.batchRefId.subscribe((batchRefId) => {
      if(this.commonService.isnonEMptyString(batchRefId)){
        this.setSystemID = true;
        this.channelRefID = batchRefId;
      } else {
        this.setSystemID = false;
      }

    });
    if (this.data && this.data.productsList && this.data.productsList.length > 0) {
    this.commonService.selectedTab.next(this.data.productsList[0]);
    }
    this.route.queryParams.subscribe((data) => {
      this.commonService.setOptionQueryParameterFCM(data.option);
    });
  }

  /**
   * perform onclickview action in product form page
   * @param event onclickview event
   */
  onClickView() {
    this.productService.onClickView$.next(true);
  }

  handleHyperlink(hyperlinkData) {
    if (hyperlinkData?.routerLink) {
      this.router.navigateByUrl(hyperlinkData.routerLink);
    }
  }

  checkTabChange(tab, event) {
    this.commonService.selectedTab.next(this.data.productsList[event.index]);
    if (event.index !== this.oldIndex) {
      let isAutoSaveValid = false;
    if (this.stateService.getAutoSaveConfig()?.isAutoSaveEnabled) {
      isAutoSaveValid = true;
      this.displayTime = true;
    } else {
      isAutoSaveValid = false;
      this.displayTime = false;
    }

    const isConfirmationDialogueVisible = this.commonService.isConfirmationDialogueVisible.value;

    const section = this.stateService.getSectionNames();
    if (this.dialog.openDialogs.length === 0 && isAutoSaveValid === true && isConfirmationDialogueVisible) {
      const dialogRef = this.dialog.open(ConfirmationGuardDialogComponent, {
        panelClass: 'confirmDialogClass',
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        height: 'auto',
        width: '37.5em',
        autoFocus: false,
        disableClose: false,
        hasBackdrop: true,
        data: { isBene: isAutoSaveValid },
      });
      this.commonService.isConfirmationDialogueVisible.next(false);
      dialogRef.afterClosed().subscribe((result) => {
        if (result === "saveForLater") {
          this.eventEmitterService.autoSaveForLater.next(section[0]);
          this.activeIndex = event.index;
          this.onTabChange(tab, event);
        } else if (result === "cancel") {
          this.eventEmitterService.cancelTransaction.next(section[0]);
          this.activeIndex = event.index;
          this.onTabChange(tab, event);
        } else {
          this.activeIndex = this.oldIndex;
        }
      });
    } else {
      this.onTabChange(tab, event);
    }
    }
  }

  onTabChange(tab, event) {
    this.oldIndex = event.index;
    this.data.productsList.forEach((productType) => {
      if (productType.index === event.index) {
        if (document.querySelector(FccConstants.WIDGET_CONTAINER) != null) {
          if (this.commonService.isEmptyValue(productType.tabProductTypes)) {
            (
              document.querySelector(
                FccConstants.WIDGET_CONTAINER
              ) as HTMLElement
            ).style.display = FccConstants.STYLE_NONE;
          } else {
            (
              document.querySelector(
                FccConstants.WIDGET_CONTAINER
              ) as HTMLElement
            ).style.display = FccConstants.STYLE_BLOCK;
          }
        }
      }
    });
    this.productService.onProductFormChange$.next(event);
    if (event.index === 0) {
      this.activeInnerIndex = 0;
    }
  }

  checkSingleTabChange(tab, event) {
    this.commonService.selectedTab.next(event.value[event.index]);
    if (event.index !== this.singleOldIndex) {
      let isAutoSaveValid = false;
    if (this.stateService.getAutoSaveConfig()?.isAutoSaveEnabled) {
      isAutoSaveValid = true;
      this.displayTime = true;
    } else {
      isAutoSaveValid = false;
      this.displayTime = false;
    }
   
    const isConfirmationDialogueVisible = this.commonService.isConfirmationDialogueVisible.value;

    const section = this.stateService.getSectionNames();
    if (this.dialog.openDialogs.length === 0 && isAutoSaveValid === true && isConfirmationDialogueVisible) {
      const dialogRef = this.dialog.open(ConfirmationGuardDialogComponent, {
        panelClass: 'confirmDialogClass',
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        height: '12.5em',
        width: '37.5em',
        autoFocus: false,
        disableClose: false,
        hasBackdrop: true,
        data: { isBene: isAutoSaveValid },
      });
      this.commonService.isConfirmationDialogueVisible.next(false);
      dialogRef.afterClosed().subscribe((result) => {
        if (result === "saveForLater") {
          this.eventEmitterService.autoSaveForLater.next(section[0]);
          this.activeIndex = 0;
          this.onSingleTabChange(tab, event);
        } else if (result === "cancel") {
          this.eventEmitterService.cancelTransaction.next(section[0]);
          this.activeIndex = 0;
          this.onSingleTabChange(tab, event);
        } else {
          this.activeIndex = 0;
          this.activeInnerIndex = this.singleOldIndex;
        }
      });
    } else {
      this.onSingleTabChange(tab, event);
    }
    }
  }

  onSingleTabChange(tab, event) {
    this.oldIndex = 0;
    this.singleOldIndex = event.index;
    this.productService.onInnerProductFormChange$.next(event);
  }

  onInnerTabChange(event, tabs) {
    event.value = tabs;
    this.checkSingleTabChange(tabs, event);
  }

  display(doc,flag){
    if(doc){
      if(flag){
        doc.style.display = FccConstants.STYLE_FLEX;
      }else{
        doc.style.display = FccConstants.STYLE_NONE;
      }
    }
  }

  getElementByQuerySelector(cssclass){
    return (
      document.querySelector(
        cssclass
      ) as HTMLElement
    );
  }
  ngOnDestroy() {
    this.productService.onClickView$.next(false);
    this.commonService.batchRefId.next(null);
  }
}
