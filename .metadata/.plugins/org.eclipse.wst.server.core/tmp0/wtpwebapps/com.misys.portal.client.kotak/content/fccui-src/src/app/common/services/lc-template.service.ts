import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { LcTemplateConfirmationComponent } from '../components/lc-template-confirmation/lc-template-confirmation.component';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LcTemplateService {

  constructor(protected dialogService: DialogService, public fccGlobalConstantService: FccGlobalConstantService,
              protected translateService: TranslateService, protected http: HttpClient) { }

  getConfirmaton() {
    this.dialogService.open(LcTemplateConfirmationComponent, {
      header: `${this.translateService.instant('confirmation')}`,
      contentStyle: {
        overflow: 'auto',
        backgroundColor: '#fff'
      },
      styleClass: 'reauthClass',
      showHeader: true,
      baseZIndex: 9999,
      autoZIndex: true,
      dismissableMask: false,
      closeOnEscape: true
    });
  }

  isTemplateNameExists(templateId: string, productCode: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const body = {
      productCode,
      templateId
    };
    return this.http.post<any>(this.fccGlobalConstantService.valiateTemplateId, body, { headers, observe: 'response' });
  }
}
