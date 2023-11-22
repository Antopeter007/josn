
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const lcroutes: Routes = [
  // {
  //   path: 'LC', component: LCTabSectionComponent,
  //       children: [
  //     { path: 'generalDetails', component: GeneralDetailsComponent },
  //     { path: 'applicationBeneficiaryDetails', component: ApplicantBeneficiaryComponent },
  //     { path: 'bankDetails', component: FccBankDetailsComponent },
  //     { path: 'amountChargeDetails', component: AmountChargeDetailsComponent },
  //     { path: 'narrativeDetails', component: NarrativeDetailsComponent },
  //     { path: 'instructionsToBank', component: InstructionsToBankComponent },
  //     { path: 'shipmentDetails', component: ShipmentdetailsComponent },
  //     { path: 'paymentDetails', component : PaymentDetailsComponent},
  //     { path: 'summaryDetails', component: SummaryDetailsComponent},
  //     { path: 'fileUploadDetails', component : FileUploadDetailsComponent}
  //   ],
  //   canActivate: [AuthGuard]
  // }
];

@NgModule({
    imports: [RouterModule.forChild(lcroutes)],
    exports: [RouterModule ]
  })
export class FccLcRoutes { }
