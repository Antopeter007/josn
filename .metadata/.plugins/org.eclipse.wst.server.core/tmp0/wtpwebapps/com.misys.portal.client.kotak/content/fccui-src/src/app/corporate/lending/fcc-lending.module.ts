import { FccCommonModule } from './../../common/fcc-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FccLendingRoutes } from './fcc-lending.routes';
import { FccLnModule } from './ln/fcc-ln.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { FacilityOverviewComponent } from './common/components/ln-facility-overview/ln-facility-overview.component';
import { FacilityLoanListingComponent } from './common/components/facility-loan-listing/facility-loan-listing.component';
import { FacilityFeeListingComponent } from './common/components/facility-fee-listing/facility-fee-listing.component';
import { FacilityFeeCycleDetailComponent } from './common/components/facility-fee-cycle-detail/facility-fee-cycle-detail.component';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { LnFacilityLimitsComponent } from './common/components/ln-facility-limits/ln-facility-limits.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormResolverModule } from './../../shared/FCCform/form/form-resolver/form-resolver.module';
import { FccLnrpnModule } from './bk/fcc-lnrpn.module';
import { FccBlfpModule } from './bk/blfp/fcc-blfp.module';
import { MatTabsModule } from '@angular/material/tabs';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BillDetailsComponent } from './bl/bill-details/bill-details.component';
import { FccLncdsModule } from './se/compliance-document/fcc-lncds.module';

@NgModule({
  declarations: [
    FacilityOverviewComponent,
    FacilityLoanListingComponent,
    FacilityFeeListingComponent,
    FacilityFeeCycleDetailComponent,
    LnFacilityLimitsComponent,
    BillDetailsComponent
  ],
  imports: [
    CommonModule,
    FccLendingRoutes,
    FccLnModule,
    FccLnrpnModule,
    FccBlfpModule,
    ProgressSpinnerModule,
    MatSidenavModule,
    MatIconModule,
    FccCommonModule,
    CardModule,
    TabViewModule,
    TooltipModule,
    MatExpansionModule,
    FormResolverModule,
    MatTabsModule,
    AngularEditorModule,
    FccLncdsModule
  ]
})
export class FccLendingModule { }
