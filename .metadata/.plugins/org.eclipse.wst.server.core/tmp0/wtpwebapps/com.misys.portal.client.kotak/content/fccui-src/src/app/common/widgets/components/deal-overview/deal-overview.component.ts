import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalDashboardComponent } from './../../../../common/components/global-dashboard/global-dashboard.component';
import { FccGlobalConstant } from './../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../common/services/common.service';
import { HideShowDeleteWidgetsService } from './../../../../common/services/hide-show-delete-widgets.service';
import { LendingCommonDataService } from './../../../../corporate/lending/common/service/lending-common-data-service';
import { Amount } from './../../../../corporate/trade/lc/initiation/model/models';
import { CurrencyConverterPipe } from './../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { OPEN_CLOSE_ANIMATION } from './../../../model/animation';


@Component({
    selector: 'fcc-deal-overview',
    templateUrl: './deal-overview.component.html',
    styleUrls: ['./deal-overview.component.scss'],
    animations: [OPEN_CLOSE_ANIMATION]
})
export class DealOverviewComponent implements OnInit, OnDestroy {
    // Local Variables
    hideShowCard: boolean;
    classCheck: any;
    checkCustomize: any;
    widgets: any;
    dealDetails: any = {};
    renderSection = false;
    lendingCommonDataServiceSubscription: Subscription;
    dealsSubscription: Subscription;

    // Widget Input
    @Input()
    widgetDetails: any;
    dealId: any;
    showSpinner: boolean;

    constructor(
        protected globalDashboardComponent: GlobalDashboardComponent,
        protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
        protected commonService: CommonService,
        protected lendingCommonDataService: LendingCommonDataService,
        protected currencyConverterPipe: CurrencyConverterPipe
    ) { }

    ngOnInit(): void {
        this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
        this.showSpinner = true;
        this.fetchConfigurations();
        this.setDefaultFilterCriteria();
    }

    ngOnDestroy(): void {
        if (this.lendingCommonDataServiceSubscription) {
            this.lendingCommonDataServiceSubscription.unsubscribe();
        } if (this.dealsSubscription) {
            this.dealsSubscription.unsubscribe();
        }
    }

    setDefaultFilterCriteria() {
        this.dealsSubscription = this.commonService.dealDetailsBehaviourSubject.subscribe(filterValues => {
            if (filterValues !== null) {
              this.showSpinner = true;
              this.dealId = filterValues.reference;
              this.fetchDealsData();
            }
        });
    }
    // Method Implementations

    fetchDealsData(): void {
        if (this.dealId !== null && this.dealId !== '') {
            // Fetch data from API
            this.lendingCommonDataServiceSubscription = this.lendingCommonDataService.getDealDetails(this.dealId).pipe(
            //   pluck('body'),
              map(res => res.body),
              map((responseBody) => {
                this.showSpinner = false;
                  // Extracting all required fields
                const dealDetails = {};
                if (responseBody) {
                    dealDetails[FccGlobalConstant.TOTAL_FACILITIES] = responseBody.totalFacilities ?? 0;
                    dealDetails[FccGlobalConstant.AVAILABLE_LIMIT] = responseBody.availableLimit ?? '';
                    dealDetails[FccGlobalConstant.UTILIZED_AMOUNT] = responseBody.utilisedAmount ?? '';
                    dealDetails[FccGlobalConstant.DEAL_BALANCE_OUTSTANDING] = responseBody.balanceOutstanding ?? '';
                    dealDetails[FccGlobalConstant.DEAL_CURRENCY] = responseBody.dealCurrency ?? '';
                } else {
                    dealDetails[FccGlobalConstant.TOTAL_FACILITIES] = 0;
                    dealDetails[FccGlobalConstant.AVAILABLE_LIMIT] = '';
                    dealDetails[FccGlobalConstant.UTILIZED_AMOUNT] = '';
                    dealDetails[FccGlobalConstant.DEAL_BALANCE_OUTSTANDING] = '';
                    dealDetails[FccGlobalConstant.DEAL_CURRENCY] = '';
                }
                return dealDetails;
              })
            ).subscribe(reqDealDetails => {
                // Creating key value pair object for required fields
                const dealDetailsArray = [];
                const dealDisplayKeys: DealDisplayKeys = {
                    totalFacilities: undefined,
                    availableLimit: { amount: undefined, currency: undefined },
                    utilizedAmount: { amount: undefined, currency: undefined },
                    dealBalanceOutstanding: { amount: undefined, currency: undefined },
                };
                if (reqDealDetails) {
                    Object.keys(dealDisplayKeys).forEach((key) => {
                        const tempDealObj = {};
                        if (typeof dealDisplayKeys[key] === 'object') {
                            tempDealObj[FccGlobalConstant.FIELDTYPE] = 'amount';
                            tempDealObj[FccGlobalConstant.CURRENCY] = reqDealDetails[`dealCurrency`];
                            tempDealObj[FccGlobalConstant.KEY] = key;
                            tempDealObj[FccGlobalConstant.VALUE] = reqDealDetails[key];
                            tempDealObj[FccGlobalConstant.VALUE] = this.currencyConverterPipe.transform(
                                parseInt(reqDealDetails[key], 0) > 0 ? reqDealDetails[key] + '' : FccGlobalConstant.ZERO_STRING,
                                reqDealDetails[FccGlobalConstant.DEAL_CURRENCY]);
                        } else {
                            tempDealObj[FccGlobalConstant.KEY] = key;
                            tempDealObj[FccGlobalConstant.VALUE] = reqDealDetails[key];
                        }
                        dealDetailsArray.push(tempDealObj);
                    });
                }
                this.dealDetails[FccGlobalConstant.DETAIL] = dealDetailsArray;
                this.dealDetails = { ...this.dealDetails };
                this.renderSection = true;
            });
        }
    }

    fetchConfigurations(): void {
        this.commonService.dashboardOptionsSubject.subscribe(data => {
            this.classCheck = data;
        });

        this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
            this.checkCustomize = data;
        });
    }

    deleteCards(): void {
        this.hideShowDeleteWidgetsService.dealOverviewComp.next(true);
        this.hideShowDeleteWidgetsService.dealOverviewComp.subscribe(
            res => {
                this.hideShowCard = res;
            }
        );
        setTimeout(() => {
            this.hideShowDeleteWidgetsService.getSmallWidgetActions(this.widgets.widgetName, this.widgets.widgetPosition);
            this.globalDashboardComponent.deleteCardLayout(this.widgets.widgetName);
        }, FccGlobalConstant.DELETE_TIMER_INTERVAL);
    }
}


export interface DealDisplayKeys {
    totalFacilities: string;
    availableLimit: Amount;
    utilizedAmount: Amount;
    dealBalanceOutstanding: Amount;
}
