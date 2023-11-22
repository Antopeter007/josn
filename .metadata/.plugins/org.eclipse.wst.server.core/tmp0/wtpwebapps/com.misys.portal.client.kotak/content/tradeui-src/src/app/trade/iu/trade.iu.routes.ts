import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetEntityComponent } from '../common/maintenance/set-entity/set-entity.component';
import { SetReferenceComponent } from '../common/maintenance/set-reference/set-reference.component';
import { IUAmendReleaseComponent } from './amend-release/iu-amend-release.component';
import { AmendTwoColumnViewComponent } from './amend/components/amend-two-column-view/amend-two-column-view.component';
import { IUAmendComponent } from './amend/iu-amend.component';
import { IUCommonResponseMessageComponent } from './common/components/response-message/response-message.component';
import { IUInquiryPreviewComponent } from './initiation/components/iu-inquiry-preview/iu-inquiry-preview.component';
import { IUInitiationComponent } from './initiation/iu-initiation.component';
import { IuInquiryComponent } from './inquiry/iu-inquiry.component';
import { IUMessageToBankComponent } from './message-to-bank/iu-message-to-bank.component';
import { ModifyTemplateComponent } from './template/modify-template/modify-template.component';
import { AmendCuPreviewDetailsComponent } from './amend/components/amend-cu-preview-details/amend-cu-preview-details.component';
import { ReportingFromExistingComponent } from './../../bank/reporting-from-existing/reporting-from-existing.component';

const routes: Routes = [
  {path: 'initiateFromScratch', component: IUInitiationComponent},
  {path: 'initiateFromBankTemplate', component: IUInitiationComponent},
  {path: 'previewTnx', component: IUInitiationComponent},
  {path: 'submitOrSave', component: IUCommonResponseMessageComponent},
  {path: 'editTnx', component: IUInitiationComponent},
  {path: 'copyFromIU', component: IUInitiationComponent},
  {path: 'initiateAmend', component: IUAmendComponent},
  {path: 'previewTnxAmend', component: IUAmendComponent},
  {path: 'editAmend', component: IUAmendComponent},
  {path: 'openUnsignedAmend', component: IUAmendComponent},
  {path: 'historyConsolidatedSummary', component: IuInquiryComponent},
  {path: 'claimProcessing', component: IUMessageToBankComponent},
  {path: 'cancellationRequest', component: IUMessageToBankComponent},
  {path: 'previewMsgToBank', component: IUMessageToBankComponent},
  {path: 'fromExistingMsgToBank', component: IUMessageToBankComponent},
  {path: 'editMsgToBank', component: IUMessageToBankComponent},
  {path: 'amendRelease', component: IUAmendReleaseComponent},
  {path: 'editAmendRelease', component: IUAmendReleaseComponent},
  {path: 'previewAmendRelease', component: IUAmendReleaseComponent},
  {path: 'openUnsignedAmendRelease', component: IUAmendReleaseComponent},
  {path: 'actionRequired', component: IUMessageToBankComponent},
  {path: 'previewAmendComparison', component: AmendTwoColumnViewComponent},
  {path: 'openTnxFromTemplate', component: IUInitiationComponent},
  {path: 'openModifyTemplate', component: ModifyTemplateComponent},
  {path: 'previewInquiryTnx', component: IUInquiryPreviewComponent},
  {path: 'updateEntity', component: SetEntityComponent},
  {path: 'updateCustRef', component: SetReferenceComponent},
  {path: 'openCounterUndertakingPreview', component: AmendCuPreviewDetailsComponent},
  {path: 'iu/previewExisting', pathMatch: 'full', component: ReportingFromExistingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class TradeIURouters {}
