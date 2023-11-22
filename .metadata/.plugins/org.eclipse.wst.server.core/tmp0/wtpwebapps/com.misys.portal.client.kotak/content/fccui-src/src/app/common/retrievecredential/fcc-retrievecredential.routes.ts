import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RetrieveCredentialsMasterComponent } from './components/retrieve-credentials-master/retrieve-credentials-master.component';
import { ResponseMessageMasterComponent } from './components/response-message-master/response-message-master.component';

const routes: Routes = [
  {
    path: 'retrieve',
    component: RetrieveCredentialsMasterComponent,
    data: { title: 'retrieve' }
  },
  {
    path: 'submitResponse',
    component: ResponseMessageMasterComponent,
    data: { title: 'submitresponse' }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FccRetrieveCredentialsRoutes { }
