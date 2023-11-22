import { AuthGuard } from './../../../common/guards/auth.guard';
import { FacilityOverviewComponent } from './../common/components/ln-facility-overview/ln-facility-overview.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const lnroutes: Routes = [{
  path: 'facilityOverView',
  component: FacilityOverviewComponent,
  canActivate: [AuthGuard],
  data: { title: 'facilityOverView' }
}];

@NgModule({
  imports: [RouterModule.forChild(lnroutes)],
  exports: [RouterModule ]
})
export class FccLnRoutes { }
