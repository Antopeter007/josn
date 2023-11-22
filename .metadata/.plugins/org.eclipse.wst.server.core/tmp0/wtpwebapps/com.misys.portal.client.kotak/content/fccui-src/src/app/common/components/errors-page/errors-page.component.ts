import { Component, OnInit } from '@angular/core';
import { FCCBase } from './../../../base/model/fcc-base';
import { FCCFormGroup } from './../../../base/model/fcc-control.model';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';
import { TextControl } from './../../../base/model/form-controls.model';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { Router } from '@angular/router';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'fcc-app-errors-page',
  templateUrl: './errors-page.component.html',
  styleUrls: ['./errors-page.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ErrorsPageComponent }]
})
export class ErrorsPageComponent extends FCCBase implements OnInit {
  form: FCCFormGroup;
  module = '';
  queryParmValue = '';

  constructor(protected translateService: TranslateService, protected commonService: CommonService, protected router: Router ) {
    super();
    this.commonService.preventBackButton();
   }

  ngOnInit() {
    this.initializeFormGroup();
   }
  initializeFormGroup() {
    let labelKey = ' ';
    if ( this.commonService.errorStatus !== undefined ) {
      labelKey = this.commonService.errorStatus.toString();
    }
    const labelVal = this.translateService.instant(labelKey);
    this.form = new FCCFormGroup({
      errorStatusText: new TextControl('errorStatusText', this.translateService, {
        key: 'errorStatusText',
        label: labelVal,
        rendered: false,
        styleClass: 'errorText'
        }),
    });

    if (this.commonService.errorStatus && (this.commonService.errorStatus === FccGlobalConstant.LENGTH_0 ||
      this.commonService.errorList.indexOf(this.commonService.errorStatus.toString()) > -1)
    ) {
       this.patchFieldParameters(this.form.get('errorStatusText'), { rendered: true });
    } else {
      sessionStorage.removeItem('login');
      this.router.navigate(['/login']);
    }
   }

}
