import { FccCommonModule } from '../../common/fcc-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { MatExpansionModule } from '@angular/material/expansion';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MatTabsModule } from '@angular/material/tabs';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormResolverModule } from '../../shared/FCCform/form/form-resolver/form-resolver.module';
import { BeneficiaryMaintenanceModule } from './beneficiary-maintenance/beneficiary-maintenance.module';
import { FCMBeneficiaryMaintenanceModule } from './fcm-beneficiary-maintenance/fcm-beneficiary-maintenance.module';
import { FccSystemFeatureRoutes } from './fcc-system-feature.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BeneficiaryMaintenanceModule,
    FccSystemFeatureRoutes,
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
    FCMBeneficiaryMaintenanceModule
  ]
})
export class FccSystemFeatureModule { }
