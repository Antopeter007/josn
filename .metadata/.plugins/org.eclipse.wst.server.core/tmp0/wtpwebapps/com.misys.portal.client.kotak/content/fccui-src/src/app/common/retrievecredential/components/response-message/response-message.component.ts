import { RetrieveCredentialsService } from './../../services/retrieve-credentials.service';
import { FCCBase } from './../../../../base/model/fcc-base';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { CommonService } from './../../../services/common.service';
import { TextControl, ButtonControl, ImageFormControl } from './../../../../base/model/form-controls.model';
import { FCCFormGroup } from './../../../../base/model/fcc-control.model';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'fcc-response-message',
  templateUrl: './response-message.component.html',
  styleUrls: ['./response-message.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: ResponseMessageComponent }]
})
export class ResponseMessageComponent extends FCCBase implements OnInit {

  form: FCCFormGroup;
  module = '';
  queryParmValue = '';
  dir: string = localStorage.getItem('langDir');
  logoFilePath: string;
  loginImageFilePath: string;
  contextPath: any;
  captchaResponse = '';
  statusMessages = new Map();
  headerMessageIcon: string;
  headerMessage: string;
  responseMsg: string;

  constructor(protected translateService: TranslateService, protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected router: Router,
              protected retrieveCredentialsService: RetrieveCredentialsService) {
    super();
    if ('grecaptcha' in window) {
      delete window.grecaptcha;
    }
    this.headerMessageIcon = this.retrieveCredentialsService.getResponseHeader() === 'success' ?
    '<i class="pi pi-check"></i>' : '<i class="pi pi-times"></i>';

    this.headerMessage = this.translateService.instant(this.retrieveCredentialsService.getResponseHeader());
    this.responseMsg = this.translateService.instant(this.retrieveCredentialsService.getResponseMessage());
   }

  ngOnInit() {
    this.Config();
    this.initializeFormGroup();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.patchFieldParameters(this.form.get('logoImage'), { path: this.contextPath + response.logoFilePath });
        this.patchFieldParameters(this.form.get('logoImage'), { homeUrl: response.homeUrl });
        this.patchFieldParameters(this.form.get('logoImage'), { altText: this.translateService.instant('FinastraLoginImage') });
      }
    });
   }
  initializeFormGroup() {

    this.form = new FCCFormGroup({
      logoImage: new ImageFormControl('logoImage', this.translateService,
      {
        layoutClass: 'p-col-12 no-mr-pd logo-img logo-grid paddingb',
        anchorNeeded: true,
        rendered: true
      }),
      responseMessageHeader: new TextControl('responseMessageHeader', this.translateService, {
        label: `<div>${this.headerMessageIcon}</div><div>${this.headerMessage}</div>`,
        rendered: true,
        styleClass: ['p-col-12'],
        layoutClass: 'p-col-12 responseMessageHeader'
      }),
      responseMessage: new TextControl('responseMessage', this.translateService, {
        label: `<div>${this.responseMsg}</div>`,
        rendered: true,
        styleClass: ['p-col-12'],
        layoutClass: 'p-col-12 responseMessage'
      }),
      redirectToLogin: new ButtonControl('redirectToLogin', this.translateService, {
        key: 'redirectToLogin',
        label: `${this.translateService.instant('login')}`,
        rendered: true,
        btndisable: false,
        layoutClass: 'p-col-12 responseMessageButton',
        styleClass: 'p-col-12 primaryButton'
      })
    });
    this.form.setFormMode('edit');
   }

  Config() {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.logoFilePath = this.contextPath + response.logoFilePath;
        this.loginImageFilePath =
          this.contextPath + response.loginImageFilePath;
      }
    });
  }

  onClickRedirectToLogin() {
    window[FccGlobalConstant.firstLogin] = false;
    this.router.navigateByUrl('/login');
  }
}
