import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  ViewChild,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import {
  IDataEmittterModel,
  IUpdateFccBase,
} from '../../form-control-resolver/form-control-resolver.model';
import { FCCBase } from '../../../../../base/model/fcc-base';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { CommonService } from '../../../../../common/services/common.service';
import { AccountsSummaryService } from '../../../../../common/services/accounts-summary.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { ProductParams } from '../../../../../common/model/params-model';
import { FCCFormGroup, FCCMVFormControl } from '../../../../../base/model/fcc-control.model';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyConverterPipe } from '../../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { Carousel } from 'primeng';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-carousel-view',
  templateUrl: './carousel-view.component.html',
  styleUrls: ['./carousel-view.component.scss']
})

export class CarouselViewComponent extends FCCBase
implements OnInit, IUpdateFccBase, AfterViewChecked, OnDestroy{
  @Input() control!: FCCMVFormControl;
  @Input() form!: FCCFormGroup;
  @Input() mode!: string;
  @Input() hostComponentData!: any | null;
  carouselList = [];
  allCarouselItems = [];
  numVisible = FccGlobalConstant.LENGTH_4;
  numScroll = FccGlobalConstant.LENGTH_4;
  category = '';
  amtBalanceFilterValues = '';
  filterValues: any = {};
  entityName = '';
  currCode = '';
  accountsSummaryData: any[] = [];
  viewInCurrency = '';
  currencySymbol = '';
  accountCCY = '';
  categoriesList: any[] = [];
  currencyType: any;
  listdefName: any;
  filterFlag = false;
  externalCategoryObj={};
  dir = localStorage.getItem('langDir');
  gradientPath = '';
  whitePath = '';
  FUCHSIA = '#c137a2';
  VIOLET = '#694ed6';
  totalCardsLoaded = 0;
  carouselCardItems = [];
  productModel$: Subscription;
  hideShowAccountTable$: Subscription;
  noOfTablesLoaded$: Subscription;
  carouselscrollIndex$: Subscription;
  refreshAccountSummaryCarousel$: Subscription;
  accountsList: any;
  @ViewChild('carousel') carousel: Carousel;

  constructor(
    protected commonService: CommonService,
    protected accountsSummaryService: AccountsSummaryService,
    protected translateService: TranslateService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected currencyConverterPipe: CurrencyConverterPipe
  ) {
    super();
  }
  controlDataEmitter: EventEmitter<IDataEmittterModel>;
  ngOnInit(): void {
    this.gradientPath = 'url('+`${this.fccGlobalConstantService.contextPath}/content/FCCUI/assets/images/gradient-card-pattern@1x.png`+
    ')' + `, linear-gradient(to bottom, ${this.VIOLET}, ${this.FUCHSIA})`;
    this.whitePath = 'url('+`${this.fccGlobalConstantService.contextPath}/content/FCCUI/assets/images/white-card-pattern@1x.png`+')';
    this.viewInCurrency = this.commonService.getBaseCurrency();
    this.currencySymbol = this.commonService.getCurrSymbol(this.viewInCurrency);
    this.commonService.getAccountList$.subscribe((val) => {
      this.accountsList = val;
    });
    this.getCategories();
    this.hideShowAccountTable$ = this.commonService.hideShowAccountTable.subscribe((value) => {
      if (value.name) {
        this.noOfTablesLoaded$ = this.commonService.noOfTablesLoaded.subscribe((val) => {
          if(val) {
            this.totalCardsLoaded = val;
            this.carouselCardItems = this.carouselCardItems.filter((ele) => ele.name !== value.name);
            this.carouselCardItems.push(value);
            this.carouselCardItems = this.carouselCardItems.filter((v,i,a)=>(
            a.findIndex(v2=>['name','value'].every(k=>v2[k] ===v[k]))===i));
            
            if (this.carouselCardItems.length === this.totalCardsLoaded) {
              let tempList = [];
              this.carouselList = [];
              const appliedFilter = this.commonService.getAccountSummaryFilter();
              const filterValues = { "masking": false };
              Object.keys(appliedFilter).forEach(filter => {
                if (filter === FccGlobalConstant.ACCOUNT_CURRENCY){
                  if(appliedFilter[filter] !== ''){
                    this.viewInCurrency = appliedFilter[filter];
                    filterValues[FccGlobalConstant.ACCOUNT_CURRENCY] = appliedFilter[filter];
                  } else {
                    this.viewInCurrency = this.commonService.getBaseCurrency();
                    filterValues[FccGlobalConstant.ACCOUNT_CURRENCY] = this.viewInCurrency;
                  }
                } else {
                  filterValues[filter] = appliedFilter[filter];
                }
              });
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              this.accountsList.forEach((item, index) => {
                this.carouselCardItems.forEach((key) => {
                  if(item === key.name) {
                    const acc = {
                      category: item,
                      selected: false,
                      amount: this.commonService.getCurrencySymbolForDownloads(this.viewInCurrency,
                                    this.currencyConverterPipe.transform(
                                    this.commonService.replaceCurrency(key.value),
                                    this.viewInCurrency))
                    };
                    tempList.push(acc);
                  }
                });
              });
              tempList = tempList.map((val, index) => (
                {
                  ...val,
                  index
                }
              ));
              this.carouselList = tempList;
              if(this.carouselList.length){
                this.carouselList[0].selected = true;
              }
              this.carouselCardItems = [];
            }
          }
        });
      }
    });

    this.carouselscrollIndex$ = this.commonService.carouselscrollIndex.subscribe((value) => {
      if (this.carouselList.length) {
        this.carouselList.forEach((element) => {
          element.selected = false;
        });
        this.carouselList[value].selected = true;
      }
      if(this.carousel && value > FccGlobalConstant.LENGTH_3) {
        const node: any = Array.from(document.getElementsByClassName('ui-carousel-next'))[0];
        node.click();
      }
      if(this.carousel && value === FccGlobalConstant.LENGTH_3 && this.carousel._page > FccGlobalConstant.LENGTH_0) {
        const node: any = Array.from(document.getElementsByClassName('ui-carousel-prev'))[0];
        node.click();
      }
    });
    this.listdefName =this.control.params.listdefName;


    this.refreshAccountSummaryCarousel$ = this.commonService.refreshAccountSummaryCarousel.subscribe((value) => {
      if (value) {
        this.filterFlag = true;
        this.getCategories();
        this.commonService.refreshAccountSummaryCarousel.next(false);
      }
    });

  }

  ngAfterViewChecked(): void {
    this.addAccessibilityControls();
  }

  public getCategories() {
    const params: ProductParams = {
      productCode: 'AS',
      type: FccGlobalConstant.MODEL_FORM
    };
    this.productModel$ = this.commonService.getProductModel(params).subscribe(
      response => {
        this.category = response;
      });
  }

  addAccessibilityControls(): void {
    const uiCarouselPrev = Array.from(document.getElementsByClassName('ui-carousel-prev'));
    const uiCarouselNext = Array.from(document.getElementsByClassName('ui-carousel-next'));
    const dotContainer = Array.from(document.getElementsByClassName('ui-carousel-dots-container'));
    uiCarouselPrev.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("prevSlide");
      element[FccGlobalConstant.TITLE] = this.translateService.instant("prevSlide");
    });

    uiCarouselNext.forEach(element => {
      element[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("nextSlide");
      element[FccGlobalConstant.TITLE] = this.translateService.instant("nextSlide");
    });

    if(dotContainer.length) {
      dotContainer[0].childNodes.forEach((item, i) => {
        if(item[FccGlobalConstant.LOCAL_NAME] === 'li') {
          if(item.childNodes.length) {
            item.childNodes.forEach((button) => {
              button[FccGlobalConstant.ARIA_LABEL] = this.translateService.instant("carouselSlider", { index: i + 1 });
              button[FccGlobalConstant.TITLE] = this.translateService.instant("carouselSlider", { index: i + 1 });
            });
          }
        }
      });
    }
  }

  onClickCarousel(value) {
    this.commonService.carouselIndex.next(value.index);
    this.carouselList.forEach((element) => {
      element.selected = false;
    });
    this.carouselList[value.index].selected = true;
  }

  ngOnDestroy(): void {
      this.productModel$.unsubscribe();
      this.noOfTablesLoaded$.unsubscribe();
      this.carouselscrollIndex$.unsubscribe();
      this.hideShowAccountTable$.unsubscribe();
      this.refreshAccountSummaryCarousel$.unsubscribe();
  }
}
