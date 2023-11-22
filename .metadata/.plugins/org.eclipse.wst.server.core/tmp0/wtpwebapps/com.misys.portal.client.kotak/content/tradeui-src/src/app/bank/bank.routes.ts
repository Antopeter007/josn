import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingFromExistingComponent } from './reporting-from-existing/reporting-from-existing.component';
import { ReportingFromPendingComponent } from './reporting-from-pending/reporting-from-pending.component';
import { BankRuInitiationComponent } from './trade/ru/initiation/components/bank-ru-initiation/bank-ru-initiation.component';

const routes: Routes = [
    {path: 'reportingFromExisting', component: ReportingFromExistingComponent},
    {path: 'createReportingPendingIU', pathMatch: 'full', component: ReportingFromPendingComponent},
    {path: 'mo/initiateFromScratch', component: BankRuInitiationComponent},
    {path: 'previewExistingTnx', component: ReportingFromExistingComponent},
    {path: 'editExistingTnx', component: ReportingFromExistingComponent},
    {path: 'previewFromPendingTnx', component: ReportingFromPendingComponent},
    {path: 'editFromPendingTnx', component: ReportingFromPendingComponent},
    {path: 'unsignedExistingTnx', component: ReportingFromExistingComponent},
    {path: 'unsignedPendingTnx', component: ReportingFromPendingComponent},
    {path: 'releaseRejectPendingTnx', component: ReportingFromPendingComponent},
    {path: 'tasksMonitoring', component: ReportingFromPendingComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class BankRouters {}
