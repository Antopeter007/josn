import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { TextControl, ButtonControl, SpacerControl, ImageFormControl, MatCheckboxFormControl } from '../../../base/model/form-controls.model';
import { FCCBase } from '../../../base/model/fcc-base';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionValidateService } from '../../services/session-validate-service';
import { LoginService } from '../../services/login.service';
import { PlatformLocation } from '@angular/common';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'fcc-common-terms-and-condition-details',
  templateUrl: './terms-and-condition-details.component.html',
  styleUrls: ['./terms-and-condition-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TermsAndConditionDetailsComponent }]
})
export class TermsAndConditionDetailsComponent extends FCCBase implements OnInit {
  form: FCCFormGroup;
  module = '';
  dir: string = localStorage.getItem('langDir');
  contextPath: any;
  params = FccGlobalConstant.PARAMS;
  rendered = FccGlobalConstant.RENDERED;
  styleClass = FccGlobalConstant.STYLECLASS;
  loginData: any;
  source: any;


  constructor(protected translateService: TranslateService, protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected router: Router,
              protected sessionValidation: SessionValidateService, protected loginService: LoginService,
              protected location: PlatformLocation) {
    super();
    this.loginService.preLoginBackBtnCheck(location);
  }

  ngOnInit() {
    this.loginService.checkValidSession(this.commonService.getLoginMode().get('LOGIN_MODE'));
    this.initializeFormGroup();
    this.patchFieldParameters(this.form.get('terms'), { label: this.getData() });
    this.contextPath = this.fccGlobalConstantService.contextPath;
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
      spaces1: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),
      logoImage: new ImageFormControl('logoImage', this.translateService,
        {
          layoutClass: 'p-col-12 no-mr-pd logo-img logo-grid paddingb',
          anchorNeeded: true,
          rendered: true
        }),
      spaces2: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),
      fnb: new TextControl('fnb', this.translateService, {
        label: `${this.translateService.instant('finastraBank')}`,
        key: 'fnb',
        rendered: true,
        layoutClass: 'p-col-12 inputStyle',
        styleClass: 'header1 paddingb formheader fheader'
      }),
      cnb: new TextControl('cnb', this.translateService, {
      label: `${this.translateService.instant('corporatechannels')}`,
        key: 'cnb',
        rendered: true,
        layoutClass: 'p-col-12 inputStyle ',
        styleClass: 'header1 fontweight fheader'
      }),
      spaces3: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),
      tnc: new TextControl('tnc', this.translateService, {
        label: `${this.translateService.instant('N002_90')}`,
        key: 'tnc',
        rendered: true,
        layoutClass: 'p-col-12 inputStyle',
        styleClass: 'header1 fontsize paddingb formheader fheader'
      }),
      terms: new TextControl('terms', this.translateService, {
        label: '',
        key: 'terms',
        rendered: true,
        boxClass: 'side_bar',
        styleClass: ['indented-text-area-field-35 contentfont'],
        layoutClass: 'p-col-12 inputStyle fheader'
      }),
      spaces4: new SpacerControl(this.translateService, { layoutClass: 'p-col-12', rendered: true }),
      cb: new MatCheckboxFormControl('cb', '', this.translateService, {
        key: 'cb',
        options: [{
          value: 'cb', label: `${this.translateService.instant('N002_92')}`
        }],
        layoutClass: 'p-col-12',
        styleClass: 'margin-all-side leftwrapper bkcolor size',
        rendered: true,
        disabled: true
      }),
      cancel: new ButtonControl('cancel', this.translateService, {
        label: `${this.translateService.instant('cancel')}`,
        key: 'cancel',
        rendered: true,
        layoutClass: 'p-col-9',
        styleClass: this.dir === 'rtl' ? 'tertiaryButton tncButton leftDirect' : 'tertiaryButton tncButton rightDirect'
      }),
      submit: new ButtonControl('submit', this.translateService, {
        label: `${this.translateService.instant('submit')}`,
        key: 'submit',
        btndisable: true,
        rendered: true,
        layoutClass: 'p-col-2 submitStyle',
        styleClass: this.dir === 'rtl' ? 'primaryButton tncButton leftDirect' : 'primaryButton tncButton rightDirect'
      }),
    });
  }

  getData() {
    let a = '';
    for (let i = 1;; i++) {
      if (this.commonService.getTermsAndConditionData().get(('TandCdata'))[i] === undefined) {
        break;
      } else {
        a = a + this.commonService.getTermsAndConditionData().get(('TandCdata'))[i] + '<br></br>';
      }
  }
    return a;
  }


  onClickCb() {
    this.patchFieldParameters(this.form.get('submit'), { btndisable: !this.form.get('cb').value });
    this.form.get('cb').valueChanges.subscribe(val => {
      this.patchFieldParameters(this.form.get('submit'), { btndisable: !val });
    });
  }

  onClickSubmit() {
    const data = this.commonService.getLogindata();
    this.loginData = data.get('FCC_LOGIN_DATA');
    this.loginData.mode = 'accept_terms';
    this.loginData.tandcflag = 'true';
    const language = localStorage.getItem('language');
    this.source = 'terms_and_condition';
    this.commonService.login(this.loginData, language).subscribe(
      res => {
        if (res.response === 'success') {
          if (res.mode === 'change_password' || res.mode === 'change_password_qa' ) {
            this.commonService.putLoginMode('LOGIN_MODE', res.mode);
            this.commonService.putLoginData('USER_EMAIL_ID', res.email);
            this.commonService.putLoginData('USER_PHONE', res.phone);
          }
          this.loginService.setNextComponent(res, this.source);
        } else {
          sessionStorage.removeItem('login');
          this.sessionValidation.IsSessionValid();
        }
      });
  }

  onClickCancel() {
    sessionStorage.removeItem('login');
    this.router.navigate(['/login']);
    sessionStorage.removeItem('login');
    this.sessionValidation.clearSession(true);
    window.location.reload();
  }

  onScrollTerms() {
    this.patchFieldParameters(this.form.get('cb'), { disabled: false });
  }
}

